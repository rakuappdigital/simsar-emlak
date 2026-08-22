// Checked-in regression test for the v21 save/load round trip — guards
// against the exact stale-closure class of bug found this session (a
// synchronous persist() inside proceedToHouseIntro's callback branch was
// dropping freshly-restored state back to defaults). Assumes a server is
// already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/save-roundtrip.mjs
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

// index:16 is deliberately >0 and not on a week boundary, so continueSaved's
// synchronous chain runs through proceedToHouseIntro's non-trivial branches
// (callback roll included) right after restoring state — exactly where the
// bug was found.
await page.evaluate(async () => {
  const housesMod = await import("/src/data/houses.ts");
  const save = {
    version: 22, index: 16,
    houseOrder: housesMod.allHouses.map((_, i) => i),
    results: Array.from({ length: 16 }, (_, i) => ({
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
    origin: "ogretmen", compassTally: { durustluk: 0, kurnazlik: 0 },
    significantMemories: [{ id: "m1", kind: "kurnaz-satis", houseTitle: "Test Anı Evi", recordedAtIndex: 2 }],
    originChoiceCount: 0,
    selfReflectionShown: true, unlockedFriendHouseIds: ["ecrin-isik-kuyulu-loft"], friendHouseResults: [],
    energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
    ownedSkillIds: ["sakin-kafa-1", "karizma-1"], skillXP: 12,
    defeatedRivalIds: ["firat"],
    friendBondCounts: { ecrin: 2 }, friendBondMilestonesShown: [],
    flashbackShown: false,
    secondChanceOffered: false,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("simsar-emlak-save-v22-slot0", JSON.stringify(save));
});
await page.reload();
await page.waitForTimeout(500);
await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 5000 });
await page.waitForTimeout(300);
await page.locator(".pixel-btn").first().click({ timeout: 5000 });
// Deliberately no wait here — the bug this guards against corrupted the
// save in the SAME synchronous tick as the click, before any render.
const restored = await page.evaluate(() => {
  const raw = localStorage.getItem("simsar-emlak-save-v22-slot0");
  return raw ? JSON.parse(raw) : null;
});

assert(restored?.index === 16, "index restored");
assert(JSON.stringify(restored?.ownedSkillIds) === JSON.stringify(["sakin-kafa-1", "karizma-1"]), "ownedSkillIds survives the very first post-load save");
assert(restored?.skillXP === 12, "skillXP survives the very first post-load save");
assert(JSON.stringify(restored?.defeatedRivalIds) === JSON.stringify(["firat"]), "defeatedRivalIds survives the very first post-load save");
assert(restored?.friendBondCounts?.ecrin === 2, "friendBondCounts survives the very first post-load save");
assert(restored?.unlockedFriendHouseIds?.[0] === "ecrin-isik-kuyulu-loft", "unlockedFriendHouseIds survives the very first post-load save");
assert(restored?.selfReflectionShown === true, "selfReflectionShown survives the very first post-load save");

// Also verify the Rehber/Arkadaşlarım tabs actually reflect the restored data end-to-end.
await page.waitForTimeout(500);
await page.locator(".wallet-pill-btn").first().click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(300);
await page.locator(".emlah-tab-btn", { hasText: "Arkadaşlarım" }).first().click({ timeout: 3000 });
await page.waitForTimeout(250);
const friendTabText = await page.locator(".emlah-tab-content").innerText();
assert(friendTabText.includes("Işık Kuyulu Loft"), "Arkadaşlarım tab shows the restored unlocked house");

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nSAVE ROUND-TRIP TEST FAILED");
  process.exit(1);
}
console.log("\nSAVE ROUND-TRIP TEST PASSED");
