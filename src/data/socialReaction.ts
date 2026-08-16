/**
 * Satış Sonrası Sosyal Medya Tepkisi — a purely cosmetic celebration toast
 * shown when a sale is this week's best (highest finalPrice) so far.
 * Doesn't touch any stat — just a dopamine beat for a standout sale,
 * reusing the same toast pattern as the existing "Kaydedildi ✓" indicator.
 */
const comments = [
  "🔥 Efsane bir satış!",
  "😍 Bu ev tam bana göreydi, tebrikler!",
  "👏 Emlah gerçekten işinin ustası.",
  "💰 Bu fiyata mı, inanılmaz!",
  "🙌 Muzaffer Bey bugün gurur duyar.",
];

const commenters = ["Bora", "Cemil Abi", "Kankam", "Züleyha Teyze", "bir takipçi"];

export interface SocialReaction {
  likes: number;
  comment: string;
  commenter: string;
}

export function generateSocialReaction(): SocialReaction {
  const likes = 40 + Math.floor(Math.random() * 200);
  const comment = comments[Math.floor(Math.random() * comments.length)];
  const commenter = commenters[Math.floor(Math.random() * commenters.length)];
  return { likes, comment, commenter };
}
