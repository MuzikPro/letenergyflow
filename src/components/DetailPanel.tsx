import type { CSSProperties, ReactNode } from 'react';
import { acupointById, dataset, meridianById } from '../data';
import { CLASSIFICATION_LABELS, PLACEMENT_STATUS_LABELS } from '../data/types';
import type { PointClassification, Provenanced, ReviewStatus } from '../data/types';
import { INDICATION_CHANNELS, MODEL_SOURCE_ID } from '../data/indications';
import { vesselByName } from '../data/extraordinary';
import { crossingPointsOf } from '../data/extraordinary-routes';
import { expandFunction } from '../search';
import type { Focus } from '../state/store';
import { useBilingual, useStore } from '../state/store';

const REVIEW_LABEL: Record<ReviewStatus, { zh: string; en: string }> = {
  unreviewed: { zh: '尚未審核', en: 'Unreviewed' },
  source_checked: { zh: '已核對來源', en: 'Source checked' },
  expert_reviewed: { zh: '專家已審核', en: 'Expert reviewed' },
};

function ReviewChip({ status }: { status: ReviewStatus }) {
  const t = useBilingual();
  const l = REVIEW_LABEL[status];
  return (
    <span className={status === 'expert_reviewed' ? 'chip accent' : 'chip warn'}>
      {t(l.zh, l.en)}
    </span>
  );
}

/** Six text-size steps for the detail sheet; step 0 is the design default. */
export const FONT_SCALE_FACTORS = [1, 1.15, 1.3, 1.45, 1.6, 1.8] as const;

function FontControls() {
  const t = useBilingual();
  const { fontScale, setFontScale } = useStore();
  return (
    <div className="row" style={{ gap: 4, flexWrap: 'nowrap' }}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setFontScale(fontScale - 1)}
        disabled={fontScale <= 0}
        aria-label={t('縮小文字', 'Smaller text')}
        style={{ minWidth: 32, height: 32, fontSize: 11, opacity: fontScale <= 0 ? 0.4 : 1 }}
      >
        A−
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setFontScale(fontScale + 1)}
        disabled={fontScale >= FONT_SCALE_FACTORS.length - 1}
        aria-label={t('放大文字', 'Larger text')}
        style={{
          minWidth: 32,
          height: 32,
          fontSize: 13,
          opacity: fontScale >= FONT_SCALE_FACTORS.length - 1 ? 0.4 : 1,
        }}
      >
        A＋
      </button>
    </div>
  );
}

/** Single pointer to the central sources / disclaimer page. */
function SourcesLink() {
  const t = useBilingual();
  const { setRoute } = useStore();
  return (
    <div className="field">
      <button type="button" className="btn small ghost" onClick={() => setRoute('about')}>
        {t('來源與聲明', 'Sources & disclaimer')} →
      </button>
    </div>
  );
}

/**
 * Per-record status line. Full provenance (source ids, citations, exclusion
 * records, translation caveats) stays in the DATA for traceability, but is not
 * repeated in every sheet — it is stated once on the Sources & disclaimer page.
 * Only a record-specific warning is surfaced here.
 */
function Provenance({ p }: { p: { sourceIds: string[]; reviewStatus: ReviewStatus; notes: string | null } }) {
  const t = useBilingual();
  const { setRoute } = useStore();
  /*
   * "Unsourced" is a different thing from "unreviewed", and the difference is
   * the whole reason the model-written source id exists. Every other claim in
   * this app was read out of a document somebody could open and check; this
   * one was not, and saying only "not yet checked" would flatten that into the
   * same sentence as a GB/T citation awaiting expert review.
   */
  if (p.sourceIds.includes(MODEL_SOURCE_ID)) {
    /*
     * One mark, the same on every point, rather than the paragraph repeated.
     * 609 of the 722 fields are unsourced, so spelling the warning out beside
     * each one buried the content it was warning about — and a caution the
     * reader has learned to scroll past has stopped working. The mark carries
     * the meaning; the sentence lives once, on the disclaimer page, and this
     * goes there.
     */
    return (
      <div className="provenance">
        <button
          type="button"
          className="chip warn unsourced-mark"
          onClick={() => setRoute('about')}
          /* Points at the explanation rather than restating it: the sentence
             is supposed to exist in one place, and a tooltip is a second one. */
          title={t('按此看「無出處」的說明', 'What “No source” means — open the explanation')}
        >
          {t('無出處', 'No source')}
        </button>
      </div>
    );
  }
  if (p.reviewStatus !== 'unreviewed') return null;
  return (
    <div className="provenance">
      {t('此項尚未與權威來源核對。', 'Not yet checked against an authoritative source.')}
    </div>
  );
}

function Field({
  label,
  claim,
  render,
  missingText,
}: {
  label: string;
  claim: Provenanced<unknown> | null;
  render: (value: never) => ReactNode;
  missingText: string;
}) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      {claim ? (
        <>
          <div>{render(claim.value as never)}</div>
          <Provenance p={claim} />
        </>
      ) : (
        <div className="field-missing">{missingText}</div>
      )}
    </div>
  );
}

/**
 * Whether DetailPanel will actually draw a sheet for this focus.
 *
 * The sheet floats over the right-hand third of the canvas on a wide screen,
 * exactly where the zoom and front/back controls live — so the view has to know
 * a sheet is coming in order to move them out from under it. Deriving that from
 * the same conditions the component returns on keeps the two from drifting: a
 * focus kind that grows a sheet later gets the dodge for free, and one that does
 * not (a 募俞 pair says its piece in the atlas caption) never shifts the
 * controls for a panel that never appears.
 */
export function sheetOpenFor(focus: Focus): boolean {
  if (focus.kind === 'point') return acupointById.has(focus.pointId);
  if (focus.kind === 'meridian') return meridianById.has(focus.meridianId);
  if (focus.kind === 'function') return expandFunction(focus.functionId) !== null;
  /*
   * A single vessel has a subject to describe — its 循行, its 主要病候, the
   * crossings its line runs through — so it opens a sheet like a channel does.
   * All eight at once does not: there is no one thing the panel would be about,
   * and the atlas caption already says what the layer is showing.
   */
  if (focus.kind === 'extraordinary') return focus.vessel !== null && vesselByName(focus.vessel) !== null;
  return false;
}

export default function DetailPanel() {
  const { focus, setFocus, lang, fontScale } = useStore();
  const sheetStyle = {
    '--fs': String(FONT_SCALE_FACTORS[fontScale] ?? 1),
  } as CSSProperties;
  const t = useBilingual();
  /** The name in the script the UI is NOT currently showing (null in bilingual mode). */
  const otherName = (zh: string, en: string | null) =>
    lang === 'en' ? zh : lang === 'zh' ? en : null;

  if (focus.kind === 'none') return null;

  const close = () => setFocus({ kind: 'none' });

  if (focus.kind === 'point') {
    const p = acupointById.get(focus.pointId);
    if (!p) return null;
    const m = meridianById.get(p.meridianId);
    const relatedFns = dataset.functionRelations.filter(
      (r) => r.targetType === 'acupoint' && r.targetId === p.id,
    );
    return (
      <aside className="sheet" style={sheetStyle} aria-label={t('穴位詳情', 'Point details')}>
        <div className="sheet-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row" style={{ gap: 6, marginBottom: 4 }}>
              <span className="chip code">{p.code}</span>
              <ReviewChip status={p.reviewStatus} />
              {p.courseTier === 1 && <span className="chip">{t('必背', 'Core')}</span>}
            </div>
            <h3>{t(p.nameZhHant, p.nameEn ?? '')}</h3>
            {/* Deliberately terse: the channel and the point's place along it.
                Pinyin and the other-script name are dropped in single-language
                modes so the header stays scannable. */}
            <div className="faint">
              {lang === 'zh'
                ? `${m?.nameZhHant ?? ''} · 第 ${p.ordinal} 穴`
                : lang === 'en'
                  ? `${m?.nameEn ?? ''} · point ${p.ordinal} of ${m?.pointOrder.length ?? 0}`
                  : `${m?.nameZhHant ?? ''} · 第 ${p.ordinal} 穴　${m?.nameEn ?? ''} · point ${p.ordinal} of ${m?.pointOrder.length ?? 0}`}
            </div>
          </div>
          <FontControls />
          <button type="button" className="icon-btn" onClick={close} aria-label={t('關閉', 'Close')}>
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <Field
            label={t('定位（地標描述）', 'Location (landmark description)')}
            claim={p.location}
            missingText={t(
              '此穴的定位尚未從任何來源記錄，因此不顯示。不會以推測填補。',
              'No location has been recorded from a source for this point, so none is shown. Nothing is filled in by guesswork.',
            )}
            render={(v: { zhHant: string; en: string }) => t(v.zhHant, v.en)}
          />

          <Field
            label={t('特定穴分類', 'Point classifications')}
            claim={p.classifications}
            /* "reviewed and there is none" is not the same as "nobody has
               looked yet". 天池 PC1 and 三陽絡 TE8 are both deliberate NONEs
               from the editorial pass; rendering them as pending would
               misreport a decision as an omission. */
            missingText={
              p.reviewStatus === 'unreviewed'
                ? t('尚未記錄。', 'None recorded yet.')
                : t('無（經編審確認此穴無特定穴分類）。', 'None — confirmed by the editorial pass.')
            }
            render={(v: PointClassification[]) => (
              <div className="row">
                {v.map((c) => (
                  <span key={c} className="chip">
                    {t(CLASSIFICATION_LABELS[c].zhHant, CLASSIFICATION_LABELS[c].en)}
                  </span>
                ))}
              </div>
            )}
          />

          {/*
            功效 and 主治, carried from 2026-08-13 at the owner's decision.
            The framing sits INSIDE the block rather than once at the top of the
            sheet: this is the one part of a point record that could be mistaken
            for advice, and a caveat the reader has already scrolled past is not
            a caveat. Each field also shows its own provenance, so "the owner's
            study table says so" never reads as "a standard says so".
          */}
          {/*
            Shown for every point of an ingested channel, including one where
            both fields are empty. 乳中 ST17 is the case: its source treats it
            as a landmark rather than a point to use, so it has nothing to
            carry — and hiding the block there would make "the source says
            nothing" look identical to "this channel has not been read yet".
          */}
          {INDICATION_CHANNELS.includes(p.meridianId) && (
            <div className="field field-traditional">
              <div className="field-label">
                {t('傳統功效與主治', 'Traditional actions and indications')}
              </div>
              <p className="faint indications-framing">
                {t(
                  '以下是傳統教材的說法，用於認識這套體系怎麼教，不是療效證據，也不是針對任何人健康狀況的建議。本專案不提供診斷或選穴處方；有健康問題請諮詢合格醫療專業人員。',
                  'What the traditional teaching says, recorded so you can learn how this system describes itself. It is not evidence of effect and not advice for anyone’s health situation. This project does not diagnose or prescribe points; for a health concern, consult a qualified professional.',
                )}
              </p>
              {p.actions ? (
                <div style={{ marginBottom: 8 }}>
                  <div className="faint">{t('功效', 'Actions')}</div>
                  <div>{t(p.actions.value.zhHant, p.actions.value.en)}</div>
                  <Provenance p={p.actions} />
                </div>
              ) : (
                <div style={{ marginBottom: 8 }}>
                  <div className="faint">{t('功效', 'Actions')}</div>
                  <div className="faint">
                    {t(
                      '已收錄的來源沒有記錄此穴的功效。不以推測補上。',
                      'No ingested source records an action for this point. Nothing is filled in by guesswork.',
                    )}
                  </div>
                </div>
              )}
              {p.indications ? (
                <div>
                  <div className="faint">{t('主治', 'Indications')}</div>
                  <div>{t(p.indications.value.zhHant, p.indications.value.en)}</div>
                  <Provenance p={p.indications} />
                </div>
              ) : (
                <div>
                  <div className="faint">{t('主治', 'Indications')}</div>
                  <div className="faint">
                    {t(
                      '已收錄的來源沒有記錄此穴的主治。不以推測補上。',
                      'No ingested source records an indication for this point. Nothing is filled in by guesswork.',
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {p.memoryCues.length > 0 && (
            <div className="field">
              <div className="field-label">{t('記憶提示（非醫學主張）', 'Memory cues (not medical claims)')}</div>
              {p.memoryCues.map((c, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div>{t(c.value.zhHant, c.value.en)}</div>
                  <Provenance p={c} />
                </div>
              ))}
            </div>
          )}

          {/* The long schematic-coordinate caveat is stated once, centrally, on
              the Sources & disclaimer page. What belongs HERE is this point's
              own marker status, because it is per-point data and will stop
              being uniform as coordinates get measured. */}
          {p.placements[0] && (
            <div className="field">
              <div className="field-label">{t('圖上座標狀態', 'Marker coordinate status')}</div>
              <div className="row" style={{ alignItems: 'baseline', gap: 8 }}>
                <span
                  className={
                    p.placements[0].status === 'expert_reviewed' ? 'chip accent' : 'chip warn'
                  }
                >
                  {t(
                    PLACEMENT_STATUS_LABELS[p.placements[0].status].short.zhHant,
                    PLACEMENT_STATUS_LABELS[p.placements[0].status].short.en,
                  )}
                </span>
                <span className="secondary" style={{ flex: 1 }}>
                  {t(
                    PLACEMENT_STATUS_LABELS[p.placements[0].status].zhHant,
                    PLACEMENT_STATUS_LABELS[p.placements[0].status].en,
                  )}
                </span>
              </div>
            </div>
          )}
          {relatedFns.length > 0 && (
            <div className="field">
              <div className="field-label">
                {t('相關教學主題', 'Related teaching topics')}
              </div>
              {relatedFns.map((r) => {
                const fn = dataset.traditionalFunctions.find((f) => f.id === r.functionId);
                if (!fn) return null;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className="btn small ghost"
                    style={{ marginRight: 6, marginBottom: 6 }}
                    onClick={() => setFocus({ kind: 'function', functionId: fn.id })}
                  >
                    {t(fn.labelZhHant, fn.labelEn)}
                  </button>
                );
              })}
              <div className="provenance">
                {t(
                  '這些是傳統教學上的記憶連結，不是治療建議。',
                  'These are traditional teaching associations for memorisation, not treatment advice.',
                )}
              </div>
            </div>
          )}

          <div className="field">
            <button
              type="button"
              className="btn small"
              onClick={() => m && setFocus({ kind: 'meridian', meridianId: m.id })}
            >
              {t('顯示完整經絡路線', 'Show the whole meridian route')}
            </button>
          </div>
          <SourcesLink />
        </div>
      </aside>
    );
  }

  if (focus.kind === 'extraordinary' && focus.vessel) {
    const v = vesselByName(focus.vessel);
    if (!v) return null;
    const crossings = crossingPointsOf(v.zhHant);
    return (
      <aside className="sheet" style={sheetStyle} aria-label={t('奇經詳情', 'Vessel details')}>
        <div className="sheet-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row" style={{ gap: 6, marginBottom: 4 }}>
              <span className="chip code">{v.confluent.code}</span>
              <span className="chip warn">{t('尚未審核', 'Unreviewed')}</span>
            </div>
            <h3>{t(v.zhHant, v.en)}</h3>
            <div className="faint">{otherName(v.zhHant, v.en)}</div>
          </div>
          <FontControls />
          <button type="button" className="icon-btn" onClick={close} aria-label={t('關閉', 'Close')}>
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <div className="field">
            <div className="field-label">{t('穴位歸屬', 'Does it own points?')}</div>
            <div>
              {v.meridian
                ? t(
                    `領有自己的穴位，本專案載入 ${v.meridian.pointOrder.length} 穴。`,
                    `Yes — loaded here as a full channel of ${v.meridian.pointOrder.length} points.`,
                  )
                : t(
                    '無專屬穴位。此脈交會於十二正經的腧穴之上，圖上的虛線即連接這些交會腧穴。',
                    'No. This vessel crosses points belonging to the twelve regular channels; the dashed line on the atlas joins those crossing points.',
                  )}
            </div>
          </div>
          {v.route && (
            <>
              <div className="field">
                <div className="field-label">{t('循行路線', 'Course')}</div>
                <div>{t(v.route.courseZhHant, v.route.courseEn)}</div>
                <div className="faint" style={{ marginTop: 4 }}>
                  {t(
                    '出處：擁有者提供之參考資料（未審核）。英文為本專案自譯。',
                    'Source: the owner’s reference file, unreviewed. English is this project’s own translation.',
                  )}
                </div>
              </div>
              {v.route.classicalZhHant && (
                <div className="field">
                  <div className="field-label">{t('《奇經八脈考》', '《奇經八脈考》')}</div>
                  <div lang="zh-Hant">{v.route.classicalZhHant}</div>
                  <div className="faint" style={{ marginTop: 4 }}>
                    {t(
                      '明·李時珍（1578）。與上方近代教材用語並列而不合併——兩者的交會腧穴確有出入。',
                      'Li Shizhen, 1578. Kept beside the modern textbook wording above rather than merged into it: the two genuinely differ on which points each vessel crosses.',
                    )}
                  </div>
                </div>
              )}
              <div className="field">
                <div className="field-label">{t('主要病候', 'Associated patterns')}</div>
                <div>{t(v.route.signsZhHant, v.route.signsEn)}</div>
                <div className="faint" style={{ marginTop: 4 }}>
                  {t(
                    '傳統記載，教育用途；非診斷、非治療建議。',
                    'A traditional association, recorded for study. Not a diagnosis and not treatment advice.',
                  )}
                </div>
              </div>
            </>
          )}
          <div className="field">
            <div className="field-label">{t('八脈交會穴', 'Confluent point')}</div>
            <button
              type="button"
              className="btn small ghost"
              onClick={() => setFocus({ kind: 'point', pointId: v.confluent.id })}
            >
              {v.confluent.code} · {t(v.confluent.nameZhHant, v.confluent.nameEn ?? '')}
            </button>
            <div className="faint" style={{ marginTop: 4 }}>
              {t(`與${v.coupledWith}相配`, `Coupled with the ${v.coupledWith}`)}
            </div>
          </div>
          <div className="field">
            <div className="field-label">
              {t(`交會腧穴（${crossings.length}）`, `Crossing points (${crossings.length})`)}
            </div>
            <ol className="list-reset" style={{ display: 'grid', gap: 2 }}>
              {crossings.map((p, i) => (
                <li key={`${v.zhHant}-${p.id}`}>
                  <button
                    type="button"
                    className="search-item"
                    style={{ paddingLeft: 4, paddingRight: 4 }}
                    onClick={() => setFocus({ kind: 'point', pointId: p.id })}
                  >
                    <span className="chip code">{p.code}</span>
                    <span className="grow">
                      <span className="primary">{t(p.nameZhHant, p.nameEn ?? '')}</span>
                    </span>
                    <span className="secondary">#{i + 1}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <SourcesLink />
        </div>
      </aside>
    );
  }

  if (focus.kind === 'meridian') {
    const m = meridianById.get(focus.meridianId);
    if (!m) return null;
    const paired = m.pairedMeridianId ? meridianById.get(m.pairedMeridianId) : null;
    return (
      <aside className="sheet" style={sheetStyle} aria-label={t('經絡詳情', 'Meridian details')}>
        <div className="sheet-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row" style={{ gap: 6, marginBottom: 4 }}>
              <span className="chip code">{m.code}</span>
              <ReviewChip status={m.reviewStatus} />
            </div>
            <h3>{t(m.nameZhHant, m.nameEn)}</h3>
            <div className="faint">
              {[otherName(m.nameZhHant, m.nameEn), m.pinyin].filter(Boolean).join(' · ')}
            </div>
          </div>
          <FontControls />
          <button type="button" className="icon-btn" onClick={close} aria-label={t('關閉', 'Close')}>
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <Field
            label={t('循行路線', 'Route')}
            claim={m.route}
            missingText={t('尚未記錄。', 'None recorded yet.')}
            render={(v: { zhHant: string; en: string }) => t(v.zhHant, v.en)}
          />
          <div className="field">
            <div className="field-label">{t('穴位數', 'Point count')}</div>
            <div>
              {t(
                `本專案已載入 ${m.coursePointCount} 穴；古典目錄記為 ${m.meridianTotalPoints.value} 穴。`,
                `${m.coursePointCount} points loaded in this project; the classical catalogue records ${m.meridianTotalPoints.value}.`,
              )}
            </div>
            <Provenance p={m.meridianTotalPoints} />
          </div>
          {paired && (
            <div className="field">
              <div className="field-label">{t('表裡經', 'Interior–exterior pair')}</div>
              <button
                type="button"
                className="btn small ghost"
                onClick={() => setFocus({ kind: 'meridian', meridianId: paired.id })}
              >
                {paired.code} · {t(paired.nameZhHant, paired.nameEn)}
              </button>
            </div>
          )}
          <div className="field">
            <div className="field-label">{t('穴位順序', 'Stations in order')}</div>
            <ol className="list-reset" style={{ display: 'grid', gap: 2 }}>
              {m.pointOrder.map((id, i) => {
                const p = acupointById.get(id);
                if (!p) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className="search-item"
                      style={{ padding: '6px 4px', minHeight: 34 }}
                      onClick={() => setFocus({ kind: 'point', pointId: id })}
                    >
                      <span className="chip code">{p.code}</span>
                      <span className="grow">
                        <span className="primary">{t(p.nameZhHant, p.nameEn ?? '')}</span>{' '}
                        <span className="secondary">{otherName(p.nameZhHant, p.nameEn)}</span>
                      </span>
                      <span className="secondary">#{i + 1}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <SourcesLink />
        </div>
      </aside>
    );
  }

  // A 募俞 pair has no sheet of its own: what there is to say about it is the
  // relationship between two points, and the atlas caption says it in place.
  if (focus.kind !== 'function') return null;
  const ex = expandFunction(focus.functionId);
  if (!ex) return null;
  return (
    <aside className="sheet" style={sheetStyle} aria-label={t('主題詳情', 'Topic details')}>
      <div className="sheet-head">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ gap: 6, marginBottom: 4 }}>
            <span className="chip">{t('教學主題', 'Teaching topic')}</span>
            <ReviewChip status={ex.fn.reviewStatus} />
          </div>
          <h3>{t(ex.fn.labelZhHant, ex.fn.labelEn)}</h3>
        </div>
        <FontControls />
        <button type="button" className="icon-btn" onClick={close} aria-label={t('關閉', 'Close')}>
          ✕
        </button>
      </div>
      <div className="sheet-body">
        <div className="notice" style={{ marginBottom: 10 }}>
          <span>
            <strong>{t('教育用途', 'Educational')}</strong> —{' '}
            {t(ex.fn.educationalFraming.zhHant, ex.fn.educationalFraming.en)}
          </span>
        </div>
        <Field
          label={t('說明', 'What the teaching says')}
          claim={ex.fn.description}
          missingText={t('尚未記錄。', 'None recorded yet.')}
          render={(v: { zhHant: string; en: string }) => t(v.zhHant, v.en)}
        />
        <div className="field">
          <div className="field-label">
            {t(`相關穴位（${ex.acupoints.length}）`, `Related points (${ex.acupoints.length})`)}
          </div>
          {ex.acupoints.length === 0 && (
            <div className="field-missing">{t('目前資料集中沒有。', 'None in the loaded dataset.')}</div>
          )}
          {ex.acupoints.map((p) => (
            <button
              key={p.id}
              type="button"
              className="btn small ghost"
              style={{ marginRight: 6, marginBottom: 6 }}
              onClick={() => setFocus({ kind: 'point', pointId: p.id })}
            >
              {p.code} · {t(p.nameZhHant, p.nameEn ?? '')}
            </button>
          ))}
        </div>
        <div className="field">
          <div className="field-label">
            {t(`相關經絡（${ex.meridians.length}）`, `Related meridians (${ex.meridians.length})`)}
          </div>
          {ex.meridians.map((m) => (
            <button
              key={m.id}
              type="button"
              className="btn small ghost"
              style={{ marginRight: 6, marginBottom: 6 }}
              onClick={() => setFocus({ kind: 'meridian', meridianId: m.id })}
            >
              {m.code} · {t(m.nameZhHant, m.nameEn)}
            </button>
          ))}
        </div>
        <div className="field">
          <div className="field-label">{t('關聯出處', 'Association provenance')}</div>
          <div className="faint">
            {t(
              `本主題共有 ${ex.relationIds.length} 條已建檔的關聯。所有來源集中列於「來源與聲明」。`,
              `${ex.relationIds.length} recorded associations. All sources are listed under Sources & disclaimer.`,
            )}
          </div>
        </div>
        <SourcesLink />
      </div>
    </aside>
  );
}
