import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { acupointById, dataset, meridianById } from '../data';
import { denorm, figureShapes } from '../data/atlas';
import type { Acupoint, BodyViewId } from '../data/types';
import { useBilingual, useStore } from '../state/store';
import { useViewport } from './useViewport';

const DASH: Record<string, string | undefined> = {
  solid: undefined,
  dashed: '7 5',
  dotted: '0.5 6',
  dashdot: '9 4 1.5 4',
  longdash: '14 6',
  shortdash: '4 4',
  dashdotdot: '10 4 1.5 4 1.5 4',
  longdashdot: '18 5 2 5',
  finedash: '3 6',
  doubledash: '12 4 4 4',
  longdashdotdot: '16 4 1.5 4 1.5 4',
  sparsedot: '1 8',
  railroad: '2 3 9 3',
  longsolid: '26 5',
};

/**
 * How large labels and markers are drawn, in user units, for a given frame.
 *
 * The two divisors are in the proportion of the space the lens actually gets
 * on screen — about 869 x 720 in the modal's picture column. At 400 and 500
 * they were not, so whichever axis bound the fit decided the text size:
 * landscape frames rendered at 10px and portrait ones at 6.6px. That made the
 * back look like a density problem when the face, abdomen, knee and hip all
 * shared it.
 *
 * Exported so a test can hold the two shapes to the same on-screen size.
 */
export const lensLabelScale = (w: number, h: number) => Math.max(w / 400, h / 340);

/** The space the lens is laid out in, which the divisors above are tuned to. */
export const LENS_VIEWPORT = { w: 869, h: 720 };

export interface LensBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * A magnifying camera on the one figure.
 *
 * Extracted from the hand/foot detail view so the region lessons can use the
 * same lens without a second implementation. The important property is
 * unchanged and worth restating: this is a second CAMERA, not a second
 * drawing. It renders the identical `figureShapes`, the identical routes and
 * the identical placements, clipped to a box. It therefore cannot drift out of
 * agreement with the main atlas, and every label fits without decluttering.
 *
 * Callers decide WHICH points the lens is about; the box decides what is drawn
 * around them. The two differ on purpose — a region lens shows its neighbours
 * as context without claiming them.
 */
export default function DetailLens({
  box,
  view,
  titleZhHant,
  titleEn,
  points,
  onClose,
  children,
}: {
  box: LensBox;
  view: BodyViewId;
  titleZhHant: string;
  titleEn: string;
  /** The points this lens is about, already resolved by the caller. */
  points: Acupoint[];
  onClose: () => void;
  /** Extra controls for the header — a view toggle, a lesson link. */
  children?: React.ReactNode;
}) {
  const { focus, setFocus, lang } = useStore();
  const t = useBilingual();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /*
   * The lens is itself zoomable and pannable.
   *
   * Reuses the atlas camera rather than growing a second gesture layer, so
   * pinch, trackpad wheel, drag and the arrow/+/-/0 keys all behave exactly as
   * they do on the main figure. The camera works in coordinates RELATIVE to
   * the region frame — it starts at the frame and is clamped around it — and
   * the frame's own origin is added back when the viewBox is written, so the
   * drawing is still in absolute atlas coordinates and nothing has to move.
   */
  const vp = useViewport(box.w, box.h, 0.9, 12);
  const camera = {
    x: box.x + vp.box.x,
    y: box.y + vp.box.y,
    w: vp.box.w,
    h: vp.box.h,
  };

  /** The subject points that actually have a placement on this view. */
  const placed = useMemo(() => {
    const out: { point: Acupoint; x: number; y: number }[] = [];
    for (const p of points) {
      const pl = p.placements.find((x) => x.view === view);
      if (!pl) continue;
      const c = denorm(pl.x, pl.y);
      out.push({ point: p, x: c.x, y: c.y });
    }
    return out.sort((a, b) => a.point.code.localeCompare(b.point.code));
  }, [points, view]);

  /**
   * Context points: everything else that falls inside the frame.
   *
   * Drawn small and unlabelled. A region lens that hid its neighbours would
   * teach a boundary that does not exist on the body — the learner needs to
   * see what the region sits next to.
   */
  const context = useMemo(() => {
    const subject = new Set(points.map((p) => p.id));
    const out: { point: Acupoint; x: number; y: number }[] = [];
    for (const p of dataset.acupoints) {
      if (subject.has(p.id)) continue;
      const pl = p.placements.find((x) => x.view === view);
      if (!pl) continue;
      const c = denorm(pl.x, pl.y);
      if (c.x >= box.x && c.x <= box.x + box.w && c.y >= box.y && c.y <= box.y + box.h) {
        out.push({ point: p, x: c.x, y: c.y });
      }
    }
    return out;
  }, [points, view, box]);

  /*
   * Whether the point list has more below the fold.
   *
   * Measured rather than assumed: a region with 23 points overflows and one
   * with 7 does not, and telling the learner to scroll a list that does not
   * scroll is worse than saying nothing. `more` also clears once they reach
   * the bottom, so the cue means "there is more", not "this is a list".
   */
  const listRef = useRef<HTMLOListElement>(null);
  const [more, setMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const measureScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
    setScrolled(el.scrollTop > 4);
  }, []);

  useLayoutEffect(() => {
    measureScroll();
    const el = listRef.current;
    /*
     * Two triggers, because neither covers everything. The list's height
     * follows the picture's, so a viewport resize changes it — and `resize`
     * is a plain event that fires anywhere. ResizeObserver additionally
     * catches a height change with no window resize behind it, but it is
     * delivered as part of the rendering steps, so a page that is never
     * painted (a background tab, a headless pane) never sees it.
     */
    window.addEventListener('resize', measureScroll);
    const ro =
      el && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureScroll) : null;
    ro?.observe(el!);
    return () => {
      window.removeEventListener('resize', measureScroll);
      ro?.disconnect();
    };
  }, [measureScroll, placed, lang, box]);

  const meridianIds = [...new Set(placed.map((p) => p.point.meridianId))];
  const label = (p: Acupoint) =>
    lang === 'en' ? p.code : lang === 'zh' ? p.nameZhHant : `${p.nameZhHant} ${p.code}`;

  /**
   * Label slots.
   *
   * A dense cluster — the 井穴 at a fingertip, the 背俞穴 down one paravertebral
   * line — puts several markers within a few units of each other, so their
   * labels would overlap. The whole-body atlas resolves that by DROPPING
   * labels; here nothing may be dropped, since reading every one is the reason
   * this view exists. Each label is pushed into the next free slot instead and
   * joined to its marker by a leader line.
   */
  /*
   * How big labels and markers are drawn, in user units.
   *
   * Tied to the frame's size class so a wide region and a narrow one look
   * alike. The two divisors are in the proportion of the space the lens
   * actually gets on screen (roughly 869 x 720 in the modal's picture column).
   * At 400 and 500 they were not, and the axis that bound the fit decided the
   * text size: landscape frames came out at 10px and portrait ones — the face,
   * abdomen, knee, hip and the whole back — at 6.6px, which is why the back
   * looked like a density problem when every tall region shared it.
   *
   * Only PARTLY tied to the live camera. Pinned to the camera exactly,
   * zooming would merely spread the points apart at a fixed text size, which
   * is not what someone pinching a diagram wants; left alone entirely, a deep
   * zoom would fill the frame with two enormous words. The 0.55 exponent grows
   * everything on screen at roughly the square root of the zoom: 4× in gets
   * text about 1.8× larger.
   */
  const zoomLevel = box.w / camera.w;
  const scale = lensLabelScale(box.w, box.h) / Math.pow(zoomLevel, 0.55);
  const lineH = (lang === 'en' ? 5.6 : 6.3) * scale;
  const placedLabels = useMemo(() => {
    /*
     * Two labels only collide if they share a COLUMN as well as a row. A
     * y-only test made the left hand fight the right one for slots — they are
     * a figure's width apart and can never overlap — which pushed labels far
     * from their markers and piled them up where the crowding was real.
     */
    const colW = 52 * scale;
    const taken: { x: number; ly: number }[] = [];
    return [...placed]
      .sort((a, b) => a.y - b.y)
      .map(({ point, x, y }) => {
        let ly = y;
        while (taken.some((v) => Math.abs(v.x - x) < colW && Math.abs(v.ly - ly) < lineH)) {
          ly += lineH;
        }
        taken.push({ x, ly });
        return { id: point.id, x, y, ly };
      });
  }, [placed, lineH, scale]);
  const slotOf = new Map(placedLabels.map((l) => [l.id, l]));

  return (
    <div
      className="modal-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={t(`${titleZhHant}細部圖`, `${titleEn} detail view`)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card extremity-detail">
        <div className="modal-head">
          <div>
            <h2>{t(`${titleZhHant}　細部`, `${titleEn} — detail`)}</h2>
            <p className="secondary">
              {t(
                `此區共 ${placed.length} 個已載入穴位。`,
                `${placed.length} loaded points in this region.`,
              )}
            </p>
          </div>
          <div className="lens-actions">
            {children}
            <button ref={closeRef} type="button" className="icon-btn" onClick={onClose}>
              {t('關閉', 'Close')} ✕
            </button>
          </div>
        </div>

        {/* A frame much wider than it is tall would letterbox to a strip in a
            half-width column, so it takes the full width instead. */}
        <div className={box.w / box.h > 1.5 ? 'extremity-body lens-wide' : 'extremity-body'}>
          <div className="lens-canvas">
            <svg
              ref={vp.svgRef}
              viewBox={`${camera.x} ${camera.y} ${camera.w} ${camera.h}`}
              preserveAspectRatio="xMidYMid meet"
              className="extremity-svg"
              style={{ aspectRatio: `${box.w} / ${box.h}`, touchAction: 'none' }}
              role="img"
              tabIndex={0}
              aria-label={t(
                '放大的局部示意圖。方向鍵平移，加減號縮放，0 回到本區全景。',
                'Magnified schematic of the region. Arrow keys pan, plus and minus zoom, 0 returns to the whole region.',
              )}
              {...vp.handlers}
            >
            <g aria-hidden="true">
              {figureShapes[view].map((s, i) => {
                if (s.kind === 'circle') {
                  return (
                    <circle
                      key={i}
                      cx={s.cx}
                      cy={s.cy}
                      r={s.r}
                      fill="var(--figure-fill)"
                      stroke="var(--figure-line)"
                      strokeWidth={0.5 * scale}
                    />
                  );
                }
                if (s.kind === 'stroke') {
                  return (
                    <path
                      key={i}
                      d={s.d}
                      fill="none"
                      stroke="var(--figure-detail)"
                      strokeWidth={(s.strokeWidth ?? 2) * 0.35 * scale}
                      strokeLinecap="round"
                    />
                  );
                }
                return (
                  <path
                    key={i}
                    d={s.d}
                    fill="var(--figure-fill)"
                    stroke="var(--figure-line)"
                    strokeWidth={0.5 * scale}
                  />
                );
              })}
            </g>

            {/* Route segments, drawn in the same palette and dash vocabulary. */}
            <g aria-hidden="true">
              {meridianIds.map((id) => {
                const m = meridianById.get(id);
                if (!m) return null;
                return m.atlasPaths
                  .filter((p) => p.view === view)
                  .map((p, i) => (
                    <path
                      key={`${id}-${i}`}
                      d={p.d}
                      fill="none"
                      stroke={m.colorToken}
                      strokeWidth={1.1 * scale}
                      strokeOpacity={0.75}
                      strokeLinecap="round"
                      strokeDasharray={DASH[m.lineStyle]}
                    />
                  ));
              })}
            </g>

            <g aria-hidden="true" className="lens-context">
              {context.map(({ point, x, y }) => (
                <circle
                  key={point.id}
                  cx={x}
                  cy={y}
                  r={1.4 * scale}
                  fill="var(--text-faint)"
                  opacity={0.5}
                />
              ))}
            </g>

            {placed.map(({ point, x, y }) => {
              const m = meridianById.get(point.meridianId);
              const active = focus.kind === 'point' && focus.pointId === point.id;
              const slot = slotOf.get(point.id);
              /*
               * Which side of its marker the label sits on.
               *
               * Labels used to always go right, so the frame had to carry a
               * wide empty gutter on that side and the anatomy sat off-centre.
               * One that would run past the right edge now flips to the left
               * instead — the text stays inside the picture, and the picture
               * can be centred on the body part.
               */
              const fontSize = (lang === 'en' ? 4.6 : 5.2) * scale;
              const estWidth = label(point).length * fontSize * 0.62;
              const ly = slot?.ly ?? y;
              const overflows = x + 7 * scale + estWidth > camera.x + camera.w;
              // …or would be written straight over a neighbouring marker. The
              // midline is three parallel columns about 10 units apart, so the
              // 任脈 labels were being covered by the 腎經 markers beside them.
              const collides = placed.some(
                (o) =>
                  o.point.id !== point.id &&
                  o.x > x + 2 * scale &&
                  o.x < x + 7 * scale + estWidth &&
                  Math.abs(o.y - ly) < fontSize,
              );
              const flip = overflows || collides;
              const dir = flip ? -1 : 1;
              return (
                <g
                  key={point.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${point.nameZhHant} ${point.code}`}
                  aria-pressed={active}
                  className={active ? 'marker marker-hit active' : 'marker marker-hit'}
                  onClick={() => setFocus({ kind: 'point', pointId: point.id })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFocus({ kind: 'point', pointId: point.id });
                    }
                  }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={(active ? 3.4 : 2.6) * scale}
                    fill="var(--bg-elev)"
                    stroke={m?.colorToken ?? 'var(--text)'}
                    strokeWidth={1.6 * scale}
                  />
                  {slot && Math.abs(slot.ly - y) > 0.6 * scale && (
                    <path
                      d={`M${x + dir * 3 * scale},${y} L${x + dir * 6.5 * scale},${slot.ly}`}
                      stroke="var(--text-faint)"
                      strokeWidth={0.4 * scale}
                      fill="none"
                    />
                  )}
                  <text
                    className="marker-label"
                    x={x + dir * 7 * scale}
                    y={(slot?.ly ?? y) + 1.6 * scale}
                    textAnchor={flip ? 'end' : 'start'}
                    fontSize={fontSize}
                    fill="var(--text)"
                    stroke="var(--bg)"
                    strokeWidth={1.1 * scale}
                    paintOrder="stroke"
                  >
                    {label(point)}
                  </text>
                </g>
              );
            })}
            </svg>

            {/*
              * Persistent, not a hover affordance: on a touch screen there is
              * no hover, and the learner needs to know the frame magnifies
              * before they think to try pinching it.
              */}
            <div className="lens-zoom" role="group" aria-label={t('縮放', 'Zoom')}>
              <button
                type="button"
                className="icon-btn"
                onClick={() => vp.zoomBy(1.4)}
                aria-label={t('放大', 'Zoom in')}
              >
                ＋
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => vp.zoomBy(1 / 1.4)}
                aria-label={t('縮小', 'Zoom out')}
              >
                －
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => vp.fitAll()}
                aria-label={t('回到本區全景', 'Fit the whole region')}
              >
                {t('全區', 'Fit')}
              </button>
            </div>
          </div>

          <div
            className="extremity-listwrap"
            data-more={more ? 'true' : undefined}
            data-scrolled={scrolled ? 'true' : undefined}
          >
            <ol className="extremity-list" ref={listRef} onScroll={measureScroll}>
              {placed.map(({ point }) => {
                const m = meridianById.get(point.meridianId);
                const active = focus.kind === 'point' && focus.pointId === point.id;
                return (
                  <li key={point.id}>
                    <button
                      type="button"
                      className={active ? 'row active' : 'row'}
                      onClick={() => setFocus({ kind: 'point', pointId: point.id })}
                    >
                      <span className="chip code" style={{ borderColor: m?.colorToken }}>
                        {point.code}
                      </span>
                      <span className="grow">
                        <span className="primary">{t(point.nameZhHant, point.nameEn ?? '')}</span>
                        <span className="secondary">
                          {t(
                            acupointById.get(point.id)?.location?.value.zhHant ?? '',
                            acupointById.get(point.id)?.location?.value.en ?? '',
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {/* Only claimed when the list really does overflow — measured, not assumed. */}
            {more && (
              <p className="list-more" aria-hidden="true">
                {t('繼續捲動看其餘穴位', 'Scroll for the rest')}
              </p>
            )}
          </div>
        </div>

        <p className="extremity-note secondary">
          {t(
            '放大檢視只是換一個鏡頭：圖形與座標與主圖完全相同，仍為示意圖，非解剖定位依據。',
            'The detail view is only a different camera — identical geometry and coordinates to the main figure. Still schematic, not an anatomical locator.',
          )}
        </p>
      </div>
    </div>
  );
}
