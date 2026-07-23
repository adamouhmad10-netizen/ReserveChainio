"use client";

import { useState, type FormEvent } from "react";

export function EnquiryForm({ defaultType = "enterprise" }: { defaultType?: string }) {
  const [phase, setPhase] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPhase("submitting");
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryType: form.get("enquiryType"),
          organization: form.get("organization") || undefined,
          contactName: form.get("contactName"),
          email: form.get("email"),
          country: form.get("country") || undefined,
          message: form.get("message"),
          website: form.get("website") ?? "",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "The enquiry could not be submitted. Please review the form.");
        setPhase("error");
        return;
      }
      setPhase("done");
    } catch {
      setError("A network error occurred. Please try again.");
      setPhase("error");
    }
  }

  if (phase === "done") {
    return (
      <div className="card p-6" role="status">
        <p className="eyebrow !text-ok">Enquiry received</p>
        <p className="mt-2 text-sm text-ink-2">
          Your enquiry has been recorded and will be reviewed by the project team. Response times
          during the prelaunch stage may vary.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="eq-type">Enquiry Type *</label>
          <select id="eq-type" name="enquiryType" required className="field" defaultValue={defaultType}>
            <option value="enterprise">Enterprise services</option>
            <option value="asset_originator">Asset owner / originator</option>
            <option value="industrial_buyer">Industrial buyer</option>
            <option value="general">General</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="eq-org">Organization</label>
          <input id="eq-org" name="organization" maxLength={200} className="field" autoComplete="organization" />
        </div>
        <div>
          <label className="field-label" htmlFor="eq-name">Contact Name *</label>
          <input id="eq-name" name="contactName" required maxLength={150} className="field" autoComplete="name" />
        </div>
        <div>
          <label className="field-label" htmlFor="eq-email">Email Address *</label>
          <input id="eq-email" name="email" type="email" required className="field" autoComplete="email" />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="eq-country">Country</label>
          <input id="eq-country" name="country" maxLength={100} className="field" autoComplete="country-name" />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="eq-message">Enquiry *</label>
        <textarea id="eq-message" name="message" required minLength={10} maxLength={5000} rows={5} className="field" />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="eq-website">Website</label>
        <input id="eq-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {error ? (
        <p className="rounded-md border border-crit/40 bg-crit/10 px-4 py-3 text-sm text-crit" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn-primary" disabled={phase === "submitting"}>
        {phase === "submitting" ? "Submitting…" : "Submit Enquiry"}
      </button>
      <p className="text-[11px] text-muted">
        Enquiries are informational. No commercial terms are offered or accepted through this form.
      </p>
    </form>
  );
}
