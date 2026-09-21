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
    title: { tr: "Sahneye Koyma", en: "Staging" },
    tag: { tr: "Eve girmeden önce", en: "Before entering the house" },
    prompt: { tr: "Kapıyı açmadan önce evi biraz hazırlasan mı?", en: "Should you prep the house a bit before opening the door?" },
    choices: [
      { id: "a", text: { tr: "Perdeleri aç, gün ışığı içeri dolsun.", en: "Open the curtains, let daylight flood in." }, reward: { interest: 10 } },
      { id: "b", text: { tr: "Her şeyi olduğu gibi bırak, doğal görünsün.", en: "Leave everything as it is, keep it natural." }, reward: { suspicion: -6 } },
      { id: "c", text: { tr: "Hafif bir müzik açıp havayı yumuşat.", en: "Turn on soft music to soften the mood." }, reward: { fun: 8 } },
    ],
  },
  {
    id: "koku",
    title: { tr: "Sahneye Koyma", en: "Staging" },
    tag: { tr: "Eve girmeden önce", en: "Before entering the house" },
    prompt: { tr: "Kapıdan girer girmez ilk izlenim önemli — ne yapıyorsun?", en: "First impressions matter as soon as you walk in — what do you do?" },
    choices: [
      { id: "a", text: { tr: "Taze kahve kokusu spreyle.", en: "Spray fresh coffee aroma." }, reward: { fun: 10 } },
      { id: "b", text: { tr: "Pencereleri aç, havalandır.", en: "Open the windows, air it out." }, reward: { suspicion: -8 } },
      { id: "c", text: { tr: "Küçük bir çiçek buketi bırak.", en: "Leave a small bouquet of flowers." }, reward: { interest: 8 } },
    ],
  },
  {
    id: "toplama",
    title: { tr: "Sahneye Koyma", en: "Staging" },
    tag: { tr: "Eve girmeden önce", en: "Before entering the house" },
    prompt: { tr: "Son bir tur atıp evi toparlasan mı?", en: "Should you take one last round and tidy up the house?" },
    choices: [
      { id: "a", text: { tr: "Dağınık köşeleri hızlıca topla.", en: "Quickly tidy up the messy corners." }, reward: { suspicion: -6, interest: 4 } },
      { id: "b", text: { tr: "Sadece salonu düzenle, vaktin yok.", en: "Only organize the living room, you don't have time." }, reward: { interest: 8 } },
      { id: "c", text: { tr: "Boş ver, doğallığı bozma.", en: "Never mind, don't ruin the naturalness." }, reward: { fun: 6 } },
    ],
  },
  {
    id: "isik",
    title: { tr: "Sahneye Koyma", en: "Staging" },
    tag: { tr: "Eve girmeden önce", en: "Before entering the house" },
    prompt: { tr: "Işıkları nasıl ayarlıyorsun?", en: "How do you set the lights?" },
    choices: [
      { id: "a", text: { tr: "Tüm lambaları aç, ev daha geniş görünsün.", en: "Turn on all the lamps, let the house look more spacious." }, reward: { interest: 10 } },
      { id: "b", text: { tr: "Sıcak, loş bir ışık bırak.", en: "Leave a warm, dim light." }, reward: { fun: 8 } },
      { id: "c", text: { tr: "Doğal ışığa güven, dokunma.", en: "Trust natural light, don't touch." }, reward: { suspicion: -6 } },
    ],
  },
];

export function pickStagingTask(excludeId?: string): WorkTaskDef {
  const pool = excludeId ? stagingTasks.filter((t) => t.id !== excludeId) : stagingTasks;
  return pool[Math.floor(Math.random() * pool.length)];
}
