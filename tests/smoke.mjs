// Checked-in smoke test for Simsar Emlak. Assumes a server is already
// running at BASE_URL (`npm run dev` or `npm run preview`) — this script
// does not spawn one itself, so it can be reused from CI or locally.
//
// Usage: BASE_URL=http://localhost:4173 node tests/smoke.mjs
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";
const errors = [];
let failed = false;

function assert(condition, message) {
  if (!condition) {
    failed = true;
    console.error(`FAIL: ${message}`);
  } else {
    console.log(`ok: ${message}`);
  }
}

async function tick(page) {
  const continueBtn = page.locator("button.phone-continue");
  if ((await continueBtn.count()) > 0 && (await continueBtn.first().isVisible().catch(() => false))) {
    await continueBtn.first().click().catch(() => {});
    return true;
  }
  const phoneChoices = page.locator(".phone-choices .choice-btn");
  if ((await phoneChoices.count()) > 0) {
    await phoneChoices.first().click().catch(() => {});
    return true;
  }
  const choiceBtns = page.locator(".dialogue-box .choices .choice-btn");
  if ((await choiceBtns.count()) > 0) {
    await choiceBtns.first().click().catch(() => {});
    return true;
  }
  const advanceBtn = page.locator(".dialogue-box > button.pixel-btn.small");
  if ((await advanceBtn.count()) > 0 && (await advanceBtn.first().isVisible().catch(() => false))) {
    await advanceBtn.first().click().catch(() => {});
    return true;
  }
  const contractBtns = page.locator(".contract-modal button");
  if ((await contractBtns.count()) > 0) {
    await contractBtns.first().click().catch(() => {});
    return true;
  }
  const resultBtn = page.locator(".result-screen button.pixel-btn:not(.small)");
  if ((await resultBtn.count()) > 0) {
    await resultBtn.first().click().catch(() => {});
    return true;
  }
  return false;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
});

await page.goto(BASE_URL);
await page.waitForTimeout(600);

assert(await page.locator("text=Oyuna Başla").count() > 0, "main menu shows 'Oyuna Başla'");

await page.locator("button", { hasText: "Oyuna Başla" }).click();
await page.waitForTimeout(800);

let sawDialogue = false;
for (let i = 0; i < 60; i++) {
  const clicked = await tick(page);
  if ((await page.locator(".scene-title").count()) > 0) sawDialogue = true;
  await page.waitForTimeout(clicked ? 250 : 700);
  if (sawDialogue && i > 15) break;
}
assert(sawDialogue, "reached at least one house's dialogue scene");

const emlahBtn = page.locator("button.wallet-pill-btn");
await emlahBtn.first().waitFor({ timeout: 10000 }).catch(() => {});
await emlahBtn.first().click().catch(() => {});
await page.waitForTimeout(400);
assert((await page.locator(".emlah-menu").count()) > 0, "Emlah menu opens");

for (const tabLabel of ["Mesajlar", "Portföy", "Kariyer", "Market"]) {
  await page.locator(".emlah-tab-btn", { hasText: tabLabel }).click().catch(() => {});
  await page.waitForTimeout(300);
}

const portfolioTab = page.locator(".emlah-tab-btn", { hasText: "Portföy" });
await portfolioTab.click().catch(() => {});
await page.waitForTimeout(300);
const rowCount = await page.locator(".portfolio-row").count();
assert(rowCount === 36, `Portföy tab lists 36 houses (got ${rowCount})`);

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) {
  for (const e of errors) console.error("  -", e);
}

await browser.close();

if (failed) {
  console.error("\nSMOKE TEST FAILED");
  process.exit(1);
} else {
  console.log("\nSMOKE TEST PASSED");
  process.exit(0);
}
