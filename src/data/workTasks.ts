import type { Localized } from "./language";
export interface WorkTaskChoice {
  id: string;
  text: Localized;
  reward: { suspicion?: number; interest?: number; fun?: number };
}

export interface WorkTaskDef {
  id: string;
  title: Localized;
  prompt: Localized;
  choices: WorkTaskChoice[];
  /** Overrides WorkTaskScreen's default "Muzaffer Bey bir iş verdi" tag — lets the same screen host different flavors of interstitial (staging, suspicious detail, etc). */
  tag?: Localized;
}

/**
 * Small office chores Muzaffer hands out between houses — a deliberate
 * speed bump so the day doesn't turn into house-after-house with nothing
 * else going on. Each choice rewards a different stat so there's no single
 * "correct" answer, just a flavor of prep that carries into the next house.
 */
export const workTasks: WorkTaskDef[] = [
  {
    id: "vitrin",
    title: { tr: "Ofis Vitrini", en: "Office Showcase" },
    prompt: { tr: "Muzaffer Bey vitrin düzenlemeni istedi. Nasıl bir düzen kurmak istersin?", en: "Muzaffer Bey asked you to arrange the showcase. What kind of arrangement would you like to set up?" },
    choices: [
      { id: "a", text: { tr: "Öne en pahalı evin fotoğrafını koy.", en: "Put the photo of the most expensive house upfront." }, reward: { interest: 12 } },
      { id: "b", text: { tr: "Sade ve düzenli bir görünüm tercih et.", en: "Opt for a simple and neat look." }, reward: { suspicion: -8 } },
      { id: "c", text: { tr: "Renkli afişlerle dikkat çek.", en: "Draw attention with colorful posters." }, reward: { fun: 12 } },
    ],
  },
  {
    id: "sosyal-medya",
    title: { tr: "Sosyal Medya Paylaşımı", en: "Social Media Post" },
    prompt: { tr: "Ofis hesabından bir paylaşım yapman gerekiyor, hangi başlığı seçersin?", en: "You need to make a post from the office account, which title do you choose?" },
    choices: [
      { id: "a", text: { tr: "\"Hayalinizdeki ev bir tık uzağınızda!\"", en: "\"Your dream home is just a click away!\"" }, reward: { interest: 10 } },
      { id: "b", text: { tr: "\"Güvenilir hizmet, şeffaf süreç.\"", en: "\"Reliable service, transparent process.\"" }, reward: { suspicion: -6 } },
      { id: "c", text: { tr: "\"Emlak dünyasında komik bir gün daha 😄\"", en: "\"Another funny day in the real estate world 😄\"" }, reward: { fun: 10 } },
    ],
  },
  {
    id: "musteri-arama",
    title: { tr: "Eski Müşteri Taraması", en: "Past Client Outreach" },
    prompt: { tr: "Muzaffer Bey eski müşteri listesini gözden geçirmeni istiyor. Nereden başlarsın?", en: "Muzaffer Bey wants you to review the past client list. Where do you start?" },
    choices: [
      { id: "a", text: { tr: "En yüksek bütçeli eski müşterilerden.", en: "From the highest-budget past clients." }, reward: { interest: 10 } },
      { id: "b", text: { tr: "En son görüştüğün müşterilerden.", en: "From the clients you last spoke with." }, reward: { suspicion: -8 } },
      { id: "c", text: { tr: "Rastgele birini arayıp sohbet et.", en: "Call someone at random and chat." }, reward: { fun: 8 } },
    ],
  },
  {
    id: "rakip-arastirma",
    title: { tr: "Rakip Analizi", en: "Competitor Analysis" },
    prompt: { tr: "Fırat Bey'in ofisinin fiyatlarını araştırman istendi. Nasıl yaklaşırsın?", en: "You were asked to research the prices of Mr. Fırat's office. How do you approach it?" },
    choices: [
      { id: "a", text: { tr: "Fiyat listesini dikkatlice incele.", en: "Carefully examine the price list." }, reward: { interest: 10 } },
      { id: "b", text: { tr: "Sadece göz gezdir, vaktini alma.", en: "Just skim through it, don't waste time." }, reward: { suspicion: -4, fun: 4 } },
      { id: "c", text: { tr: "Gizli müşteri gibi davranıp içeri gir.", en: "Act like a mystery shopper and go inside." }, reward: { fun: 14 } },
    ],
  },
  {
    id: "evrak",
    title: { tr: "Evrak İşleri", en: "Paperwork" },
    prompt: { tr: "Biriken evrakları düzenlemen gerekiyor. Nasıl hallediyorsun?", en: "You need to organize the piled-up paperwork. How do you handle it?" },
    choices: [
      { id: "a", text: { tr: "Tek tek dikkatlice kontrol et.", en: "Check carefully one by one." }, reward: { suspicion: -10 } },
      { id: "b", text: { tr: "Hızlıca gözden geçir, acelen var.", en: "Review quickly, you are in a hurry." }, reward: { interest: 6, suspicion: 3 } },
      { id: "c", text: { tr: "Müzik açıp keyifli hale getir.", en: "Turn on music and make it enjoyable." }, reward: { fun: 10 } },
    ],
  },
  {
    id: "egitim-videosu",
    title: { tr: "Eğitim Videosu", en: "Training Video" },
    prompt: { tr: "Muzaffer Bey bir satış eğitimi videosu izlemeni istedi. Nasıl izliyorsun?", en: "Mr. Muzaffer asked you to watch a sales training video. How do you watch it?" },
    choices: [
      { id: "a", text: { tr: "Not alarak, dikkatlice izle.", en: "Watch carefully, taking notes." }, reward: { interest: 8, suspicion: -4 } },
      { id: "b", text: { tr: "Arka planda açık bırak, başka iş yap.", en: "Leave it open in the background, do other work." }, reward: { fun: 6 } },
      { id: "c", text: { tr: "2 kat hızda izleyip bitir.", en: "Watch at 2x speed and finish it." }, reward: { interest: 6, fun: 6 } },
    ],
  },
];

export function pickWorkTask(excludeId?: string): WorkTaskDef {
  const pool = excludeId ? workTasks.filter((t) => t.id !== excludeId) : workTasks;
  return pool[Math.floor(Math.random() * pool.length)];
}
