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
    title: "Kripto Madencisi Komşu Isısı",
    location: "Ümraniye, sanayi sitesine yakın",
    customerNames: [],
    dynamicCast: [{}],
    background: "theme-metro",
    askingPrice: 3900000,
    tier: 2,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.3, funWeight: 1.1, interestWeight: 1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Sizi tanıdıklar önerdi, elinizde özel bir şey varmış diye duydum." },
          { speaker: "customer1", text: "Duvar biraz ılık geldi elime, kalorifer mi yanıyor bu saatte?" },
        ],
        choices: [
          { id: "a", text: "\"Öneri için teşekkürler. Isı yalıtımdan, gayet normal.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Aslında komşudan geliyor o ısı, açıklayayım.\"", next: "enter", effects: { suspicion: 5 } },
          { id: "c", text: "\"Önce içeri geçelim, detayları sonra konuşuruz.\"", next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "İşte salon, komşu duvarı biraz ılık olabiliyor bazen." },
          { speaker: "customer1", text: "(elini duvara koyar) Bazen mi, yoksa sürekli mi ılık bu?" },
        ],
        choices: [
          { id: "a", text: "\"Komşu bilgisayar işleriyle uğraşıyor, cihazları ısınıyor sanırım.\"", next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: "\"Açıkçası komşu kripto madenciliği yapıyor, cihazlar hep açık.\"", next: "q1_b", effects: { suspicion: 5, interest: 5 } },
          { id: "c", text: "\"Kışın bedava kalorifer gibi düşünün, bir avantaj sayılır.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Bilgisayar işleri\" biraz muallak kaçtı ama devam edelim." }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Açık konuştuğunuz için teşekkür ederim, en azından biliyorum." }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Bedava kalorifer... bu bakış açısını sevdim." }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: "(tam o sırada duvardan hafif bir fan uğultusu duyulur, sonra kesilir)" },
          { speaker: "emlah", text: "Görüyorsunuz, aralıklı çalışıyor, sürekli değil." },
          { speaker: "customer1", text: "Aralıklı olması biraz rahatlattı açıkçası." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: "Sizi önerdiler bana, o yüzden fiyatta da makul bir esneklik bekliyorum." }],
        choices: [
          { id: "a", text: "\"Sizin için sahibiyle konuşup %9 indirim sağlarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
          { id: "b", text: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: "İndirimle birlikte karar verdim, komşuyla tanışırım artık." },
          { speaker: "emlah", text: "Hayırlı olsun, öneriniz için de teşekkürler." },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", text: "Bir de akşam gelip duvarı tekrar kontrol edeyim, sonra karar veririm." },
          { speaker: "emlah", text: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz." },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
          { speaker: "customer1", text: "Sanırım bu daire bana göre değil, vaktinizi aldım." },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "sahibi-gorunmeyen-kat",
    title: "Sahibi Hiç Görünmeyen Kat",
    location: "Şişli, eski apartman",
    customerNames: [],
    dynamicCast: [{}],
    background: "theme-echo",
    askingPrice: 5500000,
    tier: 3,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.4, funWeight: 1, interestWeight: 1.1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Sizi tavsiye ettiler, güvenilir biri olduğunuzu söylediler." },
          { speaker: "customer1", text: "Merdivende bir kapı fark ettim, üstünde toz birikmiş, orası da mı satılık?" },
        ],
        choices: [
          { id: "a", text: "\"Hayır, o daire yıllardır kapalı, sahibi hiç görünmüyor.\"", next: "enter", effects: { suspicion: 10 } },
          { id: "b", text: "\"O konuyu pek bilmiyorum açıkçası, bize ait değil.\"", next: "enter" },
          { id: "c", text: "\"Binanın gizemli bir tarafı var diyelim, hoşunuza gidecek.\"", next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "İşte daire, geniş ve ferah, tam istediğiniz gibi." },
          { speaker: "customer1", text: "(pencereden dışarı bakar) O kapalı kapının sahibinden hiç haber alan oldu mu?" },
        ],
        choices: [
          { id: "a", text: "\"Yönetici birkaç yılda bir aidatı postayla alıyor, o kadar.\"", next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: "\"Duyduğuma göre yurt dışına yerleşmiş, dönmeyi düşünmüyor.\"", next: "q1_b", effects: { interest: 10 } },
          { id: "c", text: "\"Belki de dairesini çok sevmiş, hiç ayrılamıyor.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Sadece postayla mı... biraz esrarengiz oldu bu iş." }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Yurt dışı mantıklı bir açıklama, rahatladım." }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) Romantik bir teori, ama inandırıcı değil." }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: "(merdivenden hafif bir ayak sesi duyulur, sonra sessizlik) O da neydi?" },
          { speaker: "emlah", text: "(gülümser) Eski binalarda sesler yankılanır, merak etmeyin." },
          { speaker: "customer1", text: "Yankı olsun bari, başka bir şey olmasın." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: "Sizi güvendiğim biri önerdi, o yüzden fiyatta da dürüst bir teklif bekliyorum." }],
        choices: [
          { id: "a", text: "\"Sizin için sahibiyle konuşup %7 indirim sağlarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 7 } },
          { id: "b", text: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
          { id: "c", text: "\"Fiyat zaten bu binaya göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: "İndirimle birlikte karar verdim, o kapalı kapıyı da merak etmeye devam edeceğim." },
          { speaker: "emlah", text: "Hayırlı olsun, gizemi çözerseniz bana da haber verin." },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", text: "Bir de yönetimden o daire hakkında bilgi alayım, sonra karar veririm." },
          { speaker: "emlah", text: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz." },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
          { speaker: "customer1", text: "Sanırım bu daire bana göre değil, vaktinizi aldım." },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "unlu-oyuncunun-evi",
    title: "Ünlü Oyuncunun Eski Evi",
    location: "Etiler, site içi villa",
    customerNames: [],
    dynamicCast: [{ gender: "k" }, { gender: "e" }],
    background: "theme-sky",
    askingPrice: 6800000,
    tier: 3,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.2, funWeight: 1.2, interestWeight: 1.1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}, bu da eşim {isim2}. Sizi tavsiye ettiler, elinizde özel bir portföy varmış." },
          { speaker: "customer2", text: "Burada eskiden ünlü bir oyuncu oturuyormuş, doğru mu?" },
        ],
        choices: [
          { id: "a", text: "\"Doğru, birkaç yıl önce burada otururdu, sonra taşındı.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Doğru, ama bunun küçük bir sonucu da var, göstereyim.\"", next: "enter", effects: { suspicion: 5 } },
          { id: "c", text: "\"Önce içeri geçelim, tarihi kendiniz hissedin.\"", next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "İşte salon, geniş pencereler ve özel bir tasarım." },
          { speaker: "customer1", text: "(kapı zili çalar, dışarıda birkaç genç heyecanla bekliyor) O da ne şimdi?" },
        ],
        choices: [
          { id: "a", text: "\"Bazen hâlâ hayranlar geliyor, yanlışlıkla eski adresi biliyorlar.\"", next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: "\"Sosyal medyada hâlâ paylaşılıyor bu adres, o yüzden oluyor.\"", next: "q1_b", effects: { interest: 5 } },
          { id: "c", text: "\"Ünlü komşuluğun bedava reklamı sayılır bu da.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: "\"Bazen\" ne sıklıkla oluyor peki, her gün mü?" }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Sosyal medya meselesi zamanla azalır herhalde." }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(güler) Bedava reklam derken haklısınız aslında." }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: "(pencereden bakar, biri telefonla fotoğraf çekmeye çalışıyordur) İşte yine biri." },
          { speaker: "emlah", text: "(gülümser) Perde kalın olursa bu konu tamamen çözülür." },
          { speaker: "customer2", text: "Perde konusu makul bir çözüm gibi duruyor." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: "Sizi önerdiler bize, fiyatta da o güveni hak eden bir teklif bekliyoruz." }],
        choices: [
          { id: "a", text: "\"Sizin için sahibiyle konuşup %6 indirim sağlarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 6 } },
          { id: "b", text: "\"Fiyat zaten bu tarihi dokuya göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Bu ev bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: "İndirimle birlikte karar verdik, perdeleri de hemen aldırırız." },
          { speaker: "emlah", text: "Hayırlı olsun, hayranlara nazik davranmanızı öneririm." },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer2", text: "Bir hafta sonu daha gelip hayran yoğunluğunu görelim, sonra karar veririz." },
          { speaker: "emlah", text: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz." },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: "Bizi aceleye getirmeye çalıştığınızı fark ettik." },
          { speaker: "customer2", text: "Sanırım bu ev bize göre değil, vaktinizi aldık." },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "manastir-bahcesi-komsulugu",
    title: "Manastır Bahçesi Komşuluğu",
    location: "Balat, tarihi sokak",
    customerNames: [],
    dynamicCast: [{}],
    background: "theme-island",
    askingPrice: 6200000,
    tier: 3,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.1, funWeight: 1.3, interestWeight: 1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Sizi tavsiye ettiler, huzurlu bir yer arıyorum tam olarak." },
          { speaker: "customer1", text: "Bahçe duvarının arkasında küçük bir manastır var galiba, doğru mu?" },
        ],
        choices: [
          { id: "a", text: "\"Doğru, çok eski ve sakin bir yer, size uyar.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Doğru, ama bir de sesli tarafı var, göstereyim.\"", next: "enter", effects: { suspicion: 5 } },
          { id: "c", text: "\"Önce bahçeye çıkalım, atmosferi hissedin.\"", next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "İşte bahçe, duvarın arkasından manastırın çatısı görünüyor." },
          { speaker: "customer1", text: "(uzaktan hafif bir çan sesi gelir) Bu çanlar ne sıklıkla çalıyor?" },
        ],
        choices: [
          { id: "a", text: "\"Sadece belirli saatlerde, günde birkaç kez.\"", next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: "\"Bazen sabah erken de çalabiliyor açıkçası.\"", next: "q1_b" },
          { id: "c", text: "\"Çan sesiyle uyanmak bir lüks sayılır artık şehirde.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Birkaç kez idare eder, huzur bozmaz sanırım." }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Sabah erken biraz zorlayıcı olabilir ama düşünürüm." }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) Lüks tanımı hoşuma gitti doğrusu." }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: "(uzaktan hafif bir koro sesi duyulur) O da ne, şarkı mı söylüyorlar?" },
          { speaker: "emlah", text: "Ayin provası olabilir, bazen akşamüstü yapıyorlar." },
          { speaker: "customer1", text: "Açıkçası hiç fena bir ses değil, huzur verici." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: "Sizi önerdiler bana, fiyatta da makul bir esneklik umuyorum." }],
        choices: [
          { id: "a", text: "\"Sizin için sahibiyle konuşup %8 indirim sağlarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
          { id: "b", text: "\"Fiyat zaten bu huzura göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Bu bahçe bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: "İndirimle birlikte karar verdim, çan sesine de alışırım zamanla." },
          { speaker: "emlah", text: "Hayırlı olsun, huzurlu günler dilerim." },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", text: "Bir sabah erken gelip çanları duyayım, sonra karar veririm." },
          { speaker: "emlah", text: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz." },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
          { speaker: "customer1", text: "Sanırım bu bahçe bana göre değil, vaktinizi aldım." },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "restorasyon-bitmemis-konak",
    title: "Restorasyon Bitmemiş Konak",
    location: "Kuzguncuk, tarihi yokuş",
    customerNames: [],
    dynamicCast: [{}, {}],
    background: "theme-sea",
    askingPrice: 9500000,
    tier: 4,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.3, funWeight: 1, interestWeight: 1.2 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}, bu da ortağım {isim2}. Sizi güvenilir biri olarak tanıttılar." },
          { speaker: "customer2", text: "Konağın restorasyonu bitmiş mi tam olarak, yoksa devam mı ediyor?" },
        ],
        choices: [
          { id: "a", text: "\"Neredeyse bitti, birkaç oda kaldı sadece.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Açıkçası biraz yarım kaldı, göstereyim size.\"", next: "enter", effects: { suspicion: 5 } },
          { id: "c", text: "\"Önce içeri geçelim, potansiyeli kendiniz görün.\"", next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "İşte salon, orijinal tavan süslemeleri restore edilmiş." },
          { speaker: "customer1", text: "(yan odaya bakar, hâlâ iskele duruyordur) Bu oda hiç dokunulmamış gibi." },
        ],
        choices: [
          { id: "a", text: "\"O oda son aşamada, müteahhit birkaç haftaya bitirecek.\"", next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: "\"Açıkçası müteahhit bir süredir ortalıkta yok, ondan kaldı öyle.\"", next: "q1_b", effects: { suspicion: 5, interest: 5 } },
          { id: "c", text: "\"O oda kendi zevkinize göre bitirmeniz için bir fırsat sayılır.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: "\"Birkaç hafta\" cümlesine daha önce de inanmıştık galiba." }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Dürüst olduğunuz için teşekkür ederim, en azından net." }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(gülümser) Fırsat demek hoşumuza gitti doğrusu." }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: "(iskelenin üzerinde unutulmuş bir boya kovası fark eder) Bu daha dün kullanılmış gibi duruyor." },
          { speaker: "emlah", text: "(gülümser) Restorasyon ekibi her an geri dönebilir, malzemeler hazır bekliyor." },
          { speaker: "customer2", text: "Her an dönebilir derken, ne zamandır bekliyor bu malzemeler acaba?" },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: "Sizi güvenilir biri olarak tanıttılar, fiyatta da o güveni gösterin lütfen." }],
        choices: [
          { id: "a", text: "\"Sizin için sahibiyle konuşup %5 indirim ve kalan restorasyonu tamamlatmayı öneririm.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 5 } },
          { id: "b", text: "\"Fiyat zaten bu tarihi dokuya göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Bu konak bu fiyata bir daha çıkmaz, bugün karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: "Restorasyonun tamamlanması şartıyla anlaştık." },
          { speaker: "emlah", text: "Hayırlı olsun, müteahhidi bulmak benim işim artık." },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer2", text: "Restorasyonun ne zaman biteceğini netleştirin, sonra konuşuruz." },
          { speaker: "emlah", text: "Anlıyorum, müteahhitle konuşup size dönerim." },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: "Bir tarafı diğerine karşı aceleye getirmeye çalıştığınızı fark ettik." },
          { speaker: "customer2", text: "Bu belirsizlikle bu ölçekte bir karar veremeyiz, vaktinizi aldık." },
        ],
        end: "lost",
      },
    },
  },

  {
    id: "set-evi",
    title: "Set Evi",
    location: "Beykoz, korulu villa",
    customerNames: [],
    dynamicCast: [{}],
    background: "theme-houseboat",
    askingPrice: 10500000,
    tier: 4,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.2, funWeight: 1.1, interestWeight: 1.2 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Sizi özellikle tavsiye ettiler, elinizde nadir bulunan bir şey varmış." },
          { speaker: "customer1", text: "Bahçedeki o büyük reflektörler ve kablolar da ne, dekor mu bunlar?" },
        ],
        choices: [
          { id: "a", text: "\"Evet, eski sahibinden kalma dekoratif parçalar.\"", next: "enter", effects: { suspicion: 5 } },
          { id: "b", text: "\"Açıkçası bu ev ara sıra çekim için kiralanıyor, göstereyim.\"", next: "enter", effects: { interest: 10 } },
          { id: "c", text: "\"Önce içeri geçelim, hikayesini içeride anlatayım.\"", next: "enter", effects: { fun: 5 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "İşte salon, birçok dizi ve reklamda kullanıldı burası." },
          { speaker: "customer1", text: "(duvardaki vida izlerine bakar) Bu izler dekor sabitlemekten mi kalmış?" },
        ],
        choices: [
          { id: "a", text: "\"Evet, çekim ekibi bazen mobilyaları değiştiriyor.\"", next: "q1_a", effects: { suspicion: 15 } },
          { id: "b", text: "\"Doğru, ama siz sahibi olunca bu kararı siz verirsiniz artık.\"", next: "q1_b", effects: { interest: 10 } },
          { id: "c", text: "\"Bir nevi ünlü bir setin sahibi olacaksınız, hoş bir ayrıcalık.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
        ],
      },
      q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Bazen\" derken ne sıklıkla oluyor bu değişim?" }], next: "surpriz" },
      q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Kararı ben vereceksem sorun yok o zaman." }], next: "surpriz" },
      q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) Ayrıcalık kelimesini duymak hoşuma gitti." }], next: "surpriz" },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", text: "(tam o sırada kapı çalar, dışarıda bir ekip \"yarınki çekim için mekan onayı\" diye soruyordur)" },
          { speaker: "emlah", text: "(hızla) Ah, eski bir randevu kalmış olmalı, hemen hallederim." },
          { speaker: "customer1", text: "Vay canına, gerçekten popülermiş burası." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", text: "Sizi özellikle önerdiler, fiyatta da o güveni hak eden bir teklif istiyorum." }],
        choices: [
          { id: "a", text: "\"Sizin için sahibiyle konuşup %6 indirim sağlarım, çekim sözleşmelerini de iptal ettiririm.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 6 } },
          { id: "b", text: "\"Bu ev bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
          { id: "c", text: "\"Fiyat zaten bu üne göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", text: "Çekim sözleşmeleri iptal edilirse anlaştık." },
          { speaker: "emlah", text: "Hayırlı olsun, artık senaryoyu siz yazıyorsunuz." },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", text: "Çekim takvimini bir görmek isterim, sonra karar veririm." },
          { speaker: "emlah", text: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz." },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
          { speaker: "customer1", text: "Sanırım bu ev bana göre değil, vaktinizi aldım." },
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
