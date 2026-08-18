import type { WorkTaskDef } from "./workTasks";

/**
 * "Sahneye Koyma" — a quick, one-tap staging choice for the house about to
 * be shown. Same WorkTaskDef shape as workTasks.ts/quickCall.ts (reuses
 * WorkTaskScreen as-is, resolved through the same completeWorkTask/
 * taskReward pipeline), and fills the SAME occasional interruption slot as
 * office chores — frequency is unchanged, this just adds variety to what
 * can appear there, so it stays light instead of interrupting every house.
 */
export const stagingTasks: WorkTaskDef[] = [
  {
    id: "perdeler",
    title: "Sahneye Koyma",
    tag: "Eve girmeden önce",
    prompt: "Kapıyı açmadan önce evi biraz hazırlasan mı?",
    choices: [
      { id: "a", text: "Perdeleri aç, gün ışığı içeri dolsun.", reward: { interest: 10 } },
      { id: "b", text: "Her şeyi olduğu gibi bırak, doğal görünsün.", reward: { suspicion: -6 } },
      { id: "c", text: "Hafif bir müzik açıp havayı yumuşat.", reward: { fun: 8 } },
    ],
  },
  {
    id: "koku",
    title: "Sahneye Koyma",
    tag: "Eve girmeden önce",
    prompt: "Kapıdan girer girmez ilk izlenim önemli — ne yapıyorsun?",
    choices: [
      { id: "a", text: "Taze kahve kokusu spreyle.", reward: { fun: 10 } },
      { id: "b", text: "Pencereleri aç, havalandır.", reward: { suspicion: -8 } },
      { id: "c", text: "Küçük bir çiçek buketi bırak.", reward: { interest: 8 } },
    ],
  },
  {
    id: "toplama",
    title: "Sahneye Koyma",
    tag: "Eve girmeden önce",
    prompt: "Son bir tur atıp evi toparlasan mı?",
    choices: [
      { id: "a", text: "Dağınık köşeleri hızlıca topla.", reward: { suspicion: -6, interest: 4 } },
      { id: "b", text: "Sadece salonu düzenle, vaktin yok.", reward: { interest: 8 } },
      { id: "c", text: "Boş ver, doğallığı bozma.", reward: { fun: 6 } },
    ],
  },
  {
    id: "isik",
    title: "Sahneye Koyma",
    tag: "Eve girmeden önce",
    prompt: "Işıkları nasıl ayarlıyorsun?",
    choices: [
      { id: "a", text: "Tüm lambaları aç, ev daha geniş görünsün.", reward: { interest: 10 } },
      { id: "b", text: "Sıcak, loş bir ışık bırak.", reward: { fun: 8 } },
      { id: "c", text: "Doğal ışığa güven, dokunma.", reward: { suspicion: -6 } },
    ],
  },
];

export function pickStagingTask(excludeId?: string): WorkTaskDef {
  const pool = excludeId ? stagingTasks.filter((t) => t.id !== excludeId) : stagingTasks;
  return pool[Math.floor(Math.random() * pool.length)];
}
