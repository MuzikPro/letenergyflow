import { useEffect, useMemo, useRef, useState } from 'react';
import { acupointById, dataset, meridianById } from '../data';
import ExtremityDetail from './ExtremityDetail';
import { ATLAS_HEIGHT, ATLAS_WIDTH, EXTREMITIES, MERIDIAN_DASH, denorm, figureShapes, type ExtremityRegion } from '../data/atlas';
import { isSchematicPlacement, meridianLegendName, PLACEMENT_STATUS_LABELS } from '../data/types';
import type { Acupoint, BodyViewId } from '../data/types';
import { expandFunction } from '../search';
import { muShuPair, vertebralLevelOf } from '../data/specific-points';
import {
  EXTRAORDINARY_VESSELS,
  vesselByName,
  type ExtraordinaryVessel,
} from '../data/extraordinary';
import { crossingPointsOf } from '../data/extraordinary-routes';
import { CHANNEL_GROUPS, PAIRS } from '../data/channel-groups';
import { useBilingual, useStore } from '../state/store';
import LegendPanel from './LegendPanel';
import LineSwatch from './LineSwatch';
import { boundsOf, useViewport } from './useViewport';

interface AtlasProps {
  /** `locate` suppresses labels so the learner must recall the position. */
  mode?: 'browse' | 'locate';
  /** Locate mode: called with the point the learner tapped. */
  onPick?: (pointId: string) => void;
  /** Locate mode: points to reveal as feedback once answered. */
  revealPointIds?: string[];
  compact?: boolean;
  /** Opens the non-visual point index. Rendered inside the layer panel, which
      is the one place on this screen guaranteed not to sit over the figure. */
  onOpenList?: () => void;
}

interface Emphasis {
  points: Set<string>;
  meridians: Set<string>;
  primaryPoint: string | null;
}

export default function Atlas({
  mode = 'browse',
  onPick,
  revealPointIds,
  compact,
  onOpenList,
}: AtlasProps) {
  const { focus, setFocus, lang } = useStore();
  const t = useBilingual();
  const [view, setView] = useState<BodyViewId>('front');
  /**
   * Draw each bilateral channel on both sides.
   *
   * `null` means "follow the focus": ON while a single channel or a single
   * extraordinary vessel is selected, OFF otherwise. That is where mirroring
   * earns its keep — one channel on both sides is the anatomy, and costs almost
   * no clutter — while mirroring ALL of them at once takes 309 markers to 618
   * and is a deliberate "show me everything" request rather than a default.
   *
   * Pressing the button writes an explicit true/false that overrides the
   * automatic choice, and changing focus clears it so the automatic behaviour
   * re-arms. Without that reset, one press would silently govern every
   * subsequent selection.
   */
  const [mirrorOverride, setMirrorOverride] = useState<boolean | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  /**
   * Draw all eight 奇經八脈 routes as a standing layer, rather than only while
   * one is selected. Off by default — the eight are a lot of dashed line over a
   * figure already carrying twelve channels — but "all on" turns it on, because
   * twelve channels and two vessels is not the whole system.
   */
  const [showVessels, setShowVessels] = useState(false);
  const [detail, setDetail] = useState<ExtremityRegion | null>(null);
  const vp = useViewport(ATLAS_WIDTH, ATLAS_HEIGHT, 0.95, 16);
  const lastFocus = useRef<string>('');

  const emphasis = useMemo<Emphasis>(() => {
    const points = new Set<string>();
    const meridians = new Set<string>();
    let primaryPoint: string | null = null;
    if (focus.kind === 'point') {
      const p = acupointById.get(focus.pointId);
      if (p) {
        points.add(p.id);
        meridians.add(p.meridianId);
        primaryPoint = p.id;
      }
    } else if (focus.kind === 'meridian') {
      meridians.add(focus.meridianId);
      meridianById.get(focus.meridianId)?.pointOrder.forEach((id) => points.add(id));
    } else if (focus.kind === 'function') {
      const ex = expandFunction(focus.functionId);
      ex?.acupoints.forEach((p) => {
        points.add(p.id);
        meridians.add(p.meridianId);
      });
      ex?.meridians.forEach((m) => meridians.add(m.id));
    } else if (focus.kind === 'shu_mu') {
      // Both halves stay lit on both views. Only one of them is drawn at a
      // time, so the other's glow is what the front/back toggle reveals.
      const pair = muShuPair(focus.organ);
      if (pair) {
        for (const p of [pair.mu, pair.shu]) {
          points.add(p.id);
          meridians.add(p.meridianId);
        }
      }
    } else if (focus.kind === 'extraordinary') {
      /*
       * Light the 八脈交會穴 that opens each vessel, and the 交會腧穴 its line
       * runs through. For 督脈 and 任脈 the crossings ARE their own points, so
       * the channel is lit too and the existing route line does the drawing.
       */
      const wanted = focus.vessel
        ? [vesselByName(focus.vessel)].filter((v): v is ExtraordinaryVessel => Boolean(v))
        : EXTRAORDINARY_VESSELS;
      for (const v of wanted) {
        points.add(v.confluent.id);
        meridians.add(v.confluent.meridianId);
        for (const p of crossingPointsOf(v.zhHant)) points.add(p.id);
        if (v.meridian) {
          meridians.add(v.meridian.id);
          v.meridian.pointOrder.forEach((id) => points.add(id));
        }
      }
    }
    return { points, meridians, primaryPoint };
  }, [focus]);

  const placed = useMemo(() => {
    const out: { point: Acupoint; x: number; y: number; schematic: boolean }[] = [];
    for (const p of dataset.acupoints) {
      const pl = p.placements.find((x) => x.view === view);
      if (!pl) continue;
      const c = denorm(pl.x, pl.y);
      out.push({ point: p, x: c.x, y: c.y, schematic: isSchematicPlacement(pl) });
    }
    return out;
  }, [view]);

  /**
   * A validated coordinate looks different from a layout one.
   *
   * Every placement is `schematic_unvalidated` today, so nothing renders the
   * validated treatment yet — that is the honest state, not a missing feature.
   * The distinction is wired to the data so it appears the moment a coordinate
   * is actually measured, rather than needing a UI change at that point.
   */
  const anyValidated = placed.some((p) => !p.schematic);

  const placedById = useMemo(
    () => new Map(placed.map((p) => [p.point.id, p])),
    [placed],
  );

  /** One channel, or one vessel, selected — the case mirroring is for. */
  const autoMirror =
    focus.kind === 'meridian' || (focus.kind === 'extraordinary' && focus.vessel !== null);
  const showMirror = mirrorOverride ?? autoMirror;

  // Re-arm the automatic choice whenever the selection changes, so a manual
  // press applies to the thing it was pressed for and not to everything after.
  const lastMirrorFocus = useRef<string>('');
  useEffect(() => {
    const key = JSON.stringify(focus);
    if (key !== lastMirrorFocus.current) {
      lastMirrorFocus.current = key;
      setMirrorOverride(null);
    }
  }, [focus]);

  /**
   * The bilateral points, reflected across the midline.
   *
   * WHY THIS EXISTS. The figure draws each of the twelve bilateral channels
   * once, on whichever side keeps it clear of its 表裡 partner — LU left and LI
   * right, ST left and SP right, and so on. That is a legibility choice, not a
   * claim that the channel is one-sided, and a learner reasonably wants to see
   * the body as it actually is.
   *
   * A REFLECTION, NOT A RECORD. Nothing is added to the dataset: this is the
   * same 309 placements read a second time at `x' = ATLAS_WIDTH - x`. The 53
   * midline points are excluded, because CV and GV sit ON x = MID and would
   * mirror onto themselves. `placedById` deliberately does NOT include these,
   * so the camera still frames a channel by its real coordinates.
   *
   * The reflection is safe because the figure is symmetric: sampling every x in
   * `figureShapes` and looking for a partner about the midline matches 99.5% on
   * the front and 99.6% on the back, the misses being midline details whose
   * control points sample unevenly.
   */
  const mirrored = useMemo(() => {
    if (!showMirror) return [];
    return placed
      .filter(({ point }) => point.placements.find((pl) => pl.view === view)?.side !== 'midline')
      .map((p) => ({ ...p, x: ATLAS_WIDTH - p.x }));
  }, [showMirror, placed, view]);

  /** Which body view holds most of a set of points. */
  const viewHolding = (ids: string[]): BodyViewId | null => {
    const tally: Record<string, number> = {};
    for (const id of ids) {
      const v = acupointById.get(id)?.placements[0]?.view;
      if (v) tally[v] = (tally[v] ?? 0) + 1;
    }
    const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    return best ? (best[0] as BodyViewId) : null;
  };

  /* --- Search-driven camera: point → centre & magnify, meridian → fit route,
         function → fit every highlighted record. ------------------------- */
  useEffect(() => {
    // A 募俞 pair straddles the two views, so unlike every other focus it must
    // re-aim when the view flips — that flip is how the learner walks from the
    // mu point to its partner. Folding the view into the key does exactly that
    // without loosening the guard for the other kinds.
    // 奇經八脈 straddles the two views the same way — the eight confluent points
    // are spread over both, and 督脈's route is on the back while 任脈's is on
    // the front — so it re-aims on a flip for the same reason a 募俞 pair does.
    const key =
      focus.kind === 'shu_mu' || focus.kind === 'extraordinary'
        ? `${JSON.stringify(focus)}@${view}`
        : JSON.stringify(focus);
    // Only react to a NEW focus. Without this guard the auto-flip below would
    // fire on every render — including one caused by the user pressing the
    // front/back toggle — and immediately drag the view back, making the
    // toggle look broken while a back-view point was selected.
    if (key === lastFocus.current) return;
    if (focus.kind === 'none') {
      lastFocus.current = key;
      return;
    }

    const ids =
      focus.kind === 'point'
        ? [focus.pointId]
        : focus.kind === 'meridian'
          ? (meridianById.get(focus.meridianId)?.pointOrder ?? [])
          : focus.kind === 'shu_mu'
          ? (() => {
              const pair = muShuPair(focus.organ);
              return pair ? [pair.mu.id, pair.shu.id] : [];
            })()
          : focus.kind === 'extraordinary'
          ? (() => {
              const vs = focus.vessel
                ? [vesselByName(focus.vessel)].filter((v): v is ExtraordinaryVessel => Boolean(v))
                : EXTRAORDINARY_VESSELS;
              // The camera frames the whole line, not just the point that
              // opens it: focusing 督脈 should show the spine rather than 後溪
              // alone on the hand, and 陽維脈 its long climb rather than 外關.
              return vs.flatMap((v) => [
                v.confluent.id,
                ...crossingPointsOf(v.zhHant).map((p) => p.id),
                ...(v.meridian?.pointOrder ?? []),
              ]);
            })()
          : [
              ...(expandFunction(focus.functionId)?.acupoints.map((p) => p.id) ?? []),
              ...(expandFunction(focus.functionId)?.meridians.flatMap(
                (m) => m.pointOrder,
              ) ?? []),
            ];

    // A result that lives on the back — every back-shu point does — has to flip
    // the atlas over first, or the camera would centre on an empty canvas.
    // Returning without recording the key lets the effect finish on the rerun.
    // A straddling pair holds one point on each view, so `viewHolding` would be
    // breaking a 1–1 tie for no reason: whichever view you are on already shows
    // half of it. The kidney is the exception — both its halves are on the back —
    // and there the flip is needed, or the camera aims at an empty front.
    // All eight 奇經八脈 at once spreads over both views by nature, so the same
    // reasoning applies: if this view already holds some of the set, stay and
    // frame what is here rather than yanking the learner to the fuller side.
    //
    // A SINGLE vessel is the opposite case and must not stay. 督脈 keeps 24 of
    // its 29 points on the back and only the handful over the scalp in front,
    // so "this view holds some of it" was true on the front and the camera
    // settled on the head with the whole spine behind the figure. One vessel
    // therefore goes to the view actually holding it.
    const straddles =
      focus.kind === 'shu_mu' || (focus.kind === 'extraordinary' && focus.vessel === null);
    const showingHalf =
      straddles &&
      ids.some((id) => acupointById.get(id)?.placements.some((pl) => pl.view === view));
    const wanted = straddles && showingHalf ? null : viewHolding(ids);
    if (wanted && wanted !== view) {
      setView(wanted);
      // Deliberately not recording the key yet: the effect re-runs once the new
      // view's placements exist, and finishes the camera move then.
      return;
    }
    // Record the key only once the camera has actually moved. Recording it
    // before the placement lookup would mark a focus handled even when there
    // was nothing to centre on, and the guard above would then swallow the
    // retry. Defensive rather than a fix for an observed failure: placements
    // are in fact ready on the first pass, including when the atlas mounts with
    // a focus already set (a test covers that ordering).
    if (focus.kind === 'point') {
      const spot = placedById.get(focus.pointId);
      if (!spot) return;
      lastFocus.current = key;
      vp.centerOn(spot.x, spot.y, 4.6);
      return;
    }
    if (focus.kind === 'shu_mu') {
      const here = ids
        .map((id) => placedById.get(id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s));
      if (here.length === 0) return;
      lastFocus.current = key;
      // Usually exactly one half is drawn on this view, and it gets the same
      // close reading a single point focus would. The kidney is the exception —
      // 京門 is placed on the back with its own 腎俞 — so there, fit both.
      const only = here.length === 1 ? here[0] : undefined;
      if (only) vp.centerOn(only.x, only.y, 4.6);
      else vp.fitRegion(boundsOf(here, ATLAS_WIDTH * 0.22), 0.22);
      return;
    }
    const coords = ids
      .map((id) => placedById.get(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    if (coords.length === 0) return;
    lastFocus.current = key;
    vp.fitRegion(boundsOf(coords, ATLAS_WIDTH * 0.22), 0.22);
    // vp is stable enough for this effect; focus is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, placedById, view]);

  const scale = vp.scale;

  /*
   * Markers and labels are sized for a map that will eventually carry all 14
   * channels and several hundred points, so they must stay legible when dense.
   *
   * Both shrink in USER space as you zoom in (÷ scale^0.85), which keeps them
   * near-constant on SCREEN with a little growth for depth cues. The previous
   * ÷√scale grew markers to ~58px across at deep zoom, swallowing the figure.
   *
   * CJK glyphs need more height than Latin at the same pixel size to stay
   * readable, so the label base differs by the language actually being drawn.
   */
  const zoomDamp = Math.pow(scale, 0.85);
  const r = Math.min(6.5, Math.max(0.45, 4.8 / zoomDamp));
  const labelBase = lang === 'en' ? 13 : 15;
  const labelSize = Math.min(18, Math.max(1.1, labelBase / zoomDamp));

  /**
   * The 奇經八脈 lines for the current focus, on the current view.
   *
   * Pulled out because it is drawn twice — once as itself, once inside the
   * mirror transform — and two copies of this JSX would drift apart.
   */
  const shownVessels =
    focus.kind === 'extraordinary'
      ? focus.vessel
        ? EXTRAORDINARY_VESSELS.filter((v) => v.zhHant === focus.vessel)
        : EXTRAORDINARY_VESSELS
      : showVessels
        ? EXTRAORDINARY_VESSELS
        : [];

  const vesselPaths = (keyPrefix = 'qj') =>
    shownVessels
      .filter((v) => !v.meridian)
      .flatMap((v) =>
        v.paths
          .filter((p) => p.view === view)
          .map((p, i) => (
            <g key={`${keyPrefix}-${v.zhHant}-${i}`}>
              <path
                d={p.d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={9}
                strokeOpacity={0.16}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={p.d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2.6}
                strokeOpacity={0.95}
                strokeLinecap="round"
                strokeDasharray="7 5"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          )),
      );

  /**
   * 任脈 and 督脈 survive every group filter.
   *
   * They are 奇經, so they fall in neither half of 陰/陽 and neither of 手/足 —
   * "show the yang channels" has nothing to say about them. Hiding them anyway
   * would remove the two midline routes that every 「旁開 N 寸」 in the dataset is
   * measured FROM, which is the one thing a learner filtering by group still
   * needs on screen. They keep their own eyes in the list below for anyone who
   * does want them gone.
   */
  const ALWAYS_SHOWN = new Set(['mer_cv', 'mer_gv']);
  const hideAllBut = (keep: Set<string>) =>
    new Set(
      dataset.meridians.filter((m) => !keep.has(m.id) && !ALWAYS_SHOWN.has(m.id)).map((m) => m.id),
    );
  /** Is exactly this group showing, midline vessels aside? */
  const isExactly = (keep: Set<string>) =>
    dataset.meridians
      .filter((m) => !ALWAYS_SHOWN.has(m.id))
      .every((m) => keep.has(m.id) !== hidden.has(m.id));

  const showLabel = (p: Acupoint) => {
    if (mode === 'locate') return Boolean(revealPointIds?.includes(p.id));
    // Anything the current search/selection emphasises is a label candidate at
    // any zoom — a highlighted route with anonymous dots teaches nothing.
    if (emphasis.primaryPoint === p.id || emphasis.points.has(p.id)) return true;
    /*
     * With mirroring on, only the selection keeps its labels.
     *
     * Labels are the densest ink on the canvas, and mirroring is the one mode
     * that doubles the markers underneath them. Suppressing the unfocused ones
     * costs nothing in reachability — the marker, its tap target and its
     * accessible name are all untouched, so the point is still findable by
     * pointer, keyboard and screen reader; only the drawn text goes. Zooming in
     * on a mirrored figure therefore reads as a body with one channel named,
     * rather than as a page of overlapping type.
     *
     * When nothing is selected there is no selection to protect, so the normal
     * zoom rules still apply and the view is not left mute.
     */
    if (showMirror && emphasis.points.size > 0) return false;
    if (scale > 3) return true;
    if (scale > 1.9 && p.courseTier === 1) return true;
    return false;
  };

  /**
   * Map label text. Bilingual mode must show BOTH scripts here like the rest
   * of the UI — showing only 中文 made the map the one place the language
   * preference was ignored.
   */
  const labelText = (p: Acupoint) =>
    lang === 'en' ? p.code : lang === 'zh' ? p.nameZhHant : `${p.nameZhHant} ${p.code}`;

  // Collision-aware decluttering: candidates are ranked (selected point first,
  // then emphasised route members, then course tier), and any label whose box
  // would overlap an already-accepted one is dropped until the user zooms in.
  const labeledIds = (() => {
    const boxes: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const ids = new Set<string>();
    const rank = (p: Acupoint) =>
      (emphasis.primaryPoint === p.id ? 0 : emphasis.points.has(p.id) ? 1 : 2) * 10 +
      (p.courseTier ?? 3);
    const cands = placed
      .filter(({ point }) => !hidden.has(point.meridianId) && showLabel(point))
      .sort((a, b) => rank(a.point) - rank(b.point) || a.point.ordinal - b.point.ordinal);
    for (const { point, x, y } of cands) {
      const text = labelText(point);
      const w =
        labelSize *
        (0.4 + [...text].reduce((n, ch) => n + (ch.charCodeAt(0) > 0x2e80 ? 1.05 : 0.62), 0));
      const h = labelSize * 1.35;
      const x1 = x + r * 2.2;
      const y1 = y - h / 2;
      const box = { x1, y1, x2: x1 + w, y2: y1 + h };
      const hit = boxes.some(
        (b) => box.x1 < b.x2 && box.x2 > b.x1 && box.y1 < b.y2 && box.y2 > b.y1,
      );
      if (hit) continue;
      boxes.push(box);
      ids.add(point.id);
    }
    return ids;
  })();

  const dimmed = (meridianId: string) =>
    emphasis.meridians.size > 0 && !emphasis.meridians.has(meridianId);

  const captionText = () => {
    if (mode === 'locate') return t('點出目標穴位。', 'Tap the target point.');
    if (focus.kind === 'point') {
      const p = acupointById.get(focus.pointId);
      return t(
        `已置中並放大：${p?.nameZhHant ?? ''}（${p?.code ?? ''}）。鄰近穴位仍然可見。`,
        `Centred and magnified on ${p?.code ?? ''}. Neighbouring points stay visible for context.`,
      );
    }
    if (focus.kind === 'meridian') {
      const m = meridianById.get(focus.meridianId);
      return t(
        `已顯示完整路線：${m?.nameZhHant ?? ''}。其他經絡轉為背景層。`,
        `Whole route fitted: ${m?.nameEn ?? ''}. Other meridians drop to a quiet context layer.`,
      );
    }
    if (focus.kind === 'extraordinary') {
      const one = focus.vessel ? vesselByName(focus.vessel) : null;
      if (one) {
        /*
         * Two different facts, and a learner will conflate them unless the
         * sentence keeps them apart: whether the vessel OWNS points, and where
         * its line runs. 衝脈 draws a fourteen-station line and owns not one of
         * those stations.
         */
        const n = one.route?.crossings.length ?? 0;
        return one.meridian
          ? t(
              `${one.zhHant}：本資料庫收錄為完整經脈（${one.meridian.pointOrder.length} 穴），路線已顯示。八脈交會穴為${one.confluent.nameZhHant}（${one.confluent.code}），與${one.coupledWith}相配。循行：${one.route?.courseZhHant ?? ''}`,
              `${one.en} vessel: loaded as a full channel of ${one.meridian.pointOrder.length} points, and its route is drawn. Opened by ${one.confluent.code}, coupled with the ${vesselByName(one.coupledWith)?.en ?? one.coupledWith}. ${one.route?.courseEn ?? ''}`,
            )
          : one.zhHant === '帶脈'
          ? t(
              `帶脈：唯一橫行的奇經，「圍身一周，如束帶然」。腰間的環帶即此脈——實線為身前，虛線繞至身後，兩段合為一圈；環帶取帶脈 GB26 的高度與左右距離，前後深度本資料庫並無記錄，扁圓只是畫法。另有 ${n} 個交會腧穴以虛線相連。八脈交會穴為足臨泣（GB41），與陽維脈相配。`,
              `Girdle vessel: the only one that runs crosswise — 「圍身一周，如束帶然」, it encircles the body like a belt. The band at the waist is that belt: solid in front, dashed where it passes behind, closing as one loop. It takes its level and its width from 帶脈 GB26 itself; the flattening is a drawing convention, since this dataset records no front-to-back depth. Its ${n} crossing points are joined separately. Opened by GB41, coupled with the Yang Linking.`,
            )
          : t(
              `${one.zhHant}：無專屬穴位，虛線畫的是它的 ${n} 個交會腧穴——都是十二正經的穴，此脈交會於其上而不領有。八脈交會穴為${one.confluent.nameZhHant}（${one.confluent.code}），與${one.coupledWith}相配。循行：${one.route?.courseZhHant ?? ''}`,
              `${one.en} vessel: it owns no points, so the dashed line runs through its ${n} crossing points — all of them points of the twelve regular channels, which this vessel meets but does not own. Opened by ${one.confluent.code}, coupled with the ${vesselByName(one.coupledWith)?.en ?? one.coupledWith}. ${one.route?.courseEn ?? ''}`,
            );
      }
      const owning = EXTRAORDINARY_VESSELS.filter((v) => v.meridian).length;
      return t(
        `奇經八脈：八條路線全部顯示，八個八脈交會穴全部標示。其中只有${owning}條（督脈、任脈）領有自己的穴位；其餘六條無專屬穴位，虛線畫的是它們交會於十二正經的腧穴。這是結構索引，非治療建議。`,
        `The eight extraordinary vessels: all eight routes drawn, all eight confluent points lit. Only ${owning} of them — 督脈 and 任脈 — own any points; the other six own none, and their dashed lines run through the points of the twelve regular channels that they cross. A structural index, not treatment advice.`,
      );
    }
    if (focus.kind === 'shu_mu') {
      const pair = muShuPair(focus.organ);
      if (!pair) return null;
      const level = vertebralLevelOf(pair.shu);
      // Which half is in front of you right now decides what the sentence says
      // to do next, because the partner is always on the view you are not on.
      const showingMu = pair.mu.placements.some((pl) => pl.view === view);
      const showingShu = pair.shu.placements.some((pl) => pl.view === view);
      // 京門 sits on the flank behind the mid-axillary line and is drawn on the
      // back, so the kidney's two halves share a view. Saying "switch views"
      // there would send the learner to an empty side of the figure. Neither
      // half showing means the camera is mid-flip toward the view that holds
      // them both, and the same sentence is the right one to land on.
      if ((showingMu && showingShu) || (!showingMu && !showingShu)) {
        return t(
          `${pair.organ.zhHant}的募俞一對：${pair.mu.nameZhHant}（${pair.mu.code}）與${pair.shu.nameZhHant}（${pair.shu.code}）都畫在這一面，同時標示中${level ? `——背俞穴在第 ${level.slice(1)} 腰椎棘突下，旁開 1.5 寸` : ''}。這是十二對裡唯一同面的一對。此為結構對應，非治療建議。`,
          `The ${pair.organ.en} pair: ${pair.mu.code} and ${pair.shu.code} are both drawn on this view and both highlighted${level ? `. The back-shu sits at ${level}, 1.5 cun lateral` : ''}. The only one of the twelve whose halves share a view. A structural correspondence, not treatment advice.`,
        );
      }
      const near = showingMu ? pair.mu : pair.shu;
      const far = showingMu ? pair.shu : pair.mu;
      return t(
        `${pair.organ.zhHant}的募俞一對：${near.nameZhHant}（${near.code}）在${showingMu ? '前' : '後'}，已置中放大；另一半${far.nameZhHant}（${far.code}）在${showingMu ? '背面' : '正面'}，切換視角即可看到${level ? `——背俞穴在第 ${level.slice(1)} ${level[0] === 'S' ? '骶後孔' : level[0] === 'T' ? '胸椎' : '腰椎'}${level[0] === 'S' ? '的高度' : '棘突下'}，旁開 1.5 寸` : ''}。此為結構對應，非治療建議。`,
        `The ${pair.organ.en} pair: ${near.code} is on the ${showingMu ? 'front' : 'back'}, centred and magnified. Its partner ${far.code} is on the ${showingMu ? 'back' : 'front'} — switch views to see it${level ? `. The back-shu sits at ${level}, 1.5 cun lateral` : ''}. A structural correspondence, not treatment advice.`,
      );
    }
    if (focus.kind === 'function') {
      const ex = expandFunction(focus.functionId);
      return t(
        `主題「${ex?.fn.labelZhHant ?? ''}」：已標示 ${ex?.acupoints.length ?? 0} 個相關穴位、${ex?.meridians.length ?? 0} 條相關經絡（教學關聯，非治療建議）。`,
        `Topic "${ex?.fn.labelEn ?? ''}": ${ex?.acupoints.length ?? 0} related points and ${ex?.meridians.length ?? 0} meridians highlighted. Educational association, not treatment advice.`,
      );
    }
    return null;
  };

  return (
    <div className="viewer" style={compact ? { minHeight: 320 } : undefined}>
      <svg
        ref={vp.svgRef}
        viewBox={`${vp.box.x} ${vp.box.y} ${vp.box.w} ${vp.box.h}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        tabIndex={0}
        aria-label={t(
          '示意人體圖。方向鍵平移，加減號縮放，0 鍵回到全圖。',
          'Schematic body atlas. Arrow keys pan, plus and minus zoom, 0 fits the whole figure.',
        )}
        {...vp.handlers}
      >
        <g aria-hidden="true">
          {figureShapes[view].map((s, i) => {
            if (s.kind === 'circle') {
              return (
                <circle
                  key={i}
                  cx={s.cx}
                  cy={s.cy}
                  r={s.r}
                  fill="var(--figure-fill)"
                  stroke="var(--figure-line)"
                  strokeWidth={1.6}
                />
              );
            }
            if (s.kind === 'stroke') {
              // Face features and joint contours. These are landmark references
              // the learner locates points against (ST1–ST8 sit on the eye,
              // nose, mouth and jaw), so they get a stronger token than the
              // silhouette outline — at --figure-line they were invisible.
              return (
                <path
                  key={i}
                  d={s.d}
                  fill="none"
                  stroke="var(--figure-detail)"
                  strokeWidth={s.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            }
            return (
              <path
                key={i}
                d={s.d}
                fill="var(--figure-fill)"
                stroke="var(--figure-line)"
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* Meridian routes */}
        <g aria-hidden="true">
          {dataset.meridians.flatMap((m) => {
            if (hidden.has(m.id)) return [];
            // A channel can contribute more than one path per view: the modern
            // Bladder numbering doubles back up the second paravertebral line,
            // so it is drawn as separate segments rather than one zig-zag.
            const paths = m.atlasPaths.filter((p) => p.view === view);
            if (paths.length === 0) return [];
            const quiet = dimmed(m.id);
            const lit = emphasis.meridians.has(m.id);
            return paths.map((path, i) => (
              <g key={`${m.id}-${i}`}>
                {/* Selected route lights up: a soft glow underlay beneath the line. */}
                {lit && (
                  <path
                    d={path.d}
                    fill="none"
                    stroke={m.colorToken}
                    strokeWidth={10}
                    strokeOpacity={0.22}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                <path
                  d={path.d}
                  fill="none"
                  stroke={m.colorToken}
                  strokeWidth={quiet ? 1.6 : lit ? 3.5 : 3}
                  strokeOpacity={quiet ? 0.3 : 1}
                  strokeLinecap="round"
                  strokeDasharray={MERIDIAN_DASH[m.lineStyle]}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ));
          })}
        </g>

        {/*
          奇經八脈 routes. Drawn only while a vessel is focused, so nothing about
          the atlas changes for anyone not looking at them.

          Dashed, and deliberately unlike a channel line: these connect the
          vessel's 交會腧穴 and are not a course. 督脈 and 任脈 are skipped here —
          they own their points and are already drawn as channels above, so
          drawing them twice would double the line.
        */}
        {shownVessels.length > 0 && (
          <g aria-hidden="true">
            {vesselPaths()}

            {/*
              The vessels are bilateral too, so they mirror on the same terms as
              a channel — and because a single vessel focus turns mirroring on by
              itself, this is what 陽維脈 or 陰蹻脈 normally looks like: a pair of
              lines climbing both sides rather than one. 帶脈's belt is NOT
              repeated here; it already spans the midline and would only redraw
              itself.
            */}
            {showMirror && (
              <g transform={`translate(${ATLAS_WIDTH},0) scale(-1,1)`}>{vesselPaths('mirror')}</g>
            )}

            {/*
              帶脈 as a belt rather than a three-point arc.

              Every other vessel runs lengthwise and a polyline reads correctly.
              帶脈 does not: 「圍身一周，如束帶然」 — it encircles the body — and a
              short arc through GB26, GB27 and GB28 on one flank shows none of
              that. So the polyline above still draws its named crossings, and
              this draws the girdle itself.

              MEASURED AND NOT MEASURED, kept apart. The band is centred on the
              midline at 帶脈 GB26's own level and reaches exactly as far as GB26
              does on each side — both read from the point record. The vertical
              squash is a drawing convention for a circle seen nearly edge-on,
              the same kind of choice as the rest of this schematic, and asserts
              no depth: this dataset holds front and back placements only and
              knows nothing about how far through the body a point sits.

              The far half is dashed because it is behind the figure. That is
              the whole point of drawing it — the line closes.
            */}
            {shownVessels.some((v) => v.zhHant === '帶脈') &&
              (() => {
                const gb26 = placed.find((p) => p.point.code === 'GB26');
                if (!gb26) return null;
                const rx = Math.abs(gb26.x - ATLAS_WIDTH / 2);
                if (rx < 1) return null;
                const ry = rx * 0.3;
                const cx = ATLAS_WIDTH / 2;
                const cy = gb26.y;
                const near = `M${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy}`;
                const far = `M${cx - rx},${cy} A${rx},${ry} 0 0 1 ${cx + rx},${cy}`;
                return (
                  <g>
                    <path
                      d={far}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={1.8}
                      strokeOpacity={0.4}
                      strokeDasharray="3 5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={near}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={2.6}
                      strokeOpacity={0.95}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })()}
          </g>
        )}

        {/* Extremity hotspots — the hands and feet are the densest clusters on
            the figure, so each one opens its own zoomed detail view. Rendered
            beneath the markers so an individual point still wins a direct tap. */}
        {mode === 'browse' && (
          <g>
            {EXTREMITIES.map((r) => (
              <g
                key={r.id}
                className="extremity-hotspot"
                role="button"
                tabIndex={0}
                aria-label={t(
                  `放大 ${r.labelZhHant} 細部圖`,
                  `Open the ${r.labelEn} detail view`,
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setDetail(r);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setDetail(r);
                  }
                }}
              >
                <circle
                  cx={r.hotspot.x}
                  cy={r.hotspot.y}
                  r={r.hotspot.r}
                  fill="var(--accent)"
                  fillOpacity={0.001}
                  stroke="var(--accent)"
                  strokeWidth={1.2}
                  strokeDasharray="3 4"
                  strokeOpacity={0.45}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  className="hotspot-glyph"
                  x={r.hotspot.x}
                  y={r.hotspot.y + r.hotspot.r + 11}
                  textAnchor="middle"
                  fontSize={11 / zoomDamp}
                  fill="var(--accent)"
                >
                  ⤢
                </text>
              </g>
            ))}
          </g>
        )}

        {/*
          Mirrored routes.

          Done as a group transform rather than by rewriting the path data: a
          path carries no text, so reflecting the whole group is exact and
          costs nothing. `vectorEffect` keeps the stroke width honest under the
          flip. Midline paths (CV, GV) are excluded — they would land on
          themselves and double their own opacity.
        */}
        {showMirror && (
          <g transform={`translate(${ATLAS_WIDTH},0) scale(-1,1)`} aria-hidden="true">
            {dataset.meridians.flatMap((m) => {
              if (hidden.has(m.id)) return [];
              const paths = m.atlasPaths.filter((p) => p.view === view && p.side !== 'midline');
              const quiet = dimmed(m.id);
              const lit = emphasis.meridians.has(m.id);
              return paths.map((path, i) => (
                <path
                  key={`mirror-${m.id}-${i}`}
                  d={path.d}
                  fill="none"
                  stroke={m.colorToken}
                  strokeWidth={quiet ? 1.6 : lit ? 3.5 : 3}
                  strokeOpacity={quiet ? 0.3 : 1}
                  strokeLinecap="round"
                  strokeDasharray={MERIDIAN_DASH[m.lineStyle]}
                  vectorEffect="non-scaling-stroke"
                />
              ));
            })}
          </g>
        )}

        {/*
          Mirrored markers.

          Coordinates are reflected in JS rather than by a group transform, so
          nothing here comes out backwards — and they carry no label and no hit
          area on purpose. They are the SAME point as the marker opposite, not a
          second one: giving them their own tap target would let a learner tap
          the right knee and watch the camera fly to the left. The labelled,
          tappable copy stays on the side the channel is drawn.
        */}
        {showMirror && (
          <g aria-hidden="true" pointerEvents="none">
            {mirrored.map(({ point, x, y }) => {
              if (hidden.has(point.meridianId)) return null;
              const m = meridianById.get(point.meridianId);
              const quiet = dimmed(point.meridianId);
              const isRelated = emphasis.points.has(point.id);
              /*
               * Lighter than the primary, deliberately.
               *
               * The reflection is the same point seen on the other side, and
               * drawing it at full weight is what made the all-channels view a
               * wall. Three quarters of the radius, no halo unless the point is
               * part of the current selection, and a softer fill: the figure
               * still reads as symmetric, at roughly half the visual weight.
               * Shrinking the PRIMARY markers instead would have cost tap area
               * — `marker-hit` is derived from the same `r` — and would have
               * changed a view that is not too dense.
               */
              return (
                <g key={`mirror-${point.id}`}>
                  {isRelated && !quiet && (
                    <circle
                      className="marker-glow"
                      cx={x}
                      cy={y}
                      r={r * 1.9}
                      fill={m?.colorToken}
                      opacity={0.16}
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={r * 0.75}
                    fill={quiet ? 'var(--bg)' : m?.colorToken}
                    fillOpacity={quiet ? 0.35 : 0.62}
                    stroke={m?.colorToken}
                    strokeWidth={0.9}
                    strokeOpacity={quiet ? 0.25 : 0.6}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Point markers */}
        <g>
          {placed.map(({ point, x, y, schematic }) => {
            if (hidden.has(point.meridianId)) return null;
            const m = meridianById.get(point.meridianId);
            const isPrimary = emphasis.primaryPoint === point.id;
            const isRelated = emphasis.points.has(point.id);
            const quiet = dimmed(point.meridianId);
            const label =
              lang === 'en' && point.nameEn
                ? `${point.nameEn} ${point.code}`
                : `${point.nameZhHant} ${point.code}`;
            // Only say it in the accessible name where it is news: with every
            // coordinate schematic, repeating it 251 times is noise.
            const coordNote =
              anyValidated && !schematic
                ? ` — ${t(
                    PLACEMENT_STATUS_LABELS[
                      point.placements.find((pl) => pl.view === view)!.status
                    ].short.zhHant,
                    PLACEMENT_STATUS_LABELS[
                      point.placements.find((pl) => pl.view === view)!.status
                    ].short.en,
                  )}`
                : '';
            return (
              <g key={point.id}>
                {/* Soft glow ring — the marker's halo, brighter when emphasised. */}
                {!quiet && (
                  <circle
                    className="marker-glow"
                    cx={x}
                    cy={y}
                    r={isPrimary ? r * 2.8 : isRelated ? r * 2.2 : r * 1.9}
                    fill={m?.colorToken}
                    opacity={isPrimary ? 0.26 : isRelated ? 0.2 : 'var(--glow)'}
                  />
                )}
                {isPrimary && (
                  <circle
                    className="marker-pulse"
                    cx={x}
                    cy={y}
                    r={r * 2.6}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={1.6}
                    strokeOpacity={0.75}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                <circle
                  aria-hidden="true"
                  cx={x}
                  cy={y}
                  r={isPrimary ? r * 1.7 : isRelated ? r * 1.3 : r}
                  fill={isRelated ? m?.colorToken : 'var(--bg)'}
                  fillOpacity={quiet ? 0.35 : 1}
                  stroke={m?.colorToken}
                  strokeWidth={isPrimary ? 2.6 : 1.8}
                  strokeOpacity={quiet ? 0.4 : 1}
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                />
                {/* A measured coordinate fills its centre; a layout coordinate
                    stays hollow. Nothing renders this today — every placement is
                    still schematic — but it is wired to the data, not to a flag. */}
                {!schematic && (
                  <circle
                    className="marker-validated"
                    aria-hidden="true"
                    cx={x}
                    cy={y}
                    r={r * 0.45}
                    fill={m?.colorToken}
                    fillOpacity={quiet ? 0.4 : 1}
                    pointerEvents="none"
                  />
                )}
                {/* Invisible enlarged hit area — a finger-sized tap target even
                    when the visible marker is only a few pixels at fit zoom. */}
                <circle
                  className="marker-hit"
                  cx={x}
                  cy={y}
                  r={r * 2.4}
                  fill="transparent"
                  stroke="none"
                  tabIndex={0}
                  role="button"
                  aria-label={`${label}${coordNote}${isPrimary ? ' — selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mode === 'locate') onPick?.(point.id);
                    else setFocus({ kind: 'point', pointId: point.id });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      if (mode === 'locate') onPick?.(point.id);
                      else setFocus({ kind: 'point', pointId: point.id });
                    }
                  }}
                >
                  {mode === 'browse' && <title>{label}</title>}
                </circle>
                {labeledIds.has(point.id) && (
                  <text
                    className="marker-label"
                    x={x + r * 2.2}
                    y={y + labelSize * 0.35}
                    fontSize={labelSize}
                    fill="var(--text)"
                    stroke="var(--bg)"
                    // Halo must scale with the glyph; the stylesheet's fixed
                    // 3px would swallow a label once zoomed in.
                    strokeWidth={labelSize * 0.3}
                    style={{ fontWeight: isPrimary ? 700 : 600 }}
                  >
                    {labelText(point)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <LegendPanel titleZh="經絡圖層" titleEn="Meridian layers" count={dataset.meridians.length}>
        {/*
          Group filters.

          Fourteen rows of eyes could only ever be switched one at a time, and
          the questions a learner actually asks of this figure are group-shaped:
          show me the yang channels, show me what runs on the arm, show me this
          couple. Every grouping is derived from the reviewed channel names in
          `channel-groups.ts` — nothing here is a second list to maintain.

          A group button SETS the visible set rather than adding to it, and
          pressing the group that is already showing restores all fourteen. That
          makes it a filter you can always get out of with one press.
        */}
        <div className="legend-groups">
          <div className="legend-group-row">
            <button
              type="button"
              className="strip-chip"
              onClick={() => {
                setHidden(new Set());
                setShowVessels(true);
              }}
            >
              {t('全開', 'All on')}
            </button>
            <button
              type="button"
              className="strip-chip"
              onClick={() => {
                setHidden(new Set(dataset.meridians.map((m) => m.id)));
                setShowVessels(false);
              }}
            >
              {t('全關', 'All off')}
            </button>
            {/*
              The eight belong in this row, not below it. Without them "all on"
              turns on twelve channels and two vessels — a part of the system
              presented as the whole of it. Turning them on here draws all eight
              routes whether or not one is selected, so the figure can show the
              regular channels and the 奇經 together.
            */}
            <button
              type="button"
              className={`strip-chip${showVessels ? ' active' : ''}`}
              aria-pressed={showVessels}
              onClick={() => setShowVessels((v) => !v)}
            >
              {t('含奇經八脈', 'With vessels')}
            </button>
          </div>
          {[CHANNEL_GROUPS.slice(0, 4), CHANNEL_GROUPS.slice(4)].map((row, i) => (
            <div className="legend-group-row" key={i}>
              {row.map((g) => {
                const ids = new Set(g.members.map((m) => m.id));
                const showingExactly = isExactly(ids);
                return (
                  <button
                    key={g.id}
                    type="button"
                    className={`strip-chip${showingExactly ? ' active' : ''}`}
                    aria-pressed={showingExactly}
                    title={g.members.map((m) => m.code).join(' · ')}
                    onClick={() => setHidden(showingExactly ? new Set() : hideAllBut(ids))}
                  >
                    {t(g.zhHant, g.en)}
                  </button>
                );
              })}
            </div>
          ))}
          {/*
            表裡 couples. Not another two-way split — 表 IS the yang half and 裡
            the yin half, so a 表/裡 pair of buttons would duplicate 陽經/陰經
            exactly. What the pairing gives instead is the six couples, which is
            the thing 陰陽 cannot express.
          */}
          <div className="legend-group-label">{t('表裡配對', 'Interior–exterior pairs')}</div>
          <div className="legend-group-row">
            {PAIRS.map((p) => {
              const ids = new Set([p.yin.id, p.yang.id]);
              const showingExactly = isExactly(ids);
              return (
                <button
                  key={p.yin.id}
                  type="button"
                  className={`strip-chip${showingExactly ? ' active' : ''}`}
                  aria-pressed={showingExactly}
                  title={t(
                    `${p.yin.nameZhHant}（裡）與${p.yang.nameZhHant}（表）`,
                    `${p.yin.nameEn} (interior) with ${p.yang.nameEn} (exterior)`,
                  )}
                  onClick={() => setHidden(showingExactly ? new Set() : hideAllBut(ids))}
                >
                  {p.yin.code}·{p.yang.code}
                </button>
              );
            })}
          </div>
        </div>

        {dataset.meridians.map((m) => {
          const isHidden = hidden.has(m.id);
          const selected = focus.kind === 'meridian' && focus.meridianId === m.id;
          return (
            <div key={m.id} className="legend-line">
              {/* Row selects the meridian: the camera fits the whole route and
                  the line lights up. Clicking again deselects. */}
              <button
                type="button"
                className="legend-row"
                aria-pressed={selected}
                onClick={() => {
                  if (isHidden) {
                    setHidden((prev) => {
                      const next = new Set(prev);
                      next.delete(m.id);
                      return next;
                    });
                  }
                  setFocus(selected ? { kind: 'none' } : { kind: 'meridian', meridianId: m.id });
                }}
              >
                <LineSwatch meridian={m} dimmed={isHidden} />
                <span
                  className="legend-name"
                  style={{ opacity: isHidden ? 0.45 : 1 }}
                  title={`${m.code} · ${t(m.nameZhHant, m.nameEn)}`}
                >
                  {meridianLegendName(m, lang).primary}
                  {meridianLegendName(m, lang).secondary && (
                    <span className="legend-name-alt">
                      {meridianLegendName(m, lang).secondary}
                    </span>
                  )}
                </span>
              </button>
              <button
                type="button"
                className="legend-eye"
                aria-pressed={!isHidden}
                aria-label={
                  isHidden
                    ? t(`顯示 ${m.code} 圖層`, `Show ${m.code} layer`)
                    : t(`隱藏 ${m.code} 圖層`, `Hide ${m.code} layer`)
                }
                onClick={() =>
                  setHidden((prev) => {
                    const next = new Set(prev);
                    if (next.has(m.id)) next.delete(m.id);
                    else next.add(m.id);
                    return next;
                  })
                }
              >
                {isHidden ? '◌' : '●'}
              </button>
            </div>
          );
        })}
        {/*
          奇經八脈, in the same panel as everything else it competes with.

          It used to float in its own card over the figure, which meant two
          different places to go for "what is drawn on this body". These select
          a vessel rather than hiding a layer — the eight are a highlight, not a
          layer — so they are kept visually apart from the rows above.
        */}
        <div className="legend-group-label" style={{ marginTop: 8 }}>
          {t('奇經八脈', 'Extraordinary vessels')}
        </div>
        <div className="legend-groups">
          <div className="legend-group-row">
            <button
              type="button"
              className={`strip-chip${
                focus.kind === 'extraordinary' && focus.vessel === null ? ' active' : ''
              }`}
              aria-pressed={focus.kind === 'extraordinary' && focus.vessel === null}
              onClick={() =>
                setFocus(
                  focus.kind === 'extraordinary' && focus.vessel === null
                    ? { kind: 'none' }
                    : { kind: 'extraordinary', vessel: null },
                )
              }
            >
              {t('全部八脈', 'All eight')}
            </button>
          </div>
          {[EXTRAORDINARY_VESSELS.slice(0, 4), EXTRAORDINARY_VESSELS.slice(4)].map((row, i) => (
            <div className="legend-group-row" key={i}>
              {row.map((v) => {
                const on = focus.kind === 'extraordinary' && focus.vessel === v.zhHant;
                return (
                  <button
                    key={v.zhHant}
                    type="button"
                    className={`strip-chip${on ? ' active' : ''}`}
                    aria-pressed={on}
                    title={
                      v.meridian
                        ? t(
                            `${v.zhHant}——領有自己的穴位（${v.meridian.pointOrder.length} 穴），交會穴 ${v.confluent.code}`,
                            `${v.en} — owns ${v.meridian.pointOrder.length} points of its own; opened by ${v.confluent.code}`,
                          )
                        : t(
                            `${v.zhHant}——無專屬穴位，交會於十二正經的 ${v.route?.crossings.length ?? 0} 穴，交會穴 ${v.confluent.code}`,
                            `${v.en} — owns no points; crosses ${v.route?.crossings.length ?? 0} points of the twelve; opened by ${v.confluent.code}`,
                          )
                    }
                    onClick={() =>
                      setFocus(on ? { kind: 'none' } : { kind: 'extraordinary', vessel: v.zhHant })
                    }
                  >
                    {t(v.zhHant, v.en)}
                    {v.meridian ? ' ·' : ''}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {onOpenList && (
          <div className="legend-group-row" style={{ marginTop: 8 }}>
            <button type="button" className="strip-chip" onClick={onOpenList}>
              {t('清單檢視', 'List view')} →
            </button>
          </div>
        )}

        <div className="faint" style={{ marginTop: 6 }}>
          {t(
            '每條經僅畫在單側以利辨識；實際為兩側對稱，可用「對稱」鈕顯示另一側。標「·」的兩條奇經領有自己的穴位。',
            'Each meridian is drawn on one side for legibility; all are bilateral, and the Mirror button shows the other side. The two vessels marked “·” own points of their own.',
          )}
        </div>
      </LegendPanel>

      <div className="viewer-toolbar">
        <button
          type="button"
          className="icon-btn"
          onClick={() => setView((v) => (v === 'front' ? 'back' : 'front'))}
          aria-label={t('切換前後視圖', 'Switch body view')}
        >
          {view === 'front' ? t('前', 'Front') : t('後', 'Back')}
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-pressed={showMirror}
          onClick={() => setMirrorOverride(!showMirror)}
          aria-label={t('左右對稱顯示', 'Mirror bilateral channels')}
          title={t(
            '十二經與奇經八脈皆為左右對稱。圖上每條只畫一側，以免與其表裡經重疊；選取單一經脈或單一奇經時自動開啟，其餘情況可手動切換。',
            'The twelve channels and the extraordinary vessels are all bilateral. The figure draws each on one side to keep it clear of its paired channel. This turns on by itself while a single channel or vessel is selected, and can be toggled by hand otherwise.',
          )}
        >
          {t('對稱', 'Mirror')}
        </button>
        <button type="button" className="icon-btn" onClick={() => vp.zoomBy(1.4)} aria-label="Zoom in">
          +
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => vp.zoomBy(1 / 1.4)}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            vp.fitAll();
            setFocus({ kind: 'none' });
          }}
          aria-label={t('重設視圖', 'Reset view')}
        >
          {t('全圖', 'Fit')}
        </button>
      </div>

      {captionText() && <div className="viewer-caption">{captionText()}</div>}

      {detail && (
        <ExtremityDetail region={detail} view={view} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}
