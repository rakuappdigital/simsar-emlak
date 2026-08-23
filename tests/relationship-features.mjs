// Checked-in regression test for 3 relationship-depth features: proactive
// "thinking" follow-up messages (data/followUp.ts), the small rank-based
// sale-chance nudge (data/scoring.ts: rankInterestBonus), and the flirty
// closing exchange (data/flirtDialogue.ts). Assumes a server is already
// running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/relationship-features.mjs
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
  const followUpMod = await import("/src/data/followUp.ts");
  const scoringMod = await import("/src/data/scoring.ts");
  const flirtMod = await import("/src/data/flirtDialogue.ts");

  const out = {};

  // A warm original conversation (high interest, low suspicion) should
  // almost never read the follow-up as annoying.
  let warmCount = 0;
  for (let i = 0; i < 200; i++) {
    const r = followUpMod.rollFollowUpReaction({ interest: 60, suspicion: 5, fun: 0, discountPercent: 0 });
    if (r === "warm") warmCount++;
  }
  out.warmMostlyWarm = warmCount / 200 >= 0.7;

  // A cold original conversation (low interest, high suspicion) should be
  // annoyed far more often than warm.
  let annoyedCount = 0;
  for (let i = 0; i < 200; i++) {
    const r = followUpMod.rollFollowUpReaction({ interest: 5, suspicion: 60, fun: 0, discountPercent: 0 });
    if (r === "annoyed" || r === "instant-lost") annoyedCount++;
  }
  out.coldMostlyAnnoyed = annoyedCount / 200 >= 0.4;

  out.followUpLineIsString = typeof followUpMod.pickEmlahFollowUpLine() === "string";
  out.warmReplyIsString = typeof followUpMod.pickFollowUpReply("warm") === "string";
  out.annoyedReplyIsString = typeof followUpMod.pickFollowUpReply("annoyed") === "string";
  out.instantLostReplyIsString = typeof followUpMod.pickFollowUpReply("instant-lost") === "string";

  out.rankBonusZeroAtStart = scoringMod.rankInterestBonus(0) === 0;
  out.rankBonusPositiveAtTopRank = scoringMod.rankInterestBonus(2000000) > 0;
  out.rankBonusMonotonic =
    scoringMod.rankInterestBonus(2000000) >= scoringMod.rankInterestBonus(1000000) &&
    scoringMod.rankInterestBonus(1000000) >= scoringMod.rankInterestBonus(400000) &&
    scoringMod.rankInterestBonus(400000) >= scoringMod.rankInterestBonus(0);

  const exchange = flirtMod.pickFlirtExchangeLines();
  out.flirtExchangeHasLines = Array.isArray(exchange) && exchange.length >= 2;
  out.flirtExchangeHasBothSpeakers = exchange.some((l) => l.speaker === "emlah") && exchange.some((l) => l.speaker === "customer1");
  out.flirtClosingLineIsString = typeof flirtMod.pickFlirtClosingLine() === "string";

  return out;
});

assert(data.warmMostlyWarm, "a warm original conversation reads the follow-up as warm most of the time");
assert(data.coldMostlyAnnoyed, "a cold original conversation reads the follow-up as annoyed/instant-lost often");
assert(data.followUpLineIsString, "Emlah's follow-up opener is real text");
assert(data.warmReplyIsString, "warm reply pool has real text");
assert(data.annoyedReplyIsString, "annoyed reply pool has real text");
assert(data.instantLostReplyIsString, "instant-lost reply pool has real text");

assert(data.rankBonusZeroAtStart, "no rank bonus at zero lifetime earnings");
assert(data.rankBonusPositiveAtTopRank, "rank bonus is positive at the top rank");
assert(data.rankBonusMonotonic, "rank bonus only ever increases with higher rank");

assert(data.flirtExchangeHasLines, "flirt exchange has at least 2 lines");
assert(data.flirtExchangeHasBothSpeakers, "flirt exchange includes both Emlah and the customer");
assert(data.flirtClosingLineIsString, "flirt closing line is real text");

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nRELATIONSHIP FEATURES TEST FAILED");
  process.exit(1);
}
console.log("\nRELATIONSHIP FEATURES TEST PASSED");
