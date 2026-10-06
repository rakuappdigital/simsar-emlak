// Yan Görevler & Easter Egg paketi (2026-10-06) — temel akışlar:
// ofis "Peşindekiler" kartları, hayalet soruşturması adımı (+ enerji), gizli
// yalı sahnesi, Esnafla Çay → Muhtar'ın Defteri, Albüm, diyalogda anahtar
// seçeneği + doğru semtte ipucu, ve yan görev durumunun kayıtta kalıcılığı.
//
// Usage: BASE_URL=http://localhost:5173 node tests/side-quests.mjs
import { chromium } from "playwright";
import { openEmlahTab } from "./helpers/emlah.mjs";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";
const SAVE_KEY = "simsar-emlak-save-v26-slot0";
let failed = false;
const errors = [];
function assert(condition, message) {
  if (!condition) {
    failed = true;
    console.error(`FAIL: ${message}`);
  } else console.log(`ok: ${message}`);
}

const browser = await chromium.launch({ args: ["--mute-audio"] });

async function openWithSave(sideQuests, { energy = 80 } = {}) {
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(BASE_URL);
  await page.locator("button", { hasText: "Türkçe" }).click({ timeout: 8000 }).catch(() => {});
  const district = await page.evaluate(
    async ({ key, sideQuests, energy }) => {
      localStorage.setItem("simsar-emlak-full-unlock", "1");
      const housesMod = await import("/src/data/houses.ts");
      const all = housesMod.allHouses;
      const houseOrder = all.map((h, i) => ({ t: h.tier, i })).sort((a, b) => a.t - b.t || a.i - b.i).map((x) => x.i);
      const index = 6;
      const results = Array.from({ length: index }, (_, k) => ({
        houseId: all[houseOrder[k]].id,
        outcome: "sold",
        sale: { finalPrice: 1000000, commission: 30000, discountPercent: 0, streakBonus: 0, contractModifier: 0, rankBonus: 0 },
        finalStats: { suspicion: 10, interest: 60, fun: 40, discountPercent: 0 },
        finalSuspicion: 10,
      }));
      const current = all[houseOrder[index]];
      const d = current.location.split(",")[0].trim();
      const sq = typeof sideQuests === "function" ? null : sideQuests;
      const save = {
        version: 26, index, houseOrder, results, weekOutcomes: [], badges: [], ownedPerks: [], consumables: {}, unlockedTiers: [1, 2, 3, 4, 5], spent: 0,
        inbox: [], castAssignment: {}, dailyQuest: null, bonusEarnings: 0, pendingLoan: null, tasksCompleted: 0, chitchatBonuses: 0, premiumResults: [],
        pendingInvestment: null, friendBonds: {}, ownedInvestmentHouses: [], investmentResults: [], contactedCustomers: [], activeNewsId: null, energy,
        pendingDeliveries: [], pendingCallbacks: [], pausedVisit: null, bossMood: 60, firedSeasonalEventWeeks: [], voiceTally: { eglenceli: 0, samimi: 0, atilgan: 0 },
        origin: "ogretmen", compassTally: { durustluk: 0, kurnazlik: 0 }, significantMemories: [], originChoiceCount: 0, selfReflectionShown: true,
        unlockedFriendHouseIds: [], friendHouseResults: [], energyLastRegenAt: Date.now(), minigameNextAvailableAt: Date.now(), minigamePlaysRemaining: 2,
        ownedSkillIds: [], skillXP: 0, defeatedRivalIds: [], friendBondCounts: {}, friendBondMilestonesShown: [], flashbackShown: true, secondChanceOffered: true,
        pendingFriendFavors: {}, friendFavorAccepted: {}, breadthConfrontationShown: true, firatFullCircleShown: true, hardTimesUsed: {},
        firedFatefulMomentIndices: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48],
        sideQuests: sq ? { ...sq, key: { ...sq.key, route: sq.key.route.map((r) => (r === "@here" ? d : r)) } } : undefined,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(save));
      return d;
    },
    { key: SAVE_KEY, sideQuests, energy },
  );
  await page.reload();
  await page.waitForTimeout(600);
  await page.locator("text=Kayıtlı Oyunlar").click({ timeout: 8000 });
  await page.waitForTimeout(300);
  await page.locator(".pixel-btn").first().click({ timeout: 5000 });
  // Yüklemede rastgele bir iş görevi araya girebilir — ofise varana kadar geç.
  for (let i = 0; i < 20 && !(await page.locator(".office-scene").isVisible().catch(() => false)); i++) {
    await page.locator(".work-task-screen .choice-btn, .quick-call-screen .choice-btn, .choice-btn, button.phone-continue, .rankup-overlay").first().click({ timeout: 400 }).catch(() => {});
    await page.waitForTimeout(400);
  }
  return { page, district };
}

const saved = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE_KEY);
const base = {
  lastTick: 6,
  key: { stage: "unlocked", route: ["Balat", "Moda", "Kuzguncuk"], found: 3 },
  muzaffer: { targetHouseId: null, targetIndex: -1, cluesSent: 0, status: null },
  muhtar: { met: false, taskId: null, taskParam: null, done: 0, tipReady: false, titled: false },
  life: { houseId: null, name: null, stage: 0, nextAt: -1 },
  ghost: { step: 1, lastIndex: -1, storyReady: false },
  night: { done: true, pendingHouseId: null },
  forgery: false, rivalHeadStart: 0, cat: false, radio: false, yaliResult: null, homeResult: null, firedDays: [],
};

// ---------- 1) Ofis kartları + hayalet adımı + yalı ----------
{
  const { page } = await openWithSave(base);
  const cards = await page.locator(".office-side-card").allInnerTexts();
  assert(cards.some((c) => c.includes("Hayalet Ev Soruşturması")), "office shows the ghost inquiry card");
  assert(cards.some((c) => c.includes("Yeşil Kapılı Yalı")), "office shows the unlocked mansion card");

  const energyBefore = (await saved(page)).energy;
  await page.locator(".office-side-card", { hasText: "Hayalet" }).click();
  await page.waitForTimeout(300);
  assert((await page.locator(".side-story").innerText()).includes("Gazete"), "ghost step 1 shows the newspaper clipping");
  await page.locator(".side-story-btn").click();
  await page.waitForTimeout(500);
  const afterGhost = await saved(page);
  assert(afterGhost.sideQuests?.ghost?.step === 2, `ghost inquiry advanced to step 2 and was saved (got ${afterGhost.sideQuests?.ghost?.step})`);
  const subtitle = await page.locator(".office-side-card", { hasText: "Hayalet" }).innerText();
  assert(subtitle.includes("yarın"), "the inquiry is limited to one step per day");

  await page.locator(".office-side-card", { hasText: "Yeşil Kapılı Yalı" }).click();
  await page.waitForTimeout(800);
  assert(await page.locator(".premium-overlay").isVisible().catch(() => false), "mansion card opens the secret house scene");
  void energyBefore;
  await page.close();
}

// ---------- 2) Esnafla Çay → Muhtar'ın Defteri + Albüm ----------
{
  const { page } = await openWithSave({ ...base, ghost: { step: 0, lastIndex: -1, storyReady: false }, key: { stage: "none", route: [], found: 0 } });
  await page.locator(".office-get-job-btn").first().click(); // Yeni Güne Geç
  await page.waitForTimeout(600);
  await page.locator(".day-activity-card", { hasText: "Esnafla Çay" }).click({ timeout: 4000 });
  await page.waitForTimeout(400);
  const story = await page.locator(".side-story").innerText().catch(() => "");
  assert(story.includes("Muhtar") && story.includes("Bu haftaki iş"), "tea opens the Headman's notebook with a favor");
  await page.locator(".side-story-btn").click();
  await page.waitForTimeout(400);
  const s = await saved(page);
  assert(s.sideQuests?.muhtar?.met === true && !!s.sideQuests?.muhtar?.taskId, "the favor is assigned and saved");
  const cards = await page.locator(".office-side-card").allInnerTexts();
  assert(cards.some((c) => c.includes("Muhtar")), "the notebook stays reachable from the office");

  await page.locator(".bottom-nav-btn.wallet-pill-btn").click();
  await page.waitForTimeout(300);
  await openEmlahTab(page, "Kariyer");
  await page.waitForTimeout(300);
  const albumText = await page.locator(".album").innerText().catch(() => "");
  assert(/tuhaf anlar albümü · \d+\/23/i.test(albumText), `the album lists 23 cards (${albumText.slice(0, 40)})`);
  await page.close();
}

// ---------- 3) Anahtar diyalogda + doğru semtte ipucu ----------
{
  const { page, district } = await openWithSave({ ...base, ghost: { step: 0, lastIndex: -1, storyReady: false }, key: { stage: "held", route: ["@here", "Moda", "Kuzguncuk"], found: 0 } });
  await page.locator(".office-get-job-btn").first().click();
  await page.waitForTimeout(600);
  for (let i = 0; i < 6; i++) {
    if (await page.locator(".office-get-job-btn", { hasText: "Bugünün İşini Al" }).isVisible().catch(() => false)) break;
    await page.locator(".office-get-job-btn").first().click().catch(() => {});
    await page.waitForTimeout(400);
  }
  await page.locator(".office-get-job-btn", { hasText: "Bugünün İşini Al" }).click({ timeout: 4000 }).catch(() => {});
  let found = false;
  for (let i = 0; i < 60 && !found; i++) {
    const keyChoice = page.locator(".choice-btn", { hasText: "eski anahtarını göster" });
    if (await keyChoice.count()) {
      found = true;
      await keyChoice.first().click();
      break;
    }
    await page
      .locator("button.phone-continue, .phone-choices .choice-btn, button.sale-intro-btn, .tutorial-tip button, .dialogue-box > button.pixel-btn.small, .dialogue-box")
      .first()
      .click({ timeout: 400 })
      .catch(() => {});
    await page.waitForTimeout(350);
  }
  assert(found, `the key choice appears in a ${district} house`);
  await page.waitForTimeout(400);
  const s = await saved(page);
  // Yan görev durumu effect ile sessizce kayda yazılır.
  for (let i = 0; i < 10 && (await saved(page)).sideQuests?.key?.found !== 1; i++) await page.waitForTimeout(200);
  assert((await saved(page)).sideQuests?.key?.found === 1, `showing the key in the right district finds clue 1 (got ${s.sideQuests?.key?.found})`);
  await page.close();
}

assert(errors.length === 0, `zero page errors (got ${errors.length}) ${errors.join(" | ")}`);
await browser.close();
if (failed) {
  console.error("\nSIDE QUESTS TEST FAILED");
  process.exit(1);
}
console.log("\nSIDE QUESTS TEST PASSED");
