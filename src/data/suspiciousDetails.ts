import type { Localized } from "./language";
import type { WorkTaskDef } from "./workTasks";

/**
 * "Şüpheli Detay" — a customer's story doesn't quite add up. Pressing on it
 * ("Üzerine Git") is a real trade-off (interest up, but a bit of suspicion
 * risk from pushing), letting it go ("Geçiştir") is always the safe, neutral
 * option — expressed purely through deterministic WorkTaskChoice rewards,
 * same pipeline as workTasks.ts/staging.ts, no new resolution logic needed.
 * Fills the same occasional interruption slot as office chores/staging.
 */
export const suspiciousDetails: WorkTaskDef[] = [
  {
    id: "butce-tutarsizligi",
    title: { tr: "Şüpheli Detay", en: "Suspicious Detail" },
    tag: { tr: "Bir şey tuhaftı...", en: "Something was odd..." },
    prompt: { tr: "Müşteri bütçesinden bahsederken kendine ters düştü. Üzerine gitsen mi?", en: "The client contradicted themselves while talking about their budget. Will you push on it?" },
    choices: [
      { id: "uzerine-git", text: { tr: "Üzerine git, açıkça sor.", en: "Push on it, ask openly." }, reward: { interest: 14, suspicion: 6 } },
      { id: "gecistir", text: { tr: "Geçiştir, konuyu değiştir.", en: "Brush it off, change the subject." }, reward: {} },
    ],
  },
  {
    id: "aciliyet-blöfü",
    title: { tr: "Şüpheli Detay", en: "Suspicious Detail" },
    tag: { tr: "Bir şey tuhaftı...", en: "Something was odd..." },
    prompt: { tr: "\"Yarın taşınmamız lazım\" dedi ama hiç acele bir hâli yok. Sorgular mısın?", en: "They said \"We need to move tomorrow\" but they don't seem to be in a hurry at all. Would you question it?" },
    choices: [
      { id: "uzerine-git", text: { tr: "Nazikçe gerçek zamanlamayı sor.", en: "Kindly ask for the real timing." }, reward: { interest: 12, suspicion: 5 } },
      { id: "gecistir", text: { tr: "Geçiştir, üstüne gitme.", en: "Brush it off, don't press." }, reward: {} },
    ],
  },
  {
    id: "baska-yer-blöfü",
    title: { tr: "Şüpheli Detay", en: "Suspicious Detail" },
    tag: { tr: "Bir şey tuhaftı...", en: "Something was odd..." },
    prompt: { tr: "\"Aynı evi başka yerde daha ucuza buluyoruz\" dedi ama emin görünmüyor. Meydan okur musun?", en: "They said \"We are finding the same house cheaper elsewhere\" but they don't seem sure. Would you challenge them?" },
    choices: [
      { id: "uzerine-git", text: { tr: "\"Nerede peki?\" diye sor.", en: "Ask \"Where then?\"." }, reward: { interest: 16, suspicion: 8 } },
      { id: "gecistir", text: { tr: "Geçiştir, pazarlığı bozma.", en: "Brush it off, don't ruin the negotiation." }, reward: {} },
    ],
  },
  {
    id: "referans-iddiasi",
    title: { tr: "Şüpheli Detay", en: "Suspicious Detail" },
    tag: { tr: "Bir şey tuhaftı...", en: "Something was odd..." },
    prompt: { tr: "\"Bizi tanıdığınız biri yönlendirdi\" dedi ama ismini hatırlamıyor gibi. Sorar mısın?", en: "They said \"Someone you know directed us\" but they seem to not remember the name. Would you ask?" },
    choices: [
      { id: "uzerine-git", text: { tr: "Kimin yönlendirdiğini sor.", en: "Ask who directed them." }, reward: { interest: 10, suspicion: 4 } },
      { id: "gecistir", text: { tr: "Geçiştir, önemli değil.", en: "Brush it off, it's not important." }, reward: {} },
    ],
  },
];

export function pickSuspiciousDetail(excludeId?: string): WorkTaskDef {
  const pool = excludeId ? suspiciousDetails.filter((t) => t.id !== excludeId) : suspiciousDetails;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * "Gizli Gündem" — pressing on a suspicious detail ("Üzerine Git") doesn't
 * just move the numbers, it occasionally earns a one-line confession about
 * the upcoming customer's real reason for buying. Purely a flavor payoff
 * logged into that house's inbox thread before the visit even starts — the
 * existing reward numbers above are completely untouched.
 */
export const suspiciousDetailConfessions: Record<string, Localized> = {
  "butce-tutarsizligi": { tr: "Aslında boşanma sürecindeyim, bütçemi tam bilmiyorum daha. Kusura bakmayın.", en: "Actually I'm going through a divorce, I don't know my budget for sure yet. Sorry." },
  "aciliyet-blöfü": { tr: "Doğrusu acele yok, sadece pazarlıkta elim güçlü dursun istedim.", en: "Truth is there's no rush, I just wanted my hand to be strong in negotiations." },
  "baska-yer-blöfü": { tr: "Açıkçası başka bir yer yok, sadece indirim koparmaya çalışıyordum.", en: "Frankly there is no other place, I was just trying to squeeze a discount." },
  "referans-iddiasi": { tr: "Doğrusu kimse yönlendirmedi, ilanı internetten buldum ama daha güvenilir dursun istedim.", en: "Truth is nobody referred me, I found the listing online but wanted it to look more reliable." },
};
