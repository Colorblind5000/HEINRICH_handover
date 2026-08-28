#!/usr/bin/env node
/**
 * Injicerer dagens fokus ved hver prompt, hvis en dagsfil findes.
 *
 * Formålet er at holde dagens aktive arbejde synligt uden at brugeren skal
 * gentage det. Filen er valgfri: findes den ikke, gør hooken ingenting.
 *
 * Dagsfilen er `heinrich/agent_brain/day.md`. En linje `focus: off` parkerer
 * listen, så assistenten ikke refererer den uopfordret.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { findRoot, readPayload } from './lib.mjs';

const payload = readPayload();
const start = process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();
const root = findRoot(start);
if (!root) process.exit(0);

const dayFile = join(root, 'heinrich', 'agent_brain', 'day.md');
if (!existsSync(dayFile)) process.exit(0);

let off = false;
try {
  const focusLine = readFileSync(dayFile, 'utf8')
    .split(/\r?\n/)
    .find(l => /^focus:/i.test(l.trim()));
  off = Boolean(focusLine && /off/i.test(focusLine));
} catch {
  process.exit(0);
}

process.stdout.write(
  off
    ? '<daily-focus state="OFF">Dagens opgaver er parkeret. Referér ikke listen uopfordret.</daily-focus>\n'
    : '<daily-focus state="ON">Dagens opgaver er dagens fokus. Brug kun aktive punkter; ignorér punkter markeret inactive.</daily-focus>\n'
);
process.exit(0);
