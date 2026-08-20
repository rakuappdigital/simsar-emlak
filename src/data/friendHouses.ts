import type { HouseScene } from "../types";

/**
 * "Arkadaş Tavsiyeleri" — 10 houses (2 per friend in friendCharacters.ts),
 * unlocked one at a time by accepting a friend's house-tip message (see
 * friendFlavor.ts's new houseTip sets). Played exactly like premiumHouses.ts
 * (PremiumHouseScene, one-off, never touches houseOrder/results), just from
 * a separate menu tab so they read as "people you know," not random invites.
 * Every customer line carries an explicit `name` since these houses use a
 * fixed customerNames array, not dynamicCast. Dialogue is written to match
 * each friend's portrait/prop (see characterImages.ts): Ecrin with her
 * blueprint, Kutay with his notarized document, Bengisu with her camera,
 * Alperen with his phone, Duru in her scrubs.
 */
export const friendHouses: HouseScene[] = [
  {
    id: "ecrin-isik-kuyulu-loft",
    title: "Işık Kuyulu Loft",
    location: "Kadıköy, tasarım stüdyolarına yakın",
    customerNames: ["Ecrin"],
    background: "theme-sky",
    askingPrice: 8200000,
    tier: 2,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1, funWeight: 1.2, interestWeight: 1.1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: "(gözlüğünü düzeltip elindeki ruloyu masaya açar) Emlah, bak, bu benim çizdiğim loft — ışık kuyusunu görmeden gitme diyorum." },
          { speaker: "customer1", name: "Ecrin", text: "Müşterim satmak istiyor, ben de çizimleri elimden bırakmadan direkt seni aradım." },
        ],
        choices: [
          { id: "a", text: "\"Mimarından ilk elden çizim, güven verir — hemen bakalım.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Işık kuyusu tam olarak ne demek, anlat bana.\"", next: "enter", effects: { fun: 6 } },
          { id: "c", text: "\"Umarım fiyatı da çizimin kadar iyidir.\"", next: "enter", effects: { suspicion: 4 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Gerçekten de tavan boşluğundan gün ışığı direkt salona düşüyor." },
          { speaker: "customer1", name: "Ecrin", text: "Aynen öyle — üç kat boyunca ışığı aşağı taşıyan bir boşluk bıraktım bilerek, kağıt üzerinde de öyleydi." },
        ],
        choices: [
          { id: "a", text: "\"Bu detay evin değerini gerçekten artırır.\"", next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: "\"Kışın soğuk gelmez mi bu boşluktan?\"", next: "surpriz", effects: { suspicion: 8 } },
          { id: "c", text: "\"Instagram'da çok iyi görünür bu köşe.\"", next: "surpriz", effects: { fun: 12 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: "(rulodaki kesiti gösterir) Çift camlı, merak etme — ısı kaybını buraya kadar hesapladım, mühendisim de onayladı." },
          { speaker: "emlah", text: "O zaman gerçekten elden çıkarılacak bir detay değil." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Ecrin", text: "Sana arkadaş fiyatına anlaştırabilirim, ama biraz da hızlı davranmalıyız." }],
        choices: [
          { id: "a", text: "\"Arkadaşlığımıza güveniyorum, %8 indirimle ilerleyelim.\"", next: "closing_sold", effects: { closingBias: 30, suspicion: -8, discountPercent: 8 } },
          { id: "b", text: "\"Biraz daha düşünmem lazım, hemen karar veremem.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Bu fiyata başka yerde bulamazsın, hemen imzala.\"", next: "closing_lost", effects: { closingBias: -30, suspicion: 18 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: "(çizimleri toparlarken gülümser) Anlaştık — bu loftu sana emanet ediyorum, iyi yaşa." },
          { speaker: "emlah", text: "Tavsiyen için sağ ol Ecrin, gerçekten güzel bir yerdi." },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: "Tabii, acele etme — bir kez daha çizimlere bakmak istersen haber ver." },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: "(ruloyu tekrar sararken) Emlah, beni aceleye getirmene gerek yok, arkadaşız sonuçta." },
          { speaker: "customer1", name: "Ecrin", text: "Sanırım bu sefer olmadı." },
        ],
        end: "lost",
      },
    },
  },
  {
    id: "ecrin-simetrik-ikiz-daire",
    title: "Simetrik İkiz Daire",
    location: "Beşiktaş, sanat galerilerine yakın",
    customerNames: ["Ecrin"],
    background: "theme-echo",
    askingPrice: 11500000,
    tier: 2,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.1, funWeight: 1, interestWeight: 1.2 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: "(elindeki başka bir rulo çizimi açar) Bu sefer benim işim değil, meslektaşımın projesi ama gözüm ondan ayrılmıyor." },
          { speaker: "customer1", name: "Ecrin", text: "İki simetrik daireden biri boşaldı, plan tam kare — bu kadar temiz bir simetri nadir bulunur." },
        ],
        choices: [
          { id: "a", text: "\"Simetri her zaman satar, hemen görelim.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Meslektaşının projesiyse komisyon nasıl işliyor?\"", next: "enter", effects: { suspicion: 6 } },
          { id: "c", text: "\"İkiz daire denince aklıma hep filmler geliyor.\"", next: "enter", effects: { fun: 8 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Gerçekten de her oda karşılıklı eşit ölçülerde." },
          { speaker: "customer1", name: "Ecrin", text: "Mobilya yerleştirmek çok kolay oluyor böyle, milimetre boşa gitmiyor — mimar gözüyle söylüyorum." },
        ],
        choices: [
          { id: "a", text: "\"Bu düzen özellikle çalışanlar için ideal.\"", next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: "\"Bu kadar simetrik olması biraz soğuk hissettirmiyor mu?\"", next: "surpriz", effects: { fun: 6, suspicion: 4 } },
          { id: "c", text: "\"Komşu daire de aynıysa ses yalıtımı nasıl?\"", next: "surpriz", effects: { suspicion: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: "Ortak duvar özel yalıtımlı, meslektaşım bu konuda benden bile titizdir." },
          { speaker: "emlah", text: "O zaman endişelenecek bir şey yok." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Ecrin", text: "Fiyat konusunda ben araya girebilirim ama fazla zorlamayalım, meslektaşım gururlu biridir." }],
        choices: [
          { id: "a", text: "\"Makul bir orta yol bulalım, %6 yeter.\"", next: "closing_sold", effects: { closingBias: 25, suspicion: -6, discountPercent: 6 } },
          { id: "b", text: "\"Biraz daha düşünmem lazım.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Bu fiyat çok yüksek, ciddi bir indirim şart.\"", next: "closing_lost", effects: { closingBias: -25, suspicion: 15 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: "Meslektaşım da memnun kaldı, teşekkürler Emlah." },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Ecrin", text: "Sorun değil, ona da öyle iletirim, bekleriz." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Ecrin", text: "Meslektaşım bu kadar indirime asla razı olmaz, üzgünüm." }],
        end: "lost",
      },
    },
  },
  {
    id: "kutay-tertemiz-tapulu-konak",
    title: "Tertemiz Tapulu Konak",
    location: "Üsküdar, sakin bir sokak",
    customerNames: ["Kutay"],
    background: "theme-wind",
    askingPrice: 14800000,
    tier: 3,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.3, funWeight: 0.9, interestWeight: 1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Kutay", text: "(elindeki mühürlü belgeyi kaldırıp gösterir) Emlah, mesleğim gereği söylüyorum — bu tapunun geçmişi kristal gibi temiz." },
          { speaker: "customer1", name: "Kutay", text: "Otuz yıllık kayıtları tek tek kontrol ettim, imzası bende, mührü bende, hiçbir sorun yok." },
        ],
        choices: [
          { id: "a", text: "\"Noter onayı en güvenilir referanstır zaten.\"", next: "enter", effects: { interest: 10, suspicion: -6 } },
          { id: "b", text: "\"Bu kadar emin olman biraz tuhaf, her şey mükemmel olmaz.\"", next: "enter", effects: { suspicion: 8 } },
          { id: "c", text: "\"Sen kontrol ettiysen bana yeter, güvenirim.\"", next: "enter", effects: { fun: 8 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Konak gerçekten bakımlı, taş işçiliği de orijinal görünüyor." },
          { speaker: "customer1", name: "Kutay", text: "Restorasyon belgeleri de dosyada, hepsi mevzuata uygun yapılmış — istersen şimdi imzayı gösteririm." },
        ],
        choices: [
          { id: "a", text: "\"Belgeli restorasyon değerini ikiye katlar.\"", next: "surpriz", effects: { interest: 14 } },
          { id: "b", text: "\"Bu kadar evrak istifi bile şüphe uyandırabilir bazılarına.\"", next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: "\"Sen noter olunca ister istemez her şey belgeli oluyor demek.\"", next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Kutay", text: "(gülümser) Mesleki alışkanlık, elimde değil — ama bu sefer gerçekten faydası oldu." },
          { speaker: "emlah", text: "İtiraf edeyim, bu kadar düzenli bir dosya az görüyorum." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Kutay", text: "Fiyatta biraz esneyebilirim ama evrak kalitesinin bir bedeli olmalı, öyle değil mi?" }],
        choices: [
          { id: "a", text: "\"Haklısın, temiz evrak için makul bir orta yol buluruz.\"", next: "closing_sold", effects: { closingBias: 28, suspicion: -10, discountPercent: 5 } },
          { id: "b", text: "\"Yine de bir hukuk danışmanıma sormak isterim.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Evrak temizse fiyatta indirime gerek yok zaten.\"", next: "closing_lost", effects: { closingBias: -20, suspicion: 12 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Kutay", text: "(belgeyi imzalar) İşte bu, doğru kararı verdin — tebrikler Emlah." }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Kutay", text: "Elbette, dikkatli olman mesleğime de saygı demek, bekliyorum." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Kutay", text: "Bu kadar temiz bir tapuya bu yaklaşım biraz haksızlık oldu açıkçası." }],
        end: "lost",
      },
    },
  },
  {
    id: "kutay-miras-sonrasi-daire",
    title: "Miras Sonrası Daire",
    location: "Şişli, iş merkezlerine yakın",
    customerNames: ["Kutay"],
    background: "theme-busstop",
    askingPrice: 9700000,
    tier: 2,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.2, funWeight: 1, interestWeight: 1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Kutay", text: "(dosyayı masaya bırakır) Bu daire biraz karmaşık bir miras sürecinden çıktı, anlaşmayı ben hazırladım." },
          { speaker: "customer1", name: "Kutay", text: "Şimdi tüm mirasçılar imzaladı, satışa tamamen açık — endişelenecek bir şey kalmadı." },
        ],
        choices: [
          { id: "a", text: "\"Mirasçılar arası anlaşma her zaman kritik bir detaydır.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Miras süreci demek biraz tedirgin edici açıkçası.\"", next: "enter", effects: { suspicion: 10 } },
          { id: "c", text: "\"Umarım kimse sonradan çıkıp itiraz etmez.\"", next: "enter", effects: { fun: 6, suspicion: 4 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Daire gayet bakımlı, uzun süre boş kalmış gibi görünmüyor." },
          { speaker: "customer1", name: "Kutay", text: "Mirasçılardan biri düzenli kontrol ediyordu, o yüzden hiç ihmal edilmedi." },
        ],
        choices: [
          { id: "a", text: "\"Bu detay alıcının içini rahatlatır.\"", next: "surpriz", effects: { interest: 10 } },
          { id: "b", text: "\"Tüm imzalar tamamlandığından emin misin?\"", next: "surpriz", effects: { suspicion: 8 } },
          { id: "c", text: "\"Noter olarak bu tür şeylerde uyumaman lazım herhalde.\"", next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Kutay", text: "(dosyayı açar) Tüm imzalar elimde, istersen şimdi tek tek gösterebilirim." },
          { speaker: "emlah", text: "Bu şeffaflık gerçekten işimi kolaylaştırıyor." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Kutay", text: "Mirasçılar hızlı satış istiyor, bu yüzden fiyatta biraz alan var." }],
        choices: [
          { id: "a", text: "\"O zaman hızlı hareket edip %7 indirimle kapatalım.\"", next: "closing_sold", effects: { closingBias: 26, suspicion: -6, discountPercent: 7 } },
          { id: "b", text: "\"Yine de birkaç gün düşünmek isterim.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Miras süreci varsa daha büyük bir indirim beklerim.\"", next: "closing_lost", effects: { closingBias: -22, suspicion: 14 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Kutay", text: "Mirasçılar da memnun kalacak, teşekkürler Emlah." }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Kutay", text: "Anlıyorum, mirasçılara da öyle iletirim." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Kutay", text: "Mirasçılar bu kadar indirime razı olmaz, üzgünüm Emlah." }],
        end: "lost",
      },
    },
  },
  {
    id: "bengisu-gunbatimi-terasi",
    title: "Gün Batımı Terası",
    location: "Beylikdüzü, sahil şeridi",
    customerNames: ["Bengisu"],
    background: "theme-sea",
    askingPrice: 10300000,
    tier: 2,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 0.9, funWeight: 1.4, interestWeight: 1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Bengisu", text: "(kameranın ekranını çevirip gösterir) Emlah! Bu terasın gün batımını görünce çıldıracaksın, yemin ederim en iyi kareler burada." },
          { speaker: "customer1", name: "Bengisu", text: "Takipçilerim bile sordu \"bu neresi\" diye, o kadar güzel." },
        ],
        choices: [
          { id: "a", text: "\"Manzara satışın yarısıdır zaten, bakalım.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Takipçi sayısı evin fiyatını etkilemiyor umarım.\"", next: "enter", effects: { suspicion: 6 } },
          { id: "c", text: "\"Ben de bir kare çekeyim o zaman.\"", next: "enter", effects: { fun: 14 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Gerçekten de teras güneye bakıyor, ışık müthiş." },
          { speaker: "customer1", name: "Bengisu", text: "Akşamları burada oturup içki içmek başlı başına bir terapi, kamerayı bile bırakmak istemiyorum." },
        ],
        choices: [
          { id: "a", text: "\"Bu tarz detaylar alıcıyı duygusal olarak bağlar.\"", next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: "\"Estetik güzel de yapısal durumu nasıl?\"", next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: "\"Bu terası görüp satın almayan çıkmaz herhalde.\"", next: "surpriz", effects: { fun: 12 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Bengisu", text: "Geçen yıl teras yenilendi, statik raporu da var, merak etme — çekim yaparken sordurdum zaten." },
          { speaker: "emlah", text: "O zaman görüntü kadar sağlam bir yer de demek." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Bengisu", text: "Fiyatta biraz oynayabiliriz, ama sen de beni etiketlersin değil mi? 😄" }],
        choices: [
          { id: "a", text: "\"Tabii ki, %6 indirimle anlaşalım.\"", next: "closing_sold", effects: { closingBias: 26, suspicion: -4, discountPercent: 6, fun: 6 } },
          { id: "b", text: "\"Bir gün daha düşünmem lazım.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Bu fiyat manzara için bile fazla, ciddi indirim şart.\"", next: "closing_lost", effects: { closingBias: -24, suspicion: 12 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Bengisu", text: "(kamerayı kaldırır) Yaşasın! İlk gün batımı fotoğrafını bana da at, tamam mı?" }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Bengisu", text: "Tabii tabii, ben de bu arada başka kareler çekerim." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Bengisu", text: "Aa, üzüldüm ama tamam, başka bir manzara buluruz sana." }],
        end: "lost",
      },
    },
  },
  {
    id: "bengisu-retro-vitrin-daire",
    title: "Retro Vitrin Daire",
    location: "Balat, renkli sokaklar",
    customerNames: ["Bengisu"],
    background: "theme-tailor",
    askingPrice: 6400000,
    tier: 1,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1, funWeight: 1.3, interestWeight: 1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Bengisu", text: "(kamerasını omzuna asar) Bu daireyi çekim için kiralamıştım, sahibi de satmak istiyor, seni aradım hemen." },
          { speaker: "customer1", name: "Bengisu", text: "Cepheler o kadar renkli ki, sokak başlı başına bir set gibi." },
        ],
        choices: [
          { id: "a", text: "\"Bu tarz dairelerin özel bir alıcı kitlesi vardır.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Çekim için kiralık bir yer satılık olarak ne kadar gerçek?\"", next: "enter", effects: { suspicion: 8 } },
          { id: "c", text: "\"Balat her zaman enstantane malzemesi zaten.\"", next: "enter", effects: { fun: 12 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Eski dokuyu bozmadan yenilemişler, bu nadir bir denge." },
          { speaker: "customer1", name: "Bengisu", text: "Sahibi de tam bunu istemiş, tarihi dokuya çok önem veriyor." },
        ],
        choices: [
          { id: "a", text: "\"Bu denge evin değerini gerçekten yükseltir.\"", next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: "\"Eski binalarda beklenmedik masraflar çıkabiliyor.\"", next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: "\"Bu daireyi kaç kere kare için kullandın?\"", next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Bengisu", text: "(güler) Sayamadım artık, ama tesisatı geçen yıl tamamen yenilendi, merak etme." },
          { speaker: "emlah", text: "O zaman görüntü kadar sağlam bir alt yapısı da var demek." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Bengisu", text: "Sahibi hızlı satmak istiyor, biraz esneklik olabilir." }],
        choices: [
          { id: "a", text: "\"Anlaştık, %8 indirimle hızlıca kapatalım.\"", next: "closing_sold", effects: { closingBias: 28, suspicion: -6, discountPercent: 8 } },
          { id: "b", text: "\"Yine de biraz daha düşünmek isterim.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Eski bina riski var, daha büyük bir indirim gerek.\"", next: "closing_lost", effects: { closingBias: -22, suspicion: 14 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Bengisu", text: "Harika! Taşınma gününü de çekim yapayım mı senden izinle 😄" }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Bengisu", text: "Sorun değil, sahibine öyle iletirim." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Bengisu", text: "Sahibi bu kadar indirime razı olmayacaktır sanırım, üzgünüm." }],
        end: "lost",
      },
    },
  },
  {
    id: "alperen-ofis-ev-hybrid-loft",
    title: "Ofis-Ev Hybrid Loft",
    location: "Maslak, iş merkezine yürüme mesafesi",
    customerNames: ["Alperen"],
    background: "theme-metro",
    askingPrice: 16900000,
    tier: 3,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.2, funWeight: 1, interestWeight: 1.2 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Alperen", text: "(telefonundaki grafiğe bakarken başını kaldırmadan konuşur) Emlah dostum, kendi lofttumu satıyorum — yeni bir işe girişiyorum, nakit lazım." },
          { speaker: "customer1", name: "Alperen", text: "Hem ev hem ofis olarak tasarladım, gerçek bir fırsat bu." },
        ],
        choices: [
          { id: "a", text: "\"Girişimcilikte cesaret önemli, yardımcı olayım.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Nakit lazım demek biraz aceleye getiriyorsun gibi.\"", next: "enter", effects: { suspicion: 8 } },
          { id: "c", text: "\"Yine yeni bir proje mi, seni hiç durdurmuyorlar 😄\"", next: "enter", effects: { fun: 10 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Açık plan gerçekten hem çalışma hem yaşam alanı olarak kurgulanmış." },
          { speaker: "customer1", name: "Alperen", text: "Aynen, video toplantısı yaparken arka planım bile hazır oluyor." },
        ],
        choices: [
          { id: "a", text: "\"Hibrit çalışanlar için bu çok cazip bir özellik.\"", next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: "\"Bu kadar hızlı satmak istemen beni tedirgin ediyor.\"", next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: "\"Yeni girişimin adı ne bu sefer?\"", next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Alperen", text: "(telefonu cebine atar) Söylemesi henüz erken ama sana ilk haber veririm, söz." },
          { speaker: "emlah", text: "Tamam, o zaman şimdilik eve odaklanalım." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Alperen", text: "Hızlı satmam lazım, senin için de iyi bir fırsat bu — ciddi bir indirim yapabilirim." }],
        choices: [
          { id: "a", text: "\"Tamam, %9 indirimle hızlıca kapatalım.\"", next: "closing_sold", effects: { closingBias: 30, suspicion: -4, discountPercent: 9 } },
          { id: "b", text: "\"Yine de acele etmeden düşünmek istiyorum.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Bu kadar acele satış bende güven uyandırmıyor.\"", next: "closing_lost", effects: { closingBias: -25, suspicion: 16 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Alperen", text: "Süper! Bu para tam da ihtiyacım olan sermaye, sağ ol dostum." }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Alperen", text: "Tamam ama çok bekleyemem, haber ver bana." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Alperen", text: "Anlıyorum ama vaktim gerçekten yok, başka birine bakacağım." }],
        end: "lost",
      },
    },
  },
  {
    id: "alperen-yatirimci-dostu-studyo",
    title: "Yatırımcı Dostu Stüdyo",
    location: "Ataşehir, finans merkezine yakın",
    customerNames: ["Alperen"],
    background: "theme-island",
    askingPrice: 5800000,
    tier: 1,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1.1, funWeight: 1, interestWeight: 1.1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Alperen", text: "(telefonda bir tabloyu kaydırarak gösterir) Bu sefer benim değil ama bir yatırımcı arkadaşımın stüdyosu — kiraya vermek isteyenler için ideal." },
          { speaker: "customer1", name: "Alperen", text: "Küçük ama kirası çok iyi, sayıları da hazırladım." },
        ],
        choices: [
          { id: "a", text: "\"Sayılarla konuşan bir teklif her zaman ikna edicidir.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Sayıları sen mi hazırladın, biraz iyimser olabilir.\"", next: "enter", effects: { suspicion: 8 } },
          { id: "c", text: "\"Sen de yüzde alıyorsun herhalde bu işten 😄\"", next: "enter", effects: { fun: 10 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Stüdyo küçük ama plan gerçekten verimli kullanılmış." },
          { speaker: "customer1", name: "Alperen", text: "Bölgede kira talebi de yüksek, boş kalma riski neredeyse yok." },
        ],
        choices: [
          { id: "a", text: "\"Düşük risk yüksek talep, klasik iyi yatırım.\"", next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: "\"Bu iyimser tabloyu biraz daha sorgulamak isterim.\"", next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: "\"Sen bu işi bilseydin kendine alırdın herhalde.\"", next: "surpriz", effects: { fun: 12 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Alperen", text: "(güler) Doğru itiraf edeyim, param olsa alırdım — ama şu an başka bir işe yatırıyorum." },
          { speaker: "emlah", text: "En azından dürüst konuştun, bu bana yeter." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Alperen", text: "Fiyatta biraz oynayabiliriz, arkadaşımın da hızlı satması lazım." }],
        choices: [
          { id: "a", text: "\"Tamam, %7 indirimle ilerleyelim.\"", next: "closing_sold", effects: { closingBias: 26, suspicion: -6, discountPercent: 7 } },
          { id: "b", text: "\"Kira rakamlarını kendim de kontrol etmek isterim.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Bu sayılar bana gerçekçi gelmiyor, pas geçiyorum.\"", next: "closing_lost", effects: { closingBias: -22, suspicion: 12 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Alperen", text: "Harika, arkadaşıma haber veriyorum hemen." }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Alperen", text: "Mantıklı, ben de sana güncel rakamları gönderirim." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Alperen", text: "Tamam, arkadaşıma başka alıcı bakmasını söylerim." }],
        end: "lost",
      },
    },
  },
  {
    id: "duru-sessiz-bahce-kati",
    title: "Sessiz Bahçe Katı",
    location: "Bahçeşehir, yeşil alana sınır",
    customerNames: ["Duru"],
    background: "theme-wind",
    askingPrice: 7300000,
    tier: 1,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1, funWeight: 1, interestWeight: 0.9 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Duru", text: "(sakin bir sesle, ellerini kavuşturmuş) Emlah, biliyorsun yurt dışına taşınıyorum — kendi evimi sana bırakmak istiyorum." },
          { speaker: "customer1", name: "Duru", text: "Bahçe katı, çok sessiz, uzun nöbetlerden sonra beni hep dinlendirdi burası." },
        ],
        choices: [
          { id: "a", text: "\"Huzurlu bir ev her zaman değerlidir, hemen bakalım.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Bu kadar aceleyle taşınman biraz düşündürücü.\"", next: "enter", effects: { suspicion: 6 } },
          { id: "c", text: "\"Sonunda maceraya atılıyorsun demek!\"", next: "enter", effects: { fun: 10 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Gerçekten de dışarıdan hiç trafik sesi gelmiyor." },
          { speaker: "customer1", name: "Duru", text: "Bahçeyi de kendim düzenledim, ilk baharda çiçek açıyor her yer." },
        ],
        choices: [
          { id: "a", text: "\"Bu tarz sakinlik özellikle yorgun profesyonelleri çeker.\"", next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: "\"Bahçe katı olunca nem sorunu olur mu diye merak ediyorum.\"", next: "surpriz", effects: { suspicion: 8 } },
          { id: "c", text: "\"Çiçekleri kim sulayacak sen gidince?\"", next: "surpriz", effects: { fun: 8 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Duru", text: "Su yalıtımı geçen yıl yenilendi, nem hiç sorun olmadı hiçbir zaman." },
          { speaker: "emlah", text: "O zaman gerçekten bakımlı ve sağlam bir yer." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Duru", text: "Fiyatta esnek olabilirim, sadece iyi birine gitsin istiyorum." }],
        choices: [
          { id: "a", text: "\"Söz veriyorum, burayı iyi bir yuva yapacağım — %7 indirimle anlaşalım.\"", next: "closing_sold", effects: { closingBias: 28, suspicion: -8, discountPercent: 7 } },
          { id: "b", text: "\"Biraz daha düşünmek isterim.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Fiyat hâlâ biraz yüksek geliyor bana.\"", next: "closing_lost", effects: { closingBias: -20, suspicion: 10 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Duru", text: "(gülümser) Teşekkür ederim Emlah, içim rahat şimdi. İyi bakarsın biliyorum." }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Duru", text: "Elbette, acele etme, ben de son güne kadar buradayım." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Duru", text: "Anlıyorum, umarım burayı hak eden birini bulurum." }],
        end: "lost",
      },
    },
  },
  {
    id: "duru-huzurlu-manzarali-ev",
    title: "Huzurlu Manzaralı Ev",
    location: "Çekmeköy, orman sınırında",
    customerNames: ["Duru"],
    background: "theme-houseboat",
    askingPrice: 9100000,
    tier: 2,
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    profile: { suspicionWeight: 1, funWeight: 1, interestWeight: 1 },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", name: "Duru", text: "(forması hâlâ üzerinde, nöbetten yeni çıkmış gibi) Bu ev bir meslektaşımın — hastanede beraber çalışıyoruz, o da vardiyalardan yorgun." },
          { speaker: "customer1", name: "Duru", text: "Orman manzarası var, sabahları kuş sesiyle uyanıyormuş." },
        ],
        choices: [
          { id: "a", text: "\"Doğayla iç içe evler her zaman kıymetlidir.\"", next: "enter", effects: { interest: 10 } },
          { id: "b", text: "\"Orman sınırı demek ulaşım biraz zor olabilir.\"", next: "enter", effects: { suspicion: 6 } },
          { id: "c", text: "\"Siz hemşireler hep birbirinize ev mi buluyorsunuz 😄\"", next: "enter", effects: { fun: 10 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: "Gerçekten sessiz, sadece kuş sesleri var." },
          { speaker: "customer1", name: "Duru", text: "Meslektaşım burada gerçekten toparlandığını söylemişti, uzun nöbetlerden sonra." },
        ],
        choices: [
          { id: "a", text: "\"Bu tarz bir huzur her alıcıyı etkiler.\"", next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: "\"Ulaşım gerçekten sorun olur mu emin misin?\"", next: "surpriz", effects: { suspicion: 8 } },
          { id: "c", text: "\"Belki ben de bu işten bir ev kaparım nöbetlerden sonra.\"", next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Duru", text: "Ana yola on dakika, aslında göründüğü kadar uzak değil." },
          { speaker: "emlah", text: "O zaman huzur ile ulaşım arasında iyi bir denge var." },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Duru", text: "Meslektaşım hızlı satmak istiyor, fiyatta biraz alan var." }],
        choices: [
          { id: "a", text: "\"Anlaştık, %6 indirimle ilerleyelim.\"", next: "closing_sold", effects: { closingBias: 25, suspicion: -6, discountPercent: 6 } },
          { id: "b", text: "\"Bir kez daha bakmak isterim, düşüneyim.\"", next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: "\"Ulaşım riski varsa fiyat daha da düşmeli.\"", next: "closing_lost", effects: { closingBias: -20, suspicion: 10 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Duru", text: "Meslektaşım çok sevinecek, teşekkürler Emlah." }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Duru", text: "Tabii, ona da öyle iletirim, bekleriz seni." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Duru", text: "Anlıyorum, meslektaşıma başka bir yol düşünürüz." }],
        end: "lost",
      },
    },
  },
];

export function friendHouseById(id: string): HouseScene | undefined {
  return friendHouses.find((h) => h.id === id);
}
