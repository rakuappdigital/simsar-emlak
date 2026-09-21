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
    title: "Vapur İskelesi Manzaralı Çatı Katı", titleEn: "Penthouse with Ferry Pier View",
    location: "Kadıköy, çatı katı", locationEn: "Kadıköy, penthouse",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. İlanda \"deniz manzaralı\" yazıyordu ama pencereden vapur iskelesi görüyorum.", en: "Hello, I'm {isim}. The ad said \"sea view\" but I can see the ferry pier from the window." } },
          { speaker: "customer1", text: { tr: "Vapur düdüğü de eksik olmuyor galiba, değil mi?", en: "I guess the ferry horn never stops, right?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Boğaz değil ama gün boyu canlı bir manzara, alışırsınız.\"", en: "\"It's not the Bosphorus, but it's a lively view all day, you'll get used to it.\"" }, next: "start_a", effects: { interest: 8, suspicion: 5 } },
          { id: "b", text: { tr: "\"Doğru, düdük sesi oluyor, açıkçası ilk hafta biraz alışmak lazım.\"", en: "\"True, there is horn noise, frankly you need to get used to it the first week.\"" }, next: "start_b", effects: { fun: 8 } },
          { id: "c", text: { tr: "\"Vapur saatlerini ezbere bilirsiniz, kendi saatiniz gibi olur.\"", en: "\"You'll know the ferry schedules by heart, it'll be like your own clock.\"" }, next: "start_c", effects: { interest: 5, fun: 5 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Hmm, \"alışırsınız\" derken biraz zorlanacağımı düşünüyorum galiba.", en: "Hmm, when you say \"you'll get used to it\", I think I might struggle a bit." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olduğunuz için teşekkürler, en azından bilerek karar veririm.", en: "Thanks for being honest, at least I can make an informed decision." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Kendi saatim gibi olması hoşuma gitti doğrusu.", en: "(laughs) I actually like the idea of it being like my own clock." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Vapur seferlerini düşününce fiyatta biraz oynayabilir miyiz?", en: "Considering the ferry schedules, can we negotiate a bit on the price?" } }],
        choices: [
          { id: "a", text: { tr: "\"Bu fiyat gayet net, bu değerin altına inmem.\"", en: "\"This price is quite firm, I won't go below this value.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir rakam söyleyin, birlikte bir yere varalım.\"", en: "\"State a reasonable figure, let's reach an agreement together.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Vapur gürültüsüne karşılık ufak bir indirim düşünebilirim.\"", en: "\"I can consider a slight discount in exchange for the ferry noise.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Anladım, sanırım karar vermem gerekiyor.", en: "I see, I guess I need to make a decision." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla imzaya geçelim.\"", en: "\"Agreed, let's proceed with the signature on these terms.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, kafanız rahat karar verin.\"", en: "\"Take your time, make your decision with peace of mind.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Tamam, anlaştık — sözleşmeyi hazırlayalım.", en: "Okay, agreed — let's prepare the contract." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünmemiz lazım, size döneriz.", en: "We need to think a bit more, we'll get back to you." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "I guess this isn't for me, I took up your time." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-terzidukkani",
    title: "Terzi Dükkanı Üstü Daire", titleEn: "Apartment Above the Tailor Shop",
    location: "Nişantaşı, 2. kat", locationEn: "Nişantaşı, 2nd floor",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Alt kattaki terzi dükkanının sesleri buraya geliyor mu acaba?", en: "Hello, I'm {isim}. Do the sounds from the tailor shop downstairs reach here?" } },
          { speaker: "customer1", text: { tr: "Dikiş makinesi sesiyle uyumak istemem açıkçası.", en: "Frankly, I wouldn't want to sleep to the sound of a sewing machine." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç gelmiyor, ses yalıtımı gayet iyi.\"", en: "\"Not at all, the sound insulation is quite good.\"" }, next: "start_a", effects: { interest: 8, suspicion: 8 } },
          { id: "b", text: { tr: "\"Hafif geliyor ama gece değil, mesai saatlerinde.\"", en: "\"Only during working hours, it's completely silent at night.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Terzi ustayla tanışın isterseniz, çok sevimli biri.\"", en: "\"Actually, the rhythmic sound of the machine gives a nice nostalgic vibe.\"" }, next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, çünkü gece işim var, dinlenmem lazım.", en: "Good to know, silence at night is my priority." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Mesai saatinde olması iş yerinde olacağım için sorun değil aslında.", en: "Working hours are fine since I'm out during the day." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Komşuyla tanıştırmanız hoşuma gitti, sıcak bir yaklaşım.", en: "Nostalgic vibe? I'm not sure if I'd like that all day." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Dikiş sesine katlanacaksam fiyatta bir şey yapalım.", en: "Since it's right above a commercial shop, is there room to negotiate on the rent?" } }],
        choices: [
          { id: "a", text: { tr: "\"Bu fiyat gayet adil, indirime gerek yok.\"", en: "\"Commercial closeness doesn't lower the flat's value, the price is fixed.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklif getirin, konuşuruz.\"", en: "\"We can talk if you're serious about renting.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir esneklik olabilir.\"", en: "\"I can offer a small discount for the first month.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar vermem gerekiyor galiba.", en: "Alright, let's make a decision." } }],
        choices: [
          { id: "a", text: { tr: "\"Tamam, bu şartlarla anlaşalım.\"", en: "\"Let's seal the deal right now.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"İsterseniz biraz daha düşünün.\"", en: "\"Think about it, no pressure.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Deal, let's sign the paperwork." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, döneriz size.", en: "Let me review my options and get back to you." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Bu bana göre değilmiş sanırım, teşekkürler.", en: "I'll pass on this one, thanks." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-kapalikuyu",
    title: "Bahçeli Müstakil (Kuyusu Kapalı)", titleEn: "Detached House with Garden (Closed Well)",
    location: "Beykoz, bahçeli", locationEn: "Beykoz, with garden",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Bahçedeki o beton kapatılmış kısım nedir, kuyu mu var altında?", en: "Hello, I'm {isim}. What is that concrete-covered part in the garden, is there a well underneath?" } },
          { speaker: "customer1", text: { tr: "Komşular hâlâ su çekildiğini söylüyor, doğru mu?", en: "Neighbors say water is still being drawn, is that true?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Kesinlikle değil, o sadece eski bir zemin dolgusu.\"", en: "\"Absolutely not, it's just an old ground fill.\"" }, next: "start_a", effects: { interest: 5, suspicion: 12 } },
          { id: "b", text: { tr: "\"Eskiden kuyuymuş, güvenlik için kapattırdım.\"", en: "\"There is a well, but it's securely sealed and completely safe.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Mahalle efsanesi biraz abartılıyor ama evet, altında bir kuyu var.\"", en: "\"It's just an architectural detail, nothing to worry about.\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Hmm, komşular başka türlü anlatıyor ama sizin sözünüze güveneyim.", en: "Old ground fill sounds safe, I just wanted to be sure." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Güvenlik için kapatmanız iyi olmuş, mantıklı bir sebep.", en: "Even if it's sealed, knowing there's a well underneath feels a bit eerie." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Mahalle efsaneleri her zaman ilginçtir, hoşuma gitti bu.", en: "An architectural detail? That's an interesting way to put it." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "O kuyu hikayesinden sonra fiyatta esneklik beklerim doğrusu.", en: "With garden maintenance and this well situation, can we adjust the price?" } }],
        choices: [
          { id: "a", text: { tr: "\"Bu fiyat net, bahçe büyük, altına inmem.\"", en: "\"The garden alone is worth this price, no discounts.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklifle konuşuruz.\"", en: "\"We can share the garden maintenance cost if you want.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir indirim mümkün olabilir.\"", en: "\"I can deduct a small amount for garden setup.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar vermemiz lazım galiba.", en: "Okay, I've got a clear picture now." } }],
        choices: [
          { id: "a", text: { tr: "\"Bu şartlarla anlaşalım o zaman.\"", en: "\"Let's finalize the purchase.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, düşünme hakkınız var.\"", en: "\"Take your time to inspect the garden further.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeye geçelim.", en: "Let's do it, I'm buying the house." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Kuyu meselesini biraz daha düşünmemiz lazım.", en: "I need to consult my family first." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Açıkçası o kuyu fikri içimi rahatsız etti, vazgeçiyorum.", en: "Not convinced about the garden setup, goodbye." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-sinemakomsulugu",
    title: "Sinema Salonu Komşuluğu", titleEn: "Next to a Cinema Hall",
    location: "Beyoğlu, 3. kat", locationEn: "Beyoğlu, 3rd floor",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Yan binada eski bir sinema var galiba, hafta sonları film müziği duyulur mu?", en: "Hello, I'm {isim}. I think there's an old cinema next door, can you hear movie soundtracks on weekends?" } },
          { speaker: "customer1", text: { tr: "Sinemayı severim ama sürekli duymak istemem.", en: "I love movies but I wouldn't want to hear them constantly." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç duyulmaz, bina yalıtımı gayet sağlam.\"", en: "\"Not heard at all, the building insulation is very solid.\"" }, next: "start_a", effects: { interest: 8, suspicion: 8 } },
          { id: "b", text: { tr: "\"Hafta sonları hafif duyuluyor, doğrusu bu.\"", en: "\"Only faint bass sounds during action scenes, nothing major.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Duyulur ama bedava film müziği gibi düşünün, hoş bir şey.\"", en: "\"Think of it as free movie audio commentary!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, çünkü sessizlik benim için önemli.", en: "Solid insulation is crucial for me, glad to hear that." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst cevap için teşekkürler, hafif olması bende sorun yaratmaz.", en: "Action scene bass might be annoying during quiet evenings." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bedava film müziği demeniz hoşuma gitti, bakış açınızı beğendim.", en: "(laughs) Free commentary isn't quite what I'm looking for." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Film müziğine katlanacaksam biraz indirim hak ediyorum sanki.", en: "Is the rent negotiable considering the entertainment venue next door?" } }],
        choices: [
          { id: "a", text: { tr: "\"Bu fiyat net, bu değerin altına inmem.\"", en: "\"The price is already set according to market standards.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklif getirin, konuşuruz.\"", en: "\"I can offer a slight concession if you sign a long-term lease.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Küçük bir esneklik gösterebilirim.\"", en: "\"Let's meet halfway on the deposit.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar anı geldi sanırım.", en: "Alright, let's wrap this up." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla ilerleyelim.\"", en: "\"Sign me up, let's proceed.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, sinemaya da alışırsınız zamanla.\"", en: "\"Think it over and let me know tomorrow.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Agreed, let's get the paperwork done." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, size döneriz.", en: "I'll think about it over the weekend." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "I'll pass, thanks for your time." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-balikcibarinagi",
    title: "Balıkçı Barınağı Manzaralı Stüdyo", titleEn: "Studio with Fishing Shelter View",
    location: "Sarıyer, sahil", locationEn: "Sarıyer, seaside",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Sabah 5'te ağ toplama sesleri geliyor diye duydum, doğru mu?", en: "Hello, I'm {isim}. I heard the sounds of hauling nets come in at 5 AM, is it true?" } },
          { speaker: "customer1", text: { tr: "Erken kalkmayı sevmem açıkçası.", en: "Frankly, I don't like waking up early." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç öyle bir şey yok, gayet sakin bir sokak.\"", en: "\"Nothing like that at all, it's a very quiet street.\"" }, next: "start_a", effects: { interest: 8, suspicion: 10 } },
          { id: "b", text: { tr: "\"Doğru, ama karşılığında taze balık şansı yüksek.\"", en: "\"Fishermen do go out early, but double-glazed windows block it out.\"" }, next: "start_b", effects: { fun: 8 } },
          { id: "c", text: { tr: "\"Balıkçılarla tanışırsanız kahvaltıya balık bile gelir bazen.\"", en: "\"It's part of the authentic seaside charm!\"" }, next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, çünkü uyku düzenim çok hassas.", en: "A quiet street is exactly what I want." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "(güler) Taze balık iyi bir telafi olabilir doğrusu.", en: "Double glazing is good, as long as it actually works." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "Bu beni gerçekten güldürdü, komşuluk hoşuma gider.", en: "Authentic charm can wait until after 9 AM for me." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Sabah 5 gürültüsüne karşılık fiyatta bir şey yapabilir misiniz?", en: "Can we talk about the price given the early morning activity?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat gayet net, taze balık bunun bedeli zaten.\"", en: "\"Seaside views in Sarıyer don't come cheaper than this.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir rakam söyleyin, konuşuruz.\"", en: "\"I can drop a small fraction if we close today.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir esneklik olabilir.\"", en: "\"Let's look at the payment terms instead.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Sanırım karar vermem lazım.", en: "I've heard enough to make a choice." } }],
        choices: [
          { id: "a", text: { tr: "\"Bu şartlarla anlaşalım.\"", en: "\"Let's finalize the deal.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Düşünün istediğiniz kadar, acelemiz yok.\"", en: "\"Take your time to decide.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Let's do it, I'll take the studio." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Erken saatleri biraz daha düşünmemiz lazım.", en: "Need to check my budget first." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım erken kalkmaya hazır değilim, vazgeçiyorum.", en: "Not for me, thank you." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-eskihan",
    title: "Eski Han'ın Üst Katı", titleEn: "Upper Floor of an Old Inn",
    location: "Eminönü, tarihi han", locationEn: "Eminönü, historical inn",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Zemin katta hâlâ küçük atölyeler var galiba, asansör de yok diye duydum.", en: "Hello, I'm {isim}. I think there are still small workshops on the ground floor, and I heard there's no elevator." } },
          { speaker: "customer1", text: { tr: "Merdiven kaç kat, dizlerim buna dayanır mı bilmiyorum.", en: "How many flights of stairs is it? I don't know if my knees can handle it." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Sadece 2 kat, hiç sorun olmaz.\"", en: "\"It's only 2 floors, it won't be a problem at all.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Asansör gerçekten yok ama tarihi doku buna değer.\"", en: "\"The stairs are wide and low-stepped, very easy to climb.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Merdiven biraz spor sayılır, günde birkaç kere iner çıkarsınız.\"", en: "\"Consider it your daily free cardio workout!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, çünkü merdivenle aram hiç iyi değil.", en: "Only 2 floors is manageable, that's reassuring." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Tarihi doku dediniz, bu beni ikna edebilir açıkçası.", en: "Wide steps definitely help." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu yaklaşımı beğendim, olumlu bakmaya çalışayım.", en: "(laughs) I get enough cardio at the gym, but okay." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Asansörsüz bu kat için fiyatta biraz oynayabilir miyiz?", en: "Since there's no elevator, is the price reflective of that?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat gayet net, bu asansörsüz katı gösteren pek olmaz.\"", en: "\"Historical locations in Eminönü are priced for their character.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklif getirin, konuşuruz.\"", en: "\"I can shave off a little bit for the lack of elevator.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir esneklik olabilir.\"", en: "\"The price is already adjusted for the building type.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar vermem gerekiyor sanırım.", en: "Let's make our final decision." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla imzalayalım.\"", en: "\"Let's sign the contract.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, merdivenleri bir daha deneyin isterseniz.\"", en: "\"Take a moment to think about it.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Agreed, let's proceed." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Merdiven meselesini biraz daha düşünmemiz lazım.", en: "Let me think about the stairs." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım dizlerim buna razı olmayacak, vazgeçiyorum.", en: "I can't deal with the stairs, goodbye." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-catibahce",
    title: "Duplex — Çatı Bahçeli", titleEn: "Duplex — With Roof Garden",
    location: "Etiler, duplex", locationEn: "Etiler, duplex",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Çatıdaki sera naylonu rüzgarda hep uçuyormuş diye duydum.", en: "Hello, I'm {isim}. I heard the greenhouse tarp on the roof always blows away in the wind." } },
          { speaker: "customer1", text: { tr: "Bahçıvanlık hobim var, ciddiye alıyorum bunu.", en: "I have a gardening hobby, I take it seriously." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç öyle bir şey yok, sera gayet sağlam sabitli.\"", en: "\"Nothing like that at all, the greenhouse is quite firmly secured.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Doğru, rüzgarlı günlerde biraz uçuşuyor, sabitlemek gerekebilir.\"", en: "\"It was reinforced recently, it withstands even heavy storms.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"O naylon sesi bile çatı bahçesinin karakteri oldu artık.\"", en: "\"If it blows away, you get a better open sky view!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, bahçem için ciddi planlarım var.", en: "Firmly secured is good to hear for a gardener." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olmanız iyi, sabitleme benim için sorun değil.", en: "Recent reinforcement gives me confidence." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu bakış açısını sevdim, karakterli bir yer arıyordum zaten.", en: "Not sure my plants would appreciate losing their shelter!" } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Sera bakımını düşününce fiyatta bir esneklik olur mu?", en: "Can we negotiate on price given the rooftop maintenance needs?" } }],
        choices: [
          { id: "a", text: { tr: "\"Bu fiyat net, çatı bahçesi bu fiyatı hak ediyor.\"", en: "\"Etiler duplex prices are firm.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklifle konuşuruz.\"", en: "\"I can offer a small discount for garden upkeep.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir indirim mümkün olabilir.\"", en: "\"Let's discuss terms if you're ready to buy.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Artık karar vermem lazım galiba.", en: "Time to decide." } }],
        choices: [
          { id: "a", text: { tr: "\"Bu şartlarla anlaşalım.\"", en: "\"Let's close the deal.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, bahçeyi bir kez daha gezin isterseniz.\"", en: "\"Take your time to review.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Deal, let's sign." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Sera meselesini biraz daha düşünmemiz lazım.", en: "Need some time to consider." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bahçe planlarıma uymuyor, vazgeçiyorum.", en: "I'll pass on this duplex." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-meyhaneustu",
    title: "Meyhane Üstü Daire", titleEn: "Apartment Above a Tavern",
    location: "Kadıköy, Kadife Sokak", locationEn: "Kadıköy, Kadife Street",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Cuma-cumartesi geceleri canlı müzik oluyormuş diye duydum, doğru mu?", en: "Hello, I'm {isim}. I heard there is live music on Friday and Saturday nights, is it true?" } },
          { speaker: "customer1", text: { tr: "Erken yatarım genelde, bu beni endişelendiriyor.", en: "I usually go to bed early, this worries me." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç olmuyor, cadde gayet sakin.\"", en: "\"Not at all, the street is quite calm.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Doğru, hafta sonları biraz canlı oluyor.\"", en: "\"There is music, but it ends strictly by midnight due to regulations.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Canlı müzik oluyor ama komşuluk da o kadar eğlenceli, hiç yalnız kalmazsınız.\"", en: "\"You can enjoy the live music right from your living room!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, sessizlik benim için önemli.", en: "If the street is calm, that's great." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olmanız iyi, hafta sonu için kulak tıkacı alırım o zaman.", en: "Midnight cutoff is acceptable." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu yaklaşımı sevdim, belki de tam aradığım şey bu.", en: "I prefer sleeping over listening to live tavern music." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Hafta sonu gürültüsüne karşılık fiyatta ne yapabiliriz?", en: "Any flexibility on price due to the tavern downstairs?" } }],
        choices: [
          { id: "a", text: { tr: "\"Bu fiyat net, komşuluk bonus sayılır zaten.\"", en: "\"Kadife Street location brings high demand, no discounts.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir rakamla gelin, oturup konuşalım.\"", en: "\"I can lower the deposit amount.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir esneklik olabilir.\"", en: "\"Let's agree on a fair market price.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar vermem gerekiyor sanırım.", en: "Let's make the final call." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla ilerleyelim.\"", en: "\"Let's sign the lease.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, bir cumartesi gecesi de deneyimleyin isterseniz.\"", en: "\"Think about it carefully.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Agreed, let's proceed." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Gece gürültüsünü biraz daha düşünmemiz lazım.", en: "Let me think about it." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım erken yatan biri için uygun değil, vazgeçiyorum.", en: "Not suitable for me." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-kutuphaneyani",
    title: "Kütüphane Yanı Sessiz Ev", titleEn: "Quiet House Next to the Library",
    location: "Beyazıt, kütüphane bitişiği", locationEn: "Beyazıt, adjacent to the library",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Kütüphane bitişiğinde olması sessizlik garantisi mi demek?", en: "Hello, I'm {isim}. Does being adjacent to the library guarantee silence?" } },
          { speaker: "customer1", text: { tr: "Ben çalışırken kesinlikle sessizlik isterim.", en: "I absolutely need silence when I work." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Kesinlikle, buradan bir çıt bile çıkmaz.\"", en: "\"Absolutely, not a single peep comes from here.\"" }, next: "start_a", effects: { interest: 5, suspicion: 8 } },
          { id: "b", text: { tr: "\"Genelde sessiz ama gece geç saatte ışık yakmak bile suç gibi geliyor açıkçası.\"", en: "\"The library area is quiet, though student crowds gather during exam periods.\"" }, next: "start_b", effects: { fun: 8 } },
          { id: "c", text: { tr: "\"Sessizlik konusunda kütüphane sizin en sıkı denetçiniz olur.\"", en: "\"It's as quiet as a church mouse most of the time.\"" }, next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Bu tam istediğim şey, harika.", en: "Not a single peep sounds ideal." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu detayı paylaşmanız hoşuma gitti, dürüstlüğünüzü beğendim.", en: "Exam periods are manageable if interiors are well insulated." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "Bu espri hoşuma gitti, ciddi bir çalışma ortamı arıyordum zaten.", en: "Church mouse quiet is what I'm looking for." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Bu sessizliğin bir bedeli var herhalde, fiyatta esner misiniz?", en: "Can we discuss the price for this quiet spot?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat gayet net, sessizlik burada pazarlık konusu olmaz.\"", en: "\"Silence and location command this price.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklifle gelin, değerlendiririm.\"", en: "\"I can offer a small token discount.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Küçük bir indirim düşünülebilir.\"", en: "\"Let's finalize at the current asking price.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar anı geldi sanırım.", en: "Ready to decide." } }],
        choices: [
          { id: "a", text: { tr: "\"Bu şartlarla anlaşalım.\"", en: "\"Let's sign the papers.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, sessizce düşünün.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Deal, let's finish it." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, size döneriz.", en: "Thinking it over." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "Passing on this one." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-tramvayhatti",
    title: "Tramvay Hattı Kenarı", titleEn: "By the Tram Line",
    location: "Beyoğlu, İstiklal", locationEn: "Beyoğlu, Istiklal",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Nostaljik tramvay geçerken pencereler titriyor mu gerçekten?", en: "Hello, I'm {isim}. Do the windows really rattle when the nostalgic tram passes?" } },
          { speaker: "customer1", text: { tr: "Biraz hafif titriyorsa sorun etmem ama emin olmak istiyorum.", en: "I don't mind if it rattles slightly, but I want to be sure." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hayır, hiç hissedilmiyor bile.\"", en: "\"No, it's not felt at all.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Hafifçe titriyor, doğrusu bu.\"", en: "\"Only a gentle vibration, nothing disruptive.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"O titreşim İstiklal'de yaşadığınızı her gün hatırlatır, ben severim.\"", en: "\"It adds to the historical atmosphere of Istiklal Avenue!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, hassas biriyimdir bu konularda.", en: "Not felt at all is great." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olmanız iyi, hafif titreşim sorun değil benim için.", en: "Gentle vibration is totally fine by me." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu bakış açısını beğendim, nostaljik bir taraf var bende.", en: "Historical atmosphere is nice, but I value peace." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Titreşime karşılık fiyatta bir esneklik olur mu?", en: "Any room for negotiation on the price?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat gayet net, bu güzergahı bulmak kolay değil.\"", en: "\"Istiklal properties hold their value strictly.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir rakam söyleyin, konuşalım.\"", en: "\"I can make a minor adjustment for you.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir esneklik olabilir.\"", en: "\"Let's agree on a reasonable figure.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Sanırım karar vermem lazım.", en: "Making my final decision." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla imzalayalım.\"", en: "\"Let's close the agreement.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, bir tramvay daha geçsin bakalım.\"", en: "\"Take some time to think.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Let's sign the contract." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Titreşim meselesini biraz daha düşünmemiz lazım.", en: "Need more time." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "Not interested anymore." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-caybahcesi",
    title: "Çay Bahçesi Manzaralı Ev", titleEn: "House with Tea Garden View",
    location: "Üsküdar, sahil", locationEn: "Üsküdar, seaside",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Pencereden meşhur bir çay bahçesi görünüyormuş, tavla sesleri rahatsız eder mi?", en: "Hello, I'm {isim}. A famous tea garden is visible from the window, would the sound of backgammon be disturbing?" } },
          { speaker: "customer1", text: { tr: "Ben sakin bir yer arıyorum açıkçası.", en: "Frankly, I am looking for a quiet place." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç duyulmaz, çok yüksekte kalıyorsunuz.\"", en: "\"Not heard at all, you are staying very high up.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Akşamları hafif duyuluyor, doğrusu bu.\"", en: "\"Only a pleasant murmur of chatter reaches up here.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Tavla sesleri aslında güzel bir arka plan müziği gibi, alışırsınız.\"", en: "\"Backgammon dice sounds are actually quite relaxing!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, sakinlik benim için önemli.", en: "Being high up and out of earshot is perfect." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olmanız iyi, akşamları dışarıda olurum zaten genelde.", en: "A pleasant murmur is acceptable." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu bakış açısını sevdim, belki gerçekten alışırım.", en: "Relaxing dice sounds aren't quite my priority." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Tavla seslerine karşılık fiyatta bir şey yapabilir misiniz?", en: "Can we adjust the price?" } }],
        choices: [
          { id: "a", text: { tr: "\"Bu fiyat net, manzara bu fiyatı hak ediyor.\"", en: "\"Üsküdar seaside views are non-negotiable on price.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklifle gelin, konuşuruz.\"", en: "\"I can offer a slight discount.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Küçük bir esneklik gösterebilirim.\"", en: "\"Let's meet in the middle.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar vermem gerekiyor galiba.", en: "Ready to decide." } }],
        choices: [
          { id: "a", text: { tr: "\"Bu şartlarla anlaşalım.\"", en: "\"Let's sign.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, bir çay içip düşünün isterseniz.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Deal, let's proceed." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, size döneriz.", en: "Thinking it over." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "Passing on this." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-fabrikaloft",
    title: "Restore Edilmiş Fabrika Dairesi", titleEn: "Restored Factory Apartment",
    location: "Kağıthane, loft", locationEn: "Kağıthane, loft",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Tavan çok yüksek diye duydum, ısıtma faturası da öyle mi?", en: "Hello, I'm {isim}. I heard the ceiling is very high, is the heating bill high as well?" } },
          { speaker: "customer1", text: { tr: "Kış aylarını merak ediyorum açıkçası.", en: "Frankly, I am wondering about the winter months." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç değil, izolasyon yenilendi, gayet normal.\"", en: "\"Not at all, the insulation was renewed, it's quite normal.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Doğru, yüksek tavan biraz fatura demek, dürüst olayım.\"", en: "\"Modern heating systems keep it very cozy without huge bills.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Yüksek tavan karşılığında muhteşem bir ses yankısı kazanıyorsunuz.\"", en: "\"High ceilings mean better air circulation!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, kışın fatura beni çok üzer.", en: "Renewed insulation is reassuring." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olmanızı takdir ediyorum, bunu göze alabilirim.", en: "Modern heating systems make a big difference." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu detayı sevdim, müzikle uğraşırım aslında.", en: "Good air circulation is nice, but bills matter too." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Isıtma faturasını düşününce fiyatta esneklik beklerim.", en: "Can we negotiate on price?" } }],
        choices: [
          { id: "a", text: { tr: "\"Bu fiyat net, restorasyon bu fiyatı hak ediyor.\"", en: "\"Loft apartments in Kağıthane are priced competitively.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir rakam söyleyin, birlikte bakalım.\"", en: "\"I can offer a small discount for winter prep.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir indirim düşünülebilir.\"", en: "\"Let's discuss terms.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Artık karar vermem lazım sanırım.", en: "Making my choice." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla ilerleyelim.\"", en: "\"Let's sign the contract.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, kışı bir düşünün isterseniz.\"", en: "\"Take your time to decide.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Agreed, let's finish." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Fatura konusunu biraz daha düşünmemiz lazım.", en: "Thinking about winter bills." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bütçeme uymuyor, vazgeçiyorum.", en: "Not for me." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-minaregolgesi",
    title: "Minare Gölgesi", titleEn: "Minaret Shadow",
    location: "Fatih, cami yanı", locationEn: "Fatih, next to the mosque",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Cami çok yakınmış, ezan sesi ne kadar net geliyor?", en: "Hello, I'm {isim}. The mosque is very close, how clear does the call to prayer sound?" } },
          { speaker: "customer1", text: { tr: "Sabah namazına alarm kurmam gerekir mi merak ediyorum.", en: "I am wondering if I need to set an alarm for the morning prayer." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Çok hafif geliyor, neredeyse hiç duyulmaz.\"", en: "\"It comes in very faintly, it's barely heard.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Gayet net geliyor, alarma gerek kalmaz doğrusu.\"", en: "\"Clear enough to be peaceful, but not disruptive.\"" }, next: "start_b", effects: { fun: 8 } },
          { id: "c", text: { tr: "\"Ezan sesiyle uyanmak bazıları için huzur verici oluyor.\"", en: "\"You won't need an alarm clock anymore!\"" }, next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, hafif uyuyan biriyim.", en: "Faint sound is good." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu iyi bir haber, alarm kurmayı unuturum genelde.", en: "Peaceful volume works for me." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "Bu güzel bir bakış açısı, huzurlu bir yer arıyordum zaten.", en: "I prefer setting my own alarms." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Ezan sesine karşılık fiyatta bir esneklik olur mu?", en: "Any price adjustments possible?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat gayet net, bu huzuru ucuza satmam.\"", en: "\"Fatih central locations have fixed pricing.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklifle gelin, konuşalım.\"", en: "\"I can offer a minor discount.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Küçük bir indirim mümkün olabilir.\"", en: "\"Let's agree on a fair amount.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar vermem gerekiyor sanırım.", en: "Ready to decide." } }],
        choices: [
          { id: "a", text: { tr: "\"Bu şartlarla anlaşalım.\"", en: "\"Let's sign.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, bir sabah ezanını dinleyin isterseniz.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Deal, let's proceed." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, size döneriz.", en: "Thinking it over." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "Passing on this." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-marinamanzarali",
    title: "Marina Manzaralı Daire", titleEn: "Apartment with Marina View",
    location: "Ataköy, marina", locationEn: "Ataköy, marina",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Yatlar güzel duruyor ama komşular biraz havalı mı burada?", en: "Hello, I'm {isim}. The yachts look nice, but are the neighbors a bit snobby here?" } },
          { speaker: "customer1", text: { tr: "\"Captain\" diye hitap edilmeyi beklerler mi mesela?", en: "Would they expect to be addressed as 'Captain', for example?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç öyle değil, gayet samimi bir komşuluk var.\"", en: "\"Not like that at all, there is a very friendly neighborhood vibe.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Açıkçası biraz havalı bir hava var, dürüst olayım.\"", en: "\"Everyone minds their own business, very relaxed atmosphere.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Siz de bir tekne alırsanız kısa sürede \"captain\" olursunuz, sorun değil.\"", en: "\"Only if you park your yacht next to theirs!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, gösterişten hoşlanmam.", en: "Friendly vibe is great to hear." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olmanızı takdir ediyorum, idare ederim herhalde.", en: "Minding their own business sounds ideal." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu espri hoşuma gitti, belki gerçekten bir tekne alırım.", en: "(laughs) No yacht for me, so I should be safe." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Bu manzaraya karşılık fiyatta bir şey yapabilir misiniz?", en: "Can we discuss the price?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat gayet net, bu manzarayı başka yerde bulamazsınız.\"", en: "\"Ataköy marina prices are set.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir rakam söyleyin, değerlendiririm.\"", en: "\"I can offer a small concession.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir esneklik gösterebilirim.\"", en: "\"Let's finalize terms.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Sanırım karar vermem lazım.", en: "Making my decision." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla imzalayalım.\"", en: "\"Let's sign the contract.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, bir tekne turu da atın isterseniz.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Agreed, let's finish." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, size döneriz.", en: "Thinking about it." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu çevre bana göre değil, vazgeçiyorum.", en: "Not interested." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-kuyumcularcarsisi",
    title: "Kuyumcular Çarşısı Üstü", titleEn: "Above the Jewelers' Bazaar",
    location: "Kapalıçarşı yakını", locationEn: "Near Grand Bazaar",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Alt katta kuyumcular var diye duydum, güvenlik kamerası sayısı ev sayısından fazla mı gerçekten?", en: "Hello, I'm {isim}. I heard there are jewelers downstairs, are there really more security cameras than houses?" } },
          { speaker: "customer1", text: { tr: "Güvenlik konusunda hassasımdır.", en: "I am sensitive about security." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Abartılıyor, birkaç kamera var sadece.\"", en: "\"It's exaggerated, there are only a few cameras.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Doğru sayılır, dürüst olayım, bölge çok sıkı korunuyor.\"", en: "\"Actually, having extra security around is a major plus for safety!\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Bu kadar kamera varken hırsız değil turist bile giremez.\"", en: "\"You'll be the safest person in the district.\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, güvenlik önceliğim.", en: "Good to know it's exaggerated." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olmanızı takdir ediyorum, bu aslında bir avantaj bence.", en: "Extra security is definitely a plus." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu bakış açısını sevdim, güvenlik konusunda rahatlarım.", en: "Being the safest person sounds reassuring." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Bunca kameraya karşılık fiyatta bir esneklik olur mu?", en: "Any price flexibility?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat gayet net, bu güvenlik seviyesi nadir bulunur.\"", en: "\"The high security makes this price very fair.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklifle gelin, konuşuruz.\"", en: "\"I can offer a small discount.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Küçük bir indirim düşünülebilir.\"", en: "\"Let's agree on terms.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar vermem gerekiyor galiba.", en: "Ready to decide." } }],
        choices: [
          { id: "a", text: { tr: "\"Bu şartlarla anlaşalım.\"", en: "\"Let's sign.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, kameraları bir daha sayın isterseniz.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Deal, let's proceed." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, size döneriz.", en: "Thinking it over." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "Passing on this." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-plakdukkani",
    title: "Vintage Plak Dükkanı Komşuluğu", titleEn: "Vintage Record Store Neighborhood",
    location: "Kadıköy, Moda", locationEn: "Kadıköy, Moda",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Alt kattan sürekli eski plak sesleri geliyormuş, doğru mu?", en: "Hello, I'm {isim}. I heard the sound of old records constantly comes from downstairs, is it true?" } },
          { speaker: "customer1", text: { tr: "Müzik zevkim biraz özeldir, uyar mı bilmiyorum.", en: "My taste in music is a bit specific, I don't know if it fits." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç gelmiyor, ses yalıtımı gayet iyi.\"", en: "\"Not at all, the sound insulation is quite good.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Geliyor, bazen tanıdık bazen tuhaf parçalar çalıyor dürüst olayım.\"", en: "\"They play soft jazz at low volumes, very relaxing.\"" }, next: "start_b", effects: { fun: 8 } },
          { id: "c", text: { tr: "\"Aşağıdaki dükkan sahibiyle tanışın, plak zevkiniz genişleyebilir.\"", en: "\"You might discover some great classic albums!\"" }, next: "start_c", effects: { interest: 5, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, sessiz çalışmam lazım genelde.", en: "Good insulation is reassuring." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "(güler) \"Tuhaf parçalar\" demeniz ilgimi çekti açıkçası.", en: "Soft jazz at low volume sounds nice." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "Bu güzel bir öneri, müzik zevkimi genişletmek hiç fena olmaz.", en: "Discovering classic albums could be fun." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Plak sesine karşılık fiyatta bir şey yapabilir misiniz?", en: "Can we negotiate the price?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat net, bu semt ruhu zaten bir bedel.\"", en: "\"Moda properties maintain their value.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir rakam söyleyin, oturup konuşalım.\"", en: "\"I can offer a minor discount.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir esneklik gösterebilirim.\"", en: "\"Let's finalize the deal.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Artık karar vermem lazım sanırım.", en: "Making my final decision." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla ilerleyelim.\"", en: "\"Let's sign the contract.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, birkaç plak dinleyip düşünün isterseniz.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Agreed, let's finish." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, size döneriz.", en: "Thinking about it." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "Not for me." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-sukemerleri",
    title: "Tarihi Su Kemerleri Manzaralı", titleEn: "Historical Aqueducts View",
    location: "Fatih, Bozdoğan Kemeri yakını", locationEn: "Fatih, near Valens Aqueduct",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Pencereden antik su kemerleri görünüyormuş, tarih meraklısıyımdır ben.", en: "Hello, I'm {isim}. Antique aqueducts can be seen from the window, I am a history buff." } },
          { speaker: "customer1", text: { tr: "Ev gösterirken tarih dersi de veriyor musunuz?", en: "Do you also give history lessons while showing houses?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Gerekmiyor, sadece manzara olarak duruyor.\"", en: "\"Not necessary, it just stands there as a view.\"" }, next: "start_a", effects: { interest: 5, suspicion: 5 } },
          { id: "b", text: { tr: "\"Açıkçası her seferinde biraz tarih anlatmadan geçemiyorum.\"", en: "\"I can share a few historical fun facts if you'd like!\"" }, next: "start_b", effects: { fun: 8 } },
          { id: "c", text: { tr: "\"İsterseniz kemerin hikayesini de anlatayım, uzun ama ilginç.\"", en: "\"Consider the view your daily history lesson.\"" }, next: "start_c", effects: { interest: 8, fun: 8 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Anladım, ben yine de kendim araştırırım o zaman.", en: "Just the view is fine by me." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu benim için artı bir puan, tarih anlatan bir emlakçı görmedim.", en: "Fun facts sound interesting." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "Lütfen anlatın, tam da bunun için buradayım.", en: "Daily history lesson sounds unique." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Turist kalabalığına karşılık fiyatta esner misiniz?", en: "Any price flexibility for history buffs?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat gayet net, bu tarihi manzarayı ucuza satmam.\"", en: "\"Historical views add value, no discounts.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklifle gelin, değerlendiririm.\"", en: "\"I can offer a small token discount.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Küçük bir indirim mümkün olabilir.\"", en: "\"Let's agree on terms.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar anı geldi sanırım.", en: "Ready to decide." } }],
        choices: [
          { id: "a", text: { tr: "\"Bu şartlarla anlaşalım.\"", en: "\"Let's sign.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, kemerleri bir kez daha görün isterseniz.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Deal, let's proceed." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, size döneriz.", en: "Thinking it over." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "Passing on this." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-simitfirini",
    title: "Simit Fırını Komşuluğu", titleEn: "Bagel Bakery Neighborhood",
    location: "Karaköy, meydan kenarı", locationEn: "Karaköy, edge of the square",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Alt katta simit fırını var diye duydum, sabah 5'te açılıyormuş.", en: "Hello, I'm {isim}. I heard there is a bagel bakery downstairs, it opens at 5 AM." } },
          { speaker: "customer1", text: { tr: "O saatte koku beni uyandırır mı acaba?", en: "I wonder if the smell would wake me up at that hour?" } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç uyandırmaz, koku dışarı yayılmıyor.\"", en: "\"Doesn't wake you up at all, the smell doesn't spread outside.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Doğrusu koku hafif geliyor, dürüst olayım.\"", en: "\"Actually, waking up to the smell of fresh bagels is a wonderful bonus!\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Simit kokusuyla uyanmak var ya, bu bir lüks aslında.\"", en: "\"You can get them hot straight from the oven every morning.\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, erken uyanmak istemiyorum.", en: "Good to know the smell doesn't spread." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olmanızı takdir ediyorum, idare ederim sanırım.", en: "Fresh bagel smell sounds delicious actually." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu bakış açısını sevdim, açıkçası simide bayılırım.", en: "Hot bagels every morning is tempting." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Sabah kokusuna karşılık fiyatta bir şey yapabilir misiniz?", en: "Can we negotiate on price?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat net, simit kokusu zaten bedava bir lüks.\"", en: "\"Karaköy location pricing is firm.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir rakam söyleyin, konuşalım.\"", en: "\"I can offer a minor discount.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir esneklik gösterebilirim.\"", en: "\"Let's finalize terms.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Sanırım karar vermem lazım.", en: "Making my decision." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla imzalayalım.\"", en: "\"Let's sign the contract.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, bir simit alıp düşünün isterseniz.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Agreed, let's finish." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Erken saatleri biraz daha düşünmemiz lazım.", en: "Thinking about it." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım erken kalkmaya hazır değilim, vazgeçiyorum.", en: "Not for me." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-surduvari",
    title: "Antik Sur Duvarı Bitişiği", titleEn: "Adjacent to the Ancient City Wall",
    location: "Yedikule, sur içi", locationEn: "Yedikule, inside the walls",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Bahçe duvarının bir kısmı gerçekten Bizans suru mu, yoksa efsane mi bu?", en: "Hello, I'm {isim}. Is a part of the garden wall really a Byzantine wall, or is this a myth?" } },
          { speaker: "customer1", text: { tr: "Tapu dairesi bile şaşırmış diye duydum.", en: "I heard even the land registry office was surprised." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Kesinlikle gerçek, belgeleri de mevcut.\"", en: "\"Absolutely real, the documents are available too.\"" }, next: "start_a", effects: { interest: 8, suspicion: 5 } },
          { id: "b", text: { tr: "\"Doğru, tapu dairesi de ilk başta inanmadı açıkçası.\"", en: "\"It's certified by the Ministry of Culture, completely authentic.\"" }, next: "start_b", effects: { fun: 8 } },
          { id: "c", text: { tr: "\"Kendi bahçenizde bin yıllık tarih olması fena bir hikaye değil.\"", en: "\"Even historians come to take photos of it!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Vay canına, bu gerçekten etkileyici.", en: "Being real with documents is incredible." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu hikayeyi paylaşmanız hoşuma gitti, samimi buldum.", en: "Ministry certification gives total peace of mind." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "Haklısınız, misafirlerime anlatacak harika bir hikaye olur.", en: "Having historians outside might be a bit much." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Bu tarihe karşılık fiyatta bir esneklik olur mu?", en: "Can we discuss price for a historical property?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat gayet net, bu tarihi duvarı başka evde bulamazsınız.\"", en: "\"Properties with Byzantine walls are rare, no discounts.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir teklifle gelin, konuşuruz.\"", en: "\"I can offer a small adjustment.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Küçük bir indirim düşünülebilir.\"", en: "\"Let's agree on a fair price.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Karar vermem gerekiyor galiba.", en: "Ready to decide." } }],
        choices: [
          { id: "a", text: { tr: "\"Bu şartlarla anlaşalım.\"", en: "\"Let's sign.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, sur duvarını bir kez daha inceleyin isterseniz.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Deal, let's proceed." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Biraz daha düşünelim, size döneriz.", en: "Thinking it over." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım bu bana göre değil, vaktinizi aldım.", en: "Passing on this." } }], end: "lost" },
    },
  },

  {
    id: "yatirim-balikpazari",
    title: "Balık Pazarı Üstü Daire", titleEn: "Apartment Above the Fish Market",
    location: "Beşiktaş, çarşı", locationEn: "Beşiktaş, bazaar",
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
          { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Sabah erken saatlerde pazarın gürültüsü rahatsız eder mi diye merak ediyorum.", en: "Hello, I'm {isim}. I wonder if the noise of the market in the early hours of the morning is disturbing." } },
          { speaker: "customer1", text: { tr: "Balık severim ama gürültüye tahammülüm yok.", en: "I love fish but I have no tolerance for noise." } },
        ],
        choices: [
          { id: "a", text: { tr: "\"Hiç rahatsız etmez, cadde ses geçirmiyor.\"", en: "\"Doesn't disturb at all, the street is soundproof.\"" }, next: "start_a", effects: { interest: 5, suspicion: 10 } },
          { id: "b", text: { tr: "\"Sabahları biraz gürültülü oluyor, dürüst olayım.\"", en: "\"Double-glazed windows keep all the market bustle outside.\"" }, next: "start_b", effects: { fun: 5 } },
          { id: "c", text: { tr: "\"Akşamüstü indirimli balık şansı da yüksek, bir denge var yani.\"", en: "\"You'll be right at the heart of Beşiktaş life!\"" }, next: "start_c", effects: { interest: 5, fun: 10 } },
        ],
      },
      start_a: { id: "start_a", lines: [{ speaker: "customer1", text: { tr: "Umarım öyledir, sabahları sessizlik istiyorum.", en: "Soundproof street is great to hear." } }], next: "detay" },
      start_b: { id: "start_b", lines: [{ speaker: "customer1", text: { tr: "Dürüst olmanızı takdir ediyorum, alışırım herhalde.", en: "Double glazing helps with peace of mind." } }], next: "detay" },
      start_c: { id: "start_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu dengeyi sevdim, indirimli balık fena fikir değil.", en: "Heart of Beşiktaş is nice, but quiet is better." } }], next: "detay" },
      detay: {
        id: "detay",
        lines: [{ speaker: "customer1", text: { tr: "Sabah gürültüsüne karşılık fiyatta bir şey yapabilir misiniz?", en: "Any room for negotiation on price?" } }],
        choices: [
          { id: "a", text: { tr: "\"Fiyat net, akşam indirimleri zaten bir avantaj.\"", en: "\"Beşiktaş bazaar location value is solid.\"" }, next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: { tr: "\"Makul bir rakam söyleyin, birlikte bakalım.\"", en: "\"I can offer a minor discount.\"" }, next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: { tr: "\"Ufak bir esneklik gösterebilirim.\"", en: "\"Let's finalize terms.\"" }, next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },
      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: { tr: "Artık karar vermem lazım sanırım.", en: "Making my final decision." } }],
        choices: [
          { id: "a", text: { tr: "\"Anlaştık, bu şartlarla ilerleyelim.\"", en: "\"Let's sign the contract.\"" }, next: "", effects: { closingBias: 15 } },
          { id: "b", text: { tr: "\"Acele etmeyin, pazarı bir kez daha gezin isterseniz.\"", en: "\"Take your time.\"" }, next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },
      closing_sold: { id: "closing_sold", lines: [{ speaker: "customer1", text: { tr: "Anlaştık, sözleşmeyi hazırlayalım.", en: "Agreed, let's finish." } }], end: "sold" },
      closing_thinking: { id: "closing_thinking", lines: [{ speaker: "customer1", text: { tr: "Sabah gürültüsünü biraz daha düşünmemiz lazım.", en: "Thinking about it." } }], end: "thinking" },
      closing_lost: { id: "closing_lost", lines: [{ speaker: "customer1", text: { tr: "Sanırım gürültüye tahammül edemem, vazgeçiyorum.", en: "Not for me." } }], end: "lost" },
    },
  },
];

/** Career rank required before the "Yatırım Evleri" tab unlocks. */
export const INVESTMENT_UNLOCK_RANK = "Ofis Ortağı";

export function isInvestmentUnlocked(rankTitleText: string): boolean {
  return rankTitleText === INVESTMENT_UNLOCK_RANK;
}
