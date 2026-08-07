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
