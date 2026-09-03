import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { dataset } from '../data';
import { ATLAS_HEIGHT, ATLAS_WIDTH, denorm, figureShapes, smoothPath } from '../data/atlas';
import { StoreProvider, useStore } from '../state/store';
import { memoryStorage } from '../state/progress';
import { boundsOf } from './useViewport';
import Atlas from './Atlas';
import AboutView from '../views/AboutView';

/*
 * `globals: false`, so Testing Library registers no automatic cleanup and a
 * render survives the test that made it. Left alone, this file ended the run
 * with several atlases still mounted, and React's scheduler — which defers work
 * through setImmediate — woke up after jsdom had been torn down and reached for
 * a `window` that no longer existed:
 *
 *   ReferenceError: window is not defined
 *     at react-dom-client.development.js  ❯ performWorkUntilDeadline
 *
 * It surfaced as an unhandled error attributed to this file rather than to any
 * one test, and it came and went between runs depending on how the teardown and
 * that callback raced. Unmounting after each test drains React's queue while
 * the environment still exists — and takes the viewport's in-flight camera
 * animation with it, since useViewport cancels its frame on unmount.
 *
 * The per-container queries below stay as they are: they were written to
 * survive a stale render, and belt-and-braces is the right posture for a file
 * that mounts the whole 362-marker atlas five times over.
 */
afterEach(cleanup);

describe('atlas geometry', () => {
  it('produces a smooth path through every ordered station', () => {
    const d = smoothPath([
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 0 },
    ]);
    expect(d.startsWith('M0.00,0.00')).toBe(true);
    expect(d.split('C').length - 1).toBe(2);
  });

  it('derives each meridian route from its own point placements', () => {
    for (const m of dataset.meridians) {
      expect(m.atlasPaths.length).toBeGreaterThan(0);
      // A channel is drawn as one or more segments — a new one starts wherever
      // the route changes body view or the numbering doubles back. Across all
      // of them there is exactly one curve per gap between consecutive drawn
      // stations. A segment holding a SINGLE point draws no line at all and is
      // dropped (天髎 TE15 is the only station its channel puts on the back
      // view), so the expected count is derived from the drawn segments rather
      // than assuming every point ends up on one.
      const drawn = m.atlasPaths.reduce(
        (n, p) => n + p.d.split('C').length,
        0,
      ); // stations per segment = curves + 1
      const curves = m.atlasPaths.reduce((n, p) => n + p.d.split('C').length - 1, 0);
      expect({ code: m.code, curves }).toEqual({
        code: m.code,
        curves: drawn - m.atlasPaths.length,
      });
      // Nothing may be silently dropped beyond those lone-station segments.
      const onPaths = curves + m.atlasPaths.length;
      expect(m.pointOrder.length - onPaths).toBeLessThanOrEqual(1);
    }
  });

  it('draws a channel that surfaces on both views as separate per-view segments', () => {
    // 小腸經 runs up the arm on the front, crosses the scapula on the back and
    // returns to the face. Joining those would draw a line through the body.
    const si = dataset.meridians.find((m) => m.id === 'mer_si')!;
    expect(si.atlasPaths.filter((p) => p.view === 'front').length).toBe(2);
    expect(si.atlasPaths.filter((p) => p.view === 'back').length).toBe(1);

    // 膀胱經 additionally doubles back up the second paravertebral line.
    const bl = dataset.meridians.find((m) => m.id === 'mer_bl')!;
    expect(bl.atlasPaths.filter((p) => p.view === 'front').length).toBe(1);
    expect(bl.atlasPaths.filter((p) => p.view === 'back').length).toBe(4);
  });

  it('computes a bounding box big enough to keep context around one point', () => {
    const b = boundsOf([{ x: 200, y: 400 }], 90);
    expect(b.w).toBe(90);
    expect(b.h).toBe(90);
    expect(b.x).toBe(155);
  });

  it('keeps the atlas viewBox resolution-independent', () => {
    expect(ATLAS_WIDTH).toBeGreaterThan(0);
    expect(ATLAS_HEIGHT).toBeGreaterThan(0);
  });
});

/**
 * The back view drew the front view's hands and feet.
 *
 * Both extremities lived in one shared array, so `figureShapes.back` reused
 * them unchanged — the foot showed a dorsal splay, five toes fanned at a
 * viewer standing behind the figure, which is the one direction from which you
 * cannot see them. The heel is what you see from there.
 *
 * The hand is the case that looks like a bug and is not: turning the body
 * round and seeing the other face cancel out, so one splayed silhouette with
 * the thumb lateral serves as a right palm and as a left dorsum. It keeps its
 * outline and gains knuckles rather than being mirrored — mirroring would put
 * the thumb medial, which is wrong on both views.
 */
describe('the figure is actually turned round on the back view', () => {
  /** Vertical extent of a generated path. */
  const spanY = (d: string) => {
    const n = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    const ys = n.filter((_, i) => i % 2 === 1);
    return Math.max(...ys) - Math.min(...ys);
  };

  /** Mean x of a generated path — these emit plain x,y number pairs. */
  const meanX = (d: string) => {
    const n = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    const xs = n.filter((_, i) => i % 2 === 0);
    return xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
  };

  const paths = (v: 'front' | 'back') =>
    figureShapes[v].filter((s) => s.kind === 'path').map((s) => s.d);

  it('draws a different foot from behind, and the same hand', () => {
    const f = paths('front');
    const b = paths('back');
    // Hands: indices 2..13 — five digits and a palm loop per side.
    expect(f.slice(2, 14)).toEqual(b.slice(2, 14));
    // Feet: the shapes after the two leg outlines.
    expect(f.slice(16, 28)).not.toEqual(b.slice(16, 28));
  });

  it('keeps the thumb lateral, which is why one hand serves both views', () => {
    /*
     * Mirroring the hand was the tempting fix and it is the wrong one: it puts
     * the thumb against the body. The shared silhouette is only correct while
     * the thumb sits FURTHER from the midline than the palm — assert that, or
     * "front hand equals back hand" is satisfied just as well by two
     * identically wrong hands.
     *
     * Read off the DRAWN path, not off the frame. An earlier version of this
     * called handPoint(), which maps local coordinates through the frame and so
     * returns the same answer whatever the outline does — it passed happily
     * with the palm mirrored underneath it.
     */
    const mid = ATLAS_WIDTH / 2;
    const paths = figureShapes.front.filter((x) => x.kind === 'path').map((x) => x.d);
    // extremityShapes emits the five digits first, then the palm loop; the
    // hands are the six shapes per side that follow the two arm outlines.
    const hands = [
      { side: 'viewer-left', thumb: paths[2]!, palm: paths[7]! },
      { side: 'viewer-right', thumb: paths[8]!, palm: paths[13]! },
    ];
    for (const h of hands) {
      expect({ side: h.side, thumbFurther: meanX(h.thumb) }).toBeTruthy();
      const d = Math.abs(meanX(h.thumb) - mid) - Math.abs(meanX(h.palm) - mid);
      expect({ side: h.side, thumbIsLateral: d > 0 }).toEqual({ side: h.side, thumbIsLateral: true });
    }
  });

  it('keeps the big toe medial on the front view', () => {
    // The same trap one limb down, and read the same way — off the drawing.
    const mid = ATLAS_WIDTH / 2;
    const paths = figureShapes.front.filter((x) => x.kind === 'path').map((x) => x.d);
    // Feet follow the two leg outlines: five toes then the sole loop, per side.
    // TOES[0] is the big toe and TOES[4] the little one.
    for (const [side, big, little] of [
      ['viewer-left', paths[16]!, paths[20]!],
      ['viewer-right', paths[22]!, paths[26]!],
    ] as const) {
      const d = Math.abs(meanX(big) - mid) - Math.abs(meanX(little) - mid);
      expect({ side, bigToeIsMedial: d < 0 }).toEqual({ side, bigToeIsMedial: true });
    }
  });

  it('keeps all five toes on both views, shortened from behind', () => {
    /*
     * The first attempt drew two toes from behind, on the reasoning that the
     * rest hide behind the heel. It read as a stump — a foot with two stubby
     * digits looks deformed rather than turned away — and it broke the figure
     * spec, which requires articulated digits. Five short toes is the honest
     * reading: each still there and still in order, projecting a few units
     * instead of a dozen because you are looking down their length.
     */
    const toes = (v: 'front' | 'back') => {
      const paths = figureShapes[v].filter((x) => x.kind === 'path').map((x) => x.d);
      // Feet follow the two arms, twelve hand shapes and the two legs: five
      // toes then a sole loop per side.
      const t = paths.slice(16, 21);
      expect({ view: v, count: t.length }).toEqual({ view: v, count: 5 });
      return t.map((d) => spanY(d!));
    };
    const front = toes('front');
    const back = toes('back');
    // Per toe, not summed: a total lets one full-length digit hide inside it,
    // which is exactly what slipped past the first version of this check.
    for (let i = 0; i < 5; i += 1) {
      expect({ toe: i, shorter: back[i]! < front[i]! }).toEqual({ toe: i, shorter: true });
      // Shorter, not vestigial — a toe you cannot see is worse than the bug.
      expect({ toe: i, visible: back[i]! > front[i]! * 0.25 }).toEqual({ toe: i, visible: true });
    }
  });

  it('adds the detail that tells a back from a front', () => {
    const strokes = (v: 'front' | 'back') =>
      figureShapes[v].filter((s) => s.kind === 'stroke').length;
    // Knuckle row plus three metacarpals per hand, heel curve plus Achilles per
    // foot: twelve strokes that exist on one view only.
    expect(strokes('back')).toBeGreaterThan(strokes('front'));
  });

  it('moves none of the nine points drawn over a back-view foot', () => {
    /*
     * 崑崙 BL60 down to 至陰 BL67, and 丘墟 GB40, are the only points drawn over
     * a foot on this view. The posterior outline was shaped around where they
     * already were, because a coordinate here comes from a landmark and a
     * bone-cun distance — never from what a new outline happened to need.
     */
    const expected: Record<string, [number, number]> = {
      BL60: [146.2, 833.9],
      BL61: [141.6, 837.5],
      BL62: [138.7, 841.7],
      BL63: [135.0, 847.8],
      BL64: [131.7, 852.9],
      BL65: [128.9, 859.3],
      BL66: [127.4, 864.1],
      BL67: [125.7, 866.6],
      GB40: [256.6, 836.1],
    };
    for (const [code, [x, y]] of Object.entries(expected)) {
      const p = dataset.acupoints.find((a) => a.code === code)!;
      const pl = p.placements[0]!;
      expect({ code, view: pl.view }).toEqual({ code, view: 'back' });
      const c = denorm(pl.x, pl.y);
      expect({ code, x: Number(c.x.toFixed(1)) }).toEqual({ code, x });
      expect({ code, y: Number(c.y.toFixed(1)) }).toEqual({ code, y });
    }
  });
});

describe('atlas rendering', () => {
  const renderAtlas = () =>
    render(
      <StoreProvider storage={memoryStorage()}>
        <Atlas />
      </StoreProvider>,
    );

  it('exposes a keyboard-reachable button for every mapped point', { timeout: 60000 }, () => {
    renderAtlas();
    // Every point is placed on exactly one view; the atlas opens on the front,
    // so only the front set is in the tree at this moment.
    for (const p of dataset.acupoints) {
      expect(p.placements.length).toBe(1);
    }
    const mapped = dataset.acupoints.filter((p) => p.placements.some((pl) => pl.view === 'front'));
    const onBack = dataset.acupoints.length - mapped.length;
    expect(onBack).toBeGreaterThan(0);
    /*
     * Accessible names are computed ONCE and matched in memory. Asking
     * getAllByRole for each of the 256 mapped points re-derives the role and
     * name of every button in the tree each time — quadratic, and it had grown
     * to nearly two minutes. The assertion is unchanged: every mapped point
     * needs some button whose name carries its code.
     */
    const names = screen.getAllByRole('button').map(
      (b) => b.getAttribute('aria-label') ?? b.textContent ?? '',
    );
    const missing = mapped
      .filter((p) => !names.some((n) => new RegExp(`${p.code}\\b`).test(n)))
      .map((p) => p.code);
    expect(missing).toEqual([]);
  });

  it('does not bury the canvas under a standing disclaimer bar', () => {
    // The permanent "schematic figure" banner used to span the atlas and cover
    // the figure's feet. It now lives on the Sources & disclaimer page; the
    // caption is reserved for contextual camera status.
    renderAtlas();
    expect(screen.queryByText(/Schematic figure, not an anatomical reference/)).toBeNull();
    expect(screen.queryByText(/示意圖，非解剖圖/)).toBeNull();
  });

  // Renders all 362 markers and 14 routes; comfortably over the 5s default
  // once the rest of the suite is competing for the machine.
  it('offers a meridian layer toggle rather than colour alone', { timeout: 30000 }, () => {
    renderAtlas();
    for (const m of dataset.meridians) {
      expect(
        screen.getAllByRole('button', { name: new RegExp(`${m.code} ·`) }).length,
      ).toBeGreaterThan(0);
    }
  });
});

describe('schematic disclaimer', () => {
  it('is stated on the Sources & disclaimer page', () => {
    render(
      <StoreProvider storage={memoryStorage()}>
        <AboutView />
      </StoreProvider>,
    );
    expect(screen.getAllByText(/示意圖，非解剖圖|schematic figure, not an anatomical reference/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/尚未經專家審核|marker positions are unreviewed/i).length).toBeGreaterThan(0);
  });

  // Renders AboutView with the whole source registry; over the 5s default once
  // the rest of the suite is competing for the machine.
  it('lists every registered source centrally', { timeout: 30000 }, () => {
    render(
      <StoreProvider storage={memoryStorage()}>
        <AboutView />
      </StoreProvider>,
    );
    for (const s of dataset.sources) {
      expect(screen.getAllByText(s.title).length).toBeGreaterThan(0);
    }
  });
});

/**
 * The 特定穴 matrix, the practice quiz and the Learn page's meridian chips all
 * set the focus and THEN switch route, so the atlas mounts with a focus already
 * in place rather than receiving it while mounted. The camera effect has to
 * treat that as a new focus and move — otherwise a point arrives open in the
 * detail panel while the figure sits on the whole body, which reads as a dead
 * link. Search, the path these tests do NOT cover, focuses an atlas that is
 * already on screen.
 */
describe('camera on a focus that predates the mount', () => {
  const FULL = ATLAS_WIDTH;

  function Harness({ pointId }: { pointId: string }) {
    const { setFocus, focus } = useStore();
    useEffect(() => {
      setFocus({ kind: 'point', pointId });
    }, [setFocus, pointId]);
    // Atlas mounts only once the focus exists — the route-switch ordering.
    return focus.kind === 'point' ? <Atlas /> : null;
  }

  // The suite runs with `globals: false`, so Testing Library's auto-cleanup is
  // never registered and earlier renders are still in document.body. Query THIS
  // render's container, or a stale atlas parked on the full figure answers.
  const mount = (pointId: string) => {
    const { container } = render(
      <StoreProvider storage={memoryStorage()}>
        <Harness pointId={pointId} />
      </StoreProvider>,
    );
    return () => {
      const svg = container.querySelector('.viewer > svg')!;
      return Number(svg.getAttribute('viewBox')!.split(' ')[2]);
    };
  };

  it('magnifies onto a front-view point set before the atlas rendered', async () => {
    const boxW = mount('pt_st36');
    expect(boxW()).toBe(FULL);
    await waitFor(() => expect(boxW()).toBeLessThan(FULL * 0.5), { timeout: 8000 });
  }, 20000);

  it('flips to the back and magnifies for a back-view point', async () => {
    // 腎俞 BL23 is on the back: the view has to flip first and the camera
    // finish on the rerun. Both halves have to happen for this to pass.
    const boxW = mount('pt_bl23');
    await waitFor(() => expect(boxW()).toBeLessThan(FULL * 0.5), { timeout: 8000 });
  }, 20000);
});

/**
 * A 募俞 pair is the one focus that must re-aim when the view flips: its two
 * halves are on opposite sides of the figure, and walking between them IS the
 * front/back toggle. Every other focus deliberately ignores the flip, so this
 * behaviour needs its own guard — and this could not be checked in the browser
 * pane, where document.visibilityState is 'hidden' and requestAnimationFrame
 * never fires, so the camera animation never advances there.
 */
describe('camera on a 募俞 pair', () => {
  const FULL = ATLAS_WIDTH;

  function PairHarness({ organ }: { organ: string }) {
    const { setFocus, focus } = useStore();
    useEffect(() => {
      setFocus({ kind: 'shu_mu', organ });
    }, [setFocus, organ]);
    return focus.kind === 'shu_mu' ? <Atlas /> : null;
  }

  const mountPair = (organ: string) => {
    const { container } = render(
      <StoreProvider storage={memoryStorage()}>
        <PairHarness organ={organ} />
      </StoreProvider>,
    );
    const box = () => {
      const svg = container.querySelector('.viewer > svg')!;
      const [x, y, w, h] = svg.getAttribute('viewBox')!.split(' ').map(Number);
      return { x: x!, y: y!, w: w!, h: h! };
    };
    return { box, boxW: () => box().w, container };
  };

  /** Where a point is drawn, in the same user space as the viewBox. */
  const spot = (code: string) => {
    const p = dataset.acupoints.find((a) => a.code === code)!;
    const pl = p.placements[0]!;
    return denorm(pl.x, pl.y);
  };

  /** Poll until the eased camera stops moving, then return where it came to rest. */
  const settled = async (box: () => { x: number; y: number; w: number; h: number }) => {
    let last = box();
    for (let i = 0; i < 40; i += 1) {
      await new Promise((r) => setTimeout(r, 60));
      const now = box();
      if (now.x === last.x && now.y === last.y && now.w === last.w) return now;
      last = now;
    }
    return last;
  };

  /**
   * Magnified AND aimed at this point. Both halves matter: the full-figure box
   * trivially contains every point, so containment alone proves nothing, and a
   * zoom left over from the other view is magnified but aimed somewhere else.
   */
  const aimedAt = (
    b: { x: number; y: number; w: number; h: number },
    c: { x: number; y: number },
  ) =>
    b.w < ATLAS_WIDTH * 0.5 &&
    c.x >= b.x &&
    c.x <= b.x + b.w &&
    c.y >= b.y &&
    c.y <= b.y + b.h;

  it('magnifies the half that is on the current view', async () => {
    // 脾: 章門 LR13 is on the front, where the atlas opens.
    const { boxW } = mountPair('spleen');
    expect(boxW()).toBe(FULL);
    await waitFor(() => expect(boxW()).toBeLessThan(FULL * 0.5), { timeout: 8000 });
  }, 20000);

  it('re-aims on the partner when the view is flipped', async () => {
    const { box, container } = mountPair('spleen');
    // Front: the camera settles on 章門 LR13.
    await waitFor(() => expect(aimedAt(box(), spot('LR13'))).toBe(true), { timeout: 8000 });
    // The camera eases over 420ms, so a reading taken the moment `aimedAt`
    // first goes true is still in flight — and a box that is still moving would
    // "move" after the flip whether or not the flip did anything. Wait for it
    // to come to rest before taking the baseline.
    const before = await settled(box);

    const toggle = within(container).getByRole('button', { name: /Switch body view|切換前後視圖/ });
    expect(toggle.textContent).toMatch(/Front|前/);
    fireEvent.click(toggle);
    // Prove the flip happened before asking anything about the camera.
    expect(toggle.textContent).toMatch(/Back|後/);

    // Asserting the zoom alone proves nothing here: the stale front-view box is
    // already magnified, so the guard swallowing the flip would pass. What has
    // to be true is that the camera now HOLDS 脾俞 — a different place entirely.
    // Containment cannot tell the two apart here — 章門 and 脾俞 sit at the SAME
    // vertebral level, which is the whole point of the pair, so the box already
    // aimed at 章門 also contains 脾俞. What separates a real re-aim from the
    // guard swallowing the flip is that the camera MOVES; if it never does,
    // this wait times out and the test fails.
    await waitFor(() => expect(box().x).not.toBe(before.x), { timeout: 8000 });
    await waitFor(() => expect(aimedAt(box(), spot('BL20'))).toBe(true), { timeout: 8000 });
  }, 25000);

  it('flips when neither half is on the opening view', async () => {
    // 腎 is the exception: 京門 GB25 is drawn on the back beside 腎俞 BL23, so
    // the front holds neither and the camera has to flip before it can aim.
    const { boxW } = mountPair('kidney');
    await waitFor(() => expect(boxW()).toBeLessThan(FULL * 0.6), { timeout: 8000 });
  }, 20000);
});
