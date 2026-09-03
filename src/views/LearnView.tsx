import { useState } from 'react';
import CourseIndex from '../components/CourseIndex';
import SpecificPointMatrix from '../components/SpecificPointMatrix';
import TopicCards from '../components/TopicCards';
import { dataset, meridianById } from '../data';
import { MNEMONICS } from '../data/mnemonics';
import LineSwatch from '../components/LineSwatch';
import { useBilingual, useStore } from '../state/store';

const KIND_LABEL: Record<string, { zh: string; en: string }> = {
  learn: { zh: '學', en: 'Learn' },
  do: { zh: '做', en: 'Do' },
  say: { zh: '說', en: 'Say' },
  test: { zh: '考', en: 'Test' },
  feynman: { zh: '費曼', en: 'Feynman' },
};

export default function LearnView() {
  const t = useBilingual();
  const { setFocus, setRoute, progress, markDayComplete } = useStore();
  const [dayIndex, setDayIndex] = useState(0);
  const day = dataset.curriculumDays[dayIndex] ?? dataset.curriculumDays[0];
  if (!day) return null;
  const done = progress.completedDayIds.includes(day.id);
  const prev = dataset.curriculumDays[dayIndex - 1];
  const next = dataset.curriculumDays[dayIndex + 1];

  return (
    <div className="page stack">
      {/*
        Twenty-six days outgrew a row of twenty-six buttons — it wrapped to
        four lines on a phone and pushed the lesson off the screen. Stepping
        one day at a time is the common move, so that stays in reach; the whole
        index is one disclosure away.
      */}
      <div className="row day-stepper">
        {/* At either end there is no neighbour to name, and a button reading
            "← Day " with the number missing is worse than a bare arrow. */}
        <button
          type="button"
          className="btn small"
          onClick={() => setDayIndex(dayIndex - 1)}
          disabled={!prev}
          aria-label={
            prev
              ? t(`上一天：第 ${prev.dayNumber} 天`, `Previous day: day ${prev.dayNumber}`)
              : t('已是第一天', 'Already at the first day')
          }
        >
          ←{prev ? ` ${t(`第 ${prev.dayNumber} 天`, `Day ${prev.dayNumber}`)}` : ''}
        </button>
        <button
          type="button"
          className="btn small"
          onClick={() => setDayIndex(dayIndex + 1)}
          disabled={!next}
          aria-label={
            next
              ? t(`下一天：第 ${next.dayNumber} 天`, `Next day: day ${next.dayNumber}`)
              : t('已是最後一天', 'Already at the last day')
          }
        >
          {next ? `${t(`第 ${next.dayNumber} 天`, `Day ${next.dayNumber}`)} ` : ''}→
        </button>
        <details className="course-index-disclosure">
          <summary>
            {t(
              `總目錄 · 第 ${day.dayNumber} / ${dataset.curriculumDays.length} 天`,
              `Course index · day ${day.dayNumber} of ${dataset.curriculumDays.length}`,
            )}
          </summary>
          <CourseIndex selectedDayId={day.id} onSelect={setDayIndex} />
        </details>
      </div>
      <header className="stack" style={{ gap: 8 }}>
        <div className="eyebrow">
          {t(`第 ${day.dayNumber} 天`, `Day ${day.dayNumber}`)} ·{' '}
          {/* Derived: the course grew to 13 days and this label still said 12. */}
          {t(
            `${dataset.curriculumDays.length} 天課程`,
            `${dataset.curriculumDays.length}-day course`,
          )}
        </div>
        <h1 style={{ fontSize: 26 }}>{t(day.titleZhHant, day.titleEn)}</h1>
        <p className="muted" style={{ margin: 0 }}>
          {t(day.hookZhHant, day.hookEn)}
        </p>
        <div className="row">
          {day.meridianIds.map((id) => {
            const m = meridianById.get(id);
            if (!m) return null;
            return (
              <button
                key={id}
                type="button"
                className="btn small"
                onClick={() => {
                  setFocus({ kind: 'meridian', meridianId: id });
                  setRoute('atlas');
                }}
              >
                <LineSwatch meridian={m} width={18} />
                {m.code} · {t(m.nameZhHant, m.nameEn)}
              </button>
            );
          })}
        </div>
      </header>

      <div className="notice">
        <span>
          <strong>{t('教育用途', 'Educational use only')}</strong> —{' '}
          {t(
            '本課程用於記憶經絡與穴位名稱、位置與分類。不提供診斷、治療建議或任何侵入性操作說明。若有健康問題，請諮詢合格醫療專業人員。',
            'This course exists to help you memorise channel routes, point names, landmarks and classifications. It does not diagnose, recommend points for symptoms, or describe any invasive technique. For a health concern, consult a qualified professional.',
          )}
        </span>
      </div>

      {day.noticeZhHant && day.noticeEn && (
        <div className="notice notice-day">
          <span>{t(day.noticeZhHant, day.noticeEn)}</span>
        </div>
      )}

      {day.sections.map((s) => {
        const kind = KIND_LABEL[s.kind] ?? { zh: s.kind, en: s.kind };
        return (
          <section key={s.id} className="panel stack" style={{ gap: 10 }}>
            <div className="row" style={{ gap: 8 }}>
              <span className="chip accent">{t(kind.zh, kind.en)}</span>
              <h2 style={{ fontSize: 17 }}>{t(s.titleZhHant, s.titleEn)}</h2>
            </div>
            {s.body.map((b, i) => (
              <p key={i} style={{ margin: 0 }} className="muted">
                {t(b.zhHant, b.en)}
              </p>
            ))}
          </section>
        );
      })}

      <section className="panel stack">
        <h2 style={{ fontSize: 17 }}>{t('接下來', 'Next')}</h2>
        <div className="row">
          <button type="button" className="btn primary" onClick={() => setRoute('practice')}>
            {t('開始練習', 'Start practice')}
          </button>
          <button type="button" className="btn" onClick={() => setRoute('network')}>
            {t('看網絡圖', 'View network map')}
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => markDayComplete(day.id)}
            disabled={done}
          >
            {done ? t('今日已完成 ✓', 'Day marked complete ✓') : t('標記今日完成', 'Mark day complete')}
          </button>
        </div>
      </section>

      <section className="stack" style={{ gap: 10 }}>
        <h2 style={{ fontSize: 17 }}>{t('特定穴矩陣', 'Specific-point matrix')}</h2>
        <p className="secondary" style={{ margin: 0 }}>
          {t(
            '把 362 個穴壓縮成幾張表：五輸、原絡郄、募俞、八會、八脈交會、下合。每一格都是從該穴已審定的分類直接生成的。',
            'The 362 points compressed into a few tables — five shu, yuan/luo/xi, mu and shu, the eight influential, the eight confluent, the lower he-sea. Every cell is generated from that point’s own reviewed classification.',
          )}
        </p>
        <SpecificPointMatrix />
      </section>

      <section className="stack" style={{ gap: 10 }}>
        <h2 style={{ fontSize: 17 }}>{t('教學主題對照', 'Teaching topics at a glance')}</h2>
        <p className="secondary" style={{ margin: 0 }}>
          {t(
            '課程用來把區域、經絡與穴位綁在一起的記憶編組。左欄是對照，右欄標在簡化人形上。',
            'The mnemonic groupings the curriculum uses to bind a region, a channel and a point together. Mappings on the left, annotated on a minimal avatar on the right.',
          )}
        </p>
        <TopicCards />
      </section>

      <section className="stack" style={{ gap: 10 }}>
        <h2 style={{ fontSize: 17 }}>{t('特定穴歌訣', 'The mnemonic verses')}</h2>
        <p className="secondary" style={{ margin: 0 }}>
          {t(
            '上面每一張表，傳統上都有一首歌訣。歌訣記的是穴名與分類的對應，不是用法——念得出來，表就默得出來。',
            'Every table above has a verse behind it. The verses record which point belongs to which category, nothing about use — say one aloud and you can write its table out from memory.',
          )}
        </p>
        {MNEMONICS.map((m) => (
          <details key={m.id} className="panel course-index-disclosure">
            <summary>
              <strong style={{ fontSize: 15 }}>{t(m.titleZhHant, m.titleEn)}</strong>
            </summary>
            <div className="stack" style={{ gap: 8, marginTop: 8 }}>
              <p
                lang="zh-Hant"
                style={{
                  margin: 0,
                  fontSize: 15.5,
                  lineHeight: 1.9,
                  letterSpacing: '0.02em',
                  whiteSpace: 'pre-line',
                }}
              >
                {m.lines.join('\n')}
              </p>
              <p className="faint" style={{ margin: 0 }}>
                {t(m.noteZhHant, m.noteEn)}
              </p>
            </div>
          </details>
        ))}
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '歌訣為擁有者提供的參考資料所載，僅取穴名與分類的對應；原件所附的手法、放血、孕期禁忌與主治敘述一律未收錄。教育用途，非治療建議。',
            'The verses come from the owner’s reference file, and only the point-to-category correspondences are carried. The technique, bloodletting, pregnancy and indication commentary printed around them in that file is deliberately not ingested. Educational use, not treatment advice.',
          )}
        </p>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 17 }}>{t('資料狀態與出處', 'Data status & provenance')}</h2>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '所有內容的來源清單、審核狀態說明，以及刻意排除的臨床內容，集中列在「來源與聲明」頁。',
            'The full source list, what each review label means, and the clinical content deliberately left out are all listed on the Sources & disclaimer page.',
          )}
        </p>
        <div className="row">
          <button type="button" className="btn small" onClick={() => setRoute('about')}>
            {t('來源與聲明', 'Sources & disclaimer')} →
          </button>
        </div>
      </section>
    </div>
  );
}
