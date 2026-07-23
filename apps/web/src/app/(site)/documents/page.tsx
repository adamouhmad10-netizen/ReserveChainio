export const dynamic = "force-dynamic";

import Image from "next/image";
import { PageHeader, SectionHeading, StatusPill } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";
import { getPublicDocuments } from "@/lib/queries";

export const metadata = {
  title: "Documents & Resources",
  description:
    "ReserveChain documentation centre: document categories, statuses and controlled previews. The institutional whitepaper is in preparation.",
};

const STATUS_LABEL: Record<string, string> = {
  in_preparation: "In Preparation",
  pending_approval: "Pending Approval",
  approved_preview: "Reference Preview",
  published: "Published",
};

export default function DocumentsPage() {
  const docs = getPublicDocuments();
  const categories = [...new Set(docs.map((d) => d.category ?? "Uncategorized"))];

  return (
    <>
      <PageHeader
        eyebrow="Documentation Centre"
        title="Documents & Resources"
        lead="Document categories are managed through the CMS with versioning, approval status and visibility controls. Statuses are shown honestly — no download is offered for documents that do not yet exist."
        status="Whitepaper In Preparation"
        tone="pending"
      />
      <div className="shell space-y-10 py-10">
        <Disclosure compact />

        <section className="rounded-lg border border-line bg-carbon p-6">
          <p className="eyebrow mb-2">Whitepaper Notice</p>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-2">
            “The final ReserveChain whitepaper will be published following completion of the Swiss
            corporate and issuance structure, legal documentation, industrial-asset verification,
            custody and insurance arrangements, reserve reconciliation and technical
            implementation.”
          </p>
        </section>

        {categories.map((cat) => {
          const catDocs = docs.filter((d) => (d.category ?? "Uncategorized") === cat);
          return (
            <section key={cat}>
              <SectionHeading eyebrow="Category" title={cat} />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {catDocs.map((doc) => (
                  <article key={doc.id} className="card flex flex-col overflow-hidden">
                    {doc.file_ref && doc.visibility === "public" ? (
                      <div className="max-h-44 overflow-hidden border-b border-line bg-white">
                        <Image
                          src={doc.file_ref}
                          alt={`Preview of ${doc.title}`}
                          width={640}
                          height={880}
                          className="w-full object-cover object-top"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold leading-snug text-ink">{doc.title}</h3>
                        <StatusPill tone={doc.doc_status === "approved_preview" ? "development" : doc.doc_status === "in_preparation" ? "pending" : "inactive"}>
                          {STATUS_LABEL[doc.doc_status] ?? doc.doc_status}
                        </StatusPill>
                      </div>
                      {doc.notes ? <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{doc.notes}</p> : null}
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted">
                        Visibility: {doc.visibility}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
