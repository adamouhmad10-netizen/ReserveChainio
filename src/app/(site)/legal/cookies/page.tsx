import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" lead="The prelaunch platform is deliberately minimal in its use of cookies and storage.">
      <h2>1. Cookies and Storage We Use</h2>
      <ul>
        <li><strong className="text-ink">Essential</strong> — an administrative session cookie (rc_admin_session) used only for authorized administrators; a locale preference stored in your browser's localStorage (rc-locale). Neither is used for tracking.</li>
        <li><strong className="text-ink">Analytics</strong> — none are currently loaded. If analytics are introduced, they will load only after explicit consent and will receive no personal data.</li>
        <li><strong className="text-ink">Marketing</strong> — none are used.</li>
      </ul>
      <h2>2. Consent Management</h2>
      <p>
        Because only essential cookies are in use, no consent banner is currently required. The
        platform includes consent-category infrastructure (essential / analytics / marketing) so
        that any future non-essential script is blocked until consent is given, and consent can be
        modified or withdrawn.
      </p>
      <h2>3. Documentation</h2>
      <p>
        Every cookie, tracker and script in production is documented in the platform's operations
        documentation and this policy will be updated before any addition.
      </p>
    </LegalPage>
  );
}
