import type { Meridian } from '../data/types';

/**
 * Legend swatch for a meridian.
 *
 * Drawn as SVG rather than a CSS border because the palette now includes dash
 * patterns CSS `border-style` cannot express (dash-dot, long-dash). Using the
 * same dasharray vocabulary as the map keeps legend and line identical, which
 * matters because line style — not colour — is what makes the channels
 * distinguishable under colour-vision differences.
 */
export const SWATCH_DASH: Record<string, string | undefined> = {
  solid: undefined,
  dashed: '7 5',
  dotted: '0.5 5',
  dashdot: '9 4 1.5 4',
  longdash: '13 5',
  shortdash: '4 4',
  dashdotdot: '9 3.5 1.5 3.5 1.5 3.5',
  longdashdot: '15 4 1.8 4',
  finedash: '3 5',
  doubledash: '10 3.5 3.5 3.5',
  longdashdotdot: '13 3.5 1.5 3.5 1.5 3.5',
  sparsedot: '1 7',
  railroad: '2 2.5 8 2.5',
  longsolid: '22 4',
};

export default function LineSwatch({
  meridian,
  width = 26,
  dimmed = false,
}: {
  meridian: Meridian;
  width?: number;
  dimmed?: boolean;
}) {
  return (
    <svg
      width={width}
      height={8}
      viewBox={`0 0 ${width} 8`}
      aria-hidden="true"
      style={{ flex: 'none', opacity: dimmed ? 0.35 : 1, display: 'block' }}
    >
      <line
        x1={0}
        y1={4}
        x2={width}
        y2={4}
        stroke={meridian.colorToken}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeDasharray={SWATCH_DASH[meridian.lineStyle]}
      />
    </svg>
  );
}
