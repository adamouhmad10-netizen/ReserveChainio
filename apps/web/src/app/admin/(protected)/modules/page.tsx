import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { appendAudit } from "@/lib/audit";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Module Visibility" };

// Modules gated by written authorization cannot be enabled here — the toggle
// is refused server-side, not merely hidden. Safe modules can be toggled with
// a mandatory reason, recorded in the audit trail.

async function toggleModule(formData: FormData) {
  "use server";
  const user = currentUser();
  if (!user || !user.roles.includes("super_admin")) return;
  const moduleKey = String(formData.get("module"));
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 10) return;
  const d = getDb();
  const row = d
    .prepare("SELECT module, state, requires_written_authorization FROM module_visibility WHERE module = ?")
    .get(moduleKey) as { module: string; state: string; requires_written_authorization: number } | undefined;
  if (!row) return;
  if (row.requires_written_authorization) {
    appendAudit(d, {
      actor: user.email,
      action: "module.activation_refused",
      entity: "module_visibility",
      recordId: moduleKey,
      reason: `Activation attempt refused: module requires written issuer authorization. Stated reason: ${reason}`,
    });
    revalidatePath("/admin/modules");
    return;
  }
  const next = row.state === "enabled" ? "disabled" : "enabled";
  d.prepare("UPDATE module_visibility SET state = ? WHERE module = ?").run(next, moduleKey);
  appendAudit(d, {
    actor: user.email,
    action: "module.state_changed",
    entity: "module_visibility",
    recordId: moduleKey,
    previousValue: { state: row.state },
    newValue: { state: next },
    reason,
  });
  revalidatePath("/admin/modules");
}

export default function AdminModulesPage() {
  const mods = getDb()
    .prepare("SELECT module, label, state, reason, activation_dependency, requires_written_authorization FROM module_visibility ORDER BY requires_written_authorization, label")
    .all() as any[];

  return (
    <>
      <h1 className="h-display text-2xl">Module Visibility</h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        Financial and offering modules require written issuer authorization: the server refuses
        activation attempts and records the refusal in the audit trail. Nothing auto-activates.
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {mods.map((m) => (
          <div key={m.module} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-ink">{m.label}</h2>
              <div className="flex gap-2">
                <StatusPill tone={m.state === "enabled" ? "ok" : m.state === "architecture_prepared" ? "development" : "inactive"}>
                  {m.state.replace(/_/g, " ")}
                </StatusPill>
                {m.requires_written_authorization ? <StatusPill tone="warn">Written authorization required</StatusPill> : null}
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-2">{m.reason}</p>
            <p className="mt-1 text-xs text-muted">
              <span className="text-ink-2">Activation dependency:</span> {m.activation_dependency}
            </p>
            <form action={toggleModule} className="mt-3 flex flex-wrap items-center gap-2">
              <input type="hidden" name="module" value={m.module} />
              <input
                name="reason"
                placeholder="Reason for change (min 10 chars, audited)"
                className="field max-w-xs !py-1.5 text-xs"
                aria-label={`Reason for changing ${m.label}`}
              />
              <button
                type="submit"
                className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                  m.requires_written_authorization
                    ? "border-line text-muted"
                    : "border-gold/40 text-gold hover:bg-gold/10"
                }`}
              >
                {m.requires_written_authorization
                  ? "Attempt toggle (will be refused + audited)"
                  : m.state === "enabled" ? "Disable" : "Enable"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
