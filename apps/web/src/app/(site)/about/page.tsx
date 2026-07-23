import Image from "next/image";
import { PageHeader, SectionHeading, Card, KV, StatusPill, CtaLink } from "@/components/ui";

export const metadata = {
  title: "About ReserveChain",
  description:
    "ReserveChain is a Swiss pre-incorporation stage project building institutional infrastructure for tokenized industrial metals.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Project"
        title="About ReserveChain"
        lead="ReserveChain — The Infrastructure for Real-World Assets. A Swiss pre-incorporation stage project building the documentary, custody, registry and tokenization infrastructure required to connect industrial metals with controlled digital ownership records."
        status="Swiss Structure In Development"
        tone="warn"
      />
      <div className="shell space-y-12 py-10">
        <section className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
          <figure className="card flex items-center justify-center bg-carbon p-8">
            <Image
              src="/brand/reservechain-logo-full.webp"
              alt="ReserveChain.io — The Infrastructure for Real-World Assets"
              width={520}
              height={380}
              className="w-full max-w-md"
            />
          </figure>
          <div className="space-y-4 text-sm leading-relaxed text-ink-2">
            <p>
              ReserveChain is being developed as institutional infrastructure — not as a
              speculative cryptocurrency. The project's premise is that tokenized real-world assets
              are only as credible as the documentary evidence, custody arrangements and
              reconciliation discipline behind them.
            </p>
            <p>
              The initial focus is two industrial-metal programs: ultra-high-purity copper powder
              (proposed specification 99.9999%) and high-purity nickel wire (proposed specification
              99.9807%), each supported by an owner-supplied IGAS research Certificate of Analysis
              registered as a reference document.
            </p>
            <p>
              The corporate, legal, custody, asset-verification and technical arrangements are
              currently being finalized in Switzerland. Until they are complete, this website
              operates strictly as a prelaunch information platform.
            </p>
          </div>
        </section>
        <section>
          <SectionHeading eyebrow="Facts" title="Project Facts" />
          <Card className="max-w-2xl">
            <dl>
              <KV label="Project name" value="ReserveChain.io" />
              <KV label="Stage" value="Swiss pre-incorporation / prelaunch" />
              <KV label="Corporate registration" value={<StatusPill tone="pending">Pending — in development</StatusPill>} />
              <KV label="Team profiles" value={<StatusPill tone="pending">Pending owner approval for publication</StatusPill>} />
              <KV label="Partners" value={<StatusPill tone="pending">None announced — nothing is claimed</StatusPill>} />
              <KV label="Official channels" value="See the Official Channels directory" />
            </dl>
          </Card>
        </section>
        <div className="flex flex-wrap gap-3">
          <CtaLink href="/official-channels" variant="secondary">Official Channels</CtaLink>
          <CtaLink href="/contact" variant="ghost">Contact →</CtaLink>
        </div>
      </div>
    </>
  );
}
