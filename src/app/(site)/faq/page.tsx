import { PageHeader } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Direct answers about the ReserveChain prelaunch stage, waitlist, reserves, redemption and jurisdictions.",
};

const FAQ: [string, string][] = [
  ["Are tokens currently being sold?", "No. No tokens are being offered or sold through this website, and no token exists. Any future availability will be subject to the final Swiss corporate and legal structure, definitive offering documentation, asset verification, custody arrangements, jurisdictional eligibility, KYC/KYB, sanctions screening and final approval."],
  ["Does waitlist registration reserve tokens?", "No. Registration of interest does not constitute an investment, token purchase, asset reservation, price reservation, token allocation or entitlement to participate in any future offering."],
  ["Is Proof of Reserves currently active?", "No. The Proof-of-Reserves module is prepared, but public reserve reporting is inactive pending approved asset, custody, token-supply and attestation data. No coverage figures are displayed because none are supported by approved data."],
  ["Is physical redemption active?", "No. The redemption framework is proposed and inactive. Activation requires final legal terms, confirmed custody arrangements, token issuance and written authorization."],
  ["Is ReserveChain MiCA compliant?", "ReserveChain does not claim MiCA compliance and does not design its public communications around MiCA marketing claims."],
  ["Are EU/EEA residents currently intended participants?", "No. Based on current project instructions, ReserveChain does not intend to offer or sell tokens to residents or persons located in the European Union or European Economic Area. Final jurisdiction rules remain subject to legal approval."],
  ["What is a Digital Asset Passport?", "A structured digital record intended to connect a specific physical lot, batch, container or coil with its laboratory, ownership, valuation, custody, reserve and lifecycle documentation, with versioning and a complete event history. Two illustrative templates are published; they represent no verified material."],
  ["What do the IGAS certificates prove?", "They are owner-supplied Certificates of Analysis registered as reference documents. Their presence does not by itself prove current ownership, custody, reserve status, insurance, valuation, token backing, sale availability or redemption availability. Publication and current verification status remain subject to approval."],
  ["Is there a token price, supply or presale?", "No. Tokenomics, supply, pricing and any participation terms remain pending and configurable. No presale exists, and no countdown, discount or scarcity mechanic will be used to suggest otherwise."],
  ["Who has verified this project?", "No external audit, regulatory approval or third-party verification is claimed. The project publishes only what its documentation supports, and labels everything else as pending."],
];

export default function FaqPage() {
  return (
    <>
      <PageHeader eyebrow="Support" title="Frequently Asked Questions" lead="Direct answers, stated plainly." />
      <div className="shell space-y-8 py-10">
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card group p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
                <span className="flex items-center justify-between gap-3">
                  {q}
                  <span aria-hidden className="text-muted transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{a}</p>
            </details>
          ))}
        </div>
        <div className="mx-auto max-w-3xl">
          <Disclosure compact />
        </div>
      </div>
    </>
  );
}
