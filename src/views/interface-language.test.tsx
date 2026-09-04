import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { StoreProvider } from '../state/store';
import { memoryStorage } from '../state/progress';
import SettingsView from './SettingsView';
import App from '../App';

afterEach(cleanup);

/**
 * The interface languages, exercised through the real app rather than through
 * the table.
 *
 * The table tests prove the translations are confined to chrome. These prove
 * the other half: that choosing a language actually changes the interface, and
 * that choosing it does NOT change a single character of the curated content —
 * which is the promise the Settings copy makes to the learner.
 */
const mountSettings = () =>
  render(
    <StoreProvider storage={memoryStorage()}>
      <SettingsView />
    </StoreProvider>,
  );

const pick = (endonym: string) => {
  const btn = [...document.querySelectorAll('button')].find((b) =>
    (b.textContent ?? '').includes(endonym),
  )!;
  expect(btn).toBeTruthy();
  fireEvent.click(btn);
  return btn;
};

describe('choosing an interface language', () => {
  it('translates the chrome', () => {
    mountSettings();
    // Before: the settings heading is in the default language.
    expect(document.body.textContent).toContain('Settings');
    pick('Français');
    expect(document.body.textContent).toContain('Réglages');
    expect(document.body.textContent).toContain('Langue');
  });

  it('reaches every offered language, each named in itself', () => {
    mountSettings();
    for (const [endonym, probe] of [
      ['Deutsch', 'Einstellungen'],
      ['Español', 'Ajustes'],
      ['Italiano', 'Impostazioni'],
      ['Magyar', 'Beállítások'],
      ['Русский', 'Настройки'],
      ['Українська', 'Налаштування'],
    ] as const) {
      pick(endonym);
      expect({ endonym, ok: document.body.textContent?.includes(probe) }).toEqual({ endonym, ok: true });
    }
  });

  it('renders 简体 by converting the 繁體 chrome, not by translating it', () => {
    mountSettings();
    pick('简体中文');
    // 設定 → 设定, 語言 → 语言: the same words, the other script.
    expect(document.body.textContent).toContain('设定');
    expect(document.body.textContent).toContain('语言');
    expect(document.body.textContent).not.toContain('設定');
  });

  it('does not simplify curated 中文 — it converts chrome only', () => {
    /*
     * The bug this pins was real and shipped for about ten minutes: the
     * converter ran on every 中文 string t() saw, so a lesson body came out
     * half-simplified — 「肺经共 11 穴」 next to 「太淵」 — because the table
     * only knows the characters the chrome uses. Curated text now keeps the
     * characters its source used, whatever the interface is set to.
     */
    localStorage.setItem(
      'let-energy-flow.prefs.v2',
      JSON.stringify({ theme: 'system', lang: 'zh', uiLang: 'zh-Hans', navCollapsed: false, fontScale: 0 }),
    );
    render(
      <StoreProvider storage={memoryStorage()}>
        <App />
      </StoreProvider>,
    );
    const legend = document.querySelector('.viewer-legend')!;
    // Chrome: simplified.
    expect(legend.textContent).toContain('经络图层');
    // Content: the reviewed 繁體 channel names, untouched.
    expect(legend.textContent).toContain('手太陰肺經');
    expect(legend.textContent).not.toContain('手太阴肺经');
    localStorage.clear();
  });

  it('marks the document language so a screen reader changes voice', () => {
    mountSettings();
    pick('Français');
    expect(document.documentElement.lang).toBe('fr');
    pick('Українська');
    expect(document.documentElement.lang).toBe('uk');
  });
});

describe('what an interface language must never touch', () => {
  it('leaves curated content byte-for-byte unchanged in every language', () => {
    /*
     * Rendered twice — once in the default interface, once in Russian — and
     * the atlas legend, which lists channel names straight off the dataset,
     * must come back identical. A Russian rendering of 手太陰肺經 exists in no
     * source this project has read; if one ever appeared here it could only
     * have been invented, and this comparison is what would catch it.
     */
    const legendIn = (uiLang: string) => {
      localStorage.setItem(
        'let-energy-flow.prefs.v2',
        JSON.stringify({ theme: 'system', lang: 'en', uiLang, navCollapsed: false, fontScale: 0 }),
      );
      const view = render(
        <StoreProvider storage={memoryStorage()}>
          <App />
        </StoreProvider>,
      );
      const text = document.querySelector('.viewer-legend')?.textContent ?? '';
      view.unmount();
      return text;
    };

    /* The legend mixes both kinds of string, so separate them: the channel
       rows are dataset content, the buttons around them are chrome. */
    const channelRows = (text: string) => (text.match(/[A-Z]{2} · [^●]+/g) ?? []).map((r) => r.trim());

    const englishText = legendIn('en');
    const englishRows = channelRows(englishText);
    expect(englishRows.length).toBe(14);

    for (const lang of ['ru', 'uk', 'fr', 'de', 'es', 'it', 'hu']) {
      const text = legendIn(lang);
      // Content: identical, every language, every row.
      expect({ lang, rows: channelRows(text) }).toEqual({ lang, rows: englishRows });
      // And the check is not vacuous — the chrome around those rows DID move.
      expect({ lang, chromeChanged: text !== englishText }).toEqual({ lang, chromeChanged: true });
    }
    localStorage.clear();
  });

  it('falls back to English rather than inventing a sentence it has no entry for', () => {
    mountSettings();
    pick('Magyar');
    // Short chrome is Hungarian…
    expect(document.body.textContent).toContain('Beállítások');
    // …while the long explanatory sentence, which no table carries, stays in
    // the English the project wrote. A blank or a machine guess would both be
    // worse than a language the reader can at least check against the source.
    expect(document.body.textContent).toMatch(/Chrome — buttons, navigation, headings/);
  });
});
