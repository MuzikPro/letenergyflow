import { describe, expect, it } from 'vitest';
import { dataset } from './index';
import {
  BODY_REGIONS,
  meridiansInRegion,
  pointsInRegion,
  regionByKey,
  regionOfPoint,
  unclaimedRegionValues,
} from './regions';

/**
 * The region taxonomy is derived from each point's reviewed `bodyRegion`, so
 * these tests guard the derivation rather than the anatomy: a point must land
 * in exactly one region, and a new `bodyRegion` value must not be able to
 * appear without a home. That last case is the dangerous one — it would drop a
 * point out of the detail curriculum with nothing to say so.
 */
describe('body region taxonomy', () => {
  it('claims every bodyRegion value in the dataset', () => {
    expect(unclaimedRegionValues()).toEqual([]);
  });

  it('gives every acupoint exactly one region', () => {
    const homeless = dataset.acupoints.filter((p) => !regionOfPoint(p));
    expect(homeless.map((p) => p.code)).toEqual([]);
  });

  it('partitions the points — no point counted twice, none lost', () => {
    const counted = BODY_REGIONS.flatMap((r) => pointsInRegion(r.key).map((p) => p.code));
    expect(new Set(counted).size).toBe(counted.length);
    expect(counted.length).toBe(dataset.acupoints.length);
  });

  it('has no empty region — an empty region is not a lesson', () => {
    for (const region of BODY_REGIONS) {
      expect(pointsInRegion(region.key).length).toBeGreaterThan(0);
    }
  });

  it('uses unique keys', () => {
    const keys = BODY_REGIONS.map((r) => r.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('derives the channels passing through a region from its points', () => {
    const wrist = meridiansInRegion('wrist_hand').map((m) => m.id);
    // Six channels reach the hand: LU PC HT on the palmar side, LI TE SI on
    // the dorsal. No leg channel does — that was a factual error in an early
    // draft of the Day 14 lesson, and this asserts the data disagrees with it.
    expect([...wrist].sort()).toEqual([
      'mer_ht', 'mer_li', 'mer_lu', 'mer_pc', 'mer_si', 'mer_te',
    ]);
  });

  it('resolves a region by key and not by a stale one', () => {
    expect(regionByKey('wrist_hand')?.nameEn).toBe('Wrist & hand');
    expect(regionByKey('no_such_region')).toBeUndefined();
    expect(pointsInRegion('no_such_region')).toEqual([]);
  });
});
