export const dynamic = "force-dynamic";

import { ProgramPage } from "@/components/ProgramPage";

export const metadata = {
  title: "High-Purity Nickel Wire Program — Proposed 99.9807%",
  description:
    "Proposed ReserveChain asset program for high-purity nickel wire (proposed specification 99.9807%). Program in development; all ownership, custody, valuation and reserve information pending verification.",
};

export default function NickelWirePage() {
  return (
    <ProgramPage
      slug="nickel-wire"
      accent="nickel"
      labImage="/lab/igas-nickel-0004368.webp"
      labCaption="IGAS research Certificate of Analysis No. 0004368 (19.10.2021) — Nickel wire 0.025 mm dia, DKRNT NP1, Lot “120/NP1”, measured by ICP/MS and ICP/OES"
    />
  );
}
