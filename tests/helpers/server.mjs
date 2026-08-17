import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Starts and stops the real production server for a test file.
 *
 * WHY the real server and not a mock: three of the five suites are about
 * things only the real stack produces. Middleware rate limiting, rendered
 * <head> metadata and lazily loaded client chunks do not exist in a mock, so a
 * mock would pass while the site was broken.
 */

export const ROOT = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));

const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");

/**
 * WHY we refuse to run instead of building silently: a stale or missing build
 * would make every suite fail for a reason that has nothing to do with the
 * bugs these tests guard. Better to say so in one clear line.
 */
function requireBuild() {
  if (!existsSync(path.join(ROOT, ".next", "BUILD_ID"))) {
    throw new Error(
      "No production build found at .next/BUILD_ID.\n" +
        "Run `npm run test:build` first, or just run `npm test` which builds for you."
    );
  }
}

/**
 * Start `next start` on its own port.
 *
 * `withResendKey: false` starts the server with RESEND_API_KEY removed, which
 * is how the API suite proves the missing key path really returns a non-200
 * instead of a cheerful 200.
 */
export async function startServer({ port, withResendKey = true, label = "site" }) {
  requireBuild();

  const env = { ...process.env, NODE_ENV: "production" };
  if (withResendKey) env.RESEND_API_KEY = "re_dummy_for_tests";
  else delete env.RESEND_API_KEY;

  // detached so the child gets its own process group. Killing the group takes
  // the server and anything it spawned, with no orphan left holding the port.
  const child = spawn(process.execPath, [NEXT_BIN, "start", "-p", String(port)], {
    cwd: ROOT,
    env,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout.on("data", (d) => (output += d));
  child.stderr.on("data", (d) => (output += d));

  let exited = false;
  child.on("exit", () => (exited = true));

  const baseUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 60_000;

  // Poll until it answers. A fixed sleep is a coin flip on a loaded machine.
  while (Date.now() < deadline) {
    if (exited) {
      throw new Error(`The ${label} server died before it answered.\nServer output:\n${output}`);
    }
    try {
      const res = await fetch(baseUrl + "/", { signal: AbortSignal.timeout(3000) });
      if (res.status < 500) {
        await res.arrayBuffer();
        return { baseUrl, port, stop: () => stop(child) };
      }
    } catch {
      // Not up yet. Keep waiting.
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  await stop(child);
  throw new Error(
    `The ${label} server never answered on ${baseUrl} within 60 seconds.\nServer output:\n${output}`
  );
}

async function stop(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    // Already gone.
  }
  await new Promise((resolve) => {
    const done = setTimeout(() => {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {
        // Already gone.
      }
      resolve();
    }, 5000);
    child.on("exit", () => {
      clearTimeout(done);
      resolve();
    });
  });
}
