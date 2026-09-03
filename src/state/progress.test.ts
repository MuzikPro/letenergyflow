import { describe, expect, it } from 'vitest';
import {
  dueQueue,
  emptyProgress,
  intervalForBox,
  isDue,
  loadProgress,
  masteryBreakdown,
  memoryStorage,
  recordAnswer,
  saveProgress,
  scheduleNext,
  REVIEW_INTERVALS_DAYS,
} from './progress';

const at = (iso: string) => new Date(iso);

describe('1-3-7 spaced review', () => {
  it('starts from the handbook rhythm', () => {
    expect(REVIEW_INTERVALS_DAYS.slice(0, 3)).toEqual([1, 3, 7]);
  });

  it('advances one box per correct answer and reschedules further out', () => {
    const day0 = at('2026-08-05T09:00:00Z');
    const first = scheduleNext(undefined, true, day0);
    expect(first.box).toBe(1);
    expect(intervalForBox(first.box)).toBe(1);

    const second = scheduleNext(first, true, day0);
    expect(second.box).toBe(2);
    expect(intervalForBox(second.box)).toBe(3);

    const third = scheduleNext(second, true, day0);
    expect(intervalForBox(third.box)).toBe(7);
  });

  it('drops straight back to box 0 on a miss, so it comes back today', () => {
    const day0 = at('2026-08-05T09:00:00Z');
    const strong = scheduleNext(scheduleNext(scheduleNext(undefined, true, day0), true, day0), true, day0);
    expect(strong.box).toBe(3);
    const missed = scheduleNext(strong, false, day0);
    expect(missed.box).toBe(0);
    expect(missed.incorrect).toBe(1);
    expect(isDue(missed, day0)).toBe(true);
  });

  it('is not due before its interval elapses', () => {
    const day0 = at('2026-08-05T09:00:00Z');
    const item = scheduleNext(undefined, true, day0);
    expect(isDue(item, at('2026-08-05T23:00:00Z'))).toBe(false);
    expect(isDue(item, at('2026-08-06T08:00:00Z'))).toBe(true);
  });

  it('caps at the longest interval', () => {
    const day0 = at('2026-08-05T09:00:00Z');
    let item = scheduleNext(undefined, true, day0);
    for (let i = 0; i < 10; i++) item = scheduleNext(item, true, day0);
    expect(intervalForBox(item.box)).toBe(30);
  });
});

describe('review queue', () => {
  const ids = ['a', 'b', 'c'];

  it('shows unseen material first', () => {
    const day0 = at('2026-08-05T09:00:00Z');
    let state = emptyProgress(day0);
    state = recordAnswer(
      state,
      {
        itemId: 'a',
        itemKind: 'flashcard',
        acupointId: null,
        wasCorrect: true,
        promptEn: 'x',
        givenAnswer: 'y',
        expectedAnswer: 'z',
      },
      day0,
    );
    expect(dueQueue(state, ids, day0)).toEqual(['b', 'c']);
  });

  it('reports mastery buckets', () => {
    const day0 = at('2026-08-05T09:00:00Z');
    let state = emptyProgress(day0);
    for (let i = 0; i < 3; i++) {
      state = recordAnswer(
        state,
        {
          itemId: 'a',
          itemKind: 'quiz',
          acupointId: 'pt_li4',
          wasCorrect: true,
          promptEn: 'x',
          givenAnswer: 'y',
          expectedAnswer: 'z',
        },
        day0,
      );
    }
    const b = masteryBreakdown(state, ids, day0);
    expect(b.total).toBe(3);
    expect(b.strong).toBe(1);
    expect(b.untouched).toBe(2);
  });
});

describe('error notebook', () => {
  it('logs a wrong answer with both answers and an empty confusion note', () => {
    const day0 = at('2026-08-05T09:00:00Z');
    const state = recordAnswer(
      emptyProgress(day0),
      {
        itemId: 'qz_1',
        itemKind: 'quiz',
        acupointId: 'pt_lu11',
        wasCorrect: false,
        promptEn: 'Which meridian?',
        givenAnswer: 'Large Intestine',
        expectedAnswer: 'Lung',
      },
      day0,
    );
    expect(state.errors).toHaveLength(1);
    expect(state.errors[0]).toMatchObject({
      acupointId: 'pt_lu11',
      givenAnswer: 'Large Intestine',
      expectedAnswer: 'Lung',
      confusionNote: '',
      resolved: false,
    });
    expect(state.pointMastery['pt_lu11']).toEqual({ correct: 0, incorrect: 1 });
  });

  it('logs nothing when the answer is right', () => {
    const day0 = at('2026-08-05T09:00:00Z');
    const state = recordAnswer(
      emptyProgress(day0),
      {
        itemId: 'qz_1',
        itemKind: 'quiz',
        acupointId: 'pt_lu11',
        wasCorrect: true,
        promptEn: 'p',
        givenAnswer: 'Lung',
        expectedAnswer: 'Lung',
      },
      day0,
    );
    expect(state.errors).toHaveLength(0);
  });
});

describe('local persistence', () => {
  it('round-trips through the storage adapter', () => {
    const storage = memoryStorage();
    const day0 = at('2026-08-05T09:00:00Z');
    const state = recordAnswer(
      emptyProgress(day0),
      {
        itemId: 'fc_1',
        itemKind: 'flashcard',
        acupointId: 'pt_li4',
        wasCorrect: true,
        promptEn: 'p',
        givenAnswer: 'g',
        expectedAnswer: 'e',
      },
      day0,
    );
    saveProgress(storage, state);
    expect(loadProgress(storage).items['fc_1']?.box).toBe(1);
  });

  it('starts clean when storage holds junk or an older version', () => {
    const storage = memoryStorage();
    storage.write('not json');
    expect(loadProgress(storage).items).toEqual({});
    storage.write(JSON.stringify({ version: 0, items: { a: {} } }));
    expect(loadProgress(storage).items).toEqual({});
  });

  it('can be erased completely', () => {
    const storage = memoryStorage();
    saveProgress(storage, emptyProgress());
    storage.clear();
    expect(storage.read()).toBeNull();
  });
});
