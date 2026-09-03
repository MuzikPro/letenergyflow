import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { routeFromPath } from '../state/store';
import { memoryStorage } from '../state/progress';
import { StoreProvider } from '../state/store';
import CircuitView from './CircuitView';
import App from '../App';

afterEach(cleanup);

/**
 * 十二經運行 as its own page.
 *
 * What has to hold: the page is reachable from the rail and by URL; the body is
 * genuinely bilateral (the mirror is a transform, so the two sides cannot
 * disagree); the five toggles cut the arcs on both sides at once; and the video
 * elements our sources do NOT cover stay absent.
 */

const mount = () =>
  render(
    <StoreProvider storage={memoryStorage()}>
      <CircuitView />
    </StoreProvider>,
  );

describe('routing', () => {
  it('answers to /circuit and sits in the rail', () => {
    expect(routeFromPath('/circuit')).toEqual({ route: 'circuit', region: null });
    render(
      <StoreProvider storage={memoryStorage()}>
        <App />
      </StoreProvider>,
    );
    const nav = document.querySelector('nav')!;
    const btn = [...nav.querySelectorAll('button')].find((b) =>
      /Circuit|運行/.test(b.textContent ?? b.getAttribute('title') ?? ''),
    )!;
    fireEvent.click(btn);
    expect(document.querySelector('.circuit-view')).toBeTruthy();
  });
});

describe('the bilateral body', () => {
  it('draws every segment twice — once per side — as one mirrored geometry', () => {
    const { container } = mount();
    const svg = container.querySelector('.circuit-body')!;
    // 4 visible arcs + 4 hit arcs per side.
    const arcs = [...svg.querySelectorAll('path[stroke-dasharray="9 7"]')];
    expect(arcs).toHaveLength(8);
    const mirrored = svg.querySelectorAll('g[transform*="scale(-1,1)"]');
    expect(mirrored).toHaveLength(1);
    // Station boxes: 頭胸腹 + two hands + two feet.
    expect(svg.querySelectorAll('.circuit-station')).toHaveLength(7);
  });

  it('names the pose and the flank rule, and nothing our sources lack', () => {
    const { container } = mount();
    const text = container.textContent ?? '';
    expect(text).toMatch(/舉手站立|arms raised/i);
    expect(text).toMatch(/陰升陽降|yin ↑ yang ↓/);
    /*
     * The video also carries 左升右降 and 地氣／天氣 captions. Our registered
     * sources do not, so an "honest duplication" here means honestly NOT
     * duplicating those — this pins the boundary.
     */
    for (const absent of ['左升', '右降', '地氣', '天氣']) {
      expect({ absent, present: text.includes(absent) }).toEqual({ absent, present: false });
    }
  });

  it('cuts both sides at once with the toggles', () => {
    const { container } = mount();
    fireEvent.click(screen.getByRole('button', { name: /只看陰|Yin only/ }));
    const svg = container.querySelector('.circuit-body')!;
    const dim = [...svg.querySelectorAll('g[opacity="0.2"]')];
    // Two yang segments per side.
    expect(dim).toHaveLength(4);
    expect(screen.getByText(/陰經上行|Yin channels ascend/)).toBeTruthy();
  });

  it('flows everywhere at once, with each line at its own segment', () => {
    /*
     * The correction this revision exists for: qi does not take turns. Every
     * arc must carry the march (reduced motion aside), and the four classical
     * lines sit ON the figure at their segments rather than cycling below it.
     */
    const { container } = mount();
    const svg = container.querySelector('.circuit-body')!;
    expect(svg.querySelectorAll('path.circuit-march')).toHaveLength(8);
    const placed = [...svg.querySelectorAll('.circuit-quote-inline')].map(
      (e) => e.textContent ?? '',
    );
    expect(placed).toHaveLength(4);
    for (const q of ['手之三陰', '手之三陽', '足之三陽', '足之三陰']) {
      expect(placed.join(' ')).toContain(q);
    }
    // No timer-driven caption cycling remains on the page.
    expect(container.querySelector('.circuit-caption')).toBeNull();
  });

  it('keeps the lap rows and rings the hour channel', () => {
    const { container } = mount();
    expect(container.querySelectorAll('.circuit-lap-row')).toHaveLength(4);
    expect(container.querySelectorAll('.circuit-chip')).toHaveLength(12);
    expect(container.querySelectorAll('.circuit-chip[data-active]')).toHaveLength(1);
  });
});
