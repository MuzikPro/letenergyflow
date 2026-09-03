import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion } from './regions';
import { ATLAS_WIDTH, denorm } from './atlas';

const day18 = () => dataset.curriculumDays.find((d) => d.id === 'day_18')!;
const cards18 = () => dataset.flashcards.filter((f) => f.dayId === 'day_18');
const quiz18 = () => dataset.quizItems.filter((q) => q.dayId === 'day_18');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day18();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards18()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz18()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const cls = (id: string) => acupointById.get(id)?.classifications?.value ?? [];
const at = (id: string) => {
  const pl = acupointById.get(id)!.placements.find((p) => p.view === 'front')!;
  return denorm(pl.x, pl.y);
};
const MIDLINE = ATLAS_WIDTH / 2;
/** Lateral distance in cun, scaled off 天樞 ST25, whose record states 2 寸. */
const CUN_ACROSS_ABDOMEN = Math.abs(at('pt_st25').x - MIDLINE) / 2;
const lateralCun = (id: string) => Math.abs(at(id).x - MIDLINE) / CUN_ACROSS_ABDOMEN;

describe('day 18 — what may not appear', () => {
  it('carries no symptom→point mapping or efficacy claim', () => {
    const banned = ['主治', '療效', '調理', '溫陽', '止咳', '調經', '利水', '要穴', '禁針'];
    for (const text of allText()) {
      for (const word of banned) {
        const excusing = /未收錄|NOT INGESTED/i.test(text);
        if (text.includes(word) && !excusing) {
          expect({ word, text: text.slice(0, 80) }).toEqual({ word, text: 'NOT PRESENT' });
        }
      }
    }
  });

  it('states the groin vessels as anatomy, not as a handling instruction', () => {
    // 衝門 and 急脈 both sit at a pulse. The records say so; how hard to press
    // is technique, and was removed exactly as 肩井's caution was on Day 16.
    const blob = allText().join(' ');
    expect(blob).toContain('動脈');
    for (const w of ['避免按壓', '力度', '輕觸體表', '不針', '艾灸', 'needle']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    const blob = allText().join(' ');
    for (const w of ['肋弓高亮', '高亮模式', '顯示前正中線', '骨骼透視', '骨度尺']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 18 — what it claims about the body', () => {
  it('puts 商曲 KI17 one cun above the navel, not two', () => {
    expect(acupointById.get('pt_ki17')!.location?.value.zhHant).toContain('臍中上 1 寸');
    // Two cun above is the next station up.
    expect(acupointById.get('pt_ki18')!.location?.value.zhHant).toContain('臍中上 2 寸');
    const blob = allText().join(' ');
    expect(blob).not.toContain('商曲KI17，臍上2寸');
  });

  it('keeps 日月 above the costal arch and 章門 on it', () => {
    expect(acupointById.get('pt_gb24')!.location?.value.zhHant).toContain('第七肋間隙');
    const zhangmen = acupointById.get('pt_lr13')!;
    expect(zhangmen.location?.value.zhHant).toContain('肋弓下緣');
    // …and 章門 is not this region's to teach.
    expect(pointsInRegion('abdomen_groin').some((p) => p.id === 'pt_lr13')).toBe(false);
    const blob = allText().join(' ');
    expect(blob).toContain('章門 LR13');
  });

  it('names all six channels the region carries, not five', () => {
    const fromData = meridiansInRegion('abdomen_groin').map((m) => m.id);
    expect(fromData.length).toBe(6);
    expect([...day18().meridianIds].sort()).toEqual([...fromData].sort());
    // The draft's list omitted the Liver, which 急脈 LR12 puts here.
    expect(fromData).toContain('mer_lr');
    expect(pointsInRegion('abdomen_groin').some((p) => p.id === 'pt_lr12')).toBe(true);
  });

  it('claims no rectus abdominis border, because no record states one', () => {
    const anyRectus = dataset.acupoints.filter((p) =>
      (p.location?.value.zhHant ?? '').includes('腹直肌'),
    );
    expect(anyRectus).toEqual([]);
    const blob = allText().join(' ');
    expect(blob).not.toContain('腹直肌');
  });

  it('uses only the two abdominal bone-cun segments the dataset anchors', () => {
    // 胸劍聯合→臍 = 8, 臍→恥骨聯合上緣 = 5. A 「肋弓下緣 = 臍上 7 寸」 figure
    // appeared in the draft and is anchored nowhere.
    const blob = allText().join(' ');
    expect(blob).toContain('8 寸');
    expect(blob).toContain('5 寸');
    expect(blob).not.toContain('臍上 7 寸');
  });

  it('draws the three abdominal lines where it says they are', () => {
    const ladder: [string, number][] = [
      ['pt_cv8', 0],
      ['pt_ki16', 0.5],
      ['pt_st25', 2],
      ['pt_sp15', 4],
    ];
    for (const [id, cun] of ladder) {
      expect({ id, cun: Number(lateralCun(id).toFixed(2)) }).toEqual({ id, cun });
    }
    // …and all four sit on one horizontal, level with the navel.
    const y = at('pt_cv8').y;
    for (const [id] of ladder) expect(at(id).y).toBeCloseTo(y, 1);
  });
});

describe('day 18 — the structure it teaches is the structure in the data', () => {
  it('finds the three columns at 0.5, 2 and 4 cun', () => {
    const on = (cun: string) =>
      pointsInRegion('abdomen_groin').filter((p) =>
        new RegExp(`旁開 ${cun} 寸|距臍中 ${cun} 寸|距前正中線 ${cun} 寸`).test(
          p.location?.value.zhHant ?? '',
        ),
      );
    // The Kidney's eleven stations are the ruler Day 6 taught.
    expect(on('0.5').map((p) => p.meridianId)).toEqual(Array(11).fill('mer_ki'));
    expect(on('2').filter((p) => p.meridianId === 'mer_st').length).toBe(12);
    expect(on('4').filter((p) => p.meridianId === 'mer_sp').length).toBeGreaterThanOrEqual(4);
  });

  it('holds more than half the dataset’s front-mu points', () => {
    const all = dataset.acupoints.filter((p) => cls(p.id).includes('front_mu'));
    const here = pointsInRegion('abdomen_groin').filter((p) => cls(p.id).includes('front_mu'));
    expect(all.length).toBe(12);
    expect(here.map((p) => p.code).sort()).toEqual([
      'CV12', 'CV14', 'CV3', 'CV4', 'CV5', 'GB24', 'ST25',
    ]);
    expect(here.length * 2).toBeGreaterThan(all.length);
  });

  it('names the five midline front-mu points in the lesson', () => {
    const blob = allText().join(' ');
    for (const code of ['CV14', 'CV12', 'CV5', 'CV4', 'CV3']) {
      expect({ code, named: blob.includes(code) }).toEqual({ code, named: true });
    }
  });

  it('stays inside its own region', () => {
    const region = new Set(pointsInRegion('abdomen_groin').map((p) => p.id));
    // 章門 LR13 is named to say where the arch is and that it belongs to Day 22;
    // 神封 KI23 is named for the 2-cun contrast with the chest.
    const allowed = new Set([...region, 'pt_lr13', 'pt_ki23']);
    const cited = new Set<string>();
    for (const f of cards18()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz18()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: allowed.has(id) }).toEqual({ id, inScope: true });
    }
  });
});

describe('day 18 — shape', () => {
  it('follows day 17 in the numbered curriculum', () => {
    expect(day18().dayNumber).toBe(18);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day18().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards18()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz18()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day18().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards18().length).toBeGreaterThanOrEqual(5);
    expect(quiz18().length).toBeGreaterThanOrEqual(3);
  });
});
