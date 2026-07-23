export const dynamic = "force-dynamic";

import Link from "next/link";
import { PageHeader, StatusPill, KV } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";
import { getPassports } from "@/lib/queries";

export const metadata = {
  title: "Digital Asset Passports",
  description:
    "Structured digital records connecting physical industrial-metal units with laboratory, ownership, valuation, custody and reserve documentation. Illustrative templates only.",
};

export default function PassportsIndexPage() {
  const passports = getPassports();
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Digital Asset Passports"
        lead="Each approved lot, batch, container or coil is intended to receive a structured digital record — a passport — connecting the physical material with its laboratory, ownership, valuation, custody, reserve and lifecycle documentation, with versioning and event history."
        status="Illustrative Templates"
        tone="warn"
      />
      <div className="shell space-y-8 py-10">
        <Disclosure compact />
        <div className="grid gap-6 md:grid-cols-2">
          {passports.map((p) => (
            <Link key={p.id} href={`/digital-asset-passports/${p.slug}`} className="card group p-6 transition hover:border-gold/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted">{p.passport_code}</span>
                <StatusPill tone={p.metal === "copper" ? "copper" : "nickel"}>Illustrative Template</StatusPill>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold">{p.asset_title}</h2>
              <dl className="mt-4">
                <KV label="Program" value={p.program_name} />
                <KV label="Record version" value={<span className="font-mono">v{p.version}</span>} />
                <KV label="Availability" value="Not Offered for Sale" />
              </dl>
              <p className="mt-4 text-sm font-medium text-gold transition group-hover:translate-x-1">Open passport →</p>
            </Link>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-muted">
          “This presentation demonstrates the future format of a ReserveChain industrial-metal
          asset record. No verified material, ownership document, valuation, custody arrangement,
          reserve claim or token is represented by this illustrative template.”
        </p>
      </div>
    </>
  );
}
