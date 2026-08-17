import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "./helpers/server.mjs";
import { launchBrowser, watchForProblems } from "./helpers/browser.mjs";
import { why } from "./helpers/report.mjs";

/**
 * WHAT THIS GUARDS
 *
 * /start is about 9,000 lines of client code and had no coverage at all. The
 * four tracks are loaded with next/dynamic, so a broken import or a component
 * that touches the browser too early fails at runtime and nowhere else. This
 * opens each track with empty storage and checks it actually arrives.
 */

const PORT = 3105;

let server;
let browser;

before(async () => {
  server = await startServer({ port: PORT, label: "flow mode" });
  browser = await launchBrowser();
});

after(async () => {
  if (browser) await browser.close();
  if (server) await server.stop();
});

/**
 * The first real control in each track, the thing a visitor touches first.
 * The loading panel does not have any of these, so seeing one is proof the
 * lazy chunk arrived and mounted. That is why we wait on these and not on a
 * timer: on a slow machine a fixed sleep either flakes or wastes time.
 */
const TRACKS = [
  {
    id: "design",
    section: "Design track",
    control: 'input[aria-label="What you are making"]',
    describe: "the box where you say what you are making",
  },
  {
    id: "writing",
    section: "Writing track",
    control: 'input[aria-label="One true thing about it"]',
    describe: "the one true thing box",
  },
  {
    id: "content",
    section: "Content and reels track",
    control: 'input[aria-label="What the video is about"]',
    describe: "the box where you say what the video is about",
  },
  {
    id: "brief",
    section: "The brief track",
    control: 'button:has-text("Start the session")',
    describe: "the Start the session button",
  },
];

/**
 * Open /start with nothing in storage except the chosen track. Everything
 * else stays empty, which is the state a first time visitor is in.
 */
async function openStart(track) {
  const page = await browser.newPage();
  const problems = watchForProblems(page);

  if (track) {
    await page.addInitScript((id) => {
      try {
        window.localStorage.setItem("flowzone.track.v2", id);
      } catch {
        // A locked storage should not stop the page, and it must not stop this test.
      }
    }, track);
  }

  await page.goto(`http://127.0.0.1:${PORT}/start`, { waitUntil: "domcontentloaded" });
  return { page, problems };
}

async function assertStorageWasEmptyApartFromTrack(page) {
  const leftovers = await page.evaluate(() =>
    Object.keys(window.localStorage).filter((k) => k !== "flowzone.track.v2")
  );
  assert.deepEqual(
    leftovers,
    [],
    why({
      broke: `The test started with things already in storage: ${leftovers.join(", ")}.`,
      matters:
        "This suite is meant to prove a first time visitor with nothing saved gets a working page. Leftover state would hide exactly the failure we are looking for.",
      found: leftovers.join(", "),
    })
  );
}

for (const track of TRACKS) {
  test(`the ${track.id} track loads and works from empty storage`, async () => {
    const { page, problems } = await openStart(track.id);

    const section = page.locator(`section[aria-label="${track.section}"]`);
    await section.waitFor({ state: "attached", timeout: 20000 });

    // Wait for the real control, not a timer. This is the lazy chunk landing.
    const control = section.locator(track.control).first();
    try {
      await control.waitFor({ state: "visible", timeout: 30000 });
    } catch {
      const showing = await section.innerText().catch(() => "(nothing)");
      assert.fail(
        why({
          broke: `The ${track.id} track never showed ${track.describe}.`,
          matters:
            "The track is loaded lazily. If the chunk fails to arrive or the component throws on mount, the visitor is stuck on a loading panel forever and the whole tool is dead.",
          found: `${showing.slice(0, 500)}\n\nPage errors so far:\n${problems.join("\n") || "none"}`,
        })
      );
    }

    // The loading placeholder has to be gone, not just covered up.
    const stillLoading = await section.locator('[aria-busy="true"]').count();
    assert.equal(
      stillLoading,
      0,
      why({
        broke: `The ${track.id} track is showing its controls and its loading panel at the same time.`,
        matters:
          "A loading panel that never clears tells the visitor the page is stuck when it is not, and it pushes the real controls off the screen.",
        found: `${stillLoading} element(s) still marked aria-busy`,
      })
    );

    await assertStorageWasEmptyApartFromTrack(page);

    assert.deepEqual(
      problems,
      [],
      why({
        broke: `Loading the ${track.id} track produced errors.`,
        matters:
          "These tracks are the free tool the site is built around. An error on mount means some part of it quietly does not work, and nobody would find out.",
        found: problems.join("\n"),
      })
    );

    await page.close();
  });
}

test("/start works for a first time visitor with nothing saved at all", async () => {
  // No track key either. This is a genuinely empty browser, which is the
  // promise the site makes: it works for anyone with nothing saved.
  const { page, problems } = await openStart(null);

  const heading = page.getByRole("heading", { name: /Enter the Flow/i }).first();
  await heading.waitFor({ state: "visible", timeout: 20000 });

  const picker = page.locator("#pick-your-flow");
  await picker.waitFor({ state: "visible", timeout: 20000 });

  // With no saved choice the page falls back to the Design track.
  const defaultControl = page
    .locator('section[aria-label="Design track"] input[aria-label="What you are making"]')
    .first();
  try {
    await defaultControl.waitFor({ state: "visible", timeout: 30000 });
  } catch {
    assert.fail(
      why({
        broke: "/start showed no working track for a visitor with completely empty storage.",
        matters:
          "Somebody arriving for the first time is the most important visitor this page has. If the default track does not mount, they see a loading panel and leave.",
        found: `Page errors so far:\n${problems.join("\n") || "none"}`,
      })
    );
  }

  const stored = await page.evaluate(() => Object.keys(window.localStorage));
  assert.ok(
    !stored.includes("flowzone.funnel.v2"),
    why({
      broke: "/start wrote funnel answers to storage without the visitor answering anything.",
      matters:
        "Saved answers that nobody gave will be shown back to them later as their own words. Storage is only written when somebody actually does something.",
      found: stored.join(", "),
    })
  );

  assert.deepEqual(
    problems,
    [],
    why({
      broke: "/start produced errors for a visitor with nothing saved.",
      matters:
        'The site promises this page works for anyone with nothing saved. An error on a clean browser breaks that promise for every new visitor.',
      found: problems.join("\n"),
    })
  );

  await page.close();
});
