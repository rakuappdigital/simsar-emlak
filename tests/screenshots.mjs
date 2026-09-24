// Generates the 5 App Store marketing screenshots in both languages.
// Usage: node tests/screenshots.mjs
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";
const VIEWPORT = { width: 1290 / 2, height: 2796 / 2 }; // devicePixelRatio 2 -> exact 1290x2796 output

async function run(lang) {
  const outDir = `/tmp/shots-${lang}`;
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });

  await page.goto(BASE_URL);
  await page.waitForTimeout(500);

  const langLabel = lang === "en" ? "English" : "Türkçe";
  await page.locator("button", { hasText: langLabel }).click({ timeout: 5000 });
  await page.waitForTimeout(500);

  // 1. Main menu
  await page.screenshot({ path: `${outDir}/menu.png` });

  // 2. Origin select
  const startLabel = lang === "en" ? "Start Game" : "Oyuna Başla";
  await page.locator("button", { hasText: startLabel }).click({ timeout: 5000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/origin.png` });

  // 3. First house dialogue (with tutorial tip)
  await page.locator(".origin-card").first().click({ timeout: 5000 });
  await page.waitForTimeout(1500);

  // Office scene: advance to a new day, then fetch today's job — this walks
  // through the intro phone messages and lands on the actual customer dialogue.
  for (let i = 0; i < 20; i++) {
    if (await page.locator(".stats-bar").count()) break;
    const advanceBtn = page.locator(".office-get-job-btn");
    if (await advanceBtn.count()) {
      await advanceBtn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(1000);
      continue;
    }
    const continueBtn = page.locator(".phone-continue");
    if (await continueBtn.count()) {
      await continueBtn.click({ timeout: 2000 }).catch(() => {});
    }
    await page.waitForTimeout(1600);
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outDir}/dialogue.png` });

  // 4. Career panel
  const walletBtn = page.locator(".wallet-pill-btn").first();
  if (await walletBtn.count()) {
    await walletBtn.click({ timeout: 5000 });
    await page.waitForTimeout(500);
    const careerTabId = "kariyer";
    await page.locator(`.emlah-tab-btn:has-text("${lang === "en" ? "Career" : "Kariyer"}")`).click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${outDir}/career.png` });

    // 5. Inventory panel
    await page.locator(`.emlah-tab-btn:has-text("${lang === "en" ? "Inventory" : "Envanter"}")`).click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${outDir}/inventory.png` });
  }

  await browser.close();
  console.log(`Done: ${lang} -> ${outDir}`);
}

await run("en");
await run("tr");
