/**
 * Bot filter for the intake form.
 *
 * Oct 2026: a bot started filling /intake with keyboard-mash names and a
 * random-case string tacked onto the notes ("KuMPAdYmdYSshemEKco"), often with
 * a phone carrier's text gateway as the email (3238418892@txt.att.net) so the
 * "thank you" receipt lands as an SMS on somebody's phone.
 *
 * Kept deliberately narrow. A missed bot costs one email; a blocked real lead
 * costs a client. Every check here is something a person never does.
 */

// Email-to-SMS gateways. A real client never gives one of these as their email.
const SMS_GATEWAYS =
  /@(txt\.att\.net|mms\.att\.net|vtext\.com|vzwpix\.com|tmomail\.net|messaging\.sprintpcs\.com|pm\.sprint\.com|mymetropcs\.com|sms\.myboostmobile\.com|myboostmobile\.com|sms\.cricketwireless\.net|mms\.cricketwireless\.net|email\.uscc\.net|msg\.fi\.google\.com|text\.republicwireless\.com|vmobl\.com|mmst5\.tracfone\.com)$/i;

// One long word that flips case over and over: "KuMPAdYmdYSshemEKco".
// Real words carry one or two inner capitals at most (FlowZone, McDonald).
// All-caps words (acronyms, a shouted email) are left alone.
function chaosCase(text: string): boolean {
  for (const word of text.split(/[^A-Za-z]+/)) {
    if (word.length < 10) continue;
    const innerUpper = (word.slice(1).match(/[A-Z]/g) || []).length;
    const lower = (word.match(/[a-z]/g) || []).length;
    if (innerUpper >= 4 && lower >= 4) return true;
  }
  return false;
}

export type SpamCheck = {
  email: string;
  name: string;
  business: string;
  description: string;
  honeypot?: unknown;
  elapsedMs?: unknown;
};

/** Returns why it looks like a bot, or null when it looks like a person. */
export function spamReason(f: SpamCheck): string | null {
  if (typeof f.honeypot === "string" && f.honeypot.trim()) return "honeypot";
  if (typeof f.elapsedMs === "number" && f.elapsedMs >= 0 && f.elapsedMs < 3000) return "too-fast";
  if (SMS_GATEWAYS.test(f.email)) return "sms-gateway";
  if (chaosCase(`${f.name} ${f.business} ${f.description}`)) return "gibberish";
  return null;
}
