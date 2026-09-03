import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { dataset } from '../data';
import { ATLAS_WIDTH } from '../data/atlas';
import { memoryStorage } from '../state/progress';
import { StoreProvider, useStore } from '../state/store';
import type { Focus } from '../state/store';
import AtlasView from '../views/AtlasView';

afterEach(cleanup);

/**
 * The mirror toggle, and 帶脈 drawn as a belt.
 *
 * Both are presentation-only: no record changes, and the mirror in particular
 * must never become a second set of placements. jsdom lays nothing out, so
 * these read the SVG attributes the component emits — which is exactly where
 * the reflection either is or is not exact.
 */

function Harness({ focus }: { focus: Focus }) {
  const { setFocus } = useStore();
  useEffect(() => {
    setFocus(focus);
  }, [setFocus, focus]);
  return <AtlasView />;
}

const mount = (focus: Focus = { kind: 'none' }) =>
  render(
    <StoreProvider storage={memoryStorage()}>
      <Harness focus={focus} />
    </StoreProvider>,
  );

const mirrorButton = () => screen.getByLabelText(/Mirror bilateral channels|左右對稱顯示/);
/** Marker dots only — glow haloes and hit rings are not markers. */
const dots = (c: HTMLElement) =>
  [...c.querySelectorAll('circle')].filter(
    (el) => !/marker-(glow|hit|pulse)/.test(el.getAttribute('class') ?? ''),
  );

describe('the mirror toggle', () => {
  it('is off until asked for', { timeout: 30000 }, () => {
    // It doubles the markers on one canvas, so it cannot be the default.
    mount();
    expect(mirrorButton().getAttribute('aria-pressed')).toBe('false');
  });

  it('adds exactly the bilateral points, and not the midline ones', { timeout: 30000 }, () => {
    /*
     * The figure opens on the front, which holds 222 bilateral placements and
     * 34 midline ones. Mirroring must add 222 dots and not 256: CV and GV sit
     * ON the midline and would mirror onto themselves, drawing each twice at
     * the same coordinate.
     */
    const front = dataset.acupoints.flatMap((p) => p.placements).filter((pl) => pl.view === 'front');
    const sided = front.filter((pl) => pl.side !== 'midline').length;
    const midline = front.filter((pl) => pl.side === 'midline').length;
    expect({ sided, midline }).toEqual({ sided: 222, midline: 34 });

    const { container } = mount();
    const before = dots(container).length;
    fireEvent.click(mirrorButton());
    const after = dots(container).length;
    expect(after - before).toBe(sided);
  });

  it('reflects each one exactly across the midline', { timeout: 30000 }, () => {
    // A reflection, not an approximation: every added dot must sit at
    // ATLAS_WIDTH - x of a dot that was already there.
    const { container } = mount();
    const before = new Set(dots(container).map((el) => Number(el.getAttribute('cx')).toFixed(2)));
    fireEvent.click(mirrorButton());
    const added = dots(container)
      .map((el) => Number(el.getAttribute('cx')))
      .filter((x) => !before.has(x.toFixed(2)));
    expect(added.length).toBeGreaterThan(0);
    for (const x of added) {
      const partner = (ATLAS_WIDTH - x).toFixed(2);
      expect({ x, hasPartner: before.has(partner) }).toEqual({ x, hasPartner: true });
    }
  });

  it('gives the reflected copies no label and no tap target', { timeout: 30000 }, () => {
    /*
     * They are the same point as the marker opposite, not a second one. A tap
     * target on the reflection would let a learner tap the right knee and watch
     * the camera fly to the left, and a second label would double the clutter
     * the toggle is already fighting.
     */
    const { container } = mount();
    const hitsBefore = container.querySelectorAll('.marker-hit').length;
    const labelsBefore = container.querySelectorAll('text').length;
    fireEvent.click(mirrorButton());
    expect(container.querySelectorAll('.marker-hit').length).toBe(hitsBefore);
    expect(container.querySelectorAll('text').length).toBe(labelsBefore);
  });

  it('adds no record while doing any of this', { timeout: 30000 }, () => {
    const { container } = mount();
    fireEvent.click(mirrorButton());
    expect(dataset.acupoints).toHaveLength(362);
    expect(container.querySelector('.atlas-view')).toBeTruthy();
  });
});

describe('mirroring follows the selection', () => {
  it('turns itself on for a single channel', { timeout: 30000 }, () => {
    // One channel on both sides is the anatomy, and costs almost no clutter —
    // this is the case the toggle exists for, so it should not need pressing.
    mount({ kind: 'meridian', meridianId: 'mer_gb' });
    expect(mirrorButton().getAttribute('aria-pressed')).toBe('true');
  });

  it('turns itself on for a single extraordinary vessel', { timeout: 30000 }, () => {
    mount({ kind: 'extraordinary', vessel: '陽維脈' });
    expect(mirrorButton().getAttribute('aria-pressed')).toBe('true');
  });

  it('stays off for all eight vessels at once', { timeout: 30000 }, () => {
    // Eight vessels mirrored is the wall, not the useful view. Mirroring all of
    // them has to stay a deliberate press.
    mount({ kind: 'extraordinary', vessel: null });
    expect(mirrorButton().getAttribute('aria-pressed')).toBe('false');
  });

  it('lets a press override the automatic choice', { timeout: 30000 }, () => {
    const { container } = mount({ kind: 'meridian', meridianId: 'mer_gb' });
    const on = dots(container).length;
    fireEvent.click(mirrorButton());
    expect(mirrorButton().getAttribute('aria-pressed')).toBe('false');
    expect(dots(container).length).toBeLessThan(on);
  });

  it('mirrors a vessel’s line, but not 帶脈’s belt', { timeout: 30000 }, () => {
    /*
     * The belt already spans the midline — reflecting it would redraw it on top
     * of itself. The polyline through the crossings is one-sided and does
     * mirror, which is why 陽維脈 reads as a pair of climbs.
     */
    const { container } = mount({ kind: 'extraordinary', vessel: '陽維脈' });
    const dashed = [...container.querySelectorAll('path')].filter(
      (p) =>
        p.getAttribute('stroke-dasharray') === '7 5' &&
        p.getAttribute('stroke') === 'var(--accent)',
    );
    expect(dashed.length).toBeGreaterThan(0);
    expect(dashed.length % 2).toBe(0); // each segment drawn once per side

    const belt = mount({ kind: 'extraordinary', vessel: '帶脈' });
    const arcs = [...belt.container.querySelectorAll('path')].filter((p) =>
      /^M[\d.]+,[\d.]+ A/.test(p.getAttribute('d') ?? ''),
    );
    expect(arcs).toHaveLength(2);
  });
});

describe('labels while mirroring', () => {
  it('keeps only the selection named once the figure is doubled', { timeout: 30000 }, () => {
    /*
     * Labels are the densest ink on the canvas and mirroring is the one mode
     * that doubles what sits under them. With a channel selected the mirror is
     * on automatically, so this is the ordinary case: the selected route stays
     * named and everything else goes quiet.
     */
    const { container } = mount({ kind: 'meridian', meridianId: 'mer_gb' });
    expect(mirrorButton().getAttribute('aria-pressed')).toBe('true');
    /*
     * Zoom in first, and this is the whole reason: at fit scale the atlas draws
     * no unfocused labels anyway, so the rule is invisible and a test written
     * here passes whether the rule exists or not. Labels open up past scale 3;
     * four presses of a x1.4 zoom clears it from the 0.95 fit.
     */
    const zoomIn = screen.getByLabelText('Zoom in');
    for (let i = 0; i < 4; i += 1) fireEvent.click(zoomIn);
    const gb = dataset.acupoints.filter((p) => p.meridianId === 'mer_gb');
    // Point labels only. The figure also carries the ⤢ glyph that opens a
    // hand or foot detail view, which is an affordance rather than a label and
    // is not what this rule is about.
    const shown = [...container.querySelectorAll('text')]
      .map((el) => el.textContent ?? '')
      .filter((s) => /[A-Z]{2}\d+/.test(s));
    expect(shown.length).toBeGreaterThan(0);
    // Every drawn label belongs to the selected channel.
    for (const label of shown) {
      const owned = gb.some((p) => label.includes(p.code));
      expect({ label, ownedBySelection: owned }).toEqual({ label, ownedBySelection: true });
    }
  });

  it('costs nothing in reachability', { timeout: 30000 }, () => {
    // Only the drawn text goes. Every point keeps its marker, its tap target
    // and its accessible name, so it is still findable by pointer, keyboard and
    // screen reader — which is what makes suppressing labels an acceptable
    // answer to density where shrinking the markers was not.
    const plain = mount();
    const hitsPlain = plain.container.querySelectorAll('.marker-hit').length;
    cleanup();
    const focused = mount({ kind: 'meridian', meridianId: 'mer_gb' });
    expect(focused.container.querySelectorAll('.marker-hit').length).toBe(hitsPlain);
    const named = [...focused.container.querySelectorAll('.marker-hit')].filter((el) =>
      el.getAttribute('aria-label'),
    );
    expect(named).toHaveLength(hitsPlain);
  });

  it('does not go mute when nothing is selected', { timeout: 30000 }, () => {
    // With no selection there is nothing to protect, so the normal zoom rules
    // still apply and a hand-pressed mirror does not blank every label.
    const { container } = mount();
    fireEvent.click(mirrorButton());
    expect(container.querySelectorAll('.marker-hit').length).toBeGreaterThan(0);
  });
});

describe('帶脈 drawn as a belt', () => {
  /** The two half-ellipse arcs the girdle is drawn from. */
  const arcs = (c: HTMLElement) =>
    [...c.querySelectorAll('path')].filter((p) => /^M[\d.]+,[\d.]+ A/.test(p.getAttribute('d') ?? ''));

  it('closes into a loop, half of it behind the figure', { timeout: 30000 }, () => {
    /*
     * 帶脈 is the only vessel that runs crosswise, and a polyline through its
     * three crossings on one flank shows none of that. Two arcs sharing both
     * endpoints make a closed ellipse; the far one is dashed because it passes
     * behind the body, which is the entire reason for drawing it.
     */
    const { container } = mount({ kind: 'extraordinary', vessel: '帶脈' });
    const found = arcs(container);
    expect(found).toHaveLength(2);
    const dashed = found.filter((p) => p.getAttribute('stroke-dasharray'));
    expect(dashed).toHaveLength(1);
    // Same endpoints, opposite sweep — that is what makes it one loop.
    const ds = found.map((p) => p.getAttribute('d')!);
    const [a, b] = [ds[0]!, ds[1]!];
    const ends = (d: string) => d.replace(/ 0 0 [01] /, ' ');
    expect(ends(a)).toBe(ends(b));
    expect(a).not.toBe(b);
  });

  it('takes its level and width from 帶脈 GB26 itself', { timeout: 30000 }, () => {
    // Not a free-hand band: the belt passes through the point it is named for,
    // on both sides. Only the flattening is a drawing choice.
    const gb26 = dataset.acupoints.find((p) => p.code === 'GB26')!;
    const pl = gb26.placements.find((x) => x.view === 'front')!;
    const x = pl.x * ATLAS_WIDTH;
    const { container } = mount({ kind: 'extraordinary', vessel: '帶脈' });
    const d = arcs(container)[0]!.getAttribute('d')!;
    const nums = d.match(/[\d.]+/g)!.map(Number);
    const [startX, startY, rx] = [nums[0]!, nums[1]!, nums[2]!];
    expect(rx).toBeCloseTo(Math.abs(x - ATLAS_WIDTH / 2), 3);
    expect(startX).toBeCloseTo(ATLAS_WIDTH - x, 3);
    expect(startY).toBeCloseTo(pl.y * 924, 3);
  });

  it('draws no belt for the vessels that run lengthwise', { timeout: 30000 }, () => {
    // Only 帶脈 encircles. If this ever fires for 衝脈 the band has become
    // decoration rather than a claim about that vessel.
    const { container } = mount({ kind: 'extraordinary', vessel: '衝脈' });
    expect(arcs(container)).toHaveLength(0);
  });
});

describe('the panel keeps the whole system reachable', () => {
  const chip = (c: HTMLElement, label: RegExp) =>
    [...c.querySelectorAll('.viewer-legend .strip-chip')].find((b) =>
      label.test(b.textContent ?? ''),
    ) as HTMLElement;

  it('leaves 任脈 and 督脈 showing when filtering by group', { timeout: 30000 }, () => {
    /*
     * They are 奇經 and fall in neither half of 陰/陽 or 手/足, so "show the yang
     * channels" has nothing to say about them — and they are the two midline
     * routes every 「旁開 N 寸」 in the dataset is measured FROM. Filtering them
     * off would remove the reference the remaining points are placed against.
     */
    const { container } = mount();
    fireEvent.click(chip(container, /^Yang$/));
    const eyes = [...container.querySelectorAll('.legend-eye')];
    const on = eyes.filter((e) => e.getAttribute('aria-pressed') === 'true').length;
    // six yang channels, plus CV and GV
    expect(on).toBe(8);
  });

  it('turns the vessels on with everything else', { timeout: 30000 }, () => {
    // Without the eight, "all on" shows twelve channels and two vessels — a
    // part of the system offered as the whole of it.
    const { container } = mount();
    const withVessels = chip(container, /With vessels|含奇經八脈/);
    expect(withVessels.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(chip(container, /All on|全開/));
    expect(chip(container, /With vessels|含奇經八脈/).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(chip(container, /All off|全關/));
    expect(chip(container, /With vessels|含奇經八脈/).getAttribute('aria-pressed')).toBe('false');
  });

  it('draws the eight without needing one selected', { timeout: 30000 }, () => {
    // The point of making them a layer rather than only a highlight.
    const { container } = mount();
    // Keyed on the accent stroke, not the dash alone: `dashed` is also one of
    // the channel line styles and carries the very same '7 5' pattern in the
    // channel's own colour.
    const vesselLines = () =>
      [...container.querySelectorAll('path')].filter(
        (p) =>
          p.getAttribute('stroke-dasharray') === '7 5' &&
          p.getAttribute('stroke') === 'var(--accent)',
      ).length;
    const dashedBefore = vesselLines();
    fireEvent.click(chip(container, /With vessels|含奇經八脈/));
    const dashedAfter = vesselLines();
    expect(dashedBefore).toBe(0);
    expect(dashedAfter).toBeGreaterThan(0);
  });

  it('opens the point index from the panel, not from over the figure', { timeout: 30000 }, () => {
    // The opener used to float at the bottom-left, on top of the legend rows it
    // shared a corner with.
    const { container } = mount();
    const opener = chip(container, /List view|清單檢視/);
    expect(opener).toBeTruthy();
    fireEvent.click(opener);
    expect(screen.getByRole('heading', { name: /Point index|穴位清單/ })).toBeTruthy();
  });

  it('carries the vessels into the point index', { timeout: 30000 }, () => {
    // The list is the atlas's accessible equivalent, so anything the figure can
    // draw has to be readable here — including all eight routes.
    const { container } = mount();
    fireEvent.click(chip(container, /List view|清單檢視/));
    expect(
      screen.getByRole('heading', { name: /extraordinary vessels|奇經八脈/i }),
    ).toBeTruthy();
    for (const name of [/Girdle|帶脈/, /Penetrating|衝脈/, /Yang Motility|陽蹻脈/]) {
      expect(screen.getByRole('heading', { name })).toBeTruthy();
    }
  });
});
