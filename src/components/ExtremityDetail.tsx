import { useMemo } from 'react';
import { dataset } from '../data';
import { denorm, EXTREMITIES, inExtremity, type ExtremityRegion } from '../data/atlas';
import type { BodyViewId } from '../data/types';
import DetailLens from './DetailLens';

/**
 * Zoomed detail view for one hand or foot.
 *
 * The hands and feet carry the densest cluster on the figure — 井穴, 滎穴, 輸穴
 * and the web-space points sit within a few millimetres of each other — so at
 * whole-body zoom their labels have to be dropped by the declutter pass.
 *
 * The lens itself now lives in `DetailLens`, shared with the region lessons.
 * All this decides is WHICH points the lens is about: for an extremity that is
 * simply everything inside its box, which is what it has always been.
 */
export default function ExtremityDetail({
  region,
  view,
  onClose,
}: {
  region: ExtremityRegion;
  view: BodyViewId;
  onClose: () => void;
}) {
  const points = useMemo(
    () =>
      dataset.acupoints.filter((p) => {
        const pl = p.placements.find((x) => x.view === view);
        if (!pl) return false;
        const c = denorm(pl.x, pl.y);
        return inExtremity(region, c.x, c.y);
      }),
    [region, view],
  );

  return (
    <DetailLens
      box={region.box}
      view={view}
      titleZhHant={region.labelZhHant}
      titleEn={region.labelEn}
      points={points}
      onClose={onClose}
    />
  );
}

export { EXTREMITIES };
