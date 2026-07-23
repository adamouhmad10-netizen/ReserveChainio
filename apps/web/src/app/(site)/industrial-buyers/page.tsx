import { PageHeader, SectionHeading, Card } from "@/components/ui";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata = {
  title: "Industrial Buyers",
  description:
    "Enquiries for manufacturers, commodity traders and industrial purchasers interested in documented high-purity copper powder and nickel wire programs.",
};

export default function IndustrialBuyersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Enterprise"
        title="Industrial Buyers"
        lead="Manufacturers, commodity traders and industrial purchasers may register interest in the proposed high-purity material programs. No material is currently offered for sale through this website."
        status="Enquiries Open"
      />
      <div className="shell grid gap-12 py-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <SectionHeading eyebrow="Programs" title="Materials Under Development" />
          <Card>
            <h3 className="font-display text-base font-semibold text-copper-light">Ultra-High-Purity Copper Powder</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              Proposed specification 99.9999%. Owner-supplied IGAS research Certificate of Analysis
              No. 0004512 registered as a reference document. Quantities, pricing and availability
              remain pending.
            </p>
          </Card>
          <Card>
            <h3 className="font-display text-base font-semibold text-nickel">High-Purity Nickel Wire</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              Proposed specification 99.9807%, 0.025 mm diameter per the owner-supplied IGAS
              research Certificate of Analysis No. 0004368. Quantities, pricing and availability
              remain pending.
            </p>
          </Card>
          <p className="text-xs leading-relaxed text-muted">
            Preliminary illustrative information only — subject to documentary verification,
            independent assessment and final approval. No asset or token is currently offered for
            sale through this website.
          </p>
        </div>
        <div>
          <SectionHeading eyebrow="Enquiries" title="Industrial Buyer Enquiry" />
          <EnquiryForm defaultType="industrial_buyer" />
        </div>
      </div>
    </>
  );
}
