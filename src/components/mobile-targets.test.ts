import { describe, expect, it } from 'vitest';
// @ts-expect-error -- no node types in the app tsconfig; see nav.test.tsx.
import { readFileSync } from 'node:fs';

/**
 * Tap targets that jsdom cannot measure.
 *
 * The query is `(pointer: coarse), (max-width: 1023px)` — a list, so either
 * arm applies. Width alone was wrong and an iPad in portrait proved it: at
 * 768px neither the phone rules nor the desktop rules matched, so a touch
 * device got 19px day links and 27px matrix cells. Tap size is a question
 * about the pointer; the width arm is kept only because it is the one a
 * desktop browser at a resized viewport can actually exercise.
 *
 * jsdom computes no layout, so a 19px control and a 44px one are the same
 * thing to it. These were measured in a real browser at 390px — the course
 * index's day links rendered 19px tall and the 無出處 mark 25px, against this
 * project's own `--tap: 44px`. Both are checked here as source, the way
 * nav.test.tsx checks its breakpoints, so the rules cannot be dropped silently.
 */

const css: string = readFileSync('src/styles.css', 'utf8') as string;
/** CSS with comments stripped: a rule's own comment must not satisfy a search. */
const code = css.replace(/\/\*[\s\S]*?\*\//g, ' ');

/** The tap-sizing block, whichever media condition it currently carries. */
const tapBlock = code.slice(code.indexOf('@media (pointer: coarse)'));

const ruleFor = (selector: string, body = code) => {
  const i = body.indexOf(selector);
  if (i < 0) return null;
  const open = body.indexOf('{', i);
  return body.slice(open + 1, body.indexOf('}', open));
};

describe('tap targets that only a real browser can measure', () => {
  it('states the tap size it is measuring against', () => {
    // The rules below are only meaningful relative to this token.
    expect(code).toMatch(/--tap:\s*44px/);
  });

  it('extends the 無出處 mark beyond its badge', () => {
    /*
     * The badge is 25px tall and must stay that size — it sits in a line of
     * type and a 44px version would loom over the content it annotates. So the
     * hit area is extended instead, and the button has to be positioned for
     * the overlay to anchor to it.
     */
    const base = ruleFor('.unsourced-mark {');
    expect(base).toBeTruthy();
    expect(base).toMatch(/position:\s*relative/);
    const overlay = ruleFor('.unsourced-mark::after');
    expect(overlay).toBeTruthy();
    expect(overlay).toMatch(/position:\s*absolute/);
    // Negative insets, or the overlay covers nothing extra.
    const inset = overlay!.match(/inset:\s*(-?\d+)px\s+(-?\d+)px/);
    expect(inset).toBeTruthy();
    const [, y, x] = inset!.map(Number);
    expect(y!).toBeLessThan(0);
    expect(x!).toBeLessThan(0);
    // 25px badge plus the overlay must clear 44.
    expect(25 + Math.abs(y!) * 2).toBeGreaterThanOrEqual(44);
  });

  it('grows the course index’s day links on a phone only', () => {
    const narrow = tapBlock;
    expect(narrow).toContain('.course-index td .linky:not(.chip)');
    const rule = ruleFor('.course-index td .linky:not(.chip) {', narrow);
    expect(rule).toMatch(/padding:\s*11px/);
    // 19px link + 22px padding clears 44 with the cell's own padding on top.
    expect(19 + 11 * 2).toBeGreaterThanOrEqual(41);
  });

  it('does not stretch the subject link, which wraps', () => {
    /*
     * Stretching it to the cell width forced the title to wrap to 123px a row.
     * A tap target that large stops being a table, so only the short day link
     * is stretched.
     */
    const narrow = tapBlock;
    expect(narrow).toContain('.course-index td .linky:not(.chip):not(.subject)');
    const stretch = ruleFor('.course-index td .linky:not(.chip):not(.subject) {', narrow);
    expect(stretch).toMatch(/width:\s*100%/);
    // …and the padding rule that DOES apply to the subject must not stretch it.
    const padOnly = ruleFor('.course-index td .linky:not(.chip) {', narrow);
    expect(padOnly).not.toMatch(/width:/);
  });

  it('raises every primitive that had drifted under the tap size', () => {
    /*
     * Measured at 390px before the change: 34px for the topbar search, the icon
     * buttons and .btn.small; 31px for the strip chips, the matrix tabs and the
     * course-index disclosure; 30px for the legend toggle; 27px for the sixty
     * matrix cells. Each was fine with a mouse and about half a fingertip.
     */
    const narrow = tapBlock;
    for (const sel of [
      '.search-trigger',
      '.btn.small',
      '.strip-chip',
      '.matrix-tabs button',
      '.course-index-disclosure > summary',
      '.legend-toggle',
      '.option',
    ]) {
      expect({ sel, raised: narrow.includes(sel) }).toEqual({ sel, raised: true });
    }
    // They must be raised TO the token, not to some other number that happens
    // to be big enough today.
    const raised = ruleFor('.option {', narrow) ?? ruleFor('.search-trigger,', narrow);
    expect(narrow).toMatch(/min-height:\s*var\(--tap\)/);
    expect(raised).toBeTruthy();
  });

  it('gives the icon buttons both dimensions, not just height', () => {
    // They are round and hold a single glyph, so a tall-but-narrow one is still
    // a miss.
    const narrow = tapBlock;
    const rule = ruleFor('.icon-btn {', narrow);
    expect(rule).toMatch(/min-width:\s*var\(--tap\)/);
    expect(rule).toMatch(/height:\s*var\(--tap\)/);
  });

  it('raises the matrix cells and re-centres what they hold', () => {
    const narrow = tapBlock;
    // One rule covers the matrix cells and the teaching-topic mappings, which
    // have the same shape one card down.
    const rule = ruleFor('.mx-point,', narrow);
    expect(narrow).toContain('.mapping-list button');
    expect(rule).toMatch(/min-height:\s*var\(--tap\)/);
    // The base rule aligns on the baseline; with a min-height that strands the
    // text at the top of a 44px box.
    expect(rule).toMatch(/align-items:\s*center/);
  });

  it('gives the course index’s title column room to be read', () => {
    /*
     * The subject is the only wrapping cell, so the table gave the nowrap
     * columns their width and squeezed it to 56px — titles wrapped two
     * characters to a line. The table scrolls sideways in its own box, so a
     * floor costs scroll rather than a squeezed column.
     */
    // Width, not pointer: by 768px the column has room, and this is a layout
    // problem rather than a reach problem.
    const narrowOnly = code.slice(code.lastIndexOf('@media (max-width: 767px)'));
    const rule = ruleFor('.course-index td .subject {', narrowOnly);
    expect(rule).toMatch(/min-width:\s*\d+px/);
    expect(rule).toMatch(/max-width:\s*none/);
  });

  it('keeps the tap rules out of the unconditional stylesheet', () => {
    // With a fine pointer above 1023px the density is deliberate: verified in a
    // real browser at 1440px, where matrix cells stay 27px and day links 19px.
    const beforeTap = code.slice(0, code.indexOf('@media (pointer: coarse)'));
    // These selectors DO have base styles — what must not leak out of the tap
    // block is the sizing. Asserting on the selector caught the base rule
    // instead, which is a different thing and is meant to be there.
    for (const sel of ['.mx-point {', '.mapping-list button {', '.icon-btn {']) {
      const base = ruleFor(sel, beforeTap);
      expect({ sel, base: Boolean(base) }).toEqual({ sel, base: true });
      expect({ sel, sized: /min-height:\s*var\(--tap\)/.test(base!) }).toEqual({
        sel,
        sized: false,
      });
    }
    expect(beforeTap).not.toContain('.course-index td .linky');
  });

  it('covers a touch device that is not phone-width', () => {
    /*
     * The bug this arm exists for: at 768px — an iPad in portrait — neither
     * `max-width: 767px` nor `min-width: 1024px` matched, so a touch device got
     * the desktop sizes. Both arms have to be present, and the width one has to
     * reach 1023 rather than stopping at 767.
     */
    const header = code.slice(code.indexOf('@media (pointer: coarse)'), code.indexOf('@media (pointer: coarse)') + 60);
    expect(header).toContain('(pointer: coarse)');
    expect(header).toContain('(max-width: 1023px)');
  });


});
