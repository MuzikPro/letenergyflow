import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { memoryStorage } from '../state/progress';
import { StoreProvider, useStore } from '../state/store';
import App from '../App';

afterEach(cleanup);

/*
 * Routes have real URLs now, and the store reads the URL on mount — so a
 * pushState from the previous test would decide where the next one starts.
 * jsdom keeps one window per file, so the address bar is reset here.
 */
beforeEach(() => window.history.replaceState(null, '', '/'));

const wrap = (ui: React.ReactNode) => (
  <StoreProvider storage={memoryStorage()}>{ui}</StoreProvider>
);

const backButton = () =>
  screen.queryByRole('button', { name: /Back to|返回/ });

/**
 * Getting back.
 *
 * The app is full of cross-view links — "see this channel on the atlas", a
 * matrix cell, a quiz answer — and each one used to be a one-way trip. The nav
 * could return you to the right TAB, but not to what you were reading, and on
 * an installed PWA the device's back gesture closed the app instead.
 */
/*
 * These render the whole App — every route's chrome, and the atlas behind it —
 * so they run well past vitest's 5s default once the suite is competing for
 * the machine. Same reason atlas.test.tsx carries explicit timeouts.
 */
describe('back navigation', () => {
  it('offers nothing to go back to on a first landing', { timeout: 30000 }, () => {
    render(wrap(<App />));
    expect(backButton()).toBeNull();
  });

  it('names the screen it would return to, not just an arrow', { timeout: 30000 }, async () => {
    render(wrap(<App />));
    fireEvent.click(screen.getByRole('button', { name: /Network|網絡圖/ }));
    // "← Network" tells you where you land; a bare arrow does not.
    await waitFor(() => expect(backButton()).toBeTruthy());
    expect(backButton()!.getAttribute('aria-label')).toMatch(/Back to Atlas|返回人體圖/);
  });

  it('returns to the previous screen in one press', { timeout: 30000 }, async () => {
    render(wrap(<App />));
    fireEvent.click(screen.getByRole('button', { name: /Learn|課程/ }));
    await waitFor(() => expect(backButton()).toBeTruthy());
    fireEvent.click(backButton()!);
    // Back to the atlas, and with nowhere further to go the control disappears.
    await waitFor(() => expect(backButton()).toBeNull());
  });

  it('adds nothing to the trail for the tab you are already on', { timeout: 30000 }, async () => {
    render(wrap(<App />));
    const network = screen.getByRole('button', { name: /Network|網絡圖/ });
    fireEvent.click(network);
    await waitFor(() => expect(backButton()).toBeTruthy());
    fireEvent.click(network);
    fireEvent.click(network);
    // Still one step back to the atlas, not three.
    fireEvent.click(backButton()!);
    await waitFor(() => expect(backButton()).toBeNull());
  });
});

/**
 * The store's own contract, exercised directly. The reducer has to move route
 * and trail together — they were two `useState`s once, with the route set from
 * inside the trail's updater, and the whole control lagged a press.
 */
describe('route trail', () => {
  function Probe() {
    const { route, backTo, setRoute, back } = useStore();
    return (
      <>
        <span data-testid="route">{route}</span>
        <span data-testid="backTo">{backTo ?? 'none'}</span>
        <button type="button" onClick={() => setRoute('network')}>go network</button>
        <button type="button" onClick={() => setRoute('learn')}>go learn</button>
        <button type="button" onClick={back}>go back</button>
      </>
    );
  }

  it('moves route and trail in the same step', async () => {
    render(wrap(<Probe />));
    expect(screen.getByTestId('route').textContent).toBe('atlas');
    expect(screen.getByTestId('backTo').textContent).toBe('none');

    fireEvent.click(screen.getByRole('button', { name: 'go network' }));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('network'));
    expect(screen.getByTestId('backTo').textContent).toBe('atlas');

    fireEvent.click(screen.getByRole('button', { name: 'go learn' }));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('learn'));
    expect(screen.getByTestId('backTo').textContent).toBe('network');
  });

  it('unwinds one step per press, in order', async () => {
    render(wrap(<Probe />));
    fireEvent.click(screen.getByRole('button', { name: 'go network' }));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('network'));
    fireEvent.click(screen.getByRole('button', { name: 'go learn' }));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('learn'));

    fireEvent.click(screen.getByRole('button', { name: 'go back' }));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('network'));
    fireEvent.click(screen.getByRole('button', { name: 'go back' }));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('atlas'));
    expect(screen.getByTestId('backTo').textContent).toBe('none');
  });

  it('does nothing at the start of the trail', async () => {
    render(wrap(<Probe />));
    fireEvent.click(screen.getByRole('button', { name: 'go back' }));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('atlas'));
    expect(screen.getByTestId('backTo').textContent).toBe('none');
  });
});

/**
 * "Where he was" means the reading, not just the tab. The network view's mode
 * lives in the store for this reason: leaving for the atlas and coming back
 * used to reset it to the default.
 */
describe('returning to the same reading', () => {
  function Probe() {
    const { networkMode, setNetworkMode, setRoute, back, route } = useStore();
    return (
      <>
        <span data-testid="route">{route}</span>
        <span data-testid="mode">{networkMode}</span>
        <button type="button" onClick={() => setNetworkMode('line')}>choose line</button>
        <button type="button" onClick={() => setRoute('atlas')}>to atlas</button>
        <button type="button" onClick={back}>go back</button>
      </>
    );
  }

  it('keeps the network reading across a trip to the atlas and back', async () => {
    render(wrap(<Probe />));
    fireEvent.click(screen.getByRole('button', { name: 'choose line' }));
    expect(screen.getByTestId('mode').textContent).toBe('line');

    fireEvent.click(screen.getByRole('button', { name: 'to atlas' }));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('atlas'));
    fireEvent.click(screen.getByRole('button', { name: 'go back' }));

    // The mode survived: back means the screen you left, not its default.
    await waitFor(() => expect(screen.getByTestId('mode').textContent).toBe('line'));
  });
});
