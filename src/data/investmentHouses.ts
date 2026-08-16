import type { HouseScene } from "../types";

/**
 * "Yatırım Evleri" pool — properties Emlah can buy with his own money and
 * later resell for a profit, instead of just earning commission on someone
 * else's sale. Reuses the exact same HouseScene shape (and therefore the
 * same DialogueScene/ContractModal engine, via PremiumHouseScene) as the
 * main and premium house pools — completely isolated from `results`/
 * `houseOrder`, so it can never disturb week grouping or the core scoring
 * math. `askingPrice` here is the BASE price before the active market-news
 * modifier (see data/marketNews.ts) is applied at purchase/resale time.
 *
 * Every house uses `dynamicCast: [{}]` — a single buyer drawn randomly from
 * the full shared character pool (see characterPool.ts) at game start, same
 * as any other dynamicCast house, so no dedicated art/characters are needed
 * for the buyers themselves. Every house follows the same six-node shape
 * (start -> detay -> closing -> closing_sold/thinking/lost) for engine
 * consistency, with distinct flavor text per house's "quirk".
 */
export const investmentHouses: HouseScene[] = [
  {
    id: "yatirim-vapuriskelesi",
    title: "Vapur İskelesi Manzaralı Çatı Katı",
    location: "Kadıköy, çatı katı",
    customerNames: ["Alıcı"],
    background: "placeholder-house-1",
    askingPrice: 4200000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. İlanda \"deniz manzaralı\" yazıyordu ama pencereden vapur iskelesi görüyorum." },
          { speaker: "customer1", text: "Vapur düdüğü de eksik olmuyor galiba, değil mi?" },
        ],
        choices: [
          { id: "a", text: "\"Boğaz değil ama gün boyu canlı bir manzara, alışırsınız.\"", next: "start_a", effects: { interest: 8, suspicion: 5 } },
          { id: "b", text: "\"Doğru, düdük sesi oluyor, açıkçası ilk hafta biraz alışmak lazım.\"", next: "start_b", effects: { fun: 8 } },
          { id: "c", text: "\"Vapur saatlerini ezbere bilirsiniz, kendi saatiniz gibi olur.\"", next: "start_c", effects: { interest: 5, fun: 5 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Hmm, \"alışırsınız\" derken biraz zorlanacağımı düşünüyorum galiba." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olduğunuz için teşekkürler, en azından bilerek karar veririm." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Kendi saatim gibi olması hoşuma gitti doğrusu." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Vapur seferlerini düşününce fiyatta biraz oynayabilir miyiz?" }],
        choices: [
          { id: "a", text: "\"Bu fiyat gayet net, bu değerin altına inmem.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir rakam söyleyin, birlikte bir yere varalım.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Vapur gürültüsüne karşılık ufak bir indirim düşünebilirim.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Anladım, sanırım karar vermem gerekiyor." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla imzaya geçelim.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, kafanız rahat karar verin.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Tamam, anlaştık — sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünmemiz lazım, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-terzidukkani",
    title: "Terzi Dükkanı Üstü Daire",
    location: "Nişantaşı, 2. kat",
    customerNames: ["Alıcı"],
    background: "placeholder-house-2",
    askingPrice: 5500000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Alt kattaki terzi dükkanının sesleri buraya geliyor mu acaba?" },
          { speaker: "customer1", text: "Dikiş makinesi sesiyle uyumak istemem açıkçası." },
        ],
        choices: [
          { id: "a", text: "\"Hiç gelmiyor, ses yalıtımı gayet iyi.\"", next: "start_a", effects: { interest: 8, suspicion: 8 } },
          { id: "b", text: "\"Hafif geliyor ama gece değil, mesai saatlerinde.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Terzi ustayla tanışın isterseniz, çok sevimli biri.\"", next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, çünkü gece işim var, dinlenmem lazım." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Mesai saatinde olması iş yerinde olacağım için sorun değil aslında." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Komşuyla tanıştırmanız hoşuma gitti, sıcak bir yaklaşım." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Dikiş sesine katlanacaksam fiyatta bir şey yapalım." }],
        choices: [
          { id: "a", text: "\"Bu fiyat gayet adil, indirime gerek yok.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklif getirin, konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir esneklik olabilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar vermem gerekiyor galiba." }],
        choices: [
          { id: "a", text: "\"Tamam, bu şartlarla anlaşalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"İsterseniz biraz daha düşünün.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, döneriz size." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Bu bana göre değilmiş sanırım, teşekkürler." }], end: "lost" },
    },
  },

  {
    id: "yatirim-kapalikuyu",
    title: "Bahçeli Müstakil (Kuyusu Kapalı)",
    location: "Beykoz, bahçeli",
    customerNames: ["Alıcı"],
    background: "placeholder-house-3",
    askingPrice: 6800000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Bahçedeki o beton kapatılmış kısım nedir, kuyu mu var altında?" },
          { speaker: "customer1", text: "Komşular hâlâ su çekildiğini söylüyor, doğru mu?" },
        ],
        choices: [
          { id: "a", text: "\"Kesinlikle değil, o sadece eski bir zemin dolgusu.\"", next: "start_a", effects: { interest: 5, suspicion: 12 } },
          { id: "b", text: "\"Eskiden kuyuymuş, güvenlik için kapattırdım.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Mahalle efsanesi biraz abartılıyor ama evet, altında bir kuyu var.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Hmm, komşular başka türlü anlatıyor ama sizin sözünüze güveneyim." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Güvenlik için kapatmanız iyi olmuş, mantıklı bir sebep." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Mahalle efsaneleri her zaman ilginçtir, hoşuma gitti bu." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "O kuyu hikayesinden sonra fiyatta esneklik beklerim doğrusu." }],
        choices: [
          { id: "a", text: "\"Bu fiyat net, bahçe büyük, altına inmem.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklifle konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir indirim mümkün olabilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar vermemiz lazım galiba." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım o zaman.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, düşünme hakkınız var.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeye geçelim." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Kuyu meselesini biraz daha düşünmemiz lazım." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Açıkçası o kuyu fikri içimi rahatsız etti, vazgeçiyorum." }], end: "lost" },
    },
  },

  {
    id: "yatirim-sinemakomsulugu",
    title: "Sinema Salonu Komşuluğu",
    location: "Beyoğlu, 3. kat",
    customerNames: ["Alıcı"],
    background: "placeholder-house-4",
    askingPrice: 4900000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Yan binada eski bir sinema var galiba, hafta sonları film müziği duyulur mu?" },
          { speaker: "customer1", text: "Sinemayı severim ama sürekli duymak istemem." },
        ],
        choices: [
          { id: "a", text: "\"Hiç duyulmaz, bina yalıtımı gayet sağlam.\"", next: "start_a", effects: { interest: 8, suspicion: 8 } },
          { id: "b", text: "\"Hafta sonları hafif duyuluyor, doğrusu bu.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Duyulur ama bedava film müziği gibi düşünün, hoş bir şey.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, çünkü sessizlik benim için önemli." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst cevap için teşekkürler, hafif olması bende sorun yaratmaz." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bedava film müziği demeniz hoşuma gitti, bakış açınızı beğendim." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Film müziğine katlanacaksam biraz indirim hak ediyorum sanki." }],
        choices: [
          { id: "a", text: "\"Bu fiyat net, bu değerin altına inmem.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklif getirin, konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Küçük bir esneklik gösterebilirim.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar anı geldi sanırım." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla ilerleyelim.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, sinemaya da alışırsınız zamanla.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-balikcibarinagi",
    title: "Balıkçı Barınağı Manzaralı Stüdyo",
    location: "Sarıyer, sahil",
    customerNames: ["Alıcı"],
    background: "placeholder-house-5",
    askingPrice: 3600000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Sabah 5'te ağ toplama sesleri geliyor diye duydum, doğru mu?" },
          { speaker: "customer1", text: "Erken kalkmayı sevmem açıkçası." },
        ],
        choices: [
          { id: "a", text: "\"Hiç öyle bir şey yok, gayet sakin bir sokak.\"", next: "start_a", effects: { interest: 8, suspicion: 10 } },
          { id: "b", text: "\"Doğru, ama karşılığında taze balık şansı yüksek.\"", next: "start_b", effects: { fun: 8 } },
          { id: "c", text: "\"Balıkçılarla tanışırsanız kahvaltıya balık bile gelir bazen.\"", next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, çünkü uyku düzenim çok hassas." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "(güler) Taze balık iyi bir telafi olabilir doğrusu." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "Bu beni gerçekten güldürdü, komşuluk hoşuma gider." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Sabah 5 gürültüsüne karşılık fiyatta bir şey yapabilir misiniz?" }],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, taze balık bunun bedeli zaten.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir rakam söyleyin, konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir esneklik olabilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Sanırım karar vermem lazım." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Düşünün istediğiniz kadar, acelemiz yok.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Erken saatleri biraz daha düşünmemiz lazım." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım erken kalkmaya hazır değilim, vazgeçiyorum." }], end: "lost" },
    },
  },

  {
    id: "yatirim-eskihan",
    title: "Eski Han'ın Üst Katı",
    location: "Eminönü, tarihi han",
    customerNames: ["Alıcı"],
    background: "placeholder-house-6",
    askingPrice: 7400000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Zemin katta hâlâ küçük atölyeler var galiba, asansör de yok diye duydum." },
          { speaker: "customer1", text: "Merdiven kaç kat, dizlerim buna dayanır mı bilmiyorum." },
        ],
        choices: [
          { id: "a", text: "\"Sadece 2 kat, hiç sorun olmaz.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Asansör gerçekten yok ama tarihi doku buna değer.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Merdiven biraz spor sayılır, günde birkaç kere iner çıkarsınız.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, çünkü merdivenle aram hiç iyi değil." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Tarihi doku dediniz, bu beni ikna edebilir açıkçası." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu yaklaşımı beğendim, olumlu bakmaya çalışayım." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Asansörsüz bu kat için fiyatta biraz oynayabilir miyiz?" }],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, bu asansörsüz katı gösteren pek olmaz.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklif getirin, konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir esneklik olabilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar vermem gerekiyor sanırım." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla imzalayalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, merdivenleri bir daha deneyin isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Merdiven meselesini biraz daha düşünmemiz lazım." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım dizlerim buna razı olmayacak, vazgeçiyorum." }], end: "lost" },
    },
  },

  {
    id: "yatirim-catibahce",
    title: "Duplex — Çatı Bahçeli",
    location: "Etiler, duplex",
    customerNames: ["Alıcı"],
    background: "placeholder-house-7",
    askingPrice: 9200000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Çatıdaki sera naylonu rüzgarda hep uçuyormuş diye duydum." },
          { speaker: "customer1", text: "Bahçıvanlık hobim var, ciddiye alıyorum bunu." },
        ],
        choices: [
          { id: "a", text: "\"Hiç öyle bir şey yok, sera gayet sağlam sabitli.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Doğru, rüzgarlı günlerde biraz uçuşuyor, sabitlemek gerekebilir.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"O naylon sesi bile çatı bahçesinin karakteri oldu artık.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, bahçem için ciddi planlarım var." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olmanız iyi, sabitleme benim için sorun değil." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu bakış açısını sevdim, karakterli bir yer arıyordum zaten." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Sera bakımını düşününce fiyatta bir esneklik olur mu?" }],
        choices: [
          { id: "a", text: "\"Bu fiyat net, çatı bahçesi bu fiyatı hak ediyor.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklifle konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir indirim mümkün olabilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Artık karar vermem lazım galiba." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, bahçeyi bir kez daha gezin isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Sera meselesini biraz daha düşünmemiz lazım." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bahçe planlarıma uymuyor, vazgeçiyorum." }], end: "lost" },
    },
  },

  {
    id: "yatirim-meyhaneustu",
    title: "Meyhane Üstü Daire",
    location: "Kadıköy, Kadife Sokak",
    customerNames: ["Alıcı"],
    background: "placeholder-house-8",
    askingPrice: 4100000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Cuma-cumartesi geceleri canlı müzik oluyormuş diye duydum, doğru mu?" },
          { speaker: "customer1", text: "Erken yatarım genelde, bu beni endişelendiriyor." },
        ],
        choices: [
          { id: "a", text: "\"Hiç olmuyor, cadde gayet sakin.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Doğru, hafta sonları biraz canlı oluyor.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Canlı müzik oluyor ama komşuluk da o kadar eğlenceli, hiç yalnız kalmazsınız.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, sessizlik benim için önemli." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olmanız iyi, hafta sonu için kulak tıkacı alırım o zaman." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu yaklaşımı sevdim, belki de tam aradığım şey bu." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Hafta sonu gürültüsüne karşılık fiyatta ne yapabiliriz?" }],
        choices: [
          { id: "a", text: "\"Bu fiyat net, komşuluk bonus sayılır zaten.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir rakamla gelin, oturup konuşalım.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir esneklik olabilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar vermem gerekiyor sanırım." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla ilerleyelim.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, bir cumartesi gecesi de deneyimleyin isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Gece gürültüsünü biraz daha düşünmemiz lazım." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım erken yatan biri için uygun değil, vazgeçiyorum." }], end: "lost" },
    },
  },

  {
    id: "yatirim-kutuphaneyani",
    title: "Kütüphane Yanı Sessiz Ev",
    location: "Beyazıt, kütüphane bitişiği",
    customerNames: ["Alıcı"],
    background: "placeholder-house-9",
    askingPrice: 5000000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Kütüphane bitişiğinde olması sessizlik garantisi mi demek?" },
          { speaker: "customer1", text: "Ben çalışırken kesinlikle sessizlik isterim." },
        ],
        choices: [
          { id: "a", text: "\"Kesinlikle, buradan bir çıt bile çıkmaz.\"", next: "start_a", effects: { interest: 5, suspicion: 8 } },
          { id: "b", text: "\"Genelde sessiz ama gece geç saatte ışık yakmak bile suç gibi geliyor açıkçası.\"", next: "start_b", effects: { fun: 8 } },
          { id: "c", text: "\"Sessizlik konusunda kütüphane sizin en sıkı denetçiniz olur.\"", next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Bu tam istediğim şey, harika." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "(güler) Bu detayı paylaşmanız hoşuma gitti, dürüstlüğünüzü beğendim." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "Bu espri hoşuma gitti, ciddi bir çalışma ortamı arıyordum zaten." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Bu sessizliğin bir bedeli var herhalde, fiyatta esner misiniz?" }],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, sessizlik burada pazarlık konusu olmaz.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklifle gelin, değerlendiririm.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Küçük bir indirim düşünülebilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar anı geldi sanırım." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, sessizce düşünün.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-tramvayhatti",
    title: "Tramvay Hattı Kenarı",
    location: "Beyoğlu, İstiklal",
    customerNames: ["Alıcı"],
    background: "placeholder-house-10",
    askingPrice: 6100000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Nostaljik tramvay geçerken pencereler titriyor mu gerçekten?" },
          { speaker: "customer1", text: "Biraz hafif titriyorsa sorun etmem ama emin olmak istiyorum." },
        ],
        choices: [
          { id: "a", text: "\"Hayır, hiç hissedilmiyor bile.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Hafifçe titriyor, doğrusu bu.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"O titreşim İstiklal'de yaşadığınızı her gün hatırlatır, ben severim.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, hassas biriyimdir bu konularda." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olmanız iyi, hafif titreşim sorun değil benim için." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu bakış açısını beğendim, nostaljik bir taraf var bende." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Titreşime karşılık fiyatta bir esneklik olur mu?" }],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, bu güzergahı bulmak kolay değil.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir rakam söyleyin, konuşalım.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir esneklik olabilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Sanırım karar vermem lazım." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla imzalayalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, bir tramvay daha geçsin bakalım.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Titreşim meselesini biraz daha düşünmemiz lazım." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-caybahcesi",
    title: "Çay Bahçesi Manzaralı Ev",
    location: "Üsküdar, sahil",
    customerNames: ["Alıcı"],
    background: "placeholder-house-11",
    askingPrice: 3900000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Pencereden meşhur bir çay bahçesi görünüyormuş, tavla sesleri rahatsız eder mi?" },
          { speaker: "customer1", text: "Ben sakin bir yer arıyorum açıkçası." },
        ],
        choices: [
          { id: "a", text: "\"Hiç duyulmaz, çok yüksekte kalıyorsunuz.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Akşamları hafif duyuluyor, doğrusu bu.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Tavla sesleri aslında güzel bir arka plan müziği gibi, alışırsınız.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, sakinlik benim için önemli." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olmanız iyi, akşamları dışarıda olurum zaten genelde." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu bakış açısını sevdim, belki gerçekten alışırım." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Tavla seslerine karşılık fiyatta bir şey yapabilir misiniz?" }],
        choices: [
          { id: "a", text: "\"Bu fiyat net, manzara bu fiyatı hak ediyor.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklifle gelin, konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Küçük bir esneklik gösterebilirim.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar vermem gerekiyor galiba." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, bir çay içip düşünün isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-fabrikaloft",
    title: "Restore Edilmiş Fabrika Dairesi",
    location: "Kağıthane, loft",
    customerNames: ["Alıcı"],
    background: "placeholder-house-12",
    askingPrice: 8500000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Tavan çok yüksek diye duydum, ısıtma faturası da öyle mi?" },
          { speaker: "customer1", text: "Kış aylarını merak ediyorum açıkçası." },
        ],
        choices: [
          { id: "a", text: "\"Hiç değil, izolasyon yenilendi, gayet normal.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Doğru, yüksek tavan biraz fatura demek, dürüst olayım.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Yüksek tavan karşılığında muhteşem bir ses yankısı kazanıyorsunuz.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, kışın fatura beni çok üzer." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olmanızı takdir ediyorum, bunu göze alabilirim." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu detayı sevdim, müzikle uğraşırım aslında." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Isıtma faturasını düşününce fiyatta esneklik beklerim." }],
        choices: [
          { id: "a", text: "\"Bu fiyat net, restorasyon bu fiyatı hak ediyor.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir rakam söyleyin, birlikte bakalım.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir indirim düşünülebilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Artık karar vermem lazım sanırım." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla ilerleyelim.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, kışı bir düşünün isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Fatura konusunu biraz daha düşünmemiz lazım." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bütçeme uymuyor, vazgeçiyorum." }], end: "lost" },
    },
  },

  {
    id: "yatirim-minaregolgesi",
    title: "Minare Gölgesi",
    location: "Fatih, cami yanı",
    customerNames: ["Alıcı"],
    background: "placeholder-house-1",
    askingPrice: 3300000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Cami çok yakınmış, ezan sesi ne kadar net geliyor?" },
          { speaker: "customer1", text: "Sabah namazına alarm kurmam gerekir mi merak ediyorum." },
        ],
        choices: [
          { id: "a", text: "\"Çok hafif geliyor, neredeyse hiç duyulmaz.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Gayet net geliyor, alarma gerek kalmaz doğrusu.\"", next: "start_b", effects: { fun: 8 } },
          { id: "c", text: "\"Ezan sesiyle uyanmak bazıları için huzur verici oluyor.\"", next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, hafif uyuyan biriyim." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "(güler) Bu iyi bir haber, alarm kurmayı unuturum genelde." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "Bu güzel bir bakış açısı, huzurlu bir yer arıyordum zaten." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Ezan sesine karşılık fiyatta bir esneklik olur mu?" }],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, bu huzuru ucuza satmam.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklifle gelin, konuşalım.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Küçük bir indirim mümkün olabilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar vermem gerekiyor sanırım." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, bir sabah ezanını dinleyin isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-marinamanzarali",
    title: "Marina Manzaralı Daire",
    location: "Ataköy, marina",
    customerNames: ["Alıcı"],
    background: "placeholder-house-2",
    askingPrice: 7900000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Yatlar güzel duruyor ama komşular biraz havalı mı burada?" },
          { speaker: "customer1", text: "\"Captain\" diye hitap edilmeyi beklerler mi mesela?" },
        ],
        choices: [
          { id: "a", text: "\"Hiç öyle değil, gayet samimi bir komşuluk var.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Açıkçası biraz havalı bir hava var, dürüst olayım.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Siz de bir tekne alırsanız kısa sürede \"captain\" olursunuz, sorun değil.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, gösterişten hoşlanmam." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olmanızı takdir ediyorum, idare ederim herhalde." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu espri hoşuma gitti, belki gerçekten bir tekne alırım." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Bu manzaraya karşılık fiyatta bir şey yapabilir misiniz?" }],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, bu manzarayı başka yerde bulamazsınız.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir rakam söyleyin, değerlendiririm.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir esneklik gösterebilirim.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Sanırım karar vermem lazım." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla imzalayalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, bir tekne turu da atın isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu çevre bana göre değil, vazgeçiyorum." }], end: "lost" },
    },
  },

  {
    id: "yatirim-kuyumcularcarsisi",
    title: "Kuyumcular Çarşısı Üstü",
    location: "Kapalıçarşı yakını",
    customerNames: ["Alıcı"],
    background: "placeholder-house-3",
    askingPrice: 6700000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Alt katta kuyumcular var diye duydum, güvenlik kamerası sayısı ev sayısından fazla mı gerçekten?" },
          { speaker: "customer1", text: "Güvenlik konusunda hassasımdır." },
        ],
        choices: [
          { id: "a", text: "\"Abartılıyor, birkaç kamera var sadece.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Doğru sayılır, dürüst olayım, bölge çok sıkı korunuyor.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Bu kadar kamera varken hırsız değil turist bile giremez.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, güvenlik önceliğim." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olmanızı takdir ediyorum, bu aslında bir avantaj bence." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu bakış açısını sevdim, güvenlik konusunda rahatlarım." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Bunca kameraya karşılık fiyatta bir esneklik olur mu?" }],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, bu güvenlik seviyesi nadir bulunur.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklifle gelin, konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Küçük bir indirim düşünülebilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar vermem gerekiyor galiba." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, kameraları bir daha sayın isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-plakdukkani",
    title: "Vintage Plak Dükkanı Komşuluğu",
    location: "Kadıköy, Moda",
    customerNames: ["Alıcı"],
    background: "placeholder-house-4",
    askingPrice: 4400000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Alt kattan sürekli eski plak sesleri geliyormuş, doğru mu?" },
          { speaker: "customer1", text: "Müzik zevkim biraz özeldir, uyar mı bilmiyorum." },
        ],
        choices: [
          { id: "a", text: "\"Hiç gelmiyor, ses yalıtımı gayet iyi.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Geliyor, bazen tanıdık bazen tuhaf parçalar çalıyor dürüst olayım.\"", next: "start_b", effects: { fun: 8 } },
          { id: "c", text: "\"Aşağıdaki dükkan sahibiyle tanışın, plak zevkiniz genişleyebilir.\"", next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, sessiz çalışmam lazım genelde." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "(güler) \"Tuhaf parçalar\" demeniz ilgimi çekti açıkçası." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "Bu güzel bir öneri, müzik zevkimi genişletmek hiç fena olmaz." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Plak sesine karşılık fiyatta bir şey yapabilir misiniz?" }],
        choices: [
          { id: "a", text: "\"Fiyat net, bu semt ruhu zaten bir bedel.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir rakam söyleyin, oturup konuşalım.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir esneklik gösterebilirim.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Artık karar vermem lazım sanırım." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla ilerleyelim.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, birkaç plak dinleyip düşünün isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-sukemerleri",
    title: "Tarihi Su Kemerleri Manzaralı",
    location: "Fatih, Bozdoğan Kemeri yakını",
    customerNames: ["Alıcı"],
    background: "placeholder-house-5",
    askingPrice: 5300000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Pencereden antik su kemerleri görünüyormuş, tarih meraklısıyımdır ben." },
          { speaker: "customer1", text: "Ev gösterirken tarih dersi de veriyor musunuz?" },
        ],
        choices: [
          { id: "a", text: "\"Gerekmiyor, sadece manzara olarak duruyor.\"", next: "start_a", effects: { interest: 5, suspicion: 5 } },
          { id: "b", text: "\"Açıkçası her seferinde biraz tarih anlatmadan geçemiyorum.\"", next: "start_b", effects: { fun: 8 } },
          { id: "c", text: "\"İsterseniz kemerin hikayesini de anlatayım, uzun ama ilginç.\"", next: "start_c", effects: { interest: 8, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Anladım, ben yine de kendim araştırırım o zaman." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "(güler) Bu benim için artı bir puan, tarih anlatan bir emlakçı görmedim." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "Lütfen anlatın, tam da bunun için buradayım." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Turist kalabalığına karşılık fiyatta esner misiniz?" }],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, bu tarihi manzarayı ucuza satmam.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklifle gelin, değerlendiririm.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Küçük bir indirim mümkün olabilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar anı geldi sanırım." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, kemerleri bir kez daha görün isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-simitfirini",
    title: "Simit Fırını Komşuluğu",
    location: "Karaköy, meydan kenarı",
    customerNames: ["Alıcı"],
    background: "placeholder-house-6",
    askingPrice: 3700000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Alt katta simit fırını var diye duydum, sabah 5'te açılıyormuş." },
          { speaker: "customer1", text: "O saatte koku beni uyandırır mı acaba?" },
        ],
        choices: [
          { id: "a", text: "\"Hiç uyandırmaz, koku dışarı yayılmıyor.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Doğrusu koku hafif geliyor, dürüst olayım.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Simit kokusuyla uyanmak var ya, bu bir lüks aslında.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, erken uyanmak istemiyorum." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olmanızı takdir ediyorum, idare ederim sanırım." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu bakış açısını sevdim, açıkçası simide bayılırım." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Sabah kokusuna karşılık fiyatta bir şey yapabilir misiniz?" }],
        choices: [
          { id: "a", text: "\"Fiyat net, simit kokusu zaten bedava bir lüks.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir rakam söyleyin, konuşalım.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir esneklik gösterebilirim.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Sanırım karar vermem lazım." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla imzalayalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, bir simit alıp düşünün isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Erken saatleri biraz daha düşünmemiz lazım." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım erken kalkmaya hazır değilim, vazgeçiyorum." }], end: "lost" },
    },
  },

  {
    id: "yatirim-surduvari",
    title: "Antik Sur Duvarı Bitişiği",
    location: "Yedikule, sur içi",
    customerNames: ["Alıcı"],
    background: "placeholder-house-7",
    askingPrice: 4600000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Bahçe duvarının bir kısmı gerçekten Bizans suru mu, yoksa efsane mi bu?" },
          { speaker: "customer1", text: "Tapu dairesi bile şaşırmış diye duydum." },
        ],
        choices: [
          { id: "a", text: "\"Kesinlikle gerçek, belgeleri de mevcut.\"", next: "start_a", effects: { interest: 8, suspicion: 5 } },
          { id: "b", text: "\"Doğru, tapu dairesi de ilk başta inanmadı açıkçası.\"", next: "start_b", effects: { fun: 8 } },
          { id: "c", text: "\"Kendi bahçenizde bin yıllık tarih olması fena bir hikaye değil.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Vay canına, bu gerçekten etkileyici." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "(güler) Bu hikayeyi paylaşmanız hoşuma gitti, samimi buldum." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "Haklısınız, misafirlerime anlatacak harika bir hikaye olur." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Bu tarihe karşılık fiyatta bir esneklik olur mu?" }],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, bu tarihi duvarı başka evde bulamazsınız.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklifle gelin, konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Küçük bir indirim düşünülebilir.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Karar vermem gerekiyor galiba." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, sur duvarını bir kez daha inceleyin isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Biraz daha düşünelim, size döneriz." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }], end: "lost" },
    },
  },

  {
    id: "yatirim-balikpazari",
    title: "Balık Pazarı Üstü Daire",
    location: "Beşiktaş, çarşı",
    customerNames: ["Alıcı"],
    background: "placeholder-house-8",
    askingPrice: 5800000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Merhaba, ben {isim}. Sabah erken saatlerde pazarın gürültüsü rahatsız eder mi diye merak ediyorum." },
          { speaker: "customer1", text: "Balık severim ama gürültüye tahammülüm yok." },
        ],
        choices: [
          { id: "a", text: "\"Hiç rahatsız etmez, cadde ses geçirmiyor.\"", next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: "\"Sabahları biraz gürültülü oluyor, dürüst olayım.\"", next: "start_b", effects: { fun: 5 } },
          { id: "c", text: "\"Akşamüstü indirimli balık şansı da yüksek, bir denge var yani.\"", next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: "Umarım öyledir, sabahları sessizlik istiyorum." }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: "Dürüst olmanızı takdir ediyorum, alışırım herhalde." }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: "(güler) Bu dengeyi sevdim, indirimli balık fena fikir değil." }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: "Sabah gürültüsüne karşılık fiyatta bir şey yapabilir misiniz?" }],
        choices: [
          { id: "a", text: "\"Fiyat net, akşam indirimleri zaten bir avantaj.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir rakam söyleyin, birlikte bakalım.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Ufak bir esneklik gösterebilirim.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Artık karar vermem lazım sanırım." }],
        choices: [
          { id: "a", text: "\"Anlaştık, bu şartlarla ilerleyelim.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Acele etmeyin, pazarı bir kez daha gezin isterseniz.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: "Anlaştık, sözleşmeyi hazırlayalım." }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: "Sabah gürültüsünü biraz daha düşünmemiz lazım." }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: "Sanırım gürültüye tahammül edemem, vazgeçiyorum." }], end: "lost" },
    },
  },
];

/** Career rank required before the "Yatırım Evleri" tab unlocks. */
export const INVESTMENT_UNLOCK_RANK = "Ofis Ortağı";

export function isInvestmentUnlocked(rankTitleText: string): boolean {
  return rankTitleText === INVESTMENT_UNLOCK_RANK;
}
