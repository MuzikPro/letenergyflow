# Data licence — CC BY-SA 4.0

This repository carries two kinds of work under two licences:

- **Code** — application logic, components, build scripts, tests — is licensed
  under the **Apache License 2.0** ([LICENSE](LICENSE)).
- **The curated dataset** is licensed under **Creative Commons
  Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**:
  <https://creativecommons.org/licenses/by-sa/4.0/legalcode>

## What "the dataset" means

The curated content carried by the files in `src/data/` and by any export
derived from them:

- point and meridian names (繁體, 简体, pinyin, English), codes and aliases;
- the reviewed 定位 location texts and this project's English renderings;
- route descriptions, classifications (五輸穴, 原絡郄, 募俞, …), pairings,
  the 子午流注 table, the extraordinary-vessel records and 歌訣 entries;
- schematic coordinates, anchors and bone-cun scales;
- the provenance records themselves (`sources.ts`, per-field `sourceIds`,
  review statuses, notes).

The TypeScript scaffolding those files use to hold the content (types,
validators, derivations) is code, and stays Apache-2.0. The split is by kind
of work, not by file extension.

## Attribution and share-alike

Reuse of the dataset requires attribution to **"the Let Energy Flow authors"**
with a link back to this repository, and derived datasets must be shared under
CC BY-SA 4.0. Provenance fields are part of the dataset: a redistribution that
strips `sourceIds` and review statuses from the content is not this dataset
minus metadata — it is this dataset minus the property that makes it safe to
teach from. Keep them attached.

## What is NOT covered

- Quotations from classical texts (《靈樞》, 《難經》, 《針灸甲乙經》,
  《奇經八脈考》, 《針灸大成》) are public domain; this licence claims nothing
  over them, only over this project's selection, arrangement and annotation.
- The HuBMAP-derived vertebral spacing proportions remain under their own
  CC BY 4.0 terms (see [NOTICE](NOTICE)).
- The bundled Source Serif 4 font remains under the SIL OFL 1.1
  (`public/fonts/OFL-Source-Serif-4.md`).

## A caution for reusers

The dataset is **educational material with per-record review status**, most of
it `source_checked` by the project owner and none of it independently
expert-reviewed. Coordinates are schematic layout positions
(`schematic_unvalidated`), not anatomical measurements. The licence lets you
reuse the data; it does not upgrade what the data claims to be.
