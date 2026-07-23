import { chromium } from "playwright";
const b = await chromium.launch();
for (const [url, w] of [["/industrial-metal-assets/copper-powder",390],["/digital-asset-passports/illustrative-copper",360],["/custody",360],["/",360]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000"+url, { waitUntil: "load", timeout: 60000 });
  await p.waitForTimeout(300);
  const out = await p.evaluate((docW) => {
    const res = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right <= docW + 1) continue;
      if (el.children.length && [...el.children].some(c => c.getBoundingClientRect().right > docW + 1)) continue; // keep only deepest
      res.push({ tag: el.tagName.toLowerCase(), cls: (el.className?.toString?.()??"").slice(0,80), w: Math.round(r.width), right: Math.round(r.right), txt: (el.textContent??"").trim().slice(0,45) });
    }
    return res.slice(0, 8);
  }, w);
  console.log(`\n### ${url} @${w}`);
  for (const o of out) console.log(`  <${o.tag}> w=${o.w} right=${o.right} .${o.cls}\n     "${o.txt}"`);
  await ctx.close();
}
await b.close();
