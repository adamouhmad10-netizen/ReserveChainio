"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useI18n, LOCALES, type Locale } from "@/lib/i18n";

interface NavGroup {
  key: string;
  labelKey: string;
  href?: string;
  items?: { label: string; href: string; note?: string }[];
}

const NAV: NavGroup[] = [
  { key: "how", labelKey: "nav.howItWorks", href: "/how-it-works" },
  {
    key: "assets",
    labelKey: "nav.assets",
    items: [
      { label: "All Industrial Metal Programs", href: "/industrial-metal-assets" },
      { label: "Copper Powder Program", href: "/industrial-metal-assets/copper-powder", note: "Proposed 99.9999%" },
      { label: "Nickel Wire Program", href: "/industrial-metal-assets/nickel-wire", note: "Proposed 99.9807%" },
      { label: "Industrial Metals Registry", href: "/asset-registry", note: "Illustrative records" },
      { label: "Digital Asset Passports", href: "/digital-asset-passports" },
    ],
  },
  {
    key: "verification",
    labelKey: "nav.verification",
    items: [
      { label: "Verification Framework", href: "/verification" },
      { label: "Custody Framework", href: "/custody", note: "In development" },
      { label: "Proof of Reserves", href: "/proof-of-reserves", note: "Planned / inactive" },
    ],
  },
  {
    key: "tokenization",
    labelKey: "nav.tokenization",
    items: [
      { label: "Tokenization Architecture", href: "/tokenization" },
      { label: "Physical Redemption", href: "/redemption", note: "Proposed / inactive" },
      { label: "Governance", href: "/governance" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    key: "enterprise",
    labelKey: "nav.enterprise",
    items: [
      { label: "Enterprise Services", href: "/enterprise-services" },
      { label: "Asset Owners & Originators", href: "/asset-originators" },
      { label: "Industrial Buyers", href: "/industrial-buyers" },
    ],
  },
  { key: "documents", labelKey: "nav.documents", href: "/documents" },
];

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <p className="border-b border-line bg-carbon px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-warn">
        {t("status.prelaunch")} — {t("status.swiss")}
      </p>
      <header className="border-b border-line bg-navy/95 backdrop-blur">
        <nav ref={navRef} aria-label="Primary" className="shell flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="ReserveChain.io home">
            <Image src="/brand/reservechain-emblem.webp" alt="" width={34} height={34} priority />
            <span className="min-w-0">
              <span className="block truncate font-display text-[15px] font-semibold tracking-tight">
                ReserveChain<span className="text-gold">.io</span>
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
                The Infrastructure for Real-World Assets
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 xl:flex">
            {NAV.map((group) => (
              <li key={group.key} className="relative">
                {group.href ? (
                  <Link
                    href={group.href}
                    className={`btn-ghost ${pathname === group.href ? "text-ink" : ""}`}
                  >
                    {t(group.labelKey)}
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-ghost"
                      aria-expanded={open === group.key}
                      aria-haspopup="true"
                      onClick={() => setOpen(open === group.key ? null : group.key)}
                    >
                      {t(group.labelKey)}
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={`transition-transform ${open === group.key ? "rotate-180" : ""}`}>
                        <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                    {open === group.key ? (
                      <div className="absolute left-0 top-full mt-2 w-72 animate-fadein rounded-lg border border-line bg-surface p-2 shadow-2xl shadow-black/50">
                        {group.items!.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block rounded-md px-3 py-2.5 transition hover:bg-panel"
                          >
                            <span className="block text-sm font-medium text-ink">{item.label}</span>
                            {item.note ? (
                              <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                                {item.note}
                              </span>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 xl:flex">
            <label className="sr-only" htmlFor="locale-select">
              Language
            </label>
            <select
              id="locale-select"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="rounded-md border border-line bg-carbon px-2 py-1.5 font-mono text-xs uppercase text-ink-2"
            >
              {LOCALES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.code.toUpperCase()}
                </option>
              ))}
            </select>
            <Link href="/waitlist" className="btn-primary whitespace-nowrap !px-4 !py-2.5">
              <span className="2xl:hidden">{t("nav.waitlistShort")}</span>
              <span className="hidden 2xl:inline">{t("nav.waitlist")}</span>
            </Link>
          </div>

          <button
            type="button"
            className="btn-ghost xl:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
              {mobileOpen ? (
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" />
              ) : (
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" />
              )}
            </svg>
          </button>
        </nav>

        {mobileOpen ? (
          <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-line bg-carbon xl:hidden">
            <div className="shell divide-y divide-line py-3">
              {NAV.map((group) => (
                <div key={group.key} className="py-2">
                  {group.href ? (
                    <Link href={group.href} className="block py-2 text-sm font-semibold text-ink">
                      {t(group.labelKey)}
                    </Link>
                  ) : (
                    <details>
                      <summary className="cursor-pointer list-none py-2 text-sm font-semibold text-ink">
                        {t(group.labelKey)}
                      </summary>
                      <div className="space-y-1 pb-2 pl-3">
                        {group.items!.map((item) => (
                          <Link key={item.href} href={item.href} className="block py-1.5 text-sm text-ink-2">
                            {item.label}
                            {item.note ? <span className="ml-2 font-mono text-[10px] uppercase text-muted">{item.note}</span> : null}
                          </Link>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between gap-3 py-4">
                <select
                  aria-label="Language"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="rounded-md border border-line bg-navy px-2 py-2 font-mono text-xs uppercase text-ink-2"
                >
                  {LOCALES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <Link href="/waitlist" className="btn-primary flex-1 !py-2.5 text-center">
                  {t("nav.waitlist")}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </div>
  );
}
