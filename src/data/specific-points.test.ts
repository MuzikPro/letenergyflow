import { describe, expect, it } from 'vitest';
import { dataset } from './index';
import {
  allWith,
  CONFLUENT_PAIRS,
  FIVE_SHU,
  INFLUENTIAL_OF,
  muShuRows,
  ORGAN_OF,
  ORGAN_SEQUENCE,
  pointByCode,
  pointsWith,
  REGULAR_CHANNELS,
} from './specific-points';

/**
 * The specific-point matrix is DERIVED from the point records, so what needs
 * testing is that the derivation still holds: each category complete, each
 * lookup covering exactly the points that carry the classification, and no
 * hand-written entry outliving the record it describes.
 */

describe('specific-point matrix', () => {
  it('covers all twelve regular channels and excludes the two vessels', () => {
    expect(REGULAR_CHANNELS.length).toBe(12);
    expect(REGULAR_CHANNELS.some((m) => m.id === 'mer_cv' || m.id === 'mer_gv')).toBe(false);
  });

  it('finds all five shu points on every one of the twelve', () => {
    for (const m of REGULAR_CHANNELS) {
      for (const f of FIVE_SHU) {
        const found = pointsWith(m.id, f.key);
        expect({ channel: m.code, category: f.key, n: found.length }).toEqual({
          channel: m.code,
          category: f.key,
          n: 1,
        });
      }
    }
  });

  it('gives every channel exactly one yuan-source and one luo-connecting', () => {
    for (const m of REGULAR_CHANNELS) {
      expect(pointsWith(m.id, 'yuan_source').length).toBe(1);
      expect(pointsWith(m.id, 'luo_connecting').length).toBe(1);
    }
  });

  it('keeps the yin channels’ yuan-source and shu-stream on the SAME point', () => {
    // The rule the matrix exists to make visible: on a yin channel they
    // coincide, on a yang channel they do not.
    const yin = ['mer_lu', 'mer_sp', 'mer_ht', 'mer_ki', 'mer_pc', 'mer_lr'];
    const yang = ['mer_li', 'mer_st', 'mer_si', 'mer_bl', 'mer_te', 'mer_gb'];
    for (const id of yin) {
      expect(pointsWith(id, 'yuan_source')[0]!.code).toBe(pointsWith(id, 'shu_stream')[0]!.code);
    }
    for (const id of yang) {
      expect(pointsWith(id, 'yuan_source')[0]!.code).not.toBe(
        pointsWith(id, 'shu_stream')[0]!.code,
      );
    }
  });

  it('names the organ of every front-mu and back-shu point, and no others', () => {
    const classified = [...allWith('front_mu'), ...allWith('back_shu')].map((p) => p.code);
    expect(classified.length).toBe(24); // twelve organs, one mu and one shu each
    for (const code of classified) expect(ORGAN_OF[code]).toBeTruthy();
    // The lookup must not outlive its records: every key still classified.
    for (const code of Object.keys(ORGAN_OF)) expect(classified).toContain(code);

    // Each of the twelve organs has exactly one of each.
    const organs = new Set(Object.values(ORGAN_OF).map((o) => o.en));
    expect(organs.size).toBe(12);
    for (const organ of organs) {
      expect(allWith('front_mu').filter((p) => ORGAN_OF[p.code]?.en === organ).length).toBe(1);
      expect(allWith('back_shu').filter((p) => ORGAN_OF[p.code]?.en === organ).length).toBe(1);
    }
  });

  it('orders the mu/shu table by the flow sequence, not by point code', () => {
    const rows = muShuRows();
    expect(rows.length).toBe(12);
    expect(rows.map((r) => r.organ.en)).toEqual([...ORGAN_SEQUENCE]);
    // Every row is complete — a missing back-shu would render as a dash.
    for (const r of rows) {
      expect(r.mu).toBeTruthy();
      expect(r.shu).toBeTruthy();
    }
    // Reading down the mu column gives the classic order, LU1 first.
    expect(rows[0]!.mu.code).toBe('LU1');
    expect(rows[0]!.shu!.code).toBe('BL13');
  });

  it('flags the front-mu points that sit on another organ’s channel', () => {
    // 中脘 (stomach, on the Conception), 章門 (spleen, on the Liver) and 京門
    // (kidney, on the Gallbladder) are the classic traps; the matrix marks them.
    const offChannel = allWith('front_mu').filter((mu) => {
      const m = dataset.meridians.find((x) => x.id === mu.meridianId)!;
      return !m.nameZhHant.includes(ORGAN_OF[mu.code]!.zhHant);
    });
    const codes = offChannel.map((p) => p.code);
    expect(codes).toContain('CV12');
    expect(codes).toContain('LR13');
    expect(codes).toContain('GB25');
    // And the ones that DO sit on their own channel are not flagged.
    expect(codes).not.toContain('LU1');
    expect(codes).not.toContain('LR14');
  });

  it('has exactly eight influential points, each labelled', () => {
    const eight = allWith('influential_meeting');
    expect(eight.length).toBe(8);
    for (const p of eight) expect(INFLUENTIAL_OF[p.code]).toBeTruthy();
    for (const code of Object.keys(INFLUENTIAL_OF)) {
      expect(eight.map((p) => p.code)).toContain(code);
    }
    // Spread across five different channels — the point of the category, and
    // the count the Day 11 lesson recites, so it is asserted here.
    expect(new Set(eight.map((p) => p.meridianId)).size).toBe(5);
  });

  it('pairs the eight confluent points into four hand-and-foot couples', () => {
    expect(CONFLUENT_PAIRS.length).toBe(4);
    const paired = CONFLUENT_PAIRS.flatMap((p) => [p.foot, p.hand]).sort();
    const classified = allWith('confluent').map((p) => p.code).sort();
    expect(paired).toEqual(classified);
    expect(paired.length).toBe(8);
    // Every code in a pair is a real, loaded point.
    for (const code of paired) expect(pointByCode(code)).toBeTruthy();
  });

  it('carries no symptom-to-point content in the review days', () => {
    // Day 11's 「功能分隊」 and Day 12's case-analysis exam are prescribing
    // exercises. Both are excluded, and the lessons say so rather than quietly
    // omitting them.
    // Every day past the channel curriculum, however many there are — 11 and 12
    // were the review pair, 13 added the clock. Derived, so a new day is
    // covered by this guard automatically instead of silently escaping it.
    const days = dataset.curriculumDays.filter((d) => d.dayNumber >= 11);
    expect(days.length).toBeGreaterThanOrEqual(2);
    const text = JSON.stringify(days);
    expect(text).toMatch(/未收錄/);
    expect(text).toMatch(/NOT INGESTED/);

    // The excluded material may be NAMED — that is how a learner knows what the
    // handbook has that the app does not — but only inside the notice that
    // says it was left out. It must never head a section of actual content.
    const items = days.flatMap((d) => d.sections.flatMap((s) => s.body));
    for (const item of items) {
      const blob = `${item.zhHant} ${item.en}`;
      const namesExcluded = [
        '退熱', '婦科', '急救', '病案分析',
        // Day 13's excluded material: the source draft mapped hours onto daily
        // routine and organ function. Naming it is fine inside the notice.
        '黃金期', '靜養', '解毒', 'detox', 'golden window',
      ].some((x) => blob.includes(x));
      if (!namesExcluded) continue;
      expect(blob).toMatch(/未收錄|NOT INGESTED/);
    }
  });
});
