import Link from "next/link";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "All Modules" };

// Complete administrative module index from the master scope. Implemented
// modules link to working screens; the remainder are shown with their honest
// delivery state so nothing is misrepresented as complete.
const MODULES: { group: string; items: [string, string, "implemented" | "prepared" | "pending"][] }[] = [
  {
    group: "Implemented in this working draft",
    items: [
      ["Dashboard", "/admin", "implemented"],
      ["Waitlist (search, filter, export)", "/admin/waitlist", "implemented"],
      ["Enquiries", "/admin/enquiries", "implemented"],
      ["Asset Registry", "/admin/registry", "implemented"],
      ["Digital Asset Passports", "/admin/passports", "implemented"],
      ["Documents", "/admin/documents", "implemented"],
      ["Content publication workflow", "/admin/content", "implemented"],
      ["Website modes", "/admin/website-modes", "implemented"],
      ["Module visibility", "/admin/modules", "implemented"],
      ["Jurisdiction rules", "/admin/jurisdictions", "implemented"],
      ["Users & roles", "/admin/users", "implemented"],
      ["Audit trail (hash-chained)", "/admin/audit", "implemented"],
    ],
  },
  {
    group: "Database and architecture prepared — screens pending build-out",
    items: [
      ["Programs / Copper / Nickel detail editors", "", "prepared"],
      ["Lots, batches, containers, coils editors", "", "prepared"],
      ["Laboratories & laboratory reports", "", "prepared"],
      ["Ownership & chain of title", "", "prepared"],
      ["Valuations", "", "prepared"],
      ["Custody & warehouse receipts", "", "prepared"],
      ["Insurance records", "", "prepared"],
      ["Reserve reports & discrepancies", "", "prepared"],
      ["Token programs & deployments", "", "prepared"],
      ["Translations", "", "prepared"],
      ["SEO management", "", "prepared"],
      ["Notifications", "", "prepared"],
    ],
  },
  {
    group: "Blocked on owner input or third-party providers",
    items: [
      ["Compliance (KYC/KYB, sanctions, PEP)", "", "pending"],
      ["Redemption management", "", "pending"],
      ["Investor / enterprise portal administration", "", "pending"],
      ["Legal document version management", "", "pending"],
      ["System settings & secrets management", "", "pending"],
    ],
  },
];

export default function ModulesIndexPage() {
  return (
    <>
      <h1 className="h-display text-2xl">Administrative Module Index</h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-2">
        The full administrative scope with an honest delivery state for each module. Nothing is
        listed as complete because a screen exists — implemented modules below are working against
        the live database.
      </p>
      {MODULES.map((g) => (
        <section key={g.group} className="mt-6">
          <h2 className="h-display text-lg">{g.group}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map(([label, href, state]) =>
              href ? (
                <Link key={label} href={href} className="card flex items-center justify-between gap-3 !p-4 transition hover:border-gold/40">
                  <span className="text-sm text-ink">{label}</span>
                  <StatusPill tone="ok">Implemented</StatusPill>
                </Link>
              ) : (
                <div key={label} className="card flex items-center justify-between gap-3 !p-4">
                  <span className="text-sm text-ink-2">{label}</span>
                  <StatusPill tone={state === "prepared" ? "development" : "pending"}>
                    {state === "prepared" ? "Architecture prepared" : "Pending input"}
                  </StatusPill>
                </div>
              )
            )}
          </div>
        </section>
      ))}
    </>
  );
}
