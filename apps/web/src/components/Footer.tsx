"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n, LOCALES, type Locale } from "@/lib/i18n";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Project",
    links: [
      ["Project Overview", "/project-overview"],
      ["How It Works", "/how-it-works"],
      ["About ReserveChain", "/about"],
      ["Roadmap", "/roadmap"],
      ["Governance", "/governance"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Assets",
    links: [
      ["All Metal Programs", "/industrial-metal-assets"],
      ["Copper Powder", "/industrial-metal-assets/copper-powder"],
      ["Nickel Wire", "/industrial-metal-assets/nickel-wire"],
      ["Asset Registry", "/asset-registry"],
      ["Digital Asset Passports", "/digital-asset-passports"],
    ],
  },
  {
    title: "Infrastructure",
    links: [
      ["Verification", "/verification"],
      ["Custody", "/custody"],
      ["Proof of Reserves", "/proof-of-reserves"],
      ["Tokenization", "/tokenization"],
      ["Redemption", "/redemption"],
    ],
  },
  {
    title: "Enterprise",
    links: [
      ["Enterprise Services", "/enterprise-services"],
      ["Asset Originators", "/asset-originators"],
      ["Industrial Buyers", "/industrial-buyers"],
      ["Documents", "/documents"],
      ["Project Waitlist", "/waitlist"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/legal/privacy"],
      ["Cookie Policy", "/legal/cookies"],
      ["Terms of Use", "/legal/terms"],
      ["Risk Disclosure", "/legal/risk-disclosure"],
      ["Restricted Jurisdictions", "/legal/restricted-jurisdictions"],
      ["Anti-Fraud Notice", "/legal/anti-fraud"],
      ["Official Channels", "/official-channels"],
    ],
  },
];

export function Footer() {
  const { t, locale, setLocale } = useI18n();
  return (
    <footer className="border-t border-line bg-carbon">
      <div className="shell py-12 lg:py-16">
        {/* Six columns only fit from xl up; below that the link groups wrap. */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-10 xl:grid-cols-[minmax(220px,1.1fr)_repeat(5,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/brand/reservechain-emblem.webp" alt="" width={40} height={40} />
              <div>
                <p className="font-display text-base font-semibold">
                  ReserveChain<span className="text-gold">.io</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
                  The Infrastructure for Real-World Assets
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted">
              Prelaunch information platform. {t("status.swiss")} No tokens are offered or sold
              through this website.
            </p>
            <div className="mt-5">
              <label className="field-label" htmlFor="footer-locale">
                Language
              </label>
              <select
                id="footer-locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="field max-w-[180px]"
              >
                {LOCALES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 max-w-xs text-[11px] text-muted">{t("lang.note")}</p>
            </div>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="link-quiet text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-muted">
            <strong className="text-ink-2">{t("disclosure.title")}: </strong>
            {t("disclosure.body")}
          </p>
          <p className="mt-2 text-xs text-muted">{t("disclosure.legalReview")}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] text-muted">
              © {new Date().getFullYear()} ReserveChain — Swiss corporate structure in development.
            </p>
            <Link href="/corporate-development-status" className="link-quiet font-mono text-[11px] uppercase tracking-wider">
              {t("footer.status")} →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
