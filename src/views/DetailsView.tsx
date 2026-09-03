import { useState } from 'react';
import {
  BODY_REGIONS,
  meridiansInRegion,
  pointsInRegion,
  preferredView,
  regionByKey,
  regionCamera,
} from '../data/regions';
import type { BodyViewId } from '../data/types';
import DetailLens from '../components/DetailLens';
import { useBilingual, useStore } from '../state/store';

/**
 * Region detail sessions.
 *
 * Thirteen regions, each a magnified reading of one part of the figure. The
 * regions are derived from the points' own `bodyRegion` field, and the camera
 * from their placements, so this view authors no anatomy of its own — it is a
 * way of looking at the atlas, not a second copy of it.
 */
export default function DetailsView() {
  const { detailRegion, setDetailRegion, setRoute } = useStore();
  const t = useBilingual();
  const region = detailRegion ? regionByKey(detailRegion) : undefined;

  if (region) return <RegionLens key={region.key} regionKey={region.key} />;

  return (
    <div className="page stack">
      <header className="stack" style={{ gap: 8 }}>
        <div className="eyebrow">{t('分區細部', 'Regional detail')}</div>
        <h1 style={{ margin: 0 }}>{t('十三個身體分區', 'Thirteen body regions')}</h1>
        <p className="muted" style={{ margin: 0 }}>
            {t(
              '把人體圖切成十三個分區，逐區放大檢視。每一區的取景由該區穴位的座標算出，與主圖同一份資料。',
              'The figure read one region at a time. Each frame is computed from the coordinates of that region’s own points — the same records the main atlas draws.',
          )}
        </p>
      </header>

      <ul className="region-grid">
        {BODY_REGIONS.map((r) => {
          const points = pointsInRegion(r.key);
          const channels = meridiansInRegion(r.key);
          return (
            <li key={r.key}>
              <button
                type="button"
                className="region-card"
                onClick={() => setDetailRegion(r.key)}
              >
                <span className="region-card-head">
                  <span className="primary">{t(r.nameZhHant, r.nameEn)}</span>
                  <span className="chip">{points.length}</span>
                </span>
                <span className="region-rails" aria-hidden="true">
                  {channels.map((m) => (
                    <span
                      key={m.id}
                      className="region-rail"
                      style={{ background: m.colorToken }}
                    />
                  ))}
                </span>
                <span className="muted region-landmarks">
                  {t(r.landmarksZhHant, r.landmarksEn)}
                </span>
                <span className="region-count">
                  {t(
                    `${channels.length} 條經脈經過`,
                    `${channels.length} channels pass through`,
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="muted" style={{ margin: 0 }}>
        {t(
          '分區只是檢視方式，不是解剖分界；同一條經脈會跨越數個分區。',
          'A region is a way of looking, not an anatomical boundary — a channel crosses several of them.',
        )}
      </p>

      <div className="row">
        <button type="button" className="btn" onClick={() => setRoute('atlas')}>
          {t('回到人體圖', 'Back to the atlas')}
        </button>
      </div>
    </div>
  );
}

function RegionLens({ regionKey }: { regionKey: string }) {
  const { setDetailRegion } = useStore();
  const t = useBilingual();
  const region = regionByKey(regionKey);
  const [view, setView] = useState<BodyViewId>(() => preferredView(regionKey));

  if (!region) return null;
  const box = regionCamera(regionKey, view);
  const points = pointsInRegion(regionKey);
  const onThisView = points.filter((p) => p.placements.some((pl) => pl.view === view));

  // A region with nothing on this view is a real state — the face has no back
  // placements — and the honest response is to say so, not to draw an empty box.
  if (!box) {
    return (
      <div className="page stack">
        <p className="muted">
          {t(
            `${region.nameZhHant}在${view === 'front' ? '正面' : '背面'}沒有已載入的穴位。`,
            `No loaded points for ${region.nameEn} on the ${view} view.`,
          )}
        </p>
        <div className="row">
          <button
            type="button"
            className="btn"
            onClick={() => setView(view === 'front' ? 'back' : 'front')}
          >
            {t('切換正／背面', 'Switch view')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetailLens
      box={box}
      view={view}
      titleZhHant={region.nameZhHant}
      titleEn={region.nameEn}
      points={onThisView}
      onClose={() => setDetailRegion(null)}
    >
      <button
        type="button"
        className="icon-btn"
        aria-pressed={view === 'back'}
        onClick={() => setView(view === 'front' ? 'back' : 'front')}
      >
        {view === 'front' ? t('正面', 'Front') : t('背面', 'Back')}
      </button>
    </DetailLens>
  );
}

/** Exported so a test counts regions from the source, not from a literal. */
export const REGION_COUNT = BODY_REGIONS.length;
