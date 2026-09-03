import { acupoints } from './acupoints';
import { atlasViews, denorm, smoothPath } from './atlas';
import { curriculumDays, flashcards, quizItems } from './curriculum';
import { functionRelations, traditionalFunctions } from './functions';
import { meridians as rawMeridians } from './meridians';
import { layoutByMeridian, networkInterchanges, pathByMeridian } from './network';
import { sources } from './sources';
import type { BodyViewId, Dataset, Meridian, NetworkLine, NetworkStation } from './types';

const acupointById = new Map(acupoints.map((p) => [p.id, p]));

/** Rounds the corners of an `M x,y L x,y ...` polyline for the network diagram. */
export function roundPolyline(d: string, radius = 14): string {
  const pts = d
    .trim()
    .split(/(?=[ML])/)
    .map((seg) => seg.slice(1).trim().split(',').map(Number))
    .filter((p): p is [number, number] => p.length === 2 && p.every((n) => Number.isFinite(n)))
    .map(([x, y]) => ({ x, y }));

  if (pts.length < 3) return d;

  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });

  let out = `M${pts[0]!.x},${pts[0]!.y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1]!;
    const cur = pts[i]!;
    const next = pts[i + 1]!;
    const dIn = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    const dOut = Math.hypot(next.x - cur.x, next.y - cur.y);
    const rIn = Math.min(radius, dIn / 2);
    const rOut = Math.min(radius, dOut / 2);
    const a = lerp(cur, prev, rIn / dIn);
    const b = lerp(cur, next, rOut / dOut);
    out += ` L${a.x.toFixed(2)},${a.y.toFixed(2)} Q${cur.x},${cur.y} ${b.x.toFixed(2)},${b.y.toFixed(2)}`;
  }
  const last = pts[pts.length - 1]!;
  out += ` L${last.x},${last.y}`;
  return out;
}

const sideByMeridian: Record<string, 'left' | 'right' | 'midline'> = {
  mer_lu: 'left',
  mer_li: 'right',
  mer_st: 'left',
  mer_sp: 'right',
  mer_ht: 'right',
  mer_si: 'left',
  mer_bl: 'left',
  mer_ki: 'left',
  mer_pc: 'left',
  mer_te: 'right',
  mer_gb: 'left',
  mer_lr: 'right',
  mer_cv: 'midline',
  mer_gv: 'midline',
};

/**
 * Ordinals that begin a NEW drawn segment even though the previous point is
 * numerically adjacent and on the same view.
 *
 * Modern Bladder numbering is not a single top-to-bottom walk: after the leg it
 * returns to the upper back for the second paravertebral line (BL41), then
 * drops back to the calf (BL55). Joining those with a line would draw two long
 * diagonals across the torso that no source describes.
 */
const ROUTE_BREAKS: Record<string, number[]> = {
  // BL31 restarts at the first sacral foramen after BL30 has reached S4;
  // BL41 returns to T2 for the second paravertebral line; BL55 drops back to
  // the calf after BL54.
  mer_bl: [31, 41, 55],
};

/** Meridian routes on the atlas are derived from their own ordered placements. */
function withAtlasPaths(meridian: Meridian): Meridian {
  const side = sideByMeridian[meridian.id] ?? 'midline';
  const breaks = new Set(ROUTE_BREAKS[meridian.id] ?? []);

  // Walk the points in route order and cut a new segment whenever the view
  // changes, an ordinal is skipped, or an explicit break is declared. This is
  // what keeps a channel that surfaces on both views from being drawn as a line
  // straight through the body.
  type Seg = { view: BodyViewId; pts: { x: number; y: number }[] };
  const segments: Seg[] = [];
  let prevOrdinal: number | null = null;

  for (const id of meridian.pointOrder) {
    const point = acupointById.get(id);
    if (!point) continue;
    const placement = point.placements[0];
    if (!placement) continue;
    const view = placement.view;
    const spot = denorm(placement.x, placement.y);
    const last = segments[segments.length - 1];
    const continues =
      last !== undefined &&
      last.view === view &&
      prevOrdinal !== null &&
      point.ordinal === prevOrdinal + 1 &&
      !breaks.has(point.ordinal);
    if (continues) last.pts.push(spot);
    else segments.push({ view, pts: [spot] });
    prevOrdinal = point.ordinal;
  }

  return {
    ...meridian,
    atlasPaths: segments
      .filter((seg) => seg.pts.length > 1)
      .map((seg) => ({ view: seg.view, d: smoothPath(seg.pts, 0.4), side })),
  };
}

export const meridians: Meridian[] = rawMeridians.map(withAtlasPaths);

const networkLines: NetworkLine[] = meridians.map((m) => {
  const layout = layoutByMeridian[m.id] ?? [];
  const stations: NetworkStation[] = m.pointOrder.map((acupointId, i) => {
    const spot = layout[i];
    return {
      acupointId,
      x: spot?.x ?? 0,
      y: spot?.y ?? 0,
      labelSide: spot?.labelSide ?? 'above',
      isTerminus: i === 0 || i === m.pointOrder.length - 1,
    };
  });
  return {
    id: `line_${m.code.toLowerCase()}`,
    meridianId: m.id,
    path: roundPolyline(pathByMeridian[m.id] ?? ''),
    stations,
  };
});

export const dataset: Dataset = {
  scopeLabelEn:
    'Days 1–9 slice — Lung (11), Large Intestine (20), Stomach (45), Spleen (21), Heart (9), Small Intestine (19), Bladder (67), Kidney (27), Pericardium (9), Triple Energizer (23), Gallbladder (44), Liver (14), Conception (24) and Governor (29 points). ALL 14 channels, 362 points — the complete set the curriculum teaches.',
  scopeLabelZhHant:
    '第 1–8 天資料集 — 肺經（11 穴）、大腸經（20 穴）、胃經（45 穴）、脾經（21 穴）、心經（9 穴）、小腸經（19 穴）、膀胱經（67 穴）、腎經（27 穴）、心包經（9 穴）、三焦經（23 穴）、膽經（44 穴）、肝經（14 穴）、任脈（24 穴）與督脈（29 穴），十四經全數載入、共 362 穴。',
  isPartial: true,
  sources,
  atlasViews,
  meridians,
  acupoints,
  traditionalFunctions,
  functionRelations,
  networkLines,
  networkInterchanges,
  curriculumDays,
  flashcards,
  quizItems,
};

/* -------------------------------------------------------------------------- */
/* Integrity checks. Run by the test suite; nothing ships that fails these.     */
/* -------------------------------------------------------------------------- */

export function validateDataset(d: Dataset = dataset): string[] {
  const problems: string[] = [];
  const sourceIds = new Set(d.sources.map((s) => s.id));
  const pointIds = new Set(d.acupoints.map((p) => p.id));
  const meridianIds = new Set(d.meridians.map((m) => m.id));

  const checkSources = (ids: string[], where: string) => {
    for (const id of ids) if (!sourceIds.has(id)) problems.push(`${where}: unknown source "${id}"`);
  };

  for (const m of d.meridians) {
    const owned = d.acupoints.filter((p) => p.meridianId === m.id);
    if (owned.length !== m.pointOrder.length) {
      problems.push(
        `${m.code}: ${owned.length} acupoint records but pointOrder lists ${m.pointOrder.length}`,
      );
    }
    if (m.coursePointCount !== m.pointOrder.length) {
      problems.push(`${m.code}: coursePointCount ${m.coursePointCount} != route length`);
    }
    m.pointOrder.forEach((id, i) => {
      const p = acupointById.get(id);
      if (!p) problems.push(`${m.code}: pointOrder references missing acupoint "${id}"`);
      else if (p.ordinal !== i + 1) problems.push(`${p.code}: ordinal ${p.ordinal} != position ${i + 1}`);
      else if (p.meridianId !== m.id) problems.push(`${p.code}: listed on ${m.code} but assigned elsewhere`);
    });
    checkSources(m.meridianTotalPoints.sourceIds, m.code);
    checkSources(m.route.sourceIds, m.code);
  }

  for (const p of d.acupoints) {
    if (!meridianIds.has(p.meridianId)) problems.push(`${p.code}: unknown meridian "${p.meridianId}"`);
    if (p.placements.length === 0) problems.push(`${p.code}: no atlas placement`);
    for (const pl of p.placements) {
      if (pl.x < 0 || pl.x > 1 || pl.y < 0 || pl.y > 1) {
        problems.push(`${p.code}: placement out of normalised bounds (${pl.x}, ${pl.y})`);
      }
      if (!d.atlasViews.some((v) => v.id === pl.view)) {
        problems.push(`${p.code}: placement references unknown view "${pl.view}"`);
      }
    }
    checkSources(p.sourceIds, p.code);
    if (p.location) checkSources(p.location.sourceIds, `${p.code}.location`);
    if (p.classifications) checkSources(p.classifications.sourceIds, `${p.code}.classifications`);
    p.memoryCues.forEach((c, i) => checkSources(c.sourceIds, `${p.code}.memoryCues[${i}]`));
  }

  for (const r of d.functionRelations) {
    if (!d.traditionalFunctions.some((f) => f.id === r.functionId)) {
      problems.push(`${r.id}: unknown function "${r.functionId}"`);
    }
    const known = r.targetType === 'acupoint' ? pointIds.has(r.targetId) : meridianIds.has(r.targetId);
    if (!known) problems.push(`${r.id}: unknown ${r.targetType} target "${r.targetId}"`);
    checkSources(r.sourceIds, r.id);
  }

  for (const line of d.networkLines) {
    const m = d.meridians.find((x) => x.id === line.meridianId);
    if (!m) {
      problems.push(`${line.id}: unknown meridian`);
      continue;
    }
    if (line.stations.length !== m.pointOrder.length) {
      problems.push(
        `${line.id}: ${line.stations.length} stations but meridian has ${m.pointOrder.length} points`,
      );
    }
    line.stations.forEach((s, i) => {
      if (s.acupointId !== m.pointOrder[i]) {
        problems.push(`${line.id}: station ${i} is "${s.acupointId}", expected "${m.pointOrder[i]}"`);
      }
      if (!pointIds.has(s.acupointId)) problems.push(`${line.id}: station links to missing point`);
      if (!Number.isFinite(s.x) || !Number.isFinite(s.y) || (s.x === 0 && s.y === 0)) {
        problems.push(`${line.id}: station "${s.acupointId}" has no layout coordinate`);
      }
    });
  }

  for (const ix of d.networkInterchanges) {
    for (const id of ix.meridianIds) {
      if (!meridianIds.has(id)) problems.push(`${ix.id}: unknown meridian "${id}"`);
    }
    // Both scripts must be present, or one language silently loses the caveat.
    if (!ix.meaningZhHant.trim() || !ix.meaningEn.trim()) {
      problems.push(`${ix.id}: interchange is missing a stated meaning in one language`);
    }
    if (!ix.labelZhHant.trim() || !ix.labelEn.trim()) {
      problems.push(`${ix.id}: interchange is missing a label in one language`);
    }
    checkSources(ix.sourceIds, ix.id);
  }

  for (const card of d.flashcards) {
    for (const id of card.relatedAcupointIds) {
      if (!pointIds.has(id)) problems.push(`${card.id}: unknown acupoint "${id}"`);
    }
    for (const id of card.relatedMeridianIds) {
      if (!meridianIds.has(id)) problems.push(`${card.id}: unknown meridian "${id}"`);
    }
    checkSources(card.sourceIds, card.id);
  }

  for (const q of d.quizItems) {
    checkSources(q.sourceIds, q.id);
    if (q.kind === 'multiple_choice') {
      if (!q.correctOptionId) problems.push(`${q.id}: multiple choice without a correct option`);
      else if (!q.options.some((o) => o.id === q.correctOptionId)) {
        problems.push(`${q.id}: correctOptionId not among options`);
      }
      if (q.options.length < 2) problems.push(`${q.id}: fewer than two options`);
    }
    if (q.kind === 'locate_point') {
      if (!q.targetAcupointId) problems.push(`${q.id}: locate item without a target point`);
      else if (!pointIds.has(q.targetAcupointId)) problems.push(`${q.id}: unknown target point`);
    }
    if (!q.explanationEn.trim() || !q.explanationZhHant.trim()) {
      problems.push(`${q.id}: quiz feedback must explain the answer`);
    }
  }

  for (const day of d.curriculumDays) {
    for (const id of day.meridianIds) {
      if (!meridianIds.has(id)) problems.push(`${day.id}: unknown meridian "${id}"`);
    }
    checkSources(day.sourceIds, day.id);
    for (const s of day.sections) checkSources(s.sourceIds, s.id);
  }

  return problems;
}

export { acupointById };
export const meridianById = new Map(meridians.map((m) => [m.id, m]));
export const functionById = new Map(traditionalFunctions.map((f) => [f.id, f]));
export const sourceById = new Map(sources.map((s) => [s.id, s]));
