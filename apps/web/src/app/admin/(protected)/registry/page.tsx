import Link from "next/link";
import { getDb } from "@/lib/db";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Asset Registry" };

export default function AdminRegistryPage() {
  const d = getDb();
  const programs = d.prepare("SELECT id, code, name, metal, proposed_purity, program_status, publication_status FROM asset_programs ORDER BY code").all() as any[];
  const assets = d
    .prepare(
      `SELECT a.id, a.identifier, a.slug, a.title, a.asset_type, a.publication_status, a.version, a.is_demo,
              a.verification_status, a.ownership_status, a.custody_status, a.insurance_status,
              a.valuation_status, a.reserve_status, a.tokenization_status, a.redemption_status,
              g.code AS program_code,
              (SELECT COUNT(*) FROM units u WHERE u.asset_id = a.id) AS units,
              (SELECT COUNT(*) FROM lots l WHERE l.asset_id = a.id) AS lots,
              (SELECT COUNT(*) FROM asset_specs s WHERE s.asset_id = a.id) AS specs
       FROM physical_assets a JOIN asset_programs g ON g.id = a.program_id ORDER BY a.identifier`
    )
    .all() as any[];

  return (
    <>
      <h1 className="h-display text-2xl">Asset Registry</h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        Registry records with lifecycle statuses, versioning and publication control. All current
        records are illustrative templates (<code className="font-mono text-warn">is_demo = true</code>).
        Real records require owner-supplied documentation and publication approval.
      </p>

      <h2 className="h-display mt-6 text-lg">Asset Programs</h2>
      <div className="table-scroll mt-3">
        <table className="data-table">
          <thead>
            <tr><th>Code</th><th>Program</th><th>Metal</th><th>Proposed specification</th><th>Program status</th><th>Publication</th></tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-xs text-ink">{p.code}</td>
                <td>{p.name}</td>
                <td className="capitalize">{p.metal}</td>
                <td className="font-mono text-xs">{p.proposed_purity}</td>
                <td><StatusPill tone="development">{p.program_status.replace(/_/g, " ")}</StatusPill></td>
                <td><StatusPill tone="ok">{p.publication_status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="h-display mt-8 text-lg">Physical Asset Records</h2>
      <div className="table-scroll mt-3">
        <table className="data-table">
          <thead>
            <tr>
              <th>Identifier</th><th>Program</th><th>Type</th><th>Lots</th><th>Units</th><th>Specs</th>
              <th>Verification</th><th>Ownership</th><th>Custody</th><th>Insurance</th>
              <th>Valuation</th><th>Reserve</th><th>Token</th><th>Redemption</th><th>v</th><th></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id}>
                <td className="font-mono text-xs text-ink">
                  {a.identifier}
                  {a.is_demo ? <span className="ml-1.5 rounded bg-warn/15 px-1 py-0.5 font-mono text-[9px] uppercase text-warn">demo</span> : null}
                </td>
                <td className="font-mono text-xs">{a.program_code}</td>
                <td className="capitalize">{a.asset_type.replace(/_/g, " ")}</td>
                <td className="font-mono text-xs">{a.lots}</td>
                <td className="font-mono text-xs">{a.units}</td>
                <td className="font-mono text-xs">{a.specs}</td>
                {[a.verification_status, a.ownership_status, a.custody_status, a.insurance_status, a.valuation_status].map((s, i) => (
                  <td key={i}><StatusPill tone="pending">{s}</StatusPill></td>
                ))}
                <td><StatusPill tone="inactive">{a.reserve_status}</StatusPill></td>
                <td><StatusPill tone="inactive">{a.tokenization_status.replace(/_/g, " ")}</StatusPill></td>
                <td><StatusPill tone="inactive">{a.redemption_status}</StatusPill></td>
                <td className="font-mono text-xs">{a.version}</td>
                <td>
                  <Link href={`/digital-asset-passports/${a.slug}`} className="text-xs font-medium text-gold">View public →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Editing registry values requires owner-approved source documentation. Status changes are
        recorded in the append-only audit trail with actor, reason and previous/new values.
      </p>
    </>
  );
}
