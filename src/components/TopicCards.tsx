import { useState } from 'react';
import { dataset, meridianById } from '../data';
import { ATLAS_HEIGHT, ATLAS_WIDTH, MERIDIAN_DASH, denorm, figureShapes, type FigureShape } from '../data/atlas';
import type { BodyViewId } from '../data/types';
import { expandFunction } from '../search';
import { useBilingual, useStore } from '../state/store';

/**
 * Topic cards — a two-column reading layout for the teaching associations.
 *
 * LEFT: the mapping as plain text, one line per link (「頭面部 → 合谷 LI4」).
 * RIGHT: a minimalist avatar — the same figure silhouette with the face and
 * joint detail stripped out — carrying floating annotation boxes on the points
 * the topic names.
 *
 * The avatar reuses `figureShapes`, filtered to the filled body outline only,
 * so it can never disagree with the atlas. Nothing here is treatment guidance:
 * every card carries its record's own educational framing and review status,
 * and the topics themselves are mnemonic groupings from the curriculum.
 */

/** The silhouette alone: filled body paths, no face, no joint creases. */
const AVATAR_SHAPES: Record<BodyViewId, FigureShape[]> = {
  front: figureShapes.front.filter((s) => s.kind === 'path'),
  back: figureShapes.back.filter((s) => s.kind === 'path'),
};

/**
 * Which side of the body a topic is mostly about.
 *
 * The avatar used to be front-only, which quietly dropped anything on the back:
 * 「腰背委中求」 names 委中 BL40 in the popliteal crease, so that card drew an
 * empty body. Pick the view holding the topic's own records — its points first,
 * and if it names no points at all, the side carrying more of its routes.
 */
function avatarView(ex: NonNullable<ReturnType<typeof expandFunction>>): BodyViewId {
  const tally: Record<BodyViewId, number> = { front: 0, back: 0 };
  for (const p of ex.acupoints) {
    const v = p.placements[0]?.view;
    if (v) tally[v] += 1;
  }
  if (tally.front === 0 && tally.back === 0) {
    for (const m of ex.meridians) {
      for (const path of m.atlasPaths) tally[path.view] += 1;
    }
  }
  return tally.back > tally.front ? 'back' : 'front';
}

export default function TopicCards() {
  const t = useBilingual();
  const { setFocus, lang } = useStore();
  const [openId, setOpenId] = useState<string | null>(
    dataset.traditionalFunctions[0]?.id ?? null,
  );

  return (
    <div className="topic-cards stack">
      {dataset.traditionalFunctions.map((fn) => {
        const ex = expandFunction(fn.id);
        if (!ex) return null;
        const open = openId === fn.id;
        const view = avatarView(ex);
        const marks = ex.acupoints
          .map((p) => {
            const pl = p.placements.find((x) => x.view === view);
            if (!pl) return null;
            const c = denorm(pl.x, pl.y);
            return { point: p, ...c };
          })
          .filter((v): v is NonNullable<typeof v> => Boolean(v));
        // The route is the reason the pairing exists — 「面口合谷收」 only makes
        // sense once you can see the Large Intestine channel run from the hand
        // up to the face. Drawn under the annotations, thin and quiet, so the
        // named points stay the loudest thing on the avatar.
        const routes = ex.meridians.flatMap((m) =>
          m.atlasPaths.filter((p) => p.view === view).map((p, i) => ({ m, d: p.d, key: `${m.id}-${i}` })),
        );
        // One avatar shows one side, so a topic spanning both cannot be drawn
        // whole. Name what is missing rather than showing a partial figure as
        // if it were complete: 「四總穴」 names four points and only three are
        // on the front, and the Bladder's route is mostly on the back.
        const hiddenPoints = ex.acupoints.length - marks.length;
        const routeElsewhere = ex.meridians.some((m) =>
          m.atlasPaths.some((p) => p.view !== view),
        );

        return (
          <section key={fn.id} className="panel topic-card">
            <button
              type="button"
              className="topic-head"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : fn.id)}
            >
              <h3>{t(fn.labelZhHant, fn.labelEn)}</h3>
              <span className="secondary">
                {t(
                  `${ex.acupoints.length} 穴・${ex.meridians.length} 經`,
                  `${ex.acupoints.length} points · ${ex.meridians.length} meridians`,
                )}
              </span>
              <span aria-hidden="true" className="topic-chevron">
                {open ? '−' : '+'}
              </span>
            </button>

            {open && (
              <div className="topic-body">
                <div className="topic-text stack">
                  <p>{t(fn.description.value.zhHant, fn.description.value.en)}</p>

                  <ul className="mapping-list">
                    {ex.acupoints.map((p) => (
                      <li key={p.id}>
                        <button type="button" onClick={() => setFocus({ kind: 'point', pointId: p.id })}>
                          <span className="from">{t(fn.labelZhHant, fn.labelEn)}</span>
                          <span aria-hidden="true" className="arrow">
                            →
                          </span>
                          <span className="to">
                            {lang === 'en' ? p.nameEn : p.nameZhHant} <em>{p.code}</em>
                          </span>
                        </button>
                      </li>
                    ))}
                    {ex.meridians.map((m) => (
                      <li key={m.id}>
                        <button
                          type="button"
                          onClick={() => setFocus({ kind: 'meridian', meridianId: m.id })}
                        >
                          <span className="from">{t(fn.labelZhHant, fn.labelEn)}</span>
                          <span aria-hidden="true" className="arrow">
                            →
                          </span>
                          <span className="to" style={{ color: m.colorToken }}>
                            {t(m.nameZhHant, m.nameEn)} <em>{m.code}</em>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <p className="framing secondary">
                    {t(fn.educationalFraming.zhHant, fn.educationalFraming.en)}
                  </p>
                </div>

                <figure className="topic-avatar">
                  <svg
                    viewBox={`0 0 ${ATLAS_WIDTH} ${ATLAS_HEIGHT}`}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label={t(
                      `簡化人形（${view === 'back' ? '背面' : '正面'}），標示「${fn.labelZhHant}」相關的 ${marks.length} 個穴位與 ${routes.length ? ex.meridians.length : 0} 條經絡路線。`,
                      `Minimal avatar, ${view} view, annotating the ${marks.length} points this topic names and tracing ${routes.length ? ex.meridians.length : 0} related meridian routes.`,
                    )}
                  >
                    <g aria-hidden="true">
                      {AVATAR_SHAPES[view].map((s, i) => (
                        <path
                          key={i}
                          d={s.d}
                          fill="var(--figure-fill)"
                          stroke="var(--figure-line)"
                          strokeWidth={2}
                        />
                      ))}
                    </g>
                    <g aria-hidden="true" className="topic-routes">
                      {routes.map(({ m, d, key }) => (
                        <path
                          key={key}
                          d={d}
                          fill="none"
                          stroke={m.colorToken}
                          strokeWidth={4}
                          strokeDasharray={MERIDIAN_DASH[m.lineStyle]}
                          strokeLinecap="round"
                        />
                      ))}
                    </g>
                    {marks.map(({ point, x, y }) => {
                      const m = meridianById.get(point.meridianId);
                      // Annotation boxes float to whichever side has room.
                      const right = x < ATLAS_WIDTH / 2;
                      const bw = 148;
                      const bx = right ? x + 20 : x - 20 - bw;
                      return (
                        <g key={point.id} className="annotation">
                          <path
                            d={`M${x},${y} L${right ? x + 20 : x - 20},${y}`}
                            stroke={m?.colorToken ?? 'var(--text)'}
                            strokeWidth={3}
                            fill="none"
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r={8}
                            fill="var(--bg-elev)"
                            stroke={m?.colorToken ?? 'var(--text)'}
                            strokeWidth={4}
                          />
                          <rect
                            x={bx}
                            y={y - 20}
                            width={bw}
                            height={40}
                            rx={9}
                            fill="var(--bg-elev)"
                            stroke={m?.colorToken ?? 'var(--line)'}
                            strokeWidth={2}
                          />
                          <text x={bx + 12} y={y + 8} fontSize={25} fill="var(--text)">
                            {lang === 'en' ? point.code : `${point.nameZhHant} ${point.code}`}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <figcaption className="secondary">
                    {t(
                      `簡化示意人形（${view === 'back' ? '背面' : '正面'}），僅供定位參考。`,
                      `Minimal schematic avatar, ${view} view, for orientation only.`,
                    )}
                    {hiddenPoints > 0 &&
                      t(
                        `另有 ${hiddenPoints} 個穴位在身體另一面，此圖未顯示。`,
                        ` ${hiddenPoints} of the points named here sit on the other side of the body and are not drawn.`,
                      )}
                    {routeElsewhere &&
                      t(
                        '經絡另有一段走在另一面，圖上未顯示。',
                        ' Part of the route runs on the other side and is not drawn either.',
                      )}
                  </figcaption>
                </figure>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
