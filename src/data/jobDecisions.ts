import { resolveText, type Localized } from "./language";

/**
 * İşler kartındaki üç karar — Şimdi Git / Ertele / Reddet. Oyun evleri
 * sırayla ilerlettiği için (index) her zaman tek bir "bugünün işi" vardır;
 * bu kararlar o işin NE ZAMAN ya da HİÇ gezilip gezilmeyeceğini belirler,
 * sıradaki evi değiştirmez.
 */

/** Ertelenen müşteri eve biraz daha soğuk başlar. Her iş en fazla 1 kez ertelenebilir. */
export const POSTPONE_SUSPICION_PENALTY = 5;

/** Reddedilen iş Muzaffer Bey'in keyfini kaçırır. */
export const DECLINE_BOSS_MOOD_PENALTY = 5;

const declineBossLines: Localized[] = [
  { tr: "Müşteriyi geri mi çevirdin? Bu işte her kapı bir fırsattır Emlah.", en: "You turned a client away? Every door is an opportunity in this business, Estetan." },
  { tr: "Reddetmek kolay, satmak zor. Bir dahakine bir şans ver.", en: "Saying no is easy, selling is hard. Give it a shot next time." },
  { tr: "Portföyden bir ev eksildi... Umarım iyi bir sebebin vardır.", en: "One less house in the portfolio... I hope you had a good reason." },
];

export function pickDeclineBossLine(): string {
  return resolveText(declineBossLines[Math.floor(Math.random() * declineBossLines.length)]);
}
