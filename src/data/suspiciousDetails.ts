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
    title: "Şüpheli Detay",
    tag: "Bir şey tuhaftı...",
    prompt: "Müşteri bütçesinden bahsederken kendine ters düştü. Üzerine gitsen mi?",
    choices: [
      { id: "uzerine-git", text: "Üzerine git, açıkça sor.", reward: { interest: 14, suspicion: 6 } },
      { id: "gecistir", text: "Geçiştir, konuyu değiştir.", reward: {} },
    ],
  },
  {
    id: "aciliyet-blöfü",
    title: "Şüpheli Detay",
    tag: "Bir şey tuhaftı...",
    prompt: "\"Yarın taşınmamız lazım\" dedi ama hiç acele bir hâli yok. Sorgular mısın?",
    choices: [
      { id: "uzerine-git", text: "Nazikçe gerçek zamanlamayı sor.", reward: { interest: 12, suspicion: 5 } },
      { id: "gecistir", text: "Geçiştir, üstüne gitme.", reward: {} },
    ],
  },
  {
    id: "baska-yer-blöfü",
    title: "Şüpheli Detay",
    tag: "Bir şey tuhaftı...",
    prompt: "\"Aynı evi başka yerde daha ucuza buluyoruz\" dedi ama emin görünmüyor. Meydan okur musun?",
    choices: [
      { id: "uzerine-git", text: "\"Nerede peki?\" diye sor.", reward: { interest: 16, suspicion: 8 } },
      { id: "gecistir", text: "Geçiştir, pazarlığı bozma.", reward: {} },
    ],
  },
  {
    id: "referans-iddiasi",
    title: "Şüpheli Detay",
    tag: "Bir şey tuhaftı...",
    prompt: "\"Bizi tanıdığınız biri yönlendirdi\" dedi ama ismini hatırlamıyor gibi. Sorar mısın?",
    choices: [
      { id: "uzerine-git", text: "Kimin yönlendirdiğini sor.", reward: { interest: 10, suspicion: 4 } },
      { id: "gecistir", text: "Geçiştir, önemli değil.", reward: {} },
    ],
  },
];

export function pickSuspiciousDetail(excludeId?: string): WorkTaskDef {
  const pool = excludeId ? suspiciousDetails.filter((t) => t.id !== excludeId) : suspiciousDetails;
  return pool[Math.floor(Math.random() * pool.length)];
}
