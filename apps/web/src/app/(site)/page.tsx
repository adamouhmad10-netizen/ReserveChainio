import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@/components/Disclosure";
import { EvidenceStack } from "@/components/EvidenceStack";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { WaitlistForm } from "@/components/WaitlistForm";
import { SectionHeading, StatusPill, Card, CtaLink, KV } from "@/components/ui";

export const metadata = {
  title: "ReserveChain.io | Building the Infrastructure for Industrial-Metals Tokenization",
};

const FAQ_ITEMS: [string, string][] = [
  ["Are tokens currently being sold?", "No. No tokens are being offered or sold through this website."],
  ["Does waitlist registration reserve tokens?", "No. Registration of interest does not constitute an investment, purchase, reservation, allocation or entitlement."],
  ["Is Proof of Reserves currently active?", "No. The module is prepared but public reserve reporting is inactive pending approved asset, custody, token-supply and attestation data."],
  ["Is physical redemption active?", "No. The redemption framework is proposed and remains inactive pending final legal, custody and operational arrangements."],
  ["Is ReserveChain MiCA compliant?", "ReserveChain does not claim MiCA compliance. ReserveChain currently does not intend to offer tokens to residents or persons located in the EU/EEA."],
  ["What is a Digital Asset Passport?", "A structured digital record intended to connect a specific physical lot, batch, container or coil with its laboratory, ownership, valuation, custody and reserve documentation across its lifecycle."],
];

export default function HomePage() {
  return (
    <>
      {/* 01 — Prelaunch status */}
      <section className="border-b border-line bg-carbon">
        <div className="shell flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusPill tone="warn">Prelaunch / Information Platform</StatusPill>
            <p className="text-xs text-ink-2">Swiss corporate and issuance structure in development.</p>
          </div>
          <Link href="/corporate-development-status" className="link-quiet font-mono text-[11px] uppercase tracking-wider">
            Corporate Development Status →
          </Link>
        </div>
      </section>

      {/* 02 — Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,121,67,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(188,197,205,0.06),transparent_55%)]"
        />
        <div className="shell relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-rise">
            <p className="eyebrow mb-4">ReserveChain.io — The Infrastructure for Real-World Assets</p>
            <h1 className="h-display text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Building the Infrastructure for Tokenized{" "}
              <span className="bg-gradient-to-r from-copper-light via-gold to-nickel bg-clip-text text-transparent">
                Industrial Metals
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
              ReserveChain is developing an institutional platform intended to connect documented
              industrial-metal assets with digital tokenization, verification, custody and
              physical-redemption infrastructure. The corporate, legal, custody, asset-verification
              and technical arrangements are currently being finalized.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href="/how-it-works">Explore the Proposed Model</CtaLink>
              <CtaLink href="/industrial-metal-assets" variant="secondary">
                View Industrial Metal Programs
              </CtaLink>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <CtaLink href="/waitlist" variant="ghost">Join the Project Waitlist →</CtaLink>
              <CtaLink href="/enterprise-services" variant="ghost">Request Enterprise Information →</CtaLink>
            </div>
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted">
              Receive project-development updates and future eligibility information. Registration
              does not constitute an investment, token purchase or reservation of industrial metals.
            </p>
          </div>
          <div className="animate-rise [animation-delay:120ms]">
            <EvidenceStack />
          </div>
        </div>
      </section>

      {/* 03 — Mandatory disclosure */}
      <section className="shell py-10">
        <Disclosure />
      </section>

      {/* 04 — Infrastructure bar */}
      <section className="border-y border-line bg-carbon">
        <div className="shell grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {[
            ["Industrial Asset Verification Framework", "Designed"],
            ["Custody Structure", "In Development"],
            ["Reserve Reconciliation Architecture", "Prepared"],
            ["Planned ERC-20 Infrastructure", "Testnet-First"],
          ].map(([label, state]) => (
            <div key={label} className="flex flex-col gap-1 px-5 py-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{state}</span>
              <span className="text-sm font-medium text-ink">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — How ReserveChain works */}
      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Section 01 — Proposed Model"
          title="How the Proposed ReserveChain Model Will Work"
          lead="Seven controlled lifecycle stages connect physical material evidence with a compliance-controlled digital registry. Each stage distinguishes what is designed, what exists today and what remains subject to approval."
        />
        <WorkflowDiagram />
        <div className="mt-6">
          <CtaLink href="/how-it-works" variant="ghost">Full lifecycle documentation →</CtaLink>
        </div>
      </section>

      {/* 06 — Two metal programs */}
      <section className="border-t border-line bg-carbon/50">
        <div className="shell py-16 sm:py-20">
          <SectionHeading
            eyebrow="Section 02 — Asset Programs"
            title="Two Initial Industrial Metal Programs"
            lead="Both programs are in development. Physical quantities, valuations, token amounts and reserve coverage are not displayed because they remain subject to documentary verification and approval."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <Link
              href="/industrial-metal-assets/copper-powder"
              className="card group relative overflow-hidden p-7 transition hover:border-copper/50"
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-copper-dark via-copper to-copper-light" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow mb-2 !text-copper-light">Copper Program · CU-PWD-6N</p>
                  <h3 className="font-display text-2xl font-semibold">Ultra-High-Purity Copper Powder</h3>
                </div>
                <StatusPill tone="development">Program In Development</StatusPill>
              </div>
              <dl className="mt-6">
                <KV label="Proposed program specification" value={<span className="font-mono text-copper-light">99.9999% purity</span>} />
                <KV label="Laboratory reference" value="IGAS research CoA No. 0004512 (owner-supplied)" />
                <KV label="Testing methodology" value="ICP/OES" mono />
                <KV label="Ownership · Custody · Valuation" value={<StatusPill tone="pending">Pending</StatusPill>} />
              </dl>
              <p className="mt-5 text-sm font-medium text-copper-light transition group-hover:translate-x-1">
                View program →
              </p>
            </Link>

            <Link
              href="/industrial-metal-assets/nickel-wire"
              className="card group relative overflow-hidden p-7 transition hover:border-nickel/50"
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-nickel-dark via-nickel-mid to-nickel" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow mb-2 !text-nickel">Nickel Program · NI-WIRE-4N</p>
                  <h3 className="font-display text-2xl font-semibold">High-Purity Nickel Wire</h3>
                </div>
                <StatusPill tone="development">Program In Development</StatusPill>
              </div>
              <dl className="mt-6">
                <KV label="Proposed program specification" value={<span className="font-mono text-nickel">99.9807% purity</span>} />
                <KV label="Laboratory reference" value="IGAS research CoA No. 0004368 (owner-supplied)" />
                <KV label="Testing methodology" value="ICP/MS · ICP/OES" mono />
                <KV label="Ownership · Custody · Valuation" value={<StatusPill tone="pending">Pending</StatusPill>} />
              </dl>
              <p className="mt-5 text-sm font-medium text-nickel transition group-hover:translate-x-1">
                View program →
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 07 — Digital Asset Passport */}
      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Section 03 — Digital Asset Passport"
          title="A Structured Record for Every Physical Unit"
          lead="Each approved lot, batch, container or coil is intended to receive a Digital Asset Passport connecting the physical material with its laboratory, ownership, valuation, custody and reserve documentation. Two illustrative templates are live."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { code: "DAP-TEMPLATE-CU-BATCH", href: "/digital-asset-passports/illustrative-copper", title: "Illustrative Copper Powder Batch", tone: "copper" as const },
            { code: "DAP-TEMPLATE-NI-COIL", href: "/digital-asset-passports/illustrative-nickel", title: "Illustrative Nickel Wire Coil", tone: "nickel" as const },
          ].map((p) => (
            <Link key={p.code} href={p.href} className="card group p-6 transition hover:border-gold/40">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-muted">{p.code}</span>
                <StatusPill tone={p.tone}>Illustrative Template</StatusPill>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
              <dl className="mt-4">
                <KV label="Laboratory" value="Pending Publication Approval" />
                <KV label="Ownership · Valuation · Custody · Insurance" value="Pending" />
                <KV label="Reserve · Redemption" value="Inactive" />
                <KV label="Tokenization" value="Not Issued" />
                <KV label="Availability" value="Not Offered for Sale" />
              </dl>
              <p className="mt-4 text-sm font-medium text-gold transition group-hover:translate-x-1">Open passport →</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          “This presentation demonstrates the future format of a ReserveChain industrial-metal asset
          record. No verified material, ownership document, valuation, custody arrangement, reserve
          claim or token is represented by this illustrative template.”
        </p>
      </section>

      {/* 08 — Verification */}
      <section className="border-t border-line bg-carbon/50">
        <div className="shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Section 04 — Verification"
              title="Documentary Evidence, Not Marketing Claims"
              lead="The proposed verification framework covers laboratory evidence, assays, inspections, ownership documentation, publication approval, version control and data provenance. Nothing is published as verified without approved supporting evidence."
            />
            <ul className="space-y-3 text-sm text-ink-2">
              {[
                "Independent laboratory testing and assay workflows",
                "Certificate and report registration with version control",
                "Publication approval before any public claim",
                "Data-source references on every published value",
                "Respect for redacted information — nothing is reconstructed",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CtaLink href="/verification" variant="secondary">Verification Framework</CtaLink>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { src: "/lab/igas-copper-0004512.webp", alt: "IGAS research Certificate of Analysis No. 0004512 for Ultrafine Copper Powder — owner-supplied reference document with redacted customer details", label: "CoA No. 0004512 — Copper Powder" },
              { src: "/lab/igas-nickel-0004368.webp", alt: "IGAS research Certificate of Analysis No. 0004368 for Nickel Wire 0.025 mm — owner-supplied reference document with redacted customer details", label: "CoA No. 0004368 — Nickel Wire" },
            ].map((doc) => (
              <figure key={doc.src} className="card overflow-hidden">
                <div className="relative max-h-72 overflow-hidden bg-white">
                  <Image src={doc.src} alt={doc.alt} width={550} height={760} className="w-full object-cover object-top" />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy/90 to-transparent" />
                </div>
                <figcaption className="p-4">
                  <p className="font-mono text-xs text-ink-2">{doc.label}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    Owner-supplied reference document. Publication and current verification status
                    remain subject to approval.
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — Physical / digital model */}
      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Section 05 — Architecture"
          title="Physical Evidence, Digital Continuity"
          lead="Every digital record is anchored to a physical evidence layer. The registry never represents more than the documentation behind it."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <p className="eyebrow mb-4 !text-copper-light">Physical Side</p>
            <ul className="space-y-2.5 text-sm text-ink-2">
              {["Material", "Lot / batch", "Container / coil", "Laboratory document", "Ownership", "Custody", "Warehouse record", "Insurance"].map((i) => (
                <li key={i} className="flex items-center justify-between border-b border-line/60 pb-2.5 last:border-b-0 last:pb-0">
                  {i}
                  <StatusPill tone={i === "Material" || i.includes("Laboratory") ? "development" : "pending"}>
                    {i === "Material" ? "Programs defined" : i.includes("Laboratory") ? "Reference registered" : "Pending"}
                  </StatusPill>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <p className="eyebrow mb-4 !text-info">Digital Side</p>
            <ul className="space-y-2.5 text-sm text-ink-2">
              {[
                ["Asset Registry", "Implemented (illustrative)"],
                ["Digital Asset Passport", "Implemented (illustrative)"],
                ["Approved token program", "Not issued"],
                ["Supply records", "Architecture prepared"],
                ["Reserve reconciliation", "Architecture prepared"],
                ["Redemption lifecycle", "Inactive"],
                ["Audit history", "Implemented"],
              ].map(([i, s]) => (
                <li key={i} className="flex items-center justify-between border-b border-line/60 pb-2.5 last:border-b-0 last:pb-0">
                  {i}
                  <StatusPill tone={s.includes("Implemented") ? "ok" : s.includes("prepared") ? "development" : "inactive"}>{s}</StatusPill>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* 10 — Proof of Reserves */}
      <section className="border-t border-line bg-carbon/50">
        <div className="shell py-16 sm:py-20">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <SectionHeading
              eyebrow="Section 06 — Proof of Reserves"
              title="Reserve Reporting, Prepared and Deliberately Inactive"
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <Card>
              <StatusPill tone="inactive">Planned / Inactive</StatusPill>
              <p className="mt-4 text-sm leading-relaxed text-ink-2">
                “Proof-of-Reserves module prepared. Public reserve reporting is inactive pending
                approved asset, custody, token-supply and attestation data.”
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                The proposed framework covers inventory reconciliation by identifiable physical
                unit, supply reconciliation, supporting documents, independent attestations,
                historical reports and discrepancy management. The system is designed to detect and
                report inconsistencies — never to silently adjust balances.
              </p>
              <div className="mt-5">
                <CtaLink href="/proof-of-reserves" variant="secondary">Proposed Reserve Framework</CtaLink>
              </div>
            </Card>
            <Card className="bg-carbon">
              <p className="eyebrow mb-4">Coverage metrics — intentionally not displayed</p>
              <dl>
                {["Issued supply", "Circulating supply", "Reserve value", "Coverage ratio", "Attestation date"].map((m) => (
                  <KV key={m} label={m} value={<span className="font-mono text-muted">— no approved data</span>} />
                ))}
              </dl>
            </Card>
          </div>
        </div>
      </section>

      {/* 11 — ERC-20 architecture */}
      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Section 07 — Token Architecture"
          title="Planned ERC-20 Infrastructure on Ethereum"
          lead="Contract architecture in development. No token contract is currently published through this website."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Ethereum · ERC-20", "Primary chain per project architecture; no BSC/BEP-20 primary implementation."],
            ["Controlled Mint & Burn", "Role-gated supply changes including redemption burn; every action event-logged."],
            ["Multisig Governance", "Issuer-controlled multisig administration with a transparent privileged-role matrix."],
            ["Testnet First", "Automated tests, gas and coverage reporting, independent audit before any Mainnet deployment — which requires written authorization."],
          ].map(([title, body]) => (
            <Card key={title}>
              <h3 className="font-mono text-sm font-semibold text-gold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <CtaLink href="/tokenization" variant="ghost">Full tokenization architecture →</CtaLink>
        </div>
      </section>

      {/* 12 — Redemption */}
      <section className="border-t border-line bg-carbon/50">
        <div className="shell py-16 sm:py-20">
          <div className="flex flex-wrap items-center gap-3">
            <SectionHeading
              eyebrow="Section 08 — Physical Redemption"
              title="Proposed Redemption Lifecycle"
              lead="Proposed / inactive. The workflow below is a designed framework — activation requires final legal terms, custody arrangements, token issuance and written authorization."
            />
          </div>
          <div className="table-scroll bg-surface">
            <ol className="flex min-w-max items-stretch p-4">
              {["Eligibility", "Compliance Recheck", "Request", "Review", "Token Burn", "Unit Selection", "Custody Release", "Logistics / Customs", "Delivery", "Registry Update", "Reserve Update"].map((step, i, arr) => (
                <li key={step} className="flex items-center">
                  <span className="flex flex-col items-center gap-1 rounded-md border border-line bg-carbon px-3.5 py-2.5">
                    <span className="font-mono text-[9px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="whitespace-nowrap text-xs font-medium text-ink-2">{step}</span>
                  </span>
                  {i < arr.length - 1 ? <span aria-hidden className="mx-1.5 h-px w-4 bg-line" /> : null}
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-6">
            <CtaLink href="/redemption" variant="ghost">Proposed redemption framework →</CtaLink>
          </div>
        </div>
      </section>

      {/* 13 — Enterprise */}
      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Section 09 — Enterprise"
          title="Infrastructure for Asset Owners, Producers and Institutions"
          lead="ReserveChain intends to make its verification, registry, passport and tokenization infrastructure available to asset owners, producers, commodity companies, industrial buyers and institutional participants."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Asset-Program Infrastructure", "Structured onboarding, due-diligence and lifecycle management for approved real-world asset programs.", "/asset-originators"],
            ["Digital Asset Passport Technology", "Unit-level documentation records for lots, batches, containers and coils.", "/digital-asset-passports"],
            ["Registry & Reserve Architecture", "Auditable registry, reconciliation and reporting infrastructure.", "/enterprise-services"],
            ["Tokenization Architecture", "Configurable, compliance-gated ERC-20 token-series design.", "/tokenization"],
            ["Enterprise Portals", "Planned portals for originators, institutional participants and industrial buyers.", "/enterprise-services"],
            ["White-Label Infrastructure", "Planned licensing of the platform architecture for approved issuers.", "/enterprise-services"],
          ].map(([title, body, href]) => (
            <Link key={title} href={href} className="card group p-6 transition hover:border-gold/40">
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
              <p className="mt-3 text-sm text-gold opacity-0 transition group-hover:opacity-100">Learn more →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 14 — Documentation centre */}
      <section className="border-t border-line bg-carbon/50">
        <div className="shell py-16 sm:py-20">
          <SectionHeading
            eyebrow="Section 10 — Documentation"
            title="Documentation Centre"
            lead="Document categories are prepared with explicit statuses. No download is offered for documents that do not yet exist."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Whitepaper", "In Preparation", "Stage 1 institutional draft in preparation; publication follows completion of the corporate, legal and verification workstreams."],
              ["Certificates of Analysis", "Reference Preview", "Two owner-supplied IGAS research certificates registered; publication status subject to approval."],
              ["Token Terms", "Pending Owner Input", "Requires definitive offering documentation and legal review."],
              ["Proof-of-Reserves Reports", "Inactive", "No report exists; reporting begins only with approved data."],
            ].map(([title, status, body]) => (
              <Card key={title}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold">{title}</h3>
                  <StatusPill tone={status === "Reference Preview" ? "development" : status === "In Preparation" ? "pending" : "inactive"}>{status}</StatusPill>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-2">{body}</p>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <CtaLink href="/documents" variant="secondary">Open the Documentation Centre</CtaLink>
          </div>
        </div>
      </section>

      {/* 15 — Roadmap */}
      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Section 11 — Roadmap"
          title="Operational Stages, Not Promises"
          lead="Progress is described by workstream state. Dates depend on legal, custody, audit and authorization gates that cannot be bypassed."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Foundation", "In Progress", "Swiss corporate structuring, prelaunch platform, registry and passport infrastructure, contract architecture."],
            ["Verification & Custody", "Pending Inputs", "Laboratory publication approval, ownership documentation, custodian and insurance selection."],
            ["Controlled Issuance", "Gated", "Testnet validation, independent audit, definitive offering documentation, written launch authorization."],
            ["Operations", "Future", "Reserve reporting, eligibility-gated participation, redemption operations, enterprise onboarding."],
          ].map(([phase, state, body], i) => (
            <Card key={phase}>
              <p className="font-mono text-[10px] text-muted">STAGE {String(i + 1).padStart(2, "0")}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold">{phase}</h3>
                <StatusPill tone={state === "In Progress" ? "development" : state === "Pending Inputs" ? "pending" : "inactive"}>{state}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <CtaLink href="/roadmap" variant="ghost">Full roadmap →</CtaLink>
        </div>
      </section>

      {/* 16 — Risk */}
      <section className="border-t border-line bg-carbon/50">
        <div className="shell py-16 sm:py-20">
          <SectionHeading
            eyebrow="Section 12 — Risk"
            title="Material Risks and Limitations"
            lead="Any future participation would involve significant risk. The summary below is not exhaustive; the full Risk Disclosure applies."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Prelaunch stage — the project may change materially or not proceed",
              "Corporate and legal structure dependency",
              "Asset verification dependency",
              "Custody and insurance dependency",
              "Smart-contract and cybersecurity risk",
              "Regulatory and jurisdictional risk",
              "Liquidity risk — no market is promised",
              "Redemption and logistics risk",
              "Third-party dependency risk",
            ].map((risk) => (
              <p key={risk} className="rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink-2">
                {risk}
              </p>
            ))}
          </div>
          <div className="mt-6">
            <CtaLink href="/legal/risk-disclosure" variant="secondary">Full Risk Disclosure</CtaLink>
          </div>
        </div>
      </section>

      {/* 17 — FAQ */}
      <section className="shell py-16 sm:py-20">
        <SectionHeading eyebrow="Section 13 — FAQ" title="Direct Answers to Direct Questions" />
        <div className="grid gap-3 lg:grid-cols-2">
          {FAQ_ITEMS.map(([q, a]) => (
            <details key={q} className="card group p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
                <span className="flex items-center justify-between gap-3">
                  {q}
                  <span aria-hidden className="text-muted transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6">
          <CtaLink href="/faq" variant="ghost">All questions →</CtaLink>
        </div>
      </section>

      {/* 18 — Waitlist */}
      <section id="waitlist" className="border-t border-line bg-carbon/50">
        <div className="shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading
              eyebrow="Section 14 — Waitlist"
              title="Join the Project Waitlist"
              lead="Register interest to receive project-development updates and future eligibility information. Verified persistence, consent recording and email-verification workflow are live."
            />
            <Disclosure compact />
          </div>
          <WaitlistForm />
        </div>
      </section>

      {/* 19 — Anti-fraud */}
      <section className="shell py-16">
        <div className="rounded-lg border border-crit/30 bg-crit/5 p-6 sm:p-8">
          <p className="eyebrow mb-3 !text-crit">Anti-Fraud and Anti-Impersonation Notice</p>
          <ul className="grid gap-2.5 text-sm text-ink-2 sm:grid-cols-2">
            {[
              "No public token sale is active.",
              "The waitlist does not collect payment of any kind.",
              "The waitlist does not request wallet addresses.",
              "No publicly approved contract address currently exists.",
              "Rely exclusively on the official channels directory.",
            ].map((i) => (
              <li key={i} className="flex gap-2.5">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crit" />
                {i}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <CtaLink href="/legal/anti-fraud" variant="secondary">Anti-Fraud Notice</CtaLink>
            <CtaLink href="/official-channels" variant="ghost">Official Channels →</CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
