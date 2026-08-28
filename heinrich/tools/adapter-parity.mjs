#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(HERE, '..', '..');
const CONTRACT_REL = 'heinrich/agent_brain/understanding/standards/assistant-core-contract.md';
const RUNTIME_FILES = ['AGENTS.md', 'CLAUDE.md'];
const REQUIRED_BLOCKS = ['security', 'quality', 'privacy', 'collaboration'];

function parseArgs(argv) {
  let root = DEFAULT_ROOT;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--root' && argv[i + 1]) {
      root = resolve(argv[i + 1]);
      i += 1;
    } else {
      throw new Error(`Ukendt argument: ${argv[i]}`);
    }
  }
  return { root };
}

function normalizeContent(value) {
  return value.replace(/\r\n/g, '\n').trim();
}

function parseMetadata(value, file, errors) {
  const metadata = {};
  for (const rawLine of value.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = /^([a-z_]+):\s*(.+)$/.exec(line);
    if (!match) {
      errors.push(`${file}: ugyldig adapter-parity metadata: "${line}"`);
      continue;
    }
    metadata[match[1]] = match[2].trim();
  }
  return metadata;
}

function parseBlocks(text, file, errors) {
  const blocks = new Map();
  const pattern = /<!--\s*adapter-parity\s*\r?\n([\s\S]*?)-->\s*\r?\n([\s\S]*?)<!--\s*\/adapter-parity\s*-->/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const metadata = parseMetadata(match[1], file, errors);
    const id = metadata.block;
    if (!id) {
      errors.push(`${file}: marker mangler \`block\`.`);
      continue;
    }
    if (blocks.has(id)) {
      errors.push(`${file}: blok \`${id}\` findes mere end én gang.`);
      continue;
    }
    blocks.set(id, { metadata, content: normalizeContent(match[2]) });
  }
  return blocks;
}

function frontmatterUpdated(text, file, errors) {
  const frontmatter = /^---\s*\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!frontmatter) {
    errors.push(`${file}: mangler YAML-frontmatter.`);
    return null;
  }
  const updated = /^updated:\s*(\d{4}-\d{2}-\d{2})\s*$/m.exec(frontmatter[1]);
  if (!updated) {
    errors.push(`${file}: mangler \`updated: YYYY-MM-DD\`.`);
    return null;
  }
  return updated[1];
}

function firstDifference(expected, actual) {
  const left = expected.split('\n');
  const right = actual.split('\n');
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i += 1) {
    if (left[i] !== right[i]) return i + 1;
  }
  return null;
}

function read(root, relPath) {
  return readFileSync(join(root, relPath), 'utf8');
}

function check(root) {
  const errors = [];
  const contractText = read(root, CONTRACT_REL);
  const contractUpdated = frontmatterUpdated(contractText, CONTRACT_REL, errors);
  const canonical = parseBlocks(contractText, CONTRACT_REL, errors);

  for (const id of REQUIRED_BLOCKS) {
    const block = canonical.get(id);
    if (!block) {
      errors.push(`${CONTRACT_REL}: mangler kanonisk blok \`${id}\`.`);
      continue;
    }
    if (block.metadata.role !== 'canonical') {
      errors.push(`${CONTRACT_REL}: blok \`${id}\` skal have \`role: canonical\`.`);
    }
  }

  for (const id of canonical.keys()) {
    if (!REQUIRED_BLOCKS.includes(id)) {
      errors.push(`${CONTRACT_REL}: ukendt blok \`${id}\` er ikke i kontrollens scan-sæt.`);
    }
  }

  for (const runtimeFile of RUNTIME_FILES) {
    const runtime = parseBlocks(read(root, runtimeFile), runtimeFile, errors);

    for (const id of REQUIRED_BLOCKS) {
      const expected = canonical.get(id);
      const actual = runtime.get(id);
      if (!actual) {
        errors.push(`${runtimeFile}: mangler runtime-blok \`${id}\`.`);
        continue;
      }
      if (actual.metadata.role !== 'runtime-copy') {
        errors.push(`${runtimeFile}: blok \`${id}\` skal have \`role: runtime-copy\`.`);
      }
      if (actual.metadata.derives_from !== CONTRACT_REL) {
        errors.push(`${runtimeFile}: blok \`${id}\` skal have \`derives_from: ${CONTRACT_REL}\`.`);
      }
      if (contractUpdated && actual.metadata.synced !== contractUpdated) {
        errors.push(`${runtimeFile}: blok \`${id}\` har synced ${actual.metadata.synced || 'mangler'}; kontrakten er ${contractUpdated}.`);
      }
      if (expected && actual.content !== expected.content) {
        const line = firstDifference(expected.content, actual.content);
        errors.push(`${runtimeFile}: blok \`${id}\` afviger fra kontrakten ved bloklinje ${line}.`);
      }
    }

    for (const id of runtime.keys()) {
      if (!REQUIRED_BLOCKS.includes(id)) {
        errors.push(`${runtimeFile}: ukendt runtime-blok \`${id}\` er ikke i kontrollens scan-sæt.`);
      }
    }
  }

  return errors;
}

let root;
try {
  ({ root } = parseArgs(process.argv.slice(2)));
  const errors = check(root);
  if (errors.length) {
    console.error('ADAPTER PARITY FEJLEDE');
    console.error(`Root: ${root}`);
    for (const error of errors) console.error(`- ${error}`);
    console.error(`\nRet runtime-kopierne mod ${CONTRACT_REL}; kontrakten vinder.`);
    process.exitCode = 1;
  } else {
    console.log(`Adapter parity OK: ${REQUIRED_BLOCKS.length} blokke × ${RUNTIME_FILES.length} runtime-kopier.`);
    console.log(`Kanonisk ejer: ${relative(root, join(root, CONTRACT_REL)).replace(/\\/g, '/')}`);
  }
} catch (error) {
  console.error(`ADAPTER PARITY KUNNE IKKE KØRE: ${error.message}`);
  process.exitCode = 1;
}
