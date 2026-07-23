import { getDb } from "@/lib/db";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiries" };

export default function AdminEnquiriesPage() {
  const rows = getDb()
    .prepare("SELECT id, enquiry_type, organization, contact_name, email, country, message, status, created_at FROM enquiries ORDER BY created_at DESC LIMIT 200")
    .all() as any[];
  return (
    <>
      <h1 className="h-display text-2xl">Enquiries</h1>
      <div className="table-scroll mt-5">
        <table className="data-table">
          <thead>
            <tr><th>Type</th><th>Contact</th><th>Organization</th><th>Country</th><th>Message</th><th>Status</th><th>Received</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-muted">No enquiries received yet.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id}>
                <td className="capitalize">{r.enquiry_type.replace(/_/g, " ")}</td>
                <td className="text-ink">{r.contact_name}<br /><span className="font-mono text-xs text-ink-2">{r.email}</span></td>
                <td>{r.organization ?? "—"}</td>
                <td>{r.country ?? "—"}</td>
                <td className="max-w-md whitespace-pre-wrap text-xs">{r.message}</td>
                <td><StatusPill tone={r.status === "new" ? "info" : "ok"}>{r.status}</StatusPill></td>
                <td className="font-mono text-xs">{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
