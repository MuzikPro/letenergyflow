import { describe, expect, it } from 'vitest';
import { levelPhrase, pairDrill } from './pair-drill';
import { acupointById } from './index';
import {
  muShuPair,
  ORGAN_SEQUENCE,
  REGULAR_CHANNELS,
  vertebralLevelOf,
} from './specific-points';

/**
 * The drill has no answer key of its own — it is generated from the pairing on
 * the records. These tests guard what generation can still get wrong: an
 * option set that gives the answer away, and a deck that changes under the
 * learner between renders.
 */

describe('募俞 pair drill', () => {
  const deck = pairDrill();

  it('asks every organ from both ends, once each', () => {
    expect(deck.length).toBe(24);
    for (const organ of ORGAN_SEQUENCE) {
      const asked = deck.filter((q) => q.organ.en === organ);
      expect({ organ, count: asked.length }).toEqual({ organ, count: 2 });
      expect(asked.map((q) => q.askFor).sort()).toEqual(['level', 'mu']);
    }
  });

  it('never asks which point is an organ’s back-shu', () => {
    // 肺俞 is named "lung shu" in both languages, so that question answers
    // itself from the option text alone. The first version of this drill did
    // ask it — this is the guard that it never comes back.
    for (const q of deck) {
      if (q.askFor !== 'mu') continue;
      for (const o of q.options) {
        const namesOrgan =
          o.zhHant.includes(q.organ.zhHant) || o.en.toLowerCase().includes(q.organ.en);
        expect({ id: q.id, option: o.en, namesOrgan }).toEqual({
          id: q.id,
          option: o.en,
          namesOrgan: false,
        });
      }
    }
  });

  it('leaves the channel code able to give the answer away exactly once', () => {
    // Only three mu points sit on their own organ's channel. For 日月 GB24 and
    // 期門 LR14 a sibling mu on the same channel is forced into the options, so
    // the prefix stops discriminating. 中府 LU1 is the only mu on the Lung
    // channel, so nothing can cover it — a learner who knows only "the lung's
    // mu starts with LU" gets that one free. Recorded, not hidden.
    const leaks: string[] = [];
    for (const q of deck) {
      if (q.askFor !== 'mu') continue;
      const own = REGULAR_CHANNELS[ORGAN_SEQUENCE.indexOf(q.organ.en as never)]!;
      const onOwn = q.options.filter((o) => acupointById.get(o.id)?.meridianId === own.id);
      const answerOnOwn = acupointById.get(q.correctOptionId)?.meridianId === own.id;
      if (answerOnOwn && onOwn.length === 1) leaks.push(q.organ.en);
    }
    expect(leaks).toEqual(['lung']);
  });

  it('gives every question four distinct options containing the answer', () => {
    for (const q of deck) {
      const ids = q.options.map((o) => o.id);
      expect({ id: q.id, distinct: new Set(ids).size }).toEqual({ id: q.id, distinct: 4 });
      expect({ id: q.id, holdsAnswer: ids.includes(q.correctOptionId) }).toEqual({
        id: q.id,
        holdsAnswer: true,
      });
    }
  });

  it('marks the answer the records actually pair', () => {
    for (const q of deck) {
      const pair = muShuPair(q.organ.en)!;
      if (q.askFor === 'mu') {
        expect({ id: q.id, given: q.given.code }).toEqual({ id: q.id, given: pair.shu.code });
        expect({ id: q.id, answer: q.correctOptionId }).toEqual({ id: q.id, answer: pair.mu.id });
        expect(q.partner.code).toBe(pair.mu.code);
      } else {
        expect({ id: q.id, given: q.given.code }).toEqual({ id: q.id, given: pair.mu.code });
        expect({ id: q.id, answer: q.correctOptionId }).toEqual({
          id: q.id,
          answer: vertebralLevelOf(pair.shu),
        });
        expect(q.partner.code).toBe(pair.shu.code);
      }
    }
  });

  it('draws every distractor from the same kind of candidate', () => {
    // Offering a back-shu among front-mu candidates, or a made-up level, would
    // answer the question by elimination.
    const muIds = new Set(ORGAN_SEQUENCE.map((o) => muShuPair(o)!.mu.id));
    const levels = new Set(ORGAN_SEQUENCE.map((o) => vertebralLevelOf(muShuPair(o)!.shu)));
    for (const q of deck) {
      for (const o of q.options) {
        const ok = q.askFor === 'mu' ? muIds.has(o.id) : levels.has(o.id);
        expect({ id: q.id, option: o.id, fromPool: ok }).toEqual({
          id: q.id,
          option: o.id,
          fromPool: true,
        });
      }
    }
  });

  it('never offers the given half back as an option', () => {
    for (const q of deck) {
      expect({ id: q.id, offered: q.options.some((o) => o.id === q.given.id) }).toEqual({
        id: q.id,
        offered: false,
      });
    }
  });

  it('does not park the answer in one seat', () => {
    const seats = new Set(deck.map((q) => q.options.findIndex((o) => o.id === q.correctOptionId)));
    // All four positions get used; always-A would be learnable without knowing
    // a single pairing.
    expect([...seats].sort()).toEqual([0, 1, 2, 3]);
  });

  it('phrases a level the way the records phrase it', () => {
    expect(levelPhrase('T3')).toEqual({ zhHant: '第 3 胸椎棘突下', en: 'T3' });
    expect(levelPhrase('L2')).toEqual({ zhHant: '第 2 腰椎棘突下', en: 'L2' });
    expect(levelPhrase('S1')).toEqual({ zhHant: '平第 1 骶後孔', en: 'S1' });
    // And each phrase must appear verbatim inside its own shu point's location.
    for (const organ of ORGAN_SEQUENCE) {
      const shu = muShuPair(organ)!.shu;
      const level = vertebralLevelOf(shu)!;
      expect({ code: shu.code, inText: shu.location!.value.zhHant.includes(levelPhrase(level).zhHant) }).toEqual({
        code: shu.code,
        inText: true,
      });
    }
  });

  it('is deterministic, so a re-render cannot change the answer', () => {
    const again = pairDrill();
    expect(again.map((q) => q.id)).toEqual(deck.map((q) => q.id));
    for (let i = 0; i < deck.length; i += 1) {
      expect(again[i]!.options.map((o) => o.id)).toEqual(deck[i]!.options.map((o) => o.id));
    }
  });

  it('gives every question a unique, stable id for the review scheduler', () => {
    const ids = deck.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('drill_shu_mu_spleen_level');
    expect(ids).toContain('drill_shu_mu_triple_burner_mu');
  });
});
