import Link from "next/link";
import { getDb } from "@/lib/db";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Digital Asset Passports" };

export default function AdminPassportsPage() {
  const d = getDb();
  const rows = d
    .prepare(
      `SELECT p.id, p.passport_code, p.slug, p.version, p.publication_status, p.visibility, p.is_demo,
              a.title AS asset_title, a.identifier,
              (SELECT COUNT(*) FROM passport_events e WHERE e.passport_id = p.id) AS events,
              (SELECT COUNT(*) FROM passport_versions v WHERE v.passport_id = p.id) AS versions
       FROM passport_records p JOIN physical_assets a ON a.id = p.asset_id ORDER BY p.passport_code`
    )
    .all() as any[];

  return (
    <>
      <h1 className="h-display text-2xl">Digital Asset Passports</h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        Passport records with version history, event history, publication status and visibility
        control. Current records are illustrative templates and carry the mandatory template
        notice on the public page.
      </p>
      <div className="table-scroll mt-5">
        <table className="data-table">
          <thead>
            <tr><th>Passport code</th><th>Asset</th><th>Version</th><th>Versions</th><th>Events</th><th>Publication</th><th>Visibility</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-xs text-ink">
                  {r.passport_code}
                  {r.is_demo ? <span className="ml-1.5 rounded bg-warn/15 px-1 py-0.5 font-mono text-[9px] uppercase text-warn">demo</span> : null}
                </td>
                <td>{r.asset_title}<br /><span className="font-mono text-[10px] text-muted">{r.identifier}</span></td>
                <td className="font-mono text-xs">v{r.version}</td>
                <td className="font-mono text-xs">{r.versions}</td>
                <td className="font-mono text-xs">{r.events}</td>
                <td><StatusPill tone="ok">{r.publication_status}</StatusPill></td>
                <td className="capitalize">{r.visibility}</td>
                <td><Link href={`/digital-asset-passports/${r.slug}`} className="text-xs font-medium text-gold">Open →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
