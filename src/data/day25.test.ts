import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion, regionOfPoint } from './regions';

const day25 = () => dataset.curriculumDays.find((d) => d.id === 'day_25')!;
const cards25 = () => dataset.flashcards.filter((f) => f.dayId === 'day_25');
const quiz25 = () => dataset.quizItems.filter((q) => q.dayId === 'day_25');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day25();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards25()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz25()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const cls = (id: string) => acupointById.get(id)?.classifications?.value ?? [];
const loc = (id: string) => acupointById.get(id)?.location?.value.zhHant ?? '';

describe('day 25 — what may not appear', () => {
  it('carries no efficacy or functional claim', () => {
    const banned = ['主治', '療效', '止痛', '要穴', '禁針', '急救'];
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
    for (const w of ['針刺', '進針', '刺入', '艾灸', '力度', '避免按壓', 'needle', 'moxa']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    const blob = allText().join(' ');
    for (const w of ['高亮模式', '骨骼透視', '足趾屈伸動態', '動態視圖', '透視']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 25 — what it claims about the body', () => {
  it('leaves 三陰交 to the region that holds it', () => {
    expect(regionOfPoint(acupointById.get('pt_sp6')!)?.key).toBe('knee_lower_leg');
    expect(loc('pt_sp6')).toContain('內踝');
    const cited = new Set<string>();
    for (const f of cards25()) f.relatedAcupointIds.forEach((i) => cited.add(i));
    expect(cited.has('pt_sp6')).toBe(false);
  });

  it('does not attribute the lower leg’s rulers to the foot', () => {
    const blob = allText().join(' ');
    // 13 and 16 cun are lower-leg segments; a 4-cun foot length is anchored
    // nowhere. The first is quoted once, in a quiz that asks whether it is
    // true — allowed only where the passage also says it is not.
    for (const text of allText()) {
      if (!text.includes('內踝尖至足底')) continue;
      expect({ quoted: true, refuted: /不對|小腿的尺|沒有自己/.test(text) }).toEqual({
        quoted: true,
        refuted: true,
      });
    }
    expect(blob).not.toContain('外踝尖至足底');
    expect(blob).not.toContain('趾端至踝橫紋 = 4 寸');
    // The lesson says so explicitly rather than staying silent.
    expect(blob).toContain('沒有自己的量尺');
  });

  it('does not rank 至陰 as the most distal point on the leg', () => {
    const blob = allText().join(' ');
    expect(blob).not.toContain('最遠端');
    // Nothing in the records ranks it against the other toe-nail points.
    for (const id of ['pt_bl67', 'pt_st45', 'pt_gb44']) {
      expect({ id, nail: /趾甲/.test(loc(id)) }).toEqual({ id, nail: true });
    }
  });

  it('does not send its own points, or Day 24’s, to spaced review', () => {
    const review = day25().sections.find((s) => s.id === 'sec_25_review')!;
    const blob = review.body.map((b) => `${b.zhHant} ${b.en}`).join(' ');
    // The draft reviewed 環跳/風市 and 血海/箕門 (Day 24's) and 太衝/行間 and
    // 湧泉 (today's).
    for (const own of ['環跳', '風市', '血海', '箕門', '太衝', '行間', '湧泉']) {
      expect({ own, inReview: blob.includes(own) }).toEqual({ own, inReview: false });
    }
  });
});

describe('day 25 — the structure it teaches is the structure in the data', () => {
  it('holds one jing-well point for each of the six leg channels', () => {
    const here = pointsInRegion('ankle_foot').filter((p) => cls(p.id).includes('jing_well'));
    expect(here.map((p) => p.code).sort()).toEqual([
      'BL67', 'GB44', 'KI1', 'LR1', 'SP1', 'ST45',
    ]);
    expect(new Set(here.map((p) => p.meridianId)).size).toBe(6);
  });

  it('holds one yuan-source point for each of the six leg channels', () => {
    const here = pointsInRegion('ankle_foot').filter((p) => cls(p.id).includes('yuan_source'));
    expect(here.map((p) => p.code).sort()).toEqual([
      'BL64', 'GB40', 'KI3', 'LR3', 'SP3', 'ST42',
    ]);
    expect(new Set(here.map((p) => p.meridianId)).size).toBe(6);
  });

  it('puts five jing-well points at nail corners and 湧泉 on the sole', () => {
    for (const id of ['pt_sp1', 'pt_lr1', 'pt_st45', 'pt_gb44', 'pt_bl67']) {
      expect({ id, nail: /趾甲/.test(loc(id)) }).toEqual({ id, nail: true });
    }
    expect(loc('pt_ki1')).toContain('足底');
    expect(/趾甲/.test(loc('pt_ki1'))).toBe(false);
  });

  it('gives the great toe two jing-well points, one per side', () => {
    expect(loc('pt_sp1')).toContain('內側');
    expect(loc('pt_lr1')).toContain('外側');
    expect(acupointById.get('pt_sp1')!.meridianId).toBe('mer_sp');
    expect(acupointById.get('pt_lr1')!.meridianId).toBe('mer_lr');
    // The same shape as the little finger, taught on Day 14.
    expect(loc('pt_ht9')).toContain('橈側');
    expect(loc('pt_si1')).toContain('尺側');
  });

  it('puts a point on each side of the Achilles tendon', () => {
    expect(loc('pt_ki3')).toContain('跟腱');
    expect(loc('pt_bl60')).toContain('跟腱');
    expect(cls('pt_ki3')).toContain('yuan_source');
    expect(cls('pt_bl60')).toContain('jing_river');
  });

  it('names all six channels the region carries', () => {
    const fromData = meridiansInRegion('ankle_foot').map((m) => m.id);
    expect(fromData.length).toBe(6);
    expect([...day25().meridianIds].sort()).toEqual([...fromData].sort());
  });

  it('stays inside its own region', () => {
    const region = new Set(pointsInRegion('ankle_foot').map((p) => p.id));
    // 三陰交 appears only as a quiz answer about which region owns it.
    const allowed = new Set([...region, 'pt_sp6']);
    const cited = new Set<string>();
    for (const f of cards25()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz25()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: allowed.has(id) }).toEqual({ id, inScope: true });
    }
  });
});

describe('day 25 — shape', () => {
  it('follows day 24 in the numbered curriculum', () => {
    expect(day25().dayNumber).toBe(25);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day25().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards25()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz25()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day25().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards25().length).toBeGreaterThanOrEqual(5);
    expect(quiz25().length).toBeGreaterThanOrEqual(3);
  });
});
