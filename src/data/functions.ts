import type { FunctionRelation, TraditionalFunction } from './types';

const HANDBOOK = 'src_handbook_docx';
const OUTLINE = 'src_outline_md';
const CLASSICAL = 'src_classical_nomenclature';

/**
 * Traditional teaching associations and mnemonic groupings.
 *
 * These records exist so the learner can search "what does the curriculum group
 * with 合谷?" — they are memorisation scaffolding for historical teaching, and
 * are written deliberately in descriptive, non-imperative language.
 *
 * Explicitly excluded from ingestion, per the project safety rules:
 *  - symptom → point prescriptions presented as advice ("牙痛用合谷");
 *  - first-aid / emergency framing (「急救」);
 *  - invasive technique (放血, needle depth/angle, moxibustion, 禁針 warnings
 *    that only make sense as needling guidance);
 *  - anything that would let a learner treat this app as a treatment planner.
 */

const FRAMING = {
  zhHant:
    '本內容說明這些教材傳統上如何教學與記憶，不是療效證據，也不是針對任何個人健康狀況的建議。',
  en: 'Educational content about how this material is traditionally taught and memorised. It is not evidence of effect, and not guidance for any personal health situation.',
};

export const traditionalFunctions: TraditionalFunction[] = [
  {
    id: 'fn_head_face_region',
    labelZhHant: '頭面部（四總穴歌）',
    labelEn: 'Head-and-face region (Four Command Points song)',
    pinyin: 'tou mian',
    aliases: ['面口', '面口合谷收', 'head and face', 'face', 'four command points', '四總穴'],
    description: {
      value: {
        zhHant:
          '四總穴歌以「面口合谷收」把頭面部與合谷編在一起，是把區域與穴位綁定的記憶法。',
        en: 'The Four Command Points song pairs the head-and-face region with 合谷 in the line 「面口合谷收」. It is a mnemonic that binds a body region to a point.',
      },
      sourceIds: [HANDBOOK, OUTLINE],
      reviewStatus: 'unreviewed',
      reviewer: null,
      reviewDate: null,
      notes:
        'Handbook Day 1 「四總穴歌」. Recorded as a mnemonic grouping only. The handbook also pairs it with specific complaints; those pairings are not ingested.',
    },
    educationalFraming: FRAMING,
    reviewStatus: 'unreviewed',
  },
  {
    id: 'fn_head_neck_region',
    labelZhHant: '頭項部（四總穴歌）',
    labelEn: 'Head-and-neck region (Four Command Points song)',
    pinyin: 'tou xiang',
    aliases: ['頭項', '頭項尋列缺', 'head and neck', 'neck', 'nape'],
    description: {
      value: {
        zhHant: '四總穴歌以「頭項尋列缺」把頭項部與列缺編在一起。',
        en: 'The Four Command Points song pairs the head-and-neck region with 列缺 in the line 「頭項尋列缺」.',
      },
      sourceIds: [HANDBOOK, OUTLINE],
      reviewStatus: 'unreviewed',
      reviewer: null,
      reviewDate: null,
      notes: 'Handbook Day 1 「四總穴歌」. Mnemonic grouping only.',
    },
    educationalFraming: FRAMING,
    reviewStatus: 'unreviewed',
  },
  {
    id: 'fn_lung_qi_breath_topic',
    labelZhHant: '肺主氣（呼吸主題）',
    labelEn: 'Lung governs qi (breathing topic)',
    pinyin: 'fei zhu qi',
    aliases: ['氣喘咳', '呼吸', 'breath', 'breathing', 'qi', 'lung qi', 'respiration'],
    description: {
      value: {
        zhHant:
          '課程把肺經與呼吸之氣的主題連在一起（「肺經主氣喘咳」），作為理解該經走向與命名的線索。',
        en: 'The curriculum links the Lung meridian with the theme of breath and qi (「肺經主氣喘咳」), used as a hook for remembering the channel and its point names.',
      },
      sourceIds: [HANDBOOK, OUTLINE],
      reviewStatus: 'unreviewed',
      reviewer: null,
      reviewDate: null,
      notes:
        'Traditional theoretical association recorded as a learning topic. Not a claim about treating any respiratory condition.',
    },
    educationalFraming: FRAMING,
    reviewStatus: 'unreviewed',
  },
  {
    id: 'fn_throat_topic',
    labelZhHant: '咽喉主題',
    labelEn: 'Throat topic',
    pinyin: 'yan hou',
    aliases: ['咽喉', 'throat', 'pharynx'],
    description: {
      value: {
        zhHant: '課程把肺經末端的少商與咽喉主題編在一起，作為經絡終點的記憶連結。',
        en: 'The curriculum associates 少商, at the end of the Lung meridian, with the throat as a topic — a memory link to the end of the channel.',
      },
      sourceIds: [HANDBOOK, OUTLINE],
      reviewStatus: 'unreviewed',
      reviewer: null,
      reviewDate: null,
      notes:
        'The source attaches an invasive technique (放血) to this association. That technique is deliberately not carried into the product.',
    },
    educationalFraming: FRAMING,
    reviewStatus: 'unreviewed',
  },
  {
    id: 'fn_interior_exterior_pair',
    labelZhHant: '表裡經（肺與大腸）',
    labelEn: 'Interior–exterior pair (Lung and Large Intestine)',
    pinyin: 'biao li jing',
    aliases: ['表裡', '表裡經', 'paired meridian', 'interior exterior', 'yin yang pair', '相表裡'],
    description: {
      value: {
        zhHant:
          '肺經（裡）與大腸經（表）互為表裡，是十二經配對關係的第一組，也是 Day 1 兩經同時學的原因。',
        en: 'Lung (interior) and Large Intestine (exterior) form an interior–exterior pair. This is the first of the twelve-channel pairings and the reason Day 1 teaches both together.',
      },
      sourceIds: [HANDBOOK, OUTLINE, CLASSICAL],
      reviewStatus: 'unreviewed',
      reviewer: null,
      reviewDate: null,
      notes: 'Structural relationship in the classical channel system.',
    },
    educationalFraming: FRAMING,
    reviewStatus: 'unreviewed',
  },
  {
    id: 'fn_influential_vessel',
    labelZhHant: '八會穴・脈會',
    labelEn: 'Influential point of the vessels (Eight Influential Points)',
    pinyin: 'mai hui',
    aliases: ['脈會', '八會穴', 'influential point', 'eight influential', 'vessels'],
    description: {
      value: {
        zhHant: '八會穴系統中，太淵被列為「脈會」。這是特定穴分類，屬於背誦框架的一部分。',
        en: 'Within the Eight Influential Points system, 太淵 is listed as the influential point of the vessels. This is a point-classification framework used for memorisation.',
      },
      sourceIds: [HANDBOOK],
      reviewStatus: 'unreviewed',
      reviewer: null,
      reviewDate: null,
      notes: 'Handbook 八會穴速查表. Only the Day 1 member (太淵) is loaded so far.',
    },
    educationalFraming: FRAMING,
    reviewStatus: 'unreviewed',
  },
  {
    id: 'fn_yangming_he_sea',
    labelZhHant: '合穴（大腸經）',
    labelEn: 'He-sea point (Large Intestine)',
    pinyin: 'he xue',
    aliases: ['合穴', 'he sea', 'five shu', '五輸穴'],
    description: {
      value: {
        zhHant: '五輸穴系統中，曲池是大腸經的合穴；課程把它當作 Day 1 的特定穴嵌入點。',
        en: 'In the five-shu system, 曲池 is the he-sea point of the Large Intestine meridian. The curriculum embeds it on Day 1 as the first specific-point category.',
      },
      sourceIds: [HANDBOOK, CLASSICAL],
      reviewStatus: 'unreviewed',
      reviewer: null,
      reviewDate: null,
      notes: 'Handbook Day 1 「大腸經合穴曲池」.',
    },
    educationalFraming: FRAMING,
    reviewStatus: 'unreviewed',
  },
  {
    id: 'fn_four_command_song',
    labelZhHant: '四總穴歌',
    labelEn: 'Four Command Points song',
    pinyin: 'si zong xue ge',
    aliases: ['四總穴', 'four command', '肚腹三里留', '腰背委中求'],
    description: {
      value: {
        zhHant:
          '「肚腹三里留，腰背委中求，頭項尋列缺，面口合谷收」——把四個身體區域各綁一個穴位的四句口訣。',
        en: 'A four-line mnemonic binding four body regions to four points, all four of which are loaded: 足三里, 委中, 列缺 and 合谷.',
      },
      sourceIds: [HANDBOOK, OUTLINE],
      reviewStatus: 'unreviewed',
      reviewer: null,
      reviewDate: null,
      notes:
        'All four members are now loaded: 足三里 ST36 (Day 2), 列缺 LU7 and 合谷 LI4 (Day 1), 委中 BL40 (Day 4).',
    },
    educationalFraming: FRAMING,
    reviewStatus: 'unreviewed',
  },
  {
    id: 'fn_lumbar_back_region',
    labelZhHant: '腰背部（四總穴歌）',
    labelEn: 'Lower-back region (Four Command Points song)',
    pinyin: 'yao bei',
    aliases: ['腰背', '腰背委中求', 'lower back', 'back', 'lumbar'],
    description: {
      value: {
        zhHant: '四總穴歌以「腰背委中求」把腰背部與委中編在一起，是把區域與穴位綁定的記憶法。',
        en: 'The Four Command Points song pairs the lower-back region with 委中 in the line 「腰背委中求」. It is a mnemonic that binds a body region to a point.',
      },
      sourceIds: [HANDBOOK, OUTLINE],
      reviewStatus: 'unreviewed',
      reviewer: null,
      reviewDate: null,
      notes:
        'Handbook Day 5 「腰背委中求」. Recorded as a mnemonic grouping only. The handbook also pairs the point with specific complaints and an acute-injury scenario; neither is ingested.',
    },
    educationalFraming: FRAMING,
    reviewStatus: 'unreviewed',
  },
];

const rel = (
  id: string,
  functionId: string,
  targetType: FunctionRelation['targetType'],
  targetId: string,
  kind: FunctionRelation['kind'],
  sourceIds: string[],
  notes: string | null = null,
): FunctionRelation => ({
  id,
  functionId,
  targetType,
  targetId,
  kind,
  sourceIds,
  reviewStatus: 'unreviewed',
  notes,
});

export const functionRelations: FunctionRelation[] = [
  rel('rel_1', 'fn_head_face_region', 'acupoint', 'pt_li4', 'mnemonic_grouping', [HANDBOOK, OUTLINE]),
  rel('rel_2', 'fn_head_face_region', 'meridian', 'mer_li', 'traditionally_associated_meridian', [
    HANDBOOK,
  ]),
  rel('rel_3', 'fn_head_neck_region', 'acupoint', 'pt_lu7', 'mnemonic_grouping', [HANDBOOK, OUTLINE]),
  rel('rel_4', 'fn_head_neck_region', 'meridian', 'mer_lu', 'traditionally_associated_meridian', [
    HANDBOOK,
  ]),
  rel('rel_5', 'fn_lung_qi_breath_topic', 'meridian', 'mer_lu', 'traditionally_associated_meridian', [
    HANDBOOK,
    OUTLINE,
  ]),
  rel('rel_6', 'fn_lung_qi_breath_topic', 'acupoint', 'pt_lu5', 'traditionally_associated_point', [
    HANDBOOK,
  ]),
  rel('rel_7', 'fn_lung_qi_breath_topic', 'acupoint', 'pt_lu7', 'traditionally_associated_point', [
    HANDBOOK,
  ]),
  rel('rel_8', 'fn_throat_topic', 'acupoint', 'pt_lu11', 'traditionally_associated_point', [
    HANDBOOK,
    OUTLINE,
  ], 'Invasive technique attached to this association in the source was not ingested.'),
  rel('rel_9', 'fn_interior_exterior_pair', 'meridian', 'mer_lu', 'traditionally_associated_meridian', [
    HANDBOOK,
    CLASSICAL,
  ]),
  rel(
    'rel_10',
    'fn_interior_exterior_pair',
    'meridian',
    'mer_li',
    'traditionally_associated_meridian',
    [HANDBOOK, CLASSICAL],
  ),
  rel('rel_11', 'fn_influential_vessel', 'acupoint', 'pt_lu9', 'traditionally_associated_point', [
    HANDBOOK,
  ]),
  rel('rel_12', 'fn_yangming_he_sea', 'acupoint', 'pt_li11', 'traditionally_associated_point', [
    HANDBOOK,
  ]),
  rel('rel_13', 'fn_four_command_song', 'acupoint', 'pt_li4', 'mnemonic_grouping', [HANDBOOK, OUTLINE]),
  rel('rel_14', 'fn_four_command_song', 'acupoint', 'pt_lu7', 'mnemonic_grouping', [HANDBOOK, OUTLINE]),
  rel(
    'rel_15',
    'fn_four_command_song',
    'acupoint',
    'pt_st36',
    'mnemonic_grouping',
    [HANDBOOK, OUTLINE],
    '「肚腹三里留」— the song\'s first line. Loaded with Day 2.',
  ),
  rel(
    'rel_16',
    'fn_four_command_song',
    'acupoint',
    'pt_bl40',
    'mnemonic_grouping',
    [HANDBOOK, OUTLINE],
    '「腰背委中求」— the song\'s second line. Loaded with Day 4, which completes the set.',
  ),
  rel('rel_17', 'fn_lumbar_back_region', 'acupoint', 'pt_bl40', 'mnemonic_grouping', [
    HANDBOOK,
    OUTLINE,
  ]),
  rel('rel_18', 'fn_lumbar_back_region', 'meridian', 'mer_bl', 'traditionally_associated_meridian', [
    HANDBOOK,
  ]),
];