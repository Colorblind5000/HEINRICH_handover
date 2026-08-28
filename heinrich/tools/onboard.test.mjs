#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  applyConfigure,
  gitDisconnect,
  gitInit,
  gitRemote,
  gitStatus,
  loadManifest,
  parseProfileYaml,
  planConfigure,
  redactRemote,
  serializeProfile,
  validateGitIdentity,
  validateProfile,
  validateRemote,
  verifyGenerated,
} from './onboard.mjs';

const KIT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
let failures = 0;

function check(name, condition, detail = '') {
  if (condition) return;
  failures++;
  console.error(`FAIL: ${name}`);
  if (detail) console.error(`      ${detail}`);
}

function git(args, root) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', shell: false });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout).trim());
}

function expectFailure(name, fn, pattern) {
  try {
    fn();
    check(name, false, 'forventede en fejl');
  } catch (error) {
    check(name, pattern.test(error.message), error.message);
  }
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'heinrich-onboard-'));
  cpSync(KIT_ROOT, root, {
    recursive: true,
    filter(source) {
      const rel = relative(KIT_ROOT, source);
      return rel !== '.git' && !rel.startsWith(`.git${sep}`);
    },
  });
  for (const rel of ['setup/profile.yaml', 'setup/.generated.json']) {
    rmSync(join(root, ...rel.split('/')), { force: true });
  }
  const manifest = loadManifest(root);
  for (const target of manifest.targets) rmSync(join(root, ...target.output.split('/')), { force: true });
  return root;
}

function profile() {
  return {
    user_name: 'Alex',
    assistant_name: 'Atlas',
    archetype: 'Skarp minimalist',
    archetype_traits: 'Kortfattet, rolig og konkret.',
    namesake_note: '',
    strategic_lens: 'Prioritér afslutning og tydeligt ejerskab.',
    push_back_stance: 'evidensbaseret',
    privacy_scope: 'work-only',
    privacy_boundaries: 'Brug kun arbejdsrelateret materiale. Stop ved blandet indhold.',
    language: 'Dansk',
    timezone: 'Europe/Copenhagen',
    working_week: 'mandag–fredag',
    date_format: 'YYYY-MM-DD',
  };
}

// Begge harness skal læse samme flow og profilkontrakt. Adapterne må ikke
// udvikle parallelle prosakilder, og alle gate-ejende filer skal beskyttes.
{
  const sharedRel = 'heinrich/agent_brain/understanding/playbooks/onboard.md';
  const shared = readFileSync(join(KIT_ROOT, ...sharedRel.split('/')), 'utf8');
  const codex = readFileSync(join(KIT_ROOT, '.agents', 'skills', 'onboard', 'SKILL.md'), 'utf8');
  const claude = readFileSync(join(KIT_ROOT, '.claude', 'skills', 'onboard', 'SKILL.md'), 'utf8');
  const legacy = readFileSync(join(KIT_ROOT, '.agents', 'skills', 'onboard', 'references', 'profile-presets.md'), 'utf8');
  const protectedConfig = JSON.parse(readFileSync(join(KIT_ROOT, 'heinrich', 'config', 'protected-paths.json'), 'utf8'));
  const protectedPaths = new Set(protectedConfig.tier1.map((entry) => entry.path));

  check('Codex-adapter læser fælles onboarding', codex.includes(sharedRel));
  check('Claude-adapter læser fælles onboarding', claude.includes(sharedRel));
  check('onboard-adaptere er tynde',
    !/## (First-run flow|Førstegangsflow)/.test(codex) && !/## (First-run flow|Førstegangsflow)/.test(claude));
  check('adaptere har ingen forældet Codex-only tekst',
    !/currently Codex-specific|Codex-specifik/.test(`${codex}\n${claude}`));

  for (const choice of ['A — Skarp minimalist', 'B — Rolig rådgiver', 'C — Hård sparringspartner']) {
    const owners = [shared, codex, claude, legacy].filter((text) => text.includes(choice));
    check(`profilvalg har én kanonisk ejer: ${choice}`, owners.length === 1 && shared.includes(choice),
      `forekomster=${owners.length}`);
  }
  check('legacy-reference er kun en pointer', legacy.includes(sharedRel) && !legacy.includes('archetype_traits'));

  for (const path of [sharedRel, '.agents/skills/onboard/SKILL.md', '.claude/skills/onboard/SKILL.md']) {
    check(`onboarding-gate er beskyttet: ${path}`, protectedPaths.has(path));
  }
}

// Preview er read-only, apply renderer alle targets, og re-run er idempotent.
{
  const root = fixture();
  const manifest = loadManifest(root);
  const plan = planConfigure(root, profile());
  check('preview finder ingen konflikter', plan.conflicts.length === 0);
  check('preview skriver ikke profile.yaml', !existsSync(join(root, 'setup', 'profile.yaml')));
  check('preview navngiver profil + state + alle targets', plan.changes.length === manifest.targets.length + 2,
    `ændringer=${plan.changes.length}, targets=${manifest.targets.length}`);

  const applied = applyConfigure(plan);
  check('apply skriver alle planlagte filer', applied.written.length === manifest.targets.length + 2,
    `skrevet=${applied.written.length}`);
  check('genereret setup verificeres', verifyGenerated(root, false).pass === true);

  const stored = parseProfileYaml(manifest, readFileSync(join(root, 'setup', 'profile.yaml'), 'utf8'));
  check('profil round-tripper', JSON.stringify(stored) === JSON.stringify(profile()));
  check('profilserialisering er deterministisk', serializeProfile(manifest, stored) === readFileSync(join(root, 'setup', 'profile.yaml'), 'utf8'));

  const rerun = planConfigure(root, profile());
  check('re-run har ingen ændringer', rerun.changes.length === 0, JSON.stringify(rerun.changes));
  check('re-run har ingen konflikter', rerun.conflicts.length === 0);

  const protectedOutput = join(root, 'heinrich', '.Codex', 'constitution', 'identity.md');
  writeFileSync(protectedOutput, `${readFileSync(protectedOutput, 'utf8')}\nHåndrettet.\n`, 'utf8');
  const conflict = planConfigure(root, { ...profile(), assistant_name: 'Nova' });
  check('håndredigeret target stopper re-run', conflict.conflicts.some((x) => x.path.endsWith('/identity.md')));
  rmSync(root, { recursive: true, force: true });
}

// Profilvalidering stopper YAML-/template-injektion og ukendte felter.
{
  const root = fixture();
  const manifest = loadManifest(root);
  expectFailure('linjeskift afvises', () => validateProfile(manifest, { ...profile(), user_name: 'Alex\nowner: root' }), /kontroltegn/);
  expectFailure('template-token afvises', () => validateProfile(manifest, { ...profile(), assistant_name: '{{USER_NAME}}' }), /template-tokens/);
  expectFailure('ukendt felt afvises', () => validateProfile(manifest, { ...profile(), shell_command: 'do it' }), /Ukendte profilfelter/);
  expectFailure('ugyldig timezone afvises', () => validateProfile(manifest, { ...profile(), timezone: 'Mars/Olympus' }), /IANA/);
  rmSync(root, { recursive: true, force: true });
}

// Git-input valideres før det kan nå spawn-argumenterne.
{
  const root = fixture();
  const manifest = loadManifest(root);
  expectFailure('credential i HTTPS afvises', () => validateRemote('https://token@github.com/org/repo.git', manifest), /Credentials/);
  expectFailure('template-remote afvises', () => validateRemote('https://github.com/Colorblind5000/HEINRICH_handover.git', manifest), /templaten/);
  expectFailure('ugyldig Git-email afvises', () => validateGitIdentity('Alex', 'Alex <alex@example.com>'), /ugyldig/);
  check('Git-identitet normaliseres', validateGitIdentity(' Alex ', 'alex@example.com').name === 'Alex');
  check('SSH remote accepteres', validateRemote('git@github.com:example/private-repo.git', manifest).startsWith('git@'));
  check('remote redakteres', !redactRemote('https://user:secret@example.com/repo.git').includes('secret'));
  check('status uden repo er read-only', gitStatus(root, manifest).repo === false);
  rmSync(root, { recursive: true, force: true });
}

// Førstegangsvalget gemmer brugerens origin eller fjerner alle eksterne remotes.
{
  const root = fixture();
  const manifest = loadManifest(root);
  check('git-init opretter lokalt repo', gitInit(root, true).changed === true);
  const ownRemote = 'https://github.com/example/private-heinrich.git';
  check('ny origin gemmes', gitRemote(root, ownRemote, true).changed === true);
  let status = gitStatus(root, manifest);
  check('gemt origin rapporteres', status.origins.includes(ownRemote));

  git(['remote', 'add', 'review', 'https://github.com/example/review.git'], root);
  const preview = gitDisconnect(root, false);
  check('disconnect-preview er read-only', preview.changed === false && gitStatus(root, manifest).remotes.length === 2);
  const disconnected = gitDisconnect(root, true);
  status = gitStatus(root, manifest);
  check('disconnect fjerner alle remotes', disconnected.changed === true && status.remotes.length === 0 && status.origins.length === 0);
  rmSync(root, { recursive: true, force: true });
}

if (failures) {
  console.error(`\nonboard.test.mjs FAIL: ${failures} fejl.`);
  process.exit(1);
}
console.log('onboard.test.mjs PASS: fælles adapterkilde, preview/apply, idempotens, konfliktstop, profilvalidering og Git-gates.');
