import { getDb } from "@/lib/db";
import { verifyChain } from "@/lib/audit";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Audit Trail" };

export default function AdminAuditPage({ searchParams }: { searchParams: { entity?: string; q?: string } }) {
  const d = getDb();
  const chain = verifyChain(d);
  const where: string[] = [];
  const params: Record<string, string> = {};
  if (searchParams.entity) { where.push("entity = @entity"); params.entity = searchParams.entity; }
  if (searchParams.q) { where.push("(action LIKE @q OR actor LIKE @q OR reason LIKE @q)"); params.q = `%${searchParams.q}%`; }
  const rows = d
    .prepare(
      `SELECT seq, actor, action, entity, record_id, previous_value, new_value, reason, occurred_at, prev_hash, hash
       FROM audit_entries ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY seq DESC LIMIT 200`
    )
    .all(params) as any[];
  const entities = d.prepare("SELECT DISTINCT entity FROM audit_entries ORDER BY entity").all() as { entity: string }[];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="h-display text-2xl">Append-Only Audit Trail</h1>
        <StatusPill tone={chain.ok ? "ok" : "warn"}>
          {chain.ok ? `Hash chain verified — ${chain.checked} entries intact` : `CHAIN BROKEN at seq ${chain.firstBrokenSeq}`}
        </StatusPill>
      </div>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        Every entry commits to the hash of the previous entry (SHA-256). Database triggers reject
        UPDATE and DELETE on this table, so records cannot be edited, removed or reordered through
        any interface. Integrity is re-verified end-to-end on each page load. This is an
        append-only, hash-chained administrative audit trail — not an on-chain record.
      </p>

      <form method="get" className="card mt-5 flex flex-wrap gap-3 p-4">
        <select name="entity" defaultValue={searchParams.entity ?? ""} className="field max-w-56" aria-label="Entity filter">
          <option value="">All entities</option>
          {entities.map((e) => (
            <option key={e.entity} value={e.entity}>{e.entity}</option>
          ))}
        </select>
        <input name="q" defaultValue={searchParams.q} placeholder="Search action, actor or reason" className="field max-w-72" aria-label="Search" />
        <button type="submit" className="btn-primary !py-2 text-xs">Filter</button>
        <a href="/admin/audit" className="btn-ghost !py-2 text-xs">Reset</a>
      </form>

      <div className="table-scroll mt-5">
        <table className="data-table">
          <thead>
            <tr><th>Seq</th><th>Actor</th><th>Action</th><th>Entity / Record</th><th>Change</th><th>Reason</th><th>Time (UTC)</th><th>Hash</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.seq}>
                <td className="font-mono text-xs">{r.seq}</td>
                <td className="font-mono text-xs">{r.actor}</td>
                <td className="font-mono text-xs text-ink">{r.action}</td>
                <td className="font-mono text-[10px]">{r.entity}{r.record_id ? <><br />{r.record_id.slice(0, 8)}…</> : null}</td>
                <td className="max-w-56 font-mono text-[10px] text-muted">
                  {r.previous_value ? <>− {r.previous_value}<br /></> : null}
                  {r.new_value ? <>+ {r.new_value}</> : null}
                </td>
                <td className="max-w-56 text-xs">{r.reason ?? "—"}</td>
                <td className="font-mono text-[10px]">{r.occurred_at}</td>
                <td className="font-mono text-[10px] text-muted" title={`prev: ${r.prev_hash}`}>{r.hash.slice(0, 12)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
