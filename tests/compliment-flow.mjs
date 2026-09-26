// Regression test for the "İltifat Et" (compliment) choice:
// 1) the choice text is a real compliment sentence, not a meta label,
// 2) after the customer's reaction the conversation moves forward instead of
//    replaying the same node's lines (the old soft-lock loop).
// Forces Math.random low once inside a house so the compliment roll lands.
// Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:5173 node tests/compliment-flow.mjs
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

async function clickFirstVisible(page, selector) {
  const loc = page.locator(selector);
  if ((await loc.count()) > 0 && (await loc.first().isVisible().catch(() => false))) {
    await loc.first().click().catch(() => {});
    return true;
  }
  return false;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(BASE_URL);
await page.locator("button", { hasText: "Türkçe" }).click({ timeout: 3000 }).catch(() => {});
await page.evaluate(() => localStorage.setItem("simsar-emlak-full-unlock", "1")).catch(() => {});
await page.waitForTimeout(600);
await page.locator("button", { hasText: "Oyuna Başla" }).click();
await page.waitForTimeout(400);
await page.locator("button", { hasText: "Devam Et" }).click();
await page.waitForTimeout(400);
await page.locator(".origin-card").first().click();
await page.waitForTimeout(800);

// Walk into the first house.
for (let i = 0; i < 40 && (await page.locator(".scene-title").count()) === 0; i++) {
  (await clickFirstVisible(page, "button.office-get-job-btn")) ||
    (await clickFirstVisible(page, "button.phone-continue")) ||
    (await clickFirstVisible(page, ".phone-choices .choice-btn")) ||
    (await page.locator("button", { hasText: "Satışa Başla" }).first().click({ timeout: 500 }).then(() => true).catch(() => false));
  await page.waitForTimeout(300);
}
assert((await page.locator(".scene-title").count()) > 0, "reached a house dialogue");
// Tutorial tip sits above the scene on the first house.
await clickFirstVisible(page, ".tutorial-tip button");
await page.evaluate(() => {
  Math.random = () => 0.1;
});

const lineTexts = () => page.locator(".dialogue-box .line-text").allTextContents();

let complimentText = null;
for (let i = 0; i < 40 && !complimentText; i++) {
  const choices = page.locator(".dialogue-box .choices .choice-btn");
  const count = await choices.count();
  if (count > 0) {
    const texts = await choices.allTextContents();
    const idx = await page.evaluate(() =>
      [...document.querySelectorAll(".dialogue-box .choices .choice-btn")].findIndex((b) => b.dataset.choiceId === "compliment"),
    );
    if (idx >= 0) {
      complimentText = texts[idx];
      const before = await lineTexts();
      await choices.nth(idx).click();
      await page.waitForTimeout(3000);
      // Line-advance from Emlah's compliment to the customer's reply.
      await clickFirstVisible(page, ".dialogue-box > button.pixel-btn.small");
      await page.waitForTimeout(3000);
      const reaction = await lineTexts();
      console.log("before:", before);
      console.log("reaction:", reaction);
      console.log("compliment:", complimentText);
      assert(!/^"?\(/.test(complimentText.trim()), "compliment choice is a spoken sentence, not a '(...)' label");
      assert(reaction.includes(complimentText.trim().replace(/^"|"$/g, "")), "Emlah's compliment is shown as a spoken line");
      const afterChoices = await page.locator(".dialogue-box .choices .choice-btn").allTextContents();
      console.log("choices after reaction:", afterChoices);
      assert(afterChoices.length > 0 && !afterChoices.includes(complimentText), "original choices come back (without the compliment) right after the reaction");
      assert(!afterChoices.some((c) => c.includes("Devam")), "no bare 'Devam' choice that rewinds the node");
      assert(reaction.length === 2, "reaction exchange is just compliment + reply (no replayed intro lines)");
      // Pick a real choice and make sure the node actually changes.
      await page.locator(".dialogue-box .choices .choice-btn").first().click();
      await page.waitForTimeout(3000);
      const after = await lineTexts();
      console.log("after real choice:", after);
      assert(JSON.stringify(after) !== JSON.stringify(before), "conversation moved on to a new node");
      break;
    }
    await choices.first().click();
  } else {
    await clickFirstVisible(page, ".dialogue-box > button.pixel-btn.small");
  }
  await page.waitForTimeout(2500);
}
assert(complimentText !== null, "compliment choice appeared with forced roll");
assert(errors.length === 0, `no page errors (${errors.join(" | ")})`);

await browser.close();
process.exit(failed ? 1 : 0);
