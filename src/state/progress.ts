/**
 * Learner progress: mastery, spaced review, and the error notebook.
 *
 * Everything here stays on the device. There is no account, no sync, no
 * telemetry, and no third party. The whole state is a single JSON blob the
 * learner can export or erase at any time.
 */

export const STORAGE_KEY = 'let-energy-flow.progress.v1';
export const PROGRESS_VERSION = 1;

/** The handbook's 1-3-7 rhythm, extended with two consolidation intervals. */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;
export const MAX_BOX = REVIEW_INTERVALS_DAYS.length;

export type ItemKind = 'flashcard' | 'quiz' | 'locate';

export interface ItemProgress {
  /** 0 = never answered correctly; MAX_BOX = fully spaced out. */
  box: number;
  correct: number;
  incorrect: number;
  /** ISO date strings. */
  lastReviewedAt: string | null;
  dueAt: string | null;
}

export interface ErrorEntry {
  id: string;
  at: string;
  itemId: string;
  itemKind: ItemKind;
  /** The point the learner got wrong, when the item is about one. */
  acupointId: string | null;
  promptEn: string;
  givenAnswer: string;
  expectedAnswer: string;
  /** "Why did I mix these up?" — the handbook's error-patching step. */
  confusionNote: string;
  resolved: boolean;
}

export interface ProgressState {
  version: number;
  createdAt: string;
  /** Keyed by flashcard / quiz item id. */
  items: Record<string, ItemProgress>;
  /** Keyed by acupoint id — aggregated recognition strength. */
  pointMastery: Record<string, { correct: number; incorrect: number }>;
  errors: ErrorEntry[];
  completedDayIds: string[];
}

export function emptyProgress(now: Date = new Date()): ProgressState {
  return {
    version: PROGRESS_VERSION,
    createdAt: now.toISOString(),
    items: {},
    pointMastery: {},
    errors: [],
    completedDayIds: [],
  };
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function addDays(from: Date, days: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

/** Interval for a given box, in days. Box 0 means "see it again today". */
export function intervalForBox(box: number): number {
  if (box <= 0) return 0;
  return REVIEW_INTERVALS_DAYS[Math.min(box, MAX_BOX) - 1]!;
}

export function scheduleNext(
  prev: ItemProgress | undefined,
  wasCorrect: boolean,
  now: Date = new Date(),
): ItemProgress {
  const base: ItemProgress = prev ?? {
    box: 0,
    correct: 0,
    incorrect: 0,
    lastReviewedAt: null,
    dueAt: null,
  };
  const box = wasCorrect ? Math.min(base.box + 1, MAX_BOX) : 0;
  const due = addDays(startOfDay(now), intervalForBox(box));
  return {
    box,
    correct: base.correct + (wasCorrect ? 1 : 0),
    incorrect: base.incorrect + (wasCorrect ? 0 : 1),
    lastReviewedAt: now.toISOString(),
    dueAt: due.toISOString(),
  };
}

export function isDue(item: ItemProgress | undefined, now: Date = new Date()): boolean {
  if (!item || !item.dueAt) return true;
  return new Date(item.dueAt).getTime() <= now.getTime();
}

/**
 * Items to review right now: never-seen first, then most overdue.
 * `allIds` is the full pool so newly added content surfaces automatically.
 */
export function dueQueue(
  state: ProgressState,
  allIds: string[],
  now: Date = new Date(),
): string[] {
  const unseen = allIds.filter((id) => !state.items[id]);
  const due = allIds
    .filter((id) => state.items[id] && isDue(state.items[id], now))
    .sort((a, b) => {
      const da = new Date(state.items[a]!.dueAt ?? 0).getTime();
      const db = new Date(state.items[b]!.dueAt ?? 0).getTime();
      return da - db;
    });
  return [...unseen, ...due];
}

export interface MasteryBreakdown {
  total: number;
  /** Answered correctly at least once and currently in box >= 3. */
  strong: number;
  /** Seen, but still in an early box. */
  learning: number;
  untouched: number;
  dueNow: number;
}

export function masteryBreakdown(
  state: ProgressState,
  allIds: string[],
  now: Date = new Date(),
): MasteryBreakdown {
  let strong = 0;
  let learning = 0;
  let untouched = 0;
  let dueNow = 0;
  for (const id of allIds) {
    const item = state.items[id];
    if (!item) {
      untouched += 1;
      dueNow += 1;
      continue;
    }
    if (item.box >= 3) strong += 1;
    else learning += 1;
    if (isDue(item, now)) dueNow += 1;
  }
  return { total: allIds.length, strong, learning, untouched, dueNow };
}

export function recordAnswer(
  state: ProgressState,
  args: {
    itemId: string;
    itemKind: ItemKind;
    acupointId: string | null;
    wasCorrect: boolean;
    promptEn: string;
    givenAnswer: string;
    expectedAnswer: string;
  },
  now: Date = new Date(),
): ProgressState {
  const items = { ...state.items, [args.itemId]: scheduleNext(state.items[args.itemId], args.wasCorrect, now) };

  const pointMastery = { ...state.pointMastery };
  if (args.acupointId) {
    const prev = pointMastery[args.acupointId] ?? { correct: 0, incorrect: 0 };
    pointMastery[args.acupointId] = {
      correct: prev.correct + (args.wasCorrect ? 1 : 0),
      incorrect: prev.incorrect + (args.wasCorrect ? 0 : 1),
    };
  }

  const errors = args.wasCorrect
    ? state.errors
    : [
        {
          id: `err_${now.getTime()}_${args.itemId}`,
          at: now.toISOString(),
          itemId: args.itemId,
          itemKind: args.itemKind,
          acupointId: args.acupointId,
          promptEn: args.promptEn,
          givenAnswer: args.givenAnswer,
          expectedAnswer: args.expectedAnswer,
          confusionNote: '',
          resolved: false,
        },
        ...state.errors,
      ].slice(0, 200);

  return { ...state, items, pointMastery, errors };
}

/* ------------------------------ persistence ------------------------------- */

export interface StorageAdapter {
  read(): string | null;
  write(value: string): void;
  clear(): void;
}

export const memoryStorage = (): StorageAdapter => {
  let v: string | null = null;
  return {
    read: () => v,
    write: (value) => {
      v = value;
    },
    clear: () => {
      v = null;
    },
  };
};

export const localStorageAdapter = (): StorageAdapter => {
  try {
    if (typeof localStorage === 'undefined') return memoryStorage();
    return {
      read: () => localStorage.getItem(STORAGE_KEY),
      write: (value) => localStorage.setItem(STORAGE_KEY, value),
      clear: () => localStorage.removeItem(STORAGE_KEY),
    };
  } catch {
    // Private-mode or blocked storage: degrade to in-memory rather than crash.
    return memoryStorage();
  }
};

export function loadProgress(storage: StorageAdapter): ProgressState {
  const raw = storage.read();
  if (!raw) return emptyProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (parsed.version !== PROGRESS_VERSION) return emptyProgress();
    return {
      ...emptyProgress(),
      ...parsed,
      items: parsed.items ?? {},
      pointMastery: parsed.pointMastery ?? {},
      errors: parsed.errors ?? [],
      completedDayIds: parsed.completedDayIds ?? [],
    } as ProgressState;
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(storage: StorageAdapter, state: ProgressState): void {
  try {
    storage.write(JSON.stringify(state));
  } catch {
    /* storage full or unavailable — the session still works in memory */
  }
}
