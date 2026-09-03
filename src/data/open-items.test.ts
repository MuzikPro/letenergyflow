import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { searchIndex } from '../search';
import {
  isSchematicPlacement,
  PLACEMENT_STATUS_LABELS,
  type AtlasPlacement,
} from './types';

/**
 * The Day 7 worksheet's five unresolved items, pinned as tests.
 *
 * Each one is a decision the owner asked to be preserved rather than guessed.
 * These assertions exist so a later ingest cannot quietly overturn one — which
 * is exactly the failure mode a "pending" note in a document does not prevent.
 */

const point = (code: string) => acupointById.get(`pt_${code.toLowerCase()}`)!;

describe('worksheet open items stay as the owner left them', () => {
  it('1. keeps 天池 PC1 unclassified, with the three-meridian reading recorded', () => {
    // WHO/WPR, GB/T 12346 and the mainstream textbooks list no category, and
    // that is what ships. The minority reading is carried in the note so a
    // reviewer can find it without it silently becoming the displayed fact.
    expect(point('PC1').classifications).toBeNull();
    const note = point('PC1').location?.notes ?? '';
    expect(note).toMatch(/膽經|足少陽/);
    expect(note).toMatch(/肝經|足厥陰/);
    expect(note).toMatch(/交會/);
    // A reviewed NONE must not be reported as pending work: the point went
    // through the editorial pass, so its record is source_checked even though
    // it carries no classification.
    expect(point('PC1').reviewStatus).not.toBe('unreviewed');
  });

  it('2. carries the Triple Energizer aliases so pinyin and SJ/TB/TW all resolve', () => {
    // The English names stay meaning-based. Pinyin does NOT need to be copied
    // into a notes field to be searchable: it is a first-class indexed field on
    // every point, and the meridian aliases cover the alternative codes.
    for (const q of ['guanchong', 'guan chong', 'sanjiao', 'san jiao']) {
      expect(searchIndex.search(q).total).toBeGreaterThan(0);
    }
    expect(searchIndex.search('guanchong').acupoints[0]?.id).toBe('pt_te1');
    for (const q of ['SJ', 'TB', 'TW', 'Triple Burner', 'Triple Warmer']) {
      expect(searchIndex.search(q).meridians.some((m) => m.id === 'mer_te')).toBe(true);
    }
  });

  it('3. does not label 三陽絡 TE8 as the channel’s luo-connecting point', () => {
    // The Triple Energizer's luo point is 外關 TE5. The 「絡」 in 三陽絡 means
    // it links the three yang channels — a different sense of the same word.
    expect(point('TE8').classifications).toBeNull();
    expect(point('TE5').classifications?.value).toContain('luo_connecting');
    const note = point('TE8').location?.notes ?? '';
    expect(note).toMatch(/外關/);
    expect(note).toMatch(/絡穴/);

    // And no other point on the channel claims to be its luo point either.
    const luoOnTe = dataset.acupoints.filter(
      (p) => p.meridianId === 'mer_te' && p.classifications?.value.includes('luo_connecting'),
    );
    expect(luoOnTe.map((p) => p.code)).toEqual(['TE5']);
    expect(point('TE8').reviewStatus).not.toBe('unreviewed');
  });

  it('4. reports every marker coordinate as unvalidated, and can show otherwise', () => {
    // Today this is uniform, so the UI says it once per point rather than
    // decorating 251 identical markers.
    const statuses = new Set(
      dataset.acupoints.flatMap((p) => p.placements.map((pl) => pl.status)),
    );
    expect([...statuses]).toEqual(['schematic_unvalidated']);

    // The distinction is data-driven, so it activates without a UI change the
    // moment a coordinate is measured. Proven on constructed placements rather
    // than by shipping a fake validated point.
    const cases: AtlasPlacement['status'][] = [
      'schematic_unvalidated',
      'source_checked',
      'expert_reviewed',
    ];
    for (const status of cases) {
      const label = PLACEMENT_STATUS_LABELS[status];
      expect(label.zhHant.length).toBeGreaterThan(0);
      expect(label.en.length).toBeGreaterThan(0);
      expect(isSchematicPlacement({ status })).toBe(status === 'schematic_unvalidated');
    }
    // The unvalidated wording must keep saying what it is not usable for.
    expect(PLACEMENT_STATUS_LABELS.schematic_unvalidated.en).toMatch(/not.*(usable|measured)/i);
    expect(PLACEMENT_STATUS_LABELS.schematic_unvalidated.zhHant).toMatch(/不可|尚未/);
  });

  it('5. returns both 中渚 TE3 and 中注 KI15 for their shared pinyin', () => {
    // A collision, not a bug: two different points genuinely read "zhong zhu".
    for (const q of ['zhong zhu', 'zhongzhu']) {
      const ids = searchIndex.search(q).acupoints.map((a) => a.id);
      expect(ids).toContain('pt_te3');
      expect(ids).toContain('pt_ki15');
    }
    // They stay separate records — nothing merged them.
    expect(point('TE3').meridianId).toBe('mer_te');
    expect(point('KI15').meridianId).toBe('mer_ki');
    expect(point('TE3').nameZhHant).not.toBe(point('KI15').nameZhHant);
  });
});
