import { acupointById, dataset } from './index';
import { BODY_REGIONS, meridiansInRegion, pointsInRegion, regionOfPoint } from './regions';
import type { BodyRegion } from './regions';
import type { CurriculumDay, Meridian } from './types';
import { meridianById } from './index';

/**
 * The course index — twenty-six days, and which of the thirteen regions each
 * of the later ones reads.
 *
 * Nothing here is authored. A day already declares the channels it teaches,
 * and a region already knows the channels that cross it, so a regional day is
 * simply one whose channel set *is* some region's channel set. Two pairs of
 * neighbouring regions share a channel set exactly — the forearm and the hand
 * carry the same six arm channels, the lower leg and the foot the same six leg
 * channels — and those ties are broken by which of the two candidate regions
 * holds more of the points the day's own cards and quiz items cite.
 *
 * The consequence worth knowing: renumber the course, move a point between
 * regions, or change a day's channel list, and this index follows. It cannot
 * drift out of step with the curriculum because there is nothing to keep in
 * step — it is the curriculum, read a second way.
 */

const sortedKey = (ids: readonly string[]): string => [...ids].sort().join(',');

/** Region key → the channels crossing it, as a sorted signature. */
const regionSignature = new Map<string, string>(
  BODY_REGIONS.map((r) => [r.key, sortedKey(meridiansInRegion(r.key).map((m) => m.id))]),
);

/** Every acupoint id a day's flashcards and quiz items point at. */
export function citedPointIds(dayId: string): string[] {
  const ids = new Set<string>();
  for (const f of dataset.flashcards) {
    if (f.dayId === dayId) f.relatedAcupointIds.forEach((id) => ids.add(id));
  }
  for (const q of dataset.quizItems) {
    if (q.dayId !== dayId) continue;
    q.relatedAcupointIds.forEach((id) => ids.add(id));
    if (q.targetAcupointId) ids.add(q.targetAcupointId);
  }
  return [...ids];
}

/** How many of a day's cited points fall inside a given region. */
function citedInRegion(dayId: string, regionKey: string): number {
  let n = 0;
  for (const id of citedPointIds(dayId)) {
    const p = acupointById.get(id);
    if (p && regionOfPoint(p)?.key === regionKey) n += 1;
  }
  return n;
}

/**
 * The region a day reads, or undefined for the thirteen channel days, whose
 * channel set matches no region.
 */
export function regionOfDay(day: CurriculumDay): BodyRegion | undefined {
  const signature = sortedKey(day.meridianIds);
  if (!signature) return undefined;
  const candidates = BODY_REGIONS.filter((r) => regionSignature.get(r.key) === signature);
  if (candidates.length === 0) return undefined;
  if (candidates.length === 1) return candidates[0];
  // A tie between two regions that carry the same channels: the day's own
  // cited points say which one it is actually about.
  return [...candidates].sort(
    (a, b) => citedInRegion(day.id, b.key) - citedInRegion(day.id, a.key),
  )[0];
}

export interface CourseEntry {
  day: CurriculumDay;
  /** The region this day reads; absent on the channel days. */
  region?: BodyRegion;
  channels: Meridian[];
  /**
   * Points in the region, for a regional day. Channel days count the points of
   * the channels they teach instead — the two are different questions and the
   * label in the UI says which is being answered.
   */
  pointCount: number;
}

export function courseIndex(): CourseEntry[] {
  return dataset.curriculumDays.map((day) => {
    const region = regionOfDay(day);
    const channels = day.meridianIds
      .map((id) => meridianById.get(id))
      .filter((m): m is Meridian => Boolean(m));
    const pointCount = region
      ? pointsInRegion(region.key).length
      : dataset.acupoints.filter((p) => day.meridianIds.includes(p.meridianId)).length;
    return { day, region, channels, pointCount };
  });
}

/** Regions no day reads. Empty is the acceptance bar; a test asserts it. */
export function regionsWithoutADay(): string[] {
  const claimed = new Set(
    dataset.curriculumDays.map((d) => regionOfDay(d)?.key).filter(Boolean) as string[],
  );
  return BODY_REGIONS.filter((r) => !claimed.has(r.key)).map((r) => r.key);
}
