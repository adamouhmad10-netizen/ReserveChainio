import { PageHeader, SectionHeading, Card, StatusPill } from "@/components/ui";

export const metadata = {
  title: "Roadmap — Operational Stages",
  description:
    "The ReserveChain roadmap is expressed as operational stages with explicit gates. Legal, custody, audit and authorization gates cannot be bypassed to meet a calendar date.",
};

const STAGES: { name: string; state: string; tone: "development" | "pending" | "inactive"; items: string[] }[] = [
  {
    name: "Stage 1 — Foundation",
    state: "In Progress",
    tone: "development",
    items: [
      "Swiss corporate and issuance structuring (owner workstream)",
      "Prelaunch information platform with functional waitlist",
      "Industrial Metals Registry and Digital Asset Passport infrastructure",
      "Configurable ERC-20 contract architecture with automated tests",
      "Administrative portal, publication workflow and audit trail",
    ],
  },
  {
    name: "Stage 2 — Verification & Custody",
    state: "Pending Owner Inputs",
    tone: "pending",
    items: [
      "Ownership and title documentation",
      "Laboratory publication approvals and any re-verification",
      "Custodian, warehouse and insurance selection and agreements",
      "Independent valuation appointments",
      "KYC/KYB and sanctions provider selection and integration",
    ],
  },
  {
    name: "Stage 3 — Controlled Issuance",
    state: "Gated",
    tone: "inactive",
    items: [
      "Definitive offering documentation and token legal classification",
      "Testnet validation and independent smart-contract audit",
      "Wallet, treasury and multisig operational setup",
      "Eligibility, jurisdiction and compliance activation",
      "Written issuer authorization before any deployment or offering",
    ],
  },
  {
    name: "Stage 4 — Operations",
    state: "Future",
    tone: "inactive",
    items: [
      "Reserve reporting with approved data and attestations",
      "Eligibility-gated participation under approved terms",
      "Physical redemption operations under final custody arrangements",
      "Enterprise and originator onboarding",
      "Mobile application store distribution under owner accounts",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Project"
        title="Roadmap"
        lead="Progress is described by operational stage rather than promised dates. Dependencies and launch gates cannot be bypassed merely to meet a calendar date."
        status="Stage 1 In Progress"
      />
      <div className="shell space-y-6 py-10">
        {STAGES.map((s) => (
          <Card key={s.name}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">{s.name}</h2>
              <StatusPill tone={s.tone}>{s.state}</StatusPill>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {s.items.map((i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-2">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {i}
                </li>
              ))}
            </ul>
          </Card>
        ))}
        <p className="text-xs leading-relaxed text-muted">
          A proposed 90–120 day development schedule for the awarded project, structured around the
          22 delivery phases of the master scope, is maintained in the project documentation.
        </p>
      </div>
    </>
  );
}
