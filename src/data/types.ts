/**
 * Structured content model for Let Energy Flow.
 *
 * Design rules taken from AGENTS.md:
 *  - anatomical/location facts, mnemonics and traditional-function claims are
 *    SEPARATE fields so each can be reviewed, hidden or replaced independently;
 *  - every factual record carries its own provenance and review status;
 *  - nothing is ever labelled reviewed without a recorded reviewer;
 *  - missing data is represented as `null`, never as an invented value.
 */

/** How the project is permitted to reuse a source's expressive content. */
export type ReuseStatus =
  | 'public_domain_fact'
  | 'open_licensed'
  | 'publicly_accessible_restricted'
  | 'permission_required'
  | 'unknown';

/** How far a record has travelled through editorial/expert review. */
export type ReviewStatus = 'unreviewed' | 'source_checked' | 'expert_reviewed';

export type SourceType =
  | 'user_curriculum'
  | 'classical_public_domain'
  | 'official_standard'
  | 'educational_institution'
  | 'peer_reviewed'
  | 'expert_review'
  | 'project_original';

export interface SourceRecord {
  id: string;
  title: string;
  /** Stable reference, URL, or local file path. `null` when none exists yet. */
  reference: string | null;
  editionOrVersion: string | null;
  /** Page, section, or line reference where applicable. */
  locator: string | null;
  sourceType: SourceType;
  /** Jurisdiction or tradition the source speaks for. */
  jurisdictionOrTradition: string | null;
  reuseStatus: ReuseStatus;
  reviewStatus: ReviewStatus;
  reviewer: string | null;
  reviewDate: string | null;
  notes: string;
}

/** A single traceable claim: the value, where it came from, and how trusted it is. */
export interface Provenanced<T> {
  value: T;
  sourceIds: string[];
  reviewStatus: ReviewStatus;
  reviewer: string | null;
  reviewDate: string | null;
  /** Disagreements between sources, reconciliation rule applied, localisation notes. */
  notes: string | null;
}

export type BodyViewId = 'front' | 'back';

export interface AtlasView {
  id: BodyViewId;
  labelEn: string;
  labelZh: string;
  /** SVG user-space size that normalised coordinates map into. */
  width: number;
  height: number;
}

/**
 * Placement of a marker on the project's own schematic figure.
 *
 * IMPORTANT: this is a diagram layout coordinate, not a validated anatomical
 * coordinate. `status` must stay `schematic_unvalidated` until a qualified
 * reviewer signs off on placement against a real point-location standard.
 */
export interface AtlasPlacement {
  view: BodyViewId;
  /** Normalised 0..1 within the view box. */
  x: number;
  y: number;
  /** Which side of the schematic figure the marker is drawn on. */
  side: 'left' | 'right' | 'midline';
  status: 'schematic_unvalidated' | 'source_checked' | 'expert_reviewed';
}

export type MeridianElement = 'metal' | 'water' | 'wood' | 'fire' | 'earth';

export interface Meridian {
  id: string;
  /** Canonical two-letter code used in point codes, e.g. `LU`. */
  code: string;
  nameZhHant: string;
  nameZhHans: string | null;
  nameEn: string;
  pinyin: string;
  aliases: string[];
  /** Meridian id of the interior/exterior paired meridian, when modelled. */
  pairedMeridianId: string | null;
  element: MeridianElement | null;
  /** Total points in the classical catalogue for this meridian. */
  meridianTotalPoints: Provenanced<number>;
  /** How many points this project has actually normalised so far. */
  coursePointCount: number;
  /** Plain-language route description, in the project's own wording. */
  route: Provenanced<{ zhHant: string; en: string }>;
  bodyRegions: string[];
  /** Ordered acupoint ids from origin to termination. */
  pointOrder: string[];
  /** SVG path data on the schematic atlas, per view. */
  atlasPaths: { view: BodyViewId; d: string; side: 'left' | 'right' | 'midline' }[];
  /** Line style token so meridians are never distinguished by colour alone. */
  lineStyle: 'solid' | 'dashed' | 'dotted' | 'dashdot' | 'longdash' | 'shortdash' | 'dashdotdot' | 'longdashdot' | 'finedash' | 'doubledash' | 'longdashdotdot' | 'sparsedot' | 'railroad' | 'longsolid';
  colorToken: string;
  reviewStatus: ReviewStatus;
}

export type PointClassification =
  | 'jing_well'
  | 'ying_spring'
  | 'shu_stream'
  | 'jing_river'
  | 'he_sea'
  | 'yuan_source'
  | 'luo_connecting'
  | 'xi_cleft'
  | 'front_mu'
  | 'back_shu'
  | 'influential_meeting'
  | 'crossing'
  | 'great_luo'
  | 'lower_he_sea'
  | 'confluent'
  | 'entry'
  | 'exit';

/**
 * Display names for the specific-point categories, in both scripts.
 *
 * The enum values are internal identifiers; showing them raw put English
 * inside the 中文 interface. Every surface renders one script at a time, so
 * each category needs its own pair.
 */
export const CLASSIFICATION_LABELS: Record<
  PointClassification,
  { zhHant: string; en: string }
> = {
  jing_well: { zhHant: '井穴', en: 'jing-well' },
  ying_spring: { zhHant: '滎穴', en: 'ying-spring' },
  shu_stream: { zhHant: '輸穴', en: 'shu-stream' },
  jing_river: { zhHant: '經穴', en: 'jing-river' },
  he_sea: { zhHant: '合穴', en: 'he-sea' },
  yuan_source: { zhHant: '原穴', en: 'yuan-source' },
  luo_connecting: { zhHant: '絡穴', en: 'luo-connecting' },
  xi_cleft: { zhHant: '郄穴', en: 'xi-cleft' },
  front_mu: { zhHant: '募穴', en: 'front-mu' },
  back_shu: { zhHant: '背俞穴', en: 'back-shu' },
  influential_meeting: { zhHant: '八會穴', en: 'influential meeting' },
  crossing: { zhHant: '交會穴', en: 'crossing' },
  great_luo: { zhHant: '大絡', en: 'great luo' },
  lower_he_sea: { zhHant: '下合穴', en: 'lower he-sea' },
  confluent: { zhHant: '八脈交會穴', en: 'confluent' },
  entry: { zhHant: '入經穴', en: 'entry' },
  exit: { zhHant: '出經穴', en: 'exit' },
};

/**
 * Display names for the body regions, in both scripts.
 *
 * Regions are stored as stable English identifiers so the data layer stays
 * script-neutral; every surface that shows one renders it through this map, so
 * a 中文 interface never prints "upper back" beside a Chinese point name.
 * `regionLabel` falls back to the raw identifier rather than inventing a
 * translation, which makes an unmapped region visible instead of silent.
 */
export const REGION_LABELS: Record<string, { zhHant: string; en: string }> = {
  abdomen: { zhHant: '腹部', en: 'abdomen' },
  ankle: { zhHant: '踝部', en: 'ankle' },
  axilla: { zhHant: '腋窩', en: 'axilla' },
  buttock: { zhHant: '臀部', en: 'buttock' },
  calf: { zhHant: '小腿後側', en: 'calf' },
  chest: { zhHant: '胸部', en: 'chest' },
  clavicle: { zhHant: '鎖骨', en: 'clavicle' },
  ear: { zhHant: '耳部', en: 'ear' },
  elbow: { zhHant: '肘部', en: 'elbow' },
  face: { zhHant: '面部', en: 'face' },
  foot: { zhHant: '足部', en: 'foot' },
  forearm: { zhHant: '前臂', en: 'forearm' },
  'great toe': { zhHant: '足大趾', en: 'great toe' },
  groin: { zhHant: '腹股溝', en: 'groin' },
  hand: { zhHant: '手部', en: 'hand' },
  head: { zhHant: '頭部', en: 'head' },
  heel: { zhHant: '足跟', en: 'heel' },
  'index finger': { zhHant: '食指', en: 'index finger' },
  jaw: { zhHant: '下頜', en: 'jaw' },
  knee: { zhHant: '膝部', en: 'knee' },
  'lateral chest': { zhHant: '側胸部', en: 'lateral chest' },
  'little finger': { zhHant: '小指', en: 'little finger' },
  'little toe': { zhHant: '足小趾', en: 'little toe' },
  'lower abdomen': { zhHant: '下腹部', en: 'lower abdomen' },
  'lower back': { zhHant: '腰部', en: 'lower back' },
  'lower leg': { zhHant: '小腿', en: 'lower leg' },
  'mid back': { zhHant: '背部中段', en: 'mid back' },
  nape: { zhHant: '項部', en: 'nape' },
  neck: { zhHant: '頸部', en: 'neck' },
  occiput: { zhHant: '枕部', en: 'occiput' },
  palm: { zhHant: '手掌', en: 'palm' },
  sacral: { zhHant: '骶部', en: 'sacral region' },
  scapula: { zhHant: '肩胛部', en: 'scapula' },
  sole: { zhHant: '足底', en: 'sole' },
  'dorsal hand': { zhHant: '手背', en: 'back of the hand' },
  'middle finger': { zhHant: '中指', en: 'middle finger' },
  'ring finger': { zhHant: '無名指', en: 'ring finger' },
  'behind the ear': { zhHant: '耳後', en: 'behind the ear' },
  'in front of the ear': { zhHant: '耳前', en: 'in front of the ear' },
  temple: { zhHant: '顳部', en: 'temple' },
  'lateral thorax': { zhHant: '側胸部', en: 'lateral chest' },
  'lateral abdomen': { zhHant: '側腹部', en: 'lateral abdomen' },
  'lateral waist': { zhHant: '側腰部', en: 'lateral waist' },
  'lateral thigh': { zhHant: '大腿外側', en: 'lateral thigh' },
  hip: { zhHant: '髖部', en: 'hip' },
  perineum: { zhHant: '會陰部', en: 'perineum' },
  epigastrium: { zhHant: '上腹部', en: 'epigastrium' },
  sacrum: { zhHant: '骶部', en: 'sacrum' },
  back: { zhHant: '背部', en: 'back' },
  vertex: { zhHant: '頭頂', en: 'vertex' },
  nose: { zhHant: '鼻部', en: 'nose' },
  philtrum: { zhHant: '人中', en: 'philtrum' },
  lip: { zhHant: '唇部', en: 'lip' },
  mouth: { zhHant: '口腔', en: 'mouth' },
  glabella: { zhHant: '眉間', en: 'glabella' },
  shoulder: { zhHant: '肩部', en: 'shoulder' },
  thigh: { zhHant: '大腿', en: 'thigh' },
  thumb: { zhHant: '拇指', en: 'thumb' },
  toe: { zhHant: '足趾', en: 'toe' },
  'upper abdomen': { zhHant: '上腹部', en: 'upper abdomen' },
  'upper arm': { zhHant: '上臂', en: 'upper arm' },
  'upper back': { zhHant: '上背部', en: 'upper back' },
  wrist: { zhHant: '腕部', en: 'wrist' },
};

/**
 * Marker-coordinate status, in both scripts.
 *
 * Distinct from a RECORD's review status: a point's location TEXT can be
 * source-checked while the dot on the figure is still a layout position. Every
 * placement is `schematic_unvalidated` today, and stays that way until someone
 * measures it against a body.
 */
export const PLACEMENT_STATUS_LABELS: Record<
  AtlasPlacement['status'],
  { zhHant: string; en: string; short: { zhHant: string; en: string } }
> = {
  schematic_unvalidated: {
    zhHant: '示意排版座標，尚未實測驗證，不可用於在人體上定位。',
    en: 'Layout coordinate on the schematic figure. Not measured against a body, and not usable to find the point on a person.',
    short: { zhHant: '示意座標', en: 'Schematic' },
  },
  source_checked: {
    zhHant: '座標已對照標準量測核對，但尚未經合格專家複核。',
    en: 'Coordinate checked against a standard measurement, but not yet signed off by a qualified reviewer.',
    short: { zhHant: '已核對', en: 'Measured' },
  },
  expert_reviewed: {
    zhHant: '座標已經合格專家複核。',
    en: 'Coordinate reviewed and signed off by a qualified reviewer.',
    short: { zhHant: '已複核', en: 'Reviewed' },
  },
};

/** Is this placement still an unvalidated layout position? */
export const isSchematicPlacement = (p: Pick<AtlasPlacement, 'status'>) =>
  p.status === 'schematic_unvalidated';

/**
 * Meridian name as the floating atlas / network legend shows it.
 *
 * The legend carries the FULL channel name, never an abbreviated one: 「胃經」
 * does not tell a learner which of the six channel divisions it belongs to,
 * and that division is half of what the name teaches.
 *
 * 中文 drops the Latin code — 「ST」 is an English abbreviation sitting in a
 * Chinese label, and the colour-and-dash swatch beside it already identifies
 * the line. English keeps the code, where it reads as part of the same script
 * and is how the points are cited.
 *
 * English is also reordered to match the Chinese construction: the record's
 * reviewed name is "Stomach meridian (Foot Yangming)", and the legend renders
 * it "Foot Yangming Stomach meridian" — qualifier first, exactly as 足陽明胃經
 * reads. The stored name is NOT rewritten: it is owner-reviewed content, and
 * the detail panel's meta line is a separately signed-off format.
 */
export const meridianLegendName = (
  m: { code: string; nameZhHant: string; nameEn: string },
  lang: 'zh' | 'en' | 'bi',
): { primary: string; secondary: string | null } => {
  // Only the twelve carry a "(Hand/Foot X)" channel qualifier to move to the
  // front. On 任脈 and 督脈 the parenthetical is the vessel's Chinese name —
  // "Conception Vessel (Ren Mai)" — which stays exactly where it is.
  const en = m.nameEn.replace(/^(.*?)\s+meridian\s*\((.*)\)$/, '$2 $1 meridian');
  if (lang === 'zh') return { primary: m.nameZhHant, secondary: null };
  if (lang === 'en') return { primary: `${m.code} · ${en}`, secondary: null };
  return { primary: `${m.code} · ${m.nameZhHant}`, secondary: en };
};

/** Region display name in one script, or the raw identifier if unmapped. */
export function regionLabel(region: string, lang: 'zh' | 'en'): string {
  const l = REGION_LABELS[region];
  if (!l) return region;
  return lang === 'zh' ? l.zhHant : l.en;
}

export interface Acupoint {
  id: string;
  /** Canonical code, e.g. `LU7`. */
  code: string;
  meridianId: string;
  /** 1-based position along the meridian route. */
  ordinal: number;
  nameZhHant: string;
  nameZhHans: string | null;
  nameEn: string | null;
  pinyin: string;
  aliases: string[];
  bodyRegion: string;
  /**
   * Landmark-based surface location, in the project's own wording.
   * `null` means no source has been recorded yet — the UI must say so rather
   * than guess.
   */
  location: Provenanced<{ zhHant: string; en: string }> | null;
  classifications: Provenanced<PointClassification[]> | null;
  /** Name-etymology / memory hooks. Explicitly NOT medical claims. */
  memoryCues: Provenanced<{ zhHant: string; en: string }>[];
  /**
   * 功效 — what the tradition says the point does.
   *
   * Its own field, deliberately separate from `location` and `classifications`,
   * so that carrying a traditional claim never upgrades the status of anything
   * beside it. `null` means no ingested source records one for this point, which
   * is different from the tradition being silent.
   */
  actions: Provenanced<{ zhHant: string; en: string }> | null;
  /**
   * 主治 — the complaints the curriculum lists the point under.
   *
   * Traditional teaching content, not a recommendation and not evidence of
   * effect. Every surface that renders it must carry that framing, and it is
   * deliberately absent from the search index: a searchable symptom→point
   * mapping would make the app a treatment recommender by construction, which
   * no per-entry wording could undo.
   */
  indications: Provenanced<{ zhHant: string; en: string }> | null;
  /** Curriculum emphasis: 1 = must know, 2 = important, 3 = recognise. */
  courseTier: 1 | 2 | 3 | null;
  placements: AtlasPlacement[];
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

/**
 * A traditional teaching association (e.g. "頭面 head & face — 合谷").
 *
 * These are historical/curricular associations presented for memorisation.
 * They are NOT treatment guidance; the UI must render them with the
 * educational framing carried in `educationalFraming`.
 */
export interface TraditionalFunction {
  id: string;
  labelZhHant: string;
  labelEn: string;
  pinyin: string | null;
  aliases: string[];
  /** Short neutral description of what the traditional teaching says. */
  description: Provenanced<{ zhHant: string; en: string }>;
  /** Bilingual: every surface renders one script at a time, never a mixture. */
  educationalFraming: { zhHant: string; en: string };
  reviewStatus: ReviewStatus;
}

export type RelationKind =
  | 'traditionally_associated_point'
  | 'traditionally_associated_meridian'
  | 'mnemonic_grouping';

/** Typed edge between a function/topic and a point or meridian. */
export interface FunctionRelation {
  id: string;
  functionId: string;
  targetType: 'acupoint' | 'meridian';
  targetId: string;
  kind: RelationKind;
  sourceIds: string[];
  reviewStatus: ReviewStatus;
  notes: string | null;
}

export interface NetworkStation {
  acupointId: string;
  /** Layout coordinates in network-diagram space. Purely presentational. */
  x: number;
  y: number;
  /** Label placement hint so the diagram can declutter. */
  labelSide: 'above' | 'below' | 'left' | 'right';
  isTerminus: boolean;
}

export interface NetworkLine {
  id: string;
  meridianId: string;
  /** Ordered polyline through the station coordinates. */
  path: string;
  stations: NetworkStation[];
}

export interface NetworkInterchange {
  id: string;
  /**
   * Both scripts are stored separately so the UI can render ONE language.
   * A single string here previously forced a 中文 label next to an English
   * explanation, which is unreadable in either single-language mode.
   */
  labelZhHant: string;
  labelEn: string;
  x: number;
  y: number;
  /** Meridian ids joined by this interchange. */
  meridianIds: string[];
  /** Explicit explanation of what the modelled relationship means. */
  meaningZhHant: string;
  meaningEn: string;
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

export interface LessonSection {
  id: string;
  kind: 'learn' | 'do' | 'say' | 'test' | 'feynman';
  titleZhHant: string;
  titleEn: string;
  body: { zhHant: string; en: string }[];
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

export interface Flashcard {
  id: string;
  dayId: string;
  /** What the learner is being asked to retrieve. */
  mode: 'point_to_attributes' | 'topic_to_point' | 'route_recall' | 'classification';
  frontZhHant: string;
  frontEn: string;
  backZhHant: string;
  backEn: string;
  relatedAcupointIds: string[];
  relatedMeridianIds: string[];
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

export interface QuizItem {
  id: string;
  dayId: string;
  kind: 'multiple_choice' | 'locate_point';
  promptZhHant: string;
  promptEn: string;
  /** For multiple choice: option ids in display order. */
  options: { id: string; zhHant: string; en: string }[];
  correctOptionId: string | null;
  /** For locate-the-point items. */
  targetAcupointId: string | null;
  explanationZhHant: string;
  explanationEn: string;
  relatedAcupointIds: string[];
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

export interface CurriculumDay {
  id: string;
  dayNumber: number;
  titleZhHant: string;
  titleEn: string;
  hookZhHant: string;
  hookEn: string;
  meridianIds: string[];
  sections: LessonSection[];
  sourceIds: string[];
  reviewStatus: ReviewStatus;
  /**
   * A notice specific to this day, shown above its first section and in
   * addition to the standing educational-use notice every day carries. Present
   * only where a day's subject needs a boundary drawn that the general notice
   * does not already draw.
   */
  noticeZhHant?: string;
  noticeEn?: string;
}

export interface Dataset {
  /** Human-readable statement of exactly what is loaded. Shown in search UI. */
  scopeLabelEn: string;
  scopeLabelZhHant: string;
  isPartial: true;
  sources: SourceRecord[];
  atlasViews: AtlasView[];
  meridians: Meridian[];
  acupoints: Acupoint[];
  traditionalFunctions: TraditionalFunction[];
  functionRelations: FunctionRelation[];
  networkLines: NetworkLine[];
  networkInterchanges: NetworkInterchange[];
  curriculumDays: CurriculumDay[];
  flashcards: Flashcard[];
  quizItems: QuizItem[];
}
