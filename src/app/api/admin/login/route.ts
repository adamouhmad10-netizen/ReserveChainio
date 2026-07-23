import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { appendAudit } from "@/lib/audit";
import { getDb } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { adminLoginSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`admin-login:${ip}`, 5, 15 * 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
  const user = login(parsed.data.email, parsed.data.password, {
    ip,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });
  if (!user) {
    appendAudit(getDb(), {
      actor: `anonymous@${ip}`,
      action: "admin.login_failed",
      entity: "sessions",
      reason: "Invalid credentials",
    });
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
  appendAudit(getDb(), {
    actor: user.email,
    action: "admin.login",
    entity: "sessions",
  });
  return NextResponse.json({ ok: true, user: { email: user.email, roles: user.roles } });
}
