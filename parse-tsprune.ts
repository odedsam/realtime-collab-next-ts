import { readFileSync, writeFileSync } from 'fs';

const raw = readFileSync('tsprune-output.txt', 'utf8')
  .split('\n')
  .filter(Boolean);

const parsed = raw.map(line => {
  const match = line.match(/^(.*):(\d+) - (.+)$/);
  if (!match) return null;

  const [, file, lineNumber, name] = match;
  return { file, line: Number(lineNumber), name };
}).filter(Boolean);

writeFileSync('unused.json', JSON.stringify(parsed, null, 2));
