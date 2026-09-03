import { useMemo, useState } from 'react';
import Atlas from '../components/Atlas';
import { acupointById, dataset } from '../data';
import { levelPhrase, pairDrill } from '../data/pair-drill';
import { dueQueue, masteryBreakdown } from '../state/progress';
import { useBilingual, useStore } from '../state/store';

type Tab = 'flashcards' | 'locate' | 'quiz' | 'pairs';

export default function PracticeView() {
  const t = useBilingual();
  const [tab, setTab] = useState<Tab>('flashcards');

  return (
    <div className="page stack">
      <header className="stack" style={{ gap: 6 }}>
        <div className="eyebrow">{t('主動回憶', 'Active recall')}</div>
        <h1 style={{ fontSize: 24 }}>{t('練習', 'Practice')}</h1>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '先自己說出答案，再翻面核對。答錯的題目會自動排進複習與錯題本。',
            'Say the answer out loud before you reveal it. Anything you miss is scheduled for review and logged in your error notebook.',
          )}
        </p>
      </header>

      <div className="row" role="tablist" aria-label={t('練習模式', 'Practice modes')}>
        {(
          [
            ['flashcards', '閃卡', 'Flashcards'],
            ['locate', '找穴位', 'Locate'],
            ['quiz', '小考', 'Quiz'],
            ['pairs', '募俞配對', 'Mu–Shu pairs'],
          ] as const
        ).map(([id, zh, en]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? 'btn primary small' : 'btn small'}
            onClick={() => setTab(id)}
          >
            {t(zh, en)}
          </button>
        ))}
      </div>

      {tab === 'flashcards' && <Flashcards />}
      {tab === 'locate' && <Locate />}
      {tab === 'quiz' && <Quiz />}
      {tab === 'pairs' && <PairDrill />}
    </div>
  );
}

/* ------------------------------- flashcards ------------------------------- */

function Flashcards() {
  const t = useBilingual();
  const { progress, answer, setFocus, setRoute } = useStore();
  const [revealed, setRevealed] = useState(false);
  const [index, setIndex] = useState(0);

  const allIds = useMemo(() => dataset.flashcards.map((c) => c.id), []);
  const queue = useMemo(() => {
    const due = dueQueue(progress, allIds);
    return due.length > 0 ? due : allIds;
    // Recomputed only when the deck changes; answering advances `index` instead,
    // so the queue does not reshuffle under the learner mid-session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allIds]);

  const stats = masteryBreakdown(progress, allIds);
  const cardId = queue[index % queue.length];
  const card = dataset.flashcards.find((c) => c.id === cardId);
  if (!card) return null;

  const grade = (wasCorrect: boolean) => {
    answer({
      itemId: card.id,
      itemKind: 'flashcard',
      acupointId: card.relatedAcupointIds[0] ?? null,
      wasCorrect,
      promptEn: card.frontEn,
      givenAnswer: wasCorrect ? 'self-graded: recalled' : 'self-graded: missed',
      expectedAnswer: card.backEn,
    });
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="stack">
      <div className="row faint">
        <span>
          {t(`第 ${(index % queue.length) + 1}／${queue.length} 張`, `Card ${(index % queue.length) + 1} of ${queue.length}`)}
        </span>
        <span>·</span>
        <span>
          {t(`熟練 ${stats.strong}`, `${stats.strong} strong`)} ·{' '}
          {t(`待複習 ${stats.dueNow}`, `${stats.dueNow} due`)}
        </span>
      </div>

      <div className="flashcard">
        <div className="eyebrow">{t('正面', 'Front')}</div>
        <div className="front">{t(card.frontZhHant, card.frontEn)}</div>
        {revealed ? (
          <>
            <div className="eyebrow">{t('背面', 'Back')}</div>
            <div className="back">{t(card.backZhHant, card.backEn)}</div>
          </>
        ) : (
          <div className="back faint">
            {t('閉眼 5 秒說出答案，再翻面。', 'Close your eyes, say it for five seconds, then flip.')}
          </div>
        )}
        <div style={{ flex: 1 }} />
        {!revealed ? (
          <button type="button" className="btn primary" onClick={() => setRevealed(true)}>
            {t('翻面', 'Reveal')}
          </button>
        ) : (
          <div className="row">
            <button type="button" className="btn primary" onClick={() => grade(true)}>
              {t('記得 ✓', 'Got it ✓')}
            </button>
            <button type="button" className="btn" onClick={() => grade(false)}>
              {t('沒記住', 'Missed it')}
            </button>
          </div>
        )}
      </div>

      {card.relatedAcupointIds.length > 0 && (
        <div className="row">
          {card.relatedAcupointIds.map((id) => {
            const p = acupointById.get(id);
            if (!p) return null;
            return (
              <button
                key={id}
                type="button"
                className="btn small ghost"
                onClick={() => {
                  setFocus({ kind: 'point', pointId: id });
                  setRoute('atlas');
                }}
              >
                {t('在圖上看', 'Show')} {p.code}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- locate --------------------------------- */

function Locate() {
  const t = useBilingual();
  const { answer } = useStore();
  const items = useMemo(() => dataset.quizItems.filter((q) => q.kind === 'locate_point'), []);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const item = items[index % items.length];
  if (!item?.targetAcupointId) return null;
  const target = acupointById.get(item.targetAcupointId);
  const correct = picked !== null && picked === item.targetAcupointId;

  const onPick = (pointId: string) => {
    if (picked) return;
    setPicked(pointId);
    answer({
      itemId: item.id,
      itemKind: 'locate',
      acupointId: item.targetAcupointId,
      wasCorrect: pointId === item.targetAcupointId,
      promptEn: item.promptEn,
      givenAnswer: acupointById.get(pointId)?.code ?? pointId,
      expectedAnswer: target?.code ?? item.targetAcupointId!,
    });
  };

  return (
    <div className="stack">
      <div className="panel stack" style={{ gap: 8 }}>
        <div className="eyebrow">
          {t(`第 ${(index % items.length) + 1}／${items.length} 題`, `${(index % items.length) + 1} of ${items.length}`)}
        </div>
        <h2 style={{ fontSize: 19 }}>{t(item.promptZhHant, item.promptEn)}</h2>
        {picked && (
          <div className={correct ? 'notice' : 'notice'} style={correct ? { borderColor: 'var(--ok)' } : undefined}>
            <span>
              <strong>{correct ? t('正確', 'Correct') : t('再看一次', 'Not quite')}</strong> —{' '}
              {t(item.explanationZhHant, item.explanationEn)}
              {!correct && (
                <>
                  {' '}
                  {t(
                    `你點到的是 ${acupointById.get(picked)?.nameZhHant ?? ''}（${acupointById.get(picked)?.code ?? ''}）。`,
                    `You tapped ${acupointById.get(picked)?.code ?? ''}.`,
                  )}
                </>
              )}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          height: 'min(58vh, 520px)',
          borderRadius: 'var(--radius-l)',
          overflow: 'hidden',
          border: '1px solid var(--line-soft)',
        }}
      >
        <Atlas
          mode="locate"
          onPick={onPick}
          revealPointIds={picked ? [item.targetAcupointId, picked] : []}
        />
      </div>

      <div className="row">
        <button
          type="button"
          className="btn primary"
          disabled={!picked}
          onClick={() => {
            setPicked(null);
            setIndex((i) => i + 1);
          }}
        >
          {t('下一題', 'Next')}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- quiz ---------------------------------- */

function Quiz() {
  const t = useBilingual();
  const { answer, setFocus, setRoute } = useStore();
  const items = useMemo(() => dataset.quizItems.filter((q) => q.kind === 'multiple_choice'), []);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const item = items[index];
  if (!item) {
    return (
      <div className="panel stack">
        <h2 style={{ fontSize: 19 }}>{t('小考完成', 'Quiz complete')}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            `答對 ${score.right}／${score.total} 題。答錯的題目已排入複習與錯題本。`,
            `${score.right} of ${score.total} correct. Anything you missed is scheduled for review and logged in your error notebook.`,
          )}
        </p>
        <div className="row">
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setIndex(0);
              setPicked(null);
              setScore({ right: 0, total: 0 });
            }}
          >
            {t('再考一次', 'Run it again')}
          </button>
          <button type="button" className="btn" onClick={() => setRoute('progress')}>
            {t('看進度與錯題本', 'Progress & error notebook')}
          </button>
        </div>
      </div>
    );
  }

  const choose = (optionId: string) => {
    if (picked) return;
    const wasCorrect = optionId === item.correctOptionId;
    setPicked(optionId);
    setScore((s) => ({ right: s.right + (wasCorrect ? 1 : 0), total: s.total + 1 }));
    answer({
      itemId: item.id,
      itemKind: 'quiz',
      acupointId: item.targetAcupointId,
      wasCorrect,
      promptEn: item.promptEn,
      givenAnswer: item.options.find((o) => o.id === optionId)?.en ?? optionId,
      expectedAnswer: item.options.find((o) => o.id === item.correctOptionId)?.en ?? '',
    });
  };

  return (
    <div className="stack">
      <div className="faint">
        {t(`第 ${index + 1}／${items.length} 題`, `Question ${index + 1} of ${items.length}`)} ·{' '}
        {t(`目前 ${score.right}／${score.total}`, `${score.right}/${score.total} so far`)}
      </div>

      <div className="panel stack">
        <h2 style={{ fontSize: 19 }}>{t(item.promptZhHant, item.promptEn)}</h2>
        <div className="stack" style={{ gap: 8 }} role="group">
          {item.options.map((o, i) => {
            const state =
              !picked
                ? undefined
                : o.id === item.correctOptionId
                  ? 'correct'
                  : o.id === picked
                    ? 'wrong'
                    : undefined;
            return (
              <button
                key={o.id}
                type="button"
                className="option"
                data-state={state}
                disabled={Boolean(picked)}
                onClick={() => choose(o.id)}
              >
                <span className="marker">{String.fromCharCode(65 + i)}</span>
                <span>{t(o.zhHant, o.en)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {picked && (
        <div className="panel stack" style={{ gap: 10 }}>
          <div className="eyebrow">
            {picked === item.correctOptionId ? t('正確', 'Correct') : t('訂正', 'Correction')}
          </div>
          <p className="muted" style={{ margin: 0 }}>
            {t(item.explanationZhHant, item.explanationEn)}
          </p>
          <div className="row">
            {item.relatedAcupointIds.map((id) => {
              const p = acupointById.get(id);
              if (!p) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className="btn small ghost"
                  onClick={() => {
                    setFocus({ kind: 'point', pointId: id });
                    setRoute('atlas');
                  }}
                >
                  {t('看', 'Show')} {p.code} · {t(p.nameZhHant, p.nameEn ?? p.nameZhHant)}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setPicked(null);
              setIndex((i) => i + 1);
            }}
          >
            {index + 1 === items.length ? t('看結果', 'See results') : t('下一題', 'Next question')}
          </button>
        </div>
      )}
    </div>
  );
}


/* ------------------------------ 募俞 pair drill ---------------------------- */

/**
 * Given one half of a 募俞 pair, name the other.
 *
 * The whole deck is generated from the pairing on the records (see
 * data/pair-drill.ts), so this drill has no answer key of its own to fall out
 * of step with. Answering feeds the same spaced-review scheduler and error
 * notebook as every other mode, and each result offers the pair focus — the
 * one way to see both halves lit on the figure at once.
 */
function PairDrill() {
  const t = useBilingual();
  const { answer, setFocus, setRoute } = useStore();
  const deck = useMemo(() => pairDrill(), []);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const q = deck[index];
  if (!q) {
    return (
      <div className="panel stack">
        <h2 style={{ fontSize: 19 }}>{t('配對練習完成', 'Pair drill complete')}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            `答對 ${score.right}／${score.total} 題。十二對，每一對從兩個方向各問一次。`,
            `${score.right} of ${score.total} correct — twelve pairs, each asked from both directions.`,
          )}
        </p>
        <div className="row">
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setIndex(0);
              setPicked(null);
              setScore({ right: 0, total: 0 });
            }}
          >
            {t('再練一次', 'Run it again')}
          </button>
          <button type="button" className="btn" onClick={() => setRoute('progress')}>
            {t('看進度與錯題本', 'Progress & error notebook')}
          </button>
        </div>
      </div>
    );
  }

  // 背俞穴 are named after their organ — 肺俞 says "lung" in both languages — so
  // asking which point is the lung's shu would answer itself. That direction
  // asks where it sits instead; only the mu direction is a blind name recall.
  const promptZh =
    q.askFor === 'level'
      ? `${q.organ.zhHant}的募穴是${q.given.nameZhHant}（${q.given.code}）。它的背俞穴${q.partner.nameZhHant}（${q.partner.code}）在哪一節？`
      : `${q.given.nameZhHant}（${q.given.code}）是${q.organ.zhHant}的背俞穴。它的募穴是哪一個？`;
  const promptEn =
    q.askFor === 'level'
      ? `${q.given.code} is the front-mu point of the ${q.organ.en}. At which level does its back-shu ${q.partner.code} sit?`
      : `${q.given.code} is the back-shu point of the ${q.organ.en}. Which point is its front-mu?`;

  const choose = (optionId: string) => {
    if (picked) return;
    const wasCorrect = optionId === q.correctOptionId;
    setPicked(optionId);
    setScore((s) => ({ right: s.right + (wasCorrect ? 1 : 0), total: s.total + 1 }));
    answer({
      itemId: q.id,
      itemKind: 'quiz',
      acupointId: q.partner.id,
      wasCorrect,
      promptEn,
      givenAnswer: q.options.find((o) => o.id === optionId)?.en ?? optionId,
      expectedAnswer: q.options.find((o) => o.id === q.correctOptionId)?.en ?? '',
    });
  };

  return (
    <div className="stack">
      <div className="faint">
        {t(`第 ${index + 1}／${deck.length} 題`, `Question ${index + 1} of ${deck.length}`)} ·{' '}
        {t(`目前 ${score.right}／${score.total}`, `${score.right}/${score.total} so far`)}
      </div>

      <div className="panel stack">
        <h2 style={{ fontSize: 19 }}>{t(promptZh, promptEn)}</h2>
        <div className="stack" style={{ gap: 8 }} role="group">
          {q.options.map((o, i) => {
            const state = !picked
              ? undefined
              : o.id === q.correctOptionId
                ? 'correct'
                : o.id === picked
                  ? 'wrong'
                  : undefined;
            return (
              <button
                key={o.id}
                type="button"
                className="option"
                data-state={state}
                disabled={Boolean(picked)}
                onClick={() => choose(o.id)}
              >
                <span className="marker">{String.fromCharCode(65 + i)}</span>
                <span>{t(o.zhHant, o.en)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {picked && (
        <div className="panel stack" style={{ gap: 10 }}>
          <div className="eyebrow">
            {picked === q.correctOptionId ? t('正確', 'Correct') : t('訂正', 'Correction')}
          </div>
          <p className="muted" style={{ margin: 0 }}>
            {t(
              `${q.organ.zhHant}：募穴${q.askFor === 'level' ? q.given.nameZhHant : q.partner.nameZhHant}（${q.askFor === 'level' ? q.given.code : q.partner.code}）在前，背俞穴${q.askFor === 'level' ? q.partner.nameZhHant : q.given.nameZhHant}（${q.askFor === 'level' ? q.partner.code : q.given.code}）在後${q.level ? `，在${levelPhrase(q.level).zhHant}、後正中線旁開 1.5 寸` : ''}。一臟腑兩個記號，這是結構對應，不是治療建議。`,
              `The ${q.organ.en}: its front-mu ${q.askFor === 'level' ? q.given.code : q.partner.code} in front, its back-shu ${q.askFor === 'level' ? q.partner.code : q.given.code} behind${q.level ? `, at ${q.level}, 1.5 cun lateral to the posterior midline` : ''}. Two marks for one organ — a structural correspondence, not treatment advice.`,
            )}
          </p>
          <div className="row">
            <button
              type="button"
              className="btn small ghost"
              onClick={() => {
                setFocus({ kind: 'shu_mu', organ: q.organ.en });
                setRoute('atlas');
              }}
            >
              {t('在圖上看這一對', 'Show the pair on the figure')} →
            </button>
          </div>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setPicked(null);
              setIndex((i) => i + 1);
            }}
          >
            {index + 1 === deck.length ? t('看結果', 'See results') : t('下一題', 'Next question')}
          </button>
        </div>
      )}
    </div>
  );
}
