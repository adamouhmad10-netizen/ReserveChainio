"use client";

import { useI18n } from "@/lib/i18n";

// The mandatory no-offer disclosure. Placed prominently (not only in the
// footer) on the homepage, both asset-program pages, tokenization, passports,
// documents, waitlist and relevant portal screens.
export function Disclosure({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <aside
      aria-label={t("disclosure.title")}
      className={`rounded-lg border border-warn/30 bg-warn/5 ${compact ? "p-4" : "p-5 sm:p-6"}`}
    >
      <p className="eyebrow mb-2 !text-warn">{t("disclosure.title")}</p>
      <p className={`leading-relaxed text-ink-2 ${compact ? "text-xs" : "text-sm"}`}>“{t("disclosure.body")}”</p>
      <p className="mt-2 text-xs italic text-muted">“{t("disclosure.legalReview")}”</p>
    </aside>
  );
}
