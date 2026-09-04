/**
 * Regenerates `src/i18n/chrome-keys.ts`.
 *
 *     npx tsx scripts/extract-chrome-keys.ts
 *
 * Chrome is defined mechanically rather than by judgement: a string is chrome
 * when it appears as a LITERAL pair in a `t('中文', 'English')` call inside the
 * UI code (App.tsx, components/, views/). Curated content never appears that
 * way — it lives in `src/data` as records and reaches `t()` through variables
 * — so the two sets cannot overlap by accident. `i18n.test.ts` re-runs this
 * extraction and fails if the checked-in file has drifted, which is what keeps
 * the definition honest as the UI grows.
 *
 * The registry decides which strings the 简体 converter may touch. Everything
 * outside it keeps the characters its source used.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const UI_ROOTS = ['src/App.tsx', 'src/components', 'src/views'];
const PAIR = /\bt\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*[,)]/g;

function files(path: string): string[] {
  if (statSync(path).isFile()) return /\.tsx?$/.test(path) && !path.includes('.test.') ? [path] : [];
  return readdirSync(path).flatMap((n) => files(join(path, n)));
}

export function extractChromeKeys(): string[] {
  const found = new Set<string>();
  for (const root of UI_ROOTS) {
    for (const file of files(root)) {
      const text = readFileSync(file, 'utf8');
      for (const m of text.matchAll(PAIR)) found.add(m[2]!);
    }
  }
  return [...found].sort();
}

function main(): void {
  const keys = extractChromeKeys();
  const body = keys.map((k) => `  ${JSON.stringify(k)},`).join('\n');
  writeFileSync(
    'src/i18n/chrome-keys.ts',
    `/**
 * GENERATED — do not edit. Run \`npx tsx scripts/extract-chrome-keys.ts\`.
 *
 * Every English string the interface renders through a literal
 * \`t('中文', 'English')\` call, which is this project's mechanical definition
 * of "chrome this project wrote". See the script for why that definition can
 * be trusted, and \`ui.ts\` for what the registry is used to decide.
 */
export const CHROME_KEYS_GENERATED: readonly string[] = [
${body}
];
`,
    'utf8',
  );
  console.log(`Wrote src/i18n/chrome-keys.ts — ${keys.length} chrome strings.`);
}

if (process.argv[1]?.endsWith('extract-chrome-keys.ts')) main();
