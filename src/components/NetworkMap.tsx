import { useEffect, useMemo, useRef, useState } from 'react';
import { acupointById, dataset, meridianById } from '../data';
import { NETWORK_HEIGHT, NETWORK_WIDTH } from '../data/network';
import { expandFunction } from '../search';
import { muShuPair } from '../data/specific-points';
import { meridianLegendName } from '../data/types';
import { useBilingual, useStore } from '../state/store';
import LegendPanel from './LegendPanel';
import { EXTRAORDINARY_VESSELS } from '../data/extraordinary';
import { networkPathFor } from '../data/extraordinary-routes';
import LineSwatch from './LineSwatch';
import { boundsOf, useViewport } from './useViewport';

/**
 * Energy-network diagram — the curriculum's transport model, not anatomy.
 *
 * Lines and stations are read straight from the same records the atlas uses,
 * so a station always resolves to a real acupoint and can jump to the centred
 * atlas view. Layout lives in `data/network.ts` and can be redrawn without
 * touching a single content record.
 */
/**
 * Draw a transfer connector from the last station of the first line to the
 * first station of the second, via the interchange marker. Derived from the
 * station layout so the diagram can be re-laid-out without editing this file.
 */
/** Dash patterns per line style; the atlas uses a finer-scaled equivalent. */
const DASH_NETWORK: Record<string, string | undefined> = {
  solid: undefined,
  dashed: '22 12',
  dotted: '2 13',
  dashdot: '20 9 3 9',
  longdash: '32 14',
  shortdash: '11 9',
  dashdotdot: '22 8 3 8 3 8',
  longdashdot: '34 10 4 10',
  finedash: '6 12',
  doubledash: '24 8 8 8',
  longdashdotdot: '30 9 3 9 3 9',
  sparsedot: '2 16',
  railroad: '4 6 18 6',
  longsolid: '52 10',
};

function connectorPath(meridianIds: string[], via: { x: number; y: number }): string {
  const endpointOf = (meridianId: string, which: 'last' | 'first') => {
    const line = dataset.networkLines.find((l) => l.meridianId === meridianId);
    if (!line || line.stations.length === 0) return null;
    return which === 'last' ? line.stations[line.stations.length - 1]! : line.stations[0]!;
  };
  const from = meridianIds[0] ? endpointOf(meridianIds[0], 'last') : null;
  const to = meridianIds[1] ? endpointOf(meridianIds[1], 'first') : null;
  if (!from || !to) return '';
  return `M${from.x},${from.y} L${via.x},${via.y} L${to.x},${to.y}`;
}

/**
 * How the map is being used.
 *
 * `primary` is the full view: legend, zoom toolbar, and a camera that follows
 * the focus. `context` is the map serving as the CONTEXT half of a split — it
 * keeps the whole network in frame and only changes its highlighting, because a
 * context panel that zooms away from the overview stops being context. It also
 * drops the legend, which is 579px tall and would swamp a narrow column.
 */
export interface NetworkMapProps {
  role?: 'primary' | 'context';
}

export default function NetworkMap({ role = 'primary' }: NetworkMapProps = {}) {
  const { focus, setFocus, setRoute, lang } = useStore();
  const t = useBilingual();
  const vp = useViewport(NETWORK_WIDTH, NETWORK_HEIGHT, 0.9, 10);
  const lastFocus = useRef('');
  /** Draw the six point-less vessels as a standing overlay, as on the atlas. */
  const [showVessels, setShowVessels] = useState(false);

  /**
   * Which vessels to draw. A selected one wins; otherwise the toggle decides.
   * 督脈 and 任脈 are filtered out at the draw site rather than here, so a
   * learner selecting one of them still gets its stations lit and its own line
   * emphasised — it just does not gain a second stroke on top.
   */
  const shownVessels =
    focus.kind === 'extraordinary'
      ? focus.vessel
        ? EXTRAORDINARY_VESSELS.filter((v) => v.zhHant === focus.vessel)
        : EXTRAORDINARY_VESSELS
      : showVessels
        ? EXTRAORDINARY_VESSELS
        : [];

  const emphasis = useMemo(() => {
    const points = new Set<string>();
    const meridians = new Set<string>();
    let primary: string | null = null;
    if (focus.kind === 'point') {
      const p = acupointById.get(focus.pointId);
      if (p) {
        points.add(p.id);
        meridians.add(p.meridianId);
        primary = p.id;
      }
    } else if (focus.kind === 'meridian') {
      meridians.add(focus.meridianId);
      meridianById.get(focus.meridianId)?.pointOrder.forEach((id) => points.add(id));
    } else if (focus.kind === 'function') {
      const ex = expandFunction(focus.functionId);
      ex?.acupoints.forEach((p) => {
        points.add(p.id);
        meridians.add(p.meridianId);
      });
      ex?.meridians.forEach((m) => meridians.add(m.id));
    } else if (focus.kind === 'extraordinary') {
      // The stations a vessel calls at belong to other lines, so lighting the
      // points is what makes the vessel visible as a path through the network.
      const vs = focus.vessel
        ? EXTRAORDINARY_VESSELS.filter((v) => v.zhHant === focus.vessel)
        : EXTRAORDINARY_VESSELS;
      for (const v of vs) {
        for (const code of v.route?.crossings ?? []) {
          const p = dataset.acupoints.find((x) => x.code === code);
          if (p) {
            points.add(p.id);
            meridians.add(p.meridianId);
          }
        }
        if (v.meridian) meridians.add(v.meridian.id);
      }
    }
    return { points, meridians, primary };
  }, [focus]);

  const stationCoord = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const line of dataset.networkLines) {
      for (const s of line.stations) map.set(s.acupointId, { x: s.x, y: s.y });
    }
    return map;
  }, []);

  useEffect(() => {
    // A context map holds the whole network; only the highlight moves.
    if (role === 'context') return;
    const key = JSON.stringify(focus);
    if (key === lastFocus.current) return;
    lastFocus.current = key;
    if (focus.kind === 'none') return;
    if (focus.kind === 'point') {
      const c = stationCoord.get(focus.pointId);
      if (c) vp.centerOn(c.x, c.y, 3.4);
      return;
    }
    // The network map has no front and back, so a 募俞 pair is simply its two
    // stations — and fitting both is exactly the view that shows how far apart
    // on the network two points at the same vertebral level actually are.
    if (focus.kind === 'shu_mu') {
      const pair = muShuPair(focus.organ);
      const cs = (pair ? [pair.mu.id, pair.shu.id] : [])
        .map((id) => stationCoord.get(id))
        .filter((c): c is { x: number; y: number } => Boolean(c));
      if (cs.length) vp.fitRegion(boundsOf(cs, 200), 0.16);
      return;
    }
    // 奇經八脈: fit the stations the vessel calls at. On this map a vessel is a
    // line through other lines' stations, so "fit the route" means fitting the
    // crossings — there is nothing else of it to frame.
    if (focus.kind === 'extraordinary') {
      const vs = focus.vessel
        ? EXTRAORDINARY_VESSELS.filter((v) => v.zhHant === focus.vessel)
        : EXTRAORDINARY_VESSELS;
      const cs = vs
        .flatMap((v) => v.route?.crossings ?? [])
        .map((code) => dataset.acupoints.find((p) => p.code === code)?.id)
        .map((id) => (id ? stationCoord.get(id) : undefined))
        .filter((c): c is { x: number; y: number } => Boolean(c));
      if (cs.length) vp.fitRegion(boundsOf(cs, 200), 0.16);
      return;
    }
    const ids =
      focus.kind === 'meridian'
        ? (meridianById.get(focus.meridianId)?.pointOrder ?? [])
        : [
            ...(expandFunction(focus.functionId)?.acupoints.map((p) => p.id) ?? []),
            ...(expandFunction(focus.functionId)?.meridians.flatMap((m) => m.pointOrder) ?? []),
          ];
    const coords = ids
      .map((id) => stationCoord.get(id))
      .filter((c): c is { x: number; y: number } => Boolean(c));
    if (coords.length) vp.fitRegion(boundsOf(coords, 200), 0.16);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, stationCoord, role]);

  const scale = vp.scale;
  const showLabels = scale > 0.85;

  return (
    <div className="viewer">
      <svg
        ref={vp.svgRef}
        viewBox={`${vp.box.x} ${vp.box.y} ${vp.box.w} ${vp.box.h}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        tabIndex={0}
        aria-label={t(
          '能量網絡圖。方向鍵平移，加減號縮放，0 鍵回到全圖。',
          'Energy network diagram. Arrow keys pan, plus and minus zoom, 0 fits all.',
        )}
        {...vp.handlers}
      >
        {dataset.networkLines.map((line) => {
          const m = meridianById.get(line.meridianId);
          const quiet = emphasis.meridians.size > 0 && !emphasis.meridians.has(line.meridianId);
          return (
            <g key={line.id}>
              <path
                d={line.path}
                fill="none"
                stroke={m?.colorToken}
                strokeWidth={quiet ? 5 : 9}
                strokeOpacity={quiet ? 0.25 : 1}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={m ? DASH_NETWORK[m.lineStyle] : undefined}
              />
            </g>
          );
        })}

        {/*
          奇經八脈 over the network.

          Only the six that own no points are drawn: 督脈 and 任脈 already have
          their own lines here, and a second stroke down the same stations would
          just thicken them. Dashed and in the accent colour so a vessel never
          reads as a fourteenth channel — it is a line CALLING AT other lines'
          stations, which is what it is on the body too.
        */}
        {shownVessels.length > 0 && (
          <g aria-hidden="true">
            {shownVessels
              .filter((v) => !v.meridian)
              .map((v) => {
                const d = networkPathFor(v.zhHant, stationCoord);
                if (!d) return null;
                return (
                  <g key={`qj-${v.zhHant}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={14}
                      strokeOpacity={0.14}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={d}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={3.4}
                      strokeOpacity={0.95}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="10 7"
                    />
                  </g>
                );
              })}
          </g>
        )}

        {dataset.networkInterchanges.map((ix) => {
          // Flip the label to the left when its point sits near the right edge
          // of the canvas so the text can't run off the diagram.
          const labelOnLeft = ix.x > NETWORK_WIDTH * 0.75;
          return (
            <g key={ix.id}>
              <path
                d={connectorPath(ix.meridianIds, ix)}
                fill="none"
                stroke="var(--text-faint)"
                strokeWidth={2}
                strokeDasharray="4 5"
              />
              <circle cx={ix.x} cy={ix.y} r={9} fill="var(--bg)" stroke="var(--text-dim)" strokeWidth={2} />
              {showLabels && (
                <text
                  className="station-label"
                  x={ix.x + (labelOnLeft ? -14 : 14)}
                  y={ix.y + 4}
                  textAnchor={labelOnLeft ? 'end' : 'start'}
                  fontSize={12}
                  strokeWidth={3.4}
                  fill="var(--text-dim)"
                  stroke="var(--bg)"
                >
                  {t(ix.labelZhHant, ix.labelEn)}
                </text>
              )}
            </g>
          );
        })}

        {dataset.networkLines.map((line) => {
          const m = meridianById.get(line.meridianId);
          const quiet = emphasis.meridians.size > 0 && !emphasis.meridians.has(line.meridianId);
          return line.stations.map((s) => {
            const p = acupointById.get(s.acupointId);
            if (!p) return null;
            const isPrimary = emphasis.primary === p.id;
            const isRelated = emphasis.points.has(p.id);
            const r = s.isTerminus ? 9 : 6.5;
            const dy = s.labelSide === 'above' ? -14 : 20;
            return (
              <g key={s.acupointId}>
                {isPrimary && (
                  <circle
                    className="marker-pulse"
                    cx={s.x}
                    cy={s.y}
                    r={r + 8}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                  />
                )}
                <circle
                  aria-hidden="true"
                  cx={s.x}
                  cy={s.y}
                  r={isPrimary ? r + 2 : r}
                  fill={isRelated ? (m?.colorToken ?? 'var(--accent)') : 'var(--bg)'}
                  fillOpacity={quiet ? 0.4 : 1}
                  stroke={m?.colorToken}
                  strokeWidth={3}
                  strokeOpacity={quiet ? 0.4 : 1}
                  pointerEvents="none"
                />
                <circle
                  className="marker-hit"
                  cx={s.x}
                  cy={s.y}
                  r={r + 9}
                  fill="transparent"
                  stroke="none"
                  tabIndex={0}
                  role="button"
                  aria-label={
                    lang === 'en' && p.nameEn ? `${p.nameEn} ${p.code}` : `${p.nameZhHant} ${p.code}`
                  }
                  onClick={() => setFocus({ kind: 'point', pointId: p.id })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFocus({ kind: 'point', pointId: p.id });
                    }
                  }}
                />
                {showLabels && (
                  <text
                    className="station-label"
                    x={s.x}
                    y={s.y + dy}
                    textAnchor="middle"
                    fontSize={11}
                    strokeWidth={3.2}
                    fill={quiet ? 'var(--text-faint)' : 'var(--text)'}
                    stroke="var(--bg)"
                    style={{ fontWeight: isPrimary ? 700 : 600 }}
                  >
                    {lang === 'en'
                      ? p.code
                      : lang === 'zh'
                        ? p.nameZhHant
                        : `${p.nameZhHant} ${p.code}`}
                  </text>
                )}
              </g>
            );
          });
        })}
      </svg>

      {role === 'primary' && (
      <LegendPanel titleZh="路線" titleEn="Lines" count={dataset.networkLines.length}>
        {dataset.networkLines.map((line) => {
          const m = meridianById.get(line.meridianId)!;
          const selected = focus.kind === 'meridian' && focus.meridianId === m.id;
          return (
            <button
              key={line.id}
              type="button"
              className="legend-row"
              aria-pressed={selected}
              onClick={() =>
                setFocus(selected ? { kind: 'none' } : { kind: 'meridian', meridianId: m.id })
              }
            >
              <LineSwatch meridian={m} />
              <span className="legend-name" title={`${m.code} · ${t(m.nameZhHant, m.nameEn)}`}>
                {meridianLegendName(m, lang).primary}
                {/* `t` trims both ends, so the separator is spaced in CSS
                    rather than with literal whitespace that gets eaten. */}
                <span className="legend-count">
                  · {t(`${line.stations.length} 站`, `${line.stations.length}`)}
                </span>
                {meridianLegendName(m, lang).secondary && (
                  <span className="legend-name-alt">{meridianLegendName(m, lang).secondary}</span>
                )}
              </span>
            </button>
          );
        })}

        {/*
          奇經八脈 on the map.

          Only six are offered: 督脈 and 任脈 are already lines above, listed
          with their own station counts, and offering them twice would suggest
          the map holds two different things for each. The six that remain own
          no stations at all — they are drawn as a line calling at other lines'
          stations, which is the same relationship they have on the body.
        */}
        <div className="legend-group-label" style={{ marginTop: 8 }}>
          {t('奇經八脈', 'Extraordinary vessels')}
        </div>
        <div className="legend-groups">
          <div className="legend-group-row">
            <button
              type="button"
              className={`strip-chip${showVessels ? ' active' : ''}`}
              aria-pressed={showVessels}
              onClick={() => {
                /*
                 * Turning it on clears a single-vessel selection, because a
                 * selection outranks the overlay when deciding what to draw —
                 * without this, pressing "show all six" while one was selected
                 * changed the button but not the map.
                 */
                if (!showVessels && focus.kind === 'extraordinary' && focus.vessel) {
                  setFocus({ kind: 'none' });
                }
                setShowVessels((v) => !v);
              }}
            >
              {t('全部顯示', 'Show all six')}
            </button>
          </div>
          <div className="legend-group-row">
            {EXTRAORDINARY_VESSELS.filter((v) => !v.meridian).map((v) => {
              const on = focus.kind === 'extraordinary' && focus.vessel === v.zhHant;
              return (
                <button
                  key={v.zhHant}
                  type="button"
                  className={`strip-chip${on ? ' active' : ''}`}
                  aria-pressed={on}
                  title={t(
                    `${v.zhHant}——無專屬站點，行經十二正經的 ${v.route?.crossings.length ?? 0} 個站`,
                    `${v.en} — owns no stations; calls at ${v.route?.crossings.length ?? 0} on the twelve`,
                  )}
                  onClick={() =>
                    setFocus(on ? { kind: 'none' } : { kind: 'extraordinary', vessel: v.zhHant })
                  }
                >
                  {t(v.zhHant, v.en)}
                </button>
              );
            })}
          </div>
          <div className="faint" style={{ marginTop: 2 }}>
            {t(
              '督脈與任脈已在上方各有一條路線。其餘六脈無專屬站點，虛線行經其他路線的站。',
              '督脈 and 任脈 each have their own line above. The other six own no stations; their dashed line calls at other lines’ stops.',
            )}
          </div>
        </div>
      </LegendPanel>
      )}

      {role === 'primary' && (
      <div className="viewer-toolbar">
        <button type="button" className="icon-btn" onClick={() => vp.zoomBy(1.4)} aria-label="Zoom in">
          +
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => vp.zoomBy(1 / 1.4)}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            vp.fitAll();
            setFocus({ kind: 'none' });
          }}
        >
          {t('全圖', 'Fit')}
        </button>
        {focus.kind === 'point' && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => setRoute('atlas')}
            aria-label={t('在人體圖上顯示', 'Show on the body atlas')}
          >
            {t('人體圖', 'Atlas')}
          </button>
        )}
      </div>
      )}

      {role === 'primary' && focus.kind === 'point' && (
        <div className="viewer-caption">
          {t('點選右上「人體圖」可跳到置中的人體圖檢視。', 'Use “Atlas” to jump to the centred body view.')}
        </div>
      )}
    </div>
  );
}

/** Screen-reader / non-visual equivalent: ordered lines and stations. */
export function NetworkOutline() {
  const t = useBilingual();
  const { setFocus } = useStore();
  return (
    <div className="panel stack">
      <div>
        <div className="eyebrow">{t('文字版路線表', 'Text equivalent')}</div>
        <p className="faint" style={{ margin: '4px 0 0' }}>
          {t(
            '與圖形版使用相同資料。',
            'Built from the same records as the diagram.',
          )}
        </p>
      </div>
      {dataset.networkLines.map((line) => {
        const m = meridianById.get(line.meridianId)!;
        return (
          <section key={line.id}>
            <h3 style={{ fontSize: 15 }}>
              {m.code} · {t(m.nameZhHant, m.nameEn)}
            </h3>
            <ol className="list-reset" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {line.stations.map((s, i) => {
                const p = acupointById.get(s.acupointId)!;
                return (
                  <li key={s.acupointId}>
                    <button
                      type="button"
                      className="btn small ghost"
                      onClick={() => setFocus({ kind: 'point', pointId: p.id })}
                    >
                      {i + 1}. {t(p.nameZhHant, p.nameEn ?? p.nameZhHant)} {p.code}
                      {s.isTerminus ? ' ◎' : ''}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
      {dataset.networkInterchanges.map((ix) => (
        <div key={ix.id} className="notice">
          <span>
            <strong>{t(ix.labelZhHant, ix.labelEn)}</strong> —{' '}
            {t(ix.meaningZhHant, ix.meaningEn)}
          </span>
        </div>
      ))}
    </div>
  );
}
