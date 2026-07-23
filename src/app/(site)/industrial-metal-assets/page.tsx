export const dynamic = "force-dynamic";

import Link from "next/link";
import { PageHeader, StatusPill, KV } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";
import { getPrograms } from "@/lib/queries";

export const metadata = {
  title: "Industrial Metal Asset Programs",
  description:
    "ReserveChain's proposed industrial metal asset programs: Ultra-High-Purity Copper Powder and High-Purity Nickel Wire. Expandable to future approved real-world asset programs.",
};

export default function AssetsIndexPage() {
  const programs = getPrograms();
  return (
    <>
      <PageHeader
        eyebrow="Industrial Metal Assets"
        title="Proposed Asset Programs"
        lead="ReserveChain's architecture is built for multiple approved real-world asset programs. Two initial industrial-metal programs are in development; the registry is expandable to future approved programs."
        status="Programs In Development"
      />
      <div className="shell space-y-8 py-10">
        <Disclosure compact />
        <div className="grid gap-6 lg:grid-cols-2">
          {programs.map((p) => {
            const copper = p.metal === "copper";
            return (
              <Link
                key={p.id}
                href={`/industrial-metal-assets/${p.slug}`}
                className={`card group relative overflow-hidden p-7 transition ${copper ? "hover:border-copper/50" : "hover:border-nickel/50"}`}
              >
                <div
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 ${copper ? "bg-gradient-to-r from-copper-dark via-copper to-copper-light" : "bg-gradient-to-r from-nickel-dark via-nickel-mid to-nickel"}`}
                />
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className={`eyebrow ${copper ? "!text-copper-light" : "!text-nickel"}`}>{p.code}</p>
                  <StatusPill tone="development">In Development</StatusPill>
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold">{p.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{p.summary}</p>
                <dl className="mt-5">
                  <KV label="Proposed specification" value={<span className={`font-mono ${copper ? "text-copper-light" : "text-nickel"}`}>{p.proposed_purity}</span>} />
                  <KV label="Material form" value={p.material_form} />
                  <KV label="Availability" value={<StatusPill tone="inactive">Not offered for sale</StatusPill>} />
                </dl>
                <p className={`mt-5 text-sm font-medium transition group-hover:translate-x-1 ${copper ? "text-copper-light" : "text-nickel"}`}>
                  View program →
                </p>
              </Link>
            );
          })}
          <div className="card flex flex-col justify-center border-dashed p-7">
            <p className="eyebrow mb-2">Future Programs</p>
            <h2 className="font-display text-xl font-semibold text-ink-2">Additional Approved Asset Programs</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The registry, passport and tokenization architecture supports additional
              issuer-approved real-world asset programs without rebuilding the platform. Program
              onboarding is subject to the due-diligence and acceptance workflow.
            </p>
            <Link href="/asset-originators" className="mt-4 text-sm font-medium text-gold">
              Asset originator enquiries →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
