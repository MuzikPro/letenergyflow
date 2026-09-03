import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/*
 * A new id per build, stamped into the service worker's cache name.
 *
 * Without it the cache key was the constant 'lef-shell-v1', so a redeploy left
 * every previously cached asset in place for good: `activate` only clears keys
 * that differ from the current one, and the current one never differed. Fresh
 * builds were still picked up — navigations are network-first and Vite hashes
 * asset filenames — but the old entries were never evicted.
 *
 * Plain `Date.now()`, evaluated when the config loads. No node imports, which
 * this tsconfig has no types for.
 */
const BUILD_ID = Date.now().toString(36);

/*
 * The shared build: `vite build --mode shared`.
 *
 * `CLAUDE.md` licenses the model-written 功效／主治 for personal study in a
 * private repository and forbids presenting them to anyone else. Any build that
 * leaves this machine — the tester gate included, since handing out logins is
 * presenting — therefore has to be without them.
 *
 * It has to be a BUILD-time strip, not a render-time one. The dataset is
 * compiled into the JS bundle, so a UI that merely declines to draw the fields
 * still ships every string to the browser, where devtools reads them straight
 * out of the chunk. Aliasing the module is what actually removes them: the
 * empty stub has no entries, so nothing downstream has anything to emit and the
 * bundler has nothing to include.
 *
 * The regex matches the relative specifier `./indications.model` exactly as
 * `indications.ts` writes it. Nothing else imports that module, so the narrow
 * match is the whole surface. `scripts/verify-shared-build.ts` greps the built
 * output for known model-only strings rather than trusting any of this.
 */
const STRIP_MODEL_INDICATIONS = {
  find: /^\.\/indications\.model$/,
  replacement: '/src/data/indications.model.empty.ts',
};

// Local-first static app. No proxy, no backend, no analytics.
export default defineConfig(({ mode }) => ({
  /*
   * Absolute, because the app now has real URLs: `/details/wrist_hand` is a
   * page a learner can bookmark. With a relative base its assets would resolve
   * against `/details/`, so every deep link would load a blank page.
   */
  base: '/',
  define: {
    __SW_BUILD__: JSON.stringify(BUILD_ID),
  },
  resolve: {
    alias: mode === 'shared' ? [STRIP_MODEL_INDICATIONS] : [],
  },
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    /*
     * Several suites mount the whole app — the atlas alone draws 362 markers —
     * and in jsdom that runs well past vitest's 5s default whenever the files
     * run in parallel. They were passing alone and timing out in the suite,
     * which surfaced one test at a time as the machine got busier. A single
     * generous default stops the whack-a-mole; a real hang still fails, just
     * later.
     */
    testTimeout: 30000,
    globals: false,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
}));
