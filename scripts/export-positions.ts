/**
 * Export every acupoint placement and every meridian route to one markdown file.
 *
 *   npx tsx scripts/export-positions.ts [outfile]
 *
 * Read straight from the dataset — nothing here is transcribed by hand, so the
 * file cannot drift from the app the way a typed table would. Re-run it after
 * ANY coordinate change; the atlas ladder and landmark frame move, and a
 * snapshot taken before that silently stops matching the app.
 *
 * The export is meant to be readable outside this repo, so it carries its own
 * provenance: the schematic-status warning, the CC BY 4.0 attribution the
 * vertebral ladder obliges, and the note that these coordinates belong to THIS
 * figure and are not anatomical. Those travel with the file rather than living
 * only here, because a handed-over file loses everything that stayed behind.
 */
import { writeFileSync } from 'node:fs';
import { dataset } from '../src/data/index';
import {
  ATLAS_HEIGHT,
  ATLAS_WIDTH,
  BACK_LINE_1,
  BACK_LINE_2,
  CUN,
  LANDMARKS,
  LEVELS,
  SPINE,
} from '../src/data/atlas';

const OUT = process.argv[2] ?? '../atlas-positions.md';
const n2 = (v: number) => v.toFixed(2);
const n4 = (v: number) => v.toFixed(4);
/** Markdown table cells: escape pipes, collapse newlines. */
const cell = (s: string | null | undefined) =>
  (s ?? '—').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim() || '—';

const L: string[] = [];
const w = (s = '') => L.push(s);

const meridianOf = new Map(dataset.meridians.map((m) => [m.id, m]));
const usedSourceIds = new Set<string>();
const noteSources = (ids?: readonly string[]) => ids?.forEach((i) => usedSourceIds.add(i));

/* ---------------------------------------------------------------- header */

w('# Let Energy Flow — acupoint positions and meridian routes');
w();
w(`Generated ${new Date().toISOString().slice(0, 10)} from \`app/src/data\`. Every number here is`);
w('read from the dataset at generation time; nothing is transcribed by hand.');
w();
w('> **These are schematic layout coordinates, not anatomical measurements.**');
w('> Every placement in this file carries `schematic_unvalidated`. They position a');
w('> marker on this project’s own drawn figure to support spatial memory. They are');
w('> not validated anatomical coordinates and must not be used to locate a point on');
w('> a real body. The 定位 text beside them is the reviewed wording and is the part');
w('> that describes a real location; the coordinates only render it.');
w();
w(`**Scope.** ${dataset.acupoints.length} acupoints, ${dataset.meridians.length} meridians.`);
w('Traditional 功效 / 主治 are deliberately excluded — this file is positions only.');
w();

/* ----------------------------------------- what a downstream consumer needs */

w('## If you are reading this outside the Let Energy Flow repo');
w();
w('### The coordinates are not anatomical, and are not portable');
w();
w(`\`x\`/\`y\` are positions on **one specific drawing** — this project's ${ATLAS_WIDTH} × ${ATLAS_HEIGHT}`);
w('schematic figure, built to a 7.5-head artistic canon. They are normalised to');
w('that canvas, not to a body. Dropped onto a different figure — another drawing,');
w('a photograph, a 3D mesh — they will not land on the right anatomy, because the');
w('proportions they were fitted to are not that figure’s proportions.');
w();
w('**The portable column is 定位.** That text states each point by anatomical');
w('landmark and bone-cun distance, which is what actually transfers. A consumer');
w('with its own figure should re-derive coordinates from the 定位 text against its');
w('own landmark and cun frame — the same way this project does — rather than');
w('reusing these numbers.');
w();
w('You do **not** need this project’s generator to use the file: every value here');
w('is already computed. The generator only reads the dataset and formats it.');
w();
w('### Attribution that must travel with any derivative');
w();
w('The back-view vertebral ladder — the y positions of the 背俞穴, the back 督脈');
w('points and the paravertebral 膀胱經 points — is measured from the HuBMAP CCF 3D');
w('Reference Object Library, which is released under **CC BY 4.0**. Attribution is');
w('required of anything derived from it, including a coordinate table such as this');
w('one. If you ship, publish or hand on anything based on those positions, carry');
w('this line with it:');
w();
w('> Browne, K., Schlehlein, H., Herr II, B. W., Quardokus, E., Bueckle, A.,');
w('> Börner, K. (2022). HuBMAP CCF 3D Reference Object Library. CC BY 4.0.');
w();
w('The 中文定位 wording follows GB/T 12346-2021 via this project’s editorial');
w('worksheets. Public access to a standard is not permission to republish it:');
w('treat this file as study material, not as a redistributable dataset.');
w();
w('### It is a snapshot');
w();
w('Coordinates change when the figure or the landmark frame changes, and this file');
w('does not update itself. Check the generation date above against the source repo');
w('before trusting it, and regenerate with `npx tsx scripts/export-positions.ts`');
w('rather than editing it by hand.');
w();

/* ------------------------------------------------- the coordinate system */

w('## How to read the coordinates');
w();
w(`The atlas is a **${ATLAS_WIDTH} × ${ATLAS_HEIGHT}** SVG canvas with two views, \`front\` and`);
w('`back`. Placements are stored **normalised** (0–1); the pixel columns below are');
w(`\`x × ${ATLAS_WIDTH}\` and \`y × ${ATLAS_HEIGHT}\`, rounded. y increases **downward**.`);
w();
w('**Side convention.** Bilateral points are stored once, with `side` naming which');
w('side of the body the marker is drawn for. On the `back` view the observer stands');
w('behind the figure, so the figure’s left is the viewer’s left — the mirror of the');
w('front view.');
w();
w('### Vertical frame');
w();
w('The figure is drawn to a 7.5-head canon. One head unit = 111 px, crown at y = 35.');
w();
w('| level | y |');
w('|---|---:|');
for (const [k, v] of Object.entries(LEVELS)) w(`| ${k} | ${n2(v as number)} |`);
w();
w('### Vertebral ladder');
w();
w('Hung between the drawn C7 and the drawn coccyx tip, with the reference spine’s');
w('proportions distributed across that span at one scale. See');
w('`content-review/3d-asset-survey-2026-08-22.md` for the derivation and its licence.');
w();
w('| level | y | | level | y |');
w('|---|---:|---|---|---:|');
{
  const t = [...Array(12)].map((_, i) => [`T${i + 1}`, SPINE.t(i + 1)] as const);
  const rest = [
    ...[...Array(5)].map((_, i) => [`L${i + 1}`, SPINE.l(i + 1)] as const),
    ...[...Array(4)].map((_, i) => [`S${i + 1}`, SPINE.s(i + 1)] as const),
    ['coccyx tip', SPINE.coccyx] as const,
  ];
  for (let i = 0; i < Math.max(t.length, rest.length); i += 1) {
    const a = t[i] ? `${t[i]![0]} | ${n2(t[i]![1])}` : ' | ';
    const b = rest[i] ? `${rest[i]![0]} | ${n2(rest[i]![1])}` : ' | ';
    w(`| ${a} | | ${b} |`);
  }
}
w();
w(`Paravertebral lines: 1.5 cun at x = ${BACK_LINE_1}, 3 cun at x = ${BACK_LINE_2}.`);
w();
w('### Surface landmarks');
w();
w('| landmark | y (or value) |');
w('|---|---:|');
for (const [k, v] of Object.entries(LANDMARKS)) {
  if (typeof v === 'number') w(`| ${k} | ${n2(v)} |`);
}
w();
w('### Cun scales, px per cun');
w();
w('Bone-cun is proportional, so each body segment carries its own scale, derived');
w('from the two landmarks that bound it.');
w();
w('| segment | px/cun |');
w('|---|---:|');
for (const [k, v] of Object.entries(CUN)) {
  if (typeof v === 'number') w(`| ${k} | ${n2(v)} |`);
}
w();

/* ------------------------------------------------------------- meridians */

w('## Meridians');
w();
w('| code | 中文 | English | element | paired | points | in course | style |');
w('|---|---|---|---|---|---:|---:|---|');
for (const m of dataset.meridians) {
  noteSources(m.meridianTotalPoints?.sourceIds);
  const paired = m.pairedMeridianId ? meridianOf.get(m.pairedMeridianId)?.code ?? '—' : '—';
  w(
    `| ${m.code} | ${cell(m.nameZhHant)} | ${cell(m.nameEn)} | ${cell(m.element)} | ${paired} ` +
      `| ${m.meridianTotalPoints?.value ?? '—'} | ${m.coursePointCount ?? '—'} | ${cell(m.lineStyle)} |`,
  );
}
w();

for (const m of dataset.meridians) {
  w(`### ${m.code} · ${m.nameZhHant} — ${m.nameEn}`);
  w();
  const regions = (m.bodyRegions ?? []) as readonly string[];
  if (regions.length) w(`**Regions.** ${regions.join(' · ')}`);
  w();
  if (m.route?.value) {
    noteSources(m.route.sourceIds);
    w(`**循行 (route).** ${cell(m.route.value.zhHant)}`);
    w();
    w(`**Route.** ${cell(m.route.value.en)}`);
    w();
    w(`*Route review status: \`${m.route.reviewStatus ?? 'unreviewed'}\`.*`);
    w();
  }
  const order = (m.pointOrder ?? []) as readonly string[];
  if (order.length) {
    const codes = order.map((id) => dataset.acupoints.find((p) => p.id === id)?.code ?? id);
    w(`**Point order.** ${codes.join(' → ')}`);
    w();
  }
}

/* ------------------------------------------------------------- acupoints */

w('## Acupoint positions');
w();
w('One row per placement. `x`/`y` are normalised; `px`/`py` are the same values on');
w(`the ${ATLAS_WIDTH} × ${ATLAS_HEIGHT} canvas.`);
w();

for (const m of dataset.meridians) {
  const pts = dataset.acupoints
    .filter((p) => p.meridianId === m.id)
    .sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0));
  if (!pts.length) continue;
  w(`### ${m.code} · ${m.nameZhHant} (${pts.length} points)`);
  w();
  w('| code | 中文 | English | pinyin | region | view | side | x | y | px | py | status |');
  w('|---|---|---|---|---|---|---|---:|---:|---:|---:|---|');
  for (const p of pts) {
    const places = (p.placements ?? []) as readonly {
      view: string;
      x: number;
      y: number;
      side?: string;
      status: string;
    }[];
    if (!places.length) {
      w(
        `| ${p.code} | ${cell(p.nameZhHant)} | ${cell(p.nameEn)} | ${cell(p.pinyin)} ` +
          `| ${cell(p.bodyRegion)} | — | — | — | — | — | — | *no placement* |`,
      );
      continue;
    }
    for (const [i, pl] of places.entries()) {
      const head =
        i === 0
          ? `| ${p.code} | ${cell(p.nameZhHant)} | ${cell(p.nameEn)} | ${cell(p.pinyin)} | ${cell(p.bodyRegion)} `
          : '| ↳ | | | | ';
      w(
        `${head}| ${pl.view} | ${cell(pl.side)} | ${n4(pl.x)} | ${n4(pl.y)} ` +
          `| ${Math.round(pl.x * ATLAS_WIDTH)} | ${Math.round(pl.y * ATLAS_HEIGHT)} | \`${pl.status}\` |`,
      );
    }
  }
  w();
  w(`<details><summary>定位 — ${m.code} location text</summary>`);
  w();
  w('| code | 中文定位 | English | review |');
  w('|---|---|---|---|');
  for (const p of pts) {
    noteSources(p.location?.sourceIds);
    w(
      `| ${p.code} | ${cell(p.location?.value?.zhHant)} | ${cell(p.location?.value?.en)} ` +
        `| \`${p.location?.reviewStatus ?? 'unreviewed'}\` |`,
    );
  }
  w();
  w('</details>');
  w();
}

/* --------------------------------------------------------------- sources */

w('## Sources cited by the fields above');
w();
w('Location and route wording carry per-field provenance. These are the sources');
w('those fields name.');
w();
w('| id | title | reuse | review |');
w('|---|---|---|---|');
for (const s of dataset.sources) {
  if (!usedSourceIds.has(s.id)) continue;
  w(`| \`${s.id}\` | ${cell(s.title)} | ${cell(s.reuseStatus)} | ${cell(s.reviewStatus)} |`);
}
w();
w('---');
w();
w('*Positions only. Traditional 功效 and 主治 are excluded from this export by');
w('design — some of them are model-written rather than read from a source, and');
w('they are not reference content.*');

writeFileSync(OUT, `${L.join('\n')}\n`, 'utf8');
console.log(`wrote ${OUT} — ${L.length} lines`);
