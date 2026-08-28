/**
 * Fælles hjælpefunktioner for hooks i begge harness.
 *
 * Der findes én implementering pr. hookadfærd. Harnessene leverer kun en tynd
 * kommandolinje. Alternativet — en .sh og en .ps1 med hver sin logik — driver
 * fra hinanden, og så håndhæver de to harness forskellige regler uden at nogen
 * opdager det.
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';

/** Sentinel der markerer repo-roden. Samme som de oprindelige hooks brugte. */
const SENTINEL = join('heinrich', 'agent_brain');

/**
 * Find repo-roden ved at gå opad gennem ancestors efter sentinel'en.
 *
 * Aldrig brugerstier og aldrig løs mappenavnsmatch: sessionen kan være åbnet i
 * heinrich/, i en satellit eller i et nestet repo, og roden skal være den samme
 * i alle tilfælde.
 */
export function findRoot(startPath) {
  if (!startPath) return null;
  let cursor = resolve(startPath);
  for (;;) {
    try {
      const candidate = join(cursor, SENTINEL);
      if (existsSync(candidate) && statSync(candidate).isDirectory()) return cursor;
    } catch { /* fortsæt opad */ }
    const parent = dirname(cursor);
    if (parent === cursor) return null;
    cursor = parent;
  }
}

/** Læs hele stdin. Returnerer tom streng hvis intet leveres. */
export function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

/**
 * Parse hook-payload. En hook må aldrig vælte på uventet input — den skal give
 * fri, ikke blokere brugerens arbejde på grund af en parsefejl.
 */
export function readPayload() {
  const raw = readStdin();
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Målfiler i en Codex apply_patch-payload.
 *
 * apply_patch angiver ikke sit mål i et felt — det står inde i selve
 * patchteksten, og én patch kan ramme flere filer:
 *
 *   *** Begin Patch
 *   *** Update File: sti/til/fil.md
 *   *** Add File: ny.md
 *   *** Delete File: gammel.md
 *   *** Move to: nyt-navn.md
 *   *** End Patch
 *
 * Læses kun ét felt, slipper hele denne brugersti uden om spærringen.
 */
function parsePatchTargets(command) {
  const targets = [];
  const re = /^\s*\*\*\*\s+(?:Update File|Add File|Delete File|Move to):\s*(.+?)\s*$/gm;
  for (const match of String(command).matchAll(re)) {
    if (match[1]) targets.push(match[1]);
  }
  return targets;
}

/**
 * Træk værktøjsnavn og ALLE målfiler ud på tværs af harness-formater.
 *
 * Returnerer altid en liste. En patch der rammer fem filer skal kontrolleres
 * fem gange — det er ikke nok at se på den første.
 */
export function extractTargets(payload) {
  const tool = String(payload.tool_name || payload.tool || payload.name || '');
  const input = payload.tool_input || payload.input || payload.arguments || {};

  const files = [];

  const direct =
    input.file_path || input.path || input.filePath ||
    payload.file_path || payload.path || '';
  if (direct) files.push(String(direct));

  // apply_patch og enhver anden variant der bærer patchtekst.
  const command = input.command || input.patch || input.input || payload.command || '';
  if (command) files.push(...parsePatchTargets(command));

  // Nogle formater leverer en eksplicit liste.
  for (const key of ['file_paths', 'files', 'paths']) {
    const list = input[key] || payload[key];
    if (Array.isArray(list)) {
      for (const item of list) {
        if (typeof item === 'string') files.push(item);
        else if (item && typeof item.path === 'string') files.push(item.path);
      }
    }
  }

  return { tool, files: [...new Set(files.filter(Boolean))] };
}

/** Normalisér til fremadskråstreg, så Windows- og POSIX-stier kan sammenlignes. */
export function normalise(p) {
  return String(p || '').split(sep).join('/').split('\\').join('/');
}

/** Læs den kanoniske liste over beskyttede stier. */
export function readProtectedPaths(root) {
  try {
    const file = join(root, 'heinrich', 'config', 'protected-paths.json');
    const data = JSON.parse(readFileSync(file, 'utf8'));
    return (data.tier1 || []).filter(e => e && e.path);
  } catch {
    return [];
  }
}
