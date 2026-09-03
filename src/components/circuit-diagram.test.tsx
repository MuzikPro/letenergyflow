import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { memoryStorage } from '../state/progress';
import { StoreProvider } from '../state/store';
import FlowView from '../views/FlowView';

afterEach(cleanup);

/**
 * The circuit on the Flow page.
 *
 * What the page must not lose track of: the diagram teaches ONE rule, so the
 * yin/yang toggle has to actually separate the two halves; the twelve chips are
 * the same twelve channels the clock cycles through; and pinning a segment is
 * the reader's veto over the auto-advance.
 */

const mount = () =>
  render(
    <StoreProvider storage={memoryStorage()}>
      <FlowView />
    </StoreProvider>,
  );

describe('the circuit section', () => {
  it('renders under the clock with the four stations and the attribution', () => {
    const { container } = mount();
    expect(container.querySelector('.flow-circuit-section')).toBeTruthy();
    for (const label of [/胸腹|Chest/, /^頭$|Head/, /^足$|Foot/]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getByText(/靈樞·逆順肥瘦|Ni shun fei shou/)).toBeTruthy();
  });

  it('keeps the Flow copy compact: no lap rows, and a door to the full page', () => {
    /*
     * The rows, the chips and the standing marks moved to the 十二經運行 page.
     * What the Flow page keeps is the loop, its caption, and one button out —
     * "simplified" being the owner's word for exactly this.
     */
    const { container } = mount();
    expect(container.querySelectorAll('.circuit-lap-row')).toHaveLength(0);
    expect(container.querySelectorAll('.circuit-chip')).toHaveLength(0);
    expect(screen.getByRole('button', { name: /完整頁|Full page/ })).toBeTruthy();
  });
});

describe('the 陰／陽 toggle in the right panel', () => {
  it('sits in the flow detail column and defaults to 全部', () => {
    const { container } = mount();
    const panel = container.querySelector('.flow-circuit-panel')!;
    expect(panel.closest('.flow-detail')).toBeTruthy();
    const all = within(panel as HTMLElement).getByRole('button', { name: /全部|All/ });
    expect(all.getAttribute('aria-pressed')).toBe('true');
  });

  it('dims the other polarity and states the rule', () => {
    const { container } = mount();
    const panel = container.querySelector('.flow-circuit-panel') as HTMLElement;
    fireEvent.click(within(panel).getByRole('button', { name: /只看陰|Yin only/ }));
    // Two of the four arcs are yang; with yin emphasised they go faint.
    expect(container.querySelectorAll('.circuit-arc[opacity="0.22"]')).toHaveLength(2);
    expect(screen.getByText(/陰經上行|Yin channels ascend/)).toBeTruthy();
    // And back: 全部 clears both the dimming and the rule line.
    fireEvent.click(within(panel).getByRole('button', { name: /全部|All/ }));
    expect(container.querySelectorAll('.circuit-arc[opacity="0.22"]')).toHaveLength(0);
  });

  it('names the current channel’s seat — segment, quote and lap', () => {
    const { container } = mount();
    const seat = container.querySelector('.flow-circuit-seat');
    expect(seat).toBeTruthy();
    expect(seat!.textContent).toMatch(/第 [123] 圈|lap [123] of 3/);
    // The store defaults to English here, so accept the quote in either tongue.
    expect(seat!.textContent).toMatch(/[手足]之三[陰陽]|three (yin|yang) of the (hand|foot)/i);
  });
});

describe('the 升／降 toggles', () => {
  it('selects the standing-pose set on the diagram arcs', () => {
    /*
     * 只看↑升 must dim 手三陰 and 足三陽 — one yin arc and one yang arc. If it
     * ever dims the same pair as 只看陰, the standing frame has collapsed into
     * the polarity frame and the toggle teaches nothing. (The row-level version
     * of this check lives with the rows, on the circuit page.)
     */
    const { container } = mount();
    const panel = container.querySelector('.flow-circuit-panel') as HTMLElement;
    fireEvent.click(within(panel).getByRole('button', { name: /只看↑升|Rising/ }));
    expect(container.querySelectorAll('.circuit-arc[opacity="0.22"]')).toHaveLength(2);
    expect(screen.getByText(/Rising with arms hanging|自然垂手時上行/)).toBeTruthy();
  });
});

describe('pinning a segment', () => {
  it('marches every arc at once and keeps all four lines on show', () => {
    // Simultaneous flow: no arc waits its turn, and no caption line does
    // either. The pin is an emphasis, so the list must never collapse to one.
    const { container } = mount();
    expect(container.querySelectorAll('path.circuit-march')).toHaveLength(4);
    const caption = container.querySelector('.circuit-caption')!;
    for (const q of ['手之三陰', '手之三陽', '足之三陽', '足之三陰']) {
      expect(caption.textContent).toContain(q);
    }
    const arcs = [...container.querySelectorAll('svg [role="button"]')];
    const footYin = arcs.find((a) =>
      /足之三陰|Three foot yin/.test(a.getAttribute('aria-label') ?? ''),
    )!;
    fireEvent.click(footYin);
    expect(footYin.getAttribute('aria-pressed')).toBe('true');
    // Still four lines — pinned means bolder, not alone.
    for (const q of ['手之三陰', '足之三陰']) expect(caption.textContent).toContain(q);
    fireEvent.click(footYin);
    expect(footYin.getAttribute('aria-pressed')).toBe('false');
  });
});
