import { describe, expect, it } from 'vitest';
// Vite's `?raw` import — the anchor table is read as text so the test can prove
// no coordinate in it is a bare literal. Node's fs is not available here: the
// app tsconfig deliberately carries no node types.
import acupointsSource from './acupoints.ts?raw';
import { acupointById, dataset } from './index';
import { CUN, denorm, LANDMARKS, LEVELS, LIMB_GUIDES } from './atlas';
import { auditLandmarks, LANDMARK_TOLERANCE_CUN } from './landmark-audit';

/**
 * Landmark-first placement rule.
 *
 * Every coordinate must be derived from a fixed, unambiguous surface landmark
 * plus a bone-cun distance — never estimated by eye. These tests are the gate
 * that keeps that true as new channels are added. They caught, and now prevent
 * the recurrence of, two real defects: 尺澤 LU5 sitting 1.6 cun ABOVE the elbow
 * crease it is defined to lie on, and 手三里 LI10 sitting 0.4 cun below the
 * crease instead of 2.
 */

const at = (code: string) => {
  const p = acupointById.get(`pt_${code.toLowerCase()}`)!;
  const pl = p.placements[0]!;
  return denorm(pl.x, pl.y);
};

/** Distance of a coordinate along a limb centre-line, in px from its start. */
function alongOf(g: readonly (readonly [number, number])[], x: number, y: number): number {
  let best = { d: Infinity, along: 0 };
  let acc = 0;
  for (let i = 0; i < g.length - 1; i++) {
    const a = g[i]!;
    const b = g[i + 1]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const t = Math.max(
      0,
      Math.min(1, ((x - a[0]) * (b[0] - a[0]) + (y - a[1]) * (b[1] - a[1])) / (len * len)),
    );
    const d = Math.hypot(x - (a[0] + (b[0] - a[0]) * t), y - (a[1] + (b[1] - a[1]) * t));
    if (d < best.d) best = { d, along: acc + t * len };
    acc += len;
  }
  return best.along;
}

/** Cun above (+) or below (−) the elbow crease, on the arm the point is drawn on. */
const fromElbow = (code: string, side: 'left' | 'right') => {
  const g = side === 'left' ? LIMB_GUIDES.armLeft : LIMB_GUIDES.armRight;
  const geom = side === 'left' ? CUN.armLeft : CUN.armRight;
  const p = at(code);
  const along = alongOf(g, p.x, p.y);
  return along >= geom.elbowCrease
    ? -(along - geom.elbowCrease) / geom.forearmCun
    : (geom.elbowCrease - along) / geom.upperArmCun;
};

/** Cun above the wrist crease. */
const aboveWrist = (code: string, side: 'left' | 'right') => {
  const g = side === 'left' ? LIMB_GUIDES.armLeft : LIMB_GUIDES.armRight;
  const geom = side === 'left' ? CUN.armLeft : CUN.armRight;
  const p = at(code);
  return (geom.wristCrease - alongOf(g, p.x, p.y)) / geom.forearmCun;
};

describe('landmark-first placement', () => {
  it('never lets a marker drift from the bone-cun distance its own 定位 states', () => {
    const { rows } = auditLandmarks();
    // Guard the guard: if the parser stopped recognising anchors this would
    // pass vacuously.
    expect(rows.length).toBeGreaterThan(100);
    const drifted = rows
      .filter((r) => r.delta > LANDMARK_TOLERANCE_CUN)
      .map((r) => `${r.code} ${r.name}: ${r.anchor} stated ${r.stated}, marker implies ${r.implied.toFixed(1)}`);
    expect(drifted).toEqual([]);
  });

  it('puts every point on the correct side of the elbow crease', () => {
    // 尺澤 lies IN the crease; 曲池 at its lateral end; 少海 at its medial end.
    expect(Math.abs(fromElbow('LU5', 'left'))).toBeLessThan(0.2);
    expect(Math.abs(fromElbow('LI11', 'right'))).toBeLessThan(0.2);
    expect(Math.abs(fromElbow('HT3', 'right'))).toBeLessThan(0.2);
    // 手三里 is 2 cun BELOW it — the defect this rule was written for.
    expect(fromElbow('LI10', 'right')).toBeCloseTo(-2, 0);
    expect(fromElbow('LI9', 'right')).toBeCloseTo(-3, 0);
    expect(fromElbow('LI8', 'right')).toBeCloseTo(-4, 0);
    // 曲池上 n 寸 climbs the upper arm.
    expect(fromElbow('LI12', 'right')).toBeCloseTo(1, 0);
    expect(fromElbow('LI13', 'right')).toBeCloseTo(3, 0);
    expect(fromElbow('LI14', 'right')).toBeCloseTo(7, 0);
    expect(fromElbow('HT2', 'right')).toBeCloseTo(3, 0);
    expect(fromElbow('LU4', 'left')).toBeCloseTo(5, 0);
  });

  it('aligns the wrist-crease points to the crease with zero offset', () => {
    // 太淵 and 神門 sit ON the crease: the hand frames' origin IS the crease,
    // so a point placed at ly = 0 cannot drift off it.
    for (const [code, side] of [['LU9', 'left'], ['HT7', 'right']] as const) {
      expect(Math.abs(aboveWrist(code, side))).toBeLessThan(0.15);
    }
    expect(aboveWrist('LU7', 'left')).toBeCloseTo(1.5, 1);
    expect(aboveWrist('LU8', 'left')).toBeCloseTo(1, 1);
    expect(aboveWrist('LU6', 'left')).toBeCloseTo(7, 0);
    expect(aboveWrist('HT4', 'right')).toBeCloseTo(1.5, 1);
    expect(aboveWrist('HT5', 'right')).toBeCloseTo(1, 1);
    expect(aboveWrist('HT6', 'right')).toBeCloseTo(0.5, 1);
    expect(aboveWrist('LI6', 'right')).toBeCloseTo(3, 0);
    expect(aboveWrist('LI7', 'right')).toBeCloseTo(5, 0);
    expect(aboveWrist('SI6', 'left')).toBeCloseTo(1, 0);
    expect(aboveWrist('SI7', 'left')).toBeCloseTo(5, 0);
  });

  it('anchors the knee points to the patellar borders and the popliteal crease', () => {
    const thighCun = CUN.legLeft.thighCun;
    const shankCun = CUN.legLeft.shankLateralCun;
    // 梁丘 is 2 cun above the SUPERIOR patellar border.
    expect((LANDMARKS.patellaSuperior - at('ST34').y) / thighCun).toBeCloseTo(2, 0);
    expect((LANDMARKS.patellaSuperior - at('ST33').y) / thighCun).toBeCloseTo(3, 0);
    expect((LANDMARKS.patellaSuperior - at('ST32').y) / thighCun).toBeCloseTo(6, 0);
    expect((LANDMARKS.patellaSuperior - at('SP10').y) / thighCun).toBeCloseTo(2, 0);
    // 犢鼻 sits at the INFERIOR border; 足三里 is 3 cun below it.
    expect(Math.abs(at('ST35').y - LANDMARKS.patellaInferior)).toBeLessThan(2);
    expect((at('ST36').y - LANDMARKS.patellaInferior) / shankCun).toBeCloseTo(3, 0);
    expect((at('ST37').y - LANDMARKS.patellaInferior) / shankCun).toBeCloseTo(6, 0);
    // 委中 is at the popliteal-crease midpoint, on the leg's centre-line.
    expect(Math.abs(at('BL40').y - LANDMARKS.poplitealCrease)).toBeLessThan(1);
    const legCentreX = LIMB_GUIDES.legRight[1][0];
    expect(Math.abs(at('BL40').x - legCentreX)).toBeLessThan(2);
    // 委陽 shares the crease but sits at its lateral end.
    expect(Math.abs(at('BL39').y - LANDMARKS.poplitealCrease)).toBeLessThan(1);
    expect(at('BL39').x).toBeLessThan(at('BL40').x); // lateral = viewer-left on the back view
  });

  it('keeps 足三里 lateral to the tibial crest, not on the leg centre-line', () => {
    // 距脛骨前緣一橫指（中指）— roughly 1 cun lateral of the crest.
    const centreX = LIMB_GUIDES.legLeft[1][0];
    const lateral = (at('ST36').x - centreX) / CUN.legLeft.shankLateralCun;
    expect(lateral).toBeGreaterThan(0.4);
    expect(lateral).toBeLessThan(1.6);
    // 豐隆 sits a further finger-width lateral than 條口.
    expect(at('ST40').x).toBeGreaterThan(at('ST38').x);
  });

  it('measures every abdominal point from the umbilicus alone', () => {
    // 天樞 is level with the umbilicus, 2 cun lateral — the sole anchor.
    expect(Math.abs(at('ST25').y - LANDMARKS.umbilicus)).toBeLessThan(0.5);
    expect((at('ST25').x - 200) / CUN.trunkWidth).toBeCloseTo(2, 1);
    expect(Math.abs(at('SP15').y - LANDMARKS.umbilicus)).toBeLessThan(0.5);
    expect((at('SP15').x - 200) / CUN.trunkWidth).toBeCloseTo(-4, 1);
    // The ladder above and below it steps by exactly one cun of its own segment.
    for (const [code, cun] of [
      ['ST19', 6], ['ST20', 5], ['ST21', 4], ['ST22', 3], ['ST23', 2], ['ST24', 1],
    ] as const) {
      expect((LANDMARKS.umbilicus - at(code).y) / CUN.upperAbdomen).toBeCloseTo(cun, 1);
    }
    for (const [code, cun] of [['ST26', 1], ['ST27', 2], ['ST28', 3], ['ST29', 4]] as const) {
      expect((at(code).y - LANDMARKS.umbilicus) / CUN.lowerAbdomen).toBeCloseTo(cun, 1);
    }
  });

  it('steps the Kidney abdominal chain one cun at a time, 0.5 cun from the midline', () => {
    // Eleven stations anchored on the umbilicus alone — the tidiest cun chain in
    // the dataset, and the one most obviously wrong if a scale slips.
    for (const [code, cun] of [
      ['KI11', -5], ['KI12', -4], ['KI13', -3], ['KI14', -2], ['KI15', -1],
      ['KI16', 0], ['KI17', 1], ['KI18', 2], ['KI19', 3], ['KI20', 4], ['KI21', 5],
    ] as const) {
      const p = at(code);
      const scale = cun >= 0 ? CUN.upperAbdomen : CUN.lowerAbdomen;
      expect((LANDMARKS.umbilicus - p.y) / scale).toBeCloseTo(cun, 1);
      expect((p.x - 200) / CUN.trunkWidth).toBeCloseTo(0.5, 1);
    }
    // 橫骨 KI11 also sits on the pubic symphysis, its second stated anchor.
    expect(Math.abs(at('KI11').y - LANDMARKS.pubicSymphysis)).toBeLessThan(1);
    // The three abdominal lines differ only in how far out they run.
    expect((at('KI16').x - 200) / CUN.trunkWidth).toBeCloseTo(0.5, 1);
    expect((at('ST25').x - 200) / CUN.trunkWidth).toBeCloseTo(2, 1);
    expect((at('SP15').x - 200) / CUN.trunkWidth).toBeCloseTo(-4, 1);
  });

  it('anchors the facial points to the glabella, pupil line and orbital rim', () => {
    const pupilL = 200 + 18;
    // 承泣 / 四白 / 巨髎 all sit 瞳孔直下 — the same vertical, descending.
    for (const c of ['ST1', 'ST2', 'ST3']) expect(at(c).x).toBeCloseTo(pupilL, 1);
    expect(at('ST1').y).toBeLessThan(at('ST2').y);
    expect(at('ST2').y).toBeLessThan(at('ST3').y);
    // 睛明 and 攢竹 share the inner-canthus vertical, 攢竹 on the brow above it.
    expect(at('BL1').x).toBeCloseTo(at('BL2').x, 1);
    expect(at('BL2').y).toBeLessThan(at('BL1').y);
    // The glabella anchor exists and sits between the brows, below the hairline.
    expect(LANDMARKS.glabella).toBeGreaterThan(LANDMARKS.frontHairline);
    expect(LANDMARKS.glabella).toBeLessThan(LEVELS.eye);
  });

  it('derives every coordinate from a landmark, never a bare literal pair', () => {
    // The whole point of the rule: a reviewer can read the anchor table and see
    // the anchor for every point. A raw `{ x: 263, y: 235.7 }` would be an
    // eyeballed offset by definition, so the source must not contain one.
    const src = acupointsSource;
    const table = src.slice(src.indexOf('const A = (() => {'), src.indexOf('  return { ...lu,'));
    const bare = [...table.matchAll(/^\s*(?:const )?([a-z]{2}\d+)(?:\s*=|:)\s*\{\s*x:\s*-?[\d.]+\s*,\s*y:\s*-?[\d.]+\s*\}/gm)].map(
      (m) => m[1]!,
    );
    expect(bare).toEqual([]);
    // And every loaded point must actually be represented in that table.
    for (const p of dataset.acupoints) {
      expect(table.includes(`${p.code.toLowerCase()}:`) || table.includes(`${p.code.toLowerCase()} =`)).toBe(true);
    }
  });
});
