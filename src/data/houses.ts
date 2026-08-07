import type { HouseScene } from "../types";

export const houseKokuluStudyo: HouseScene = {
  id: "kokulu-studyo",
  title: "Kokulu Stüdyo",
  location: "Nişantaşı, 3. kat",
  customerNames: ["Ceylin"],
  background: "placeholder-house-1",
  askingPrice: 3200000,
  startNode: "start",
  nodes: {
    // 1) Karşılama — küçük bir seçim
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Merhaba, ben Ceylin. Eşim biraz gecikecek, trafikte kalmış." },
        { speaker: "customer1", name: "Ceylin", text: "İlk evimiz olacak bu, çok heyecanlıyım açıkçası. Nereden başlayalım?" },
      ],
      choices: [
        { id: "a", text: "\"Hemen genel bir tur atalım, merak ettiğiniz yerde durabiliriz.\"", next: "enter", effects: { interest: 5 } },
        { id: "b", text: "\"Eşinizi bekleyelim isterseniz, birlikte gezmeniz daha iyi olur.\"", next: "enter", effects: { fun: 5 } },
        { id: "c", text: "\"Bu evi neden beğendiniz, önce onu anlatın.\"", next: "enter", effects: { interest: 10 } },
      ],
    },

    // 2) Koku sorunu — ana seçim
    enter: {
      id: "enter",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "(kapı açılır, burnunu çeker) Bu koku... nedir?" },
        { speaker: "customer1", name: "Ceylin", text: "Girer girmez fark ettim, hiç hoş değil." },
      ],
      choices: [
        { id: "a", text: "\"O... karakter kokusu. Bina eski, kendine özgü bir hikayesi var.\"", next: "q1_a", effects: { suspicion: 15, interest: 10 } },
        { id: "b", text: "\"Alt katta lostra var, biraz kokuyor ama zamanla alışıyorsunuz.\"", next: "q1_b", effects: { suspicion: 0 } },
        { id: "c", text: "\"Kokuyu mu, yoksa şu ışığın odaya vuruş şeklini mi konuşsak?\"", next: "q1_c", effects: { suspicion: 5 } },
      ],
    },
    q1_a: {
      id: "q1_a",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Karakterli... ilginç bir tabir doğrusu." },
        { speaker: "customer1", name: "Ceylin", text: "Eşim gelince o da fark edecek, ona da mı aynısını söyleyeceksiniz?" },
      ],
      next: "kitchen",
    },
    q1_b: {
      id: "q1_b",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Hı, en azından gizlemediniz, bunu takdir ediyorum." },
        { speaker: "customer1", name: "Ceylin", text: "Yine de her gün bu kokuyu solumak biraz zor olur sanki." },
      ],
      next: "kitchen",
    },
    q1_c: {
      id: "q1_c",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "(pencereye bakar) Işık güzelmiş, itiraf edeyim." },
        { speaker: "customer1", name: "Ceylin", text: "Ama konuyu değiştirdiğinizi de fark ettim." },
      ],
      next: "kitchen",
    },

    // 3) Mutfak sorusu — ikinci seçim
    kitchen: {
      id: "kitchen",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Mutfak da bayağı küçük duruyor. Burada gerçekten yemek yapılabilir mi?" },
      ],
      choices: [
        { id: "a", text: "\"Küçük ama fonksiyonel, İstanbul'da stüdyo dairelerde standart bu boyut.\"", next: "kitchen_a", effects: { suspicion: 0 } },
        { id: "b", text: "\"Açıkçası dışarıdan yemek sipariş etmeyi teşvik ediyor, pratik düşünürsek.\"", next: "kitchen_b", effects: { fun: 10, suspicion: 5 } },
        { id: "c", text: "\"Ocağı hiç kullanmayan biri için resmen ideal.\"", next: "kitchen_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    kitchen_a: {
      id: "kitchen_a",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Mantıklı, belki de beklentim yanlıştı." },
        { speaker: "emlah", text: "Çoğu müşteri ilk başta öyle düşünüyor, sonra alışıyor." },
      ],
      next: "health",
    },
    kitchen_b: {
      id: "kitchen_b",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "(gülümser) Yani siz de burada yemek yapmazdınız diyorsunuz." },
        { speaker: "emlah", text: "Ben hiçbir yerde yemek yapmam ama bu ayrı bir konu." },
      ],
      next: "health",
    },
    kitchen_c: {
      id: "kitchen_c",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "(kahkaha atar) En azından dürüst bir satış taktiği." },
        { speaker: "emlah", text: "Bazen gerçeği komikleştirmek satmaktan daha kolay." },
      ],
      next: "health",
    },

    // 4) Sağlık sorusu — üçüncü seçim
    health: {
      id: "health",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Peki bu koku sağlığa zararlı değil mi, uzun vadede?" },
        { speaker: "customer1", name: "Ceylin", text: "Burada yaşayacaksak her gün bunu soluyacağız çünkü." },
      ],
      choices: [
        { id: "a", text: "\"Kesinlikle değil, hatta bazı doktorlar deterjan kokusunun rahatlatıcı olduğunu söylüyor.\"", next: "health_a", effects: { suspicion: 25 } },
        { id: "b", text: "\"Açıkçası emin değilim ama pencereyi açık tutabilirsiniz.\"", next: "health_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Sağlığa zararlı olsa satışta olmazdı herhalde.\"", next: "health_c", effects: { suspicion: 0, fun: 15 } },
      ],
    },
    health_a: {
      id: "health_a",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "(şüpheyle bakar) Doktorlar mı demiştiniz, hangi doktorlar?" },
        { speaker: "thought", text: "O not defterini hiç sevmedim." },
      ],
      next: "price",
    },
    health_b: {
      id: "health_b",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Mantıklı, en azından bir çözüm öneriyorsunuz." },
        { speaker: "emlah", text: "Alt kattaki dükkan da akşam 7'de kapanıyor, geceleri sorun olmaz zaten." },
      ],
      next: "price",
    },
    health_c: {
      id: "health_c",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "(gülümser) Sizde bir mantık var, itiraf edeyim." },
        { speaker: "emlah", text: "İşin doğası böyle, ben de bazen kendime inanmakta zorlanıyorum." },
      ],
      next: "price",
    },

    // 5) Fiyat pazarlığı — kapanış seçimi
    price: {
      id: "price",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Peki fiyat konusunda pazarlık payınız var mı?" },
        { speaker: "customer1", name: "Ceylin", text: "Çünkü bu haliyle tam istediğim fiyat değil açıkçası." },
      ],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Fiyat zaten piyasa değerinin altında, indirim payı yok ama düşünebilirim.\"", next: "closing_thinking", effects: { suspicion: 0 } },
        { id: "c", text: "\"Bu fiyata bu evi başka kimse bulamazsınız, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Bu iyi bir haber. Eşimle konuşup bugün dönüş yapayım o zaman." },
        { speaker: "customer1", name: "Ceylin", text: "Aslında ilk izlenimim kadar kötü değilmiş burası." },
        { speaker: "emlah", text: "Memnun olacağınızdan eminim, hayırlısı olsun." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Eşimle konuşup size dönerim, düşüneceğiz." },
        { speaker: "emlah", text: "Ne zaman isterseniz arayabilirsiniz, elimde birkaç seçenek daha var." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Ceylin", text: "Beni aceleye getirmeye çalıştığınızı fark ettim şimdi." },
        { speaker: "customer1", name: "Ceylin", text: "Sanırım burası bize göre değil, vaktinizi aldım kusura bakmayın." },
      ],
      end: "lost",
    },
  },
};

export const houseHayaletliDaire: HouseScene = {
  id: "hayaletli-daire",
  title: "Hayaletli Daire",
  location: "Cihangir, 2. kat",
  customerNames: ["Nermin Hanım", "Kaan"],
  background: "placeholder-house-2",
  askingPrice: 4750000,
  startNode: "start",
  nodes: {
    // 1) İlk enerji yorumu — seçim
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "(girer girmez durur) Buranın enerjisi... ağır." },
        { speaker: "customer2", name: "Kaan", text: "Anne, daha bakmadık bile, en azından bir tur atalım." },
      ],
      choices: [
        { id: "a", text: "\"Haklısınız aslında, bu binanın geçmişi çok eski, bir hikayesi var.\"", next: "q1_a", effects: { suspicion: 5, interest: 20 } },
        { id: "b", text: "\"Enerji falan yok Nermin Hanım, sadece boyası eski.\"", next: "q1_b", effects: { suspicion: 10 } },
        { id: "c", text: "\"Ben de hep öyle düşünürüm, evler bize bir şeyler anlatır.\"", next: "q1_c", effects: { suspicion: 0, interest: 15 } },
      ],
    },
    q1_a: {
      id: "q1_a",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "(dikkatle bakar) Ne tür bir hikaye? Anlatın bana." },
        { speaker: "thought", text: "Şimdi bir hikaye uydurmam lazım, hem de iyi bir tane." },
      ],
      next: "rooms",
    },
    q1_b: {
      id: "q1_b",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Siz gençler hep mantıkla açıklıyorsunuz her şeyi." },
        { speaker: "customer2", name: "Kaan", text: "(gülümser) Bence de biraz eski boya kokusu var sadece anne." },
      ],
      next: "rooms",
    },
    q1_c: {
      id: "q1_c",
      lines: [
        { speaker: "customer2", name: "Kaan", text: "Anne bak, o bile hissediyor, sana söylemiştim!" },
        { speaker: "customer1", name: "Nermin Hanım", text: "Demek siz de duyarlısınız bu konularda." },
      ],
      next: "rooms",
    },

    // 2) Odalar / komşu dedikodusu — seçim
    rooms: {
      id: "rooms",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Komşulardan biri internete 'gece kapı kendi kendine açıldı' diye yazmış." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Bunu nasıl açıklıyorsunuz?" },
      ],
      choices: [
        { id: "a", text: "\"Muhtemelen rüzgardır, kapı menteşeleri gevşek olabilir.\"", next: "rooms_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Belki de ev size bir şey söylemeye çalışıyordur.\"", next: "rooms_b", effects: { interest: 25 } },
        { id: "c", text: "\"İnternete yazılan her şeye inanmamak lazım.\"", next: "rooms_c", effects: { suspicion: 5, fun: 10 } },
      ],
    },
    rooms_a: {
      id: "rooms_a",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Menteşe mi... belki. Ama içim pek rahat etmedi açıkçası." },
        { speaker: "customer2", name: "Kaan", text: "Anne, mantıklı bir açıklama bu." },
      ],
      next: "kaan",
    },
    rooms_b: {
      id: "rooms_b",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "(gözleri parlar) Aynen öyle düşünüyorum ben de!" },
        { speaker: "customer2", name: "Kaan", text: "(Emlah'a bakar) Siz de mi bu işe girdiniz şimdi..." },
      ],
      next: "kaan",
    },
    rooms_c: {
      id: "rooms_c",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Belki haklısınız, herkes bir şey uyduruyor bu aralar." },
        { speaker: "customer2", name: "Kaan", text: "(gülümser) İlk defa anneme mantıklı bir şey söyleyen biri çıktı." },
      ],
      next: "kaan",
    },

    // 3) Kaan'ın kendi sorusu — seçim
    kaan: {
      id: "kaan",
      lines: [
        { speaker: "customer2", name: "Kaan", text: "Emlah Bey, açıkçası ben bu hikayelere pek inanmıyorum." },
        { speaker: "customer2", name: "Kaan", text: "Siz gerçekten burada oturur muydunuz?" },
      ],
      choices: [
        { id: "a", text: "\"Açıkçası oturmam ama bu benim tercihim, ev kötü değil.\"", next: "kaan_a", effects: { suspicion: 5, fun: 10 } },
        { id: "b", text: "\"Elbette, hiç tereddüt etmem.\"", next: "kaan_b", effects: { suspicion: 15 } },
        { id: "c", text: "\"Onu bana değil, kalbinize sorun.\"", next: "kaan_c", effects: { fun: 20, interest: 10 } },
      ],
    },
    kaan_a: {
      id: "kaan_a",
      lines: [
        { speaker: "customer2", name: "Kaan", text: "(gülümser) En azından dürüstsünüz, bunu takdir ederim." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Kaan, dürüstlük her zaman en iyi cevap değildir." },
      ],
      next: "price",
    },
    kaan_b: {
      id: "kaan_b",
      lines: [
        { speaker: "customer2", name: "Kaan", text: "Hiç ikna olmadım ama tamam, devam edelim." },
        { speaker: "thought", text: "İnanmadığını gözlerinden anladım." },
      ],
      next: "price",
    },
    kaan_c: {
      id: "kaan_c",
      lines: [
        { speaker: "customer2", name: "Kaan", text: "(şaşırır) Bu güzel bir cevaptı doğrusu." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Görüyor musun Kaan, adam felsefe de biliyor." },
      ],
      next: "price",
    },

    // 4) Kapanış seçimi
    price: {
      id: "price",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Peki bu evi almamız için bize ne söylersiniz?" },
        { speaker: "customer1", name: "Nermin Hanım", text: "Son bir cümle, karar vermeden önce." },
      ],
      choices: [
        { id: "a", text: "\"Bu evin bir ruhu var, Kaan burada kendini gerçekten bulabilir — üstüne %5 de indirim ayarlarım.\"", next: "closing_sold_ruh", effects: { interest: 20, discountPercent: 5 } },
        { id: "b", text: "\"Rasyonel konuşayım: konum, metrekare ve fiyat gerçekten uygun, indirime gerek yok.\"", next: "closing_thinking", effects: { suspicion: 0 } },
        { id: "c", text: "\"Bugün karar vermezseniz başka bir aile alır, söyleyeyim.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },

    closing_sold_ruh: {
      id: "closing_sold_ruh",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Biz bu daireyi alıyoruz, kararımı verdim." },
        { speaker: "customer2", name: "Kaan", text: "(Emlah'a göz kırpar) Sağ olun, annemi mutlu ettiniz." },
        { speaker: "emlah", text: "Ben teşekkür ederim, hayırlı olsun." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Mantıklı konuştunuz, biraz daha düşünmemiz lazım yine de." },
        { speaker: "customer2", name: "Kaan", text: "Teşekkürler Emlah Bey, size döneriz." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Bu şekilde bastırılmayı hiç sevmem açıkçası." },
        { speaker: "customer2", name: "Kaan", text: "Anne haklı, biz düşünelim önce." },
      ],
      end: "lost",
    },
  },
};

export const houseDenizeSifir: HouseScene = {
  id: "denize-sifir",
  title: "Denize Sıfır (Aslında Değil)",
  location: "Bakırköy, 5. kat",
  customerNames: ["Orhan Bey"],
  background: "placeholder-house-3",
  askingPrice: 2600000,
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: "Emlah Bey, ilanda \"denize sıfır\" yazıyordu, doğru mu bu?" },
        { speaker: "customer1", name: "Orhan Bey", text: "Ben ömrüm boyunca pencereden deniz görmek istedim." },
      ],
      choices: [
        { id: "a", text: "\"Sıfıra çok yakın sayılır, gelin gösterelim.\"", next: "start_a", effects: { suspicion: 5 } },
        { id: "b", text: "\"Deniz görünüyor, biraz da yol var araya girmiş.\"", next: "start_b" },
        { id: "c", text: "\"Denizi hissedeceksiniz, emin olun.\"", next: "start_c", effects: { suspicion: 10, fun: 10 } },
      ],
    },
    start_a: {
      id: "start_a",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "Umarım öyledir, çok heyecanlıyım." }],
      next: "manzara",
    },
    start_b: {
      id: "start_b",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "Dürüst olmanızı takdir ediyorum." }],
      next: "manzara",
    },
    start_c: {
      id: "start_c",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "(gözleri parlar) Ne güzel, hadi görelim!" }],
      next: "manzara",
    },

    manzara: {
      id: "manzara",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: "(pencereye gider) Bu... otoyol mu? Deniz nerede?" },
        { speaker: "customer1", name: "Orhan Bey", text: "Şu küçük mavi parçayı mı kastediyorsunuz?" },
      ],
      choices: [
        { id: "a", text: "\"Evet, tam orası, sabah ışığında daha net görünüyor.\"", next: "manzara_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Açıkçası yol da manzaranın parçası, hareketli bir enerjisi var.\"", next: "manzara_b", effects: { fun: 15 } },
        { id: "c", text: "\"Deniz kokusu da geliyor rüzgar tersten eserse.\"", next: "manzara_c", effects: { suspicion: 20, fun: 10 } },
      ],
    },
    manzara_a: {
      id: "manzara_a",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "(gözlerini kısar) Sabah ışığı demek..." }],
      next: "gurultu",
    },
    manzara_b: {
      id: "manzara_b",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "(güler) İlginç bir bakış açısı doğrusu." }],
      next: "gurultu",
    },
    manzara_c: {
      id: "manzara_c",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "Rüzgar tersten eserse... anladım." }],
      next: "gurultu",
    },

    gurultu: {
      id: "gurultu",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "Peki bu yoldan gelen ses rahatsız etmiyor mu geceleri?" }],
      choices: [
        { id: "a", text: "\"Çift cam var, neredeyse hiç duymuyorsunuz.\"", next: "gurultu_a" },
        { id: "b", text: "\"İlk hafta alışıyorsunuz, sonra fark etmiyorsunuz.\"", next: "gurultu_b", effects: { suspicion: 10 } },
        { id: "c", text: "\"Ben olsam onu deniz dalgası sesi gibi düşünürdüm.\"", next: "gurultu_c", effects: { fun: 20 } },
      ],
    },
    gurultu_a: {
      id: "gurultu_a",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "Çift cam iyi bir çözüm, rahatladım biraz." }],
      next: "kapanis",
    },
    gurultu_b: {
      id: "gurultu_b",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "Alışmak biraz zaman ister sanırım benim yaşımda." }],
      next: "kapanis",
    },
    gurultu_c: {
      id: "gurultu_c",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "(güler) Dalga sesi... hoşuma gitti bu yorum." }],
      next: "kapanis",
    },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Orhan Bey", text: "Son olarak, gerçekten mutlu olur muyum burada?" }],
      choices: [
        { id: "a", text: "\"Deniz hayaliniz için başka bir seçeneğe bakmanızı öneririm, dürüst olayım.\"", next: "closing_thinking" },
        { id: "b", text: "\"Kesinlikle, hem de sahibiyle konuşup %6 indirim ayarlarım.\"", next: "closing_sold", effects: { discountPercent: 6 } },
        { id: "c", text: "\"Bu fiyata bu manzarayı bulamazsınız, karar vermelisiniz.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: "Dürüstlüğünüzü takdir ediyorum, biraz daha bakınmam lazım." },
        { speaker: "emlah", text: "Anlıyorum, deniz hayaliniz için doğru yeri bulmanızı isterim." },
      ],
      end: "thinking",
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: "İndirimle birlikte mantıklı geldi, alalım o zaman." },
        { speaker: "emlah", text: "Hayırlı olsun, teleskobunuzu da unutmayın." },
      ],
      end: "sold",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Orhan Bey", text: "Beni aceleye getirdiğinizi hissettim, hoş olmadı." },
        { speaker: "customer1", name: "Orhan Bey", text: "Başka bir yere bakacağım sanırım." },
      ],
      end: "lost",
    },
  },
};

export const houseKamburBalkon: HouseScene = {
  id: "kambur-balkon",
  title: "Kambur Balkon",
  location: "Kadıköy, 2. kat",
  customerNames: ["Ela", "Barış"],
  background: "placeholder-house-4",
  askingPrice: 3000000,
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Ela", text: "Buraya bayıldım bile, balkonu görebilir miyiz?" },
        { speaker: "customer2", name: "Barış", text: "Acele etme Ela, önce her yeri gezelim." },
      ],
      choices: [
        { id: "a", text: "\"Hemen balkona geçelim, en güzel kısım orası.\"", next: "start_a", effects: { fun: 10 } },
        { id: "b", text: "\"Barış haklı, önce içeriyi gezelim.\"", next: "start_b" },
        { id: "c", text: "\"Balkon konusunda size bir şey söylemem lazım aslında.\"", next: "start_c" },
      ],
    },
    start_a: {
      id: "start_a",
      lines: [{ speaker: "customer1", name: "Ela", text: "(heyecanla) Hadi o zaman, göstersenize!" }],
      next: "balkon",
    },
    start_b: {
      id: "start_b",
      lines: [{ speaker: "customer2", name: "Barış", text: "Teşekkürler, aceleye getirmemek lazım." }],
      next: "balkon",
    },
    start_c: {
      id: "start_c",
      lines: [{ speaker: "customer2", name: "Barış", text: "(kaşlarını çatar) Ne söylemeniz gerekiyor?" }],
      next: "balkon",
    },

    balkon: {
      id: "balkon",
      lines: [
        { speaker: "customer2", name: "Barış", text: "(balkona çıkar) Bu... eğik mi duruyor yoksa gözüm mü yanılıyor?" },
        { speaker: "customer1", name: "Ela", text: "Barış, abartma, biraz meyilli sadece." },
      ],
      choices: [
        { id: "a", text: "\"Eski binalarda bu normal, statik açıdan sorun yok.\"", next: "balkon_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Haklısınız, hafif bir eğim var, ustaya baktırılabilir.\"", next: "balkon_b" },
        { id: "c", text: "\"Meyilli değil, karakteristik diyelim.\"", next: "balkon_c", effects: { suspicion: 10, fun: 15 } },
      ],
    },
    balkon_a: {
      id: "balkon_a",
      lines: [{ speaker: "customer2", name: "Barış", text: "Statik açıdan derken, bir mühendis mi baktı?" }],
      next: "guvenlik",
    },
    balkon_b: {
      id: "balkon_b",
      lines: [{ speaker: "customer1", name: "Ela", text: "En azından çözüm var, rahatladım." }],
      next: "guvenlik",
    },
    balkon_c: {
      id: "balkon_c",
      lines: [{ speaker: "customer1", name: "Ela", text: "(güler) Karakteristik, bunu beğendim." }],
      next: "guvenlik",
    },

    guvenlik: {
      id: "guvenlik",
      lines: [{ speaker: "customer2", name: "Barış", text: "Emin olmak istiyorum, üzerine çıkınca çökmez değil mi?" }],
      choices: [
        { id: "a", text: "\"Kesinlikle çökmez, ben şahsen dener geçerim.\"", next: "guvenlik_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Ustaya baktırmadan tam garanti veremem açıkçası.\"", next: "guvenlik_b" },
        { id: "c", text: "\"Yıllardır böyle duruyor, alışkanlık meselesi.\"", next: "guvenlik_c", effects: { suspicion: 5 } },
      ],
    },
    guvenlik_a: {
      id: "guvenlik_a",
      lines: [{ speaker: "customer2", name: "Barış", text: "(şüpheyle) Siz mi denediniz, ne zaman?" }],
      next: "kapanis",
    },
    guvenlik_b: {
      id: "guvenlik_b",
      lines: [{ speaker: "customer1", name: "Ela", text: "Mantıklı, önce kontrol ettirelim o zaman." }],
      next: "kapanis",
    },
    guvenlik_c: {
      id: "guvenlik_c",
      lines: [{ speaker: "customer2", name: "Barış", text: "Alışkanlık meselesi mi... emin değilim." }],
      next: "kapanis",
    },

    kapanis: {
      id: "kapanis",
      lines: [
        { speaker: "customer1", name: "Ela", text: "Barış, bence sorun değil, ben bu evi çok sevdim." },
        { speaker: "customer2", name: "Barış", text: "Emin değilim ama... Emlah Bey, siz ne dersiniz?" },
      ],
      choices: [
        { id: "a", text: "\"Ustaya baktırıp güvenli olduğunu belgeleterek ilerleyelim, üstüne %5 indirim de ayarlarım.\"", next: "closing_sold", effects: { discountPercent: 5 } },
        { id: "b", text: "\"Karar sizin, ben baskı yapmam.\"", next: "closing_thinking" },
        { id: "c", text: "\"Bu fiyata, bu semtte başka seçenek bulamazsınız.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Ela", text: "Bu bana güven verdi, alalım Barış." },
        { speaker: "customer2", name: "Barış", text: "Tamam, belgeler elimizde olsun yeter." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", name: "Barış", text: "Biraz daha düşünelim, önemli bir karar bu." },
        { speaker: "customer1", name: "Ela", text: "Haber veririz size." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer2", name: "Barış", text: "Bu şekilde acele ettirilmek hoşuma gitmedi." },
        { speaker: "customer1", name: "Ela", text: "Barış haklı, biraz daha bakınalım." },
      ],
      end: "lost",
    },
  },
};

export const allHouses: HouseScene[] = [houseKokuluStudyo, houseHayaletliDaire, houseDenizeSifir, houseKamburBalkon];
