import { useState } from 'react';
import { meridianById } from '../data';
import {
  allWith,
  CONFLUENT_PAIRS,
  FIVE_SHU,
  FOUR_SINGLES,
  INFLUENTIAL_OF,
  muShuRows,
  pointByCode,
  pointsWith,
  REGULAR_CHANNELS,
  vertebralLevelOf,
} from '../data/specific-points';
import type { Acupoint } from '../data/types';
import { useBilingual, useStore } from '../state/store';

/**
 * 特定穴攻防矩陣 — the Day 11 review matrix.
 *
 * Every cell is DERIVED from the classifications already reviewed on the point
 * records. Nothing is authored twice, so the matrix cannot fall out of step
 * with the atlas: change a classification and the table changes with it.
 *
 * Tapping any cell focuses that point, which drives the atlas camera — the
 * table is a way INTO the figure, not a separate copy of it.
 */

type TabId = 'five' | 'singles' | 'mu' | 'influential' | 'confluent' | 'lower';

export default function SpecificPointMatrix() {
  const t = useBilingual();
  const { setFocus, setRoute, lang, focus } = useStore();
  const [tab, setTab] = useState<TabId>('five');

  /**
   * Focusing a point is only half the job from here: the Learn page has no
   * figure on it, so setting the focus and staying put looks like nothing
   * happened. Go to the atlas as well — the same handoff the meridian chips
   * above and the practice quiz already make.
   */
  const locate = (p: Acupoint) => {
    setFocus({ kind: 'point', pointId: p.id });
    setRoute('atlas');
  };

  const TABS: { id: TabId; zh: string; en: string }[] = [
    { id: 'five', zh: '五輸穴', en: 'Five shu' },
    { id: 'singles', zh: '原絡郄', en: 'Yuan · Luo · Xi' },
    { id: 'mu', zh: '募俞', en: 'Mu & Shu' },
    { id: 'influential', zh: '八會穴', en: 'Eight influential' },
    { id: 'confluent', zh: '八脈交會', en: 'Eight confluent' },
    { id: 'lower', zh: '下合穴', en: 'Lower he-sea' },
  ];

  const active = (p: Acupoint | undefined) =>
    Boolean(p) && focus.kind === 'point' && focus.pointId === p!.id;

  /**
   * A pair is the one thing in this matrix that cannot be shown by focusing a
   * single point: the mu is on the front and the shu on the back, so lighting
   * one leaves the other invisible. This lights both and lets the atlas's
   * front/back toggle walk between them.
   */
  const locatePair = (organEn: string) => {
    setFocus({ kind: 'shu_mu', organ: organEn });
    setRoute('atlas');
  };
  const pairActive = (organEn: string) =>
    focus.kind === 'shu_mu' && focus.organ === organEn;

  /**
   * The organ and tissue labels are stored lower-case because they also read
   * mid-sentence ('the influential point of blood'). Heading a row they want a
   * capital — first letter only, so 'the vessels' does not become 'The Vessels'.
   */
  const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const Cell = ({ p }: { p: Acupoint | undefined }) => {
    if (!p) return <td className="mx-empty">—</td>;
    return (
      <td>
        <button
          type="button"
          className={active(p) ? 'mx-point active' : 'mx-point'}
          onClick={() => locate(p)}
          title={t(p.nameZhHant, p.nameEn ?? p.code)}
        >
          <span className="mx-code">{p.code}</span>
          <span className="mx-name">{lang === 'en' ? p.nameEn : p.nameZhHant}</span>
        </button>
      </td>
    );
  };

  /**
   * The Chinese UI carries no bare English abbreviations, so a channel is named
   * 肺經 there and LU in English. Short forms, not the legend's full names —
   * a row header this narrow cannot hold 手太陰肺經 twelve times over.
   */
  const chanLabel = (m: { code: string; nameZhHant: string }) =>
    t(m.nameZhHant.replace(/^(手|足)(太陰|少陰|厥陰|陽明|太陽|少陽)/, ''), m.code);

  const ChannelName = ({ id }: { id: string }) => {
    const m = meridianById.get(id)!;
    return (
      <th scope="row" title={t(m.nameZhHant, m.nameEn)}>
        <span className="mx-swatch" style={{ background: m.colorToken }} aria-hidden="true" />
        {chanLabel(m)}
      </th>
    );
  };

  return (
    <div className="matrix stack">
      <div className="matrix-tabs" role="tablist">
        {TABS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={tab === x.id}
            className={tab === x.id ? 'active' : undefined}
            onClick={() => setTab(x.id)}
          >
            {t(x.zh, x.en)}
          </button>
        ))}
      </div>

      <div className="matrix-scroll">
        {tab === 'five' && (
          <table className="matrix-table">
            <caption>
              {t(
                '十二正經各有一組五輸穴，由四肢末端向心排列。',
                'Each of the twelve regular channels carries one set of five shu points, running from the extremity toward the centre.',
              )}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t('經', 'Channel')}</th>
                {FIVE_SHU.map((f) => (
                  <th key={f.key} scope="col">
                    {t(f.zhHant, f.en)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REGULAR_CHANNELS.map((m) => (
                <tr key={m.id}>
                  <ChannelName id={m.id} />
                  {FIVE_SHU.map((f) => (
                    <Cell key={f.key} p={pointsWith(m.id, f.key)[0]} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'singles' && (
          <table className="matrix-table">
            <caption>
              {t(
                '原穴、絡穴、郄穴各一。陰經的原穴與輸穴同穴，陽經則各自獨立。',
                'One yuan-source, one luo-connecting and one xi-cleft each. On the yin channels the yuan-source coincides with the shu-stream; on the yang channels it stands alone.',
              )}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t('經', 'Channel')}</th>
                {FOUR_SINGLES.map((f) => (
                  <th key={f.key} scope="col">
                    {t(f.zhHant, f.en)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REGULAR_CHANNELS.map((m) => (
                <tr key={m.id}>
                  <ChannelName id={m.id} />
                  {FOUR_SINGLES.map((f) => (
                    <Cell key={f.key} p={pointsWith(m.id, f.key)[0]} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'mu' && (
          <table className="matrix-table">
            <caption>
              {t(
                '每一臟腑有一募一俞：募在前、俞在後，同一個臟腑的兩個記號。募穴散在各經，背俞穴全在膀胱經第一側線，只差椎數——注意募穴所在的經常常不是它所屬的臟腑。按「前後對照」可在人體圖上同時標示一對，切換正／背面看另一半。',
                'Each organ has one front-mu and one back-shu — two marks for one organ, one in front and one behind. The mu points are scattered across several channels while every back-shu sits on the Bladder’s first line and differs only in the vertebra — and note how often a mu point’s channel is NOT its organ’s. Press Pair to light both on the figure, then switch front/back to walk to the other half.',
              )}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t('臟腑', 'Organ')}</th>
                <th scope="col">{t('募穴（所在經）', 'Front-mu (its channel)')}</th>
                <th scope="col">{t('背俞穴', 'Back-shu')}</th>
                <th scope="col">{t('椎數', 'Level')}</th>
                <th scope="col">
                  <span className="sr-only">{t('在人體圖上同時標示', 'Show the pair on the figure')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {muShuRows().map(({ organ, mu, shu }) => {
                const muChannel = meridianById.get(mu.meridianId)!;
                const mismatch = muChannel.nameZhHant.includes(organ.zhHant) === false;
                return (
                  <tr key={mu.code}>
                    <th scope="row">{t(organ.zhHant, sentence(organ.en))}</th>
                    <td>
                      <button
                        type="button"
                        className={active(mu) ? 'mx-point active' : 'mx-point'}
                        onClick={() => locate(mu)}
                        title={t(mu.nameZhHant, mu.nameEn ?? mu.code)}
                      >
                        <span className="mx-code">{mu.code}</span>
                        <span className="mx-name">
                          {lang === 'en' ? mu.nameEn : mu.nameZhHant}
                        </span>
                      </button>
                      {mismatch && (
                        <span className="mx-flag" title={t('募穴不在本臟腑之經上', 'Sits on another channel')}>
                          {t('異經', 'off-channel')}
                        </span>
                      )}
                    </td>
                    <Cell p={shu} />
                    {/* Read out of the shu point's own 定位 text, not retyped. */}
                    <td className="mx-chan">{shu ? (vertebralLevelOf(shu) ?? '—') : '—'}</td>
                    <td>
                      <button
                        type="button"
                        className={pairActive(organ.en) ? 'mx-pair active' : 'mx-pair'}
                        onClick={() => locatePair(organ.en)}
                        title={t(
                          '在人體圖上同時標示這一對，前後各一',
                          'Light both halves on the figure — one front, one back',
                        )}
                      >
                        {t('前後對照', 'Pair')} →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {tab === 'influential' && (
          <table className="matrix-table">
            <caption>
              {t(
                '八會穴：八種組織各有一個總會之處。',
                'The eight influential points: one gathering place for each of eight tissues.',
              )}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t('所會', 'Influential for')}</th>
                <th scope="col">{t('穴位', 'Point')}</th>
                <th scope="col">{t('所在經', 'Channel')}</th>
              </tr>
            </thead>
            <tbody>
              {allWith('influential_meeting').map((p) => (
                <tr key={p.code}>
                  <th scope="row">
                    {t(INFLUENTIAL_OF[p.code]!.zhHant, sentence(INFLUENTIAL_OF[p.code]!.en))}
                  </th>
                  <Cell p={p} />
                  <td className="mx-chan">{chanLabel(meridianById.get(p.meridianId)!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'confluent' && (
          <table className="matrix-table">
            <caption>
              {t(
                '八脈交會穴，按傳統成四組配對，每組一手一足。',
                'The eight confluent points, in the four coupled pairs they are taught as — one hand point and one foot point each.',
              )}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t('足', 'Foot')}</th>
                <th scope="col">{t('手', 'Hand')}</th>
                <th scope="col">{t('所通奇經', 'Vessels opened')}</th>
              </tr>
            </thead>
            <tbody>
              {CONFLUENT_PAIRS.map((pair) => (
                <tr key={pair.foot}>
                  <Cell p={pointByCode(pair.foot)} />
                  <Cell p={pointByCode(pair.hand)} />
                  <td className="mx-chan">{t(pair.vesselZhHant, pair.vesselEn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'lower' && (
          <table className="matrix-table">
            <caption>
              {t(
                '下合穴：六腑之氣下合於足三陽經之處。',
                'The lower he-sea points, where the qi of the six fu organs is described as joining the three yang channels of the leg.',
              )}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t('穴位', 'Point')}</th>
                <th scope="col">{t('所在經', 'Channel')}</th>
              </tr>
            </thead>
            <tbody>
              {allWith('lower_he_sea').map((p) => (
                <tr key={p.code}>
                  <Cell p={p} />
                  <td className="mx-chan">{chanLabel(meridianById.get(p.meridianId)!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="secondary matrix-note">
        {t(
          '此表由各穴已審定的「特定穴分類」直接生成，不是另寫一份資料——分類改了，表也跟著改。點任一穴可在人體圖上定位。',
          'This table is generated from each point’s own reviewed classification rather than written out a second time, so it cannot fall out of step with the atlas. Tap any point to locate it on the figure.',
        )}
      </p>
    </div>
  );
}
