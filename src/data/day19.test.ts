import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion, regionOfPoint } from './regions';

const day19 = () => dataset.curriculumDays.find((d) => d.id === 'day_19')!;
const cards19 = () => dataset.flashcards.filter((f) => f.dayId === 'day_19');
const quiz19 = () => dataset.quizItems.filter((q) => q.dayId === 'day_19');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day19();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards19()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz19()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const cls = (id: string) => acupointById.get(id)?.classifications?.value ?? [];

describe('day 19 — what may not appear', () => {
  it('carries no symptom→point mapping or efficacy claim', () => {
    const banned = ['主治', '療效', '調理', '溫陽', '調經', '利水', '要穴', '禁針'];
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
    for (const w of ['避免按壓', '力度', '輕觸體表', '不針', '針刺', '艾灸', 'needle', 'moxa']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    const blob = allText().join(' ');
    for (const w of ['肋端高亮', '髂嵴高亮', '高亮模式', '骨骼透視', '骨度尺']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 19 — what it claims about the body', () => {
  it('keeps to the eight points this region actually holds', () => {
    const codes = pointsInRegion('lateral_trunk_daimai').map((p) => p.code).sort();
    expect(codes).toEqual(['GB22', 'GB23', 'GB25', 'GB26', 'GB27', 'GB28', 'LR13', 'SP21']);
  });

  it('leaves out the three points the draft borrowed from other regions', () => {
    for (const [id, home] of [
      ['pt_gb29', 'hip_thigh'],
      ['pt_lr12', 'abdomen_groin'],
      ['pt_sp16', 'abdomen_groin'],
    ] as const) {
      expect({ id, region: regionOfPoint(acupointById.get(id)!)?.key }).toEqual({ id, region: home });
    }
    // 居髎 may be NAMED — a quiz asks which point is not in this region — but it
    // must not be cited as one of the day's own points.
    const cited = new Set<string>();
    for (const f of cards19()) f.relatedAcupointIds.forEach((i) => cited.add(i));
    expect(cited.has('pt_gb29')).toBe(false);
    expect(cited.has('pt_lr12')).toBe(false);
    expect(cited.has('pt_sp16')).toBe(false);
  });

  it('includes 大包 SP21, which the draft omitted', () => {
    expect(cls('pt_sp21')).toContain('great_luo');
    // The dataset's only one, which is what makes it worth naming.
    const allGreatLuo = dataset.acupoints.filter((p) => cls(p.id).includes('great_luo'));
    expect(allGreatLuo.map((p) => p.code)).toEqual(['SP21']);
    expect(allText().join(' ')).toContain('SP21');
  });

  it('names the three channels here, and not an unloaded vessel', () => {
    const fromData = meridiansInRegion('lateral_trunk_daimai').map((m) => m.id);
    expect([...fromData].sort()).toEqual(['mer_gb', 'mer_lr', 'mer_sp']);
    expect([...day19().meridianIds].sort()).toEqual([...fromData].sort());
    // 帶脈 GB26 is a POINT on the Gallbladder channel; the Girdle vessel itself
    // is not among the fourteen this dataset loads.
    expect(acupointById.get('pt_gb26')!.meridianId).toBe('mer_gb');
    expect(dataset.meridians.some((m) => m.code === 'DW')).toBe(false);
  });

  it('does not equate 維道 with the level of 中極', () => {
    // 中極 CV3 is 4 cun below the navel; the draft called 維道 both 臍下 3.5 寸
    // and 中極水平 in the same table.
    expect(acupointById.get('pt_cv3')!.location?.value.zhHant).toContain('臍中下 4 寸');
    expect(acupointById.get('pt_gb28')!.location?.value.zhHant).toContain('五樞前下 0.5 寸');
    const blob = allText().join(' ');
    expect(blob).not.toContain('中極水平');
  });

  it('makes no claim about the iliac spine and L4', () => {
    const blob = allText().join(' ');
    expect(blob).not.toContain('L4');
    expect(blob).not.toContain('平 L4 棘突');
  });
});

describe('day 19 — the structure it teaches is the structure in the data', () => {
  it('holds two front-mu points, each on the “wrong” channel', () => {
    const mu = pointsInRegion('lateral_trunk_daimai').filter((p) => cls(p.id).includes('front_mu'));
    expect(mu.map((p) => p.code).sort()).toEqual(['GB25', 'LR13']);
    // 章門 is a Liver point; the Liver's own front-mu is 期門, taught on Day 17.
    expect(acupointById.get('pt_lr13')!.meridianId).toBe('mer_lr');
    expect(acupointById.get('pt_lr14')!.meridianId).toBe('mer_lr');
    expect(cls('pt_lr14')).toContain('front_mu');
    // 京門 is a Gallbladder point; the Gallbladder's own is 日月, taught on Day 18.
    expect(acupointById.get('pt_gb25')!.meridianId).toBe('mer_gb');
    expect(cls('pt_gb24')).toContain('front_mu');
  });

  it('pairs those two with the back-shu points at the vertebrae it names', () => {
    expect(acupointById.get('pt_bl20')!.location?.value.zhHant).toContain('第 11 胸椎');
    expect(acupointById.get('pt_bl23')!.location?.value.zhHant).toContain('第 2 腰椎');
    const blob = allText().join(' ');
    expect(blob).toContain('脾俞 BL20');
    expect(blob).toContain('腎俞 BL23');
  });

  it('marks the Girdling group as crossing points', () => {
    for (const id of ['pt_gb26', 'pt_gb27', 'pt_gb28']) {
      expect({ id, crossing: cls(id).includes('crossing') }).toEqual({ id, crossing: true });
    }
  });

  it('stays inside its own region, bar the four points it names by way of contrast', () => {
    const region = new Set(pointsInRegion('lateral_trunk_daimai').map((p) => p.id));
    // 脾俞/腎俞 for the front-back pairing, 期門 and 日月 for the "wrong channel"
    // contrast, 神闕 for the horizontal, 居髎 as the odd-one-out answer.
    const allowed = new Set([
      ...region,
      'pt_bl20', 'pt_bl23', 'pt_lr14', 'pt_gb24', 'pt_cv8', 'pt_gb29',
    ]);
    const cited = new Set<string>();
    for (const f of cards19()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz19()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: allowed.has(id) }).toEqual({ id, inScope: true });
    }
  });
});

describe('day 19 — shape', () => {
  it('follows day 18 in the numbered curriculum', () => {
    expect(day19().dayNumber).toBe(19);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day19().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards19()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz19()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day19().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards19().length).toBeGreaterThanOrEqual(5);
    expect(quiz19().length).toBeGreaterThanOrEqual(3);
  });
});
