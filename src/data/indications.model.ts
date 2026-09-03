/**
 * 功效／主治 written from general knowledge — EMPTY in this distribution.
 *
 * In the private origin repository this module holds model-written 功效／主治
 * for the points no ingested file covers, licensed for one person's study and
 * never for publication. The open-source code set therefore ships this file
 * with no entries: the content it would carry is exactly the content that must
 * not be presented to anyone else as reference material. A public entry for
 * those points has to come from a real ingested source, citing that source —
 * never from filling this table back in.
 *
 * The module boundary is kept (rather than deleting the file) so the code sets
 * stay diff-compatible: everything downstream — the merge UNDER the
 * file-sourced table, `INDICATION_CHANNELS`, the point sheet's "no ingested
 * source records one" line — already handles absence, and
 * `vite build --mode shared` still aliases this module to
 * `indications.model.empty.ts`, which is identical here by construction.
 *
 * Rules that hold if content ever returns to this file in a private fork:
 *  - entries cite `src_model_unverified` and never a text;
 *  - they merge UNDER the file-sourced table, never over it;
 *  - no needling technique, depth, angle, bloodletting, moxibustion,
 *    first-aid or pregnancy framing;
 *  - builds that leave the machine use `npm run build:shared`, whose verifier
 *    greps the artifact to prove the strings are absent.
 */
import type { IndicationEntry } from './indications';

export const modelWritten: Record<string, IndicationEntry> = {};
