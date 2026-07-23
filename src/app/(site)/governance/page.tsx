import { PageHeader, SectionHeading, Card, KV, StatusPill } from "@/components/ui";

export const metadata = {
  title: "Governance",
  description:
    "Proposed governance: issuer-controlled multisig administration, maker-checker approvals, publication workflow, append-only audit trail and separation of duties.",
};

export default function GovernancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Project"
        title="Governance"
        lead="Governance is designed around separation of duties, dual approval for sensitive actions and tamper-evident records. Final corporate governance follows the Swiss structure now in development."
        status="Proposed Framework"
      />
      <div className="shell space-y-8 py-10">
        <section className="grid gap-4 md:grid-cols-2">
          {[
            ["Issuer-Controlled Multisig", "All privileged contract roles are designed for issuer-controlled multisig wallets with documented signer thresholds, replacement and compromise procedures. The developer retains no keys or privileged roles after handover."],
            ["Maker-Checker Approvals", "Sensitive administrative actions — publication of material claims, commercial configuration, token administration — require dual approval."],
            ["Publication Workflow", "Draft → Under Review → Approved → Published, plus Unpublished and Archived. Draft and under-review content is never publicly accessible or indexed."],
            ["Append-Only Audit Trail", "Every administrative action is recorded in an append-only, hash-chained audit trail that cannot be edited, deleted or reordered through the administrative interface — enforced at the database layer."],
            ["Separation of Duties", "Distinct roles for operations, compliance, finance, treasury, support, content editing, review and audit. No shared credentials."],
            ["Transparent Privileged Roles", "A privileged-role matrix documents every administrative capability across the platform and contracts. No undocumented access."],
          ].map(([title, body]) => (
            <Card key={title}>
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
            </Card>
          ))}
        </section>
        <Card className="max-w-2xl">
          <SectionHeading eyebrow="Status" title="Corporate Governance Status" />
          <dl>
            <KV label="Swiss entity" value={<StatusPill tone="pending">In development</StatusPill>} />
            <KV label="Directors & signatories" value={<StatusPill tone="pending">Pending</StatusPill>} />
            <KV label="Issuer / asset-holding structure" value={<StatusPill tone="pending">Pending</StatusPill>} />
            <KV label="Platform governance controls" value={<StatusPill tone="ok">Implemented (demo)</StatusPill>} />
          </dl>
        </Card>
      </div>
    </>
  );
}
