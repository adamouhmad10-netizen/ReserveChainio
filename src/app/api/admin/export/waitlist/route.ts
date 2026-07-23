import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { appendAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const d = getDb();
  const rows = d
    .prepare(
      `SELECT first_name, last_name, email, country_of_residence, interest_type,
              is_industrial_buyer, is_asset_originator, material_interest, interest_range,
              participation_type, status, campaign_source, created_at, verified_at
       FROM waitlist_registrations ORDER BY created_at DESC`
    )
    .all() as Record<string, unknown>[];

  const headers = rows.length ? Object.keys(rows[0]) : ["no_records"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\r\n");

  appendAudit(d, {
    actor: user.email,
    action: "waitlist.exported",
    entity: "waitlist_registrations",
    newValue: { rows: rows.length },
    reason: "Administrative CSV export",
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reservechain-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
