#!/usr/bin/env node

import {
  createHash,
} from 'node:crypto';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(HERE, '..', '..');
const DEFAULT_CATALOG = 'heinrich/docs/04-skills-catalog.md';
const DEFAULT_EXPECTED_ROOTS = ['.agents/skills', '.claude/skills'];
const START_MARKER = '<!-- skill-inventory:start -->';
const END_MARKER = '<!-- skill-inventory:end -->';

function normalizePath(value) {
  return value.split(sep).join('/').replace(/^\.\//, '');
}

function parseArgs(argv) {
  const options = {
    root: DEFAULT_ROOT,
    json: false,
    catalog: null,
    checkCatalog: null,
    expectedRoots: [],
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--root' && argv[index + 1]) {
      options.root = resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--catalog' && argv[index + 1]) {
      options.catalog = argv[index + 1];
      index += 1;
    } else if (arg === '--check-catalog' && argv[index + 1]) {
      options.checkCatalog = argv[index + 1];
      index += 1;
    } else if (arg === '--expect-root' && argv[index + 1]) {
      options.expectedRoots.push(normalizePath(argv[index + 1]));
      index += 1;
    } else {
      throw new Error(`Ukendt eller ufuldstændigt argument: ${arg}`);
    }
  }
  if (options.catalog && options.checkCatalog) {
    throw new Error('--catalog og --check-catalog kan ikke bruges samtidig.');
  }
  if (options.expectedRoots.length === 0) options.expectedRoots = DEFAULT_EXPECTED_ROOTS;
  return options;
}

function shouldExclude(relPath, isDirectory) {
  const parts = normalizePath(relPath).split('/').filter(Boolean);
  if (parts.includes('.git') || parts.includes('node_modules')) return true;
  if (parts.includes('.next')) return true;
  if (parts.includes('.cache')) return true;
  if (parts.includes('worktrees') && parts.includes('.claude')) return true;
  const codexIndex = parts.indexOf('.codex');
  if (codexIndex >= 0 && parts.slice(codexIndex + 1).includes('plugins')) return true;
  if (!isDirectory && parts.at(-1) !== 'SKILL.md') return false;
  return false;
}

function assertExpectedRoots(root, expectedRoots) {
  for (const relPath of expectedRoots) {
    const absolute = join(root, ...relPath.split('/'));
    if (!existsSync(absolute)) throw new Error(`Forventet skillrod mangler: ${relPath}`);
    let stat;
    try {
      stat = statSync(absolute);
      readdirSync(absolute);
    } catch (error) {
      throw new Error(`Forventet skillrod kan ikke læses: ${relPath}: ${error.message}`);
    }
    if (!stat.isDirectory()) throw new Error(`Forventet skillrod er ikke en mappe: ${relPath}`);
  }
}

function walkSkillFiles(root) {
  const found = [];
  const walk = (directory) => {
    const relDirectory = normalizePath(relative(root, directory));
    if (relDirectory && shouldExclude(relDirectory, true)) return;
    let entries;
    try {
      entries = readdirSync(directory, { withFileTypes: true });
    } catch (error) {
      throw new Error(`Mappe kan ikke læses: ${relDirectory || '.'}: ${error.message}`);
    }
    for (const entry of entries) {
      const absolute = join(directory, entry.name);
      const relPath = normalizePath(relative(root, absolute));
      if (entry.isDirectory()) {
        if (!shouldExclude(relPath, true)) walk(absolute);
      } else if (entry.isFile() && entry.name === 'SKILL.md' && !shouldExclude(relPath, false)) {
        found.push(relPath);
      }
    }
  };
  walk(root);
  return found.sort((left, right) => left.localeCompare(right));
}

function frontmatterValue(text, key) {
  const block = /^---\s*\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] || '';
  const value = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm').exec(block)?.[1]?.trim();
  if (!value) return null;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function pathMetadata(relPath) {
  const parts = normalizePath(relPath).split('/');
  const disabled = parts.includes('skills-disabled');
  const archived = parts.includes('skills-archive') || parts.includes('_archive');
  const status = archived ? 'archived' : disabled ? 'disabled' : 'active';
  const agentsIndex = parts.indexOf('.agents');
  const claudeIndex = parts.indexOf('.claude');
  const markerIndex = agentsIndex >= 0 ? agentsIndex : claudeIndex;
  const harness = agentsIndex >= 0 ? 'codex' : claudeIndex >= 0 ? 'claude' : 'unknown';
  let scope = 'unclassified';
  let visibleFrom = 'Ikke aktiv discoveryrod';
  if (markerIndex === 0) {
    scope = 'work';
    visibleFrom = 'Work/ og underliggende projekter';
  } else if (markerIndex > 0) {
    const projectPath = parts.slice(0, markerIndex).join('/');
    scope = `project:${projectPath}`;
    visibleFrom = `Work/${projectPath}/`;
  }
  if (status !== 'active') visibleFrom = 'Ikke aktiv';
  return { status, harness, scope, visibleFrom };
}

function readInstance(root, relPath) {
  const absolute = join(root, ...relPath.split('/'));
  let text;
  try {
    text = readFileSync(absolute, 'utf8');
  } catch (error) {
    throw new Error(`Skillfil kan ikke læses: ${relPath}: ${error.message}`);
  }
  const metadata = pathMetadata(relPath);
  return {
    path: relPath,
    name: frontmatterValue(text, 'name') || relPath.split('/').at(-2),
    description: frontmatterValue(text, 'description') || '',
    hash: createHash('sha256').update(text).digest('hex'),
    ...metadata,
  };
}

function canonicalOwner(root, name, active) {
  const playbook = `heinrich/agent_brain/understanding/playbooks/${name}.md`;
  if (existsSync(join(root, ...playbook.split('/')))) return playbook;
  if (active.length === 1) return active[0].path;
  return 'Uafklaret — scopeklassifikation kræves';
}

function buildFamilies(root, instances) {
  const grouped = new Map();
  for (const instance of instances) {
    if (!grouped.has(instance.name)) grouped.set(instance.name, []);
    grouped.get(instance.name).push(instance);
  }
  return [...grouped.entries()].map(([name, members]) => {
    const active = members.filter((member) => member.status === 'active');
    const disabled = members.filter((member) => member.status === 'disabled');
    const archived = members.filter((member) => member.status === 'archived');
    const hashes = new Set(active.map((member) => member.hash));
    const copyState = active.length > 1 && hashes.size === 1
      ? `exact-copy (${active.length})`
      : active.length > 1 ? `variants (${hashes.size})` : null;
    const states = [];
    if (active.length) states.push('active');
    if (copyState) states.push(copyState);
    if (disabled.length) states.push(`disabled (${disabled.length})`);
    if (archived.length) states.push(`archived (${archived.length})`);
    return {
      name,
      scope: [...new Set(active.map((member) => member.scope))].sort(),
      canonicalOwner: canonicalOwner(root, name, active),
      codexAdapters: active.filter((member) => member.harness === 'codex').map((member) => member.path),
      claudeAdapters: active.filter((member) => member.harness === 'claude').map((member) => member.path),
      otherActive: active.filter((member) => member.harness === 'unknown').map((member) => member.path),
      visibleFrom: [...new Set(active.map((member) => member.visibleFrom))].sort(),
      status: states.join(' · ') || 'inactive',
      activeCount: active.length,
      disabledCount: disabled.length,
      archivedCount: archived.length,
      uniqueActiveHashes: hashes.size,
    };
  }).sort((left, right) => left.name.localeCompare(right.name));
}

export function scanInventory(root, { expectedRoots = DEFAULT_EXPECTED_ROOTS } = {}) {
  const absoluteRoot = resolve(root);
  if (!existsSync(absoluteRoot)) throw new Error(`Work-root findes ikke: ${absoluteRoot}`);
  assertExpectedRoots(absoluteRoot, expectedRoots);
  const instances = walkSkillFiles(absoluteRoot).map((relPath) => readInstance(absoluteRoot, relPath));
  const families = buildFamilies(absoluteRoot, instances);
  const totals = {
    active: instances.filter((item) => item.status === 'active').length,
    disabled: instances.filter((item) => item.status === 'disabled').length,
    archived: instances.filter((item) => item.status === 'archived').length,
    files: instances.length,
    activeNames: new Set(instances.filter((item) => item.status === 'active').map((item) => item.name)).size,
    exactCopyFamilies: families.filter((family) => family.status.includes('exact-copy')).length,
    redundantActiveCopies: families.reduce((sum, family) => (
      family.status.includes('exact-copy') ? sum + family.activeCount - 1 : sum
    ), 0),
  };
  return { root: absoluteRoot, totals, instances, families };
}

function escapeCell(value) {
  const values = Array.isArray(value) ? value : [value];
  if (values.length === 0) return '—';
  return values.map((item) => `\`${String(item).replace(/`/g, '')}\``).join('<br>');
}

export function renderInventorySection(report) {
  const lines = [
    START_MARKER,
    '## Verificeret live-inventory',
    '',
    '> Afledt visning — ikke workflowkilde. Genereres fra de faktiske `SKILL.md`-filer.',
    '> Kommando: `node heinrich/tools/skill-inventory.mjs --catalog heinrich/docs/04-skills-catalog.md`.',
    '',
    `- Aktive skillfiler: **${report.totals.active}**`,
    `- Unikke aktive navne: **${report.totals.activeNames}**`,
    `- Disabled: **${report.totals.disabled}**`,
    `- Arkiverede: **${report.totals.archived}**`,
    `- Eksakte kopifamilier: **${report.totals.exactCopyFamilies}**`,
    `- Redundante aktive kopier: **${report.totals.redundantActiveCopies}**`,
    '',
    '| Skillfamilie | Scope | Kanonisk ejer | Codex-adapter | Claude-adapter | Synlig fra | Status |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const family of report.families) {
    const codex = family.codexAdapters;
    const claude = family.claudeAdapters;
    const status = family.otherActive.length
      ? `${family.status} · unknown-adapter (${family.otherActive.length})`
      : family.status;
    lines.push(`| \`${family.name}\` | ${escapeCell(family.scope)} | ${escapeCell(family.canonicalOwner)} | ${escapeCell(codex)} | ${escapeCell(claude)} | ${escapeCell(family.visibleFrom)} | ${status} |`);
  }
  lines.push('', END_MARKER);
  return lines.join('\n');
}

function replaceInventorySection(text, section) {
  const start = text.indexOf(START_MARKER);
  const end = text.indexOf(END_MARKER);
  if (start >= 0 || end >= 0) {
    if (start < 0 || end < 0 || end < start) throw new Error('Katalogets inventorymarkører er ugyldige.');
    return `${text.slice(0, start)}${section}${text.slice(end + END_MARKER.length)}`;
  }
  const heading = '# Skills catalog';
  const headingIndex = text.indexOf(heading);
  if (headingIndex < 0) throw new Error('Kataloget mangler overskriften "# Skills catalog".');
  const insertAt = headingIndex + heading.length;
  return `${text.slice(0, insertAt)}\n\n${section}${text.slice(insertAt)}`;
}

export function writeCatalog(root, relPath, report) {
  const absolute = resolve(root, relPath);
  if (!existsSync(absolute)) throw new Error(`Katalogfil findes ikke: ${relPath}`);
  const current = readFileSync(absolute, 'utf8');
  const next = replaceInventorySection(current, renderInventorySection(report));
  writeFileSync(absolute, next, 'utf8');
  return absolute;
}

export function checkCatalog(root, relPath, report) {
  const absolute = resolve(root, relPath);
  if (!existsSync(absolute)) throw new Error(`Katalogfil findes ikke: ${relPath}`);
  const current = readFileSync(absolute, 'utf8');
  const expected = replaceInventorySection(current, renderInventorySection(report));
  if (current !== expected) throw new Error(`Skill-kataloget er drevet: ${relPath}`);
  return absolute;
}

function printText(report) {
  console.log('SKILL INVENTORY PASS');
  console.log(`Root: ${report.root}`);
  console.log(`Active: ${report.totals.active}`);
  console.log(`Active names: ${report.totals.activeNames}`);
  console.log(`Disabled: ${report.totals.disabled}`);
  console.log(`Archived: ${report.totals.archived}`);
  console.log(`Exact-copy families: ${report.totals.exactCopyFamilies}`);
  console.log(`Redundant active copies: ${report.totals.redundantActiveCopies}`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = scanInventory(options.root, { expectedRoots: options.expectedRoots });
  const catalog = options.catalog || options.checkCatalog;
  if (options.catalog) writeCatalog(options.root, options.catalog, report);
  if (options.checkCatalog) checkCatalog(options.root, options.checkCatalog, report);
  if (options.json) console.log(JSON.stringify({ ...report, catalog }, null, 2));
  else {
    printText(report);
    if (options.catalog) console.log(`Catalog updated: ${options.catalog}`);
    if (options.checkCatalog) console.log(`Catalog verified: ${options.checkCatalog}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`SKILL INVENTORY FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}

export { DEFAULT_CATALOG, END_MARKER, START_MARKER };
