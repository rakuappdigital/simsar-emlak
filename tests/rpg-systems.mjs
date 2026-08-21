// Checked-in regression test for the 5 RPG systems added in this session:
// skill tree, rival ladder, district dominance, friend bond milestones,
// time-traveler flashback. Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/rpg-systems.mjs
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
  const skillMod = await import("/src/data/skillTree.ts");
  const rivalMod = await import("/src/data/rivalLadder.ts");
  const mapMod = await import("/src/data/istanbulMap.ts");
  const scoringMod = await import("/src/data/scoring.ts");
  const bondMod = await import("/src/data/friendBondMilestones.ts");
  const flashbackMod = await import("/src/data/timeTravelerFlashback.ts");
  const housesMod = await import("/src/data/houses.ts");
  const introMod = await import("/src/data/introFlavor.ts");

  const out = {};
  out.skillCount = skillMod.skillTree.length;
  out.canUnlockTier1WithEnoughXP = skillMod.canUnlockSkill(skillMod.skillTree[0], [], 20);
  out.cannotUnlockTier1WithoutXP = skillMod.canUnlockSkill(skillMod.skillTree[0], [], 5) === false;
  out.cannotUnlockTier2WithoutTier1 =
    skillMod.canUnlockSkill(skillMod.skillTree.find((s) => s.tier === 2 && s.branch === "sakin-kafa"), [], 100) === false;
  out.xpSold = skillMod.xpForOutcome("sold");
  out.xpLost = skillMod.xpForOutcome("lost");

  out.rivalCount = rivalMod.rivalLadder.length;
  out.firstRivalIsFirat = rivalMod.rivalLadder[0].id === "firat";
  out.activeRivalNoneDefeated = rivalMod.activeRivalFor([]).id === "firat";
  out.activeRivalAfterFiratDefeated = rivalMod.activeRivalFor(["firat"]).id === "nesrin";

  out.suspicionFactorNoSkills = scoringMod.skillSuspicionFactor([]);
  out.suspicionFactorAllThree = scoringMod.skillSuspicionFactor(["sakin-kafa-1", "sakin-kafa-2", "sakin-kafa-3"]);

  out.dominanceThreshold = mapMod.DISTRICT_DOMINANCE_THRESHOLD;
  const districtCounts = {};
  for (const h of housesMod.allHouses) {
    const d = mapMod.normalizeDistrict(introMod.districtOf(h.location));
    (districtCounts[d] ||= []).push(h.id);
  }
  const district = Object.keys(districtCounts).find((d) => districtCounts[d].length >= 3);
  const sameDistrictResults = districtCounts[district].slice(0, 3).map((id) => ({ houseId: id, outcome: "sold" }));
  out.isDominatedWithEnoughSales = mapMod.isDistrictDominated(sameDistrictResults, housesMod.allHouses, district);
  out.isNotDominatedWithNoSales = mapMod.isDistrictDominated([], housesMod.allHouses, district) === false;

  out.milestones = bondMod.FRIEND_BOND_MILESTONES;
  out.milestoneLineExists = !!bondMod.friendBondMilestoneLine("Ecrin", 3);
  out.milestoneLineNullForNonMilestone = bondMod.friendBondMilestoneLine("Ecrin", 4) === null;

  out.flashbackChance = flashbackMod.FLASHBACK_CHANCE;
  const fakeMemory = { id: "x", kind: "kurnaz-satis", houseTitle: "Test Ev", recordedAtIndex: 5 };
  out.flashbackTextHasHouseTitle = flashbackMod.flashbackTextFor(fakeMemory).paragraphs.some((p) => p.includes("Test Ev"));
  return out;
});

assert(data.skillCount === 6, "6 skills total (2 branches x 3 tiers)");
assert(data.canUnlockTier1WithEnoughXP, "can unlock tier1 with enough XP");
assert(data.cannotUnlockTier1WithoutXP, "cannot unlock tier1 without XP");
assert(data.cannotUnlockTier2WithoutTier1, "cannot unlock tier2 without tier1 owned");
assert(data.xpSold === 3, "sold gives 3 XP");
assert(data.xpLost === 1, "lost gives 1 XP");
assert(data.rivalCount === 5, "5 rivals on the ladder");
assert(data.firstRivalIsFirat, "first rival is Fırat Bey");
assert(data.activeRivalNoneDefeated, "active rival is Fırat with none defeated");
assert(data.activeRivalAfterFiratDefeated, "active rival advances after Fırat is defeated");
assert(data.suspicionFactorNoSkills === 1, "suspicion factor is 1 with no skills owned");
assert(Math.abs(data.suspicionFactorAllThree - 0.7947) < 0.01, "suspicion factor ~0.795 with all 3 sakin-kafa skills");
assert(data.dominanceThreshold === 3, "district dominance threshold is 3");
assert(data.isDominatedWithEnoughSales, "district counts as dominated with 3 sales");
assert(data.isNotDominatedWithNoSales, "district is not dominated with 0 sales");
assert(data.milestones.length === 3 && data.milestones.join(",") === "3,6,10", "3 friend bond milestones (3/6/10)");
assert(data.milestoneLineExists, "milestone line exists for a valid milestone count");
assert(data.milestoneLineNullForNonMilestone, "milestone line is null for a non-milestone count");
assert(data.flashbackChance <= 0.1, "flashback chance stays low (<=10%)");
assert(data.flashbackTextHasHouseTitle, "flashback text interpolates the referenced house title");

// UI: open Emlah menu, verify the new tabs render with the expected structure.
await page.getByText("Oyuna Başla").click();
await page.waitForTimeout(300);
await page.locator(".origin-card").first().click({ timeout: 5000 });
await page.waitForTimeout(800);
await page.locator(".wallet-pill-btn").first().click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(300);

async function openTab(label) {
  await page.locator(".emlah-tab-btn", { hasText: label }).first().click({ timeout: 3000 });
  await page.waitForTimeout(250);
}

await openTab("Beceriler");
const skillPanelText = await page.locator(".emlah-tab-content").innerText();
assert((await page.locator(".skill-row").count()) === 6, "Beceriler tab renders all 6 skill rows");
assert(skillPanelText.includes("XP"), "Beceriler tab mentions XP");

await openTab("Kariyer");
const careerText = (await page.locator(".emlah-tab-content").innerText()).toLocaleUpperCase("tr-TR");
assert((await page.locator(".rival-ladder-row").count()) === 5, "Kariyer tab shows all 5 rival ladder rows");
assert(careerText.includes("KURTLARI"), "Kariyer tab shows the Şehrin Kurtları section");

await openTab("Şehir Haritası");
assert((await page.locator(".city-map-canvas").count()) > 0, "Şehir Haritası still renders");

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nRPG SYSTEMS TEST FAILED");
  process.exit(1);
}
console.log("\nRPG SYSTEMS TEST PASSED");
