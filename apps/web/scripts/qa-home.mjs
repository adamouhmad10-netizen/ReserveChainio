import { chromium } from "playwright";
const b = await chromium.launch();
const BPS = [[1920,1080],[1440,900],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[360,800]];
let issues = 0;
for (const [w,h] of BPS) {
  const ctx = await b.newContext({ viewport:{width:w,height:h} });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/", {waitUntil:"load", timeout:60000});
  await p.waitForTimeout(300);
  const sw = await p.evaluate(()=>document.documentElement.scrollWidth);
  const cw = await p.evaluate(()=>document.documentElement.clientWidth);
  const ok = sw <= cw+1;
  if(!ok) issues++;
  console.log(`${ok?"✓":"✗ OVERFLOW"} home @${w}px  (scrollWidth ${sw} / client ${cw})`);
  await ctx.close();
}
await b.close();
console.log(`\n${issues} issue(s).`);
