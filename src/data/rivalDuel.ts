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
  (title: string, rival: string) => `Emlah'ım, ${rival} de "${title}" ile ilgileniyormuş, çabuk davran!`,
  (title: string, rival: string) => `Duyduğuma göre ${rival} "${title}" için de görüşme ayarlamış, aman geç kalma.`,
  (title: string, rival: string) => `${rival} yine peşimizde — "${title}" konusunda ondan önce davranmalısın.`,
];

const winMessages = [
  (rival: string) => `${rival}'i bu sefer geçtin, tebrikler!`,
  (rival: string) => `Duydun mu, ${rival} bu satışı kaçırdığına çok üzülmüş.`,
  (rival: string) => `İyi iş çıkardın, ${rival}'e bir puan önde bitirdin bu turu.`,
];

const loseMessages = [
  (rival: string) => `Bu sefer ${rival} önden gitti, dert etme, başka fırsat çıkar.`,
  (rival: string) => `${rival} bu evi kapmış görünüyor, bir dahakine yakalarız.`,
  (rival: string) => `Olsun, ${rival} de her zaman kazanmıyor zaten.`,
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickDuelStartMessage(houseTitle: string, rivalName = "Fırat Bey"): string {
  return pick(startMessages)(houseTitle, rivalName);
}

export function pickDuelWinMessage(rivalName = "Fırat Bey"): string {
  return pick(winMessages)(rivalName);
}

export function pickDuelLoseMessage(rivalName = "Fırat Bey"): string {
  return pick(loseMessages)(rivalName);
}
