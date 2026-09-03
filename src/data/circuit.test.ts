import { describe, expect, it } from 'vitest';
import { dataset } from './index';
import { SHICHEN_SOURCES } from './shichen';
import {
  CIRCUIT,
  CIRCUIT_SOURCE_ID,
  EMPHASIS_RULE,
  POSE_NOTE,
  SEGMENTS,
  STATIONS,
  channelsOf,
  inEmphasis,
  segmentOf,
  stopOf,
} from './circuit';

/**
 * 十二經運行 — the circuit.
 *
 * The load-bearing claim is classical: the flow order is three laps of
 * 胸→手→頭→足→胸. Everything here derives from data that already exists (the
 * clock's order, the name-splits), so what these tests really pin is that the
 * classical structure HOLDS of our dataset — and that nobody can edit either
 * side into disagreement without hearing about it.
 */

describe('the circuit structure', () => {
  it('is exactly three laps of the four segments, in order', () => {
    /*
     * 《靈樞·逆順肥瘦》 states the rule; this verifies it against the reviewed
     * channel names and the reviewed clock order. If it ever fails, one of the
     * two datasets has been edited wrongly — the classics have not changed.
     */
    expect(CIRCUIT).toHaveLength(12);
    const want = ['hand_yin', 'hand_yang', 'foot_yang', 'foot_yin'];
    for (const [i, stop] of CIRCUIT.entries()) {
      expect({ i, code: stop.meridian.code, segment: stop.segment.id }).toEqual({
        i,
        code: stop.meridian.code,
        segment: want[i % 4],
      });
      expect(stop.lap).toBe(Math.floor(i / 4));
    }
  });

  it('starts at the Lung and closes back on it', () => {
    // 肺 first is what "flow order" means everywhere else in this app.
    expect(CIRCUIT[0]!.meridian.code).toBe('LU');
    expect(CIRCUIT[11]!.meridian.code).toBe('LR');
    // The 表裡-pair edges the network already models imply LR feeds LU again;
    // here it is enough that the last stop's segment ARRIVES at the chest,
    // which is where the first stop departs from.
    expect(CIRCUIT[11]!.segment.to).toBe('chest');
    expect(CIRCUIT[0]!.segment.from).toBe('chest');
  });

  it('chains the four segments into one closed loop', () => {
    for (let i = 0; i < SEGMENTS.length; i += 1) {
      expect(SEGMENTS[i]!.to).toBe(SEGMENTS[(i + 1) % SEGMENTS.length]!.from);
    }
    // …and every station named by a segment exists.
    for (const s of SEGMENTS) {
      expect(STATIONS[s.from]).toBeTruthy();
      expect(STATIONS[s.to]).toBeTruthy();
    }
  });

  it('gives every segment exactly three channels, with none shared', () => {
    const all = SEGMENTS.flatMap((s) => channelsOf(s.id).map((m) => m.code));
    expect(all).toHaveLength(12);
    expect(new Set(all).size).toBe(12);
    for (const s of SEGMENTS) expect(channelsOf(s.id)).toHaveLength(3);
  });

  it('keeps yin ascending and yang descending — the pose rule', () => {
    // This is the video-lesson insight the page exists to teach: in the
    // raised-arm pose the four lines are one rule. It must hold BY DERIVATION.
    for (const s of SEGMENTS) {
      expect({ id: s.id, dir: s.direction }).toEqual({
        id: s.id,
        dir: s.polarity === 'yin' ? 'ascends' : 'descends',
      });
    }
    expect(EMPHASIS_RULE.yin.zhHant).toContain('上行');
    expect(EMPHASIS_RULE.yang.zhHant).toContain('下行');
  });

  it('flips the hand segments between poses, and only the hand segments', () => {
    /*
     * Lowering the arms turns the arm upside down and leaves the legs alone —
     * so the standing direction must disagree with the raised-arm direction on
     * exactly the two hand segments. This is also why 只看升 and 只看陰 are
     * different filters at all: in the standing frame the rising set is
     * 手三陽+足三陰, which is neither polarity's set.
     */
    for (const s of SEGMENTS) {
      const raisedUp = s.direction === 'ascends';
      const standingUp = s.standing === 'up';
      expect({ id: s.id, flipped: raisedUp !== standingUp }).toEqual({
        id: s.id,
        flipped: s.id.startsWith('hand_'),
      });
    }
    const upSet = SEGMENTS.filter((s) => inEmphasis(s, 'up')).map((s) => s.id).sort();
    expect(upSet).toEqual(['foot_yin', 'hand_yang']);
    const yinSet = SEGMENTS.filter((s) => inEmphasis(s, 'yin')).map((s) => s.id).sort();
    expect(upSet).not.toEqual(yinSet);
    // Every emphasis except 'all' selects exactly half the loop…
    for (const e of ['yin', 'yang', 'up', 'down'] as const) {
      expect(SEGMENTS.filter((s) => inEmphasis(s, e))).toHaveLength(2);
    }
    // …and 'all' selects all of it.
    expect(SEGMENTS.every((s) => inEmphasis(s, 'all'))).toBe(true);
  });

  it('leaves the two vessels outside the circuit', () => {
    // CV and GV are 奇經: they are not laps of this loop, and looking one up
    // must say so rather than inventing a seat for it.
    expect(stopOf('mer_cv')).toBeUndefined();
    expect(stopOf('mer_gv')).toBeUndefined();
    for (const m of dataset.meridians.filter((x) => x.id !== 'mer_cv' && x.id !== 'mer_gv')) {
      expect({ code: m.code, seated: Boolean(stopOf(m.id)) }).toEqual({ code: m.code, seated: true });
    }
  });
});

describe('sourcing and boundaries', () => {
  it('cites a registered classical source', () => {
    expect(dataset.sources.some((s) => s.id === CIRCUIT_SOURCE_ID)).toBe(true);
    // The quotes are the classical four lines, verbatim shape: 「X之三Y，從A走B」.
    for (const s of SEGMENTS) {
      expect(s.quoteZhHant).toMatch(/^[手足]之三[陰陽]，從.走.$/);
    }
    // The clock's own sources stay untouched by this feature.
    expect(SHICHEN_SOURCES.length).toBeGreaterThan(0);
  });

  it('agrees with the segment derivation channel by channel', () => {
    // segmentOf reads the reviewed NAME; the circuit reads the clock ORDER.
    // They meet here: LU is 手太陰 so hand_yin, BL is 足太陽 so foot_yang.
    const by = Object.fromEntries(CIRCUIT.map((c) => [c.meridian.code, c.segment.id]));
    expect(by['LU']).toBe('hand_yin');
    expect(by['LI']).toBe('hand_yang');
    expect(by['BL']).toBe('foot_yang');
    expect(by['SP']).toBe('foot_yin');
    for (const c of CIRCUIT) expect(segmentOf(c.meridian).id).toBe(c.segment.id);
  });

  it('carries no treatment language', () => {
    // Same boundary the clock data enforces for itself: the circuit describes
    // where the tradition says qi runs, never what to do about it.
    const text = JSON.stringify({ SEGMENTS, STATIONS, POSE_NOTE, EMPHASIS_RULE });
    for (const banned of ['宜', '忌', '養生', '排毒', '治', '療', 'treat', 'should', 'best time']) {
      expect({ banned, present: text.includes(banned) }).toEqual({ banned, present: false });
    }
  });
});
