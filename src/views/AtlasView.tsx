import { useState } from 'react';
import Atlas from '../components/Atlas';
import DetailPanel, { sheetOpenFor } from '../components/DetailPanel';
import LineSwatch from '../components/LineSwatch';
import { dataset, meridianById } from '../data';
import { EXTRAORDINARY_VESSELS } from '../data/extraordinary';
import { crossingPointsOf } from '../data/extraordinary-routes';
import { regionLabel } from '../data/types';
import { useBilingual, useStore } from '../state/store';

/** The atlas, plus an always-available structured list equivalent. */
export default function AtlasView() {
  const t = useBilingual();
  const { setFocus, focus, lang } = useStore();
  const [listOpen, setListOpen] = useState(false);

  return (
    <div
      className="atlas-view"
      /* The sheet floats over the right third on a wide screen, on top of the
         zoom and front/back controls. This tells the CSS to slide them clear. */
      data-sheet-open={!listOpen && sheetOpenFor(focus) ? 'true' : 'false'}
      style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, position: 'relative' }}
    >
      {!listOpen ? (
        <>
          {/* The list opener lives in the layer panel now. It used to float at
              the bottom-left, where it sat on top of the legend rows it shared
              a corner with. */}
          <Atlas onOpenList={() => setListOpen(true)} />
          <DetailPanel />
        </>
      ) : (
        <div className="page stack">
          <div className="row">
            <h1 style={{ fontSize: 22, flex: 1 }}>{t('穴位清單', 'Point index')}</h1>
            <button type="button" className="btn small" onClick={() => setListOpen(false)}>
              {t('回到圖上', 'Back to atlas')}
            </button>
          </div>
          <p className="faint" style={{ margin: 0 }}>
            {t(
              '這是人體圖的非視覺等價檢視，資料完全相同。',
              'A non-visual equivalent of the atlas, built from exactly the same records.',
            )}
          </p>
          {dataset.meridians.map((m) => (
            <section key={m.id} className="panel stack" style={{ gap: 8 }}>
              <div className="row">
                <LineSwatch meridian={m} width={22} />
                <h2 style={{ fontSize: 16 }}>
                  {m.code} · {t(m.nameZhHant, m.nameEn)}
                </h2>
                <span className={m.reviewStatus === 'unreviewed' ? 'chip warn' : 'chip accent'}>
                  {m.reviewStatus === 'unreviewed'
                    ? t('尚未審核', 'Unreviewed')
                    : t('已核對來源', 'Source checked')}
                </span>
              </div>
              <p className="faint" style={{ margin: 0 }}>
                {t(m.route.value.zhHant, m.route.value.en)}
              </p>
              <ol className="list-reset" style={{ display: 'grid', gap: 2 }}>
                {m.pointOrder.map((id, i) => {
                  const p = dataset.acupoints.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className="search-item"
                        style={{ paddingLeft: 4, paddingRight: 4 }}
                        onClick={() => {
                          setFocus({ kind: 'point', pointId: id });
                          setListOpen(false);
                        }}
                      >
                        <span className="chip code">{p.code}</span>
                        <span className="grow">
                          <span className="primary">{t(p.nameZhHant, p.nameEn ?? '')}</span>{' '}
                          <span className="secondary">
                            {[
                              lang === 'en' ? p.nameZhHant : lang === 'zh' ? p.nameEn : null,
                              p.pinyin,
                              regionLabel(p.bodyRegion, lang === 'en' ? 'en' : 'zh'),
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </span>
                        <span className="secondary">#{i + 1}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
          {/*
            奇經八脈, in the same non-visual list as the channels.

            The list view is the atlas's accessible equivalent, so anything the
            figure can draw has to be readable here too — and since the ingest
            that includes eight routes, their 循行, their 主要病候 and the
            crossing points each line runs through. 督脈 and 任脈 appear above as
            channels because they own their points; here they appear again as
            vessels, which is the other true thing about them.
          */}
          <section className="panel stack" style={{ gap: 10 }}>
            <h2 style={{ fontSize: 18 }}>{t('奇經八脈', 'The eight extraordinary vessels')}</h2>
            <p className="faint" style={{ margin: 0 }}>
              {t(
                '八脈「別道奇行」，不受十二正經的流注次序約束。其中只有督脈、任脈領有自己的穴位；其餘六脈交會於十二正經的腧穴之上。教育用途，非治療建議。',
                'The eight run “by a separate path”, outside the flow order of the twelve. Only 督脈 and 任脈 own points; the other six cross points belonging to the twelve regular channels. Educational use, not treatment advice.',
              )}
            </p>
            {EXTRAORDINARY_VESSELS.map((v) => {
              const crossings = crossingPointsOf(v.zhHant);
              return (
                <section key={v.zhHant} className="stack" style={{ gap: 6 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <h3 style={{ fontSize: 15, margin: 0 }}>{t(v.zhHant, v.en)}</h3>
                    <span className="chip">{v.confluent.code}</span>
                    <span className={v.meridian ? 'chip accent' : 'chip'}>
                      {v.meridian
                        ? t(`本經 ${v.meridian.pointOrder.length} 穴`, `${v.meridian.pointOrder.length} own points`)
                        : t('無專屬穴位', 'No points of its own')}
                    </span>
                  </div>
                  {v.route && (
                    <>
                      <p className="secondary" style={{ margin: 0 }}>
                        <strong>{t('循行', 'Course')}：</strong>
                        {t(v.route.courseZhHant, v.route.courseEn)}
                      </p>
                      {v.route.classicalZhHant && (
                        <p className="faint" style={{ margin: 0 }}>
                          {t('《奇經八脈考》：', '《奇經八脈考》: ')}
                          {v.route.classicalZhHant}
                        </p>
                      )}
                      <p className="secondary" style={{ margin: 0 }}>
                        <strong>{t('主要病候', 'Associated patterns')}：</strong>
                        {t(v.route.signsZhHant, v.route.signsEn)}
                      </p>
                    </>
                  )}
                  <p className="faint" style={{ margin: 0 }}>
                    {t(
                      `八脈交會穴：${v.confluent.nameZhHant}（${v.confluent.code}），與${v.coupledWith}相配`,
                      `Confluent point: ${v.confluent.code}, coupled with the ${v.coupledWith}`,
                    )}
                  </p>
                  <ol className="list-reset" style={{ display: 'grid', gap: 2 }}>
                    {crossings.map((p, i) => (
                      <li key={`${v.zhHant}-${p.id}`}>
                        <button
                          type="button"
                          className="search-item"
                          style={{ paddingLeft: 4, paddingRight: 4 }}
                          onClick={() => {
                            setFocus({ kind: 'point', pointId: p.id });
                            setListOpen(false);
                          }}
                        >
                          <span className="chip code">{p.code}</span>
                          <span className="grow">
                            <span className="primary">{t(p.nameZhHant, p.nameEn ?? '')}</span>{' '}
                            <span className="secondary">
                              {regionLabel(p.bodyRegion, lang === 'en' ? 'en' : 'zh')}
                            </span>
                          </span>
                          <span className="secondary">#{i + 1}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </section>

          {focus.kind === 'meridian' && (
            <p className="faint">
              {t('目前選取：', 'Currently selected: ')}
              {meridianById.get(focus.meridianId)?.nameZhHant}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
