import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { getDb, newId } from "@/lib/db";
import { appendAudit } from "@/lib/audit";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import {
  waitlistSchema,
  CONSENT_TEXT_VERSION,
  NO_ENTITLEMENT_ACK_TEXT,
  PRIVACY_ACK_TEXT,
  UPDATES_CONSENT_TEXT,
} from "@/lib/validation";

export const dynamic = "force-dynamic";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`waitlist:${ip}`, 5, 10 * 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many registration attempts. Please retry in ${rl.retryAfterSeconds} seconds.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ error: "Validation failed.", fieldErrors }, { status: 422 });
  }
  const input = parsed.data;

  // Honeypot filled → pretend success without persisting.
  if (input.website && input.website.length > 0) {
    return NextResponse.json({ status: "pending_verification" }, { status: 201 });
  }

  const d = getDb();
  const existing = d
    .prepare("SELECT id, status FROM waitlist_registrations WHERE email = ?")
    .get(input.email) as { id: string; status: string } | undefined;
  if (existing) {
    // Do not leak account state beyond a duplicate signal; no data is modified.
    return NextResponse.json({ status: existing.status, duplicate: true }, { status: 200 });
  }

  const id = newId();
  const token = randomBytes(32).toString("hex");
  const ipHash = sha256(ip);

  const tx = d.transaction(() => {
    d.prepare(
      `INSERT INTO waitlist_registrations
       (id, first_name, last_name, email, country_of_residence, interest_type,
        is_industrial_buyer, is_asset_originator, material_interest, interest_range,
        participation_type, referrer, campaign_source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, input.firstName, input.lastName, input.email, input.countryOfResidence,
      input.interestType, input.isIndustrialBuyer ? 1 : 0, input.isAssetOriginator ? 1 : 0,
      input.materialInterest, input.interestRange, input.participationType,
      req.headers.get("referer") ?? null, input.campaignSource ?? null
    );

    d.prepare(
      `INSERT INTO email_verifications (id, registration_id, token_hash, expires_at)
       VALUES (?, ?, ?, datetime('now', '+7 days'))`
    ).run(newId(), id, sha256(token));

    const consents: [string, string][] = [
      ["updates", UPDATES_CONSENT_TEXT],
      ["privacy", PRIVACY_ACK_TEXT],
      ["no_entitlement_ack", NO_ENTITLEMENT_ACK_TEXT],
    ];
    for (const [type, text] of consents) {
      d.prepare(
        `INSERT INTO consent_records (id, registration_id, consent_type, consent_text_version, consent_text_hash, ip_hash)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(newId(), id, type, CONSENT_TEXT_VERSION, sha256(text), ipHash);
    }

    appendAudit(d, {
      actor: "public:waitlist",
      action: "waitlist.registered",
      entity: "waitlist_registrations",
      recordId: id,
      newValue: { email_domain: input.email.split("@")[1], country: input.countryOfResidence },
      reason: "Public registration of interest (no payment, wallet or reservation collected).",
      requestMeta: { ipHash },
    });
  });
  tx();

  // Email dispatch is a documented third-party dependency (no SMTP provider
  // contracted). The verification token is generated and stored hashed; the
  // dispatch status remains 'pending_email_provider'.
  return NextResponse.json({ status: "pending_verification" }, { status: 201 });
}
