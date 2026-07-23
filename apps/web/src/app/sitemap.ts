import type { MetadataRoute } from "next";

const ROUTES = [
  "", "/project-overview", "/how-it-works",
  "/industrial-metal-assets", "/industrial-metal-assets/copper-powder", "/industrial-metal-assets/nickel-wire",
  "/asset-registry", "/digital-asset-passports",
  "/digital-asset-passports/illustrative-copper", "/digital-asset-passports/illustrative-nickel",
  "/verification", "/custody", "/proof-of-reserves", "/tokenization", "/redemption",
  "/enterprise-services", "/asset-originators", "/industrial-buyers",
  "/documents", "/roadmap", "/governance", "/corporate-development-status",
  "/about", "/faq", "/contact", "/waitlist", "/official-channels",
  "/legal/privacy", "/legal/cookies", "/legal/terms", "/legal/risk-disclosure",
  "/legal/restricted-jurisdictions", "/legal/anti-fraud",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${site}${r}`,
    lastModified: now,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.6,
  }));
}
