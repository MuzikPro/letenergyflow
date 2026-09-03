/**
 * Vercel routing middleware — the tester gate.
 *
 * This file must sit at the VERCEL project root, which for this repo is `app/`:
 * there is no package.json above it, so `app/` is the only directory Vercel can
 * be building from. Put this at the repo root instead and it is silently never
 * invoked — which for an auth gate is the worst possible failure, because the
 * site keeps working and simply stops being protected.
 *
 * All the logic lives in src/auth/gate.ts so it can be unit-tested. Vercel's
 * middleware cannot run under Vite's dev server or vitest, so this wrapper is
 * the one part that is only exercised by a real deployment.
 */
import { next } from '@vercel/functions';
import { challenge, isAuthorised, parseCredentials } from './src/auth/gate';

export default async function middleware(request: Request): Promise<Response> {
  const raw = process.env.TESTER_CREDENTIALS;
  const credentials = parseCredentials(raw);
  /*
   * Say why, in the runtime log, when the gate is shut because it is not
   * configured rather than because someone failed to sign in. Only the project
   * owner can read Vercel's logs, so this leaks nothing to a visitor — and
   * without it a misconfigured variable is indistinguishable from a wrong
   * password. That cost a round-trip once already: five separate variables
   * named tester1..tester5 were created instead of the one this reads, and the
   * gate correctly denied everyone with nothing to explain itself.
   */
  if (credentials.length === 0) {
    console.warn(
      raw
        ? 'TESTER_CREDENTIALS is set but no entry parsed. Expected user:<64-hex-sha256> pairs, comma-separated.'
        : 'TESTER_CREDENTIALS is not set on this deployment. Every request will be denied.',
    );
  }
  const ok = await isAuthorised(request.headers.get('authorization'), credentials);
  return ok ? next() : challenge();
}

export const config = {
  runtime: 'edge',
  /*
   * Everything, deliberately.
   *
   * Gating only the HTML would leave the JS bundle, the point data and the
   * service worker fetchable without a password — which is most of what there
   * is to protect. The browser resends the Authorization header for every
   * subresource on the realm once the user has signed in, so covering
   * everything costs the tester nothing.
   */
  matcher: '/(.*)',
};
