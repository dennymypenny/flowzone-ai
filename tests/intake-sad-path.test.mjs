import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "./helpers/server.mjs";
import { launchBrowser, watchForProblems } from "./helpers/browser.mjs";
import { why } from "./helpers/report.mjs";

/**
 * THE BUG THIS GUARDS
 *
 * /intake used to show "You're all set!" and a Venmo pay link even when the
 * submission failed. Somebody could pay $600 for a project whose details
 * reached nobody. The success screen is a promise, so it is only allowed on
 * screen when the server said the details landed.
 */

const PORT = 3101;

let server;
let browser;

before(async () => {
  server = await startServer({ port: PORT, label: "intake" });
  browser = await launchBrowser();
});

after(async () => {
  if (browser) await browser.close();
  if (server) await server.stop();
});

// What a real visitor types. Kept here so both tests fill the same answers.
const ANSWERS = {
  name: "Jane Smith",
  email: "jane@example.com",
  business: "Acme Bakery",
  description: "We need a new site and a booking flow for the bakery.",
};

async function openAndFillIntake(page) {
  await page.goto(`http://127.0.0.1:${PORT}/intake`, { waitUntil: "domcontentloaded" });

  // Fields are matched by placeholder because the form has no name or id
  // attributes. If the copy changes these break loudly, which is correct.
  await page.getByPlaceholder("Jane Smith").fill(ANSWERS.name);
  await page.getByPlaceholder("jane@company.com").fill(ANSWERS.email);
  await page.getByPlaceholder("Acme Co.").fill(ANSWERS.business);
  // Index 1 is the first real package. Index 0 is the "Select a package..." row.
  await page.locator("select").selectOption({ index: 1 });
  await page.getByPlaceholder(/Describe what you want built/i).fill(ANSWERS.description);
}

test("a failed submission never shows the success screen or a Venmo link", async () => {
  const page = await browser.newPage();
  const problems = watchForProblems(page);

  // The server is fine. We break the one call that decides whether the lead
  // landed, which is exactly the failure that used to be invisible.
  await page.route("**/api/intake", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "That did not send." }),
    })
  );

  await openAndFillIntake(page);
  await page.getByRole("button", { name: /Submit Project/i }).click();

  // Wait for the page to settle on either outcome, not just the right one.
  // Waiting only for the error would fail with a timeout when the bug is back,
  // and a timeout tells the next person nothing about what actually happened.
  try {
    await page.waitForFunction(
      () => {
        const text = document.body.innerText;
        return /That did not send/i.test(text) || /You.?re all set/i.test(text);
      },
      null,
      { timeout: 15000 }
    );
  } catch {
    assert.fail(
      why({
        broke: "After a failed submission the intake page showed neither an error nor a success screen.",
        matters:
          "The visitor is left staring at the form with no idea whether their project details went anywhere.",
        found: (await page.locator("body").innerText()).slice(0, 400),
      })
    );
  }

  const bodyText = await page.locator("body").innerText();
  assert.ok(
    !/You.?re all set/i.test(bodyText),
    why({
      broke: 'The intake success screen ("You\'re all set!") appeared after the submission failed.',
      matters:
        "The success screen tells somebody their project details arrived. They did not. This is the bug where a paying customer's project reached nobody.",
      found: bodyText.slice(0, 400),
    })
  );

  const html = await page.content();
  assert.ok(
    !html.includes("venmo.com"),
    why({
      broke: "A venmo.com link is in the page after a failed submission.",
      matters:
        "A payment link after a failed send invites somebody to pay for work nobody has been told about.",
      found: html.slice(Math.max(0, html.indexOf("venmo.com") - 200), html.indexOf("venmo.com") + 200),
    })
  );

  // Nothing typed is lost. Retrying or using the mailto fallback both depend on it.
  const stillThere = {
    name: await page.getByPlaceholder("Jane Smith").inputValue(),
    email: await page.getByPlaceholder("jane@company.com").inputValue(),
    business: await page.getByPlaceholder("Acme Co.").inputValue(),
    description: await page.getByPlaceholder(/Describe what you want built/i).inputValue(),
  };
  for (const [field, expected] of Object.entries(ANSWERS)) {
    assert.equal(
      stillThere[field],
      expected,
      why({
        broke: `The "${field}" field lost what the visitor typed after the submission failed.`,
        matters:
          "The failure screen tells them nothing is lost and offers a retry. If the form emptied itself, that is a lie and the lead walks.",
        found: JSON.stringify(stillThere[field]),
      })
    );
  }

  // The browser logs the 500 we asked for. That one is ours, not the site's.
  // Anything else means the page threw while handling the failure.
  const unexpected = problems.filter((p) => !p.includes("/api/intake"));
  assert.deepEqual(
    unexpected,
    [],
    why({
      broke: "The intake page logged errors while handling a failed submission.",
      matters: "A form that throws while failing cannot be trusted to keep the visitor's work.",
      found: unexpected.join("\n"),
    })
  );

  await page.close();
});

test("a successful submission does show the success screen", async () => {
  const page = await browser.newPage();

  await page.route("**/api/intake", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  );

  await openAndFillIntake(page);
  await page.getByRole("button", { name: /Submit Project/i }).click();

  await page
    .getByText(/You.?re all set/i)
    .first()
    .waitFor({ state: "visible", timeout: 15000 });

  const html = await page.content();
  assert.ok(
    html.includes("venmo.com"),
    why({
      broke: "The success screen appeared without the Venmo pay link.",
      matters:
        "This is the other half of the check. If success stopped showing the pay link, the sad path test above would pass for the wrong reason and the site would take no money.",
      found: html.slice(0, 400),
    })
  );

  await page.close();
});
