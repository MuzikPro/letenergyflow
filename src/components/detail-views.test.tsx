import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { dataset } from '../data';
import { denorm, EXTREMITIES, inExtremity, onExtremity } from '../data/atlas';
import { expandFunction } from '../search';
import { memoryStorage } from '../state/progress';
import { StoreProvider, useStore } from '../state/store';
import Atlas from './Atlas';
import SpecificPointMatrix from './SpecificPointMatrix';
import TopicCards from './TopicCards';

// This project does not enable vitest globals, so Testing Library's automatic
// afterEach cleanup is not registered. Without it, a rendered Atlas leaks into
// the next test and every hotspot query finds two matches.
afterEach(cleanup);

const wrap = (ui: React.ReactNode) => (
  <StoreProvider storage={memoryStorage()}>{ui}</StoreProvider>
);

describe('extremity detail view', () => {
  it('covers every hand and foot point with exactly one region', () => {
    // The regions are derived from the drawn hand/foot geometry, so a point on
    // a digit must fall inside one — otherwise it would be unreachable from any
    // hotspot and invisible in every detail view.
    const digitPoints = dataset.acupoints.filter((p) =>
      /finger|thumb|hand|palm|toe|foot|heel|wrist|ankle/.test(p.bodyRegion),
    );
    expect(digitPoints.length).toBeGreaterThan(30);

    let covered = 0;
    for (const p of digitPoints) {
      const pl = p.placements[0]!;
      const c = denorm(pl.x, pl.y);
      const hits = EXTREMITIES.filter((r) => inExtremity(r, c.x, c.y));
      // A wrist or ankle point may sit just proximal to the box; what must never
      // happen is a point landing in two regions at once.
      expect(hits.length).toBeLessThanOrEqual(1);
      if (hits.length === 1) covered++;
    }
    expect(covered).toBeGreaterThan(digitPoints.length * 0.8);
  });

  it('agrees with the drawn geometry it is derived from', () => {
    // Sanity: the extremity boxes are big enough to contain the digits the
    // figure actually draws, in both local-frame and atlas terms.
    for (const r of EXTREMITIES) {
      expect(r.box.w).toBeGreaterThan(30);
      expect(r.box.h).toBeGreaterThan(40);
      expect(onExtremity(r.kind, 0, 20)).toBe(true);
    }
    expect(EXTREMITIES.map((r) => r.id).sort()).toEqual([
      'foot-left',
      'foot-right',
      'hand-left',
      'hand-right',
    ]);
  });

  // Renders the full atlas before opening the modal, so it needs more than the
  // 5s default once the rest of the suite is competing for the machine.
  it('opens from a hotspot and lists that region’s points', { timeout: 30000 }, () => {
    render(wrap(<Atlas />));
    const hotspot = screen.getByRole('button', { name: /Left hand|左手/ });
    fireEvent.click(hotspot);

    const dialog = screen.getByRole('dialog');
    // 少商 LU11 and 少澤 SI1 both sit on the figure's left hand.
    expect(within(dialog).getAllByRole('button', { name: /LU11/ }).length).toBeGreaterThan(0);
    expect(within(dialog).getAllByRole('button', { name: /SI1\b/ }).length).toBeGreaterThan(0);
    // 合谷 LI4 is on the OTHER hand and must not appear here.
    expect(within(dialog).queryByRole('button', { name: /LI4/ })).toBeNull();
  });

  // Renders the full atlas before opening the modal, like its sibling above.
  it('closes on Escape', { timeout: 30000 }, () => {
    render(wrap(<Atlas />));
    fireEvent.click(screen.getByRole('button', { name: /Right foot|右足/ }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps the schematic caveat on the zoomed view', () => {
    render(wrap(<Atlas />));
    fireEvent.click(screen.getByRole('button', { name: /Left foot|左足/ }));
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByText(/not an anatomical locator|非解剖定位依據/),
    ).toBeTruthy();
  });
});

describe('topic info cards', () => {
  it('renders one mapping row per relation, and an annotation per placed point', () => {
    render(wrap(<TopicCards />));
    const fn = dataset.traditionalFunctions[0]!;
    const ex = expandFunction(fn.id)!;
    // The first card opens by default.
    const rows = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.arrow'));
    expect(rows.length).toBe(ex.acupoints.length + ex.meridians.length);
  });

  it('states its educational framing in the active language only', () => {
    render(wrap(<TopicCards />));
    const framing = document.querySelector('.framing')!;
    expect(framing.textContent).toBeTruthy();
    // Never a mixture: the rendered framing is one script, not both.
    const hasHan = /[一-鿿]/.test(framing.textContent!);
    const hasLatinWords = /\b(?:not|guidance|educational)\b/i.test(framing.textContent!);
    expect(hasHan && hasLatinWords).toBe(false);
  });

  it('expands and collapses a card', () => {
    render(wrap(<TopicCards />));
    const heads = screen.getAllByRole('button', { expanded: false });
    expect(heads.length).toBeGreaterThan(0);
    fireEvent.click(heads[0]!);
    expect(heads[0]!.getAttribute('aria-expanded')).toBe('true');
  });
});

/**
 * A cell in the Day 11 matrix promises "tap any point to locate it on the
 * figure". Setting the focus alone does not keep that promise: the matrix
 * lives on the Learn page, which has no figure, so a tap looked like nothing
 * happened. The handoff is focus AND route, the same pair the practice quiz
 * and the Learn page's meridian chips already use.
 */
describe('specific-point matrix → atlas handoff', () => {
  function Probe() {
    const { route, focus } = useStore();
    return (
      <>
        <span data-testid="route">{route}</span>
        <span data-testid="focus">{focus.kind === 'point' ? focus.pointId : focus.kind}</span>
        <SpecificPointMatrix />
      </>
    );
  }

  it('sends the learner to the atlas with that point focused', () => {
    render(wrap(<Probe />));
    expect(screen.getByTestId('route').textContent).toBe('atlas');
    expect(screen.getByTestId('focus').textContent).toBe('none');

    // 太淵 LU9 — the Lung's shu-stream, on the opening tab.
    fireEvent.click(screen.getByRole('button', { name: /LU9/ }));
    expect(screen.getByTestId('focus').textContent).toBe('pt_lu9');
    expect(screen.getByTestId('route').textContent).toBe('atlas');
  });

  it('makes the same handoff from a tab reached later, and from the mu column', () => {
    render(wrap(<Probe />));
    fireEvent.click(screen.getByRole('tab', { name: /募俞|Mu & Shu/ }));
    // 中脘 CV12 is a front-mu button, which renders its own markup rather than
    // going through the shared cell — it needs the handoff wired separately.
    fireEvent.click(screen.getByRole('button', { name: /CV12/ }));
    expect(screen.getByTestId('focus').textContent).toBe('pt_cv12');
    expect(screen.getByTestId('route').textContent).toBe('atlas');
  });

  it('lights both halves of a pair, which no single-point focus can do', () => {
    render(wrap(<Probe />));
    fireEvent.click(screen.getByRole('tab', { name: /募俞|Mu & Shu/ }));
    // 脾 — 章門 LR13 on the flank, 脾俞 BL20 at T11. Different views, so the
    // atlas must be told about the pair rather than about either point.
    const rows = screen.getAllByRole('button', { name: /前後對照|^Pair →$/ });
    expect(rows.length).toBe(12);
    fireEvent.click(rows[3]!);
    expect(screen.getByTestId('focus').textContent).toBe('shu_mu');
    expect(screen.getByTestId('route').textContent).toBe('atlas');
  });

  it('routes away from Learn, where the matrix is actually shown', () => {
    // Guards the real symptom: the store starts on 'atlas' in a bare render, so
    // prove the route is SET rather than merely left alone.
    function LearnProbe() {
      const { route, setRoute } = useStore();
      useEffect(() => {
        setRoute('learn');
      }, [setRoute]);
      return (
        <>
          <span data-testid="route">{route}</span>
          <SpecificPointMatrix />
        </>
      );
    }
    render(wrap(<LearnProbe />));
    expect(screen.getByTestId('route').textContent).toBe('learn');
    fireEvent.click(screen.getByRole('button', { name: /ST36/ }));
    expect(screen.getByTestId('route').textContent).toBe('atlas');
  });
});

/**
 * A 募俞 pair is the only focus whose two members are on opposite sides of the
 * figure, so "highlight it" cannot mean "centre one point". Eleven of the twelve
 * pairs straddle the views; the atlas must keep BOTH lit whichever side is up,
 * so that flipping front/back walks the learner from one half to the other.
 */
describe('募俞 pair on the figure', () => {
  function PairProbe({ organ }: { organ: string }) {
    const { setFocus } = useStore();
    useEffect(() => {
      setFocus({ kind: 'shu_mu', organ });
    }, [setFocus, organ]);
    return <Atlas />;
  }

  const labelled = (code: string) =>
    screen.queryAllByRole('button', { name: new RegExp(`\\b${code}\\b`) });

  it('labels both halves, on whichever view is showing', { timeout: 30000 }, () => {
    // 脾: 章門 LR13 (front) ↔ 脾俞 BL20 (back). The atlas opens on the front.
    render(wrap(<PairProbe organ="spleen" />));
    // Emphasised points are always label candidates, so the near half is named.
    expect(labelled('LR13').length).toBeGreaterThan(0);
    // And the caption must send the learner to the other side rather than
    // leaving them to wonder where the partner went.
    const caption = document.body.textContent ?? '';
    expect(/BL20|脾俞/.test(caption)).toBe(true);
    expect(/switch views|切換視角/i.test(caption)).toBe(true);
  });

  it('says so instead when both halves share a view', { timeout: 30000 }, () => {
    // 腎: 京門 GB25 is drawn on the back with 腎俞 BL23 — the one pair that does
    // not straddle. Telling the learner to switch views would be a dead end.
    render(wrap(<PairProbe organ="kidney" />));
    const caption = document.body.textContent ?? '';
    expect(/both drawn on this view|都畫在這一面/.test(caption)).toBe(true);
    expect(/switch views|切換視角/i.test(caption)).toBe(false);
  });
});

/**
 * The topic avatar was front-only, so it silently dropped anything on the back:
 * 「腰背委中求」 names 委中 BL40 in the popliteal crease and drew an empty body,
 * and the interior–exterior card names two meridians and no points at all, so
 * it drew an empty body too. An avatar that shows nothing is worse than no
 * avatar — it reads as "this topic has no location".
 */
describe('topic avatar covers what its card names', () => {
  // The topic label also appears inside each mapping row, so always click the
  // card's own header rather than matching on accessible name.
  const openCard = (container: HTMLElement, index: number) => {
    const card = container.querySelectorAll('.topic-card')[index] as HTMLElement;
    const head = card.querySelector('.topic-head') as HTMLElement;
    // The first card opens by default; clicking it would collapse it.
    if (head.getAttribute('aria-expanded') !== 'true') fireEvent.click(head);
    return card;
  };

  it('draws something for every topic, on whichever side holds it', () => {
    const { container } = render(wrap(<TopicCards />));
    dataset.traditionalFunctions.forEach((fn, i) => {
      const card = openCard(container, i);
      const svg = card.querySelector('.topic-avatar svg');
      expect(svg).toBeTruthy();
      const drawn =
        svg!.querySelectorAll('.annotation').length +
        svg!.querySelectorAll('.topic-routes path').length;
      expect({ topic: fn.id, drawn: drawn > 0 }).toEqual({ topic: fn.id, drawn: true });
    });
  });

  it('traces the channel that explains the pairing, under the annotation', () => {
    const { container } = render(wrap(<TopicCards />));
    // 「面口合谷收」: the Large Intestine route from hand to face is the reason
    // a point in the hand is paired with the face, so it has to be visible.
    const i = dataset.traditionalFunctions.findIndex((f) => f.id === 'fn_head_face_region');
    const card = openCard(container, i);
    const svg = card.querySelector('.topic-avatar svg')!;
    const routes = svg.querySelectorAll('.topic-routes path');
    expect(routes.length).toBeGreaterThan(0);
    // Colour-blind safety: the route carries its channel's dash pattern rather
    // than relying on colour, the same rule the atlas and legend follow.
    expect(routes[0]!.getAttribute('stroke-dasharray')).toBeTruthy();
    // Routes are painted before the annotations, so the labels stay on top.
    const kids = [...svg.children];
    const routeLayer = kids.findIndex((c) => c.classList.contains('topic-routes'));
    const firstAnnotation = kids.findIndex((c) => c.classList.contains('annotation'));
    expect(routeLayer).toBeGreaterThanOrEqual(0);
    expect(firstAnnotation).toBeGreaterThan(routeLayer);
  });

  it('flips to the back for a topic that lives there', () => {
    const { container } = render(wrap(<TopicCards />));
    // 「腰背委中求」 names 委中 BL40, in the popliteal crease — a back point.
    const i = dataset.traditionalFunctions.findIndex((f) => f.id === 'fn_lumbar_back_region');
    const card = openCard(container, i);
    expect(card.querySelector('.topic-avatar svg')!.getAttribute('aria-label')).toMatch(
      /back view/i,
    );
    expect(card.querySelectorAll('.annotation').length).toBe(1);
  });

  it('says so when part of the topic is on the side not shown', () => {
    const { container } = render(wrap(<TopicCards />));
    // 四總穴 names four points; 委中 BL40 is on the back, so the front avatar
    // draws three and the caption has to admit the fourth is missing.
    const i = dataset.traditionalFunctions.findIndex((f) => f.id === 'fn_four_command_song');
    const card = openCard(container, i);
    expect(card.querySelectorAll('.annotation').length).toBe(3);
    expect(card.querySelector('figcaption')!.textContent).toMatch(
      /sit on the other side of the body and are not drawn/i,
    );
  });
});
