import { resolveText, type Localized } from "./language";
/**
 * Satış Sonrası Sosyal Medya Tepkisi — a purely cosmetic celebration toast
 * shown when a sale is this week's best (highest finalPrice) so far.
 * Doesn't touch any stat — just a dopamine beat for a standout sale,
 * reusing the same toast pattern as the existing "Kaydedildi ✓" indicator.
 */
const comments: Localized[] = [
  { tr: "Efsane bir satış!", en: "Legendary sale!" },
  { tr: "Bu ev tam bana göreydi, tebrikler!", en: "This house was just right for me, congrats!" },
  { tr: "Emlah gerçekten işinin ustası.", en: "Estetan is truly a master of his craft." },
  { tr: "Bu fiyata mı, inanılmaz!", en: "At this price, unbelievable!" },
  { tr: "Muzaffer Bey bugün gurur duyar.", en: "Muzaffer Bey would be proud today." },
];

const commenters: Localized[] = [{ tr: "Bora", en: "Bora" }, { tr: "Cemil Abi", en: "Cemil Bro" }, { tr: "Kankam", en: "My Buddy" }, { tr: "Züleyha Teyze", en: "Aunt Züleyha" }, { tr: "bir takipçi", en: "a follower" }];

export interface SocialReaction {
  likes: number;
  comment: string;
  commenter: string;
}

export function generateSocialReaction(): SocialReaction {
  const likes = 40 + Math.floor(Math.random() * 200);
  const comment = resolveText(comments[Math.floor(Math.random() * comments.length)]);
  const commenter = resolveText(commenters[Math.floor(Math.random() * commenters.length)]);
  return { likes, comment, commenter };
}
