// Regression test: continuing a save used to call enterPhone() in the same
// turn as the state restore, so its internal persist() wrote STALE pre-load
// state back to disk — spent → 0 (balance jumps), badges/bonus wiped, energy
// → 100, pending job dropped. A player who loaded and quit right away kept
// the corrupted save. Loads several times since the old bug hit ~2/3 runs.
// Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:5173 node tests/load-integrity.mjs
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

async function openWithPausedVisit() {
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
      outcome: "sold",
      sale: { finalPrice: 1000000, commission: 30000, discountPercent: 0, streakBonus: 0, contractModifier: 0, rankBonus: 0 },
      finalStats: { suspicion: 10, interest: 60, fun: 40, discountPercent: 0 },
      finalSuspicion: 10,
    }));
    const save = {
      version: 26, index, houseOrder, results,
      weekOutcomes: [], badges: ["ilk-satis"], ownedPerks: ["not-defteri"], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 12345,
      inbox: [], castAssignment: {}, dailyQuest: null, bonusEarnings: 7777, pendingLoan: null, tasksCompleted: 0,
      chitchatBonuses: 0, premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [],
      investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 80, pendingDeliveries: [],
      pendingCallbacks: [],
      pausedVisit: { houseId: all[houseOrder[index]].id, contactName: "Test Müşteri", status: "office" },
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

for (let r = 0; r < 4; r++) {
  const page = await openWithPausedVisit();
  const sv = await saved(page);
  assert(
    sv.spent === 12345 && sv.bonusEarnings === 7777 && sv.badges.includes("ilk-satis") && sv.energy === 80 && sv.bossMood === 60 && sv.pausedVisit?.status === "office",
    `load #${r + 1} leaves the saved game intact (${JSON.stringify({ spent: sv.spent, bonus: sv.bonusEarnings, badges: sv.badges, energy: sv.energy, boss: sv.bossMood, pv: sv.pausedVisit?.status ?? null })})`,
  );
  await page.close();
}

assert(errors.length === 0, `no page errors (${errors.join(" | ")})`);
await browser.close();
process.exit(failed ? 1 : 0);
