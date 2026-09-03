import { dataset } from '../data';
import { CLASSIFICATION_LABELS, REGION_LABELS } from '../data/types';
import type { Acupoint, Dataset, Meridian, TraditionalFunction } from '../data/types';

/**
 * Offline global search.
 *
 * Runs entirely over the locally installed dataset — no network, no index
 * service. Indexes Traditional Chinese, Simplified Chinese, pinyin, English,
 * canonical codes and curated aliases without discarding the displayed forms.
 *
 * Every relationship a result exposes points back at a structured record id;
 * this module never holds a second, untraceable list of associations.
 */

export type ResultType = 'acupoint' | 'meridian' | 'function';

export interface SearchResult {
  type: ResultType;
  id: string;
  score: number;
  /** Which indexed field produced the best match — shown as "matched on …". */
  matchedField: string;
  matchedText: string;
}

export interface GroupedResults {
  query: string;
  acupoints: SearchResult[];
  meridians: SearchResult[];
  functions: SearchResult[];
  total: number;
  /** Human-readable statement of what was actually searched. */
  scopeEn: string;
  scopeZhHant: string;
}

type KeyKind = 'code' | 'name' | 'alias' | 'pinyin' | 'meta';

interface IndexKey {
  text: string;
  norm: string;
  /** Latin text with separators removed, so "he gu" also matches "hegu". */
  compact: string;
  kind: KeyKind;
  label: string;
}

interface SearchDocument {
  type: ResultType;
  id: string;
  keys: IndexKey[];
}

const KIND_WEIGHT: Record<KeyKind, number> = {
  code: 1.15,
  name: 1,
  alias: 0.88,
  pinyin: 0.92,
  meta: 0.55,
};

const CJK = /[㐀-鿿豈-﫿]/;

export const hasCjk = (s: string) => CJK.test(s);

/** Lowercase, strip pinyin tone marks and punctuation, collapse whitespace. */
export function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim();
}

const compactOf = (norm: string) => norm.replace(/\s+/g, '');

function key(text: string | null | undefined, kind: KeyKind, label: string): IndexKey[] {
  if (!text) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];
  const norm = normalize(trimmed);
  if (!norm) return [];
  return [{ text: trimmed, norm, compact: compactOf(norm), kind, label }];
}

/** Levenshtein distance capped at `max`; returns max+1 when it exceeds it. */
export function editDistance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const v = Math.min(prev[j]! + 1, curr[j - 1]! + 1, prev[j - 1]! + cost);
      curr.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev = curr;
  }
  return prev[b.length]!;
}

function buildDocuments(d: Dataset): SearchDocument[] {
  const docs: SearchDocument[] = [];
  const meridianById = new Map(d.meridians.map((m) => [m.id, m]));

  for (const m of d.meridians) {
    docs.push({
      type: 'meridian',
      id: m.id,
      keys: [
        ...key(m.code, 'code', 'code'),
        ...key(m.nameZhHant, 'name', '中文名'),
        ...key(m.nameZhHans, 'name', '简体名'),
        ...key(m.nameEn, 'name', 'English name'),
        ...key(m.pinyin, 'pinyin', 'pinyin'),
        ...m.aliases.flatMap((a) => key(a, 'alias', 'alias')),
        ...m.bodyRegions.flatMap((r) => [
          ...key(r, 'meta', 'body region'),
          ...key(REGION_LABELS[r]?.zhHant, 'meta', '部位'),
        ]),
        ...key(m.route.value.en, 'meta', 'route'),
        ...key(m.route.value.zhHant, 'meta', '循行'),
        ...key(m.element, 'meta', 'element'),
      ],
    });
  }

  for (const p of d.acupoints) {
    const mer = meridianById.get(p.meridianId);
    docs.push({
      type: 'acupoint',
      id: p.id,
      keys: [
        ...key(p.code, 'code', 'code'),
        ...key(p.nameZhHant, 'name', '中文名'),
        ...key(p.nameZhHans, 'name', '简体名'),
        ...key(p.nameEn, 'name', 'English name'),
        ...key(p.pinyin, 'pinyin', 'pinyin'),
        ...p.aliases.flatMap((a) => key(a, 'alias', 'alias')),
        ...key(p.bodyRegion, 'meta', 'body region'),
        ...key(REGION_LABELS[p.bodyRegion]?.zhHant, 'meta', '部位'),
        ...key(mer?.nameZhHant, 'meta', 'meridian'),
        ...key(mer?.nameEn, 'meta', 'meridian'),
        ...key(mer?.code, 'meta', 'meridian'),
        ...key(p.location?.value.zhHant, 'meta', '定位'),
        ...key(p.location?.value.en, 'meta', 'location'),
        ...p.memoryCues.flatMap((c) => [
          ...key(c.value.zhHant, 'meta', '記憶提示'),
          ...key(c.value.en, 'meta', 'memory cue'),
        ]),
        ...(p.classifications?.value ?? []).flatMap((c) => [
          ...key(c.replace(/_/g, ' '), 'meta', 'classification'),
          ...key(CLASSIFICATION_LABELS[c].zhHant, 'meta', '特定穴'),
          ...key(CLASSIFICATION_LABELS[c].en, 'meta', 'classification'),
        ]),
      ],
    });
  }

  for (const f of d.traditionalFunctions) {
    docs.push({
      type: 'function',
      id: f.id,
      keys: [
        ...key(f.labelZhHant, 'name', '主題'),
        ...key(f.labelEn, 'name', 'topic'),
        ...key(f.pinyin, 'pinyin', 'pinyin'),
        ...f.aliases.flatMap((a) => key(a, 'alias', 'alias')),
        ...key(f.description.value.zhHant, 'meta', '說明'),
        ...key(f.description.value.en, 'meta', 'description'),
      ],
    });
  }

  return docs;
}

/** Score one query term against one indexed key. 0 means no match. */
function scoreKey(term: string, k: IndexKey): number {
  const compactTerm = compactOf(term);
  if (!compactTerm) return 0;

  if (k.norm === term || k.compact === compactTerm) return 100;
  // An exact WORD match must outrank a prefix match, or a longer neighbour wins
  // on a shared syllable: 「he gu」 (合谷 LI4) would otherwise tie with
  // 「heng gu」 (橫骨 KI11), because "he" is a prefix of "heng" and both share
  // "gu" — and the tie-break is alphabetical, which puts KI11 first.
  const words = k.norm.split(' ');
  if (words.includes(term)) return 84;
  if (k.compact.startsWith(compactTerm)) return 72;
  if (words.some((w) => w.startsWith(term))) return 66;
  if (k.compact.includes(compactTerm)) return 52;

  // Typo tolerance for Latin terms only — a one-character change in a Chinese
  // name is usually a different point, not a typo.
  if (compactTerm.length >= 4 && !hasCjk(term)) {
    for (const word of k.norm.split(' ')) {
      if (word.length >= 3 && editDistance(word, term, 1) <= 1) return 34;
    }
    if (k.compact.length <= compactTerm.length + 2 && editDistance(k.compact, compactTerm, 1) <= 1) {
      return 32;
    }
  }
  return 0;
}

export class SearchIndex {
  private readonly docs: SearchDocument[];
  private readonly data: Dataset;

  constructor(data: Dataset = dataset) {
    this.data = data;
    this.docs = buildDocuments(data);
  }

  get documentCount(): number {
    return this.docs.length;
  }

  search(rawQuery: string, limitPerGroup = 8): GroupedResults {
    const query = rawQuery.trim();
    const empty: GroupedResults = {
      query,
      acupoints: [],
      meridians: [],
      functions: [],
      total: 0,
      scopeEn: this.data.scopeLabelEn,
      scopeZhHant: this.data.scopeLabelZhHant,
    };
    if (!query) return empty;

    // CJK queries are split per character as well as kept whole, so 「合谷」 and
    // 「合」 both find the point.
    const normQuery = normalize(query);
    const terms = hasCjk(query) ? [normQuery] : normQuery.split(' ').filter(Boolean);
    if (terms.length === 0) return empty;

    const hits: SearchResult[] = [];
    for (const doc of this.docs) {
      let total = 0;
      let best: { score: number; k: IndexKey } | null = null;
      let matchedAllTerms = true;

      for (const term of terms) {
        let termBest = 0;
        let termKey: IndexKey | null = null;
        for (const k of doc.keys) {
          const s = scoreKey(term, k) * KIND_WEIGHT[k.kind];
          if (s > termBest) {
            termBest = s;
            termKey = k;
          }
        }
        if (termBest === 0) {
          matchedAllTerms = false;
          break;
        }
        total += termBest;
        if (!best || termBest > best.score) best = { score: termBest, k: termKey! };
      }

      if (!matchedAllTerms || !best) continue;
      hits.push({
        type: doc.type,
        id: doc.id,
        score: total / terms.length,
        matchedField: best.k.label,
        matchedText: best.k.text,
      });
    }

    const pick = (t: ResultType) =>
      hits
        .filter((h) => h.type === t)
        .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
        .slice(0, limitPerGroup);

    const acupointsOut = pick('acupoint');
    const meridiansOut = pick('meridian');
    const functionsOut = pick('function');

    return {
      query,
      acupoints: acupointsOut,
      meridians: meridiansOut,
      functions: functionsOut,
      total: acupointsOut.length + meridiansOut.length + functionsOut.length,
      scopeEn: this.data.scopeLabelEn,
      scopeZhHant: this.data.scopeLabelZhHant,
    };
  }
}

export const searchIndex = new SearchIndex();

/* -------------------------------------------------------------------------- */

/** Everything a function/topic result should highlight, resolved to records. */
export interface FunctionExpansion {
  fn: TraditionalFunction;
  acupoints: Acupoint[];
  meridians: Meridian[];
  /** Relation ids so the UI can surface provenance for each association. */
  relationIds: string[];
}

export function expandFunction(
  functionId: string,
  d: Dataset = dataset,
): FunctionExpansion | null {
  const fn = d.traditionalFunctions.find((f) => f.id === functionId);
  if (!fn) return null;
  const rels = d.functionRelations.filter((r) => r.functionId === functionId);
  return {
    fn,
    acupoints: rels
      .filter((r) => r.targetType === 'acupoint')
      .map((r) => d.acupoints.find((p) => p.id === r.targetId))
      .filter((p): p is Acupoint => Boolean(p)),
    meridians: rels
      .filter((r) => r.targetType === 'meridian')
      .map((r) => d.meridians.find((m) => m.id === r.targetId))
      .filter((m): m is Meridian => Boolean(m)),
    relationIds: rels.map((r) => r.id),
  };
}
