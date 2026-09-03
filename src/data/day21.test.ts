import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion, regionOfPoint } from './regions';

const day21 = () => dataset.curriculumDays.find((d) => d.id === 'day_21')!;
const cards21 = () => dataset.flashcards.filter((f) => f.dayId === 'day_21');
const quiz21 = () => dataset.quizItems.filter((q) => q.dayId === 'day_21');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day21();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards21()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz21()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const cls = (id: string) => acupointById.get(id)?.classifications?.value ?? [];

describe('day 21 — what may not appear', () => {
  it('carries no functional or sensory claim', () => {
    const banned = [
      '頭痛', '眩暈', '通鼻', '明目', '祛風', '醒腦', '降壓', '急救',
      '主治', '療效', '安神', '益智', '要穴',
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

  it('gives no needling term or handling instruction', () => {
    const blob = allText().join(' ');
    for (const w of ['針刺', '進針', '刺入', '艾灸', '避免按壓', '力度', 'needle', 'moxa']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    // The draft called for per-sub-segment default zooms, bony-landmark
    // pre-highlighting, a translucent carotid overlay and a 骨骼透視 mode.
    const blob = allText().join(' ');
    for (const w of ['骨骼透視', '透視模式', '高亮模式', '半透明', '疊層']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 21 — what it claims about the body', () => {
  it('cites no point this dataset does not load', () => {
    // 四神聰 EX-HN1 was a core point in the draft and 太陽 EX-HN5 a landmark.
    // This dataset holds the 362 points of the fourteen channels, no 經外奇穴.
    for (const code of ['EX-HN1', 'EX-HN5']) {
      expect(dataset.acupoints.some((p) => p.code === code)).toBe(false);
    }
    const blob = allText().join(' ');
    for (const name of ['四神聰', '太陽穴', 'EX-HN']) {
      expect(blob).not.toContain(name);
    }
  });

  it('puts the Gallbladder scalp line at 2.25 cun, not 3', () => {
    for (const id of ['pt_gb16', 'pt_gb17', 'pt_gb18', 'pt_gb19']) {
      expect(acupointById.get(id)!.location?.value.zhHant).toContain('2.25 寸');
    }
    // Three cun belongs to 本神 alone.
    expect(acupointById.get('pt_gb13')!.location?.value.zhHant).toContain('旁開 3 寸');
    const blob = allText().join(' ');
    expect(blob).toContain('2.25');
    // 「膽三寸」 is quoted in order to be corrected, so it is allowed only in a
    // passage that also says so — the same allowance the excluded claims get.
    for (const text of allText()) {
      if (!text.includes('膽三寸')) continue;
      expect({ quoted: true, corrected: /不成立|最常見的錯|不是/.test(text) }).toEqual({
        quoted: true,
        corrected: true,
      });
    }
  });

  it('keeps the Bladder line at 1.5 cun and 頭維 at 4.5', () => {
    for (const id of ['pt_bl4', 'pt_bl5', 'pt_bl6', 'pt_bl7', 'pt_bl8']) {
      expect(acupointById.get(id)!.location?.value.zhHant).toContain('1.5 寸');
    }
    expect(acupointById.get('pt_st8')!.location?.value.zhHant).toContain('4.5 寸');
  });

  it('holds the head’s own points and leaves the face and neck to their days', () => {
    for (const [id, home] of [
      ['pt_gv29', 'face'],
      ['pt_li20', 'face'],
      ['pt_si19', 'face'],
      ['pt_st9', 'neck'],
      ['pt_cv22', 'neck'],
    ] as const) {
      expect({ id, region: regionOfPoint(acupointById.get(id)!)?.key }).toEqual({ id, region: home });
    }
    const cited = new Set<string>();
    for (const f of cards21()) f.relatedAcupointIds.forEach((i) => cited.add(i));
    for (const q of quiz21()) {
      q.relatedAcupointIds.forEach((i) => cited.add(i));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    const region = new Set(pointsInRegion('head').map((p) => p.id));
    for (const id of cited) {
      expect({ id, inRegion: region.has(id) }).toEqual({ id, inRegion: true });
    }
  });

  it('does not send its own points, or untaught ones, to spaced review', () => {
    const review = day21().sections.find((s) => s.id === 'sec_21_review')!;
    const blob = review.body.map((b) => `${b.zhHant} ${b.en}`).join(' ');
    // The draft reviewed 風府/啞門 as Day 18 (the abdomen), 瞳子髎/聽會 as Day 19
    // (the flank) and 人迎/水突 as Day 20 (the knee).
    for (const own of ['風府', '啞門', '瞳子髎', '聽會', '人迎', '水突']) {
      expect({ own, inReview: blob.includes(own) }).toEqual({ own, inReview: false });
    }
  });
});

describe('day 21 — the structure it teaches is the structure in the data', () => {
  it('names all five channels the region carries', () => {
    const fromData = meridiansInRegion('head').map((m) => m.id);
    expect(fromData.length).toBe(5);
    expect([...day21().meridianIds].sort()).toEqual([...fromData].sort());
  });

  it('finds four distinct lateral lines across the scalp', () => {
    const at = (cun: string) =>
      pointsInRegion('head').filter((p) =>
        new RegExp(`旁開\\s*${cun.replace('.', '\\.')}\\s*寸`).test(p.location?.value.zhHant ?? ''),
      );
    expect(at('1.5').map((p) => p.meridianId)).toEqual(Array(5).fill('mer_bl'));
    expect(at('2.25').map((p) => p.meridianId)).toEqual(Array(4).fill('mer_gb'));
    expect(at('3').map((p) => p.code)).toEqual(['GB13']);
    expect(at('4.5').map((p) => p.code)).toEqual(['ST8']);
  });

  it('runs the midline from the front hairline over the crown to the occiput', () => {
    expect(acupointById.get('pt_gv24')!.location?.value.zhHant).toContain('直上 0.5 寸');
    expect(acupointById.get('pt_gv23')!.location?.value.zhHant).toContain('直上 1 寸');
    expect(acupointById.get('pt_gv20')!.location?.value.zhHant).toContain('直上 5 寸');
    expect(acupointById.get('pt_gv16')!.location?.value.zhHant).toContain('枕外隆凸');
  });

  it('is mostly crossing points, which is what the head is', () => {
    const here = pointsInRegion('head');
    const crossing = here.filter((p) => cls(p.id).includes('crossing'));
    expect(crossing.length).toBe(21);
    expect(crossing.length * 2).toBeGreaterThan(here.length);
  });
});

describe('day 21 — shape', () => {
  it('follows day 20 in the numbered curriculum', () => {
    expect(day21().dayNumber).toBe(21);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day21().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards21()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz21()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day21().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards21().length).toBeGreaterThanOrEqual(5);
    expect(quiz21().length).toBeGreaterThanOrEqual(3);
  });
});
