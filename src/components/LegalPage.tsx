import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui";

// Shared shell for legal pages. Every legal text carries the professional
// legal review notice — wording is provisional until approved by counsel.
export function LegalPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={title}
        lead={lead}
        status="Subject to Professional Legal Review"
        tone="pending"
      />
      <div className="shell py-10">
        <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-ink-2 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
          <p className="mt-10 rounded-md border border-warn/30 bg-warn/5 px-4 py-3 text-xs text-muted">
            This document is a provisional draft prepared for the prelaunch information platform.
            Final public wording remains subject to professional legal review and owner approval.
          </p>
        </div>
      </div>
    </>
  );
}
