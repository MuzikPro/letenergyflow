import { muShuPair, ORGAN_SEQUENCE, vertebralLevelOf } from './specific-points';
import type { OrganLabel } from './specific-points';
import type { Acupoint } from './types';

/**
 * The 募俞 recall drill.
 *
 * Twelve organs asked from both ends, but NOT symmetrically — because the two
 * directions are not equally hard, and one of them is not hard at all.
 *
 * A back-shu point is named after its organ: 肺俞 is literally "lung shu", and
 * so is its English name. Asking "which point is the lung's back-shu?" and
 * offering 肺俞 among the options answers itself; the first version of this
 * drill did exactly that, and it was obvious the moment it was read on screen.
 * What the name does NOT give away is where the point sits, so that direction
 * asks for the vertebral level instead — the half of the pairing a code alone
 * never teaches.
 *
 * The other direction is genuinely blind: 中府, 巨闕, 京門 and the rest carry no
 * organ in their names, so naming an organ's front-mu is real recall.
 *
 * Every question is generated from the pairing the records already carry, so
 * there is no second copy of the answer key to drift. The deck is
 * DETERMINISTIC: a drill that reshuffled between renders would change its own
 * answer under the learner mid-question, and the spaced-review scheduler needs
 * a stable id per question to track it at all.
 */

/** `level` — given the mu, place the shu. `mu` — given the shu, name the mu. */
export type PairAsk = 'level' | 'mu';

export interface PairOption {
  id: string;
  zhHant: string;
  en: string;
}

export interface PairQuestion {
  /** Stable across sessions — progress and the error notebook key off this. */
  id: string;
  organ: OrganLabel;
  askFor: PairAsk;
  /** The half shown in the prompt. */
  given: Acupoint;
  /** The other half — the answer itself when `askFor` is 'mu'. */
  partner: Acupoint;
  /** The pair's vertebral level, from the shu point's own location text. */
  level: string | null;
  /** Four candidates in a fixed order. */
  options: PairOption[];
  correctOptionId: string;
}

/**
 * Three distractors drawn from the other eleven organs' equivalents.
 *
 * Offsets 1, 4 and 7 are distinct modulo 11, so the three are always distinct
 * from each other and — because the asked organ is excluded from the pool —
 * never the answer.
 */
function pickThree<T>(pool: T[], seat: number): T[] {
  return [1, 4, 7].map((step) => pool[(seat + step) % pool.length]!);
}

/** 「第 3 胸椎棘突下」 from 'T3', in the wording the records themselves use. */
export function levelPhrase(level: string): { zhHant: string; en: string } {
  const n = level.slice(1);
  const zh =
    level[0] === 'T'
      ? `第 ${n} 胸椎棘突下`
      : level[0] === 'L'
        ? `第 ${n} 腰椎棘突下`
        : `平第 ${n} 骶後孔`;
  return { zhHant: zh, en: level };
}

export function pairDrill(): PairQuestion[] {
  const out: PairQuestion[] = [];

  ORGAN_SEQUENCE.forEach((organEn, seat) => {
    const pair = muShuPair(organEn);
    if (!pair) return;
    const level = vertebralLevelOf(pair.shu);
    const others = ORGAN_SEQUENCE.filter((o) => o !== organEn)
      .map((o) => muShuPair(o))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));

    /* --- given the mu, place the shu -------------------------------------- */
    if (level) {
      const wrong = pickThree(
        others.map((p) => vertebralLevelOf(p.shu)).filter((l): l is string => Boolean(l)),
        seat,
      );
      const opts: PairOption[] = wrong.map((l) => ({ id: l, ...levelPhrase(l) }));
      opts.splice(seat % 4, 0, { id: level, ...levelPhrase(level) });
      out.push({
        id: `drill_shu_mu_${organEn.replace(/ /g, '_')}_level`,
        organ: pair.organ,
        askFor: 'level',
        given: pair.mu,
        partner: pair.shu,
        level,
        options: opts,
        correctOptionId: level,
      });
    }

    /* --- given the shu, name the mu --------------------------------------- */
    /*
     * Three mu points sit on their own organ's channel — 中府 LU1, 日月 GB24,
     * 期門 LR14 — so for those the CODE leaks the answer: "the gallbladder's
     * mu" against CV/LR/ST candidates is answered by the letters GB alone.
     * Where another mu shares that channel, force it into the options so the
     * prefix stops discriminating: 京門 GB25 covers 日月, 章門 LR13 covers 期門.
     * 中府 LU1 is the one that cannot be covered — it is the only mu on the
     * Lung channel — and a test records that rather than hiding it.
     */
    const sameChannel = others
      .map((p) => p.mu)
      .filter((m) => m.meridianId === pair.mu.meridianId);
    const pool = others.map((p) => p.mu);
    const wrongMu = sameChannel[0]
      ? [sameChannel[0], ...pickThree(pool.filter((m) => m.id !== sameChannel[0]!.id), seat).slice(0, 2)]
      : pickThree(pool, seat);
    const muOpts: PairOption[] = wrongMu.map((p) => ({
      id: p.id,
      zhHant: `${p.nameZhHant} ${p.code}`,
      en: `${p.nameEn ?? p.code} ${p.code}`,
    }));
    muOpts.splice((seat + 2) % 4, 0, {
      id: pair.mu.id,
      zhHant: `${pair.mu.nameZhHant} ${pair.mu.code}`,
      en: `${pair.mu.nameEn ?? pair.mu.code} ${pair.mu.code}`,
    });
    out.push({
      id: `drill_shu_mu_${organEn.replace(/ /g, '_')}_mu`,
      organ: pair.organ,
      askFor: 'mu',
      given: pair.shu,
      partner: pair.mu,
      level,
      options: muOpts,
      correctOptionId: pair.mu.id,
    });
  });

  return out;
}
