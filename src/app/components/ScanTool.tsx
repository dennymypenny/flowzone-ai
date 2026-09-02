"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * The paste-a-link scanner on /scan.
 *
 * Three states, one honest ladder:
 *   idle    -> a single input and a button
 *   scored  -> the number, the grade, the verdict and HOW MANY findings,
 *              with the findings themselves held back behind an email
 *   open    -> the full teardown, plus the same report sent to their inbox
 *
 * The gate is the trade: the scan is free, the details cost an address.
 * The report object stays in client memory between the two steps so the
 * server never has to store anything.
 */

type Check = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  points: number;
  max: number;
  detail: string;
};
type Category = { id: string; name: string; score: number; max: number; checks: Check[] };
type Report = {
  url: string;
  finalUrl: string;
  host: string;
  score: number;
  grade: string;
  verdict: string;
  ttfbMs: number;
  totalMs: number;
  htmlKb: number;
  categories: Category[];
  topFixes: string[];
};

const STATUS: Record<Check["status"], { word: string; cls: string }> = {
  pass: { word: "Pass", cls: "text-[#5EE0A0]" },
  warn: { word: "Needs work", cls: "text-[#F5C066]" },
  fail: { word: "Failing", cls: "text-[#F0845F]" },
};

function gradeColor(grade: string) {
  return grade === "A" ? "#5EE0A0" : grade === "B" ? "#5B8CFF" : grade === "C" ? "#F5C066" : "#F0845F";
}

export default function ScanTool() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [email, setEmail] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [open, setOpen] = useState(false);

  const findings = report
    ? report.categories.flatMap((c) => c.checks).filter((k) => k.status !== "pass")
    : [];

  async function scan(e: React.FormEvent) {
    e.preventDefault();
    if (scanning) return;
    setError("");
    setReport(null);
    setOpen(false);
    setScanning(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || "The scan did not come back. Try again.");
      } else {
        setReport(data.report as Report);
      }
    } catch {
      setError("The scan did not come back. Try again.");
    } finally {
      setScanning(false);
    }
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (unlocking || !report) return;
    setUnlockError("");
    setUnlocking(true);
    try {
      const res = await fetch("/api/scan-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, report }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setUnlockError(data.error || "Could not reach the studio. Try again.");
      } else {
        setOpen(true);
      }
    } catch {
      setUnlockError("Could not reach the studio. Try again.");
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step 1: the input */}
      <form onSubmit={scan} className="flex flex-col sm:flex-row gap-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yoursite.com"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-label="The web address to scan"
          className="flex-1 bg-paper-deep text-ink placeholder-ink-mute border border-rule px-5 py-4 text-base font-light outline-none focus:border-accent transition-colors"
        />
        <button type="submit" disabled={scanning} className="btn-primary !px-8 !py-4 disabled:opacity-60">
          {scanning ? "Reading the site…" : "Scan it"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-[#F0845F]">{error}</p>}
      {scanning && (
        <p className="mt-3 text-sm text-ink-mute">
          Fetching the page the way a phone does, then grading it. A few seconds.
        </p>
      )}

      {/* Step 2: the score */}
      {report && (
        <div className="mt-10 bg-paper rounded-xl border border-rule overflow-hidden">
          <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-36 h-36 shrink-0" role="img" aria-label={`Score ${report.score} out of 100`}>
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1E2A44" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={gradeColor(report.grade)} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(report.score / 100) * 326.7} 326.7`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-display text-ink">{report.score}</span>
                <span className="text-xs text-ink-mute">of 100</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="label mb-2">{report.host}</p>
              <p className="text-3xl font-display text-ink mb-2">
                Grade {report.grade}
                {findings.length > 0 && (
                  <span className="text-ink-mute text-xl"> · {findings.length} finding{findings.length === 1 ? "" : "s"}</span>
                )}
              </p>
              <p className="text-ink-soft leading-relaxed">{report.verdict}</p>
              <p className="text-xs text-ink-mute mt-3">
                First byte in {Math.round(report.ttfbMs)}ms · {report.htmlKb}KB of HTML · scanned as a phone
              </p>
            </div>
          </div>

          {/* The gate, or the report */}
          {!open ? (
            <div className="border-t border-rule p-8 sm:p-10 bg-paper-deep">
              {findings.length > 0 ? (
                <>
                  <p className="text-ink mb-1 font-medium">
                    The full teardown names all {findings.length} finding{findings.length === 1 ? "" : "s"}, what each one is costing you and what fixes it.
                  </p>
                  <p className="text-sm text-ink-mute mb-5">
                    Drop your email and it opens here and lands in your inbox. No newsletter, no drip. One report.
                  </p>
                </>
              ) : (
                <p className="text-ink mb-5 font-medium">
                  A clean sweep. Drop your email and we will send the full check-by-check report for your records.
                </p>
              )}
              <form onSubmit={unlock} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Your email"
                  className="flex-1 bg-paper text-ink placeholder-ink-mute border border-rule px-5 py-3.5 text-sm font-light outline-none focus:border-accent transition-colors"
                />
                <button type="submit" disabled={unlocking} className="btn-primary !px-7 !py-3.5 disabled:opacity-60">
                  {unlocking ? "Opening…" : "Open the full report"}
                </button>
              </form>
              {unlockError && <p className="mt-3 text-sm text-[#F0845F]">{unlockError}</p>}
            </div>
          ) : (
            <div className="border-t border-rule">
              {report.categories.map((c) => (
                <div key={c.id} className="p-8 sm:p-10 border-b border-rule last:border-b-0">
                  <div className="flex items-baseline justify-between mb-5">
                    <h3 className="text-xl font-display text-ink">{c.name}</h3>
                    <span className="label">{c.score}/{c.max}</span>
                  </div>
                  <ul className="space-y-4">
                    {c.checks.map((k) => (
                      <li key={k.id} className="flex gap-4">
                        <span className={`text-xs font-bold uppercase tracking-wide w-24 shrink-0 pt-0.5 ${STATUS[k.status].cls}`}>
                          {STATUS[k.status].word}
                        </span>
                        <div>
                          <p className="text-ink text-sm font-medium">{k.label}</p>
                          <p className="text-ink-mute text-sm leading-relaxed">{k.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="p-8 sm:p-10 bg-paper-deep">
                <p className="text-ink font-medium mb-1">Want it fixed instead of listed?</p>
                <p className="text-sm text-ink-soft leading-relaxed mb-5">
                  This is exactly what The Site Build exists for. Scoped before payment, a fixed price and a date, handed over live. A copy of this report is on its way to your inbox.
                </p>
                <Link href="/intake" className="btn-primary inline-block !px-8 !py-3.5">
                  Start The Site Build
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
