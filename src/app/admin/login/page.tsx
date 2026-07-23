"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Image src="/brand/reservechain-emblem.webp" alt="" width={36} height={36} />
          <div>
            <p className="font-display text-base font-semibold text-ink">
              ReserveChain<span className="text-gold">.io</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Administration Portal</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="card space-y-4 p-6">
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="field" autoComplete="username" />
          </div>
          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required className="field" autoComplete="current-password" />
          </div>
          {error ? (
            <p className="rounded-md border border-crit/40 bg-crit/10 px-3 py-2 text-sm text-crit" role="alert">{error}</p>
          ) : null}
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
          <p className="text-[11px] leading-relaxed text-muted">
            Demonstration credentials are documented in the project README. Failed attempts are
            rate-limited and logged. MFA enrolment is part of the production hardening path.
          </p>
        </form>
      </div>
    </div>
  );
}
