import { QIJING_SOURCE_ID } from './extraordinary-routes';

/**
 * 歌訣 — the rhymed mnemonics for the 特定穴 categories.
 *
 * These are long-circulating teaching verses, and the app already holds every
 * category they index: the 特定穴 matrix has tabs for 五輸穴, 原絡郄, 募俞,
 * 八會穴, 八脈交會 and 下合穴, all built from reviewed `classifications`. The
 * verses are the memory handle for content that is already here, which is why
 * they belong on the Learn page rather than becoming another dataset.
 *
 * WHAT IS DELIBERATELY LEFT OUT. The source file wraps its verses in clinical
 * commentary, and none of that is ingested: no 刺絡放血 or 少商放血 (bloodletting
 * and needling technique), no 「孕婦禁用」 for 合谷 (pregnancy), and none of its
 * symptom-to-point recommendations. The verses name points and categories; the
 * commentary told the reader what to treat with them, and that is the line this
 * project does not cross. `mnemonics.test.ts` asserts the exclusions hold.
 *
 * VALIDATED, NOT JUST STORED. Two of these verses assert facts the dataset can
 * check — the 背俞穴 verse gives a vertebral level for each of the twelve, and
 * the 八脈交會 verse pairs eight points with eight vessels. Both are verified
 * against the point records rather than taken on trust, which is what makes
 * this an ingest rather than a wall of text.
 */

export interface Mnemonic {
  id: string;
  titleZhHant: string;
  titleEn: string;
  /** The verse, one line per array entry. */
  lines: string[];
  /** What it indexes — plain description, no clinical claim. */
  noteZhHant: string;
  noteEn: string;
  sourceIds: string[];
}

const S = [QIJING_SOURCE_ID];

export const MNEMONICS: Mnemonic[] = [
  {
    id: 'mn_four_command',
    titleZhHant: '四總穴歌',
    titleEn: 'Four Command Points',
    lines: ['肚腹三里留，腰背委中求，', '頭項尋列缺，面口合谷收。'],
    noteZhHant: '四個部位，四個穴：足三里、委中、列缺、合谷。這首只記部位與穴名的對應。',
    noteEn:
      'Four regions to four points — 足三里, 委中, 列缺, 合谷. The verse records which point is named for which region, and nothing further.',
    sourceIds: S,
  },
  {
    id: 'mn_eight_influential',
    titleZhHant: '八會穴歌',
    titleEn: 'Eight Influential Points',
    lines: ['腑會中脘臟章門，', '髓會絕骨筋陽陵，', '血會膈俞骨大杼，', '脈太淵兮氣膻中。'],
    noteZhHant: '八種組織各有一個「會」穴。對應本應用「特定穴」的八會穴分頁。',
    noteEn:
      'One gathering point for each of eight tissues. Matches the 八會穴 tab of the 特定穴 matrix.',
    sourceIds: S,
  },
  {
    id: 'mn_confluent',
    titleZhHant: '八脈交會穴歌',
    titleEn: 'Eight Confluent Points',
    lines: [
      '公孫衝脈胃心胸，內關陰維下總同；',
      '臨泣膽經連帶脈，陽維目銳外關逢。',
      '後溪督脈內眥頸，申脈陽蹻絡亦通；',
      '列缺任脈行肺系，陰蹻照海膈喉嚨。',
    ],
    noteZhHant:
      '八個穴各通一條奇經，四組配對，每組一手一足。本應用「人體圖」的奇經八脈圖層即依此排列。',
    noteEn:
      'Eight points, each opening one extraordinary vessel, in the four coupled pairs — one hand point and one foot point each. The atlas’s 奇經八脈 layer is ordered by this verse.',
    sourceIds: S,
  },
  {
    id: 'mn_five_shu',
    titleZhHant: '井滎輸經合歌訣',
    titleEn: 'The Five Shu Points',
    lines: [
      '少商魚際與太淵；經渠尺澤肺相連；',
      '商陽二三間合谷，陽溪曲池大腸牽。',
      '厲兌內庭陷谷胃；衝陽解溪三里隨；',
      '隱白大都太白脾，商丘陰陵泉要知。',
      '少衝少府屬於心；神門靈道少海尋；',
      '少澤前谷後溪腕，陽谷小海小腸經。',
      '至陰通谷束京骨；崑崙委中膀胱知；',
      '湧泉然谷與太溪，復溜陰谷腎所宜。',
      '中衝勞宮心包絡；大陵間使傳曲澤；',
      '關衝液門中渚焦，陽池支溝天井索。',
      '大敦行間太衝看；中封曲泉屬於肝；',
      '竅陰俠溪臨泣膽，丘墟陽輔陽陵泉。',
    ],
    noteZhHant:
      '十二經各有井、滎、輸、經、合五穴，全在肘膝以下，由末梢向近心排列。對應「五輸穴」分頁。',
    noteEn:
      'Each of the twelve channels has its 井 滎 輸 經 合, all below the elbow or knee and ordered from the extremity inward. Matches the 五輸穴 tab.',
    sourceIds: S,
  },
  {
    id: 'mn_luo',
    titleZhHant: '十五絡穴歌',
    titleEn: 'Fifteen Luo-Connecting Points',
    lines: [
      '列缺偏歷肺大腸，通里支正心小鄉，',
      '心包內關三焦外，公孫豐隆脾胃詳，',
      '膽絡光明肝蠡溝，大鍾腎絡膀飛揚，',
      '脾有大絡名大包，任絡鳩尾督長強。',
    ],
    noteZhHant: '十二經各一絡穴，加脾之大絡、任絡、督絡，共十五。',
    noteEn:
      'One luo-connecting point per channel, plus the great luo of the Spleen and the luo of the Conception and Governor vessels — fifteen in all.',
    sourceIds: S,
  },
  {
    id: 'mn_mu',
    titleZhHant: '十二募穴歌',
    titleEn: 'Twelve Front-Mu Points',
    lines: [
      '天樞大腸肺中府，關元小腸巨闕心，',
      '中極膀胱京門腎，膽日月肝期門尋，',
      '脾募章門胃中脘，氣化三焦石門針，',
      '心包募穴何處取，胸前膻中覓淺深。',
    ],
    noteZhHant: '十二臟腑各有一個募穴，都在胸腹。與背俞穴一前一後成對，見「募俞」分頁。',
    noteEn:
      'One front-mu point for each of the twelve organs, all on the chest and abdomen. Each pairs front-to-back with a back-shu point — see the 募俞 tab.',
    sourceIds: S,
  },
  {
    id: 'mn_xi',
    titleZhHant: '十六郄穴歌',
    titleEn: 'Sixteen Xi-Cleft Points',
    lines: [
      '郄是孔隙義，氣血深藏聚，',
      '肺郄孔最大溫溜，脾郄地機胃梁丘，',
      '心郄陰郄小養老，膀胱金門腎水求，',
      '心包郄門焦會宗，膽郄外丘肝中都，',
      '陽蹻跗陽陰交信，陽交築賓維脈收。',
    ],
    noteZhHant:
      '十二經各一郄穴，加陰陽蹻、陰陽維各一，共十六。末句的四個郄穴屬奇經，與奇經八脈圖層相接。',
    noteEn:
      'One xi-cleft per channel plus one each for the two Motility and two Linking vessels — sixteen. The four in the last line belong to the extraordinary vessels and link back to the atlas layer.',
    sourceIds: S,
  },
  {
    id: 'mn_back_shu',
    titleZhHant: '十二背俞穴歌',
    titleEn: 'Twelve Back-Shu Points',
    lines: ['肺三厥四心五居，', '肝九膽十脾十一，', '胃十二椎腎十四，', '氣海十五大腸六，', '小腸十八膀十九。'],
    noteZhHant:
      '數字是椎數，從第一胸椎起算：胸椎十二節之後接腰椎，所以「腎十四」即第 2 腰椎。全在第一側線，旁開 1.5 寸。',
    noteEn:
      'The numbers count vertebrae from T1 down, continuing into the lumbar spine — so “腎十四”, the fourteenth, is L2. All twelve sit on the first paravertebral line, 1.5 cun out.',
    sourceIds: S,
  },
  {
    id: 'mn_lower_he',
    titleZhHant: '下合穴歌',
    titleEn: 'Lower He-Sea Points',
    lines: [
      '胃經下合三里鄉，上下巨虛大小腸，',
      '膀胱當合委中穴，三焦下合屬委陽，',
      '膽經之合陽陵泉。',
    ],
    noteZhHant: '六腑各有一個下合穴，全在下肢。對應「下合穴」分頁。',
    noteEn: 'One lower he-sea point for each of the six fu organs, all on the leg. Matches the 下合穴 tab.',
    sourceIds: S,
  },
];
