import { PageHeader, SectionHeading, Card, CtaLink, StatusPill } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";

export const metadata = {
  title: "Proposed Physical Redemption Framework — Proposed / Inactive",
  description:
    "The proposed container-level and coil-level physical redemption lifecycle. Inactive pending final legal terms, custody arrangements, token issuance and written authorization.",
};

const STEPS: [string, string][] = [
  ["Eligibility", "Wallet ownership verification, token balance verification and threshold checks."],
  ["Compliance Recheck", "KYC/AML, sanctions and jurisdiction re-verification at the time of request."],
  ["Request", "Redemption calculator, unit constraints, cost calculation and terms acceptance with electronic signature workflow."],
  ["Review", "Administrative review with maker-checker authorization for approval or rejection."],
  ["Token Burn", "Token lock followed by a recorded redemption burn with an on-chain reference."],
  ["Container / Coil Selection", "Container-by-container (copper) or coil-by-coil (nickel) selection under approved substitution rules."],
  ["Custody Release", "Custodian release instruction under the final custody agreement."],
  ["Logistics / Customs", "Handling, transport, customs, export and import documentation workflow."],
  ["Delivery", "Delivery, collection or shipment tracking with failed-delivery and dispute handling."],
  ["Registry Update", "Registry, passport and chain-of-title records updated; title-transfer document area."],
  ["Reserve Update", "Reserve, supply and accounting reconciliation with complete audit history."],
];

export default function RedemptionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Proposed Physical Redemption Framework"
        lead="Proposed / inactive. The legal redemption rights, minimum amounts, delivery conditions, fees, taxes and custody rules will be supplied or approved by the project owners — the platform keeps them configurable rather than hard-coding assumptions."
        status="Proposed / Inactive"
        tone="warn"
      />
      <div className="shell space-y-12 py-10">
        <Disclosure compact />
        <section>
          <SectionHeading eyebrow="Lifecycle" title="The Proposed Redemption Lifecycle" />
          <ol className="grid gap-3 md:grid-cols-2">
            {STEPS.map(([title, body], i) => (
              <li key={title}>
                <Card className="h-full !p-5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-base font-semibold">{title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-lg border border-line bg-carbon p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone="inactive">Module Disabled</StatusPill>
            <p className="text-sm text-ink-2">
              Activation requires: final legal terms · confirmed custody · token issuance ·
              compliance infrastructure · written issuer authorization.
            </p>
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <CtaLink href="/proof-of-reserves" variant="secondary">Reserve Framework</CtaLink>
          <CtaLink href="/tokenization" variant="ghost">← Tokenization</CtaLink>
        </div>
      </div>
    </>
  );
}
