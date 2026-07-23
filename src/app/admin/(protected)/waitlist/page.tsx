import { getDb } from "@/lib/db";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Waitlist" };

interface Search {
  country?: string;
  material?: string;
  type?: string;
  status?: string;
  q?: string;
}

export default function AdminWaitlistPage({ searchParams }: { searchParams: Search }) {
  const d = getDb();
  const where: string[] = [];
  const params: Record<string, string> = {};
  if (searchParams.country) { where.push("country_of_residence LIKE @country"); params.country = `%${searchParams.country}%`; }
  if (searchParams.material) { where.push("material_interest = @material"); params.material = searchParams.material; }
  if (searchParams.type) { where.push("interest_type = @type"); params.type = searchParams.type; }
  if (searchParams.status) { where.push("status = @status"); params.status = searchParams.status; }
  if (searchParams.q) { where.push("(email LIKE @q OR first_name LIKE @q OR last_name LIKE @q)"); params.q = `%${searchParams.q}%`; }
  const rows = d
    .prepare(
      `SELECT id, first_name, last_name, email, country_of_residence, interest_type,
              is_industrial_buyer, is_asset_originator, material_interest, interest_range,
              status, campaign_source, created_at
       FROM waitlist_registrations ${where.length ? "WHERE " + where.join(" AND ") : ""}
       ORDER BY created_at DESC LIMIT 200`
    )
    .all(params) as any[];

  const exportQs = new URLSearchParams(searchParams as Record<string, string>).toString();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="h-display text-2xl">Waitlist Registrations</h1>
        <a href={`/api/admin/export/waitlist?${exportQs}`} className="btn-secondary !py-2 text-xs">
          Export CSV (audited)
        </a>
      </div>

      <form method="get" className="card mt-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input name="q" defaultValue={searchParams.q} placeholder="Search name or email" className="field" aria-label="Search" />
        <input name="country" defaultValue={searchParams.country} placeholder="Country" className="field" aria-label="Country filter" />
        <select name="material" defaultValue={searchParams.material ?? ""} className="field" aria-label="Material filter">
          <option value="">All materials</option>
          <option value="copper">Copper Powder</option>
          <option value="nickel">Nickel Wire</option>
          <option value="both">Both</option>
          <option value="future">Future programs</option>
        </select>
        <select name="type" defaultValue={searchParams.type ?? ""} className="field" aria-label="Type filter">
          <option value="">All types</option>
          <option value="individual">Individual</option>
          <option value="institutional">Institutional</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1 !py-2 text-xs">Filter</button>
          <a href="/admin/waitlist" className="btn-ghost !py-2 text-xs">Reset</a>
        </div>
      </form>

      <div className="table-scroll mt-5">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Country</th><th>Type</th><th>Material</th>
              <th>Range</th><th>Flags</th><th>Status</th><th>Source</th><th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={10} className="py-8 text-center text-muted">No registrations match the current filters.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id}>
                <td className="text-ink">{r.first_name} {r.last_name}</td>
                <td className="font-mono text-xs">{r.email}</td>
                <td>{r.country_of_residence}</td>
                <td className="capitalize">{r.interest_type}</td>
                <td className="capitalize">{r.material_interest}</td>
                <td className="font-mono text-xs">{r.interest_range}</td>
                <td className="font-mono text-[10px] uppercase">
                  {[r.is_industrial_buyer ? "buyer" : null, r.is_asset_originator ? "originator" : null].filter(Boolean).join(" · ") || "—"}
                </td>
                <td><StatusPill tone={r.status === "verified" ? "ok" : "pending"}>{r.status.replace(/_/g, " ")}</StatusPill></td>
                <td className="text-xs">{r.campaign_source ?? "—"}</td>
                <td className="font-mono text-xs">{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Showing up to 200 rows. Personal data handling (correction, anonymization, deletion)
        follows the approved retention procedures; exports are recorded in the audit trail.
      </p>
    </>
  );
}
