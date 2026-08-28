#!/usr/bin/env node

import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOL_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(TOOL_DIR, '..', '..');
const TOKEN_RE = /\{\{[A-Z0-9_]+\}\}/g;
const GENERATED_BASENAMES = new Set([
  'identity.md',
  'conversation-style.md',
  'guide.md',
  'config.yaml',
  'communications.md',
  'training-wheels.md',
  'writing.md',
]);

function hash(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

function normalizeRel(value) {
  return String(value).replaceAll('\\', '/').replace(/^\.\//, '');
}

function insideRoot(root, relPath) {
  const rel = normalizeRel(relPath);
  const absolute = resolve(root, ...rel.split('/'));
  const back = relative(root, absolute);
  if (!rel || back.startsWith('..') || resolve(root, back) !== absolute) {
    throw new Error(`Ugyldig rod-relativ sti: ${relPath}`);
  }
  return absolute;
}

function assertRoot(root) {
  const resolved = resolve(root);
  if (!existsSync(resolve(resolved, 'heinrich', 'agent_brain'))) {
    throw new Error(`HEINRICH-sentinel mangler under: ${resolved}`);
  }
  return resolved;
}

function loadManifest(root) {
  const path = resolve(root, 'heinrich', 'config', 'onboarding.json');
  const manifest = JSON.parse(readFileSync(path, 'utf8'));
  validateManifest(root, manifest);
  return manifest;
}

function validateManifest(root, manifest) {
  if (manifest.version !== 1) throw new Error('Ukendt onboarding-manifestversion.');
  const tokens = new Set();
  for (const [key, spec] of Object.entries(manifest.profileSchema || {})) {
    if (!/^[a-z][a-z0-9_]*$/.test(key)) throw new Error(`Ugyldigt profilfelt: ${key}`);
    if (!/^\{\{[A-Z0-9_]+\}\}$/.test(spec.token || '')) {
      throw new Error(`Ugyldigt token for ${key}.`);
    }
    if (tokens.has(spec.token)) throw new Error(`Duplikeret profil-token: ${spec.token}`);
    tokens.add(spec.token);
  }

  const outputs = new Set();
  const contentTokens = new Set();
  for (const target of manifest.targets || []) {
    const template = insideRoot(root, target.template);
    insideRoot(root, target.output);
    if (!existsSync(template)) throw new Error(`Onboarding-template mangler: ${target.template}`);
    if (outputs.has(target.output)) throw new Error(`Duplikeret onboarding-output: ${target.output}`);
    outputs.add(target.output);
    const rel = normalizeRel(target.output);
    const match = rel.match(/^heinrich\/(\.claude|\.Codex)\/constitution\/([^/]+)$/);
    if (!match || !GENERATED_BASENAMES.has(match[2])) {
      throw new Error(`Output ligger uden for onboarding-scope: ${target.output}`);
    }
    for (const token of readFileSync(template, 'utf8').match(TOKEN_RE) || []) {
      contentTokens.add(token);
    }
  }
  const schema = [...tokens].sort();
  const content = [...contentTokens].sort();
  if (JSON.stringify(schema) !== JSON.stringify(content)) {
    throw new Error(`Tokenkontrakten driver. schema=${schema.join(',')} content=${content.join(',')}`);
  }
  insideRoot(root, manifest.profileFile);
  insideRoot(root, manifest.stateFile);
}

function validateProfile(manifest, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Profilen skal være et JSON-objekt.');
  }
  const schema = manifest.profileSchema;
  const unknown = Object.keys(input).filter((key) => !Object.hasOwn(schema, key));
  if (unknown.length) throw new Error(`Ukendte profilfelter: ${unknown.join(', ')}`);

  const profile = {};
  for (const [key, spec] of Object.entries(schema)) {
    let value = input[key];
    if (value === undefined && Object.hasOwn(spec, 'default')) value = spec.default;
    if (value === undefined || value === null) {
      if (spec.required) throw new Error(`Profilfelt mangler: ${key}`);
      value = '';
    }
    if (typeof value !== 'string') throw new Error(`${key} skal være tekst.`);
    value = value.normalize('NFC');
    if (/\p{Cc}/u.test(value)) throw new Error(`${key} indeholder kontroltegn eller linjeskift.`);
    if (value.includes('{{') || value.includes('}}')) throw new Error(`${key} må ikke indeholde template-tokens.`);
    if (spec.required && !value.trim()) throw new Error(`${key} må ikke være tom.`);
    if (spec.maxLength && value.length > spec.maxLength) {
      throw new Error(`${key} er længere end ${spec.maxLength} tegn.`);
    }
    if (spec.type === 'enum' && !spec.values.includes(value)) {
      throw new Error(`${key} skal være én af: ${spec.values.join(', ')}.`);
    }
    if (spec.type === 'iana-tz') {
      try { new Intl.DateTimeFormat('en', { timeZone: value }).format(); }
      catch { throw new Error(`${key} er ikke en gyldig IANA-tidszone.`); }
    }
    profile[key] = value;
  }
  return profile;
}

function parseProfileYaml(manifest, text) {
  const parsed = {};
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const match = raw.match(/^([a-z][a-z0-9_]*):\s*(.+)\s*$/);
    if (!match) throw new Error(`Ugyldig profile.yaml linje ${index + 1}. Brug JSON-citerede strenge.`);
    if (Object.hasOwn(parsed, match[1])) throw new Error(`Duplikeret profilfelt: ${match[1]}`);
    let value;
    try { value = JSON.parse(match[2]); }
    catch { throw new Error(`Ugyldig JSON-citering på profile.yaml linje ${index + 1}.`); }
    parsed[match[1]] = value;
  }
  return validateProfile(manifest, parsed);
}

function serializeProfile(manifest, profile) {
  const lines = [
    '# Genereret af HEINRICH onboarding. Indeholder ingen credentials.',
    '# Redigér værdierne eller kør $onboard configure igen.',
  ];
  for (const key of Object.keys(manifest.profileSchema)) {
    lines.push(`${key}: ${JSON.stringify(profile[key])}`);
  }
  return `${lines.join('\n')}\n`;
}

function renderTarget(root, manifest, target, profile) {
  let text = readFileSync(insideRoot(root, target.template), 'utf8');
  for (const [key, spec] of Object.entries(manifest.profileSchema)) {
    const replacement = target.format === 'yaml' ? JSON.stringify(profile[key]) : profile[key];
    text = text.split(spec.token).join(replacement);
  }
  const unresolved = [...new Set(text.match(TOKEN_RE) || [])];
  if (unresolved.length) throw new Error(`${target.output} har uløste tokens: ${unresolved.join(', ')}`);
  return text.endsWith('\n') ? text : `${text}\n`;
}

function readState(root, manifest) {
  const path = insideRoot(root, manifest.stateFile);
  if (!existsSync(path)) return null;
  const state = JSON.parse(readFileSync(path, 'utf8'));
  if (state.version !== 1 || !state.targets || typeof state.targets !== 'object') {
    throw new Error('setup/.generated.json har ukendt format.');
  }
  return state;
}

function buildExpectedState(manifest, profileText, rendered) {
  const targets = {};
  for (const [rel, value] of rendered) targets[rel] = { sha256: hash(value.text), template: value.template };
  return { version: 1, profile_sha256: hash(profileText), targets };
}

function planConfigure(root, rawProfile) {
  root = assertRoot(root);
  const manifest = loadManifest(root);
  const profile = validateProfile(manifest, rawProfile);
  const previous = readState(root, manifest);
  const rendered = new Map();
  const changes = [];
  const conflicts = [];

  for (const target of manifest.targets) {
    const expected = renderTarget(root, manifest, target, profile);
    const absolute = insideRoot(root, target.output);
    const current = existsSync(absolute) ? readFileSync(absolute, 'utf8') : null;
    const currentHash = current === null ? null : hash(current);
    const expectedHash = hash(expected);
    const priorHash = previous?.targets?.[target.output]?.sha256 || null;
    let action = 'unchanged';
    if (current === null) action = 'create';
    else if (currentHash === expectedHash) action = 'unchanged';
    else if (priorHash && currentHash === priorHash) action = 'update';
    else action = 'conflict';
    const item = { path: target.output, action, before: currentHash, after: expectedHash };
    if (action === 'conflict') conflicts.push(item);
    else if (action !== 'unchanged') changes.push(item);
    rendered.set(target.output, { text: expected, template: target.template });
  }

  const profileText = serializeProfile(manifest, profile);
  const profilePath = insideRoot(root, manifest.profileFile);
  const currentProfile = existsSync(profilePath) ? readFileSync(profilePath, 'utf8') : null;
  if (currentProfile !== profileText) {
    changes.unshift({
      path: manifest.profileFile,
      action: currentProfile === null ? 'create' : 'update',
      before: currentProfile === null ? null : hash(currentProfile),
      after: hash(profileText),
    });
  }

  const state = buildExpectedState(manifest, profileText, rendered);
  const stateText = `${JSON.stringify(state, null, 2)}\n`;
  const statePath = insideRoot(root, manifest.stateFile);
  const currentState = existsSync(statePath) ? readFileSync(statePath, 'utf8') : null;
  if (currentState !== stateText) {
    changes.push({
      path: manifest.stateFile,
      action: currentState === null ? 'create' : 'update',
      before: currentState === null ? null : hash(currentState),
      after: hash(stateText),
    });
  }

  return { root, manifest, profile, profileText, rendered, stateText, changes, conflicts };
}

function atomicWriteBatch(root, entries) {
  const prepared = [];
  try {
    for (const [index, entry] of entries.entries()) {
      const dest = insideRoot(root, entry.path);
      mkdirSync(dirname(dest), { recursive: true });
      const temp = `${dest}.onboard-${process.pid}-${index}.tmp`;
      if (existsSync(temp)) throw new Error(`Midlertidig fil findes allerede: ${relative(root, temp)}`);
      writeFileSync(temp, entry.text, 'utf8');
      if (readFileSync(temp, 'utf8') !== entry.text) throw new Error(`Genlæsning fejlede: ${entry.path}`);
      prepared.push({ dest, temp });
    }
    for (const item of prepared) renameSync(item.temp, item.dest);
  } finally {
    for (const item of prepared) {
      if (existsSync(item.temp)) rmSync(item.temp, { force: true });
    }
  }
}

function applyConfigure(plan) {
  if (plan.conflicts.length) {
    throw new Error(`Håndredigerede generatorfiler: ${plan.conflicts.map((x) => x.path).join(', ')}`);
  }
  const entries = [];
  const changed = new Set(plan.changes.map((item) => item.path));
  if (changed.has(plan.manifest.profileFile)) entries.push({ path: plan.manifest.profileFile, text: plan.profileText });
  for (const [path, value] of plan.rendered) {
    if (changed.has(path)) entries.push({ path, text: value.text });
  }
  if (changed.has(plan.manifest.stateFile)) entries.push({ path: plan.manifest.stateFile, text: plan.stateText });
  atomicWriteBatch(plan.root, entries);
  return { written: entries.map((entry) => entry.path), unchanged: plan.manifest.targets.length - entries.filter((x) => plan.rendered.has(x.path)).length };
}

function run(command, args, cwd, allowFailure = false) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', shell: false });
  if (result.error) {
    if (allowFailure) return { status: null, stdout: '', stderr: result.error.message };
    throw result.error;
  }
  if (!allowFailure && result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} fejlede (${result.status}): ${(result.stderr || result.stdout).trim()}`);
  }
  return { status: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
}

function normalizeRemote(url) {
  return String(url).trim().replace(/\/$/, '').replace(/\.git$/i, '').toLowerCase();
}

function redactRemote(url) {
  const value = String(url || '').trim();
  if (/^https?:\/\//i.test(value) || /^ssh:\/\//i.test(value) || /^file:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      parsed.username = '';
      parsed.password = '';
      return parsed.toString();
    } catch { return '<ugyldig remote>'; }
  }
  return value.replace(/^([^@\s]+)@/, '<user>@');
}

function validateRemote(url, manifest) {
  const value = String(url || '').trim();
  if (!value || /\s|\p{Cc}/u.test(value)) throw new Error('Remote-URL er tom eller indeholder whitespace/kontroltegn.');
  if (/^https:\/\//i.test(value) || /^ssh:\/\//i.test(value) || /^file:\/\//i.test(value)) {
    let parsed;
    try { parsed = new URL(value); } catch { throw new Error('Remote-URL kan ikke parses.'); }
    if (parsed.username || parsed.password) throw new Error('Credentials må ikke indlejres i remote-URL.');
  } else if (!/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+:[A-Za-z0-9._~/-]+$/.test(value)) {
    throw new Error('Remote skal være HTTPS, SSH eller scp-lignende Git-syntaks.');
  }
  if ((manifest.templateRemotes || []).some((known) => normalizeRemote(known) === normalizeRemote(value))) {
    throw new Error('Remote peger på selve HEINRICH-templaten. Brug et nyt tomt repo.');
  }
  return value;
}

function validateGitIdentity(name, email) {
  const cleanName = String(name || '').trim().normalize('NFC');
  const cleanEmail = String(email || '').trim().normalize('NFC');
  if (!cleanName || cleanName.length > 160 || /\p{Cc}/u.test(cleanName)) {
    throw new Error('Git-navn mangler, er for langt eller indeholder kontroltegn.');
  }
  if (!cleanEmail || cleanEmail.length > 254 || /\s|\p{Cc}|[<>]/u.test(cleanEmail) || !/^[^@]+@[^@]+$/.test(cleanEmail)) {
    throw new Error('Git-email er ugyldig. Brug en adresse uden whitespace eller vinkelparenteser.');
  }
  return { name: cleanName, email: cleanEmail };
}

function gitStatus(root, manifest = loadManifest(root)) {
  const version = run('git', ['--version'], root, true);
  if (version.status !== 0) return { available: false, repo: false };
  const top = run('git', ['rev-parse', '--show-toplevel'], root, true);
  if (top.status !== 0) return { available: true, repo: false };
  const repoRoot = resolve(top.stdout.trim());
  const branch = run('git', ['symbolic-ref', '--quiet', '--short', 'HEAD'], root, true);
  const head = run('git', ['rev-parse', '--verify', 'HEAD'], root, true);
  const remoteNamesRaw = run('git', ['remote'], root, true);
  const remoteNames = remoteNamesRaw.status === 0
    ? remoteNamesRaw.stdout.trim().split(/\r?\n/).filter(Boolean)
    : [];
  const remotes = remoteNames.map((name) => {
    const urlsRaw = run('git', ['remote', 'get-url', '--all', name], root, true);
    const urls = urlsRaw.status === 0
      ? urlsRaw.stdout.trim().split(/\r?\n/).filter(Boolean).map(redactRemote)
      : [];
    return { name, urls };
  });
  const remotesRaw = run('git', ['remote', 'get-url', '--all', 'origin'], root, true);
  const origins = remotesRaw.status === 0 ? remotesRaw.stdout.trim().split(/\r?\n/).filter(Boolean) : [];
  const hookPath = run('git', ['config', '--local', '--get', 'core.hooksPath'], root, true);
  const identityName = run('git', ['config', '--local', '--get', 'user.name'], root, true);
  const identityEmail = run('git', ['config', '--local', '--get', 'user.email'], root, true);
  const dirty = run('git', ['status', '--porcelain=v1', '--untracked-files=all'], root, true);
  return {
    available: true,
    repo: true,
    repo_root: repoRoot,
    root_matches: repoRoot.toLowerCase() === resolve(root).toLowerCase(),
    branch: branch.status === 0 ? branch.stdout.trim() : null,
    has_head: head.status === 0,
    remotes,
    origins: origins.map(redactRemote),
    origin_is_template: origins.some((url) => (manifest.templateRemotes || []).some((known) => normalizeRemote(known) === normalizeRemote(url))),
    hooks_path: hookPath.status === 0 ? hookPath.stdout.trim() : null,
    identity: {
      name: identityName.status === 0 ? identityName.stdout.trim() : null,
      email: identityEmail.status === 0 ? identityEmail.stdout.trim() : null,
    },
    dirty: dirty.status === 0 ? dirty.stdout.trim().split(/\r?\n/).filter(Boolean) : [],
  };
}

function requireRepoRoot(root, status) {
  if (!status.repo) throw new Error('HEINRICH-roden er ikke et Git-repo.');
  if (!status.root_matches) throw new Error(`Git-roden er ${status.repo_root}, ikke HEINRICH-roden.`);
}

function verifyGenerated(root, runChecks = true) {
  root = assertRoot(root);
  const manifest = loadManifest(root);
  const profilePath = insideRoot(root, manifest.profileFile);
  if (!existsSync(profilePath)) throw new Error('setup/profile.yaml mangler.');
  const profile = parseProfileYaml(manifest, readFileSync(profilePath, 'utf8'));
  const plan = planConfigure(root, profile);
  if (plan.conflicts.length) throw new Error(`Generator-konflikter: ${plan.conflicts.map((x) => x.path).join(', ')}`);
  const outputDrift = plan.changes.filter((x) => x.path !== manifest.stateFile && x.path !== manifest.profileFile);
  if (outputDrift.length) throw new Error(`Generator-output driver: ${outputDrift.map((x) => x.path).join(', ')}`);
  if (plan.changes.some((x) => x.path === manifest.stateFile)) throw new Error(`${manifest.stateFile} driver.`);

  const checks = [];
  if (runChecks) {
    const commands = [
      ['adapter-parity', process.execPath, ['heinrich/tools/adapter-parity.mjs', '--root', root]],
      ['skill-inventory', process.execPath, ['heinrich/tools/skill-inventory.mjs', '--root', root, '--check-catalog', 'heinrich/docs/04-skills-catalog.md']],
      ['hooks', process.execPath, ['heinrich/tools/hooks.test.mjs']],
    ];
    for (const [name, command, args] of commands) {
      const result = run(command, args, root, true);
      checks.push({ name, pass: result.status === 0, output: (result.stdout || result.stderr).trim() });
    }
    const failed = checks.filter((check) => !check.pass);
    if (failed.length) throw new Error(`Verifikationschecks fejlede: ${failed.map((x) => x.name).join(', ')}`);
  }
  return { pass: true, targets: manifest.targets.length, tokens: Object.keys(manifest.profileSchema).length, checks };
}

function statusReport(root) {
  root = assertRoot(root);
  const manifest = loadManifest(root);
  const profilePath = insideRoot(root, manifest.profileFile);
  let profile = null;
  let profileError = null;
  if (existsSync(profilePath)) {
    try { profile = parseProfileYaml(manifest, readFileSync(profilePath, 'utf8')); }
    catch (error) { profileError = error.message; }
  }
  let generator = { configured: false, changes: [], conflicts: [] };
  let verification = { ready: false, pass: false, error: 'Onboarding er ikke konfigureret.' };
  if (profile) {
    const plan = planConfigure(root, profile);
    generator = { configured: true, changes: plan.changes, conflicts: plan.conflicts };
    try {
      const checked = verifyGenerated(root, false);
      verification = { ready: true, pass: checked.pass, error: null };
    } catch (error) {
      verification = { ready: true, pass: false, error: error.message };
    }
  }
  return {
    root,
    node: process.version,
    profile: { exists: existsSync(profilePath), valid: Boolean(profile), error: profileError },
    generator,
    verification,
    git: gitStatus(root, manifest),
  };
}

function gitInit(root, apply) {
  const manifest = loadManifest(root);
  const before = gitStatus(root, manifest);
  if (before.repo) return { changed: false, status: before };
  if (!apply) return { changed: false, preview: ['git', 'init', '-b', 'main'] };
  run('git', ['init', '-b', 'main'], root);
  return { changed: true, status: gitStatus(root, manifest) };
}

function gitRemote(root, url, apply) {
  const manifest = loadManifest(root);
  const status = gitStatus(root, manifest);
  requireRepoRoot(root, status);
  const safe = validateRemote(url, manifest);
  if (status.origins.length) throw new Error(`origin findes allerede: ${status.origins.join(', ')}`);
  if (!apply) return { changed: false, preview: ['git', 'remote', 'add', 'origin', redactRemote(safe)] };
  run('git', ['remote', 'add', 'origin', safe], root);
  return { changed: true, origin: redactRemote(safe) };
}

function gitDisconnect(root, apply) {
  const manifest = loadManifest(root);
  const status = gitStatus(root, manifest);
  requireRepoRoot(root, status);
  if (!status.remotes.length) return { changed: false, removed: [] };
  const preview = status.remotes.map((remote) => ['git', 'remote', 'remove', remote.name]);
  if (!apply) return { changed: false, preview, remotes: status.remotes };
  for (const remote of status.remotes) run('git', ['remote', 'remove', remote.name], root);
  return { changed: true, removed: status.remotes.map((remote) => remote.name), status: gitStatus(root, manifest) };
}

function gitHooks(root, apply) {
  const manifest = loadManifest(root);
  const status = gitStatus(root, manifest);
  requireRepoRoot(root, status);
  const hook = resolve(root, '.githooks', 'pre-commit');
  if (!existsSync(hook)) throw new Error('.githooks/pre-commit mangler.');
  run(process.execPath, ['heinrich/tools/adapter-parity.mjs', '--root', root], root);
  if (!apply) return { changed: false, preview: ['git', 'config', '--local', 'core.hooksPath', '.githooks'] };
  chmodSync(hook, 0o755);
  run('git', ['config', '--local', 'core.hooksPath', '.githooks'], root);
  return { changed: true, hooks_path: '.githooks' };
}

function gitIdentity(root, name, email, apply) {
  const manifest = loadManifest(root);
  const status = gitStatus(root, manifest);
  requireRepoRoot(root, status);
  const { name: cleanName, email: cleanEmail } = validateGitIdentity(name, email);
  const preview = [
    ['git', 'config', '--local', 'user.name', cleanName],
    ['git', 'config', '--local', 'user.email', cleanEmail],
  ];
  if (!apply) return { changed: false, preview };
  run('git', ['config', '--local', 'user.name', cleanName], root);
  run('git', ['config', '--local', 'user.email', cleanEmail], root);
  return { changed: true, identity: { name: cleanName, email: cleanEmail } };
}

function gitCommit(root, message, initial, apply) {
  const manifest = loadManifest(root);
  const status = gitStatus(root, manifest);
  requireRepoRoot(root, status);
  if (!message?.trim() || /\p{Cc}/u.test(message)) throw new Error('Commit-besked mangler eller indeholder kontroltegn.');
  const name = run('git', ['config', '--local', '--get', 'user.name'], root, true);
  const email = run('git', ['config', '--local', '--get', 'user.email'], root, true);
  if (name.status !== 0 || !name.stdout.trim() || email.status !== 0 || !email.stdout.trim()) {
    throw new Error('Repo-lokal user.name og user.email skal sættes før commit.');
  }
  verifyGenerated(root, true);
  if (initial && status.has_head) throw new Error('--initial må kun bruges uden eksisterende HEAD.');
  if (!initial && !status.has_head) throw new Error('Første commit kræver --initial og en særskilt godkendelse af hele filsettet.');
  const stage = initial
    ? ['add', '--all']
    : ['add', '--', manifest.profileFile, manifest.stateFile, ...manifest.targets.map((x) => x.output)];
  if (!apply) return { changed: false, preview: [['git', ...stage], ['git', 'commit', '-m', message]] };
  run('git', stage, root);
  const staged = run('git', ['diff', '--cached', '--quiet'], root, true);
  if (staged.status === 0) return { changed: false, reason: 'Ingen staged ændringer.' };
  run('git', ['commit', '-m', message], root);
  return { changed: true };
}

function gitPush(root, apply) {
  const manifest = loadManifest(root);
  const status = gitStatus(root, manifest);
  requireRepoRoot(root, status);
  if (!status.has_head) throw new Error('Der er ingen commit at pushe.');
  if (!status.origins.length) throw new Error('origin mangler.');
  if (status.origin_is_template) throw new Error('origin peger på HEINRICH-templaten. Stop og brug et nyt tomt repo.');
  if (status.dirty.length) throw new Error('Working tree er ikke rent. Afklar ændringerne før push.');
  if (!status.branch) throw new Error('Aktiv branch kunne ikke bestemmes.');
  if (!apply) return { changed: false, preview: ['git', 'push', '-u', 'origin', status.branch] };
  run('git', ['push', '-u', 'origin', status.branch], root);
  return { changed: true, branch: status.branch };
}

function parseArgs(argv) {
  const options = { command: argv[0] || 'status', apply: false, json: false, initial: false, root: DEFAULT_ROOT };
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') options.apply = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--initial') options.initial = true;
    else if (['--root', '--profile', '--url', '--message', '--name', '--email'].includes(arg)) {
      if (!argv[i + 1]) throw new Error(`${arg} kræver en værdi.`);
      options[arg.slice(2)] = argv[++i];
    } else if (arg === '--stdin') options.stdin = true;
    else throw new Error(`Ukendt argument: ${arg}`);
  }
  return options;
}

async function readProfileInput(root, manifest, options) {
  if (options.stdin) {
    const line = await new Promise((resolveLine, reject) => {
      const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
      rl.once('line', (value) => { resolveLine(value); rl.close(); });
      rl.once('error', reject);
      rl.once('close', () => resolveLine(''));
    });
    if (!line.trim()) throw new Error('Ingen JSON-profil modtaget på stdin.');
    return validateProfile(manifest, JSON.parse(line));
  }
  const rel = options.profile || manifest.profileFile;
  const path = insideRoot(root, rel);
  if (!existsSync(path)) throw new Error(`Profilfil mangler: ${rel}`);
  return parseProfileYaml(manifest, readFileSync(path, 'utf8'));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const root = assertRoot(options.root);
  const manifest = loadManifest(root);
  let result;
  if (options.command === 'status') result = statusReport(root);
  else if (options.command === 'configure') {
    const profile = await readProfileInput(root, manifest, options);
    const plan = planConfigure(root, profile);
    result = {
      changes: plan.changes,
      conflicts: plan.conflicts,
      applied: false,
    };
    if (options.apply) result = { ...result, ...applyConfigure(plan), applied: true };
  } else if (options.command === 'verify') result = verifyGenerated(root, true);
  else if (options.command === 'git-status') result = gitStatus(root, manifest);
  else if (options.command === 'git-init') result = gitInit(root, options.apply);
  else if (options.command === 'git-remote') result = gitRemote(root, options.url, options.apply);
  else if (options.command === 'git-disconnect') result = gitDisconnect(root, options.apply);
  else if (options.command === 'git-hooks') result = gitHooks(root, options.apply);
  else if (options.command === 'git-identity') result = gitIdentity(root, options.name, options.email, options.apply);
  else if (options.command === 'git-commit') result = gitCommit(root, options.message, options.initial, options.apply);
  else if (options.command === 'git-push') result = gitPush(root, options.apply);
  else throw new Error(`Ukendt onboarding-kommando: ${options.command}`);

  if (options.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    const json = process.argv.includes('--json');
    if (json) process.stderr.write(`${JSON.stringify({ error: error.message })}\n`);
    else process.stderr.write(`ONBOARD FAIL: ${error.message}\n`);
    process.exitCode = 1;
  });
}

export {
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
  validateProfile,
  validateGitIdentity,
  validateRemote,
  verifyGenerated,
};
