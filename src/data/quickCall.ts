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
    title: { tr: "Hızlı Arama", en: "Quick Call" },
    prompt: { tr: "Elinde üç eski müşteri numarası var, telefon kapanmadan birini araman lazım.", en: "You have three old client numbers in hand, you need to call one before the phone hangs up." },
    choices: [
      { id: "a", text: { tr: "Yüksek bütçeli eski müşteriyi ara.", en: "Call the high-budget old client." }, reward: { interest: 12 } },
      { id: "b", text: { tr: "En son iyi ayrıldığın müşteriyi ara.", en: "Call the client you last parted ways with on good terms." }, reward: { suspicion: -8 } },
      { id: "c", text: { tr: "Uzun zamandır aramadığın birini dene.", en: "Try someone you haven't called in a long time." }, reward: { fun: 10 } },
    ],
  },
  {
    id: "hizli-arama-yonlendirme",
    title: { tr: "Çağrı Yönlendirme", en: "Call Forwarding" },
    prompt: { tr: "Ofis hattı çalıyor, Muzaffer Bey \"sen bak\" dedi. Kimi önceliklendiriyorsun?", en: "The office line is ringing, Muzaffer Bey said \"you get it\". Who are you prioritizing?" },
    choices: [
      { id: "a", text: { tr: "Acil görünen aramayı al.", en: "Take the call that looks urgent." }, reward: { interest: 10, suspicion: 2 } },
      { id: "b", text: { tr: "Sakin sesli arayanı al, dikkatli dinle.", en: "Take the caller with the calm voice, listen carefully." }, reward: { suspicion: -10 } },
      { id: "c", text: { tr: "Kim çıkarsa çıksın, hemen aç.", en: "Whoever it turns out to be, answer immediately." }, reward: { fun: 12 } },
    ],
  },
  {
    id: "hizli-arama-geri-donus",
    title: { tr: "Geri Dönüş Baskısı", en: "Callback Pressure" },
    prompt: { tr: "Üç kişi aynı anda seni geri aramanı bekliyor, süren kısıtlı.", en: "Three people are waiting for you to call them back at the same time, your time is limited." },
    choices: [
      { id: "a", text: { tr: "En çok bekleteni ara.", en: "Call the one waiting the longest." }, reward: { suspicion: -6, interest: 4 } },
      { id: "b", text: { tr: "En sıcak ilgiliyi ara.", en: "Call the most warmly interested one." }, reward: { interest: 14 } },
      { id: "c", text: { tr: "Hepsine tek seferde toplu mesaj at.", en: "Send a group message to all of them at once." }, reward: { fun: 8 } },
    ],
  },
];

export function pickQuickCall(excludeId?: string): WorkTaskDef {
  const pool = excludeId ? quickCallDefs.filter((t) => t.id !== excludeId) : quickCallDefs;
  return pool[Math.floor(Math.random() * pool.length)];
}
