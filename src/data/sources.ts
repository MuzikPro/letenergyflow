import type { SourceRecord } from './types';

/**
 * Source register.
 *
 * Nothing in the Day 1 dataset is `expert_reviewed`. The handbook and outline
 * are the user's own curriculum input and are explicitly *not* independently
 * verified medical authorities. Classical point names and route order are
 * long-circulating public-domain facts, but they still need reconciliation
 * against current point-location standards and a qualified reviewer before the
 * project may call them checked.
 */
export const sources: SourceRecord[] = [
  {
    id: 'src_handbook_docx',
    title: '十二天經絡穴位全掌握訓練營手冊（改版優化版）',
    reference: '十二天經絡穴位全掌握訓練營_改版手冊.docx',
    editionOrVersion: '改版優化版',
    locator: '第 1 天：手太陰肺經 & 手陽明大腸經',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Traditional Chinese Medicine, Traditional Chinese language curriculum',
    reuseStatus: 'unknown',
    reviewStatus: 'unreviewed',
    reviewer: null,
    reviewDate: null,
    notes:
      'User-owned learning-design input. Contains clinical pairings, first-aid language and at least one invasive technique reference (少商放血). Those are deliberately NOT ingested as product content. No bibliography or licence statement accompanies the file.',
  },
  {
    id: 'src_outline_md',
    title: 'Learn Acupoint — 12 天課程大綱',
    reference: 'Learn Acupoint .md',
    editionOrVersion: null,
    locator: '第1天：手太陰肺經 & 手陽明大腸經（表裡經）',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Traditional Chinese Medicine, Traditional Chinese language curriculum',
    reuseStatus: 'unknown',
    reviewStatus: 'unreviewed',
    reviewer: null,
    reviewDate: null,
    notes:
      'Condensed outline. The handbook corrects at least one back-shu mnemonic from this file, so the two must not be merged mechanically.',
  },
  {
    id: 'src_classical_nomenclature',
    title:
      'Long-circulating classical meridian point sequence and Traditional Chinese point names',
    reference: null,
    editionOrVersion: null,
    locator: null,
    sourceType: 'classical_public_domain',
    jurisdictionOrTradition: 'Classical Chinese medical tradition',
    reuseStatus: 'public_domain_fact',
    reviewStatus: 'unreviewed',
    reviewer: null,
    reviewDate: null,
    notes:
      'Point names, canonical codes and route order are treated as public-domain facts restated in the project\'s own wording. NOT yet reconciled against a current point-location standard (candidates: GB/T 12346-2021, GB/T 22163-2008, Hong Kong Chinese-medicine clinical terminology, professional examination bibliographies). No single source is treated as authoritative. Requires source reconciliation plus expert sign-off before any record may move past `unreviewed`.',
  },
  {
    id: 'src_project_schematic',
    title: 'Let Energy Flow original schematic body diagram',
    reference: 'app/src/data/atlas.ts',
    editionOrVersion: '0.1.0',
    locator: null,
    sourceType: 'project_original',
    jurisdictionOrTradition: null,
    reuseStatus: 'open_licensed',
    reviewStatus: 'unreviewed',
    reviewer: null,
    reviewDate: null,
    notes:
      'Original hand-authored SVG figure created for this project — no traced, downloaded, licensed or AI-generated anatomical art is used. Deliberately stylised so it cannot be mistaken for an anatomical reference. All marker placements are diagram layout coordinates, NOT validated anatomical coordinates.',
  },
  {
    id: 'src_owner_worksheet_2026_08',
    title: '內容編審工作表（已填寫版）· Owner editorial review worksheet',
    reference: 'content-review/worksheet-filled-2026-08-05.md',
    editionOrVersion: '2026-08-05',
    locator: null,
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner, citing the standards below',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-05',
    notes:
      'The owner\'s completed editorial pass over all 76 loaded points, citing GB/T 12346-2021, WHO Standard Acupuncture Point Locations (2008), the 針灸學 textbook and classical texts per entry. This is an editorial source-check, not an independent expert review. The 備註 field additionally carries 功效 (traditional actions), which the owner decided on 2026-08-13 to ingest for the Lung channel; see data/indications.ts. Needling technique, depth, angle, contraindication and first-aid content in the same field remain excluded and are not ingested for any point.',
  },
  {
    id: 'src_model_unverified',
    title: '模型生成的傳統功效與主治（未經來源核對）· Model-written traditional actions and indications',
    reference: 'No document. Written by an AI assistant from general knowledge.',
    editionOrVersion: null,
    locator: null,
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'None. This is not a text and has no tradition behind it.',
    reuseStatus: 'unknown',
    reviewStatus: 'unreviewed',
    reviewer: null,
    reviewDate: null,
    notes:
      'NOT A SOURCE IN THE SENSE THE OTHER ENTRIES ARE. It records that a field was written by an AI assistant from general knowledge of standard TCM curriculum material, because no file in this repository covers that point. It is registered so that such content can be told apart from content actually read out of a document — every other entry in this list can be opened and checked against, and this one cannot. Added 2026-08-13 at the owner\'s decision, for personal study in a private repository. It must not be published or shared as reference content, and a public release must replace it with a real source rather than relabel it. Where a file-based source exists for a point, that source is used and this one is not.',
  },
  {
    id: 'src_owner_index_table_2026_08',
    title: '26 天經絡穴位全掌握 · 按身體部位分類快速檢索表 · Owner region index table',
    reference: '26天经络穴位全掌握_部位检索表.md',
    editionOrVersion: null,
    locator: '主治方向欄',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Owner-authored study aid, no bibliography',
    reuseStatus: 'unknown',
    reviewStatus: 'unreviewed',
    reviewer: null,
    reviewDate: null,
    notes:
      'Owner-authored index carrying a 主治方向 column. Ingested for the Lung channel only, as the source of the 主治 field on those points. It names no bibliography, so the indications it lists are curriculum input and are labelled unreviewed wherever they are shown. Its 學習日 column is NOT ingested: it numbers a different course from this one, placing the neck on D17 and the head on D18 where this curriculum has the thorax and the abdomen. First-aid and bloodletting language in the same column is excluded.',
  },
  {
    id: 'src_owner_worksheet_day3_2026_08',
    title: '第 3 天 內容編審工作表（來源校正版）· Owner Day 3 review worksheet',
    reference: 'content-review/worksheet-day3-filled-2026-08-06.md',
    editionOrVersion: '2026-08-06',
    locator: 'SP 21 穴、HT 9 穴',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner, citing the standards below',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-06',
    notes:
      'The owner\'s Day 3 editorial pass over the Spleen and Heart channels, citing GB/T 12346-2021, WHO SPAL 2008, 《針灸學》新世紀第四版 and 《靈樞·經脈》. Written clinical-free by the owner, so no safety filtering was required. English wording remains this project\'s own translation of the reviewed 中文.',
  },
  {
    id: 'src_gbt_12346_2021',
    title: 'GB/T 12346-2021《經穴部位》 Nomenclature and location of meridian points',
    reference: 'GB/T 12346-2021',
    editionOrVersion: '2021',
    locator: null,
    sourceType: 'official_standard',
    jurisdictionOrTradition: 'People\'s Republic of China national standard',
    reuseStatus: 'publicly_accessible_restricted',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-05',
    notes:
      'Cited by the owner worksheet as the primary location authority for this pass. Point-location facts are used restated in the project\'s own wording; the standard\'s own text and diagrams are not reproduced. One national standard among several candidate authorities — not treated as the sole project truth.',
  },
  {
    id: 'src_owner_qijing_2026_08',
    title: '奇經八脈與特定穴歌訣參考（擁有者提供）',
    reference: 'content-review/qijing-reference-2026-08-23.md',
    editionOrVersion: '2026-08-23',
    locator: '二、循行：八脈的循行、主要病候、交會腧穴；歌訣各首',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Traditional Chinese Medicine, compiled study sheet',
    reuseStatus: 'unknown',
    reviewStatus: 'unreviewed',
    reviewer: null,
    reviewDate: null,
    notes:
      'Owner-supplied compilation. Its 循行 wording follows the standard modern ' +
      'textbook presentation and it names no edition or bibliography, so it is ' +
      'registered as what it is rather than as 《奇經八脈考》, which the owner ' +
      'supplied separately. What IS ingested from it: the eight vessels\' 循行, ' +
      '主要病候 and 交會腧穴 lists, and the mnemonic verses. All 75 交會腧穴 ' +
      'references were resolved against the point records; one, 「通谷」 in the ' +
      '衝脈 list, is ambiguous and is read as 腹通谷 KI20 on sequence. What is ' +
      'NOT ingested: the file\'s needling and first-aid language (刺絡放血, ' +
      '少商放血), its pregnancy contraindication for 合谷, and its symptom-to-point ' +
      'recommendations — all excluded categories under the project rules.',
  },
  {
    id: 'src_qijing_bamai_kao',
    title: '《奇經八脈考》 Exposition on the Eight Extraordinary Vessels',
    reference: '《奇經八脈考》（明·李時珍，1578）',
    editionOrVersion: 'Ming dynasty, 1578',
    locator: '八脈；陰維脈、陽維脈、陰蹻脈、任脈、督脈、帶脈各篇',
    sourceType: 'classical_public_domain',
    jurisdictionOrTradition: 'Classical Chinese medical canon',
    reuseStatus: 'public_domain_fact',
    reviewStatus: 'unreviewed',
    reviewer: null,
    reviewDate: null,
    notes:
      'Two transcriptions were supplied by the owner and both were consulted. ' +
      'The first (Chinese Wikisource) is corrupt in two of its eight sections — ' +
      'its 沖脈 section reproduces the 陰蹻脈 text and its 陽蹻脈 section ' +
      'reproduces the 陽維脈 text — so those two vessels were left empty rather ' +
      'than filled from elsewhere. The second (jicheng.tw) carries all eight ' +
      'intact and supplied the two missing openings; it also corrects the first, ' +
      'which misreads 然谷 as a 足少陽 point where it is 足少陰. Used ONLY for ' +
      'each vessel\'s opening 起於 statement as a public-domain fact; neither ' +
      'transcription is reproduced at length. Li Shizhen\'s 交會腧穴 lists differ ' +
      'from the modern ones this dataset draws — he adds 章門 to 帶脈 and 然谷 to ' +
      '陰蹻脈, names 臂臑/臑會 where the modern list has 臑俞, and ends 陽蹻脈 at ' +
      '風池 where the modern list has 居髎 and 天髎. Recorded in ' +
      'content-review/qijing-ingest-2026-08-23.md and NOT reconciled by ' +
      'preferring one over the other.',
  },
  {
    id: 'src_who_spal_2008',
    title: 'WHO Standard Acupuncture Point Locations in the Western Pacific Region',
    reference: 'WHO SPAL (2008)',
    editionOrVersion: '2008',
    locator: null,
    sourceType: 'official_standard',
    jurisdictionOrTradition: 'WHO Western Pacific Region',
    reuseStatus: 'publicly_accessible_restricted',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-05',
    notes:
      'Cited by the owner worksheet to confirm English point-name renderings. Used as one reference among several, per the project rule against privileging any single authority.',
  },
  {
    id: 'src_zhenjiuxue_textbook',
    title: '全國高等中醫藥院校規劃教材《針灸學》',
    reference: '《針灸學》新世紀第四版',
    editionOrVersion: '新世紀第四版',
    locator: null,
    sourceType: 'educational_institution',
    jurisdictionOrTradition: 'PRC higher-education TCM curriculum',
    reuseStatus: 'permission_required',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-05',
    notes:
      'Cited by the owner worksheet for five-shu attributions and teaching framing. Facts restated in project wording only. Verified 2026-09-03: no verbatim text from this textbook is ingested anywhere in the dataset — it appears only as a corroborating sourceId (SP/HT routes, whose quoted text is 《靈樞·經脈》) and in worksheet provenance notes. Citation-only use, so it does not block a public release of the dataset.',
  },
  {
    id: 'src_lingshu',
    title: '《靈樞·經脈》 Lingshu, Channels chapter',
    reference: '《靈樞》',
    editionOrVersion: null,
    locator: '經脈',
    sourceType: 'classical_public_domain',
    jurisdictionOrTradition: 'Classical Chinese medical canon',
    reuseStatus: 'public_domain_fact',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-05',
    notes: 'Classical route descriptions and luo-connecting attributions cited by the owner worksheet.',
  },
  {
    id: 'src_nanjing',
    title: '《難經》 Nanjing (Classic of Difficulties)',
    reference: '《難經》',
    editionOrVersion: null,
    locator: null,
    sourceType: 'classical_public_domain',
    jurisdictionOrTradition: 'Classical Chinese medical canon',
    reuseStatus: 'public_domain_fact',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-05',
    notes: 'Five-shu point attributions cited by the owner worksheet.',
  },
  {
    id: 'src_jiayijing',
    title: '《針灸甲乙經》 Zhenjiu Jiayi Jing',
    reference: '《針灸甲乙經》',
    editionOrVersion: null,
    locator: null,
    sourceType: 'classical_public_domain',
    jurisdictionOrTradition: 'Classical Chinese medical canon',
    reuseStatus: 'public_domain_fact',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-05',
    notes: 'Crossing-point and xi-cleft attributions cited by the owner worksheet.',
  },
  {
    id: 'src_ziwu_liuzhu',
    title: '《針灸大成·十二經納地支歌》 Song of the Twelve Channels Matched to the Earthly Branches',
    reference: '《針灸大成》卷五 · 十二經納地支歌（明·楊繼洲）',
    editionOrVersion: 'Ming dynasty, 1601',
    locator: '十二經納地支歌',
    sourceType: 'classical_public_domain',
    jurisdictionOrTradition: 'Classical Chinese medical canon',
    reuseStatus: 'public_domain_fact',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-08',
    notes:
      'The hour-to-channel mapping shown in the Flow view, and the mnemonic verse it is drawn ' +
      'from. Confirmed against this source by the owner worksheet of 2026-08-08, which also ' +
      'records the theoretical background in 《靈樞·營衛生會》, 《靈樞·衛氣行》 and 《難經·六十四難》. ' +
      'The channel ORDER matches the flow sequence already in the dataset and a test asserts they ' +
      'agree. Recorded as which channel the tradition assigns to each double-hour ONLY — the ' +
      'tradition’s use of this scheme to time treatment (納甲法, 納子法, 開穴閉穴) is out of scope ' +
      'for this app and is deliberately not represented.',
  },
  {
    id: 'src_owner_worksheet_ziwu_2026_08',
    title: '子午流注 內容編審工作表 · Meridian-clock content review worksheet (filled)',
    reference: 'content-review/worksheet-ziwu-liuzhu-filled-2026-08-08.md',
    editionOrVersion: '2026-08-08',
    locator: '十二時辰配經、說明文字、免責聲明',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner, citing 《針灸大成》 and the classics below',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-08',
    notes:
      'Confirms all twelve pairings unchanged, fixes clock time (not true solar time) as the ' +
      'display basis with a footnote explaining the classical assumption, settles the English ' +
      'title, and supplies the explanatory paragraph, the twelve per-hour lines and the expanded ' +
      'disclaimer. Keeps the Flow view OUT of the twelve-day course: the scheme’s core ' +
      'applications are treatment decisions, so it stays a reference tab with no flashcards or ' +
      'quiz items. English wording is the project’s own translation of the reviewed 中文.',
  },
  {
    id: 'src_zhongguo_zhenjiu_2010_solar_time',
    title: '〈子午流注針法時間標準芻議〉《中國針灸》2010(7)',
    reference: '蘇緒林、彭楚湘、謝雨君，《中國針灸》2010 年第 7 期',
    editionOrVersion: '2010',
    locator: '時間標準討論',
    sourceType: 'peer_reviewed',
    jurisdictionOrTradition: 'Modern Chinese acupuncture scholarship',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-08',
    notes:
      'Cited by the owner worksheet as the background for the clock-time versus true-solar-time ' +
      'footnote. Referenced only — no text or figure from it is reproduced, and the app does not ' +
      'implement any solar-time conversion.',
  },
  {
    id: 'src_owner_worksheet_day26_2026_08',
    title: '第 26 天 內容編審工作表 · Day 26 content review worksheet',
    reference: 'content-review/worksheet-day26-2026-08-12.md',
    editionOrVersion: '2026-08-12',
    locator: '背部及臀部：棘突計數、膀胱經兩條側線、十二背俞穴',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-12',
    notes:
      'Owner draft for the back and gluteal region lesson, the last of the ' +
      'thirteen. Five items were corrected at ingest against the acupoint ' +
      'records: three cited points belong to other regions (環跳 GB30 and ' +
      '承扶 BL36 to hip & thigh, 風府 GV16 to the head), which also means the ' +
      'region carries no Gallbladder point at all; the Small Intestine was ' +
      'omitted though 肩外俞 SI14 and 肩中俞 SI15 are here; the twelve back-shu ' +
      'points were never presented as a set although all twelve are in this ' +
      'region and nowhere else; 八髎 was counted bilaterally against a dataset ' +
      'that stores bilateral points once; and five of seven review pairs were ' +
      'misattributed. Three app features were named that do not exist. The ' +
      'five mu-shu pairings the draft asserts were checked and are correct. ' +
      'See the notes on this day in curriculum.ts. Point locations come from ' +
      'the acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day25_2026_08',
    title: '第 25 天 內容編審工作表 · Day 25 content review worksheet',
    reference: 'content-review/worksheet-day25-2026-08-12.md',
    editionOrVersion: '2026-08-12',
    locator: '踝部及足部：內外踝與跟腱、六井穴、六原穴',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-12',
    notes:
      'Owner draft for the ankle and foot region lesson. Five items were ' +
      'corrected at ingest against the acupoint records: 三陰交 SP6 belongs to ' +
      'knee & lower leg, three bone-cun segments were misattributed to the ' +
      'foot (13 寸 and 16 寸 are lower-leg measures, and a 4-寸 foot length is ' +
      'anchored nowhere), a quiz built on one of those wrong premises also ' +
      'subtracted where it should have added, four of six review pairs named ' +
      'points of this region or of Day 24, and 至陰 was called the most distal ' +
      'point on the leg. Six app features were named that do not exist. See ' +
      'the notes on this day in curriculum.ts. Point locations come from the ' +
      'acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day24_2026_08',
    title: '第 24 天 內容編審工作表 · Day 24 content review worksheet',
    reference: 'content-review/worksheet-day24-2026-08-12.md',
    editionOrVersion: '2026-08-12',
    locator: '髖胯及大腿：四個面、四條經、四把尺',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-12',
    notes:
      'Owner draft for the hip and thigh region lesson. Five items were ' +
      'corrected at ingest against the acupoint records: 急脈 LR12 belongs to ' +
      'abdomen & groin, five of the region\'s own points were omitted (中瀆 ' +
      'GB32, 居髎 GB29 and all three Liver points), 箕門 was located by a ' +
      'descriptor its record does not use, the lateral thigh was given as 14 ' +
      '寸 where this project and the standard use 19, and the medial segment ' +
      'was measured from the wrong landmark. Six app features were named that ' +
      'do not exist. See the notes on this day in curriculum.ts. Point ' +
      'locations come from the acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day23_2026_08',
    title: '第 23 天 內容編審工作表 · Day 23 content review worksheet',
    reference: 'content-review/worksheet-day23-2026-08-11.md',
    editionOrVersion: '2026-08-11',
    locator: '頸部：喉結、胸鎖乳突肌前後緣',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-11',
    notes:
      'Owner draft for the neck region lesson. Six items were corrected at ' +
      'ingest against the acupoint records: two point codes were off by one ' +
      '(天窗 is SI16 not SI15, 天容 is SI17 not SI16 — SI15 is 肩中俞, on the ' +
      'back), two cited points belong to other regions, the channel list named ' +
      'two channels the region does not carry while omitting one it does, ' +
      '扶突 was put on the wrong border of the sternocleidomastoid, 天鼎 LI17 ' +
      'was omitted, and two bone-cun figures were asserted that nothing anchors. ' +
      'See the notes on this day in curriculum.ts. Point locations come from ' +
      'the acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day22_2026_08',
    title: '第 22 天 內容編審工作表 · Day 22 content review worksheet',
    reference: 'content-review/worksheet-day22-2026-08-11.md',
    editionOrVersion: '2026-08-11',
    locator: '面部：瞳孔縱線、正中線與耳周',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-11',
    notes:
      'Owner draft for the face region lesson — the first draft in this series ' +
      'to arrive scoped to a single region. Five items were corrected at ' +
      'ingest against the acupoint records: the channel list named six of ' +
      'eight, the six midline points were omitted entirely, 攢竹 was placed at ' +
      'the supraorbital foramen rather than the notch its record names, 地倉 ' +
      'was placed in the nasolabial groove, and a 0.5 寸 gap was asserted that ' +
      'no record carries. Six app features were named that do not exist. See ' +
      'the notes on this day in curriculum.ts. Point locations come from the ' +
      'acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day21_2026_08',
    title: '第 21 天 內容編審工作表 · Day 21 content review worksheet',
    reference: 'content-review/worksheet-day21-2026-08-11.md',
    editionOrVersion: '2026-08-11',
    locator: '頭部：髮際、枕外隆凸與頭皮三條經線',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-11',
    notes:
      'Owner draft titled 頭頸部, covering the head, face and neck together. ' +
      'Under the thirteen-region contract those are three separate lessons, so ' +
      'this day was ingested as the head alone and the face and neck points ' +
      'carried forward to their own days. Also corrected at ingest: two extra ' +
      'points (四神聰 EX-HN1, 太陽 EX-HN5) that this dataset does not load, the ' +
      'lateral distance of the Gallbladder scalp line, and a spaced-review ' +
      'block attributing four pairs to days that taught other regions. See the ' +
      'notes on this day in curriculum.ts. Point locations come from the ' +
      'acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day20_2026_08',
    title: '第 20 天 內容編審工作表 · Day 20 content review worksheet',
    reference: 'content-review/worksheet-day20-2026-08-11.md',
    editionOrVersion: '2026-08-11',
    locator: '膝部及小腿：膕橫紋、腓骨頭、腓腸肌',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-11',
    notes:
      'Owner draft for the knee and lower leg region lesson, supplied free of ' +
      'the pain and neurological language the region usually carries. Five ' +
      'items were corrected at ingest against the acupoint records: three of ' +
      'the cited points belong to other regions, the channel list named four of ' +
      'six, two of the region\'s own points were filed as spaced review, the ' +
      'whole review block was misattributed to days that taught other material, ' +
      'and one functional claim survived on 筋會. Six app features were named ' +
      'that do not exist, including a 3D model. See the notes on this day in ' +
      'curriculum.ts. Point locations come from the acupoint records, NOT from ' +
      'this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day19_2026_08',
    title: '第 19 天 內容編審工作表 · Day 19 content review worksheet',
    reference: 'content-review/worksheet-day19-2026-08-11.md',
    editionOrVersion: '2026-08-11',
    locator: '身側及帶脈：肋端、髂前上棘與帶脈的橫向走行',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-11',
    notes:
      'Owner draft for the flank region lesson. Six items were corrected at ' +
      'ingest against the acupoint records: three of the ten headline points ' +
      'belong to other regions, 大包 SP21 was omitted although it is in this ' +
      'one, the channel list named an extraordinary vessel this dataset does ' +
      'not load while omitting the Spleen, 維道 was equated with the level of ' +
      '中極, the anterior superior iliac spine was placed at L4, and three app ' +
      'features were named that do not exist. See the notes on this day in ' +
      'curriculum.ts. Point locations come from the acupoint records, NOT from ' +
      'this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day18_2026_08',
    title: '第 18 天 內容編審工作表 · Day 18 content review worksheet',
    reference: 'content-review/worksheet-day18-2026-08-11.md',
    editionOrVersion: '2026-08-11',
    locator: '腹部及腹股溝：臍為原點的縱軸、旁開距離的橫軸',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-11',
    notes:
      'Owner draft for the abdomen and groin region lesson, carrying forward the ' +
      'Kidney channel ruling made for Day 17 (chest 2 寸, abdomen 0.5 寸). Six ' +
      'items were corrected at ingest against the acupoint records: 商曲 KI17 ' +
      'given the wrong level, 日月 GB24 placed on the costal arch, an incomplete ' +
      'channel list, rectus-abdominis borders that no record states and that ' +
      'contradicted each other, an unsupported 肋弓 bone-cun figure, and a ' +
      'Pythagorean distance exercise. See the notes on this day in curriculum.ts. ' +
      'Point locations come from the acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day17_2026_08',
    title: '第 17 天 內容編審工作表 · Day 17 content review worksheet (final clean)',
    reference: 'content-review/worksheet-day17-2026-08-11.md',
    editionOrVersion: '2026-08-11 (final clean)',
    locator: '胸部：肋間隙為縱軸、旁開距離為橫軸的定位網格',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-11',
    notes:
      'Third revision of the Day 17 draft. The first spanned four regions and ' +
      'was returned; the owner then split it to the thorax alone and ruled on ' +
      'the Kidney channel\'s chest offset (2 寸, per GB/T 12346-2021 and WHO ' +
      'SPAL) — a ruling that corrected six acupoint records and one Day 6 quiz ' +
      'item. This revision fixed six further errors raised in review. Four more ' +
      'were corrected at ingest against the records: the 俞府–彧中 gap, an ' +
      'incomplete channel list, the Spleen channel\'s span, and a needling ' +
      'contraindication on 乳中. Point locations come from the acupoint records, ' +
      'NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day16_2026_08',
    title: '第 16 天 內容編審工作表 · Day 16 content review worksheet',
    reference: 'content-review/worksheet-day16-2026-08-10.md',
    editionOrVersion: '2026-08-10',
    locator: '肩部及上臂：肩峰、肩胛岡、腋紋頭、三角肌',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-10',
    notes:
      'Owner draft for the shoulder and upper arm region lesson, supplied already ' +
      'free of the indications and needling cautions the earlier drafts carried. ' +
      'One channel misattribution, one region misstatement, one superseded location ' +
      'descriptor and an incomplete channel list were corrected at ingest against the ' +
      'acupoint records; three instructions to use app features that do not exist ' +
      'were rewritten. See the notes on this day in curriculum.ts. Point locations ' +
      'come from the acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day15_2026_08',
    title: '第 15 天 內容編審工作表 · Day 15 content review worksheet (revised)',
    reference: 'content-review/worksheet-day15-revised-2026-08-10.md',
    editionOrVersion: '2026-08-10 (修正版)',
    locator: '肘部及前臂：肘橫紋、尺橈骨間隙、兩筋之間、前臂 12 寸',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-10',
    notes:
      'Owner draft for the elbow and forearm region lesson. The owner had already ' +
      'removed six efficacy claims (曲池調腸胃, 尺澤治肺癰, 支溝便秘要穴, 郄門急性心痛/癲癇) ' +
      'and one needling term (反關穴). Four anatomical errors and four references to ' +
      'app features that do not exist were corrected at ingest against the acupoint ' +
      'records and the actual UI — see the notes on this day in curriculum.ts. Point ' +
      'locations come from the acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day14_2026_08',
    title: '第 14 天 內容編審工作表 · Day 14 content review worksheet (final clean version)',
    reference: 'content-review/worksheet-day14-final-2026-08-10.md',
    editionOrVersion: '2026-08-10 (final clean version)',
    locator: '腕部及手部：赤白肉際、腕橫紋、六經在手部的分佈',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-10',
    notes:
      'Third revision of the Day 14 draft, supplied after two review rounds. The owner removed ' +
      'the bleeding/first-aid framing, four symptom→point drills and an efficacy superlative; ' +
      'corrected 尺骨鷹嘴 to a wrist landmark; removed 陷谷 (a foot point) from a hand list; ' +
      'rewrote the six-channel mnemonic after two failed attempts placed 腎經/胃經 and then 少陰 ' +
      'on the hand’s outer aspect; replaced a same-channel 原郄 pair with 神門 HT7 ↔ 腕骨 SI4 to ' +
      'match the 原↔原 pattern of the other two; changed 捏掐 to 對按; and dropped 太衝 and 八邪 ' +
      'as out of region. Five further details still disagreed with the reviewed 定位 records and ' +
      'were corrected against them at ingest — see the notes on this day in curriculum.ts. ' +
      'Point locations themselves come from the acupoint records, NOT from this worksheet.',
  },
  {
    id: 'src_owner_worksheet_day4_2026_08',
    title: '第 4 天 內容編審工作表 · Day 4 content review worksheet (filled)',
    reference: 'content-review/worksheet-day4-filled-2026-08-07.md',
    editionOrVersion: '2026-08-07',
    locator: 'SI 19 穴、BL 67 穴',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner, citing the standards below',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-07',
    notes:
      'Owner-filled locations, classifications and name-etymology cues for the Small Intestine and Bladder channels, each attributed in the worksheet to GB/T 12346-2021, WHO Standard Acupuncture Point Locations (2008), 《針灸學》4th ed., 《針灸穴位圖解》2nd ed., 《靈樞·經脈》 and 《針灸甲乙經》. Clinical tails in the worksheet cues (indications, point combinations) were deliberately NOT ingested.',
  },
  {
    id: 'src_owner_worksheet_day6_2026_08',
    title: '第 6 天 內容編審工作表 · Day 6 (KI) review worksheet, filled',
    reference: 'content-review/worksheet-day6-filled-2026-08-07.md',
    editionOrVersion: '2026-08-07',
    locator: 'KI 27 穴',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner, citing the standards below',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-07',
    notes:
      'The owner\'s Day 6 pass over the Kidney channel, citing GB/T 12346-2006, WHO Western Pacific 1989, 《靈樞·經脈》/《靈樞·本輸》, 《難經》 and 《針灸甲乙經》. Written clinical-free, so no safety filtering was required. The sheet also lists four open items for expert review, recorded on the affected records rather than silently resolved.',
  },
  {
    id: 'src_gbt_12346_2006',
    title: 'GB/T 12346-2006《腧穴名稱與定位》 Nomenclature and location of acupuncture points',
    reference: 'GB/T 12346-2006',
    editionOrVersion: '2006',
    locator: null,
    sourceType: 'official_standard',
    jurisdictionOrTradition: 'People\'s Republic of China national standard',
    reuseStatus: 'publicly_accessible_restricted',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-07',
    notes:
      'The edition the Day 6 worksheet cites. Registered separately from the 2021 edition rather than conflated with it: Days 1–4 were reviewed against GB/T 12346-2021, Day 6 against the 2006 text, and a reconciliation between the two editions is still outstanding.',
  },
  {
    id: 'src_who_nomenclature_1989',
    title: 'WHO Standard Acupuncture Nomenclature (Western Pacific Region)',
    reference: 'WHO Standard Acupuncture Nomenclature (1989)',
    editionOrVersion: '1989',
    locator: null,
    sourceType: 'official_standard',
    jurisdictionOrTradition: 'WHO Western Pacific Region',
    reuseStatus: 'publicly_accessible_restricted',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-07',
    notes:
      'Cited by the Day 6 worksheet for English point-name renderings. It gives several Kidney points as pinyin (Jiaoxin, Zhubin, Yuzhong…); this project uses the literal translation and carries the pinyin form as an alias, recorded per point.',
  },
  {
    id: 'src_owner_worksheet_day7_2026_08',
    title: '第 7 天 內容編審工作表 · Day 7 (PC + TE) review worksheet, filled',
    reference: 'content-review/worksheet-day7-filled-2026-08-07.md',
    editionOrVersion: '2026-08-07',
    locator: 'PC 9 穴、TE 23 穴',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner, citing the standards below',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-07',
    notes:
      'The owner\'s Day 7 pass over the Pericardium and Triple Energizer channels, citing GB/T 12346-2006, WHO Western Pacific 1989, 《靈樞·經脈》/《靈樞·本輸》, 《難經·二十九難》 and 《針灸甲乙經》. Written clinical-free, so no safety filtering was required. Its five open items are recorded on the affected records rather than resolved silently.',
  },
  {
    id: 'src_owner_worksheet_day8_2026_08',
    title: '第 8 天 內容編審工作表 · Day 8 (GB) review worksheet, filled',
    reference: 'content-review/worksheet-day8-filled-2026-08-07.md',
    editionOrVersion: '2026-08-07',
    locator: 'GB 44 穴',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner, citing the standards below',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-07',
    notes:
      'The owner\'s Day 8 pass over the Gallbladder channel, citing GB/T 12346-2006, WHO Western Pacific 1989, 《針灸甲乙經》, 《脈經》, 《難經》 and 《素問·氣府論》王冰注. SAFETY FILTER APPLIED: five entries carried clinical content — indications on GB8, GB15, GB30 and GB37, and a pregnancy contraindication on GB21 — all removed on import, with the exclusion recorded on each affected record. The worksheet itself flagged the GB21 note for removal.',
  },
  {
    id: 'src_owner_worksheet_day9_2026_08',
    title: '第 9 天 內容編審工作表 · Day 9 (LR) review worksheet, filled',
    reference: 'content-review/worksheet-day9-filled-2026-08-08.md',
    editionOrVersion: '2026-08-08',
    locator: 'LR 14 穴',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner, citing the standards below',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-08',
    notes:
      'The owner\'s Day 9 pass over the Liver channel, completing the twelve regular channels. Cites GB/T 12346-2006, WHO Western Pacific 1989, 《靈樞·經脈》, 《難經·四十五難》 and 《針灸甲乙經》. Written clinical-free, so no content filtering was required; one UI suggestion (an artery-proximity badge on 急脈 LR12) was declined and the reason recorded on that point.',
  },
  {
    id: 'src_owner_worksheet_day10_2026_08',
    title: '第 10 天 內容編審工作表 · Day 10 (CV + GV) review worksheet, filled',
    reference: 'content-review/worksheet-day10-filled-2026-08-08.md',
    editionOrVersion: '2026-08-08',
    locator: 'CV 24 穴、GV 29 穴',
    sourceType: 'user_curriculum',
    jurisdictionOrTradition: 'Project editorial pass by the owner, citing the standards below',
    reuseStatus: 'unknown',
    reviewStatus: 'source_checked',
    reviewer: 'project owner',
    reviewDate: '2026-08-08',
    notes:
      'The owner\'s Day 10 pass over the two midline vessels, completing all fourteen channels. Cites GB/T 12346-2006 clause by clause, WHO Standard Acupuncture Nomenclature 2nd ed. 1993, 《素問·骨空論》, 《針灸甲乙經》 and 《醫宗金鑑》. Adopts the GB/T 29-point Governor set including 印堂 GV29; the WHO 28-point alternative is recorded on that record. SAFETY FILTER APPLIED: ten entries carried clinical content — tonification and therapeutic-action claims on CV4, CV6, GV1, GV4, GV12 and GV25, a needling contraindication on CV5, indications on GV8 and GV15, and first-aid framing with named emergencies on GV26 — all removed on import, with the exclusion recorded on each affected record.',
  },
];

export const sourceById = new Map(sources.map((s) => [s.id, s]));