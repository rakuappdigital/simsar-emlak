// Checked-in regression test for the two large depth systems added in this
// session: the Çelişki Motoru (contradiction.ts) and İlişki Evreleri
// (relationshipStages.ts). Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/depth-systems.mjs
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
  const contradictionMod = await import("/src/data/contradiction.ts");
  const relStageMod = await import("/src/data/relationshipStages.ts");

  const out = {};

  // Çelişki Motoru — held-firm detection.
  out.heldFirmDetectsNoDiscountLowSuspicion = contradictionMod.isHeldFirmChoice({ discountPercent: 0, suspicion: -5 });
  out.heldFirmRejectsBigDiscount = contradictionMod.isHeldFirmChoice({ discountPercent: 10, suspicion: -5 }) === false;
  out.heldFirmRejectsPositiveSuspicion = contradictionMod.isHeldFirmChoice({ suspicion: 5 }) === false;
  out.heldFirmRejectsUndefined = contradictionMod.isHeldFirmChoice(undefined) === false;

  // Çelişki Motoru — discount contradiction only fires with enough held-firm history AND a big discount.
  out.discountContradictionNeedsHeldFirmHistory = contradictionMod.isDiscountContradiction(0, { discountPercent: 20 }) === false;
  out.discountContradictionNeedsBigDiscount = contradictionMod.isDiscountContradiction(3, { discountPercent: 2 }) === false;
  out.discountContradictionFiresWhenBothMet = contradictionMod.isDiscountContradiction(3, { discountPercent: 20 });

  // Çelişki Motoru — tone contradiction (pushy <-> patient only, empathetic neutral).
  out.toneContradictionPushyToPatient = contradictionMod.isToneContradiction("pushy", "patient");
  out.toneContradictionPatientToPushy = contradictionMod.isToneContradiction("patient", "pushy");
  out.toneContradictionNoneForEmpathetic = contradictionMod.isToneContradiction("empathetic", "pushy") === false;
  out.toneContradictionNoneWhenNoHistory = contradictionMod.isToneContradiction(undefined, "pushy") === false;
  out.toneContradictionNoneForSameTone = contradictionMod.isToneContradiction("pushy", "pushy") === false;

  out.rankMultiplierStajyerIsBaseline = contradictionMod.contradictionRankMultiplier["Stajyer"] === 1;
  out.rankMultiplierIncreasesWithRank = contradictionMod.contradictionRankMultiplier["Ofis Ortağı"] > contradictionMod.contradictionRankMultiplier["Stajyer"];

  out.discountContradictionLineIsString = typeof contradictionMod.pickDiscountContradictionLine() === "string";
  out.toneContradictionLineIsString = typeof contradictionMod.pickToneContradictionLine() === "string";

  // İlişki Evreleri
  out.stageZeroIsTaniskilik = relStageMod.stageForBondCount(0) === "taniskilik";
  out.stageTwoIsTaniskilik = relStageMod.stageForBondCount(2) === "taniskilik";
  out.stageThreeIsGuven = relStageMod.stageForBondCount(3) === "guven";
  out.stageNineIsGuven = relStageMod.stageForBondCount(9) === "guven";
  out.stageTenIsYakinlik = relStageMod.stageForBondCount(10) === "yakinlik";

  out.favorRequestMentionsName = relStageMod.favorRequestLine("Ecrin", "Mimar").includes("Ecrin");
  out.favorAcceptReplyMentionsName = relStageMod.favorAcceptReply("Ecrin").includes("Ecrin");
  out.favorDeclineReplyMentionsName = relStageMod.favorDeclineReply("Ecrin").includes("Ecrin");
  out.yakinlikEpilogueMentionsName = relStageMod.yakinlikEpilogueLine("Ecrin").includes("Ecrin");
  out.breadthConfrontationMentionsName = relStageMod.breadthConfrontationLine("Ecrin").includes("Ecrin");

  out.favorAcceptCostPositive = relStageMod.FAVOR_ACCEPT_COST > 0;
  out.favorBondBonusPositive = relStageMod.FAVOR_ACCEPT_BOND_BONUS > 0;
  out.breadthMinFriendsAtLeastThree = relStageMod.BREADTH_CONFRONTATION_MIN_FRIENDS >= 3;

  return out;
});

assert(data.heldFirmDetectsNoDiscountLowSuspicion, "held-firm detects a no-discount, suspicion-reducing choice");
assert(data.heldFirmRejectsBigDiscount, "held-firm rejects a choice that already offers a big discount");
assert(data.heldFirmRejectsPositiveSuspicion, "held-firm rejects a suspicion-raising choice");
assert(data.heldFirmRejectsUndefined, "held-firm rejects undefined effects");

assert(data.discountContradictionNeedsHeldFirmHistory, "discount contradiction needs held-firm history first");
assert(data.discountContradictionNeedsBigDiscount, "discount contradiction needs a genuinely big discount");
assert(data.discountContradictionFiresWhenBothMet, "discount contradiction fires once both conditions are met");

assert(data.toneContradictionPushyToPatient, "tone contradiction fires pushy -> patient");
assert(data.toneContradictionPatientToPushy, "tone contradiction fires patient -> pushy");
assert(data.toneContradictionNoneForEmpathetic, "empathetic never triggers a tone contradiction");
assert(data.toneContradictionNoneWhenNoHistory, "no prior tone means no contradiction");
assert(data.toneContradictionNoneForSameTone, "repeating the same tone is not a contradiction");

assert(data.rankMultiplierStajyerIsBaseline, "Stajyer rank multiplier is baseline 1x");
assert(data.rankMultiplierIncreasesWithRank, "higher career rank makes contradictions sting more");

assert(data.discountContradictionLineIsString, "discount contradiction callout line is real text");
assert(data.toneContradictionLineIsString, "tone contradiction callout line is real text");

assert(data.stageZeroIsTaniskilik, "0 bond points = Tanışıklık");
assert(data.stageTwoIsTaniskilik, "2 bond points = still Tanışıklık");
assert(data.stageThreeIsGuven, "3 bond points = Güven (favor unlocks here)");
assert(data.stageNineIsGuven, "9 bond points = still Güven");
assert(data.stageTenIsYakinlik, "10 bond points = Yakınlık");

assert(data.favorRequestMentionsName, "favor request line is personalized");
assert(data.favorAcceptReplyMentionsName, "favor accept reply is personalized");
assert(data.favorDeclineReplyMentionsName, "favor decline reply is personalized");
assert(data.yakinlikEpilogueMentionsName, "Yakınlık epilogue is personalized");
assert(data.breadthConfrontationMentionsName, "breadth confrontation line is personalized");

assert(data.favorAcceptCostPositive, "accepting a favor has a real, positive cost");
assert(data.favorBondBonusPositive, "accepting a favor gives a real bond bonus");
assert(data.breadthMinFriendsAtLeastThree, "breadth confrontation requires at least 3 friends at Güven+");

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nDEPTH SYSTEMS TEST FAILED");
  process.exit(1);
}
console.log("\nDEPTH SYSTEMS TEST PASSED");
