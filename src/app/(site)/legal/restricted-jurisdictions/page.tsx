export const dynamic = "force-dynamic";

import { LegalPage } from "@/components/LegalPage";
import { StatusPill } from "@/components/ui";
import { getJurisdictions } from "@/lib/queries";

export const metadata = { title: "Restricted Jurisdictions" };

export default function RestrictedJurisdictionsPage() {
  const rules = getJurisdictions();
  const restricted = rules.filter((r) => r.classification === "restricted");
  const pending = rules.filter((r) => r.classification === "pending_legal_review");
  return (
    <LegalPage
      title="Restricted Jurisdictions"
      lead="ReserveChain currently does not intend to offer or sell tokens to residents or persons located in the European Union or European Economic Area. Final restrictions remain subject to legal approval."
    >
      <h2>1. Current Position</h2>
      <p>
        Based on current project instructions, the EU/EEA is not an intended market. ReserveChain
        does not describe itself as MiCA-compliant. The jurisdictions listed below are maintained
        as configurable platform rules — the project owners and their legal advisers determine the
        final lists.
      </p>
      <h2>2. Currently Restricted (Provisional)</h2>
      <div className="flex flex-wrap gap-2">
        {restricted.map((r) => (
          <span key={r.country_code} className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-ink-2">
            {r.country_code} — {r.country_name}
          </span>
        ))}
      </div>
      <h2>3. Pending Legal Review</h2>
      <div className="flex flex-wrap items-center gap-2">
        {pending.map((r) => (
          <span key={r.country_code} className="rounded-md border border-warn/40 bg-warn/10 px-2.5 py-1 font-mono text-xs text-warn">
            {r.country_code} — {r.country_name}
          </span>
        ))}
        <StatusPill tone="pending">All other jurisdictions: pending legal review</StatusPill>
      </div>
      <h2>4. Anti-Circumvention</h2>
      <p>
        The platform architecture supports country-of-residence verification, nationality capture
        where legally required, current-location declarations, and the prevention of participation
        through nominees, intermediaries or third parties seeking to bypass restrictions.
        Eligibility decisions will be recorded with a complete audit history.
      </p>
    </LegalPage>
  );
}
