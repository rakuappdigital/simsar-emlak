import celebAsli from "../assets/portraits/celeb-asli.webp";
import celebBahar from "../assets/portraits/celeb-bahar.webp";
import celebCihangir from "../assets/portraits/celeb-cihangir.webp";
import celebFikret from "../assets/portraits/celeb-fikret.webp";
import celebLeyla from "../assets/portraits/celeb-leyla.webp";
import type { Gender } from "../types";

/**
 * "Özel Davetler" easter egg — a small, separate pool of parody-celebrity
 * customers, each loosely (not 1:1) inspired by a type of well-known
 * Turkish public figure, kept deliberately distinct from any real name or
 * photo-likeness. Entirely isolated from the shared 84-character pool
 * (see characterPool.ts) — assignCast() never draws from this list, so
 * these can only ever appear via injectCelebrities() below, and only in
 * premium houses.
 */
export interface Celebrity {
  id: string;
  gender: Gender;
  name: string;
  personality: "kibirli" | "samimi";
  /** Emlah's inner-thought line on realizing who just walked in. */
  introLine: string;
  /** The one-off admiring line Emlah gets to say back. */
  fanLine: string;
  /** How the celebrity reacts to being fanned over — tone follows personality. */
  fanReplyLine: string;
}

export const celebrities: Celebrity[] = [
  {
    id: "celeb-asli",
    gender: "k",
    name: "Aslı Yıldız",
    personality: "kibirli",
    introLine: "(içinden) Dur biraz... bu kesinlikle Aslı Yıldız! Sakin ol Emlah, sakin ol.",
    fanLine: "\"Sizi yıllardır dinliyorum, gerçekten çok büyük bir hayranınızım.\"",
    fanReplyLine: "(kısaca gülümser) Tabii, çoğu insan öyle söylüyor zaten. Devam edelim mi?",
  },
  {
    id: "celeb-fikret",
    gender: "e",
    name: "Kaptan Fikret",
    personality: "samimi",
    introLine: "(içinden) Bu ses tonu... bu kesinlikle Kaptan Fikret! İnanamıyorum.",
    fanLine: "\"O final golü hâlâ tüylerimi diken diken ediyor, efsanesiniz.\"",
    fanReplyLine: "(kahkaha atar, omzuna vurur) Yeğenim, o golü ben de hâlâ izliyorum bazen!",
  },
  {
    id: "celeb-bahar",
    gender: "k",
    name: "Şef Bahar",
    personality: "samimi",
    introLine: "(içinden) Bu tarif anlatan ses... Şef Bahar burada mı yani?",
    fanLine: "\"Geçen hafta tarifinizi denedim, evde herkes bayıldı.\"",
    fanReplyLine: "(gözleri parlar) Aaa ne güzel haber, tam da bunun için yapıyorum bu işi.",
  },
  {
    id: "celeb-cihangir",
    gender: "e",
    name: "Cihangir Bey",
    personality: "kibirli",
    introLine: "(içinden) Bu takım elbise, bu duruş... Cihangir Bey'in ta kendisi.",
    fanLine: "\"Yatırımlarınızı takip ediyorum, gerçekten ilham verici.\"",
    fanReplyLine: "(başıyla onaylar) Doğal olarak. Az insan benim seviyemde risk alabilir.",
  },
  {
    id: "celeb-leyla",
    gender: "k",
    name: "Leyla Han",
    personality: "samimi",
    introLine: "(içinden) O ses, o duruş... Leyla Han, hiç şüphem yok.",
    fanLine: "\"Filmlerinizle büyüdüm, bugün karşımda olmanız inanılmaz.\"",
    fanReplyLine: "(candan güler) Ne kadar tatlısınız, böyle sözler beni hep mutlu eder.",
  },
];

export const celebrityPortraits: Record<string, string> = {
  "celeb-asli": celebAsli,
  "celeb-bahar": celebBahar,
  "celeb-cihangir": celebCihangir,
  "celeb-fikret": celebFikret,
  "celeb-leyla": celebLeyla,
};

/** Chance, per eligible single-customer premium house, that a celebrity shows up instead of a regular pool character. */
export const CELEBRITY_CHANCE = 0.08;
/** Extra discount allowance on top of whatever the house's own choice already offers — celebrities get more flexible pricing. */
export const CELEBRITY_DISCOUNT_BONUS = 5;
/** One-off stat bump from the admiring exchange, personality-dependent. */
export const CELEBRITY_FAN_BONUS: Record<Celebrity["personality"], { fun: number; interest: number }> = {
  samimi: { fun: 10, interest: 5 },
  kibirli: { fun: 5, interest: 3 },
};

export function celebrityById(id: string): Celebrity | undefined {
  return celebrities.find((c) => c.id === id);
}

/**
 * Post-processes an existing castAssignment (from assignCast) to swap a
 * celebrity into a small, random subset of eligible premium houses — never
 * touches main or investment house entries. Called once at game start,
 * right after assignCast(), so it stays a one-off per-game roll rather
 * than something that can shift house to house.
 */
export function injectCelebrities(
  assignment: Record<string, string[]>,
  premiumHouses: { id: string; dynamicCast?: { gender?: Gender }[] }[],
): Record<string, string[]> {
  const updated = { ...assignment };
  const used = new Set<string>();
  for (const house of premiumHouses) {
    if (!house.dynamicCast || house.dynamicCast.length !== 1) continue;
    if (Math.random() >= CELEBRITY_CHANCE) continue;
    const currentIds = updated[house.id];
    if (!currentIds || currentIds.length !== 1) continue;
    const slotGender = house.dynamicCast[0].gender;
    const candidates = celebrities.filter((c) => (!slotGender || c.gender === slotGender) && !used.has(c.id));
    if (candidates.length === 0) continue;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    used.add(chosen.id);
    updated[house.id] = [chosen.id];
  }
  return updated;
}
