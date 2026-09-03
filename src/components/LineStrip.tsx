import { useEffect, useMemo, useRef, useState } from 'react';
import { acupointById, dataset, meridianById } from '../data';
import { MERIDIAN_DASH } from '../data/atlas';
import { REGULAR_CHANNELS } from '../data/specific-points';
import type { Meridian } from '../data/types';
import { useBilingual, useStore } from '../state/store';
import LineSwatch from './LineSwatch';

/**
 * Line strip — one channel, straightened.
 *
 * The overview map has to place fourteen tangled routes on one canvas, and at
 * fit-to-screen that means 374 labels about four pixels tall. This view answers
 * the question the overview is actually asked most — "what is the ORDER of the
 * points on this channel, and what comes next" — by giving a single line the
 * whole width and a fixed pitch per station, so every label is legible at every
 * zoom because there is no zoom.
 *
 * Read-only over the same records the map and atlas use: a station resolves to
 * a real acupoint and hands off to the atlas exactly as the map's stations do.
 */

/** A channel's short name: 「肺經」 / "Lung". Full names overflow a chip. */
const shortName = (m: Meridian, lang: string) =>
  lang === 'en'
    ? m.nameEn.replace(/\s*meridian.*$/i, '').replace(/\s*vessel.*$/i, '')
    : m.nameZhHant.replace(/^(手|足)(太陰|少陰|厥陰|陽明|太陽|少陽)/, '');

/** Horizontal distance between stations. Labels alternate, so each gets 2×. */
const PITCH = 62;
const PAD_X = 46;
const RAIL_Y = 96;
const HEIGHT = 196;

/**
 * Where this channel sits in the flow cycle. The twelve hand over in a closed
 * loop; the two midline vessels stand outside it and get no neighbours.
 */
function flowNeighbours(meridianId: string): { prev: Meridian | null; next: Meridian | null } {
  const i = REGULAR_CHANNELS.findIndex((m) => m.id === meridianId);
  if (i < 0) return { prev: null, next: null };
  const n = REGULAR_CHANNELS.length;
  return {
    prev: REGULAR_CHANNELS[(i - 1 + n) % n]!,
    next: REGULAR_CHANNELS[(i + 1) % n]!,
  };
}

export default function LineStrip() {
  const t = useBilingual();
  const { focus, setFocus, setRoute, lang } = useStore();
  const scroller = useRef<HTMLDivElement | null>(null);

  const [meridianId, setMeridianId] = useState<string>(() =>
    focus.kind === 'meridian' ? focus.meridianId : 'mer_lu',
  );

  /**
   * Picking a channel HERE publishes it as the shared focus, which is what the
   * context map beside this strip highlights. Selecting it only locally left
   * the split half-wired: the map moved the strip, but the strip never moved
   * the map. Done on explicit choice only — the effect below must not write
   * back, or a focused POINT would be overwritten by its own channel.
   */
  const selectChannel = (id: string) => {
    setMeridianId(id);
    setFocus({ kind: 'meridian', meridianId: id });
  };

  // Follow a focus that arrives from elsewhere — search, the Flow tab, a lesson.
  useEffect(() => {
    if (focus.kind === 'meridian') setMeridianId(focus.meridianId);
    if (focus.kind === 'point') {
      const p = acupointById.get(focus.pointId);
      if (p) setMeridianId(p.meridianId);
    }
  }, [focus]);

  const m = meridianById.get(meridianId)!;
  const line = useMemo(
    () => dataset.networkLines.find((l) => l.meridianId === meridianId),
    [meridianId],
  );

  const stations = useMemo(
    () =>
      (line?.stations ?? [])
        .map((s) => acupointById.get(s.acupointId))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [line],
  );

  const { prev, next } = flowNeighbours(meridianId);
  const width = PAD_X * 2 + Math.max(0, stations.length - 1) * PITCH;

  const focusedId = focus.kind === 'point' ? focus.pointId : null;

  // Bring the focused station into view rather than leaving it off-screen.
  useEffect(() => {
    if (!focusedId || !scroller.current) return;
    const i = stations.findIndex((p) => p.id === focusedId);
    if (i < 0) return;
    const el = scroller.current;
    const left = Math.max(0, PAD_X + i * PITCH - el.clientWidth / 2);
    // `scrollTo` with options is not universal — jsdom has no scrollTo at all,
    // and older engines ignore the options form. Assigning scrollLeft always
    // works, so it is the fallback rather than an error.
    if (typeof el.scrollTo === 'function') el.scrollTo({ left, behavior: 'smooth' });
    else el.scrollLeft = left;
  }, [focusedId, stations]);

  return (
    <div className="strip stack">
      <div className="strip-picker" role="tablist" aria-label={t('選擇經絡', 'Choose a channel')}>
        {dataset.meridians.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={x.id === meridianId}
            className={x.id === meridianId ? 'strip-chip active' : 'strip-chip'}
            onClick={() => selectChannel(x.id)}
            style={x.id === meridianId ? { borderColor: x.colorToken } : undefined}
          >
            <LineSwatch meridian={x} width={16} />
            <span>{lang === 'en' ? x.code : shortName(x, lang)}</span>
          </button>
        ))}
      </div>

      <header className="strip-head">
        <h3 style={{ color: m.colorToken }}>
          {lang === 'en' ? `${m.code} · ${m.nameEn}` : `${m.code} · ${m.nameZhHant}`}
        </h3>
        <span className="secondary">
          {t(`${stations.length} 穴`, `${stations.length} points`)}
        </span>
      </header>

      {/* The channel that hands over to this one, and the one it hands on to. */}
      <div className="strip-flow">
        {prev ? (
          <button type="button" className="strip-neighbour" onClick={() => selectChannel(prev.id)}>
            ← <span style={{ color: prev.colorToken }}>{prev.code}</span> {shortName(prev, lang)}
          </button>
        ) : (
          <span className="secondary strip-nooneighbour">
            {t('奇經，不在流注環上', 'Extraordinary vessel — outside the flow cycle')}
          </span>
        )}
        {next && (
          <button type="button" className="strip-neighbour" onClick={() => selectChannel(next.id)}>
            <span style={{ color: next.colorToken }}>{next.code}</span> {shortName(next, lang)} →
          </button>
        )}
      </div>

      <div className="strip-scroll" ref={scroller}>
        <svg
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          role="img"
          aria-label={t(
            `${m.nameZhHant}的 ${stations.length} 個穴位，依循行順序排列。`,
            `${stations.length} points of the ${m.nameEn}, in route order.`,
          )}
        >
          <line
            x1={PAD_X}
            y1={RAIL_Y}
            x2={width - PAD_X}
            y2={RAIL_Y}
            stroke={m.colorToken}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={MERIDIAN_DASH[m.lineStyle]}
          />

          {stations.map((p, i) => {
            const x = PAD_X + i * PITCH;
            const above = i % 2 === 0;
            const terminus = i === 0 || i === stations.length - 1;
            const active = p.id === focusedId;
            return (
              <g key={p.id} className={active ? 'strip-station active' : 'strip-station'}>
                <line
                  x1={x}
                  y1={RAIL_Y}
                  x2={x}
                  y2={above ? RAIL_Y - 16 : RAIL_Y + 16}
                  stroke={m.colorToken}
                  strokeWidth={1.5}
                  opacity={0.5}
                />
                <text
                  className="strip-code"
                  x={x}
                  y={above ? RAIL_Y - 38 : RAIL_Y + 50}
                  textAnchor="middle"
                >
                  {p.code}
                </text>
                <text
                  className="strip-name"
                  x={x}
                  y={above ? RAIL_Y - 24 : RAIL_Y + 64}
                  textAnchor="middle"
                >
                  {lang === 'en' ? p.nameEn : p.nameZhHant}
                </text>
                <circle
                  cx={x}
                  cy={RAIL_Y}
                  r={terminus ? 9 : 6.5}
                  fill={terminus ? m.colorToken : 'var(--bg-elev)'}
                  stroke={m.colorToken}
                  strokeWidth={3}
                />
                {/* The hit target is deliberately larger than the dot. */}
                <circle
                  className="strip-hit"
                  cx={x}
                  cy={RAIL_Y}
                  r={22}
                  fill="transparent"
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.code} ${lang === 'en' ? (p.nameEn ?? '') : p.nameZhHant}`}
                  onClick={() => setFocus({ kind: 'point', pointId: p.id })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFocus({ kind: 'point', pointId: p.id });
                    }
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/*
        The handoff to the atlas is the main thing anyone wants from this strip
        once they have read the order, but it was set as an underlined phrase at
        the tail of a sentence — the least prominent thing on the panel. It is a
        button now, on its own line, carrying the channel's own line style the
        way the picker chips above and the Learn page's channel buttons do.
      */}
      <div className="strip-foot">
        <p className="secondary strip-note">
          {t(
            '同一份資料，換一種讀法：站點順序即循行順序，點任一站可在人體圖上定位。',
            'The same records read a different way: station order is route order. Tap any station to locate it on the figure.',
          )}
        </p>
        <button
          type="button"
          className="btn small strip-toatlas"
          style={{ borderColor: m.colorToken }}
          onClick={() => {
            setFocus({ kind: 'meridian', meridianId });
            setRoute('atlas');
          }}
        >
          <LineSwatch meridian={m} width={18} />
          {t('在人體圖上看整條經', 'See the whole channel on the atlas')}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
