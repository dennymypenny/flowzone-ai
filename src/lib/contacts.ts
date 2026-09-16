/**
 * The email list.
 *
 * Every address a visitor agrees to share also goes into Resend Contacts, so
 * Denny can follow up with a Broadcast from the Resend dashboard instead of
 * digging addresses out of his inbox. Optional RESEND_SEGMENT_ID drops them
 * into one segment too.
 *
 * Best effort by design: the lead email to the inbox is the thing that must
 * work. If this call fails (a sending-only key, a duplicate, an outage) it is
 * logged and the visitor never sees an error.
 */
export async function addToList(opts: { email: string; name?: string; source: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const [first, ...rest] = (opts.name || "").trim().split(/\s+/);
  const segment = process.env.RESEND_SEGMENT_ID;
  try {
    const res = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: opts.email,
        ...(first ? { first_name: first } : {}),
        ...(rest.length ? { last_name: rest.join(" ") } : {}),
        unsubscribed: false,
        properties: { source: opts.source },
        ...(segment ? { segments: [{ id: segment }] } : {}),
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) {
      console.error("[FlowZone List] contact not added:", res.status, await res.text().catch(() => ""), "|", opts.email);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[FlowZone List] contact add threw:", e, "|", opts.email);
    return false;
  }
}
