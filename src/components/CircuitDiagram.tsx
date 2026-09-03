import { useMemo, useState } from 'react';
import {
  CIRCUIT_ATTRIBUTION,
  EMPHASIS_RULE,
  SEGMENTS,
  STATIONS,
  inEmphasis,
  type CircuitEmphasis,
  type SegmentId,
} from '../data/circuit';
import { useBilingual, useStore } from '../state/store';

/**
 * 十二經運行 — the twelve channels drawn as one closed loop.
 *
 * Four stations, four arcs, and a pulse that walks them. The layout is chosen
 * so the pose rule is VISIBLE rather than stated: 手 sits at the top and 足 at
 * the bottom — the raised-arm pose — so both yin arcs genuinely point up the
 * page and both yang arcs down it. A learner who only glances still sees
 * 陰升陽降.
 *
 * The left/right placement of the loop is page layout, nothing else. The
 * tradition also has a 左升右降 doctrine about the sides of the BODY; our
 * sources for this page do not cover it, so the diagram must not appear to
 * claim it. Stations sit on the centre line for that reason.
 *
 * Motion: one segment is active at a time and its dashes march in the flow
 * direction; every 3.2s the next segment takes over, with its 口訣 line as the
 * caption. Clicking a segment pins it — the auto-advance must not fight a
 * reader. `prefers-reduced-motion` freezes the march and, when nothing is
 * pinned, shows all four lines at once instead of cycling them.
 */

/** Station centres. 手 highest, 足 lowest — the raised-arm pose, drawn. */
const XY: Record<string, { x: number; y: number }> = {
  hand: { x: 170, y: 46 },
  head: { x: 258, y: 132 },
  foot: { x: 170, y: 356 },
  chest: { x: 82, y: 186 },
};

/** The four arcs. Path direction IS flow direction — the dash march relies on it. */
const ARC: Record<SegmentId, string> = {
  hand_yin: 'M 90,164 C 92,100 126,56 152,48',
  hand_yang: 'M 188,48 C 222,58 248,88 254,112',
  foot_yang: 'M 262,152 C 268,232 216,326 186,348',
  foot_yin: 'M 152,350 C 116,322 80,262 82,208',
};

/** Mid-arc chevrons so the direction survives with motion off. */
const CHEVRON: Record<SegmentId, { x: number; y: number; deg: number }> = {
  hand_yin: { x: 104, y: 96, deg: -60 },
  hand_yang: { x: 226, y: 68, deg: 45 },
  foot_yang: { x: 250, y: 250, deg: 110 },
  foot_yin: { x: 100, y: 290, deg: -115 },
};

const prefersStill = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CircuitDiagram({ emphasis }: { emphasis: CircuitEmphasis }) {
  const t = useBilingual();
  const { lang } = useStore();
  const still = useMemo(prefersStill, []);
  /*
   * No relay. Qi does not take turns: the whole loop flows at once, so every
   * arc marches together and the caption lists all four lines. The pin is a
   * reader's highlight and nothing more.
   */
  const [pinned, setPinned] = useState<SegmentId | null>(null);
  const active: SegmentId | null = pinned;
  const seg = (id: SegmentId) => SEGMENTS.find((x) => x.id === id)!;
  const dimmed = (id: SegmentId) => !inEmphasis(seg(id), emphasis);

  return (
    <div className="circuit">
      <svg
        viewBox="0 0 340 400"
        role="img"
        aria-label={t(
          '十二經運行示意圖：胸走手、手走頭、頭走足、足走腹，循環不息。',
          'Circuit of the twelve channels: chest to hand, hand to head, head to foot, foot to abdomen, without end.',
        )}
      >
        {SEGMENTS.map((s) => {
          const isActive = active === s.id;
          const quiet = dimmed(s.id);
          return (
            <g key={s.id} className="circuit-arc" opacity={quiet ? 0.22 : 1}>
              <path
                d={ARC[s.id]}
                fill="none"
                className={!still ? 'circuit-march' : undefined}
                stroke={s.polarity === 'yin' ? 'var(--circuit-yin)' : 'var(--circuit-yang)'}
                strokeWidth={isActive ? 5 : 3}
                strokeLinecap="round"
                strokeDasharray="9 7"
              />
              <g
                transform={`translate(${CHEVRON[s.id].x},${CHEVRON[s.id].y}) rotate(${CHEVRON[s.id].deg})`}
              >
                <path
                  d="M -5,-4 L 5,0 L -5,4"
                  fill="none"
                  stroke={s.polarity === 'yin' ? 'var(--circuit-yin)' : 'var(--circuit-yang)'}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              </g>
              {/* The whole arc is one tap target: pin it, or unpin by tapping again. */}
              <path
                d={ARC[s.id]}
                fill="none"
                stroke="transparent"
                strokeWidth={30}
                role="button"
                tabIndex={0}
                aria-pressed={pinned === s.id}
                aria-label={t(`${s.zhHant}：${s.quoteZhHant}`, `${s.en}: ${s.quoteEn}`)}
                onClick={() => setPinned((p) => (p === s.id ? null : s.id))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setPinned((p) => (p === s.id ? null : s.id));
                  }
                }}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        })}

        {Object.entries(XY).map(([id, p]) => (
          <g key={id}>
            <rect
              x={p.x - 28}
              y={p.y - 15}
              width={56}
              height={30}
              rx={8}
              className="circuit-station"
            />
            <text x={p.x} y={p.y + 5} textAnchor="middle" className="circuit-station-label">
              {t(STATIONS[id as keyof typeof STATIONS].zhHant, STATIONS[id as keyof typeof STATIONS].en)}
            </text>
          </g>
        ))}
      </svg>

      <div className="circuit-caption">
        {/* All four, always — the segments flow together, so no line waits its
            turn. A pinned row is emphasised, not promoted to an only child. */}
        <ul className="circuit-quote-list">
          {SEGMENTS.map((s) => (
            <li
              key={s.id}
              className={[dimmed(s.id) ? 'faint' : '', active === s.id ? 'pinned' : '']
                .filter(Boolean)
                .join(' ') || undefined}
            >
              <strong>{t(s.zhHant, s.en)}</strong> <span lang="zh-Hant">「{s.quoteZhHant}」</span>
              {lang !== 'zh' && active === s.id && (
                <span className="secondary"> {s.quoteEn}</span>
              )}
            </li>
          ))}
        </ul>
        {emphasis !== 'all' && (
          <p className="secondary circuit-rule">{t(EMPHASIS_RULE[emphasis].zhHant, EMPHASIS_RULE[emphasis].en)}</p>
        )}
      </div>

      {/* The lap rows moved to the 十二經運行 page with everything else that
          made this section tall; the Flow page keeps the loop and its caption
          as the compact statement of the idea. */}
      <p className="faint circuit-attrib">
        {t(
          `口訣出自${CIRCUIT_ATTRIBUTION.zhHant}；示意圖為本專案自繪。教育用途，非治療建議。`,
          `The four lines are from ${CIRCUIT_ATTRIBUTION.en}; the diagram is this project’s own. Educational use, not treatment advice.`,
        )}
      </p>
    </div>
  );
}
