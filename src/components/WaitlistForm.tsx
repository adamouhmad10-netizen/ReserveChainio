"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import {
  NO_ENTITLEMENT_ACK_TEXT,
  PRIVACY_ACK_TEXT,
  UPDATES_CONSENT_TEXT,
} from "@/lib/validation";

type Phase = "idle" | "submitting" | "done" | "error";

export function WaitlistForm() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [result, setResult] = useState<{ status: string; duplicate?: boolean } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPhase("submitting");
    setErrors({});
    setGlobalError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      countryOfResidence: form.get("countryOfResidence"),
      interestType: form.get("interestType"),
      isIndustrialBuyer: form.get("isIndustrialBuyer") === "on",
      isAssetOriginator: form.get("isAssetOriginator") === "on",
      materialInterest: form.get("materialInterest"),
      interestRange: form.get("interestRange"),
      participationType: form.get("participationType"),
      consentUpdates: form.get("consentUpdates") === "on",
      privacyAck: form.get("privacyAck") === "on",
      noEntitlementAck: form.get("noEntitlementAck") === "on",
      website: form.get("website") ?? "",
      campaignSource: new URLSearchParams(window.location.search).get("utm_source") ?? undefined,
    };
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setGlobalError(data.error ?? "Registration could not be processed. Please review the form.");
        setPhase("error");
        return;
      }
      setResult(data);
      setPhase("done");
    } catch {
      setGlobalError("A network error occurred. Please try again.");
      setPhase("error");
    }
  }

  if (phase === "done" && result) {
    return (
      <div className="card animate-rise p-6 sm:p-8" role="status">
        <p className="eyebrow mb-3 !text-ok">Registration received</p>
        <h3 className="font-display text-xl font-semibold">
          {result.duplicate ? "This email address is already registered." : "Your registration of interest has been recorded."}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          Status: <span className="font-mono text-xs uppercase">pending email verification</span>.
          Email dispatch requires a transactional email provider, which has not yet been
          contracted — verification messages are generated and stored, and will be sent once the
          provider is configured. This is documented as a third-party dependency.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Registration does not constitute an investment, token purchase, asset reservation, price
          reservation, token allocation or entitlement to participate in any future offering.
        </p>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p className="mt-1 text-xs text-crit" role="alert">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="wl-first">{t("form.firstName")} *</label>
          <input id="wl-first" name="firstName" required maxLength={100} className="field" autoComplete="given-name" />
          {err("firstName")}
        </div>
        <div>
          <label className="field-label" htmlFor="wl-last">{t("form.lastName")} *</label>
          <input id="wl-last" name="lastName" required maxLength={100} className="field" autoComplete="family-name" />
          {err("lastName")}
        </div>
        <div>
          <label className="field-label" htmlFor="wl-email">{t("form.email")} *</label>
          <input id="wl-email" name="email" type="email" required className="field" autoComplete="email" />
          {err("email")}
        </div>
        <div>
          <label className="field-label" htmlFor="wl-country">{t("form.country")} *</label>
          <input id="wl-country" name="countryOfResidence" required maxLength={100} className="field" autoComplete="country-name" />
          {err("countryOfResidence")}
        </div>
        <div>
          <label className="field-label" htmlFor="wl-type">Interest Type *</label>
          <select id="wl-type" name="interestType" required className="field" defaultValue="individual">
            <option value="individual">Individual</option>
            <option value="institutional">Institutional</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="wl-material">Material of Interest *</label>
          <select id="wl-material" name="materialInterest" required className="field" defaultValue="both">
            <option value="copper">Copper Powder</option>
            <option value="nickel">Nickel Wire</option>
            <option value="both">Both</option>
            <option value="future">Future Asset Programs</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="wl-range">Approximate Interest Range</label>
          <select id="wl-range" name="interestRange" className="field" defaultValue="undisclosed">
            <option value="undisclosed">Prefer not to state</option>
            <option value="under_10k">Under 10,000 (USD equivalent)</option>
            <option value="10k_50k">10,000 – 50,000</option>
            <option value="50k_250k">50,000 – 250,000</option>
            <option value="250k_1m">250,000 – 1,000,000</option>
            <option value="over_1m">Over 1,000,000</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="wl-participation">Intended Participation Type</label>
          <select id="wl-participation" name="participationType" className="field" defaultValue="undecided">
            <option value="undecided">Undecided</option>
            <option value="individual_participation">Individual participation</option>
            <option value="institutional_participation">Institutional participation</option>
            <option value="industrial_offtake">Industrial off-take / purchasing</option>
            <option value="asset_origination">Asset origination</option>
            <option value="enterprise_services">Enterprise services</option>
          </select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="field-label">Additional interest</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
          <label className="flex items-center gap-2.5 text-sm text-ink-2">
            <input type="checkbox" name="isIndustrialBuyer" className="h-4 w-4 accent-[#C8A349]" />
            Industrial Buyer
          </label>
          <label className="flex items-center gap-2.5 text-sm text-ink-2">
            <input type="checkbox" name="isAssetOriginator" className="h-4 w-4 accent-[#C8A349]" />
            Asset Owner / Originator
          </label>
        </div>
      </fieldset>

      {/* Honeypot — hidden from real users, catches naive bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="wl-website">Website</label>
        <input id="wl-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="mt-6 space-y-3 border-t border-line pt-5">
        <legend className="sr-only">Consents and acknowledgements</legend>
        {[
          { name: "consentUpdates", text: UPDATES_CONSENT_TEXT },
          { name: "privacyAck", text: PRIVACY_ACK_TEXT },
          { name: "noEntitlementAck", text: NO_ENTITLEMENT_ACK_TEXT },
        ].map((c) => (
          <div key={c.name}>
            <label className="flex items-start gap-3 text-xs leading-relaxed text-ink-2">
              <input type="checkbox" name={c.name} required className="mt-0.5 h-4 w-4 shrink-0 accent-[#C8A349]" />
              {c.text} *
            </label>
            {err(c.name)}
          </div>
        ))}
      </fieldset>

      {globalError ? (
        <p className="mt-4 rounded-md border border-crit/40 bg-crit/10 px-4 py-3 text-sm text-crit" role="alert">
          {globalError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-primary" disabled={phase === "submitting"}>
          {phase === "submitting" ? "Submitting…" : t("form.submit")}
        </button>
        <p className="text-xs text-muted">{t("waitlist.microcopy")}</p>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-muted">
        This form does not collect payment details, wallet addresses or token reservations.
        Consent wording and version are recorded with your registration; you may request
        correction, anonymization or deletion under the Privacy Policy.
      </p>
    </form>
  );
}
