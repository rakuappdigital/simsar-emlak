import type { HouseScene } from "../types";

/**
 * Gizli evler — ana portföyün (houseOrder) dışında, yalnızca bir yan görevin
 * sonunda açılan tek seferlik sahneler. Özel Davetler gibi PremiumHouseScene
 * ile oynanır; sonuçları sideQuests durumunda tutulur, results/hafta
 * hesaplarına girmez.
 *  - yesil-kapili-yali: A1 "Nadide Hanım'ın Anahtarı"nın sonu.
 *  - emlahin-evi:       B7 "55. Ev" — şartları sağlayan oyuncunun final sırrı.
 */
export const secretHouses: HouseScene[] = [
  {
    id: "yesil-kapili-yali",
    title: "Yeşil Kapılı Yalı",
    titleEn: "The Green-Doored Mansion",
    location: "Kuzguncuk, sahil yolu",
    locationEn: "Kuzguncuk, the shore road",
    customerNames: ["Leyla"],
    background: "theme-sea",
    askingPrice: 64000000,
    tier: 1,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.2, funWeight: 1, interestWeight: 1.2 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "thought", text: { tr: "(içinden) Anahtar kilide ilk denemede oturdu. Kapı, yıllardır açılmamış gibi inledi.", en: "(to himself) The key fit the lock on the first try. The door groaned like it hadn't opened in years." } },
          { speaker: "customer1", text: { tr: "Siz Emlah Bey olmalısınız. Ben Leyla, Nadide Hanım'ın torunuyum. Babaannem anahtarı size verdiğini yazmıştı.", en: "You must be Estetan. I'm Leyla, Nadide Hanım's granddaughter. My grandmother wrote that she gave you the key." } },
          { speaker: "customer1", text: { tr: "Yurt dışında büyüdüm. Bu evi hiç görmedim, sadece fotoğraflardan biliyorum.", en: "I grew up abroad. I've never seen this house, I only know it from photographs." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hoş geldiniz. Önce içeriyi sessizce bir gezelim, ev kendini anlatsın.\"", en: "\"Welcome. Let's walk through quietly first, let the house speak for itself.\"" }, next: "hall", effects: { interest: 12 } },
          { id: "b", text: { tr: "\"Babaanneniz bu yalıyı çok iyi bir fiyata satmamı istedi.\"", en: "\"Your grandmother asked me to sell this mansion at a very good price.\"" }, next: "hall", effects: { suspicion: 8 } },
          { id: "c", text: { tr: "\"Anahtarı bulmak için yarım İstanbul'u dolaştım, haberiniz olsun.\"", en: "\"I crossed half of Istanbul to find where this key belonged, just so you know.\"" }, next: "hall", effects: { fun: 12 } },
        ],
      },
      hall: {
        id: "hall",
        lines: [
          { speaker: "emlah", text: { tr: "Taş merdiven, ahşap tavanlar... Boğaz'a bakan cumba hâlâ yerinde.", en: "Stone stairs, wooden ceilings... the bay window over the Bosphorus is still there." } },
          { speaker: "customer1", text: { tr: "(duvardaki eski bir fotoğrafa bakar) Bu kız babaannem. Burada, bu cumbada oturuyor.", en: "(looking at an old photograph on the wall) That girl is my grandmother. Sitting right here, in this window." } },
          { speaker: "customer1", text: { tr: "Açık konuşayım, ben bu evi satmak için mi geldim, yoksa kalmak için mi, emin değilim.", en: "To be honest, I'm not sure whether I came to sell this house or to stay." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bu evi satmak benim işim, ama karar sizin. Kalmak isterseniz size yardım ederim.\"", en: "\"Selling this house is my job, but the choice is yours. If you want to stay, I'll help you.\"" }, next: "q_honest", effects: { suspicion: -12, interest: 10 } },
          { id: "b", text: { tr: "\"Bu fiyata bir alıcı bulmak kolay değil, fırsatı kaçırmayın derim.\"", en: "\"Finding a buyer at this price isn't easy, I'd say don't miss the chance.\"" }, next: "q_push", effects: { suspicion: 12 } },
          { id: "c", text: { tr: "\"Cumbada bir çay içelim mi? Kararlar burada daha kolay verilir gibi.\"", en: "\"Shall we have tea in the bay window? Decisions seem easier here.\"" }, next: "q_tea", effects: { fun: 14, interest: 6 } },
        ],
      },
      q_honest: { id: "q_honest", lines: [{ speaker: "customer1", text: { tr: "Bunu bir emlakçıdan duymayı beklemiyordum. Teşekkür ederim.", en: "I didn't expect to hear that from a realtor. Thank you." } }], next: "garden" },
      q_push: { id: "q_push", lines: [{ speaker: "customer1", text: { tr: "Fırsat... Evet. Herkes bu evi bir fırsat olarak görüyor.", en: "A chance... Yes. Everyone sees this house as a chance." } }], next: "garden" },
      q_tea: { id: "q_tea", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Babaannem de hep böyle derdi.", en: "(smiles) My grandmother always said the same thing." } }], next: "garden" },
      garden: {
        id: "garden",
        lines: [
          { speaker: "thought", text: { tr: "(içinden) Bahçedeki yeşil kapı. Her şey o kapıyla başlamıştı.", en: "(to himself) The green door in the garden. It all started with that door." } },
          { speaker: "customer1", text: { tr: "Bir teklif aldım. Benim gibi bu evi seven, onu otele çevirmeyecek biri. Ama fiyatı biraz düşük.", en: "I got an offer. From someone who loves this house like I do and won't turn it into a hotel. But the price is a bit low." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Doğru alıcı, doğru fiyattan daha önemli. Fiyatı ben savunurum, siz evi koruyun.\"", en: "\"The right buyer matters more than the right price. I'll defend the price, you protect the house.\"" }, next: "closing_sold", effects: { closingBias: 30, suspicion: -8 } },
          { id: "b", text: { tr: "\"Biraz bekleyelim. Bu yalı acele satılacak bir ev değil.\"", en: "\"Let's wait a little. This mansion isn't a house to rush.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Otel teklifi daha yüksekti. Duygusallığı bir kenara bırakmalısınız.\"", en: "\"The hotel offer was higher. You should set sentiment aside.\"" }, next: "closing_lost", effects: { closingBias: -30, suspicion: 15 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: { tr: "Tamam. Ev doğru ellere gidecek. Babaanneme anahtarın yerini bulduğunuzu söyleyeceğim.", en: "All right. The house goes to the right hands. I'll tell my grandmother you found where the key belonged." } },
          { speaker: "thought", text: { tr: "(içinden) Bazı satışlar komisyondan büyük.", en: "(to himself) Some sales are bigger than the commission." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", text: { tr: "Biraz burada kalacağım. Sonra size dönerim, söz.", en: "I'll stay here a while. Then I'll get back to you, I promise." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", text: { tr: "Babaannem size güvenmişti. Ben başka bir emlakçıyla devam edeceğim.", en: "My grandmother trusted you. I'll continue with another realtor." } }],
        end: "lost",
      },
    },
  },
  {
    id: "emlahin-evi",
    title: "Emlah'ın Kendi Evi",
    titleEn: "Estetan's Own Home",
    location: "Kadıköy, ara sokak",
    locationEn: "Kadıköy, a side street",
    customerNames: ["Deniz"],
    background: "theme-echo",
    askingPrice: 9800000,
    tier: 1,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1, funWeight: 1.1, interestWeight: 1.1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "thought", text: { tr: "(içinden) 54 ev sattım, gösterdim, kaybettim. 55. ev benimki.", en: "(to himself) I've shown, sold and lost 54 houses. The 55th is mine." } },
          { speaker: "customer1", text: { tr: "Merhaba! Ben Deniz. Daha bu hafta işe başladım, bir emlak ofisinde stajyerim.", en: "Hi! I'm Deniz. I just started work this week, I'm an intern at a real estate office." } },
          { speaker: "customer1", text: { tr: "İlanınızda \"dürüst bir emlakçıdan, dürüst bir eve\" yazıyordu. Merak ettim.", en: "Your listing said \"from an honest realtor, to an honest home\". I got curious." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Gel, içeri gir. Sana bu evi bir emlakçı gibi değil, sahibi gibi göstereceğim.\"", en: "\"Come in. I'll show you this house as its owner, not as a realtor.\"" }, next: "rooms", effects: { interest: 12, suspicion: -6 } },
          { id: "b", text: { tr: "\"Stajyer misin? Ben de buradan başladım, şüphelerini hiç saklama.\"", en: "\"An intern? I started right where you are. Don't hide your doubts.\"" }, next: "rooms", effects: { fun: 10, suspicion: -4 } },
        ],
      },
      rooms: {
        id: "rooms",
        lines: [
          { speaker: "emlah", text: { tr: "Salon küçük ama ışık alıyor. Mutfak dolabının kapağı düşüyor, söyleyeyim.", en: "The living room is small but bright. The kitchen cabinet door falls off, I'll tell you that." } },
          { speaker: "customer1", text: { tr: "(güler) Satarken kusur söyleyen emlakçı mı olur?", en: "(laughs) What kind of realtor points out flaws while selling?" } },
          { speaker: "customer1", text: { tr: "Ofiste bana \"kusuru gösterme, ilgiyi dağıt\" dediler. Siz ne dersiniz?", en: "At the office they told me \"don't show the flaw, distract them\". What do you say?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Kusuru göster. Müşteri bunu hatırlar, bir dahaki evini yine senden alır.\"", en: "\"Show the flaw. The client remembers it and buys their next home from you too.\"" }, next: "q_true", effects: { interest: 14, suspicion: -10 } },
          { id: "b", text: { tr: "\"Bazen ilgiyi dağıtmak gerekir. Ama bunu her gece düşünürsün.\"", en: "\"Sometimes you do have to distract them. But you'll think about it every night.\"" }, next: "q_mixed", effects: { fun: 8 } },
        ],
      },
      q_true: { id: "q_true", lines: [{ speaker: "customer1", text: { tr: "Bunu bir yere yazacağım. İlk günüm için iyi bir not.", en: "I'm writing that down. A good note for my first week." } }], next: "keys" },
      q_mixed: { id: "q_mixed", lines: [{ speaker: "customer1", text: { tr: "Dürüst bir cevap. Sanırım ikisini de öğreneceğim.", en: "An honest answer. I guess I'll learn both." } }], next: "keys" },
      keys: {
        id: "keys",
        lines: [
          { speaker: "thought", text: { tr: "(içinden) Bu çocuk, ilk günkü bana benziyor. Aynı heyecan, aynı korku.", en: "(to himself) This kid looks like me on my first day. Same excitement, same fear." } },
          { speaker: "customer1", text: { tr: "Fiyat biraz yüksek ama... burada yaşamak istiyorum. Sizce pazarlık yapmalı mıyım?", en: "The price is a bit high but... I want to live here. Should I negotiate, do you think?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Yap. Ben de sana karşı dürüst olacağım: makul bir indirim veririm, gerisini sen hak ettin.\"", en: "\"Do it. And I'll be honest with you: I'll give a fair discount, you've earned the rest.\"" }, next: "closing_sold", effects: { closingBias: 35, discountPercent: 5 } },
          { id: "b", text: { tr: "\"Fiyat fiyattır. Ama bu ev seni bekliyor gibi.\"", en: "\"The price is the price. But this house seems to be waiting for you.\"" }, next: "closing_sold", effects: { closingBias: 20 } },
          { id: "c", text: { tr: "\"Biraz düşün. İlk evini acele alma.\"", en: "\"Think about it. Don't rush your first home.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: { tr: "Anlaştık! Anahtarı verirken bir şey söyleyecek misiniz?", en: "Deal! Will you say something when you hand over the key?" } },
          { speaker: "emlah", text: { tr: "Bir gün biri sana kendi evini satarken, kusurunu söylerse ona güven.", en: "One day, when someone selling you their home tells you its flaw, trust them." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", text: { tr: "Yarın tekrar gelebilir miyim? Bu sefer annemle.", en: "Can I come back tomorrow? With my mom this time." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", text: { tr: "Sanırım daha hazır değilim. Ama sizi unutmayacağım.", en: "I don't think I'm ready yet. But I won't forget you." } }],
        end: "lost",
      },
    },
  },
];

export function secretHouseById(id: string): HouseScene | undefined {
  return secretHouses.find((h) => h.id === id);
}
