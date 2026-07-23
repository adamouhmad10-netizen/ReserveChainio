import { chromium } from "playwright";
const b = await chromium.launch();
const dir = "/private/tmp/claude-501/-Users-adamouhmad-Documents-freelnacer-ReserveChain-io/1da59c85-8cd7-4bf1-ad61-49c3a931b1a5/scratchpad";
for (const [w,h,name] of [[1280,900,"desktop"],[390,900,"mobile"]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/", {waitUntil:"load"});
  await p.waitForTimeout(500);
  await p.screenshot({ path:`${dir}/hero-${name}.png` });
  await ctx.close();
}
await b.close();
console.log("shots done");
