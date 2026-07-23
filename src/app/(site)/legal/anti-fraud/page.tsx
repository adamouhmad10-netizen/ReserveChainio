import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Anti-Fraud and Anti-Impersonation Notice" };

export default function AntiFraudPage() {
  return (
    <LegalPage
      title="Anti-Fraud and Anti-Impersonation Notice"
      lead="Protect yourself: during the prelaunch stage there is nothing to buy, and anyone selling 'ReserveChain tokens' is committing fraud."
    >
      <h2>1. Current Facts</h2>
      <ul>
        <li>No public token sale is active.</li>
        <li>No token exists and no token contract has been deployed or published.</li>
        <li>The waitlist does not collect payment of any kind.</li>
        <li>The waitlist does not request wallet addresses, seed phrases or private keys.</li>
        <li>No presale, discount round or "early allocation" exists.</li>
      </ul>
      <h2>2. How Impersonation Scams Work</h2>
      <p>
        Fraudulent actors clone prelaunch project websites, create fake Telegram groups, publish
        fake contract addresses and pressure victims with countdowns and scarcity claims.
        ReserveChain uses none of these mechanics.
      </p>
      <h2>3. How to Verify</h2>
      <ul>
        <li>Rely exclusively on the <Link className="text-gold" href="/official-channels">Official Channels Directory</Link>.</li>
        <li>Treat any contract address as fraudulent until it appears in the directory.</li>
        <li>Never share seed phrases or private keys with anyone, including anyone claiming to represent ReserveChain.</li>
        <li>Report suspected impersonation through the <Link className="text-gold" href="/contact">contact form</Link>.</li>
      </ul>
    </LegalPage>
  );
}
