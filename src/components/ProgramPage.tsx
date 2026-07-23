import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclosure } from "@/components/Disclosure";
import { PageHeader, SectionHeading, StatusPill, Card, KV, CtaLink } from "@/components/ui";
import { getProgramBySlug, getAssetsForProgram, getSpecs, getUnits } from "@/lib/queries";

// Shared institutional program page for the Copper Powder and Nickel Wire
// programs. All data is read from the registry database; unknown values are
// stored — and rendered — as "Pending", never fabricated.

const GROUP_LABELS: Record<string, string> = {
  identity: "Program Identity & Purity",
  chemistry: "Chemical Composition & Testing",
  physical: "Physical Characteristics",
  packaging: "Packaging, Storage & Handling",
  provenance: "Provenance, Ownership & Lifecycle",
};

export function ProgramPage({
  slug,
  accent,
  labImage,
  labCaption,
}: {
  slug: string;
  accent: "copper" | "nickel";
  labImage: string;
  labCaption: string;
}) {
  const program = getProgramBySlug(slug);
  if (!program) notFound();
  const assets = getAssetsForProgram(program.id);
  const asset = assets[0];
  const specs = asset ? getSpecs(asset.id) : [];
  const units = asset ? getUnits(asset.id) : [];
  const groups = [...new Set(specs.map((s) => s.spec_group))];

  const accentText = accent === "copper" ? "text-copper-light" : "text-nickel";
  const purity = program.proposed_purity?.split(" ")[0] ?? "Pending";

  return (
    <>
      <PageHeader
        eyebrow={`Asset Program · ${program.code}`}
        title={program.name}
        lead={program.summary ?? undefined}
        status="Program In Development"
        tone="development"
      />

      <div className="shell py-8">
        <Disclosure />
      </div>

      {/* Key figures strip */}
      <section className="border-y border-line bg-carbon">
        <div className="shell grid grid-cols-2 divide-x divide-line lg:grid-cols-4">
          {[
            ["Proposed specification", purity, "Subject to final approval"],
            ["Material form", program.material_form === "powder" ? "Ultrafine powder" : "Fine wire", "Program definition"],
            ["Laboratory reference", accent === "copper" ? "CoA 0004512" : "CoA 0004368", "Owner-supplied, IGAS research"],
            ["Reserve status", "Inactive", "No reserve claim is made"],
          ].map(([label, value, note]) => (
            <div key={label} className="px-5 py-6">
              <p className="eyebrow">{label}</p>
              <p className={`mt-2 font-mono text-xl font-semibold ${accentText}`}>{value}</p>
              <p className="mt-1 text-[11px] text-muted">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specification tables */}
      <section className="shell py-14">
        <SectionHeading
          eyebrow="Technical Record"
          title="Program Data Capability"
          lead="The registry captures the complete institutional data model for this material. Values sourced from the owner-supplied Certificate of Analysis are attributed; all other values remain Pending until documentary verification and publication approval."
        />
        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g}>
              <h3 className="mb-3 font-display text-lg font-semibold">{GROUP_LABELS[g] ?? g}</h3>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="w-[28%]">Field</th>
                      <th>Value</th>
                      <th className="w-[30%]">Source / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specs.filter((s) => s.spec_group === g).map((s) => (
                      <tr key={s.label}>
                        <td className="font-medium text-ink">{s.label}</td>
                        <td>
                          {s.value === "Pending" ? (
                            <StatusPill tone="pending">Pending</StatusPill>
                          ) : (
                            <span className={s.value.length < 40 ? "font-mono text-[13px]" : ""}>{s.value}</span>
                          )}
                        </td>
                        <td className="text-xs text-muted">{s.source ?? "Awaiting owner-supplied documentation"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lab document + unit control */}
      <section className="border-t border-line bg-carbon/50">
        {/* min-w-0 lets the grid tracks shrink below the images' intrinsic width */}
        <div className="shell grid gap-10 py-14 lg:grid-cols-2 [&>*]:min-w-0">
          <div>
            <SectionHeading
              eyebrow="Laboratory Evidence"
              title="Owner-Supplied Certificate of Analysis"
              lead="Controlled preview of the source document. Redacted areas are preserved and are not reconstructed."
            />
            <figure className="card overflow-hidden">
              <div className="bg-white p-2">
                <Image
                  src={labImage}
                  alt={labCaption}
                  width={1100}
                  height={1540}
                  className="mx-auto h-auto max-h-[560px] w-full max-w-[400px] rounded-sm object-contain"
                />
              </div>
              <figcaption className="border-t border-line p-4 text-xs leading-relaxed text-muted">
                {labCaption}. Owner-supplied reference document. Publication and current
                verification status remain subject to approval.
              </figcaption>
            </figure>
          </div>
          <div>
            <SectionHeading
              eyebrow={program.material_form === "powder" ? "Container-Level Control" : "Coil-Level Control"}
              title={program.material_form === "powder" ? "Container-by-Container Identification" : "Coil-by-Coil Identification"}
              lead={`The registry supports ${program.material_form === "powder" ? "container" : "coil"}-level identification, inventory reconciliation and redemption controls where approved. Illustrative template units are shown; no real inventory is represented.`}
            />
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Unit ID</th>
                    <th>Type</th>
                    <th>Seal</th>
                    <th>Net Weight</th>
                    <th>Status</th>
                    <th>Redemption</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((u) => (
                    <tr key={u.unit_code}>
                      <td className="font-mono text-xs text-ink">{u.unit_code}</td>
                      <td className="capitalize">{u.unit_type}</td>
                      <td>{u.seal_number ?? <span className="text-muted">Pending</span>}</td>
                      <td>{u.net_weight ?? <span className="text-muted">Pending</span>}</td>
                      <td><StatusPill tone="pending">{u.status}</StatusPill></td>
                      <td><StatusPill tone="inactive">{u.redemption_status}</StatusPill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">
              All units carry <code className="font-mono">is_demo = true</code> and obvious template identifiers.
            </p>
            {asset ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <CtaLink href={`/digital-asset-passports/${asset.slug}`} variant="secondary">
                  Open the Illustrative Digital Asset Passport
                </CtaLink>
                <CtaLink href="/asset-registry" variant="ghost">Registry view →</CtaLink>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Status matrix */}
      <section className="shell py-14">
        <SectionHeading
          eyebrow="Lifecycle Status"
          title="Current Program Status Matrix"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {asset
            ? ([
                ["Verification", asset.verification_status, "Laboratory publication approval pending"],
                ["Ownership", asset.ownership_status, "Awaiting owner-supplied title documents"],
                ["Custody", asset.custody_status, "Custody structure in development"],
                ["Insurance", asset.insurance_status, "Subject to final insurance arrangements"],
                ["Valuation", asset.valuation_status, "Awaiting independent valuation"],
                ["Reserve", asset.reserve_status, "No reserve claim is made"],
                ["Tokenization", asset.tokenization_status.replace("_", " "), "No token contract published"],
                ["Redemption", asset.redemption_status, "Proposed framework only"],
              ] as [string, string, string][]).map(([label, status, note]) => (
                <Card key={label} className="!p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{label}</p>
                    <StatusPill tone={status.includes("pending") ? "pending" : "inactive"}>
                      {status.replace(/_/g, " ")}
                    </StatusPill>
                  </div>
                  <p className="mt-2 text-xs text-muted">{note}</p>
                </Card>
              ))
            : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink href="/waitlist">Join the Project Waitlist</CtaLink>
          <CtaLink href="/industrial-metal-assets" variant="ghost">← All Industrial Metal Programs</CtaLink>
        </div>
      </section>
    </>
  );
}
