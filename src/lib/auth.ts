import { cookies } from "next/headers";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb, newId } from "@/lib/db";

// Demo administrative auth layer: scrypt-hashed credentials, HMAC-signed
// session cookie, DB-backed sessions with expiry. Production hardening path
// (MFA enrolment, device controls, lockout) is documented in
// docs/security-architecture.md; MFA fields exist in the schema.

const SESSION_COOKIE = "rc_admin_session";
const SESSION_HOURS = 8;

function secret(): string {
  return process.env.RC_SESSION_SECRET ?? "insecure-dev-secret-change-me";
}

function sign(value: string): string {
  return `${value}.${createHmac("sha256", secret()).update(value).digest("hex")}`;
}

function unsign(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return null;
  const value = signed.slice(0, idx);
  const mac = signed.slice(idx + 1);
  const expected = createHmac("sha256", secret()).update(value).digest("hex");
  if (mac.length !== expected.length) return null;
  return timingSafeEqual(Buffer.from(mac), Buffer.from(expected)) ? value : null;
}

export function verifyPassword(stored: string, candidate: string): boolean {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const derived = scryptSync(candidate, salt, 64).toString("hex");
  return derived.length === hash.length && timingSafeEqual(Buffer.from(derived), Buffer.from(hash));
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
}

export function login(email: string, password: string, meta: { ip?: string; userAgent?: string }): AdminUser | null {
  const d = getDb();
  const user = d
    .prepare("SELECT id, email, password_hash, display_name FROM users WHERE email = ? AND status = 'active'")
    .get(email.toLowerCase().trim()) as { id: string; email: string; password_hash: string | null; display_name: string } | undefined;
  if (!user?.password_hash || !verifyPassword(user.password_hash, password)) return null;

  const sessionId = newId();
  const expires = new Date(Date.now() + SESSION_HOURS * 3600_000).toISOString();
  d.prepare(
    "INSERT INTO sessions (id, user_id, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?)"
  ).run(sessionId, user.id, expires, meta.ip ?? null, meta.userAgent ?? null);

  cookies().set(SESSION_COOKIE, sign(sessionId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
  return currentUserFromSession(sessionId);
}

export function logout() {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (raw) {
    const sessionId = unsign(raw);
    if (sessionId) getDb().prepare("UPDATE sessions SET revoked = 1 WHERE id = ?").run(sessionId);
  }
  cookies().delete(SESSION_COOKIE);
}

function currentUserFromSession(sessionId: string): AdminUser | null {
  const d = getDb();
  const row = d
    .prepare(
      `SELECT u.id, u.email, u.display_name FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.revoked = 0 AND s.expires_at > datetime('now') AND u.status = 'active'`
    )
    .get(sessionId) as { id: string; email: string; display_name: string } | undefined;
  if (!row) return null;
  const roles = (
    d.prepare(
      "SELECT r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = ?"
    ).all(row.id) as { name: string }[]
  ).map((r) => r.name);
  return { id: row.id, email: row.email, displayName: row.display_name, roles };
}

export function currentUser(): AdminUser | null {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const sessionId = unsign(raw);
  if (!sessionId) return null;
  return currentUserFromSession(sessionId);
}
