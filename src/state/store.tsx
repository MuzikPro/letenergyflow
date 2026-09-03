import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  emptyProgress,
  loadProgress,
  localStorageAdapter,
  recordAnswer,
  saveProgress,
  type ErrorEntry,
  type ItemKind,
  type ProgressState,
  type StorageAdapter,
} from './progress';

export type ThemeChoice = 'system' | 'light' | 'dark';
export type LangChoice = 'bi' | 'zh' | 'en';
export type RouteId =
  | 'atlas'
  | 'network'
  | 'flow'
  | 'circuit'
  | 'learn'
  | 'details'
  | 'practice'
  | 'progress'
  | 'settings'
  | 'about';

/**
 * Routes have real URLs.
 *
 * A learner studying one region should be able to bookmark it, and a lesson
 * should be able to link straight to `/details/wrist_hand`. The path is
 * derived from state, never stored separately, so the two cannot disagree.
 */
const PATH_OF: Record<RouteId, string> = {
  atlas: '/',
  network: '/network',
  flow: '/flow',
  circuit: '/circuit',
  learn: '/learn',
  details: '/details',
  practice: '/practice',
  progress: '/progress',
  settings: '/settings',
  about: '/about',
};

export const pathFor = (route: RouteId, region?: string | null): string =>
  route === 'details' && region ? `/details/${region}` : PATH_OF[route];

/** A place in the app: a route, plus the region when the route needs one. */
interface Place {
  route: RouteId;
  region: string | null;
}

function initialPlace(): Place & { trail: Place[] } {
  let here: Place = { route: 'atlas', region: null };
  try {
    here = routeFromPath(window.location.pathname) ?? here;
  } catch {
    /* no location (a bare test renderer) — start at the atlas */
  }
  return { ...here, trail: [] };
}

/** The route a path names, or null when it names nothing we serve. */
export function routeFromPath(path: string): { route: RouteId; region: string | null } | null {
  const clean = path.replace(/\/+$/, '') || '/';
  const detail = /^\/details\/([a-z_]+)$/.exec(clean);
  if (detail) return { route: 'details', region: detail[1] ?? null };
  const hit = (Object.keys(PATH_OF) as RouteId[]).find((r) => PATH_OF[r] === clean);
  return hit ? { route: hit, region: null } : null;
}

/** What the atlas and network map should currently emphasise. */
export type Focus =
  | { kind: 'none' }
  | { kind: 'point'; pointId: string }
  | { kind: 'meridian'; meridianId: string }
  | { kind: 'function'; functionId: string }
  /**
   * One organ's 募俞 pair. The only focus whose two members can never share a
   * view — the mu point is on the front and the back-shu on the back — so the
   * atlas lights both and lets the front/back toggle carry you between them.
   * `organ` is the English organ key from ORGAN_SEQUENCE.
   */
  | { kind: 'shu_mu'; organ: string }
  /**
   * 奇經八脈. `vessel` is a vessel's 中文 name, or null for all eight at once.
   *
   * Six of the eight own no points and this dataset loads no route for them, so
   * what the atlas can light is the 八脈交會穴 that opens each one — plus the
   * full routes of 督脈 and 任脈, which are loaded channels. The focus therefore
   * names a vessel rather than a meridian id: most of them do not have one.
   */
  | { kind: 'extraordinary'; vessel: string | null };

const PREFS_KEY = 'let-energy-flow.prefs.v2';
/** v1 defaulted to bilingual display; its stored lang must not survive. */
const LEGACY_PREFS_KEY = 'let-energy-flow.prefs.v1';

interface Prefs {
  theme: ThemeChoice;
  lang: LangChoice;
  /** Desktop rail collapsed to icons only. Persisted; the mobile drawer is not. */
  navCollapsed: boolean;
  /** Detail-sheet text size step, 0 (default, smallest) … 5 (largest). */
  fontScale: number;
}

/**
 * Single-language rendering is the default; the device locale decides which.
 * Bilingual display stays available as an explicit choice in Settings.
 */
function deviceLang(): LangChoice {
  try {
    const l = (typeof navigator !== 'undefined' && navigator.language) || '';
    return l.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  } catch {
    return 'en';
  }
}

/**
 * Tablet-width screens open with the rail collapsed: at 860–1180px the labels
 * cost more canvas than they earn. Wider screens open expanded.
 */
const defaultNavCollapsed = () =>
  // jsdom has no matchMedia, so this must not assume it exists.
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(max-width: 1180px)').matches;

const defaultPrefs: Prefs = {
  theme: 'system',
  lang: deviceLang(),
  fontScale: 0,
  navCollapsed: defaultNavCollapsed(),
};

function readPrefs(): Prefs {
  try {
    if (typeof localStorage === 'undefined') return defaultPrefs;
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const stored = { ...defaultPrefs, ...(JSON.parse(raw) as Partial<Prefs>) };
      stored.fontScale = Math.min(5, Math.max(0, Math.round(stored.fontScale) || 0));
      return stored;
    }
    // Migrate v1: keep the theme, but drop the stored language — v1's default
    // was bilingual, so a v1 lang usually reflects the old default rather than
    // a real choice. The device locale decides again; Settings can override.
    const legacy = localStorage.getItem(LEGACY_PREFS_KEY);
    if (legacy) {
      const old = JSON.parse(legacy) as Partial<Prefs>;
      localStorage.removeItem(LEGACY_PREFS_KEY);
      return { ...defaultPrefs, ...(old.theme ? { theme: old.theme } : {}) };
    }
    return defaultPrefs;
  } catch {
    return defaultPrefs;
  }
}

export type NetworkMode = 'split' | 'map' | 'line';

interface StoreValue {
  route: RouteId;
  setRoute: (r: RouteId, region?: string | null) => void;
  /**
   * Step back to the route the learner came from.
   *
   * The app has cross-view links — "see this channel on the atlas", a matrix
   * cell, a quiz answer — and following one used to be a one-way trip: the nav
   * could get you back to the right TAB, but not to what you were reading.
   */
  back: () => void;
  /** The route `back()` would return to, or null at the start of the trail. */
  backTo: RouteId | null;
  /** Which body region the detail lesson is showing; null on its index. */
  detailRegion: string | null;
  setDetailRegion: (region: string | null) => void;
  /**
   * Which reading the network view is showing. Held here rather than in the
   * view so that leaving for the atlas and coming back returns you to the same
   * one — "back" should mean the screen you left, not its default.
   */
  networkMode: NetworkMode;
  setNetworkMode: (m: NetworkMode) => void;
  focus: Focus;
  setFocus: (f: Focus) => void;
  theme: ThemeChoice;
  setTheme: (t: ThemeChoice) => void;
  lang: LangChoice;
  setLang: (l: LangChoice) => void;
  fontScale: number;
  setFontScale: (n: number) => void;
  /** Desktop rail: collapsed to icons only. Persisted across sessions. */
  navCollapsed: boolean;
  setNavCollapsed: (v: boolean) => void;
  /** Mobile drawer: open over the content. Transient — never persisted. */
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  progress: ProgressState;
  answer: (args: {
    itemId: string;
    itemKind: ItemKind;
    acupointId: string | null;
    wasCorrect: boolean;
    promptEn: string;
    givenAnswer: string;
    expectedAnswer: string;
  }) => void;
  annotateError: (errorId: string, note: string) => void;
  resolveError: (errorId: string, resolved: boolean) => void;
  markDayComplete: (dayId: string) => void;
  resetProgress: () => void;
  exportProgress: () => string;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({
  children,
  storage,
}: {
  children: ReactNode;
  storage?: StorageAdapter;
}) {
  const adapter = useRef<StorageAdapter>(storage ?? localStorageAdapter());
  /*
   * Route and trail are ONE state machine, so they move together.
   *
   * They were two `useState`s, and `back` set the route from inside the
   * trail's updater. State updaters have to be pure — StrictMode runs them
   * twice — so the route change fired at the wrong time and the whole thing
   * lagged a press: the first tap only relabelled the button, the second
   * actually moved. A reducer makes each move atomic.
   */
  const [nav, dispatch] = useReducer(
    (
      state: { route: RouteId; region: string | null; trail: Place[] },
      action:
        | { type: 'go'; to: RouteId; region?: string | null }
        | { type: 'back' }
        | { type: 'sync'; place: Place },
    ) => {
      /*
       * `sync` is the browser telling US where we are — a device back, a
       * forward, an edited address bar. It must not push anything back at the
       * browser, so it only pops the trail if that is in fact where we landed.
       */
      if (action.type === 'sync') {
        const { route, region } = action.place;
        if (route === state.route && region === state.region) return state;
        const previous = state.trail[state.trail.length - 1];
        const trail =
          previous && previous.route === route && previous.region === region
            ? state.trail.slice(0, -1)
            : state.trail;
        return { route, region, trail };
      }
      if (action.type === 'go') {
        const region = action.region ?? null;
        if (action.to === state.route && region === state.region) return state;
        // Capped: this is a browsing trail, not an undo history.
        const here: Place = { route: state.route, region: state.region };
        return { route: action.to, region, trail: [...state.trail, here].slice(-20) };
      }
      const previous = state.trail[state.trail.length - 1];
      if (previous === undefined) return state;
      return { ...previous, trail: state.trail.slice(0, -1) };
    },
    /*
     * The URL is the source of truth on load. Opening /details/wrist_hand has
     * to land on that region, or a bookmark and a shared link are decoration.
     */
    initialPlace(),
  );
  const route = nav.route;
  const detailRegion = nav.region;
  const [networkMode, setNetworkMode] = useState<NetworkMode>('split');

  /*
   * Forward moves push a browser history entry; going back always goes through
   * that history rather than around it.
   *
   * Two records of "where you were" — ours and the browser's — only stay in
   * step if one drives the other. When the in-app control changed state
   * directly it left the browser entry behind, and the next device-back popped
   * an entry already consumed, jumping back twice.
   */
  const pushed = useRef(0);

  /*
   * Where we are, readable from an event handler. The reducer ignores a move to
   * the place you are already on; without this the history push did not, so
   * tapping the current tab three times took three device-backs to leave.
   */
  const here = useRef<Place>({ route: nav.route, region: nav.region });
  useEffect(() => {
    here.current = { route: nav.route, region: nav.region };
  }, [nav.route, nav.region]);

  const setRoute = useCallback((next: RouteId, region?: string | null) => {
    const target = region ?? null;
    const noop = next === here.current.route && target === here.current.region;
    dispatch({ type: 'go', to: next, region });
    if (noop) return;
    try {
      window.history.pushState({ leftEnergyFlow: next }, '', pathFor(next, region));
      pushed.current += 1;
    } catch {
      /* no history (jsdom, or a locked-down embed) — the trail still works */
    }
  }, []);

  /** Open one region's detail lesson — the only route that carries an argument. */
  const setDetailRegion = useCallback(
    (region: string | null) => setRoute('details', region),
    [setRoute],
  );

  const back = useCallback(() => {
    if (pushed.current > 0) {
      // popstate does the work, and decrements the counter.
      window.history.back();
      return;
    }
    dispatch({ type: 'back' });
  }, []);

  /*
   * Installed as a PWA there is no browser chrome, so Android's back button and
   * the iOS back swipe are the only back a learner has. Without this they close
   * the app instead of returning to the previous screen.
   */
  useEffect(() => {
    const onPop = () => {
      pushed.current = Math.max(0, pushed.current - 1);
      // The URL is authoritative when the browser moves us; fall back to the
      // trail only for a history entry that predates the app (jsdom has none).
      const place = routeFromPath(window.location.pathname);
      dispatch(place ? { type: 'sync', place } : { type: 'back' });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const [focus, setFocus] = useState<Focus>({ kind: 'none' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(readPrefs);
  const [navOpen, setNavOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress(adapter.current));

  useEffect(() => {
    saveProgress(adapter.current, progress);
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* preferences are non-essential */
    }
  }, [prefs]);

  useEffect(() => {
    const root = document.documentElement;
    if (prefs.theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', prefs.theme);
  }, [prefs.theme]);

  const answer = useCallback<StoreValue['answer']>((args) => {
    setProgress((prev) => recordAnswer(prev, args));
  }, []);

  const annotateError = useCallback((errorId: string, note: string) => {
    setProgress((prev) => ({
      ...prev,
      errors: prev.errors.map((e: ErrorEntry) =>
        e.id === errorId ? { ...e, confusionNote: note } : e,
      ),
    }));
  }, []);

  const resolveError = useCallback((errorId: string, resolved: boolean) => {
    setProgress((prev) => ({
      ...prev,
      errors: prev.errors.map((e) => (e.id === errorId ? { ...e, resolved } : e)),
    }));
  }, []);

  const markDayComplete = useCallback((dayId: string) => {
    setProgress((prev) =>
      prev.completedDayIds.includes(dayId)
        ? prev
        : { ...prev, completedDayIds: [...prev.completedDayIds, dayId] },
    );
  }, []);

  const resetProgress = useCallback(() => {
    adapter.current.clear();
    setProgress(emptyProgress());
  }, []);

  const exportProgress = useCallback(() => JSON.stringify(progress, null, 2), [progress]);

  const value = useMemo<StoreValue>(
    () => ({
      route,
      setRoute,
      back,
      backTo: nav.trail[nav.trail.length - 1]?.route ?? null,
      detailRegion,
      setDetailRegion,
      networkMode,
      setNetworkMode,
      focus,
      setFocus,
      theme: prefs.theme,
      setTheme: (theme) => setPrefs((p) => ({ ...p, theme })),
      lang: prefs.lang,
      setLang: (lang) => setPrefs((p) => ({ ...p, lang })),
      fontScale: prefs.fontScale,
      setFontScale: (n) => setPrefs((p) => ({ ...p, fontScale: Math.min(5, Math.max(0, n)) })),
      navCollapsed: prefs.navCollapsed,
      setNavCollapsed: (navCollapsed) => setPrefs((p) => ({ ...p, navCollapsed })),
      navOpen,
      setNavOpen,
      searchOpen,
      setSearchOpen,
      progress,
      answer,
      annotateError,
      resolveError,
      markDayComplete,
      resetProgress,
      exportProgress,
    }),
    [
      route,
      setRoute,
      back,
      nav,
      detailRegion,
      setDetailRegion,
      networkMode,
      focus,
      prefs,
      navOpen,
      searchOpen,
      progress,
      answer,
      annotateError,
      resolveError,
      markDayComplete,
      resetProgress,
      exportProgress,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

/** Bilingual text helper honouring the language preference. */
export function useBilingual() {
  const { lang } = useStore();
  return useCallback(
    (zh: string | null | undefined, en: string | null | undefined): string => {
      const z = zh?.trim() ?? '';
      const e = en?.trim() ?? '';
      if (lang === 'zh') return z || e;
      if (lang === 'en') return e || z;
      if (z && e && z !== e) return `${z} · ${e}`;
      return z || e;
    },
    [lang],
  );
}
