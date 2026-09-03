import { useMemo, useState } from 'react';
import CircuitBody from '../components/CircuitBody';
import CircuitLaps from '../components/CircuitLaps';
import {
  CIRCUIT_ATTRIBUTION,
  EMPHASIS_RULE,
  POSE_NOTE,
  stopOf,
  type CircuitEmphasis,
  type SegmentId,
} from '../data/circuit';
import { meridianOf } from '../data/shichen';
import { useMeridianClock } from '../state/useMeridianClock';
import { useBilingual } from '../state/store';

/**
 * 十二經運行 — the circuit as its own page.
 *
 * The Flow page keeps a compact loop as a teaser; this is the full treatment,
 * structured after the owner's reference video: the bilateral body, the four
 * groups on both sides, 陰升陽降 on the flanks, the four 口訣 lines cycling
 * with the pulse, and the toggles that cut the twelve by polarity or by
 * standing-pose direction.
 *
 * The clock still matters here — the current hour's channel is ringed in the
 * lap rows — but the page's subject is WHERE the circuit runs, not when.
 */

const prefersStill = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CircuitView() {
  const t = useBilingual();
  const clock = useMeridianClock();
  const still = useMemo(prefersStill, []);
  const [emphasis, setEmphasis] = useState<CircuitEmphasis>('all');
  /*
   * No phase, no timer. The flow is simultaneous — the tradition's own figure
   * for it is 如環無端 — so every arc marches at once and the four lines sit at
   * their own segments on the figure. What survives of "active" is the
   * reader's pin: a highlight, not a turn in a relay.
   */
  const [pinned, setPinned] = useState<SegmentId | null>(null);
  const hourMeridian = meridianOf(clock.shichen);

  return (
    <div className="page stack circuit-view">
      <header>
        <p className="eyebrow">{t('十二經運行', 'The circuit of the twelve')}</p>
        <h1 style={{ fontSize: 24 }}>{t('如環無端 · 一環三圈', 'Without end — one loop, three laps')}</h1>
        <p className="secondary" style={{ margin: '4px 0 0' }}>
          {t(POSE_NOTE.zhHant, POSE_NOTE.en)}
        </p>
      </header>

      <div className="circuit-page-toggle" role="group" aria-label={t('顯示範圍', 'Emphasis')}>
        {(
          [
            ['all', '全部', 'All'],
            ['yin', '只看陰', 'Yin only'],
            ['yang', '只看陽', 'Yang only'],
            ['up', '只看↑升', '↑ Rising'],
            ['down', '只看↓降', '↓ Falling'],
          ] as const
        ).map(([id, zh, en]) => (
          <button
            key={id}
            type="button"
            className={`strip-chip${emphasis === id ? ' active' : ''}`}
            aria-pressed={emphasis === id}
            onClick={() => setEmphasis(id)}
          >
            {t(zh, en)}
          </button>
        ))}
      </div>

      <CircuitBody
        emphasis={emphasis}
        pinned={pinned}
        still={still}
        onPick={(id) => setPinned((p) => (p === id ? null : id))}
      />

      {/* The quotes live ON the figure now; only the rule line needs a home. */}
      {emphasis !== 'all' && (
        <p className="secondary circuit-rule" style={{ textAlign: 'center', margin: 0 }}>
          {t(EMPHASIS_RULE[emphasis].zhHant, EMPHASIS_RULE[emphasis].en)}
        </p>
      )}

      <CircuitLaps
        emphasis={emphasis}
        active={pinned}
        pinned={pinned}
        onPin={(id) => setPinned((p) => (p === id ? null : id))}
        activeMeridianId={hourMeridian.id}
      />
      <p className="secondary" style={{ margin: 0 }}>
        {t(
          `現在是${clock.shichen.branchZhHant}時，${hourMeridian.nameZhHant}當令——它的位置已在上列圈出。`,
          `It is the hour of ${clock.shichen.pinyin}; the ${hourMeridian.nameEn} holds it — ringed in the rows above.`,
        )}
        {(() => {
          const seat = stopOf(hourMeridian.id);
          return seat
            ? ' ' +
                t(
                  `（${seat.segment.zhHant}，第 ${seat.lap + 1} 圈）`,
                  `(${seat.segment.en}, lap ${seat.lap + 1} of 3)`,
                )
            : null;
        })()}
      </p>

      <p className="faint circuit-attrib" style={{ textAlign: 'left' }}>
        {t(
          `口訣出自${CIRCUIT_ATTRIBUTION.zhHant}；示意圖為本專案自繪，僅示意分段與方向，非解剖圖。教育用途，非治療建議。`,
          `The four lines are from ${CIRCUIT_ATTRIBUTION.en}; the figure is this project's own, schematic of segments and directions only — not anatomy. Educational use, not treatment advice.`,
        )}
      </p>
    </div>
  );
}
