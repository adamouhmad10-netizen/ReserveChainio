import { PageHeader, SectionHeading, Card, KV, StatusPill } from "@/components/ui";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata = {
  title: "Contact",
  description: "Contact the ReserveChain project team. General, enterprise, asset-originator and industrial-buyer enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Contact"
        lead="Enquiries are recorded through the platform and reviewed by the project team. Official contact addresses will be published in the Official Channels directory once approved."
      />
      <div className="shell grid gap-12 py-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <Card>
            <SectionHeading eyebrow="Channels" title="Official Contact Information" />
            <dl>
              <KV label="Contact form" value={<StatusPill tone="ok">Operational (this page)</StatusPill>} />
              <KV label="Official email addresses" value={<StatusPill tone="pending">Pending owner setup</StatusPill>} />
              <KV label="Registered office" value={<StatusPill tone="pending">Pending Swiss incorporation</StatusPill>} />
              <KV label="Social channels" value={<StatusPill tone="pending">Pending — see Official Channels</StatusPill>} />
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              No placeholder telephone numbers or addresses are displayed. Treat any contact detail
              not listed in the Official Channels directory as unofficial.
            </p>
          </Card>
        </div>
        <div>
          <SectionHeading eyebrow="Form" title="Send an Enquiry" />
          <EnquiryForm defaultType="general" />
        </div>
      </div>
    </>
  );
}
