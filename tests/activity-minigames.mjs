// Regression test for the office activity mini-games: Pazarlama → Vitrin
// Karesi, Ofis İşleri → Tapu Masası. Energy is the entry fee, the reward
// scales with the result tier, and a perfect Tapu Masası can re-open a
// used-up call-back ("unutulmuş dosya").
// Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:5173 node tests/activity-minigames.mjs
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";
const SAVE_KEY = "simsar-emlak-save-v26-slot0";
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

async function openSave() {
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(BASE_URL);
  await page.locator("button", { hasText: "Türkçe" }).click({ timeout: 3000 }).catch(() => {});
  await page.evaluate(async (key) => {
    localStorage.setItem("simsar-emlak-full-unlock", "1");
    const all = (await import("/src/data/houses.ts")).allHouses;
    const houseOrder = all.map((h, i) => ({ t: h.tier, i })).sort((a, b) => a.t - b.t || a.i - b.i).map((x) => x.i);
    const index = 3;
    const results = Array.from({ length: index }, (_, k) => ({
      houseId: all[houseOrder[k]].id,
      outcome: k === 0 ? "lost" : "sold",
      ...(k === 0 ? { retriedLost: true, sale: null } : { sale: { finalPrice: 1000000, commission: 30000, discountPercent: 0, streakBonus: 0, contractModifier: 0, rankBonus: 0 } }),
      finalStats: { suspicion: 10, interest: 60, fun: 40, discountPercent: 0 },
      finalSuspicion: 10,
    }));
    const save = {
      version: 26, index, houseOrder, results,
      weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0,
      inbox: [], castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0,
      chitchatBonuses: 0, premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [],
      investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 80, pendingDeliveries: [],
      pendingCallbacks: [],
      pausedVisit: null,
      bossMood: 60, firedSeasonalEventWeeks: [], voiceTally: { eglenceli: 0, samimi: 0, atilgan: 0 },
      origin: "ogretmen", compassTally: { durustluk: 0, kurnazlik: 0 }, significantMemories: [], originChoiceCount: 0,
      selfReflectionShown: true, unlockedFriendHouseIds: [], friendHouseResults: [],
      energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
      ownedSkillIds: [], skillXP: 0, defeatedRivalIds: [], friendBondCounts: {}, friendBondMilestonesShown: [],
      flashbackShown: true, secondChanceOffered: true, firedFatefulMomentIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(save));
  }, SAVE_KEY);
  await page.reload();
  await page.waitForTimeout(500);
  await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 5000 });
  await page.waitForTimeout(300);
  await page.locator(".pixel-btn").first().click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  // Continuing a save can roll an office-task detour first — clear it until the office shows.
  for (let i = 0; i < 15 && !(await page.locator(".office-messages-btn").first().isVisible().catch(() => false)); i++) {
    await page.locator(".work-task-screen .choice-btn, .quick-call-screen .choice-btn, .choice-btn, button.phone-continue, .result-screen button.pixel-btn").first().click({ timeout: 500 }).catch(() => {});
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(400);
  }
  return page;
}

const saved = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE_KEY);
const openIsler = async (page) => {
  await page.locator(".office-messages-btn").last().click();
  await page.waitForTimeout(300);
};

const page = await openSave();
// Start today so the activity cards show up.
await page.locator(".office-get-job-btn", { hasText: "Yeni Güne Geç" }).click({ timeout: 5000 });
await page.waitForTimeout(600);
for (let i = 0; i < 10 && !(await page.locator(".day-activity-card").first().isVisible().catch(() => false)); i++) {
  await page.locator(".choice-btn, button.phone-continue").first().click({ timeout: 500 }).catch(() => {});
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(400);
}
const cards = await page.locator(".day-activity-effect").allTextContents();
assert(cards.some((c) => c.includes("Mini oyun · Patron")) && cards.some((c) => c.includes("Mini oyun · +₺")) && cards.some((c) => c.includes("−8 şüphe")), "activity cards show their effects");

// --- Vitrin Karesi ---
let before = await saved(page);
await page.locator(".day-activity-card", { hasText: "Pazarlama" }).click();
await page.waitForTimeout(300);
assert(await page.locator(".activity-game-modal .activity-game-title", { hasText: "Vitrin Karesi" }).isVisible(), "Pazarlama opens Vitrin Karesi");
await page.locator(".activity-game-overlay .pixel-btn", { hasText: "Başla" }).click();
for (let i = 0; i < 3; i++) {
  await page.waitForTimeout(900);
  await page.locator(".vitrin-snap").click();
}
await page.waitForTimeout(400);
const vitrinTitle = await page.locator(".activity-game-result-title").textContent();
assert(["Yarım Ödül", "Tam Ödül", "Mükemmel!"].includes(vitrinTitle), `Vitrin Karesi ends with a tier (${vitrinTitle})`);
await page.locator(".activity-game-overlay .pixel-btn", { hasText: "Tamam" }).click();
await page.waitForTimeout(400);
let after = await saved(page);
const moodGain = after.bossMood - before.bossMood;
const expectedGain = { "Yarım Ödül": 1, "Tam Ödül": 3, "Mükemmel!": 5 }[vitrinTitle];
assert(moodGain === expectedGain, `boss mood +${expectedGain} for ${vitrinTitle} (got +${moodGain})`);
assert(after.energy === before.energy - 8, `Pazarlama costs 8 energy (${before.energy} → ${after.energy})`);
assert(await page.locator(".day-activity-card", { hasText: "Pazarlama" }).isDisabled(), "Pazarlama is done for today");

// --- Tapu Masası: solver plays perfectly, forced lucky roll for the forgotten file ---
before = after;
await page.locator(".day-activity-card", { hasText: "Ofis İşleri" }).click();
await page.waitForTimeout(300);
assert(await page.locator(".activity-game-title", { hasText: "Tapu Masası" }).isVisible(), "Ofis İşleri opens Tapu Masası");
await page.locator(".activity-game-overlay .pixel-btn", { hasText: "Başla" }).click();
const start = Date.now();
while (Date.now() - start < 27000 && !(await page.locator(".activity-game-result-title").isVisible().catch(() => false))) {
  const verdict = await page.evaluate(() => {
    const doc = document.querySelector(".tapu-doc:not(.tapu-doc-out-ok):not(.tapu-doc-out-no)");
    if (!doc) return null;
    const rows = [...doc.querySelectorAll(".tapu-row")].map((r) => r.lastElementChild.textContent.trim());
    const words = { bir: 1, iki: 2, üç: 3, dört: 4, beş: 5, altı: 6, yedi: 7, sekiz: 8, dokuz: 9 };
    const year = rows[1].endsWith("2026");
    const num = parseInt(rows[2].replace("₺", ""), 10);
    const word = words[rows[3].split(" ")[0]];
    const signed = rows[4].length > 0;
    const sealRule = !!document.querySelector(".tapu-rule-new");
    const sealed = !!doc.querySelector(".tapu-seal");
    return year && num === word && signed && (!sealRule || sealed);
  });
  if (verdict !== null) {
    await page.locator(verdict ? ".tapu-choice-yes" : ".tapu-choice-no").click({ timeout: 500 }).catch(() => {});
  }
  await page.waitForTimeout(320);
  if (Date.now() - start > 23000) await page.evaluate(() => { Math.random = () => 0.1; });
}
const tapuTitle = await page.locator(".activity-game-result-title").textContent();
assert(tapuTitle === "Mükemmel!", `perfect play reaches Mükemmel (${tapuTitle})`);
assert(await page.locator(".activity-game-extra", { hasText: "Unutulmuş dosya" }).isVisible(), "forgotten file is announced");
await page.locator(".activity-game-overlay .pixel-btn", { hasText: "Tamam" }).click();
await page.waitForTimeout(400);
after = await saved(page);
assert(after.bonusEarnings - before.bonusEarnings === 7500, `Mükemmel pays ₺7.500 (got ${after.bonusEarnings - before.bonusEarnings})`);
assert(after.results[0].retriedLost === false, "forgotten file re-opens the lost customer's call-back");
assert(after.energy === before.energy - 10, "Ofis İşleri costs 10 energy");

assert(errors.length === 0, `no page errors (${errors.join(" | ")})`);
await browser.close();
process.exit(failed ? 1 : 0);
