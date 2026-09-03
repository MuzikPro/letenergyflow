/**
 * The empty stand-in for `indications.model.ts`, used by the shared build.
 *
 * `vite build --mode shared` aliases the model module to this one, so the 609
 * model-written 功效／主治 fields are absent from the bundle rather than hidden
 * inside it. Everything downstream already handles their absence: entries are
 * merged UNDER the file-sourced table, `INDICATION_CHANNELS` is derived from
 * what is actually loaded, and the point sheet's "no ingested source records
 * one" line is the same line LU1 and LU9 have always shown.
 *
 * Nothing imports this directly. It is reached only through the alias, which is
 * why it must keep the same shape and export name as the module it replaces.
 */
import type { IndicationEntry } from './indications';

export const modelWritten: Record<string, IndicationEntry> = {};
