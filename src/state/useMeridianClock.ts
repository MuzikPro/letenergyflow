import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SHICHEN, shichenAt, stepShichen, type Shichen } from '../data/shichen';

/**
 * The 子午流注 clock: which double-hour is showing, and whether that is the
 * system time or the learner's own choice.
 *
 * Auto mode follows the device clock. Any interaction — ring, swipe, keyboard —
 * switches to manual and stays there until reset, so the view never yanks
 * itself back to "now" while someone is reading a different hour.
 */

export interface MeridianClock {
  shichen: Shichen;
  /** 地支 index, 子 = 0 … 亥 = 11. */
  index: number;
  isManual: boolean;
  /** The system-time shichen, shown as a hint while in manual mode. */
  liveIndex: number;
  select: (index: number) => void;
  step: (by: number) => void;
  reset: () => void;
}

/**
 * A selection-sized haptic tick, where the platform has one.
 *
 * iOS Safari implements no vibration API at all, so on iPhone this is a no-op —
 * the interaction has to read correctly without it, and it does. Progressive
 * enhancement only; nothing depends on it firing.
 */
function haptic() {
  if (typeof navigator === 'undefined') return;
  const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  try {
    nav.vibrate?.(8);
  } catch {
    /* a refusing or absent implementation is not an error worth surfacing */
  }
}

export function useMeridianClock(now: () => Date = () => new Date()): MeridianClock {
  const [liveIndex, setLiveIndex] = useState(() => shichenAt(now()).index);
  const [manual, setManual] = useState<number | null>(null);
  const nowRef = useRef(now);
  nowRef.current = now;

  /*
   * Re-read the clock every 30s. That is far more often than a double-hour
   * turns over, and cheap — but it means the view rolls to the next branch on
   * its own rather than only when something else happens to re-render.
   *
   * A hidden tab gets no updates: the interval is cleared, and the current hour
   * is re-read on the way back, so returning to the tab shows the right branch
   * without having ticked in the background.
   */
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => setLiveIndex(shichenAt(nowRef.current()).index);
    const start = () => {
      sync();
      timer = setInterval(sync, 30_000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const index = manual ?? liveIndex;

  const select = useCallback((next: number) => {
    const wrapped = stepShichen(next, 0);
    setManual((prev) => {
      if (prev !== wrapped) haptic();
      return wrapped;
    });
  }, []);

  const step = useCallback((by: number) => {
    setManual((prev) => {
      haptic();
      return stepShichen(prev ?? shichenAt(nowRef.current()).index, by);
    });
  }, []);

  const reset = useCallback(() => {
    setLiveIndex(shichenAt(nowRef.current()).index);
    setManual(null);
  }, []);

  return useMemo(
    () => ({
      shichen: SHICHEN[index]!,
      index,
      isManual: manual !== null,
      liveIndex,
      select,
      step,
      reset,
    }),
    [index, manual, liveIndex, select, step, reset],
  );
}
