export interface WorkTaskChoice {
  id: string;
  text: string;
  reward: { suspicion?: number; interest?: number; fun?: number };
}

export interface WorkTaskDef {
  id: string;
  title: string;
  prompt: string;
  choices: WorkTaskChoice[];
  /** Overrides WorkTaskScreen's default "Muzaffer Bey bir iş verdi" tag — lets the same screen host different flavors of interstitial (staging, suspicious detail, etc). */
  tag?: string;
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
    title: "Ofis Vitrini",
    prompt: "Muzaffer Bey vitrin düzenlemeni istedi. Nasıl bir düzen kurmak istersin?",
    choices: [
      { id: "a", text: "Öne en pahalı evin fotoğrafını koy.", reward: { interest: 12 } },
      { id: "b", text: "Sade ve düzenli bir görünüm tercih et.", reward: { suspicion: -8 } },
      { id: "c", text: "Renkli afişlerle dikkat çek.", reward: { fun: 12 } },
    ],
  },
  {
    id: "sosyal-medya",
    title: "Sosyal Medya Paylaşımı",
    prompt: "Ofis hesabından bir paylaşım yapman gerekiyor, hangi başlığı seçersin?",
    choices: [
      { id: "a", text: "\"Hayalinizdeki ev bir tık uzağınızda!\"", reward: { interest: 10 } },
      { id: "b", text: "\"Güvenilir hizmet, şeffaf süreç.\"", reward: { suspicion: -6 } },
      { id: "c", text: "\"Emlak dünyasında komik bir gün daha 😄\"", reward: { fun: 10 } },
    ],
  },
  {
    id: "musteri-arama",
    title: "Eski Müşteri Taraması",
    prompt: "Muzaffer Bey eski müşteri listesini gözden geçirmeni istiyor. Nereden başlarsın?",
    choices: [
      { id: "a", text: "En yüksek bütçeli eski müşterilerden.", reward: { interest: 10 } },
      { id: "b", text: "En son görüştüğün müşterilerden.", reward: { suspicion: -8 } },
      { id: "c", text: "Rastgele birini arayıp sohbet et.", reward: { fun: 8 } },
    ],
  },
  {
    id: "rakip-arastirma",
    title: "Rakip Analizi",
    prompt: "Fırat Bey'in ofisinin fiyatlarını araştırman istendi. Nasıl yaklaşırsın?",
    choices: [
      { id: "a", text: "Fiyat listesini dikkatlice incele.", reward: { interest: 10 } },
      { id: "b", text: "Sadece göz gezdir, vaktini alma.", reward: { suspicion: -4, fun: 4 } },
      { id: "c", text: "Gizli müşteri gibi davranıp içeri gir.", reward: { fun: 14 } },
    ],
  },
  {
    id: "evrak",
    title: "Evrak İşleri",
    prompt: "Biriken evrakları düzenlemen gerekiyor. Nasıl hallediyorsun?",
    choices: [
      { id: "a", text: "Tek tek dikkatlice kontrol et.", reward: { suspicion: -10 } },
      { id: "b", text: "Hızlıca gözden geçir, acelen var.", reward: { interest: 6, suspicion: 3 } },
      { id: "c", text: "Müzik açıp keyifli hale getir.", reward: { fun: 10 } },
    ],
  },
  {
    id: "egitim-videosu",
    title: "Eğitim Videosu",
    prompt: "Muzaffer Bey bir satış eğitimi videosu izlemeni istedi. Nasıl izliyorsun?",
    choices: [
      { id: "a", text: "Not alarak, dikkatlice izle.", reward: { interest: 8, suspicion: -4 } },
      { id: "b", text: "Arka planda açık bırak, başka iş yap.", reward: { fun: 6 } },
      { id: "c", text: "2 kat hızda izleyip bitir.", reward: { interest: 6, fun: 6 } },
    ],
  },
];

export function pickWorkTask(excludeId?: string): WorkTaskDef {
  const pool = excludeId ? workTasks.filter((t) => t.id !== excludeId) : workTasks;
  return pool[Math.floor(Math.random() * pool.length)];
}
