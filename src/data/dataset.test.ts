import { describe, expect, it } from 'vitest';
import { dataset, validateDataset } from './index';
import { CLASSIFICATION_LABELS, REGION_LABELS } from './types';

describe('Days 1–10 dataset integrity', () => {
  it('passes every structural check', () => {
    expect(validateDataset()).toEqual([]);
  });

  it('loads exactly all fourteen channels', () => {
    expect(dataset.meridians.map((m) => m.code).sort()).toEqual([
      'BL',
      'CV',
      'GB',
      'GV',
      'HT',
      'KI',
      'LI',
      'LR',
      'LU',
      'PC',
      'SI',
      'SP',
      'ST',
      'TE',
    ]);
  });

  it('loads the full point count for each loaded channel', () => {
    const count = (code: string) =>
      dataset.acupoints.filter((p) => p.code.startsWith(code) && /\d/.test(p.code)).length;
    expect(count('LU')).toBe(11);
    expect(count('LI')).toBe(20);
    expect(count('ST')).toBe(45);
    expect(count('SP')).toBe(21);
    expect(count('HT')).toBe(9);
    expect(count('SI')).toBe(19);
    expect(count('BL')).toBe(67);
    expect(count('KI')).toBe(27);
    expect(count('PC')).toBe(9);
    expect(count('TE')).toBe(23);
    expect(count('GB')).toBe(44);
    expect(count('LR')).toBe(14);
    expect(count('CV')).toBe(24);
    expect(count('GV')).toBe(29);
    expect(dataset.acupoints.length).toBe(362);

    // Every one of the twelve regular channels names its interior–exterior
    // partner, and each pairing is reciprocal. The two extraordinary vessels
    // have no partner BY DEFINITION — a null there is correct, not missing.
    const extraordinary = ['mer_cv', 'mer_gv'];
    for (const m of dataset.meridians) {
      if (extraordinary.includes(m.id)) {
        expect(m.pairedMeridianId).toBeNull();
        continue;
      }
      expect(m.pairedMeridianId).not.toBeNull();
      const partner = dataset.meridians.find((x) => x.id === m.pairedMeridianId);
      expect(partner?.pairedMeridianId).toBe(m.id);
    }
    expect(dataset.meridians.filter((m) => !extraordinary.includes(m.id)).length).toBe(12);
  });

  it('declares itself partial and never implies full catalogue coverage', () => {
    expect(dataset.isPartial).toBe(true);
    expect(dataset.scopeLabelEn).toMatch(/ALL 14 channels/);
    expect(dataset.scopeLabelEn).toMatch(/362 points/);
  });

  it('has a 中文 label for every body region and point classification it stores', () => {
    // Regions and categories are stored as English identifiers. Any one that is
    // missing from the label maps would print English inside the 中文 interface,
    // which the product forbids — never a mixture of scripts on one surface.
    const missingRegions = new Set<string>();
    for (const p of dataset.acupoints) {
      if (!REGION_LABELS[p.bodyRegion]) missingRegions.add(p.bodyRegion);
    }
    for (const m of dataset.meridians) {
      for (const r of m.bodyRegions) if (!REGION_LABELS[r]) missingRegions.add(r);
    }
    expect([...missingRegions]).toEqual([]);

    const missingClasses = new Set<string>();
    for (const p of dataset.acupoints) {
      for (const c of p.classifications?.value ?? []) {
        if (!CLASSIFICATION_LABELS[c]) missingClasses.add(c);
      }
    }
    expect([...missingClasses]).toEqual([]);
  });

  it('keeps every marker inside normalised atlas bounds', () => {
    for (const p of dataset.acupoints) {
      for (const pl of p.placements) {
        expect(pl.x).toBeGreaterThanOrEqual(0);
        expect(pl.x).toBeLessThanOrEqual(1);
        expect(pl.y).toBeGreaterThanOrEqual(0);
        expect(pl.y).toBeLessThanOrEqual(1);
      }
    }
  });

  it('never claims a coordinate is anatomically validated', () => {
    for (const p of dataset.acupoints) {
      for (const pl of p.placements) {
        expect(pl.status).toBe('schematic_unvalidated');
      }
    }
  });

  it('marks nothing as expert reviewed without a recorded reviewer', () => {
    const reviewed = [
      ...dataset.sources.filter((s) => s.reviewStatus === 'expert_reviewed' && !s.reviewer),
      ...dataset.acupoints.filter((p) => p.reviewStatus === 'expert_reviewed'),
      ...dataset.meridians.filter((m) => m.reviewStatus === 'expert_reviewed'),
    ];
    expect(reviewed).toEqual([]);
  });

  it('gives every factual claim at least one source', () => {
    for (const p of dataset.acupoints) {
      expect(p.sourceIds.length).toBeGreaterThan(0);
      if (p.location) expect(p.location.sourceIds.length).toBeGreaterThan(0);
      if (p.classifications) expect(p.classifications.sourceIds.length).toBeGreaterThan(0);
    }
    for (const r of dataset.functionRelations) {
      expect(r.sourceIds.length).toBeGreaterThan(0);
    }
  });

  it('carries a sourced, source-checked location for every point since the 2026-08 editorial pass', () => {
    for (const p of dataset.acupoints) {
      expect(p.location).toBeTruthy();
      expect(p.location!.reviewStatus).toBe('source_checked');
      expect(p.location!.reviewer).toBeTruthy();
      expect(p.location!.sourceIds).toContain('src_owner_worksheet_2026_08');
    }
  });

  it('keeps every marker placement schematic even after the editorial pass', () => {
    for (const p of dataset.acupoints) {
      for (const pl of p.placements) expect(pl.status).toBe('schematic_unvalidated');
    }
  });

  it('explains every network interchange it draws, in both scripts', () => {
    for (const ix of dataset.networkInterchanges) {
      expect(ix.meaningEn.length).toBeGreaterThan(30);
      expect(ix.meaningZhHant.length).toBeGreaterThan(20);
      expect(ix.meaningEn).toMatch(/not an anatomical crossing/i);
      expect(ix.meaningZhHant).toMatch(/不是解剖上的交叉/);
      expect(ix.labelEn.trim().length).toBeGreaterThan(0);
      expect(ix.labelZhHant.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps interchange text free of mixed-script strings', () => {
    // A single field carrying both scripts is what produced the unreadable
    // "中文 label — English explanation" line in the network list view.
    const hasCjk = (v: string) => /[\u3400-\u9fff]/.test(v);
    const hasLatinWords = (v: string) => /[A-Za-z]{4,}/.test(v);
    for (const ix of dataset.networkInterchanges) {
      for (const field of [ix.labelZhHant, ix.meaningZhHant]) expect(hasLatinWords(field)).toBe(false);
      for (const field of [ix.labelEn, ix.meaningEn]) expect(hasCjk(field)).toBe(false);
    }
  });

  it('matches network station counts to the normalised route data', () => {
    for (const line of dataset.networkLines) {
      const m = dataset.meridians.find((x) => x.id === line.meridianId)!;
      expect(line.stations.map((s) => s.acupointId)).toEqual(m.pointOrder);
    }
  });
});

describe('safety boundaries', () => {
  const allText = JSON.stringify(dataset);

  it('carries no invasive-technique instruction', () => {
    // 放血 bloodletting, 針刺深度 needle depth, 灸 moxibustion, 禁針 needling contraindication
    for (const term of ['放血', '刺入', '進針', '針刺', '灸法', '禁針', 'bloodlet', 'needle depth', 'insert the needle']) {
      // The term may only appear inside a provenance note recording that the
      // source contained it and that the project deliberately left it out.
      // The notes are bilingual, so the Chinese exclusion wordings count too.
      let from = 0;
      for (;;) {
        const at = allText.indexOf(term, from);
        if (at === -1) break;
        const context = allText.slice(Math.max(0, at - 240), at + 320);
        expect(context).toMatch(
          /NOT ingested|not ingested|not carried|deliberately|excluded|未採用|已排除|濾除|不會被收錄/i,
        );
        from = at + term.length;
      }
    }
  });

  it('frames every traditional function as educational, not prescriptive', () => {
    for (const f of dataset.traditionalFunctions) {
      expect(f.educationalFraming.en).toMatch(/not guidance|not treatment|not evidence/i);
      expect(f.educationalFraming.zhHant).toMatch(/不是|非/);
    }
  });

  it('uses no imperative treatment language in quiz feedback', () => {
    for (const q of dataset.quizItems) {
      expect(q.explanationEn).not.toMatch(/\buse (this|that) point (for|to treat)\b/i);
      expect(q.explanationEn).not.toMatch(/\btreat your\b/i);
    }
  });
});
