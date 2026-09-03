import { describe, expect, it } from 'vitest';
import { dataset } from './index';
import {
  CHANNEL_GROUPS,
  PAIRS,
  TWELVE,
  VESSEL_CHANNELS,
  isFoot,
  isHand,
  isYang,
  isYin,
} from './channel-groups';

/**
 * The groupings behind the layer panel's filters.
 *
 * All of it is read out of the reviewed channel names, so what needs guarding
 * is that the reading is right and stays exhaustive: every one of the twelve
 * must land in exactly one half of each split, or a filter silently drops a
 * channel the learner asked to see.
 */

describe('the twelve, carved up', () => {
  it('is the twelve — the two vessels are not regular channels', () => {
    expect(TWELVE).toHaveLength(12);
    expect(VESSEL_CHANNELS.map((m) => m.code).sort()).toEqual(['CV', 'GV']);
    expect(TWELVE.some((m) => m.id === 'mer_cv' || m.id === 'mer_gv')).toBe(false);
    expect(TWELVE.length + VESSEL_CHANNELS.length).toBe(dataset.meridians.length);
  });

  it('splits hand from foot with nothing left over', () => {
    // 手 and 足 are the first character of every one of the twelve names. If a
    // name is ever rewritten, this is where the filter stops being exhaustive.
    for (const m of TWELVE) {
      expect({ code: m.code, hand: isHand(m), foot: isFoot(m) }).toEqual({
        code: m.code,
        hand: !isFoot(m),
        foot: !isHand(m),
      });
    }
    expect(TWELVE.filter(isHand)).toHaveLength(6);
    expect(TWELVE.filter(isFoot)).toHaveLength(6);
  });

  it('splits yin from yang with nothing left over', () => {
    for (const m of TWELVE) {
      expect({ code: m.code, both: isYin(m) && isYang(m) }).toEqual({ code: m.code, both: false });
      expect({ code: m.code, neither: !isYin(m) && !isYang(m) }).toEqual({
        code: m.code,
        neither: false,
      });
    }
    expect(TWELVE.filter(isYin).map((m) => m.code)).toEqual(['LU', 'SP', 'HT', 'KI', 'PC', 'LR']);
    expect(TWELVE.filter(isYang).map((m) => m.code)).toEqual(['LI', 'ST', 'SI', 'BL', 'TE', 'GB']);
  });

  it('crosses the two splits into the four threes', () => {
    // 手三陰, 手三陽, 足三陰, 足三陽 — the grid the curriculum teaches, and every
    // channel in exactly one cell.
    const cells = ['hand_yin', 'hand_yang', 'foot_yin', 'foot_yang'].map(
      (id) => CHANNEL_GROUPS.find((g) => g.id === id)!,
    );
    for (const c of cells) expect({ id: c.id, n: c.members.length }).toEqual({ id: c.id, n: 3 });
    const covered = cells.flatMap((c) => c.members.map((m) => m.code));
    expect(new Set(covered).size).toBe(12);
  });

  it('names six 表裡 couples, each once, one yin and one yang', () => {
    /*
     * 表 IS the yang half and 裡 the yin half, so the panel offers no 表/裡
     * split — it would duplicate 陽經/陰經 exactly. The couples are what the
     * pairing adds, and each must appear once: keying off the yin member is
     * what stops LU·LI and LI·LU both being emitted.
     */
    expect(PAIRS).toHaveLength(6);
    for (const p of PAIRS) {
      expect({ yin: p.yin.code, isYin: isYin(p.yin) }).toEqual({ yin: p.yin.code, isYin: true });
      expect({ yang: p.yang.code, isYang: isYang(p.yang) }).toEqual({
        yang: p.yang.code,
        isYang: true,
      });
      // The pairing is symmetric in the records, so it must round-trip.
      expect(p.yang.pairedMeridianId).toBe(p.yin.id);
    }
    expect(new Set(PAIRS.flatMap((p) => [p.yin.code, p.yang.code])).size).toBe(12);
  });

  it('gives every group a non-empty, distinct membership', () => {
    for (const g of CHANNEL_GROUPS) {
      expect({ id: g.id, n: g.members.length > 0 }).toEqual({ id: g.id, n: true });
      expect({ id: g.id, unique: new Set(g.members.map((m) => m.id)).size }).toEqual({
        id: g.id,
        unique: g.members.length,
      });
    }
    expect(new Set(CHANNEL_GROUPS.map((g) => g.id)).size).toBe(CHANNEL_GROUPS.length);
  });
});
