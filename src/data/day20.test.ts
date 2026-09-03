import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion, regionOfPoint } from './regions';

const day20 = () => dataset.curriculumDays.find((d) => d.id === 'day_20')!;
const cards20 = () => dataset.flashcards.filter((f) => f.dayId === 'day_20');
const quiz20 = () => dataset.quizItems.filter((q) => q.dayId === 'day_20');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day20();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards20()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz20()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const cls = (id: string) => acupointById.get(id)?.classifications?.value ?? [];

/**
 * Day 20's compliance contract.
 *
 * This region is the one most saturated with pain language in the source
 * literature — 「腰背委中求」 is a couplet every student meets — so the guard
 * is wider here than on other days.
 */
describe('day 20 — what may not appear', () => {
  it('carries no pain, neurological or motor claim', () => {
    const banned = [
      '腰痛', '背痛', '腰背', '坐骨神經', '痿痹', '抽筋', '痙攣',
      '主治', '療效', '止痛', '要穴',
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

  it('keeps 筋會 and 髓會 as titles, with no functional explanation', () => {
    const blob = allText().join(' ');
    // The classifications may be named; what they are said to DO may not.
    expect(blob).toContain('筋會');
    expect(blob).toContain('髓會');
    for (const w of ['濡養', '滋養', '主筋', '強筋']) {
      expect(blob).not.toContain(w);
    }
  });

  it('gives no needling term or bloodletting reference', () => {
    const blob = allText().join(' ');
    for (const w of ['放血', '針刺', '進針', '刺入', '艾灸', 'needle', 'moxa', 'bleed']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    // The draft called for tendon and muscle rendering, a fibular-head
    // highlight, a 「肌肉透明」 mode and a 3D model — none of which exist, the
    // last deferred by agreement.
    const blob = allText().join(' ');
    for (const w of ['肌肉透明', '骨骼透視', '高亮模式', '3D', '透視']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 20 — what it claims about the body', () => {
  it('names all six channels the region carries, not four', () => {
    const fromData = meridiansInRegion('knee_lower_leg').map((m) => m.id);
    expect(fromData.length).toBe(6);
    expect([...day20().meridianIds].sort()).toEqual([...fromData].sort());
    // The draft's list omitted these two.
    expect(fromData).toContain('mer_ki');
    expect(fromData).toContain('mer_lr');
  });

  it('leaves out the three points the draft borrowed from other regions', () => {
    for (const [id, home] of [
      ['pt_gb31', 'hip_thigh'],
      ['pt_bl60', 'ankle_foot'],
      ['pt_ki3', 'ankle_foot'],
    ] as const) {
      expect({ id, region: regionOfPoint(acupointById.get(id)!)?.key }).toEqual({ id, region: home });
    }
    const cited = new Set<string>();
    for (const f of cards20()) f.relatedAcupointIds.forEach((i) => cited.add(i));
    for (const id of ['pt_gb31', 'pt_bl60', 'pt_ki3']) expect(cited.has(id)).toBe(false);
  });

  it('does not file its own points as spaced review', () => {
    const review = day20().sections.find((s) => s.id === 'sec_20_review')!;
    const blob = review.body.map((b) => `${b.zhHant} ${b.en}`).join(' ');
    // The draft sent 足三里, 豐隆, 陰陵泉, 地機, 懸鐘, 陽陵泉, 委中 and 承山 to
    // review — every one of them a point of this region.
    for (const own of ['足三里', '豐隆', '陰陵泉', '地機', '懸鐘', '陽陵泉', '委中', '承山']) {
      expect({ own, inReview: blob.includes(own) }).toEqual({ own, inReview: false });
    }
  });

  it('locates 承筋 by the descriptor its record uses', () => {
    expect(acupointById.get('pt_bl56')!.location?.value.zhHant).toContain('委中下 5 寸');
    expect(allText().join(' ')).toContain('委中下 5 寸');
  });
});

describe('day 20 — the structure it teaches is the structure in the data', () => {
  it('holds every lower he-sea point in the dataset', () => {
    const all = dataset.acupoints.filter((p) => cls(p.id).includes('lower_he_sea'));
    expect(all.length).toBe(6);
    const here = pointsInRegion('knee_lower_leg').filter((p) => cls(p.id).includes('lower_he_sea'));
    expect(here.length).toBe(6);
    expect(here.map((p) => p.code).sort()).toEqual([
      'BL39', 'BL40', 'GB34', 'ST36', 'ST37', 'ST39',
    ]);
  });

  it('puts three of them on one channel, which is the trap', () => {
    const onStomach = pointsInRegion('knee_lower_leg').filter(
      (p) => cls(p.id).includes('lower_he_sea') && p.meridianId === 'mer_st',
    );
    expect(onStomach.map((p) => p.code).sort()).toEqual(['ST36', 'ST37', 'ST39']);
    const blob = allText().join(' ');
    for (const code of ['ST36', 'ST37', 'ST39']) {
      expect({ code, named: blob.includes(code) }).toEqual({ code, named: true });
    }
  });

  it('holds one he-sea point for each of the six leg channels', () => {
    const he = pointsInRegion('knee_lower_leg').filter((p) => cls(p.id).includes('he_sea'));
    expect(he.map((p) => p.code).sort()).toEqual(['BL40', 'GB34', 'KI10', 'LR8', 'SP9', 'ST36']);
    expect(new Set(he.map((p) => p.meridianId)).size).toBe(6);
  });

  it('holds two of the eight influential points, both on the fibula', () => {
    const eight = pointsInRegion('knee_lower_leg').filter((p) =>
      cls(p.id).includes('influential_meeting'),
    );
    expect(eight.map((p) => p.code).sort()).toEqual(['GB34', 'GB39']);
    for (const id of ['pt_gb34', 'pt_gb39']) {
      expect(acupointById.get(id)!.location?.value.zhHant).toContain('腓骨');
    }
  });

  it('stays inside its own region, bar the points named by way of contrast', () => {
    const region = new Set(pointsInRegion('knee_lower_leg').map((p) => p.id));
    // 崑崙 as the odd-one-out answer, 太淵 for the eight-influential contrast.
    const allowed = new Set([...region, 'pt_bl60', 'pt_lu9']);
    const cited = new Set<string>();
    for (const f of cards20()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz20()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: allowed.has(id) }).toEqual({ id, inScope: true });
    }
  });
});

describe('day 20 — shape', () => {
  it('follows day 19 in the numbered curriculum', () => {
    expect(day20().dayNumber).toBe(20);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day20().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards20()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz20()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day20().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards20().length).toBeGreaterThanOrEqual(5);
    expect(quiz20().length).toBeGreaterThanOrEqual(3);
  });
});
