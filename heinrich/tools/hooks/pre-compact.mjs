#!/usr/bin/env node
/**
 * Påmindelse før kontekstafkortning.
 *
 * Varig viden fra en samtale går tabt, når konteksten skæres ned. Denne hook
 * minder om at bevare den først. Den blokerer aldrig — en påmindelse der
 * forhindrer arbejdet bliver slået fra og kommer aldrig tilbage.
 *
 * Er learn-proceduren kørt for nylig, tier den.
 */

import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { findRoot, readPayload } from './lib.mjs';

const QUIET_MINUTES = 30;

const payload = readPayload();
const start = process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();
const root = findRoot(start);
if (!root) process.exit(0);

const marker = join(root, 'heinrich', 'artifacts', '.last-learn');
if (existsSync(marker)) {
  try {
    const ageMinutes = (Date.now() - statSync(marker).mtimeMs) / 60000;
    if (ageMinutes < QUIET_MINUTES) process.exit(0);
  } catch { /* kan ikke aflæses: mind hellere om det én gang for lidt end at fejle */ }
}

process.stderr.write(
  'Overvej learn-proceduren før afkortning, hvis samtalen har skabt varig viden.\n' +
  'Er en opgave midt i udførelsen, så brug handover-proceduren.\n'
);
process.exit(0);
