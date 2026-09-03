# Tester gate

Five testers, one shared entry point, no roles. Everything below the gate is
the app exactly as it is today.

## How it works

`app/middleware.ts` runs in Vercel's routing middleware — at the edge, **before
any file is served** — and demands HTTP Basic credentials. The logic is in
`src/auth/gate.ts` so it can be unit-tested; the middleware file is a thin
wrapper around it.

Credentials live in one environment variable, `TESTER_CREDENTIALS`, as
`user:sha256,user:sha256,…`. Only digests are stored. Nothing reaches the
browser.

## Setting it up

1. Generate the logins:

       cd app && npx tsx scripts/make-tester-credentials.ts 5

   It prints the plaintext to hand out and the variable value to paste. It
   writes nothing to disk, so the passwords cannot be committed by accident.

2. In Vercel → the project → **Settings → Environment Variables**, add
   **one** variable — `TESTER_CREDENTIALS`, type Secret, with the printed value,
   applied to **Production, Preview and Development**.

   > One variable, not one per tester. Creating `tester1`…`tester5` as separate
   > variables leaves `TESTER_CREDENTIALS` unset, and the gate then denies every
   > login while the dashboard looks correctly filled in. The value is a single
   > line of `user:<64-hex>` pairs separated by commas; if what you pasted has no
   > commas, it is the wrong half of the generator's output. When this happens
   > the runtime log says so.

3. Redeploy. Environment variables are read at request time, but the middleware
   itself only exists on deployments built after it was added.

To change who has access, re-run the generator and replace the variable. To
close the build entirely, delete the variable — the gate denies when it is
unset.

## What this is, and what it is not

It is the strongest gate available to this app. The site is a static build on a
CDN with no server of its own, so the edge is the only place a check can happen;
a login screen inside the app would ship the passwords to the browser in the JS
bundle.

It is **not** account security, and Vercel positions routing middleware as
defence-in-depth rather than a sole auth layer. That caveat assumes an app with
a server to check again at the data boundary. This app has none. Sized for five
known people on an unreleased build, that is proportionate; it should not be
carried into a public release as if it were more.

Three specific limits:

- **Revocation is not immediate.** The service worker caches the app shell for
  offline use, so a tester who has already loaded the app keeps a working copy
  after their password is removed. It lapses when their cache next misses.
- **Basic Auth has no sign-out.** The browser holds the credentials for the
  session; closing the browser clears them.
- **It gates access, not content.** Every tester sees the same app.

## The open content question

`CLAUDE.md` says the model-derived 功效/主治 must not be "published, shared, or
presented to anyone else as reference content", and there are 609 such fields.
Handing out logins presents them to other people.

The gate does not resolve that either way — it was built first, deliberately, so
the decision stays open. When you want it, suppressing model-derived entries for
gated sessions is cheap: they already carry `src_model_unverified`, so the data
can tell them apart without any new authoring.
