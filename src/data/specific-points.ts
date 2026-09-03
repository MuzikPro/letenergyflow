import { dataset } from './index';
import type { Acupoint, Meridian, PointClassification } from './types';

/**
 * The specific-point matrix — Day 11's 「特定穴攻防矩陣」.
 *
 * Every cell here is DERIVED from the classifications already reviewed on each
 * point record. Nothing is authored twice: if a classification changes, the
 * matrix changes with it, and a test asserts each category is still complete.
 *
 * The one thing the point records hold as prose rather than structure is WHICH
 * ORGAN a 募穴 or 背俞穴 belongs to — each record's reviewed note names it, but
 * in a sentence. `ORGAN_OF` normalises that, and a test checks it covers every
 * point actually carrying the classification, so the two cannot drift.
 */

export interface OrganLabel {
  zhHant: string;
  en: string;
}

/** 臟腑 the front-mu and back-shu points belong to, keyed by point code. */
export const ORGAN_OF: Record<string, OrganLabel> = {
  // 募穴 — only three (LU1, GB24, LR14) sit on their own organ's channel; the
  // other nine do not, six of them on the Conception vessel.
  LU1: { zhHant: '肺', en: 'lung' },
  ST25: { zhHant: '大腸', en: 'large intestine' },
  CV12: { zhHant: '胃', en: 'stomach' },
  LR13: { zhHant: '脾', en: 'spleen' },
  CV14: { zhHant: '心', en: 'heart' },
  CV4: { zhHant: '小腸', en: 'small intestine' },
  CV3: { zhHant: '膀胱', en: 'bladder' },
  GB25: { zhHant: '腎', en: 'kidney' },
  CV17: { zhHant: '心包', en: 'pericardium' },
  CV5: { zhHant: '三焦', en: 'triple burner' },
  GB24: { zhHant: '膽', en: 'gallbladder' },
  LR14: { zhHant: '肝', en: 'liver' },
  // 背俞穴 — all twelve on the Bladder's first line.
  BL13: { zhHant: '肺', en: 'lung' },
  BL14: { zhHant: '心包', en: 'pericardium' },
  BL15: { zhHant: '心', en: 'heart' },
  BL18: { zhHant: '肝', en: 'liver' },
  BL19: { zhHant: '膽', en: 'gallbladder' },
  BL20: { zhHant: '脾', en: 'spleen' },
  BL21: { zhHant: '胃', en: 'stomach' },
  BL22: { zhHant: '三焦', en: 'triple burner' },
  BL23: { zhHant: '腎', en: 'kidney' },
  BL25: { zhHant: '大腸', en: 'large intestine' },
  BL27: { zhHant: '小腸', en: 'small intestine' },
  BL28: { zhHant: '膀胱', en: 'bladder' },
};

/**
 * The twelve organs in flow order — the same sequence the Day 12 cycle card
 * recites. The mu/shu table is ordered by this rather than by point code, so
 * that reading down the table rehearses an order the learner already has.
 */
export const ORGAN_SEQUENCE = [
  'lung',
  'large intestine',
  'stomach',
  'spleen',
  'heart',
  'small intestine',
  'bladder',
  'kidney',
  'pericardium',
  'triple burner',
  'gallbladder',
  'liver',
] as const;

/** Front-mu points in organ-flow order, each with its organ's back-shu. */
export function muShuRows(): { organ: OrganLabel; mu: Acupoint; shu: Acupoint | undefined }[] {
  const mu = allWith('front_mu');
  const shu = allWith('back_shu');
  return ORGAN_SEQUENCE.map((organ) => {
    const m = mu.find((p) => ORGAN_OF[p.code]?.en === organ)!;
    return {
      organ: ORGAN_OF[m.code]!,
      mu: m,
      shu: shu.find((p) => ORGAN_OF[p.code]?.en === organ),
    };
  });
}

/** One organ's pair, or undefined for an organ name that is not one of the twelve. */
export function muShuPair(organEn: string): { organ: OrganLabel; mu: Acupoint; shu: Acupoint } | undefined {
  const row = muShuRows().find((r) => r.organ.en === organEn);
  return row && row.shu ? { organ: row.organ, mu: row.mu, shu: row.shu } : undefined;
}

/**
 * The vertebral level a back-shu point sits at, read out of its own 定位 text
 * rather than written down a second time.
 *
 * Ten of the twelve are counted from a thoracic or lumbar spinous process; the
 * last two are given as a sacral foramen instead, because that is what the
 * sacrum offers to a finger. Anything else returns null rather than a guess.
 */
export function vertebralLevelOf(shu: Acupoint): string | null {
  const loc = shu.location?.value.zhHant ?? '';
  const spinous = loc.match(/第\s*(\d+)\s*(胸|腰)椎棘突下/);
  if (spinous) return `${spinous[2] === '胸' ? 'T' : 'L'}${spinous[1]}`;
  const foramen = loc.match(/平第\s*(\d+)\s*骶後孔/);
  if (foramen) return `S${foramen[1]}`;
  return null;
}

/** What each of the eight influential points is influential FOR. */
export const INFLUENTIAL_OF: Record<string, OrganLabel> = {
  CV12: { zhHant: '腑會', en: 'the fu organs' },
  LR13: { zhHant: '臟會', en: 'the zang organs' },
  GB34: { zhHant: '筋會', en: 'sinew' },
  GB39: { zhHant: '髓會', en: 'marrow' },
  BL17: { zhHant: '血會', en: 'blood' },
  BL11: { zhHant: '骨會', en: 'bone' },
  LU9: { zhHant: '脈會', en: 'the vessels' },
  CV17: { zhHant: '氣會', en: 'qi' },
};

/**
 * The eight confluent points, as the four coupled pairs they are taught in.
 * Each pair is one hand point and one foot point opening one extraordinary
 * vessel each.
 */
export const CONFLUENT_PAIRS: {
  foot: string;
  hand: string;
  vesselZhHant: string;
  vesselEn: string;
}[] = [
  { foot: 'SP4', hand: 'PC6', vesselZhHant: '衝脈 · 陰維脈', vesselEn: 'Penetrating · Yin Linking' },
  { foot: 'BL62', hand: 'SI3', vesselZhHant: '陽蹻脈 · 督脈', vesselEn: 'Yang Motility · Governor' },
  { foot: 'GB41', hand: 'TE5', vesselZhHant: '帶脈 · 陽維脈', vesselEn: 'Girdle · Yang Linking' },
  { foot: 'KI6', hand: 'LU7', vesselZhHant: '陰蹻脈 · 任脈', vesselEn: 'Yin Motility · Conception' },
];

/** The twelve regular channels, in flow order. Excludes the two vessels. */
export const REGULAR_CHANNELS: Meridian[] = dataset.meridians.filter(
  (m) => m.id !== 'mer_cv' && m.id !== 'mer_gv',
);

const byCode = new Map(dataset.acupoints.map((p) => [p.code, p]));

/** Points on one channel carrying a given classification, in route order. */
export function pointsWith(
  meridianId: string,
  category: PointClassification,
): Acupoint[] {
  return dataset.acupoints.filter(
    (p) => p.meridianId === meridianId && p.classifications?.value.includes(category),
  );
}

/** Every point carrying a classification, across all channels, in route order. */
export function allWith(category: PointClassification): Acupoint[] {
  return dataset.acupoints.filter((p) => p.classifications?.value.includes(category));
}

export const pointByCode = (code: string) => byCode.get(code);

/** The five-shu sequence, in the order the curriculum recites it. */
export const FIVE_SHU: { key: PointClassification; zhHant: string; en: string }[] = [
  { key: 'jing_well', zhHant: '井', en: 'Jing-well' },
  { key: 'ying_spring', zhHant: '滎', en: 'Ying-spring' },
  { key: 'shu_stream', zhHant: '輸', en: 'Shu-stream' },
  { key: 'jing_river', zhHant: '經', en: 'Jing-river' },
  { key: 'he_sea', zhHant: '合', en: 'He-sea' },
];

/** The four single-point categories taught together as 原絡郄募. */
export const FOUR_SINGLES: { key: PointClassification; zhHant: string; en: string }[] = [
  { key: 'yuan_source', zhHant: '原', en: 'Yuan-source' },
  { key: 'luo_connecting', zhHant: '絡', en: 'Luo-connecting' },
  { key: 'xi_cleft', zhHant: '郄', en: 'Xi-cleft' },
];
