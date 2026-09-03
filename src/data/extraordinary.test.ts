import { describe, expect, it } from 'vitest';
import { dataset } from './index';
import { CONFLUENT_PAIRS } from './specific-points';
import {
  EXTRAORDINARY_VESSELS,
  confluentPointIds,
  vesselByName,
  vesselsWithChannel,
  vesselsWithRoute,
} from './extraordinary';
import { crossingPointsOf } from './extraordinary-routes';
import { sheetOpenFor } from '../components/DetailPanel';

/**
 * 奇經八脈 on the atlas.
 *
 * Two things need guarding. First that the eight are DERIVED from the reviewed
 * 八脈交會穴 record rather than typed out again — a second copy would drift, and
 * a wrong point-to-vessel mapping is the kind of error that looks fine on
 * screen. Second that six of the eight never acquire a route: this dataset does
 * not carry one for them, and a line drawn for 衝脈 or 帶脈 would be invented.
 */

describe('the eight extraordinary vessels', () => {
  it('has eight, all distinct', () => {
    expect(EXTRAORDINARY_VESSELS).toHaveLength(8);
    expect(new Set(EXTRAORDINARY_VESSELS.map((v) => v.zhHant)).size).toBe(8);
    expect(new Set(EXTRAORDINARY_VESSELS.map((v) => v.en)).size).toBe(8);
    expect(new Set(confluentPointIds()).size).toBe(8);
  });

  it('reassembles exactly into the reviewed confluent record', () => {
    /*
     * The derivation splits 「衝脈 · 陰維脈」 into a foot half and a hand half. If
     * that split ever mis-parses — a different separator, a reordered pair —
     * putting it back together stops matching, and this is where that shows.
     */
    for (const pair of CONFLUENT_PAIRS) {
      const foot = EXTRAORDINARY_VESSELS.find((v) => v.confluent.code === pair.foot);
      const hand = EXTRAORDINARY_VESSELS.find((v) => v.confluent.code === pair.hand);
      expect({ code: pair.foot, found: Boolean(foot) }).toEqual({ code: pair.foot, found: true });
      expect({ code: pair.hand, found: Boolean(hand) }).toEqual({ code: pair.hand, found: true });
      expect(`${foot!.zhHant} · ${hand!.zhHant}`).toBe(pair.vesselZhHant);
      expect(`${foot!.en} · ${hand!.en}`).toBe(pair.vesselEn);
    }
  });

  it('opens each vessel with a point the dataset actually classifies as confluent', () => {
    // The mapping is only worth anything if the point really carries the
    // classification. Reading it back off the point record is what makes this
    // a check rather than a restatement.
    for (const v of EXTRAORDINARY_VESSELS) {
      const cls = (v.confluent.classifications?.value ?? []) as readonly string[];
      expect({ vessel: v.zhHant, code: v.confluent.code, confluent: cls.includes('confluent') }).toEqual(
        { vessel: v.zhHant, code: v.confluent.code, confluent: true },
      );
    }
  });

  it('pairs the vessels symmetrically', () => {
    for (const v of EXTRAORDINARY_VESSELS) {
      const partner = vesselByName(v.coupledWith);
      expect({ v: v.zhHant, partner: partner?.zhHant }).toEqual({
        v: v.zhHant,
        partner: v.coupledWith,
      });
      expect(partner!.coupledWith).toBe(v.zhHant);
    }
  });

  it('separates owning points from having a route', () => {
    /*
     * The distinction the whole feature turns on. 督脈 and 任脈 own points —
     * GV1–GV29, CV1–CV24 — and are loaded as channels. The other six own none,
     * anywhere, and never will: in the tradition they cross the points of the
     * twelve rather than having their own. Since the ingest all eight can be
     * DRAWN, because the sources name the crossings. If these two sets are ever
     * conflated, six vessels silently acquire points they do not have.
     */
    expect(vesselsWithChannel().map((v) => v.zhHant).sort()).toEqual(['任脈', '督脈']);
    expect(vesselsWithRoute()).toHaveLength(8);
    expect(vesselByName('督脈')!.meridian!.id).toBe('mer_gv');
    expect(vesselByName('任脈')!.meridian!.id).toBe('mer_cv');
    for (const name of ['衝脈', '帶脈', '陰蹻脈', '陽蹻脈', '陰維脈', '陽維脈']) {
      const v = vesselByName(name)!;
      expect({ name, owns: v.meridian }).toEqual({ name, owns: null });
      expect({ name, drawn: v.paths.length > 0 }).toEqual({ name, drawn: true });
    }
  });

  it('draws every line through points that already exist', () => {
    /*
     * The reason a route could be ingested at all without inventing a
     * coordinate: every 交會腧穴 the sources name resolves to a point this
     * dataset already holds, with a reviewed placement. crossingPointsOf throws
     * on a name it cannot resolve, so this walks all eight.
     */
    let total = 0;
    for (const v of EXTRAORDINARY_VESSELS) {
      const pts = crossingPointsOf(v.zhHant);
      expect({ vessel: v.zhHant, n: pts.length > 0 }).toEqual({ vessel: v.zhHant, n: true });
      for (const p of pts) {
        expect({ vessel: v.zhHant, code: p.code, placed: p.placements.length > 0 }).toEqual({
          vessel: v.zhHant,
          code: p.code,
          placed: true,
        });
      }
      total += pts.length;
    }
    expect(total).toBe(75);
  });

  it('keeps the modern crossings and the classical wording in separate fields', () => {
    /*
     * The owner asked for 《奇經八脈考》 and supplied both a modern study sheet
     * and the classical text. They disagree — 李時珍 adds 章門 to 帶脈 and 然谷
     * to 陰蹻脈 — so the two must never be merged into one field. The crossings
     * are the study sheet's; classicalZhHant is 李時珍's, and 帶脈 not naming
     * 章門 among its crossings is the cheapest proof they were kept apart.
     */
    for (const v of EXTRAORDINARY_VESSELS) {
      expect({ vessel: v.zhHant, classical: Boolean(v.route?.classicalZhHant) }).toEqual({
        vessel: v.zhHant,
        classical: true,
      });
    }
    expect(vesselByName('帶脈')!.route!.crossings).toEqual(['GB26', 'GB27', 'GB28']);
    expect(vesselByName('帶脈')!.route!.classicalZhHant).toContain('章門');
    expect(vesselByName('陰蹻脈')!.route!.crossings).not.toContain('KI2');
    expect(vesselByName('陰蹻脈')!.route!.classicalZhHant).toContain('然谷');
  });
});

describe('adding it changed nothing else', () => {
  it('loads no new channel and no new point', () => {
    // The six route-less vessels are represented, not ingested. If this feature
    // ever starts inventing records, the counts move first.
    expect(dataset.meridians).toHaveLength(14);
    expect(dataset.acupoints).toHaveLength(362);
  });

  it('opens a sheet for one vessel and none for all eight', () => {
    /*
     * A single vessel has a subject the panel can be about — its 循行, its
     * 主要病候, the crossings its line runs through. All eight at once does not,
     * and the atlas caption already says what that layer shows; opening an
     * empty sheet there would also slide the viewer controls aside for nothing.
     *
     * This flipped when the routes were ingested. Before that a vessel had no
     * content either, and the test asserted the opposite.
     */
    expect(sheetOpenFor({ kind: 'extraordinary', vessel: null })).toBe(false);
    expect(sheetOpenFor({ kind: 'extraordinary', vessel: '衝脈' })).toBe(true);
    // A name that resolves to nothing must not open one.
    expect(sheetOpenFor({ kind: 'extraordinary', vessel: '沒有這條脈' })).toBe(false);
  });

  it('leaves the confluent points on their own channels', () => {
    // A vessel is opened BY a point of the twelve; the point does not move to
    // the vessel. 公孫 stays a Spleen point.
    expect(vesselByName('衝脈')!.confluent.meridianId).toBe('mer_sp');
    expect(vesselByName('陽維脈')!.confluent.meridianId).toBe('mer_te');
    expect(vesselByName('督脈')!.confluent.meridianId).toBe('mer_si');
  });
});
