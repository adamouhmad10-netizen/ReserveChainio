import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">Error 404</p>
        <h1 className="h-display mt-4 text-3xl">Record Not Found</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          The requested page does not exist in the registry, or has not been published. Draft and
          under-review content is never publicly accessible.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Return to the homepage</Link>
          <Link href="/asset-registry" className="btn-secondary">Open the registry</Link>
        </div>
      </div>
    </div>
  );
}
