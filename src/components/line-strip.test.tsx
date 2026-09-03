import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { acupointById, dataset, meridianById } from '../data';
import { memoryStorage } from '../state/progress';
import { StoreProvider, useStore } from '../state/store';
import LineStrip from './LineStrip';
import NetworkView from '../views/NetworkView';

// `globals: false`, so Testing Library's auto-cleanup is not registered.
afterEach(cleanup);

const wrap = (ui: React.ReactNode) => (
  <StoreProvider storage={memoryStorage()}>{ui}</StoreProvider>
);

const pick = (container: HTMLElement, code: string) => {
  const chip = [...container.querySelectorAll('.strip-chip')].find((c) =>
    c.textContent?.includes(code),
  )!;
  fireEvent.click(chip);
};

/**
 * The strip is a second READING of the network, never a second copy of it.
 * These tests are mostly about that: whatever it shows has to come from the
 * same records, in the same order, and resolve to the same acupoints.
 */
describe('line strip', () => {
  it('offers every channel, and opens on one of them', () => {
    const { container } = render(wrap(<LineStrip />));
    expect(container.querySelectorAll('.strip-chip').length).toBe(dataset.meridians.length);
    expect(container.querySelectorAll('.strip-station').length).toBeGreaterThan(0);
  });

  // Renders the strip once per channel — 14 full mounts, 362 stations in all.
  it('draws every station of every channel, in route order', { timeout: 30000 }, () => {
    for (const m of dataset.meridians) {
      cleanup();
      const { container } = render(wrap(<LineStrip />));
      pick(container, m.code);
      const codes = [...container.querySelectorAll('.strip-code')].map((n) => n.textContent);
      // Same count and same sequence as the channel's own point order.
      const expected = m.pointOrder.map((id) => acupointById.get(id)!.code);
      expect({ code: m.code, n: codes.length }).toEqual({ code: m.code, n: expected.length });
      expect({ code: m.code, codes }).toEqual({ code: m.code, codes: expected });
    }
  });

  it('resolves every station to a real acupoint on that channel', () => {
    // The map's stations carry acupoint ids; a strip that invented a station
    // would be a second source of truth. This is the guard against that.
    for (const line of dataset.networkLines) {
      for (const s of line.stations) {
        const p = acupointById.get(s.acupointId);
        expect({ station: s.acupointId, found: Boolean(p) }).toEqual({
          station: s.acupointId,
          found: true,
        });
        expect(p!.meridianId).toBe(line.meridianId);
      }
    }
  });

  it('names the channel that hands over to this one, and the one it hands on to', () => {
    const { container } = render(wrap(<LineStrip />));
    pick(container, 'LU');
    const flow = container.querySelector('.strip-flow')!;
    // The cycle closes, so the Lung's predecessor is the Liver.
    expect(flow.textContent).toMatch(/LR/);
    expect(flow.textContent).toMatch(/LI/);
  });

  it('sends the two midline vessels no neighbours, and says why', () => {
    const { container } = render(wrap(<LineStrip />));
    pick(container, 'CV');
    const flow = container.querySelector('.strip-flow')!;
    expect(flow.textContent).toMatch(/outside the flow cycle|不在流注環上/);
    expect(container.querySelectorAll('.strip-neighbour').length).toBe(0);
  });

  it('walks the cycle when a neighbour is tapped', () => {
    const { container } = render(wrap(<LineStrip />));
    pick(container, 'LU');
    const next = [...container.querySelectorAll('.strip-neighbour')].find((b) =>
      b.textContent?.includes('LI'),
    )!;
    fireEvent.click(next);
    expect(container.querySelector('.strip-head')!.textContent).toMatch(/LI/);
    // And its stations followed.
    expect(container.querySelectorAll('.strip-station').length).toBe(
      meridianById.get('mer_li')!.pointOrder.length,
    );
  });

  it('focuses the point behind a station when it is tapped', () => {
    function Probe() {
      const { focus } = useStore();
      return (
        <>
          <span data-testid="focus">{focus.kind === 'point' ? focus.pointId : focus.kind}</span>
          <LineStrip />
        </>
      );
    }
    const { container } = render(wrap(<Probe />));
    pick(container, 'LU');
    const hit = within(container).getByRole('button', { name: /LU9/ });
    fireEvent.click(hit);
    expect(screen.getByTestId('focus').textContent).toBe('pt_lu9');
  });

  it('switches to the channel of a point focused from elsewhere', () => {
    // Arriving from search or the Flow tab must not leave the strip on the
    // wrong line with the focused point nowhere in it.
    function Probe() {
      const { setFocus } = useStore();
      return (
        <>
          <button type="button" onClick={() => setFocus({ kind: 'point', pointId: 'pt_st36' })}>
            go
          </button>
          <LineStrip />
        </>
      );
    }
    const { container } = render(wrap(<Probe />));
    pick(container, 'LU');
    expect(container.querySelector('.strip-head')!.textContent).toMatch(/LU/);
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    expect(container.querySelector('.strip-head')!.textContent).toMatch(/ST/);
  });

  it('gives every station the same pitch, so no label can crowd another', () => {
    // The whole point of the strip: spacing is fixed, not a function of zoom.
    const { container } = render(wrap(<LineStrip />));
    pick(container, 'BL'); // 67 stations, the worst case
    const xs = [...container.querySelectorAll('.strip-station > circle')]
      .filter((c) => c.getAttribute('r') !== '22')
      .map((c) => Number(c.getAttribute('cx')));
    const gaps = new Set<number>();
    for (let i = 1; i < xs.length; i++) gaps.add(Math.round(xs[i]! - xs[i - 1]!));
    expect(gaps.size).toBe(1);
    expect([...gaps][0]).toBeGreaterThanOrEqual(40);
  });

  it('alternates labels above and below the rail', () => {
    // Doubles the width available to each label, which is what keeps a
    // 3-character Chinese name from touching its neighbour.
    const { container } = render(wrap(<LineStrip />));
    pick(container, 'BL');
    const ys = [...container.querySelectorAll('.strip-name')].map((n) => Number(n.getAttribute('y')));
    const above = ys.filter((y) => y < 96);
    const below = ys.filter((y) => y > 96);
    expect(above.length).toBeGreaterThan(20);
    expect(below.length).toBeGreaterThan(20);
    expect(new Set(above).size).toBe(1);
    expect(new Set(below).size).toBe(1);
  });
});

/**
 * The split view: overview and detail at once.
 *
 * The two halves are not wired to each other directly — they share `focus`.
 * These tests exist because that is easy to half-connect: the map moved the
 * strip long before the strip moved the map, and nothing failed to say so.
 */
describe('network split view', () => {
  const renderView = () => render(wrap(<NetworkView />));

  it('opens on the combined view', { timeout: 30000 }, () => {
    const { container } = renderView();
    const selected = container.querySelector('.net-modes button[aria-selected="true"]')!;
    expect(selected.textContent).toMatch(/Map \+ line|總覽/);
    // Both halves present.
    expect(container.querySelector('.net-context svg')).toBeTruthy();
    expect(container.querySelector('.strip-scroll svg')).toBeTruthy();
  });

  it('strips the legend and toolbar from the context map', { timeout: 30000 }, () => {
    // 579px of legend would swamp a 300px column, and a context panel that
    // zooms away from the overview stops being context.
    const { container } = renderView();
    expect(container.querySelector('.net-context .viewer-legend')).toBeNull();
    expect(container.querySelector('.net-context .viewer-toolbar')).toBeNull();
    // The primary map still has both.
    fireEvent.click(
      [...container.querySelectorAll('.net-modes button')].find((b) =>
        /Overview map|路網圖/.test(b.textContent ?? ''),
      )!,
    );
    expect(container.querySelector('.viewer-legend')).toBeTruthy();
  });

  it('publishes the channel when the strip picks one, so the map can dim the rest', {
    timeout: 30000,
  }, () => {
    function Probe() {
      const { focus } = useStore();
      return (
        <>
          <span data-testid="focus">
            {focus.kind === 'meridian' ? focus.meridianId : focus.kind}
          </span>
          <NetworkView />
        </>
      );
    }
    const { container } = render(wrap(<Probe />));
    pick(container, 'HT');
    // Shared focus is the whole linkage — without this the map never hears.
    expect(screen.getByTestId('focus').textContent).toBe('mer_ht');
  });

  it('hands the whole channel to the atlas, from a real button', { timeout: 30000 }, () => {
    /*
     * This is the panel's main action once the order has been read, and it was
     * set as an underlined phrase at the tail of a sentence — reachable, but
     * the least prominent thing on screen, and untested. It is a button now,
     * and this pins both halves of the handoff: the focus and the route.
     */
    function Probe() {
      const { focus, route, setRoute } = useStore();
      /*
       * Start on the route the strip actually lives on. The store opens on
       * 'atlas' in a bare render, so asserting the click lands there would pass
       * with the navigation deleted — it did, when this test was first written.
       */
      useEffect(() => {
        setRoute('network');
      }, [setRoute]);
      return (
        <>
          <span data-testid="focus">
            {focus.kind === 'meridian' ? focus.meridianId : focus.kind}
          </span>
          <span data-testid="route">{route}</span>
          <LineStrip />
        </>
      );
    }
    const { container } = render(wrap(<Probe />));
    expect(screen.getByTestId('route').textContent).toBe('network');
    pick(container, 'SP');
    expect(screen.getByTestId('focus').textContent).toBe('mer_sp');

    const go = container.querySelector('.strip-toatlas') as HTMLButtonElement;
    // A <button>, not a styled span: it must be focusable and named.
    expect(go.tagName).toBe('BUTTON');
    expect(go.textContent).toMatch(/See the whole channel on the atlas|在人體圖上看整條經/);
    // It carries the channel's own line, like the picker chips above it.
    expect(go.querySelector('svg')).toBeTruthy();

    fireEvent.click(go);
    expect(screen.getByTestId('route').textContent).toBe('atlas');
    // Still the channel the strip was showing — not whatever was focused before.
    expect(screen.getByTestId('focus').textContent).toBe('mer_sp');
  });

  it('moves the strip when a station on the map is tapped', { timeout: 30000 }, () => {
    const { container } = renderView();
    pick(container, 'LU');
    expect(container.querySelector('.strip-head')!.textContent).toMatch(/LU/);
    const station = [...container.querySelectorAll('.net-context [role="button"]')].find((b) =>
      (b.getAttribute('aria-label') ?? '').includes('ST36'),
    )!;
    fireEvent.click(station);
    expect(container.querySelector('.strip-head')!.textContent).toMatch(/ST/);
  });

  it('keeps each half usable on its own', { timeout: 30000 }, () => {
    const { container } = renderView();
    const mode = (re: RegExp) =>
      [...container.querySelectorAll('.net-modes button')].find((b) => re.test(b.textContent ?? ''))!;

    fireEvent.click(mode(/Line strip|單線圖/));
    expect(container.querySelector('.net-context')).toBeNull();
    expect(container.querySelector('.strip-scroll svg')).toBeTruthy();

    fireEvent.click(mode(/Overview map|路網圖/));
    expect(container.querySelector('.strip-scroll')).toBeNull();
    expect(container.querySelector('.viewer svg')).toBeTruthy();
  });
});

/**
 * Where the detail sheet sits.
 *
 * The sheet is the SAME panel on the atlas and here — that consistency is
 * worth keeping. What differs is whether it floats. Over a pannable canvas it
 * may, because the camera can move content out from under it. Over the line
 * strip it may not: the strip is a fixed-height band, so an overlay hides its
 * right-hand end for good and scrolling only changes which stations are hidden.
 */
describe('detail sheet placement', () => {
  const modeButton = (container: HTMLElement, re: RegExp) =>
    [...container.querySelectorAll('.net-modes button')].find((b) => re.test(b.textContent ?? ''))!;

  it('floats over the overview map, as it does on the atlas', { timeout: 30000 }, () => {
    const { container } = render(wrap(<NetworkView />));
    fireEvent.click(modeButton(container, /Overview map|路網圖/));
    expect(container.querySelector('.net-view')!.getAttribute('data-sheet')).toBe('float');
    // No column is introduced there; the sheet keeps its absolute placement.
    expect(container.querySelector('.net-sheet-col')).toBeNull();
  });

  it('takes a column of its own in both strip views', { timeout: 30000 }, () => {
    const { container } = render(wrap(<NetworkView />));
    // Split is the default.
    expect(container.querySelector('.net-view')!.getAttribute('data-sheet')).toBe('push');
    expect(container.querySelector('.net-sheet-col')).toBeTruthy();

    fireEvent.click(modeButton(container, /Line strip|單線圖/));
    expect(container.querySelector('.net-view')!.getAttribute('data-sheet')).toBe('push');
    expect(container.querySelector('.net-sheet-col')).toBeTruthy();
  });

  it('claims no column while nothing is selected', { timeout: 30000 }, () => {
    // DetailPanel renders null with no focus; the wrapper must collapse rather
    // than hold a gap where a panel is not.
    const { container } = render(wrap(<NetworkView />));
    const col = container.querySelector('.net-sheet-col')!;
    expect(col.children.length).toBe(0);

    // Selecting a station fills it. Scoped to the strip: in the split view the
    // context map carries an LU9 station of its own.
    pick(container, 'LU');
    const strip = container.querySelector('.net-detail') as HTMLElement;
    fireEvent.click(within(strip).getByRole('button', { name: /LU9/ }));
    expect(container.querySelector('.net-sheet-col')!.children.length).toBe(1);
    expect(container.querySelector('.net-sheet-col .sheet')).toBeTruthy();
  });

  it('keeps the sheet the same component wherever it sits', { timeout: 30000 }, () => {
    // The fix is layout participation only: not a second panel, not a variant.
    const { container } = render(wrap(<NetworkView />));
    pick(container, 'LU');
    const strip = container.querySelector('.net-detail') as HTMLElement;
    fireEvent.click(within(strip).getByRole('button', { name: /LU9/ }));
    const pushed = container.querySelector('.sheet')!;
    expect(pushed.className).toBe('sheet');
    expect(pushed.querySelector('.sheet-head')).toBeTruthy();
    expect(pushed.querySelector('.sheet-body')).toBeTruthy();
    // Exactly one sheet on the page — never a floating copy alongside.
    expect(container.querySelectorAll('.sheet').length).toBe(1);
  });
});
