import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion } from './regions';

const day22 = () => dataset.curriculumDays.find((d) => d.id === 'day_22')!;
const cards22 = () => dataset.flashcards.filter((f) => f.dayId === 'day_22');
const quiz22 = () => dataset.quizItems.filter((q) => q.dayId === 'day_22');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day22();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards22()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz22()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const loc = (id: string) => acupointById.get(id)?.location?.value.zhHant ?? '';

describe('day 22 — what may not appear', () => {
  it('carries no functional or sensory claim', () => {
    const banned = [
      '明目', '通鼻', '面癱', '牙痛', '耳鳴', '退翳', '主治', '療效', '要穴',
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

  it('gives no needling term or pressure instruction', () => {
    const blob = allText().join(' ');
    for (const w of ['針刺', '進針', '刺入', '艾灸', '力度', '避免壓迫', 'needle', 'moxa']) {
      expect(blob).not.toContain(w);
    }
  });

  it('says to look rather than press around the eye', () => {
    // 承泣 sits between the eyeball and the orbital rim. The lesson locates it
    // by sight; the draft asked for gentle pressure there.
    const blob = allText().join(' ');
    expect(blob).toContain('只看不按');
  });

  it('asks only for app features that exist', () => {
    const blob = allText().join(' ');
    for (const w of ['高亮模式', '眶緣高亮', '咬肌高亮', '骨骼透視', '動態張口']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 22 — what it claims about the body', () => {
  it('names all eight channels the region carries, not six', () => {
    const fromData = meridiansInRegion('face').map((m) => m.id);
    expect(fromData.length).toBe(8);
    expect([...day22().meridianIds].sort()).toEqual([...fromData].sort());
    // The draft's list omitted both midline vessels.
    expect(fromData).toContain('mer_cv');
    expect(fromData).toContain('mer_gv');
  });

  it('teaches the six midline points the draft left out', () => {
    const midline = pointsInRegion('face').filter(
      (p) => p.meridianId === 'mer_gv' || p.meridianId === 'mer_cv',
    );
    expect(midline.map((p) => p.code).sort()).toEqual([
      'CV24', 'GV25', 'GV26', 'GV27', 'GV28', 'GV29',
    ]);
    const blob = allText().join(' ');
    for (const code of ['GV29', 'GV25', 'GV26', 'GV27', 'GV28', 'CV24']) {
      expect({ code, named: blob.includes(code) }).toEqual({ code, named: true });
    }
  });

  it('puts 攢竹 at the supraorbital notch and 四白 at the infraorbital foramen', () => {
    expect(loc('pt_bl2')).toContain('眶上切跡');
    expect(loc('pt_bl2')).not.toContain('眶上孔');
    expect(loc('pt_st2')).toContain('眶下孔');
    const blob = allText().join(' ');
    expect(blob).toContain('眶上切跡');
    expect(blob).not.toContain('攢竹 BL2 在眉頭凹陷中、眶上孔');
  });

  it('locates 地倉 by the mouth and the pupil, not by the nasolabial groove', () => {
    expect(loc('pt_st4')).toContain('口角外側');
    expect(loc('pt_st4')).toContain('上直瞳孔');
    expect(loc('pt_st4')).not.toContain('鼻唇溝');
    // The groove belongs to these two.
    expect(loc('pt_li20')).toContain('鼻唇溝');
    expect(loc('pt_st3')).toContain('鼻唇溝');
  });

  it('asserts no distance between 承泣 and 四白', () => {
    // The draft said "about 0.5 寸 apart"; neither record states a gap.
    for (const id of ['pt_st1', 'pt_st2']) expect(loc(id)).not.toContain('0.5 寸');
    const blob = allText().join(' ');
    expect(blob).not.toContain('上下相鄰約 0.5 寸');
  });
});

describe('day 22 — the structure it teaches is the structure in the data', () => {
  it('finds four Stomach points on the vertical through the pupil', () => {
    const onPupil = pointsInRegion('face').filter((p) =>
      /瞳孔直下|上直瞳孔|直對瞳孔/.test(p.location?.value.zhHant ?? ''),
    );
    expect(onPupil.map((p) => p.code).sort()).toEqual(['ST1', 'ST2', 'ST3', 'ST4']);
    expect(new Set(onPupil.map((p) => p.meridianId))).toEqual(new Set(['mer_st']));
  });

  it('puts three channels on the tragus in a fixed order', () => {
    expect(loc('pt_te21')).toContain('耳屏上切跡');
    expect(loc('pt_si19')).toContain('耳屏正中');
    expect(loc('pt_gb2')).toContain('耳屏間切跡');
    expect(acupointById.get('pt_te21')!.meridianId).toBe('mer_te');
    expect(acupointById.get('pt_si19')!.meridianId).toBe('mer_si');
    expect(acupointById.get('pt_gb2')!.meridianId).toBe('mer_gb');
  });

  it('ends the Large Intestine channel at 迎香', () => {
    const li = dataset.acupoints
      .filter((p) => p.meridianId === 'mer_li')
      .sort((a, b) => a.ordinal - b.ordinal);
    expect(li[li.length - 1]!.code).toBe('LI20');
    // …and its first point is on the index finger, taught on Day 14.
    expect(li[0]!.code).toBe('LI1');
    const blob = allText().join(' ');
    expect(blob).toContain('商陽 LI1');
  });

  it('stays inside its own region', () => {
    const region = new Set(pointsInRegion('face').map((p) => p.id));
    const cited = new Set<string>();
    for (const f of cards22()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz22()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inRegion: region.has(id) }).toEqual({ id, inRegion: true });
    }
  });

  it('does not send its own points to spaced review', () => {
    const review = day22().sections.find((s) => s.id === 'sec_22_review')!;
    const blob = review.body.map((b) => `${b.zhHant} ${b.en}`).join(' ');
    // The draft reviewed 承泣/四白 as Day 20 (the knee), 瞳子髎/聽會 as Day 8 and
    // 攢竹 as Day 4 — all of them points of this region.
    for (const own of ['承泣', '四白', '瞳子髎', '聽會', '攢竹']) {
      expect({ own, inReview: blob.includes(own) }).toEqual({ own, inReview: false });
    }
  });
});

describe('day 22 — shape', () => {
  it('follows day 21 in the numbered curriculum', () => {
    expect(day22().dayNumber).toBe(22);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day22().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards22()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz22()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day22().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards22().length).toBeGreaterThanOrEqual(5);
    expect(quiz22().length).toBeGreaterThanOrEqual(3);
  });
});
