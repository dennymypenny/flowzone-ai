import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "./helpers/server.mjs";
import { why } from "./helpers/report.mjs";

/**
 * THE BUG THIS GUARDS
 *
 * A canonical tag set on the root layout was inherited by every page, so every
 * page told Google it was a copy of the homepage. Nothing but the homepage
 * could rank. Each page now declares its own canonical and its own og:url, and
 * this checks all of them on every run.
 */

const PORT = 3103;
const SITE_URL = "https://flowzone.dev";

let server;

before(async () => {
  server = await startServer({ port: PORT, label: "metadata" });
});

after(async () => {
  if (server) await server.stop();
});

/** Pages that should be indexed, each with the path it must claim as its own. */
const INDEXED_PATHS = [
  "/",
  "/start",
  "/work",
  "/services",
  "/pricing",
  "/how-we-work",
  "/about",
  "/book",
  "/privacy",
  "/terms",
  "/intake",
];

/** Pages that must stay out of search. Utility pages, not marketing pages. */
const NOINDEX_PATHS = ["/scan", "/ai-news", "/thank-you"];

const ALL_PATHS = [...INDEXED_PATHS, ...NOINDEX_PATHS];

const pages = new Map();

async function html(path) {
  if (!pages.has(path)) {
    const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
    const body = await res.text();
    assert.equal(
      res.status,
      200,
      why({
        broke: `${path} did not return 200.`,
        matters: "A page that does not load cannot rank and cannot sell anything.",
        found: `status ${res.status}`,
      })
    );
    pages.set(path, body);
  }
  return pages.get(path);
}

function canonicalOf(body) {
  return body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1] ?? null;
}

function ogUrlOf(body) {
  return body.match(/<meta[^>]+property="og:url"[^>]+content="([^"]*)"/i)?.[1] ?? null;
}

function robotsOf(body) {
  return body.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i)?.[1] ?? null;
}

/** The homepage canonical has no trailing slash, so both spellings are correct. */
function expectedUrls(path) {
  if (path === "/") return [SITE_URL, `${SITE_URL}/`];
  return [`${SITE_URL}${path}`];
}

for (const path of INDEXED_PATHS) {
  test(`${path} canonicalises to itself`, async () => {
    const body = await html(path);
    const canonical = canonicalOf(body);
    const allowed = expectedUrls(path);

    assert.ok(
      canonical,
      why({
        broke: `${path} has no canonical link at all.`,
        matters:
          "Without a canonical, search engines pick one for you and duplicate URLs split the page's ranking.",
      })
    );
    assert.ok(
      allowed.includes(canonical),
      why({
        broke: `${path} canonicalises to ${canonical} instead of itself.`,
        matters:
          "This is the bug that made every page claim to be the homepage. Nothing but the homepage could rank.",
        found: `expected one of ${allowed.join(" or ")}, got ${canonical}`,
      })
    );
  });

  test(`${path} sets og:url to itself`, async () => {
    const body = await html(path);
    const ogUrl = ogUrlOf(body);
    const allowed = expectedUrls(path);

    assert.ok(
      ogUrl,
      why({
        broke: `${path} has no og:url.`,
        matters:
          "Shared links use og:url. Without it the preview can point somewhere other than the page that was shared.",
      })
    );
    assert.ok(
      allowed.includes(ogUrl),
      why({
        broke: `${path} sets og:url to ${ogUrl} instead of itself.`,
        matters:
          "Anybody sharing this page would post a link that previews as a different page. Same root cause as the canonical bug.",
        found: `expected one of ${allowed.join(" or ")}, got ${ogUrl}`,
      })
    );
  });

  test(`${path} is allowed in search`, async () => {
    const body = await html(path);
    const robots = robotsOf(body);
    assert.ok(
      !robots || !/noindex/i.test(robots),
      why({
        broke: `${path} is marked noindex.`,
        matters: "This is a page the studio wants found. Marked noindex it disappears from search.",
        found: `robots meta: ${robots}`,
      })
    );
  });
}

for (const path of NOINDEX_PATHS) {
  test(`${path} is kept out of search`, async () => {
    const body = await html(path);
    const robots = robotsOf(body);
    assert.ok(
      robots && /noindex/i.test(robots),
      why({
        broke: `${path} is not marked noindex.`,
        matters:
          "This is a utility page, not a marketing page. Indexed, it competes with the real pages and shows strangers a page meant for one visitor.",
        found: `robots meta: ${robots}`,
      })
    );
  });
}

test('no page says "FlowZone AI"', async () => {
  const offenders = [];
  for (const path of ALL_PATHS) {
    const body = await html(path);
    if (body.includes("FlowZone AI")) offenders.push(path);
  }
  assert.deepEqual(
    offenders,
    [],
    why({
      broke: `These pages still contain the old name "FlowZone AI": ${offenders.join(", ")}.`,
      matters:
        "The studio is called FlowZone. The old name in public HTML splits the brand and confuses anybody searching for it.",
      found: offenders.join(", "),
    })
  );
});
