import { describe, expect, it } from 'vitest';
import { dataset } from './index';
import { MNEMONICS } from './mnemonics';
import { CONFLUENT_PAIRS, vertebralLevelOf } from './specific-points';

/**
 * 歌訣 ingest.
 *
 * A verse is easy to paste and hard to check, which is exactly why it gets
 * checked. Two of these assert facts the dataset already holds — the 背俞穴
 * verse gives a vertebral level for each of the twelve, the 八脈交會 verse pairs
 * eight points with eight vessels — and both are verified against the point
 * records. The rest guard the boundary the source file crosses and this project
 * does not: its clinical commentary is not ingested.
 */

const all = MNEMONICS.map((m) => `${m.titleZhHant} ${m.lines.join('')} ${m.noteZhHant} ${m.noteEn}`).join('\n');

describe('the 歌訣 as ingested', () => {
  it('carries every verse with a source and a plain note', () => {
    expect(MNEMONICS.length).toBeGreaterThanOrEqual(9);
    for (const m of MNEMONICS) {
      expect({ id: m.id, lines: m.lines.length > 0 }).toEqual({ id: m.id, lines: true });
      expect({ id: m.id, sourced: m.sourceIds.length > 0 }).toEqual({ id: m.id, sourced: true });
      for (const s of m.sourceIds) {
        expect({ id: m.id, s, known: dataset.sources.some((x) => x.id === s) }).toEqual({
          id: m.id,
          s,
          known: true,
        });
      }
    }
  });

  it('agrees with the dataset about where the twelve 背俞穴 sit', () => {
    /*
     * 「肺三厥四心五居，肝九膽十脾十一，胃十二椎腎十四，氣海十五大腸六，小腸
     * 十八膀十九」 — the numbers count vertebrae from T1, running on into the
     * lumbar spine, so the fourteenth is L2. Read against the reviewed 定位 of
     * each point, this is a real check on the verse rather than a restatement
     * of it: if the dataset ever disagrees, one of the two is wrong.
     */
    const claimed: [string, number][] = [
      ['BL13', 3], ['BL14', 4], ['BL15', 5], ['BL18', 9], ['BL19', 10], ['BL20', 11],
      ['BL21', 12], ['BL23', 14], ['BL24', 15], ['BL25', 16], ['BL27', 18], ['BL28', 19],
    ];
    /** Vertebra number counted from T1, continuing through the lumbar spine. */
    const ordinalOf = (level: string): number | null => {
      const m = /^([TLS])(\d+)$/.exec(level);
      if (!m) return null;
      const n = Number(m[2]);
      return m[1] === 'T' ? n : m[1] === 'L' ? 12 + n : 17 + n;
    };
    for (const [code, want] of claimed) {
      const p = dataset.acupoints.find((x) => x.code === code)!;
      const level = vertebralLevelOf(p);
      expect({ code, level: level !== null }).toEqual({ code, level: true });
      expect({ code, counted: ordinalOf(level!) }).toEqual({ code, counted: want });
    }
    // …and the verse really does name those numbers, so the table above cannot
    // drift away from the text it claims to encode.
    const verse = MNEMONICS.find((m) => m.id === 'mn_back_shu')!.lines.join('');
    for (const n of ['三', '四', '五', '九', '十', '十一', '十二', '十四', '十五', '十八', '十九']) {
      expect({ n, inVerse: verse.includes(n) }).toEqual({ n, inVerse: true });
    }
  });

  it('agrees with the reviewed record about the eight confluent pairings', () => {
    // 「公孫衝脈…內關陰維…臨泣…帶脈，陽維…外關…後溪督脈…申脈陽蹻…列缺任脈…
    // 陰蹻照海」 — every point-to-vessel pairing the verse states must match
    // CONFLUENT_PAIRS, which the 特定穴 matrix is already built from.
    const verse = MNEMONICS.find((m) => m.id === 'mn_confluent')!.lines.join('');
    for (const pair of CONFLUENT_PAIRS) {
      for (const code of [pair.foot, pair.hand]) {
        const p = dataset.acupoints.find((x) => x.code === code)!;
        // The verse uses the short form for two of them (臨泣 for 足臨泣).
        const stem = p.nameZhHant.replace(/^足/, '');
        expect({ code, name: p.nameZhHant, inVerse: verse.includes(stem) }).toEqual({
          code,
          name: p.nameZhHant,
          inVerse: true,
        });
      }
      for (const vessel of pair.vesselZhHant.split('·').map((x) => x.trim())) {
        // 陰維脈 appears as 陰維, 陽蹻脈 as 陽蹻 — match on the stem without 脈.
        const stem = vessel.replace(/脈$/, '');
        expect({ vessel, inVerse: verse.includes(stem) }).toEqual({ vessel, inVerse: true });
      }
    }
  });

  it('leaves the source’s needling and first-aid language behind', () => {
    /*
     * The file these came from wraps its verses in clinical commentary:
     * 「這裡常以刺絡放血為佳」 on 委中, 「少商放血」 for a sore throat, and
     * 「合谷有催產作用，孕婦禁用」. Technique, bloodletting and pregnancy
     * contraindications are excluded categories, and a verse ingest is exactly
     * where they would slip in unnoticed.
     */
    for (const banned of ['放血', '刺絡', '孕婦', '催產', '禁針', '灸', '針刺', '深刺']) {
      expect({ banned, present: all.includes(banned) }).toEqual({ banned, present: false });
    }
  });

  it('does not turn a verse into a symptom index', () => {
    // The verses name points and categories. The source's 主治 lists — 牙痛,
    // 面癱, 失眠 and the rest — are not carried, because a searchable
    // symptom-to-point list is a recommender however it is worded.
    for (const symptom of ['牙痛', '面癱', '失眠', '腹瀉', '便秘', '偏頭痛', '耳鳴', '癲癇']) {
      expect({ symptom, present: all.includes(symptom) }).toEqual({ symptom, present: false });
    }
  });
});
