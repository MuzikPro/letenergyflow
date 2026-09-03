import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion } from './regions';
import { ATLAS_WIDTH, denorm } from './atlas';

const day17 = () => dataset.curriculumDays.find((d) => d.id === 'day_17')!;
const cards17 = () => dataset.flashcards.filter((f) => f.dayId === 'day_17');
const quiz17 = () => dataset.quizItems.filter((q) => q.dayId === 'day_17');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day17();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards17()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz17()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

/** Vertical position in cun along the 9-cun sternal ruler. */
const yOf = (id: string) => {
  const pl = acupointById.get(id)!.placements.find((p) => p.view === 'front')!;
  return denorm(pl.x, pl.y).y;
};
const xOf = (id: string) => {
  const pl = acupointById.get(id)!.placements.find((p) => p.view === 'front')!;
  return denorm(pl.x, pl.y).x;
};
const MIDLINE = ATLAS_WIDTH / 2;
/**
 * How far a point is drawn from the midline, in cun.
 *
 * Scaled off 乳中 ST17, whose record states 4 寸 — so this measures the drawing
 * against the dataset's own declared distance rather than against a constant
 * written here.
 */
const CUN_ACROSS_CHEST = Math.abs(xOf('pt_st17') - MIDLINE) / 4;
const lateralCun = (id: string) => Math.abs(xOf(id) - MIDLINE) / CUN_ACROSS_CHEST;

describe('day 17 — what may not appear', () => {
  it('carries no symptom→point mapping or efficacy claim', () => {
    const banned = ['主治', '療效', '調理', '溫陽', '止咳', '平喘', '調經', '利水', '要穴'];
    for (const text of allText()) {
      for (const word of banned) {
        const excusing = /未收錄|NOT INGESTED/i.test(text);
        if (text.includes(word) && !excusing) {
          expect({ word, text: text.slice(0, 80) }).toEqual({ word, text: 'NOT PRESENT' });
        }
      }
    }
  });

  it('gives no needling term, moxibustion or contraindication', () => {
    // The last draft added 「不針不灸」 to 乳中. A contraindication is still
    // technique: it tells the learner what to do with a needle.
    const blob = allText().join(' ');
    for (const w of ['不針', '不灸', '針刺', '進針', '刺入', '艾灸', '禁針', 'needle', 'moxa']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    const blob = allText().join(' ');
    for (const w of ['骨骼透視', '高亮模式', '肋間隙高亮', '顯示前正中線', '骨度尺']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 17 — what it claims about the body', () => {
  it('separates 俞府 from 彧中 by a whole intercostal space', () => {
    // Both drafts put them about 0.5 cun apart; one put both in the 1st space.
    const notch = yOf('pt_cv22');
    const per = (yOf('pt_cv16') - notch) / 9;
    const gap = (yOf('pt_ki26') - yOf('pt_ki27')) / per;
    expect(gap).toBeGreaterThan(1.4);
    expect(gap).toBeLessThan(1.8);
    // …which is one space, the same as any other neighbouring pair on the midline.
    const oneSpace = (yOf('pt_cv17') - yOf('pt_cv18')) / per;
    expect(gap).toBeCloseTo(oneSpace, 1);

    const blob = allText().join(' ');
    expect(blob).not.toContain('俞府下約 0.5 寸');
    expect(blob).toContain('鎖骨下緣');
  });

  it('puts the Kidney channel 2 cun out on the chest and 0.5 on the abdomen', () => {
    for (const id of ['pt_ki22', 'pt_ki23', 'pt_ki24', 'pt_ki25', 'pt_ki26', 'pt_ki27']) {
      expect({ id, cun: Number(lateralCun(id).toFixed(2)) }).toEqual({ id, cun: 2 });
      expect(acupointById.get(id)!.location?.value.zhHant).toContain('旁開 2 寸');
    }
    // The abdominal stations keep their own rule.
    for (const id of ['pt_ki16', 'pt_ki11', 'pt_ki21']) {
      expect(Number(lateralCun(id).toFixed(2))).toBe(0.5);
    }
  });

  it('draws the four chest lines where it says they are', () => {
    const ladder: [string, number][] = [
      ['pt_cv17', 0],
      ['pt_ki23', 2],
      ['pt_st17', 4],
      ['pt_pc1', 5],
      ['pt_sp18', 6],
    ];
    for (const [id, cun] of ladder) {
      expect({ id, cun: Number(lateralCun(id).toFixed(2)) }).toEqual({ id, cun });
    }
  });

  it('names all seven channels the region carries, not five', () => {
    const fromData = meridiansInRegion('thorax').map((m) => m.id);
    expect(fromData.length).toBe(7);
    expect([...day17().meridianIds].sort()).toEqual([...fromData].sort());
    // Both drafts omitted these two while naming 中府 LU1 as a core point.
    expect(fromData).toContain('mer_lu');
    expect(fromData).toContain('mer_lr');
  });

  it('gives the 1st space at 6 cun to the Lung, not the Spleen', () => {
    // A draft claimed the Spleen ran the 1st through 5th spaces.
    expect(acupointById.get('pt_lu1')!.location?.value.zhHant).toContain('第 1 肋間隙');
    const spleenChest = pointsInRegion('thorax').filter((p) => p.meridianId === 'mer_sp');
    const spaces = spleenChest
      .map((p) => /第\s*(\d+)\s*肋間隙/.exec(p.location?.value.zhHant ?? '')?.[1])
      .filter(Boolean)
      .map(Number)
      .sort();
    expect(spaces).toEqual([2, 3, 4, 5]);
  });

  it('stops the Stomach channel at the 5th space', () => {
    const stChest = pointsInRegion('thorax').filter((p) => p.meridianId === 'mer_st');
    const spaces = stChest
      .map((p) => /第\s*(\d+)\s*肋間隙/.exec(p.location?.value.zhHant ?? '')?.[1])
      .filter(Boolean)
      .map(Number);
    expect(Math.max(...spaces)).toBe(5);
    expect(acupointById.get('pt_st18')!.location?.value.zhHant).toContain('第 5 肋間隙');
  });

  it('places 膻中 two thirds down the nine-cun sternal ruler', () => {
    const notch = yOf('pt_cv22');
    const per = (yOf('pt_cv16') - notch) / 9;
    const down = (yOf('pt_cv17') - notch) / per;
    // A draft claimed 4.5 of 9, a half.
    expect(down).toBeCloseTo(6, 0);
    expect(down / 9).toBeCloseTo(2 / 3, 1);
  });
});

describe('day 17 — the grid it teaches is the grid in the data', () => {
  it('finds five points on the anchor row, one per line', () => {
    const fourth = pointsInRegion('thorax').filter((p) =>
      /第\s*4\s*肋間隙/.test(p.location?.value.zhHant ?? ''),
    );
    expect(fourth.map((p) => p.code).sort()).toEqual(['CV17', 'KI23', 'PC1', 'SP18', 'ST17']);
    expect(new Set(fourth.map((p) => p.meridianId)).size).toBe(5);
  });

  it('names every point of that row in the lesson', () => {
    const blob = allText().join(' ');
    for (const code of ['CV17', 'KI23', 'ST17', 'PC1', 'SP18']) {
      expect({ code, named: blob.includes(code) }).toEqual({ code, named: true });
    }
  });

  it('stays inside its own region', () => {
    const region = new Set(pointsInRegion('thorax').map((p) => p.id));
    // The Kidney ruler is taught by contrast, so three abdominal stations and
    // 天突 CV22 (the ruler's upper landmark, a neck point) are named.
    const allowed = new Set([...region, 'pt_ki11', 'pt_ki16', 'pt_ki21', 'pt_cv22']);
    const cited = new Set<string>();
    for (const f of cards17()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz17()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: allowed.has(id) }).toEqual({ id, inScope: true });
    }
  });
});

describe('day 17 — shape', () => {
  it('follows day 16 in the numbered curriculum', () => {
    expect(day17().dayNumber).toBe(17);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day17().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards17()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz17()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day17().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards17().length).toBeGreaterThanOrEqual(5);
    expect(quiz17().length).toBeGreaterThanOrEqual(3);
  });
});
