// Checked-in regression test for "Tam Çember" — the one-time Fırat Bey
// closure message once the whole 5-rung rival ladder is cleared. Assumes a
// server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/firat-full-circle.mjs
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

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
});

await page.goto(BASE_URL);

const data = await page.evaluate(async () => {
  const rivalMod = await import("/src/data/rivalCharacter.ts");
  const ladderMod = await import("/src/data/rivalLadder.ts");
  return {
    lineCount: rivalMod.firatFullCircleLines.length,
    allLinesAreStrings: rivalMod.firatFullCircleLines.every((l) => typeof l === "string" && l.length > 0),
    ladderSize: ladderMod.rivalLadder.length,
  };
});
assert(data.lineCount >= 2, "Fırat's full-circle message has at least 2 lines");
assert(data.allLinesAreStrings, "every full-circle line is real text");
assert(data.ladderSize === 5, "rival ladder still has 5 rungs");

// Inject a save with ALL 5 rivals already defeated but the full-circle
// message not yet shown — the very next house transition should fire it.
await page.evaluate(async () => {
  const housesMod = await import("/src/data/houses.ts");
  const save = {
    version: 24, index: 20,
    houseOrder: housesMod.allHouses.map((_, i) => i),
    results: Array.from({ length: 20 }, (_, i) => ({
      houseId: housesMod.allHouses[i].id,
      outcome: "sold",
      sale: { finalPrice: 1000000, commission: 30000, discountPercent: 5, streakBonus: 0, contractModifier: 0, rankBonus: 0 },
      finalStats: { suspicion: 20, interest: 30, fun: 25, discountPercent: 5 },
      finalSuspicion: 20,
    })),
    weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0,
    inbox: [], castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0,
    chitchatBonuses: 0, premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [],
    investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 80, pendingDeliveries: [],
    bossMood: 60, firedSeasonalEventWeeks: [], voiceTally: { eglenceli: 0, samimi: 0, atilgan: 0 },
    origin: "ogretmen", compassTally: { durustluk: 0, kurnazlik: 0 }, significantMemories: [], originChoiceCount: 0,
    selfReflectionShown: true, unlockedFriendHouseIds: [], friendHouseResults: [],
    energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
    ownedSkillIds: [], skillXP: 0,
    defeatedRivalIds: ["firat", "nesrin", "yavuz", "berrak", "selcuk"],
    friendBondCounts: {}, friendBondMilestonesShown: [],
    flashbackShown: false, secondChanceOffered: false,
    pendingFriendFavors: {}, friendFavorAccepted: {}, breadthConfrontationShown: false,
    firatFullCircleShown: false,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("simsar-emlak-save-v24-slot0", JSON.stringify(save));
});
await page.reload();
await page.waitForTimeout(500);
await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 5000 });
await page.waitForTimeout(300);
await page.locator(".pixel-btn").first().click({ timeout: 5000 });
await page.waitForTimeout(800);

// afterIntro() (where the Tam Çember check lives) only fires once the
// player reaches the phone intro and taps "Devam Et" — but continuing a
// save with index > 0 has a chance of landing on an office-task detour
// screen FIRST (work/quickcall/staging/post-sale-call), same rotation as
// any other house transition. Clear at most one of those before waiting
// for the phone screen.
const detourChoice = page.locator(".work-task-screen .choice-btn, .quick-call-screen .choice-btn");
if ((await detourChoice.count()) > 0) {
  await detourChoice.first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(500);
}
// The office screen shows first; "Bugünün İşini Al" reveals the phone
// overlay (afterIntro only fires once its messages are read through).
await page.locator(".office-get-job-btn").first().click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(300);
const continueBtn = page.locator("button.phone-continue");
await continueBtn.first().waitFor({ timeout: 8000 }).catch(() => {});
await continueBtn.first().click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(800);

const restored = await page.evaluate(() => {
  const raw = localStorage.getItem("simsar-emlak-save-v24-slot0");
  return raw ? JSON.parse(raw) : null;
});
assert(restored?.firatFullCircleShown === true, "firatFullCircleShown flips to true on the very next transition");
const firatThread = (restored?.inbox ?? []).filter((m) => m.threadId === "rival-firat");
assert(firatThread.length >= 2, `Fırat's full-circle messages actually landed in the inbox (got ${firatThread.length})`);

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nFIRAT FULL CIRCLE TEST FAILED");
  process.exit(1);
}
console.log("\nFIRAT FULL CIRCLE TEST PASSED");
