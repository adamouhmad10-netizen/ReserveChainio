export const dynamic = "force-dynamic";

import Link from "next/link";
import { PageHeader, SectionHeading, StatusPill } from "@/components/ui";
import { getDb } from "@/lib/db";

export const metadata = {
  title: "Industrial Metals Registry",
  description:
    "Scalable multi-asset registry connecting asset programs, physical assets, lots, containers and coils with documents, custody, reserve and token records. Illustrative records only.",
};

export default function AssetRegistryPage() {
  const d = getDb();
  const rows = d
    .prepare(
      `SELECT a.identifier, a.slug, a.title, a.asset_type, a.verification_status,
              a.custody_status, a.reserve_status, a.tokenization_status, a.is_demo, a.version,
              g.code AS program_code, g.metal,
              (SELECT COUNT(*) FROM units u WHERE u.asset_id = a.id) AS unit_count,
              (SELECT COUNT(*) FROM lots l WHERE l.asset_id = a.id) AS lot_count,
              p.slug AS passport_slug
       FROM physical_assets a
       JOIN asset_programs g ON g.id = a.program_id
       LEFT JOIN passport_records p ON p.asset_id = a.id
       WHERE a.publication_status = 'published'
       ORDER BY g.code`
    )
    .all() as any[];

  const hierarchy = [
    "Asset Program", "Physical Asset", "Lot / Batch", "Container / Coil / Unit",
    "Documents", "Custody / Ownership / Valuation", "Reserve", "Token Program", "Redemption",
  ];

  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Industrial Metals Registry"
        lead="A scalable multi-asset registry connecting programs, physical assets, lots, units, documents, custody, reserve and token records with versioning, publication control and audit history. All records shown are illustrative templates."
        status="Illustrative Records Only"
        tone="warn"
      />
      <div className="shell space-y-12 py-10">
        <section>
          <SectionHeading eyebrow="Data Model" title="Registry Hierarchy" />
          <div className="table-scroll bg-surface">
            <ol className="flex min-w-max items-center gap-0 p-4">
              {hierarchy.map((h, i) => (
                <li key={h} className="flex items-center">
                  <span className="rounded-md border border-line bg-carbon px-3.5 py-2 text-xs font-medium text-ink-2">
                    {h}
                  </span>
                  {i < hierarchy.length - 1 ? <span aria-hidden className="mx-1.5 text-muted">↓</span> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Registry"
            title="Published Registry Records"
            lead="Every record carries a unique identifier, slug, lifecycle statuses, version and is_demo flag. Records in draft or under review are never publicly visible."
          />
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Identifier</th>
                  <th>Program</th>
                  <th>Record</th>
                  <th>Type</th>
                  <th>Lots</th>
                  <th>Units</th>
                  <th>Verification</th>
                  <th>Custody</th>
                  <th>Reserve</th>
                  <th>Tokenization</th>
                  <th>Passport</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.identifier}>
                    <td className="font-mono text-xs text-ink">
                      {r.identifier}
                      {r.is_demo ? <span className="ml-2 rounded bg-warn/15 px-1.5 py-0.5 font-mono text-[9px] uppercase text-warn">demo</span> : null}
                    </td>
                    <td className="font-mono text-xs">{r.program_code}</td>
                    <td>{r.title}</td>
                    <td className="capitalize">{r.asset_type.replace("_", " ")}</td>
                    <td className="font-mono text-xs">{r.lot_count}</td>
                    <td className="font-mono text-xs">{r.unit_count}</td>
                    <td><StatusPill tone="pending">{r.verification_status}</StatusPill></td>
                    <td><StatusPill tone="pending">{r.custody_status}</StatusPill></td>
                    <td><StatusPill tone="inactive">{r.reserve_status}</StatusPill></td>
                    <td><StatusPill tone="inactive">{r.tokenization_status.replace("_", " ")}</StatusPill></td>
                    <td>
                      {r.passport_slug ? (
                        <Link className="text-sm font-medium text-gold" href={`/digital-asset-passports/${r.passport_slug}`}>
                          Open →
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            No fictional quantities, valuations, custodians or availability are displayed. Real
            records require owner-supplied documentation and publication approval through the
            administrative workflow (Draft → Under Review → Approved → Published).
          </p>
        </section>
      </div>
    </>
  );
}
