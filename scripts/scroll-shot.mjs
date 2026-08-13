// One-off QA helper: scroll to a specific pixel Y and screenshot the viewport.
// Usage: node scripts/scroll-shot.mjs <name> <scrollY> [--width=1600] [--wait=800] [--path=/journey-preview]
import { chromium } from "playwright";

const [, , name, scrollYArg, ...rest] = process.argv;
const scrollY = Number(scrollYArg ?? 0);
const widthArg = rest.find((a) => a.startsWith("--width="));
const width = widthArg ? Number(widthArg.split("=")[1]) : 1600;
const waitArg = rest.find((a) => a.startsWith("--wait="));
const wait = waitArg ? Number(waitArg.split("=")[1]) : 800;
const pathArg = rest.find((a) => a.startsWith("--path="));
const path = pathArg ? pathArg.split("=")[1] : "/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.mouse.wheel(0, scrollY);
await page.waitForTimeout(wait);

const outPath = `.qa-shots/${name}.png`;
await page.screenshot({ path: outPath });
console.log(`Saved ${outPath} at scrollY=${scrollY}`);
await browser.close();
