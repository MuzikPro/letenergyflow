import { useState } from 'react';
import DetailPanel, { sheetOpenFor } from '../components/DetailPanel';
import LineStrip from '../components/LineStrip';
import NetworkMap, { NetworkOutline } from '../components/NetworkMap';
import { useBilingual, useStore } from '../state/store';

/**
 * Three ways of reading the same network.
 *
 * `split` is the default and holds both halves at once. It works because of a
 * fact the measurements turned up: the map is not too big, it is in the wrong
 * SHAPE of container. Its canvas is 980×2260 — ratio 0.434 — so in a landscape
 * frame it renders 292px wide inside 1234px and wastes 76% of the width. Give
 * it a portrait column of roughly 300×690 (ratio 0.435) and it fits almost
 * exactly, which frees the rest of the width for the strip that needs it.
 *
 * The two halves need no wiring between them: they already share `focus`. The
 * map dims every channel but the focused one, and the strip switches to the
 * channel of whatever point is focused — so tapping a station in the map moves
 * the strip, and picking a channel in the strip highlights it on the map.
 *
 * `map` and `line` keep each half available on its own.
 */

type Mode = 'split' | 'map' | 'line';

export default function NetworkView() {
  const t = useBilingual();
  // Held in the store, so following a link to the atlas and coming back returns
  // to the reading you left rather than resetting to the default.
  const { networkMode: mode, setNetworkMode: setMode, focus } = useStore();
  const [listOpen, setListOpen] = useState(false);

  if (listOpen) {
    return (
      <div className="page stack">
        <div className="row">
          <h1 style={{ fontSize: 22, flex: 1 }}>{t('路線清單', 'Line index')}</h1>
          <button type="button" className="btn small" onClick={() => setListOpen(false)}>
            {t('回到圖上', 'Back to map')}
          </button>
        </div>
        <NetworkOutline />
      </div>
    );
  }

  const modes: { id: Mode; zh: string; en: string; hint: string; hintEn: string }[] = [
    {
      id: 'split',
      zh: '總覽 ＋ 單線',
      en: 'Map + line',
      hint: '左邊看全網路，右邊看選中的那一條。',
      hintEn: 'Whole network on the left, the selected channel on the right.',
    },
    {
      id: 'map',
      zh: '路網圖',
      en: 'Overview map',
      hint: '十四條線同時顯示，可縮放平移。',
      hintEn: 'All fourteen lines at once; zoom and pan.',
    },
    {
      id: 'line',
      zh: '單線圖',
      en: 'Line strip',
      hint: '一次一條，站點依循行順序。',
      hintEn: 'One channel at a time, stations in route order.',
    },
  ];
  const active = modes.find((x) => x.id === mode)!;

  /*
   * Where the detail sheet belongs depends on what is under it.
   *
   * Over a pannable canvas — the atlas, and the overview map — floating is
   * right: the camera can move the content out from under it, and keeping it
   * in the same place on both views is the consistency worth having.
   *
   * Over the line strip it is wrong. The strip is a fixed-height band, so a
   * 380px opaque overlay hides its right-hand end permanently: scrolling moves
   * the stations but the covered region stays covered. Here the sheet joins the
   * layout instead and takes its own column — identical panel, identical side,
   * simply pushing rather than covering. The strip loses width and gains
   * scrolling, which costs nothing because it already scrolls.
   */
  const sheetPushes = mode !== 'map';

  return (
    <div
      className="net-view"
      data-sheet={sheetPushes ? 'push' : 'float'}
      /* Only the floating sheet covers the map's controls; in push mode it is a
         column of its own and there is nothing to dodge. */
      data-sheet-open={!sheetPushes && sheetOpenFor(focus) ? 'true' : 'false'}
    >
      <div className="net-bar">
        <div className="net-modes" role="tablist" aria-label={t('檢視方式', 'View mode')}>
          {modes.map((x) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={mode === x.id}
              onClick={() => setMode(x.id)}
            >
              {t(x.zh, x.en)}
            </button>
          ))}
        </div>
        <span className="secondary net-hint">{t(active.hint, active.hintEn)}</span>
      </div>

      {mode === 'split' && (
        <div className="net-split">
          <div className="net-context">
            {/* Context: the whole network, highlighting only. Tapping a station
                here drives the strip, because both read the same focus. */}
            <NetworkMap role="context" />
            <p className="secondary net-context-note">
              {t('點圖上任一站可切換右側路線', 'Tap any station to switch the line on the right')}
            </p>
          </div>
          <div className="net-detail">
            <LineStrip />
          </div>
          <div className="net-sheet-col">
            <DetailPanel />
          </div>
        </div>
      )}

      {mode === 'map' && (
        <>
          <NetworkMap />
          <DetailPanel />
          <button
            type="button"
            className="icon-btn net-list-btn"
            onClick={() => setListOpen(true)}
          >
            {t('清單檢視', 'List view')}
          </button>
        </>
      )}

      {mode === 'line' && (
        <div className="net-line-only">
          <div className="net-scroll">
            <LineStrip />
          </div>
          <div className="net-sheet-col">
            <DetailPanel />
          </div>
        </div>
      )}
    </div>
  );
}
