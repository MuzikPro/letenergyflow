import { describe, expect, it } from 'vitest';
import { acupointById, dataset, meridianById } from './index';
import { pointsInRegion, meridiansInRegion, regionCamera, regionOfPoint } from './regions';
import { figureBounds } from './atlas';

const day16 = () => dataset.curriculumDays.find((d) => d.id === 'day_16')!;
const cards16 = () => dataset.flashcards.filter((f) => f.dayId === 'day_16');
const quiz16 = () => dataset.quizItems.filter((q) => q.dayId === 'day_16');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day16();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards16()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz16()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const cls = (id: string) => acupointById.get(id)?.classifications?.value ?? [];

describe('day 16 — what may not appear', () => {
  it('carries no symptom→point mapping or efficacy claim', () => {
    const banned = ['主治', '療效', '肩胛疼痛', '落枕', '明目', '通絡', '要穴', '禁針'];
    for (const text of allText()) {
      for (const word of banned) {
        const excusing = /未收錄|NOT INGESTED/i.test(text);
        if (text.includes(word) && !excusing) {
          expect({ word, text: text.slice(0, 80) }).toEqual({ word, text: 'NOT PRESENT' });
        }
      }
    }
  });

  it('gives no needling term, technique or injury warning', () => {
    const blob = allText().join(' ');
    for (const w of ['針刺', '進針', '刺入', '深度', '艾灸', '放血', '孕婦', '暴力', '損傷', 'needle', 'moxa']) {
      expect(blob).not.toContain(w);
    }
  });

  it('states the 肩井 depth caution as anatomy, not as a procedure', () => {
    const blob = allText().join(' ');
    // Deep to GB21 lie the lung apex and large vessels. That is an anatomical
    // fact and may be said; what may not follow is technique or a caution
    // about how hard to press.
    expect(blob).toContain('肺尖');
    expect(blob).not.toContain('力度');
    expect(blob).not.toContain('按壓易');
  });

  it('keeps editorial scaffolding out of the ingested content', () => {
    const blob = allText().join(' ');
    for (const w of ['修正', '原問題', '原稿', 'Instruction for Coding']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    // The draft called for a skeletal x-ray mode, a supraspinous/infraspinous
    // toggle and a biceps-heads overlay. The lens has zoom, pan, a front/back
    // control and a point list.
    const blob = allText().join(' ');
    for (const w of ['骨骼透視', '透視模式', '虛擬骨度尺', 'x-ray']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 16 — what it claims about the body', () => {
  it('puts 肩髎 on the Triple Energiser, not the Gallbladder', () => {
    const te14 = acupointById.get('pt_te14')!;
    expect(te14.meridianId).toBe('mer_te');
    expect(meridianById.get(te14.meridianId)!.nameZhHant).toContain('三焦');
    const blob = allText().join(' ');
    expect(blob).not.toContain('肩髎 TE14（膽經');
    // The one Gallbladder point here really is 肩井.
    expect(acupointById.get('pt_gb21')!.meridianId).toBe('mer_gb');
  });

  it('names all seven channels the region carries, not five', () => {
    const fromData = new Set(pointsInRegion('shoulder_arm').map((p) => p.meridianId));
    expect(fromData.size).toBe(7);
    expect([...day16().meridianIds].sort()).toEqual([...fromData].sort());
    // The draft's list omitted the Heart and the Gallbladder.
    expect(fromData.has('mer_ht')).toBe(true);
    expect(fromData.has('mer_gb')).toBe(true);
  });

  it('keeps the scapular points inside this region', () => {
    for (const id of ['pt_si10', 'pt_si11', 'pt_si12', 'pt_si13']) {
      expect({ id, region: regionOfPoint(acupointById.get(id)!)?.key }).toEqual({
        id,
        region: 'shoulder_arm',
      });
    }
    const blob = allText().join(' ');
    // The draft called 秉風 a back point borrowed as a neighbour.
    expect(blob).not.toContain('屬背部');
  });

  it('locates 臑會 by the descriptor its record uses', () => {
    expect(acupointById.get('pt_te13')!.location?.value.zhHant).toContain('肩髎下 3 寸');
    const blob = allText().join(' ');
    expect(blob).toContain('肩髎下 3 寸');
    expect(blob).not.toContain('尺骨鷹嘴連線');
  });

  it('measures 臂臑 from the elbow and the rest from the axillary fold', () => {
    expect(acupointById.get('pt_li14')!.location?.value.zhHant).toContain('曲池上 7 寸');
    expect(acupointById.get('pt_pc2')!.location?.value.zhHant).toContain('腋前紋頭下 2 寸');
    expect(acupointById.get('pt_lu3')!.location?.value.zhHant).toContain('腋前紋頭下 3 寸');
    // 3 of the 9-cun upper arm is a third — the arithmetic the day asks for.
    expect(3 / 9).toBeCloseTo(1 / 3, 10);
  });

  it('does not send the learner back to day 14 for shoulder points', () => {
    const review = day16().sections.find((s) => s.id === 'sec_16_review')!;
    const blob = review.body.map((b) => `${b.zhHant} ${b.en}`).join(' ');
    // Day 14 was the wrist and hand; the draft filed today's points under it.
    for (const shoulder of ['肩髃', '肩髎', '肩貞', '極泉', '青靈']) {
      expect({ shoulder, inReview: blob.includes(shoulder) }).toEqual({ shoulder, inReview: false });
    }
  });
});

describe('day 16 — the structure it teaches is the structure in the data', () => {
  it('really does hold seven crossing points, where the arm below holds none', () => {
    const crossing = (key: string) =>
      pointsInRegion(key).filter((p) => cls(p.id).includes('crossing')).map((p) => p.code);
    expect(crossing('wrist_hand')).toEqual([]);
    expect(crossing('elbow_forearm')).toEqual([]);
    expect(crossing('shoulder_arm').sort()).toEqual([
      'GB21', 'LI15', 'LI16', 'SI10', 'SI12', 'TE13', 'TE15',
    ]);
  });

  it('names every one of those seven in the lesson', () => {
    const blob = allText().join(' ');
    for (const code of ['LI15', 'LI16', 'SI10', 'SI12', 'TE13', 'TE15', 'GB21']) {
      expect({ code, named: blob.includes(code) }).toEqual({ code, named: true });
    }
  });

  it('stays inside its own region', () => {
    const region = new Set(pointsInRegion('shoulder_arm').map((p) => p.id));
    // 曲池 LI11 is cited because 臂臑 is measured from it; it is the one point
    // named from a neighbouring region, and the lesson says which.
    const allowed = new Set([...region, 'pt_li11']);
    const cited = new Set<string>();
    for (const f of cards16()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz16()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: allowed.has(id) }).toEqual({ id, inScope: true });
    }
  });
});

/**
 * The shoulder frame, held to the same guarantees as the other twelve.
 *
 * These duplicate the all-region checks deliberately: this region is the one
 * with points on BOTH views (scapular behind, biceps in front), so a framing
 * change that only broke the second view would otherwise be invisible.
 */
describe('day 16 — the shoulder frame', () => {
  for (const view of ['front', 'back'] as const) {
    it(`frames the region on the ${view} view without cropping a point`, () => {
      const box = regionCamera('shoulder_arm', view)!;
      expect(box).toBeDefined();
      for (const p of pointsInRegion('shoulder_arm')) {
        const pl = p.placements.find((x) => x.view === view);
        if (!pl) continue;
        const x = pl.x * 400;
        const y = pl.y * 924;
        expect({ code: p.code, inside: x >= box.x && x <= box.x + box.w }).toEqual({
          code: p.code,
          inside: true,
        });
        expect({ code: p.code, inside: y >= box.y && y <= box.y + box.h }).toEqual({
          code: p.code,
          inside: true,
        });
      }
    });

    it(`keeps the ${view} frame off a thin ribbon and inside the figure`, () => {
      const box = regionCamera('shoulder_arm', view)!;
      const limit = figureBounds(view);
      expect(box.w / box.h).toBeGreaterThanOrEqual(0.61);
      expect(box.w).toBeLessThanOrEqual(limit.w + 0.01);
      expect(box.h).toBeLessThanOrEqual(limit.h + 0.01);
    });
  }

  it('gives the frame more height than its point cloud, and centres it', () => {
    const box = regionCamera('shoulder_arm', 'front')!;
    const placed = pointsInRegion('shoulder_arm')
      .map((p) => p.placements.find((pl) => pl.view === 'front'))
      .filter((pl): pl is NonNullable<typeof pl> => Boolean(pl));
    const xs = placed.map((pl) => pl.x * 400);
    const ys = placed.map((pl) => pl.y * 924);
    expect(box.h).toBeGreaterThan(Math.max(...ys) - Math.min(...ys));
    const cloudMid = (Math.min(...xs) + Math.max(...xs)) / 2;
    expect(Math.abs(cloudMid - (box.x + box.w / 2))).toBeLessThan(box.w * 0.1);
  });

  it('shows the region on both views — the scapular points are on the back', () => {
    const on = (view: string) =>
      pointsInRegion('shoulder_arm').filter((p) => p.placements.some((pl) => pl.view === view));
    expect(on('front').length).toBeGreaterThan(0);
    expect(on('back').length).toBeGreaterThan(0);
  });
});

describe('day 16 — shape', () => {
  it('follows day 15 in the numbered curriculum', () => {
    expect(day16().dayNumber).toBe(16);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('agrees with the region on which channels pass through', () => {
    const fromData = meridiansInRegion('shoulder_arm').map((m) => m.id);
    expect([...fromData].sort()).toEqual([...day16().meridianIds].sort());
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day16().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards16()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz16()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day16().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards16().length).toBeGreaterThanOrEqual(5);
    expect(quiz16().length).toBeGreaterThanOrEqual(3);
  });
});
