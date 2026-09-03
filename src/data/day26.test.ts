import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { meridiansInRegion, pointsInRegion, regionOfPoint } from './regions';

const day26 = () => dataset.curriculumDays.find((d) => d.id === 'day_26')!;
const cards26 = () => dataset.flashcards.filter((f) => f.dayId === 'day_26');
const quiz26 = () => dataset.quizItems.filter((q) => q.dayId === 'day_26');

const allText = (): string[] => {
  const out: string[] = [];
  const d = day26();
  out.push(`${d.titleZhHant} ${d.titleEn} ${d.hookZhHant} ${d.hookEn}`);
  if (d.noticeZhHant) out.push(`${d.noticeZhHant} ${d.noticeEn ?? ''}`);
  for (const s of d.sections) for (const b of s.body) out.push(`${b.zhHant} ${b.en}`);
  for (const f of cards26()) out.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
  for (const q of quiz26()) {
    out.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
    for (const o of q.options) out.push(`${o.zhHant} ${o.en}`);
  }
  return out;
};

const cls = (id: string) => acupointById.get(id)?.classifications?.value ?? [];
const loc = (id: string) => acupointById.get(id)?.location?.value.zhHant ?? '';

describe('day 26 — what may not appear', () => {
  it('carries no efficacy or functional claim', () => {
    const banned = ['主治', '療效', '調理', '止痛', '要穴', '禁針', '急救', '補腎'];
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
    // The draft carried 「力度適中，避免暴力按壓」 — a handling instruction.
    for (const w of ['針刺', '進針', '刺入', '艾灸', '力度', '暴力', '避免按壓', 'needle', 'moxa']) {
      expect(blob).not.toContain(w);
    }
  });

  it('asks only for app features that exist', () => {
    const blob = allText().join(' ');
    // The draft named three features and a default zoom that do not exist.
    for (const w of ['棘突高亮', '骶後孔高亮', '骨性標志連線', '高亮模式', '骨骼透視', '透視']) {
      expect(blob).not.toContain(w);
    }
  });
});

describe('day 26 — what it claims about the body', () => {
  it('leaves 大椎, 風府, 承扶 and 環跳 to the regions that hold them', () => {
    expect(regionOfPoint(acupointById.get('pt_gv14')!)?.key).toBe('head');
    expect(regionOfPoint(acupointById.get('pt_gv16')!)?.key).toBe('head');
    expect(regionOfPoint(acupointById.get('pt_bl36')!)?.key).toBe('hip_thigh');
    expect(regionOfPoint(acupointById.get('pt_gb30')!)?.key).toBe('hip_thigh');
    const cited = new Set<string>();
    for (const f of cards26()) f.relatedAcupointIds.forEach((i) => cited.add(i));
    for (const id of ['pt_gv14', 'pt_gv16', 'pt_bl36', 'pt_gb30']) {
      expect({ id, onACard: cited.has(id) }).toEqual({ id, onACard: false });
    }
  });

  it('starts the region’s midline at 陶道 GV13, not at 大椎', () => {
    const gv = pointsInRegion('back_glute')
      .filter((p) => p.meridianId === 'mer_gv')
      .sort((a, b) => a.ordinal - b.ordinal);
    expect(gv.map((p) => p.code)).toEqual([
      'GV1', 'GV2', 'GV3', 'GV4', 'GV5', 'GV6', 'GV7',
      'GV8', 'GV9', 'GV10', 'GV11', 'GV12', 'GV13',
    ]);
    const blob = allText().join(' ');
    expect(blob).toContain('陶道 GV13');
    expect(blob).toContain('長強 GV1');
  });

  it('carries no Gallbladder point, and says so', () => {
    const gb = pointsInRegion('back_glute').filter((p) => p.meridianId === 'mer_gb');
    expect(gb).toEqual([]);
    expect(day26().meridianIds).not.toContain('mer_gb');
    expect(allText().join(' ')).toContain('沒有膽經');
  });

  it('counts 八髎 as four records, not eight points', () => {
    const baliao = ['pt_bl31', 'pt_bl32', 'pt_bl33', 'pt_bl34'];
    for (const id of baliao) {
      expect({ id, sacral: /骶後孔/.test(loc(id)) }).toEqual({ id, sacral: true });
    }
    const blob = allText().join(' ');
    // The draft said 「共 8 穴」 against a dataset that stores each bilateral
    // point once.
    expect(blob).not.toContain('共 8 穴');
    expect(blob).not.toContain('八髎共八');
    expect(blob).toContain('四筆');
  });

  it('attaches no landmark to a height that the records do not give', () => {
    const blob = allText().join(' ');
    // L2 is described the way 命門's own record describes it.
    expect(loc('pt_gv4')).toContain('肚臍');
    expect(blob).not.toContain('肋弓下緣的水平是 L2');
    expect(loc('pt_gv12')).toContain('肩胛岡');
    expect(loc('pt_gv9')).toContain('肩胛骨下角');
    expect(loc('pt_gv3')).toContain('髂嵴');
  });

  it('does not misattribute its own material to earlier days', () => {
    const review = day26().sections.find((s) => s.id === 'sec_26_review')!;
    const blob = review.body.map((b) => `${b.zhHant} ${b.en}`).join(' ');
    // The draft sent 肺俞/心俞 to Day 22 and 至陽/身柱 to Day 20 — all four are
    // today's — and 風池/風府 to Day 23 though both are head points.
    for (const own of ['肺俞', '心俞', '至陽', '身柱', '風池', '風府']) {
      expect({ own, inReview: blob.includes(own) }).toEqual({ own, inReview: false });
    }
  });
});

describe('day 26 — the structure it teaches is the structure in the data', () => {
  it('holds every back-shu point in the dataset, and all twelve of them', () => {
    const shuEverywhere = [...acupointById.values()].filter((p) =>
      (p.classifications?.value ?? []).includes('back_shu'),
    );
    expect(shuEverywhere.length).toBe(12);
    for (const p of shuEverywhere) {
      expect({ code: p.code, region: regionOfPoint(p)?.key }).toEqual({
        code: p.code,
        region: 'back_glute',
      });
    }
    const blob = allText().join(' ');
    for (const code of [
      'BL13', 'BL14', 'BL15', 'BL18', 'BL19', 'BL20',
      'BL21', 'BL22', 'BL23', 'BL25', 'BL27', 'BL28',
    ]) {
      expect({ code, named: blob.includes(code) }).toEqual({ code, named: true });
    }
  });

  it('puts every back-shu point on the first Bladder line, 1.5 cun out', () => {
    const shu = pointsInRegion('back_glute').filter((p) => cls(p.id).includes('back_shu'));
    for (const p of shu) {
      expect({ code: p.code, at: /旁開 1\.5 寸|旁 1\.5 寸/.test(loc(p.id)) }).toEqual({
        code: p.code,
        at: true,
      });
    }
  });

  it('pairs each taught shu point with the front-mu point the records give', () => {
    const pairs: Array<[string, string]> = [
      ['pt_bl13', 'pt_lu1'],
      ['pt_bl15', 'pt_cv14'],
      ['pt_bl18', 'pt_lr14'],
      ['pt_bl20', 'pt_lr13'],
      ['pt_bl23', 'pt_gb25'],
    ];
    for (const [shu, mu] of pairs) {
      expect({ shu, isShu: cls(shu).includes('back_shu') }).toEqual({ shu, isShu: true });
      expect({ mu, isMu: cls(mu).includes('front_mu') }).toEqual({ mu, isMu: true });
      // The mu partner always lives in some other region.
      const here = regionOfPoint(acupointById.get(mu)!)?.key;
      expect({ mu, here }).not.toEqual({ mu, here: 'back_glute' });
    }
  });

  it('gives the Small Intestine’s two stations their own lateral distances', () => {
    expect(loc('pt_si15')).toContain('第 7 頸椎棘突下');
    expect(loc('pt_si15')).toContain('旁開 2 寸');
    expect(loc('pt_si14')).toContain('第 1 胸椎棘突下');
    expect(loc('pt_si14')).toContain('旁開 3 寸');
  });

  it('holds the two influential points it names', () => {
    expect(cls('pt_bl11')).toContain('influential_meeting');
    expect(cls('pt_bl17')).toContain('influential_meeting');
    const blob = allText().join(' ');
    expect(blob).toContain('大杼 BL11');
    expect(blob).toContain('膈俞 BL17');
  });

  it('names all three channels the region carries, and their sizes', () => {
    const fromData = meridiansInRegion('back_glute').map((m) => m.id);
    expect([...fromData].sort()).toEqual(['mer_bl', 'mer_gv', 'mer_si']);
    expect([...day26().meridianIds].sort()).toEqual([...fromData].sort());
    const here = pointsInRegion('back_glute');
    expect(here.length).toBe(54);
    expect(here.filter((p) => p.meridianId === 'mer_bl').length).toBe(39);
    expect(here.filter((p) => p.meridianId === 'mer_gv').length).toBe(13);
    expect(here.filter((p) => p.meridianId === 'mer_si').length).toBe(2);
  });

  it('stays inside its own region', () => {
    const region = new Set(pointsInRegion('back_glute').map((p) => p.id));
    // The mu partners and 大椎 appear only as quiz or card answers about where
    // they live.
    const allowed = new Set([
      ...region,
      'pt_lu1', 'pt_cv14', 'pt_lr14', 'pt_lr13', 'pt_gb25', 'pt_gv14',
    ]);
    const cited = new Set<string>();
    for (const f of cards26()) f.relatedAcupointIds.forEach((id) => cited.add(id));
    for (const q of quiz26()) {
      q.relatedAcupointIds.forEach((id) => cited.add(id));
      if (q.targetAcupointId) cited.add(q.targetAcupointId);
    }
    for (const id of cited) {
      expect({ id, inScope: allowed.has(id) }).toEqual({ id, inScope: true });
    }
  });
});

describe('day 26 — shape', () => {
  it('closes the numbered curriculum after day 25', () => {
    expect(day26().dayNumber).toBe(26);
    const numbers = dataset.curriculumDays.map((d) => d.dayNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(Math.max(...numbers)).toBe(26);
  });

  it('leaves no region without a day, and no point without a region', () => {
    const covered = new Set<string>();
    for (const p of acupointById.values()) {
      const r = regionOfPoint(p);
      expect({ code: p.code, placed: Boolean(r) }).toEqual({ code: p.code, placed: true });
      if (r) covered.add(r.key);
    }
    expect(covered.size).toBe(13);
  });

  it('cites a source for every section, card and quiz item', () => {
    for (const s of day26().sections) expect(s.sourceIds.length).toBeGreaterThan(0);
    for (const f of cards26()) expect(f.sourceIds.length).toBeGreaterThan(0);
    for (const q of quiz26()) expect(q.sourceIds.length).toBeGreaterThan(0);
    for (const id of day26().sourceIds) {
      expect(dataset.sources.some((s) => s.id === id)).toBe(true);
    }
  });

  it('carries recall material', () => {
    expect(cards26().length).toBeGreaterThanOrEqual(5);
    expect(quiz26().length).toBeGreaterThanOrEqual(3);
  });
});
