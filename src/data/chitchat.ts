export interface ChitchatChoice {
  id: string;
  text: string;
  reaction: string;
}

export interface ChitchatSet {
  id: string;
  prompt: string;
  choices: ChitchatChoice[];
}

/**
 * Pure flavor exchanges with Muzaffer Bey — no stat effects, entirely
 * skippable. Randomly offered before some house intros just to keep him
 * feeling like an actual person instead of a quota-announcing machine.
 */
export const chitchatSets: ChitchatSet[] = [
  {
    id: "araba",
    prompt: "Aklıma geldi, sen hâlâ o eski arabayla mı geziyorsun? 😄",
    choices: [
      { id: "a", text: "Ne yazık ki evet Muzaffer Bey 😅", reaction: "Bir gün o da düzelir aslanım, sabret." },
      { id: "b", text: "Yeni bir şeyler düşünüyorum aslında.", reaction: "İşte bu! Önce sat, sonra al." },
      { id: "c", text: "Konuyu değiştirelim mi? 😄", reaction: "Haklısın haklısın, işimize bakalım." },
    ],
  },
  {
    id: "kahve",
    prompt: "Bu sabah kahve içtin mi, sesin biraz uykulu geliyor ☕",
    choices: [
      { id: "a", text: "İçtim ama yetmedi galiba.", reaction: "İkinci fincan bazen mucize yaratır." },
      { id: "b", text: "Kahveye değil, tatile ihtiyacım var.", reaction: "Tatili satışlardan sonra konuşalım 😄" },
      { id: "c", text: "Enerjim yerinde, merak etmeyin.", reaction: "İşte bunu duymak istiyordum!" },
    ],
  },
  {
    id: "futbol",
    prompt: "Dün akşamki maçı izledin mi? Rezaletti resmen.",
    choices: [
      { id: "a", text: "İzledim, hiç sormayın.", reaction: "Anlaştık öyleyse, hakem rezaletti." },
      { id: "b", text: "Açıkçası izlemedim.", reaction: "İyi etmişsin, sinirlerine iyi gelir." },
      { id: "c", text: "Ben spor haberlerini satıştan sonra okurum.", reaction: "İşte bu disiplin!" },
    ],
  },
  {
    id: "kilo",
    prompt: "Bu ara ofiste börek bol, dikkat et şişmanlarsın 😄",
    choices: [
      { id: "a", text: "Bir tane fazla zarar vermez herhalde.", reaction: "Öyle öyle, hayat kısa." },
      { id: "b", text: "Diyetteyim aslında.", reaction: "Aferin, iradene hayranım." },
      { id: "c", text: "Böreği kim reddedebilir ki?", reaction: "Felsefi bir soru bu 😄" },
    ],
  },
  {
    id: "hava",
    prompt: "Bugün hava resmen İstanbul klasiği, hem güneş hem yağmur.",
    choices: [
      { id: "a", text: "Şemsiyeyi de aldım, montu da.", reaction: "İşte tam bir profesyonel." },
      { id: "b", text: "Ben havayı hiç takip etmem.", reaction: "Cesur bir yaklaşım aslanım." },
      { id: "c", text: "İstanbul'da hava hep sürpriz zaten.", reaction: "Doğrusun, alışmışız artık." },
    ],
  },
  {
    id: "emeklilik",
    prompt: "Bazen düşünüyorum da, emekli olunca sahilde çay ocağı açsam mı?",
    choices: [
      { id: "a", text: "Size çok yakışır Muzaffer Bey.", reaction: "Değil mi ya, hayal kuruyorum bazen." },
      { id: "b", text: "Önce beni terfi ettirin, sonra düşünürsünüz.", reaction: "Haklısın, sırası gelince konuşuruz 😄" },
      { id: "c", text: "Çay ocağında da müşteri ikna etmek gerekir ama.", reaction: "Vay be, hiç öyle düşünmemiştim." },
    ],
  },
];

export function pickChitchat(excludeId?: string): ChitchatSet {
  const pool = excludeId ? chitchatSets.filter((c) => c.id !== excludeId) : chitchatSets;
  return pool[Math.floor(Math.random() * pool.length)];
}
