/**
 * What these tests are actually protecting.
 *
 * Adding languages to a project whose whole discipline is "every claim carries
 * its source" creates exactly one new way to break that discipline: a curated
 * string could be translated into a third language and end up wearing the same
 * provenance as the reviewed text. So the interesting assertions here are not
 * "is the French complete" — they are "is the French confined to chrome", and
 * "does a missing entry degrade to English rather than to something invented".
 */
import { describe, expect, it } from 'vitest';
// @ts-expect-error -- no node types in the app tsconfig; see nav.test.tsx.
import { readFileSync, readdirSync, statSync } from 'node:fs';
// @ts-expect-error -- as above.
import { join } from 'node:path';
import { UI_STRINGS } from './ui';
import { UI_LANGUAGES, deviceUiLang, HTML_LANG, type UiLang } from './languages';
import { toHans, T2S_TABLE } from './hans';
import { CHROME_KEYS_GENERATED } from './chrome-keys';
import { dataset } from '../data/index';

const TRANSLATED = ['fr', 'de', 'es', 'it', 'hu', 'ru', 'uk'] as const;

/**
 * The UI roots, and only those — the same three the generator reads.
 *
 * Scanning all of `src` looked equivalent and was not: this file and the
 * generated registry both quote `t('中文', 'English')` in their own
 * docstrings, and the scan dutifully collected 'English' as a chrome string
 * the app renders. The definition of chrome lives in one place now.
 */
const UI_ROOTS = ['src/App.tsx', 'src/components', 'src/views'];

function sourceFiles(dir: string): string[] {
  if (statSync(dir).isFile()) return /\.tsx?$/.test(dir) && !dir.includes('.test.') ? [dir] : [];
  return readdirSync(dir).flatMap((name: string) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    if (!/\.tsx?$/.test(path) || path.includes('.test.')) return [];
    return [path];
  });
}

/** Every `t('中文', 'English')` literal pair in the app. */
function chromePairs(): { zh: string; en: string }[] {
  const out: { zh: string; en: string }[] = [];
  const re = /\bt\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*[,)]/g;
  for (const file of UI_ROOTS.flatMap(sourceFiles)) {
    const text = readFileSync(file, 'utf8') as string;
    for (const m of text.matchAll(re)) out.push({ zh: m[1]!, en: m[2]! });
  }
  return out;
}

describe('interface languages — the boundary that matters', () => {
  it('translates only chrome, never a string the dataset carries', () => {
    /*
     * The guard. Every 定位 text, point name, channel name and route
     * description in the loaded dataset is collected, and no translation table
     * may contain any of them as a key. A French rendering of 「在腕掌側橫紋
     * 橈側，橈動脈搏動處」 would be this project inventing a reading of a
     * source it only ever restated — which AGENTS.md forbids outright.
     */
    const curated = new Set<string>();
    for (const p of dataset.acupoints) {
      for (const v of [p.nameZhHant, p.nameZhHans, p.nameEn, p.location?.value.zhHant, p.location?.value.en]) {
        if (v) curated.add(v.trim());
      }
    }
    for (const m of dataset.meridians) {
      for (const v of [m.nameZhHant, m.nameEn, m.route?.value.zhHant, m.route?.value.en]) {
        if (v) curated.add(v.trim());
      }
    }
    expect(curated.size).toBeGreaterThan(700);
    for (const lang of TRANSLATED) {
      for (const key of Object.keys(UI_STRINGS[lang] ?? {})) {
        expect({ lang, key, curated: curated.has(key.trim()) }).toEqual({ lang, key, curated: false });
      }
    }
  });

  it('carries no key long enough to be prose rather than a label', () => {
    // A translated paragraph is how curated material would sneak in. Chrome is
    // short; anything long belongs in the source files as a zh/en pair, where
    // it falls back to English instead of being retranslated.
    for (const lang of TRANSLATED) {
      for (const key of Object.keys(UI_STRINGS[lang] ?? {})) {
        expect({ lang, key, len: key.length <= 46 }).toEqual({ lang, key, len: true });
      }
    }
  });

  it('gives every language the same keys, so no language is half-done', () => {
    const reference = Object.keys(UI_STRINGS.fr ?? {}).sort();
    expect(reference.length).toBeGreaterThan(150);
    for (const lang of TRANSLATED) {
      expect({ lang, keys: Object.keys(UI_STRINGS[lang] ?? {}).sort() }).toEqual({ lang, keys: reference });
    }
  });

  it('translates every key it claims to, into something that is not the English', () => {
    for (const lang of TRANSLATED) {
      for (const [key, value] of Object.entries(UI_STRINGS[lang] ?? {})) {
        expect({ lang, key, empty: value.trim().length === 0 }).toEqual({ lang, key, empty: false });
      }
      /*
       * A handful of words are genuinely identical across these languages
       * (Atlas, Zoom, Yin/Yang). Requiring every value to differ would force a
       * worse translation, so the assertion is that MOST differ — enough to
       * prove the table is a translation rather than a copy of the English.
       */
      const entries = Object.entries(UI_STRINGS[lang] ?? {});
      const differing = entries.filter(([k, v]) => k.toLowerCase() !== v.toLowerCase()).length;
      expect({ lang, ratio: differing / entries.length > 0.9 }).toEqual({ lang, ratio: true });
    }
  });

  it('covers the chrome the app actually renders', () => {
    const rendered = new Set(chromePairs().map((p) => p.en));
    expect(rendered.size).toBeGreaterThan(200);
    const short = [...rendered].filter((e) => e.length <= 28 && !e.startsWith('《'));
    const missing = short.filter((e) => !(UI_STRINGS.fr ?? {})[e]);
    // Every short label is translated. Longer sentences fall back to English
    // on purpose — see the fallback test below.
    expect(missing).toEqual([]);
  });
});

describe('simplified Chinese — conversion, not invention', () => {
  it('agrees with the dataset\u2019s own reviewed 繁/简 name pairs', () => {
    /*
     * The cross-check that makes this table trustworthy.
     *
     * The project has no simplified-Chinese authority of its own — except it
     * does: every acupoint carries a REVIEWED `nameZhHant` and `nameZhHans`
     * pair, read from sources during the editorial passes. Aligning those
     * character by character yields a simplification map nobody in this file
     * invented, and the chrome table must not contradict it.
     */
    const fromData = new Map<string, string>();
    for (const p of dataset.acupoints) {
      const hant = p.nameZhHant;
      const hans = p.nameZhHans;
      if (!hant || !hans || hant.length !== hans.length) continue;
      for (let i = 0; i < hant.length; i++) {
        const a = hant[i]!;
        const b = hans[i]!;
        if (a !== b) fromData.set(a, b);
      }
    }
    expect(fromData.size).toBeGreaterThan(60);
    for (const [hant, hans] of fromData) {
      const mine = T2S_TABLE[hant];
      if (mine === undefined) continue; // the chrome simply never uses it
      expect({ hant, mine, reviewed: hans }).toEqual({ hant, mine: hans, reviewed: hans });
    }
  });

  it('spot-checks the conversions the interface depends on', () => {
    expect(toHans('經絡穴位')).toBe('经络穴位');
    expect(toHans('奇經八脈')).toBe('奇经八脉');
    expect(toHans('錯題本')).toBe('错题本');
    expect(toHans('間隔重複 1-3-7')).toBe('间隔重复 1-3-7');
    expect(toHans('設定')).toBe('设定');
    // Characters shared by both scripts pass through untouched.
    expect(toHans('穴位')).toBe('穴位');
  });

  it('leaves no traditional form from its own table in the output', () => {
    for (const { zh } of chromePairs()) {
      const out = toHans(zh);
      for (const ch of out) {
        expect({ zh, ch, stillTraditional: ch in T2S_TABLE }).toEqual({ zh, ch, stillTraditional: false });
      }
    }
  });

  it('is never applied to curated content', () => {
    // The dataset's own 简体 names are reviewed fields; the converter must not
    // be what produces them. 太淵 is the case that would expose a shortcut:
    // its reviewed simplified name is 太渊, and 淵 is deliberately absent from
    // the chrome table because no chrome string uses it.
    expect('淵' in T2S_TABLE).toBe(false);
    const taiyuan = dataset.acupoints.find((p) => p.code === 'LU9');
    expect(taiyuan?.nameZhHans).toBe('太渊');
  });
});

describe('language metadata', () => {
  it('offers exactly the languages the tables and converters support', () => {
    const offered = UI_LANGUAGES.map((l) => l.code);
    expect(offered).toEqual(['auto', 'zh-Hant', 'zh-Hans', 'en', 'fr', 'de', 'es', 'it', 'hu', 'ru', 'uk']);
    for (const code of offered) {
      if (code === 'auto') continue;
      expect({ code, html: Boolean(HTML_LANG[code as Exclude<UiLang, 'auto'>]) }).toEqual({ code, html: true });
    }
    for (const lang of TRANSLATED) expect(Boolean(UI_STRINGS[lang])).toBe(true);
  });

  it('names each language in itself, so it stays findable from any other', () => {
    const endonyms = UI_LANGUAGES.map((l) => l.endonym);
    expect(endonyms).toContain('Русский');
    expect(endonyms).toContain('Українська');
    expect(endonyms).toContain('Magyar');
    expect(endonyms).toContain('简体中文');
    expect(new Set(endonyms).size).toBe(endonyms.length);
  });

  it('detects the browser language, and stays out of the way for zh and en', () => {
    expect(deviceUiLang('fr-CA')).toBe('fr');
    expect(deviceUiLang('uk')).toBe('uk');
    expect(deviceUiLang('de-AT')).toBe('de');
    // zh and en are what the content setting already covers, so the interface
    // setting defers rather than pinning a redundant duplicate.
    expect(deviceUiLang('zh-TW')).toBe('auto');
    expect(deviceUiLang('en-GB')).toBe('auto');
    expect(deviceUiLang(undefined)).toBe('auto');
    expect(deviceUiLang('ja')).toBe('auto');
  });
});

describe('the chrome registry', () => {
  it('is what an independent extraction finds, not something anyone typed', () => {
    /*
     * Derived, not authored. This walks the same three UI roots the generator
     * walks, but with this file's own scan rather than by calling the
     * generator's function — so the assertion checks the checked-in registry
     * against a second implementation, not against itself. Add a string to the
     * UI without running `npx tsx scripts/extract-chrome-keys.ts` and this
     * fails, which is the point: the registry decides what 简体 may convert,
     * so it must not drift behind the interface it describes.
     */
    const found = [...new Set(chromePairs().map((p) => p.en))].sort();
    expect([...CHROME_KEYS_GENERATED]).toEqual(found);
  });

  it('never claims a curated string as chrome', () => {
    const curated = new Set<string>();
    for (const p of dataset.acupoints) {
      for (const v of [p.nameEn, p.location?.value.en]) if (v) curated.add(v.trim());
    }
    for (const m of dataset.meridians) {
      for (const v of [m.nameEn, m.route?.value.en]) if (v) curated.add(v.trim());
    }
    for (const key of CHROME_KEYS_GENERATED) {
      expect({ key, curated: curated.has(key.trim()) }).toEqual({ key, curated: false });
    }
  });

  it('can simplify every 中文 chrome string it registers', () => {
    /*
     * Coverage, checked against the dataset's own reviewed 繁/简 pairs rather
     * than against an opinion. If a chrome string uses a character the
     * reviewed data says has a different simplified form, the table must
     * carry it — otherwise 简体 renders that one word in the wrong script.
     */
    const reviewed = new Map<string, string>();
    for (const p of dataset.acupoints) {
      const a = p.nameZhHant;
      const b = p.nameZhHans;
      if (!a || !b || a.length !== b.length) continue;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) reviewed.set(a[i]!, b[i]!);
    }
    const missing: string[] = [];
    for (const { zh } of chromePairs()) {
      for (const ch of zh) {
        if (reviewed.has(ch) && !(ch in T2S_TABLE)) missing.push(ch);
      }
    }
    expect([...new Set(missing)]).toEqual([]);
  });
});
