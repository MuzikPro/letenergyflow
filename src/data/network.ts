import type { NetworkInterchange, NetworkStation } from './types';

/**
 * Energy-network (subway-style) diagram layout.
 *
 * Layout coordinates ONLY. Route order and point identity live in
 * `meridians.pointOrder` / `acupoints`; this file can be re-laid-out freely
 * without touching a single content record. The station list is zipped against
 * `pointOrder` at assembly time and a test asserts the counts match.
 *
 * The visual system (rounded 45° bends, hollow stations, terminus rings) is an
 * original design. No transit authority's map, iconography or geometry is copied.
 */

export const NETWORK_WIDTH = 980;
export const NETWORK_HEIGHT = 2260;

type Layout = { x: number; y: number; labelSide: NetworkStation['labelSide'] }[];

const alt = (
  coords: [number, number][],
  a: NetworkStation['labelSide'],
  b: NetworkStation['labelSide'],
): Layout => coords.map(([x, y], i) => ({ x, y, labelSide: i % 2 === 0 ? a : b }));

/** 手太陰肺經 — chest on the left, thumb on the right. */
export const lungLayout: Layout = alt(
  [
    [90, 100],
    [168, 100],
    [246, 100],
    [324, 100],
    [402, 100],
    [480, 100],
    [558, 178],
    [636, 178],
    [714, 178],
    [792, 178],
    [870, 178],
  ],
  'above',
  'below',
);

/** 手陽明大腸經 — index finger on the right, face on the left. */
export const largeIntestineLayout: Layout = alt(
  [
    [900, 320],
    [856, 320],
    [812, 320],
    [768, 320],
    [724, 320],
    [680, 320],
    [636, 320],
    [592, 320],
    [548, 320],
    [504, 320],
    [460, 320],
    [416, 320],
    [372, 276],
    [328, 276],
    [284, 276],
    [240, 276],
    [196, 232],
    [152, 232],
    [108, 232],
    [64, 232],
  ],
  'below',
  'above',
);

/**
 * 足陽明胃經 — 45 stations snaking through three rows below the Day 1 lines:
 * face→abdomen on the first row, thigh→lower leg on the return row, and the
 * foot on a short third row. Generated so the spacing stays uniform.
 */
export const stomachLayout: Layout = alt(
  [
    // Row 1, left → right: ST1–ST20.
    ...Array.from({ length: 20 }, (_, i): [number, number] => [70 + i * 44, 452]),
    // Row 2, right → left: ST21–ST40.
    ...Array.from({ length: 20 }, (_, i): [number, number] => [906 - i * 44, 532]),
    // Row 3, left → right: ST41–ST45.
    ...Array.from({ length: 5 }, (_, i): [number, number] => [70 + i * 44, 612]),
  ],
  'above',
  'below',
);

/** 足太陰脾經 — 21 stations across two rows below the Stomach snake. */
export const spleenLayout: Layout = alt(
  [
    ...Array.from({ length: 12 }, (_, i): [number, number] => [70 + i * 44, 700]),
    ...Array.from({ length: 9 }, (_, i): [number, number] => [598 - i * 44, 780]),
  ],
  'above',
  'below',
);

/** 手少陰心經 — 9 stations on a single row. */
export const heartLayout: Layout = alt(
  Array.from({ length: 9 }, (_, i): [number, number] => [70 + i * 44, 872]),
  'above',
  'below',
);

/** 手太陽小腸經 — 19 stations on a single row, little finger → ear. */
export const smallIntestineLayout: Layout = alt(
  Array.from({ length: 19 }, (_, i): [number, number] => [70 + i * 44, 960]),
  'above',
  'below',
);

/**
 * 足太陽膀胱經 — 67 stations snaking through four rows. The rows deliberately
 * follow the modern numbering, which is not a single anatomical walk: the
 * second paravertebral line (BL41–BL54) doubles back up the torso. On a
 * schematic network map that reads as an ordinary row change rather than the
 * long diagonal it would draw on the body atlas.
 */
export const bladderLayout: Layout = alt(
  [
    ...Array.from({ length: 20 }, (_, i): [number, number] => [70 + i * 44, 1048]),
    ...Array.from({ length: 20 }, (_, i): [number, number] => [906 - i * 44, 1128]),
    ...Array.from({ length: 20 }, (_, i): [number, number] => [70 + i * 44, 1208]),
    ...Array.from({ length: 7 }, (_, i): [number, number] => [906 - i * 44, 1288]),
  ],
  'above',
  'below',
);

/** 足少陰腎經 — 27 stations across two rows below the Bladder snake. */
export const kidneyLayout: Layout = alt(
  [
    ...Array.from({ length: 15 }, (_, i): [number, number] => [70 + i * 44, 1380]),
    ...Array.from({ length: 12 }, (_, i): [number, number] => [686 - i * 44, 1450]),
  ],
  'above',
  'below',
);

/** 手厥陰心包經 — 9 stations on a single row. */
export const pericardiumLayout: Layout = alt(
  Array.from({ length: 9 }, (_, i): [number, number] => [70 + i * 44, 1540]),
  'above',
  'below',
);

/** 手少陽三焦經 — 23 stations across two rows. */
export const tripleEnergizerLayout: Layout = alt(
  [
    ...Array.from({ length: 15 }, (_, i): [number, number] => [70 + i * 44, 1620]),
    ...Array.from({ length: 8 }, (_, i): [number, number] => [686 - i * 44, 1670]),
  ],
  'above',
  'below',
);

/** 足少陽膽經 — 44 stations across three rows. */
export const gallbladderLayout: Layout = alt(
  [
    ...Array.from({ length: 16 }, (_, i): [number, number] => [70 + i * 44, 1760]),
    ...Array.from({ length: 16 }, (_, i): [number, number] => [730 - i * 44, 1830]),
    ...Array.from({ length: 12 }, (_, i): [number, number] => [70 + i * 44, 1890]),
  ],
  'above',
  'below',
);

/** 足厥陰肝經 — 14 stations on a single row; the last of the twelve. */
export const liverLayout: Layout = alt(
  Array.from({ length: 14 }, (_, i): [number, number] => [70 + i * 44, 1970]),
  'above',
  'below',
);

/**
 * 任脈 and 督脈 — the two midline vessels, laid out last and apart from the
 * twelve. They carry no interchange edges to the paired channels: they are
 * extraordinary vessels, outside the flow cycle the twelve form.
 */
export const conceptionLayout: Layout = alt(
  [
    ...Array.from({ length: 14 }, (_, i): [number, number] => [70 + i * 44, 2080]),
    ...Array.from({ length: 10 }, (_, i): [number, number] => [642 - i * 44, 2140]),
  ],
  'above',
  'below',
);

export const governorLayout: Layout = alt(
  [
    ...Array.from({ length: 16 }, (_, i): [number, number] => [70 + i * 44, 2200]),
    ...Array.from({ length: 13 }, (_, i): [number, number] => [730 - i * 44, 2250]),
  ],
  'above',
  'below',
);

export const layoutByMeridian: Record<string, Layout> = {
  mer_lu: lungLayout,
  mer_li: largeIntestineLayout,
  mer_st: stomachLayout,
  mer_sp: spleenLayout,
  mer_ht: heartLayout,
  mer_si: smallIntestineLayout,
  mer_bl: bladderLayout,
  mer_ki: kidneyLayout,
  mer_pc: pericardiumLayout,
  mer_te: tripleEnergizerLayout,
  mer_gb: gallbladderLayout,
  mer_lr: liverLayout,
  mer_cv: conceptionLayout,
  mer_gv: governorLayout,
};

/** Polyline through the layout, with the corners rounded at assembly time. */
export const pathByMeridian: Record<string, string> = {
  mer_lu: 'M90,100 L480,100 L558,178 L870,178',
  mer_li: 'M900,320 L416,320 L372,276 L240,276 L196,232 L64,232',
  mer_st: 'M70,452 L906,452 L906,532 L70,532 L70,612 L246,612',
  mer_sp: 'M70,700 L554,700 L554,780 L202,780',
  mer_ht: 'M70,872 L422,872',
  mer_si: 'M70,960 L862,960',
  mer_bl: 'M70,1048 L906,1048 L906,1128 L70,1128 L70,1208 L906,1208 L906,1288 L642,1288',
  mer_ki: 'M70,1380 L686,1380 L686,1450 L202,1450',
  mer_pc: 'M70,1540 L422,1540',
  mer_te: 'M70,1620 L686,1620 L686,1670 L378,1670',
  mer_gb: 'M70,1760 L730,1760 L730,1830 L70,1830 L70,1890 L554,1890',
  mer_lr: 'M70,1970 L642,1970',
  mer_cv: 'M70,2080 L642,2080 L642,2140 L246,2140',
  mer_gv: 'M70,2200 L730,2200 L730,2250 L202,2250',
};

/** Shared tail so every interchange carries the same "not anatomy" caveat. */
const MEANING_ZH_TAIL =
  '圖上以兩條線之間的轉乘表示——這不是解剖上的交叉，兩條經在此並不共用任何穴位。';
const MEANING_EN_TAIL =
  'Shown as a transfer between two lines — it is NOT an anatomical crossing and no point is shared between the two meridians here.';

export const networkInterchanges: NetworkInterchange[] = [
  {
    id: 'ix_lu_li_flow',
    labelZhHant: '肺 → 大腸 · 表裡傳注',
    labelEn: 'Lung → Large Intestine · paired transfer',
    x: 885,
    y: 249,
    meridianIds: ['mer_lu', 'mer_li'],
    meaningZhHant:
      '課程所教的流注次序：肺經被描述為將氣血傳往與它相表裡的大腸經。' + MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: the Lung channel is described as passing onward to its paired Large Intestine channel. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_handbook_docx', 'src_classical_nomenclature'],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'ix_li_st_flow',
    labelZhHant: '大腸 → 胃 · 流注次序',
    labelEn: 'Large Intestine → Stomach · flow order',
    x: 36,
    y: 342,
    meridianIds: ['mer_li', 'mer_st'],
    meaningZhHant:
      '課程所教的流注次序：大腸經（止於鼻翼旁）被描述為接續傳往胃經（起於眼下）。' + MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: the Large Intestine channel (ending beside the nose) is described as passing onward to the Stomach channel (beginning below the eye). ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_handbook_docx', 'src_classical_nomenclature'],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'ix_st_sp_flow',
    labelZhHant: '胃 → 脾 · 表裡傳注',
    labelEn: 'Stomach → Spleen · paired transfer',
    x: 36,
    y: 656,
    meridianIds: ['mer_st', 'mer_sp'],
    meaningZhHant:
      '課程所教的流注次序：胃經被描述為將氣血傳往與它相表裡的脾經。' + MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: the Stomach channel is described as passing onward to its paired Spleen channel. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day3_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
  {
    id: 'ix_sp_ht_flow',
    labelZhHant: '脾 → 心 · 流注次序',
    labelEn: 'Spleen → Heart · flow order',
    x: 150,
    y: 826,
    meridianIds: ['mer_sp', 'mer_ht'],
    meaningZhHant:
      '課程所教的流注次序：脾經的支脈被描述為上行注入心中，將氣血傳往心經。' + MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: a branch of the Spleen channel is described as reaching the heart, passing the flow onward to the Heart channel. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day3_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
  {
    id: 'ix_ht_si_flow',
    labelZhHant: '心 → 小腸 · 表裡傳注',
    labelEn: 'Heart → Small Intestine · paired transfer',
    x: 250,
    y: 916,
    meridianIds: ['mer_ht', 'mer_si'],
    meaningZhHant:
      '課程所教的流注次序：心經被描述為將氣血傳往與它相表裡的小腸經。' + MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: the Heart channel is described as passing onward to its paired Small Intestine channel. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day4_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
  {
    id: 'ix_si_bl_flow',
    labelZhHant: '小腸 → 膀胱 · 流注次序',
    labelEn: 'Small Intestine → Bladder · flow order',
    x: 890,
    y: 1004,
    meridianIds: ['mer_si', 'mer_bl'],
    meaningZhHant:
      '課程所教的流注次序：小腸經的支脈被描述為上抵目內眥，在該處將氣血傳往起於目內眥的膀胱經。' +
      MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: a branch of the Small Intestine channel is described as reaching the inner canthus, where the flow passes to the Bladder channel that begins there. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day4_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
  {
    id: 'ix_bl_ki_flow',
    labelZhHant: '膀胱 → 腎 · 表裡傳注',
    labelEn: 'Bladder → Kidney · paired transfer',
    x: 150,
    y: 1334,
    meridianIds: ['mer_bl', 'mer_ki'],
    meaningZhHant:
      '課程所教的流注次序：膀胱經被描述為將氣血傳往與它相表裡的腎經。' + MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: the Bladder channel is described as passing onward to its paired Kidney channel. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day6_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
  {
    id: 'ix_ki_pc_flow',
    labelZhHant: '腎 → 心包 · 流注次序',
    labelEn: 'Kidney → Pericardium · flow order',
    x: 150,
    y: 1496,
    meridianIds: ['mer_ki', 'mer_pc'],
    meaningZhHant:
      '課程所教的流注次序：腎經的支脈被描述為上注胸中，將氣血傳往心包經。' + MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: a branch of the Kidney channel is described as pouring into the chest, passing the flow onward to the Pericardium channel. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day7_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
  {
    id: 'ix_pc_te_flow',
    labelZhHant: '心包 → 三焦 · 表裡傳注',
    labelEn: 'Pericardium → Triple Energizer · paired transfer',
    x: 150,
    y: 1580,
    meridianIds: ['mer_pc', 'mer_te'],
    meaningZhHant:
      '課程所教的流注次序：心包經的支脈被描述為沿無名指出其端，傳往與它相表裡的三焦經。' +
      MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: a branch of the Pericardium channel is described as running along the ring finger to its tip, passing the flow to its paired Triple Energizer channel. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day7_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
  {
    id: 'ix_te_gb_flow',
    labelZhHant: '三焦 → 膽 · 流注次序',
    labelEn: 'Triple Energizer → Gallbladder · flow order',
    x: 150,
    y: 1716,
    meridianIds: ['mer_te', 'mer_gb'],
    meaningZhHant:
      '課程所教的流注次序：三焦經止於眉梢，被描述為接續傳往起於目外眥的膽經。' + MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: the Triple Energizer channel, ending at the outer brow, is described as passing onward to the Gallbladder channel, which begins at the outer canthus. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day8_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
  {
    id: 'ix_gb_lr_flow',
    labelZhHant: '膽 → 肝 · 表裡傳注',
    labelEn: 'Gallbladder → Liver · paired transfer',
    x: 150,
    y: 1926,
    meridianIds: ['mer_gb', 'mer_lr'],
    meaningZhHant:
      '課程所教的流注次序：膽經被描述為將氣血傳往與它相表裡的肝經。' + MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: the Gallbladder channel is described as passing onward to its paired Liver channel. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day9_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
  {
    id: 'ix_lr_lu_cycle',
    labelZhHant: '肝 → 肺 · 流注閉環',
    labelEn: 'Liver → Lung · the cycle closes',
    x: 700,
    y: 1970,
    meridianIds: ['mer_lr', 'mer_lu'],
    meaningZhHant:
      '課程所教的流注次序：肝經的支脈被描述為上注於肺，把氣血交回手太陰肺經——十二正經的循環在此接回起點。' +
      MEANING_ZH_TAIL,
    meaningEn:
      'Channel-flow order as taught in the curriculum: a branch of the Liver channel is described as pouring into the lung, handing the flow back to the Lung channel where the sequence began. This is where the cycle of the twelve closes. ' +
      MEANING_EN_TAIL,
    sourceIds: ['src_owner_worksheet_day9_2026_08', 'src_lingshu'],
    reviewStatus: 'source_checked',
  },
];
