import { describe, expect, it } from 'vitest';
import { muShuPair, muShuRows, ORGAN_SEQUENCE, vertebralLevelOf } from './specific-points';
import { regionOfPoint } from './regions';

/**
 * The 募俞 pair as a relationship, not as two independent classifications.
 *
 * Both halves were already classified and already tabled; what these tests
 * guard is the claim the pair view makes — that the two are on opposite sides
 * of the body, that the shu half's vertebral level is read out of its own
 * location text rather than retyped, and that no organ ends up with two of
 * either half.
 */

describe('募俞 pairs — the relationship', () => {
  it('gives all twelve organs both halves', () => {
    expect(ORGAN_SEQUENCE.length).toBe(12);
    for (const organ of ORGAN_SEQUENCE) {
      const pair = muShuPair(organ);
      expect({ organ, paired: Boolean(pair) }).toEqual({ organ, paired: true });
    }
    expect(muShuPair('spleen')!.mu.code).toBe('LR13');
    expect(muShuPair('spleen')!.shu.code).toBe('BL20');
  });

  it('uses each point in exactly one pair', () => {
    const used: string[] = [];
    for (const organ of ORGAN_SEQUENCE) {
      const pair = muShuPair(organ)!;
      used.push(pair.mu.id, pair.shu.id);
    }
    expect(used.length).toBe(24);
    expect(new Set(used).size).toBe(24);
  });

  it('draws every back-shu on the back, and every mu but one on the front', () => {
    const views = (p: { placements: { view: string }[] }) => p.placements.map((pl) => pl.view);
    const muOnBack: string[] = [];
    for (const organ of ORGAN_SEQUENCE) {
      const { mu, shu } = muShuPair(organ)!;
      expect({ organ, shu: views(shu) }).toEqual({ organ, shu: ['back'] });
      if (views(mu).includes('back')) muOnBack.push(mu.code);
    }
    // 京門 GB25 lies behind the mid-axillary line at the free end of the 12th
    // rib and is drawn on the back, so the kidney is the one pair whose halves
    // share a view. The atlas says so rather than telling you to flip to an
    // empty side. If this list ever grows, that caption needs revisiting.
    expect(muOnBack).toEqual(['GB25']);
  });

  it('makes the pair unshowable by a single-point focus, eleven times over', () => {
    let straddling = 0;
    for (const organ of ORGAN_SEQUENCE) {
      const { mu, shu } = muShuPair(organ)!;
      const sameView = mu.placements.some((a) => shu.placements.some((b) => a.view === b.view));
      if (!sameView) straddling += 1;
    }
    expect(straddling).toBe(11);
  });

  it('keeps every shu in the back region and no mu with it', () => {
    for (const organ of ORGAN_SEQUENCE) {
      const { mu, shu } = muShuPair(organ)!;
      expect({ organ, shu: regionOfPoint(shu)?.key }).toEqual({ organ, shu: 'back_glute' });
      expect(regionOfPoint(mu)?.key).not.toBe('back_glute');
    }
  });

  it('reads each vertebral level out of the shu point’s own location text', () => {
    const levels = ORGAN_SEQUENCE.map((o) => {
      const { shu } = muShuPair(o)!;
      return [shu.code, vertebralLevelOf(shu)] as const;
    });
    expect(Object.fromEntries(levels)).toEqual({
      BL13: 'T3',
      BL14: 'T4',
      BL15: 'T5',
      BL18: 'T9',
      BL19: 'T10',
      BL20: 'T11',
      BL21: 'T12',
      BL22: 'L1',
      BL23: 'L2',
      BL25: 'L4',
      BL27: 'S1',
      BL28: 'S2',
    });
    // Derived, not asserted: the level must actually be inside the location.
    for (const organ of ORGAN_SEQUENCE) {
      const { shu } = muShuPair(organ)!;
      const level = vertebralLevelOf(shu)!;
      const n = level.slice(1);
      const loc = shu.location!.value.zhHant;
      expect({ code: shu.code, inText: loc.includes(`第 ${n} `) }).toEqual({
        code: shu.code,
        inText: true,
      });
    }
  });

  it('returns null rather than a guess for a point with no vertebral level', () => {
    // 中府 LU1 is a mu point on the chest; nothing in its text names a vertebra.
    expect(vertebralLevelOf(muShuPair('lung')!.mu)).toBeNull();
  });

  it('names an organ that does not exist as no pair at all', () => {
    expect(muShuPair('spleen and stomach')).toBeUndefined();
    expect(muShuPair('')).toBeUndefined();
  });

  it('orders the table by the organ cycle, not by point code', () => {
    expect(muShuRows().map((r) => r.organ.en)).toEqual([...ORGAN_SEQUENCE]);
  });
});
