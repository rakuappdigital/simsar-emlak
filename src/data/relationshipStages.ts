/**
 * "İlişki Evreleri" — turns the previously silent friendBondCounts counter
 * (see friendBondMilestones.ts) into a real 3-stage arc for the 5 recurring
 * friend characters: Tanışıklık (0-2) → Güven (3-5, a real favor choice) →
 * Yakınlık (6+, an upgraded epilogue if the favor was accepted). Reuses the
 * EXACT existing milestone thresholds (3/6/10 stays the counting cadence —
 * the favor fires at 3, the richer epilogue at 10) so nothing about the
 * existing counter/milestone-message system changes for players who never
 * touch the new favor choice.
 */
export type RelationshipStage = "taniskilik" | "guven" | "yakinlik";

export function stageForBondCount(count: number): RelationshipStage {
  if (count >= 10) return "yakinlik";
  if (count >= 3) return "guven";
  return "taniskilik";
}

/** Small one-off cost for accepting the favor — enough to feel like a real ask, never enough to meaningfully hurt the economy. */
export const FAVOR_ACCEPT_COST = 8000;
/** Extra bond nudge on top of the normal +1 from the house-tip accept that triggered the milestone — pushes meaningfully toward Yakınlık. */
export const FAVOR_ACCEPT_BOND_BONUS = 1;

export function favorRequestLine(friendName: string, profession: string): string {
  return `${friendName}: Senden bir iyilik isteyeceğim, ${profession.toLowerCase()} işim için birkaç saatliğine yardımına ihtiyacım var. Uygun musun?`;
}

export function favorAcceptReply(friendName: string): string {
  const lines = [
    `${friendName}: Gerçekten sağ ol, senin gibi bir dostum olduğu için şanslıyım.`,
    `${friendName}: Bunu unutmayacağım, iyiliğinin karşılığını öderim.`,
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

export function favorDeclineReply(friendName: string): string {
  const lines = [
    `${friendName}: Anlıyorum, boş zamanın olmayabilir. Sorun değil.`,
    `${friendName}: Tamam, başka birine sorarım o zaman.`,
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

/** The upgraded Yakınlık message, shown ALONGSIDE (never instead of) the existing milestone-10 line, only if the favor was accepted at milestone 3. */
export function yakinlikEpilogueLine(friendName: string): string {
  return `${friendName}: Biliyor musun, artık seni gerçekten yakın biri olarak görüyorum — sıradan bir iş ilişkisinin çok ötesinde bu.`;
}

/**
 * "Herkese Aynı Şeyi mi Söylüyorsun?" — a one-time, purely narrative beat
 * if the player is spreading bond points thin across 3+ friends at once
 * without ever reaching Yakınlık with any of them. No bond penalty (that
 * would feel punishing/confusing) — just a values-compass nudge, reusing
 * the exact same classifyCompassChoice-adjacent tally already tracked
 * elsewhere, since "insincere breadth" is honestly a kurnazlık-flavored
 * pattern in this game's own vocabulary.
 */
export const BREADTH_CONFRONTATION_MIN_FRIENDS = 3;

export function breadthConfrontationLine(friendName: string): string {
  return `${friendName}: Bazen herkese aynı ilgiyi gösteriyormuşsun gibi hissediyorum, sadece belirtmek istedim.`;
}

/**
 * "Zor Zamanlar" — the mirror image of the Güven-stage favor: instead of a
 * friend asking Emlah for help, EMLAH can reach out when he's genuinely
 * struggling (low bossMood or a losing streak) to a Güven+ friend. One-time
 * per friend (hardTimesUsed), same MessagesPanel accept/decline-button
 * pattern reused in reverse — this is what turns the relationship into a
 * real two-way bond instead of Emlah only ever being the one who's asked.
 */
export const HARD_TIMES_BOND_THRESHOLD = 3;
export const HARD_TIMES_BOSS_MOOD_THRESHOLD = 30;
export const HARD_TIMES_LOSS_STREAK = 2;
export const HARD_TIMES_BOND_BONUS = 1;

export function hardTimesAskLine(friendName: string): string {
  return `Merhaba ${friendName}, açıkçası bu aralar işler pek iyi gitmiyor. Bir tavsiyen ya da yardımın olur mu?`;
}

export function hardTimesReplyLine(friendName: string, stage: RelationshipStage): string {
  if (stage === "yakinlik") {
    const lines = [
      `${friendName}: Elbette, senin için her zaman vaktim var. Hemen yardımcı olayım.`,
      `${friendName}: Bunu sormana gerek bile yoktu, tabii ki yanındayım.`,
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }
  const lines = [
    `${friendName}: Tabii, elimden geleni yaparım.`,
    `${friendName}: Bu aralar ben de yoğunum ama sana biraz zaman ayırabilirim.`,
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

/** Yakınlık-stage friends give a stronger real reward than Güven-stage ones — same "the deeper the bond, the more it's actually worth" principle as the favor system. */
export function hardTimesReward(stage: RelationshipStage): { bonusEarnings: number; energy: number; bossMood: number } {
  if (stage === "yakinlik") return { bonusEarnings: 20000, energy: 15, bossMood: 4 };
  return { bonusEarnings: 10000, energy: 8, bossMood: 2 };
}
