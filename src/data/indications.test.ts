import { describe, expect, it } from 'vitest';
// @ts-expect-error -- no node types in the app tsconfig; see nav.test.tsx.
import { readFileSync } from 'node:fs';
import { acupointById, dataset } from './index';
import {
  actionsSrcFor,
  entryFor,
  indicationsSrcFor,
  modelEntry,
  modelWrittenFor,
  MODEL_SOURCE_ID,
  actionsSourcesOf,
  indicationsByCode,
  INDICATION_CHANNELS,
  INDICATION_SOURCES,
  indicationsSourcesOf,
} from './indications';
import { searchIndex } from '../search';

/**
 * 功效 and 主治 are the only content in this app that could be mistaken for
 * advice, so they get the strictest guards in it.
 *
 * The important one is traceability: every 中文 string has to be findable in
 * the file it cites. That is what separates "the owner's study notes say this"
 * from "the app made it up", and no amount of careful wording substitutes for
 * it. The rest guard the two boundaries the decision to carry indications does
 * NOT move — needling technique stays out, and the symptom index never exists.
 */

// Vitest's cwd is the app root; these files live one level up — in the PRIVATE
// origin repository. The open-source distribution ships without them (they are
// someone's course material) and with an empty `indications.model.ts`, so the
// suites that verify strings against those files, or that assert the written
// layer fills a gap, run only where the material exists. The dataset-only
// safety guards below (no needling language, no symptom index) run everywhere.
const read = (p: string): string | null => {
  try {
    return readFileSync(`../${p}`, 'utf8') as string;
  } catch {
    return null;
  }
};
const worksheetRead = read('Learn content/review-worksheet-filled.md');
const indexTableRead = read('26天经络穴位全掌握_部位检索表.md');
const HAVE_PRIVATE = worksheetRead !== null && indexTableRead !== null;
const worksheet = worksheetRead ?? '';
const indexTable = indexTableRead ?? '';
const dPrivate = HAVE_PRIVATE ? describe : describe.skip;
const itPrivate = HAVE_PRIVATE ? it : it.skip;

const dOpen = HAVE_PRIVATE ? describe.skip : describe;

dOpen('open-source distribution invariant', () => {
  it('carries no model-written 功效／主治 at all', () => {
    // The private sources and the populated model table travel together; this
    // distribution has neither. Not one field may cite the model id — content
    // for these points has to arrive by ingesting a real source, never by
    // refilling indications.model.ts.
    for (const p of dataset.acupoints) {
      for (const f of [p.actions, p.indications]) {
        expect({ code: p.code, model: f?.sourceIds.includes(MODEL_SOURCE_ID) ?? false }).toEqual({
          code: p.code,
          model: false,
        });
      }
    }
  });
});

/**
 * The index table is written in simplified characters and the app displays
 * traditional, so a literal search would miss every row. Only the handful of
 * characters actually used by the ingested strings are mapped — a general
 * converter would be a dependency, and a wrong one would hide a real mismatch.
 */
const S2T: Record<string, string> = {
  气: '氣', 头: '頭', 项: '項', 强: '強', 肿: '腫', 无: '無', 脉: '脈', 经: '經', 肺: '肺',
  万: '萬', 齿: '齒', 面: '面', 症: '症', 呕: '嘔', 壮: '壯', 吐: '吐',
  胁: '脅', 胀: '脹', 泻: '瀉', 调: '調', 贫: '貧', 湿: '濕', 遗: '遺', 横: '橫',
  荣: '榮', 乡: '鄉', 窦: '竇', 机: '機', 孙: '孫', 阴: '陰', 隐: '隱', 门: '門', 冲: '衝',
  云: '雲', 泽: '澤', 渊: '淵', 阳: '陽',
};
const toTraditional = (s: string) => [...s].map((c) => S2T[c] ?? c).join('');

dPrivate('功效 and 主治 — traceability', () => {
  /** The text of whichever file a field says it came from. */
  const bodyOf = (sourceIds: string[]) =>
    sourceIds[0] === 'src_owner_index_table_2026_08' ? toTraditional(indexTable) : worksheet;

  /**
   * The rows of a source file that name a given point, by its 中文 name.
   *
   * Row-level rather than whole-file. The Spleen forced this: its index-table
   * rows are misnumbered above SP20 — 天溪 is listed as SP22, a code that does
   * not exist on a twenty-one-point channel — so the entries are reconciled on
   * the point's NAME against the project's own reviewed mapping. A whole-file
   * search would have accepted a string lifted from the wrong row entirely.
   */
  /**
   * The slice of a source that belongs to one point.
   *
   * The strategy comes from WHICH source, not from sniffing the text: the index
   * table is one row per point, the worksheet a `### CODE　NAME` block whose
   * 備註 sits several lines below its heading. An earlier version guessed by
   * looking for '### ' in the body and got the table wrong — it carries three
   * such headings in its trailing index sections.
   */
  const sliceFor = (code: string, name: string) => {
    const src = indicationsSourcesOf(code)[0];
    if (src === 'src_owner_index_table_2026_08') {
      return toTraditional(indexTable)
        .split('\n')
        .filter((l) => l.includes(name))
        .join('\n');
    }
    return worksheet
      .split(/^### /m)
      .filter((b) => b.split('\n')[0]?.includes(name))
      .join('\n');
  };

  it('maps every character it needs to, and knows which ones those are', () => {
    /*
     * The map only has to cover points whose field cites the SIMPLIFIED index
     * table; everything sourced from the worksheet is already traditional.
     * Asserting that here means the row-level check below cannot silently pass
     * by failing to find any row at all — which is how an incomplete map would
     * present itself.
     */
    const idxT = toTraditional(indexTable);
    const fromTable = Object.keys(indicationsByCode).filter(
      (c) =>
        indicationsByCode[c]!.indicationsZh &&
        indicationsSourcesOf(c)[0] === 'src_owner_index_table_2026_08',
    );
    expect(fromTable.length).toBeGreaterThan(15);
    for (const code of fromTable) {
      const name = dataset.acupoints.find((p) => p.code === code)?.nameZhHant;
      expect({ code, name, findable: Boolean(name && idxT.includes(name)) }).toEqual({
        code,
        name,
        findable: true,
      });
    }
  });

  it('ties every ingested string to a row that names its point', () => {
    for (const [code, entry] of Object.entries(indicationsByCode)) {
      const point = dataset.acupoints.find((p) => p.code === code);
      if (!point || !entry.indicationsZh) continue;
      const rows = sliceFor(code, point.nameZhHant);
      // Non-empty first: an empty slice would make the assertion below fail for
      // the wrong reason, and an over-broad one would make it pass for the
      // wrong reason.
      expect({ code, name: point.nameZhHant, found: rows.length > 0 }).toEqual({
        code,
        name: point.nameZhHant,
        found: true,
      });
      expect({ code, name: point.nameZhHant, onItsOwnRow: rows.includes(entry.indicationsZh) }).toEqual(
        { code, name: point.nameZhHant, onItsOwnRow: true },
      );
    }
  });

  it('records the index table’s Spleen numbering as wrong, and does not follow it', () => {
    // 食竇 SP17, 天溪 SP18, 胸鄉 SP19 per the reviewed records; the table calls
    // them SP23, SP22 and SP21. The channel has 21 points, so SP22/SP23 cannot
    // exist. The ingest follows the names, and this pins the discrepancy so it
    // is not quietly "fixed" in one place and left in the other.
    expect(indexTable).toContain('脾经 SP22');
    expect(indexTable).toContain('脾经 SP23');
    expect(dataset.acupoints.filter((p) => p.meridianId === 'mer_sp').length).toBe(21);
    expect(acupointById.get('pt_sp17')!.nameZhHant).toBe('食竇');
    expect(acupointById.get('pt_sp18')!.nameZhHant).toBe('天溪');
    expect(acupointById.get('pt_sp19')!.nameZhHant).toBe('胸鄉');
    // 天溪's indication is the one the table printed against SP22.
    expect(indicationsByCode.SP18!.indicationsZh).toBe('乳汁不足、胸脅痛');
  });

  it('finds every ingested string in the source it cites', () => {
    /*
     * Substring, not equality: a documented cut is allowed (a technique clause
     * dropped from the end, 急救 dropped from a list) but a rewrite is not.
     * Whichever file the entry names is the one searched — when the Large
     * Intestine moved its 主治 onto the worksheet, this test is what noticed.
     */
    for (const [code, entry] of Object.entries(indicationsByCode)) {
      if (entry.actionsZh) {
        const inSource = bodyOf(actionsSourcesOf(code)).includes(entry.actionsZh);
        expect({ code, field: 'actions', inSource }).toEqual({ code, field: 'actions', inSource: true });
      }
      if (entry.indicationsZh) {
        const inSource = bodyOf(indicationsSourcesOf(code)).includes(entry.indicationsZh);
        expect({ code, field: 'indications', inSource }).toEqual({
          code,
          field: 'indications',
          inSource: true,
        });
      }
    }
  });

  it('never lets a field cite a file that does not carry it', () => {
    // The inverse of the check above, and the one that would catch a copy-paste
    // of the wrong source id: swap LI2's 主治 source to the index table and it
    // is no longer findable there.
    const wrong = toTraditional(indexTable);
    expect(wrong.includes(indicationsByCode.LI2!.indicationsZh!)).toBe(false);
    expect(indicationsSourcesOf('LI2')).toEqual(['src_owner_worksheet_2026_08']);
  });

  it('cites the file each field actually came from', () => {
    const byId = new Map(dataset.sources.map((s) => [s.id, s]));
    expect(byId.get(INDICATION_SOURCES.actions[0]!)?.reference).toBe(
      'content-review/worksheet-filled-2026-08-05.md',
    );
    expect(byId.get(INDICATION_SOURCES.indications[0]!)?.reference).toBe(
      '26天经络穴位全掌握_部位检索表.md',
    );
    // Both are owner curriculum, so neither may claim to be a checked standard.
    for (const id of [...INDICATION_SOURCES.actions, ...INDICATION_SOURCES.indications]) {
      expect(byId.get(id)?.sourceType).toBe('user_curriculum');
    }
  });
});

describe('功效 and 主治 — what stays out', () => {
  const shown = () =>
    dataset.acupoints.flatMap((p) =>
      [p.actions?.value.zhHant, p.actions?.value.en, p.indications?.value.zhHant, p.indications?.value.en].filter(
        (v): v is string => Boolean(v),
      ),
    );

  it('carries no needling, depth, angle or bloodletting language', () => {
    // The worksheet's 備註 field mixes these in with the actions; the index
    // table's 主治 column mixes in first aid. Both stay excluded — that is the
    // one line the decision to carry indications does not move.
    const banned = [
      '針刺', '深刺', '淺刺', '點刺', '出血', '放血', '艾灸', '禁針', '急救', '寸',
      // Pregnancy: 合谷 and 缺盆 carry 「孕婦禁針」/「（可能引產）」.
      '孕婦', '引產',
      // Stomach adds its own: artery cautions on 人迎, 氣衝 and 沖陽, a
      // moxibustion prohibition on 承泣, and 乳中's 「一般不針不灸」.
      '禁灸', '慎針', '避開', '動脈', '不針', '不灸', '常灸',
    ];
    for (const text of shown()) {
      for (const w of banned) {
        expect({ w, text: text.slice(0, 40), present: text.includes(w) }).toEqual({
          w,
          text: text.slice(0, 40),
          present: false,
        });
      }
    }
    /*
     * Precise phrases, not fragments. An earlier draft banned "bleed" and
     * tripped on 止血 "stops bleeding" — an action, and the opposite of the
     * technique being excluded. A guard that cannot tell those apart would
     * have been switched off rather than fixed.
     */
    for (const w of ['needle', 'moxa', 'bloodlet', 'prick to bleed', 'first aid', 'insertion depth']) {
      for (const text of shown()) expect(text.toLowerCase()).not.toContain(w);
    }
  });

  itPrivate('drops exactly the clauses the sources put beside them', () => {
    // 少商 LU11 and 經渠 LU8 both have a technique clause in the same sentence.
    expect(worksheet).toContain('井主心下滿；醒神開竅，常點刺出血');
    expect(indicationsByCode.LU11!.actionsZh).toBe('井主心下滿；醒神開竅');
    expect(worksheet).toContain('經主喘咳寒熱；注意避開橈動脈');
    expect(indicationsByCode.LU8!.actionsZh).toBe('經主喘咳寒熱');
    // 中府 LU1's remark is technique end to end, so it yields no action at all.
    expect(indicationsByCode.LU1!.actionsZh).toBeNull();

    // Stomach: three artery cautions, a moxibustion prohibition and a
    // pregnancy warning, each sharing a sentence with the indications kept.
    expect(worksheet).toContain('注意避開頸總動脈；治咽喉腫痛、高血壓');
    expect(indicationsByCode.ST9!.indicationsZh).toBe('咽喉腫痛、高血壓');
    expect(worksheet).toContain('孕婦禁針；治咳嗽氣喘、缺盆中痛');
    expect(indicationsByCode.ST12!.indicationsZh).toBe('咳嗽氣喘、缺盆中痛');
    expect(worksheet).toContain('禁灸、慎針，主治目疾');
    expect(indicationsByCode.ST1!.indicationsZh).toBe('目疾');
    // 足三里's own remark is moxibustion end to end, so its 主治 is taken from
    // the other source rather than salvaged out of that sentence.
    expect(worksheet).toContain('保健要穴，常灸治虛勞諸證');
    expect(indicationsSourcesOf('ST36')).toEqual(['src_owner_index_table_2026_08']);
  });

  it('never becomes a symptom index', () => {
    /*
     * The hazard is emergent, not per-entry: with 主治 in the search index the
     * app answers "頭痛" with a list of points, which is a treatment
     * recommender however carefully each line is worded. The search index is
     * built from name, pinyin, alias, code, meridian and location only.
     */
    for (const q of ['咳嗽', '頭痛', '氣喘', '咽喉腫痛', 'cough', 'wheezing', 'headache']) {
      const found = searchIndex.search(q).acupoints.map((r) => r.id);
      expect({ q, found }).toEqual({ q, found: [] });
    }
    // And the guard is not vacuous: the same index does find a point by name.
    expect(searchIndex.search('太淵').acupoints.length).toBeGreaterThan(0);
  });
});

describe('model-written entries — the rules that make them safe to carry', () => {
  /*
   * These are the only claims in the project that were not read out of a
   * document. The owner asked for all 362 points covered for personal study,
   * and the survey showed the files reach 63% at best. What keeps that from
   * quietly corrupting the sourced content is structural, and this is it.
   */
  const modelCodes = dataset.acupoints.map((p) => p.code).filter((c) => modelEntry(c));

  itPrivate('never supplies a FIELD that a file already attests', () => {
    /*
     * Per field, not per point. A written entry may fill a gap the file leaves —
     * 中府 LU1 has a sourced 主治 and no sourced 功效, and covering all 362 means
     * writing that 功效 — but it must never supply one the file already has.
     * Stated this way the rule stays true as coverage fills in, and it is not
     * vacuous: 63 points now have one sourced field and one written one.
     */
    const bothOnSameField: string[] = [];
    let mixed = 0;
    for (const code of modelCodes) {
      const filed = indicationsByCode[code];
      const written = modelWrittenFor(code);
      if (!written) continue;
      if (filed?.actionsZh && written.actionsZh) bothOnSameField.push(`${code}.actions`);
      if (filed?.indicationsZh && written.indicationsZh) bothOnSameField.push(`${code}.indications`);
      const a = entryFor(code)!;
      if (
        (filed?.actionsZh && !filed?.indicationsZh && a.indicationsZh) ||
        (filed?.indicationsZh && !filed?.actionsZh && a.actionsZh)
      ) {
        mixed += 1;
      }
    }
    expect(bothOnSameField).toEqual([]);
    // The mixed case has to actually occur, or the rule above proves nothing.
    expect(mixed).toBeGreaterThan(50);
  });

  it('never overwrites a field that a file already attests', () => {
    for (const code of modelCodes) {
      const filed = indicationsByCode[code];
      if (filed?.actionsZh) {
        expect({ code, kept: entryFor(code)!.actionsZh }).toEqual({ code, kept: filed.actionsZh });
        expect(actionsSrcFor(code)).not.toContain(MODEL_SOURCE_ID);
      }
      if (filed?.indicationsZh) {
        expect({ code, kept: entryFor(code)!.indicationsZh }).toEqual({
          code,
          kept: filed.indicationsZh,
        });
        expect(indicationsSrcFor(code)).not.toContain(MODEL_SOURCE_ID);
      }
    }
  });

  it('cites the model id and never a text', () => {
    const TEXTS = [
      'src_owner_worksheet_2026_08',
      'src_owner_index_table_2026_08',
      'src_zhenjiuxue_textbook',
      'src_gbt_12346_2021',
      'src_who_spal_2008',
      'src_lingshu',
      'src_nanjing',
      'src_jiayijing',
    ];
    for (const p of dataset.acupoints) {
      for (const f of [p.actions, p.indications]) {
        if (!f || !f.sourceIds.includes(MODEL_SOURCE_ID)) continue;
        // An unsourced claim must not name a document alongside the model id —
        // that would read as if the document attested it.
        for (const t of TEXTS) {
          expect({ code: p.code, cites: t, ok: !f.sourceIds.includes(t) }).toEqual({
            code: p.code,
            cites: t,
            ok: true,
          });
        }
        expect(f.reviewStatus).toBe('unreviewed');
      }
    }
  });

  it('registers the model id as a source that says what it is', () => {
    const src = dataset.sources.find((x) => x.id === MODEL_SOURCE_ID);
    expect(src).toBeDefined();
    expect(src!.reviewStatus).toBe('unreviewed');
    expect(src!.reviewer).toBeNull();
    // It must not pretend to be a document.
    expect(src!.notes).toMatch(/NOT A SOURCE IN THE SENSE/);
    expect(src!.reference).toMatch(/No document/);
  });

  it('obeys the same exclusions as the sourced content', () => {
    // The decision to write these does not relax the one rule the owner never
    // moved: no technique, no bloodletting, no first aid, no pregnancy framing.
    const banned = [
      '針刺', '深刺', '淺刺', '點刺', '出血', '放血', '艾灸', '禁灸', '禁針', '慎針',
      '避開', '不針', '不灸', '常灸', '孕婦', '引產', '急救',
    ];
    for (const p of dataset.acupoints) {
      for (const f of [p.actions, p.indications]) {
        if (!f || !f.sourceIds.includes(MODEL_SOURCE_ID)) continue;
        for (const w of banned) {
          expect({ code: p.code, w, present: f.value.zhHant.includes(w) }).toEqual({
            code: p.code,
            w,
            present: false,
          });
        }
      }
    }
  });

  it('stays out of the search index like everything else in these fields', () => {
    for (const q of ['心悸', '失眠', '脅痛', 'palpitations', 'insomnia']) {
      expect(searchIndex.search(q).acupoints.map((r) => r.id)).toEqual([]);
    }
  });
});

describe('功效 and 主治 — what the disclaimer page says about them', () => {
  /*
   * The Sources & disclaimer page said symptom-to-point pairings were never
   * carried into the app. That was true when it was written and false from the
   * moment the Lung was ingested — it stayed wrong for two commits because
   * nothing tied the sentence to the data. This is that tie.
   */
  const about: string = readFileSync('src/views/AboutView.tsx', 'utf8') as string;

  it('no longer claims none of this is carried', () => {
    expect(dataset.acupoints.some((p) => p.indications)).toBe(true);
    expect(about).not.toContain('None of that is carried into this app');
    expect(about).not.toContain('symptom-to-point pairings, first-aid framing');
    expect(about).not.toContain('這些一律沒有被收錄進本應用');
  });

  it('counts the covered points from the dataset rather than typing a number', () => {
    // Literals here would rot with every channel ingested — which is exactly how
    // the sentence above went wrong in the first place.
    expect(about).toContain('const coveredPoints = dataset.acupoints.filter(');
    expect(about).toContain('pointsOnCoveredChannels');
    expect(about).toContain('INDICATION_CHANNELS.length');
    const onChannels = dataset.acupoints.filter((p) =>
      INDICATION_CHANNELS.includes(p.meridianId),
    ).length;
    const covered = dataset.acupoints.filter((p) => p.actions || p.indications).length;
    // Covered can never exceed the points on covered channels, and a channel in
    // the list must actually carry something.
    expect(covered).toBeLessThanOrEqual(onChannels);
    for (const m of INDICATION_CHANNELS) {
      const carries = dataset.acupoints.some(
        (p) => p.meridianId === m && (p.actions || p.indications),
      );
      expect({ m, carries }).toEqual({ m, carries: true });
    }
    // And every point that carries something is on a listed channel.
    for (const p of dataset.acupoints) {
      if (!p.actions && !p.indications) continue;
      expect({ code: p.code, listed: INDICATION_CHANNELS.includes(p.meridianId) }).toEqual({
        code: p.code,
        listed: true,
      });
    }
  });

  it('carries the unsourced sentence once, here, not beside every field', () => {
    /*
     * 609 of 722 fields are unsourced. Spelling the warning out beside each one
     * buried the content it was warning about, so the point sheet shows a mark
     * and the sentence lives here. This checks it did not simply go missing.
     */
    expect(about).toContain('此項沒有文獻出處');
    expect(about).toContain('not a reference, and not for sharing');
    const panel: string = readFileSync('src/components/DetailPanel.tsx', 'utf8') as string;
    expect(panel).not.toContain('此項沒有文獻出處');
    expect(panel).not.toContain('not a reference, and not for sharing');
  });

  it('makes the mark a real control, not a coloured label', () => {
    const panel: string = readFileSync('src/components/DetailPanel.tsx', 'utf8') as string;
    expect(panel).toContain('unsourced-mark');
    // A <button> that navigates, so the explanation is reachable by keyboard
    // and not only by knowing where to look.
    const mark = panel.slice(panel.indexOf('unsourced-mark') - 400, panel.indexOf('unsourced-mark') + 400);
    expect(mark).toContain('type="button"');
    expect(mark).toContain("setRoute('about')");
    expect(mark).toContain('title=');
  });

  itPrivate('counts both kinds of field off the data', () => {
    expect(about).toContain('modelFields');
    expect(about).toContain('filedFields');
    const fields = dataset.acupoints
      .flatMap((p) => [p.actions, p.indications])
      .filter((f): f is NonNullable<typeof f> => Boolean(f));
    const model = fields.filter((f) => f.sourceIds.includes(MODEL_SOURCE_ID)).length;
    // The balance must be reported, not asserted at a fixed value — but the
    // written share is the larger one and the page should not imply otherwise.
    expect(model).toBeGreaterThan(fields.length - model);
    expect(fields.length).toBe(model + (fields.length - model));
  });

  it('still says the excluded categories are excluded', () => {
    for (const w of ['needling depth and angle', 'bloodletting', 'first-aid', 'pregnancy']) {
      expect(about.toLowerCase()).toContain(w.toLowerCase());
    }
    // And that the search boundary is stated where a reader will meet it.
    expect(about).toContain('absent from the search index');
  });
});

dPrivate('功效 and 主治 — scope', () => {
  it('lists every point of an ingested channel, and carries none off them', () => {
    const covered = dataset.acupoints.filter((p) => INDICATION_CHANNELS.includes(p.meridianId));
    for (const p of covered) {
      expect({ code: p.code, entry: Boolean(entryFor(p.code)) }).toEqual({
        code: p.code,
        entry: true,
      });
    }
    for (const p of dataset.acupoints) {
      if (INDICATION_CHANNELS.includes(p.meridianId)) continue;
      expect({ code: p.code, actions: p.actions, indications: p.indications }).toEqual({
        code: p.code,
        actions: null,
        indications: null,
      });
    }
  });

  it('names the points on an ingested channel that still carry nothing', () => {
    /*
     * 乳中 ST17's source treats it as a landmark; the five Spleen points are
     * simply absent from the index table. Listed rather than counted, so a new
     * silent point has to be looked at rather than absorbed into a total.
     */
    const silent = dataset.acupoints
      .filter((p) => INDICATION_CHANNELS.includes(p.meridianId) && !p.actions && !p.indications)
      .map((p) => p.code);
    // 乳中 ST17 alone. Its source treats it as a landmark rather than a point to
    // use, so nothing was written for it either — the one place where "carries
    // nothing" is a statement rather than a gap.
    expect(silent).toEqual(['ST17']);
  });

  it('records that no FILE attests a Spleen 功效, whatever is now written', () => {
    /*
     * The written layer fills these, but the sourced layer must not gain a
     * Spleen action by accident — the Day 3 worksheet carries no clinical
     * remarks, and that fact is what the survey turns on. Asserted against the
     * file table rather than the merged points, so covering the channel cannot
     * quietly erase the reason it needed covering.
     */
    const spleenCodes = dataset.acupoints
      .filter((p) => p.meridianId === 'mer_sp')
      .map((p) => p.code);
    expect(spleenCodes.length).toBe(21);
    expect(spleenCodes.filter((c) => indicationsByCode[c]?.actionsZh)).toEqual([]);
    expect(spleenCodes.filter((c) => indicationsByCode[c]?.indicationsZh).length).toBe(16);
    // And every Spleen action now on a point is marked unsourced.
    for (const p of dataset.acupoints.filter((x) => x.meridianId === 'mer_sp')) {
      if (!p.actions) continue;
      expect({ code: p.code, model: p.actions.sourceIds.includes(MODEL_SOURCE_ID) }).toEqual({
        code: p.code,
        model: true,
      });
    }
  });

  it('shows no action for 合谷, because its remark is contraindication and mnemonic', () => {
    // The best-known point on the channel, and the field is honestly empty:
    // 「孕婦禁針（可能引產）」 is a pregnancy needling contraindication and
    // 「四總穴歌」 is a mnemonic already carried in data/functions.ts.
    expect(worksheet).toContain('孕婦禁針（可能引產）');
    // No FILE gives 合谷 an action. The sheet now shows a written one, marked
    // unsourced — but nothing may ever claim the worksheet said it.
    expect(indicationsByCode.LI4!.actionsZh).toBeNull();
    expect(actionsSrcFor('LI4')).toEqual([MODEL_SOURCE_ID]);
    expect(acupointById.get('pt_li4')!.actions!.sourceIds).toEqual([MODEL_SOURCE_ID]);
    // Its 主治 is sourced, and stays sourced.
    expect(acupointById.get('pt_li4')!.indications!.sourceIds).not.toContain(MODEL_SOURCE_ID);
  });

  it('leaves a gap as a gap', () => {
    // 俠白 LU4, 經渠 LU8 and 魚際 LU10 are absent from the index table, so they
    // carry no 主治. Filling them from general knowledge would be inventing a
    // citation, which is the one thing the rules forbid without exception.
    for (const code of ['LU4', 'LU8', 'LU10']) {
      expect({ code, ind: indicationsByCode[code]!.indicationsZh }).toEqual({ code, ind: null });
      expect(indexTable).not.toContain(`肺经 ${code}`);
      // Written content fills the gap on the sheet, but the gap in the SOURCES
      // is what this test is about, and it must stay visible as unsourced.
      expect(indicationsSrcFor(code)).toEqual([MODEL_SOURCE_ID]);
    }
    // 俠白 LU4's action IS sourced; only its 主治 is written.
    expect(actionsSrcFor('LU4')).not.toContain(MODEL_SOURCE_ID);
  });

  it('shows the block for an ingested channel even when both fields are empty', () => {
    // Otherwise 乳中 ST17 — a landmark its source says not to use — would look
    // exactly like a point on a channel nobody has read yet. The distinction is
    // the whole reason gaps are kept as gaps.
    const st17 = acupointById.get('pt_st17')!;
    expect(st17.actions).toBeNull();
    expect(st17.indications).toBeNull();
    expect(INDICATION_CHANNELS.includes(st17.meridianId)).toBe(true);
    // Every channel is now covered, so there is no longer an uncovered one to
    // contrast against — which is itself the thing to assert.
    const uncovered = dataset.meridians
      .filter((m) => !INDICATION_CHANNELS.includes(m.id))
      .map((m) => m.code);
    expect(uncovered).toEqual([]);
    expect(INDICATION_CHANNELS.length).toBe(dataset.meridians.length);
  });

  it('keeps the claim in its own field, never upgrading its neighbours', () => {
    const lu2 = acupointById.get('pt_lu2')!;
    expect(lu2.actions!.reviewStatus).toBe('unreviewed');
    expect(lu2.indications!.reviewStatus).toBe('unreviewed');
    // The location beside it was source-checked against GB/T 12346-2021 and
    // must not be dragged down, nor the indication dragged up.
    expect(lu2.location!.reviewStatus).toBe('source_checked');
  });
});
