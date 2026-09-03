import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion, regionOfPoint } from './regions';

const day24 = () => dataset.curriculumDays.find((d) => d.id === 'day_24')!;
const cards24 = () => dataset.flashcards.filter((f) => f.dayId === 'day_24');
const quiz24 = () => dataset.quizItems.filter((q) => q.dayId === 'day_24');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day24();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards24()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz24()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const loc = (id: string) => acupointById.get(id)?.location?.value.zhHant ?? '';

describe('day 24 — what may not appear', () => {
  it('carries no pain, motor or efficacy claim', () => {
    const banned = ['主治', '療效', '痿痹', '坐骨神經', '腰腿痛', '止痛', '要穴', '禁針'];
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
    const blob = allText().join(' ');
    for (const w of ['高亮模式', '骨骼透視', '肌肉收縮動態', '動態視圖', '透視']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 24 — what it claims about the body', () => {
  it('uses 19 cun for the lateral thigh, not 14', () => {
    const blob = allText().join(' ');
    expect(blob).toContain('19 寸');
    // 14 belongs to the posterior segment and must be named as such.
    expect(blob).toContain('臀橫紋至膕橫紋 14 寸');
    expect(blob).not.toContain('股骨大轉子至膕橫紋 14 寸');
    // 風市's own record gives its distance from the popliteal crease, not a fraction.
    expect(loc('pt_gb31')).toContain('膕橫紋上 7 寸');
  });

  it('measures the medial thigh from the pubic symphysis', () => {
    const blob = allText().join(' ');
    expect(blob).toContain('恥骨聯合上緣至股骨內上髁上緣');
    expect(blob).not.toContain('髂前上棘至股骨內上髁');
  });

  it('locates 箕門 by the descriptor its record uses', () => {
    expect(loc('pt_sp11')).toContain('上 1/3 與下 2/3 交點');
    expect(loc('pt_sp11')).not.toContain('血海上 6 寸');
    const blob = allText().join(' ');
    expect(blob).not.toContain('血海上 6 寸');
  });

  it('leaves 急脈 to the region that holds it', () => {
    expect(regionOfPoint(acupointById.get('pt_lr12')!)?.key).toBe('abdomen_groin');
    const cited = new Set<string>();
    for (const f of cards24()) f.relatedAcupointIds.forEach((i) => cited.add(i));
    expect(cited.has('pt_lr12')).toBe(false);
  });

  it('includes the five points the draft omitted', () => {
    // 中瀆 GB32, 居髎 GB29 and all three Liver points are in this region.
    for (const id of ['pt_gb32', 'pt_gb29', 'pt_lr9', 'pt_lr10', 'pt_lr11']) {
      expect({ id, here: pointsInRegion('hip_thigh').some((p) => p.id === id) }).toEqual({
        id,
        here: true,
      });
    }
    const blob = allText().join(' ');
    for (const code of ['GB32', 'GB29', 'LR9', 'LR10', 'LR11']) {
      expect({ code, named: blob.includes(code) }).toEqual({ code, named: true });
    }
  });

  it('gives the Liver channel a representative that is actually here', () => {
    // The draft listed 肝經 but its only Liver point was 急脈, in another region.
    const liverHere = pointsInRegion('hip_thigh').filter((p) => p.meridianId === 'mer_lr');
    expect(liverHere.map((p) => p.code).sort()).toEqual(['LR10', 'LR11', 'LR9']);
  });
});

describe('day 24 — the structure it teaches is the structure in the data', () => {
  it('names all five channels the region carries', () => {
    const fromData = meridiansInRegion('hip_thigh').map((m) => m.id);
    expect(fromData.length).toBe(5);
    expect([...day24().meridianIds].sort()).toEqual([...fromData].sort());
  });

  it('puts all four Stomach points on one line, at 2, 3 and 6 cun', () => {
    const st = pointsInRegion('hip_thigh')
      .filter((p) => p.meridianId === 'mer_st')
      .sort((a, b) => a.ordinal - b.ordinal);
    expect(st.map((p) => p.code)).toEqual(['ST31', 'ST32', 'ST33', 'ST34']);
    for (const p of st) {
      expect({ code: p.code, online: /髂前上棘與髕底外側端連線上/.test(loc(p.id)) }).toEqual({
        code: p.code,
        online: true,
      });
    }
    expect(loc('pt_st34')).toContain('髕底上 2 寸');
    expect(loc('pt_st33')).toContain('髕底上 3 寸');
    expect(loc('pt_st32')).toContain('髕底上 6 寸');
  });

  it('divides the region into four faces, one channel group each', () => {
    const here = pointsInRegion('hip_thigh');
    const by = (m: string) => here.filter((p) => p.meridianId === m).length;
    expect(by('mer_st')).toBe(4); // front
    expect(by('mer_gb')).toBe(4); // outside, counting 居髎 at the hip
    expect(by('mer_lr') + by('mer_sp')).toBe(5); // inside
    expect(by('mer_bl')).toBe(2); // back
    expect(here.length).toBe(15);
  });

  it('stays inside its own region', () => {
    const region = new Set(pointsInRegion('hip_thigh').map((p) => p.id));
    // 急脈 appears only as the odd-one-out answer in a quiz.
    const allowed = new Set([...region, 'pt_lr12']);
    const cited = new Set<string>();
    for (const f of cards24()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz24()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: allowed.has(id) }).toEqual({ id, inScope: true });
    }
  });

  it('does not send its own points to spaced review', () => {
    const review = day24().sections.find((s) => s.id === 'sec_24_review')!;
    const blob = review.body.map((b) => `${b.zhHant} ${b.en}`).join(' ');
    // The draft reviewed 環跳/居髎 as Day 22 (the face), 承扶/殷門 as Day 20 and
    // 血海/箕門 as Day 19 — all of them points of this region.
    for (const own of ['環跳', '承扶', '殷門', '血海', '伏兔', '風市']) {
      expect({ own, inReview: blob.includes(own) }).toEqual({ own, inReview: false });
    }
  });
});

describe('day 24 — shape', () => {
  it('follows day 23 in the numbered curriculum', () => {
    expect(day24().dayNumber).toBe(24);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day24().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards24()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz24()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day24().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards24().length).toBeGreaterThanOrEqual(5);
    expect(quiz24().length).toBeGreaterThanOrEqual(3);
  });
});
