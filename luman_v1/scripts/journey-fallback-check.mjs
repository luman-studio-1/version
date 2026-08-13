// Verifies the journey's capability fallback: narrow/touch/reduced-motion
// viewports should render StoryScrollSection and must NOT download the
// R3F/three.js bundle (checked via network requests, not just visually).
import { chromium } from "playwright";

const browser = await chromium.launch();

async function check(name, contextOptions) {
  const page = await browser.newPage(contextOptions);
  const chunkRequests = [];
  page.on("request", (req) => {
    const url = req.url();
    if (/three|fiber|drei|journey-scene|hero-scene/i.test(url)) chunkRequests.push(url);
  });

  await page.goto("http://localhost:3000/journey-preview", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const hasStoryScroll = await page.locator('[data-flow-section]').count();
  await page.screenshot({ path: `.qa-shots/fallback-${name}.png`, fullPage: false });

  console.log(`\n[${name}]`);
  console.log(`  FlowSection (story-scroll) elements found: ${hasStoryScroll}`);
  console.log(`  3D-related chunk requests: ${chunkRequests.length}`);
  if (chunkRequests.length) chunkRequests.forEach((u) => console.log(`    ${u}`));

  await page.close();
}

await check("mobile", { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
await check("reduced-motion-desktop", { viewport: { width: 1600, height: 900 }, reducedMotion: "reduce" });

await browser.close();
