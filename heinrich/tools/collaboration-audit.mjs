#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(HERE, '..', '..');
const PARITY_SCRIPT = join(HERE, 'adapter-parity.mjs');
const TASKS_REL = 'heinrich/agent_brain/tasks';
const PATH_SAMPLE_LIMIT = 20;

function parseArgs(argv) {
  let root = DEFAULT_ROOT;
  let json = false;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--root' && argv[i + 1]) {
      root = resolve(argv[i + 1]);
      i += 1;
    } else if (argv[i] === '--json') {
      json = true;
    } else {
      throw new Error(`Ukendt argument: ${argv[i]}`);
    }
  }
  return { root, json };
}

function run(command, args, cwd) {
  return spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    windowsHide: true,
  });
}

function normalizePath(value) {
  return value.replace(/\\/g, '/').replace(/^\.\//, '');
}

function gitEntries(root) {
  const result = run('git', ['-c', 'core.excludesFile=', 'status', '--porcelain=v1', '-z', '--untracked-files=all'], root);
  if (result.error || result.status !== 0) {
    const detail = (result.stderr || result.error?.message || 'ukendt Git-fejl').trim();
    throw new Error(`Git-status kunne ikke læses: ${detail}`);
  }

  const records = result.stdout.split('\0');
  const entries = [];
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    if (!record) continue;
    if (record.length < 4) throw new Error(`Ugyldig Git-statusrecord: ${JSON.stringify(record)}`);
    const status = record.slice(0, 2);
    const path = normalizePath(record.slice(3));
    entries.push({ path, status });
    if (/[RC]/.test(status) && records[i + 1]) i += 1;
  }
  return entries;
}

function markdownFilesUnder(root, relDirectory) {
  const directory = join(root, relDirectory);
  if (!existsSync(directory)) return [];
  const files = [];
  function walk(current, currentRel) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const absolute = join(current, entry.name);
      const relPath = normalizePath(join(currentRel, entry.name));
      if (entry.isDirectory()) walk(absolute, relPath);
      else if (entry.isFile() && entry.name.endsWith('.md')) files.push(relPath);
    }
  }
  walk(directory, normalizePath(relDirectory));
  return files;
}

function taskFiles(root) {
  const files = new Set(markdownFilesUnder(root, TASKS_REL));
  for (const { workspace } of registeredProjects(root)) {
    for (const relPath of markdownFilesUnder(root, normalizePath(join(workspace, 'tasks')))) {
      files.add(relPath);
    }
  }
  return [...files].sort();
}

function inProgressTasks(root) {
  return taskFiles(root).filter((relPath) => {
    const text = readFileSync(join(root, relPath), 'utf8');
    const frontmatter = /^---\s*\r?\n([\s\S]*?)\r?\n---/.exec(text);
    return frontmatter
      && /^type:\s*task\s*$/m.test(frontmatter[1])
      && /^status:\s*in_progress\s*$/m.test(frontmatter[1]);
  });
}

function registeredProjects(root) {
  const directory = join(root, 'heinrich', 'agent_brain', 'projects');
  if (!existsSync(directory)) return [];
  const projects = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const bridge = join(directory, slug, `${slug}.md`);
    let workspace = slug;
    if (existsSync(bridge)) {
      const text = readFileSync(bridge, 'utf8');
      const frontmatter = /^---\s*\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] || '';
      const declared = /^(?:workspace_path|path):\s*["']?([^"'\r\n]+)["']?\s*$/m.exec(frontmatter)?.[1];
      if (declared) workspace = normalizePath(declared).replace(/^Work\//, '');
    }
    projects.push({ slug, workspace });
  }
  return projects.sort((left, right) => right.workspace.length - left.workspace.length);
}

function projectForPath(relPath, projects) {
  const bridgeMatch = /^heinrich\/agent_brain\/projects\/([^/]+)\//.exec(relPath);
  if (bridgeMatch) return bridgeMatch[1];
  const match = projects.find(({ workspace }) => relPath === workspace || relPath.startsWith(`${workspace}/`));
  return match?.slug || null;
}

function classify(relPath, projects) {
  const path = normalizePath(relPath);
  if (
    path === 'AGENTS.md'
    || path === 'CLAUDE.md'
    || path === 'heinrich/agent_brain/understanding/standards/assistant-core-contract.md'
    || path.startsWith('.agents/skills/')
    || path.startsWith('.githooks/')
    || path.startsWith('heinrich/.claude/')
    || path.startsWith('heinrich/.Codex/')
    || path.startsWith('heinrich/agent_brain/understanding/')
    || path.startsWith('heinrich/tools/')
  ) return { kind: 'protected-core' };

  if (
    path === 'heinrich/artifacts/_changelog.md'
    || path.startsWith('heinrich/agent_brain/tasks/')
    || path.startsWith('heinrich/artifacts/collaboration/')
  ) return { kind: 'shared' };

  const project = projectForPath(path, projects);
  if (project) return { kind: 'project', project };
  return { kind: 'other' };
}

function summarizeDirty(root, entries) {
  const projects = registeredProjects(root);
  const groups = {
    protectedCore: [],
    shared: [],
    projects: {},
    other: [],
  };
  for (const entry of entries) {
    const classification = classify(entry.path, projects);
    const item = { path: entry.path, status: entry.status };
    if (classification.kind === 'protected-core') groups.protectedCore.push(item);
    else if (classification.kind === 'shared') groups.shared.push(item);
    else if (classification.kind === 'project') {
      groups.projects[classification.project] ||= [];
      groups.projects[classification.project].push(item);
    } else groups.other.push(item);
  }
  return groups;
}

function sampleEntries(entries) {
  return {
    count: entries.length,
    entries: entries.slice(0, PATH_SAMPLE_LIMIT),
    truncated: entries.length > PATH_SAMPLE_LIMIT,
  };
}

function compactDirty(groups) {
  const projects = {};
  for (const [project, entries] of Object.entries(groups.projects)) {
    projects[project] = sampleEntries(entries);
  }
  return {
    protectedCore: sampleEntries(groups.protectedCore),
    shared: sampleEntries(groups.shared),
    projects,
    other: sampleEntries(groups.other),
  };
}

function pathSample(entries) {
  return entries.slice(0, PATH_SAMPLE_LIMIT).map((entry) => entry.path);
}

function audit(root) {
  const findings = [];
  const parity = run(process.execPath, [PARITY_SCRIPT, '--root', root], root);
  const parityOutput = `${parity.stdout || ''}${parity.stderr || ''}`.trim();
  findings.push({
    check: 'adapter-parity',
    result: parity.status === 0 ? 'PASS' : 'FAIL',
    evidence: parityOutput || `exit ${parity.status}`,
  });

  const activeTasks = inProgressTasks(root);
  findings.push({
    check: 'single-in-progress',
    result: activeTasks.length <= 1 ? 'PASS' : 'FAIL',
    evidence: activeTasks.length <= 1
      ? `${activeTasks.length} global task med status in_progress.`
      : `${activeTasks.length} globale tasks med status in_progress: ${activeTasks.join(', ')}`,
    paths: activeTasks,
  });

  const entries = gitEntries(root);
  const dirty = summarizeDirty(root, entries);
  if (entries.length === 0) {
    findings.push({ check: 'git-state', result: 'PASS', evidence: 'Arbejdsområdet er clean.' });
  } else {
    findings.push({
      check: 'git-state',
      result: 'NOT VERIFIABLE',
      evidence: `${entries.length} dirty fil(er); Git kan ikke bevise skriver eller autorisation.`,
      paths: pathSample(entries),
      omittedPaths: Math.max(0, entries.length - PATH_SAMPLE_LIMIT),
    });
  }

  if (dirty.protectedCore.length) findings.push({
    check: 'protected-core-ownership',
    result: 'NOT VERIFIABLE',
    evidence: `${dirty.protectedCore.length} dirty fil(er) i beskyttet kerne; ejerskab kræver opgave- eller handoverevidens.`,
    paths: pathSample(dirty.protectedCore),
    omittedPaths: Math.max(0, dirty.protectedCore.length - PATH_SAMPLE_LIMIT),
  });
  if (dirty.shared.length) findings.push({
    check: 'shared-scope-ownership',
    result: 'NOT VERIFIABLE',
    evidence: `${dirty.shared.length} dirty fil(er) i fælles scope; ejerskab kan ikke udledes af Git.`,
    paths: pathSample(dirty.shared),
    omittedPaths: Math.max(0, dirty.shared.length - PATH_SAMPLE_LIMIT),
  });
  for (const [project, paths] of Object.entries(dirty.projects)) findings.push({
    check: `project-scope:${project}`,
    result: 'NOT VERIFIABLE',
    evidence: `${paths.length} dirty fil(er) i projekt ${project}; andre projekter er ikke i sig selv overlap.`,
    paths: pathSample(paths),
    omittedPaths: Math.max(0, paths.length - PATH_SAMPLE_LIMIT),
  });
  if (dirty.other.length) findings.push({
    check: 'unmapped-scope',
    result: 'NOT VERIFIABLE',
    evidence: `${dirty.other.length} dirty fil(er) kunne ikke mappes sikkert til kerne, fælles scope eller registreret projekt.`,
    paths: pathSample(dirty.other),
    omittedPaths: Math.max(0, dirty.other.length - PATH_SAMPLE_LIMIT),
  });

  const overall = findings.some((finding) => finding.result === 'FAIL')
    ? 'FAIL'
    : findings.some((finding) => finding.result === 'NOT VERIFIABLE') ? 'NOT VERIFIABLE' : 'PASS';
  return { root, overall, findings, dirty: compactDirty(dirty) };
}

function printText(report) {
  console.log(`COLLABORATION AUDIT ${report.overall}`);
  console.log(`Root: ${report.root}`);
  for (const finding of report.findings) {
    console.log(`- [${finding.result}] ${finding.check}: ${finding.evidence}`);
    for (const path of finding.paths || []) console.log(`  - ${path}`);
    if (finding.omittedPaths) console.log(`  - … ${finding.omittedPaths} yderligere sti(er)`);
  }
}

let options;
try {
  options = parseArgs(process.argv.slice(2));
  const report = audit(options.root);
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else printText(report);
  if (report.overall === 'FAIL') process.exitCode = 1;
} catch (error) {
  const report = {
    root: options?.root || DEFAULT_ROOT,
    overall: 'FAIL',
    findings: [{ check: 'audit-runtime', result: 'FAIL', evidence: error.message }],
  };
  if (options?.json) console.log(JSON.stringify(report, null, 2));
  else printText(report);
  process.exitCode = 1;
}
