import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" lead="Terms governing use of this prelaunch information platform.">
      <h2>1. Nature of This Website</h2>
      <p>
        This website is a prelaunch information platform. It does not offer, sell or solicit the
        purchase of any token, security, commodity or other instrument. Nothing on this website
        constitutes investment, legal, tax or accounting advice.
      </p>
      <h2>2. No Offer, No Reliance</h2>
      <p>
        All descriptions of verification, custody, proof of reserves, tokenization, trading and
        redemption describe a proposed framework that remains subject to final legal, contractual,
        technical and operational confirmation. Information labelled proposed, planned, pending or
        illustrative must not be relied upon as a statement of current fact.
      </p>
      <h2>3. Registration of Interest</h2>
      <p>
        Waitlist registration does not create any investment, purchase, reservation, allocation,
        priority or entitlement, and creates no obligation on ReserveChain to proceed with any
        offering.
      </p>
      <h2>4. Intellectual Property</h2>
      <p>
        The ReserveChain name, logo and platform content are the property of the project owners.
        Owner-supplied laboratory documents are displayed as reference material and may not be
        reused or republished.
      </p>
      <h2>5. Acceptable Use</h2>
      <p>
        You may not attempt to gain unauthorized access to administrative areas, interfere with the
        platform's operation, or use the platform to impersonate ReserveChain.
      </p>
      <h2>6. Liability</h2>
      <p>
        To the maximum extent permitted by law, the platform is provided "as is" during the
        prelaunch stage without warranties of any kind.
      </p>
      <h2>7. Governing Law</h2>
      <p>
        Governing law and jurisdiction clauses will be finalized with the Swiss corporate
        structure and are pending legal review.
      </p>
    </LegalPage>
  );
}
