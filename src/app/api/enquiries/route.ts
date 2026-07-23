import { NextRequest, NextResponse } from "next/server";
import { getDb, newId } from "@/lib/db";
import { appendAudit } from "@/lib/audit";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { enquirySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`enquiry:${ip}`, 5, 10 * 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many enquiries. Please retry later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation failed." }, { status: 422 });
  }
  const input = parsed.data;
  if (input.website && input.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const d = getDb();
  const id = newId();
  d.prepare(
    `INSERT INTO enquiries (id, enquiry_type, organization, contact_name, email, country, message)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, input.enquiryType, input.organization ?? null, input.contactName, input.email, input.country ?? null, input.message);
  appendAudit(d, {
    actor: "public:enquiry",
    action: "enquiry.submitted",
    entity: "enquiries",
    recordId: id,
    newValue: { type: input.enquiryType },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
