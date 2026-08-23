// Checked-in regression test for "Kader Anları" — 3 fixed, origin-specific,
// one-time narrative beats across the 54-house arc. Assumes a server is
// already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/fateful-moments.mjs
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
  const fatefulMod = await import("/src/data/fatefulMoments.ts");
  const origins = ["ogretmen", "emlakci-ailesi", "girisimci", "yurtdisi"];
  const out = {};

  out.indexCount = fatefulMod.FATEFUL_MOMENT_INDICES.length;
  // None of the 3 fixed indices should land on the first/last house of a
  // week (HOUSES_PER_WEEK = 5) — those already have their own dedicated beats.
  out.noneOnWeekBoundary = fatefulMod.FATEFUL_MOMENT_INDICES.every((i) => i % 5 !== 0 && i % 5 !== 4);

  // All 12 combinations (3 beats x 4 origins) must resolve to real content.
  out.allCombinationsResolve = fatefulMod.FATEFUL_MOMENT_INDICES.every((index) =>
    origins.every((origin) => {
      const moment = fatefulMod.fatefulMomentFor(index, origin);
      return !!moment && moment.title.length > 0 && moment.paragraphs.length >= 2;
    }),
  );

  // Different origins at the SAME beat must have genuinely different text
  // (the whole point — a second playthrough with a different origin sees
  // different content here).
  const beat0 = fatefulMod.FATEFUL_MOMENT_INDICES[0];
  const texts = origins.map((o) => fatefulMod.fatefulMomentFor(beat0, o).paragraphs.join(" "));
  out.originsAreDistinct = new Set(texts).size === origins.length;

  out.nonFatefulIndexReturnsNull = fatefulMod.fatefulMomentFor(3, "ogretmen") === null;

  return out;
});

assert(data.indexCount === 3, "exactly 3 fateful-moment beats exist");
assert(data.noneOnWeekBoundary, "none of the 3 beats land on a week's first/last house");
assert(data.allCombinationsResolve, "all 12 combinations (3 beats x 4 origins) resolve to real content");
assert(data.originsAreDistinct, "the 4 origins get genuinely different text at the same beat");
assert(data.nonFatefulIndexReturnsNull, "a non-fateful index returns null");

// Live check: continuing a save sitting exactly at the first beat's index,
// with a matching origin, should show the modal and persist the fired index.
await page.evaluate(async () => {
  const housesMod = await import("/src/data/houses.ts");
  const fatefulMod = await import("/src/data/fatefulMoments.ts");
  const beatIndex = fatefulMod.FATEFUL_MOMENT_INDICES[0];
  const save = {
    version: 26, index: beatIndex,
    houseOrder: housesMod.allHouses.map((_, i) => i),
    results: Array.from({ length: beatIndex }, (_, i) => ({
      houseId: housesMod.allHouses[i].id,
      outcome: "sold",
      sale: { finalPrice: 1000000, commission: 30000, discountPercent: 5, streakBonus: 0, contractModifier: 0, rankBonus: 0 },
      finalStats: { suspicion: 20, interest: 30, fun: 25, discountPercent: 5 },
      finalSuspicion: 20,
    })),
    weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0,
    // Recent customer thread keeps housesSinceLastCallback() low so the
    // pre-existing random-callback system doesn't divert the flow away
    // from the phone screen — see firat-full-circle.mjs for the same fix.
    inbox: [{ id: "seed", threadId: housesMod.allHouses[0].id, contactName: "Test", text: "merhaba", fromPlayer: false, day: beatIndex }],
    castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0,
    chitchatBonuses: 0, premiumResults: [], pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [],
    investmentResults: [], contactedCustomers: [], activeNewsId: null, energy: 80, pendingDeliveries: [],
    bossMood: 60, firedSeasonalEventWeeks: [], voiceTally: { eglenceli: 0, samimi: 0, atilgan: 0 },
    origin: "ogretmen", compassTally: { durustluk: 0, kurnazlik: 0 }, significantMemories: [], originChoiceCount: 0,
    selfReflectionShown: true, unlockedFriendHouseIds: [], friendHouseResults: [],
    energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
    ownedSkillIds: [], skillXP: 0, defeatedRivalIds: [],
    friendBondCounts: {}, friendBondMilestonesShown: [],
    flashbackShown: false, secondChanceOffered: false,
    pendingFriendFavors: {}, friendFavorAccepted: {}, breadthConfrontationShown: false,
    firatFullCircleShown: false, hardTimesUsed: {}, firedFatefulMomentIndices: [],
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("simsar-emlak-save-v26-slot0", JSON.stringify(save));
});
await page.reload();
await page.waitForTimeout(800);
await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 15000 });
await page.waitForTimeout(500);
// Unlike Tam Çember (checked in afterIntro(), gated behind the phone's
// "Devam Et"), Kader Anları fires synchronously inside proceedToHouseIntro
// as part of continueSaved()'s own load — the modal appears immediately,
// no further clicks needed.
await page.locator(".pixel-btn").first().click({ timeout: 15000 });
await page.waitForTimeout(1200);

const modalText = await page.locator(".flashback-card").innerText().catch(() => "");
assert(modalText.includes("İlk Şüphe"), `the ogretmen-origin beat-1 modal actually shows ("${modalText.slice(0, 40)}")`);

// The fired-index flag is persisted at TRIGGER time (not on dismiss), so
// no need to close the modal first.
const restored = await page.evaluate(() => {
  const raw = localStorage.getItem("simsar-emlak-save-v26-slot0");
  return raw ? JSON.parse(raw) : null;
});
assert(
  Array.isArray(restored?.firedFatefulMomentIndices) && restored.firedFatefulMomentIndices.includes(7),
  `firedFatefulMomentIndices records the fired beat (got ${JSON.stringify(restored?.firedFatefulMomentIndices)})`,
);

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nFATEFUL MOMENTS TEST FAILED");
  process.exit(1);
}
console.log("\nFATEFUL MOMENTS TEST PASSED");
