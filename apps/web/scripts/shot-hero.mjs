import { chromium } from "playwright";
const b = await chromium.launch();
const dir = "/private/tmp/claude-501/-Users-adamouhmad-Documents-freelnacer-ReserveChain-io/1da59c85-8cd7-4bf1-ad61-49c3a931b1a5/scratchpad";
const ctx = await b.newContext({ viewport:{width:1920,height:1080} });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/", {waitUntil:"load"});
await p.waitForTimeout(500);
// clip to hero right column area
const fig = await p.$('figure[aria-label^="Asset evidence"]');
await fig.screenshot({ path:`${dir}/stack-1920.png` });
await b.close();
console.log("done");
