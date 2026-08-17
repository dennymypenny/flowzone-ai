import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Runs the whole suite, in order of importance, one file at a time.
 *
 * WHY one at a time: every file starts its own real server and some start a
 * browser. Running them together would fight over memory and make slow
 * machines flaky for no good reason.
 *
 * WHY it builds first: these tests check the production build. A stale build
 * would test yesterday's site.
 */

const ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));

// Order matters. Most important first, so a broken money path is the first
// thing you read in the output.
const FILES = [
  "tests/intake-sad-path.test.mjs",
  "tests/api-contract.test.mjs",
  "tests/seo-metadata.test.mjs",
  "tests/rate-limit.test.mjs",
  "tests/flow-mode.test.mjs",
];

function run(command, args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

const skipBuild = process.argv.includes("--no-build");
const alreadyBuilt = existsSync(path.join(ROOT, ".next", "BUILD_ID"));

if (!skipBuild || !alreadyBuilt) {
  console.log("\nBuilding the site first. This takes a minute.\n");
  // The dummy key is a habit worth keeping. Some routes read env vars while
  // the build collects pages, and a missing key kills the build there.
  const built = await run(
    process.execPath,
    [path.join(ROOT, "node_modules", "next", "dist", "bin", "next"), "build"],
    { RESEND_API_KEY: "re_dummy" }
  );
  if (built !== 0) {
    console.error("\nThe build failed, so no tests were run. Fix the build first.\n");
    process.exit(built);
  }
}

console.log("\nRunning tests.\n");

const code = await run(process.execPath, ["--test", "--test-concurrency=1", ...FILES]);

if (code !== 0) console.error("\nSomething failed. Scroll up for WHAT BROKE and WHY IT MATTERS.\n");
process.exit(code);
