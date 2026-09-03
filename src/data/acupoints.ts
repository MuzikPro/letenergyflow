import {
  armPoint,
  backScalp,
  belowSternalNotch,
  ATLAS_WIDTH,
  BACK_LINE_1,
  BACK_LINE_2,
  CUN,
  FACE,
  footPoint,
  fromUmbilicus,
  handPoint,
  ics,
  LANDMARKS,
  LEVELS,
  legPoint,
  norm,
  scalpPoint,
  SPINE,
  trunkPoint,
} from './atlas';
import {
  EDITORIAL_DATE,
  EDITORIAL_REVIEWER,
  EDITORIAL_SOURCES,
  EN_TRANSLATION_NOTE,
  editorialByCode,
} from './editorial';
import { actionsSrcFor, entryFor, indicationsSrcFor } from './indications';
import type { Acupoint, AtlasPlacement, PointClassification, Provenanced } from './types';

const CLASSICAL = 'src_classical_nomenclature';
const HANDBOOK = 'src_handbook_docx';
const OUTLINE = 'src_outline_md';
const SCHEMATIC = 'src_project_schematic';

type Bilingual = { zhHant: string; en: string };

function claim<T>(value: T, sourceIds: string[], notes: string | null): Provenanced<T> {
  return { value, sourceIds, reviewStatus: 'unreviewed', reviewer: null, reviewDate: null, notes };
}

/** A claim upgraded by the owner's 2026-08 editorial worksheet pass. */
function reviewedClaim<T>(value: T, notes: string | null): Provenanced<T> {
  return {
    value,
    sourceIds: EDITORIAL_SOURCES,
    reviewStatus: 'source_checked',
    reviewer: EDITORIAL_REVIEWER,
    reviewDate: EDITORIAL_DATE,
    notes,
  };
}

interface Spec {
  code: string;
  meridianId: string;
  ordinal: number;
  zh: string;
  zhs: string;
  en: string;
  py: string;
  region: string;
  /** Schematic pixel coordinates on the front view. */
  x: number;
  y: number;
  side: AtlasPlacement['side'];
  /** Which body view the marker belongs to. Defaults to the front. */
  view?: 'front' | 'back';
  tier: 1 | 2 | 3;
  aliases?: string[];
  /** Landmark location, ONLY where a source actually records one. */
  location?: { text: Bilingual; sourceIds: string[]; notes: string };
  classifications?: { value: PointClassification[]; sourceIds: string[]; notes: string };
  cues?: { text: Bilingual; sourceIds: string[]; notes: string }[];
}

function build(spec: Spec): Acupoint {
  const p = norm(spec.x, spec.y);
  // The owner's editorial worksheet (2026-08-05) supersedes the curriculum's
  // coarser claims where an entry exists. Marker placements are NOT upgraded —
  // they stay schematic_unvalidated until measured against a standard.
  const ed = editorialByCode[spec.code];
  const ind = entryFor(spec.code);
  return {
    id: `pt_${spec.code.toLowerCase()}`,
    code: spec.code,
    meridianId: spec.meridianId,
    ordinal: spec.ordinal,
    nameZhHant: spec.zh,
    nameZhHans: spec.zhs,
    nameEn: spec.en,
    pinyin: spec.py,
    aliases: spec.aliases ?? [],
    bodyRegion: spec.region,
    location: ed
      ? reviewedClaim(
          { zhHant: ed.locZh, en: ed.locEn },
          ['中文定位依 GB/T 12346-2021（經編審工作表核對）。', EN_TRANSLATION_NOTE, ed.note]
            .filter(Boolean)
            .join(' '),
        )
      : spec.location
        ? claim(spec.location.text, spec.location.sourceIds, spec.location.notes)
        : null,
    classifications: ed
      ? ed.cls
        ? reviewedClaim(ed.cls, [ed.clsCite, '依編審工作表。'].filter(Boolean).join(' · '))
        : null
      : spec.classifications
        ? claim(spec.classifications.value, spec.classifications.sourceIds, spec.classifications.notes)
        : null,
    memoryCues: ed?.cueZh
      ? [
          reviewedClaim(
            { zhHant: ed.cueZh, en: ed.cueEn ?? ed.cueZh },
            'Name-etymology / landmark memory hook from the owner worksheet. Not a clinical claim.',
          ),
        ]
      : (spec.cues ?? []).map((c) => claim(c.text, c.sourceIds, c.notes)),
    actions: ind?.actionsZh
      ? claim(
          { zhHant: ind.actionsZh, en: ind.actionsEn ?? ind.actionsZh },
          actionsSrcFor(spec.code),
          '傳統功效敘述，來自專案負責人的編審工作表備註欄；同欄的針刺操作內容未收錄。非療效證據。 Traditional statement of action from the owner worksheet. Needling content in the same field is not ingested. Not evidence of effect.',
        )
      : null,
    indications: ind?.indicationsZh
      ? claim(
          { zhHant: ind.indicationsZh, en: ind.indicationsEn ?? ind.indicationsZh },
          indicationsSrcFor(spec.code),
          '傳統主治敘述，來自專案負責人的部位檢索表；未經專家審核，不構成診斷或治療建議。 Traditional indications from the owner index table. Unreviewed, and not diagnosis or treatment advice.',
        )
      : null,
    courseTier: spec.tier,
    placements: [
      {
        view: spec.view ?? 'front',
        x: p.x,
        y: p.y,
        side: spec.side,
        status: 'schematic_unvalidated',
      },
    ],
    sourceIds: ed
      ? [CLASSICAL, HANDBOOK, SCHEMATIC, ...EDITORIAL_SOURCES]
      : [CLASSICAL, HANDBOOK, SCHEMATIC],
    reviewStatus: ed ? 'source_checked' : 'unreviewed',
  };
}

/**
 * Hand and foot landmarks, expressed in the extremity-local frames defined in
 * `atlas.ts` (+y distal, +x lateral). Because the same numbers draw the shape,
 * a marker can never drift off the finger or toe it belongs to.
 */




/* ==========================================================================
 * LANDMARK-ANCHORED COORDINATES
 *
 * Every coordinate below is derived from a fixed surface landmark plus the
 * bone-cun distance stated in that point's own reviewed 定位 text. Nothing here
 * is eyeballed: change a landmark and every dependent point moves with it.
 *
 * Conventions
 *   armPoint / legPoint  — cun along the limb, positive DISTAL; `lateral` in
 *                          cun, positive AWAY from the body midline.
 *   trunkPoint           — a landmark level plus a lateral cun offset.
 *   handPoint/footPoint  — the extremity's own local frame, whose origin IS the
 *                          wrist / ankle crease, so ly = 0 sits exactly on it.
 *
 * The audit script `scripts/audit-landmarks.ts` re-reads every 定位 text and
 * fails anything that drifts from its stated distance by more than 0.6 cun.
 * ========================================================================== */

const MIDLINE = ATLAS_WIDTH / 2;
/** Midpoint of two anchored coordinates — for points defined as "the midpoint of". */
const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});
/** Fraction `t` along the line between two anchored coordinates. */
const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const A = (() => {
  /* -- 手太陰肺經 — figure's LEFT arm, anterior-radial line ---------------- */
  const lu1 = trunkPoint('left', ics(1), 6); // 平第 1 肋間隙，距前正中線 6 寸
  const lu = {
    lu1,
    lu2: trunkPoint('left', ics(1) - CUN.chest, 6), // 中府為雲門下 1 寸
    lu3: armPoint('left', 'axilla', 3, 0.7), // 腋前紋頭下 3 寸
    lu4: armPoint('left', 'elbowCrease', -5, 0.7), // 肘橫紋上 5 寸
    lu5: armPoint('left', 'elbowCrease', 0, 0.9), // 在肘橫紋中 — ON the crease
    lu6: armPoint('left', 'wristCrease', -7, 0.9), // 腕橫紋上 7 寸
    lu7: armPoint('left', 'wristCrease', -1.5, 1.1), // 腕橫紋上 1.5 寸
    lu8: armPoint('left', 'wristCrease', -1, 0.9), // 腕橫紋上 1 寸
    lu9: handPoint('left', 8, 0), // 腕掌側橫紋橈側 — ON the crease
    lu10: handPoint('left', 14, 20), // 第 1 掌骨中點橈側赤白肉際
    lu11: handPoint('left', 29, 34), // 拇指末節橈側甲角旁 0.1 寸
  };

  /* -- 手陽明大腸經 — figure's RIGHT arm, posterior-radial line ------------ */
  const li11 = armPoint('right', 'elbowCrease', 0, 1.1); // 肘彎橫紋盡頭 — ON the crease
  const li12 = armPoint('right', 'elbowCrease', -1, 0.9); // 曲池上 1 寸
  const li18 = { x: MIDLINE - 0.55 * LANDMARKS.neckHalfWidth, y: LANDMARKS.laryngealProminence }; // 橫平喉結，胸鎖乳突肌前緣
  const st12r = trunkPoint('right', ics(0) - 4, 4); // 缺盆, for 天鼎's midpoint
  const philtrum = LEVELS.nose + (LEVELS.mouth - LEVELS.nose) * 0.33;
  const li = {
    li1: handPoint('right', 16, 67),
    li2: handPoint('right', 14.5, 46),
    li3: handPoint('right', 14, 37),
    li4: handPoint('right', 13, 26),
    li5: handPoint('right', 10, 5), // 橈骨莖突遠端 — just distal to the crease
    li6: armPoint('right', 'wristCrease', -3, 0.9), // 腕背橫紋上 3 寸
    li7: armPoint('right', 'wristCrease', -5, 0.9), // 腕背橫紋上 5 寸
    li8: armPoint('right', 'elbowCrease', 4, 1.0), // 肘橫紋下 4 寸
    li9: armPoint('right', 'elbowCrease', 3, 1.0), // 肘橫紋下 3 寸
    li10: armPoint('right', 'elbowCrease', 2, 1.0), // 肘橫紋下 2 寸
    li11,
    li12,
    li13: armPoint('right', 'elbowCrease', -3, 0.9), // 曲池上 3 寸
    li14: armPoint('right', 'elbowCrease', -7, 0.85), // 曲池上 7 寸
    li15: armPoint('right', 'axilla', -2, 0.8), // 肩峰前下方
    li16: { x: MIDLINE - 4.3 * CUN.back, y: LEVELS.shoulder - 6 }, // 鎖骨肩峰端與肩胛岡之間
    li17: { x: MIDLINE - 0.95 * LANDMARKS.neckHalfWidth, y: mid(li18, st12r).y }, // 扶突與缺盆連線的中點，胸鎖乳突肌後緣
    li18,
    li19: { x: MIDLINE - 0.5 * CUN.head, y: philtrum }, // 水溝旁開 0.5 寸
    li20: { x: FACE.alaR[0] - 3, y: FACE.alaR[1] + 1 }, // 鼻翼外緣中點旁
  };

  /* -- 足陽明胃經 — face near the midline, then figure's LEFT trunk + leg -- */
  const pupilL = FACE.eyeL[0];
  const st9 = { x: MIDLINE + 0.55 * LANDMARKS.neckHalfWidth, y: LANDMARKS.laryngealProminence }; // 橫平喉結，胸鎖乳突肌前緣
  const st11 = { x: MIDLINE + 0.8 * CUN.trunkWidth, y: ics(0) - 4 }; // 鎖骨內側端上緣
  const st = {
    st1: { x: pupilL, y: LEVELS.eye + 8 }, // 瞳孔直下，眶下緣
    st2: { x: pupilL, y: LEVELS.eye + 18 }, // 瞳孔直下，眶下孔
    st3: { x: pupilL, y: LEVELS.nose + 2 }, // 瞳孔直下，平鼻翼下緣
    st4: { x: FACE.mouthCornerL[0] + 3, y: FACE.mouthCornerL[1] }, // 口角外側 0.4 寸
    st5: { x: FACE.jawAngleL[0] - 5, y: FACE.jawAngleL[1] + 3 }, // 下頜角前方
    st6: { x: FACE.jawAngleL[0] - 2, y: FACE.jawAngleL[1] - 6 }, // 下頜角前上方一橫指
    st7: { x: FACE.jawAngleL[0] + 8, y: LEVELS.eye + 26 }, // 顴弓下緣中央與下頜切跡之間
    st8: { x: FACE.hairlineCornerL[0], y: FACE.hairlineCornerL[1] - 0.5 * CUN.head }, // 額角髮際上 0.5 寸
    st9,
    st10: mid(st9, st11), // 人迎與氣舍連線的中點
    st11,
    st12: trunkPoint('left', ics(0) - 4, 4), // 鎖骨上窩中央，旁開 4 寸 — level with 氣舍, lateral to it
    st13: trunkPoint('left', ics(0), 4), // 鎖骨下緣，旁開 4 寸
    st14: trunkPoint('left', ics(1), 4),
    st15: trunkPoint('left', ics(2), 4),
    st16: trunkPoint('left', ics(3), 4),
    st17: trunkPoint('left', ics(4), 4), // 乳頭中央，平第 4 肋間隙
    st18: trunkPoint('left', ics(5), 4),
    st19: trunkPoint('left', fromUmbilicus(6), 2),
    st20: trunkPoint('left', fromUmbilicus(5), 2),
    st21: trunkPoint('left', fromUmbilicus(4), 2),
    st22: trunkPoint('left', fromUmbilicus(3), 2),
    st23: trunkPoint('left', fromUmbilicus(2), 2),
    st24: trunkPoint('left', fromUmbilicus(1), 2),
    st25: trunkPoint('left', LANDMARKS.umbilicus, 2), // 橫平臍中，旁開 2 寸
    st26: trunkPoint('left', fromUmbilicus(-1), 2),
    st27: trunkPoint('left', fromUmbilicus(-2), 2),
    st28: trunkPoint('left', fromUmbilicus(-3), 2),
    st29: trunkPoint('left', fromUmbilicus(-4), 2),
    st30: trunkPoint('left', LANDMARKS.pubicSymphysis, 2), // 恥骨聯合上緣，旁開 2 寸
    st31: legPoint('left', 'hip', 0, 0.6), // 屈髖時平會陰
    st32: legPoint('left', 'patellaSuperior', -6, 0.7), // 髕底上 6 寸
    st33: legPoint('left', 'patellaSuperior', -3, 0.7), // 髕底上 3 寸
    st34: legPoint('left', 'patellaSuperior', -2, 0.7), // 髕底上 2 寸
    st35: legPoint('left', 'patellaInferior', 0, 0.9), // 犢鼻 — 髕韌帶外側凹陷
    st36: legPoint('left', 'patellaInferior', 3, 0.8), // 犢鼻下 3 寸
    st37: legPoint('left', 'patellaInferior', 6, 0.8),
    st38: legPoint('left', 'patellaInferior', 8, 0.8),
    st39: legPoint('left', 'patellaInferior', 9, 0.8),
    st40: legPoint('left', 'malleolus', -8, 1.6), // 外踝尖上 8 寸，條口外一橫指
    st41: footPoint('left', 0, 4),
    st42: footPoint('left', -1, 18),
    st43: footPoint('left', -1.5, 36),
    st44: footPoint('left', -1.5, 43),
    st45: footPoint('left', -3.5, 50),
  };

  /* -- 足太陰脾經 — figure's RIGHT leg + trunk, medial line ---------------- */
  const sp12 = trunkPoint('right', LANDMARKS.pubicSymphysis, 3.5); // 距恥骨聯合上緣 3.5 寸
  const sp10 = legPoint('right', 'patellaSuperior', -2, -0.8); // 髕底內側端上 2 寸
  const sp = {
    sp1: footPoint('right', -12, 48),
    sp2: footPoint('right', -14, 42),
    sp3: footPoint('right', -15, 38),
    sp4: footPoint('right', -12, 26),
    sp5: footPoint('right', -9, 9), // 內踝前下方
    sp6: legPoint('right', 'malleolus', -3, -0.6, 'medial'), // 內踝尖上 3 寸
    sp7: legPoint('right', 'malleolus', -6, -0.6, 'medial'), // 內踝尖上 6 寸
    sp8: legPoint('right', 'poplitealCrease', 3, -0.7, 'medial'), // 陰陵泉下 3 寸
    sp9: legPoint('right', 'poplitealCrease', 0.5, -0.9, 'medial'), // 脛骨內側髁後下方
    sp10,
    sp11: lerp(sp10, sp12, 1 / 3), // 髕底內側端與衝門連線的上 1/3
    sp12,
    sp13: trunkPoint('right', fromUmbilicus(-4), 4), // 臍中下 4 寸，距前正中線 4 寸
    sp14: trunkPoint('right', LANDMARKS.umbilicus + 1.3 * CUN.lowerAbdomen, 4), // 大橫下 1.3 寸
    sp15: trunkPoint('right', LANDMARKS.umbilicus, 4), // 距臍中 4 寸
    sp16: trunkPoint('right', fromUmbilicus(3), 4), // 臍中上 3 寸
    sp17: trunkPoint('right', ics(5), 6),
    sp18: trunkPoint('right', ics(4), 6),
    sp19: trunkPoint('right', ics(3), 6),
    sp20: trunkPoint('right', ics(2), 6),
    sp21: trunkPoint('right', ics(6), 7), // 腋中線上，第 6 肋間隙
  };

  /* -- 手少陰心經 — figure's RIGHT arm, antero-medial line ----------------- */
  const ht = {
    ht1: armPoint('right', 'axilla', 0, -0.4), // 腋窩中央
    ht2: armPoint('right', 'elbowCrease', -3, -0.7), // 肘橫紋上 3 寸
    ht3: armPoint('right', 'elbowCrease', 0, -1.0), // 肘橫紋內側端 — ON the crease
    ht4: armPoint('right', 'wristCrease', -1.5, -0.8), // 腕橫紋上 1.5 寸
    ht5: armPoint('right', 'wristCrease', -1, -0.8), // 腕橫紋上 1 寸
    ht6: armPoint('right', 'wristCrease', -0.5, -0.8), // 腕橫紋上 0.5 寸
    ht7: handPoint('right', -8, 0), // 腕掌側橫紋尺側端 — ON the crease
    ht8: handPoint('right', -7, 28),
    ht9: handPoint('right', -16, 58),
  };

  /* -- 手太陽小腸經 — figure's LEFT arm (ulnar), scapula, neck, face ------- */
  const si11 = { x: MIDLINE - 3 * CUN.back, y: (LANDMARKS.scapularSpine + LANDMARKS.scapularInferiorAngle) / 2 };
  const si = {
    si1: handPoint('left', -16, 58),
    si2: handPoint('left', -14, 40),
    si3: handPoint('left', -14, 32),
    si4: handPoint('left', -12, 14),
    si5: handPoint('left', -10, 4), // 尺骨莖突與三角骨之間
    si6: armPoint('left', 'wristCrease', -1, -0.9), // 腕背橫紋上 1 寸
    si7: armPoint('left', 'wristCrease', -5, -0.9), // 腕背橫紋上 5 寸
    si8: armPoint('left', 'elbowCrease', 0, -1.1), // 鷹嘴與內上髁之間 — at the crease
    si9: { x: MIDLINE - 3.5 * CUN.back, y: LANDMARKS.posteriorAxillaryFold - CUN.back }, // 腋後紋頭直上 1 寸
    si10: { x: MIDLINE - 3.5 * CUN.back, y: LANDMARKS.scapularSpine + 4 }, // 腋後紋頭直上，肩胛岡下緣
    si11,
    si12: { x: si11.x, y: LANDMARKS.scapularSpine - 8 }, // 天宗直上，岡上窩
    si13: { x: MIDLINE - 2.4 * CUN.back, y: LANDMARKS.scapularSpine - 10 }, // 肩胛岡上緣內側端
    si14: { x: BACK_LINE_2, y: SPINE.t(1) }, // 第 1 胸椎棘突下旁開 3 寸
    si15: { x: MIDLINE - 2 * CUN.back, y: LANDMARKS.c7 }, // 第 7 頸椎棘突下旁開 2 寸
    si16: { x: MIDLINE + 0.9 * LANDMARKS.neckHalfWidth, y: LANDMARKS.laryngealProminence }, // 橫平喉結，胸鎖乳突肌後緣
    // 下頜角後方: "posterior to" has no depth on a front view, so it projects
    // onto the jaw-angle outline itself rather than off the side of the face.
    si17: { x: FACE.jawAngleL[0] - 1, y: FACE.jawAngleL[1] - 6 },
    si18: { x: FACE.eyeL[0] + 8, y: LEVELS.eye + 14 }, // 目外眥直下，顴骨下緣
    si19: { x: LANDMARKS.tragus.left[0] - 4, y: LANDMARKS.tragus.left[1] }, // 耳屏前
  };

  /* -- 足太陽膀胱經 -------------------------------------------------------- */
  const bl2 = { x: FACE.eyeL[0] - 9, y: LEVELS.eye - 13 }; // 眉頭凹陷中，眶上切跡
  const bl39 = legPoint('right', 'poplitealCrease', 0, 0.9); // 膕橫紋外側端
  const bl40 = { x: legPoint('right', 'poplitealCrease', 0).x, y: LANDMARKS.poplitealCrease }; // 膕橫紋中點
  const bl = {
    bl1: { x: FACE.eyeL[0] - 9, y: LEVELS.eye - 2 }, // 目內眥角內上方
    bl2,
    bl3: { x: bl2.x, y: scalpPoint(0.5).y }, // 攢竹直上入前髮際 0.5 寸
    bl4: scalpPoint(0.5, 1.5), // 前髮際上 0.5 寸，旁開 1.5 寸
    bl5: scalpPoint(1, 1.5),
    bl6: scalpPoint(2.5, 1.5),
    bl7: scalpPoint(4, 1.5),
    bl8: scalpPoint(5.5, 1.5),
    bl9: backScalp(2.5, 1.3), // 後髮際上 2.5 寸，旁開 1.3 寸
    bl10: backScalp(0, 1.3), // 後髮際正中旁開 1.3 寸
    // BL11–BL30: 第一側線 — 棘突下，後正中線旁開 1.5 寸.
    bl11: { x: BACK_LINE_1, y: SPINE.t(1) },
    bl12: { x: BACK_LINE_1, y: SPINE.t(2) },
    bl13: { x: BACK_LINE_1, y: SPINE.t(3) },
    bl14: { x: BACK_LINE_1, y: SPINE.t(4) },
    bl15: { x: BACK_LINE_1, y: SPINE.t(5) },
    bl16: { x: BACK_LINE_1, y: SPINE.t(6) },
    bl17: { x: BACK_LINE_1, y: SPINE.t(7) },
    bl18: { x: BACK_LINE_1, y: SPINE.t(9) },
    bl19: { x: BACK_LINE_1, y: SPINE.t(10) },
    bl20: { x: BACK_LINE_1, y: SPINE.t(11) },
    bl21: { x: BACK_LINE_1, y: SPINE.t(12) },
    bl22: { x: BACK_LINE_1, y: SPINE.l(1) },
    bl23: { x: BACK_LINE_1, y: SPINE.l(2) },
    bl24: { x: BACK_LINE_1, y: SPINE.l(3) },
    bl25: { x: BACK_LINE_1, y: SPINE.l(4) },
    bl26: { x: BACK_LINE_1, y: SPINE.l(5) },
    bl27: { x: BACK_LINE_1, y: SPINE.s(1) },
    bl28: { x: BACK_LINE_1, y: SPINE.s(2) },
    bl29: { x: BACK_LINE_1, y: SPINE.s(3) },
    bl30: { x: BACK_LINE_1, y: SPINE.s(4) },
    // BL31–BL34 八髎: the posterior sacral foramina, ~0.8 寸 from the midline.
    bl31: { x: MIDLINE - 0.8 * CUN.back, y: SPINE.s(1) },
    bl32: { x: MIDLINE - 0.8 * CUN.back, y: SPINE.s(2) },
    bl33: { x: MIDLINE - 0.8 * CUN.back, y: SPINE.s(3) },
    bl34: { x: MIDLINE - 0.8 * CUN.back, y: SPINE.s(4) },
    // BL41–BL54: 第二側線 — 棘突下，後正中線旁開 3 寸.
    bl41: { x: BACK_LINE_2, y: SPINE.t(2) },
    bl42: { x: BACK_LINE_2, y: SPINE.t(3) },
    bl43: { x: BACK_LINE_2, y: SPINE.t(4) },
    bl44: { x: BACK_LINE_2, y: SPINE.t(5) },
    bl45: { x: BACK_LINE_2, y: SPINE.t(6) },
    bl46: { x: BACK_LINE_2, y: SPINE.t(7) },
    bl47: { x: BACK_LINE_2, y: SPINE.t(9) },
    bl48: { x: BACK_LINE_2, y: SPINE.t(10) },
    bl49: { x: BACK_LINE_2, y: SPINE.t(11) },
    bl50: { x: BACK_LINE_2, y: SPINE.t(12) },
    bl51: { x: BACK_LINE_2, y: SPINE.l(1) },
    bl52: { x: BACK_LINE_2, y: SPINE.l(2) },
    bl53: { x: BACK_LINE_2, y: SPINE.s(2) },
    bl54: { x: BACK_LINE_2, y: SPINE.s(4) },
    bl35: { x: MIDLINE - 0.5 * CUN.back, y: LANDMARKS.coccyxTip }, // 尾骨端旁開 0.5 寸
    bl36: { x: legPoint('right', 'glutealFold', 0).x, y: LANDMARKS.glutealFold }, // 臀下橫紋中點
    bl37: legPoint('right', 'glutealFold', 6, 0.2), // 承扶下 6 寸
    bl38: legPoint('right', 'poplitealCrease', -1, 0.9), // 委陽上 1 寸
    bl39,
    bl40,
    bl55: legPoint('right', 'poplitealCrease', 2, 0.1), // 委中下 2 寸
    bl56: legPoint('right', 'poplitealCrease', 5, 0.1), // 委中下 5 寸
    bl57: legPoint('right', 'poplitealCrease', 8, 0.1), // 委中下 8 寸
    bl58: legPoint('right', 'malleolus', -7, 0.7), // 崑崙直上 7 寸
    bl59: legPoint('right', 'malleolus', -3, 0.7), // 崑崙直上 3 寸
    bl60: legPoint('right', 'malleolus', 0, 0.7), // 外踝尖與跟腱之間
    bl61: footPoint('right', 10, 8),
    bl62: footPoint('right', 11, 13),
    bl63: footPoint('right', 12, 20),
    bl64: footPoint('right', 13, 26),
    bl65: footPoint('right', 13, 33),
    bl66: footPoint('right', 12.5, 38),
    bl67: footPoint('right', 13, 41),
  };

  /* -- 足少陰腎經 — figure's LEFT leg (medial) and LEFT trunk, 0.5 寸 lateral --
   *
   * Drawn on the figure's left so it does not overlap the Spleen line, which
   * runs the medial RIGHT leg. Every abdominal and thoracic coordinate comes
   * straight from the worksheet's own chain: 臍中下 5→上 5 寸 at a constant
   * 0.5 寸 lateral, then the 5th→1st intercostal spaces and the clavicle.
   */
  const ki3 = legPoint('left', 'malleolus', 0, -0.7, 'medial'); // 內踝尖與跟腱之間
  const ki = {
    // 湧泉 is on the SOLE. A front view has no plantar surface, so it projects
    // onto the drawn foot at the same proportional position along its length —
    // the anterior third of the sole — rather than being placed off the figure.
    ki1: footPoint('left', -2, 30),
    ki2: footPoint('left', -11, 20), // 舟骨粗隆下方赤白肉際
    ki3,
    ki4: legPoint('left', 'malleolus', 0.5, -0.55, 'medial'), // 太溪下 0.5 寸稍後
    // 水泉 and 照海 sit BELOW the malleolus, past the end of the leg guide, so
    // they are placed in the foot's own frame — the surface actually drawn
    // there. Extrapolating the leg line put both in the gap between the leg's
    // end cap and the foot outline, floating off the silhouette.
    ki5: footPoint('left', -9, 8), // 太溪直下 1 寸，跟骨結節內側前
    ki6: footPoint('left', -8, 3), // 內踝尖下方凹陷（非後下方）
    ki7: legPoint('left', 'malleolus', -2, -0.7, 'medial'), // 內踝尖上 2 寸
    ki8: legPoint('left', 'malleolus', -2, -1.1, 'medial'), // 復溜前 0.5 寸
    ki9: legPoint('left', 'malleolus', -5, -0.8, 'medial'), // 太溪上 5 寸
    ki10: legPoint('left', 'poplitealCrease', 0, -1.0, 'medial'), // 膝後橫紋內側端
    ki11: trunkPoint('left', fromUmbilicus(-5), 0.5), // 臍中下 5 寸（恥骨聯合上緣）
    ki12: trunkPoint('left', fromUmbilicus(-4), 0.5),
    ki13: trunkPoint('left', fromUmbilicus(-3), 0.5),
    ki14: trunkPoint('left', fromUmbilicus(-2), 0.5),
    ki15: trunkPoint('left', fromUmbilicus(-1), 0.5),
    ki16: trunkPoint('left', LANDMARKS.umbilicus, 0.5), // 平臍旁開 0.5 寸
    ki17: trunkPoint('left', fromUmbilicus(1), 0.5),
    ki18: trunkPoint('left', fromUmbilicus(2), 0.5),
    ki19: trunkPoint('left', fromUmbilicus(3), 0.5),
    ki20: trunkPoint('left', fromUmbilicus(4), 0.5),
    ki21: trunkPoint('left', fromUmbilicus(5), 0.5),
    ki22: trunkPoint('left', ics(5), 2), // 第 5 肋間隙
    ki23: trunkPoint('left', ics(4), 2),
    ki24: trunkPoint('left', ics(3), 2),
    ki25: trunkPoint('left', ics(2), 2),
    ki26: trunkPoint('left', ics(1), 2),
    ki27: trunkPoint('left', ics(0), 2), // 鎖骨下緣
  };

  /* -- 手厥陰心包經 — figure's LEFT arm, on the limb's CENTRE line -----------
   *
   * PC runs the midline of the inner arm, between the Lung (in front of it) and
   * the Heart (behind). A front view flattens the flexor and extensor surfaces
   * into one plane, so the figure cannot show "between LU and HT" literally —
   * LU is drawn on this arm and HT on the other. What it CAN show truthfully is
   * that PC runs the centre of the limb while its neighbours run its borders,
   * so PC takes lateral 0 and sits between LU (+0.9) and SI (−0.9) here.
   */
  const pc = {
    pc1: trunkPoint('left', ics(4), 5), // 第 4 肋間隙，旁開 5 寸
    pc2: armPoint('left', 'axilla', 2, 0), // 腋前紋頭下 2 寸
    pc3: armPoint('left', 'elbowCrease', 0, -0.3), // 肘橫紋中，肱二頭肌腱尺側
    pc4: armPoint('left', 'wristCrease', -5, 0), // 腕橫紋上 5 寸
    pc5: armPoint('left', 'wristCrease', -3, 0), // 腕橫紋上 3 寸
    pc6: armPoint('left', 'wristCrease', -2, 0), // 腕橫紋上 2 寸
    pc7: handPoint('left', 0, 0), // 腕掌側橫紋中點 — ON the crease
    pc8: handPoint('left', 3, 24), // 第 2、3 掌骨之間，握拳中指尖處
    pc9: handPoint('left', 5, 79), // 中指尖端
  };

  /* -- 手少陽三焦經 — figure's RIGHT arm centre line, then neck, ear, brow --- */
  const te14 = {
    x: LANDMARKS.acromion.right[0] + 5,
    y: LANDMARKS.acromion.right[1] + 10,
  }; // 肩峰角與肱骨大結節之間，肩髃後方
  const te17 = {
    x: LANDMARKS.mastoid.right[0] + 2,
    y: LANDMARKS.mastoid.right[1] - 4,
  }; // 耳垂後方，乳突前下方
  const te20 = {
    x: LANDMARKS.earApex.right[0] + 3,
    y: LANDMARKS.earApex.right[1] - 6,
  }; // 耳尖直上入髮際
  const te21 = {
    x: LANDMARKS.tragus.right[0] + 4,
    y: LANDMARKS.tragus.right[1] - 7,
  }; // 耳屏上切跡前方，聽宮上方
  const te = {
    te1: handPoint('right', -9, 73), // 無名指尺側端甲角
    te2: handPoint('right', -9, 41), // 第 4、5 指蹼緣後方
    te3: handPoint('right', -9, 28), // 第 4、5 掌骨間
    te4: handPoint('right', 0, 0), // 腕背橫紋中點 — ON the crease
    te5: armPoint('right', 'wristCrease', -2, 0), // 腕背橫紋上 2 寸
    te6: armPoint('right', 'wristCrease', -3, 0), // 腕背橫紋上 3 寸
    te7: armPoint('right', 'wristCrease', -3, -0.6), // 支溝尺側
    te8: armPoint('right', 'wristCrease', -4, 0), // 腕背橫紋上 4 寸
    te9: armPoint('right', 'wristCrease', -7, 0), // 腕背橫紋上 7 寸
    // 肘尖 (the olecranon) is a posterior landmark with no front-view surface,
    // so the elbow crease stands in for it and the offsets follow the stated
    // distances above the tip.
    te10: armPoint('right', 'elbowCrease', -1, 0),
    te11: armPoint('right', 'elbowCrease', -2, 0), // 肘尖上 2 寸
    te12: armPoint('right', 'elbowCrease', -5, 0), // 肘尖上 5 寸
    te13: armPoint('right', 'axilla', 0.5, 0.5), // 肩髎下 3 寸
    te14,
    te15: { x: MIDLINE - 3.6 * CUN.back, y: LANDMARKS.scapularSuperiorAngle - 6 }, // BACK view
    te16: { x: MIDLINE - 0.85 * LANDMARKS.neckHalfWidth, y: LANDMARKS.mastoid.right[1] + 12 },
    te17,
    // 瘈脈 and 顱息 divide the helix curve from 翳風 to 角孫 into thirds.
    te18: lerp(te17, te20, 1 / 3),
    te19: lerp(te17, te20, 2 / 3),
    te20,
    te21,
    te22: { x: te21.x - 1, y: te21.y - 9 }, // 耳門上約 0.5 寸
    te23: { x: LANDMARKS.browOuter.right[0], y: LANDMARKS.browOuter.right[1] }, // 眉梢外側
  };

  /* -- 足少陽膽經 — the figure's LEFT side, projected onto two views ---------
   *
   * GB is a genuinely LATERAL channel and the figure has only front and back
   * views, so each station is projected onto whichever face is nearer, exactly
   * as the worksheet's own View field records. That projection is a limitation
   * of a two-view schematic, not an anatomical claim, and every GB placement
   * says so in its note.
   *
   * SIDE: the figure's LEFT throughout, which puts 聽會 GB2 on the same ear as
   * 聽宮 SI19 — the pair a learner compares. 耳門 TE21, the third of the 耳前
   * 三穴, is drawn on the other ear because each channel occupies one side.
   *
   * VIEW MIRRORING: on the front view the figure's left is the viewer's right
   * (x > MID); on the back view it is the viewer's LEFT (x < MID). The leg
   * helpers take the side whose GUIDE sits on the correct half of the canvas,
   * which is 'left' for front-view stations and 'right' for back-view ones.
   */
  const headScalp = (cunAboveHairline: number, lateralCun: number) => ({
    x: MIDLINE + lateralCun * CUN.head,
    y: scalpPoint(cunAboveHairline).y,
  });
  const gb7 = { x: LANDMARKS.earApex.left[0] - 6, y: LANDMARKS.earApex.left[1] + 4 };
  const gb8 = { x: LANDMARKS.earApex.left[0] - 1, y: LANDMARKS.earApex.left[1] - 9 };
  const gb12 = { x: LANDMARKS.mastoid.left[0] - 3, y: LANDMARKS.mastoid.left[1] + 3 };
  const gb9 = { x: LANDMARKS.earApex.left[0] - 5, y: LANDMARKS.earApex.left[1] - 12 };
  const gb20 = { x: MIDLINE - 1.3 * CUN.back, y: LANDMARKS.backHairline - 2 };
  const gb34 = legPoint('right', 'poplitealCrease', 2, 1.0); // 腓骨頭前下方
  const gb = {
    gb1: { x: FACE.eyeL[0] + 12, y: LEVELS.eye }, // 目外眥旁，眶外側緣
    gb2: { x: LANDMARKS.tragus.left[0] + 3, y: LANDMARKS.tragus.left[1] + 6 }, // 耳屏間切跡前
    gb3: { x: FACE.jawAngleL[0] - 3, y: LEVELS.eye + 22 }, // 顴弓上緣，下關直上
    // 頷厭 / 懸顱 / 懸釐 divide the 頭維 → 曲鬢 curve into quarters.
    gb4: lerp({ x: FACE.hairlineCornerL[0], y: FACE.hairlineCornerL[1] }, gb7, 0.25),
    gb5: lerp({ x: FACE.hairlineCornerL[0], y: FACE.hairlineCornerL[1] }, gb7, 0.5),
    gb6: lerp({ x: FACE.hairlineCornerL[0], y: FACE.hairlineCornerL[1] }, gb7, 0.75),
    gb7,
    gb8,
    gb9,
    // 浮白 / 頭竅陰 divide the 天衝 → 完骨 curve into thirds.
    gb10: lerp(gb9, gb12, 1 / 3),
    gb11: lerp(gb9, gb12, 2 / 3),
    gb12,
    gb13: headScalp(0.5, 3), // 前髮際上 0.5 寸，神庭旁開 3 寸
    gb14: { x: FACE.eyeL[0], y: LEVELS.eye - 20 }, // 瞳孔直上，眉上 1 寸
    gb15: { x: FACE.eyeL[0], y: scalpPoint(0.5).y }, // 瞳孔直上入前髮際 0.5 寸
    gb16: headScalp(1.5, 2.25),
    gb17: headScalp(2.5, 2.25),
    gb18: headScalp(4, 2.25),
    gb19: { x: MIDLINE - 2.25 * CUN.head, y: LANDMARKS.backHairline - 12 }, // 枕外隆凸外側
    gb20,
    gb21: { x: MIDLINE - 3.5 * CUN.back, y: LEVELS.shoulder - 12 }, // 大椎與肩峰連線中點
    gb22: trunkPoint('left', ics(4), 7), // 腋中線，腋下 3 寸，第 4 肋間
    gb23: trunkPoint('left', ics(4), 6), // 淵腋前 1 寸，平乳頭
    gb24: trunkPoint('left', ics(7), 4), // 第 7 肋間隙，旁開 4 寸
    gb25: { x: MIDLINE - 4.2 * CUN.back, y: LANDMARKS.umbilicus - 1.5 * CUN.upperAbdomen },
    gb26: trunkPoint('left', LANDMARKS.umbilicus, 3.8), // 平臍，第 11 肋端下方
    gb27: trunkPoint('left', fromUmbilicus(-3), 4.6), // 髂前上棘前方，平臍下 3 寸
    gb28: trunkPoint('left', fromUmbilicus(-3.5), 4.8), // 五樞前下 0.5 寸
    gb29: { x: MIDLINE - 4.0 * CUN.back, y: LANDMARKS.pubicSymphysis + 4 }, // 髂前上棘—大轉子中點
    gb30: { x: MIDLINE - 4.6 * CUN.back, y: LANDMARKS.glutealFold - 26 }, // 大轉子—骶管裂孔外 1/3
    gb31: legPoint('right', 'poplitealCrease', -7, 1.05), // 膕橫紋上 7 寸
    gb32: legPoint('right', 'poplitealCrease', -5, 1.05), // 膕橫紋上 5 寸
    gb33: legPoint('right', 'poplitealCrease', -1, 1.1), // 陽陵泉上 3 寸
    gb34,
    gb35: legPoint('right', 'malleolus', -7, 1.0), // 外踝尖上 7 寸，腓骨後緣
    gb36: legPoint('right', 'malleolus', -7, 1.25), // 外踝尖上 7 寸，腓骨前緣
    gb37: legPoint('right', 'malleolus', -5, 1.2), // 外踝尖上 5 寸
    gb38: legPoint('right', 'malleolus', -4, 1.2), // 外踝尖上 4 寸
    gb39: legPoint('right', 'malleolus', -3, 1.2), // 外踝尖上 3 寸（絕骨）
    gb40: footPoint('left', 9, 6), // 外踝前下方
    gb41: footPoint('left', 6.5, 30), // 第 4 蹠趾關節後方
    gb42: footPoint('left', 8.5, 33), // 第 4、5 蹠骨之間
    gb43: footPoint('left', 9.5, 38), // 第 4、5 趾間趾蹼緣後方
    gb44: footPoint('left', 8, 45), // 第 4 趾末節外側甲角
  };

  /* -- 足厥陰肝經 — the figure's RIGHT leg (medial) and right flank ---------
   *
   * Shares the medial right leg with the Spleen line, which is why LR sits at a
   * distinct lateral offset from it: below 內踝上 8 寸 the Liver runs in front
   * of the Spleen, and above that the two cross — the figure keeps them apart
   * rather than trying to draw the crossing.
   *
   * 章門 LR13 and 期門 LR14 land on the opposite side from the Gallbladder
   * points that cite them (京門 GB25, 帶脈 GB26, 日月 GB24). Every channel is
   * drawn on one side for legibility while being bilateral in the body, which
   * the legend already states.
   */
  const lr = {
    lr1: footPoint('right', 6, 45), // 大趾外側甲角，靠第 2 趾那側
    lr2: footPoint('right', 2, 40), // 第 1、2 趾間趾蹼緣後方
    lr3: footPoint('right', 0, 28), // 第 1、2 蹠骨間
    lr4: footPoint('right', -6, 4), // 內踝前 1 寸
    lr5: legPoint('right', 'malleolus', -5, -0.35, 'medial'), // 內踝尖上 5 寸
    lr6: legPoint('right', 'malleolus', -7, -0.35, 'medial'), // 內踝尖上 7 寸
    lr7: legPoint('right', 'poplitealCrease', 1.2, -0.7, 'medial'), // 脛骨內側髁後下方
    lr8: legPoint('right', 'poplitealCrease', 0, -1.15, 'medial'), // 膕橫紋內側端
    lr9: legPoint('right', 'patellaSuperior', -4, -1.05), // 股骨內上髁上 4 寸
    lr10: trunkPoint('right', LANDMARKS.pubicSymphysis + 3 * CUN.lowerAbdomen * 0.6, 2),
    lr11: trunkPoint('right', LANDMARKS.pubicSymphysis + 2 * CUN.lowerAbdomen * 0.6, 2),
    lr12: trunkPoint('right', LANDMARKS.pubicSymphysis + 8, 2.5), // 恥骨聯合下緣旁開 2.5 寸
    lr13: trunkPoint('right', ics(8), 4), // 第 11 肋游離端下方，旁開 4 寸
    lr14: trunkPoint('right', ics(6), 4), // 乳頭直下第 6 肋間隙，旁開 4 寸
  };

  /* -- 任脈 CV + 督脈 GV — the two MIDLINE vessels -------------------------
   *
   * Unlike the twelve, these have no side: every point sits on the midline
   * itself, so `trunkPoint('midline', …)` places them and `side` is 'midline'.
   *
   * They are also the reference the rest of the dataset already uses. Every
   * 「前正中線旁開 N 寸」 counts outward from the Conception line and every
   * 「後正中線旁開 N 寸」 — the whole back-shu system — from the Governor. The
   * two vessels are therefore anchored to exactly the same LANDMARKS and SPINE
   * ladder the lateral points were measured against, so they cannot disagree.
   */
  const cv = {
    cv1: trunkPoint('midline', LEVELS.crotch + 2), // 會陰區
    cv2: trunkPoint('midline', LANDMARKS.pubicSymphysis), // 恥骨聯合上緣
    cv3: trunkPoint('midline', fromUmbilicus(-4)),
    cv4: trunkPoint('midline', fromUmbilicus(-3)),
    cv5: trunkPoint('midline', fromUmbilicus(-2)),
    cv6: trunkPoint('midline', fromUmbilicus(-1.5)),
    cv7: trunkPoint('midline', fromUmbilicus(-1)),
    cv8: trunkPoint('midline', LANDMARKS.umbilicus), // 臍中央 — the zero of the abdominal ruler
    cv9: trunkPoint('midline', fromUmbilicus(1)),
    cv10: trunkPoint('midline', fromUmbilicus(2)),
    cv11: trunkPoint('midline', fromUmbilicus(3)),
    cv12: trunkPoint('midline', fromUmbilicus(4)),
    cv13: trunkPoint('midline', fromUmbilicus(5)),
    cv14: trunkPoint('midline', fromUmbilicus(6)),
    cv15: trunkPoint('midline', LANDMARKS.xiphisternal + CUN.upperAbdomen), // 胸劍結合下 1 寸
    cv16: trunkPoint('midline', LANDMARKS.xiphisternal), // 胸劍結合部，平第 5 肋間
    cv17: trunkPoint('midline', ics(4)), // 兩乳頭連線中點
    cv18: trunkPoint('midline', ics(3)),
    cv19: trunkPoint('midline', ics(2)),
    cv20: trunkPoint('midline', ics(1)),
    cv21: trunkPoint('midline', belowSternalNotch(1)), // 天突下 1 寸
    cv22: trunkPoint('midline', LANDMARKS.sternalNotch), // 胸骨上窩中央
    cv23: trunkPoint('midline', LANDMARKS.hyoid), // 舌骨上緣
    cv24: trunkPoint('midline', LANDMARKS.mentolabial), // 頦唇溝正中
  };

  const gv = {
    gv1: trunkPoint('midline', LANDMARKS.coccyxTip + 8), // 尾骨端與肛門之間
    gv2: trunkPoint('midline', LANDMARKS.sacralHiatus), // 骶管裂孔
    gv3: trunkPoint('midline', SPINE.l(4)),
    gv4: trunkPoint('midline', SPINE.l(2)),
    gv5: trunkPoint('midline', SPINE.l(1)),
    gv6: trunkPoint('midline', SPINE.t(11)),
    gv7: trunkPoint('midline', SPINE.t(10)),
    gv8: trunkPoint('midline', SPINE.t(9)),
    gv9: trunkPoint('midline', SPINE.t(7)),
    gv10: trunkPoint('midline', SPINE.t(6)),
    gv11: trunkPoint('midline', SPINE.t(5)),
    gv12: trunkPoint('midline', SPINE.t(3)),
    gv13: trunkPoint('midline', SPINE.t(1)),
    gv14: trunkPoint('midline', LANDMARKS.c7), // 第 7 頸椎棘突下
    gv15: backScalp(0.5), // 後髮際上 0.5 寸
    gv16: backScalp(1), // 後髮際上 1 寸
    gv17: backScalp(2.5),
    gv18: backScalp(4),
    gv19: backScalp(5.5),
    // 百會 is the vertex — 前髮際上 5 寸 on the scalp ladder, and the highest
    // point of the drawn head. The front view carries it because that is the
    // face the scalp ladder is projected onto.
    gv20: scalpPoint(5),
    gv21: scalpPoint(3.5),
    gv22: scalpPoint(2),
    gv23: scalpPoint(1),
    gv24: scalpPoint(0.5),
    gv25: { x: MIDLINE, y: LEVELS.nose }, // 鼻尖正中
    gv26: { x: MIDLINE, y: LANDMARKS.philtrum }, // 人中溝上 1/3
    gv27: { x: MIDLINE, y: LANDMARKS.upperLip }, // 上唇尖端
    // 齦交 is INSIDE the upper lip. A two-view surface figure cannot show an
    // intra-oral point, so the marker projects onto the lip surface directly
    // over it; the record says so rather than implying the surface position is
    // the real one.
    gv28: { x: MIDLINE, y: LEVELS.mouth + 1 },
    gv29: { x: MIDLINE, y: LANDMARKS.glabella }, // 印堂 — the glabella landmark itself
  };

  return {
    ...lu, ...li, ...st, ...sp, ...ht, ...si, ...bl,
    ...ki, ...pc, ...te, ...gb, ...lr, ...cv, ...gv,
  };
})();

const PLACEMENT_NOTE =
  'Marker position is a layout coordinate on the project\'s schematic figure, chosen to reflect the described route order only. It is NOT a validated anatomical coordinate and must not be used to locate a point on a real body.';

/* --------------------------------------------------------------------------
 * 手太陰肺經 Lung meridian — drawn on the figure's left arm (viewer's right).
 * -------------------------------------------------------------------------- */
const lungSpecs: Spec[] = [
  {
    code: 'LU1',
    meridianId: 'mer_lu',
    ordinal: 1,
    zh: '中府',
    zhs: '中府',
    en: 'Central Treasury',
    py: 'zhong fu',
    region: 'chest',
    x: A.lu1.x,
    y: A.lu1.y,
    side: 'left',
    tier: 1,
    aliases: ['Zhongfu'],
  },
  {
    code: 'LU2',
    meridianId: 'mer_lu',
    ordinal: 2,
    zh: '雲門',
    zhs: '云门',
    en: 'Cloud Gate',
    py: 'yun men',
    region: 'chest',
    x: A.lu2.x,
    y: A.lu2.y,
    side: 'left',
    tier: 1,
    aliases: ['Yunmen'],
    cues: [
      {
        text: {
          zhHant: '雲門：肺氣如雲出入之門。',
          en: 'Cloud Gate: the name pictures lung qi moving like cloud through a gate.',
        },
        sourceIds: [OUTLINE],
        notes: 'Name-etymology memory hook from the curriculum outline. Not a clinical claim.',
      },
    ],
  },
  {
    code: 'LU3',
    meridianId: 'mer_lu',
    ordinal: 3,
    zh: '天府',
    zhs: '天府',
    en: 'Celestial Storehouse',
    py: 'tian fu',
    region: 'upper arm',
    x: A.lu3.x,
    y: A.lu3.y,
    side: 'left',
    tier: 3,
    aliases: ['Tianfu'],
  },
  {
    code: 'LU4',
    meridianId: 'mer_lu',
    ordinal: 4,
    zh: '俠白',
    zhs: '侠白',
    en: 'Guarding White',
    py: 'xia bai',
    region: 'upper arm',
    x: A.lu4.x,
    y: A.lu4.y,
    side: 'left',
    tier: 3,
    aliases: ['Xiabai'],
  },
  {
    code: 'LU5',
    meridianId: 'mer_lu',
    ordinal: 5,
    zh: '尺澤',
    zhs: '尺泽',
    en: 'Cubit Marsh',
    py: 'chi ze',
    region: 'elbow',
    x: A.lu5.x,
    y: A.lu5.y,
    side: 'left',
    tier: 1,
    aliases: ['Chize'],
    classifications: {
      value: ['he_sea'],
      sourceIds: [CLASSICAL],
      notes: 'Classical five-shu attribution. Not yet cross-checked against a modern standard.',
    },
    location: {
      text: {
        zhHant: '肘窩橫紋中點附近的凹陷處。',
        en: 'In the hollow around the midpoint of the cubital (elbow) crease.',
      },
      sourceIds: [HANDBOOK, OUTLINE],
      notes:
        'Restated from the handbook flashcard 「肘窩橫紋中點」 and the outline\'s 「肘窩凹陷如水澤」. Course-level description only; not a substitute for a point-location standard.',
    },
    cues: [
      {
        text: {
          zhHant: '尺澤：肘窩凹陷如水澤。',
          en: 'Cubit Marsh: the hollow of the elbow pictured as a marsh.',
        },
        sourceIds: [OUTLINE],
        notes: 'Name-etymology memory hook.',
      },
    ],
  },
  {
    code: 'LU6',
    meridianId: 'mer_lu',
    ordinal: 6,
    zh: '孔最',
    zhs: '孔最',
    en: 'Collection Hole',
    py: 'kong zui',
    region: 'forearm',
    x: A.lu6.x,
    y: A.lu6.y,
    side: 'left',
    tier: 1,
    aliases: ['Kongzui'],
    classifications: {
      value: ['xi_cleft'],
      sourceIds: [CLASSICAL, HANDBOOK],
      notes: 'Handbook Day 11 lists 孔最 among xi-cleft points. Not yet cross-checked.',
    },
  },
  {
    code: 'LU7',
    meridianId: 'mer_lu',
    ordinal: 7,
    zh: '列缺',
    zhs: '列缺',
    en: 'Broken Sequence',
    py: 'lie que',
    region: 'wrist',
    x: A.lu7.x,
    y: A.lu7.y,
    side: 'left',
    tier: 1,
    aliases: ['Lieque'],
    classifications: {
      value: ['luo_connecting'],
      sourceIds: [CLASSICAL, HANDBOOK],
      notes: 'Handbook Day 11 lists 列缺（肺）among luo-connecting points.',
    },
    location: {
      text: {
        zhHant: '兩手虎口交叉，上方食指指尖所到達的凹陷處。',
        en: 'Cross the two hands at the web of the thumbs; the hollow reached by the tip of the upper index finger.',
      },
      sourceIds: [HANDBOOK, OUTLINE],
      notes:
        'Restated from the handbook\'s 「兩虎口交叉食指尖到達處」. This is the traditional finger-measurement teaching cue, not a metric standard.',
    },
  },
  {
    code: 'LU8',
    meridianId: 'mer_lu',
    ordinal: 8,
    zh: '經渠',
    zhs: '经渠',
    en: 'Channel Ditch',
    py: 'jing qu',
    region: 'wrist',
    x: A.lu8.x,
    y: A.lu8.y,
    side: 'left',
    tier: 3,
    aliases: ['Jingqu'],
    classifications: {
      value: ['jing_river'],
      sourceIds: [CLASSICAL],
      notes: 'Classical five-shu attribution. Not yet cross-checked against a modern standard.',
    },
  },
  {
    code: 'LU9',
    meridianId: 'mer_lu',
    ordinal: 9,
    zh: '太淵',
    zhs: '太渊',
    en: 'Great Abyss',
    py: 'tai yuan',
    region: 'wrist',
    x: A.lu9.x,
    y: A.lu9.y,
    side: 'left',
    tier: 1,
    aliases: ['Taiyuan', '太渊'],
    classifications: {
      value: ['yuan_source', 'shu_stream', 'influential_meeting'],
      sourceIds: [HANDBOOK],
      notes:
        'Handbook Day 1: 「太淵是什麼穴？（肺經原穴、輸穴、脈會）」and the 八會穴 appendix lists 脈會太淵. Recorded as a curriculum claim awaiting reconciliation.',
    },
  },
  {
    code: 'LU10',
    meridianId: 'mer_lu',
    ordinal: 10,
    zh: '魚際',
    zhs: '鱼际',
    en: 'Fish Border',
    py: 'yu ji',
    region: 'hand',
    x: A.lu10.x,
    y: A.lu10.y,
    side: 'left',
    tier: 1,
    aliases: ['Yuji'],
    classifications: {
      value: ['ying_spring'],
      sourceIds: [CLASSICAL],
      notes: 'Classical five-shu attribution. Not yet cross-checked against a modern standard.',
    },
  },
  {
    code: 'LU11',
    meridianId: 'mer_lu',
    ordinal: 11,
    zh: '少商',
    zhs: '少商',
    en: 'Lesser Shang',
    py: 'shao shang',
    region: 'thumb',
    x: A.lu11.x,
    y: A.lu11.y,
    side: 'left',
    tier: 1,
    aliases: ['Shaoshang'],
    classifications: {
      value: ['jing_well'],
      sourceIds: [CLASSICAL, HANDBOOK],
      notes:
        'Classical five-shu attribution; handbook groups 井穴 on Day 11. The handbook also attaches an invasive technique (放血) to this point — deliberately NOT ingested, per the project safety rules.',
    },
  },
];

/* --------------------------------------------------------------------------
 * 手陽明大腸經 Large Intestine — drawn on the figure's right arm (viewer's left).
 * -------------------------------------------------------------------------- */
const largeIntestineSpecs: Spec[] = [
  {
    code: 'LI1',
    meridianId: 'mer_li',
    ordinal: 1,
    zh: '商陽',
    zhs: '商阳',
    en: 'Shang Yang',
    py: 'shang yang',
    region: 'index finger',
    x: A.li1.x,
    y: A.li1.y,
    side: 'right',
    tier: 1,
    aliases: ['Shangyang'],
    classifications: {
      value: ['jing_well'],
      sourceIds: [CLASSICAL],
      notes: 'Classical five-shu attribution. Not yet cross-checked against a modern standard.',
    },
  },
  {
    code: 'LI2',
    meridianId: 'mer_li',
    ordinal: 2,
    zh: '二間',
    zhs: '二间',
    en: 'Second Space',
    py: 'er jian',
    region: 'index finger',
    x: A.li2.x,
    y: A.li2.y,
    side: 'right',
    tier: 3,
    aliases: ['Erjian'],
    classifications: {
      value: ['ying_spring'],
      sourceIds: [CLASSICAL],
      notes: 'Classical five-shu attribution. Not yet cross-checked.',
    },
  },
  {
    code: 'LI3',
    meridianId: 'mer_li',
    ordinal: 3,
    zh: '三間',
    zhs: '三间',
    en: 'Third Space',
    py: 'san jian',
    region: 'hand',
    x: A.li3.x,
    y: A.li3.y,
    side: 'right',
    tier: 3,
    aliases: ['Sanjian'],
    classifications: {
      value: ['shu_stream'],
      sourceIds: [CLASSICAL],
      notes: 'Classical five-shu attribution. Not yet cross-checked.',
    },
  },
  {
    code: 'LI4',
    meridianId: 'mer_li',
    ordinal: 4,
    zh: '合谷',
    zhs: '合谷',
    en: 'Union Valley',
    py: 'he gu',
    region: 'hand',
    x: A.li4.x,
    y: A.li4.y,
    side: 'right',
    tier: 1,
    aliases: ['Hegu', '虎口穴'],
    classifications: {
      value: ['yuan_source'],
      sourceIds: [HANDBOOK],
      notes: 'Handbook Day 11 原穴回顧 lists 合谷（大腸）.',
    },
    location: {
      text: {
        zhHant: '手背第一、二掌骨之間，虎口肌肉隆起的縫隙凹陷處。',
        en: 'On the back of the hand, in the hollow of the muscular web between the first and second metacarpal bones.',
      },
      sourceIds: [HANDBOOK, OUTLINE],
      notes:
        'Restated from the handbook\'s 「虎口肌肉縫隙處」 and the outline\'s 「虎口肌肉縫隙如山谷」. Course-level description only.',
    },
    cues: [
      {
        text: {
          zhHant: '合谷：虎口肌肉縫隙如山谷，「谷」就是凹陷。',
          en: 'Union Valley: the web of the thumb read as a valley — the name is the landmark.',
        },
        sourceIds: [OUTLINE, HANDBOOK],
        notes: 'Name-etymology memory hook.',
      },
    ],
  },
  {
    code: 'LI5',
    meridianId: 'mer_li',
    ordinal: 5,
    zh: '陽谿',
    zhs: '阳溪',
    en: 'Yang Ravine',
    py: 'yang xi',
    region: 'wrist',
    x: A.li5.x,
    y: A.li5.y,
    side: 'right',
    tier: 1,
    aliases: ['Yangxi', '陽溪'],
    classifications: {
      value: ['jing_river'],
      sourceIds: [CLASSICAL],
      notes: 'Classical five-shu attribution. Not yet cross-checked.',
    },
  },
  {
    code: 'LI6',
    meridianId: 'mer_li',
    ordinal: 6,
    zh: '偏歷',
    zhs: '偏历',
    en: 'Veering Passage',
    py: 'pian li',
    region: 'forearm',
    x: A.li6.x,
    y: A.li6.y,
    side: 'right',
    tier: 1,
    aliases: ['Pianli'],
    classifications: {
      value: ['luo_connecting'],
      sourceIds: [HANDBOOK],
      notes: 'Handbook Day 11 絡穴回顧 lists 偏歷（大腸）.',
    },
  },
  {
    code: 'LI7',
    meridianId: 'mer_li',
    ordinal: 7,
    zh: '溫溜',
    zhs: '温溜',
    en: 'Warm Dwelling',
    py: 'wen liu',
    region: 'forearm',
    x: A.li7.x,
    y: A.li7.y,
    side: 'right',
    tier: 3,
    aliases: ['Wenliu'],
    classifications: {
      value: ['xi_cleft'],
      sourceIds: [CLASSICAL],
      notes: 'Classical attribution. Not yet cross-checked.',
    },
  },
  {
    code: 'LI8',
    meridianId: 'mer_li',
    ordinal: 8,
    zh: '下廉',
    zhs: '下廉',
    en: 'Lower Ridge',
    py: 'xia lian',
    region: 'forearm',
    x: A.li8.x,
    y: A.li8.y,
    side: 'right',
    tier: 3,
    aliases: ['Xialian'],
  },
  {
    code: 'LI9',
    meridianId: 'mer_li',
    ordinal: 9,
    zh: '上廉',
    zhs: '上廉',
    en: 'Upper Ridge',
    py: 'shang lian',
    region: 'forearm',
    x: A.li9.x,
    y: A.li9.y,
    side: 'right',
    tier: 3,
    aliases: ['Shanglian'],
  },
  {
    code: 'LI10',
    meridianId: 'mer_li',
    ordinal: 10,
    zh: '手三里',
    zhs: '手三里',
    en: 'Arm Three Li',
    py: 'shou san li',
    region: 'forearm',
    x: A.li10.x,
    y: A.li10.y,
    side: 'right',
    tier: 1,
    aliases: ['Shousanli', '三里'],
  },
  {
    code: 'LI11',
    meridianId: 'mer_li',
    ordinal: 11,
    zh: '曲池',
    zhs: '曲池',
    en: 'Pool at the Bend',
    py: 'qu chi',
    region: 'elbow',
    x: A.li11.x,
    y: A.li11.y,
    side: 'right',
    tier: 1,
    aliases: ['Quchi'],
    classifications: {
      value: ['he_sea'],
      sourceIds: [HANDBOOK, CLASSICAL],
      notes: 'Handbook Day 1: 「大腸經合穴曲池」.',
    },
  },
  {
    code: 'LI12',
    meridianId: 'mer_li',
    ordinal: 12,
    zh: '肘髎',
    zhs: '肘髎',
    en: 'Elbow Bone-Hole',
    py: 'zhou liao',
    region: 'elbow',
    x: A.li12.x,
    y: A.li12.y,
    side: 'right',
    tier: 3,
    aliases: ['Zhouliao'],
  },
  {
    code: 'LI13',
    meridianId: 'mer_li',
    ordinal: 13,
    zh: '手五里',
    zhs: '手五里',
    en: 'Arm Five Li',
    py: 'shou wu li',
    region: 'upper arm',
    x: A.li13.x,
    y: A.li13.y,
    side: 'right',
    tier: 3,
    aliases: ['Shouwuli'],
  },
  {
    code: 'LI14',
    meridianId: 'mer_li',
    ordinal: 14,
    zh: '臂臑',
    zhs: '臂臑',
    en: 'Upper Arm',
    py: 'bi nao',
    region: 'upper arm',
    x: A.li14.x,
    y: A.li14.y,
    side: 'right',
    tier: 1,
    aliases: ['Binao'],
  },
  {
    code: 'LI15',
    meridianId: 'mer_li',
    ordinal: 15,
    zh: '肩髃',
    zhs: '肩髃',
    en: 'Shoulder Bone',
    py: 'jian yu',
    region: 'shoulder',
    x: A.li15.x,
    y: A.li15.y,
    side: 'right',
    tier: 1,
    aliases: ['Jianyu'],
  },
  {
    code: 'LI16',
    meridianId: 'mer_li',
    ordinal: 16,
    zh: '巨骨',
    zhs: '巨骨',
    en: 'Great Bone',
    py: 'ju gu',
    region: 'shoulder',
    x: A.li16.x,
    y: A.li16.y,
    side: 'right',
    tier: 3,
    aliases: ['Jugu'],
  },
  {
    code: 'LI17',
    meridianId: 'mer_li',
    ordinal: 17,
    zh: '天鼎',
    zhs: '天鼎',
    en: 'Celestial Vessel',
    py: 'tian ding',
    region: 'neck',
    x: A.li17.x,
    y: A.li17.y,
    side: 'right',
    tier: 3,
    aliases: ['Tianding'],
  },
  {
    code: 'LI18',
    meridianId: 'mer_li',
    ordinal: 18,
    zh: '扶突',
    zhs: '扶突',
    en: 'Protuberance Assistant',
    py: 'fu tu',
    region: 'neck',
    x: A.li18.x,
    y: A.li18.y,
    side: 'right',
    tier: 3,
    aliases: ['Futu'],
  },
  {
    code: 'LI19',
    meridianId: 'mer_li',
    ordinal: 19,
    zh: '口禾髎',
    zhs: '口禾髎',
    en: 'Mouth Grain Bone-Hole',
    py: 'kou he liao',
    region: 'face',
    x: A.li19.x,
    y: A.li19.y,
    side: 'right',
    tier: 3,
    aliases: ['Kouheliao', '禾髎'],
  },
  {
    code: 'LI20',
    meridianId: 'mer_li',
    ordinal: 20,
    zh: '迎香',
    zhs: '迎香',
    en: 'Welcome Fragrance',
    py: 'ying xiang',
    region: 'face',
    x: A.li20.x,
    y: A.li20.y,
    side: 'right',
    tier: 1,
    aliases: ['Yingxiang'],
    location: {
      text: {
        zhHant: '鼻翼外緣旁開約 0.5 寸的鼻唇溝中。',
        en: 'In the nasolabial groove, roughly 0.5 cun lateral to the outer border of the ala of the nose.',
      },
      sourceIds: [OUTLINE],
      notes:
        'Restated from the outline\'s 「鼻翼旁開0.5寸」. 寸 (cun) here is the proportional body-inch used in the curriculum, not a fixed metric distance.',
    },
    cues: [
      {
        text: {
          zhHant: '迎香：迎接香味，位置就在鼻子旁邊。',
          en: 'Welcome Fragrance: "greeting scent" — the name puts it beside the nose.',
        },
        sourceIds: [OUTLINE],
        notes: 'Name-etymology memory hook.',
      },
    ],
  },
];

/* --------------------------------------------------------------------------
 * 足陽明胃經 Stomach meridian — Day 2. Drawn on the figure's left side
 * (viewer's right): face → neck → chest line → abdominal line → front of the
 * leg → second toe. Locations are recorded ONLY for the points the curriculum
 * actually describes (四白, 地倉, 頰車, 天樞, 足三里, 內庭); everything else
 * shows "no location recorded". The handbook's symptom→point pairings
 * (天樞→腹瀉便秘, 內庭→牙痛口臭 etc.) are deliberately NOT ingested, and its
 * intentional trap card (豐隆「豐胸（誤！）」) is excluded as well.
 * -------------------------------------------------------------------------- */
const ST = (
  n: number,
  zh: string,
  zhs: string,
  en: string,
  py: string,
  region: string,
  at: { x: number; y: number },
  tier: 1 | 2 | 3,
  extra?: Partial<Spec>,
): Spec => ({
  code: `ST${n}`,
  meridianId: 'mer_st',
  ordinal: n,
  zh,
  zhs,
  en,
  py,
  region,
  x: at.x,
  y: at.y,
  side: 'left',
  tier,
  ...extra,
});

const stomachSpecs: Spec[] = [
  ST(1, '承泣', '承泣', 'Tear Container', 'cheng qi', 'face', A.st1, 2),
  ST(2, '四白', '四白', 'Four Whites', 'si bai', 'face', A.st2, 1, {
    aliases: ['Sibai'],
    location: {
      text: {
        zhHant: '瞳孔直下，眶下孔凹陷處。',
        en: 'Directly below the pupil, in the depression at the infraorbital foramen.',
      },
      sourceIds: [OUTLINE, HANDBOOK],
      notes: 'Restated from 「瞳孔直下，眶下孔（眼袋處）」. Not yet cross-checked against a point-location standard.',
    },
  }),
  ST(3, '巨髎', '巨髎', 'Great Crevice', 'ju liao', 'face', A.st3, 3),
  ST(4, '地倉', '地仓', 'Earth Granary', 'di cang', 'face', A.st4, 2, {
    aliases: ['Dicang'],
    location: {
      text: { zhHant: '口角旁。', en: 'Beside the corner of the mouth.' },
      sourceIds: [HANDBOOK],
      notes: 'Handbook Day 2 practical: 「地倉（口角旁）」. Coarse landmark only; not a location standard.',
    },
  }),
  ST(5, '大迎', '大迎', 'Great Reception', 'da ying', 'jaw', A.st5, 3),
  ST(6, '頰車', '颊车', 'Jawbone', 'jia che', 'jaw', A.st6, 2, {
    aliases: ['Jiache'],
    location: {
      text: {
        zhHant: '咬緊牙時，咬肌隆起最高處。',
        en: 'Where the masseter muscle bulges highest when the teeth are clenched.',
      },
      sourceIds: [HANDBOOK],
      notes: 'Handbook Day 2 practical: 「頰車（咬牙時肌肉隆起處）」.',
    },
  }),
  ST(7, '下關', '下关', 'Below the Joint', 'xia guan', 'face', A.st7, 2),
  ST(8, '頭維', '头维', 'Head Corner', 'tou wei', 'head', A.st8, 3),
  ST(9, '人迎', '人迎', 'Man’s Welcome', 'ren ying', 'neck', A.st9, 3),
  ST(10, '水突', '水突', 'Water Prominence', 'shui tu', 'neck', A.st10, 3),
  ST(11, '氣舍', '气舍', 'Qi Abode', 'qi she', 'neck', A.st11, 3),
  ST(12, '缺盆', '缺盆', 'Empty Basin', 'que pen', 'clavicle', A.st12, 3),
  ST(13, '氣戶', '气户', 'Qi Door', 'qi hu', 'chest', A.st13, 3),
  ST(14, '庫房', '库房', 'Storehouse', 'ku fang', 'chest', A.st14, 3),
  ST(15, '屋翳', '屋翳', 'Roof Screen', 'wu yi', 'chest', A.st15, 3),
  ST(16, '膺窗', '膺窗', 'Breast Window', 'ying chuang', 'chest', A.st16, 3),
  ST(17, '乳中', '乳中', 'Breast Centre', 'ru zhong', 'chest', A.st17, 3),
  ST(18, '乳根', '乳根', 'Breast Root', 'ru gen', 'chest', A.st18, 3),
  ST(19, '不容', '不容', 'Not Contained', 'bu rong', 'abdomen', A.st19, 3),
  ST(20, '承滿', '承满', 'Assuming Fullness', 'cheng man', 'abdomen', A.st20, 3),
  ST(21, '梁門', '梁门', 'Beam Gate', 'liang men', 'abdomen', A.st21, 2),
  ST(22, '關門', '关门', 'Pass Gate', 'guan men', 'abdomen', A.st22, 3),
  ST(23, '太乙', '太乙', 'Supreme Unity', 'tai yi', 'abdomen', A.st23, 3),
  ST(24, '滑肉門', '滑肉门', 'Slippery Flesh Gate', 'hua rou men', 'abdomen', A.st24, 3),
  ST(25, '天樞', '天枢', 'Celestial Pivot', 'tian shu', 'abdomen', A.st25, 1, {
    aliases: ['Tianshu'],
    location: {
      text: { zhHant: '肚臍旁開 2 寸。', en: 'Two cun (proportional body-inches) lateral to the umbilicus.' },
      sourceIds: [OUTLINE, HANDBOOK],
      notes: 'Restated from 「肚臍旁開2寸」. 寸 is the proportional body-inch used by the curriculum.',
    },
    classifications: {
      value: ['front_mu'],
      sourceIds: [OUTLINE, HANDBOOK],
      notes: 'Curriculum states 天樞 is the front-mu (募) point of the Large Intestine. Not yet cross-checked.',
    },
    cues: [
      {
        text: {
          zhHant: '天樞是肚臍旁的「大腸情報站」：肚臍＝生命中心，旁開 2 寸＝大腸的門牌號。',
          en: 'Celestial Pivot as the "Large-Intestine dispatch office" beside the navel: navel = centre, 2 cun out = its street number.',
        },
        sourceIds: [HANDBOOK],
        notes: 'Handbook 募穴聯想 memory image. Not a clinical claim.',
      },
    ],
  }),
  ST(26, '外陵', '外陵', 'Outer Mound', 'wai ling', 'abdomen', A.st26, 3),
  ST(27, '大巨', '大巨', 'Great Gigantic', 'da ju', 'abdomen', A.st27, 3),
  ST(28, '水道', '水道', 'Waterway', 'shui dao', 'abdomen', A.st28, 3),
  ST(29, '歸來', '归来', 'Return', 'gui lai', 'abdomen', A.st29, 3),
  ST(30, '氣衝', '气冲', 'Qi Thoroughfare', 'qi chong', 'groin', A.st30, 3),
  ST(31, '髀關', '髀关', 'Thigh Joint', 'bi guan', 'thigh', A.st31, 3),
  ST(32, '伏兔', '伏兔', 'Crouching Rabbit', 'fu tu', 'thigh', A.st32, 3),
  ST(33, '陰市', '阴市', 'Yin Market', 'yin shi', 'thigh', A.st33, 3),
  ST(34, '梁丘', '梁丘', 'Beam Hill', 'liang qiu', 'thigh', A.st34, 3),
  ST(35, '犢鼻', '犊鼻', 'Calf’s Nose', 'du bi', 'knee', A.st35, 3, { aliases: ['外膝眼'] }),
  ST(36, '足三里', '足三里', 'Leg Three Li', 'zu san li', 'lower leg', A.st36, 1, {
    aliases: ['Zusanli', '三里'],
    location: {
      text: {
        zhHant: '犢鼻（外膝眼）下 3 寸，脛骨前緣外一橫指。',
        en: 'Three cun below 犢鼻 (ST35, the outer knee-eye), one finger-breadth lateral to the anterior border of the tibia.',
      },
      sourceIds: [OUTLINE, HANDBOOK],
      notes: 'Restated from 「犢鼻下3寸，脛骨外一橫指」.',
    },
    classifications: {
      value: ['he_sea'],
      sourceIds: [HANDBOOK],
      notes: 'Handbook: 足三里＝胃經合穴（合治臟腑病）. Not yet cross-checked.',
    },
    cues: [
      {
        text: {
          zhHant: '四總穴歌的第一句就是它：「肚腹三里留」。',
          en: 'It owns the first line of the Four Command Points song: 肚腹三里留.',
        },
        sourceIds: [HANDBOOK, OUTLINE],
        notes: 'Mnemonic line of the traditional song; a memorisation pairing, not treatment guidance.',
      },
    ],
  }),
  ST(37, '上巨虛', '上巨虚', 'Upper Great Hollow', 'shang ju xu', 'lower leg', A.st37, 2),
  ST(38, '條口', '条口', 'Ribbon Opening', 'tiao kou', 'lower leg', A.st38, 3),
  ST(39, '下巨虛', '下巨虚', 'Lower Great Hollow', 'xia ju xu', 'lower leg', A.st39, 3),
  ST(40, '豐隆', '丰隆', 'Abundant Bulge', 'feng long', 'lower leg', A.st40, 2, {
    aliases: ['Fenglong'],
    classifications: {
      value: ['luo_connecting'],
      sourceIds: [HANDBOOK],
      notes:
        'Handbook: 豐隆＝胃經絡穴. The handbook attaches a deliberately wrong answer as a joke on its flashcard (「豐胸（誤！）」); that trap and the function claim around it were NOT ingested.',
    },
  }),
  ST(41, '解溪', '解溪', 'Stream Divide', 'jie xi', 'ankle', A.st41, 3),
  ST(42, '衝陽', '冲阳', 'Surging Yang', 'chong yang', 'foot', A.st42, 3),
  ST(43, '陷谷', '陷谷', 'Sunken Valley', 'xian gu', 'foot', A.st43, 3),
  ST(44, '內庭', '内庭', 'Inner Court', 'nei ting', 'foot', A.st44, 1, {
    aliases: ['Neiting'],
    location: {
      text: {
        zhHant: '足背第二、三趾間，赤白肉際處。',
        en: 'On the dorsum of the foot between the second and third toes, at the border of the red and white skin.',
      },
      sourceIds: [OUTLINE, HANDBOOK],
      notes: 'Restated from 「足背第二、三趾間，赤白肉際」.',
    },
  }),
  ST(45, '厲兌', '厉兑', 'Severe Mouth', 'li dui', 'toe', A.st45, 3),
];

/* --------------------------------------------------------------------------
 * 足太陰脾經 Spleen meridian — Day 3. Drawn on the figure's RIGHT side (the
 * viewer's left) so it never competes with the Stomach line, and kept to the
 * medial aspect: great toe → medial foot → medial shin → medial thigh →
 * abdomen (4 cun lateral) → lateral chest (6 cun lateral) → SP21 at the
 * mid-axillary line. All content comes from the owner's Day 3 worksheet.
 *
 * NOTE ON LATERAL DISTANCES: the schematic torso is narrower than a real one,
 * so the 4-cun and 6-cun lines are compressed to stay on the drawn body. The
 * marker order and relative spacing are faithful; the absolute offsets are not.
 * -------------------------------------------------------------------------- */
const SP = (
  n: number,
  zh: string,
  zhs: string,
  en: string,
  py: string,
  region: string,
  at: { x: number; y: number },
  tier: 1 | 2 | 3,
  aliases?: string[],
): Spec => ({
  code: `SP${n}`,
  meridianId: 'mer_sp',
  ordinal: n,
  zh,
  zhs,
  en,
  py,
  region,
  x: at.x,
  y: at.y,
  side: 'right',
  tier,
  ...(aliases ? { aliases } : {}),
});

const spleenSpecs: Spec[] = [
  SP(1, '隱白', '隐白', 'Hidden White', 'yin bai', 'great toe', A.sp1, 1),
  SP(2, '大都', '大都', 'Great Metropolis', 'da du', 'foot', A.sp2, 2),
  SP(3, '太白', '太白', 'Supreme White', 'tai bai', 'foot', A.sp3, 1),
  SP(4, '公孫', '公孙', 'Grandfather Grandson', 'gong sun', 'foot', A.sp4, 1),
  SP(5, '商丘', '商丘', 'Shang Hill', 'shang qiu', 'ankle', A.sp5, 2),
  SP(6, '三陰交', '三阴交', 'Three Yin Intersection', 'san yin jiao', 'lower leg', A.sp6, 1),
  SP(7, '漏谷', '漏谷', 'Leaking Valley', 'lou gu', 'lower leg', A.sp7, 3),
  SP(8, '地機', '地机', 'Earth Foundation', 'di ji', 'lower leg', A.sp8, 2),
  SP(9, '陰陵泉', '阴陵泉', 'Yin Mound Spring', 'yin ling quan', 'knee', A.sp9, 1),
  SP(10, '血海', '血海', 'Sea of Blood', 'xue hai', 'thigh', A.sp10, 1),
  SP(11, '箕門', '箕门', 'Winnowing Basket Gate', 'ji men', 'thigh', A.sp11, 3),
  SP(12, '衝門', '冲门', 'Rushing Gate', 'chong men', 'groin', A.sp12, 2),
  SP(13, '府舍', '府舍', 'House Abode', 'fu she', 'lower abdomen', A.sp13, 3),
  SP(14, '腹結', '腹结', 'Abdomen Bind', 'fu jie', 'lower abdomen', A.sp14, 3),
  SP(15, '大橫', '大横', 'Great Horizontal', 'da heng', 'abdomen', A.sp15, 2),
  SP(16, '腹哀', '腹哀', 'Abdomen Sorrow', 'fu ai', 'upper abdomen', A.sp16, 3),
  SP(17, '食竇', '食窦', 'Food Hole', 'shi dou', 'chest', A.sp17, 3),
  SP(18, '天溪', '天溪', 'Heavenly Stream', 'tian xi', 'chest', A.sp18, 3),
  SP(19, '胸鄉', '胸乡', 'Chest Village', 'xiong xiang', 'chest', A.sp19, 3),
  SP(20, '周榮', '周荣', 'Fullness of the Circumference', 'zhou rong', 'chest', A.sp20, 3),
  SP(21, '大包', '大包', 'Great Enveloping', 'da bao', 'lateral chest', A.sp21, 2),
];

/* --------------------------------------------------------------------------
 * 手少陰心經 Heart meridian — Day 3. Drawn on the figure's RIGHT arm along its
 * MEDIAL border, opposite the Large Intestine line which runs the lateral
 * border of the same arm: axilla → medial upper arm → elbow → medial forearm
 * → wrist (神門) → palm → little finger.
 * -------------------------------------------------------------------------- */
const HT = (
  n: number,
  zh: string,
  zhs: string,
  en: string,
  py: string,
  region: string,
  at: { x: number; y: number },
  tier: 1 | 2 | 3,
  aliases?: string[],
): Spec => ({
  code: `HT${n}`,
  meridianId: 'mer_ht',
  ordinal: n,
  zh,
  zhs,
  en,
  py,
  region,
  x: at.x,
  y: at.y,
  side: 'right',
  tier,
  ...(aliases ? { aliases } : {}),
});

const heartSpecs: Spec[] = [
  HT(1, '極泉', '极泉', 'Great Spring', 'ji quan', 'axilla', A.ht1, 2),
  HT(2, '青靈', '青灵', 'Green Spirit', 'qing ling', 'upper arm', A.ht2, 3),
  HT(3, '少海', '少海', 'Lesser Sea', 'shao hai', 'elbow', A.ht3, 1),
  HT(4, '靈道', '灵道', 'Spirit Path', 'ling dao', 'forearm', A.ht4, 2),
  HT(5, '通里', '通里', 'Connecting Inside', 'tong li', 'forearm', A.ht5, 1),
  HT(6, '陰郄', '阴郄', 'Yin Cleft', 'yin xi', 'forearm', A.ht6, 2),
  HT(7, '神門', '神门', 'Spirit Gate', 'shen men', 'wrist', A.ht7, 1),
  HT(8, '少府', '少府', 'Lesser Palace', 'shao fu', 'palm', A.ht8, 2),
  HT(9, '少沖', '少冲', 'Lesser Surge', 'shao chong', 'little finger', A.ht9, 1, [
    '少衝',
    'Shaochong',
  ]),
];

/* --------------------------------------------------------------------------
 * 手太陽小腸經 Small Intestine — Day 4. Drawn on the figure's LEFT arm along
 * its ULNAR border, opposite the Lung line on the radial border of the same
 * arm: little finger → ulnar forearm → elbow → scapula (back view) → neck →
 * face, ending in front of the tragus.
 * -------------------------------------------------------------------------- */

const SI = (
  n: number, zh: string, zhs: string, en: string, py: string, region: string,
  at: { x: number; y: number }, tier: 1 | 2 | 3, view?: 'front' | 'back',
): Spec => ({
  code: `SI${n}`, meridianId: 'mer_si', ordinal: n, zh, zhs, en, py, region,
  x: at.x, y: at.y, side: 'left', tier, ...(view ? { view } : {}),
});

const smallIntestineSpecs: Spec[] = [
  SI(1, '少澤', '少泽', 'Lesser Marsh', 'shao ze', 'little finger', A.si1, 1),
  SI(2, '前谷', '前谷', 'Front Valley', 'qian gu', 'hand', A.si2, 2),
  SI(3, '後溪', '后溪', 'Back Stream', 'hou xi', 'hand', A.si3, 1),
  SI(4, '腕骨', '腕骨', 'Wrist Bone', 'wan gu', 'wrist', A.si4, 2),
  SI(5, '陽谷', '阳谷', 'Yang Valley', 'yang gu', 'wrist', A.si5, 2),
  SI(6, '養老', '养老', 'Nourishing the Old', 'yang lao', 'forearm', A.si6, 2),
  SI(7, '支正', '支正', 'Branch of Uprightness', 'zhi zheng', 'forearm', A.si7, 2),
  SI(8, '小海', '小海', 'Small Sea', 'xiao hai', 'elbow', A.si8, 2),
  SI(9, '肩貞', '肩贞', 'Shoulder Uprightness', 'jian zhen', 'scapula', A.si9, 2, 'back'),
  SI(10, '臑俞', '臑俞', 'Upper Arm Shu', 'nao shu', 'scapula', A.si10, 3, 'back'),
  SI(11, '天宗', '天宗', 'Heavenly Ancestor', 'tian zong', 'scapula', A.si11, 2, 'back'),
  SI(12, '秉風', '秉风', 'Grasping the Wind', 'bing feng', 'scapula', A.si12, 3, 'back'),
  SI(13, '曲垣', '曲垣', 'Crooked Wall', 'qu yuan', 'scapula', A.si13, 3, 'back'),
  SI(14, '肩外俞', '肩外俞', 'Outer Shoulder Shu', 'jian wai shu', 'upper back', A.si14, 3, 'back'),
  SI(15, '肩中俞', '肩中俞', 'Middle Shoulder Shu', 'jian zhong shu', 'upper back', A.si15, 3, 'back'),
  SI(16, '天窗', '天窗', 'Heavenly Window', 'tian chuang', 'neck', A.si16, 3),
  SI(17, '天容', '天容', 'Heavenly Appearance', 'tian rong', 'neck', A.si17, 3),
  SI(18, '顴髎', '颧髎', 'Cheekbone Crevice', 'quan liao', 'face', A.si18, 2),
  SI(19, '聽宮', '听宫', 'Listening Palace', 'ting gong', 'ear', A.si19, 1),
];

/* --------------------------------------------------------------------------
 * 足太陽膀胱經 Bladder — Day 4. Drawn on the figure's LEFT side. The trunk
 * portion is anchored to the SPINE ladder in atlas.ts, so every back-shu point
 * sits at the vertebral level its reviewed location text names, on either the
 * first (1.5 cun) or second (3 cun) paravertebral line.
 *
 * The channel is NOT monotonic by design: modern numbering runs down the first
 * line and the leg (BL11–BL40), then returns to the upper back for the second
 * line (BL41–BL54) before continuing down the calf (BL55–BL67).
 * -------------------------------------------------------------------------- */
// Back view: the figure's left foot falls on the viewer's left, which is the
// mirror frame the front view calls 'right'. +lx is the lateral (little-toe)
// border in that frame, which is where BL61–BL67 run.

const BL = (
  n: number, zh: string, zhs: string, en: string, py: string, region: string,
  at: { x: number; y: number }, tier: 1 | 2 | 3, view?: 'front' | 'back',
): Spec => ({
  code: `BL${n}`, meridianId: 'mer_bl', ordinal: n, zh, zhs, en, py, region,
  x: at.x, y: at.y, side: 'left', tier, ...(view ? { view } : {}),
});


const bladderSpecs: Spec[] = [
  BL(1, '睛明', '睛明', 'Bright Eyes', 'jing ming', 'face', A.bl1, 1),
  BL(2, '攢竹', '攒竹', 'Gathered Bamboo', 'cuan zhu', 'face', A.bl2, 2),
  BL(3, '眉衝', '眉冲', 'Brow Ascension', 'mei chong', 'head', A.bl3, 3),
  BL(4, '曲差', '曲差', 'Crooked Difference', 'qu cha', 'head', A.bl4, 3),
  BL(5, '五處', '五处', 'Five Places', 'wu chu', 'head', A.bl5, 3),
  BL(6, '承光', '承光', 'Receiving Light', 'cheng guang', 'head', A.bl6, 3),
  BL(7, '通天', '通天', 'Penetrating Heaven', 'tong tian', 'head', A.bl7, 3),
  BL(8, '絡卻', '络却', 'Declining Connection', 'luo que', 'head', A.bl8, 3),
  BL(9, '玉枕', '玉枕', 'Jade Pillow', 'yu zhen', 'occiput', A.bl9, 3, 'back'),
  BL(10, '天柱', '天柱', 'Heavenly Pillar', 'tian zhu', 'nape', A.bl10, 2, 'back'),
  BL(11, '大杼', '大杼', 'Great Shuttle', 'da zhu', 'upper back', A.bl11, 1, 'back'),
  BL(12, '風門', '风门', 'Wind Gate', 'feng men', 'upper back', A.bl12, 1, 'back'),
  BL(13, '肺俞', '肺俞', 'Lung Shu', 'fei shu', 'upper back', A.bl13, 1, 'back'),
  BL(14, '厥陰俞', '厥阴俞', 'Jueyin Shu', 'jue yin shu', 'upper back', A.bl14, 2, 'back'),
  BL(15, '心俞', '心俞', 'Heart Shu', 'xin shu', 'upper back', A.bl15, 1, 'back'),
  BL(16, '督俞', '督俞', 'Governor Shu', 'du shu', 'upper back', A.bl16, 3, 'back'),
  BL(17, '膈俞', '膈俞', 'Diaphragm Shu', 'ge shu', 'mid back', A.bl17, 1, 'back'),
  BL(18, '肝俞', '肝俞', 'Liver Shu', 'gan shu', 'mid back', A.bl18, 1, 'back'),
  BL(19, '膽俞', '胆俞', 'Gallbladder Shu', 'dan shu', 'mid back', A.bl19, 1, 'back'),
  BL(20, '脾俞', '脾俞', 'Spleen Shu', 'pi shu', 'mid back', A.bl20, 1, 'back'),
  BL(21, '胃俞', '胃俞', 'Stomach Shu', 'wei shu', 'mid back', A.bl21, 1, 'back'),
  BL(22, '三焦俞', '三焦俞', 'Triple Burner Shu', 'san jiao shu', 'lower back', A.bl22, 2, 'back'),
  BL(23, '腎俞', '肾俞', 'Kidney Shu', 'shen shu', 'lower back', A.bl23, 1, 'back'),
  BL(24, '氣海俞', '气海俞', 'Sea of Qi Shu', 'qi hai shu', 'lower back', A.bl24, 2, 'back'),
  BL(25, '大腸俞', '大肠俞', 'Large Intestine Shu', 'da chang shu', 'lower back', A.bl25, 1, 'back'),
  BL(26, '關元俞', '关元俞', 'Gate of Origin Shu', 'guan yuan shu', 'sacral', A.bl26, 2, 'back'),
  BL(27, '小腸俞', '小肠俞', 'Small Intestine Shu', 'xiao chang shu', 'sacral', A.bl27, 2, 'back'),
  BL(28, '膀胱俞', '膀胱俞', 'Bladder Shu', 'pang guang shu', 'sacral', A.bl28, 2, 'back'),
  BL(29, '中膂俞', '中膂俞', 'Central Lumbar Shu', 'zhong lu shu', 'sacral', A.bl29, 3, 'back'),
  BL(30, '白環俞', '白环俞', 'White Ring Shu', 'bai huan shu', 'sacral', A.bl30, 3, 'back'),
  BL(31, '上髎', '上髎', 'Upper Bone-Hole', 'shang liao', 'sacral', A.bl31, 2, 'back'),
  BL(32, '次髎', '次髎', 'Second Bone-Hole', 'ci liao', 'sacral', A.bl32, 1, 'back'),
  BL(33, '中髎', '中髎', 'Middle Bone-Hole', 'zhong liao', 'sacral', A.bl33, 3, 'back'),
  BL(34, '下髎', '下髎', 'Lower Bone-Hole', 'xia liao', 'sacral', A.bl34, 3, 'back'),
  BL(35, '會陽', '会阳', 'Meeting Yang', 'hui yang', 'sacral', A.bl35, 3, 'back'),
  BL(36, '承扶', '承扶', 'Supporting the Hip', 'cheng fu', 'thigh', A.bl36, 2, 'back'),
  BL(37, '殷門', '殷门', 'Abundant Gate', 'yin men', 'thigh', A.bl37, 2, 'back'),
  BL(38, '浮郄', '浮郄', 'Floating Crevice', 'fu xi', 'knee', A.bl38, 3, 'back'),
  BL(39, '委陽', '委阳', 'Bend Yang', 'wei yang', 'knee', A.bl39, 2, 'back'),
  BL(40, '委中', '委中', 'Bend Center', 'wei zhong', 'knee', A.bl40, 1, 'back'),
  BL(41, '附分', '附分', 'Attached Branch', 'fu fen', 'upper back', A.bl41, 3, 'back'),
  BL(42, '魄戶', '魄户', 'Po Door', 'po hu', 'upper back', A.bl42, 3, 'back'),
  BL(43, '膏肓', '膏肓', 'Vital Region', 'gao huang', 'upper back', A.bl43, 1, 'back'),
  BL(44, '神堂', '神堂', 'Spirit Hall', 'shen tang', 'upper back', A.bl44, 3, 'back'),
  BL(45, '譩譆', '譩譆', 'Yixi', 'yi xi', 'upper back', A.bl45, 3, 'back'),
  BL(46, '膈關', '膈关', 'Diaphragm Gate', 'ge guan', 'mid back', A.bl46, 3, 'back'),
  BL(47, '魂門', '魂门', 'Hun Gate', 'hun men', 'mid back', A.bl47, 3, 'back'),
  BL(48, '陽綱', '阳纲', 'Yang Net', 'yang gang', 'mid back', A.bl48, 3, 'back'),
  BL(49, '意舍', '意舍', 'Idea Abode', 'yi she', 'mid back', A.bl49, 3, 'back'),
  BL(50, '胃倉', '胃仓', 'Stomach Granary', 'wei cang', 'mid back', A.bl50, 3, 'back'),
  BL(51, '肓門', '肓门', 'Huang Gate', 'huang men', 'lower back', A.bl51, 3, 'back'),
  BL(52, '志室', '志室', 'Will Chamber', 'zhi shi', 'lower back', A.bl52, 2, 'back'),
  BL(53, '胞肓', '胞肓', 'Uterus Huang', 'bao huang', 'buttock', A.bl53, 3, 'back'),
  BL(54, '秩邊', '秩边', 'Orderly Border', 'zhi bian', 'buttock', A.bl54, 2, 'back'),
  BL(55, '合陽', '合阳', 'Meeting Yang (leg)', 'he yang', 'calf', A.bl55, 3, 'back'),
  BL(56, '承筋', '承筋', 'Sustaining the Sinews', 'cheng jin', 'calf', A.bl56, 2, 'back'),
  BL(57, '承山', '承山', 'Supporting Mountain', 'cheng shan', 'calf', A.bl57, 1, 'back'),
  BL(58, '飛揚', '飞扬', 'Soaring', 'fei yang', 'calf', A.bl58, 2, 'back'),
  BL(59, '跗陽', '跗阳', 'Instep Yang', 'fu yang', 'lower leg', A.bl59, 3, 'back'),
  BL(60, '崑崙', '昆仑', 'Kunlun Mountains', 'kun lun', 'ankle', A.bl60, 1, 'back'),
  BL(61, '僕參', '仆参', 'Servant Attendant', 'pu can', 'heel', A.bl61, 3, 'back'),
  BL(62, '申脈', '申脉', 'Extending Vessel', 'shen mai', 'ankle', A.bl62, 1, 'back'),
  BL(63, '金門', '金门', 'Golden Gate', 'jin men', 'foot', A.bl63, 2, 'back'),
  BL(64, '京骨', '京骨', 'Capital Bone', 'jing gu', 'foot', A.bl64, 2, 'back'),
  BL(65, '束骨', '束骨', 'Bound Bone', 'shu gu', 'foot', A.bl65, 2, 'back'),
  BL(66, '足通谷', '足通谷', 'Foot Valley Passage', 'zu tong gu', 'foot', A.bl66, 3, 'back'),
  BL(67, '至陰', '至阴', 'Reaching Yin', 'zhi yin', 'little toe', A.bl67, 1, 'back'),
];


/* --------------------------------------------------------------------------
 * 足少陰腎經 Kidney — Day 6. Sole → medial ankle → medial lower leg → inner
 * knee → abdomen at 0.5 寸 from the midline → chest, ending under the clavicle.
 *
 * The abdominal run is the cleanest cun chain in the dataset: eleven stations,
 * one cun apart, at a constant 0.5 寸 lateral, anchored on the umbilicus alone.
 * -------------------------------------------------------------------------- */
const KI = (
  n: number, zh: string, zhs: string, en: string, py: string, region: string,
  at: { x: number; y: number }, tier: 1 | 2 | 3, aliases?: string[],
): Spec => ({
  code: `KI${n}`, meridianId: 'mer_ki', ordinal: n, zh, zhs, en, py, region,
  x: at.x, y: at.y, side: 'left', tier, ...(aliases ? { aliases } : {}),
});

const kidneySpecs: Spec[] = [
  KI(1, '湧泉', '涌泉', 'Gushing Spring', 'yong quan', 'sole', A.ki1, 1),
  KI(2, '然谷', '然谷', 'Blazing Valley', 'ran gu', 'foot', A.ki2, 2),
  KI(3, '太溪', '太溪', 'Great Stream', 'tai xi', 'ankle', A.ki3, 1, ['太谿']),
  KI(4, '大鐘', '大钟', 'Big Bell', 'da zhong', 'ankle', A.ki4, 2),
  KI(5, '水泉', '水泉', 'Water Spring', 'shui quan', 'ankle', A.ki5, 3),
  KI(6, '照海', '照海', 'Shining Sea', 'zhao hai', 'ankle', A.ki6, 1),
  KI(7, '復溜', '复溜', 'Returning Flow', 'fu liu', 'lower leg', A.ki7, 2),
  KI(8, '交信', '交信', 'Intersecting Trust', 'jiao xin', 'lower leg', A.ki8, 3, ['Jiaoxin']),
  KI(9, '築賓', '筑宾', 'Building Guest', 'zhu bin', 'lower leg', A.ki9, 3, ['Zhubin']),
  KI(10, '陰谷', '阴谷', 'Yin Valley', 'yin gu', 'knee', A.ki10, 2),
  KI(11, '橫骨', '横骨', 'Cross Bone', 'heng gu', 'lower abdomen', A.ki11, 3),
  KI(12, '大赫', '大赫', 'Great Splendour', 'da he', 'lower abdomen', A.ki12, 3),
  KI(13, '氣穴', '气穴', 'Qi Cave', 'qi xue', 'lower abdomen', A.ki13, 3),
  KI(14, '四滿', '四满', 'Four Fullnesses', 'si man', 'lower abdomen', A.ki14, 3),
  KI(15, '中注', '中注', 'Central Pouring', 'zhong zhu', 'lower abdomen', A.ki15, 3),
  KI(16, '肓俞', '肓俞', "Huang's Transport", 'huang shu', 'abdomen', A.ki16, 2, ['Huangshu']),
  KI(17, '商曲', '商曲', 'Shang Curve', 'shang qu', 'upper abdomen', A.ki17, 3, ['Shangqu']),
  KI(18, '石關', '石关', 'Stone Pass', 'shi guan', 'upper abdomen', A.ki18, 3),
  KI(19, '陰都', '阴都', 'Yin Metropolis', 'yin du', 'upper abdomen', A.ki19, 3),
  KI(20, '腹通谷', '腹通谷', 'Abdominal Passage Valley', 'fu tong gu', 'upper abdomen', A.ki20, 3),
  KI(21, '幽門', '幽门', 'Hidden Gate', 'you men', 'upper abdomen', A.ki21, 3, ['Yumen']),
  KI(22, '步廊', '步廊', 'Walking Corridor', 'bu lang', 'chest', A.ki22, 3),
  KI(23, '神封', '神封', 'Spirit Seal', 'shen feng', 'chest', A.ki23, 3),
  KI(24, '靈墟', '灵墟', 'Spirit Mound', 'ling xu', 'chest', A.ki24, 3),
  KI(25, '神藏', '神藏', 'Spirit Storehouse', 'shen cang', 'chest', A.ki25, 3),
  KI(26, '彧中', '彧中', 'Flourishing Middle', 'yu zhong', 'chest', A.ki26, 3, ['Yuzhong']),
  KI(27, '俞府', '俞府', 'Transport House', 'shu fu', 'chest', A.ki27, 2, ['Shufu']),
];


/* --------------------------------------------------------------------------
 * 手厥陰心包經 Pericardium and 手少陽三焦經 Triple Energizer — Day 7.
 *
 * Both run the MIDLINE of the arm, between channels already loaded. 內關 PC6
 * and 外關 TE5 are the matched pair the curriculum builds the day around: each
 * sits 2 寸 above its own wrist crease, one palmar and one dorsal.
 * -------------------------------------------------------------------------- */
const PC = (
  n: number, zh: string, zhs: string, en: string, py: string, region: string,
  at: { x: number; y: number }, tier: 1 | 2 | 3, aliases?: string[],
): Spec => ({
  code: `PC${n}`, meridianId: 'mer_pc', ordinal: n, zh, zhs, en, py, region,
  x: at.x, y: at.y, side: 'left', tier, ...(aliases ? { aliases } : {}),
});

const TE = (
  n: number, zh: string, zhs: string, en: string, py: string, region: string,
  at: { x: number; y: number }, tier: 1 | 2 | 3, view?: 'front' | 'back',
): Spec => ({
  code: `TE${n}`, meridianId: 'mer_te', ordinal: n, zh, zhs, en, py, region,
  x: at.x, y: at.y, side: 'right', tier, ...(view ? { view } : {}),
});

const pericardiumSpecs: Spec[] = [
  PC(1, '天池', '天池', 'Heavenly Pool', 'tian chi', 'chest', A.pc1, 2),
  PC(2, '天泉', '天泉', 'Heavenly Spring', 'tian quan', 'upper arm', A.pc2, 3),
  PC(3, '曲澤', '曲泽', 'Crooked Marsh', 'qu ze', 'elbow', A.pc3, 1),
  PC(4, '郄門', '郄门', 'Cleft Gate', 'xi men', 'forearm', A.pc4, 2),
  PC(5, '間使', '间使', 'Intermediary Messenger', 'jian shi', 'forearm', A.pc5, 2),
  PC(6, '內關', '内关', 'Inner Gate', 'nei guan', 'forearm', A.pc6, 1, ['Neiguan']),
  PC(7, '大陵', '大陵', 'Great Mound', 'da ling', 'wrist', A.pc7, 1),
  PC(8, '勞宮', '劳宫', 'Palace of Toil', 'lao gong', 'palm', A.pc8, 1),
  PC(9, '中衝', '中冲', 'Central Hub', 'zhong chong', 'middle finger', A.pc9, 1),
];

const tripleEnergizerSpecs: Spec[] = [
  TE(1, '關衝', '关冲', 'Gate Hub', 'guan chong', 'ring finger', A.te1, 1),
  TE(2, '液門', '液门', 'Fluid Gate', 'ye men', 'hand', A.te2, 2),
  TE(3, '中渚', '中渚', 'Central Islet', 'zhong zhu', 'dorsal hand', A.te3, 1),
  TE(4, '陽池', '阳池', 'Yang Pool', 'yang chi', 'wrist', A.te4, 1),
  TE(5, '外關', '外关', 'Outer Gate', 'wai guan', 'forearm', A.te5, 1),
  TE(6, '支溝', '支沟', 'Branch Ditch', 'zhi gou', 'forearm', A.te6, 1),
  TE(7, '會宗', '会宗', 'Convergence and Gathering', 'hui zong', 'forearm', A.te7, 3),
  TE(8, '三陽絡', '三阳络', 'Three Yang Collateral', 'san yang luo', 'forearm', A.te8, 3),
  TE(9, '四瀆', '四渎', 'Four Rivers', 'si du', 'forearm', A.te9, 3),
  TE(10, '天井', '天井', 'Heavenly Well', 'tian jing', 'elbow', A.te10, 2),
  TE(11, '清冷淵', '清冷渊', 'Clear Cold Abyss', 'qing leng yuan', 'upper arm', A.te11, 3),
  TE(12, '消濼', '消泺', 'Dispersing Turbidity', 'xiao luo', 'upper arm', A.te12, 3),
  TE(13, '臑會', '臑会', 'Upper Arm Convergence', 'nao hui', 'upper arm', A.te13, 3),
  TE(14, '肩髎', '肩髎', 'Shoulder Crevice', 'jian liao', 'shoulder', A.te14, 2),
  TE(15, '天髎', '天髎', 'Heavenly Crevice', 'tian liao', 'scapula', A.te15, 3, 'back'),
  TE(16, '天牖', '天牖', 'Heavenly Window', 'tian you', 'neck', A.te16, 3),
  TE(17, '翳風', '翳风', 'Screened Wind', 'yi feng', 'behind the ear', A.te17, 1),
  TE(18, '瘈脈', '瘛脉', 'Convulsion Vessel', 'chi mai', 'behind the ear', A.te18, 3),
  TE(19, '顱息', '颅息', 'Skull Rest', 'lu xi', 'behind the ear', A.te19, 3),
  TE(20, '角孫', '角孙', 'Angle Grandson', 'jiao sun', 'temple', A.te20, 2),
  TE(21, '耳門', '耳门', 'Ear Gate', 'er men', 'in front of the ear', A.te21, 1),
  TE(22, '耳和髎', '耳和髎', 'Ear Harmonising Crevice', 'er he liao', 'in front of the ear', A.te22, 3),
  TE(23, '絲竹空', '丝竹空', 'Silk Bamboo Hollow', 'si zhu kong', 'face', A.te23, 1),
];


/* --------------------------------------------------------------------------
 * 足少陽膽經 Gallbladder — Day 8. Outer canthus → temple → behind the ear →
 * nape → shoulder → flank → hip → lateral leg → fourth toe.
 *
 * Twenty of its forty-four stations are on the head, which is why so many of
 * them are located by a proportional rule along a curve rather than by a cun
 * distance: 頷厭/懸顱/懸釐 divide the 頭維→曲鬢 arc into quarters, and
 * 浮白/頭竅陰 divide the 天衝→完骨 arc into thirds. 環跳 GB30 is the same kind
 * of rule at the hip. Those are computed as ratios, not estimated.
 * -------------------------------------------------------------------------- */
const GB = (
  n: number, zh: string, zhs: string, en: string, py: string, region: string,
  at: { x: number; y: number }, tier: 1 | 2 | 3, view?: 'front' | 'back', aliases?: string[],
): Spec => ({
  code: `GB${n}`, meridianId: 'mer_gb', ordinal: n, zh, zhs, en, py, region,
  x: at.x, y: at.y, side: 'left', tier,
  ...(view ? { view } : {}),
  ...(aliases ? { aliases } : {}),
});

const gallbladderSpecs: Spec[] = [
  GB(1, '瞳子髎', '瞳子髎', 'Pupil Crevice', 'tong zi liao', 'face', A.gb1, 1),
  GB(2, '聽會', '听会', 'Auditory Convergence', 'ting hui', 'face', A.gb2, 2),
  GB(3, '上關', '上关', 'Upper Pass', 'shang guan', 'face', A.gb3, 3),
  GB(4, '頷厭', '颔厌', 'Jaw Satisfaction', 'han yan', 'temple', A.gb4, 3),
  GB(5, '懸顱', '悬颅', 'Suspended Skull', 'xuan lu', 'temple', A.gb5, 3),
  GB(6, '懸釐', '悬厘', 'Suspended Separation', 'xuan li', 'temple', A.gb6, 3),
  GB(7, '曲鬢', '曲鬓', 'Crooked Temple Hair', 'qu bin', 'temple', A.gb7, 3),
  GB(8, '率谷', '率谷', 'Leading Valley', 'shuai gu', 'head', A.gb8, 2),
  GB(9, '天衝', '天冲', 'Heavenly Surge', 'tian chong', 'head', A.gb9, 3, 'back'),
  GB(10, '浮白', '浮白', 'Floating White', 'fu bai', 'behind the ear', A.gb10, 3, 'back'),
  GB(11, '頭竅陰', '头窍阴', 'Head Orifice Yin', 'tou qiao yin', 'behind the ear', A.gb11, 3, 'back'),
  GB(12, '完骨', '完骨', 'Completed Bone', 'wan gu', 'behind the ear', A.gb12, 3, 'back'),
  GB(13, '本神', '本神', 'Root of Spirit', 'ben shen', 'head', A.gb13, 2),
  GB(14, '陽白', '阳白', 'Yang White', 'yang bai', 'face', A.gb14, 1),
  GB(15, '頭臨泣', '头临泣', 'Head Governor of Tears', 'tou lin qi', 'head', A.gb15, 2),
  GB(16, '目窗', '目窗', 'Window of the Eye', 'mu chuang', 'head', A.gb16, 3),
  GB(17, '正營', '正营', 'Upright Nutrition', 'zheng ying', 'head', A.gb17, 3),
  GB(18, '承靈', '承灵', 'Support Spirit', 'cheng ling', 'head', A.gb18, 3),
  GB(19, '腦空', '脑空', 'Brain Hollow', 'nao kong', 'occiput', A.gb19, 3, 'back'),
  GB(20, '風池', '风池', 'Wind Pool', 'feng chi', 'nape', A.gb20, 1, 'back'),
  GB(21, '肩井', '肩井', 'Shoulder Well', 'jian jing', 'shoulder', A.gb21, 1, 'back'),
  GB(22, '淵腋', '渊腋', 'Armpit Abyss', 'yuan ye', 'lateral thorax', A.gb22, 3),
  GB(23, '輒筋', '辄筋', 'Flank Sinews', 'zhe jin', 'lateral thorax', A.gb23, 3),
  GB(24, '日月', '日月', 'Sun and Moon', 'ri yue', 'upper abdomen', A.gb24, 2),
  GB(25, '京門', '京门', 'Capital Gate', 'jing men', 'lateral waist', A.gb25, 2, 'back'),
  GB(26, '帶脈', '带脉', 'Girdle Vessel', 'dai mai', 'lateral abdomen', A.gb26, 2),
  GB(27, '五樞', '五枢', 'Five Pivots', 'wu shu', 'lateral abdomen', A.gb27, 3),
  GB(28, '維道', '维道', 'Maintaining Way', 'wei dao', 'lateral abdomen', A.gb28, 3),
  GB(29, '居髎', '居髎', 'Dwelling Bone', 'ju liao', 'hip', A.gb29, 3, 'back'),
  GB(30, '環跳', '环跳', 'Jumping Circle', 'huan tiao', 'hip', A.gb30, 1, 'back'),
  GB(31, '風市', '风市', 'Wind Market', 'feng shi', 'lateral thigh', A.gb31, 2, 'back'),
  GB(32, '中瀆', '中渎', 'Middle Ditch', 'zhong du', 'lateral thigh', A.gb32, 3, 'back'),
  GB(33, '膝陽關', '膝阳关', 'Knee Yang Gate', 'xi yang guan', 'knee', A.gb33, 3, 'back'),
  GB(34, '陽陵泉', '阳陵泉', 'Yang Mound Spring', 'yang ling quan', 'lower leg', A.gb34, 1, 'back'),
  GB(35, '陽交', '阳交', 'Yang Intersection', 'yang jiao', 'lower leg', A.gb35, 3, 'back'),
  GB(36, '外丘', '外丘', 'Outer Mound', 'wai qiu', 'lower leg', A.gb36, 3, 'back'),
  GB(37, '光明', '光明', 'Bright Light', 'guang ming', 'lower leg', A.gb37, 2, 'back'),
  GB(38, '陽輔', '阳辅', 'Yang Assistance', 'yang fu', 'lower leg', A.gb38, 2, 'back'),
  GB(39, '懸鐘', '悬钟', 'Suspended Bell', 'xuan zhong', 'lower leg', A.gb39, 2, 'back', ['絕骨', 'Juegu']),
  GB(40, '丘墟', '丘墟', 'Mound Ruins', 'qiu xu', 'ankle', A.gb40, 2, 'back'),
  GB(41, '足臨泣', '足临泣', 'Foot Governor of Tears', 'zu lin qi', 'foot', A.gb41, 1),
  GB(42, '地五會', '地五会', 'Earth Five Meetings', 'di wu hui', 'foot', A.gb42, 3),
  GB(43, '俠溪', '侠溪', 'Pinched Stream', 'xia xi', 'foot', A.gb43, 2),
  GB(44, '足竅陰', '足窍阴', 'Foot Orifice Yin', 'zu qiao yin', 'little toe', A.gb44, 2),
];


/* --------------------------------------------------------------------------
 * 足厥陰肝經 Liver — Day 9, and the LAST of the twelve regular channels.
 *
 * Great toe → dorsum → medial ankle → medial leg → inner knee → medial thigh →
 * groin → flank, ending at 期門 LR14 in the 6th intercostal space. From there
 * the flow returns to 中府 LU1: the cycle the dataset opened with on Day 1 is
 * now closed.
 * -------------------------------------------------------------------------- */
const LR = (
  n: number, zh: string, zhs: string, en: string, py: string, region: string,
  at: { x: number; y: number }, tier: 1 | 2 | 3, aliases?: string[],
): Spec => ({
  code: `LR${n}`, meridianId: 'mer_lr', ordinal: n, zh, zhs, en, py, region,
  x: at.x, y: at.y, side: 'right', tier, ...(aliases ? { aliases } : {}),
});

const liverSpecs: Spec[] = [
  LR(1, '大敦', '大敦', 'Big Mound', 'da dun', 'great toe', A.lr1, 1),
  LR(2, '行間', '行间', 'Moving Between', 'xing jian', 'foot', A.lr2, 2),
  LR(3, '太衝', '太冲', 'Supreme Surge', 'tai chong', 'foot', A.lr3, 1, ['太沖', 'Taichong']),
  LR(4, '中封', '中封', 'Mound Center', 'zhong feng', 'ankle', A.lr4, 2),
  LR(5, '蠡溝', '蠡沟', "Spider's Web Ditch", 'li gou', 'lower leg', A.lr5, 2),
  LR(6, '中都', '中都', 'Central Capital', 'zhong du', 'lower leg', A.lr6, 3),
  LR(7, '膝關', '膝关', 'Knee Gate', 'xi guan', 'knee', A.lr7, 3),
  LR(8, '曲泉', '曲泉', 'Crooked Spring', 'qu quan', 'knee', A.lr8, 2),
  LR(9, '陰包', '阴包', 'Yin Wrap', 'yin bao', 'thigh', A.lr9, 3),
  LR(10, '足五里', '足五里', 'Leg Five Miles', 'zu wu li', 'thigh', A.lr10, 3),
  LR(11, '陰廉', '阴廉', 'Yin Corner', 'yin lian', 'thigh', A.lr11, 3),
  LR(12, '急脈', '急脉', 'Ji Mai', 'ji mai', 'groin', A.lr12, 3, ['Urgent Pulse', 'Pulsing Vessel']),
  LR(13, '章門', '章门', 'Chapter Gate', 'zhang men', 'lateral abdomen', A.lr13, 1),
  LR(14, '期門', '期门', 'Cycle Gate', 'qi men', 'chest', A.lr14, 1),
];


/* --------------------------------------------------------------------------
 * 任脈 Conception and 督脈 Governor — Day 10, and the last of the fourteen.
 *
 * Both run the MIDLINE, so `side` is 'midline' rather than left or right, and
 * both are drawn from the very landmarks the rest of the dataset was measured
 * against: the abdominal cun ladder from the umbilicus, the intercostal spaces,
 * the SPINE vertebral ladder and the two hairlines. A lateral point placed at
 * 「旁開 N 寸」 and its midline reference now share one source of truth.
 * -------------------------------------------------------------------------- */
const CV = (
  n: number, zh: string, zhs: string, en: string, py: string, region: string,
  at: { x: number; y: number }, tier: 1 | 2 | 3, view?: 'front' | 'back', aliases?: string[],
): Spec => ({
  code: `CV${n}`, meridianId: 'mer_cv', ordinal: n, zh, zhs, en, py, region,
  x: at.x, y: at.y, side: 'midline', tier,
  ...(view ? { view } : {}),
  ...(aliases ? { aliases } : {}),
});

const GV = (
  n: number, zh: string, zhs: string, en: string, py: string, region: string,
  at: { x: number; y: number }, tier: 1 | 2 | 3, view?: 'front' | 'back', aliases?: string[],
): Spec => ({
  code: `GV${n}`, meridianId: 'mer_gv', ordinal: n, zh, zhs, en, py, region,
  x: at.x, y: at.y, side: 'midline', tier,
  ...(view ? { view } : {}),
  ...(aliases ? { aliases } : {}),
});

const conceptionSpecs: Spec[] = [
  CV(1, '會陰', '会阴', 'Yin Meeting', 'hui yin', 'perineum', A.cv1, 2, 'front', ['Huiyin']),
  CV(2, '曲骨', '曲骨', 'Crooked Bone', 'qu gu', 'lower abdomen', A.cv2, 2),
  CV(3, '中極', '中极', 'Middle Extremity', 'zhong ji', 'lower abdomen', A.cv3, 1),
  CV(4, '關元', '关元', 'Origin Pass', 'guan yuan', 'lower abdomen', A.cv4, 1),
  CV(5, '石門', '石门', 'Stone Gate', 'shi men', 'lower abdomen', A.cv5, 2),
  CV(6, '氣海', '气海', 'Sea of Qi', 'qi hai', 'lower abdomen', A.cv6, 1),
  CV(7, '陰交', '阴交', 'Yin Intersection', 'yin jiao', 'lower abdomen', A.cv7, 3),
  CV(8, '神闕', '神阙', 'Spirit Palace', 'shen que', 'abdomen', A.cv8, 1),
  CV(9, '水分', '水分', 'Water Division', 'shui fen', 'upper abdomen', A.cv9, 2),
  CV(10, '下脘', '下脘', 'Lower Epigastrium', 'xia wan', 'upper abdomen', A.cv10, 3),
  CV(11, '建里', '建里', 'Internal Foundation', 'jian li', 'upper abdomen', A.cv11, 3),
  CV(12, '中脘', '中脘', 'Middle Epigastrium', 'zhong wan', 'upper abdomen', A.cv12, 1),
  CV(13, '上脘', '上脘', 'Upper Epigastrium', 'shang wan', 'upper abdomen', A.cv13, 3),
  CV(14, '巨闕', '巨阙', 'Great Palace', 'ju que', 'epigastrium', A.cv14, 2),
  CV(15, '鳩尾', '鸠尾', 'Bird Tail', 'jiu wei', 'epigastrium', A.cv15, 3),
  CV(16, '中庭', '中庭', 'Central Courtyard', 'zhong ting', 'chest', A.cv16, 3),
  CV(17, '膻中', '膻中', 'Middle of the Chest', 'dan zhong', 'chest', A.cv17, 1, 'front', ['Danzhong', 'Shanzhong']),
  CV(18, '玉堂', '玉堂', 'Jade Hall', 'yu tang', 'chest', A.cv18, 3),
  CV(19, '紫宮', '紫宫', 'Violet Palace', 'zi gong', 'chest', A.cv19, 3),
  CV(20, '華蓋', '华盖', 'Splendid Canopy', 'hua gai', 'chest', A.cv20, 3),
  CV(21, '璇璣', '璇玑', 'Jade Rotator', 'xuan ji', 'chest', A.cv21, 3),
  CV(22, '天突', '天突', 'Heaven Projection', 'tian tu', 'neck', A.cv22, 1),
  CV(23, '廉泉', '廉泉', 'Lateral Spring', 'lian quan', 'neck', A.cv23, 2),
  CV(24, '承漿', '承浆', 'Saliva Container', 'cheng jiang', 'face', A.cv24, 2),
];

const governorSpecs: Spec[] = [
  GV(1, '長強', '长强', 'Long Strength', 'chang qiang', 'sacrum', A.gv1, 2, 'back'),
  GV(2, '腰俞', '腰俞', 'Lumbar Shu', 'yao shu', 'sacrum', A.gv2, 3, 'back'),
  GV(3, '腰陽關', '腰阳关', 'Lumbar Yang Gate', 'yao yang guan', 'lower back', A.gv3, 2, 'back'),
  GV(4, '命門', '命门', 'Life Gate', 'ming men', 'lower back', A.gv4, 1, 'back'),
  GV(5, '懸樞', '悬枢', 'Suspended Pivot', 'xuan shu', 'lower back', A.gv5, 3, 'back'),
  GV(6, '脊中', '脊中', 'Middle of the Spine', 'ji zhong', 'mid back', A.gv6, 3, 'back'),
  GV(7, '中樞', '中枢', 'Central Pivot', 'zhong shu', 'mid back', A.gv7, 3, 'back'),
  GV(8, '筋縮', '筋缩', 'Tendon Contraction', 'jin suo', 'mid back', A.gv8, 3, 'back'),
  GV(9, '至陽', '至阳', 'Ultimate Yang', 'zhi yang', 'mid back', A.gv9, 2, 'back'),
  GV(10, '靈台', '灵台', 'Spirit Platform', 'ling tai', 'mid back', A.gv10, 3, 'back'),
  GV(11, '神道', '神道', 'Spirit Path', 'shen dao', 'mid back', A.gv11, 3, 'back'),
  GV(12, '身柱', '身柱', 'Body Pillar', 'shen zhu', 'upper back', A.gv12, 2, 'back'),
  GV(13, '陶道', '陶道', 'Vessel Path', 'tao dao', 'upper back', A.gv13, 3, 'back'),
  GV(14, '大椎', '大椎', 'Great Vertebra', 'da zhui', 'nape', A.gv14, 1, 'back'),
  GV(15, '啞門', '哑门', 'Mute Gate', 'ya men', 'nape', A.gv15, 2, 'back'),
  GV(16, '風府', '风府', 'Wind Palace', 'feng fu', 'nape', A.gv16, 1, 'back'),
  GV(17, '腦戶', '脑户', 'Brain Door', 'nao hu', 'occiput', A.gv17, 3, 'back'),
  GV(18, '強間', '强间', 'Strong Room', 'qiang jian', 'head', A.gv18, 3, 'back'),
  GV(19, '後頂', '后顶', 'Back Vertex', 'hou ding', 'head', A.gv19, 3, 'back'),
  GV(20, '百會', '百会', 'Hundred Meetings', 'bai hui', 'vertex', A.gv20, 1, 'front', ['Baihui']),
  GV(21, '前頂', '前顶', 'Front Vertex', 'qian ding', 'head', A.gv21, 3),
  GV(22, '顖會', '囟会', 'Fontanel Meeting', 'xin hui', 'head', A.gv22, 3),
  GV(23, '上星', '上星', 'Upper Star', 'shang xing', 'head', A.gv23, 2),
  GV(24, '神庭', '神庭', 'Spirit Courtyard', 'shen ting', 'head', A.gv24, 2),
  GV(25, '素髎', '素髎', 'White Tip', 'su liao', 'nose', A.gv25, 3),
  GV(26, '水溝', '水沟', 'Water Ditch', 'shui gou', 'philtrum', A.gv26, 1, 'front', ['人中', 'Shuigou', 'Renzhong']),
  GV(27, '兌端', '兑端', 'Terminal Extremity', 'dui duan', 'lip', A.gv27, 3),
  GV(28, '齦交', '龈交', 'Gum Intersection', 'yin jiao', 'mouth', A.gv28, 3),
  GV(29, '印堂', '印堂', 'Hall of Impression', 'yin tang', 'glabella', A.gv29, 1, 'front', ['Yintang']),
];

export const acupoints: Acupoint[] = [
  ...lungSpecs,
  ...largeIntestineSpecs,
  ...stomachSpecs,
  ...spleenSpecs,
  ...heartSpecs,
  ...smallIntestineSpecs,
  ...bladderSpecs,
  ...kidneySpecs,
  ...pericardiumSpecs,
  ...tripleEnergizerSpecs,
  ...gallbladderSpecs,
  ...liverSpecs,
  ...conceptionSpecs,
  ...governorSpecs,
].map(build);

export const PLACEMENT_DISCLAIMER = PLACEMENT_NOTE;
