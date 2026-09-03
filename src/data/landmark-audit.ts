/**
 * Landmark audit — the rule that keeps every coordinate honest.
 *
 * Reads each loaded point's reviewed 定位 text, pulls out the bone-cun distance
 * and the landmark it is measured FROM, then reports what the marker actually
 * implies. Anything that drifts is an eyeballed offset.
 *
 * Shared by `scripts/audit-landmarks.ts` (the report) and `landmark.test.ts`
 * (the gate), so the report and the build check can never disagree.
 *
 * This is an internal-consistency check between a point's own reviewed text and
 * its marker. It does NOT validate that text against a body: placements stay
 * `schematic_unvalidated` either way.
 */
import { dataset } from './index';
import { CUN, denorm, LANDMARKS, LIMB_GUIDES } from './atlas';

const TOL = 0.6; // cun

const num = (s: string): number => {
  const map: Record<string, number> = {
    一: 1, 二: 2, 兩: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
  };
  if (map[s] !== undefined) return map[s]!;
  return Number(s);
};

export interface AuditRow {
  code: string;
  name: string;
  anchor: string;
  stated: number;
  implied: number;
  delta: number;
  text: string;
}

const dist = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(b[0]! - a[0]!, b[1]! - a[1]!);

/** Distance of a coordinate along a limb guide, in pixels from its start. */
function alongOf(g: readonly (readonly [number, number])[], x: number, y: number): number {
  let best = { d: Infinity, along: 0 };
  let acc = 0;
  for (let i = 0; i < g.length - 1; i++) {
    const a = g[i]!;
    const b = g[i + 1]!;
    const len = dist(a, b);
    const t = Math.max(
      0,
      Math.min(1, ((x - a[0]) * (b[0] - a[0]) + (y - a[1]) * (b[1] - a[1])) / (len * len)),
    );
    const px = a[0] + (b[0] - a[0]) * t;
    const py = a[1] + (b[1] - a[1]) * t;
    const d = Math.hypot(x - px, y - py);
    if (d < best.d) best = { d, along: acc + t * len };
    acc += len;
  }
  return best.along;
}



export const LANDMARK_TOLERANCE_CUN = TOL;

/**
 * Audit every loaded point. `rows` are the points whose 定位 states a bone-cun
 * distance from a landmark; `unanchored` are the ones located qualitatively
 * (a knuckle, a nail corner, a palpable depression), which are anchored to the
 * drawn extremity frames instead and cannot be scored numerically.
 */
export function auditLandmarks(): { rows: AuditRow[]; unanchored: string[] } {
  const rows: AuditRow[] = [];
  const unanchored: string[] = [];

  for (const p of dataset.acupoints) {
    const text = p.location?.value.zhHant ?? '';
    const pl = p.placements[0]!;
    const { x, y } = denorm(pl.x, pl.y);
    const side = pl.side === 'right' ? 'right' : 'left';
    const armG = side === 'left' ? LIMB_GUIDES.armLeft : LIMB_GUIDES.armRight;
    const armGeom = side === 'left' ? CUN.armLeft : CUN.armRight;
    const legGeom = side === 'left' ? CUN.legLeft : CUN.legRight;

    const N = '([一二三四五六七八九十\\d.]+)';
    /** The cun value stated for THIS anchor, not merely the first one in the text. */
    const near = (re: string): number | null => {
      const m = text.match(new RegExp(re));
      return m ? num(m[1]!) : null;
    };

    /**
     * Anchors are tried in order, most specific first. Each supplies its own
     * regex so a text that states two equivalent measures (俠白: 腋前紋頭下 4 寸
     * 或 肘橫紋上 5 寸) is scored against the one its marker is derived from.
     */
    const candidates: {
      when: RegExp;
      anchor: string;
      stated: number | null;
      implied: () => number;
    }[] = [
      {
        when: /陰陵泉[下]/,
        anchor: '陰陵泉 medial condyle',
        stated: near(`陰陵泉下\\s*${N}\\s*寸`),
        // 陰陵泉 is the top of the 13-cun medial segment, so n cun below it is
        // (13 − n) cun above the medial malleolus.
        implied: () => 13 - (LANDMARKS.malleolus - y) / legGeom.shankMedialCun,
      },
      {
        when: /委中[下直]|委陽上/,
        anchor: '委中 / 膕橫紋 popliteal crease',
        stated: near(`委[中陽][下上直]*\\s*${N}\\s*寸`),
        // 浮郄 is stated as 委陽上 1 寸 — the one measurement here that runs
        // upward, so the sign follows the text rather than being assumed.
        implied: () =>
          /委[中陽]上/.test(text)
            ? (LANDMARKS.poplitealCrease - y) / legGeom.shankLateralCun
            : (y - LANDMARKS.poplitealCrease) / legGeom.shankLateralCun,
      },
      {
        when: /(崑崙直上|外踝尖上)/,
        anchor: '外踝尖 lateral malleolus',
        stated: near(`(?:崑崙直上|外踝尖上)\\s*${N}\\s*寸`),
        implied: () => (LANDMARKS.malleolus - y) / legGeom.shankLateralCun,
      },
      {
        when: /內踝尖上|距內踝尖/,
        anchor: '內踝尖 medial malleolus',
        stated: near(`(?:內踝尖上|距內踝尖)\\s*${N}\\s*寸`),
        implied: () => (LANDMARKS.malleolus - y) / legGeom.shankMedialCun,
      },
      {
        when: /髕底[內外]?[側]?[端]?上/,
        anchor: '髕底 superior patella',
        stated: near(`髕底[內外]?側?端?上\\s*${N}\\s*寸`),
        implied: () => (LANDMARKS.patellaSuperior - y) / legGeom.thighCun,
      },
      {
        when: /犢鼻[（(]?[^)）]*[)）]?下/,
        anchor: '犢鼻 inferior patella',
        stated: near(`犢鼻(?:[（(][^)）]*[)）])?下\\s*${N}\\s*寸`),
        implied: () => (y - LANDMARKS.patellaInferior) / legGeom.shankLateralCun,
      },
      {
        when: /承扶下/,
        anchor: '承扶 gluteal fold',
        stated: near(`承扶下\\s*${N}\\s*寸`),
        implied: () => (y - LANDMARKS.glutealFold) / legGeom.posteriorThighCun,
      },
      {
        when: /腕[掌背]側?(?:遠端)?橫紋[上]|腕橫紋[上]/,
        anchor: '腕橫紋 wrist crease',
        stated: near(`腕[掌背]側?(?:遠端)?橫紋上\\s*${N}\\s*寸`),
        implied: () => (armGeom.wristCrease - alongOf(armG, x, y)) / armGeom.forearmCun,
      },
      {
        when: /肘橫紋[上下]/,
        anchor: '肘橫紋 elbow crease',
        stated: near(`肘橫紋[上下]\\s*${N}\\s*寸`),
        implied: () => {
          const along = alongOf(armG, x, y);
          return /肘橫紋下/.test(text)
            ? (along - armGeom.elbowCrease) / armGeom.forearmCun
            : (armGeom.elbowCrease - along) / armGeom.upperArmCun;
        },
      },
      {
        when: /曲池上/,
        anchor: '曲池 (on the elbow crease)',
        stated: near(`曲池上\\s*${N}\\s*寸`),
        implied: () => (armGeom.elbowCrease - alongOf(armG, x, y)) / armGeom.upperArmCun,
      },
      {
        when: /腋前紋頭下/,
        anchor: '腋前紋頭 axillary fold',
        stated: near(`腋前紋頭下\\s*${N}\\s*寸`),
        implied: () => (alongOf(armG, x, y) - armGeom.axilla) / armGeom.upperArmCun,
      },
      {
        when: /腋後紋頭直上/,
        anchor: '腋後紋頭 posterior axillary fold',
        stated: near(`腋後紋頭直上\\s*${N}\\s*寸`),
        implied: () => (LANDMARKS.posteriorAxillaryFold - y) / CUN.back,
      },
      {
        when: /臍中?下/,
        anchor: '臍中下 below umbilicus',
        stated: near(`臍中?下\\s*${N}\\s*寸`),
        implied: () => (y - LANDMARKS.umbilicus) / CUN.lowerAbdomen,
      },
      {
        when: /臍中?上/,
        anchor: '臍中上 above umbilicus',
        stated: near(`臍中?上\\s*${N}\\s*寸`),
        implied: () => (LANDMARKS.umbilicus - y) / CUN.upperAbdomen,
      },
      {
        when: /大橫下/,
        anchor: '大橫 (umbilicus level)',
        stated: near(`大橫下\\s*${N}\\s*寸`),
        implied: () => (y - LANDMARKS.umbilicus) / CUN.lowerAbdomen,
      },
      {
        when: /(?:前|後)?髮際(?:正中)?直上/,
        anchor: '髮際 hairline',
        stated: near(`髮際(?:正中)?直上\\s*${N}\\s*寸`),
        // The front view flattens the scalp arc to an even ladder, hairline →
        // crown over 6 cun; the audit measures against that same ladder.
        implied: () =>
          /後髮際/.test(text)
            ? (LANDMARKS.backHairline - y) / CUN.head
            : ((LANDMARKS.frontHairline - y) / (LANDMARKS.frontHairline - 35)) * 6,
      },
      {
        when: /(?:前|後)正中線旁開|距前正中線/,
        anchor: '正中線 midline (lateral)',
        stated: near(`(?:(?:前|後)正中線旁開|距前正中線)\\s*${N}\\s*寸`),
        implied: () =>
          Math.abs(x - 200) / (/後正中線/.test(text) ? CUN.back : CUN.trunkWidth),
      },
      {
        // Points stated as sitting ON a crease are zero-distance measurements —
        // exactly the class this audit exists to catch (尺澤 drifting above the
        // elbow crease, 神門 off the wrist crease).
        when: /(?:在)?肘橫紋(?:中|內側端)/,
        anchor: '肘橫紋 elbow crease (ON)',
        stated: 0,
        implied: () =>
          Math.abs(alongOf(armG, x, y) - armGeom.elbowCrease) / armGeom.forearmCun,
      },
      {
        when: /腕[掌背]側?(?:遠端)?橫紋(?:橈側|尺側端|中)/,
        anchor: '腕橫紋 wrist crease (ON)',
        stated: 0,
        implied: () =>
          Math.abs(alongOf(armG, x, y) - armGeom.wristCrease) / armGeom.forearmCun,
      },
      {
        when: /腘橫紋(?:中點|外側端)/,
        anchor: '膕橫紋 popliteal crease (ON)',
        stated: 0,
        implied: () => Math.abs(y - LANDMARKS.poplitealCrease) / legGeom.shankLateralCun,
      },
    ];

    const hit = candidates.find((c) => c.when.test(text) && c.stated !== null);
    if (!hit) {
      unanchored.push(`${p.code} ${p.nameZhHant} — ${text.slice(0, 46)}`);
      continue;
    }
    const anchor = hit.anchor;
    const stated = hit.stated!;
    const implied = hit.implied();

    rows.push({
      code: p.code,
      name: p.nameZhHant,
      anchor,
      stated,
      implied,
      delta: Math.abs(implied - stated),
      text: text.slice(0, 52),
    });
  }

  return { rows, unanchored };
}
