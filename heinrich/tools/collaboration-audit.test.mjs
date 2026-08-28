#!/usr/bin/env node

import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIVE_ROOT = resolve(HERE, '..', '..');
const SCRIPT = join(HERE, 'collaboration-audit.mjs');
const TEMP_ROOT = mkdtempSync(join(tmpdir(), 'heinrich-collaboration-audit-'));
const BASE_FILES = [
  'AGENTS.md',
  'CLAUDE.md',
  'heinrich/agent_brain/understanding/standards/assistant-core-contract.md',
  'heinrich/tools/adapter-parity.mjs',
];

function exec(command, args, cwd) {
  return spawnSync(command, args, { cwd, encoding: 'utf8', windowsHide: true });
}

function assert(condition, message, result) {
  if (condition) return;
  const detail = result ? `\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}` : '';
  throw new Error(`${message}${detail}`);
}

function write(root, relPath, content) {
  const target = join(root, relPath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
}

function git(root, args) {
  const result = exec('git', ['-c', 'core.excludesFile=', ...args], root);
  assert(result.status === 0, `Git fejlede: ${args.join(' ')}`, result);
  return result;
}

function bareFixture(name, projects = []) {
  const root = join(TEMP_ROOT, name, 'Work');
  for (const relPath of BASE_FILES) {
    const target = join(root, relPath);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(LIVE_ROOT, relPath), target);
  }
  write(root, 'heinrich/agent_brain/tasks/.keep', '');
  for (const projectValue of projects) {
    const project = typeof projectValue === 'string' ? { slug: projectValue, workspace: projectValue } : projectValue;
    write(root, `heinrich/agent_brain/projects/${project.slug}/${project.slug}.md`, `---\nlifecycle: active\nworkspace_path: ${project.workspace}\n---\n# ${project.slug}\n`);
    write(root, `${project.workspace}/file.md`, `# ${project.slug}\n`);
  }
  return root;
}

function fixture(name, projects = []) {
  const root = bareFixture(name, projects);
  git(root, ['init', '--quiet']);
  git(root, ['add', '.']);
  git(root, ['-c', 'user.name=HEINRICH Eval', '-c', 'user.email=eval@example.invalid', 'commit', '--quiet', '-m', 'fixture']);
  return root;
}

function audit(root) {
  const result = exec(process.execPath, [SCRIPT, '--root', root, '--json'], root);
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    throw new Error(`Audit returnerede ikke JSON.\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }
  return { result, report };
}

try {
  const cleanRoot = fixture('clean');
  const clean = audit(cleanRoot);
  assert(clean.result.status === 0 && clean.report.overall === 'PASS', 'Clean fixture skulle være PASS.', clean.result);

  const parityRoot = fixture('parity');
  const claudePath = join(parityRoot, 'CLAUDE.md');
  writeFileSync(claudePath, readFileSync(claudePath, 'utf8').replace('Parallelt arbejde er tilladt', 'Parallelt arbejde er aldrig tilladt'), 'utf8');
  const parity = audit(parityRoot);
  assert(parity.result.status === 1 && parity.report.overall === 'FAIL', 'Parity-brud skulle være FAIL med exit 1.', parity.result);
  assert(parity.report.findings.some((item) => item.check === 'adapter-parity' && item.result === 'FAIL'), 'Parity-brud mangler konkret finding.');

  const taskRoot = fixture('two-tasks', ['alpha']);
  write(taskRoot, 'heinrich/agent_brain/tasks/one.md', '---\ntype: task\nstatus: in_progress\n---\n# one\n');
  write(taskRoot, 'alpha/tasks/two.md', '---\ntype: task\nstatus: in_progress\nproject: alpha\n---\n# two\n');
  git(taskRoot, ['add', '.']);
  git(taskRoot, ['-c', 'user.name=HEINRICH Eval', '-c', 'user.email=eval@example.invalid', 'commit', '--quiet', '-m', 'two tasks']);
  const tasks = audit(taskRoot);
  assert(tasks.result.status === 1 && tasks.report.findings.some((item) => item.check === 'single-in-progress' && item.result === 'FAIL'), 'Central plus satellit in_progress skulle være global FAIL.', tasks.result);

  const statesRoot = fixture('states', ['alpha', 'beta', 'gamma']);
  write(statesRoot, 'alpha/file.md', '# alpha changed\n');
  write(statesRoot, 'beta/file.md', '# beta staged\n');
  git(statesRoot, ['add', 'beta/file.md']);
  write(statesRoot, 'gamma/untracked.md', '# gamma untracked\n');
  const states = audit(statesRoot);
  assert(states.result.status === 0 && states.report.overall === 'NOT VERIFIABLE', 'Dirty Git-tilstand skulle være NOT VERIFIABLE med exit 0.', states.result);
  assert(states.report.dirty.projects.alpha.entries.some((item) => item.status === ' M'), 'Unstaged fil blev ikke klassificeret korrekt.');
  assert(states.report.dirty.projects.beta.entries.some((item) => item.status === 'M '), 'Staged fil blev ikke klassificeret korrekt.');
  assert(states.report.dirty.projects.gamma.entries.some((item) => item.status === '??'), 'Untracked fil blev ikke klassificeret korrekt.');
  assert(!states.report.findings.some((item) => item.result === 'FAIL'), 'Forskellige dirty satellitter må ikke blive automatisk FAIL.');

  const coreRoot = fixture('dirty-core');
  write(coreRoot, '.agents/skills/example/SKILL.md', '---\nname: example\ndescription: example\n---\n# Example\n');
  const core = audit(coreRoot);
  assert(core.result.status === 0 && core.report.findings.some((item) => item.check === 'protected-core-ownership' && item.result === 'NOT VERIFIABLE'), 'Dirty kerne skulle være NOT VERIFIABLE.', core.result);

  const sameRoot = fixture('same-project', ['alpha']);
  write(sameRoot, 'alpha/file.md', '# changed\n');
  write(sameRoot, 'alpha/second.md', '# second\n');
  const same = audit(sameRoot);
  const alpha = same.report.findings.find((item) => item.check === 'project-scope:alpha');
  assert(same.result.status === 0 && alpha?.result === 'NOT VERIFIABLE' && alpha.paths.length === 2, 'Samme projektscope uden ejerskab skulle være NOT VERIFIABLE.', same.result);

  const nestedRoot = fixture('nested-project', [{ slug: 'kunde', workspace: 'eksempel-projekt/kunde' }]);
  write(nestedRoot, 'eksempel-projekt/kunde/file.md', '# nested changed\n');
  const nested = audit(nestedRoot);
  assert(nested.report.dirty.projects.kunde?.count === 1, 'Nestet workspace_path skulle mappes til bridge-sluggen.', nested.result);

  const protectedRoot = fixture('protected-constitutions', [{ slug: 'kerne-projekt', workspace: 'heinrich' }]);
  write(protectedRoot, 'heinrich/.Codex/constitution/test.md', '# Codex\n');
  write(protectedRoot, 'heinrich/.claude/constitution/test.md', '# Claude\n');
  write(protectedRoot, '.githooks/pre-commit', '# hook\n');
  const protectedPaths = audit(protectedRoot);
  const protectedEntries = protectedPaths.report.dirty.protectedCore.entries.map((item) => item.path);
  assert(protectedEntries.includes('heinrich/.Codex/constitution/test.md'), 'Codex-constitution skulle være beskyttet kerne.', protectedPaths.result);
  assert(protectedEntries.includes('heinrich/.claude/constitution/test.md'), 'Claude-constitution skulle være beskyttet kerne.', protectedPaths.result);
  assert(protectedEntries.includes('.githooks/pre-commit'), 'Git-hook skulle være beskyttet kerne.', protectedPaths.result);
  assert(!protectedPaths.report.dirty.projects['kerne-projekt'], 'Beskyttet kerne må ikke sluges af workspace_path heinrich.', protectedPaths.result);

  const runtimeRoot = bareFixture('runtime-error');
  const runtime = audit(runtimeRoot);
  assert(runtime.result.status === 1 && runtime.report.overall === 'FAIL', 'Ikke-Git-rod skulle returnere FAIL med exit 1.', runtime.result);
  assert(runtime.report.findings.some((item) => item.check === 'audit-runtime' && item.result === 'FAIL'), 'Runtime-fejl mangler audit-runtime finding.', runtime.result);

  console.log('Collaboration audit tests OK: parity, globalt fokus på centrale og satellit-tasks, Git states, core ownership, protected paths, runtime-fejl samt fladt og nestet projektscope.');
} finally {
  const resolvedTemp = resolve(TEMP_ROOT);
  const resolvedBase = resolve(tmpdir());
  if (!resolvedTemp.startsWith(`${resolvedBase}\\`) && !resolvedTemp.startsWith(`${resolvedBase}/`)) {
    throw new Error(`Afviser cleanup uden for temp: ${resolvedTemp}`);
  }
  if (!basename(resolvedTemp).startsWith('heinrich-collaboration-audit-')) {
    throw new Error(`Afviser cleanup af uventet tempmappe: ${resolvedTemp}`);
  }
  rmSync(resolvedTemp, { recursive: true, force: true });
}
