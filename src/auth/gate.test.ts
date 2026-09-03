import { describe, expect, it } from 'vitest';
import {
  challenge,
  decodeBasic,
  isAuthorised,
  parseCredentials,
  sha256Hex,
  timingSafeEqual,
} from './gate';

/**
 * The tester gate.
 *
 * Auth code earns stricter tests than feature code, because its failure mode is
 * silent: a gate that wrongly says yes looks exactly like a gate that works.
 * Every test here is written to fail open-ward — the question asked is always
 * "can something get in that should not".
 */

const hashOf = (s: string) => sha256Hex(s);

describe('parsing the configured testers', () => {
  it('reads user:hash pairs', async () => {
    const h = await hashOf('correct horse');
    const c = parseCredentials(`alice:${h},bob:${h}`);
    expect(c.map((x) => x.user)).toEqual(['alice', 'bob']);
    expect(c[0]!.sha256).toBe(h);
  });

  it('rejects anything that is not a SHA-256 digest', () => {
    /*
     * The failure this prevents: pasting PLAINTEXT passwords into the variable
     * by mistake. Without the shape check they would be accepted as "hashes",
     * and then no password would ever match — the gate would lock everyone out
     * rather than let anyone in, but the misconfiguration would be invisible.
     */
    expect(parseCredentials('alice:hunter2')).toEqual([]);
    expect(parseCredentials('alice:' + 'a'.repeat(63))).toEqual([]);
    expect(parseCredentials('alice:' + 'g'.repeat(64))).toEqual([]);
    expect(parseCredentials(':' + 'a'.repeat(64))).toEqual([]);
  });

  it('treats an unset variable as no testers', () => {
    expect(parseCredentials(undefined)).toEqual([]);
    expect(parseCredentials('')).toEqual([]);
    expect(parseCredentials('   ')).toEqual([]);
  });
});

describe('decoding the Authorization header', () => {
  it('reads a well-formed Basic header', () => {
    expect(decodeBasic('Basic ' + btoa('alice:pw'))).toEqual({ user: 'alice', pass: 'pw' });
    expect(decodeBasic('basic ' + btoa('alice:pw'))).toEqual({ user: 'alice', pass: 'pw' });
  });

  it('splits on the first colon, so a password may contain one', () => {
    expect(decodeBasic('Basic ' + btoa('alice:a:b:c'))).toEqual({ user: 'alice', pass: 'a:b:c' });
  });

  it('returns null rather than throwing on rubbish', () => {
    for (const h of [null, undefined, '', 'Bearer x', 'Basic', 'Basic !!!not base64!!!',
                     'Basic ' + btoa('no-colon')]) {
      expect({ h, got: decodeBasic(h) }).toEqual({ h, got: null });
    }
  });
});

describe('the gate itself', () => {
  it('lets a configured tester in', async () => {
    const creds = parseCredentials(`alice:${await hashOf('s3cret')}`);
    expect(await isAuthorised('Basic ' + btoa('alice:s3cret'), creds)).toBe(true);
  });

  it('denies when the variable is unset — it must not fail open', async () => {
    /*
     * The most important test here. If TESTER_CREDENTIALS is missing or
     * malformed, the deploy is misconfigured; the app must stay shut rather
     * than quietly become public, which is exactly what a "no credentials means
     * no restrictions" reading would do.
     */
    expect(await isAuthorised('Basic ' + btoa('alice:s3cret'), [])).toBe(false);
    expect(await isAuthorised('Basic ' + btoa('alice:s3cret'), parseCredentials(undefined))).toBe(false);
  });

  it('denies a wrong password, a wrong user, and a missing header', async () => {
    const creds = parseCredentials(`alice:${await hashOf('s3cret')}`);
    expect(await isAuthorised('Basic ' + btoa('alice:wrong'), creds)).toBe(false);
    expect(await isAuthorised('Basic ' + btoa('mallory:s3cret'), creds)).toBe(false);
    expect(await isAuthorised(null, creds)).toBe(false);
    expect(await isAuthorised('Basic ' + btoa('alice:'), creds)).toBe(false);
  });

  it('does not let one tester in with another’s password', async () => {
    const creds = parseCredentials(
      `alice:${await hashOf('alice-pw')},bob:${await hashOf('bob-pw')}`,
    );
    expect(await isAuthorised('Basic ' + btoa('alice:alice-pw'), creds)).toBe(true);
    expect(await isAuthorised('Basic ' + btoa('bob:bob-pw'), creds)).toBe(true);
    // The pairing has to hold, not just membership in the set.
    expect(await isAuthorised('Basic ' + btoa('alice:bob-pw'), creds)).toBe(false);
    expect(await isAuthorised('Basic ' + btoa('bob:alice-pw'), creds)).toBe(false);
  });

  it('is case-sensitive about the username', async () => {
    const creds = parseCredentials(`alice:${await hashOf('pw')}`);
    expect(await isAuthorised('Basic ' + btoa('Alice:pw'), creds)).toBe(false);
  });
});

describe('the comparison and the challenge', () => {
  it('compares without an early exit', () => {
    expect(timingSafeEqual('abc', 'abc')).toBe(true);
    expect(timingSafeEqual('abc', 'abd')).toBe(false);
    expect(timingSafeEqual('abc', 'ab')).toBe(false);
    expect(timingSafeEqual('', '')).toBe(true);
  });

  it('challenges with a realm and refuses to be cached', () => {
    // Without no-store a shared cache could hold a gated response and hand it
    // to the next requester.
    const r = challenge();
    expect(r.status).toBe(401);
    expect(r.headers.get('WWW-Authenticate')).toMatch(/^Basic realm=/);
    expect(r.headers.get('Cache-Control')).toContain('no-store');
  });

  it('says nothing about who the valid testers are', async () => {
    const body = await challenge().text();
    expect(body).not.toMatch(/password is|hint|user(name)?s? are/i);
  });
});
