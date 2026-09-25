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
    title: "Işık Kuyulu Loft", titleEn: "Light Well Loft",
    location: "Kadıköy, tasarım stüdyolarına yakın", locationEn: "Kadıköy, close to design studios",
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
          { speaker: "customer1", name: "Ecrin", text: { tr: "(gözlüğünü düzeltip elindeki ruloyu masaya açar) Emlah, bak, bu benim çizdiğim loft — ışık kuyusunu görmeden gitme diyorum.", en: "(adjusting his glasses and unrolling the blueprint on the table) Estetan, look, this is the loft I designed — I'm telling you, don't leave without seeing the light well." } },
          { speaker: "customer1", name: "Ecrin", text: { tr: "Müşterim satmak istiyor, ben de çizimleri elimden bırakmadan direkt seni aradım.", en: "My client wants to sell it, and I called you directly without putting the drawings down." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Mimarından ilk elden çizim, güven verir — hemen bakalım.\"", en: "\"First-hand drawings from its architect inspire trust — let's check it out immediately.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Işık kuyusu tam olarak ne demek, anlat bana.\"", en: "\"What exactly does a light well mean, explain it to me.\"" }, next: "enter", effects: { fun: 6 } },
          { id: "c", text: { tr: "\"Umarım fiyatı da çizimin kadar iyidir.\"", en: "\"I hope the price is as good as your design.\"" }, next: "enter", effects: { suspicion: 4 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Gerçekten de tavan boşluğundan gün ışığı direkt salona düşüyor.", en: "Indeed, daylight from the ceiling void falls directly into the living room." } },
          { speaker: "customer1", name: "Ecrin", text: { tr: "Aynen öyle — üç kat boyunca ışığı aşağı taşıyan bir boşluk bıraktım bilerek, kağıt üzerinde de öyleydi.", en: "Exactly — I purposely left a void carrying light down through three floors, it was just like that on paper." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bu detay evin değerini gerçekten artırır.\"", en: "\"This detail truly increases the value of the home.\"" }, next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: { tr: "\"Kışın soğuk gelmez mi bu boşluktan?\"", en: "\"Won't it get cold in the winter through this void?\"" }, next: "surpriz", effects: { suspicion: 8 } },
          { id: "c", text: { tr: "\"Instagram'da çok iyi görünür bu köşe.\"", en: "\"This corner will look great on Instagram.\"" }, next: "surpriz", effects: { fun: 12 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: { tr: "(rulodaki kesiti gösterir) Çift camlı, merak etme — ısı kaybını buraya kadar hesapladım, mühendisim de onayladı.", en: "(pointing to the section on the blueprint) Double-glazed, don't worry — I calculated the heat loss all the way, and my engineer approved it." } },
          { speaker: "emlah", text: { tr: "O zaman gerçekten elden çıkarılacak bir detay değil.", en: "Then it's truly a detail not to be parted with lightly." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Ecrin", text: { tr: "Sana arkadaş fiyatına anlaştırabilirim, ama biraz da hızlı davranmalıyız.", en: "I can arrange a friend's price for you, but we also need to move a bit fast." } }],
        choices: [
          { id: "a", text: { tr: "\"Arkadaşlığımıza güveniyorum, %8 indirimle ilerleyelim.\"", en: "\"I trust our friendship, let's proceed with an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 30, suspicion: -8, discountPercent: 8 } },
          { id: "b", text: { tr: "\"Biraz daha düşünmem lazım, hemen karar veremem.\"", en: "\"I need to think a bit more, I can't decide right away.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Bu fiyata başka yerde bulamazsın, hemen imzala.\"", en: "\"You won't find this anywhere else at this price, sign it right now.\"" }, next: "closing_lost", effects: { closingBias: -30, suspicion: 18 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: { tr: "(çizimleri toparlarken gülümser) Anlaştık — bu loftu sana emanet ediyorum, iyi yaşa.", en: "(smiling as he packs up the drawings) Agreed — I'm entrusting this loft to you, live well." } },
          { speaker: "emlah", text: { tr: "Tavsiyen için sağ ol Ecrin, gerçekten güzel bir yerdi.", en: "Thanks for the advice Ecrin, it really was a nice place." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: { tr: "Tabii, acele etme — bir kez daha çizimlere bakmak istersen haber ver.", en: "Sure, take your time — let me know if you want to look at the blueprints once more." } },
        ],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: { tr: "(ruloyu tekrar sararken) Emlah, beni aceleye getirmene gerek yok, arkadaşız sonuçta.", en: "(rolling up the blueprint again) Estetan, you don't need to rush me, we're friends after all." } },
          { speaker: "customer1", name: "Ecrin", text: { tr: "Sanırım bu sefer olmadı.", en: "I guess it didn't work out this time." } },
        ],
        end: "lost",
      },
    },
  },
  {
    id: "ecrin-simetrik-ikiz-daire",
    title: "Simetrik İkiz Daire", titleEn: "Symmetrical Twin Apartment",
    location: "Beşiktaş, sanat galerilerine yakın", locationEn: "Beşiktaş, close to art galleries",
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
          { speaker: "customer1", name: "Ecrin", text: { tr: "(elindeki başka bir rulo çizimi açar) Bu sefer benim işim değil, meslektaşımın projesi ama gözüm ondan ayrılmıyor.", en: "(unrolling another blueprint) This time it's not my work, it's a colleague's project, but I can't take my eyes off it." } },
          { speaker: "customer1", name: "Ecrin", text: { tr: "İki simetrik daireden biri boşaldı, plan tam kare — bu kadar temiz bir simetri nadir bulunur.", en: "One of the two symmetrical apartments has become vacant, the layout is perfectly square — such clean symmetry is rare." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Simetri her zaman satar, hemen görelim.\"", en: "\"Symmetry always sells, let's see it immediately.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Meslektaşının projesiyse komisyon nasıl işliyor?\"", en: "\"Since it's your colleague's project, how does the commission work?\"" }, next: "enter", effects: { suspicion: 6 } },
          { id: "c", text: { tr: "\"İkiz daire denince aklıma hep filmler geliyor.\"", en: "\"When I hear twin apartments, I always think of movies.\"" }, next: "enter", effects: { fun: 8 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Gerçekten de her oda karşılıklı eşit ölçülerde.", en: "Truly every room has mutually equal dimensions." } },
          { speaker: "customer1", name: "Ecrin", text: { tr: "Mobilya yerleştirmek çok kolay oluyor böyle, milimetre boşa gitmiyor — mimar gözüyle söylüyorum.", en: "Placing furniture becomes so easy this way, not a millimeter goes to waste — I'm saying this with an architect's eye." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bu düzen özellikle çalışanlar için ideal.\"", en: "\"This layout is especially ideal for working professionals.\"" }, next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: { tr: "\"Bu kadar simetrik olması biraz soğuk hissettirmiyor mu?\"", en: "\"Doesn't being this symmetrical feel a bit cold?\"" }, next: "surpriz", effects: { fun: 6, suspicion: 4 } },
          { id: "c", text: { tr: "\"Komşu daire de aynıysa ses yalıtımı nasıl?\"", en: "\"If the neighboring apartment is the same, how is the sound insulation?\"" }, next: "surpriz", effects: { suspicion: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: { tr: "Ortak duvar özel yalıtımlı, meslektaşım bu konuda benden bile titizdir.", en: "The shared wall has special insulation, my colleague is even more meticulous about this than I am." } },
          { speaker: "emlah", text: { tr: "O zaman endişelenecek bir şey yok.", en: "Then there's nothing to worry about." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Ecrin", text: { tr: "Fiyat konusunda ben araya girebilirim ama fazla zorlamayalım, meslektaşım gururlu biridir.", en: "I can step in regarding the price, but let's not push too hard, my colleague is a proud person." } }],
        choices: [
          { id: "a", text: { tr: "\"Makul bir orta yol bulalım, %6 yeter.\"", en: "\"Let's find a reasonable middle ground, 6% is enough.\"" }, next: "closing_sold", effects: { closingBias: 25, suspicion: -6, discountPercent: 6 } },
          { id: "b", text: { tr: "\"Biraz daha düşünmem lazım.\"", en: "\"I need to think a bit more.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Bu fiyat çok yüksek, ciddi bir indirim şart.\"", en: "\"This price is too high, a serious discount is a must.\"" }, next: "closing_lost", effects: { closingBias: -25, suspicion: 15 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [
          { speaker: "customer1", name: "Ecrin", text: { tr: "Meslektaşım da memnun kaldı, teşekkürler Emlah.", en: "My colleague was also satisfied, thanks Estetan." } },
        ],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Ecrin", text: { tr: "Sorun değil, ona da öyle iletirim, bekleriz.", en: "No problem, I'll pass it on to them like that, we'll wait." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Ecrin", text: { tr: "Meslektaşım bu kadar indirime asla razı olmaz, üzgünüm.", en: "My colleague will never agree to such a discount, I'm sorry." } }],
        end: "lost",
      },
    },
  },
  {
    id: "kutay-tertemiz-tapulu-konak",
    title: "Tertemiz Tapulu Konak", titleEn: "Immaculately Titled Mansion",
    location: "Üsküdar, sakin bir sokak", locationEn: "Üsküdar, a quiet street",
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
          { speaker: "customer1", name: "Kutay", text: { tr: "(elindeki mühürlü belgeyi kaldırıp gösterir) Emlah, mesleğim gereği söylüyorum — bu tapunun geçmişi kristal gibi temiz.", en: "(lifting and showing the sealed document) Estetan, speaking as a notary — the history of this title deed is as crystal clean as glass." } },
          { speaker: "customer1", name: "Kutay", text: { tr: "Otuz yıllık kayıtları tek tek kontrol ettim, imzası bende, mührü bende, hiçbir sorun yok.", en: "I checked thirty years of records one by one, I have the signature, I have the seal, there is no problem at all." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Noter onayı en güvenilir referanstır zaten.\"", en: "\"Notary approval is already the most reliable reference.\"" }, next: "enter", effects: { interest: 10, suspicion: -6 } },
          { id: "b", text: { tr: "\"Bu kadar emin olman biraz tuhaf, her şey mükemmel olmaz.\"", en: "\"Being this certain feels a bit strange, everything can't be perfect.\"" }, next: "enter", effects: { suspicion: 8 } },
          { id: "c", text: { tr: "\"Sen kontrol ettiysen bana yeter, güvenirim.\"", en: "\"If you checked it, that's enough for me, I trust you.\"" }, next: "enter", effects: { fun: 8 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Konak gerçekten bakımlı, taş işçiliği de orijinal görünüyor.", en: "The mansion is truly well-maintained, and the stonework looks original." } },
          { speaker: "customer1", name: "Kutay", text: { tr: "Restorasyon belgeleri de dosyada, hepsi mevzuata uygun yapılmış — istersen şimdi imzayı gösteririm.", en: "The restoration documents are also in the file, all done in compliance with regulations — I can show you the signature now if you want." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Belgeli restorasyon değerini ikiye katlar.\"", en: "\"Documented restoration doubles its value.\"" }, next: "surpriz", effects: { interest: 14 } },
          { id: "b", text: { tr: "\"Bu kadar evrak istifi bile şüphe uyandırabilir bazılarına.\"", en: "\"Even a stack of paperwork like this might raise suspicion for some.\"" }, next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: { tr: "\"Sen noter olunca ister istemez her şey belgeli oluyor demek.\"", en: "\"I guess when you're a notary, everything is inevitably documented.\"" }, next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Kutay", text: { tr: "(gülümser) Mesleki alışkanlık, elimde değil — ama bu sefer gerçekten faydası oldu.", en: "(smiling) Professional habit, I can't help it — but it really came in handy this time." } },
          { speaker: "emlah", text: { tr: "İtiraf edeyim, bu kadar düzenli bir dosya az görüyorum.", en: "I must admit, I rarely see such an organized file." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Kutay", text: { tr: "Fiyatta biraz esneyebilirim ama evrak kalitesinin bir bedeli olmalı, öyle değil mi?", en: "I can be flexible on the price, but the quality of the paperwork should have a price, shouldn't it?" } }],
        choices: [
          { id: "a", text: { tr: "\"Haklısın, temiz evrak için makul bir orta yol buluruz.\"", en: "\"You're right, we can find a reasonable middle ground for clean paperwork.\"" }, next: "closing_sold", effects: { closingBias: 28, suspicion: -10, discountPercent: 5 } },
          { id: "b", text: { tr: "\"Yine de bir hukuk danışmanıma sormak isterim.\"", en: "\"Still, I'd like to consult my legal advisor.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Evrak temizse fiyatta indirime gerek yok zaten.\"", en: "\"If the paperwork is clean, there's no need for a price discount anyway.\"" }, next: "closing_lost", effects: { closingBias: -20, suspicion: 12 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Kutay", text: { tr: "(belgeyi imzalar) İşte bu, doğru kararı verdin — tebrikler Emlah.", en: "(signing the document) There it is, you made the right decision — congratulations Estetan." } }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Kutay", text: { tr: "Elbette, dikkatli olman mesleğime de saygı demek, bekliyorum.", en: "Of course, being cautious also means respecting my profession, I'm waiting." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Kutay", text: { tr: "Bu kadar temiz bir tapuya bu yaklaşım biraz haksızlık oldu açıkçası.", en: "Frankly, this approach to such a clean title deed was a bit unfair." } }],
        end: "lost",
      },
    },
  },
  {
    id: "kutay-miras-sonrasi-daire",
    title: "Miras Sonrası Daire", titleEn: "Post-Inheritance Apartment",
    location: "Şişli, iş merkezlerine yakın", locationEn: "Şişli, close to business centers",
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
          { speaker: "customer1", name: "Kutay", text: { tr: "(dosyayı masaya bırakır) Bu daire biraz karmaşık bir miras sürecinden çıktı, anlaşmayı ben hazırladım.", en: "(leaving the file on the table) This apartment came out of a somewhat complex inheritance process, I prepared the agreement." } },
          { speaker: "customer1", name: "Kutay", text: { tr: "Şimdi tüm mirasçılar imzaladı, satışa tamamen açık — endişelenecek bir şey kalmadı.", en: "Now all heirs have signed, completely open to sale — nothing left to worry about." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Mirasçılar arası anlaşma her zaman kritik bir detaydır.\"", en: "\"Agreement between heirs is always a critical detail.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Miras süreci demek biraz tedirgin edici açıkçası.\"", en: "\"An inheritance process feels a bit unsettling, frankly.\"" }, next: "enter", effects: { suspicion: 10 } },
          { id: "c", text: { tr: "\"Umarım kimse sonradan çıkıp itiraz etmez.\"", en: "\"I hope no one shows up later to object.\"" }, next: "enter", effects: { fun: 6, suspicion: 4 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Daire gayet bakımlı, uzun süre boş kalmış gibi görünmüyor.", en: "The apartment is quite well-maintained, doesn't look like it's been empty for long." } },
          { speaker: "customer1", name: "Kutay", text: { tr: "Mirasçılardan biri düzenli kontrol ediyordu, o yüzden hiç ihmal edilmedi.", en: "One of the heirs was checking it regularly, so it was never neglected." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bu detay alıcının içini rahatlatır.\"", en: "\"This detail eases the buyer's mind.\"" }, next: "surpriz", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Tüm imzalar tamamlandığından emin misin?\"", en: "\"Are you sure all signatures are complete?\"" }, next: "surpriz", effects: { suspicion: 8 } },
          { id: "c", text: { tr: "\"Noter olarak bu tür şeylerde uyumaman lazım herhalde.\"", en: "\"As a notary, you probably shouldn't sleep on things like this.\"" }, next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Kutay", text: { tr: "(dosyayı açar) Tüm imzalar elimde, istersen şimdi tek tek gösterebilirim.", en: "(opening the file) I have all signatures, I can show them to you one by one now if you want." } },
          { speaker: "emlah", text: { tr: "Bu şeffaflık gerçekten işimi kolaylaştırıyor.", en: "This transparency really makes my job easier." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Kutay", text: { tr: "Mirasçılar hızlı satış istiyor, bu yüzden fiyatta biraz alan var.", en: "The heirs want a quick sale, so there is some room in the price." } }],
        choices: [
          { id: "a", text: { tr: "\"O zaman hızlı hareket edip %7 indirimle kapatalım.\"", en: "\"Then let's move fast and close it with a 7% discount.\"" }, next: "closing_sold", effects: { closingBias: 26, suspicion: -6, discountPercent: 7 } },
          { id: "b", text: { tr: "\"Yine de birkaç gün düşünmek isterim.\"", en: "\"Still, I'd like to think about it for a few days.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Miras süreci varsa daha büyük bir indirim beklerim.\"", en: "\"If there's an inheritance process involved, I expect a bigger discount.\"" }, next: "closing_lost", effects: { closingBias: -22, suspicion: 14 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Kutay", text: { tr: "Mirasçılar da memnun kalacak, teşekkürler Emlah.", en: "The heirs will be pleased too, thanks Estetan." } }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Kutay", text: { tr: "Anlıyorum, mirasçılara da öyle iletirim.", en: "I understand, I'll pass it on to the heirs like that." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Kutay", text: { tr: "Mirasçılar bu kadar indirime razı olmaz, üzgünüm Emlah.", en: "The heirs won't agree to this much of a discount, I'm sorry Estetan." } }],
        end: "lost",
      },
    },
  },
  {
    id: "bengisu-gunbatimi-terasi",
    title: "Gün Batımı Terası", titleEn: "Sunset Terrace",
    location: "Beylikdüzü, sahil şeridi", locationEn: "Beylikdüzü, coastline",
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
          { speaker: "customer1", name: "Bengisu", text: { tr: "(kameranın ekranını çevirip gösterir) Emlah! Bu terasın gün batımını görünce çıldıracaksın, yemin ederim en iyi kareler burada.", en: "(turning the camera screen around) Estetan! You'll go crazy when you see the sunset of this terrace, I swear the best shots are here." } },
          { speaker: "customer1", name: "Bengisu", text: { tr: "Takipçilerim bile sordu \"bu neresi\" diye, o kadar güzel.", en: "Even my followers asked \"where is this\", it's that beautiful." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Manzara satışın yarısıdır zaten, bakalım.\"", en: "\"The view is half the sale anyway, let's see.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Takipçi sayısı evin fiyatını etkilemiyor umarım.\"", en: "\"I hope the follower count doesn't affect the price of the house.\"" }, next: "enter", effects: { suspicion: 6 } },
          { id: "c", text: { tr: "\"Ben de bir kare çekeyim o zaman.\"", en: "\"I should take a shot too then.\"" }, next: "enter", effects: { fun: 14 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Gerçekten de teras güneye bakıyor, ışık müthiş.", en: "Indeed, the terrace faces south, the light is terrific." } },
          { speaker: "customer1", name: "Bengisu", text: { tr: "Akşamları burada oturup içki içmek başlı başına bir terapi, kamerayı bile bırakmak istemiyorum.", en: "Sitting here and having a drink in the evenings is therapy in itself, I don't even want to put the camera down." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bu tarz detaylar alıcıyı duygusal olarak bağlar.\"", en: "\"Details like this emotionally connect the buyer.\"" }, next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: { tr: "\"Estetik güzel de yapısal durumu nasıl?\"", en: "\"Aesthetics are nice, but what is the structural condition?\"" }, next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: { tr: "\"Bu terası görüp satın almayan çıkmaz herhalde.\"", en: "\"Everyone who sees this terrace probably buys it.\"" }, next: "surpriz", effects: { fun: 12 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Bengisu", text: { tr: "Geçen yıl teras yenilendi, statik raporu da var, merak etme — çekim yaparken sordurdum zaten.", en: "The terrace was renovated last year, and there is a static report, don't worry — I made sure to check while filming." } },
          { speaker: "emlah", text: { tr: "O zaman görüntü kadar sağlam bir yer de demek.", en: "So it means a place as solid as it is scenic." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Bengisu", text: { tr: "Fiyatta biraz oynayabiliriz, ama sen de beni etiketlersin değil mi? 😄", en: "We can play around with the price, but you'll tag me too, won't you? 😄" } }],
        choices: [
          { id: "a", text: { tr: "\"Tabii ki, %6 indirimle anlaşalım.\"", en: "\"Of course, let's agree with a 6% discount.\"" }, next: "closing_sold", effects: { closingBias: 26, suspicion: -4, discountPercent: 6, fun: 6 } },
          { id: "b", text: { tr: "\"Bir gün daha düşünmem lazım.\"", en: "\"I need to think another day.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Bu fiyat manzara için bile fazla, ciddi indirim şart.\"", en: "\"This price is too much even for a view, a serious discount is a must.\"" }, next: "closing_lost", effects: { closingBias: -24, suspicion: 12 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Bengisu", text: { tr: "(kamerayı kaldırır) Yaşasın! İlk gün batımı fotoğrafını bana da at, tamam mı?", en: "(lifting the camera) Yay! Send me the first sunset photo too, okay?" } }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Bengisu", text: { tr: "Tabii tabii, ben de bu arada başka kareler çekerim.", en: "Sure sure, I'll take other shots in the meantime." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Bengisu", text: { tr: "Aa, üzüldüm ama tamam, başka bir manzara buluruz sana.", en: "Ah, I'm sad but okay, we'll find you another view." } }],
        end: "lost",
      },
    },
  },
  {
    id: "bengisu-retro-vitrin-daire",
    title: "Retro Vitrin Daire", titleEn: "Retro Showcase Apartment",
    location: "Balat, renkli sokaklar", locationEn: "Balat, colorful streets",
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
          { speaker: "customer1", name: "Bengisu", text: { tr: "(kamerasını omzuna asar) Bu daireyi çekim için kiralamıştım, sahibi de satmak istiyor, seni aradım hemen.", en: "(slinging his camera over his shoulder) I had rented this apartment for a shoot, the owner wants to sell it too, I called you immediately." } },
          { speaker: "customer1", name: "Bengisu", text: { tr: "Cepheler o kadar renkli ki, sokak başlı başına bir set gibi.", en: "The facades are so colorful, the street is like a set in itself." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bu tarz dairelerin özel bir alıcı kitlesi vardır.\"", en: "\"Apartments like this have a special buyer audience.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Çekim için kiralık bir yer satılık olarak ne kadar gerçek?\"", en: "\"How real is a place rented for shoots when put up for sale?\"" }, next: "enter", effects: { suspicion: 8 } },
          { id: "c", text: { tr: "\"Balat her zaman enstantane malzemesi zaten.\"", en: "\"Balat is always snapshot material anyway.\"" }, next: "enter", effects: { fun: 12 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Eski dokuyu bozmadan yenilemişler, bu nadir bir denge.", en: "They renovated it without destroying the old texture, this is a rare balance." } },
          { speaker: "customer1", name: "Bengisu", text: { tr: "Sahibi de tam bunu istemiş, tarihi dokuya çok önem veriyor.", en: "The owner wanted exactly this, they care a lot about the historical texture." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bu denge evin değerini gerçekten yükseltir.\"", en: "\"This balance truly raises the value of the home.\"" }, next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: { tr: "\"Eski binalarda beklenmedik masraflar çıkabiliyor.\"", en: "\"Old buildings can bring unexpected expenses.\"" }, next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: { tr: "\"Bu daireyi kaç kere kare için kullandın?\"", en: "\"How many times did you use this apartment for a shot?\"" }, next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Bengisu", text: { tr: "(güler) Sayamadım artık, ama tesisatı geçen yıl tamamen yenilendi, merak etme.", en: "(smiling) I lost count, but the plumbing was completely renewed last year, don't worry." } },
          { speaker: "emlah", text: { tr: "O zaman görüntü kadar sağlam bir alt yapısı da var demek.", en: "So it means it has an infrastructure as solid as its appearance." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Bengisu", text: { tr: "Sahibi hızlı satmak istiyor, biraz esneklik olabilir.", en: "The owner wants a quick sale, there can be some flexibility." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, %8 indirimle hızlıca kapatalım.\"", en: "\"Agreed, let's close it quickly with an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 28, suspicion: -6, discountPercent: 8 } },
          { id: "b", text: { tr: "\"Yine de biraz daha düşünmek isterim.\"", en: "\"Still, I'd like to think a bit more.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Eski bina riski var, daha büyük bir indirim gerek.\"", en: "\"There is an old building risk, a bigger discount is needed.\"" }, next: "closing_lost", effects: { closingBias: -22, suspicion: 14 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Bengisu", text: { tr: "Harika! Taşınma gününü de çekim yapayım mı senden izinle 😄", en: "Awesome! Can I shoot your moving day with your permission 😄" } }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Bengisu", text: { tr: "Sorun değil, sahibine öyle iletirim.", en: "No problem, I'll pass it on to the owner." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Bengisu", text: { tr: "Sahibi bu kadar indirime razı olmayacaktır sanırım, üzgünüm.", en: "I suppose the owner won't agree to this much of a discount, sorry." } }],
        end: "lost",
      },
    },
  },
  {
    id: "alperen-ofis-ev-hybrid-loft",
    title: "Ofis-Ev Hybrid Loft", titleEn: "Office-Home Hybrid Loft",
    location: "Maslak, iş merkezine yürüme mesafesi", locationEn: "Maslak, walking distance to the business center",
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
          { speaker: "customer1", name: "Alperen", text: { tr: "(telefonundaki grafiğe bakarken başını kaldırmadan konuşur) Emlah dostum, kendi lofttumu satıyorum — yeni bir işe girişiyorum, nakit lazım.", en: "(speaking without lifting his head while looking at the chart on his phone) Estetan my friend, I'm selling my own loft — starting a new venture, I need cash." } },
          { speaker: "customer1", name: "Alperen", text: { tr: "Hem ev hem ofis olarak tasarladım, gerçek bir fırsat bu.", en: "I designed it as both home and office, this is a real opportunity." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Girişimcilikte cesaret önemli, yardımcı olayım.\"", en: "\"Courage is important in entrepreneurship, let me help.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Nakit lazım demek biraz aceleye getiriyorsun gibi.\"", en: "\"Needing cash sounds like you're rushing things.\"" }, next: "enter", effects: { suspicion: 8 } },
          { id: "c", text: { tr: "\"Yine yeni bir proje mi, seni hiç durdurmuyorlar 😄\"", en: "\"Another new project, they never stop you 😄\"" }, next: "enter", effects: { fun: 10 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Açık plan gerçekten hem çalışma hem yaşam alanı olarak kurgulanmış.", en: "The open plan is truly designed as both work and living space." } },
          { speaker: "customer1", name: "Alperen", text: { tr: "Aynen, video toplantısı yaparken arka planım bile hazır oluyor.", en: "Exactly, even my background is ready while having video meetings." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hibrit çalışanlar için bu çok cazip bir özellik.\"", en: "\"This is very attractive for hybrid workers.\"" }, next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: { tr: "\"Bu kadar hızlı satmak istemen beni tedirgin ediyor.\"", en: "\"Wanting to sell this fast makes me uneasy.\"" }, next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: { tr: "\"Yeni girişimin adı ne bu sefer?\"", en: "\"What is the name of your new venture this time?\"" }, next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Alperen", text: { tr: "(telefonu cebine atar) Söylemesi henüz erken ama sana ilk haber veririm, söz.", en: "(tossing his phone into his pocket) It's too early to tell, but I'll let you know first, I promise." } },
          { speaker: "emlah", text: { tr: "Tamam, o zaman şimdilik eve odaklanalım.", en: "Okay, then let's focus on the house for now." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Alperen", text: { tr: "Hızlı satmam lazım, senin için de iyi bir fırsat bu — ciddi bir indirim yapabilirim.", en: "I need to sell fast, this is a good opportunity for you too — I can offer a serious discount." } }],
        choices: [
          { id: "a", text: { tr: "\"Tamam, %9 indirimle hızlıca kapatalım.\"", en: "\"Okay, let's close it quickly with a 9% discount.\"" }, next: "closing_sold", effects: { closingBias: 30, suspicion: -4, discountPercent: 9 } },
          { id: "b", text: { tr: "\"Yine de acele etmeden düşünmek istiyorum.\"", en: "\"Still, I want to think without rushing.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Bu kadar acele satış bende güven uyandırmıyor.\"", en: "\"A rushed sale like this doesn't inspire confidence in me.\"" }, next: "closing_lost", effects: { closingBias: -25, suspicion: 16 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Alperen", text: { tr: "Süper! Bu para tam da ihtiyacım olan sermaye, sağ ol dostum.", en: "Super! This money is exactly the capital I need, thanks my friend." } }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Alperen", text: { tr: "Tamam ama çok bekleyemem, haber ver bana.", en: "Okay, but I can't wait too long, let me know." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Alperen", text: { tr: "Anlıyorum ama vaktim gerçekten yok, başka birine bakacağım.", en: "I understand, but I really don't have time, I'll look for someone else." } }],
        end: "lost",
      },
    },
  },
  {
    id: "alperen-yatirimci-dostu-studyo",
    title: "Yatırımcı Dostu Stüdyo", titleEn: "Investor-Friendly Studio",
    location: "Ataşehir, finans merkezine yakın", locationEn: "Ataşehir, close to the finance center",
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
          { speaker: "customer1", name: "Alperen", text: { tr: "(telefonda bir tabloyu kaydırarak gösterir) Bu sefer benim değil ama bir yatırımcı arkadaşımın stüdyosu — kiraya vermek isteyenler için ideal.", en: "(showing a table by swiping on his phone) This time it's not mine, but a studio of an investor friend — ideal for those looking to rent out." } },
          { speaker: "customer1", name: "Alperen", text: { tr: "Küçük ama kirası çok iyi, sayıları da hazırladım.", en: "It's small but has great rent, I've prepared the numbers too." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Sayılarla konuşan bir teklif her zaman ikna edicidir.\"", en: "\"An offer speaking with numbers is always convincing.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Sayıları sen mi hazırladın, biraz iyimser olabilir.\"", en: "\"Did you prepare the numbers yourself, it might be a bit optimistic.\"" }, next: "enter", effects: { suspicion: 8 } },
          { id: "c", text: { tr: "\"Sen de yüzde alıyorsun herhalde bu işten 😄\"", en: "\"You take a percentage from this deal too, I bet 😄\"" }, next: "enter", effects: { fun: 10 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Stüdyo küçük ama plan gerçekten verimli kullanılmış.", en: "The studio is small but the layout is utilized really efficiently." } },
          { speaker: "customer1", name: "Alperen", text: { tr: "Bölgede kira talebi de yüksek, boş kalma riski neredeyse yok.", en: "Rental demand in the region is also high, the risk of sitting vacant is almost none." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Düşük risk yüksek talep, klasik iyi yatırım.\"", en: "\"Low risk, high demand, classic good investment.\"" }, next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: { tr: "\"Bu iyimser tabloyu biraz daha sorgulamak isterim.\"", en: "\"I'd like to question this optimistic table a bit more.\"" }, next: "surpriz", effects: { suspicion: 10 } },
          { id: "c", text: { tr: "\"Sen bu işi bilseydin kendine alırdın herhalde.\"", en: "\"If you knew this business, you probably would have bought it yourself.\"" }, next: "surpriz", effects: { fun: 12 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Alperen", text: { tr: "(güler) Doğru itiraf edeyim, param olsa alırdım — ama şu an başka bir işe yatırıyorum.", en: "(smiling) I'll admit honestly, if I had the money I would have bought it — but right now I'm investing in another venture." } },
          { speaker: "emlah", text: { tr: "En azından dürüst konuştun, bu bana yeter.", en: "At least you spoke honestly, that's enough for me." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Alperen", text: { tr: "Fiyatta biraz oynayabiliriz, arkadaşımın da hızlı satması lazım.", en: "We can play around with the price, my friend needs to sell fast too." } }],
        choices: [
          { id: "a", text: { tr: "\"Tamam, %7 indirimle ilerleyelim.\"", en: "\"Okay, let's proceed with a 7% discount.\"" }, next: "closing_sold", effects: { closingBias: 26, suspicion: -6, discountPercent: 7 } },
          { id: "b", text: { tr: "\"Kira rakamlarını kendim de kontrol etmek isterim.\"", en: "\"I'd like to check the rental figures myself.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Bu sayılar bana gerçekçi gelmiyor, pas geçiyorum.\"", en: "\"These numbers don't feel realistic to me, I'm passing.\"" }, next: "closing_lost", effects: { closingBias: -22, suspicion: 12 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Alperen", text: { tr: "Harika, arkadaşıma haber veriyorum hemen.", en: "Great, I'm letting my friend know right away." } }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Alperen", text: { tr: "Mantıklı, ben de sana güncel rakamları gönderirim.", en: "Makes sense, I'll send you the current figures as well." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Alperen", text: { tr: "Tamam, arkadaşıma başka alıcı bakmasını söylerim.", en: "Alright, I'll tell my friend to look for another buyer." } }],
        end: "lost",
      },
    },
  },
  {
    id: "duru-sessiz-bahce-kati",
    title: "Sessiz Bahçe Katı", titleEn: "Quiet Garden Floor",
    location: "Bahçeşehir, yeşil alana sınır", locationEn: "Bahçeşehir, bordering green area",
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
          { speaker: "customer1", name: "Duru", text: { tr: "(sakin bir sesle, ellerini kavuşturmuş) Emlah, biliyorsun yurt dışına taşınıyorum — kendi evimi sana bırakmak istiyorum.", en: "(in a calm voice, with hands clasped) Estetan, you know I'm moving abroad — I want to leave my own house to you." } },
          { speaker: "customer1", name: "Duru", text: { tr: "Bahçe katı, çok sessiz, uzun nöbetlerden sonra beni hep dinlendirdi burası.", en: "Garden floor, very quiet, it always rested me after long shifts." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Huzurlu bir ev her zaman değerlidir, hemen bakalım.\"", en: "\"A peaceful home is always valuable, let's check it immediately.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Bu kadar aceleyle taşınman biraz düşündürücü.\"", en: "\"Moving this hastily makes me think a bit.\"" }, next: "enter", effects: { suspicion: 6 } },
          { id: "c", text: { tr: "\"Sonunda maceraya atılıyorsun demek!\"", en: "\"You're finally embarking on an adventure!\"" }, next: "enter", effects: { fun: 10 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Gerçekten de dışarıdan hiç trafik sesi gelmiyor.", en: "Indeed, no traffic noise comes from outside at all." } },
          { speaker: "customer1", name: "Duru", text: { tr: "Bahçeyi de kendim düzenledim, ilk baharda çiçek açıyor her yer.", en: "I landscaped the garden myself, everything blooms in early spring." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bu tarz sakinlik özellikle yorgun profesyonelleri çeker.\"", en: "\"Calmness like this especially attracts tired professionals.\"" }, next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: { tr: "\"Bahçe katı olunca nem sorunu olur mu diye merak ediyorum.\"", en: "\"I wonder if there is a moisture problem since it's a garden floor.\"" }, next: "surpriz", effects: { suspicion: 8 } },
          { id: "c", text: { tr: "\"Çiçekleri kim sulayacak sen gidince?\"", en: "\"Who will water the flowers when you leave?\"" }, next: "surpriz", effects: { fun: 8 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Duru", text: { tr: "Su yalıtımı geçen yıl yenilendi, nem hiç sorun olmadı hiçbir zaman.", en: "Water insulation was renewed last year, moisture was never an issue at all." } },
          { speaker: "emlah", text: { tr: "O zaman gerçekten bakımlı ve sağlam bir yer.", en: "Then it's truly a well-maintained and solid place." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Duru", text: { tr: "Fiyatta esnek olabilirim, sadece iyi birine gitsin istiyorum.", en: "I can be flexible on price, I just want it to go to a good person." } }],
        choices: [
          { id: "a", text: { tr: "\"Söz veriyorum, burayı iyi bir yuva yapacağım — %7 indirimle anlaşalım.\"", en: "\"I promise, I'll make this a good home — let's agree with a 7% discount.\"" }, next: "closing_sold", effects: { closingBias: 28, suspicion: -8, discountPercent: 7 } },
          { id: "b", text: { tr: "\"Biraz daha düşünmek isterim.\"", en: "\"I'd like to think a bit more.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Fiyat hâlâ biraz yüksek geliyor bana.\"", en: "\"The price still feels a bit high to me.\"" }, next: "closing_lost", effects: { closingBias: -20, suspicion: 10 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Duru", text: { tr: "(gülümser) Teşekkür ederim Emlah, içim rahat şimdi. İyi bakarsın biliyorum.", en: "(smiling) Thank you Estetan, my mind is at ease now. I know you'll take good care of it." } }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Duru", text: { tr: "Elbette, acele etme, ben de son güne kadar buradayım.", en: "Of course, don't rush, I'm here until the last day too." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Duru", text: { tr: "Anlıyorum, umarım burayı hak eden birini bulurum.", en: "I understand, I hope I find someone who deserves this place." } }],
        end: "lost",
      },
    },
  },
  {
    id: "duru-huzurlu-manzarali-ev",
    title: "Huzurlu Manzaralı Ev", titleEn: "Peaceful House with a View",
    location: "Çekmeköy, orman sınırında", locationEn: "Çekmeköy, at the forest border",
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
          { speaker: "customer1", name: "Duru", text: { tr: "(forması hâlâ üzerinde, nöbetten yeni çıkmış gibi) Bu ev bir meslektaşımın — hastanede beraber çalışıyoruz, o da vardiyalardan yorgun.", en: "(scrubs still on, looking like just off a shift) This house belongs to a colleague — we work together at the hospital, they're also tired from shifts." } },
          { speaker: "customer1", name: "Duru", text: { tr: "Orman manzarası var, sabahları kuş sesiyle uyanıyormuş.", en: "It has a forest view, waking up to birdsong in the mornings." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Doğayla iç içe evler her zaman kıymetlidir.\"", en: "\"Homes intertwined with nature are always precious.\"" }, next: "enter", effects: { interest: 10 } },
          { id: "b", text: { tr: "\"Orman sınırı demek ulaşım biraz zor olabilir.\"", en: "\"Forest border means transportation might be a bit difficult.\"" }, next: "enter", effects: { suspicion: 6 } },
          { id: "c", text: { tr: "\"Siz hemşireler hep birbirinize ev mi buluyorsunuz 😄\"", en: "\"Do you nurses always find houses for each other 😄\"" }, next: "enter", effects: { fun: 10 } },
        ],
      },
      enter: {
        id: "enter",
        lines: [
          { speaker: "emlah", text: { tr: "Gerçekten sessiz, sadece kuş sesleri var.", en: "Truly quiet, there are only birdsongs." } },
          { speaker: "customer1", name: "Duru", text: { tr: "Meslektaşım burada gerçekten toparlandığını söylemişti, uzun nöbetlerden sonra.", en: "My colleague had said they truly recovered here, after long shifts." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Bu tarz bir huzur her alıcıyı etkiler.\"", en: "\"Peace like this affects every buyer.\"" }, next: "surpriz", effects: { interest: 12 } },
          { id: "b", text: { tr: "\"Ulaşım gerçekten sorun olur mu emin misin?\"", en: "\"Are you sure transportation isn't really a problem?\"" }, next: "surpriz", effects: { suspicion: 8 } },
          { id: "c", text: { tr: "\"Belki ben de bu işten bir ev kaparım nöbetlerden sonra.\"", en: "\"Maybe I'll grab a house from this business too after my shifts.\"" }, next: "surpriz", effects: { fun: 10 } },
        ],
      },
      surpriz: {
        id: "surpriz",
        lines: [
          { speaker: "customer1", name: "Duru", text: { tr: "Ana yola on dakika, aslında göründüğü kadar uzak değil.", en: "Ten minutes to the main road, actually not as far as it looks." } },
          { speaker: "emlah", text: { tr: "O zaman huzur ile ulaşım arasında iyi bir denge var.", en: "Then there is a good balance between peace and transportation." } },
        ],
        next: "price",
      },
      price: {
        id: "price",
        lines: [{ speaker: "customer1", name: "Duru", text: { tr: "Meslektaşım hızlı satmak istiyor, fiyatta biraz alan var.", en: "My colleague wants a quick sale, there is some room in the price." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, %6 indirimle ilerleyelim.\"", en: "\"Agreed, let's proceed with a 6% discount.\"" }, next: "closing_sold", effects: { closingBias: 25, suspicion: -6, discountPercent: 6 } },
          { id: "b", text: { tr: "\"Bir kez daha bakmak isterim, düşüneyim.\"", en: "\"I'd like to look at it once more, let me think.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
          { id: "c", text: { tr: "\"Ulaşım riski varsa fiyat daha da düşmeli.\"", en: "\"If there's a transportation risk, the price should drop further.\"" }, next: "closing_lost", effects: { closingBias: -20, suspicion: 10 } },
        ],
      },
      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", name: "Duru", text: { tr: "Meslektaşım çok sevinecek, teşekkürler Emlah.", en: "My colleague will be very happy, thanks Estetan." } }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", name: "Duru", text: { tr: "Tabii, ona da öyle iletirim, bekleriz seni.", en: "Sure, I'll pass it on to them, we'll wait for you." } }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", name: "Duru", text: { tr: "Anlıyorum, meslektaşıma başka bir yol düşünürüz.", en: "I understand, we'll think of another way for my colleague." } }],
        end: "lost",
      },
    },
  },
];

export function friendHouseById(id: string): HouseScene | undefined {
  return friendHouses.find((h) => h.id === id);
}
