import { describe, expect, it } from 'vitest';
import { dataset, meridianById } from './index';
import { REGULAR_CHANNELS } from './specific-points';
import {
  meridianOf,
  SHICHEN,
  SHICHEN_SOURCE,
  SHICHEN_SOURCES,
  SHICHEN_VERSE,
  SOLAR_TIME_NOTE,
  shichenAtHour,
  shichenHours,
  stepShichen,
} from './shichen';

describe('子午流注 clock data', () => {
  it('covers the twelve regular channels exactly once, and neither vessel', () => {
    expect(SHICHEN.length).toBe(12);
    const ids = SHICHEN.map((s) => s.meridianId);
    expect(new Set(ids).size).toBe(12);
    expect(ids).not.toContain('mer_cv');
    expect(ids).not.toContain('mer_gv');
    for (const m of REGULAR_CHANNELS) expect(ids).toContain(m.id);
  });

  it('runs the same order as the flow sequence already in the dataset', () => {
    // Counted from 寅 (the Lung, 03–05) the clock IS the flow cycle. This is the
    // check that keeps the new table honest against data that predates it.
    const fromYin = [...SHICHEN.slice(2), ...SHICHEN.slice(0, 2)].map(
      (s) => meridianById.get(s.meridianId)!.code,
    );
    expect(fromYin).toEqual(REGULAR_CHANNELS.map((m) => m.code));
    expect(fromYin[0]).toBe('LU');
    expect(fromYin[11]).toBe('LR');
  });

  it('maps every hour of the day, with 子 straddling midnight', () => {
    for (let h = 0; h < 24; h++) expect(shichenAtHour(h)).toBeTruthy();
    // The wrap is the only fiddly part of the arithmetic.
    expect(shichenAtHour(23).branchZhHant).toBe('子');
    expect(shichenAtHour(0).branchZhHant).toBe('子');
    expect(shichenAtHour(1).branchZhHant).toBe('丑');
    expect(shichenAtHour(22).branchZhHant).toBe('亥');
    // Each branch claims exactly two hours.
    const counts = new Map<string, number>();
    for (let h = 0; h < 24; h++) {
      const b = shichenAtHour(h).branchZhHant;
      counts.set(b, (counts.get(b) ?? 0) + 1);
    }
    expect([...counts.values()]).toEqual(Array(12).fill(2));
  });

  it('puts 08:00 on the Stomach — the brief’s own acceptance case', () => {
    const s = shichenAtHour(8);
    expect(s.branchZhHant).toBe('辰');
    expect(meridianOf(s).code).toBe('ST');
    expect(shichenHours(s)).toBe('07:00–09:00');
  });

  it('agrees with the traditional pairings at the corners of the day', () => {
    const at = (h: number) => `${shichenAtHour(h).branchZhHant}${meridianOf(shichenAtHour(h)).code}`;
    expect(at(3)).toBe('寅LU');
    expect(at(5)).toBe('卯LI');
    expect(at(11)).toBe('午HT');
    expect(at(15)).toBe('申BL');
    expect(at(17)).toBe('酉KI');
    expect(at(19)).toBe('戌PC');
    expect(at(21)).toBe('亥TE');
    expect(at(1)).toBe('丑LR');
  });

  it('wraps in both directions when stepping', () => {
    expect(stepShichen(11, 1)).toBe(0);
    expect(stepShichen(0, -1)).toBe(11);
    expect(stepShichen(0, -13)).toBe(11);
    expect(stepShichen(5, 12)).toBe(5);
  });

  it('formats the two-hour window, including the one that crosses midnight', () => {
    expect(shichenHours(SHICHEN[0]!)).toBe('23:00–01:00');
    expect(shichenHours(SHICHEN[6]!)).toBe('11:00–13:00');
  });

  it('cites 針灸大成 and the owner pass that checked it', () => {
    for (const id of SHICHEN_SOURCES) {
      const src = dataset.sources.find((s) => s.id === id);
      expect({ id, found: Boolean(src) }).toEqual({ id, found: true });
      expect({ id, status: src!.reviewStatus }).toEqual({ id, status: 'source_checked' });
    }
    const primary = dataset.sources.find((s) => s.id === SHICHEN_SOURCE)!;
    expect(primary.sourceType).toBe('classical_public_domain');
    expect(primary.reviewer).toBe('project owner');
    expect(primary.reviewDate).toBe('2026-08-08');
    expect(primary.reference).toMatch(/針灸大成/);
  });

  it('carries the verse the mapping comes from, and it agrees with the table', () => {
    // The verse is the source in compressed form, so it is the cheapest check
    // that the table was not quietly edited away from what was reviewed.
    expect(SHICHEN_VERSE.zhHant).toContain('肺寅');
    expect(SHICHEN_VERSE.attributionZhHant).toMatch(/針灸大成/);
    const pairs: [string, string][] = [
      ['肺寅', 'mer_lu'], ['大卯', 'mer_li'], ['胃辰', 'mer_st'], ['脾巳', 'mer_sp'],
      ['心午', 'mer_ht'], ['小未', 'mer_si'], ['申膀', 'mer_bl'], ['酉腎', 'mer_ki'],
      ['心包戌', 'mer_pc'], ['亥焦', 'mer_te'], ['子膽', 'mer_gb'], ['丑肝', 'mer_lr'],
    ];
    for (const [fragment, meridianId] of pairs) {
      expect({ fragment, inVerse: SHICHEN_VERSE.zhHant.includes(fragment) }).toEqual({
        fragment,
        inVerse: true,
      });
      const branch = fragment.replace(/[^子丑寅卯辰巳午未申酉戌亥]/g, '');
      const s = SHICHEN.find((x) => x.branchZhHant === branch)!;
      expect({ branch, channel: s.meridianId }).toEqual({ branch, channel: meridianId });
    }
  });

  it('gives every hour a reviewed line in both languages', () => {
    for (const s of SHICHEN) {
      expect({ branch: s.branchZhHant, zh: s.noteZhHant.length > 10 }).toEqual({
        branch: s.branchZhHant,
        zh: true,
      });
      expect(s.noteEn.length).toBeGreaterThan(10);
      // Each line names its own channel, so a row cannot drift from its note.
      expect(s.noteZhHant).toContain(meridianOf(s).nameZhHant);
    }
  });

  it('keeps the clock-time basis explicit rather than implying solar time', () => {
    expect(SOLAR_TIME_NOTE.zhHant).toMatch(/真太陽時/);
    expect(SOLAR_TIME_NOTE.en).toMatch(/true solar time/i);
    // The app must not claim to convert; it says so.
    expect(SOLAR_TIME_NOTE.en).toMatch(/no conversion is implemented/i);
  });

  it('says which channel an hour belongs to, and nothing about what to do in it', () => {
    /*
     * The real risk in an organ-clock feature. 子午流注 is traditionally used to
     * time treatment, and the genre is full of "best time to sleep / eat / avoid
     * alcohol" copy. None of that may appear: this app gives no health, routine
     * or treatment-timing advice.
     */
    const text = JSON.stringify(SHICHEN);
    for (const banned of [
      '宜', '忌', '養生', '睡', '飲', '食', '排毒', '進補', '最佳',
      'should', 'best time', 'avoid', 'detox', 'sleep', 'diet', 'recommend',
    ]) {
      expect(text.toLowerCase()).not.toContain(banned.toLowerCase());
    }
  });
});
