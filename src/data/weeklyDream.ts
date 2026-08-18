import type { WeekOutcome } from "../types";

/**
 * "Emlah'ın Rüyası" — unlike journal.ts's grounded diary recap, this is
 * deliberately surreal/symbolic, a single short dream-logic line picked
 * purely from data the week summary already computes (salesGoalMet,
 * honestyGoalMet). No new state, no persistence.
 */
const greatWeekDreams = [
  "Rüyamda bütün evler kendiliğinden satılıyordu, ben sadece imza atıyordum.",
  "Gece boyunca uçtum, altımda tapu senetlerinden bir halı vardı.",
  "Muzaffer Bey rüyamda bana bir madalya taktı, madalyanın üzerinde benim yüzüm vardı.",
];

const soldButShadyDreams = [
  "Rüyamda bir ev sattım ama alıcının yüzü sürekli değişiyordu.",
  "Cebimdeki para gerçek değildi rüyada, uyanınca yine de saydım.",
  "Sattığım evin kapısı rüyada hiç kapanmadı, sürekli açık kaldı.",
];

const honestButSlowDreams = [
  "Rüyamda kimseye bir şey satamadım ama herkes bana teşekkür etti.",
  "Boş bir evde tek başıma oturuyordum, tuhaf bir şekilde huzurluydu.",
  "Rüyamda bütün müşteriler sırayla bana gerçeği anlattı, hiçbiri satın almadı.",
];

const roughWeekDreams = [
  "Rüyamda bütün kapılar kilitliydi, anahtarım hiçbirine uymuyordu.",
  "Muzaffer Bey rüyama girdi, sadece başını salladı, hiçbir şey söylemedi.",
  "Elimde bir ev planı vardı ama üzerinde hiç oda yoktu.",
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
  return pool[Math.floor(Math.random() * pool.length)];
}
