import type { CurriculumDay, Flashcard, QuizItem } from './types';

const HANDBOOK = 'src_handbook_docx';
const OUTLINE = 'src_outline_md';
const WORKSHEET3 = 'src_owner_worksheet_day3_2026_08';
const WORKSHEET4 = 'src_owner_worksheet_day4_2026_08';
const WORKSHEET6 = 'src_owner_worksheet_day6_2026_08';
const WORKSHEET7 = 'src_owner_worksheet_day7_2026_08';
const WORKSHEET8 = 'src_owner_worksheet_day8_2026_08';
const WORKSHEET9 = 'src_owner_worksheet_day9_2026_08';
const WORKSHEET10 = 'src_owner_worksheet_day10_2026_08';
const WORKSHEET14 = 'src_owner_worksheet_day14_2026_08';
const WORKSHEET15 = 'src_owner_worksheet_day15_2026_08';
const WORKSHEET16 = 'src_owner_worksheet_day16_2026_08';
const WORKSHEET17 = 'src_owner_worksheet_day17_2026_08';
const WORKSHEET18 = 'src_owner_worksheet_day18_2026_08';
const WORKSHEET19 = 'src_owner_worksheet_day19_2026_08';
const WORKSHEET20 = 'src_owner_worksheet_day20_2026_08';
const WORKSHEET21 = 'src_owner_worksheet_day21_2026_08';
const WORKSHEET22 = 'src_owner_worksheet_day22_2026_08';
const WORKSHEET23 = 'src_owner_worksheet_day23_2026_08';
const WORKSHEET24 = 'src_owner_worksheet_day24_2026_08';
const WORKSHEET25 = 'src_owner_worksheet_day25_2026_08';
const WORKSHEET26 = 'src_owner_worksheet_day26_2026_08';
const ZIWU = 'src_ziwu_liuzhu';
const WORKSHEET_ZIWU = 'src_owner_worksheet_ziwu_2026_08';
const LINGSHU = 'src_lingshu';

/**
 * Day 1 curriculum, restated for the product.
 *
 * The handbook's Day 1 也 contains symptom→point drills (「牙痛 → 合谷」),
 * first-aid framing and one invasive technique (放血). Those are NOT reproduced.
 * Every recall prompt here targets route order, location landmarks, meridian
 * attribution, point classification or mnemonic structure instead.
 */
export const curriculumDays: CurriculumDay[] = [
  {
    id: 'day_1',
    dayNumber: 1,
    titleZhHant: '手太陰肺經 & 手陽明大腸經（表裡經）',
    titleEn: 'Lung & Large Intestine meridians (an interior–exterior pair)',
    hookZhHant: '地鐵開通第一條線，先搞定「太陰與陽明」。',
    hookEn: 'Opening the first line on the network: start with Taiyin and Yangming.',
    meridianIds: ['mer_lu', 'mer_li'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
    sections: [
      {
        id: 'sec_1_learn',
        kind: 'learn',
        titleZhHant: '【學】今天的兩條線',
        titleEn: 'Learn — today’s two lines',
        sourceIds: [HANDBOOK, OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '肺經共 11 穴，從胸部出發，沿手臂內側前緣走到拇指。大腸經共 20 穴，從食指出發，沿手臂外側前緣上行，經肩頸到鼻翼旁。',
            en: 'The Lung meridian has 11 points and runs from the chest down the anterior-medial arm to the thumb. The Large Intestine meridian has 20 points and runs from the index finger up the anterior-lateral arm, across the shoulder and neck, to beside the nose.',
          },
          {
            zhHant:
              '兩經互為表裡：一條在手臂內側，一條在外側，方向相反。先記「起點與終點」，再記中間站。',
            en: 'They form an interior–exterior pair: one on the inner arm, one on the outer, running in opposite directions. Fix the two endpoints first, then fill in the stations between them.',
          },
          {
            zhHant:
              '今天先建立骨架：兩條路線的方向、四個端點（中府／少商／商陽／迎香），以及四個重點穴（尺澤、列缺、太淵、合谷、曲池）。',
            en: 'Today builds the skeleton: two route directions, four endpoints (中府 / 少商 / 商陽 / 迎香), and a handful of anchor points (尺澤, 列缺, 太淵, 合谷, 曲池).',
          },
        ],
      },
      {
        id: 'sec_1_do',
        kind: 'do',
        titleZhHant: '【做】在身體上畫線',
        titleEn: 'Do — trace it on your own arm',
        sourceIds: [HANDBOOK, OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '用手指（或可洗掉的筆）沿手臂內側前緣，從胸口畫到拇指；再沿外側前緣，從食指畫到鼻翼旁。空間記憶是最強的硬碟。',
            en: 'With a fingertip (or a washable pen) trace the inner-front line of your arm from chest to thumb, then the outer-front line from index finger to beside the nose. Spatial memory is the strongest drive you own.',
          },
          {
            zhHant:
              '閉上眼睛，用另一隻手找出虎口的凹陷（合谷）與腕橫紋（太淵一帶）。目標是「找得到地標」，不是按壓治療。',
            en: 'With your eyes closed, find the hollow in the web of your thumb (合谷) and the wrist crease (around 太淵). The goal is landmark recognition — this is surface learning, not treatment.',
          },
        ],
      },
      {
        id: 'sec_1_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — mnemonics out loud',
        sourceIds: [HANDBOOK, OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '四總穴歌：「肚腹三里留，腰背委中求，頭項尋列缺，面口合谷收。」今天只有後兩句的穴位已載入。',
            en: 'The Four Command Points song binds four body regions to four points. Only the two points in the last two lines (列缺, 合谷) are loaded in this Day 1 dataset.',
          },
          {
            zhHant: '穴名就是 GPS：雲門＝雲氣出入之門；尺澤＝肘窩的水澤；合谷＝虎口的山谷；迎香＝迎接香味，在鼻子旁。',
            en: 'Point names are their own GPS: Cloud Gate, Cubit Marsh, Union Valley, Welcome Fragrance — each name pictures the landmark it sits on.',
          },
        ],
      },
      {
        id: 'sec_1_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [HANDBOOK],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是手太陰肺經，從胸部出發，沿手臂內側前緣走到拇指，共 11 站。我的表裡經是大腸經，它從食指出發，沿外側前緣上行，共 20 站，終點在鼻翼旁。」說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute in your own voice: where each channel starts, which border of the arm it runs along, how many stations it has, and where it ends. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_1_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [HANDBOOK, OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '① 在圖上依序點出肺經與大腸經的起點與終點。② 說出合谷、列缺的定位描述。③ 說出太淵的特定穴屬性。',
            en: '① Point out the start and end of each meridian in order. ② Describe where 合谷 and 列缺 sit. ③ Name the specific-point categories of 太淵.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_2',
    dayNumber: 2,
    titleZhHant: '足陽明胃經（穴位最多的陽經）',
    titleEn: 'Stomach meridian (the yang channel with the most points)',
    hookZhHant: '把人體當街道，胃經就是繁華的忠孝東路：從臉走到腳，45 站。',
    hookEn: 'Treat the body as a city: the Stomach channel is its busiest avenue — 45 stations from the face to the foot.',
    meridianIds: ['mer_st'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
    sections: [
      {
        id: 'sec_2_learn',
        kind: 'learn',
        titleZhHant: '【學】45 站的一條線',
        titleEn: 'Learn — one line, 45 stations',
        sourceIds: [HANDBOOK, OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '胃經共 45 穴：起於眼下（承泣），繞行面部，下經頸前，沿胸旁開四寸、腹旁開二寸下行，經腿前側到足第二趾（厲兌）。',
            en: 'The Stomach meridian has 45 points: it starts below the eye (承泣), loops the face, descends the front of the neck, runs down the chest 4 cun and the abdomen 2 cun from the midline, and follows the front of the leg to the second toe (厲兌).',
          },
          {
            zhHant:
              '四個必背：四白、天樞、足三里、內庭。七個重要：承泣、地倉、頰車、下關、梁門、上巨虛、豐隆。',
            en: 'Four must-know points: 四白, 天樞, 足三里, 內庭. Seven important ones: 承泣, 地倉, 頰車, 下關, 梁門, 上巨虛, 豐隆.',
          },
          {
            zhHant:
              '特定穴嵌入：足三里是胃經合穴，豐隆是胃經絡穴，天樞是大腸募穴。今天先把這三個身分記住。',
            en: 'Specific-point categories to fix today: 足三里 is the he-sea point, 豐隆 the luo-connecting point, and 天樞 the front-mu point of the Large Intestine.',
          },
        ],
      },
      {
        id: 'sec_2_do',
        kind: 'do',
        titleZhHant: '【做】臉、腹、腿三段實作',
        titleEn: 'Do — face, abdomen, leg',
        sourceIds: [HANDBOOK, OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '在臉上標出四白（瞳孔直下眶下孔）、地倉（口角旁）、頰車（咬牙時肌肉隆起處）；在腹部標出天樞（臍旁開 2 寸）。',
            en: 'On the face, mark 四白 (below the pupil at the infraorbital foramen), 地倉 (beside the mouth corner) and 頰車 (where the masseter bulges when you clench); on the abdomen, mark 天樞 (2 cun beside the navel).',
          },
          {
            zhHant:
              '在小腿沿足三里到上巨虛這一段反覆按壓，感受肌肉縫隙。目標是「認得地標」，不是按壓治療。',
            en: 'On the lower leg, press repeatedly along the stretch from 足三里 to 上巨虛 and feel the muscle groove. The goal is landmark recognition — surface learning, not treatment.',
          },
        ],
      },
      {
        id: 'sec_2_say',
        kind: 'say',
        titleZhHant: '【說】路線口訣',
        titleEn: 'Say — the route rhyme',
        sourceIds: [HANDBOOK, OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant: '胃經路線口訣：「臉部繞行胸四寸，腹部旁開二寸行，腿前正中到次趾。」',
            en: 'The route rhyme: face loop — chest at four cun — abdomen at two — down the front of the leg to the second toe.',
          },
          {
            zhHant:
              '四總穴歌的第一句在今天解鎖：「肚腹三里留」。這是區域與穴位的記憶配對，不是治療建議。',
            en: 'Today unlocks the first line of the Four Command Points song: 肚腹三里留 (belly — 足三里). A memorisation pairing, not treatment guidance.',
          },
          {
            zhHant: '募穴聯想：天樞是肚臍旁的「大腸情報站」，旁開 2 寸就是它的門牌號。',
            en: 'Mu-point image: 天樞 as the Large-Intestine dispatch office beside the navel — 2 cun out is its street number.',
          },
        ],
      },
      {
        id: 'sec_2_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [HANDBOOK],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是足陽明胃經，從眼睛下面出發，繞臉一圈，沿胸旁開四寸、腹旁開二寸往下走，經大腿前側、小腿前外側，到足第二趾，共 45 站。我的合穴是足三里，絡穴是豐隆，天樞是大腸的募穴。」卡住的地方就是還沒學會的地方。',
            en: 'Record one minute: where the channel starts, how it loops the face, the two lateral distances on the trunk, the leg segment, the terminus, and which points carry the he-sea, luo-connecting and front-mu categories. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_2_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [HANDBOOK, OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '① 在圖上沿線點出胃經全程（臉→胸→腹→腿前→足二趾）。② 說出足三里、天樞、四白的定位描述。③ 說出足三里與豐隆的特定穴屬性。',
            en: '① Trace the whole Stomach route on the atlas (face → chest → abdomen → front of leg → second toe). ② Describe the locations of 足三里, 天樞 and 四白. ③ Name the specific-point categories of 足三里 and 豐隆.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_3',
    dayNumber: 3,
    titleZhHant: '足太陰脾經 & 手少陰心經',
    titleEn: 'Spleen & Heart meridians',
    hookZhHant: '兩條陰經：一條從大趾走到胸脅，一條從腋窩走到小指。',
    hookEn: 'Two yin channels: one runs from the great toe to the flank, the other from the armpit to the little finger.',
    meridianIds: ['mer_sp', 'mer_ht'],
    sourceIds: [WORKSHEET3, LINGSHU],
    reviewStatus: 'source_checked',
    sections: [
      {
        id: 'sec_3_learn',
        kind: 'learn',
        titleZhHant: '【學】今天的兩條線',
        titleEn: 'Learn — today’s two lines',
        sourceIds: [WORKSHEET3, LINGSHU],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '脾經共 21 穴，起於大趾內側（隱白），沿足內側緣、小腿內側脛骨後緣上行，經大腿內側前緣進入腹部，最後到胸脅（大包）。它與胃經互為表裡。',
            en: 'The Spleen meridian has 21 points. It starts at the inner great toe (隱白 SP1), runs up the medial border of the foot and the medial lower leg behind the tibia, crosses the antero-medial thigh into the abdomen, and ends on the flank (大包 SP21). It is the interior–exterior pair of the Stomach channel.',
          },
          {
            zhHant:
              '心經共 9 穴，體表從腋窩中央（極泉）出發，沿上臂內側後緣下行，過肘內（少海）、前臂內側，到腕橫紋尺側（神門），入掌後止於小指橈側（少沖）。',
            en: 'The Heart meridian has 9 points. On the surface it begins at the centre of the axilla (極泉 HT1), descends the postero-medial upper arm past the inner elbow (少海 HT3) and forearm to the ulnar end of the wrist crease (神門 HT7), then crosses the palm to end at the little finger (少沖 HT9).',
          },
          {
            zhHant:
              '今天的骨架：脾經記「內踝上三寸的三陰交」與「膝內上方的血海」；心經記腕上 1.5、1、0.5 寸依序排列的靈道、通里、陰郄，以及腕橫紋上的神門。',
            en: 'Today’s skeleton: on the Spleen line fix 三陰交 SP6 (3 cun above the inner ankle) and 血海 SP10 (above the inner knee); on the Heart line fix the 1.5 / 1 / 0.5 cun ladder of 靈道, 通里, 陰郄 above 神門 at the wrist crease.',
          },
        ],
      },
      {
        id: 'sec_3_do',
        kind: 'do',
        titleZhHant: '【做】在身體上找地標',
        titleEn: 'Do — find the landmarks',
        sourceIds: [WORKSHEET3],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '沿小腿內側，從內踝尖往上量三橫指找三陰交，再往上摸到脛骨內側髁下方的凹陷（陰陵泉）。目標是「認得地標」，不是按壓治療。',
            en: 'On the inner lower leg, measure three finger-widths up from the tip of the inner ankle bone for 三陰交, then feel up to the hollow below the inner knee for 陰陵泉. The goal is landmark recognition — this is surface learning, not treatment.',
          },
          {
            zhHant:
              '手掌朝上，沿腕橫紋往尺側（小指側）摸到尺側腕屈肌腱旁的凹陷，那裡是神門；再握拳，小指尖落在掌面的位置就是少府。',
            en: 'Turn the palm up and slide along the wrist crease toward the little-finger side until you feel the hollow beside the tendon — that is 神門. Then make a fist: where the little fingertip lands on the palm is 少府.',
          },
        ],
      },
      {
        id: 'sec_3_say',
        kind: 'say',
        titleZhHant: '【說】穴名就是地標',
        titleEn: 'Say — the names are the landmarks',
        sourceIds: [WORKSHEET3],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '三陰交＝脾、腎、肝三條足陰經的交會；「三」同時提醒內踝尖上 3 寸。陰陵泉＝「陵」是脛骨內側髁，「泉」是其下的凹陷。',
            en: 'Three Yin Intersection: where the Spleen, Kidney and Liver channels meet — and “three” also gives you the 3-cun height. Yin Mound Spring: the “mound” is the inner knee bone, the “spring” the hollow beneath it.',
          },
          {
            zhHant:
              '心經腕部三穴的順序口訣：靈道 1.5 寸、通里 1 寸、陰郄 0.5 寸，越往下越靠近神門。',
            en: 'The Heart wrist ladder, in order: 靈道 at 1.5 cun, 通里 at 1, 陰郄 at 0.5 — each step closer to 神門 at the crease.',
          },
        ],
      },
      {
        id: 'sec_3_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [WORKSHEET3],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '錄一分鐘：兩條經各從哪裡開始、走身體的哪一側、共幾站、終點在哪，以及三陰交、神門各是什麼特定穴。說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute: where each channel starts, which aspect of the limb it follows, how many stations it has, where it ends, and which specific-point categories 三陰交 and 神門 carry. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_3_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET3],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '① 在圖上依序點出脾經與心經的起點與終點。② 說出三陰交、陰陵泉、神門的定位描述。③ 說出太白、神門的特定穴屬性。',
            en: '① Point out the start and end of each channel in order. ② Describe where 三陰交, 陰陵泉 and 神門 sit. ③ Name the specific-point categories of 太白 and 神門.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_4',
    dayNumber: 4,
    titleZhHant: '手太陽小腸經 & 足太陽膀胱經',
    titleEn: 'Small Intestine & Bladder meridians',
    hookZhHant: '今天第一次翻到背面：背俞穴全部照椎骨數，數對椎體就找對穴。',
    hookEn: 'Today the atlas turns around. The back-shu points are counted off the vertebrae — get the vertebral level right and the point follows.',
    meridianIds: ['mer_si', 'mer_bl'],
    sourceIds: [WORKSHEET4, LINGSHU],
    reviewStatus: 'source_checked',
    sections: [
      {
        id: 'sec_4_learn',
        kind: 'learn',
        titleZhHant: '【學】今天的兩條線',
        titleEn: 'Learn — today’s two lines',
        sourceIds: [WORKSHEET4, LINGSHU],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '小腸經共 19 穴，起於小指尺側端（少澤），沿手掌與前臂尺側上行，從尺骨鷹嘴與肱骨內上髁之間穿出（小海），上肩後繞行肩胛（肩貞到肩中俞），再上行至頸側、面頰，止於耳前（聽宮）。它與心經互為表裡。',
            en: 'The Small Intestine meridian has 19 points. It starts at the ulnar tip of the little finger (少澤 SI1), runs up the ulnar edge of the hand and forearm, emerges between the olecranon and the medial epicondyle (小海 SI8), then circles the scapula (SI9–SI15) before climbing the neck and cheek to end in front of the ear (聽宮 SI19). It is the interior–exterior pair of the Heart channel.',
          },
          {
            zhHant:
              '膀胱經共 67 穴，是十四經中最長的一條。起於目內眥（睛明），上額過頭頂，下項後沿背部脊柱兩側下行，經腰、骶、臀、大腿後側到膕窩（委中），再沿小腿後側、外踝後方（崑崙）、足外側緣，止於小趾外側（至陰）。',
            en: 'The Bladder meridian has 67 points — the longest of the fourteen channels. It begins at the inner canthus (睛明 BL1), crosses the forehead and vertex, descends the nape and runs down the back on both sides of the spine, through the low back, sacrum, buttock and back of the thigh to the popliteal crease (委中 BL40), then down the calf, behind the outer ankle (崑崙 BL60) and along the lateral foot to the little toe (至陰 BL67).',
          },
          {
            zhHant:
              '今天的骨架是「兩條側線」：第一側線在棘突下旁開 1.5 寸，背俞穴（肺俞、心俞、膈俞、肝俞、脾俞、胃俞、腎俞…）都在這條線上；第二側線旁開 3 寸，膏肓、志室等在這條線上。編號並不是一路往下走完 —— BL11–BL40 走第一側線與下肢，BL41 又回到上背開始第二側線，BL55 才再接回小腿。',
            en: 'Today’s skeleton is two vertical lines. The first sits 1.5 cun lateral to the spinous processes and carries the back-shu points (肺俞, 心俞, 膈俞, 肝俞, 脾俞, 胃俞, 腎俞…). The second sits 3 cun lateral and carries 膏肓, 志室 and their neighbours. The numbering is deliberately not one downward walk: BL11–BL40 run the first line and the leg, BL41 returns to the upper back to start the second line, and BL55 rejoins the calf.',
          },
        ],
      },
      {
        id: 'sec_4_do',
        kind: 'do',
        titleZhHant: '【做】先數椎骨，再找側線',
        titleEn: 'Do — count vertebrae first, then find the line',
        sourceIds: [WORKSHEET4],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '低頭時頸後最突出的那一節是第 7 頸椎，往下第一節就是 T1。用它當起算點，往下數到 T3 就是肺俞的高度、T5 是心俞、T7 是膈俞。目標是「數得出椎體高度」，不是按壓治療。',
            en: 'Bow your head: the most prominent bump at the base of the neck is C7, and the next one down is T1. Counting from there, T3 gives the level of 肺俞, T5 心俞, T7 膈俞. The goal is counting vertebral levels — this is surface learning, not treatment.',
          },
          {
            zhHant:
              '兩個橫向定位地標：肚臍平第 2 腰椎（腎俞的高度），髂嵴最高點平第 4 腰椎（大腸俞的高度）。找到高度後，再往外量 1.5 寸（約兩橫指）就是第一側線。',
            en: 'Two cross-checks: the navel is level with L2 (the height of 腎俞), and the top of the iliac crest is level with L4 (the height of 大腸俞). Once you have the height, measure about two finger-widths (1.5 cun) laterally for the first line.',
          },
          {
            zhHant:
              '在圖上切換到「背面」視圖，沿脊柱兩側由上而下唸出第一側線的穴名，再切回正面確認小腸經的手臂段。',
            en: 'Switch the atlas to the Back view and read the first line down from the top, then switch back to Front to trace the Small Intestine arm segment.',
          },
        ],
      },
      {
        id: 'sec_4_say',
        kind: 'say',
        titleZhHant: '【說】背俞穴的名字就是臟腑',
        titleEn: 'Say — a back-shu point is named after its organ',
        sourceIds: [WORKSHEET4],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '背俞穴的命名規則最省力：臟腑名 ＋「俞」。肺俞、心俞、肝俞、膽俞、脾俞、胃俞、腎俞、大腸俞、小腸俞、膀胱俞 —— 記住椎體高度就等於記住整條線。',
            en: 'The back-shu naming rule does most of the work: organ name + 俞 (“shu”, transport). 肺俞, 心俞, 肝俞, 膽俞, 脾俞, 胃俞, 腎俞, 大腸俞, 小腸俞, 膀胱俞 — learn the vertebral levels and you have the whole line.',
          },
          {
            zhHant:
              '小腸經名字裡的地標：少澤在小指旁如小水澤；後溪在第 5 掌指關節後方的凹陷如溪；小海在肘尖與內上髁之間的凹陷；聽宮在耳屏前，張口成凹。',
            en: 'Landmarks hidden in the Small Intestine names: 少澤 is the small “marsh” beside the little finger; 後溪 the “stream” behind the fifth knuckle; 小海 the hollow between the elbow tip and the inner epicondyle; 聽宮 the “listening palace” in front of the ear tragus, which opens when the mouth opens.',
          },
        ],
      },
      {
        id: 'sec_4_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [WORKSHEET4],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '錄一分鐘：背部兩條側線各旁開幾寸、各承載哪些穴；由 T3 到 L2 依序唸出第一側線的背俞穴；並說明膀胱經的編號為什麼會在 BL41 回到上背。說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute: how far each back line sits from the midline and what each carries; recite the back-shu points on the first line from T3 to L2 in order; and explain why the Bladder numbering jumps back up to the upper back at BL41. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_4_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET4],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '① 在背面圖上依序點出肺俞、心俞、膈俞、肝俞、脾俞、腎俞。② 說出後溪、腕骨、小海的特定穴屬性。③ 說出膀胱經的起點、膕窩上的那一站與終點。',
            en: '① On the back view, tap 肺俞, 心俞, 膈俞, 肝俞, 脾俞 and 腎俞 in order. ② Name the specific-point categories of 後溪, 腕骨 and 小海. ③ Name the Bladder channel’s first point, its popliteal station and its terminus.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_5',
    dayNumber: 5,
    titleZhHant: '足太陽膀胱經（下）— 腿部與常用穴',
    titleEn: 'Bladder meridian, lower section — the leg and its landmark points',
    hookZhHant: '從腰骶到小趾，腿後側正中線。今天不加新經，只把昨天那條最長的線走完。',
    hookEn: 'From the sacrum to the little toe, straight down the back of the leg. No new channel today — just finishing the longest line you already have.',
    meridianIds: ['mer_bl'],
    sourceIds: [OUTLINE, HANDBOOK, WORKSHEET4],
    reviewStatus: 'source_checked',
    sections: [
      {
        id: 'sec_5_learn',
        kind: 'learn',
        titleZhHant: '【學】承扶到至陰',
        titleEn: 'Learn — 承扶 to 至陰',
        sourceIds: [OUTLINE, WORKSHEET4],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '第 4 天走的是背部兩條側線，今天接著往下走完同一條經：臀下橫紋中點的承扶（BL36）→ 大腿後側的殷門（BL37）→ 膕橫紋中點的委中（BL40）→ 小腿的承山（BL57）→ 外踝後方的崑崙（BL60）→ 足外側緣，止於小趾的至陰（BL67）。',
            en: 'Day 4 walked the two lines down the back; today continues the same channel to its end: 承扶 BL36 at the midpoint of the gluteal fold → 殷門 BL37 on the back of the thigh → 委中 BL40 at the midpoint of the popliteal crease → 承山 BL57 on the calf → 崑崙 BL60 behind the outer ankle → along the lateral border of the foot to 至陰 BL67 at the little toe.',
          },
          {
            zhHant:
              '這一段的骨度分寸：臀下橫紋到膕橫紋 14 寸（殷門在承扶下 6 寸），膕橫紋到外踝尖 16 寸（合陽下 2 寸、承筋下 5 寸、承山下 8 寸）。記住兩個端點，中間的站就能推出來。',
            en: 'The bone-cun for this segment: gluteal fold to popliteal crease is 14 cun (殷門 sits 6 below 承扶), popliteal crease to the tip of the lateral malleolus is 16 cun (合陽 2 below, 承筋 5 below, 承山 8 below 委中). Fix the two endpoints and the stations between them follow.',
          },
          {
            zhHant:
              '第二側線在腿上與第一側線會合：BL54 秩邊之後，編號回到小腿繼續往下。這就是為什麼膀胱經的號碼不是一路遞增——圖上也照這個分段畫。',
            en: 'The second back line rejoins the first in the leg: after 秩邊 BL54 the numbering returns to the calf and continues down. That is why the Bladder numbers are not one continuous descent — and why the atlas draws the channel in segments.',
          },
        ],
      },
      {
        id: 'sec_5_do',
        kind: 'do',
        titleZhHant: '【做】找委中與承山',
        titleEn: 'Do — find 委中 and 承山',
        sourceIds: [OUTLINE],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '膕窩橫紋的中點就是委中：屈膝時橫紋最明顯，兩側可以摸到股二頭肌腱與半腱肌腱，中間的凹陷即是。目標是「認得地標」，不是按壓治療。',
            en: 'The midpoint of the popliteal crease is 委中. Bend the knee to make the crease obvious; the tendons stand out on either side and the hollow between them is the point. The goal is landmark recognition — surface learning, not treatment.',
          },
          {
            zhHant:
              '墊起腳尖，小腿肚會出現一個人字形的分界，那個尖角下方的凹陷就是承山（膕橫紋下 8 寸）。放下腳跟後用手指標記同一個位置，確認自己找的是同一點。',
            en: 'Rise onto your toes: the calf forms an inverted-V where the two heads of the muscle part, and the hollow just below that apex is 承山, 8 cun below the popliteal crease. Lower the heel and mark the same spot with a finger to check you found the same place.',
          },
          {
            zhHant:
              '在圖上切換到「背面」，由承扶依序點到至陰；再點一次足部的放大鏡圖示，確認崑崙、僕參、申脈、京骨、束骨在足外側緣的先後次序。',
            en: 'Switch the atlas to the Back view and tap from 承扶 down to 至陰 in order, then open the foot detail view and check the order of 崑崙, 僕參, 申脈, 京骨 and 束骨 along the lateral border.',
          },
        ],
      },
      {
        id: 'sec_5_say',
        kind: 'say',
        titleZhHant: '【說】腰背委中求',
        titleEn: 'Say — 「腰背委中求」',
        sourceIds: [OUTLINE, HANDBOOK],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '四總穴歌到今天才湊齊：「肚腹三里留，腰背委中求，頭項尋列缺，面口合谷收。」四個區域各綁一個穴——足三里、委中、列缺、合谷，四條經分屬胃、膀胱、肺、大腸。',
            en: 'The Four Command Points song is only complete today: 「肚腹三里留，腰背委中求，頭項尋列缺，面口合谷收」— four regions, one point each: 足三里, 委中, 列缺, 合谷, on the Stomach, Bladder, Lung and Large Intestine channels respectively.',
          },
          {
            zhHant:
              '這一段的穴名多半就是地形：承扶「承」托、「扶」持，在臀下橫紋承住體重；殷門的「門」在大腿後側正中；承山如同承住小腿這座「山」的形狀；崑崙是外踝這座高處的山名。',
            en: 'Most names in this stretch are terrain: 承扶 "supporting and upholding" at the fold that bears the body\'s weight; 殷門 the "gate" on the midline at the back of the thigh; 承山 "supporting the mountain" under the calf\'s peak; 崑崙 a mountain name for the high point of the outer ankle.',
          },
        ],
      },
      {
        id: 'sec_5_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [OUTLINE],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '錄一分鐘：從承扶依序走到至陰，說出每一站在哪一個地標的幾寸處；再說明委中與承山各用哪一條橫紋當起算點。說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute: walk from 承扶 to 至陰 in order, naming the landmark and cun distance for each station, then say which crease 委中 and 承山 are each measured from. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_5_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [OUTLINE],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '① 在背面圖上依序點出委中、承山、崑崙、至陰。② 說出承扶、殷門、委中三者之間的骨度分寸。③ 背出四總穴歌，並說出每一句對應的穴位與經絡。',
            en: '① On the back view, tap 委中, 承山, 崑崙 and 至陰 in order. ② State the bone-cun between 承扶, 殷門 and 委中. ③ Recite the Four Command Points song and name the point and channel each line belongs to.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_6',
    dayNumber: 6,
    titleZhHant: '足少陰腎經',
    titleEn: 'Kidney meridian',
    hookZhHant: '從湧泉到俞府。腹部十一站每站相差一寸，旁開恆為 0.5 寸——這是全資料集最整齊的一條尺。',
    hookEn: 'From the sole to the collarbone. Eleven abdominal stations, one cun apart, at a constant 0.5 cun from the midline — the tidiest ruler in the whole dataset.',
    meridianIds: ['mer_ki'],
    sourceIds: [WORKSHEET6, LINGSHU],
    reviewStatus: 'source_checked',
    sections: [
      {
        id: 'sec_6_learn',
        kind: 'learn',
        titleZhHant: '【學】湧泉到俞府',
        titleEn: 'Learn — 湧泉 to 俞府',
        sourceIds: [WORKSHEET6, LINGSHU],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '腎經共 27 穴，起於足底的湧泉，出然谷，繞內踝後的太溪，沿小腿內側上行至膝膕內側的陰谷；再入腹部，自恥骨聯合上緣的橫骨一路向上到幽門，最後走胸部，止於鎖骨下的俞府。它與膀胱經互為表裡。',
            en: 'The Kidney meridian has 27 points. It starts at 湧泉 KI1 in the sole, emerges at 然谷 KI2, rounds 太溪 KI3 behind the inner ankle, climbs the medial lower leg to 陰谷 KI10 at the inner knee, enters the abdomen at 橫骨 KI11 on the pubic bone and runs up to 幽門 KI21, then crosses the chest to end at 俞府 KI27 under the collarbone. It is the interior–exterior pair of the Bladder channel.',
          },
          {
            zhHant:
              '今天的骨架是兩條尺。腹部：橫骨（臍下 5 寸）→ 肓俞（平臍）→ 幽門（臍上 5 寸），共十一站，每站相差 1 寸，旁開永遠 0.5 寸。胸部：步廊在第 5 肋間，往上每一站升一個肋間，到彧中的第 1 肋間，俞府再上到鎖骨下緣。',
            en: 'Today’s skeleton is two rulers. The abdomen: 橫骨 (5 cun below the navel) → 肓俞 (level with it) → 幽門 (5 cun above), eleven stations one cun apart, always 0.5 cun lateral. The chest: 步廊 in the 5th intercostal space, then one space up per station to 彧中 in the 1st, and 俞府 above that under the clavicle.',
          },
          {
            zhHant:
              '踝部是一叢而不是一列：太溪在內踝尖與跟腱之間，大鐘在它下方偏後，水泉再下 1 寸，照海則在內踝尖的正下方。四穴圍著太溪轉，經脈到復溜（太溪上 2 寸）才真正開始往上走。',
            en: 'The ankle is a cluster, not a line: 太溪 sits between the malleolus tip and the Achilles tendon, 大鐘 below and behind it, 水泉 a further cun down, and 照海 directly beneath the malleolus tip. The four circle 太溪, and the channel only begins its climb at 復溜, 2 cun above it.',
          },
        ],
      },
      {
        id: 'sec_6_do',
        kind: 'do',
        titleZhHant: '【做】摸太溪，數腹部的尺',
        titleEn: 'Do — feel 太溪, then count the abdominal ruler',
        sourceIds: [WORKSHEET6],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '內踝的最高點與跟腱之間有一個凹陷，輕按有搏動感，那就是太溪。往下 1 寸是水泉，內踝尖正下方的凹陷是照海——注意照海是「下」不是「後下」。目標是「認得地標」，不是按壓治療。',
            en: 'Between the highest point of the inner ankle and the Achilles tendon there is a hollow with a pulse under light touch — that is 太溪. One cun below is 水泉, and the hollow directly beneath the malleolus tip is 照海 — directly below it, not behind. The goal is landmark recognition, not treatment.',
          },
          {
            zhHant:
              '把手指放在肚臍旁半寸，那是肓俞。從那裡往上、往下各數五步，每步一寸，就走完了腹部十一站。這條尺同時可以拿來對照胃經（旁開 2 寸）與脾經（旁開 4 寸）——三條線並排，只差在離正中線多遠。',
            en: 'Put a finger half a cun beside the navel: that is 肓俞. Count five steps up and five down, one cun each, and you have the whole abdominal run. The same ruler lets you compare the Stomach line (2 cun lateral) and the Spleen line (4 cun) — three parallel lines that differ only in their distance from the midline.',
          },
          {
            zhHant:
              '在圖上開啟腎經圖層，關掉其他經，看那十一個等距的點；再把胃經打開比較旁開的距離。',
            en: 'On the atlas, switch on the Kidney layer alone and look at the eleven evenly spaced points, then bring the Stomach layer back to compare the lateral distances.',
          },
        ],
      },
      {
        id: 'sec_6_say',
        kind: 'say',
        titleZhHant: '【說】穴名就是地標',
        titleEn: 'Say — the names are the landmarks',
        sourceIds: [WORKSHEET6],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '湧泉＝足心凹陷像泉水湧出；然谷＝「然骨」是舟骨粗隆，谷在骨下；太溪＝內踝後的大溪流；照海＝內踝下那汪凹陷，光可照見海。四個名字都是地形，不是功能。',
            en: '湧泉 the spring welling from the sole; 然谷 the valley below 然骨, the navicular tuberosity; 太溪 the great stream behind the inner ankle; 照海 the hollow bright enough to shine on a sea. Four names, four pieces of terrain — none of them a function.',
          },
          {
            zhHant:
              '五輸穴在這一條上齊全：井湧泉（木）、滎然谷（火）、輸太溪（土，兼原穴）、經復溜（金）、合陰谷（水）。腹部 KI11–KI21 十一穴全為足少陰與沖脈的交會穴。',
            en: 'The five shu points are all here: jing-well 湧泉 (wood), ying-spring 然谷 (fire), shu-stream 太溪 (earth, also the yuan-source), jing-river 復溜 (metal), he-sea 陰谷 (water). All eleven abdominal points KI11–KI21 are crossings of the Kidney channel with the Penetrating vessel.',
          },
        ],
      },
      {
        id: 'sec_6_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [WORKSHEET6],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '錄一分鐘：腎經從哪裡開始、走身體的哪一側、共幾站、終點在哪；腹部十一站的間距與旁開各是多少；太溪、照海、復溜三者各以什麼為地標。說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute: where the Kidney channel starts, which aspect it follows, how many stations it has and where it ends; the spacing and lateral distance of the eleven abdominal points; and the landmark each of 太溪, 照海 and 復溜 is measured from. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_6_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET6],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '① 在圖上依序點出湧泉、太溪、照海、陰谷。② 說出肓俞、幽門、橫骨相對臍中的位置。③ 說出腎經五輸穴各是哪一穴。',
            en: '① Tap 湧泉, 太溪, 照海 and 陰谷 in order. ② State where 肓俞, 幽門 and 橫骨 sit relative to the umbilicus. ③ Name the five shu points of the Kidney channel.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_7',
    dayNumber: 7,
    titleZhHant: '手厥陰心包經 & 手少陽三焦經',
    titleEn: 'Pericardium & Triple Energizer meridians',
    hookZhHant: '兩條走手臂中線的經，夾在你已經學過的四條之間。內關與外關同寸數、內外相對——今天就從這一對開始。',
    hookEn: 'Two channels that run the midline of the arm, wedged between four you already know. 內關 and 外關 sit at the same distance on opposite faces — start with that pair.',
    meridianIds: ['mer_pc', 'mer_te'],
    sourceIds: [WORKSHEET7, LINGSHU],
    reviewStatus: 'source_checked',
    sections: [
      {
        id: 'sec_7_learn',
        kind: 'learn',
        titleZhHant: '【學】兩條中線',
        titleEn: 'Learn — the two midlines',
        sourceIds: [WORKSHEET7, LINGSHU],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '心包經共 9 穴，走上肢內側的中線：前面是肺經，後面是心經。從胸側的天池出發，經上臂（天泉）到肘窩中央的曲澤，沿前臂兩筋之間（郄門、間使、內關）到腕橫紋上的大陵，入掌心的勞宮，止於中指尖的中衝。',
            en: 'The Pericardium meridian has 9 points and runs the midline of the inner arm — Lung in front of it, Heart behind. From 天池 PC1 on the side of the chest it passes 天泉 PC2 on the upper arm to 曲澤 PC3 in the middle of the cubital crease, down between the two forearm tendons (郄門, 間使, 內關) to 大陵 PC7 on the wrist crease, into the palm at 勞宮 PC8, ending at the middle fingertip (中衝 PC9).',
          },
          {
            zhHant:
              '三焦經共 23 穴，走上肢外側的中線：前面是大腸經，後面是小腸經。從無名指的關衝起，過手背（液門、中渚）到腕背的陽池，沿尺橈骨之間上行（外關、支溝、三陽絡、四瀆），過肘尖的天井，上臂外側到肩髎，再走頸側、耳後（翳風）、耳上（角孫）、耳前（耳門），止於眉梢的絲竹空。',
            en: 'The Triple Energizer meridian has 23 points and runs the midline of the outer arm — Large Intestine in front, Small Intestine behind. From 關衝 TE1 on the ring finger it crosses the back of the hand to 陽池 TE4 on the dorsal wrist crease, climbs between the ulna and radius (外關, 支溝, 三陽絡, 四瀆), passes the elbow tip at 天井 TE10 and the outer arm to 肩髎 TE14, then the side of the neck, behind the ear (翳風 TE17), over it (角孫 TE20), in front of it (耳門 TE21) and ends at the outer eyebrow (絲竹空 TE23).',
          },
          {
            zhHant:
              '今天的骨架是一組對照：內關在腕掌側橫紋上 2 寸、兩筋之間；外關在腕背橫紋上 2 寸、兩骨之間。同一個高度，一掌一背。前臂其餘各站也照這套走：郄門 5 寸、間使 3 寸、內關 2 寸、大陵 0 寸；外關 2 寸、支溝 3 寸、三陽絡 4 寸、四瀆 7 寸。',
            en: 'Today’s skeleton is one comparison: 內關 sits 2 cun above the PALMAR wrist crease between two tendons; 外關 2 cun above the DORSAL crease between two bones. Same height, opposite faces. The rest of each forearm follows the same ruler: 郄門 5, 間使 3, 內關 2, 大陵 0; and 外關 2, 支溝 3, 三陽絡 4, 四瀆 7.',
          },
        ],
      },
      {
        id: 'sec_7_do',
        kind: 'do',
        titleZhHant: '【做】內外對取',
        titleEn: 'Do — find the pair from both sides',
        sourceIds: [WORKSHEET7],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '手掌朝上，從腕橫紋往上量兩橫指（約 2 寸），在兩條明顯的肌腱之間停下——那是內關。拇指按住不動，把手翻過來，同一個高度、尺橈兩骨之間的凹陷就是外關。兩指前後夾住的感覺，就是這一對的記憶點。目標是「認得地標」，不是按壓治療。',
            en: 'Palm up: measure two finger-widths (about 2 cun) up from the wrist crease and stop between the two obvious tendons — that is 內關. Keep the thumb there, turn the hand over, and at the same height between the two forearm bones is 外關. The feeling of pinching front and back is the memory hook for the pair. Landmark recognition, not treatment.',
          },
          {
            zhHant:
              '微屈肘，肘橫紋中央可以摸到一條大筋（肱二頭肌腱），它的尺側（靠身體那側）凹陷是曲澤。再握拳，中指尖點到掌心的位置就是勞宮。兩個都是「動作取穴」，做一次比看十次有用。',
            en: 'Flex the elbow slightly: the big tendon in the middle of the crease is the biceps tendon, and the hollow on its ulnar side is 曲澤. Then make a fist — where the middle fingertip lands on the palm is 勞宮. Both are found by moving, and doing it once beats reading it ten times.',
          },
          {
            zhHant:
              '在圖上打開心包經與三焦經兩個圖層，關掉其餘的，看兩條線各自走在手臂的中央；再點手部的放大鏡，比較大陵與陽池分別壓在哪一條橫紋上。',
            en: 'On the atlas, switch on the Pericardium and Triple Energizer layers alone and see each run down the centre of its arm; then open a hand detail view and compare which crease 大陵 and 陽池 each sit on.',
          },
        ],
      },
      {
        id: 'sec_7_say',
        kind: 'say',
        titleZhHant: '【說】內關心胸胃，外關頭項耳',
        titleEn: 'Say — the inner and outer gates',
        sourceIds: [WORKSHEET7],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '「內」與「外」就是掌側與背側，「關」是關口。兩穴同名不同面，一組就記住兩條經的核心。兩者都是絡穴，也都是八脈交會穴——內關通陰維脈，外關通陽維脈，連這一層都是對仗的。',
            en: '「內」 and 「外」 are simply the palmar and dorsal faces, and 「關」 is a pass or gate. One shared name, two faces, and the core point of both channels in a single pair. Both are luo-connecting points and both are confluent points of the eight extraordinary vessels — 內關 with the Yin Linking vessel, 外關 with the Yang Linking. Even that layer is a matched pair.',
          },
          {
            zhHant:
              '其他名字也是地形：曲澤是屈肘時的一汪澤水，勞宮是手掌的「宮殿」，陽池是腕背的一窪池，支溝是兩骨之間的縱溝，絲竹空是眉毛（絲竹）盡頭的凹陷。',
            en: 'The other names are terrain too: 曲澤 the marsh that appears when the elbow bends, 勞宮 the palm’s palace, 陽池 the pool on the back of the wrist, 支溝 the long ditch between the two bones, 絲竹空 the hollow at the end of the eyebrow — silk and bamboo being the brow.',
          },
        ],
      },
      {
        id: 'sec_7_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [WORKSHEET7],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '錄一分鐘：兩條經各走手臂的哪一面、哪一條線，前後鄰居分別是誰；內關與外關的定位差在哪裡；前臂各站距各自橫紋幾寸。說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute: which face and which line each channel follows, and which channels flank it; exactly how 內關 and 外關 differ; and the cun distance of each forearm station from its own crease. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_7_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET7],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '① 在圖上點出內關與外關，並說出兩者的定位差別。② 說出郄門、間使、內關、大陵各距腕橫紋幾寸。③ 說出心包經與三焦經的五輸穴各是哪些。',
            en: '① Tap 內關 and 外關 and state exactly how their locations differ. ② Give the cun above the wrist crease for 郄門, 間使, 內關 and 大陵. ③ Name the five shu points of each channel.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_8',
    dayNumber: 8,
    titleZhHant: '足少陽膽經（側線部隊）',
    titleEn: 'Gallbladder meridian — the side line',
    hookZhHant: '身體兩側，從頭到腳，像褲線。44 穴裡有 20 穴在頭上——今天先把頭上那一段的路線走順。',
    hookEn: 'Down the side of the body from head to foot, like the seam of a trouser leg. Twenty of its forty-four points are on the head, so start by learning the path they take.',
    meridianIds: ['mer_gb'],
    sourceIds: [WORKSHEET8, OUTLINE, LINGSHU],
    reviewStatus: 'source_checked',
    sections: [
      {
        id: 'sec_8_learn',
        kind: 'learn',
        titleZhHant: '【學】從外眼角走到第四趾',
        titleEn: 'Learn — outer canthus to fourth toe',
        sourceIds: [WORKSHEET8, LINGSHU],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '膽經共 44 穴，是十四經中僅次於膀胱經的第二長。起於目外眥的瞳子髎，在頭側繞行，下至耳後的風池，沿頸側到肩上的肩井，再走脅肋、腰側、髖外側（環跳），沿大腿與小腿外側下行，止於第四趾外側的足竅陰。',
            en: 'The Gallbladder meridian has 44 points — second only to the Bladder in length. It starts at 瞳子髎 GB1 at the outer canthus, winds across the side of the head to 風池 GB20 behind the ear, runs down the neck to 肩井 GB21 on the shoulder, then along the flank and waist to 環跳 GB30 at the outer hip, down the lateral thigh and lower leg, ending at 足竅陰 GB44 on the fourth toe.',
          },
          {
            zhHant:
              '頭上這 20 穴是全經最難的一段，因為它不是一條直線而是「之」字形：從外眼角往上到顳側髮際（頷厭、懸顱、懸釐、曲鬢），跳到耳尖上方（率谷），繞到耳後往下（天衝、浮白、頭竅陰、完骨），再回到前額髮際（本神、陽白、頭臨泣），然後越過頭頂（目窗、正營、承靈），最後下到枕部（腦空、風池）。',
            en: 'Those twenty head points are the hardest stretch, because the channel does not run straight — it weaves. Up from the outer canthus to the temple hairline (GB4–GB7), across to above the ear apex (率谷 GB8), around and down behind the ear (GB9–GB12), back to the forehead hairline (GB13–GB15), over the top of the head (GB16–GB18), and finally down to the occiput (腦空 GB19, 風池 GB20).',
          },
          {
            zhHant:
              '很多頭穴不用寸數，用「比例」定位：頷厭、懸顱、懸釐把頭維到曲鬢的弧線分成四等分；浮白、頭竅陰把天衝到完骨的弧線分成三等分。環跳也是比例——大轉子最凸點與骶管裂孔連線的外 1/3 處。記比例比記數字好用。',
            en: 'Many head points are located by PROPORTION rather than cun: 頷厭, 懸顱 and 懸釐 divide the curve from 頭維 to 曲鬢 into quarters; 浮白 and 頭竅陰 divide the curve from 天衝 to 完骨 into thirds. 環跳 GB30 is the same kind of rule — the outer third of the line from the greater trochanter to the sacral hiatus. Remembering the ratio beats remembering a number.',
          },
          {
            zhHant:
              '腿的那一段回到熟悉的骨度分寸：膕橫紋上 7 寸是風市，外踝尖上 7、5、4、3 寸依序是陽交／外丘、光明、陽輔、懸鐘。與膀胱經同一套 16 寸。',
            en: 'The leg returns to familiar bone-cun: 風市 GB31 sits 7 cun above the popliteal crease, and 陽交/外丘, 光明, 陽輔 and 懸鐘 sit 7, 5, 4 and 3 cun above the tip of the lateral malleolus — the same 16-cun segment the Bladder channel uses.',
          },
        ],
      },
      {
        id: 'sec_8_do',
        kind: 'do',
        titleZhHant: '【做】摸風池、陽陵泉、環跳',
        titleEn: 'Do — find 風池, 陽陵泉 and 環跳',
        sourceIds: [WORKSHEET8, OUTLINE],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '雙手抱住後腦，拇指往上滑到枕骨下緣，在兩條大筋（胸鎖乳突肌與斜方肌）之間會摸到一個明顯的凹陷，那是風池。目標是「認得地標」，不是按壓治療。',
            en: 'Cup the back of the head and slide the thumbs up to the lower border of the occiput; the obvious hollow between the two big muscles is 風池. Landmark recognition, not treatment.',
          },
          {
            zhHant:
              '坐著把手放在膝外側，往下摸到一顆明顯的骨突——腓骨小頭；它的前下方凹陷就是陽陵泉。這是八會穴的筋會，也是膽經合穴。',
            en: 'Sitting, run a hand down the outside of the knee to the obvious bony knob — the head of the fibula. The hollow in front of and below it is 陽陵泉 GB34, the influential point for sinew and the channel’s he-sea.',
          },
          {
            zhHant:
              '側臥屈股，找到股骨大轉子最凸的那一點，再找骶管裂孔，兩點連線靠外側的三分之一處就是環跳。用比例找，不要用尺量。',
            en: 'Lie on your side with the hip flexed, find the most prominent point of the greater trochanter and the sacral hiatus, and take the point one third of the way along that line from the trochanter — that is 環跳. Find it by ratio, not by measuring.',
          },
          {
            zhHant:
              '在圖上只打開膽經圖層，前面看頭側與腹側，切到背面看耳後、肩井、髖與腿外側——膽經是側面的經，兩個視圖各看得到一半。',
            en: 'On the atlas, switch on the Gallbladder layer alone: the front view carries the temple and the flank, the back view the retro-auricular points, 肩井, the hip and the lateral leg. It is a side channel, so each view shows about half of it.',
          },
        ],
      },
      {
        id: 'sec_8_say',
        kind: 'say',
        titleZhHant: '【說】兩個八會穴都在這條經上',
        titleEn: 'Say — two influential points on one channel',
        sourceIds: [WORKSHEET8],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '八會穴裡，膽經佔了兩個：陽陵泉是筋會，懸鐘（別名絕骨）是髓會。一個在膝外側的骨突下，一個在外踝尖上 3 寸——上下各一，好記。',
            en: 'The Gallbladder holds two of the eight influential points: 陽陵泉 GB34 for sinew and 懸鐘 GB39 — also called 絕骨 — for marrow. One below the knee’s bony knob, one 3 cun above the outer ankle: one high, one low.',
          },
          {
            zhHant:
              '兩組容易混的分類要說清楚。募穴：日月（GB24）是膽的募穴，京門（GB25）卻是「腎」的募穴——它只是長在膽經上。郄穴：外丘（GB36）是膽經本經的郄穴，陽交（GB35）是陽維脈的郄穴——兩穴同在外踝尖上 7 寸，一前一後。',
            en: 'Two pairs are easy to confuse. Front-mu: 日月 GB24 is the Gallbladder’s own, but 京門 GB25 is the KIDNEY’s — it merely sits on this channel. Xi-cleft: 外丘 GB36 belongs to the channel itself, while 陽交 GB35 belongs to the Yang Linking vessel. Those two share a height, 7 cun above the ankle, one at the front border of the fibula and one at the back.',
          },
          {
            zhHant:
              '頭／足同名對也記一下：頭臨泣（GB15）與足臨泣（GB41）、頭竅陰（GB11）與足竅陰（GB44）。名字一樣，靠「頭」「足」二字分辨。',
            en: 'Note the head/foot pairs too: 頭臨泣 GB15 with 足臨泣 GB41, and 頭竅陰 GB11 with 足竅陰 GB44 — one name each, told apart by the 頭 or 足 in front.',
          },
        ],
      },
      {
        id: 'sec_8_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [WORKSHEET8],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '錄一分鐘：畫出膽經在頭上的「之」字路線，說出哪些穴是用比例定位的；說出兩個八會穴各是什麼會；說出日月與京門、外丘與陽交的差別。說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute: trace the weave the channel takes across the head and name which of its points are located by proportion; name what each of its two influential points is influential for; and state the difference between 日月 and 京門, and between 外丘 and 陽交. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_8_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET8, OUTLINE],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '① 依序點出風池、肩井、環跳、陽陵泉、懸鐘。② 說出環跳的比例定位規則。③ 說出膽經的兩個八會穴，以及日月／京門分屬哪一臟腑的募穴。',
            en: '① Tap 風池, 肩井, 環跳, 陽陵泉 and 懸鐘 in order. ② State the proportional rule that locates 環跳. ③ Name the channel’s two influential points, and say which organ each of 日月 and 京門 is the front-mu of.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_9',
    dayNumber: 9,
    titleZhHant: '足厥陰肝經 — 十二正經的最後一條',
    titleEn: 'Liver meridian — the last of the twelve',
    hookZhHant: '只有 14 穴，卻是收尾的一條：期門把氣血交回中府，第 1 天的第一穴。走完這條，十二正經就閉環了。',
    hookEn: 'Only 14 points, but the one that closes the loop: 期門 hands the flow back to 中府, the very first point of Day 1. Finish this and the twelve are a complete circle.',
    meridianIds: ['mer_lr'],
    sourceIds: [WORKSHEET9, OUTLINE, LINGSHU],
    reviewStatus: 'source_checked',
    sections: [
      {
        id: 'sec_9_learn',
        kind: 'learn',
        titleZhHant: '【學】從大趾走到脅肋',
        titleEn: 'Learn — great toe to the flank',
        sourceIds: [WORKSHEET9, LINGSHU],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '肝經共 14 穴，是十二正經裡最短的一條。起於足大趾外側的大敦，經行間、太衝走足背，過內踝前的中封，沿小腿內側上行（蠡溝、中都），到膝內側的曲泉，再走大腿內側（陰包、足五里、陰廉）、腹股溝（急脈），最後到脅肋的章門與期門。',
            en: 'The Liver meridian has 14 points, the shortest of the twelve. From 大敦 LR1 on the outer side of the great toe it crosses the dorsum through 行間 and 太衝, passes 中封 in front of the inner ankle, climbs the medial lower leg (蠡溝, 中都) to 曲泉 at the inner knee, continues up the inner thigh and groin, and ends at 章門 and 期門 on the flank.',
          },
          {
            zhHant:
              '小腿段和脾經、腎經共用同一把尺：內踝尖上 5 寸是蠡溝，上 7 寸是中都。要注意的是「內踝上 8 寸」這個高度——肝經在那裡交出到脾經之後，兩條線上下互換位置。圖上不畫這個交叉，只把兩條線分開排。',
            en: 'Below the knee it shares a ruler with the Spleen and Kidney: 蠡溝 sits 5 cun above the tip of the medial malleolus and 中都 at 7. Note the height of 8 cun — that is where the Liver crosses BEHIND the Spleen and the two swap order. The atlas does not draw that crossing; it keeps the lines apart instead.',
          },
          {
            zhHant:
              '最後兩穴要分清歸屬。期門是「肝」自己的募穴。章門卻是「脾」的募穴，而且是八會穴的臟會——它長在肝經上，但不屬肝。這和第 8 天的京門（腎募長在膽經上）是同一種跨經模式。',
            en: 'The last two need their attributions kept straight. 期門 LR14 is the LIVER’s own front-mu. 章門 LR13 is the SPLEEN’s — and also the influential point where the zang meet. It sits on the Liver channel without belonging to that organ, the same cross-channel pattern as 京門 GB25 on Day 8.',
          },
          {
            zhHant:
              '走完這條，十二正經就滿了。肝經的支脈上注於肺，把氣血交回手太陰肺經——也就是第 1 天的中府。流注在此接回起點，可以從任何一天開始再走一圈。',
            en: 'With this channel the twelve are complete. A branch of the Liver pours into the lung, handing the flow back to the Lung channel — 中府 LU1, where Day 1 began. The cycle closes here, and can be walked again from any day.',
          },
        ],
      },
      {
        id: 'sec_9_do',
        kind: 'do',
        titleZhHant: '【做】摸太衝，數到期門',
        titleEn: 'Do — feel 太衝, then count up to 期門',
        sourceIds: [WORKSHEET9, OUTLINE],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '從足大趾與第二趾之間的縫往腳踝方向推，手指會在兩根蹠骨會合前停住，那個凹陷就是太衝——肝經的原穴。它與大腸經的合谷合稱「四關」，兩穴一手一足。目標是「認得地標」，不是按壓治療。',
            en: 'Slide a finger up the gap between the great and second toes toward the ankle; it stops where the two metatarsals meet, and that hollow is 太衝 LR3, the channel’s yuan-source. With 合谷 LI4 on the Large Intestine it forms the pair called 「四關」 — one on the hand, one on the foot. Landmark recognition, not treatment.',
          },
          {
            zhHant:
              '沿脛骨內側面往上摸，內踝尖上約四橫指是蠡溝，再上約兩橫指是中都。兩穴都貼在骨面上，不在肌肉裡——摸得到骨頭就摸對了位置。',
            en: 'Run a finger up the flat medial face of the tibia: about four finger-widths above the ankle tip is 蠡溝, two more is 中都. Both lie against the bone rather than in muscle — if you feel bone, you are on the line.',
          },
          {
            zhHant:
              '找期門：從乳頭往下數兩個肋間隙（第 6 肋間），旁開前正中線 4 寸。再往下摸到肋弓最下緣的第 11 肋游離端，那是章門。這兩穴同時是膽經京門、帶脈、日月的定位基準，值得摸熟。',
            en: 'For 期門: count down two intercostal spaces from the nipple (the 6th), 4 cun from the anterior midline. Then feel down to the free end of the 11th rib at the lower costal margin — that is 章門. Both double as the reference landmarks for 京門, 帶脈 and 日月 on the Gallbladder channel, so they are worth knowing well.',
          },
        ],
      },
      {
        id: 'sec_9_say',
        kind: 'say',
        titleZhHant: '【說】兩個門，兩個歸屬',
        titleEn: 'Say — two gates, two owners',
        sourceIds: [WORKSHEET9],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '章門的「章」是彰顯、篇章，「門」是門戶——脾氣彰顯的門，也是五臟之氣交會的地方（臟會）。期門的「期」是周期、約期——肝氣出入的門，也是十二經流注的終點。名字都收在一個「門」字上，歸屬卻不同。',
            en: '章門: 「章」 to display, a chapter; 「門」 a gate — the gate through which the spleen’s qi shows itself, and where the zang meet. 期門: 「期」 a cycle or appointed term — the gate of the liver’s qi, and the last station of the twelve. Both names end in 「門」; their owners differ.',
          },
          {
            zhHant:
              '五輸穴齊全：井大敦（木）、滎行間（火）、輸太衝（土…等一下——陰經輸原同穴，太衝屬土，也是原穴）、經中封（金）、合曲泉（水）。絡穴是蠡溝，別走膽經；郄穴是中都。',
            en: 'The five shu are all here: jing-well 大敦 (wood), ying-spring 行間 (fire), shu-stream 太衝 — which on a yin channel doubles as the yuan-source — jing-river 中封 (metal), he-sea 曲泉 (water). The luo point is 蠡溝, running across to the Gallbladder; the xi-cleft is 中都.',
          },
        ],
      },
      {
        id: 'sec_9_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [WORKSHEET9],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '錄一分鐘：肝經從哪裡開始、走哪一側、共幾站、止於哪裡；章門與期門各是哪一臟的募穴；「四關」是哪兩穴。最後說一句：肝經之後接哪一條經，為什麼。說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute: where the Liver channel starts, which aspect it follows, how many stations it has and where it ends; which organ each of 章門 and 期門 is the front-mu of; and which two points make up 「四關」. Finish with one sentence on which channel follows the Liver, and why. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_9_test',
        kind: 'test',
        titleZhHant: '【考】今日小考 · 也是十二正經的收尾',
        titleEn: 'Test — today’s check, and the close of the twelve',
        sourceIds: [WORKSHEET9, OUTLINE],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '① 依序點出大敦、太衝、曲泉、章門、期門。② 說出章門與期門分屬哪一臟的募穴。③ 從肺經開始，把十二正經的流注次序背一遍，回到肺經為止。',
            en: '① Tap 大敦, 太衝, 曲泉, 章門 and 期門 in order. ② Say which organ each of 章門 and 期門 is the front-mu of. ③ Starting from the Lung, recite the flow order of all twelve regular channels until you arrive back at the Lung.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_10',
    dayNumber: 10,
    titleZhHant: '任脈與督脈（中軸大道）',
    titleEn: 'Conception & Governor vessels — the central axis',
    hookZhHant: '前面九天量的每一個「旁開 N 寸」，都是從這兩條線量出去的。今天把尺本身學會，十四經就滿了。',
    hookEn: 'Every 「N cun lateral」 you have measured across nine days counts outward from one of these two lines. Learn the rulers themselves and the fourteen are complete.',
    meridianIds: ['mer_cv', 'mer_gv'],
    sourceIds: [WORKSHEET10, OUTLINE],
    reviewStatus: 'source_checked',
    sections: [
      {
        id: 'sec_10_learn',
        kind: 'learn',
        titleZhHant: '【學】兩條中線',
        titleEn: 'Learn — the two midlines',
        sourceIds: [WORKSHEET10],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '任脈 24 穴走身前正中線，從會陰起，經下腹、上腹、胸骨，到頸前的天突、廉泉，止於下唇下方的承漿。督脈 29 穴走身後正中線，從尾骨旁的長強起，沿脊柱上行到大椎、風府，入腦上巔頂的百會，再從前額下行鼻柱、人中，到上唇內的齦交。',
            en: 'The Conception vessel has 24 points along the anterior midline: from the perineum up the abdomen and sternum to 天突 and 廉泉 in the throat, ending at 承漿 below the lower lip. The Governor has 29 along the posterior midline: from 長強 by the coccyx up the spine to 大椎 and 風府, over the vertex at 百會, then down the forehead and nose through the philtrum to 齦交 inside the upper lip.',
          },
          {
            zhHant:
              '這兩條和前面十二條結構不同：沒有左右之分、沒有表裡配對、沒有五輸穴。它們是奇經，不在十二經的流注循環裡。',
            en: 'These two are structurally unlike the twelve: no left and right, no interior–exterior pair, no five-shu points. They are extraordinary vessels, standing outside the flow cycle the twelve form.',
          },
          {
            zhHant:
              '但它們是全書的尺。腹部每一個「臍中上／下 N 寸」都從神闕（CV8）起算；胸部每一個肋間隙都對得上任脈的中庭、膻中、玉堂、紫宮、華蓋；背部每一個「後正中線旁開 1.5 寸／3 寸」的背俞穴，都是從督脈的椎骨節段往外量的。學會這兩條，等於把前面九天的定位全部串起來。',
            en: 'But they are the ruler for everything else. Every 「N cun above/below the umbilicus」 counts from 神闕 CV8; every intercostal space in the chest lines up with 中庭, 膻中, 玉堂, 紫宮 and 華蓋; and every back-shu point at 1.5 or 3 cun lateral is measured outward from a Governor vertebral level. Learning these two ties the previous nine days together.',
          },
          {
            zhHant:
              '任脈上有一串募穴，但它們屬於別的臟腑：中極＝膀胱募、關元＝小腸募、石門＝三焦募、中脘＝胃募兼腑會、巨闕＝心募、膻中＝心包募兼氣會。穴在任脈上，募的是別家的臟腑——和章門（脾募在肝經）、京門（腎募在膽經）是同一回事。',
            en: 'The Conception vessel carries a run of front-mu points that belong to OTHER organs: 中極 bladder, 關元 small intestine, 石門 triple burner, 中脘 stomach — and the influential point for the fu — 巨闕 heart, 膻中 pericardium and the influential point for qi. The point sits on this vessel; the organ is elsewhere. Exactly as with 章門 (spleen, on the Liver) and 京門 (kidney, on the Gallbladder).',
          },
        ],
      },
      {
        id: 'sec_10_do',
        kind: 'do',
        titleZhHant: '【做】用神闕和大椎校準',
        titleEn: 'Do — calibrate with 神闕 and 大椎',
        sourceIds: [WORKSHEET10],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '把手指放在肚臍正中，那是神闕（CV8）——腹部所有寸數的零點。往上四寸是中脘，往下三寸是關元；再把手橫移半寸，就落在腎經的線上，橫移兩寸是胃經，四寸是脾經。一個零點，三條線。目標是「認得地標」，不是按壓治療。',
            en: 'Put a finger on the centre of the navel: that is 神闕 CV8, the zero of the abdominal ruler. Four cun up is 中脘, three down is 關元. Now move half a cun sideways and you are on the Kidney line, two cun the Stomach, four the Spleen. One zero, three lines. Landmark recognition, not treatment.',
          },
          {
            zhHant:
              '低頭，摸到頸後最突出的骨節，它下方的凹陷是大椎（GV14）。從這裡往下數椎骨，就能找到第 4 天所有的背俞穴高度：T3 肺俞、T5 心俞、T7 膈俞。大椎是背部一切定位的起點。',
            en: 'Bow the head and feel the most prominent bump at the base of the neck; the hollow below it is 大椎 GV14. Count vertebrae down from there and you have every back-shu height from Day 4: T3 肺俞, T5 心俞, T7 膈俞. 大椎 is where all back locating starts.',
          },
          {
            zhHant:
              '百會（GV20）用兩耳尖連線的中點取；印堂（GV29）在兩眉頭之間。這兩個是頭部最好用的定位錨。在圖上打開任督兩個圖層、關掉其餘十二條，可以看清這兩條線就是身體的中軸。',
            en: 'Find 百會 GV20 at the midpoint of the line joining the two ear apices, and 印堂 GV29 between the medial ends of the brows — the two most useful anchors on the head. On the atlas, switch on just these two layers and turn the twelve off: what is left is the body’s central axis.',
          },
        ],
      },
      {
        id: 'sec_10_say',
        kind: 'say',
        titleZhHant: '【說】陰脈之海與陽脈之海',
        titleEn: 'Say — the seas of yin and yang',
        sourceIds: [WORKSHEET10],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '任脈總任諸陰，稱「陰脈之海」；督脈總督諸陽，稱「陽脈之海」。名字就說明了分工：一條走身前，統陰經；一條走身後，統陽經。手足三陽經都在大椎（GV14）與督脈相會，這也是它被稱為「諸陽之會」的原因。',
            en: 'The Conception vessel is said to take charge of all the yin channels — 「the sea of the yin vessels」 — and the Governor of all the yang — 「the sea of the yang vessels」. The names state the division: one runs the front and gathers the yin, one the back and gathers the yang. All six hand and foot yang channels are described as meeting the Governor at 大椎 GV14, which is why it is called the assembly of the yang.',
          },
          {
            zhHant:
              '督脈的止點有兩種說法，兩種都對，看你用哪個角度：按編號順序，末穴是齦交（GV28）；按循行方向由上而下，止於印堂（GV29）。印堂原本是經外奇穴，GB/T 12346-2006 才收進督脈——這也是本資料集採 29 穴版的原因；WHO 1989 的版本是 28 穴，兩種標準不可混用。',
            en: 'The Governor has two stated termini, and both are right depending on the angle. By numbering, the last point is 齦交 GV28. By the direction of flow, downward over the face, it ends at 印堂 GV29. 印堂 was an extra point outside the channels until GB/T 12346-2006 brought it in — which is why this dataset uses the 29-point set. The WHO 1989 set has 28; the two must not be mixed.',
          },
        ],
      },
      {
        id: 'sec_10_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [WORKSHEET10],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '錄一分鐘：任督兩脈各走哪一面、各幾穴、起止在哪；說出神闕與大椎各是什麼的定位基準；說出任脈上四個募穴分別屬於哪一臟腑。最後說明：這兩條為什麼不算在十二經的流注循環裡。說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute: which face each vessel runs, how many points each has, where each starts and ends; what 神闕 and 大椎 are each the reference for; and which organ four of the Conception front-mu points belong to. Finish by explaining why these two are not part of the twelve’s flow cycle. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_10_test',
        kind: 'test',
        titleZhHant: '【考】今日小考 · 十四經收尾',
        titleEn: 'Test — today’s check, and the close of the fourteen',
        sourceIds: [WORKSHEET10, OUTLINE],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '① 依序點出神闕、中脘、膻中、天突、大椎、百會、印堂。② 說出中極、關元、石門、中脘、巨闕、膻中各是哪一臟腑的募穴。③ 從神闕與大椎出發，各說出三個以它們為定位基準的其他經穴。',
            en: '① Tap 神闕, 中脘, 膻中, 天突, 大椎, 百會 and 印堂 in order. ② Name the organ each of 中極, 關元, 石門, 中脘, 巨闕 and 膻中 is the front-mu of. ③ Starting from 神闕 and from 大椎, name three points on OTHER channels that are located against each.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_11',
    dayNumber: 11,
    titleZhHant: '總複習 — 特定穴攻防矩陣',
    titleEn: 'Review — the specific-point matrix',
    hookZhHant: '把 362 個穴壓縮成幾張表。認得分類，就等於認得一整組穴。',
    hookEn: 'The 362 points compressed into a few tables. Learn a category and you have a whole set of points at once.',
    meridianIds: [],
    sourceIds: [OUTLINE, HANDBOOK],
    reviewStatus: 'unreviewed',
    sections: [
      {
        id: 'sec_11_learn',
        kind: 'learn',
        titleZhHant: '【學】六張表',
        titleEn: 'Learn — six tables',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '特定穴不是另一批穴，而是同一批穴的另一種索引。十二經各有五輸（井滎輸經合）、各有原絡郄各一；每一臟腑各有一募一俞；再加上八會穴、八脈交會穴、下合穴——六組分類就把全書串起來。',
            en: 'The specific points are not a second set of points but a second index over the same ones. Each of the twelve carries five shu (jing-well, ying-spring, shu-stream, jing-river, he-sea) and one each of yuan-source, luo-connecting and xi-cleft; each organ has one front-mu and one back-shu; then the eight influential, the eight confluent and the lower he-sea. Six categories tie the whole course together.',
          },
          {
            zhHant:
              '本頁的「特定穴矩陣」是直接從每一穴已審定的分類生成的，不是另寫一份表。點任一格，人體圖就會定位到那個穴——表是進入圖的入口，不是圖的副本。',
            en: 'The specific-point matrix on this page is generated from each point’s own reviewed classification rather than written out again. Tap any cell and the atlas locates that point: the table is a way INTO the figure, not a copy of it.',
          },
          {
            zhHant:
              '兩個最容易錯的地方，矩陣會直接標出來。第一：陰經的原穴與輸穴是同一個穴（如太淵 LU9 既是輸又是原），陽經則各自獨立。第二：募穴常常不在它所屬臟腑的經上——中脘是胃募卻在任脈，章門是脾募卻在肝經，京門是腎募卻在膽經。矩陣把這種情形標為「異經」。',
            en: 'The matrix marks the two things most often got wrong. First: on a yin channel the yuan-source and the shu-stream are the SAME point (太淵 LU9 is both), while on a yang channel they are separate. Second: a front-mu point often does not sit on its own organ’s channel — 中脘 is the stomach’s but sits on the Conception vessel, 章門 the spleen’s on the Liver, 京門 the kidney’s on the Gallbladder. The matrix flags those as off-channel.',
          },
        ],
      },
      {
        id: 'sec_11_do',
        kind: 'do',
        titleZhHant: '【做】從分類反推穴位',
        titleEn: 'Do — work backwards from the category',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開矩陣的「五輸穴」分頁，遮住穴名只看經名，由上往下把十二經的井穴背一遍，再換滎、輸、經、合。背錯的點開來看它在圖上的位置——位置記住了，名字就跟著記住。',
            en: 'Open the Five shu tab, cover the point names and read down the channel column, reciting each jing-well from memory; then do the same for ying-spring, shu-stream, jing-river and he-sea. Tap whichever you miss and look at where it sits on the figure — the position is what makes the name stick.',
          },
          {
            zhHant:
              '「募俞」分頁按臟腑排列。先由臟腑說出募穴，再說出背俞穴；背俞穴全在膀胱經第一側線，所以第二欄其實是在考你第 4 天的椎骨高度。',
            en: 'The Mu & Shu tab is ordered by organ. Name the front-mu from the organ, then the back-shu. Every back-shu is on the Bladder’s first line, so that column is really testing the vertebral levels from Day 4.',
          },
          {
            zhHant:
              '「八脈交會」分頁按四組配對排列，每組一手一足。這四組是最省力的記法：記住配對，八個穴就一起記住了。',
            en: 'The Eight confluent tab is laid out as the four coupled pairs, one hand point and one foot point each. Those pairs are the cheapest way to hold all eight: learn the pairing and the points come with it.',
          },
        ],
      },
      {
        id: 'sec_11_say',
        kind: 'say',
        titleZhHant: '【說】八會穴八句話',
        titleEn: 'Say — the eight influential points in eight lines',
        sourceIds: [OUTLINE, HANDBOOK],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '腑會中脘、臟會章門、筋會陽陵泉、髓會懸鐘（絕骨）、血會膈俞、骨會大杼、脈會太淵、氣會膻中。八個組織各有一個總會之處，八句話就是一整組。',
            en: 'The fu meet at 中脘, the zang at 章門, sinew at 陽陵泉, marrow at 懸鐘 (絕骨), blood at 膈俞, bone at 大杼, the vessels at 太淵, and qi at 膻中. Eight tissues, one gathering place each — eight lines and the set is yours.',
          },
          {
            zhHant:
              '注意這八個穴分散在五條不同的經上：中脘、膻中在任脈，章門在肝經，陽陵泉、懸鐘在膽經，膈俞、大杼在膀胱經，太淵在肺經。分類是橫向的索引，跟經絡的縱向排列是兩套系統。',
            en: 'Note that the eight are spread across five different channels: 中脘 and 膻中 on the Conception, 章門 on the Liver, 陽陵泉 and 懸鐘 on the Gallbladder, 膈俞 and 大杼 on the Bladder, 太淵 on the Lung. The categories are a sideways index; the channels run the other way. They are two systems over one set of points.',
          },
        ],
      },
      {
        id: 'sec_11_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：說出六組特定穴分類各是什麼、各有幾個穴；說出陰經原穴與輸穴的關係；舉三個「募穴不在本經」的例子。說不出來的地方，就是還沒學會的地方。',
            en: 'Record one minute: name the six categories and how many points each holds; state the relationship between the yuan-source and the shu-stream on a yin channel; and give three examples of a front-mu point sitting on another organ’s channel. Whatever you stumble on is what you have not learned yet.',
          },
        ],
      },
      {
        id: 'sec_11_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '① 默寫十二經的井穴與合穴。② 說出八會穴八句。③ 說出四組八脈交會配對。④ 說出六個「異經」的募穴各屬哪一臟腑。',
            en: '① Write out the jing-well and he-sea of all twelve channels from memory. ② Recite the eight influential points. ③ Give the four confluent pairs. ④ Name the organ of each front-mu point the matrix flags as off-channel.',
          },
          {
            zhHant:
              '【未收錄】手冊本日第四節「功能分隊總整理」按症狀列出配穴組合（退熱、止痛、婦科、急救）。那是症狀對應取穴的處方內容，依專案安全規則不收錄——本 App 只教路線、定位與分類，不做症狀配穴。',
            en: '[NOT INGESTED] The handbook’s fourth section for today lists point combinations by complaint — fever, pain, gynaecology, first aid. That is symptom-to-point prescribing, which this project does not carry: the app teaches routes, locations and classifications, and does not select points for symptoms.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_12',
    dayNumber: 12,
    titleZhHant: '終極實戰考試 — 從頭到腳，隨問隨點',
    titleEn: 'Final exam — head to foot, on demand',
    hookZhHant: '十二天的最後一天：空白人形圖上默畫十四經，隨問隨點，說得出歸經與分類。',
    hookEn: 'The last of the twelve days: draw all fourteen channels on a blank figure from memory, find any point on demand, and name its channel and category.',
    meridianIds: [],
    sourceIds: [OUTLINE, HANDBOOK],
    reviewStatus: 'unreviewed',
    sections: [
      {
        id: 'sec_12_do',
        kind: 'do',
        titleZhHant: '【做】默畫十四經',
        titleEn: 'Do — draw the fourteen from memory',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '拿一張空白人形圖，用不同顏色畫出十二正經與任督二脈，並標出 30 個關鍵穴。畫完再打開本 App 的人體圖逐條對照——把圖層一條一條打開，比對你畫的路線與站點。',
            en: 'Take a blank figure and draw all twelve regular channels plus the two midline vessels in different colours, marking 30 key points. Then open the atlas and check yourself channel by channel, switching the layers on one at a time and comparing your route and stations against it.',
          },
          {
            zhHant:
              '兩人一組：一人說穴名，另一人在圖上或身上點出位置，並說出歸經、所在骨度分寸、以及是否為特定穴。30 秒為限。答錯的進錯題本，明天再考。',
            en: 'In pairs: one says a point name, the other locates it — on the figure or on the body — and states its channel, the bone-cun distance that fixes it, and whether it carries a specific-point category. Thirty seconds each. Whatever is missed goes to the error notebook for tomorrow.',
          },
          {
            zhHant:
              '反向練習：說出一個分類（例如「膽經的郄穴」「心包經的絡穴」「腑會」），另一人說出穴名與定位。特定穴矩陣就是這一題的答案卷。',
            en: 'Now reverse it: one names a category — the Gallbladder’s xi-cleft, the Pericardium’s luo-connecting, the influential point for the fu — and the other gives the point and its location. The specific-point matrix is the answer sheet.',
          },
        ],
      },
      {
        id: 'sec_12_test',
        kind: 'test',
        titleZhHant: '【考】結業測驗',
        titleEn: 'Test — the final check',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '① 從肺經開始背出十二經的流注次序，回到肺經為止。② 任選五條經，說出起止穴與總穴數。③ 說出十二個背俞穴的椎體高度。④ 說出八會穴與四組八脈交會配對。⑤ 在圖上依序點出四總穴：足三里、委中、列缺、合谷。',
            en: '① Recite the flow order of the twelve from the Lung and back again. ② Pick any five channels and give their first point, last point and total count. ③ Give the vertebral level of all twelve back-shu points. ④ Recite the eight influential points and the four confluent pairs. ⑤ On the figure, tap the four command points in order: 足三里, 委中, 列缺, 合谷.',
          },
          {
            zhHant:
              '【未收錄】手冊本日第三節是「病案分析大考」——給定十個臨床情境，要求寫出辨證與選穴處方。那是治療決策，本 App 明確不做：它不診斷、不建議取穴、不作臨床決策支援。上面的測驗改考同等份量的路線、定位與分類回憶。',
            en: '[NOT INGESTED] The handbook’s third section for today is a case-analysis exam: ten clinical scenarios, each asking for a diagnosis and a point prescription. That is treatment decision-making, which this app explicitly does not do — it does not diagnose, recommend points for symptoms, or act as clinical decision support. The check above tests the same amount of ground in route, location and classification recall instead.',
          },
        ],
      },
      {
        id: 'sec_12_say',
        kind: 'say',
        titleZhHant: '【說】十二天之後',
        titleEn: 'Say — after twelve days',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '走到這裡，你手上有 362 個穴、十四條經、六組特定穴分類，以及一套從固定體表地標加骨度分寸推出來的定位方法。這套方法比任何一張圖都耐用：忘了某個穴在哪，回到它的地標與寸數，就能重新推出來。',
            en: 'By here you hold 362 points, fourteen channels, six categories of specific point, and a way of locating anything from a fixed surface landmark plus a bone-cun distance. That method outlasts any diagram: forget where a point sits and you can rebuild it from its landmark and its measurement.',
          },
          {
            zhHant:
              '最後提醒一句，也是本 App 從第 1 天就寫在每一頁的話：這裡教的是路線、名稱、地標與分類，不是治療。圖上的座標仍是示意排版，尚未實測驗證。身體有狀況，請找合格的專業人員。',
            en: 'One last thing, and it is what every page of this app has said since Day 1: what is taught here is routes, names, landmarks and classifications — not treatment. The coordinates on the figure are still schematic layout positions, not measured ones. For an actual health concern, see a qualified professional.',
          },
          {
            zhHant:
              '明天還有一個角度：「流注」分頁把十二經按十二時辰排成一天的循環（子午流注），出自《針灸大成·十二經納地支歌》。你今天背的流注次序，正是那張表的順序——第 13 天就從這裡接下去。',
            en: 'One more angle if you want it: the Flow tab lays the twelve channels out as a day, one to each double-hour (子午流注), following 《針灸大成·十二經納地支歌》. It is a reference page — outside these twelve days and never examined — but the flow sequence you learned today IS the order that table runs in.',
          },
        ],
      },
    ],
  },
  {
    id: 'day_13',
    dayNumber: 13,
    titleZhHant: '子午流注 — 氣血的潮汐時刻表',
    titleEn: '子午流注 — the tidal timetable',
    hookZhHant: '把十二經排進一天：經氣如潮水，按時而行。',
    hookEn: 'The twelve channels laid out as a day — the sequence you already know, told as a clock.',
    meridianIds: [],
    sourceIds: [ZIWU, WORKSHEET_ZIWU, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元用於說明中醫的時空框架與其對自然節律的描述，不提供任何臨床診斷指引或治療建議。',
    noticeEn:
      'This module is designed to explain Traditional Chinese Medicine’s spatiotemporal framework and natural physiological rhythms. It does not provide clinical diagnostic guidance or treatment recommendations of any kind.',
    sections: [
      {
        id: 'sec_13_learn',
        kind: 'learn',
        titleZhHant: '【學】時間上的十二經',
        titleEn: 'Learn — the twelve channels as a day',
        sourceIds: [ZIWU, WORKSHEET_ZIWU],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '子午流注是中醫的「時間解剖學」。前十二天你把十二經排在身體上；今天把同一組經排在一天裡。「子午」指南北、陰陽、晝夜的對立；「流注」形容經氣像水流一樣，從一經注入下一經，首尾相接。',
            en: '子午流注 is the tradition’s anatomy of TIME. Over the first twelve days you laid the twelve channels out across the body; today the same twelve are laid out across a day. 子午 names the north–south, yin–yang, night–day axis; 流注 describes the qi pouring from one channel into the next, the end of one meeting the start of the following.',
          },
          {
            zhHant:
              '十二時辰配十二正經的對應表，就是「流注」分頁上那張表——出自《針灸大成·十二經納地支歌》。順序你已經背過：從寅時的肺經起算，肺→大腸→胃→脾→心→小腸→膀胱→腎→心包→三焦→膽→肝，繞一圈回到肺經。今天不是新資料，是把舊資料換一個座標軸看。',
            en: 'The hour-to-channel table is the one on the Flow tab, from 《針灸大成·十二經納地支歌》. You have already learned the order: counted from the Lung at 寅 — Lung, Large Intestine, Stomach, Spleen, Heart, Small Intestine, Bladder, Kidney, Pericardium, Triple Energiser, Gallbladder, Liver — and back to the Lung. Nothing here is new data; it is the same data on a different axis.',
          },
          {
            zhHant:
              '「納子法」就是這張表本身：以十二地支（時辰）配十二經，描述經氣依序流過的節律。名詞聽起來專門，內容你今天之前就已經會了。',
            en: '「納子法」 is a name for that table: the twelve earthly branches matched to the twelve channels, describing the order the qi is said to run in. The term sounds technical; its content is something you already knew before today.',
          },
          {
            zhHant:
              '「開穴」「閉穴」在這裡只當節律的說法用：經氣流注到某經時稱「開」，流過之後稱「閉」。這是對潮汐般漲落的描述，不是操作指令，本 App 不用它決定任何事。',
            en: 'The words 開穴 and 閉穴 are used here purely as rhythm vocabulary: a channel is called “open” while the qi is described as running through it and “closed” once it has passed. They describe a rise and fall, like a tide. They are not an instruction, and nothing in this app acts on them.',
          },
          {
            zhHant:
              '「納甲法」是按天干推算五輸穴的高階算法。本課程只讓你知道有這個名詞，不教它的計算——它屬於擇時針灸的臨床決策範疇，本 App 一律不涉及。',
            en: '「納甲法」 is a further method that calculates five-shu points from the heavenly stems. This course names it so the term is not a blank, and stops there: the calculation belongs to timed-treatment decision-making, which this app does not go into at all.',
          },
          {
            zhHant:
              '【未收錄】原始課稿把時辰對應到生理系統與作息（幾點消化最強、幾點宜靜養、幾點是「養肝黃金期」與解毒代謝）。那些是健康與作息建議，且把傳統說法當成生理事實陳述，依專案安全規則一律不收錄。本課只教「哪個時辰配哪條經」與其順序。',
            en: '[NOT INGESTED] The source draft mapped the hours onto body systems and daily routine — when digestion is strongest, when to rest, which hours are a “golden window” for the liver and its detoxification. That is health and lifestyle advice, and it states traditional claims as physiological fact. Neither is carried here. This day teaches which channel goes with which hour, and the order they run in.',
          },
        ],
      },
      {
        id: 'sec_13_do',
        kind: 'do',
        titleZhHant: '【做】在「流注」分頁上走一圈',
        titleEn: 'Do — walk the cycle on the Flow tab',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「流注」分頁。它預設跟著現在的時間，先看現在是哪個時辰、哪條經。點「在人體圖上看這條經」跳到人體圖，找出這條經上你記得的 2–3 個穴——例如辰時是胃經，找足三里 ST36 與天樞 ST25。',
            en: 'Open the Flow tab. It follows the clock by default, so start with the hour you are actually in and the channel it names. Tap “See this channel on the atlas” and find two or three points on it that you remember — at 辰 that is the Stomach, so 足三里 ST36 and 天樞 ST25.',
          },
          {
            zhHant:
              '拖動或點選時辰環，從寅時一路走到丑時，看氣血怎麼一條一條交下去，最後回到肺經閉合成環。留意當前經是亮的、其餘是淡的——淡下去的那些不是消失，是同一張網的其他線。',
            en: 'Drag or tap round the ring from 寅 to 丑 and watch the hand-over, channel by channel, until it closes back on the Lung. The active channel is lit and the rest are faded — the faded ones have not gone anywhere; they are the rest of the same network.',
          },
          {
            zhHant:
              '正面與背面是並排的。走到申時（膀胱經）時特別看背面：這條經大半在背上，正面幾乎看不到它。走到午時（心經）時反過來，背面那一格會標明本經不經過此面。',
            en: 'The two body views sit side by side. At 申 (the Bladder) look at the back view in particular — most of that channel is there and the front barely shows it. At 午 (the Heart) it is the other way round, and the back panel says the channel does not run on that side.',
          },
        ],
      },
      {
        id: 'sec_13_say',
        kind: 'say',
        titleZhHant: '【說】七言歌訣與三段記法',
        titleEn: 'Say — the verse, and three groups of four',
        sourceIds: [ZIWU, WORKSHEET_ZIWU],
        reviewStatus: 'source_checked',
        body: [
          {
            zhHant:
              '大聲念三遍：「肺寅大卯胃辰宮，脾巳心午小未中，申膀酉腎心包戌，亥焦子膽丑肝通。」二十八個字裝下整張表——每句四個字對一組時辰與經。',
            en: 'Read it aloud three times: 「肺寅大卯胃辰宮，脾巳心午小未中，申膀酉腎心包戌，亥焦子膽丑肝通。」 Twenty-eight characters hold the entire table, four pairings to a line.',
          },
          {
            zhHant:
              '拆成三段更好背，每段四個時辰：寅卯辰巳（肺、大腸、胃、脾）、午未申酉（心、小腸、膀胱、腎）、戌亥子丑（心包、三焦、膽、肝）。三段各是一輪陰陽交替，段內順序就是流注順序。',
            en: 'It chunks into three groups of four: 寅卯辰巳 (Lung, Large Intestine, Stomach, Spleen), 午未申酉 (Heart, Small Intestine, Bladder, Kidney), 戌亥子丑 (Pericardium, Triple Energiser, Gallbladder, Liver). Each group alternates yin and yang, and within a group the order is simply the flow order.',
          },
          {
            zhHant:
              '一個比喻：把十二經想成城市的十二條公車路線，這張表是班表——哪條線在哪個時段發車最密。我們只是在讀班表，不是在調度發車。',
            en: 'A way to hold it: think of the twelve channels as twelve bus routes and this table as the timetable — which line runs most often in which window. We are reading the timetable, not dispatching the buses.',
          },
        ],
      },
      {
        id: 'sec_13_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、連線：寅時（03–05）、午時（11–13）、酉時（17–19）分別配哪一條經？二、用一句話說明「納子法」是什麼。三、打開「流注」分頁，說出現在值班的經，再說出這條經上的一個募穴或合穴。',
            en: 'One: which channel goes with 寅 (03–05), 午 (11–13) and 酉 (17–19)? Two: say in one sentence what 「納子法」 names. Three: open the Flow tab, say which channel is on duty now, then name one front-mu or he-sea point on it.',
          },
          {
            zhHant:
              '【未收錄】原始課稿的簡答題問「為什麼丑時是養肝的黃金期」，並以肝臟解毒代謝作答。那是把傳統時辰說法當作生理與療效事實，屬健康建議，不收錄；上面第二題改考同等份量的定義回憶。',
            en: '[NOT INGESTED] The source draft asked why 丑 is a “golden window for nourishing the liver”, answered in terms of hepatic detoxification. That presents a traditional claim as physiological fact and reads as health advice, so it is left out; question two above tests the same amount of recall on a definition instead.',
          },
        ],
      },
      {
        id: 'sec_13_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘講給別人聽',
        titleEn: 'Feynman — explain it in one minute',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是子午流注時鐘。寅時三到五點是肺經，卯時五到七點交給大腸經，辰時七到九點是胃經……十二條經照這個順序輪一圈，二十四小時剛好走完，最後從肝經回到肺經。這張表叫納子法。氣血像潮水一樣按時漲落，我只負責報時刻，不負責告訴你該做什麼。」',
            en: 'Record one minute: “I am the 子午流注 clock. 寅, three to five, is the Lung; 卯, five to seven, hands over to the Large Intestine; 辰, seven to nine, is the Stomach… twelve channels take a turn each and the round trip is exactly a day, the Liver handing back to the Lung at the end. The table is called 納子法. The qi is described as rising and falling like a tide, and my job is to tell you the time — not to tell you what to do with it.”',
          },
        ],
      },
      {
        id: 'sec_13_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋第 10 天：任督二脈的關元 CV4、命門 GV4、膻中 CV17。回鍋第 11 天：八會穴，特別是臟會章門 LR13 與腑會中脘 CV12。回鍋第 12 天：十二經流注走向——今天整堂課就架在它上面。',
            en: 'Back to Day 10: 關元 CV4, 命門 GV4 and 膻中 CV17 on the two midline vessels. Back to Day 11: the eight influential points, especially 章門 LR13 for the zang and 中脘 CV12 for the fu. Back to Day 12: the flow sequence of the twelve — the whole of today is built on it.',
          },
        ],
      },
    ],
  },
  /*
   * Day 14 — the first of the region detail lessons (Days 14–26).
   *
   * Ingested from the owner's third draft. Five details in that draft still
   * disagreed with the reviewed 定位 records and are corrected here AGAINST
   * those records, not against a textbook and not from memory:
   *
   *  1. 神門 HT7 was placed 尺骨莖突橈側 in three places. Its record says
   *     「腕掌側橫紋尺側端，尺側腕屈肌腱的橈側凹陷處」 — the landmark is the FCU
   *     tendon. "Radial to the ulnar styloid" also describes most of the wrist.
   *  2. 中渚 TE3 was listed as sitting on the 赤白肉際. Its record puts it
   *     「手背，第 4、5 掌骨間」 — on the dorsum. Among the loaded points only
   *     後溪 SI3 and 腕骨 SI4 have 赤白肉際 in their own 定位 text.
   *  3. 「第 2-3 掌骨間」 was given as a dorsal 輸穴 site. No loaded point is
   *     there; 合谷 LI4 is 第 1、2 掌骨之間 and 中渚 TE3 is 第 4、5.
   *  4. 陽谷 SI5 was grouped with 神門 on the palmar wrist crease. Its record
   *     places it 腕後區, 尺骨莖突與三角骨之間 — the dorsal side.
   *  5. The four 原穴 were said to sit on "the wrist crease". Three do;
   *     陽池 TE4 is on the 腕背橫紋.
   *
   * The draft's own corrections — the mnemonic, the 原↔原 pairing, dropping
   * 陷谷/太衝/八邪, and 捏掐 → 對按 — are carried as the owner wrote them.
   */
  {
    id: 'day_14',
    dayNumber: 14,
    titleZhHant: '腕部及手部 — 赤白肉際與六經交會',
    titleEn: 'Wrist & hand — the red-white boundary, where six channels meet',
    hookZhHant: '全身穴位最密的一段：六條經在一隻手上分道揚鑣，靠的是掌背交界那條線。',
    hookEn: 'The densest stretch on the body: six channels part company across one hand, and the line they part along is the boundary between palm and back.',
    meridianIds: ['mer_lu', 'mer_li', 'mer_ht', 'mer_si', 'mer_pc', 'mer_te'],
    sourceIds: [WORKSHEET14, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己手上找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own hand, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_14_learn',
        kind: 'learn',
        titleZhHant: '【學】六條經，一隻手',
        titleEn: 'Learn — six channels, one hand',
        sourceIds: [WORKSHEET14],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '手上走六條經：掌面（陰）三條——肺 LU、心包 PC、心 HT；背面（陽）三條——大腸 LI、三焦 TE、小腸 SI。腎經與胃經不經過手部；先把這件事釘住，後面的口訣才不會錯。',
            en: 'Six channels reach the hand. Three on the palmar side (yin) — Lung, Pericardium, Heart; three on the dorsal side (yang) — Large Intestine, Triple Energiser, Small Intestine. The Kidney and Stomach channels do not reach the hand at all. Fix that first: the mnemonic later depends on it.',
          },
          {
            zhHant:
              '★ 六個核心穴：合谷 LI4（第 1、2 掌骨之間，第 2 掌骨橈側中點，大腸經原穴）｜後溪 SI3（握拳，第 5 掌指關節尺側近端赤白肉際凹陷中，小腸經輸穴）｜神門 HT7（腕掌側橫紋尺側端，尺側腕屈肌腱的橈側凹陷處，心經原穴）｜太淵 LU9（腕掌側橫紋橈側，橈動脈搏動處，肺經原穴、脈會）｜內關 PC6（腕掌側遠端橫紋上 2 寸，掌長肌腱與橈側腕屈肌腱之間，心包經絡穴）｜中渚 TE3（手背第 4、5 掌骨間凹陷，三焦經輸穴）。',
            en: 'Six core points. 合谷 LI4 — between the first and second metacarpals, at the midpoint of the radial side of the second; the Large Intestine yuan-source. 後溪 SI3 — make a fist: the depression proximal to the fifth metacarpophalangeal joint on its ulnar side, at the red-white boundary; the Small Intestine shu-stream. 神門 HT7 — the ulnar end of the palmar wrist crease, in the depression radial to the flexor carpi ulnaris tendon; the Heart yuan-source. 太淵 LU9 — the radial end of the palmar wrist crease, where the radial artery pulses; the Lung yuan-source and influential point of the vessels. 內關 PC6 — 2 cun above the distal palmar wrist crease, between the tendons of palmaris longus and flexor carpi radialis; the Pericardium luo-connecting point. 中渚 TE3 — on the back of the hand between the fourth and fifth metacarpals; the Triple Energiser shu-stream.',
          },
          {
            zhHant:
              '★★ 五個重要穴：列缺 LU7（橈骨莖突上方，腕掌側遠端橫紋上 1.5 寸，肺經絡穴）｜大陵 PC7（腕掌側遠端橫紋中點，兩筋之間，心包經原穴）｜外關 TE5（腕背橫紋上 2 寸，尺橈骨之間，三焦經絡穴）｜少商 LU11（拇指末節橈側，距指甲根角 0.1 寸，肺經井穴）｜少衝 HT9（小指末節橈側，距指甲角 0.1 寸，心經井穴）。',
            en: 'Five more to know. 列缺 LU7 — above the radial styloid, 1.5 cun above the distal palmar wrist crease; the Lung luo-connecting point. 大陵 PC7 — the midpoint of the distal palmar wrist crease, between the same two tendons; the Pericardium yuan-source. 外關 TE5 — 2 cun above the dorsal wrist crease, between ulna and radius; the Triple Energiser luo-connecting point. 少商 LU11 — the radial side of the thumb’s distal segment, 0.1 cun from the nail corner; the Lung jing-well. 少衝 HT9 — the radial side of the little finger’s distal segment, 0.1 cun from the nail corner; the Heart jing-well.',
          },
          {
            zhHant:
              '關鍵體表標志一：赤白肉際——手掌（赤）與手背（白）皮膚交界的那條稜線。已收錄的穴位中，後溪 SI3 與腕骨 SI4 的定位文字本身就寫明位於赤白肉際；三間 LI3 在第 2 掌指關節橈側近端凹陷，也是沿著這條界線。中渚 TE3 則在手背第 4、5 掌骨間，不在赤白肉際上——這條線是界線，不是所有輸穴的集合。',
            en: 'Surface landmark one: the red-white boundary, the ridge where the palm’s skin (red) meets the back of the hand’s (white). Of the loaded points, 後溪 SI3 and 腕骨 SI4 name that boundary in their own location text, and 三間 LI3 sits along it at the radial side of the second metacarpophalangeal joint. 中渚 TE3 does not — it is on the dorsum between the fourth and fifth metacarpals. The boundary is a line, not a container for every shu-stream point.',
          },
          {
            zhHant:
              '關鍵體表標志二：腕橫紋——前臂與手的分界。掌側橫紋上，橈側有太淵 LU9、中點有大陵 PC7、尺側端有神門 HT7。背側是另一條線：腕背橫紋中點是陽池 TE4，而陽谷 SI5 在腕後區、尺骨莖突與三角骨之間。掌側與背側要分開記。',
            en: 'Surface landmark two: the wrist creases, where the forearm ends. On the PALMAR crease: 太淵 LU9 at the radial end, 大陵 PC7 at the midpoint, 神門 HT7 at the ulnar end. The DORSAL side is a separate line: 陽池 TE4 at the midpoint of the dorsal wrist crease, and 陽谷 SI5 behind it, between the ulnar styloid and the triquetral bone. Keep the two sides apart in memory.',
          },
          {
            zhHant:
              '關鍵體表標志三：兩筋之間——掌長肌腱與橈側腕屈肌腱之間的縫隙。大陵 PC7 在橫紋上的這道縫，內關 PC6 在其上 2 寸的同一道縫；這條走廊繼續往上，但再上去已屬前臂分區。關鍵體表標志四：掌骨間隙——合谷 LI4 在第 1、2 掌骨之間，中渚 TE3 在第 4、5 掌骨間。',
            en: 'Surface landmark three: the gap between two tendons — palmaris longus and flexor carpi radialis. 大陵 PC7 sits in that gap at the crease and 內關 PC6 in the same gap 2 cun above it. The corridor continues further up, but past that it belongs to the forearm region. Landmark four: the spaces between metacarpals — 合谷 LI4 between the first and second, 中渚 TE3 between the fourth and fifth.',
          },
        ],
      },
      {
        id: 'sec_14_do',
        kind: 'do',
        titleZhHant: '【做】在自己手上找',
        titleEn: 'Do — find them on your own hand',
        sourceIds: [WORKSHEET14],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「腕部及手部」，進入放大檢視。這一區在圖上跨左右兩側——每條經只畫單側以利辨識——所以兩隻手都要看。',
            en: 'Open the Regions tab, choose Wrist & hand, and work in the magnified view. This region spans both of the figure’s sides, because each channel is drawn on one side only for legibility, so read both hands.',
          },
          {
            zhHant:
              '一、赤白肉際追蹤：用一手指沿著另一手掌背交界那條稜線滑動，找到後溪 SI3 與三間 LI3，再轉到手背找中渚 TE3，體會「界線上」與「手背上」的差別。二、腕橫紋對比：拇指依序落在太淵 LU9（橈動脈搏動處）、大陵 PC7（兩筋中點）、神門 HT7（尺側端，尺側腕屈肌腱橈側），閉眼比較三個位置的深淺。',
            en: 'One — trace the boundary: run a fingertip along the ridge where palm meets back of hand, find 後溪 SI3 and 三間 LI3 on it, then turn the hand over for 中渚 TE3 and feel the difference between "on the boundary" and "on the dorsum". Two — compare along the crease: rest a thumb on 太淵 LU9 (where the radial artery pulses), then 大陵 PC7 (midpoint, between the tendons), then 神門 HT7 (ulnar end, radial to the FCU tendon), and with eyes closed compare how deep each sits.',
          },
          {
            zhHant:
              '三、內外相對：在 App 中同時選中內關 PC6 與外關 TE5，再用拇指與中指從前臂兩面輕輕對按，感覺兩點確實隔著尺橈骨相對——這是表裡兩經在同一高度的位置關係，不是任何處置。四、井穴巡禮：高亮六個井穴（少商 LU11、商陽 LI1、中衝 PC9、關衝 TE1、少衝 HT9、少澤 SI1），用指甲輕觸各指甲角邊緣，確認每一個都在「指甲角旁 0.1 寸」這個統一規則上。',
            en: 'Three — opposite faces: select 內關 PC6 and 外關 TE5 together in the app, then rest a thumb on one and a middle finger on the other with gentle opposing pressure, and feel that the two really do face each other through the forearm. That is a positional relationship between paired channels at the same level — nothing more. Four — the jing-well tour: highlight all six (少商 LU11, 商陽 LI1, 中衝 PC9, 關衝 TE1, 少衝 HT9, 少澤 SI1) and touch the edge of each nail corner in turn, confirming that every one follows the same rule: 0.1 cun from the corner of the nail.',
          },
        ],
      },
      {
        id: 'sec_14_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET14],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '手部六經分佈口訣（七言）：「拇指裡肺少商起，食指大腸合谷聚；中指心包內關護，無名三焦外關衛；小指橈側心經起，尺側小腸太陽會。」',
            en: 'The six-channel mnemonic, seven characters to a clause: 「拇指裡肺少商起，食指大腸合谷聚；中指心包內關護，無名三焦外關衛；小指橈側心經起，尺側小腸太陽會。」',
          },
          {
            zhHant:
              '最後一句是全首最容易寫錯的地方，值得單獨檢查：小指兩側各有一條經，少衝 HT9 在小指末節橈側（靠掌、靠內），少澤 SI1 在小指末節尺側（靠背、靠外）。心經走橈側、小腸經走尺側——記反了，整隻手的陰陽就翻了。',
            en: 'The last clause is the one that goes wrong most easily, so check it on its own: the little finger carries a channel on each side. 少衝 HT9 is on the RADIAL side of its distal segment — the palm side, the inner one. 少澤 SI1 is on the ULNAR side — the outer one. Heart radial, Small Intestine ulnar. Reverse them and the yin and yang of the whole hand turn over with them.',
          },
          {
            zhHant:
              '原穴集中營：腕部一線上有四個原穴——掌側三個（太淵 LU9、大陵 PC7、神門 HT7），背側一個（陽池 TE4）。傳統以原穴為臟腑原氣所過之處；這是傳統框架的說法，本課只用它來把四個位置綁成一組。',
            en: 'The yuan-source cluster: four of them along the wrist — three on the palmar side (太淵 LU9, 大陵 PC7, 神門 HT7) and one on the dorsal (陽池 TE4). The tradition describes the yuan-source points as where a organ’s original qi passes; that is the traditional framing, and this lesson uses it only as a thread to tie four locations together.',
          },
          {
            zhHant:
              '形象聯想：合谷像掌骨之間深陷的山谷；後溪是第 5 掌指關節後那道溪流般的凹陷；內關、外關是前臂內外兩側同一高度的兩道關口。',
            en: 'Images to hang them on: 合谷, a valley sunk between metacarpals; 後溪, the stream-like hollow behind the fifth metacarpophalangeal joint; 內關 and 外關, two gates at the same height on opposite faces of the forearm.',
          },
        ],
      },
      {
        id: 'sec_14_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET14],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、盲點定位：請同伴在 App 中隨機點一個手部穴位（例如中渚或列缺），你在五秒內在自己手上指出位置，並說出歸經與分類。',
            en: 'One — blind location: have someone tap a hand point at random in the app (中渚 or 列缺, say). Within five seconds, point to it on your own hand and name its channel and its category.',
          },
          {
            zhHant:
              '二、骨性標志連線：在放大檢視中，沿「橈骨莖突 → 太淵 LU9 → 大陵 PC7 → 尺骨莖突」畫一條橫過腕部的線。問：神門 HT7 落在這條線的哪一端？（尺側端；再精確一點是尺側腕屈肌腱的橈側凹陷處。）',
            en: 'Two — the landmark line: in the magnified view, draw a line across the wrist through 橈骨莖突 → 太淵 LU9 → 大陵 PC7 → 尺骨莖突. Where on that line does 神門 HT7 fall? (At the ulnar end — more precisely, in the depression radial to the flexor carpi ulnaris tendon.)',
          },
          {
            zhHant:
              '三、表裡配對：說出下列三組的配對關係與依據。內關 PC6 ↔ 外關 TE5（心包與三焦互為表裡，兩者皆為絡穴）；太淵 LU9 ↔ 合谷 LI4（肺與大腸互為表裡，兩者皆為原穴）；神門 HT7 ↔ 腕骨 SI4（心與小腸互為表裡，兩者皆為原穴）。三組的共同結構：同一類特定穴，跨表裡兩經。',
            en: 'Three — interior–exterior pairs: give the pairing and say what makes it one. 內關 PC6 ↔ 外關 TE5 (Pericardium and Triple Energiser are paired; both are luo-connecting points). 太淵 LU9 ↔ 合谷 LI4 (Lung and Large Intestine are paired; both are yuan-source). 神門 HT7 ↔ 腕骨 SI4 (Heart and Small Intestine are paired; both are yuan-source). The shared shape: the same category of point, across a paired channel.',
          },
          {
            zhHant:
              '四、辨析：有人分不清太淵與神門。用一句話分開它們——太淵在腕掌側橫紋橈側、橈動脈搏動處；神門在同一條橫紋的尺側端、尺側腕屈肌腱的橈側凹陷處。同一條線，兩個端點。',
            en: 'Four — tell two apart: 太淵 sits at the radial end of the palmar wrist crease where the radial artery pulses; 神門 sits at the ulnar end of the same crease, in the depression radial to the FCU tendon. One line, opposite ends.',
          },
        ],
      },
      {
        id: 'sec_14_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET14],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是手，全身穴位最密的一段。六條經從我這裡通過：掌面是肺、心包、心，背面是大腸、三焦、小腸——腎經與胃經到不了我這裡。掌背交界的赤白肉際是一條界線，後溪與腕骨就寫在這條線上。我的腕橫紋上排著三個原穴：太淵在橈側、大陵在中點、神門在尺側端；背面還有一個陽池。內關與外關隔著尺橈骨相對。在這裡我不看全身流注，只磨一隻手的精準。」',
            en: 'Record one minute: “I am the hand, the densest stretch of points on the body. Six channels pass through me — Lung, Pericardium and Heart on the palm; Large Intestine, Triple Energiser and Small Intestine on the back. The Kidney and Stomach channels never reach me. Where my palm’s skin meets my back’s there is a boundary line, and 後溪 and 腕骨 are written on it. Along my palmar wrist crease sit three yuan-source points: 太淵 at the radial end, 大陵 at the midpoint, 神門 at the ulnar end — and 陽池 on the far side. 內關 and 外關 face each other through the forearm bones. Here I am not tracing the whole body’s flow; I am sharpening one hand.”',
          },
        ],
      },
      {
        id: 'sec_14_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D1：①合谷 LI4 定位 ②列缺 LU7 定位 ③少商 LU11 的井穴屬性。回鍋 D3：①神門 HT7 定位 ②少衝 HT9 的井穴屬性。回鍋 D7：①內關 PC6 定位 ②外關 TE5 定位。',
            en: 'Day 1 back: the location of 合谷 LI4, the location of 列缺 LU7, and that 少商 LU11 is a jing-well. Day 3 back: the location of 神門 HT7, and that 少衝 HT9 is a jing-well. Day 7 back: the locations of 內關 PC6 and 外關 TE5.',
          },
          {
            zhHant:
              '【未收錄】原始課稿把本區的穴位與主治連在一起（如「治落枕腰痛」「治偏頭痛」），並含一項侵入性的急救操作說法與一個療效最高級稱謂。依專案安全規則，症狀→穴位的對應、療效聲稱與侵入性操作一律不收錄；本課只教定位、歸經與分類。',
            en: '[NOT INGESTED] The source draft attached indications to several of these points, described an invasive first-aid procedure, and gave one point an efficacy superlative. Symptom-to-point mappings, efficacy claims and invasive procedures are not carried into this app. This day teaches location, channel attribution and point category only.',
          },
        ],
      },
    ],
  },
  /*
   * Day 15 — the second region lesson.
   *
   * The owner's draft had already stripped six efficacy claims and one
   * needling term. Corrected here against the acupoint records:
   *
   *  1. The draft's 肘橫紋 summary put 尺澤 on the 內側 and 小海 on the 外側.
   *     Both are backwards: 尺澤 LU5 is 肱二頭肌腱橈側 (lateral) and 小海 SI8 is
   *     尺骨鷹嘴與肱骨內上髁之間 (medial). The draft contradicted itself — its own
   *     practical section and its own quiz answer had them the right way round.
   *  2. 「肱二頭肌腱是肘橫紋內側最明顯的肌腱」. The records place it at the MIDDLE
   *     of the crease: 尺澤 sits on its radial edge, 曲澤 on its ulnar edge.
   *  3. 「陽經行於兩骨之間（三焦、大腸），陰經行於兩筋之間（心包、肺）」 is tidy and
   *     half wrong. Only 三焦 runs 尺骨與橈骨之間 and only 心包 runs 掌長肌腱與
   *     橈側腕屈肌腱之間; 大腸 (手三里, 陽谿–曲池 line) and 肺 (孔最, 尺澤–太淵
   *     line) both run the RADIAL border.
   *  4. 「少海肘內尺骨通」 — 少海 HT3's landmark is 肱骨內上髁, not the ulna. The
   *     ulna belongs to 小海 SI8, the point it is most often confused with.
   *
   * Also removed: 「力最宏」 (an efficacy superlative of the kind already cut
   * elsewhere), and four instructions to use app features that do not exist —
   * a virtual cun ruler, a skeletal x-ray mode, a bone-seam overlay and an
   * animated forearm rotation. The lesson now asks for what the lens does.
   *
   * The spine of the day is derived rather than taken from the draft: this
   * region holds ALL SIX he-sea points and ALL SIX xi-cleft points of the hand
   * channels, one of each per channel. The draft named three and two.
   */
  {
    id: 'day_15',
    dayNumber: 15,
    titleZhHant: '肘部及前臂 — 六合六郄，與十二寸的尺',
    titleEn: 'Elbow & forearm — six he-sea, six xi-cleft, and a twelve-cun rule',
    hookZhHant: '手上六條經，每一條都把自己的合穴留在肘、把自己的郄穴留在前臂。這一區是十二個特定穴的集合地。',
    hookEn: 'Each of the six hand channels leaves its he-sea point at the elbow and its xi-cleft point in the forearm. Twelve specific points, one region.',
    meridianIds: ['mer_lu', 'mer_li', 'mer_ht', 'mer_si', 'mer_pc', 'mer_te'],
    sourceIds: [WORKSHEET15, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己手臂上找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own arm, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_15_learn',
        kind: 'learn',
        titleZhHant: '【學】六個合穴在肘，六個郄穴在前臂',
        titleEn: 'Learn — six he-sea at the elbow, six xi-cleft in the forearm',
        sourceIds: [WORKSHEET15],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這一區收錄 26 個穴，走的還是昨天那六條經：肺 LU、心包 PC、心 HT 在掌面，大腸 LI、三焦 TE、小腸 SI 在背面。差別在於，手部是井滎輸的地盤，肘與前臂則是合穴與郄穴的地盤——六條經在這裡各留下一個合穴、一個郄穴，十二個，一個不少。',
            en: 'Twenty-six loaded points, and the same six channels as yesterday: Lung, Pericardium and Heart on the palmar side, Large Intestine, Triple Energiser and Small Intestine on the dorsal. What changes is the category. The hand is where the jing-well, ying-spring and shu-stream points live; the elbow and forearm are where the he-sea and xi-cleft points live — one of each, for every one of the six channels. Twelve points, none missing.',
          },
          {
            zhHant:
              '★ 六個合穴，全在肘關節一圈：尺澤 LU5（肘橫紋中，肱二頭肌腱橈側凹陷）｜曲澤 PC3（肘橫紋中點，肱二頭肌腱尺側緣凹陷）｜少海 HT3（屈肘，肘橫紋內側端與肱骨內上髁連線中點）｜曲池 LI11（尺澤與肱骨外上髁連線中點；屈肘成直角時肘彎橫紋盡頭）｜小海 SI8（肘後區，尺骨鷹嘴與肱骨內上髁之間凹陷）｜天井 TE10（肘後區，肘尖即尺骨鷹嘴上方凹陷，約肘尖上 1 寸）。',
            en: 'The six he-sea points, all within a hand’s breadth of the elbow. 尺澤 LU5 — in the cubital crease, in the depression on the RADIAL edge of the biceps tendon. 曲澤 PC3 — the midpoint of the same crease, on the ULNAR edge of that tendon. 少海 HT3 — elbow flexed, midway between the medial end of the crease and the medial epicondyle. 曲池 LI11 — midway between 尺澤 and the lateral epicondyle; at the end of the crease with the elbow at a right angle. 小海 SI8 — behind the elbow, between the olecranon and the medial epicondyle. 天井 TE10 — behind the elbow, in the depression about 1 cun above the tip.',
          },
          {
            zhHant:
              '★ 六個郄穴，全在前臂：孔最 LU6（前臂掌面橈側，尺澤與太淵連線，腕橫紋上 7 寸）｜郄門 PC4（腕橫紋上 5 寸，兩筋之間）｜陰郄 HT6（腕橫紋上 0.5 寸，尺側腕屈肌腱橈側）｜溫溜 LI7（前臂背面橈側，陽谿與曲池連線）｜養老 SI6（腕背橫紋上 1 寸，尺骨頭橈側凹陷，掌心向胸取穴）｜會宗 TE7（前臂後區，尺骨橈側緣）。郄是孔隙，這一類穴在傳統框架裡被說成氣血深聚之處；本課只用它把六個位置綁成一組。',
            en: 'The six xi-cleft points, all in the forearm. 孔最 LU6 — palmar-radial forearm, on the 尺澤–太淵 line, 7 cun above the wrist crease. 郄門 PC4 — 5 cun above the crease, between the two tendons. 陰郄 HT6 — 0.5 cun above the crease, radial to the flexor carpi ulnaris tendon. 溫溜 LI7 — dorsal-radial forearm, on the 陽谿–曲池 line. 養老 SI6 — 1 cun above the dorsal wrist crease, in the depression on the radial side of the head of the ulna, found with the palm turned toward the chest. 會宗 TE7 — posterior forearm, at the radial border of the ulna. 郄 means a cleft; the tradition describes this category as where the qi gathers deeply. This lesson uses it only to bind six locations into one group.',
          },
          {
            zhHant:
              '關鍵體表標志一：肘橫紋。肱二頭肌腱在橫紋的中間，是這一區最好摸的標志——尺澤在它的橈側（外），曲澤在它的尺側（內）。再往內是少海，貼著肱骨內上髁；再往外是曲池，貼著肱骨外上髁。翻到肘後，尺骨鷹嘴與肱骨內上髁之間是小海，鷹嘴正上方是天井。',
            en: 'Surface landmark one: the cubital crease. The biceps tendon crosses the MIDDLE of it and is the easiest thing to find here — 尺澤 lies on its radial (outer) side, 曲澤 on its ulnar (inner) side. Further medial is 少海 against the medial epicondyle; further lateral is 曲池 against the lateral epicondyle. Turn to the back of the elbow: 小海 sits between the olecranon and the medial epicondyle, and 天井 just above the tip.',
          },
          {
            zhHant:
              '關鍵體表標志二：前臂的兩條走廊，各屬一條經，不要推廣成通則。尺骨與橈骨之間的骨間隙走的是三焦經（外關 TE5 腕上 2 寸、支溝 TE6 腕上 3 寸）；掌長肌腱與橈側腕屈肌腱之間的縫走的是心包經（內關 PC6 腕上 2 寸、間使 PC5 腕上 3 寸、郄門 PC4 腕上 5 寸）。肺經與大腸經都不走這兩條——它們沿橈側緣上行：孔最 LU6 在尺澤與太淵的連線上，手三里 LI10、溫溜 LI7 在陽谿與曲池的連線上。',
            en: 'Surface landmark two: the forearm has two corridors, and each belongs to ONE channel — do not generalise them into a rule. The interosseous space between ulna and radius carries the Triple Energiser (外關 TE5 at 2 cun above the wrist, 支溝 TE6 at 3). The gap between palmaris longus and flexor carpi radialis carries the Pericardium (內關 PC6 at 2, 間使 PC5 at 3, 郄門 PC4 at 5). Neither the Lung nor the Large Intestine uses either corridor: both run the RADIAL border — 孔最 LU6 on the 尺澤–太淵 line, and 手三里 LI10 and 溫溜 LI7 on the 陽谿–曲池 line.',
          },
          {
            zhHant:
              '關鍵體表標志三：十二寸的尺。腕掌側遠端橫紋到肘橫紋定為 12 寸，是上肢最常用的量尺。整條前臂的刻度都掛在它上面：腕上 0.5 寸陰郄、1 寸養老（背側）、2 寸內關與外關、3 寸間使與支溝、5 寸郄門、7 寸孔最；另一端由肘往下數，肘橫紋下 2 寸是手三里 LI10。',
            en: 'Surface landmark three: the twelve-cun rule. The distance from the distal palmar wrist crease to the cubital crease is defined as 12 cun, and it is the most used measure on the upper limb. The whole forearm hangs off it: 0.5 cun 陰郄, 1 cun 養老 (dorsal), 2 cun 內關 and 外關, 3 cun 間使 and 支溝, 5 cun 郄門, 7 cun 孔最 — and counting down from the other end, 2 cun below the cubital crease is 手三里 LI10.',
          },
        ],
      },
      {
        id: 'sec_15_do',
        kind: 'do',
        titleZhHant: '【做】在自己手臂上找',
        titleEn: 'Do — find them on your own arm',
        sourceIds: [WORKSHEET15],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「肘部及前臂」。這一區同樣橫跨圖上左右兩側——每條經只畫單側——所以兩隻手臂都要看。用 ＋ 放大、拖曳平移、「全區」回到整區。',
            en: 'Open the Regions tab and choose Elbow & forearm. Like yesterday this region spans both of the figure’s sides, since each channel is drawn on one side only, so read both arms. Use ＋ to magnify, drag to pan, and Fit to come back to the whole region.',
          },
          {
            zhHant:
              '一、肘橫紋由外到內：屈肘，先摸到中間那條肱二頭肌腱。拇指從它的橈側落下——尺澤 LU5；移到它的尺側——曲澤 PC3；再往內到肱骨內上髁前方——少海 HT3；回到最外側、橫紋盡頭——曲池 LI11。四個點一條線，三個標志（肌腱、內上髁、外上髁）。',
            en: 'One — across the cubital crease, outside to inside. Flex the elbow and find the biceps tendon crossing the middle. Drop a thumb on its radial side: 尺澤 LU5. Move to its ulnar side: 曲澤 PC3. Further medial, in front of the medial epicondyle: 少海 HT3. Then right out to the end of the crease: 曲池 LI11. Four points on one line, located by three landmarks — the tendon and the two epicondyles.',
          },
          {
            zhHant:
              '二、翻到肘後：找到肘尖（尺骨鷹嘴）。它與肱骨內上髁之間的凹陷是小海 SI8；鷹嘴正上方約 1 寸的凹陷是天井 TE10。小海與少海只差一個字，位置一前一後、一個貼鷹嘴一個貼橫紋，這裡把兩者一次分清。',
            en: 'Two — the back of the elbow. Find the point of the elbow, the olecranon. The depression between it and the medial epicondyle is 小海 SI8; the depression about 1 cun above the tip is 天井 TE10. 小海 and 少海 differ by one character: one is behind the elbow against the olecranon, the other in front against the crease. Settle the two here, once.',
          },
          {
            zhHant:
              '三、兩條走廊，各滑一次：從外關 TE5 沿尺橈骨之間往上 1 寸到支溝 TE6；翻到掌面，從內關 PC6 沿兩筋之間往上到間使 PC5（3 寸）、郄門 PC4（5 寸）。同一隻前臂，兩條互不相干的通道。',
            en: 'Three — run each corridor once. From 外關 TE5, follow the space between the two bones up 1 cun to 支溝 TE6. Turn the arm over and from 內關 PC6 follow the gap between the two tendons up to 間使 PC5 at 3 cun and 郄門 PC4 at 5. One forearm, two corridors that have nothing to do with each other.',
          },
          {
            zhHant:
              '四、十二寸自測：把腕橫紋到肘橫紋當作 12 寸，用自己的手指估出中點（6 寸），再往下一寸找 郄門 PC4（5 寸），往上一寸找 孔最 LU6（7 寸）。最後把手掌轉向胸口，在腕背橫紋上 1 寸摸尺骨頭橈側的凹陷——養老 SI6，是全區唯一需要換體位才好找的點。',
            en: 'Four — measure yourself. Take wrist crease to cubital crease as 12 cun and estimate the midpoint (6 cun) with your own fingers; one cun below it is 郄門 PC4 at 5, one above is 孔最 LU6 at 7. Finally turn your palm toward your chest and feel 1 cun above the dorsal wrist crease for the depression on the radial side of the head of the ulna — 養老 SI6, the one point in this region that needs the arm repositioned before it is easy to find.',
          },
        ],
      },
      {
        id: 'sec_15_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET15],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '肘部合穴口訣（七言）：「肘上六合圍一圈，尺澤腱橈曲澤尖；少海貼著內上髁，曲池外髁小海連；天井獨居鷹嘴上，六經各留一穴全。」',
            en: 'The elbow’s six he-sea points, seven characters to a clause: 「肘上六合圍一圈，尺澤腱橈曲澤尖；少海貼著內上髁，曲池外髁小海連；天井獨居鷹嘴上，六經各留一穴全。」',
          },
          {
            zhHant:
              '最容易記反的是少海與小海，值得單獨檢查：少海 HT3 是心經合穴，在肘前、橫紋內側端，貼肱骨內上髁；小海 SI8 是小腸經合穴，在肘後、尺骨鷹嘴與肱骨內上髁之間。心與小腸互為表裡，兩個穴一前一後隔著同一個內上髁——記住這個共用標志，就不會再換錯。',
            en: 'The pair most easily swapped is 少海 and 小海, so check it on its own. 少海 HT3 is the Heart’s he-sea, in FRONT of the elbow at the medial end of the crease, against the medial epicondyle. 小海 SI8 is the Small Intestine’s he-sea, BEHIND the elbow, between the olecranon and that same epicondyle. Heart and Small Intestine are a paired channel, and their two points sit front and back of one shared landmark. Hold the landmark and the pair stops swapping.',
          },
          {
            zhHant:
              '前臂刻度口訣：「腕上二寸內外關，三寸間使與支溝，五寸郄門七孔最，肘下二寸手三里。」十二寸的尺一擺，前臂的穴就都有了座標。',
            en: 'The forearm’s ladder: 「腕上二寸內外關，三寸間使與支溝，五寸郄門七孔最，肘下二寸手三里。」 Lay the twelve-cun rule along the forearm and every point on it has a coordinate.',
          },
          {
            zhHant:
              '形象聯想：曲池是彎起手肘時出現的池窪；郄門的「郄」是孔隙、「門」是門戶；支溝是尺橈骨之間的一道溝；養老要把手掌轉向胸口才現身，是全區最挑體位的一個。',
            en: 'Images to hang them on: 曲池, the pool that appears when the elbow bends; 郄門, a cleft and a gate; 支溝, the groove between the two bones; 養老, which only shows itself once the palm turns toward the chest — the fussiest point in the region.',
          },
        ],
      },
      {
        id: 'sec_15_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET15],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、肌腱辨別：摸到肘橫紋中間的肱二頭肌腱。問：尺澤在它的哪一側？曲澤呢？（尺澤在橈側／外側；曲澤在尺側／內側。）',
            en: 'One — the tendon test. Find the biceps tendon crossing the middle of the cubital crease. Which side is 尺澤 on, and which side is 曲澤? (尺澤 radial — the outer side; 曲澤 ulnar — the inner.)',
          },
          {
            zhHant:
              '二、少海與小海：兩者都靠著同一個骨性標志，是哪一個？各在肘的前面還是後面？各屬哪一條經？（同為肱骨內上髁；少海 HT3 在肘前，屬心經；小海 SI8 在肘後，屬小腸經；兩經互為表裡，兩穴同為合穴。）',
            en: 'Two — 少海 versus 小海. They share one bony landmark: which? Which is in front of the elbow and which behind? Which channel is each? (Both use the medial epicondyle; 少海 HT3 in front, on the Heart channel; 小海 SI8 behind, on the Small Intestine. The two channels are a pair, and both points are he-sea.)',
          },
          {
            zhHant:
              '三、骨度分寸：腕橫紋到肘橫紋為 12 寸。內關 PC6 在腕上 2 寸，等於這條線的幾分之幾？（2 ÷ 12 = 1/6。）再問：孔最 LU6 在 7 寸，離肘橫紋還有幾寸？（12 − 7 = 5 寸。）',
            en: 'Three — bone-cun arithmetic. Wrist crease to cubital crease is 12 cun. 內關 PC6 is 2 cun above the wrist: what fraction of the line is that? (2 ÷ 12 = 1/6.) And 孔最 LU6 is at 7 cun — how far is it from the cubital crease? (12 − 7 = 5 cun.)',
          },
          {
            zhHant:
              '四、辨正誤：「手三里在曲池下 3 寸。」對還是錯？（錯。手三里 LI10 在肘橫紋下 2 寸，位於陽谿與曲池的連線上。）',
            en: 'Four — true or false: “手三里 is 3 cun below 曲池.” (False. 手三里 LI10 is 2 cun below the cubital crease, on the 陽谿–曲池 line.)',
          },
          {
            zhHant:
              '五、走廊歸屬：尺骨與橈骨之間的骨間隙屬哪一條經？掌長肌腱與橈側腕屈肌腱之間屬哪一條？肺經與大腸經走的又是哪裡？（骨間隙是三焦經；兩筋之間是心包經；肺經與大腸經都沿橈側緣，不走這兩條走廊。）',
            en: 'Five — who owns which corridor? Which channel runs in the interosseous space between ulna and radius? Which runs between palmaris longus and flexor carpi radialis? And where do the Lung and Large Intestine run? (The interosseous space is the Triple Energiser; between the tendons is the Pericardium; the Lung and Large Intestine both follow the radial border and use neither.)',
          },
        ],
      },
      {
        id: 'sec_15_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET15],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是肘和前臂。六條經從我這裡過，每一條都在我的肘上留了一個合穴——尺澤、曲澤、少海在肘前，小海、天井在肘後，曲池在最外側——又在我的前臂留了一個郄穴：孔最、郄門、陰郄、溫溜、養老、會宗。我的肘橫紋中間橫著肱二頭肌腱，尺澤在它外側，曲澤在它內側。我的前臂有兩條走廊：兩骨之間走三焦，兩筋之間走心包，肺經和大腸經誰也不走，它們沿著橈側緣上行。從腕到肘是十二寸，這把尺一擺，我身上每個穴都有了刻度。」',
            en: 'Record one minute: “I am the elbow and forearm. Six channels cross me, and every one of them leaves a he-sea point at my elbow — 尺澤, 曲澤 and 少海 in front, 小海 and 天井 behind, 曲池 furthest out — and a xi-cleft point in my forearm: 孔最, 郄門, 陰郄, 溫溜, 養老, 會宗. The biceps tendon crosses the middle of my crease, with 尺澤 on its outer side and 曲澤 on its inner. I have two corridors: the Triple Energiser runs between my two bones, the Pericardium between my two tendons, and neither the Lung nor the Large Intestine uses either — they follow my radial border. From wrist to elbow I am twelve cun, and once that rule is laid along me, every point on me has a number.”',
          },
        ],
      },
      {
        id: 'sec_15_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D1：①合谷 LI4 定位 ②列缺 LU7 定位 ③太淵 LU9 的原穴與脈會屬性。回鍋 D3：①神門 HT7 定位（尺側腕屈肌腱橈側）②少衝 HT9 的井穴屬性。回鍋 D14：①赤白肉際是界線不是集合 ②腕橫紋上的三個原穴與背側的陽池 ③神門 HT7 ↔ 腕骨 SI4 的原↔原配對。',
            en: 'Day 1 back: the locations of 合谷 LI4 and 列缺 LU7, and that 太淵 LU9 is both a yuan-source and the influential point of the vessels. Day 3 back: the location of 神門 HT7 (radial to the FCU tendon) and that 少衝 HT9 is a jing-well. Day 14 back: that the red-white boundary is a line and not a container; the three yuan-source points on the palmar wrist crease plus 陽池 on the dorsal; and the yuan-to-yuan pairing 神門 HT7 ↔ 腕骨 SI4.',
          },
          {
            zhHant:
              '【未收錄】原始課稿把本區的穴位與主治連在一起（曲池、尺澤、支溝、郄門各有一條），並含一個針法術語與一個療效最高級稱謂。依專案安全規則，症狀→穴位的對應、療效聲稱與針法術語一律不收錄；本課只教定位、歸經與分類。',
            en: '[NOT INGESTED] The source draft attached indications to four of these points, and used one needling term and one efficacy superlative. Symptom-to-point mappings, efficacy claims and needling terminology are not carried into this app. This day teaches location, channel attribution and point category only.',
          },
        ],
      },
    ],
  },
  /*
   * Day 16 — the third region lesson, and the one that closes the arm.
   *
   * The owner's draft arrived already free of indications and needling
   * cautions. Corrected here against the acupoint records:
   *
   *  1. 肩髎 TE14 was attributed to 膽經. It is 手少陽三焦經 — the point's own
   *     code says so, and the record confirms it.
   *  2. The channel list named five. The region carries SEVEN: the draft's own
   *     肩井 GB21 is 足少陽膽經, and 極泉 HT1 and 青靈 HT2 put 手少陰心經 here too.
   *  3. 秉風 SI12 was flagged as a back point needing a proximity caveat. Its
   *     record puts it in the 肩胛區, and this region owns the scapular points —
   *     秉風, 天宗 SI11, 臑俞 SI10, 曲垣 SI13 are all in scope, no caveat needed.
   *  4. 臑會 TE13 was located on a 肩髎–尺骨鷹嘴 line. Its record reads 肩髎下 3 寸,
   *     三角肌後緣與肱三頭肌外側頭之間.
   *  5. The 骨度 ladder listed 臂臑 among measurements taken down from the axilla.
   *     It is measured from the other end: 曲池上 7 寸.
   *  6. The spaced-review block asked the learner to recall 肩髃/肩髎/肩貞 as Day
   *     14 material. Day 14 was the wrist and hand. It also filed 極泉 HT1 and
   *     青靈 HT2 under review, but both are points of THIS region.
   *
   * Three instructions to use app features that do not exist — a skeletal
   * x-ray mode, a 岡上窩/岡下窩 toggle and a biceps-heads overlay — were
   * rewritten for what the lens does.
   *
   * The spine of the day is derived. The arm's channels run in parallel lanes
   * the whole way up: the hand region holds no 交會穴 at all, and neither does
   * the elbow and forearm. This region holds seven. The shoulder is where they
   * finally meet.
   */
  {
    id: 'day_16',
    dayNumber: 16,
    titleZhHant: '肩部及上臂 — 經脈相會的路口',
    titleEn: 'Shoulder & upper arm — where the arm’s channels finally meet',
    hookZhHant: '手部沒有一個交會穴，前臂也沒有。到了肩上，七個。手臂一路各走各的，在這裡交會。',
    hookEn: 'Not one crossing point in the hand. None in the forearm either. Seven at the shoulder — the arm’s channels run in their own lanes the whole way up, and meet here.',
    meridianIds: ['mer_lu', 'mer_li', 'mer_ht', 'mer_si', 'mer_pc', 'mer_te', 'mer_gb'],
    sourceIds: [WORKSHEET16, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己肩上找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own shoulder, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_16_learn',
        kind: 'learn',
        titleZhHant: '【學】七條經，七個交會穴',
        titleEn: 'Learn — seven channels, seven crossing points',
        sourceIds: [WORKSHEET16],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這一區收錄 20 個穴，經脈比前兩天多：手上那六條全在——肺 LU、大腸 LI、心 HT、小腸 SI、心包 PC、三焦 TE——再加上足少陽膽經，因為肩井 GB21 落在肩上。七條經。',
            en: 'Twenty loaded points, and more channels than the last two days carried. All six of the hand channels are here — Lung, Large Intestine, Heart, Small Intestine, Pericardium and Triple Energiser — plus the Gallbladder, because 肩井 GB21 sits on top of the shoulder. Seven in all.',
          },
          {
            zhHant:
              '這一區真正的特徵是交會穴。手部 25 個穴裡一個交會穴也沒有，肘與前臂 26 個穴裡也沒有——那兩區的經脈各走各的道。到了肩上，20 個穴裡有 7 個是交會穴：肩髃 LI15、巨骨 LI16、臑俞 SI10、秉風 SI12、臑會 TE13、天髎 TE15、肩井 GB21。手臂的經脈在這裡才彼此相遇。',
            en: 'What actually distinguishes this region is its crossing points. Of the hand’s twenty-five points, not one is a crossing point; nor is any of the elbow and forearm’s twenty-six — in both regions the channels keep to their own lanes. At the shoulder, seven of twenty are: 肩髃 LI15, 巨骨 LI16, 臑俞 SI10, 秉風 SI12, 臑會 TE13, 天髎 TE15 and 肩井 GB21. This is where the arm’s channels meet each other.',
          },
          {
            zhHant:
              '★ 肩關節一圈的四個穴：肩髃 LI15（三角肌上，臂外展或向前平伸時，肩峰前下方凹陷處；大腸經，交會穴）｜肩髎 TE14（肩關節後下方，肩髃後方約 1 寸，肩峰角與肱骨大結節之間的凹陷；三焦經）｜肩貞 SI9（肩關節後下方，腋後紋頭直上 1 寸；小腸經）｜肩井 GB21（肩上，大椎與肩峰端連線的中點；膽經，交會穴）。',
            en: 'Four points around the joint itself. 肩髃 LI15 — on the deltoid, in the depression anteroinferior to the acromion, which appears when the arm is raised to the side or forward; Large Intestine, a crossing point. 肩髎 TE14 — posteroinferior to the joint, about 1 cun behind 肩髃, in the depression between the acromial angle and the greater tubercle of the humerus; Triple Energiser. 肩貞 SI9 — posteroinferior to the joint, 1 cun directly above the posterior axillary fold; Small Intestine. 肩井 GB21 — on top of the shoulder, midway between 大椎 and the acromion; Gallbladder, a crossing point.',
          },
          {
            zhHant:
              '★ 肩胛區四個穴，全屬小腸經，全在這一區之內（不必當成背部的鄰居）：秉風 SI12（天宗直上，肩胛岡中點上方的岡上窩中；交會穴）｜天宗 SI11（岡下窩中央，肩胛岡中點與肩胛骨下角連線的上 1/3 與 2/3 交點）｜臑俞 SI10（交會穴）｜曲垣 SI13。一條岡把它們分成上下兩窩：秉風在岡上，天宗在岡下。',
            en: 'Four scapular points, all on the Small Intestine channel and all inside this region — they are not neighbours borrowed from the back. 秉風 SI12 — directly above 天宗, in the supraspinous fossa above the midpoint of the scapular spine; a crossing point. 天宗 SI11 — in the centre of the infraspinous fossa, at the junction of the upper third and lower two-thirds of the line from the midpoint of the spine to the inferior angle. 臑俞 SI10 — a crossing point. 曲垣 SI13. One ridge divides them into two hollows: 秉風 above the spine, 天宗 below it.',
          },
          {
            zhHant:
              '★ 上臂內側，沿肱二頭肌排開：天泉 PC2（腋前紋頭下 2 寸，肱二頭肌長短頭之間的溝中；心包經）｜天府 LU3（腋前紋頭下 3 寸，肱二頭肌橈側緣；肺經）｜俠白 LU4（天府下）｜極泉 HT1（腋窩中央，腋動脈搏動處；心經）｜青靈 HT2（肘橫紋上 3 寸，肱二頭肌內側溝中；心經）。外側與後側：臂臑 LI14（三角肌止點，曲池與肩髃連線上，曲池上 7 寸）｜手五里 LI13｜臑會 TE13（肩髎下 3 寸，三角肌後緣與肱三頭肌外側頭之間；交會穴）｜清冷淵 TE11｜消濼 TE12。',
            en: 'The inner upper arm, laid out along the biceps. 天泉 PC2 — 2 cun below the anterior axillary fold, in the groove between the long and short heads; Pericardium. 天府 LU3 — 3 cun below the fold, at the radial border of the biceps; Lung. 俠白 LU4, just below 天府. 極泉 HT1 — the centre of the axilla, where the axillary artery pulses; Heart. 青靈 HT2 — 3 cun above the cubital crease, in the medial bicipital groove; Heart. Outer and posterior: 臂臑 LI14 — at the deltoid insertion, on the 曲池–肩髃 line, 7 cun above 曲池. 手五里 LI13. 臑會 TE13 — 3 cun below 肩髎, between the posterior border of the deltoid and the lateral head of the triceps; a crossing point. 清冷淵 TE11 and 消濼 TE12.',
          },
          {
            zhHant:
              '關鍵體表標志：肩峰是肩上最高的骨性突起，肩髃在它的前下方、肩髎在後下方，兩者相距約 1 寸——這一對最容易記反，靠「舉臂時前面現出的凹陷是肩髃」分開。肩胛岡是肩胛骨後面那道橫脊，分開岡上窩與岡下窩。腋前紋頭與腋後紋頭是兩條皺褶：前者往下量 2 寸是天泉、3 寸是天府，後者往上量 1 寸是肩貞。',
            en: 'Surface landmarks. The acromion is the highest bony prominence on the shoulder: 肩髃 lies anteroinferior to it and 肩髎 posteroinferior, about 1 cun apart — the pair most easily reversed, so hold on to “the depression that appears in FRONT when you raise the arm is 肩髃”. The scapular spine is the ridge across the back of the scapula, separating the supraspinous from the infraspinous fossa. The anterior and posterior axillary folds are the two creases: measure down from the front one — 2 cun to 天泉, 3 cun to 天府 — and up from the back one, 1 cun to 肩貞.',
          },
          {
            zhHant:
              '骨度：腋前紋頭到肘橫紋定為 9 寸，是上臂的量尺。天泉在 2 寸、天府在 3 寸（即這段的三分之一）、青靈在肘上 3 寸（也就是腋下 6 寸）。臂臑則是從另一頭數的——曲池上 7 寸——別把它混進腋下那一組。另外，肩井深部鄰近肺尖與大血管，該處沒有厚實的肌肉墊；本課只在體表確認凹陷的位置，不做任何深部操作。',
            en: 'The bone-cun measure: anterior axillary fold to cubital crease is defined as 9 cun, the rule for the upper arm. 天泉 sits at 2, 天府 at 3 — a third of the way down — and 青靈 at 3 cun above the elbow, which is 6 below the fold. 臂臑 is counted from the other end, 7 cun above 曲池; do not fold it into the axillary group. One anatomical note: deep to 肩井 lie the apex of the lung and large vessels, with no thick muscle between. This lesson only confirms where the surface depression is, and goes no further.',
          },
        ],
      },
      {
        id: 'sec_16_do',
        kind: 'do',
        titleZhHant: '【做】在自己肩上找',
        titleEn: 'Do — find them on your own shoulder',
        sourceIds: [WORKSHEET16],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「肩部及上臂」。這一區的穴分佈在正面與背面兩張圖上，用標題列的「正面／背面」切換；肩胛區的穴要到背面才看得到。用 ＋ 放大、拖曳平移、「全區」回到整區。',
            en: 'Open the Regions tab and choose Shoulder & upper arm. This region’s points are spread across both body views — use the Front/Back control in the header; the scapular points only appear on the back. ＋ magnifies, drag pans, Fit returns to the whole region.',
          },
          {
            zhHant:
              '一、肩峰前後：用一手摸對側肩上最高的骨突（肩峰）。把手臂向前平舉，肩峰前下方會現出一個凹陷——肩髃 LI15。放下手臂，往後約 1 寸摸另一個凹陷——肩髎 TE14。再往下、腋後紋頭直上 1 寸——肩貞 SI9。三個穴繞著同一個骨突，前、後、下各一。',
            en: 'One — around the acromion. Feel the highest bony prominence on the opposite shoulder. Raise that arm forward and a depression appears in front of and below it: 肩髃 LI15. Lower the arm and feel about 1 cun behind for a second depression: 肩髎 TE14. Then lower still, 1 cun directly above the posterior axillary fold: 肩貞 SI9. Three points around one prominence — front, back and below.',
          },
          {
            zhHant:
              '二、一條岡，兩個窩：手繞到對側肩胛骨，摸到那道橫脊（肩胛岡）。脊的上方是岡上窩，中點上方就是秉風 SI12；脊的下方是岡下窩，中央是天宗 SI11。在 App 中切到背面，點選這兩個穴，對照清單上的定位文字再摸一次。',
            en: 'Two — one ridge, two hollows. Reach across to the opposite scapula and find the ridge running across it. Above the ridge is the supraspinous fossa, and above its midpoint sits 秉風 SI12. Below is the infraspinous fossa, with 天宗 SI11 at its centre. Switch the lens to the back view, select each of the two, and read its location text before feeling for it again.',
          },
          {
            zhHant:
              '三、上臂內側的一條溝：手臂稍外展，摸到腋前紋頭。沿肱二頭肌往下量 2 寸，兩個肌頭之間的溝中是天泉 PC2；再往下 1 寸、移到肌肉的橈側緣是天府 LU3。體會「筋間」（溝裡）與「筋邊」（緣上）的差別——這是兩條不同的經。',
            en: 'Three — the groove on the inner arm. Abduct the arm slightly and find the anterior axillary fold. Measure 2 cun down along the biceps: in the groove between its two heads is 天泉 PC2. One cun further down, moving to the radial border of the muscle, is 天府 LU3. Feel the difference between being IN the groove and being ON the border — they belong to two different channels.',
          },
          {
            zhHant:
              '四、三角肌的止點：屈肘用力，三角肌前緣會繃起來。沿曲池與肩髃的連線，從肘往上量 7 寸，落在三角肌止點處——臂臑 LI14。這是全區唯一從肘端起算的穴。',
            en: 'Four — the deltoid insertion. Flex the elbow with effort and the front border of the deltoid tightens. Along the line from 曲池 to 肩髃, measure 7 cun up from the elbow: that is 臂臑 LI14, at the deltoid insertion — the only point in this region counted from the elbow end.',
          },
        ],
      },
      {
        id: 'sec_16_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET16],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '肩峰三穴口訣（七言）：「舉臂前陷是肩髃，後方一寸肩髎居；腋後紋上一寸取，肩貞繞骨第三處。」',
            en: 'The three points around the acromion, seven characters to a clause: 「舉臂前陷是肩髃，後方一寸肩髎居；腋後紋上一寸取，肩貞繞骨第三處。」',
          },
          {
            zhHant:
              '肩髃與肩髎最容易記反，值得單獨檢查：肩髃 LI15 屬大腸經，在肩峰前下方，舉臂時凹陷才現；肩髎 TE14 屬三焦經，在肩峰後下方，位於肩峰角與肱骨大結節之間。兩者同繞一個肩峰，一前一後，分屬兩條不同的陽經——不是同一條經上的兩個穴。',
            en: 'The pair most easily reversed is 肩髃 and 肩髎, so check it on its own. 肩髃 LI15 belongs to the Large Intestine and lies anteroinferior to the acromion, its depression appearing only when the arm is raised. 肩髎 TE14 belongs to the Triple Energiser and lies posteroinferior, between the acromial angle and the greater tubercle. Two points around one acromion, front and back, on two different yang channels — not two points of the same one.',
          },
          {
            zhHant:
              '上臂刻度口訣：「腋前紋下二天泉，三寸天府橈緣邊；肘上三寸青靈在，臂臑須從曲池番。」九寸的尺從腋前紋頭量到肘橫紋，上臂的穴就都有了座標；只有臂臑是從肘那一端起算的。',
            en: 'The upper arm’s ladder: 「腋前紋下二天泉，三寸天府橈緣邊；肘上三寸青靈在，臂臑須從曲池番。」 Lay the nine-cun rule from the anterior axillary fold to the cubital crease and the upper arm’s points all have coordinates — with 臂臑 the one exception, counted from the elbow end.',
          },
          {
            zhHant:
              '形象聯想：肩峰是一座山峰，肩髃在南坡、肩髎在北坡；肩胛岡是一道分水嶺，秉風在嶺上的窩、天宗在嶺下的窩；肩井是大椎與肩峰之間那口井。',
            en: 'Images to hang them on: the acromion is a peak, with 肩髃 on its southern slope and 肩髎 on its northern; the scapular spine is a watershed, 秉風 in the hollow above it and 天宗 in the hollow below; and 肩井 is the well midway between 大椎 and the point of the shoulder.',
          },
        ],
      },
      {
        id: 'sec_16_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET16],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、繞著肩峰：肩髃與肩髎各在肩峰的哪一面？各屬哪一條經？（肩髃 LI15 在前下方，大腸經；肩髎 TE14 在後下方，三焦經。兩條不同的陽經。）',
            en: 'One — around the acromion. Which side of it is 肩髃 on, and which side 肩髎? Which channel is each? (肩髃 LI15 anteroinferior, Large Intestine; 肩髎 TE14 posteroinferior, Triple Energiser — two different yang channels.)',
          },
          {
            zhHant:
              '二、一岡兩窩：秉風與天宗分別在肩胛岡的上方還是下方？同屬哪一條經？（秉風 SI12 在岡上窩，天宗 SI11 在岡下窩；同屬小腸經。）',
            en: 'Two — one ridge, two hollows. Is 秉風 above or below the scapular spine, and 天宗? Which channel do they share? (秉風 SI12 in the supraspinous fossa, 天宗 SI11 in the infraspinous; both Small Intestine.)',
          },
          {
            zhHant:
              '三、骨度分寸：腋前紋頭到肘橫紋為 9 寸。天府在腋紋頭下 3 寸，佔這一段的幾分之幾？（3 ÷ 9 = 1/3。）青靈在肘上 3 寸，換算成腋下幾寸？（9 − 3 = 6 寸。）',
            en: 'Three — bone-cun arithmetic. Anterior axillary fold to cubital crease is 9 cun. 天府 is 3 cun below the fold: what fraction of the segment is that? (3 ÷ 9 = 1/3.) 青靈 is 3 cun above the elbow — how far below the fold? (9 − 3 = 6 cun.)',
          },
          {
            zhHant:
              '四、量錯了端：臂臑 LI14 是從腋前紋頭往下量的嗎？（不是。臂臑在曲池與肩髃連線上，曲池上 7 寸，從肘那一端起算，落在三角肌止點處。）',
            en: 'Four — measured from which end? Is 臂臑 LI14 counted down from the anterior axillary fold? (No. It is on the 曲池–肩髃 line, 7 cun above 曲池 — counted from the ELBOW end — at the deltoid insertion.)',
          },
          {
            zhHant:
              '五、交會穴：手部與前臂各有幾個交會穴？這一區有幾個？（手部 0、前臂 0、肩部 7：肩髃 LI15、巨骨 LI16、臑俞 SI10、秉風 SI12、臑會 TE13、天髎 TE15、肩井 GB21。手臂的經脈到肩上才相會。）',
            en: 'Five — crossing points. How many does the hand hold, and the elbow and forearm? How many are here? (Nought and nought; seven here — 肩髃 LI15, 巨骨 LI16, 臑俞 SI10, 秉風 SI12, 臑會 TE13, 天髎 TE15 and 肩井 GB21. The arm’s channels only meet at the shoulder.)',
          },
        ],
      },
      {
        id: 'sec_16_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET16],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是肩和上臂，手臂的路口。手部沒有一個交會穴，前臂也沒有——那兩段的經脈各走各的道；到了我這裡，二十個穴裡有七個是交會穴，七條經在我身上相遇。我的肩峰是一座骨頭的山峰：舉起手臂，前面現出的凹陷是肩髃，後面一寸是肩髎，一個屬大腸經，一個屬三焦經。我背後的肩胛岡分出兩個窩，上窩是秉風，下窩是天宗。我的內側沿著肱二頭肌排開：溝裡是天泉，橈側緣上是天府。從腋前紋頭到肘橫紋，我是九寸。」',
            en: 'Record one minute: “I am the shoulder and upper arm, the arm’s junction. The hand holds no crossing points and neither does the forearm — down there the channels keep to their own lanes. Here, seven of my twenty points are crossing points, and seven channels meet on me. My acromion is a peak of bone: raise the arm and the depression that appears in front of it is 肩髃, and one cun behind is 肩髎 — one on the Large Intestine, one on the Triple Energiser. Behind me the scapular spine makes two hollows, 秉風 above and 天宗 below. Down my inner side the points follow the biceps: 天泉 in the groove, 天府 on the radial border. From my anterior axillary fold to the crease of my elbow, I am nine cun.”',
          },
        ],
      },
      {
        id: 'sec_16_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D1：①合谷 LI4 定位 ②曲池 LI11 是大腸經合穴——今天的臂臑正是從它往上 7 寸量出來的。回鍋 D14（腕與手）：①赤白肉際是界線不是集合 ②腕橫紋上的三個原穴與背側的陽池 ③神門 HT7 ↔ 腕骨 SI4 的原↔原配對。回鍋 D15（肘與前臂）：①六個合穴全在肘 ②六個郄穴全在前臂 ③兩條走廊各屬一條經：骨間隙是三焦，兩筋之間是心包。',
            en: 'Day 1 back: the location of 合谷 LI4, and that 曲池 LI11 is the Large Intestine’s he-sea — today’s 臂臑 is measured 7 cun up from it. Day 14 back (wrist and hand): the red-white boundary is a line and not a container; the three yuan-source points on the palmar wrist crease plus 陽池 on the dorsal; and the yuan-to-yuan pairing 神門 HT7 ↔ 腕骨 SI4. Day 15 back (elbow and forearm): all six he-sea points are at the elbow, all six xi-cleft points in the forearm, and each corridor belongs to one channel — the interosseous space to the Triple Energiser, between the two tendons to the Pericardium.',
          },
        ],
      },
    ],
  },
  /*
   * Day 17 — the chest, and the first day whose ingest changed the dataset.
   *
   * The draft's own claim — that the Kidney channel runs 2 寸 lateral across
   * the chest — disagreed with six acupoint records, which carried the
   * ABDOMINAL 0.5 寸 for all of KI22–KI27. The owner ruled for the standard
   * (GB/T 12346-2021, WHO SPAL); the six records and their placements were
   * corrected, and a Day 6 quiz item that taught 俞府 at 0.5 寸 with it. The
   * ladder now reads 0 / 2 / 4 / 5 / 6 instead of 0 / 0.5 / 4 / 5 / 6.
   *
   * Four things in the draft were corrected here against the records:
   *
   *  1. 俞府 KI27 to 彧中 KI26 was given as "about 0.5 寸". It is 1.60 —
   *     a full intercostal space, which is the very distinction the day is
   *     built on.
   *  2. The channel list named five. The region carries SEVEN: 中府 LU1 and
   *     雲門 LU2 put 肺經 here — and the draft's own core list includes 中府 —
   *     while 期門 LR14 puts 肝經 here.
   *  3. 脾經 was given the 1st through 5th intercostal spaces. It occupies the
   *     2nd through 5th; the 6-寸 point in the 1st space is 中府 LU1, a Lung
   *     point.
   *  4. 乳中 ST17 carried a needling and moxibustion contraindication. It is
   *     kept as what this app can say — a landmark, used for measuring.
   *
   * Three instructions to use app features that do not exist — a midline
   * overlay and two intercostal-space highlight modes — were rewritten.
   */
  {
    id: 'day_17',
    dayNumber: 17,
    titleZhHant: '胸部 — 肋間隙與旁開距離的網格',
    titleEn: 'Thorax — a grid of rib spaces and lateral distances',
    hookZhHant: '胸部的每一個穴，都是兩個座標的交點：第幾個肋間隙，旁開幾寸。二十七個穴，一張網格。',
    hookEn: 'Every point on the chest is the meeting of two coordinates: which rib space, and how many cun out from the midline. Twenty-seven points, one grid.',
    meridianIds: ['mer_lu', 'mer_st', 'mer_sp', 'mer_ki', 'mer_pc', 'mer_lr', 'mer_cv'],
    sourceIds: [WORKSHEET17, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己胸前找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own chest, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_17_learn',
        kind: 'learn',
        titleZhHant: '【學】兩個座標決定一個穴',
        titleEn: 'Learn — two coordinates fix every point',
        sourceIds: [WORKSHEET17],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '手上那三天，穴位靠骨頭、肌腱與寸數一個一個定。胸部不是這樣：它有一張現成的格線。縱軸是肋間隙——十二對肋骨之間夾出十一個間隙；橫軸是旁開前正中線的寸數。每個穴都落在某一格上，說出「第幾隙、旁開幾寸」，就等於說出了位置。',
            en: 'For the last three days each point had to be pinned individually, by a bone, a tendon and a count of cun. The chest is not like that: it comes with a ruled grid. Down the page run the intercostal spaces — twelve pairs of ribs enclose eleven spaces. Across it runs the distance out from the anterior midline. Every point sits on a cell of that grid, and naming the space and the distance names the point.',
          },
          {
            zhHant:
              '橫軸有四條線：任脈 CV 走 0 寸，就是前正中線本身；腎經 KI 旁開 2 寸；胃經 ST 旁開 4 寸；脾經 SP 與肺經的中府 LU1 都在旁開 6 寸。心包經只有一個天池 PC1，落在 5 寸，是唯一不在這四條線上的。',
            en: 'Four lines run down the chest. The Conception vessel is the midline itself, at 0. The Kidney channel runs 2 cun out, the Stomach 4, and the Spleen — together with 中府 LU1 of the Lung — 6. The Pericardium contributes a single point, 天池 PC1 at 5 cun, the only one off those four lines.',
          },
          {
            zhHant:
              '★ 第 4 肋間隙是整張網格的錨點，因為它平乳頭，一摸就到。這一隙上五條線各有一個穴：膻中 CV17（0 寸，兩乳頭連線中點，心包募穴、氣會）｜神封 KI23（2 寸）｜乳中 ST17（4 寸，即乳頭中央）｜天池 PC1（5 寸，乳頭外 1 寸）｜天溪 SP18（6 寸）。記住這一排，其餘各隙只是上下平移。',
            en: 'The 4th intercostal space is the anchor of the whole grid, because it is level with the nipple and can be found by touch. Five points sit along it, one per line: 膻中 CV17 at 0, the midpoint of the line between the nipples — the Pericardium’s front-mu and the influential point of qi; 神封 KI23 at 2; 乳中 ST17 at 4, which is the nipple itself; 天池 PC1 at 5, one cun outside it; and 天溪 SP18 at 6. Learn that row and every other space is the same row moved up or down.',
          },
          {
            zhHant:
              '★ 往上數，每一隙相差約 1.6 寸：第 3 隙有玉堂 CV18、靈墟 KI24、膺窗 ST16、胸鄉 SP19；第 2 隙有紫宮 CV19、神藏 KI25、屋翳 ST15、周榮 SP20；第 1 隙有華蓋 CV20、彧中 KI26、庫房 ST14、中府 LU1。再往上就出了肋間隙：鎖骨下緣一排是璇璣 CV21、俞府 KI27、氣戶 ST13、雲門 LU2，鎖骨上窩則是缺盆 ST12。',
            en: 'Counting upward, each space is about 1.6 cun from the last. The 3rd holds 玉堂 CV18, 靈墟 KI24, 膺窗 ST16 and 胸鄉 SP19. The 2nd holds 紫宮 CV19, 神藏 KI25, 屋翳 ST15 and 周榮 SP20. The 1st holds 華蓋 CV20, 彧中 KI26, 庫房 ST14 and 中府 LU1. Above that the spaces run out: along the lower border of the clavicle sit 璇璣 CV21, 俞府 KI27, 氣戶 ST13 and 雲門 LU2, and in the hollow above the clavicle, 缺盆 ST12.',
          },
          {
            zhHant:
              '★ 往下，第 5 隙有中庭 CV16、步廊 KI22、乳根 ST18、食竇 SP17。胃經到這裡為止——乳根就是乳房根部，胃經在胸部沒有更低的穴。再往下只剩第 6 隙的期門 LR14，肝經的募穴，乳頭直下、旁開 4 寸，約與巨闕 CV14 同高，也是胸部這一區的最後一站。',
            en: 'Downward, the 5th space holds 中庭 CV16, 步廊 KI22, 乳根 ST18 and 食竇 SP17. The Stomach channel stops there — 乳根 is the root of the breast and the channel has no lower point on the chest. Below it only 期門 LR14 remains, in the 6th space: the Liver’s front-mu, directly below the nipple 4 cun out, roughly level with 巨闕 CV14, and the last station of this region.',
          },
          {
            zhHant:
              '兩個容易記錯的地方。第一，俞府 KI27 不在第 1 肋間隙裡——它在鎖骨下緣，第 1 肋的上方；隙裡的那個是彧中 KI26。兩者上下相差約 1.6 寸，正好一個肋間隙，不是半寸。第二，腎經在肋弓上下換尺：胸部六站（KI22–KI27）旁開 2 寸，腹部十一站（KI11–KI21）旁開 0.5 寸，分界就在肋弓下緣。',
            en: 'Two things that are easy to get wrong. First, 俞府 KI27 is NOT in the 1st intercostal space — it lies at the lower border of the clavicle, above the 1st rib; the point in the space is 彧中 KI26. The two are about 1.6 cun apart, one whole space, not half a cun. Second, the Kidney channel changes its rule at the costal arch: its six chest stations (KI22–KI27) run 2 cun out, its eleven abdominal stations (KI11–KI21) only 0.5.',
          },
          {
            zhHant:
              '骨度：胸骨上窩（天突 CV22，屬頸部，Day 21）到胸劍聯合定為 9 寸，是任脈胸段的量尺。沿這把尺，璇璣在 1 寸、華蓋約 1.2 寸、紫宮約 2.8 寸、玉堂約 4.4 寸、膻中約 6 寸——也就是九寸的三分之二處——中庭則在 9 寸的終點，即胸劍聯合本身。膻中以上為骨性胸骨，觸感硬；胸劍聯合以下進入軟組織。',
            en: 'The ruler: from the suprasternal fossa (天突 CV22, a neck point, Day 21) to the xiphisternal junction is defined as 9 cun, and that is the measure for the Conception vessel’s chest segment. Along it, 璇璣 falls at 1 cun, 華蓋 at about 1.2, 紫宮 about 2.8, 玉堂 about 4.4 and 膻中 about 6 — two thirds of the way down — with 中庭 at the 9-cun end, the junction itself. Above that the sternum is bone and feels hard; below it the wall turns to soft tissue.',
          },
        ],
      },
      {
        id: 'sec_17_do',
        kind: 'do',
        titleZhHant: '【做】在自己胸前找',
        titleEn: 'Do — find them on your own chest',
        sourceIds: [WORKSHEET17],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「胸部」。開啟時是全區（Fit）；用 ＋ 放大想細看的一格，拖曳平移，「全區」回到整體。點任何一個標記，右側清單會顯示它的定位文字——這一區的定位文字幾乎都寫著「第幾肋間隙、旁開幾寸」，正好是今天要背的兩個座標。',
            en: 'Open the Regions tab and choose Thorax. It opens on the whole region; ＋ magnifies a cell you want to read closely, dragging pans, and Fit returns to the whole. Tap any marker and the list beside it shows that point’s location text — on this region almost every one reads as a rib space and a lateral distance, which are exactly the two coordinates to learn.',
          },
          {
            zhHant:
              '一、找到錨點那一排：摸到自己的乳頭高度，那就是第 4 肋間隙。從前正中線開始往外走：膻中（正中）→ 神封（2 寸）→ 乳中（乳頭本身，4 寸）→ 天池（乳頭外 1 寸，5 寸）→ 天溪（6 寸）。一隻手橫過胸口，五個穴在同一條水平線上。',
            en: 'One — find the anchor row. Feel for the level of your own nipple: that is the 4th intercostal space. Now walk outward from the midline: 膻中 at the centre, 神封 at 2 cun, 乳中 at the nipple itself (4), 天池 one cun outside it (5), and 天溪 at 6. One hand crossing the chest passes all five, on one horizontal line.',
          },
          {
            zhHant:
              '二、往上數三隙：從第 4 隙沿肋骨往上，依次數第 3、第 2、第 1 肋間隙，每上一隙約 1.6 寸。停在第 1 隙，在正中線上是華蓋 CV20，旁開 2 寸是彧中 KI26。再往上摸到鎖骨下緣——那裡是俞府 KI27，比彧中高一整個肋間隙。這一步就是把兩個最容易混的穴分開。',
            en: 'Two — count up three spaces. From the 4th, follow the ribs upward through the 3rd, 2nd and 1st, about 1.6 cun each. Stop in the 1st: on the midline is 華蓋 CV20, and 2 cun out is 彧中 KI26. Now feel higher, to the lower border of the clavicle — that is 俞府 KI27, a whole intercostal space above 彧中. This step is what separates the two points most often confused.',
          },
          {
            zhHant:
              '三、走一趟胸骨：從胸骨上窩往下滑，經璇璣、華蓋、紫宮、玉堂到膻中，感覺指腹一路都在硬的骨面上；再往下到胸劍聯合（中庭）之後，硬感消失，進入軟組織。這條線就是九寸的尺，膻中落在三分之二處。',
            en: 'Three — run the sternum. Slide down from the suprasternal fossa past 璇璣, 華蓋, 紫宮 and 玉堂 to 膻中, and feel that the whole way your fingertip is on hard bone; below the xiphisternal junction at 中庭 the hardness stops and the wall goes soft. That line is the nine-cun ruler, and 膻中 sits two thirds of the way down it.',
          },
          {
            zhHant:
              '四、乳頭不是每個人都能當基準：仰臥或體位改變時乳頭會移位。這時改用肋間隙計數——從鎖骨下往下數——作為唯一基準。乳中 ST17 在本課只當定位標志用，不作其他用途。',
            en: 'Four — the nipple is not always a usable reference: it shifts with posture and when lying down. When it does, count intercostal spaces from below the clavicle instead, and use that alone. 乳中 ST17 is used in this lesson as a landmark for measuring, and for nothing else.',
          },
        ],
      },
      {
        id: 'sec_17_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET17],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '胸部網格口訣（七言）：「縱數肋隙橫量寸，任脈居中零寸行；腎二胃四脾經六，天池獨佔五寸程。鎖骨下緣是俞府，第一隙內彧中承；乳頭平對第四隙，膻中神封乳中橫。」',
            en: 'The chest grid, seven characters to a clause: 「縱數肋隙橫量寸，任脈居中零寸行；腎二胃四脾經六，天池獨佔五寸程。鎖骨下緣是俞府，第一隙內彧中承；乳頭平對第四隙，膻中神封乳中橫。」',
          },
          {
            zhHant:
              '第五句與第六句是全首的重點：俞府在鎖骨下緣，彧中在第 1 肋間隙，兩者相差一個肋間隙約 1.6 寸。念到這兩句時，手要跟著摸一次——只用眼睛看，這兩個穴永遠會黏在一起。',
            en: 'The fifth and sixth clauses carry the weight: 俞府 at the lower border of the clavicle, 彧中 in the 1st intercostal space, one space and about 1.6 cun apart. Say those two lines with a hand on your own chest — read with the eyes alone, those two points stay stuck together forever.',
          },
          {
            zhHant:
              '形象聯想：膻中是網格的原點，第 4 隙與正中線的交點；華蓋在胸骨上段，如胸廓頂上的一頂蓋；天溪在第 4 隙最外側 6 寸，是脾經走到胸壁外緣的一道溪；期門在第 6 隙，是這一區最下、也最外的一站，交給明天的腹部。',
            en: 'Images: 膻中 is the grid’s origin, where the 4th space crosses the midline. 華蓋, a canopy over the top of the ribcage. 天溪, a stream at the outer edge of the chest wall, 6 cun out in the 4th space. And 期門 in the 6th space, the lowest and outermost station here, handing over to tomorrow’s abdomen.',
          },
        ],
      },
      {
        id: 'sec_17_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET17],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、錨點那一排：第 4 肋間隙上，由內而外有哪五個穴？各旁開幾寸、各屬哪一條經？（膻中 CV17 任脈 0 寸；神封 KI23 腎經 2 寸；乳中 ST17 胃經 4 寸；天池 PC1 心包經 5 寸；天溪 SP18 脾經 6 寸。）',
            en: 'One — the anchor row. Which five points lie along the 4th intercostal space, from the midline outward, at what distances, on which channels? (膻中 CV17, Conception, 0; 神封 KI23, Kidney, 2; 乳中 ST17, Stomach, 4; 天池 PC1, Pericardium, 5; 天溪 SP18, Spleen, 6.)',
          },
          {
            zhHant:
              '二、俞府與彧中：兩者相差多少？各在哪裡？（相差約 1.6 寸，正好一個肋間隙。俞府 KI27 在鎖骨下緣、第 1 肋的上方；彧中 KI26 在第 1 肋間隙裡。不是半寸。）',
            en: 'Two — 俞府 and 彧中. How far apart are they, and where is each? (About 1.6 cun — one whole intercostal space. 俞府 KI27 lies at the lower border of the clavicle, above the 1st rib; 彧中 KI26 lies inside the 1st space. Not half a cun.)',
          },
          {
            zhHant:
              '三、換尺的位置：腎經在胸部旁開幾寸？在腹部呢？分界在哪？（胸部 2 寸，腹部 0.5 寸，分界在肋弓下緣：KI22–KI27 為胸段六站，KI11–KI21 為腹段十一站。）',
            en: 'Three — where the rule changes. How far out does the Kidney channel run on the chest, and on the abdomen, and where does it change? (Two cun on the chest, half a cun on the abdomen, changing at the costal arch: KI22–KI27 are the six chest stations, KI11–KI21 the eleven abdominal ones.)',
          },
          {
            zhHant:
              '四、胃經的下界：胃經在胸部最低的穴是哪一個，在第幾隙？（乳根 ST18，第 5 肋間隙，即乳房根部；胃經在胸部沒有更低的穴。）',
            en: 'Four — where the Stomach channel stops. Which is its lowest point on the chest, and in which space? (乳根 ST18, in the 5th intercostal space, at the root of the breast; the channel has no lower chest point.)',
          },
          {
            zhHant:
              '五、九寸的尺：胸骨上窩到胸劍聯合為 9 寸。膻中約在這條尺的幾分之幾處？（約 6 寸，即三分之二。）',
            en: 'Five — the nine-cun ruler. From the suprasternal fossa to the xiphisternal junction is 9 cun. How far down it does 膻中 sit? (About 6 cun — two thirds.)',
          },
        ],
      },
      {
        id: 'sec_17_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET17],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是胸部，一張現成的網格。我的縱軸是十一個肋間隙——十二對肋骨夾出來的；我的橫軸是旁開前正中線的寸數：任脈 0 寸、腎經 2 寸、胃經 4 寸、脾經 6 寸，還有一個天池落在 5 寸。我的錨點是第 4 隙，因為它平乳頭：由內而外是膻中、神封、乳中、天池、天溪。要小心兩件事：俞府在鎖骨下緣、比彧中高一整個肋間隙，不是半寸；腎經到了肋弓以下就換尺，從 2 寸縮成 0.5 寸。我不談臟腑功能，我只報兩個座標——第幾隙，旁開幾寸。」',
            en: 'Record one minute: “I am the chest, and I come with a grid. Down me run eleven intercostal spaces, enclosed by twelve pairs of ribs; across me runs the distance from the anterior midline — Conception at 0, Kidney at 2, Stomach at 4, Spleen at 6, with 天池 alone at 5. My anchor is the 4th space, because it is level with the nipple: from the middle outward, 膻中, 神封, 乳中, 天池, 天溪. Two things to watch. 俞府 sits at the lower border of the clavicle, a whole space above 彧中 — not half a cun. And the Kidney channel changes its ruler below the costal arch, from 2 cun to half of one. I do not discuss organ function. I report two coordinates: which space, and how far out.”',
          },
        ],
      },
      {
        id: 'sec_17_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D16（肩與上臂）：①手部與前臂各有 0 個交會穴，肩部有 7 個 ②肩髃 LI15 在肩峰前下方、肩髎 TE14 在後下方，分屬大腸經與三焦經。回鍋 D15（肘與前臂）：①六個合穴全在肘、六個郄穴全在前臂 ②骨間隙屬三焦、兩筋之間屬心包。回鍋 D14（腕與手）：①神門 HT7 ↔ 腕骨 SI4 的原↔原配對 ②赤白肉際是界線不是集合。回鍋 D6（腎經）：腹部十一站每站相差 1 寸、旁開 0.5 寸——今天正好接上它的胸部六站，旁開 2 寸。',
            en: 'Day 16 back (shoulder and upper arm): the hand and forearm hold no crossing points while the shoulder holds seven; and 肩髃 LI15 sits anteroinferior to the acromion on the Large Intestine, 肩髎 TE14 posteroinferior on the Triple Energiser. Day 15 back (elbow and forearm): all six he-sea points at the elbow, all six xi-cleft in the forearm; the interosseous space belongs to the Triple Energiser and the gap between the two tendons to the Pericardium. Day 14 back (wrist and hand): the yuan-to-yuan pairing 神門 HT7 ↔ 腕骨 SI4, and that the red-white boundary is a line, not a container. Day 6 back (the Kidney channel): its eleven abdominal stations, one cun apart and 0.5 cun out — today joins them to its six chest stations at 2 cun.',
          },
        ],
      },
    ],
  },
  /*
   * Day 18 — the abdomen, and the other half of yesterday's ruler.
   *
   * Six corrections against the records:
   *
   *  1. 商曲 KI17 was put at 臍上 2 寸. Its record says 臍上 1 寸; 臍上 2 寸 is
   *     石關 KI18, the next station up.
   *  2. 日月 GB24 was made the point AT the costal arch and the chest/abdomen
   *     boundary. Its record places it in the 7th intercostal space, above the
   *     arch. The point at 肋弓下緣 is 章門 LR13 — and that belongs to the
   *     flank region, Day 22.
   *  3. The channel list named five. The region carries SIX: 急脈 LR12 puts
   *     肝經 here too.
   *  4. Rectus abdominis borders were assigned to 天樞 (inner) and to 水道 and
   *     歸來 (outer). All three sit at 旁開 2 寸 — the same vertical line, so
   *     they cannot be on opposite borders of one muscle — and NO record in
   *     the dataset names the rectus at all. Dropped in favour of the cun the
   *     records do state.
   *  5. 「肋弓下緣 = 臍上 7 寸」 is not one of the two abdominal bone-cun
   *     segments (胸劍聯合→臍 = 8 寸, 臍→恥骨聯合上緣 = 5 寸) and no anchor in
   *     the dataset carries it.
   *  6. A quiz asked for the straight-line distance from 天樞 to the pubic
   *     symphysis by Pythagoras. Bone-cun are proportional measures along
   *     defined segments of the body surface, not Euclidean coordinates; the
   *     hypotenuse of two of them is not a distance in cun. Removed.
   *
   * 衝門 SP12's arterial note is kept as the anatomical fact its own record
   * states — the external iliac artery pulses there — without the instruction
   * about how to touch it, exactly as 肩井 was handled on Day 16.
   *
   * The spine is the same shape as Day 17's, one level down: three parallel
   * lines indexed by distance from the umbilicus, and the region where more
   * than half the dataset's front-mu points live.
   */
  {
    id: 'day_18',
    dayNumber: 18,
    titleZhHant: '腹部及腹股溝 — 以臍為原點的網格',
    titleEn: 'Abdomen & groin — the grid with the navel as its origin',
    hookZhHant: '肋弓以上是一把尺，以下換另一把。臍是原點：上八寸、下五寸，旁開 0.5、2、4 寸——四十五個穴掛在這張網格上。',
    hookEn: 'One ruler above the costal arch, another below it. The navel is the origin: eight cun up, five down, and lines at 0.5, 2 and 4 cun out — forty-five points hang on that grid.',
    meridianIds: ['mer_st', 'mer_sp', 'mer_ki', 'mer_gb', 'mer_lr', 'mer_cv'],
    sourceIds: [WORKSHEET18, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己腹部找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own abdomen, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_18_learn',
        kind: 'learn',
        titleZhHant: '【學】換一把尺',
        titleEn: 'Learn — the ruler changes',
        sourceIds: [WORKSHEET18],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '昨天胸部的橫軸是 0、2、4、6 寸。過了肋弓，同樣四條經全部往中線收攏：任脈仍是 0；腎經從 2 寸收到 0.5 寸；胃經從 4 寸收到 2 寸；脾經從 6 寸收到 4 寸。同一條經，換一段身體就換一把尺——這是全課程最容易記反的一組數字，也是今天的重點。',
            en: 'Yesterday the chest measured 0, 2, 4 and 6 cun across. Past the costal arch every one of those lines moves in toward the midline: the Conception vessel stays at 0; the Kidney channel closes from 2 to 0.5; the Stomach from 4 to 2; the Spleen from 6 to 4. Same channels, different segment of the body, different ruler — the set of numbers most easily reversed in the whole course, and the point of today.',
          },
          {
            zhHant:
              '縱軸只有一個原點：臍。向上到胸劍聯合定為 8 寸，向下到恥骨聯合上緣定為 5 寸。腹部每一個穴都用「臍上幾寸」或「臍下幾寸」說出來，不必再數肋間隙。',
            en: 'The vertical axis has a single origin: the navel. Upward to the xiphisternal junction is defined as 8 cun, downward to the upper border of the pubic symphysis as 5. Every point on the abdomen is said as so many cun above or below the navel — no more counting rib spaces.',
          },
          {
            zhHant:
              '★ 前正中線由上而下：巨闕 CV14（臍上 6 寸）｜中脘 CV12（臍上 4 寸，正好是胸劍聯合到臍的中點）｜神闕 CV8（臍中央）｜氣海 CV6（臍下 1.5 寸）｜石門 CV5（臍下 2 寸）｜關元 CV4（臍下 3 寸）｜中極 CV3（臍下 4 寸）｜曲骨 CV2（恥骨聯合上緣，即臍下 5 寸）。八個穴，一條線，全部只靠「離臍幾寸」定位。',
            en: 'Down the midline: 巨闕 CV14 at 6 cun above the navel; 中脘 CV12 at 4, exactly halfway from the xiphisternal junction to the navel; 神闕 CV8 at the navel itself; 氣海 CV6 at 1.5 below; 石門 CV5 at 2; 關元 CV4 at 3; 中極 CV3 at 4; and 曲骨 CV2 at the upper border of the pubic symphysis, which is 5. Eight points on one line, every one fixed by nothing but its distance from the navel.',
          },
          {
            zhHant:
              '★ 三條旁線，各自成列：腎經旁開 0.5 寸，從橫骨 KI11（臍下 5 寸）到幽門 KI21（臍上 5 寸），十一站每站相差 1 寸——這正是第 6 天背過的那把尺。胃經旁開 2 寸，十二站從不容 ST19 到氣衝 ST30，天樞 ST25 正好平臍。脾經旁開 4 寸，大橫 SP15 平臍，腹結 SP14 在其下 1.3 寸。',
            en: 'Three lateral lines, each a column of its own. The Kidney channel runs 0.5 cun out, from 橫骨 KI11 five cun below the navel to 幽門 KI21 five above — eleven stations, one cun apart, the same ruler learned on Day 6. The Stomach runs 2 cun out through twelve stations from 不容 ST19 to 氣衝 ST30, with 天樞 ST25 exactly level with the navel. The Spleen runs 4 cun out, 大橫 SP15 level with the navel and 腹結 SP14 1.3 cun below it.',
          },
          {
            zhHant:
              '★ 募穴的大本營：全資料集十二個募穴，有七個在這一區——中脘 CV12（胃）、巨闕 CV14（心）、石門 CV5（三焦）、關元 CV4（小腸）、中極 CV3（膀胱）在正中線上，天樞 ST25（大腸）在旁開 2 寸，日月 GB24（膽）在旁開 4 寸。募穴是傳統把臟腑之氣「聚募」於軀幹前面的說法；本課只用它把七個位置綁成一組。',
            en: 'The home of the front-mu points: seven of the dataset’s twelve are in this one region — 中脘 CV12 for the Stomach, 巨闕 CV14 for the Heart, 石門 CV5 for the Triple Energiser, 關元 CV4 for the Small Intestine and 中極 CV3 for the Bladder, all on the midline; 天樞 ST25 for the Large Intestine at 2 cun out; and 日月 GB24 for the Gallbladder at 4. 募 names the tradition’s idea of an organ’s qi gathering on the front of the trunk; this lesson uses it only to bind seven locations into one group.',
          },
          {
            zhHant:
              '兩個邊界。上界：日月 GB24 在第 7 肋間隙、乳頭直下、旁開 4 寸——它在肋弓的上方，不是肋弓本身；真正落在肋弓下緣的是章門 LR13，而章門屬於身側那一區（Day 22）。下界：腹股溝。衝門 SP12 在腹股溝外側，距恥骨聯合上緣中點 3.5 寸，髂外動脈搏動處的外側；急脈 LR12 在恥骨聯合下緣旁開 2.5 寸，也在動脈搏動處——這兩處底下就是大血管，本課只在體表確認位置。',
            en: 'Two boundaries. Above: 日月 GB24 sits in the 7th intercostal space, directly below the nipple, 4 cun out — ABOVE the costal arch, not on it. The point that actually lies at the arch is 章門 LR13, and that belongs to the flank region on Day 22. Below: the groin. 衝門 SP12 lies lateral to it, 3.5 cun from the midpoint of the pubic symphysis’s upper border, just outside where the external iliac artery pulses; 急脈 LR12 lies 2.5 cun lateral to the symphysis’s lower border, also at a pulse. Large vessels run beneath both, and this lesson only confirms where they are on the surface.',
          },
        ],
      },
      {
        id: 'sec_18_do',
        kind: 'do',
        titleZhHant: '【做】在自己腹部找',
        titleEn: 'Do — find them on your own abdomen',
        sourceIds: [WORKSHEET18],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「腹部及腹股溝」。開啟時是全區；用 ＋ 放大，拖曳平移，「全區」回到整體。這一區四十五個穴，是全身分區裡最多的一個，清單也最長——點任一標記，右側會顯示它的定位文字，幾乎每一條都寫著「臍上／臍下幾寸、旁開幾寸」。',
            en: 'Open the Regions tab and choose Abdomen & groin. It opens on the whole region; ＋ magnifies, dragging pans, Fit returns. Forty-five points make this the largest region on the body and the longest list — tap any marker and its location text appears beside it, and nearly every one reads as so many cun above or below the navel, so many cun out.',
          },
          {
            zhHant:
              '一、先立原點：把一指按在肚臍上，那是 0。向上找胸劍聯合（胸骨下端的硬邊），那是臍上 8 寸；向下找恥骨聯合上緣，那是臍下 5 寸。腹部所有縱向距離都在這兩段之內。',
            en: 'One — set the origin. Put a finger on your navel: that is zero. Feel upward for the xiphisternal junction, the hard lower edge of the sternum — 8 cun above. Feel downward for the upper border of the pubic symphysis — 5 cun below. Every vertical distance on the abdomen lives inside those two segments.',
          },
          {
            zhHant:
              '二、走一趟正中線：從臍往上四分之一段到中脘（臍上 4 寸，正好是臍到胸劍聯合的一半）；從臍往下依次是氣海（1.5 寸）、石門（2 寸）、關元（3 寸）、中極（4 寸）、曲骨（5 寸，摸到恥骨的硬緣就到底了）。下段五個穴擠在五寸裡，用「1.5、2、3、4、5」一組數字記。',
            en: 'Two — run the midline. Up from the navel, a quarter of that segment reaches 中脘 at 4 cun, exactly halfway to the xiphisternal junction. Down from the navel, in order: 氣海 at 1.5, 石門 at 2, 關元 at 3, 中極 at 4, and 曲骨 at 5, where the hard edge of the pubis stops you. Five points inside five cun — hold them as one run of numbers: 1.5, 2, 3, 4, 5.',
          },
          {
            zhHant:
              '三、橫走一列：把手平放在臍的高度，從中線往外走——神闕（0）、肓俞 KI16（0.5 寸）、天樞 ST25（2 寸）、大橫 SP15（4 寸）。四個穴在同一條水平線上，正好把今天的三個旁開距離一次走完。昨天的胸部同一動作走的是 0、2、4、6；今天是 0、0.5、2、4。',
            en: 'Three — walk one row. Lay a hand at the level of the navel and move outward: 神闕 at 0, 肓俞 KI16 at 0.5, 天樞 ST25 at 2, 大橫 SP15 at 4. Four points on one horizontal, covering all three of today’s lateral distances in a single pass. The same movement across the chest yesterday gave 0, 2, 4, 6; today it gives 0, 0.5, 2, 4.',
          },
          {
            zhHant:
              '四、找兩個邊界：往上沿肋弓摸到第 7 肋間隙、乳頭直下，那是日月 GB24——注意它在肋弓上方。往下摸到恥骨聯合上緣，再往外側到腹股溝，是衝門 SP12 一帶。這兩個點分別交給胸部（昨天）與下肢（後面幾天）。',
            en: 'Four — find the two boundaries. Upward, follow the costal margin to the 7th intercostal space directly below the nipple: that is 日月 GB24 — and note it sits above the arch, not on it. Downward, find the upper border of the pubic symphysis and move laterally into the groin, where 衝門 SP12 lies. Those two hand over to the chest behind you and the leg ahead.',
          },
        ],
      },
      {
        id: 'sec_18_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET18],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '換尺口訣（七言）：「肋弓為界換一尺，上二四六下半二四；臍上八寸下五寸，任脈居中一線齊。腎半胃二脾四寸，平臍一列數過去；中脘臍上四寸整，關元臍下三寸低。」',
            en: 'The changing ruler, seven characters to a clause: 「肋弓為界換一尺，上二四六下半二四；臍上八寸下五寸，任脈居中一線齊。腎半胃二脾四寸，平臍一列數過去；中脘臍上四寸整，關元臍下三寸低。」',
          },
          {
            zhHant:
              '第二句是全首要記的：胸部 2、4、6，腹部 0.5、2、4。注意胃經的 2 寸在腹部，在胸部卻是腎經的數字——這正是最容易搞混的地方。要分開它們，只要先問一句：這個穴在肋弓上面還是下面？',
            en: 'The second clause is the one to hold: 2, 4, 6 above; 0.5, 2, 4 below. Watch the number 2 — on the abdomen it belongs to the Stomach, on the chest to the Kidney. That single collision is where the confusion comes from, and the way out is to ask first: is this point above the costal arch, or below it?',
          },
          {
            zhHant:
              '形象聯想：神闕是原點，量什麼都從它起算；中脘正好在臍與胸劍聯合的中點，是上腹的定位錨；天枢平臍旁開 2 寸，是腹部橫向的中站；曲骨貼著恥骨的硬緣，是這條中線的終點。',
            en: 'Images: 神闕 is the origin, and everything is counted from it. 中脘 sits exactly midway between the navel and the xiphisternal junction, the anchor of the upper abdomen. 天樞 is the middle station of the horizontal walk, level with the navel and 2 cun out. And 曲骨 rests against the hard edge of the pubis, the end of the midline.',
          },
        ],
      },
      {
        id: 'sec_18_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET18],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、換尺：腎經、胃經、脾經在肋弓以上與以下各旁開幾寸？（以上 2、4、6 寸；以下 0.5、2、4 寸。任脈兩段都是 0。）',
            en: 'One — the change of ruler. How far out do the Kidney, Stomach and Spleen channels run above the costal arch, and below it? (Above: 2, 4 and 6 cun. Below: 0.5, 2 and 4. The Conception vessel is 0 in both.)',
          },
          {
            zhHant:
              '二、平臍那一列：由內而外有哪四個穴？（神闕 CV8 在 0、肓俞 KI16 在 0.5 寸、天樞 ST25 在 2 寸、大橫 SP15 在 4 寸。）',
            en: 'Two — the row level with the navel, from the midline outward. (神闕 CV8 at 0, 肓俞 KI16 at 0.5, 天樞 ST25 at 2, 大橫 SP15 at 4.)',
          },
          {
            zhHant:
              '三、縱軸骨度：臍到恥骨聯合上緣是 5 寸。中極在臍下 4 寸，離恥骨聯合還有幾寸？（1 寸——就是曲骨與中極之間的距離。）',
            en: 'Three — the vertical ruler. Navel to the upper border of the pubic symphysis is 5 cun. 中極 sits 4 cun below the navel: how far is it from the symphysis? (One cun — which is the gap between 中極 and 曲骨.)',
          },
          {
            zhHant:
              '四、上界辨析：日月 GB24 在肋弓的上面還是下面？落在肋弓下緣的是哪一個穴，屬哪一區？（日月在肋弓上方，第 7 肋間隙。肋弓下緣是章門 LR13，屬身側及帶脈區，Day 22。）',
            en: 'Four — the upper boundary. Is 日月 GB24 above the costal arch or on it? Which point lies at the arch itself, and in which region? (日月 is above it, in the 7th intercostal space. The point at the arch is 章門 LR13, in the flank region, Day 22.)',
          },
          {
            zhHant:
              '五、募穴：本區有七個募穴，正中線上有五個，是哪五個？（巨闕 CV14 心、中脘 CV12 胃、石門 CV5 三焦、關元 CV4 小腸、中極 CV3 膀胱。另外兩個是天樞 ST25 大腸、日月 GB24 膽。）',
            en: 'Five — the front-mu points. Seven are in this region and five of them are on the midline: which? (巨闕 CV14 for the Heart, 中脘 CV12 for the Stomach, 石門 CV5 for the Triple Energiser, 關元 CV4 for the Small Intestine, 中極 CV3 for the Bladder. The other two are 天樞 ST25 for the Large Intestine and 日月 GB24 for the Gallbladder.)',
          },
        ],
      },
      {
        id: 'sec_18_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET18],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是腹部，我只有一個原點——肚臍。往上八寸到胸劍聯合，往下五寸到恥骨聯合，所有縱向距離都在這裡面。我的橫向有三條線：腎經旁開 0.5 寸、胃經 2 寸、脾經 4 寸。過了肋弓上去就換一把尺，變成 2、4、6——同一條經，換一段身體就換一組數字。平著我的肚臍走一列：神闕、肓俞、天樞、大橫，剛好把三個距離走完。我還是募穴最多的一區，十二個裡有七個在我身上，五個排在正中線。我不談臟腑功能，我只報離臍幾寸、旁開幾寸。」',
            en: 'Record one minute: “I am the abdomen, and I have exactly one origin — the navel. Eight cun up to the xiphisternal junction, five down to the pubic symphysis, and every vertical distance lives between them. Across me run three lines: the Kidney at half a cun, the Stomach at two, the Spleen at four. Cross the costal arch going up and the ruler changes to two, four and six — the same channels, a different segment, a different set of numbers. Walk one row level with my navel and you pass 神闕, 肓俞, 天樞 and 大橫, covering all three distances. I also hold more front-mu points than anywhere else: seven of the twelve, five of them in a line down my middle. I do not discuss organ function. I report how far from the navel, and how far out.”',
          },
        ],
      },
      {
        id: 'sec_18_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D17（胸部）：①縱軸是肋間隙、橫軸是旁開距離 ②俞府 KI27 在鎖骨下緣、彧中 KI26 在第 1 肋間隙，相差一整個肋間隙 ③第 4 隙那一列：膻中、神封、乳中、天池、天溪。回鍋 D16（肩與上臂）：手部與前臂沒有交會穴，肩部有七個。回鍋 D15（肘與前臂）：六個合穴在肘、六個郄穴在前臂。回鍋 D6（腎經）：腹部十一站每站相差 1 寸、旁開 0.5 寸——今天正是那一列。',
            en: 'Day 17 back (the chest): its vertical axis is the rib spaces and its horizontal the lateral distance; 俞府 KI27 sits at the lower border of the clavicle and 彧中 KI26 in the 1st space, a whole space apart; and the 4th-space row runs 膻中, 神封, 乳中, 天池, 天溪. Day 16 back: no crossing points in the hand or forearm, seven at the shoulder. Day 15 back: six he-sea points at the elbow, six xi-cleft in the forearm. Day 6 back (the Kidney channel): eleven abdominal stations a cun apart at 0.5 cun out — that column is today’s.',
          },
        ],
      },
    ],
  },
  /*
   * Day 19 — the flank, the smallest region and the only one where the ruler
   * is bone rather than cun.
   *
   * Six corrections against the records:
   *
   *  1. Three of the draft's ten headline points are not in this region:
   *     居髎 GB29 is hip & thigh, and 急脈 LR12 and 腹哀 SP16 are abdomen &
   *     groin. Their locations are taught on their own days.
   *  2. 大包 SP21 was omitted although it IS here — and it is the dataset's
   *     only 脾之大絡, which makes it the most distinctive point in the region.
   *  3. The channel list read 膽經、肝經、帶脈. The Girdle vessel is one of the
   *     eight extraordinary vessels and this dataset does not load it; 帶脈
   *     GB26 is a POINT on the Gallbladder channel bearing that name. The
   *     three channels actually here are Spleen, Gallbladder and Liver.
   *  4. 維道 GB28 was given as 「橫平臍下 3.5 寸（中極水平）」. 中極 CV3 is at
   *     臍下 4 寸, so the two halves of that sentence disagree. The record fixes
   *     維道 by 五樞前下 0.5 寸 and nothing else.
   *  5. 「髂前上棘平 L4 棘突」 is not anchored anywhere in the dataset, and it is
   *     the highest point of the iliac CREST that is usually put at L4, not the
   *     anterior superior spine.
   *  6. Three app features named that do not exist — a default view zoomed to
   *     the 季脅, a rib-end highlight and an iliac-crest highlight.
   *
   * 急脈's arterial note goes with the point, to Day 18.
   *
   * The spine: every other region hangs off a cun ladder. This one hangs off
   * bone — two floating rib ends and the anterior superior iliac spine — and
   * carries the only points the tradition describes as running horizontally.
   */
  {
    id: 'day_19',
    dayNumber: 19,
    titleZhHant: '身側及帶脈 — 掛在肋端與髂骨上的一區',
    titleEn: 'Flank & the Girdling vessel — the region that hangs off bone',
    hookZhHant: '八個穴，三條經。別的分區靠寸數排隊，這一區靠骨頭：兩根浮肋的末端、髂前上棘，還有一條平著肚臍橫走的線。',
    hookEn: 'Eight points, three channels. Every other region lines its points up by cun; this one hangs them on bone — two floating rib ends, the anterior superior iliac spine — and on a line that runs horizontally, level with the navel.',
    meridianIds: ['mer_sp', 'mer_gb', 'mer_lr'],
    sourceIds: [WORKSHEET19, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己身側找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own flank, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_19_learn',
        kind: 'learn',
        titleZhHant: '【學】八個穴，全部釘在骨頭上',
        titleEn: 'Learn — eight points, every one pinned to bone',
        sourceIds: [WORKSHEET19],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這是十三區裡最小的一區：八個穴，走三條經——脾經 SP、膽經 GB、肝經 LR。前兩天的胸腹靠一把尺排隊（肋間隙、離臍幾寸）；身側不是，它掛在骨頭上：第 11 肋游離端、第 12 肋游離端、髂前上棘。摸到骨頭，穴就定了。',
            en: 'The smallest of the thirteen regions: eight points on three channels — Spleen, Gallbladder and Liver. The chest and abdomen of the last two days line their points up along a ruler, by rib space or by distance from the navel. The flank does not. It hangs off bone: the free end of the 11th rib, the free end of the 12th, and the anterior superior iliac spine. Find the bone and the point is fixed.',
          },
          {
            zhHant:
              '★ 兩個肋端，兩個募穴：章門 LR13 在第 11 肋游離端下方，前正中線旁開 4 寸——它是肝經的穴，卻是脾的募穴，同時是臟會。京門 GB25 在第 12 肋游離端下方、章門後 1.8 寸——膽經的穴，卻是腎的募穴。兩根浮肋上下相鄰，兩個穴也上下相鄰，而且都「掛錯經」：穴在一條經上，募的是另一個臟。',
            en: 'Two rib ends, two front-mu points. 章門 LR13 lies below the free end of the 11th rib, 4 cun lateral to the anterior midline — a point of the LIVER channel that is the front-mu of the SPLEEN, and the influential point of the zang organs besides. 京門 GB25 lies below the free end of the 12th, 1.8 cun behind 章門 — a point of the GALLBLADDER channel that is the front-mu of the KIDNEY. Two floating ribs one above the other, two points one above the other, and both of them "on the wrong channel": the point sits on one, the organ it collects for is another.',
          },
          {
            zhHant:
              '★ 帶脈那一組：帶脈 GB26 在章門下 1.8 寸，第 11 肋游離端下方的垂線與臍水平線的交點上——也就是平著肚臍。五樞 GB27 在髂前上棘的前方、橫平臍下 3 寸。維道 GB28 在髂前上棘的前下方、五樞前下 0.5 寸。三個都是交會穴，是傳統描述那條橫向繞身一圈的脈在體表留下的記號。',
            en: 'The Girdling group. 帶脈 GB26 lies 1.8 cun below 章門, where a vertical dropped from the free end of the 11th rib meets the horizontal through the navel — level with the navel, in other words. 五樞 GB27 lies in front of the anterior superior iliac spine, level with a point 3 cun below the navel. 維道 GB28 lies in front of and below that spine, 0.5 cun down from 五樞. All three are crossing points — the surface marks of the one course the tradition describes as running horizontally around the body.',
          },
          {
            zhHant:
              '★ 上面兩個、外加一個：淵腋 GB22 在腋中線上、腋下 3 寸、第 4 肋間隙中——正是 Day 17 那個錨點肋隙，只是走到了身體側面。輒筋 GB23 在淵腋前 1 寸，同一隙。再往下，大包 SP21 在腋中線第 6 肋間隙，它是全資料集唯一的「脾之大絡」。',
            en: 'Two more above, and one apart. 淵腋 GB22 sits on the mid-axillary line, 3 cun below the axilla, in the 4th intercostal space — the same anchor space as Day 17, carried round to the side of the body. 輒筋 GB23 sits 1 cun in front of it, in the same space. Lower down, 大包 SP21 sits on the mid-axillary line in the 6th space, and it is the dataset’s only 脾之大絡, the great luo-connecting point of the Spleen.',
          },
          {
            zhHant:
              '前後對應：這一區的兩個募穴，在背後各有一個背俞穴與之相配。章門（脾募）配脾俞 BL20，在第 11 胸椎棘突下旁開 1.5 寸；京門（腎募）配腎俞 BL23，在第 2 腰椎棘突下旁開 1.5 寸。募在前、俞在後，是傳統把同一個臟的兩個記號分放身體前後的說法；背俞穴本身屬背部那一區，之後再走。',
            en: 'Front and back. Each of this region’s two front-mu points has a back-shu point behind it. 章門, front-mu of the Spleen, pairs with 脾俞 BL20 below the 11th thoracic spinous process, 1.5 cun out; 京門, front-mu of the Kidney, pairs with 腎俞 BL23 below the 2nd lumbar, 1.5 cun out. Mu in front, shu behind — the tradition’s way of placing two marks for one organ on opposite sides of the body. The back-shu points themselves belong to the back region, and come later.',
          },
        ],
      },
      {
        id: 'sec_19_do',
        kind: 'do',
        titleZhHant: '【做】在自己身側找',
        titleEn: 'Do — find them on your own flank',
        sourceIds: [WORKSHEET19],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「身側及帶脈」。開啟時是全區；用 ＋ 放大，拖曳平移，「全區」回到整體。八個穴是十三區裡最少的，一眼看得完——點任一標記，右側會顯示它靠的是哪一塊骨頭。',
            en: 'Open the Regions tab and choose Flank & the Girdling vessel. It opens on the whole region; ＋ magnifies, dragging pans, Fit returns. Eight points is the fewest of the thirteen and the whole set fits in one view — tap any marker and the list beside it names the bone it hangs from.',
          },
          {
            zhHant:
              '一、找兩根浮肋：雙手叉腰往上摸，肋弓的最下緣有兩個游離的肋端。上面那個是第 11 肋，它的下方是章門；下面那個是第 12 肋，它的下方偏後 1.8 寸是京門。兩個都是硬的骨端，摸得到邊界。',
            en: 'One — find the two floating ribs. Hands on the waist, feel upward: at the lower edge of the costal margin are two free rib ends. The upper is the 11th, and below it sits 章門; the lower is the 12th, and below it — 1.8 cun further back — sits 京門. Both are hard bony tips with a findable edge.',
          },
          {
            zhHant:
              '二、拉一條水平線：一手按住肚臍，另一手從第 11 肋端垂直往下，兩條線交會的地方就是帶脈 GB26。這是全課程唯一一次用「垂線與水平線的交點」定位——記住這個動作，帶脈就不會跑。',
            en: 'Two — draw one horizontal. Keep a finger on the navel and drop the other straight down from the free end of the 11th rib; where the two lines meet is 帶脈 GB26. It is the only point in the course located as the intersection of a vertical and a horizontal — hold on to that gesture and 帶脈 stays put.',
          },
          {
            zhHant:
              '三、走到髂骨：往下前方摸到髂前上棘（骨盆前緣最突的骨點）。它的前方、平臍下 3 寸是五樞 GB27；再往前下 0.5 寸是維道 GB28。這兩個穴靠的是同一塊骨頭，差別只在 0.5 寸。',
            en: 'Three — move to the hip bone. Feel down and forward for the anterior superior iliac spine, the prominent point at the front rim of the pelvis. In front of it, level with a point 3 cun below the navel, is 五樞 GB27; half a cun further down and forward is 維道 GB28. Both hang off the same bone, and only half a cun separates them.',
          },
          {
            zhHant:
              '四、抬手看上段：舉起手臂，沿腋中線往下 3 寸、第 4 肋間隙是淵腋 GB22，其前 1 寸是輒筋 GB23。再往下兩個肋隙，第 6 肋間隙上是大包 SP21。三個穴都在腋中線一帶，把身側和昨天的胸部接起來。',
            en: 'Four — raise the arm for the upper stretch. Along the mid-axillary line, 3 cun below the axilla in the 4th intercostal space, is 淵腋 GB22, with 輒筋 GB23 one cun in front of it in the same space. Two spaces lower, in the 6th, is 大包 SP21. All three sit about the mid-axillary line, joining the flank to yesterday’s chest.',
          },
        ],
      },
      {
        id: 'sec_19_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET19],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '身側口訣（七言）：「十一肋端章門下，十二肋端京門居；章門下行一寸八，帶脈平臍作橫車。髂前上棘五樞在，維道前下半寸虛；腋中三寸淵腋起，六隙大包絡脾餘。」',
            en: 'The flank, seven characters to a clause: 「十一肋端章門下，十二肋端京門居；章門下行一寸八，帶脈平臍作橫車。髂前上棘五樞在，維道前下半寸虛；腋中三寸淵腋起，六隙大包絡脾餘。」',
          },
          {
            zhHant:
              '最值得單獨記的是那兩個「掛錯經」的募穴：章門在肝經上，募的是脾；京門在膽經上，募的是腎。穴屬哪一條經，和它替哪一個臟收氣，是兩件事——這一區把這件事說得最清楚。',
            en: 'The pair worth holding on their own are the two front-mu points that sit on the "wrong" channel: 章門 is a Liver point collecting for the Spleen, and 京門 a Gallbladder point collecting for the Kidney. Which channel a point sits on and which organ it collects for are two separate questions, and nowhere is that plainer than here.',
          },
          {
            zhHant:
              '形象聯想：章門像一道門，開在第 11 肋端下；京門在它的後下方，守著第 12 肋端；帶脈是一條腰帶，平著肚臍繞身一圈——全身唯一橫著走的；五樞、維道掛在髂前上棘上，一前一下相差半寸。',
            en: 'Images: 章門, a gate under the tip of the 11th rib; 京門 behind and below it at the 12th; 帶脈 a belt running level with the navel, the only course that goes round rather than up and down; and 五樞 and 維道 hanging off the anterior superior iliac spine, half a cun apart.',
          },
        ],
      },
      {
        id: 'sec_19_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET19],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、兩個肋端：第 11 肋游離端下方與第 12 肋游離端下方各是哪一個穴？各屬哪一條經、各是哪一個臟的募穴？（第 11：章門 LR13，肝經，脾募，兼臟會。第 12：京門 GB25，膽經，腎募。）',
            en: 'One — the two rib ends. Which point lies below the free end of the 11th rib, and which below the 12th? Which channel is each on, and which organ does each collect for? (11th: 章門 LR13, Liver channel, front-mu of the Spleen, and the influential point of the zang. 12th: 京門 GB25, Gallbladder channel, front-mu of the Kidney.)',
          },
          {
            zhHant:
              '二、帶脈的定位：帶脈 GB26 怎麼定？（第 11 肋游離端下方的垂線，與通過肚臍的水平線，兩線交點；也就是章門下 1.8 寸、平臍。）',
            en: 'Two — locating 帶脈 GB26. How is it fixed? (Where a vertical dropped from the free end of the 11th rib meets the horizontal through the navel — that is, 1.8 cun below 章門, level with the navel.)',
          },
          {
            zhHant:
              '三、髂前上棘那一對：五樞與維道差多少？各在髂前上棘的哪一面？（維道在五樞的前下方 0.5 寸；五樞在棘的前方，維道在前下方。）',
            en: 'Three — the pair on the iliac spine. How far apart are 五樞 and 維道, and where is each relative to the spine? (維道 is 0.5 cun in front of and below 五樞; 五樞 sits in front of the spine, 維道 in front of and below it.)',
          },
          {
            zhHant:
              '四、前後配對：章門與京門在背後各配哪一個背俞穴？在第幾椎？（章門—脾俞 BL20，第 11 胸椎棘突下旁開 1.5 寸；京門—腎俞 BL23，第 2 腰椎棘突下旁開 1.5 寸。）',
            en: 'Four — front and back. Which back-shu point pairs with 章門, and which with 京門, and at which vertebra? (章門 with 脾俞 BL20, below the 11th thoracic spinous process, 1.5 cun out; 京門 with 腎俞 BL23, below the 2nd lumbar, 1.5 cun out.)',
          },
          {
            zhHant:
              '五、腋中線上：由上而下有哪三個穴？（淵腋 GB22 與輒筋 GB23 同在第 4 肋間隙，輒筋在淵腋前 1 寸；大包 SP21 在第 6 肋間隙，是唯一的脾之大絡。）',
            en: 'Five — along the mid-axillary line, from the top. (淵腋 GB22 and 輒筋 GB23 share the 4th intercostal space, 輒筋 one cun in front; 大包 SP21 is in the 6th, and is the only great luo-connecting point of the Spleen.)',
          },
        ],
      },
      {
        id: 'sec_19_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET19],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是身側，十三區裡最小的一個——八個穴，三條經。別的地方靠寸數排隊，我靠骨頭：第 11 肋端下面是章門，第 12 肋端下面是京門。這兩個穴很特別，它們都掛錯了經——章門在肝經上卻是脾的募穴，京門在膽經上卻是腎的募穴，而且背後各有一個俞穴跟它們前後相配：脾俞在第 11 胸椎，腎俞在第 2 腰椎。我還有一條橫著走的線：帶脈平著肚臍繞身一圈，是全身唯一不往上下走的。再往下，五樞和維道掛在髂前上棘上，差半寸。抬起手，腋中線第 4 隙是淵腋和輒筋，第 6 隙是大包。我不談臟腑功能，我只報靠的是哪一塊骨頭。」',
            en: 'Record one minute: “I am the flank, the smallest of the thirteen regions — eight points, three channels. Elsewhere points line up by cun; on me they hang off bone. Below the tip of the 11th rib is 章門, below the 12th is 京門. Those two are peculiar: both sit on the ‘wrong’ channel — 章門 is a Liver point collecting for the Spleen, 京門 a Gallbladder point collecting for the Kidney — and each has a partner behind it on the back, 脾俞 at the 11th thoracic vertebra and 腎俞 at the 2nd lumbar. I also carry the one course that runs sideways: 帶脈, level with the navel, going round instead of up. Lower down, 五樞 and 維道 hang off the anterior superior iliac spine, half a cun apart. Raise an arm and the mid-axillary line gives 淵腋 and 輒筋 in the 4th space and 大包 in the 6th. I do not discuss organ function. I say which bone a point hangs from.”',
          },
        ],
      },
      {
        id: 'sec_19_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D18（腹部）：①臍為原點，上八寸下五寸 ②平臍那一列：神闕 0、肓俞 0.5 寸、天樞 2 寸、大橫 4 寸 ③本區的帶脈正好也平臍，接得上。回鍋 D17（胸部）：第 4 肋間隙是錨點——今天的淵腋、輒筋就在同一隙，只是繞到了腋中線。回鍋 D8（膽經）：膽經從頭側一路下行，經身側到下肢；今天走的是它的身側段。回鍋 D9（肝經）：章門是肝經的穴——今天看清楚它募的是脾，不是肝。',
            en: 'Day 18 back (the abdomen): the navel as origin, eight cun up and five down; the row level with it — 神闕 at 0, 肓俞 at 0.5, 天樞 at 2, 大橫 at 4 — and today’s 帶脈 lies on that same horizontal. Day 17 back (the chest): the 4th intercostal space is the anchor, and today’s 淵腋 and 輒筋 sit in it, carried round to the mid-axillary line. Day 8 back (the Gallbladder): the channel runs from the side of the head down through the flank to the leg, and today is its flank stretch. Day 9 back (the Liver): 章門 is a Liver point — today makes clear it collects for the Spleen, not the Liver.',
          },
        ],
      },
    ],
  },
  /*
   * Day 20 — the knee and lower leg, and the leg's answer to Day 15.
   *
   * Five corrections against the records:
   *
   *  1. Three cited points are not in this region: 風市 GB31 is hip & thigh,
   *     and 崑崙 BL60 and 太溪 KI3 are ankle & foot. Each is taught on its day.
   *  2. The channel list named four. The region carries SIX — 陰谷 KI10 puts
   *     腎經 here and 曲泉 LR8 puts 肝經.
   *  3. 陰陵泉 SP9 and 地機 SP8 were filed under spaced review. Both are points
   *     of THIS region.
   *  4. The whole review block was misattributed: 足三里 and 豐隆 to Day 1,
   *     懸鐘 and 陽陵泉 to Day 7, 委中 and 承山 to Day 14, 崑崙 and 太溪 to Day
   *     15 — four of those five pairs are today's own points, and Days 14 and
   *     15 were the wrist and the elbow.
   *  5. 「濡養全身筋膜（筋會）」 survived on 陽陵泉. 筋會 is kept as the
   *     classification the record carries and nothing more, which is what the
   *     brief itself asked for.
   *
   * Six app features were named that do not exist — tendon and muscle
   * rendering, a fibular-head highlight, a 「肌肉透明」 mode, a mid-thigh line,
   * and a 3D model, which the project deferred by agreement.
   *
   * The spine is derived and mirrors the elbow: ALL SIX 下合穴 of the fu
   * organs are in this one region, and so is one 合穴 for each of the six leg
   * channels. Two of the eight 八會穴 are here as well.
   */
  {
    id: 'day_20',
    dayNumber: 20,
    titleZhHant: '膝部及小腿 — 六個下合穴的所在',
    titleEn: 'Knee & lower leg — where all six lower he-sea points live',
    hookZhHant: '肘部收齊了手六經的合穴；膝與小腿收齊了六腑的下合穴——六個，一個不少，全在這一區。',
    hookEn: 'The elbow gathered one he-sea point from each of the six arm channels. The knee and lower leg gather all six lower he-sea points of the fu organs — six of six, none of them anywhere else.',
    meridianIds: ['mer_st', 'mer_sp', 'mer_bl', 'mer_ki', 'mer_gb', 'mer_lr'],
    sourceIds: [WORKSHEET20, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己腿上找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own leg, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_20_learn',
        kind: 'learn',
        titleZhHant: '【學】六腑的下合穴，全在這一段腿上',
        titleEn: 'Learn — the fu organs’ six lower he-sea points, all on this stretch of leg',
        sourceIds: [WORKSHEET20],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這一區收錄 33 個穴，走六條經：胃 ST、脾 SP、膀胱 BL、腎 KI、膽 GB、肝 LR。第 15 天在肘部收齊了手六經的合穴；今天在膝與小腿收齊的是另一組——六腑的下合穴，六個全在這裡，別處一個也沒有。',
            en: 'Thirty-three points on six channels: Stomach, Spleen, Bladder, Kidney, Gallbladder and Liver. Day 15 gathered one he-sea point from each of the six arm channels at the elbow. Today gathers a different set: the six lower he-sea points of the fu organs — all six here, and not one of them anywhere else on the body.',
          },
          {
            zhHant:
              '★ 六個下合穴：足三里 ST36（胃）｜上巨虛 ST37（大腸）｜下巨虛 ST39（小腸）｜委中 BL40（膀胱）｜委陽 BL39（三焦）｜陽陵泉 GB34（膽）。注意胃經一條就佔了三個——大腸與小腸的下合穴都借在胃經的小腿段上，這是最容易漏掉的一組。',
            en: 'The six. 足三里 ST36 for the Stomach, 上巨虛 ST37 for the Large Intestine, 下巨虛 ST39 for the Small Intestine, 委中 BL40 for the Bladder, 委陽 BL39 for the Triple Energiser, and 陽陵泉 GB34 for the Gallbladder. Note that one channel carries three: the Large and Small Intestine both borrow a station on the Stomach channel’s lower leg, which is the pair most often missed.',
          },
          {
            zhHant:
              '★ 膕橫紋那一組：委中 BL40 在膕橫紋中點、股二頭肌腱與半腱肌肌腱的中間——它同時是膀胱經的合穴與膀胱的下合穴。委陽 BL39 在膕橫紋外側端、股二頭肌腱的內側，是三焦的下合穴。一個在中間、一個在外側端，兩者相鄰而分屬不同的腑。',
            en: 'The popliteal row. 委中 BL40 lies at the midpoint of the popliteal crease, between the tendons of biceps femoris and semitendinosus — at once the Bladder channel’s he-sea and the Bladder’s lower he-sea. 委陽 BL39 lies at the lateral end of the same crease, on the medial side of the biceps tendon, and is the Triple Energiser’s lower he-sea. One at the centre, one at the lateral end, neighbours belonging to different fu.',
          },
          {
            zhHant:
              '★ 腓骨那一條：陽陵泉 GB34 在腓骨頭前下方的凹陷——膽經合穴、膽的下合穴，同時是八會穴中的筋會。往下，懸鐘 GB39 在外踝尖上 3 寸、腓骨前緣，是八會穴中的髓會。八個會穴裡有兩個在這一區，都掛在腓骨上。「筋會」「髓會」在本課只當分類名稱用。',
            en: 'The fibular line. 陽陵泉 GB34 sits in the depression anterior and inferior to the head of the fibula — the Gallbladder’s he-sea, its lower he-sea, and one of the eight influential points, the one for the sinews. Lower down, 懸鐘 GB39 sits 3 cun above the tip of the lateral malleolus at the anterior border of the fibula, the influential point for the marrow. Two of the eight are in this region and both hang off the fibula. 筋會 and 髓會 are used here as category names and nothing more.',
          },
          {
            zhHant:
              '★ 小腿後面一條線：合陽 BL55 在委中直下 2 寸；承筋 BL56 在委中下 5 寸、腓腸肌肌腹中央；承山 BL57 在腓腸肌兩肌腹下端交角處，伸直小腿或足跟上提時最明顯。三個穴同在委中與崑崙的連線上，靠肌腹的形狀分段。',
            en: 'The line down the back of the calf. 合陽 BL55 lies 2 cun directly below 委中; 承筋 BL56 5 cun below it, at the centre of the belly of gastrocnemius; and 承山 BL57 where the two bellies meet at their lower ends — clearest when the calf is straightened or the heel raised. All three sit on the line from 委中 toward 崑崙, divided up by the shape of the muscle.',
          },
          {
            zhHant:
              '★ 每一條腿經在這裡也各留了一個合穴：足三里 ST36（胃）、陰陵泉 SP9（脾，脛骨內側髁後下方）、委中 BL40（膀胱）、陰谷 KI10（腎）、陽陵泉 GB34（膽）、曲泉 LR8（肝）。與肘部那六個合穴對照著記：上肢六合在肘，下肢六合在膝。',
            en: 'Each leg channel also leaves one he-sea point here: 足三里 ST36 for the Stomach, 陰陵泉 SP9 for the Spleen below and behind the medial condyle of the tibia, 委中 BL40 for the Bladder, 陰谷 KI10 for the Kidney, 陽陵泉 GB34 for the Gallbladder and 曲泉 LR8 for the Liver. Hold it against the elbow: six he-sea points there for the arm, six here for the leg.',
          },
          {
            zhHant:
              '骨度：臀橫紋到膕橫紋定為 14 寸，膕橫紋到外踝尖定為 16 寸；小腿也可用膝中（脛骨平台）到外踝尖 16 寸來量。豐隆 ST40 在外踝尖上 8 寸、脛骨前嵴外二橫指，正好是小腿的一半；懸鐘在踝上 3 寸，離膝中還有 13 寸。',
            en: 'The rulers: buttock crease to popliteal crease is 14 cun, popliteal crease to the tip of the lateral malleolus 16; the lower leg can also be measured as 16 cun from the middle of the knee to that malleolus. 豐隆 ST40 sits 8 cun above the malleolus, two finger-breadths lateral to the tibial crest — exactly halfway up the lower leg — and 懸鐘, 3 cun above it, is still 13 from the knee.',
          },
        ],
      },
      {
        id: 'sec_20_do',
        kind: 'do',
        titleZhHant: '【做】在自己腿上找',
        titleEn: 'Do — find them on your own leg',
        sourceIds: [WORKSHEET20],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「膝部及小腿」。開啟時是全區；用 ＋ 放大，拖曳平移，「全區」回到整體。這一區有 33 個穴，正面與背面都有——用標題列的「正面／背面」切換，膕窩那一組要到背面才看得到。',
            en: 'Open the Regions tab and choose Knee & lower leg. It opens on the whole region; ＋ magnifies, dragging pans, Fit returns. Thirty-three points spread across both body views — use the Front/Back control in the header, since the popliteal group only appears on the back.',
          },
          {
            zhHant:
              '一、膕橫紋：坐著把膝蓋微屈，摸到膝後那條橫紋。它的中點是委中；沿橫紋往外側走到盡頭，摸到一條粗的肌腱（股二頭肌腱），它的內側就是委陽。兩個穴在同一條紋上，一中一外。',
            en: 'One — the popliteal crease. Sit with the knee slightly bent and feel the crease behind it. Its midpoint is 委中. Follow the crease laterally to its end and find the thick tendon there — biceps femoris — with 委陽 on its medial side. Two points on one crease, one central and one at the end.',
          },
          {
            zhHant:
              '二、腓骨頭：手指從膝外側往下摸，會碰到一個圓的骨性突起，那是腓骨頭。它的前下方有一個凹陷，就是陽陵泉。這是全區最好找的骨性標志，先立住它，小腿外側其他穴都從它往下量。',
            en: 'Two — the head of the fibula. Run a finger down the outside of the knee until it meets a round bony prominence: that is the fibular head. The depression in front of and below it is 陽陵泉. It is the easiest bony landmark in the region — fix it first, and the rest of the lateral lower leg is measured downward from there.',
          },
          {
            zhHant:
              '三、腓腸肌：踮起腳尖，小腿後面隆起兩塊肌腹。沿委中往下 2 寸是合陽，往下 5 寸、肌腹正中是承筋；再往下，兩塊肌腹的下端會合成一個「人」字形的交角，那裡是承山。放鬆再踮一次，看交角怎麼出現又消失。',
            en: 'Three — the calf. Raise up onto the toes and two bellies stand out at the back of the leg. Two cun below 委中 is 合陽; five cun below, at the centre of the belly, is 承筋; and lower still, where the two bellies converge at their lower ends into a shape like an inverted V, is 承山. Relax and rise again, and watch that junction appear and vanish.',
          },
          {
            zhHant:
              '四、走一趟胃經：從犢鼻（外膝眼）往下量 3 寸、脛骨前緣外一橫指是足三里；再往下 3 寸是上巨虛（大腸的下合穴），再往下 3 寸是下巨虛（小腸的下合穴）。三個穴一路往下、每次 3 寸，是三個不同的腑。',
            en: 'Four — walk the Stomach channel. From 犢鼻 at the outer eye of the knee, measure 3 cun down and one finger-breadth lateral to the tibial crest for 足三里; 3 cun further for 上巨虛, the Large Intestine’s lower he-sea; and 3 cun further again for 下巨虛, the Small Intestine’s. Three points, three cun apart, three different fu organs.',
          },
        ],
      },
      {
        id: 'sec_20_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET20],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '下合穴口訣（七言）：「六腑下合皆在膝，胃取三里大巨虛；小腸再下三寸是，膀胱委中三焦陽。膽在腓骨頭前下，陽陵泉兼筋之會；一經獨佔三個腑，胃經小腿記分明。」',
            en: 'The lower he-sea points, seven characters to a clause: 「六腑下合皆在膝，胃取三里大巨虛；小腸再下三寸是，膀胱委中三焦陽。膽在腓骨頭前下，陽陵泉兼筋之會；一經獨佔三個腑，胃經小腿記分明。」',
          },
          {
            zhHant:
              '最容易漏的是胃經那三個：足三里、上巨虛、下巨虛，每隔 3 寸一個，分屬胃、大腸、小腸。大腸與小腸的下合穴不在手上——它們借在腿上，這是「下合」二字的意思。',
            en: 'The trio most often missed belongs to the Stomach channel: 足三里, 上巨虛 and 下巨虛, one every three cun, standing for the Stomach, the Large Intestine and the Small Intestine. The Large and Small Intestine have no lower he-sea point on the arm — they borrow a station on the leg, which is what the word 下 in 下合穴 is saying.',
          },
          {
            zhHant:
              '形象聯想：委中在膕窩的正中，兩條肌腱之間的凹處；陽陵泉在腓骨頭前下的凹陷，是筋會；承山在腓腸肌兩肌腹會合的人字尖上；懸鐘貼著腓骨前緣，是髓會。',
            en: 'Images: 委中 at the centre of the hollow behind the knee, in the dip between two tendons; 陽陵泉 in the depression below and in front of the fibular head, the influential point of the sinews; 承山 at the inverted-V where the two calf bellies meet; and 懸鐘 against the front edge of the fibula, the influential point of the marrow.',
          },
        ],
      },
      {
        id: 'sec_20_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET20],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、六個下合穴：分別是哪六個穴、各配哪一個腑？（足三里 ST36 胃、上巨虛 ST37 大腸、下巨虛 ST39 小腸、委中 BL40 膀胱、委陽 BL39 三焦、陽陵泉 GB34 膽。）',
            en: 'One — the six lower he-sea points and their fu organs. (足三里 ST36 Stomach, 上巨虛 ST37 Large Intestine, 下巨虛 ST39 Small Intestine, 委中 BL40 Bladder, 委陽 BL39 Triple Energiser, 陽陵泉 GB34 Gallbladder.)',
          },
          {
            zhHant:
              '二、膕橫紋上的兩個：委中與委陽各在哪裡？各是哪一個腑的下合穴？（委中在中點、兩肌腱之間，膀胱；委陽在外側端、股二頭肌腱內側，三焦。）',
            en: 'Two — the two on the popliteal crease. Where is each, and for which fu? (委中 at the midpoint between the two tendons, for the Bladder; 委陽 at the lateral end on the medial side of the biceps tendon, for the Triple Energiser.)',
          },
          {
            zhHant:
              '三、腓骨上的兩個會穴：陽陵泉與懸鐘各是八會穴中的哪一會？各在哪裡？（陽陵泉是筋會，在腓骨頭前下方凹陷；懸鐘是髓會，在外踝尖上 3 寸、腓骨前緣。）',
            en: 'Three — the two influential points on the fibula. Which of the eight is each, and where? (陽陵泉 is the influential point of the sinews, in the depression anteroinferior to the fibular head; 懸鐘 that of the marrow, 3 cun above the tip of the lateral malleolus at the anterior border of the fibula.)',
          },
          {
            zhHant:
              '四、骨度：膝中到外踝尖為 16 寸。懸鐘在踝上 3 寸，離膝中幾寸？豐隆在踝上 8 寸，佔這一段的幾分之幾？（13 寸；8 ÷ 16 = 一半。）',
            en: 'Four — the ruler. Middle of the knee to the tip of the lateral malleolus is 16 cun. 懸鐘 is 3 cun above the malleolus: how far from the knee? And 豐隆, 8 cun above it, is what fraction of the segment? (Thirteen cun; and 8 ÷ 16 — exactly half.)',
          },
          {
            zhHant:
              '五、小腿後側三站：合陽、承筋、承山各在委中下幾寸／靠什麼定？（合陽 委中下 2 寸；承筋 委中下 5 寸、腓腸肌肌腹中央；承山 在兩肌腹下端的交角處。）',
            en: 'Five — the three stations down the calf. (合陽 2 cun below 委中; 承筋 5 cun below it at the centre of the gastrocnemius belly; 承山 where the two bellies converge at their lower ends.)',
          },
        ],
      },
      {
        id: 'sec_20_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET20],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是膝和小腿。六腑的下合穴全在我身上，一個不少：胃的足三里、大腸的上巨虛、小腸的下巨虛，三個都排在胃經上，每隔三寸一個；膀胱的委中在膕橫紋中點，三焦的委陽在同一條紋的外側端；膽的陽陵泉在腓骨頭前下方。八會穴裡我有兩個，都掛在腓骨上：陽陵泉是筋會，懸鐘是髓會。六條腿經也各在我這裡留了一個合穴。從膝中到外踝尖是十六寸，豐隆正好在一半。我不談腰腿的痛症，我只找肌腱之間的縫和骨頭的突起。」',
            en: 'Record one minute: “I am the knee and lower leg. Every one of the fu organs’ lower he-sea points is on me: 足三里 for the Stomach, 上巨虛 for the Large Intestine and 下巨虛 for the Small Intestine, all three on the Stomach channel three cun apart; 委中 for the Bladder at the midpoint of the popliteal crease and 委陽 for the Triple Energiser at its lateral end; and 陽陵泉 for the Gallbladder below the head of the fibula. Two of the eight influential points are mine, both on that fibula: 陽陵泉 for the sinews, 懸鐘 for the marrow. Each of the six leg channels also leaves a he-sea point here. From the middle of my knee to the tip of the lateral malleolus is sixteen cun, and 豐隆 sits at exactly half. I do not discuss aches. I look for the gaps between tendons and the prominences of bone.”',
          },
        ],
      },
      {
        id: 'sec_20_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D19（身側）：①章門在肝經上卻是脾的募穴，京門在膽經上卻是腎的募穴 ②帶脈平臍。回鍋 D18（腹部）：臍為原點，旁開 0.5、2、4 寸。回鍋 D17（胸部）：肋間隙為縱軸，旁開 0、2、4、6 寸。回鍋 D15（肘與前臂）：六個合穴全在肘、六個郄穴全在前臂——今天的膝正好是它的下肢對照：六個合穴在膝，六個下合穴也在膝。',
            en: 'Day 19 back (the flank): 章門 sits on the Liver channel yet is the Spleen’s front-mu, 京門 on the Gallbladder yet the Kidney’s; and 帶脈 is level with the navel. Day 18 back (the abdomen): the navel as origin, with lines at 0.5, 2 and 4 cun. Day 17 back (the chest): rib spaces down, 0, 2, 4 and 6 cun across. Day 15 back (the elbow and forearm): six he-sea points at the elbow and six xi-cleft in the forearm — and today’s knee is its counterpart in the leg, holding six he-sea points and all six lower he-sea besides.',
          },
        ],
      },
    ],
  },
  /*
   * Day 21 — the head, and the scalp's own grid.
   *
   * The draft was titled 頭頸部 and covered the head, the face and the neck
   * together — 76 points across three of the thirteen regions. Ingested as the
   * HEAD alone; the facial points (印堂 GV29, 迎香 LI20, 攢竹 BL2, 四白 ST2,
   * 頰車 ST6, 聽宮 SI19, 聽會 GB2, 翳風 TE17, 承泣 ST1, 地倉 ST4, 瞳子髎 GB1)
   * and the cervical ones (人迎 ST9, 水突 ST10, 天突 CV22) go to their own days.
   *
   * Corrected against the records:
   *
   *  1. 四神聰 EX-HN1 was a ★ core point and 太陽 EX-HN5 a named landmark.
   *     Neither is loaded: this dataset holds the 362 points of the fourteen
   *     channels and no 經外奇穴. Same class as 八邪 in the Day 14 draft.
   *  2. 「膀胱寸半膽三寸」. The Bladder line is 旁開 1.5 寸 — but the Gallbladder
   *     scalp line (目窗 GB16, 正營 GB17, 承靈 GB18, 腦空 GB19) is 2.25 寸.
   *     Only 本神 GB13, at the hairline, is 3 寸.
   *  3. The review block sent 風府 and 啞門 to Day 18 (the abdomen), 瞳子髎 and
   *     聽會 to Day 19 (the flank), and 人迎 and 水突 to Day 20 (the knee) —
   *     and the last pair are neck points not yet taught.
   *
   * Five app features named that do not exist: per-sub-segment default zooms,
   * bony-landmark pre-highlighting, a translucent carotid overlay, a 骨骼透視
   * mode, and rendering at "≥200% native resolution" — the figure is vector,
   * and it draws no skull, no vessels and no muscles.
   */
  {
    id: 'day_21',
    dayNumber: 21,
    titleZhHant: '頭部 — 髮際為尺，四條經線並行',
    titleEn: 'Head — the hairline as ruler, four lines running back',
    hookZhHant: '頭皮上四條線並行往後：督脈走正中 0 寸，膀胱旁開 1.5 寸，膽經 2.25 寸，胃經的頭維在 4.5 寸。前後髮際 12 寸，是這一區唯一的尺。',
    hookEn: 'Four lines run back across the scalp: the Governing vessel along the midline at 0, the Bladder at 1.5 cun, the Gallbladder at 2.25, and the Stomach’s 頭維 out at 4.5. Front hairline to back is 12 cun — the one ruler this region uses.',
    meridianIds: ['mer_st', 'mer_bl', 'mer_gb', 'mer_te', 'mer_gv'],
    sourceIds: [WORKSHEET21, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己頭上找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own head, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_21_learn',
        kind: 'learn',
        titleZhHant: '【學】髮際為尺，四線並行',
        titleEn: 'Learn — the hairline as ruler, four parallel lines',
        sourceIds: [WORKSHEET21],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這一區收錄 34 個穴，走五條經：督脈 GV 11 個、膽經 GB 13 個、膀胱經 BL 8 個，加上胃經的頭維 ST8 與三焦經的角孫 TE20。胸腹用肋間隙與臍當尺，頭皮用的是髮際：前髮際到後髮際定為 12 寸，所有縱向距離都從髮際起算。',
            en: 'Thirty-four points on five channels: eleven on the Governing vessel, thirteen on the Gallbladder, eight on the Bladder, plus 頭維 ST8 of the Stomach and 角孫 TE20 of the Triple Energiser. The chest and abdomen measured by rib space and navel; the scalp measures by hairline. Front hairline to back is defined as 12 cun, and every vertical distance is counted from there.',
          },
          {
            zhHant:
              '★ 橫軸四條線，這是今天的骨架：督脈 GV 走頭正中線（0 寸）；膀胱經旁開 1.5 寸——曲差 BL4、五處 BL5、承光 BL6、通天 BL7、絡卻 BL8 一路往後；膽經的頭皮線旁開 2.25 寸——目窗 GB16、正營 GB17、承靈 GB18、腦空 GB19；再外面是胃經的頭維 ST8，旁開 4.5 寸，在額角髮際上 0.5 寸。',
            en: 'Four lines across, and this is the day’s skeleton. The Governing vessel runs the midline at 0. The Bladder runs 1.5 cun out — 曲差 BL4, 五處 BL5, 承光 BL6, 通天 BL7 and 絡卻 BL8, one behind the other. The Gallbladder’s scalp line runs 2.25 cun out — 目窗 GB16, 正營 GB17, 承靈 GB18, 腦空 GB19. Further out again is 頭維 ST8 of the Stomach at 4.5 cun, half a cun above the hairline at the corner of the forehead.',
          },
          {
            zhHant:
              '注意膽經有兩個數字：頭皮那四個穴旁開 2.25 寸，而本神 GB13 旁開 3 寸——它在前髮際上 0.5 寸，落在神庭與頭維連線的內三分之二與外三分之一交點上。「膽三寸」只對本神一個穴成立，對頭皮線不成立。',
            en: 'The Gallbladder carries two figures, and this is where the mnemonic usually goes wrong. Its four scalp points are 2.25 cun out, but 本神 GB13 is 3 — it sits half a cun above the front hairline, at the junction of the inner two-thirds and outer third of the line from 神庭 to 頭維. Three cun is true of 本神 alone, not of the scalp line.',
          },
          {
            zhHant:
              '★ 正中線由前往後：神庭 GV24 在前髮際上 0.5 寸；上星 GV23 在 1 寸；百會 GV20 在 5 寸，也就是兩耳尖連線的中點；再往後翻過頭頂，腦戶 GV17 在後髮際上 2.5 寸、枕外隆凸上緣；風府 GV16 在後髮際上 1 寸、枕外隆凸直下；啞門 GV15 在後髮際上 0.5 寸。前後各一組 0.5／1 寸，中間隔著整個頭頂。',
            en: 'Down the midline, front to back: 神庭 GV24 half a cun above the front hairline, 上星 GV23 at one, and 百會 GV20 at five — which is also the midpoint of the line between the ear tips. Over the crown and down the back: 腦戶 GV17 2.5 cun above the back hairline at the upper border of the external occipital protuberance, 風府 GV16 at one cun directly below that protuberance, and 啞門 GV15 at half a cun. A 0.5-and-1 pair at each end, with the whole crown between them.',
          },
          {
            zhHant:
              '★ 枕下那一組，靠肌肉定位：風池 GB20 在枕骨之下、與風府相平，胸鎖乳突肌與斜方肌上端之間的凹陷中。天柱 BL10 在後髮際正中旁開 1.3 寸、斜方肌外緣凹陷中。風府在正中、風池在兩側同高——三個穴橫成一排，是枕下最好認的一組。',
            en: 'The suboccipital row, located by muscle rather than by cun. 風池 GB20 sits below the occipital bone, level with 風府, in the depression between the upper ends of sternocleidomastoid and trapezius. 天柱 BL10 sits 1.3 cun lateral to the midline at the back hairline, in the depression at the outer edge of trapezius. 風府 in the middle with 風池 either side at the same height — three points in a row, the easiest group to find under the occiput.',
          },
          {
            zhHant:
              '這一區有 21 個交會穴，是全身比例最高的幾區之一——頭是諸經上行交會的地方。「交會穴」在本課只當分類名稱用，不作其他解釋。',
            en: 'Twenty-one of these thirty-four are crossing points, one of the highest proportions on the body — the head is where the ascending channels meet. 交會穴 is used here as a category name and nothing more.',
          },
        ],
      },
      {
        id: 'sec_21_do',
        kind: 'do',
        titleZhHant: '【做】在自己頭上找',
        titleEn: 'Do — find them on your own head',
        sourceIds: [WORKSHEET21],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「頭部」。開啟時是全區；用 ＋ 放大，拖曳平移，「全區」回到整體。頭部的穴正面與背面都有——用標題列的「正面／背面」切換，枕下那一組要到背面才看得到。',
            en: 'Open the Regions tab and choose Head. It opens on the whole region; ＋ magnifies, dragging pans, Fit returns. Its points appear on both body views — use the Front/Back control in the header, since the suboccipital group only shows on the back.',
          },
          {
            zhHant:
              '一、先立兩條髮際：一手摸到前髮際正中，一手摸到後髮際正中，這一段就是 12 寸。前髮際上半寸是神庭，一寸是上星；往上五寸、也就是兩耳尖連線的中點，是百會。用手指從神庭一路推到百會，體會這五寸有多長。',
            en: 'One — set the two hairlines. Find the midpoint of the front hairline with one hand and of the back with the other: that span is 12 cun. Half a cun above the front is 神庭, one cun is 上星, and five cun up — which is also the midpoint of the line joining the ear tips — is 百會. Run a finger from 神庭 back to 百會 and feel how long five cun is.',
          },
          {
            zhHant:
              '二、量四條線：把手指放在前髮際正中，往外側移約一寸半，那是膀胱經的曲差；再往外約三分之二寸（合計 2.25 寸）是膽經的頭皮線；再往外到額角髮際，抬眉時摸得到肌肉隆起，上方半寸是頭維（4.5 寸）。四條線由內而外：0、1.5、2.25、4.5。',
            en: 'Two — measure the four lines. Put a finger at the midpoint of the front hairline and move out about one and a half cun: that is 曲差 on the Bladder. Another two-thirds of a cun out (2.25 in all) is the Gallbladder scalp line. Further out, at the corner of the forehead where the muscle bunches when you raise the brow, half a cun above the hairline is 頭維 at 4.5. Inside to outside: 0, 1.5, 2.25, 4.5.',
          },
          {
            zhHant:
              '三、翻到後面：摸到後腦最凸的骨點——枕外隆凸。它的上緣是腦戶，它的正下方、後髮際上 1 寸是風府。從風府往兩側平移，摸到兩條大肌肉之間的凹陷，那是風池；再往外一點、斜方肌外緣是天柱。四個穴圍著枕外隆凸排開。',
            en: 'Three — turn to the back. Feel for the most prominent bony point on the back of the skull, the external occipital protuberance. Its upper border carries 腦戶; directly below it, one cun above the back hairline, is 風府. Move sideways from 風府 to the hollow between two large muscles for 風池, and a little further out at the outer edge of trapezius for 天柱. Four points arranged around one protuberance.',
          },
          {
            zhHant:
              '四、耳朵當標志：把耳廓向前折，耳尖所對、入髮際處是角孫 TE20。它是本區唯一的三焦經穴，也是用耳朵而不是髮際定位的一個。',
            en: 'Four — use the ear. Fold the auricle forward: the point in the hairline directly above the ear tip is 角孫 TE20. It is this region’s only Triple Energiser point, and the only one located by the ear rather than by the hairline.',
          },
        ],
      },
      {
        id: 'sec_21_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET21],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '頭皮四線口訣（七言）：「督脈居中零寸行，膀胱旁開一寸半；膽經頭皮二二五，頭維四寸半在邊。前後髮際十二寸，神庭半寸百會五；枕凸之下風府在，兩旁風池肌間陷。」',
            en: 'The scalp’s four lines, seven characters to a clause: 「督脈居中零寸行，膀胱旁開一寸半；膽經頭皮二二五，頭維四寸半在邊。前後髮際十二寸，神庭半寸百會五；枕凸之下風府在，兩旁風池肌間陷。」',
          },
          {
            zhHant:
              '第三句要特別記：膽經的頭皮線是 2.25 寸，不是 3 寸。3 寸是本神 GB13 一個穴的數字，它在前髮際上 0.5 寸。把「膽三寸」套在整條頭皮線上，是這一區最常見的錯。',
            en: 'The third clause is the one to hold: the Gallbladder’s scalp line is 2.25 cun, not 3. Three belongs to 本神 GB13 alone, half a cun above the front hairline. Applying "the Gallbladder at three" to the whole scalp line is the commonest mistake in this region.',
          },
          {
            zhHant:
              '形象聯想：百會在頭頂正中，是兩耳尖連線與正中線的交點，像頭上的座標原點；枕外隆凸是後腦的地標，風府在它的正下方，風池在兩側的肌肉夾縫裡；頭維守在額角，是四條線裡最外面的一條。',
            en: 'Images: 百會 at the crown, where the line between the ear tips crosses the midline — the origin of the head’s coordinates. The external occipital protuberance as the landmark of the back of the skull, with 風府 directly beneath it and 風池 in the muscular clefts either side. And 頭維 standing guard at the corner of the forehead, outermost of the four lines.',
          },
        ],
      },
      {
        id: 'sec_21_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET21],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、四條線：由內而外各旁開幾寸、各屬哪一條經？（督脈 0 寸；膀胱經 1.5 寸；膽經頭皮線 2.25 寸；胃經頭維 4.5 寸。）',
            en: 'One — the four lines, inside to outside: how far out is each, and which channel? (Governing vessel 0; Bladder 1.5; Gallbladder scalp line 2.25; 頭維 of the Stomach 4.5.)',
          },
          {
            zhHant:
              '二、膽經的兩個數字：頭皮線旁開幾寸？哪一個穴是 3 寸？（頭皮線 2.25 寸；3 寸的是本神 GB13，在前髮際上 0.5 寸。）',
            en: 'Two — the Gallbladder’s two figures. How far out is the scalp line, and which point is at 3 cun? (The scalp line is 2.25; the point at 3 is 本神 GB13, half a cun above the front hairline.)',
          },
          {
            zhHant:
              '三、髮際尺：前髮際到後髮際是幾寸？神庭、上星、百會各在前髮際上幾寸？（12 寸；0.5、1、5 寸。）',
            en: 'Three — the hairline ruler. How many cun from front hairline to back, and how far above the front hairline are 神庭, 上星 and 百會? (Twelve; 0.5, 1 and 5.)',
          },
          {
            zhHant:
              '四、枕下三穴：風府、風池、天柱各靠什麼定位？（風府在後正中線、枕外隆凸直下、後髮際上 1 寸；風池與風府相平，在胸鎖乳突肌與斜方肌上端之間的凹陷；天柱在後髮際正中旁開 1.3 寸、斜方肌外緣。）',
            en: 'Four — the suboccipital three. How is each located? (風府 on the posterior midline, directly below the occipital protuberance, one cun above the back hairline; 風池 level with it, in the depression between the upper ends of sternocleidomastoid and trapezius; 天柱 1.3 cun lateral to the midline at the back hairline, at the outer edge of trapezius.)',
          },
          {
            zhHant:
              '五、辨析：風池與風府差在哪裡？（風府在正中線上，風池在兩側；兩者同高。風府靠骨（枕外隆凸），風池靠肌肉（兩肌之間的凹陷）。）',
            en: 'Five — tell them apart. How do 風池 and 風府 differ? (風府 is on the midline, 風池 either side of it, both at the same height. 風府 is located by bone — the occipital protuberance — and 風池 by muscle, in the cleft between two of them.)',
          },
        ],
      },
      {
        id: 'sec_21_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET21],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是頭部。我的尺是髮際：前髮際到後髮際十二寸，所有縱向距離都從這裡量。我的頭皮上有四條線並行往後：督脈走正中零寸，膀胱經旁開一寸半，膽經的頭皮線二點二五寸，最外面是胃經的頭維，四點五寸。小心膽經有兩個數字——頭皮線是二點二五，只有本神那一個穴是三寸。我的正中線上，神庭在前髮際上半寸，百會在五寸、也就是兩耳尖連線的中點。翻到後面，枕外隆凸是地標：它下面是風府，兩側肌肉夾縫裡是風池。我三十四個穴裡有二十一個是交會穴。我不談五官的功能，我只找髮際、骨突和肌肉之間的凹陷。」',
            en: 'Record one minute: “I am the head. My ruler is the hairline — twelve cun from the front one to the back, and every vertical distance is counted from there. Four lines run back across my scalp: the Governing vessel along the midline at zero, the Bladder at one and a half cun, the Gallbladder’s scalp line at two and a quarter, and outermost 頭維 of the Stomach at four and a half. Careful with the Gallbladder: it has two figures, and only 本神 is at three. Down my midline, 神庭 is half a cun above the front hairline and 百會 five, which is also the midpoint between the ear tips. Round the back, the occipital protuberance is the landmark: 風府 below it, 風池 in the muscular clefts either side. Twenty-one of my thirty-four points are crossing points. I do not discuss the senses. I look for hairlines, bony prominences and the hollows between muscles.”',
          },
        ],
      },
      {
        id: 'sec_21_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D20（膝與小腿）：六腑的下合穴全在那一區，其中三個排在胃經上。回鍋 D18（腹部）：臍為原點，旁開 0.5、2、4 寸——今天頭皮的 0、1.5、2.25、4.5 是同一種讀法，換了一把尺。回鍋 D17（胸部）：肋間隙為縱軸、旁開為橫軸。回鍋 D14（腕與手）：合谷 LI4 是大腸經原穴——大腸經上行到面部，明天走面部時會再遇到它的終點迎香。',
            en: 'Day 20 back (knee and lower leg): all six lower he-sea points are there, three of them on the Stomach channel. Day 18 back (the abdomen): the navel as origin with lines at 0.5, 2 and 4 — today’s scalp at 0, 1.5, 2.25 and 4.5 is the same kind of reading on a different ruler. Day 17 back (the chest): rib spaces down, lateral distance across. Day 14 back (wrist and hand): 合谷 LI4 is the Large Intestine’s yuan-source, and that channel runs up to the face — tomorrow’s region ends at its last point, 迎香.',
          },
        ],
      },
    ],
  },
  /*
   * Day 22 — the face, and the first draft in this series to arrive scoped to
   * one region.
   *
   * Five corrections against the records:
   *
   *  1. The channel list named six. The region carries EIGHT: 承漿 CV24 puts
   *     the Conception vessel here, and 印堂 GV29, 素髎 GV25, 水溝 GV26,
   *     兌端 GV27 and 齦交 GV28 put the Governing vessel here.
   *  2. Those six midline points were omitted altogether — including 印堂,
   *     which the Day 21 draft had made a core point, and 水溝, the philtrum.
   *     The face's midline is one of its three organising lines and the draft
   *     had none of it.
   *  3. 攢竹 BL2 was placed at the 眶上孔. Its record says 眶上切跡 — a notch,
   *     not a foramen; both exist in anatomy and they are different structures.
   *  4. 地倉 ST4 was placed 鼻唇溝中. Its record fixes it by the corner of the
   *     mouth, level with the pupil, 0.4 寸 out. The nasolabial groove belongs
   *     to 迎香 LI20 and 巨髎 ST3 (鼻唇溝外側).
   *  5. 承泣 and 四白 were said to be about 0.5 寸 apart. No record states a
   *     distance between them; each is fixed to its own structure.
   *
   * Six app features named that do not exist: a default zoom to the infraorbital
   * band, four highlight modes, and a 「動態張口／咬牙視圖」.
   *
   * The spine: the face is organised by three devices, not one. A vertical
   * through the pupil carries four Stomach points; a midline runs from the
   * brows to the chin; and a ring of twelve points surrounds the ear.
   */
  {
    id: 'day_22',
    dayNumber: 22,
    titleZhHant: '面部 — 一條瞳孔線、一條正中線、一圈耳周',
    titleEn: 'Face — a pupil line, a midline, and a ring around the ear',
    hookZhHant: '面部三十二個穴，靠三樣東西排列：瞳孔往下的一條垂線、眉心到下巴的一條正中線，還有繞著耳朵的一圈。孔竅與骨緣就是尺。',
    hookEn: 'Thirty-two points on the face, organised by three things: a vertical dropped through the pupil, a midline from the brows to the chin, and a ring around the ear. The openings and the bony edges are the ruler.',
    meridianIds: ['mer_li', 'mer_st', 'mer_si', 'mer_bl', 'mer_te', 'mer_gb', 'mer_cv', 'mer_gv'],
    sourceIds: [WORKSHEET22, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己臉上找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。眼周只作觀察與定位，不做任何按壓。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own face, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique. Around the eye, locate by looking, not by pressing.',
    sections: [
      {
        id: 'sec_22_learn',
        kind: 'learn',
        titleZhHant: '【學】三條線把臉分好',
        titleEn: 'Learn — three lines organise the face',
        sourceIds: [WORKSHEET22],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這一區收錄 32 個穴，走八條經——胃 ST 7 個、膽 GB 7 個、三焦 TE 6 個、督脈 GV 5 個、大腸 LI 2 個、小腸 SI 2 個、膀胱 BL 2 個、任脈 CV 1 個。臉上沒有肋間隙也沒有臍，尺是五官本身：瞳孔、鼻翼、口角、耳屏、眶緣、顴弓、下頜角。',
            en: 'Thirty-two points on eight channels — seven Stomach, seven Gallbladder, six Triple Energiser, five Governing vessel, two each of Large Intestine, Small Intestine and Bladder, and one Conception vessel. There are no rib spaces here and no navel; the ruler is the face itself — the pupil, the ala of the nose, the corner of the mouth, the tragus, the orbital rim, the zygomatic arch and the angle of the jaw.',
          },
          {
            zhHant:
              '★ 第一條線：瞳孔垂線。平視前方，從瞳孔垂直往下，四個胃經穴依序排開——承泣 ST1（眼球與眶下緣之間）、四白 ST2（眶下孔凹陷處）、巨髎 ST3（平鼻翼下緣，鼻唇溝外側）、地倉 ST4（口角外側，上直瞳孔，旁開 0.4 寸）。一條垂線串起眼、鼻、口三層，是全臉最好用的一條尺。',
            en: 'The first line: the vertical through the pupil. Looking straight ahead, drop a line from the pupil and four Stomach points fall on it in order — 承泣 ST1 between the eyeball and the infraorbital margin, 四白 ST2 in the depression of the infraorbital foramen, 巨髎 ST3 level with the lower border of the ala of the nose just outside the nasolabial groove, and 地倉 ST4 at the corner of the mouth, level with the pupil, 0.4 cun out. One vertical through the eye, the nose and the mouth — the most useful ruler on the face.',
          },
          {
            zhHant:
              '★ 第二條線：正中線。由上而下——印堂 GV29（兩眉毛內側端中間的凹陷）、素髎 GV25（鼻尖正中央）、水溝 GV26（人中溝的上 1/3 與中 1/3 交點）、兌端 GV27（上唇尖端）、齦交 GV28（上唇繫帶與上齒齦相接處，在口腔內）、承漿 CV24（頦唇溝的正中凹陷）。督脈五個、任脈一個，從眉心一路走到下巴。',
            en: 'The second line: the midline, from the top down. 印堂 GV29 in the hollow between the inner ends of the eyebrows; 素髎 GV25 at the very tip of the nose; 水溝 GV26 at the junction of the upper and middle thirds of the philtrum; 兌端 GV27 at the tip of the upper lip; 齦交 GV28 where the upper labial frenulum meets the gum, inside the mouth; and 承漿 CV24 in the hollow of the mentolabial groove. Five Governing-vessel points and one of the Conception vessel, running from between the brows to the chin.',
          },
          {
            zhHant:
              '★ 第三條線：耳周一圈。耳前由上而下——耳和髎 TE22（耳門上約 0.5 寸）、耳門 TE21（耳屏上切跡前）、聽宮 SI19（耳屏正中與下頜骨髁狀突之間）、聽會 GB2（耳屏間切跡前）。耳後——翳風 TE17（耳垂後方、乳突前下方）、瘈脈 TE18、顱息 TE19、完骨 GB12（乳突後下方）。三個不同的經在耳朵前後交錯，全靠耳屏的切跡與乳突分辨。',
            en: 'The third line: the ring around the ear. In front, from the top down — 耳和髎 TE22 about half a cun above 耳門, 耳門 TE21 in front of the supratragic notch, 聽宮 SI19 between the centre of the tragus and the condylar process of the mandible, and 聽會 GB2 in front of the intertragic notch. Behind — 翳風 TE17 behind the lobe and in front of and below the mastoid, then 瘈脈 TE18, 顱息 TE19 and 完骨 GB12 below and behind the mastoid. Three channels interleave around one ear, told apart entirely by the notches of the tragus and by the mastoid.',
          },
          {
            zhHant:
              '★ 骨緣上的幾個：攢竹 BL2 在眉頭凹陷中、眶上切跡處（是切跡，不是孔）；睛明 BL1 在目內眥角稍上方的凹陷；瞳子髎 GB1 在目外眥旁、眶外側緣；下關 ST7 在顴弓下緣中央與下頜切跡之間，閉口時才有凹陷；頰車 ST6 在下頜角前上約一橫指、咬緊牙時咬肌隆起的最高處；大迎 ST5 在下頜角前方、咬肌附著部前緣、面動脈搏動處。',
            en: 'And the ones on bone. 攢竹 BL2 in the hollow at the inner end of the eyebrow, at the supraorbital NOTCH — a notch, not a foramen. 睛明 BL1 in the depression just above the inner canthus. 瞳子髎 GB1 beside the outer canthus at the lateral orbital margin. 下關 ST7 between the middle of the lower border of the zygomatic arch and the mandibular notch, where a depression appears only with the mouth closed. 頰車 ST6 about a finger-breadth anterosuperior to the angle of the jaw, at the highest point of the masseter when the teeth are clenched. And 大迎 ST5 in front of that angle, at the anterior border of the masseter’s attachment, where the facial artery pulses.',
          },
          {
            zhHant:
              '大腸經在這裡結束：迎香 LI20 在鼻翼外緣中點旁、鼻唇溝中，是大腸經二十穴的最後一站。第 14 天從商陽 LI1 在食指開始的那條經，走到臉上就停在鼻翼旁。',
            en: 'The Large Intestine channel ends here. 迎香 LI20 sits beside the midpoint of the ala of the nose, in the nasolabial groove, the last of that channel’s twenty stations. The channel that began at 商陽 LI1 on the index finger back on Day 14 stops beside the nose.',
          },
        ],
      },
      {
        id: 'sec_22_do',
        kind: 'do',
        titleZhHant: '【做】在自己臉上找',
        titleEn: 'Do — find them on your own face',
        sourceIds: [WORKSHEET22],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「面部」。開啟時是全區；用 ＋ 放大想細看的一處，拖曳平移，「全區」回到整體。三十二個穴擠在一張臉上，是全身最密的一區之一——放大著看比縮小著看有用。',
            en: 'Open the Regions tab and choose Face. It opens on the whole region; ＋ magnifies whatever you want to read closely, dragging pans, Fit returns. Thirty-two points on one face makes this among the densest regions on the body — it rewards magnifying rather than taking in at once.',
          },
          {
            zhHant:
              '一、走瞳孔垂線：對著鏡子平視，用一指從瞳孔往下移。眼球與眶下緣之間是承泣（只看不按）；再下是眶下孔的凹陷，四白；再下平鼻翼下緣是巨髎；最後到口角外側是地倉。四個穴一條直線，記住這條線，胃經在臉上的位置就定了。',
            en: 'One — walk the pupil line. In a mirror, looking straight ahead, run a finger down from the pupil. Between the eyeball and the infraorbital margin is 承泣 — look, do not press. Below it, the dip of the infraorbital foramen is 四白. Below that, level with the lower border of the ala, is 巨髎. Last, beside the corner of the mouth, 地倉. Four points on one straight line, and with it the Stomach channel’s place on the face is settled.',
          },
          {
            zhHant:
              '二、走正中線：從兩眉之間的凹陷（印堂）往下，到鼻尖正中（素髎），再到人中溝上三分之一處（水溝），到上唇尖端（兌端），最後到下唇與下巴之間的橫溝正中（承漿）。齦交在上唇裡面，翻開上唇才看得到——它是全區唯一在口腔內的穴。',
            en: 'Two — walk the midline. From the hollow between the brows (印堂) down to the tip of the nose (素髎), then to the upper third of the philtrum (水溝), the tip of the upper lip (兌端), and finally the hollow of the groove between lower lip and chin (承漿). 齦交 is inside the upper lip and only visible if you lift it — the one point of this region in the mouth.',
          },
          {
            zhHant:
              '三、耳朵當座標：摸到耳屏（耳孔前那片小軟骨）。它上方的切跡前是耳門，正中前方張口有凹陷的是聽宮，下方那個切跡前是聽會——三個穴由上而下貼著耳屏排開，分屬三焦、小腸、膽三條經。再繞到耳後，耳垂後方、乳突前下方的凹陷是翳風。',
            en: 'Three — use the ear as a coordinate. Find the tragus, the small flap in front of the ear canal. In front of the notch above it is 耳門; directly in front of its centre, where a depression appears on opening the mouth, is 聽宮; in front of the notch below it is 聽會 — three points down the tragus belonging to three different channels. Then round the back: behind the lobe and in front of and below the mastoid is 翳風.',
          },
          {
            zhHant:
              '四、動一動下頜：用力咬牙，摸到咬肌隆起的最高處，那是頰車；放鬆、閉口，在顴弓下緣中央摸到凹陷，那是下關——張口時這個凹陷會消失。前方沿咬肌前緣摸到搏動處是大迎。三個穴都靠下頜的動作分辨。',
            en: 'Four — move the jaw. Clench the teeth and feel for the highest point of the masseter: that is 頰車. Relax and close the mouth, and feel the depression at the middle of the lower border of the zygomatic arch: that is 下關, and it vanishes when the mouth opens. Forward along the anterior border of the masseter, where a pulse can be felt, is 大迎. All three are told apart by moving the jaw.',
          },
        ],
      },
      {
        id: 'sec_22_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET22],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '面部三線口訣（七言）：「瞳孔垂下四穴連，承泣四白巨髎倉；正中一線印堂起，素髎水溝兌承漿。耳屏上下三穴列，耳門聽宮聽會旁；眶上切跡攢竹在，鼻翼之外迎香當。」',
            en: 'The face’s three lines, seven characters to a clause: 「瞳孔垂下四穴連，承泣四白巨髎倉；正中一線印堂起，素髎水溝兌承漿。耳屏上下三穴列，耳門聽宮聽會旁；眶上切跡攢竹在，鼻翼之外迎香當。」',
          },
          {
            zhHant:
              '耳屏那三個最容易混：由上而下是耳門 TE21（三焦）、聽宮 SI19（小腸）、聽會 GB2（膽）。三個穴貼在一塊小軟骨上，卻分屬三條經——用「上中下對三焦、小腸、膽」記，比記凹陷的樣子可靠。',
            en: 'The three on the tragus are the ones that blur together: top to bottom, 耳門 TE21 of the Triple Energiser, 聽宮 SI19 of the Small Intestine, and 聽會 GB2 of the Gallbladder. Three points on one small flap of cartilage, on three different channels — remembering "top, middle, bottom = Triple Energiser, Small Intestine, Gallbladder" holds better than trying to remember which dip is which.',
          },
          {
            zhHant:
              '形象聯想：瞳孔垂線像一根鉛垂線，把眼、鼻、口三層串起來；正中線從眉心走到下巴，是臉的中軸；耳周那一圈像圍著耳朵轉了半圈，前四後四。攢竹在眉頭的切跡上——切跡是骨頭上的一道缺口，不是一個洞。',
            en: 'Images: the pupil line as a plumb line threading the eye, the nose and the mouth; the midline as the face’s axis from brow to chin; the ear points as a half-circle round the ear, four in front and four behind. And 攢竹 sitting in the supraorbital notch — a notch is a gap in the bone’s edge, not a hole through it.',
          },
        ],
      },
      {
        id: 'sec_22_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET22],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、瞳孔垂線：由上而下有哪四個穴？各靠什麼定位？（承泣 ST1 眼球與眶下緣之間；四白 ST2 眶下孔；巨髎 ST3 平鼻翼下緣；地倉 ST4 口角外側、上直瞳孔、旁開 0.4 寸。）',
            en: 'One — the pupil line, top to bottom: which four points, and what fixes each? (承泣 ST1 between eyeball and infraorbital margin; 四白 ST2 at the infraorbital foramen; 巨髎 ST3 level with the lower border of the ala; 地倉 ST4 beside the mouth, level with the pupil, 0.4 cun out.)',
          },
          {
            zhHant:
              '二、正中線：由上而下有哪六個穴？各屬哪一條脈？（印堂 GV29、素髎 GV25、水溝 GV26、兌端 GV27、齦交 GV28 屬督脈；承漿 CV24 屬任脈。）',
            en: 'Two — the midline, top to bottom: which six points, and on which vessel? (印堂 GV29, 素髎 GV25, 水溝 GV26, 兌端 GV27 and 齦交 GV28 on the Governing vessel; 承漿 CV24 on the Conception.)',
          },
          {
            zhHant:
              '三、耳屏三穴：由上而下是哪三個？各屬哪一條經？（耳門 TE21 三焦、聽宮 SI19 小腸、聽會 GB2 膽。）',
            en: 'Three — the three on the tragus, top to bottom, and their channels. (耳門 TE21 Triple Energiser, 聽宮 SI19 Small Intestine, 聽會 GB2 Gallbladder.)',
          },
          {
            zhHant:
              '四、切跡還是孔：攢竹 BL2 在眉頭凹陷中的哪一個結構上？（眶上切跡——是骨緣上的一道缺口。眶下孔是四白 ST2 的位置，那才是一個孔。）',
            en: 'Four — notch or foramen? Which structure carries 攢竹 BL2 at the inner end of the eyebrow? (The supraorbital NOTCH, a gap in the bone’s edge. The infraorbital FORAMEN is where 四白 ST2 sits — that one is a hole.)',
          },
          {
            zhHant:
              '五、閉口才有：哪一個穴的凹陷在閉口時出現、張口時消失？（下關 ST7，在顴弓下緣中央與下頜切跡之間。聽宮、聽會、耳門正好相反，張口時凹陷才明顯。）',
            en: 'Five — present only with the mouth closed. Which point’s depression appears on closing the mouth and vanishes on opening it? (下關 ST7, between the middle of the lower border of the zygomatic arch and the mandibular notch. 聽宮, 聽會 and 耳門 are the other way round — their depressions show when the mouth opens.)',
          },
        ],
      },
      {
        id: 'sec_22_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET22],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是面部，三十二個穴、八條經。我沒有肋間隙也沒有肚臍，我的尺是五官自己。我有三條線。第一條從瞳孔垂直落下：承泣、四白、巨髎、地倉，四個胃經穴串起眼鼻口。第二條是正中線：印堂、素髎、水溝、兌端、齦交、承漿，從眉心走到下巴，五個督脈加一個任脈。第三條繞著耳朵：耳屏由上而下是耳門、聽宮、聽會，分屬三焦、小腸、膽；耳後是翳風。我的骨緣也在幫忙——攢竹在眶上切跡，注意是切跡不是孔；四白才在眶下孔。大腸經在我這裡結束，最後一站是鼻翼旁的迎香。我不談五官的功能，我只找孔竅的邊和骨頭的緣。」',
            en: 'Record one minute: “I am the face — thirty-two points, eight channels. I have no rib spaces and no navel; my ruler is my own features. I have three lines. The first drops straight from the pupil: 承泣, 四白, 巨髎, 地倉, four Stomach points threading eye, nose and mouth. The second is my midline: 印堂, 素髎, 水溝, 兌端, 齦交, 承漿 — brow to chin, five on the Governing vessel and one on the Conception. The third runs round my ear: down the tragus, 耳門, 聽宮, 聽會, on the Triple Energiser, Small Intestine and Gallbladder; behind it, 翳風. My bony edges help too — 攢竹 sits in the supraorbital notch, a notch and not a hole; it is 四白 that sits in the infraorbital foramen. The Large Intestine channel ends on me, at 迎香 beside the nose. I do not discuss the senses. I look for the edges of openings and the borders of bone.”',
          },
        ],
      },
      {
        id: 'sec_22_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D21（頭部）：①頭皮四線 0、1.5、2.25、4.5 寸 ②髮際 12 寸的尺 ③風府在正中、風池在兩側肌間——今天的臉接在它的下面。回鍋 D17（胸部）：中府 LU1、天池 PC1 的肋間定位。回鍋 D14（腕與手）：商陽 LI1 在食指——大腸經從那裡起，今天在迎香收尾；合谷 LI4 是它的原穴。',
            en: 'Day 21 back (the head): the scalp’s four lines at 0, 1.5, 2.25 and 4.5 cun; the 12-cun hairline ruler; and 風府 on the midline with 風池 in the muscular clefts either side — today’s face sits below all of it. Day 17 back (the chest): 中府 LU1 and 天池 PC1 by rib space. Day 14 back (wrist and hand): 商陽 LI1 on the index finger, where the Large Intestine channel begins and whose last station is today’s 迎香; 合谷 LI4 is its yuan-source.',
          },
        ],
      },
    ],
  },
  /*
   * Day 23 — the neck, and the only region organised by one muscle.
   *
   * Six corrections against the records:
   *
   *  1. Two point codes were off by one. 天窗 is SI16, not SI15 — SI15 is
   *     肩中俞, on the upper back. 天容 is SI17, not SI16.
   *  2. 翳風 TE17 is a face point (Day 22) and 風池 GB20 a head point (Day 21);
   *     both were listed among this region's own.
   *  3. The channel list named 膽經 and 膀胱經, neither of which the region
   *     carries, and omitted 小腸經 — while naming two Small Intestine points.
   *  4. 扶突 LI18 was put on the POSTERIOR border of the sternocleidomastoid,
   *     with a 「喉結旁開 3 寸」 figure. Its record puts it on the ANTERIOR
   *     border, level with the laryngeal prominence, and gives no cun.
   *  5. 天鼎 LI17 was omitted although it is in the region.
   *  6. 「前髮際至胸骨上窩 = 12 寸」 and 「喉結至胸骨上窩 = 3 寸」 are anchored
   *     nowhere; 12 寸 is the front-to-back hairline span taught on Day 21.
   *
   * Six app features named that do not exist, despite the dev note saying
   * otherwise: a default zoom to the laryngeal band, a midline highlight, a
   * muscle-border display, two highlight modes and a 動態轉頭視圖.
   *
   * The spine: ten points, and eight of them hang off one muscle. Four on the
   * anterior border of the sternocleidomastoid, three on the posterior, one in
   * the cleft between its two heads, and two on the midline.
   */
  {
    id: 'day_23',
    dayNumber: 23,
    titleZhHant: '頸部 — 一條肌肉的前緣與後緣',
    titleEn: 'Neck — the front and back edges of one muscle',
    hookZhHant: '頸部十個穴，八個掛在同一條肌肉上：胸鎖乳突肌。前緣四個、後緣三個、兩頭之間一個，剩下兩個在前正中線。',
    hookEn: 'Ten points on the neck, and eight of them hang off a single muscle — the sternocleidomastoid. Four on its anterior border, three on its posterior, one in the cleft between its two heads, and two on the midline.',
    meridianIds: ['mer_li', 'mer_st', 'mer_si', 'mer_te', 'mer_cv'],
    sourceIds: [WORKSHEET23, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己頸部找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。頸前有大血管，本課只在體表確認位置。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own neck, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique. Large vessels run in the front of the neck; this lesson only establishes where things are on the surface.',
    sections: [
      {
        id: 'sec_23_learn',
        kind: 'learn',
        titleZhHant: '【學】一條肌肉，兩條邊',
        titleEn: 'Learn — one muscle, two edges',
        sourceIds: [WORKSHEET23],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這一區只有 10 個穴，是十三區裡第二小的，走五條經——大腸 LI、胃 ST、小腸 SI、三焦 TE、任脈 CV。頭皮用髮際當尺，臉用五官當尺；頸部用的是一條肌肉：胸鎖乳突肌。把頭轉向對側，這條斜行的肌束就繃起來，前後兩條邊都摸得到。',
            en: 'Ten points, the second smallest of the thirteen regions, on five channels — Large Intestine, Stomach, Small Intestine, Triple Energiser and the Conception vessel. The scalp measured by hairline and the face by its own features; the neck measures by a muscle. Turn the head to the opposite side and the sternocleidomastoid stands out as a diagonal band with two findable edges.',
          },
          {
            zhHant:
              '★ 前緣四個：扶突 LI18（橫平喉結，結喉旁）、人迎 ST9（橫平喉結，頸總動脈搏動處）、水突 ST10（人迎與氣舍連線的中點）、天容 SI17（下頜角後方的凹陷中）。注意扶突與人迎同高——都橫平喉結，都在前緣，一個屬大腸經、一個屬胃經。',
            en: 'Four on the anterior border: 扶突 LI18, level with the laryngeal prominence beside it; 人迎 ST9, also level with it, where the common carotid pulses; 水突 ST10, at the midpoint of the line from 人迎 to 氣舍; and 天容 SI17, in the depression behind the angle of the jaw. Note that 扶突 and 人迎 sit at the SAME height — both level with the laryngeal prominence, both on the anterior border, one on the Large Intestine and one on the Stomach.',
          },
          {
            zhHant:
              '★ 後緣三個：天窗 SI16（橫平喉結）、天鼎 LI17（扶突與缺盆連線的中點）、天牖 TE16（乳突後下方，約當扶突與翳風之間）。前緣的扶突與後緣的天窗同樣橫平喉結——同一個高度，隔著一條肌肉，一前一後。',
            en: 'Three on the posterior border: 天窗 SI16, level with the laryngeal prominence; 天鼎 LI17, at the midpoint of the line from 扶突 to 缺盆; and 天牖 TE16, below and behind the mastoid, roughly between 扶突 and 翳風. 扶突 in front and 天窗 behind are at the same height — one level, one muscle between them.',
          },
          {
            zhHant:
              '★ 剩下三個：氣舍 ST11 在鎖骨內側端上緣，胸鎖乳突肌的胸骨頭與鎖骨頭之間的凹陷中——不在前緣也不在後緣，而在這條肌肉分成兩束的那個叉口裡。前正中線上兩個：廉泉 CV23 在結喉上方、舌骨上緣凹陷處；天突 CV22 在胸骨上窩中央，是頸部的下界，接下去就是胸部（Day 17）。',
            en: 'And three more. 氣舍 ST11 sits at the upper border of the medial end of the clavicle, in the hollow between the sternal and clavicular heads of the muscle — not on either border but in the fork where it splits in two. On the midline: 廉泉 CV23 above the laryngeal prominence at the upper border of the hyoid, and 天突 CV22 in the centre of the suprasternal fossa, the lower limit of the neck, where the chest of Day 17 begins.',
          },
          {
            zhHant:
              '喉結是前面的錨點：平喉結的有三個穴——前緣的扶突與人迎，後緣的天窗。往上是廉泉，往下沿前緣是水突、再到鎖骨上的氣舍。整個頸前就是「一個高度、一條肌肉、兩條邊」。',
            en: 'The laryngeal prominence is the anchor at the front: three points sit level with it — 扶突 and 人迎 on the anterior border, 天窗 on the posterior. Above it is 廉泉; below it, down the anterior border, 水突 and then 氣舍 at the clavicle. The whole front of the neck is one height, one muscle and two edges.',
          },
          {
            zhHant:
              '人迎在頸總動脈搏動處——記錄本身就這樣寫。這是解剖事實，說明這個位置底下是什麼；本課只在體表確認它在哪裡。',
            en: '人迎 lies where the common carotid artery pulses — its own record says so. That is an anatomical fact about what lies beneath the spot. This lesson establishes only where the spot is.',
          },
        ],
      },
      {
        id: 'sec_23_do',
        kind: 'do',
        titleZhHant: '【做】在自己頸部找',
        titleEn: 'Do — find them on your own neck',
        sourceIds: [WORKSHEET23],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「頸部」。開啟時是全區；用 ＋ 放大，拖曳平移，「全區」回到整體。十個穴是十三區裡第二少的，清單一眼看得完——點任一標記，右側會顯示它靠的是肌肉的哪一條邊。',
            en: 'Open the Regions tab and choose Neck. It opens on the whole region; ＋ magnifies, dragging pans, Fit returns. Ten points is the second fewest of the thirteen and the list fits in one view — tap any marker and it names which edge of the muscle it belongs to.',
          },
          {
            zhHant:
              '一、把肌肉找出來：頭轉向左側，右側頸部會浮出一條由耳後斜向胸骨的肌束，那就是胸鎖乳突肌。用兩指分別按住它的前緣與後緣，先把這兩條邊記住——這一區八個穴都掛在上面。',
            en: 'One — bring the muscle out. Turn the head to the left and a band appears on the right side of the neck, running diagonally from behind the ear to the sternum: the sternocleidomastoid. Rest one finger on its front edge and another on its back edge and learn those two lines first — eight of this region’s ten points hang from them.',
          },
          {
            zhHant:
              '二、找喉結那一層：手指放在喉結上，往兩側平移。碰到前緣的是人迎與扶突（同高，一屬胃經一屬大腸經）；越過肌肉到後緣，同一高度的是天窗。三個穴一條水平線，前、前、後。',
            en: 'Two — work the laryngeal level. Put a finger on the laryngeal prominence and move sideways. Reaching the front edge you meet 人迎 and 扶突, at the same height, one Stomach and one Large Intestine. Cross the muscle to the back edge and at that same height is 天窗. Three points on one horizontal — front, front, back.',
          },
          {
            zhHant:
              '三、往上與往下：從喉結往上摸到舌骨的上緣，凹陷處是廉泉；往下沿前緣走到人迎與氣舍之間的中點是水突，再往下到鎖骨內側端上緣、肌肉分叉的凹陷是氣舍。最後回到正中線最下面，胸骨上窩中央是天突。',
            en: 'Three — up and down. From the prominence, feel upward to the upper border of the hyoid: the hollow there is 廉泉. Downward along the front edge, halfway between 人迎 and 氣舍, is 水突; lower still, at the upper border of the medial clavicle where the muscle forks, is 氣舍. Finally back to the midline at the bottom: the centre of the suprasternal fossa is 天突.',
          },
          {
            zhHant:
              '四、後上角：沿後緣往上摸到乳突的後下方，那一帶是天牖；它大約落在扶突與翳風（面部，Day 22）之間。天鼎則在扶突與缺盆的連線中點上，位置比天牖低。',
            en: 'Four — the upper back corner. Follow the back edge upward to below and behind the mastoid: that area is 天牖, lying roughly between 扶突 and 翳風 (a face point, Day 22). 天鼎 sits lower, at the midpoint of the line from 扶突 to 缺盆.',
          },
        ],
      },
      {
        id: 'sec_23_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET23],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '頸部口訣（七言）：「一條肌肉兩條邊，前緣扶突人迎連；水突再下天容上，氣舍鎖骨叉口間。後緣天窗平喉結，天鼎天牖上下懸；正中廉泉舌骨上，天突胸窩接胸前。」',
            en: 'The neck, seven characters to a clause: 「一條肌肉兩條邊，前緣扶突人迎連；水突再下天容上，氣舍鎖骨叉口間。後緣天窗平喉結，天鼎天牖上下懸；正中廉泉舌骨上，天突胸窩接胸前。」',
          },
          {
            zhHant:
              '最容易記錯的是穴號：天窗是 SI16，天容是 SI17。SI15 是肩中俞，在第 7 頸椎旁開 2 寸的背上，不在頸部這一區。三個名字都帶「天」，但只有兩個在頸側。',
            en: 'The codes are what go wrong: 天窗 is SI16 and 天容 is SI17. SI15 is 肩中俞, out on the back 2 cun lateral to the 7th cervical vertebra, not in this region at all. Several names here begin with 天, but only two of them are on the side of the neck.',
          },
          {
            zhHant:
              '形象聯想：胸鎖乳突肌像一條斜拉的繩，前緣一排、後緣一排；喉結是繩子中段的一個結，三個穴平著它排開；氣舍在繩子下端分叉的叉口裡；天突是頸與胸交界的那個窩。',
            en: 'Images: the sternocleidomastoid as a diagonal rope with a row of points along each edge; the laryngeal prominence as a knot partway down it, with three points level across; 氣舍 in the fork where the rope splits at its lower end; and 天突 the hollow where the neck hands over to the chest.',
          },
        ],
      },
      {
        id: 'sec_23_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET23],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、兩條邊：胸鎖乳突肌前緣有哪四個穴？後緣有哪三個？（前緣：扶突 LI18、人迎 ST9、水突 ST10、天容 SI17。後緣：天窗 SI16、天鼎 LI17、天牖 TE16。）',
            en: 'One — the two edges. Which four points lie on the anterior border of the sternocleidomastoid, and which three on the posterior? (Anterior: 扶突 LI18, 人迎 ST9, 水突 ST10, 天容 SI17. Posterior: 天窗 SI16, 天鼎 LI17, 天牖 TE16.)',
          },
          {
            zhHant:
              '二、平喉結的一層：有哪三個穴？各在前緣還是後緣？（扶突 LI18 與人迎 ST9 在前緣，天窗 SI16 在後緣。）',
            en: 'Two — the laryngeal level. Which three points sit level with the prominence, and on which border? (扶突 LI18 and 人迎 ST9 in front, 天窗 SI16 behind.)',
          },
          {
            zhHant:
              '三、穴號辨析：天窗、天容各是哪一號？SI15 又是什麼穴、在哪裡？（天窗 SI16、天容 SI17；SI15 是肩中俞，在第 7 頸椎棘突下旁開 2 寸的背部，屬背部及臀部區。）',
            en: 'Three — the codes. What are the numbers for 天窗 and 天容, and what is SI15? (天窗 SI16, 天容 SI17. SI15 is 肩中俞, below the 7th cervical spinous process 2 cun lateral, in the back region.)',
          },
          {
            zhHant:
              '四、不在兩條邊上的那一個：氣舍 ST11 在哪裡？（鎖骨內側端上緣，胸鎖乳突肌的胸骨頭與鎖骨頭之間的凹陷中——在肌肉分叉的叉口裡。）',
            en: 'Four — the one on neither edge. Where is 氣舍 ST11? (At the upper border of the medial end of the clavicle, in the hollow between the sternal and clavicular heads — in the fork where the muscle divides.)',
          },
          {
            zhHant:
              '五、正中線兩個：廉泉與天突各靠什麼定？（廉泉 CV23 在結喉上方、舌骨上緣凹陷處；天突 CV22 在胸骨上窩中央，是頸部下界。）',
            en: 'Five — the two on the midline. What fixes each? (廉泉 CV23 above the laryngeal prominence at the upper border of the hyoid; 天突 CV22 at the centre of the suprasternal fossa, the lower limit of the neck.)',
          },
        ],
      },
      {
        id: 'sec_23_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET23],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是頸部，只有十個穴，卻幾乎全掛在同一條肌肉上——胸鎖乳突肌。把頭轉開，它就浮出來，前後兩條邊都摸得到。前緣四個：扶突、人迎、水突、天容；後緣三個：天窗、天鼎、天牖。扶突和人迎同高，都平喉結；越過肌肉，同一高度的後緣是天窗。氣舍不在兩條邊上，它在肌肉下端分叉的叉口裡，貼著鎖骨。我的正中線只有兩個：舌骨上緣的廉泉，胸骨上窩的天突——天突就是我和胸部的交界。要小心穴號：天窗是十六，天容是十七，十五那個是肩中俞，在背上。我不談吞嚥或呼吸，我只找一條肌肉的兩條邊。」',
            en: 'Record one minute: “I am the neck. Only ten points, and nearly all of them hang off one muscle — the sternocleidomastoid. Turn your head and it stands out, with both edges findable. Four on the front edge: 扶突, 人迎, 水突, 天容. Three on the back: 天窗, 天鼎, 天牖. 扶突 and 人迎 are at the same height, level with the laryngeal prominence; cross the muscle at that height and you reach 天窗. 氣舍 is on neither edge — it sits in the fork where the muscle splits at its lower end, against the clavicle. My midline carries just two: 廉泉 at the upper border of the hyoid and 天突 in the suprasternal fossa, where I hand over to the chest. Watch the numbers: 天窗 is sixteen, 天容 seventeen, and fifteen is 肩中俞, out on the back. I do not discuss swallowing or breathing. I look for the two edges of one muscle.”',
          },
        ],
      },
      {
        id: 'sec_23_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D22（面部）：①三條線——瞳孔垂線、正中線、耳周一圈 ②翳風 TE17 在耳垂後方——今天的天牖就在它的下方，胸鎖乳突肌後緣上。回鍋 D21（頭部）：①頭皮四線 0、1.5、2.25、4.5 寸 ②風池在枕骨下、兩肌之間——它在頭部那一區，接在頸部的上面。回鍋 D17（胸部）：天突以下就是胸部，前正中線由此往下走九寸到胸劍聯合。',
            en: 'Day 22 back (the face): its three lines — the pupil vertical, the midline and the ring round the ear; and 翳風 TE17 behind the earlobe, just above where today’s 天牖 sits on the muscle’s posterior border. Day 21 back (the head): the scalp’s four lines at 0, 1.5, 2.25 and 4.5 cun, and 風池 below the occiput between two muscles — a head point, sitting just above this region. Day 17 back (the chest): below 天突 the chest begins, and the midline runs nine cun from there to the xiphisternal junction.',
          },
        ],
      },
    ],
  },
  /*
   * Day 24 — the hip and thigh: four faces, four channels, four rulers.
   *
   * Five corrections against the records:
   *
   *  1. 急脈 LR12 belongs to abdomen & groin (Day 18). It has now been claimed
   *     by three different region drafts; its arterial note travels with it.
   *  2. Five of the region's own points were omitted: 中瀆 GB32, 居髎 GB29, and
   *     all three Liver points — 陰包 LR9, 足五里 LR10, 陰廉 LR11. The draft
   *     listed 肝經 in its channel table while its only Liver point was 急脈,
   *     which is not in the region, so as written the channel had no
   *     representative at all.
   *  3. 箕門 SP11 was given as 「血海上 6 寸」. Its record fixes it at the
   *     junction of the upper third and lower two-thirds of the line from the
   *     medial end of the patellar base to 衝門.
   *  4. 「股骨大轉子至膕橫紋 = 14 寸」. This project and the standard both use
   *     19 寸 for the lateral thigh; 14 is the POSTERIOR segment, 臀橫紋 to
   *     膕橫紋. The draft then called 風市 at 7 寸 the midpoint, which follows
   *     only from the wrong figure.
   *  5. The medial thigh was measured 髂前上棘至股骨內上髁. The standard
   *     segment is 恥骨聯合上緣至股骨內上髁上緣 = 18 寸.
   *
   * Six app features named that do not exist, and a dev note claiming a
   * 「肌肉收縮動態視圖」 that has never existed either.
   */
  {
    id: 'day_24',
    dayNumber: 24,
    titleZhHant: '髖胯及大腿 — 四個面，四條經，四把尺',
    titleEn: 'Hip & thigh — four faces, four channels, four rulers',
    hookZhHant: '大腿有四個面，每一面一條經、一把自己的尺：前面胃經、外側膽經、內側脾與肝、後面膀胱經。十五個穴，看你摸的是哪一面。',
    hookEn: 'The thigh has four faces, and each carries its own channel and its own ruler: the Stomach in front, the Gallbladder outside, the Spleen and Liver inside, the Bladder behind. Fifteen points, and which one you mean depends on which face you are touching.',
    meridianIds: ['mer_st', 'mer_sp', 'mer_bl', 'mer_gb', 'mer_lr'],
    sourceIds: [WORKSHEET24, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己腿上找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own leg, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_24_learn',
        kind: 'learn',
        titleZhHant: '【學】一條腿，四個面',
        titleEn: 'Learn — one thigh, four faces',
        sourceIds: [WORKSHEET24],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這一區收錄 15 個穴，走五條經：胃 ST 4 個、膽 GB 4 個（含髖部的居髎）、肝 LR 3 個、脾 SP 2 個、膀胱 BL 2 個。大腿是圓的，所以定位的第一個問題永遠是「哪一面」——前、外、內、後各有自己的經和自己的量尺。',
            en: 'Fifteen points on five channels: four Stomach, four Gallbladder (counting 居髎 at the hip), three Liver, two Spleen and two Bladder. A thigh is round, so the first question is always which FACE — front, outside, inside and back each carry their own channel and their own measure.',
          },
          {
            zhHant:
              '★ 前面：胃經四個穴全部落在同一條線上——髂前上棘與髕底外側端的連線。由下往上：梁丘 ST34（髕底上 2 寸，胃經郄穴）、陰市 ST33（3 寸）、伏兔 ST32（6 寸）、髀關 ST31（屈髖時平會陰的凹陷處，這條線的最上端）。一條線、四個穴，只要記住 2、3、6 三個數字。',
            en: 'The front. All four Stomach points fall on one line — from the anterior superior iliac spine to the lateral end of the patellar base. Upward from the knee: 梁丘 ST34 two cun above the patellar base and the Stomach’s xi-cleft; 陰市 ST33 at three; 伏兔 ST32 at six; and 髀關 ST31 at the top of that line, in the depression level with the perineum when the hip is flexed. One line, four points, and only three numbers to hold: 2, 3, 6.',
          },
          {
            zhHant:
              '★ 外側：膽經三個。環跳 GB30 在股骨大轉子最凸點與骶管裂孔連線的外三分之一與中三分之一交點；風市 GB31 在大腿外側中線、膕橫紋上 7 寸，也就是直立垂手時中指尖所點處；中瀆 GB32 在風市下 2 寸、膕橫紋上 5 寸，股外側肌與股二頭肌之間。外側這一段以股骨大轉子到膕橫紋計，是 19 寸。',
            en: 'The outside: three Gallbladder points. 環跳 GB30 at the junction of the lateral and middle thirds of the line from the most prominent part of the greater trochanter to the sacral hiatus. 風市 GB31 on the lateral midline of the thigh, 7 cun above the popliteal crease — also where the tip of the middle finger falls when standing with the arms hanging. 中瀆 GB32 two cun below it, 5 cun above the crease, between vastus lateralis and biceps femoris. This face is measured from the greater trochanter to the popliteal crease: 19 cun.',
          },
          {
            zhHant:
              '★ 內側：脾經兩個、肝經三個。血海 SP10 在髕底內側端上 2 寸、股四頭肌內側頭的隆起處；箕門 SP11 在髕底內側端與衝門連線的上三分之一與下三分之二交點，長收肌與縫匠肌的交角。肝經三個更靠根部：陰廉 LR11（氣衝下 2 寸）、足五里 LR10（氣衝下 3 寸）、陰包 LR9（股骨內上髁上方 4 寸，股內側肌與縫匠肌之間）。內側這一段以恥骨聯合上緣到股骨內上髁上緣計，是 18 寸。',
            en: 'The inside: two Spleen points and three Liver. 血海 SP10 sits 2 cun above the medial end of the patellar base, on the bulge of vastus medialis; 箕門 SP11 at the junction of the upper third and lower two-thirds of the line from that same medial end up to 衝門, in the angle between adductor longus and sartorius. The three Liver points sit closer to the root: 陰廉 LR11 two cun below 氣衝, 足五里 LR10 three below it, and 陰包 LR9 four cun above the medial epicondyle of the femur, between vastus medialis and sartorius. This face is measured from the upper border of the pubic symphysis to the upper border of the medial epicondyle: 18 cun.',
          },
          {
            zhHant:
              '★ 後面：膀胱經兩個。承扶 BL36 在臀下橫紋的中點——臀部與大腿的分界；殷門 BL37 在承扶與委中的連線上、承扶下 6 寸。後面這一段以臀橫紋到膕橫紋計，是 14 寸，和外側的 19 寸是兩把不同的尺，別混用。',
            en: 'The back: two Bladder points. 承扶 BL36 at the midpoint of the gluteal crease — the boundary between buttock and thigh — and 殷門 BL37 on the line from it to 委中, six cun down. This face is measured from the gluteal crease to the popliteal crease: 14 cun. That and the lateral 19 are two different rulers; do not mix them.',
          },
          {
            zhHant:
              '髖部還有一個居髎 GB29，在髂前上棘與股骨大轉子最凸點連線的中點——兩個骨突之間，是躯幹交到大腿的那一步。它與環跳同屬膽經，一個靠髂棘、一個靠大轉子。',
            en: 'One more at the hip: 居髎 GB29, at the midpoint of the line between the anterior superior iliac spine and the most prominent part of the greater trochanter — between two bony points, the step where the trunk hands over to the thigh. It and 環跳 are both Gallbladder, one hung from the iliac spine and one from the trochanter.',
          },
        ],
      },
      {
        id: 'sec_24_do',
        kind: 'do',
        titleZhHant: '【做】在自己腿上找',
        titleEn: 'Do — find them on your own thigh',
        sourceIds: [WORKSHEET24],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「髖胯及大腿」。開啟時是全區；用 ＋ 放大，拖曳平移，「全區」回到整體。這一區正面與背面都有穴——用標題列的「正面／背面」切換，承扶與殷門要到背面才看得到。',
            en: 'Open the Regions tab and choose Hip & thigh. It opens on the whole region; ＋ magnifies, dragging pans, Fit returns. Its points appear on both views — use the Front/Back control, since 承扶 and 殷門 only show on the back.',
          },
          {
            zhHant:
              '一、先立前面那條線：摸到髂前上棘，再摸到髕骨上緣的外側端，兩點之間拉一條線。從髕底往上量 2 寸是梁丘、3 寸是陰市、6 寸是伏兔；線的最上端、屈髖時平會陰的凹陷是髀關。四個穴一條線。',
            en: 'One — set the front line first. Find the anterior superior iliac spine, then the lateral end of the upper border of the patella, and draw a line between them. Measuring up from the patellar base: 2 cun to 梁丘, 3 to 陰市, 6 to 伏兔; and at the top of the line, in the depression level with the perineum when the hip flexes, 髀關. Four points, one line.',
          },
          {
            zhHant:
              '二、外側用垂手法：直立、兩手自然下垂貼著大腿，中指尖所點之處就是風市——這是全課程最省事的一個定位。確認它在膕橫紋上 7 寸的高度，再往下 2 寸摸中瀆。往上摸到股骨大轉子那個大骨突，環跳就在它與骶管裂孔連線的外三分之一處。',
            en: 'Two — the outside, by hanging the arms. Stand with the arms hanging naturally against the thighs: where the tip of the middle finger falls is 風市 — the least effortful location in the whole course. Confirm it against 7 cun above the popliteal crease, then feel 2 cun lower for 中瀆. Upward, find the big prominence of the greater trochanter; 環跳 lies a third of the way along the line from it to the sacral hiatus.',
          },
          {
            zhHant:
              '三、內側靠肌肉：屈膝、繃緊大腿，髕骨內上方會鼓起一塊肌肉（股四頭肌內側頭），它的隆起處、髕底內側端上 2 寸就是血海。再往上，沿髕底內側端與衝門的連線走到上三分之一處是箕門。更靠根部的三個肝經穴（陰廉、足五里、陰包）貼著大腿最內側。',
            en: 'Three — the inside, by muscle. Bend the knee and tense the thigh: a bulge appears above and inside the patella, the vastus medialis. On that bulge, 2 cun above the medial end of the patellar base, is 血海. Further up, along the line from that same medial end to 衝門, at the junction of its upper third, is 箕門. The three Liver points — 陰廉, 足五里 and 陰包 — run closer to the innermost surface, nearer the root.',
          },
          {
            zhHant:
              '四、翻到後面：站直，摸到臀部下方那條橫紋，它的中點就是承扶。從承扶往下沿大腿後面正中量 6 寸是殷門。記得這一面用的是 14 寸的尺（臀橫紋到膕橫紋），不是外側那把 19 寸的。',
            en: 'Four — turn to the back. Standing, find the crease under the buttock: its midpoint is 承扶. From there, straight down the middle of the back of the thigh, 6 cun is 殷門. Remember this face uses the 14-cun ruler, gluteal crease to popliteal crease — not the 19-cun one from the outside.',
          },
        ],
      },
      {
        id: 'sec_24_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET24],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '大腿四面口訣（七言）：「前線一條胃經走，髕上二三六寸求；髀關高居線頂上，梁丘陰市伏兔收。外側垂手中指點，風市之下二寸瀆；內側血海髕上二，箕門三分之一途。後面臀紋中點扶，殷門再下六寸估。」',
            en: 'The thigh’s four faces, seven characters to a clause: 「前線一條胃經走，髕上二三六寸求；髀關高居線頂上，梁丘陰市伏兔收。外側垂手中指點，風市之下二寸瀆；內側血海髕上二，箕門三分之一途。後面臀紋中點扶，殷門再下六寸估。」',
          },
          {
            zhHant:
              '兩把尺不要混：外側是股骨大轉子到膕橫紋 19 寸，後面是臀橫紋到膕橫紋 14 寸，內側是恥骨聯合上緣到股骨內上髁上緣 18 寸。同一條腿，三個面三個長度——先問哪一面，再問幾寸。',
            en: 'Do not mix the rulers. The outside is 19 cun, greater trochanter to popliteal crease; the back is 14, gluteal crease to popliteal crease; the inside is 18, upper border of the pubic symphysis to upper border of the medial epicondyle. One thigh, three faces, three lengths — ask which face first, then how many cun.',
          },
          {
            zhHant:
              '形象聯想：伏兔在股直肌的隆起上，繃緊時像一隻蹲伏的兔；血海在髕骨內上方那塊鼓起的肌肉上；風市在垂手時中指尖自然落下的地方；承扶就在臀紋的正中，是臀與腿的分界。',
            en: 'Images: 伏兔 on the bulge of rectus femoris, which stands up like a crouching hare when the thigh tenses; 血海 on the mound above and inside the knee; 風市 exactly where the middle fingertip falls when the arm hangs; and 承扶 at the middle of the gluteal crease, the line where buttock becomes thigh.',
          },
        ],
      },
      {
        id: 'sec_24_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET24],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、前面那條線：胃經四個穴由下而上各在髕底上幾寸？（梁丘 2 寸、陰市 3 寸、伏兔 6 寸；髀關在這條線的最上端，屈髖時平會陰。）',
            en: 'One — the front line. How far above the patellar base is each of the four Stomach points, from the bottom up? (梁丘 2, 陰市 3, 伏兔 6; and 髀關 at the top of the line, level with the perineum when the hip flexes.)',
          },
          {
            zhHant:
              '二、三把尺：大腿外側、後側、內側各以哪兩個標志為端點、各幾寸？（外側：股骨大轉子至膕橫紋 19 寸；後側：臀橫紋至膕橫紋 14 寸；內側：恥骨聯合上緣至股骨內上髁上緣 18 寸。）',
            en: 'Two — the three rulers. Which two landmarks bound each face, and how long is each? (Outside: greater trochanter to popliteal crease, 19 cun. Back: gluteal crease to popliteal crease, 14. Inside: upper border of the pubic symphysis to upper border of the medial epicondyle, 18.)',
          },
          {
            zhHant:
              '三、垂手法：直立垂手時中指尖所點的是哪一個穴？它在膕橫紋上幾寸？（風市 GB31，膕橫紋上 7 寸。往下 2 寸是中瀆 GB32。）',
            en: 'Three — the hanging-arm method. Which point does the tip of the middle finger fall on, and how far above the popliteal crease is it? (風市 GB31, 7 cun above. Two cun below it is 中瀆 GB32.)',
          },
          {
            zhHant:
              '四、兩個骨突之間：居髎 GB29 與環跳 GB30 各靠哪兩個標志定位？（居髎在髂前上棘與股骨大轉子最凸點連線的中點；環跳在股骨大轉子最凸點與骶管裂孔連線的外三分之一與中三分之一交點。）',
            en: 'Four — between the bony points. Which landmarks fix 居髎 GB29 and 環跳 GB30? (居髎 at the midpoint of the line from the anterior superior iliac spine to the most prominent part of the greater trochanter; 環跳 at the junction of the lateral and middle thirds of the line from that trochanter to the sacral hiatus.)',
          },
          {
            zhHant:
              '五、內側的肝經三穴：陰廉、足五里、陰包各怎麼定？（陰廉 LR11 在氣衝下 2 寸；足五里 LR10 在氣衝下 3 寸；陰包 LR9 在股骨內上髁上方 4 寸，股內側肌與縫匠肌之間。）',
            en: 'Five — the three Liver points on the inside. (陰廉 LR11 two cun below 氣衝; 足五里 LR10 three below it; 陰包 LR9 four cun above the medial epicondyle of the femur, between vastus medialis and sartorius.)',
          },
        ],
      },
      {
        id: 'sec_24_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET24],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是髖胯和大腿。我是圓的，所以問我穴位之前要先問是哪一面。前面走胃經，四個穴全在髂前上棘到髕底外側端那一條線上：髕上二寸梁丘、三寸陰市、六寸伏兔，最上面是髀關。外面走膽經：環跳在大轉子與骶管裂孔之間，風市在垂手中指尖處、膕橫紋上七寸，再下二寸是中瀆。裡面走脾經和肝經：血海在髕內上二寸的肌肉隆起上，箕門在往衝門那條線的上三分之一處，肝經三個更靠根部。後面走膀胱經：承扶在臀紋中點，殷門在它下面六寸。我有三把尺，別混用：外側十九寸、後側十四寸、內側十八寸。我不談走路的力氣，我只找骨頭的突起和肌肉的隆起。」',
            en: 'Record one minute: “I am the hip and thigh. I am round, so before you ask me for a point you must say which face. My front carries the Stomach, and all four of its points sit on one line from the anterior superior iliac spine to the lateral end of the patellar base: 梁丘 at two cun above the base, 陰市 at three, 伏兔 at six, and 髀關 at the top. My outside carries the Gallbladder: 環跳 between the trochanter and the sacral hiatus, 風市 where the middle fingertip falls, seven cun above the popliteal crease, and 中瀆 two below it. My inside carries the Spleen and the Liver: 血海 on the muscle bulge two cun above the inner knee, 箕門 a third of the way up toward 衝門, and the three Liver points nearer the root. My back carries the Bladder: 承扶 at the middle of the gluteal crease and 殷門 six cun below. I have three rulers and they must not be mixed: nineteen cun outside, fourteen behind, eighteen inside. I do not discuss walking. I look for prominences of bone and bulges of muscle.”',
          },
        ],
      },
      {
        id: 'sec_24_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D23（頸部）：八個穴掛在胸鎖乳突肌的兩條邊上，兩個在正中線。回鍋 D20（膝與小腿）：六腑的下合穴全在那一區——今天的大腿正接在它上面，膕橫紋是兩區的交界。回鍋 D19（身側）：五樞、維道掛在髂前上棘上；今天的居髎在同一個骨突與大轉子之間。回鍋 D18（腹部）：衝門 SP12 在腹股溝，今天的箕門正是往它量過去的。',
            en: 'Day 23 back (the neck): eight points on the two edges of one muscle, two on the midline. Day 20 back (knee and lower leg): all six lower he-sea points are there, and today’s thigh sits directly above it, the popliteal crease dividing the two. Day 19 back (the flank): 五樞 and 維道 hang from the anterior superior iliac spine, and today’s 居髎 sits between that same spine and the greater trochanter. Day 18 back (the abdomen): 衝門 SP12 in the groin is the point today’s 箕門 is measured toward.',
          },
        ],
      },
    ],
  },
  /*
   * Day 25 — the foot, and the leg's answer to the hand.
   *
   * Five corrections against the records:
   *
   *  1. 三陰交 SP6 is 內踝尖上 3 寸 and belongs to knee & lower leg (Day 20).
   *     The draft made it a core point of this region.
   *  2. Three bone-cun segments were attributed to the foot. 13 寸 is the
   *     MEDIAL LOWER LEG (脛骨內側髁下方至內踝尖) and 16 寸 the LATERAL
   *     (膝中至外踝尖); neither runs from a malleolus to the sole. A 「趾端至
   *     踝橫紋 = 4 寸」 foot length is anchored nowhere in the dataset.
   *  3. A quiz asked: if the malleolus to the sole is 13 寸 and 三陰交 is 3 寸
   *     above the malleolus, how far is it from the sole — answering 10. Even
   *     granting the wrong premise, 3 寸 ABOVE means 13 + 3, not 13 − 3.
   *  4. Four of the six review pairs named points of this region or of Day 24:
   *     環跳/風市 and 血海/箕門 are Day 24's, 太衝/行間 and 湧泉 are today's.
   *  5. 至陰 was called 「下肢最遠端穴位」. Nothing in the records ranks it
   *     against 厲兌 ST45 or 足竅陰 GB44, which are also at toe-nail corners.
   *
   * Six app features named that do not exist, and a dev note claiming a
   * 「足趾屈伸動態視圖」 that does not either.
   *
   * The spine closes the limbs. The hand held six jing-well points at the
   * fingertips (Day 14); the elbow six he-sea and six xi-cleft (Day 15); the
   * knee six he-sea and all six lower he-sea (Day 20). The foot holds six
   * jing-well AND six yuan-source — one of each for every leg channel.
   */
  {
    id: 'day_25',
    dayNumber: 25,
    titleZhHant: '踝部及足部 — 六個井穴，六個原穴',
    titleEn: 'Ankle & foot — six jing-well points, six yuan-source',
    hookZhHant: '手指尖收齊了六個井穴；腳趾尖也收齊了六個。而且六條腿經的原穴，全在踝與足背上——十二個特定穴，一區收完。',
    hookEn: 'Six jing-well points at the fingertips; six more at the toes. And every one of the six leg channels leaves its yuan-source point on the ankle or the top of the foot — twelve specific points, all in one region.',
    meridianIds: ['mer_st', 'mer_sp', 'mer_bl', 'mer_ki', 'mer_gb', 'mer_lr'],
    sourceIds: [WORKSHEET25, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己腳上找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own foot, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_25_learn',
        kind: 'learn',
        titleZhHant: '【學】腳上的兩組六',
        titleEn: 'Learn — two sets of six on the foot',
        sourceIds: [WORKSHEET25],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這一區收錄 33 個穴，走六條腿經：胃 ST、脾 SP、膀胱 BL、腎 KI、膽 GB、肝 LR。第 14 天在手指尖收齊了六個井穴；今天在腳上收齊兩組——六個井穴，加上六條腿經的六個原穴。',
            en: 'Thirty-three points on the six leg channels: Stomach, Spleen, Bladder, Kidney, Gallbladder and Liver. Day 14 gathered six jing-well points at the fingertips. Today the foot gathers two sets: six jing-well points, and the yuan-source point of every one of the six leg channels.',
          },
          {
            zhHant:
              '★ 六個井穴，五個在趾甲角旁、一個不是：隱白 SP1（大趾內側甲角）｜大敦 LR1（大趾外側甲角，赤白肉際）｜厲兌 ST45（第 2 趾外側甲角）｜足竅陰 GB44（第 4 趾外側甲角）｜至陰 BL67（小趾外側甲角）｜湧泉 KI1——它在足底，第 2、3 趾蹼緣與足跟連線的前 1/3 與後 2/3 交點，是六個裡唯一不在甲角的。',
            en: 'Six jing-well points — five at toe-nail corners and one that is not. 隱白 SP1 at the medial corner of the great toe; 大敦 LR1 at its lateral corner, on the red-white boundary; 厲兌 ST45 at the lateral corner of the second toe; 足竅陰 GB44 at the fourth; 至陰 BL67 at the little toe. And 湧泉 KI1, on the SOLE, at the junction of the anterior third and posterior two-thirds of the line from the web between the second and third toes to the heel — the only one of the six not at a nail.',
          },
          {
            zhHant:
              '★ 六個原穴，全在踝與足背：沖陽 ST42（足背最高處，足背動脈搏動處）｜太白 SP3｜京骨 BL64｜太溪 KI3（內踝尖與跟腱之間的凹陷）｜丘墟 GB40（外踝前下方）｜太衝 LR3（足背第 1、2 蹠骨間）。手上的原穴聚在腕橫紋一線（第 14 天）；腳上的散在踝周與足背，但同樣是一經一個。',
            en: 'Six yuan-source points, spread across the ankle and the top of the foot. 沖陽 ST42 at the highest part of the dorsum where the dorsalis pedis pulses; 太白 SP3; 京骨 BL64; 太溪 KI3 in the depression between the medial malleolus and the Achilles tendon; 丘墟 GB40 below and in front of the lateral malleolus; and 太衝 LR3 between the first and second metatarsals. On the hand the yuan-source points cluster along one wrist crease (Day 14); on the foot they scatter round the ankle and the dorsum — but it is still one per channel.',
          },
          {
            zhHant:
              '★ 踝的三個標志：內踝尖、外踝尖、跟腱。跟腱的兩側各有一個穴——內側是太溪 KI3（腎經原穴），外側是崑崙 BL60（膀胱經經穴）。踝前橫紋的中央、拇長伸肌腱與趾長伸肌腱之間是解溪 ST41。三個標志圍出踝關節，三個穴分踞前、內、外。',
            en: 'Three landmarks at the ankle: the tip of the medial malleolus, the tip of the lateral, and the Achilles tendon. A point sits on each side of that tendon — 太溪 KI3 medially, the Kidney’s yuan-source, and 崑崙 BL60 laterally, the Bladder’s jing-river. At the centre of the anterior ankle crease, between the tendons of extensor hallucis longus and extensor digitorum longus, is 解溪 ST41. Three landmarks enclosing the joint, three points at its front, inside and outside.',
          },
          {
            zhHant:
              '★ 足背的三條線，各朝一組腳趾：胃經朝第 2、3 趾——解溪 ST41 → 沖陽 ST42 → 陷谷 ST43 → 內庭 ST44 → 厲兌 ST45；膽經朝第 4、5 趾——丘墟 GB40 → 足臨泣 GB41 → 足竅陰 GB44；肝經走第 1、2 蹠骨之間——太衝 LR3 → 行間 LR2 → 大敦 LR1。腳趾的方向就是分經的方向。',
            en: 'Three lines across the dorsum, each aimed at a group of toes. The Stomach runs toward the second and third: 解溪 ST41 → 沖陽 ST42 → 陷谷 ST43 → 內庭 ST44 → 厲兌 ST45. The Gallbladder toward the fourth and fifth: 丘墟 GB40 → 足臨泣 GB41 → 足竅陰 GB44. The Liver between the first and second metatarsals: 太衝 LR3 → 行間 LR2 → 大敦 LR1. Which toes a line points at is what tells the channels apart.',
          },
          {
            zhHant:
              '骨度：這一區沒有自己的量尺。內踝尖上 3 寸的三陰交、脛骨內側髁下方到內踝尖的 13 寸、膝中到外踝尖的 16 寸，都是小腿的尺（Day 20），不是踝足的。腳上的穴靠的是甲角、蹼緣、蹠骨間隙與踝的三個標志——形狀，不是長度。',
            en: 'The rulers: this region has none of its own. 三陰交 three cun above the medial malleolus, the 13 cun from below the medial tibial condyle to that malleolus, the 16 from the middle of the knee to the lateral one — all of those are lower-leg measures (Day 20), not foot ones. Points on the foot are fixed by nail corners, web margins, the spaces between metatarsals and the ankle’s three landmarks: by shape, not by length.',
          },
        ],
      },
      {
        id: 'sec_25_do',
        kind: 'do',
        titleZhHant: '【做】在自己腳上找',
        titleEn: 'Do — find them on your own foot',
        sourceIds: [WORKSHEET25],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「踝部及足部」。開啟時是全區；用 ＋ 放大，拖曳平移，「全區」回到整體。33 個穴擠在一隻腳上，和手部一樣密——放大著看比縮小著看有用。',
            en: 'Open the Regions tab and choose Ankle & foot. It opens on the whole region; ＋ magnifies, dragging pans, Fit returns. Thirty-three points on one foot makes it as dense as the hand — it rewards magnifying rather than taking in at once.',
          },
          {
            zhHant:
              '一、先立踝的三個標志：摸到內踝尖、外踝尖，再往後摸到跟腱那條粗索。跟腱與內踝之間的凹陷是太溪；跟腱與外踝之間的凹陷是崑崙。兩個穴隔著同一條肌腱，一內一外——這是全區最好認的一對。',
            en: 'One — set the ankle’s three landmarks. Find the tip of the medial malleolus and of the lateral, then feel backward for the thick cord of the Achilles tendon. The hollow between it and the medial malleolus is 太溪; between it and the lateral is 崑崙. Two points either side of one tendon — the easiest pair in the region.',
          },
          {
            zhHant:
              '二、走一趟足背：勾起腳掌，踝前會浮出兩條肌腱，它們之間、橫紋中央是解溪。往前摸到足背最高處、動脈搏動的地方是沖陽。再往前，第 2、3 蹠骨之間到趾蹼緣後方是陷谷與內庭。這一條線一路指向第 2 趾，末端就是厲兌。',
            en: 'Two — walk the dorsum. Dorsiflex the foot and two tendons stand out in front of the ankle; between them, at the centre of the crease, is 解溪. Forward to the highest part of the dorsum, where a pulse can be felt, is 沖陽. Further forward, between the second and third metatarsals and back from the web margin, are 陷谷 and 內庭. That line points all the way at the second toe, and ends at 厲兌.',
          },
          {
            zhHant:
              '三、換一條線：回到踝前，往外側摸到外踝的前下方是丘墟；沿第 4、5 蹠骨往前是足臨泣，一路指向第 4 趾，末端是足竅陰。再換一條：從第 1、2 蹠骨之間往後推到骨頭交會處是太衝，往前到趾蹼緣後方是行間，末端大敦在大趾的外側甲角。',
            en: 'Three — change lines. Back at the front of the ankle, move laterally to below and in front of the lateral malleolus for 丘墟; forward along the fourth and fifth metatarsals for 足臨泣, a line aimed at the fourth toe and ending at 足竅陰. Change again: push back between the first and second metatarsals to where the bones meet for 太衝, forward to behind the web margin for 行間, and the line ends at 大敦 on the lateral corner of the great toe’s nail.',
          },
          {
            zhHant:
              '四、翻過來看足底：用力屈趾，足底前段會出現一個凹陷，那就是湧泉——第 2、3 趾蹼緣與足跟連線的前三分之一處。它是六個井穴裡唯一不在甲角上的，也是腎經的起點。',
            en: 'Four — turn the foot over. Curl the toes hard and a hollow appears in the front part of the sole: that is 湧泉, a third of the way along the line from the web between the second and third toes to the heel. It is the only one of the six jing-well points not at a nail corner, and the first station of the Kidney channel.',
          },
        ],
      },
      {
        id: 'sec_25_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET25],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '足部兩組六口訣（七言）：「六井五在甲角旁，隱白大敦厲兌詳；竅陰至陰依趾數，唯有湧泉在足底。六原散在踝背間，沖陽太白京骨連；太溪丘墟太衝在，一經一穴不重疊。」',
            en: 'The foot’s two sets of six, seven characters to a clause: 「六井五在甲角旁，隱白大敦厲兌詳；竅陰至陰依趾數，唯有湧泉在足底。六原散在踝背間，沖陽太白京骨連；太溪丘墟太衝在，一經一穴不重疊。」',
          },
          {
            zhHant:
              '大趾上有兩個井穴，是最容易記漏的：內側甲角是脾經的隱白，外側甲角是肝經的大敦。一根腳趾、兩條經、兩個井穴——和手上小指的少衝與少澤是同一種安排。',
            en: 'The great toe carries TWO jing-well points, and that is the pair most often missed: 隱白 of the Spleen at its medial nail corner, 大敦 of the Liver at its lateral. One toe, two channels, two jing-well points — the same arrangement as 少衝 and 少澤 on the little finger.',
          },
          {
            zhHant:
              '形象聯想：跟腱像一條繩索，太溪與崑崙分掛兩側；解溪在踝前兩筋之間的溪口；沖陽在足背最高、能摸到脈的地方；湧泉在足底，屈趾時像一口泉眼陷下去。',
            en: 'Images: the Achilles tendon as a rope with 太溪 and 崑崙 hung either side; 解溪 the stream-mouth between two tendons at the front of the ankle; 沖陽 at the crest of the dorsum where a pulse can be felt; and 湧泉 on the sole, sinking like a spring when the toes curl.',
          },
        ],
      },
      {
        id: 'sec_25_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET25],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、六個井穴：分別是哪六個？哪一個不在趾甲角旁？（隱白 SP1、大敦 LR1、厲兌 ST45、足竅陰 GB44、至陰 BL67 在甲角；湧泉 KI1 在足底。）',
            en: 'One — the six jing-well points, and which is not at a nail corner. (隱白 SP1, 大敦 LR1, 厲兌 ST45, 足竅陰 GB44 and 至陰 BL67 at nail corners; 湧泉 KI1 on the sole.)',
          },
          {
            zhHant:
              '二、六個原穴：六條腿經各是哪一個？（胃沖陽 ST42、脾太白 SP3、膀胱京骨 BL64、腎太溪 KI3、膽丘墟 GB40、肝太衝 LR3。）',
            en: 'Two — the six yuan-source points, one per leg channel. (Stomach 沖陽 ST42, Spleen 太白 SP3, Bladder 京骨 BL64, Kidney 太溪 KI3, Gallbladder 丘墟 GB40, Liver 太衝 LR3.)',
          },
          {
            zhHant:
              '三、跟腱兩側：內側與外側各是哪一個穴、屬哪一條經？（內側太溪 KI3，腎經原穴；外側崑崙 BL60，膀胱經經穴。）',
            en: 'Three — either side of the Achilles tendon. (Medially 太溪 KI3, the Kidney’s yuan-source; laterally 崑崙 BL60, the Bladder’s jing-river.)',
          },
          {
            zhHant:
              '四、大趾上的兩個井穴：分別是哪兩個、在哪一側？（內側甲角隱白 SP1，脾經；外側甲角大敦 LR1，肝經。）',
            en: 'Four — the two jing-well points on the great toe, and on which side is each? (隱白 SP1 of the Spleen at the medial nail corner; 大敦 LR1 of the Liver at the lateral.)',
          },
          {
            zhHant:
              '五、哪一把尺不屬於這一區？（內踝尖上 3 寸的三陰交、13 寸、16 寸都是小腿的尺，屬 Day 20。腳上的穴靠甲角、蹼緣、蹠骨間隙與踝的三個標志定位，不靠長度。）',
            en: 'Five — which rulers do NOT belong to this region? (三陰交 three cun above the medial malleolus, the 13-cun and 16-cun segments — all lower-leg measures from Day 20. Points on the foot are fixed by nail corners, web margins, the spaces between metatarsals and the ankle’s landmarks, not by length.)',
          },
        ],
      },
      {
        id: 'sec_25_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET25],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是踝和足，下肢的末端。我身上有兩組六。第一組是井穴：隱白在大趾內側甲角、大敦在大趾外側甲角、厲兌在第二趾、足竅陰在第四趾、至陰在小趾——五個都在甲角旁，只有湧泉不是，它在足底屈趾時陷下去的地方。第二組是原穴，六條腿經一經一個：沖陽、太白、京骨、太溪、丘墟、太衝。我的踝有三個標志：內踝尖、外踝尖、跟腱；跟腱內側是太溪，外側是崑崙，踝前兩筋之間是解溪。我的足背有三條線，各朝一組腳趾。我沒有自己的尺——十三寸、十六寸都是小腿的。我不談走路，我只找甲角、蹼緣和骨頭之間的縫。」',
            en: 'Record one minute: “I am the ankle and foot, the far end of the leg. I carry two sets of six. First the jing-well points: 隱白 at the medial nail corner of the great toe, 大敦 at its lateral, 厲兌 on the second toe, 足竅陰 on the fourth, 至陰 on the little one — five at nail corners, and only 湧泉 elsewhere, in the hollow that sinks into my sole when the toes curl. Second the yuan-source points, one for each of the six leg channels: 沖陽, 太白, 京骨, 太溪, 丘墟, 太衝. My ankle has three landmarks — the two malleoli and the Achilles tendon — with 太溪 inside that tendon, 崑崙 outside, and 解溪 between the two tendons in front. Three lines cross my dorsum, each aimed at a group of toes. I have no ruler of my own; thirteen cun and sixteen belong to the lower leg. I do not discuss walking. I look for nail corners, web margins and the gaps between bones.”',
          },
        ],
      },
      {
        id: 'sec_25_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習',
        titleEn: 'Spaced review — 1-3-7',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D24（髖與大腿）：四個面、三把尺——外側 19 寸、後側 14 寸、內側 18 寸。回鍋 D20（膝與小腿）：六腑的下合穴全在那一區；三陰交也在那裡，內踝尖上 3 寸。回鍋 D15（肘與前臂）：六個合穴在肘、六個郄穴在前臂。回鍋 D14（腕與手）：手指尖的六個井穴——今天腳趾尖的六個正好與它成對；小指的少衝與少澤，對應大趾的隱白與大敦。',
            en: 'Day 24 back (hip and thigh): four faces and three rulers — 19 cun outside, 14 behind, 18 inside. Day 20 back (knee and lower leg): all six lower he-sea points are there, and so is 三陰交, three cun above the medial malleolus. Day 15 back (elbow and forearm): six he-sea at the elbow, six xi-cleft in the forearm. Day 14 back (wrist and hand): the six jing-well points at the fingertips — today’s six at the toes are their counterpart, and 少衝 with 少澤 on the little finger answer to 隱白 with 大敦 on the great toe.',
          },
        ],
      },
    ],
  },
  /*
   * Day 26 — the back, the largest region, and the last of the thirteen.
   *
   * Five corrections against the records:
   *
   *  1. Three cited points belong elsewhere: 環跳 GB30 and 承扶 BL36 to hip &
   *     thigh (Day 24), 風府 GV16 to the head (Day 21). Two of the three were
   *     ★ core points here.
   *  2. Removing 環跳 removes the Gallbladder: this region carries no GB point
   *     at all. Its three channels are 膀胱 BL, 督脈 GV and 小腸 SI — and the
   *     draft omitted the Small Intestine, though 肩外俞 SI14 and 肩中俞 SI15
   *     are here.
   *  3. All TWELVE 背俞穴 are in this region and in no other, and the draft
   *     named four of them without ever presenting the set. It is the thing
   *     the region is for, and it closes the mu-shu loop opened on Day 18.
   *  4. 八髎 was given as 「共 8 穴」. This dataset stores a bilateral point
   *     once — 362 records, not 670 — so the four sacral pairs are four
   *     records: 上髎 BL31 to 下髎 BL34.
   *  5. Five of seven review pairs were misattributed: 風池/風府 to Day 23 (the
   *     neck; both are head points), 肺俞/心俞 and 至陽/身柱 to Days 22 and 20
   *     though both pairs are today's, 京門/腎俞 to Day 21, and 環跳/居髎 to
   *     Day 19 though both are Day 24's.
   *
   * Three app features named that do not exist — 棘突高亮, 骶後孔高亮 and a
   * 骨性標志連線 — with a dev note asserting they are implemented.
   *
   * The five mu-shu pairings the draft asserts were each checked against the
   * classifications and are correct; they are kept.
   */
  {
    id: 'day_26',
    dayNumber: 26,
    titleZhHant: '背部及臀部 — 十二背俞穴，與前後相合的收尾',
    titleEn: 'Back & gluteal — the twelve back-shu points, and the loop closing',
    hookZhHant: '全身十二個背俞穴，全在這一區，別處一個也沒有。第 18 天在腹前認過募穴，今天在背後找到它們的另一半——十三區到此走完。',
    hookEn: 'All twelve back-shu points are in this one region and nowhere else. Day 18 met the front-mu points on the abdomen; today their other halves are found on the back — and the thirteen regions are complete.',
    meridianIds: ['mer_si', 'mer_bl', 'mer_gv'],
    sourceIds: [WORKSHEET26, OUTLINE],
    reviewStatus: 'unreviewed',
    noticeZhHant:
      '本單元只教「在自己背上找到位置」與「說出歸經與分類」。在自己身上按壓是為了確認體表標志，不是任何形式的處置；本 App 不提供適應症、配穴或手法。',
    noticeEn:
      'This unit teaches two things only: finding a location on your own back, and naming its channel and category. Pressing on yourself here is a way of confirming a surface landmark — it is not a treatment of any kind, and this app gives no indications, point combinations or technique.',
    sections: [
      {
        id: 'sec_26_learn',
        kind: 'learn',
        titleZhHant: '【學】三條縱線，十二個俞穴',
        titleEn: 'Learn — three vertical lines, twelve back-shu points',
        sourceIds: [WORKSHEET26],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '這一區收錄 54 個穴，是十三區裡最大的一個，卻只走三條經：膀胱 BL 39 個、督脈 GV 13 個、小腸 SI 2 個。沒有膽經——環跳在髖部（Day 24），也沒有胃經。背部的定位只需要兩件事：數棘突，和量旁開幾寸。',
            en: 'Fifty-four points, the largest of the thirteen regions — and only three channels: thirty-nine Bladder, thirteen Governing vessel, two Small Intestine. No Gallbladder (環跳 is at the hip, Day 24) and no Stomach. Locating anything here takes two things only: counting spinous processes, and measuring how far out.',
          },
          {
            zhHant:
              '★ 三條縱線：督脈走後正中線（0 寸）；膀胱經第一側線旁開 1.5 寸；第二側線旁開 3 寸。兩個例外都在最上面——肩中俞 SI15 在第 7 頸椎棘突下旁開 2 寸，肩外俞 SI14 在第 1 胸椎棘突下旁開 3 寸，是小腸經借道背部的兩站。',
            en: 'Three vertical lines: the Governing vessel down the posterior midline at 0, the Bladder’s first line 1.5 cun out, and its second line 3 cun out. The two exceptions are both at the top — 肩中俞 SI15 sits 2 cun lateral below the 7th cervical spinous process, and 肩外俞 SI14 3 cun lateral below the 1st thoracic: the Small Intestine’s two stations across the back.',
          },
          {
            zhHant:
              '★ 十二個背俞穴，全在第一側線上，全在這一區：肺俞 BL13（T3）、厥陰俞 BL14（T4）、心俞 BL15（T5）、肝俞 BL18（T9）、膽俞 BL19（T10）、脾俞 BL20（T11）、胃俞 BL21（T12）、三焦俞 BL22（L1）、腎俞 BL23（L2）、大腸俞 BL25（L4）、小腸俞 BL27（S1）、膀胱俞 BL28（S2）。全部旁開 1.5 寸，只差在第幾個棘突。',
            en: 'The twelve back-shu points, all on that first line and all in this region: 肺俞 BL13 at T3, 厥陰俞 BL14 at T4, 心俞 BL15 at T5, 肝俞 BL18 at T9, 膽俞 BL19 at T10, 脾俞 BL20 at T11, 胃俞 BL21 at T12, 三焦俞 BL22 at L1, 腎俞 BL23 at L2, 大腸俞 BL25 at L4, 小腸俞 BL27 at S1 and 膀胱俞 BL28 at S2. Every one 1.5 cun out; only the vertebra changes.',
          },
          {
            zhHant:
              '★ 前後相合：每一個背俞穴在身體前面都有一個募穴與它相配。第 18 天在腹前認過七個募穴，第 19 天認過章門與京門——今天把它們接起來：肺俞 BL13 ↔ 中府 LU1（胸部）、心俞 BL15 ↔ 巨闕 CV14（腹部）、肝俞 BL18 ↔ 期門 LR14（胸部）、脾俞 BL20 ↔ 章門 LR13（身側）、腎俞 BL23 ↔ 京門 GB25（身側）。俞在後、募在前，是同一個臟的兩個記號。',
            en: 'Front meets back. Each back-shu point has a front-mu partner on the other side of the body. Day 18 met seven front-mu points on the abdomen and Day 19 met 章門 and 京門 — today joins them up: 肺俞 BL13 ↔ 中府 LU1 on the chest, 心俞 BL15 ↔ 巨闕 CV14 on the abdomen, 肝俞 BL18 ↔ 期門 LR14 on the chest, 脾俞 BL20 ↔ 章門 LR13 on the flank, 腎俞 BL23 ↔ 京門 GB25 on the flank. Shu behind, mu in front — two marks for one organ.',
          },
          {
            zhHant:
              '★ 棘突當尺，四個好摸的高度：T3 約當兩肩胛岡最高點的連線，其下是身柱 GV12；T7 約平兩肩胛骨下角連線的中點，其下是至陽 GV9；L2 約與肚臍正對後背，其下是命門 GV4，旁開 1.5 寸就是腎俞；L4 約平兩側髂嵴最高點的連線，其下是腰陽關 GV3。起點靠低頭時頸後最突出的骨節 C7 數起，其下第一節是 T1，本區督脈最上面的穴陶道 GV13 就在那裡。記住這四個高度，其餘都是往上或往下數。',
            en: 'Four easily found heights, counted by spinous process. T3 lies about at the line between the highest points of the two scapular spines, and below it 身柱 GV12. T7 is about level with the midpoint of the line between the inferior angles of the scapulae, and below it 至陽 GV9. L2 is about opposite the navel, and below it 命門 GV4 — with 腎俞 1.5 cun out. L4 is about level with the line between the highest points of the iliac crests, and below it 腰陽關 GV3. The count starts from C7, the most prominent bone at the base of the neck when the head bows; the next one down is T1, where 陶道 GV13, this region’s topmost midline point, sits. Hold those four and everything else is counted up or down from them.',
          },
          {
            zhHant:
              '★ 骶部：八髎在四對骶後孔中——上髎 BL31 對第 1 骶後孔、次髎 BL32 對第 2、中髎 BL33 對第 3、下髎 BL34 對第 4。本資料集的雙側穴各收一筆記錄，所以八髎在這裡是四筆（左右各一對）。另外，八會穴中有兩個在這一區：大杼 BL11 是骨會，膈俞 BL17 是血會。',
            en: 'The sacrum. The 八髎 sit in the four pairs of posterior sacral foramina — 上髎 BL31 at the first, 次髎 BL32 at the second, 中髎 BL33 at the third, 下髎 BL34 at the fourth. This dataset stores each bilateral point once, so 八髎 is four records here, each standing for a left-and-right pair. Two of the eight influential points are also in this region: 大杼 BL11 for the bones and 膈俞 BL17 for the blood.',
          },
          {
            zhHant:
              '這一區的上下界：往上，大椎 GV14 在第 7 頸椎棘突下，與風府 GV16 一樣屬於頭部（Day 21）——背部這一區的督脈從第 1 胸椎下的陶道 GV13 起算。往下，承扶 BL36 在臀下橫紋，與環跳 GB30 一樣屬於髖胯及大腿（Day 24）。本區的督脈止於尾骨下方的長強 GV1，骶管裂孔上的腰俞 GV2 就在它上面一個。',
            en: 'Where the region stops. Upward, 大椎 GV14 below the 7th cervical spinous process belongs to the head along with 風府 GV16 (Day 21) — this region’s Governing vessel begins at 陶道 GV13 below T1. Downward, 承扶 BL36 at the gluteal crease belongs to hip and thigh along with 環跳 GB30 (Day 24). Here the Governing vessel ends at 長強 GV1 below the coccyx, with 腰俞 GV2 one above it at the sacral hiatus.',
          },
        ],
      },
      {
        id: 'sec_26_do',
        kind: 'do',
        titleZhHant: '【做】在自己背上找',
        titleEn: 'Do — find them on your own back',
        sourceIds: [WORKSHEET26],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '打開「分區」分頁，選「背部及臀部」。這一區的穴全在背面——開啟時已是背面視圖。54 個穴是全身最多的一區，全區檢視時標記很密，用 ＋ 放大想細看的一段，「全區」回到整體。',
            en: 'Open the Regions tab and choose Back & gluteal. Every point here is on the back, so it opens on that view. Fifty-four is the most of any region and the markers are dense at full view — use ＋ to magnify the stretch you want and Fit to come back.',
          },
          {
            zhHant:
              '一、先立高度：低頭，摸到頸後最突出的骨節，那是 C7；其下第一節是 T1，凹陷裡是陶道 GV13。手往下走，兩肩胛岡最高點的連線水平是 T3，凹陷裡是身柱；兩肩胛骨下角連線的中點水平是 T7，凹陷裡是至陽。再往下，與肚臍正對的後背水平是 L2，凹陷裡是命門；兩手叉腰，兩側髂嵴最高點連線的水平是 L4，凹陷裡是腰陽關。每一個高度都靠別的骨頭確認，不必一節一節數。',
            en: 'One — establish the heights. Bow the head and feel the most prominent bone at the base of the neck: that is C7, and the next one down is T1, with 陶道 GV13 in the hollow. Move down to the level of the line between the highest points of the scapular spines for T3, with 身柱 in the hollow; the level of the midpoint between the inferior angles of the scapulae is T7, with 至陽. Lower, the level opposite the navel is L2, with 命門; hands on the hips, the level of the line between the highest points of the iliac crests is L4, with 腰陽關. Every height is confirmed by another bone — no need to count each vertebra.',
          },
          {
            zhHant:
              '二、走三條線：把手放在任一個棘突下的凹陷（督脈），往外走約一寸半是第一側線，再往外到約三寸是第二側線。在 L2 這個高度走一次：正中是命門，1.5 寸是腎俞，3 寸是志室。同一個高度、三個穴、三條線——整個背部都是這個結構。',
            en: 'Two — walk the three lines. Put a finger in the hollow below any spinous process (the Governing vessel), move out about one and a half cun for the first Bladder line, and out to about three for the second. Do it once at L2: 命門 in the middle, 腎俞 at 1.5, 志室 at 3. One height, three points, three lines — and the whole back is built that way.',
          },
          {
            zhHant:
              '三、認俞穴：在 App 中切到背面，沿第一側線由上往下點選，清單會顯示每個俞穴的椎骨。試著只憑「第幾椎」說出穴名：T3 肺俞、T5 心俞、T9 肝俞、T11 脾俞、L2 腎俞。十二個俞穴只差棘突，旁開都是 1.5 寸。',
            en: 'Three — learn the shu points. On the back view, tap down the first Bladder line and the list gives each one’s vertebra. Try naming them from the vertebra alone: T3 肺俞, T5 心俞, T9 肝俞, T11 脾俞, L2 腎俞. Twelve points differing only in which spinous process they sit below; the 1.5 cun never changes.',
          },
          {
            zhHant:
              '四、骶部與收尾：往下摸到骶骨，四對骶後孔由上而下是上髎、次髎、中髎、下髎。再往下，骶管裂孔上是腰俞 GV2，尾骨下方是長強 GV1，本區到此為止——臀橫紋上的承扶已經是另一區的事。最後把前後接起來：摸一次腎俞（L2 旁開 1.5 寸），再繞到身側摸京門（第 12 肋端下方），這一對俞與募就是全身前後相合的一個例子。',
            en: 'Four — the sacrum, and the close. Move down to the sacrum: the four pairs of posterior foramina carry 上髎, 次髎, 中髎 and 下髎 from the top. Below them 腰俞 GV2 sits at the sacral hiatus and 長強 GV1 beneath the coccyx, where this region ends — 承扶 at the gluteal crease already belongs to another. Finally, join front to back: find 腎俞 at L2, 1.5 cun out, then reach round to the flank for 京門 below the free end of the 12th rib. That shu and that mu are one instance of the whole body’s front-and-back pairing.',
          },
        ],
      },
      {
        id: 'sec_26_say',
        kind: 'say',
        titleZhHant: '【說】口訣與聯想',
        titleEn: 'Say — the mnemonic',
        sourceIds: [WORKSHEET26],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '背部三線口訣（七言）：「督脈居中棘突下，一線寸半二線三；陶道一胸身柱三，至陽七胸平肩尖。命門二腰腎俞旁，腰陽關在四腰間；八髎四對骶孔內，背俞十二一線牽。」',
            en: 'The back’s three lines, seven characters to a clause: 「督脈居中棘突下，一線寸半二線三；陶道一胸身柱三，至陽七胸平肩尖。命門二腰腎俞旁，腰陽關在四腰間；八髎四對骶孔內，背俞十二一線牽。」',
          },
          {
            zhHant:
              '十二個背俞穴只需要記椎數，旁開一律 1.5 寸：肺三、厥陰四、心五、肝九、膽十、脾十一、胃十二，接著三焦腰一、腎腰二、大腸腰四、小腸骶一、膀胱骶二。從 T3 到 S2，一條線走完五臟六腑。',
            en: 'The twelve back-shu points need only their vertebra; the 1.5 cun never varies. Lung 3, Jueyin 4, Heart 5, Liver 9, Gallbladder 10, Spleen 11, Stomach 12 — then Triple Energiser at L1, Kidney L2, Large Intestine L4, Small Intestine S1, Bladder S2. One line from T3 to S2 covers every organ.',
          },
          {
            zhHant:
              '形象聯想：脊柱像一列階梯，督脈踩在每一階的凹陷上；膀胱經是兩條與它平行的軌道，一條近、一條遠；骶骨上的四對孔像四對窗；陶道在最上、長強在最下，中間每一個高度都能靠別的骨頭找到。',
            en: 'Images: the spine as a flight of steps with the Governing vessel in the hollow of each; the Bladder as two rails running parallel to it, one near and one far; the four pairs of sacral foramina as four pairs of windows; 陶道 at the top and 長強 at the bottom, with every height between them findable from some other bone.',
          },
        ],
      },
      {
        id: 'sec_26_test',
        kind: 'test',
        titleZhHant: '【考】今日小考',
        titleEn: 'Test — today’s check',
        sourceIds: [WORKSHEET26],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '一、三條線：後正中線、第一側線、第二側線各旁開幾寸？各屬哪一條經？（督脈 0 寸；膀胱經第一側線 1.5 寸、第二側線 3 寸。小腸經的肩中俞 SI15 在 2 寸，是唯一的例外。）',
            en: 'One — the three lines. How far out is each, and which channel? (Governing vessel 0; the Bladder’s first line 1.5 cun and its second 3. 肩中俞 SI15 of the Small Intestine, at 2 cun, is the lone exception.)',
          },
          {
            zhHant:
              '二、四個高度：T3、T7、L2、L4 各約平什麼骨性標志？其下各是哪一個督脈穴？（T3 約當兩肩胛岡最高點連線——身柱；T7 約平兩肩胛下角連線中點——至陽；L2 約與肚臍正對——命門；L4 約平兩髂嵴最高點連線——腰陽關。起點 C7 是最突出的那一節，其下 T1 是陶道。）',
            en: 'Two — the four heights. What is each about level with, and which Governing-vessel point sits below it? (T3 the line between the highest points of the scapular spines — 身柱; T7 the midpoint between the inferior angles of the scapulae — 至陽; L2 opposite the navel — 命門; L4 the line between the iliac crests — 腰陽關. The count starts at C7, the most prominent one, with 陶道 below T1.)',
          },
          {
            zhHant:
              '三、背俞穴的椎數：肺俞、心俞、肝俞、脾俞、腎俞各在第幾椎下？（T3、T5、T9、T11、L2，全部旁開 1.5 寸。）',
            en: 'Three — the vertebrae. Below which spinous process does each of 肺俞, 心俞, 肝俞, 脾俞 and 腎俞 sit? (T3, T5, T9, T11 and L2 — all of them 1.5 cun out.)',
          },
          {
            zhHant:
              '四、前後相合：腎俞 BL23 在前面配哪一個募穴？肺俞 BL13 呢？脾俞 BL20 呢？（腎俞↔京門 GB25，在身側；肺俞↔中府 LU1，在胸部；脾俞↔章門 LR13，在身側。）',
            en: 'Four — front and back. Which front-mu point pairs with 腎俞 BL23? With 肺俞 BL13? With 脾俞 BL20? (腎俞 with 京門 GB25 on the flank; 肺俞 with 中府 LU1 on the chest; 脾俞 with 章門 LR13 on the flank.)',
          },
          {
            zhHant:
              '五、界線：大椎、風府、承扶、環跳四個穴，哪一個屬於本區？（一個也不屬於。大椎與風府在頭部（Day 21），承扶與環跳在髖胯及大腿（Day 24）。本區的督脈從陶道 GV13 到長強 GV1。）',
            en: 'Five — the boundaries. Which of 大椎, 風府, 承扶 and 環跳 belongs to this region? (None of them. 大椎 and 風府 are in the head, Day 21; 承扶 and 環跳 are in hip and thigh, Day 24. This region’s Governing vessel runs from 陶道 GV13 to 長強 GV1.)',
          },
        ],
      },
      {
        id: 'sec_26_feynman',
        kind: 'feynman',
        titleZhHant: '【費曼】一分鐘',
        titleEn: 'Feynman — one minute',
        sourceIds: [WORKSHEET26],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '錄一分鐘：「我是背部和臀部，全身最大的一區，五十四個穴，卻只走三條經：膀胱、督脈，加上小腸的兩站。我的結構只有兩件事——數棘突，量旁開。督脈走正中，膀胱經兩條側線各在一寸半和三寸。我最重要的東西是十二個背俞穴，全在第一側線上，全在我身上，別處一個也沒有：肺三、心五、肝九、脾十一、腎腰二……從 T3 一路到 S2。它們每一個在身體前面都有一個募穴相配——腎俞配京門，肺俞配中府，脾俞配章門。第十八天在腹前認過的那些穴，今天在我背後找到了另一半。我的下面是骶骨，四對孔裡是八髎；再往下，骶管裂孔上是腰俞、尾骨下方是長強，我就結束了。上面那個大椎不是我的，它在頭部。十三個區到這裡走完。」',
            en: 'Record one minute: “I am the back and buttocks, the largest region of all — fifty-four points, yet only three channels: the Bladder, the Governing vessel, and two stations of the Small Intestine. My structure needs two things only: count the spinous processes, measure how far out. The Governing vessel runs my midline; the Bladder runs two lines beside it, at one and a half cun and at three. What matters most on me are the twelve back-shu points, all on that first line, all here and nowhere else: Lung at three, Heart at five, Liver at nine, Spleen at eleven, Kidney at the second lumbar — from T3 all the way to S2. Every one has a front-mu partner on the other side of the body: 腎俞 with 京門, 肺俞 with 中府, 脾俞 with 章門. The points met on the abdomen on Day 18 find their other halves on me. Below me is the sacrum, with 八髎 in its four pairs of foramina; below that, 腰俞 at the sacral hiatus and 長強 beneath the coccyx, and I end. 大椎 above me is not mine — it belongs to the head. The thirteen regions end with me.”',
          },
        ],
      },
      {
        id: 'sec_26_review',
        kind: 'do',
        titleZhHant: '【回鍋】1-3-7 複習，與全區收尾',
        titleEn: 'Spaced review — 1-3-7, and closing the set',
        sourceIds: [OUTLINE],
        reviewStatus: 'unreviewed',
        body: [
          {
            zhHant:
              '回鍋 D25（踝與足）：兩組六——六個井穴、六個原穴。回鍋 D24（髖與大腿）：四個面、三把尺，承扶與環跳都在那一區。回鍋 D19（身側）：章門與京門掛在第 11、12 肋端，兩個募穴各配今天的一個俞穴。回鍋 D18（腹部）：七個募穴在腹前——今天把它們與背後的俞穴接上。',
            en: 'Day 25 back (ankle and foot): two sets of six — six jing-well points and six yuan-source. Day 24 back (hip and thigh): four faces and three rulers, and both 承扶 and 環跳 live there. Day 19 back (the flank): 章門 and 京門 hang from the 11th and 12th rib ends, and each pairs with one of today’s shu points. Day 18 back (the abdomen): seven front-mu points on the front — today joins them to the shu points behind.',
          },
          {
            zhHant:
              '十三個區到此走完：手（D14）、肘與前臂（D15）、肩與上臂（D16）、胸（D17）、腹（D18）、身側（D19）、膝與小腿（D20）、頭（D21）、面（D22）、頸（D23）、髖與大腿（D24）、踝與足（D25）、背與臀（D26）。每一區都有自己的尺：有的數肋間隙，有的離臍幾寸，有的靠一條肌肉的兩條邊，有的只靠骨頭的形狀。認得出用哪一把尺，就認得出穴在哪裡。',
            en: 'That completes the thirteen: hand (D14), elbow and forearm (D15), shoulder and upper arm (D16), chest (D17), abdomen (D18), flank (D19), knee and lower leg (D20), head (D21), face (D22), neck (D23), hip and thigh (D24), ankle and foot (D25), back and buttocks (D26). Each region has its own ruler — some count rib spaces, some measure from the navel, some use the two edges of a single muscle, some use nothing but the shape of bone. Knowing which ruler applies is most of knowing where a point is.',
          },
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */

const fc = (
  id: string,
  mode: Flashcard['mode'],
  frontZhHant: string,
  frontEn: string,
  backZhHant: string,
  backEn: string,
  points: string[],
  meridians: string[],
  sourceIds: string[] = [HANDBOOK],
  dayId = 'day_1',
): Flashcard => ({
  id,
  dayId,
  mode,
  frontZhHant,
  frontEn,
  backZhHant,
  backEn,
  relatedAcupointIds: points,
  relatedMeridianIds: meridians,
  sourceIds,
  reviewStatus: 'unreviewed',
});

export const flashcards: Flashcard[] = [
  fc(
    'fc_hegu_attrs',
    'point_to_attributes',
    '合谷',
    '合谷 (LI4)',
    '歸經：手陽明大腸經（LI4）｜定位：手背第一、二掌骨之間，虎口肌肉縫隙凹陷處｜特定穴：原穴',
    'Meridian: Large Intestine (LI4) · Location: back of the hand, in the hollow of the web between the 1st and 2nd metacarpals · Category: yuan-source point',
    ['pt_li4'],
    ['mer_li'],
    [HANDBOOK, OUTLINE],
  ),
  fc(
    'fc_lieque_attrs',
    'point_to_attributes',
    '列缺',
    '列缺 (LU7)',
    '歸經：手太陰肺經（LU7）｜定位：兩手虎口交叉，上方食指指尖到達的凹陷｜特定穴：絡穴',
    'Meridian: Lung (LU7) · Location: cross the hands at the thumb webs; the hollow under the tip of the upper index finger · Category: luo-connecting point',
    ['pt_lu7'],
    ['mer_lu'],
    [HANDBOOK, OUTLINE],
  ),
  fc(
    'fc_taiyuan_attrs',
    'classification',
    '太淵的特定穴屬性是什麼？',
    'Which specific-point categories does 太淵 (LU9) carry?',
    '肺經原穴 ＋ 輸穴 ＋ 八會穴之脈會。',
    'Yuan-source point and shu-stream point of the Lung meridian, and the influential point of the vessels.',
    ['pt_lu9'],
    ['mer_lu'],
  ),
  fc(
    'fc_quchi_attrs',
    'classification',
    '曲池在五輸穴中屬於？',
    'In the five-shu system, 曲池 (LI11) is which type of point?',
    '大腸經的合穴。',
    'The he-sea point of the Large Intestine meridian.',
    ['pt_li11'],
    ['mer_li'],
  ),
  fc(
    'fc_face_topic',
    'topic_to_point',
    '四總穴歌中，「面口」對應哪一個穴？',
    'In the Four Command Points song, which point is bound to the face-and-mouth region?',
    '合谷（面口合谷收）— 這是記憶口訣的配對，不是治療建議。',
    '合谷 (LI4). This is a mnemonic pairing of region to point, not treatment guidance.',
    ['pt_li4'],
    ['mer_li'],
    [HANDBOOK, OUTLINE],
  ),
  fc(
    'fc_neck_topic',
    'topic_to_point',
    '四總穴歌中，「頭項」對應哪一個穴？',
    'In the Four Command Points song, which point is bound to the head-and-neck region?',
    '列缺（頭項尋列缺）— 記憶口訣的配對，不是治療建議。',
    '列缺 (LU7). A mnemonic pairing, not treatment guidance.',
    ['pt_lu7'],
    ['mer_lu'],
    [HANDBOOK, OUTLINE],
  ),
  fc(
    'fc_lu_route',
    'route_recall',
    '手太陰肺經走在手臂的哪一條線？起點與終點在哪？',
    'Which border of the arm does the Lung meridian follow, and where does it start and end?',
    '手臂內側前緣。起於胸部（中府），止於拇指橈側（少商），共 11 穴。',
    'The anterior-medial border. It starts on the chest (中府 LU1) and ends at the radial side of the thumb (少商 LU11) — 11 points.',
    ['pt_lu1', 'pt_lu11'],
    ['mer_lu'],
    [HANDBOOK, OUTLINE],
  ),
  fc(
    'fc_li_route',
    'route_recall',
    '手陽明大腸經走在手臂的哪一條線？起點與終點在哪？',
    'Which border of the arm does the Large Intestine meridian follow, and where does it start and end?',
    '手臂外側前緣。起於食指橈側（商陽），經肩頸上行，止於鼻翼旁（迎香），共 20 穴。',
    'The anterior-lateral border. It starts at the radial tip of the index finger (商陽 LI1), crosses the shoulder and neck, and ends beside the nose (迎香 LI20) — 20 points.',
    ['pt_li1', 'pt_li20'],
    ['mer_li'],
    [HANDBOOK, OUTLINE],
  ),
  fc(
    'fc_pair',
    'route_recall',
    '肺經的表裡經是哪一條？',
    'Which meridian is the interior–exterior pair of the Lung meridian?',
    '手陽明大腸經。肺為裡（陰經，走內側），大腸為表（陽經，走外側）。',
    'The Large Intestine meridian. Lung is the interior (yin, inner arm); Large Intestine is the exterior (yang, outer arm).',
    [],
    ['mer_lu', 'mer_li'],
    [HANDBOOK, OUTLINE],
  ),
  fc(
    'fc_shaoshang',
    'point_to_attributes',
    '少商',
    '少商 (LU11)',
    '歸經：手太陰肺經｜位置：拇指橈側末端，肺經終點｜特定穴：井穴',
    'Meridian: Lung (LU11) · Position: radial end of the thumb, the terminus of the Lung meridian · Category: jing-well point',
    ['pt_lu11'],
    ['mer_lu'],
  ),

  /* ------------------------------- Day 2 ---------------------------------- */
  fc(
    'fc_zusanli_attrs',
    'point_to_attributes',
    '足三里',
    '足三里 (ST36)',
    '歸經：足陽明胃經（ST36）｜定位：犢鼻下 3 寸，脛骨前緣外一橫指｜特定穴：合穴',
    'Meridian: Stomach (ST36) · Location: 3 cun below 犢鼻 (ST35), one finger-breadth lateral to the anterior tibial border · Category: he-sea point',
    ['pt_st36'],
    ['mer_st'],
    [HANDBOOK, OUTLINE],
    'day_2',
  ),
  fc(
    'fc_tianshu_attrs',
    'point_to_attributes',
    '天樞',
    '天樞 (ST25)',
    '歸經：足陽明胃經（ST25）｜定位：肚臍旁開 2 寸｜特定穴：大腸募穴',
    'Meridian: Stomach (ST25) · Location: 2 cun lateral to the umbilicus · Category: front-mu point of the Large Intestine',
    ['pt_st25'],
    ['mer_st'],
    [HANDBOOK, OUTLINE],
    'day_2',
  ),
  fc(
    'fc_sibai_attrs',
    'point_to_attributes',
    '四白',
    '四白 (ST2)',
    '歸經：足陽明胃經（ST2）｜定位：瞳孔直下，眶下孔凹陷處',
    'Meridian: Stomach (ST2) · Location: directly below the pupil, in the depression at the infraorbital foramen',
    ['pt_st2'],
    ['mer_st'],
    [HANDBOOK, OUTLINE],
    'day_2',
  ),
  fc(
    'fc_neiting_attrs',
    'point_to_attributes',
    '內庭',
    '內庭 (ST44)',
    '歸經：足陽明胃經（ST44）｜定位：足背第二、三趾間，赤白肉際處',
    'Meridian: Stomach (ST44) · Location: on the dorsum of the foot between the 2nd and 3rd toes, at the red-and-white skin border',
    ['pt_st44'],
    ['mer_st'],
    [HANDBOOK, OUTLINE],
    'day_2',
  ),
  fc(
    'fc_fenglong_class',
    'classification',
    '豐隆是胃經的哪一種特定穴？',
    'Which specific-point category does 豐隆 (ST40) carry on the Stomach meridian?',
    '胃經的絡穴。',
    'The luo-connecting point of the Stomach meridian.',
    ['pt_st40'],
    ['mer_st'],
    [HANDBOOK],
    'day_2',
  ),
  fc(
    'fc_st_route',
    'route_recall',
    '胃經的路線口訣是什麼？起點與終點在哪？',
    'Recite the Stomach-channel route rhyme. Where does the channel start and end?',
    '「臉部繞行胸四寸，腹部旁開二寸行，腿前正中到次趾。」起於承泣（眼下），止於厲兌（足第二趾），共 45 穴。',
    'Face loop — chest at 4 cun — abdomen at 2 cun — front of the leg to the second toe. Starts at 承泣 (ST1, below the eye), ends at 厲兌 (ST45, second toe) — 45 points.',
    ['pt_st1', 'pt_st45'],
    ['mer_st'],
    [HANDBOOK, OUTLINE],
    'day_2',
  ),
  fc(
    'fc_belly_topic',
    'topic_to_point',
    '四總穴歌中，「肚腹」對應哪一個穴？',
    'In the Four Command Points song, which point is bound to the belly region?',
    '足三里（肚腹三里留）— 記憶口訣的配對，不是治療建議。',
    '足三里 (ST36). A mnemonic pairing of region to point, not treatment guidance.',
    ['pt_st36'],
    ['mer_st'],
    [HANDBOOK, OUTLINE],
    'day_2',
  ),
  /* ------------------------------- Day 3 ---------------------------------- */
  fc(
    'fc_sanyinjiao_attrs',
    'point_to_attributes',
    '三陰交',
    '三陰交 (SP6)',
    '歸經：足太陰脾經（SP6）｜定位：內踝尖上 3 寸，脛骨內側緣後方｜特定穴：足太陰、足少陰、足厥陰交會穴',
    'Meridian: Spleen (SP6) · Location: 3 cun above the tip of the medial malleolus, behind the medial border of the tibia · Category: meeting point of the Spleen, Kidney and Liver channels',
    ['pt_sp6'],
    ['mer_sp'],
    [WORKSHEET3],
    'day_3',
  ),
  fc(
    'fc_shenmen_attrs',
    'point_to_attributes',
    '神門',
    '神門 (HT7)',
    '歸經：手少陰心經（HT7）｜定位：腕掌側橫紋尺側端，尺側腕屈肌腱橈側凹陷｜特定穴：輸穴（土）兼原穴',
    'Meridian: Heart (HT7) · Location: at the ulnar end of the palmar wrist crease, in the depression radial to the flexor carpi ulnaris tendon · Category: shu-stream and yuan-source point',
    ['pt_ht7'],
    ['mer_ht'],
    [WORKSHEET3],
    'day_3',
  ),
  fc(
    'fc_taibai_class',
    'classification',
    '太白的特定穴屬性是什麼？',
    'Which specific-point categories does 太白 (SP3) carry?',
    '脾經輸穴（屬土）兼原穴。',
    'The shu-stream point (earth) and the yuan-source point of the Spleen meridian.',
    ['pt_sp3'],
    ['mer_sp'],
    [WORKSHEET3],
    'day_3',
  ),
  fc(
    'fc_gongsun_class',
    'classification',
    '公孫是哪兩種特定穴？',
    'Which two categories does 公孫 (SP4) belong to?',
    '脾經絡穴，同時是八脈交會穴（通衝脈）。',
    'The luo-connecting point of the Spleen meridian, and a confluent point of the eight extraordinary vessels.',
    ['pt_sp4'],
    ['mer_sp'],
    [WORKSHEET3],
    'day_3',
  ),
  fc(
    'fc_sp_route',
    'route_recall',
    '足太陰脾經走在下肢的哪一側？起點與終點在哪？',
    'Which aspect of the leg does the Spleen meridian follow, and where does it start and end?',
    '下肢內側。起於大趾內側（隱白），止於側胸部第 6 肋間隙（大包），共 21 穴。',
    'The medial aspect. It starts at the inner great toe (隱白 SP1) and ends on the lateral chest in the 6th intercostal space (大包 SP21) — 21 points.',
    ['pt_sp1', 'pt_sp21'],
    ['mer_sp'],
    [WORKSHEET3],
    'day_3',
  ),
  fc(
    'fc_ht_route',
    'route_recall',
    '手少陰心經的體表路線從哪裡到哪裡？',
    'Where does the Heart meridian’s surface course begin and end?',
    '從腋窩中央（極泉）沿上肢內側後緣下行，止於小指橈側（少沖），共 9 穴。',
    'From the centre of the axilla (極泉 HT1) down the postero-medial arm to the radial side of the little finger (少沖 HT9) — 9 points.',
    ['pt_ht1', 'pt_ht9'],
    ['mer_ht'],
    [WORKSHEET3],
    'day_3',
  ),
  fc(
    'fc_st_sp_pair',
    'route_recall',
    '足太陰脾經的表裡經是哪一條？',
    'Which meridian is the interior–exterior pair of the Spleen meridian?',
    '足陽明胃經。脾為裡（陰經，走下肢內側），胃為表（陽經，走下肢前外側）。',
    'The Stomach meridian. Spleen is the interior (yin, medial leg); Stomach is the exterior (yang, antero-lateral leg).',
    [],
    ['mer_sp', 'mer_st'],
    [WORKSHEET3],
    'day_3',
  ),
  fc(
    'fc_backshu_rule',
    'route_recall',
    '背部第一側線與第二側線各旁開多少寸？',
    'How far from the midline do the first and second back lines sit?',
    '第一側線在棘突下旁開 1.5 寸（背俞穴都在這條線上）；第二側線旁開 3 寸。',
    'The first line is 1.5 cun lateral to the spinous processes and carries the back-shu points; the second line is 3 cun lateral.',
    ['pt_bl13', 'pt_bl43'],
    ['mer_bl'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_backshu_levels',
    'point_to_attributes',
    '肺俞、心俞、膈俞、肝俞、脾俞、腎俞各在第幾椎下？',
    'At which vertebral levels do 肺俞, 心俞, 膈俞, 肝俞, 脾俞 and 腎俞 sit?',
    '肺俞 T3、心俞 T5、膈俞 T7、肝俞 T9、脾俞 T11、腎俞 L2 —— 皆為棘突下旁開 1.5 寸。',
    '肺俞 at T3, 心俞 at T5, 膈俞 at T7, 肝俞 at T9, 脾俞 at T11 and 腎俞 at L2 — each 1.5 cun lateral to the spinous process below that vertebra.',
    ['pt_bl13', 'pt_bl15', 'pt_bl17', 'pt_bl18', 'pt_bl20', 'pt_bl23'],
    ['mer_bl'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_bl_landmarks',
    'point_to_attributes',
    '背部定椎的兩個橫向地標是什麼？',
    'Which two cross-checks fix a vertebral height on the back?',
    '肚臍平第 2 腰椎（腎俞的高度）；髂嵴最高點平第 4 腰椎（大腸俞的高度）。',
    'The navel is level with L2 — the height of 腎俞 — and the top of the iliac crest is level with L4, the height of 大腸俞.',
    ['pt_bl23', 'pt_bl25'],
    ['mer_bl'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_bl_route',
    'route_recall',
    '足太陽膀胱經共幾穴？起點與終點在哪？',
    'How many points does the Bladder meridian have, and where does it start and end?',
    '共 67 穴，是十四經最長的一條。起於目內眥（睛明），止於足小趾外側（至陰）。',
    '67 points — the longest of the fourteen channels. It starts at the inner canthus (睛明 BL1) and ends at the lateral tip of the little toe (至陰 BL67).',
    ['pt_bl1', 'pt_bl67'],
    ['mer_bl'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_bl_numbering',
    'route_recall',
    '膀胱經的編號為什麼不是一路往下？',
    'Why is the Bladder numbering not one continuous downward walk?',
    'BL11–BL40 走第一側線與下肢至委中；BL41 回到上背（第 2 胸椎）開始第二側線，到 BL54；BL55 才再接回小腿走到足部。',
    'BL11–BL40 run the first line and the leg as far as 委中 BL40; BL41 returns to the upper back at T2 to start the second line through BL54; BL55 then rejoins the calf and continues to the foot.',
    ['pt_bl40', 'pt_bl41', 'pt_bl55'],
    ['mer_bl'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_si_route',
    'route_recall',
    '手太陽小腸經走在上肢的哪一側？起點與終點在哪？',
    'Which border of the arm does the Small Intestine meridian follow, and where does it start and end?',
    '上肢外側後緣（尺側）。起於小指尺側端（少澤），繞行肩胛後上頸頰，止於耳前（聽宮），共 19 穴。',
    'The ulnar, postero-lateral border. It starts at the ulnar tip of the little finger (少澤 SI1), circles the scapula, climbs the neck and cheek, and ends in front of the ear (聽宮 SI19) — 19 points.',
    ['pt_si1', 'pt_si19'],
    ['mer_si'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_ht_si_pair',
    'route_recall',
    '手太陽小腸經的表裡經是哪一條？',
    'Which meridian is the interior–exterior pair of the Small Intestine meridian?',
    '手少陰心經。心為裡（陰經，走上肢內側後緣），小腸為表（陽經，走上肢外側後緣）。',
    'The Heart meridian. Heart is the interior (yin, postero-medial arm); Small Intestine is the exterior (yang, postero-lateral arm).',
    [],
    ['mer_si', 'mer_ht'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_houxi_class',
    'classification',
    '後溪的特定穴屬性是什麼？',
    'Which specific-point categories does 後溪 (SI3) carry?',
    '小腸經輸穴（屬木），同時是八脈交會穴（通督脈）。',
    'The shu-stream point (wood) of the Small Intestine meridian, and a confluent point of the eight extraordinary vessels.',
    ['pt_si3'],
    ['mer_si'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_weizhong_loc',
    'point_to_attributes',
    '委中',
    '委中 (BL40)',
    '歸經：足太陽膀胱經（BL40）｜定位：膝後區，膕橫紋中點｜特定穴：合穴（土），四總穴之一',
    'Meridian: Bladder (BL40) · Location: at the midpoint of the popliteal crease, behind the knee · Category: he-sea point (earth), one of the four command points',
    ['pt_bl40'],
    ['mer_bl'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_kunlun_loc',
    'point_to_attributes',
    '崑崙',
    '崑崙 (BL60)',
    '歸經：足太陽膀胱經（BL60）｜定位：踝後外側，外踝尖與跟腱之間的凹陷｜特定穴：經穴（火）',
    'Meridian: Bladder (BL60) · Location: in the depression between the tip of the lateral malleolus and the Achilles tendon · Category: jing-river point (fire)',
    ['pt_bl60'],
    ['mer_bl'],
    [WORKSHEET4],
    'day_4',
  ),
  fc(
    'fc_bl_leg_route',
    'route_recall',
    '膀胱經在下肢後側依序經過哪五個大站？',
    'Name the five landmark stations the Bladder channel passes down the back of the leg.',
    '承扶（臀下橫紋中點）→ 殷門（承扶下 6 寸）→ 委中（膕橫紋中點）→ 承山（委中下 8 寸）→ 崑崙（外踝與跟腱之間），再沿足外側緣到至陰。',
    '承扶 BL36 at the gluteal fold → 殷門 BL37, 6 cun below it → 委中 BL40 at the popliteal crease → 承山 BL57, 8 cun below that → 崑崙 BL60 behind the outer ankle, then along the lateral foot to 至陰 BL67.',
    ['pt_bl36', 'pt_bl37', 'pt_bl40', 'pt_bl57', 'pt_bl60'],
    ['mer_bl'],
    [OUTLINE, WORKSHEET4],
    'day_5',
  ),
  fc(
    'fc_bl_leg_cun',
    'point_to_attributes',
    '下肢後側這一段的兩個骨度分寸各是多少？',
    'What are the two bone-cun measures for the back of the leg?',
    '臀下橫紋至膕橫紋 14 寸；膕橫紋至外踝尖 16 寸。',
    'Gluteal fold to popliteal crease is 14 cun; popliteal crease to the tip of the lateral malleolus is 16 cun.',
    ['pt_bl36', 'pt_bl40', 'pt_bl60'],
    ['mer_bl'],
    [WORKSHEET4],
    'day_5',
  ),
  fc(
    'fc_weizhong_landmark',
    'point_to_attributes',
    '委中',
    '委中 (BL40)',
    '歸經：足太陽膀胱經（BL40）｜定位：膕橫紋中點，股二頭肌腱與半腱肌腱之間｜特定穴：合穴（土），四總穴之一（腰背委中求）',
    'Meridian: Bladder (BL40) · Location: midpoint of the popliteal crease, between the two hamstring tendons · Category: he-sea point (earth), and one of the four command points 「腰背委中求」',
    ['pt_bl40'],
    ['mer_bl'],
    [OUTLINE, WORKSHEET4],
    'day_5',
  ),
  fc(
    'fc_chengshan_landmark',
    'point_to_attributes',
    '承山',
    '承山 (BL57)',
    '歸經：足太陽膀胱經（BL57）｜定位：小腿後面正中，委中下 8 寸；墊腳尖時腓腸肌兩肌腹下端的人字尖角凹陷處',
    'Meridian: Bladder (BL57) · Location: on the midline at the back of the calf, 8 cun below 委中; the hollow at the inverted-V where the two heads of the calf muscle part when you rise onto your toes',
    ['pt_bl57'],
    ['mer_bl'],
    [OUTLINE, WORKSHEET4],
    'day_5',
  ),
  fc(
    'fc_four_command_complete',
    'topic_to_point',
    '四總穴歌四句，各對應哪個穴、哪條經？',
    'Which point and channel does each line of the Four Command Points song name?',
    '肚腹三里留＝足三里（胃經）；腰背委中求＝委中（膀胱經）；頭項尋列缺＝列缺（肺經）；面口合谷收＝合谷（大腸經）。',
    '「肚腹三里留」= 足三里 ST36 (Stomach); 「腰背委中求」= 委中 BL40 (Bladder); 「頭項尋列缺」= 列缺 LU7 (Lung); 「面口合谷收」= 合谷 LI4 (Large Intestine).',
    ['pt_st36', 'pt_bl40', 'pt_lu7', 'pt_li4'],
    ['mer_st', 'mer_bl', 'mer_lu', 'mer_li'],
    [OUTLINE, HANDBOOK],
    'day_5',
  ),
  fc(
    'fc_kunlun_zhiyin',
    'route_recall',
    '膀胱經從外踝到終點還有哪些站？',
    'Which stations does the Bladder channel pass from the outer ankle to its end?',
    '崑崙（外踝與跟腱之間）→ 僕參 → 申脈（外踝尖直下）→ 金門 → 京骨 → 束骨 → 足通谷 → 至陰（小趾外側）。',
    '崑崙 BL60 → 僕參 BL61 → 申脈 BL62 directly below the malleolus tip → 金門 BL63 → 京骨 BL64 → 束骨 BL65 → 足通谷 BL66 → 至陰 BL67 at the lateral side of the little toe.',
    ['pt_bl60', 'pt_bl62', 'pt_bl64', 'pt_bl67'],
    ['mer_bl'],
    [WORKSHEET4],
    'day_5',
  ),
  fc(
    'fc_ki_route',
    'route_recall',
    '足少陰腎經共幾穴？起點與終點在哪？',
    'How many points does the Kidney meridian have, and where does it start and end?',
    '共 27 穴。起於足底湧泉，止於鎖骨下緣的俞府。',
    '27 points. It starts at 湧泉 KI1 in the sole and ends at 俞府 KI27 under the collarbone.',
    ['pt_ki1', 'pt_ki27'],
    ['mer_ki'],
    [WORKSHEET6],
    'day_6',
  ),
  fc(
    'fc_ki_abdomen_ruler',
    'point_to_attributes',
    '腎經腹部十一站的間距與旁開各是多少？',
    'What are the spacing and lateral distance of the eleven abdominal Kidney points?',
    '每站相差 1 寸，旁開前正中線恆為 0.5 寸：橫骨（臍下 5 寸）到幽門（臍上 5 寸），中間平臍的是肓俞。',
    'One cun apart, at a constant 0.5 cun from the anterior midline: 橫骨 5 cun below the navel up to 幽門 5 cun above it, with 肓俞 level with the navel in the middle.',
    ['pt_ki11', 'pt_ki16', 'pt_ki21'],
    ['mer_ki'],
    [WORKSHEET6],
    'day_6',
  ),
  fc(
    'fc_ki_abdomen_compare',
    'point_to_attributes',
    '腹部三條線離前正中線各多遠？',
    'How far from the anterior midline does each of the three abdominal lines run?',
    '腎經 0.5 寸、胃經 2 寸、脾經 4 寸——三條線並排，只差在旁開的距離。',
    'Kidney 0.5 cun, Stomach 2 cun, Spleen 4 cun — three parallel lines that differ only in their distance from the midline.',
    ['pt_ki16', 'pt_st25', 'pt_sp15'],
    ['mer_ki', 'mer_st', 'mer_sp'],
    [WORKSHEET6],
    'day_6',
  ),
  fc(
    'fc_taixi_loc',
    'point_to_attributes',
    '太溪',
    '太溪 (KI3)',
    '歸經：足少陰腎經（KI3）｜定位：內踝尖與跟腱之間的凹陷，平內踝尖｜特定穴：輸穴（土）兼原穴',
    'Meridian: Kidney (KI3) · Location: in the depression between the tip of the medial malleolus and the Achilles tendon, level with the malleolus tip · Category: shu-stream (earth) and yuan-source point',
    ['pt_ki3'],
    ['mer_ki'],
    [WORKSHEET6],
    'day_6',
  ),
  fc(
    'fc_zhaohai_loc',
    'point_to_attributes',
    '照海',
    '照海 (KI6)',
    '歸經：足少陰腎經（KI6）｜定位：內踝尖「下方」凹陷處（不是後下方）｜特定穴：八脈交會穴，通陰蹻脈',
    'Meridian: Kidney (KI6) · Location: in the depression BELOW the tip of the medial malleolus — not behind it · Category: confluent point of the eight extraordinary vessels, joining the Yin Motility vessel',
    ['pt_ki6'],
    ['mer_ki'],
    [WORKSHEET6],
    'day_6',
  ),
  fc(
    'fc_ki_five_shu',
    'classification',
    '腎經的五輸穴分別是哪五個穴？',
    'Which five points are the shu points of the Kidney channel?',
    '井湧泉（木）、滎然谷（火）、輸太溪（土，兼原穴）、經復溜（金）、合陰谷（水）。',
    'Jing-well 湧泉 (wood), ying-spring 然谷 (fire), shu-stream 太溪 (earth, also yuan-source), jing-river 復溜 (metal), he-sea 陰谷 (water).',
    ['pt_ki1', 'pt_ki2', 'pt_ki3', 'pt_ki7', 'pt_ki10'],
    ['mer_ki'],
    [WORKSHEET6],
    'day_6',
  ),
  fc(
    'fc_bl_ki_pair',
    'route_recall',
    '足少陰腎經的表裡經是哪一條？',
    'Which meridian is the interior–exterior pair of the Kidney meridian?',
    '足太陽膀胱經。腎為裡（陰經，走下肢內側），膀胱為表（陽經，走下肢後側）。',
    'The Bladder meridian. Kidney is the interior (yin, medial leg); Bladder is the exterior (yang, back of the leg).',
    [],
    ['mer_ki', 'mer_bl'],
    [WORKSHEET6],
    'day_6',
  ),
  fc(
    'fc_neiguan_waiguan',
    'point_to_attributes',
    '內關與外關的定位差在哪裡？',
    'Exactly how do 內關 and 外關 differ?',
    '同樣是腕橫紋上 2 寸：內關在掌側，兩筋（掌長肌腱與橈側腕屈肌腱）之間；外關在背側，尺橈兩骨之間。兩者皆為絡穴兼八脈交會穴。',
    'Both sit 2 cun above the wrist crease: 內關 on the palmar side between two tendons, 外關 on the dorsal side between the two forearm bones. Both are luo-connecting and confluent points.',
    ['pt_pc6', 'pt_te5'],
    ['mer_pc', 'mer_te'],
    [WORKSHEET7],
    'day_7',
  ),
  fc(
    'fc_pc_forearm_ruler',
    'point_to_attributes',
    '心包經前臂四穴各距腕橫紋幾寸？',
    'How far above the wrist crease does each of the four Pericardium forearm points sit?',
    '郄門 5 寸、間使 3 寸、內關 2 寸、大陵 0 寸（即在橫紋上），四穴同在兩筋之間一線。',
    '郄門 5 cun, 間使 3, 內關 2, 大陵 0 — on the crease itself. All four lie on one line between the same two tendons.',
    ['pt_pc4', 'pt_pc5', 'pt_pc6', 'pt_pc7'],
    ['mer_pc'],
    [WORKSHEET7],
    'day_7',
  ),
  fc(
    'fc_te_forearm_ruler',
    'point_to_attributes',
    '三焦經前臂各穴距腕背橫紋幾寸？',
    'How far above the dorsal wrist crease do the Triple Energizer forearm points sit?',
    '陽池 0 寸（橫紋上）、外關 2 寸、支溝 3 寸、三陽絡 4 寸、四瀆 7 寸；會宗與支溝同高，但在尺骨橈側緣。',
    '陽池 0 (on the crease), 外關 2, 支溝 3, 三陽絡 4, 四瀆 7. 會宗 shares 支溝’s height but sits on the ulnar border.',
    ['pt_te4', 'pt_te5', 'pt_te6', 'pt_te7', 'pt_te8', 'pt_te9'],
    ['mer_te'],
    [WORKSHEET7],
    'day_7',
  ),
  fc(
    'fc_arm_six_lines',
    'route_recall',
    '上肢內外側各三條線，由前到後分別是哪些經？',
    'Name the three channels on each face of the arm, front to back.',
    '內側：肺經（前緣）、心包經（中線）、心經（後緣）。外側：大腸經（前緣）、三焦經（中線）、小腸經（後緣）。',
    'Inner face: Lung (anterior), Pericardium (midline), Heart (posterior). Outer face: Large Intestine (anterior), Triple Energizer (midline), Small Intestine (posterior).',
    [],
    ['mer_lu', 'mer_pc', 'mer_ht', 'mer_li', 'mer_te', 'mer_si'],
    [WORKSHEET7],
    'day_7',
  ),
  fc(
    'fc_pc_five_shu',
    'classification',
    '心包經的五輸穴分別是哪五個穴？',
    'Which five points are the shu points of the Pericardium channel?',
    '井中衝（木）、滎勞宮（火）、輸大陵（土，兼原穴）、經間使（金）、合曲澤（水）。',
    'Jing-well 中衝 (wood), ying-spring 勞宮 (fire), shu-stream 大陵 (earth, also yuan-source), jing-river 間使 (metal), he-sea 曲澤 (water).',
    ['pt_pc9', 'pt_pc8', 'pt_pc7', 'pt_pc5', 'pt_pc3'],
    ['mer_pc'],
    [WORKSHEET7],
    'day_7',
  ),
  fc(
    'fc_te_five_shu',
    'classification',
    '三焦經的五輸穴與原穴分別是哪些？',
    'Which are the five shu points and the yuan-source of the Triple Energizer channel?',
    '井關衝（金）、滎液門（水）、輸中渚（木）、原陽池、經支溝（火）、合天井（土）。陽腑經的原穴自成一穴，不與輸穴同位。',
    'Jing-well 關衝 (metal), ying-spring 液門 (water), shu-stream 中渚 (wood), yuan-source 陽池, jing-river 支溝 (fire), he-sea 天井 (earth). On a yang channel the yuan-source is its own point, separate from the shu-stream.',
    ['pt_te1', 'pt_te2', 'pt_te3', 'pt_te4', 'pt_te6', 'pt_te10'],
    ['mer_te'],
    [WORKSHEET7],
    'day_7',
  ),
  fc(
    'fc_te_ear_loop',
    'route_recall',
    '三焦經在耳部的四站順序是什麼？',
    'What order does the Triple Energizer take around the ear?',
    '翳風（耳垂後）→ 瘈脈 → 顱息（沿耳輪往上）→ 角孫（耳尖上髮際），再折回耳前的耳門、耳和髎，止於眉梢的絲竹空。',
    '翳風 behind the lobe → 瘈脈 → 顱息 up along the helix → 角孫 at the hairline above the ear apex, then the branch doubles back in front of the ear to 耳門 and 耳和髎, ending at 絲竹空 on the outer brow.',
    ['pt_te17', 'pt_te20', 'pt_te21', 'pt_te23'],
    ['mer_te'],
    [WORKSHEET7],
    'day_7',
  ),
  fc(
    'fc_gb_route',
    'route_recall',
    '足少陽膽經共幾穴？起點與終點在哪？',
    'How many points does the Gallbladder meridian have, and where does it start and end?',
    '共 44 穴，是十四經第二長。起於目外眥的瞳子髎，止於第四趾外側的足竅陰。',
    '44 points, second only to the Bladder in length. It starts at 瞳子髎 GB1 at the outer canthus and ends at 足竅陰 GB44 on the fourth toe.',
    ['pt_gb1', 'pt_gb44'],
    ['mer_gb'],
    [WORKSHEET8],
    'day_8',
  ),
  fc(
    'fc_gb_proportions',
    'point_to_attributes',
    '膽經哪些穴是用「比例」而不是寸數定位的？',
    'Which Gallbladder points are located by PROPORTION rather than by cun?',
    '頷厭、懸顱、懸釐把頭維→曲鬢的弧線分四等分；浮白、頭竅陰把天衝→完骨的弧線分三等分；環跳在大轉子與骶管裂孔連線的外 1/3。',
    '頷厭, 懸顱 and 懸釐 divide the 頭維 → 曲鬢 curve into quarters; 浮白 and 頭竅陰 divide the 天衝 → 完骨 curve into thirds; 環跳 sits at the outer third of the line from the greater trochanter to the sacral hiatus.',
    ['pt_gb4', 'pt_gb5', 'pt_gb6', 'pt_gb10', 'pt_gb11', 'pt_gb30'],
    ['mer_gb'],
    [WORKSHEET8],
    'day_8',
  ),
  fc(
    'fc_gb_influential',
    'classification',
    '膽經上的兩個八會穴分別是什麼會？',
    'The Gallbladder carries two of the eight influential points — what is each influential for?',
    '陽陵泉（GB34）是筋會，在腓骨小頭前下方；懸鐘（GB39，別名絕骨）是髓會，在外踝尖上 3 寸。',
    '陽陵泉 GB34 is the influential point for SINEW, below the head of the fibula; 懸鐘 GB39 — also called 絕骨 — is the influential point for MARROW, 3 cun above the outer ankle.',
    ['pt_gb34', 'pt_gb39'],
    ['mer_gb'],
    [WORKSHEET8],
    'day_8',
  ),
  fc(
    'fc_gb_mu_confusion',
    'classification',
    '日月與京門各是哪一個臟腑的募穴？',
    'Which organ is each of 日月 and 京門 the front-mu point of?',
    '日月（GB24）是膽的募穴；京門（GB25）是「腎」的募穴——它長在膽經上，但不屬膽。',
    '日月 GB24 is the GALLBLADDER’s own front-mu. 京門 GB25 is the KIDNEY’s — it sits on the Gallbladder channel but does not belong to that organ.',
    ['pt_gb24', 'pt_gb25'],
    ['mer_gb'],
    [WORKSHEET8],
    'day_8',
  ),
  fc(
    'fc_gb_xi_confusion',
    'classification',
    '外丘與陽交同高，差別在哪裡？',
    '外丘 and 陽交 share a height — what separates them?',
    '兩穴都在外踝尖上 7 寸。外丘（GB36）在腓骨前緣，是膽經「本經」的郄穴；陽交（GB35）在腓骨後緣，是「陽維脈」的郄穴。',
    'Both sit 7 cun above the tip of the lateral malleolus. 外丘 GB36 is at the FRONT border of the fibula and is the channel’s own xi-cleft; 陽交 GB35 is at the BACK border and is the Yang Linking vessel’s.',
    ['pt_gb35', 'pt_gb36'],
    ['mer_gb'],
    [WORKSHEET8],
    'day_8',
  ),
  fc(
    'fc_gb_head_foot_pairs',
    'route_recall',
    '膽經上有哪兩組頭／足同名對？',
    'Which two head/foot name-pairs does the Gallbladder carry?',
    '頭臨泣（GB15）與足臨泣（GB41）；頭竅陰（GB11）與足竅陰（GB44）。靠「頭」「足」二字分辨。',
    '頭臨泣 GB15 with 足臨泣 GB41, and 頭竅陰 GB11 with 足竅陰 GB44 — told apart by the 頭 or 足 in front of the shared name.',
    ['pt_gb11', 'pt_gb15', 'pt_gb41', 'pt_gb44'],
    ['mer_gb'],
    [WORKSHEET8],
    'day_8',
  ),
  fc(
    'fc_fengchi_loc',
    'point_to_attributes',
    '風池',
    '風池 (GB20)',
    '歸經：足少陽膽經（GB20）｜定位：項部枕骨之下，與風府相平，胸鎖乳突肌與斜方肌上端之間的凹陷',
    'Meridian: Gallbladder (GB20) · Location: on the nape below the occipital bone, level with 風府 GV16, in the depression between the upper ends of sternocleidomastoid and trapezius',
    ['pt_gb20'],
    ['mer_gb'],
    [WORKSHEET8],
    'day_8',
  ),
  fc(
    'fc_lr_route',
    'route_recall',
    '足厥陰肝經共幾穴？起點與終點在哪？',
    'How many points does the Liver meridian have, and where does it start and end?',
    '共 14 穴，是十二正經最短的一條。起於足大趾外側的大敦，止於脅肋第 6 肋間的期門。',
    '14 points, the shortest of the twelve. From 大敦 LR1 on the outer great toe to 期門 LR14 in the 6th intercostal space on the flank.',
    ['pt_lr1', 'pt_lr14'],
    ['mer_lr'],
    [WORKSHEET9],
    'day_9',
  ),
  fc(
    'fc_lr_two_gates',
    'classification',
    '章門與期門分別是哪一臟的募穴？',
    'Which organ is each of 章門 and 期門 the front-mu point of?',
    '期門（LR14）是「肝」自己的募穴；章門（LR13）是「脾」的募穴，同時是八會穴的臟會——它長在肝經上但不屬肝。',
    '期門 LR14 is the LIVER’s own. 章門 LR13 is the SPLEEN’s — and also the influential point where the zang meet. It sits on the Liver channel without belonging to that organ.',
    ['pt_lr13', 'pt_lr14'],
    ['mer_lr'],
    [WORKSHEET9],
    'day_9',
  ),
  fc(
    'fc_four_gates',
    'topic_to_point',
    '「四關」是哪兩個穴？',
    'Which two points make up 「四關」, the four gates?',
    '太衝（LR3，肝經原穴）與合谷（LI4，大腸經原穴）——一足一手，兩穴左右各一，合為四關。',
    '太衝 LR3, the Liver’s yuan-source, and 合谷 LI4, the Large Intestine’s — one on the foot and one on the hand, taken bilaterally to make four.',
    ['pt_lr3', 'pt_li4'],
    ['mer_lr', 'mer_li'],
    [WORKSHEET9, OUTLINE],
    'day_9',
  ),
  fc(
    'fc_lr_five_shu',
    'classification',
    '肝經的五輸穴分別是哪五個穴？',
    'Which five points are the shu points of the Liver channel?',
    '井大敦（木）、滎行間（火）、輸太衝（土，兼原穴）、經中封（金）、合曲泉（水）。絡穴蠡溝、郄穴中都。',
    'Jing-well 大敦 (wood), ying-spring 行間 (fire), shu-stream 太衝 (earth, also the yuan-source), jing-river 中封 (metal), he-sea 曲泉 (water). The luo point is 蠡溝 and the xi-cleft 中都.',
    ['pt_lr1', 'pt_lr2', 'pt_lr3', 'pt_lr4', 'pt_lr8'],
    ['mer_lr'],
    [WORKSHEET9],
    'day_9',
  ),
  fc(
    'fc_lr_medial_ruler',
    'point_to_attributes',
    '蠡溝與中都各在內踝尖上幾寸？',
    'How far above the medial malleolus do 蠡溝 and 中都 sit?',
    '蠡溝上 5 寸、中都上 7 寸，都貼在脛骨內側面上。與脾經、腎經共用 13 寸這一段。',
    '蠡溝 at 5 cun and 中都 at 7, both against the medial face of the tibia — the same 13-cun segment the Spleen and Kidney use.',
    ['pt_lr5', 'pt_lr6'],
    ['mer_lr'],
    [WORKSHEET9],
    'day_9',
  ),
  fc(
    'fc_twelve_cycle',
    'route_recall',
    '十二正經的流注次序是什麼？',
    'What is the flow order of the twelve regular channels?',
    '肺→大腸→胃→脾→心→小腸→膀胱→腎→心包→三焦→膽→肝，再回到肺。肝經的支脈上注於肺，循環在此閉環。',
    'Lung → Large Intestine → Stomach → Spleen → Heart → Small Intestine → Bladder → Kidney → Pericardium → Triple Energizer → Gallbladder → Liver, and back to the Lung. A branch of the Liver pours into the lung, closing the circle.',
    ['pt_lr14', 'pt_lu1'],
    ['mer_lr', 'mer_lu'],
    [WORKSHEET9, LINGSHU],
    'day_9',
  ),
  fc(
    'fc_cv_gv_route',
    'route_recall',
    '任脈與督脈各走哪一面、各幾穴？',
    'Which face does each midline vessel run, and how many points has each?',
    '任脈 24 穴走身前正中線，會陰→承漿；督脈 29 穴走身後正中線，長強→經百會→齦交／印堂。',
    'The Conception vessel: 24 points up the anterior midline, 會陰 CV1 to 承漿 CV24. The Governor: 29 up the posterior midline, 長強 GV1 over 百會 to 齦交 GV28 / 印堂 GV29.',
    ['pt_cv1', 'pt_cv24', 'pt_gv1', 'pt_gv20'],
    ['mer_cv', 'mer_gv'],
    [WORKSHEET10],
    'day_10',
  ),
  fc(
    'fc_cv_mu_run',
    'classification',
    '任脈上的募穴分別屬於哪些臟腑？',
    'Which organs do the front-mu points on the Conception vessel belong to?',
    '中極＝膀胱募、關元＝小腸募、石門＝三焦募、中脘＝胃募（兼腑會）、巨闕＝心募、膻中＝心包募（兼氣會）。穴在任脈上，募的是別家臟腑。',
    '中極 bladder, 關元 small intestine, 石門 triple burner, 中脘 stomach (and the influential point for the fu), 巨闕 heart, 膻中 pericardium (and the influential point for qi). The points sit on this vessel; the organs are elsewhere.',
    ['pt_cv3', 'pt_cv4', 'pt_cv5', 'pt_cv12', 'pt_cv14', 'pt_cv17'],
    ['mer_cv'],
    [WORKSHEET10],
    'day_10',
  ),
  fc(
    'fc_shenque_zero',
    'point_to_attributes',
    '神闕（CV8）在定位系統裡的作用是什麼？',
    'What role does 神闕 CV8 play in the locating system?',
    '它是腹部寸數的零點：所有「臍中上 N 寸」「臍中下 N 寸」都從這裡起算，胃經（旁開 2 寸）、脾經（4 寸）、腎經（0.5 寸）的腹部穴也都以它為水平基準。',
    'It is the zero of the abdominal ruler: every 「N cun above/below the umbilicus」 counts from here, and the Stomach (2 cun lateral), Spleen (4) and Kidney (0.5) abdominal points all take their level from it.',
    ['pt_cv8', 'pt_st25', 'pt_sp15', 'pt_ki16'],
    ['mer_cv', 'mer_st', 'mer_sp', 'mer_ki'],
    [WORKSHEET10],
    'day_10',
  ),
  fc(
    'fc_dazhui_anchor',
    'point_to_attributes',
    '大椎（GV14）為什麼是背部最重要的定位基準？',
    'Why is 大椎 GV14 the key reference for locating on the back?',
    '它在第 7 頸椎棘突下——低頭時頸後最突出的骨節下方。從它往下數椎骨，就得到所有背俞穴的高度；肩井（GB21）、肩中俞（SI15）也以它為基準。手足三陽經在此與督脈交會。',
    'It sits below the spinous process of C7, the most prominent bump when the head is bowed. Counting vertebrae down from it gives every back-shu height, and 肩井 GB21 and 肩中俞 SI15 are located against it. All six yang channels are described as meeting the Governor here.',
    ['pt_gv14', 'pt_bl13', 'pt_gb21'],
    ['mer_gv', 'mer_bl', 'mer_gb'],
    [WORKSHEET10],
    'day_10',
  ),
  fc(
    'fc_seas',
    'route_recall',
    '為什麼任脈稱「陰脈之海」、督脈稱「陽脈之海」？',
    'Why is the Conception called the sea of yin and the Governor the sea of yang?',
    '任脈走身前總任諸陰經，督脈走身後總督諸陽經。手足三陽經都在大椎與督脈相會，故督脈又稱「諸陽之會」。',
    'The Conception runs the front and is said to take charge of all the yin channels; the Governor runs the back and governs all the yang. The six hand and foot yang channels are described as meeting it at 大椎, which is why it is also called the assembly of the yang.',
    ['pt_gv14'],
    ['mer_cv', 'mer_gv'],
    [WORKSHEET10],
    'day_10',
  ),
  fc(
    'fc_gv_terminus',
    'route_recall',
    '督脈的止點是哪一穴？',
    'Which point is the Governor vessel’s terminus?',
    '兩種說法都對：按編號順序末穴是齦交（GV28）；按循行方向由上而下，止於印堂（GV29）。印堂原為經外奇穴，GB/T 12346-2006 才收入督脈。',
    'Both readings are right. By numbering the last point is 齦交 GV28; by the direction of flow, downward over the face, it ends at 印堂 GV29. 印堂 was an extra point outside the channels until GB/T 12346-2006 brought it in.',
    ['pt_gv28', 'pt_gv29'],
    ['mer_gv'],
    [WORKSHEET10],
    'day_10',
  ),
  fc(
    'fc_extraordinary',
    'classification',
    '任督二脈和十二正經結構上差在哪裡？',
    'How do the two midline vessels differ structurally from the twelve?',
    '沒有左右之分（走正中線）、沒有表裡配對、沒有五輸穴，也不在十二經的流注循環裡——它們是奇經。',
    'No left and right — they run the midline; no interior–exterior pair; no five-shu points; and they stand outside the twelve’s flow cycle. They are extraordinary vessels.',
    [],
    ['mer_cv', 'mer_gv'],
    [WORKSHEET10],
    'day_10',
  ),

  /* --- Day 11: the specific-point matrix, read sideways across the channels - */

  fc(
    'fc_yuan_shu_coincide',
    'classification',
    '陰經的原穴在哪裡？陽經呢？',
    'Where is the yuan-source point on a yin channel? On a yang channel?',
    '陰經的原穴與輸穴是同一個穴（如太淵、太白、神門、太谿、大陵、太衝）。陽經的原穴另外獨立一個，排在輸穴之後。',
    'On a yin channel the yuan-source and the shu-stream are the same point — 太淵, 太白, 神門, 太谿, 大陵, 太衝. On a yang channel the yuan-source is a separate point, sitting just after the shu-stream.',
    ['pt_lu9', 'pt_sp3', 'pt_ht7', 'pt_ki3', 'pt_pc7', 'pt_lr3'],
    [],
    [HANDBOOK, OUTLINE],
    'day_11',
  ),
  fc(
    'fc_five_shu_direction',
    'classification',
    '五輸穴的排列方向是什麼？',
    'Which way do the five shu points run?',
    '井、滎、輸、經、合，一律由四肢末端往身體方向排。井穴在指（趾）端，合穴在肘或膝附近——不分陰陽經，方向都一樣。',
    'Jing-well, ying-spring, shu-stream, jing-river, he-sea — always from the tip of the limb inward. The well is at the finger or toe, the he-sea near the elbow or knee. The direction is the same on every one of the twelve.',
    [],
    [],
    [HANDBOOK, OUTLINE],
    'day_11',
  ),
  fc(
    'fc_eight_influential',
    'classification',
    '八會穴：哪八個組織，各會於哪一穴？',
    'The eight influential points — which tissue gathers at which point?',
    '腑會中脘、臟會章門、筋會陽陵泉、髓會懸鐘、血會膈俞、骨會大杼、脈會太淵、氣會膻中。',
    'Fu organs at 中脘 (CV12), zang organs at 章門 (LR13), sinew at 陽陵泉 (GB34), marrow at 懸鐘 (GB39), blood at 膈俞 (BL17), bone at 大杼 (BL11), the vessels at 太淵 (LU9), qi at 膻中 (CV17).',
    ['pt_cv12', 'pt_lr13', 'pt_gb34', 'pt_gb39', 'pt_bl17', 'pt_bl11', 'pt_lu9', 'pt_cv17'],
    [],
    [HANDBOOK, OUTLINE],
    'day_11',
  ),
  fc(
    'fc_mu_off_channel',
    'classification',
    '哪些募穴不在自己臟腑的經上？',
    'Which front-mu points sit on a channel other than their own organ’s?',
    '胃的募穴中脘在任脈、脾的募穴章門在肝經、腎的募穴京門在膽經。募穴散在各經，不必然跟著自己的臟腑走——這是最常錯的一組。',
    '中脘, the stomach’s mu, is on the Conception vessel; 章門, the spleen’s, is on the Liver; 京門, the kidney’s, is on the Gallbladder. The mu points are scattered and do not have to follow their own organ’s channel — this is the set most often got wrong.',
    ['pt_cv12', 'pt_lr13', 'pt_gb25'],
    [],
    [HANDBOOK, OUTLINE],
    'day_11',
  ),
  fc(
    'fc_back_shu_line',
    'route_recall',
    '十二背俞穴全都在哪條線上？',
    'All twelve back-shu points lie on which line?',
    '膀胱經第一側線，後正中線旁開 1.5 寸，由上而下依臟腑順序排列——所以背俞穴考的其實是椎骨高度。',
    'The Bladder’s first line, 1.5 cun lateral to the posterior midline, ordered top to bottom by organ. Which means recalling a back-shu is really recalling a vertebral level.',
    [],
    ['mer_bl'],
    [HANDBOOK, OUTLINE],
    'day_11',
  ),
  fc(
    'fc_confluent_pairs',
    'classification',
    '八脈交會穴的四組配對是什麼？',
    'What are the four coupled pairs of the eight confluent points?',
    '公孫配內關、後谿配申脈、足臨泣配外關、列缺配照海。每組一手一足；記住配對就一次記住八個穴。',
    '公孫 with 內關, 後谿 with 申脈, 足臨泣 with 外關, 列缺 with 照海. One foot point and one hand point in each — learn the four pairings and all eight come with them.',
    ['pt_sp4', 'pt_pc6', 'pt_si3', 'pt_bl62', 'pt_gb41', 'pt_te5', 'pt_lu7', 'pt_ki6'],
    [],
    [HANDBOOK, OUTLINE],
    'day_11',
  ),
  fc(
    'fc_categories_are_sideways',
    'classification',
    '特定穴分類跟經絡循行是什麼關係？',
    'How do the specific-point categories relate to the channel routes?',
    '兩套互相垂直的索引。經絡是縱向的：一條線上依序排穴。分類是橫向的：同一類的穴散在不同經上（八會穴就分散在五條經）。同一個穴可以同時屬於好幾類。',
    'Two indexes at right angles to each other. A channel is the vertical one: points in order along a single line. A category is the horizontal one: its members are scattered across different channels — the eight influential points span five. One point can sit in several categories at once.',
    ['pt_lu9'],
    [],
    [HANDBOOK, OUTLINE],
    'day_11',
  ),

  /* --- Day 12: the whole set, held together ------------------------------- */

  fc(
    'fc_flow_cycle',
    'route_recall',
    '十二經的流注順序是什麼？',
    'What is the flow sequence of the twelve channels?',
    '肺→大腸→胃→脾→心→小腸→膀胱→腎→心包→三焦→膽→肝，再回到肺。三陰三陽各走一輪，手足交替，首尾相接成一個循環。',
    'Lung → Large Intestine → Stomach → Spleen → Heart → Small Intestine → Bladder → Kidney → Pericardium → Triple Energiser → Gallbladder → Liver, and back to the Lung. Hand and foot alternate, and the sequence closes on itself.',
    [],
    [],
    [HANDBOOK, OUTLINE],
    'day_12',
  ),
  fc(
    'fc_interior_exterior',
    'classification',
    '六組表裡配對是哪些？',
    'What are the six interior–exterior pairs?',
    '肺與大腸、脾與胃、心與小腸、腎與膀胱、心包與三焦、肝與膽。每組一陰一陽，一臟一腑，循行路線在四肢上也相鄰。',
    'Lung–Large Intestine, Spleen–Stomach, Heart–Small Intestine, Kidney–Bladder, Pericardium–Triple Energiser, Liver–Gallbladder. One yin and one yang in each, one zang and one fu, and their routes run alongside each other on the limbs.',
    [],
    [],
    [HANDBOOK, OUTLINE],
    'day_12',
  ),
  fc(
    'fc_three_yin_three_yang',
    'route_recall',
    '手三陰、手三陽在手臂上的前中後怎麼分？',
    'How are the three yin and three yang of the arm arranged front to back?',
    '陰經走手臂內側：太陰在前、厥陰在中、少陰在後。陽經走外側，順序相對：陽明在前、少陽在中、太陽在後。足部同理。',
    'The yin channels run the inner arm: Taiyin in front, Jueyin in the middle, Shaoyin behind. The yang channels run the outer arm in the matching order: Yangming in front, Shaoyang in the middle, Taiyang behind. The leg follows the same scheme.',
    [],
    [],
    [HANDBOOK, OUTLINE],
    'day_12',
  ),
  fc(
    'fc_count_per_channel',
    'classification',
    '十四經各有幾穴？',
    'How many points does each of the fourteen carry?',
    '肺 11、大腸 20、胃 45、脾 21、心 9、小腸 19、膀胱 67、腎 27、心包 9、三焦 23、膽 44、肝 14、任脈 24、督脈 29——共 362 穴。胃、膀胱、膽三條最長。',
    'Lung 11, Large Intestine 20, Stomach 45, Spleen 21, Heart 9, Small Intestine 19, Bladder 67, Kidney 27, Pericardium 9, Triple Energiser 23, Gallbladder 44, Liver 14, Conception 24, Governor 29 — 362 in all. Stomach, Bladder and Gallbladder are the three long ones.',
    [],
    [],
    [HANDBOOK, OUTLINE],
    'day_12',
  ),
  fc(
    'fc_cun_segments',
    'classification',
    '骨度分寸為什麼要分段？',
    'Why is the bone-cun system measured segment by segment?',
    '一寸不是固定長度，是「該段骨度的幾分之一」。肘腕之間定為 12 寸、膝踝之間 16 寸、臍到恥骨聯合 5 寸——所以量哪一段，就用哪一段自己的比例，不能跨段換算。',
    'A cun is not a fixed length; it is a fraction of the segment it is measured in. Elbow to wrist is defined as 12 cun, knee to ankle as 16, umbilicus to pubic symphysis as 5. So each measurement uses its own segment’s scale, and you cannot carry one segment’s cun into another.',
    [],
    [],
    [HANDBOOK, OUTLINE],
    'day_12',
  ),
  fc(
    'fc_landmark_first',
    'classification',
    '定位一個穴時，第一步該做什麼？',
    'What is the first step in locating any point?',
    '先找到那一段的固定骨性或紋路標誌（肘橫紋、腕橫紋、髕骨上下緣、臍、胸骨柄上緣、C7 棘突……），再從標誌量寸。標誌先，寸數後——目測估位就是錯的來源。',
    'Find the fixed landmark bounding that segment first — the elbow crease, the wrist crease, the upper or lower border of the patella, the umbilicus, the suprasternal notch, the C7 spinous process — and only then measure the cun from it. Landmark first, distance second; eyeballing the offset is where the error comes from.',
    [],
    [],
    [HANDBOOK, OUTLINE],
    'day_12',
  ),

  /* --- Day 13: the twelve as a day ---------------------------------------- */

  fc(
    'fc_ziwu_verse',
    'route_recall',
    '背出十二經納地支歌',
    'Recite the verse that holds the whole clock',
    '「肺寅大卯胃辰宮，脾巳心午小未中，申膀酉腎心包戌，亥焦子膽丑肝通。」——出自《針灸大成》，二十八個字裝下十二時辰配十二經。',
    '「肺寅大卯胃辰宮，脾巳心午小未中，申膀酉腎心包戌，亥焦子膽丑肝通。」 From 《針灸大成》: twenty-eight characters holding all twelve pairings.',
    [],
    [],
    [ZIWU, WORKSHEET_ZIWU],
    'day_13',
  ),
  fc(
    'fc_ziwu_yin_lu',
    'classification',
    '寅時（03:00–05:00）配哪一條經？',
    'Which channel goes with 寅 (03:00–05:00)?',
    '手太陰肺經。它是流注的起點——十二經的循環從這裡算起，繞一圈回到肺經。',
    'The Lung channel. It is where the cycle is counted from: the twelve run in order from here and close back on the Lung.',
    ['pt_lu1'],
    ['mer_lu'],
    [ZIWU, WORKSHEET_ZIWU],
    'day_13',
  ),
  fc(
    'fc_ziwu_chen_st',
    'classification',
    '辰時（07:00–09:00）配哪一條經？',
    'Which channel goes with 辰 (07:00–09:00)?',
    '足陽明胃經。它排在大腸經之後、脾經之前——胃與脾互為表裡，在表上前後相鄰。',
    'The Stomach channel, after the Large Intestine and before the Spleen — and the Stomach and Spleen are an interior–exterior pair, so they sit next to each other on the table.',
    ['pt_st36', 'pt_st25'],
    ['mer_st'],
    [ZIWU, WORKSHEET_ZIWU],
    'day_13',
  ),
  fc(
    'fc_ziwu_wu_ht',
    'classification',
    '午時（11:00–13:00）配哪一條經？',
    'Which channel goes with 午 (11:00–13:00)?',
    '手少陰心經。「子午」正是這張表的兩個端點：子時膽經、午時心經，一夜一日相對。',
    'The Heart channel. 子 and 午 are the two poles the table is named for: the Gallbladder at 子 and the Heart at 午, midnight against noon.',
    ['pt_ht7', 'pt_ht9'],
    ['mer_ht'],
    [ZIWU, WORKSHEET_ZIWU],
    'day_13',
  ),
  fc(
    'fc_ziwu_nazi',
    'classification',
    '什麼是「納子法」？',
    'What does 「納子法」 name?',
    '以十二地支（時辰）配十二正經的那張對應表本身，描述經氣依序流過的節律。名詞專門，內容就是你背過的流注順序。',
    'The table itself — the twelve earthly branches matched to the twelve regular channels, describing the order the qi is said to run in. The term is technical; its content is the flow sequence you already know.',
    [],
    [],
    [ZIWU, WORKSHEET_ZIWU],
    'day_13',
  ),
  fc(
    'fc_ziwu_open_closed',
    'classification',
    '「開穴」「閉穴」在本課是什麼意思？',
    'What do 「開穴」 and 「閉穴」 mean here?',
    '只是節律的說法：經氣流注到某經時稱「開」，流過之後稱「閉」，形容潮汐般的漲落。不是操作指令，本 App 不據以決定任何事；據天干推算開穴的「納甲法」屬臨床決策，本課程不教。',
    'Rhythm vocabulary only: a channel is “open” while the qi is described as running through it and “closed” once it has passed — a rise and fall, like a tide. It is not an instruction and nothing here acts on it. 納甲法, which calculates opening points from the heavenly stems, is treatment decision-making and is not taught.',
    [],
    [],
    [ZIWU, WORKSHEET_ZIWU],
    'day_13',
  ),
  /* Day 14 — location, channel and category only. Every front is a LOCATION or
     a classification question; none is a symptom. */
  fc(
    'fc_d14_hegu',
    'point_to_attributes',
    '第 1、2 掌骨之間，第 2 掌骨橈側中點處。',
    'Between the first and second metacarpals, at the midpoint of the radial side of the second.',
    '合谷 LI4 — 手陽明大腸經，原穴。',
    '合谷 LI4 — Large Intestine channel, yuan-source point.',
    ['pt_li4'],
    ['mer_li'],
    [WORKSHEET14],
    'day_14',
  ),
  fc(
    'fc_d14_houxi',
    'point_to_attributes',
    '握拳，第 5 掌指關節尺側近端、赤白肉際凹陷中。',
    'Make a fist: the depression proximal to the fifth metacarpophalangeal joint on its ulnar side, at the red-white boundary.',
    '後溪 SI3 — 手太陽小腸經，輸穴。',
    '後溪 SI3 — Small Intestine channel, shu-stream point.',
    ['pt_si3'],
    ['mer_si'],
    [WORKSHEET14],
    'day_14',
  ),
  fc(
    'fc_d14_shenmen',
    'point_to_attributes',
    '腕掌側橫紋尺側端，尺側腕屈肌腱的橈側凹陷處。',
    'The ulnar end of the palmar wrist crease, in the depression radial to the flexor carpi ulnaris tendon.',
    '神門 HT7 — 手少陰心經，原穴（亦為輸穴）。',
    '神門 HT7 — Heart channel, yuan-source point (and its shu-stream).',
    ['pt_ht7'],
    ['mer_ht'],
    [WORKSHEET14],
    'day_14',
  ),
  fc(
    'fc_d14_taiyuan',
    'point_to_attributes',
    '腕掌側橫紋橈側，橈動脈搏動處。',
    'The radial end of the palmar wrist crease, where the radial artery pulses.',
    '太淵 LU9 — 手太陰肺經，原穴、脈會。',
    '太淵 LU9 — Lung channel, yuan-source point and influential point of the vessels.',
    ['pt_lu9'],
    ['mer_lu'],
    [WORKSHEET14],
    'day_14',
  ),
  fc(
    'fc_d14_waiguan',
    'classification',
    '三焦經，腕背橫紋上 2 寸、尺橈骨之間的穴是哪一個？屬何特定穴？',
    'On the Triple Energiser channel, 2 cun above the dorsal wrist crease between ulna and radius — which point, and what category?',
    '外關 TE5 — 絡穴。與心包經的絡穴內關 PC6 在同一高度、前臂兩面相對。',
    '外關 TE5 — a luo-connecting point. It faces 內關 PC6, the Pericardium’s luo-connecting point, at the same level on the other side of the forearm.',
    ['pt_te5', 'pt_pc6'],
    ['mer_te', 'mer_pc'],
    [WORKSHEET14],
    'day_14',
  ),
  fc(
    'fc_d14_little_finger',
    'classification',
    '小指兩側各有一條經：橈側與尺側分別是哪一條？井穴各是什麼？',
    'The little finger carries a channel on each side. Which is radial, which is ulnar, and what is each one’s jing-well?',
    '橈側（靠掌）為心經，井穴少衝 HT9；尺側（靠背）為小腸經，井穴少澤 SI1。記反了整隻手的陰陽就翻了。',
    'Radial, on the palm side: the Heart channel, jing-well 少衝 HT9. Ulnar, on the back side: the Small Intestine channel, jing-well 少澤 SI1. Reverse them and the yin and yang of the whole hand turn over.',
    ['pt_ht9', 'pt_si1'],
    ['mer_ht', 'mer_si'],
    [WORKSHEET14],
    'day_14',
  ),
  fc(
    'fc_d14_yuan_cluster',
    'classification',
    '腕部一線上的四個原穴是哪四個？分別在掌側還是背側？',
    'Which four yuan-source points lie along the wrist, and which side is each on?',
    '掌側橫紋三個：太淵 LU9（橈側）、大陵 PC7（中點）、神門 HT7（尺側端）；背側一個：陽池 TE4（腕背橫紋中點）。',
    'Three on the palmar crease — 太淵 LU9 at the radial end, 大陵 PC7 at the midpoint, 神門 HT7 at the ulnar end — and one dorsal, 陽池 TE4 at the midpoint of the dorsal wrist crease.',
    ['pt_lu9', 'pt_pc7', 'pt_ht7', 'pt_te4'],
    ['mer_lu', 'mer_pc', 'mer_ht', 'mer_te'],
    [WORKSHEET14],
    'day_14',
  ),
  /* Day 15 — every front is a location or a category, never a symptom. */
  fc(
    'fc_d15_quchi',
    'point_to_attributes',
    '屈肘成直角，肘彎橫紋盡頭；尺澤與肱骨外上髁連線的中點。',
    'Elbow at a right angle, at the end of the cubital crease — midway between 尺澤 and the lateral epicondyle.',
    '曲池 LI11 — 手陽明大腸經，合穴。',
    '曲池 LI11 — Large Intestine channel, he-sea point.',
    ['pt_li11'],
    ['mer_li'],
    [WORKSHEET15],
    'day_15',
  ),
  fc(
    'fc_d15_chize',
    'point_to_attributes',
    '肘橫紋中，肱二頭肌腱橈側凹陷處。',
    'In the cubital crease, in the depression on the RADIAL edge of the biceps tendon.',
    '尺澤 LU5 — 手太陰肺經，合穴。同一條肌腱的尺側是曲澤 PC3。',
    '尺澤 LU5 — Lung channel, he-sea point. On the ulnar edge of the same tendon is 曲澤 PC3.',
    ['pt_lu5', 'pt_pc3'],
    ['mer_lu', 'mer_pc'],
    [WORKSHEET15],
    'day_15',
  ),
  fc(
    'fc_d15_shaohai_xiaohai',
    'classification',
    '少海與小海都貼著同一個骨性標志。是哪一個？兩者各在肘的哪一面、屬哪一條經？',
    '少海 and 小海 share one bony landmark. Which? Which side of the elbow is each on, and on which channel?',
    '同為肱骨內上髁。少海 HT3 在肘前、橫紋內側端，心經合穴；小海 SI8 在肘後、尺骨鷹嘴與內上髁之間，小腸經合穴。心與小腸互為表裡。',
    'Both use the medial epicondyle. 少海 HT3 is in front, at the medial end of the crease — the Heart’s he-sea. 小海 SI8 is behind, between the olecranon and that epicondyle — the Small Intestine’s he-sea. The two channels are a pair.',
    ['pt_ht3', 'pt_si8'],
    ['mer_ht', 'mer_si'],
    [WORKSHEET15],
    'day_15',
  ),
  fc(
    'fc_d15_ximen',
    'point_to_attributes',
    '腕掌側遠端橫紋上 5 寸，掌長肌腱與橈側腕屈肌腱之間。',
    '5 cun above the distal palmar wrist crease, between the tendons of palmaris longus and flexor carpi radialis.',
    '郄門 PC4 — 手厥陰心包經，郄穴。同一條走廊上還有間使 PC5（3 寸）與內關 PC6（2 寸）。',
    '郄門 PC4 — Pericardium channel, xi-cleft point. The same corridor carries 間使 PC5 at 3 cun and 內關 PC6 at 2.',
    ['pt_pc4', 'pt_pc5', 'pt_pc6'],
    ['mer_pc'],
    [WORKSHEET15],
    'day_15',
  ),
  fc(
    'fc_d15_yanglao',
    'point_to_attributes',
    '腕背橫紋上 1 寸，尺骨頭橈側凹陷中；掌心向胸取穴。',
    '1 cun above the dorsal wrist crease, in the depression on the radial side of the head of the ulna; found with the palm turned toward the chest.',
    '養老 SI6 — 手太陽小腸經，郄穴。',
    '養老 SI6 — Small Intestine channel, xi-cleft point.',
    ['pt_si6'],
    ['mer_si'],
    [WORKSHEET15],
    'day_15',
  ),
  fc(
    'fc_d15_corridors',
    'classification',
    '前臂的兩條走廊：尺橈骨之間走哪一條經？兩筋之間走哪一條？肺經與大腸經走哪裡？',
    'The forearm’s two corridors: which channel runs between the bones, which between the two tendons, and where do the Lung and Large Intestine run?',
    '骨間隙是三焦經（外關 TE5、支溝 TE6）；兩筋之間是心包經（內關 PC6、間使 PC5、郄門 PC4）。肺經與大腸經都不走這兩條，而是沿橈側緣上行。',
    'The interosseous space is the Triple Energiser (外關 TE5, 支溝 TE6); between the tendons is the Pericardium (內關 PC6, 間使 PC5, 郄門 PC4). The Lung and Large Intestine use neither — both follow the radial border.',
    ['pt_te5', 'pt_te6', 'pt_pc6', 'pt_lu6', 'pt_li10'],
    ['mer_te', 'mer_pc', 'mer_lu', 'mer_li'],
    [WORKSHEET15],
    'day_15',
  ),
  fc(
    'fc_d15_twelve_cun',
    'classification',
    '腕橫紋到肘橫紋是幾寸？依序說出 2、3、5、7 寸上的穴。',
    'How many cun from the wrist crease to the cubital crease, and which points sit at 2, 3, 5 and 7?',
    '12 寸。2 寸：內關 PC6、外關 TE5；3 寸：間使 PC5、支溝 TE6；5 寸：郄門 PC4；7 寸：孔最 LU6。由肘往下 2 寸則是手三里 LI10。',
    'Twelve. At 2 cun: 內關 PC6 and 外關 TE5. At 3: 間使 PC5 and 支溝 TE6. At 5: 郄門 PC4. At 7: 孔最 LU6. And 2 cun down from the cubital crease: 手三里 LI10.',
    ['pt_pc6', 'pt_te5', 'pt_pc5', 'pt_te6', 'pt_pc4', 'pt_lu6', 'pt_li10'],
    ['mer_pc', 'mer_te', 'mer_lu', 'mer_li'],
    [WORKSHEET15],
    'day_15',
  ),
  /* Day 16 — location or category on every front; never a symptom. */
  fc(
    'fc_d16_jianyu',
    'point_to_attributes',
    '三角肌上，臂外展或向前平伸時，肩峰前下方出現的凹陷處。',
    'On the deltoid, in the depression that appears anteroinferior to the acromion when the arm is abducted or raised forward.',
    '肩髃 LI15 — 手陽明大腸經，交會穴。',
    '肩髃 LI15 — Large Intestine channel, a crossing point.',
    ['pt_li15'],
    ['mer_li'],
    [WORKSHEET16],
    'day_16',
  ),
  fc(
    'fc_d16_jianliao',
    'classification',
    '肩峰後下方，肩髃後方約 1 寸，肩峰角與肱骨大結節之間的凹陷——是哪個穴？屬哪一條經？',
    'Posteroinferior to the acromion, about 1 cun behind 肩髃, between the acromial angle and the greater tubercle — which point, and on which channel?',
    '肩髎 TE14 — 手少陽三焦經。與前方的肩髃 LI15（大腸經）繞著同一個肩峰，但分屬兩條不同的陽經。',
    '肩髎 TE14 — the Triple Energiser channel. It and 肩髃 LI15 in front of it circle the same acromion but belong to two different yang channels.',
    ['pt_te14', 'pt_li15'],
    ['mer_te', 'mer_li'],
    [WORKSHEET16],
    'day_16',
  ),
  fc(
    'fc_d16_jianzhen',
    'point_to_attributes',
    '肩關節後下方，腋後紋頭直上 1 寸。',
    'Posteroinferior to the shoulder joint, 1 cun directly above the posterior axillary fold.',
    '肩貞 SI9 — 手太陽小腸經。',
    '肩貞 SI9 — Small Intestine channel.',
    ['pt_si9'],
    ['mer_si'],
    [WORKSHEET16],
    'day_16',
  ),
  fc(
    'fc_d16_scapula',
    'classification',
    '肩胛岡把肩胛骨分成上下兩窩。岡上窩中點上方是哪個穴？岡下窩中央是哪個？',
    'The scapular spine divides the scapula into two fossae. Which point sits above the midpoint of the supraspinous fossa, and which at the centre of the infraspinous?',
    '岡上：秉風 SI12（交會穴）；岡下：天宗 SI11。同屬手太陽小腸經，都在本區之內。',
    'Above the spine, 秉風 SI12, a crossing point; below it, 天宗 SI11. Both are on the Small Intestine channel, and both belong to this region.',
    ['pt_si12', 'pt_si11'],
    ['mer_si'],
    [WORKSHEET16],
    'day_16',
  ),
  fc(
    'fc_d16_tianquan',
    'point_to_attributes',
    '腋前紋頭下 2 寸，肱二頭肌長、短頭之間的溝中。',
    '2 cun below the anterior axillary fold, in the groove between the long and short heads of the biceps.',
    '天泉 PC2 — 手厥陰心包經。再下 1 寸、移到肌肉橈側緣的是天府 LU3（肺經）——溝裡與緣上，兩條不同的經。',
    '天泉 PC2 — Pericardium channel. One cun further down, on the radial BORDER of the muscle rather than in the groove, is 天府 LU3 of the Lung — two different channels.',
    ['pt_pc2', 'pt_lu3'],
    ['mer_pc', 'mer_lu'],
    [WORKSHEET16],
    'day_16',
  ),
  fc(
    'fc_d16_binao',
    'point_to_attributes',
    '三角肌止點處，曲池與肩髃連線上，曲池上 7 寸。',
    'At the deltoid insertion, on the line from 曲池 to 肩髃, 7 cun above 曲池.',
    '臂臑 LI14 — 手陽明大腸經。全區唯一從肘那一端起算的穴，不屬腋下量出的那一組。',
    '臂臑 LI14 — Large Intestine channel. The one point in this region counted from the ELBOW end rather than down from the axillary fold.',
    ['pt_li14', 'pt_li11'],
    ['mer_li'],
    [WORKSHEET16],
    'day_16',
  ),
  fc(
    'fc_d16_crossings',
    'classification',
    '手部、前臂、肩部各有幾個交會穴？',
    'How many crossing points does the hand hold, the elbow and forearm, and the shoulder?',
    '手部 0、前臂 0、肩部 7（肩髃 LI15、巨骨 LI16、臑俞 SI10、秉風 SI12、臑會 TE13、天髎 TE15、肩井 GB21）。手臂的經脈一路各走各的，到肩上才相會。',
    'Nought, nought, and seven — 肩髃 LI15, 巨骨 LI16, 臑俞 SI10, 秉風 SI12, 臑會 TE13, 天髎 TE15 and 肩井 GB21. The arm’s channels run in their own lanes the whole way up and meet at the shoulder.',
    ['pt_li15', 'pt_li16', 'pt_si10', 'pt_si12', 'pt_te13', 'pt_te15', 'pt_gb21'],
    ['mer_li', 'mer_si', 'mer_te', 'mer_gb'],
    [WORKSHEET16],
    'day_16',
  ),
  /* Day 17 — every front is a grid coordinate or a category. */
  fc(
    'fc_d17_danzhong',
    'point_to_attributes',
    '前正中線上，平第 4 肋間隙，兩乳頭連線的中點。',
    'On the anterior midline, level with the 4th intercostal space, midway between the nipples.',
    '膻中 CV17 — 任脈，心包募穴、氣會。網格的原點：第 4 隙與正中線的交點。',
    '膻中 CV17 — Conception vessel; the Pericardium front-mu and the influential point of qi. The origin of the grid, where the 4th space crosses the midline.',
    ['pt_cv17'],
    ['mer_cv'],
    [WORKSHEET17],
    'day_17',
  ),
  fc(
    'fc_d17_shufu_yuzhong',
    'classification',
    '俞府與彧中相差多遠？各在哪裡？',
    'How far apart are 俞府 and 彧中, and where is each?',
    '相差約 1.6 寸，正好一個肋間隙。俞府 KI27 在鎖骨下緣、第 1 肋的上方；彧中 KI26 在第 1 肋間隙裡。兩者同屬腎經，同樣旁開 2 寸。',
    'About 1.6 cun — one whole intercostal space. 俞府 KI27 lies at the lower border of the clavicle, above the 1st rib; 彧中 KI26 lies inside the 1st space. Both are Kidney points, both 2 cun out.',
    ['pt_ki27', 'pt_ki26'],
    ['mer_ki'],
    [WORKSHEET17],
    'day_17',
  ),
  fc(
    'fc_d17_fourth_row',
    'classification',
    '第 4 肋間隙由內而外有哪五個穴？各旁開幾寸？',
    'Which five points lie along the 4th intercostal space, and at what distances?',
    '膻中 CV17（0 寸）、神封 KI23（2 寸）、乳中 ST17（4 寸）、天池 PC1（5 寸）、天溪 SP18（6 寸）。五條線各出一個穴，同一水平線上。',
    '膻中 CV17 at 0, 神封 KI23 at 2, 乳中 ST17 at 4, 天池 PC1 at 5, 天溪 SP18 at 6 — one point from each line, all on one horizontal.',
    ['pt_cv17', 'pt_ki23', 'pt_st17', 'pt_pc1', 'pt_sp18'],
    ['mer_cv', 'mer_ki', 'mer_st', 'mer_pc', 'mer_sp'],
    [WORKSHEET17],
    'day_17',
  ),
  fc(
    'fc_d17_ki_ruler',
    'classification',
    '腎經旁開前正中線幾寸？',
    'How far from the anterior midline does the Kidney channel run?',
    '看在肋弓的哪一邊：胸部六站（KI22–KI27）旁開 2 寸，腹部十一站（KI11–KI21）旁開 0.5 寸，分界在肋弓下緣。',
    'It depends which side of the costal arch you are on: the six chest stations (KI22–KI27) run 2 cun out, the eleven abdominal ones (KI11–KI21) only 0.5.',
    ['pt_ki22', 'pt_ki27', 'pt_ki16'],
    ['mer_ki'],
    [WORKSHEET17],
    'day_17',
  ),
  fc(
    'fc_d17_rugen',
    'point_to_attributes',
    '第 5 肋間隙，前正中線旁開 4 寸，乳頭直下。',
    'In the 5th intercostal space, 4 cun lateral to the anterior midline, directly below the nipple.',
    '乳根 ST18 — 足陽明胃經，胸部最低的一個胃經穴。',
    '乳根 ST18 — Stomach channel, and its lowest point on the chest.',
    ['pt_st18'],
    ['mer_st'],
    [WORKSHEET17],
    'day_17',
  ),
  fc(
    'fc_d17_ruler',
    'classification',
    '任脈胸段的量尺是哪一段、幾寸？膻中落在幾分之幾處？',
    'What is the ruler for the Conception vessel chest segment, and where along it does 膻中 fall?',
    '胸骨上窩（天突 CV22）到胸劍聯合＝9 寸。膻中約在 6 寸處，即三分之二。中庭 CV16 就在 9 寸的終點——胸劍聯合本身。',
    'From the suprasternal fossa (天突 CV22) to the xiphisternal junction is 9 cun. 膻中 falls at about 6 — two thirds of the way. 中庭 CV16 marks the 9-cun end, the junction itself.',
    ['pt_cv17', 'pt_cv16'],
    ['mer_cv'],
    [WORKSHEET17],
    'day_17',
  ),
  fc(
    'fc_d17_qimen',
    'point_to_attributes',
    '第 6 肋間隙，乳頭直下，前正中線旁開 4 寸。',
    'In the 6th intercostal space, directly below the nipple, 4 cun lateral to the anterior midline.',
    '期門 LR14 — 足厥陰肝經的募穴，本區最下的一站，約與巨闕 CV14 同高。',
    '期門 LR14 — the Liver front-mu point and the lowest station in this region, roughly level with 巨闕 CV14.',
    ['pt_lr14'],
    ['mer_lr'],
    [WORKSHEET17],
    'day_17',
  ),
  /* Day 18 — location or category on every front. */
  fc(
    'fc_d18_ruler',
    'classification',
    '腎經、胃經、脾經在肋弓以上與以下各旁開前正中線幾寸？',
    'How far from the anterior midline do the Kidney, Stomach and Spleen channels run above the costal arch, and below it?',
    '以上（胸部）2、4、6 寸；以下（腹部）0.5、2、4 寸。任脈兩段都走 0 寸。同一條經，換一段身體就換一把尺。',
    'Above, on the chest: 2, 4 and 6 cun. Below, on the abdomen: 0.5, 2 and 4. The Conception vessel runs 0 in both. Same channels, different segment, different ruler.',
    ['pt_ki16', 'pt_st25', 'pt_sp15'],
    ['mer_ki', 'mer_st', 'mer_sp'],
    [WORKSHEET18],
    'day_18',
  ),
  fc(
    'fc_d18_navel_row',
    'classification',
    '與臍同高的一列，由內而外有哪四個穴？',
    'Which four points lie on the row level with the navel, from the midline outward?',
    '神闕 CV8（0）、肓俞 KI16（0.5 寸）、天樞 ST25（2 寸）、大橫 SP15（4 寸）。一次走完腹部的三個旁開距離。',
    '神闕 CV8 at 0, 肓俞 KI16 at 0.5, 天樞 ST25 at 2 and 大橫 SP15 at 4 — all three abdominal distances in one pass.',
    ['pt_cv8', 'pt_ki16', 'pt_st25', 'pt_sp15'],
    ['mer_cv', 'mer_ki', 'mer_st', 'mer_sp'],
    [WORKSHEET18],
    'day_18',
  ),
  fc(
    'fc_d18_zhongwan',
    'point_to_attributes',
    '前正中線上，臍中上 4 寸——正好是胸劍聯合與臍中連線的中點。',
    'On the anterior midline, 4 cun above the navel — exactly halfway from the xiphisternal junction to the navel.',
    '中脘 CV12 — 任脈，胃的募穴，亦為腑會。',
    '中脘 CV12 — Conception vessel; the Stomach’s front-mu point and the influential point of the fu organs.',
    ['pt_cv12'],
    ['mer_cv'],
    [WORKSHEET18],
    'day_18',
  ),
  fc(
    'fc_d18_lower_midline',
    'classification',
    '臍下五寸之內，正中線上依序有哪五個穴？',
    'Within the five cun below the navel, name the five midline points in order.',
    '氣海 CV6（1.5 寸）、石門 CV5（2 寸）、關元 CV4（3 寸）、中極 CV3（4 寸）、曲骨 CV2（5 寸，恥骨聯合上緣）。',
    '氣海 CV6 at 1.5, 石門 CV5 at 2, 關元 CV4 at 3, 中極 CV3 at 4 and 曲骨 CV2 at 5 — the upper border of the pubic symphysis.',
    ['pt_cv6', 'pt_cv5', 'pt_cv4', 'pt_cv3', 'pt_cv2'],
    ['mer_cv'],
    [WORKSHEET18],
    'day_18',
  ),
  fc(
    'fc_d18_tianshu',
    'point_to_attributes',
    '橫平臍中，前正中線旁開 2 寸。',
    'Level with the navel, 2 cun lateral to the anterior midline.',
    '天樞 ST25 — 足陽明胃經，大腸的募穴。腹部胃經那一列的中站。',
    '天樞 ST25 — Stomach channel, and the Large Intestine’s front-mu point. The middle station of the Stomach column on the abdomen.',
    ['pt_st25'],
    ['mer_st'],
    [WORKSHEET18],
    'day_18',
  ),
  fc(
    'fc_d18_mu',
    'classification',
    '本區有幾個募穴？正中線上的五個是哪些？',
    'How many front-mu points does this region hold, and which five are on the midline?',
    '七個，是全資料集十二個募穴的一半以上。正中線上：巨闕 CV14（心）、中脘 CV12（胃）、石門 CV5（三焦）、關元 CV4（小腸）、中極 CV3（膀胱）。另外兩個是天樞 ST25（大腸）與日月 GB24（膽）。',
    'Seven — more than half the dataset’s twelve. On the midline: 巨闕 CV14 (Heart), 中脘 CV12 (Stomach), 石門 CV5 (Triple Energiser), 關元 CV4 (Small Intestine) and 中極 CV3 (Bladder). The other two are 天樞 ST25 (Large Intestine) and 日月 GB24 (Gallbladder).',
    ['pt_cv14', 'pt_cv12', 'pt_cv5', 'pt_cv4', 'pt_cv3', 'pt_st25', 'pt_gb24'],
    ['mer_cv', 'mer_st', 'mer_gb'],
    [WORKSHEET18],
    'day_18',
  ),
  fc(
    'fc_d18_boundary',
    'classification',
    '日月 GB24 在肋弓的上面還是下面？真正落在肋弓下緣的是哪一個穴？',
    'Is 日月 GB24 above the costal arch or on it, and which point actually lies at the arch?',
    '日月在肋弓上方，第 7 肋間隙、乳頭直下、旁開 4 寸。落在肋弓下緣的是章門 LR13，第 11 肋游離端下方——它屬於身側及帶脈區（Day 22），不在本區。',
    '日月 is above it, in the 7th intercostal space directly below the nipple, 4 cun out. The point at the arch is 章門 LR13, below the free end of the 11th rib — and it belongs to the flank region (Day 22), not this one.',
    ['pt_gb24'],
    ['mer_gb'],
    [WORKSHEET18],
    'day_18',
  ),
  /* Day 19 — location or category on every front. */
  fc(
    'fc_d19_zhangmen',
    'point_to_attributes',
    '第 11 肋游離端下方，前正中線旁開 4 寸。',
    'Below the free end of the 11th rib, 4 cun lateral to the anterior midline.',
    '章門 LR13 — 足厥陰肝經的穴，卻是脾的募穴，兼臟會。',
    '章門 LR13 — a point of the Liver channel that is nonetheless the front-mu of the SPLEEN, and the influential point of the zang organs.',
    ['pt_lr13'],
    ['mer_lr'],
    [WORKSHEET19],
    'day_19',
  ),
  fc(
    'fc_d19_jingmen',
    'point_to_attributes',
    '第 12 肋游離端下方，章門後 1.8 寸。',
    'Below the free end of the 12th rib, 1.8 cun behind 章門.',
    '京門 GB25 — 足少陽膽經的穴，卻是腎的募穴。',
    '京門 GB25 — a point of the Gallbladder channel that is the front-mu of the KIDNEY.',
    ['pt_gb25', 'pt_lr13'],
    ['mer_gb'],
    [WORKSHEET19],
    'day_19',
  ),
  fc(
    'fc_d19_daimai',
    'point_to_attributes',
    '第 11 肋游離端下方的垂線，與通過肚臍的水平線，兩線的交點。',
    'Where a vertical dropped from the free end of the 11th rib meets the horizontal through the navel.',
    '帶脈 GB26 — 足少陽膽經，交會穴。章門下 1.8 寸，平臍；全課程唯一以「垂線與水平線交點」定位的穴。',
    '帶脈 GB26 — Gallbladder channel, a crossing point. 1.8 cun below 章門 and level with the navel; the only point in the course located as the intersection of a vertical and a horizontal.',
    ['pt_gb26'],
    ['mer_gb'],
    [WORKSHEET19],
    'day_19',
  ),
  fc(
    'fc_d19_asis_pair',
    'classification',
    '掛在髂前上棘上的兩個穴是哪兩個？相差多少？',
    'Which two points hang off the anterior superior iliac spine, and how far apart are they?',
    '五樞 GB27 在棘的前方、橫平臍下 3 寸；維道 GB28 在棘的前下方、五樞前下 0.5 寸。兩者同為交會穴。',
    '五樞 GB27 in front of the spine, level with a point 3 cun below the navel; 維道 GB28 in front of and below it, 0.5 cun down from 五樞. Both are crossing points.',
    ['pt_gb27', 'pt_gb28'],
    ['mer_gb'],
    [WORKSHEET19],
    'day_19',
  ),
  fc(
    'fc_d19_mu_shu',
    'classification',
    '章門與京門在背後各配哪一個背俞穴？在第幾椎？',
    'Which back-shu point pairs with 章門, and which with 京門, and at which vertebra?',
    '章門（脾募）配脾俞 BL20，第 11 胸椎棘突下旁開 1.5 寸；京門（腎募）配腎俞 BL23，第 2 腰椎棘突下旁開 1.5 寸。募在前、俞在後。',
    '章門, front-mu of the Spleen, pairs with 脾俞 BL20 below the 11th thoracic spinous process, 1.5 cun out; 京門, front-mu of the Kidney, pairs with 腎俞 BL23 below the 2nd lumbar. Mu in front, shu behind.',
    ['pt_lr13', 'pt_gb25', 'pt_bl20', 'pt_bl23'],
    ['mer_lr', 'mer_gb', 'mer_bl'],
    [WORKSHEET19],
    'day_19',
  ),
  fc(
    'fc_d19_dabao',
    'point_to_attributes',
    '腋中線上，第 6 肋間隙。',
    'On the mid-axillary line, in the 6th intercostal space.',
    '大包 SP21 — 足太陰脾經，脾之大絡，全資料集唯一的一個。',
    '大包 SP21 — Spleen channel, its great luo-connecting point, and the only one of its kind in the dataset.',
    ['pt_sp21'],
    ['mer_sp'],
    [WORKSHEET19],
    'day_19',
  ),
  fc(
    'fc_d19_axillary',
    'classification',
    '腋中線第 4 肋間隙上的兩個穴是哪兩個？相差多少？',
    'Which two points share the 4th intercostal space on the mid-axillary line, and how far apart?',
    '淵腋 GB22（腋下 3 寸）與輒筋 GB23（淵腋前 1 寸），同屬膽經。第 4 肋間隙正是 Day 17 胸部的錨點肋隙，繞到身側仍是它。',
    '淵腋 GB22, 3 cun below the axilla, and 輒筋 GB23 one cun in front of it — both Gallbladder. The 4th space is the same anchor row as the chest on Day 17, carried round to the side.',
    ['pt_gb22', 'pt_gb23'],
    ['mer_gb'],
    [WORKSHEET19],
    'day_19',
  ),
  /* Day 20 — location or category on every front; no pain language anywhere. */
  fc(
    'fc_d20_six_lower_he',
    'classification',
    '六腑的下合穴分別是哪六個？各配哪一個腑？',
    'Name the six lower he-sea points of the fu organs, and the organ each stands for.',
    '足三里 ST36（胃）、上巨虛 ST37（大腸）、下巨虛 ST39（小腸）、委中 BL40（膀胱）、委陽 BL39（三焦）、陽陵泉 GB34（膽）。六個全在膝與小腿這一區。',
    '足三里 ST36 (Stomach), 上巨虛 ST37 (Large Intestine), 下巨虛 ST39 (Small Intestine), 委中 BL40 (Bladder), 委陽 BL39 (Triple Energiser), 陽陵泉 GB34 (Gallbladder) — all six in the knee and lower leg.',
    ['pt_st36', 'pt_st37', 'pt_st39', 'pt_bl40', 'pt_bl39', 'pt_gb34'],
    ['mer_st', 'mer_bl', 'mer_gb'],
    [WORKSHEET20],
    'day_20',
  ),
  fc(
    'fc_d20_weizhong',
    'point_to_attributes',
    '膕橫紋中點，股二頭肌腱與半腱肌肌腱的中間。',
    'At the midpoint of the popliteal crease, between the tendons of biceps femoris and semitendinosus.',
    '委中 BL40 — 足太陽膀胱經，合穴，同時是膀胱的下合穴。',
    '委中 BL40 — Bladder channel; its he-sea point and the Bladder’s lower he-sea.',
    ['pt_bl40'],
    ['mer_bl'],
    [WORKSHEET20],
    'day_20',
  ),
  fc(
    'fc_d20_weiyang',
    'point_to_attributes',
    '膕橫紋外側端，股二頭肌腱的內側。',
    'At the lateral end of the popliteal crease, on the medial side of the biceps femoris tendon.',
    '委陽 BL39 — 足太陽膀胱經的穴，卻是三焦的下合穴。與委中同在一條橫紋上，一中一外。',
    '委陽 BL39 — a Bladder-channel point that is nonetheless the TRIPLE ENERGISER’s lower he-sea. It shares the crease with 委中: one central, one at the lateral end.',
    ['pt_bl39', 'pt_bl40'],
    ['mer_bl'],
    [WORKSHEET20],
    'day_20',
  ),
  fc(
    'fc_d20_yanglingquan',
    'point_to_attributes',
    '小腿外側，腓骨頭前下方的凹陷處。',
    'On the lateral lower leg, in the depression anterior and inferior to the head of the fibula.',
    '陽陵泉 GB34 — 足少陽膽經，合穴、膽的下合穴，八會穴之筋會。',
    '陽陵泉 GB34 — Gallbladder channel; its he-sea, the Gallbladder’s lower he-sea, and the influential point of the sinews among the eight.',
    ['pt_gb34'],
    ['mer_gb'],
    [WORKSHEET20],
    'day_20',
  ),
  fc(
    'fc_d20_stomach_trio',
    'classification',
    '胃經小腿段上每隔 3 寸的三個穴是哪三個？各是哪一個腑的下合穴？',
    'Three points sit three cun apart down the Stomach channel’s lower leg. Which are they, and for which fu organ is each the lower he-sea?',
    '足三里 ST36（胃）→ 上巨虛 ST37（大腸）→ 下巨虛 ST39（小腸）。大腸與小腸的下合穴都不在手上，而是借在胃經的腿上——這正是「下合」的意思。',
    '足三里 ST36 (Stomach) → 上巨虛 ST37 (Large Intestine) → 下巨虛 ST39 (Small Intestine). Neither intestine has a lower he-sea point on the arm; both borrow a station on the Stomach channel’s leg, which is what 下 means here.',
    ['pt_st36', 'pt_st37', 'pt_st39'],
    ['mer_st'],
    [WORKSHEET20],
    'day_20',
  ),
  fc(
    'fc_d20_xuanzhong',
    'point_to_attributes',
    '小腿外側，外踝尖上 3 寸，腓骨前緣。',
    'On the lateral lower leg, 3 cun above the tip of the lateral malleolus, at the anterior border of the fibula.',
    '懸鐘 GB39 — 足少陽膽經，八會穴之髓會。與陽陵泉同掛在腓骨上，一上一下。',
    '懸鐘 GB39 — Gallbladder channel, the influential point of the marrow. It and 陽陵泉 both hang off the fibula, one high and one low.',
    ['pt_gb39', 'pt_gb34'],
    ['mer_gb'],
    [WORKSHEET20],
    'day_20',
  ),
  fc(
    'fc_d20_calf',
    'classification',
    '小腿後側由上而下的三站各怎麼定？',
    'How is each of the three stations down the back of the calf located?',
    '合陽 BL55 在委中直下 2 寸；承筋 BL56 在委中下 5 寸、腓腸肌肌腹中央；承山 BL57 在腓腸肌兩肌腹下端的交角處。',
    '合陽 BL55, 2 cun directly below 委中; 承筋 BL56, 5 cun below it at the centre of the gastrocnemius belly; 承山 BL57 where the two bellies converge at their lower ends.',
    ['pt_bl55', 'pt_bl56', 'pt_bl57'],
    ['mer_bl'],
    [WORKSHEET20],
    'day_20',
  ),
  /* Day 21 — location or category on every front. */
  fc(
    'fc_d21_four_lines',
    'classification',
    '頭皮上四條經線由內而外各旁開幾寸？',
    'How far out does each of the scalp’s four lines run, from the midline outward?',
    '督脈 0 寸（頭正中線）、膀胱經 1.5 寸、膽經頭皮線 2.25 寸、胃經頭維 4.5 寸。',
    'Governing vessel 0 on the midline, Bladder 1.5, the Gallbladder scalp line 2.25, and 頭維 of the Stomach 4.5.',
    ['pt_gv20', 'pt_bl7', 'pt_gb16', 'pt_st8'],
    ['mer_gv', 'mer_bl', 'mer_gb', 'mer_st'],
    [WORKSHEET21],
    'day_21',
  ),
  fc(
    'fc_d21_gb_two_figures',
    'classification',
    '膽經在頭部有兩個旁開數字，分別是哪些穴？',
    'The Gallbladder carries two lateral figures on the head. Which points take each?',
    '頭皮線 2.25 寸：目窗 GB16、正營 GB17、承靈 GB18、腦空 GB19。3 寸只有本神 GB13 一個，在前髮際上 0.5 寸。',
    'The scalp line at 2.25 cun: 目窗 GB16, 正營 GB17, 承靈 GB18, 腦空 GB19. Three cun belongs to 本神 GB13 alone, half a cun above the front hairline.',
    ['pt_gb16', 'pt_gb19', 'pt_gb13'],
    ['mer_gb'],
    [WORKSHEET21],
    'day_21',
  ),
  fc(
    'fc_d21_baihui',
    'point_to_attributes',
    '前髮際正中直上 5 寸；或兩耳尖連線的中點處。',
    'Five cun above the midpoint of the front hairline; or the midpoint of the line joining the ear tips.',
    '百會 GV20 — 督脈。頭頂的座標原點。',
    '百會 GV20 — Governing vessel, and the origin of the head’s coordinates.',
    ['pt_gv20'],
    ['mer_gv'],
    [WORKSHEET21],
    'day_21',
  ),
  fc(
    'fc_d21_fengfu',
    'point_to_attributes',
    '後正中線上，後髮際正中直上 1 寸，枕外隆凸直下。',
    'On the posterior midline, one cun above the back hairline, directly below the external occipital protuberance.',
    '風府 GV16 — 督脈。與它同高、在兩側肌肉夾縫裡的是風池 GB20。',
    '風府 GV16 — Governing vessel. Level with it, in the muscular clefts either side, sits 風池 GB20.',
    ['pt_gv16', 'pt_gb20'],
    ['mer_gv'],
    [WORKSHEET21],
    'day_21',
  ),
  fc(
    'fc_d21_fengchi',
    'point_to_attributes',
    '枕骨之下，與風府相平，胸鎖乳突肌與斜方肌上端之間的凹陷處。',
    'Below the occipital bone, level with 風府, in the depression between the upper ends of sternocleidomastoid and trapezius.',
    '風池 GB20 — 足少陽膽經。靠肌肉定位，不是靠寸數。',
    '風池 GB20 — Gallbladder channel. Located by muscle rather than by cun.',
    ['pt_gb20'],
    ['mer_gb'],
    [WORKSHEET21],
    'day_21',
  ),
  fc(
    'fc_d21_hairline_ruler',
    'classification',
    '頭部的縱向量尺是哪一段、幾寸？神庭與百會各在前髮際上幾寸？',
    'What is the head’s vertical ruler, and how far above the front hairline are 神庭 and 百會?',
    '前髮際到後髮際＝12 寸。神庭 GV24 在 0.5 寸，上星 GV23 在 1 寸，百會 GV20 在 5 寸。',
    'Front hairline to back hairline is 12 cun. 神庭 GV24 sits at 0.5, 上星 GV23 at 1, and 百會 GV20 at 5.',
    ['pt_gv24', 'pt_gv23', 'pt_gv20'],
    ['mer_gv'],
    [WORKSHEET21],
    'day_21',
  ),
  fc(
    'fc_d21_jiaosun',
    'point_to_attributes',
    '折耳廓向前，耳尖直上入髮際處。',
    'Fold the auricle forward: in the hairline directly above the ear tip.',
    '角孫 TE20 — 手少陽三焦經，本區唯一的三焦經穴，也是唯一用耳朵而非髮際定位的。',
    '角孫 TE20 — Triple Energiser, this region’s only point on that channel and the only one located by the ear rather than the hairline.',
    ['pt_te20'],
    ['mer_te'],
    [WORKSHEET21],
    'day_21',
  ),
  /* Day 22 — location or category on every front. */
  fc(
    'fc_d22_pupil_line',
    'classification',
    '從瞳孔垂直落下的一條線上，由上而下有哪四個穴？',
    'Which four points fall on the vertical dropped from the pupil, top to bottom?',
    '承泣 ST1（眼球與眶下緣之間）、四白 ST2（眶下孔）、巨髎 ST3（平鼻翼下緣）、地倉 ST4（口角外側，上直瞳孔，旁開 0.4 寸）。四個都是胃經穴。',
    '承泣 ST1 between eyeball and infraorbital margin, 四白 ST2 at the infraorbital foramen, 巨髎 ST3 level with the lower border of the ala, and 地倉 ST4 beside the mouth level with the pupil, 0.4 cun out. All four are Stomach points.',
    ['pt_st1', 'pt_st2', 'pt_st3', 'pt_st4'],
    ['mer_st'],
    [WORKSHEET22],
    'day_22',
  ),
  fc(
    'fc_d22_midline',
    'classification',
    '面部正中線由上而下有哪六個穴？各屬哪一條脈？',
    'Which six points run down the facial midline, and on which vessel is each?',
    '印堂 GV29、素髎 GV25、水溝 GV26、兌端 GV27、齦交 GV28 屬督脈；承漿 CV24 屬任脈。齦交在上唇內，是本區唯一在口腔內的穴。',
    '印堂 GV29, 素髎 GV25, 水溝 GV26, 兌端 GV27 and 齦交 GV28 on the Governing vessel; 承漿 CV24 on the Conception. 齦交 is inside the upper lip — the region’s only point in the mouth.',
    ['pt_gv29', 'pt_gv25', 'pt_gv26', 'pt_gv27', 'pt_gv28', 'pt_cv24'],
    ['mer_gv', 'mer_cv'],
    [WORKSHEET22],
    'day_22',
  ),
  fc(
    'fc_d22_tragus',
    'classification',
    '貼著耳屏由上而下的三個穴是哪三個？各屬哪一條經？',
    'Name the three points down the tragus, top to bottom, and their channels.',
    '耳門 TE21（三焦，耳屏上切跡前）、聽宮 SI19（小腸，耳屏正中前方）、聽會 GB2（膽，耳屏間切跡前）。三個穴在一塊小軟骨上，分屬三條經。',
    '耳門 TE21 of the Triple Energiser in front of the supratragic notch, 聽宮 SI19 of the Small Intestine in front of the centre of the tragus, and 聽會 GB2 of the Gallbladder in front of the intertragic notch — three points on one flap of cartilage, on three channels.',
    ['pt_te21', 'pt_si19', 'pt_gb2'],
    ['mer_te', 'mer_si', 'mer_gb'],
    [WORKSHEET22],
    'day_22',
  ),
  fc(
    'fc_d22_zanzhu',
    'point_to_attributes',
    '眉頭凹陷中，眶上切跡處。',
    'In the hollow at the inner end of the eyebrow, at the supraorbital notch.',
    '攢竹 BL2 — 足太陽膀胱經。是切跡（骨緣上的缺口），不是孔；眶下孔是四白 ST2 的位置。',
    '攢竹 BL2 — Bladder channel. A NOTCH, a gap in the bone’s edge — not a foramen. The infraorbital foramen is where 四白 ST2 sits.',
    ['pt_bl2', 'pt_st2'],
    ['mer_bl'],
    [WORKSHEET22],
    'day_22',
  ),
  fc(
    'fc_d22_yingxiang',
    'point_to_attributes',
    '鼻翼外緣中點旁，鼻唇溝中。',
    'Beside the midpoint of the ala of the nose, in the nasolabial groove.',
    '迎香 LI20 — 手陽明大腸經的最後一穴。這條經從食指的商陽 LI1 起（Day 14），到臉上結束。',
    '迎香 LI20 — the last point of the Large Intestine channel, which began at 商陽 LI1 on the index finger on Day 14 and ends here on the face.',
    ['pt_li20'],
    ['mer_li'],
    [WORKSHEET22],
    'day_22',
  ),
  fc(
    'fc_d22_jaw',
    'classification',
    '哪一個穴的凹陷閉口時出現、張口時消失？耳屏那三個呢？',
    'Which point’s depression appears with the mouth closed and vanishes on opening it — and what about the three on the tragus?',
    '下關 ST7 閉口才有凹陷（顴弓下緣中央與下頜切跡之間）。耳門、聽宮、聽會正好相反，張口時凹陷才明顯。',
    '下關 ST7 — between the middle of the lower border of the zygomatic arch and the mandibular notch. 耳門, 聽宮 and 聽會 are the other way round: their depressions show when the mouth opens.',
    ['pt_st7', 'pt_si19', 'pt_gb2', 'pt_te21'],
    ['mer_st'],
    [WORKSHEET22],
    'day_22',
  ),
  fc(
    'fc_d22_jiache',
    'point_to_attributes',
    '下頜角前上方約一橫指，咬緊牙時咬肌隆起的最高處。',
    'About a finger-breadth anterosuperior to the angle of the jaw, at the highest point of the masseter when the teeth are clenched.',
    '頰車 ST6 — 足陽明胃經。其前方、咬肌附著部前緣、面動脈搏動處是大迎 ST5。',
    '頰車 ST6 — Stomach channel. In front of it, at the anterior border of the masseter’s attachment where the facial artery pulses, is 大迎 ST5.',
    ['pt_st6', 'pt_st5'],
    ['mer_st'],
    [WORKSHEET22],
    'day_22',
  ),
  /* Day 23 — location or category on every front. */
  fc(
    'fc_d23_two_edges',
    'classification',
    '胸鎖乳突肌前緣有哪四個穴？後緣有哪三個？',
    'Which four points lie on the anterior border of the sternocleidomastoid, and which three on the posterior?',
    '前緣：扶突 LI18、人迎 ST9、水突 ST10、天容 SI17。後緣：天窗 SI16、天鼎 LI17、天牖 TE16。',
    'Anterior: 扶突 LI18, 人迎 ST9, 水突 ST10, 天容 SI17. Posterior: 天窗 SI16, 天鼎 LI17, 天牖 TE16.',
    ['pt_li18', 'pt_st9', 'pt_st10', 'pt_si17', 'pt_si16', 'pt_li17', 'pt_te16'],
    ['mer_li', 'mer_st', 'mer_si', 'mer_te'],
    [WORKSHEET23],
    'day_23',
  ),
  fc(
    'fc_d23_laryngeal_level',
    'classification',
    '橫平喉結的三個穴是哪三個？各在肌肉的哪一邊？',
    'Which three points sit level with the laryngeal prominence, and on which border of the muscle?',
    '前緣：扶突 LI18（大腸經）、人迎 ST9（胃經）；後緣：天窗 SI16（小腸經）。同一高度，隔著一條肌肉。',
    'On the anterior border, 扶突 LI18 of the Large Intestine and 人迎 ST9 of the Stomach; on the posterior, 天窗 SI16 of the Small Intestine. One height, one muscle between them.',
    ['pt_li18', 'pt_st9', 'pt_si16'],
    ['mer_li', 'mer_st', 'mer_si'],
    [WORKSHEET23],
    'day_23',
  ),
  fc(
    'fc_d23_si_codes',
    'classification',
    '天窗與天容各是哪一個穴號？SI15 是什麼穴？',
    'What are the codes for 天窗 and 天容, and what is SI15?',
    '天窗 SI16、天容 SI17。SI15 是肩中俞，在第 7 頸椎棘突下、後正中線旁開 2 寸，屬背部及臀部區，不在頸部。',
    '天窗 is SI16 and 天容 SI17. SI15 is 肩中俞, below the 7th cervical spinous process 2 cun lateral to the midline — in the back region, not the neck.',
    ['pt_si16', 'pt_si17'],
    ['mer_si'],
    [WORKSHEET23],
    'day_23',
  ),
  fc(
    'fc_d23_renying',
    'point_to_attributes',
    '橫平喉結，胸鎖乳突肌前緣，頸總動脈搏動處。',
    'Level with the laryngeal prominence, on the anterior border of the sternocleidomastoid, where the common carotid artery pulses.',
    '人迎 ST9 — 足陽明胃經。同高、同在前緣的還有大腸經的扶突 LI18。',
    '人迎 ST9 — Stomach channel. 扶突 LI18 of the Large Intestine sits at the same height on the same border.',
    ['pt_st9', 'pt_li18'],
    ['mer_st'],
    [WORKSHEET23],
    'day_23',
  ),
  fc(
    'fc_d23_qishe',
    'point_to_attributes',
    '鎖骨內側端上緣，胸鎖乳突肌的胸骨頭與鎖骨頭之間的凹陷中。',
    'At the upper border of the medial end of the clavicle, in the hollow between the sternal and clavicular heads of the sternocleidomastoid.',
    '氣舍 ST11 — 足陽明胃經。本區唯一不在前緣也不在後緣的穴，它在肌肉分叉的叉口裡。',
    '氣舍 ST11 — Stomach channel. The one point in this region on neither border: it sits in the fork where the muscle divides.',
    ['pt_st11'],
    ['mer_st'],
    [WORKSHEET23],
    'day_23',
  ),
  fc(
    'fc_d23_midline',
    'classification',
    '頸部前正中線上的兩個穴是哪兩個？各靠什麼定位？',
    'Which two points lie on the neck’s midline, and what fixes each?',
    '廉泉 CV23 在結喉上方、舌骨上緣凹陷處；天突 CV22 在胸骨上窩中央，是頸部的下界，接下去是胸部。',
    '廉泉 CV23 above the laryngeal prominence at the upper border of the hyoid; 天突 CV22 at the centre of the suprasternal fossa, the lower limit of the neck, where the chest begins.',
    ['pt_cv23', 'pt_cv22'],
    ['mer_cv'],
    [WORKSHEET23],
    'day_23',
  ),
  fc(
    'fc_d23_futu',
    'point_to_attributes',
    '頸部，胸鎖乳突肌前緣，結喉旁，橫平喉結。',
    'On the neck, on the ANTERIOR border of the sternocleidomastoid, beside and level with the laryngeal prominence.',
    '扶突 LI18 — 手陽明大腸經。它在前緣；後緣同高的是天窗 SI16。',
    '扶突 LI18 — Large Intestine channel, on the anterior border. The point at the same height on the posterior border is 天窗 SI16.',
    ['pt_li18', 'pt_si16'],
    ['mer_li'],
    [WORKSHEET23],
    'day_23',
  ),
  /* Day 24 — location or category on every front. */
  fc(
    'fc_d24_front_line',
    'classification',
    '胃經在大腿前面的四個穴，全落在哪一條線上？各在髕底上幾寸？',
    'The Stomach’s four thigh points all fall on one line — which line, and how far above the patellar base is each?',
    '髂前上棘與髕底外側端的連線上。梁丘 ST34 髕底上 2 寸（郄穴）、陰市 ST33 3 寸、伏兔 ST32 6 寸；髀關 ST31 在這條線的最上端，屈髖時平會陰。',
    'The line from the anterior superior iliac spine to the lateral end of the patellar base. 梁丘 ST34 at 2 cun above the base (its xi-cleft), 陰市 ST33 at 3, 伏兔 ST32 at 6; 髀關 ST31 at the top of the line, level with the perineum when the hip is flexed.',
    ['pt_st34', 'pt_st33', 'pt_st32', 'pt_st31'],
    ['mer_st'],
    [WORKSHEET24],
    'day_24',
  ),
  fc(
    'fc_d24_three_rulers',
    'classification',
    '大腿外側、後側、內側各以哪兩個標志為端點？各幾寸？',
    'Which two landmarks bound the lateral, posterior and medial thigh, and how long is each?',
    '外側：股骨大轉子至膕橫紋 19 寸；後側：臀橫紋至膕橫紋 14 寸；內側：恥骨聯合上緣至股骨內上髁上緣 18 寸。三個面三把尺，不可混用。',
    'Lateral: greater trochanter to popliteal crease, 19 cun. Posterior: gluteal crease to popliteal crease, 14. Medial: upper border of the pubic symphysis to upper border of the medial epicondyle, 18. Three faces, three rulers, never interchanged.',
    ['pt_gb31', 'pt_bl36', 'pt_sp10'],
    ['mer_gb', 'mer_bl', 'mer_sp'],
    [WORKSHEET24],
    'day_24',
  ),
  fc(
    'fc_d24_fengshi',
    'point_to_attributes',
    '大腿外側部的中線上，膕橫紋上 7 寸；或直立垂手時，中指尖處。',
    'On the lateral midline of the thigh, 7 cun above the popliteal crease; or where the tip of the middle finger falls when standing with the arms hanging.',
    '風市 GB31 — 足少陽膽經。往下 2 寸、膕橫紋上 5 寸是中瀆 GB32。',
    '風市 GB31 — Gallbladder channel. Two cun below it, 5 cun above the crease, is 中瀆 GB32.',
    ['pt_gb31', 'pt_gb32'],
    ['mer_gb'],
    [WORKSHEET24],
    'day_24',
  ),
  fc(
    'fc_d24_huantiao_juliao',
    'classification',
    '居髎與環跳各靠哪兩個骨性標志定位？',
    'Which two bony landmarks fix 居髎, and which fix 環跳?',
    '居髎 GB29：髂前上棘與股骨大轉子最凸點連線的中點。環跳 GB30：股骨大轉子最凸點與骶管裂孔連線的外三分之一與中三分之一交點。兩個都屬膽經。',
    '居髎 GB29 at the midpoint of the line from the anterior superior iliac spine to the most prominent part of the greater trochanter. 環跳 GB30 at the junction of the lateral and middle thirds of the line from that trochanter to the sacral hiatus. Both Gallbladder.',
    ['pt_gb29', 'pt_gb30'],
    ['mer_gb'],
    [WORKSHEET24],
    'day_24',
  ),
  fc(
    'fc_d24_xuehai',
    'point_to_attributes',
    '屈膝，髕底內側端上 2 寸，股四頭肌內側頭的隆起處。',
    'With the knee bent, 2 cun above the medial end of the patellar base, on the bulge of vastus medialis.',
    '血海 SP10 — 足太陰脾經。同一面往上，髕底內側端與衝門連線的上三分之一處是箕門 SP11。',
    '血海 SP10 — Spleen channel. Further up the same face, at the junction of the upper third of the line from that medial end to 衝門, is 箕門 SP11.',
    ['pt_sp10', 'pt_sp11'],
    ['mer_sp'],
    [WORKSHEET24],
    'day_24',
  ),
  fc(
    'fc_d24_back',
    'classification',
    '大腿後面兩個穴各怎麼定？用的是哪一把尺？',
    'How is each of the two points on the back of the thigh located, and on which ruler?',
    '承扶 BL36 在臀下橫紋的中點；殷門 BL37 在承扶與委中連線上、承扶下 6 寸。這一面用臀橫紋至膕橫紋 14 寸，不是外側那把 19 寸。',
    '承扶 BL36 at the midpoint of the gluteal crease; 殷門 BL37 on the line from it to 委中, 6 cun down. This face uses the 14-cun gluteal-to-popliteal ruler, not the lateral 19.',
    ['pt_bl36', 'pt_bl37'],
    ['mer_bl'],
    [WORKSHEET24],
    'day_24',
  ),
  fc(
    'fc_d24_liver_three',
    'classification',
    '大腿內側根部的三個肝經穴是哪三個？各怎麼定？',
    'Which three Liver points sit near the root of the medial thigh, and how is each fixed?',
    '陰廉 LR11（氣衝下 2 寸）、足五里 LR10（氣衝下 3 寸）、陰包 LR9（股骨內上髁上方 4 寸，股內側肌與縫匠肌之間）。',
    '陰廉 LR11 two cun below 氣衝, 足五里 LR10 three below it, and 陰包 LR9 four cun above the medial epicondyle of the femur, between vastus medialis and sartorius.',
    ['pt_lr11', 'pt_lr10', 'pt_lr9'],
    ['mer_lr'],
    [WORKSHEET24],
    'day_24',
  ),
  /* Day 25 — location or category on every front. */
  fc(
    'fc_d25_six_jing_well',
    'classification',
    '足部六個井穴分別是哪六個？哪一個不在趾甲角旁？',
    'Name the foot’s six jing-well points, and say which is not at a toe-nail corner.',
    '隱白 SP1（大趾內側甲角）、大敦 LR1（大趾外側甲角）、厲兌 ST45（第 2 趾）、足竅陰 GB44（第 4 趾）、至陰 BL67（小趾）——五個在甲角。湧泉 KI1 在足底，是唯一的例外。',
    '隱白 SP1 at the medial corner of the great toe, 大敦 LR1 at its lateral corner, 厲兌 ST45 on the second toe, 足竅陰 GB44 on the fourth, 至陰 BL67 on the little toe — five at nail corners. 湧泉 KI1 on the sole is the exception.',
    ['pt_sp1', 'pt_lr1', 'pt_st45', 'pt_gb44', 'pt_bl67', 'pt_ki1'],
    ['mer_sp', 'mer_lr', 'mer_st', 'mer_gb', 'mer_bl', 'mer_ki'],
    [WORKSHEET25],
    'day_25',
  ),
  fc(
    'fc_d25_six_yuan',
    'classification',
    '六條腿經的原穴各是哪一個？',
    'Name the yuan-source point of each of the six leg channels.',
    '胃沖陽 ST42、脾太白 SP3、膀胱京骨 BL64、腎太溪 KI3、膽丘墟 GB40、肝太衝 LR3。六個全在踝周與足背，一經一個。',
    'Stomach 沖陽 ST42, Spleen 太白 SP3, Bladder 京骨 BL64, Kidney 太溪 KI3, Gallbladder 丘墟 GB40, Liver 太衝 LR3 — all six around the ankle and dorsum, one per channel.',
    ['pt_st42', 'pt_sp3', 'pt_bl64', 'pt_ki3', 'pt_gb40', 'pt_lr3'],
    ['mer_st', 'mer_sp', 'mer_bl', 'mer_ki', 'mer_gb', 'mer_lr'],
    [WORKSHEET25],
    'day_25',
  ),
  fc(
    'fc_d25_achilles',
    'classification',
    '跟腱兩側各是哪一個穴？各屬哪一條經、哪一類特定穴？',
    'Which point sits on each side of the Achilles tendon, on which channel, and of which category?',
    '內側：太溪 KI3，腎經原穴（兼輸穴）。外側：崑崙 BL60，膀胱經經穴。兩個穴隔著同一條肌腱，一內一外。',
    'Medially 太溪 KI3, the Kidney’s yuan-source (and its shu-stream). Laterally 崑崙 BL60, the Bladder’s jing-river. Two points either side of one tendon.',
    ['pt_ki3', 'pt_bl60'],
    ['mer_ki', 'mer_bl'],
    [WORKSHEET25],
    'day_25',
  ),
  fc(
    'fc_d25_great_toe',
    'classification',
    '大趾上有兩個井穴，分別在哪一側、屬哪一條經？',
    'The great toe carries two jing-well points — on which side is each, and on which channel?',
    '內側甲角：隱白 SP1，脾經。外側甲角：大敦 LR1，肝經。一根腳趾、兩條經——和手上小指的少衝（心）與少澤（小腸）是同一種安排。',
    'Medial nail corner: 隱白 SP1 of the Spleen. Lateral: 大敦 LR1 of the Liver. One toe, two channels — the same arrangement as 少衝 (Heart) and 少澤 (Small Intestine) on the little finger.',
    ['pt_sp1', 'pt_lr1'],
    ['mer_sp', 'mer_lr'],
    [WORKSHEET25],
    'day_25',
  ),
  fc(
    'fc_d25_jiexi',
    'point_to_attributes',
    '足背踝關節橫紋中央，拇長伸肌腱與趾長伸肌腱之間。',
    'At the centre of the ankle crease on the dorsum, between the tendons of extensor hallucis longus and extensor digitorum longus.',
    '解溪 ST41 — 足陽明胃經，經穴。往前是沖陽 ST42（足背最高處，動脈搏動處）。',
    '解溪 ST41 — Stomach channel, its jing-river point. Forward from it is 沖陽 ST42, at the crest of the dorsum where the artery pulses.',
    ['pt_st41', 'pt_st42'],
    ['mer_st'],
    [WORKSHEET25],
    'day_25',
  ),
  fc(
    'fc_d25_yongquan',
    'point_to_attributes',
    '足底第 2、3 趾蹼緣與足跟連線的前 1/3 與後 2/3 交點處；屈趾時呈凹陷。',
    'On the sole, at the junction of the anterior third and posterior two-thirds of the line from the web between the second and third toes to the heel; a hollow appears when the toes curl.',
    '湧泉 KI1 — 足少陰腎經的井穴，六個井穴裡唯一不在趾甲角旁的。',
    '湧泉 KI1 — the Kidney channel’s jing-well, and the only one of the six not at a toe-nail corner.',
    ['pt_ki1'],
    ['mer_ki'],
    [WORKSHEET25],
    'day_25',
  ),
  fc(
    'fc_d25_three_lines',
    'classification',
    '足背三條經線各朝哪一組腳趾？各有哪些穴？',
    'Which toes does each of the dorsum’s three lines aim at, and which points lie on it?',
    '胃經朝第 2、3 趾：解溪 → 沖陽 → 陷谷 → 內庭 → 厲兌。膽經朝第 4、5 趾：丘墟 → 足臨泣 → 足竅陰。肝經走第 1、2 蹠骨之間：太衝 → 行間 → 大敦。',
    'The Stomach toward the second and third toes: 解溪 → 沖陽 → 陷谷 → 內庭 → 厲兌. The Gallbladder toward the fourth and fifth: 丘墟 → 足臨泣 → 足竅陰. The Liver between the first and second metatarsals: 太衝 → 行間 → 大敦.',
    ['pt_st43', 'pt_st44', 'pt_gb41', 'pt_lr2', 'pt_lr3'],
    ['mer_st', 'mer_gb', 'mer_lr'],
    [WORKSHEET25],
    'day_25',
  ),
  /* Day 26 — the twelve back-shu points, the three lines, and the pairing. */
  fc(
    'fc_d26_three_lines',
    'classification',
    '背部三條縱線各旁開幾寸？各屬哪一條經？例外是哪兩個穴？',
    'How far lateral is each of the back’s three vertical lines, on which channel, and which two points are the exceptions?',
    '督脈在後正中線上（0 寸）；膀胱經第一側線旁開 1.5 寸；第二側線旁開 3 寸。例外是小腸經的兩站：肩中俞 SI15 在第 7 頸椎棘突下旁開 2 寸，肩外俞 SI14 在第 1 胸椎棘突下旁開 3 寸。',
    'The Governing vessel on the posterior midline at 0; the Bladder’s first line 1.5 cun lateral and its second 3 cun. The exceptions are the Small Intestine’s two stations: 肩中俞 SI15 at 2 cun below the C7 spinous process, and 肩外俞 SI14 at 3 cun below T1.',
    ['pt_gv12', 'pt_bl23', 'pt_bl52', 'pt_si15', 'pt_si14'],
    ['mer_gv', 'mer_bl', 'mer_si'],
    [WORKSHEET26],
    'day_26',
  ),
  fc(
    'fc_d26_twelve_shu',
    'classification',
    '十二個背俞穴各在第幾椎棘突下？旁開幾寸？',
    'Below which spinous process does each of the twelve back-shu points sit, and how far out?',
    '全部旁開 1.5 寸，只差椎數：肺俞 BL13 T3、厥陰俞 BL14 T4、心俞 BL15 T5、肝俞 BL18 T9、膽俞 BL19 T10、脾俞 BL20 T11、胃俞 BL21 T12、三焦俞 BL22 L1、腎俞 BL23 L2、大腸俞 BL25 L4、小腸俞 BL27 平第 1 骶後孔、膀胱俞 BL28 平第 2 骶後孔。',
    'All of them 1.5 cun lateral; only the vertebra changes. 肺俞 BL13 at T3, 厥陰俞 BL14 at T4, 心俞 BL15 at T5, 肝俞 BL18 at T9, 膽俞 BL19 at T10, 脾俞 BL20 at T11, 胃俞 BL21 at T12, 三焦俞 BL22 at L1, 腎俞 BL23 at L2, 大腸俞 BL25 at L4, 小腸俞 BL27 level with the first posterior sacral foramen, 膀胱俞 BL28 with the second.',
    ['pt_bl13', 'pt_bl14', 'pt_bl15', 'pt_bl18', 'pt_bl19', 'pt_bl20', 'pt_bl21', 'pt_bl22', 'pt_bl23', 'pt_bl25', 'pt_bl27', 'pt_bl28'],
    ['mer_bl'],
    [WORKSHEET26],
    'day_26',
  ),
  fc(
    'fc_d26_shu_mu_pairs',
    'classification',
    '肺俞、心俞、肝俞、脾俞、腎俞在身體前面各配哪一個募穴？各在哪一區？',
    'Which front-mu point pairs with each of 肺俞, 心俞, 肝俞, 脾俞 and 腎俞 — and in which region does each partner sit?',
    '肺俞 BL13 ↔ 中府 LU1（胸部）、心俞 BL15 ↔ 巨闕 CV14（腹部）、肝俞 BL18 ↔ 期門 LR14（胸部）、脾俞 BL20 ↔ 章門 LR13（身側）、腎俞 BL23 ↔ 京門 GB25（身側）。俞在後、募在前，是同一個臟的兩個記號。',
    '肺俞 BL13 with 中府 LU1 on the chest, 心俞 BL15 with 巨闕 CV14 on the abdomen, 肝俞 BL18 with 期門 LR14 on the chest, 脾俞 BL20 with 章門 LR13 on the flank, 腎俞 BL23 with 京門 GB25 on the flank. Shu behind, mu in front — two marks for one organ.',
    ['pt_bl13', 'pt_lu1', 'pt_bl15', 'pt_cv14', 'pt_bl18', 'pt_lr14', 'pt_bl20', 'pt_lr13', 'pt_bl23', 'pt_gb25'],
    ['mer_bl', 'mer_lu', 'mer_cv', 'mer_lr', 'mer_gb'],
    [WORKSHEET26],
    'day_26',
  ),
  fc(
    'fc_d26_heights',
    'classification',
    '背部四個好摸的高度各約平什麼骨性標志？其下各是哪一個督脈穴？',
    'What is each of the back’s four easily found heights about level with, and which Governing-vessel point sits below it?',
    'T3 約當兩肩胛岡最高點的連線——身柱 GV12；T7 約平兩肩胛骨下角連線的中點——至陽 GV9；L2 約與肚臍正對後背——命門 GV4；L4 約平兩髂嵴最高點的連線——腰陽關 GV3。數的起點是低頭時最突出的 C7，其下 T1 是陶道 GV13。',
    'T3 at about the line between the highest points of the scapular spines — 身柱 GV12; T7 about level with the midpoint between the inferior angles of the scapulae — 至陽 GV9; L2 about opposite the navel — 命門 GV4; L4 about level with the line between the iliac crests — 腰陽關 GV3. The count starts at C7, most prominent when the head bows, with 陶道 GV13 below T1.',
    ['pt_gv12', 'pt_gv9', 'pt_gv4', 'pt_gv3', 'pt_gv13'],
    ['mer_gv'],
    [WORKSHEET26],
    'day_26',
  ),
  fc(
    'fc_d26_l2_row',
    'point_to_attributes',
    '第 2 腰椎棘突下這一個高度上，正中、1.5 寸、3 寸各是哪一個穴？',
    'At the height below the second lumbar spinous process, which point sits on the midline, at 1.5 cun and at 3 cun?',
    '命門 GV4（督脈，正中）、腎俞 BL23（膀胱經第一側線，背俞穴）、志室 BL52（第二側線）。同一個高度、三條線、三個穴——整個背部都是這個結構。',
    '命門 GV4 on the Governing vessel at the midline, 腎俞 BL23 on the Bladder’s first line (a back-shu point), and 志室 BL52 on its second. One height, three lines, three points — and the whole back is built that way.',
    ['pt_gv4', 'pt_bl23', 'pt_bl52'],
    ['mer_gv', 'mer_bl'],
    [WORKSHEET26],
    'day_26',
  ),
  fc(
    'fc_d26_baliao',
    'point_to_attributes',
    '骶部四對骶後孔中，由上而下是哪四個穴？本資料集收幾筆記錄？',
    'Which four points sit in the four pairs of posterior sacral foramina, from the top — and how many records does this dataset hold for them?',
    '上髎 BL31（第 1 骶後孔）、次髎 BL32（第 2）、中髎 BL33（第 3）、下髎 BL34（第 4），合稱八髎。本資料集的雙側穴各收一筆記錄，所以是四筆，每一筆代表左右一對。',
    '上髎 BL31 at the first, 次髎 BL32 at the second, 中髎 BL33 at the third and 下髎 BL34 at the fourth — together the 八髎. This dataset stores each bilateral point once, so they are four records, each standing for a left-and-right pair.',
    ['pt_bl31', 'pt_bl32', 'pt_bl33', 'pt_bl34'],
    ['mer_bl'],
    [WORKSHEET26],
    'day_26',
  ),
  fc(
    'fc_d26_boundaries',
    'classification',
    '背部及臀部這一區走哪三條經？上下界各止於哪一個穴？',
    'Which three channels does the back and gluteal region carry, and at which point does it stop at each end?',
    '膀胱 BL（39）、督脈 GV（13）、小腸 SI（2）——沒有膽經。督脈上起第 1 胸椎下的陶道 GV13（大椎 GV14 在頭部），下止尾骨下方的長強 GV1；臀橫紋上的承扶 BL36 與環跳 GB30 都屬髖胯及大腿。',
    'Bladder (39 points), Governing vessel (13) and Small Intestine (2) — no Gallbladder at all. The Governing vessel starts at 陶道 GV13 below T1 (大椎 GV14 is in the head) and ends at 長強 GV1 beneath the coccyx; 承扶 BL36 at the gluteal crease and 環跳 GB30 both belong to hip and thigh.',
    ['pt_gv13', 'pt_gv1', 'pt_si14', 'pt_si15'],
    ['mer_bl', 'mer_gv', 'mer_si'],
    [WORKSHEET26],
    'day_26',
  ),
];

/* ------------------------------------------------------------------------- */

export const quizItems: QuizItem[] = [
  {
    id: 'qz_hegu_meridian',
    dayId: 'day_1',
    kind: 'multiple_choice',
    promptZhHant: '合谷屬於哪一條經？',
    promptEn: 'Which meridian does 合谷 (LI4) belong to?',
    options: [
      { id: 'a', zhHant: '手太陰肺經', en: 'Lung (Hand Taiyin)' },
      { id: 'b', zhHant: '手陽明大腸經', en: 'Large Intestine (Hand Yangming)' },
      { id: 'c', zhHant: '足陽明胃經', en: 'Stomach (Foot Yangming)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_li4',
    explanationZhHant:
      '合谷是大腸經第 4 穴，位於手背虎口。大腸經走手臂外側前緣，從食指到鼻翼旁。',
    explanationEn:
      '合谷 is the 4th point of the Large Intestine meridian, in the web of the thumb. That channel runs along the outer-front arm from index finger to nose.',
    relatedAcupointIds: ['pt_li4'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_taiyuan_class',
    dayId: 'day_1',
    kind: 'multiple_choice',
    promptZhHant: '太淵在八會穴中屬於哪一會？',
    promptEn: 'Among the Eight Influential Points, 太淵 (LU9) is the influential point of what?',
    options: [
      { id: 'a', zhHant: '氣會', en: 'Qi' },
      { id: 'b', zhHant: '血會', en: 'Blood' },
      { id: 'c', zhHant: '脈會', en: 'The vessels' },
    ],
    correctOptionId: 'c',
    targetAcupointId: 'pt_lu9',
    explanationZhHant: '太淵是脈會，同時也是肺經的原穴與輸穴，位於腕橫紋一帶。',
    explanationEn:
      '太淵 is the influential point of the vessels, and is also the yuan-source and shu-stream point of the Lung meridian.',
    relatedAcupointIds: ['pt_lu9'],
    sourceIds: [HANDBOOK],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_lu_terminus',
    dayId: 'day_1',
    kind: 'multiple_choice',
    promptZhHant: '手太陰肺經的終點是哪一穴？',
    promptEn: 'Which point is the terminus of the Lung meridian?',
    options: [
      { id: 'a', zhHant: '少商', en: '少商 (LU11)' },
      { id: 'b', zhHant: '商陽', en: '商陽 (LI1)' },
      { id: 'c', zhHant: '中府', en: '中府 (LU1)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lu11',
    explanationZhHant:
      '肺經起於中府（胸部），止於少商（拇指橈側）。商陽是大腸經的起點，容易混淆，兩者相鄰但分屬不同經。',
    explanationEn:
      'The Lung meridian starts at 中府 on the chest and ends at 少商 on the thumb. 商陽 is the *start* of the Large Intestine meridian — a common confusion, since the two sit on neighbouring digits.',
    relatedAcupointIds: ['pt_lu11', 'pt_li1', 'pt_lu1'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_arm_border',
    dayId: 'day_1',
    kind: 'multiple_choice',
    promptZhHant: '肺經走在手臂的哪一側？',
    promptEn: 'Which border of the arm does the Lung meridian follow?',
    options: [
      { id: 'a', zhHant: '外側前緣', en: 'Anterior-lateral (outer-front)' },
      { id: 'b', zhHant: '內側前緣', en: 'Anterior-medial (inner-front)' },
      { id: 'c', zhHant: '內側後緣', en: 'Posterior-medial (inner-back)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: null,
    explanationZhHant:
      '肺經（陰經）走內側前緣；其表裡經大腸經（陽經）走外側前緣。陰經走內、陽經走外，是十二經的通則。',
    explanationEn:
      'Lung is a yin channel and follows the inner-front border; its paired yang channel, Large Intestine, follows the outer-front border. Yin inside, yang outside is the general rule.',
    relatedAcupointIds: [],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_quchi_class',
    dayId: 'day_1',
    kind: 'multiple_choice',
    promptZhHant: '曲池是大腸經的什麼穴？',
    promptEn: 'What kind of point is 曲池 (LI11) on the Large Intestine meridian?',
    options: [
      { id: 'a', zhHant: '井穴', en: 'Jing-well' },
      { id: 'b', zhHant: '原穴', en: 'Yuan-source' },
      { id: 'c', zhHant: '合穴', en: 'He-sea' },
    ],
    correctOptionId: 'c',
    targetAcupointId: 'pt_li11',
    explanationZhHant: '曲池是大腸經合穴，位於肘部。大腸經的原穴是合谷，井穴是商陽。',
    explanationEn:
      '曲池 is the he-sea point, at the elbow. The yuan-source point of this meridian is 合谷, and its jing-well point is 商陽.',
    relatedAcupointIds: ['pt_li11', 'pt_li4', 'pt_li1'],
    sourceIds: [HANDBOOK],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_locate_hegu',
    dayId: 'day_1',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：合谷',
    promptEn: 'Tap 合谷 (LI4) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_li4',
    explanationZhHant: '合谷在手背虎口的肌肉縫隙處，是大腸經第 4 穴。',
    explanationEn: '合谷 sits in the muscular web between the thumb and index finger — LI4.',
    relatedAcupointIds: ['pt_li4'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_locate_chize',
    dayId: 'day_1',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：尺澤',
    promptEn: 'Tap 尺澤 (LU5) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_lu5',
    explanationZhHant: '尺澤在肘窩橫紋中點附近的凹陷處，是肺經的合穴。',
    explanationEn: '尺澤 sits in the hollow near the midpoint of the elbow crease — the he-sea point of the Lung meridian.',
    relatedAcupointIds: ['pt_lu5'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_locate_yingxiang',
    dayId: 'day_1',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：迎香',
    promptEn: 'Tap 迎香 (LI20) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_li20',
    explanationZhHant: '迎香在鼻翼旁的鼻唇溝中，是大腸經的終點。',
    explanationEn: '迎香 sits in the nasolabial groove beside the nose — the terminus of the Large Intestine meridian.',
    relatedAcupointIds: ['pt_li20'],
    sourceIds: [OUTLINE],
    reviewStatus: 'unreviewed',
  },

  /* -------------------------------- Day 2 --------------------------------- */
  {
    id: 'qz_zusanli_location',
    dayId: 'day_2',
    kind: 'multiple_choice',
    promptZhHant: '足三里的定位描述是哪一個？',
    promptEn: 'Which is the location description of 足三里 (ST36)?',
    options: [
      { id: 'a', zhHant: '犢鼻下 3 寸，脛骨前緣外一橫指', en: '3 cun below 犢鼻, one finger-breadth lateral to the tibia' },
      { id: 'b', zhHant: '內踝尖上 3 寸', en: '3 cun above the medial malleolus' },
      { id: 'c', zhHant: '肚臍旁開 2 寸', en: '2 cun lateral to the umbilicus' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_st36',
    explanationZhHant:
      '足三里在犢鼻（外膝眼）下 3 寸、脛骨前緣外一橫指。「內踝上 3 寸」是別條經的地標，「臍旁開 2 寸」是天樞。',
    explanationEn:
      '足三里 sits 3 cun below 犢鼻 (ST35), one finger-breadth lateral to the anterior tibial border. "2 cun beside the navel" is 天樞 (ST25).',
    relatedAcupointIds: ['pt_st36', 'pt_st25', 'pt_st35'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_tianshu_mu',
    dayId: 'day_2',
    kind: 'multiple_choice',
    promptZhHant: '天樞是哪一個臟腑的募穴？',
    promptEn: 'For which organ is 天樞 (ST25) the front-mu point?',
    options: [
      { id: 'a', zhHant: '胃', en: 'Stomach' },
      { id: 'b', zhHant: '大腸', en: 'Large Intestine' },
      { id: 'c', zhHant: '肺', en: 'Lung' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_st25',
    explanationZhHant: '天樞是大腸募穴 — 位於胃經上，卻是大腸的「情報站」。這是課程給的分類，尚未經審核。',
    explanationEn:
      '天樞 is the front-mu point of the Large Intestine — it lies on the Stomach channel but is categorised for the Large Intestine. As with all Day 2 content, this is the curriculum\'s claim and is still unreviewed.',
    relatedAcupointIds: ['pt_st25'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_st_lateral',
    dayId: 'day_2',
    kind: 'multiple_choice',
    promptZhHant: '依路線口訣，胃經在腹部走中線旁開幾寸？',
    promptEn: 'Per the route rhyme, how far from the midline does the Stomach channel run on the abdomen?',
    options: [
      { id: 'a', zhHant: '旁開 4 寸', en: '4 cun lateral' },
      { id: 'b', zhHant: '旁開 2 寸', en: '2 cun lateral' },
      { id: 'c', zhHant: '正中線上', en: 'On the midline' },
    ],
    correctOptionId: 'b',
    targetAcupointId: null,
    explanationZhHant: '口訣是「臉部繞行胸四寸，腹部旁開二寸行」：胸部旁開 4 寸，到腹部收窄為旁開 2 寸。',
    explanationEn: 'The rhyme runs chest at 4 cun, abdomen at 2 cun — the line steps inward as it descends the trunk.',
    relatedAcupointIds: ['pt_st25'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_st_terminus',
    dayId: 'day_2',
    kind: 'multiple_choice',
    promptZhHant: '胃經的終點是哪一個穴？',
    promptEn: 'Which point is the terminus of the Stomach meridian?',
    options: [
      { id: 'a', zhHant: '內庭', en: '內庭 (ST44)' },
      { id: 'b', zhHant: '厲兌', en: '厲兌 (ST45)' },
      { id: 'c', zhHant: '解溪', en: '解溪 (ST41)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_st45',
    explanationZhHant: '厲兌（ST45）在足第二趾末端，是 45 穴的終點站。內庭是倒數第二站。',
    explanationEn: '厲兌 (ST45) at the tip of the second toe is station 45 of 45. 內庭 (ST44) is the second-to-last stop.',
    relatedAcupointIds: ['pt_st45', 'pt_st44'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_locate_zusanli',
    dayId: 'day_2',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：足三里',
    promptEn: 'Tap 足三里 (ST36) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_st36',
    explanationZhHant: '足三里在小腿前外側上段，犢鼻下 3 寸 — 胃經第 36 穴。',
    explanationEn: '足三里 sits on the upper antero-lateral lower leg, 3 cun below the knee — ST36.',
    relatedAcupointIds: ['pt_st36'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_locate_tianshu',
    dayId: 'day_2',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：天樞',
    promptEn: 'Tap 天樞 (ST25) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_st25',
    explanationZhHant: '天樞在腹部，肚臍旁開 2 寸 — 胃經第 25 穴。',
    explanationEn: '天樞 sits on the abdomen, 2 cun beside the navel — ST25.',
    relatedAcupointIds: ['pt_st25'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  /* -------------------------------- Day 3 --------------------------------- */
  {
    id: 'qz_sanyinjiao_meaning',
    dayId: 'day_3',
    kind: 'multiple_choice',
    promptZhHant: '「三陰交」的「三陰」指的是哪三條經？',
    promptEn: 'Which three channels meet at 三陰交 (SP6)?',
    options: [
      { id: 'a', zhHant: '脾、腎、肝', en: 'Spleen, Kidney, Liver' },
      { id: 'b', zhHant: '肺、心、心包', en: 'Lung, Heart, Pericardium' },
      { id: 'c', zhHant: '胃、膽、膀胱', en: 'Stomach, Gallbladder, Bladder' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_sp6',
    explanationZhHant: '三陰交是足太陰脾經、足少陰腎經、足厥陰肝經三條足陰經的交會穴，位於內踝尖上 3 寸。',
    explanationEn:
      '三陰交 is the meeting point of the three foot yin channels — Spleen, Kidney and Liver — 3 cun above the tip of the medial malleolus.',
    relatedAcupointIds: ['pt_sp6'],
    sourceIds: [WORKSHEET3],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_ht_wrist_ladder',
    dayId: 'day_3',
    kind: 'multiple_choice',
    promptZhHant: '心經腕上三穴由遠而近（1.5 寸 → 0.5 寸）的順序是？',
    promptEn: 'Order the three Heart points above the wrist crease from 1.5 cun down to 0.5 cun.',
    options: [
      { id: 'a', zhHant: '靈道 → 通里 → 陰郄', en: '靈道 → 通里 → 陰郄' },
      { id: 'b', zhHant: '通里 → 陰郄 → 靈道', en: '通里 → 陰郄 → 靈道' },
      { id: 'c', zhHant: '陰郄 → 靈道 → 通里', en: '陰郄 → 靈道 → 通里' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ht4',
    explanationZhHant: '靈道在腕橫紋上 1.5 寸、通里 1 寸、陰郄 0.5 寸，三穴依序越來越靠近神門。',
    explanationEn: '靈道 sits 1.5 cun above the crease, 通里 at 1 cun and 陰郄 at 0.5 cun — each closer to 神門.',
    relatedAcupointIds: ['pt_ht4', 'pt_ht5', 'pt_ht6', 'pt_ht7'],
    sourceIds: [WORKSHEET3],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_sp_pair',
    dayId: 'day_3',
    kind: 'multiple_choice',
    promptZhHant: '足太陰脾經與哪一條經互為表裡？',
    promptEn: 'The Spleen meridian forms an interior–exterior pair with which channel?',
    options: [
      { id: 'a', zhHant: '足陽明胃經', en: 'Stomach (Foot Yangming)' },
      { id: 'b', zhHant: '手太陰肺經', en: 'Lung (Hand Taiyin)' },
      { id: 'c', zhHant: '足少陰腎經', en: 'Kidney (Foot Shaoyin)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: null,
    explanationZhHant: '脾與胃相表裡，同屬土；脾經走下肢內側，胃經走下肢前外側。',
    explanationEn:
      'Spleen and Stomach are the earth pair: the Spleen channel runs the medial leg, the Stomach channel the antero-lateral leg.',
    relatedAcupointIds: [],
    sourceIds: [WORKSHEET3],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_ht_terminus',
    dayId: 'day_3',
    kind: 'multiple_choice',
    promptZhHant: '手少陰心經的終點是哪一個穴？',
    promptEn: 'Which point is the terminus of the Heart meridian?',
    options: [
      { id: 'a', zhHant: '神門', en: '神門 (HT7)' },
      { id: 'b', zhHant: '少沖', en: '少沖 (HT9)' },
      { id: 'c', zhHant: '少府', en: '少府 (HT8)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_ht9',
    explanationZhHant: '少沖在小指末節橈側，是心經井穴，也是體表穴序的末穴。',
    explanationEn: '少沖 (HT9), on the radial side of the little finger, is the channel’s jing-well point and final station.',
    relatedAcupointIds: ['pt_ht9', 'pt_ht7'],
    sourceIds: [WORKSHEET3],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_sanyinjiao',
    dayId: 'day_3',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：三陰交',
    promptEn: 'Tap 三陰交 (SP6) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_sp6',
    explanationZhHant: '三陰交在小腿內側，內踝尖上 3 寸、脛骨內側緣後方。',
    explanationEn: '三陰交 sits on the medial lower leg, 3 cun above the inner ankle bone, behind the tibial border.',
    relatedAcupointIds: ['pt_sp6'],
    sourceIds: [WORKSHEET3],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_shenmen',
    dayId: 'day_3',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：神門',
    promptEn: 'Tap 神門 (HT7) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_ht7',
    explanationZhHant: '神門在腕掌側橫紋的尺側端（小指側）。',
    explanationEn: '神門 sits at the ulnar (little-finger) end of the palmar wrist crease.',
    relatedAcupointIds: ['pt_ht7'],
    sourceIds: [WORKSHEET3],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_backshu_line',
    dayId: 'day_4',
    kind: 'multiple_choice',
    promptZhHant: '背俞穴（肺俞、心俞、腎俞…）位於棘突下旁開幾寸？',
    promptEn: 'How far lateral to the spinous processes do the back-shu points sit?',
    options: [
      { id: 'a', zhHant: '旁開 0.5 寸', en: '0.5 cun lateral' },
      { id: 'b', zhHant: '旁開 1.5 寸', en: '1.5 cun lateral' },
      { id: 'c', zhHant: '旁開 3 寸', en: '3 cun lateral' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_bl13',
    explanationZhHant: '背俞穴全部落在第一側線，即棘突下旁開 1.5 寸；旁開 3 寸是第二側線（膏肓、志室等）。',
    explanationEn:
      'Every back-shu point sits on the first line, 1.5 cun lateral. The 3-cun line is the second one, carrying 膏肓, 志室 and their neighbours.',
    relatedAcupointIds: ['pt_bl13', 'pt_bl23', 'pt_bl43'],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_feishu_level',
    dayId: 'day_4',
    kind: 'multiple_choice',
    promptZhHant: '肺俞在第幾胸椎棘突下旁開 1.5 寸？',
    promptEn: 'Below which thoracic vertebra does 肺俞 (BL13) sit?',
    options: [
      { id: 'a', zhHant: '第 3 胸椎（T3）', en: 'T3' },
      { id: 'b', zhHant: '第 5 胸椎（T5）', en: 'T5' },
      { id: 'c', zhHant: '第 7 胸椎（T7）', en: 'T7' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_bl13',
    explanationZhHant: '肺俞 T3、心俞 T5、膈俞 T7 —— 由上而下每隔兩節椎骨一個地標。',
    explanationEn: '肺俞 at T3, 心俞 at T5, 膈俞 at T7 — a landmark every two vertebrae going down.',
    relatedAcupointIds: ['pt_bl13', 'pt_bl15', 'pt_bl17'],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_navel_level',
    dayId: 'day_4',
    kind: 'multiple_choice',
    promptZhHant: '肚臍約平對第幾腰椎，也就是哪一個背俞穴的高度？',
    promptEn:
      'The navel is roughly level with which lumbar vertebra — and therefore which back-shu point?',
    options: [
      { id: 'a', zhHant: '第 2 腰椎，腎俞', en: 'L2, the level of 腎俞 (BL23)' },
      { id: 'b', zhHant: '第 4 腰椎，大腸俞', en: 'L4, the level of 大腸俞 (BL25)' },
      { id: 'c', zhHant: '第 12 胸椎，胃俞', en: 'T12, the level of 胃俞 (BL21)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_bl23',
    /*
     * 「約」 matters here. This is the only graded item that asks a
     * navel-to-vertebra correspondence as a fact, and the atlas's vertebral
     * ladder is now measured rather than pinned to the navel, so the drawn
     * navel falls a little under half a vertebra below the L2 line. The
     * reviewed answer is unchanged — the correspondence is a palpation cue,
     * not a fixed measurement — but the wording no longer claims more
     * precision than either the body or the figure has.
     */
    explanationZhHant:
      '肚臍約平第 2 腰椎，是腎俞的高度；髂嵴最高點約平第 4 腰椎，是大腸俞的高度。兩者都是概略的體表對應，因人而異——圖上肚臍就落在第 2 腰椎線稍下方。摸得準的是棘突本身，體表標志只用來快速找到大概高度。',
    explanationEn:
      'The navel is roughly level with L2, the height of 腎俞; the top of the iliac crest roughly level with L4, the height of 大腸俞. Both are approximate surface correspondences and vary between people — on the atlas the navel falls a little below the L2 line. What is counted accurately is the spinous processes themselves; the surface landmark only gets you to about the right height.',
    relatedAcupointIds: ['pt_bl23', 'pt_bl25'],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_bl_terminus',
    dayId: 'day_4',
    kind: 'multiple_choice',
    promptZhHant: '足太陽膀胱經的終點是哪一個穴？',
    promptEn: 'Which point is the terminus of the Bladder meridian?',
    options: [
      { id: 'a', zhHant: '崑崙', en: '崑崙 (BL60)' },
      { id: 'b', zhHant: '至陰', en: '至陰 (BL67)' },
      { id: 'c', zhHant: '委中', en: '委中 (BL40)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_bl67',
    explanationZhHant: '至陰（BL67）在足小趾末節外側，是 67 穴的終點站，也是膀胱經井穴。',
    explanationEn:
      '至陰 (BL67), on the lateral side of the little toe, is station 67 of 67 and the channel’s jing-well point.',
    relatedAcupointIds: ['pt_bl67', 'pt_bl60'],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_si_pair',
    dayId: 'day_4',
    kind: 'multiple_choice',
    promptZhHant: '手太陽小腸經與哪一條經互為表裡？',
    promptEn: 'The Small Intestine meridian forms an interior–exterior pair with which channel?',
    options: [
      { id: 'a', zhHant: '手少陰心經', en: 'Heart (Hand Shaoyin)' },
      { id: 'b', zhHant: '手太陰肺經', en: 'Lung (Hand Taiyin)' },
      { id: 'c', zhHant: '足太陽膀胱經', en: 'Bladder (Foot Taiyang)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: null,
    explanationZhHant: '心與小腸相表裡，同屬火；心經走上肢內側後緣，小腸經走上肢外側後緣。',
    explanationEn:
      'Heart and Small Intestine are the fire pair: the Heart channel runs the postero-medial arm, the Small Intestine channel the postero-lateral arm.',
    relatedAcupointIds: [],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_feishu',
    dayId: 'day_4',
    kind: 'locate_point',
    promptZhHant: '在背面圖上點出：肺俞',
    promptEn: 'Tap 肺俞 (BL13) on the Back view',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_bl13',
    explanationZhHant: '肺俞在背部，第 3 胸椎棘突下、後正中線旁開 1.5 寸。',
    explanationEn: '肺俞 sits on the back, below the spinous process of T3, 1.5 cun lateral to the midline.',
    relatedAcupointIds: ['pt_bl13'],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_weizhong',
    dayId: 'day_4',
    kind: 'locate_point',
    promptZhHant: '在背面圖上點出：委中',
    promptEn: 'Tap 委中 (BL40) on the Back view',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_bl40',
    explanationZhHant: '委中在膝後區，膕橫紋的中點。',
    explanationEn: '委中 sits behind the knee, at the midpoint of the popliteal crease.',
    relatedAcupointIds: ['pt_bl40'],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_houxi',
    dayId: 'day_4',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：後溪',
    promptEn: 'Tap 後溪 (SI3) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_si3',
    explanationZhHant: '後溪在手掌尺側，第 5 掌指關節近端的赤白肉際凹陷中。',
    explanationEn:
      '後溪 sits on the ulnar side of the hand, proximal to the fifth knuckle at the border between palm and back of the hand.',
    relatedAcupointIds: ['pt_si3'],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_weizhong_landmark',
    dayId: 'day_5',
    kind: 'multiple_choice',
    promptZhHant: '委中位於下列哪一個地標？',
    promptEn: 'Which landmark does 委中 (BL40) sit on?',
    options: [
      { id: 'a', zhHant: '膕橫紋中點', en: 'The midpoint of the popliteal crease' },
      { id: 'b', zhHant: '膕橫紋外側端', en: 'The lateral end of the popliteal crease' },
      { id: 'c', zhHant: '膕橫紋下 2 寸', en: '2 cun below the popliteal crease' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_bl40',
    explanationZhHant:
      '委中在膕橫紋的中點，股二頭肌腱與半腱肌腱之間。外側端是委陽（BL39），下 2 寸是合陽（BL55）。',
    explanationEn:
      '委中 sits at the midpoint of the popliteal crease, between the two hamstring tendons. The lateral end is 委陽 BL39, and 2 cun below is 合陽 BL55.',
    relatedAcupointIds: ['pt_bl40', 'pt_bl39', 'pt_bl55'],
    sourceIds: [OUTLINE, WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_bl_leg_cun',
    dayId: 'day_5',
    kind: 'multiple_choice',
    promptZhHant: '承山在委中下幾寸？',
    promptEn: 'How far below 委中 does 承山 (BL57) sit?',
    options: [
      { id: 'a', zhHant: '下 5 寸', en: '5 cun' },
      { id: 'b', zhHant: '下 8 寸', en: '8 cun' },
      { id: 'c', zhHant: '下 12 寸', en: '12 cun' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_bl57',
    explanationZhHant:
      '膕橫紋至外踝尖共 16 寸：合陽下 2 寸、承筋下 5 寸、承山下 8 寸，正好是這一段的中點。',
    explanationEn:
      'The popliteal crease to the malleolus tip is 16 cun: 合陽 at 2, 承筋 at 5, 承山 at 8 — exactly halfway down the segment.',
    relatedAcupointIds: ['pt_bl55', 'pt_bl56', 'pt_bl57'],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_four_command_back',
    dayId: 'day_5',
    kind: 'multiple_choice',
    promptZhHant: '四總穴歌「腰背委中求」指的是哪一經的穴位？',
    promptEn: 'The song line 「腰背委中求」 names a point on which channel?',
    options: [
      { id: 'a', zhHant: '足太陽膀胱經', en: 'Bladder (Foot Taiyang)' },
      { id: 'b', zhHant: '足少陰腎經', en: 'Kidney (Foot Shaoyin)' },
      { id: 'c', zhHant: '足陽明胃經', en: 'Stomach (Foot Yangming)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_bl40',
    explanationZhHant:
      '委中是膀胱經第 40 穴。四總穴歌的四句分屬胃經（足三里）、膀胱經（委中）、肺經（列缺）、大腸經（合谷）。',
    explanationEn:
      '委中 is the 40th point of the Bladder channel. The song\'s four lines belong to the Stomach (足三里), Bladder (委中), Lung (列缺) and Large Intestine (合谷) channels.',
    relatedAcupointIds: ['pt_bl40', 'pt_st36', 'pt_lu7', 'pt_li4'],
    sourceIds: [OUTLINE, HANDBOOK],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_chengshan',
    dayId: 'day_5',
    kind: 'locate_point',
    promptZhHant: '在背面圖上點出：承山',
    promptEn: 'Tap 承山 (BL57) on the Back view',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_bl57',
    explanationZhHant: '承山在小腿後面正中，委中與崑崙之間，腓腸肌兩肌腹下端的人字尖角凹陷處。',
    explanationEn:
      '承山 sits on the midline at the back of the calf, between 委中 and 崑崙, in the hollow where the two heads of the calf muscle part.',
    relatedAcupointIds: ['pt_bl57'],
    sourceIds: [OUTLINE, WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_kunlun',
    dayId: 'day_5',
    kind: 'locate_point',
    promptZhHant: '在背面圖上點出：崑崙',
    promptEn: 'Tap 崑崙 (BL60) on the Back view',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_bl60',
    explanationZhHant: '崑崙在踝區，外踝尖與跟腱之間的凹陷中。',
    explanationEn:
      '崑崙 sits in the depression between the tip of the lateral malleolus and the Achilles tendon.',
    relatedAcupointIds: ['pt_bl60'],
    sourceIds: [WORKSHEET4],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_ki_lateral',
    dayId: 'day_6',
    kind: 'multiple_choice',
    promptZhHant: '腎經腹部各穴距前正中線多少寸？',
    promptEn: 'How far from the anterior midline do the abdominal Kidney points sit?',
    options: [
      { id: 'a', zhHant: '旁開 0.5 寸', en: '0.5 cun' },
      { id: 'b', zhHant: '旁開 2 寸', en: '2 cun' },
      { id: 'c', zhHant: '旁開 4 寸', en: '4 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ki16',
    explanationZhHant:
      '腎經腹部十一穴一律旁開 0.5 寸，是三條腹部線中最靠近正中線的。旁開 2 寸是胃經（天樞），4 寸是脾經（大橫）。',
    explanationEn:
      'All eleven abdominal Kidney points sit 0.5 cun lateral — the innermost of the three abdominal lines. 2 cun is the Stomach line (天樞), 4 cun the Spleen line (大橫).',
    relatedAcupointIds: ['pt_ki16', 'pt_st25', 'pt_sp15'],
    sourceIds: [WORKSHEET6],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_zhaohai_position',
    dayId: 'day_6',
    kind: 'multiple_choice',
    promptZhHant: '照海位於內踝尖的哪個方向？',
    promptEn: 'Where does 照海 (KI6) sit relative to the tip of the medial malleolus?',
    options: [
      { id: 'a', zhHant: '正下方凹陷處', en: 'In the depression directly below it' },
      { id: 'b', zhHant: '後方與跟腱之間', en: 'Behind it, between it and the Achilles tendon' },
      { id: 'c', zhHant: '前下方凹陷處', en: 'In the depression antero-inferior to it' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ki6',
    explanationZhHant:
      '照海在內踝尖「下方」。後方與跟腱之間的是太溪（KI3），前下方的是脾經的商丘（SP5）——三者常被混淆。',
    explanationEn:
      '照海 sits directly below the malleolus tip. The point behind it, between malleolus and tendon, is 太溪 KI3; the one antero-inferior is 商丘 SP5 on the Spleen channel. The three are easily confused.',
    relatedAcupointIds: ['pt_ki6', 'pt_ki3', 'pt_sp5'],
    sourceIds: [WORKSHEET6],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_taixi_class',
    dayId: 'day_6',
    kind: 'multiple_choice',
    promptZhHant: '太溪的特定穴屬性是什麼？',
    promptEn: 'Which specific-point categories does 太溪 (KI3) carry?',
    options: [
      { id: 'a', zhHant: '輸穴兼原穴', en: 'Shu-stream and yuan-source' },
      { id: 'b', zhHant: '井穴', en: 'Jing-well' },
      { id: 'c', zhHant: '合穴', en: 'He-sea' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ki3',
    explanationZhHant:
      '太溪是腎經輸穴（屬土）兼原穴。陰經的輸穴與原穴同穴，這是通則；井穴是湧泉，合穴是陰谷。',
    explanationEn:
      '太溪 is the shu-stream (earth) and yuan-source point. On the yin channels those two coincide, as a rule. The jing-well is 湧泉 and the he-sea 陰谷.',
    relatedAcupointIds: ['pt_ki3', 'pt_ki1', 'pt_ki10'],
    sourceIds: [WORKSHEET6],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_ki_terminus',
    dayId: 'day_6',
    kind: 'multiple_choice',
    promptZhHant: '足少陰腎經的終點是哪一個穴？',
    promptEn: 'Which point is the terminus of the Kidney meridian?',
    options: [
      { id: 'a', zhHant: '幽門', en: '幽門 (KI21)' },
      { id: 'b', zhHant: '俞府', en: '俞府 (KI27)' },
      { id: 'c', zhHant: '彧中', en: '彧中 (KI26)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_ki27',
    explanationZhHant: '俞府（KI27）在鎖骨下緣，旁開 2 寸，是 27 穴的終點。腎經在肋弓上下換尺：腹部十一站旁開 0.5 寸，胸部六站旁開 2 寸。幽門是腹部最後一穴，彧中是倒數第二站。',
    explanationEn:
      '俞府 KI27, at the lower border of the clavicle 2 cun lateral, is station 27 of 27. The channel changes rule at the costal arch: its eleven abdominal stations are 0.5 cun out, its six chest stations 2. 幽門 is the last abdominal point and 彧中 the second-to-last station.',
    relatedAcupointIds: ['pt_ki27', 'pt_ki26', 'pt_ki21'],
    sourceIds: [WORKSHEET6],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_taixi',
    dayId: 'day_6',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：太溪',
    promptEn: 'Tap 太溪 (KI3) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_ki3',
    explanationZhHant: '太溪在內踝尖與跟腱之間的凹陷中，與內踝尖同高。',
    explanationEn:
      '太溪 sits in the depression between the tip of the medial malleolus and the Achilles tendon, level with the malleolus tip.',
    relatedAcupointIds: ['pt_ki3'],
    sourceIds: [WORKSHEET6],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_huangshu',
    dayId: 'day_6',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：肓俞',
    promptEn: 'Tap 肓俞 (KI16) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_ki16',
    explanationZhHant: '肓俞平臍中，前正中線旁開 0.5 寸——腹部十一站的正中一站。',
    explanationEn:
      '肓俞 is level with the umbilicus, 0.5 cun lateral — the middle station of the eleven on the abdomen.',
    relatedAcupointIds: ['pt_ki16'],
    sourceIds: [WORKSHEET6],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_neiguan_waiguan',
    dayId: 'day_7',
    kind: 'multiple_choice',
    promptZhHant: '內關與外關的共同點是什麼？',
    promptEn: 'What do 內關 and 外關 have in common?',
    options: [
      { id: 'a', zhHant: '都在腕橫紋上 2 寸，只是一掌一背', en: 'Both 2 cun above the wrist crease, one palmar and one dorsal' },
      { id: 'b', zhHant: '都在腕橫紋上 3 寸', en: 'Both 3 cun above the wrist crease' },
      { id: 'c', zhHant: '都在同一條經上', en: 'Both belong to the same channel' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_pc6',
    explanationZhHant:
      '內關（PC6）在腕掌側橫紋上 2 寸、兩筋之間；外關（TE5）在腕背橫紋上 2 寸、兩骨之間。分屬互為表裡的心包經與三焦經。',
    explanationEn:
      '內關 PC6 sits 2 cun above the palmar crease between two tendons; 外關 TE5 2 cun above the dorsal crease between two bones. They belong to the paired Pericardium and Triple Energizer channels.',
    relatedAcupointIds: ['pt_pc6', 'pt_te5'],
    sourceIds: [WORKSHEET7],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_daling_crease',
    dayId: 'day_7',
    kind: 'multiple_choice',
    promptZhHant: '大陵位於何處？',
    promptEn: 'Where does 大陵 (PC7) sit?',
    options: [
      { id: 'a', zhHant: '腕掌側橫紋中點，兩筋之間', en: 'At the midpoint of the palmar wrist crease, between two tendons' },
      { id: 'b', zhHant: '腕掌側橫紋上 1 寸', en: '1 cun above the palmar wrist crease' },
      { id: 'c', zhHant: '腕背橫紋中點', en: 'At the midpoint of the dorsal wrist crease' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_pc7',
    explanationZhHant:
      '大陵就壓在腕掌側橫紋上（零距離），是心包經的輸穴兼原穴。腕背橫紋中點的是三焦經的陽池。',
    explanationEn:
      '大陵 lies ON the palmar wrist crease — zero distance — and is the shu-stream and yuan-source of the Pericardium channel. The midpoint of the DORSAL crease is 陽池 TE4.',
    relatedAcupointIds: ['pt_pc7', 'pt_te4'],
    sourceIds: [WORKSHEET7],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_arm_midlines',
    dayId: 'day_7',
    kind: 'multiple_choice',
    promptZhHant: '上肢內側中線走的是哪一條經？',
    promptEn: 'Which channel runs the midline of the INNER arm?',
    options: [
      { id: 'a', zhHant: '手厥陰心包經', en: 'Pericardium (Hand Jueyin)' },
      { id: 'b', zhHant: '手少陽三焦經', en: 'Triple Energizer (Hand Shaoyang)' },
      { id: 'c', zhHant: '手少陰心經', en: 'Heart (Hand Shaoyin)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: null,
    explanationZhHant:
      '內側三線由前到後是肺經、心包經、心經；外側三線是大腸經、三焦經、小腸經。三焦經走的是外側中線。',
    explanationEn:
      'The inner face runs Lung, Pericardium, Heart from front to back; the outer runs Large Intestine, Triple Energizer, Small Intestine. The Triple Energizer holds the OUTER midline.',
    relatedAcupointIds: [],
    sourceIds: [WORKSHEET7],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_te_terminus',
    dayId: 'day_7',
    kind: 'multiple_choice',
    promptZhHant: '手少陽三焦經的終點是哪一個穴？',
    promptEn: 'Which point is the terminus of the Triple Energizer meridian?',
    options: [
      { id: 'a', zhHant: '耳門', en: '耳門 (TE21)' },
      { id: 'b', zhHant: '絲竹空', en: '絲竹空 (TE23)' },
      { id: 'c', zhHant: '角孫', en: '角孫 (TE20)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_te23',
    explanationZhHant: '絲竹空（TE23）在眉梢外側凹陷處，是 23 穴的終點。耳門是倒數第三站，角孫在耳尖上方。',
    explanationEn:
      '絲竹空 TE23, in the hollow at the outer end of the eyebrow, is station 23 of 23. 耳門 is third from last and 角孫 sits above the ear apex.',
    relatedAcupointIds: ['pt_te23', 'pt_te21', 'pt_te20'],
    sourceIds: [WORKSHEET7],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_neiguan',
    dayId: 'day_7',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：內關',
    promptEn: 'Tap 內關 (PC6) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_pc6',
    explanationZhHant: '內關在前臂掌側，腕掌側遠端橫紋上 2 寸，掌長肌腱與橈側腕屈肌腱之間。',
    explanationEn:
      '內關 sits on the anterior forearm, 2 cun above the palmar wrist crease, between the palmaris longus and flexor carpi radialis tendons.',
    relatedAcupointIds: ['pt_pc6'],
    sourceIds: [WORKSHEET7],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_waiguan',
    dayId: 'day_7',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：外關',
    promptEn: 'Tap 外關 (TE5) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_te5',
    explanationZhHant: '外關在前臂背側，腕背橫紋上 2 寸，尺骨與橈骨之間。',
    explanationEn:
      '外關 sits on the posterior forearm, 2 cun above the dorsal wrist crease, between the ulna and radius.',
    relatedAcupointIds: ['pt_te5'],
    sourceIds: [WORKSHEET7],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_gb_sinew_marrow',
    dayId: 'day_8',
    kind: 'multiple_choice',
    promptZhHant: '八會穴中的「筋會」是哪一個穴？',
    promptEn: 'Which point is the influential point for SINEW?',
    options: [
      { id: 'a', zhHant: '陽陵泉（GB34）', en: '陽陵泉 GB34' },
      { id: 'b', zhHant: '懸鐘（GB39）', en: '懸鐘 GB39' },
      { id: 'c', zhHant: '環跳（GB30）', en: '環跳 GB30' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb34',
    explanationZhHant:
      '陽陵泉是筋會，在腓骨小頭前下方，同時是膽經的合穴與下合穴。懸鐘（絕骨）是髓會，兩者都在膽經上。',
    explanationEn:
      '陽陵泉 GB34, below the head of the fibula, is the influential point for sinew and also the channel’s he-sea and lower he-sea. 懸鐘 GB39 is the influential point for marrow — the channel carries both.',
    relatedAcupointIds: ['pt_gb34', 'pt_gb39'],
    sourceIds: [WORKSHEET8],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_gb_jingmen_mu',
    dayId: 'day_8',
    kind: 'multiple_choice',
    promptZhHant: '京門（GB25）是哪一個臟腑的募穴？',
    promptEn: '京門 GB25 is the front-mu point of which organ?',
    options: [
      { id: 'a', zhHant: '腎', en: 'The kidney' },
      { id: 'b', zhHant: '膽', en: 'The gallbladder' },
      { id: 'c', zhHant: '肝', en: 'The liver' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb25',
    explanationZhHant:
      '京門是「腎」的募穴，只是位置長在膽經上。膽自己的募穴是日月（GB24）。這一對最容易記混。',
    explanationEn:
      '京門 is the KIDNEY’s front-mu; it merely sits on the Gallbladder channel. The gallbladder’s own is 日月 GB24. This pair is the easiest to mix up.',
    relatedAcupointIds: ['pt_gb25', 'pt_gb24'],
    sourceIds: [WORKSHEET8],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_gb_xi_cleft',
    dayId: 'day_8',
    kind: 'multiple_choice',
    promptZhHant: '膽經「本經」的郄穴是哪一個？',
    promptEn: 'Which point is the Gallbladder channel’s OWN xi-cleft?',
    options: [
      { id: 'a', zhHant: '外丘（GB36），腓骨前緣', en: '外丘 GB36, at the front border of the fibula' },
      { id: 'b', zhHant: '陽交（GB35），腓骨後緣', en: '陽交 GB35, at the back border of the fibula' },
      { id: 'c', zhHant: '光明（GB37）', en: '光明 GB37' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb36',
    explanationZhHant:
      '外丘是膽經本經郄穴；陽交是陽維脈的郄穴。兩穴同在外踝尖上 7 寸，一前一後。光明是膽經的絡穴。',
    explanationEn:
      '外丘 is the channel’s own xi-cleft; 陽交 belongs to the Yang Linking vessel. Both sit 7 cun above the ankle, one in front of the fibula and one behind. 光明 GB37 is the luo-connecting point.',
    relatedAcupointIds: ['pt_gb36', 'pt_gb35', 'pt_gb37'],
    sourceIds: [WORKSHEET8],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_huantiao_rule',
    dayId: 'day_8',
    kind: 'multiple_choice',
    promptZhHant: '環跳的定位規則是什麼？',
    promptEn: 'How is 環跳 GB30 located?',
    options: [
      {
        id: 'a',
        zhHant: '大轉子最凸點與骶管裂孔連線的外 1/3 處',
        en: 'At the outer third of the line from the greater trochanter to the sacral hiatus',
      },
      { id: 'b', zhHant: '髂前上棘下 3 寸', en: '3 cun below the anterior superior iliac spine' },
      { id: 'c', zhHant: '臀下橫紋中點', en: 'At the midpoint of the gluteal fold' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb30',
    explanationZhHant:
      '環跳用比例定位，不是骨度分寸。臀下橫紋中點是膀胱經的承扶（BL36）。',
    explanationEn:
      '環跳 is located by proportion, not by a cun measure. The midpoint of the gluteal fold is 承扶 BL36 on the Bladder channel.',
    relatedAcupointIds: ['pt_gb30', 'pt_bl36'],
    sourceIds: [WORKSHEET8],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_fengchi',
    dayId: 'day_8',
    kind: 'locate_point',
    promptZhHant: '在背面圖上點出：風池',
    promptEn: 'Tap 風池 (GB20) on the Back view',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_gb20',
    explanationZhHant: '風池在項部枕骨之下，胸鎖乳突肌與斜方肌上端之間的凹陷處。',
    explanationEn:
      '風池 sits on the nape below the occipital bone, in the depression between the upper ends of sternocleidomastoid and trapezius.',
    relatedAcupointIds: ['pt_gb20'],
    sourceIds: [WORKSHEET8],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_yanglingquan',
    dayId: 'day_8',
    kind: 'locate_point',
    promptZhHant: '在背面圖上點出：陽陵泉',
    promptEn: 'Tap 陽陵泉 (GB34) on the Back view',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_gb34',
    explanationZhHant: '陽陵泉在小腿外側，腓骨頭前下方的凹陷處。',
    explanationEn:
      '陽陵泉 sits on the lateral lower leg, in the depression antero-inferior to the head of the fibula.',
    relatedAcupointIds: ['pt_gb34'],
    sourceIds: [WORKSHEET8],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_lr_mu_split',
    dayId: 'day_9',
    kind: 'multiple_choice',
    promptZhHant: '章門（LR13）是哪一臟的募穴？',
    promptEn: '章門 LR13 is the front-mu point of which organ?',
    options: [
      { id: 'a', zhHant: '脾', en: 'The spleen' },
      { id: 'b', zhHant: '肝', en: 'The liver' },
      { id: 'c', zhHant: '膽', en: 'The gallbladder' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lr13',
    explanationZhHant:
      '章門是「脾」的募穴，同時是八會穴的臟會——它長在肝經上但不屬肝。肝自己的募穴是期門（LR14）。這和京門（腎募長在膽經上）是同一種跨經模式。',
    explanationEn:
      '章門 is the SPLEEN’s front-mu and the influential point where the zang meet; it sits on the Liver channel without belonging to that organ. The liver’s own is 期門 LR14 — the same cross-channel pattern as 京門 GB25.',
    relatedAcupointIds: ['pt_lr13', 'pt_lr14', 'pt_gb25'],
    sourceIds: [WORKSHEET9],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_four_gates',
    dayId: 'day_9',
    kind: 'multiple_choice',
    promptZhHant: '「四關」指的是哪兩個穴？',
    promptEn: 'Which two points are known as 「四關」?',
    options: [
      { id: 'a', zhHant: '太衝與合谷', en: '太衝 LR3 and 合谷 LI4' },
      { id: 'b', zhHant: '太衝與太溪', en: '太衝 LR3 and 太溪 KI3' },
      { id: 'c', zhHant: '合谷與曲池', en: '合谷 LI4 and 曲池 LI11' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lr3',
    explanationZhHant:
      '太衝是肝經原穴、合谷是大腸經原穴，一足一手，左右各一合為四關。',
    explanationEn:
      '太衝 is the Liver’s yuan-source and 合谷 the Large Intestine’s — one on the foot, one on the hand, taken bilaterally to make four.',
    relatedAcupointIds: ['pt_lr3', 'pt_li4'],
    sourceIds: [WORKSHEET9, OUTLINE],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_cycle_closes',
    dayId: 'day_9',
    kind: 'multiple_choice',
    promptZhHant: '肝經之後，氣血傳往哪一條經？',
    promptEn: 'Which channel does the flow pass to after the Liver?',
    options: [
      { id: 'a', zhHant: '手太陰肺經（回到起點）', en: 'The Lung channel — back to the start' },
      { id: 'b', zhHant: '足少陽膽經', en: 'The Gallbladder channel' },
      { id: 'c', zhHant: '足少陰腎經', en: 'The Kidney channel' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lr14',
    explanationZhHant:
      '肝經的支脈上注於肺，把氣血交回手太陰肺經——中府（LU1）正是第 1 天的第一穴。十二正經的流注在此閉環。膽經是它的表裡經，在它之「前」。',
    explanationEn:
      'A branch of the Liver pours into the lung, handing the flow back to the Lung channel — 中府 LU1, the very first point of Day 1. The cycle of the twelve closes here. The Gallbladder is its interior–exterior pair and comes BEFORE it.',
    relatedAcupointIds: ['pt_lr14', 'pt_lu1'],
    sourceIds: [WORKSHEET9, LINGSHU],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_taichong',
    dayId: 'day_9',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：太衝',
    promptEn: 'Tap 太衝 (LR3) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_lr3',
    explanationZhHant: '太衝在足背第 1、2 蹠骨之間，兩骨會合前的凹陷處，是肝經的原穴。',
    explanationEn:
      '太衝 sits on the dorsum of the foot between the 1st and 2nd metatarsals, in the depression proximal to their junction. It is the channel’s yuan-source.',
    relatedAcupointIds: ['pt_lr3'],
    sourceIds: [WORKSHEET9],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_qimen',
    dayId: 'day_9',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：期門',
    promptEn: 'Tap 期門 (LR14) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_lr14',
    explanationZhHant: '期門在乳頭直下第 6 肋間隙，前正中線旁開 4 寸——十二正經的最後一穴。',
    explanationEn:
      '期門 sits directly below the nipple in the 6th intercostal space, 4 cun from the anterior midline — the last point of the twelve regular channels.',
    relatedAcupointIds: ['pt_lr14'],
    sourceIds: [WORKSHEET9],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_zhongwan_mu',
    dayId: 'day_10',
    kind: 'multiple_choice',
    promptZhHant: '中脘（CV12）是哪一腑的募穴？',
    promptEn: '中脘 CV12 is the front-mu point of which organ?',
    options: [
      { id: 'a', zhHant: '胃（兼八會穴之腑會）', en: 'The stomach — and the influential point for the fu' },
      { id: 'b', zhHant: '小腸', en: 'The small intestine' },
      { id: 'c', zhHant: '膀胱', en: 'The bladder' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_cv12',
    explanationZhHant:
      '中脘是胃募兼腑會，位在任脈上——穴屬任脈，募的是胃。小腸募是關元（CV4），膀胱募是中極（CV3），三者都在任脈上。',
    explanationEn:
      '中脘 is the stomach’s front-mu and the influential point for the fu, sitting on the Conception vessel — the point belongs to the vessel, the organ does not. 關元 CV4 is the small intestine’s and 中極 CV3 the bladder’s; all three sit on this vessel.',
    relatedAcupointIds: ['pt_cv12', 'pt_cv4', 'pt_cv3'],
    sourceIds: [WORKSHEET10],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_abdominal_zero',
    dayId: 'day_10',
    kind: 'multiple_choice',
    promptZhHant: '腹部所有「臍中上／下 N 寸」的定位，是從哪一穴起算的？',
    promptEn: 'Every 「N cun above/below the umbilicus」 is counted from which point?',
    options: [
      { id: 'a', zhHant: '神闕（CV8）', en: '神闕 CV8' },
      { id: 'b', zhHant: '氣海（CV6）', en: '氣海 CV6' },
      { id: 'c', zhHant: '中脘（CV12）', en: '中脘 CV12' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_cv8',
    explanationZhHant:
      '神闕在臍中央，是腹部寸數的零點。胃經天樞（旁開 2 寸）、脾經大橫（4 寸）、腎經肓俞（0.5 寸）都與它同高，只差旁開多遠。',
    explanationEn:
      '神闕 sits at the centre of the navel, the zero of the abdominal ruler. 天樞 ST25 (2 cun lateral), 大橫 SP15 (4) and 肓俞 KI16 (0.5) are all level with it and differ only in how far out they sit.',
    relatedAcupointIds: ['pt_cv8', 'pt_st25', 'pt_sp15', 'pt_ki16'],
    sourceIds: [WORKSHEET10],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_gv_count',
    dayId: 'day_10',
    kind: 'multiple_choice',
    promptZhHant: '現行標準中，GV23 是哪一穴？',
    promptEn: 'Under the current numbering, which point is GV23?',
    options: [
      { id: 'a', zhHant: '上星', en: '上星 Upper Star' },
      { id: 'b', zhHant: '印堂', en: '印堂 Hall of Impression' },
      { id: 'c', zhHant: '神庭', en: '神庭 Spirit Courtyard' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gv23',
    explanationZhHant:
      'GV23 是上星，GV24 是神庭。印堂是 GV29——GB/T 12346-2006 才把它從經外奇穴收入督脈。把印堂寫成 DU23 的資料是舊編號。',
    explanationEn:
      'GV23 is 上星 and GV24 is 神庭. 印堂 is GV29 — GB/T 12346-2006 brought it in from the extra points. A source numbering 印堂 as "DU23" is using the older scheme.',
    relatedAcupointIds: ['pt_gv23', 'pt_gv24', 'pt_gv29'],
    sourceIds: [WORKSHEET10],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_extraordinary_pair',
    dayId: 'day_10',
    kind: 'multiple_choice',
    promptZhHant: '任脈的表裡經是哪一條？',
    promptEn: 'Which channel is the interior–exterior pair of the Conception vessel?',
    options: [
      { id: 'a', zhHant: '沒有——它是奇經，不成對', en: 'None — it is an extraordinary vessel and has no pair' },
      { id: 'b', zhHant: '督脈', en: 'The Governor vessel' },
      { id: 'c', zhHant: '足少陰腎經', en: 'The Kidney channel' },
    ],
    correctOptionId: 'a',
    targetAcupointId: null,
    explanationZhHant:
      '任督二脈都是奇經：沒有表裡配對、沒有左右之分、沒有五輸穴，也不在十二經的流注循環裡。表裡配對是十二正經才有的結構。',
    explanationEn:
      'Both midline vessels are extraordinary: no interior–exterior pair, no left and right, no five-shu points, and outside the twelve’s flow cycle. Pairing is a structure only the twelve regular channels have.',
    relatedAcupointIds: [],
    sourceIds: [WORKSHEET10],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_shenque',
    dayId: 'day_10',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：神闕',
    promptEn: 'Tap 神闕 (CV8) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_cv8',
    explanationZhHant: '神闕在臍中央，是腹部定位的零點。',
    explanationEn: '神闕 sits at the centre of the umbilicus — the zero of the abdominal ruler.',
    relatedAcupointIds: ['pt_cv8'],
    sourceIds: [WORKSHEET10],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_locate_baihui',
    dayId: 'day_10',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：百會',
    promptEn: 'Tap 百會 (GV20) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_gv20',
    explanationZhHant: '百會在頭頂正中，前髮際上 5 寸，也就是兩耳尖連線的中點。',
    explanationEn:
      '百會 sits at the vertex, 5 cun above the front hairline — the midpoint of the line joining the two ear apices.',
    relatedAcupointIds: ['pt_gv20'],
    sourceIds: [WORKSHEET10],
    reviewStatus: 'source_checked',
  },

  /* --- Day 11: read the categories sideways ------------------------------- */

  {
    id: 'qz_yuan_shu_yin',
    dayId: 'day_11',
    kind: 'multiple_choice',
    promptZhHant: '在陰經上，原穴與輸穴的關係是？',
    promptEn: 'On a yin channel, how do the yuan-source and shu-stream points relate?',
    options: [
      { id: 'a', zhHant: '同一個穴', en: 'They are the same point' },
      { id: 'b', zhHant: '相鄰但不同穴', en: 'Adjacent but different points' },
      { id: 'c', zhHant: '一在手一在肘', en: 'One at the hand, one at the elbow' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lu9',
    explanationZhHant:
      '陰經原輸同穴：太淵、太白、神門、太谿、大陵、太衝，六個穴各自身兼兩職。陽經則另立原穴。',
    explanationEn:
      'On the yin channels the two coincide: 太淵, 太白, 神門, 太谿, 大陵 and 太衝 each hold both roles. The yang channels carry a separate yuan-source.',
    relatedAcupointIds: ['pt_lu9', 'pt_sp3', 'pt_ht7', 'pt_ki3', 'pt_pc7', 'pt_lr3'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_influential_sinew',
    dayId: 'day_11',
    kind: 'multiple_choice',
    promptZhHant: '八會穴中，筋會是哪一穴？',
    promptEn: 'Among the eight influential points, which one is the influential point of sinew?',
    options: [
      { id: 'a', zhHant: '懸鐘（絕骨）', en: '懸鐘 GB39' },
      { id: 'b', zhHant: '陽陵泉', en: '陽陵泉 GB34' },
      { id: 'c', zhHant: '大杼', en: '大杼 BL11' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_gb34',
    explanationZhHant:
      '筋會陽陵泉，在膝下腓骨頭前下方凹陷。同在膽經的懸鐘是髓會，大杼是骨會——這三個最容易混。',
    explanationEn:
      'Sinew gathers at 陽陵泉 GB34, in the hollow below and in front of the head of the fibula. 懸鐘 GB39, also on the Gallbladder, is marrow; 大杼 BL11 is bone. These three are the easiest to confuse.',
    relatedAcupointIds: ['pt_gb34', 'pt_gb39', 'pt_bl11'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_mu_stomach',
    dayId: 'day_11',
    kind: 'multiple_choice',
    promptZhHant: '胃的募穴中脘在哪一條經上？',
    promptEn: 'The stomach’s front-mu point 中脘 sits on which channel?',
    options: [
      { id: 'a', zhHant: '足陽明胃經', en: 'Stomach (Foot Yangming)' },
      { id: 'b', zhHant: '任脈', en: 'The Conception vessel' },
      { id: 'c', zhHant: '足太陰脾經', en: 'Spleen (Foot Taiyin)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_cv12',
    explanationZhHant:
      '中脘在任脈上，臍上 4 寸。募穴不必然在自己臟腑的經上——脾的募穴章門在肝經，腎的募穴京門在膽經，同理。',
    explanationEn:
      '中脘 is on the Conception vessel, 4 cun above the umbilicus. A mu point need not sit on its own organ’s channel: the spleen’s 章門 is on the Liver and the kidney’s 京門 on the Gallbladder, for the same reason.',
    relatedAcupointIds: ['pt_cv12', 'pt_lr13', 'pt_gb25'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_confluent_neiguan',
    dayId: 'day_11',
    kind: 'multiple_choice',
    promptZhHant: '八脈交會穴中，與內關配成一組的是哪一穴？',
    promptEn: 'Which confluent point is paired with 內關 (PC6)?',
    options: [
      { id: 'a', zhHant: '照海', en: '照海 KI6' },
      { id: 'b', zhHant: '公孫', en: '公孫 SP4' },
      { id: 'c', zhHant: '申脈', en: '申脈 BL62' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_sp4',
    explanationZhHant:
      '公孫配內關。四組配對是：公孫—內關、後谿—申脈、足臨泣—外關、列缺—照海，每組一手一足。',
    explanationEn:
      '公孫 pairs with 內關. The four couples are 公孫–內關, 後谿–申脈, 足臨泣–外關 and 列缺–照海, each one foot point and one hand point.',
    relatedAcupointIds: ['pt_sp4', 'pt_pc6'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_back_shu_line',
    dayId: 'day_11',
    kind: 'multiple_choice',
    promptZhHant: '十二背俞穴距離後正中線多遠？',
    promptEn: 'How far from the posterior midline do the twelve back-shu points lie?',
    options: [
      { id: 'a', zhHant: '旁開 1.5 寸', en: '1.5 cun lateral' },
      { id: 'b', zhHant: '旁開 3 寸', en: '3 cun lateral' },
      { id: 'c', zhHant: '就在正中線上', en: 'On the midline itself' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_bl17',
    explanationZhHant:
      '背俞穴全在膀胱經第一側線，後正中線旁開 1.5 寸。旁開 3 寸的是第二側線（魄戶、膏肓那一排）。',
    explanationEn:
      'Every back-shu is on the Bladder’s first line, 1.5 cun lateral to the posterior midline. The 3-cun line is the Bladder’s second line — 魄戶, 膏肓 and that row.',
    relatedAcupointIds: ['pt_bl17'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_locate_yanglingquan',
    dayId: 'day_11',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：陽陵泉（筋會）',
    promptEn: 'Tap 陽陵泉 GB34, the influential point of sinew',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_gb34',
    explanationZhHant: '陽陵泉在小腿外側，腓骨頭前下方凹陷處——摸到膝外下方那個骨頭圓突就對了。',
    explanationEn:
      '陽陵泉 is on the lateral lower leg, in the hollow below and in front of the head of the fibula — find that round bony prominence below and outside the knee.',
    relatedAcupointIds: ['pt_gb34'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },

  /* --- Day 12: the whole set --------------------------------------------- */

  {
    id: 'qz_flow_after_bl',
    dayId: 'day_12',
    kind: 'multiple_choice',
    promptZhHant: '流注順序中，膀胱經之後接的是哪一經？',
    promptEn: 'In the flow sequence, which channel follows the Bladder?',
    options: [
      { id: 'a', zhHant: '足少陰腎經', en: 'Kidney (Foot Shaoyin)' },
      { id: 'b', zhHant: '手厥陰心包經', en: 'Pericardium (Hand Jueyin)' },
      { id: 'c', zhHant: '足少陽膽經', en: 'Gallbladder (Foot Shaoyang)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ki1',
    explanationZhHant:
      '膀胱接腎，兩者互為表裡，交接在足小趾（至陰）到足底（湧泉）。腎之後才是心包。',
    explanationEn:
      'Bladder hands over to the Kidney, its interior–exterior partner, at the little toe (至陰) passing to the sole (湧泉). The Pericardium comes after the Kidney.',
    relatedAcupointIds: ['pt_bl67', 'pt_ki1'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_pair_of_gb',
    dayId: 'day_12',
    kind: 'multiple_choice',
    promptZhHant: '膽經的表裡配對是哪一經？',
    promptEn: 'Which channel is the Gallbladder’s interior–exterior pair?',
    options: [
      { id: 'a', zhHant: '足厥陰肝經', en: 'Liver (Foot Jueyin)' },
      { id: 'b', zhHant: '足太陰脾經', en: 'Spleen (Foot Taiyin)' },
      { id: 'c', zhHant: '手少陽三焦經', en: 'Triple Energiser (Hand Shaoyang)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lr14',
    explanationZhHant:
      '肝膽相表裡，都走足部、都屬厥陰／少陽這一對。三焦與心包才是另一組手少陽—手厥陰。',
    explanationEn:
      'Liver and Gallbladder are the pair — both on the leg, and the Jueyin/Shaoyang couple there. The Triple Energiser’s partner is the Pericardium, the same couple on the arm.',
    relatedAcupointIds: ['pt_lr14', 'pt_gb44'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_arm_yin_order',
    dayId: 'day_12',
    kind: 'multiple_choice',
    promptZhHant: '手臂內側由前到後，三條陰經的順序是？',
    promptEn: 'Front to back on the inner arm, in what order do the three yin channels run?',
    options: [
      { id: 'a', zhHant: '太陰、厥陰、少陰', en: 'Taiyin, Jueyin, Shaoyin' },
      { id: 'b', zhHant: '少陰、厥陰、太陰', en: 'Shaoyin, Jueyin, Taiyin' },
      { id: 'c', zhHant: '厥陰、太陰、少陰', en: 'Jueyin, Taiyin, Shaoyin' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_pc7',
    explanationZhHant:
      '太陰（肺）在前、厥陰（心包）在中、少陰（心）在後。腕橫紋上三個穴恰好排成這個順序：太淵、大陵、神門。',
    explanationEn:
      'Taiyin (Lung) in front, Jueyin (Pericardium) in the middle, Shaoyin (Heart) behind. The three points on the wrist crease sit in exactly that order: 太淵, 大陵, 神門.',
    relatedAcupointIds: ['pt_lu9', 'pt_pc7', 'pt_ht7'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_cun_segment',
    dayId: 'day_12',
    kind: 'multiple_choice',
    promptZhHant: '骨度分寸中，肘橫紋到腕橫紋定為幾寸？',
    promptEn: 'In the bone-cun system, the elbow crease to the wrist crease is defined as how many cun?',
    options: [
      { id: 'a', zhHant: '12 寸', en: '12 cun' },
      { id: 'b', zhHant: '16 寸', en: '16 cun' },
      { id: 'c', zhHant: '9 寸', en: '9 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_pc6',
    explanationZhHant:
      '前臂 12 寸，所以內關「腕橫紋上 2 寸」是這一段的六分之一。膝到踝才是 16 寸，胸骨柄上緣到胸劍聯合是 9 寸——每段各用自己的比例。',
    explanationEn:
      'The forearm is 12 cun, so 內關 at “2 cun above the wrist crease” is one sixth of that segment. Knee to ankle is 16 cun and suprasternal notch to xiphisternal junction is 9 — each segment uses its own scale.',
    relatedAcupointIds: ['pt_pc6'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_landmark_first',
    dayId: 'day_12',
    kind: 'multiple_choice',
    promptZhHant: '足三里的定位起算點是哪裡？',
    promptEn: 'Which landmark is 足三里 measured from?',
    options: [
      { id: 'a', zhHant: '髕骨下緣（犢鼻）下 3 寸', en: '3 cun below the inferior border of the patella' },
      { id: 'b', zhHant: '髕骨上緣下 3 寸', en: '3 cun below the superior border of the patella' },
      { id: 'c', zhHant: '膕橫紋下 3 寸', en: '3 cun below the popliteal crease' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_st36',
    explanationZhHant:
      '足三里從犢鼻（髕韌帶外側凹陷，髕骨下緣一帶）下量 3 寸，脛骨前脊外開 1 橫指。起算點選錯，整個穴就差 2 寸——這是最典型的定位錯誤。',
    explanationEn:
      'It is measured 3 cun down from 犢鼻, the hollow lateral to the patellar ligament at the inferior border of the patella, and one finger-breadth lateral to the tibial crest. Start from the wrong border and the point lands 2 cun off — the classic locating error.',
    relatedAcupointIds: ['pt_st36'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_locate_zhongwan',
    dayId: 'day_12',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：中脘',
    promptEn: 'Tap 中脘 (CV12) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_cv12',
    explanationZhHant: '中脘在前正中線，臍上 4 寸，也就是臍與胸劍聯合連線的中點。',
    explanationEn:
      '中脘 is on the anterior midline, 4 cun above the umbilicus — the midpoint between the umbilicus and the xiphisternal junction.',
    relatedAcupointIds: ['pt_cv12'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_locate_taichong',
    dayId: 'day_12',
    kind: 'locate_point',
    promptZhHant: '在圖上點出：太衝',
    promptEn: 'Tap 太衝 (LR3) on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_lr3',
    explanationZhHant: '太衝在足背第一、二蹠骨之間，往後推到兩骨結合處前方的凹陷——肝經的原穴兼輸穴。',
    explanationEn:
      '太衝 is on the dorsum of the foot between the 1st and 2nd metatarsals; slide back until the bones meet and stop in the hollow just before the junction. It is the Liver’s yuan-source and shu-stream in one.',
    relatedAcupointIds: ['pt_lr3'],
    sourceIds: [HANDBOOK, OUTLINE],
    reviewStatus: 'unreviewed',
  },

  /* --- Day 13: the twelve as a day ---------------------------------------- */

  {
    id: 'qz_ziwu_yin',
    dayId: 'day_13',
    kind: 'multiple_choice',
    promptZhHant: '寅時（03:00–05:00）配哪一條經？',
    promptEn: 'Which channel is paired with 寅 (03:00–05:00)?',
    options: [
      { id: 'a', zhHant: '手太陰肺經', en: 'Lung (Hand Taiyin)' },
      { id: 'b', zhHant: '足少陰腎經', en: 'Kidney (Foot Shaoyin)' },
      { id: 'c', zhHant: '足厥陰肝經', en: 'Liver (Foot Jueyin)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lu1',
    explanationZhHant:
      '寅時配肺經，也是整張表的起點：歌訣「肺寅大卯胃辰宮」第一個字就是肺。十二經從這裡輪一圈，最後由肝經交回肺經。',
    explanationEn:
      'The Lung, and the start of the whole table — the verse opens 「肺寅」. The twelve take a turn each from here and the Liver hands back to the Lung at the end.',
    relatedAcupointIds: ['pt_lu1'],
    sourceIds: [ZIWU, WORKSHEET_ZIWU],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_ziwu_you',
    dayId: 'day_13',
    kind: 'multiple_choice',
    promptZhHant: '酉時（17:00–19:00）配哪一條經？',
    promptEn: 'Which channel is paired with 酉 (17:00–19:00)?',
    options: [
      { id: 'a', zhHant: '足太陽膀胱經', en: 'Bladder (Foot Taiyang)' },
      { id: 'b', zhHant: '足少陰腎經', en: 'Kidney (Foot Shaoyin)' },
      { id: 'c', zhHant: '手厥陰心包經', en: 'Pericardium (Hand Jueyin)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_ki1',
    explanationZhHant:
      '酉時配腎經。它緊接在申時的膀胱經之後——腎與膀胱互為表裡，在表上前後相鄰，這是最省力的檢查法。',
    explanationEn:
      'The Kidney, straight after the Bladder at 申. The two are an interior–exterior pair, and pairs sit next to each other on this table — the cheapest way to check yourself.',
    relatedAcupointIds: ['pt_ki1', 'pt_bl67'],
    sourceIds: [ZIWU, WORKSHEET_ZIWU],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_ziwu_nazi',
    dayId: 'day_13',
    kind: 'multiple_choice',
    promptZhHant: '「納子法」指的是什麼？',
    promptEn: 'What does 「納子法」 refer to?',
    options: [
      {
        id: 'a',
        zhHant: '十二地支配十二正經的那張對應表',
        en: 'The table matching the twelve earthly branches to the twelve channels',
      },
      {
        id: 'b',
        zhHant: '按天干推算五輸穴開穴的算法',
        en: 'Calculating five-shu opening points from the heavenly stems',
      },
      { id: 'c', zhHant: '五輸穴的排列順序', en: 'The order of the five shu points' },
    ],
    correctOptionId: 'a',
    targetAcupointId: null,
    explanationZhHant:
      '納子法就是時辰配經的那張表本身。選項 B 是「納甲法」，屬擇時針灸的臨床決策，本課程只點出名詞，不教計算。',
    explanationEn:
      '納子法 is the hour-to-channel table itself. Option B describes 納甲法, which belongs to timed-treatment decision-making; this course names the term and does not teach the calculation.',
    relatedAcupointIds: [],
    sourceIds: [ZIWU, WORKSHEET_ZIWU],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_ziwu_open',
    dayId: 'day_13',
    kind: 'multiple_choice',
    promptZhHant: '本課程如何使用「開穴」「閉穴」這兩個詞？',
    promptEn: 'How does this course use the words 「開穴」 and 「閉穴」?',
    options: [
      {
        id: 'a',
        zhHant: '描述氣血漲落的節律說法，非操作指令',
        en: 'As rhythm vocabulary for a described rise and fall — not an instruction',
      },
      { id: 'b', zhHant: '指示何時該取該穴', en: 'To indicate when a point should be used' },
      { id: 'c', zhHant: '穴位的解剖分類', en: 'As an anatomical category of point' },
    ],
    correctOptionId: 'a',
    targetAcupointId: null,
    explanationZhHant:
      '兩個詞在這裡只當節律的說法：流注到某經稱「開」，流過稱「閉」。本 App 不據以決定任何事，也不提供取穴時機指引。',
    explanationEn:
      'They are rhythm vocabulary here: a channel is “open” while the qi is described as running through it and “closed” once it has passed. Nothing in the app acts on that, and it gives no guidance on when to use a point.',
    relatedAcupointIds: [],
    sourceIds: [ZIWU, WORKSHEET_ZIWU],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_ziwu_locate_st36',
    dayId: 'day_13',
    kind: 'locate_point',
    promptZhHant: '辰時值班的是胃經。在圖上點出：足三里',
    promptEn: 'The Stomach is the channel at 辰. Tap 足三里 ST36 on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_st36',
    explanationZhHant:
      '足三里是胃經的合穴，也是六個下合穴之一：犢鼻下 3 寸，脛骨前脊外開一橫指。',
    explanationEn:
      'The he-sea point of the Stomach and one of the six lower he-sea points: 3 cun below 犢鼻, one finger-breadth lateral to the tibial crest.',
    relatedAcupointIds: ['pt_st36'],
    sourceIds: [ZIWU, WORKSHEET_ZIWU],
    reviewStatus: 'source_checked',
  },
  {
    id: 'qz_ziwu_locate_ht7',
    dayId: 'day_13',
    kind: 'locate_point',
    promptZhHant: '午時值班的是心經。在圖上點出：神門',
    promptEn: 'The Heart is the channel at 午. Tap 神門 HT7 on the atlas',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_ht7',
    explanationZhHant: '神門在腕橫紋上，是心經的原穴兼輸穴——陰經原輸同穴。',
    explanationEn:
      '神門 sits on the wrist crease. It is the Heart’s yuan-source and shu-stream in one, as on every yin channel.',
    relatedAcupointIds: ['pt_ht7'],
    sourceIds: [ZIWU, WORKSHEET_ZIWU],
    reviewStatus: 'source_checked',
  },
  /* Day 14 — the two errors that survived two revision rounds of the source
     draft are exactly what these items test. */
  {
    id: 'qz_d14_little_finger',
    dayId: 'day_14',
    kind: 'multiple_choice',
    promptZhHant: '小指末節橈側（靠掌那一側）距指甲角 0.1 寸的井穴，屬於哪一條經？',
    promptEn: 'The jing-well point 0.1 cun from the nail corner on the RADIAL side of the little finger’s distal segment belongs to which channel?',
    options: [
      { id: 'a', zhHant: '手少陰心經（少衝 HT9）', en: 'Heart channel (少衝 HT9)' },
      { id: 'b', zhHant: '手太陽小腸經（少澤 SI1）', en: 'Small Intestine channel (少澤 SI1)' },
      { id: 'c', zhHant: '手厥陰心包經（中衝 PC9）', en: 'Pericardium channel (中衝 PC9)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ht9',
    explanationZhHant:
      '橈側靠掌面，走的是陰經：心經的井穴少衝 HT9。尺側靠背面才是小腸經的少澤 SI1。中衝 PC9 在中指，不在小指。',
    explanationEn:
      'The radial side faces the palm, so it carries a yin channel: the Heart’s jing-well, 少衝 HT9. The ulnar side, facing the back of the hand, carries 少澤 SI1 of the Small Intestine. 中衝 PC9 is on the middle finger, not this one.',
    relatedAcupointIds: ['pt_ht9', 'pt_si1', 'pt_pc9'],
    sourceIds: [WORKSHEET14],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d14_shenmen_pair',
    dayId: 'day_14',
    kind: 'multiple_choice',
    promptZhHant: '神門 HT7 是心經原穴。與它成表裡配對、且同為原穴的是哪一個？',
    promptEn: '神門 HT7 is the Heart’s yuan-source point. Which point pairs with it across the paired channel AND is itself a yuan-source?',
    options: [
      { id: 'a', zhHant: '陰郄 HT6', en: '陰郄 HT6' },
      { id: 'b', zhHant: '腕骨 SI4', en: '腕骨 SI4' },
      { id: 'c', zhHant: '陽池 TE4', en: '陽池 TE4' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_si4',
    explanationZhHant:
      '心與小腸互為表裡，腕骨 SI4 是小腸經原穴——原對原，跨表裡兩經，與內關↔外關（絡對絡）、太淵↔合谷（原對原）同一結構。陰郄 HT6 是心經自己的郄穴，同經不成表裡；陽池 TE4 是三焦經原穴，三焦與心包相表裡。',
    explanationEn:
      'Heart and Small Intestine are a paired channel, and 腕骨 SI4 is the Small Intestine’s yuan-source: yuan to yuan, across the pair — the same shape as 內關↔外關 (luo to luo) and 太淵↔合谷 (yuan to yuan). 陰郄 HT6 is the Heart’s own xi-cleft, the same channel rather than its partner; 陽池 TE4 is the Triple Energiser’s yuan-source, and that channel pairs with the Pericardium.',
    relatedAcupointIds: ['pt_ht7', 'pt_si4', 'pt_te4'],
    sourceIds: [WORKSHEET14],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d14_hand_channels',
    dayId: 'day_14',
    kind: 'multiple_choice',
    promptZhHant: '下列哪一條經「不」經過手部？',
    promptEn: 'Which of these channels does NOT reach the hand?',
    options: [
      { id: 'a', zhHant: '手少陽三焦經', en: 'Triple Energiser (Hand Shaoyang)' },
      { id: 'b', zhHant: '足少陰腎經', en: 'Kidney (Foot Shaoyin)' },
      { id: 'c', zhHant: '手厥陰心包經', en: 'Pericardium (Hand Jueyin)' },
    ],
    correctOptionId: 'b',
    targetAcupointId: 'pt_pc9',
    explanationZhHant:
      '手上只走六條經：掌面的肺、心包、心，背面的大腸、三焦、小腸。腎經與胃經都是足經，不到手部。',
    explanationEn:
      'Six channels reach the hand: Lung, Pericardium and Heart on the palmar side; Large Intestine, Triple Energiser and Small Intestine on the dorsal. The Kidney and Stomach are foot channels and do not.',
    relatedAcupointIds: ['pt_pc9', 'pt_te1'],
    sourceIds: [WORKSHEET14],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d14_locate_shenmen',
    dayId: 'day_14',
    kind: 'locate_point',
    promptZhHant: '在腕掌側橫紋的尺側端、尺側腕屈肌腱的橈側凹陷處，是哪一個穴？請在圖上指出。',
    promptEn: 'At the ulnar end of the palmar wrist crease, in the depression radial to the flexor carpi ulnaris tendon — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_ht7',
    explanationZhHant:
      '神門 HT7。與它同在一條橫紋上的還有中點的大陵 PC7 與橈側的太淵 LU9——一條線，三個原穴。',
    explanationEn:
      '神門 HT7. Two more yuan-source points share that crease: 大陵 PC7 at the midpoint and 太淵 LU9 at the radial end — one line, three of them.',
    relatedAcupointIds: ['pt_ht7', 'pt_pc7', 'pt_lu9'],
    sourceIds: [WORKSHEET14],
    reviewStatus: 'unreviewed',
  },
  /* Day 15 — each of these tests one of the errors in the source draft. */
  {
    id: 'qz_d15_chize_side',
    dayId: 'day_15',
    kind: 'multiple_choice',
    promptZhHant: '尺澤 LU5 在肱二頭肌腱的哪一側？',
    promptEn: 'On which side of the biceps tendon does 尺澤 LU5 lie?',
    options: [
      { id: 'a', zhHant: '橈側（外側）', en: 'The radial side — the outer one' },
      { id: 'b', zhHant: '尺側（內側）', en: 'The ulnar side — the inner one' },
      { id: 'c', zhHant: '正在肌腱上', en: 'Directly on the tendon' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lu5',
    explanationZhHant:
      '尺澤在肘橫紋中、肱二頭肌腱的橈側凹陷處。肌腱的另一側（尺側）是心包經的曲澤 PC3。肌腱本身橫在橫紋中間，不在內側。',
    explanationEn:
      '尺澤 is in the cubital crease, in the depression on the RADIAL edge of the biceps tendon. The other edge — the ulnar one — carries 曲澤 PC3 of the Pericardium. The tendon itself crosses the middle of the crease, not its inner end.',
    relatedAcupointIds: ['pt_lu5', 'pt_pc3'],
    sourceIds: [WORKSHEET15],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d15_xiaohai',
    dayId: 'day_15',
    kind: 'multiple_choice',
    promptZhHant: '小海 SI8 在肘的哪一面、哪一側？',
    promptEn: 'Where on the elbow is 小海 SI8?',
    options: [
      { id: 'a', zhHant: '肘後內側：尺骨鷹嘴與肱骨內上髁之間', en: 'Behind the elbow on the medial side, between the olecranon and the medial epicondyle' },
      { id: 'b', zhHant: '肘前外側：橫紋盡頭，貼肱骨外上髁', en: 'In front on the lateral side, at the end of the crease by the lateral epicondyle' },
      { id: 'c', zhHant: '肘前內側：橫紋內側端', en: 'In front on the medial side, at the medial end of the crease' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_si8',
    explanationZhHant:
      '小海在肘後，尺骨鷹嘴與肱骨內上髁之間的凹陷中——是內側，不是外側。選項 B 描述的是曲池 LI11；選項 C 描述的是少海 HT3，與小海共用內上髁這個標志，但一前一後。',
    explanationEn:
      '小海 is BEHIND the elbow, between the olecranon and the medial epicondyle — medial, not lateral. Option B describes 曲池 LI11; option C describes 少海 HT3, which shares the medial epicondyle with 小海 but sits in front of it rather than behind.',
    relatedAcupointIds: ['pt_si8', 'pt_ht3', 'pt_li11'],
    sourceIds: [WORKSHEET15],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d15_corridor',
    dayId: 'day_15',
    kind: 'multiple_choice',
    promptZhHant: '前臂尺骨與橈骨之間的骨間隙，走的是哪一條經？',
    promptEn: 'Which channel runs in the interosseous space between the ulna and radius?',
    options: [
      { id: 'a', zhHant: '手少陽三焦經（外關 TE5、支溝 TE6）', en: 'Triple Energiser (外關 TE5, 支溝 TE6)' },
      { id: 'b', zhHant: '手陽明大腸經（手三里 LI10、溫溜 LI7）', en: 'Large Intestine (手三里 LI10, 溫溜 LI7)' },
      { id: 'c', zhHant: '兩條陽經都走這裡', en: 'Both of those yang channels run there' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_te6',
    explanationZhHant:
      '只有三焦經走骨間隙。大腸經沿前臂背面橈側緣上行，在陽谿與曲池的連線上——所以「陽經走兩骨之間」是一個好記但不成立的通則。同理，兩筋之間只屬心包經，肺經走的是橈側緣。',
    explanationEn:
      'Only the Triple Energiser runs in that space. The Large Intestine follows the RADIAL border of the dorsal forearm, on the 陽谿–曲池 line — so “the yang channels run between the bones” is a memorable rule that is not true. The same applies on the palmar side: the corridor between the two tendons belongs to the Pericardium alone, and the Lung follows the radial border.',
    relatedAcupointIds: ['pt_te6', 'pt_te5', 'pt_li10', 'pt_li7', 'pt_lu6'],
    sourceIds: [WORKSHEET15],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d15_shousanli',
    dayId: 'day_15',
    kind: 'multiple_choice',
    promptZhHant: '手三里 LI10 在肘橫紋下幾寸？',
    promptEn: 'How far below the cubital crease is 手三里 LI10?',
    options: [
      { id: 'a', zhHant: '2 寸', en: '2 cun' },
      { id: 'b', zhHant: '3 寸', en: '3 cun' },
      { id: 'c', zhHant: '5 寸', en: '5 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_li10',
    explanationZhHant:
      '手三里在前臂背面橈側、陽谿與曲池的連線上，肘橫紋下 2 寸。整條前臂是 12 寸，所以它距腕橫紋還有 10 寸。',
    explanationEn:
      '手三里 sits on the radial side of the dorsal forearm, on the 陽谿–曲池 line, 2 cun below the cubital crease. The whole forearm is 12 cun, so it is still 10 cun from the wrist.',
    relatedAcupointIds: ['pt_li10', 'pt_li11'],
    sourceIds: [WORKSHEET15],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d15_locate_ximen',
    dayId: 'day_15',
    kind: 'locate_point',
    promptZhHant: '腕掌側遠端橫紋上 5 寸，掌長肌腱與橈側腕屈肌腱之間——請在圖上指出這個穴。',
    promptEn: '5 cun above the distal palmar wrist crease, between the tendons of palmaris longus and flexor carpi radialis — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_pc4',
    explanationZhHant:
      '郄門 PC4，心包經的郄穴。同一條兩筋走廊由下往上依序是內關 PC6（2 寸）、間使 PC5（3 寸）、郄門 PC4（5 寸）。',
    explanationEn:
      '郄門 PC4, the Pericardium’s xi-cleft point. Going up the same two-tendon corridor: 內關 PC6 at 2 cun, 間使 PC5 at 3, 郄門 PC4 at 5.',
    relatedAcupointIds: ['pt_pc4', 'pt_pc5', 'pt_pc6'],
    sourceIds: [WORKSHEET15],
    reviewStatus: 'unreviewed',
  },
  /* Day 16 — the first two test the errors the source draft carried. */
  {
    id: 'qz_d16_jianliao_channel',
    dayId: 'day_16',
    kind: 'multiple_choice',
    promptZhHant: '肩髎 TE14 屬於哪一條經？',
    promptEn: 'Which channel does 肩髎 TE14 belong to?',
    options: [
      { id: 'a', zhHant: '手少陽三焦經', en: 'Triple Energiser (Hand Shaoyang)' },
      { id: 'b', zhHant: '足少陽膽經', en: 'Gallbladder (Foot Shaoyang)' },
      { id: 'c', zhHant: '手陽明大腸經', en: 'Large Intestine (Hand Yangming)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_te14',
    explanationZhHant:
      '穴號本身就說明了：TE 是三焦經。本區確實有一個膽經穴——肩井 GB21，在肩上大椎與肩峰的中點——但那不是肩髎。前方的肩髃 LI15 才屬大腸經。',
    explanationEn:
      'The code says so: TE is the Triple Energiser. This region does carry one Gallbladder point — 肩井 GB21, on top of the shoulder midway between 大椎 and the acromion — but that is not 肩髎. The Large Intestine point here is 肩髃 LI15, in front.',
    relatedAcupointIds: ['pt_te14', 'pt_gb21', 'pt_li15'],
    sourceIds: [WORKSHEET16],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d16_scapular_region',
    dayId: 'day_16',
    kind: 'multiple_choice',
    promptZhHant: '秉風 SI12 與天宗 SI11 屬於哪一個分區？',
    promptEn: 'Which region do 秉風 SI12 and 天宗 SI11 belong to?',
    options: [
      { id: 'a', zhHant: '肩部及上臂——肩胛區的穴都在本區之內', en: 'Shoulder & upper arm — the scapular points are inside this region' },
      { id: 'b', zhHant: '背部及臀部——只是肩部觸診的鄰居', en: 'Back & gluteal — merely neighbours borrowed for shoulder palpation' },
      { id: 'c', zhHant: '頸部', en: 'Neck' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_si12',
    explanationZhHant:
      '兩者的定位文字都寫「在肩胛區」，本區收錄的四個小腸經肩胛穴——臑俞 SI10、天宗 SI11、秉風 SI12、曲垣 SI13——都屬肩部及上臂，不必當成外借的鄰居。',
    explanationEn:
      'Both records place them 在肩胛區, and all four Small Intestine scapular points this region holds — 臑俞 SI10, 天宗 SI11, 秉風 SI12 and 曲垣 SI13 — belong to Shoulder & upper arm. They are not borrowed from elsewhere.',
    relatedAcupointIds: ['pt_si12', 'pt_si11', 'pt_si10', 'pt_si13'],
    sourceIds: [WORKSHEET16],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d16_binao_end',
    dayId: 'day_16',
    kind: 'multiple_choice',
    promptZhHant: '臂臑 LI14 的 7 寸是從哪一端量起的？',
    promptEn: 'The 7 cun that locates 臂臑 LI14 is measured from which end?',
    options: [
      { id: 'a', zhHant: '從肘量起——曲池上 7 寸', en: 'From the elbow — 7 cun above 曲池' },
      { id: 'b', zhHant: '從腋前紋頭往下 7 寸', en: '7 cun down from the anterior axillary fold' },
      { id: 'c', zhHant: '從肩峰往下 7 寸', en: '7 cun down from the acromion' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_li14',
    explanationZhHant:
      '臂臑在曲池與肩髃的連線上，曲池上 7 寸，落在三角肌止點處。上臂其餘的刻度才是從腋前紋頭往下量的：天泉 2 寸、天府 3 寸。',
    explanationEn:
      '臂臑 lies on the 曲池–肩髃 line, 7 cun above 曲池, at the deltoid insertion. The rest of the upper arm’s ladder is what gets measured down from the anterior axillary fold: 天泉 at 2 cun, 天府 at 3.',
    relatedAcupointIds: ['pt_li14', 'pt_pc2', 'pt_lu3'],
    sourceIds: [WORKSHEET16],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d16_crossings',
    dayId: 'day_16',
    kind: 'multiple_choice',
    promptZhHant: '腕與手區（25 穴）收錄了幾個交會穴？',
    promptEn: 'How many crossing points does the wrist & hand region (25 points) hold?',
    options: [
      { id: 'a', zhHant: '一個也沒有', en: 'None at all' },
      { id: 'b', zhHant: '三個', en: 'Three' },
      { id: 'c', zhHant: '七個', en: 'Seven' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_li15',
    explanationZhHant:
      '手部 0，肘與前臂也是 0——那兩段的經脈各走各的道。七個交會穴屬於肩部：肩髃 LI15、巨骨 LI16、臑俞 SI10、秉風 SI12、臑會 TE13、天髎 TE15、肩井 GB21。',
    explanationEn:
      'None in the hand, and none in the elbow and forearm either — in both, the channels keep to their own lanes. The seven crossing points belong to the shoulder: 肩髃 LI15, 巨骨 LI16, 臑俞 SI10, 秉風 SI12, 臑會 TE13, 天髎 TE15 and 肩井 GB21.',
    relatedAcupointIds: ['pt_li15', 'pt_li16', 'pt_si10', 'pt_si12', 'pt_te13', 'pt_te15', 'pt_gb21'],
    sourceIds: [WORKSHEET16],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d16_locate_jianyu',
    dayId: 'day_16',
    kind: 'locate_point',
    promptZhHant: '三角肌上，臂向前平伸時肩峰前下方出現的凹陷——請在圖上指出這個穴。',
    promptEn: 'On the deltoid, in the depression that appears anteroinferior to the acromion when the arm is raised forward — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_li15',
    explanationZhHant:
      '肩髃 LI15，大腸經的交會穴。它後方約 1 寸是肩髎 TE14，屬三焦經；再往下、腋後紋頭上 1 寸是肩貞 SI9，屬小腸經。',
    explanationEn:
      '肩髃 LI15, a crossing point on the Large Intestine channel. About 1 cun behind it is 肩髎 TE14 of the Triple Energiser, and lower still, 1 cun above the posterior axillary fold, 肩貞 SI9 of the Small Intestine.',
    relatedAcupointIds: ['pt_li15', 'pt_te14', 'pt_si9'],
    sourceIds: [WORKSHEET16],
    reviewStatus: 'unreviewed',
  },
  /* Day 17 — the first three test errors the source drafts carried. */
  {
    id: 'qz_d17_shufu_gap',
    dayId: 'day_17',
    kind: 'multiple_choice',
    promptZhHant: '俞府 KI27 與彧中 KI26 相差多遠？',
    promptEn: 'How far apart are 俞府 KI27 and 彧中 KI26?',
    options: [
      { id: 'a', zhHant: '約 1.6 寸，一個完整的肋間隙', en: 'About 1.6 cun — one whole intercostal space' },
      { id: 'b', zhHant: '約 0.5 寸', en: 'About 0.5 cun' },
      { id: 'c', zhHant: '兩者同在第 1 肋間隙，並列', en: 'Neither — they sit side by side in the 1st space' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ki27',
    explanationZhHant:
      '俞府在鎖骨下緣、第 1 肋的上方；彧中才在第 1 肋間隙裡。兩者上下相鄰，相差一個肋間隙，約 1.6 寸——不是半寸，也不在同一水平。',
    explanationEn:
      '俞府 lies at the lower border of the clavicle, above the 1st rib; it is 彧中 that lies inside the 1st space. They are neighbours one space apart, about 1.6 cun — not half a cun, and not on one level.',
    relatedAcupointIds: ['pt_ki27', 'pt_ki26'],
    sourceIds: [WORKSHEET17],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d17_ki_offset',
    dayId: 'day_17',
    kind: 'multiple_choice',
    promptZhHant: '腎經在胸部旁開前正中線幾寸？',
    promptEn: 'How far lateral to the anterior midline does the Kidney channel run across the chest?',
    options: [
      { id: 'a', zhHant: '2 寸', en: '2 cun' },
      { id: 'b', zhHant: '0.5 寸', en: '0.5 cun' },
      { id: 'c', zhHant: '4 寸', en: '4 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ki23',
    explanationZhHant:
      '胸部六站（KI22–KI27）旁開 2 寸。0.5 寸是腹部十一站（KI11–KI21）的尺，分界在肋弓下緣；4 寸是胃經在胸部的線。',
    explanationEn:
      'The six chest stations (KI22–KI27) run 2 cun out. Half a cun is the abdominal rule for KI11–KI21, changing at the costal arch; 4 cun is the Stomach channel line on the chest.',
    relatedAcupointIds: ['pt_ki23', 'pt_ki16', 'pt_st17'],
    sourceIds: [WORKSHEET17],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d17_sixcun_line',
    dayId: 'day_17',
    kind: 'multiple_choice',
    promptZhHant: '第 1 肋間隙、旁開 6 寸的那個穴屬於哪一條經？',
    promptEn: 'The point in the 1st intercostal space, 6 cun lateral, belongs to which channel?',
    options: [
      { id: 'a', zhHant: '手太陰肺經（中府 LU1）', en: 'Lung (中府 LU1)' },
      { id: 'b', zhHant: '足太陰脾經', en: 'Spleen' },
      { id: 'c', zhHant: '足少陰腎經', en: 'Kidney' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lu1',
    explanationZhHant:
      '6 寸那條線在胸部由兩條經共用：第 1 隙是肺經的中府 LU1，第 2 至第 5 隙才是脾經（周榮、胸鄉、天溪、食竇）。所以本區共有七條經，不是五條。',
    explanationEn:
      'The 6-cun line is shared: the 1st space carries 中府 LU1 of the Lung, and only the 2nd through 5th carry the Spleen (周榮, 胸鄉, 天溪, 食竇). That is why this region holds seven channels, not five.',
    relatedAcupointIds: ['pt_lu1', 'pt_sp20', 'pt_sp17'],
    sourceIds: [WORKSHEET17],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d17_locate_danzhong',
    dayId: 'day_17',
    kind: 'locate_point',
    promptZhHant: '前正中線上，平第 4 肋間隙，兩乳頭連線的中點——請在圖上指出這個穴。',
    promptEn: 'On the anterior midline, level with the 4th intercostal space, midway between the nipples — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_cv17',
    explanationZhHant:
      '膻中 CV17，網格的原點。同一隙由內而外還有神封 KI23（2 寸）、乳中 ST17（4 寸）、天池 PC1（5 寸）、天溪 SP18（6 寸）。',
    explanationEn:
      '膻中 CV17, the origin of the grid. Along the same space, outward: 神封 KI23 at 2 cun, 乳中 ST17 at 4, 天池 PC1 at 5 and 天溪 SP18 at 6.',
    relatedAcupointIds: ['pt_cv17', 'pt_ki23', 'pt_st17', 'pt_pc1', 'pt_sp18'],
    sourceIds: [WORKSHEET17],
    reviewStatus: 'unreviewed',
  },
  /* Day 18 — the first three test errors the source draft carried. */
  {
    id: 'qz_d18_shangqu',
    dayId: 'day_18',
    kind: 'multiple_choice',
    promptZhHant: '商曲 KI17 在臍中上幾寸？',
    promptEn: 'How far above the navel is 商曲 KI17?',
    options: [
      { id: 'a', zhHant: '1 寸', en: '1 cun' },
      { id: 'b', zhHant: '2 寸', en: '2 cun' },
      { id: 'c', zhHant: '3 寸', en: '3 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ki17',
    explanationZhHant:
      '商曲在臍中上 1 寸、旁開 0.5 寸。臍上 2 寸的是石關 KI18，臍上 3 寸的是陰都 KI19——腹部腎經十一站每站正好差 1 寸，數錯一站就整條錯位。',
    explanationEn:
      '商曲 sits 1 cun above the navel, 0.5 cun out. Two cun above is 石關 KI18 and three is 陰都 KI19 — the eleven abdominal Kidney stations are exactly one cun apart, so miscounting one shifts the whole column.',
    relatedAcupointIds: ['pt_ki17', 'pt_ki18', 'pt_ki19'],
    sourceIds: [WORKSHEET18],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d18_riyue_boundary',
    dayId: 'day_18',
    kind: 'multiple_choice',
    promptZhHant: '哪一個穴真正落在肋弓下緣？',
    promptEn: 'Which point actually lies at the lower border of the costal arch?',
    options: [
      { id: 'a', zhHant: '章門 LR13（第 11 肋游離端下方）', en: '章門 LR13, below the free end of the 11th rib' },
      { id: 'b', zhHant: '日月 GB24（第 7 肋間隙）', en: '日月 GB24, in the 7th intercostal space' },
      { id: 'c', zhHant: '中脘 CV12（臍上 4 寸）', en: '中脘 CV12, 4 cun above the navel' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lr13',
    explanationZhHant:
      '章門在第 11 肋游離端下方，也就是肋弓下緣，屬身側及帶脈區（Day 22）。日月在第 7 肋間隙，位於肋弓的上方而非其上；中脘則在肋弓以下的軟組織區。',
    explanationEn:
      '章門 lies below the free end of the 11th rib — the costal arch itself — and belongs to the flank region, Day 22. 日月 sits in the 7th intercostal space, above the arch rather than on it, and 中脘 is well below it in soft tissue.',
    relatedAcupointIds: ['pt_lr13', 'pt_gb24', 'pt_cv12'],
    sourceIds: [WORKSHEET18],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d18_two_cun',
    dayId: 'day_18',
    kind: 'multiple_choice',
    promptZhHant: '旁開 2 寸——在腹部是哪一條經？在胸部又是哪一條？',
    promptEn: 'Two cun lateral — which channel is that on the abdomen, and which on the chest?',
    options: [
      { id: 'a', zhHant: '腹部是胃經，胸部是腎經', en: 'Stomach on the abdomen, Kidney on the chest' },
      { id: 'b', zhHant: '兩段都是胃經', en: 'The Stomach in both' },
      { id: 'c', zhHant: '腹部是腎經，胸部是胃經', en: 'Kidney on the abdomen, Stomach on the chest' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_st25',
    explanationZhHant:
      '2 寸這個數字在肋弓上下屬於不同的經：腹部是胃經（天樞 ST25 平臍旁開 2 寸），胸部是腎經（神封 KI23 等旁開 2 寸）。先問「在肋弓上面還是下面」，才問「旁開幾寸」。',
    explanationEn:
      'The number 2 belongs to different channels on either side of the costal arch: on the abdomen it is the Stomach (天樞 ST25, level with the navel), on the chest the Kidney (神封 KI23 and its column). Ask which side of the arch first, and how far out second.',
    relatedAcupointIds: ['pt_st25', 'pt_ki23'],
    sourceIds: [WORKSHEET18],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d18_locate_tianshu',
    dayId: 'day_18',
    kind: 'locate_point',
    promptZhHant: '橫平臍中，前正中線旁開 2 寸——請在圖上指出這個穴。',
    promptEn: 'Level with the navel, 2 cun lateral to the anterior midline — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_st25',
    explanationZhHant:
      '天樞 ST25，大腸的募穴。同一列由內而外還有神闕 CV8（0）、肓俞 KI16（0.5 寸）與大橫 SP15（4 寸）。',
    explanationEn:
      '天樞 ST25, the Large Intestine’s front-mu point. The same row carries 神闕 CV8 at 0, 肓俞 KI16 at 0.5 and 大橫 SP15 at 4.',
    relatedAcupointIds: ['pt_st25', 'pt_cv8', 'pt_ki16', 'pt_sp15'],
    sourceIds: [WORKSHEET18],
    reviewStatus: 'unreviewed',
  },
  /* Day 19 — the first two test errors the source draft carried. */
  {
    id: 'qz_d19_zhangmen_channel',
    dayId: 'day_19',
    kind: 'multiple_choice',
    promptZhHant: '章門 LR13 在哪一條經上？它是哪一個臟的募穴？',
    promptEn: 'Which channel is 章門 LR13 on, and which organ is it the front-mu point of?',
    options: [
      { id: 'a', zhHant: '肝經上的穴，脾的募穴', en: 'A Liver-channel point, front-mu of the Spleen' },
      { id: 'b', zhHant: '肝經上的穴，肝的募穴', en: 'A Liver-channel point, front-mu of the Liver' },
      { id: 'c', zhHant: '脾經上的穴，脾的募穴', en: 'A Spleen-channel point, front-mu of the Spleen' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lr13',
    explanationZhHant:
      '穴在哪一條經上，和它替哪一個臟收氣，是兩件事。章門在肝經上，募的是脾，兼臟會；肝自己的募穴是期門 LR14，在第 6 肋間隙（Day 17）。京門也一樣：膽經上的穴，募的是腎。',
    explanationEn:
      'Which channel a point sits on and which organ it collects for are separate questions. 章門 sits on the Liver channel and is the front-mu of the Spleen, and the influential point of the zang besides; the Liver’s own front-mu is 期門 LR14 in the 6th intercostal space (Day 17). 京門 is the same shape: a Gallbladder point collecting for the Kidney.',
    relatedAcupointIds: ['pt_lr13', 'pt_lr14', 'pt_gb25'],
    sourceIds: [WORKSHEET19],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d19_region_scope',
    dayId: 'day_19',
    kind: 'multiple_choice',
    promptZhHant: '下列哪一個穴「不」屬於身側及帶脈區？',
    promptEn: 'Which of these does NOT belong to the flank region?',
    options: [
      { id: 'a', zhHant: '居髎 GB29（髂前上棘與股骨大轉子連線中點）', en: '居髎 GB29, midway between the iliac spine and the greater trochanter' },
      { id: 'b', zhHant: '維道 GB28', en: '維道 GB28' },
      { id: 'c', zhHant: '大包 SP21', en: '大包 SP21' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb29',
    explanationZhHant:
      '居髎在髖部，屬「髖胯及大腿」區，之後才走。本區共八個穴：大包 SP21、淵腋 GB22、輒筋 GB23、京門 GB25、帶脈 GB26、五樞 GB27、維道 GB28、章門 LR13。',
    explanationEn:
      '居髎 is on the hip and belongs to the Hip & thigh region, which comes later. This region holds eight points: 大包 SP21, 淵腋 GB22, 輒筋 GB23, 京門 GB25, 帶脈 GB26, 五樞 GB27, 維道 GB28 and 章門 LR13.',
    relatedAcupointIds: ['pt_gb29', 'pt_gb28', 'pt_sp21'],
    sourceIds: [WORKSHEET19],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d19_daimai_level',
    dayId: 'day_19',
    kind: 'multiple_choice',
    promptZhHant: '帶脈 GB26 與腹部哪一個穴同高？',
    promptEn: 'Which abdominal point is 帶脈 GB26 level with?',
    options: [
      { id: 'a', zhHant: '神闕 CV8（臍中）', en: '神闕 CV8, the navel' },
      { id: 'b', zhHant: '關元 CV4（臍下 3 寸）', en: '關元 CV4, 3 cun below the navel' },
      { id: 'c', zhHant: '中脘 CV12（臍上 4 寸）', en: '中脘 CV12, 4 cun above the navel' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb26',
    explanationZhHant:
      '帶脈平臍，就在通過肚臍的那條水平線上。平臍下 3 寸的是五樞 GB27，對應關元的高度；維道 GB28 在五樞前下 0.5 寸。',
    explanationEn:
      '帶脈 lies on the horizontal through the navel itself. The point level with 3 cun below it is 五樞 GB27, matching the height of 關元; 維道 GB28 is half a cun in front of and below 五樞.',
    relatedAcupointIds: ['pt_gb26', 'pt_cv8', 'pt_gb27'],
    sourceIds: [WORKSHEET19],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d19_locate_jingmen',
    dayId: 'day_19',
    kind: 'locate_point',
    promptZhHant: '第 12 肋游離端下方，章門後 1.8 寸——請在圖上指出這個穴。',
    promptEn: 'Below the free end of the 12th rib, 1.8 cun behind 章門 — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_gb25',
    explanationZhHant:
      '京門 GB25，膽經的穴、腎的募穴。它上方相鄰的第 11 肋端下方是章門 LR13，肝經的穴、脾的募穴。',
    explanationEn:
      '京門 GB25, a Gallbladder point and the Kidney’s front-mu. Directly above it, below the free end of the 11th rib, is 章門 LR13 — a Liver point and the Spleen’s front-mu.',
    relatedAcupointIds: ['pt_gb25', 'pt_lr13'],
    sourceIds: [WORKSHEET19],
    reviewStatus: 'unreviewed',
  },
  /* Day 20 — the first two test errors the source draft carried. */
  {
    id: 'qz_d20_weiyang_fu',
    dayId: 'day_20',
    kind: 'multiple_choice',
    promptZhHant: '委陽 BL39 在膀胱經上，但它是哪一個腑的下合穴？',
    promptEn: '委陽 BL39 sits on the Bladder channel, but it is the lower he-sea point of which fu organ?',
    options: [
      { id: 'a', zhHant: '三焦', en: 'The Triple Energiser' },
      { id: 'b', zhHant: '膀胱', en: 'The Bladder' },
      { id: 'c', zhHant: '膽', en: 'The Gallbladder' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_bl39',
    explanationZhHant:
      '穴在哪一條經上，和它是哪一個腑的下合穴，是兩件事。委陽在膀胱經上，卻配三焦；膀胱自己的下合穴是同一條橫紋中點的委中 BL40，膽的是陽陵泉 GB34。',
    explanationEn:
      'Which channel a point sits on and which fu it serves as lower he-sea are separate questions. 委陽 is on the Bladder channel but stands for the Triple Energiser; the Bladder’s own is 委中 BL40 at the midpoint of the same crease, and the Gallbladder’s is 陽陵泉 GB34.',
    relatedAcupointIds: ['pt_bl39', 'pt_bl40', 'pt_gb34'],
    sourceIds: [WORKSHEET20],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d20_region_scope',
    dayId: 'day_20',
    kind: 'multiple_choice',
    promptZhHant: '下列哪一個穴「不」屬於膝部及小腿區？',
    promptEn: 'Which of these does NOT belong to the knee & lower leg region?',
    options: [
      { id: 'a', zhHant: '崑崙 BL60（外踝尖與跟腱之間）', en: '崑崙 BL60, between the lateral malleolus and the Achilles tendon' },
      { id: 'b', zhHant: '承山 BL57', en: '承山 BL57' },
      { id: 'c', zhHant: '陰陵泉 SP9', en: '陰陵泉 SP9' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_bl60',
    explanationZhHant:
      '崑崙在踝區，屬「踝部及足部」，之後才走；太溪 KI3 在跟腱內側，同樣屬踝部。風市 GB31 則在大腿外側，屬「髖胯及大腿」。承山與陰陵泉都在本區。',
    explanationEn:
      '崑崙 is in the ankle region and comes later, as does 太溪 KI3 on the medial side of the same tendon; 風市 GB31 is on the lateral thigh, in Hip & thigh. 承山 and 陰陵泉 are both in this region.',
    relatedAcupointIds: ['pt_bl60', 'pt_bl57', 'pt_sp9'],
    sourceIds: [WORKSHEET20],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d20_eight_influential',
    dayId: 'day_20',
    kind: 'multiple_choice',
    promptZhHant: '陽陵泉 GB34 是八會穴中的哪一會？',
    promptEn: 'Which of the eight influential points is 陽陵泉 GB34?',
    options: [
      { id: 'a', zhHant: '筋會', en: 'The influential point of the sinews' },
      { id: 'b', zhHant: '髓會', en: 'The influential point of the marrow' },
      { id: 'c', zhHant: '脈會', en: 'The influential point of the vessels' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb34',
    explanationZhHant:
      '陽陵泉是筋會，在腓骨頭前下方。髓會是同一條腓骨往下的懸鐘 GB39，外踝尖上 3 寸；脈會是腕上的太淵 LU9（Day 14）。本課只把這些當分類名稱用。',
    explanationEn:
      '陽陵泉 is the influential point of the sinews, below the fibular head. The marrow’s is 懸鐘 GB39 further down the same bone, 3 cun above the lateral malleolus; the vessels’ is 太淵 LU9 at the wrist (Day 14). These are used here as category names only.',
    relatedAcupointIds: ['pt_gb34', 'pt_gb39', 'pt_lu9'],
    sourceIds: [WORKSHEET20],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d20_locate_yanglingquan',
    dayId: 'day_20',
    kind: 'locate_point',
    promptZhHant: '小腿外側，腓骨頭前下方的凹陷處——請在圖上指出這個穴。',
    promptEn: 'On the lateral lower leg, in the depression anterior and inferior to the head of the fibula — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_gb34',
    explanationZhHant:
      '陽陵泉 GB34：膽經合穴、膽的下合穴、八會穴之筋會。沿同一條腓骨往下，外踝尖上 3 寸是髓會懸鐘 GB39。',
    explanationEn:
      '陽陵泉 GB34 — the Gallbladder’s he-sea, its lower he-sea, and the influential point of the sinews. Further down the same fibula, 3 cun above the lateral malleolus, is 懸鐘 GB39 for the marrow.',
    relatedAcupointIds: ['pt_gb34', 'pt_gb39'],
    sourceIds: [WORKSHEET20],
    reviewStatus: 'unreviewed',
  },
  /* Day 21 — the first two test errors the source draft carried. */
  {
    id: 'qz_d21_gb_scalp_line',
    dayId: 'day_21',
    kind: 'multiple_choice',
    promptZhHant: '膽經的頭皮線（目窗、正營、承靈、腦空）旁開頭正中線幾寸？',
    promptEn: 'How far from the midline does the Gallbladder’s scalp line (目窗, 正營, 承靈, 腦空) run?',
    options: [
      { id: 'a', zhHant: '2.25 寸', en: '2.25 cun' },
      { id: 'b', zhHant: '3 寸', en: '3 cun' },
      { id: 'c', zhHant: '1.5 寸', en: '1.5 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb16',
    explanationZhHant:
      '頭皮線是 2.25 寸。3 寸只屬於本神 GB13 一個穴，它在前髮際上 0.5 寸；1.5 寸是膀胱經那條線。把「膽三寸」套在整條頭皮線上是最常見的錯。',
    explanationEn:
      'The scalp line is 2.25. Three cun belongs to 本神 GB13 alone, half a cun above the front hairline; 1.5 is the Bladder’s line. Applying "the Gallbladder at three" to the whole scalp line is the commonest error here.',
    relatedAcupointIds: ['pt_gb16', 'pt_gb13', 'pt_bl7'],
    sourceIds: [WORKSHEET21],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d21_fengfu_fengchi',
    dayId: 'day_21',
    kind: 'multiple_choice',
    promptZhHant: '風府與風池的差別是什麼？',
    promptEn: 'How do 風府 and 風池 differ?',
    options: [
      { id: 'a', zhHant: '風府在後正中線上、靠枕外隆凸；風池在兩側、靠兩條肌肉之間的凹陷。二者同高。', en: '風府 is on the posterior midline against the occipital protuberance; 風池 sits either side of it in the cleft between two muscles. Both at the same height.' },
      { id: 'b', zhHant: '風池在正中線上，風府在兩側', en: '風池 is on the midline and 風府 either side' },
      { id: 'c', zhHant: '二者都在正中線上，相差 1 寸', en: 'Both are on the midline, one cun apart' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gv16',
    explanationZhHant:
      '風府 GV16 屬督脈，在後髮際上 1 寸、枕外隆凸直下；風池 GB20 屬膽經，與風府相平，在胸鎖乳突肌與斜方肌上端之間。一個靠骨定位，一個靠肌肉。',
    explanationEn:
      '風府 GV16 is a Governing-vessel point one cun above the back hairline, directly below the occipital protuberance; 風池 GB20 is a Gallbladder point level with it, between the upper ends of sternocleidomastoid and trapezius. One is fixed by bone, the other by muscle.',
    relatedAcupointIds: ['pt_gv16', 'pt_gb20'],
    sourceIds: [WORKSHEET21],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d21_hairline',
    dayId: 'day_21',
    kind: 'multiple_choice',
    promptZhHant: '百會 GV20 在前髮際正中直上幾寸？',
    promptEn: 'How far above the midpoint of the front hairline is 百會 GV20?',
    options: [
      { id: 'a', zhHant: '5 寸', en: '5 cun' },
      { id: 'b', zhHant: '3 寸', en: '3 cun' },
      { id: 'c', zhHant: '12 寸', en: '12 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gv20',
    explanationZhHant:
      '百會在前髮際上 5 寸，也就是兩耳尖連線的中點。12 寸是前髮際到後髮際的全長；神庭在 0.5 寸、上星在 1 寸。',
    explanationEn:
      '百會 sits 5 cun above the front hairline — also the midpoint of the line between the ear tips. Twelve is the whole span from front hairline to back; 神庭 is at 0.5 and 上星 at 1.',
    relatedAcupointIds: ['pt_gv20', 'pt_gv24', 'pt_gv23'],
    sourceIds: [WORKSHEET21],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d21_locate_baihui',
    dayId: 'day_21',
    kind: 'locate_point',
    promptZhHant: '兩耳尖連線的中點，前髮際正中直上 5 寸——請在圖上指出這個穴。',
    promptEn: 'The midpoint of the line joining the ear tips, 5 cun above the front hairline — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_gv20',
    explanationZhHant:
      '百會 GV20。往前 4.5 寸是上星 GV23，往前 4.5 寸再半寸是神庭 GV24；往後翻過頭頂，枕外隆凸下方是風府 GV16。',
    explanationEn:
      '百會 GV20. Forward along the midline lie 上星 GV23 and 神庭 GV24 near the front hairline; back over the crown, below the occipital protuberance, lies 風府 GV16.',
    relatedAcupointIds: ['pt_gv20', 'pt_gv24', 'pt_gv16'],
    sourceIds: [WORKSHEET21],
    reviewStatus: 'unreviewed',
  },
  /* Day 22 — the first two test errors the source draft carried. */
  {
    id: 'qz_d22_midline',
    dayId: 'day_22',
    kind: 'multiple_choice',
    promptZhHant: '面部正中線上的穴屬於哪些脈？',
    promptEn: 'Which vessels do the points on the facial midline belong to?',
    options: [
      { id: 'a', zhHant: '督脈五個（印堂、素髎、水溝、兌端、齦交）加任脈一個（承漿）', en: 'Five on the Governing vessel (印堂, 素髎, 水溝, 兌端, 齦交) and one on the Conception (承漿)' },
      { id: 'b', zhHant: '全部屬胃經', en: 'All of them on the Stomach channel' },
      { id: 'c', zhHant: '面部沒有正中線上的穴', en: 'The face has no midline points' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gv26',
    explanationZhHant:
      '面部共八條經，督脈與任脈都在其中。正中線是全臉三條組織線之一——漏掉它，印堂與人中（水溝）就沒有位置可掛。',
    explanationEn:
      'Eight channels cross the face, the Governing and Conception vessels among them. The midline is one of the face’s three organising lines — leave it out and 印堂 and the philtrum point 水溝 have nowhere to hang.',
    relatedAcupointIds: ['pt_gv29', 'pt_gv26', 'pt_cv24'],
    sourceIds: [WORKSHEET22],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d22_notch_foramen',
    dayId: 'day_22',
    kind: 'multiple_choice',
    promptZhHant: '攢竹 BL2 在眉頭凹陷中的哪一個結構上？',
    promptEn: 'Which structure carries 攢竹 BL2 at the inner end of the eyebrow?',
    options: [
      { id: 'a', zhHant: '眶上切跡', en: 'The supraorbital notch' },
      { id: 'b', zhHant: '眶上孔', en: 'The supraorbital foramen' },
      { id: 'c', zhHant: '眶下孔', en: 'The infraorbital foramen' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_bl2',
    explanationZhHant:
      '記錄寫的是眶上切跡——骨緣上的一道缺口。眶下孔才是一個孔，那是四白 ST2 的位置，在瞳孔直下、眼睛的下方。',
    explanationEn:
      'The record says the supraorbital NOTCH — a gap in the bone’s edge. The infraorbital FORAMEN is a hole, and it is where 四白 ST2 sits, below the eye on the pupil line.',
    relatedAcupointIds: ['pt_bl2', 'pt_st2'],
    sourceIds: [WORKSHEET22],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d22_tragus_order',
    dayId: 'day_22',
    kind: 'multiple_choice',
    promptZhHant: '貼著耳屏由上而下的三個穴，依序屬於哪三條經？',
    promptEn: 'Down the tragus, top to bottom, the three points belong to which channels in order?',
    options: [
      { id: 'a', zhHant: '三焦（耳門）→ 小腸（聽宮）→ 膽（聽會）', en: 'Triple Energiser (耳門) → Small Intestine (聽宮) → Gallbladder (聽會)' },
      { id: 'b', zhHant: '小腸 → 三焦 → 膽', en: 'Small Intestine → Triple Energiser → Gallbladder' },
      { id: 'c', zhHant: '三個都屬膽經', en: 'All three on the Gallbladder' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_si19',
    explanationZhHant:
      '耳門 TE21 在耳屏上切跡前，聽宮 SI19 在耳屏正中前方，聽會 GB2 在耳屏間切跡前。三個穴貼在同一塊軟骨上，卻分屬三條經。',
    explanationEn:
      '耳門 TE21 in front of the supratragic notch, 聽宮 SI19 in front of the centre of the tragus, 聽會 GB2 in front of the intertragic notch. Three points on one piece of cartilage, on three different channels.',
    relatedAcupointIds: ['pt_te21', 'pt_si19', 'pt_gb2'],
    sourceIds: [WORKSHEET22],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d22_locate_sibai',
    dayId: 'day_22',
    kind: 'locate_point',
    promptZhHant: '瞳孔直下，眶下孔凹陷處——請在圖上指出這個穴。',
    promptEn: 'Directly below the pupil, in the depression of the infraorbital foramen — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_st2',
    explanationZhHant:
      '四白 ST2。同一條瞳孔垂線上，它的上方是承泣 ST1，下方依序是巨髎 ST3 與地倉 ST4。',
    explanationEn:
      '四白 ST2. On the same vertical through the pupil, 承泣 ST1 lies above it and 巨髎 ST3 then 地倉 ST4 below.',
    relatedAcupointIds: ['pt_st2', 'pt_st1', 'pt_st3', 'pt_st4'],
    sourceIds: [WORKSHEET22],
    reviewStatus: 'unreviewed',
  },
  /* Day 23 — the first two test errors the source draft carried. */
  {
    id: 'qz_d23_tianchuang_code',
    dayId: 'day_23',
    kind: 'multiple_choice',
    promptZhHant: '天窗是哪一個穴號？',
    promptEn: 'What is the code for 天窗?',
    options: [
      { id: 'a', zhHant: 'SI16', en: 'SI16' },
      { id: 'b', zhHant: 'SI15', en: 'SI15' },
      { id: 'c', zhHant: 'SI17', en: 'SI17' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_si16',
    explanationZhHant:
      '天窗是 SI16，在胸鎖乳突肌後緣、橫平喉結。SI17 是天容，在下頜角後方的前緣；SI15 是肩中俞，在第 7 頸椎旁開 2 寸的背上，根本不在頸部這一區。',
    explanationEn:
      '天窗 is SI16, on the posterior border of the sternocleidomastoid level with the laryngeal prominence. SI17 is 天容, on the anterior border behind the angle of the jaw; SI15 is 肩中俞, out on the back 2 cun lateral to the 7th cervical vertebra, not in this region at all.',
    relatedAcupointIds: ['pt_si16', 'pt_si17'],
    sourceIds: [WORKSHEET23],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d23_futu_border',
    dayId: 'day_23',
    kind: 'multiple_choice',
    promptZhHant: '扶突 LI18 在胸鎖乳突肌的哪一邊？',
    promptEn: 'On which border of the sternocleidomastoid does 扶突 LI18 lie?',
    options: [
      { id: 'a', zhHant: '前緣，與人迎同高', en: 'The anterior border, level with 人迎' },
      { id: 'b', zhHant: '後緣，與天窗同高', en: 'The posterior border, level with 天窗' },
      { id: 'c', zhHant: '肌腹正中', en: 'The middle of the muscle belly' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_li18',
    explanationZhHant:
      '記錄寫的是「胸鎖乳突肌前緣，結喉旁，橫平喉結」——前緣。後緣同高的是天窗 SI16。三個穴平喉結：前緣兩個（扶突、人迎），後緣一個（天窗）。',
    explanationEn:
      'Its record reads "on the anterior border of the sternocleidomastoid, beside and level with the laryngeal prominence." The point at that height on the posterior border is 天窗 SI16. Three points share the level: two in front, one behind.',
    relatedAcupointIds: ['pt_li18', 'pt_st9', 'pt_si16'],
    sourceIds: [WORKSHEET23],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d23_region_scope',
    dayId: 'day_23',
    kind: 'multiple_choice',
    promptZhHant: '下列哪一個穴「不」屬於頸部區？',
    promptEn: 'Which of these does NOT belong to the neck region?',
    options: [
      { id: 'a', zhHant: '風池 GB20（枕骨下緣）', en: '風池 GB20, below the occipital bone' },
      { id: 'b', zhHant: '天牖 TE16', en: '天牖 TE16' },
      { id: 'c', zhHant: '氣舍 ST11', en: '氣舍 ST11' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb20',
    explanationZhHant:
      '風池在枕骨之下，屬頭部（Day 21）；翳風 TE17 在耳垂後方，屬面部（Day 22）。本區十個穴：扶突、天鼎、人迎、水突、氣舍、天窗、天容、天牖、廉泉、天突。',
    explanationEn:
      '風池 sits below the occipital bone and belongs to the head (Day 21); 翳風 TE17 behind the earlobe belongs to the face (Day 22). This region holds ten: 扶突, 天鼎, 人迎, 水突, 氣舍, 天窗, 天容, 天牖, 廉泉 and 天突.',
    relatedAcupointIds: ['pt_gb20', 'pt_te16', 'pt_st11'],
    sourceIds: [WORKSHEET23],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d23_locate_tiantu',
    dayId: 'day_23',
    kind: 'locate_point',
    promptZhHant: '前正中線上，胸骨上窩中央——請在圖上指出這個穴。',
    promptEn: 'On the anterior midline, at the centre of the suprasternal fossa — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_cv22',
    explanationZhHant:
      '天突 CV22，頸部的下界。往上沿正中線是廉泉 CV23（舌骨上緣）；往下就進入胸部，天突到胸劍聯合是 9 寸（Day 17）。',
    explanationEn:
      '天突 CV22, the lower limit of the neck. Up the midline is 廉泉 CV23 at the upper border of the hyoid; below it the chest begins, and 天突 to the xiphisternal junction is 9 cun (Day 17).',
    relatedAcupointIds: ['pt_cv22', 'pt_cv23'],
    sourceIds: [WORKSHEET23],
    reviewStatus: 'unreviewed',
  },
  /* Day 24 — the first two test errors the source draft carried. */
  {
    id: 'qz_d24_lateral_ruler',
    dayId: 'day_24',
    kind: 'multiple_choice',
    promptZhHant: '大腿外側以股骨大轉子至膕橫紋計，是幾寸？',
    promptEn: 'Measured from the greater trochanter to the popliteal crease, how long is the lateral thigh?',
    options: [
      { id: 'a', zhHant: '19 寸', en: '19 cun' },
      { id: 'b', zhHant: '14 寸', en: '14 cun' },
      { id: 'c', zhHant: '18 寸', en: '18 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gb31',
    explanationZhHant:
      '外側是 19 寸。14 寸是後面那一段（臀橫紋至膕橫紋），18 寸是內側（恥骨聯合上緣至股骨內上髁上緣）。三個面三把尺——風市在膕橫紋上 7 寸，不是任何一段的中點。',
    explanationEn:
      'The lateral thigh is 19. Fourteen belongs to the back (gluteal crease to popliteal crease) and 18 to the inside (pubic symphysis to medial epicondyle). Three faces, three rulers — and 風市 sits 7 cun above the popliteal crease, which is not the midpoint of any of them.',
    relatedAcupointIds: ['pt_gb31', 'pt_bl36', 'pt_sp10'],
    sourceIds: [WORKSHEET24],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d24_region_scope',
    dayId: 'day_24',
    kind: 'multiple_choice',
    promptZhHant: '下列哪一個穴「不」屬於髖胯及大腿區？',
    promptEn: 'Which of these does NOT belong to the hip & thigh region?',
    options: [
      { id: 'a', zhHant: '急脈 LR12（恥骨聯合下緣旁開 2.5 寸）', en: '急脈 LR12, 2.5 cun lateral to the lower border of the pubic symphysis' },
      { id: 'b', zhHant: '陰包 LR9', en: '陰包 LR9' },
      { id: 'c', zhHant: '中瀆 GB32', en: '中瀆 GB32' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lr12',
    explanationZhHant:
      '急脈在腹股溝，屬腹部及腹股溝區（Day 18）。本區的肝經穴是陰包 LR9、足五里 LR10、陰廉 LR11 三個，全在大腿內側。',
    explanationEn:
      '急脈 is in the groin and belongs to Abdomen & groin (Day 18). This region’s Liver points are 陰包 LR9, 足五里 LR10 and 陰廉 LR11, all on the medial thigh.',
    relatedAcupointIds: ['pt_lr12', 'pt_lr9', 'pt_gb32'],
    sourceIds: [WORKSHEET24],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d24_st_line',
    dayId: 'day_24',
    kind: 'multiple_choice',
    promptZhHant: '伏兔 ST32 在髕底上幾寸？',
    promptEn: 'How far above the patellar base is 伏兔 ST32?',
    options: [
      { id: 'a', zhHant: '6 寸', en: '6 cun' },
      { id: 'b', zhHant: '3 寸', en: '3 cun' },
      { id: 'c', zhHant: '2 寸', en: '2 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_st32',
    explanationZhHant:
      '胃經前線由下而上是 2、3、6：梁丘 ST34 在 2 寸、陰市 ST33 在 3 寸、伏兔 ST32 在 6 寸，四個穴同在髂前上棘與髕底外側端的連線上。',
    explanationEn:
      'Up the Stomach’s front line the numbers run 2, 3, 6: 梁丘 ST34 at two, 陰市 ST33 at three, 伏兔 ST32 at six — all on the line from the anterior superior iliac spine to the lateral end of the patellar base.',
    relatedAcupointIds: ['pt_st32', 'pt_st33', 'pt_st34'],
    sourceIds: [WORKSHEET24],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d24_locate_chengfu',
    dayId: 'day_24',
    kind: 'locate_point',
    promptZhHant: '大腿後面，臀下橫紋的中點——請在圖上指出這個穴。',
    promptEn: 'On the back of the thigh, at the midpoint of the gluteal crease — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_bl36',
    explanationZhHant:
      '承扶 BL36，臀部與大腿的分界。沿它與委中的連線往下 6 寸是殷門 BL37；這一面全長 14 寸。',
    explanationEn:
      '承扶 BL36, where buttock becomes thigh. Six cun down the line toward 委中 is 殷門 BL37; the whole face measures 14 cun.',
    relatedAcupointIds: ['pt_bl36', 'pt_bl37'],
    sourceIds: [WORKSHEET24],
    reviewStatus: 'unreviewed',
  },
  /* Day 25 — the first two test errors the source draft carried. */
  {
    id: 'qz_d25_rulers',
    dayId: 'day_25',
    kind: 'multiple_choice',
    promptZhHant: '「內踝尖至足底 = 13 寸」——這句話對嗎？',
    promptEn: 'Is it correct to say the medial malleolus to the sole is 13 cun?',
    options: [
      { id: 'a', zhHant: '不對。13 寸是脛骨內側髁下方至內踝尖，屬小腿', en: 'No. Thirteen cun runs from below the medial tibial condyle to the malleolus — a lower-leg measure' },
      { id: 'b', zhHant: '對，13 寸是踝到足底的標準骨度', en: 'Yes, 13 cun is the standard malleolus-to-sole measure' },
      { id: 'c', zhHant: '不對，應該是 16 寸', en: 'No, it should be 16 cun' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_ki3',
    explanationZhHant:
      '13 寸與 16 寸都是小腿的尺（Day 20）：13 寸自脛骨內側髁下方至內踝尖，16 寸自膝中至外踝尖。踝足這一區沒有自己的長度尺，靠的是甲角、蹼緣、蹠骨間隙與踝的三個標志。',
    explanationEn:
      'Both 13 and 16 cun are lower-leg measures (Day 20): 13 from below the medial tibial condyle to the medial malleolus, 16 from the middle of the knee to the lateral. The ankle and foot have no length ruler of their own — they use nail corners, web margins, the spaces between metatarsals and the ankle’s three landmarks.',
    relatedAcupointIds: ['pt_ki3', 'pt_bl60'],
    sourceIds: [WORKSHEET25],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d25_sanyinjiao_region',
    dayId: 'day_25',
    kind: 'multiple_choice',
    promptZhHant: '三陰交 SP6 屬於哪一個分區？',
    promptEn: 'Which region does 三陰交 SP6 belong to?',
    options: [
      { id: 'a', zhHant: '膝部及小腿（內踝尖上 3 寸）', en: 'Knee & lower leg — three cun above the medial malleolus' },
      { id: 'b', zhHant: '踝部及足部', en: 'Ankle & foot' },
      { id: 'c', zhHant: '髖胯及大腿', en: 'Hip & thigh' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_sp6',
    explanationZhHant:
      '三陰交在內踝尖上 3 寸，已經在小腿上，屬 Day 20 那一區。踝足區最上面的穴是踝周那一圈——太溪、崑崙、丘墟、解溪。',
    explanationEn:
      '三陰交 sits three cun above the medial malleolus, already on the lower leg, in the Day 20 region. The highest points of the ankle and foot are the ring around the joint itself — 太溪, 崑崙, 丘墟, 解溪.',
    relatedAcupointIds: ['pt_sp6', 'pt_ki3', 'pt_bl60'],
    sourceIds: [WORKSHEET25],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d25_great_toe',
    dayId: 'day_25',
    kind: 'multiple_choice',
    promptZhHant: '大趾外側甲角旁的井穴屬於哪一條經？',
    promptEn: 'The jing-well point at the LATERAL nail corner of the great toe belongs to which channel?',
    options: [
      { id: 'a', zhHant: '足厥陰肝經（大敦 LR1）', en: 'Liver (大敦 LR1)' },
      { id: 'b', zhHant: '足太陰脾經（隱白 SP1）', en: 'Spleen (隱白 SP1)' },
      { id: 'c', zhHant: '足陽明胃經（厲兌 ST45）', en: 'Stomach (厲兌 ST45)' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_lr1',
    explanationZhHant:
      '大趾兩側各有一個井穴：內側是脾經的隱白 SP1，外側是肝經的大敦 LR1。厲兌在第 2 趾。這和手上小指的少衝（內側，心經）與少澤（外側，小腸經）是同一種安排。',
    explanationEn:
      'The great toe carries one on each side: 隱白 SP1 of the Spleen medially, 大敦 LR1 of the Liver laterally. 厲兌 is on the second toe. The same arrangement as 少衝 and 少澤 on the little finger.',
    relatedAcupointIds: ['pt_lr1', 'pt_sp1', 'pt_st45'],
    sourceIds: [WORKSHEET25],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d25_locate_taixi',
    dayId: 'day_25',
    kind: 'locate_point',
    promptZhHant: '內踝尖與跟腱之間的凹陷中——請在圖上指出這個穴。',
    promptEn: 'In the depression between the tip of the medial malleolus and the Achilles tendon — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_ki3',
    explanationZhHant:
      '太溪 KI3，腎經原穴。同一條跟腱的外側、外踝與跟腱之間是崑崙 BL60。',
    explanationEn:
      '太溪 KI3, the Kidney’s yuan-source. On the far side of the same tendon, between it and the lateral malleolus, is 崑崙 BL60.',
    relatedAcupointIds: ['pt_ki3', 'pt_bl60'],
    sourceIds: [WORKSHEET25],
    reviewStatus: 'unreviewed',
  },
  /* Day 26 — the two boundary errors and the two structures the draft missed. */
  {
    id: 'qz_d26_no_gallbladder',
    dayId: 'day_26',
    kind: 'multiple_choice',
    promptZhHant: '背部及臀部這一區走哪三條經？',
    promptEn: 'Which three channels does the back and gluteal region carry?',
    options: [
      { id: 'a', zhHant: '膀胱經、督脈、小腸經', en: 'Bladder, Governing vessel, Small Intestine' },
      { id: 'b', zhHant: '膀胱經、督脈、膽經', en: 'Bladder, Governing vessel, Gallbladder' },
      { id: 'c', zhHant: '膀胱經、督脈、胃經', en: 'Bladder, Governing vessel, Stomach' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_si15',
    explanationZhHant:
      '膀胱 39 個、督脈 13 個、小腸 2 個，共 54 個。小腸經的兩站是肩中俞 SI15（第 7 頸椎棘突下旁開 2 寸）與肩外俞 SI14（第 1 胸椎棘突下旁開 3 寸）。膽經一個穴也沒有——環跳 GB30 在髖胯及大腿（Day 24）。',
    explanationEn:
      'Thirty-nine Bladder, thirteen Governing vessel and two Small Intestine — fifty-four in all. The Small Intestine’s two stations are 肩中俞 SI15, 2 cun below the C7 spinous process, and 肩外俞 SI14, 3 cun below T1. There is no Gallbladder point here at all: 環跳 GB30 is in hip and thigh (Day 24).',
    relatedAcupointIds: ['pt_si15', 'pt_si14', 'pt_bl23', 'pt_gv4'],
    sourceIds: [WORKSHEET26],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d26_dazhui_region',
    dayId: 'day_26',
    kind: 'multiple_choice',
    promptZhHant: '大椎 GV14 屬於哪一個分區？',
    promptEn: 'Which region does 大椎 GV14 belong to?',
    options: [
      { id: 'a', zhHant: '頭部（第 7 頸椎棘突下，與風府同區）', en: 'Head — below the C7 spinous process, the same region as 風府' },
      { id: 'b', zhHant: '背部及臀部', en: 'Back & gluteal' },
      { id: 'c', zhHant: '頸部', en: 'Neck' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_gv14',
    explanationZhHant:
      '大椎在第 7 頸椎棘突下，本資料集把它與風府 GV16 一同歸在頭部（Day 21）。背部這一區的督脈從第 1 胸椎下的陶道 GV13 起算，止於尾骨下方的長強 GV1。C7 仍然是數棘突的起點，只是它下面那個穴不屬於本區。',
    explanationEn:
      '大椎 sits below the 7th cervical spinous process, and this dataset places it in the head with 風府 GV16 (Day 21). This region’s Governing vessel runs from 陶道 GV13 below T1 down to 長強 GV1 beneath the coccyx. C7 is still where the counting starts — the point below it just belongs to another region.',
    relatedAcupointIds: ['pt_gv14', 'pt_gv13', 'pt_gv1'],
    sourceIds: [WORKSHEET26],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d26_shu_mu',
    dayId: 'day_26',
    kind: 'multiple_choice',
    promptZhHant: '腎俞 BL23 在身體前面配哪一個募穴？',
    promptEn: 'Which front-mu point pairs with 腎俞 BL23?',
    options: [
      { id: 'a', zhHant: '京門 GB25（第 12 肋游離端下方，身側）', en: '京門 GB25 — below the free end of the 12th rib, on the flank' },
      { id: 'b', zhHant: '章門 LR13（第 11 肋游離端下方）', en: '章門 LR13 — below the free end of the 11th rib' },
      { id: 'c', zhHant: '巨闕 CV14（臍中上 6 寸）', en: '巨闕 CV14 — six cun above the navel' },
    ],
    correctOptionId: 'a',
    targetAcupointId: 'pt_bl23',
    explanationZhHant:
      '京門 GB25 是腎的募穴，在第 12 肋游離端下方（Day 19 的身側）。章門 LR13 配脾俞 BL20，巨闕 CV14 配心俞 BL15。俞穴在背後第一側線上，募穴在身體前面或側面——一臟兩記號。',
    explanationEn:
      '京門 GB25 is the Kidney’s front-mu point, below the free end of the 12th rib (the flank, Day 19). 章門 LR13 pairs with 脾俞 BL20 and 巨闕 CV14 with 心俞 BL15. The shu point lies on the back’s first line, the mu point on the front or side — two marks for one organ.',
    relatedAcupointIds: ['pt_bl23', 'pt_gb25', 'pt_lr13', 'pt_cv14', 'pt_bl20', 'pt_bl15'],
    sourceIds: [WORKSHEET26],
    reviewStatus: 'unreviewed',
  },
  {
    id: 'qz_d26_locate_shenshu',
    dayId: 'day_26',
    kind: 'locate_point',
    promptZhHant: '第 2 腰椎棘突下，後正中線旁開 1.5 寸——請在圖上指出這個穴。',
    promptEn: 'Below the second lumbar spinous process, 1.5 cun lateral to the posterior midline — locate this point on the figure.',
    options: [],
    correctOptionId: null,
    targetAcupointId: 'pt_bl23',
    explanationZhHant:
      '腎俞 BL23，十二背俞穴之一。同一個高度上，正中是命門 GV4，旁開 3 寸是志室 BL52。',
    explanationEn:
      '腎俞 BL23, one of the twelve back-shu points. At the same height, 命門 GV4 lies on the midline and 志室 BL52 3 cun out.',
    relatedAcupointIds: ['pt_bl23', 'pt_gv4', 'pt_bl52'],
    sourceIds: [WORKSHEET26],
    reviewStatus: 'unreviewed',
  },
];
