// Regression test for İşler's three decisions on today's (deferred) job:
// Şimdi Git / Ertele (once, 1-3 days) / Reddet, plus the doorstep
// "Vazgeç, İşler'e dön" link. Before, İşler only had "Ziyareti Aç" (a random
// 40/30/30 roll) and its "no longer available" branch gave the same house
// back via "Bugünün İşini Al".
// Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:5173 node tests/job-decisions.mjs
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
      weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0,
      inbox: [], castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0,
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

// --- Ertele → Geri keeps the job; Ertele → Randevu Ver schedules once ---
let page = await openWithPausedVisit();
await openIsler(page);
assert((await page.locator(".isler-decision").count()) === 3, "İşler shows three decisions (Şimdi Git / Ertele / Reddet)");
await page.locator(".isler-decision", { hasText: "Ertele" }).click();
await page.waitForTimeout(200);
assert(await page.locator(".isler-job-offer-text").isVisible(), "Ertele shows the client's proposed date");
await page.locator(".isler-job-offer button", { hasText: "Geri" }).click();
await page.waitForTimeout(200);
assert((await page.locator(".isler-decision").count()) === 3 && (await saved(page)).pausedVisit?.status === "office", "Geri returns to the decisions, job is kept");
await page.locator(".isler-decision", { hasText: "Ertele" }).click();
await page.locator(".isler-job-offer button", { hasText: "Randevu Ver" }).click();
await page.waitForTimeout(300);
let s = await saved(page);
assert(s.pausedVisit?.status === "scheduled" && s.pausedVisit.postponed === true, "Randevu Ver schedules the visit and marks it postponed (saved)");
await page.locator(".market-close").first().click();
for (let i = 0; i < 4 && (await saved(page)).pausedVisit?.status === "scheduled"; i++) {
  await page.locator(".office-get-job-btn", { hasText: "randevuya" }).click();
  await page.waitForTimeout(400);
}
assert((await saved(page)).pausedVisit?.status === "office", "appointment day arrives, client is back at the office");
await openIsler(page);
assert(await page.locator(".isler-decision", { hasText: "Ertele" }).isDisabled(), "a job can only be postponed once");
await page.close();

// --- Şimdi Git → doorstep → Vazgeç refunds energy and goes back to İşler ---
page = await openWithPausedVisit();
await openIsler(page);
await page.locator(".isler-decision", { hasText: "Şimdi Git" }).click();
for (let i = 0; i < 15 && !(await page.locator(".sale-intro-back").isVisible().catch(() => false)); i++) {
  await page.locator(".phone-choices .choice-btn, button.phone-continue, .work-task-screen .choice-btn, .quick-call-screen .choice-btn").first().click({ timeout: 500 }).catch(() => {});
  await page.waitForTimeout(400);
}
assert(await page.locator(".sale-intro-back").isVisible(), "doorstep screen shows 'Vazgeç, İşler'e dön'");
await page.locator(".sale-intro-back").click();
await page.waitForTimeout(500);
s = await saved(page);
assert(s.pausedVisit?.status === "office" && s.pausedVisit.introDone === true, "Vazgeç puts the visit back into İşler");
assert(s.energy === 80, `energy spent at the door is refunded (got ${s.energy})`);
assert(await page.locator(".office-get-job-btn", { hasText: "İşler'de bekliyor" }).isVisible(), "office points to the waiting job");
await openIsler(page);
await page.locator(".isler-decision", { hasText: "Şimdi Git" }).click();
await page.waitForTimeout(600);
assert(await page.locator(".sale-intro-back").isVisible(), "going again lands straight on the doorstep (no second intro)");
await page.close();

// --- Reddet → confirm → result → next house ---
page = await openWithPausedVisit();
await openIsler(page);
await page.locator(".isler-decision", { hasText: "Reddet" }).click();
await page.waitForTimeout(200);
assert(await page.locator(".isler-job-confirm").isVisible(), "Reddet asks for confirmation first");
await page.locator(".isler-job-confirm button", { hasText: "Evet, Reddet" }).click();
await page.waitForTimeout(600);
assert(await page.locator(".result-screen", { hasText: "İşi reddettin" }).isVisible(), "result screen says the job was declined");
s = await saved(page);
const last = s.results[s.results.length - 1];
assert(last.declined === true && last.retriedLost === true && last.outcome === "lost", "declined result is recorded (lost + declined, out of callbacks)");
assert(s.bossMood === 55, `boss mood drops by 5 (got ${s.bossMood})`);
assert(s.pausedVisit === null, "no pending job after declining");
assert(s.energy === 80, "declining costs no energy");
await page.locator(".result-screen button.pixel-btn:not(.small)").first().click();
await page.waitForTimeout(800);
// A random office-task detour can sit between the result and the next house; the move is saved once it resolves.
for (let i = 0; i < 12 && (await saved(page)).index !== 4; i++) {
  await page.locator(".choice-btn, button.phone-continue").first().click({ timeout: 500 }).catch(() => {});
  await page.waitForTimeout(500);
}
s = await saved(page);
assert(s.index === 4, `play moves on to the next house (index ${s.index})`);
await page.close();

assert(errors.length === 0, `no page errors (${errors.join(" | ")})`);
await browser.close();
process.exit(failed ? 1 : 0);
