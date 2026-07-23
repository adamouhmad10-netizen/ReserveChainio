import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // Staging environments must never be indexed at all.
  if (process.env.RC_ENVIRONMENT === "staging") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Admin, APIs, the evaluator page and inactive modules are non-indexable.
        disallow: ["/admin", "/api/", "/submission", "/maintenance"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  };
}
