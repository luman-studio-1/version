import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 900 },
  reducedMotion: "reduce",
});
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: ".qa-shots/hero-reduced-motion.png" });
console.log("Saved .qa-shots/hero-reduced-motion.png");
await browser.close();
