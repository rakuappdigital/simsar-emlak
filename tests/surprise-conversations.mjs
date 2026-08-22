// Checked-in regression test for the 4 "surprise customer conversation"
// features added in this session: second-chance callback (A), post-sale
// call (B), suspicious-detail confessions (C), origin recognition (D).
// Assumes a server is already running at BASE_URL.
//
// Usage: BASE_URL=http://localhost:4173 node tests/surprise-conversations.mjs
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
  const secondChanceMod = await import("/src/data/secondChanceEvent.ts");
  const postSaleMod = await import("/src/data/postSaleCall.ts");
  const suspiciousMod = await import("/src/data/suspiciousDetails.ts");
  const originMod = await import("/src/data/originRecognition.ts");

  const out = {};

  // A — İkinci Şans: only picks lost, non-retried results.
  const results = [
    { houseId: "a", outcome: "sold", retriedLost: false },
    { houseId: "b", outcome: "lost", retriedLost: false },
    { houseId: "c", outcome: "lost", retriedLost: true },
    { houseId: "d", outcome: "thinking", retriedLost: false },
  ];
  out.secondChanceCandidateIsLostHouse = secondChanceMod.pickSecondChanceCandidateIndex(results) === 1;
  out.secondChanceNoCandidateWhenNoneEligible = secondChanceMod.pickSecondChanceCandidateIndex([results[0], results[2], results[3]]) === null;
  out.secondChanceLineIsString = typeof secondChanceMod.pickSecondChanceLine() === "string";
  out.secondChanceMinIndex = secondChanceMod.SECOND_CHANCE_MIN_INDEX;

  // B — Satış Sonrası Arama: only picks sold results, choices carry real deltas.
  out.postSaleCandidateIsSoldHouse = postSaleMod.pickPostSaleCallCandidateIndex(results) === 0;
  out.postSaleNoCandidateWhenNoneSold = postSaleMod.pickPostSaleCallCandidateIndex([results[1], results[2], results[3]]) === null;
  out.postSaleCallCount = postSaleMod.postSaleCalls.length;
  out.postSaleChoicesHaveRealEffect = postSaleMod.postSaleCalls.every((c) =>
    c.choices.some((ch) => (ch.bossMoodDelta ?? 0) !== 0 || (ch.bonusEarningsDelta ?? 0) !== 0),
  );

  // C — Gizli Gündem: every suspiciousDetails entry has a matching confession.
  out.everyDetailHasConfession = suspiciousMod.suspiciousDetails.every((d) => typeof suspiciousMod.suspiciousDetailConfessions[d.id] === "string");

  // D — Geçmişini Hatırlıyor: every origin id has at least one line.
  const originIds = ["ogretmen", "emlakci-ailesi", "girisimci", "yurtdisi"];
  out.everyOriginHasRecognitionLine = originIds.every((id) => typeof originMod.pickOriginRecognitionLine(id) === "string");
  out.originRecognitionChance = originMod.ORIGIN_RECOGNITION_CHANCE;

  return out;
});

assert(data.secondChanceCandidateIsLostHouse, "İkinci Şans only picks an eligible lost, non-retried house");
assert(data.secondChanceNoCandidateWhenNoneEligible, "İkinci Şans returns null when nothing is eligible");
assert(data.secondChanceLineIsString, "İkinci Şans has flavor lines to pick from");
assert(data.secondChanceMinIndex >= 1, "İkinci Şans has a sane minimum house index gate");

assert(data.postSaleCandidateIsSoldHouse, "Satış Sonrası Arama only picks a sold house");
assert(data.postSaleNoCandidateWhenNoneSold, "Satış Sonrası Arama returns null when nothing sold yet");
assert(data.postSaleCallCount >= 2, "at least 2 post-sale call variants exist");
assert(data.postSaleChoicesHaveRealEffect, "every post-sale call has at least one choice with a real bossMood/bonusEarnings effect");

assert(data.everyDetailHasConfession, "every suspicious detail has a matching confession line");

assert(data.everyOriginHasRecognitionLine, "every origin has at least one recognition line");
assert(data.originRecognitionChance > 0 && data.originRecognitionChance <= 0.15, "origin recognition chance stays low");

// UI smoke: start a fresh game and make sure the new detour/prepended-line
// wiring didn't break the very first house transition (same flow as
// smoke.mjs's origin pick, just checking the immediate next screen).
await page.getByText("Oyuna Başla").click();
await page.waitForTimeout(300);
await page.locator(".origin-card").first().click({ timeout: 5000 });
await page.waitForTimeout(800);
assert((await page.locator(".office-scene").count()) > 0, "reached the office screen right after picking an origin");

assert(errors.length === 0, `zero console/page errors (got ${errors.length})`);
if (errors.length > 0) for (const e of errors) console.error("  -", e);

await browser.close();
if (failed) {
  console.error("\nSURPRISE CONVERSATIONS TEST FAILED");
  process.exit(1);
}
console.log("\nSURPRISE CONVERSATIONS TEST PASSED");
