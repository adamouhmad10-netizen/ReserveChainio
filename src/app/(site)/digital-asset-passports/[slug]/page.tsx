import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, SectionHeading, StatusPill, Card, KV, CtaLink } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";
import { getPassportBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `Digital Asset Passport — ${params.slug === "illustrative-copper" ? "Illustrative Copper Batch (TEMPLATE-CU-BATCH)" : "Illustrative Nickel Coil (TEMPLATE-NI-COIL)"}`,
  };
}

const STATUS_ROWS: [string, keyof PassportStatuses, string][] = [
  ["Asset", "assetStatus", "Illustrative Template"],
  ["Laboratory", "verification_status", "Pending Publication Approval"],
  ["Ownership", "ownership_status", "Pending"],
  ["Valuation", "valuation_status", "Pending"],
  ["Custody", "custody_status", "Pending"],
  ["Insurance", "insurance_status", "Pending"],
  ["Reserve", "reserve_status", "Inactive"],
  ["Tokenization", "tokenization_status", "Not Issued"],
  ["Redemption", "redemption_status", "Inactive"],
  ["Availability", "availability", "Not Offered for Sale"],
];

interface PassportStatuses {
  assetStatus: string; verification_status: string; ownership_status: string;
  valuation_status: string; custody_status: string; insurance_status: string;
  reserve_status: string; tokenization_status: string; redemption_status: string;
  availability: string;
}

export default function PassportDetailPage({ params }: { params: { slug: string } }) {
  const data = getPassportBySlug(params.slug);
  if (!data) notFound();
  const { passport, events, labReport, specs, units } = data;
  const copper = passport.metal === "copper";

  return (
    <>
      <PageHeader
        eyebrow={`Digital Asset Passport · ${passport.passport_code} · v${passport.version}`}
        title={passport.asset_title}
        lead={passport.asset_description ?? undefined}
        status="Illustrative Template"
        tone={copper ? "copper" : "nickel"}
      />

      <div className="shell space-y-10 py-10 print:space-y-6">
        <div className="rounded-lg border border-warn/30 bg-warn/5 p-5">
          <p className="text-sm leading-relaxed text-ink-2">
            “This presentation demonstrates the future format of a ReserveChain industrial-metal
            asset record. No verified material, ownership document, valuation, custody arrangement,
            reserve claim or token is represented by this illustrative template.”
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Summary + status matrix */}
          <div className="space-y-8">
            <section>
              <SectionHeading eyebrow="Summary" title="Record Summary" />
              <Card>
                <dl>
                  <KV label="Passport code" value={passport.passport_code} mono />
                  <KV label="Physical asset identifier" value={passport.asset_identifier} mono />
                  <KV label="Asset program" value={`${passport.program_name} (${passport.program_code})`} />
                  <KV label="Proposed program specification" value={passport.proposed_purity} />
                  <KV label="Record type" value={passport.asset_type === "batch" ? "Batch (container-level control)" : "Coil lot (coil-level control)"} />
                  <KV label="Publication state" value={<StatusPill tone="ok">published (illustrative)</StatusPill>} />
                  <KV label="Visibility" value="Public" />
                  <KV label="Demo flag" value={<code className="font-mono text-xs text-warn">is_demo = true</code>} />
                  <KV label="Permalink" value={<span className="break-all font-mono text-xs">/digital-asset-passports/{passport.slug}</span>} />
                </dl>
              </Card>
            </section>

            <section>
              <SectionHeading eyebrow="Status Matrix" title="Lifecycle Status" />
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr><th>Dimension</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {STATUS_ROWS.map(([label, , display]) => (
                      <tr key={label}>
                        <td className="font-medium text-ink">{label}</td>
                        <td>
                          <StatusPill tone={display.includes("Pending") ? "pending" : display.includes("Template") ? "development" : "inactive"}>
                            {display}
                          </StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <SectionHeading
                eyebrow="Specifications"
                title="Technical Specifications"
                lead="Values attributed to the owner-supplied Certificate of Analysis restate document content; all other values remain Pending."
              />
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr><th className="w-[32%]">Field</th><th>Value</th></tr>
                  </thead>
                  <tbody>
                    {specs.filter((s) => ["identity", "chemistry", "physical"].includes(s.spec_group)).map((s) => (
                      <tr key={s.label}>
                        <td className="font-medium text-ink">{s.label}</td>
                        <td>{s.value === "Pending" ? <StatusPill tone="pending">Pending</StatusPill> : s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Documents / provenance / events */}
          <div className="space-y-8">
            <section>
              <SectionHeading eyebrow="Documents" title="Registered Documents" />
              {labReport ? (
                <Card className="overflow-hidden !p-0">
                  {labReport.file_ref ? (
                    <div className="max-h-64 overflow-hidden bg-white">
                      <Image
                        src={labReport.file_ref}
                        alt={labReport.doc_title ?? "Laboratory certificate preview"}
                        width={720}
                        height={1000}
                        className="w-full object-cover object-top"
                      />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <p className="text-sm font-medium text-ink">{labReport.doc_title}</p>
                    <dl className="mt-3">
                      <KV label="Report number" value={labReport.report_number} mono />
                      <KV label="Report date" value={labReport.report_date} mono />
                      <KV label="Methodology" value={labReport.methodology} mono />
                      <KV label="Certificate-stated purity" value={labReport.stated_purity} mono />
                      <KV label="Publication status" value={<StatusPill tone="pending">pending approval</StatusPill>} />
                    </dl>
                    <p className="mt-3 text-[11px] leading-relaxed text-muted">{labReport.doc_notes}</p>
                  </div>
                </Card>
              ) : null}
            </section>

            <section>
              <SectionHeading eyebrow="Units" title={copper ? "Containers" : "Coils"} />
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr><th>Unit</th><th>Status</th><th>Redemption</th></tr>
                  </thead>
                  <tbody>
                    {units.map((u) => (
                      <tr key={u.unit_code}>
                        <td className="font-mono text-xs text-ink">{u.unit_code}</td>
                        <td><StatusPill tone="pending">{u.status}</StatusPill></td>
                        <td><StatusPill tone="inactive">{u.redemption_status}</StatusPill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <SectionHeading eyebrow="Provenance & Event History" title="Record Timeline" />
              <ol className="relative space-y-4 border-l border-line pl-5">
                {events.map((e) => (
                  <li key={e.label} className="relative">
                    <span
                      aria-hidden
                      className={`absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
                        e.status === "recorded" ? "border-ok bg-ok/30" : e.status === "pending" ? "border-warn bg-warn/20" : "border-line bg-surface2"
                      }`}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink">{e.label}</p>
                      <StatusPill tone={e.status === "recorded" ? "ok" : e.status === "pending" ? "pending" : "inactive"}>{e.status}</StatusPill>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink-2">{e.detail}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="print:hidden">
              <SectionHeading eyebrow="Record Tools" title="Version & Access" />
              <Card>
                <dl>
                  <KV label="Version history" value="v1 — initial illustrative template" mono />
                  <KV label="Print view" value={<span className="text-xs text-ink-2">Use the browser print dialog — the record renders with a print stylesheet.</span>} />
                  <KV label="Deep link" value={<span className="break-all font-mono text-xs">reservechain.io/digital-asset-passports/{passport.slug}</span>} />
                  <KV label="QR issuance" value={<StatusPill tone="development">Prepared — issued with real records</StatusPill>} />
                </dl>
              </Card>
            </section>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 print:hidden">
          <CtaLink href={`/industrial-metal-assets/${passport.program_slug}`} variant="secondary">
            View the {copper ? "Copper Powder" : "Nickel Wire"} Program
          </CtaLink>
          <CtaLink href="/asset-registry" variant="ghost">Registry view →</CtaLink>
          <CtaLink href="/digital-asset-passports" variant="ghost">← All passports</CtaLink>
        </div>

        <Disclosure compact />
      </div>
    </>
  );
}
