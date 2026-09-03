import type { Acupoint, Meridian } from './types';
import { dataset } from './index';
import { CONFLUENT_PAIRS, pointByCode } from './specific-points';
import { pathsFor, routeFor, type VesselPath, type VesselRoute } from './extraordinary-routes';

/**
 * 奇經八脈 — the eight extraordinary vessels.
 *
 * TWO DIFFERENT THINGS, and the distinction runs through this whole module:
 *
 * OWNING POINTS. Only 督脈 and 任脈 own points — GV1–GV29 and CV1–CV24 are
 * theirs, they are loaded as full channels, and `meridian` is non-null for
 * exactly those two. The other six own no points anywhere, in this dataset or
 * in the tradition.
 *
 * HAVING A ROUTE. All eight have one, and since the 2026-08-23 ingest all eight
 * can be drawn — because the sources name each vessel's 交會腧穴, the points of
 * the twelve regular channels that it crosses, and every one of those resolves
 * to a point this dataset already holds. So 衝脈 draws a line without owning a
 * single point on it. `paths` is non-empty for all eight; `meridian` is not.
 *
 * Confusing the two is the easy mistake here, and it is why 帶脈 needs saying
 * out loud: the Day 19 source record notes that 帶脈 is not loaded as a channel,
 * and that is still true — 帶脈 GB26 is a Gallbladder point that shares the
 * name. The vessel now has a drawn line through GB26, GB27 and GB28; it still
 * owns none of them.
 *
 * DERIVED, NOT RE-AUTHORED. Every name and pairing here is split out of
 * `CONFLUENT_PAIRS`, which is the reviewed record. Writing the eight vessels
 * out again by hand would create a second copy to drift; `extraordinary.test.ts`
 * asserts the split still reassembles into exactly what that record says.
 */

export interface ExtraordinaryVessel {
  /** 中文 name — 衝脈, 帶脈, … — and the stable key for this vessel. */
  zhHant: string;
  en: string;
  /** The 八脈交會穴 that opens it. */
  confluent: Acupoint;
  /** The vessel it is taught alongside; the pairs are one hand and one foot. */
  coupledWith: string;
  /**
   * This vessel's own channel record, when the dataset carries one. Only 督脈
   * and 任脈 do; for the other six it is null, and null means "the vessel owns
   * no points", never "the vessel has no course".
   */
  meridian: Meridian | null;
  /**
   * 循行, 主要病候, 交會腧穴 and the classical opening — for all eight now that
   * the owner has supplied sources. See `extraordinary-routes.ts`.
   */
  route: VesselRoute | null;
  /** The drawn line through this vessel's crossing points, split per view. */
  paths: VesselPath[];
}

/** Splits 「衝脈 · 陰維脈」 into its foot half and its hand half. */
const halves = (s: string): [string, string] => {
  const parts = s.split('·').map((x) => x.trim());
  return [parts[0] ?? '', parts[1] ?? ''];
};

/** The channel record whose name IS this vessel, if the dataset loads one. */
const channelFor = (zhHant: string): Meridian | null =>
  dataset.meridians.find((m) => m.nameZhHant === zhHant) ?? null;

/**
 * The eight, in the order the four coupled pairs are taught, foot point first.
 * That ordering is the one the 八脈交會 matrix already uses, so the atlas and
 * the matrix present them the same way round.
 */
export const EXTRAORDINARY_VESSELS: ExtraordinaryVessel[] = CONFLUENT_PAIRS.flatMap((pair) => {
  const [footZh, handZh] = halves(pair.vesselZhHant);
  const [footEn, handEn] = halves(pair.vesselEn);
  const build = (zhHant: string, en: string, code: string, coupledWith: string) => {
    const confluent = pointByCode(code);
    return confluent
      ? [
          {
            zhHant,
            en,
            confluent,
            coupledWith,
            meridian: channelFor(zhHant),
            route: routeFor(zhHant),
            paths: pathsFor(zhHant),
          },
        ]
      : [];
  };
  return [
    ...build(footZh, footEn, pair.foot, handZh),
    ...build(handZh, handEn, pair.hand, footZh),
  ];
});

/** One vessel by its 中文 name. */
export const vesselByName = (zhHant: string): ExtraordinaryVessel | null =>
  EXTRAORDINARY_VESSELS.find((v) => v.zhHant === zhHant) ?? null;

/** The eight confluent points, in the same order as the vessels they open. */
export const confluentPointIds = (): string[] =>
  EXTRAORDINARY_VESSELS.map((v) => v.confluent.id);

/**
 * The vessels that own points, i.e. are loaded as full channels — 督脈 and 任脈.
 * The other six are drawn through their 交會腧穴 instead: they have a line, but
 * they have no points of their own anywhere in this dataset.
 */
export const vesselsWithChannel = (): ExtraordinaryVessel[] =>
  EXTRAORDINARY_VESSELS.filter((v) => v.meridian !== null);

/** Every vessel the atlas can draw a line for. All eight, since the ingest. */
export const vesselsWithRoute = (): ExtraordinaryVessel[] =>
  EXTRAORDINARY_VESSELS.filter((v) => v.paths.length > 0);
