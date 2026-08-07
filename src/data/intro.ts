import type { HouseScene, PhoneMessage } from "../types";

export interface HouseIntro {
  messages: PhoneMessage[];
  thought: string;
}

export const houseIntros: Record<string, HouseIntro> = {
  "kokulu-studyo": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah'ım günaydın 🌞" },
      { from: "Muzaffer Bey", text: "Bugün Nişantaşı'ndaki stüdyoyu göstereceksin" },
      { from: "Muzaffer Bey", text: "Müşteri hassas biri, koku falan sorabilir" },
      { from: "Muzaffer Bey", text: "Sen hallet, ben sana güveniyorum 💪" },
      { from: "Muzaffer Bey", text: "Bu ay kota 3, şu ana kadar 0 😊" },
    ],
    thought: "Sıfır. Ay'ın 22'sinde sıfır. Süper başlangıç.",
  },
  "hayaletli-daire": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah aslanım bugün Cihangir'deki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Anne kız geliyor, biraz maneviyata düşkünler" },
      { from: "Muzaffer Bey", text: "Ne dersen de ama sakın 'hayalet' kelimesini sen ağzına alma 😅" },
    ],
    thought: "Hayalet kelimesini ben ağzıma almam ama müşteri alırsa ne yapayım.",
  },
  "denize-sifir": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah'ım bugün Bakırköy'deki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Müşteri emekli, deniz manzarası istiyor" },
      { from: "Muzaffer Bey", text: "Manzara var mı yok mu, o senin yorumuna kalmış 😅" },
    ],
    thought: "Manzara var... teknik olarak. Küçük bir teknik detay.",
  },
  "kambur-balkon": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah aslanım bugün Kadıköy'deki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Genç bir çift geliyor, ilk evleri olacak" },
      { from: "Muzaffer Bey", text: "Balkon konusunu sen bilirsin, ben bir şey demedim 🙈" },
    ],
    thought: "Balkon konusu derken tam olarak neyi kastetti acaba.",
  },
  "kedi-cenneti": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah'ım bugün Üsküdar'daki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Müşteri hayvansever biri, çok sevecek" },
      { from: "Muzaffer Bey", text: "Önceki sahibi biraz fazla hayvan severmiş 😅" },
    ],
    thought: "Fazla derken ne kadar fazla acaba.",
  },
  "asansorsuz-zirve": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah aslanım bugün Şişli'deki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Emekli bir çift geliyor, manzaraya bayılacaklar" },
      { from: "Muzaffer Bey", text: "7. kat ama merak etme, spor gibi düşün 💪" },
    ],
    thought: "Spor derken merdiven kastediyor sanırım.",
  },
  "nem-galerisi": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah'ım bugün Balat'taki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Sanatçı bir müşteri geliyor, sanatsal bak olaya" },
      { from: "Muzaffer Bey", text: "Duvarlardaki desenler de bir tür eser sayılır 🎨" },
    ],
    thought: "Sanatsal bakış açısı derken nemi mi kastediyor.",
  },
  "davulcu-komsu": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah aslanım bugün Beşiktaş'taki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Yazar bir müşteri, sessizlik istiyor" },
      { from: "Muzaffer Bey", text: "Alt komşu biraz müzikle ilgileniyor, önemli değil 🎵" },
    ],
    thought: "Önemli değil derken davul çaldığını mı kastediyor acaba.",
  },
  "tapu-sorunlu": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah'ım bugün Bebek'teki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Müşteri çok detaycı, iş kadını" },
      { from: "Muzaffer Bey", text: "Tapuyla ilgili küçük bir formalite var, dert etme 📄" },
    ],
    thought: "Küçük formalite derken tam olarak ne kadar küçük.",
  },
  minicik: {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah aslanım bugün Tarlabaşı'ndaki stüdyoyu göstereceksin" },
      { from: "Muzaffer Bey", text: "Minimalist bir müşteri geliyor, küçük yerleri seviyor" },
      { from: "Muzaffer Bey", text: "18 metrekare ama 'öz' bir 18 metrekare 😊" },
    ],
    thought: "Öz derken küçük demek istiyor sanırım.",
  },
  "aidat-surprizi": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah'ım bugün Moda'daki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Genç ve bütçesine dikkat eden bir çift geliyor" },
      { from: "Muzaffer Bey", text: "Aidat konusunu fazla detaylandırma 😅" },
    ],
    thought: "Aidatı detaylandırmayınca ne anlatacağım ki zaten.",
  },
  "eski-firin": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah aslanım bugün Balat'taki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Bir şef geliyor, mutfağı çok merak edecek" },
      { from: "Muzaffer Bey", text: "Alt kat eskiden fırınmış, güzel bir hikaye 🍞" },
    ],
    thought: "Güzel hikaye derken un kokusunu mu kastediyor.",
  },
  "manzara-omurluk": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah'ım bugün Ataşehir'deki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "İş insanı bir müşteri, manzaraya bayılacak" },
      { from: "Muzaffer Bey", text: "Uzaktaki inşaatı hiç gündeme getirme 🙊" },
    ],
    thought: "Gündeme getirmeyince manzara sonsuza dek kalıcı mı oluyor.",
  },
  "gece-klubu": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah aslanım bugün Taksim'deki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Enerjik genç bir müşteri geliyor, tam yerine göre" },
      { from: "Muzaffer Bey", text: "Gece hayatı derken kastı büyük galiba 🎶" },
    ],
    thought: "Kastı büyükse ben kulaklık tavsiye ederim.",
  },
  guvercin: {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah'ım bugün Cihangir'deki çatı katını göstereceksin" },
      { from: "Muzaffer Bey", text: "Emekli bir öğretmen geliyor, doğaya düşkün" },
      { from: "Muzaffer Bey", text: "Terasta biraz kalabalık olabilir, önemli değil 🕊️" },
    ],
    thought: "Kalabalık derken kaç güvercinden bahsediyor acaba.",
  },
  "kaptan-rutubet": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah aslanım bugün Moda sahilindeki daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Emekli bir kaptan geliyor, denizi çok seviyor" },
      { from: "Muzaffer Bey", text: "Duvarlardaki iz de denizin bir hediyesi say 🌊" },
    ],
    thought: "Hediye derken rutubeti mi kastediyor yoksa.",
  },
  "miras-kavgasi": {
    messages: [
      { from: "Muzaffer Bey", text: "Emlah'ım bugün Fatih'teki tarihi daireyi göstereceksin" },
      { from: "Muzaffer Bey", text: "Müşteri avukat, çok detaycı olacaktır" },
      { from: "Muzaffer Bey", text: "Miras konusunu sen bilirsin, ben bir şey demedim 📜" },
    ],
    thought: "Miras konusunu bilmemi istiyorsa keşke biraz bilgi verseydi.",
  },
};

export function defaultIntro(house: HouseScene): HouseIntro {
  return {
    messages: [
      { from: "Muzaffer Bey", text: `Emlah'ım bugün ${house.title} gösteriyorsun` },
      { from: "Muzaffer Bey", text: `${house.location}, adres SMS'te` },
      { from: "Muzaffer Bey", text: "Sen hallet, ben sana güveniyorum 💪" },
    ],
    thought: "Bakalım bugün nasıl geçecek.",
  };
}
