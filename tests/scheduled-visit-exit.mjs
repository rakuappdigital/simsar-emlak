// Regression test for two fixes:
// 1) A visit rescheduled via İşler ("Kabul Et" on the customer's new date)
//    used to hide "Yeni Güne Geç" — the only thing that counts the
//    appointment down — soft-locking the run.
// 2) Settings' "Oyunu Bitir" returns a mid-run player to the main menu.
// Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:5173 node tests/scheduled-visit-exit.mjs
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
    investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 80, pendingDeliveries: [],
    pendingCallbacks: [],
    pausedVisit: { houseId: housesMod.allHouses[3].id, contactName: "Test Müşteri", status: "scheduled", daysRemaining: 2 },
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
// Dismiss any incidental popup (daily reward etc.) sitting over the office.
await page.keyboard.press("Escape").catch(() => {});

const advance = page.locator(".office-get-job-btn", { hasText: "Yeni Güne Geç" });
assert(await advance.isVisible({ timeout: 5000 }).catch(() => false), "advance-day button is visible while a visit is scheduled");
assert((await advance.textContent())?.includes("2 gün"), "button shows 2 days to the appointment");

await advance.click();
await page.waitForTimeout(400);
let saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE_KEY);
assert(saved.pausedVisit?.status === "scheduled" && saved.pausedVisit?.daysRemaining === 1, "first advance counts down to 1 day and is saved");
assert((await advance.textContent())?.includes("1 gün"), "button now shows 1 day");

await advance.click();
await page.waitForTimeout(400);
saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE_KEY);
assert(saved.pausedVisit?.status === "office", "second advance makes the customer available (status office) and is saved");
assert(
  await page.locator(".office-get-job-btn", { hasText: "İşler'de bekliyor" }).isVisible().catch(() => false),
  "office now points the player to the waiting customer in Jobs",
);

// "Oyunu Bitir" from the in-game settings.
await page.locator(".jetton-pill").click();
await page.waitForTimeout(300);
await page.locator("button", { hasText: "Oyunu Bitir" }).click({ timeout: 3000 });
await page.locator("button", { hasText: "Evet, Bitir" }).click({ timeout: 3000 });
await page.waitForTimeout(500);
assert(await page.locator("text=Kayıtlı Oyunlar").isVisible().catch(() => false), "End Game returns to the main menu");
saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE_KEY);
assert(saved?.index === 3 && saved.pausedVisit?.status === "office", "save is intact after ending the game");

await page.locator("text=Ayarlar").click();
await page.waitForTimeout(300);
assert(!(await page.locator("button", { hasText: "Oyunu Bitir" }).isVisible().catch(() => false)), "End Game is hidden when settings is opened from the main menu");

assert(errors.length === 0, `no page errors${errors.length ? ": " + errors.join(" | ") : ""}`);
await browser.close();
process.exit(failed ? 1 : 0);
