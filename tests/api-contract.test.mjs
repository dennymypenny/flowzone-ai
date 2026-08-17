import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "./helpers/server.mjs";
import { why } from "./helpers/report.mjs";

/**
 * THE BUG THIS GUARDS
 *
 * These three routes take a lead and mail it to a human. The dangerous
 * failure is a route that says "ok" when nothing was sent. So each one has to
 * reject junk with a 400, and it has to fail loudly when the mail key is
 * missing rather than pretend it worked.
 *
 * The server for this file runs WITHOUT RESEND_API_KEY on purpose. That makes
 * the missing key path real instead of simulated.
 */

const PORT = 3102;

let server;

before(async () => {
  server = await startServer({ port: PORT, withResendKey: false, label: "keyless API" });
});

after(async () => {
  if (server) await server.stop();
});

/**
 * Every call uses its own x-forwarded-for address. The middleware limits five
 * calls per address per route, so sharing one address would turn later cases
 * into 429s and the test would be measuring the wrong thing.
 */
let caller = 0;
async function post(path, body) {
  caller += 1;
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `10.0.${Math.floor(caller / 250)}.${caller % 250}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // Some failure modes return HTML. The raw text goes in the message.
  }
  return { status: res.status, json, text };
}

// A valid payload per route, so each case changes exactly one thing.
const VALID = {
  "/api/contact": {
    name: "Jane Smith",
    email: "jane@example.com",
    reason: "work",
    message: "I want a brand and a site for my bakery.",
  },
  "/api/subscribe": {
    email: "jane@example.com",
    source: "test",
  },
  "/api/intake": {
    name: "Jane Smith",
    email: "jane@example.com",
    business: "Acme Bakery",
    service: "Starter",
    description: "We need a new site and a booking flow.",
  },
};

// The field each route cannot do without, beyond the email itself.
const REQUIRED_FIELD = {
  "/api/contact": "message",
  "/api/subscribe": "email",
  "/api/intake": "name",
};

const ROUTES = Object.keys(VALID);

for (const route of ROUTES) {
  test(`${route} rejects a malformed email with 400`, async () => {
    const res = await post(route, { ...VALID[route], email: "not-an-email" });
    assert.equal(
      res.status,
      400,
      why({
        broke: `${route} accepted "not-an-email" instead of returning 400.`,
        matters:
          "A lead with a broken address cannot be replied to. Catching it at the door is the only chance to tell the visitor while they are still on the page.",
        found: `status ${res.status}, body ${res.text.slice(0, 300)}`,
      })
    );
    assert.equal(
      res.json?.ok,
      false,
      why({
        broke: `${route} returned 400 without ok:false in the body.`,
        matters: "The client checks the body as well as the status. Both have to say it failed.",
        found: res.text.slice(0, 300),
      })
    );
  });

  test(`${route} rejects a missing required field with 400`, async () => {
    const field = REQUIRED_FIELD[route];
    const body = { ...VALID[route] };
    delete body[field];
    const res = await post(route, body);
    assert.equal(
      res.status,
      400,
      why({
        broke: `${route} accepted a submission with no "${field}" instead of returning 400.`,
        matters:
          "A half filled lead is a lead nobody can act on. It has to bounce back to the visitor while they can still fix it.",
        found: `status ${res.status}, body ${res.text.slice(0, 300)}`,
      })
    );
    assert.equal(
      res.json?.ok,
      false,
      why({
        broke: `${route} returned 400 for a missing "${field}" without ok:false in the body.`,
        matters: "The client checks the body as well as the status. Both have to say it failed.",
        found: res.text.slice(0, 300),
      })
    );
  });

  test(`${route} fails loudly when RESEND_API_KEY is missing`, async () => {
    const res = await post(route, VALID[route]);
    assert.notEqual(
      res.status,
      200,
      why({
        broke: `${route} returned 200 with no mail key configured.`,
        matters:
          "No key means no email was sent and the lead is gone. A 200 here makes the page show a checkmark over nothing, which is exactly how leads went missing before.",
        found: `status ${res.status}, body ${res.text.slice(0, 300)}`,
      })
    );
    assert.equal(
      res.json?.ok,
      false,
      why({
        broke: `${route} did not return ok:false when the mail key is missing.`,
        matters:
          "The pages read ok from the body before showing success. Without ok:false a failed send can still look like a win.",
        found: res.text.slice(0, 300),
      })
    );
  });
}
