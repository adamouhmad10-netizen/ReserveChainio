import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Risk Disclosure" };

export default function RiskPage() {
  return (
    <LegalPage title="Risk Disclosure" lead="Any future participation in a ReserveChain offering would involve significant risk, including total loss.">
      <h2>1. Prelaunch Risk</h2>
      <p>
        The project is at a prelaunch stage. The corporate structure, legal classification, asset
        verification, custody, insurance, tokenomics and offering terms are incomplete. The project
        may change materially, be delayed indefinitely or not proceed at all.
      </p>
      <h2>2. Corporate and Legal Dependency</h2>
      <p>
        Completion depends on the Swiss corporate and issuance structure, legal opinions and
        definitive offering documentation, none of which exist yet.
      </p>
      <h2>3. Asset Verification Dependency</h2>
      <p>
        Laboratory certificates supplied to date are reference documents. Current ownership,
        quantities, condition and valuations of any industrial metal remain subject to documentary
        verification and independent assessment.
      </p>
      <h2>4. Custody and Insurance Dependency</h2>
      <p>
        No custodian, warehouse or insurer has been contracted. Physical metals involve storage,
        handling, deterioration, theft and loss risks.
      </p>
      <h2>5. Smart Contract and Cybersecurity Risk</h2>
      <p>
        Smart contracts can contain defects; blockchain infrastructure and web platforms can be
        attacked. Independent audit reduces but does not eliminate this risk.
      </p>
      <h2>6. Regulatory and Jurisdictional Risk</h2>
      <p>
        The legal treatment of asset-backed tokens varies by jurisdiction and may change.
        Participation will be restricted by jurisdiction; current instructions exclude the EU/EEA.
      </p>
      <h2>7. Liquidity Risk</h2>
      <p>
        No secondary market, listing or liquidity is promised. Any future token may be illiquid or
        untransferable.
      </p>
      <h2>8. Redemption and Logistics Risk</h2>
      <p>
        Physical redemption, if activated, depends on custody release, logistics, customs and
        minimum-unit constraints, and may involve fees, taxes and delays.
      </p>
      <h2>9. Third-Party Dependency Risk</h2>
      <p>
        The project depends on laboratories, custodians, insurers, auditors, KYC providers,
        exchanges and app stores whose decisions are outside the project's control and are never
        guaranteed.
      </p>
    </LegalPage>
  );
}
