// Regression test: passive real-clock energy regen used to be applied only on
// house transitions, so a player stuck in the office below the work threshold
// never regained energy while the app stayed open (soft-lock). It must now
// also catch up while sitting in the office / on returning to the app.
// Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:5173 node tests/energy-office-regen.mjs
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
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(BASE_URL);
await page.locator("button", { hasText: "Türkçe" }).click({ timeout: 3000 }).catch(() => {});
await page.evaluate(() => localStorage.setItem("simsar-emlak-full-unlock", "1")).catch(() => {});

await page.evaluate(async (key) => {
  const housesMod = await import("/src/data/houses.ts");
  const houseOrder = housesMod.allHouses.map((_, i) => i);
  const save = {
    version: 26, index: 3, houseOrder,
    results: Array.from({ length: 3 }, (_, i) => ({
      houseId: housesMod.allHouses[i].id,
      outcome: "sold",
      sale: { finalPrice: 1000000, commission: 30000, discountPercent: 5, streakBonus: 0, contractModifier: 0, rankBonus: 0 },
      finalStats: { suspicion: 20, interest: 30, fun: 25, discountPercent: 5 },
      finalSuspicion: 20,
    })),
    weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0,
    inbox: [], castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0,
    chitchatBonuses: 0, premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [],
    investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 5, pendingDeliveries: [],
    pendingCallbacks: [],
    pausedVisit: null,
    bossMood: 60, firedSeasonalEventWeeks: [], voiceTally: { eglenceli: 0, samimi: 0, atilgan: 0 },
    origin: "ogretmen", compassTally: { durustluk: 0, kurnazlik: 0 }, significantMemories: [], originChoiceCount: 0,
    selfReflectionShown: true, unlockedFriendHouseIds: [], friendHouseResults: [],
    energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
    ownedSkillIds: [], skillXP: 0, defeatedRivalIds: [], friendBondCounts: {}, friendBondMilestonesShown: [],
    flashbackShown: true, secondChanceOffered: false,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(save));
}, SAVE_KEY);
await page.reload();
await page.waitForTimeout(500);
await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 5000 });
await page.waitForTimeout(300);
await page.locator(".pixel-btn").first().click({ timeout: 5000 });
await page.waitForTimeout(800);
await page.keyboard.press("Escape").catch(() => {});

// Finish the current day so the office offers today's job again. Continuing a
// save can roll an office-task detour first, so keep clearing whatever is on
// screen (and pressing "Yeni Güne Geç" once the office shows) until the job is offered.
// "Müşteri yok — Tekrar Dene" de rastgele çıkabilir — onu da tıklayıp yeniden dene.
for (let i = 0; i < 30 && !(await page.locator(".office-get-job-btn", { hasText: "Bugünün İşini Al" }).isVisible().catch(() => false)); i++) {
  const advance = page.locator(".office-get-job-btn", { hasText: /Yeni Güne Geç|Tekrar Dene/ });
  if (await advance.isVisible().catch(() => false)) await advance.click({ timeout: 800 }).catch(() => {});
  else await page.locator("button.phone-continue, .work-task-screen .choice-btn, .quick-call-screen .choice-btn, .choice-btn").first().click({ timeout: 800 }).catch(() => {});
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(500);
}
const getJob = page.locator(".office-get-job-btn", { hasText: "Bugünün İşini Al" });
await getJob.click({ timeout: 5000 });
await page.waitForTimeout(400);
assert(await page.locator("text=çok yorgun").isVisible().catch(() => false), "at 5 energy the job is gated behind Enerji Molası");
await page.locator("button.market-close").first().click({ timeout: 2000 }).catch(() => {});

// Three real hours pass while the app stays open in the office.
await page.evaluate(() => {
  const real = Date.now.bind(Date);
  Date.now = () => real() + 3 * 3600e3;
  document.dispatchEvent(new Event("visibilitychange"));
});
await page.waitForTimeout(400);
await getJob.click({ timeout: 5000 });
await page.waitForTimeout(600);
assert(!(await page.locator("text=çok yorgun").isVisible().catch(() => false)), "after 3h in the office energy refilled and the job opens");

assert(errors.length === 0, `no page errors (${errors.join(" | ")})`);
await browser.close();
process.exit(failed ? 1 : 0);
