import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { appendAudit } from "@/lib/audit";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website Modes" };

async function activateMode(formData: FormData) {
  "use server";
  const user = currentUser();
  if (!user || !user.roles.includes("super_admin")) return;
  const mode = String(formData.get("mode"));
  const d = getDb();
  const row = d
    .prepare("SELECT mode, label, is_active, requires_written_authorization FROM website_modes WHERE mode = ?")
    .get(mode) as { mode: string; label: string; is_active: number; requires_written_authorization: number } | undefined;
  if (!row || row.is_active) return;
  if (row.requires_written_authorization) {
    appendAudit(d, {
      actor: user.email,
      action: "website_mode.activation_refused",
      entity: "website_modes",
      recordId: mode,
      reason: "Mode requires explicit written issuer authorization and deployment approval; refusal recorded.",
    });
    revalidatePath("/admin/website-modes");
    return;
  }
  const prev = d.prepare("SELECT mode FROM website_modes WHERE is_active = 1").get() as { mode: string } | undefined;
  const tx = d.transaction(() => {
    d.prepare("UPDATE website_modes SET is_active = 0").run();
    d.prepare("UPDATE website_modes SET is_active = 1 WHERE mode = ?").run(mode);
    appendAudit(d, {
      actor: user.email,
      action: "website_mode.set",
      entity: "website_modes",
      recordId: mode,
      previousValue: { mode: prev?.mode },
      newValue: { mode },
      reason: "Safe prelaunch mode transition",
    });
  });
  tx();
  revalidatePath("/admin/website-modes");
}

export default function AdminWebsiteModesPage() {
  const modes = getDb()
    .prepare("SELECT mode, label, is_active, requires_written_authorization FROM website_modes ORDER BY sort")
    .all() as any[];

  return (
    <>
      <h1 className="h-display text-2xl">Website Modes</h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        Only Development, Pre-Launch, Waitlist and Documentation Release may be activated without
        written issuer authorization. Live Offering, purchase, wallet, eligibility and redemption
        modes never activate automatically and are refused server-side.
      </p>
      <div className="table-scroll mt-5 max-w-3xl">
        <table className="data-table">
          <thead>
            <tr><th>Mode</th><th>Status</th><th>Gate</th><th>Action</th></tr>
          </thead>
          <tbody>
            {modes.map((m) => (
              <tr key={m.mode}>
                <td className="text-ink">{m.label}</td>
                <td>
                  {m.is_active ? <StatusPill tone="ok">Active</StatusPill> : <StatusPill tone="inactive">Inactive</StatusPill>}
                </td>
                <td>
                  {m.requires_written_authorization
                    ? <StatusPill tone="warn">Written authorization</StatusPill>
                    : <span className="text-xs text-muted">Safe prelaunch mode</span>}
                </td>
                <td>
                  {m.is_active ? (
                    <span className="text-xs text-muted">Current mode</span>
                  ) : (
                    <form action={activateMode}>
                      <input type="hidden" name="mode" value={m.mode} />
                      <button
                        type="submit"
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                          m.requires_written_authorization ? "border-line text-muted" : "border-gold/40 text-gold hover:bg-gold/10"
                        }`}
                      >
                        {m.requires_written_authorization ? "Attempt (refused + audited)" : "Activate"}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
