"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-crit">Application Error</p>
        <h1 className="h-display mt-4 text-3xl">Something Went Wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          The error has been logged. No registration or record data is affected. Please try again;
          if the problem persists, use the contact form.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <a href="/" className="btn-secondary">Homepage</a>
        </div>
      </div>
    </div>
  );
}
