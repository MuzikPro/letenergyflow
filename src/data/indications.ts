/**
 * 功效與主治 — traditional actions and indications, Lung channel.
 *
 * The owner decided on 2026-08-13 to carry these in the point detail. They are
 * traditional teaching claims, not verified medical facts, and they are stored
 * in their own typed fields so that nothing else in the app inherits their
 * status: a location stays a location, a classification stays a classification.
 *
 * WHERE THIS COMES FROM — nothing here is composed by the app. Two files
 * already in the repository carry it, both written by the owner:
 *
 *   `Learn content/review-worksheet-filled.md`, 備註 field
 *   `26天经络穴位全掌握_部位检索表.md`, 主治方向 column
 *
 * Which one attests which field varies by point, so each entry may name its
 * own. On the Lung the table supplies 主治; on the Large Intestine the
 * worksheet's 備註 carries a fuller list for all twenty points where the table
 * reaches only thirteen, so the worksheet is cited there instead.
 *
 * A point whose source says nothing gets `null`, and the UI says so. Guessing
 * the missing ones from general knowledge would be inventing a citation, which
 * the project rules forbid outright.
 *
 * WHAT IS STRIPPED, and why it stays stripped. The worksheet's 備註 field mixes
 * actions with needling instructions, and the index table's 主治 column mixes
 * indications with technique. Those are excluded whatever the decision about
 * indications, because they are the one category the safety rules name flatly:
 *
 *   LU1  「針刺宜向外斜刺 0.5–0.8 寸，不可向內深刺以免傷肺」 — depth and angle
 *   LU8  「注意避開橈動脈」 / LU9「針刺避開橈動脈」          — needling caution
 *   LU11 「常點刺出血」 / 「急救放血」                        — bloodletting, first aid
 *
 * LU1 and LU9 therefore have no recorded action: everything their 備註 field
 * said was technique. That is why they read as blank rather than as short.
 *
 * The 中文 is the source's own wording — verbatim, except that the index table
 * is written simplified and is regularised here to traditional, and that a
 * trailing technique clause is cut where one exists (LU8, LU11). A test holds
 * every string to that: each one has to be findable in the file it cites, so
 * "the source says so" cannot quietly become "the app says so". The English is
 * this project's translation, not the source's.
 *
 * The model-written entries that cover the points no file reaches live in
 * `indications.model.ts`, not here. That is a strip seam, not tidiness: the
 * shared build aliases that module away so its strings never enter the bundle.
 * Adding a model-written entry to this file would put it beyond the strip's
 * reach — a test asserts nothing in the table below cites the model source.
 */
import { modelWritten } from './indications.model';

const WORKSHEET = 'src_owner_worksheet_2026_08';
const INDEX_TABLE = 'src_owner_index_table_2026_08';

/**
 * The one id that means "no document behind this".
 *
 * Exported because two other places have to be able to recognise it: the sheet
 * marks such a claim differently from a merely unreviewed one, and the tests
 * partition on it — a file-sourced entry must be findable in its file, and a
 * model-written one cannot be, so a single traceability rule over both would
 * have to be weakened to the point of proving nothing.
 */
export const MODEL_SOURCE_ID = 'src_model_unverified';

export interface IndicationEntry {
  /** 功效 — what the tradition says the point does. */
  actionsZh: string | null;
  actionsEn: string | null;
  /** 主治 — the complaints the curriculum lists it under. */
  indicationsZh: string | null;
  indicationsEn: string | null;
  /**
   * Which file attests each field, per point rather than per channel.
   *
   * The two sources overlap and neither is complete. On the Lung the index
   * table carries the 主治; on the Large Intestine the worksheet's 備註 field
   * carries a fuller one for all twenty points and the table only reaches
   * thirteen. Recording the attesting source per point is the only way the
   * traceability check can mean anything once that varies.
   */
  actionsSrc?: string[];
  indicationsSrc?: string[];
}

export const indicationsByCode: Record<string, IndicationEntry> = {
  LU1: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽、氣喘',
    indicationsEn: 'Cough, wheezing',
  },
  LU2: {
    actionsZh: '宣肺止咳、瀉胸中熱邪',
    actionsEn: 'Diffuses the lung and stops cough; drains heat from the chest',
    indicationsZh: '咳嗽、氣喘',
    indicationsEn: 'Cough, wheezing',
  },
  LU3: {
    actionsZh: '清肺涼血、調氣止血',
    actionsEn: 'Clears the lung and cools the blood; regulates qi and stops bleeding',
    indicationsZh: '咳嗽、氣喘',
    indicationsEn: 'Cough, wheezing',
  },
  LU4: {
    actionsZh: '寬胸和胃、調氣降逆',
    actionsEn: 'Loosens the chest and harmonises the stomach; regulates qi and directs it downward',
    indicationsZh: null,
    indicationsEn: null,
  },
  LU5: {
    actionsZh: '合主逆氣而泄；肺熱實證要穴',
    actionsEn:
      'As a he-sea point, said to govern counterflow qi and diarrhoea; used for repletion patterns with lung heat',
    indicationsZh: '咳嗽、氣喘',
    indicationsEn: 'Cough, wheezing',
  },
  LU6: {
    actionsZh: '郄主痛；善治咯血、鼻衄、咽喉腫痛',
    actionsEn:
      'As a xi-cleft point, said to govern pain; used for coughing blood, nosebleed and sore swollen throat',
    indicationsZh: '咯血、咳嗽',
    indicationsEn: 'Coughing blood, cough',
  },
  LU7: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽、頭痛、項強',
    indicationsEn: 'Cough, headache, stiff neck',
  },
  LU8: {
    actionsZh: '經主喘咳寒熱',
    actionsEn:
      'As a jing-river point, said to govern wheezing, cough, and alternating cold and heat',
    indicationsZh: null,
    indicationsEn: null,
  },
  LU9: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽、氣喘、無脈症',
    indicationsEn: 'Cough, wheezing, pulseless conditions',
  },
  LU10: {
    actionsZh: '滎主身熱；清肺泄熱',
    actionsEn:
      'As a ying-spring point, said to govern generalised heat; clears the lung and drains heat',
    indicationsZh: null,
    indicationsEn: null,
  },
  LU11: {
    actionsZh: '井主心下滿；醒神開竅',
    actionsEn:
      'As a jing-well point, said to govern fullness below the heart; rouses the spirit and opens the orifices',
    indicationsZh: '咽喉腫痛',
    indicationsEn: 'Sore swollen throat',
  },

  /* --- 手陽明大腸經 ---------------------------------------------------------
   * 功效 is the 「…主…」 clause where the worksheet gives one; 主治 is its
   * 「治…」 clause, which covers all twenty points where the index table
   * reaches thirteen. LI4 合谷 is the exception in both columns — see below.
   */
  LI1: {
    // 「淺刺 0.1 寸或點刺出血」 cut: depth and bloodletting.
    actionsZh: '井穴主熱證、急症',
    actionsEn: 'As a jing-well point, said to govern heat patterns and acute conditions',
    // 「急救」 cut from the table's 「咽喉腫痛、急救」: first-aid framing.
    indicationsZh: '咽喉腫痛',
    indicationsEn: 'Sore swollen throat',
  },
  LI2: {
    actionsZh: '滎主身熱',
    actionsEn: 'As a ying-spring point, said to govern generalised heat',
    indicationsZh: '齒痛、目痛、咽喉腫痛',
    indicationsEn: 'Toothache, eye pain, sore swollen throat',
    indicationsSrc: [WORKSHEET],
  },
  LI3: {
    actionsZh: '輸主體重節痛',
    actionsEn: 'As a shu-stream point, said to govern heaviness of the body and aching joints',
    indicationsZh: '手背腫痛、腹脹腸鳴',
    indicationsEn: 'Swelling and pain of the back of the hand, abdominal distension, borborygmus',
    indicationsSrc: [WORKSHEET],
  },
  LI4: {
    /*
     * 合谷's remark is 「孕婦禁針（可能引產）；四總穴歌：「面口合谷收」」 — a
     * pregnancy needling contraindication, then a mnemonic already carried in
     * data/functions.ts. Neither is an action, so the best-known point on this
     * channel shows none. Saying so is the point of the field.
     */
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '面口病症、止痛萬能穴',
    indicationsEn: 'Disorders of the face and mouth; called an all-purpose point for pain',
  },
  LI5: {
    actionsZh: '經主喘咳寒熱',
    actionsEn:
      'As a jing-river point, said to govern wheezing, cough, and alternating cold and heat',
    indicationsZh: '頭痛、目赤腫痛',
    indicationsEn: 'Headache, red swollen painful eyes',
    indicationsSrc: [WORKSHEET],
  },
  LI6: {
    actionsZh: '絡穴主表裡經病',
    actionsEn:
      'As a luo-connecting point, said to govern disorders of the interior–exterior paired channels',
    indicationsZh: '水腫、耳鳴',
    indicationsEn: 'Oedema, tinnitus',
    indicationsSrc: [WORKSHEET],
  },
  LI7: {
    actionsZh: '郄穴主急性病',
    actionsEn: 'As a xi-cleft point, said to govern acute conditions',
    indicationsZh: '腸鳴腹痛、腫瘤瘰癧',
    indicationsEn: 'Borborygmus and abdominal pain; masses and scrofula',
    indicationsSrc: [WORKSHEET],
  },
  LI8: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '肘臂痛、頭痛、目痛',
    indicationsEn: 'Pain of the elbow and arm, headache, eye pain',
    indicationsSrc: [WORKSHEET],
  },
  LI9: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '肘臂痛、腸鳴腹痛',
    indicationsEn: 'Pain of the elbow and arm, borborygmus and abdominal pain',
    indicationsSrc: [WORKSHEET],
  },
  LI10: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '上肢不遂、腹痛腹瀉',
    indicationsEn: 'Impaired movement of the upper limb, abdominal pain and diarrhoea',
    indicationsSrc: [WORKSHEET],
  },
  LI11: {
    actionsZh: '合主逆氣而泄',
    actionsEn: 'As a he-sea point, said to govern counterflow qi and diarrhoea',
    indicationsZh: '皮膚病、高血壓、發熱',
    indicationsEn: 'Skin disorders, high blood pressure, fever',
    indicationsSrc: [WORKSHEET],
  },
  LI12: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '肘臂痛、上肢麻木',
    indicationsEn: 'Pain of the elbow and arm, numbness of the upper limb',
    indicationsSrc: [WORKSHEET],
  },
  LI13: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '肘臂攣痛、上肢不遂、瘰癧',
    indicationsEn: 'Cramping pain of the elbow and arm, impaired movement of the upper limb, scrofula',
    indicationsSrc: [WORKSHEET],
  },
  LI14: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '肩臂痛、頸項強急、目疾',
    indicationsEn: 'Pain of the shoulder and arm, stiffness of the neck, eye disorders',
    indicationsSrc: [WORKSHEET],
  },
  LI15: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '肩臂痛、上肢不遂、肩關節炎',
    indicationsEn: 'Pain of the shoulder and arm, impaired movement of the upper limb, shoulder joint inflammation',
    indicationsSrc: [WORKSHEET],
  },
  LI16: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '肩背痛、手臂不得屈伸',
    indicationsEn: 'Pain of the shoulder and back; inability to bend or extend the arm',
    indicationsSrc: [WORKSHEET],
  },
  LI17: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咽喉腫痛、失音、瘰癧',
    indicationsEn: 'Sore swollen throat, loss of voice, scrofula',
    indicationsSrc: [WORKSHEET],
  },
  LI18: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽氣喘、咽喉腫痛、失音',
    indicationsEn: 'Cough and wheezing, sore swollen throat, loss of voice',
    indicationsSrc: [WORKSHEET],
  },
  LI19: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '鼻塞流涕、口歪、鼻衄',
    indicationsEn: 'Nasal congestion with discharge, deviation of the mouth, nosebleed',
    indicationsSrc: [WORKSHEET],
  },
  LI20: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '鼻塞、鼻衄、口歪、面癢',
    indicationsEn: 'Nasal congestion, nosebleed, deviation of the mouth, itching of the face',
    indicationsSrc: [WORKSHEET],
  },
  /* --- 足陽明胃經 ---------------------------------------------------------
   * All forty-five points, 主治 from the worksheet's 「治…」 clause. Cuts, all
   * of them technique or contraindication the source put in the same sentence:
   *   ST1  「禁灸、慎針」            ST9  「注意避開頸總動脈」
   *   ST12 「孕婦禁針」              ST30 「注意避開動脈」
   *   ST42 「注意避開足背動脈」      ST7  「閉口取穴」 (a locating instruction)
   * ST17 乳中 yields nothing at all: its whole remark is 「一般不針不灸，僅作
   * 定位參考點」 — a point the source treats as a landmark rather than one to
   * use, so both fields stay empty and the sheet says so.
   * 足三里 ST36's remark is 「保健要穴，常灸治虛勞諸證」, moxibustion end to
   * end, so its 主治 comes from the index table instead.
   */
  ST1: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '目疾',
    indicationsEn:
      'Eye disorders',
    indicationsSrc: [WORKSHEET],
  },
  ST2: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '目赤痛癢、口眼歪斜、面痛',
    indicationsEn:
      'Red, painful or itchy eyes; deviation of the mouth and eye; facial pain',
    indicationsSrc: [WORKSHEET],
  },
  ST3: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '口眼歪斜、面痛、鼻衄',
    indicationsEn:
      'Deviation of the mouth and eye, facial pain, nosebleed',
    indicationsSrc: [WORKSHEET],
  },
  ST4: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '口歪流涎、面痛牙痛',
    indicationsEn:
      'Deviation of the mouth with drooling; facial pain and toothache',
    indicationsSrc: [WORKSHEET],
  },
  ST5: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '口歪、牙痛、面腫',
    indicationsEn:
      'Deviation of the mouth, toothache, facial swelling',
    indicationsSrc: [WORKSHEET],
  },
  ST6: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '牙痛、口歪、頰腫',
    indicationsEn:
      'Toothache, deviation of the mouth, swelling of the cheek',
    indicationsSrc: [WORKSHEET],
  },
  ST7: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '耳鳴耳聾、牙痛、口歪',
    indicationsEn:
      'Tinnitus and deafness, toothache, deviation of the mouth',
    indicationsSrc: [WORKSHEET],
  },
  ST8: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '頭痛、目眩、迎風流淚',
    indicationsEn:
      'Headache, dizziness, tearing on exposure to wind',
    indicationsSrc: [WORKSHEET],
  },
  ST9: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咽喉腫痛、高血壓',
    indicationsEn:
      'Sore swollen throat, high blood pressure',
    indicationsSrc: [WORKSHEET],
  },
  ST10: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咽喉腫痛、咳嗽、瘿瘤',
    indicationsEn:
      'Sore swollen throat, cough, goitre',
    indicationsSrc: [WORKSHEET],
  },
  ST11: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咽喉腫痛、咳嗽、瘿瘤瘰癧',
    indicationsEn:
      'Sore swollen throat, cough, goitre and scrofula',
    indicationsSrc: [WORKSHEET],
  },
  ST12: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽氣喘、缺盆中痛',
    indicationsEn:
      'Cough and wheezing; pain in the supraclavicular fossa',
    indicationsSrc: [WORKSHEET],
  },
  ST13: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽氣喘、胸脅脹滿',
    indicationsEn:
      'Cough and wheezing; distension and fullness of the chest and flanks',
    indicationsSrc: [WORKSHEET],
  },
  ST14: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽、胸脅脹痛、乳腺炎',
    indicationsEn:
      'Cough; distending pain of the chest and flanks; inflammation of the breast',
    indicationsSrc: [WORKSHEET],
  },
  ST15: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽氣喘、胸脅脹痛、乳腺炎',
    indicationsEn:
      'Cough and wheezing; distending pain of the chest and flanks; inflammation of the breast',
    indicationsSrc: [WORKSHEET],
  },
  ST16: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽氣喘、胸脅脹痛、乳癰',
    indicationsEn:
      'Cough and wheezing; distending pain of the chest and flanks; breast abscess',
    indicationsSrc: [WORKSHEET],
  },
  ST17: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: null,
    indicationsEn: null,
  },
  ST18: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '乳癰、乳汁少、胸痛、咳喘',
    indicationsEn:
      'Breast abscess, scant breast milk, chest pain, cough and wheezing',
    indicationsSrc: [WORKSHEET],
  },
  ST19: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胃痛、嘔吐、腹脹',
    indicationsEn:
      'Stomach pain, vomiting, abdominal distension',
    indicationsSrc: [WORKSHEET],
  },
  ST20: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胃痛、嘔吐、腹脹腸鳴',
    indicationsEn:
      'Stomach pain, vomiting, abdominal distension and borborygmus',
    indicationsSrc: [WORKSHEET],
  },
  ST21: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胃痛、嘔吐、食欲不振、便溏',
    indicationsEn:
      'Stomach pain, vomiting, poor appetite, loose stools',
    indicationsSrc: [WORKSHEET],
  },
  ST22: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '水腫、腹痛、腸鳴泄瀉',
    indicationsEn:
      'Oedema, abdominal pain, borborygmus and diarrhoea',
    indicationsSrc: [WORKSHEET],
  },
  ST23: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胃痛、心煩、癲狂',
    indicationsEn:
      'Stomach pain, restlessness, mania and withdrawal',
    indicationsSrc: [WORKSHEET],
  },
  ST24: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胃痛、嘔吐、癲狂',
    indicationsEn:
      'Stomach pain, vomiting, mania and withdrawal',
    indicationsSrc: [WORKSHEET],
  },
  ST25: {
    actionsZh: '募主臟腑病',
    actionsEn:
      'As a front-mu point, said to govern disorders of the organs',
    indicationsZh: '腹痛腹瀉便秘、月經不調',
    indicationsEn:
      'Abdominal pain, diarrhoea and constipation; irregular menstruation',
    indicationsSrc: [WORKSHEET],
  },
  ST26: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '腹痛、疝氣、痛經',
    indicationsEn:
      'Abdominal pain, hernia, painful menstruation',
    indicationsSrc: [WORKSHEET],
  },
  ST27: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '小腹脹滿、小便不利、遺精',
    indicationsEn:
      'Distension of the lower abdomen, difficult urination, seminal emission',
    indicationsSrc: [WORKSHEET],
  },
  ST28: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '水腫、小便不利、月經不調',
    indicationsEn:
      'Oedema, difficult urination, irregular menstruation',
    indicationsSrc: [WORKSHEET],
  },
  ST29: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '小腹疼痛、月經不調、帶下、疝氣',
    indicationsEn:
      'Lower abdominal pain, irregular menstruation, vaginal discharge, hernia',
    indicationsSrc: [WORKSHEET],
  },
  ST30: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '少腹疼痛、疝氣、月經不調',
    indicationsEn:
      'Lower abdominal pain, hernia, irregular menstruation',
    indicationsSrc: [WORKSHEET],
  },
  ST31: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '下肢痿痺、腰痛、腹痛',
    indicationsEn:
      'Weakness and numbness of the leg, lumbar pain, abdominal pain',
    indicationsSrc: [WORKSHEET],
  },
  ST32: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '下肢痿痺、疝氣、腳氣',
    indicationsEn:
      'Weakness and numbness of the leg, hernia, beriberi',
    indicationsSrc: [WORKSHEET],
  },
  ST33: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '下肢痿痺、腹痛、疝氣',
    indicationsEn:
      'Weakness and numbness of the leg, abdominal pain, hernia',
    indicationsSrc: [WORKSHEET],
  },
  ST34: {
    actionsZh: '郄穴主急性病',
    actionsEn:
      'As a xi-cleft point, said to govern acute conditions',
    indicationsZh: '急性胃痛、膝腫痛',
    indicationsEn:
      'Acute stomach pain; swelling and pain of the knee',
    indicationsSrc: [WORKSHEET],
  },
  ST35: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '膝腫痛、屈伸不利、下肢痿痺',
    indicationsEn:
      'Swelling and pain of the knee, difficulty bending and extending it, weakness and numbness of the leg',
    indicationsSrc: [WORKSHEET],
  },
  ST36: {
    actionsZh: '合主逆氣而泄',
    actionsEn:
      'As a he-sea point, said to govern counterflow qi and diarrhoea',
    indicationsZh: '胃痛、嘔吐、強壯要穴',
    indicationsEn:
      'Stomach pain, vomiting; described as a major strengthening point',
    indicationsSrc: [INDEX_TABLE],
  },
  ST37: {
    actionsZh: '下合穴治腑病',
    actionsEn:
      'As a lower he-sea point, said to address disorders of the fu organs',
    indicationsZh: '腸鳴腹痛、泄瀉、下肢痿痺',
    indicationsEn:
      'Borborygmus and abdominal pain, diarrhoea, weakness and numbness of the leg',
    indicationsSrc: [WORKSHEET],
  },
  ST38: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '下肢痿痺、肩臂痛、脘腹疼痛',
    indicationsEn:
      'Weakness and numbness of the leg, pain of the shoulder and arm, epigastric and abdominal pain',
    indicationsSrc: [WORKSHEET],
  },
  ST39: {
    actionsZh: '下合穴治腑病',
    actionsEn:
      'As a lower he-sea point, said to address disorders of the fu organs',
    indicationsZh: '小腹痛、泄瀉、乳癰',
    indicationsEn:
      'Lower abdominal pain, diarrhoea, breast abscess',
    indicationsSrc: [WORKSHEET],
  },
  ST40: {
    actionsZh: '絡穴主化痰濕',
    actionsEn:
      'As a luo-connecting point, said to transform phlegm and damp',
    indicationsZh: '痰多、頭痛眩暈、癲狂',
    indicationsEn:
      'Copious phlegm, headache and dizziness, mania and withdrawal',
    indicationsSrc: [WORKSHEET],
  },
  ST41: {
    actionsZh: '經主喘咳寒熱',
    actionsEn:
      'As a jing-river point, said to govern wheezing, cough, and alternating cold and heat',
    indicationsZh: '頭痛、眩暈、足踝腫痛',
    indicationsEn:
      'Headache, dizziness, swelling and pain of the ankle',
    indicationsSrc: [WORKSHEET],
  },
  ST42: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胃痛、腹脹、口眼歪斜',
    indicationsEn:
      'Stomach pain, abdominal distension, deviation of the mouth and eye',
    indicationsSrc: [WORKSHEET],
  },
  ST43: {
    actionsZh: '輸主體重節痛',
    actionsEn:
      'As a shu-stream point, said to govern heaviness of the body and aching joints',
    indicationsZh: '面腫、足背腫痛、腸鳴',
    indicationsEn:
      'Facial swelling, swelling and pain of the dorsum of the foot, borborygmus',
    indicationsSrc: [WORKSHEET],
  },
  ST44: {
    actionsZh: '滎主身熱',
    actionsEn:
      'As a ying-spring point, said to govern generalised heat',
    indicationsZh: '齒痛、咽喉腫痛、腹痛腹瀉',
    indicationsEn:
      'Toothache, sore swollen throat, abdominal pain and diarrhoea',
    indicationsSrc: [WORKSHEET],
  },
  ST45: {
    actionsZh: '井穴主神志',
    actionsEn:
      'As a jing-well point, said to govern the spirit-mind',
    indicationsZh: '昏迷、中風、齒痛、多夢癲狂',
    indicationsEn:
      'Loss of consciousness, wind-stroke, toothache, excessive dreaming, mania and withdrawal',
    indicationsSrc: [WORKSHEET],
  },
  /* --- 足太陰脾經 ---------------------------------------------------------
   * 功效 is absent for the whole channel. The Spleen was reviewed in the Day 3
   * worksheet, whose 備註 field the owner wrote clinical-free — it carries
   * classifications and locations and nothing else — so there is no ingested
   * source for an action on any of these twenty-one points. That is a gap in
   * coverage, not a claim that the tradition is silent, and every point says so.
   *
   * 主治 comes from the index table, which reaches sixteen of twenty-one.
   *
   * MATCHED BY NAME, NOT BY THE TABLE'S CODE. The table numbers the last four
   * points 周荣 SP20, 胸乡 SP21, 天溪 SP22, 食窦 SP23. Only the first is right:
   * this channel has twenty-one points, so SP22 and SP23 do not exist, and the
   * project's own source-checked records (GB/T 12346-2021) place 食竇 at SP17,
   * 天溪 at SP18 and 胸鄉 at SP19. Reconciling on the name uses the table's own
   * name column against a reviewed mapping rather than correcting it from model
   * knowledge — and the traceability test matches each string to the ROW that
   * names the point, so a mismatched row cannot slip through unnoticed.
   */
  SP1: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '崩漏、便血',
    indicationsEn:
      'Flooding and spotting, blood in the stool',
  },
  SP2: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: null,
    indicationsEn: null,
  },
  SP3: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胃痛、腹脹、腹瀉',
    indicationsEn:
      'Stomach pain, abdominal distension, diarrhoea',
  },
  SP4: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胃痛、嘔吐、月經不調',
    indicationsEn:
      'Stomach pain, vomiting, irregular menstruation',
  },
  SP5: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: null,
    indicationsEn: null,
  },
  SP6: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '月經不調、失眠、消化不良',
    indicationsEn:
      'Irregular menstruation, insomnia, poor digestion',
  },
  SP7: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '腹脹、下肢痿痹',
    indicationsEn:
      'Abdominal distension; weakness and numbness of the leg',
  },
  SP8: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '月經不調、腹痛',
    indicationsEn:
      'Irregular menstruation, abdominal pain',
  },
  SP9: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '水腫、小便不利、腹瀉',
    indicationsEn:
      'Oedema, difficult urination, diarrhoea',
  },
  SP10: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '月經不調、貧血、濕疹',
    indicationsEn:
      'Irregular menstruation, blood deficiency, eczema',
  },
  SP11: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '小便不利、遺尿',
    indicationsEn:
      'Difficult urination, incontinence of urine',
  },
  SP12: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '疝氣、腹痛',
    indicationsEn:
      'Hernia, abdominal pain',
  },
  SP13: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: null,
    indicationsEn: null,
  },
  SP14: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: null,
    indicationsEn: null,
  },
  SP15: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '腹痛、腹瀉、便秘',
    indicationsEn:
      'Abdominal pain, diarrhoea, constipation',
  },
  SP16: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '腹痛、消化不良',
    indicationsEn:
      'Abdominal pain, poor digestion',
  },
  SP17: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胸脅脹痛、消化不良',
    indicationsEn:
      'Distending pain of the chest and flanks, poor digestion',
  },
  SP18: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '乳汁不足、胸脅痛',
    indicationsEn:
      'Insufficient breast milk, pain of the chest and flanks',
  },
  SP19: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '胸脅脹痛',
    indicationsEn:
      'Distending pain of the chest and flanks',
  },
  SP20: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: '咳嗽、胸脅脹痛',
    indicationsEn:
      'Cough, distending pain of the chest and flanks',
  },
  SP21: {
    actionsZh: null,
    actionsEn: null,
    indicationsZh: null,
    indicationsEn: null,
  },
};


/** Fallbacks for entries that name no source of their own. */
export const INDICATION_SOURCES = {
  actions: [WORKSHEET],
  indications: [INDEX_TABLE],
};

export const actionsSourcesOf = (code: string): string[] =>
  indicationsByCode[code]?.actionsSrc ?? INDICATION_SOURCES.actions;
export const indicationsSourcesOf = (code: string): string[] =>
  indicationsByCode[code]?.indicationsSrc ?? INDICATION_SOURCES.indications;

/**
 * Model-written entries, merged UNDER the file-sourced table above.
 *
 * Kept in a separate module rather than mixed in, so the precedence is a
 * property of the structure instead of a convention: a file-sourced field can
 * never be silently replaced by a written one, and replacing that module with
 * an empty one — which is exactly what the shared build does — leaves the
 * sourced content exactly as it was. A test asserts the overlap is empty in
 * both directions, and another asserts the empty stub changes nothing else.
 */
/** The written entry for a code, before any merge. Exported for the tests. */
export const modelWrittenFor = (code: string): IndicationEntry | undefined => modelWritten[code];

export function modelEntry(code: string): IndicationEntry | undefined {
  const m = modelWritten[code];
  if (!m) return undefined;
  const filed = indicationsByCode[code];
  return {
    actionsZh: filed?.actionsZh ?? m.actionsZh,
    actionsEn: filed?.actionsEn ?? m.actionsEn,
    indicationsZh: filed?.indicationsZh ?? m.indicationsZh,
    indicationsEn: filed?.indicationsEn ?? m.indicationsEn,
    actionsSrc: filed?.actionsZh ? actionsSourcesOf(code) : [MODEL_SOURCE_ID],
    indicationsSrc: filed?.indicationsZh ? indicationsSourcesOf(code) : [MODEL_SOURCE_ID],
  };
}

/** The merged view every consumer should use. */
export function entryFor(code: string): IndicationEntry | undefined {
  return modelEntry(code) ?? indicationsByCode[code];
}
export const actionsSrcFor = (code: string): string[] =>
  entryFor(code)?.actionsSrc ?? INDICATION_SOURCES.actions;
export const indicationsSrcFor = (code: string): string[] =>
  entryFor(code)?.indicationsSrc ?? INDICATION_SOURCES.indications;

/**
 * Channels whose 功效/主治 have been ingested. Everything else shows nothing at
 * all rather than an empty heading, so the learner can tell "not carried yet"
 * from "the tradition says nothing".
 *
 * Computed, where it used to be a hand-written list of fourteen. The comment
 * already claimed it was derived and it was not, which was harmless while every
 * channel qualified — and stops being harmless the moment a build ships without
 * the model module, because the list would still name ten channels that now
 * carry nothing and the About page would report a coverage it does not have.
 * Deriving it means the shared build narrows to LU/LI/ST/SP on its own.
 *
 * A channel qualifies as soon as one of its points carries either field, from
 * either table. The meridian id comes off the point code — LU9 → `mer_lu` —
 * which is the same convention `acupoints.ts` uses; a test pins the two
 * together so a divergence cannot pass silently.
 */
export const meridianIdForCode = (code: string): string =>
  `mer_${code.replace(/\d+$/, '').toLowerCase()}`;

const hasContent = (e: IndicationEntry | undefined): boolean =>
  Boolean(e && (e.actionsZh || e.actionsEn || e.indicationsZh || e.indicationsEn));

export const INDICATION_CHANNELS: string[] = [
  ...new Set(
    [...Object.keys(indicationsByCode), ...Object.keys(modelWritten)]
      .filter((code) => hasContent(entryFor(code)))
      .map(meridianIdForCode),
  ),
];
