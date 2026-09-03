import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion, regionOfPoint } from './regions';

const day23 = () => dataset.curriculumDays.find((d) => d.id === 'day_23')!;
const cards23 = () => dataset.flashcards.filter((f) => f.dayId === 'day_23');
const quiz23 = () => dataset.quizItems.filter((q) => q.dayId === 'day_23');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day23();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards23()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz23()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const loc = (id: string) => acupointById.get(id)?.location?.value.zhHant ?? '';

describe('day 23 — what may not appear', () => {
  it('carries no functional claim', () => {
    const banned = ['主治', '療效', '降壓', '急救', '通耳', '利咽', '要穴', '禁針'];
    for (const text of allText()) {
      for (const word of banned) {
        const excusing = /未收錄|NOT INGESTED/i.test(text);
        if (text.includes(word) && !excusing) {
          expect({ word, text: text.slice(0, 80) }).toEqual({ word, text: 'NOT PRESENT' });
        }
      }
    }
  });

  it('states the carotid as anatomy, not as a handling instruction', () => {
    const blob = allText().join(' ');
    // The record itself says 人迎 lies where the artery pulses. What may not
    // follow is how hard to press — the same split made for 肩井 on Day 16.
    expect(blob).toContain('頸總動脈');
    for (const w of ['避免按壓', '力度', '輕觸體表', '針刺', '艾灸', 'needle']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    const blob = allText().join(' ');
    for (const w of ['高亮模式', '舌骨體高亮', '肌束高亮', '骨骼透視', '動態轉頭']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 23 — what it claims about the body', () => {
  it('uses the right code for each Small Intestine point', () => {
    // The draft called 天窗 SI15 and 天容 SI16; both are one out.
    expect(acupointById.get('pt_si16')!.nameZhHant).toBe('天窗');
    expect(acupointById.get('pt_si17')!.nameZhHant).toBe('天容');
    // SI15 is not even in this region.
    expect(acupointById.get('pt_si15')!.nameZhHant).toBe('肩中俞');
    expect(regionOfPoint(acupointById.get('pt_si15')!)?.key).toBe('back_glute');
    const blob = allText().join(' ');
    expect(blob).toContain('天窗 SI16');
    expect(blob).toContain('天容 SI17');
  });

  it('puts 扶突 on the anterior border, as its record does', () => {
    expect(loc('pt_li18')).toContain('胸鎖乳突肌前緣');
    expect(loc('pt_li18')).not.toContain('後緣');
    // No cun figure is attached to it either.
    expect(loc('pt_li18')).not.toContain('3 寸');
    const blob = allText().join(' ');
    expect(blob).not.toContain('喉結旁開 3 寸');
  });

  it('names all five channels the region carries, and no others', () => {
    const fromData = meridiansInRegion('neck').map((m) => m.id);
    expect([...fromData].sort()).toEqual(['mer_cv', 'mer_li', 'mer_si', 'mer_st', 'mer_te']);
    expect([...day23().meridianIds].sort()).toEqual([...fromData].sort());
    // The draft named these two, which the region does not carry…
    expect(fromData).not.toContain('mer_gb');
    expect(fromData).not.toContain('mer_bl');
    // …while omitting this one, whose points it nonetheless listed.
    expect(fromData).toContain('mer_si');
  });

  it('leaves 翳風 and 風池 to the regions that hold them', () => {
    expect(regionOfPoint(acupointById.get('pt_te17')!)?.key).toBe('face');
    expect(regionOfPoint(acupointById.get('pt_gb20')!)?.key).toBe('head');
    const cited = new Set<string>();
    for (const f of cards23()) f.relatedAcupointIds.forEach((i) => cited.add(i));
    for (const id of ['pt_te17', 'pt_gb20']) expect(cited.has(id)).toBe(false);
  });

  it('includes 天鼎 LI17, which the draft omitted', () => {
    expect(pointsInRegion('neck').some((p) => p.id === 'pt_li17')).toBe(true);
    expect(allText().join(' ')).toContain('天鼎 LI17');
  });

  it('asserts no bone-cun figure this region does not anchor', () => {
    const blob = allText().join(' ');
    // 「前髮際至胸骨上窩 = 12 寸」 and 「喉結至胸骨上窩 = 3 寸」 are anchored nowhere.
    expect(blob).not.toContain('前髮際至胸骨上窩');
    expect(blob).not.toContain('喉結至胸骨上窩');
  });
});

describe('day 23 — the structure it teaches is the structure in the data', () => {
  it('hangs eight of ten points off one muscle', () => {
    const here = pointsInRegion('neck');
    expect(here.length).toBe(10);
    const onMuscle = here.filter((p) => /胸鎖乳突肌/.test(p.location?.value.zhHant ?? ''));
    expect(onMuscle.length).toBe(8);
    // The two that are not are the midline pair.
    const rest = here.filter((p) => !onMuscle.includes(p));
    expect(rest.map((p) => p.code).sort()).toEqual(['CV22', 'CV23']);
  });

  it('splits those eight into a front edge, a back edge and one fork', () => {
    const at = (re: RegExp) =>
      pointsInRegion('neck')
        .filter((p) => re.test(p.location?.value.zhHant ?? ''))
        .map((p) => p.code)
        .sort();
    expect(at(/胸鎖乳突肌前緣|胸鎖乳突肌的前緣/)).toEqual(['LI18', 'SI17', 'ST10', 'ST9']);
    expect(at(/胸鎖乳突肌後緣|胸鎖乳突肌的後緣/)).toEqual(['LI17', 'SI16', 'TE16']);
    // 氣舍 sits between the muscle's two heads, on neither edge.
    expect(loc('pt_st11')).toContain('胸骨頭與鎖骨頭之間');
  });

  it('puts three points on the laryngeal level, two in front and one behind', () => {
    for (const id of ['pt_li18', 'pt_st9', 'pt_si16']) {
      expect({ id, level: /橫平喉結/.test(loc(id)) }).toEqual({ id, level: true });
    }
    expect(loc('pt_si16')).toContain('後緣');
  });

  it('stays inside its own region', () => {
    const region = new Set(pointsInRegion('neck').map((p) => p.id));
    // 風池 appears only as the odd-one-out answer in a quiz.
    const allowed = new Set([...region, 'pt_gb20']);
    const cited = new Set<string>();
    for (const f of cards23()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz23()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: allowed.has(id) }).toEqual({ id, inScope: true });
    }
  });

  it('does not send its own points to spaced review', () => {
    const review = day23().sections.find((s) => s.id === 'sec_23_review')!;
    const blob = review.body.map((b) => `${b.zhHant} ${b.en}`).join(' ');
    // The draft reviewed 天突 as Day 18, 人迎/水突 as Day 8 and 扶突 as Day 4.
    for (const own of ['人迎', '水突', '扶突', '廉泉', '氣舍']) {
      expect({ own, inReview: blob.includes(own) }).toEqual({ own, inReview: false });
    }
  });
});

describe('day 23 — shape', () => {
  it('follows day 22 in the numbered curriculum', () => {
    expect(day23().dayNumber).toBe(23);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day23().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards23()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz23()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day23().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards23().length).toBeGreaterThanOrEqual(5);
    expect(quiz23().length).toBeGreaterThanOrEqual(3);
  });
});
