import { SHICHEN, meridianOf } from './shichen';
import { isFoot, isHand, isYang, isYin } from './channel-groups';
import type { Meridian } from './types';

/**
 * 十二經運行 — the twelve channels as one closed circuit.
 *
 * WHAT THIS TEACHES. The flow order the clock already uses (肺→大腸→胃→…→肝→肺)
 * is not an arbitrary list to memorise: it is three laps of the same four-station
 * loop, 胸→手→頭→足→胸, and the loop follows one rule. 《靈樞·逆順肥瘦》 states
 * the rule as four lines — 手之三陰從藏走手，手之三陽從手走頭，足之三陽從頭走足，
 * 足之三陰從足走腹 — and in the classical demonstration pose (舉手直立, arms
 * raised) every yin segment runs upward and every yang segment downward. One
 * quatrain, one image, the whole circulation.
 *
 * DERIVED, NOT AUTHORED. Nothing here re-states which channel is where in the
 * sequence: the order is read from SHICHEN (starting at 寅, which is how the
 * clock data says the flow sequence is recovered from it), and each channel's
 * segment is derived from the 手/足/陰/陽 splits in channel-groups.ts, which are
 * themselves read out of the reviewed channel names. If the claim "the sequence
 * is 3 × (手陰→手陽→足陽→足陰)" were ever false of the data, circuit.test.ts
 * fails — the classical structure is VERIFIED against the dataset, not asserted
 * over it.
 *
 * The four quotes are verbatim classical text (public domain); the translations
 * and the pose explanation are the project's own and unreviewed, like every
 * translation in this app.
 */

export const CIRCUIT_SOURCE_ID = 'src_lingshu';
export const CIRCUIT_ATTRIBUTION = {
  zhHant: '《靈樞·逆順肥瘦》',
  en: 'Lingshu, “Ni shun fei shou” chapter',
};

export type SegmentId = 'hand_yin' | 'hand_yang' | 'foot_yang' | 'foot_yin';

export interface CircuitSegment {
  id: SegmentId;
  /** Group name — 手三陰 etc. */
  zhHant: string;
  en: string;
  /** From-station → to-station, in station ids. */
  from: StationId;
  to: StationId;
  /** The classical line, verbatim. 藏 is the classical form of 臟. */
  quoteZhHant: string;
  quoteEn: string;
  polarity: 'yin' | 'yang';
  /** In the raised-arm pose: yin segments ascend, yang segments descend. */
  direction: 'ascends' | 'descends';
  /**
   * In the ordinARY standing pose, arms hanging. The HAND segments flip —
   * 胸走手 points down once the arm points down — while the FOOT segments keep
   * their direction, legs being the same way up in both poses. This is why
   * 升／降 and 陰／陽 are different splits of the twelve: they only coincide
   * once the arms are raised, which is the whole point of the classical pose.
   */
  standing: 'up' | 'down';
}

export type StationId = 'chest' | 'hand' | 'head' | 'foot';

export const STATIONS: Record<StationId, { zhHant: string; en: string }> = {
  chest: { zhHant: '胸腹', en: 'Chest · abdomen' },
  hand: { zhHant: '手', en: 'Hand' },
  head: { zhHant: '頭', en: 'Head' },
  foot: { zhHant: '足', en: 'Foot' },
};

/** The four segments, in circuit order. One lap visits all four once. */
export const SEGMENTS: CircuitSegment[] = [
  {
    id: 'hand_yin',
    zhHant: '手三陰',
    en: 'Three hand yin',
    from: 'chest',
    to: 'hand',
    quoteZhHant: '手之三陰，從藏走手',
    quoteEn: 'The three yin of the hand run from the viscera to the hand.',
    polarity: 'yin',
    direction: 'ascends',
    standing: 'down',
  },
  {
    id: 'hand_yang',
    zhHant: '手三陽',
    en: 'Three hand yang',
    from: 'hand',
    to: 'head',
    quoteZhHant: '手之三陽，從手走頭',
    quoteEn: 'The three yang of the hand run from the hand to the head.',
    polarity: 'yang',
    direction: 'descends',
    standing: 'up',
  },
  {
    id: 'foot_yang',
    zhHant: '足三陽',
    en: 'Three foot yang',
    from: 'head',
    to: 'foot',
    quoteZhHant: '足之三陽，從頭走足',
    quoteEn: 'The three yang of the foot run from the head to the foot.',
    polarity: 'yang',
    direction: 'descends',
    standing: 'down',
  },
  {
    id: 'foot_yin',
    zhHant: '足三陰',
    en: 'Three foot yin',
    from: 'foot',
    to: 'chest',
    quoteZhHant: '足之三陰，從足走腹',
    quoteEn: 'The three yin of the foot run from the foot to the abdomen.',
    polarity: 'yin',
    direction: 'ascends',
    standing: 'up',
  },
];

/**
 * Why the pose matters — the one sentence that turns four lines into one rule.
 * Our own explanatory wording, not a quotation.
 */
export const POSE_NOTE = {
  zhHant:
    '以「舉手直立」之姿看：陰經一律向上行，陽經一律向下行。四句口訣便合成一條規則。',
  en:
    'Seen in the raised-arm standing pose, every yin channel runs upward and every yang channel downward — the four lines collapse into one rule.',
};

/** The segment a channel belongs to, derived from its reviewed name. */
export function segmentOf(m: Meridian): CircuitSegment {
  const id: SegmentId = isHand(m)
    ? isYin(m)
      ? 'hand_yin'
      : 'hand_yang'
    : isYin(m)
      ? 'foot_yin'
      : 'foot_yang';
  return SEGMENTS.find((s) => s.id === id)!;
}

export interface CircuitStop {
  meridian: Meridian;
  segment: CircuitSegment;
  /** 0, 1 or 2 — which lap of the loop this channel belongs to. */
  lap: number;
  /** 0..11 — position in the flow order, 肺 first. */
  index: number;
}

/**
 * The twelve channels in flow order, 肺 first.
 *
 * Read from the clock data by starting at 寅 — the recovery the SHICHEN header
 * itself documents — so this file and the clock cannot disagree about the
 * sequence without a test failing.
 */
export const CIRCUIT: CircuitStop[] = (() => {
  const yin = SHICHEN.find((s) => s.branchZhHant === '寅')!.index;
  return Array.from({ length: 12 }, (_, i) => {
    const m = meridianOf(SHICHEN[(yin + i) % 12]!);
    return { meridian: m, segment: segmentOf(m), lap: Math.floor(i / 4), index: i };
  });
})();

/** The three channels of one segment, in lap order. */
export const channelsOf = (id: SegmentId): Meridian[] =>
  CIRCUIT.filter((c) => c.segment.id === id).map((c) => c.meridian);

/** The circuit stop for a channel, or undefined for CV/GV (not in the twelve). */
export const stopOf = (meridianId: string): CircuitStop | undefined =>
  CIRCUIT.find((c) => c.meridian.id === meridianId);

/**
 * Emphasis choices for the diagram: the yin/yang split, or the rising/falling
 * split of the ORDINARY standing pose. Two different partitions of the twelve —
 * 只看升 selects 手三陽+足三陰, which is neither the yin set nor the yang set —
 * and letting a learner flip between them is what shows the pose-dependence.
 */
export type CircuitEmphasis = 'all' | 'yin' | 'yang' | 'up' | 'down';

export const EMPHASIS_RULE: Record<Exclude<CircuitEmphasis, 'all'>, { zhHant: string; en: string }> =
  {
    yin: { zhHant: '陰經上行（舉手直立之姿）', en: 'Yin channels ascend (raised-arm pose)' },
    yang: { zhHant: '陽經下行（舉手直立之姿）', en: 'Yang channels descend (raised-arm pose)' },
    up: {
      zhHant: '自然垂手時上行：手三陽、足三陰（舉手則統為陰升陽降）',
      en: 'Rising with arms hanging: hand yang and foot yin. Raise the arms and it collapses into yin-up, yang-down.',
    },
    down: {
      zhHant: '自然垂手時下行：手三陰、足三陽（舉手則統為陰升陽降）',
      en: 'Descending with arms hanging: hand yin and foot yang. Raise the arms and it collapses into yin-up, yang-down.',
    },
  };

/** Does this segment belong to the emphasised set? */
export const inEmphasis = (s: CircuitSegment, e: CircuitEmphasis): boolean =>
  e === 'all' ||
  (e === 'yin' && s.polarity === 'yin') ||
  (e === 'yang' && s.polarity === 'yang') ||
  (e === 'up' && s.standing === 'up') ||
  (e === 'down' && s.standing === 'down');

/** Guard used by tests and by the yin/yang toggle. */
export const polarityOf = (m: Meridian): 'yin' | 'yang' | 'vessel' =>
  isYin(m) ? 'yin' : isYang(m) ? 'yang' : 'vessel';

// Re-exported so the diagram does not need a second import path for these.
export { isFoot, isHand };
