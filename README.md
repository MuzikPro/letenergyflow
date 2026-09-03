# Let Energy Flow — all fourteen channels

A local-first, offline, installable web app for memorising TCM meridians and
acupoints. **Educational use only** — it does not diagnose, does not recommend
points for symptoms, and contains no invasive technique instructions.

## Run it

```bash
cd "app"
npm install     # first time only
npm run dev     # http://localhost:5173
```

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest run
npm run build       # typecheck + production build into dist/
npm run preview     # serve the production build (service worker active here)
```

No account, no server, no analytics. Progress lives in this browser's
`localStorage` and can be exported or erased from the Settings screen (⛭).
The interface renders in a single language by default (following the device
locale); 中文, English, or bilingual display can be chosen in Settings.
The Latin display face is Source Serif 4 (SIL OFL 1.1 — licence at
`public/fonts/OFL-Source-Serif-4.md`); CJK text uses system fonts.

## What's in this slice

All fourteen: **手太陰肺經 (LU, 11)**, **手陽明大腸經 (LI, 20)**, **足陽明胃經
(ST, 45)**, **足太陰脾經 (SP, 21)**, **手少陰心經 (HT, 9)**, **手太陽小腸經
(SI, 19)**, **足太陽膀胱經 (BL, 67)**, **足少陰腎經 (KI, 27)**, **手厥陰心包經
(PC, 9)**, **手少陽三焦經 (TE, 23)**, **足少陽膽經 (GB, 44)**, **足厥陰肝經
(LR, 14)**, **任脈 (CV, 24)** and **督脈 (GV, 29 points)** — **362 points across
all fourteen channels.** The set the curriculum teaches is complete, and the
13-day course now runs end to end: ten channel days, a specific-point review
(Day 11), a whole-set consolidation (Day 12) and the 子午流注 clock (Day 13).

Two structural facts the dataset now enforces:

- Every one of the twelve regular channels names its interior–exterior partner,
  and each pairing is reciprocal. The two midline vessels have **no** partner by
  definition, and a test asserts that null is correct there rather than missing.
- The vessels are anchored to exactly the landmarks the lateral points were
  measured against — the umbilicus, the intercostal spaces, the SPINE ladder,
  the two hairlines. A point at 「旁開 N 寸」 and the midline it counts from now
  share one source of truth, so they cannot drift apart.

The Governor uses the **GB/T 12346-2006 29-point set**, which adds 印堂 as GV29;
the WHO 1989 28-point alternative is recorded on that record. Under current
numbering GV23 is 上星, not 印堂.

Day 8 is the first channel located largely by PROPORTION rather than bone-cun:
頷厭/懸顱/懸釐 quarter the 頭維→曲鬢 curve, 浮白/頭竅陰 third the 天衝→完骨
curve, and 環跳 sits at the outer third of the trochanter-to-sacral-hiatus line.
Those are computed as ratios between anchored endpoints, not estimated.

Day 7 completes both arm surfaces: three lines on each face, the new pair taking
the midlines. 內關 PC6 and 外關 TE5 sit at the same 2 寸 above their own wrist
creases, one palmar and one dorsal.

Day 6 closes the Bladder record's missing interior–exterior pair, and its
abdominal run is the tidiest cun chain in the dataset: eleven stations one cun
apart at a constant 0.5 寸 from the midline, anchored on the umbilicus alone.

Day 5 adds no new points: the handbook teaches the Bladder over two days, but a
channel is one unit — its route order and network line need all 67 stations at
once — so the whole channel loaded on Day 4 and Day 5 is a lesson over data that
already exists. It also completes the 四總穴歌: 委中 BL40 was the last of the
four command points to load.

Day 4 introduces the **back view** as real content. The Bladder back-shu
points are placed off a vertebral ladder (T1–T12, L1–L5, S1–S4) on the two
paravertebral lines at 1.5 and 3 cun, calibrated against the two landmarks the
worksheet states: the navel is level with L2 and the iliac crest with L4. Both
SI and BL are drawn as **multiple per-view segments** rather than one line —
SI crosses to the scapula and back, and modern BL numbering doubles back up
the second line at BL41 — so no route is drawn straight through the body.

| Area | State |
| --- | --- |
| Extremity detail views | Hotspot on each hand and foot opens a zoomed modal that renders the SAME geometry through a tighter viewBox; every 井穴 / 滎穴 / 輸穴 label fits, staggered into free slots with leader lines |
| Topic info cards | Two-column: mapping as text on the left, minimal avatar with floating annotation boxes on the right |
| SVG body atlas | Original 7.5-head mannequin with face, joint contours and articulated hands/feet; front/back views, zoom / pan / fit, keyboard + touch, meridian layer toggles, list-view equivalent |
| Global search | Offline, grouped into points / meridians / topics; matches code, 繁體, 简体, pinyin, English, alias, region, landmark; one-character typo tolerance on Latin queries |
| Search → camera | Point result centres and magnifies with neighbours kept visible; meridian result fits the whole route and quiets the others; topic result highlights every loaded related record |
| Energy network map | Subway-style, stations read from the same records, station → atlas cross-link, ordered text equivalent |
| 流注 Flow (子午流注) | Twelve-hour clock: follows system time, or drag/tap the ring, arrow-key it, or swipe the figure. Front AND back shown together — a channel crosses between the faces, so a toggle would hide part of what is lit — each with the hour's channel on BOTH sides, mirrored from the canonical geometry, never a second coordinate set; everything else at 0.18. Above 1080px the three columns are vertically centred and the whole view fits one screen without scrolling. Educational only: which channel the tradition assigns to an hour, no treatment-timing or lifestyle guidance |
| Learning loop | Day 1–13 lessons with a day picker, 93 flashcards, locate-the-point on the atlas, 81 quiz items with explanatory feedback |
| 特定穴 matrix (Day 11) | Six tabs — 五輸穴 / 原絡郄 / 募俞 / 八會穴 / 八脈交會 / 下合穴 — built in `specific-points.ts` from each point's reviewed `classifications`, never authored twice; row order follows the flow sequence; off-channel 募穴 flagged; every cell sets the atlas focus. `specific-points.test.ts` fails if a category stops being complete or a label outlives its record |
| Review | 1-3-7-14-30 spacing, per-item boxes, per-point mastery, error notebook with a "why did I mix these up" field |
| Design | "Atlas Editorial" system: paper-first light + warm ink dark theme, Source Serif 4 display type, glow-ring markers with a breathing pulse on the active point; single-language rendering (device default, 中文 / English / bilingual in Settings ⛭); mobile bottom bar → desktop left rail; reduced-motion respected |

## Placement rule — landmark first, always

Every acupoint coordinate is derived from a **fixed surface landmark plus a
bone-cun (骨度分寸) distance**, taken from that point's own reviewed 定位 text.
No coordinate is estimated by eye. `src/data/acupoints.ts` holds a single
anchor table `A`; a test fails the build if any entry in it is a bare
`{ x: …, y: … }` literal.

```bash
npx tsx scripts/audit-landmarks.ts --all
```

The audit re-reads all 362 定位 texts, extracts the distance and the landmark
it is measured **from**, and compares it with what the marker implies. All 171
points that state a bone-cun distance currently sit at **0.0 cun drift**; the
other 191 are located qualitatively (a knuckle, a nail corner, a palpable
depression) and are anchored to the drawn extremity, face and spine frames
instead. `src/data/landmark.test.ts` enforces both halves on every run.

Landmarks and per-segment scales live in `src/data/atlas.ts`:

| Segment | Landmarks | Official cun |
| --- | --- | --- |
| Upper arm | 腋前紋頭 → 肘橫紋 | 9 |
| Forearm | 肘橫紋 → 腕橫紋 | 12 |
| Thigh | 大轉子 → 膕橫紋 | 19 |
| Posterior thigh | 臀下橫紋 → 膕橫紋 | 14 |
| Lower leg (lateral) | 膕橫紋 → 外踝尖 | 16 |
| Lower leg (medial) | 脛骨內側髁 → 內踝尖 | 13 |
| Chest | 胸骨上窩 → 胸劍聯合 | 9 |
| Upper abdomen | 胸劍聯合 → 臍中 | 8 |
| Lower abdomen | 臍中 → 恥骨聯合上緣 | 5 |
| Chest width | 兩乳頭之間 | 8 |
| Head | 眉心 → 前髮際 | 3 |

Bone-cun is a **proportional** system: each segment is divided into its own
fixed number of units, so one cun is a different number of pixels in each. Each
scale is therefore derived from the two landmarks bounding its own segment,
which is what lets a point land at its stated distance from its own anchor even
where the schematic's proportions differ from a body's — and they do, because
the figure is drawn to a 7.5-head artistic canon, not to bone-cun.

**Known schematic distortions**, all documented in the source: the drawn navel
sits high, so one cun of lower abdomen is about twice one cun of upper abdomen;
the front view flattens the scalp arc to an even ladder (a true projection
would collapse BL4 and BL5 into each other); the neck is narrower than a body's,
so 扶突 / 人迎 / 天鼎 / 天窗 are offset by the neck's own width rather than by
trunk cun. Landmark anchoring makes coordinates reproducible and internally
consistent — it does **not** make them validated anatomical coordinates, and
every placement stays `schematic_unvalidated`.

## Two review statuses, not one

A record's **content** status and its **marker coordinate** status are separate,
and the app reports them separately:

- The 定位 text can be `source_checked` while the dot on the figure is still a
  layout position. Every placement is `schematic_unvalidated` today, stated per
  point in its detail panel, and stays that way until someone measures it.
- The distinction is wired to the data, not to a flag: a measured coordinate
  renders with a filled centre and says so in its accessible name. Nothing shows
  that treatment yet — which is the honest state, not a missing feature —
  and `open-items.test.ts` proves it activates when a status changes.

A **reviewed "none"** is also distinct from a blank. 天池 PC1 and 三陽絡 TE8
carry no specific-point category *because the editorial pass determined they
have none*, so they read 「無（經編審確認）」 rather than 「尚未記錄」. Fields
nobody has looked at still read as not recorded.

## Content status — read this before trusting anything on screen

**Content is `source_checked` (owner editorial passes, 2026-08-05 → 2026-08-07), not
expert-reviewed.** No independent qualified reviewer has signed off yet, and
the app shows each record's own status.

- **Names, codes, route order** — restated in the project's own wording from
  long-circulating classical material. Not yet reconciled against a current
  point-location standard (candidates: GB/T 12346-2021, GB/T 22163-2008, Hong
  Kong Chinese-medicine clinical terminology, professional examination
  bibliographies). No single source is treated as authoritative.
- **Locations** — all 362 points carry locations from the owner's editorial
  worksheets (`content-review/`, 2026-08-05 → 2026-08-07), which cite
  GB/T 12346-2021 per entry; status `source_checked`. English wording is the
  project's own translation of the reviewed 中文 and is itself unreviewed.
  Clinical indications, needling technique and contraindication content in
  the worksheet's remark fields was deliberately NOT ingested.
- **Atlas coordinates** — layout positions on this project's schematic figure,
  flagged `schematic_unvalidated`. They are *not* validated anatomical
  coordinates and must not be used to find a point on a body.
- **Traditional functions** — recorded as mnemonic/teaching associations with
  their sources, framed as education, never as guidance.

The 子午流注 hour-to-channel table (`src/data/shichen.ts`) is not in the handbook.
It comes from **《針灸大成·十二經納地支歌》** (Yang Jizhou, Ming) and went through
the owner's editorial pass on **2026-08-08**
(`content-review/worksheet-ziwu-liuzhu-filled-2026-08-08.md`), which confirmed all
twelve pairings unchanged and supplied the explanatory copy, the twelve per-hour
lines and the disclaimer — so it is `source_checked`. Its channel ORDER is
additionally checked against the flow sequence already in the dataset, and the
verse itself is asserted against the table, so neither can drift from the other.

Two decisions from that pass are worth knowing:

- **Clock time, not true solar time.** The classical scheme reckons by 真太陽時,
  which drifts from standard time with longitude. The app displays ordinary clock
  hours and says so on the page; no conversion is implemented, because the app
  times nothing.
- **Day 13 teaches the table; the methods built on it are still excluded.** The
  owner's worksheet originally kept this out of the course entirely. That was
  superseded by the Day 13 brief, which teaches the pairings and the verse —
  and only those. The scheme's core applications (納甲法 calculation, 按時取穴,
  the practical use of 開穴/閉穴) remain treatment decisions: not taught, not
  examined, and rejected by `day13.test.tsx` if they appear.
- **Day 13 carries its own compliance notice**, stored on the day record
  (`noticeZhHant` / `noticeEn`) and rendered above the first section, in
  addition to the standing educational-use notice every day carries.

The tradition's use of this scheme to time treatment is not represented — a test
rejects "best time to…", 宜/忌, 養生 and 排毒 wording anywhere in the data or the
rendered view.

Deliberately **not** ingested from the handbook: symptom → point prescriptions
(「牙痛 → 合谷」), first-aid framing (「急救」), needling contraindications, and
the one invasive technique it mentions (少商放血). A test asserts these stay out.

The two review days drop a section each, and say so in the lesson rather than
omitting it silently:

- **Day 11 §4「功能分隊總整理」** — point combinations grouped by complaint
  (退熱 / 止痛 / 婦科 / 急救). That is prescribing; the app teaches routes,
  locations and classifications only.
- **Day 12 §3「病案分析大考」** — ten clinical scenarios asking for a pattern
  diagnosis and a point prescription. That is treatment decision-making, which
  the app explicitly does not do. The Day 12 quiz tests the same volume of
  route, location and classification recall instead.

`specific-points.test.ts` asserts that where these topics are *named*, they are
named only inside the notice that says they were left out.

## Assets & licensing

- Body figure and network diagram: original, authored in `src/data/atlas.ts`
  and `src/data/network.ts`. Nothing downloaded, traced, AI-generated or copied.
- Fonts: Source Serif 4 (Latin display, SIL OFL 1.1 — licence file bundled at
  `public/fonts/OFL-Source-Serif-4.md`); CJK and UI text use system fonts.
  Nothing is fetched at runtime.
- Icons: hand-written SVG in `public/`.

## Layout

```
src/data/      typed content + provenance + integrity validator
src/search/    offline index, grouping, function expansion
src/state/     progress, 1-3-7 scheduling, error notebook, store
src/components/ atlas, network map, search palette, detail panel, camera hook
src/views/     atlas, network, learn, practice, progress screens
```

Route order and identity live in `data/meridians.ts` / `data/acupoints.ts`.
Diagram layout lives in `data/atlas.ts` / `data/network.ts` and can be redrawn
without touching a single content record — a test asserts the two stay in sync.
