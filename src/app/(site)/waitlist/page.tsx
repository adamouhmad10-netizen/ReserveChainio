import { PageHeader } from "@/components/ui";
import { Disclosure } from "@/components/Disclosure";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata = {
  title: "Join the Project Waitlist",
  description:
    "Register interest in the ReserveChain project. Registration does not constitute an investment, token purchase, asset reservation, allocation or entitlement.",
};

export default function WaitlistPage({ searchParams }: { searchParams: { verified?: string } }) {
  return (
    <>
      <PageHeader
        eyebrow="Registration of Interest"
        title="Join the Project Waitlist"
        lead="Receive project-development updates and future eligibility information. Registration does not constitute an investment, token purchase or reservation of industrial metals."
        status="No Offering Active"
        tone="warn"
      />
      <div className="shell grid gap-10 py-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          {searchParams.verified === "1" ? (
            <div className="rounded-lg border border-ok/40 bg-ok/10 p-5" role="status">
              <p className="text-sm font-semibold text-ok">Email address verified.</p>
              <p className="mt-1 text-sm text-ink-2">Your registration is now confirmed.</p>
            </div>
          ) : null}
          <Disclosure />
          <div className="card p-5">
            <p className="eyebrow mb-3">What this form does not do</p>
            <ul className="space-y-2 text-sm text-ink-2">
              {[
                "No payment or credit-card details are collected.",
                "No USDT or cryptocurrency is accepted.",
                "No wallet address is requested.",
                "No token reservation or allocation is created.",
                "No investment entitlement of any kind arises.",
              ].map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crit" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <WaitlistForm />
      </div>
    </>
  );
}
