# Contributing to Let Energy Flow

Contributions are welcome. This project has a small number of hard rules that
are not up for negotiation in a PR, because they are what keeps an acupoint
memorisation app on the right side of the line between *education* and
*treatment advice*. Most of them are enforced by tests — a PR that crosses one
should fail CI before it fails review.

## The red lines

**1. The app never recommends points for symptoms.** No symptom→point lookup,
no "commonly used for", no feature that answers "I have a headache" with a
point. In particular, 主治 content must never enter the search index: a
searchable symptom is a treatment recommender no matter how each entry is
worded. `indications.test.ts` ("never becomes a symptom index") pins this.

**2. No invasive technique content.** Needling depth, angle or technique,
bloodletting, moxibustion instruction, electrical stimulation, first-aid
framing, and pregnancy or emergency treatment stay out — even when a source
puts them in the same sentence as content we keep. Tests ban the wording in
both languages.

**3. Every content string traces to a cited source.** All curated content
carries `sourceIds` into `src/data/sources.ts`, plus a review status. Nothing
is written from memory — not yours, not an LLM's. `indications.model.ts` ships
empty in this repository and stays empty: an invariant test fails if any field
cites `src_model_unverified`. Filling a gap means ingesting a real source and
citing it, and text from copyrighted modern works (textbooks, standards,
course handbooks) cannot be pasted in — facts restated in project wording,
with the work cited as reference, is the pattern in use.

**4. Coordinates come from landmarks, never from eyeballing.** Every point is
placed as a fixed anatomical landmark plus a bone-cun distance taken from that
point's own reviewed 定位 text, via the anchor table `A` in
`src/data/acupoints.ts`. After any placement change run:

```bash
npx tsx scripts/audit-landmarks.ts --all
```

Zero drift on every cun-stated point is the acceptance bar. Coordinates remain
`schematic_unvalidated` — do not present them as anatomically validated.

**5. No single authority is privileged.** GB/T, WHO, classical texts and
educational works are reconciled per record; disagreements are recorded, not
silently resolved in favour of a favourite.

**6. Honest status, always.** A reviewed "none" is different from a blank.
Never mark content reviewed, sourced or validated unless that actually
happened, and never let a claim's neighbours upgrade its status.

## About the skipped tests

A handful of suites in `src/data/indications.test.ts` verify curated strings
character-by-character against private course worksheets that are not part of
this repository (they are someone's copyrighted curriculum). Those suites
detect the files are absent and skip; every dataset-only safety guard still
runs here. If you touch 功效/主治 data, say so in the PR so it can be checked
against the sources upstream.

## Practicalities

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # the full suite — the bar for every PR
npm run typecheck
npm run build:shared # the deploy build + leak verifier
```

- Keep changes minimal and focused; avoid speculative infrastructure.
- Match the surrounding code's idiom and comment style — comments state
  constraints the code can't, not narration.
- Content changes need a test that pins the new behaviour, and layout changes
  must not touch content records (`atlas.ts`/`network.ts` draw; `acupoints.ts`/
  `meridians.ts` mean — a test keeps them in sync).
- Local-first is a feature: no telemetry, no analytics, no network calls at
  runtime, no accounts.

## Licensing of contributions

Code contributions are accepted under the Apache License 2.0
([LICENSE](LICENSE)); dataset contributions under CC BY-SA 4.0
([LICENSE-DATA.md](LICENSE-DATA.md)). By submitting a PR you agree your
contribution is licensed accordingly, and that you have the right to submit
it — which for data means you ingested and cited a source you are allowed to
restate, not one you copied.
