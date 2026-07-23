import { revalidatePath } from "next/cache";
import { getDb, newId } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { appendAudit } from "@/lib/audit";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content Workflow" };

// Publication workflow: Draft → Under Review → Approved → Published, plus
// Unpublished and Archived. Publishing/unpublishing requires the reviewer or
// super_admin role (maker-checker separation); every transition is audited.

const TRANSITIONS: Record<string, { to: string; label: string; reviewerOnly: boolean }[]> = {
  draft: [{ to: "under_review", label: "Submit for review", reviewerOnly: false }],
  under_review: [
    { to: "approved", label: "Approve", reviewerOnly: true },
    { to: "draft", label: "Return to draft", reviewerOnly: false },
  ],
  approved: [
    { to: "published", label: "Publish", reviewerOnly: true },
    { to: "draft", label: "Return to draft", reviewerOnly: false },
  ],
  published: [
    { to: "unpublished", label: "Unpublish", reviewerOnly: true },
    { to: "archived", label: "Archive", reviewerOnly: true },
  ],
  unpublished: [
    { to: "published", label: "Republish", reviewerOnly: true },
    { to: "archived", label: "Archive", reviewerOnly: true },
  ],
  archived: [],
};

async function transition(formData: FormData) {
  "use server";
  const user = currentUser();
  if (!user) return;
  const pageId = String(formData.get("pageId"));
  const to = String(formData.get("to"));
  const d = getDb();
  const page = d.prepare("SELECT id, slug, status FROM content_pages WHERE id = ?").get(pageId) as
    | { id: string; slug: string; status: string }
    | undefined;
  if (!page) return;
  const allowed = TRANSITIONS[page.status]?.find((t) => t.to === to);
  if (!allowed) return;
  const isReviewer = user.roles.includes("reviewer") || user.roles.includes("super_admin");
  if (allowed.reviewerOnly && !isReviewer) return;

  const tx = d.transaction(() => {
    d.prepare("UPDATE content_pages SET status = ?, updated_at = datetime('now') WHERE id = ?").run(to, pageId);
    const v = d.prepare("SELECT COALESCE(MAX(version),0)+1 v FROM content_versions WHERE page_id = ?").get(pageId) as { v: number };
    d.prepare(
      "INSERT INTO content_versions (id, page_id, version, body, status_at_capture, captured_by) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(newId(), pageId, v.v, `Status transition to ${to}`, to, user.id);
    appendAudit(d, {
      actor: user.email,
      action: "content.status_changed",
      entity: "content_pages",
      recordId: pageId,
      previousValue: { status: page.status },
      newValue: { status: to },
      reason: `Publication workflow transition (${page.slug})`,
    });
  });
  tx();
  revalidatePath("/admin/content");
}

const TONE: Record<string, "pending" | "development" | "ok" | "inactive"> = {
  draft: "pending",
  under_review: "development",
  approved: "development",
  published: "ok",
  unpublished: "inactive",
  archived: "inactive",
};

export default function AdminContentPage() {
  const user = currentUser();
  const isReviewer = !!user && (user.roles.includes("reviewer") || user.roles.includes("super_admin"));
  const pages = getDb()
    .prepare("SELECT id, slug, title, status, updated_at FROM content_pages ORDER BY updated_at DESC")
    .all() as { id: string; slug: string; title: string; status: string; updated_at: string }[];

  return (
    <>
      <h1 className="h-display text-2xl">Content Publication Workflow</h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        Draft → Under Review → Approved → Published (plus Unpublished / Archived). Draft and
        under-review content is never publicly accessible or indexed. Publishing requires the
        reviewer or super-admin role; every transition creates a version snapshot and an audit
        entry. Published records are unpublished or archived — never hard-deleted from this
        interface.
      </p>
      <div className="table-scroll mt-5">
        <table className="data-table">
          <thead>
            <tr><th>Page</th><th>Slug</th><th>Status</th><th>Updated</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id}>
                <td className="text-ink">{p.title}</td>
                <td className="font-mono text-xs">{p.slug}</td>
                <td><StatusPill tone={TONE[p.status] ?? "inactive"}>{p.status.replace(/_/g, " ")}</StatusPill></td>
                <td className="font-mono text-xs">{p.updated_at}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {(TRANSITIONS[p.status] ?? []).map((t) => {
                      const blocked = t.reviewerOnly && !isReviewer;
                      return (
                        <form key={t.to} action={transition}>
                          <input type="hidden" name="pageId" value={p.id} />
                          <input type="hidden" name="to" value={t.to} />
                          <button
                            type="submit"
                            disabled={blocked}
                            title={blocked ? "Requires reviewer or super-admin role (maker-checker)" : undefined}
                            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                              blocked
                                ? "cursor-not-allowed border-line text-muted"
                                : "border-gold/40 text-gold hover:bg-gold/10"
                            }`}
                          >
                            {t.label}
                            {t.reviewerOnly ? " ⑂" : ""}
                          </button>
                        </form>
                      );
                    })}
                    {(TRANSITIONS[p.status] ?? []).length === 0 ? <span className="text-xs text-muted">Terminal state</span> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">⑂ = requires reviewer or super-admin role (maker-checker separation).</p>
    </>
  );
}
