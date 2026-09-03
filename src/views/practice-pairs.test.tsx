import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { pairDrill } from '../data/pair-drill';
import { memoryStorage } from '../state/progress';
import { StoreProvider, useStore } from '../state/store';
import PracticeView from './PracticeView';

// `globals: false`, so Testing Library's auto-cleanup is never registered.
afterEach(cleanup);

/**
 * The drill is only worth having if a miss reaches the two things that make
 * this app a memory tool rather than a quiz: the spaced-review scheduler and
 * the error notebook. And a correction that names the partner but cannot show
 * it is the dead link the pair focus was built to remove.
 */

function Probe() {
  const { progress, focus, route } = useStore();
  return (
    <>
      <span data-testid="errors">{progress.errors.length}</span>
      <span data-testid="last-error">{progress.errors[0]?.expectedAnswer ?? ''}</span>
      <span data-testid="scheduled">{Object.keys(progress.items).length}</span>
      <span data-testid="focus">{focus.kind === 'shu_mu' ? focus.organ : focus.kind}</span>
      <span data-testid="route">{route}</span>
      <PracticeView />
    </>
  );
}

const openDrill = () => {
  render(
    <StoreProvider storage={memoryStorage()}>
      <Probe />
    </StoreProvider>,
  );
  fireEvent.click(screen.getByRole('tab', { name: /募俞配對|Mu–Shu pairs/ }));
};

/** The option buttons, which are the only `.option` elements on screen. */
const options = () => Array.from(document.querySelectorAll('button.option'));

describe('募俞 pair drill in Practice', () => {
  it('asks the first pair and marks a right answer right', () => {
    const first = pairDrill()[0]!;
    openDrill();
    // 肺: given 中府 LU1, the level of 肺俞 BL13 is asked for.
    expect(first.askFor).toBe('level');
    const heading = screen.getByRole('heading', { level: 2 }).textContent ?? '';
    expect(heading).toMatch(new RegExp(first.given.code));
    expect(heading).toMatch(new RegExp(first.partner.code));
    expect(options().length).toBe(4);

    const label = first.options.find((o) => o.id === first.correctOptionId)!.en;
    const right = options().find((b) => b.textContent?.includes(label))!;
    fireEvent.click(right);
    expect(right.getAttribute('data-state')).toBe('correct');
    expect(screen.getByTestId('errors').textContent).toBe('0');
  });

  it('logs a miss to the error notebook with the answer that was wanted', () => {
    const first = pairDrill()[0]!;
    const label = first.options.find((o) => o.id === first.correctOptionId)!.en;
    openDrill();
    const wrong = options().find((b) => !b.textContent?.includes(label))!;
    fireEvent.click(wrong);

    expect(screen.getByTestId('errors').textContent).toBe('1');
    expect(screen.getByTestId('last-error').textContent).toBe(label);
    // And the right option is shown as such, not merely the wrong one flagged.
    const right = options().find((b) => b.textContent?.includes(label))!;
    expect(right.getAttribute('data-state')).toBe('correct');
    expect(wrong.getAttribute('data-state')).toBe('wrong');
  });

  it('schedules the question for spaced review under its stable id', () => {
    const first = pairDrill()[0]!;
    expect(first.id).toBe('drill_shu_mu_lung_level');
    openDrill();
    expect(screen.getByTestId('scheduled').textContent).toBe('0');
    fireEvent.click(options()[0]!);
    expect(screen.getByTestId('scheduled').textContent).toBe('1');
  });

  it('states the vertebral level in the correction', () => {
    openDrill();
    fireEvent.click(options()[0]!);
    // 肺俞 BL13 is at T3; the correction must carry it, since the level is the
    // half of the pairing a code alone does not teach.
    const body = document.body.textContent ?? '';
    expect(/T3|第 3 胸椎/.test(body)).toBe(true);
    // And it must keep saying what this is not.
    expect(/not treatment advice|不是治療建議/.test(body)).toBe(true);
  });

  it('offers the pair focus, which is the only way to see both halves', () => {
    openDrill();
    fireEvent.click(options()[0]!);
    expect(screen.getByTestId('focus').textContent).toBe('none');

    fireEvent.click(
      screen.getByRole('button', { name: /Show the pair on the figure|在圖上看這一對/ }),
    );
    expect(screen.getByTestId('focus').textContent).toBe('lung');
    expect(screen.getByTestId('route').textContent).toBe('atlas');
  });

  it('advances through the deck and finishes with a score', () => {
    const deck = pairDrill();
    openDrill();
    for (let i = 0; i < deck.length; i += 1) {
      fireEvent.click(options()[0]!);
      fireEvent.click(
        screen.getByRole('button', { name: /Next question|下一題|See results|看結果/ }),
      );
    }
    const done = screen.getByRole('heading', { name: /Pair drill complete|配對練習完成/ });
    expect(done).toBeTruthy();
    // Every question was answered, right or wrong.
    expect(
      within(done.parentElement as HTMLElement).getByText(new RegExp(`of ${deck.length}|／${deck.length}`)),
    ).toBeTruthy();
  });
});
