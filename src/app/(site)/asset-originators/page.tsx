import { PageHeader, SectionHeading, Card } from "@/components/ui";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata = {
  title: "Asset Owners & Originators",
  description:
    "Enquiries for owners and originators of industrial-metal assets interested in the proposed ReserveChain verification, registry and tokenization infrastructure.",
};

export default function AssetOriginatorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Enterprise"
        title="Asset Owners & Originators"
        lead="Owners of documented industrial-metal inventory may register interest in the proposed asset-program onboarding process. All programs are subject to due diligence, documentation and acceptance criteria."
        status="Enquiries Open"
      />
      <div className="shell grid gap-12 py-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <SectionHeading eyebrow="Onboarding" title="What Program Onboarding Requires" />
          {[
            ["Documentation", "Ownership and title evidence, laboratory certificates, technical specifications, provenance and photographs."],
            ["Due Diligence", "Purity, ownership, documentation, valuation, storage, marketability and redemption criteria — with acceptance, rejection, pending-review and remediation statuses."],
            ["Verification", "Independent laboratory testing, inspection and documentary verification under the proposed framework."],
            ["Custody", "Approved custody, warehouse and insurance arrangements before any reserve eligibility."],
          ].map(([title, body]) => (
            <Card key={title}>
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
            </Card>
          ))}
        </div>
        <div>
          <SectionHeading eyebrow="Enquiries" title="Asset Originator Enquiry" />
          <EnquiryForm defaultType="asset_originator" />
        </div>
      </div>
    </>
  );
}
