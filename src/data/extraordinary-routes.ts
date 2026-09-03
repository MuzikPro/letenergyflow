import type { BodyViewId } from './types';
import { dataset } from './index';
import { denorm, smoothPath } from './atlas';

/**
 * 奇經八脈 — 循行, 主要病候 and 交會腧穴 for all eight vessels.
 *
 * TWO SOURCES, KEPT APART. The owner supplied a study sheet
 * (`content-review/qijing-reference-2026-08-23.md`) and, separately, the text of
 * 《奇經八脈考》 itself. They are not the same thing and are not merged: the study
 * sheet carries the standard modern textbook 循行 and the 交會腧穴 lists, and is
 * what `courseZhHant`, `signsZhHant` and `crossings` cite; `classicalZhHant`
 * carries 李時珍's own wording and cites the classical text. Attributing the
 * modern wording to 李時珍 would be inventing a citation, and the two genuinely
 * differ — see `content-review/qijing-ingest-2026-08-23.md` for where.
 *
 * WHY THE ROUTES CAN BE DRAWN AT ALL. The source lists each vessel's 交會腧穴 by
 * name, and all 75 references resolve to points this dataset already holds with
 * reviewed coordinates. The drawn line therefore connects existing points and
 * invents nothing.
 *
 * WHAT THE DRAWN LINE IS NOT. It is a line THROUGH THE NAMED CROSSING POINTS,
 * not the vessel's course. The classical 循行 runs largely inside the body —
 * 督脈 up the interior of the spine, 衝脈 up the spine and out through 氣衝 —
 * and none of that is what a surface polyline shows. The 循行 text is carried
 * beside the line precisely so the two are not confused. This is the same
 * compromise the twelve regular channels already make, and their placements are
 * `schematic_unvalidated` for the same reason.
 *
 * ONE DISAMBIGUATION, recorded rather than silently resolved: the 衝脈 list says
 * 「通谷」, which is two different points. 腹通谷 KI20 is the reading — the list
 * runs 橫骨 KI11 through 幽門 KI21 in order and KI20 sits exactly between 陰都
 * KI19 and 幽門 KI21. 足通谷 BL66 is on the foot and out of sequence.
 *
 * ONE TYPO, likewise recorded: the source's 陽蹻脈 reads 「没股部外侧」. Read as
 * 「沿股部外側」 — 没 is not a verb that fits, and every other clause in the same
 * sentence uses 沿 or 經.
 */

export const QIJING_SOURCE_ID = 'src_owner_qijing_2026_08';
/** 《奇經八脈考》 itself — the classical text, cited only where it is quoted. */
export const QIJING_KAO_SOURCE_ID = 'src_qijing_bamai_kao';

export interface VesselRoute {
  /** 中文 name, matching `ExtraordinaryVessel.zhHant`. */
  vessel: string;
  /** 循行 — the classical course, in the source's own terms. */
  courseZhHant: string;
  /** The project's own English rendering. Unreviewed, like every translation here. */
  courseEn: string;
  /** 主要病候 — the patterns the tradition associates with the vessel. */
  signsZhHant: string;
  signsEn: string;
  /** 交會腧穴, in the order the source lists them. */
  crossings: string[];
  /**
   * 《奇經八脈考》's own opening statement of where the vessel arises — the
   * classical anchor, cited to `QIJING_KAO_SOURCE_ID` rather than to the study
   * sheet. Nullable by design: the first transcription consulted was corrupt in
   * two of its eight sections — 沖脈 reproduced the 陰蹻脈 text and 陽蹻脈
   * reproduced the 陽維脈 text — and those two were left empty rather than
   * filled in from elsewhere. A second, clean transcription supplied afterwards
   * carried both, so all eight are populated; the type stays nullable because
   * "no wording available" must remain expressible rather than guessable.
   */
  classicalZhHant: string | null;
}

export const VESSEL_ROUTES: VesselRoute[] = [
  {
    vessel: '督脈',
    courseZhHant:
      '起於小腹內，下出於會陰部，向後行於脊柱的內部，上達項後風府，進入腦內，上行巔頂，沿前額下行至鼻柱。',
    courseEn:
      'Arises within the lower abdomen, emerges at the perineum, runs upward inside the spinal column, reaches 風府 at the nape and enters the brain, ascends over the vertex, and descends the forehead to the bridge of the nose.',
    signsZhHant: '脊柱強痛，角弓反張等症。',
    signsEn: 'Rigidity and pain along the spine; opisthotonos.',
    crossings: ['GV1', 'GV13', 'GV14', 'GV15', 'GV16', 'GV17', 'GV20', 'GV26', 'GV24'],
    classicalZhHant: '督乃陽脈之海，其脈起於腎下胞中，至於少腹，乃下行於腰橫骨圍之中央。',
  },
  {
    vessel: '任脈',
    courseZhHant:
      '起於小腹內，下出會陰部，向上行於陰毛部，沿著腹內，向上經過關元等穴，到達咽喉部，再上行環繞口唇，經過面部，進入目眶下。',
    courseEn:
      'Arises within the lower abdomen, emerges at the perineum, ascends through the pubic region, runs up inside the abdomen through 關元 and the points above it, reaches the throat, circles the lips, crosses the face and enters below the eye socket.',
    signsZhHant: '疝氣，帶下，腹中結塊等證。',
    signsEn: 'Hernia; vaginal discharge; masses within the abdomen.',
    crossings: ['CV1', 'CV2', 'CV3', 'CV4', 'CV7', 'CV10', 'CV12', 'CV13', 'CV22', 'CV23', 'CV24'],
    classicalZhHant: '任為陰脈之海，其脈起於中極之下，少腹之內，會陰之分在兩陰之間。',
  },
  {
    vessel: '衝脈',
    courseZhHant:
      '起於小腹內，下出於會陰部；向上行於脊柱內；其外行者經氣衝與足少陰經交會，沿著腹部兩側；上達咽喉；環繞口唇。',
    courseEn:
      'Arises within the lower abdomen and emerges at the perineum; one branch ascends inside the spinal column, while the outer branch meets the Kidney channel at 氣衝 and runs up both sides of the abdomen to the throat, then circles the lips.',
    signsZhHant: '腹部氣逆而拘急。',
    signsEn: 'Counterflow of qi in the abdomen, with tension and cramping.',
    crossings: [
      'CV1', 'CV7', 'ST30', 'KI11', 'KI12', 'KI13', 'KI14', 'KI15',
      'KI16', 'KI17', 'KI18', 'KI19', 'KI20', 'KI21',
    ],
    classicalZhHant: '衝脈起於會陰，夾臍而行，直衝於上，為諸脈之衝要，故曰十二經脈之海。',
  },
  {
    vessel: '帶脈',
    courseZhHant: '起於肋脅部的下面，斜向下行到帶脈、五樞、維道穴，橫行繞身一周。',
    courseEn:
      'Arises below the free ribs, runs obliquely downward to 帶脈, 五樞 and 維道, and circles the body horizontally — the only vessel that girdles rather than runs lengthwise.',
    signsZhHant: '腹滿，腰部覺冷如坐水中。',
    signsEn: 'Abdominal fullness; a cold sensation at the waist, as if sitting in water.',
    crossings: ['GB26', 'GB27', 'GB28'],
    classicalZhHant: '帶脈者，起於季脅足厥陰之章門穴，同足少陽循帶脈穴，圍身一周，如束帶然。',
  },
  {
    vessel: '陰維脈',
    courseZhHant: '起於小腿內側，沿大腿內側上行到腹部，與足太陰經相合，過胸部，與任脈會於頸部。',
    courseEn:
      'Arises on the medial lower leg, ascends the inner thigh to the abdomen, joins the Spleen channel, crosses the chest and meets the Conception vessel at the neck.',
    signsZhHant: '心痛，憂鬱。',
    signsEn: 'Heart pain; low spirits.',
    crossings: ['KI9', 'SP13', 'SP15', 'SP16', 'LR14', 'CV22', 'CV23'],
    classicalZhHant: '陰維起於諸陰之交，其脈發於足少陰築賓穴，為陰維之郄。',
  },
  {
    vessel: '陽維脈',
    courseZhHant:
      '起於足跟外側，向上經過外踝，沿足少陽經上行髖關節部，經脅肋後側，從腋後上肩，至前額，再到項後，合於督脈。',
    courseEn:
      'Arises at the lateral heel, passes the outer ankle, ascends along the Gallbladder channel to the hip, runs behind the flank, rises from the back of the axilla to the shoulder, reaches the forehead, then the nape, and joins the Governor vessel.',
    signsZhHant: '惡寒發熱，腰疼。',
    signsEn: 'Aversion to cold with fever; lumbar pain.',
    crossings: [
      'BL63', 'GB35', 'SI10', 'TE15', 'GB21', 'ST8', 'GB13', 'GB14',
      'GB15', 'GB16', 'GB17', 'GB18', 'GB19', 'GB20', 'GV16', 'GV15',
    ],
    classicalZhHant: '陽維起於諸陽之會，其脈發於足太陽金門穴，在足外踝下一寸五分。',
  },
  {
    vessel: '陰蹻脈',
    courseZhHant:
      '起於足舟骨的後方，上行內踝的上面，直上沿大腿內側，經過陰部，向上沿胸部內側，進入鎖骨上窩，上經人迎的前面，過顴部，到目內眥，與足太陽經和陽蹻脈相會合。',
    courseEn:
      'Arises behind the navicular bone, ascends above the inner ankle and straight up the inner thigh, passes the genital region, rises along the inner chest into the supraclavicular fossa, passes in front of 人迎, crosses the cheekbone to the inner canthus, and meets the Bladder channel and the Yang Motility vessel there.',
    signsZhHant: '多眠、癃閉，足內翻等證。',
    signsEn: 'Excessive sleep; urinary blockage; inversion of the foot.',
    crossings: ['KI6', 'KI8', 'BL1'],
    classicalZhHant: '陰蹻者，足少陰之別脈，其脈起於跟中，足少陰然谷穴之後。',
  },
  {
    vessel: '陽蹻脈',
    courseZhHant:
      '起於足跟外側，經外踝上行腓骨後緣，沿股部外側和脅後上肩，過頸部上挾口角，進入目內眥，與陰蹻脈會合，再沿足太陽經上額，與足少陽經合於風池。',
    courseEn:
      'Arises at the lateral heel, passes the outer ankle and ascends the posterior border of the fibula, runs up the outer thigh and behind the flank to the shoulder, crosses the neck to flank the corner of the mouth, enters the inner canthus and meets the Yin Motility vessel, then follows the Bladder channel up the forehead to join the Gallbladder channel at 風池.',
    signsZhHant: '目痛從內眥始，不眠，足外翻等證。',
    signsEn: 'Eye pain beginning at the inner canthus; sleeplessness; eversion of the foot.',
    crossings: [
      'BL62', 'BL61', 'BL59', 'GB29', 'SI10', 'LI15', 'LI16', 'TE15',
      'ST4', 'ST3', 'ST1', 'BL1',
    ],
    classicalZhHant: '陽蹻者，足太陽之別脈，其脈起於跟中，出於外踝下足太陽申脈穴。',
  },
];

const byCode = new Map(dataset.acupoints.map((p) => [p.code, p]));

export const routeFor = (vessel: string): VesselRoute | null =>
  VESSEL_ROUTES.find((r) => r.vessel === vessel) ?? null;

/** The crossing points of one vessel, as records, skipping nothing silently. */
export const crossingPointsOf = (vessel: string) =>
  (routeFor(vessel)?.crossings ?? []).map((code) => {
    const p = byCode.get(code);
    if (!p) throw new Error(`奇經八脈: ${vessel} names ${code}, which is not in the dataset`);
    return p;
  });

export interface VesselPath {
  view: BodyViewId;
  d: string;
}

/**
 * One vessel's line, split into per-view runs.
 *
 * A vessel crosses between front and back — 陽維脈 goes foot, leg, shoulder
 * (back), head (front), nape (back) — and each view can only draw the points it
 * holds. Consecutive crossings on the same view become one segment; the line
 * breaks where the vessel passes to the other side, which is honest, because
 * the atlas cannot show a course going round the body.
 *
 * A run of one point draws nothing: a segment needs two ends.
 */
export const pathsFor = (vessel: string): VesselPath[] => {
  const out: VesselPath[] = [];
  let run: { view: BodyViewId; pts: { x: number; y: number }[] } | null = null;
  const flush = () => {
    if (run && run.pts.length > 1) out.push({ view: run.view, d: smoothPath(run.pts) });
    run = null;
  };
  for (const p of crossingPointsOf(vessel)) {
    const pl = p.placements[0];
    if (!pl) continue;
    const c = denorm(pl.x, pl.y);
    if (run && run.view === pl.view) run.pts.push(c);
    else {
      flush();
      run = { view: pl.view, pts: [c] };
    }
  }
  flush();
  return out;
};

/**
 * The same eight lines, drawn in NETWORK space instead of on the body.
 *
 * The subway map already has a station for all 362 points, so a vessel is a
 * line running through stations that belong to other lines — which is exactly
 * what it is anatomically, and a shape the diagram already knows how to read.
 * Nothing new is placed: `x` and `y` come from the station the crossing point
 * already has.
 *
 * 督脈 and 任脈 are excluded. They own their points and already have their own
 * network lines, so drawing them again would double the stroke.
 *
 * No smoothing here, unlike the atlas. The map is drawn in straight runs and
 * right angles, and a curve through it would read as a different kind of
 * object; a polyline says "this line calls at these stations".
 */
export const networkPathFor = (
  vessel: string,
  stationCoord: Map<string, { x: number; y: number }>,
): string => {
  const pts = crossingPointsOf(vessel)
    .map((p) => stationCoord.get(p.id))
    .filter((c): c is { x: number; y: number } => Boolean(c));
  if (pts.length < 2) return '';
  return pts.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
};
