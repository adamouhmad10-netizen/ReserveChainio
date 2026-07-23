import { NextResponse } from "next/server";
import { currentUser, logout } from "@/lib/auth";
import { appendAudit } from "@/lib/audit";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = currentUser();
  logout();
  if (user) {
    appendAudit(getDb(), { actor: user.email, action: "admin.logout", entity: "sessions" });
  }
  return NextResponse.json({ ok: true });
}
