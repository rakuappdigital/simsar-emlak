import type { Localized } from "./language";
/**
 * "Arkadaş Tavsiyeleri" — 5 recurring friends (distinct from the romantic
 * pool in characterPool.ts and from Bora's loan/investment thread in
 * friendFlavor.ts) who occasionally recommend a house — either their own or
 * one they know about — through the SAME friend-chitchat pipeline already
 * used for Bora/Melike (see friendFlavor.ts's new houseTip message sets).
 * Names checked against characterPool.ts, characterImages.ts, celebrities.ts,
 * and Bora/Fırat to avoid any collision with an existing character.
 */
export interface FriendCharacterDef {
  id: string;
  name: string;
  profession: Localized;
  /** House ids this friend is connected to — see data/friendHouses.ts. */
  houseIds: [string, string];
}

export const friendCharacters: FriendCharacterDef[] = [
  { id: "ecrin", name: "Ecrin", profession: { tr: "Mimar", en: "Architect" }, houseIds: ["ecrin-isik-kuyulu-loft", "ecrin-simetrik-ikiz-daire"] },
  { id: "kutay", name: "Kutay", profession: { tr: "Noter", en: "Notary" }, houseIds: ["kutay-tertemiz-tapulu-konak", "kutay-miras-sonrasi-daire"] },
  { id: "bengisu", name: "Bengisu", profession: { tr: "Fotoğrafçı", en: "Photographer" }, houseIds: ["bengisu-gunbatimi-terasi", "bengisu-retro-vitrin-daire"] },
  { id: "alperen", name: "Alperen", profession: { tr: "Girişimci", en: "Entrepreneur" }, houseIds: ["alperen-ofis-ev-hybrid-loft", "alperen-yatirimci-dostu-studyo"] },
  { id: "duru", name: "Duru", profession: { tr: "Hemşire", en: "Nurse" }, houseIds: ["duru-sessiz-bahce-kati", "duru-huzurlu-manzarali-ev"] },
];

/** Given a house id from friendHouses.ts, which friend it's connected to (for the "🤝 Arkadaşın" tag). */
export function friendCharacterForHouseId(houseId: string): FriendCharacterDef | undefined {
  return friendCharacters.find((f) => f.houseIds.includes(houseId));
}
