/**
 * Failure messages people can act on.
 *
 * A bare "expected true to be false" tells the next person nothing. Every
 * assertion in this suite says what broke, why it matters and what was found
 * instead, so a red run reads like a bug report.
 */
export function why({ broke, matters, found }) {
  const lines = [``, `WHAT BROKE: ${broke}`, `WHY IT MATTERS: ${matters}`];
  if (found !== undefined) lines.push(`WHAT WE FOUND: ${found}`);
  return lines.join("\n") + "\n";
}
