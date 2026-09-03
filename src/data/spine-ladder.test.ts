import { describe, expect, it } from 'vitest';
// @ts-expect-error -- no node types in the app tsconfig; see nav.test.tsx.
import { readFileSync } from 'node:fs';
import { LANDMARKS, LEVELS, SPINE } from './atlas';
import { quizItems } from './curriculum';

/**
 * The back-view vertebral ladder.
 *
 * Every 背俞穴, every back 督脈 point and 39 膀胱經 points hang off this ladder,
 * so a wrong step size moves a quarter of the atlas at once — silently, because
 * the markers still land in a tidy column and still audit at zero drift. The
 * numbers below are the reasons the ladder has the shape it has.
 */

describe('the vertebral ladder', () => {
  it('steps the lumbar spine wider than the thoracic, by the measured ratio', () => {
    /*
     * Lumbar vertebrae are taller than thoracic ones. A least-squares fit
     * through the spinous-process tips of the HRA reference spine gives
     * 0.03280 m against 0.02676 m — a ratio of 1.225.
     *
     * The ladder used to step 14 px against 13.6, a ratio of 1.029, which is
     * effectively "no difference" and is what this test exists to stop coming
     * back. The tolerance is deliberately loose: the fit's own per-level
     * residual is about 0.13 of a level, so pinning this to three decimals
     * would be claiming precision the measurement does not have.
     */
    const thoracic = SPINE.t(2) - SPINE.t(1);
    const lumbar = SPINE.l(2) - SPINE.l(1);
    expect(lumbar / thoracic).toBeGreaterThan(1.15);
    expect(lumbar / thoracic).toBeLessThan(1.3);
  });

  it('keeps every level evenly spaced within its own segment', () => {
    // Each segment is a uniform ladder; per-level cadaver variation is noise at
    // this scale and would be overfitting one body.
    const gaps = (ys: number[]) => ys.slice(1).map((y, i) => y - ys[i]!);
    const t = gaps([...Array(12)].map((_, i) => SPINE.t(i + 1)));
    const l = gaps([...Array(5)].map((_, i) => SPINE.l(i + 1)));
    const s = gaps([...Array(4)].map((_, i) => SPINE.s(i + 1)));
    for (const seg of [t, l, s]) {
      for (const g of seg) expect(g).toBeCloseTo(seg[0]!, 6);
    }
  });

  it('hangs between the drawn C7 and the drawn coccyx tip', () => {
    /*
     * The ladder's two anchors are features of the figure, not numbers picked
     * to make it fit. T1 sits just below C7 — less than one thoracic level, or
     * 大椎 GV14 at C7 and 陶道 GV13 at T1 would swap places — and the sacral
     * block lands exactly on the drawn coccyx tip.
     */
    expect(SPINE.t(1)).toBeGreaterThan(LANDMARKS.c7);
    expect(SPINE.t(1) - LANDMARKS.c7).toBeLessThan(SPINE.t(2) - SPINE.t(1));
    expect(SPINE.coccyx).toBe(LANDMARKS.coccyxTip);
  });

  it('leaves the navel within half a lumbar interval of L2', () => {
    /*
     * 命門 GV4 is 「與臍相平」 in the reviewed text. The anatomical ladder no
     * longer lands L2 exactly on the drawn navel — the owner chose the ladder
     * over the pin on 2026-08-22 — but the two must stay close enough that the
     * cue is still visibly true on the figure. Half a lumbar interval is the
     * bar; if a later change drifts past it, the teaching text has to move too
     * rather than the drift being absorbed silently.
     */
    const gap = Math.abs(LEVELS.navel - SPINE.l(2));
    expect(gap).toBeLessThan((SPINE.l(3) - SPINE.l(2)) / 2);
    // …and it must still be BELOW L2, which is the direction the anatomy runs.
    expect(LEVELS.navel).toBeGreaterThan(SPINE.l(2));
  });

  it('descends without ever doubling back', () => {
    const ladder = [
      ...[...Array(12)].map((_, i) => SPINE.t(i + 1)),
      ...[...Array(5)].map((_, i) => SPINE.l(i + 1)),
      ...[...Array(4)].map((_, i) => SPINE.s(i + 1)),
      SPINE.coccyx,
    ];
    for (let i = 1; i < ladder.length; i += 1) {
      expect({ i, ascends: ladder[i]! > ladder[i - 1]! }).toEqual({ i, ascends: true });
    }
  });

  it('leaves the sacral block inside the figure it is fitted to', () => {
    /*
     * The lumbar step was widened without moving the drawn coccyx, so the
     * sacrum absorbed the difference. If it ever absorbs too much, 腰俞 GV2 at
     * the sacral hiatus and 長強 GV1 below the coccyx are what fall out of the
     * silhouette first.
     */
    expect(SPINE.s(4)).toBeLessThan(LANDMARKS.sacralHiatus);
    expect(LANDMARKS.sacralHiatus).toBeLessThan(SPINE.coccyx);
    expect(SPINE.coccyx).toBe(LANDMARKS.coccyxTip);
    // Still a sacrum, not a hinge: the four foramina keep a usable spread.
    expect(SPINE.s(4) - SPINE.s(1)).toBeGreaterThan(24);
  });

  it('keeps the one graded navel-to-vertebra item hedged', () => {
    /*
     * qz_navel_level is the only item that MARKS an answer on this
     * correspondence, and the ladder no longer pins L2 to the navel — a learner
     * who measures it on the figure will find the navel a little below the L2
     * line. The reviewed answer stays (it is a palpation cue, and the source
     * says L2), but the wording has to keep saying "about", or the app is
     * grading a precision neither the figure nor a body has.
     *
     * Its six neighbours in curriculum.ts already hedge; this is the one that
     * did not, so it is the one worth pinning.
     */
    const q = quizItems.find((i) => i.id === 'qz_navel_level');
    expect(q).toBeTruthy();
    expect(q!.correctOptionId).toBe('a');
    expect(q!.promptZhHant).toContain('約');
    expect(q!.promptEn).toMatch(/roughly|about|approximate/i);
    // The explanation must say the correspondence is approximate, not merely
    // repeat the answer with a softer verb.
    expect(q!.explanationZhHant).toMatch(/因人而異|概略/);
    expect(q!.explanationEn).toMatch(/approximate|vary/i);
  });

  it('ships the attribution the measurement obliges it to', () => {
    /*
     * The lumbar step is derived from a CC BY 4.0 model, and CC BY attribution
     * has to travel with the derivative — a note in content-review/ does not
     * discharge it, because that file is not what the user receives. If the
     * ladder ever stops being measured this test should be deleted along with
     * the paragraph; until then it must not be possible to drop one and keep
     * the other.
     */
    const about: string = readFileSync('src/views/AboutView.tsx', 'utf8') as string;
    // The comment above the paragraph mentions the licence too, so match on the
    // rendered strings rather than on the file as a whole.
    const rendered = about.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
    expect(rendered).toContain('HuBMAP CCF 3D Reference Object Library');
    expect(rendered).toContain('CC BY 4.0');
    // The named authors are the attribution; a bare project name is not one.
    expect(rendered).toContain('Browne, K.');
    expect(rendered).toContain('Börner, K. (2022)');
    // Both languages, or half the readers get no notice at all.
    expect(rendered).toContain('開放授權的參考脊柱');
  });

  it('gives the sacrum back the room the old step took from it', () => {
    /*
     * The whole point of rescaling. 八髎 (BL31–BL34) sit in the four pairs of
     * posterior sacral foramina, and with a 13.6 px thoracic step the ladder
     * overran its own span and left them 57.9 px to share — the block had been
     * 66 px before that. It now gets about 70.
     */
    const block = SPINE.coccyx - SPINE.l(5);
    expect(block).toBeGreaterThan(66);
    expect(block).toBeLessThan(80);
  });

  it('fits its own span instead of overrunning it', () => {
    /*
     * The failure the rescale exists to prevent: a step chosen independently of
     * the figure. At 13.6 px the 23.6 levels between C7 and the coccyx needed
     * 321 px where 290 exist, and the overrun was silently charged to the
     * sacrum. Walking the ladder must land on the coccyx, not past it.
     */
    expect(SPINE.s(4)).toBeLessThan(SPINE.coccyx);
    // The thoracic step is now derived, so it must not be a round chosen number.
    const step = SPINE.t(2) - SPINE.t(1);
    expect(step).toBeGreaterThan(11.5);
    expect(step).toBeLessThan(13);
  });
});
