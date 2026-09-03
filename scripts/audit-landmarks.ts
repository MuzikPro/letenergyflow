/**
 * Landmark audit report.
 *
 *   npx tsx scripts/audit-landmarks.ts [--all]
 *
 * The rule itself lives in `src/data/landmark-audit.ts` and is enforced by
 * `src/data/landmark.test.ts`; this script only prints it.
 */
import { auditLandmarks, LANDMARK_TOLERANCE_CUN } from '../src/data/landmark-audit';
import { dataset } from '../src/data/index';
import { CUN, LANDMARKS } from '../src/data/atlas';

const { rows, unanchored } = auditLandmarks();
const bad = rows.filter((r) => r.delta > LANDMARK_TOLERANCE_CUN).sort((a, b) => b.delta - a.delta);
const showAll = process.argv.includes('--all');

console.log(`Landmark audit — ${dataset.acupoints.length} points loaded`);
console.log(`  ${rows.length} carry a stated bone-cun distance from a landmark`);
console.log(`  ${bad.length} are off by more than ${LANDMARK_TOLERANCE_CUN} cun\n`);
console.log('CODE   NAME   ANCHOR                            STATED  IMPLIED   Δcun');
for (const r of showAll ? rows : bad) {
  console.log(
    `${r.code.padEnd(6)} ${r.name.padEnd(5)} ${r.anchor.padEnd(33)} ` +
      `${r.stated.toFixed(1).padStart(5)}  ${r.implied.toFixed(1).padStart(6)}  ` +
      `${r.delta.toFixed(1).padStart(5)}   ${r.text}`,
  );
}
console.log(
  `\n${unanchored.length} points are located qualitatively (knuckle, nail corner, palpable` +
    ` depression) and are anchored to the drawn extremity / face / spine frames instead:`,
);
if (showAll) for (const u of unanchored) console.log('  ' + u);

console.log(
  `\nScales (px per cun): forearm ${CUN.armLeft.forearmCun.toFixed(2)}, upper arm ${CUN.armLeft.upperArmCun.toFixed(2)}, ` +
    `thigh ${CUN.legLeft.thighCun.toFixed(2)}, shank lat ${CUN.legLeft.shankLateralCun.toFixed(2)}, ` +
    `shank med ${CUN.legLeft.shankMedialCun.toFixed(2)}, post. thigh ${CUN.legLeft.posteriorThighCun.toFixed(2)},\n` +
    `                     chest ${CUN.chest.toFixed(2)}, upper abd ${CUN.upperAbdomen.toFixed(2)}, ` +
    `lower abd ${CUN.lowerAbdomen.toFixed(2)}, trunk width ${CUN.trunkWidth.toFixed(2)}, back ${CUN.back.toFixed(2)}, head ${CUN.head.toFixed(2)}`,
);
console.log(
  `Landmarks: elbow crease ${LANDMARKS.elbowCrease.toFixed(1)}, wrist crease ${LANDMARKS.wristCrease.toFixed(1)}, ` +
    `patella ${LANDMARKS.patellaSuperior.toFixed(1)}–${LANDMARKS.patellaInferior.toFixed(1)}, ` +
    `popliteal ${LANDMARKS.poplitealCrease.toFixed(1)}, umbilicus ${LANDMARKS.umbilicus.toFixed(1)}, ` +
    `glabella ${LANDMARKS.glabella.toFixed(1)}`,
);
