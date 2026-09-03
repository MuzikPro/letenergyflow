import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import { StoreProvider, pathFor, routeFromPath } from '../state/store';
import { BODY_REGIONS, pointsInRegion, preferredView, regionCamera } from '../data/regions';
import { figureBounds } from '../data/atlas';
import { LENS_VIEWPORT, lensLabelScale } from './DetailLens';
import { memoryStorage } from '../state/progress';

afterEach(cleanup);

const app = () =>
  render(
    <StoreProvider storage={memoryStorage()}>
      <App />
    </StoreProvider>,
  );

describe('region routes', () => {
  it('round-trips every region through its URL', () => {
    for (const r of BODY_REGIONS) {
      const path = pathFor('details', r.key);
      expect(path).toBe(`/details/${r.key}`);
      expect(routeFromPath(path)).toEqual({ route: 'details', region: r.key });
    }
  });

  it('maps the plain routes and rejects anything else', () => {
    expect(routeFromPath('/')).toEqual({ route: 'atlas', region: null });
    expect(routeFromPath('/flow')).toEqual({ route: 'flow', region: null });
    expect(routeFromPath('/details')).toEqual({ route: 'details', region: null });
    // A trailing slash is the same page, not a different one.
    expect(routeFromPath('/flow/')).toEqual({ route: 'flow', region: null });
    expect(routeFromPath('/details/not_a_region')?.region).toBe('not_a_region');
    expect(routeFromPath('/nope')).toBeNull();
    expect(routeFromPath('/details/wrist_hand/extra')).toBeNull();
  });

  it('does not push a history entry for the place you are already on', () => {
    window.history.replaceState(null, '', '/');
    const before = window.history.length;
    app();
    const regions = screen.getByRole('button', { name: /Regions|分區/ });
    fireEvent.click(regions);
    const afterFirst = window.history.length;
    fireEvent.click(regions);
    fireEvent.click(regions);
    // Three taps on one tab is one entry, or the device back needs three
    // presses to leave a screen you never left.
    expect(afterFirst).toBe(before + 1);
    expect(window.history.length).toBe(afterFirst);
  });

  it('writes the region into the address bar when one is opened', () => {
    window.history.replaceState(null, '', '/');
    app();
    fireEvent.click(screen.getByRole('button', { name: /Regions|分區/ }));
    fireEvent.click(screen.getByRole('button', { name: /Wrist & hand|腕部及手部/ }));
    expect(window.location.pathname).toBe('/details/wrist_hand');
  });
});

describe('region detail lesson', () => {
  it('lists every region with its own point count', () => {
    window.history.replaceState(null, '', '/');
    app();
    fireEvent.click(screen.getByRole('button', { name: /Regions|分區/ }));
    for (const r of BODY_REGIONS) {
      const card = screen.getByRole('button', { name: new RegExp(r.nameEn.replace('&', '&')) });
      expect(within(card).getByText(String(pointsInRegion(r.key).length))).toBeTruthy();
    }
  });

  it('opens the wrist & hand lens on the region it was asked for', () => {
    window.history.replaceState(null, '', '/details/wrist_hand');
    app();
    const dialog = screen.getByRole('dialog');
    // Every point the region holds on this view is labelled — nothing dropped,
    // which is the whole reason the lens exists.
    for (const p of pointsInRegion('wrist_hand')) {
      if (!p.placements.some((pl) => pl.view === 'front')) continue;
      expect(within(dialog).getAllByLabelText(`${p.nameZhHant} ${p.code}`).length).toBeGreaterThan(0);
    }
  });

  it('keeps the schematic caveat on the region lens', () => {
    window.history.replaceState(null, '', '/details/wrist_hand');
    app();
    expect(screen.getByText(/not an anatomical locator|非解剖定位依據/)).toBeTruthy();
  });

  it('frames every region inside the drawn figure, showing no empty background', () => {
    // The head's frame used to start 33 units above the skull — a quarter of
    // its height on blank background, which pushed the face out of the bottom.
    for (const r of BODY_REGIONS) {
      for (const view of ['front', 'back'] as const) {
        const box = regionCamera(r.key, view);
        if (!box) continue;
        const limit = figureBounds(view);
        expect(box.w).toBeGreaterThan(0);
        expect(box.h).toBeGreaterThan(0);

        // A frame narrower than the figure must sit inside it. One that is
        // wider — the wrist & hand spans both of the figure's sides — cannot,
        // so it is centred on the figure instead, and the background it shows
        // falls evenly on both sides rather than all on one.
        const fits = (pos: number, size: number, lo: number, span: number) => {
          if (size >= span) {
            expect(pos + size / 2).toBeCloseTo(lo + span / 2, 1);
            return;
          }
          expect(pos).toBeGreaterThanOrEqual(lo - 0.01);
          expect(pos + size).toBeLessThanOrEqual(lo + span + 0.01);
        };
        fits(box.x, box.w, limit.x, limit.w);
        fits(box.y, box.h, limit.y, limit.h);
      }
    }
  });

  it('never crops a region out of its own frame', () => {
    // The frame carries a context margin and is then capped at the figure's
    // size. Capping trims padding — it must never trim a point.
    for (const r of BODY_REGIONS) {
      for (const view of ['front', 'back'] as const) {
        const box = regionCamera(r.key, view);
        if (!box) continue;
        for (const p of pointsInRegion(r.key)) {
          const pl = p.placements.find((x) => x.view === view);
          if (!pl) continue;
          const x = pl.x * 400;
          const y = pl.y * 924;
          expect({ code: p.code, inside: x >= box.x && x <= box.x + box.w }).toEqual({
            code: p.code,
            inside: true,
          });
          expect({ code: p.code, inside: y >= box.y && y <= box.y + box.h }).toEqual({
            code: p.code,
            inside: true,
          });
        }
      }
    }
  });

  it('gives every region a margin of surrounding anatomy', () => {
    // A region cropped to its own points is unrecognisable — the head lesson
    // cut the face off below the mouth. Each frame is meaningfully larger than
    // the cloud it contains, unless the figure's own edge stops it.
    for (const r of BODY_REGIONS) {
      const view = 'front';
      const box = regionCamera(r.key, view);
      if (!box) continue;
      const ys = pointsInRegion(r.key)
        .map((p) => p.placements.find((pl) => pl.view === view))
        .filter((pl): pl is NonNullable<typeof pl> => Boolean(pl))
        .map((pl) => pl.y * 924);
      if (ys.length === 0) continue;
      const cloudH = Math.max(...ys) - Math.min(...ys);
      expect(box.h).toBeGreaterThan(cloudH);
    }
  });

  it('draws labels the same size whether a region is tall or wide', () => {
    /*
     * A label's on-screen size is its user-space size times the fit scale, and
     * `meet` fits by whichever axis binds. With mismatched divisors the axis
     * decided the text size: landscape regions rendered at 10px and portrait
     * ones — face, abdomen, knee, hip, back — at 6.6px. Measured in the
     * browser at 1440px, the thorax gives 10.0px and the back 8.3px; this
     * holds every region to that band.
     */
    const sizes = BODY_REGIONS.map((r) => {
      const view = preferredView(r.key);
      const box = regionCamera(r.key, view)!;
      const fit = Math.min(LENS_VIEWPORT.w / box.w, LENS_VIEWPORT.h / box.h);
      return { key: r.key, px: 4.6 * lensLabelScale(box.w, box.h) * fit };
    });
    for (const s of sizes) {
      expect({ key: s.key, legible: s.px >= 8 }).toEqual({ key: s.key, legible: true });
    }
    const spread = Math.max(...sizes.map((s) => s.px)) / Math.min(...sizes.map((s) => s.px));
    expect(spread).toBeLessThan(1.3);
  });

  it('never leaves a frame as a thin vertical ribbon', () => {
    // The back's points are a 132-by-504 strip. Rendered as-is on a landscape
    // screen that is a sliver down the middle with the width going to waste —
    // and since the frame is bound by its height either way, the extra width
    // is free context rather than lost magnification.
    for (const r of BODY_REGIONS) {
      for (const view of ['front', 'back'] as const) {
        const box = regionCamera(r.key, view);
        if (!box) continue;
        expect(box.w / box.h).toBeGreaterThanOrEqual(0.61);
      }
    }
  });

  it('centres each frame on the points it is a picture of', () => {
    // A one-sided label gutter used to shift the anatomy a quarter-frame left.
    for (const r of BODY_REGIONS) {
      const view = 'front';
      const box = regionCamera(r.key, view);
      if (!box) continue;
      const xs = pointsInRegion(r.key)
        .map((p) => p.placements.find((pl) => pl.view === view))
        .filter((pl): pl is NonNullable<typeof pl> => Boolean(pl))
        .map((pl) => pl.x * 400);
      if (xs.length === 0) continue;
      const cloudMid = (Math.min(...xs) + Math.max(...xs)) / 2;
      const frameMid = box.x + box.w / 2;
      // Within a tenth of the frame's width, allowing for the edge clamp.
      expect(Math.abs(cloudMid - frameMid)).toBeLessThan(box.w * 0.1);
    }
  });

  it('magnifies the frame when zoomed, and returns to it on fit', async () => {
    window.history.replaceState(null, '', '/details/wrist_hand');
    app();
    const svg = () => screen.getByRole('dialog').querySelector('svg.extremity-svg')!;
    const width = () => Number(svg().getAttribute('viewBox')!.split(' ')[2]);

    const frame = regionCamera('wrist_hand', 'front')!;
    expect(width()).toBeCloseTo(frame.w, 1);

    fireEvent.click(screen.getByRole('button', { name: /Zoom in|放大/ }));
    // A smaller viewBox over the same element IS the magnification.
    await waitFor(() => expect(width()).toBeCloseTo(frame.w / 1.4, 1));

    fireEvent.click(screen.getByRole('button', { name: /Fit the whole region|全景/ }));
    await waitFor(() => expect(width()).toBeCloseTo(frame.w, 1));
  });

  it('keeps labels readable as it zooms instead of only spreading the points', async () => {
    window.history.replaceState(null, '', '/details/wrist_hand');
    app();
    const dialog = screen.getByRole('dialog');
    const svg = () => dialog.querySelector('svg.extremity-svg')!;
    const label = () => Number(dialog.querySelector('.marker-label')!.getAttribute('font-size'));
    const boxW = () => Number(svg().getAttribute('viewBox')!.split(' ')[2]);

    // Screen size = user-space size ÷ viewBox width. It must GROW with zoom —
    // pinned to the camera, zooming would only spread the points apart.
    const before = label() / boxW();
    fireEvent.click(screen.getByRole('button', { name: /Zoom in|放大/ }));
    await waitFor(() => expect(boxW()).toBeLessThan(700));
    const after = label() / boxW();
    expect(after).toBeGreaterThan(before);
    // …but not linearly, or a deep zoom would fill the frame with two words.
    expect(after).toBeLessThan(before * 1.4);
  });

  it('flips a label clear of the marker it would be written over', () => {
    // The abdomen is three parallel columns about 10 units apart (任脈, 腎經,
    // 胃經), and the 任脈 labels were being covered by the 腎經 markers beside
    // them. Anything crowded on its right is written to its left instead.
    window.history.replaceState(null, '', '/details/abdomen_groin');
    app();
    const labels = [...screen.getByRole('dialog').querySelectorAll('.marker-label')];
    const flipped = labels.filter((l) => l.getAttribute('text-anchor') === 'end');
    expect(flipped.length).toBeGreaterThan(0);
    // Not everything — flipping every label would just move the problem.
    expect(flipped.length).toBeLessThan(labels.length);
  });

  it('keeps every label inside the frame', () => {
    window.history.replaceState(null, '', '/details/head');
    app();
    const svg = screen.getByRole('dialog').querySelector('svg.extremity-svg')!;
    const [bx, , bw] = svg.getAttribute('viewBox')!.split(' ').map(Number) as [
      number,
      number,
      number,
      number,
    ];
    for (const l of svg.querySelectorAll('.marker-label')) {
      const x = Number(l.getAttribute('x'));
      expect(x).toBeGreaterThanOrEqual(bx!);
      expect(x).toBeLessThanOrEqual(bx! + bw!);
    }
  });

  it('refits the camera when the view is switched', async () => {
    /*
     * The camera took its size from useState, which ignores later changes, so
     * toggling front→back kept the PREVIOUS view's dimensions while drawing at
     * the new view's origin: the shoulder's back view was rendered through the
     * front view's 335x285 frame, and its labels came out at 5px.
     */
    window.history.replaceState(null, '', '/details/shoulder_arm');
    app();
    const svg = () => screen.getByRole('dialog').querySelector('svg.extremity-svg')!;
    const size = () => svg().getAttribute('viewBox')!.split(' ').slice(2).map(Number);

    const front = regionCamera('shoulder_arm', 'front')!;
    const back = regionCamera('shoulder_arm', 'back')!;
    // The two frames must differ, or this test proves nothing.
    expect(front.w).not.toBeCloseTo(back.w, 0);

    expect(size()[0]).toBeCloseTo(front.w, 0);
    fireEvent.click(screen.getByRole('button', { name: /^(Front|正面)$/ }));
    await waitFor(() => expect(size()[0]).toBeCloseTo(back.w, 0));
    expect(size()[1]).toBeCloseTo(back.h, 0);
  });

  it('claims the list scrolls only when it actually overflows', () => {
    /*
     * jsdom reports every element as zero-sized, so nothing overflows and the
     * cue must stay hidden. That is the case worth pinning: the cue is driven
     * by a measurement, not by "this is a long list" — telling someone to
     * scroll a list that does not scroll is worse than saying nothing.
     */
    window.history.replaceState(null, '', '/details/head');
    app();
    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('.extremity-listwrap')).toBeTruthy();
    expect(dialog.querySelector('.extremity-list')).toBeTruthy();
    expect(dialog.querySelector('.list-more')).toBeNull();
    expect(dialog.querySelector('.extremity-listwrap[data-more]')).toBeNull();
  });

  it('lets a marker be tapped rather than swallowed by the pan gesture', () => {
    window.history.replaceState(null, '', '/details/wrist_hand');
    app();
    // useViewport declines to capture the pointer when a gesture starts on a
    // `.marker-hit`; without that class every tap becomes a pan.
    const dialog = screen.getByRole('dialog');
    const marker = dialog.querySelector('.marker')!;
    expect(marker.classList.contains('marker-hit')).toBe(true);
  });

  it('returns to the region index when the lens is closed', () => {
    window.history.replaceState(null, '', '/details/wrist_hand');
    app();
    fireEvent.click(screen.getByRole('button', { name: /Close|關閉/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(window.location.pathname).toBe('/details');
  });
});
