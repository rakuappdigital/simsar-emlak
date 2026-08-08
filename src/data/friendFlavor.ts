export interface FriendChoice {
  id: string;
  text: string;
  reaction: string;
}

export interface FriendMessageSet {
  id: string;
  contactName: string;
  prompt: string;
  choices: FriendChoice[];
}

/**
 * Purely cosmetic messages from recurring friends outside the work thread —
 * a small easter egg, rare on purpose. No gameplay effect today; the loan
 * tease is deliberate groundwork for a future "borç ver/isteme" mechanic.
 */
export const friendMessageSets: FriendMessageSet[] = [
  {
    id: "bora-borc",
    contactName: "Bora",
    prompt: "Kanka müsait misin, ufak bir konu var...",
    choices: [
      { id: "a", text: "Ne oldu, anlat bakalım.", reaction: "Yok bir şey açıkçası, borç isteyecektim ama sonra sorarım 😅" },
      { id: "b", text: "Param yok kanka, baştan söyleyeyim 😄", reaction: "Hahaha tamam tamam, belki bir dahaki sefere." },
      { id: "c", text: "Şu an çok yoğunum, sonra konuşalım mı?", reaction: "Tamamdır, kolay gelsin emlakçı!" },
    ],
  },
  {
    id: "bora-yatirim",
    contactName: "Bora",
    prompt: "Bu ara kripto paraya giriyorum, sen de girsene emlakçı kafasını bırak biraz 😄",
    choices: [
      { id: "a", text: "Ben tuğlaya güveniyorum kanka, sağlam iş.", reaction: "Haklısın valla, ev hiç değer kaybetmiyor." },
      { id: "b", text: "O da ne şimdi? 😄", reaction: "Cahil kalma öyle, biraz araştır bence." },
      { id: "c", text: "Sen bilirsin, ben riske girmem.", reaction: "Aferin, akıllı adamsın sen." },
    ],
  },
  {
    id: "melike-dedikodu",
    contactName: "Melike",
    prompt: "Duydun mu, mahallenin ünlü çifti ayrılmış! 👀",
    choices: [
      { id: "a", text: "Yok artık, ciddi misin?", reaction: "Valla öyle diyorlar, herkes konuşuyor." },
      { id: "b", text: "Ben dedikoduya karışmam 😄", reaction: "Aman ne temiz insansın." },
      { id: "c", text: "Kimden duydun bunu?", reaction: "Sorma sen, kaynağım sağlam." },
    ],
  },
  {
    id: "melike-tavsiye",
    contactName: "Melike",
    prompt: "Bu arada bir ev bakıyorum da, sen bilirsin bu işleri, tavsiyen var mı?",
    choices: [
      { id: "a", text: "Bana gel, sana özel bir şeyler bulurum.", reaction: "Vay be, iş insanı gibi konuştun şimdi 😄" },
      { id: "b", text: "Acele etme, iyi araştır.", reaction: "Haklısın, acele işe şeytan karışır derler." },
      { id: "c", text: "Şu an biraz meşgulüm, akşam konuşalım mı?", reaction: "Tamam tamam, kolay gelsin!" },
    ],
  },
];

export function pickFriendMessage(excludeId?: string): FriendMessageSet {
  const pool = excludeId ? friendMessageSets.filter((f) => f.id !== excludeId) : friendMessageSets;
  return pool[Math.floor(Math.random() * pool.length)];
}
