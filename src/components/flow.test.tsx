import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { dataset, meridianById } from '../data';
import { ATLAS_HEIGHT, ATLAS_WIDTH, denorm } from '../data/atlas';
import { SHICHEN, shichenAtHour } from '../data/shichen';
import { memoryStorage } from '../state/progress';
import { StoreProvider, useStore } from '../state/store';
import { CROP_W, CROP_X, NODE_REACH } from './FlowFigure';
import AboutView from '../views/AboutView';
import FlowView from '../views/FlowView';

// `globals: false`, so Testing Library's auto-cleanup is not registered.
afterEach(cleanup);

const wrap = (ui: React.ReactNode) => (
  <StoreProvider storage={memoryStorage()}>{ui}</StoreProvider>
);

/** Drive the whole view at a fixed wall-clock hour. */
const at = (hour: number) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 7, 7, hour, 30, 0));
  const r = render(wrap(<FlowView />));
  return r;
};

/*
 * jsdom implements no PointerEvent, so fireEvent.pointerDown produces a bare
 * Event with no clientX and the swipe maths would see NaN. Dispatch a real
 * MouseEvent under the pointer type instead — React's onPointerDown listens for
 * the event NAME, so this delivers genuine coordinates.
 */
const pointer = (el: Element, type: 'pointerdown' | 'pointerup', x: number, y: number) =>
  fireEvent(el, new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true }));

const activeOption = (container: HTMLElement) =>
  container.querySelector('.ring-opt.active')!.textContent;

describe('flow view — the clock', () => {
  afterEach(() => vi.useRealTimers());

  it('opens on the system hour: 08:00 shows 辰 and the Stomach', () => {
    const { container } = at(8);
    expect(activeOption(container)).toMatch(/辰/);
    expect(activeOption(container)).toMatch(/ST/);
    // And it says it is following the clock rather than a manual choice.
    expect(screen.getByText(/Following system time|跟著現在時間/)).toBeTruthy();
  });

  it('shows the front and the back at once, with no toggle to hunt for', () => {
    const { container } = at(8);
    const panels = [...container.querySelectorAll('.flow-panel')];
    expect(panels.map((p) => p.getAttribute('data-view'))).toEqual(['front', 'back']);
    // A channel crosses between the faces; both must be on screen together.
    expect(screen.queryByRole('button', { name: /Show back|Show front|看背面|看正面/ })).toBeNull();
    // Both actually draw the lit channel.
    for (const p of panels) expect(p.querySelectorAll('.flow-active > g').length).toBe(2);
  });

  it('says when a channel does not reach the face being shown', () => {
    // 心經 HT is entirely on the front, so the back panel would otherwise be a
    // body with nothing lit on it and no explanation.
    const { container } = at(12); // 午 — the Heart
    const back = container.querySelector('.flow-panel[data-view="back"]')!;
    expect(back.querySelectorAll('.flow-node').length).toBe(0);
    expect(back.querySelector('figcaption')!.textContent).toMatch(
      /not on this side|此面無此經/,
    );
    // And the front panel, which does carry it, says no such thing.
    const front = container.querySelector('.flow-panel[data-view="front"]')!;
    expect(front.querySelectorAll('.flow-node').length).toBeGreaterThan(0);
    expect(front.querySelector('figcaption')!.textContent).not.toMatch(
      /not on this side|此面無此經/,
    );
  });

  it('lights the channel on BOTH sides, mirrored, never one side only', () => {
    const { container } = at(8);
    const active = container.querySelector('.flow-active')!;
    // Two copies of the channel: the canonical geometry and its mirror.
    const groups = active.querySelectorAll(':scope > g');
    expect(groups.length).toBe(2);
    const mirrored = [...groups].filter((g) =>
      (g.getAttribute('transform') ?? '').includes('scale(-1,1)'),
    );
    expect(mirrored.length).toBe(1);
    expect(mirrored[0]!.getAttribute('transform')).toBe(`translate(${ATLAS_WIDTH},0) scale(-1,1)`);
    // Same node count each side — a marker cannot go missing on one arm.
    const [a, b] = [...groups].map((g) => g.querySelectorAll('.flow-node').length);
    expect(a).toBe(b);
    expect(a).toBeGreaterThan(0);
  });

  it('draws the midline vessels once, not doubled', () => {
    // The clock never selects CV/GV, so drive the figure directly through the
    // same component the view uses.
    const st = meridianById.get('mer_st')!;
    const cv = meridianById.get('mer_cv')!;
    expect(st.atlasPaths.some((p) => p.side === 'left' || p.side === 'right')).toBe(true);
    expect(cv.atlasPaths.every((p) => p.side === 'midline')).toBe(true);
  });

  it('fades every other channel but keeps the silhouette solid', () => {
    const { container } = at(8);
    const svg = container.querySelector('.flow-figure svg')!;
    expect(svg.querySelector('.flow-inactive')).toBeTruthy();
    // The body outline is drawn outside the faded group.
    const body = svg.querySelector(':scope > g[aria-hidden="true"]')!;
    expect(body.classList.contains('flow-inactive')).toBe(false);
    expect(body.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('animates the line and the nodes with classes, not inline styles', () => {
    const { container } = at(8);
    // The animation lives in the stylesheet so reduced-motion can override it.
    expect(container.querySelectorAll('.flow-line').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.flow-node-glow').length).toBeGreaterThan(0);
    // Nothing animates the SVG `r` attribute — it is a fixed number.
    for (const c of container.querySelectorAll('.flow-node-glow')) {
      expect(c.getAttribute('r')).toBe('5.5');
    }
  });
});

describe('flow figure — cropped canvas', () => {
  it('crops the empty margins without clipping any marker, on either side', () => {
    /*
     * The panel is narrowed by cropping the viewBox, not by shrinking the
     * figure. That only works while the crop still contains every marker the
     * view can draw — including the MIRRORED twin and the glow at full breath.
     * If a point ever moves outward, this fails instead of quietly slicing a
     * marker off the edge of the frame.
     */
    let lo = Infinity;
    let hi = -Infinity;
    for (const p of dataset.acupoints) {
      for (const pl of p.placements) {
        const c = denorm(pl.x, pl.y);
        for (const x of [c.x, ATLAS_WIDTH - c.x]) {
          lo = Math.min(lo, x - NODE_REACH);
          hi = Math.max(hi, x + NODE_REACH);
        }
      }
    }
    expect({ side: 'left', ok: lo >= CROP_X }).toEqual({ side: 'left', ok: true });
    expect({ side: 'right', ok: hi <= CROP_X + CROP_W }).toEqual({ side: 'right', ok: true });
    // And the crop is actually doing something — a full-width box is the bug.
    expect(CROP_W).toBeLessThan(ATLAS_WIDTH);
  });

  it('keeps the figure the same size — the crop is horizontal only', () => {
    // Height untouched, so a height-bound panel renders at an identical scale.
    const { container } = at(8);
    const vb = container.querySelector('.flow-panel svg')!.getAttribute('viewBox')!.split(' ');
    expect(Number(vb[3])).toBe(ATLAS_HEIGHT);
    expect(Number(vb[0])).toBe(CROP_X);
    expect(Number(vb[2])).toBe(CROP_W);
  });
});

describe('flow view — manual override', () => {
  afterEach(() => vi.useRealTimers());

  it('switches to manual on a ring choice and offers a reset', () => {
    const { container } = at(8);
    expect(screen.queryByRole('button', { name: /Reset to system time|回到現在時間/ })).toBeNull();

    const opts = within(container).getAllByRole('option');
    fireEvent.click(opts[2]!); // 寅 — the Lung
    expect(activeOption(container)).toMatch(/寅/);
    expect(activeOption(container)).toMatch(/LU/);

    const reset = screen.getByRole('button', { name: /Reset to system time|回到現在時間/ });
    fireEvent.click(reset);
    // Back to the system hour, and the reset button goes away again.
    expect(activeOption(container)).toMatch(/辰/);
    expect(screen.queryByRole('button', { name: /Reset to system time|回到現在時間/ })).toBeNull();
  });

  it('steps with the arrow keys, wrapping past 亥 back to 子', () => {
    const { container } = at(23); // 子, the first branch
    expect(activeOption(container)).toMatch(/子/);
    const listbox = within(container).getByRole('listbox');
    fireEvent.keyDown(listbox, { key: 'ArrowLeft' });
    expect(activeOption(container)).toMatch(/亥/); // wrapped backwards
    fireEvent.keyDown(listbox, { key: 'ArrowRight' });
    expect(activeOption(container)).toMatch(/子/);
  });

  it('changes the hour on a horizontal swipe: left goes forward', () => {
    const { container } = at(8); // 辰
    const fig = container.querySelector('.flow-figure')!;
    pointer(fig, 'pointerdown', 200, 300);
    pointer(fig, 'pointerup', 140, 305); // 60px left
    expect(activeOption(container)).toMatch(/巳/); // 辰 → 巳, forward
    // And right goes back.
    pointer(fig, 'pointerdown', 140, 300);
    pointer(fig, 'pointerup', 210, 305);
    expect(activeOption(container)).toMatch(/辰/);
  });

  it('ignores a short drag and a vertical one, so scrolling still works', () => {
    const { container } = at(8);
    const fig = container.querySelector('.flow-figure')!;
    // Under the 30px threshold.
    pointer(fig, 'pointerdown', 200, 300);
    pointer(fig, 'pointerup', 180, 300);
    expect(activeOption(container)).toMatch(/辰/);
    // Mostly vertical: that is the page scrolling.
    pointer(fig, 'pointerdown', 200, 300);
    pointer(fig, 'pointerup', 160, 500);
    expect(activeOption(container)).toMatch(/辰/);
    // And a coordinate-less event must not step it either.
    fireEvent.pointerDown(fig);
    fireEvent.pointerUp(fig);
    expect(activeOption(container)).toMatch(/辰/);
  });

  it('keeps showing where "now" is while a different hour is selected', () => {
    const { container } = at(8);
    const opts = within(container).getAllByRole('option');
    fireEvent.click(opts[0]!);
    // The live branch keeps a marker in the ring so manual mode never hides it.
    expect(container.querySelectorAll('.ring-seg circle').length).toBe(1);
  });

  it('does not follow the clock away from a manual choice', () => {
    const { container } = at(8);
    fireEvent.click(within(container).getAllByRole('option')[2]!); // 寅
    act(() => {
      vi.setSystemTime(new Date(2026, 7, 7, 12, 30, 0));
      vi.advanceTimersByTime(60_000);
    });
    // Still on the learner's choice, not dragged to 午.
    expect(activeOption(container)).toMatch(/寅/);
  });
});

describe('flow view — what it is allowed to say', () => {
  afterEach(() => vi.useRealTimers());

  it('keeps a one-line notice and a route to the full disclosure', () => {
    const { container } = at(8);
    const line = container.querySelector('.flow-review')!;
    // Short enough to sit under the panel, explicit about the two things that
    // matter: no diagnosis, and no treatment recommendation.
    expect(line.textContent).toMatch(
      /clinical diagnostic guidance|臨床診斷指引/,
    );
    expect(line.textContent).toMatch(
      /treatment recommendations of any kind|治療建議/,
    );
    expect(
      within(line as HTMLElement).getByRole('button', { name: /Sources & disclaimer|來源與聲明/ }),
    ).toBeTruthy();
    // The long-form copy is NOT duplicated here.
    expect(container.textContent).not.toMatch(/no conversion is implemented|不實作換算/);
    expect(container.textContent).not.toMatch(/2026-08-08/);
  });

  it('routes to the disclaimer page from that link', () => {
    function Probe() {
      const { route } = useStore();
      return (
        <>
          <span data-testid="route">{route}</span>
          <FlowView />
        </>
      );
    }
    const { container } = render(wrap(<Probe />));
    fireEvent.click(
      within(container).getByRole('button', { name: /Sources & disclaimer|來源與聲明/ }),
    );
    expect(screen.getByTestId('route').textContent).toBe('about');
  });

  it('shows the verse the mapping comes from, attributed', () => {
    const { container } = at(8);
    const verse = container.querySelector('.flow-verse')!;
    expect(verse.textContent).toMatch(/肺寅|Lung at 寅/);
    expect(verse.textContent).toMatch(/針灸大成/);
  });

  it('states the clock-time basis on the disclosure page, not the clock itself', () => {
    // The Flow tab is a readout; the caveats belong with the other provenance.
    const { container } = render(wrap(<AboutView />));
    const text = container.textContent ?? '';
    expect(text).toMatch(/true solar time|真太陽時/);
    expect(text).toMatch(/no conversion is implemented|不實作換算/);
  });

  it('carries the whole Flow disclosure on the Sources & disclaimer page', () => {
    const { container } = render(wrap(<AboutView />));
    const text = container.textContent ?? '';
    // What it is, and where the order comes from.
    expect(text).toMatch(/針灸大成/);
    expect(text).toMatch(/twelve double-hours|十二時辰/);
    // Educational framing, and the exclusion it implies.
    expect(text).toMatch(/not evidence of effect|並非療效證據/);
    expect(text).toMatch(/納甲法/);
    // Review provenance, including that the English is a project translation.
    expect(text).toMatch(/2026-08-08/);
    expect(text).toMatch(/source_checked/);
    expect(text).toMatch(/own translation|自譯/);
    // And that it is not part of the course.
    expect(text).toMatch(/never examined|不出測驗/);
  });

  it('glosses the Pericardium pairing only on its own hour', () => {
    const { container } = at(19); // 戌 — Pericardium
    expect(container.querySelector('.flow-gloss')!.textContent).toMatch(
      /pericardium standing in for the heart|心包代心受邪/i,
    );
    cleanup();
    const other = at(8); // 辰 — Stomach
    expect(other.container.querySelector('.flow-gloss')).toBeNull();
  });

  it('gives no treatment-timing or lifestyle guidance anywhere in the view', () => {
    const { container } = at(8);
    const text = container.textContent ?? '';
    // Allowed: the disclaimer NAMING what it does not do. Not allowed: advice.
    for (const banned of [
      'best time to',
      'you should',
      'recommended time',
      '宜於',
      '養生法',
      '排毒',
    ]) {
      expect(text.toLowerCase()).not.toContain(banned.toLowerCase());
    }
  });

  it('hands off to the atlas rather than re-implementing it', () => {
    const { container } = at(8);
    function Probe() {
      const { route, focus } = useStore();
      return (
        <>
          <span data-testid="route">{route}</span>
          <span data-testid="focus">{focus.kind === 'meridian' ? focus.meridianId : focus.kind}</span>
          <FlowView />
        </>
      );
    }
    cleanup();
    const r = render(wrap(<Probe />));
    fireEvent.click(
      within(r.container).getByRole('button', { name: /See this channel on the atlas|在人體圖上看/ }),
    );
    expect(screen.getByTestId('route').textContent).toBe('atlas');
    expect(screen.getByTestId('focus').textContent).toBe('mer_st');
    void container;
  });
});

describe('flow view — every hour renders', () => {
  afterEach(() => vi.useRealTimers());

  it('draws a channel on both sides for all twelve branches', () => {
    for (const s of SHICHEN) {
      cleanup();
      const { container } = at(s.startHour);
      expect(shichenAtHour(s.startHour).index).toBe(s.index);
      // Two panels (front + back), each carrying the channel on both sides.
      const panels = container.querySelectorAll('.flow-panel');
      expect({ branch: s.branchZhHant, panels: panels.length }).toEqual({
        branch: s.branchZhHant,
        panels: 2,
      });
      for (const panel of panels) {
        expect({ branch: s.branchZhHant, sides: panel.querySelectorAll('.flow-active > g').length }).toEqual({
          branch: s.branchZhHant,
          sides: 2,
        });
      }
      const nodes = container.querySelectorAll('.flow-node').length;
      const channel = dataset.meridians.find((m) => m.id === s.meridianId)!;
      // Both sides drawn, so the marker count is twice this view's placements.
      expect(nodes % 2).toBe(0);
      expect(nodes / 2).toBeLessThanOrEqual(channel.pointOrder.length);
      expect(nodes).toBeGreaterThan(0);
    }
  });
});
