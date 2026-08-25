// Checked-in regression test for the energy system (data/energy.ts +
// EnergyBreakScreen). Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/energy.mjs
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
  const energyMod = await import("/src/data/energy.ts");
  const out = {};
  out.depletion = energyMod.ENERGY_DEPLETION_PER_HOUSE;
  out.passivePerHour = energyMod.PASSIVE_REGEN_PER_HOUR;
  out.minigameGain = energyMod.MINIGAME_ENERGY_GAIN;
  // Mini-games no longer gate on a real-time cooldown — paid game, no
  // ads/purchases to ration behind a wait timer. These exports should be
  // gone entirely now.
  out.cooldownExportsRemoved =
    energyMod.MINIGAME_MAX_PLAYS === undefined &&
    energyMod.MINIGAME_COOLDOWN_MS === undefined &&
    energyMod.effectiveMinigamePlaysRemaining === undefined;

  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  out.regen1hGained = energyMod.computePassiveEnergyRegen(oneHourAgo, Date.now()).gained;

  const twoAndHalfHoursAgo = Date.now() - 2.5 * 60 * 60 * 1000;
  const regen2_5h = energyMod.computePassiveEnergyRegen(twoAndHalfHoursAgo, Date.now());
  out.regen2_5hGained = regen2_5h.gained;
  out.regen2_5hCarriesOverPartialHour = regen2_5h.newLastRegenAt > twoAndHalfHoursAgo && regen2_5h.newLastRegenAt < Date.now();

  return out;
});

assert(data.depletion === 30, "depletion per house is 30");
assert(data.passivePerHour === 10, "passive regen is 10/hour");
assert(data.minigameGain === 10, "minigame gain is 10");
assert(data.cooldownExportsRemoved, "real-time cooldown exports (MINIGAME_MAX_PLAYS/COOLDOWN_MS/effectiveMinigamePlaysRemaining) are gone");
assert(data.regen1hGained === 10, "1 hour elapsed grants 10 energy");
assert(data.regen2_5hGained === 20, "2.5 hours elapsed grants 20 (floored)");
assert(data.regen2_5hCarriesOverPartialHour, "partial hour carries over instead of being discarded");

// UI: inject a low-energy save (even with the old minigamePlaysRemaining
// field at 0, a vestigial value no longer read for gating) and verify
// "Bugünün İşini Al" opens Enerji Molası with mini-games always available
// — no locked/countdown state, no ad/purchase placeholders.
await page.evaluate(async () => {
  const housesMod = await import("/src/data/houses.ts");
  const save = {
    version: 26, index: 0,
    houseOrder: housesMod.allHouses.map((_, i) => i),
    results: [], weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0,
    inbox: [], castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0,
    chitchatBonuses: 0, premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [],
    investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 5, pendingDeliveries: [],
    bossMood: 60, firedSeasonalEventWeeks: [], voiceTally: { eglenceli: 0, samimi: 0, atilgan: 0 },
    origin: "ogretmen", compassTally: { durustluk: 0, kurnazlik: 0 }, significantMemories: [], originChoiceCount: 0,
    selfReflectionShown: false, unlockedFriendHouseIds: [], friendHouseResults: [],
    energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now() + 90 * 60 * 1000, minigamePlaysRemaining: 0,
    ownedSkillIds: [], skillXP: 0, defeatedRivalIds: [], friendBondCounts: {}, friendBondMilestonesShown: [],
    flashbackShown: false, secondChanceOffered: false,
    pendingFriendFavors: {}, friendFavorAccepted: {}, breadthConfrontationShown: false,
    firatFullCircleShown: false, hardTimesUsed: {}, firedFatefulMomentIndices: [],
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("simsar-emlak-save-v26-slot0", JSON.stringify(save));
});
await page.reload();
await page.waitForTimeout(500);
await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 5000 });
await page.waitForTimeout(300);
await page.locator(".pixel-btn").first().click({ timeout: 5000 });
await page.waitForTimeout(500);

await page.locator(".office-get-job-btn").first().click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(300);
assert((await page.locator(".energy-break-modal").count()) > 0, "low energy opens the Enerji Molası modal");
assert((await page.locator(".energy-break-card").count()) === 4, "all 4 mini-games are available, even with minigamePlaysRemaining at 0 (vestigial field, no longer gates anything)");
assert((await page.locator(".energy-break-other-btn, .energy-break-soon").count()) === 0, "no leftover ad/purchase placeholder buttons");

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nENERGY TEST FAILED");
  process.exit(1);
}
console.log("\nENERGY TEST PASSED");
