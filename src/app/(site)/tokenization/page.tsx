import { PageHeader, SectionHeading, Card, KV, StatusPill, CtaLink } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";

export const metadata = {
  title: "Proposed Tokenization Framework — ERC-20 on Ethereum",
  description:
    "Configurable ERC-20 token-series architecture on Ethereum: controlled minting and burning, multisig-compatible governance, testnet-first, external audit before Mainnet. No token contract is published.",
};

export default function TokenizationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Proposed Tokenization Framework"
        lead="“Contract architecture in development. No token contract is currently published through this website.”"
        status="Architecture In Development"
      />
      <div className="shell space-y-12 py-10">
        <Disclosure compact />

        <section>
          <SectionHeading
            eyebrow="Architecture"
            title="Configurable ERC-20 Token-Series Design"
            lead="The primary token architecture targets Ethereum with ERC-20 token series per approved asset program. All parameters remain configurable and unpublished until approved — nothing is hard-coded."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Ethereum · ERC-20", "Ethereum is the primary intended chain. No BSC/BEP-20 primary implementation. Secondary chains require separate written approval."],
              ["Configurable Program", "Name, symbol, decimals, capped supply and allocations are constructor-configured per approved program — never fixed in advance of authorization."],
              ["Controlled Minting", "Minting is role-gated below an immutable supply cap, designed for issuer-controlled multisig administration."],
              ["Controlled Burning", "Holder burn plus a dedicated, role-gated redemption burn that records a redemption reference on-chain in the event log."],
              ["Multisig Governance", "All privileged roles are designed to be held by issuer-controlled multisig wallets, with a transparent privileged-role matrix."],
              ["Pause Controls", "An emergency pause exists in the architecture and is disclosed; its use is governed by the approved operational procedures."],
              ["Treasury Controls", "Treasury allocation and segregation of treasury, liquidity and operational wallets are part of the wallet architecture."],
              ["Testnet First", "Deployment scripts target test networks. Ethereum Mainnet deployment requires written issuer authorization."],
              ["External Audit Requirement", "An independent smart-contract audit is required before any production deployment."],
            ].map(([title, body]) => (
              <Card key={title}>
                <h3 className="font-mono text-sm font-semibold text-gold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Excluded By Design"
            title="What the Contract Suite Deliberately Excludes"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Transaction taxes or hidden fees",
              "Honeypot mechanics",
              "Covert blacklists",
              "Hidden minting paths",
              "Hidden sell or transfer restrictions",
              "Developer backdoors",
              "Arbitrary seizure functions",
              "Undocumented privileged roles",
              "Undisclosed proxy upgrades",
            ].map((i) => (
              <p key={i} className="rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink-2">
                <span aria-hidden className="mr-2 text-crit">✕</span>
                {i}
              </p>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Status" title="Current Token Program Status" />
          <Card className="max-w-2xl">
            <dl>
              <KV label="Contract source" value={<StatusPill tone="ok">Drafted with automated tests</StatusPill>} />
              <KV label="Testnet deployment" value={<StatusPill tone="development">Configuration prepared</StatusPill>} />
              <KV label="Independent audit" value={<StatusPill tone="pending">Pending third party</StatusPill>} />
              <KV label="Token name / symbol / supply / price" value={<StatusPill tone="pending">Pending owner authorization</StatusPill>} />
              <KV label="Mainnet deployment" value={<StatusPill tone="inactive">Requires written authorization</StatusPill>} />
              <KV label="Published contract address" value={<StatusPill tone="inactive">None exists</StatusPill>} />
            </dl>
          </Card>
        </section>

        <div className="flex flex-wrap gap-3">
          <CtaLink href="/redemption" variant="secondary">Proposed Redemption Framework</CtaLink>
          <CtaLink href="/governance" variant="ghost">Governance →</CtaLink>
        </div>
      </div>
    </>
  );
}
