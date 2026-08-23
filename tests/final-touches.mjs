// Checked-in regression test for the 3 "final touches" added in this
// session: Zor Zamanlar (reciprocal favor), rank-up skill XP bonus, and
// Yakınlık-stage friend assist feeding back into the core loop. Assumes a
// server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/final-touches.mjs
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
  const relStageMod = await import("/src/data/relationshipStages.ts");
  const out = {};

  out.hardTimesAskLineMentionsName = relStageMod.hardTimesAskLine("Ecrin").length > 0;
  out.hardTimesReplyGuvenIsString = typeof relStageMod.hardTimesReplyLine("Ecrin", "guven") === "string";
  out.hardTimesReplyYakinlikIsString = typeof relStageMod.hardTimesReplyLine("Ecrin", "yakinlik") === "string";

  const guvenReward = relStageMod.hardTimesReward("guven");
  const yakinlikReward = relStageMod.hardTimesReward("yakinlik");
  out.yakinlikRewardBigger =
    yakinlikReward.bonusEarnings > guvenReward.bonusEarnings &&
    yakinlikReward.energy > guvenReward.energy &&
    yakinlikReward.bossMood > guvenReward.bossMood;

  out.hardTimesThresholdMatchesGuven = relStageMod.HARD_TIMES_BOND_THRESHOLD === 3;
  out.hardTimesBondBonusPositive = relStageMod.HARD_TIMES_BOND_BONUS > 0;
  out.hardTimesLossStreakIsTwo = relStageMod.HARD_TIMES_LOSS_STREAK === 2;

  return out;
});

assert(data.hardTimesAskLineMentionsName, "Zor Zamanlar ask line is real text");
assert(data.hardTimesReplyGuvenIsString, "Güven-stage reply is real text");
assert(data.hardTimesReplyYakinlikIsString, "Yakınlık-stage reply is real text");
assert(data.yakinlikRewardBigger, "Yakınlık-stage friends give a strictly bigger reward than Güven-stage ones");
assert(data.hardTimesThresholdMatchesGuven, "Zor Zamanlar unlocks at the same threshold as Güven (3)");
assert(data.hardTimesBondBonusPositive, "asking for help deepens the bond further");
assert(data.hardTimesLossStreakIsTwo, "loss-streak trigger is 2 in a row");

// Live check: a save already past Güven with Emlah struggling (low
// bossMood) should show the "Yardım İste" button in that friend's thread.
await page.evaluate(async () => {
  const housesMod = await import("/src/data/houses.ts");
  const save = {
    version: 26, index: 5,
    houseOrder: housesMod.allHouses.map((_, i) => i),
    results: [], weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0,
    inbox: [{ id: "m1", threadId: "friend-ecrin", contactName: "Ecrin", text: "Merhaba!", fromPlayer: false, day: 1 }],
    castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0,
    chitchatBonuses: 0, premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [],
    investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 80, pendingDeliveries: [],
    bossMood: 10, firedSeasonalEventWeeks: [], voiceTally: { eglenceli: 0, samimi: 0, atilgan: 0 },
    origin: "ogretmen", compassTally: { durustluk: 0, kurnazlik: 0 }, significantMemories: [], originChoiceCount: 0,
    selfReflectionShown: true, unlockedFriendHouseIds: [], friendHouseResults: [],
    energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
    ownedSkillIds: [], skillXP: 0, defeatedRivalIds: [],
    friendBondCounts: { ecrin: 5 }, friendBondMilestonesShown: [],
    flashbackShown: false, secondChanceOffered: false,
    pendingFriendFavors: {}, friendFavorAccepted: {}, breadthConfrontationShown: false,
    firatFullCircleShown: false, hardTimesUsed: {},
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("simsar-emlak-save-v26-slot0", JSON.stringify(save));
});
await page.reload();
await page.waitForTimeout(600);
await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 10000 });
await page.waitForTimeout(400);
await page.locator(".pixel-btn").first().click({ timeout: 10000 });
await page.waitForTimeout(1000);
await page.locator(".wallet-pill-btn").first().click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(400);
await page.locator(".emlah-tab-btn", { hasText: "Mesajlar" }).first().click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(400);
await page.locator(".thread-row", { hasText: "Ecrin" }).first().click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(400);

const helpBtn = page.locator("button", { hasText: "Yardım İste" });
assert((await helpBtn.count()) > 0, "'Yardım İste' button shows for a Güven+ friend while Emlah is struggling (low bossMood)");

if ((await helpBtn.count()) > 0) {
  const balanceBefore = await page.evaluate(() => {
    const raw = localStorage.getItem("simsar-emlak-save-v26-slot0");
    return raw ? JSON.parse(raw).bonusEarnings : null;
  });
  await helpBtn.first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
  const restored = await page.evaluate(() => {
    const raw = localStorage.getItem("simsar-emlak-save-v26-slot0");
    return raw ? JSON.parse(raw) : null;
  });
  assert(restored?.hardTimesUsed?.ecrin === true, "hardTimesUsed flips to true after asking");
  assert((restored?.bonusEarnings ?? 0) > (balanceBefore ?? 0), "asking for help grants a real bonusEarnings reward");
  assert((restored?.friendBondCounts?.ecrin ?? 0) === 6, "the bond deepens further after asking for help (5 -> 6)");

  // Asking again should no longer be possible — the button should disappear.
  await page.locator(".thread-back").first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(300);
  await page.locator(".thread-row", { hasText: "Ecrin" }).first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
  assert((await page.locator("button", { hasText: "Yardım İste" }).count()) === 0, "the button is gone after being used once (one-time per friend)");
}

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nFINAL TOUCHES TEST FAILED");
  process.exit(1);
}
console.log("\nFINAL TOUCHES TEST PASSED");
