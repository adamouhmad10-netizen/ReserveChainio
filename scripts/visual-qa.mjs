// Responsive visual QA: loads every public route at each required breakpoint,
// detects horizontal overflow and reports the specific offending elements.
// Usage: node scripts/visual-qa.mjs [baseUrl] [--shots]

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3000";
const SHOTS = process.argv.includes("--shots");
const SHOT_DIR = "/private/tmp/claude-501/-Users-adamouhmad-Documents-freelnacer-ReserveChain-io/1da59c85-8cd7-4bf1-ad61-49c3a931b1a5/scratchpad/shots";

const BREAKPOINTS = [
  { w: 1920, h: 1080, name: "1920" },
  { w: 1440, h: 900, name: "1440" },
  { w: 1280, h: 800, name: "1280" },
  { w: 1024, h: 768, name: "1024" },
  { w: 768, h: 1024, name: "768" },
  { w: 430, h: 932, name: "430" },
  { w: 390, h: 844, name: "390" },
  { w: 360, h: 800, name: "360" },
];

const ROUTES = [
  "/", "/project-overview", "/how-it-works",
  "/industrial-metal-assets", "/industrial-metal-assets/copper-powder", "/industrial-metal-assets/nickel-wire",
  "/asset-registry", "/digital-asset-passports",
  "/digital-asset-passports/illustrative-copper", "/digital-asset-passports/illustrative-nickel",
  "/verification", "/custody", "/proof-of-reserves", "/tokenization", "/redemption",
  "/enterprise-services", "/asset-originators", "/industrial-buyers",
  "/documents", "/roadmap", "/governance", "/corporate-development-status",
  "/about", "/faq", "/contact", "/waitlist", "/official-channels",
  "/legal/privacy", "/legal/terms", "/legal/risk-disclosure",
  "/legal/restricted-jurisdictions", "/legal/anti-fraud",
];

// Elements inside an intentional horizontal-scroll container are legitimate.
const overflowProbe = () => {
  const docW = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth <= docW + 1) return [];
  const bad = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right <= docW + 1 && r.left >= -1) continue;
    // Ignore anything inside a deliberate overflow-x container.
    let p = el.parentElement, scoped = false;
    while (p) {
      const ov = getComputedStyle(p).overflowX;
      if (ov === "auto" || ov === "scroll" || ov === "hidden") { scoped = true; break; }
      p = p.parentElement;
    }
    if (scoped) continue;
    bad.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className?.toString?.() ?? "").slice(0, 90),
      text: (el.textContent ?? "").trim().slice(0, 50),
      left: Math.round(r.left),
      right: Math.round(r.right),
    });
  }
  // Report only the outermost offenders.
  return bad.slice(0, 6);
};

const browser = await chromium.launch();
if (SHOTS) mkdirSync(SHOT_DIR, { recursive: true });

let issues = 0;
let checks = 0;

for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({ viewport: { width: bp.w, height: bp.h } });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    checks++;
    // "load", not "networkidle": the dev server keeps an HMR websocket open,
    // so the network never goes idle.
    const res = await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(250);
    if (!res || res.status() !== 200) {
      console.log(`✗ HTTP ${res?.status()} ${route} @${bp.name}`);
      issues++;
      continue;
    }
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientW = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollW > clientW + 1) {
      const offenders = await page.evaluate(overflowProbe);
      console.log(`✗ OVERFLOW ${route} @${bp.name}px  (scrollWidth ${scrollW} > ${clientW})`);
      for (const o of offenders) {
        console.log(`    <${o.tag}> [${o.left}…${o.right}] .${o.cls}  "${o.text}"`);
      }
      issues++;
    }
    if (SHOTS && ["/", "/industrial-metal-assets/copper-powder", "/digital-asset-passports/illustrative-copper"].includes(route)) {
      const slug = route === "/" ? "home" : route.split("/").pop();
      await page.screenshot({ path: `${SHOT_DIR}/${slug}-${bp.name}.png`, fullPage: false });
    }
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${checks} checks across ${BREAKPOINTS.length} breakpoints — ${issues} issue(s).`);
process.exit(issues > 0 ? 1 : 0);
