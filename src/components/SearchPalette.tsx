import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { acupointById, dataset, functionById, meridianById } from '../data';
import { searchIndex, type SearchResult } from '../search';
import { regionLabel } from '../data/types';
import { useBilingual, useStore } from '../state/store';

/**
 * One global search entry point. Results are grouped by record type and every
 * result states which field it matched on, so an alias hit is never mistaken
 * for a canonical name.
 */
export default function SearchPalette() {
  const { searchOpen, setSearchOpen, setFocus, route, setRoute, lang } = useStore();
  const t = useBilingual();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchIndex.search(q), [q]);
  const flat = useMemo<SearchResult[]>(
    () => [...results.acupoints, ...results.meridians, ...results.functions],
    [results],
  );

  useEffect(() => {
    if (searchOpen) {
      setActive(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [searchOpen]);

  useEffect(() => setActive(0), [q]);

  if (!searchOpen) return null;

  const choose = (r: SearchResult) => {
    if (r.type === 'acupoint') setFocus({ kind: 'point', pointId: r.id });
    else if (r.type === 'meridian') setFocus({ kind: 'meridian', meridianId: r.id });
    else setFocus({ kind: 'function', functionId: r.id });
    if (route !== 'atlas' && route !== 'network') setRoute('atlas');
    setSearchOpen(false);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = flat[active];
      if (r) choose(r);
    }
  };

  const renderGroup = (title: string, items: SearchResult[], offset: number) => {
    if (items.length === 0) return null;
    return (
      <section>
        <h2 className="search-group-title">{title}</h2>
        {items.map((r, i) => {
          const idx = offset + i;
          let primary = '';
          let secondary = '';
          let badge = '';
          if (r.type === 'acupoint') {
            const p = acupointById.get(r.id)!;
            const m = meridianById.get(p.meridianId);
            badge = p.code;
            primary = t(p.nameZhHant, p.nameEn ?? '');
            // The other-script name stays available as metadata — it is
            // curriculum content, not chrome.
            const otherName = lang === 'en' ? p.nameZhHant : lang === 'zh' ? p.nameEn : null;
            secondary = [
              otherName,
              p.pinyin,
              t(m?.nameZhHant ?? '', m?.nameEn ?? ''),
              regionLabel(p.bodyRegion, lang === 'en' ? 'en' : 'zh'),
            ]
              .filter(Boolean)
              .join(' · ');
          } else if (r.type === 'meridian') {
            const m = meridianById.get(r.id)!;
            badge = m.code;
            primary = t(m.nameZhHant, m.nameEn);
            secondary = t(
              `${m.coursePointCount} 穴已載入`,
              `${m.coursePointCount} points loaded`,
            );
          } else {
            const f = functionById.get(r.id)!;
            badge = t('主題', 'Topic');
            primary = t(f.labelZhHant, f.labelEn);
            secondary = t('教學關聯，非治療建議', 'Teaching association, not treatment advice');
          }
          return (
            <button
              key={r.id}
              type="button"
              className="search-item"
              data-active={idx === active}
              onMouseEnter={() => setActive(idx)}
              onClick={() => choose(r)}
            >
              <span className="chip code">{badge}</span>
              <span className="grow">
                <span className="primary">{primary}</span>
                <br />
                <span className="secondary">{secondary}</span>
              </span>
              <span className="secondary" style={{ textAlign: 'right', flex: 'none' }}>
                {t('比對', 'matched')} {r.matchedField}
              </span>
            </button>
          );
        })}
      </section>
    );
  };

  return (
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('全域搜尋', 'Global search')}
      onClick={(e) => {
        if (e.target === e.currentTarget) setSearchOpen(false);
      }}
    >
      <div className="search-panel" onKeyDown={onKeyDown}>
        <div className="search-head">
          <span aria-hidden="true" className="faint">
            ⌕
          </span>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(
              '搜尋穴位、經絡或主題… 例如 合谷、LU7、hegu、頭項',
              'Search points, meridians or topics… e.g. 合谷, LU7, hegu, head and neck',
            )}
            aria-label={t('搜尋', 'Search')}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => setSearchOpen(false)}
            aria-label={t('關閉搜尋', 'Close search')}
          >
            Esc
          </button>
        </div>

        <div className="search-scope">
          {t(results.scopeZhHant, results.scopeEn)}
          {' · '}
          {t(
            `已索引 ${searchIndex.documentCount} 筆記錄，全部離線`,
            `${searchIndex.documentCount} records indexed, fully offline`,
          )}
        </div>

        <div className="search-results" ref={listRef}>
          {q.trim() === '' ? (
            <div className="search-empty">
              {t(
                '可用中文、英文、拼音、代碼或別名搜尋。方向鍵選擇，Enter 開啟。',
                'Search by Chinese, English, pinyin, code or alias. Arrow keys to move, Enter to open.',
              )}
              <div style={{ marginTop: 12 }} className="row">
                {['合谷', 'LU7', 'hegu', '頭項', 'throat'].map((s) => (
                  <button key={s} type="button" className="btn small ghost" onClick={() => setQ(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : flat.length === 0 ? (
            <div className="search-empty">
              {t(
                `在目前資料集中找不到「${q}」。`,
                `Nothing matching “${q}” in the loaded dataset.`,
              )}
              <div style={{ marginTop: 8 }}>
                {t(
                  `目前只載入 2／14 條經絡（共 ${dataset.acupoints.length} 個穴位）。`,
                  `Only 2 of 14 channels are loaded (${dataset.acupoints.length} points in total).`,
                )}
              </div>
            </div>
          ) : (
            <>
              {renderGroup(
                t(`穴位（${results.acupoints.length}）`, `Acupoints (${results.acupoints.length})`),
                results.acupoints,
                0,
              )}
              {renderGroup(
                t(`經絡（${results.meridians.length}）`, `Meridians (${results.meridians.length})`),
                results.meridians,
                results.acupoints.length,
              )}
              {renderGroup(
                t(
                  `傳統功能與學習主題（${results.functions.length}）`,
                  `Traditional functions & topics (${results.functions.length})`,
                ),
                results.functions,
                results.acupoints.length + results.meridians.length,
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
