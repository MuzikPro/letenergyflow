import { describe, expect, it } from 'vitest';
import { dataset } from '../data';
import { expandFunction, normalize, searchIndex } from './index';

const codesOf = (q: string) => searchIndex.search(q).acupoints.map((r) => r.id);

describe('normalisation', () => {
  it('strips pinyin tone marks and punctuation', () => {
    expect(normalize('Hégǔ!')).toBe('hegu');
    expect(normalize('  LU-7 ')).toBe('lu 7');
  });
});

describe('global search', () => {
  it('finds a point by canonical code', () => {
    expect(searchIndex.search('LU7').acupoints[0]?.id).toBe('pt_lu7');
    expect(searchIndex.search('li4').acupoints[0]?.id).toBe('pt_li4');
  });

  it('finds a point by Traditional Chinese name', () => {
    expect(searchIndex.search('合谷').acupoints[0]?.id).toBe('pt_li4');
    expect(searchIndex.search('列缺').acupoints[0]?.id).toBe('pt_lu7');
  });

  it('finds a point by Simplified Chinese name', () => {
    expect(codesOf('云门')).toContain('pt_lu2');
    expect(codesOf('太渊')).toContain('pt_lu9');
  });

  it('finds a point by pinyin, spaced or joined', () => {
    expect(searchIndex.search('hegu').acupoints[0]?.id).toBe('pt_li4');
    expect(searchIndex.search('he gu').acupoints[0]?.id).toBe('pt_li4');
    expect(searchIndex.search('taiyuan').acupoints[0]?.id).toBe('pt_lu9');
    // A shorter name must not lose to a longer neighbour that merely shares a
    // syllable: 合谷 he gu vs 橫骨 heng gu, 太溪 tai xi vs 太白 tai bai.
    expect(searchIndex.search('heng gu').acupoints[0]?.id).toBe('pt_ki11');
    expect(searchIndex.search('tai xi').acupoints[0]?.id).toBe('pt_ki3');
  });

  it('finds a point by English name', () => {
    expect(searchIndex.search('union valley').acupoints[0]?.id).toBe('pt_li4');
  });

  it('finds a point by alias', () => {
    expect(codesOf('Yingxiang')).toContain('pt_li20');
    expect(codesOf('陽溪')).toContain('pt_li5');
  });

  it('tolerates a one-character typo in a latin query', () => {
    expect(codesOf('quchi')).toContain('pt_li11');
    expect(codesOf('taiyuen')).toContain('pt_lu9'); // 太淵 taiyuan, one letter off
    expect(codesOf('lieqe')).toContain('pt_lu7'); // 列缺 lieque, one letter dropped
  });

  it('finds points by body region and by meridian', () => {
    expect(codesOf('thumb')).toContain('pt_lu11');
    const wholeLung = searchIndex.search('lung', 30).acupoints;
    expect(wholeLung.length).toBeGreaterThanOrEqual(11);
  });

  it('finds meridians by name, abbreviation and alias', () => {
    expect(searchIndex.search('肺經').meridians[0]?.id).toBe('mer_lu');
    expect(searchIndex.search('large intestine').meridians[0]?.id).toBe('mer_li');
    expect(searchIndex.search('Hand Yangming').meridians[0]?.id).toBe('mer_li');
  });

  it('finds traditional functions and learning topics', () => {
    expect(searchIndex.search('面口').functions[0]?.id).toBe('fn_head_face_region');
    expect(searchIndex.search('throat').functions[0]?.id).toBe('fn_throat_topic');
    expect(searchIndex.search('four command').functions.length).toBeGreaterThan(0);
  });

  it('groups mixed matches into the three result categories', () => {
    const r = searchIndex.search('肺');
    expect(r.meridians.length).toBeGreaterThan(0);
    expect(r.acupoints.length).toBeGreaterThan(0);
    expect(r.total).toBe(r.acupoints.length + r.meridians.length + r.functions.length);
  });

  it('always states which content set was searched', () => {
    const r = searchIndex.search('合谷');
    expect(r.scopeEn).toMatch(/ALL 14 channels/);
    expect(r.scopeZhHant).toMatch(/十四經/);
  });

  it('returns nothing for a code or name the dataset does not contain', () => {
    // All fourteen channels are loaded, so there is no longer an unloaded
    // channel to probe with. What must still hold is that the index does not
    // invent matches: a plausible-looking code that does not exist, and a
    // point name from no channel at all, both come back empty.
    // NOT 'LU99' — that is one character from the real LU9, and the index is
    // deliberately typo-tolerant on Latin queries, so matching it is correct.
    // These have no near neighbour at all.
    expect(searchIndex.search('XX3').total).toBe(0);
    expect(searchIndex.search('ZZ42').total).toBe(0);
    expect(searchIndex.search('龍門').total).toBe(0);
    expect(searchIndex.search('鳳凰穴').total).toBe(0);
  });

  it('returns an empty grouped result for an empty query', () => {
    expect(searchIndex.search('   ').total).toBe(0);
  });
});

describe('function expansion', () => {
  it('resolves every related record through structured ids', () => {
    const ex = expandFunction('fn_head_face_region');
    expect(ex?.acupoints.map((p) => p.code)).toEqual(['LI4']);
    expect(ex?.meridians.map((m) => m.code)).toEqual(['LI']);
    expect(ex?.relationIds.length).toBe(2);
  });

  it('highlights both members of the interior–exterior pair', () => {
    const ex = expandFunction('fn_interior_exterior_pair');
    expect(ex?.meridians.map((m) => m.code).sort()).toEqual(['LI', 'LU']);
  });

  it('only highlights members that are actually loaded', () => {
    // The Four Command song is complete as of Day 4: 委中 BL40 was the last of
    // the four to load, and the topic now expands to all of them.
    const ex = expandFunction('fn_four_command_song');
    expect(ex?.acupoints.map((p) => p.code).sort()).toEqual(['BL40', 'LI4', 'LU7', 'ST36']);

    // The guard the original version of this test existed for still holds: a
    // relation pointing at an unloaded record must be dropped, not rendered as
    // a dangling reference.
    const dangling = dataset.functionRelations.filter(
      (r) =>
        (r.targetType === 'acupoint' && !dataset.acupoints.some((p) => p.id === r.targetId)) ||
        (r.targetType === 'meridian' && !dataset.meridians.some((m) => m.id === r.targetId)),
    );
    for (const r of dangling) {
      const ex2 = expandFunction(r.functionId);
      expect(ex2?.acupoints.some((p) => p.id === r.targetId)).toBe(false);
    }
  });
});
