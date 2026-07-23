import Image from "next/image";
import { PageHeader, SectionHeading, Card, CtaLink } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";

export const metadata = {
  title: "Proposed Verification Framework",
  description:
    "Laboratory evidence, assays, inspections, ownership documentation, publication approval, version control and data provenance in the proposed ReserveChain verification framework.",
};

export default function VerificationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Proposed Verification Framework"
        lead="This page describes the proposed framework. It remains subject to final legal, contractual, technical and operational confirmation."
        status="Proposed Framework"
      />
      <div className="shell space-y-12 py-10">
        <Disclosure compact />
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Laboratory Evidence", "Independent laboratory testing and assay of eligible material, with certificates registered against specific lots, batches, containers or coils."],
            ["Inspections", "Physical inspection and sampling records connected to identifiable units, including sampling provenance."],
            ["Ownership Documentation", "Title, acquisition and chain-of-title documentation reviewed before any ownership statement is published."],
            ["Publication Approval", "No verification claim is published without approved supporting evidence. Draft and under-review records are never publicly accessible."],
            ["Version Control", "Every record and document is versioned; replacements never silently overwrite history."],
            ["Data Provenance", "Every published value carries a data-source reference. Redacted information in source documents is preserved, not reconstructed."],
          ].map(([title, body]) => (
            <Card key={title}>
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
            </Card>
          ))}
        </section>
        <section>
          <SectionHeading
            eyebrow="Current Evidence"
            title="Owner-Supplied Reference Documents"
            lead="Two IGAS research Certificates of Analysis have been supplied by the project owner and registered as reference documents. Publication and current verification status remain subject to approval."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { src: "/lab/igas-copper-0004512.webp", label: "CoA No. 0004512 — Ultrafine Copper Powder (ICP/OES, 04.07.2022)" },
              { src: "/lab/igas-nickel-0004368.webp", label: "CoA No. 0004368 — Nickel Wire 0.025 mm (ICP/MS · ICP/OES, 19.10.2021)" },
            ].map((doc) => (
              <figure key={doc.src} className="card overflow-hidden">
                <div className="bg-white p-2">
                  <Image src={doc.src} alt={doc.label} width={900} height={1260} className="mx-auto h-auto max-h-[460px] w-full max-w-[360px] object-contain" />
                </div>
                <figcaption className="border-t border-line p-4 text-xs leading-relaxed text-muted">
                  {doc.label}. Owner-supplied reference document; redacted areas preserved.
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <CtaLink href="/custody" variant="secondary">Proposed Custody Framework</CtaLink>
          <CtaLink href="/asset-registry" variant="ghost">Registry view →</CtaLink>
        </div>
      </div>
    </>
  );
}
