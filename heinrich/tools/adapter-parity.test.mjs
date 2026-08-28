#!/usr/bin/env node

import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIVE_ROOT = resolve(HERE, '..', '..');
const SCRIPT = join(HERE, 'adapter-parity.mjs');
const CONTRACT_REL = 'heinrich/agent_brain/understanding/standards/assistant-core-contract.md';

function run(root) {
  return spawnSync(process.execPath, [SCRIPT, '--root', root], {
    encoding: 'utf8',
    windowsHide: true,
  });
}

function assert(condition, message, result) {
  if (condition) return;
  const detail = result ? `\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}` : '';
  throw new Error(`${message}${detail}`);
}

const sandbox = mkdtempSync(join(tmpdir(), 'heinrich-adapter-parity-'));
const root = join(sandbox, 'Work');

try {
  for (const relPath of [CONTRACT_REL, 'AGENTS.md', 'CLAUDE.md']) {
    const target = join(root, relPath);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(LIVE_ROOT, relPath), target);
  }

  const green = run(root);
  assert(green.status === 0, 'Positiv kontrol skulle returnere exit 0.', green);

  const claudePath = join(root, 'CLAUDE.md');
  const original = readFileSync(claudePath, 'utf8');
  const drifted = original.replace(
    'Kør eller tilbyd ikke backup, push eller deploy',
    'Kør eller tilbyd backup, push eller deploy',
  );
  assert(drifted !== original, 'Testen kunne ikke indsætte kontrolleret content-drift.');
  writeFileSync(claudePath, drifted, 'utf8');

  const contentFailure = run(root);
  const contentOutput = `${contentFailure.stdout}\n${contentFailure.stderr}`;
  assert(contentFailure.status === 1, 'Content-drift skulle returnere exit 1.', contentFailure);
  assert(/CLAUDE\.md: blok `security` afviger/.test(contentOutput), 'Content-drift gav ikke en handlingsklar security-fejl.', contentFailure);

  writeFileSync(claudePath, original.replace(
    'Parallelt arbejde er tilladt',
    'Parallelt arbejde er aldrig tilladt',
  ), 'utf8');
  const collaborationFailure = run(root);
  const collaborationOutput = `${collaborationFailure.stdout}\n${collaborationFailure.stderr}`;
  assert(collaborationFailure.status === 1, 'Collaboration-drift skulle returnere exit 1.', collaborationFailure);
  assert(/CLAUDE\.md: blok `collaboration` afviger/.test(collaborationOutput), 'Collaboration-drift gav ikke en handlingsklar fejl.', collaborationFailure);

  writeFileSync(claudePath, original.replace('synced: 2026-08-22', 'synced: 2026-08-21'), 'utf8');
  const syncFailure = run(root);
  const syncOutput = `${syncFailure.stdout}\n${syncFailure.stderr}`;
  assert(syncFailure.status === 1, 'Stale synced-dato skulle returnere exit 1.', syncFailure);
  assert(/CLAUDE\.md: blok `security` har synced 2026-08-21/.test(syncOutput), 'Stale synced gav ikke en handlingsklar metadatafejl.', syncFailure);

  console.log('Adapter parity tests OK: grøn baseline + security-drift + collaboration-drift + stale synced fejler korrekt.');
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}
