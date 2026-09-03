import { describe, expect, it } from 'vitest';
import { courseIndex, regionOfDay, regionsWithoutADay } from './course';
import { dataset } from './index';
import { BODY_REGIONS, meridiansInRegion, pointsInRegion } from './regions';

const day = (n: number) => dataset.curriculumDays.find((d) => d.dayNumber === n)!;

describe('course index — the mapping is derived, not declared', () => {
  it('gives every region exactly one day, and leaves none unread', () => {
    expect(regionsWithoutADay()).toEqual([]);
    const keys = dataset.curriculumDays
      .map((d) => regionOfDay(d)?.key)
      .filter((k): k is string => Boolean(k));
    expect(keys.length).toBe(BODY_REGIONS.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('splits the course into thirteen channel days and thirteen regional ones', () => {
    const withRegion = dataset.curriculumDays.filter((d) => regionOfDay(d));
    const without = dataset.curriculumDays.filter((d) => !regionOfDay(d));
    expect(withRegion.map((d) => d.dayNumber)).toEqual([
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    ]);
    expect(without.map((d) => d.dayNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  it('breaks the two channel-set ties with the day’s own cited points', () => {
    // The forearm and the hand carry the same six arm channels; the lower leg
    // and the foot the same six leg channels. Signature alone cannot separate
    // either pair, so a wrong tiebreak would silently swap these four.
    const tied: Array<[string, string]> = [
      ['elbow_forearm', 'wrist_hand'],
      ['knee_lower_leg', 'ankle_foot'],
    ];
    for (const [a, b] of tied) {
      const sig = (k: string) =>
        meridiansInRegion(k)
          .map((m) => m.id)
          .sort()
          .join(',');
      expect({ pair: `${a}/${b}`, same: sig(a) === sig(b) }).toEqual({
        pair: `${a}/${b}`,
        same: true,
      });
    }
    expect(regionOfDay(day(14))?.key).toBe('wrist_hand');
    expect(regionOfDay(day(15))?.key).toBe('elbow_forearm');
    expect(regionOfDay(day(20))?.key).toBe('knee_lower_leg');
    expect(regionOfDay(day(25))?.key).toBe('ankle_foot');
  });

  it('counts a region’s points on a regional day and a channel’s on a channel day', () => {
    const entries = courseIndex();
    expect(entries.length).toBe(dataset.curriculumDays.length);
    for (const e of entries) {
      if (e.region) {
        expect({ n: e.day.dayNumber, count: e.pointCount }).toEqual({
          n: e.day.dayNumber,
          count: pointsInRegion(e.region.key).length,
        });
      } else {
        const onChannels = dataset.acupoints.filter((p) =>
          e.day.meridianIds.includes(p.meridianId),
        ).length;
        expect({ n: e.day.dayNumber, count: e.pointCount }).toEqual({
          n: e.day.dayNumber,
          count: onChannels,
        });
      }
    }
  });

  it('resolves every channel it lists', () => {
    for (const e of courseIndex()) {
      expect({ n: e.day.dayNumber, listed: e.channels.length }).toEqual({
        n: e.day.dayNumber,
        listed: e.day.meridianIds.length,
      });
    }
  });

  it('covers all 362 points across the thirteen regional days', () => {
    const seen = new Set<string>();
    for (const e of courseIndex()) {
      if (!e.region) continue;
      for (const p of pointsInRegion(e.region.key)) seen.add(p.id);
    }
    expect(seen.size).toBe(dataset.acupoints.length);
  });
});
