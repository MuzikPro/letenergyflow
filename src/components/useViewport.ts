import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Clamp a candidate viewBox.
 *
 * Zoomed in (box smaller than the content), panning is free within a 35%
 * slack margin. At or beyond the fit scale (box at least as large as the
 * content), the box locks to centre on both axes, so zooming out shrinks the
 * figure in place instead of letting it drift off-screen.
 */
export function clampBox(
  b: Box,
  contentW: number,
  contentH: number,
  minW: number,
  maxW: number,
): Box {
  const w = Math.min(maxW, Math.max(minW, b.w));
  const h = (w / contentW) * contentH;
  if (w >= contentW) {
    return { w, h, x: (contentW - w) / 2, y: (contentH - h) / 2 };
  }
  const slackX = contentW * 0.35;
  const slackY = contentH * 0.35;
  return {
    w,
    h,
    x: Math.min(Math.max(b.x, -slackX), contentW + slackX - w),
    y: Math.min(Math.max(b.y, -slackY), contentH + slackY - h),
  };
}

/**
 * Shared zoom / pan / fit camera for the SVG atlas and the network map.
 *
 * Everything is resolution-independent: we only ever move the viewBox, so the
 * geometry stays crisp at any zoom and any screen size. Mouse, trackpad, touch
 * and keyboard all drive the same three primitives — fit, centre, zoom.
 */
export function useViewport(contentW: number, contentH: number, minScale = 0.9, maxScale = 14) {
  const initial = useMemo<Box>(
    () => ({ x: 0, y: 0, w: contentW, h: contentH }),
    [contentW, contentH],
  );
  const [box, setBox] = useState<Box>(initial);
  const boxRef = useRef<Box>(initial);
  boxRef.current = box;

  /*
   * Refit when the CONTENT changes shape.
   *
   * `useState(initial)` takes its value once, so a caller that swaps the
   * content — the region lens toggling front to back — kept the previous
   * content's dimensions while drawing at the new one's origin. The back view
   * of the shoulder was rendered through the front view's 335x285 frame.
   *
   * `initial` is memoised on the content size, so this fires only when that
   * actually changes, and never fights a zoom the learner has applied.
   */
  const firstBox = useRef(true);
  useEffect(() => {
    if (firstBox.current) {
      firstBox.current = false;
      return;
    }
    setBox(initial);
  }, [initial]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const animRef = useRef<number | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; box: Box } | null>(null);

  const minW = contentW / maxScale;
  const maxW = contentW / minScale;

  const clamp = useCallback(
    (b: Box): Box => clampBox(b, contentW, contentH, minW, maxW),
    [contentW, contentH, minW, maxW],
  );

  const cancelAnim = useCallback(() => {
    if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    animRef.current = null;
  }, []);

  useEffect(() => cancelAnim, [cancelAnim]);

  const animateTo = useCallback(
    (target: Box) => {
      cancelAnim();
      const next = clamp(target);
      if (prefersReducedMotion()) {
        setBox(next);
        return;
      }
      const from = boxRef.current;
      const dur = 420;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      /*
       * Timed against rAF's OWN timestamp, taken on the first frame.
       *
       * `now` is whatever clock the host hands requestAnimationFrame, and it
       * need not share an origin with performance.now() — jsdom's does not.
       * Starting from performance.now() and measuring against `now` mixes two
       * clocks, and the difference between their epochs lands straight in t:
       * ahead, t went negative and 1-(1-t)³ at t=-5 is -215, which threw the
       * camera out to ~72000 units wide; behind, t pinned at 0 and the camera
       * never moved at all. Reading the start off the first frame makes the
       * arithmetic independent of which clock rAF uses.
       */
      let start: number | null = null;
      const step = (now: number) => {
        if (start === null) start = now;
        const t = Math.min(1, Math.max(0, (now - start) / dur));
        const k = ease(t);
        setBox({
          x: from.x + (next.x - from.x) * k,
          y: from.y + (next.y - from.y) * k,
          w: from.w + (next.w - from.w) * k,
          h: from.h + (next.h - from.h) * k,
        });
        animRef.current = t < 1 ? requestAnimationFrame(step) : null;
      };
      animRef.current = requestAnimationFrame(step);
    },
    [cancelAnim, clamp],
  );

  const fitAll = useCallback(() => animateTo(initial), [animateTo, initial]);

  /** Fit an arbitrary region, with padding expressed as a fraction of its size. */
  const fitRegion = useCallback(
    (region: Box, pad = 0.18) => {
      const padX = Math.max(region.w * pad, contentW * 0.04);
      const padY = Math.max(region.h * pad, contentH * 0.04);
      const w = Math.max(region.w + padX * 2, ((region.h + padY * 2) * contentW) / contentH);
      const h = (w / contentW) * contentH;
      animateTo({ x: region.x + region.w / 2 - w / 2, y: region.y + region.h / 2 - h / 2, w, h });
    },
    [animateTo, contentW, contentH],
  );

  /** Centre a single coordinate at a given magnification. */
  const centerOn = useCallback(
    (x: number, y: number, scale = 3.4) => {
      const w = contentW / scale;
      const h = (w / contentW) * contentH;
      animateTo({ x: x - w / 2, y: y - h / 2, w, h });
    },
    [animateTo, contentW, contentH],
  );

  const zoomBy = useCallback(
    (factor: number, anchor?: { x: number; y: number }) => {
      cancelAnim();
      setBox((b) => {
        const w = b.w / factor;
        const h = (w / contentW) * contentH;
        const ax = anchor ? anchor.x : b.x + b.w / 2;
        const ay = anchor ? anchor.y : b.y + b.h / 2;
        const rx = (ax - b.x) / b.w;
        const ry = (ay - b.y) / b.h;
        return clamp({ x: ax - w * rx, y: ay - h * ry, w, h });
      });
    },
    [cancelAnim, clamp, contentW, contentH],
  );

  const panBy = useCallback(
    (dx: number, dy: number) => {
      cancelAnim();
      setBox((b) => clamp({ ...b, x: b.x + dx * b.w, y: b.y + dy * b.h }));
    },
    [cancelAnim, clamp],
  );

  /** Screen → SVG user space, accounting for xMidYMid letterboxing. */
  const toUser = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    const b = boxRef.current;
    const s = Math.min(r.width / b.w, r.height / b.h) || 1;
    return {
      x: b.x + (clientX - r.left - (r.width - b.w * s) / 2) / s,
      y: b.y + (clientY - r.top - (r.height - b.h * s) / 2) / s,
    };
  }, []);

  // React attaches wheel listeners passively, so preventDefault has to happen on
  // a native non-passive listener or the page scrolls behind the diagram.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(Math.exp(-e.deltaY * 0.0016), toUser(e.clientX, e.clientY));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [toUser, zoomBy]);

  const onPointerDown = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    // Capturing the pointer retargets the eventual click at the SVG itself,
    // which silently kills marker taps — so never capture when the gesture
    // starts on a marker. Panning from empty space still captures normally.
    const onMarker = e.target instanceof Element && e.target.closest('.marker-hit') !== null;
    if (!onMarker) e.currentTarget.setPointerCapture?.(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      if (a && b) pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), box: boxRef.current };
    }
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const svg = svgRef.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();

      if (pointers.current.size >= 2 && pinchStart.current) {
        const [a, b] = [...pointers.current.values()];
        if (!a || !b) return;
        const factor = Math.hypot(a.x - b.x, a.y - b.y) / (pinchStart.current.dist || 1);
        const startBox = pinchStart.current.box;
        cancelAnim();
        const w = startBox.w / factor;
        const h = (w / contentW) * contentH;
        setBox(
          clamp({
            x: startBox.x + startBox.w / 2 - w / 2,
            y: startBox.y + startBox.h / 2 - h / 2,
            w,
            h,
          }),
        );
        return;
      }

      if (e.pointerType === 'mouse' && e.buttons === 0) return;
      cancelAnim();
      const b = boxRef.current;
      const s = Math.min(r.width / b.w, r.height / b.h) || 1;
      const dx = (e.clientX - prev.x) / s;
      const dy = (e.clientY - prev.y) / s;
      setBox((cur) => clamp({ ...cur, x: cur.x - dx, y: cur.y - dy }));
    },
    [cancelAnim, clamp, contentW, contentH],
  );

  const onPointerUp = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
  }, []);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<SVGSVGElement>) => {
      const step = e.shiftKey ? 0.28 : 0.12;
      switch (e.key) {
        case 'ArrowLeft':
          panBy(-step, 0);
          break;
        case 'ArrowRight':
          panBy(step, 0);
          break;
        case 'ArrowUp':
          panBy(0, -step);
          break;
        case 'ArrowDown':
          panBy(0, step);
          break;
        case '+':
        case '=':
          zoomBy(1.35);
          break;
        case '-':
        case '_':
          zoomBy(1 / 1.35);
          break;
        case '0':
          fitAll();
          break;
        default:
          return;
      }
      e.preventDefault();
    },
    [panBy, zoomBy, fitAll],
  );

  return {
    box,
    scale: contentW / box.w,
    svgRef,
    fitAll,
    fitRegion,
    centerOn,
    zoomBy,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onKeyDown,
    },
  };
}

/** Bounding box of a set of points, with a minimum size so a single point works. */
export function boundsOf(points: { x: number; y: number }[], minSize: number): Box {
  if (points.length === 0) return { x: 0, y: 0, w: minSize, h: minSize };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  const w = Math.max(maxX - minX, minSize);
  const h = Math.max(maxY - minY, minSize);
  return { x: minX - (w - (maxX - minX)) / 2, y: minY - (h - (maxY - minY)) / 2, w, h };
}
