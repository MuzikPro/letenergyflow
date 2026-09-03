# Release gate

Two builds, two different questions.

| | build | who sees it | what it carries |
|---|---|---|---|
| **Personal** | `npm run build` | the owner, on this machine | everything, model-written 功效／主治 included |
| **Shared** | `npm run build:shared` | testers behind the gate; later, the public | file-sourced content only |

`npm run build` is the build that must never leave this machine. `CLAUDE.md`
licenses the model-written content for personal study in a private repository
and forbids presenting it to anyone else — and handing out a tester login is
presenting it. Deploy `build:shared`, always.

## What the shared build removes, and how

`vite build --mode shared` aliases `src/data/indications.model.ts` to
`indications.model.empty.ts`. 609 model-written 功效／主治 fields — 336 actions
and 273 indications, across 339 of the 362 loaded points — are gone from the
artifact, not hidden inside it.

That distinction is the whole design. The dataset compiles into the JS bundle,
so a UI that simply declined to draw those fields would still ship every string
to the browser, where devtools reads them out of the chunk in about four
seconds. Only a build-time strip actually removes them.

What survives: 113 file-sourced fields (25 actions, 88 indications) on LU, LI,
ST and SP, each with its citation. `INDICATION_CHANNELS` is derived rather than
listed, so the About page narrows its claimed coverage from fourteen channels to
those four on its own. The anatomical layer is untouched — 362 points, every one
located and `source_checked`.

### Verifying it

    npm run build:shared

which runs `scripts/verify-shared-build.ts` and fails the build if the artifact
still contains any of the 968 strings that belong to the model table alone. The
check has a negative control: run it against a normal `npm run build` and it
must FAIL, reporting all 968. A check that passes on both builds is proving
nothing.

Do not deploy an artifact this script has not passed on.

## Gate 1 — shared build behind the tester gate

Everything here is done.

- [x] Model-written content absent from the artifact — verified by grep against the build, with a negative control
- [x] File-sourced 功效／主治 intact with citations, and never overwritten by a written value
- [x] Coverage claims derived from loaded data, so they cannot overstate a stripped build
- [x] 功效／主治 absent from the search index — a symptom the learner can search is a point recommender however it is worded
- [x] Needling depth, angle, technique, bloodletting and first-aid language excluded at ingest, even mid-sentence
- [x] Educational-use notice present, and not part of what gets stripped
- [x] No outbound request in app code; the service worker caches same-origin assets only
- [x] Progress local to the device, resettable, no telemetry
- [x] Fonts self-hosted under OFL, licence kept beside the file
- [x] 646 tests, typecheck, and both builds green

Operationally: set `TESTER_CREDENTIALS` per `TESTER-GATE.md`, deploy
`build:shared`, and confirm the deployed bundle is the stripped one before
sending anyone a login.

## Gate 2 — ungated public release

**Not met, and mostly not meetable by writing code.** `AGENTS.md` sets these;
this is the honest state of each.

### Blocking, needs a person

- [ ] **Expert review of displayed claims.** No source in the dataset is
      `expert_reviewed` — 32 of 40 are `source_checked` (an editorial pass by
      the owner), 8 are `unreviewed`. Point names, codes, landmarks, routes and
      the 113 surviving 功效／主治 all need a qualified reviewer, with the review
      recorded. This is the largest item and cannot be shortened by tooling.
- [ ] **Jurisdiction-appropriate legal review.** A private study tool and a
      published product marketed in the EU and North America are not judged the
      same way. Carrying traditional indications at all is the part to ask
      about, and the answer may differ per market.
- [ ] **Source reuse terms resolved.** 28 of 40 sources are `reuse_status:
      unknown`, one is `permission_required`, four are
      `publicly_accessible_restricted`. Facts extracted into original wording is
      the project's standing position; it still needs checking per source before
      publication rather than after.
- [ ] **Product-language review** for anything that reads as clinical
      recommendation. The ingest rules held at the data layer; nobody has read
      the assembled UI end to end with this specific question in hand.

### Blocking, doable here

- [ ] **Accessibility pass.** Keyboard, focus, contrast and touch targets are
      built for and partly tested, but no WCAG audit has been run. The
      `accessibility-review` skill can do this.
- [ ] **Multi-device testing on real hardware.** Current coverage is jsdom —
      real assertions, but not a real phone. Nobody has looked at the shared
      build in a browser at either size.
- [ ] **Privacy documentation** matching actual behaviour. The behaviour is
      already right (local-only, no telemetry, no account); what is missing is
      the written statement of it.
- [ ] **Corrections and contact process**, plus versioned content updates. A
      published claim about the body needs a route by which someone can tell you
      it is wrong.

### Already satisfied

- [x] Asset rights: the only third-party asset is Source Serif 4 under OFL,
      self-hosted with its licence. The atlas is original SVG. No AI-generated
      or scraped anatomical imagery.
- [x] No account, sync, or server feature to security-review — the app has no
      backend by design.

## If a partner or creator asks for access

Gate 1, not Gate 2. Send them the stripped build behind the tester gate, and
say plainly that 功效／主治 currently cover four channels because those are the
four the source worksheets reach. That is a more credible thing to show than
full coverage would be: it demonstrates the provenance system working, which is
the part of this project that is hard to copy.

Do not describe the app as expert-reviewed. Nothing in it is, yet.

## How Vercel is held to it

`app/vercel.json` sets `buildCommand` to `npm run build:shared`, so the shared
build is not a thing anyone has to remember — it is the only build the platform
knows how to run for this project.

That command ends in `verify:shared`, which greps the built output and exits
non-zero if it finds a model-written string. A leak therefore **fails the
deploy** rather than shipping: there is no path where the personal build reaches
the CDN by accident.

Checked both ways before it was trusted:

- `npm run build:shared` → PASS, 9 built files against 968 model-only strings.
- `npm run build` then the same verifier → FAIL, 968 strings found, exit 1.

The second is the one that matters. A verifier that passes everything proves
nothing.
