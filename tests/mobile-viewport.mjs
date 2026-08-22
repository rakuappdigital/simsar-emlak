// Checked-in regression test for mobile-viewport rendering of the newer
// EmlahMenu panels (Rehber/Arkadaşlarım/Şehir Haritası/Beceriler/Kariyer) —
// guards against horizontal overflow on a real phone screen size. Assumes a
// server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/mobile-viewport.mjs
import { chromium, devices } from "playwright";

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

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 13"] });
const page = await context.newPage();
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
});

await page.goto(BASE_URL);

await page.evaluate(async () => {
  const housesMod = await import("/src/data/houses.ts");
  const save = {
    version: 22, index: 5,
    houseOrder: housesMod.allHouses.map((_, i) => i),
    results: [
      {
        houseId: housesMod.allHouses[0].id,
        outcome: "sold",
        sale: { finalPrice: 3000000, commission: 90000, discountPercent: 4, streakBonus: 0, contractModifier: 0, rankBonus: 0 },
        finalStats: { suspicion: 18, interest: 40, fun: 30, discountPercent: 4 },
        finalSuspicion: 18,
        bestLine: "Mobil test repliği",
        bestLineFun: 25,
      },
    ],
    weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0, inbox: [],
    castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0, chitchatBonuses: 0,
    premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [], investmentResults: [],
    contactedCustomers: [], activeNewsId: null, energy: 80, pendingDeliveries: [], bossMood: 60,
    firedSeasonalEventWeeks: [], voiceTally: { eglenceli: 2, samimi: 1, atilgan: 0 }, origin: "ogretmen",
    compassTally: { durustluk: 5, kurnazlik: 2 }, significantMemories: [], originChoiceCount: 1,
    selfReflectionShown: true, unlockedFriendHouseIds: ["ecrin-isik-kuyulu-loft"],
    friendHouseResults: [
      {
        houseId: "ecrin-isik-kuyulu-loft", outcome: "sold",
        sale: { finalPrice: 8200000, commission: 246000, discountPercent: 8, streakBonus: 0, contractModifier: 0, rankBonus: 0 },
        finalStats: { suspicion: 12, interest: 30, fun: 20, discountPercent: 8 }, finalSuspicion: 12,
      },
    ],
    energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
    ownedSkillIds: ["sakin-kafa-1"], skillXP: 5, defeatedRivalIds: [], friendBondCounts: {}, friendBondMilestonesShown: [],
    flashbackShown: false, secondChanceOffered: false, savedAt: new Date().toISOString(),
  };
  localStorage.setItem("simsar-emlak-save-v22-slot0", JSON.stringify(save));
});
await page.reload();
await page.waitForTimeout(500);
await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 5000 });
await page.waitForTimeout(300);
await page.locator(".pixel-btn").first().click({ timeout: 5000 });
await page.waitForTimeout(500);
await page.locator(".wallet-pill-btn").first().click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(300);

const viewportWidth = page.viewportSize().width;

async function checkOverflow(label, tabLabel) {
  if (tabLabel) {
    await page.locator(".emlah-tab-btn", { hasText: tabLabel }).first().click();
    await page.waitForTimeout(250);
  }
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert(scrollWidth - viewportWidth <= 2, `no horizontal overflow — ${label} (viewport=${viewportWidth} scrollWidth=${scrollWidth})`);
}

await checkOverflow("Market (default)", null);
await checkOverflow("Rehber", "Rehber");
await checkOverflow("Arkadaşlarım", "Arkadaşlarım");
await checkOverflow("Kariyer", "Kariyer");
await checkOverflow("Beceriler", "Beceriler");
await checkOverflow("Şehir Haritası", "Şehir Haritası");

const pinCount = await page.locator(".city-map-pin").count();
if (pinCount > 0) {
  await page.locator(".city-map-pin").first().click();
  await page.waitForTimeout(200);
  await checkOverflow("Şehir Haritası detay kartı açık", null);
}

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nMOBILE VIEWPORT TEST FAILED");
  process.exit(1);
}
console.log("\nMOBILE VIEWPORT TEST PASSED");
