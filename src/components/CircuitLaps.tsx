import {
  SEGMENTS,
  channelsOf,
  inEmphasis,
  type CircuitEmphasis,
  type SegmentId,
} from '../data/circuit';
import { useBilingual, useStore } from '../state/store';

/**
 * The four segment rows — group chip, standing-pose direction, three channels.
 *
 * Split out of CircuitDiagram when 十二經運行 became its own page: the Flow
 * page keeps only the compact loop, and this list moved to where the full
 * treatment lives. One component rather than two copies, because the rows
 * carry the ↑升／↓降 convention and a drifted copy would quietly teach two
 * different conventions.
 */
export default function CircuitLaps({
  emphasis,
  active,
  pinned,
  onPin,
  activeMeridianId,
}: {
  emphasis: CircuitEmphasis;
  active: SegmentId | null;
  pinned: SegmentId | null;
  onPin: (id: SegmentId) => void;
  activeMeridianId?: string;
}) {
  const t = useBilingual();
  const { setFocus, setRoute } = useStore();
  return (
    <div className="circuit-laps">
      {SEGMENTS.map((s) => (
        <div
          key={s.id}
          className={`circuit-lap-row${!inEmphasis(s, emphasis) ? ' faint' : ''}`}
        >
          <button
            type="button"
            className={`strip-chip${active === s.id ? ' active' : ''}`}
            aria-pressed={pinned === s.id}
            onClick={() => onPin(s.id)}
          >
            {t(s.zhHant, s.en)}
          </button>
          <span
            className="circuit-standing"
            title={t('自然垂手直立時的走向', 'Direction with arms hanging')}
          >
            {s.standing === 'up' ? '↑升' : '↓降'}
          </span>
          {channelsOf(s.id).map((m) => (
            <button
              key={m.id}
              type="button"
              className="circuit-chip"
              data-active={m.id === activeMeridianId || undefined}
              style={{ borderColor: m.colorToken }}
              title={t(m.nameZhHant, m.nameEn)}
              onClick={() => {
                setFocus({ kind: 'meridian', meridianId: m.id });
                setRoute('atlas');
              }}
            >
              <span style={{ color: m.colorToken }}>{m.code}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
