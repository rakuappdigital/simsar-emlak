import type { HouseScene } from "../types";

export const houseKokuluStudyo: HouseScene = {
  id: "kokulu-studyo",
  title: "Kokulu Stüdyo", titleEn: "Smelly Studio",
  location: "Nişantaşı, 3. kat", locationEn: "Nisantasi, 3rd floor",
  customerNames: ["Ceylin"],
  background: "placeholder-house-1",
  askingPrice: 24000000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    // 1) Karşılama — küçük bir seçim
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Merhaba, ben Ceylin. Eşim biraz gecikecek, trafikte kalmış.", en: "Hi, I'm Ceylin. My husband will be a bit late, he's stuck in traffic." } },
        { speaker: "customer1", name: "Ceylin", text: { tr: "İlk evimiz olacak bu, çok heyecanlıyım açıkçası. Nereden başlayalım?", en: "This will be our first home, I'm really excited honestly. Where should we start?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Hemen genel bir tur atalım, merak ettiğiniz yerde durabiliriz.\"", en: "\"Let's take a quick general tour, we can stop wherever you're curious about.\"" }, next: "enter", effects: { interest: 5 } },
        { id: "b", text: { tr: "\"Eşinizi bekleyelim isterseniz, birlikte gezmeniz daha iyi olur.\"", en: "\"We can wait for your husband if you'd like, it's better if you tour it together.\"" }, next: "enter", effects: { fun: 5 } },
        { id: "c", text: { tr: "\"Bu evi neden beğendiniz, önce onu anlatın.\"", en: "\"Tell me first, why did you like this house?\"" }, next: "enter", effects: { interest: 10 } },
      ],
    },

    // 2) Koku sorunu — ana seçim
    enter: {
      id: "enter",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "(kapı açılır, burnunu çeker) Bu koku... nedir?", en: "(door opens, she sniffs) This smell... what is it?" } },
        { speaker: "customer1", name: "Ceylin", text: { tr: "Girer girmez fark ettim, hiç hoş değil.", en: "I noticed it as soon as I walked in, it's not pleasant at all." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"O... karakter kokusu. Bina eski, kendine özgü bir hikayesi var.\"", en: "\"That's... character scent. The building is old, it has its own unique story.\"" }, next: "q1_a", effects: { suspicion: 15, interest: 10 } },
        { id: "b", text: { tr: "\"Alt katta lostra var, biraz kokuyor ama zamanla alışıyorsunuz.\"", en: "\"There's a shoe shine parlor downstairs, it smells a bit but you get used to it over time.\"" }, next: "q1_b", effects: { suspicion: 0 } },
        { id: "c", text: { tr: "\"Kokuyu mu, yoksa şu ışığın odaya vuruş şeklini mi konuşsak?\"", en: "\"Should we talk about the smell, or the way this light hits the room?\"" }, next: "q1_c", effects: { suspicion: 5 } },
      ],
    },
    q1_a: {
      id: "q1_a",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Karakterli... ilginç bir tabir doğrusu.", en: "Character... an interesting term indeed." } },
        { speaker: "customer1", name: "Ceylin", text: { tr: "Eşim gelince o da fark edecek, ona da mı aynısını söyleyeceksiniz?", en: "My husband will notice it when he arrives too, are you going to tell him the same thing?" } },
      ],
      next: "kitchen",
    },
    q1_b: {
      id: "q1_b",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Hı, en azından gizlemediniz, bunu takdir ediyorum.", en: "Hmm, at least you didn't hide it, I appreciate that." } },
        { speaker: "customer1", name: "Ceylin", text: { tr: "Yine de her gün bu kokuyu solumak biraz zor olur sanki.", en: "Still, breathing in this smell every day feels like it would be a bit tough." } },
      ],
      next: "kitchen",
    },
    q1_c: {
      id: "q1_c",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "(pencereye bakar) Işık güzelmiş, itiraf edeyim.", en: "(looks out the window) The light is nice, I'll admit." } },
        { speaker: "customer1", name: "Ceylin", text: { tr: "Ama konuyu değiştirdiğinizi de fark ettim, o yüzden direkt sorayım o zaman.", en: "But I also noticed you changed the subject, so let me ask directly then." } },
      ],
      next: "health",
    },

    // 3) Mutfak sorusu — ikinci seçim
    kitchen: {
      id: "kitchen",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Mutfak da bayağı küçük duruyor. Burada gerçekten yemek yapılabilir mi?", en: "The kitchen looks pretty small too. Can you really cook here?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Küçük ama fonksiyonel, İstanbul'da stüdyo dairelerde standart bu boyut.\"", en: "\"Small but functional, this is the standard size for studio apartments in Istanbul.\"" }, next: "kitchen_a", effects: { suspicion: 0 } },
        { id: "b", text: { tr: "\"Açıkçası dışarıdan yemek sipariş etmeyi teşvik ediyor, pratik düşünürsek.\"", en: "\"Frankly, it encourages ordering takeout, if we think practically.\"" }, next: "kitchen_b", effects: { fun: 10, suspicion: 5 } },
        { id: "c", text: { tr: "\"Ocağı hiç kullanmayan biri için resmen ideal.\"", en: "\"It's literally ideal for someone who never uses the stove.\"" }, next: "kitchen_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    kitchen_a: {
      id: "kitchen_a",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Mantıklı, belki de beklentim yanlıştı.", en: "Makes sense, maybe my expectations were wrong." } },
        { speaker: "emlah", text: { tr: "Çoğu müşteri ilk başta öyle düşünüyor, sonra alışıyor.", en: "Most clients think so at first, then they get used to it." } },
      ],
      next: "health",
    },
    kitchen_b: {
      id: "kitchen_b",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "(gülümser) Yani siz de burada yemek yapmazdınız diyorsunuz.", en: "(smiles) So you're saying you wouldn't cook here either." } },
        { speaker: "emlah", text: { tr: "Ben hiçbir yerde yemek yapmam ama bu ayrı bir konu.", en: "I don't cook anywhere, but that's a separate issue." } },
      ],
      next: "health",
    },
    kitchen_c: {
      id: "kitchen_c",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "(kahkaha atar) En azından dürüst bir satış taktiği.", en: "(laughs out loud) At least it's an honest sales tactic." } },
        { speaker: "emlah", text: { tr: "Bazen gerçeği komikleştirmek satmaktan daha kolay.", en: "Sometimes making the truth funny is easier than selling." } },
      ],
      next: "health",
    },

    // 4) Sağlık sorusu — üçüncü seçim
    health: {
      id: "health",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Peki bu koku sağlığa zararlı değil mi, uzun vadede?", en: "But isn't this smell harmful to health, in the long run?" } },
        { speaker: "customer1", name: "Ceylin", text: { tr: "Burada yaşayacaksak her gün bunu soluyacağız çünkü.", en: "Because if we live here, we'll be breathing this in every day." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle değil, hatta bazı doktorlar deterjan kokusunun rahatlatıcı olduğunu söylüyor.\"", en: "\"Absolutely not, in fact, some doctors say the smell of detergent is relaxing.\"" }, next: "health_a", effects: { suspicion: 25 } },
        { id: "b", text: { tr: "\"Açıkçası emin değilim ama pencereyi açık tutabilirsiniz.\"", en: "\"Honestly I'm not sure, but you can keep the window open.\"" }, next: "health_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Sağlığa zararlı olsa satışta olmazdı herhalde.\"", en: "\"It probably wouldn't be for sale if it was harmful to health.\"" }, next: "health_c", effects: { suspicion: 0, fun: 15 } },
      ],
    },
    health_a: {
      id: "health_a",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "(şüpheyle bakar) Doktorlar mı demiştiniz, hangi doktorlar?", en: "(looks suspiciously) Did you say doctors? Which doctors?" } },
        { speaker: "thought", text: { tr: "O not defterini hiç sevmedim.", en: "I didn't like that notepad at all." } },
      ],
      next: "price",
    },
    health_b: {
      id: "health_b",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Mantıklı, en azından bir çözüm öneriyorsunuz.", en: "Makes sense, at least you're offering a solution." } },
        { speaker: "emlah", text: { tr: "Alt kattaki dükkan da akşam 7'de kapanıyor, geceleri sorun olmaz zaten.", en: "The shop downstairs closes at 7 PM anyway, it won't be a problem at night." } },
      ],
      next: "price",
    },
    health_c: {
      id: "health_c",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "(gülümser) Sizde bir mantık var, itiraf edeyim.", en: "(smiles) You have a certain logic, I'll admit." } },
        { speaker: "emlah", text: { tr: "İşin doğası böyle, ben de bazen kendime inanmakta zorlanıyorum.", en: "That's the nature of the business, even I have a hard time believing myself sometimes." } },
      ],
      next: "price",
    },

    // 5) Fiyat pazarlığı — kapanış seçimi
    price: {
      id: "price",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Peki fiyat konusunda pazarlık payınız var mı?", en: "So is there room for negotiation on the price?" } },
        { speaker: "customer1", name: "Ceylin", text: { tr: "Çünkü bu haliyle tam istediğim fiyat değil açıkçası.", en: "Because honestly, as it is, it's not quite the price I want." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and get an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Fiyat zaten piyasa değerinin altında, indirim payı yok ama düşünebilirim.\"", en: "\"The price is already below market value, there's no room for discount but I can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0,  suspicion: 0 } },
        { id: "c", text: { tr: "\"Bu fiyata bu evi başka kimse bulamazsınız, hemen karar vermelisiniz.\"", en: "\"You won't find this house for this price anywhere else, you need to decide right away.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Bu iyi bir haber. Eşimle konuşup bugün dönüş yapayım o zaman.", en: "That's good news. Let me talk to my husband and get back to you today then." } },
        { speaker: "customer1", name: "Ceylin", text: { tr: "Aslında ilk izlenimim kadar kötü değilmiş burası.", en: "Actually, this place isn't as bad as my first impression." } },
        { speaker: "emlah", text: { tr: "Memnun olacağınızdan eminim, hayırlısı olsun.", en: "I'm sure you'll be pleased, best of luck." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Eşimle konuşup size dönerim, düşüneceğiz.", en: "I'll talk to my husband and get back to you, we'll think about it." } },
        { speaker: "emlah", text: { tr: "Ne zaman isterseniz arayabilirsiniz, elimde birkaç seçenek daha var.", en: "You can call anytime you want, I have a few more options on hand." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim şimdi.", en: "I just realized you're trying to rush me." } },
        { speaker: "customer1", name: "Ceylin", text: { tr: "Sanırım burası bize göre değil, vaktinizi aldım kusura bakmayın.", en: "I guess this place isn't for us, sorry for taking up your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseHayaletliDaire: HouseScene = {
  id: "hayaletli-daire",
  title: "Hayaletli Daire", titleEn: "Haunted Apartment",
  location: "Cihangir, 2. kat", locationEn: "Cihangir, 2nd floor",
  customerNames: ["Nermin Hanım", "Kaan"],
  background: "placeholder-house-2",
  askingPrice: 35620000,
  tier: 5,
  closingNodes: { sold: "closing_sold_ruh", thinking: "closing_thinking", lost: "closing_lost" },
  startNode: "start",
  nodes: {
    // 1) İlk enerji yorumu — seçim
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "(girer girmez durur) Buranın enerjisi... ağır.", en: "(stops right after entering) The energy here... is heavy." } },
        { speaker: "customer2", name: "Kaan", text: { tr: "Anne, daha bakmadık bile, en azından bir tur atalım.", en: "Mom, we haven't even looked yet, let's at least take a tour." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Haklısınız aslında, bu binanın geçmişi çok eski, bir hikayesi var.\"", en: "\"You're right actually, this building's past is very old, it has a story.\"" }, next: "q1_a", effects: { suspicion: 5, interest: 20 } },
        { id: "b", text: { tr: "\"Enerji falan yok Nermin Hanım, sadece boyası eski.\"", en: "\"There is no energy or anything Nermin Hanım, just the paint is old.\"" }, next: "q1_b", effects: { suspicion: 10 } },
        { id: "c", text: { tr: "\"Ben de hep öyle düşünürüm, evler bize bir şeyler anlatır.\"", en: "\"I always think so too, houses tell us things.\"" }, next: "q1_c", effects: { suspicion: 0, interest: 15 } },
      ],
    },
    q1_a: {
      id: "q1_a",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "(dikkatle bakar) Ne tür bir hikaye? Anlatın bana.", en: "(looks carefully) What kind of story? Tell me." } },
        { speaker: "thought", text: { tr: "Şimdi bir hikaye uydurmam lazım, hem de iyi bir tane.", en: "Now I need to make up a story, and a good one at that." } },
      ],
      next: "rooms",
    },
    q1_b: {
      id: "q1_b",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Siz gençler hep mantıkla açıklıyorsunuz her şeyi.", en: "You young people always explain everything with logic." } },
        { speaker: "customer2", name: "Kaan", text: { tr: "(gülümser) Bence de biraz eski boya kokusu var sadece anne.", en: "(smiles) I also think it's just the smell of old paint, mom." } },
      ],
      next: "rooms",
    },
    q1_c: {
      id: "q1_c",
      lines: [
        { speaker: "customer2", name: "Kaan", text: { tr: "Anne bak, o bile hissediyor, sana söylemiştim!", en: "Look mom, even he feels it, I told you!" } },
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Demek siz de duyarlısınız bu konularda.", en: "So you are also sensitive about these things." } },
      ],
      next: "rooms",
    },

    // 2) Odalar / komşu dedikodusu — seçim
    rooms: {
      id: "rooms",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Komşulardan biri internete 'gece kapı kendi kendine açıldı' diye yazmış.", en: "One of the neighbors wrote on the internet that 'the door opened by itself at night'." } },
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Bunu nasıl açıklıyorsunuz?", en: "How do you explain this?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Muhtemelen rüzgardır, kapı menteşeleri gevşek olabilir.\"", en: "\"It's probably the wind, the door hinges might be loose.\"" }, next: "rooms_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Belki de ev size bir şey söylemeye çalışıyordur.\"", en: "\"Maybe the house is trying to tell you something.\"" }, next: "rooms_b", effects: { interest: 25 } },
        { id: "c", text: { tr: "\"İnternete yazılan her şeye inanmamak lazım.\"", en: "\"You shouldn't believe everything written on the internet.\"" }, next: "rooms_c", effects: { suspicion: 5, fun: 10 } },
      ],
    },
    rooms_a: {
      id: "rooms_a",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Menteşe mi... belki. Ama içim pek rahat etmedi açıkçası.", en: "Hinges... maybe. But my heart isn't at ease, honestly." } },
        { speaker: "customer2", name: "Kaan", text: { tr: "Anne, mantıklı bir açıklama bu.", en: "Mom, this is a logical explanation." } },
      ],
      next: "kaan",
    },
    rooms_b: {
      id: "rooms_b",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "(gözleri parlar) Aynen öyle düşünüyorum ben de!", en: "(eyes sparkle) That's exactly what I think too!" } },
        { speaker: "customer2", name: "Kaan", text: { tr: "(Emlah'a bakar) Siz de mi bu işe girdiniz şimdi...", en: "(looks at Estetan) Are you getting into this now too..." } },
      ],
      next: "kaan",
    },
    rooms_c: {
      id: "rooms_c",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Belki haklısınız, herkes bir şey uyduruyor bu aralar.", en: "Maybe you're right, everyone is making things up these days." } },
        { speaker: "customer2", name: "Kaan", text: { tr: "(gülümser) İlk defa anneme mantıklı bir şey söyleyen biri çıktı.", en: "(smiles) For the first time, someone emerged who said something logical to my mom." } },
      ],
      next: "kaan",
    },

    // 3) Kaan'ın kendi sorusu — seçim
    kaan: {
      id: "kaan",
      lines: [
        { speaker: "customer2", name: "Kaan", text: { tr: "Emlah Bey, açıkçası ben bu hikayelere pek inanmıyorum.", en: "Estetan Bey, frankly I don't really believe in these stories." } },
        { speaker: "customer2", name: "Kaan", text: { tr: "Siz gerçekten burada oturur muydunuz?", en: "Would you really live here?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Açıkçası oturmam ama bu benim tercihim, ev kötü değil.\"", en: "\"Honestly I wouldn't, but that's my preference, the house isn't bad.\"" }, next: "kaan_a", effects: { suspicion: 5, fun: 10 } },
        { id: "b", text: { tr: "\"Elbette, hiç tereddüt etmem.\"", en: "\"Of course, I wouldn't hesitate at all.\"" }, next: "kaan_b", effects: { suspicion: 15 } },
        { id: "c", text: { tr: "\"Onu bana değil, kalbinize sorun.\"", en: "\"Don't ask me that, ask your heart.\"" }, next: "kaan_c", effects: { fun: 20, interest: 10 } },
      ],
    },
    kaan_a: {
      id: "kaan_a",
      lines: [
        { speaker: "customer2", name: "Kaan", text: { tr: "(gülümser) En azından dürüstsünüz, bunu takdir ederim.", en: "(smiles) At least you're honest, I appreciate that." } },
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Kaan, dürüstlük her zaman en iyi cevap değildir.", en: "Kaan, honesty isn't always the best answer." } },
      ],
      next: "price",
    },
    kaan_b: {
      id: "kaan_b",
      lines: [
        { speaker: "customer2", name: "Kaan", text: { tr: "Hiç ikna olmadım ama tamam, devam edelim.", en: "I'm not convinced at all, but okay, let's continue." } },
        { speaker: "thought", text: { tr: "İnanmadığını gözlerinden anladım.", en: "I saw in your eyes that you didn't believe it." } },
      ],
      next: "price",
    },
    kaan_c: {
      id: "kaan_c",
      lines: [
        { speaker: "customer2", name: "Kaan", text: { tr: "(şaşırır) Bu güzel bir cevaptı doğrusu.", en: "(surprised) That was a beautiful answer, actually." } },
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Görüyor musun Kaan, adam felsefe de biliyor.", en: "Do you see Kaan, the man knows philosophy too." } },
      ],
      next: "price",
    },

    // 4) Kapanış seçimi
    price: {
      id: "price",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Peki bu evi almamız için bize ne söylersiniz?", en: "So what can you tell us to make us buy this house?" } },
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Son bir cümle, karar vermeden önce.", en: "One last sentence, before we make a decision." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Bu evin bir ruhu var, Kaan burada kendini gerçekten bulabilir — üstüne %5 de indirim ayarlarım.\"", en: "\"This house has a soul, Kaan can truly find himself here — plus I'll arrange a 5% discount.\"" }, next: "closing_sold_ruh", effects: { closingBias: 35,  interest: 20, discountPercent: 5 } },
        { id: "b", text: { tr: "\"Rasyonel konuşayım: konum, metrekare ve fiyat gerçekten uygun, indirime gerek yok.\"", en: "\"Let me speak rationally: the location, square meters and price are really suitable, no need for a discount.\"" }, next: "closing_thinking", effects: { closingBias: 0,  suspicion: 0 } },
        { id: "c", text: { tr: "\"Bugün karar vermezseniz başka bir aile alır, söyleyeyim.\"", en: "\"If you don't decide today, another family will take it, just saying.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },

    closing_sold_ruh: {
      id: "closing_sold_ruh",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Biz bu daireyi alıyoruz, kararımı verdim.", en: "We are buying this apartment, I've made my decision." } },
        { speaker: "customer2", name: "Kaan", text: { tr: "(Emlah'a göz kırpar) Sağ olun, annemi mutlu ettiniz.", en: "(winks at Estetan) Thanks, you made my mom happy." } },
        { speaker: "emlah", text: { tr: "Ben teşekkür ederim, hayırlı olsun.", en: "Thank you, best of luck." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Mantıklı konuştunuz, biraz daha düşünmemiz lazım yine de.", en: "You spoke logically, but we still need to think about it a bit more." } },
        { speaker: "customer2", name: "Kaan", text: { tr: "Teşekkürler Emlah Bey, size döneriz.", en: "Thanks Estetan Bey, we'll get back to you." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: { tr: "Bu şekilde bastırılmayı hiç sevmem açıkçası.", en: "I really don't like being pressured like this, frankly." } },
        { speaker: "customer2", name: "Kaan", text: { tr: "Anne haklı, biz düşünelim önce.", en: "Mom is right, let's think first." } },
      ],
      end: "lost",
    },
  },
};

export const houseDenizeSifir: HouseScene = {
  id: "denize-sifir",
  title: "Denize Sıfır (Aslında Değil)", titleEn: "Seafront (Not Really)",
  location: "Bakırköy, 5. kat", locationEn: "Bakirkoy, 5th floor",
  customerNames: ["Orhan Bey"],
  background: "placeholder-house-3",
  askingPrice: 19500000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: { tr: "Emlah Bey, ilanda \"denize sıfır\" yazıyordu, doğru mu bu?", en: "Estetan Bey, the listing said \"seafront\", is this true?" } },
        { speaker: "customer1", name: "Orhan Bey", text: { tr: "Ben ömrüm boyunca pencereden deniz görmek istedim.", en: "I've wanted to see the sea from my window all my life." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sıfıra çok yakın sayılır, gelin gösterelim.\"", en: "\"It's considered very close to seafront, let's go show you.\"" }, next: "start_a", effects: { suspicion: 5 } },
        { id: "b", text: { tr: "\"Deniz görünüyor, biraz da yol var araya girmiş.\"", en: "\"The sea is visible, there's also a bit of a road in between.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Denizi hissedeceksiniz, emin olun.\"", en: "\"You will feel the sea, be sure of it.\"" }, next: "start_c", effects: { suspicion: 10, fun: 10 } },
      ],
    },
    start_a: {
      id: "start_a",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "Umarım öyledir, çok heyecanlıyım.", en: "I hope so, I'm very excited." } }],
      next: "manzara",
    },
    start_b: {
      id: "start_b",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "Dürüst olmanızı takdir ediyorum.", en: "I appreciate you being honest." } }],
      next: "manzara",
    },
    start_c: {
      id: "start_c",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "(gözleri parlar) Ne güzel, hadi görelim!", en: "(eyes sparkle) How nice, let's see it!" } }],
      next: "manzara",
    },

    manzara: {
      id: "manzara",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: { tr: "(pencereye gider) Bu... otoyol mu? Deniz nerede?", en: "(goes to the window) Is this... a highway? Where is the sea?" } },
        { speaker: "customer1", name: "Orhan Bey", text: { tr: "Şu küçük mavi parçayı mı kastediyorsunuz?", en: "Do you mean that small blue piece?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Evet, tam orası, sabah ışığında daha net görünüyor.\"", en: "\"Yes, right there, it looks clearer in the morning light.\"" }, next: "manzara_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Açıkçası yol da manzaranın parçası, hareketli bir enerjisi var.\"", en: "\"Honestly, the road is part of the scenery too, it has a dynamic energy.\"" }, next: "manzara_b", effects: { fun: 15 } },
        { id: "c", text: { tr: "\"Deniz kokusu da geliyor rüzgar tersten eserse.\"", en: "\"The smell of the sea comes in too, if the wind blows from the opposite direction.\"" }, next: "manzara_c", effects: { suspicion: 20, fun: 10 } },
      ],
    },
    manzara_a: {
      id: "manzara_a",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "(gözlerini kısar) Sabah ışığı demek...", en: "(squints) Morning light, you say..." } }],
      next: "gurultu",
    },
    manzara_b: {
      id: "manzara_b",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "(güler) İlginç bir bakış açısı doğrusu.", en: "(laughs) An interesting perspective, indeed." } }],
      next: "gurultu",
    },
    manzara_c: {
      id: "manzara_c",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "Rüzgar tersten eserse... anladım.", en: "If the wind blows from the opposite direction... I understand." } }],
      next: "gurultu",
    },

    gurultu: {
      id: "gurultu",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "Peki bu yoldan gelen ses rahatsız etmiyor mu geceleri?", en: "But doesn't the noise from this road bother you at night?" } }],
      choices: [
        { id: "a", text: { tr: "\"Çift cam var, neredeyse hiç duymuyorsunuz.\"", en: "\"There is double glazing, you barely hear it at all.\"" }, next: "gurultu_a" },
        { id: "b", text: { tr: "\"İlk hafta alışıyorsunuz, sonra fark etmiyorsunuz.\"", en: "\"You get used to it the first week, then you don't notice it.\"" }, next: "gurultu_b", effects: { suspicion: 10 } },
        { id: "c", text: { tr: "\"Ben olsam onu deniz dalgası sesi gibi düşünürdüm.\"", en: "\"If it were me, I'd think of it like the sound of sea waves.\"" }, next: "gurultu_c", effects: { fun: 20 } },
      ],
    },
    gurultu_a: {
      id: "gurultu_a",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "Çift cam iyi bir çözüm, rahatladım biraz.", en: "Double glazing is a good solution, I'm a bit relieved." } }],
      next: "kapanis",
    },
    gurultu_b: {
      id: "gurultu_b",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "Alışmak biraz zaman ister sanırım benim yaşımda.", en: "I guess getting used to it takes some time at my age." } }],
      next: "kapanis",
    },
    gurultu_c: {
      id: "gurultu_c",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "(güler) Dalga sesi... hoşuma gitti bu yorum.", en: "(laughs) The sound of waves... I liked this comment." } }],
      next: "kapanis",
    },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: { tr: "Son olarak, gerçekten mutlu olur muyum burada?", en: "Lastly, will I really be happy here?" } }],
      choices: [
        { id: "a", text: { tr: "\"Deniz hayaliniz için başka bir seçeneğe bakmanızı öneririm, dürüst olayım.\"", en: "\"I suggest looking at another option for your sea dream, let me be honest.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "b", text: { tr: "\"Kesinlikle, hem de sahibiyle konuşup %6 indirim ayarlarım.\"", en: "\"Absolutely, and I'll talk to the owner and arrange a 6% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 6 } },
        { id: "c", text: { tr: "\"Bu fiyata bu manzarayı bulamazsınız, karar vermelisiniz.\"", en: "\"You can't find this view at this price, you need to decide.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: { tr: "Dürüstlüğünüzü takdir ediyorum, biraz daha bakınmam lazım.", en: "I appreciate your honesty, I need to look around a bit more." } },
        { speaker: "emlah", text: { tr: "Anlıyorum, deniz hayaliniz için doğru yeri bulmanızı isterim.", en: "I understand, I want you to find the right place for your sea dream." } },
      ],
      end: "thinking",
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: { tr: "İndirimle birlikte mantıklı geldi, alalım o zaman.", en: "With the discount it makes sense, let's buy it then." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, teleskobunuzu da unutmayın.", en: "Best of luck, don't forget your telescope too." } },
      ],
      end: "sold",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: { tr: "Beni aceleye getirdiğinizi hissettim, hoş olmadı.", en: "I felt like you were rushing me, it wasn't pleasant." } },
        { speaker: "customer1", name: "Orhan Bey", text: { tr: "Başka bir yere bakacağım sanırım.", en: "I think I'll look somewhere else." } },
      ],
      end: "lost",
    },
  },
};

export const houseKamburBalkon: HouseScene = {
  id: "kambur-balkon",
  title: "Kambur Balkon", titleEn: "Humpbacked Balcony",
  location: "Kadıköy, 2. kat", locationEn: "Kadikoy, 2nd floor",
  customerNames: ["Ela", "Barış"],
  background: "placeholder-house-4",
  askingPrice: 22500000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Ela", text: { tr: "Buraya bayıldım bile, balkonu görebilir miyiz?", en: "I already love it here, can we see the balcony?" } },
        { speaker: "customer2", name: "Barış", text: { tr: "Acele etme Ela, önce her yeri gezelim.", en: "Don't rush Ela, let's tour everywhere first." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Hemen balkona geçelim, en güzel kısım orası.\"", en: "\"Let's go straight to the balcony, that's the best part.\"" }, next: "start_a", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Barış haklı, önce içeriyi gezelim.\"", en: "\"Baris is right, let's tour the inside first.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Balkon konusunda size bir şey söylemem lazım aslında.\"", en: "\"I actually need to tell you something about the balcony.\"" }, next: "start_c" },
      ],
    },
    start_a: {
      id: "start_a",
      lines: [{ speaker: "customer1", name: "Ela", text: { tr: "(heyecanla) Hadi o zaman, göstersenize!", en: "(excitedly) Come on then, show us!" } }],
      next: "balkon",
    },
    start_b: {
      id: "start_b",
      lines: [{ speaker: "customer2", name: "Barış", text: { tr: "Teşekkürler, aceleye getirmemek lazım.", en: "Thanks, it shouldn't be rushed." } }],
      next: "balkon",
    },
    start_c: {
      id: "start_c",
      lines: [{ speaker: "customer2", name: "Barış", text: { tr: "(kaşlarını çatar) Ne söylemeniz gerekiyor?", en: "(frowns) What do you need to say?" } }],
      next: "balkon",
    },

    balkon: {
      id: "balkon",
      lines: [
        { speaker: "customer2", name: "Barış", text: { tr: "(balkona çıkar) Bu... eğik mi duruyor yoksa gözüm mü yanılıyor?", en: "(steps onto the balcony) Is this... leaning or are my eyes deceiving me?" } },
        { speaker: "customer1", name: "Ela", text: { tr: "Barış, abartma, biraz meyilli sadece.", en: "Baris, don't exaggerate, it's just a little slanted." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Eski binalarda bu normal, statik açıdan sorun yok.\"", en: "\"This is normal in old buildings, structurally there's no problem.\"" }, next: "balkon_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Haklısınız, hafif bir eğim var, ustaya baktırılabilir.\"", en: "\"You're right, there's a slight slant, it could be checked by a repairman.\"" }, next: "balkon_b" },
        { id: "c", text: { tr: "\"Meyilli değil, karakteristik diyelim.\"", en: "\"It's not slanted, let's call it characteristic.\"" }, next: "balkon_c", effects: { suspicion: 10, fun: 15 } },
      ],
    },
    balkon_a: {
      id: "balkon_a",
      lines: [{ speaker: "customer2", name: "Barış", text: { tr: "Statik açıdan derken, bir mühendis mi baktı?", en: "What do you mean structurally, did an engineer check it?" } }],
      next: "guvenlik",
    },
    balkon_b: {
      id: "balkon_b",
      lines: [{ speaker: "customer1", name: "Ela", text: { tr: "En azından çözüm var, rahatladım.", en: "At least there's a solution, I'm relieved." } }],
      next: "guvenlik",
    },
    balkon_c: {
      id: "balkon_c",
      lines: [{ speaker: "customer1", name: "Ela", text: { tr: "(güler) Karakteristik, bunu beğendim.", en: "(laughs) Characteristic, I like that." } }],
      next: "guvenlik",
    },

    guvenlik: {
      id: "guvenlik",
      lines: [{ speaker: "customer2", name: "Barış", text: { tr: "Emin olmak istiyorum, üzerine çıkınca çökmez değil mi?", en: "I want to be sure, it won't collapse when we step on it, right?" } }],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle çökmez, ben şahsen dener geçerim.\"", en: "\"It definitely won't collapse, I personally would test it and stand on it.\"" }, next: "guvenlik_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Ustaya baktırmadan tam garanti veremem açıkçası.\"", en: "\"Honestly, I can't give a full guarantee without a repairman checking it.\"" }, next: "guvenlik_b" },
        { id: "c", text: { tr: "\"Yıllardır böyle duruyor, alışkanlık meselesi.\"", en: "\"It's been like this for years, it's a matter of habit.\"" }, next: "guvenlik_c", effects: { suspicion: 5 } },
      ],
    },
    guvenlik_a: {
      id: "guvenlik_a",
      lines: [{ speaker: "customer2", name: "Barış", text: { tr: "(şüpheyle) Siz mi denediniz, ne zaman?", en: "(suspiciously) You tested it? When?" } }],
      next: "surpriz",
    },
    guvenlik_b: {
      id: "guvenlik_b",
      lines: [{ speaker: "customer1", name: "Ela", text: { tr: "Mantıklı, önce kontrol ettirelim o zaman.", en: "Makes sense, let's get it checked first then." } }],
      next: "surpriz",
    },
    guvenlik_c: {
      id: "guvenlik_c",
      lines: [{ speaker: "customer2", name: "Barış", text: { tr: "Alışkanlık meselesi mi... emin değilim.", en: "A matter of habit... I'm not sure." } }],
      next: "surpriz",
    },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer2", name: "Barış", text: { tr: "(ayağını yere vurur, balkon hafifçe gıcırdar) Bunu duydunuz mu?!", en: "(stomps his foot, the balcony creaks slightly) Did you hear that?!" } },
        { speaker: "customer1", name: "Ela", text: { tr: "(irkilir) Barış, öyle yapma, kalbim ağzıma geldi!", en: "(startled) Baris, don't do that, my heart leaped into my throat!" } },
        { speaker: "emlah", text: { tr: "Sakin olun, eski binalarda böyle sesler normaldir, yapısal bir şey değil.", en: "Calm down, such sounds are normal in old buildings, it's not a structural thing." } },
      ],
      next: "kapanis",
    },

    kapanis: {
      id: "kapanis",
      lines: [
        { speaker: "customer1", name: "Ela", text: { tr: "Barış, bence sorun değil, ben bu evi çok sevdim.", en: "Baris, I think it's not a problem, I really loved this house." } },
        { speaker: "customer2", name: "Barış", text: { tr: "Emin değilim ama... Emlah Bey, siz ne dersiniz?", en: "I'm not sure but... Estetan Bey, what do you say?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Ustaya baktırıp güvenli olduğunu belgeleterek ilerleyelim, üstüne %5 indirim de ayarlarım.\"", en: "\"Let's proceed by having a repairman check it and document that it's safe, plus I'll arrange a 5% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "b", text: { tr: "\"Karar sizin, ben baskı yapmam.\"", en: "\"The decision is yours, I won't pressure you.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu fiyata, bu semtte başka seçenek bulamazsınız.\"", en: "\"At this price, you won't find another option in this neighborhood.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Ela", text: { tr: "Bu bana güven verdi, alalım Barış.", en: "This gave me confidence, let's buy it Baris." } },
        { speaker: "customer2", name: "Barış", text: { tr: "Tamam, belgeler elimizde olsun yeter.", en: "Okay, as long as we have the documents in hand." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", name: "Barış", text: { tr: "Biraz daha düşünelim, önemli bir karar bu.", en: "Let's think a bit more, this is an important decision." } },
        { speaker: "customer1", name: "Ela", text: { tr: "Haber veririz size.", en: "We'll let you know." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer2", name: "Barış", text: { tr: "Bu şekilde acele ettirilmek hoşuma gitmedi.", en: "I didn't like being rushed like this." } },
        { speaker: "customer1", name: "Ela", text: { tr: "Barış haklı, biraz daha bakınalım.", en: "Baris is right, let's look around a bit more." } },
      ],
      end: "lost",
    },
  },
};

export const houseKediCenneti: HouseScene = {
  id: "kedi-cenneti",
  title: "Kedi Cenneti", titleEn: "Cat Paradise",
  location: "Üsküdar, 1. kat", locationEn: "Uskudar, 1st floor",
  customerNames: ["Gül Hanım"],
  background: "placeholder-house-5",
  askingPrice: 21750000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "(burnunu çeker) Vay canına, kaç kedi yaşamış burada böyle?", en: "(sniffs) Wow, how many cats lived here?" } }],
      choices: [
        { id: "a", text: { tr: "\"Önceki sahibi hayvansever biriymiş, siz de seveceksiniz sanırım.\"", en: "\"The previous owner was an animal lover, I guess you'll love it too.\"" }, next: "start_a", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Açıkçası biraz fazla kediymiş, temizlik gerekebilir.\"", en: "\"Frankly, it was a bit too many cats, it might need cleaning.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Belki de ev size bir işaret gönderiyordur.\"", en: "\"Maybe the house is sending you a sign.\"" }, next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "(gülümser) Ben zaten hayvanlara bayılırım.", en: "(smiles) I already adore animals." } }], next: "bahce" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "Dürüstlüğünüzü takdir ederim.", en: "I appreciate your honesty." } }], next: "bahce" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "(gözleri parlar) Belki de haklısınız.", en: "(eyes sparkle) Maybe you're right." } }], next: "bahce" },

    bahce: {
      id: "bahce",
      lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "Bahçe kapısı hep açık mı kalıyormuş, sokak kedileri girer mi?", en: "Was the garden door always left open, do street cats come in?" } }],
      choices: [
        { id: "a", text: { tr: "\"Muhtemelen girer ama siz zaten seviyorsunuz, sorun olmaz.\"", en: "\"They probably do, but you like them anyway, it won't be a problem.\"" }, next: "bahce_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Kilit taktırırsanız kontrol altına alırsınız.\"", en: "\"If you install a lock, you can get it under control.\"" }, next: "bahce_b" },
        { id: "c", text: { tr: "\"Belki de burası resmen bir kedi kafesi kurmak için ideal.\"", en: "\"Maybe this place is literally ideal for setting up a cat cafe.\"" }, next: "bahce_c", effects: { fun: 20 } },
      ],
    },
    bahce_a: { id: "bahce_a", lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "Sorun olmaz gerçekten, ben zaten mutlu olurum.", en: "It really wouldn't be a problem, I'd be happy anyway." } }], next: "temizlik" },
    bahce_b: { id: "bahce_b", lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "Mantıklı, ona bakarız.", en: "Makes sense, we'll look into it." } }], next: "temizlik" },
    bahce_c: { id: "bahce_c", lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "(güler) Bu fikri çok sevdim doğrusu.", en: "(laughs) I really liked this idea, actually." } }], next: "temizlik" },

    temizlik: {
      id: "temizlik",
      lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "Peki bu koku geçer mi sizce, yoksa kalıcı mı?", en: "So do you think this smell will go away, or is it permanent?" } }],
      choices: [
        { id: "a", text: { tr: "\"Derin temizlikle kesinlikle geçer, garanti ederim.\"", en: "\"It will definitely go away with a deep cleaning, I guarantee it.\"" }, next: "temizlik_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Biraz zaman alabilir ama geçer.\"", en: "\"It might take some time, but it will go away.\"" }, next: "temizlik_b" },
        { id: "c", text: { tr: "\"Kedi kokusu sevgi kokusudur bence.\"", en: "\"Cat smell is the smell of love, I think.\"" }, next: "temizlik_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    temizlik_a: { id: "temizlik_a", lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "Garanti ediyorsanız güzel.", en: "If you guarantee it, that's good." } }], next: "kapanis" },
    temizlik_b: { id: "temizlik_b", lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "Zamanla geçer, sabrederim.", en: "It'll pass with time, I can be patient." } }], next: "kapanis" },
    temizlik_c: { id: "temizlik_c", lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "(kahkaha atar) Buna bayıldım.", en: "(laughs out loud) I loved that." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Gül Hanım", text: { tr: "Açıkçası ben bu evle bir bağ kurdum galiba.", en: "Honestly, I think I formed a bond with this house." } }],
      choices: [
        { id: "a", text: { tr: "\"O zaman bu ev tam size göre — üstüne %4 indirim de ekleyelim.\"", en: "\"Then this house is exactly for you — plus let's add a 4% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: { tr: "\"Bir düşünün, acele etmeyin, önemli bir karar.\"", en: "\"Think about it, don't rush, it's an important decision.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bugün karar vermezseniz başka bir hayvansever kapar.\"", en: "\"If you don't decide today, another animal lover will grab it.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Gül Hanım", text: { tr: "Haklısınız, kalbim biliyor. Alıyorum bu evi.", en: "You're right, my heart knows. I'm buying this house." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, kedileriniz de mutlu olur burada.", en: "Best of luck, your cats will be happy here too." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Gül Hanım", text: { tr: "Haklısınız, biraz düşüneyim.", en: "You're right, let me think a bit." } },
        { speaker: "emlah", text: { tr: "Tabii, acele etmeyin.", en: "Sure, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Gül Hanım", text: { tr: "Beni aceleye getirmeniz hoşuma gitmedi açıkçası.", en: "I honestly didn't like you rushing me." } },
        { speaker: "customer1", name: "Gül Hanım", text: { tr: "Biraz daha bakınacağım.", en: "I'll look around a bit more." } },
      ],
      end: "lost",
    },
  },
};

export const houseAsansorsuzZirve: HouseScene = {
  id: "asansorsuz-zirve",
  title: "Asansörsüz Zirve", titleEn: "Elevatorless Peak",
  location: "Şişli, 7. kat", locationEn: "Sisli, 7th floor",
  customerNames: ["Nadir Bey", "Sevim Teyze"],
  background: "placeholder-house-6",
  askingPrice: 25500000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Nadir Bey", text: { tr: "(nefes nefese) Emlah Bey... asansör... nerede?", en: "(panting) Estetan Bey... elevator... where is it?" } },
        { speaker: "customer2", name: "Sevim Teyze", text: { tr: "Nadir, otur biraz, nefesini topla.", en: "Nadir, sit a bit, catch your breath." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Asansör yok maalesef ama manzaraya değer.\"", en: "\"There is no elevator unfortunately, but it's worth the view.\"" }, next: "start_a" },
        { id: "b", text: { tr: "\"Birazdan alışırsınız, spor gibi düşünün.\"", en: "\"You'll get used to it soon, think of it as a workout.\"" }, next: "start_b", effects: { fun: 10, suspicion: 10 } },
        { id: "c", text: { tr: "\"Asansör yapılması planlanıyor aslında.\"", en: "\"An elevator is actually planned to be built.\"" }, next: "start_c", effects: { suspicion: 20 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: { tr: "En azından dürüstsünüz, teşekkürler.", en: "At least you are honest, thanks." } }], next: "manzara" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Nadir Bey", text: { tr: "(gülümser) Spor mu... bakalım.", en: "(smiles) Workout... let's see." } }], next: "manzara" },
    start_c: { id: "start_c", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: { tr: "Ne zaman yapılacakmış peki?", en: "When will it be built then?" } }], next: "manzara" },

    manzara: {
      id: "manzara",
      lines: [{ speaker: "customer2", name: "Sevim Teyze", text: { tr: "(pencereye gider) Ama itiraf edeyim, manzara gerçekten güzelmiş.", en: "(goes to the window) But I'll admit, the view is really beautiful." } }],
      choices: [
        { id: "a", text: { tr: "\"Değil mi? Her gün bu manzarayı görmek büyük bir ayrıcalık.\"", en: "\"Isn't it? Seeing this view every day is a great privilege.\"" }, next: "manzara_a", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Evet ama günde iki kez bu merdivenleri çıkmanız gerekecek.\"", en: "\"Yes, but you will have to climb these stairs twice a day.\"" }, next: "manzara_b" },
        { id: "c", text: { tr: "\"Manzara için her şeye değer, ben olsam düşünmezdim.\"", en: "\"For the view everything is worth it, if I were you I wouldn't even think about it.\"" }, next: "manzara_c", effects: { suspicion: 10 } },
      ],
    },
    manzara_a: { id: "manzara_a", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: { tr: "Ayrıcalık kelimesi çok doğru.", en: "The word privilege is very accurate." } }], next: "saglik" },
    manzara_b: { id: "manzara_b", lines: [{ speaker: "customer1", name: "Nadir Bey", text: { tr: "Doğru, bunu düşünmemiz lazım.", en: "True, we need to think about this." } }], next: "saglik" },
    manzara_c: { id: "manzara_c", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: { tr: "Siz düşünmezdiniz ama biz belki düşünürüz.", en: "You wouldn't think about it, but maybe we will." } }], next: "saglik" },

    saglik: {
      id: "saglik",
      lines: [{ speaker: "customer1", name: "Nadir Bey", text: { tr: "Doktorum merdiven çıkmamı pek istemiyor açıkçası.", en: "My doctor doesn't really want me climbing stairs, honestly." } }],
      choices: [
        { id: "a", text: { tr: "\"O zaman belki bu ev size uygun değil, üzgünüm.\"", en: "\"Then maybe this house isn't suitable for you, I'm sorry.\"" }, next: "saglik_a" },
        { id: "b", text: { tr: "\"Yavaş yavaş çıkarsınız, kalp için de iyi olur belki.\"", en: "\"You can climb slowly, maybe it'll be good for the heart.\"" }, next: "saglik_b", effects: { suspicion: 15 } },
        { id: "c", text: { tr: "\"Torununuz alışverişinizi taşır artık, bahane bu.\"", en: "\"Your grandchild can carry your groceries now, this is an excuse.\"" }, next: "saglik_c", effects: { fun: 15 } },
      ],
    },
    saglik_a: { id: "saglik_a", lines: [{ speaker: "customer1", name: "Nadir Bey", text: { tr: "Dürüstlüğünüzü takdir ediyorum.", en: "I appreciate your honesty." } }], next: "kapanis" },
    saglik_b: { id: "saglik_b", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: { tr: "Doktoruna sormadan olmaz bence.", en: "I think you shouldn't do it without asking your doctor." } }], next: "kapanis" },
    saglik_c: { id: "saglik_c", lines: [{ speaker: "customer1", name: "Nadir Bey", text: { tr: "(güler) O fikri torunuma söylemem lazım.", en: "(laughs) I need to tell my grandchild that idea." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [
        { speaker: "customer2", name: "Sevim Teyze", text: { tr: "Nadir, ne dersin, alalım mı?", en: "Nadir, what do you say, should we buy it?" } },
        { speaker: "customer1", name: "Nadir Bey", text: { tr: "Bilmiyorum ki... nefesim daha yeni düzeldi.", en: "I don't know... my breathing just normalized." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sağlığınız önemli, belki alt katlardan bir seçeneğe bakalım.\"", en: "\"Your health is important, maybe we should look at an option from lower floors.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "b", text: { tr: "\"Bu manzara bir daha çıkmaz karşınıza — üstüne %5 indirim de yaparım.\"", en: "\"You won't come across this view again — plus I'll make a 5% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "c", text: { tr: "\"Merdiven diyet gibi düşünün, alın gitsin.\"", en: "\"Think of the stairs like a diet, just buy it.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer2", name: "Sevim Teyze", text: { tr: "İndirimle birlikte mantıklı geldi, alalım Nadir.", en: "With the discount it made sense, let's buy it Nadir." } },
        { speaker: "customer1", name: "Nadir Bey", text: { tr: "Tamam, bacaklarım güçlenir belki.", en: "Okay, maybe my legs will get stronger." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", name: "Sevim Teyze", text: { tr: "Haklısınız, sağlık önemli, düşünelim.", en: "You are right, health is important, let's think about it." } },
        { speaker: "emlah", text: { tr: "Anlıyorum, acele etmeyin.", en: "I understand, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Nadir Bey", text: { tr: "Bu şekilde bastırılmak hoşuma gitmedi.", en: "I didn't like being pressured like this." } },
        { speaker: "customer2", name: "Sevim Teyze", text: { tr: "Nadir haklı, gidelim biz.", en: "Nadir is right, let's go." } },
      ],
      end: "lost",
    },
  },
};

export const houseNemGalerisi: HouseScene = {
  id: "nem-galerisi",
  title: "Nem Sanat Galerisi", titleEn: "Damp Art Gallery",
  location: "Balat, 3. kat", locationEn: "Balat, 3rd floor",
  customerNames: ["Deniz"],
  background: "placeholder-house-7",
  askingPrice: 15750000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "(duvarlara bakar) Bu lekeler... bilerek mi yapılmış?", en: "(looks at the walls) These spots... were they made on purpose?" } }],
      choices: [
        { id: "a", text: { tr: "\"Doğal oluşmuş ama sanat eseri gibi değil mi?\"", en: "\"Naturally formed, but doesn't it look like a work of art?\"" }, next: "start_a", effects: { fun: 15 } },
        { id: "b", text: { tr: "\"Açıkçası nem sorunu, dürüst olayım.\"", en: "\"Frankly it's a dampness problem, let me be honest.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Sanatçı gözü hemen fark etti demek.\"", en: "\"So the artist's eye noticed it right away.\"" }, next: "start_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "(yakından bakar) Gerçekten ilginç dokular var.", en: "(looks closely) There really are interesting textures." } }], next: "kaynak" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "Dürüstlüğünüzü takdir ederim.", en: "I appreciate your honesty." } }], next: "kaynak" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "(gülümser) Mesleki bir hastalık diyelim.", en: "(smiles) Let's call it an occupational hazard." } }], next: "kaynak" },

    kaynak: {
      id: "kaynak",
      lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "Peki bu nem nereden geliyor, çatıdan mı?", en: "So where is this dampness coming from, the roof?" } }],
      choices: [
        { id: "a", text: { tr: "\"Tam olarak bilmiyorum ama estetik olarak çalışıyor.\"", en: "\"I don't know exactly, but it works aesthetically.\"" }, next: "kaynak_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Çatıdan sızıntı olabilir, kontrol ettirmenizi öneririm.\"", en: "\"There might be a leak from the roof, I suggest you get it checked.\"" }, next: "kaynak_b" },
        { id: "c", text: { tr: "\"Kim bilir, belki bina kendi hikayesini anlatıyor.\"", en: "\"Who knows, maybe the building is telling its own story.\"" }, next: "kaynak_c", effects: { fun: 20 } },
      ],
    },
    kaynak_a: { id: "kaynak_a", lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "Estetik olarak çalışması ilginç bir yaklaşım.", en: "Working aesthetically is an interesting approach." } }], next: "kalicilik" },
    kaynak_b: { id: "kaynak_b", lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "Mantıklı, kontrol ettiririm.", en: "Makes sense, I will get it checked." } }], next: "kalicilik" },
    kaynak_c: { id: "kaynak_c", lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "(gülümser) Bu bakış açısını seviyorum.", en: "(smiles) I love this perspective." } }], next: "kalicilik" },

    kalicilik: {
      id: "kalicilik",
      lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "Bu desenler zamanla değişir mi, yoksa hep böyle mi kalır?", en: "Will these patterns change over time, or always stay like this?" } }],
      choices: [
        { id: "a", text: { tr: "\"Zamanla büyür, yeni desenler oluşur, hep taze bir eser.\"", en: "\"It grows over time, new patterns form, always a fresh piece.\"" }, next: "kalicilik_a", effects: { fun: 15, suspicion: 10 } },
        { id: "b", text: { tr: "\"Onarılırsa kaybolur ama onarmazsanız kalır.\"", en: "\"If repaired it disappears, but if you don't repair it, it stays.\"" }, next: "kalicilik_b" },
        { id: "c", text: { tr: "\"Bu bina sürekli kendini yeniden yaratıyor diyelim.\"", en: "\"Let's say this building is constantly recreating itself.\"" }, next: "kalicilik_c", effects: { suspicion: 15 } },
      ],
    },
    kalicilik_a: { id: "kalicilik_a", lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "Yaşayan bir eser gibi yani, harika.", en: "Like a living piece of art then, wonderful." } }], next: "kapanis" },
    kalicilik_b: { id: "kalicilik_b", lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "Anladım, seçim bana kalmış.", en: "I understand, the choice is up to me." } }], next: "kapanis" },
    kalicilik_c: { id: "kalicilik_c", lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "Bu cümleyi çok sevdim.", en: "I really loved this sentence." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Deniz", text: { tr: "Burada yaşayıp bu duvarları resmedebilirim sanki.", en: "I feel like I could live here and paint these walls." } }],
      choices: [
        { id: "a", text: { tr: "\"Tam da sizin gibi bir sanatçıya ihtiyacı vardı bu evin.\"", en: "\"This house needed an artist exactly like you.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 3 } },
        { id: "b", text: { tr: "\"Nem sorununu çözdürüp öyle taşınmanızı öneririm.\"", en: "\"I suggest you get the dampness problem solved and then move in.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Başka bir sanatçı bu ilhamı kaçırmadan karar verin.\"", en: "\"Decide before another artist snatches this inspiration.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Deniz", text: { tr: "Haklısınız, bu ev bana sesleniyor. Alıyorum.", en: "You're right, this house is calling to me. I'll take it." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, umarım ilham dolu bir atölye olur.", en: "Best of luck, I hope it becomes an inspiring studio." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Deniz", text: { tr: "Haklısınız belki, önce nemi konuşayım sahiple.", en: "Maybe you're right, let me talk to the owner about the dampness first." } },
        { speaker: "emlah", text: { tr: "İyi düşünce, acele etmeyin.", en: "Good idea, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Deniz", text: { tr: "Bu baskıyı sevmedim açıkçası.", en: "I didn't like this pressure, honestly." } },
        { speaker: "customer1", name: "Deniz", text: { tr: "Biraz daha düşüneceğim.", en: "I will think a bit more." } },
      ],
      end: "lost",
    },
  },
};

export const houseDavulcuKomsu: HouseScene = {
  id: "davulcu-komsu",
  title: "Davulcu Komşu", titleEn: "Drummer Neighbor",
  location: "Beşiktaş, 4. kat", locationEn: "Besiktas, 4th floor",
  customerNames: ["Sinan Bey"],
  background: "placeholder-house-8",
  askingPrice: 30750000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "Ben yazarım, en önemli önceliğim sessizlik. Burası sakin mi?", en: "I am a writer, my most important priority is silence. Is this place quiet?" } }],
      choices: [
        { id: "a", text: { tr: "\"Gayet sakin bir bina, yazarlar için ideal.\"", en: "\"It's a very quiet building, ideal for writers.\"" }, next: "start_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Genelde sakin ama bazen bir şeyler duyulabiliyor.\"", en: "\"It's usually quiet, but sometimes you can hear things.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Sessizlik göreceli bir kavram değil mi?\"", en: "\"Isn't silence a relative concept?\"" }, next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "Umarım öyledir, buna ihtiyacım var.", en: "I hope so, I need this." } }], next: "ses" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "Bazen ne kadar sıklıkla oluyor peki?", en: "How often is 'sometimes' then?" } }], next: "ses" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "(hafifçe güler) Felsefi bir emlakçı, ilginç.", en: "(chuckles slightly) A philosophical real estate agent, interesting." } }], next: "ses" },

    ses: {
      id: "ses",
      lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "(aniden bir davul sesi duyulur) Bu... bu neydi şimdi?", en: "(suddenly a drum sound is heard) This... what was that just now?" } }],
      choices: [
        { id: "a", text: { tr: "\"Muhtemelen dışarıdan geliyordur, sokak müzisyeni olabilir.\"", en: "\"It's probably coming from outside, might be a street musician.\"" }, next: "ses_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Alt komşu bateri çalıyor sanırım, akşamları oluyor bu.\"", en: "\"I think the downstairs neighbor plays the drums, this happens in the evenings.\"" }, next: "ses_b" },
        { id: "c", text: { tr: "\"İlham perisi kapınızı çalıyor olabilir.\"", en: "\"Your muse might be knocking on your door.\"" }, next: "ses_c", effects: { fun: 20 } },
      ],
    },
    ses_a: { id: "ses_a", lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "Sokak müzisyeni mi, umarım öyledir.", en: "A street musician? I hope so." } }], next: "surek" },
    ses_b: { id: "ses_b", lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "Akşamları mı... tam yazı yazacağım saatler.", en: "In the evenings... exactly the hours I will be writing." } }], next: "surek" },
    ses_c: { id: "ses_c", lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "(gülümser) Bu ilham perisi biraz gürültücüymüş.", en: "(smiles) This muse is a bit noisy." } }], next: "surek" },

    surek: {
      id: "surek",
      lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "Her akşam mı böyle, yoksa bugüne mi denk geldik?", en: "Is it like this every evening, or did we just happen to catch it today?" } }],
      choices: [
        { id: "a", text: { tr: "\"Bugüne özel olmalı, nadiren oluyordur.\"", en: "\"It must be special to today, it probably happens rarely.\"" }, next: "surek_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Açıkçası her akşam saat 7 gibi başlıyor diye duydum.\"", en: "\"Frankly, I heard it starts every evening around 7 PM.\"" }, next: "surek_b" },
        { id: "c", text: { tr: "\"Belki de yeni bir yazma ritmi bulursunuz bu sesle.\"", en: "\"Maybe you'll find a new writing rhythm with this sound.\"" }, next: "surek_c", effects: { fun: 15 } },
      ],
    },
    surek_a: { id: "surek_a", lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "Umarım nadiren, yoksa sorun olur.", en: "I hope it's rare, otherwise it will be a problem." } }], next: "kapanis" },
    surek_b: { id: "surek_b", lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "Her akşam saat 7... bu ciddi bir sorun.", en: "Every evening at 7... this is a serious problem." } }], next: "kapanis" },
    surek_c: { id: "surek_c", lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "(düşünceli) İlginç bir bakış açısı.", en: "(thoughtfully) An interesting perspective." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Sinan Bey", text: { tr: "Sessizlik olmadan yazamam ben, bu ciddi bir sorun.", en: "I can't write without silence, this is a serious problem." } }],
      choices: [
        { id: "a", text: { tr: "\"Kulaklık önerebilirim ama bu ev size göre olmayabilir.\"", en: "\"I can suggest headphones, but this house might not be for you.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "b", text: { tr: "\"Komşuyla konuşup saatleri ayarlayabiliriz, üstüne %5 indirim de yaparım.\"", en: "\"We can talk to the neighbor and adjust the hours, plus I'll make a 5% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "c", text: { tr: "\"Alışırsınız, hatta ritim ilham verir belki.\"", en: "\"You'll get used to it, maybe the rhythm will even inspire you.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Sinan Bey", text: { tr: "Bu makul bir çözüm, deneyelim o zaman.", en: "This is a reasonable solution, let's try it then." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, yazma verimli geçsin.", en: "Best of luck, may your writing be productive." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Sinan Bey", text: { tr: "Haklısınız, biraz daha düşünmem lazım.", en: "You're right, I need to think a bit more." } },
        { speaker: "emlah", text: { tr: "Anlıyorum, sessizlik önemli bir ihtiyaç.", en: "I understand, silence is an important need." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Sinan Bey", text: { tr: "Ritim ilham vermez, sadece dikkat dağıtır.", en: "Rhythm doesn't inspire, it only distracts." } },
        { speaker: "customer1", name: "Sinan Bey", text: { tr: "Başka bir yere bakacağım.", en: "I will look somewhere else." } },
      ],
      end: "lost",
    },
  },
};

export const houseTapuSorunlu: HouseScene = {
  id: "tapu-sorunlu",
  title: "Tapu Sorunlu Saray", titleEn: "Deed Problematic Palace",
  location: "Bebek, deniz manzaralı", locationEn: "Bebek, sea view",
  customerNames: ["Cavidan Hanım"],
  background: "placeholder-house-9",
  askingPrice: 63750000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Muhteşem bir yer. Tapu durumu tam temiz değil mi demiştiniz?", en: "A magnificent place. Didn't you say the deed situation wasn't completely clean?" } }],
      choices: [
        { id: "a", text: { tr: "\"Küçük bir pürüz var ama önemsiz.\"", en: "\"There is a small hitch, but it's unimportant.\"" }, next: "start_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Açıkçası mirasla ilgili bir işlem sürüyor, avukatınızla kontrol ettirin.\"", en: "\"Frankly, an inheritance procedure is ongoing, have your lawyer check it.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Tapu meseleleri her zaman çözülür, endişelenmeyin.\"", en: "\"Deed matters always get solved, don't worry.\"" }, next: "start_c", effects: { suspicion: 10 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Önemsiz derken, ne kadar önemsiz?", en: "What do you mean unimportant, how unimportant?" } }], next: "detay" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Avukatımı hemen ararım o zaman.", en: "I will call my lawyer right away then." } }], next: "detay" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Umarım öyle olur.", en: "I hope so." } }], next: "detay" },

    detay: {
      id: "detay",
      lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Ne kadar sürer bu işlem sizce?", en: "How long do you think this procedure will take?" } }],
      choices: [
        { id: "a", text: { tr: "\"Birkaç ay içinde biter muhtemelen.\"", en: "\"It will probably end in a few months.\"" }, next: "detay_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Emin değilim, avukatınız net bir tarih verebilir.\"", en: "\"I'm not sure, your lawyer can give a concrete date.\"" }, next: "detay_b" },
        { id: "c", text: { tr: "\"İş dünyasında sabır bir erdemdir, değil mi?\"", en: "\"In the business world, patience is a virtue, isn't it?\"" }, next: "detay_c", effects: { fun: 15 } },
      ],
    },
    detay_a: { id: "detay_a", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Muhtemelen kelimesi beni tedirgin ediyor.", en: "The word 'probably' makes me nervous." } }], next: "risk" },
    detay_b: { id: "detay_b", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Doğru yaklaşım, öyle yapalım.", en: "Right approach, let's do that." } }], next: "risk" },
    detay_c: { id: "detay_c", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "(hafifçe güler) Erdemli olmaya çalışırım.", en: "(chuckles slightly) I try to be virtuous." } }], next: "risk" },

    risk: {
      id: "risk",
      lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Bu süreçte parayı öder de ev elimden giderse?", en: "What if I pay the money during this process and lose the house?" } }],
      choices: [
        { id: "a", text: { tr: "\"Böyle bir risk yok, merak etmeyin.\"", en: "\"There is no such risk, don't worry.\"" }, next: "risk_a", effects: { suspicion: 25 } },
        { id: "b", text: { tr: "\"Avukatınız garantili bir sözleşme hazırlayabilir, riski minimize ederiz.\"", en: "\"Your lawyer can prepare a guaranteed contract, we minimize the risk.\"" }, next: "risk_b" },
        { id: "c", text: { tr: "\"Büyük yatırımlar küçük risklerle gelir.\"", en: "\"Big investments come with small risks.\"" }, next: "risk_c", effects: { suspicion: 15, fun: 10 } },
      ],
    },
    risk_a: { id: "risk_a", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Hiç risk yok demeniz beni rahatlatmadı açıkçası.", en: "Saying there is no risk didn't relieve me, honestly." } }], next: "kapanis" },
    risk_b: { id: "risk_b", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Bu yaklaşım işime gelir.", en: "This approach works for me." } }], next: "kapanis" },
    risk_c: { id: "risk_c", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Felsefeniz ilginç ama param büyük.", en: "Your philosophy is interesting but my money is big." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Avukatımla konuşup net bir cevap isteyeceğim.", en: "I will talk to my lawyer and ask for a clear answer." } }],
      choices: [
        { id: "a", text: { tr: "\"Tabii, tüm belgeleri paylaşırım, şeffaflık önemli.\"", en: "\"Sure, I will share all documents, transparency is important.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "b", text: { tr: "\"Süreç hızlanabilir, sizi bekletmem — üstüne %3 indirim de düşünürüm.\"", en: "\"The process can speed up, I won't make you wait — plus I'll consider a 3% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 3 } },
        { id: "c", text: { tr: "\"Bu fiyata Bebek'te başka seçenek yok, hemen karar verin.\"", en: "\"At this price, there are no other options in Bebek, decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Cavidan Hanım", text: { tr: "İndirim ve hız iyi bir kombinasyon, anlaştık.", en: "Discount and speed is a good combination, we have a deal." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, avukatlar hemen işe başlasın.", en: "Best of luck, let the lawyers start work right away." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Şeffaflığınızı takdir ediyorum, avukatımla konuşayım.", en: "I appreciate your transparency, let me talk to my lawyer." } },
        { speaker: "emlah", text: { tr: "Elbette, belgeleri hemen gönderirim.", en: "Of course, I will send the documents right away." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Bu baskı taktiği bende tam tersi etki yaptı.", en: "This pressure tactic had the exact opposite effect on me." } },
        { speaker: "customer1", name: "Cavidan Hanım", text: { tr: "Başka seçeneklere bakacağım.", en: "I will look at other options." } },
      ],
      end: "lost",
    },
  },
};

export const houseMinicik: HouseScene = {
  id: "minicik",
  title: "Minicik Ama Cesur", titleEn: "Tiny But Brave",
  location: "Tarlabaşı, 18m²", locationEn: "Tarlabasi, 18sqm",
  customerNames: ["Toprak"],
  background: "placeholder-house-10",
  askingPrice: 12380000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "18 metrekare dediniz değil mi? Tam aradığım gibi.", en: "You said 18 square meters, right? Exactly what I'm looking for." } }],
      choices: [
        { id: "a", text: { tr: "\"Evet, minimalizm için mükemmel bir alan.\"", en: "\"Yes, a perfect space for minimalism.\"" }, next: "start_a", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Küçük ama akıllıca tasarlanmış.\"", en: "\"Small but smartly designed.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"18 metrekare değil, 18 metrekarelik özgürlük.\"", en: "\"Not 18 square meters, but 18 square meters of freedom.\"" }, next: "start_c", effects: { fun: 20 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "Kesinlikle, az eşya çok huzur.", en: "Absolutely, less stuff, more peace." } }], next: "alan" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "Akıllıca tasarım tam benlik.", en: "Smart design is exactly my thing." } }], next: "alan" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "(gülümser) Bu cümleyi çok sevdim.", en: "(smiles) I really loved this sentence." } }], next: "alan" },

    alan: {
      id: "alan",
      lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "Peki eşyalarım nereye sığacak, biraz endişeliyim.", en: "So where will my stuff fit, I'm a bit worried." } }],
      choices: [
        { id: "a", text: { tr: "\"Az eşyayla yaşamak zaten hedefiniz değil mi?\"", en: "\"Isn't living with less stuff your goal anyway?\"" }, next: "alan_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Katlanır mobilyalarla oldukça iyi kullanılabiliyor.\"", en: "\"It can be used quite well with foldable furniture.\"" }, next: "alan_b" },
        { id: "c", text: { tr: "\"Eşya biriktirmek zaten kapitalizmin tuzağı.\"", en: "\"Hoarding stuff is the trap of capitalism anyway.\"" }, next: "alan_c", effects: { fun: 20, suspicion: 10 } },
      ],
    },
    alan_a: { id: "alan_a", lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "Haklısınız, hedefim tam olarak bu.", en: "You're right, that's exactly my goal." } }], next: "sosyal" },
    alan_b: { id: "alan_b", lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "Katlanır mobilya fikrini seviyorum.", en: "I love the idea of foldable furniture." } }], next: "sosyal" },
    alan_c: { id: "alan_c", lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "(güler) Tam da düşündüğüm gibi konuşuyorsunuz.", en: "(laughs) You're talking exactly the way I think." } }], next: "sosyal" },

    sosyal: {
      id: "sosyal",
      lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "Arkadaşlarım gelirse ne yapacağız, sığar mıyız?", en: "What will we do if my friends come over, will we fit?" } }],
      choices: [
        { id: "a", text: { tr: "\"İkiden fazla kişi biraz zor olabilir açıkçası.\"", en: "\"More than two people might be a bit difficult, frankly.\"" }, next: "sosyal_a" },
        { id: "b", text: { tr: "\"Sırayla gelirler, kalite zaman böyle olur.\"", en: "\"They can come one by one, that's how you get quality time.\"" }, next: "sosyal_b", effects: { suspicion: 15 } },
        { id: "c", text: { tr: "\"Az arkadaş, öz arkadaş derler.\"", en: "\"Fewer friends, but true friends, as they say.\"" }, next: "sosyal_c", effects: { fun: 15 } },
      ],
    },
    sosyal_a: { id: "sosyal_a", lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "Dürüstlüğünüzü takdir ederim.", en: "I appreciate your honesty." } }], next: "kapanis" },
    sosyal_b: { id: "sosyal_b", lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "Kalite zaman felsefesi hoşuma gitti.", en: "I liked the quality time philosophy." } }], next: "kapanis" },
    sosyal_c: { id: "sosyal_c", lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "(gülümser) Bunu bir yere yazmalıyım.", en: "(smiles) I should write this down somewhere." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Toprak", text: { tr: "Bu ev bir yaşam felsefesi aslında, katılıyor musunuz?", en: "This house is actually a life philosophy, do you agree?" } }],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle, siz bu evin ruhuna tam uyuyorsunuz — üstüne %6 indirim de yapalım.\"", en: "\"Absolutely, you fit the spirit of this house perfectly — plus let's make a 6% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 6 } },
        { id: "b", text: { tr: "\"Felsefe güzel ama pratik detayları da düşünün.\"", en: "\"Philosophy is nice but consider the practical details too.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu felsefeyi yaşamak isteyen çok kişi var, acele edin.\"", en: "\"There are many people who want to live this philosophy, hurry up.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Toprak", text: { tr: "Bu ev ve ben tam bir uyum içindeyiz, alıyorum.", en: "This house and I are in perfect harmony, I'll take it." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, minimalist hayatınız burada başlıyor.", en: "Best of luck, your minimalist life starts here." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Toprak", text: { tr: "Haklısınız, pratik detayları da düşünmem lazım.", en: "You're right, I also need to think about practical details." } },
        { speaker: "emlah", text: { tr: "Elbette, acele etmeyin.", en: "Of course, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Toprak", text: { tr: "Bu aceleci yaklaşım felsefeme aykırı.", en: "This hasty approach is against my philosophy." } },
        { speaker: "customer1", name: "Toprak", text: { tr: "Biraz daha düşüneceğim.", en: "I will think a bit more." } },
      ],
      end: "lost",
    },
  },
};

export const houseAidatSuprizi: HouseScene = {
  id: "aidat-surprizi",
  title: "Aidat Sürprizi", titleEn: "Maintenance Fee Surprise",
  location: "Moda, site içi", locationEn: "Moda, inside a complex",
  customerNames: ["Derya", "Onur"],
  background: "placeholder-house-11",
  askingPrice: 27750000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Derya", text: { tr: "Site çok güzelmiş, havuz da var. Aidat ne kadar?", en: "The complex is very nice, there is a pool too. How much is the maintenance fee?" } }],
      choices: [
        { id: "a", text: { tr: "\"Aidat biraz yüksek ama karşılığını veriyor.\"", en: "\"The maintenance fee is a bit high, but it pays off.\"" }, next: "start_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Açıkçası kira kadar aidat ödüyorsunuz gibi düşünebilirsiniz.\"", en: "\"Frankly, you can think of it as paying rent-sized maintenance fees.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Havuzun keyfinin bir bedeli var tabii.\"", en: "\"Enjoying the pool has a price, of course.\"" }, next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer2", name: "Onur", text: { tr: "Karşılığını verdiğini umuyorum gerçekten.", en: "I really hope it pays off." } }], next: "detay" },
    start_b: { id: "start_b", lines: [{ speaker: "customer2", name: "Onur", text: { tr: "Dürüstlüğünüzü takdir ederim.", en: "I appreciate your honesty." } }], next: "detay" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Derya", text: { tr: "(gülümser) Mantıklı bir bakış açısı.", en: "(smiles) A logical perspective." } }], next: "detay" },

    detay: {
      id: "detay",
      lines: [{ speaker: "customer2", name: "Onur", text: { tr: "Tam rakam nedir peki, net bir şey söyleyin.", en: "So what is the exact figure, give me a concrete number." } }],
      choices: [
        { id: "a", text: { tr: "\"Tam rakamı yönetimden teyit etmemiz lazım.\"", en: "\"We need to confirm the exact figure with the management.\"" }, next: "detay_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Yaklaşık rakamı faturalarla birlikte size gösterebilirim.\"", en: "\"I can show you the approximate figure along with the bills.\"" }, next: "detay_b" },
        { id: "c", text: { tr: "\"Rakamlar değişkenlik gösterebiliyor, esnek düşünün.\"", en: "\"Figures can vary, think flexibly.\"" }, next: "detay_c", effects: { suspicion: 20 } },
      ],
    },
    detay_a: { id: "detay_a", lines: [{ speaker: "customer2", name: "Onur", text: { tr: "Teyit etmeden ilerlemek istemem açıkçası.", en: "I frankly wouldn't want to proceed without confirming." } }], next: "karsilik" },
    detay_b: { id: "detay_b", lines: [{ speaker: "customer1", name: "Derya", text: { tr: "Faturaları görmek işimize yarar, teşekkürler.", en: "Seeing the bills would be useful for us, thanks." } }], next: "karsilik" },
    detay_c: { id: "detay_c", lines: [{ speaker: "customer2", name: "Onur", text: { tr: "Esneklik bütçemde pek yok maalesef.", en: "Unfortunately, I don't have much flexibility in my budget." } }], next: "karsilik" },

    karsilik: {
      id: "karsilik",
      lines: [{ speaker: "customer1", name: "Derya", text: { tr: "Bu parayı öderken tam olarak neye ödüyoruz?", en: "What exactly are we paying for when we pay this money?" } }],
      choices: [
        { id: "a", text: { tr: "\"Havuz, güvenlik, peyzaj, sosyal alanlar, hepsi dahil.\"", en: "\"Pool, security, landscaping, social areas, all included.\"" }, next: "karsilik_a" },
        { id: "b", text: { tr: "\"Açıkçası bazı hizmetler kullanılmasa da ödeniyor.\"", en: "\"Frankly, some services are paid for even if they are not used.\"" }, next: "karsilik_b", effects: { suspicion: 10 } },
        { id: "c", text: { tr: "\"Statü de bir hizmettir bir bakıma.\"", en: "\"Status is also a service in a way.\"" }, next: "karsilik_c", effects: { fun: 20 } },
      ],
    },
    karsilik_a: { id: "karsilik_a", lines: [{ speaker: "customer1", name: "Derya", text: { tr: "Bu liste iyi görünüyor aslında.", en: "This list looks good actually." } }], next: "kapanis" },
    karsilik_b: { id: "karsilik_b", lines: [{ speaker: "customer2", name: "Onur", text: { tr: "Kullanmadığımız için ödemek can sıkıcı.", en: "Paying for what we don't use is annoying." } }], next: "kapanis" },
    karsilik_c: { id: "karsilik_c", lines: [{ speaker: "customer1", name: "Derya", text: { tr: "(güler) Statü faturası, ilginç bir kavram.", en: "(laughs) Status bill, an interesting concept." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer2", name: "Onur", text: { tr: "(Derya'ya bakar) Bütçemize göre biraz zorlar sanki bu.", en: "(looks at Derya) This seems like it will stretch our budget a bit." } }],
      choices: [
        { id: "a", text: { tr: "\"Yönetimle konuşup fiyatta da bir esneklik olur mu bakarım, %5 indirim düşünürüm.\"", en: "\"I'll talk to the management to see if there's any flexibility in the price, I'll consider a 5% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "b", text: { tr: "\"Bu site bu fiyata nadir bulunur, düşünmeyin.\"", en: "\"This complex is rarely found at this price, don't overthink it.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
        { id: "c", text: { tr: "\"Uzun vadede değer kazanır, iyi bir yatırım.\"", en: "\"It gains value in the long term, a good investment.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Derya", text: { tr: "İndirimle birlikte bütçemize uyar, alalım o zaman.", en: "With the discount it fits our budget, let's buy it then." } },
        { speaker: "customer2", name: "Onur", text: { tr: "Tamam, yönetimle görüşmeleri bekliyoruz.", en: "Okay, we are waiting for the discussions with the management." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Derya", text: { tr: "Yatırım olarak mantıklı, biraz daha düşünelim.", en: "Logical as an investment, let's think a bit more." } },
        { speaker: "emlah", text: { tr: "Tabii, acele etmeyin.", en: "Of course, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer2", name: "Onur", text: { tr: "Bu baskı bizi rahatsız etti açıkçası.", en: "This pressure bothered us honestly." } },
        { speaker: "customer1", name: "Derya", text: { tr: "Başka seçeneklere de bakacağız.", en: "We will look at other options as well." } },
      ],
      end: "lost",
    },
  },
};

export const houseEskiFirin: HouseScene = {
  id: "eski-firin",
  title: "Eski Fırın Dairesi", titleEn: "Old Bakery Apartment",
  location: "Balat, fırının üstü", locationEn: "Balat, above the bakery",
  customerNames: ["Melis"],
  background: "placeholder-house-12",
  askingPrice: 17250000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Melis", text: { tr: "(içeri girer girmez) Bu koku... taze ekmek gibi bir şey mi bu?", en: "(right after entering) This smell... is this something like fresh bread?" } }],
      choices: [
        { id: "a", text: { tr: "\"Evet, alt kat eskiden fırınmış, kokusu hâlâ duvarlarda.\"", en: "\"Yes, the downstairs used to be a bakery, the smell is still in the walls.\"" }, next: "start_a" },
        { id: "b", text: { tr: "\"Fark ettiniz mi? Binanın imzası bu.\"", en: "\"Did you notice? This is the building's signature.\"" }, next: "start_b", effects: { fun: 15 } },
        { id: "c", text: { tr: "\"Sadece hayal gücünüz olabilir.\"", en: "\"It might just be your imagination.\"" }, next: "start_c", effects: { suspicion: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Melis", text: { tr: "Ne güzel bir hikaye, bayıldım.", en: "What a beautiful story, I love it." } }], next: "detay" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Melis", text: { tr: "(gülümser) İmza kelimesini sevdim.", en: "(smiles) I liked the word signature." } }], next: "detay" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Melis", text: { tr: "Hayal gücüm bu kadar güçlü değil sanırım.", en: "I guess my imagination isn't that strong." } }], next: "detay" },

    detay: {
      id: "detay",
      lines: [{ speaker: "customer1", name: "Melis", text: { tr: "Fırın hâlâ çalışıyor mu, yoksa kapandı mı?", en: "Is the bakery still working, or is it closed?" } }],
      choices: [
        { id: "a", text: { tr: "\"Kapandı ama koku bir tür anı gibi kalmış.\"", en: "\"It's closed, but the smell remains like a sort of memory.\"" }, next: "detay_a" },
        { id: "b", text: { tr: "\"Bazen geceleri hâlâ çalıştığına dair söylentiler var.\"", en: "\"There are rumors that it still works sometimes at night.\"" }, next: "detay_b", effects: { fun: 20 } },
        { id: "c", text: { tr: "\"Emin değilim açıkçası, sorup öğrenebilirim.\"", en: "\"Honestly I'm not sure, I can ask and find out.\"" }, next: "detay_c", effects: { suspicion: 5 } },
      ],
    },
    detay_a: { id: "detay_a", lines: [{ speaker: "customer1", name: "Melis", text: { tr: "Anı kokusu... çok hoş bir fikir.", en: "Smell of memory... a very nice idea." } }], next: "meslek" },
    detay_b: { id: "detay_b", lines: [{ speaker: "customer1", name: "Melis", text: { tr: "(gözleri parlar) Gece fırını mı, çok ilginç.", en: "(eyes sparkle) Night bakery? Very interesting." } }], next: "meslek" },
    detay_c: { id: "detay_c", lines: [{ speaker: "customer1", name: "Melis", text: { tr: "Sorup öğrenirseniz sevinirim.", en: "I'd appreciate it if you could ask and find out." } }], next: "meslek" },

    meslek: {
      id: "meslek",
      lines: [{ speaker: "customer1", name: "Melis", text: { tr: "Ben şefim, bu koku benim için bir artı mı eksi mi sizce?", en: "I'm a chef, do you think this smell is a plus or a minus for me?" } }],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle artı, sizin gibi biri için ilham kaynağı.\"", en: "\"Definitely a plus, a source of inspiration for someone like you.\"" }, next: "meslek_a", effects: { fun: 15 } },
        { id: "b", text: { tr: "\"Kişisel tercihe kalmış, herkes sevmeyebilir.\"", en: "\"It's down to personal preference, not everyone might like it.\"" }, next: "meslek_b" },
        { id: "c", text: { tr: "\"Belki de bu ev sizi çağırıyordur.\"", en: "\"Maybe this house is calling you.\"" }, next: "meslek_c", effects: { fun: 20, suspicion: 10 } },
      ],
    },
    meslek_a: { id: "meslek_a", lines: [{ speaker: "customer1", name: "Melis", text: { tr: "İlham kaynağı derken haklısınız galiba.", en: "I guess you're right about it being a source of inspiration." } }], next: "kapanis" },
    meslek_b: { id: "meslek_b", lines: [{ speaker: "customer1", name: "Melis", text: { tr: "Ben severim açıkçası, tercih meselesi doğru.", en: "I personally like it, it's a matter of preference, true." } }], next: "kapanis" },
    meslek_c: { id: "meslek_c", lines: [{ speaker: "customer1", name: "Melis", text: { tr: "(gülümser) Beni çağırıyor olabilir gerçekten.", en: "(smiles) It really might be calling me." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Melis", text: { tr: "Açıkçası bu koku beni hiç rahatsız etmedi, tam tersine...", en: "Frankly this smell didn't bother me at all, on the contrary..." } }],
      choices: [
        { id: "a", text: { tr: "\"O zaman bu ev tam size göre yapılmış — üstüne %5 indirim de yapalım.\"", en: "\"Then this house was made exactly for you — plus let's make a 5% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "b", text: { tr: "\"Birkaç gün daha düşünüp karar verin isterseniz.\"", en: "\"Think for a few more days and decide if you want.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Böyle bir yeri kaçırmayın, nadir bulunur.\"", en: "\"Don't miss out on such a place, it's rare.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Melis", text: { tr: "Haklısınız, bu ev bana sesleniyor. Alıyorum.", en: "You're right, this house is calling to me. I'll take it." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, mutfağınız burada efsane olur.", en: "Best of luck, your kitchen here will be legendary." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Melis", text: { tr: "İyi fikir, birkaç gün düşüneyim.", en: "Good idea, let me think for a few days." } },
        { speaker: "emlah", text: { tr: "Tabii, acele etmeyin.", en: "Of course, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Melis", text: { tr: "Bu baskıyı sevmedim açıkçası.", en: "I didn't like this pressure honestly." } },
        { speaker: "customer1", name: "Melis", text: { tr: "Biraz daha düşüneceğim.", en: "I will think about it a bit more." } },
      ],
      end: "lost",
    },
  },
};

export const houseManzaraOmurluk: HouseScene = {
  id: "manzara-omurluk",
  title: "Manzara Ömürlük Değil", titleEn: "View is Not for Life",
  location: "Ataşehir, yüksek kat", locationEn: "Atasehir, high floor",
  customerNames: ["Kerem Bey"],
  background: "placeholder-house-13",
  askingPrice: 39000000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "Bu manzara için buradayım zaten, her şey ikinci planda.", en: "I'm here for this view anyway, everything else is secondary." } }],
      choices: [
        { id: "a", text: { tr: "\"Manzara gerçekten muhteşem, haklısınız.\"", en: "\"The view is truly magnificent, you're right.\"" }, next: "start_a", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Manzara güzel ama uzun vadeyi de konuşalım isterseniz.\"", en: "\"The view is nice, but let's talk about the long term if you want.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Manzara paha biçilemez, doğru kararı veriyorsunuz.\"", en: "\"The view is priceless, you're making the right decision.\"" }, next: "start_c", effects: { suspicion: 10 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "Değil mi? Tam aradığım gibi.", en: "Isn't it? Just what I was looking for." } }], next: "ufuk" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "Uzun vade mi... dinliyorum.", en: "Long term... I'm listening." } }], next: "ufuk" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "(gülümser) İşte bunu duymak istiyordum.", en: "(smiles) That's what I wanted to hear." } }], next: "ufuk" },

    ufuk: {
      id: "ufuk",
      lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "(uzağı işaret eder) Şu küçük vinç de nedir orada?", en: "(points into the distance) What is that small crane over there?" } }],
      choices: [
        { id: "a", text: { tr: "\"Önemsiz bir şey, dikkate almayın.\"", en: "\"An unimportant thing, ignore it.\"" }, next: "ufuk_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Açıkçası orada yeni bir proje başlıyor, ileride manzarayı etkileyebilir.\"", en: "\"Frankly, a new project is starting there, it might affect the view in the future.\"" }, next: "ufuk_b" },
        { id: "c", text: { tr: "\"O da manzaraya dinamizm katıyor bence.\"", en: "\"I think it adds dynamism to the view too.\"" }, next: "ufuk_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    ufuk_a: { id: "ufuk_a", lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "Umarım gerçekten önemsizdir.", en: "I hope it's really unimportant." } }], next: "sure" },
    ufuk_b: { id: "ufuk_b", lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "Bunu bilmem iyi oldu, teşekkürler.", en: "It's good that I knew this, thanks." } }], next: "sure" },
    ufuk_c: { id: "ufuk_c", lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "(güler) İlginç bir bakış açısı.", en: "(laughs) An interesting perspective." } }], next: "sure" },

    sure: {
      id: "sure",
      lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "Etkilerse ne kadar sürede olur bu?", en: "If it affects it, how long will it take?" } }],
      choices: [
        { id: "a", text: { tr: "\"Yıllar sürer muhtemelen, çok düşünmeyin.\"", en: "\"It will probably take years, don't overthink it.\"" }, next: "sure_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"İnşaat ruhsatlarına göre 2-3 yıl içinde olabilir.\"", en: "\"According to construction permits, it could be within 2-3 years.\"" }, next: "sure_b" },
        { id: "c", text: { tr: "\"Kim bilir, belki hiç bitmez o proje.\"", en: "\"Who knows, maybe that project will never end.\"" }, next: "sure_c", effects: { fun: 20 } },
      ],
    },
    sure_a: { id: "sure_a", lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "Yıllar sürerse sorun etmem açıkçası.", en: "If it takes years, I wouldn't mind it frankly." } }], next: "kapanis" },
    sure_b: { id: "sure_b", lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "2-3 yıl... bunu göz önünde bulunduracağım.", en: "2-3 years... I will take this into consideration." } }], next: "kapanis" },
    sure_c: { id: "sure_c", lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "(güler) İstanbul'da hiç bitmeyen inşaat, klasik.", en: "(laughs) Unending construction in Istanbul, classic." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Kerem Bey", text: { tr: "Ben yine de bu manzarayı şimdi yaşamak istiyorum.", en: "I still want to experience this view right now." } }],
      choices: [
        { id: "a", text: { tr: "\"O zaman kararınız doğru — üstüne %3 indirim de ekleyelim.\"", en: "\"Then your decision is right — plus let's add a 3% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 3 } },
        { id: "b", text: { tr: "\"Uzun vadeli düşünmenizi öneririm yine de.\"", en: "\"I still recommend thinking long-term though.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu kat bu fiyata bir daha çıkmaz piyasaya.\"", en: "\"This floor at this price won't hit the market again.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Kerem Bey", text: { tr: "İndirim de iyi oldu, anlaştık, alıyorum.", en: "The discount is good too, deal, I'm buying it." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, manzaranın keyfini çıkarın.", en: "Best of luck, enjoy the view." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Kerem Bey", text: { tr: "Haklısınız, biraz daha düşüneyim.", en: "You're right, let me think a bit more." } },
        { speaker: "emlah", text: { tr: "Elbette, acele etmeyin.", en: "Of course, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Kerem Bey", text: { tr: "Bu baskı taktiği bende tam tersi etki yaptı.", en: "This pressure tactic had the exact opposite effect on me." } },
        { speaker: "customer1", name: "Kerem Bey", text: { tr: "Başka seçeneklere bakacağım.", en: "I will look at other options." } },
      ],
      end: "lost",
    },
  },
};

export const houseGeceKlubu: HouseScene = {
  id: "gece-klubu",
  title: "Gece Kulübü Komşuluğu", titleEn: "Nightclub Neighborhood",
  location: "Taksim, ana cadde üstü", locationEn: "Taksim, on the main street",
  customerNames: ["Aslı"],
  background: "placeholder-house-14",
  askingPrice: 29250000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "Taksim'in tam göbeği, tam istediğim gibi! Gece hayatı nasıl?", en: "Right in the heart of Taksim, just like I wanted! How is the nightlife?" } }],
      choices: [
        { id: "a", text: { tr: "\"Kapınızın önünde diyebiliriz.\"", en: "\"We can say it's at your doorstep.\"" }, next: "start_a", effects: { fun: 15 } },
        { id: "b", text: { tr: "\"Çok hareketli ama biraz da gürültülü olabilir.\"", en: "\"Very lively, but it can be a bit noisy too.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Hiç durmuyor burası, tam sizlik.\"", en: "\"This place never stops, perfectly for you.\"" }, next: "start_c", effects: { fun: 20 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "(heyecanla) Kapımın önünde mi, harika!", en: "(excitedly) At my doorstep? Wonderful!" } }], next: "ses" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "Gürültü beni pek rahatsız etmez açıkçası.", en: "Noise doesn't really bother me frankly." } }], next: "ses" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "(gülümser) Tam da böylesini arıyordum.", en: "(smiles) That's exactly what I was looking for." } }], next: "ses" },

    ses: {
      id: "ses",
      lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "Peki uyku düzenim için sorun olur mu bu?", en: "But will this be a problem for my sleep schedule?" } }],
      choices: [
        { id: "a", text: { tr: "\"Kulaklıkla uyursunuz, alışırsınız.\"", en: "\"You can sleep with earplugs, you'll get used to it.\"" }, next: "ses_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Hafta sonları biraz zor olabilir açıkçası.\"", en: "\"Weekends might be a bit difficult honestly.\"" }, next: "ses_b" },
        { id: "c", text: { tr: "\"Zaten dışarıda olursunuz, kim uyur ki.\"", en: "\"You'll be outside anyway, who sleeps.\"" }, next: "ses_c", effects: { fun: 20, suspicion: 10 } },
      ],
    },
    ses_a: { id: "ses_a", lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "Kulaklık fikri işe yarayabilir.", en: "The earplug idea could work." } }], next: "guvenlik" },
    ses_b: { id: "ses_b", lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "Hafta sonu zaten dışarıdayım, sorun değil.", en: "I'm out on the weekend anyway, not a problem." } }], next: "guvenlik" },
    ses_c: { id: "ses_c", lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "(kahkaha atar) Bu doğru, kim uyur ki.", en: "(laughs out loud) That's true, who sleeps." } }], next: "guvenlik" },

    guvenlik: {
      id: "guvenlik",
      lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "Gece eve dönerken güvenli mi burası?", en: "Is this place safe when returning home at night?" } }],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle güvenli, kalabalık her zaman iyidir.\"", en: "\"Absolutely safe, a crowd is always good.\"" }, next: "guvenlik_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Kalabalık var ama dikkatli olmakta fayda var.\"", en: "\"There is a crowd but it's useful to be careful.\"" }, next: "guvenlik_b" },
        { id: "c", text: { tr: "\"Taksim hiç uyumaz, siz de uyumazsınız.\"", en: "\"Taksim never sleeps, and neither will you.\"" }, next: "guvenlik_c", effects: { fun: 15 } },
      ],
    },
    guvenlik_a: { id: "guvenlik_a", lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "Güvenli olması önemli benim için.", en: "It being safe is important to me." } }], next: "kapanis" },
    guvenlik_b: { id: "guvenlik_b", lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "Dikkatli olurum zaten, sorun değil.", en: "I'll be careful anyway, not a problem." } }], next: "kapanis" },
    guvenlik_c: { id: "guvenlik_c", lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "(güler) Bu sloganı seviyorum.", en: "(laughs) I love this slogan." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Aslı", text: { tr: "Bence burası tam bana göre, enerjisi çok iyi.", en: "I think this place is exactly for me, its energy is very good." } }],
      choices: [
        { id: "a", text: { tr: "\"Enerjinize gerçekten uygun bir yer — üstüne %4 indirim de yapalım.\"", en: "\"A place truly fitting your energy — plus let's do a 4% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: { tr: "\"Bir gece deneyip öyle karar vermenizi öneririm.\"", en: "\"I suggest trying it for one night and deciding then.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu konumda ev nadir çıkıyor, kaçırmayın.\"", en: "\"Houses in this location appear rarely, don't miss it.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Aslı", text: { tr: "İndirimle birlikte tam kararımı verdim, alıyorum.", en: "With the discount I've fully made my decision, I'm buying it." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, Taksim'in kalbinde iyi eğlenceler.", en: "Best of luck, have fun in the heart of Taksim." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Aslı", text: { tr: "İyi fikir, bir gece deneyeyim önce.", en: "Good idea, let me try it for a night first." } },
        { speaker: "emlah", text: { tr: "Akıllıca, acele etmeyin.", en: "Smart, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Aslı", text: { tr: "Bu baskı hoşuma gitmedi açıkçası.", en: "I didn't like this pressure honestly." } },
        { speaker: "customer1", name: "Aslı", text: { tr: "Biraz daha bakınacağım.", en: "I will look around a bit more." } },
      ],
      end: "lost",
    },
  },
};

export const houseGuvercin: HouseScene = {
  id: "guvercin",
  title: "Güvercin Krallığı", titleEn: "Pigeon Kingdom",
  location: "Cihangir, çatı katı", locationEn: "Cihangir, attic",
  customerNames: ["Feridun Bey"],
  background: "placeholder-house-15",
  askingPrice: 24750000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "Çatı katı her zaman hayalimdi. Şu ses de ne, güvercin mi?", en: "An attic has always been my dream. What's that sound, pigeons?" } }],
      choices: [
        { id: "a", text: { tr: "\"Evet, teras onların da evi olmuş biraz.\"", en: "\"Yes, the terrace has become their home a bit too.\"" }, next: "start_a", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Birkaç güvercin var, önlem alınabilir.\"", en: "\"There are a few pigeons, precautions can be taken.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Doğayla iç içe bir yaşam sunuyor bu ev.\"", en: "\"This house offers a life intertwined with nature.\"" }, next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "(gülümser) Paylaşımcı bir ev demek.", en: "(smiles) So it's a sharing house." } }], next: "teras" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "Önlem varsa iyi, merak etmiştim.", en: "If there are precautions that's good, I was wondering." } }], next: "teras" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "Bu cümleyi çok sevdim doğrusu.", en: "I really loved this sentence." } }], next: "teras" },

    teras: {
      id: "teras",
      lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "(terasa çıkar) Vay be, gerçekten çok kalabalıklarmış.", en: "(steps onto the terrace) Wow, they really are very crowded." } }],
      choices: [
        { id: "a", text: { tr: "\"Siz de doğa seviyorsunuz, tam bir uyum olur.\"", en: "\"You love nature too, it would be a perfect harmony.\"" }, next: "teras_a", effects: { fun: 15, suspicion: 5 } },
        { id: "b", text: { tr: "\"Ağ veya çıngıraklı sistemlerle azaltılabilir bu sayı.\"", en: "\"This number can be reduced with netting or bell systems.\"" }, next: "teras_b" },
        { id: "c", text: { tr: "\"Belki de sizi bekliyorlardı.\"", en: "\"Maybe they were waiting for you.\"" }, next: "teras_c", effects: { fun: 20 } },
      ],
    },
    teras_a: { id: "teras_a", lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "Uyum kelimesi tam yerinde.", en: "The word harmony is spot on." } }], next: "temizlik" },
    teras_b: { id: "teras_b", lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "Sistemler işe yarar mı gerçekten?", en: "Do the systems really work?" } }], next: "temizlik" },
    teras_c: { id: "teras_c", lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "(güler) Beni bekliyorlarsa memnun olurum.", en: "(laughs) I'd be pleased if they were waiting for me." } }], next: "temizlik" },

    temizlik: {
      id: "temizlik",
      lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "Peki temizlik konusu nasıl, sorun çıkarır mı?", en: "So how is the cleaning issue, will it cause problems?" } }],
      choices: [
        { id: "a", text: { tr: "\"Düzenli temizlikle hiç sorun olmaz.\"", en: "\"With regular cleaning, it won't be a problem at all.\"" }, next: "temizlik_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Açıkçası biraz emek ister ama hallolur.\"", en: "\"Frankly it requires a bit of effort, but it can be handled.\"" }, next: "temizlik_b" },
        { id: "c", text: { tr: "\"Kuş pisliği bereket getirir derler eskiler.\"", en: "\"Old people say bird droppings bring abundance.\"" }, next: "temizlik_c", effects: { fun: 20, suspicion: 15 } },
      ],
    },
    temizlik_a: { id: "temizlik_a", lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "Düzenli olursam sorun kalmaz sanırım.", en: "I guess if I'm regular there won't be a problem." } }], next: "kapanis" },
    temizlik_b: { id: "temizlik_b", lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "Emek vermeye hazırım açıkçası.", en: "I'm ready to put in the effort frankly." } }], next: "kapanis" },
    temizlik_c: { id: "temizlik_c", lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "(kahkaha atar) Eski sözleri severim.", en: "(laughs out loud) I like old sayings." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Feridun Bey", text: { tr: "Ben bu güvercinlerle iyi anlaşırım galiba, emekliliğe uygun.", en: "I think I will get along well with these pigeons, suitable for retirement." } }],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle, huzurlu bir emeklilik sizi bekliyor — üstüne %5 indirim de yapalım.\"", en: "\"Absolutely, a peaceful retirement awaits you — plus let's make a 5% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "b", text: { tr: "\"Terası kontrol altına alıp sonra taşınmanızı öneririm.\"", en: "\"I recommend getting the terrace under control and then moving in.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu manzara ve terasla bir daha bulamazsınız.\"", en: "\"You won't find it again with this view and terrace.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Feridun Bey", text: { tr: "İndirim de güzel oldu, kararımı verdim, alıyorum.", en: "The discount was nice too, I've made my decision, I'm taking it." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, huzurlu bir emeklilik dilerim.", en: "Best of luck, I wish you a peaceful retirement." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Feridun Bey", text: { tr: "Mantıklı, önce terasla ilgilenelim.", en: "Makes sense, let's take care of the terrace first." } },
        { speaker: "emlah", text: { tr: "Elbette, acele etmeyin.", en: "Of course, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Feridun Bey", text: { tr: "Bu acele hoşuma gitmedi doğrusu.", en: "I didn't really like this rush." } },
        { speaker: "customer1", name: "Feridun Bey", text: { tr: "Biraz daha düşüneceğim.", en: "I will think about it a bit more." } },
      ],
      end: "lost",
    },
  },
};

export const houseKaptanRutubet: HouseScene = {
  id: "kaptan-rutubet",
  title: "Kaptan'ın Rutubeti", titleEn: "Captain's Dampness",
  location: "Moda sahili, zemin kat", locationEn: "Moda coast, ground floor",
  customerNames: ["Kaptan Yusuf"],
  background: "placeholder-house-16",
  askingPrice: 21000000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Dalgaları duyabiliyorum resmen. Tam bana göre burası.", en: "I can literally hear the waves. This place is exactly for me." } }],
      choices: [
        { id: "a", text: { tr: "\"Deniz kenarında olmanın avantajı bu işte.\"", en: "\"That's the advantage of being by the sea.\"" }, next: "start_a", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Deniz yakınlığının küçük bir bedeli de var açıkçası.\"", en: "\"There is a small price for the proximity to the sea, frankly.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Bir kaptan için biçilmiş kaftan.\"", en: "\"A perfect fit for a captain.\"" }, next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Kesinlikle, bir denizci için paha biçilmez.", en: "Absolutely, priceless for a sailor." } }], next: "duvar" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Bedel derken neyi kastediyorsunuz?", en: "What do you mean by a price?" } }], next: "duvar" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "(gülümser) Doğru laf ettiniz.", en: "(smiles) You said the right word." } }], next: "duvar" },

    duvar: {
      id: "duvar",
      lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "(duvara dokunur) Bu tuz lekeleri mi, yoksa nem mi?", en: "(touches the wall) Are these salt stains, or is it dampness?" } }],
      choices: [
        { id: "a", text: { tr: "\"Deniz tuzu, biraz karakteristik bir görünüm veriyor.\"", en: "\"Sea salt, gives a somewhat characteristic look.\"" }, next: "duvar_a", effects: { fun: 15, suspicion: 10 } },
        { id: "b", text: { tr: "\"Rutubet aslında, deniz yakınlığından kaynaklanıyor.\"", en: "\"It's dampness actually, caused by the proximity to the sea.\"" }, next: "duvar_b" },
        { id: "c", text: { tr: "\"Gemilerdeki paslanma gibi düşünün, doğal bir süreç.\"", en: "\"Think of it like rusting on ships, a natural process.\"" }, next: "duvar_c", effects: { suspicion: 15 } },
      ],
    },
    duvar_a: { id: "duvar_a", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Karakteristik dediğiniz doğru olabilir.", en: "What you call characteristic might be true." } }], next: "cozum" },
    duvar_b: { id: "duvar_b", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Rutubet demek, tahmin etmiştim.", en: "So it's dampness, I had guessed." } }], next: "cozum" },
    duvar_c: { id: "duvar_c", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "(güler) Paslanma benzetmesi hoşuma gitti.", en: "(laughs) I liked the rusting analogy." } }], next: "cozum" },

    cozum: {
      id: "cozum",
      lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Bir denizci olarak nem beni korkutmaz ama çözümü var mı?", en: "As a sailor dampness doesn't scare me, but is there a solution?" } }],
      choices: [
        { id: "a", text: { tr: "\"Yalıtımla büyük ölçüde önlenebilir.\"", en: "\"It can be largely prevented with insulation.\"" }, next: "cozum_a" },
        { id: "b", text: { tr: "\"Açıkçası deniz kenarında bu hep bir parça olacak.\"", en: "\"Frankly, this will always be a part of it by the seaside.\"" }, next: "cozum_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Bir kaptan rutubetten korkar mı hiç?\"", en: "\"Would a captain ever be afraid of dampness?\"" }, next: "cozum_c", effects: { fun: 20 } },
      ],
    },
    cozum_a: { id: "cozum_a", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Yalıtım fikri işime gelir.", en: "The insulation idea works for me." } }], next: "surpriz" },
    cozum_b: { id: "cozum_b", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Zaten bekliyordum bu cevabı.", en: "I was already expecting this answer." } }], next: "surpriz" },
    cozum_c: { id: "cozum_c", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "(kahkaha atar) Haklısınız, korkmam ben!", en: "(laughs out loud) You're right, I'm not afraid!" } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "(tam o sırada tavandan bir damla düşer, tam şapkasının üstüne) Vay canına.", en: "(just then a drop falls from the ceiling, right on his hat) Wow." } },
        { speaker: "emlah", text: { tr: "(hızla) O da... deniz esintisinin bir hediyesi sayılır.", en: "(quickly) That too... can be considered a gift from the sea breeze." } },
        { speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "(gülmeye başlar) Denizde daha kötüsünü gördüm ben, sorun değil.", en: "(starts laughing) I've seen worse at sea, it's not a problem." } },
      ],
      next: "kapanis",
    },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Ben bu evle deniz arasında bir bağ hissediyorum.", en: "I feel a bond between this house and the sea." } }],
      choices: [
        { id: "a", text: { tr: "\"O bağ çok değerli — üstüne %4 indirim de ekleyelim.\"", en: "\"That bond is very valuable — plus let's add a 4% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: { tr: "\"Yalıtım yaptırıp öyle taşınmanızı öneririm.\"", en: "\"I recommend getting insulation and moving in then.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu sahil şeridinde böyle fırsat az bulunur.\"", en: "\"Such opportunities are rare on this coastline.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "İndirim de iyi oldu, bu bağı koparmak istemem, alıyorum.", en: "The discount was good too, I wouldn't want to sever this bond, I'm taking it." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun Kaptan, rüzgar arkanızdan essin.", en: "Best of luck Captain, may the wind be at your back." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Mantıklı, önce yalıtımı konuşalım.", en: "Makes sense, let's talk about insulation first." } },
        { speaker: "emlah", text: { tr: "Elbette, acele etmeyin.", en: "Of course, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Bir kaptan baskıyla yönetilmez.", en: "A captain is not managed by pressure." } },
        { speaker: "customer1", name: "Kaptan Yusuf", text: { tr: "Başka limanlara bakacağım.", en: "I will look at other ports." } },
      ],
      end: "lost",
    },
  },
};

export const houseMirasKavgasi: HouseScene = {
  id: "miras-kavgasi",
  title: "Miras Kavgası Evi", titleEn: "Inheritance Fight House",
  location: "Fatih, tarihi bina", locationEn: "Fatih, historical building",
  customerNames: ["Pınar Hanım"],
  background: "placeholder-house-17",
  askingPrice: 23250000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Ben avukatım, önce belgeleri konuşalım isterseniz.", en: "I am a lawyer, let's talk about the documents first if you'd like." } }],
      choices: [
        { id: "a", text: { tr: "\"Tabii, belgeler gayet düzenli, merak etmeyin.\"", en: "\"Sure, the documents are quite in order, don't worry.\"" }, next: "start_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Açıkçası mirasçılar arasında hâlâ bir anlaşmazlık var.\"", en: "\"Frankly, there is still a disagreement among the heirs.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Belgeler formalite, esas önemli olan evin ruhu.\"", en: "\"Documents are a formality, what's really important is the spirit of the house.\"" }, next: "start_c", effects: { suspicion: 20 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Düzenliyse görmek isterim tabii.", en: "If they are in order, I'd like to see them of course." } }], next: "mirasci" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Anlaşmazlık mı, bunu detaylandırın lütfen.", en: "Disagreement? Please detail this." } }], next: "mirasci" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "(kaşlarını çatar) Ben ruhla ilgilenmiyorum, belgeyle ilgileniyorum.", en: "(frowns) I'm not interested in the spirit, I'm interested in the documents." } }], next: "mirasci" },

    mirasci: {
      id: "mirasci",
      lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Kaç mirasçı var ve hepsi satışa razı mı?", en: "How many heirs are there and are they all willing to sell?" } }],
      choices: [
        { id: "a", text: { tr: "\"Üç kardeş var, hepsi de anlaştı zaten.\"", en: "\"There are three siblings, they all agreed already.\"" }, next: "mirasci_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"İkisi anlaştı, biriyle hâlâ görüşülüyor açıkçası.\"", en: "\"Two agreed, one is still being negotiated with, frankly.\"" }, next: "mirasci_b" },
        { id: "c", text: { tr: "\"Aile meseleleri her zaman biraz karmaşıktır.\"", en: "\"Family matters are always a bit complicated.\"" }, next: "mirasci_c", effects: { suspicion: 10 } },
      ],
    },
    mirasci_a: { id: "mirasci_a", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Hepsi anlaştıysa yazılı teyidini isterim.", en: "If they all agreed, I want written confirmation." } }], next: "risk" },
    mirasci_b: { id: "mirasci_b", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Görüşme sonucunu bekleyelim o zaman.", en: "Let's wait for the outcome of the negotiation then." } }], next: "risk" },
    mirasci_c: { id: "mirasci_c", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Karmaşıklık benim işim zaten.", en: "Complexity is my job anyway." } }], next: "risk" },

    risk: {
      id: "risk",
      lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Ben bu süreçte dava riskiyle karşılaşır mıyım?", en: "Will I face the risk of a lawsuit in this process?" } }],
      choices: [
        { id: "a", text: { tr: "\"Hayır, kesinlikle risk yok.\"", en: "\"No, there is absolutely no risk.\"" }, next: "risk_a", effects: { suspicion: 25 } },
        { id: "b", text: { tr: "\"Küçük bir risk var, avukatınızla süreci netleştirmenizi öneririm.\"", en: "\"There is a small risk, I suggest clarifying the process with your lawyer.\"" }, next: "risk_b" },
        { id: "c", text: { tr: "\"Hayatta risksiz hiçbir şey yoktur.\"", en: "\"There is nothing without risk in life.\"" }, next: "risk_c", effects: { fun: 10, suspicion: 15 } },
      ],
    },
    risk_a: { id: "risk_a", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "\"Kesinlikle\" kelimesine hiç güvenmem açıkçası.", en: "I frankly never trust the word \"absolutely\"." } }], next: "kapanis" },
    risk_b: { id: "risk_b", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Bu netleştirme işini severim.", en: "I like this clarifying business." } }], next: "kapanis" },
    risk_c: { id: "risk_c", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: { tr: "Felsefi ama beni ikna etmedi.", en: "Philosophical but it didn't convince me." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [
        { speaker: "customer1", name: "Pınar Hanım", text: { tr: "Son bir şey — kardeşlerden biri satıştan vazgeçmemi istiyor, biri de bir an önce bitsin istiyor.", en: "One last thing — one of the siblings wants me to back out of the sale, and one wants it to finish as soon as possible." } },
        { speaker: "customer1", name: "Pınar Hanım", text: { tr: "Siz olsanız hangi tarafı haklı bulurdunuz?", en: "If it were you, which side would you find right?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"İkisini de kırmadan, şeffaf ilerleyen taraf haklı — belgeleri paylaşırım, süreç hızlanırsa %3 indirim de düşünürüm.\"", en: "\"Without offending either, the transparently proceeding side is right — I will share the documents, if the process speeds up I'll also consider a 3% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, discountPercent: 3 } },
        { id: "b", text: { tr: "\"Bu tarihi doku bu fiyata bir daha çıkmaz, uzatmadan bitirmeniz sizin yararınıza.\"", en: "\"This historical texture won't hit the market at this price again, it's to your benefit to finish without prolonging it.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: { tr: "\"Bu aile içi bir karar, ben sadece süreç hızlıca netleşecek diyebilirim.\"", en: "\"This is a family decision, I can only say the process will clarify quickly.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Pınar Hanım", text: { tr: "Taraf tutmamanız ve şeffaflığınız ikna edici oldu, anlaştık.", en: "Your non-partisanship and transparency were convincing, we have a deal." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, belgeleri hemen hazırlatırım.", en: "Best of luck, I'll have the documents prepared immediately." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Pınar Hanım", text: { tr: "Kardeşlerimle önce ben konuşayım, sizi sonra ararım.", en: "Let me talk to my siblings first, I'll call you later." } },
        { speaker: "emlah", text: { tr: "Anlıyorum, avukatınızla konuşun önce.", en: "I understand, talk to your lawyer first." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Pınar Hanım", text: { tr: "Bir tarafı diğerine karşı aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush one side against the other." } },
        { speaker: "customer1", name: "Pınar Hanım", text: { tr: "Bu baskı taktiği benim mesleğimde işe yaramaz, başka seçeneklere bakacağım.", en: "This pressure tactic doesn't work in my profession, I will look at other options." } },
      ],
      end: "lost",
    },
  },
};

export const houseOgrenciEvi: HouseScene = {
  id: "ogrenci-evi",
  title: "Öğrenci Evi Kalıntısı", titleEn: "Student House Remnant",
  location: "Levent, eski öğrenci evi", locationEn: "Levent, former student house",
  customerNames: ["Ayten Hanım", "Ozan"],
  background: "placeholder-house-18",
  askingPrice: 20620000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Ayten Hanım", text: { tr: "(duvara bakar) Bu yazılar da ne böyle, silinir mi bunlar?", en: "(looks at the wall) What are these writings, can they be erased?" } },
        { speaker: "customer2", name: "Ozan", text: { tr: "Anne bence havalı duruyor bu şekilde.", en: "Mom, I think it looks cool this way." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Bir kat boyayla kolayca kapanır, sorun değil.\"", en: "\"It can be easily covered with a coat of paint, not a problem.\"" }, next: "start_a" },
        { id: "b", text: { tr: "\"Aslında bu evin bir tarihi var, korunabilir de.\"", en: "\"Actually this house has a history, it can be preserved too.\"" }, next: "start_b", effects: { fun: 15 } },
        { id: "c", text: { tr: "\"Öğrenci enerjisi hâlâ duvarlardan hissediliyor.\"", en: "\"The student energy is still felt from the walls.\"" }, next: "start_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: { tr: "İyi, boyayla hallederiz o zaman.", en: "Good, we'll handle it with paint then." } }], next: "temizlik" },
    start_b: { id: "start_b", lines: [{ speaker: "customer2", name: "Ozan", text: { tr: "(heyecanla) Korunsun anne, lütfen!", en: "(excitedly) Let it be preserved mom, please!" } }], next: "temizlik" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: { tr: "Enerji mi... temizlik daha önemli bence.", en: "Energy? Cleaning is more important I think." } }], next: "temizlik" },

    temizlik: {
      id: "temizlik",
      lines: [{ speaker: "customer1", name: "Ayten Hanım", text: { tr: "Peki bu koku, enerji içeceği kokusu mu bu?", en: "So what is this smell, is this an energy drink smell?" } }],
      choices: [
        { id: "a", text: { tr: "\"Derin temizlikle tamamen geçer, garanti.\"", en: "\"It will completely go away with a deep cleaning, guaranteed.\"" }, next: "temizlik_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Biraz havalandırma ve temizlikle azalır.\"", en: "\"It will decrease with a bit of airing and cleaning.\"" }, next: "temizlik_b" },
        { id: "c", text: { tr: "\"Gençlik kokusu diyelim buna.\"", en: "\"Let's call this the smell of youth.\"" }, next: "temizlik_c", effects: { fun: 15 } },
      ],
    },
    temizlik_a: { id: "temizlik_a", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: { tr: "Garanti ediyorsanız güzel.", en: "If you guarantee it, that's good." } }], next: "ozan_soru" },
    temizlik_b: { id: "temizlik_b", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: { tr: "Mantıklı, biraz zaman alır demek.", en: "Makes sense, means it'll take some time." } }], next: "ozan_soru" },
    temizlik_c: { id: "temizlik_c", lines: [{ speaker: "customer2", name: "Ozan", text: { tr: "(güler) Gençlik kokusu, bunu beğendim.", en: "(laughs) Smell of youth, I liked that." } }], next: "ozan_soru" },

    ozan_soru: {
      id: "ozan_soru",
      lines: [{ speaker: "customer2", name: "Ozan", text: { tr: "Bence burası zaten harika, neden değiştirelim ki her şeyi anne?", en: "I think this place is already great, why should we change everything mom?" } }],
      choices: [
        { id: "a", text: { tr: "\"Ozan haklı, karakterini korumak güzel olabilir.\"", en: "\"Ozan is right, preserving its character could be nice.\"" }, next: "ozan_a", effects: { fun: 15 } },
        { id: "b", text: { tr: "\"Biraz düzenleme herkesin işine yarar aslında.\"", en: "\"A bit of organizing would actually benefit everyone.\"" }, next: "ozan_b" },
        { id: "c", text: { tr: "\"İkinizin de haklı olduğu noktalar var.\"", en: "\"There are points where both of you are right.\"" }, next: "ozan_c", effects: { suspicion: 5 } },
      ],
    },
    ozan_a: { id: "ozan_a", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: { tr: "(kaşlarını çatar) Siz de mi Ozan'ın tarafındasınız?", en: "(frowns) Are you on Ozan's side too?" } }], next: "kapanis" },
    ozan_b: { id: "ozan_b", lines: [{ speaker: "customer2", name: "Ozan", text: { tr: "(hayal kırıklığı) Herkes anneme katılıyor tabii.", en: "(disappointment) Everyone agrees with my mom of course." } }], next: "kapanis" },
    ozan_c: { id: "ozan_c", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: { tr: "Diplomatik bir cevap, teşekkürler.", en: "A diplomatic answer, thanks." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [
        { speaker: "customer1", name: "Ayten Hanım", text: { tr: "Ozan, sen burada mutlu olur musun gerçekten?", en: "Ozan, would you really be happy here?" } },
        { speaker: "customer2", name: "Ozan", text: { tr: "Kesinlikle anne, tam bana göre.", en: "Absolutely mom, just for me." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Görüyorsunuz, oğlunuz zaten karar vermiş — üstüne %4 indirim de yapalım.\"", en: "\"You see, your son has already decided — plus let's make a 4% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: { tr: "\"Bir hafta düşünüp öyle karar vermenizi öneririm.\"", en: "\"I recommend thinking for a week and deciding then.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu fiyata bu konumda başka seçenek bulamazsınız.\"", en: "\"You won't find another option in this location at this price.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Ayten Hanım", text: { tr: "İndirim de olunca, tamam, alalım Ozan.", en: "With the discount too, okay, let's take it Ozan." } },
        { speaker: "customer2", name: "Ozan", text: { tr: "(sevinir) Teşekkürler anne!", en: "(rejoices) Thanks mom!" } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Ayten Hanım", text: { tr: "İyi fikir, bir hafta düşünelim.", en: "Good idea, let's think for a week." } },
        { speaker: "customer2", name: "Ozan", text: { tr: "Tamam anne, umarım evet dersin.", en: "Okay mom, I hope you say yes." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Ayten Hanım", text: { tr: "Bu acele bize hiç uymuyor.", en: "This rush doesn't suit us at all." } },
        { speaker: "customer2", name: "Ozan", text: { tr: "Anne haklı, başka yerlere de bakalım.", en: "Mom is right, let's look at other places too." } },
      ],
      end: "lost",
    },
  },
};

export const houseKapiciHayvan: HouseScene = {
  id: "kapici-hayvan",
  title: "Kapıcının Hayvan Şubesi", titleEn: "Janitor's Animal Branch",
  location: "Kadıköy, 1. kat", locationEn: "Kadikoy, 1st floor",
  customerNames: ["Zeynep"],
  background: "placeholder-house-19",
  askingPrice: 23620000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "(hapşırır) Pardon, alerjim var da, burada hayvan var mı?", en: "(sneezes) Sorry, I have an allergy, are there animals here?" } }],
      choices: [
        { id: "a", text: { tr: "\"Hayır, hiç hayvan yok, merak etmeyin.\"", en: "\"No, no animals at all, don't worry.\"" }, next: "start_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Açıkçası kapıcı bodrumda birkaç sokak hayvanına bakıyor.\"", en: "\"Frankly, the janitor looks after a few street animals in the basement.\"" }, next: "start_b" },
        { id: "c", text: { tr: "\"Sadece bina dışında, içeriyi etkilemez.\"", en: "\"Only outside the building, it won't affect the inside.\"" }, next: "start_c", effects: { suspicion: 10 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Umarım gerçekten yoktur, alerjim ciddi.", en: "I hope there really isn't, my allergy is serious." } }], next: "mesafe" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Bodrumda mı... bu beni endişelendiriyor.", en: "In the basement... this worries me." } }], next: "mesafe" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Etkilemediğinden emin misiniz?", en: "Are you sure it doesn't affect it?" } }], next: "mesafe" },

    mesafe: {
      id: "mesafe",
      lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Bodrum buraya ne kadar yakın, kokusu ya da tüyleri gelir mi?", en: "How close is the basement to here, would the smell or fur come up?" } }],
      choices: [
        { id: "a", text: { tr: "\"Hiç gelmez, tamamen ayrı bir alan.\"", en: "\"It wouldn't come at all, it's a completely separate area.\"" }, next: "mesafe_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Bazen hafif gelebilir, pencereleri kapalı tutmanız iyi olur.\"", en: "\"It might come slightly sometimes, it's good to keep the windows closed.\"" }, next: "mesafe_b" },
        { id: "c", text: { tr: "\"Belki biraz alışkanlık meselesidir.\"", en: "\"Maybe it's a bit of a matter of habit.\"" }, next: "mesafe_c", effects: { suspicion: 10 } },
      ],
    },
    mesafe_a: { id: "mesafe_a", lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Umarım öyledir gerçekten.", en: "I hope it really is so." } }], next: "kapici" },
    mesafe_b: { id: "mesafe_b", lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Pencere kapalı tutmak mantıklı bir öneri.", en: "Keeping the window closed is a logical suggestion." } }], next: "kapici" },
    mesafe_c: { id: "mesafe_c", lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Alerji alışkanlıkla geçmez maalesef.", en: "An allergy doesn't pass with habit unfortunately." } }], next: "kapici" },

    kapici: {
      id: "kapici",
      lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Kapıcıyla konuşup bunu azaltması mümkün mü?", en: "Is it possible to talk to the janitor and have him reduce it?" } }],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle, o konuda çok esnek biridir.\"", en: "\"Absolutely, he is very flexible on that matter.\"" }, next: "kapici_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Konuşabiliriz ama kesin söz veremem.\"", en: "\"We can talk, but I can't give a firm promise.\"" }, next: "kapici_b" },
        { id: "c", text: { tr: "\"O hayvanları kendi çocuğu gibi seviyor açıkçası, zor olabilir.\"", en: "\"He loves those animals like his own children frankly, it might be difficult.\"" }, next: "kapici_c", effects: { fun: 15 } },
      ],
    },
    kapici_a: { id: "kapici_a", lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Esnekse belki bir çözüm buluruz.", en: "If he's flexible, maybe we can find a solution." } }], next: "kapanis" },
    kapici_b: { id: "kapici_b", lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Dürüstlüğünüzü takdir ederim.", en: "I appreciate your honesty." } }], next: "kapanis" },
    kapici_c: { id: "kapici_c", lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "(gülümser) Sevimli ama benim için zor bir durum.", en: "(smiles) Cute, but a difficult situation for me." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Zeynep", text: { tr: "Alerjim ciddi, bu konuda net bir cevaba ihtiyacım var.", en: "My allergy is serious, I need a clear answer on this matter." } }],
      choices: [
        { id: "a", text: { tr: "\"Kapıcıyla konuşup düzenlemeyi hemen ayarlarım — üstüne %4 indirim de yaparım.\"", en: "\"I will talk to the janitor and arrange the settlement immediately — plus I'll make a 4% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: { tr: "\"Dürüst olmak gerekirse, bu ev sizin için riskli olabilir.\"", en: "\"To be honest, this house might be risky for you.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Merak etmeyin, hiç sorun yaşamazsınız.\"", en: "\"Don't worry, you won't experience any problems at all.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Zeynep", text: { tr: "Düzenleme ve indirimle birlikte içim rahat etti, alıyorum.", en: "With the settlement and discount my mind is at ease, I'm taking it." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, kapıcıyla hemen konuşurum.", en: "Best of luck, I will talk to the janitor right away." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Zeynep", text: { tr: "Dürüstlüğünüzü takdir ediyorum, biraz düşüneyim.", en: "I appreciate your honesty, let me think a bit." } },
        { speaker: "emlah", text: { tr: "Sağlığınız önemli, acele etmeyin.", en: "Your health is important, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Zeynep", text: { tr: "\"Hiç sorun yaşamazsınız\" cümlesi beni ikna etmedi.", en: "The phrase \"you won't experience any problems at all\" didn't convince me." } },
        { speaker: "customer1", name: "Zeynep", text: { tr: "Başka seçeneklere bakacağım.", en: "I will look at other options." } },
      ],
      end: "lost",
    },
  },
};

export const houseZeminVitrin: HouseScene = {
  id: "zemin-vitrin",
  title: "Zemin Kat Vitrin", titleEn: "Ground Floor Showcase",
  location: "Nişantaşı, eski dükkân", locationEn: "Nisantasi, old shop",
  customerNames: ["Derin"],
  background: "placeholder-house-20",
  askingPrice: 33000000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Derin", text: { tr: "(pencereye bakar) Dur, bu cam hiç perde falan yok mu?", en: "(looks at the window) Wait, does this glass have no curtains or anything?" } }],
      choices: [
        { id: "a", text: { tr: "\"Şu an yok ama takılabilir tabii.\"", en: "\"Not right now, but they can be installed of course.\"" }, next: "start_a" },
        { id: "b", text: { tr: "\"Doğal ışık için harika, değil mi?\"", en: "\"Great for natural light, isn't it?\"" }, next: "start_b", effects: { suspicion: 15 } },
        { id: "c", text: { tr: "\"Vitrin ruhu hâlâ evin karakterinde.\"", en: "\"The showcase spirit is still in the character of the house.\"" }, next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Derin", text: { tr: "Takılabilirse rahatladım biraz.", en: "If they can be installed I'm a bit relieved." } }], next: "mahremiyet" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Derin", text: { tr: "Işık güzel ama mahremiyet daha önemli benim için.", en: "The light is nice, but privacy is more important to me." } }], next: "mahremiyet" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Derin", text: { tr: "(gülümser) Vitrin ruhu ilginç bir tabir.", en: "(smiles) Showcase spirit is an interesting term." } }], next: "mahremiyet" },

    mahremiyet: {
      id: "mahremiyet",
      lines: [{ speaker: "customer1", name: "Derin", text: { tr: "Ben biraz tanınan biriyim, insanlar içeri bakar mı sizce?", en: "I'm somewhat well-known, do you think people will look inside?" } }],
      choices: [
        { id: "a", text: { tr: "\"Muhtemelen bakarlar ama alışırsınız.\"", en: "\"They probably will, but you'll get used to it.\"" }, next: "mahremiyet_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Perde veya folyo ile tamamen çözülür bu.\"", en: "\"This can be completely solved with curtains or foil.\"" }, next: "mahremiyet_b" },
        { id: "c", text: { tr: "\"Belki de hayranlarınızla daha yakın olursunuz.\"", en: "\"Maybe you'll be closer with your fans.\"" }, next: "mahremiyet_c", effects: { fun: 20 } },
      ],
    },
    mahremiyet_a: { id: "mahremiyet_a", lines: [{ speaker: "customer1", name: "Derin", text: { tr: "Alışmak istediğim bir şey değil bu açıkçası.", en: "It's frankly not something I want to get used to." } }], next: "guvenlik" },
    mahremiyet_b: { id: "mahremiyet_b", lines: [{ speaker: "customer1", name: "Derin", text: { tr: "Folyo fikri işime gelir.", en: "The foil idea works for me." } }], next: "guvenlik" },
    mahremiyet_c: { id: "mahremiyet_c", lines: [{ speaker: "customer1", name: "Derin", text: { tr: "(güler) Bu kadar yakın olmak istemem doğrusu.", en: "(laughs) I wouldn't want to be this close, actually." } }], next: "guvenlik" },

    guvenlik: {
      id: "guvenlik",
      lines: [{ speaker: "customer1", name: "Derin", text: { tr: "Peki güvenlik açısından sorun olur mu, biri içeri bakabilir mi?", en: "So would there be a problem in terms of security, could someone look inside?" } }],
      choices: [
        { id: "a", text: { tr: "\"Hiç sorun olmaz, merak etmeyin.\"", en: "\"It wouldn't be a problem at all, don't worry.\"" }, next: "guvenlik_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Güvenlik filmi ve kalın perdeyle ciddi oranda azaltılır.\"", en: "\"It is significantly reduced with security film and thick curtains.\"" }, next: "guvenlik_b" },
        { id: "c", text: { tr: "\"Ünlü olmanın küçük bedelleri var tabii.\"", en: "\"Being famous has small prices, of course.\"" }, next: "guvenlik_c", effects: { fun: 15 } },
      ],
    },
    guvenlik_a: { id: "guvenlik_a", lines: [{ speaker: "customer1", name: "Derin", text: { tr: "\"Hiç sorun olmaz\" cümlesine güvenmem açıkçası.", en: "I frankly wouldn't trust the sentence \"It wouldn't be a problem at all\"." } }], next: "kapanis" },
    guvenlik_b: { id: "guvenlik_b", lines: [{ speaker: "customer1", name: "Derin", text: { tr: "Güvenlik filmi mantıklı bir çözüm.", en: "Security film is a logical solution." } }], next: "kapanis" },
    guvenlik_c: { id: "guvenlik_c", lines: [{ speaker: "customer1", name: "Derin", text: { tr: "(gülümser) Bu bedeli zaten ödüyorum sürekli.", en: "(smiles) I'm already paying this price constantly." } }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Derin", text: { tr: "Sosyal medyada da harika içerik çıkar buradan aslında.", en: "Great content for social media would actually come out of here too." } }],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle, hem yaşam hem içerik alanı bir arada — üstüne %3 indirim de yapalım.\"", en: "\"Absolutely, both living and content space together — plus let's make a 3% discount.\"" }, next: "closing_sold", effects: { closingBias: 35,  discountPercent: 3 } },
        { id: "b", text: { tr: "\"Perde/folyo çözümünü halledip öyle karar verin.\"", en: "\"Get the curtain/foil solution sorted and decide then.\"" }, next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu vitrin konsepti bu fiyata bir daha çıkmaz.\"", en: "\"This showcase concept won't hit the market again at this price.\"" }, next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Derin", text: { tr: "İndirim de güzel oldu, içerik ve ev bir arada, alıyorum.", en: "The discount was nice too, content and house together, I'm taking it." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, takipçileriniz bayılacak.", en: "Best of luck, your followers will love it." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Derin", text: { tr: "İyi fikir, önce folyo çözümünü halledeyim.", en: "Good idea, let me sort out the foil solution first." } },
        { speaker: "emlah", text: { tr: "Elbette, acele etmeyin.", en: "Of course, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Derin", text: { tr: "Bu baskı taktiği hoşuma gitmedi doğrusu.", en: "I didn't really like this pressure tactic." } },
        { speaker: "customer1", name: "Derin", text: { tr: "Başka seçeneklere bakacağım.", en: "I will look at other options." } },
      ],
      end: "lost",
    },
  },
};

export const houseDisliSaatKulesi: HouseScene = {
  id: "dislisaat-kulesi",
  title: "Dişli Saat Kulesi", titleEn: "Geared Clock Tower",
  location: "Beyoğlu, dev saat kulesi içi", locationEn: "Beyoglu, inside a giant clock tower",
  customerNames: [],
  dynamicCast: [{ gender: "k" }],
  background: "placeholder-house-21",
  askingPrice: 51000000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.6, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "(nefes nefese) Merhaba, ben {isim}. O merdiveni tırmanmak resmen spor salonu yerine geçti.", en: "(panting) Hello, I'm {isim}. Climbing those stairs literally replaced the gym." } },
        { speaker: "customer1", text: { tr: "Ama itiraf edeyim, dev saat kadranının içinden şehri görünce her şeye değdi.", en: "But I admit, seeing the city from inside the giant clock dial made it all worth it." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Kapıcı yerine kondüktör diyoruz burada, alışırsınız.\"", en: "\"We say conductor instead of janitor here, you'll get used to it.\"" }, next: "enter", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Manzara gerçekten burada satışın en güçlü kartı.\"", en: "\"The view is truly the strongest selling card here.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "c", text: { tr: "\"O merdiven ısınma turuydu sadece, asıl kısma daha gelmedik.\"", en: "\"Those stairs were just the warm-up, we haven't come to the main part yet.\"" }, next: "enter", effects: { fun: 5, suspicion: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Şimdi biraz teknik bir kısım var: eve girmek için şu dönen dişlilerin arasından geçeceğiz.", en: "Now there's a bit of a technical part: to enter the house we will pass between these rotating gears." } },
        { speaker: "customer1", text: { tr: "(gözleri büyür) Yani gerçekten dişlilerin arasından mı geçeceğiz, şaka değil?", en: "(eyes widen) So we're really going to pass between the gears, no joke?" } },
        { speaker: "customer1", text: { tr: "Saatin akrep ve yelkovanı çalışırken bunu her gün yapmam mı gerekiyor?", en: "Do I have to do this every day while the hour and minute hands of the clock are working?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Zamanlama meselesi sadece, ritmini yakalayınca bale gibi oluyor.\"", en: "\"It's just a matter of timing, once you catch its rhythm it's like ballet.\"" }, next: "q1_a", effects: { suspicion: 10, fun: 10 } },
        { id: "b", text: { tr: "\"Aslında dişliler yavaşladığında 40 saniyelik güvenli bir pencere açılıyor.\"", en: "\"Actually, when the gears slow down, a 40-second safe window opens.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: { tr: "\"Komşularınız da aynı şeyi yapıyor, sosyal bir ritüel haline geldi resmen.\"", en: "\"Your neighbors do the same thing, it's literally become a social ritual.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Bale derken... risk payını hafife almış olmayalım?", en: "Ballet? Let's not underestimate the risk factor." } }], next: "sound" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "40 saniye, tamam bu biraz daha güven verici oldu.", en: "40 seconds, okay that's a bit more reassuring." } }], next: "sound" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Sosyal ritüel derken tam olarak kaç kişi bu işi başarabiliyor?", en: "(laughs) When you say social ritual, exactly how many people can manage this?" } }], next: "sound" },

    sound: {
      id: "sound",
      lines: [
        { speaker: "customer1", text: { tr: "Bir de şu tik-tak sesi var, mekanizma hiç durmuyor galiba.", en: "And there's this tick-tock sound, the mechanism never stops I guess." } },
        { speaker: "customer1", text: { tr: "Gece uyurken bu ses insanı rahatsız etmez mi?", en: "Wouldn't this sound bother someone while sleeping at night?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"İlk hafta duyarsınız, sonra beyniniz onu filtrelemeyi öğreniyor.\"", en: "\"You'll hear it the first week, then your brain learns to filter it out.\"" }, next: "sound_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Kulaklık öneririm açıkçası, ama saat başı çanı gerçekten muhteşem.\"", en: "\"I recommend headphones frankly, but the hourly chime is truly magnificent.\"" }, next: "sound_b", effects: { suspicion: 0, fun: 5 } },
        { id: "c", text: { tr: "\"Bazı insanlar buna beyaz gürültü diyor, uyku kalitenizi artırabilir bile.\"", en: "\"Some people call it white noise, it might even increase your sleep quality.\"" }, next: "sound_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    sound_a: { id: "sound_a", lines: [{ speaker: "thought", text: { tr: "'Beyin filtrelemeyi öğrenir' cümlesi hiç güven verici değildi.", en: "The sentence 'the brain learns to filter' wasn't reassuring at all." } }], next: "safety" },
    sound_b: { id: "sound_b", lines: [{ speaker: "customer1", text: { tr: "Saat başı çanı derken... her saat başı mı?", en: "Hourly chime? Every single hour?" } }], next: "safety" },
    sound_c: { id: "sound_c", lines: [{ speaker: "customer1", text: { tr: "(kahkaha) Beyaz gürültü, ilginç bir pazarlama açısı doğrusu.", en: "(laughs out loud) White noise, an interesting marketing angle indeed." } }], next: "safety" },

    safety: {
      id: "safety",
      lines: [
        { speaker: "customer1", text: { tr: "Peki ya dişlilerin arasında sıkışma riski, sigorta bu konuda ne diyor?", en: "So what about the risk of getting stuck between the gears, what does insurance say about this?" } },
        { speaker: "customer1", text: { tr: "Yani bu ciddi bir güvenlik sorunu gibi görünüyor bana.", en: "I mean, this looks like a serious security issue to me." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Şimdiye kadar hiç ciddi bir vaka olmadı, gerçi kayıtlar biraz eksik.\"", en: "\"There hasn't been a serious case so far, though the records are a bit incomplete.\"" }, next: "safety_a", effects: { suspicion: 25 } },
        { id: "b", text: { tr: "\"Acil durumlarda dişlileri durduran bir manuel kol var, gösterebilirim.\"", en: "\"There is a manual lever that stops the gears in emergencies, I can show you.\"" }, next: "safety_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Risk olmasa bu manzara bu fiyata olmazdı zaten.\"", en: "\"If there was no risk, this view wouldn't be at this price anyway.\"" }, next: "safety_c", effects: { suspicion: 0, fun: 10 } },
      ],
    },
    safety_a: { id: "safety_a", lines: [{ speaker: "customer1", text: { tr: "\"Kayıtlar eksik\" dediğinizi resmen not aldım.", en: "I literally noted you saying \"records are incomplete\"." } }], next: "price" },
    safety_b: { id: "safety_b", lines: [{ speaker: "customer1", text: { tr: "Manuel kol olması içimi biraz rahatlattı.", en: "Having a manual lever put my mind at ease a bit." } }], next: "price" },
    safety_c: { id: "safety_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Sizde bir mantık var, kabul etmeliyim.", en: "(smiles) You have a point, I must admit." } }], next: "price" },

    price: {
      id: "price",
      lines: [
        { speaker: "customer1", text: { tr: "Peki fiyatta biraz esneklik var mı, dişlilerle yaşamanın bir bedeli olmalı.", en: "So is there a bit of flexibility in the price, living with gears must have a price." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %7 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 7% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 7 } },
        { id: "b", text: { tr: "\"Fiyat şehrin en özgün manzarasına göre zaten makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable compared to the city's most unique view, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu kule bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This tower won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirim güzel oldu, dişlilerle dans etmeyi öğrenirim artık.", en: "The discount is nice, I guess I'll learn to dance with the gears now." } },
        { speaker: "emlah", text: { tr: "Zamanla ritmini yakalarsınız, hayırlı olsun.", en: "You'll catch its rhythm over time, best of luck." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Biraz daha düşüneyim, dişli mesafesini bir de gündüz görmek isterim.", en: "Let me think a bit more, I'd like to see the gear distance during the day too." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu kule bana göre değil, vaktinizi aldım.", en: "I guess this tower isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseBatakliKoyEvi: HouseScene = {
  id: "batakli-koy-evi",
  title: "Bataklı Köy Evi", titleEn: "Swamp Village House",
  location: "Ağva, bataklık kıyısı", locationEn: "Agva, swamp coast",
  customerNames: [],
  dynamicCast: [{ gender: "k" }, { gender: "k" }],
  background: "placeholder-house-22",
  askingPrice: 10880000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da kardeşim {isim2}. Ucuz bir yazlık arıyoruz.", en: "Hello, I'm {isim}, this is my sibling {isim2}. We are looking for a cheap summer house." } },
        { speaker: "customer2", text: { tr: "Fotoğraflarda ev biraz eğik duruyordu ama açı öyleydi herhalde dedik.", en: "The house looked a bit tilted in the photos but we thought it was just the angle." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Açı değildi ama önce içeri geçelim, anlatayım.\"", en: "\"It wasn't the angle, but let's go inside first, I'll explain.\"" }, next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Doğayla iç içe bir ev arıyorsanız tam yerine geldiniz.\"", en: "\"If you're looking for a house intertwined with nature, you've come to the right place.\"" }, next: "enter", effects: { fun: 10 } },
        { id: "c", text: { tr: "\"Bütçenize göre nadir bulunan bir fırsat, göstereyim.\"", en: "\"A rare opportunity for your budget, let me show you.\"" }, next: "enter", effects: { interest: 10 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Ev, Ağva'daki küçük bir bataklığın kenarında, zeminin bir kısmı üzerinde duruyor.", en: "The house stands partially on the ground, by a small swamp in Agva." } },
        { speaker: "customer2", text: { tr: "(dengesini kaybedip tutunur) Yer gerçekten eğik, şaka değilmiş.", en: "(loses balance and holds on) The floor is really tilted, it wasn't a joke." } },
        { speaker: "customer1", text: { tr: "{isim2}, bak bardaklar bile masadan kayıyor.", en: "{isim2}, look, even the glasses are sliding off the table." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Zeminin doğal bir eğimi var, mimari terimle buna 'karakter' diyoruz.\"", en: "\"The floor has a natural tilt, in architectural terms we call this 'character'.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Temel yıllar içinde biraz batmış, düzeltme masrafı çıkarabilirim.\"", en: "\"The foundation has sunk a bit over the years, I can get you a cost estimate for leveling it.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Bilardo masası koyarsanız hiç ıska geçmezsiniz, avantaj olarak düşünün.\"", en: "\"If you put a billiard table you'll never miss, think of it as an advantage.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: { tr: "Karakter derken, batma riskini kastetmiyorsunuzdur umarım.", en: "When you say character, I hope you don't mean the risk of sinking." } }], next: "sink" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Masraf çıkarmanız güven verici en azından.", en: "It's reassuring that you can provide a cost estimate at least." } }], next: "sink" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(güler) {isim}, bak bu adam eğlenceliymiş.", en: "(laughs) {isim}, look, this guy is fun." } }], next: "sink" },

    sink: {
      id: "sink",
      lines: [
        { speaker: "customer1", text: { tr: "Peki bu batma dediğiniz şey ilerleyen yıllarda daha kötü olur mu?", en: "So will this sinking thing get worse in the coming years?" } },
        { speaker: "customer1", text: { tr: "Yani bir sabah uyanıp evin yarısını bataklıkta bulmak istemeyiz.", en: "I mean, we don't want to wake up one morning and find half the house in the swamp." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Batma hızı yılda birkaç santim, ölçülebilir ve öngörülebilir bir süreç.\"", en: "\"The sinking rate is a few centimeters a year, a measurable and predictable process.\"" }, next: "sink_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Temel güçlendirmesi yaptırırsanız süreç büyük ölçüde durdurulabilir.\"", en: "\"If you have foundation strengthening done, the process can be largely stopped.\"" }, next: "sink_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Bataklık suyu doğal spa etkisi de yapıyor, bedava bir avantaj sayılır.\"", en: "\"Swamp water also has a natural spa effect, it counts as a free advantage.\"" }, next: "sink_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    sink_a: { id: "sink_a", lines: [{ speaker: "customer2", text: { tr: "\"Öngörülebilir\" derken bir de takvim mi vereceksiniz?", en: "\"Predictable\"? Are you going to give us a schedule too?" } }], next: "smell" },
    sink_b: { id: "sink_b", lines: [{ speaker: "customer1", text: { tr: "Güçlendirme fikri en azından bir çözüm sunuyor.", en: "The strengthening idea at least offers a solution." } }], next: "smell" },
    sink_c: { id: "sink_c", lines: [{ speaker: "customer2", text: { tr: "(kahkaha) {isim}, bedava spa diyor, ciddi mi bu adam?", en: "(laughs out loud) {isim}, he says free spa, is this guy serious?" } }], next: "smell" },

    smell: {
      id: "smell",
      lines: [{ speaker: "customer1", text: { tr: "Bir de bataklık kokusu var galiba, pencereyi açtığımızda daha da artar mı?", en: "And there's a swamp smell I guess, will it increase when we open the window?" } }],
      choices: [
        { id: "a", text: { tr: "\"Rüzgar yönüne göre değişir, çoğu gün fark edilmez bile.\"", en: "\"It varies depending on the wind direction, most days it's not even noticed.\"" }, next: "smell_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Doğru, ama bahçeye dikeceğimiz bitkilerle büyük ölçüde maskelenir.\"", en: "\"True, but it can be largely masked with the plants we'll plant in the garden.\"" }, next: "smell_b", effects: { suspicion: 0, fun: 5 } },
        { id: "c", text: { tr: "\"O koku değil, doğanın kokusu diyelim biz buna.\"", en: "\"That's not a smell, let's call it the scent of nature.\"" }, next: "smell_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    smell_a: { id: "smell_a", lines: [{ speaker: "thought", text: { tr: "\"Çoğu gün\" ifadesi hiç iyi bir işaret değil.", en: "The phrase \"most days\" is not a good sign at all." } }], next: "price" },
    smell_b: { id: "smell_b", lines: [{ speaker: "customer2", text: { tr: "Bitkiler mantıklı bir çözüm gibi duruyor.", en: "Plants seem like a logical solution." } }], next: "price" },
    smell_c: { id: "smell_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) {isim2}, adam pes etmiyor, buna saygı duyuyorum.", en: "(smiles) {isim2}, the guy doesn't give up, I respect that." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer2", text: { tr: "Bütçemiz zaten dar, biraz daha inebilir misiniz fiyattan?", en: "Our budget is already tight, can you lower the price a bit more?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %12 indirim sağlayabilirim, zaten bütçe evi bu.\"", en: "\"I can talk to the owner and provide a 12% discount, it's a budget house anyway.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 12 } },
        { id: "b", text: { tr: "\"Fiyat zaten bölgenin en düşüğü, ama düşünme payınız olsun.\"", en: "\"The price is already the lowest in the area, but take your time to think.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu fiyata bataklık kenarı bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"A swamp-side house won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte mantıklı geldi, {isim2}'yle konuşup bugün dönüş yapalım.", en: "With the discount it made sense, let me talk to {isim2} and get back to you today." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, lastik bot hediyemiz olsun bu arada.", en: "Best of luck, let a rubber boat be our gift by the way." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Biraz daha düşünelim, temel güçlendirme fiyatını da öğrenmemiz lazım.", en: "Let's think a bit more, we also need to find out the foundation strengthening price." } },
        { speaker: "emlah", text: { tr: "Elbette, elimde birkaç seçenek daha var, acele etmeyin.", en: "Of course, I have a few more options, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseBulutKulesi: HouseScene = {
  id: "bulut-kulesi",
  title: "Bulut Kulesi", titleEn: "Cloud Tower",
  location: "Sultanahmet, gökdelen tepesi", locationEn: "Sultanahmet, top of a skyscraper",
  customerNames: [],
  dynamicCast: [{ gender: "k" }],
  background: "placeholder-house-23",
  askingPrice: 56250000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Ressamım, ışığı iyi olan bir atölye arıyorum uzun zamandır.", en: "Hello, I'm {isim}. I'm a painter, I've been looking for a studio with good light for a long time." } },
        { speaker: "customer1", text: { tr: "Fotoğraflarda cam bir silindirin içinde gibiydi ev, doğru mu bu?", en: "In the photos, the house looked like it was inside a glass cylinder, is this true?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Aynen öyle, 360 derece cam, Ayasofya'ya kadar her şeyi görüyorsunuz.\"", en: "\"Exactly, 360 degrees of glass, you see everything all the way to Hagia Sophia.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Doğru, ama önce çıkışı biraz uzun, hazırlıklı olun.\"", en: "\"True, but the climb is a bit long first, be prepared.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Işık konusunda burası şehrin en iyisi diyebilirim rahatlıkla.\"", en: "\"In terms of light, I can easily say this is the best in the city.\"" }, next: "enter", effects: { interest: 15 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Eve çıkmak için gökdelenin tepesine kadar uzanan bu uzun merdiveni kullanıyoruz.", en: "To get to the house, we use this long staircase stretching to the top of the skyscraper." } },
        { speaker: "customer1", text: { tr: "(aşağı bakar, geri çekilir) Asansör... yok mu gerçekten?", en: "(looks down, steps back) Is there really... no elevator?" } },
        { speaker: "customer1", text: { tr: "Yani her tuval taşımam gerektiğinde bu merdivenden mi çıkacağım?", en: "So every time I need to carry a canvas, I'm going to climb these stairs?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Asansör inşası bulutlara çok yakın olduğu için teknik olarak imkansız.\"", en: "\"Elevator construction is technically impossible because it's too close to the clouds.\"" }, next: "q1_a", effects: { suspicion: 10, interest: 5 } },
        { id: "b", text: { tr: "\"Yok ama makara sistemiyle büyük tuvalleri yukarı çekebiliyoruz.\"", en: "\"No, but we can pull large canvases up with a pulley system.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: { tr: "\"Her çıkışta bacaklarınız güçlenir, kimse spor salonuna ihtiyaç duymuyor burada.\"", en: "\"Your legs get stronger with every climb, nobody needs a gym here.\"" }, next: "q1_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Teknik olarak imkansız\" cümlesi beni pek rahatlatmadı.", en: "The sentence \"technically impossible\" didn't really comfort me." } }], next: "wind" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Makara sistemi... ilginç ama en azından bir çözüm.", en: "Pulley system... interesting but at least it's a solution." } }], next: "wind" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Sanatçı bacakları derler buna galiba.", en: "(smiles) They call this artist's legs I guess." } }], next: "wind" },

    wind: {
      id: "wind",
      lines: [
        { speaker: "customer1", text: { tr: "Bu yükseklikte rüzgar da bir sorun olur muhtemelen, kule sallanıyor mu?", en: "At this height wind is probably a problem too, does the tower sway?" } },
        { speaker: "customer1", text: { tr: "Tuvalim rüzgarda uçarsa kimin sorumlu olduğunu bilmek isterim.", en: "If my canvas blows away in the wind, I'd like to know who is responsible." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Hafif bir salınım var evet, ama çoğu sakini bunu beşik etkisi olarak seviyor.\"", en: "\"There is a slight sway yes, but most residents love this as a cradle effect.\"" }, next: "wind_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Cam paneller rüzgara özel tasarlandı, içeride hiç hissetmezsiniz.\"", en: "\"The glass panels were specially designed for the wind, you won't feel it at all inside.\"" }, next: "wind_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: { tr: "\"Tuvalinizi pencereye çok yakın koymamanızı öneririm sadece.\"", en: "\"I only recommend not placing your canvas too close to the window.\"" }, next: "wind_c", effects: { suspicion: 5, fun: 5 } },
      ],
    },
    wind_a: { id: "wind_a", lines: [{ speaker: "thought", text: { tr: "\"Beşik etkisi\" ifadesi hiç güven verici gelmedi.", en: "The phrase \"cradle effect\" didn't sound reassuring at all." } }], next: "light" },
    wind_b: { id: "wind_b", lines: [{ speaker: "customer1", text: { tr: "Bu cevap işime yaradı, teknik detay hoşuma gitti.", en: "This answer works for me, I liked the technical detail." } }], next: "light" },
    wind_c: { id: "wind_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Mantıklı bir tavsiye, not ediyorum.", en: "(laughs) Logical advice, I'm noting it." } }], next: "light" },

    light: {
      id: "light",
      lines: [{ speaker: "customer1", text: { tr: "Peki gün batımında ışık nasıl oluyor, benim için en önemli kısım bu.", en: "So how is the light at sunset, this is the most important part for me." } }],
      choices: [
        { id: "a", text: { tr: "\"Öyle bir turuncu ki, bazı müşterilerimiz sadece bunun için taşındı.\"", en: "\"Such an orange that some of our clients moved in just for this.\"" }, next: "light_a", effects: { interest: 20 } },
        { id: "b", text: { tr: "\"Batıya bakan cam panel tam olarak bunun için tasarlandı.\"", en: "\"The west-facing glass panel was designed exactly for this.\"" }, next: "light_b", effects: { interest: 15 } },
        { id: "c", text: { tr: "\"Açıkçası hava durumuna göre değişiyor, garanti veremem.\"", en: "\"Frankly it varies depending on the weather, I can't guarantee it.\"" }, next: "light_c", effects: { suspicion: 5, interest: 5 } },
      ],
    },
    light_a: { id: "light_a", lines: [{ speaker: "customer1", text: { tr: "(gözleri parlar) Şimdi gerçekten ilgimi çekmeye başladınız.", en: "(eyes sparkle) Now you've really started to catch my interest." } }], next: "price" },
    light_b: { id: "light_b", lines: [{ speaker: "customer1", text: { tr: "Bu tam istediğim şey, tasarım detayına dikkat edilmiş.", en: "This is exactly what I want, attention has been paid to design details." } }], next: "price" },
    light_c: { id: "light_c", lines: [{ speaker: "customer1", text: { tr: "En azından dürüstsünüz, bunu takdir ediyorum.", en: "At least you're honest, I appreciate that." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyat konusunda ne kadar esnek olabiliyorsunuz peki?", en: "So how flexible can you be on the price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %5 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 5% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 5 } },
        { id: "b", text: { tr: "\"Fiyat zaten manzaraya göre makul, düşünmenizi öneririm.\"", en: "\"The price is already reasonable for the view, I suggest you think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu manzara bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This view won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, atölyemi buraya taşıyorum.", en: "With the discount I've decided, I'm moving my studio here." } },
        { speaker: "emlah", text: { tr: "Harika bir seçim, gün batımlarının tadını çıkarın.", en: "A great choice, enjoy the sunsets." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir kez daha gün batımında gelip görmek isterim, sonra karar veririm.", en: "I'd like to come and see it again at sunset, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz ayarlarım.", en: "Sure, I can arrange it whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu kule bana göre değil, vaktinizi aldım.", en: "I guess this tower isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseKristalMagara: HouseScene = {
  id: "kristal-magara",
  title: "Kristal Mağara", titleEn: "Crystal Cave",
  location: "Şile yakınları, yeraltı mağarası", locationEn: "Near Sile, underground cave",
  customerNames: [],
  dynamicCast: [{ gender: "k" }],
  background: "placeholder-house-24",
  askingPrice: 19500000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Kristal koleksiyonerliğim var, ilanı görünce hemen aradım.", en: "Hello, I'm {isim}. I'm a crystal collector, when I saw the ad I called immediately." } },
        { speaker: "customer1", text: { tr: "Yer altında bir ev, hiç duymamıştım açıkçası, çok merak ettim.", en: "A house underground, I had never heard of it frankly, I was very curious." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Doğal kristal oluşumlarıyla iç içe, sizin için biçilmiş kaftan.\"", en: "\"Intertwined with natural crystal formations, a perfect fit for you.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Biraz sıra dışı evet, ama alışması hiç de zor değil.\"", en: "\"A bit unusual yes, but it's not hard to get used to at all.\"" }, next: "enter", effects: { fun: 5 } },
        { id: "c", text: { tr: "\"Önce içeri geçelim, kendi gözlerinizle görün.\"", en: "\"Let's go inside first, see it with your own eyes.\"" }, next: "enter", effects: { interest: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Ev, terk edilmiş bir maden galerisinin en derin noktasında, mor kristallerle çevrili.", en: "The house is at the deepest point of an abandoned mine gallery, surrounded by purple crystals." } },
        { speaker: "customer1", text: { tr: "(hayranlıkla bakar) Bu manzara... ama bir saniye, pencere göremiyorum.", en: "(looks with admiration) This view... but wait a second, I don't see any windows." } },
        { speaker: "customer1", text: { tr: "Gün ışığı hiç girmiyor mu buraya?", en: "Does no daylight enter here?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Hiç girmiyor, ama kristaller kendi ışığını üretiyor gibi, alışıyorsunuz.\"", en: "\"Not at all, but the crystals seem to produce their own light, you get used to it.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Girmiyor ama tam spektrum lambalarla gün ışığı simüle ediliyor.\"", en: "\"It doesn't, but daylight is simulated with full spectrum lamps.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: { tr: "\"Güneş yanığı, D vitamini derdi falan artık geçmişte kalıyor.\"", en: "\"Sunburn, Vitamin D worries and all are a thing of the past now.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Kendi ışığını üretiyor gibi\" tam olarak ne demek şimdi?", en: "What does \"seem to produce their own light\" exactly mean now?" } }], next: "damp" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Tam spektrum lamba fikri işime gelir aslında.", en: "The full spectrum lamp idea actually works for me." } }], next: "damp" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu satış taktiğini beğendim doğrusu.", en: "(laughs) I actually liked this sales tactic." } }], next: "damp" },

    damp: {
      id: "damp",
      lines: [
        { speaker: "customer1", text: { tr: "Peki nem sorunu olmuyor mu, mağara dediğinize göre epey rutubetli olmalı.", en: "So isn't there a dampness problem, since you said it's a cave it must be quite humid." } },
        { speaker: "customer1", text: { tr: "Kristal koleksiyonum nemden zarar görür diye endişeleniyorum.", en: "I'm worried my crystal collection might be damaged by the dampness." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Biraz nem var evet, ama kristalleriniz zaten burada doğdu, alışıklar.\"", en: "\"There is a bit of dampness yes, but your crystals were born here anyway, they are used to it.\"" }, next: "damp_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Nem alma sistemi kurulabilir, maliyeti çok yüksek değil.\"", en: "\"A dehumidification system can be installed, the cost isn't very high.\"" }, next: "damp_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Nem, kristallerin parlaklığını artırıyor aslında, doğal bir cila gibi.\"", en: "\"Dampness actually increases the brightness of the crystals, like a natural polish.\"" }, next: "damp_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    damp_a: { id: "damp_a", lines: [{ speaker: "thought", text: { tr: "\"Zaten burada doğdu\" cümlesi biraz fazla yaratıcıydı.", en: "The sentence \"born here anyway\" was a bit too creative." } }], next: "access" },
    damp_b: { id: "damp_b", lines: [{ speaker: "customer1", text: { tr: "Nem alma sistemi mantıklı bir çözüm, düşünürüm.", en: "A dehumidification system is a logical solution, I'll think about it." } }], next: "access" },
    damp_c: { id: "damp_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Doğal cila, hoşuma gitti bu tabir.", en: "(smiles) Natural polish, I liked this term." } }], next: "access" },

    access: {
      id: "access",
      lines: [{ speaker: "customer1", text: { tr: "Peki misafirlerim buraya nasıl inecek, herkes maden galerisinde yürüyemez.", en: "So how will my guests get down here, not everyone can walk in a mine gallery." } }],
      choices: [
        { id: "a", text: { tr: "\"Fener ve ip merdivenle 20 dakikalık keyifli bir yürüyüş sadece.\"", en: "\"Just a pleasant 20-minute walk with a flashlight and a rope ladder.\"" }, next: "access_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Ana geçitte tutunma halatları ve aydınlatma mevcut, güvenli.\"", en: "\"There are hand ropes and lighting in the main passage, it's safe.\"" }, next: "access_b", effects: { suspicion: 0 } },
        { id: "c", text: { tr: "\"Gelen herkes 'buraya layık mıyım' diye düşünerek geliyor zaten, filtre gibi.\"", en: "\"Everyone who comes comes wondering 'am I worthy of this place' anyway, like a filter.\"" }, next: "access_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    access_a: { id: "access_a", lines: [{ speaker: "customer1", text: { tr: "20 dakika... misafirlerim pes eder herhalde.", en: "20 minutes... my guests would probably give up." } }], next: "price" },
    access_b: { id: "access_b", lines: [{ speaker: "customer1", text: { tr: "Halat ve aydınlatma olması güven verici.", en: "Having ropes and lighting is reassuring." } }], next: "price" },
    access_c: { id: "access_c", lines: [{ speaker: "customer1", text: { tr: "(kahkaha) Bu bakış açısını hiç düşünmemiştim.", en: "(laughs out loud) I had never thought of this perspective." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyat konusunda pazarlık payınız var mı biraz?", en: "Do you have any room for negotiation on the price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 9% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu eşsiz kristal dokusuna göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this unique crystal texture, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu mağara bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This cave won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte mantıklı geldi, koleksiyonumu buraya taşıyorum.", en: "With the discount it made sense, I'm moving my collection here." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, fener hediyemiz olsun bu arada.", en: "Best of luck, let a flashlight be our gift by the way." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Nem alma sistemi fiyatını öğrenip size dönerim, düşüneceğim.", en: "I will find out the dehumidification system price and get back to you, I'll think about it." } },
        { speaker: "emlah", text: { tr: "Elbette, elimde birkaç seçenek daha var, acele etmeyin.", en: "Of course, I have a few more options, don't rush." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu mağara bana göre değil, vaktinizi aldım.", en: "I guess this cave isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseKirisSaplanmisKonak: HouseScene = {
  id: "kiris-saplanmis-konak",
  title: "Kirişin Sapladığı Konak", titleEn: "Mansion Pierced by a Beam",
  location: "Fatih, deprem sonrası ahşap konak", locationEn: "Fatih, post-earthquake wooden mansion",
  customerNames: [],
  dynamicCast: [{ gender: "k" }, { gender: "k" }],
  background: "placeholder-house-25",
  askingPrice: 9000000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, teyzemin evine bakmaya geldik. Bu da yeğenim {isim2}.", en: "Hello, I'm {isim}, we came to see my aunt's house. This is my nephew/niece {isim2}." } },
        { speaker: "customer2", text: { tr: "Aile mirası bu ev, satmaya karar verdik ama önce durumunu görmek istedik.", en: "This house is a family inheritance, we decided to sell it but we wanted to see its condition first." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Tarihi bir konak, önce içeri geçelim, anlatayım.\"", en: "\"It's a historical mansion, let's go inside first, I'll explain.\"" }, next: "enter", effects: { interest: 5 } },
        { id: "b", text: { tr: "\"Sizi hazırlıklı olmaya davet ediyorum açıkçası.\"", en: "\"I invite you to be prepared, frankly.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Ailenizin anılarıyla dolu bir yer olmalı, saygıyla gezelim.\"", en: "\"It must be a place full of your family's memories, let's tour it with respect.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Komşu inşaattan kopan bir beton kiriş, geçen ay konağın yan duvarına saplanmış durumda.", en: "A concrete beam that broke off from the neighboring construction is stuck in the mansion's side wall since last month." } },
        { speaker: "customer2", text: { tr: "(şaşkınlıkla) Yani bina hâlâ o kirişle mi ayakta duruyor?", en: "(in astonishment) You mean the building is still standing with that beam?" } },
        { speaker: "customer1", text: { tr: "{isim2}, teyzemin koltuğu tam kirişin altındaydı sanırım.", en: "{isim2}, I think my aunt's armchair was right under the beam." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Kiriş aslında ek bir destek görevi görüyor artık, doğaçlama bir mühendislik.\"", en: "\"The beam is actually acting as an additional support now, improvised engineering.\"" }, next: "q1_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Statik rapor bekleniyor, sonuca göre kiriş kontrollü şekilde sökülecek.\"", en: "\"A static report is awaited, depending on the result the beam will be removed in a controlled manner.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"En azından ücretsiz bir heykel kazanmış oldunuz diyelim.\"", en: "\"Let's say you've gained a free sculpture at least.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Doğaçlama mühendislik\" cümlesi beni hiç rahatlatmadı.", en: "The sentence \"improvised engineering\" didn't comfort me at all." } }], next: "elevator" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer2", text: { tr: "Statik rapor bekleniyor olması en azından bir süreç olduğunu gösteriyor.", en: "The fact that a static report is awaited at least shows there's a process." } }], next: "elevator" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(gülümser) {isim}, adamın mizah anlayışı fena değil.", en: "(smiles) {isim}, the guy's sense of humor isn't bad." } }], next: "elevator" },

    elevator: {
      id: "elevator",
      lines: [
        { speaker: "customer1", text: { tr: "Dışarıda \"Terk Edilmiş Asansör\" yazan bir tabela gördük, o ne demek?", en: "We saw a sign outside saying \"Abandoned Elevator\", what does that mean?" } },
        { speaker: "customer1", text: { tr: "Bina bu kadar hasarlıyken asansör projesi de mi yarım kalmış?", en: "Was the elevator project left half-finished while the building was this damaged?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Asansör boşluğu şu an ek depo alanı olarak kullanılıyor, pratik bir çözüm.\"", en: "\"The elevator shaft is currently being used as additional storage space, a practical solution.\"" }, next: "elevator_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Proje depremden önce durduruldu, güvenlik gerekçesiyle iptal edildi.\"", en: "\"The project was stopped before the earthquake, canceled for security reasons.\"" }, next: "elevator_b", effects: { suspicion: 0 } },
        { id: "c", text: { tr: "\"Merdiven kullanmak sağlığa iyi geliyor, teyzeniz de öyle derdi herhalde.\"", en: "\"Using stairs is good for your health, your aunt would probably say the same.\"" }, next: "elevator_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    elevator_a: { id: "elevator_a", lines: [{ speaker: "customer2", text: { tr: "\"Ek depo alanı\" derken boş bir çukurdan mı bahsediyorsunuz?", en: "When you say \"additional storage space\", are you talking about an empty pit?" } }], next: "safety" },
    elevator_b: { id: "elevator_b", lines: [{ speaker: "customer1", text: { tr: "Güvenlik gerekçesiyle durdurulmuş olması en azından mantıklı.", en: "It being stopped for security reasons is at least logical." } }], next: "safety" },
    elevator_c: { id: "elevator_c", lines: [{ speaker: "customer2", text: { tr: "(güler) {isim}, teyzemiz gerçekten öyle derdi, doğru bildiniz.", en: "(laughs) {isim}, our aunt would really say that, you guessed right." } }], next: "safety" },

    safety: {
      id: "safety",
      lines: [
        { speaker: "customer1", text: { tr: "Peki genel olarak binanın güvenli olduğuna dair bir belge var mı elinizde?", en: "So do you have any document showing that the building is safe in general?" } },
        { speaker: "customer1", text: { tr: "Yeğenimle burada oturmayı düşünüyoruz aslında, sadece satış için gelmedik.", en: "We are actually thinking of living here with my nephew/niece, we didn't just come for the sale." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Şimdiye kadar hiçbir sorun çıkmadı, belge süreci de yakında tamamlanır.\"", en: "\"There has been no problem so far, the document process will also be completed soon.\"" }, next: "safety_a", effects: { suspicion: 25 } },
        { id: "b", text: { tr: "\"Statik rapor çıkana kadar oturmanızı önermem açıkçası, dürüst olayım.\"", en: "\"I wouldn't recommend living here until the static report comes out, let me be honest.\"" }, next: "safety_b", effects: { suspicion: -5 } },
        { id: "c", text: { tr: "\"Kiriş sökülüp güçlendirme yapılırsa burası gayet sağlam bir konak olur.\"", en: "\"If the beam is removed and strengthening is done, this will be a very solid mansion.\"" }, next: "safety_c", effects: { suspicion: 5, interest: 10 } },
      ],
    },
    safety_a: { id: "safety_a", lines: [{ speaker: "thought", text: { tr: "\"Yakında tamamlanır\" cümlesini hiç sevmedim.", en: "I didn't like the sentence \"will be completed soon\" at all." } }], next: "price" },
    safety_b: { id: "safety_b", lines: [{ speaker: "customer2", text: { tr: "(şaşırır) {isim}, bu adam dürüst konuşuyor, bu bende güven uyandırdı.", en: "(surprised) {isim}, this man is speaking honestly, this inspired trust in me." } }], next: "price" },
    safety_c: { id: "safety_c", lines: [{ speaker: "customer1", text: { tr: "Güçlendirme fikri mantıklı, uzun vadede düşünülebilir.", en: "The strengthening idea is logical, it can be considered in the long term." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer2", text: { tr: "Fiyat zaten düşük ama biraz daha inebilir misiniz, tamirat masrafını düşünürsek?", en: "The price is already low but can you lower it a bit more, considering the repair cost?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %15 indirim sağlayabilirim, tamirat payını da düşünerek.\"", en: "\"I can talk to the owner and provide a 15% discount, considering the repair share too.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 15 } },
        { id: "b", text: { tr: "\"Fiyat zaten hasar durumuna göre en düşük seviyede, düşünme payınız olsun.\"", en: "\"The price is already at the lowest level according to the damage situation, take your time to think.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu fiyata tarihi bir konak bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"A historical mansion won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte mantıklı geldi, {isim2}'yle güçlendirmeyi biz üstleniriz.", en: "With the discount it made sense, {isim2} and I will take on the strengthening." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, kask hediyemiz olsun bu arada, şaka bir yana dikkatli olun.", en: "Best of luck, let a hard hat be our gift by the way, jokes aside be careful." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Statik raporu bekleyip ona göre karar verelim, {isim} de aynı fikirde.", en: "Let's wait for the static report and decide accordingly, {isim} agrees too." } },
        { speaker: "emlah", text: { tr: "Doğru karar, rapor çıkınca beni arayabilirsiniz.", en: "Right decision, you can call me when the report comes out." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Teyzemin anısına saygısızlık gibi geldi bu, vaktinizi aldık.", en: "This felt like a disrespect to my aunt's memory, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseSifirUcStudyo: HouseScene = {
  id: "sifir-uc-studyo",
  title: "'0+3' Stüdyo", titleEn: "'0+3' Studio",
  location: "Kadıköy, tarihi apartman", locationEn: "Kadikoy, historical apartment building",
  customerNames: [],
  dynamicCast: [{}],
  background: "placeholder-house-26",
  askingPrice: 11250000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. İlanda '0+3' yazıyordu, hiç böyle bir tabir duymamıştım.", en: "Hello, I'm {isim}. The ad said '0+3', I've never heard such a term." } },
        { speaker: "customer1", text: { tr: "Stüdyo dairelere '1+0' derler genelde, bu '0+3' da ne demek acaba?", en: "Studio apartments are usually called '1+0', I wonder what this '0+3' means?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sıra dışı bir konsept, içeri geçince anlarsınız.\"", en: "\"An unusual concept, you'll understand when you go inside.\"" }, next: "enter", effects: { fun: 5 } },
        { id: "b", text: { tr: "\"Aslında oda sayısını değil, felsefeyi anlatıyor bu isim.\"", en: "\"Actually, this name describes the philosophy, not the number of rooms.\"" }, next: "enter", effects: { interest: 5 } },
        { id: "c", text: { tr: "\"Sizi şaşırtmak istemem, direkt gösteriyorum.\"", en: "\"I don't want to surprise you, I'll show you directly.\"" }, next: "enter", effects: { suspicion: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte burası, '0' mutfak, '3' de küvetin farklı kullanım alanı demek aslında.", en: "Here it is, '0' means kitchen, and '3' is actually the different usage areas of the bathtub." } },
        { speaker: "customer1", text: { tr: "(etrafa bakınır) Bir dakika, mutfak... nerede mutfak?", en: "(looks around) Wait a minute, the kitchen... where is the kitchen?" } },
        { speaker: "customer1", text: { tr: "Sadece bir küvet görüyorum, ocak, tezgah, hiçbir şey yok.", en: "I only see a bathtub, no stove, no counter, nothing." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Mutfak yok çünkü küvet üç işi birden yapıyor: bulaşık, çamaşır, banyo.\"", en: "\"There is no kitchen because the bathtub does three jobs at once: dishes, laundry, bath.\"" }, next: "q1_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Doğru, mutfak yok ama karşı sokakta harika bir lokantalar sırası var.\"", en: "\"True, there is no kitchen but there is a great row of restaurants on the opposite street.\"" }, next: "q1_b", effects: { suspicion: 5, interest: 5 } },
        { id: "c", text: { tr: "\"Yemek pişirmemenin de bir özgürlük olduğunu düşünebiliriz.\"", en: "\"We can think of not cooking as a freedom too.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Bulaşık ve banyo aynı küvette mi... bunu hiç düşünmemiştim.", en: "Dishes and bath in the same tub... I had never thought of this." } }], next: "dishes" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Lokanta sırası fikri fena değil aslında.", en: "The restaurant row idea isn't bad actually." } }], next: "dishes" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) İlginç bir bakış açısı, kabul ediyorum.", en: "(laughs) An interesting perspective, I admit." } }], next: "dishes" },

    dishes: {
      id: "dishes",
      lines: [
        { speaker: "customer1", text: { tr: "Peki bulaşıkları yıkarken banyo mu yapamıyorum, sırayla mı gidiyor bu iş?", en: "So can I not take a bath while washing the dishes, does this job go in order?" } },
        { speaker: "customer1", text: { tr: "Yani mantık olarak biraz kafam karıştı açıkçası.", en: "I mean, logically I'm a bit confused frankly." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sırayla tabii, önce bulaşık, sonra durulama, en son siz.\"", en: "\"In order of course, first the dishes, then rinsing, and finally you.\"" }, next: "dishes_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Küçük bir leğen alırsanız bulaşığı ayırabilirsiniz, pratik bir çözüm.\"", en: "\"If you buy a small basin you can separate the dishes, a practical solution.\"" }, next: "dishes_b", effects: { suspicion: 0 } },
        { id: "c", text: { tr: "\"Az eşya, az bulaşık demek zaten, sorun büyütülüyor bence.\"", en: "\"Less stuff means fewer dishes anyway, I think the problem is being exaggerated.\"" }, next: "dishes_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    dishes_a: { id: "dishes_a", lines: [{ speaker: "thought", text: { tr: "\"En son siz\" cümlesi hiç iç açıcı değildi.", en: "The sentence \"and finally you\" wasn't heartwarming at all." } }], next: "guest" },
    dishes_b: { id: "dishes_b", lines: [{ speaker: "customer1", text: { tr: "Leğen fikri mantıklı, not ediyorum.", en: "The basin idea is logical, I'm noting it." } }], next: "guest" },
    dishes_c: { id: "dishes_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Az eşya derken haklısınız aslında.", en: "(smiles) You're actually right when you say less stuff." } }], next: "guest" },

    guest: {
      id: "guest",
      lines: [{ speaker: "customer1", text: { tr: "Peki misafir geldiğinde bu küvet meselesini nasıl açıklayacağım?", en: "So how will I explain this bathtub issue when guests come over?" } }],
      choices: [
        { id: "a", text: { tr: "\"Açıklamayın, merak etsinler, ilgi çekici bir sır olarak kalsın.\"", en: "\"Don't explain, let them wonder, let it remain an intriguing secret.\"" }, next: "guest_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Küvetin üstüne bir kapak yaptırırsanız normal bir tezgah gibi durur.\"", en: "\"If you have a cover made over the bathtub, it will look like a normal counter.\"" }, next: "guest_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Bu evi görenler zaten bir daha unutmuyor, iyi bir sohbet konusu.\"", en: "\"Those who see this house never forget it anyway, a good topic of conversation.\"" }, next: "guest_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    guest_a: { id: "guest_a", lines: [{ speaker: "customer1", text: { tr: "\"Sır olarak kalsın\" dediğinize göre gizlenecek bir şey var demek.", en: "Since you said \"let it remain a secret\", there must be something to hide." } }], next: "price" },
    guest_b: { id: "guest_b", lines: [{ speaker: "customer1", text: { tr: "Kapak fikri işime yarar, bunu değerlendiririm.", en: "The cover idea works for me, I will consider this." } }], next: "price" },
    guest_c: { id: "guest_c", lines: [{ speaker: "customer1", text: { tr: "(kahkaha) Sohbet konusu olarak fena değil doğrusu.", en: "(laughs out loud) It's not bad as a topic of conversation, actually." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Mutfaksız bir ev için fiyatta biraz esneklik olmalı bence.", en: "I think there should be some flexibility in the price for a house without a kitchen." } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %10 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 10% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: { tr: "\"Fiyat zaten mutfaksız evlere göre düşük tutuldu, düşünebilirsiniz.\"", en: "\"The price was already kept low compared to houses without kitchens, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu konsept bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This concept won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte mantıklı geldi, kapağı ben yaptırırım artık.", en: "With the discount it made sense, I guess I'll have the cover made." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, leğeni de unutmayın.", en: "Best of luck, don't forget the basin either." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Biraz daha düşüneyim, bu küvet meselesini kafamda oturtmam lazım.", en: "Let me think a bit more, I need to wrap my head around this bathtub issue." } },
        { speaker: "emlah", text: { tr: "Elbette, ne zaman isterseniz arayabilirsiniz.", en: "Of course, you can call whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseEskiTrenIstasyonu: HouseScene = {
  id: "eski-tren-istasyonu",
  title: "Eski Tren İstasyonu", titleEn: "Old Train Station",
  location: "Sirkeci, terk edilmiş peron", locationEn: "Sirkeci, abandoned platform",
  customerNames: [],
  dynamicCast: [{}],
  background: "placeholder-house-27",
  askingPrice: 22120000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Küçüklüğümden beri trenlere hastayım, ilanı görünce heyecanlandım.", en: "Hello, I'm {isim}. I've been crazy about trains since my childhood, I got excited when I saw the ad." } },
        { speaker: "customer1", text: { tr: "Gerçek bir istasyonun içinde yaşamak, hayalim gibi bir şey bu.", en: "Living inside a real station, this is like my dream." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"O zaman doğru yerdesiniz, burası 1894'ten kalma otantik bir bekleme odası.\"", en: "\"Then you are in the right place, this is an authentic waiting room from 1894.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Tren sesleri konusunda önceden hazırlıklı olun derim.\"", en: "\"I'd say be prepared in advance regarding train sounds.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Duvardaki dev saat de cabası, tam sizlik bir detay.\"", en: "\"The giant clock on the wall is a bonus too, a detail perfectly for you.\"" }, next: "enter", effects: { fun: 5, interest: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Peron 2'nin hemen yanında, hâlâ çalışan bu dev saatin altında yaşıyorsunuz.", en: "Right next to Platform 2, you live under this giant clock that is still working." } },
        { speaker: "customer1", text: { tr: "(hayranlıkla) Muhteşem... ama bir saniye, yatak ile tuvalet aynı odada mı?", en: "(with admiration) Magnificent... but wait a second, are the bed and toilet in the same room?" } },
        { speaker: "customer1", text: { tr: "Yani duş perdesi falan da yok, hepsi iç içe.", en: "I mean, there's no shower curtain or anything, it's all intertwined." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Aynı odada evet, ama 1894 tarzı bu, o dönem böyle yapılırmış.\"", en: "\"In the same room yes, but this is 1894 style, that's how it was done back then.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Doğru, ama paravan koyarsanız sorun büyük ölçüde çözülür.\"", en: "\"True, but if you put up a folding screen the problem is largely solved.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Tren yolculuğunda da herkes yan yana otururdu, buna alışkanlık diyelim.\"", en: "\"On a train journey everyone sat side by side too, let's call this a habit.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "1894 tarzı derken, hijyen konusunda da mı o döneme dönüyoruz?", en: "When you say 1894 style, are we returning to that era in terms of hygiene too?" } }], next: "sound" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Paravan fikri en azından bir başlangıç.", en: "The folding screen idea is at least a start." } }], next: "sound" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu benzetmeyi hiç düşünmemiştim.", en: "(laughs) I had never thought of this analogy." } }], next: "sound" },

    sound: {
      id: "sound",
      lines: [
        { speaker: "customer1", text: { tr: "Peronda hâlâ tren geçiyor mu, gece sesler beni uyandırır mı?", en: "Do trains still pass on the platform, will the sounds wake me up at night?" } },
        { speaker: "customer1", text: { tr: "Çünkü hayal ile gerçek arasında fark olabilir diye düşünüyorum.", en: "Because I think there might be a difference between dream and reality." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Son tren gece yarısı geçiyor, ritmi öğrenince alarm gibi bile kullanabilirsiniz.\"", en: "\"The last train passes at midnight, once you learn the rhythm you can even use it like an alarm.\"" }, next: "sound_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Cam kalınlaştırma yaptırırsanız sesi ciddi oranda azaltabiliriz.\"", en: "\"If you get thicker glass we can significantly reduce the sound.\"" }, next: "sound_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Tren düdüğü de artık bir çeşit ninni sayılır bence.\"", en: "\"A train whistle can be considered a kind of lullaby now, I think.\"" }, next: "sound_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    sound_a: { id: "sound_a", lines: [{ speaker: "thought", text: { tr: "\"Alarm gibi kullanabilirsiniz\" hiç uyku dostu bir cümle değildi.", en: "\"You can use it like an alarm\" was not a sleep-friendly sentence at all." } }], next: "clock" },
    sound_b: { id: "sound_b", lines: [{ speaker: "customer1", text: { tr: "Cam kalınlaştırma mantıklı bir yatırım gibi duruyor.", en: "Thicker glass seems like a logical investment." } }], next: "clock" },
    sound_c: { id: "sound_c", lines: [{ speaker: "customer1", text: { tr: "(kahkaha) Tren düdüğü ninni, bunu ilk defa duyuyorum.", en: "(laughs out loud) Train whistle lullaby, I'm hearing this for the first time." } }], next: "clock" },

    clock: {
      id: "clock",
      lines: [{ speaker: "customer1", text: { tr: "O dev saatin tik-takları da geceleri rahatsız eder mi acaba?", en: "I wonder if the tick-tocks of that giant clock will be disturbing at night too?" } }],
      choices: [
        { id: "a", text: { tr: "\"Mekanizma biraz gürültülü evet, ama saat başı çanı gerçekten etkileyici.\"", en: "\"The mechanism is a bit noisy yes, but the hourly chime is truly impressive.\"" }, next: "clock_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Sessiz moda alınabiliyor aslında, sadece bir teknisyen çağırmak yeterli.\"", en: "\"It can actually be put in silent mode, just calling a technician is enough.\"" }, next: "clock_b", effects: { suspicion: 0 } },
        { id: "c", text: { tr: "\"O saat bu evin kalbi, sessiz olsa ruhu kaybolur diye düşünüyorum.\"", en: "\"That clock is the heart of this house, I think if it were silent its soul would be lost.\"" }, next: "clock_c", effects: { fun: 10, interest: 10 } },
      ],
    },
    clock_a: { id: "clock_a", lines: [{ speaker: "customer1", text: { tr: "\"Etkileyici\" derken uykumu kaçıracak kadar mı etkileyici?", en: "When you say \"impressive\", is it impressive enough to keep me awake?" } }], next: "price" },
    clock_b: { id: "clock_b", lines: [{ speaker: "customer1", text: { tr: "Teknisyen çağırmak makul bir çözüm.", en: "Calling a technician is a reasonable solution." } }], next: "price" },
    clock_c: { id: "clock_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Bu duygusal yaklaşımı beğendim açıkçası.", en: "(smiles) I frankly liked this emotional approach." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyat konusunda pazarlık payınız var mı biraz?", en: "Do you have any room for negotiation on the price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu tarihi dokuya göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this historical texture, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu istasyon bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This station won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte hayalim gerçek oluyor, paravanı hemen alırım.", en: "With the discount my dream is coming true, I'll buy the folding screen right away." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, tren saatlerini de bir kenara not edin.", en: "Best of luck, note down the train schedules aside too." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir gece burada kalıp sesleri denemek isterim, sonra karar veririm.", en: "I'd like to stay here one night and test the sounds, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Elbette, ne zaman isterseniz ayarlarım.", en: "Of course, I can arrange it whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu istasyon bana göre değil, vaktinizi aldım.", en: "I guess this station isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseKutuphaneYatakOdasi: HouseScene = {
  id: "kutuphane-yatak-odasi",
  title: "Kütüphane Yatak Odası", titleEn: "Library Bedroom",
  location: "Cihangir, kitapçı dairesi", locationEn: "Cihangir, bookstore apartment",
  customerNames: [],
  dynamicCast: [{}],
  background: "placeholder-house-28",
  askingPrice: 13880000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Kitap kurdu olduğumu söylesem yalan olmaz, ilan tam bana göreydi.", en: "Hello, I'm {isim}. It wouldn't be a lie if I said I'm a bookworm, the ad was perfect for me." } },
        { speaker: "customer1", text: { tr: "Fotoğraflarda ev baştan aşağı kitaplıktı, doğru mu bu?", en: "In the photos, the house was a bookcase from top to bottom, is this true?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle doğru, her santimi kitaplarla dolu bir cennet burası.\"", en: "\"Absolutely true, every centimeter here is a paradise filled with books.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Doğru, ama biraz da yatak konusunda hazırlıklı olun.\"", en: "\"True, but be a bit prepared regarding the bed as well.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Önce içeri geçelim, göz kamaştıracak bir manzara sizi bekliyor.\"", en: "\"Let's go inside first, a dazzling view awaits you.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte yatak odası, tam da kitaplıkların arasına sıkışmış durumda.", en: "Here is the bedroom, squeezed right between the bookcases." } },
        { speaker: "customer1", text: { tr: "(gözleri parlar, sonra şaşırır) Yatak gerçekten iki raf arasında mı sıkışmış?", en: "(eyes sparkle, then surprised) Is the bed really squeezed between two shelves?" } },
        { speaker: "customer1", text: { tr: "Yani dönüp durabilecek kadar yer var mı acaba içeride?", en: "I mean, I wonder if there's enough space to toss and turn inside?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Dönmenize gerek yok zaten, kitap okuyup uyuyacaksınız, ideal bir düzen.\"", en: "\"You don't need to turn anyway, you'll read books and sleep, an ideal setup.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Biraz dar evet, ama raflardan birkaçını kaldırırsak alan açılır.\"", en: "\"A bit narrow yes, but if we remove some of the shelves space will open up.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Kitapların arasında uyumak bazı yazarlara ilham kaynağı olmuş, biliyor musunuz?\"", en: "\"Sleeping among books has been a source of inspiration for some writers, did you know?\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Dönmenize gerek yok\" cümlesi biraz endişelendirdi beni.", en: "The sentence \"You don't need to turn\" worried me a bit." } }], next: "fall" },
    q1_b: {
      id: "q1_b",
      lines: [
        { speaker: "customer1", text: { tr: "Raf kaldırmak mantıklı bir çözüm gibi duruyor.", en: "Removing shelves seems like a logical solution." } },
        { speaker: "customer1", text: { tr: "Aslında güvenlik tarafını da merak ediyordum ama bu cevap içimi rahatlattı, fiyata geçebiliriz.", en: "Actually I was also wondering about the safety side but this answer relieved me, we can move on to the price." } },
      ],
      next: "price",
    },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu argümanı beğendim doğrusu.", en: "(laughs) I actually liked this argument." } }], next: "fall" },

    fall: {
      id: "fall",
      lines: [
        { speaker: "customer1", text: { tr: "Peki uykuda dönersem üstüme kitap düşme ihtimali var mı?", en: "So if I turn in my sleep, is there a chance of a book falling on me?" } },
        { speaker: "customer1", text: { tr: "Yani bu ciddi bir güvenlik sorunu gibi de düşünülebilir.", en: "I mean, this could also be considered a serious security issue." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Ağır ansiklopedileri üst raflara koymamanızı öneririm sadece.\"", en: "\"I only suggest you don't put heavy encyclopedias on the top shelves.\"" }, next: "fall_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Raflara kenar bariyeri taktırabiliriz, basit bir çözüm.\"", en: "\"We can have edge barriers installed on the shelves, a simple solution.\"" }, next: "fall_b", effects: { suspicion: 0 } },
        { id: "c", text: { tr: "\"Kitap düşerse en azından okuyacak bir şeyiniz olur elinizin altında.\"", en: "\"If a book falls, at least you'll have something to read at hand.\"" }, next: "fall_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    fall_a: { id: "fall_a", lines: [{ speaker: "thought", text: { tr: "Bu tavsiyeyi zaten kendim düşünmüştüm, güven vermedi.", en: "I had already thought of this advice myself, it didn't give confidence." } }], next: "price" },
    fall_b: { id: "fall_b", lines: [{ speaker: "customer1", text: { tr: "Bariyer fikri işime yarar, teşekkürler.", en: "The barrier idea works for me, thanks." } }], next: "price" },
    fall_c: { id: "fall_c", lines: [{ speaker: "customer1", text: { tr: "(kahkaha) Bu bakış açısını hiç düşünmemiştim, hoşuma gitti.", en: "(laughs out loud) I had never thought of this perspective, I liked it." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyat konusunda biraz esneklik var mı acaba?", en: "I wonder if there is a bit of flexibility in the price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 9% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu kitaplık koleksiyonuna göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this bookcase collection, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu kütüphane bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This library won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, bariyer işini de kendim hallederim.", en: "With the discount I've decided, I'll handle the barrier job myself too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, iyi okumalar.", en: "Best of luck, happy reading." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Biraz daha düşüneyim, raf düzenini bir de gündüz görmek isterim.", en: "Let me think a bit more, I'd like to see the shelf layout during the day too." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseGarajLoft: HouseScene = {
  id: "garaj-loft",
  title: "Garaj Loft", titleEn: "Garage Loft",
  location: "Maslak, eski oto tamirhanesi", locationEn: "Maslak, old auto repair shop",
  customerNames: [],
  dynamicCast: [{}, {}],
  background: "placeholder-house-29",
  askingPrice: 27000000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da kardeşim {isim2}. Birlikte ev bakıyoruz.", en: "Hello, I'm {isim}, this is my sibling {isim2}. We are looking for a house together." } },
        { speaker: "customer2", text: { tr: "Ben klasik araba tutkunuyum, {isim} ise pek anlamıyor açıkçası.", en: "I am a classic car enthusiast, whereas {isim} doesn't really understand them frankly." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"O zaman bu ev tam size göre, içeride bir sürpriz var.\"", en: "\"Then this house is exactly for you, there's a surprise inside.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Farklı zevkleri olan kardeşler için ilginç bir uzlaşma bu ev.\"", en: "\"For siblings with different tastes, this house is an interesting compromise.\"" }, next: "enter", effects: { fun: 5 } },
        { id: "c", text: { tr: "\"Önce görün, sonra kararınızı birlikte verin derim.\"", en: "\"I'd say see it first, then make your decision together.\"" }, next: "enter", effects: { suspicion: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Salonun tam ortasında çalışan bir otomobil lifti var, önceki sahibi tamirci imiş.", en: "There's a working car lift right in the middle of the living room, the previous owner was a mechanic." } },
        { speaker: "customer2", text: { tr: "(gözleri parlar) Bu... bu harika! {isim}, bak, gerçek bir lift!", en: "(eyes sparkle) This... this is great! {isim}, look, a real lift!" } },
        { speaker: "customer1", text: { tr: "(şüpheyle bakar) Yani koltuk, mutfak, her şey bu liftin etrafında mı?", en: "(looks suspiciously) So the sofa, kitchen, everything is around this lift?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Aynen öyle, açık plan konsepti burada biraz daha... otomotiv yönlü.\"", en: "\"Exactly, the open plan concept here is a bit more... automotive-oriented.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Lifti kaldırıp yerine bölme koyabiliriz isterseniz, tercihe bağlı.\"", en: "\"We can remove the lift and put a partition instead if you want, depending on preference.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Misafirleriniz gelince ilk sorusu hep aynı olur: 'lift çalışıyor mu?'\"", en: "\"When your guests arrive their first question will always be the same: 'does the lift work?'\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Otomotiv yönlü\" derken normal bir salon değil yani bu.", en: "When you say \"automotive-oriented\" so this is not a normal living room." } }], next: "smell" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer2", text: { tr: "Lifti kaldırmak mı? {isim}, kesinlikle olmaz öyle şey.", en: "Remove the lift? {isim}, absolutely no such thing." } }], next: "smell" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu soruyu ben de sorardım galiba.", en: "(laughs) I would probably ask this question too." } }], next: "smell" },

    smell: {
      id: "smell",
      lines: [
        { speaker: "customer1", text: { tr: "Motor yağı kokusu falan sinmiş midir buraya, yaşam alanı için endişeleniyorum.", en: "Is the smell of motor oil or something permeated here, I'm worried for the living space." } },
        { speaker: "customer1", text: { tr: "{isim2}, sen de kabul et, bu biraz garip bir durum.", en: "{isim2}, you have to admit, this is a bit of a weird situation." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Biraz sinmiş olabilir, ama zamanla karakteristik bir koku haline geliyor.\"", en: "\"It might have permeated a bit, but over time it becomes a characteristic smell.\"" }, next: "smell_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Derin temizlik ve havalandırma sistemiyle büyük ölçüde giderilebilir.\"", en: "\"It can be largely eliminated with deep cleaning and a ventilation system.\"" }, next: "smell_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Bazı kişiler bu kokuyu parfüm gibi seviyor, garaj estetiği diyorlar.\"", en: "\"Some people love this smell like perfume, they call it garage aesthetic.\"" }, next: "smell_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    smell_a: { id: "smell_a", lines: [{ speaker: "thought", text: { tr: "\"Karakteristik koku\" cümlesi hep aynı, hiç güven vermiyor.", en: "The sentence \"characteristic smell\" is always the same, it doesn't give confidence at all." } }], next: "safety" },
    smell_b: { id: "smell_b", lines: [{ speaker: "customer1", text: { tr: "Havalandırma sistemi mantıklı bir çözüm, kabul ediyorum.", en: "A ventilation system is a logical solution, I accept it." } }], next: "safety" },
    smell_c: { id: "smell_c", lines: [{ speaker: "customer2", text: { tr: "(kahkaha) {isim}, adam haklı, garaj estetiği gerçek bir şey!", en: "(laughs out loud) {isim}, the man is right, garage aesthetic is a real thing!" } }], next: "safety" },

    safety: {
      id: "safety",
      lines: [{ speaker: "customer1", text: { tr: "Peki bu lift güvenli mi, üstünde bir şey varken aniden inmez değil mi?", en: "So is this lift safe, it won't suddenly go down while there's something on it, right?" } }],
      choices: [
        { id: "a", text: { tr: "\"Şimdiye kadar hiç sorun çıkmadı, bakım kayıtları da elimde bir yerde.\"", en: "\"There has been no problem so far, I have the maintenance records somewhere too.\"" }, next: "safety_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Kilit mekanizması var, düzenli bakımla tamamen güvenli hale gelir.\"", en: "\"It has a locking mechanism, with regular maintenance it becomes completely safe.\"" }, next: "safety_b", effects: { suspicion: 0 } },
        { id: "c", text: { tr: "\"Lift çalışır durumda kalırsa evin değeri de artar, meraklısı çok.\"", en: "\"If the lift remains in working condition the house's value will increase too, there are many enthusiasts.\"" }, next: "safety_c", effects: { fun: 10, interest: 15 } },
      ],
    },
    safety_a: { id: "safety_a", lines: [{ speaker: "customer1", text: { tr: "\"Bir yerde\" derken elinizde olmadığını mı kastediyorsunuz?", en: "When you say \"somewhere\", do you mean you don't have them on hand?" } }], next: "price" },
    safety_b: { id: "safety_b", lines: [{ speaker: "customer1", text: { tr: "Kilit mekanizması olması içimi rahatlattı biraz.", en: "Having a locking mechanism put my mind at ease a bit." } }], next: "price" },
    safety_c: { id: "safety_c", lines: [{ speaker: "customer2", text: { tr: "(heyecanla) {isim}, değer artışı da varsa hiç sorun yok bence!", en: "(excitedly) {isim}, if there is an increase in value too, I think there is no problem at all!" } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyat konusunda biraz esneklik var mı, ikimiz de karar vermemiz lazım.", en: "Is there a bit of flexibility in the price, both of us need to decide." } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %6 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 6% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 6 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu özel konsepte göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this special concept, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu lift bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This lift won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer2", text: { tr: "İndirimle birlikte anlaştık, {isim} de artık lifte alıştı sanırım.", en: "With the discount we have a deal, {isim} has probably gotten used to the lift now too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, lift bakımını ihmal etmeyin.", en: "Best of luck, don't neglect the lift maintenance." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bakım kayıtlarını görüp öyle karar verelim, {isim2} de razı.", en: "Let's see the maintenance records and decide then, {isim2} is willing too." } },
        { speaker: "emlah", text: { tr: "Elbette, kayıtları bulup size iletirim.", en: "Of course, I'll find the records and pass them to you." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseCamKutuTuvalet: HouseScene = {
  id: "cam-kutu-tuvalet",
  title: "Cam Kutu Tuvalet", titleEn: "Glass Box Toilet",
  location: "Nişantaşı, minimalist rezidans", locationEn: "Nisantasi, minimalist residence",
  customerNames: [],
  dynamicCast: [{}, {}],
  background: "placeholder-house-30",
  askingPrice: 15750000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da {isim2}. Ev arkadaşı olmayı düşünüyoruz, birlikte bakıyoruz.", en: "Hello, I'm {isim}, this is {isim2}. We are thinking of being roommates, we are looking together." } },
        { speaker: "customer2", text: { tr: "Fotoğraflar çok şık görünüyordu, minimalist tarz tam bize göre.", en: "The photos looked very chic, the minimalist style is just for us." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Minimalizmi bir üst seviyeye taşıyan bir ev bu, göreceksiniz.\"", en: "\"This is a house that takes minimalism to the next level, you will see.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Şıklık evet, ama bazı detaylar sizi şaşırtabilir.\"", en: "\"Chicness yes, but some details might surprise you.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Önce içeri geçelim, tepkinizi görmek istiyorum açıkçası.\"", en: "\"Let's go inside first, I want to see your reaction frankly.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte salon, ortadaki o şeffaf cam küp de tuvalet oluyor.", en: "Here is the living room, and that transparent glass cube in the middle is the toilet." } },
        { speaker: "customer2", text: { tr: "(donup kalır) Yani... tuvalet, salonun tam ortasında, camdan mı?", en: "(freezes) You mean... the toilet is right in the middle of the living room, made of glass?" } },
        { speaker: "customer1", text: { tr: "{isim2}, ben bunu asla kullanamam, herkes görür.", en: "{isim2}, I can never use this, everyone will see." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Şeffaflık burada bir tasarım felsefesi, mahremiyet biraz geri planda kalıyor.\"", en: "\"Transparency is a design philosophy here, privacy takes a back seat a bit.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Buzlu folyo kaplarsanız görünürlük neredeyse sıfıra iner.\"", en: "\"If you cover it with frosted foil, visibility drops to almost zero.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Ev arkadaşlığında sır kalmaz zaten, bu da hızlandırıyor sadece.\"", en: "\"There are no secrets in a roommate arrangement anyway, this just speeds it up.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: { tr: "\"Tasarım felsefesi\" derken mahremiyetten feragat etmemiz mi gerekiyor?", en: "When you say \"design philosophy\", do we have to forgo privacy?" } }], next: "privacy" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Buzlu folyo fikri işimize yarar gibi duruyor.", en: "The frosted foil idea seems like it would work for us." } }], next: "privacy" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(gülümser) {isim}, adam haklı olabilir aslında.", en: "(smiles) {isim}, the man might actually be right." } }], next: "privacy" },

    privacy: {
      id: "privacy",
      lines: [
        { speaker: "customer1", text: { tr: "Peki müzik çalarsak ya da kapıyı vursak bile duyulur mu dışarıdan?", en: "So even if we play music or knock on the door, can it be heard from outside?" } },
        { speaker: "customer1", text: { tr: "Yani akustik konusunda da mı şeffaf bu cam?", en: "I mean, is this glass transparent in terms of acoustics too?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Açıkçası ses biraz geçiyor evet, ama alışkanlık meselesi zamanla.\"", en: "\"Frankly sound passes through a bit yes, but it's a matter of habit over time.\"" }, next: "privacy_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Çift camlı versiyona geçerseniz ses yalıtımı ciddi oranda artar.\"", en: "\"If you switch to the double-glazed version, sound insulation will significantly increase.\"" }, next: "privacy_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Kulaklık takarsanız hiç sorun kalmaz zaten.\"", en: "\"If you wear headphones there won't be a problem at all anyway.\"" }, next: "privacy_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    privacy_a: { id: "privacy_a", lines: [{ speaker: "thought", text: { tr: "\"Alışkanlık meselesi\" cümlesini duyunca içim rahatlamadı.", en: "Hearing the sentence \"matter of habit\" did not put my mind at ease." } }], next: "price" },
    privacy_b: { id: "privacy_b", lines: [{ speaker: "customer2", text: { tr: "Çift cam mantıklı bir çözüm, düşünürüz.", en: "Double glazing is a logical solution, we'll think about it." } }], next: "price" },
    privacy_c: { id: "privacy_c", lines: [{ speaker: "customer1", text: { tr: "(güler) {isim2}, kulaklık her derde deva değil ama komik oldu.", en: "(laughs) {isim2}, headphones aren't a cure-all but it was funny." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer2", text: { tr: "Fiyat konusunda biraz esneklik var mı, mahremiyet meselesini de düşünürsek?", en: "Is there a bit of flexibility in the price, considering the privacy issue too?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %11 indirim sağlayabilirim, folyo masrafını da düşünerek.\"", en: "\"I can talk to the owner and provide an 11% discount, considering the foil cost too.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 11 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu konsepte göre makul, düşünme payınız olsun.\"", en: "\"The price is already reasonable for this concept, take your time to think.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu tasarım bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This design won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte mantıklı geldi, {isim2}'yle folyoyu birlikte yaptırırız.", en: "With the discount it made sense, {isim2} and I will have the foil done together." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, iyi anlaşmalar dilerim.", en: "Best of luck, I wish you good agreements." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Folyo fiyatını öğrenip ona göre karar verelim, {isim} de aynı fikirde.", en: "Let's find out the foil price and decide accordingly, {isim} agrees too." } },
        { speaker: "emlah", text: { tr: "Doğru karar, öğrenince beni arayabilirsiniz.", en: "Right decision, you can call me when you find out." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseTekDaireselOda: HouseScene = {
  id: "tek-dairesel-oda",
  title: "Tek Dairesel Oda", titleEn: "Single Circular Room",
  location: "Levent, tasarım rezidansı", locationEn: "Levent, design residence",
  customerNames: [],
  dynamicCast: [{}],
  background: "placeholder-house-31",
  askingPrice: 12750000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Aşırı minimalist bir yaşam arıyorum, duvar bile istemiyorum diyebilirim.", en: "Hello, I'm {isim}. I'm looking for an extremely minimalist life, I don't even want walls I could say." } },
        { speaker: "customer1", text: { tr: "İlanda 'tek dairesel oda' yazıyordu, tam da hayalimdeki gibi bir şey mi bu?", en: "The ad said 'single circular room', is this exactly like in my dreams?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Tam olarak öyle, tek bir yuvarlak alan, hiç köşe yok.\"", en: "\"Exactly like that, a single round space, no corners at all.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Öyle ama bazı pratik zorlukları da beraberinde getiriyor.\"", en: "\"It is, but it brings some practical difficulties with it.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Görünce anlarsınız, alışılmadık bir deneyim sizi bekliyor.\"", en: "\"You'll understand when you see it, an unusual experience awaits you.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte burası, yatak, mutfak, oturma alanı hepsi tek dairesel bir alanda, bölme yok.", en: "Here it is, bed, kitchen, seating area all in a single circular space, no partitions." } },
        { speaker: "customer1", text: { tr: "(etrafı döner) Vay canına, gerçekten hiç köşe yok, tuvalet bile açıkta.", en: "(turns around) Wow, there really are no corners, even the toilet is out in the open." } },
        { speaker: "customer1", text: { tr: "Sadece bir paravanla ayrılmış, bu biraz fazla açık değil mi?", en: "It's only separated by a folding screen, isn't this a bit too open?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Açık plan felsefesinin en saf hali diyebiliriz, alışması biraz zaman alır.\"", en: "\"We can call it the purest form of the open plan philosophy, it takes a bit of time to get used to.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Paravan sistemini genişletip ek bir bölme yaptırabiliriz isterseniz.\"", en: "\"We can expand the folding screen system and have an additional partition made if you want.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Köşe olmayınca eşyanızı kaybetme ihtimaliniz de sıfıra iniyor.\"", en: "\"Since there are no corners, your chance of losing your stuff drops to zero too.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"En saf hali\" derken biraz fazla saf olmasın bu.", en: "When you say \"the purest form\", isn't this a bit too pure." } }], next: "furniture" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Ek bölme fikri işime yarar gibi duruyor.", en: "The additional partition idea seems like it would work for me." } }], next: "furniture" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu açıdan hiç bakmamıştım, ilginç.", en: "(laughs) I had never looked at it from this angle, interesting." } }], next: "furniture" },

    furniture: {
      id: "furniture",
      lines: [
        { speaker: "customer1", text: { tr: "Peki köşesi olmayan bir odaya normal mobilyalar sığar mı, hepsi özel mi olacak?", en: "So do normal furniture fit in a room without corners, will they all be custom?" } },
        { speaker: "customer1", text: { tr: "Çünkü özel üretim mobilya bütçemi zorlar diye düşünüyorum.", en: "Because I think custom-made furniture would stretch my budget." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Maalesef çoğu mobilya özel ölçü olmak zorunda, standart dolap girmiyor.\"", en: "\"Unfortunately most furniture has to be custom sized, standard wardrobes don't fit.\"" }, next: "furniture_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Duvara monte modüler sistemler kullanırsanız çoğu ihtiyacı karşılar.\"", en: "\"If you use wall-mounted modular systems it meets most needs.\"" }, next: "furniture_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Az eşyayla yaşamak zaten bu tarzın felsefesi, bir nevi bonus.\"", en: "\"Living with less stuff is already the philosophy of this style, a kind of bonus.\"" }, next: "furniture_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    furniture_a: { id: "furniture_a", lines: [{ speaker: "thought", text: { tr: "\"Standart dolap girmiyor\" cümlesi bütçemi düşündürdü.", en: "The sentence \"standard wardrobes don't fit\" made me think about my budget." } }], next: "price" },
    furniture_b: { id: "furniture_b", lines: [{ speaker: "customer1", text: { tr: "Modüler sistemler mantıklı bir çözüm gibi duruyor.", en: "Modular systems seem like a logical solution." } }], next: "price" },
    furniture_c: { id: "furniture_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Az eşya felsefesi zaten amacım, doğru noktaya değindiniz.", en: "(smiles) The less stuff philosophy is my goal anyway, you hit the right point." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyat konusunda biraz esneklik var mı, mobilya masrafını düşünürsek?", en: "Is there a bit of flexibility in price, considering the furniture cost?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %10 indirim sağlayabilirim, mobilya payını da düşünerek.\"", en: "\"I can talk to the owner and provide a 10% discount, considering the furniture share too.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu özel tasarıma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this special design, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu tasarım bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This design won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, modüler mobilyaları hemen sipariş ederim.", en: "With the discount I've decided, I will order the modular furniture right away." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, minimalist hayatınız kutlu olsun.", en: "Best of luck, happy minimalist life." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Mobilya fiyatlarını araştırıp size dönerim, düşüneceğim.", en: "I will research the furniture prices and get back to you, I'll think about it." } },
        { speaker: "emlah", text: { tr: "Elbette, ne zaman isterseniz arayabilirsiniz.", en: "Of course, you can call whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseMerdivenEvi: HouseScene = {
  id: "merdiven-evi",
  title: "Merdiven Evi", titleEn: "Staircase House",
  location: "Balat, dik yokuş üstü", locationEn: "Balat, top of a steep hill",
  customerNames: [],
  dynamicCast: [{}],
  background: "placeholder-house-32",
  askingPrice: 11620000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Balat'ın dokusuna hayranım, ilanı görünce hemen not aldım.", en: "Hello, I'm {isim}. I admire Balat's texture, when I saw the ad I noted it immediately." } },
        { speaker: "customer1", text: { tr: "Fotoğraflarda ev biraz karmaşık görünüyordu, koridor falan yok gibiydi.", en: "In the photos the house looked a bit complicated, like there were no corridors or anything." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Koridor yok çünkü ev zaten bir merdiven etrafında kurulu.\"", en: "\"There is no corridor because the house is already built around a staircase.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "b", text: { tr: "\"Balat'ın en özgün evlerinden biri diyebilirim rahatlıkla.\"", en: "\"I can easily say it's one of Balat's most unique houses.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "c", text: { tr: "\"Merak ettiyseniz içeri geçelim, kendi gözlerinizle görün.\"", en: "\"If you're curious let's go inside, see with your own eyes.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Ev tam anlamıyla dönel bir merdiven ve ona açılan küçük bölmelerden oluşuyor.", en: "The house literally consists of a spiral staircase and small partitions opening to it." } },
        { speaker: "customer1", text: { tr: "(şaşkınlıkla) Yani her oda merdivenin farklı bir basamağında mı?", en: "(in astonishment) You mean every room is on a different step of the stairs?" } },
        { speaker: "customer1", text: { tr: "Mutfaktan yatak odasına geçmek için merdiven mi çıkacağım her seferinde?", en: "Am I going to climb stairs every time to go from the kitchen to the bedroom?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Aynen öyle, günde ortalama 40 basamak, bedava spor salonu gibi düşünün.\"", en: "\"Exactly, an average of 40 steps a day, think of it like a free gym.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Doğru, ama en azından her bölmenin kendine has bir manzarası var.\"", en: "\"True, but at least each partition has its own unique view.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Gece atıştırmalık almak için üç kat inip çıkmak motivasyonu artırıyor.\"", en: "\"Going up and down three flights to get a midnight snack increases motivation.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Bedava spor salonu\" derken bunu her gün mü yapacağım cidden?", en: "When you say \"free gym\", am I seriously going to do this every day?" } }], next: "safety" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Manzara fikri hoşuma gitti, her bölmeyi merak ediyorum şimdi.", en: "I liked the view idea, now I'm curious about every partition." } }], next: "safety" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Motivasyon derken, gece atıştırmalığı pes ettirir bence.", en: "(laughs) Speaking of motivation, I think it would make you give up on the midnight snack." } }], next: "safety" },

    safety: {
      id: "safety",
      lines: [
        { speaker: "customer1", text: { tr: "Peki gece yarısı yarı uykuluyken bu merdivenlerden düşme riski yok mu?", en: "So isn't there a risk of falling down these stairs half-asleep in the middle of the night?" } },
        { speaker: "customer1", text: { tr: "Çünkü bu ciddi bir güvenlik sorunu gibi görünüyor bana.", en: "Because this looks like a serious safety issue to me." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Şimdiye kadar ciddi bir vaka olmadı, gerçi gece ışıkları biraz zayıf.\"", en: "\"There hasn't been a serious case so far, although the night lights are a bit weak.\"" }, next: "safety_a", effects: { suspicion: 25 } },
        { id: "b", text: { tr: "\"Basamaklara hareket sensörlü aydınlatma taktırabiliriz.\"", en: "\"We can have motion-sensor lighting installed on the steps.\"" }, next: "safety_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Korkuluklar sağlam, gündüz görünce içiniz rahatlar diye düşünüyorum.\"", en: "\"The railings are solid, I think your mind will be at ease when you see them in the daytime.\"" }, next: "safety_c", effects: { suspicion: 0, interest: 10 } },
      ],
    },
    safety_a: { id: "safety_a", lines: [{ speaker: "thought", text: { tr: "\"Işıklar biraz zayıf\" cümlesi hiç güven verici değildi.", en: "The sentence \"lights are a bit weak\" wasn't reassuring at all." } }], next: "price" },
    safety_b: { id: "safety_b", lines: [{ speaker: "customer1", text: { tr: "Sensörlü aydınlatma fikri işime yarar, mantıklı.", en: "The sensor lighting idea works for me, logical." } }], next: "price" },
    safety_c: { id: "safety_c", lines: [{ speaker: "customer1", text: { tr: "Korkulukların sağlam olması en azından içimi biraz rahatlattı.", en: "The railings being solid put my mind at ease a bit at least." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyat konusunda pazarlık payınız var mı biraz?", en: "Do you have any room for negotiation on the price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %10 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 10% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu özgün dokuya göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this unique texture, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu ev bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This house won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte mantıklı geldi, sensörlü aydınlatmayı hemen yaptırırım.", en: "With the discount it made sense, I will have the sensor lighting done right away." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, bacaklarınız güçlenecek bu arada.", en: "Best of luck, your legs will get stronger by the way." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Gece aydınlatmasını bir de karanlıkta görmek isterim, sonra karar veririm.", en: "I'd like to see the night lighting in the dark too, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar gösteririm.", en: "Sure, I will show it again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseDikeyDepolama: HouseScene = {
  id: "dikey-depolama",
  title: "Dikey Depolama", titleEn: "Vertical Storage",
  location: "Karaköy, dar cephe bina", locationEn: "Karakoy, narrow facade building",
  customerNames: [],
  dynamicCast: [{}, {}],
  background: "placeholder-house-33",
  askingPrice: 18750000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da ortağım {isim2}. Antika koleksiyonumuz için geniş depolama alanı arıyoruz.", en: "Hello, I'm {isim}, this is my partner {isim2}. We are looking for a large storage space for our antique collection." } },
        { speaker: "customer2", text: { tr: "İlanda 'dikey depolama' yazıyordu, tam bize göre bir şey umuyoruz.", en: "The ad said 'vertical storage', we are hoping it's exactly for us." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Depolama konusunda hayal kırıklığına uğramazsınız, göreceksiniz.\"", en: "\"You won't be disappointed regarding storage, you'll see.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Dikey derken tam anlamıyla dikey, biraz alışılmadık bir sistem.\"", en: "\"When I say vertical it's literally vertical, a somewhat unusual system.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Koleksiyonerler için ilginç bir çözüm bu, gösterelim.\"", en: "\"This is an interesting solution for collectors, let's show you.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Bina çok dar olduğu için katlar arası her şey bir makara sistemiyle çekiliyor, asansör yerine.", en: "Because the building is very narrow, everything is pulled between floors with a pulley system, instead of an elevator." } },
        { speaker: "customer1", text: { tr: "(şaşkınlıkla) Yani eşyalarımızı makarayla mı yukarı çekeceğiz her seferinde?", en: "(in astonishment) So are we going to pull our stuff up with a pulley every time?" } },
        { speaker: "customer2", text: { tr: "{isim}, antika dolabı nasıl sığacak buraya öyle?", en: "{isim}, how is the antique cabinet going to fit in here like that?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Makara sistemi 200 kiloya kadar taşıyor, dolabınız rahat sığar.\"", en: "\"The pulley system carries up to 200 kilos, your cabinet will easily fit.\"" }, next: "q1_a", effects: { suspicion: 10, interest: 10 } },
        { id: "b", text: { tr: "\"Büyük parçalar için ayrıca bir vinç kiralama seçeneğimiz de var.\"", en: "\"We also have an option to rent a crane for large pieces.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"Bu sistem sayesinde hırsızlar bile eşyayı taşıyamıyor, bir çeşit güvenlik.\"", en: "\"Thanks to this system even thieves can't carry the stuff, a kind of security.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: { tr: "200 kilo... bu rakam beni biraz rahatlattı doğrusu.", en: "200 kilos... this figure actually put my mind at ease a bit." } }], next: "narrow" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Vinç kiralama fikri mantıklı bir yedek plan.", en: "The crane rental idea is a logical backup plan." } }], next: "narrow" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(güler) {isim}, bu adamın espri anlayışı fena değil.", en: "(laughs) {isim}, this guy's sense of humor isn't bad." } }], next: "narrow" },

    narrow: {
      id: "narrow",
      lines: [
        { speaker: "customer1", text: { tr: "Bina bu kadar darken katlar arasında yürümek de zor olmalı, merdiven nasıl?", en: "With the building this narrow, walking between floors must be hard too, how are the stairs?" } },
        { speaker: "customer1", text: { tr: "İki kişi aynı anda geçebiliyor mu yoksa sıra mı bekliyoruz?", en: "Can two people pass at the same time or do we wait in line?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Açıkçası tek kişilik bir merdiven, sıra beklemek gerekebilir.\"", en: "\"Frankly it's a single-person staircase, you might need to wait in line.\"" }, next: "narrow_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Dar ama yan yana geçiş için küçük genişletme yapılabilir.\"", en: "\"Narrow but a small expansion can be made for passing side by side.\"" }, next: "narrow_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: { tr: "\"İş ortaklığında zaten sıra beklemeyi öğrenmişsinizdir, değil mi?\"", en: "\"You must have learned to wait in line in a business partnership already, haven't you?\"" }, next: "narrow_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    narrow_a: { id: "narrow_a", lines: [{ speaker: "customer2", text: { tr: "\"Sıra beklemek\" gerçekten iş ortaklığı için ideal değil açıkçası.", en: "\"Waiting in line\" is frankly really not ideal for a business partnership." } }], next: "price" },
    narrow_b: { id: "narrow_b", lines: [{ speaker: "customer1", text: { tr: "Genişletme seçeneği olması iyi bir haber.", en: "Having an expansion option is good news." } }], next: "price" },
    narrow_c: { id: "narrow_c", lines: [{ speaker: "customer1", text: { tr: "(kahkaha) {isim2}, bu adam bizi çok iyi tanıyor galiba.", en: "(laughs out loud) {isim2}, I guess this guy knows us very well." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer2", text: { tr: "Fiyat konusunda biraz esneklik var mı, makara sistemini de düşünürsek?", en: "Is there a bit of flexibility in price, considering the pulley system too?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu özel depolama sistemine göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this special storage system, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu depolama sistemi bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This storage system won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte anlaştık, {isim2}'yle koleksiyonu birlikte taşırız.", en: "With the discount we have a deal, {isim2} and I will move the collection together." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, makarayı iyi yağlayın.", en: "Best of luck, grease the pulley well." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Vinç kiralama fiyatını öğrenip ona göre karar verelim, {isim} de aynı fikirde.", en: "Let's find out the crane rental price and decide accordingly, {isim} agrees too." } },
        { speaker: "emlah", text: { tr: "Doğru karar, öğrenince beni arayabilirsiniz.", en: "Right decision, you can call me when you find out." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseBogazinIncisi: HouseScene = {
  id: "bogazin-incisi",
  title: "Boğaz'ın İncisi", titleEn: "Pearl of the Bosphorus",
  location: "Boğaz kıyısı, tarihi yalı", locationEn: "Bosphorus coast, historical mansion",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-sea",
  askingPrice: 86250000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Bu yalıyı yıllardır takip ediyorum, nihayet satışa çıktığına inanamadım.", en: "Hello, I'm {isim}. I've been following this mansion for years, I couldn't believe it finally went on sale." } },
        { speaker: "customer1", text: { tr: "Ailemin köklü bir tarihi var, böyle bir yapıya sahip olmak bizim için özel.", en: "My family has a deep-rooted history, owning such a structure is special for us." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"O zaman doğru yerdesiniz, bu yalının 150 yıllık bir hikayesi var.\"", en: "\"Then you are in the right place, this mansion has a 150-year story.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Tarihi dokusu kadar bakım gereksinimi de büyük, baştan söyleyeyim.\"", en: "\"Its maintenance requirement is as big as its historical texture, let me tell you from the start.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Önce içeri geçelim, kendi gözlerinizle görün.\"", en: "\"Let's go inside first, see with your own eyes.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "Yalının ahşap iskeleti orijinal, denize sıfır salonu İstanbul'un en özel manzaralarından birine sahip.", en: "The mansion's wooden skeleton is original, its seafront living room has one of Istanbul's most special views." } },
        { speaker: "customer1", text: { tr: "(gülümser, sonra tereddüt eder) Muhteşem... ama bir şey sormam lazım.", en: "(smiles, then hesitates) Magnificent... but I need to ask something." } },
        { speaker: "customer1", text: { tr: "Komşular gece burada bir 'amiral hayaleti' dolaştığını söylüyor, doğru mu bu?", en: "Neighbors say an 'admiral ghost' roams here at night, is this true?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Doğru, eski bir deniz subayının ruhu burada huzur bulmuş diyorlar, zarasız bir hikaye.\"", en: "\"True, they say the spirit of an old naval officer found peace here, a harmless story.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Böyle bir söylenti var ama tapuda hayalet maddesi yok, merak etmeyin.\"", en: "\"There is such a rumor but there is no ghost clause in the title deed, don't worry.\"" }, next: "q1_b", effects: { suspicion: 0, fun: 5 } },
        { id: "c", text: { tr: "\"O hikaye yalının değerini bile artırıyor açıkçası, turistler bayılıyor.\"", en: "\"That story actually increases the mansion's value frankly, tourists love it.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Zararsız\" derken, geceleri sesler falan duyulmuyor değil mi?", en: "When you say \"harmless\", no sounds or anything are heard at night, right?" } }], next: "bakim" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "(güler) Tapuda hayalet maddesi, bu espriyi sevdim.", en: "(laughs) Ghost clause in the title deed, I liked this joke." } }], next: "bakim" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "Vay be, hiç böyle düşünmemiştim, pazarlama dehası gibisiniz.", en: "Wow, I had never thought of it like this, you are like a marketing genius." } }], next: "bakim" },

    bakim: {
      id: "bakim",
      lines: [
        { speaker: "customer1", text: { tr: "Ahşap bir yapı bu kadar yıllık, bakım masrafı ne durumda?", en: "A wooden structure this many years old, how is the maintenance cost?" } },
        { speaker: "customer1", text: { tr: "Boğaz nemi ahşaba zarar verir diye biliyorum, endişeleniyorum açıkçası.", en: "I know Bosphorus dampness damages wood, I'm worried frankly." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Yıllık bakım gerekiyor evet, ama bu yapıların değeri zamanla artıyor, yatırım gibi düşünün.\"", en: "\"Annual maintenance is required yes, but the value of these structures increases over time, think of it as an investment.\"" }, next: "bakim_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Özel ahşap koruma sistemiyle bakım maliyeti ciddi oranda düşürülebiliyor.\"", en: "\"With a special wood protection system, maintenance costs can be significantly reduced.\"" }, next: "bakim_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: { tr: "\"Bu binanın bakımı bir hobi değil, bir ayrıcalık sayılır.\"", en: "\"The maintenance of this building is not a hobby, it is considered a privilege.\"" }, next: "bakim_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    bakim_a: { id: "bakim_a", lines: [{ speaker: "thought", text: { tr: "\"Yatırım gibi düşünün\" cümlesini duyunca içim şüpheyle doldu.", en: "Hearing the sentence \"think of it as an investment\" filled my heart with doubt." } }], next: "price" },
    bakim_b: { id: "bakim_b", lines: [{ speaker: "customer1", text: { tr: "Koruma sistemi fikri mantıklı, araştırırım.", en: "The protection system idea is logical, I will research it." } }], next: "price" },
    bakim_c: { id: "bakim_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Ayrıcalık derken haklısınız aslında.", en: "(smiles) You're actually right when you say privilege." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Bu ölçekte bir yatırımda fiyat konusunda esneklik var mı?", en: "Is there flexibility in price for an investment on this scale?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %4 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 4% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 4 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu tarihi dokuya göre makul, düşünme payınız olsun.\"", en: "\"The price is already reasonable for this historical texture, take your time to think.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu yalı bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This mansion won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, bu yalı ailemizde kalacak artık.", en: "With the discount I've decided, this mansion will stay in our family now." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, amiralin de hayrını görsün.", en: "Best of luck, may the admiral enjoy it too." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Ailemle konuşup size dönerim, bu büyüklükte bir karar acele verilmez.", en: "I'll talk to my family and get back to you, a decision this big is not rushed." } },
        { speaker: "emlah", text: { tr: "Elbette, ne zaman isterseniz arayabilirsiniz.", en: "Of course, you can call whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Bu ölçekte bir kararda baskıya tahammülüm yok, vaktinizi aldım.", en: "I have no tolerance for pressure in a decision of this scale, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseOzelAda: HouseScene = {
  id: "ozel-ada",
  title: "Özel Ada", titleEn: "Private Island",
  location: "Adalar açığı, özel ada", locationEn: "Off the Princes' Islands, private island",
  customerNames: [],
  dynamicCast: [{}, {}],
  background: "theme-island",
  askingPrice: 118500000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da ortağım {isim2}. Kendi özel adamız olsun istiyoruz uzun zamandır.", en: "Hello, I'm {isim}, this is my partner {isim2}. We've been wanting to have our own private island for a long time." } },
        { speaker: "customer2", text: { tr: "İlanı görünce inanamadık, gerçekten kendi adanız olabiliyor mu bu fiyata?", en: "We couldn't believe it when we saw the ad, can you really have your own island at this price?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle, tapu tamamen size ait olacak, eşi benzeri olmayan bir fırsat.\"", en: "\"Absolutely, the title deed will be completely yours, an unprecedented opportunity.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Olabiliyor ama küçük bir erişim detayı var, göstereyim.\"", en: "\"It can be, but there is a small access detail, let me show you.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Önce tekneyle bir tur atalım, adayı görün.\"", en: "\"Let's take a tour with a boat first, see the island.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte adanız, 3 dönümlük özel alan, kendi küçük koyu ve rıhtımıyla.", en: "Here is your island, a 3-acre private area, with its own small cove and pier." } },
        { speaker: "customer2", text: { tr: "(hayranlıkla bakar) Muhteşem... ama karşı kıyıya nasıl geçeceğiz, köprü falan yok galiba.", en: "(looks with admiration) Magnificent... but how will we cross to the opposite shore, there is no bridge or anything I guess." } },
        { speaker: "customer1", text: { tr: "{isim2}, bak şu tahta yol suyun altında kalmış.", en: "{isim2}, look, that wooden path is submerged underwater." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Gelgitte bazen yol kısa süreliğine suya gömülüyor, doğal bir ritim gibi düşünün.\"", en: "\"Sometimes during high tide the path gets submerged for a short time, think of it as a natural rhythm.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Küçük bir tekne veya deniz taksisiyle her koşulda geçiş sağlanabiliyor.\"", en: "\"Crossing can be provided in any condition with a small boat or sea taxi.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: { tr: "\"Bu da adanın gizemini artıran bir detay, herkes ulaşamıyor buraya.\"", en: "\"This is also a detail that increases the mystery of the island, not everyone can reach here.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Doğal ritim\" derken kaç saat suya gömülü kalıyor bu yol?", en: "When you say \"natural rhythm\", how many hours does this path stay submerged?" } }], next: "elektrik" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer2", text: { tr: "Deniz taksisi fikri işimize yarar gibi duruyor.", en: "The sea taxi idea seems like it would work for us." } }], next: "elektrik" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(güler) {isim}, adam haklı olabilir, kimse gelemeyecek bize.", en: "(laughs) {isim}, the guy might be right, no one will be able to come to us." } }], next: "elektrik" },

    elektrik: {
      id: "elektrik",
      lines: [
        { speaker: "customer1", text: { tr: "Peki elektrik ve su nasıl sağlanıyor, ana karadan bağlantı var mı?", en: "So how are electricity and water provided, is there a connection from the mainland?" } },
        { speaker: "customer1", text: { tr: "Yani bu ölçekte bir yatırımda alt yapı çok önemli bizim için.", en: "I mean, infrastructure is very important to us in an investment of this scale." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Jeneratör ve yağmur suyu toplama sistemiyle kendine yeterli bir ada bu.\"", en: "\"This is a self-sufficient island with a generator and a rainwater harvesting system.\"" }, next: "elektrik_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Deniz altından kablo döşeme projesi başvurusu şu an sahibinde, süreç ilerliyor.\"", en: "\"The application for the underwater cable laying project is currently with the owner, the process is progressing.\"" }, next: "elektrik_b", effects: { suspicion: 5, interest: 5 } },
        { id: "c", text: { tr: "\"Şehirden tamamen kopmak istiyorsanız bu tam istediğiniz şey.\"", en: "\"If you want to completely disconnect from the city, this is exactly what you want.\"" }, next: "elektrik_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    elektrik_a: { id: "elektrik_a", lines: [{ speaker: "customer2", text: { tr: "\"Kendine yeterli\" derken jeneratör sesi rahatsız eder mi peki?", en: "When you say \"self-sufficient\", will the generator sound be disturbing then?" } }], next: "price" },
    elektrik_b: { id: "elektrik_b", lines: [{ speaker: "customer1", text: { tr: "Süreç ilerliyor olması en azından umut verici.", en: "The fact that the process is progressing is at least hopeful." } }], next: "price" },
    elektrik_c: { id: "elektrik_c", lines: [{ speaker: "customer2", text: { tr: "(gülümser) Aslında tam da bunu istiyorduk, itiraf edeyim.", en: "(smiles) Actually that's exactly what we wanted, I'll admit." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Bu ölçekte bir yatırımda fiyatta esneklik var mı biraz?", en: "Is there a bit of flexibility in price in an investment on this scale?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %5 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 5% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 5 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu eşsiz konuma göre makul, düşünme payınız olsun.\"", en: "\"The price is already reasonable for this unique location, take your time to think.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Böyle bir ada bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"Such an island won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte anlaştık, {isim2}'yle jeneratörü hemen kurdururuz.", en: "With the discount we have a deal, {isim2} and I will have the generator installed right away." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, deniz taksisi numaramı da bırakayım.", en: "Best of luck, let me leave my sea taxi number too." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Alt yapı detaylarını netleştirip size dönelim, {isim} de aynı fikirde.", en: "Let's clarify the infrastructure details and get back to you, {isim} agrees too." } },
        { speaker: "emlah", text: { tr: "Doğru karar, netleşince beni arayabilirsiniz.", en: "Right decision, you can call me when it's clarified." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Bu ölçekte bir kararda baskıya tahammülümüz yok, vaktinizi aldık.", en: "We have no tolerance for pressure in a decision of this scale, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseGokyuzuMalikanesi: HouseScene = {
  id: "gokyuzu-malikanesi",
  title: "Gökyüzü Malikanesi", titleEn: "Sky Mansion",
  location: "Levent, gökdelen tepesi", locationEn: "Levent, top of a skyscraper",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-sky",
  askingPrice: 99000000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Helikopterle geliyorum genelde, bu yüzden bu malikane tam bana göre görünüyor.", en: "Hello, I'm {isim}. I usually commute by helicopter, so this mansion looks perfect for me." } },
        { speaker: "customer1", text: { tr: "Şehrin en yüksek noktasında bir ev, hayalim buydu açıkçası.", en: "A house at the highest point of the city, frankly this was my dream." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Doğru yerdesiniz, İstanbul'un en yüksek konut noktasındasınız şu an.\"", en: "\"You are in the right place, you are currently at Istanbul's highest residential point.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Yükseklik güzel ama küçük bir ulaşım detayı var, göstereyim.\"", en: "\"The height is nice but there is a small transportation detail, let me show you.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Önce manzarayı görün, gerisini sonra konuşuruz.\"", en: "\"See the view first, we'll talk about the rest later.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte helikopter pisti, tam malikanenin çatısında, iniş kalkış izniniz de hazır.", en: "Here is the helipad, right on the roof of the mansion, your takeoff and landing permit is ready too." } },
        { speaker: "customer1", text: { tr: "(gözleri parlar, sonra durur) Harika... ama asansör burada mı, yoksa merdivenle mi çıkıyoruz?", en: "(eyes sparkle, then stops) Great... but is the elevator here, or do we climb by stairs?" } },
        { speaker: "customer1", text: { tr: "80 kat merdiven çıkmak istemem açıkçası.", en: "I frankly wouldn't want to climb 80 flights of stairs." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Asansör var tabii, sadece bazı günler bakımdan dolayı devre dışı kalıyor.\"", en: "\"There is an elevator of course, it just gets deactivated some days due to maintenance.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Var, ayrıca yedek jeneratörlü ikinci bir asansör de ekleniyor bu ay.\"", en: "\"There is, plus a second elevator with a backup generator is being added this month.\"" }, next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: { tr: "\"Zaten helikopterle geliyorsunuz, asansör lüks bile sayılır sizin için.\"", en: "\"You're arriving by helicopter anyway, an elevator is even considered a luxury for you.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Bazı günler\" derken, ayda kaç gün bakımda kalıyor tam olarak?", en: "When you say \"some days\", exactly how many days a month does it stay in maintenance?" } }], next: "ruzgar" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Yedek asansör fikri içimi rahatlattı biraz.", en: "The backup elevator idea put my mind at ease a bit." } }], next: "ruzgar" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Bu mantığı hiç düşünmemiştim ama haklısınız.", en: "(laughs) I had never thought of this logic but you're right." } }], next: "ruzgar" },

    ruzgar: {
      id: "ruzgar",
      lines: [
        { speaker: "customer1", text: { tr: "Bu yükseklikte rüzgar helikopter inişini etkiler mi peki, güvenlik açısından soruyorum.", en: "So does the wind affect helicopter landing at this height, I'm asking for safety reasons." } },
        { speaker: "customer1", text: { tr: "Sık sık inip kalkacağım için bu benim için kritik bir detay.", en: "Since I will be taking off and landing frequently, this is a critical detail for me." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Rüzgarlı günlerde biraz risk var evet, ama pilotlar genelde idare ediyor.\"", en: "\"There is a bit of risk on windy days yes, but pilots usually manage.\"" }, next: "ruzgar_a", effects: { suspicion: 20 } },
        { id: "b", text: { tr: "\"Pist özel rüzgar kesici duvarlarla donatıldı, güvenlik sertifikalı.\"", en: "\"The helipad is equipped with special windbreaker walls, security certified.\"" }, next: "ruzgar_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: { tr: "\"Rüzgarlı günler zaten helikopterle gelmemek için iyi bir bahane.\"", en: "\"Windy days are a good excuse not to come by helicopter anyway.\"" }, next: "ruzgar_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    ruzgar_a: { id: "ruzgar_a", lines: [{ speaker: "thought", text: { tr: "\"Pilotlar genelde idare ediyor\" cümlesi hiç güven verici değildi.", en: "The sentence \"pilots usually manage\" wasn't reassuring at all." } }], next: "price" },
    ruzgar_b: { id: "ruzgar_b", lines: [{ speaker: "customer1", text: { tr: "Sertifikalı olması güven verici, bunu duymak istiyordum.", en: "It being certified is reassuring, that's what I wanted to hear." } }], next: "price" },
    ruzgar_c: { id: "ruzgar_c", lines: [{ speaker: "customer1", text: { tr: "(kahkaha) Bu bakış açısını beğendim doğrusu.", en: "(laughs out loud) I actually liked this perspective." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Bu ölçekte bir yatırımda fiyatta esneklik var mı biraz?", en: "Is there a bit of flexibility in price for an investment of this scale?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %4 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 4% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 4 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu eşsiz konuma göre makul, düşünme payınız olsun.\"", en: "\"The price is already reasonable for this unique location, take your time to think.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu manzara bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This view won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, yedek asansörü de takip ederim.", en: "With the discount I've decided, I will track the backup elevator too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, iyi uçuşlar dilerim.", en: "Best of luck, I wish you good flights." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Asansör bakım takvimini bir de kendim görmek isterim, sonra karar veririm.", en: "I'd like to see the elevator maintenance schedule myself too, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Elbette, ne zaman isterseniz gösteririm.", en: "Of course, I will show it whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Bu ölçekte bir kararda baskıya tahammülüm yok, vaktinizi aldım.", en: "I have no tolerance for pressure in a decision of this scale, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseOtobusDuragi: HouseScene = {
  id: "otobus-duragi",
  title: "Otobüs Durağı Manzaralı Salon", titleEn: "Living Room with Bus Stop View",
  location: "Mecidiyeköy, ana cadde", locationEn: "Mecidiyekoy, main street",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-busstop",
  askingPrice: 14250000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.2, funWeight: 1.2, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Salonun camından tam bir durak görünüyor, ilanda öyle yazmıyordu ama.", en: "Hello, I'm {isim}. A full bus stop is visible from the living room window, the ad didn't say so though." } },
        { speaker: "customer1", text: { tr: "Yani sabah akşam insanlar oturup bana bakacak mı yani?", en: "I mean, are people going to sit and look at me morning and evening?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Bakmazlar, telefonlarına bakıyorlar zaten.\"", en: "\"They won't look, they are looking at their phones anyway.\"" }, next: "enter", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Perde taktırırsınız, beş dakikalık iş.\"", en: "\"You can have curtains installed, it's a five-minute job.\"" }, next: "enter", effects: { interest: 5 } },
        { id: "c", text: { tr: "\"Doğru, biraz sahne üstünde yaşamak gibi bir şey.\"", en: "\"True, it's a bit like living on a stage.\"" }, next: "enter", effects: { suspicion: 10, fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte salon, camdan durak tam karşınızda.", en: "Here is the living room, the bus stop is right across from the window." } },
        { speaker: "customer1", text: { tr: "(dikkatlice bakar) Otobüs anonsu da içeri geliyor mu peki, \"sonraki durak\" falan?", en: "(looks carefully) Does the bus announcement come inside too, like \"next stop\" or something?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Gelmez, çift cam var, sessiz sedasız.\"", en: "\"It doesn't, there is double glazing, quiet and peaceful.\"" }, next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Hafif gelir ama alışırsınız, hatta saati bile şaşırmazsınız.\"", en: "\"It comes slightly but you'll get used to it, you won't even lose track of time.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Anonsu ninni gibi düşünün, uyku terapisi bedava.\"", en: "\"Think of the announcement like a lullaby, sleep therapy for free.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Çift camsa iyi, ama garanti veriyor musunuz buna?", en: "If it's double glazing that's good, but do you guarantee this?" } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Saati şaşırmamak fena fikir değil aslında.", en: "Not losing track of time isn't a bad idea actually." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Uyku terapisi... bu satış taktiğini not aldım.", en: "(laughs) Sleep therapy... I noted this sales tactic." } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(tam o sırada dışarıda bir otobüs sert fren yapar, hafif bir \"tıısss\" sesi duyulur)", en: "(just then a bus brakes hard outside, a slight \"hiss\" sound is heard)" } },
        { speaker: "emlah", text: { tr: "Gördüğünüz gibi, cam gerçekten sesi kesiyor, siz bile şaşırdınız.", en: "As you can see, the glass really cuts the sound, even you were surprised." } },
        { speaker: "customer1", text: { tr: "Haklısınız, hiç duymadım neredeyse.", en: "You're right, I barely heard it." } },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Peki fiyatta durak manzarası için bir indirim düşünülür mü?", en: "So would a discount be considered for the bus stop view in the price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim ayarlarım.\"", en: "\"I can talk to the owner and arrange an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Fiyat zaten ana caddeye bu kadar yakınlık için makul.\"", en: "\"The price is already reasonable for such proximity to the main street.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu konum bu fiyata bir daha çıkmaz, bugün karar vermelisiniz.\"", en: "\"This location won't hit the market at this price again, you must decide today.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte anlaştık, perdeyi de ben hallederim.", en: "With the discount we have a deal, I'll handle the curtain too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, iyi seyirler... yani iyi oturumlar.", en: "Best of luck, enjoy the view... I mean enjoy your stay." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir de akşam saatinde gelip dinlemek isterim, o zaman karar veririm.", en: "I'd like to come and listen during the evening hours too, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Durağı bir kez daha dinleyip düşüneceğim, vaktinizi aldım.", en: "I will listen to the stop once more and think about it, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseYankiDairesi: HouseScene = {
  id: "yanki-dairesi",
  title: "Yankı Dairesi", titleEn: "Echo Apartment",
  location: "Beyoğlu, eski han katı", locationEn: "Beyoglu, old inn floor",
  customerNames: [],
  dynamicCast: [{ gender: "k" }, { gender: "e" }],
  background: "theme-echo",
  askingPrice: 18000000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1, funWeight: 1.5, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da eşim {isim2}. Tavan kubbeli diye çok merak ettik.", en: "Hello, I'm {isim}, this is my spouse {isim2}. We were very curious because the ceiling is domed." } },
        { speaker: "customer2", text: { tr: "(içeri girer girmez sesi yankılanır) Merhaba baaa-ba-ba...", en: "(right after entering his voice echoes) Hello lo-lo-lo..." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Evet, kubbe akustiği böyle, biraz konser salonu gibi.\"", en: "\"Yes, this is the dome acoustics, a bit like a concert hall.\"" }, next: "enter", effects: { fun: 10 } },
        { id: "b", text: { tr: "\"Halı ve perdeyle bu yankı büyük ölçüde azalır.\"", en: "\"With carpets and curtains this echo is greatly reduced.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "c", text: { tr: "\"Kavga ederken bile üç kere duyacaksınız birbirinizi, avantaj sayılır.\"", en: "\"Even when arguing you will hear each other three times, it counts as an advantage.\"" }, next: "enter", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "customer2", text: { tr: "(gülerek) Şarkı söylesem koro gibi mi çıkar peki?", en: "(laughing) If I sing, would it sound like a choir?" } },
        { speaker: "customer1", text: { tr: "Ciddi soru sorayım ama, komşular bu sesi duyar mı acaba?", en: "Let me ask a serious question though, I wonder if the neighbors hear this sound?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Duymaz, kubbe sesi içeride hapsediyor, dışarı sızmıyor.\"", en: "\"They don't, the dome traps the sound inside, it doesn't leak out.\"" }, next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Biraz duyulabilir ama komşularla iyi geçinirsiniz zaten.\"", en: "\"It might be heard a bit but you'll get along well with the neighbors anyway.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Duyarlarsa da alkışlarlar herhalde.\"", en: "\"If they hear it they will probably applaud.\"" }, next: "q1_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Hapsediyor\" kelimesi tuhaf geldi biraz açıkçası.", en: "The word \"traps\" sounded a bit weird frankly." } }], next: "price" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "İyi komşuluk her derde deva zaten.", en: "Good neighborliness is a cure for everything anyway." } }], next: "price" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(kahkaha) Alkış fikri hoşuma gitti resmen.", en: "(laughs out loud) I literally liked the applause idea." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta biraz esneklik olur mu?", en: "Would there be a bit of flexibility in price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %7 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 7% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 7 } },
        { id: "b", text: { tr: "\"Bu akustik bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This acoustic won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: { tr: "\"Fiyat zaten bu kubbeye göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this dome, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer2", text: { tr: "İndirimle anlaştık, ilk işim burada şarkı söylemek olacak.", en: "We have a deal with the discount, my first order of business will be to sing here." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, komşulara şimdiden kolay gelsin.", en: "Best of luck, God help the neighbors in advance." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir de akşam sessizlikte gelip dinleyelim, sonra karar veririz.", en: "Let's come and listen in the evening silence too, then we'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseRuzgarTuneli: HouseScene = {
  id: "ruzgar-tuneli",
  title: "Rüzgar Tüneli Balkon", titleEn: "Wind Tunnel Balcony",
  location: "Maslak, iki kule arası", locationEn: "Maslak, between two towers",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-wind",
  askingPrice: 13120000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.3, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Balkon kapısını açar açmaz saçım uçuştu, normal mi bu?", en: "Hello, I'm {isim}. As soon as I opened the balcony door my hair flew, is this normal?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Normal, iki kule arasında olduğu için biraz rüzgar tüneli gibi çalışıyor.\"", en: "\"Normal, because it's between two towers it works a bit like a wind tunnel.\"" }, next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Doğal havalandırma diyelim, klimaya ihtiyacınız olmaz.\"", en: "\"Let's call it natural ventilation, you won't need an AC.\"" }, next: "enter", effects: { fun: 10 } },
        { id: "c", text: { tr: "\"Biraz rüzgarlı evet, ama içeri geçince fark etmiyor.\"", en: "\"A bit windy yes, but once you go inside you don't notice it.\"" }, next: "enter" },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte balkon, manzara gerçekten güzel.", en: "Here is the balcony, the view is really beautiful." } },
        { speaker: "customer1", text: { tr: "(elini tutar) Çamaşır asarsam öbür mahalleye mi uçar acaba?", en: "(holds his hand) I wonder if I hang laundry, will it fly to the next neighborhood?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Ağır mandal kullanırsanız sorun olmaz.\"", en: "\"If you use heavy clothespins it won't be a problem.\"" }, next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Balkona file kapatmak en garantili çözüm.\"", en: "\"Closing the balcony with a net is the most guaranteed solution.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Uçarsa da bir yerde birinin işine yarar herhalde.\"", en: "\"If it flies it will probably be useful to someone somewhere.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Mandal derdi olmasa daha iyi olurdu ama tamam.", en: "It would be better if there was no clothespin worry but okay." } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "File fikri mantıklı, düşünürüm.", en: "The net idea is logical, I will think about it." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülmemeye çalışır) Komik ama pek güven vermedi.", en: "(tries not to laugh) Funny but it didn't inspire much confidence." } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(tam o sırada rüzgar bir gazeteyi masadan uçurur, ikisi de peşinden koşar gibi bakar)", en: "(just then the wind blows a newspaper off the table, they both look as if they are chasing it)" } },
        { speaker: "emlah", text: { tr: "Gördüğünüz gibi hareketli bir ev, hiç sıkılmazsınız.", en: "As you can see, a lively house, you will never get bored." } },
        { speaker: "customer1", text: { tr: "Sıkılmam belli, hareketli evet.", en: "It's clear I won't get bored, lively yes." } },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta rüzgar payı diye bir indirim var mı acaba?", en: "Is there a discount called a wind allowance in the price, I wonder?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %10 indirim ayarlarım.\"", en: "\"I can talk to the owner and arrange a 10% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu manzaraya göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this view, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu manzara bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This view won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, fileyi de kendim hallederim.", en: "With the discount I've decided, I will handle the net myself too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, mandalları sağlam seçin.", en: "Best of luck, choose the clothespins solidly." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Rüzgarsız bir gün de görmek isterim, öyle bir gün var mı acaba.", en: "I'd like to see a windless day too, is there such a day I wonder." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseTerziAtolyesi: HouseScene = {
  id: "terzi-atolyesi",
  title: "Terzi Atölyesi Üstü Daire", titleEn: "Apartment Above Tailor Shop",
  location: "Nişantaşı, çarşı arkası", locationEn: "Nisantasi, behind the bazaar",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-tailor",
  askingPrice: 22880000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.2, funWeight: 1, interestWeight: 1.2 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Alt katta terzi dükkanı var diye yazıyordu, hâlâ çalışıyor mu?", en: "Hello, I'm {isim}. It said there is a tailor shop downstairs, is it still working?" } },
        { speaker: "customer1", text: { tr: "O dikiş makinesi sesini duyar mıyım acaba yukarıda?", en: "I wonder if I will hear that sewing machine sound upstairs?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Duymazsınız, zemin arası güçlü bir izolasyon var.\"", en: "\"You won't hear it, there is strong insulation between the floors.\"" }, next: "enter", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Hafif duyulur ama alışıyorsunuz, hatta ninni gibi geliyor.\"", en: "\"It can be heard slightly but you get used to it, it even sounds like a lullaby.\"" }, next: "enter" },
        { id: "c", text: { tr: "\"Duyarsınız, ama karşılığında ömür boyu ücretsiz paça kısaltma var.\"", en: "\"You will hear it, but in return there is lifelong free pants hemming.\"" }, next: "enter", effects: { fun: 10, interest: 10 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte daire, geniş ve aydınlık.", en: "Here is the apartment, spacious and bright." } },
        { speaker: "customer1", text: { tr: "Kumaş tozu falan yukarı çıkar mı peki, alerjim var da.", en: "Will fabric dust or something come up, I have an allergy." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Çıkmaz, atölyenin kendi havalandırması var.\"", en: "\"It won't, the workshop has its own ventilation.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Bazen hafif çıkabilir, pencereleri kapalı tutmanızı öneririm.\"", en: "\"Sometimes it might come up slightly, I suggest keeping the windows closed.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Çıksa da en azından toz her yerde aynı renk kumaştan olur.\"", en: "\"Even if it does, at least the dust will be from the same color fabric everywhere.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Kendi havalandırması varsa güzel.", en: "If it has its own ventilation that's good." } }], next: "second" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Pencere kapalı tutmak mantıklı bir öneri.", en: "Keeping the window closed is a logical suggestion." } }], next: "second" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Bu espri hoşuma gitti doğrusu.", en: "(smiles) I actually liked this joke." } }], next: "second" },

    second: {
      id: "second",
      lines: [{ speaker: "customer1", text: { tr: "Peki terziyle aramda bir anlaşma falan yapabilir miyim, indirim gibi?", en: "So can I make a deal or something with the tailor, like a discount?" } }],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle, komşuluk indirimi genelde iyi işler burada.\"", en: "\"Absolutely, neighborhood discounts usually work well here.\"" }, next: "second_a", effects: { interest: 15 } },
        { id: "b", text: { tr: "\"Onu kendisiyle konuşmanız gerekir, ben söz veremem.\"", en: "\"You'd have to talk to him about that, I can't promise.\"" }, next: "second_b", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Bir çift pantolon hediyeyle başlarsınız muhtemelen.\"", en: "\"You'll probably start with a free pair of pants as a gift.\"" }, next: "second_c", effects: { fun: 10 } },
      ],
    },
    second_a: { id: "second_a", lines: [{ speaker: "customer1", text: { tr: "Güzel, bu beni ikna etmeye başladı.", en: "Nice, this started to convince me." } }], next: "price" },
    second_b: { id: "second_b", lines: [{ speaker: "customer1", text: { tr: "Mantıklı, kendim konuşurum o zaman.", en: "Logical, I will talk to him myself then." } }], next: "price" },
    second_c: { id: "second_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Hediye pantolon hiç fena değil.", en: "(laughs) Gift pants aren't bad at all." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyat konusunda biraz esneklik var mı?", en: "Is there a bit of flexibility in price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This apartment won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, terziyle de tanışırım artık.", en: "With the discount I've decided, I guess I'll meet the tailor too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, iyi dikişler.", en: "Best of luck, happy sewing." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir de hafta içi bir gün gelip sesi duyayım, sonra karar veririm.", en: "Let me come and hear the sound on a weekday too, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu daire bana göre değil, vaktinizi aldım.", en: "I guess this apartment isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseMetroTitresim: HouseScene = {
  id: "metro-titresim",
  title: "Metro Titreşimli Zemin", titleEn: "Metro Vibrating Floor",
  location: "Kadıköy, metro hattı üstü", locationEn: "Kadikoy, above metro line",
  customerNames: [],
  dynamicCast: [{ gender: "k" }, { gender: "e" }],
  background: "theme-metro",
  askingPrice: 26250000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.4, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da eşim {isim2}. Altımızda metro geçiyormuş, doğru mu?", en: "Hello, I'm {isim}, this is my spouse {isim2}. We heard a metro runs underneath us, is it true?" } },
        { speaker: "customer2", text: { tr: "İlanda \"ulaşıma çok yakın\" yazıyordu, biraz fazla yakınmış gibi.", en: "The ad said \"very close to transportation\", seems like a bit too close." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Doğru, ama titreşim minimal, alışıyorsunuz.\"", en: "\"True, but the vibration is minimal, you get used to it.\"" }, next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Metroya yakınlık büyük avantaj, her yere on dakikada gidersiniz.\"", en: "\"Proximity to the metro is a huge advantage, you can go anywhere in ten minutes.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "c", text: { tr: "\"Bedava masaj koltuğu gibi düşünün, düzenli titreşim iyi gelir.\"", en: "\"Think of it like a free massage chair, regular vibration is good for you.\"" }, next: "enter", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte salon, geniş bir yaşam alanı.", en: "Here is the living room, a spacious living area." } },
        { speaker: "customer2", text: { tr: "(masaya dokunur) Bardaklar filan devrilir mi peki tren geçerken?", en: "(touches the table) Will glasses or anything tip over when the train passes?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Devrilmez, titreşim çok hafif, sadece hissedilir.\"", en: "\"They won't, the vibration is very slight, it's just felt.\"" }, next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Kaymaz altlık koyarsanız hiç sorun olmaz.\"", en: "\"If you put a non-slip coaster it won't be a problem at all.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Devrilirse de her sabah bir sürpriz oluyor, hayat monoton olmuyor.\"", en: "\"Even if they do it's a surprise every morning, life isn't monotonous.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Hafifse sorun değil sanırım.", en: "If it's slight I guess it's not a problem." } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer2", text: { tr: "Kaymaz altlık akıllıca, alırız.", en: "Non-slip coasters are smart, we'll get them." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(gülerek) Sürpriz kahvaltı, hoşuma gitti bu bakış açısı.", en: "(laughing) Surprise breakfast, I liked this perspective." } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(tam o sırada zemin hafifçe titrer, masadaki bardak küçük bir ses çıkarır)", en: "(just then the floor vibrates slightly, the glass on the table makes a small sound)" } },
        { speaker: "customer2", text: { tr: "(irkilir) İşte, tam da bahsettiğimiz şey oldu.", en: "(startled) There, exactly what we were talking about happened." } },
        { speaker: "emlah", text: { tr: "Gördünüz, gerçekten çok hafif, saniyeler içinde geçti.", en: "You saw, it's really very slight, passed in seconds." } },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta titreşim payı diye bir esneklik var mı?", en: "Is there a flexibility in the price called a vibration allowance?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 9% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: { tr: "\"Bu konum bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This location won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: { tr: "\"Fiyat zaten bu ulaşım kolaylığına göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this transportation convenience, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdik, kaymaz altlıkları da alırız.", en: "With the discount we've decided, we'll buy the non-slip coasters too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, iyi yolculuklar... yani iyi oturumlar.", en: "Best of luck, have a good trip... I mean have a good stay." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Bir de yoğun saatte gelip bakalım, sonra karar veririz.", en: "Let's come and check during rush hour too, then we'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseYuzenBogazEvi: HouseScene = {
  id: "yuzen-bogaz-evi",
  title: "Yüzen Boğaz Evi", titleEn: "Floating Bosphorus House",
  location: "Bebek açıkları, demirli ev-tekne", locationEn: "Off the coast of Bebek, anchored house-boat",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-houseboat",
  askingPrice: 46500000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.4, funWeight: 1, interestWeight: 1.1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Su üstünde bir ev diye duyunca inanamadım, gerçekten yüzüyor mu bu?", en: "Hello, I'm {isim}. I couldn't believe it when I heard a house on water, does it really float?" } },
        { speaker: "customer1", text: { tr: "Yani fırtınada falan yerinden oynuyor mu, endişelenmeli miyim?", en: "I mean, does it move in a storm or something, should I be worried?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sağlam demir sistemiyle bağlı, hafif sallanır sadece.\"", en: "\"It's tied with a solid anchor system, it only sways slightly.\"" }, next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Hafif sallanma var, ama çoğu sahibi bunu sevdiğini söylüyor.\"", en: "\"There is a slight swaying, but most owners say they love this.\"" }, next: "enter", effects: { fun: 10 } },
        { id: "c", text: { tr: "\"Beşik gibi düşünün, her gece doğal olarak sallanarak uyursunuz.\"", en: "\"Think of it like a cradle, you sleep naturally swaying every night.\"" }, next: "enter", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte iç mekan, ahşap detaylar hâlâ orijinal.", en: "Here is the interior, the wooden details are still original." } },
        { speaker: "customer1", text: { tr: "(dengesini biraz kaybeder gibi olur) Deniz tutması olanlar için bir çözüm var mı acaba?", en: "(almost loses balance) Is there a solution for those who get seasick, I wonder?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Zamanla vücut alışıyor, ilk hafta biraz zor olabilir sadece.\"", en: "\"The body gets used to it over time, only the first week might be a bit difficult.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Bilezik tarzı çözümler işe yarıyor, birçok komşu kullanıyor.\"", en: "\"Bracelet style solutions work, many neighbors use them.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Deniz tutması demeyelim, deniz aşkı diyelim.\"", en: "\"Let's not call it seasickness, let's call it sea love.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Zor olabilir\" kısmı beni biraz tedirgin etti.", en: "The \"might be difficult\" part made me a bit uneasy." } }], next: "second" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Bilezik fikri makul, denerim.", en: "The bracelet idea is reasonable, I'll try it." } }], next: "second" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Bu yeniden adlandırmayı beğendim.", en: "(smiles) I liked this renaming." } }], next: "second" },

    second: {
      id: "second",
      lines: [{ speaker: "customer1", text: { tr: "Demirleme ve bakım masrafları kime ait oluyor peki, bana mı?", en: "So who pays for the anchoring and maintenance costs, me?" } }],
      choices: [
        { id: "a", text: { tr: "\"Yıllık demirleme ücreti size ait, ama fiyata göre çok düşük.\"", en: "\"The annual anchoring fee belongs to you, but it's very low compared to the price.\"" }, next: "second_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Bunu da fiyat görüşmesine dahil edebiliriz.\"", en: "\"We can include this in the price negotiation too.\"" }, next: "second_b", effects: { interest: 15 } },
        { id: "c", text: { tr: "\"Bir kaptan şapkası hediye, masraf konusunu sonra konuşuruz.\"", en: "\"A captain's hat as a gift, we'll talk about the cost issue later.\"" }, next: "second_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    second_a: { id: "second_a", lines: [{ speaker: "customer1", text: { tr: "Düşükse sorun değil, netlik iyi oldu.", en: "If it's low it's not a problem, the clarity was good." } }], next: "price" },
    second_b: { id: "second_b", lines: [{ speaker: "customer1", text: { tr: "Dahil edilmesi güzel bir jest.", en: "Including it is a nice gesture." } }], next: "price" },
    second_c: { id: "second_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Şapka konuyu değiştirmiyor ama komikti.", en: "(laughs) The hat doesn't change the subject but it was funny." } }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Bu ölçekte bir kararda fiyatta esneklik olur mu?", en: "Would there be flexibility in price for a decision of this scale?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %6 indirim ve ilk yıl demirleme ücretini karşılarım.\"", en: "\"I can talk to the owner and cover a 6% discount and the first year's anchoring fee.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 6 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu benzersiz konum için makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this unique location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Böyle bir ev bu fiyata bir daha çıkmaz, bugün karar vermelisiniz.\"", en: "\"Such a house won't hit the market at this price again, you must decide today.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İlk yıl demirleme ücreti karşılanınca karar verdim, anlaştık.", en: "With the first year's anchoring fee covered I've decided, we have a deal." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, denizler sakin olsun.", en: "Best of luck, may the seas be calm." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bu ölçekte bir kararı acele vermek istemiyorum, biraz düşüneyim.", en: "I don't want to rush a decision of this scale, let me think a bit." } },
        { speaker: "emlah", text: { tr: "Anlıyorum, ne zaman isterseniz tekrar arayabilirsiniz.", en: "I understand, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Bu ölçekte bir kararda baskıya tahammülüm yok, vaktinizi aldım.", en: "I have no tolerance for pressure in a decision of this scale, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseAkilliEvCildirmis: HouseScene = {
  id: "akilli-ev-cildirmis",
  title: "Çıldırmış Akıllı Ev", titleEn: "Crazy Smart House",
  location: "Ataşehir, teknoloji sitesi", locationEn: "Atasehir, technology complex",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-tailor",
  askingPrice: 24750000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.3, funWeight: 1.2, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. \"Tam akıllı ev\" diye yazıyordu ilanda, teknolojiye bayılırım.", en: "Hello, I'm {isim}. The ad said \"Fully smart house\", I love technology." } },
        { speaker: "customer1", text: { tr: "Işıklar, perdeler, her şey sesle mi çalışıyor gerçekten?", en: "Lights, curtains, everything works with voice, really?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle, tek kelimeyle her şeyi yönetiyorsunuz.\"", en: "\"Absolutely, you manage everything with a single word.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Çalışıyor, ama bazen kendi kararlarını da veriyor açıkçası.\"", en: "\"They work, but sometimes it makes its own decisions too, frankly.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Önce içeri geçelim, sistemi kendiniz görün.\"", en: "\"Let's go inside first, see the system for yourself.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte salon, \"Işıkları aç\" demeniz yeterli.", en: "Here is the living room, just saying \"Turn on the lights\" is enough." } },
        { speaker: "customer1", text: { tr: "(söyler söylemez tüm ışıklar yanıp söner, perde kendi kendine açılır) Bu normal mi?", en: "(as soon as he says it all the lights flash, the curtain opens by itself) Is this normal?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Normal, sistem sizi tanımaya çalışıyor, birkaç gün sürer.\"", en: "\"Normal, the system is trying to get to know you, it'll take a few days.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Küçük bir kalibrasyon sorunu, teknisyen bir bakışta çözer.\"", en: "\"A minor calibration issue, a technician can solve it in a glance.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Ev sizi karşılıyor sayılır, hoş geldin diyor bir nevi.\"", en: "\"The house is welcoming you, kind of saying welcome.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Tanımaya çalışıyor\" derken beni mi izliyor yani?", en: "When you say \"trying to get to know me\", is it watching me?" } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Teknisyen çağırmak sorun olmaz umarım.", en: "I hope calling a technician won't be a problem." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Ev beni karşılıyor, hoşuma gitti bu.", en: "(smiles) The house is welcoming me, I liked this." } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(tam o sırada televizyon kendi kendine açılır, ses sonuna kadar açık) Aaa!", en: "(just then the TV turns on by itself, volume all the way up) Ahhh!" } },
        { speaker: "emlah", text: { tr: "(hızla kapatır) Bazen biraz coşkulu davranıyor sistem, kusura bakmayın.", en: "(closes it quickly) Sometimes the system acts a bit enthusiastically, sorry about that." } },
        { speaker: "customer1", text: { tr: "Coşkulu bir ev... ilginç bir özellik sayılır bu da.", en: "An enthusiastic house... this can be considered an interesting feature too." } },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu sistem için bir esneklik var mı?", en: "Is there a flexibility in the price for this system?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu teknolojiye göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this technology, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu sistem bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This system won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, sistemi kendim eğitirim artık.", en: "With the discount I've decided, I guess I'll train the system myself." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, umarım ev sizi de sever.", en: "Best of luck, I hope the house likes you too." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir de sistemi kapalıyken görmek isterim, sonra karar veririm.", en: "I'd also like to see the system when it's off, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const housePazarGunuKaosu: HouseScene = {
  id: "pazar-gunu-kaosu",
  title: "Pazar Günü Kaosu", titleEn: "Sunday Chaos",
  location: "Kadıköy, pazar sokağı", locationEn: "Kadikoy, market street",
  customerNames: [],
  dynamicCast: [{ gender: "k" }, { gender: "e" }],
  background: "theme-busstop",
  askingPrice: 16500000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.2, funWeight: 1.1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da eşim {isim2}. Sokak bugün çok sakinmiş, hep böyle mi?", en: "Hello, I'm {isim}, this is my spouse {isim2}. The street is very quiet today, is it always like this?" } },
        { speaker: "customer2", text: { tr: "Hafta içi böyleyse harika olur açıkçası.", en: "It would be great if it's like this on weekdays frankly." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Hafta içi tamamen böyle sakin, evet.\"", en: "\"It's completely quiet like this on weekdays, yes.\"" }, next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Genelde sakin, sadece pazar günleri farklı.\"", en: "\"Usually quiet, only Sundays are different.\"" }, next: "enter", effects: { interest: 5 } },
        { id: "c", text: { tr: "\"Sokağın bir de canlı bir yüzü var, göreceksiniz.\"", en: "\"The street has a lively face too, you'll see.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte salon, sokağa nazır geniş pencereler.", en: "Here is the living room, wide windows overlooking the street." } },
        { speaker: "customer1", text: { tr: "\"Pazar günleri farklı\" derken ne demek istediniz tam olarak?", en: "What did you mean exactly by \"Sundays are different\"?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sokak pazarı kuruluyor, biraz kalabalık oluyor sadece.\"", en: "\"A street market is set up, it just gets a bit crowded.\"" }, next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Haftada bir gün pazar var, geri kalan altı gün sessiz.\"", en: "\"There is a market one day a week, the remaining six days are quiet.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Pazar günleri sokak bir festivale dönüşüyor resmen.\"", en: "\"On Sundays the street literally turns into a festival.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: { tr: "\"Biraz kalabalık\" ne kadar kalabalık acaba?", en: "\"A bit crowded\" how crowded I wonder?" } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Altı gün sessizse idare ederiz bence.", en: "If it's quiet for six days I think we can manage." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(güler) Festival demek hoşuma gitti doğrusu.", en: "(laughs) Festival, I actually liked that." } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(pencereden dışarı bakar) O tezgahlar şimdiden mi kuruluyor yoksa?", en: "(looks out the window) Are those stalls being set up already?" } },
        { speaker: "emlah", text: { tr: "(pencereye göz atar) Yarın pazar, bir gün erken hazırlık yapıyorlar galiba.", en: "(glances at the window) Tomorrow is Sunday, I guess they are prepping a day early." } },
        { speaker: "customer2", text: { tr: "Erkenciler varmış demek ki.", en: "So there are early birds." } },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta pazar günü payı diye bir esneklik olur mu?", en: "Would there be a flexibility in price called a Sunday allowance?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 9% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: { tr: "\"Bu sokak bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This street won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: { tr: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdik, pazara da alışırız zamanla.", en: "With the discount we've decided, we'll get used to the market over time too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, pazar günleri file almayı unutmayın.", en: "Best of luck, don't forget to take a shopping net on Sundays." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Bir pazar günü gelip gerçekten görelim, sonra karar veririz.", en: "Let's come on a Sunday and really see it, then we'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseYanlisAdresKargo: HouseScene = {
  id: "yanlis-adres-kargo",
  title: "Yanlış Adres Kargo Durağı", titleEn: "Wrong Address Package Stop",
  location: "Bahçelievler, apartman girişi", locationEn: "Bahcelievler, apartment entrance",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-busstop",
  askingPrice: 12380000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.3, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Kapıda bir sürü kargo kutusu vardı, hepsi bu daireye mi ait?", en: "Hello, I'm {isim}. There were a bunch of package boxes at the door, do they all belong to this apartment?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Hayır hayır, o kutular önceki sakinin, temizlenecek.\"", en: "\"No no, those boxes belong to the previous resident, they will be cleared.\"" }, next: "enter" },
        { id: "b", text: { tr: "\"Açıkçası bina biraz kargo durağı gibi kullanılıyor bazen.\"", en: "\"Frankly, the building is sometimes used a bit like a package stop.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Herkes bu binaya güveniyor, kargoları buraya bırakıyor.\"", en: "\"Everyone trusts this building, they leave their packages here.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte daire, giriş kata çok yakın, pratik bir konum.", en: "Here is the apartment, very close to the ground floor, a practical location." } },
        { speaker: "customer1", text: { tr: "(kapı çalar, dışarıda biri \"kargom burada mı\" diye bağırır) Bu sık oluyor mu?", en: "(door knocks, someone outside yells \"is my package here\") Does this happen often?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Nadiren oluyor, yanlış anlaşılma sadece.\"", en: "\"It happens rarely, just a misunderstanding.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Biraz sık oluyor açıkçası, kapıya bir not asabilirsiniz.\"", en: "\"It happens a bit often frankly, you can hang a note on the door.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"En azından hiç yalnız hissetmezsiniz, sürekli ziyaretçi oluyor.\"", en: "\"At least you'll never feel lonely, there are constant visitors.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Yanlış anlaşılma\" derken kaç kişi geldi bugün acaba?", en: "When you say \"misunderstanding\", how many people came today I wonder?" } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Not fikri mantıklı, deneriz.", en: "The note idea is logical, we'll try it." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Sürekli ziyaretçi... bir bakıma sosyalleşme fırsatı.", en: "(laughs) Constant visitors... an opportunity to socialize in a way." } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(kapı yine çalar, bu sefer bir kurye \"iki kargo daha var\" der) Vay canına.", en: "(door knocks again, this time a courier says \"two more packages\") Wow." } },
        { speaker: "emlah", text: { tr: "(gülümser) Görüyorsunuz, bina gerçekten popüler bir adres.", en: "(smiles) You see, the building is really a popular address." } },
        { speaker: "customer1", text: { tr: "Popüler kelimesini böyle kullanmak hiç aklıma gelmezdi.", en: "It would never have occurred to me to use the word popular like this." } },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu \"popülerlik\" payı diye bir indirim var mı?", en: "Is there a discount called a \"popularity\" allowance in the price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %10 indirim ayarlarım.\"", en: "\"I can talk to the owner and arrange a 10% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This apartment won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, bir tabela asarım kapıya.", en: "With the discount I've decided, I'll hang a sign on the door." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, kuryelerle iyi geçinin.", en: "Best of luck, get along well with the couriers." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir gün daha sakin bir saatte gelip bakayım, sonra karar veririm.", en: "Let me come check on a day at a quieter hour, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseFotografNoktasiBahce: HouseScene = {
  id: "fotograf-noktasi-bahce",
  title: "Fotoğraf Noktası Bahçe", titleEn: "Photo Spot Garden",
  location: "Moda, sahil arkası", locationEn: "Moda, behind the coast",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-island",
  askingPrice: 18380000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.3, interestWeight: 1.1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Bahçedeki o beyaz kemer çok şık, kendiniz mi yaptırdınız?", en: "Hello, I'm {isim}. That white arch in the garden is very chic, did you have it made yourself?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Ev sahibi yaptırmış, herkesin dikkatini çekiyor.\"", en: "\"The homeowner had it made, it catches everyone's attention.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"Yaptırmış ama biraz da ünlü oldu açıkçası, göstereyim.\"", en: "\"They did but it got a bit famous frankly, let me show you.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Önce bahçeye bakalım, kendiniz göreceksiniz.\"", en: "\"Let's look at the garden first, you will see for yourself.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte bahçe, o kemer gerçekten fotoğraflık.", en: "Here is the garden, that arch is really picturesque." } },
        { speaker: "customer1", text: { tr: "(bahçe kapısının önünde bir çift telefonla poz veriyordur) Bunlar kim, tanıdığınız mı?", en: "(a couple is posing with a phone in front of the garden gate) Who are these, someone you know?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Tanımıyorum, muhtemelen yoldan geçen biri.\"", en: "\"I don't know them, probably someone passing by.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Açıkçası bu kemer Instagram'da meşhur oldu, sık böyle oluyor.\"", en: "\"Frankly this arch got famous on Instagram, this happens often.\"" }, next: "q1_b", effects: { interest: 5 } },
        { id: "c", text: { tr: "\"Ücretsiz fotoğraf stüdyonuz var sayılır artık.\"", en: "\"You practically have a free photo studio now.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Yoldan geçen biri bahçenin içine mi girdi yani?", en: "So a passerby just entered the garden?" } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Meşhur olmak hoş ama biraz da tuhaf.", en: "Being famous is nice but a bit weird too." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Stüdyo fikri fena değil aslında.", en: "(laughs) The studio idea isn't bad actually." } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(bir başka çift daha gelir, kemerin önünde sıraya girerler) Bu ciddi mi şimdi?", en: "(another couple arrives, they line up in front of the arch) Is this serious right now?" } },
        { speaker: "emlah", text: { tr: "(gülümser) Hafta sonları biraz daha yoğun oluyor açıkçası.", en: "(smiles) It gets a bit busier on weekends, frankly." } },
        { speaker: "customer1", text: { tr: "Hafta sonu sırası bile var yani.", en: "So there's even a weekend queue." } },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu \"ünlülük\" payı diye bir indirim düşünülür mü?", en: "Would a discount be considered in the price for this \"fame\" allowance?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %7 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 7% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 7 } },
        { id: "b", text: { tr: "\"Bu bahçe bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This garden won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: { tr: "\"Fiyat zaten bu bahçeye göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this garden, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, belki bir de tabela koyarım ücretli diye.", en: "With the discount I've decided, maybe I'll put up a sign saying it's a paid spot." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, iyi kareler dilerim.", en: "Best of luck, wishing you good shots." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir hafta sonu daha gelip yoğunluğu görmek isterim, sonra karar veririm.", en: "I'd like to come another weekend to see the crowd, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseParanoyakKameraKomsusu: HouseScene = {
  id: "paranoyak-kamera-komsusu",
  title: "Paranoyak Kamera Komşusu", titleEn: "Paranoid Camera Neighbor",
  location: "Bahçeşehir, site içi", locationEn: "Bahcesehir, inside a complex",
  customerNames: [],
  dynamicCast: [{ gender: "k" }, { gender: "e" }],
  background: "theme-metro",
  askingPrice: 23620000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.4, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da eşim {isim2}. Komşunun duvarında bir sürü kamera var, fark ettiniz mi?", en: "Hello, I'm {isim}, this is my spouse {isim2}. There are a bunch of cameras on the neighbor's wall, did you notice?" } },
        { speaker: "customer2", text: { tr: "Sayabildiğim kadarıyla en az sekiz tane vardı.", en: "As far as I could count there were at least eight." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Fark ettim, güvenlik konusunda hassas biri sadece.\"", en: "\"I noticed, just someone sensitive about security.\"" }, next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Evet, biraz fazla kaçıyor ama size bir zararı yok.\"", en: "\"Yes, going a bit overboard but no harm to you.\"" }, next: "enter" },
        { id: "c", text: { tr: "\"O kameralar sayesinde mahalle çok güvenli sayılır.\"", en: "\"Thanks to those cameras the neighborhood is considered very safe.\"" }, next: "enter", effects: { fun: 5, interest: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte salon, geniş ve ferah.", en: "Here is the living room, spacious and airy." } },
        { speaker: "customer1", text: { tr: "(pencereden bakar) O kameralardan biri tam bizim pencereye bakıyor sanki.", en: "(looks out the window) One of those cameras looks like it's pointing right at our window." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Öyle görünüyor ama muhtemelen kendi bahçesini çekiyordur.\"", en: "\"It looks like it but they are probably filming their own garden.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Haklısınız, isterseniz yönetimle konuşup açı değiştirmesini isteyebiliriz.\"", en: "\"You're right, if you want we can talk to management and ask them to change the angle.\"" }, next: "q1_b", effects: { interest: 10 } },
        { id: "c", text: { tr: "\"En azından evinizi kimse asla soyamaz, bedava güvenlik.\"", en: "\"At least no one can ever rob your house, free security.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: { tr: "\"Muhtemelen\" pek güven verici bir kelime değil açıkçası.", en: "\"Probably\" is not a very reassuring word frankly." } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Yönetimle konuşmak iyi bir ilk adım olur.", en: "Talking to management would be a good first step." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(gülümser) Bedava güvenlik fikri hoşuma gitti.", en: "(smiles) I liked the free security idea." } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(tam o sırada komşunun panjuru hafifçe aralanır, biri dikkatle bakar sonra hızla kapatır)", en: "(just then the neighbor's shutter opens slightly, someone looks carefully then closes it quickly)" } },
        { speaker: "customer2", text: { tr: "(irkilir) O da neydi öyle?", en: "(startled) What was that?" } },
        { speaker: "emlah", text: { tr: "(gülümser) Meraklı bir komşu sadece, alışırsınız zamanla.", en: "(smiles) Just a curious neighbor, you'll get used to it over time." } },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu durumu göz önünde bulundurur musunuz?", en: "Would you take this situation into consideration for the price?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Bu site bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This complex won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: { tr: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdik, perde kalın olsun yeter.", en: "With the discount we've decided, as long as the curtains are thick enough." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, komşunuzla iyi geçinin.", en: "Best of luck, get along well with your neighbor." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Bir de akşam gelip komşuyu gözlemleyelim, sonra karar veririz.", en: "Let's come in the evening and observe the neighbor too, then we'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseAntikaciElektrikTesisati: HouseScene = {
  id: "antikaci-elektrik-tesisati",
  title: "Antikacı Elektrik Tesisatı", titleEn: "Antique Dealer Electrical Wiring",
  location: "Çukurcuma, antikacılar sokağı", locationEn: "Cukurcuma, antique dealers street",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-tailor",
  askingPrice: 14620000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.3, funWeight: 1.1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Alt kattaki antikacı dükkanı çok şirin, komşuluk nasıl acaba?", en: "Hello, I'm {isim}. The antique shop downstairs is very cute, how is the neighborhood I wonder?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Çok iyi, kendisi de bina için epey emek veriyor.\"", en: "\"Very good, he also puts a lot of effort into the building.\"" }, next: "enter", effects: { interest: 10 } },
        { id: "b", text: { tr: "\"İyi ama küçük bir elektrik tesisatı detayı var, göstereyim.\"", en: "\"Good but there is a small electrical wiring detail, let me show you.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Önce içeri geçelim, sonra her şeyi anlatırım.\"", en: "\"Let's go inside first, then I'll explain everything.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte daire, eski bina dokusu hâlâ korunmuş.", en: "Here is the apartment, the old building texture is still preserved." } },
        { speaker: "customer1", text: { tr: "(ışık düğmesine basar, ışık titrer) Elektrik tesisatı bu bina için biraz eski mi kalmış?", en: "(presses the light switch, the light flickers) Is the electrical wiring a bit old for this building?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Biraz eski, ama antikacı beyle paylaştığınız için sorun çıkmıyor.\"", en: "\"A bit old, but since you share it with the antique dealer it doesn't cause problems.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Eski evet, yenilenmesi gerekiyor ama fiyata da yansıdı bu.\"", en: "\"Old yes, needs to be renewed but this was reflected in the price too.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Eski tesisatın kendine has bir karakteri var, alışırsınız.\"", en: "\"Old wiring has its own unique character, you'll get used to it.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Paylaştığınız\" derken, aynı sigortayı mı kullanıyoruz yani?", en: "When you say \"share\", do you mean we use the same fuse?" } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Fiyata yansımışsa mantıklı bir denge.", en: "If it's reflected in the price it's a logical balance." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) \"Karakter\" demek hoşuma gitti.", en: "(smiles) I liked saying \"character\"." } }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(tam o sırada tüm ışıklar aniden söner, alt kattan antikacının sesi gelir: \"Kusura bakmayın, ütüyü taktım!\")", en: "(just then all lights suddenly go out, the antique dealer's voice comes from downstairs: \"Sorry, I plugged in the iron!\")" } },
        { speaker: "emlah", text: { tr: "(gülümser, karanlıkta el yordamıyla) Gördüğünüz gibi, birkaç saniyede geri geliyor.", en: "(smiles, fumbling in the dark) As you can see, it comes back in a few seconds." } },
        { speaker: "customer1", text: { tr: "(ışıklar geri gelir) Vay canına, gerçekten de geldi.", en: "(lights come back) Wow, it really did come back." } },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu tesisat durumu için bir esneklik var mı?", en: "Is there a flexibility in price for this wiring situation?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %11 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide an 11% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 11 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu dokuya göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this texture, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This apartment won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, antikacı beyle ütü saatlerini konuşurum.", en: "With the discount I've decided, I'll talk to the antique dealer about iron hours." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, mum bulundurmanızı öneririm yine de.", en: "Best of luck, I suggest keeping candles around though." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir de akşam ütü saatinde gelip görmek isterim, sonra karar veririm.", en: "I'd like to come and see during the evening iron hour too, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu daire bana göre değil, vaktinizi aldım.", en: "I guess this apartment isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseKarincaKolonisi: HouseScene = {
  id: "karinca-kolonisi",
  title: "Karınca Kolonili Bahçe", titleEn: "Garden with Ant Colony",
  location: "Ümraniye, bahçe katı", locationEn: "Umraniye, garden floor",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-island",
  askingPrice: 12000000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.2, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Bahçe katı diye yazıyordu, bahçeyi görünce şaşırdım biraz.", en: "Hello, I'm {isim}. It said garden floor, I was a bit surprised when I saw the garden." } },
        { speaker: "customer1", text: { tr: "Taşların arasında minik yollar var, bunlar ne?", en: "There are tiny paths between the stones, what are these?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"O yollar karınca kolonisine ait, epey düzenliler.\"", en: "\"Those paths belong to an ant colony, they are quite organized.\"" }, next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Doğal bir peyzaj detayı diyelim, göz alıcı değil mi?\"", en: "\"Let's call it a natural landscaping detail, isn't it eye-catching?\"" }, next: "enter", effects: { fun: 5 } },
        { id: "c", text: { tr: "\"Önce içeri geçelim, bahçeyi sonra konuşuruz.\"", en: "\"Let's go inside first, we'll talk about the garden later.\"" }, next: "enter" },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte salon, bahçeye açılan geniş kapı.", en: "Here is the living room, a wide door opening to the garden." } },
        { speaker: "customer1", text: { tr: "(dışarı bakar) O karıncalar içeri de giriyor mu yoksa sadece bahçede mi kalıyorlar?", en: "(looks outside) Do those ants come inside too or do they just stay in the garden?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sadece bahçede kalıyorlar, hiç içeri girmezler.\"", en: "\"They only stay in the garden, they never come inside.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Bazen mutfağa kadar geliyorlar açıkçası, ama zararsızlar.\"", en: "\"Sometimes they come up to the kitchen frankly, but they are harmless.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Ev sahibi de sayılırlar bir bakıma, düzenli çalışkan komşular.\"", en: "\"They are kind of the landlords too in a way, organized hardworking neighbors.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Hiç girmezler\" cümlesine tam güvenemedim açıkçası.", en: "I couldn't fully trust the sentence \"they never come inside\" frankly." } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Zararsız olmaları biraz rahatlattı beni.", en: "Them being harmless relieved me a bit." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Çalışkan komşular... bu bakış açısını sevdim.", en: "(laughs) Hardworking neighbors... I liked this perspective." } }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(yere bakar, küçük bir karınca kervanı ayakkabısının yanından geçer) Vay canına, gerçekten düzenliler.", en: "(looks down, a small ant caravan passes by his shoe) Wow, they really are organized." } },
        { speaker: "emlah", text: { tr: "Görüyorsunuz, kendi hallerinde, kimseye karışmıyorlar.", en: "You see, they mind their own business, they don't bother anyone." } },
        { speaker: "customer1", text: { tr: "Doğrusu bu kadar disiplinli bir koloniye saygı duydum.", en: "Honestly I respected such a disciplined colony." } },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu bahçe detayı için bir esneklik var mı?", en: "Is there a flexibility in the price for this garden detail?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide a 9% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu bahçeye göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this garden, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu bahçe bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This garden won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, karıncalarla aramız iyi olur umarım.", en: "With the discount I've decided, I hope the ants and I will be on good terms." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, onlara da selam söyleyin.", en: "Best of luck, say hi to them too." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir de yağmurdan sonra gelip bahçeyi görmek isterim, sonra karar veririm.", en: "I'd like to come and see the garden after the rain too, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu bahçe bana göre değil, vaktinizi aldım.", en: "I guess this garden isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseHaliSahaKomsulugu: HouseScene = {
  id: "hali-saha-komsulugu",
  title: "Halı Saha Komşuluğu", titleEn: "Astroturf Neighborhood",
  location: "Bahçelievler, spor tesisi arkası", locationEn: "Bahcelievler, behind the sports facility",
  customerNames: [],
  dynamicCast: [{ gender: "k" }, { gender: "e" }],
  background: "theme-wind",
  askingPrice: 13880000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.2, funWeight: 1.1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da eşim {isim2}. Arka tarafta bir spor sahası var galiba.", en: "Hello, I'm {isim}, this is my spouse {isim2}. I guess there is a sports field in the back." } },
        { speaker: "customer2", text: { tr: "Akşamları maç falan oluyor mu orada?", en: "Are there matches or anything there in the evenings?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Oluyor, ama sadece hafta sonları, çok az.\"", en: "\"There are, but only on weekends, very few.\"" }, next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Her akşam maç var açıkçası, çok işlek bir saha.\"", en: "\"There is a match every evening frankly, a very busy field.\"" }, next: "enter" },
        { id: "c", text: { tr: "\"Balkondan izlemek bile bir avantaj sayılır, bedava maç keyfi.\"", en: "\"Even watching from the balcony is considered an advantage, free match enjoyment.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte balkon, sahaya nazır bir manzara.", en: "Here is the balcony, a view overlooking the field." } },
        { speaker: "customer1", text: { tr: "(topun sesini duyar) Top buraya kadar geliyor mu bazen?", en: "(hears the sound of the ball) Does the ball come all the way here sometimes?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Nadiren geliyor, file yeterince yüksek çünkü.\"", en: "\"It rarely comes, because the net is high enough.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Bazen geliyor açıkçası, balkon camına file taktırabiliriz.\"", en: "\"Sometimes it comes frankly, we can have a net installed on the balcony glass.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Gelirse de bedava hediye sayılır, toplayıp geri verirsiniz.\"", en: "\"Even if it comes it's considered a free gift, you collect it and give it back.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: { tr: "\"Nadiren\" kelimesi biraz belirsiz kaldı ama devam edelim.", en: "The word \"rarely\" remained a bit vague but let's continue." } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "File fikri mantıklı, düşünürüz.", en: "The net idea is logical, we'll think about it." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(güler) Bedava hediye demek hoşuma gitti.", en: "(laughs) I liked the free gift part." } }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(tam o sırada bir top balkona doğru uçar, korkuluğa çarpar) Aaa!", en: "(just then a ball flies towards the balcony, hits the railing) Ahh!" } },
        { speaker: "emlah", text: { tr: "(gülümser) İşte tam bahsettiğimiz şey, ama zararsız geçti.", en: "(smiles) There, exactly what we were talking about, but it passed harmlessly." } },
        { speaker: "customer2", text: { tr: "Zararsız oldu ama kalbim ağzıma geldi resmen.", en: "It was harmless but my heart literally jumped into my throat." } },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu saha komşuluğu için bir esneklik olur mu?", en: "Would there be a flexibility in price for this field neighborhood?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %10 indirim ayarlarım.\"", en: "\"I can talk to the owner and arrange a 10% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: { tr: "\"Bu konum bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This location won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: { tr: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdik, fileyi de kendimiz taktırırız.", en: "With the discount we've decided, we'll have the net installed ourselves too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, maç akşamları keyifli seyirler.", en: "Best of luck, enjoy the view on match evenings." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Bir akşam maç saatinde gelip görelim, sonra karar veririz.", en: "Let's come and see on an evening at match time, then we'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseYosunluOrtakHavuz: HouseScene = {
  id: "yosunlu-ortak-havuz",
  title: "Yosunlu Ortak Havuz", titleEn: "Mossy Shared Pool",
  location: "Beylikdüzü, site içi", locationEn: "Beylikduzu, inside a complex",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-metro",
  askingPrice: 22120000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.3, funWeight: 1, interestWeight: 1.1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. İlanda \"havuzlu site\" yazıyordu, havuzu görebilir miyiz?", en: "Hello, I'm {isim}. The ad said \"complex with a pool\", can we see the pool?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Tabii, hemen aşağıda, size göstereyim.\"", en: "\"Sure, right downstairs, let me show you.\"" }, next: "enter" },
        { id: "b", text: { tr: "\"Gösterebilirim ama şu an biraz bakım aşamasında, uyarayım.\"", en: "\"I can show it but it's a bit under maintenance right now, let me warn you.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Havuz gerçekten sitenin gözdesi, göreceksiniz.\"", en: "\"The pool is really the favorite of the complex, you'll see.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte havuz, geniş bir alanda.", en: "Here is the pool, in a wide area." } },
        { speaker: "customer1", text: { tr: "(suya bakar) Su rengi biraz yeşilimsi değil mi, yoksa öyle mi olması gerekiyor?", en: "(looks at the water) Isn't the water color a bit greenish, or is it supposed to be like that?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Bugün öyle, yarın tamamen berraklaşır, sürekli değil bu.\"", en: "\"It's like that today, it'll clear up completely tomorrow, this isn't constant.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Açıkçası bakım biraz aksıyor son zamanlarda.\"", en: "\"Frankly maintenance has been lagging a bit recently.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Doğal bir yeşillik diyelim, göl kenarı hissi veriyor.\"", en: "\"Let's call it a natural greenness, it gives a lakeside feeling.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "\"Bugün öyle\" cümlesini daha önce de duymuştum sanki.", en: "I feel like I've heard the sentence \"It's like that today\" before." } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Aksıyor olması can sıkıcı ama en azından net konuştunuz.", en: "It lagging is annoying but at least you spoke clearly." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(güler) Göl kenarı hissi... yaratıcı bir açıklama oldu.", en: "(laughs) Lakeside feeling... that was a creative explanation." } }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(havuzun kenarında \"BAKIM ÇALIŞMASI - 3. HAFTA\" yazan bir tabela fark eder) Bu tabela ne kadardır burada?", en: "(notices a sign by the pool saying \"MAINTENANCE WORK - 3RD WEEK\") How long has this sign been here?" } },
        { speaker: "emlah", text: { tr: "(hızla) O tabela eski, yönetim güncellemeyi unutmuş olmalı.", en: "(quickly) That sign is old, management must have forgotten to update it." } },
        { speaker: "customer1", text: { tr: "Umarım öyledir, üç hafta uzun bir süre.", en: "I hope so, three weeks is a long time." } },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu havuz durumu için bir esneklik var mı?", en: "Is there a flexibility in the price for this pool situation?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu siteye göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this complex, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This apartment won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, havuz berraklaşınca ilk ben yüzerim.", en: "With the discount I've decided, I'll be the first to swim when the pool clears up." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, mayonuzu hazır tutun.", en: "Best of luck, keep your swimsuit ready." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Havuz berraklaşınca bir daha gelip bakayım, sonra karar veririm.", en: "Let me come and see again when the pool clears up, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu daire bana göre değil, vaktinizi aldım.", en: "I guess this apartment isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseRehberliTurDuragi: HouseScene = {
  id: "rehberli-tur-duragi",
  title: "Rehberli Tur Durağı", titleEn: "Guided Tour Stop",
  location: "Balat, renkli sokak", locationEn: "Balat, colorful street",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-busstop",
  askingPrice: 15380000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.3, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Sokak çok renkli ve şirin, tam aradığım gibi.", en: "Hello, I'm {isim}. The street is very colorful and cute, exactly what I'm looking for." } },
        { speaker: "customer1", text: { tr: "Dışarıda bir grup insan fotoğraf çekiyordu, sürekli böyle mi burası?", en: "A group of people were taking photos outside, is this place always like this?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Hayır, bugün tesadüfen öyle oldu sadece.\"", en: "\"No, it just happened by chance today.\"" }, next: "enter" },
        { id: "b", text: { tr: "\"Açıkçası burası bir tur güzergahında, göstereyim.\"", en: "\"Frankly this place is on a tour route, let me show you.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Sokağınız ünlü sayılır, bu da bir artı değil mi?\"", en: "\"Your street is considered famous, isn't that a plus too?\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte salon, sokağa nazır güzel bir pencere.", en: "Here is the living room, a beautiful window overlooking the street." } },
        { speaker: "customer1", text: { tr: "(dışarıdan bir rehberin sesi gelir: \"...ve bu evde 100 yıl önce bir hazine bulunmuştu!\") Bu doğru mu?", en: "(a guide's voice comes from outside: \"...and a treasure was found in this house 100 years ago!\") Is this true?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Kesinlikle doğru, tapu kayıtlarında da var bu bilgi.\"", en: "\"Absolutely true, this information is in the title deed records too.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Açıkçası rehberler biraz abartıyor, gerçek değil bu hikaye.\"", en: "\"Frankly guides exaggerate a bit, this story isn't real.\"" }, next: "q1_b", effects: { suspicion: 0, fun: 5 } },
        { id: "c", text: { tr: "\"Belki de gerçektir, kim bilir neler saklı duvarların ardında.\"", en: "\"Maybe it is real, who knows what's hidden behind the walls.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Tapuda hazine kaydı olması biraz garip geldi açıkçası.", en: "Having a treasure record in the title deed sounded a bit weird frankly." } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Abartı olması beni rahatlattı biraz.", en: "It being an exaggeration relieved me a bit." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) Gizem her zaman hoştur, itiraf edeyim.", en: "(smiles) Mystery is always nice, I admit." } }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(pencereden dışarı bakar, bütün grup evi işaret ederek fotoğraf çekiyordur) Bu her gün mü oluyor?", en: "(looks out the window, the whole group is pointing at the house and taking photos) Does this happen every day?" } },
        { speaker: "emlah", text: { tr: "(gülümser) Günde birkaç tur geçiyor, alışırsınız zamanla.", en: "(smiles) A few tours pass by a day, you'll get used to it over time." } },
        { speaker: "customer1", text: { tr: "Ünlü olmak sanırım böyle bir şey.", en: "I guess being famous is something like this." } },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu \"turistik\" konum için bir esneklik var mı?", en: "Is there a flexibility in the price for this \"touristy\" location?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Bu sokak bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This street won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: { tr: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, belki ben de hazine hikayesini anlatırım artık.", en: "With the discount I've decided, maybe I'll tell the treasure story myself now." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, iyi pozlar dilerim.", en: "Best of luck, I wish you good poses." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir tur saatinde daha gelip bakayım, sonra karar veririm.", en: "Let me come and look during another tour time, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu ev bana göre değil, vaktinizi aldım.", en: "I guess this house isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseBalikHaliSabahGurultusu: HouseScene = {
  id: "balik-hali-sabah-gurultusu",
  title: "Balık Hali Sabah Gürültüsü", titleEn: "Fish Market Morning Noise",
  location: "Kumkapı, liman arkası", locationEn: "Kumkapi, behind the port",
  customerNames: [],
  dynamicCast: [{ gender: "k" }, { gender: "e" }],
  background: "theme-sea",
  askingPrice: 13120000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.2, funWeight: 1, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}, bu da eşim {isim2}. Denize yakınlık çok hoşumuza gitti.", en: "Hello, I'm {isim}, this is my spouse {isim2}. We really liked the proximity to the sea." } },
        { speaker: "customer2", text: { tr: "Balık kokusu da hafif geliyor buraya kadar galiba.", en: "I guess the fish smell slightly reaches here too." } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Hafif geliyor evet, ama rüzgarla çabuk dağılıyor.\"", en: "\"It does slightly yes, but it disperses quickly with the wind.\"" }, next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: { tr: "\"Açıkçası hemen yanımızda balık hali var, ondan geliyor.\"", en: "\"Frankly the fish market is right next to us, it comes from there.\"" }, next: "enter" },
        { id: "c", text: { tr: "\"Deniz ürünü tazeliği her sabah kapınıza kadar geliyor sayılır.\"", en: "\"Seafood freshness practically comes to your door every morning.\"" }, next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte salon, sabahları çok aydınlık oluyor.", en: "Here is the living room, it gets very bright in the mornings." } },
        { speaker: "customer1", text: { tr: "(saatine bakar) Balık hali sabah kaçta açılıyor peki, çok erken mi?", en: "(looks at his watch) So what time does the fish market open in the morning, is it very early?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Sabah beşte açılıyor ama sesi pek gelmiyor buraya.\"", en: "\"It opens at five in the morning but its sound doesn't reach here much.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Sabah beşte açılıyor, açıkçası ilk saatler biraz gürültülü.\"", en: "\"It opens at five in the morning, frankly the first hours are a bit noisy.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Doğal alarm saati diyelim, kahve fincanınızı hazırlarsınız.\"", en: "\"Let's call it a natural alarm clock, you can prepare your coffee cup.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: { tr: "\"Pek gelmiyor\" cümlesi tam güven vermedi açıkçası.", en: "The sentence \"doesn't reach much\" didn't fully inspire confidence frankly." } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Erken kalkmaya alışkınız zaten, idare ederiz.", en: "We are used to waking up early anyway, we'll manage." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: { tr: "(güler) Doğal alarm saati... bu tanımı sevdim.", en: "(laughs) Natural alarm clock... I liked this definition." } }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(uzaktan bir satıcının bağırışı duyulur: \"Taze palamut, taze!\") Vay canına, gerçekten duyuluyormuş.", en: "(a vendor's shout is heard from afar: \"Fresh bonito, fresh!\") Wow, it really is heard." } },
        { speaker: "emlah", text: { tr: "(gülümser) Sabahları biraz canlı oluyor evet, ama akşamları sessiz.", en: "(smiles) It gets a bit lively in the mornings yes, but quiet in the evenings." } },
        { speaker: "customer2", text: { tr: "Akşam sessizse dengeli bir anlaşma sayılır bu.", en: "If the evening is quiet this is considered a balanced deal." } },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu sabah gürültüsü için bir esneklik olur mu?", en: "Would there be a flexibility in price for this morning noise?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %9 indirim ayarlarım.\"", en: "\"I can talk to the owner and arrange a 9% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: { tr: "\"Bu konum bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This location won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: { tr: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdik, kulak tıkacı alırız gerekirse.", en: "With the discount we've decided, we'll buy earplugs if necessary." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, taze balığı kaçırmayın.", en: "Best of luck, don't miss the fresh fish." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: { tr: "Bir sabah erken gelip gürültüyü duyalım, sonra karar veririz.", en: "Let's come early one morning and hear the noise, then we'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Bizi aceleye getirmeye çalıştığınızı fark ettik.", en: "We noticed you were trying to rush us." } },
        { speaker: "customer2", text: { tr: "Sanırım bu ev bize göre değil, vaktinizi aldık.", en: "I guess this house isn't for us, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const houseRuyaYorumcusuKomsu: HouseScene = {
  id: "ruya-yorumcusu-komsu",
  title: "Rüya Yorumcusu Komşu", titleEn: "Dream Interpreter Neighbor",
  location: "Üsküdar, sakin sokak", locationEn: "Uskudar, quiet street",
  customerNames: [],
  dynamicCast: [{}],
  background: "theme-echo",
  askingPrice: 22880000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.3, interestWeight: 1 },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", text: { tr: "Merhaba, ben {isim}. Merdivende bir kalabalık gördüm, aşağı kattaki komşu mu meşhur?", en: "Hello, I'm {isim}. I saw a crowd on the stairs, is the downstairs neighbor famous?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Evet, mahallede tanınan bir rüya yorumcusu kendisi.\"", en: "\"Yes, a well-known dream interpreter in the neighborhood.\"" }, next: "enter", effects: { fun: 5 } },
        { id: "b", text: { tr: "\"Öyle, ama bunun küçük bir sonucu da var, göstereyim.\"", en: "\"Indeed, but this has a small consequence too, let me show you.\"" }, next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: { tr: "\"Önce içeri geçelim, detayları sonra anlatırım.\"", en: "\"Let's go inside first, I'll explain the details later.\"" }, next: "enter" },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: { tr: "İşte daire, merdivenden biraz uzak, sakin bir konumda.", en: "Here is the apartment, a bit away from the stairs, in a quiet location." } },
        { speaker: "customer1", text: { tr: "(merdivenden bir tütsü kokusu gelir) O koku aşağıdan mı geliyor?", en: "(an incense smell comes from the stairs) Is that smell coming from downstairs?" } },
      ],
      choices: [
        { id: "a", text: { tr: "\"Evet, komşu seansları sırasında tütsü yakıyor genelde.\"", en: "\"Yes, the neighbor usually burns incense during their sessions.\"" }, next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: { tr: "\"Doğru, ama sadece belirli günlerde oluyor, sürekli değil.\"", en: "\"True, but it only happens on certain days, not constantly.\"" }, next: "q1_b" },
        { id: "c", text: { tr: "\"Binanın kendine has bir atmosferi var diyelim, ilgi çekici.\"", en: "\"Let's say the building has its own unique atmosphere, interesting.\"" }, next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: { tr: "Seans sırasında merdivende kalabalık da oluyor mu peki?", en: "So is there a crowd on the stairs during the session too?" } }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: { tr: "Belirli günlerse idare ederiz sanırım.", en: "If it's certain days I guess we can manage." } }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: { tr: "(gülümser) İlgi çekici kelimesini duymak hoşuma gitti.", en: "(smiles) I liked hearing the word interesting." } }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: { tr: "(merdivenden bir ses yükselir: \"Sıradaki lütfen!\") Vay canına, gerçekten sıra varmış.", en: "(a voice rises from the stairs: \"Next please!\") Wow, there really is a line." } },
        { speaker: "emlah", text: { tr: "(gülümser) Kendisi epey talep görüyor, ünü mahalle dışına da yayılmış.", en: "(smiles) They are quite in demand, their fame has spread outside the neighborhood too." } },
        { speaker: "customer1", text: { tr: "Belki bir gün ben de bir rüyamı yorumlatırım.", en: "Maybe one day I'll have a dream interpreted too." } },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: { tr: "Fiyatta bu komşuluk durumu için bir esneklik var mı?", en: "Is there a flexibility in the price for this neighborhood situation?" } }],
      choices: [
        { id: "a", text: { tr: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", en: "\"I can talk to the owner and provide an 8% discount.\"" }, next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: { tr: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", en: "\"The price is already reasonable for this location, you can think about it.\"" }, next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: { tr: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", en: "\"This apartment won't hit the market at this price again, you must decide immediately.\"" }, next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: { tr: "İndirimle birlikte karar verdim, belki bir seans da ben alırım.", en: "With the discount I've decided, maybe I'll get a session too." } },
        { speaker: "emlah", text: { tr: "Hayırlı olsun, güzel rüyalar dilerim.", en: "Best of luck, wishing you sweet dreams." } },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: { tr: "Bir seans gününde daha gelip atmosferi görmek isterim, sonra karar veririm.", en: "I'd like to come and see the atmosphere on another session day, then I'll decide." } },
        { speaker: "emlah", text: { tr: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz.", en: "Sure, you can call again whenever you want." } },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: { tr: "Beni aceleye getirmeye çalıştığınızı fark ettim.", en: "I noticed you were trying to rush me." } },
        { speaker: "customer1", text: { tr: "Sanırım bu daire bana göre değil, vaktinizi aldım.", en: "I guess this apartment isn't for me, sorry for taking your time." } },
      ],
      end: "lost",
    },
  },
};

export const allHouses: HouseScene[] = [
  houseKokuluStudyo,
  houseHayaletliDaire,
  houseDenizeSifir,
  houseKamburBalkon,
  houseKediCenneti,
  houseAsansorsuzZirve,
  houseNemGalerisi,
  houseDavulcuKomsu,
  houseTapuSorunlu,
  houseMinicik,
  houseAidatSuprizi,
  houseEskiFirin,
  houseManzaraOmurluk,
  houseGeceKlubu,
  houseGuvercin,
  houseKaptanRutubet,
  houseMirasKavgasi,
  houseOgrenciEvi,
  houseKapiciHayvan,
  houseZeminVitrin,
  houseDisliSaatKulesi,
  houseBatakliKoyEvi,
  houseBulutKulesi,
  houseKristalMagara,
  houseKirisSaplanmisKonak,
  houseSifirUcStudyo,
  houseEskiTrenIstasyonu,
  houseKutuphaneYatakOdasi,
  houseGarajLoft,
  houseCamKutuTuvalet,
  houseTekDaireselOda,
  houseMerdivenEvi,
  houseDikeyDepolama,
  houseBogazinIncisi,
  houseOzelAda,
  houseGokyuzuMalikanesi,
  houseOtobusDuragi,
  houseYankiDairesi,
  houseRuzgarTuneli,
  houseTerziAtolyesi,
  houseMetroTitresim,
  houseYuzenBogazEvi,
  houseAkilliEvCildirmis,
  housePazarGunuKaosu,
  houseYanlisAdresKargo,
  houseFotografNoktasiBahce,
  houseParanoyakKameraKomsusu,
  houseAntikaciElektrikTesisati,
  houseKarincaKolonisi,
  houseHaliSahaKomsulugu,
  houseYosunluOrtakHavuz,
  houseRehberliTurDuragi,
  houseBalikHaliSabahGurultusu,
  houseRuyaYorumcusuKomsu,
];
