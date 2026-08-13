// Usage: node scripts/screenshot.mjs <name> [path] [--dark] [--width=1440] [--full]
import { chromium } from "playwright";

const [, , name, pathArg, ...rest] = process.argv;
const path = pathArg && !pathArg.startsWith("--") ? pathArg : "/";
const dark = rest.includes("--dark") || (pathArg ?? "").includes("--dark");
const widthArg = rest.find((a) => a.startsWith("--width="));
const width = widthArg ? Number(widthArg.split("=")[1]) : 1440;
const fullPage = rest.includes("--full") || (pathArg ?? "").includes("--full");

if (!name) {
  console.error("Usage: node scripts/screenshot.mjs <name> [path] [--dark] [--width=1440] [--full]");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 900 },
  colorScheme: dark ? "dark" : "light",
});

await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);

const outPath = `.qa-shots/${name}.png`;
await page.screenshot({ path: outPath, fullPage });
console.log(`Saved ${outPath}`);

await browser.close();
