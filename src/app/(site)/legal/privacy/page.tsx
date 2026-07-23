import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lead="How the prelaunch platform processes personal data.">
      <h2>1. Data Controller</h2>
      <p>
        The data controller will be the ReserveChain Swiss entity currently in formation. Until
        incorporation completes, data is processed by the project founders for the prelaunch
        purposes described below. Controller identity and contact details will be updated upon
        incorporation.
      </p>
      <h2>2. Data We Collect</h2>
      <ul>
        <li>Waitlist registrations: name, email address, country of residence, interest categories, approximate interest range, participation type.</li>
        <li>Enquiries: contact name, organization, email, country and the enquiry text.</li>
        <li>Consent records: the consent type, exact consent wording version and a cryptographic hash of the wording, timestamp and a hashed IP address.</li>
        <li>Technical logs required for security (rate limiting, abuse prevention).</li>
      </ul>
      <h2>3. What We Do Not Collect</h2>
      <ul>
        <li>No payment or card details.</li>
        <li>No wallet addresses or private keys.</li>
        <li>No identity documents (KYC is not active during prelaunch).</li>
        <li>No personal data is sent to analytics providers; no non-essential trackers load before consent.</li>
      </ul>
      <h2>4. Purposes and Legal Basis</h2>
      <p>
        Data is processed to operate the waitlist and enquiry handling, on the basis of your
        consent and our legitimate interest in operating a secure prelaunch platform. Consent may
        be withdrawn at any time.
      </p>
      <h2>5. Retention, Correction and Deletion</h2>
      <p>
        Registrations are retained while the project remains in development or until you request
        deletion. You may request access, correction, anonymization or deletion of your data;
        anonymization and deletion workflows are built into the platform's administration tools.
      </p>
      <h2>6. Sharing</h2>
      <p>
        Data is not sold. It may be shared with professional advisers and, once contracted,
        transactional email providers strictly for the purposes above. Any such provider will be
        documented in the third-party register.
      </p>
    </LegalPage>
  );
}
