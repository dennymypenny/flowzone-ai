import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "./helpers/server.mjs";
import { why } from "./helpers/report.mjs";

/**
 * THE BUG THIS GUARDS
 *
 * Every API route was wide open. /api/subscribe mails a real inbox as fast as
 * anybody can POST, and the model routes spend money per call. src/middleware.ts
 * now counts requests per address and returns 429. Two things have to stay
 * true: the limit really fires, and it only hits the address that tripped it.
 */

const PORT = 3104;

// The middleware allows five calls per address per ten minutes on this route.
// A few extra calls prove the sixth is refused without being a real flood.
const ATTEMPTS = 9;

let server;

before(async () => {
  server = await startServer({ port: PORT, withResendKey: false, label: "rate limit" });
});

after(async () => {
  if (server) await server.stop();
});

async function hit(address) {
  const res = await fetch(`http://127.0.0.1:${PORT}/api/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": address,
    },
    body: JSON.stringify({ email: "flood@example.com", source: "rate-limit-test" }),
  });
  await res.text();
  return { status: res.status, retryAfter: res.headers.get("retry-after") };
}

test("hammering /api/subscribe from one address gets a 429 with Retry-After", async () => {
  const seen = [];
  let limited = null;

  for (let i = 0; i < ATTEMPTS; i += 1) {
    const res = await hit("203.0.113.7");
    seen.push(res.status);
    if (res.status === 429 && !limited) limited = res;
  }

  assert.ok(
    limited,
    why({
      broke: `${ATTEMPTS} calls to /api/subscribe from one address never got a 429.`,
      matters:
        "This route mails a real inbox on every call. With no limit, one bored person with a loop fills that inbox and there is no bill ceiling on the routes that cost money.",
      found: `statuses in order: ${seen.join(", ")}`,
    })
  );

  assert.ok(
    limited.retryAfter && Number(limited.retryAfter) > 0,
    why({
      broke: "The 429 came back without a usable Retry-After header.",
      matters:
        "Retry-After is how a real client knows when to come back. Without it a well behaved caller has to guess, and most guess wrong by retrying immediately.",
      found: `Retry-After: ${limited.retryAfter}`,
    })
  );
});

test("a different address is untouched in the same window", async () => {
  // Same route, same ten minute window, fresh address. Anything but a pass
  // here means one noisy visitor locks everybody else out.
  const res = await hit("198.51.100.42");

  assert.notEqual(
    res.status,
    429,
    why({
      broke: "A second address was rate limited straight away, in the window another address had just filled.",
      matters:
        "The limit is per visitor. If it is global, one bot takes the contact form away from every real customer.",
      found: `status ${res.status} on the first ever call from this address`,
    })
  );
});
