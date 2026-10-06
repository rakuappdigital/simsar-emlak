import { chromium } from "playwright";
import { openEmlahTab } from "./helpers/emlah.mjs";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });

await page.goto(BASE_URL);
await page.waitForTimeout(500);
await page.locator("button", { hasText: "English" }).click({ timeout: 5000 });
await page.waitForTimeout(500);

// Seed a save with plenty of balance so Market/Inventory buttons are enabled.
await page.evaluate(async () => {
  const housesMod = await import("/src/data/houses.ts");
  const save = {
    version: 26,
    index: 3,
    houseOrder: housesMod.allHouses.map((_, i) => i),
    results: [0, 1, 2].map((i) => ({
      houseId: housesMod.allHouses[i].id,
      outcome: "sold",
      sale: { finalPrice: 5000000, commission: 500000, discountPercent: 0, streakBonus: 0, contractModifier: 0, rankBonus: 0 },
      finalStats: { suspicion: 20, interest: 30, fun: 25, discountPercent: 0 },
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
    ownedSkillIds: [], skillXP: 0, defeatedRivalIds: [],
    friendBondCounts: {}, friendBondMilestonesShown: [],
    flashbackShown: true, secondChanceOffered: false,
    pendingFriendFavors: {}, friendFavorAccepted: {}, breadthConfrontationShown: true,
    firatFullCircleShown: true, hardTimesUsed: {}, firedFatefulMomentIndices: [],
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("simsar-emlak-save-v26-slot0", JSON.stringify(save));
  localStorage.setItem("simsar-emlak-jettons", "50");
});
await page.reload();
await page.waitForTimeout(800);
await page.locator("text=Saved Games").click({ timeout: 15000 });
await page.waitForTimeout(500);
await page.locator(".pixel-btn").first().click({ timeout: 15000 });
await page.waitForTimeout(1500);
await page.locator(".rankup-overlay").click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(500);

// Open the wallet menu -> Market tab
await page.locator(".wallet-pill-btn").first().click({ timeout: 5000 });
await page.waitForTimeout(500);

const firstBuyBtn = page.locator(".market-item button:not([disabled])").first();
await firstBuyBtn.click({ timeout: 5000 });
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/market-confirm-modal.png" });

await page.locator(".purchase-confirm-cancel").click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(300);
await openEmlahTab(page, "Inventory");
await page.waitForTimeout(500);
const firstInvBuyBtn = page.locator(".market-item button:not([disabled])").first();
await firstInvBuyBtn.click({ timeout: 5000 });
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/inventory-confirm-modal.png" });

await browser.close();
console.log("done");
