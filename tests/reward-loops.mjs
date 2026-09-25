// Checked-in regression test for the reward/spend loops the user flagged as
// "hayati" (vital) — mini-game energy rewards, rewarded-ad energy, jetton-
// for-energy spend, jetton package purchases, and a jetton-bought inventory
// item's actual gameplay effect (Suspicion Shield lowering the next house's
// starting suspicion). Every one of these is exercised live, not just
// checked for UI presence. Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/reward-loops.mjs
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
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
});

await page.goto(BASE_URL);
await page.locator("button", { hasText: "English" }).click({ timeout: 5000 });
await page.waitForTimeout(400);

// Seed a save at house index 1 (position 1 in week, so we can independently
// compute the expected baseline suspicion for the shield check later),
// low energy so the office routes straight into Enerji Molası, and 20
// starting jettons.
await page.evaluate(async () => {
  const housesMod = await import("/src/data/houses.ts");
  const save = {
    version: 26, index: 1,
    houseOrder: housesMod.allHouses.map((_, i) => i),
    results: [{ houseId: housesMod.allHouses[0].id, outcome: "sold", sale: { finalPrice: 1000000, commission: 30000, discountPercent: 0, streakBonus: 0, contractModifier: 0, rankBonus: 0 }, finalStats: { suspicion: 20, interest: 30, fun: 25, discountPercent: 0 }, finalSuspicion: 20 }],
    weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0,
    inbox: [{ id: "seed", threadId: housesMod.allHouses[0].id, contactName: "Test", text: "merhaba", fromPlayer: false, day: 1 }],
    castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0,
    chitchatBonuses: 0, premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [],
    investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 15, pendingDeliveries: [],
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
  localStorage.setItem("simsar-emlak-jettons", "20");
  // Full unlock so advancing past house index 2 doesn't hit the demo paywall
  // (DEMO_HOUSE_LIMIT=2) — this test is about the reward/spend loops, not the
  // demo gate itself.
  localStorage.setItem("simsar-emlak-full-unlock", "1");
});
await page.reload();
await page.waitForTimeout(700);
await page.locator("text=Saved Games").click({ timeout: 10000 });
await page.waitForTimeout(400);
await page.locator(".pixel-btn").first().click({ timeout: 10000 });
await page.waitForTimeout(1000);
await page.locator(".rankup-overlay").click({ timeout: 2000 }).catch(() => {});
await page.waitForTimeout(300);

// A random "Staging" pre-house prep scene (choice-btn options) can appear
// before the office screen — clear it if present so office-get-job-btn shows up.
for (let i = 0; i < 5 && !(await page.locator(".office-get-job-btn").count()); i++) {
  const choice = page.locator(".choice-btn").first();
  if (await choice.count()) {
    await choice.click({ timeout: 1500, force: true }).catch(() => {});
    await page.waitForTimeout(500);
  } else {
    break;
  }
}

async function readEnergyPct() {
  const style = await page.locator(".energy-fill").getAttribute("style").catch(() => null);
  const m = style?.match(/width:\s*([\d.]+)%/);
  return m ? Number(m[1]) : null;
}
async function readJettons() {
  // The header jetton-pill only exists on the game/office screen; the
  // Settings screen shows its own "Your balance: 🪙 N" line instead.
  if (await page.locator(".jetton-pill").count()) {
    const text = await page.locator(".jetton-pill").innerText();
    const m = text.match(/(\d+)/);
    return m ? Number(m[1]) : null;
  }
  const bodyText = await page.locator("body").innerText();
  const m = bodyText.match(/Your balance:\s*🪙\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

// ---------- 1) Mini-game energy reward ----------
await page.locator(".office-get-job-btn").waitFor({ state: "visible", timeout: 15000 });
await page.locator(".office-get-job-btn").click({ timeout: 10000, force: true }); // dayAdvanced already true isn't guaranteed; handle both
await page.waitForTimeout(500);
if (await page.locator(".office-get-job-btn").count()) {
  // was "Advance to New Day" the first time — click again for "Get Today's Job"
  await page.locator(".office-get-job-btn").click({ timeout: 5000 });
  await page.waitForTimeout(500);
}
assert((await page.locator(".energy-break-modal").count()) > 0, "low energy routes straight into Enerji Molası when getting today's job");

const energyBefore = await readEnergyPct();
await page.locator(".energy-break-card", { hasText: "Find the Key" }).click({ timeout: 5000 });
await page.waitForTimeout(300);
// Click the visually-marked correct key fast (well under the 2000ms "great" cutoff).
await page.locator(".minigame-key-correct").click({ timeout: 3000 });
await page.waitForTimeout(1200); // finish() has a 700ms settle delay before onComplete fires
const energyAfterMinigame = await readEnergyPct();
assert(
  energyBefore !== null && energyAfterMinigame !== null && energyAfterMinigame > energyBefore,
  `completing the key-find mini-game with a fast/correct pick actually increases energy (before=${energyBefore}, after=${energyAfterMinigame})`,
);

// ---------- 2) Jetton-for-energy spend ----------
const jettonsBeforeSpend = await readJettons();
await page.locator(".energy-break-card", { hasText: "Jetton Kullan" }).click({ timeout: 5000 }).catch(async () => {
  await page.locator(".energy-break-card", { hasText: "Use Tokens" }).click({ timeout: 5000 });
});
await page.waitForTimeout(400);
const jettonsAfterSpend = await readJettons();
const energyAfterJettonSpend = await readEnergyPct();
assert(
  jettonsBeforeSpend !== null && jettonsAfterSpend !== null && jettonsAfterSpend === jettonsBeforeSpend - 2,
  `spending jettons on energy actually deducts exactly 2 jettons (before=${jettonsBeforeSpend}, after=${jettonsAfterSpend})`,
);
assert(
  energyAfterMinigame !== null && energyAfterJettonSpend !== null && energyAfterJettonSpend > energyAfterMinigame,
  `spending jettons on energy actually increases energy (before=${energyAfterMinigame}, after=${energyAfterJettonSpend})`,
);

// ---------- 3) Rewarded-ad energy gain ----------
const energyBeforeAd = await readEnergyPct();
await page.locator(".energy-break-card", { hasText: "Watch Ad" }).click({ timeout: 5000 }).catch(async () => {
  await page.locator(".energy-break-card", { hasText: "Reklam İzle" }).click({ timeout: 5000 });
});
await page.waitForTimeout(1500); // mock showRewardedAd() resolves after ~900ms in non-native env
const energyAfterAd = await readEnergyPct();
assert(
  energyBeforeAd !== null && energyAfterAd !== null && energyAfterAd >= energyBeforeAd,
  `watching the rewarded ad actually increases (or caps out) energy (before=${energyBeforeAd}, after=${energyAfterAd})`,
);

// Close the energy break modal.
await page.locator(".market-close").first().click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(300);

// ---------- 4) Jetton package purchase (mock purchase always succeeds off-native) ----------
await page.locator(".jetton-pill").click({ timeout: 5000 });
await page.waitForTimeout(400);
const jettonsBeforePurchase = await readJettons();
await page.locator(".day-activity-card", { hasText: "20 Jetton" }).click({ timeout: 5000 });
await page.waitForTimeout(600);
const jettonsAfterPurchase = await readJettons();
assert(
  jettonsBeforePurchase !== null && jettonsAfterPurchase !== null && jettonsAfterPurchase === jettonsBeforePurchase + 20,
  `buying the 20-jetton package actually credits 20 jettons (before=${jettonsBeforePurchase}, after=${jettonsAfterPurchase})`,
);

// ---------- 5) Jetton-bought inventory item: purchase + real gameplay effect ----------
await page.locator("button", { hasText: "Back" }).click({ timeout: 5000 });
await page.waitForTimeout(400);
await page.locator(".wallet-pill-btn").first().click({ timeout: 5000 });
await page.waitForTimeout(400);
await page.locator('.emlah-tab-btn:has-text("Inventory")').click({ timeout: 5000 });
await page.waitForTimeout(400);
const jettonsBeforeShield = await readJettons();
await page.locator(".market-item", { hasText: "Suspicion Shield" }).locator("button").click({ timeout: 5000 });
await page.waitForTimeout(400);
await page.locator(".purchase-confirm-buy").click({ timeout: 5000 });
await page.waitForTimeout(500);
const jettonsAfterShield = await readJettons();
assert(
  jettonsBeforeShield !== null && jettonsAfterShield !== null && jettonsAfterShield === jettonsBeforeShield - 3,
  `buying Suspicion Shield actually deducts exactly 3 jettons (before=${jettonsBeforeShield}, after=${jettonsAfterShield})`,
);

const shieldPersisted = await page.evaluate(() => localStorage.getItem("simsar-emlak-suspicion-shield-houses"));
assert(shieldPersisted === "3", `Suspicion Shield purchase actually persists a 3-house counter (got ${shieldPersisted})`);

// The shield was bought WHILE viewing house index 1 — proceedToHouseIntro
// for house 1 already ran (at continueSaved() time), so it discounts
// starting from the NEXT transition (house 1 -> house 2), not house 1
// itself. Play house 1's negotiation for real (generic "click whatever's
// available" loop) to trigger that transition, then compare house 2's
// actual opening suspicion against the analytically-expected baseline.
const expectedBaseline = await page.evaluate(async () => {
  const scoringMod = await import("/src/data/scoring.ts");
  return scoringMod.computeFreshStats(2, [], {}).suspicion;
});
await page.locator(".market-close").first().click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(300);
await page.locator(".office-get-job-btn").click({ timeout: 5000, force: true });
await page.waitForTimeout(1200);
if (await page.locator(".office-get-job-btn", { hasText: "Get Today's Job" }).count()) {
  await page.locator(".office-get-job-btn").click({ timeout: 5000, force: true });
  await page.waitForTimeout(1200);
}

async function reachedHouse2() {
  const header = await page.locator(".subtitle").innerText().catch(() => "");
  return header.includes("House 3/54") || header.includes("Ev 3/54");
}

const clickLog = [];
for (let i = 0; i < 150 && !(await reachedHouse2()); i++) {
  let clicked = false;

  if (await page.locator(".contract-modal").count()) {
    // Contract modal needs one option picked per clause (not just "any unselected
    // option anywhere"), otherwise a generic ":not(.selected)" clicker just toggles
    // back and forth between options within a single already-decided clause forever.
    const clauses = page.locator(".contract-clause");
    const clauseCount = await clauses.count();
    for (let c = 0; c < clauseCount; c++) {
      const clause = clauses.nth(c);
      const hasSelected = await clause.locator(".contract-option-btn.selected").count();
      if (!hasSelected) {
        await clause.locator(".contract-option-btn").first().click({ timeout: 1500, force: true }).catch(() => {});
        clicked = true;
        clickLog.push("contract-clause-pick");
        break;
      }
    }
    if (!clicked) {
      const submit = page.locator(".contract-modal .pixel-btn:not(:disabled)").first();
      if (await submit.count()) {
        await submit.click({ timeout: 1500, force: true }).catch(() => {});
        clicked = true;
        clickLog.push("contract-submit");
      }
    }
  } else {
    const clickers = [".phone-continue", ".choice-btn", ".result-screen .pixel-btn", ".pixel-btn.small:not(:disabled)", ".pixel-btn:not(:disabled)"];
    for (const sel of clickers) {
      const el = page.locator(sel).first();
      if (await el.count()) {
        await el.click({ timeout: 1500, force: true }).catch(() => {});
        clicked = true;
        clickLog.push(sel);
        break;
      }
    }
  }

  await page.waitForTimeout(clicked ? 500 : 400);
}

const reachedTarget = await reachedHouse2();
await page.screenshot({ path: "/tmp/debug-after-negotiation-loop.png" });
const finalHeader = await page.locator(".subtitle").innerText().catch(() => "<no subtitle>");
console.log(`  debug: final header = "${finalHeader}"`);
if (!reachedTarget) console.log(`  debug: click log (last 20) = ${JSON.stringify(clickLog.slice(-20))}`);
assert(reachedTarget, "playing through house 1's real negotiation actually reaches house 2 (transition didn't get stuck)");

// House 3/54's header can show slightly before its DialogueScene/StatsBar
// finishes mounting (e.g. an office-chore interjection or intro messages
// in between) — poll briefly instead of reading immediately.
let suspicionStyle = null;
const clickLog2 = [];
for (let i = 0; i < 30; i++) {
  suspicionStyle = await page.locator(".stat-fill.suspicion").getAttribute("style").catch(() => null);
  if (suspicionStyle) break;
  // Keep advancing through whatever's in between (phone continues, office get-job, etc.).
  let matched = false;
  for (const sel of [".phone-continue", ".office-get-job-btn", ".choice-btn", ".result-screen .pixel-btn", ".pixel-btn.small:not(:disabled)", ".pixel-btn:not(:disabled)"]) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      const txt = await el.innerText().catch(() => "");
      await el.click({ timeout: 1500, force: true }).catch(() => {});
      clickLog2.push(`${sel}:"${txt}"`);
      matched = true;
      break;
    }
  }
  if (!matched) clickLog2.push("<nothing matched>");
  await page.waitForTimeout(500);
}
if (!suspicionStyle) {
  console.log(`  debug: loop2 click log = ${JSON.stringify(clickLog2)}`);
  await page.screenshot({ path: "/tmp/debug-loop2-stuck.png" });
  const bodyClasses = await page.evaluate(() => document.querySelector("#root > div")?.className || document.body.innerHTML.slice(0, 500));
  console.log(`  debug: root div class / body snippet = ${bodyClasses}`);
}
const suspicionMatch = suspicionStyle?.match(/width:\s*([\d.]+)%/);
const actualSuspicion = suspicionMatch ? Number(suspicionMatch[1]) : null;
const expectedWithShield = Math.max(0, expectedBaseline - 12);
assert(
  actualSuspicion !== null && Math.abs(actualSuspicion - expectedWithShield) < 0.5,
  `Suspicion Shield's -12 discount actually lands on house 2's opening suspicion (baseline=${expectedBaseline}, expected-with-shield=${expectedWithShield}, actual=${actualSuspicion})`,
);

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
console.log(failed ? "\nREWARD LOOPS TEST FAILED" : "\nREWARD LOOPS TEST PASSED");
process.exit(failed ? 1 : 0);
