/**
 * Proves that a shared build carries no model-written 功效／主治.
 *
 * The claim being checked is about the ARTIFACT, not about the source or the
 * UI, so this reads the built files off disk and greps them. A test asserting
 * `modelWritten` is empty under the alias would prove something weaker: it
 * would prove the app cannot display the content, not that the content is
 * absent from what gets served. Those differ by exactly one devtools tab.
 *
 * Run it against `dist/` after `npm run build:shared`:
 *
 *     npm run build:shared && npm run verify:shared
 *
 * It fails loudly rather than warning. A build that still carries the strings
 * is one that must not be deployed, and a check whose failure is easy to scroll
 * past is not a gate.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { modelWritten } from '../src/data/indications.model';
import { indicationsByCode } from '../src/data/indications';

const DIST = join(import.meta.dirname, '..', 'dist');

/** Every file in dist, recursively. Assets included — the point is exhaustiveness. */
function allFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? allFiles(path) : [path];
  });
}

/**
 * Strings that belong to the model module ALONE.
 *
 * The two tables overlap in wording, so grepping for everything `modelWritten`
 * says would flag the file-sourced copy and fail a correct build. Subtracting
 * what the sourced table also says leaves only strings whose presence in the
 * bundle can have exactly one explanation.
 *
 * The subtraction is CONTAINMENT, not equality, and that distinction is the
 * whole reason this function exists. KI26's model-written 「宣肺止咳」 is a
 * prefix of LU2's file-sourced 「宣肺止咳、瀉胸中熱邪」, so a correct build —
 * one that carries LU2 and has never heard of KI26 — contains the shorter
 * string anyway. Equality let five such needles through and the check failed a
 * build that was in fact clean.
 *
 * Nothing is lost by dropping them: a needle contained in a string the build
 * legitimately carries cannot evidence a leak however it is searched for. The
 * six hundred that survive the subtraction are what carries the proof.
 */
function modelOnlyStrings(): string[] {
  const sourced: string[] = [];
  for (const entry of Object.values(indicationsByCode)) {
    for (const v of [entry.actionsZh, entry.actionsEn, entry.indicationsZh, entry.indicationsEn]) {
      if (v) sourced.push(v);
    }
  }
  const model = new Set<string>();
  for (const entry of Object.values(modelWritten)) {
    for (const v of [entry.actionsZh, entry.actionsEn, entry.indicationsZh, entry.indicationsEn]) {
      /* Short strings risk colliding with unrelated text; the long ones are
         what a leak would actually look like. */
      if (!v || v.length < 4) continue;
      if (sourced.some((s) => s.includes(v))) continue;
      model.add(v);
    }
  }
  return [...model];
}

function main(): void {
  let files: string[];
  try {
    files = allFiles(DIST);
  } catch {
    console.error(`No build at ${DIST}. Run \`npm run build:shared\` first.`);
    process.exit(1);
  }

  const needles = modelOnlyStrings();
  if (needles.length === 0) {
    /*
     * In the open-source distribution `indications.model.ts` ships with no
     * entries at all, so there is genuinely nothing to strip and nothing to
     * grep for. That case is distinguishable from the dangerous one — a
     * populated model whose strings all collide with sourced text — by the
     * table itself being empty, and only that case passes.
     */
    if (Object.keys(modelWritten).length === 0) {
      console.log(
        'PASS — the model table is empty in this distribution; there is nothing to strip. ' +
          'The gate re-arms if entries are ever added to indications.model.ts.',
      );
      return;
    }
    console.error('Found no model-only strings to look for — the check would pass vacuously.');
    process.exit(1);
  }

  const found: { file: string; needle: string }[] = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const needle of needles) {
      if (text.includes(needle)) found.push({ file: file.slice(DIST.length + 1), needle });
    }
  }

  if (found.length > 0) {
    console.error(
      `FAIL — the build carries ${found.length} model-written string(s). Do not deploy it.\n`,
    );
    for (const { file, needle } of found.slice(0, 10)) {
      console.error(`  ${file}: ${JSON.stringify(needle)}`);
    }
    if (found.length > 10) console.error(`  … and ${found.length - 10} more`);
    console.error('\nWas this built with `--mode shared`?');
    process.exit(1);
  }

  console.log(
    `PASS — checked ${files.length} built file(s) against ${needles.length} model-only strings. None present.`,
  );
}

main();
