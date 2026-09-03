import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { pointsInRegion } from './regions';

const day14 = () => dataset.curriculumDays.find((d) => d.id === 'day_14')!;
const cards14 = () => dataset.flashcards.filter((f) => f.dayId === 'day_14');
const quiz14 = () => dataset.quizItems.filter((q) => q.dayId === 'day_14');

/** Every piece of learner-facing text this day ships. */
const allText = (): string[] => {
  const out: string[] = [];
  const d = day14();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards14()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz14()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

/**
 * Day 14's compliance contract.
 *
 * The source draft arrived with a bleeding technique, four symptom→point
 * drills and an efficacy superlative, and needed three revision rounds. Two
 * factual errors survived the first two of them. Prose review clearly does not
 * catch these on its own, so the boundary is asserted here.
 */
describe('day 14 — what may not appear', () => {
  it('carries no symptom→point mapping or efficacy claim', () => {
    const banned = [
      '放血',
      '主治',
      '療效',
      '治落枕',
      '偏頭痛',
      '偏头痛',
      '心痛',
      '失眠',
      '咳嗽',
      '氣喘',
      '第一穴',
    ];
    for (const text of allText()) {
      for (const word of banned) {
        // The words may appear ONLY inside the notice saying what is excluded.
        const excusing = /未收錄|NOT INGESTED/i.test(text);
        if (text.includes(word) && !excusing) {
          expect({ word, text: text.slice(0, 80) }).toEqual({ word, text: 'NOT PRESENT' });
        }
      }
    }
  });

  it('gives no needling or invasive technique', () => {
    const blob = allText().join(' ');
    for (const word of ['針刺', '進針', '刺入', '深度', '艾灸', '放血', 'needle', 'moxa', 'bleed']) {
      expect(blob).not.toContain(word);
    }
  });

  it('keeps the editorial scaffolding out of the ingested content', () => {
    // The draft's own "issues fixed" tables quoted every excluded claim
    // verbatim. Review correspondence is not lesson content.
    const blob = allText().join(' ');
    for (const word of ['修正', 'Issues Fixed', '設計復盤', '原問題']) {
      expect(blob).not.toContain(word);
    }
  });
});

describe('day 14 — what it claims about the body', () => {
  it('places the little finger’s two channels on the correct sides', () => {
    // Two revisions of the source draft got this wrong in two different ways.
    const ht9 = acupointById.get('pt_ht9')!;
    const si1 = acupointById.get('pt_si1')!;
    expect(ht9.location?.value.zhHant).toContain('橈側');
    expect(si1.location?.value.zhHant).toContain('尺側');

    const blob = allText().join(' ');
    // The mnemonic must agree with those records.
    expect(blob).toContain('小指橈側心經起，尺側小腸太陽會');
    expect(blob).not.toContain('小指内属心与肾');
    expect(blob).not.toContain('外侧太阳少阴汇');
  });

  it('pairs points across paired channels, in matching categories', () => {
    const pairs: [string, string][] = [
      ['pt_pc6', 'pt_te5'],
      ['pt_lu9', 'pt_li4'],
      ['pt_ht7', 'pt_si4'],
    ];
    for (const [a, b] of pairs) {
      const A = acupointById.get(a)!;
      const B = acupointById.get(b)!;
      // Different channels — a same-channel pair is not an interior-exterior one.
      expect(A.meridianId).not.toBe(B.meridianId);
      // And the same category on both sides, which is what makes it a pattern.
      const ca = A.classifications?.value ?? [];
      const cb = B.classifications?.value ?? [];
      const shared = ca.filter((c) => cb.includes(c));
      expect(shared.length).toBeGreaterThan(0);
    }
  });

  it('names 神門 by the tendon its own record names, not the ulnar styloid', () => {
    const ht7 = acupointById.get('pt_ht7')!;
    expect(ht7.location?.value.zhHant).toContain('尺側腕屈肌腱');
    const blob = allText().join(' ');
    expect(blob).toContain('尺側腕屈肌腱');
    // The draft said 尺骨莖突橈側 — true of most of the wrist, so it locates nothing.
    expect(blob).not.toContain('尺骨莖突橈側');
  });

  it('claims the red-white boundary only for points whose records say so', () => {
    const onBoundary = dataset.acupoints.filter((p) =>
      (p.location?.value.zhHant ?? '').includes('赤白肉際'),
    );
    // 中渚 TE3 is on the dorsum; an earlier draft put it on the boundary.
    expect(onBoundary.map((p) => p.code)).not.toContain('TE3');
    expect(acupointById.get('pt_te3')!.location?.value.zhHant).toContain('手背');
  });

  it('stays inside its own region — no foot points, no unloaded extra points', () => {
    const blob = allText().join(' ');
    for (const stray of ['太衝', '陷谷', '八邪', '太冲']) {
      expect(blob).not.toContain(stray);
    }
    // Every point the day cites by id belongs to the wrist & hand region, or to
    // the forearm corridor the wrist opens onto (內關 PC6 / 外關 TE5).
    const region = new Set(pointsInRegion('wrist_hand').map((p) => p.id));
    const forearm = new Set(['pt_pc6', 'pt_te5']);
    const cited = new Set<string>();
    for (const f of cards14()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz14()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: region.has(id) || forearm.has(id) }).toEqual({ id, inScope: true });
    }
  });
});

describe('day 14 — shape', () => {
  it('joins the numbered curriculum as day 14', () => {
    expect(day14().dayNumber).toBe(14);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('names the six channels that actually reach the hand', () => {
    expect([...day14().meridianIds].sort()).toEqual([
      'mer_ht', 'mer_li', 'mer_lu', 'mer_pc', 'mer_si', 'mer_te',
    ]);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day14().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards14()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz14()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day14().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards14().length).toBeGreaterThanOrEqual(5);
    expect(quiz14().length).toBeGreaterThanOrEqual(3);
  });
});
