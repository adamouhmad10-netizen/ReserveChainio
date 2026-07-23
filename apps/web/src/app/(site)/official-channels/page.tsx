import { PageHeader, StatusPill, CtaLink } from "@/components/ui";

export const metadata = {
  title: "Official Channels Directory",
  description:
    "The authoritative directory of official ReserveChain channels. Anything not listed here should be treated as unofficial.",
};

const CHANNELS: [string, string, string][] = [
  ["Website", "reservechain.io", "This platform — production domain configuration pending deployment"],
  ["Email", "Pending owner setup", "Official addresses will be listed here before any external communication"],
  ["X / Twitter", "Not yet established", "Will be listed here when created under owner control"],
  ["LinkedIn", "Not yet established", "Will be listed here when created under owner control"],
  ["Telegram", "Not yet established", "No official group exists — treat any current group as unofficial"],
  ["Smart contract address", "None exists", "No token contract has been deployed or published"],
];

export default function OfficialChannelsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Anti-Impersonation"
        title="Official Channels Directory"
        lead="This directory is the single source of truth for official ReserveChain channels. Anything not listed here — including any Telegram group, token contract or presale site — should be treated as unofficial and potentially fraudulent."
        status="Authoritative Directory"
        tone="gold"
      />
      <div className="shell space-y-8 py-10">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>Channel</th><th>Address / Handle</th><th>Note</th></tr>
            </thead>
            <tbody>
              {CHANNELS.map(([c, a, n]) => (
                <tr key={c}>
                  <td className="font-medium text-ink">{c}</td>
                  <td>
                    {a.includes("Pending") || a.includes("Not yet") || a.includes("None") ? (
                      <StatusPill tone="pending">{a}</StatusPill>
                    ) : (
                      <span className="font-mono text-xs">{a}</span>
                    )}
                  </td>
                  <td className="text-xs text-muted">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CtaLink href="/legal/anti-fraud" variant="secondary">Anti-Fraud and Anti-Impersonation Notice</CtaLink>
      </div>
    </>
  );
}
