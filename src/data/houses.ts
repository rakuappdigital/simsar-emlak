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

export const houseKediCenneti: HouseScene = {
  id: "kedi-cenneti",
  title: "Kedi Cenneti",
  location: "Üsküdar, 1. kat",
  customerNames: ["Gül Hanım"],
  background: "placeholder-house-5",
  askingPrice: 2900000,
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Gül Hanım", text: "(burnunu çeker) Vay canına, kaç kedi yaşamış burada böyle?" }],
      choices: [
        { id: "a", text: "\"Önceki sahibi hayvansever biriymiş, siz de seveceksiniz sanırım.\"", next: "start_a", effects: { fun: 10 } },
        { id: "b", text: "\"Açıkçası biraz fazla kediymiş, temizlik gerekebilir.\"", next: "start_b" },
        { id: "c", text: "\"Belki de ev size bir işaret gönderiyordur.\"", next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Gül Hanım", text: "(gülümser) Ben zaten hayvanlara bayılırım." }], next: "bahce" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Gül Hanım", text: "Dürüstlüğünüzü takdir ederim." }], next: "bahce" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Gül Hanım", text: "(gözleri parlar) Belki de haklısınız." }], next: "bahce" },

    bahce: {
      id: "bahce",
      lines: [{ speaker: "customer1", name: "Gül Hanım", text: "Bahçe kapısı hep açık mı kalıyormuş, sokak kedileri girer mi?" }],
      choices: [
        { id: "a", text: "\"Muhtemelen girer ama siz zaten seviyorsunuz, sorun olmaz.\"", next: "bahce_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Kilit taktırırsanız kontrol altına alırsınız.\"", next: "bahce_b" },
        { id: "c", text: "\"Belki de burası resmen bir kedi kafesi kurmak için ideal.\"", next: "bahce_c", effects: { fun: 20 } },
      ],
    },
    bahce_a: { id: "bahce_a", lines: [{ speaker: "customer1", name: "Gül Hanım", text: "Sorun olmaz gerçekten, ben zaten mutlu olurum." }], next: "temizlik" },
    bahce_b: { id: "bahce_b", lines: [{ speaker: "customer1", name: "Gül Hanım", text: "Mantıklı, ona bakarız." }], next: "temizlik" },
    bahce_c: { id: "bahce_c", lines: [{ speaker: "customer1", name: "Gül Hanım", text: "(güler) Bu fikri çok sevdim doğrusu." }], next: "temizlik" },

    temizlik: {
      id: "temizlik",
      lines: [{ speaker: "customer1", name: "Gül Hanım", text: "Peki bu koku geçer mi sizce, yoksa kalıcı mı?" }],
      choices: [
        { id: "a", text: "\"Derin temizlikle kesinlikle geçer, garanti ederim.\"", next: "temizlik_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Biraz zaman alabilir ama geçer.\"", next: "temizlik_b" },
        { id: "c", text: "\"Kedi kokusu sevgi kokusudur bence.\"", next: "temizlik_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    temizlik_a: { id: "temizlik_a", lines: [{ speaker: "customer1", name: "Gül Hanım", text: "Garanti ediyorsanız güzel." }], next: "kapanis" },
    temizlik_b: { id: "temizlik_b", lines: [{ speaker: "customer1", name: "Gül Hanım", text: "Zamanla geçer, sabrederim." }], next: "kapanis" },
    temizlik_c: { id: "temizlik_c", lines: [{ speaker: "customer1", name: "Gül Hanım", text: "(kahkaha atar) Buna bayıldım." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Gül Hanım", text: "Açıkçası ben bu evle bir bağ kurdum galiba." }],
      choices: [
        { id: "a", text: "\"O zaman bu ev tam size göre — üstüne %4 indirim de ekleyelim.\"", next: "closing_sold", effects: { discountPercent: 4 } },
        { id: "b", text: "\"Bir düşünün, acele etmeyin, önemli bir karar.\"", next: "closing_thinking" },
        { id: "c", text: "\"Bugün karar vermezseniz başka bir hayvansever kapar.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Gül Hanım", text: "Haklısınız, kalbim biliyor. Alıyorum bu evi." },
        { speaker: "emlah", text: "Hayırlı olsun, kedileriniz de mutlu olur burada." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Gül Hanım", text: "Haklısınız, biraz düşüneyim." },
        { speaker: "emlah", text: "Tabii, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Gül Hanım", text: "Beni aceleye getirmeniz hoşuma gitmedi açıkçası." },
        { speaker: "customer1", name: "Gül Hanım", text: "Biraz daha bakınacağım." },
      ],
      end: "lost",
    },
  },
};

export const houseAsansorsuzZirve: HouseScene = {
  id: "asansorsuz-zirve",
  title: "Asansörsüz Zirve",
  location: "Şişli, 7. kat",
  customerNames: ["Nadir Bey", "Sevim Teyze"],
  background: "placeholder-house-6",
  askingPrice: 3400000,
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Nadir Bey", text: "(nefes nefese) Emlah Bey... asansör... nerede?" },
        { speaker: "customer2", name: "Sevim Teyze", text: "Nadir, otur biraz, nefesini topla." },
      ],
      choices: [
        { id: "a", text: "\"Asansör yok maalesef ama manzaraya değer.\"", next: "start_a" },
        { id: "b", text: "\"Birazdan alışırsınız, spor gibi düşünün.\"", next: "start_b", effects: { fun: 10, suspicion: 10 } },
        { id: "c", text: "\"Asansör yapılması planlanıyor aslında.\"", next: "start_c", effects: { suspicion: 20 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: "En azından dürüstsünüz, teşekkürler." }], next: "manzara" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Nadir Bey", text: "(gülümser) Spor mu... bakalım." }], next: "manzara" },
    start_c: { id: "start_c", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: "Ne zaman yapılacakmış peki?" }], next: "manzara" },

    manzara: {
      id: "manzara",
      lines: [{ speaker: "customer2", name: "Sevim Teyze", text: "(pencereye gider) Ama itiraf edeyim, manzara gerçekten güzelmiş." }],
      choices: [
        { id: "a", text: "\"Değil mi? Her gün bu manzarayı görmek büyük bir ayrıcalık.\"", next: "manzara_a", effects: { fun: 10 } },
        { id: "b", text: "\"Evet ama günde iki kez bu merdivenleri çıkmanız gerekecek.\"", next: "manzara_b" },
        { id: "c", text: "\"Manzara için her şeye değer, ben olsam düşünmezdim.\"", next: "manzara_c", effects: { suspicion: 10 } },
      ],
    },
    manzara_a: { id: "manzara_a", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: "Ayrıcalık kelimesi çok doğru." }], next: "saglik" },
    manzara_b: { id: "manzara_b", lines: [{ speaker: "customer1", name: "Nadir Bey", text: "Doğru, bunu düşünmemiz lazım." }], next: "saglik" },
    manzara_c: { id: "manzara_c", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: "Siz düşünmezdiniz ama biz belki düşünürüz." }], next: "saglik" },

    saglik: {
      id: "saglik",
      lines: [{ speaker: "customer1", name: "Nadir Bey", text: "Doktorum merdiven çıkmamı pek istemiyor açıkçası." }],
      choices: [
        { id: "a", text: "\"O zaman belki bu ev size uygun değil, üzgünüm.\"", next: "saglik_a" },
        { id: "b", text: "\"Yavaş yavaş çıkarsınız, kalp için de iyi olur belki.\"", next: "saglik_b", effects: { suspicion: 15 } },
        { id: "c", text: "\"Torununuz alışverişinizi taşır artık, bahane bu.\"", next: "saglik_c", effects: { fun: 15 } },
      ],
    },
    saglik_a: { id: "saglik_a", lines: [{ speaker: "customer1", name: "Nadir Bey", text: "Dürüstlüğünüzü takdir ediyorum." }], next: "kapanis" },
    saglik_b: { id: "saglik_b", lines: [{ speaker: "customer2", name: "Sevim Teyze", text: "Doktoruna sormadan olmaz bence." }], next: "kapanis" },
    saglik_c: { id: "saglik_c", lines: [{ speaker: "customer1", name: "Nadir Bey", text: "(güler) O fikri torunuma söylemem lazım." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [
        { speaker: "customer2", name: "Sevim Teyze", text: "Nadir, ne dersin, alalım mı?" },
        { speaker: "customer1", name: "Nadir Bey", text: "Bilmiyorum ki... nefesim daha yeni düzeldi." },
      ],
      choices: [
        { id: "a", text: "\"Sağlığınız önemli, belki alt katlardan bir seçeneğe bakalım.\"", next: "closing_thinking" },
        { id: "b", text: "\"Bu manzara bir daha çıkmaz karşınıza — üstüne %5 indirim de yaparım.\"", next: "closing_sold", effects: { discountPercent: 5 } },
        { id: "c", text: "\"Merdiven diyet gibi düşünün, alın gitsin.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer2", name: "Sevim Teyze", text: "İndirimle birlikte mantıklı geldi, alalım Nadir." },
        { speaker: "customer1", name: "Nadir Bey", text: "Tamam, bacaklarım güçlenir belki." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", name: "Sevim Teyze", text: "Haklısınız, sağlık önemli, düşünelim." },
        { speaker: "emlah", text: "Anlıyorum, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Nadir Bey", text: "Bu şekilde bastırılmak hoşuma gitmedi." },
        { speaker: "customer2", name: "Sevim Teyze", text: "Nadir haklı, gidelim biz." },
      ],
      end: "lost",
    },
  },
};

export const houseNemGalerisi: HouseScene = {
  id: "nem-galerisi",
  title: "Nem Sanat Galerisi",
  location: "Balat, 3. kat",
  customerNames: ["Deniz"],
  background: "placeholder-house-7",
  askingPrice: 2100000,
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Deniz", text: "(duvarlara bakar) Bu lekeler... bilerek mi yapılmış?" }],
      choices: [
        { id: "a", text: "\"Doğal oluşmuş ama sanat eseri gibi değil mi?\"", next: "start_a", effects: { fun: 15 } },
        { id: "b", text: "\"Açıkçası nem sorunu, dürüst olayım.\"", next: "start_b" },
        { id: "c", text: "\"Sanatçı gözü hemen fark etti demek.\"", next: "start_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Deniz", text: "(yakından bakar) Gerçekten ilginç dokular var." }], next: "kaynak" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Deniz", text: "Dürüstlüğünüzü takdir ederim." }], next: "kaynak" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Deniz", text: "(gülümser) Mesleki bir hastalık diyelim." }], next: "kaynak" },

    kaynak: {
      id: "kaynak",
      lines: [{ speaker: "customer1", name: "Deniz", text: "Peki bu nem nereden geliyor, çatıdan mı?" }],
      choices: [
        { id: "a", text: "\"Tam olarak bilmiyorum ama estetik olarak çalışıyor.\"", next: "kaynak_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Çatıdan sızıntı olabilir, kontrol ettirmenizi öneririm.\"", next: "kaynak_b" },
        { id: "c", text: "\"Kim bilir, belki bina kendi hikayesini anlatıyor.\"", next: "kaynak_c", effects: { fun: 20 } },
      ],
    },
    kaynak_a: { id: "kaynak_a", lines: [{ speaker: "customer1", name: "Deniz", text: "Estetik olarak çalışması ilginç bir yaklaşım." }], next: "kalicilik" },
    kaynak_b: { id: "kaynak_b", lines: [{ speaker: "customer1", name: "Deniz", text: "Mantıklı, kontrol ettiririm." }], next: "kalicilik" },
    kaynak_c: { id: "kaynak_c", lines: [{ speaker: "customer1", name: "Deniz", text: "(gülümser) Bu bakış açısını seviyorum." }], next: "kalicilik" },

    kalicilik: {
      id: "kalicilik",
      lines: [{ speaker: "customer1", name: "Deniz", text: "Bu desenler zamanla değişir mi, yoksa hep böyle mi kalır?" }],
      choices: [
        { id: "a", text: "\"Zamanla büyür, yeni desenler oluşur, hep taze bir eser.\"", next: "kalicilik_a", effects: { fun: 15, suspicion: 10 } },
        { id: "b", text: "\"Onarılırsa kaybolur ama onarmazsanız kalır.\"", next: "kalicilik_b" },
        { id: "c", text: "\"Bu bina sürekli kendini yeniden yaratıyor diyelim.\"", next: "kalicilik_c", effects: { suspicion: 15 } },
      ],
    },
    kalicilik_a: { id: "kalicilik_a", lines: [{ speaker: "customer1", name: "Deniz", text: "Yaşayan bir eser gibi yani, harika." }], next: "kapanis" },
    kalicilik_b: { id: "kalicilik_b", lines: [{ speaker: "customer1", name: "Deniz", text: "Anladım, seçim bana kalmış." }], next: "kapanis" },
    kalicilik_c: { id: "kalicilik_c", lines: [{ speaker: "customer1", name: "Deniz", text: "Bu cümleyi çok sevdim." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Deniz", text: "Burada yaşayıp bu duvarları resmedebilirim sanki." }],
      choices: [
        { id: "a", text: "\"Tam da sizin gibi bir sanatçıya ihtiyacı vardı bu evin.\"", next: "closing_sold", effects: { discountPercent: 3 } },
        { id: "b", text: "\"Nem sorununu çözdürüp öyle taşınmanızı öneririm.\"", next: "closing_thinking" },
        { id: "c", text: "\"Başka bir sanatçı bu ilhamı kaçırmadan karar verin.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Deniz", text: "Haklısınız, bu ev bana sesleniyor. Alıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun, umarım ilham dolu bir atölye olur." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Deniz", text: "Haklısınız belki, önce nemi konuşayım sahiple." },
        { speaker: "emlah", text: "İyi düşünce, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Deniz", text: "Bu baskıyı sevmedim açıkçası." },
        { speaker: "customer1", name: "Deniz", text: "Biraz daha düşüneceğim." },
      ],
      end: "lost",
    },
  },
};

export const houseDavulcuKomsu: HouseScene = {
  id: "davulcu-komsu",
  title: "Davulcu Komşu",
  location: "Beşiktaş, 4. kat",
  customerNames: ["Sinan Bey"],
  background: "placeholder-house-8",
  askingPrice: 4100000,
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Sinan Bey", text: "Ben yazarım, en önemli önceliğim sessizlik. Burası sakin mi?" }],
      choices: [
        { id: "a", text: "\"Gayet sakin bir bina, yazarlar için ideal.\"", next: "start_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Genelde sakin ama bazen bir şeyler duyulabiliyor.\"", next: "start_b" },
        { id: "c", text: "\"Sessizlik göreceli bir kavram değil mi?\"", next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Sinan Bey", text: "Umarım öyledir, buna ihtiyacım var." }], next: "ses" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Sinan Bey", text: "Bazen ne kadar sıklıkla oluyor peki?" }], next: "ses" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Sinan Bey", text: "(hafifçe güler) Felsefi bir emlakçı, ilginç." }], next: "ses" },

    ses: {
      id: "ses",
      lines: [{ speaker: "customer1", name: "Sinan Bey", text: "(aniden bir davul sesi duyulur) Bu... bu neydi şimdi?" }],
      choices: [
        { id: "a", text: "\"Muhtemelen dışarıdan geliyordur, sokak müzisyeni olabilir.\"", next: "ses_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Alt komşu bateri çalıyor sanırım, akşamları oluyor bu.\"", next: "ses_b" },
        { id: "c", text: "\"İlham perisi kapınızı çalıyor olabilir.\"", next: "ses_c", effects: { fun: 20 } },
      ],
    },
    ses_a: { id: "ses_a", lines: [{ speaker: "customer1", name: "Sinan Bey", text: "Sokak müzisyeni mi, umarım öyledir." }], next: "surek" },
    ses_b: { id: "ses_b", lines: [{ speaker: "customer1", name: "Sinan Bey", text: "Akşamları mı... tam yazı yazacağım saatler." }], next: "surek" },
    ses_c: { id: "ses_c", lines: [{ speaker: "customer1", name: "Sinan Bey", text: "(gülümser) Bu ilham perisi biraz gürültücüymüş." }], next: "surek" },

    surek: {
      id: "surek",
      lines: [{ speaker: "customer1", name: "Sinan Bey", text: "Her akşam mı böyle, yoksa bugüne mi denk geldik?" }],
      choices: [
        { id: "a", text: "\"Bugüne özel olmalı, nadiren oluyordur.\"", next: "surek_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Açıkçası her akşam saat 7 gibi başlıyor diye duydum.\"", next: "surek_b" },
        { id: "c", text: "\"Belki de yeni bir yazma ritmi bulursunuz bu sesle.\"", next: "surek_c", effects: { fun: 15 } },
      ],
    },
    surek_a: { id: "surek_a", lines: [{ speaker: "customer1", name: "Sinan Bey", text: "Umarım nadiren, yoksa sorun olur." }], next: "kapanis" },
    surek_b: { id: "surek_b", lines: [{ speaker: "customer1", name: "Sinan Bey", text: "Her akşam saat 7... bu ciddi bir sorun." }], next: "kapanis" },
    surek_c: { id: "surek_c", lines: [{ speaker: "customer1", name: "Sinan Bey", text: "(düşünceli) İlginç bir bakış açısı." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Sinan Bey", text: "Sessizlik olmadan yazamam ben, bu ciddi bir sorun." }],
      choices: [
        { id: "a", text: "\"Kulaklık önerebilirim ama bu ev size göre olmayabilir.\"", next: "closing_thinking" },
        { id: "b", text: "\"Komşuyla konuşup saatleri ayarlayabiliriz, üstüne %5 indirim de yaparım.\"", next: "closing_sold", effects: { discountPercent: 5 } },
        { id: "c", text: "\"Alışırsınız, hatta ritim ilham verir belki.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Sinan Bey", text: "Bu makul bir çözüm, deneyelim o zaman." },
        { speaker: "emlah", text: "Hayırlı olsun, yazma verimli geçsin." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Sinan Bey", text: "Haklısınız, biraz daha düşünmem lazım." },
        { speaker: "emlah", text: "Anlıyorum, sessizlik önemli bir ihtiyaç." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Sinan Bey", text: "Ritim ilham vermez, sadece dikkat dağıtır." },
        { speaker: "customer1", name: "Sinan Bey", text: "Başka bir yere bakacağım." },
      ],
      end: "lost",
    },
  },
};

export const houseTapuSorunlu: HouseScene = {
  id: "tapu-sorunlu",
  title: "Tapu Sorunlu Saray",
  location: "Bebek, deniz manzaralı",
  customerNames: ["Cavidan Hanım"],
  background: "placeholder-house-9",
  askingPrice: 8500000,
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Muhteşem bir yer. Tapu durumu tam temiz değil mi demiştiniz?" }],
      choices: [
        { id: "a", text: "\"Küçük bir pürüz var ama önemsiz.\"", next: "start_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Açıkçası mirasla ilgili bir işlem sürüyor, avukatınızla kontrol ettirin.\"", next: "start_b" },
        { id: "c", text: "\"Tapu meseleleri her zaman çözülür, endişelenmeyin.\"", next: "start_c", effects: { suspicion: 10 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Önemsiz derken, ne kadar önemsiz?" }], next: "detay" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Avukatımı hemen ararım o zaman." }], next: "detay" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Umarım öyle olur." }], next: "detay" },

    detay: {
      id: "detay",
      lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Ne kadar sürer bu işlem sizce?" }],
      choices: [
        { id: "a", text: "\"Birkaç ay içinde biter muhtemelen.\"", next: "detay_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Emin değilim, avukatınız net bir tarih verebilir.\"", next: "detay_b" },
        { id: "c", text: "\"İş dünyasında sabır bir erdemdir, değil mi?\"", next: "detay_c", effects: { fun: 15 } },
      ],
    },
    detay_a: { id: "detay_a", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Muhtemelen kelimesi beni tedirgin ediyor." }], next: "risk" },
    detay_b: { id: "detay_b", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Doğru yaklaşım, öyle yapalım." }], next: "risk" },
    detay_c: { id: "detay_c", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "(hafifçe güler) Erdemli olmaya çalışırım." }], next: "risk" },

    risk: {
      id: "risk",
      lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Bu süreçte parayı öder de ev elimden giderse?" }],
      choices: [
        { id: "a", text: "\"Böyle bir risk yok, merak etmeyin.\"", next: "risk_a", effects: { suspicion: 25 } },
        { id: "b", text: "\"Avukatınız garantili bir sözleşme hazırlayabilir, riski minimize ederiz.\"", next: "risk_b" },
        { id: "c", text: "\"Büyük yatırımlar küçük risklerle gelir.\"", next: "risk_c", effects: { suspicion: 15, fun: 10 } },
      ],
    },
    risk_a: { id: "risk_a", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Hiç risk yok demeniz beni rahatlatmadı açıkçası." }], next: "kapanis" },
    risk_b: { id: "risk_b", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Bu yaklaşım işime gelir." }], next: "kapanis" },
    risk_c: { id: "risk_c", lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Felsefeniz ilginç ama param büyük." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Cavidan Hanım", text: "Avukatımla konuşup net bir cevap isteyeceğim." }],
      choices: [
        { id: "a", text: "\"Tabii, tüm belgeleri paylaşırım, şeffaflık önemli.\"", next: "closing_thinking" },
        { id: "b", text: "\"Süreç hızlanabilir, sizi bekletmem — üstüne %3 indirim de düşünürüm.\"", next: "closing_sold", effects: { discountPercent: 3 } },
        { id: "c", text: "\"Bu fiyata Bebek'te başka seçenek yok, hemen karar verin.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Cavidan Hanım", text: "İndirim ve hız iyi bir kombinasyon, anlaştık." },
        { speaker: "emlah", text: "Hayırlı olsun, avukatlar hemen işe başlasın." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Cavidan Hanım", text: "Şeffaflığınızı takdir ediyorum, avukatımla konuşayım." },
        { speaker: "emlah", text: "Elbette, belgeleri hemen gönderirim." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Cavidan Hanım", text: "Bu baskı taktiği bende tam tersi etki yaptı." },
        { speaker: "customer1", name: "Cavidan Hanım", text: "Başka seçeneklere bakacağım." },
      ],
      end: "lost",
    },
  },
};

export const houseMinicik: HouseScene = {
  id: "minicik",
  title: "Minicik Ama Cesur",
  location: "Tarlabaşı, 18m²",
  customerNames: ["Toprak"],
  background: "placeholder-house-10",
  askingPrice: 1650000,
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Toprak", text: "18 metrekare dediniz değil mi? Tam aradığım gibi." }],
      choices: [
        { id: "a", text: "\"Evet, minimalizm için mükemmel bir alan.\"", next: "start_a", effects: { fun: 10 } },
        { id: "b", text: "\"Küçük ama akıllıca tasarlanmış.\"", next: "start_b" },
        { id: "c", text: "\"18 metrekare değil, 18 metrekarelik özgürlük.\"", next: "start_c", effects: { fun: 20 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Toprak", text: "Kesinlikle, az eşya çok huzur." }], next: "alan" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Toprak", text: "Akıllıca tasarım tam benlik." }], next: "alan" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Toprak", text: "(gülümser) Bu cümleyi çok sevdim." }], next: "alan" },

    alan: {
      id: "alan",
      lines: [{ speaker: "customer1", name: "Toprak", text: "Peki eşyalarım nereye sığacak, biraz endişeliyim." }],
      choices: [
        { id: "a", text: "\"Az eşyayla yaşamak zaten hedefiniz değil mi?\"", next: "alan_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Katlanır mobilyalarla oldukça iyi kullanılabiliyor.\"", next: "alan_b" },
        { id: "c", text: "\"Eşya biriktirmek zaten kapitalizmin tuzağı.\"", next: "alan_c", effects: { fun: 20, suspicion: 10 } },
      ],
    },
    alan_a: { id: "alan_a", lines: [{ speaker: "customer1", name: "Toprak", text: "Haklısınız, hedefim tam olarak bu." }], next: "sosyal" },
    alan_b: { id: "alan_b", lines: [{ speaker: "customer1", name: "Toprak", text: "Katlanır mobilya fikrini seviyorum." }], next: "sosyal" },
    alan_c: { id: "alan_c", lines: [{ speaker: "customer1", name: "Toprak", text: "(güler) Tam da düşündüğüm gibi konuşuyorsunuz." }], next: "sosyal" },

    sosyal: {
      id: "sosyal",
      lines: [{ speaker: "customer1", name: "Toprak", text: "Arkadaşlarım gelirse ne yapacağız, sığar mıyız?" }],
      choices: [
        { id: "a", text: "\"İkiden fazla kişi biraz zor olabilir açıkçası.\"", next: "sosyal_a" },
        { id: "b", text: "\"Sırayla gelirler, kalite zaman böyle olur.\"", next: "sosyal_b", effects: { suspicion: 15 } },
        { id: "c", text: "\"Az arkadaş, öz arkadaş derler.\"", next: "sosyal_c", effects: { fun: 15 } },
      ],
    },
    sosyal_a: { id: "sosyal_a", lines: [{ speaker: "customer1", name: "Toprak", text: "Dürüstlüğünüzü takdir ederim." }], next: "kapanis" },
    sosyal_b: { id: "sosyal_b", lines: [{ speaker: "customer1", name: "Toprak", text: "Kalite zaman felsefesi hoşuma gitti." }], next: "kapanis" },
    sosyal_c: { id: "sosyal_c", lines: [{ speaker: "customer1", name: "Toprak", text: "(gülümser) Bunu bir yere yazmalıyım." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Toprak", text: "Bu ev bir yaşam felsefesi aslında, katılıyor musunuz?" }],
      choices: [
        { id: "a", text: "\"Kesinlikle, siz bu evin ruhuna tam uyuyorsunuz — üstüne %6 indirim de yapalım.\"", next: "closing_sold", effects: { discountPercent: 6 } },
        { id: "b", text: "\"Felsefe güzel ama pratik detayları da düşünün.\"", next: "closing_thinking" },
        { id: "c", text: "\"Bu felsefeyi yaşamak isteyen çok kişi var, acele edin.\"", next: "closing_lost", effects: { suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Toprak", text: "Bu ev ve ben tam bir uyum içindeyiz, alıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun, minimalist hayatınız burada başlıyor." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Toprak", text: "Haklısınız, pratik detayları da düşünmem lazım." },
        { speaker: "emlah", text: "Elbette, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Toprak", text: "Bu aceleci yaklaşım felsefeme aykırı." },
        { speaker: "customer1", name: "Toprak", text: "Biraz daha düşüneceğim." },
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
];
