import { describe, expect, it } from 'vitest';
import { limbOutline } from '../data/atlas';
import { clampBox } from './useViewport';

const W = 400;
const H = 900;
const minW = W / 16;
const maxW = W / 0.95;

describe('clampBox', () => {
  it('locks the box to centre at and beyond the fit scale', () => {
    // Zoomed all the way out with the box dragged far off to one side.
    const out = clampBox({ x: -300, y: 500, w: maxW, h: (maxW / W) * H }, W, H, minW, maxW);
    expect(out.x).toBeCloseTo((W - maxW) / 2);
    expect(out.y).toBeCloseTo((H - out.h) / 2);
  });

  it('keeps the figure centred while zooming out from an off-centre position', () => {
    // Zoomed-in on a corner, then zoomed out past fit: no drift allowed.
    const zoomedIn = clampBox({ x: 300, y: 800, w: 100, h: 225 }, W, H, minW, maxW);
    const zoomedOut = clampBox({ ...zoomedIn, w: W, h: H }, W, H, minW, maxW);
    expect(zoomedOut.x).toBeCloseTo(0);
    expect(zoomedOut.y).toBeCloseTo(0);
  });

  it('allows panning with bounded slack while zoomed in', () => {
    const b = clampBox({ x: -10_000, y: -10_000, w: 100, h: 225 }, W, H, minW, maxW);
    expect(b.x).toBeCloseTo(-W * 0.35);
    expect(b.y).toBeCloseTo(-H * 0.35);
  });

  it('respects the min and max zoom bounds', () => {
    expect(clampBox({ x: 0, y: 0, w: 1, h: 2 }, W, H, minW, maxW).w).toBe(minW);
    expect(clampBox({ x: 0, y: 0, w: 9_999, h: 9_999 }, W, H, minW, maxW).w).toBe(maxW);
  });
});

describe('limbOutline', () => {
  it('produces a closed smooth outline around a centre-line', () => {
    const d = limbOutline(
      [
        [0, 0],
        [0, 100],
        [0, 200],
      ],
      [10, 8, 6],
    );
    expect(d.startsWith('M')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
    expect(d.includes('C')).toBe(true);
  });

  it('returns an empty path when widths do not match the centre-line', () => {
    expect(limbOutline([[0, 0]], [5])).toBe('');
    expect(
      limbOutline(
        [
          [0, 0],
          [10, 10],
        ],
        [5],
      ),
    ).toBe('');
  });
});
