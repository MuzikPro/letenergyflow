/**
 * Tester gate — credential checking, kept pure so it can be tested.
 *
 * WHAT THIS IS. The app is a static build with no server of its own, so a login
 * screen written into it would ship the passwords to the browser inside the JS
 * bundle. This runs in Vercel's routing middleware instead, before any file is
 * served, and the credentials live in an environment variable that never
 * reaches the client.
 *
 * WHAT THIS IS NOT. Vercel positions routing middleware as defence-in-depth
 * rather than a sole auth layer, and for an app with a server that is right —
 * you would also check at the data boundary. This app has no such boundary: it
 * is files on a CDN, so the edge IS the only place a check can happen. That
 * makes this the strongest gate available here, not a strong gate in general.
 * It is sized for five known testers on an unreleased build, and should not be
 * mistaken for account security.
 *
 * ONE CONSEQUENCE WORTH KNOWING. The service worker caches the app shell for
 * offline use. The gate stops network requests, so a tester who has already
 * loaded the app keeps a working cached copy after their password is removed.
 * Revocation is not immediate; it takes effect when their cache next misses.
 */

/** One tester: a username and the SHA-256 of their password, lowercase hex. */
export interface Credential {
  user: string;
  sha256: string;
}

/**
 * Parse `user:hash,user:hash,…` out of the environment.
 *
 * Hashes rather than plaintext. It buys little against someone who already has
 * the variable — they could just read the password — but it keeps the actual
 * strings out of a dashboard, a screenshot, or a log line, which is where a
 * small credential set really leaks from.
 */
export function parseCredentials(raw: string | undefined | null): Credential[] {
  if (!raw) return [];
  const out: Credential[] = [];
  for (const entry of raw.split(',')) {
    const at = entry.indexOf(':');
    if (at <= 0) continue;
    const user = entry.slice(0, at).trim();
    const sha256 = entry.slice(at + 1).trim().toLowerCase();
    // A 64-char hex digest, or it is not a SHA-256 and this entry is malformed.
    if (!user || !/^[0-9a-f]{64}$/.test(sha256)) continue;
    out.push({ user, sha256 });
  }
  return out;
}

/** Decode `Authorization: Basic …` into its user and password halves. */
export function decodeBasic(header: string | null | undefined): { user: string; pass: string } | null {
  if (!header) return null;
  const m = /^Basic\s+(.+)$/i.exec(header.trim());
  if (!m) return null;
  let decoded: string;
  try {
    decoded = atob(m[1]!);
  } catch {
    return null;
  }
  // Split on the FIRST colon only: a password may legitimately contain one.
  const at = decoded.indexOf(':');
  if (at < 0) return null;
  return { user: decoded.slice(0, at), pass: decoded.slice(at + 1) };
}

export async function sha256Hex(s: string): Promise<string> {
  const bytes = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compare without leaking length or position through timing.
 *
 * Both sides here are fixed-length hex digests, so the practical risk is low —
 * but a comparison that returns early on the first differing character is the
 * kind of thing that gets copied into somewhere it matters.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Does this Authorization header match one of the configured testers? */
export async function isAuthorised(
  header: string | null | undefined,
  credentials: Credential[],
): Promise<boolean> {
  // No credentials configured means the gate is not set up. Deny rather than
  // allow: a misconfigured env var must not silently open the app.
  if (credentials.length === 0) return false;
  const given = decodeBasic(header);
  if (!given) return false;
  const hash = await sha256Hex(given.pass);
  let ok = false;
  for (const c of credentials) {
    // No early exit: check every credential so the work does not depend on
    // which user was named, or whether the username existed at all.
    if (timingSafeEqual(c.user, given.user) && timingSafeEqual(c.sha256, hash)) ok = true;
  }
  return ok;
}

export const UNAUTHORISED_BODY =
  'Let Energy Flow — private test build.\n\nThis build is not public. Sign in with the username and password you were given.\n';

export function challenge(): Response {
  return new Response(UNAUTHORISED_BODY, {
    status: 401,
    headers: {
      /*
       * ASCII only. An HTTP header value is a ByteString, so the em dash this
       * realm originally carried threw at construction — the gate would have
       * 500'd at the edge instead of challenging.
       */
      'WWW-Authenticate': 'Basic realm="Let Energy Flow test build", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
      // Never let a challenge or a gated response be cached by a shared cache.
      'Cache-Control': 'no-store, private',
    },
  });
}
