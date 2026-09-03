import { useState, type ReactNode } from 'react';
import { useBilingual } from '../state/store';

/**
 * The floating layer legend, shared by the atlas and the network map.
 *
 * On a wide screen it is a panel in the corner and costs nothing. On a phone it
 * was covering the thing it describes: 202px of a 375px screen, pinned over the
 * figure at full height, so the body was mostly hidden behind a list of channel
 * names. Here it collapses to its own heading and opens on a tap.
 *
 * Collapsed is the right default on a phone because the figure is the content
 * and the legend is a control. Above 640px it is always open and the toggle
 * behaves as the heading it already was, so nothing changes on desktop.
 */
export default function LegendPanel({
  titleZh,
  titleEn,
  count,
  children,
}: {
  titleZh: string;
  titleEn: string;
  count: number;
  children: ReactNode;
}) {
  const t = useBilingual();
  const [open, setOpen] = useState(false);

  return (
    <div className="viewer-legend" data-open={open}>
      <button
        type="button"
        className="legend-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="eyebrow">{t(titleZh, titleEn)}</span>
        <span className="legend-toggle-count">{count}</span>
        <span className="legend-chevron" aria-hidden="true">
          {open ? '▾' : '▸'}
        </span>
      </button>
      <div className="legend-body">{children}</div>
    </div>
  );
}
