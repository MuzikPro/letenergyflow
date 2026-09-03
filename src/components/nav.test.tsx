import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App, { NAV_ROUTE_COUNT } from '../App';
/*
 * The stylesheet, read as text.
 *
 * jsdom computes no layout, so a breakpoint rule can only be checked as source.
 * Vitest stubs CSS imports to an empty string — `?raw` and import.meta.glob
 * included — so it has to come off disk, and this tsconfig carries no node
 * types (`types: ["vite/client"]`). Suppressing the import here is cheaper than
 * adding a dependency for one guard.
 */
// @ts-expect-error -- no node types in the app tsconfig; see above.
import { readFileSync } from 'node:fs';

// Vitest's cwd is the app root — that is where `npm test` runs.
const css: string = readFileSync('src/styles.css', 'utf8');
import { memoryStorage } from '../state/progress';
import { StoreProvider } from '../state/store';
import { meridianLegendName } from '../data/types';
import { dataset } from '../data';

afterEach(cleanup);

const app = () => render(
  <StoreProvider storage={memoryStorage()}>
    <App />
  </StoreProvider>,
);

const nav = () => document.querySelector('nav.nav')!;

/**
 * The rail has three behaviours driven by CSS breakpoints, which jsdom cannot
 * evaluate. What IS testable here is the state machine underneath them: the
 * collapse flag, the drawer flag, and the wiring that closes the drawer. The
 * widths and breakpoints were measured in a real browser instead.
 */
describe('navigation rail', () => {
  // Each toggle re-renders the whole App, Atlas and its 362 markers included,
  // which is comfortably over the 5s default on a loaded machine.
  it('collapses and expands, flipping its own accessible name', { timeout: 30000 }, () => {
    app();
    const toggle = screen.getByRole('button', { name: /Collapse sidebar|收合側欄/ });
    expect(nav().getAttribute('data-collapsed')).toBe('false');

    fireEvent.click(toggle);
    expect(nav().getAttribute('data-collapsed')).toBe('true');
    // The control must now offer the opposite action, not repeat the old one.
    expect(screen.getByRole('button', { name: /Expand sidebar|展開側欄/ })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Expand sidebar|展開側欄/ }));
    expect(nav().getAttribute('data-collapsed')).toBe('false');
  });

  it('keeps every destination reachable while collapsed', () => {
    app();
    fireEvent.click(screen.getByRole('button', { name: /Collapse sidebar|收合側欄/ }));
    // Labels are hidden by CSS, so the accessible name comes from the title —
    // a collapsed rail must not become an unlabelled row of glyphs.
    for (const name of [
      /Atlas|人體圖/,
      /Network|網絡圖/,
      /Flow|流注/,
      /Circuit|運行/,
      /Learn|課程/,
      /Practice|練習/,
      /Progress|進度/,
    ]) {
      expect(within(nav() as HTMLElement).getByRole('button', { name })).toBeTruthy();
    }
    // Derived, not hardcoded: adding a route must not silently leave the rail
    // one glyph short of its destinations.
    expect(nav().querySelectorAll('.nav-icon').length).toBe(NAV_ROUTE_COUNT);
  });

  it('opens the drawer, and closes it on navigate and on Escape', { timeout: 30000 }, () => {
    app();
    const open = screen.getByRole('button', { name: /Open navigation|開啟導覽/ });
    expect(nav().getAttribute('data-open')).toBe('false');
    expect(document.querySelector('.nav-scrim')).toBeNull();

    fireEvent.click(open);
    expect(nav().getAttribute('data-open')).toBe('true');
    // A scrim must exist so a tap outside dismisses it rather than falling
    // through to the canvas underneath.
    expect(document.querySelector('.nav-scrim')).not.toBeNull();

    fireEvent.click(within(nav() as HTMLElement).getByRole('button', { name: /Network|網絡圖/ }));
    expect(nav().getAttribute('data-open')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: /Open navigation|開啟導覽/ }));
    expect(nav().getAttribute('data-open')).toBe('true');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(nav().getAttribute('data-open')).toBe('false');
  });

  it('dismisses the drawer when the scrim is tapped', () => {
    app();
    fireEvent.click(screen.getByRole('button', { name: /Open navigation|開啟導覽/ }));
    fireEvent.click(document.querySelector('.nav-scrim')!);
    expect(nav().getAttribute('data-open')).toBe('false');
  });
});

describe('legend labels', () => {
  it('shows the FULL channel name, never an abbreviated one', () => {
    // 「胃經」 does not say which of the six divisions the channel belongs to,
    // and that division is half of what the name teaches.
    for (const m of dataset.meridians) {
      expect(meridianLegendName(m, 'zh').primary).toBe(m.nameZhHant);
      expect(meridianLegendName(m, 'en').primary).toContain(m.code);
    }
  });

  it('drops the Latin code in 中文 and keeps it in English', () => {
    for (const m of dataset.meridians) {
      // An English abbreviation has no business sitting inside a Chinese label;
      // the swatch beside it already identifies the line.
      expect(meridianLegendName(m, 'zh').primary).not.toMatch(/[A-Za-z]/);
      expect(meridianLegendName(m, 'en').primary.startsWith(`${m.code} · `)).toBe(true);
    }
  });

  it('reorders English to match the Chinese construction', () => {
    // 足陽明胃經 reads qualifier-first, so the English legend does too. The
    // stored name is reviewed content and is NOT rewritten.
    const st = dataset.meridians.find((m) => m.code === 'ST')!;
    expect(st.nameEn).toBe('Stomach meridian (Foot Yangming)');
    expect(meridianLegendName(st, 'en').primary).toBe('ST · Foot Yangming Stomach meridian');
    const lu = dataset.meridians.find((m) => m.code === 'LU')!;
    expect(meridianLegendName(lu, 'en').primary).toBe('LU · Hand Taiyin Lung meridian');
    // Every one of the twelve must actually reorder — a missed parenthetical
    // would leave one row reading the other way round. The two extraordinary
    // vessels carry no channel qualifier, so they are exempt by name.
    for (const m of dataset.meridians) {
      if (!m.nameEn.includes('meridian')) {
        expect(m.nameEn).toMatch(/Vessel/);
        continue;
      }
      expect(meridianLegendName(m, 'en').primary).not.toMatch(/\(/);
      expect(meridianLegendName(m, 'en').primary).toMatch(/(Hand|Foot) \w+ .+ meridian$/);
    }
  });

  it('never mixes scripts on one line outside bilingual mode', () => {
    for (const m of dataset.meridians) {
      const zh = meridianLegendName(m, 'zh');
      const en = meridianLegendName(m, 'en');
      expect(zh.secondary).toBeNull();
      expect(en.secondary).toBeNull();
      expect(en.primary).not.toMatch(/[\u4e00-\u9fff]/);
      // Bilingual is the one mode that carries both, on separate lines.
      const bi = meridianLegendName(m, 'bi');
      expect(bi.secondary).toBeTruthy();
      expect(bi.primary).toMatch(/[\u4e00-\u9fff]/);
    }
  });
});

/**
 * The rail's ORIENTATION per breakpoint.
 *
 * jsdom computes no layout, so this reads the stylesheet as text. It exists
 * because a change meant for the phone bar — giving it `grid-auto-flow: column`
 * so any number of tabs stays on one row — silently laid the desktop rail
 * sideways across the top of the page. Both vertical layouts inherit that base
 * rule and must each undo it.
 */
describe('nav orientation per breakpoint', () => {
  /** The body of the first rule matching a selector inside a given @media. */
  const ruleIn = (media: string, selector: string): string => {
    const at = css.indexOf(media);
    expect({ media, found: at >= 0 }).toEqual({ media, found: true });
    const from = css.indexOf(`${selector} {`, at);
    expect({ selector, found: from >= 0 }).toEqual({ selector, found: true });
    return css.slice(from, css.indexOf('}', from));
  };

  it('lays the phone bottom bar out as a single row of equal columns', () => {
    // The base rule is the phone bar; it must not pin a column COUNT, or the
    // next tab added wraps it onto two rows.
    const base = css.slice(css.indexOf('.nav {'), css.indexOf('}', css.indexOf('.nav {')));
    expect(base).toMatch(/grid-auto-flow:\s*column/);
    expect(base).toMatch(/grid-auto-columns:\s*1fr/);
    expect(base).not.toMatch(/grid-template-columns:\s*repeat\(\s*\d/);
  });

  it('stacks the tablet drawer and the desktop rail, undoing that column flow', () => {
    for (const media of ['@media (min-width: 641px) and (max-width: 1023px)', '@media (min-width: 1024px)']) {
      const rule = ruleIn(media, '  .nav');
      expect({ media, stacks: /grid-auto-flow:\s*row/.test(rule) }).toEqual({ media, stacks: true });
    }
  });
});

/**
 * The shell gutter.
 *
 * The brand sits on it in the topbar, so a full-bleed view that uses the same
 * token has its heading on the logo's left edge by construction. The Flow view
 * originally hardcoded 4px against the topbar's 12px and sat visibly out of
 * line — two numbers that were never linked.
 */
describe('shell gutter', () => {
  const bodyOf = (selector: string): string => {
    const from = css.indexOf(`${selector} {`);
    expect({ selector, found: from >= 0 }).toEqual({ selector, found: true });
    return css.slice(from, css.indexOf('}', from));
  };

  it('defines one gutter token', () => {
    expect(css).toMatch(/--gutter:\s*\d+px/);
  });

  it('drives both the topbar and the flow view from it', () => {
    // Neither may go back to a literal, or they drift apart again.
    expect(bodyOf('.topbar')).toMatch(/padding:\s*6px var\(--gutter\)/);
    const flow = bodyOf('.flow-view');
    expect(flow).toMatch(/padding:[^;]*var\(--gutter\)/);
    expect(flow).not.toMatch(/padding:\s*\d+px \d+px \d/);
  });

  it('keeps the detail column off the screen edge', () => {
    // On top of the gutter, so the reading column is not pressed against glass.
    expect(bodyOf('.flow-detail')).toMatch(/padding-right:\s*[4-9]px|padding-right:\s*\d\dpx/);
  });
});

/**
 * The Flow view's three columns.
 *
 * On an iPad in landscape the figure vanished: the two bodies rendered as a
 * pair of hairlines with their captions wrapping one character per line. Two
 * separate causes, both asserted here.
 */
describe('flow grid sizing', () => {
  /* Comments stripped: the rules below explain the old values in prose, and a
     quoted value must not satisfy an assertion about the live one. */
  const ruleOf = (selector: string): string => {
    const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const from = bare.indexOf(`${selector} {`);
    expect({ selector, found: from >= 0 }).toEqual({ selector, found: true });
    return bare.slice(from, bare.indexOf('}', from));
  };

  it('gives the figure track a floor instead of the leftover', () => {
    /*
     * `minmax(0, 1fr)` let the side columns take their maximums first and
     * handed the figure whatever remained — measured at 834px wide, the
     * resolved template was `420px 70px 300px`. A 70px slot for the thing the
     * view exists to show.
     */
    const grid = ruleOf('.flow-grid');
    const template = /grid-template-columns:([^;]+);/.exec(grid)?.[1] ?? '';
    expect(template).toContain('fr');
    expect(template).not.toContain('minmax(0, 1fr)');
    // The middle track's minimum, in px, must be a real size.
    const middle = template.split(')')[1] ?? '';
    expect(middle).toMatch(/minmax\(\s*(\d{3})px/);
  });

  it('stretches the columns so the figure height resolves in WebKit too', () => {
    /*
     * The columns used to be centred as grid ITEMS, which sizes each to its
     * content — and a content-sized column is not a definite height, so the
     * figure's `height: 100%` had nothing to resolve against. Blink resolves
     * it anyway; WebKit does not. Measured on an iPad: 0x0 centred against
     * 130x300 stretched, from the same markup.
     */
    expect(ruleOf('.flow-grid')).toMatch(/align-items:\s*stretch/);
  });

  it('stacks before an iPad in landscape reaches the three-column layout', () => {
    // 1194px is an 11-inch iPad on its side. Below the breakpoint it uses the
    // two-column rules, which set the figure height in vh — always definite,
    // and already confirmed working on that device in portrait.
    const breakpoints = [...css.matchAll(/@media \(max-width:\s*(\d+)px\)/g)].map((m) =>
      Number(m[1]),
    );
    const stacking = breakpoints.filter((b) => b > 1000);
    expect(stacking.length).toBeGreaterThan(0);
    expect(Math.max(...stacking)).toBeGreaterThanOrEqual(1194);
  });
});

/**
 * The detail sheet's positioning rule.
 *
 * Lives here because this file is where the stylesheet is read as text. jsdom
 * computes no layout, so `line-strip.test.tsx` can only assert the STRUCTURE
 * around the sheet — that a column exists and holds exactly one panel. Whether
 * that panel actually stops floating is a CSS fact, and this is the only place
 * it can be checked without a real browser.
 */
describe('detail sheet positioning', () => {
  it('floats by default, which is what the atlas and the map want', () => {
    const from = css.indexOf('.sheet {');
    const body = css.slice(from, css.indexOf('}', from));
    expect(body).toMatch(/position:\s*absolute/);
  });

  it('stops floating in the strip views, where an overlay hides content', () => {
    // The strip is a fixed-height band: an absolute sheet covers its right end
    // permanently, and scrolling only changes which stations are covered.
    const marker = ".net-view[data-sheet='push'] .net-sheet-col .sheet";
    const from = css.indexOf(marker);
    expect({ marker, found: from >= 0 }).toEqual({ marker, found: true });
    const body = css.slice(from, css.indexOf('}', from));
    expect(body).toMatch(/position:\s*relative/);
    expect(body).toMatch(/inset:\s*auto/);
  });

  it('gives the pushed sheet a column and collapses it when empty', () => {
    const from = css.indexOf('.net-sheet-col:empty');
    expect(from).toBeGreaterThanOrEqual(0);
    expect(css.slice(from, css.indexOf('}', from))).toMatch(/display:\s*none/);
  });
});

/**
 * The shell owns the viewport height.
 *
 * This was learned twice the hard way. `.app` used to set `min-height`, so
 * nothing below it had a definite height: `flex: 1` sized to content,
 * `height: 100%` became auto, and `minmax(0, 1fr)` had no fraction to take.
 * The Flow view papered over it with a scoped `:has()` rule, then the network
 * split hit the identical wall and a 44-station panel dragged a grid row to
 * 2497px, pushing the map off the page. Both workarounds are gone: the shell
 * has a definite height and `main` is the scroll container, so a view fits one
 * screen simply by not overflowing.
 */
describe('shell height and scrolling', () => {
  const ruleFor = (selector: string) => {
    const from = css.indexOf(`${selector} {`);
    expect({ selector, found: from >= 0 }).toEqual({ selector, found: true });
    return css.slice(from, css.indexOf('}', from));
  };

  it('gives .app a definite height, not just a minimum', () => {
    const body = ruleFor('.app');
    expect(body).toMatch(/height:\s*100dvh/);
    // The trap: min-height alone leaves every descendant indefinite.
    expect(body).not.toMatch(/min-height:\s*100dvh/);
  });

  it('scrolls inside main rather than scrolling the document', () => {
    // Anchored to a line start: `.shell-main {` also ends in "main {".
    const from = css.indexOf('\nmain {');
    expect(from).toBeGreaterThan(0);
    expect(css.slice(from, css.indexOf('}', from))).toMatch(/overflow-y:\s*auto/);
  });

  it('needs no per-view workaround to fit one screen', () => {
    // Each of these was a scoped rule bolted onto a view; the shell fix
    // replaced both. A third one appearing means the shell regressed.
    expect(css).not.toContain('.app:has(');
  });

  it('still bounds the side-by-side grid rows', () => {
    // With a definite height above, this is what keeps the sheet's own
    // scrolling from growing the row.
    for (const selector of ['.net-split', '.net-line-only']) {
      expect(ruleFor(selector)).toMatch(/grid-template-rows:\s*minmax\(0,\s*1fr\)/);
    }
  });

  it('drops the grid entirely once those layouts stack', () => {
    // Grid intrinsic sizing could not measure the strip through its own scroll
    // containers — an auto row still came out 182px against 519px of content,
    // and the overflow landed on top of the map. Flex sizes it correctly.
    const at = css.indexOf('@media (max-width: 900px)');
    const block = css.slice(at, css.indexOf('\n}', css.indexOf('.net-split', at)));
    expect(block).toMatch(/display:\s*flex/);
    expect(block).toMatch(/flex-direction:\s*column/);
  });
});
