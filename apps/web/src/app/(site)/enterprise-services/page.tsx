import { PageHeader, SectionHeading, Card } from "@/components/ui";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata = {
  title: "Enterprise Tokenization Services",
  description:
    "Planned enterprise services: asset-program infrastructure, Digital Asset Passport technology, registry, tokenization and reserve-reporting architecture, enterprise portals and white-label infrastructure.",
};

export default function EnterpriseServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Enterprise"
        title="Enterprise Tokenization Services"
        lead="ReserveChain intends to make its infrastructure available to asset owners, producers, commodity companies, industrial buyers, institutional participants and professional providers. Service terms are planned and subject to final commercial and legal structure."
        status="Planned"
      />
      <div className="shell grid gap-12 py-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-8">
          <section className="grid gap-4 sm:grid-cols-2">
            {[
              ["Asset-Program Infrastructure", "Structured onboarding, due-diligence workflow, acceptance statuses and lifecycle management for approved real-world asset programs."],
              ["Digital Asset Passport Technology", "Unit-level documentation records connecting material, laboratory, ownership, custody, valuation and reserve evidence."],
              ["Registry Infrastructure", "Auditable multi-asset registry with versioning, publication control and permission-aware data access."],
              ["Tokenization Architecture", "Configurable, compliance-gated ERC-20 token-series design with issuer-controlled governance."],
              ["Reserve Reporting Architecture", "Reconciliation, attestation and exception-reporting infrastructure for asset-backed programs."],
              ["Enterprise Portals & White-Label", "Planned portals for originators and institutional clients; planned licensing of the platform architecture for approved issuers."],
            ].map(([title, body]) => (
              <Card key={title}>
                <h3 className="font-display text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
              </Card>
            ))}
          </section>
        </div>
        <div>
          <SectionHeading eyebrow="Enquiries" title="Request Enterprise Information" lead="Enquiries are recorded and reviewed by the project team. No commercial terms are offered or accepted through this form." />
          <EnquiryForm defaultType="enterprise" />
        </div>
      </div>
    </>
  );
}
