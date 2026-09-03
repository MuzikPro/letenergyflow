import { useMemo, useState } from 'react';
import CircuitDiagram from '../components/CircuitDiagram';
import FlowFigure from '../components/FlowFigure';
import LineSwatch from '../components/LineSwatch';
import ShichenRing from '../components/ShichenRing';
import {
  meridianOf,
  PERICARDIUM_NOTE,
  SHICHEN,
  SHICHEN_VERSE,
  shichenHours,
  stepShichen,
} from '../data/shichen';
import { stopOf, type CircuitEmphasis } from '../data/circuit';
import { meridianLegendName } from '../data/types';
import { useMeridianClock } from '../state/useMeridianClock';
import { useBilingual, useStore } from '../state/store';

/**
 * 流注 Flow — the 子午流注 clock.
 *
 * Three columns on a wide screen (ring · figure · detail), stacking to one on a
 * phone. What it teaches is a single fact per hour: which channel the tradition
 * pairs with this double-hour, and where that channel runs. It offers no advice
 * about what to do at any hour — see `data/shichen.ts` for why that boundary is
 * drawn where it is.
 */

export default function FlowView() {
  const t = useBilingual();
  const { lang, setFocus, setRoute } = useStore();
  const clock = useMeridianClock();
  /**
   * 陰／陽 emphasis for the circuit below. It lives here, not in the diagram,
   * because the control sits in the right-hand panel — beside the facts about
   * the current hour — while the thing it controls is the full-width section
   * underneath. One owner, two readers.
   */
  const [emphasis, setEmphasis] = useState<CircuitEmphasis>('all');

  const m = useMemo(() => meridianOf(clock.shichen), [clock.shichen]);
  const legend = meridianLegendName(m, lang);
  const next = SHICHEN[stepShichen(clock.index, 1)]!;
  const prev = SHICHEN[stepShichen(clock.index, -1)]!;

  return (
    <div className="flow-view">
      <header className="flow-head">
        <div>
          <p className="eyebrow">{t('子午流注', 'Meridian Clock · Ziwu Liuzhu')}</p>
          <h2>
            {clock.shichen.branchZhHant} {clock.shichen.pinyin}
            <span className="flow-hours">{shichenHours(clock.shichen)}</span>
          </h2>
        </div>
        <div className="flow-mode">
          {clock.isManual ? (
            <button type="button" className="btn small" onClick={clock.reset}>
              {t('回到現在時間', 'Reset to system time')}
            </button>
          ) : (
            <span className="flow-live">
              <span className="flow-live-dot" aria-hidden="true" />
              {t('跟著現在時間', 'Following system time')}
            </span>
          )}
        </div>
      </header>

      <div className="flow-grid">
        <div className="flow-col flow-ring-col">
          <ShichenRing
            index={clock.index}
            liveIndex={clock.liveIndex}
            isManual={clock.isManual}
            onSelect={clock.select}
            onStep={clock.step}
          />
        </div>

        <div className="flow-col flow-figure-col">
          <div className="flow-figure-bar">
            <button
              type="button"
              className="btn small ghost"
              onClick={() => clock.step(-1)}
              aria-label={t(`上一個時辰：${prev.branchZhHant}`, `Previous hour: ${prev.pinyin}`)}
            >
              ← {prev.branchZhHant}
            </button>
            <span className="secondary flow-swipe-hint">
              {t('左右滑動可換時辰', 'Swipe to change hour')}
            </span>
            <button
              type="button"
              className="btn small ghost"
              onClick={() => clock.step(1)}
              aria-label={t(`下一個時辰：${next.branchZhHant}`, `Next hour: ${next.pinyin}`)}
            >
              {next.branchZhHant} →
            </button>
          </div>
          <FlowFigure active={m} onSwipe={clock.step} />
        </div>

        <div className="flow-col flow-detail">
          <div className="flow-mer">
            <LineSwatch meridian={m} width={26} />
            <div>
              <strong style={{ color: m.colorToken }}>{legend.primary}</strong>
              {legend.secondary && <span className="secondary"> {legend.secondary}</span>}
            </div>
          </div>

          <dl className="flow-facts">
            <div>
              <dt>{t('時辰', 'Double-hour')}</dt>
              <dd>
                {clock.shichen.branchZhHant} {clock.shichen.pinyin} · {shichenHours(clock.shichen)}
              </dd>
            </div>
            <div>
              <dt>{t('穴數', 'Points')}</dt>
              <dd>{m.pointOrder.length}</dd>
            </div>
            <div>
              <dt>{t('下一個時辰', 'Next')}</dt>
              <dd>
                {next.branchZhHant} {next.pinyin} · {meridianOf(next).code}
              </dd>
            </div>
          </dl>

          {/*
            十二經運行 — the current channel's seat in the circuit, and the 陰／陽
            toggle that drives the diagram below. The seat line is derived from
            the same circuit data, so the clock and the loop cannot disagree.
          */}
          <div className="flow-circuit-panel">
            <div className="eyebrow">{t('十二經運行', 'The circuit')}</div>
            {(() => {
              const seat = stopOf(m.id);
              if (!seat) return null;
              return (
                <p className="flow-circuit-seat">
                  {t(
                    `${seat.segment.zhHant} · ${seat.segment.quoteZhHant} · 第 ${seat.lap + 1} 圈`,
                    `${seat.segment.en} · ${seat.segment.quoteEn} · lap ${seat.lap + 1} of 3`,
                  )}
                </p>
              );
            })()}
            <div className="flow-circuit-toggle" role="group" aria-label={t('陰陽顯示', 'Yin/yang emphasis')}>
              {/*
                只看X hides nothing outright — the rest of the loop stays as a
                faint ghost, because 如環無端 is the fact the page teaches and a
                broken arc would draw the opposite. 升／降 are the ordinary
                standing pose's directions, so they cut the twelve differently
                from 陰／陽; the rule line under the diagram says how.
              */}
              {(
                [
                  ['all', '全部', 'All'],
                  ['yin', '只看陰', 'Yin only'],
                  ['yang', '只看陽', 'Yang only'],
                  ['up', '只看↑升', '↑ Rising'],
                  ['down', '只看↓降', '↓ Falling'],
                ] as const
              ).map(([id, zh, en]) => (
                <button
                  key={id}
                  type="button"
                  className={`strip-chip${emphasis === id ? ' active' : ''}`}
                  aria-pressed={emphasis === id}
                  onClick={() => setEmphasis(id)}
                >
                  {t(zh, en)}
                </button>
              ))}
            </div>
          </div>

          {/* The hour's own reviewed line, then the framework it sits in. */}
          <p className="flow-hour-note">
            {t(clock.shichen.noteZhHant, clock.shichen.noteEn)}
          </p>
          {PERICARDIUM_NOTE.meridianId === m.id && (
            <p className="secondary flow-gloss">
              {t(PERICARDIUM_NOTE.zhHant, PERICARDIUM_NOTE.en)}
            </p>
          )}

          <figure className="flow-verse">
            <blockquote>{t(SHICHEN_VERSE.zhHant, SHICHEN_VERSE.en)}</blockquote>
            <figcaption>
              {t(SHICHEN_VERSE.attributionZhHant, SHICHEN_VERSE.attributionEn)}
            </figcaption>
          </figure>

          <div className="flow-actions">
            <button
              type="button"
              className="btn small"
              onClick={() => {
                setFocus({ kind: 'meridian', meridianId: m.id });
                setRoute('atlas');
              }}
            >
              {t('在人體圖上看這條經', 'See this channel on the atlas')}
            </button>
            <button
              type="button"
              className="btn small ghost"
              onClick={() => {
                setFocus({ kind: 'meridian', meridianId: m.id });
                setRoute('network');
              }}
            >
              {t('在網絡圖上看', 'On the network map')}
            </button>
          </div>

          {/*
            * The framework explanation, the clock-time basis, the educational
            * framing and the review provenance all live on the Sources &
            * disclaimer page now — the same move the atlas's standing
            * disclaimer made. One line here, and one tap to the whole thing.
            */}
          <p className="secondary flow-review">
            {t(
              '本單元用於說明中醫的時空框架與其對自然節律的描述，不提供任何臨床診斷指引或治療建議。',
              'This module explains Traditional Chinese Medicine’s spatiotemporal framework and its account of natural rhythms. It does not provide clinical diagnostic guidance or treatment recommendations of any kind.',
            )}{' '}
            <button type="button" className="linklike" onClick={() => setRoute('about')}>
              {t('來源與聲明', 'Sources & disclaimer')} →
            </button>
          </p>
        </div>
      </div>

      <section className="flow-circuit-section">
        <h3 className="flow-circuit-title">{t('十二經運行 · 一環三圈', 'The circuit — one loop, three laps')}</h3>
        <p className="secondary flow-circuit-lede">
          {t(
            '十二經的流注次序不是十二條孤立的規則：它是同一條「胸→手→頭→足→胸」環路走三圈。舉手直立時，陰經一律上行、陽經一律下行。',
            'The flow order is not twelve separate facts: it is the same 胸→手→頭→足→胸 loop travelled three times. In the raised-arm pose, every yin channel ascends and every yang channel descends.',
          )}
        </p>
        <CircuitDiagram emphasis={emphasis} />
        <div className="row" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn small" onClick={() => setRoute('circuit')}>
            {t('完整頁：十二經運行', 'Full page: the circuit')} →
          </button>
        </div>
      </section>
    </div>
  );
}
