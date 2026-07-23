import { PageHeader, SectionHeading, Card, CtaLink } from "@/components/ui";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { Disclosure } from "@/components/Disclosure";

export const metadata = {
  title: "How the Proposed ReserveChain Model Will Work",
  description:
    "The seven proposed lifecycle stages connecting documented industrial-metal assets with controlled tokenization, reserve reconciliation and future physical redemption.",
};

const STAGES = [
  ["Asset Program Selection", "ReserveChain intends to evaluate industrial-metal programs according to approved purity, ownership, documentation, valuation, storage, marketability and redemption criteria."],
  ["Independent Material Verification", "Eligible material is intended to undergo appropriate laboratory testing, assay, inspection and documentary verification."],
  ["Ownership and Custody Documentation", "Approved material is intended to be recorded through ownership documentation, warehouse or custody records, inventory controls and appropriate insurance arrangements."],
  ["Digital Asset Passport", "Each approved lot, batch, container or coil is intended to receive a structured digital record connecting the physical material with its laboratory, ownership, valuation, custody and reserve documentation."],
  ["Tokenization", "ERC-20 tokens or asset-program token series may be issued under the final legal, commercial and technical structure."],
  ["Administration and Reserve Reconciliation", "The platform is intended to reconcile eligible physical inventory with issued and circulating tokens through controlled records and periodic verification."],
  ["Transfer and Redemption", "Any transferability, secondary-market participation or physical redemption will be governed exclusively by the final token terms, eligibility rules, operational requirements and legal documentation."],
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Proposed Model"
        title="How the Proposed ReserveChain Model Will Work"
        lead="A proposed framework — every stage remains subject to final legal, contractual, technical and operational confirmation."
        status="Proposed Framework"
      />
      <div className="shell space-y-12 py-10">
        <Disclosure compact />
        <WorkflowDiagram />
        <section>
          <SectionHeading eyebrow="Detail" title="The Seven Stages in Full" />
          <div className="grid gap-4 md:grid-cols-2">
            {STAGES.map(([title, body], i) => (
              <Card key={title}>
                <p className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
              </Card>
            ))}
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <CtaLink href="/industrial-metal-assets">View Industrial Metal Programs</CtaLink>
          <CtaLink href="/tokenization" variant="secondary">Tokenization Architecture</CtaLink>
        </div>
      </div>
    </>
  );
}
