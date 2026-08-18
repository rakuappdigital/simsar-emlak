import type { ChoiceEffects, ToneBucket } from "../types";

/**
 * "Emlah'ın Sesi" — a lightweight, persisted "voice" that drifts based on
 * the kind of choices the player tends to pick. Derived entirely from
 * ChoiceEffects already present on every choice (no per-house authoring
 * needed): a fun-heavy pick reads as "eğlenceli", a suspicion-lowering pick
 * reads as "samimi", an interest-heavy push reads as "atılgan". Once enough
 * signal has accumulated, the dominant tone occasionally colors a generic
 * prepended thought line — never rewrites existing house content, never
 * touches suspicion/interest/fun/discountPercent itself.
 */
export function classifyChoiceTone(effects: ChoiceEffects | undefined): ToneBucket | null {
  if (!effects) return null;
  const fun = effects.fun ?? 0;
  const interest = effects.interest ?? 0;
  const suspicion = effects.suspicion ?? 0;
  if (fun > 0 && fun >= interest) return "eglenceli";
  if (suspicion < 0) return "samimi";
  if (interest > 0) return "atilgan";
  return null;
}

const MIN_SAMPLES_FOR_DOMINANCE = 8;

export function dominantTone(tally: Record<ToneBucket, number>): ToneBucket | null {
  const total = tally.eglenceli + tally.samimi + tally.atilgan;
  if (total < MIN_SAMPLES_FOR_DOMINANCE) return null;
  const entries = Object.entries(tally) as [ToneBucket, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const [topTone, topCount] = entries[0];
  const [, secondCount] = entries[1];
  // Require a clear lead, not a near-tie, so the voice doesn't flicker between two tones.
  if (topCount - secondCount < total * 0.15) return null;
  return topTone;
}

export const VOICE_LINE_CHANCE = 0.1;

const voiceLines: Record<ToneBucket, string[]> = {
  eglenceli: [
    "(içinden) Yine şakayla açacağım galiba, elimde değil.",
    "(içinden) Ciddi olmaya çalışıyorum ama espri kendini yazıyor.",
  ],
  samimi: [
    "(içinden) Önce güven, gerisi kendiliğinden gelir.",
    "(içinden) İnsanları rahatlatmayı seviyorum, satış ikinci planda kalıyor bazen.",
  ],
  atilgan: [
    "(içinden) Lafı dolandırmadan konuya girsem daha iyi.",
    "(içinden) Çekingen davranmanın kimseye faydası yok, doğrudan gideceğim.",
  ],
};

export function pickVoiceLine(tone: ToneBucket): string {
  const pool = voiceLines[tone];
  return pool[Math.floor(Math.random() * pool.length)];
}

const toneLabels: Record<ToneBucket, string> = {
  eglenceli: "Eğlenceli",
  samimi: "Samimi",
  atilgan: "Atılgan",
};

/** "Emlah'ın Kişilik Profili" — end-game summary of the whole run's tone tally. Null if no signal was ever picked up. */
export function personalitySummary(tally: Record<ToneBucket, number>): string | null {
  const total = tally.eglenceli + tally.samimi + tally.atilgan;
  if (total === 0) return null;
  const parts = (Object.entries(tally) as [ToneBucket, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([tone, count]) => `%${Math.round((count / total) * 100)} ${toneLabels[tone]}`);
  return `${parts.join(", ")} bir emlakçıydın.`;
}
