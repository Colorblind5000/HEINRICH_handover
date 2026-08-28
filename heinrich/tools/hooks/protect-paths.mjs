#!/usr/bin/env node
/**
 * Spærring af beskyttede filer. Kører som PreToolUse i begge harness.
 *
 * Blokerer en skrivning til en fil på den kanoniske liste, medmindre der
 * ligger en one-shot override. Exit 2 = blokér, exit 0 = giv fri.
 *
 * Beskyttelse er ikke fredning. Den findes, fordi en utilsigtet ændring i
 * netop disse filer ikke opdages af sig selv — flere af dem er præcis de
 * mekanismer, der ellers ville fange fejlen.
 *
 * Håndterer BÅDE Claudes file_path og Codex' apply_patch, hvor målfilerne står
 * inde i patchteksten. Læses kun det ene format, er det andet harness
 * ubeskyttet — og en grøn testsuite giver så falsk tryghed.
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join, relative, resolve, isAbsolute } from 'node:path';
import { findRoot, readPayload, extractTargets, normalise, readProtectedPaths } from './lib.mjs';

const WRITE_TOOLS = new Set([
  'Edit', 'Write', 'NotebookEdit', 'MultiEdit',
  'apply_patch', 'applyPatch', 'edit_file', 'create_file', 'shell',
]);
const OVERRIDE_FILE = '.protected-override';

const payload = readPayload();
const { tool, files } = extractTargets(payload);

if (!files.length) process.exit(0);
// Ukendt værktøj uden patchtekst er ikke vores ærinde. Bærer det derimod
// filmål, kontrolleres det alligevel — hellere en spærring for meget end en
// ubeskyttet skrivevej vi ikke havde forudset.
if (!WRITE_TOOLS.has(tool) && !(payload.tool_input || {}).command) {
  const looksLikeWrite = files.length > 0 && /edit|write|patch|file/i.test(tool);
  if (!looksLikeWrite) process.exit(0);
}

const start = process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();
const root = findRoot(start);
if (!root) process.exit(0); // Uden for et HEINRICH-repo: giv fri.

const protectedEntries = readProtectedPaths(root);

// Sammenlign på rod-relativ sti. Eksakt match, aldrig suffix: en satellits egen
// .claude/CLAUDE.md er ikke root-CLAUDE.md og skal ikke spærres af den grund.
function toRootRelative(file) {
  const abs = isAbsolute(file) ? file : resolve(root, file);
  return normalise(relative(root, abs));
}

const hits = [];
for (const file of files) {
  const rel = toRootRelative(file);
  const hit = protectedEntries.find(e => normalise(e.path) === rel);
  if (hit) hits.push(hit);
}

if (!hits.length) process.exit(0);

// Override-linjer forbruges kun, hvis ALLE ramte filer er godkendt. En patch må
// ikke slippe halvt igennem på én godkendelse.
const overridePath = join(root, OVERRIDE_FILE);
if (existsSync(overridePath)) {
  let lines = [];
  try {
    lines = readFileSync(overridePath, 'utf8').split(/\r?\n/);
  } catch { /* behandl som ingen override */ }

  const approved = new Set(lines.map(l => l.trim()).filter(Boolean));
  const allApproved = hits.every(h => approved.has(h.path));

  if (allApproved) {
    const consumed = new Set(hits.map(h => h.path));
    const rest = lines
      .filter(l => l.trim() && !consumed.has(l.trim()))
      .join('\n');
    try {
      if (rest) writeFileSync(overridePath, rest + '\n', 'utf8');
      else unlinkSync(overridePath);
    } catch { /* oprydning må ikke blokere den godkendte skrivning */ }
    process.exit(0);
  }
}

const list = hits.map(h => `  ${h.path}\n      ${h.reason || ''}`).join('\n');
process.stderr.write(`
BESKYTTET FIL${hits.length > 1 ? 'ER' : ''} (${tool || 'ukendt værktøj'}):

${list}

${hits.length > 1
    ? 'Patchen rammer flere beskyttede filer. Alle skal godkendes, før den kan køre.'
    : 'Denne fil kræver en eksplicit godkendelse fra dig.'}
Assistenten skal beskrive ændringen, hvorfor den er nødvendig, og hvad den
kan påvirke — før du godkender.

Godkend ved at skrive ${hits.length > 1 ? 'linjerne' : 'linjen'}

${hits.map(h => `  ${h.path}`).join('\n')}

til filen

  ${overridePath}

${hits.length > 1 ? 'Linjerne forbruges' : 'Linjen forbruges'} ved næste forsøg og gælder kun den ene skrivning.
`);
process.exit(2);
