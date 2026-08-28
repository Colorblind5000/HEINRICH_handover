#!/usr/bin/env node

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  checkCatalog,
  scanInventory,
  writeCatalog,
} from './skill-inventory.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function write(root, relPath, content) {
  const absolute = join(root, ...relPath.split('/'));
  mkdirSync(join(absolute, '..'), { recursive: true });
  writeFileSync(absolute, content, 'utf8');
}

function skill(name, body = 'body') {
  return `---\nname: ${name}\ndescription: Test ${name}.\n---\n\n${body}\n`;
}

function expectFailure(callback, pattern, label) {
  let caught = null;
  try {
    callback();
  } catch (error) {
    caught = error;
  }
  assert(caught, `${label}: forventede fejl.`);
  assert(pattern.test(caught.message), `${label}: uventet fejl: ${caught.message}`);
}

const root = mkdtempSync(join(tmpdir(), 'heinrich-skill-inventory-'));
try {
  write(root, '.gitignore', '.agents/\n.claude/\nproject/.claude/\n');
  write(root, '.agents/skills/work-core/SKILL.md', skill('work-core'));
  write(root, '.claude/skills/work-claude/SKILL.md', skill('work-claude'));
  write(root, 'project/.agents/skills/project-shared/SKILL.md', skill('project-shared', 'codex'));
  write(root, 'project/.claude/skills/project-shared/SKILL.md', skill('project-shared', 'claude'));
  write(root, 'project/.claude/skills/exact/SKILL.md', skill('exact'));
  write(root, 'other/.claude/skills/exact/SKILL.md', skill('exact'));
  write(root, 'project/.claude/skills-disabled/off/SKILL.md', skill('off'));
  write(root, 'project/.claude/skills-archive/2026/old/SKILL.md', skill('old'));
  write(root, 'project/_archive/webflow-skills/history/SKILL.md', skill('history'));
  write(root, '.git/fake/SKILL.md', skill('git-fake'));
  write(root, 'node_modules/pkg/SKILL.md', skill('node-fake'));
  write(root, '.claude/worktrees/tmp/project/.claude/skills/worktree/SKILL.md', skill('worktree-fake'));
  write(root, '.codex/plugins/cache/plugin/skills/plugin/SKILL.md', skill('plugin-fake'));
  write(root, 'heinrich/docs/04-skills-catalog.md', '# Skills catalog\n\nBevar denne tekst.\n');

  const report = scanInventory(root);
  assert(report.totals.active === 6, `aktive: forventede 6, fik ${report.totals.active}`);
  assert(report.totals.disabled === 1, `disabled: forventede 1, fik ${report.totals.disabled}`);
  assert(report.totals.archived === 2, `arkiverede: forventede 2, fik ${report.totals.archived}`);
  assert(report.totals.files === 9, `filer: forventede 9, fik ${report.totals.files}`);
  assert(report.totals.exactCopyFamilies === 1, 'exact-copy-familien blev ikke fundet.');
  assert(report.totals.redundantActiveCopies === 1, 'redundant kopi blev ikke talt.');
  assert(!report.instances.some((item) => /fake|worktree/.test(item.name)), 'ekskluderet støj blev scannet.');
  assert(report.instances.some((item) => item.path.startsWith('.agents/')), '.agents blev overset.');
  assert(report.instances.some((item) => item.path.startsWith('.claude/')), '.claude blev overset.');

  writeCatalog(root, 'heinrich/docs/04-skills-catalog.md', report);
  checkCatalog(root, 'heinrich/docs/04-skills-catalog.md', report);
  const catalog = readFileSync(join(root, 'heinrich', 'docs', '04-skills-catalog.md'), 'utf8');
  assert(catalog.includes('Bevar denne tekst.'), 'kataloggeneratoren overskrev fremmed tekst.');
  assert(catalog.includes('Verificeret live-inventory'), 'inventorysektionen mangler.');

  write(root, 'heinrich/docs/04-skills-catalog.md', catalog.replace('Aktive skillfiler: **6**', 'Aktive skillfiler: **999**'));
  expectFailure(
    () => checkCatalog(root, 'heinrich/docs/04-skills-catalog.md', report),
    /drevet/,
    'catalog drift',
  );

  expectFailure(
    () => scanInventory(root, { expectedRoots: ['.agents/skills', 'missing/skills'] }),
    /Forventet skillrod mangler/,
    'missing expected root',
  );

  console.log('skill-inventory.test.mjs PASS');
} finally {
  rmSync(root, { recursive: true, force: true });
}
