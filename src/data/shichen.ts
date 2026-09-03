import { dataset, meridianById } from './index';
import type { Meridian } from './types';

/**
 * 子午流注 — the twelve double-hours and the channel each one is assigned.
 *
 * The ORDER here is not new information: it is the same flow sequence already
 * modelled as edges in `network.ts` (肺→大腸→胃→…→肝→肺). What this file adds
 * is the clock — which double-hour the tradition pairs with each channel. That
 * mapping is not in the curriculum handbook; it comes from 《針灸大成·十二經納
 * 地支歌》 and went through the owner's editorial pass on 2026-08-08, which
 * confirmed all twelve pairings unchanged and supplied the wording below.
 *
 * Scope, deliberately: this says which channel the tradition ASSIGNS to an
 * hour. It says nothing about what a learner should do at that hour. 子午流注
 * is traditionally used to time treatment — 納甲法, 納子法, 開穴閉穴 — and this
 * app does not do treatment, so none of that is represented. Day 13 teaches the
 * pairings and the verse; the methods built on them are not taught. A test
 * asserts no "best time to…", 宜/忌, 養生 or 排毒 wording appears.
 */

export interface Shichen {
  /** 地支 index, 子 = 0 … 亥 = 11. The traditional ordering. */
  index: number;
  branchZhHant: string;
  pinyin: string;
  /** Inclusive start hour on a 24h clock. 子 spans 23:00–01:00, so it wraps. */
  startHour: number;
  meridianId: string;
  /**
   * One neutral line on how the tradition places this hour. Reviewed wording
   * from the owner's 2026-08-08 pass: traditional placement only — no efficacy
   * claim, no routine, nothing about what to do in the hour.
   */
  noteZhHant: string;
  /** The project's own translation of the reviewed 中文, itself unreviewed. */
  noteEn: string;
}

/**
 * 地支 order (子 first), which is how the cycle is traditionally counted, with
 * each branch's channel. Reading it from 寅 (the Lung, 03–05) gives the flow
 * sequence the curriculum teaches; reading it from 子 gives the clock.
 */
export const SHICHEN: Shichen[] = [
  {
    index: 0,
    branchZhHant: '子',
    pinyin: 'Zi',
    startHour: 23,
    meridianId: 'mer_gb',
    noteZhHant:
      '子時（23:00–01:00）傳統上配足少陽膽經，為十二時辰之首、陽氣初生之時。',
    noteEn:
      'The hour of 子 (23:00–01:00) is traditionally paired with the Gallbladder channel; it is counted as the first of the twelve, when yang is described as first stirring.',
  },
  {
    index: 1,
    branchZhHant: '丑',
    pinyin: 'Chou',
    startHour: 1,
    meridianId: 'mer_lr',
    noteZhHant:
      '丑時（01:00–03:00）傳統上配足厥陰肝經，為陰氣最盛、肝藏血之時。',
    noteEn:
      'The hour of 丑 (01:00–03:00) is traditionally paired with the Liver channel, described as the height of yin, when the liver is said to store the blood.',
  },
  {
    index: 2,
    branchZhHant: '寅',
    pinyin: 'Yin',
    startHour: 3,
    meridianId: 'mer_lu',
    noteZhHant:
      '寅時（03:00–05:00）傳統上配手太陰肺經，為營氣從中焦起算、流注之始。',
    noteEn:
      'The hour of 寅 (03:00–05:00) is traditionally paired with the Lung channel, taken as the start of the cycle, where the nutritive qi is counted from.',
  },
  {
    index: 3,
    branchZhHant: '卯',
    pinyin: 'Mao',
    startHour: 5,
    meridianId: 'mer_li',
    noteZhHant:
      '卯時（05:00–07:00）傳統上配手陽明大腸經，為肺經流注後的下一條經。',
    noteEn:
      'The hour of 卯 (05:00–07:00) is traditionally paired with the Large Intestine channel, the next in sequence after the Lung.',
  },
  {
    index: 4,
    branchZhHant: '辰',
    pinyin: 'Chen',
    startHour: 7,
    meridianId: 'mer_st',
    noteZhHant:
      '辰時（07:00–09:00）傳統上配足陽明胃經，屬陽明經氣旺盛之時。',
    noteEn:
      'The hour of 辰 (07:00–09:00) is traditionally paired with the Stomach channel, described as the height of the Yangming.',
  },
  {
    index: 5,
    branchZhHant: '巳',
    pinyin: 'Si',
    startHour: 9,
    meridianId: 'mer_sp',
    noteZhHant:
      '巳時（09:00–11:00）傳統上配足太陰脾經，為胃經流注後的下一條經。',
    noteEn:
      'The hour of 巳 (09:00–11:00) is traditionally paired with the Spleen channel, the next in sequence after the Stomach.',
  },
  {
    index: 6,
    branchZhHant: '午',
    pinyin: 'Wu',
    startHour: 11,
    meridianId: 'mer_ht',
    noteZhHant:
      '午時（11:00–13:00）傳統上配手少陰心經，為陽氣最盛、陰氣初生之時。',
    noteEn:
      'The hour of 午 (11:00–13:00) is traditionally paired with the Heart channel, described as the height of yang, when yin is said to first stir.',
  },
  {
    index: 7,
    branchZhHant: '未',
    pinyin: 'Wei',
    startHour: 13,
    meridianId: 'mer_si',
    noteZhHant:
      '未時（13:00–15:00）傳統上配手太陽小腸經，為心經流注後的下一條經。',
    noteEn:
      'The hour of 未 (13:00–15:00) is traditionally paired with the Small Intestine channel, the next in sequence after the Heart.',
  },
  {
    index: 8,
    branchZhHant: '申',
    pinyin: 'Shen',
    startHour: 15,
    meridianId: 'mer_bl',
    noteZhHant:
      '申時（15:00–17:00）傳統上配足太陽膀胱經，為三陽經氣流注之時。',
    noteEn:
      'The hour of 申 (15:00–17:00) is traditionally paired with the Bladder channel, placed among the three yang channels of the cycle.',
  },
  {
    index: 9,
    branchZhHant: '酉',
    pinyin: 'You',
    startHour: 17,
    meridianId: 'mer_ki',
    noteZhHant:
      '酉時（17:00–19:00）傳統上配足少陰腎經，為膀胱經流注後的下一條經。',
    noteEn:
      'The hour of 酉 (17:00–19:00) is traditionally paired with the Kidney channel, the next in sequence after the Bladder.',
  },
  {
    index: 10,
    branchZhHant: '戌',
    pinyin: 'Xu',
    startHour: 19,
    meridianId: 'mer_pc',
    noteZhHant:
      '戌時（19:00–21:00）傳統上配手厥陰心包經，為陰經流注繼腎之後的經。',
    noteEn:
      'The hour of 戌 (19:00–21:00) is traditionally paired with the Pericardium channel, the yin channel following the Kidney in the sequence.',
  },
  {
    index: 11,
    branchZhHant: '亥',
    pinyin: 'Hai',
    startHour: 21,
    meridianId: 'mer_te',
    noteZhHant:
      '亥時（21:00–23:00）傳統上配手少陽三焦經，為心包經流注後的下一條經，再回肺經成環。',
    noteEn:
      'The hour of 亥 (21:00–23:00) is traditionally paired with the Triple Energiser channel, the last in sequence before the cycle closes back on the Lung.',
  },
];

/** The sources this mapping and its wording are recorded against. */
export const SHICHEN_SOURCE = 'src_ziwu_liuzhu';
export const SHICHEN_SOURCES = [
  'src_ziwu_liuzhu',
  'src_owner_worksheet_ziwu_2026_08',
  'src_lingshu',
  'src_nanjing',
];

/**
 * 《針灸大成·十二經納地支歌》 — the mnemonic the mapping comes from.
 *
 * Shown as a traditional memory verse, not as something to be recited back:
 * the Flow view is a reference tab and sets no exercises.
 */
export const SHICHEN_VERSE = {
  zhHant: '肺寅大卯胃辰宮，脾巳心午小未中，申膀酉腎心包戌，亥焦子膽丑肝通。',
  en: 'Lung at 寅, Large Intestine at 卯, Stomach at 辰; Spleen at 巳, Heart at 午, Small Intestine at 未; Bladder at 申, Kidney at 酉, Pericardium at 戌; Triple Energiser at 亥, Gallbladder at 子, Liver at 丑.',
  attributionZhHant: '《針灸大成·十二經納地支歌》（明·楊繼洲）',
  attributionEn: '《針灸大成》, Song of the Twelve Channels Matched to the Earthly Branches (Yang Jizhou, Ming dynasty)',
};

/**
 * Why the displayed hours are ordinary clock hours.
 *
 * The classical scheme assumes 真太陽時 — true solar time, reckoned from the
 * sun's local transit — which drifts from standard time with longitude. The
 * owner's pass fixed clock time as the display basis precisely because this app
 * does not time anything; this note keeps that difference visible rather than
 * implying the two are the same.
 *
 * Rendered on the Sources & disclaimer page, alongside the rest of the Flow
 * tab's provenance, so the wording has one home rather than two.
 */
export const SOLAR_TIME_NOTE = {
  zhHant:
    '時間基準：「流注」分頁顯示的是鐘錶時間（當地標準時）。古典理論的「時」原以真太陽時為基準，與標準時因經度而有差距。本應用不作擇時之用，故不實作換算。',
  en: 'On the clock: the Flow tab displays ordinary clock hours in local standard time. The classical scheme reckons by true solar time, which drifts from standard time with longitude. This app times nothing, so no conversion is implemented.',
};

/** A classical gloss on the one pairing that surprises people. */
export const PERICARDIUM_NOTE = {
  meridianId: 'mer_pc',
  zhHant: '傳統說法：心包代心受邪，故戌時配心包經而非心經。',
  en: 'Traditionally explained by the pericardium standing in for the heart, which is why 戌 is paired with the Pericardium channel rather than the Heart.',
};

/**
 * Which double-hour a clock time falls in.
 *
 * 子 straddles midnight (23:00–01:00), so the hour is shifted by one before
 * being halved — otherwise 23:00 and 00:00 would land in different branches.
 */
export function shichenAtHour(hour: number): Shichen {
  return SHICHEN[Math.floor(((hour + 1) % 24) / 2)]!;
}

export const shichenAt = (d: Date): Shichen => shichenAtHour(d.getHours());

/** The two-hour window a branch covers, as display text. */
export function shichenHours(s: Shichen): string {
  const end = (s.startHour + 2) % 24;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(s.startHour)}:00–${pad(end)}:00`;
}

export const meridianOf = (s: Shichen): Meridian => meridianById.get(s.meridianId)!;

/** Step round the ring, wrapping in both directions. */
export const stepShichen = (index: number, by: number): number =>
  (((index + by) % SHICHEN.length) + SHICHEN.length) % SHICHEN.length;

/**
 * Every channel the clock names must exist and be one of the twelve regular
 * channels — the two midline vessels have no hour, since 子午流注 cycles the
 * twelve. Checked at module load so a bad edit fails loudly rather than
 * rendering an empty ring segment.
 */
const assigned = new Set(SHICHEN.map((s) => s.meridianId));
if (assigned.size !== 12) throw new Error('子午流注: each channel takes exactly one hour');
for (const s of SHICHEN) {
  if (!meridianById.has(s.meridianId)) throw new Error(`子午流注: unknown channel ${s.meridianId}`);
}
if (dataset.meridians.filter((m) => assigned.has(m.id)).length !== 12) {
  throw new Error('子午流注: the clock must cover the twelve regular channels');
}
