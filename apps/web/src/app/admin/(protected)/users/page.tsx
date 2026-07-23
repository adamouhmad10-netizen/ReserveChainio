import { getDb } from "@/lib/db";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users & Roles" };

const ROLE_DUTIES: Record<string, string> = {
  super_admin: "Full administrative control including sensitive configuration",
  operations: "Registry, asset and logistics operations",
  compliance: "KYC/KYB, jurisdiction and eligibility review",
  finance: "Financial reporting and reconciliation",
  treasury: "Treasury and token administration (inactive in prelaunch)",
  support: "Enquiry and support handling",
  content_editor: "Draft and edit CMS content (cannot publish)",
  reviewer: "Review, approve and publish content",
  auditor: "Read-only audit and evidence access",
};

export default function AdminUsersPage() {
  const d = getDb();
  const users = d
    .prepare(
      `SELECT u.id, u.email, u.display_name, u.status, u.mfa_enrolled, u.created_at,
              (SELECT GROUP_CONCAT(r.name, ', ') FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = u.id) AS roles
       FROM users u ORDER BY u.created_at`
    )
    .all() as any[];
  const roles = d.prepare("SELECT name, description FROM roles ORDER BY name").all() as any[];
  const sessions = d
    .prepare("SELECT COUNT(*) n FROM sessions WHERE revoked = 0 AND expires_at > datetime('now')")
    .get() as { n: number };

  return (
    <>
      <h1 className="h-display text-2xl">Users & Roles</h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        Role-based access control with separation of duties and no shared credentials. Active
        sessions: <span className="font-mono text-ink">{sessions.n}</span>. Multi-factor
        enrolment is part of the production hardening path — the schema field exists and is
        reported below.
      </p>

      <h2 className="h-display mt-6 text-lg">Accounts</h2>
      <div className="table-scroll mt-3">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Roles</th><th>Status</th><th>MFA</th><th>Created</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="text-ink">{u.display_name}</td>
                <td className="font-mono text-xs">{u.email}</td>
                <td className="font-mono text-xs">{u.roles ?? "—"}</td>
                <td><StatusPill tone={u.status === "active" ? "ok" : "inactive"}>{u.status}</StatusPill></td>
                <td><StatusPill tone={u.mfa_enrolled ? "ok" : "pending"}>{u.mfa_enrolled ? "enrolled" : "not enrolled"}</StatusPill></td>
                <td className="font-mono text-xs">{u.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="h-display mt-8 text-lg">Role Matrix</h2>
      <div className="table-scroll mt-3 max-w-3xl">
        <table className="data-table">
          <thead>
            <tr><th>Role</th><th>Duties</th></tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.name}>
                <td className="font-mono text-xs text-ink">{r.name}</td>
                <td className="text-xs">{ROLE_DUTIES[r.name] ?? r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
