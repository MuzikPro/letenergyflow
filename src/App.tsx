import { dataset } from './data';
import { useEffect } from 'react';
import SearchPalette from './components/SearchPalette';
import { useBilingual, useStore, type RouteId } from './state/store';
import AtlasView from './views/AtlasView';
import LearnView from './views/LearnView';
import DetailsView from './views/DetailsView';
import CircuitView from './views/CircuitView';
import FlowView from './views/FlowView';
import NetworkView from './views/NetworkView';
import PracticeView from './views/PracticeView';
import ProgressView from './views/ProgressView';
import SettingsView from './views/SettingsView';
import AboutView from './views/AboutView';

/** The routes the rail lists. Settings and About are reached from the header. */
const ROUTES = [
  { id: 'atlas', zh: '人體圖', en: 'Atlas' },
  { id: 'network', zh: '網絡圖', en: 'Network' },
  { id: 'flow', zh: '流注', en: 'Flow' },
  { id: 'circuit', zh: '運行', en: 'Circuit' },
  { id: 'learn', zh: '課程', en: 'Learn' },
  { id: 'details', zh: '分區', en: 'Regions' },
  { id: 'practice', zh: '練習', en: 'Practice' },
  { id: 'progress', zh: '進度', en: 'Progress' },
] as const satisfies readonly { id: RouteId; zh: string; en: string }[];

type NavRouteId = (typeof ROUTES)[number]['id'];

/** Every route's short name, for the back control to say where it leads. */
const ROUTE_LABEL: Record<RouteId, { zh: string; en: string }> = {
  ...Object.fromEntries(ROUTES.map((r) => [r.id, { zh: r.zh, en: r.en }])),
  settings: { zh: '設定', en: 'Settings' },
  about: { zh: '來源與聲明', en: 'Sources' },
} as Record<RouteId, { zh: string; en: string }>;

/** How many destinations the rail carries. Exported so tests derive it. */
export const NAV_ROUTE_COUNT = ROUTES.length;

/**
 * Route icons.
 *
 * Drawn here as plain paths rather than pulled from an icon set: the project
 * ships no downloaded assets, and the collapsed rail needs a glyph that still
 * reads at 20px. Each one is a literal picture of its view — a figure, a
 * network, a book, a target, a rising bar.
 */
const ICONS: Record<NavRouteId, string> = {
  atlas: 'M12 3.6a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4M12 7.6v6.2M12 7.9 7.6 10M12 7.9l4.4 2.1M12 13.8 9.2 20.4M12 13.8l2.8 6.6',
  network:
    'M5 6.5h9a2.5 2.5 0 0 1 0 5H8a2.5 2.5 0 0 0 0 5h11M5 6.5a1.4 1.4 0 1 0 0-.1M12 16.5a1.4 1.4 0 1 0 0-.1M19 16.5a1.4 1.4 0 1 0 0-.1',
  flow: 'M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2M12 7.2v5.1l3.4 2M12 3.4v1.9M20.6 12h-1.9M12 20.6v-1.9M3.4 12h1.9',
  circuit:
    'M12 4.2c4.6 0 7.8 3.2 7.8 7.8s-3.2 7.8-7.8 7.8-7.8-3.2-7.8-7.8c0-2.9 1.3-5.2 3.2-6.5M9.6 3.2l-2.2 2.3 2.9 1.6',
  learn: 'M4 5.2h6a2.4 2.4 0 0 1 2 1.9 2.4 2.4 0 0 1 2-1.9h6v12.4h-6a2.4 2.4 0 0 0-2 1.9 2.4 2.4 0 0 0-2-1.9H4zM12 7.1v11.3',
  practice: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15M12 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6M12 11.4v1.2',
  details:
    'M10.6 4.6a5.4 5.4 0 1 0 0 10.8 5.4 5.4 0 0 0 0-10.8M14.6 14.6 20 20M10.6 7.9v5.4M7.9 10.6h5.4',
  progress: 'M4 19.4h16M6.8 19.4v-4.6M11.6 19.4v-8.2M16.4 19.4V5.6',
};

function RouteIcon({ id }: { id: NavRouteId }) {
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICONS[id]} />
    </svg>
  );
}

export default function App() {
  const {
    route,
    setRoute,
    back,
    backTo,
    setSearchOpen,
    theme,
    setTheme,
    navCollapsed,
    setNavCollapsed,
    navOpen,
    setNavOpen,
  } = useStore();
  const t = useBilingual();

  // Settings and About are reached from the gear, not the nav rail. Closing
  // them is the same operation as the back control now, so they share the trail
  // rather than keeping a second, slightly different memory of where you were.
  const closeOverlayRoute = () => back();

  // The drawer is a mobile-only overlay: closing it on Escape and on navigation
  // keeps it from stranding the workspace underneath.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen, setNavOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSearchOpen]);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        {t('跳到主要內容', 'Skip to content')}
      </a>

      <div className="shell-main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn nav-open-btn"
            aria-label={t('開啟導覽', 'Open navigation')}
            aria-expanded={navOpen}
            onClick={() => setNavOpen(!navOpen)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="17" height="17">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          {/*
            * Cross-view links are one-way without this: following "see this
            * channel on the atlas" would land you on the atlas with only the
            * nav to get back, and the nav returns you to a tab, not to what
            * you were reading.
            */}
          {backTo && (
            <button
              type="button"
              className="btn small ghost back-btn"
              onClick={back}
              aria-label={t(
                `返回${ROUTE_LABEL[backTo].zh}`,
                `Back to ${ROUTE_LABEL[backTo].en}`,
              )}
            >
              <span aria-hidden="true">←</span>
              <span className="back-btn-label">{t(ROUTE_LABEL[backTo].zh, ROUTE_LABEL[backTo].en)}</span>
            </button>
          )}
          <div className="brand">
            <strong>Let Energy Flow</strong>
            {/* Derived, so it cannot go stale when a curriculum day is added. */}
            <span>
              {t(
                `第 1–${dataset.curriculumDays.length} 天 · 測試版`,
                `Days 1–${dataset.curriculumDays.length} · prototype`,
              )}
            </span>
          </div>
          <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)}>
            <span aria-hidden="true">⌕</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {t('搜尋穴位、經絡、主題', 'Search points, meridians, topics')}
            </span>
            <span className="kbd" aria-hidden="true">
              ⌘K
            </span>
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
            aria-label={t('切換主題', 'Change theme')}
            title={`Theme: ${theme}`}
          >
            {theme === 'dark' ? '☾' : theme === 'light' ? '☀' : '◐'}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => (route === 'settings' ? closeOverlayRoute() : setRoute('settings'))}
            aria-label={route === 'settings' ? t('關閉設定', 'Close settings') : t('設定', 'Settings')}
            aria-current={route === 'settings' ? 'page' : undefined}
          >
            ⛭
          </button>
        </header>

        <main id="main">
          {route === 'atlas' && <AtlasView />}
          {route === 'network' && <NetworkView />}
          {route === 'flow' && <FlowView />}
          {route === 'circuit' && <CircuitView />}
          {route === 'learn' && <LearnView />}
          {route === 'details' && <DetailsView />}
          {route === 'practice' && <PracticeView />}
          {route === 'progress' && <ProgressView />}
          {route === 'settings' && <SettingsView onClose={closeOverlayRoute} />}
          {route === 'about' && <AboutView onClose={closeOverlayRoute} />}
        </main>
      </div>

      {/* After <main> in the DOM so it reads as a bottom bar on a phone; CSS
          reorders it to a left rail on desktop and to a drawer in between. */}
      {navOpen && (
        <button
          type="button"
          className="nav-scrim"
          aria-label={t('關閉導覽', 'Close navigation')}
          onClick={() => setNavOpen(false)}
        />
      )}
      <nav
        className="nav"
        data-collapsed={navCollapsed ? 'true' : 'false'}
        data-open={navOpen ? 'true' : 'false'}
        aria-label={t('主要導覽', 'Main navigation')}
      >
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={!navCollapsed}
          aria-label={
            navCollapsed ? t('展開側欄', 'Expand sidebar') : t('收合側欄', 'Collapse sidebar')
          }
          title={navCollapsed ? t('展開側欄', 'Expand sidebar') : t('收合側欄', 'Collapse sidebar')}
          onClick={() => setNavCollapsed(!navCollapsed)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d={navCollapsed ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} />
          </svg>
        </button>

        {ROUTES.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-current={route === r.id ? 'page' : undefined}
            title={t(r.zh, r.en)}
            onClick={() => {
              setRoute(r.id);
              setNavOpen(false);
            }}
          >
            <RouteIcon id={r.id} />
            <span className="nav-label">{t(r.zh, r.en)}</span>
          </button>
        ))}
      </nav>

      <SearchPalette />
    </div>
  );
}
