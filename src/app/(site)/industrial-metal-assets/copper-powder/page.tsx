export const dynamic = "force-dynamic";

import { ProgramPage } from "@/components/ProgramPage";

export const metadata = {
  title: "Ultra-High-Purity Copper Powder Program — Proposed 99.9999%",
  description:
    "Proposed ReserveChain asset program for ultra-high-purity copper powder (proposed specification 99.9999%). Program in development; all ownership, custody, valuation and reserve information pending verification.",
};

export default function CopperPowderPage() {
  return (
    <ProgramPage
      slug="copper-powder"
      accent="copper"
      labImage="/lab/igas-copper-0004512.webp"
      labCaption="IGAS research Certificate of Analysis No. 0004512 (04.07.2022) — Ultrafine Copper Powder, Lot #03-K-07, measured by ICP/OES"
    />
  );
}
