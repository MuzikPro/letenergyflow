import { useState } from 'react';
import { useBilingual, useStore, type LangChoice, type ThemeChoice } from '../state/store';
import { UI_LANGUAGES } from '../i18n/languages';

/**
 * Settings — language, theme, and the learner's own data.
 *
 * Language labels are deliberately self-referential (中文 always in Chinese,
 * Magyar always in Hungarian) so the control stays readable no matter which
 * language is currently active — including for someone who has just set the
 * interface to a language they cannot read and needs to find their way back.
 *
 * There are two language controls, and the split is a content rule rather
 * than a preference: CONTENT DISPLAY chooses between the 中文 a claim was read
 * in and this project's own English rendering of it, while INTERFACE LANGUAGE
 * translates the chrome this project wrote. Sourced material is never machine
 * -translated into a third language, and the section says so where the learner
 * chooses, not in a footnote somewhere else.
 */
export default function SettingsView({ onClose }: { onClose?: () => void }) {
  const t = useBilingual();
  const { theme, setTheme, lang, setLang, uiLang, setUiLang, resetProgress, exportProgress, setRoute } =
    useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [exported, setExported] = useState(false);

  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `let-energy-flow-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const langOptions: { value: LangChoice; label: string; hint: string }[] = [
    { value: 'zh', label: '中文', hint: t('全部介面以中文顯示。', 'Everything in Traditional Chinese.') },
    { value: 'en', label: 'English', hint: t('全部介面以英文顯示。', 'Everything in English.') },
    {
      value: 'bi',
      label: '中文 + English',
      hint: t('同時顯示兩種語言（較擁擠）。', 'Show both languages side by side (denser).'),
    },
  ];

  return (
    <div className="page stack" style={{ maxWidth: 720 }}>
      <header className="stack" style={{ gap: 6 }}>
        {onClose && (
          <div>
            <button type="button" className="btn small ghost" onClick={onClose}>
              ← {t('返回', 'Back')}
            </button>
          </div>
        )}
        <div className="eyebrow">{t('偏好設定', 'Preferences')}</div>
        <h1 style={{ fontSize: 26 }}>{t('設定', 'Settings')}</h1>
      </header>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('語言', 'Language')}</h2>
        <div className="stack" style={{ gap: 8 }}>
          {langOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              className="option"
              aria-pressed={lang === o.value}
              data-state={lang === o.value ? 'correct' : undefined}
              onClick={() => setLang(o.value)}
            >
              <span className="marker" aria-hidden="true">
                {lang === o.value ? '✓' : ''}
              </span>
              <span className="grow" style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontWeight: 620 }}>{o.label}</span>
                <span className="faint">{o.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('介面語言', 'Interface language')}</h2>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '介面文字（按鈕、導覽、標題）會依此設定翻譯。穴位定位、經絡名稱、古籍引文與課程內容一律維持中文與英文——那些是逐條照出處讀出來的，另行翻譯等同自行改寫醫學來源。',
            'Chrome — buttons, navigation, headings — follows this setting. Location texts, point and channel names, classical quotations and the curriculum stay in 中文 and English: those were read out of cited sources, and translating them further would mean rewriting a medical source rather than reporting one.',
          )}
        </p>
        <div className="stack" style={{ gap: 8 }}>
          {UI_LANGUAGES.map((o) => (
            <button
              key={o.code}
              type="button"
              className="option"
              aria-pressed={uiLang === o.code}
              aria-label={o.englishName}
              data-state={uiLang === o.code ? 'correct' : undefined}
              onClick={() => setUiLang(o.code)}
            >
              <span className="marker" aria-hidden="true">
                {uiLang === o.code ? '✓' : ''}
              </span>
              <span className="grow" style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontWeight: 620 }} lang={o.code === 'auto' ? undefined : o.code}>
                  {o.code === 'auto' ? t('跟隨內容語言', 'Follow content language') : o.endonym}
                </span>
                <span className="faint">
                  {o.code === 'auto'
                    ? t('與上方的內容顯示設定一致。', 'Match the content-display setting above.')
                    : o.englishName}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('主題', 'Theme')}</h2>
        <div className="row">
          {(
            [
              ['system', t('跟隨系統', 'System')],
              ['light', t('亮', 'Light')],
              ['dark', t('暗', 'Dark')],
            ] as [ThemeChoice, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              className={theme === v ? 'btn small primary' : 'btn small'}
              aria-pressed={theme === v}
              onClick={() => setTheme(v)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('你的資料', 'Your data')}</h2>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '進度只存在瀏覽器的本機儲存空間。沒有帳號、沒有雲端同步、沒有分析工具、沒有第三方請求。',
            'Progress lives in this browser’s local storage only. No account, no cloud sync, no analytics, no third-party requests.',
          )}
        </p>
        <div className="row">
          <button type="button" className="btn" onClick={download}>
            {exported ? t('已匯出 ✓', 'Exported ✓') : t('匯出 JSON', 'Export JSON')}
          </button>
          {!confirmReset ? (
            <button type="button" className="btn ghost" onClick={() => setConfirmReset(true)}>
              {t('重設進度', 'Reset progress')}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn"
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
              >
                {t('確定刪除全部', 'Yes, erase everything')}
              </button>
              <button type="button" className="btn ghost" onClick={() => setConfirmReset(false)}>
                {t('取消', 'Cancel')}
              </button>
            </>
          )}
        </div>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('來源與聲明', 'Sources & disclaimer')}</h2>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '教學用途聲明、內容來源清單、審核狀態說明，以及刻意排除的內容。',
            'The educational-use statement, the full source list, what the review labels mean, and what is deliberately left out.',
          )}
        </p>
        <div className="row">
          <button type="button" className="btn small" onClick={() => setRoute('about')}>
            {t('查看來源與聲明', 'View sources & disclaimer')} →
          </button>
        </div>
      </section>

      <section className="notice">
        <span>
          <strong>{t('教學用途', 'Educational use only')}</strong> —{' '}
          {t(
            '本應用只協助記誦經絡與穴位名稱、位置與分類，不提供診斷、治療建議或任何侵入性技術說明。',
            'This app helps you memorise channel and point names, positions and classifications. It does not diagnose, recommend treatment, or describe any invasive technique.',
          )}
        </span>
      </section>
    </div>
  );
}
