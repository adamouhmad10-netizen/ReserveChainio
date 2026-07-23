import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
  title: { default: "Administration Portal", template: "%s | ReserveChain Admin" },
};

const NAV: { section: string; items: [string, string][] }[] = [
  {
    section: "Overview",
    items: [
      ["Dashboard", "/admin"],
      ["All Modules", "/admin/modules-index"],
    ],
  },
  {
    section: "Registrations",
    items: [
      ["Waitlist", "/admin/waitlist"],
      ["Enquiries", "/admin/enquiries"],
    ],
  },
  {
    section: "Registry & Content",
    items: [
      ["Asset Registry", "/admin/registry"],
      ["Passports", "/admin/passports"],
      ["Documents", "/admin/documents"],
      ["Content Workflow", "/admin/content"],
    ],
  },
  {
    section: "Platform Control",
    items: [
      ["Website Modes", "/admin/website-modes"],
      ["Module Visibility", "/admin/modules"],
      ["Jurisdictions", "/admin/jurisdictions"],
      ["Users & Roles", "/admin/users"],
      ["Audit Trail", "/admin/audit"],
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = currentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-navy">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-carbon lg:flex">
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-4">
          <Image src="/brand/reservechain-emblem.webp" alt="" width={28} height={28} />
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              ReserveChain<span className="text-gold">.io</span>
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin">
          {NAV.map((group) => (
            <div key={group.section} className="mb-4">
              <p className="eyebrow mb-2 px-2 !text-[9px]">{group.section}</p>
              <ul className="space-y-0.5">
                {group.items.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="block rounded-md px-2.5 py-1.5 text-sm text-ink-2 transition hover:bg-panel hover:text-ink">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <p className="truncate text-xs text-ink-2">{user.email}</p>
          <p className="mt-0.5 font-mono text-[10px] uppercase text-muted">{user.roles.join(" · ")}</p>
          <LogoutButton />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="border-b border-line bg-carbon px-4 py-2 lg:hidden">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-ink">Admin navigation</summary>
            <nav className="mt-2 grid grid-cols-2 gap-1 pb-2">
              {NAV.flatMap((g) => g.items).map(([label, href]) => (
                <Link key={href} href={href} className="rounded px-2 py-1.5 text-sm text-ink-2 hover:bg-panel">
                  {label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
        <div className="border-b border-line bg-carbon/70 px-6 py-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warn">
            Prelaunch administration — sensitive modules disabled · all actions are recorded in the append-only audit trail
          </p>
        </div>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
