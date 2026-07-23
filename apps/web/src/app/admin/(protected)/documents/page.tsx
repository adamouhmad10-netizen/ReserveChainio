import { getDb } from "@/lib/db";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Documents" };

export default function AdminDocumentsPage() {
  const rows = getDb()
    .prepare(
      `SELECT doc.id, doc.title, doc.file_ref, doc.doc_status, doc.visibility, doc.version, doc.notes, doc.is_demo,
              c.name AS category
       FROM documents doc LEFT JOIN document_categories c ON c.id = doc.category_id
       ORDER BY c.sort, doc.title`
    )
    .all() as any[];

  return (
    <>
      <h1 className="h-display text-2xl">Documents</h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        Document register with categories, versions, approval status and public/private/pending
        visibility. Private and pending documents are never exposed through public pages or public
        APIs. Owner-supplied laboratory certificates are held as approved previews only.
      </p>
      <div className="table-scroll mt-5">
        <table className="data-table">
          <thead>
            <tr><th>Category</th><th>Title</th><th>Status</th><th>Visibility</th><th>v</th><th>File</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="text-xs">{r.category ?? "—"}</td>
                <td className="text-ink">{r.title}</td>
                <td>
                  <StatusPill tone={r.doc_status === "approved_preview" ? "development" : r.doc_status === "in_preparation" ? "pending" : "inactive"}>
                    {r.doc_status.replace(/_/g, " ")}
                  </StatusPill>
                </td>
                <td>
                  <StatusPill tone={r.visibility === "public" ? "ok" : "inactive"}>{r.visibility}</StatusPill>
                </td>
                <td className="font-mono text-xs">{r.version}</td>
                <td className="font-mono text-[10px]">{r.file_ref ?? <span className="text-muted">none</span>}</td>
                <td className="max-w-sm text-[11px] text-muted">{r.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
