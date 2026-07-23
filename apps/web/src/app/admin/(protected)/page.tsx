import Link from "next/link";
import { getDb } from "@/lib/db";
import { verifyChain } from "@/lib/audit";
import { StatusPill } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const d = getDb();
  const count = (sql: string) => (d.prepare(sql).get() as { n: number }).n;
  const stats = [
    ["Waitlist registrations", count("SELECT COUNT(*) n FROM waitlist_registrations"), "/admin/waitlist"],
    ["Verified registrations", count("SELECT COUNT(*) n FROM waitlist_registrations WHERE status='verified'"), "/admin/waitlist"],
    ["Enquiries", count("SELECT COUNT(*) n FROM enquiries"), "/admin/enquiries"],
    ["Registry records", count("SELECT COUNT(*) n FROM physical_assets"), "/admin/registry"],
    ["Passports", count("SELECT COUNT(*) n FROM passport_records"), "/admin/passports"],
    ["Documents", count("SELECT COUNT(*) n FROM documents"), "/admin/documents"],
    ["Content pages", count("SELECT COUNT(*) n FROM content_pages"), "/admin/content"],
    ["Audit entries", count("SELECT COUNT(*) n FROM audit_entries"), "/admin/audit"],
  ] as const;
  const chain = verifyChain(d);
  const mode = d.prepare("SELECT label FROM website_modes WHERE is_active = 1").get() as { label: string } | undefined;

  return (
    <>
      <h1 className="h-display text-2xl">Dashboard</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <StatusPill tone="warn">Website mode: {mode?.label ?? "—"}</StatusPill>
        <StatusPill tone={chain.ok ? "ok" : "warn"}>
          Audit chain {chain.ok ? `intact (${chain.checked} entries)` : `BROKEN at seq ${chain.firstBrokenSeq}`}
        </StatusPill>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, n, href]) => (
          <Link key={label} href={href} className="card p-5 transition hover:border-gold/40">
            <p className="font-mono text-3xl font-semibold text-ink">{n}</p>
            <p className="mt-1 text-sm text-ink-2">{label}</p>
          </Link>
        ))}
      </div>
      <div className="card mt-6 p-5">
        <p className="eyebrow mb-3">Prelaunch guardrails</p>
        <ul className="grid gap-2 text-sm text-ink-2 sm:grid-cols-2">
          <li>• Token acquisition, wallet, redemption and public Proof of Reserves are disabled and cannot be enabled without written authorization.</li>
          <li>• Draft and under-review content is never publicly accessible or indexed.</li>
          <li>• Every administrative action is appended to the hash-chained audit trail.</li>
          <li>• Registry records are illustrative templates (is_demo = true) until owner data is approved.</li>
        </ul>
      </div>
    </>
  );
}
