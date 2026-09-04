/**
 * Interface languages.
 *
 * This is the INTERFACE list, and it is deliberately separate from the
 * content-display setting (`lang` in the store: 中文 / English / bilingual).
 * The distinction is a content rule, not a UI convenience:
 *
 *   - Chrome — buttons, headings, navigation, status labels — is this
 *     project's own writing, so it can be translated.
 *   - The curated material — 定位 location texts, point and channel names,
 *     classical quotations, the curriculum — was READ OUT OF CITED SOURCES in
 *     繁體中文 and rendered into English by this project. Translating it
 *     further would be inventing a translation of a medical text, which
 *     `AGENTS.md` forbids without exception. It therefore stays in 中文 and
 *     English, whatever the interface language is, and `SettingsView` says so
 *     on the page rather than leaving the learner to discover it.
 *
 * 'auto' means "follow the content-display setting", which is exactly what the
 * app did before interface languages existed. It is the default, so an
 * existing learner's app looks identical after this feature ships.
 */
export type UiLang =
  | 'auto'
  | 'en'
  | 'zh-Hant'
  | 'zh-Hans'
  | 'fr'
  | 'de'
  | 'es'
  | 'it'
  | 'hu'
  | 'ru'
  | 'uk';

export interface UiLanguage {
  code: UiLang;
  /** The language's name in itself — never translated. */
  endonym: string;
  /** English name, for the a11y label where the endonym is not Latin script. */
  englishName: string;
}

export const UI_LANGUAGES: UiLanguage[] = [
  { code: 'auto', endonym: 'Auto', englishName: 'Follow content setting' },
  { code: 'zh-Hant', endonym: '繁體中文', englishName: 'Traditional Chinese' },
  { code: 'zh-Hans', endonym: '简体中文', englishName: 'Simplified Chinese' },
  { code: 'en', endonym: 'English', englishName: 'English' },
  { code: 'fr', endonym: 'Français', englishName: 'French' },
  { code: 'de', endonym: 'Deutsch', englishName: 'German' },
  { code: 'es', endonym: 'Español', englishName: 'Spanish' },
  { code: 'it', endonym: 'Italiano', englishName: 'Italian' },
  { code: 'hu', endonym: 'Magyar', englishName: 'Hungarian' },
  { code: 'ru', endonym: 'Русский', englishName: 'Russian' },
  { code: 'uk', endonym: 'Українська', englishName: 'Ukrainian' },
];

/** BCP-47 value for the document's lang attribute. 'auto' resolves elsewhere. */
export const HTML_LANG: Record<Exclude<UiLang, 'auto'>, string> = {
  en: 'en',
  'zh-Hant': 'zh-Hant',
  'zh-Hans': 'zh-Hans',
  fr: 'fr',
  de: 'de',
  es: 'es',
  it: 'it',
  hu: 'hu',
  ru: 'ru',
  uk: 'uk',
};

/**
 * The interface language implied by the browser.
 *
 * Returns 'auto' for English and Chinese locales rather than naming them:
 * those two are what the content setting already covers, and 'auto' keeps the
 * two settings agreeing for the learners who never open Settings at all.
 */
export function deviceUiLang(navLang: string | undefined): UiLang {
  const l = (navLang || '').toLowerCase();
  if (!l) return 'auto';
  if (l.startsWith('zh') || l.startsWith('en')) return 'auto';
  for (const code of ['fr', 'de', 'es', 'it', 'hu', 'ru', 'uk'] as const) {
    if (l.startsWith(code)) return code;
  }
  return 'auto';
}
