import {
  SEGMENTS,
  inEmphasis,
  type CircuitEmphasis,
  type SegmentId,
} from '../data/circuit';
import { useBilingual, useStore } from '../state/store';

/**
 * 十二經運行 — the bilateral figure, after the owner's reference video.
 *
 * WHAT IS DUPLICATED, AND WHAT IS NOT. The video's structure is classical and
 * is reproduced faithfully: a body reduced to 頭・胸・腹 on the midline with
 * both hands raised and both feet planted, the four channel groups drawn on
 * BOTH sides, 陰升／陽降 on the flanks, and the 舉手站立 pose named at the top —
 * because the pose is the premise that makes the flank labels true. What is
 * NOT carried over: the video's artwork (copying a modern illustration), and
 * its 左升右降／地氣天氣 captions, which our registered sources do not cover.
 *
 * The right half is the left half mirrored by transform, so the two sides
 * cannot drift apart. Text is drawn per side OUTSIDE the mirror group — a
 * mirrored glyph is a typo, not symmetry.
 */

/** Left-half geometry; the mirror group supplies the other side. */
const ARC: Record<SegmentId, string> = {
  hand_yin: 'M 206,208 C 158,190 112,140 98,84',
  hand_yang: 'M 100,72 C 142,102 176,104 200,104',
  foot_yang: 'M 202,120 C 84,196 92,392 142,496',
  foot_yin: 'M 154,494 C 186,428 200,372 210,330',
};
/*
 * Bézier midpoints and tangents of the arcs above, computed rather than eyed —
 * the first pass placed these by eye and the foot-yang chevron floated a clear
 * 20px off its own arc, reading as a stray glyph on the flank.
 */
const CHEVRON: Record<SegmentId, { x: number; y: number; deg: number }> = {
  hand_yin: { x: 139, y: 160, deg: -132 },
  hand_yang: { x: 157, y: 99, deg: 3 },
  foot_yang: { x: 108, y: 298, deg: 90 },
  foot_yin: { x: 190, y: 403, deg: -76 },
};
const W = 460;

const BOXES: { zh: string; en: string; x: number; y: number; w?: number }[] = [
  { zh: '頭', en: 'Head', x: 230, y: 104 },
  { zh: '胸', en: 'Chest', x: 230, y: 212 },
  { zh: '腹', en: 'Abdomen', x: 230, y: 322 },
  { zh: '右手', en: 'R hand', x: 88, y: 62, w: 62 },
  { zh: '左手', en: 'L hand', x: 372, y: 62, w: 62 },
  { zh: '右腳', en: 'R foot', x: 148, y: 508, w: 62 },
  { zh: '左腳', en: 'L foot', x: 312, y: 508, w: 62 },
];

/**
 * The four 口訣 lines, each at ITS OWN place on the figure — between the
 * stations its segment connects, on the midline where the bilateral layout
 * leaves room. The flow is simultaneous, so there is no "current" line to
 * cycle in a caption; each sentence lives where it is true.
 *
 * The classical line is always shown (it is the artifact, and it is what the
 * figure demonstrates); a compact English gloss joins it outside 中文-only
 * mode, because the full translations are sentences and would not fit inside
 * the loop.
 */
const QUOTES: { seg: SegmentId; x: number; y: number; en: string }[] = [
  { seg: 'hand_yang', x: 230, y: 48, en: 'hand yang: hand → head' },
  { seg: 'hand_yin', x: 230, y: 160, en: 'hand yin: chest → hand' },
  { seg: 'foot_yin', x: 230, y: 420, en: 'foot yin: foot → abdomen' },
  { seg: 'foot_yang', x: 230, y: 548, en: 'foot yang: head → foot' },
];

export default function CircuitBody({
  emphasis,
  pinned,
  still,
  onPick,
}: {
  emphasis: CircuitEmphasis;
  /** A reader's highlight — thicker stroke — not a phase. All arcs flow. */
  pinned: SegmentId | null;
  still: boolean;
  onPick: (id: SegmentId) => void;
}) {
  const t = useBilingual();
  const { lang } = useStore();

  const half = (mirrored: boolean) => (
    <g transform={mirrored ? `translate(${W},0) scale(-1,1)` : undefined}>
      {SEGMENTS.map((s) => {
        const quiet = !inEmphasis(s, emphasis);
        const isPinned = pinned === s.id;
        return (
          <g key={s.id} opacity={quiet ? 0.2 : 1}>
            {/* Every arc marches at once: the flow is simultaneous, and a
                segment-by-segment relay was a misstatement of it. */}
            <path
              d={ARC[s.id]}
              fill="none"
              className={!still ? 'circuit-march' : undefined}
              stroke={s.polarity === 'yin' ? 'var(--circuit-yin)' : 'var(--circuit-yang)'}
              strokeWidth={isPinned ? 4.8 : 3}
              strokeLinecap="round"
              strokeDasharray="9 7"
            />
            <g transform={`translate(${CHEVRON[s.id].x},${CHEVRON[s.id].y}) rotate(${CHEVRON[s.id].deg})`}>
              <path
                d="M -5,-4 L 5,0 L -5,4"
                fill="none"
                stroke={s.polarity === 'yin' ? 'var(--circuit-yin)' : 'var(--circuit-yang)'}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </g>
            <path
              d={ARC[s.id]}
              fill="none"
              stroke="transparent"
              strokeWidth={26}
              role="button"
              tabIndex={0}
              aria-label={t(`${s.zhHant}：${s.quoteZhHant}`, `${s.en}: ${s.quoteEn}`)}
              aria-pressed={isPinned}
              onClick={() => onPick(s.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPick(s.id);
                }
              }}
              style={{ cursor: 'pointer' }}
            />
          </g>
        );
      })}
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${W} 572`}
      className="circuit-body"
      role="img"
      aria-label={t(
        '十二經運行全身示意：雙側各四段同時流注——胸走手、手走頭、頭走足、足走腹。',
        'Whole-body circuit, all segments flowing at once: chest to hand, hand to head, head to foot, foot to abdomen.',
      )}
    >
      <text x={230} y={26} textAnchor="middle" className="circuit-pose-note">
        {t('舉手站立', 'Standing, arms raised')}
      </text>

      {half(false)}
      {half(true)}

      {/* Midline connectors 頭—胸—腹: the trunk the loop threads through. */}
      <path d="M 230,120 L 230,196 M 230,228 L 230,306" stroke="var(--line)" strokeWidth={1.4} />

      {BOXES.map((b) => (
        <g key={b.zh}>
          <rect
            x={b.x - (b.w ?? 46) / 2}
            y={b.y - 15}
            width={b.w ?? 46}
            height={30}
            rx={8}
            className="circuit-station"
          />
          <text x={b.x} y={b.y + 5} textAnchor="middle" className="circuit-station-label">
            {t(b.zh, b.en)}
          </text>
        </g>
      ))}

      {QUOTES.map((q) => {
        const seg = SEGMENTS.find((s) => s.id === q.seg)!;
        const quiet = !inEmphasis(seg, emphasis);
        return (
          <text
            key={q.seg}
            x={q.x}
            y={q.y}
            textAnchor="middle"
            className={`circuit-quote-inline${pinned === q.seg ? ' pinned' : ''}`}
            fill={seg.polarity === 'yin' ? 'var(--circuit-yin)' : 'var(--circuit-yang)'}
            opacity={quiet ? 0.25 : 1}
          >
            <tspan lang="zh-Hant">「{seg.quoteZhHant}」</tspan>
            {lang !== 'zh' && (
              <tspan x={q.x} dy={15} className="circuit-quote-gloss">
                {q.en}
              </tspan>
            )}
          </text>
        );
      })}

      {/* The flank rule, both sides — the video's 陰升陽降, which our pose and
          sources genuinely support. */}
      {/*
        直書, per the owner's reference: upright glyphs stacked down the flank,
        not a line of type turned on its side — rotate(90) lays each character
        flat, which is a typesetting error in Chinese, not verticality. The
        stack is language-independent on purpose; the translated rule already
        lives in EMPHASIS_RULE for the toggle captions.
      */}
      {[26, W - 26].map((x) => (
        <text key={x} x={x} y={252} textAnchor="middle" className="circuit-flank">
          <title>{t('陰升陽降（舉手直立之姿）', 'Yin ascends, yang descends (raised-arm pose)')}</title>
          {['陰', '升', '陽', '降'].map((ch, i) => (
            <tspan key={ch} x={x} dy={i === 0 ? 0 : 22}>
              {ch}
            </tspan>
          ))}
        </text>
      ))}
    </svg>
  );
}
