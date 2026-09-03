import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { acupointById, dataset } from './index';
import { SHICHEN } from './shichen';
import { memoryStorage } from '../state/progress';
import { StoreProvider } from '../state/store';
import LearnView from '../views/LearnView';

afterEach(cleanup);

const wrap = (ui: React.ReactNode) => (
  <StoreProvider storage={memoryStorage()}>{ui}</StoreProvider>
);

const day13 = () => dataset.curriculumDays.find((d) => d.id === 'day_13')!;
const cards13 = () => dataset.flashcards.filter((f) => f.dayId === 'day_13');
const quiz13 = () => dataset.quizItems.filter((q) => q.dayId === 'day_13');

/**
 * Day 13's compliance contract.
 *
 * The lesson teaches a scheme whose traditional purpose — timing treatment — is
 * exactly what this app refuses to do, so the boundary has to be enforced by
 * something other than good intentions in the prose.
 */
describe('day 13 — label copy', () => {
  it('frames every hour as a phase, never as something to treat', () => {
    /*
     * Requirement 1: no "select this hour to treat X" phrasing anywhere in the
     * day's own content. The words may appear ONLY where the text is saying
     * what the app does not do.
     */
    const items: string[] = [];
    for (const s of day13().sections) for (const b of s.body) items.push(`${b.zhHant} ${b.en}`);
    for (const f of cards13()) items.push(`${f.frontZhHant} ${f.frontEn} ${f.backZhHant} ${f.backEn}`);
    for (const q of quiz13()) {
      items.push(`${q.promptZhHant} ${q.promptEn} ${q.explanationZhHant} ${q.explanationEn}`);
      for (const o of q.options) items.push(`${o.zhHant} ${o.en}`);
    }

    const clinical = ['治療', '主治', '療效', 'treat', 'cure', 'therapy', 'remedy'];
    const disclaiming = /不提供|不做|未收錄|NOT INGESTED|does not|not taught|never examined|out of scope|排除|非療效/i;
    for (const text of items) {
      const hit = clinical.find((w) => text.toLowerCase().includes(w.toLowerCase()));
      if (!hit) continue;
      expect({ hit, text: text.slice(0, 60), disclaimed: disclaiming.test(text) }).toEqual({
        hit,
        text: text.slice(0, 60),
        disclaimed: true,
      });
    }
  });

  it('describes 開穴 / 閉穴 as a rhythm, not a switch to act on', () => {
    const blob = JSON.stringify(day13()) + JSON.stringify(cards13());
    // The concept is in scope; using it to choose when to needle is not.
    expect(blob).toMatch(/開穴|閉穴/);
    for (const banned of ['按時取穴', '開穴閉穴的用法', 'when to needle', 'timed point selection']) {
      expect(blob).not.toContain(banned);
    }
  });
});

describe('day 13 — compliance notice', () => {
  it('carries the required notice on the day record, in both languages', () => {
    // Requirement 2, stored on the day rather than hardcoded in a view, so the
    // lesson page and any other surface render the same sentence.
    const d = day13();
    expect(d.noticeZhHant).toBeTruthy();
    expect(d.noticeEn).toBeTruthy();
    expect(d.noticeEn!).toMatch(/spatiotemporal framework/i);
    expect(d.noticeEn!).toMatch(/does not provide clinical diagnostic guidance/i);
    expect(d.noticeEn!).toMatch(/treatment recommendations of any kind/i);
    expect(d.noticeZhHant!).toMatch(/時空框架/);
    expect(d.noticeZhHant!).toMatch(/不提供任何臨床診斷指引或治療建議/);
  });

  it('renders it at the top of the lesson, above the first section', () => {
    const { container } = render(wrap(<LearnView />));
    // Days are reached from the course index, which is rendered inside a
    // closed <details> — closed, but present in the DOM and clickable.
    fireEvent.click(screen.getByRole('button', { name: /^Day 13$|^第 13 天$/ }));

    const notice = container.querySelector('.notice-day')!;
    expect(notice).toBeTruthy();
    expect(notice.textContent).toMatch(/spatiotemporal framework|時空框架/);

    // Above the first lesson section, not buried under it.
    const firstSection = container.querySelector('section.panel')!;
    expect(
      notice.compareDocumentPosition(firstSection) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('shows no day notice on a day that has none', () => {
    // The block is conditional; every day carrying an identical extra banner
    // would make the one that matters invisible.
    const { container } = render(wrap(<LearnView />));
    fireEvent.click(screen.getByRole('button', { name: /^Day 1$|^第 1 天$/ }));
    expect(container.querySelector('.notice-day')).toBeNull();
    // The standing educational-use notice is still there.
    expect(container.querySelector('.notice')).toBeTruthy();
  });
});

describe('day 13 — data consistency', () => {
  it('cross-links every referenced point to a loaded acupoint record', () => {
    // Requirement 3. Checked across ALL days, not just 13, so the guard does
    // not have to be remembered when the next day is written.
    const dangling: string[] = [];
    for (const f of dataset.flashcards) {
      for (const id of f.relatedAcupointIds) {
        if (!acupointById.has(id)) dangling.push(`${f.dayId}/${f.id} → ${id}`);
      }
    }
    for (const q of dataset.quizItems) {
      if (q.targetAcupointId && !acupointById.has(q.targetAcupointId)) {
        dangling.push(`${q.dayId}/${q.id} → ${q.targetAcupointId}`);
      }
      for (const id of q.relatedAcupointIds) {
        if (!acupointById.has(id)) dangling.push(`${q.dayId}/${q.id} → ${id}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  it('draws Day 13 only on channels already taught in Days 1–12', () => {
    // A review day must not introduce a point from a channel the learner has
    // never met. Days list the channels they teach, and a point belongs to a
    // channel, so that is the chain this walks.
    const taught = new Set<string>();
    for (const d of dataset.curriculumDays) {
      if (d.dayNumber >= 13) continue;
      for (const id of d.meridianIds) taught.add(id);
    }
    expect(taught.size).toBe(14);
    const referenced = new Set<string>([
      ...cards13().flatMap((f) => f.relatedAcupointIds),
      ...quiz13().flatMap((q) => q.relatedAcupointIds),
      ...quiz13().map((q) => q.targetAcupointId).filter((x): x is string => Boolean(x)),
    ]);
    expect(referenced.size).toBeGreaterThan(0);
    for (const id of referenced) {
      const p = acupointById.get(id)!;
      expect({ code: p.code, taughtEarlier: taught.has(p.meridianId) }).toEqual({
        code: p.code,
        taughtEarlier: true,
      });
    }
  });

  it('never pairs an hour with the wrong channel', () => {
    /*
     * Checked on the flashcards, which are structurally a pairing: the front
     * asks 「X時（HH:HH–HH:HH）配哪一條經？」 and the back answers with the
     * channel. That is precise. Scanning the lesson prose instead was not —
     * a quiz prompt names three hours and withholds their channels on purpose,
     * and a sentence about the cycle closing names 肺經 while discussing 丑時.
     * Both are correct writing, and both broke a naive proximity check.
     */
    const asked = cards13().filter((f) => /^.時（/.test(f.frontZhHant));
    expect(asked.length).toBeGreaterThanOrEqual(3);

    for (const f of asked) {
      const branch = f.frontZhHant[0]!;
      const s = SHICHEN.find((x) => x.branchZhHant === branch);
      expect({ front: f.frontZhHant.slice(0, 6), known: Boolean(s) }).toEqual({
        front: f.frontZhHant.slice(0, 6),
        known: true,
      });
      const m = dataset.meridians.find((x) => x.id === s!.meridianId)!;
      expect({ branch, answer: f.backZhHant.startsWith(m.nameZhHant) }).toEqual({
        branch,
        answer: true,
      });
      // And the hours quoted on the card are the ones the clock holds.
      expect(f.frontZhHant).toContain(String(s!.startHour).padStart(2, '0'));
    }
  });
});
