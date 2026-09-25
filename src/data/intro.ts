import type { HouseScene } from "../types";
import { resolveHouseTitle, resolveHouseLocation, type Localized } from "./language";

export interface IntroMessage {
  from: string;
  text: Localized;
}

export interface HouseIntro {
  messages: IntroMessage[];
  thought: Localized;
}

export const houseIntros: Record<string, HouseIntro> = {
  "kokulu-studyo": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım günaydın 🌞", en: "Good morning Estetan 🌞" } },
      { from: "Muzaffer Bey", text: { tr: "Bugün Nişantaşı'ndaki stüdyoyu göstereceksin", en: "Today you'll be showing the studio in Nişantaşı" } },
      { from: "Muzaffer Bey", text: { tr: "Müşteri hassas biri, koku falan sorabilir", en: "The client is a sensitive person, might ask about smells and stuff" } },
      { from: "Muzaffer Bey", text: { tr: "Sen hallet, ben sana güveniyorum 💪", en: "You handle it, I trust you 💪" } },
      { from: "Muzaffer Bey", text: { tr: "Bu ay kota 3, şu ana kadar 0 😊", en: "This month's quota is 3, so far 0 😊" } },
    ],
    thought: { tr: "Sıfır. Ay'ın 22'sinde sıfır. Süper başlangıç.", en: "Zero. Zero on the 22nd of the month. Super start." },
  },
  "hayaletli-daire": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah aslanım bugün Cihangir'deki daireyi göstereceksin", en: "Estetan my boy, today you'll show the apartment in Cihangir" } },
      { from: "Muzaffer Bey", text: { tr: "Anne kız geliyor, biraz maneviyata düşkünler", en: "A mother and daughter are coming, they are a bit into spirituality" } },
      { from: "Muzaffer Bey", text: { tr: "Ne dersen de ama sakın 'hayalet' kelimesini sen ağzına alma 😅", en: "Say whatever you want but don't you ever say the word 'ghost' 😅" } },
    ],
    thought: { tr: "Hayalet kelimesini ben ağzıma almam ama müşteri alırsa ne yapayım.", en: "I won't utter the word ghost, but what if the client does." },
  },
  "denize-sifir": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Bakırköy'deki daireyi göstereceksin", en: "Estetan my boy, today you'll show the apartment in Bakırköy" } },
      { from: "Muzaffer Bey", text: { tr: "Müşteri emekli, deniz manzarası istiyor", en: "The client is retired, wants a sea view" } },
      { from: "Muzaffer Bey", text: { tr: "Manzara var mı yok mu, o senin yorumuna kalmış 😅", en: "Whether there is a view or not is up to your interpretation 😅" } },
    ],
    thought: { tr: "Manzara var... teknik olarak. Küçük bir teknik detay.", en: "There is a view... technically. A minor technical detail." },
  },
  "kambur-balkon": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah aslanım bugün Kadıköy'deki daireyi göstereceksin", en: "Estetan my boy, today you'll show the apartment in Kadıköy" } },
      { from: "Muzaffer Bey", text: { tr: "Genç bir çift geliyor, ilk evleri olacak", en: "A young couple is coming, it will be their first home" } },
      { from: "Muzaffer Bey", text: { tr: "Balkon konusunu sen bilirsin, ben bir şey demedim 🙈", en: "You know about the balcony issue, I didn't say anything 🙈" } },
    ],
    thought: { tr: "Balkon konusu derken tam olarak neyi kastetti acaba.", en: "I wonder what exactly he means by the balcony issue." },
  },
  "kedi-cenneti": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Üsküdar'daki daireyi göstereceksin", en: "My Estetan, you will show the apartment in Üsküdar today" } },
      { from: "Muzaffer Bey", text: { tr: "Müşteri hayvansever biri, çok sevecek", en: "The client is an animal lover, will love it very much" } },
      { from: "Muzaffer Bey", text: { tr: "Önceki sahibi biraz fazla hayvan severmiş 😅", en: "The previous owner was a bit too much of an animal lover 😅" } },
    ],
    thought: { tr: "Fazla derken ne kadar fazla acaba.", en: "I wonder how much is too much." },
  },
  "asansorsuz-zirve": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah aslanım bugün Şişli'deki daireyi göstereceksin", en: "My lion Estetan, you will show the apartment in Şişli today" } },
      { from: "Muzaffer Bey", text: { tr: "Emekli bir çift geliyor, manzaraya bayılacaklar", en: "A retired couple is coming, they will love the view" } },
      { from: "Muzaffer Bey", text: { tr: "7. kat ama merak etme, spor gibi düşün 💪", en: "It's the 7th floor but don't worry, think of it as a workout 💪" } },
    ],
    thought: { tr: "Spor derken merdiven kastediyor sanırım.", en: "I suppose he means stairs when he says workout." },
  },
  "nem-galerisi": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Balat'taki daireyi göstereceksin", en: "My Estetan, you will show the apartment in Balat today" } },
      { from: "Muzaffer Bey", text: { tr: "Sanatçı bir müşteri geliyor, sanatsal bak olaya", en: "An artist client is coming, look at the situation artistically" } },
      { from: "Muzaffer Bey", text: { tr: "Duvarlardaki desenler de bir tür eser sayılır 🎨", en: "The patterns on the walls count as a kind of artwork too 🎨" } },
    ],
    thought: { tr: "Sanatsal bakış açısı derken nemi mi kastediyor.", en: "I wonder if he means the humidity when he says artistic perspective." },
  },
  "davulcu-komsu": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah aslanım bugün Beşiktaş'taki daireyi göstereceksin", en: "My lion Estetan, you will show the apartment in Beşiktaş today" } },
      { from: "Muzaffer Bey", text: { tr: "Yazar bir müşteri, sessizlik istiyor", en: "A writer client, wants silence" } },
      { from: "Muzaffer Bey", text: { tr: "Alt komşu biraz müzikle ilgileniyor, önemli değil 🎵", en: "The downstairs neighbor is a bit into music, doesn't matter 🎵" } },
    ],
    thought: { tr: "Önemli değil derken davul çaldığını mı kastediyor acaba.", en: "I wonder if he means he plays the drums when he says doesn't matter." },
  },
  "tapu-sorunlu": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Bebek'teki daireyi göstereceksin", en: "My Estetan, you will show the apartment in Bebek today" } },
      { from: "Muzaffer Bey", text: { tr: "Müşteri çok detaycı, iş kadını", en: "The client is very detail-oriented, a businesswoman" } },
      { from: "Muzaffer Bey", text: { tr: "Tapuyla ilgili küçük bir formalite var, dert etme 📄", en: "There's a minor formality regarding the title deed, don't worry 📄" } },
    ],
    thought: { tr: "Küçük formalite derken tam olarak ne kadar küçük.", en: "How minor exactly when he says minor formality." },
  },
  minicik: {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah aslanım bugün Tarlabaşı'ndaki stüdyoyu göstereceksin", en: "My lion Estetan, you will show the studio in Tarlabaşı today" } },
      { from: "Muzaffer Bey", text: { tr: "Minimalist bir müşteri geliyor, küçük yerleri seviyor", en: "A minimalist client is coming, likes small places" } },
      { from: "Muzaffer Bey", text: { tr: "18 metrekare ama 'öz' bir 18 metrekare 😊", en: "It's 18 square meters but a 'pure' 18 square meters 😊" } },
    ],
    thought: { tr: "Öz derken küçük demek istiyor sanırım.", en: "I guess he means small when he says pure." },
  },
  "aidat-surprizi": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Moda'daki daireyi göstereceksin", en: "My Estetan, you will show the apartment in Moda today" } },
      { from: "Muzaffer Bey", text: { tr: "Genç ve bütçesine dikkat eden bir çift geliyor", en: "A young and budget-conscious couple is coming" } },
      { from: "Muzaffer Bey", text: { tr: "Aidat konusunu fazla detaylandırma 😅", en: "Don't detail the dues issue too much 😅" } },
    ],
    thought: { tr: "Aidatı detaylandırmayınca ne anlatacağım ki zaten.", en: "If I don't detail the dues, what am I going to tell them anyway." },
  },
  "eski-firin": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah aslanım bugün Balat'taki daireyi göstereceksin", en: "My lion Estetan, you will show the apartment in Balat today" } },
      { from: "Muzaffer Bey", text: { tr: "Bir şef geliyor, mutfağı çok merak edecek", en: "A chef is coming, will be very curious about the kitchen" } },
      { from: "Muzaffer Bey", text: { tr: "Alt kat eskiden fırınmış, güzel bir hikaye 🍞", en: "The downstairs used to be a bakery, a beautiful story 🍞" } },
    ],
    thought: { tr: "Güzel hikaye derken un kokusunu mu kastediyor.", en: "Does he mean the smell of flour when he says a beautiful story." },
  },
  "manzara-omurluk": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Ataşehir'deki daireyi göstereceksin", en: "My Estetan, you will show the apartment in Ataşehir today" } },
      { from: "Muzaffer Bey", text: { tr: "İş insanı bir müşteri, manzaraya bayılacak", en: "A businessperson client, will love the view" } },
      { from: "Muzaffer Bey", text: { tr: "Uzaktaki inşaatı hiç gündeme getirme 🙊", en: "Never bring up the construction in the distance 🙊" } },
    ],
    thought: { tr: "Gündeme getirmeyince manzara sonsuza dek kalıcı mı oluyor.", en: "Does the view become eternally permanent when I don't bring it up." },
  },
  "gece-klubu": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah aslanım bugün Taksim'deki daireyi göstereceksin", en: "My lion Estetan, you will show the apartment in Taksim today" } },
      { from: "Muzaffer Bey", text: { tr: "Enerjik genç bir müşteri geliyor, tam yerine göre", en: "An energetic young client is coming, right up their alley" } },
      { from: "Muzaffer Bey", text: { tr: "Gece hayatı derken kastı büyük galiba 🎶", en: "The club below is open until morning, great for nightlife 🕺" } },
    ],
    thought: { tr: "Kastı büyükse ben kulaklık tavsiye ederim.", en: "I guess he means noise when he says great for nightlife." },
  },
  guvercin: {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Cihangir'deki çatı katını göstereceksin", en: "My Estetan, you will show the penthouse in Cihangir today" } },
      { from: "Muzaffer Bey", text: { tr: "Emekli bir öğretmen geliyor, doğaya düşkün", en: "A retired teacher is coming, fond of nature" } },
      { from: "Muzaffer Bey", text: { tr: "Terasta biraz kalabalık olabilir, önemli değil 🕊️", en: "It might be a bit crowded on the terrace, it's not important 🕊️" } },
    ],
    thought: { tr: "Kalabalık derken kaç güvercinden bahsediyor acaba.", en: "I wonder how many pigeons he means by crowded." },
  },
  "kaptan-rutubet": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah aslanım bugün Moda sahilindeki daireyi göstereceksin", en: "My lion Estetan, you will show the apartment on the Moda coast today" } },
      { from: "Muzaffer Bey", text: { tr: "Emekli bir kaptan geliyor, denizi çok seviyor", en: "A retired captain is coming, loves the sea very much" } },
      { from: "Muzaffer Bey", text: { tr: "Duvarlardaki iz de denizin bir hediyesi say 🌊", en: "Consider the mark on the walls a gift from the sea 🌊" } },
    ],
    thought: { tr: "Hediye derken rutubeti mi kastediyor yoksa.", en: "Does he mean the dampness when he says a gift." },
  },
  "miras-kavgasi": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Fatih'teki tarihi daireyi göstereceksin", en: "My Estetan, you will show the historical apartment in Fatih today" } },
      { from: "Muzaffer Bey", text: { tr: "Müşteri avukat, çok detaycı olacaktır", en: "The client is a lawyer, will be very detail-oriented" } },
      { from: "Muzaffer Bey", text: { tr: "Miras konusunu sen bilirsin, ben bir şey demedim 📜", en: "You know about the inheritance issue, I didn't say anything 📜" } },
    ],
    thought: { tr: "Miras konusunu bilmemi istiyorsa keşke biraz bilgi verseydi.", en: "If he wants me to know the inheritance issue, I wish he gave some info." },
  },
  "ogrenci-evi": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Levent'teki daireyi göstereceksin", en: "My Estetan, you will show the apartment in Levent today" } },
      { from: "Muzaffer Bey", text: { tr: "Anne-oğul geliyor, anne biraz titiz", en: "Mother and son are coming, the mother is a bit meticulous" } },
      { from: "Muzaffer Bey", text: { tr: "Duvarlardaki yazılar da bir tür sanat sayılır 🎨", en: "The writings on the walls count as a kind of art too 🎨" } },
    ],
    thought: { tr: "Anne titizse bu duvarlar hiç iyi gitmeyecek.", en: "If the mother is meticulous, these walls won't go well at all." },
  },
  "kapici-hayvan": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah aslanım bugün Kadıköy'deki daireyi göstereceksin", en: "Estetan my boy, today you'll show the apartment in Kadıköy" } },
      { from: "Muzaffer Bey", text: { tr: "Genç bir profesyonel geliyor, çok düzenli biri", en: "A young professional is coming, a very tidy person" } },
      { from: "Muzaffer Bey", text: { tr: "Bodrumdaki küçük dostları hiç gündeme getirme 🐾", en: "Never bring up the little friends in the basement 🐾" } },
    ],
    thought: { tr: "Küçük dostlar derken alerjisi olan biri için hiç iyi değil bu.", en: "When he says little friends, this is not good at all for someone with allergies." },
  },
  "zemin-vitrin": {
    messages: [
      { from: "Muzaffer Bey", text: { tr: "Emlah'ım bugün Nişantaşı'ndaki daireyi göstereceksin", en: "My Estetan, you will show the apartment in Nişantaşı today" } },
      { from: "Muzaffer Bey", text: { tr: "Tanınmış bir müşteri geliyor, dikkatli ol", en: "A well-known client is coming, be careful" } },
      { from: "Muzaffer Bey", text: { tr: "Cam vitrin küçük bir detay, önemli değil 🪟", en: "The glass showcase is a minor detail, it doesn't matter 🪟" } },
    ],
    thought: { tr: "Önemli değil derken mahremiyeti mi kastediyor.", en: "I wonder if he means privacy when he says it doesn't matter." },
  },
};

/** Shown once, only ahead of the very first house of a brand-new game (see App.tsx's isFirstEverDay) — a short welcome/tutorial beat before Emlah's very first assignment. */
export function welcomeIntro(house: HouseScene): HouseIntro {
  const title = resolveHouseTitle(house);
  const location = resolveHouseLocation(house);
  return {
    messages: [
      {
        from: "Muzaffer Bey",
        text: { tr: "Emlah'ım, hoş geldin! Bugünden itibaren bizdensin 🎉", en: "Welcome, Estetan! As of today, you're one of us 🎉" },
      },
      {
        from: "Muzaffer Bey",
        text: {
          tr: "İstanbul emlak piyasası acımasızdır ama doğru müşteriyi doğru evle eşleştirmeyi bilirsen iyi para kazanırsın.",
          en: "Istanbul's real estate market is ruthless, but if you know how to match the right customer with the right house, you'll earn good money.",
        },
      },
      {
        from: "Muzaffer Bey",
        text: {
          tr: "Kural basit: müşteriyi dinle, şüphesini yükseltme, ilgisini canlı tut. Gerisi zamanla gelir.",
          en: "The rule is simple: listen to the customer, don't raise their suspicion, keep their interest alive. The rest comes with time.",
        },
      },
      {
        from: "Muzaffer Bey",
        text: { tr: `İlk işin hazır: bugün ${title} gösteriyorsun`, en: `Your first job is ready: today you're showing ${title}` },
      },
      {
        from: "Muzaffer Bey",
        text: { tr: `${location}, adres SMS'te. Sen hallet, ben sana güveniyorum 💪`, en: `${location}, address is in the SMS. Handle it, I trust you 💪` },
      },
    ],
    thought: { tr: "Tamam Emlah, ilk günün. Derin bir nefes al.", en: "Okay Estetan, your first day. Take a deep breath." },
  };
}

export function defaultIntro(house: HouseScene): HouseIntro {
  const title = resolveHouseTitle(house);
  const location = resolveHouseLocation(house);
  return {
    messages: [
      {
        from: "Muzaffer Bey",
        text: { tr: `Emlah'ım bugün ${title} gösteriyorsun`, en: `My Estetan, you're showing ${title} today` },
      },
      {
        from: "Muzaffer Bey",
        text: { tr: `${location}, adres SMS'te`, en: `${location}, address is in the SMS` },
      },
      {
        from: "Muzaffer Bey",
        text: { tr: "Sen hallet, ben sana güveniyorum 💪", en: "Handle it, I trust you 💪" },
      },
    ],
    thought: { tr: "Bakalım bugün nasıl geçecek.", en: "Let's see how today goes." },
  };
}
