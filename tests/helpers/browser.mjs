import { chromium } from "playwright";

/** The browser is already on this machine. Nothing to download, nothing to add. */
const CHROMIUM_PATH = "/opt/pw-browsers/chromium";

export async function launchBrowser() {
  return chromium.launch({ executablePath: CHROMIUM_PATH });
}

/**
 * Noise the site cannot be blamed for.
 *
 * Google Fonts is unreachable from this sandbox, and the Vercel analytics
 * script only exists once the site is deployed to Vercel. Both fail locally on
 * every single page, so counting them would make the "zero errors" check
 * useless. Everything else counts, including anything from our own origin.
 */
const IGNORED_ERROR_SOURCES = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "/_vercel/insights",
];

function ignorable(url) {
  return IGNORED_ERROR_SOURCES.some((frag) => (url || "").includes(frag));
}

/**
 * Watch a page for the two things that mean it is actually broken: a thrown
 * error, and a console error. Returns a list you assert on later.
 */
export function watchForProblems(page) {
  const problems = [];

  page.on("pageerror", (err) => {
    problems.push(`Uncaught error on the page: ${err.message}`);
  });

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const where = msg.location()?.url || "";
    if (ignorable(where)) return;
    problems.push(`Console error: ${msg.text()}${where ? ` (from ${where})` : ""}`);
  });

  return problems;
}
