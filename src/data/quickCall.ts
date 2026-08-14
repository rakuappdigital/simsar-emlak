import type { WorkTaskDef } from "./workTasks";

/**
 * A second flavor of the same "office chore between houses" interruption —
 * same data shape as workTasks.ts (id/title/prompt/choices[].reward) so it
 * plugs into the exact same completeWorkTask/taskReward pipeline in App.tsx
 * with zero changes there. The only real difference is presentation:
 * QuickCallScreen adds a countdown, so picking fast under light pressure is
 * the whole point instead of a calm 3-choice read.
 */
export const quickCallDefs: WorkTaskDef[] = [
  {
    id: "hizli-arama-liste",
    title: "Hızlı Arama",
    prompt: "Elinde üç eski müşteri numarası var, telefon kapanmadan birini araman lazım.",
    choices: [
      { id: "a", text: "Yüksek bütçeli eski müşteriyi ara.", reward: { interest: 12 } },
      { id: "b", text: "En son iyi ayrıldığın müşteriyi ara.", reward: { suspicion: -8 } },
      { id: "c", text: "Uzun zamandır aramadığın birini dene.", reward: { fun: 10 } },
    ],
  },
  {
    id: "hizli-arama-yonlendirme",
    title: "Çağrı Yönlendirme",
    prompt: "Ofis hattı çalıyor, Muzaffer Bey \"sen bak\" dedi. Kimi önceliklendiriyorsun?",
    choices: [
      { id: "a", text: "Acil görünen aramayı al.", reward: { interest: 10, suspicion: 2 } },
      { id: "b", text: "Sakin sesli arayanı al, dikkatli dinle.", reward: { suspicion: -10 } },
      { id: "c", text: "Kim çıkarsa çıksın, hemen aç.", reward: { fun: 12 } },
    ],
  },
  {
    id: "hizli-arama-geri-donus",
    title: "Geri Dönüş Baskısı",
    prompt: "Üç kişi aynı anda seni geri aramanı bekliyor, süren kısıtlı.",
    choices: [
      { id: "a", text: "En çok bekleteni ara.", reward: { suspicion: -6, interest: 4 } },
      { id: "b", text: "En sıcak ilgiliyi ara.", reward: { interest: 14 } },
      { id: "c", text: "Hepsine tek seferde toplu mesaj at.", reward: { fun: 8 } },
    ],
  },
];

export function pickQuickCall(excludeId?: string): WorkTaskDef {
  const pool = excludeId ? quickCallDefs.filter((t) => t.id !== excludeId) : quickCallDefs;
  return pool[Math.floor(Math.random() * pool.length)];
}
