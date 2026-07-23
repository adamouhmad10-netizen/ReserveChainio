import { PageHeader, SectionHeading, Card, KV, CtaLink, StatusPill } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";

export const metadata = {
  title: "Project Overview",
  description:
    "ReserveChain is developing institutional infrastructure for tokenizing verified real-world industrial assets, beginning with ultra-high-purity copper powder and high-purity nickel wire.",
};

export default function ProjectOverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Project"
        title="Project Overview"
        lead="ReserveChain is an infrastructure project — not a speculative token. The objective is a controlled, auditable connection between documented industrial metals and compliance-gated digital ownership records."
        status="Prelaunch"
        tone="warn"
      />
      <div className="shell space-y-12 py-10">
        <Disclosure compact />
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <SectionHeading eyebrow="What Exists Today" title="Current State" />
            <ul className="space-y-2.5 text-sm text-ink-2">
              {[
                "Prelaunch information platform with a functional waitlist",
                "Industrial Metals Registry and Digital Asset Passport infrastructure (illustrative records)",
                "Two owner-supplied IGAS research Certificates of Analysis registered as reference documents",
                "Configurable ERC-20 contract architecture with automated tests (no deployment)",
                "Administrative portal foundation with publication workflow and an append-only, hash-chained audit trail",
              ].map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />
                  {i}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <SectionHeading eyebrow="What Remains Pending" title="Subject to Final Approval" />
            <ul className="space-y-2.5 text-sm text-ink-2">
              {[
                "Swiss corporate, issuer and asset-holding structure",
                "Token legal classification, terms and holder rights",
                "Ownership, custody, warehouse and insurance documentation",
                "Independent valuations and reserve confirmations",
                "Tokenomics, supply, pricing and redemption rules",
                "Permitted and restricted jurisdiction rules",
              ].map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
                  {i}
                </li>
              ))}
            </ul>
          </Card>
        </section>
        <section>
          <SectionHeading eyebrow="Positioning" title="Institutional Infrastructure, Stated Plainly" />
          <Card>
            <dl>
              <KV label="Category" value="Real-world asset (RWA) infrastructure — industrial metals" />
              <KV label="Initial programs" value="Ultra-High-Purity Copper Powder (proposed 99.9999%) · High-Purity Nickel Wire (proposed 99.9807%)" />
              <KV label="Primary chain (planned)" value="Ethereum — ERC-20, testnet first" />
              <KV label="Corporate stage" value={<StatusPill tone="warn">Swiss structure in development</StatusPill>} />
              <KV label="Offering status" value={<StatusPill tone="inactive">No tokens offered or sold</StatusPill>} />
              <KV label="EU/EEA" value="Not an intended market under current project instructions" />
            </dl>
          </Card>
        </section>
        <div className="flex flex-wrap gap-3">
          <CtaLink href="/how-it-works">Explore the Proposed Model</CtaLink>
          <CtaLink href="/corporate-development-status" variant="secondary">Corporate Development Status</CtaLink>
        </div>
      </div>
    </>
  );
}
