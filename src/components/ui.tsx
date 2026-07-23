import type { ReactNode } from "react";
import Link from "next/link";

type Tone = "pending" | "inactive" | "development" | "ok" | "warn" | "info" | "copper" | "nickel" | "gold";

const toneStyles: Record<Tone, string> = {
  pending: "border-warn/40 bg-warn/10 text-warn",
  inactive: "border-line bg-surface2 text-muted",
  development: "border-info/40 bg-info/10 text-info",
  ok: "border-ok/40 bg-ok/10 text-ok",
  warn: "border-warn/40 bg-warn/10 text-warn",
  info: "border-info/40 bg-info/10 text-info",
  copper: "border-copper/40 bg-copper/10 text-copper-light",
  nickel: "border-nickel-dark bg-nickel-dark/20 text-nickel",
  gold: "border-gold/40 bg-gold/10 text-gold",
};

export function StatusPill({ tone = "inactive", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      // Deliberately not whitespace-nowrap: status labels such as
      // "Subject to final custody arrangements" would otherwise set a
      // min-content width that overflows narrow containers.
      className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-0.5 text-center font-mono text-[10px] font-medium uppercase leading-relaxed tracking-[0.14em] ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (s.includes("pending")) return "pending";
  if (s.includes("develop") || s.includes("prepared") || s.includes("progress")) return "development";
  if (s.includes("implemented") || s.includes("published") || s.includes("verified") || s.includes("enabled") || s.includes("active") && !s.includes("inactive")) return "ok";
  return "inactive";
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  id?: string;
}) {
  return (
    <div id={id} className="mb-8 max-w-3xl scroll-mt-28">
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2 className="h-display text-2xl sm:text-3xl">{title}</h2>
      {lead ? <p className="mt-3 text-base leading-relaxed text-ink-2">{lead}</p> : null}
    </div>
  );
}

export function KV({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/60 py-2.5 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted">{label}</dt>
      <dd className={`min-w-0 max-w-full text-sm text-ink-2 sm:text-right ${mono ? "font-mono text-[13px]" : ""}`}>{value}</dd>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card p-6 ${className}`}>{children}</div>;
}

export function CtaLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const cls = variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-ghost";
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function DisabledAction({
  label,
  reason,
  dependency,
}: {
  label: string;
  reason: string;
  dependency: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-line bg-carbon/60 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted line-through decoration-muted/50">{label}</span>
        <StatusPill tone="inactive">Disabled</StatusPill>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        {reason} <span className="text-ink-2">Activation dependency:</span> {dependency}
      </p>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  status,
  tone = "development",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  status?: string;
  tone?: Tone;
}) {
  return (
    <header className="border-b border-line bg-carbon">
      <div className="shell py-12 sm:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow">{eyebrow}</p>
          {status ? <StatusPill tone={tone}>{status}</StatusPill> : null}
        </div>
        <h1 className="h-display mt-4 max-w-4xl text-3xl sm:text-4xl lg:text-5xl">{title}</h1>
        {lead ? <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-2 sm:text-lg">{lead}</p> : null}
      </div>
    </header>
  );
}
