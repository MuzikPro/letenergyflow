import { describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { ATLAS_HEIGHT, denorm, LIMB_GUIDES, onExtremity } from './atlas';

/**
 * Placement plausibility, checked against the figure's own landmarks.
 *
 * These are NOT anatomical-accuracy tests — markers remain
 * `schematic_unvalidated`. They assert that a marker sits where its own
 * reviewed location text says it should, using the standard proportional
 * measures the curriculum uses (forearm crease-to-crease 12 cun, hip-to-knee
 * 19 cun, knee-to-ankle 16 cun). They exist because the Day 2 thigh points
 * were once spread evenly up the thigh instead of clustering near the knee.
 */

const y = (code: string) => {
  const p = acupointById.get(`pt_${code.toLowerCase()}`)!;
  const pl = p.placements.find((x) => x.view === 'front')!;
  return denorm(pl.x, pl.y).y;
};

/** Tolerance in cun; a schematic only has to be in the right neighbourhood. */
const TOL = 1.2;

describe('marker placement matches the reviewed location text', () => {
  it('places forearm points at their stated distance above the wrist crease', () => {
    const elbow = y('LU5');
    const wrist = y('LU9');
    const cun = (wrist - elbow) / 12;
    const above = (code: string) => (wrist - y(code)) / cun;
    expect(above('LU8')).toBeCloseTo(1, 0); // 腕橫紋上 1 寸
    expect(Math.abs(above('LU7') - 1.5)).toBeLessThan(TOL); // 上 1.5 寸
    expect(Math.abs(above('LU6') - 7)).toBeLessThan(TOL); // 上 7 寸
  });

  it('clusters the lower-thigh points near the knee, not up the thigh', () => {
    // The exact distances are asserted in landmark.test.ts, which measures them
    // from 髕底 — the superior patellar border the standard actually names.
    // Measuring from 犢鼻 (the inferior border) as this test once did put all
    // three 2 cun too high. What is checked here is only the gross shape: the
    // three sit in the lower half of the thigh, in order.
    const hip = LIMB_GUIDES.legLeft[0][1];
    const knee = y('ST35');
    for (const c of ['ST32', 'ST33', 'ST34']) expect(y(c)).toBeGreaterThan(hip + (knee - hip) / 2);
    expect(y('ST32')).toBeLessThan(y('ST33'));
    expect(y('ST33')).toBeLessThan(y('ST34'));
    expect(y('ST34')).toBeLessThan(knee);
  });

  it('places the lower-leg points at their stated distance below the knee', () => {
    const knee = y('ST35');
    const ankle = LIMB_GUIDES.legLeft[2][1];
    const cun = (ankle - knee) / 16;
    const below = (code: string) => (y(code) - knee) / cun;
    expect(Math.abs(below('ST36') - 3)).toBeLessThan(TOL); // 犢鼻下 3 寸
    expect(Math.abs(below('ST37') - 6)).toBeLessThan(TOL); // 下 6 寸
    expect(Math.abs(below('ST38') - 8)).toBeLessThan(TOL); // 下 8 寸
    expect(Math.abs(below('ST39') - 9)).toBeLessThan(TOL); // 下 9 寸
    // 豐隆: level with 條口 (8 cun above the malleolus) and lateral to it.
    expect(Math.abs(y('ST40') - y('ST38'))).toBeLessThan(cun * TOL);
    const xOf = (c: string) =>
      denorm(
        acupointById.get(`pt_${c.toLowerCase()}`)!.placements[0]!.x,
        acupointById.get(`pt_${c.toLowerCase()}`)!.placements[0]!.y,
      ).x;
    expect(xOf('ST40')).toBeGreaterThan(xOf('ST38'));
  });

  it('places 中府 below 雲門, the Lung channel’s one documented upward step', () => {
    // GB/T 12346-2021 via the owner worksheet: LU1 中府 is 雲門下 1 寸, so the
    // channel's first station sits BELOW its second before descending the arm.
    expect(y('LU1')).toBeGreaterThan(y('LU2'));
  });

  it('climbs the face loop before the Stomach channel turns down the neck', () => {
    // 「環繞口唇（大迎、頰車），沿下頜角（下關）上行至耳前（頭維）」 — the face
    // section legitimately rises from the jaw to the hairline corner, then the
    // neck branch descends from 人迎 ST9 onward.
    expect(y('ST6')).toBeLessThan(y('ST5')); // 頰車 above 大迎
    expect(y('ST8')).toBeLessThan(y('ST7')); // 頭維 above 下關
    expect(y('ST9')).toBeGreaterThan(y('ST8')); // neck branch turns back down
  });

  it('drops 大包 back down the flank after the Spleen chest ladder', () => {
    // SP17–SP20 climb the 5th → 2nd intercostal spaces, then SP21 大包 sits on
    // the mid-axillary line at the 6th space — lower and further lateral. The
    // channel's last station legitimately steps back down.
    expect(y('SP20')).toBeLessThan(y('SP17')); // ladder climbs
    expect(y('SP21')).toBeGreaterThan(y('SP17')); // 大包 drops below it
  });

  it('keeps each meridian ordered head-to-tail without doubling back', () => {
    // Markers should progress monotonically along the route direction; an
    // unexpected reversal means a mis-placed station. Three documented
    // non-sequential stations are excluded and asserted separately above:
    // LU1→LU2, the ST face loop, 豐隆 ST40 (level with 條口 ST38 and lateral to
    // it, so it sits slightly above 下巨虛 ST39), and 大包 SP21 (6th intercostal
    // space, below the SP17–SP20 ladder).
    const START: Record<string, number> = { mer_lu: 1, mer_st: 8 };
    // 太溪 KI3 is the hub of an ankle cluster the numbering circles rather than
    // walks: 大鐘 KI4 sits 0.5 寸 below it, 水泉 KI5 a further 0.5 寸 down, and
    // 照海 KI6 back up at the malleolus's lower border. 交信 KI8 is level with
    // 復溜 KI7 — both are 太溪上 2 寸, KI8 merely 0.5 寸 anterior. None of the
    // four is a mis-placement, so all four are excluded and the channel's walk
    // is asserted over its remaining stations.
    const SKIP = new Set([
      'pt_st40',
      'pt_sp21',
      'pt_ki4',
      'pt_ki5',
      'pt_ki6',
      'pt_ki8',
      // 會宗 TE7 is level with 支溝 TE6 — both 腕背橫紋上 3 寸, 會宗 differing
      // only in sitting on the ulnar border rather than between the two bones.
      'pt_te7',
      // 環跳 GB30 sits marginally above 居髎 GB29 — both are hip stations found
      // from the greater trochanter, and their order is by numbering, not by
      // height. 外丘 GB36 is level with 陽交 GB35: both 外踝尖上 7 寸, one at the
      // front border of the fibula and one at the back.
      'pt_gb30',
      'pt_gb36',
    ]);
    // Channels whose numbering is not one monotonic walk are checked segment by
    // segment. SI climbs the arm, then 繞肩胛 "circles the scapula" — 天宗 SI11
    // sits in the middle of the scapular fossa, below 臑俞 SI10, so the circuit
    // is its own segment — then continues up the neck and face. BL runs down
    // the first back line and the leg, returns to the top of the second line,
    // then continues down the calf.
    const SEGMENTS: Record<string, { from: number; to: number; upward: boolean }[]> = {
      mer_si: [
        { from: 1, to: 10, upward: true },
        { from: 11, to: 15, upward: true },
        { from: 16, to: 19, upward: true },
      ],
      // TE climbs the arm, crosses to the back for 天髎 TE15 alone, then runs up
      // the neck and behind the ear — and its route text explicitly doubles the
      // branch back down in front of the ear (「屈折下行至頰部」), so 耳門 TE21
      // sits BELOW 角孫 TE20 by design.
      // GB weaves across the head by design — 「側線部隊」 climbs the temple,
      // drops behind the ear, returns to the forehead hairline and crosses the
      // scalp before descending the occiput. Each leg of that weave is its own
      // segment; none of them is a mis-placement.
      // CV runs upward from the perineum to the chin. GV runs upward the spine
      // and over the vertex, then turns DOWN the face — 素髎 GV25 on the nose
      // sits far below 百會 GV20. The turn is at GV20.
      mer_cv: [{ from: 1, to: 24, upward: true }],
      mer_gv: [
        { from: 1, to: 20, upward: true },
        // 印堂 GV29 is excluded from this run: GB/T appended it at the END of
        // the numbering, but it sits between the brows, well ABOVE 齦交 GV28 at
        // the lip. That is exactly why the vessel has two stated termini — GV28
        // by number, GV29 by the direction of flow.
        { from: 21, to: 28, upward: false },
      ],
      mer_gb: [
        { from: 1, to: 3, upward: false }, // 目外眥 → 耳前
        { from: 4, to: 7, upward: false }, // 頭維 → 曲鬢, down the temple curve
        { from: 8, to: 9, upward: true }, // 率谷 → 天衝, deeper inside the hairline
        { from: 10, to: 12, upward: false }, // 浮白 → 完骨, down behind the ear
        { from: 13, to: 14, upward: false }, // 本神 → 陽白, hairline to brow
        { from: 15, to: 18, upward: true }, // 頭臨泣 → 承靈, up over the scalp
        { from: 19, to: 28, upward: false }, // 腦空 → 維道, occiput to flank
        { from: 29, to: 44, upward: false }, // 居髎 → 足竅陰, hip to toe
      ],
      mer_te: [
        { from: 1, to: 14, upward: true },
        { from: 15, to: 15, upward: true },
        { from: 16, to: 20, upward: true },
        { from: 21, to: 23, upward: true },
      ],
      mer_bl: [
        { from: 1, to: 8, upward: true }, // inner canthus up over the vertex
        { from: 9, to: 30, upward: false }, // occiput down the first back line
        { from: 31, to: 35, upward: false }, // 八髎 restart at the S1 foramen
        { from: 36, to: 40, upward: false }, // buttock to the popliteal crease
        { from: 41, to: 54, upward: false }, // second back line, from T2 again
        { from: 55, to: 67, upward: false }, // calf, heel, lateral foot
      ],
    };

    const yOf = (id: string) => {
      const pl = acupointById.get(id)!.placements[0]!;
      return denorm(pl.x, pl.y).y;
    };
    const countReversals = (ys: number[], upward: boolean) =>
      ys.slice(1).filter((v, i) => (upward ? v > ys[i]! : v < ys[i]!)).length;

    for (const m of dataset.meridians) {
      const segs = SEGMENTS[m.id];
      const reversals = segs
        ? segs.reduce(
            (n, seg) =>
              n +
              countReversals(
                m.pointOrder.slice(seg.from - 1, seg.to).filter((id) => !SKIP.has(id)).map(yOf),
                seg.upward,
              ),
            0,
          )
        : countReversals(
            m.pointOrder
              .slice(START[m.id] ?? 0)
              .filter((id) => !SKIP.has(id))
              .map(yOf),
            // LI, SP, KI and LR run proximally (upward); the rest run distally.
            m.id === 'mer_li' || m.id === 'mer_sp' || m.id === 'mer_ki' || m.id === 'mer_lr',
          );
      expect({ meridian: m.code, reversals }).toEqual({ meridian: m.code, reversals: 0 });
    }
  });

  it('keeps every marker inside the figure canvas', () => {
    for (const p of dataset.acupoints) {
      for (const pl of p.placements) {
        expect(denorm(pl.x, pl.y).y).toBeLessThan(ATLAS_HEIGHT);
        expect(pl.x).toBeGreaterThan(0);
      }
    }
  });

  it('keeps every hand and foot marker on the drawn digit, not past its tip', () => {
    // 少商, 商陽, 少沖, 厲兌 and 隱白 were once written beyond the fingertip or
    // toe tip and floated outside the silhouette. These are the local-frame
    // coordinates the markers are built from, checked against the drawn shapes.
    const HAND: [string, number, number][] = [
      ['LU9', 8, 3], ['LU10', 14, 20], ['LU11', 29, 34],
      ['LI1', 16, 67], ['LI2', 14.5, 46], ['LI3', 14, 37], ['LI4', 13, 26], ['LI5', 10, 5],
      ['HT7', -8, 4], ['HT8', -7, 28], ['HT9', -16, 58],
    ];
    const FOOT: [string, number, number][] = [
      ['ST41', 0, 4], ['ST42', -1, 18], ['ST43', -1.5, 36], ['ST44', -1.5, 43], ['ST45', -3.5, 50],
      ['SP1', -12, 48], ['SP2', -14, 42], ['SP3', -15, 38], ['SP4', -12, 26], ['SP5', -9, 9],
    ];
    for (const [code, lx, ly] of HAND) {
      expect({ code, on: onExtremity('hand', lx, ly) }).toEqual({ code, on: true });
    }
    for (const [code, lx, ly] of FOOT) {
      expect({ code, on: onExtremity('foot', lx, ly) }).toEqual({ code, on: true });
    }
  });

  it('frames the figure with balanced margins above and below', () => {
    const ys = dataset.acupoints.map((p) => denorm(p.placements[0]!.x, p.placements[0]!.y).y);
    const lowestMarker = Math.max(...ys);
    // The drawn toes reach ~888; the canvas must leave comparable air at both
    // ends rather than crowding the feet against the frame.
    expect(ATLAS_HEIGHT - lowestMarker).toBeGreaterThan(25);
    expect(ATLAS_HEIGHT).toBeGreaterThanOrEqual(920);
  });

  it('states an intercostal or rib landmark for every chest point', () => {
    // Nipple graphics are deliberately excluded from the figure, so the chest
    // points must carry that landmark in TEXT instead.
    const chest = dataset.acupoints.filter((p) =>
      ['ST13', 'ST14', 'ST15', 'ST16', 'ST17', 'ST18', 'SP17', 'SP18', 'SP19', 'SP20', 'SP21'].includes(p.code),
    );
    expect(chest.length).toBe(11);
    for (const p of chest) {
      expect({ code: p.code, hasLandmark: /肋間隙|肋間|鎖骨/.test(p.location!.value.zhHant) }).toEqual({
        code: p.code,
        hasLandmark: true,
      });
      expect({ code: p.code, en: /intercostal|clavicle/i.test(p.location!.value.en) }).toEqual({
        code: p.code,
        en: true,
      });
    }
  });
});
