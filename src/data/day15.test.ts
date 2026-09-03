import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { pointsInRegion } from './regions';

const day15 = () => dataset.curriculumDays.find((d) => d.id === 'day_15')!;
const cards15 = () => dataset.flashcards.filter((f) => f.dayId === 'day_15');
const quiz15 = () => dataset.quizItems.filter((q) => q.dayId === 'day_15');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day15();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards15()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz15()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const cls = (id: string) => acupointById.get(id)?.classifications?.value ?? [];

/**
 * Day 15's compliance contract, and the four anatomical errors its source
 * draft carried. The draft contradicted itself on two of them — its practical
 * section had the elbow the right way round while its summary table did not —
 * which is exactly the kind of thing prose review slides past.
 */
describe('day 15 — what may not appear', () => {
  it('carries no symptom→point mapping or efficacy claim', () => {
    const banned = [
      '主治',
      '療效',
      '治肺癰',
      '肺癰',
      '便秘',
      '通便',
      '癲癇',
      '急性心痛',
      '調腸胃',
      '力最宏',
      '要穴',
    ];
    for (const text of allText()) {
      for (const word of banned) {
        const excusing = /未收錄|NOT INGESTED/i.test(text);
        if (text.includes(word) && !excusing) {
          expect({ word, text: text.slice(0, 80) }).toEqual({ word, text: 'NOT PRESENT' });
        }
      }
    }
  });

  it('gives no needling term or invasive technique', () => {
    const blob = allText().join(' ');
    // 反關穴 is a needling-access term; the draft used it for 養老.
    for (const w of ['反關穴', '針刺', '進針', '刺入', '深度', '艾灸', '放血', 'needle', 'moxa']) {
      expect(blob).not.toContain(w);
    }
  });

  it('keeps the editorial scaffolding out of the ingested content', () => {
    const blob = allText().join(' ');
    for (const w of ['修正', '原問題', '修正記錄', '原稿']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    // The draft told the learner to open a virtual cun ruler, a skeletal x-ray
    // mode, a bone-seam overlay and an animated forearm rotation. The app has
    // a region lens with zoom, pan, a front/back toggle and a point list.
    const blob = allText().join(' ');
    for (const w of ['骨骼透視', '虛擬骨度尺', '骨度尺', '骨縫', 'x-ray', 'X 光']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 15 — what it claims about the body', () => {
  it('puts 尺澤 radial and 曲澤 ulnar of the biceps tendon, as their records do', () => {
    expect(acupointById.get('pt_lu5')!.location?.value.zhHant).toContain('橈側');
    expect(acupointById.get('pt_pc3')!.location?.value.zhHant).toContain('尺側');
    const blob = allText().join(' ');
    // The draft's summary listed 尺澤 among the 內側 points.
    expect(blob).not.toContain('內側（尺側）有尺澤');
    expect(blob).toContain('尺澤在它的橈側');
  });

  it('keeps 小海 on the medial side, behind the elbow', () => {
    const si8 = acupointById.get('pt_si8')!.location?.value.zhHant ?? '';
    expect(si8).toContain('肱骨內上髁');
    expect(si8).toContain('尺骨鷹嘴');
    const blob = allText().join(' ');
    // The draft listed it under 外側（橈側）, alongside 曲池.
    expect(blob).not.toContain('外側（橈側）有曲池、小海');
  });

  it('gives each forearm corridor to the one channel that uses it', () => {
    // The draft generalised: yang channels between the bones, yin between the
    // tendons. Only TE and PC respectively; LU and LI run the radial border.
    expect(acupointById.get('pt_te6')!.location?.value.zhHant).toContain('尺骨與橈骨之間');
    expect(acupointById.get('pt_pc4')!.location?.value.zhHant).toContain('掌長肌腱');
    expect(acupointById.get('pt_li10')!.location?.value.zhHant).toContain('橈側');
    expect(acupointById.get('pt_lu6')!.location?.value.zhHant).toContain('橈側');
    const blob = allText().join(' ');
    expect(blob).not.toContain('陽經行於兩骨之間');
  });

  it('names the medial epicondyle as what 少海 and 小海 share', () => {
    for (const id of ['pt_ht3', 'pt_si8']) {
      expect(acupointById.get(id)!.location?.value.zhHant).toContain('肱骨內上髁');
    }
    const blob = allText().join(' ');
    expect(blob).toContain('肱骨內上髁');
    // The draft's mnemonic hung 少海 on the ulna, which belongs to 小海.
    expect(blob).not.toContain('少海肘內尺骨通');
  });

  it('holds the bone-cun ladder to the 12-cun forearm', () => {
    const at = (id: string, cun: string) =>
      expect(acupointById.get(id)!.location?.value.zhHant).toContain(cun);
    at('pt_pc6', '2 寸');
    at('pt_te5', '2 寸');
    at('pt_pc5', '3 寸');
    at('pt_te6', '3 寸');
    at('pt_pc4', '5 寸');
    at('pt_lu6', '7 寸');
    at('pt_li10', '2 寸');
    at('pt_si6', '1 寸');
    // 2 of 12 is a sixth — the arithmetic the day asks the learner to do.
    expect(2 / 12).toBeCloseTo(1 / 6, 10);
  });
});

describe('day 15 — the structure it teaches is the structure in the data', () => {
  it('really does hold all six he-sea points of the hand channels', () => {
    const he = pointsInRegion('elbow_forearm').filter((p) => cls(p.id).includes('he_sea'));
    expect(he.map((p) => p.code).sort()).toEqual(['HT3', 'LI11', 'LU5', 'PC3', 'SI8', 'TE10']);
    // One per channel, which is what makes the claim worth teaching.
    expect(new Set(he.map((p) => p.meridianId)).size).toBe(6);
  });

  it('really does hold all six xi-cleft points of the hand channels', () => {
    const xi = pointsInRegion('elbow_forearm').filter((p) => cls(p.id).includes('xi_cleft'));
    expect(xi.map((p) => p.code).sort()).toEqual(['HT6', 'LI7', 'LU6', 'PC4', 'SI6', 'TE7']);
    expect(new Set(xi.map((p) => p.meridianId)).size).toBe(6);
  });

  it('names every one of those twelve in the lesson', () => {
    const blob = allText().join(' ');
    for (const code of ['LU5', 'PC3', 'HT3', 'LI11', 'SI8', 'TE10']) {
      expect({ code, named: blob.includes(code) }).toEqual({ code, named: true });
    }
    for (const code of ['LU6', 'PC4', 'HT6', 'LI7', 'SI6', 'TE7']) {
      expect({ code, named: blob.includes(code) }).toEqual({ code, named: true });
    }
  });

  it('stays inside its own region', () => {
    const region = new Set(pointsInRegion('elbow_forearm').map((p) => p.id));
    // 列缺 LU7, 太淵 LU9, 合谷 LI4 and friends appear only in the spaced-review
    // section, so the cited-point check covers cards and quiz items.
    const cited = new Set<string>();
    for (const f of cards15()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz15()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inRegion: region.has(id) }).toEqual({ id, inRegion: true });
    }
  });
});

describe('day 15 — shape', () => {
  it('follows day 14 in the numbered curriculum', () => {
    expect(day15().dayNumber).toBe(15);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('names the six channels the region actually carries', () => {
    expect([...day15().meridianIds].sort()).toEqual([
      'mer_ht', 'mer_li', 'mer_lu', 'mer_pc', 'mer_si', 'mer_te',
    ]);
    const fromData = new Set(pointsInRegion('elbow_forearm').map((p) => p.meridianId));
    expect([...fromData].sort()).toEqual([...day15().meridianIds].sort());
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day15().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards15()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz15()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day15().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards15().length).toBeGreaterThanOrEqual(5);
    expect(quiz15().length).toBeGreaterThanOrEqual(3);
  });
});
