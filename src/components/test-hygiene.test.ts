import { describe, expect, it } from 'vitest';
/*
 * This tsconfig carries no node types (`types: ["vite/client"]`), and adding a
 * dependency for one guard costs more than the suppression — the same trade
 * nav.test.tsx makes to read styles.css off disk.
 */
// @ts-expect-error -- no node types in the app tsconfig; see above.
import { readdirSync, readFileSync } from 'node:fs';

/**
 * Every file that mounts a component must unmount it again.
 *
 * The suite runs with `globals: false`, so Testing Library registers no
 * automatic cleanup: a render survives the test that made it, and at the end of
 * the file it is still mounted. React defers work through setImmediate, so a
 * queued callback could wake after vitest tore jsdom down and reach for a
 * `window` that no longer existed —
 *
 *   ReferenceError: window is not defined
 *     at react-dom-client.development.js  ❯ performWorkUntilDeadline
 *
 * — reported as an unhandled error against the whole file rather than any one
 * test. It was racy: atlas.test.tsx, the only file that had drifted without
 * `afterEach(cleanup)`, produced it on five runs in eight, and none with it.
 *
 * Nothing in vitest enforces this per file, and the failure it causes names no
 * test and does not fail the run — so it can sit in a green suite indefinitely.
 * Hence a guard that reads the files rather than a convention anyone has to
 * remember.
 */

// Vitest's cwd is the app root — that is where `npm test` runs.
const testFiles = (dir: string): string[] => {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...testFiles(path));
    else if (/\.test\.tsx?$/.test(entry.name)) out.push(path);
  }
  return out;
};

/**
 * Source with comments removed.
 *
 * The first version of this guard failed against itself: the prose above
 * quotes `afterEach(cleanup)`, and a plain text search cannot tell an example
 * from a call. It is the same trap a CSS check in this repo fell into earlier,
 * where a rule's own comment quoted the value being asserted against. Stripping
 * comments also means a commented-OUT registration reads as absent, which is
 * what it is.
 */
const code = (body: string): string =>
  body.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');

describe('test hygiene', () => {
  const files = testFiles('src').map((path) => ({
    path,
    body: code(readFileSync(path, 'utf8') as string),
  }));

  it('finds the suite where it expects to', () => {
    // A glob that silently matched nothing would make every check below vacuous.
    expect(files.length).toBeGreaterThan(30);
    expect(files.map((f) => f.path)).toContain('src/components/atlas.test.tsx');
  });

  it('unmounts in every file that renders', () => {
    const rendering = files.filter((f) => /\brender\(/.test(f.body));
    // Rendering files are the majority of the .tsx suites; if this count
    // collapses, the check below has stopped looking at anything.
    expect(rendering.length).toBeGreaterThan(5);

    const leaking = rendering
      .filter((f) => !/afterEach\(\s*cleanup\s*\)/.test(f.body))
      .map((f) => f.path);
    expect(leaking).toEqual([]);
  });

  it('imports the cleanup it registers', () => {
    // `afterEach(cleanup)` with cleanup undefined throws at collection, but a
    // stray local named cleanup would pass the check above while doing nothing.
    for (const f of files) {
      if (!/afterEach\(\s*cleanup\s*\)/.test(f.body)) continue;
      expect({
        path: f.path,
        imported: /import\s*\{[^}]*\bcleanup\b[^}]*\}\s*from\s*'@testing-library\/react'/.test(
          f.body,
        ),
      }).toEqual({ path: f.path, imported: true });
    }
  });
});
