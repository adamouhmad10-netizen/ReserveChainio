import { getDb } from "@/lib/db";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jurisdictions" };

export default function AdminJurisdictionsPage() {
  const rows = getDb()
    .prepare("SELECT country_code, country_name, classification, notes FROM jurisdiction_rules ORDER BY classification, country_name")
    .all() as any[];

  return (
    <>
      <h1 className="h-display text-2xl">Jurisdiction Rules</h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        Configurable permitted / restricted / pending classifications. The project owners and their
        legal advisers determine the final rules; the platform implements them. Eligibility
        decisions are recorded with a complete audit history.
      </p>
      <div className="table-scroll mt-5">
        <table className="data-table">
          <thead>
            <tr><th>Code</th><th>Country</th><th>Classification</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.country_code}>
                <td className="font-mono text-xs text-ink">{r.country_code}</td>
                <td>{r.country_name}</td>
                <td>
                  <StatusPill tone={r.classification === "restricted" ? "warn" : r.classification === "permitted" ? "ok" : "pending"}>
                    {r.classification.replace(/_/g, " ")}
                  </StatusPill>
                </td>
                <td className="max-w-lg text-xs text-muted">{r.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
