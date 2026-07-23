import { PageHeader, SectionHeading, Card, KV, StatusPill, CtaLink } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";

export const metadata = {
  title: "Proposed Custody Framework",
  description:
    "The proposed ReserveChain custody and storage framework. Custody structure in development — no custodian, warehouse or insurance arrangement is confirmed.",
};

export default function CustodyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Proposed Custody Framework"
        lead="Custody structure in development. No custodian, warehouse facility or insurance arrangement is currently confirmed, and none is represented as existing."
        status="In Development"
        tone="pending"
      />
      <div className="shell space-y-12 py-10">
        <Disclosure compact />
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <SectionHeading eyebrow="Designed Capability" title="What the Platform Supports" />
            <ul className="space-y-2.5 text-sm text-ink-2">
              {[
                "Custody records per asset, unit and location",
                "Warehouse receipts with document versioning",
                "Inventory controls at container and coil level",
                "Chain-of-custody, movement and transfer history",
                "Insurance records with coverage documentation",
                "Custodian inventory reconciliation by identifiable physical unit",
              ].map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-info" />
                  {i}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <SectionHeading eyebrow="Current Status" title="Honest Status Matrix" />
            <dl>
              <KV label="Custodian" value={<StatusPill tone="pending">Pending selection</StatusPill>} />
              <KV label="Warehouse facilities" value={<StatusPill tone="pending">Pending</StatusPill>} />
              <KV label="Custody agreements" value={<StatusPill tone="pending">Pending</StatusPill>} />
              <KV label="Warehouse receipts" value={<StatusPill tone="pending">Pending</StatusPill>} />
              <KV label="Insurance provider" value={<StatusPill tone="pending">Pending</StatusPill>} />
              <KV label="Segregation arrangements" value={<StatusPill tone="pending">Subject to final custody arrangements</StatusPill>} />
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              These fields are configurable administrative records. They will be populated only
              from owner-supplied, approved documentation.
            </p>
          </Card>
        </section>
        <div className="flex flex-wrap gap-3">
          <CtaLink href="/proof-of-reserves" variant="secondary">Proof of Reserves Framework</CtaLink>
          <CtaLink href="/verification" variant="ghost">← Verification Framework</CtaLink>
        </div>
      </div>
    </>
  );
}
