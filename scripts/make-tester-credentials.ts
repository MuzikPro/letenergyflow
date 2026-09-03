/**
 * Generate tester credentials for the Vercel gate.
 *
 *   npx tsx scripts/make-tester-credentials.ts [count]
 *
 * Prints two things: the plaintext logins to hand out, and the single
 * environment-variable value to paste into Vercel. It writes NOTHING to disk —
 * the plaintext exists only in this output, deliberately, so it cannot end up
 * committed. Once you have distributed the logins, close the terminal.
 *
 * Passwords come from crypto.randomBytes, not Math.random.
 */
import { randomBytes, createHash } from 'node:crypto';

const count = Math.max(1, Math.min(50, Number(process.argv[2] ?? 5) || 5));

/*
 * Unambiguous alphabet: no O/0, I/l/1. These get read off a screen, typed on a
 * phone, and dictated over a call, and a password that cannot be transcribed
 * reliably wastes more of everyone's time than it protects.
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const pick = (n: number) => {
  const bytes = randomBytes(n * 2);
  let out = '';
  for (let i = 0; out.length < n; i += 1) out += ALPHABET[bytes[i]! % ALPHABET.length];
  return out;
};
/** Grouped for readability when dictated: xxxx-xxxx-xxxx ≈ 71 bits. */
const password = () => `${pick(4)}-${pick(4)}-${pick(4)}`;
const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');

const rows = Array.from({ length: count }, (_, i) => {
  const user = `tester${i + 1}`;
  const pass = password();
  return { user, pass, hash: sha256(pass) };
});

/*
 * The two blocks below get confused for each other, and the failure is quiet:
 * the logins list reads like name/value pairs, so it invites creating five
 * variables called tester1..tester5 instead of the ONE the gate reads. That
 * misconfiguration denies every login while looking correctly filled in — so
 * each block now says plainly what it is not.
 */
console.log('\n' + '='.repeat(72));
console.log('BLOCK 1 of 2 — THE LOGINS. Hand these to your testers.');
console.log('             These are NOT environment variables. Do not type them into Vercel.');
console.log('='.repeat(72) + '\n');
for (const r of rows) console.log(`  username: ${r.user.padEnd(10)}  password: ${r.pass}`);
console.log('\n  Not stored anywhere. Save them now, or re-run this and reissue.\n');

const value = rows.map((r) => `${r.user}:${r.hash}`).join(',');
console.log('='.repeat(72));
console.log('BLOCK 2 of 2 — THE ENVIRONMENT VARIABLE. Exactly ONE variable.');
console.log('='.repeat(72) + '\n');
console.log('  Key    TESTER_CREDENTIALS');
console.log('  Type   Secret');
console.log('  Envs   Production + Preview + Development');
console.log(`  Value  (one line, ${value.length} characters — copy all of it)\n`);
console.log(value + '\n');
console.log(`  Sanity check: the value holds ${rows.length} commas-separated pairs and no`);
console.log('  passwords — only SHA-256 digests. If what you pasted has no commas,');
console.log('  you copied Block 1 by mistake and no login will work.\n');
console.log('  Changing this variable needs a redeploy to take effect.\n');
