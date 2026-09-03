import { useMemo, useRef, useState } from 'react';
import { dataset } from '../data';
import { ATLAS_HEIGHT, ATLAS_WIDTH, MERIDIAN_DASH, denorm, figureShapes } from '../data/atlas';
import type { BodyViewId, Meridian } from '../data/types';
import { useBilingual } from '../state/store';

/**
 * The Flow view's figure: one channel lit on BOTH sides, everything else faded.
 *
 * Bilateral by mirroring, not by new coordinates. The atlas draws each paired
 * channel on ONE side — deliberately alternating, so neighbouring channels do
 * not overlap — and the drawn figure is exactly symmetric about the midline
 * (verified: mirroring the limb anchors is accurate to 0.0000px). So the twin
 * is the canonical geometry under `translate(W,0) scale(-1,1)`, and the marker
 * x becomes W − x. No second coordinate set exists to drift out of step with
 * the landmark audit, which is the point.
 *
 * 任脈 and 督脈 have a single midline set and are drawn once — mirroring them
 * would double every marker on top of itself.
 *
 * This is a read-only display of the meridian data. It does not touch the
 * atlas's camera, its layer toggles or the shared focus, so nothing here can
 * disturb the Atlas or Network views.
 */

interface Props {
  active: Meridian;
  /** Horizontal swipe steps the clock; vertical is left alone for scrolling. */
  onSwipe: (by: number) => void;
}

/**
 * Both body views, side by side.
 *
 * A channel is one continuous route that crosses between the two faces — the
 * Bladder runs down the back and finishes at the little toe, 三焦 puts a single
 * station on the back — so showing one face at a time hides part of whatever is
 * lit and forces a toggle just to find it. Here the pair is the unit: whichever
 * hour is showing, the whole channel is on screen.
 */
const VIEWS: BodyViewId[] = ['front', 'back'];

/*
 * The drawn width, cropped to the ink.
 *
 * The atlas viewBox is 400 wide because the ATLAS lets you pan and zoom into
 * that space. Here the figure is fixed, and the outermost thing ever drawn is a
 * marker at x≈37.7 (or its mirror at 362.3) plus the 5.5-unit glow — so ink
 * spans roughly 32–368 and about 32 units at each edge are always empty. That
 * emptiness is what made the frame look far wider than the body inside it.
 *
 * Cropping the box does NOT resize the figure: these panels are height-bound,
 * so the scale stays viewBoxHeight → panel height either way. Only the canvas
 * around the body gets tighter.
 */
export const CROP_X = 28;
export const CROP_W = 344;
/** Glow radius at full breath — the marker's real reach beyond its centre. */
export const NODE_REACH = 5.5;

/** Below this the gesture is a tap or a scroll, not a swipe. */
const SWIPE_PX = 30;

/** One body view: silhouette, faded network, then the lit channel on both sides. */
function BodyPanel({ active, view }: { active: Meridian; view: BodyViewId }) {
  const t = useBilingual();
  const isMidline = active.id === 'mer_cv' || active.id === 'mer_gv';

  const routes = useMemo(
    () => active.atlasPaths.filter((p) => p.view === view),
    [active, view],
  );

  const points = useMemo(
    () =>
      dataset.acupoints
        .filter((p) => p.meridianId === active.id)
        .map((p) => {
          const pl = p.placements.find((x) => x.view === view);
          if (!pl) return null;
          return { point: p, ...denorm(pl.x, pl.y) };
        })
        .filter((v): v is NonNullable<typeof v> => Boolean(v)),
    [active, view],
  );

  /** Every other channel, drawn faint so the body still reads as a network. */
  const others = useMemo(
    () =>
      dataset.meridians
        .filter((m) => m.id !== active.id)
        .flatMap((m) =>
          m.atlasPaths
            .filter((p) => p.view === view)
            .map((p, i) => ({ m, d: p.d, k: `${m.id}${i}` })),
        ),
    [active, view],
  );

  const Channel = ({ mirrored }: { mirrored: boolean }) => (
    <g transform={mirrored ? `translate(${ATLAS_WIDTH},0) scale(-1,1)` : undefined}>
      {routes.map((p, i) => (
        <path
          key={i}
          className="flow-line"
          d={p.d}
          fill="none"
          stroke={active.colorToken}
          strokeWidth={3.4}
          strokeLinecap="round"
          /* The flow dash is the animation's own vocabulary. The channel's
             identifying dash pattern still appears on the faded lines and in
             the panel swatch, so the pattern is never the only cue lost. */
          strokeDasharray="8 6"
        />
      ))}
      {points.map(({ point, x, y }) => (
        <g key={point.id} className="flow-node" transform={`translate(${x},${y})`}>
          {/* Animating a transform rather than the SVG `r` attribute: CSS `r`
              is unreliable in Safari, and a CSS declaration would silently beat
              the attribute anyway. Scale also stays on the compositor. */}
          <circle className="flow-node-glow" r={5.5} fill={active.colorToken} />
          <circle r={2.6} fill={active.colorToken} stroke="var(--bg)" strokeWidth={0.8} />
        </g>
      ))}
    </g>
  );

  return (
    <figure
      className="flow-panel"
      data-view={view}
      /*
       * The crop's aspect ratio, handed to CSS. An <svg> with no width/height
       * attributes reports the spec default of 300×150 as its intrinsic size,
       * and that default — not the drawing — is what the flex layout measured,
       * leaving the panel wider than the figure and padding the gap between the
       * two faces. Declaring the real ratio makes the box hug the drawing.
       */
      style={{ ['--panel-aspect' as string]: `${CROP_W} / ${ATLAS_HEIGHT}` }}
    >
      <svg
        viewBox={`${CROP_X} 0 ${CROP_W} ${ATLAS_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={t(
          `${active.nameZhHant}（${view === 'back' ? '背面' : '正面'}），左右兩側同時顯示，共 ${points.length * (isMidline ? 1 : 2)} 個標記。`,
          `${active.nameEn}, ${view} view, shown on both sides — ${points.length * (isMidline ? 1 : 2)} markers.`,
        )}
      >
        <g aria-hidden="true">
          {figureShapes[view]
            .filter((s) => s.kind === 'path')
            .map((s, i) => (
              <path
                key={i}
                d={s.d}
                fill="var(--figure-fill)"
                stroke="var(--figure-line)"
                strokeWidth={2}
              />
            ))}
        </g>

        {/* The rest of the network, faded. The silhouette keeps full opacity. */}
        <g aria-hidden="true" className="flow-inactive">
          {others.map(({ m, d, k }) => (
            <path
              key={k}
              d={d}
              fill="none"
              stroke={m.colorToken}
              strokeWidth={2}
              strokeDasharray={MERIDIAN_DASH[m.lineStyle]}
            />
          ))}
        </g>

        <g aria-hidden="true" className="flow-active">
          <Channel mirrored={false} />
          {!isMidline && <Channel mirrored />}
        </g>
      </svg>
      <figcaption>
        {t(view === 'front' ? '正面' : '背面', view === 'front' ? 'Front' : 'Back')}
        {/* Several channels lie entirely on one face. Saying so beats showing
            an apparently blank body and leaving the learner to wonder. */}
        {routes.length === 0 && points.length === 0 && (
          /* The separator is CSS, not a leading space: `t` trims both ends, so
             a space written here disappears and the words run together. */
          <span className="flow-panel-empty">
            {t('此面無此經', 'not on this side')}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export default function FlowFigure({ active, onSwipe }: Props) {
  const t = useBilingual();
  const start = useRef<{ x: number; y: number } | null>(null);
  const [pressed, setPressed] = useState(false);
  const isMidline = active.id === 'mer_cv' || active.id === 'mer_gv';

  return (
    <div
      className={pressed ? 'flow-figure pressed' : 'flow-figure'}
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY };
        setPressed(true);
      }}
      onPointerUp={(e) => {
        setPressed(false);
        const s = start.current;
        start.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        // A pointer event without usable coordinates is not a swipe. Without
        // this the comparisons below are all NaN, every guard reads false, and
        // the gesture falls through to a backward step.
        if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
        // Horizontal intent only: a mostly-vertical drag is the page scrolling,
        // and must not also change the hour.
        if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;
        // Swipe left = forward in time, per the brief.
        onSwipe(dx < 0 ? 1 : -1);
      }}
      onPointerCancel={() => {
        setPressed(false);
        start.current = null;
      }}
    >
      <div className="flow-panels">
        {VIEWS.map((v) => (
          <BodyPanel key={v} active={active} view={v} />
        ))}
      </div>

      <p className="secondary flow-figure-note">
        {isMidline
          ? t(
              '任督二脈走正中線，左右不分，故只畫一次。正背面並列。',
              'The midline vessels have no left and right, so they are drawn once. Front and back shown together.',
            )
          : t(
              '正背面並列，左右兩側同時顯示——經絡是成對的。',
              'Front and back together, each with the channel on both sides: the paired channels run left and right.',
            )}
      </p>
    </div>
  );
}
