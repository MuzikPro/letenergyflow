import { cleanup, fireEvent, render } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
/*
 * The stylesheet as text. jsdom applies no CSS at all, so the offset itself can
 * only be checked as source here — the same trade nav.test.tsx makes for its
 * breakpoints. That it actually lands clear of the sheet was confirmed in a
 * real browser at 1440px.
 */
// @ts-expect-error -- no node types in the app tsconfig; see nav.test.tsx.
import { readFileSync } from 'node:fs';

const css: string = readFileSync('src/styles.css', 'utf8');
import { memoryStorage } from '../state/progress';
import { StoreProvider, useStore } from '../state/store';
import type { Focus } from '../state/store';
import { sheetOpenFor } from './DetailPanel';
import AtlasView from '../views/AtlasView';
import NetworkView from '../views/NetworkView';

afterEach(cleanup);

/**
 * The detail sheet floats over the right third of a wide canvas, directly on
 * top of the zoom and front/back controls — so on any channel drawn across both
 * views, opening a point left the learner unable to turn the figure round. It
 * was reported against 足少陽膽經, which runs front and back, but nothing about
 * it is specific to that channel.
 */

const wrap = (ui: React.ReactNode) => (
  <StoreProvider storage={memoryStorage()}>{ui}</StoreProvider>
);

function Harness({ focus, view }: { focus: Focus; view: 'atlas' | 'network' }) {
  const { setFocus } = useStore();
  useEffect(() => {
    setFocus(focus);
  }, [setFocus, focus]);
  return view === 'atlas' ? <AtlasView /> : <NetworkView />;
}

const flagOf = (container: HTMLElement, sel: string) =>
  container.querySelector(sel)!.getAttribute('data-sheet-open');

describe('viewer controls dodge the detail sheet', () => {
  it('raises the flag only when a sheet will actually be drawn', { timeout: 30000 }, () => {
    // 帶脈 GB26 — a Gallbladder point, the channel the report came from.
    const { container } = render(wrap(<Harness view="atlas" focus={{ kind: 'point', pointId: 'pt_gb26' }} />));
    expect(flagOf(container, '.atlas-view')).toBe('true');
    expect(container.querySelector('.sheet')).toBeTruthy();
  });

  it('leaves the controls alone when nothing is focused', { timeout: 30000 }, () => {
    const { container } = render(wrap(<Harness view="atlas" focus={{ kind: 'none' }} />));
    expect(flagOf(container, '.atlas-view')).toBe('false');
    expect(container.querySelector('.sheet')).toBeNull();
  });

  it('does not shift them for a focus that draws no sheet', { timeout: 30000 }, () => {
    // A 募俞 pair says its piece in the atlas caption and opens no panel, so
    // moving the buttons for it would be a shift with nothing to dodge.
    const { container } = render(
      wrap(<Harness view="atlas" focus={{ kind: 'shu_mu', organ: 'spleen' }} />),
    );
    expect(container.querySelector('.sheet')).toBeNull();
    expect(flagOf(container, '.atlas-view')).toBe('false');
  });

  it('agrees with what DetailPanel actually renders, kind by kind', () => {
    // The flag is derived from the panel's own conditions; if the two are ever
    // written separately they will disagree on exactly these cases.
    expect(sheetOpenFor({ kind: 'none' })).toBe(false);
    expect(sheetOpenFor({ kind: 'shu_mu', organ: 'spleen' })).toBe(false);
    expect(sheetOpenFor({ kind: 'point', pointId: 'pt_gb26' })).toBe(true);
    expect(sheetOpenFor({ kind: 'meridian', meridianId: 'mer_gb' })).toBe(true);
    // An id that resolves to nothing draws no sheet, so it must not shift them.
    expect(sheetOpenFor({ kind: 'point', pointId: 'pt_nope' })).toBe(false);
    expect(sheetOpenFor({ kind: 'meridian', meridianId: 'mer_nope' })).toBe(false);
    expect(sheetOpenFor({ kind: 'function', functionId: 'fn_nope' })).toBe(false);
  });

  it('does not shift the network map’s controls when the sheet has its own column', {
    timeout: 30000,
  }, () => {
    // In 'push' mode the sheet is a third column, not an overlay; there is
    // nothing on top of the controls to dodge.
    const { container } = render(
      wrap(<Harness view="network" focus={{ kind: 'point', pointId: 'pt_gb26' }} />),
    );
    const net = container.querySelector('.net-view')!;
    expect(net.getAttribute('data-sheet')).toBe('push');
    expect(net.getAttribute('data-sheet-open')).toBe('false');

    // Switching to the overview map floats the sheet, and then it does.
    const mapTab = [...container.querySelectorAll('.net-modes button')].find((b) =>
      /Overview map|路網圖/.test(b.textContent ?? ''),
    )!;
    fireEvent.click(mapTab);
    expect(net.getAttribute('data-sheet')).toBe('float');
    expect(net.getAttribute('data-sheet-open')).toBe('true');
  });
});

describe('the dodge rule itself', () => {
  const rule = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .match(/\[data-sheet-open='true'\]\s*\.viewer-toolbar\s*\{([^}]*)\}/);

  it('exists, and moves the controls by the sheet’s own width', () => {
    expect(rule).toBeTruthy();
    // Both the panel width and the distance travelled come from one variable,
    // so resizing the sheet cannot leave the buttons underneath it.
    expect(rule![1]).toMatch(/var\(--sheet-w\)/);
    expect(css).toMatch(/\.sheet\s*\{[^}]*width:\s*var\(--sheet-w\)/);
    expect(css).toMatch(/--sheet-w:\s*\d+px/);
  });

  it('applies only where the sheet actually floats beside the canvas', () => {
    // Below 1024px the sheet is a bottom sheet and the top-right corner is
    // already clear, so shifting there would move the buttons for no reason.
    const wide = css.slice(css.indexOf('@media (min-width: 1024px)'));
    expect(wide).toContain("[data-sheet-open='true'] .viewer-toolbar");
    const narrow = css.slice(0, css.indexOf('@media (min-width: 1024px)'));
    expect(narrow).not.toContain("[data-sheet-open='true']");
  });
});

describe('the caption clears the legend', () => {
  /**
   * The caption sits in the bottom-left strip, which is also where the legend
   * grows to. Clearance is done horizontally on purpose: the legend scrolls to
   * whatever height its content needs, so any rule based on heights holds only
   * until a channel list or a caption gets longer — and both just did.
   *
   * Measured in a real browser at 375, 900 and 1280: no overlap at any of them,
   * and none with the detail sheet at 1280 either. jsdom lays nothing out, so
   * what is guarded here is that the rules stay present.
   */
  const code = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
  const ruleIn = (media: string, selector: string) => {
    const at = code.indexOf(media);
    if (at < 0) return null;
    const i = code.indexOf(selector, at);
    if (i < 0) return null;
    const open = code.indexOf('{', i);
    return code.slice(open + 1, code.indexOf('}', open));
  };

  it('starts the caption after the legend once the legend stops collapsing', () => {
    // Below 641px the legend is a pill and the caption keeps the corner; from
    // there up it is always drawn open at min(62vw, 202px).
    const rule = ruleIn('@media (min-width: 641px)', '.viewer-caption');
    expect(rule).toBeTruthy();
    expect(rule).toMatch(/left:\s*calc\(/);
    expect(rule).toContain('202px');
  });

  it('moves it again where the legend gets wider', () => {
    // The desktop legend is 263px, so the 202px offset above is no longer
    // enough — these two numbers have to move together.
    expect(code).toMatch(/@media \(min-width: 1024px\)[\s\S]*?\.viewer-legend[^}]*max-width:\s*263px/);
    // Anchored on the 263px declaration itself, not on the media query: there
    // is more than one `@media (min-width: 1024px)` block in this stylesheet,
    // and the first one is the sheet's.
    const rule = ruleIn('max-width: 263px', '.viewer-caption {');
    expect(rule).toMatch(/left:\s*285px/);
  });

  it('keeps it out from under the floating sheet', () => {
    /*
     * At 1280 a max-width alone would have been enough, but at exactly 1024 the
     * caption's right edge reached past where the sheet starts. Giving it both
     * edges lets it fill the gap instead of guessing at a width.
     */
    const rule = ruleIn('max-width: 263px', "[data-sheet-open='true'] .viewer-caption");
    expect(rule).toBeTruthy();
    expect(rule).toMatch(/right:\s*calc\(var\(--sheet-w\)/);
    expect(rule).toMatch(/max-width:\s*none/);
  });
});
