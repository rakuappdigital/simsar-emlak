// Checked-in regression test for the 4 real skill-based mini-games behind
// "Enerji Molası" (see EnergyMiniGames.tsx) — guards against the previous
// state where a click was an automatic win with no real mechanic. Assumes
// a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/energy-minigames.mjs
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

// Inject a low-energy save with the mini-game cooldown fresh (2 plays
// available), so the office gate opens straight into the unlocked list.
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
    energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
    ownedSkillIds: [], skillXP: 0, defeatedRivalIds: [], friendBondCounts: {}, friendBondMilestonesShown: [],
    flashbackShown: false, secondChanceOffered: false, savedAt: new Date().toISOString(),
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
await page.waitForTimeout(500);

assert((await page.locator(".energy-break-modal").count()) > 0, "low-energy save opens the Enerji Molası modal");
assert((await page.locator(".energy-break-card").count()) === 4, "4 mini-game activities are offered");

// Play the "Kısa Yürüyüş" (tap-count) mini-game — the least timing-sensitive
// one, so a scripted bot can reliably drive it: spam the action button.
await page.locator(".energy-break-card", { hasText: "Kısa Yürüyüş" }).click();
await page.waitForTimeout(200);
assert((await page.locator(".minigame").count()) > 0, "clicking an activity opens a real mini-game screen, not an instant result");
assert((await page.locator(".energy-break-card").count()) === 0, "the activity list is gone once a mini-game is active");

// The Kısa Yürüyüş mini-game runs on its own internal ~4s timer regardless
// of tap speed — keep tapping for the full window (real wall-clock, not an
// iteration count, since Playwright per-click overhead is unpredictable),
// then give the 700ms post-result delay + persist() room to land.
const tapDeadline = Date.now() + 4300;
while (Date.now() < tapDeadline) {
  await page.locator(".minigame-action-btn").click({ timeout: 300 }).catch(() => {});
}
await page.waitForTimeout(1200);

const energyAfter = await page.evaluate(() => {
  const raw = localStorage.getItem("simsar-emlak-save-v26-slot0");
  return raw ? JSON.parse(raw).energy : null;
});
assert(energyAfter !== null && energyAfter > 5, `energy actually increased after playing (was 5, now ${energyAfter})`);

// No real-time cooldown anymore — the modal stays open (not auto-closed)
// and the activity list should be playable again immediately, no lock.
assert((await page.locator(".energy-break-modal").count()) > 0, "the modal stays open after a play instead of auto-closing");
assert((await page.locator(".energy-break-card").count()) === 4, "all 4 activities are immediately playable again, no cooldown lock");

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nENERGY MINIGAMES TEST FAILED");
  process.exit(1);
}
console.log("\nENERGY MINIGAMES TEST PASSED");
