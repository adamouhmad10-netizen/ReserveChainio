"use client";

import { useState } from "react";

// Interactive "Asset Evidence Stack" hero visual: the layered continuity from
// physical material to controlled tokenization. No coin imagery.

const LAYERS = [
  {
    id: "material",
    label: "Physical Material",
    status: "Program In Development",
    tone: "dev",
    detail:
      "Ultra-high-purity copper powder and high-purity nickel wire programs. Physical inventory quantities remain pending documentary verification.",
  },
  {
    id: "laboratory",
    label: "Laboratory Evidence",
    status: "Owner-Supplied Reference",
    tone: "dev",
    detail:
      "IGAS research Certificates of Analysis Nos. 0004512 (copper) and 0004368 (nickel) supplied by the owner. Publication and current verification status remain subject to approval.",
  },
  {
    id: "ownership",
    label: "Ownership / Title Record",
    status: "Pending",
    tone: "pending",
    detail: "Ownership and chain-of-title documentation awaits owner-supplied records and legal review.",
  },
  {
    id: "custody",
    label: "Custody / Inventory",
    status: "Pending",
    tone: "pending",
    detail: "Custody structure in development. No custodian, warehouse or insurance arrangement is confirmed.",
  },
  {
    id: "passport",
    label: "Digital Asset Passport",
    status: "Illustrative Template",
    tone: "dev",
    detail:
      "Structured digital record connecting material, laboratory, ownership, custody, valuation and reserve documentation. Live templates: TEMPLATE-CU-BATCH and TEMPLATE-NI-COIL.",
  },
  {
    id: "reserve",
    label: "Reserve Reconciliation",
    status: "Architecture Prepared",
    tone: "inactive",
    detail:
      "Module prepared to reconcile eligible physical inventory with issued and circulating tokens. Public reporting inactive pending approved data.",
  },
  {
    id: "token",
    label: "Proposed Token Layer",
    status: "Not Issued",
    tone: "inactive",
    detail:
      "Configurable ERC-20 architecture on Ethereum, testnet-first. No token contract is currently published through this website.",
  },
];

const toneCls: Record<string, string> = {
  dev: "text-info border-info/40 bg-info/10",
  pending: "text-warn border-warn/40 bg-warn/10",
  inactive: "text-muted border-line bg-surface2",
};

const dotCls: Record<string, string> = {
  dev: "bg-info",
  pending: "bg-warn",
  inactive: "bg-muted",
};

export function EvidenceStack() {
  const [active, setActive] = useState("passport");
  const current = LAYERS.find((l) => l.id === active)!;

  return (
    <figure aria-label="Asset evidence stack — from physical material to controlled tokenization" className="card overflow-hidden">
      <div className="border-b border-line bg-carbon px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Asset Evidence Stack — Material Evidence → Digital Continuity
        </p>
      </div>
      <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
        <ol className="p-3.5">
          {[...LAYERS].reverse().map((layer, i) => (
            // The staircase indent lives on the <li>, not the button: a
            // margin on a w-full button would make it wider than the card.
            <li key={layer.id} style={{ marginInlineStart: `${(LAYERS.length - 1 - i) * 4}px` }}>
              <button
                type="button"
                onClick={() => setActive(layer.id)}
                aria-pressed={active === layer.id}
                title={layer.status}
                className={`group mb-1.5 flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-200 ${
                  active === layer.id
                    ? "border-gold/50 bg-panel"
                    : "border-line/60 bg-surface2/50 hover:border-line hover:bg-surface2"
                }`}
              >
                <span className="shrink-0 font-mono text-[10px] text-muted">
                  {String(LAYERS.length - i).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{layer.label}</span>
                {/* A small tone dot replaces the wide status pill: the full
                    status is shown in the detail panel, and a text pill here
                    stretched the button and pushed the layout on desktop. */}
                <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${dotCls[layer.tone]}`} />
              </button>
            </li>
          ))}
        </ol>
        <figcaption className="flex flex-col justify-between border-t border-line bg-carbon/60 p-5 md:border-l md:border-t-0">
          <div key={current.id} className="animate-fadein">
            <span className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${toneCls[current.tone]}`}>
              {current.status}
            </span>
            <h3 className="mt-3 font-display text-lg font-semibold">{current.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{current.detail}</p>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-muted">
            Statuses shown are current and accurate for the prelaunch stage. No layer is presented
            as complete, verified or active unless supporting documentation exists.
          </p>
        </figcaption>
      </div>
    </figure>
  );
}
