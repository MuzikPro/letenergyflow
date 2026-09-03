import { cleanup, render, screen, within } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { memoryStorage } from '../state/progress';
import { StoreProvider, useStore } from '../state/store';
import type { Focus } from '../state/store';
import AtlasView from '../views/AtlasView';

afterEach(cleanup);

/**
 * Which view a 奇經八脈 focus lands on.
 *
 * The subtle one. All eight at once genuinely straddles the two views, so it
 * stays where the learner already is. A SINGLE vessel must not: 督脈 keeps 24 of
 * its 29 points on the back and only the scalp handful in front, and an earlier
 * version stayed on the front and framed the head with the whole spine hidden
 * behind the figure. Caught in a real browser, pinned here.
 */

function Harness({ focus }: { focus: Focus }) {
  const { setFocus } = useStore();
  useEffect(() => {
    setFocus(focus);
  }, [setFocus, focus]);
  return <AtlasView />;
}

const wrap = (focus: Focus) =>
  render(
    <StoreProvider storage={memoryStorage()}>
      <Harness focus={focus} />
    </StoreProvider>,
  );

const currentView = () => screen.getByLabelText(/Switch body view|切換前後視圖/).textContent;

describe('奇經八脈 camera', () => {
  it('turns the figure round for a vessel whose route is on the back', { timeout: 30000 }, () => {
    wrap({ kind: 'extraordinary', vessel: '督脈' });
    expect(currentView()).toMatch(/Back|後/);
  });

  it('stays on the front for a vessel whose confluent point is there', { timeout: 30000 }, () => {
    // 衝脈 has no route loaded, so 公孫 SP4 on the front foot is the whole of it.
    wrap({ kind: 'extraordinary', vessel: '衝脈' });
    expect(currentView()).toMatch(/Front|前/);
  });

  it('does not flip for all eight, which are on both views', { timeout: 30000 }, () => {
    // The set straddles by nature; the atlas opens on the front and should stay
    // there rather than deciding one side wins.
    wrap({ kind: 'extraordinary', vessel: null });
    expect(currentView()).toMatch(/Front|前/);
  });

  it('offers the picker in the layer panel without opening a detail sheet', { timeout: 30000 }, () => {
    /*
     * The picker used to float in its own card over the figure; it now lives in
     * the legend beside the channel layers, which is the one place that answers
     * "what is drawn on this body". What must not change is that selecting a
     * vessel opens no detail sheet — nothing would render in it, and the viewer
     * controls would slide aside for a panel that never appears.
     */
    const { container } = wrap({ kind: 'extraordinary', vessel: null });
    /*
     * Scoped to the legend on purpose. The markers are buttons too and carry
     * the point's own name, so an unscoped search for 帶脈 finds 帶脈 GB26 on
     * the figure as well as the vessel chip — two different things that share a
     * name, which is the whole reason GB26 needed disambiguating in the ingest.
     */
    const legend = within(container.querySelector('.viewer-legend') as HTMLElement);
    expect(legend.getByRole('button', { name: /All eight|全部八脈/ })).toBeTruthy();
    for (const name of [/Girdle|帶脈/, /Yang Linking|陽維脈/]) {
      expect(legend.getByRole('button', { name })).toBeTruthy();
    }
    expect(container.querySelector('.sheet')).toBeNull();
    expect(container.querySelector('.atlas-view')!.getAttribute('data-sheet-open')).toBe('false');
  });
});
