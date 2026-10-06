import type { Localized } from "./language";
export interface ChitchatChoice {
  id: string;
  text: Localized;
  reaction: Localized;
  /** Applied to the upcoming house's starting stats when picked — most choices are pure flavor, this is the occasional reward for a clever answer. */
  bonus?: { suspicion?: number; interest?: number; fun?: number };
}

export interface ChitchatSet {
  id: string;
  prompt: Localized;
  choices: ChitchatChoice[];
}

/**
 * Mostly-flavor exchanges with Muzaffer Bey — skippable small talk that
 * makes him feel like an actual person instead of a quota-announcing
 * machine. One choice per set is the "clever" answer and nudges the next
 * house's starting stats a little, so paying attention pays off without
 * making every exchange feel mandatory.
 */
export const chitchatSets: ChitchatSet[] = [
  {
    id: "araba",
    prompt: { tr: "Aklıma geldi, sen hâlâ o eski arabayla mı geziyorsun?", en: "It crossed my mind, are you still driving that old car?" },
    choices: [
      { id: "a", text: { tr: "Ne yazık ki evet Muzaffer Bey", en: "Unfortunately yes, Mr. Muzaffer" }, reaction: { tr: "Bir gün o da düzelir aslanım, sabret.", en: "One day that will get better too my lion, be patient." } },
      {
        id: "b",
        text: { tr: "Yeni bir şeyler düşünüyorum aslında.", en: "I'm actually thinking of something new." },
        reaction: { tr: "İşte bu! Önce sat, sonra al.", en: "That's it! Sell first, then buy." },
        bonus: { interest: 6 },
      },
      { id: "c", text: { tr: "Konuyu değiştirelim mi?", en: "Shall we change the subject?" }, reaction: { tr: "Haklısın haklısın, işimize bakalım.", en: "You're right you're right, let's get back to work." } },
    ],
  },
  {
    id: "kahve",
    prompt: { tr: "Bu sabah kahve içtin mi, sesin biraz uykulu geliyor", en: "Did you drink coffee this morning, your voice sounds a bit sleepy" },
    choices: [
      { id: "a", text: { tr: "İçtim ama yetmedi galiba.", en: "I drank but I guess it wasn't enough." }, reaction: { tr: "İkinci fincan bazen mucize yaratır.", en: "A second cup sometimes works miracles." } },
      { id: "b", text: { tr: "Kahveye değil, tatile ihtiyacım var.", en: "I don't need coffee, I need a vacation." }, reaction: { tr: "Tatili satışlardan sonra konuşalım", en: "Let's talk about the vacation after the sales" } },
      {
        id: "c",
        text: { tr: "Enerjim yerinde, merak etmeyin.", en: "My energy is up, don't worry." },
        reaction: { tr: "İşte bunu duymak istiyordum!", en: "That's what I wanted to hear!" },
        bonus: { fun: 6 },
      },
    ],
  },
  {
    id: "futbol",
    prompt: { tr: "Dün akşamki maçı izledin mi? Rezaletti resmen.", en: "Did you watch the match last night? It was an absolute disaster." },
    choices: [
      { id: "a", text: { tr: "İzledim, hiç sormayın.", en: "I watched it, don't even ask." }, reaction: { tr: "Anlaştık öyleyse, hakem rezaletti.", en: "We agree then, the referee was a disgrace." } },
      { id: "b", text: { tr: "Açıkçası izlemedim.", en: "Frankly, I didn't watch it." }, reaction: { tr: "İyi etmişsin, sinirlerine iyi gelir.", en: "You did well, it's good for your nerves." } },
      {
        id: "c",
        text: { tr: "Ben spor haberlerini satıştan sonra okurum.", en: "I read the sports news after the sale." },
        reaction: { tr: "İşte bu disiplin!", en: "Now that's discipline!" },
        bonus: { interest: 6 },
      },
    ],
  },
  {
    id: "kilo",
    prompt: { tr: "Bu ara ofiste börek bol, dikkat et şişmanlarsın", en: "There's plenty of pastry in the office lately, be careful or you'll get fat" },
    choices: [
      { id: "a", text: { tr: "Bir tane fazla zarar vermez herhalde.", en: "One extra won't hurt, I suppose." }, reaction: { tr: "Öyle öyle, hayat kısa.", en: "Exactly, life is short." } },
      { id: "b", text: { tr: "Diyetteyim aslında.", en: "I'm actually on a diet." }, reaction: { tr: "Aferin, iradene hayranım.", en: "Well done, I admire your willpower." } },
      {
        id: "c",
        text: { tr: "Böreği kim reddedebilir ki?", en: "Who can refuse pastry?" },
        reaction: { tr: "Felsefi bir soru bu", en: "That's a philosophical question" },
        bonus: { fun: 8 },
      },
    ],
  },
  {
    id: "hava",
    prompt: { tr: "Bugün hava resmen İstanbul klasiği, hem güneş hem yağmur.", en: "Today the weather is literally an Istanbul classic, both sun and rain." },
    choices: [
      {
        id: "a",
        text: { tr: "Şemsiyeyi de aldım, montu da.", en: "I took the umbrella and the coat too." },
        reaction: { tr: "İşte tam bir profesyonel.", en: "That's a true professional." },
        bonus: { suspicion: -5 },
      },
      { id: "b", text: { tr: "Ben havayı hiç takip etmem.", en: "I never follow the weather." }, reaction: { tr: "Cesur bir yaklaşım aslanım.", en: "A brave approach, my lion." } },
      { id: "c", text: { tr: "İstanbul'da hava hep sürpriz zaten.", en: "The weather in Istanbul is always a surprise anyway." }, reaction: { tr: "Doğrusun, alışmışız artık.", en: "You're right, we're used to it by now." } },
    ],
  },
  {
    id: "emeklilik",
    prompt: { tr: "Bazen düşünüyorum da, emekli olunca sahilde çay ocağı açsam mı?", en: "Sometimes I think, should I open a tea house on the beach when I retire?" },
    choices: [
      { id: "a", text: { tr: "Size çok yakışır Muzaffer Bey.", en: "It would suit you very well, Mr. Muzaffer." }, reaction: { tr: "Değil mi ya, hayal kuruyorum bazen.", en: "Right? I just daydream sometimes." } },
      { id: "b", text: { tr: "Önce beni terfi ettirin, sonra düşünürsünüz.", en: "Promote me first, then you can think about it." }, reaction: { tr: "Haklısın, sırası gelince konuşuruz", en: "You're right, we'll talk when the time comes" } },
      {
        id: "c",
        text: { tr: "Çay ocağında da müşteri ikna etmek gerekir ama.", en: "But you need to convince customers in a tea house too." },
        reaction: { tr: "Vay be, hiç öyle düşünmemiştim.", en: "Wow, I had never thought of it that way." },
        bonus: { interest: 8 },
      },
    ],
  },
];

export function pickChitchat(excludeId?: string): ChitchatSet {
  const pool = excludeId ? chitchatSets.filter((c) => c.id !== excludeId) : chitchatSets;
  return pool[Math.floor(Math.random() * pool.length)];
}
