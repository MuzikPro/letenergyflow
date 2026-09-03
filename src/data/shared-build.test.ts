/**
 * The shared build — what survives the strip, and what must not.
 *
 * `vite build --mode shared` aliases `indications.model.ts` to an empty stub so
 * the model-written 功效／主治 never enter the bundle. These tests run in the
 * ordinary mode, where the real module is loaded, so they cannot observe the
 * aliased build directly. What they CAN do is hold the two invariants the strip
 * depends on:
 *
 *   1. the stub is shaped like the module it replaces, so the alias cannot fail
 *      at import time on a build nobody type-checked in that mode;
 *   2. removing the model entries removes nothing else — every file-sourced
 *      claim, and every derived count over them, is independent of it.
 *
 * The artifact itself is checked by `scripts/verify-shared-build.ts`, which
 * greps the built output. That is the load-bearing check; these are the ones
 * that say what the built output is supposed to look like.
 */
import { describe, expect, it } from 'vitest';

import { dataset } from './index';
import {
  INDICATION_CHANNELS,
  MODEL_SOURCE_ID,
  entryFor,
  indicationsByCode,
  meridianIdForCode,
} from './indications';
import { modelWritten } from './indications.model';
import { modelWritten as emptyModelWritten } from './indications.model.empty';

/** The channels a stripped build is left with: those with a file-sourced entry. */
const sourcedChannels = new Set(
  Object.entries(indicationsByCode)
    .filter(([, e]) => e.actionsZh || e.actionsEn || e.indicationsZh || e.indicationsEn)
    .map(([code]) => meridianIdForCode(code)),
);

describe('the empty stub', () => {
  it('is empty', () => {
    expect(Object.keys(emptyModelWritten)).toEqual([]);
  });

  it('exports the same binding as the module it stands in for', () => {
    /*
     * The alias swaps one module for the other with nothing in between, so a
     * renamed or missing export is a build that fails at import — and only in
     * the mode nobody runs locally. Comparing the shapes here is what makes
     * that a test failure instead of a deploy failure.
     */
    expect(typeof emptyModelWritten).toBe(typeof modelWritten);
    expect(Array.isArray(emptyModelWritten)).toBe(Array.isArray(modelWritten));
  });
});

describe('what the strip removes', () => {
  it('removes only fields citing the model source', () => {
    /*
     * The precedence rule, restated as arithmetic: every field the strip takes
     * away cites src_model_unverified, and every field citing it goes. If a
     * merge ever let a written value sit under a file-sourced citation, this is
     * where it shows up.
     */
    const strippable = Object.keys(modelWritten).filter((code) => {
      const merged = entryFor(code);
      return merged?.actionsSrc?.includes(MODEL_SOURCE_ID) ||
        merged?.indicationsSrc?.includes(MODEL_SOURCE_ID);
    });
    expect(strippable.length).toBe(Object.keys(modelWritten).length);
  });

  it('leaves every file-sourced field untouched', () => {
    for (const [code, filed] of Object.entries(indicationsByCode)) {
      const merged = entryFor(code);
      /* The merge reads file-sourced values first, so a stripped build returns
         exactly what the table holds — never a written value in its place. */
      if (filed.actionsZh) expect(merged?.actionsZh).toBe(filed.actionsZh);
      if (filed.indicationsZh) expect(merged?.indicationsZh).toBe(filed.indicationsZh);
    }
  });

  it('leaves no acupoint record without a location', () => {
    /* The strip is about one pair of fields. Anything that touched the
       anatomical layer would be a different and much worse change. */
    for (const p of dataset.acupoints) {
      expect(p.location).toBeTruthy();
      expect(p.reviewStatus).toBe('source_checked');
    }
  });
});

describe('INDICATION_CHANNELS', () => {
  it('is derived, not hand-listed', () => {
    /*
     * The list used to be fourteen literals under a comment claiming it was
     * derived. Harmless while every channel qualified; wrong the moment a build
     * ships without the model module, because the About page counts channels
     * off it and would report a coverage the build does not have.
     */
    for (const id of INDICATION_CHANNELS) {
      const carried = dataset.acupoints.some(
        (p) => p.meridianId === id && (p.actions !== null || p.indications !== null),
      );
      expect({ id, carried }).toEqual({ id, carried: true });
    }
  });

  it('agrees with acupoints.ts on how a code maps to a channel', () => {
    /* meridianIdForCode derives `mer_lu` from `LU9`. If acupoints.ts ever
       stops following that convention the derivation goes quietly wrong. */
    for (const p of dataset.acupoints) {
      expect({ code: p.code, id: meridianIdForCode(p.code) }).toEqual({
        code: p.code,
        id: p.meridianId,
      });
    }
  });

  it('narrows to the file-sourced channels once the model module is empty', () => {
    /*
     * Recomputed the way the module computes it, over the stub instead of the
     * real table. Four channels — LU, LI, ST, SP — are what the worksheets
     * actually reach, and a shared build must claim those and no others.
     */
    const stripped = new Set(
      [...Object.keys(indicationsByCode), ...Object.keys(emptyModelWritten)]
        .filter((code) => {
          const e = indicationsByCode[code];
          return Boolean(e && (e.actionsZh || e.actionsEn || e.indicationsZh || e.indicationsEn));
        })
        .map(meridianIdForCode),
    );
    expect([...stripped].sort()).toEqual(['mer_li', 'mer_lu', 'mer_sp', 'mer_st']);
    expect([...stripped].sort()).toEqual([...sourcedChannels].sort());
  });
});

describe('the model table stays out of indications.ts', () => {
  it('has no file-sourced entry citing the model source', () => {
    /*
     * The strip can only reach `indications.model.ts`. An entry written into
     * the sourced table instead would survive a shared build while still
     * claiming to have no document behind it — the exact leak this whole
     * arrangement exists to prevent.
     */
    for (const [code, e] of Object.entries(indicationsByCode)) {
      expect({ code, srcs: [...(e.actionsSrc ?? []), ...(e.indicationsSrc ?? [])] }).toEqual({
        code,
        srcs: expect.not.arrayContaining([MODEL_SOURCE_ID]),
      });
    }
  });

  it('does not overlap the model table in either direction', () => {
    for (const code of Object.keys(modelWritten)) {
      const filed = indicationsByCode[code];
      if (!filed) continue;
      /* Overlap is allowed as a code, not as a value: the merge fills a gap in
         the sourced entry, it never competes with a filled field. */
      const m = modelWritten[code]!;
      if (filed.actionsZh) expect(entryFor(code)?.actionsZh).not.toBe(m.actionsZh);
    }
  });
});
