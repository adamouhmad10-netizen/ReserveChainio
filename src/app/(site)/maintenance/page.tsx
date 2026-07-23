export const metadata = {
  title: "Scheduled Maintenance",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-warn">Maintenance Mode</p>
        <h1 className="h-display mt-4 text-3xl">Scheduled Maintenance</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          The platform is undergoing scheduled maintenance. Registry data, waitlist registrations
          and audit records are unaffected. This state is a demonstration of the maintenance
          template used when a maintenance window is activated by an administrator.
        </p>
      </div>
    </div>
  );
}
