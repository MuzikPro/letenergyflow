import { useMemo } from 'react';
import { acupointById, dataset, meridianById } from '../data';
import { masteryBreakdown, REVIEW_INTERVALS_DAYS } from '../state/progress';
import { useBilingual, useStore } from '../state/store';

export default function ProgressView() {
  const t = useBilingual();
  const { progress, annotateError, resolveError, setFocus, setRoute } = useStore();

  const allIds = useMemo(
    () => [...dataset.flashcards.map((c) => c.id), ...dataset.quizItems.map((q) => q.id)],
    [],
  );
  const stats = masteryBreakdown(progress, allIds);

  const pointRows = useMemo(
    () =>
      dataset.acupoints
        .map((p) => ({ p, m: progress.pointMastery[p.id] }))
        .filter((r) => r.m)
        .sort((a, b) => (b.m!.incorrect - b.m!.correct) - (a.m!.incorrect - a.m!.correct)),
    [progress.pointMastery],
  );

  const pct = (n: number) => (stats.total === 0 ? 0 : (n / stats.total) * 100);

  return (
    <div className="page stack">
      <header className="stack" style={{ gap: 6 }}>
        <div className="eyebrow">{t('間隔重複 1-3-7', 'Spaced review, 1-3-7')}</div>
        <h1 style={{ fontSize: 24 }}>{t('進度', 'Progress')}</h1>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            `複習間隔：${REVIEW_INTERVALS_DAYS.join('、')} 天。所有資料只存在這台裝置上。`,
            `Review intervals: ${REVIEW_INTERVALS_DAYS.join(', ')} days. Everything stays on this device.`,
          )}
        </p>
      </header>

      <section className="panel stack">
        <h2 style={{ fontSize: 17 }}>{t('掌握度', 'Mastery')}</h2>
        <div className="meter" aria-hidden="true">
          <span style={{ width: `${pct(stats.strong)}%`, background: 'var(--ok)' }} />
          <span style={{ width: `${pct(stats.learning)}%`, background: 'var(--accent)' }} />
          <span style={{ width: `${pct(stats.untouched)}%`, background: 'var(--line)' }} />
        </div>
        <div className="stat-grid">
          <div className="stat">
            <b>{stats.strong}</b>
            <span className="faint">{t('已鞏固', 'Consolidated')}</span>
          </div>
          <div className="stat">
            <b>{stats.learning}</b>
            <span className="faint">{t('學習中', 'Learning')}</span>
          </div>
          <div className="stat">
            <b>{stats.untouched}</b>
            <span className="faint">{t('未接觸', 'Untouched')}</span>
          </div>
          <div className="stat">
            <b>{stats.dueNow}</b>
            <span className="faint">{t('現在該複習', 'Due now')}</span>
          </div>
        </div>
        <button type="button" className="btn primary" onClick={() => setRoute('practice')}>
          {t('開始複習', 'Start review')}
        </button>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 17 }}>{t('錯題本', 'Error notebook')}</h2>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '寫下「為什麼會搞混」——這一步才是記憶補丁。',
            'Writing down *why* you mixed them up is the step that actually patches the memory.',
          )}
        </p>
        {progress.errors.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            {t('目前沒有錯題紀錄。', 'No errors logged yet.')}
          </p>
        ) : (
          <ul className="list-reset stack" style={{ gap: 10 }}>
            {progress.errors.map((e) => {
              const p = e.acupointId ? acupointById.get(e.acupointId) : null;
              return (
                <li
                  key={e.id}
                  className="stack"
                  style={{
                    gap: 6,
                    padding: 12,
                    borderRadius: 'var(--radius-m)',
                    border: '1px solid var(--line-soft)',
                    background: 'var(--bg-elev-2)',
                    opacity: e.resolved ? 0.55 : 1,
                  }}
                >
                  <div className="row" style={{ gap: 6 }}>
                    <span className="chip">{e.itemKind}</span>
                    {p && <span className="chip code">{p.code}</span>}
                    <span className="faint">{new Date(e.at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontWeight: 600 }}>{e.promptEn}</div>
                  <div className="faint">
                    {t('你的答案', 'You answered')}: {e.givenAnswer} ·{' '}
                    {t('正確', 'Correct')}: {e.expectedAnswer}
                  </div>
                  <textarea
                    rows={2}
                    value={e.confusionNote}
                    placeholder={t('為什麼搞混？', 'Why did I mix these up?')}
                    onChange={(ev) => annotateError(e.id, ev.target.value)}
                  />
                  <div className="row">
                    <button
                      type="button"
                      className="btn small ghost"
                      onClick={() => resolveError(e.id, !e.resolved)}
                    >
                      {e.resolved ? t('標記為未解決', 'Mark unresolved') : t('已補起來 ✓', 'Patched ✓')}
                    </button>
                    {p && (
                      <button
                        type="button"
                        className="btn small ghost"
                        onClick={() => {
                          setFocus({ kind: 'point', pointId: p.id });
                          setRoute('atlas');
                        }}
                      >
                        {t('在圖上看', 'Show on atlas')}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {pointRows.length > 0 && (
        <section className="panel stack">
          <h2 style={{ fontSize: 17 }}>{t('各穴位表現', 'Per-point performance')}</h2>
          <table className="data">
            <thead>
              <tr>
                <th>{t('穴位', 'Point')}</th>
                <th>{t('經絡', 'Meridian')}</th>
                <th>{t('對', 'Right')}</th>
                <th>{t('錯', 'Wrong')}</th>
              </tr>
            </thead>
            <tbody>
              {pointRows.map(({ p, m }) => (
                <tr key={p.id}>
                  <td>
                    <button
                      type="button"
                      className="btn small ghost"
                      onClick={() => {
                        setFocus({ kind: 'point', pointId: p.id });
                        setRoute('atlas');
                      }}
                    >
                      {p.code} · {t(p.nameZhHant, p.nameEn ?? p.nameZhHant)}
                    </button>
                  </td>
                  <td className="faint">{meridianById.get(p.meridianId)?.code}</td>
                  <td>{m!.correct}</td>
                  <td>{m!.incorrect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="row">
        <button type="button" className="btn small ghost" onClick={() => setRoute('settings')}>
          {t('語言、主題與資料設定 →', 'Language, theme & data settings →')}
        </button>
      </section>
    </div>
  );
}
