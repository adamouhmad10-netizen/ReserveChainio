"use client";

import { useState } from "react";

// Interactive infrastructure diagram: the seven proposed lifecycle stages.
// Each stage distinguishes designed framework / confirmed data / pending approval.

const STAGES = [
  {
    n: "01",
    title: "Asset Program Selection",
    framework: "Evaluation criteria for purity, ownership, documentation, valuation, storage, marketability and redemption.",
    confirmed: "Two initial programs defined: Copper Powder (proposed 99.9999%) and Nickel Wire (proposed 99.9807%).",
    pending: "Final program acceptance criteria subject to owner and adviser approval.",
  },
  {
    n: "02",
    title: "Independent Material Verification",
    framework: "Laboratory testing, assay, inspection and documentary verification workflows.",
    confirmed: "Owner-supplied IGAS research Certificates of Analysis registered as reference documents.",
    pending: "Current verification status and publication approval of laboratory records.",
  },
  {
    n: "03",
    title: "Ownership & Custody Documentation",
    framework: "Ownership records, chain of title, warehouse receipts, inventory controls and insurance records.",
    confirmed: "Data model and administrative workflows implemented.",
    pending: "All ownership, custody, warehouse and insurance documentation.",
  },
  {
    n: "04",
    title: "Digital Asset Passport",
    framework: "Structured digital record per lot, batch, container or coil linking every evidence layer.",
    confirmed: "Passport infrastructure implemented with two illustrative templates.",
    pending: "Real passports require approved asset, ownership and custody data.",
  },
  {
    n: "05",
    title: "Controlled Tokenization",
    framework: "Configurable ERC-20 token or token-series architecture on Ethereum, testnet-first, audit before Mainnet.",
    confirmed: "Contract suite drafted with automated tests. No deployment.",
    pending: "Token terms, supply, pricing, legal classification and written launch authorization.",
  },
  {
    n: "06",
    title: "Reserve Reconciliation",
    framework: "Reconciliation of eligible physical inventory against issued and circulating tokens with periodic verification.",
    confirmed: "Data architecture and exception-reporting design implemented.",
    pending: "Approved reserve, custody, supply and attestation data. Public reporting inactive.",
  },
  {
    n: "07",
    title: "Transfer & Future Redemption",
    framework: "Compliance-gated transfers and container/coil-level physical redemption lifecycle.",
    confirmed: "Redemption workflow architecture prepared and kept inactive.",
    pending: "Legal redemption rights, custody release procedures, fees, logistics and activation authorization.",
  },
];

export function WorkflowDiagram() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];
  return (
    <div className="card overflow-hidden">
      <div className="table-scroll border-0">
        <ol className="flex min-w-max border-b border-line" role="tablist" aria-label="Proposed lifecycle stages">
          {STAGES.map((s, i) => (
            <li key={s.n} className="flex items-stretch">
              <button
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={`flex flex-col gap-1 border-r border-line px-4 py-3 text-left transition ${
                  active === i ? "bg-panel text-ink" : "text-muted hover:bg-surface2 hover:text-ink-2"
                }`}
              >
                <span className="font-mono text-[10px] tracking-wider">{s.n}</span>
                <span className="whitespace-nowrap text-xs font-medium">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div key={stage.n} className="grid animate-fadein gap-5 p-5 sm:p-6 md:grid-cols-3">
        <div>
          <p className="eyebrow mb-2 !text-info">Designed Framework</p>
          <p className="text-sm leading-relaxed text-ink-2">{stage.framework}</p>
        </div>
        <div>
          <p className="eyebrow mb-2 !text-ok">Current State</p>
          <p className="text-sm leading-relaxed text-ink-2">{stage.confirmed}</p>
        </div>
        <div>
          <p className="eyebrow mb-2 !text-warn">Pending Approval</p>
          <p className="text-sm leading-relaxed text-ink-2">{stage.pending}</p>
        </div>
      </div>
    </div>
  );
}
