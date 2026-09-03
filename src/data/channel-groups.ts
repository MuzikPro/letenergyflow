import type { Meridian } from './types';
import { dataset } from './index';

/**
 * The standard ways of carving up the twelve channels.
 *
 * DERIVED, NOT AUTHORED. Every grouping here is read out of the reviewed
 * channel names: 手太陰肺經 is a hand channel because the name begins 手, and a
 * yin channel because it contains 陰. Writing the memberships out by hand would
 * create a second copy of something the data already states, and the twelve are
 * exactly the set the tradition names this way — which is why `TWELVE` is
 * defined by exclusion of the two vessels rather than by a list of codes.
 *
 * 表裡 IS 陰陽, so it is not offered as a separate split. Each yin channel pairs
 * with one yang channel — 裡 with 表 — so "show the 表 channels" and "show the
 * 陽 channels" select exactly the same six. What 表裡 does give that 陰陽 does
 * not is the PAIRING: six couples, each one yin and one yang, and those are
 * offered as `PAIRS`.
 */

/** The twelve regular channels. CV and GV are 奇經 and belong to neither half. */
export const TWELVE: Meridian[] = dataset.meridians.filter(
  (m) => m.id !== 'mer_cv' && m.id !== 'mer_gv',
);

export const isHand = (m: Meridian): boolean => m.nameZhHant.startsWith('手');
export const isFoot = (m: Meridian): boolean => m.nameZhHant.startsWith('足');
/** 太陰, 少陰, 厥陰 — the interior (裡) half. */
export const isYin = (m: Meridian): boolean => m.nameZhHant.includes('陰');
/** 陽明, 太陽, 少陽 — the exterior (表) half. */
export const isYang = (m: Meridian): boolean => m.nameZhHant.includes('陽');

export interface ChannelGroup {
  id: string;
  zhHant: string;
  en: string;
  /** The channels it selects. */
  members: Meridian[];
}

const group = (id: string, zhHant: string, en: string, pick: (m: Meridian) => boolean) => ({
  id,
  zhHant,
  en,
  members: TWELVE.filter(pick),
});

/** The two-way splits, and the four-way grid they cross into. */
export const CHANNEL_GROUPS: ChannelGroup[] = [
  group('yin', '陰經', 'Yin', isYin),
  group('yang', '陽經', 'Yang', isYang),
  group('hand', '手經', 'Hand', isHand),
  group('foot', '足經', 'Foot', isFoot),
  group('hand_yin', '手三陰', 'Hand yin', (m) => isHand(m) && isYin(m)),
  group('hand_yang', '手三陽', 'Hand yang', (m) => isHand(m) && isYang(m)),
  group('foot_yin', '足三陰', 'Foot yin', (m) => isFoot(m) && isYin(m)),
  group('foot_yang', '足三陽', 'Foot yang', (m) => isFoot(m) && isYang(m)),
];

export interface ChannelPair {
  /** The interior (yin) member. */
  yin: Meridian;
  /** The exterior (yang) member. */
  yang: Meridian;
}

/**
 * The six 表裡 couples, each one yin channel and its yang partner.
 *
 * Built from `pairedMeridianId`, which the records already carry, and emitted
 * once per couple rather than twice — keyed off the yin member so LU·LI and
 * LI·LU cannot both appear.
 */
export const PAIRS: ChannelPair[] = TWELVE.filter(isYin)
  .map((yin) => {
    const yang = dataset.meridians.find((m) => m.id === yin.pairedMeridianId);
    return yang ? { yin, yang } : null;
  })
  .filter((p): p is ChannelPair => p !== null);

/** The two 奇經 that are loaded as channels and appear in the layer list. */
export const VESSEL_CHANNELS: Meridian[] = dataset.meridians.filter(
  (m) => m.id === 'mer_cv' || m.id === 'mer_gv',
);
