#!/usr/bin/env node
/**
 * Tests for hook-adfærden. Kører mod syntetiske fixtures i en midlertidig
 * mappe — aldrig mod det rigtige repo.
 *
 *   node heinrich/tools/hooks.test.mjs
 */

import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const TOOL_DIR = dirname(fileURLToPath(import.meta.url));
const HOOK = join(TOOL_DIR, 'hooks', 'protect-paths.mjs');
const HOOK_LIB = join(TOOL_DIR, 'hooks', 'lib.mjs');
const CODEX_CONFIG = join(TOOL_DIR, '..', '..', '.codex', 'hooks.json');

let failures = 0;
function check(name, condition, detail) {
  if (condition) return;
  failures++;
  console.error(`FAIL: ${name}`);
  if (detail !== undefined) console.error(`      ${detail}`);
}

/** Byg et minimalt repo med sentinel og en beskyttet fil. */
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'heinrich-hooktest-'));
  mkdirSync(join(root, 'heinrich', 'agent_brain'), { recursive: true });
  mkdirSync(join(root, 'heinrich', 'config'), { recursive: true });
  mkdirSync(join(root, 'heinrich', 'tools', 'hooks'), { recursive: true });
  mkdirSync(join(root, 'sat', '.claude'), { recursive: true });
  writeFileSync(join(root, 'CLAUDE.md'), '# root\n');
  writeFileSync(join(root, 'sat', '.claude', 'CLAUDE.md'), '# satellit\n');
  writeFileSync(
    join(root, 'heinrich', 'config', 'protected-paths.json'),
    JSON.stringify({ tier1: [{ path: 'CLAUDE.md', reason: 'test' }] }, null, 2)
  );
  copyFileSync(HOOK, join(root, 'heinrich', 'tools', 'hooks', 'protect-paths.mjs'));
  copyFileSync(HOOK_LIB, join(root, 'heinrich', 'tools', 'hooks', 'lib.mjs'));
  return root;
}

/** Kør hooken med en vilkårlig payload og returnér exit-koden. */
function runPayload(payload, cwd) {
  const res = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: cwd },
  });
  return res.status;
}

/** Claude-format: eksplicit file_path. */
function run(root, tool, file, cwd = root) {
  return runPayload({ tool_name: tool, tool_input: { file_path: file }, cwd }, cwd);
}

/** Codex-format: målfilerne står inde i patchteksten. */
function runPatch(root, patchBody, cwd = root) {
  return runPayload(
    { tool_name: 'apply_patch', tool_input: { command: patchBody }, cwd },
    cwd
  );
}

/** Kør den præcise launcher fra .codex/hooks.json, inkl. shell-laget. */
function runCodexLauncher(patchBody, cwd) {
  const config = JSON.parse(readFileSync(CODEX_CONFIG, 'utf8'));
  const hook = config.hooks.PreToolUse[0].hooks[0];
  const command = process.platform === 'win32' ? hook.commandWindows : hook.command;
  const res = spawnSync(command, {
    shell: true,
    cwd,
    input: JSON.stringify({
      tool_name: 'apply_patch',
      tool_input: { command: patchBody },
      cwd,
    }),
    encoding: 'utf8',
  });
  return { status: res.status, stderr: res.stderr };
}

// --- beskyttet fil blokeres ------------------------------------------------
{
  const root = fixture();
  check('beskyttet fil blokeres', run(root, 'Write', join(root, 'CLAUDE.md')) === 2);
  rmSync(root, { recursive: true, force: true });
}

// --- ubeskyttet fil slipper igennem ----------------------------------------
{
  const root = fixture();
  check('ubeskyttet fil slipper igennem',
    run(root, 'Write', join(root, 'heinrich', 'agent_brain', 'noget.md')) === 0);
  rmSync(root, { recursive: true, force: true });
}

// --- ingen suffix-matchning ------------------------------------------------
// Regressionstest. Den tidligere shell-hook matchede på suffix, så enhver sti
// der ENDTE på CLAUDE.md blev spærret — også en satellits egen fil og enhver
// arbejdskopi. Det gjorde spærringen utroværdig og fristede til at omgå den.
{
  const root = fixture();
  check('satellittens egen CLAUDE.md spærres ikke',
    run(root, 'Write', join(root, 'sat', '.claude', 'CLAUDE.md')) === 0,
    'suffix-matchning er genindført');
  rmSync(root, { recursive: true, force: true });
}

// --- Codex apply_patch spærres --------------------------------------------
// Regressionstest. Den første udgave læste kun tool_input.file_path, så hele
// Codex' skrivevej gik uden om spærringen — mens testsuiten var grøn, fordi den
// kun afprøvede Claude-formatet. En grøn suite der ikke dækker den vigtigste
// brugersti er falsk tryghed, ikke bevis.
{
  const root = fixture();
  const patch = '*** Begin Patch\n*** Update File: CLAUDE.md\n@@\n-gammel\n+ny\n*** End Patch';
  check('apply_patch mod beskyttet fil spærres', runPatch(root, patch) === 2,
    'Codex-formatet omgår spærringen');
  rmSync(root, { recursive: true, force: true });
}

// --- den fulde Codex-launcher bevarer blok-exitkoden ----------------------
// Direkte Node-tests kan være grønne, mens et ekstra PowerShell-/shell-lag
// taber exitkode 2. Test derfor den konfigurerede kommando ordret fra både rod
// og undermappe — det er den faktiske brugersti.
{
  const root = fixture();
  const patch = '*** Begin Patch\n*** Update File: CLAUDE.md\n*** End Patch';
  for (const cwd of [root, join(root, 'heinrich', 'agent_brain')]) {
    const result = runCodexLauncher(patch, cwd);
    check('fuld Codex-launcher bevarer exitkode 2', result.status === 2,
      `cwd=${cwd}; exit=${result.status}; stderr=${result.stderr}`);
  }
  rmSync(root, { recursive: true, force: true });
}

// --- apply_patch mod ubeskyttet fil slipper igennem ------------------------
{
  const root = fixture();
  const patch = '*** Begin Patch\n*** Update File: sat/.claude/CLAUDE.md\n*** End Patch';
  check('apply_patch mod ubeskyttet fil slipper igennem', runPatch(root, patch) === 0);
  rmSync(root, { recursive: true, force: true });
}

// --- multi-file patch: én beskyttet fil er nok -----------------------------
{
  const root = fixture();
  const patch = [
    '*** Begin Patch',
    '*** Update File: sat/.claude/CLAUDE.md',
    '*** Add File: noget-nyt.md',
    '*** Update File: CLAUDE.md',
    '*** End Patch',
  ].join('\n');
  check('multi-file patch spærres når ét mål er beskyttet', runPatch(root, patch) === 2,
    'kun første målfil kontrolleres');
  rmSync(root, { recursive: true, force: true });
}

// --- patchens øvrige verber dækkes ----------------------------------------
{
  const root = fixture();
  for (const verb of ['Add File', 'Delete File', 'Move to']) {
    const patch = `*** Begin Patch\n*** ${verb}: CLAUDE.md\n*** End Patch`;
    check(`apply_patch "${verb}" spærres`, runPatch(root, patch) === 2);
  }
  rmSync(root, { recursive: true, force: true });
}

// --- multi-file patch kræver godkendelse af ALLE ramte filer ---------------
{
  const root = fixture();
  writeFileSync(
    join(root, 'heinrich', 'config', 'protected-paths.json'),
    JSON.stringify({ tier1: [
      { path: 'CLAUDE.md', reason: 'test' },
      { path: 'AGENTS.md', reason: 'test' },
    ] }, null, 2)
  );
  writeFileSync(join(root, 'AGENTS.md'), '# root\n');
  const override = join(root, '.protected-override');
  writeFileSync(override, 'CLAUDE.md\n');

  const patch = '*** Begin Patch\n*** Update File: CLAUDE.md\n*** Update File: AGENTS.md\n*** End Patch';
  check('halv godkendelse spærrer stadig', runPatch(root, patch) === 2,
    'patch slap igennem på delvis godkendelse');
  check('afvist patch forbruger ikke override', existsSync(override));
  rmSync(root, { recursive: true, force: true });
}

// --- hook-koden beskytter sig selv ----------------------------------------
{
  const root = fixture();
  writeFileSync(
    join(root, 'heinrich', 'config', 'protected-paths.json'),
    JSON.stringify({ tier1: [
      { path: 'heinrich/tools/hooks/protect-paths.mjs', reason: 'spærringen selv' },
    ] }, null, 2)
  );
  const patch = '*** Begin Patch\n*** Update File: heinrich/tools/hooks/protect-paths.mjs\n*** End Patch';
  check('spærringens egen kode er beskyttet', runPatch(root, patch) === 2);
  rmSync(root, { recursive: true, force: true });
}

// --- læsning rører vi ikke -------------------------------------------------
{
  const root = fixture();
  check('læseværktøj ignoreres', run(root, 'Read', join(root, 'CLAUDE.md')) === 0);
  rmSync(root, { recursive: true, force: true });
}

// --- override forbruges én gang --------------------------------------------
{
  const root = fixture();
  const override = join(root, '.protected-override');
  writeFileSync(override, 'CLAUDE.md\n');

  check('override giver fri', run(root, 'Write', join(root, 'CLAUDE.md')) === 0);
  check('override fjernes efter brug', !existsSync(override),
    existsSync(override) ? readFileSync(override, 'utf8') : '');
  check('override virker kun én gang', run(root, 'Write', join(root, 'CLAUDE.md')) === 2);
  rmSync(root, { recursive: true, force: true });
}

// --- override bevarer øvrige linjer ----------------------------------------
{
  const root = fixture();
  const override = join(root, '.protected-override');
  writeFileSync(override, 'CLAUDE.md\nen-anden-fil.md\n');

  run(root, 'Write', join(root, 'CLAUDE.md'));
  const rest = existsSync(override) ? readFileSync(override, 'utf8') : '';
  check('fremmede override-linjer bevares', rest.includes('en-anden-fil.md'), rest);
  rmSync(root, { recursive: true, force: true });
}

// --- roden findes fra en undermappe ----------------------------------------
// Sessionen kan være åbnet i heinrich/ eller i en satellit. Spærringen skal
// gælde alligevel.
{
  const root = fixture();
  check('rod findes fra undermappe',
    run(root, 'Write', join(root, 'CLAUDE.md'), join(root, 'heinrich')) === 2);
  rmSync(root, { recursive: true, force: true });
}

// --- uden for et repo giver hooken fri -------------------------------------
{
  const outside = mkdtempSync(join(tmpdir(), 'heinrich-outside-'));
  check('uden for repo: giv fri',
    run(outside, 'Write', join(outside, 'CLAUDE.md'), outside) === 0);
  rmSync(outside, { recursive: true, force: true });
}

// --- ugyldigt input må ikke blokere ----------------------------------------
{
  const res = spawnSync(process.execPath, [HOOK], { input: 'ikke json', encoding: 'utf8' });
  check('ugyldigt input giver fri', res.status === 0, `exit ${res.status}`);
}

if (failures) {
  console.error(`\nhooks.test.mjs FAIL: ${failures} fejl.`);
  process.exit(1);
}
console.log('hooks.test.mjs PASS: direkte hook + fuld Codex-launcher, suffix-regression, one-shot override, rodopløsning og fejltolerance.');
