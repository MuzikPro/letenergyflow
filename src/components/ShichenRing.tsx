import { useCallback, useRef } from 'react';
import { meridianOf, SHICHEN, shichenHours } from '../data/shichen';
import { useBilingual, useStore } from '../state/store';

/**
 * The twelve-segment 子午流注 ring.
 *
 * 子 sits at the top and the branches run clockwise, which is how the cycle is
 * drawn traditionally. Drag or tap anywhere in the ring and it snaps to the
 * nearest branch; the keyboard gets arrow keys on the same handler, so the
 * control is not pointer-only.
 */

const R_OUT = 96;
const R_IN = 62;
const CX = 110;
const CY = 110;
const SEG = 360 / SHICHEN.length;

const pol = (r: number, deg: number) => {
  // −90° puts branch 0 (子) at the top rather than at 3 o'clock.
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
};

/** One ring segment as an annular wedge. */
function wedge(i: number): string {
  const from = i * SEG - SEG / 2;
  const to = from + SEG;
  const a = pol(R_OUT, from);
  const b = pol(R_OUT, to);
  const c = pol(R_IN, to);
  const d = pol(R_IN, from);
  return [
    `M${a.x.toFixed(2)},${a.y.toFixed(2)}`,
    `A${R_OUT},${R_OUT} 0 0 1 ${b.x.toFixed(2)},${b.y.toFixed(2)}`,
    `L${c.x.toFixed(2)},${c.y.toFixed(2)}`,
    `A${R_IN},${R_IN} 0 0 0 ${d.x.toFixed(2)},${d.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

interface Props {
  index: number;
  liveIndex: number;
  isManual: boolean;
  onSelect: (index: number) => void;
  onStep: (by: number) => void;
}

export default function ShichenRing({ index, liveIndex, isManual, onSelect, onStep }: Props) {
  const t = useBilingual();
  const { lang } = useStore();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);

  /**
   * Pointer position → branch. The angle is measured from the ring's centre in
   * the SVG's own coordinates, so it stays correct at any rendered size and
   * under any CSS scaling — reading clientX against the element box would drift
   * as soon as the ring is not square on screen.
   */
  const branchAt = useCallback((clientX: number, clientY: number): number | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const box = svg.getBoundingClientRect();
    if (!box.width || !box.height) return null;
    const x = ((clientX - box.left) / box.width) * 220;
    const y = ((clientY - box.top) / box.height) * 220;
    const dx = x - CX;
    const dy = y - CY;
    if (Math.hypot(dx, dy) < R_IN * 0.45) return null; // dead centre: ignore
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    return ((Math.round(deg / SEG) % SHICHEN.length) + SHICHEN.length) % SHICHEN.length;
  }, []);

  const pick = useCallback(
    (e: { clientX: number; clientY: number }) => {
      const b = branchAt(e.clientX, e.clientY);
      if (b !== null) onSelect(b);
    },
    [branchAt, onSelect],
  );

  return (
    <div className="shichen-ring">
      <svg
        ref={svgRef}
        viewBox="0 0 220 220"
        role="group"
        aria-label={t('十二時辰選擇環', 'Twelve double-hour selector ring')}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          pick(e);
        }}
        onPointerMove={(e) => {
          if (dragging.current) pick(e);
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        {SHICHEN.map((s) => {
          const m = meridianOf(s);
          const active = s.index === index;
          const live = s.index === liveIndex;
          const label = pol((R_OUT + R_IN) / 2, s.index * SEG);
          return (
            <g key={s.index} className={active ? 'ring-seg active' : 'ring-seg'}>
              <path
                d={wedge(s.index)}
                fill={active ? m.colorToken : 'var(--bg-elev)'}
                stroke="var(--line-soft)"
                strokeWidth={1}
              />
              {/* The live hour keeps a marker while a different one is selected,
                  so manual mode never hides where "now" actually is. */}
              {live && isManual && !active && (
                <circle cx={label.x} cy={label.y + 15} r={2.6} fill="var(--text)" opacity={0.5} />
              )}
              <text
                x={label.x}
                y={label.y + 4}
                textAnchor="middle"
                fontSize={active ? 15 : 13}
                fontWeight={active ? 700 : 500}
                fill={active ? 'var(--accent-ink)' : 'var(--text)'}
              >
                {s.branchZhHant}
              </text>
            </g>
          );
        })}

        <text x={CX} y={CY - 8} textAnchor="middle" className="ring-centre-branch">
          {lang === 'en'
            ? SHICHEN[index]!.pinyin
            : `${SHICHEN[index]!.branchZhHant} ${SHICHEN[index]!.pinyin}`}
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" className="ring-centre-hours">
          {shichenHours(SHICHEN[index]!)}
        </text>
      </svg>

      {/*
        The ring is a listbox in the accessibility tree: pointer users drag it,
        keyboard users tab to it and use the arrow keys. Each branch is a real
        option so a screen reader can announce the whole cycle, not just "ring".
      */}
      <div
        className="ring-options"
        role="listbox"
        tabIndex={0}
        aria-label={t('選擇時辰', 'Choose a double-hour')}
        aria-activedescendant={`shichen-opt-${index}`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            onStep(1);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            onStep(-1);
          }
        }}
      >
        {SHICHEN.map((s) => {
          const m = meridianOf(s);
          return (
            <button
              key={s.index}
              id={`shichen-opt-${s.index}`}
              type="button"
              role="option"
              aria-selected={s.index === index}
              className={s.index === index ? 'ring-opt active' : 'ring-opt'}
              onClick={() => onSelect(s.index)}
            >
              <span className="ring-opt-branch">
                {s.branchZhHant} {s.pinyin}
              </span>
              <span className="ring-opt-hours">{shichenHours(s)}</span>
              <span className="ring-opt-mer" style={{ color: m.colorToken }}>
                {m.code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
