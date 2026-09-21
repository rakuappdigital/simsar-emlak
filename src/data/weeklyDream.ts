import type { WeekOutcome } from "../types";
import { resolveText, type Localized } from "./language";

/**
 * "Emlah'ın Rüyası" — unlike journal.ts's grounded diary recap, this is
 * deliberately surreal/symbolic, a single short dream-logic line picked
 * purely from data the week summary already computes (salesGoalMet,
 * honestyGoalMet). No new state, no persistence.
 */
const greatWeekDreams: Localized[] = [
  { tr: "Rüyamda bütün evler kendiliğinden satılıyordu, ben sadece imza atıyordum.", en: "In my dream all houses were selling by themselves, I was just signing." },
  { tr: "Gece boyunca uçtum, altımda tapu senetlerinden bir halı vardı.", en: "I flew through the night, underneath me was a carpet of title deeds." },
  { tr: "Muzaffer Bey rüyamda bana bir madalya taktı, madalyanın üzerinde benim yüzüm vardı.", en: "Muzaffer Bey pinned a medal on me in my dream, my face was on the medal." },
];

const soldButShadyDreams: Localized[] = [
  { tr: "Rüyamda bir ev sattım ama alıcının yüzü sürekli değişiyordu.", en: "In my dream I sold a house but the buyer's face kept changing." },
  { tr: "Cebimdeki para gerçek değildi rüyada, uyanınca yine de saydım.", en: "The money in my pocket wasn't real in the dream, still counted it when I woke up." },
  { tr: "Sattığım evin kapısı rüyada hiç kapanmadı, sürekli açık kaldı.", en: "The door of the house I sold never closed in the dream, stayed open constantly." },
];

const honestButSlowDreams: Localized[] = [
  { tr: "Rüyamda kimseye bir şey satamadım ama herkes bana teşekkür etti.", en: "In my dream I couldn't sell anything to anyone but everyone thanked me." },
  { tr: "Boş bir evde tek başıma oturuyordum, tuhaf bir şekilde huzurluydu.", en: "I was sitting alone in an empty house, strangely peaceful." },
  { tr: "Rüyamda bütün müşteriler sırayla bana gerçeği anlattı, hiçbiri satın almadı.", en: "In my dream all clients told me the truth one by one, none of them bought." },
];

const roughWeekDreams: Localized[] = [
  { tr: "Rüyamda bütün kapılar kilitliydi, anahtarım hiçbirine uymuyordu.", en: "In my dream all doors were locked, my key fit none of them." },
  { tr: "Muzaffer Bey rüyama girdi, sadece başını salladı, hiçbir şey söylemedi.", en: "Muzaffer Bey entered my dream, just shook his head, said nothing." },
  { tr: "Elimde bir ev planı vardı ama üzerinde hiç oda yoktu.", en: "I had a house plan in my hand but there were no rooms on it at all." },
];

export function pickWeeklyDreamLine(outcome: WeekOutcome): string {
  const pool =
    outcome.salesGoalMet && outcome.honestyGoalMet
      ? greatWeekDreams
      : outcome.salesGoalMet
        ? soldButShadyDreams
        : outcome.honestyGoalMet
          ? honestButSlowDreams
          : roughWeekDreams;
  return resolveText(pool[Math.floor(Math.random() * pool.length)]);
}
