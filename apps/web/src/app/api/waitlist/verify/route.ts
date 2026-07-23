import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getDb } from "@/lib/db";
import { appendAudit } from "@/lib/audit";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

// Email verification endpoint: /api/waitlist/verify?token=…
// The link is delivered by email once a transactional email provider is
// configured (documented third-party dependency).
export async function GET(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`verify:${ip}`, 10, 10 * 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token || token.length !== 64) {
    return NextResponse.json({ error: "Invalid verification token." }, { status: 400 });
  }
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const d = getDb();
  const row = d
    .prepare(
      `SELECT ev.id, ev.registration_id FROM email_verifications ev
       WHERE ev.token_hash = ? AND ev.consumed_at IS NULL AND ev.expires_at > datetime('now')`
    )
    .get(tokenHash) as { id: string; registration_id: string } | undefined;
  if (!row) {
    return NextResponse.json({ error: "Verification token is invalid, expired or already used." }, { status: 400 });
  }

  const tx = d.transaction(() => {
    d.prepare("UPDATE email_verifications SET consumed_at = datetime('now') WHERE id = ?").run(row.id);
    d.prepare(
      "UPDATE waitlist_registrations SET status = 'verified', verified_at = datetime('now') WHERE id = ?"
    ).run(row.registration_id);
    appendAudit(d, {
      actor: "public:waitlist",
      action: "waitlist.email_verified",
      entity: "waitlist_registrations",
      recordId: row.registration_id,
      previousValue: { status: "pending_verification" },
      newValue: { status: "verified" },
    });
  });
  tx();

  return NextResponse.redirect(new URL("/waitlist?verified=1", req.url));
}
