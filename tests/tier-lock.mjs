// Regression test for the portfolio (tier) lock gate. Before, a player who
// reached the first locked-tier house without meeting the requirements was
// permanently stuck (the gate only offered "Marketi Aç"). Covers:
// 1) requirements + missed-customer callback list on the gate,
// 2) a callback returns to the gate (not to the office of a locked house),
// 3) skip with too few jettons opens the store, "Geri" returns to the gate,
// 4) 50-jetton skip unlocks the tier and play continues on the new tier,
// 5) the normal market purchase path also continues to the next tier,
// 6) the next tier (3) gates again and the skip works there too.
// Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:5173 node tests/tier-lock.mjs
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

async function openWithSave({ index, soldCount, unlockedTiers, ownedPerks, jettons, bonusEarnings = 0 }) {
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(BASE_URL);
  await page.locator("button", { hasText: "Türkçe" }).click({ timeout: 3000 }).catch(() => {});
  await page.evaluate(
    async ({ key, index, soldCount, unlockedTiers, ownedPerks, jettons, bonusEarnings }) => {
      localStorage.setItem("simsar-emlak-full-unlock", "1");
      localStorage.setItem("simsar-emlak-jettons", String(jettons));
      const housesMod = await import("/src/data/houses.ts");
      const all = housesMod.allHouses;
      const houseOrder = all.map((h, i) => ({ t: h.tier, i })).sort((a, b) => a.t - b.t || a.i - b.i).map((x) => x.i);
      const results = Array.from({ length: index }, (_, k) => {
        const sold = k < soldCount;
        const outcome = sold ? "sold" : k % 2 ? "thinking" : "lost";
        return {
          houseId: all[houseOrder[k]].id,
          outcome,
          ...(sold ? { sale: { finalPrice: 1000000, commission: 30000, discountPercent: 0, streakBonus: 0, contractModifier: 0, rankBonus: 0 } } : {}),
          finalStats: { suspicion: 10, interest: 60, fun: 40, discountPercent: 0 },
          finalSuspicion: 10,
        };
      });
      const save = {
        version: 26, index, houseOrder, results,
        weekOutcomes: [], badges: [], ownedPerks, consumables: {}, unlockedTiers, spent: 0,
        inbox: [], castAssignment: {}, dailyQuest: null, bonusEarnings, pendingLoan: null, tasksCompleted: 0,
        chitchatBonuses: 0, premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [],
        investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 100, pendingDeliveries: [],
        pendingCallbacks: [], pausedVisit: null,
        bossMood: 60, firedSeasonalEventWeeks: [], voiceTally: { eglenceli: 0, samimi: 0, atilgan: 0 },
        origin: "ogretmen", compassTally: { durustluk: 0, kurnazlik: 0 }, significantMemories: [], originChoiceCount: 0,
        selfReflectionShown: true, unlockedFriendHouseIds: [], friendHouseResults: [],
        energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
        ownedSkillIds: [], skillXP: 0, defeatedRivalIds: [], friendBondCounts: {}, friendBondMilestonesShown: [],
        flashbackShown: true, secondChanceOffered: true, firedFatefulMomentIndices: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48],
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(save));
    },
    { key: SAVE_KEY, index, soldCount, unlockedTiers, ownedPerks, jettons, bonusEarnings },
  );
  await page.reload();
  await page.waitForTimeout(500);
  await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 5000 });
  await page.waitForTimeout(300);
  await page.locator(".pixel-btn").first().click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  return page;
}

const gate = (page) => page.locator(".locked-preview");
const saved = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE_KEY);

// --- Tier 2 gate: 1 sale, no office item, no jettons ---
let page = await openWithSave({ index: 11, soldCount: 1, unlockedTiers: [1], ownedPerks: [], jettons: 0 });
assert(await gate(page).isVisible(), "first tier-2 house shows the lock gate");
assert((await page.locator(".locked-requirements").textContent()).includes("1/3"), "gate shows sales progress 1/3");
const callbacks = page.locator(".locked-callback-btn");
const before = await callbacks.count();
assert(before === 10, `gate lists the 10 missed customers (got ${before})`);
assert(await page.locator("text=ufak bir yardımla bu kısmı atlayabilirsin").isVisible(), "skip text is shown");

// Callback → negotiate → back to the gate.
await callbacks.first().click();
await page.waitForTimeout(1500);
for (let i = 0; i < 40 && !(await gate(page).isVisible().catch(() => false)); i++) {
  (await page.locator(".contract-modal button.pixel-btn:not([disabled])").first().click({ timeout: 400 }).then(() => true).catch(() => false)) ||
    (await page.evaluate(() => {
      // One option per clause that has nothing selected yet.
      const clauses = [...document.querySelectorAll(".contract-modal .contract-clause")];
      const open = clauses.find((c) => !c.querySelector("button.selected"));
      const o = open?.querySelector("button");
      o?.click();
      return !!o;
    })) ||
    (await page.locator(".phone-choices .choice-btn").first().click({ timeout: 400 }).then(() => true).catch(() => false)) ||
    (await page.locator("button.phone-continue").first().click({ timeout: 400 }).then(() => true).catch(() => false));
  await page.waitForTimeout(700);
}
assert(await gate(page).isVisible(), "after the callback the player is back on the lock gate (not the office)");
assert((await page.locator(".office-get-job-btn").count()) === 0, "no 'Bugünün İşini Al' for the locked house");
assert((await callbacks.count()) === before - 1, "called-back customer drops off the list");

// Not enough jettons → store → back to gate.
await page.locator(".locked-skip-btn").click();
await page.waitForTimeout(500);
assert((await gate(page).count()) === 0 && (await page.locator("text=Jetton").count()) > 0, "skip without jettons opens the store");
await page.locator("button.menu-btn.ghost", { hasText: /^(Geri|Back)$/ }).click();
await page.waitForTimeout(500);
assert(await gate(page).isVisible(), "store 'Geri' returns to the lock gate");
await page.close();

// --- 50-jetton skip ---
page = await openWithSave({ index: 11, soldCount: 1, unlockedTiers: [1], ownedPerks: [], jettons: 60 });
await page.locator(".locked-skip-btn").click();
await page.waitForTimeout(1200);
let s = await saved(page);
assert((await gate(page).count()) === 0, "50-jetton skip leaves the gate");
assert(s.unlockedTiers.includes(2) && s.ownedPerks.includes("portfoy-tier2"), "tier 2 unlocked + perk owned (saved)");
assert((await page.evaluate(() => localStorage.getItem("simsar-emlak-jettons"))) === "10", "50 jettons were spent (60 → 10)");
const houseTier = await page.evaluate(async (k) => {
  const s = JSON.parse(localStorage.getItem(k));
  const all = (await import("/src/data/houses.ts")).allHouses;
  return all[s.houseOrder[s.index]].tier;
}, SAVE_KEY);
assert(houseTier === 2, "play continues on a tier-2 house");
await page.close();

// --- Normal purchase path ---
page = await openWithSave({ index: 11, soldCount: 3, unlockedTiers: [1], ownedPerks: ["not-defteri"], jettons: 0, bonusEarnings: 300000 });
assert(await gate(page).isVisible(), "gate shown before buying");
await page.locator(".locked-preview button", { hasText: "Çarşıyı Aç" }).click();
await page.waitForTimeout(600);
await page.locator(".market-item", { hasText: "Orta Segment Evler" }).locator("button.pixel-btn.small:not([disabled])").first().click();
await page.waitForTimeout(300);
await page.locator("button.purchase-confirm-buy").click();
await page.waitForTimeout(300);
await page.locator(".market-close").first().click().catch(() => {});
await page.waitForTimeout(1200);
s = await saved(page);
assert(s.unlockedTiers.includes(2) && (await gate(page).count()) === 0, "buying the tier-2 upgrade moves past the gate");
await page.close();

// --- Tier 3 gate ---
page = await openWithSave({ index: 22, soldCount: 4, unlockedTiers: [1, 2], ownedPerks: ["portfoy-tier2"], jettons: 50 });
assert(await gate(page).isVisible(), "first tier-3 house shows the lock gate again");
assert((await page.locator(".locked-requirements").textContent()).includes("4/8"), "tier-3 gate shows sales 4/8");
await page.locator(".locked-skip-btn").click();
await page.waitForTimeout(1200);
s = await saved(page);
assert(s.unlockedTiers.includes(3) && s.ownedPerks.includes("portfoy-tier3") && (await gate(page).count()) === 0, "tier-3 skip works and play continues");
await page.close();

assert(errors.length === 0, `no page errors (${errors.join(" | ")})`);
await browser.close();
process.exit(failed ? 1 : 0);
