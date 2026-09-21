import type { HouseScene } from "../types";

/**
 * "Özel Davetler" — bonus houses outside the main houseOrder sequence.
 * Unlocked as Emlah's career rank climbs (see unlockedPremiumHouseIds),
 * played one-off from the Emlah menu's "Özel Davetler" tab instead of the
 * normal house-to-house flow. Selling one still adds its commission to
 * lifetime earnings (and therefore rank), but never touches `results`/
 * `houseOrder` indices, so it can't shift week groupings or the Portföy tab.
 */
export const premiumHouses: HouseScene[] = [
  {
    id: "kripto-madencisi-komsu",
    title: "Kripto Madencisi Komşu Isısı", titleEn: "Crypto Miner Neighbor Heat",
    location: "Ümraniye, sanayi sitesine yakın", locationEn: "Ümraniye, close to the industrial site",
    customerNames: [],
    dynamicCast: [{}],
    background: "theme-metro",
    askingPrice: 29250000,
    tier: 2,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.3, funWeight: 1.1, interestWeight: 1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Sizi tanıdıklar önerdi, elinizde özel bir şey varmış diye duydum.", en: "Hello, I'm {isim}. Acquaintances recommended you, I heard you have something special." } },
          { speaker: "customer1", text: { tr: "Duvar biraz ılık geldi elime, kalorifer mi yanıyor bu saatte?", en: "The wall felt a bit warm to my hand, is the heater on at this hour?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Öneri için teşekkürler. Isı yalıtımdan, gayet normal.\"", en: "\"Thanks for the recommendation. The heat is from the insulation, it's quite normal.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Aslında komşudan geliyor o ısı, açıklayayım.\"", en: "\"Actually, that heat is coming from the neighbor, let me explain.\"" }, next: "enter", effects: { suspicion: 5 } },
          { id: "c", text: { tr: "\"Önce içeri geçelim, detayları sonra konuşuruz.\"", en: "\"Let's go inside first, we can talk about the details later.\"" }, next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "İşte salon, komşu duvarı biraz ılık olabiliyor bazen.", en: "Here is the living room, the neighbor's wall can sometimes be a bit warm." } },
          { speaker: "customer1", text: { tr: "(elini duvara koyar) Bazen mi, yoksa sürekli mi ılık bu?", en: "(placing his hand on the wall) Sometimes, or is it warm all the time?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Komşu bilgisayar işleriyle uğraşıyor, cihazları ısınıyor sanırım.\"", en: "\"The neighbor deals with computer stuff, I guess their devices are heating up.\"" }, next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: { tr: "\"Açıkçası komşu kripto madenciliği yapıyor, cihazlar hep açık.\"", en: "\"Frankly, the neighbor does crypto mining, the devices are always on.\"" }, next: "q1_b", effects: { suspicion: 5, interest: 5 } },
          { id: "c", text: { tr: "\"Kışın bedava kalorifer gibi düşünün, bir avantaj sayılır.\"", en: "\"Think of it like free heating in the winter, consider it an advantage.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Bilgisayar işleri\" biraz muallak kaçtı ama devam edelim.", en: "\"Computer stuff\" sounded a bit vague, but let's continue." } }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Açık konuştuğunuz için teşekkür ederim, en azından biliyorum.", en: "Thank you for speaking openly, at least I know." } }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bedava kalorifer... bu bakış açısını sevdim.", en: "(laughs) Free heater... I liked this perspective." } }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: { tr: "(tam o sırada duvardan hafif bir fan uğultusu duyulur, sonra kesilir)", en: "(right at that moment, a faint fan hum is heard from the wall, then stops)" } },
          { speaker: "emlah", text: { tr: "Görüyorsunuz, aralıklı çalışıyor, sürekli değil.", en: "You see, it runs intermittently, not continuously." } },
          { speaker: "customer1", text: { tr: "Aralıklı olması biraz rahatlattı açıkçası.", en: "Being intermittent relieved me a bit, frankly." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: { tr: "Sizi önerdiler bana, o yüzden fiyatta da makul bir esneklik bekliyorum.", en: "You were recommended to me, so I expect a reasonable flexibility in price as well." } }],
        choices: [
          { id: "a", text: { tr: "\"Sizin için sahibiyle konuşup %9 indirim sağlarım.\"", en: "\"I'll speak with the owner for you and provide a 9% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
          { id: "b", text: { tr: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This apartment won't come up at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, komşuyla tanışırım artık.", en: "I decided along with the discount, I'll meet the neighbor now." } },
          { speaker: "emlah", text: { tr: "Hayırlı olsun, öneriniz için de teşekkürler.", en: "Good luck with it, and thanks for your recommendation." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", text: { tr: "Bir de akşam gelip duvarı tekrar kontrol edeyim, sonra karar veririm.", en: "Let me come back in the evening and check the wall again, then I'll decide." } },
          { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call back whenever you want." } },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
          { speaker: "customer1", text: { tr: "Sanırım bu daire bana göre değil, vaktinizi aldım.", en: "I guess this apartment is not for me, I took up your time." } },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "sahibi-gorunmeyen-kat",
    title: "Sahibi Hiç Görünmeyen Kat", titleEn: "The Floor Whose Owner Is Never Seen",
    location: "Şişli, eski apartman", locationEn: "Şişli, old apartment building",
    customerNames: [],
    dynamicCast: [{}],
    background: "theme-echo",
    askingPrice: 41250000,
    tier: 3,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.4, funWeight: 1, interestWeight: 1.1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Sizi tavsiye ettiler, güvenilir biri olduğunuzu söylediler.", en: "Hello, I'm {isim}. They recommended you, said you are a trustworthy person." } },
          { speaker: "customer1", text: { tr: "Merdivende bir kapı fark ettim, üstünde toz birikmiş, orası da mı satılık?", en: "I noticed a door on the stairs with dust piled on it, is that for sale too?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hayır, o daire yıllardır kapalı, sahibi hiç görünmüyor.\"", en: "\"No, that apartment has been closed for years, the owner is never seen.\"" }, next: "enter", effects: { suspicion: 10 } },
          { id: "b", text: { tr: "\"O konuyu pek bilmiyorum açıkçası, bize ait değil.\"", en: "\"I don't know much about that subject frankly, it doesn't belong to us.\"" }, next: "enter" },
          { id: "c", text: { tr: "\"Binanın gizemli bir tarafı var diyelim, hoşunuza gidecek.\"", en: "\"Let's just say the building has a mysterious side, you're going to like it.\"" }, next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "İşte daire, geniş ve ferah, tam istediğiniz gibi.", en: "Here is the apartment, wide and spacious, just as you wanted." } },
          { speaker: "customer1", text: { tr: "(pencereden dışarı bakar) O kapalı kapının sahibinden hiç haber alan oldu mu?", en: "(looking out the window) Has anyone ever heard from the owner of that closed door?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Yönetici birkaç yılda bir aidatı postayla alıyor, o kadar.\"", en: "\"The building manager collects the dues by mail every few years, that's all.\"" }, next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: { tr: "\"Duyduğuma göre yurt dışına yerleşmiş, dönmeyi düşünmüyor.\"", en: "\"From what I heard, they settled abroad, don't plan on returning.\"" }, next: "q1_b", effects: { interest: 10 } },
          { id: "c", text: { tr: "\"Belki de dairesini çok sevmiş, hiç ayrılamıyor.\"", en: "\"Maybe they just loved their apartment so much, they can never leave.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Sadece postayla mı... biraz esrarengiz oldu bu iş.", en: "Just by mail... this got a bit mysterious." } }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Yurt dışı mantıklı bir açıklama, rahatladım.", en: "Abroad is a logical explanation, I'm relieved." } }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Romantik bir teori, ama inandırıcı değil.", en: "(smiles) A romantic theory, but not convincing." } }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: { tr: "(merdivenden hafif bir ayak sesi duyulur, sonra sessizlik) O da neydi?", en: "(a faint footstep is heard from the stairs, then silence) What was that?" } },
          { speaker: "emlah", text: { tr: "(gülümser) Eski binalarda sesler yankılanır, merak etmeyin.", en: "(smiles) Sounds echo in old buildings, don't worry." } },
          { speaker: "customer1", text: { tr: "Yankı olsun bari, başka bir şey olmasın.", en: "Let it be just an echo, nothing else." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: { tr: "Sizi güvendiğim biri önerdi, o yüzden fiyatta da dürüst bir teklif bekliyorum.", en: "Someone I trust recommended you, so I expect an honest offer on the price too." } }],
        choices: [
          { id: "a", text: { tr: "\"Sizin için sahibiyle konuşup %7 indirim sağlarım.\"", en: "\"I'll speak with the owner for you and provide a 7% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 7 } },
          { id: "b", text: { tr: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This apartment won't come up at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
          { id: "c", text: { tr: "\"Fiyat zaten bu binaya göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this building, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, o kapalı kapıyı da merak etmeye devam edeceğim.", en: "I decided along with the discount, I'll keep wondering about that closed door too." } },
          { speaker: "emlah", text: { tr: "Hayırlı olsun, gizemi çözerseniz bana da haber verin.", en: "Good luck with it, let me know if you solve the mystery." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", text: { tr: "Bir de yönetimden o daire hakkında bilgi alayım, sonra karar veririm.", en: "Let me get information from management about that apartment first, then I'll decide." } },
          { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call back whenever you want." } },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
          { speaker: "customer1", text: { tr: "Sanırım bu daire bana göre değil, vaktinizi aldım.", en: "I guess this apartment is not for me, I took up your time." } },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "unlu-oyuncunun-evi",
    title: "Ünlü Oyuncunun Eski Evi", titleEn: "The Famous Actor's Former House",
    location: "Etiler, site içi villa", locationEn: "Etiler, villa inside a gated community",
    customerNames: [],
    dynamicCast: [{ gender: "k" }, { gender: "e" }],
    background: "theme-sky",
    askingPrice: 51000000,
    tier: 3,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.2, funWeight: 1.2, interestWeight: 1.1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da eşim {isim2}. Sizi tavsiye ettiler, elinizde özel bir portföy varmış.", en: "Hello, I'm {isim}, and this is my spouse {isim2}. They recommended you, you have a special portfolio." } },
          { speaker: "customer2", text: { tr: "Burada eskiden ünlü bir oyuncu oturuyormuş, doğru mu?", en: "A famous actor used to live here, is that true?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Doğru, birkaç yıl önce burada otururdu, sonra taşındı.\"", en: "\"True, they lived here a few years ago, then moved out.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Doğru, ama bunun küçük bir sonucu da var, göstereyim.\"", en: "\"True, but there is also a small consequence of this, let me show you.\"" }, next: "enter", effects: { suspicion: 5 } },
          { id: "c", text: { tr: "\"Önce içeri geçelim, tarihi kendiniz hissedin.\"", en: "\"Let's go inside first, feel the history yourself.\"" }, next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "İşte salon, geniş pencereler ve özel bir tasarım.", en: "Here is the living room, wide windows and a special design." } },
          { speaker: "customer1", text: { tr: "(kapı zili çalar, dışarıda birkaç genç heyecanla bekliyor) O da ne şimdi?", en: "(doorbell rings, a few young people are waiting outside excitedly) What is that now?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bazen hâlâ hayranlar geliyor, yanlışlıkla eski adresi biliyorlar.\"", en: "\"Fans still come sometimes, they accidentally know the old address.\"" }, next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: { tr: "\"Sosyal medyada hâlâ paylaşılıyor bu adres, o yüzden oluyor.\"", en: "\"This address is still shared on social media, that's why it happens.\"" }, next: "q1_b", effects: { interest: 5 } },
          { id: "c", text: { tr: "\"Ünlü komşuluğun bedava reklamı sayılır bu da.\"", en: "\"Consider this free advertising of having a famous neighbor.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: { tr: "\"Bazen\" ne sıklıkla oluyor peki, her gün mü?", en: "How often does \"sometimes\" happen anyway, everyday?" } }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Sosyal medya meselesi zamanla azalır herhalde.", en: "The social media issue will probably decrease over time." } }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(güler) Bedava reklam derken haklısınız aslında.", en: "(laughs) You're actually right about free advertising." } }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: { tr: "(pencereden bakar, biri telefonla fotoğraf çekmeye çalışıyordur) İşte yine biri.", en: "(looking out the window, someone is trying to take a picture with a phone) There's one again." } },
          { speaker: "emlah", text: { tr: "(gülümser) Perde kalın olursa bu konu tamamen çözülür.", en: "(smiles) If the curtain is thick, this issue is completely solved." } },
          { speaker: "customer2", text: { tr: "Perde konusu makul bir çözüm gibi duruyor.", en: "The curtain issue seems like a reasonable solution." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: { tr: "Sizi önerdiler bize, fiyatta da o güveni hak eden bir teklif bekliyoruz.", en: "You were recommended to us, we expect an offer that deserves that trust in price too." } }],
        choices: [
          { id: "a", text: { tr: "\"Sizin için sahibiyle konuşup %6 indirim sağlarım.\"", en: "\"I'll speak with the owner for you and provide a 6% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 6 } },
          { id: "b", text: { tr: "\"Fiyat zaten bu tarihi dokuya göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this historical texture, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Bu ev bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This house won't come up at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdik, perdeleri de hemen aldırırız.", en: "We decided along with the discount, and we'll get the curtains right away." } },
          { speaker: "emlah", text: { tr: "Hayırlı olsun, hayranlara nazik davranmanızı öneririm.", en: "Good luck, I suggest you be polite to the fans." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer2", text: { tr: "Bir hafta sonu daha gelip hayran yoğunluğunu görelim, sonra karar veririz.", en: "Let's come another weekend to see the fan density, then we'll decide." } },
          { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call back whenever you want." } },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
          { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house is not for us, we took up your time." } },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "manastir-bahcesi-komsulugu",
    title: "Manastır Bahçesi Komşuluğu", titleEn: "Monastery Garden Neighborhood",
    location: "Balat, tarihi sokak", locationEn: "Balat, historical street",
    customerNames: [],
    dynamicCast: [{}],
    background: "theme-island",
    askingPrice: 46500000,
    tier: 3,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.1, funWeight: 1.3, interestWeight: 1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Sizi tavsiye ettiler, huzurlu bir yer arıyorum tam olarak.", en: "Hello, I'm {isim}. They recommended you, I am looking for a peaceful place precisely." } },
          { speaker: "customer1", text: { tr: "Bahçe duvarının arkasında küçük bir manastır var galiba, doğru mu?", en: "There is a small monastery behind the garden wall I think, is that true?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Doğru, çok eski ve sakin bir yer, size uyar.\"", en: "\"True, a very old and quiet place, it will suit you.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Doğru, ama bir de sesli tarafı var, göstereyim.\"", en: "\"True, but it also has a noisy side, let me show you.\"" }, next: "enter", effects: { suspicion: 5 } },
          { id: "c", text: { tr: "\"Önce bahçeye çıkalım, atmosferi hissedin.\"", en: "\"Let's go out to the garden first, feel the atmosphere.\"" }, next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "İşte bahçe, duvarın arkasından manastırın çatısı görünüyor.", en: "Here is the garden, the roof of the monastery is visible from behind the wall." } },
          { speaker: "customer1", text: { tr: "(uzaktan hafif bir çan sesi gelir) Bu çanlar ne sıklıkla çalıyor?", en: "(a faint bell sound comes from afar) How often do these bells ring?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Sadece belirli saatlerde, günde birkaç kez.\"", en: "\"Only at certain hours, a few times a day.\"" }, next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: { tr: "\"Bazen sabah erken de çalabiliyor açıkçası.\"", en: "\"Sometimes it can ring early in the morning frankly.\"" }, next: "q1_b" },
          { id: "c", text: { tr: "\"Çan sesiyle uyanmak bir lüks sayılır artık şehirde.\"", en: "\"Waking up to church bells is considered a luxury in the city now.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Birkaç kez idare eder, huzur bozmaz sanırım.", en: "A few times is manageable, I suppose it won't disturb peace." } }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Sabah erken biraz zorlayıcı olabilir ama düşünürüm.", en: "Early in the morning might be a bit challenging, but I'll think about it." } }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Lüks tanımı hoşuma gitti doğrusu.", en: "(smiles) I actually liked the definition of luxury." } }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: { tr: "(uzaktan hafif bir koro sesi duyulur) O da ne, şarkı mı söylüyorlar?", en: "(a faint choir sound is heard from afar) What's that, are they singing?" } },
          { speaker: "emlah", text: { tr: "Ayin provası olabilir, bazen akşamüstü yapıyorlar.", en: "It might be a chant rehearsal, they sometimes do it in the late afternoon." } },
          { speaker: "customer1", text: { tr: "Açıkçası hiç fena bir ses değil, huzur verici.", en: "Frankly, it's not a bad sound at all, soothing." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: { tr: "Sizi önerdiler bana, fiyatta da makul bir esneklik umuyorum.", en: "You were recommended to me, I hope for a reasonable flexibility in price too." } }],
        choices: [
          { id: "a", text: { tr: "\"Sizin için sahibiyle konuşup %8 indirim sağlarım.\"", en: "\"I'll speak with the owner for you and provide an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
          { id: "b", text: { tr: "\"Fiyat zaten bu huzura göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this peace, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Bu bahçe bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This garden won't come up at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, çan sesine de alışırım zamanla.", en: "I decided along with the discount, I'll get used to the bell sound over time." } },
          { speaker: "emlah", text: { tr: "Hayırlı olsun, huzurlu günler dilerim.", en: "Good luck, I wish you peaceful days." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", text: { tr: "Bir sabah erken gelip çanları duyayım, sonra karar veririm.", en: "Let me come early one morning to hear the bells, then I'll decide." } },
          { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call back whenever you want." } },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
          { speaker: "customer1", text: { tr: "Sanırım bu bahçe bana göre değil, vaktinizi aldım.", en: "I guess this garden is not for me, I took up your time." } },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "restorasyon-bitmemis-konak",
    title: "Restorasyon Bitmemiş Konak", titleEn: "Unfinished Restoration Mansion",
    location: "Kuzguncuk, tarihi yokuş", locationEn: "Kuzguncuk, historical slope",
    customerNames: [],
    dynamicCast: [{}, {}],
    background: "theme-sea",
    askingPrice: 71250000,
    tier: 4,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.3, funWeight: 1, interestWeight: 1.2 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da ortağım {isim2}. Sizi güvenilir biri olarak tanıttılar.", en: "Hello, I'm {isim}, and this is my partner {isim2}. They introduced you as a trustworthy person." } },
          { speaker: "customer2", text: { tr: "Konağın restorasyonu bitmiş mi tam olarak, yoksa devam mı ediyor?", en: "Is the mansion's restoration completely finished, or is it still ongoing?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Neredeyse bitti, birkaç oda kaldı sadece.\"", en: "\"Almost finished, only a few rooms left.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Açıkçası biraz yarım kaldı, göstereyim size.\"", en: "\"Frankly, it's a bit half-done, let me show you.\"" }, next: "enter", effects: { suspicion: 5 } },
          { id: "c", text: { tr: "\"Önce içeri geçelim, potansiyeli kendiniz görün.\"", en: "\"Let's go inside first, see the potential yourself.\"" }, next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "İşte salon, orijinal tavan süslemeleri restore edilmiş.", en: "Here is the living room, original ceiling ornaments have been restored." } },
          { speaker: "customer1", text: { tr: "(yan odaya bakar, hâlâ iskele duruyordur) Bu oda hiç dokunulmamış gibi.", en: "(looking into the next room, the scaffolding is still there) This room looks completely untouched." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"O oda son aşamada, müteahhit birkaç haftaya bitirecek.\"", en: "\"That room is in the final stage, the contractor will finish it in a couple of weeks.\"" }, next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: { tr: "\"Açıkçası müteahhit bir süredir ortalıkta yok, ondan kaldı öyle.\"", en: "\"Frankly, the contractor hasn't been around for a while, that's why it's like that.\"" }, next: "q1_b", effects: { suspicion: 5, interest: 5 } },
          { id: "c", text: { tr: "\"O oda kendi zevkinize göre bitirmeniz için bir fırsat sayılır.\"", en: "\"Consider that room an opportunity to finish it to your own taste.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: { tr: "\"Birkaç hafta\" cümlesine daha önce de inanmıştık galiba.", en: "We probably believed the sentence \"a couple of weeks\" before too." } }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olduğunuz için teşekkür ederim, en azından net.", en: "Thank you for being honest, at least it's clear." } }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(gülümser) Fırsat demek hoşumuza gitti doğrusu.", en: "(smiles) We actually liked calling it an opportunity." } }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: { tr: "(iskelenin üzerinde unutulmuş bir boya kovası fark eder) Bu daha dün kullanılmış gibi duruyor.", en: "(notices a paint bucket left forgotten on the scaffolding) This looks like it was used just yesterday." } },
          { speaker: "emlah", text: { tr: "(gülümser) Restorasyon ekibi her an geri dönebilir, malzemeler hazır bekliyor.", en: "(smiles) The restoration team can return at any moment, materials are waiting ready." } },
          { speaker: "customer2", text: { tr: "Her an dönebilir derken, ne zamandır bekliyor bu malzemeler acaba?", en: "When you say they can return at any moment, I wonder how long these materials have been waiting?" } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: { tr: "Sizi güvenilir biri olarak tanıttılar, fiyatta da o güveni gösterin lütfen.", en: "They introduced you as a trustworthy person, please show that trust in price too." } }],
        choices: [
          { id: "a", text: { tr: "\"Sizin için sahibiyle konuşup %5 indirim ve kalan restorasyonu tamamlatmayı öneririm.\"", en: "\"I'll speak with the owner for you, offer a 5% discount and have the remaining restoration completed.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 5 } },
          { id: "b", text: { tr: "\"Fiyat zaten bu tarihi dokuya göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this historical texture, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Bu konak bu fiyata bir daha çıkmaz, bugün karar vermelisiniz.\"", en: "\"This mansion won't come up at this price again, you must decide today.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: { tr: "Restorasyonun tamamlanması şartıyla anlaştık.", en: "We agreed on the condition that the restoration is completed." } },
          { speaker: "emlah", text: { tr: "Hayırlı olsun, müteahhidi bulmak benim işim artık.", en: "Good luck, finding the contractor is my job now." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer2", text: { tr: "Restorasyonun ne zaman biteceğini netleştirin, sonra konuşuruz.", en: "Clarify when the restoration will end, then we'll talk." } },
          { speaker: "emlah", text: { tr: "Anlıyorum, müteahhitle konuşup size dönerim.", en: "I understand, I'll speak with the contractor and get back to you." } },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: { tr: "Bir tarafı diğerine karşı aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush one side against the other." } },
          { speaker: "customer2", text: { tr: "Bu belirsizlikle bu ölçekte bir karar veremeyiz, vaktinizi aldık.", en: "We cannot make a decision on this scale with this uncertainty, we took up your time." } },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "set-evi",
    title: "Set Evi", titleEn: "Set House",
    location: "Beykoz, korulu villa", locationEn: "Beykoz, wooded villa",
    customerNames: [],
    dynamicCast: [{}],
    background: "theme-houseboat",
    askingPrice: 78750000,
    tier: 4,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.2, funWeight: 1.1, interestWeight: 1.2 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Sizi özellikle tavsiye ettiler, elinizde nadir bulunan bir şey varmış.", en: "Hello, I'm {isim}. They recommended you specifically, you have something rare in your hands." } },
          { speaker: "customer1", text: { tr: "Bahçedeki o büyük reflektörler ve kablolar da ne, dekor mu bunlar?", en: "What are those big reflectors and cables in the garden, are these decorations?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Evet, eski sahibinden kalma dekoratif parçalar.\"", en: "\"Yes, decorative pieces left from the former owner.\"" }, next: "enter", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Açıkçası bu ev ara sıra çekim için kiralanıyor, göstereyim.\"", en: "\"Frankly, this house is occasionally rented for filming, let me show you.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "c", text: { tr: "\"Önce içeri geçelim, hikayesini içeride anlatayım.\"", en: "\"Let's go inside first, I'll tell you its story inside.\"" }, next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "İşte salon, birçok dizi ve reklamda kullanıldı burası.", en: "Here is the living room, this place was used in many TV series and commercials." } },
          { speaker: "customer1", text: { tr: "(duvardaki vida izlerine bakar) Bu izler dekor sabitlemekten mi kalmış?", en: "(looking at screw marks on the wall) Are these marks left from securing decor?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Evet, çekim ekibi bazen mobilyaları değiştiriyor.\"", en: "\"Yes, the film crew sometimes changes the furniture.\"" }, next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: { tr: "\"Doğru, ama siz sahibi olunca bu kararı siz verirsiniz artık.\"", en: "\"True, but once you become the owner, you make that decision now.\"" }, next: "q1_b", effects: { interest: 10 } },
          { id: "c", text: { tr: "\"Bir nevi ünlü bir setin sahibi olacaksınız, hoş bir ayrıcalık.\"", en: "\"You will become the owner of a famously famous set in a way, a nice privilege.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Bazen\" derken ne sıklıkla oluyor bu değişim?", en: "When you say \"sometimes\", how often does this change happen?" } }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Kararı ben vereceksem sorun yok o zaman.", en: "If I'm going to make the decision, then no problem." } }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Ayrıcalık kelimesini duymak hoşuma gitti.", en: "(smiles) I liked hearing the word privilege." } }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: { tr: "(tam o sırada kapı çalar, dışarıda bir ekip \"yarınki çekim için mekan onayı\" diye soruyordur)", en: "(right at that moment the doorbell rings, outside a crew member asks \"location approval for tomorrow's shoot\")" } },
          { speaker: "emlah", text: { tr: "(hızla) Ah, eski bir randevu kalmış olmalı, hemen hallederim.", en: "(quickly) Ah, an old appointment must have remained, I'll handle it immediately." } },
          { speaker: "customer1", text: { tr: "Vay canına, gerçekten popülermiş burası.", en: "Wow, this place is really popular." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: { tr: "Sizi özellikle önerdiler, fiyatta da o güveni hak eden bir teklif istiyorum.", en: "You were recommended specifically, I want an offer that deserves that trust in price too." } }],
        choices: [
          { id: "a", text: { tr: "\"Sizin için sahibiyle konuşup %6 indirim sağlarım, çekim sözleşmelerini de iptal ettiririm.\"", en: "\"I'll speak with the owner for you and provide a 6% discount, and cancel the filming contracts as well.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 6 } },
          { id: "b", text: { tr: "\"Bu ev bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This house won't come up at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
          { id: "c", text: { tr: "\"Fiyat zaten bu üne göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this fame, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: { tr: "Çekim sözleşmeleri iptal edilirse anlaştık.", en: "We agreed on the condition that the filming contracts are canceled." } },
          { speaker: "emlah", text: { tr: "Hayırlı olsun, artık senaryoyu siz yazıyorsunuz.", en: "Good luck, you are writing the script now." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", text: { tr: "Çekim takvimini bir görmek isterim, sonra karar veririm.", en: "I'd like to see the filming schedule, then I'll decide." } },
          { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call back whenever you want." } },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
          { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house is not for me, I took up your time." } },
        ],
        end: "lost",
      },
    },
  },
];

/** Career rank (see rankTitle in scoring.ts) each premium house unlocks at. */
const PREMIUM_UNLOCK_MAP: Record<string, string[]> = {
  "Emlakçı": ["kripto-madencisi-komsu", "sahibi-gorunmeyen-kat"],
  "Kıdemli Emlakçı": ["unlu-oyuncunun-evi", "manastir-bahcesi-komsulugu"],
  "Ofis Ortağı": ["restorasyon-bitmemis-konak", "set-evi"],
};

const RANK_ORDER = ["Stajyer", "Emlakçı", "Kıdemli Emlakçı", "Ofis Ortağı"];

/** All premium house ids unlocked at or below the given career rank. */
export function unlockedPremiumHouseIds(rank: string): string[] {
  const rankIndex = RANK_ORDER.indexOf(rank);
  let ids: string[] = [];
  for (let i = 1; i <= rankIndex; i++) {
    ids = ids.concat(PREMIUM_UNLOCK_MAP[RANK_ORDER[i]] ?? []);
  }
  return ids;
}

/** True if this rank change just unlocked at least one new premium house. */
export function ranksUnlockNewPremium(previousRank: string, currentRank: string): boolean {
  const before = new Set(unlockedPremiumHouseIds(previousRank));
  return unlockedPremiumHouseIds(currentRank).some((id) => !before.has(id));
}
