import { cleanup, fireEvent, render } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { dataset } from '../data';
import { EXTRAORDINARY_VESSELS } from '../data/extraordinary';
import { networkPathFor } from '../data/extraordinary-routes';
import { memoryStorage } from '../state/progress';
import { StoreProvider, useStore } from '../state/store';
import type { Focus } from '../state/store';
import NetworkMap from './NetworkMap';

afterEach(cleanup);

/**
 * 奇經八脈 on the network map.
 *
 * On this diagram a vessel is a line calling at stations that belong to other
 * lines — which is the same relationship it has on the body, and the reason it
 * can be drawn at all without inventing a station. What needs guarding is that
 * it never acquires stations of its own, and that 督脈 and 任脈 are not offered
 * twice: they are already lines here.
 */

const stationCoord = () => {
  const map = new Map<string, { x: number; y: number }>();
  for (const line of dataset.networkLines) {
    for (const s of line.stations) map.set(s.acupointId, { x: s.x, y: s.y });
  }
  return map;
};

function Harness({ focus }: { focus: Focus }) {
  const { setFocus } = useStore();
  useEffect(() => {
    setFocus(focus);
  }, [setFocus, focus]);
  return <NetworkMap />;
}

const mount = (focus: Focus = { kind: 'none' }) =>
  render(
    <StoreProvider storage={memoryStorage()}>
      <Harness focus={focus} />
    </StoreProvider>,
  );

/** Vessel lines only: keyed on the accent stroke, not the dash alone. */
const vesselLines = (c: HTMLElement) =>
  [...c.querySelectorAll('path')].filter(
    (p) =>
      p.getAttribute('stroke') === 'var(--accent)' && p.getAttribute('stroke-dasharray') === '10 7',
  );

const chip = (c: HTMLElement, label: RegExp) =>
  [...c.querySelectorAll('.viewer-legend .strip-chip')].find((b) =>
    label.test(b.textContent ?? ''),
  ) as HTMLElement;

describe('vessel lines on the map', () => {
  it('routes every vessel through stations that already exist', () => {
    // The whole reason this could be drawn: all 362 points have a station, so a
    // vessel's path is a polyline between stops the map already has.
    const coord = stationCoord();
    expect(coord.size).toBe(dataset.acupoints.length);
    for (const v of EXTRAORDINARY_VESSELS) {
      const d = networkPathFor(v.zhHant, coord);
      const stops = (d.match(/[ML]/g) ?? []).length;
      expect({ vessel: v.zhHant, stops }).toEqual({
        vessel: v.zhHant,
        stops: v.route!.crossings.length,
      });
    }
  });

  it('draws straight runs, not curves', () => {
    // The map is drawn in straight segments and right angles; a smoothed curve
    // through it would read as a different kind of object.
    const d = networkPathFor('陽維脈', stationCoord());
    expect(d).toMatch(/^M[\d.]+,[\d.]+( L[\d.]+,[\d.]+)+$/);
    expect(d).not.toContain('C');
  });

  it('offers the six that own no stations, and not the two that do', () => {
    /*
     * 督脈 and 任脈 are already lines in the list above with their own station
     * counts. Offering them here too would suggest the map holds two different
     * things for each of them.
     */
    const { container } = mount();
    for (const v of EXTRAORDINARY_VESSELS) {
      const present = Boolean(chip(container, new RegExp(v.en)));
      expect({ vessel: v.zhHant, offered: present }).toEqual({
        vessel: v.zhHant,
        offered: !v.meridian,
      });
    }
  });

  it('draws one when one is selected', () => {
    const { container } = mount({ kind: 'extraordinary', vessel: '帶脈' });
    const lines = vesselLines(container);
    expect(lines).toHaveLength(1);
    // 帶脈 calls at GB26, GB27, GB28 — three stops, so two segments.
    expect((lines[0]!.getAttribute('d')!.match(/L/g) ?? []).length).toBe(2);
  });

  it('draws all six on the toggle, and clears a selection to do it', () => {
    /*
     * A selection outranks the overlay when deciding what to draw, so without
     * clearing it the button changed but the map did not — one vessel stayed on
     * screen under a control that said "show all six".
     */
    const { container } = mount({ kind: 'extraordinary', vessel: '帶脈' });
    expect(vesselLines(container)).toHaveLength(1);
    fireEvent.click(chip(container, /Show all six|全部顯示/));
    expect(vesselLines(container)).toHaveLength(6);
  });

  it('adds no station to the map', () => {
    // A vessel calls at stops; it does not create them. If this ever grows, the
    // six have started owning points they do not have.
    const before = dataset.networkLines.reduce((n, l) => n + l.stations.length, 0);
    const { container } = mount();
    fireEvent.click(chip(container, /Show all six|全部顯示/));
    expect(dataset.networkLines.reduce((n, l) => n + l.stations.length, 0)).toBe(before);
    expect(before).toBe(dataset.acupoints.length);
  });
});
