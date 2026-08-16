/**
 * Rakip Emlakçı Düellosu — a rare, purely additive flavor event. When it
 * fires, the upcoming house is flagged as a "duel": a small on-screen tag
 * warns the player Fırat Bey is circling the same listing. Selling it pays
 * a bonus on top of the normal commission; failing to sell it has NO extra
 * penalty beyond the outcome that would have happened anyway — this only
 * ever adds upside, never touches suspicion/interest/fun/closingBias math.
 */
export const RIVAL_DUEL_CHANCE = 0.05;
/** Bonus is a percentage of the house's own asking price, so it scales naturally with house tier. */
export const RIVAL_DUEL_BONUS_RATE = 0.02;

const startMessages = [
  (title: string) => `Emlah'ım, Fırat Bey de "${title}" ile ilgileniyormuş, çabuk davran!`,
  (title: string) => `Duyduğuma göre Fırat Bey "${title}" için de görüşme ayarlamış, aman geç kalma.`,
  (title: string) => `Fırat Bey yine peşimizde — "${title}" konusunda ondan önce davranmalısın.`,
];

const winMessages = [
  "Fırat Bey'i bu sefer geçtin, tebrikler!",
  "Duydun mu, Fırat Bey bu satışı kaçırdığına çok üzülmüş.",
  "İyi iş çıkardın, Fırat Bey'e bir puan önde bitirdin bu turu.",
];

const loseMessages = [
  "Bu sefer Fırat Bey önden gitti, dert etme, başka fırsat çıkar.",
  "Fırat Bey bu evi kapmış görünüyor, bir dahakine yakalarız.",
  "Olsun, Fırat Bey de her zaman kazanmıyor zaten.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickDuelStartMessage(houseTitle: string): string {
  return pick(startMessages)(houseTitle);
}

export function pickDuelWinMessage(): string {
  return pick(winMessages);
}

export function pickDuelLoseMessage(): string {
  return pick(loseMessages);
}
