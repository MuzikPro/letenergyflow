import { dataset } from './index';
import { ATLAS_HEIGHT, ATLAS_WIDTH, denorm, figureBounds } from './atlas';
import type { Acupoint, Meridian } from './types';

/**
 * The thirteen body regions the detail lessons are built on.
 *
 * DERIVED, not authored twice. Every acupoint already carries a reviewed
 * `bodyRegion` — 62 distinct values, from 'wrist' to 'philtrum' — and a region
 * here is simply a named group of those. Nothing re-classifies a point, so the
 * lessons cannot drift from the records the atlas draws from, and a point that
 * changes region changes lesson automatically.
 *
 * The grouping is asserted complete: all 362 points land in exactly one region,
 * with no orphans and no point claimed twice. `regions.test.ts` fails if a new
 * `bodyRegion` value appears with no home, which is the case that would
 * otherwise silently drop a point out of the detail curriculum.
 */

export interface BodyRegion {
  key: string;
  nameZhHant: string;
  nameEn: string;
  /** `bodyRegion` values from the point records that belong to this region. */
  members: string[];
  /** What the lesson uses as its anatomical spine — landmarks, not technique. */
  landmarksZhHant: string;
  landmarksEn: string;
}

export const BODY_REGIONS: BodyRegion[] = [
  {
    key: 'head',
    nameZhHant: '頭部',
    nameEn: 'Head',
    members: ['head', 'vertex', 'occiput', 'temple', 'nape'],
    landmarksZhHant: '前後髮際、頭維、百會、風池、枕外隆凸',
    landmarksEn: 'Front and back hairlines, the vertex, and the occipital protuberance',
  },
  {
    key: 'face',
    nameZhHant: '面部',
    nameEn: 'Face',
    members: [
      'face', 'ear', 'behind the ear', 'in front of the ear',
      'eye', 'nose', 'philtrum', 'lip', 'mouth', 'jaw', 'glabella',
    ],
    landmarksZhHant: '眉心、眶緣、鼻翼、人中、耳屏、下頜角',
    landmarksEn: 'Glabella, orbital rim, ala of the nose, philtrum, tragus, angle of the jaw',
  },
  {
    key: 'neck',
    nameZhHant: '頸部',
    nameEn: 'Neck',
    members: ['neck', 'throat'],
    landmarksZhHant: '喉結、胸鎖乳突肌、胸骨上窩',
    landmarksEn: 'Laryngeal prominence, sternocleidomastoid, suprasternal fossa',
  },
  {
    key: 'shoulder_arm',
    nameZhHant: '肩部及上臂',
    nameEn: 'Shoulder & upper arm',
    members: ['shoulder', 'upper arm', 'axilla', 'scapula'],
    landmarksZhHant: '肩峰、腋前後紋頭、肩胛岡',
    landmarksEn: 'Acromion, anterior and posterior axillary folds, spine of the scapula',
  },
  {
    key: 'elbow_forearm',
    nameZhHant: '肘部及前臂',
    nameEn: 'Elbow & forearm',
    members: ['elbow', 'forearm'],
    landmarksZhHant: '肘橫紋、肱骨內外上髁、尺橈骨之間（肘腕 12 寸）',
    landmarksEn: 'Cubital crease, humeral epicondyles, the interosseous space — the 12-cun elbow-to-wrist segment',
  },
  {
    key: 'wrist_hand',
    nameZhHant: '腕部及手部',
    nameEn: 'Wrist & hand',
    members: [
      'wrist', 'hand', 'palm', 'dorsal hand',
      'thumb', 'index finger', 'middle finger', 'ring finger', 'little finger',
    ],
    landmarksZhHant: '腕橫紋、掌骨、赤白肉際、指甲角',
    landmarksEn: 'Wrist creases, metacarpals, the red-white skin boundary, nail corners',
  },
  {
    key: 'thorax',
    nameZhHant: '胸部',
    nameEn: 'Thorax',
    members: ['chest', 'clavicle'],
    landmarksZhHant: '胸骨上窩、肋間隙、乳頭線、胸劍聯合',
    landmarksEn: 'Suprasternal fossa, intercostal spaces, mammary line, xiphisternal junction',
  },
  {
    key: 'abdomen_groin',
    nameZhHant: '腹部及腹股溝',
    nameEn: 'Abdomen & groin',
    members: ['abdomen', 'upper abdomen', 'lower abdomen', 'epigastrium', 'groin', 'perineum'],
    landmarksZhHant: '臍中、恥骨聯合上緣、腹股溝、前正中線旁開寸數',
    landmarksEn: 'Umbilicus, upper border of the pubic symphysis, inguinal groove, and the lateral cun offsets',
  },
  {
    key: 'back_glute',
    nameZhHant: '背部及臀部',
    nameEn: 'Back & gluteal',
    members: ['upper back', 'mid back', 'lower back', 'sacral', 'sacrum', 'buttock'],
    landmarksZhHant: '棘突（C7 起算）、兩側線 1.5／3 寸、骶後孔',
    landmarksEn: 'Spinous processes counted from C7, the 1.5 and 3 cun paravertebral lines, posterior sacral foramina',
  },
  {
    key: 'lateral_trunk_daimai',
    nameZhHant: '身側及帶脈',
    nameEn: 'Flank & the Girdling vessel',
    // The spec's own name for this region is 身側 — the flank — so it takes the
    // lateral values from chest to waist. Bucketed literally as "lateral waist"
    // alone it held ONE point (京門 GB25), which is not a lesson; this way it
    // carries the 帶脈 group the region is named for.
    members: ['lateral waist', 'lateral abdomen', 'lateral thorax', 'lateral chest'],
    landmarksZhHant: '第 11、12 浮肋端、腋中線、髂前上棘',
    landmarksEn: 'Free ends of the 11th and 12th ribs, mid-axillary line, anterior superior iliac spine',
  },
  {
    key: 'hip_thigh',
    nameZhHant: '髖胯及大腿',
    nameEn: 'Hip & thigh',
    members: ['hip', 'thigh', 'lateral thigh'],
    landmarksZhHant: '髂嵴、大轉子、髕底（大腿 19 寸）',
    landmarksEn: 'Iliac crest, greater trochanter, upper border of the patella — the 19-cun thigh segment',
  },
  {
    key: 'knee_lower_leg',
    nameZhHant: '膝部及小腿',
    nameEn: 'Knee & lower leg',
    members: ['knee', 'lower leg', 'calf'],
    landmarksZhHant: '髕骨上下緣、腓骨頭、脛骨前脊、膕橫紋',
    landmarksEn: 'Patellar borders, head of the fibula, tibial crest, popliteal crease',
  },
  {
    key: 'ankle_foot',
    nameZhHant: '踝部及足部',
    nameEn: 'Ankle & foot',
    members: ['ankle', 'foot', 'sole', 'heel', 'great toe', 'toe', 'little toe'],
    landmarksZhHant: '內外踝尖、跟腱、蹠骨、足底',
    landmarksEn: 'Medial and lateral malleoli, Achilles tendon, metatarsals, plantar surface',
  },
];

/** Which region a `bodyRegion` value belongs to. Built once at module load. */
const REGION_OF_VALUE = new Map<string, BodyRegion>();
for (const region of BODY_REGIONS) {
  for (const value of region.members) {
    const clash = REGION_OF_VALUE.get(value);
    if (clash) {
      throw new Error(`region overlap: "${value}" claimed by ${clash.key} and ${region.key}`);
    }
    REGION_OF_VALUE.set(value, region);
  }
}

const valueOf = (p: Acupoint): string => {
  const raw = (p as unknown as { bodyRegion?: { value?: string } | string }).bodyRegion;
  return String(typeof raw === 'object' && raw ? (raw.value ?? '') : (raw ?? ''));
};

export const regionOfPoint = (p: Acupoint): BodyRegion | undefined =>
  REGION_OF_VALUE.get(valueOf(p));

export const regionByKey = (key: string): BodyRegion | undefined =>
  BODY_REGIONS.find((r) => r.key === key);

/** Every point in a region, in the order the atlas already holds them. */
export function pointsInRegion(key: string): Acupoint[] {
  const region = regionByKey(key);
  if (!region) return [];
  return dataset.acupoints.filter((p) => regionOfPoint(p)?.key === key);
}

/** Which channels pass through a region — derived from its points, not listed. */
export function meridiansInRegion(key: string): Meridian[] {
  const ids = new Set(pointsInRegion(key).map((p) => p.meridianId));
  return dataset.meridians.filter((m) => ids.has(m.id));
}

/**
 * The camera for a region on one body view.
 *
 * DERIVED from the placements of the region's own points — the box is their
 * bounding box, padded — so it is a second camera on the one drawing, exactly
 * as the hand and foot lenses already are. Nothing here is eyeballed, and a
 * point that moves moves the frame with it.
 *
 * Returns undefined when the region has no points on that view, which is the
 * honest answer for e.g. the face on the back view.
 */
export function regionCamera(
  key: string,
  view: string,
): { x: number; y: number; w: number; h: number } | undefined {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const p of pointsInRegion(key)) {
    const pl = p.placements.find((x) => x.view === view);
    if (!pl) continue;
    const c = denorm(pl.x, pl.y);
    xs.push(c.x);
    ys.push(c.y);
  }
  if (xs.length === 0) return undefined;

  /*
   * Uniform padding, so the region sits in the MIDDLE of its frame.
   *
   * This used to add a wide gutter on +x for the labels to live in, which
   * pushed the anatomy left by a quarter of the frame — the head ended up in
   * the corner of its own portrait. The lens now flips a label to the left of
   * its marker when it would overflow, so no gutter is needed and the frame
   * can be centred on the thing it is a picture of.
   */
  const pad = 26;
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  const w = Math.max(...xs) - x + pad;
  const h = Math.max(...ys) - y + pad;

  /*
   * A margin of surrounding anatomy, so a region is not cropped mid-structure.
   *
   * Cropped tight to its own points, the head lesson cut the face off below
   * the mouth, the knee showed no thigh to hang itself from, and the hand
   * floated with no forearm. A body part is recognisable by what it joins
   * onto, so every frame carries the same proportional margin.
   */
  const context = 0.22;
  const cw = w * context;
  const ch = h * context;
  const withContext = { x: x - cw, y: y - ch, w: w + cw * 2, h: h + ch * 2 };

  /*
   * A floor, for a region only a few points across — the neck, a single
   * midline column — which would otherwise zoom in so far that the learner
   * loses track of where they are on the body.
   *
   * Applied AFTER the context margin and only if that was not already enough.
   * Applied before it, the two compounded: the ankle's small cloud was floored
   * to 129 units and then grown another 22%, so the feet ended up crowded into
   * the bottom fifth of a frame that was mostly shin.
   */
  const minW = ATLAS_WIDTH * 0.28;
  const minH = ATLAS_HEIGHT * 0.14;
  const gw = Math.max(0, minW - withContext.w) / 2;
  const gh = Math.max(0, minH - withContext.h) / 2;
  const framed = {
    x: withContext.x - gw,
    y: withContext.y - gh,
    w: withContext.w + gw * 2,
    h: withContext.h + gh * 2,
  };


  /*
   * Slide the frame back inside the figure.
   *
   * A frame hanging off the top of the body is showing blank background: the
   * head's spent a quarter of its height on the space above the skull, so the
   * face was pushed out of the bottom of its own portrait. Shifting rather
   * than shrinking keeps the size the floors above just established, and the
   * room reclaimed from the background becomes anatomy.
   */
  /*
   * Widen a frame that is far taller than it is wide.
   *
   * The back is a 132-by-504 ribbon of points. On a landscape screen that
   * renders as a thin strip down the middle with the width going to waste, and
   * it costs nothing to show the whole torso instead: the frame is bound by its
   * height either way, so the extra width is free context rather than lost
   * magnification.
   */
  const minAspect = 0.62;
  if (framed.w / framed.h < minAspect) {
    const want = framed.h * minAspect;
    framed.x -= (want - framed.w) / 2;
    framed.w = want;
  }

  const limit = figureBounds(view as 'front' | 'back');
  const fitAxis = (pos: number, size: number, lo: number, span: number) => {
    // Never larger than the figure: past that the frame is buying background,
    // not context — the two arms already span the whole width, and margin
    // around them is empty canvas on both sides.
    const s = Math.min(size, span);
    const centred = pos + (size - s) / 2;
    return { pos: Math.min(Math.max(centred, lo), lo + span - s), size: s };
  };
  const fx = fitAxis(framed.x, framed.w, limit.x, limit.w);
  const fy = fitAxis(framed.y, framed.h, limit.y, limit.h);
  return { x: fx.pos, y: fy.pos, w: fx.size, h: fy.size };
}

/** Which view shows more of this region — the one the lens should open on. */
export function preferredView(key: string): 'front' | 'back' {
  const on = (view: string) =>
    pointsInRegion(key).filter((p) => p.placements.some((pl) => pl.view === view)).length;
  return on('back') > on('front') ? 'back' : 'front';
}

/**
 * Every `bodyRegion` value in the dataset that no region claims.
 *
 * Exported so a test can assert it is empty: a point whose region has no home
 * would silently vanish from the detail curriculum, and nothing else would say
 * so.
 */
export function unclaimedRegionValues(): string[] {
  const seen = new Set<string>();
  for (const p of dataset.acupoints) {
    const v = valueOf(p);
    if (!REGION_OF_VALUE.has(v)) seen.add(v);
  }
  return [...seen].sort();
}
