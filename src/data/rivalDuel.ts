/**
 * Rakip Emlakçı Düellosu — a rare, purely additive flavor event. When it
 * fires, the upcoming house is flagged as a "duel": a small on-screen tag
 * warns the player Fırat Bey is circling the same listing. Selling it pays
 * a bonus on top of the normal commission; failing to sell it has NO extra
 * penalty beyond the outcome that would have happened anyway — this only
 * ever adds upside, never touches suspicion/interest/fun/closingBias math.
 */
import { getLanguage } from "./language";

export const RIVAL_DUEL_CHANCE = 0.05;
/** Bonus is a percentage of the house's own asking price, so it scales naturally with house tier. */
export const RIVAL_DUEL_BONUS_RATE = 0.02;

const startMessages = [
  (title: string, rival: string) =>
    getLanguage() === "en"
      ? `Estetan my friend, ${rival} is also interested in "${title}", act fast!`
      : `Emlah'ım, ${rival} de "${title}" ile ilgileniyormuş, çabuk davran!`,
  (title: string, rival: string) =>
    getLanguage() === "en"
      ? `From what I heard, ${rival} has also set up a meeting for "${title}", make sure not to be late.`
      : `Duyduğuma göre ${rival} "${title}" için de görüşme ayarlamış, aman geç kalma.`,
  (title: string, rival: string) =>
    getLanguage() === "en"
      ? `${rival} is on our tail again — you need to beat them to "${title}".`
      : `${rival} yine peşimizde — "${title}" konusunda ondan önce davranmalısın.`,
];

const winMessages = [
  (rival: string) => (getLanguage() === "en" ? `You beat ${rival} this time, congrats!` : `${rival}'i bu sefer geçtin, tebrikler!`),
  (rival: string) =>
    getLanguage() === "en"
      ? `Did you hear, ${rival} is super upset about missing out on this sale.`
      : `Duydun mu, ${rival} bu satışı kaçırdığına çok üzülmüş.`,
  (rival: string) =>
    getLanguage() === "en"
      ? `Good job, you finished this round one point ahead of ${rival}.`
      : `İyi iş çıkardın, ${rival}'e bir puan önde bitirdin bu turu.`,
];

const loseMessages = [
  (rival: string) =>
    getLanguage() === "en"
      ? `${rival} took the lead this time, don't sweat it, another opportunity will come up.`
      : `Bu sefer ${rival} önden gitti, dert etme, başka fırsat çıkar.`,
  (rival: string) =>
    getLanguage() === "en"
      ? `${rival} seems to have snatched this house, we'll catch them next time.`
      : `${rival} bu evi kapmış görünüyor, bir dahakine yakalarız.`,
  (rival: string) =>
    getLanguage() === "en" ? `Never mind, ${rival} doesn't win every time anyway.` : `Olsun, ${rival} de her zaman kazanmıyor zaten.`,
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
