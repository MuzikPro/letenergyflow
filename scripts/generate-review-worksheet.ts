/**
 * Generates the owner-facing editorial review worksheet from the live dataset,
 * so the list of uncertain fields can never drift from what the app shows.
 *
 * Run:  npx vite-node scripts/generate-review-worksheet.ts
 * Output: ../content-review-worksheet.md (repo root)
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dataset } from '../src/data';
import type { Acupoint } from '../src/data/types';

const CLASS_LABEL: Record<string, string> = {
  jing_well: '井穴 jing-well',
  ying_spring: '滎穴 ying-spring',
  shu_stream: '輸穴 shu-stream',
  jing_river: '經穴 jing-river',
  he_sea: '合穴 he-sea',
  yuan_source: '原穴 yuan-source',
  luo_connecting: '絡穴 luo-connecting',
  xi_cleft: '郄穴 xi-cleft',
  front_mu: '募穴 front-mu',
  back_shu: '背俞穴 back-shu',
  influential_meeting: '八會穴 influential',
  crossing: '交會穴 crossing',
  lower_he_sea: '下合穴 lower he-sea',
  confluent: '八脈交會穴 confluent',
  entry: '入 entry',
  exit: '出 exit',
};

const FILL = '＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿';

function pointBlock(p: Acupoint): string {
  const lines: string[] = [];
  lines.push(`### ${p.code}　${p.nameZhHant}（${p.pinyin}）`);
  lines.push('');
  lines.push(
    `- **英文名 English name**（未審核 unreviewed）：\`${p.nameEn ?? '—'}\``,
    `  - [ ] 正確 correct　／　修正 correction：${FILL}`,
  );
  if (p.location) {
    lines.push(
      `- **定位 Location**（未審核）：${p.location.value.zhHant}`,
      `  - [ ] 正確 correct　／　修正 correction：${FILL}`,
    );
  } else {
    lines.push(
      `- **定位 Location**：⚠️ 來源未記錄 none recorded — 請填寫（並註明出處 with source）：`,
      `  - 中文：${FILL}`,
      `  - 出處 Source：${FILL}`,
    );
  }
  if (p.classifications) {
    const cls = p.classifications.value.map((c) => CLASS_LABEL[c] ?? c).join('、');
    lines.push(
      `- **特定穴 Classifications**（未審核）：${cls}`,
      `  - [ ] 正確 correct　／　修正 correction：${FILL}`,
    );
  } else {
    lines.push(`- **特定穴 Classifications**：（未記錄 none）補充＋出處：${FILL}`);
  }
  if (p.memoryCues.length > 0) {
    for (const c of p.memoryCues) {
      lines.push(`- **記憶提示 Cue**（未審核）：${c.value.zhHant}`, `  - [ ] 保留 keep　／　修正：${FILL}`);
    }
  } else {
    lines.push(`- **記憶提示 Cue**：（無 none）可選填 optional：${FILL}`);
  }
  lines.push(
    `- **圖上位置 Marker**：示意排版座標（schematic_unvalidated）— [ ] 位置大致合理 roughly plausible　／　備註：${FILL}`,
  );
  lines.push(`- **備註 Notes**：${FILL}`);
  lines.push('');
  return lines.join('\n');
}

const out: string[] = [];
out.push('# 內容編審工作表 · Content review worksheet');
out.push('');
out.push(`> 由資料集自動產生 Generated from the live dataset — ${new Date().toISOString().slice(0, 10)}`);
out.push('> 產生指令 Regenerate: `cd app && npx vite-node scripts/generate-review-worksheet.ts`');
out.push('');
out.push('## 填寫規則 Rules');
out.push('');
out.push('1. **只填你能給出出處的內容。** 修正處請一併註明來源（標準、教科書、專家）。');
out.push('   Only fill in what you can source; note the reference beside each correction.');
out.push('2. **不確定就留空。** 空白比錯誤安全；資料在錄入出處前一律維持 `unreviewed`。');
out.push('   Leave blanks when unsure — a blank is safer than a guess.');
out.push('3. 此工作表是教學內容編審用，不是臨床定位依據。');
out.push('   This worksheet is for editorial review of teaching content, not clinical point location.');
out.push('');

const missingLoc = dataset.acupoints.filter((p) => !p.location).length;
const withCls = dataset.acupoints.filter((p) => p.classifications).length;
out.push('## 現況統計 Current state');
out.push('');
out.push(`- 穴位 points：${dataset.acupoints.length}（全部 \`unreviewed\` all unreviewed）`);
out.push(`- 缺定位 missing location：${missingLoc}／${dataset.acupoints.length}`);
out.push(`- 已有特定穴分類 with classifications：${withCls}（其餘未記錄）`);
out.push('- 英文譯名 English renderings：全部為常見譯法、未經審核 common renderings, all unreviewed');
out.push('- 圖上座標 marker positions：全部為示意排版座標 all schematic, none validated');
out.push('');

for (const m of dataset.meridians) {
  out.push(`## ${m.code} ${m.nameZhHant} · ${m.nameEn}`);
  out.push('');
  out.push('**經絡層級待確認 Meridian-level items:**');
  out.push('');
  out.push(`- 英文名 English name（未審核）：\`${m.nameEn}\` — 修正：${FILL}`);
  out.push(
    `- 循行描述 Route wording（未審核）：${m.route.value.zhHant}`,
    `  - [ ] 正確　／　修正：${FILL}`,
  );
  out.push(
    `- 總穴數 catalogue count（未審核）：${m.meridianTotalPoints.value} — [ ] 正確　／　修正：${FILL}`,
  );
  if (!m.pairedMeridianId) {
    out.push('- 表裡經 pairing：尚未建模（配對經絡未載入）not yet modelled — its pair is not loaded.');
  }
  out.push('');
  for (const id of m.pointOrder) {
    const p = dataset.acupoints.find((x) => x.id === id);
    if (p) out.push(pointBlock(p));
  }
}

const target = resolve(__dirname, '../../content-review-worksheet.md');
writeFileSync(target, out.join('\n'), 'utf8');
console.log(`Wrote ${target} — ${dataset.acupoints.length} points, ${missingLoc} missing locations.`);
