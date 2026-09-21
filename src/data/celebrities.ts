import celebAsli from "../assets/portraits/celeb-asli.webp";
import celebBahar from "../assets/portraits/celeb-bahar.webp";
import celebCihangir from "../assets/portraits/celeb-cihangir.webp";
import celebFikret from "../assets/portraits/celeb-fikret.webp";
import celebLeyla from "../assets/portraits/celeb-leyla.webp";
import type { Gender } from "../types";
import type { Localized } from "./language";

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
  introLine: Localized;
  /** The one-off admiring line Emlah gets to say back. */
  fanLine: Localized;
  /** How the celebrity reacts to being fanned over — tone follows personality. */
  fanReplyLine: Localized;
}

export const celebrities: Celebrity[] = [
  {
    id: "celeb-asli",
    gender: "k",
    name: "Aslı Yıldız",
    personality: "kibirli",
    introLine: { tr: "(içinden) Dur biraz... bu kesinlikle Aslı Yıldız! Sakin ol Emlah, sakin ol.", en: "(to himself) Wait a second... that is definitely Aslı Yıldız! Stay calm Emlah, stay calm." },
    fanLine: { tr: "\"Sizi yıllardır dinliyorum, gerçekten çok büyük bir hayranınızım.\"", en: "\"I've been listening to you for years, I'm a really big fan of yours.\"" },
    fanReplyLine: { tr: "(kısaca gülümser) Tabii, çoğu insan öyle söylüyor zaten. Devam edelim mi?", en: "(smiles briefly) Sure, most people say that anyway. Shall we continue?" },
  },
  {
    id: "celeb-fikret",
    gender: "e",
    name: "Kaptan Fikret",
    personality: "samimi",
    introLine: { tr: "(içinden) Bu ses tonu... bu kesinlikle Kaptan Fikret! İnanamıyorum.", en: "(to himself) That voice tone... that is definitely Captain Fikret! I can't believe it." },
    fanLine: { tr: "\"O final golü hâlâ tüylerimi diken diken ediyor, efsanesiniz.\"", en: "\"That final goal still gives me goosebumps, you are a legend.\"" },
    fanReplyLine: { tr: "(kahkaha atar, omzuna vurur) Yeğenim, o golü ben de hâlâ izliyorum bazen!", en: "(laughs, pats on the shoulder) Nephew, I still watch that goal sometimes myself!" },
  },
  {
    id: "celeb-bahar",
    gender: "k",
    name: "Şef Bahar",
    personality: "samimi",
    introLine: { tr: "(içinden) Bu tarif anlatan ses... Şef Bahar burada mı yani?", en: "(to himself) That voice explaining recipes... is Chef Bahar here then?" },
    fanLine: { tr: "\"Geçen hafta tarifinizi denedim, evde herkes bayıldı.\"", en: "\"I tried your recipe last week, everyone at home loved it.\"" },
    fanReplyLine: { tr: "(gözleri parlar) Aaa ne güzel haber, tam da bunun için yapıyorum bu işi.", en: "(eyes sparkle) Oh what great news, that's exactly why I do this job." },
  },
  {
    id: "celeb-cihangir",
    gender: "e",
    name: "Cihangir Bey",
    personality: "kibirli",
    introLine: { tr: "(içinden) Bu takım elbise, bu duruş... Cihangir Bey'in ta kendisi.", en: "(to himself) This suit, this posture... Cihangir Bey himself." },
    fanLine: { tr: "\"Yatırımlarınızı takip ediyorum, gerçekten ilham verici.\"", en: "\"I follow your investments, it's truly inspiring.\"" },
    fanReplyLine: { tr: "(başıyla onaylar) Doğal olarak. Az insan benim seviyemde risk alabilir.", en: "(nods) Naturally. Few people can take risks at my level." },
  },
  {
    id: "celeb-leyla",
    gender: "k",
    name: "Leyla Han",
    personality: "samimi",
    introLine: { tr: "(içinden) O ses, o duruş... Leyla Han, hiç şüphem yok.", en: "(to himself) That voice, that posture... Leyla Han, I have no doubt." },
    fanLine: { tr: "\"Filmlerinizle büyüdüm, bugün karşımda olmanız inanılmaz.\"", en: "\"I grew up with your movies, it's incredible to have you in front of me today.\"" },
    fanReplyLine: { tr: "(candan güler) Ne kadar tatlısınız, böyle sözler beni hep mutlu eder.", en: "(laughs warmly) How sweet of you, such words always make me happy." },
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
