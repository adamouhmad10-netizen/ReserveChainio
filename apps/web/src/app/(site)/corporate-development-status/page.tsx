import { PageHeader, StatusPill } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";

export const metadata = {
  title: "Corporate Development Status",
  description:
    "Current status of the ReserveChain Swiss corporate and issuance structure and the principal project workstreams.",
};

const WORKSTREAMS: [string, string, "development" | "pending" | "ok" | "inactive"][] = [
  ["Swiss corporate and issuance structure", "In development", "development"],
  ["Issuer and asset-holding structure", "Pending", "pending"],
  ["Token legal classification", "Pending legal review", "pending"],
  ["Prelaunch information platform", "Operational (this website)", "ok"],
  ["Industrial Metals Registry & Digital Asset Passports", "Implemented — illustrative records", "ok"],
  ["Laboratory documentation", "Owner-supplied references registered; publication approval pending", "development"],
  ["Ownership & title documentation", "Pending owner input", "pending"],
  ["Custody, warehouse & insurance", "Pending selection", "pending"],
  ["Independent valuation", "Pending appointment", "pending"],
  ["ERC-20 contract architecture", "Drafted with automated tests; no deployment", "development"],
  ["KYC/KYB & sanctions integration", "Provider-agnostic architecture prepared; provider pending", "development"],
  ["Proof of Reserves", "Module prepared; reporting inactive", "inactive"],
  ["Physical redemption", "Architecture prepared; inactive", "inactive"],
  ["Mobile applications", "Source foundation prepared; store distribution pending", "development"],
  ["Institutional whitepaper", "Stage 1 draft in preparation", "pending"],
];

export default function CorporateStatusPage() {
  return (
    <>
      <PageHeader
        eyebrow="Transparency"
        title="Corporate Development Status"
        lead="An honest, regularly updated statement of where the project stands. Nothing on this page is a commitment to a date or an outcome."
        status="Prelaunch"
        tone="warn"
      />
      <div className="shell space-y-8 py-10">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Workstream</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {WORKSTREAMS.map(([w, s, tone]) => (
                <tr key={w}>
                  <td className="font-medium text-ink">{w}</td>
                  <td><StatusPill tone={tone}>{s}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Disclosure compact />
      </div>
    </>
  );
}
