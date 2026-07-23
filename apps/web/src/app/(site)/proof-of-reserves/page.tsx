import { PageHeader, SectionHeading, Card, KV, StatusPill, CtaLink } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";

export const metadata = {
  title: "Proposed Proof-of-Reserves Framework — Planned / Inactive",
  description:
    "Proof-of-Reserves module prepared. Public reserve reporting is inactive pending approved asset, custody, token-supply and attestation data.",
};

export default function ProofOfReservesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Proposed Proof-of-Reserves Framework"
        lead="“Proof-of-Reserves module prepared. Public reserve reporting is inactive pending approved asset, custody, token-supply and attestation data.”"
        status="Planned / Inactive"
        tone="warn"
      />
      <div className="shell space-y-12 py-10">
        <Disclosure compact />
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Inventory Reconciliation", "Custodian inventory reconciled by identifiable physical unit — container by container, coil by coil."],
            ["Supply Reconciliation", "Issued, circulating, treasury, locked, burned and redeemed supply reconciled against on-chain data."],
            ["Documents & Attestations", "Reserve reports, independent attestations and supporting documents with publication approval workflow."],
            ["Historical Reports", "Complete archive of reserve reports and update history — nothing is silently replaced."],
            ["Discrepancy Management", "The system detects and reports inconsistencies. It never silently adjusts balances to make reconciliation pass."],
            ["Alerts", "Stale-valuation, expiring-document and missing-document alerts with an exception report."],
          ].map(([title, body]) => (
            <Card key={title}>
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
            </Card>
          ))}
        </section>
        <section>
          <SectionHeading
            eyebrow="Why Nothing Is Displayed"
            title="No Coverage Data Is Shown — By Design"
            lead="Displaying a coverage ratio without approved underlying data would be fabrication. The dashboard activates only when approved reserve, custody, supply and attestation data exist."
          />
          <Card className="max-w-2xl">
            <dl>
              {["Issued token supply", "Circulating supply", "Approved reserve value", "Coverage ratio", "Valuation date", "Attestation date", "Custody summary", "Insurance summary"].map((m) => (
                <KV key={m} label={m} value={<StatusPill tone="inactive">No approved data</StatusPill>} />
              ))}
            </dl>
          </Card>
        </section>
        <div className="flex flex-wrap gap-3">
          <CtaLink href="/tokenization" variant="secondary">Tokenization Architecture</CtaLink>
          <CtaLink href="/custody" variant="ghost">← Custody Framework</CtaLink>
        </div>
      </div>
    </>
  );
}
