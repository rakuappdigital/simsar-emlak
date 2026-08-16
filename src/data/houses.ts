import type { HouseScene } from "../types";

export const houseKokuluStudyo: HouseScene = {
  id: "kokulu-studyo",
  title: "Kokulu Stüdyo",
  location: "Nişantaşı, 3. kat",
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
        { speaker: "customer1", name: "Ceylin", text: "Ama konuyu değiştirdiğinizi de fark ettim, o yüzden direkt sorayım o zaman." },
      ],
      next: "health",
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
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35,  suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Fiyat zaten piyasa değerinin altında, indirim payı yok ama düşünebilirim.\"", next: "closing_thinking", effects: { closingBias: 0,  suspicion: 0 } },
        { id: "c", text: "\"Bu fiyata bu evi başka kimse bulamazsınız, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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
  askingPrice: 35620000,
  tier: 5,
  closingNodes: { sold: "closing_sold_ruh", thinking: "closing_thinking", lost: "closing_lost" },
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
        { id: "a", text: "\"Bu evin bir ruhu var, Kaan burada kendini gerçekten bulabilir — üstüne %5 de indirim ayarlarım.\"", next: "closing_sold_ruh", effects: { closingBias: 35,  interest: 20, discountPercent: 5 } },
        { id: "b", text: "\"Rasyonel konuşayım: konum, metrekare ve fiyat gerçekten uygun, indirime gerek yok.\"", next: "closing_thinking", effects: { closingBias: 0,  suspicion: 0 } },
        { id: "c", text: "\"Bugün karar vermezseniz başka bir aile alır, söyleyeyim.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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
  askingPrice: 19500000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
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
        { id: "a", text: "\"Deniz hayaliniz için başka bir seçeneğe bakmanızı öneririm, dürüst olayım.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "b", text: "\"Kesinlikle, hem de sahibiyle konuşup %6 indirim ayarlarım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 6 } },
        { id: "c", text: "\"Bu fiyata bu manzarayı bulamazsınız, karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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
  askingPrice: 22500000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
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
      next: "surpriz",
    },
    guvenlik_b: {
      id: "guvenlik_b",
      lines: [{ speaker: "customer1", name: "Ela", text: "Mantıklı, önce kontrol ettirelim o zaman." }],
      next: "surpriz",
    },
    guvenlik_c: {
      id: "guvenlik_c",
      lines: [{ speaker: "customer2", name: "Barış", text: "Alışkanlık meselesi mi... emin değilim." }],
      next: "surpriz",
    },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer2", name: "Barış", text: "(ayağını yere vurur, balkon hafifçe gıcırdar) Bunu duydunuz mu?!" },
        { speaker: "customer1", name: "Ela", text: "(irkilir) Barış, öyle yapma, kalbim ağzıma geldi!" },
        { speaker: "emlah", text: "Sakin olun, eski binalarda böyle sesler normaldir, yapısal bir şey değil." },
      ],
      next: "kapanis",
    },

    kapanis: {
      id: "kapanis",
      lines: [
        { speaker: "customer1", name: "Ela", text: "Barış, bence sorun değil, ben bu evi çok sevdim." },
        { speaker: "customer2", name: "Barış", text: "Emin değilim ama... Emlah Bey, siz ne dersiniz?" },
      ],
      choices: [
        { id: "a", text: "\"Ustaya baktırıp güvenli olduğunu belgeleterek ilerleyelim, üstüne %5 indirim de ayarlarım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "b", text: "\"Karar sizin, ben baskı yapmam.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu fiyata, bu semtte başka seçenek bulamazsınız.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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
  askingPrice: 21750000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
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
        { id: "a", text: "\"O zaman bu ev tam size göre — üstüne %4 indirim de ekleyelim.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: "\"Bir düşünün, acele etmeyin, önemli bir karar.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Bugün karar vermezseniz başka bir hayvansever kapar.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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
  askingPrice: 25500000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 0.9, interestWeight: 1.3 },
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
        { id: "a", text: "\"Sağlığınız önemli, belki alt katlardan bir seçeneğe bakalım.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "b", text: "\"Bu manzara bir daha çıkmaz karşınıza — üstüne %5 indirim de yaparım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "c", text: "\"Merdiven diyet gibi düşünün, alın gitsin.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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
  askingPrice: 15750000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
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
        { id: "a", text: "\"Tam da sizin gibi bir sanatçıya ihtiyacı vardı bu evin.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 3 } },
        { id: "b", text: "\"Nem sorununu çözdürüp öyle taşınmanızı öneririm.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Başka bir sanatçı bu ilhamı kaçırmadan karar verin.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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
  askingPrice: 30750000,
  tier: 4,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
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
        { id: "a", text: "\"Kulaklık önerebilirim ama bu ev size göre olmayabilir.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "b", text: "\"Komşuyla konuşup saatleri ayarlayabiliriz, üstüne %5 indirim de yaparım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "c", text: "\"Alışırsınız, hatta ritim ilham verir belki.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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
  askingPrice: 63750000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.5, funWeight: 1, interestWeight: 1 },
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
        { id: "a", text: "\"Tabii, tüm belgeleri paylaşırım, şeffaflık önemli.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "b", text: "\"Süreç hızlanabilir, sizi bekletmem — üstüne %3 indirim de düşünürüm.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 3 } },
        { id: "c", text: "\"Bu fiyata Bebek'te başka seçenek yok, hemen karar verin.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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
  askingPrice: 12380000,
  tier: 1,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  profile: { suspicionWeight: 1.1, funWeight: 1.4, interestWeight: 1 },
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
        { id: "a", text: "\"Kesinlikle, siz bu evin ruhuna tam uyuyorsunuz — üstüne %6 indirim de yapalım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 6 } },
        { id: "b", text: "\"Felsefe güzel ama pratik detayları da düşünün.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu felsefeyi yaşamak isteyen çok kişi var, acele edin.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
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

export const houseAidatSuprizi: HouseScene = {
  id: "aidat-surprizi",
  title: "Aidat Sürprizi",
  location: "Moda, site içi",
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
      lines: [{ speaker: "customer1", name: "Derya", text: "Site çok güzelmiş, havuz da var. Aidat ne kadar?" }],
      choices: [
        { id: "a", text: "\"Aidat biraz yüksek ama karşılığını veriyor.\"", next: "start_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Açıkçası kira kadar aidat ödüyorsunuz gibi düşünebilirsiniz.\"", next: "start_b" },
        { id: "c", text: "\"Havuzun keyfinin bir bedeli var tabii.\"", next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer2", name: "Onur", text: "Karşılığını verdiğini umuyorum gerçekten." }], next: "detay" },
    start_b: { id: "start_b", lines: [{ speaker: "customer2", name: "Onur", text: "Dürüstlüğünüzü takdir ederim." }], next: "detay" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Derya", text: "(gülümser) Mantıklı bir bakış açısı." }], next: "detay" },

    detay: {
      id: "detay",
      lines: [{ speaker: "customer2", name: "Onur", text: "Tam rakam nedir peki, net bir şey söyleyin." }],
      choices: [
        { id: "a", text: "\"Tam rakamı yönetimden teyit etmemiz lazım.\"", next: "detay_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Yaklaşık rakamı faturalarla birlikte size gösterebilirim.\"", next: "detay_b" },
        { id: "c", text: "\"Rakamlar değişkenlik gösterebiliyor, esnek düşünün.\"", next: "detay_c", effects: { suspicion: 20 } },
      ],
    },
    detay_a: { id: "detay_a", lines: [{ speaker: "customer2", name: "Onur", text: "Teyit etmeden ilerlemek istemem açıkçası." }], next: "karsilik" },
    detay_b: { id: "detay_b", lines: [{ speaker: "customer1", name: "Derya", text: "Faturaları görmek işimize yarar, teşekkürler." }], next: "karsilik" },
    detay_c: { id: "detay_c", lines: [{ speaker: "customer2", name: "Onur", text: "Esneklik bütçemde pek yok maalesef." }], next: "karsilik" },

    karsilik: {
      id: "karsilik",
      lines: [{ speaker: "customer1", name: "Derya", text: "Bu parayı öderken tam olarak neye ödüyoruz?" }],
      choices: [
        { id: "a", text: "\"Havuz, güvenlik, peyzaj, sosyal alanlar, hepsi dahil.\"", next: "karsilik_a" },
        { id: "b", text: "\"Açıkçası bazı hizmetler kullanılmasa da ödeniyor.\"", next: "karsilik_b", effects: { suspicion: 10 } },
        { id: "c", text: "\"Statü de bir hizmettir bir bakıma.\"", next: "karsilik_c", effects: { fun: 20 } },
      ],
    },
    karsilik_a: { id: "karsilik_a", lines: [{ speaker: "customer1", name: "Derya", text: "Bu liste iyi görünüyor aslında." }], next: "kapanis" },
    karsilik_b: { id: "karsilik_b", lines: [{ speaker: "customer2", name: "Onur", text: "Kullanmadığımız için ödemek can sıkıcı." }], next: "kapanis" },
    karsilik_c: { id: "karsilik_c", lines: [{ speaker: "customer1", name: "Derya", text: "(güler) Statü faturası, ilginç bir kavram." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer2", name: "Onur", text: "(Derya'ya bakar) Bütçemize göre biraz zorlar sanki bu." }],
      choices: [
        { id: "a", text: "\"Yönetimle konuşup fiyatta da bir esneklik olur mu bakarım, %5 indirim düşünürüm.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "b", text: "\"Bu site bu fiyata nadir bulunur, düşünmeyin.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
        { id: "c", text: "\"Uzun vadede değer kazanır, iyi bir yatırım.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Derya", text: "İndirimle birlikte bütçemize uyar, alalım o zaman." },
        { speaker: "customer2", name: "Onur", text: "Tamam, yönetimle görüşmeleri bekliyoruz." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Derya", text: "Yatırım olarak mantıklı, biraz daha düşünelim." },
        { speaker: "emlah", text: "Tabii, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer2", name: "Onur", text: "Bu baskı bizi rahatsız etti açıkçası." },
        { speaker: "customer1", name: "Derya", text: "Başka seçeneklere de bakacağız." },
      ],
      end: "lost",
    },
  },
};

export const houseEskiFirin: HouseScene = {
  id: "eski-firin",
  title: "Eski Fırın Dairesi",
  location: "Balat, fırının üstü",
  customerNames: ["Melis"],
  background: "placeholder-house-12",
  askingPrice: 17250000,
  tier: 2,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Melis", text: "(içeri girer girmez) Bu koku... taze ekmek gibi bir şey mi bu?" }],
      choices: [
        { id: "a", text: "\"Evet, alt kat eskiden fırınmış, kokusu hâlâ duvarlarda.\"", next: "start_a" },
        { id: "b", text: "\"Fark ettiniz mi? Binanın imzası bu.\"", next: "start_b", effects: { fun: 15 } },
        { id: "c", text: "\"Sadece hayal gücünüz olabilir.\"", next: "start_c", effects: { suspicion: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Melis", text: "Ne güzel bir hikaye, bayıldım." }], next: "detay" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Melis", text: "(gülümser) İmza kelimesini sevdim." }], next: "detay" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Melis", text: "Hayal gücüm bu kadar güçlü değil sanırım." }], next: "detay" },

    detay: {
      id: "detay",
      lines: [{ speaker: "customer1", name: "Melis", text: "Fırın hâlâ çalışıyor mu, yoksa kapandı mı?" }],
      choices: [
        { id: "a", text: "\"Kapandı ama koku bir tür anı gibi kalmış.\"", next: "detay_a" },
        { id: "b", text: "\"Bazen geceleri hâlâ çalıştığına dair söylentiler var.\"", next: "detay_b", effects: { fun: 20 } },
        { id: "c", text: "\"Emin değilim açıkçası, sorup öğrenebilirim.\"", next: "detay_c", effects: { suspicion: 5 } },
      ],
    },
    detay_a: { id: "detay_a", lines: [{ speaker: "customer1", name: "Melis", text: "Anı kokusu... çok hoş bir fikir." }], next: "meslek" },
    detay_b: { id: "detay_b", lines: [{ speaker: "customer1", name: "Melis", text: "(gözleri parlar) Gece fırını mı, çok ilginç." }], next: "meslek" },
    detay_c: { id: "detay_c", lines: [{ speaker: "customer1", name: "Melis", text: "Sorup öğrenirseniz sevinirim." }], next: "meslek" },

    meslek: {
      id: "meslek",
      lines: [{ speaker: "customer1", name: "Melis", text: "Ben şefim, bu koku benim için bir artı mı eksi mi sizce?" }],
      choices: [
        { id: "a", text: "\"Kesinlikle artı, sizin gibi biri için ilham kaynağı.\"", next: "meslek_a", effects: { fun: 15 } },
        { id: "b", text: "\"Kişisel tercihe kalmış, herkes sevmeyebilir.\"", next: "meslek_b" },
        { id: "c", text: "\"Belki de bu ev sizi çağırıyordur.\"", next: "meslek_c", effects: { fun: 20, suspicion: 10 } },
      ],
    },
    meslek_a: { id: "meslek_a", lines: [{ speaker: "customer1", name: "Melis", text: "İlham kaynağı derken haklısınız galiba." }], next: "kapanis" },
    meslek_b: { id: "meslek_b", lines: [{ speaker: "customer1", name: "Melis", text: "Ben severim açıkçası, tercih meselesi doğru." }], next: "kapanis" },
    meslek_c: { id: "meslek_c", lines: [{ speaker: "customer1", name: "Melis", text: "(gülümser) Beni çağırıyor olabilir gerçekten." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Melis", text: "Açıkçası bu koku beni hiç rahatsız etmedi, tam tersine..." }],
      choices: [
        { id: "a", text: "\"O zaman bu ev tam size göre yapılmış — üstüne %5 indirim de yapalım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "b", text: "\"Birkaç gün daha düşünüp karar verin isterseniz.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Böyle bir yeri kaçırmayın, nadir bulunur.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Melis", text: "Haklısınız, bu ev bana sesleniyor. Alıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun, mutfağınız burada efsane olur." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Melis", text: "İyi fikir, birkaç gün düşüneyim." },
        { speaker: "emlah", text: "Tabii, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Melis", text: "Bu baskıyı sevmedim açıkçası." },
        { speaker: "customer1", name: "Melis", text: "Biraz daha düşüneceğim." },
      ],
      end: "lost",
    },
  },
};

export const houseManzaraOmurluk: HouseScene = {
  id: "manzara-omurluk",
  title: "Manzara Ömürlük Değil",
  location: "Ataşehir, yüksek kat",
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
      lines: [{ speaker: "customer1", name: "Kerem Bey", text: "Bu manzara için buradayım zaten, her şey ikinci planda." }],
      choices: [
        { id: "a", text: "\"Manzara gerçekten muhteşem, haklısınız.\"", next: "start_a", effects: { fun: 10 } },
        { id: "b", text: "\"Manzara güzel ama uzun vadeyi de konuşalım isterseniz.\"", next: "start_b" },
        { id: "c", text: "\"Manzara paha biçilemez, doğru kararı veriyorsunuz.\"", next: "start_c", effects: { suspicion: 10 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Kerem Bey", text: "Değil mi? Tam aradığım gibi." }], next: "ufuk" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Kerem Bey", text: "Uzun vade mi... dinliyorum." }], next: "ufuk" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Kerem Bey", text: "(gülümser) İşte bunu duymak istiyordum." }], next: "ufuk" },

    ufuk: {
      id: "ufuk",
      lines: [{ speaker: "customer1", name: "Kerem Bey", text: "(uzağı işaret eder) Şu küçük vinç de nedir orada?" }],
      choices: [
        { id: "a", text: "\"Önemsiz bir şey, dikkate almayın.\"", next: "ufuk_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Açıkçası orada yeni bir proje başlıyor, ileride manzarayı etkileyebilir.\"", next: "ufuk_b" },
        { id: "c", text: "\"O da manzaraya dinamizm katıyor bence.\"", next: "ufuk_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    ufuk_a: { id: "ufuk_a", lines: [{ speaker: "customer1", name: "Kerem Bey", text: "Umarım gerçekten önemsizdir." }], next: "sure" },
    ufuk_b: { id: "ufuk_b", lines: [{ speaker: "customer1", name: "Kerem Bey", text: "Bunu bilmem iyi oldu, teşekkürler." }], next: "sure" },
    ufuk_c: { id: "ufuk_c", lines: [{ speaker: "customer1", name: "Kerem Bey", text: "(güler) İlginç bir bakış açısı." }], next: "sure" },

    sure: {
      id: "sure",
      lines: [{ speaker: "customer1", name: "Kerem Bey", text: "Etkilerse ne kadar sürede olur bu?" }],
      choices: [
        { id: "a", text: "\"Yıllar sürer muhtemelen, çok düşünmeyin.\"", next: "sure_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"İnşaat ruhsatlarına göre 2-3 yıl içinde olabilir.\"", next: "sure_b" },
        { id: "c", text: "\"Kim bilir, belki hiç bitmez o proje.\"", next: "sure_c", effects: { fun: 20 } },
      ],
    },
    sure_a: { id: "sure_a", lines: [{ speaker: "customer1", name: "Kerem Bey", text: "Yıllar sürerse sorun etmem açıkçası." }], next: "kapanis" },
    sure_b: { id: "sure_b", lines: [{ speaker: "customer1", name: "Kerem Bey", text: "2-3 yıl... bunu göz önünde bulunduracağım." }], next: "kapanis" },
    sure_c: { id: "sure_c", lines: [{ speaker: "customer1", name: "Kerem Bey", text: "(güler) İstanbul'da hiç bitmeyen inşaat, klasik." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Kerem Bey", text: "Ben yine de bu manzarayı şimdi yaşamak istiyorum." }],
      choices: [
        { id: "a", text: "\"O zaman kararınız doğru — üstüne %3 indirim de ekleyelim.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 3 } },
        { id: "b", text: "\"Uzun vadeli düşünmenizi öneririm yine de.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu kat bu fiyata bir daha çıkmaz piyasaya.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Kerem Bey", text: "İndirim de iyi oldu, anlaştık, alıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun, manzaranın keyfini çıkarın." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Kerem Bey", text: "Haklısınız, biraz daha düşüneyim." },
        { speaker: "emlah", text: "Elbette, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Kerem Bey", text: "Bu baskı taktiği bende tam tersi etki yaptı." },
        { speaker: "customer1", name: "Kerem Bey", text: "Başka seçeneklere bakacağım." },
      ],
      end: "lost",
    },
  },
};

export const houseGeceKlubu: HouseScene = {
  id: "gece-klubu",
  title: "Gece Kulübü Komşuluğu",
  location: "Taksim, ana cadde üstü",
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
      lines: [{ speaker: "customer1", name: "Aslı", text: "Taksim'in tam göbeği, tam istediğim gibi! Gece hayatı nasıl?" }],
      choices: [
        { id: "a", text: "\"Kapınızın önünde diyebiliriz.\"", next: "start_a", effects: { fun: 15 } },
        { id: "b", text: "\"Çok hareketli ama biraz da gürültülü olabilir.\"", next: "start_b" },
        { id: "c", text: "\"Hiç durmuyor burası, tam sizlik.\"", next: "start_c", effects: { fun: 20 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Aslı", text: "(heyecanla) Kapımın önünde mi, harika!" }], next: "ses" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Aslı", text: "Gürültü beni pek rahatsız etmez açıkçası." }], next: "ses" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Aslı", text: "(gülümser) Tam da böylesini arıyordum." }], next: "ses" },

    ses: {
      id: "ses",
      lines: [{ speaker: "customer1", name: "Aslı", text: "Peki uyku düzenim için sorun olur mu bu?" }],
      choices: [
        { id: "a", text: "\"Kulaklıkla uyursunuz, alışırsınız.\"", next: "ses_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Hafta sonları biraz zor olabilir açıkçası.\"", next: "ses_b" },
        { id: "c", text: "\"Zaten dışarıda olursunuz, kim uyur ki.\"", next: "ses_c", effects: { fun: 20, suspicion: 10 } },
      ],
    },
    ses_a: { id: "ses_a", lines: [{ speaker: "customer1", name: "Aslı", text: "Kulaklık fikri işe yarayabilir." }], next: "guvenlik" },
    ses_b: { id: "ses_b", lines: [{ speaker: "customer1", name: "Aslı", text: "Hafta sonu zaten dışarıdayım, sorun değil." }], next: "guvenlik" },
    ses_c: { id: "ses_c", lines: [{ speaker: "customer1", name: "Aslı", text: "(kahkaha atar) Bu doğru, kim uyur ki." }], next: "guvenlik" },

    guvenlik: {
      id: "guvenlik",
      lines: [{ speaker: "customer1", name: "Aslı", text: "Gece eve dönerken güvenli mi burası?" }],
      choices: [
        { id: "a", text: "\"Kesinlikle güvenli, kalabalık her zaman iyidir.\"", next: "guvenlik_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Kalabalık var ama dikkatli olmakta fayda var.\"", next: "guvenlik_b" },
        { id: "c", text: "\"Taksim hiç uyumaz, siz de uyumazsınız.\"", next: "guvenlik_c", effects: { fun: 15 } },
      ],
    },
    guvenlik_a: { id: "guvenlik_a", lines: [{ speaker: "customer1", name: "Aslı", text: "Güvenli olması önemli benim için." }], next: "kapanis" },
    guvenlik_b: { id: "guvenlik_b", lines: [{ speaker: "customer1", name: "Aslı", text: "Dikkatli olurum zaten, sorun değil." }], next: "kapanis" },
    guvenlik_c: { id: "guvenlik_c", lines: [{ speaker: "customer1", name: "Aslı", text: "(güler) Bu sloganı seviyorum." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Aslı", text: "Bence burası tam bana göre, enerjisi çok iyi." }],
      choices: [
        { id: "a", text: "\"Enerjinize gerçekten uygun bir yer — üstüne %4 indirim de yapalım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: "\"Bir gece deneyip öyle karar vermenizi öneririm.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu konumda ev nadir çıkıyor, kaçırmayın.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Aslı", text: "İndirimle birlikte tam kararımı verdim, alıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun, Taksim'in kalbinde iyi eğlenceler." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Aslı", text: "İyi fikir, bir gece deneyeyim önce." },
        { speaker: "emlah", text: "Akıllıca, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Aslı", text: "Bu baskı hoşuma gitmedi açıkçası." },
        { speaker: "customer1", name: "Aslı", text: "Biraz daha bakınacağım." },
      ],
      end: "lost",
    },
  },
};

export const houseGuvercin: HouseScene = {
  id: "guvercin",
  title: "Güvercin Krallığı",
  location: "Cihangir, çatı katı",
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
      lines: [{ speaker: "customer1", name: "Feridun Bey", text: "Çatı katı her zaman hayalimdi. Şu ses de ne, güvercin mi?" }],
      choices: [
        { id: "a", text: "\"Evet, teras onların da evi olmuş biraz.\"", next: "start_a", effects: { fun: 10 } },
        { id: "b", text: "\"Birkaç güvercin var, önlem alınabilir.\"", next: "start_b" },
        { id: "c", text: "\"Doğayla iç içe bir yaşam sunuyor bu ev.\"", next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Feridun Bey", text: "(gülümser) Paylaşımcı bir ev demek." }], next: "teras" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Feridun Bey", text: "Önlem varsa iyi, merak etmiştim." }], next: "teras" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Feridun Bey", text: "Bu cümleyi çok sevdim doğrusu." }], next: "teras" },

    teras: {
      id: "teras",
      lines: [{ speaker: "customer1", name: "Feridun Bey", text: "(terasa çıkar) Vay be, gerçekten çok kalabalıklarmış." }],
      choices: [
        { id: "a", text: "\"Siz de doğa seviyorsunuz, tam bir uyum olur.\"", next: "teras_a", effects: { fun: 15, suspicion: 5 } },
        { id: "b", text: "\"Ağ veya çıngıraklı sistemlerle azaltılabilir bu sayı.\"", next: "teras_b" },
        { id: "c", text: "\"Belki de sizi bekliyorlardı.\"", next: "teras_c", effects: { fun: 20 } },
      ],
    },
    teras_a: { id: "teras_a", lines: [{ speaker: "customer1", name: "Feridun Bey", text: "Uyum kelimesi tam yerinde." }], next: "temizlik" },
    teras_b: { id: "teras_b", lines: [{ speaker: "customer1", name: "Feridun Bey", text: "Sistemler işe yarar mı gerçekten?" }], next: "temizlik" },
    teras_c: { id: "teras_c", lines: [{ speaker: "customer1", name: "Feridun Bey", text: "(güler) Beni bekliyorlarsa memnun olurum." }], next: "temizlik" },

    temizlik: {
      id: "temizlik",
      lines: [{ speaker: "customer1", name: "Feridun Bey", text: "Peki temizlik konusu nasıl, sorun çıkarır mı?" }],
      choices: [
        { id: "a", text: "\"Düzenli temizlikle hiç sorun olmaz.\"", next: "temizlik_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Açıkçası biraz emek ister ama hallolur.\"", next: "temizlik_b" },
        { id: "c", text: "\"Kuş pisliği bereket getirir derler eskiler.\"", next: "temizlik_c", effects: { fun: 20, suspicion: 15 } },
      ],
    },
    temizlik_a: { id: "temizlik_a", lines: [{ speaker: "customer1", name: "Feridun Bey", text: "Düzenli olursam sorun kalmaz sanırım." }], next: "kapanis" },
    temizlik_b: { id: "temizlik_b", lines: [{ speaker: "customer1", name: "Feridun Bey", text: "Emek vermeye hazırım açıkçası." }], next: "kapanis" },
    temizlik_c: { id: "temizlik_c", lines: [{ speaker: "customer1", name: "Feridun Bey", text: "(kahkaha atar) Eski sözleri severim." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Feridun Bey", text: "Ben bu güvercinlerle iyi anlaşırım galiba, emekliliğe uygun." }],
      choices: [
        { id: "a", text: "\"Kesinlikle, huzurlu bir emeklilik sizi bekliyor — üstüne %5 indirim de yapalım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 5 } },
        { id: "b", text: "\"Terası kontrol altına alıp sonra taşınmanızı öneririm.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu manzara ve terasla bir daha bulamazsınız.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Feridun Bey", text: "İndirim de güzel oldu, kararımı verdim, alıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun, huzurlu bir emeklilik dilerim." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Feridun Bey", text: "Mantıklı, önce terasla ilgilenelim." },
        { speaker: "emlah", text: "Elbette, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Feridun Bey", text: "Bu acele hoşuma gitmedi doğrusu." },
        { speaker: "customer1", name: "Feridun Bey", text: "Biraz daha düşüneceğim." },
      ],
      end: "lost",
    },
  },
};

export const houseKaptanRutubet: HouseScene = {
  id: "kaptan-rutubet",
  title: "Kaptan'ın Rutubeti",
  location: "Moda sahili, zemin kat",
  customerNames: ["Kaptan Yusuf"],
  background: "placeholder-house-16",
  askingPrice: 21000000,
  tier: 3,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "Dalgaları duyabiliyorum resmen. Tam bana göre burası." }],
      choices: [
        { id: "a", text: "\"Deniz kenarında olmanın avantajı bu işte.\"", next: "start_a", effects: { fun: 10 } },
        { id: "b", text: "\"Deniz yakınlığının küçük bir bedeli de var açıkçası.\"", next: "start_b" },
        { id: "c", text: "\"Bir kaptan için biçilmiş kaftan.\"", next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "Kesinlikle, bir denizci için paha biçilmez." }], next: "duvar" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "Bedel derken neyi kastediyorsunuz?" }], next: "duvar" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "(gülümser) Doğru laf ettiniz." }], next: "duvar" },

    duvar: {
      id: "duvar",
      lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "(duvara dokunur) Bu tuz lekeleri mi, yoksa nem mi?" }],
      choices: [
        { id: "a", text: "\"Deniz tuzu, biraz karakteristik bir görünüm veriyor.\"", next: "duvar_a", effects: { fun: 15, suspicion: 10 } },
        { id: "b", text: "\"Rutubet aslında, deniz yakınlığından kaynaklanıyor.\"", next: "duvar_b" },
        { id: "c", text: "\"Gemilerdeki paslanma gibi düşünün, doğal bir süreç.\"", next: "duvar_c", effects: { suspicion: 15 } },
      ],
    },
    duvar_a: { id: "duvar_a", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "Karakteristik dediğiniz doğru olabilir." }], next: "cozum" },
    duvar_b: { id: "duvar_b", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "Rutubet demek, tahmin etmiştim." }], next: "cozum" },
    duvar_c: { id: "duvar_c", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "(güler) Paslanma benzetmesi hoşuma gitti." }], next: "cozum" },

    cozum: {
      id: "cozum",
      lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "Bir denizci olarak nem beni korkutmaz ama çözümü var mı?" }],
      choices: [
        { id: "a", text: "\"Yalıtımla büyük ölçüde önlenebilir.\"", next: "cozum_a" },
        { id: "b", text: "\"Açıkçası deniz kenarında bu hep bir parça olacak.\"", next: "cozum_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Bir kaptan rutubetten korkar mı hiç?\"", next: "cozum_c", effects: { fun: 20 } },
      ],
    },
    cozum_a: { id: "cozum_a", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "Yalıtım fikri işime gelir." }], next: "surpriz" },
    cozum_b: { id: "cozum_b", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "Zaten bekliyordum bu cevabı." }], next: "surpriz" },
    cozum_c: { id: "cozum_c", lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "(kahkaha atar) Haklısınız, korkmam ben!" }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", name: "Kaptan Yusuf", text: "(tam o sırada tavandan bir damla düşer, tam şapkasının üstüne) Vay canına." },
        { speaker: "emlah", text: "(hızla) O da... deniz esintisinin bir hediyesi sayılır." },
        { speaker: "customer1", name: "Kaptan Yusuf", text: "(gülmeye başlar) Denizde daha kötüsünü gördüm ben, sorun değil." },
      ],
      next: "kapanis",
    },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Kaptan Yusuf", text: "Ben bu evle deniz arasında bir bağ hissediyorum." }],
      choices: [
        { id: "a", text: "\"O bağ çok değerli — üstüne %4 indirim de ekleyelim.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: "\"Yalıtım yaptırıp öyle taşınmanızı öneririm.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu sahil şeridinde böyle fırsat az bulunur.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Kaptan Yusuf", text: "İndirim de iyi oldu, bu bağı koparmak istemem, alıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun Kaptan, rüzgar arkanızdan essin." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Kaptan Yusuf", text: "Mantıklı, önce yalıtımı konuşalım." },
        { speaker: "emlah", text: "Elbette, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Kaptan Yusuf", text: "Bir kaptan baskıyla yönetilmez." },
        { speaker: "customer1", name: "Kaptan Yusuf", text: "Başka limanlara bakacağım." },
      ],
      end: "lost",
    },
  },
};

export const houseMirasKavgasi: HouseScene = {
  id: "miras-kavgasi",
  title: "Miras Kavgası Evi",
  location: "Fatih, tarihi bina",
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
      lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Ben avukatım, önce belgeleri konuşalım isterseniz." }],
      choices: [
        { id: "a", text: "\"Tabii, belgeler gayet düzenli, merak etmeyin.\"", next: "start_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Açıkçası mirasçılar arasında hâlâ bir anlaşmazlık var.\"", next: "start_b" },
        { id: "c", text: "\"Belgeler formalite, esas önemli olan evin ruhu.\"", next: "start_c", effects: { suspicion: 20 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Düzenliyse görmek isterim tabii." }], next: "mirasci" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Anlaşmazlık mı, bunu detaylandırın lütfen." }], next: "mirasci" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "(kaşlarını çatar) Ben ruhla ilgilenmiyorum, belgeyle ilgileniyorum." }], next: "mirasci" },

    mirasci: {
      id: "mirasci",
      lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Kaç mirasçı var ve hepsi satışa razı mı?" }],
      choices: [
        { id: "a", text: "\"Üç kardeş var, hepsi de anlaştı zaten.\"", next: "mirasci_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"İkisi anlaştı, biriyle hâlâ görüşülüyor açıkçası.\"", next: "mirasci_b" },
        { id: "c", text: "\"Aile meseleleri her zaman biraz karmaşıktır.\"", next: "mirasci_c", effects: { suspicion: 10 } },
      ],
    },
    mirasci_a: { id: "mirasci_a", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Hepsi anlaştıysa yazılı teyidini isterim." }], next: "risk" },
    mirasci_b: { id: "mirasci_b", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Görüşme sonucunu bekleyelim o zaman." }], next: "risk" },
    mirasci_c: { id: "mirasci_c", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Karmaşıklık benim işim zaten." }], next: "risk" },

    risk: {
      id: "risk",
      lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Ben bu süreçte dava riskiyle karşılaşır mıyım?" }],
      choices: [
        { id: "a", text: "\"Hayır, kesinlikle risk yok.\"", next: "risk_a", effects: { suspicion: 25 } },
        { id: "b", text: "\"Küçük bir risk var, avukatınızla süreci netleştirmenizi öneririm.\"", next: "risk_b" },
        { id: "c", text: "\"Hayatta risksiz hiçbir şey yoktur.\"", next: "risk_c", effects: { fun: 10, suspicion: 15 } },
      ],
    },
    risk_a: { id: "risk_a", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "\"Kesinlikle\" kelimesine hiç güvenmem açıkçası." }], next: "kapanis" },
    risk_b: { id: "risk_b", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Bu netleştirme işini severim." }], next: "kapanis" },
    risk_c: { id: "risk_c", lines: [{ speaker: "customer1", name: "Pınar Hanım", text: "Felsefi ama beni ikna etmedi." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [
        { speaker: "customer1", name: "Pınar Hanım", text: "Son bir şey — kardeşlerden biri satıştan vazgeçmemi istiyor, biri de bir an önce bitsin istiyor." },
        { speaker: "customer1", name: "Pınar Hanım", text: "Siz olsanız hangi tarafı haklı bulurdunuz?" },
      ],
      choices: [
        { id: "a", text: "\"İkisini de kırmadan, şeffaf ilerleyen taraf haklı — belgeleri paylaşırım, süreç hızlanırsa %3 indirim de düşünürüm.\"", next: "closing_sold", effects: { closingBias: 35, discountPercent: 3 } },
        { id: "b", text: "\"Bu tarihi doku bu fiyata bir daha çıkmaz, uzatmadan bitirmeniz sizin yararınıza.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: "\"Bu aile içi bir karar, ben sadece süreç hızlıca netleşecek diyebilirim.\"", next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Pınar Hanım", text: "Taraf tutmamanız ve şeffaflığınız ikna edici oldu, anlaştık." },
        { speaker: "emlah", text: "Hayırlı olsun, belgeleri hemen hazırlatırım." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Pınar Hanım", text: "Kardeşlerimle önce ben konuşayım, sizi sonra ararım." },
        { speaker: "emlah", text: "Anlıyorum, avukatınızla konuşun önce." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Pınar Hanım", text: "Bir tarafı diğerine karşı aceleye getirmeye çalıştığınızı fark ettim." },
        { speaker: "customer1", name: "Pınar Hanım", text: "Bu baskı taktiği benim mesleğimde işe yaramaz, başka seçeneklere bakacağım." },
      ],
      end: "lost",
    },
  },
};

export const houseOgrenciEvi: HouseScene = {
  id: "ogrenci-evi",
  title: "Öğrenci Evi Kalıntısı",
  location: "Levent, eski öğrenci evi",
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
        { speaker: "customer1", name: "Ayten Hanım", text: "(duvara bakar) Bu yazılar da ne böyle, silinir mi bunlar?" },
        { speaker: "customer2", name: "Ozan", text: "Anne bence havalı duruyor bu şekilde." },
      ],
      choices: [
        { id: "a", text: "\"Bir kat boyayla kolayca kapanır, sorun değil.\"", next: "start_a" },
        { id: "b", text: "\"Aslında bu evin bir tarihi var, korunabilir de.\"", next: "start_b", effects: { fun: 15 } },
        { id: "c", text: "\"Öğrenci enerjisi hâlâ duvarlardan hissediliyor.\"", next: "start_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: "İyi, boyayla hallederiz o zaman." }], next: "temizlik" },
    start_b: { id: "start_b", lines: [{ speaker: "customer2", name: "Ozan", text: "(heyecanla) Korunsun anne, lütfen!" }], next: "temizlik" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: "Enerji mi... temizlik daha önemli bence." }], next: "temizlik" },

    temizlik: {
      id: "temizlik",
      lines: [{ speaker: "customer1", name: "Ayten Hanım", text: "Peki bu koku, enerji içeceği kokusu mu bu?" }],
      choices: [
        { id: "a", text: "\"Derin temizlikle tamamen geçer, garanti.\"", next: "temizlik_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Biraz havalandırma ve temizlikle azalır.\"", next: "temizlik_b" },
        { id: "c", text: "\"Gençlik kokusu diyelim buna.\"", next: "temizlik_c", effects: { fun: 15 } },
      ],
    },
    temizlik_a: { id: "temizlik_a", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: "Garanti ediyorsanız güzel." }], next: "ozan_soru" },
    temizlik_b: { id: "temizlik_b", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: "Mantıklı, biraz zaman alır demek." }], next: "ozan_soru" },
    temizlik_c: { id: "temizlik_c", lines: [{ speaker: "customer2", name: "Ozan", text: "(güler) Gençlik kokusu, bunu beğendim." }], next: "ozan_soru" },

    ozan_soru: {
      id: "ozan_soru",
      lines: [{ speaker: "customer2", name: "Ozan", text: "Bence burası zaten harika, neden değiştirelim ki her şeyi anne?" }],
      choices: [
        { id: "a", text: "\"Ozan haklı, karakterini korumak güzel olabilir.\"", next: "ozan_a", effects: { fun: 15 } },
        { id: "b", text: "\"Biraz düzenleme herkesin işine yarar aslında.\"", next: "ozan_b" },
        { id: "c", text: "\"İkinizin de haklı olduğu noktalar var.\"", next: "ozan_c", effects: { suspicion: 5 } },
      ],
    },
    ozan_a: { id: "ozan_a", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: "(kaşlarını çatar) Siz de mi Ozan'ın tarafındasınız?" }], next: "kapanis" },
    ozan_b: { id: "ozan_b", lines: [{ speaker: "customer2", name: "Ozan", text: "(hayal kırıklığı) Herkes anneme katılıyor tabii." }], next: "kapanis" },
    ozan_c: { id: "ozan_c", lines: [{ speaker: "customer1", name: "Ayten Hanım", text: "Diplomatik bir cevap, teşekkürler." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [
        { speaker: "customer1", name: "Ayten Hanım", text: "Ozan, sen burada mutlu olur musun gerçekten?" },
        { speaker: "customer2", name: "Ozan", text: "Kesinlikle anne, tam bana göre." },
      ],
      choices: [
        { id: "a", text: "\"Görüyorsunuz, oğlunuz zaten karar vermiş — üstüne %4 indirim de yapalım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: "\"Bir hafta düşünüp öyle karar vermenizi öneririm.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu fiyata bu konumda başka seçenek bulamazsınız.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Ayten Hanım", text: "İndirim de olunca, tamam, alalım Ozan." },
        { speaker: "customer2", name: "Ozan", text: "(sevinir) Teşekkürler anne!" },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Ayten Hanım", text: "İyi fikir, bir hafta düşünelim." },
        { speaker: "customer2", name: "Ozan", text: "Tamam anne, umarım evet dersin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Ayten Hanım", text: "Bu acele bize hiç uymuyor." },
        { speaker: "customer2", name: "Ozan", text: "Anne haklı, başka yerlere de bakalım." },
      ],
      end: "lost",
    },
  },
};

export const houseKapiciHayvan: HouseScene = {
  id: "kapici-hayvan",
  title: "Kapıcının Hayvan Şubesi",
  location: "Kadıköy, 1. kat",
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
      lines: [{ speaker: "customer1", name: "Zeynep", text: "(hapşırır) Pardon, alerjim var da, burada hayvan var mı?" }],
      choices: [
        { id: "a", text: "\"Hayır, hiç hayvan yok, merak etmeyin.\"", next: "start_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Açıkçası kapıcı bodrumda birkaç sokak hayvanına bakıyor.\"", next: "start_b" },
        { id: "c", text: "\"Sadece bina dışında, içeriyi etkilemez.\"", next: "start_c", effects: { suspicion: 10 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Zeynep", text: "Umarım gerçekten yoktur, alerjim ciddi." }], next: "mesafe" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Zeynep", text: "Bodrumda mı... bu beni endişelendiriyor." }], next: "mesafe" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Zeynep", text: "Etkilemediğinden emin misiniz?" }], next: "mesafe" },

    mesafe: {
      id: "mesafe",
      lines: [{ speaker: "customer1", name: "Zeynep", text: "Bodrum buraya ne kadar yakın, kokusu ya da tüyleri gelir mi?" }],
      choices: [
        { id: "a", text: "\"Hiç gelmez, tamamen ayrı bir alan.\"", next: "mesafe_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Bazen hafif gelebilir, pencereleri kapalı tutmanız iyi olur.\"", next: "mesafe_b" },
        { id: "c", text: "\"Belki biraz alışkanlık meselesidir.\"", next: "mesafe_c", effects: { suspicion: 10 } },
      ],
    },
    mesafe_a: { id: "mesafe_a", lines: [{ speaker: "customer1", name: "Zeynep", text: "Umarım öyledir gerçekten." }], next: "kapici" },
    mesafe_b: { id: "mesafe_b", lines: [{ speaker: "customer1", name: "Zeynep", text: "Pencere kapalı tutmak mantıklı bir öneri." }], next: "kapici" },
    mesafe_c: { id: "mesafe_c", lines: [{ speaker: "customer1", name: "Zeynep", text: "Alerji alışkanlıkla geçmez maalesef." }], next: "kapici" },

    kapici: {
      id: "kapici",
      lines: [{ speaker: "customer1", name: "Zeynep", text: "Kapıcıyla konuşup bunu azaltması mümkün mü?" }],
      choices: [
        { id: "a", text: "\"Kesinlikle, o konuda çok esnek biridir.\"", next: "kapici_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Konuşabiliriz ama kesin söz veremem.\"", next: "kapici_b" },
        { id: "c", text: "\"O hayvanları kendi çocuğu gibi seviyor açıkçası, zor olabilir.\"", next: "kapici_c", effects: { fun: 15 } },
      ],
    },
    kapici_a: { id: "kapici_a", lines: [{ speaker: "customer1", name: "Zeynep", text: "Esnekse belki bir çözüm buluruz." }], next: "kapanis" },
    kapici_b: { id: "kapici_b", lines: [{ speaker: "customer1", name: "Zeynep", text: "Dürüstlüğünüzü takdir ederim." }], next: "kapanis" },
    kapici_c: { id: "kapici_c", lines: [{ speaker: "customer1", name: "Zeynep", text: "(gülümser) Sevimli ama benim için zor bir durum." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Zeynep", text: "Alerjim ciddi, bu konuda net bir cevaba ihtiyacım var." }],
      choices: [
        { id: "a", text: "\"Kapıcıyla konuşup düzenlemeyi hemen ayarlarım — üstüne %4 indirim de yaparım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 4 } },
        { id: "b", text: "\"Dürüst olmak gerekirse, bu ev sizin için riskli olabilir.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Merak etmeyin, hiç sorun yaşamazsınız.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Zeynep", text: "Düzenleme ve indirimle birlikte içim rahat etti, alıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun, kapıcıyla hemen konuşurum." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Zeynep", text: "Dürüstlüğünüzü takdir ediyorum, biraz düşüneyim." },
        { speaker: "emlah", text: "Sağlığınız önemli, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Zeynep", text: "\"Hiç sorun yaşamazsınız\" cümlesi beni ikna etmedi." },
        { speaker: "customer1", name: "Zeynep", text: "Başka seçeneklere bakacağım." },
      ],
      end: "lost",
    },
  },
};

export const houseZeminVitrin: HouseScene = {
  id: "zemin-vitrin",
  title: "Zemin Kat Vitrin",
  location: "Nişantaşı, eski dükkân",
  customerNames: ["Derin"],
  background: "placeholder-house-20",
  askingPrice: 33000000,
  tier: 5,
  closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [{ speaker: "customer1", name: "Derin", text: "(pencereye bakar) Dur, bu cam hiç perde falan yok mu?" }],
      choices: [
        { id: "a", text: "\"Şu an yok ama takılabilir tabii.\"", next: "start_a" },
        { id: "b", text: "\"Doğal ışık için harika, değil mi?\"", next: "start_b", effects: { suspicion: 15 } },
        { id: "c", text: "\"Vitrin ruhu hâlâ evin karakterinde.\"", next: "start_c", effects: { fun: 15 } },
      ],
    },
    start_a: { id: "start_a", lines: [{ speaker: "customer1", name: "Derin", text: "Takılabilirse rahatladım biraz." }], next: "mahremiyet" },
    start_b: { id: "start_b", lines: [{ speaker: "customer1", name: "Derin", text: "Işık güzel ama mahremiyet daha önemli benim için." }], next: "mahremiyet" },
    start_c: { id: "start_c", lines: [{ speaker: "customer1", name: "Derin", text: "(gülümser) Vitrin ruhu ilginç bir tabir." }], next: "mahremiyet" },

    mahremiyet: {
      id: "mahremiyet",
      lines: [{ speaker: "customer1", name: "Derin", text: "Ben biraz tanınan biriyim, insanlar içeri bakar mı sizce?" }],
      choices: [
        { id: "a", text: "\"Muhtemelen bakarlar ama alışırsınız.\"", next: "mahremiyet_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Perde veya folyo ile tamamen çözülür bu.\"", next: "mahremiyet_b" },
        { id: "c", text: "\"Belki de hayranlarınızla daha yakın olursunuz.\"", next: "mahremiyet_c", effects: { fun: 20 } },
      ],
    },
    mahremiyet_a: { id: "mahremiyet_a", lines: [{ speaker: "customer1", name: "Derin", text: "Alışmak istediğim bir şey değil bu açıkçası." }], next: "guvenlik" },
    mahremiyet_b: { id: "mahremiyet_b", lines: [{ speaker: "customer1", name: "Derin", text: "Folyo fikri işime gelir." }], next: "guvenlik" },
    mahremiyet_c: { id: "mahremiyet_c", lines: [{ speaker: "customer1", name: "Derin", text: "(güler) Bu kadar yakın olmak istemem doğrusu." }], next: "guvenlik" },

    guvenlik: {
      id: "guvenlik",
      lines: [{ speaker: "customer1", name: "Derin", text: "Peki güvenlik açısından sorun olur mu, biri içeri bakabilir mi?" }],
      choices: [
        { id: "a", text: "\"Hiç sorun olmaz, merak etmeyin.\"", next: "guvenlik_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Güvenlik filmi ve kalın perdeyle ciddi oranda azaltılır.\"", next: "guvenlik_b" },
        { id: "c", text: "\"Ünlü olmanın küçük bedelleri var tabii.\"", next: "guvenlik_c", effects: { fun: 15 } },
      ],
    },
    guvenlik_a: { id: "guvenlik_a", lines: [{ speaker: "customer1", name: "Derin", text: "\"Hiç sorun olmaz\" cümlesine güvenmem açıkçası." }], next: "kapanis" },
    guvenlik_b: { id: "guvenlik_b", lines: [{ speaker: "customer1", name: "Derin", text: "Güvenlik filmi mantıklı bir çözüm." }], next: "kapanis" },
    guvenlik_c: { id: "guvenlik_c", lines: [{ speaker: "customer1", name: "Derin", text: "(gülümser) Bu bedeli zaten ödüyorum sürekli." }], next: "kapanis" },

    kapanis: {
      id: "kapanis",
      lines: [{ speaker: "customer1", name: "Derin", text: "Sosyal medyada da harika içerik çıkar buradan aslında." }],
      choices: [
        { id: "a", text: "\"Kesinlikle, hem yaşam hem içerik alanı bir arada — üstüne %3 indirim de yapalım.\"", next: "closing_sold", effects: { closingBias: 35,  discountPercent: 3 } },
        { id: "b", text: "\"Perde/folyo çözümünü halledip öyle karar verin.\"", next: "closing_thinking" , effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu vitrin konsepti bu fiyata bir daha çıkmaz.\"", next: "closing_lost", effects: { closingBias: -35,  suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", name: "Derin", text: "İndirim de güzel oldu, içerik ve ev bir arada, alıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun, takipçileriniz bayılacak." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Derin", text: "İyi fikir, önce folyo çözümünü halledeyim." },
        { speaker: "emlah", text: "Elbette, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Derin", text: "Bu baskı taktiği hoşuma gitmedi doğrusu." },
        { speaker: "customer1", name: "Derin", text: "Başka seçeneklere bakacağım." },
      ],
      end: "lost",
    },
  },
};

export const houseDisliSaatKulesi: HouseScene = {
  id: "dislisaat-kulesi",
  title: "Dişli Saat Kulesi",
  location: "Beyoğlu, dev saat kulesi içi",
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
        { speaker: "customer1", text: "(nefes nefese) Merhaba, ben {isim}. O merdiveni tırmanmak resmen spor salonu yerine geçti." },
        { speaker: "customer1", text: "Ama itiraf edeyim, dev saat kadranının içinden şehri görünce her şeye değdi." },
      ],
      choices: [
        { id: "a", text: "\"Kapıcı yerine kondüktör diyoruz burada, alışırsınız.\"", next: "enter", effects: { fun: 10 } },
        { id: "b", text: "\"Manzara gerçekten burada satışın en güçlü kartı.\"", next: "enter", effects: { interest: 10 } },
        { id: "c", text: "\"O merdiven ısınma turuydu sadece, asıl kısma daha gelmedik.\"", next: "enter", effects: { fun: 5, suspicion: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Şimdi biraz teknik bir kısım var: eve girmek için şu dönen dişlilerin arasından geçeceğiz." },
        { speaker: "customer1", text: "(gözleri büyür) Yani gerçekten dişlilerin arasından mı geçeceğiz, şaka değil?" },
        { speaker: "customer1", text: "Saatin akrep ve yelkovanı çalışırken bunu her gün yapmam mı gerekiyor?" },
      ],
      choices: [
        { id: "a", text: "\"Zamanlama meselesi sadece, ritmini yakalayınca bale gibi oluyor.\"", next: "q1_a", effects: { suspicion: 10, fun: 10 } },
        { id: "b", text: "\"Aslında dişliler yavaşladığında 40 saniyelik güvenli bir pencere açılıyor.\"", next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: "\"Komşularınız da aynı şeyi yapıyor, sosyal bir ritüel haline geldi resmen.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Bale derken... risk payını hafife almış olmayalım?" }], next: "sound" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "40 saniye, tamam bu biraz daha güven verici oldu." }], next: "sound" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Sosyal ritüel derken tam olarak kaç kişi bu işi başarabiliyor?" }], next: "sound" },

    sound: {
      id: "sound",
      lines: [
        { speaker: "customer1", text: "Bir de şu tik-tak sesi var, mekanizma hiç durmuyor galiba." },
        { speaker: "customer1", text: "Gece uyurken bu ses insanı rahatsız etmez mi?" },
      ],
      choices: [
        { id: "a", text: "\"İlk hafta duyarsınız, sonra beyniniz onu filtrelemeyi öğreniyor.\"", next: "sound_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Kulaklık öneririm açıkçası, ama saat başı çanı gerçekten muhteşem.\"", next: "sound_b", effects: { suspicion: 0, fun: 5 } },
        { id: "c", text: "\"Bazı insanlar buna beyaz gürültü diyor, uyku kalitenizi artırabilir bile.\"", next: "sound_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    sound_a: { id: "sound_a", lines: [{ speaker: "thought", text: "'Beyin filtrelemeyi öğrenir' cümlesi hiç güven verici değildi." }], next: "safety" },
    sound_b: { id: "sound_b", lines: [{ speaker: "customer1", text: "Saat başı çanı derken... her saat başı mı?" }], next: "safety" },
    sound_c: { id: "sound_c", lines: [{ speaker: "customer1", text: "(kahkaha) Beyaz gürültü, ilginç bir pazarlama açısı doğrusu." }], next: "safety" },

    safety: {
      id: "safety",
      lines: [
        { speaker: "customer1", text: "Peki ya dişlilerin arasında sıkışma riski, sigorta bu konuda ne diyor?" },
        { speaker: "customer1", text: "Yani bu ciddi bir güvenlik sorunu gibi görünüyor bana." },
      ],
      choices: [
        { id: "a", text: "\"Şimdiye kadar hiç ciddi bir vaka olmadı, gerçi kayıtlar biraz eksik.\"", next: "safety_a", effects: { suspicion: 25 } },
        { id: "b", text: "\"Acil durumlarda dişlileri durduran bir manuel kol var, gösterebilirim.\"", next: "safety_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Risk olmasa bu manzara bu fiyata olmazdı zaten.\"", next: "safety_c", effects: { suspicion: 0, fun: 10 } },
      ],
    },
    safety_a: { id: "safety_a", lines: [{ speaker: "customer1", text: "\"Kayıtlar eksik\" dediğinizi resmen not aldım." }], next: "price" },
    safety_b: { id: "safety_b", lines: [{ speaker: "customer1", text: "Manuel kol olması içimi biraz rahatlattı." }], next: "price" },
    safety_c: { id: "safety_c", lines: [{ speaker: "customer1", text: "(gülümser) Sizde bir mantık var, kabul etmeliyim." }], next: "price" },

    price: {
      id: "price",
      lines: [
        { speaker: "customer1", text: "Peki fiyatta biraz esneklik var mı, dişlilerle yaşamanın bir bedeli olmalı." },
      ],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %7 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 7 } },
        { id: "b", text: "\"Fiyat şehrin en özgün manzarasına göre zaten makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu kule bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirim güzel oldu, dişlilerle dans etmeyi öğrenirim artık." },
        { speaker: "emlah", text: "Zamanla ritmini yakalarsınız, hayırlı olsun." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Biraz daha düşüneyim, dişli mesafesini bir de gündüz görmek isterim." },
        { speaker: "emlah", text: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
        { speaker: "customer1", text: "Sanırım bu kule bana göre değil, vaktinizi aldım." },
      ],
      end: "lost",
    },
  },
};

export const houseBatakliKoyEvi: HouseScene = {
  id: "batakli-koy-evi",
  title: "Bataklı Köy Evi",
  location: "Ağva, bataklık kıyısı",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da kardeşim {isim2}. Ucuz bir yazlık arıyoruz." },
        { speaker: "customer2", text: "Fotoğraflarda ev biraz eğik duruyordu ama açı öyleydi herhalde dedik." },
      ],
      choices: [
        { id: "a", text: "\"Açı değildi ama önce içeri geçelim, anlatayım.\"", next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: "\"Doğayla iç içe bir ev arıyorsanız tam yerine geldiniz.\"", next: "enter", effects: { fun: 10 } },
        { id: "c", text: "\"Bütçenize göre nadir bulunan bir fırsat, göstereyim.\"", next: "enter", effects: { interest: 10 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Ev, Ağva'daki küçük bir bataklığın kenarında, zeminin bir kısmı üzerinde duruyor." },
        { speaker: "customer2", text: "(dengesini kaybedip tutunur) Yer gerçekten eğik, şaka değilmiş." },
        { speaker: "customer1", text: "{isim2}, bak bardaklar bile masadan kayıyor." },
      ],
      choices: [
        { id: "a", text: "\"Zeminin doğal bir eğimi var, mimari terimle buna 'karakter' diyoruz.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Temel yıllar içinde biraz batmış, düzeltme masrafı çıkarabilirim.\"", next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Bilardo masası koyarsanız hiç ıska geçmezsiniz, avantaj olarak düşünün.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: "Karakter derken, batma riskini kastetmiyorsunuzdur umarım." }], next: "sink" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Masraf çıkarmanız güven verici en azından." }], next: "sink" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(güler) {isim}, bak bu adam eğlenceliymiş." }], next: "sink" },

    sink: {
      id: "sink",
      lines: [
        { speaker: "customer1", text: "Peki bu batma dediğiniz şey ilerleyen yıllarda daha kötü olur mu?" },
        { speaker: "customer1", text: "Yani bir sabah uyanıp evin yarısını bataklıkta bulmak istemeyiz." },
      ],
      choices: [
        { id: "a", text: "\"Batma hızı yılda birkaç santim, ölçülebilir ve öngörülebilir bir süreç.\"", next: "sink_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Temel güçlendirmesi yaptırırsanız süreç büyük ölçüde durdurulabilir.\"", next: "sink_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Bataklık suyu doğal spa etkisi de yapıyor, bedava bir avantaj sayılır.\"", next: "sink_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    sink_a: { id: "sink_a", lines: [{ speaker: "customer2", text: "\"Öngörülebilir\" derken bir de takvim mi vereceksiniz?" }], next: "smell" },
    sink_b: { id: "sink_b", lines: [{ speaker: "customer1", text: "Güçlendirme fikri en azından bir çözüm sunuyor." }], next: "smell" },
    sink_c: { id: "sink_c", lines: [{ speaker: "customer2", text: "(kahkaha) {isim}, bedava spa diyor, ciddi mi bu adam?" }], next: "smell" },

    smell: {
      id: "smell",
      lines: [{ speaker: "customer1", text: "Bir de bataklık kokusu var galiba, pencereyi açtığımızda daha da artar mı?" }],
      choices: [
        { id: "a", text: "\"Rüzgar yönüne göre değişir, çoğu gün fark edilmez bile.\"", next: "smell_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Doğru, ama bahçeye dikeceğimiz bitkilerle büyük ölçüde maskelenir.\"", next: "smell_b", effects: { suspicion: 0, fun: 5 } },
        { id: "c", text: "\"O koku değil, doğanın kokusu diyelim biz buna.\"", next: "smell_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    smell_a: { id: "smell_a", lines: [{ speaker: "thought", text: "\"Çoğu gün\" ifadesi hiç iyi bir işaret değil." }], next: "price" },
    smell_b: { id: "smell_b", lines: [{ speaker: "customer2", text: "Bitkiler mantıklı bir çözüm gibi duruyor." }], next: "price" },
    smell_c: { id: "smell_c", lines: [{ speaker: "customer1", text: "(gülümser) {isim2}, adam pes etmiyor, buna saygı duyuyorum." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer2", text: "Bütçemiz zaten dar, biraz daha inebilir misiniz fiyattan?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %12 indirim sağlayabilirim, zaten bütçe evi bu.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 12 } },
        { id: "b", text: "\"Fiyat zaten bölgenin en düşüğü, ama düşünme payınız olsun.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu fiyata bataklık kenarı bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte mantıklı geldi, {isim2}'yle konuşup bugün dönüş yapalım." },
        { speaker: "emlah", text: "Hayırlı olsun, lastik bot hediyemiz olsun bu arada." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Biraz daha düşünelim, temel güçlendirme fiyatını da öğrenmemiz lazım." },
        { speaker: "emlah", text: "Elbette, elimde birkaç seçenek daha var, acele etmeyin." },
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
};

export const houseBulutKulesi: HouseScene = {
  id: "bulut-kulesi",
  title: "Bulut Kulesi",
  location: "Sultanahmet, gökdelen tepesi",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Ressamım, ışığı iyi olan bir atölye arıyorum uzun zamandır." },
        { speaker: "customer1", text: "Fotoğraflarda cam bir silindirin içinde gibiydi ev, doğru mu bu?" },
      ],
      choices: [
        { id: "a", text: "\"Aynen öyle, 360 derece cam, Ayasofya'ya kadar her şeyi görüyorsunuz.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Doğru, ama önce çıkışı biraz uzun, hazırlıklı olun.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Işık konusunda burası şehrin en iyisi diyebilirim rahatlıkla.\"", next: "enter", effects: { interest: 15 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Eve çıkmak için gökdelenin tepesine kadar uzanan bu uzun merdiveni kullanıyoruz." },
        { speaker: "customer1", text: "(aşağı bakar, geri çekilir) Asansör... yok mu gerçekten?" },
        { speaker: "customer1", text: "Yani her tuval taşımam gerektiğinde bu merdivenden mi çıkacağım?" },
      ],
      choices: [
        { id: "a", text: "\"Asansör inşası bulutlara çok yakın olduğu için teknik olarak imkansız.\"", next: "q1_a", effects: { suspicion: 10, interest: 5 } },
        { id: "b", text: "\"Yok ama makara sistemiyle büyük tuvalleri yukarı çekebiliyoruz.\"", next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: "\"Her çıkışta bacaklarınız güçlenir, kimse spor salonuna ihtiyaç duymuyor burada.\"", next: "q1_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Teknik olarak imkansız\" cümlesi beni pek rahatlatmadı." }], next: "wind" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Makara sistemi... ilginç ama en azından bir çözüm." }], next: "wind" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) Sanatçı bacakları derler buna galiba." }], next: "wind" },

    wind: {
      id: "wind",
      lines: [
        { speaker: "customer1", text: "Bu yükseklikte rüzgar da bir sorun olur muhtemelen, kule sallanıyor mu?" },
        { speaker: "customer1", text: "Tuvalim rüzgarda uçarsa kimin sorumlu olduğunu bilmek isterim." },
      ],
      choices: [
        { id: "a", text: "\"Hafif bir salınım var evet, ama çoğu sakini bunu beşik etkisi olarak seviyor.\"", next: "wind_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Cam paneller rüzgara özel tasarlandı, içeride hiç hissetmezsiniz.\"", next: "wind_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: "\"Tuvalinizi pencereye çok yakın koymamanızı öneririm sadece.\"", next: "wind_c", effects: { suspicion: 5, fun: 5 } },
      ],
    },
    wind_a: { id: "wind_a", lines: [{ speaker: "thought", text: "\"Beşik etkisi\" ifadesi hiç güven verici gelmedi." }], next: "light" },
    wind_b: { id: "wind_b", lines: [{ speaker: "customer1", text: "Bu cevap işime yaradı, teknik detay hoşuma gitti." }], next: "light" },
    wind_c: { id: "wind_c", lines: [{ speaker: "customer1", text: "(güler) Mantıklı bir tavsiye, not ediyorum." }], next: "light" },

    light: {
      id: "light",
      lines: [{ speaker: "customer1", text: "Peki gün batımında ışık nasıl oluyor, benim için en önemli kısım bu." }],
      choices: [
        { id: "a", text: "\"Öyle bir turuncu ki, bazı müşterilerimiz sadece bunun için taşındı.\"", next: "light_a", effects: { interest: 20 } },
        { id: "b", text: "\"Batıya bakan cam panel tam olarak bunun için tasarlandı.\"", next: "light_b", effects: { interest: 15 } },
        { id: "c", text: "\"Açıkçası hava durumuna göre değişiyor, garanti veremem.\"", next: "light_c", effects: { suspicion: 5, interest: 5 } },
      ],
    },
    light_a: { id: "light_a", lines: [{ speaker: "customer1", text: "(gözleri parlar) Şimdi gerçekten ilgimi çekmeye başladınız." }], next: "price" },
    light_b: { id: "light_b", lines: [{ speaker: "customer1", text: "Bu tam istediğim şey, tasarım detayına dikkat edilmiş." }], next: "price" },
    light_c: { id: "light_c", lines: [{ speaker: "customer1", text: "En azından dürüstsünüz, bunu takdir ediyorum." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyat konusunda ne kadar esnek olabiliyorsunuz peki?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %5 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 5 } },
        { id: "b", text: "\"Fiyat zaten manzaraya göre makul, düşünmenizi öneririm.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu manzara bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, atölyemi buraya taşıyorum." },
        { speaker: "emlah", text: "Harika bir seçim, gün batımlarının tadını çıkarın." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir kez daha gün batımında gelip görmek isterim, sonra karar veririm." },
        { speaker: "emlah", text: "Tabii, ne zaman isterseniz ayarlarım." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
        { speaker: "customer1", text: "Sanırım bu kule bana göre değil, vaktinizi aldım." },
      ],
      end: "lost",
    },
  },
};

export const houseKristalMagara: HouseScene = {
  id: "kristal-magara",
  title: "Kristal Mağara",
  location: "Şile yakınları, yeraltı mağarası",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Kristal koleksiyonerliğim var, ilanı görünce hemen aradım." },
        { speaker: "customer1", text: "Yer altında bir ev, hiç duymamıştım açıkçası, çok merak ettim." },
      ],
      choices: [
        { id: "a", text: "\"Doğal kristal oluşumlarıyla iç içe, sizin için biçilmiş kaftan.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Biraz sıra dışı evet, ama alışması hiç de zor değil.\"", next: "enter", effects: { fun: 5 } },
        { id: "c", text: "\"Önce içeri geçelim, kendi gözlerinizle görün.\"", next: "enter", effects: { interest: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Ev, terk edilmiş bir maden galerisinin en derin noktasında, mor kristallerle çevrili." },
        { speaker: "customer1", text: "(hayranlıkla bakar) Bu manzara... ama bir saniye, pencere göremiyorum." },
        { speaker: "customer1", text: "Gün ışığı hiç girmiyor mu buraya?" },
      ],
      choices: [
        { id: "a", text: "\"Hiç girmiyor, ama kristaller kendi ışığını üretiyor gibi, alışıyorsunuz.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Girmiyor ama tam spektrum lambalarla gün ışığı simüle ediliyor.\"", next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: "\"Güneş yanığı, D vitamini derdi falan artık geçmişte kalıyor.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Kendi ışığını üretiyor gibi\" tam olarak ne demek şimdi?" }], next: "damp" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Tam spektrum lamba fikri işime gelir aslında." }], next: "damp" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Bu satış taktiğini beğendim doğrusu." }], next: "damp" },

    damp: {
      id: "damp",
      lines: [
        { speaker: "customer1", text: "Peki nem sorunu olmuyor mu, mağara dediğinize göre epey rutubetli olmalı." },
        { speaker: "customer1", text: "Kristal koleksiyonum nemden zarar görür diye endişeleniyorum." },
      ],
      choices: [
        { id: "a", text: "\"Biraz nem var evet, ama kristalleriniz zaten burada doğdu, alışıklar.\"", next: "damp_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Nem alma sistemi kurulabilir, maliyeti çok yüksek değil.\"", next: "damp_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Nem, kristallerin parlaklığını artırıyor aslında, doğal bir cila gibi.\"", next: "damp_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    damp_a: { id: "damp_a", lines: [{ speaker: "thought", text: "\"Zaten burada doğdu\" cümlesi biraz fazla yaratıcıydı." }], next: "access" },
    damp_b: { id: "damp_b", lines: [{ speaker: "customer1", text: "Nem alma sistemi mantıklı bir çözüm, düşünürüm." }], next: "access" },
    damp_c: { id: "damp_c", lines: [{ speaker: "customer1", text: "(gülümser) Doğal cila, hoşuma gitti bu tabir." }], next: "access" },

    access: {
      id: "access",
      lines: [{ speaker: "customer1", text: "Peki misafirlerim buraya nasıl inecek, herkes maden galerisinde yürüyemez." }],
      choices: [
        { id: "a", text: "\"Fener ve ip merdivenle 20 dakikalık keyifli bir yürüyüş sadece.\"", next: "access_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Ana geçitte tutunma halatları ve aydınlatma mevcut, güvenli.\"", next: "access_b", effects: { suspicion: 0 } },
        { id: "c", text: "\"Gelen herkes 'buraya layık mıyım' diye düşünerek geliyor zaten, filtre gibi.\"", next: "access_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    access_a: { id: "access_a", lines: [{ speaker: "customer1", text: "20 dakika... misafirlerim pes eder herhalde." }], next: "price" },
    access_b: { id: "access_b", lines: [{ speaker: "customer1", text: "Halat ve aydınlatma olması güven verici." }], next: "price" },
    access_c: { id: "access_c", lines: [{ speaker: "customer1", text: "(kahkaha) Bu bakış açısını hiç düşünmemiştim." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyat konusunda pazarlık payınız var mı biraz?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: "\"Fiyat zaten bu eşsiz kristal dokusuna göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu mağara bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte mantıklı geldi, koleksiyonumu buraya taşıyorum." },
        { speaker: "emlah", text: "Hayırlı olsun, fener hediyemiz olsun bu arada." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Nem alma sistemi fiyatını öğrenip size dönerim, düşüneceğim." },
        { speaker: "emlah", text: "Elbette, elimde birkaç seçenek daha var, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
        { speaker: "customer1", text: "Sanırım bu mağara bana göre değil, vaktinizi aldım." },
      ],
      end: "lost",
    },
  },
};

export const houseKirisSaplanmisKonak: HouseScene = {
  id: "kiris-saplanmis-konak",
  title: "Kirişin Sapladığı Konak",
  location: "Fatih, deprem sonrası ahşap konak",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, teyzemin evine bakmaya geldik. Bu da yeğenim {isim2}." },
        { speaker: "customer2", text: "Aile mirası bu ev, satmaya karar verdik ama önce durumunu görmek istedik." },
      ],
      choices: [
        { id: "a", text: "\"Tarihi bir konak, önce içeri geçelim, anlatayım.\"", next: "enter", effects: { interest: 5 } },
        { id: "b", text: "\"Sizi hazırlıklı olmaya davet ediyorum açıkçası.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Ailenizin anılarıyla dolu bir yer olmalı, saygıyla gezelim.\"", next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Komşu inşaattan kopan bir beton kiriş, geçen ay konağın yan duvarına saplanmış durumda." },
        { speaker: "customer2", text: "(şaşkınlıkla) Yani bina hâlâ o kirişle mi ayakta duruyor?" },
        { speaker: "customer1", text: "{isim2}, teyzemin koltuğu tam kirişin altındaydı sanırım." },
      ],
      choices: [
        { id: "a", text: "\"Kiriş aslında ek bir destek görevi görüyor artık, doğaçlama bir mühendislik.\"", next: "q1_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Statik rapor bekleniyor, sonuca göre kiriş kontrollü şekilde sökülecek.\"", next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"En azından ücretsiz bir heykel kazanmış oldunuz diyelim.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Doğaçlama mühendislik\" cümlesi beni hiç rahatlatmadı." }], next: "elevator" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer2", text: "Statik rapor bekleniyor olması en azından bir süreç olduğunu gösteriyor." }], next: "elevator" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(gülümser) {isim}, adamın mizah anlayışı fena değil." }], next: "elevator" },

    elevator: {
      id: "elevator",
      lines: [
        { speaker: "customer1", text: "Dışarıda \"Terk Edilmiş Asansör\" yazan bir tabela gördük, o ne demek?" },
        { speaker: "customer1", text: "Bina bu kadar hasarlıyken asansör projesi de mi yarım kalmış?" },
      ],
      choices: [
        { id: "a", text: "\"Asansör boşluğu şu an ek depo alanı olarak kullanılıyor, pratik bir çözüm.\"", next: "elevator_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Proje depremden önce durduruldu, güvenlik gerekçesiyle iptal edildi.\"", next: "elevator_b", effects: { suspicion: 0 } },
        { id: "c", text: "\"Merdiven kullanmak sağlığa iyi geliyor, teyzeniz de öyle derdi herhalde.\"", next: "elevator_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    elevator_a: { id: "elevator_a", lines: [{ speaker: "customer2", text: "\"Ek depo alanı\" derken boş bir çukurdan mı bahsediyorsunuz?" }], next: "safety" },
    elevator_b: { id: "elevator_b", lines: [{ speaker: "customer1", text: "Güvenlik gerekçesiyle durdurulmuş olması en azından mantıklı." }], next: "safety" },
    elevator_c: { id: "elevator_c", lines: [{ speaker: "customer2", text: "(güler) {isim}, teyzemiz gerçekten öyle derdi, doğru bildiniz." }], next: "safety" },

    safety: {
      id: "safety",
      lines: [
        { speaker: "customer1", text: "Peki genel olarak binanın güvenli olduğuna dair bir belge var mı elinizde?" },
        { speaker: "customer1", text: "Yeğenimle burada oturmayı düşünüyoruz aslında, sadece satış için gelmedik." },
      ],
      choices: [
        { id: "a", text: "\"Şimdiye kadar hiçbir sorun çıkmadı, belge süreci de yakında tamamlanır.\"", next: "safety_a", effects: { suspicion: 25 } },
        { id: "b", text: "\"Statik rapor çıkana kadar oturmanızı önermem açıkçası, dürüst olayım.\"", next: "safety_b", effects: { suspicion: -5 } },
        { id: "c", text: "\"Kiriş sökülüp güçlendirme yapılırsa burası gayet sağlam bir konak olur.\"", next: "safety_c", effects: { suspicion: 5, interest: 10 } },
      ],
    },
    safety_a: { id: "safety_a", lines: [{ speaker: "thought", text: "\"Yakında tamamlanır\" cümlesini hiç sevmedim." }], next: "price" },
    safety_b: { id: "safety_b", lines: [{ speaker: "customer2", text: "(şaşırır) {isim}, bu adam dürüst konuşuyor, bu bende güven uyandırdı." }], next: "price" },
    safety_c: { id: "safety_c", lines: [{ speaker: "customer1", text: "Güçlendirme fikri mantıklı, uzun vadede düşünülebilir." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer2", text: "Fiyat zaten düşük ama biraz daha inebilir misiniz, tamirat masrafını düşünürsek?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %15 indirim sağlayabilirim, tamirat payını da düşünerek.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 15 } },
        { id: "b", text: "\"Fiyat zaten hasar durumuna göre en düşük seviyede, düşünme payınız olsun.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu fiyata tarihi bir konak bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte mantıklı geldi, {isim2}'yle güçlendirmeyi biz üstleniriz." },
        { speaker: "emlah", text: "Hayırlı olsun, kask hediyemiz olsun bu arada, şaka bir yana dikkatli olun." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Statik raporu bekleyip ona göre karar verelim, {isim} de aynı fikirde." },
        { speaker: "emlah", text: "Doğru karar, rapor çıkınca beni arayabilirsiniz." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Bizi aceleye getirmeye çalıştığınızı fark ettik." },
        { speaker: "customer2", text: "Teyzemin anısına saygısızlık gibi geldi bu, vaktinizi aldık." },
      ],
      end: "lost",
    },
  },
};

export const houseSifirUcStudyo: HouseScene = {
  id: "sifir-uc-studyo",
  title: "'0+3' Stüdyo",
  location: "Kadıköy, tarihi apartman",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. İlanda '0+3' yazıyordu, hiç böyle bir tabir duymamıştım." },
        { speaker: "customer1", text: "Stüdyo dairelere '1+0' derler genelde, bu '0+3' da ne demek acaba?" },
      ],
      choices: [
        { id: "a", text: "\"Sıra dışı bir konsept, içeri geçince anlarsınız.\"", next: "enter", effects: { fun: 5 } },
        { id: "b", text: "\"Aslında oda sayısını değil, felsefeyi anlatıyor bu isim.\"", next: "enter", effects: { interest: 5 } },
        { id: "c", text: "\"Sizi şaşırtmak istemem, direkt gösteriyorum.\"", next: "enter", effects: { suspicion: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte burası, '0' mutfak, '3' de küvetin farklı kullanım alanı demek aslında." },
        { speaker: "customer1", text: "(etrafa bakınır) Bir dakika, mutfak... nerede mutfak?" },
        { speaker: "customer1", text: "Sadece bir küvet görüyorum, ocak, tezgah, hiçbir şey yok." },
      ],
      choices: [
        { id: "a", text: "\"Mutfak yok çünkü küvet üç işi birden yapıyor: bulaşık, çamaşır, banyo.\"", next: "q1_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Doğru, mutfak yok ama karşı sokakta harika bir lokantalar sırası var.\"", next: "q1_b", effects: { suspicion: 5, interest: 5 } },
        { id: "c", text: "\"Yemek pişirmemenin de bir özgürlük olduğunu düşünebiliriz.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Bulaşık ve banyo aynı küvette mi... bunu hiç düşünmemiştim." }], next: "dishes" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Lokanta sırası fikri fena değil aslında." }], next: "dishes" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) İlginç bir bakış açısı, kabul ediyorum." }], next: "dishes" },

    dishes: {
      id: "dishes",
      lines: [
        { speaker: "customer1", text: "Peki bulaşıkları yıkarken banyo mu yapamıyorum, sırayla mı gidiyor bu iş?" },
        { speaker: "customer1", text: "Yani mantık olarak biraz kafam karıştı açıkçası." },
      ],
      choices: [
        { id: "a", text: "\"Sırayla tabii, önce bulaşık, sonra durulama, en son siz.\"", next: "dishes_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Küçük bir leğen alırsanız bulaşığı ayırabilirsiniz, pratik bir çözüm.\"", next: "dishes_b", effects: { suspicion: 0 } },
        { id: "c", text: "\"Az eşya, az bulaşık demek zaten, sorun büyütülüyor bence.\"", next: "dishes_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    dishes_a: { id: "dishes_a", lines: [{ speaker: "thought", text: "\"En son siz\" cümlesi hiç iç açıcı değildi." }], next: "guest" },
    dishes_b: { id: "dishes_b", lines: [{ speaker: "customer1", text: "Leğen fikri mantıklı, not ediyorum." }], next: "guest" },
    dishes_c: { id: "dishes_c", lines: [{ speaker: "customer1", text: "(gülümser) Az eşya derken haklısınız aslında." }], next: "guest" },

    guest: {
      id: "guest",
      lines: [{ speaker: "customer1", text: "Peki misafir geldiğinde bu küvet meselesini nasıl açıklayacağım?" }],
      choices: [
        { id: "a", text: "\"Açıklamayın, merak etsinler, ilgi çekici bir sır olarak kalsın.\"", next: "guest_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Küvetin üstüne bir kapak yaptırırsanız normal bir tezgah gibi durur.\"", next: "guest_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Bu evi görenler zaten bir daha unutmuyor, iyi bir sohbet konusu.\"", next: "guest_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    guest_a: { id: "guest_a", lines: [{ speaker: "customer1", text: "\"Sır olarak kalsın\" dediğinize göre gizlenecek bir şey var demek." }], next: "price" },
    guest_b: { id: "guest_b", lines: [{ speaker: "customer1", text: "Kapak fikri işime yarar, bunu değerlendiririm." }], next: "price" },
    guest_c: { id: "guest_c", lines: [{ speaker: "customer1", text: "(kahkaha) Sohbet konusu olarak fena değil doğrusu." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Mutfaksız bir ev için fiyatta biraz esneklik olmalı bence." }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %10 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: "\"Fiyat zaten mutfaksız evlere göre düşük tutuldu, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu konsept bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte mantıklı geldi, kapağı ben yaptırırım artık." },
        { speaker: "emlah", text: "Hayırlı olsun, leğeni de unutmayın." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Biraz daha düşüneyim, bu küvet meselesini kafamda oturtmam lazım." },
        { speaker: "emlah", text: "Elbette, ne zaman isterseniz arayabilirsiniz." },
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
};

export const houseEskiTrenIstasyonu: HouseScene = {
  id: "eski-tren-istasyonu",
  title: "Eski Tren İstasyonu",
  location: "Sirkeci, terk edilmiş peron",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Küçüklüğümden beri trenlere hastayım, ilanı görünce heyecanlandım." },
        { speaker: "customer1", text: "Gerçek bir istasyonun içinde yaşamak, hayalim gibi bir şey bu." },
      ],
      choices: [
        { id: "a", text: "\"O zaman doğru yerdesiniz, burası 1894'ten kalma otantik bir bekleme odası.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Tren sesleri konusunda önceden hazırlıklı olun derim.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Duvardaki dev saat de cabası, tam sizlik bir detay.\"", next: "enter", effects: { fun: 5, interest: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Peron 2'nin hemen yanında, hâlâ çalışan bu dev saatin altında yaşıyorsunuz." },
        { speaker: "customer1", text: "(hayranlıkla) Muhteşem... ama bir saniye, yatak ile tuvalet aynı odada mı?" },
        { speaker: "customer1", text: "Yani duş perdesi falan da yok, hepsi iç içe." },
      ],
      choices: [
        { id: "a", text: "\"Aynı odada evet, ama 1894 tarzı bu, o dönem böyle yapılırmış.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Doğru, ama paravan koyarsanız sorun büyük ölçüde çözülür.\"", next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Tren yolculuğunda da herkes yan yana otururdu, buna alışkanlık diyelim.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "1894 tarzı derken, hijyen konusunda da mı o döneme dönüyoruz?" }], next: "sound" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Paravan fikri en azından bir başlangıç." }], next: "sound" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Bu benzetmeyi hiç düşünmemiştim." }], next: "sound" },

    sound: {
      id: "sound",
      lines: [
        { speaker: "customer1", text: "Peronda hâlâ tren geçiyor mu, gece sesler beni uyandırır mı?" },
        { speaker: "customer1", text: "Çünkü hayal ile gerçek arasında fark olabilir diye düşünüyorum." },
      ],
      choices: [
        { id: "a", text: "\"Son tren gece yarısı geçiyor, ritmi öğrenince alarm gibi bile kullanabilirsiniz.\"", next: "sound_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Cam kalınlaştırma yaptırırsanız sesi ciddi oranda azaltabiliriz.\"", next: "sound_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Tren düdüğü de artık bir çeşit ninni sayılır bence.\"", next: "sound_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    sound_a: { id: "sound_a", lines: [{ speaker: "thought", text: "\"Alarm gibi kullanabilirsiniz\" hiç uyku dostu bir cümle değildi." }], next: "clock" },
    sound_b: { id: "sound_b", lines: [{ speaker: "customer1", text: "Cam kalınlaştırma mantıklı bir yatırım gibi duruyor." }], next: "clock" },
    sound_c: { id: "sound_c", lines: [{ speaker: "customer1", text: "(kahkaha) Tren düdüğü ninni, bunu ilk defa duyuyorum." }], next: "clock" },

    clock: {
      id: "clock",
      lines: [{ speaker: "customer1", text: "O dev saatin tik-takları da geceleri rahatsız eder mi acaba?" }],
      choices: [
        { id: "a", text: "\"Mekanizma biraz gürültülü evet, ama saat başı çanı gerçekten etkileyici.\"", next: "clock_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Sessiz moda alınabiliyor aslında, sadece bir teknisyen çağırmak yeterli.\"", next: "clock_b", effects: { suspicion: 0 } },
        { id: "c", text: "\"O saat bu evin kalbi, sessiz olsa ruhu kaybolur diye düşünüyorum.\"", next: "clock_c", effects: { fun: 10, interest: 10 } },
      ],
    },
    clock_a: { id: "clock_a", lines: [{ speaker: "customer1", text: "\"Etkileyici\" derken uykumu kaçıracak kadar mı etkileyici?" }], next: "price" },
    clock_b: { id: "clock_b", lines: [{ speaker: "customer1", text: "Teknisyen çağırmak makul bir çözüm." }], next: "price" },
    clock_c: { id: "clock_c", lines: [{ speaker: "customer1", text: "(gülümser) Bu duygusal yaklaşımı beğendim açıkçası." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyat konusunda pazarlık payınız var mı biraz?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Fiyat zaten bu tarihi dokuya göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu istasyon bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte hayalim gerçek oluyor, paravanı hemen alırım." },
        { speaker: "emlah", text: "Hayırlı olsun, tren saatlerini de bir kenara not edin." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir gece burada kalıp sesleri denemek isterim, sonra karar veririm." },
        { speaker: "emlah", text: "Elbette, ne zaman isterseniz ayarlarım." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
        { speaker: "customer1", text: "Sanırım bu istasyon bana göre değil, vaktinizi aldım." },
      ],
      end: "lost",
    },
  },
};

export const houseKutuphaneYatakOdasi: HouseScene = {
  id: "kutuphane-yatak-odasi",
  title: "Kütüphane Yatak Odası",
  location: "Cihangir, kitapçı dairesi",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Kitap kurdu olduğumu söylesem yalan olmaz, ilan tam bana göreydi." },
        { speaker: "customer1", text: "Fotoğraflarda ev baştan aşağı kitaplıktı, doğru mu bu?" },
      ],
      choices: [
        { id: "a", text: "\"Kesinlikle doğru, her santimi kitaplarla dolu bir cennet burası.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Doğru, ama biraz da yatak konusunda hazırlıklı olun.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Önce içeri geçelim, göz kamaştıracak bir manzara sizi bekliyor.\"", next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte yatak odası, tam da kitaplıkların arasına sıkışmış durumda." },
        { speaker: "customer1", text: "(gözleri parlar, sonra şaşırır) Yatak gerçekten iki raf arasında mı sıkışmış?" },
        { speaker: "customer1", text: "Yani dönüp durabilecek kadar yer var mı acaba içeride?" },
      ],
      choices: [
        { id: "a", text: "\"Dönmenize gerek yok zaten, kitap okuyup uyuyacaksınız, ideal bir düzen.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Biraz dar evet, ama raflardan birkaçını kaldırırsak alan açılır.\"", next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Kitapların arasında uyumak bazı yazarlara ilham kaynağı olmuş, biliyor musunuz?\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Dönmenize gerek yok\" cümlesi biraz endişelendirdi beni." }], next: "fall" },
    q1_b: {
      id: "q1_b",
      lines: [
        { speaker: "customer1", text: "Raf kaldırmak mantıklı bir çözüm gibi duruyor." },
        { speaker: "customer1", text: "Aslında güvenlik tarafını da merak ediyordum ama bu cevap içimi rahatlattı, fiyata geçebiliriz." },
      ],
      next: "price",
    },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Bu argümanı beğendim doğrusu." }], next: "fall" },

    fall: {
      id: "fall",
      lines: [
        { speaker: "customer1", text: "Peki uykuda dönersem üstüme kitap düşme ihtimali var mı?" },
        { speaker: "customer1", text: "Yani bu ciddi bir güvenlik sorunu gibi de düşünülebilir." },
      ],
      choices: [
        { id: "a", text: "\"Ağır ansiklopedileri üst raflara koymamanızı öneririm sadece.\"", next: "fall_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Raflara kenar bariyeri taktırabiliriz, basit bir çözüm.\"", next: "fall_b", effects: { suspicion: 0 } },
        { id: "c", text: "\"Kitap düşerse en azından okuyacak bir şeyiniz olur elinizin altında.\"", next: "fall_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    fall_a: { id: "fall_a", lines: [{ speaker: "thought", text: "Bu tavsiyeyi zaten kendim düşünmüştüm, güven vermedi." }], next: "price" },
    fall_b: { id: "fall_b", lines: [{ speaker: "customer1", text: "Bariyer fikri işime yarar, teşekkürler." }], next: "price" },
    fall_c: { id: "fall_c", lines: [{ speaker: "customer1", text: "(kahkaha) Bu bakış açısını hiç düşünmemiştim, hoşuma gitti." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyat konusunda biraz esneklik var mı acaba?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: "\"Fiyat zaten bu kitaplık koleksiyonuna göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu kütüphane bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, bariyer işini de kendim hallederim." },
        { speaker: "emlah", text: "Hayırlı olsun, iyi okumalar." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Biraz daha düşüneyim, raf düzenini bir de gündüz görmek isterim." },
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
};

export const houseGarajLoft: HouseScene = {
  id: "garaj-loft",
  title: "Garaj Loft",
  location: "Maslak, eski oto tamirhanesi",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da kardeşim {isim2}. Birlikte ev bakıyoruz." },
        { speaker: "customer2", text: "Ben klasik araba tutkunuyum, {isim} ise pek anlamıyor açıkçası." },
      ],
      choices: [
        { id: "a", text: "\"O zaman bu ev tam size göre, içeride bir sürpriz var.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Farklı zevkleri olan kardeşler için ilginç bir uzlaşma bu ev.\"", next: "enter", effects: { fun: 5 } },
        { id: "c", text: "\"Önce görün, sonra kararınızı birlikte verin derim.\"", next: "enter", effects: { suspicion: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Salonun tam ortasında çalışan bir otomobil lifti var, önceki sahibi tamirci imiş." },
        { speaker: "customer2", text: "(gözleri parlar) Bu... bu harika! {isim}, bak, gerçek bir lift!" },
        { speaker: "customer1", text: "(şüpheyle bakar) Yani koltuk, mutfak, her şey bu liftin etrafında mı?" },
      ],
      choices: [
        { id: "a", text: "\"Aynen öyle, açık plan konsepti burada biraz daha... otomotiv yönlü.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Lifti kaldırıp yerine bölme koyabiliriz isterseniz, tercihe bağlı.\"", next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Misafirleriniz gelince ilk sorusu hep aynı olur: 'lift çalışıyor mu?'\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Otomotiv yönlü\" derken normal bir salon değil yani bu." }], next: "smell" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer2", text: "Lifti kaldırmak mı? {isim}, kesinlikle olmaz öyle şey." }], next: "smell" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Bu soruyu ben de sorardım galiba." }], next: "smell" },

    smell: {
      id: "smell",
      lines: [
        { speaker: "customer1", text: "Motor yağı kokusu falan sinmiş midir buraya, yaşam alanı için endişeleniyorum." },
        { speaker: "customer1", text: "{isim2}, sen de kabul et, bu biraz garip bir durum." },
      ],
      choices: [
        { id: "a", text: "\"Biraz sinmiş olabilir, ama zamanla karakteristik bir koku haline geliyor.\"", next: "smell_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Derin temizlik ve havalandırma sistemiyle büyük ölçüde giderilebilir.\"", next: "smell_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Bazı kişiler bu kokuyu parfüm gibi seviyor, garaj estetiği diyorlar.\"", next: "smell_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    smell_a: { id: "smell_a", lines: [{ speaker: "thought", text: "\"Karakteristik koku\" cümlesi hep aynı, hiç güven vermiyor." }], next: "safety" },
    smell_b: { id: "smell_b", lines: [{ speaker: "customer1", text: "Havalandırma sistemi mantıklı bir çözüm, kabul ediyorum." }], next: "safety" },
    smell_c: { id: "smell_c", lines: [{ speaker: "customer2", text: "(kahkaha) {isim}, adam haklı, garaj estetiği gerçek bir şey!" }], next: "safety" },

    safety: {
      id: "safety",
      lines: [{ speaker: "customer1", text: "Peki bu lift güvenli mi, üstünde bir şey varken aniden inmez değil mi?" }],
      choices: [
        { id: "a", text: "\"Şimdiye kadar hiç sorun çıkmadı, bakım kayıtları da elimde bir yerde.\"", next: "safety_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Kilit mekanizması var, düzenli bakımla tamamen güvenli hale gelir.\"", next: "safety_b", effects: { suspicion: 0 } },
        { id: "c", text: "\"Lift çalışır durumda kalırsa evin değeri de artar, meraklısı çok.\"", next: "safety_c", effects: { fun: 10, interest: 15 } },
      ],
    },
    safety_a: { id: "safety_a", lines: [{ speaker: "customer1", text: "\"Bir yerde\" derken elinizde olmadığını mı kastediyorsunuz?" }], next: "price" },
    safety_b: { id: "safety_b", lines: [{ speaker: "customer1", text: "Kilit mekanizması olması içimi rahatlattı biraz." }], next: "price" },
    safety_c: { id: "safety_c", lines: [{ speaker: "customer2", text: "(heyecanla) {isim}, değer artışı da varsa hiç sorun yok bence!" }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyat konusunda biraz esneklik var mı, ikimiz de karar vermemiz lazım." }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %6 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 6 } },
        { id: "b", text: "\"Fiyat zaten bu özel konsepte göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu lift bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer2", text: "İndirimle birlikte anlaştık, {isim} de artık lifte alıştı sanırım." },
        { speaker: "emlah", text: "Hayırlı olsun, lift bakımını ihmal etmeyin." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bakım kayıtlarını görüp öyle karar verelim, {isim2} de razı." },
        { speaker: "emlah", text: "Elbette, kayıtları bulup size iletirim." },
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
};

export const houseCamKutuTuvalet: HouseScene = {
  id: "cam-kutu-tuvalet",
  title: "Cam Kutu Tuvalet",
  location: "Nişantaşı, minimalist rezidans",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da {isim2}. Ev arkadaşı olmayı düşünüyoruz, birlikte bakıyoruz." },
        { speaker: "customer2", text: "Fotoğraflar çok şık görünüyordu, minimalist tarz tam bize göre." },
      ],
      choices: [
        { id: "a", text: "\"Minimalizmi bir üst seviyeye taşıyan bir ev bu, göreceksiniz.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Şıklık evet, ama bazı detaylar sizi şaşırtabilir.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Önce içeri geçelim, tepkinizi görmek istiyorum açıkçası.\"", next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte salon, ortadaki o şeffaf cam küp de tuvalet oluyor." },
        { speaker: "customer2", text: "(donup kalır) Yani... tuvalet, salonun tam ortasında, camdan mı?" },
        { speaker: "customer1", text: "{isim2}, ben bunu asla kullanamam, herkes görür." },
      ],
      choices: [
        { id: "a", text: "\"Şeffaflık burada bir tasarım felsefesi, mahremiyet biraz geri planda kalıyor.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Buzlu folyo kaplarsanız görünürlük neredeyse sıfıra iner.\"", next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Ev arkadaşlığında sır kalmaz zaten, bu da hızlandırıyor sadece.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: "\"Tasarım felsefesi\" derken mahremiyetten feragat etmemiz mi gerekiyor?" }], next: "privacy" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Buzlu folyo fikri işimize yarar gibi duruyor." }], next: "privacy" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(gülümser) {isim}, adam haklı olabilir aslında." }], next: "privacy" },

    privacy: {
      id: "privacy",
      lines: [
        { speaker: "customer1", text: "Peki müzik çalarsak ya da kapıyı vursak bile duyulur mu dışarıdan?" },
        { speaker: "customer1", text: "Yani akustik konusunda da mı şeffaf bu cam?" },
      ],
      choices: [
        { id: "a", text: "\"Açıkçası ses biraz geçiyor evet, ama alışkanlık meselesi zamanla.\"", next: "privacy_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Çift camlı versiyona geçerseniz ses yalıtımı ciddi oranda artar.\"", next: "privacy_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Kulaklık takarsanız hiç sorun kalmaz zaten.\"", next: "privacy_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    privacy_a: { id: "privacy_a", lines: [{ speaker: "thought", text: "\"Alışkanlık meselesi\" cümlesini duyunca içim rahatlamadı." }], next: "price" },
    privacy_b: { id: "privacy_b", lines: [{ speaker: "customer2", text: "Çift cam mantıklı bir çözüm, düşünürüz." }], next: "price" },
    privacy_c: { id: "privacy_c", lines: [{ speaker: "customer1", text: "(güler) {isim2}, kulaklık her derde deva değil ama komik oldu." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer2", text: "Fiyat konusunda biraz esneklik var mı, mahremiyet meselesini de düşünürsek?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %11 indirim sağlayabilirim, folyo masrafını da düşünerek.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 11 } },
        { id: "b", text: "\"Fiyat zaten bu konsepte göre makul, düşünme payınız olsun.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu tasarım bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte mantıklı geldi, {isim2}'yle folyoyu birlikte yaptırırız." },
        { speaker: "emlah", text: "Hayırlı olsun, iyi anlaşmalar dilerim." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Folyo fiyatını öğrenip ona göre karar verelim, {isim} de aynı fikirde." },
        { speaker: "emlah", text: "Doğru karar, öğrenince beni arayabilirsiniz." },
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
};

export const houseTekDaireselOda: HouseScene = {
  id: "tek-dairesel-oda",
  title: "Tek Dairesel Oda",
  location: "Levent, tasarım rezidansı",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Aşırı minimalist bir yaşam arıyorum, duvar bile istemiyorum diyebilirim." },
        { speaker: "customer1", text: "İlanda 'tek dairesel oda' yazıyordu, tam da hayalimdeki gibi bir şey mi bu?" },
      ],
      choices: [
        { id: "a", text: "\"Tam olarak öyle, tek bir yuvarlak alan, hiç köşe yok.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Öyle ama bazı pratik zorlukları da beraberinde getiriyor.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Görünce anlarsınız, alışılmadık bir deneyim sizi bekliyor.\"", next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte burası, yatak, mutfak, oturma alanı hepsi tek dairesel bir alanda, bölme yok." },
        { speaker: "customer1", text: "(etrafı döner) Vay canına, gerçekten hiç köşe yok, tuvalet bile açıkta." },
        { speaker: "customer1", text: "Sadece bir paravanla ayrılmış, bu biraz fazla açık değil mi?" },
      ],
      choices: [
        { id: "a", text: "\"Açık plan felsefesinin en saf hali diyebiliriz, alışması biraz zaman alır.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Paravan sistemini genişletip ek bir bölme yaptırabiliriz isterseniz.\"", next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Köşe olmayınca eşyanızı kaybetme ihtimaliniz de sıfıra iniyor.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"En saf hali\" derken biraz fazla saf olmasın bu." }], next: "furniture" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Ek bölme fikri işime yarar gibi duruyor." }], next: "furniture" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Bu açıdan hiç bakmamıştım, ilginç." }], next: "furniture" },

    furniture: {
      id: "furniture",
      lines: [
        { speaker: "customer1", text: "Peki köşesi olmayan bir odaya normal mobilyalar sığar mı, hepsi özel mi olacak?" },
        { speaker: "customer1", text: "Çünkü özel üretim mobilya bütçemi zorlar diye düşünüyorum." },
      ],
      choices: [
        { id: "a", text: "\"Maalesef çoğu mobilya özel ölçü olmak zorunda, standart dolap girmiyor.\"", next: "furniture_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Duvara monte modüler sistemler kullanırsanız çoğu ihtiyacı karşılar.\"", next: "furniture_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Az eşyayla yaşamak zaten bu tarzın felsefesi, bir nevi bonus.\"", next: "furniture_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    furniture_a: { id: "furniture_a", lines: [{ speaker: "thought", text: "\"Standart dolap girmiyor\" cümlesi bütçemi düşündürdü." }], next: "price" },
    furniture_b: { id: "furniture_b", lines: [{ speaker: "customer1", text: "Modüler sistemler mantıklı bir çözüm gibi duruyor." }], next: "price" },
    furniture_c: { id: "furniture_c", lines: [{ speaker: "customer1", text: "(gülümser) Az eşya felsefesi zaten amacım, doğru noktaya değindiniz." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyat konusunda biraz esneklik var mı, mobilya masrafını düşünürsek?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %10 indirim sağlayabilirim, mobilya payını da düşünerek.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: "\"Fiyat zaten bu özel tasarıma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu tasarım bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, modüler mobilyaları hemen sipariş ederim." },
        { speaker: "emlah", text: "Hayırlı olsun, minimalist hayatınız kutlu olsun." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Mobilya fiyatlarını araştırıp size dönerim, düşüneceğim." },
        { speaker: "emlah", text: "Elbette, ne zaman isterseniz arayabilirsiniz." },
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
};

export const houseMerdivenEvi: HouseScene = {
  id: "merdiven-evi",
  title: "Merdiven Evi",
  location: "Balat, dik yokuş üstü",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Balat'ın dokusuna hayranım, ilanı görünce hemen not aldım." },
        { speaker: "customer1", text: "Fotoğraflarda ev biraz karmaşık görünüyordu, koridor falan yok gibiydi." },
      ],
      choices: [
        { id: "a", text: "\"Koridor yok çünkü ev zaten bir merdiven etrafında kurulu.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "b", text: "\"Balat'ın en özgün evlerinden biri diyebilirim rahatlıkla.\"", next: "enter", effects: { interest: 10 } },
        { id: "c", text: "\"Merak ettiyseniz içeri geçelim, kendi gözlerinizle görün.\"", next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Ev tam anlamıyla dönel bir merdiven ve ona açılan küçük bölmelerden oluşuyor." },
        { speaker: "customer1", text: "(şaşkınlıkla) Yani her oda merdivenin farklı bir basamağında mı?" },
        { speaker: "customer1", text: "Mutfaktan yatak odasına geçmek için merdiven mi çıkacağım her seferinde?" },
      ],
      choices: [
        { id: "a", text: "\"Aynen öyle, günde ortalama 40 basamak, bedava spor salonu gibi düşünün.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Doğru, ama en azından her bölmenin kendine has bir manzarası var.\"", next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Gece atıştırmalık almak için üç kat inip çıkmak motivasyonu artırıyor.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Bedava spor salonu\" derken bunu her gün mü yapacağım cidden?" }], next: "safety" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Manzara fikri hoşuma gitti, her bölmeyi merak ediyorum şimdi." }], next: "safety" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Motivasyon derken, gece atıştırmalığı pes ettirir bence." }], next: "safety" },

    safety: {
      id: "safety",
      lines: [
        { speaker: "customer1", text: "Peki gece yarısı yarı uykuluyken bu merdivenlerden düşme riski yok mu?" },
        { speaker: "customer1", text: "Çünkü bu ciddi bir güvenlik sorunu gibi görünüyor bana." },
      ],
      choices: [
        { id: "a", text: "\"Şimdiye kadar ciddi bir vaka olmadı, gerçi gece ışıkları biraz zayıf.\"", next: "safety_a", effects: { suspicion: 25 } },
        { id: "b", text: "\"Basamaklara hareket sensörlü aydınlatma taktırabiliriz.\"", next: "safety_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Korkuluklar sağlam, gündüz görünce içiniz rahatlar diye düşünüyorum.\"", next: "safety_c", effects: { suspicion: 0, interest: 10 } },
      ],
    },
    safety_a: { id: "safety_a", lines: [{ speaker: "thought", text: "\"Işıklar biraz zayıf\" cümlesi hiç güven verici değildi." }], next: "price" },
    safety_b: { id: "safety_b", lines: [{ speaker: "customer1", text: "Sensörlü aydınlatma fikri işime yarar, mantıklı." }], next: "price" },
    safety_c: { id: "safety_c", lines: [{ speaker: "customer1", text: "Korkulukların sağlam olması en azından içimi biraz rahatlattı." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyat konusunda pazarlık payınız var mı biraz?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %10 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: "\"Fiyat zaten bu özgün dokuya göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu ev bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte mantıklı geldi, sensörlü aydınlatmayı hemen yaptırırım." },
        { speaker: "emlah", text: "Hayırlı olsun, bacaklarınız güçlenecek bu arada." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Gece aydınlatmasını bir de karanlıkta görmek isterim, sonra karar veririm." },
        { speaker: "emlah", text: "Tabii, ne zaman isterseniz tekrar gösteririm." },
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
};

export const houseDikeyDepolama: HouseScene = {
  id: "dikey-depolama",
  title: "Dikey Depolama",
  location: "Karaköy, dar cephe bina",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da ortağım {isim2}. Antika koleksiyonumuz için geniş depolama alanı arıyoruz." },
        { speaker: "customer2", text: "İlanda 'dikey depolama' yazıyordu, tam bize göre bir şey umuyoruz." },
      ],
      choices: [
        { id: "a", text: "\"Depolama konusunda hayal kırıklığına uğramazsınız, göreceksiniz.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Dikey derken tam anlamıyla dikey, biraz alışılmadık bir sistem.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Koleksiyonerler için ilginç bir çözüm bu, gösterelim.\"", next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Bina çok dar olduğu için katlar arası her şey bir makara sistemiyle çekiliyor, asansör yerine." },
        { speaker: "customer1", text: "(şaşkınlıkla) Yani eşyalarımızı makarayla mı yukarı çekeceğiz her seferinde?" },
        { speaker: "customer2", text: "{isim}, antika dolabı nasıl sığacak buraya öyle?" },
      ],
      choices: [
        { id: "a", text: "\"Makara sistemi 200 kiloya kadar taşıyor, dolabınız rahat sığar.\"", next: "q1_a", effects: { suspicion: 10, interest: 10 } },
        { id: "b", text: "\"Büyük parçalar için ayrıca bir vinç kiralama seçeneğimiz de var.\"", next: "q1_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"Bu sistem sayesinde hırsızlar bile eşyayı taşıyamıyor, bir çeşit güvenlik.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: "200 kilo... bu rakam beni biraz rahatlattı doğrusu." }], next: "narrow" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Vinç kiralama fikri mantıklı bir yedek plan." }], next: "narrow" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(güler) {isim}, bu adamın espri anlayışı fena değil." }], next: "narrow" },

    narrow: {
      id: "narrow",
      lines: [
        { speaker: "customer1", text: "Bina bu kadar darken katlar arasında yürümek de zor olmalı, merdiven nasıl?" },
        { speaker: "customer1", text: "İki kişi aynı anda geçebiliyor mu yoksa sıra mı bekliyoruz?" },
      ],
      choices: [
        { id: "a", text: "\"Açıkçası tek kişilik bir merdiven, sıra beklemek gerekebilir.\"", next: "narrow_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Dar ama yan yana geçiş için küçük genişletme yapılabilir.\"", next: "narrow_b", effects: { suspicion: 0, interest: 5 } },
        { id: "c", text: "\"İş ortaklığında zaten sıra beklemeyi öğrenmişsinizdir, değil mi?\"", next: "narrow_c", effects: { fun: 10, suspicion: 10 } },
      ],
    },
    narrow_a: { id: "narrow_a", lines: [{ speaker: "customer2", text: "\"Sıra beklemek\" gerçekten iş ortaklığı için ideal değil açıkçası." }], next: "price" },
    narrow_b: { id: "narrow_b", lines: [{ speaker: "customer1", text: "Genişletme seçeneği olması iyi bir haber." }], next: "price" },
    narrow_c: { id: "narrow_c", lines: [{ speaker: "customer1", text: "(kahkaha) {isim2}, bu adam bizi çok iyi tanıyor galiba." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer2", text: "Fiyat konusunda biraz esneklik var mı, makara sistemini de düşünürsek?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Fiyat zaten bu özel depolama sistemine göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu depolama sistemi bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte anlaştık, {isim2}'yle koleksiyonu birlikte taşırız." },
        { speaker: "emlah", text: "Hayırlı olsun, makarayı iyi yağlayın." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Vinç kiralama fiyatını öğrenip ona göre karar verelim, {isim} de aynı fikirde." },
        { speaker: "emlah", text: "Doğru karar, öğrenince beni arayabilirsiniz." },
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
};

export const houseBogazinIncisi: HouseScene = {
  id: "bogazin-incisi",
  title: "Boğaz'ın İncisi",
  location: "Boğaz kıyısı, tarihi yalı",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Bu yalıyı yıllardır takip ediyorum, nihayet satışa çıktığına inanamadım." },
        { speaker: "customer1", text: "Ailemin köklü bir tarihi var, böyle bir yapıya sahip olmak bizim için özel." },
      ],
      choices: [
        { id: "a", text: "\"O zaman doğru yerdesiniz, bu yalının 150 yıllık bir hikayesi var.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Tarihi dokusu kadar bakım gereksinimi de büyük, baştan söyleyeyim.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Önce içeri geçelim, kendi gözlerinizle görün.\"", next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "Yalının ahşap iskeleti orijinal, denize sıfır salonu İstanbul'un en özel manzaralarından birine sahip." },
        { speaker: "customer1", text: "(gülümser, sonra tereddüt eder) Muhteşem... ama bir şey sormam lazım." },
        { speaker: "customer1", text: "Komşular gece burada bir 'amiral hayaleti' dolaştığını söylüyor, doğru mu bu?" },
      ],
      choices: [
        { id: "a", text: "\"Doğru, eski bir deniz subayının ruhu burada huzur bulmuş diyorlar, zarasız bir hikaye.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Böyle bir söylenti var ama tapuda hayalet maddesi yok, merak etmeyin.\"", next: "q1_b", effects: { suspicion: 0, fun: 5 } },
        { id: "c", text: "\"O hikaye yalının değerini bile artırıyor açıkçası, turistler bayılıyor.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Zararsız\" derken, geceleri sesler falan duyulmuyor değil mi?" }], next: "bakim" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "(güler) Tapuda hayalet maddesi, bu espriyi sevdim." }], next: "bakim" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "Vay be, hiç böyle düşünmemiştim, pazarlama dehası gibisiniz." }], next: "bakim" },

    bakim: {
      id: "bakim",
      lines: [
        { speaker: "customer1", text: "Ahşap bir yapı bu kadar yıllık, bakım masrafı ne durumda?" },
        { speaker: "customer1", text: "Boğaz nemi ahşaba zarar verir diye biliyorum, endişeleniyorum açıkçası." },
      ],
      choices: [
        { id: "a", text: "\"Yıllık bakım gerekiyor evet, ama bu yapıların değeri zamanla artıyor, yatırım gibi düşünün.\"", next: "bakim_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Özel ahşap koruma sistemiyle bakım maliyeti ciddi oranda düşürülebiliyor.\"", next: "bakim_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: "\"Bu binanın bakımı bir hobi değil, bir ayrıcalık sayılır.\"", next: "bakim_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    bakim_a: { id: "bakim_a", lines: [{ speaker: "thought", text: "\"Yatırım gibi düşünün\" cümlesini duyunca içim şüpheyle doldu." }], next: "price" },
    bakim_b: { id: "bakim_b", lines: [{ speaker: "customer1", text: "Koruma sistemi fikri mantıklı, araştırırım." }], next: "price" },
    bakim_c: { id: "bakim_c", lines: [{ speaker: "customer1", text: "(gülümser) Ayrıcalık derken haklısınız aslında." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Bu ölçekte bir yatırımda fiyat konusunda esneklik var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %4 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 4 } },
        { id: "b", text: "\"Fiyat zaten bu tarihi dokuya göre makul, düşünme payınız olsun.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu yalı bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, bu yalı ailemizde kalacak artık." },
        { speaker: "emlah", text: "Hayırlı olsun, amiralin de hayrını görsün." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Ailemle konuşup size dönerim, bu büyüklükte bir karar acele verilmez." },
        { speaker: "emlah", text: "Elbette, ne zaman isterseniz arayabilirsiniz." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
        { speaker: "customer1", text: "Bu ölçekte bir kararda baskıya tahammülüm yok, vaktinizi aldım." },
      ],
      end: "lost",
    },
  },
};

export const houseOzelAda: HouseScene = {
  id: "ozel-ada",
  title: "Özel Ada",
  location: "Adalar açığı, özel ada",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da ortağım {isim2}. Kendi özel adamız olsun istiyoruz uzun zamandır." },
        { speaker: "customer2", text: "İlanı görünce inanamadık, gerçekten kendi adanız olabiliyor mu bu fiyata?" },
      ],
      choices: [
        { id: "a", text: "\"Kesinlikle, tapu tamamen size ait olacak, eşi benzeri olmayan bir fırsat.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Olabiliyor ama küçük bir erişim detayı var, göstereyim.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Önce tekneyle bir tur atalım, adayı görün.\"", next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte adanız, 3 dönümlük özel alan, kendi küçük koyu ve rıhtımıyla." },
        { speaker: "customer2", text: "(hayranlıkla bakar) Muhteşem... ama karşı kıyıya nasıl geçeceğiz, köprü falan yok galiba." },
        { speaker: "customer1", text: "{isim2}, bak şu tahta yol suyun altında kalmış." },
      ],
      choices: [
        { id: "a", text: "\"Gelgitte bazen yol kısa süreliğine suya gömülüyor, doğal bir ritim gibi düşünün.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Küçük bir tekne veya deniz taksisiyle her koşulda geçiş sağlanabiliyor.\"", next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: "\"Bu da adanın gizemini artıran bir detay, herkes ulaşamıyor buraya.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Doğal ritim\" derken kaç saat suya gömülü kalıyor bu yol?" }], next: "elektrik" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer2", text: "Deniz taksisi fikri işimize yarar gibi duruyor." }], next: "elektrik" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(güler) {isim}, adam haklı olabilir, kimse gelemeyecek bize." }], next: "elektrik" },

    elektrik: {
      id: "elektrik",
      lines: [
        { speaker: "customer1", text: "Peki elektrik ve su nasıl sağlanıyor, ana karadan bağlantı var mı?" },
        { speaker: "customer1", text: "Yani bu ölçekte bir yatırımda alt yapı çok önemli bizim için." },
      ],
      choices: [
        { id: "a", text: "\"Jeneratör ve yağmur suyu toplama sistemiyle kendine yeterli bir ada bu.\"", next: "elektrik_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Deniz altından kablo döşeme projesi başvurusu şu an sahibinde, süreç ilerliyor.\"", next: "elektrik_b", effects: { suspicion: 5, interest: 5 } },
        { id: "c", text: "\"Şehirden tamamen kopmak istiyorsanız bu tam istediğiniz şey.\"", next: "elektrik_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    elektrik_a: { id: "elektrik_a", lines: [{ speaker: "customer2", text: "\"Kendine yeterli\" derken jeneratör sesi rahatsız eder mi peki?" }], next: "price" },
    elektrik_b: { id: "elektrik_b", lines: [{ speaker: "customer1", text: "Süreç ilerliyor olması en azından umut verici." }], next: "price" },
    elektrik_c: { id: "elektrik_c", lines: [{ speaker: "customer2", text: "(gülümser) Aslında tam da bunu istiyorduk, itiraf edeyim." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Bu ölçekte bir yatırımda fiyatta esneklik var mı biraz?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %5 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 5 } },
        { id: "b", text: "\"Fiyat zaten bu eşsiz konuma göre makul, düşünme payınız olsun.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Böyle bir ada bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte anlaştık, {isim2}'yle jeneratörü hemen kurdururuz." },
        { speaker: "emlah", text: "Hayırlı olsun, deniz taksisi numaramı da bırakayım." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Alt yapı detaylarını netleştirip size dönelim, {isim} de aynı fikirde." },
        { speaker: "emlah", text: "Doğru karar, netleşince beni arayabilirsiniz." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Bizi aceleye getirmeye çalıştığınızı fark ettik." },
        { speaker: "customer2", text: "Bu ölçekte bir kararda baskıya tahammülümüz yok, vaktinizi aldık." },
      ],
      end: "lost",
    },
  },
};

export const houseGokyuzuMalikanesi: HouseScene = {
  id: "gokyuzu-malikanesi",
  title: "Gökyüzü Malikanesi",
  location: "Levent, gökdelen tepesi",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Helikopterle geliyorum genelde, bu yüzden bu malikane tam bana göre görünüyor." },
        { speaker: "customer1", text: "Şehrin en yüksek noktasında bir ev, hayalim buydu açıkçası." },
      ],
      choices: [
        { id: "a", text: "\"Doğru yerdesiniz, İstanbul'un en yüksek konut noktasındasınız şu an.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Yükseklik güzel ama küçük bir ulaşım detayı var, göstereyim.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Önce manzarayı görün, gerisini sonra konuşuruz.\"", next: "enter", effects: { fun: 5 } },
      ],
    },

    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte helikopter pisti, tam malikanenin çatısında, iniş kalkış izniniz de hazır." },
        { speaker: "customer1", text: "(gözleri parlar, sonra durur) Harika... ama asansör burada mı, yoksa merdivenle mi çıkıyoruz?" },
        { speaker: "customer1", text: "80 kat merdiven çıkmak istemem açıkçası." },
      ],
      choices: [
        { id: "a", text: "\"Asansör var tabii, sadece bazı günler bakımdan dolayı devre dışı kalıyor.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Var, ayrıca yedek jeneratörlü ikinci bir asansör de ekleniyor bu ay.\"", next: "q1_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: "\"Zaten helikopterle geliyorsunuz, asansör lüks bile sayılır sizin için.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Bazı günler\" derken, ayda kaç gün bakımda kalıyor tam olarak?" }], next: "ruzgar" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Yedek asansör fikri içimi rahatlattı biraz." }], next: "ruzgar" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Bu mantığı hiç düşünmemiştim ama haklısınız." }], next: "ruzgar" },

    ruzgar: {
      id: "ruzgar",
      lines: [
        { speaker: "customer1", text: "Bu yükseklikte rüzgar helikopter inişini etkiler mi peki, güvenlik açısından soruyorum." },
        { speaker: "customer1", text: "Sık sık inip kalkacağım için bu benim için kritik bir detay." },
      ],
      choices: [
        { id: "a", text: "\"Rüzgarlı günlerde biraz risk var evet, ama pilotlar genelde idare ediyor.\"", next: "ruzgar_a", effects: { suspicion: 20 } },
        { id: "b", text: "\"Pist özel rüzgar kesici duvarlarla donatıldı, güvenlik sertifikalı.\"", next: "ruzgar_b", effects: { suspicion: 0, interest: 10 } },
        { id: "c", text: "\"Rüzgarlı günler zaten helikopterle gelmemek için iyi bir bahane.\"", next: "ruzgar_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    ruzgar_a: { id: "ruzgar_a", lines: [{ speaker: "thought", text: "\"Pilotlar genelde idare ediyor\" cümlesi hiç güven verici değildi." }], next: "price" },
    ruzgar_b: { id: "ruzgar_b", lines: [{ speaker: "customer1", text: "Sertifikalı olması güven verici, bunu duymak istiyordum." }], next: "price" },
    ruzgar_c: { id: "ruzgar_c", lines: [{ speaker: "customer1", text: "(kahkaha) Bu bakış açısını beğendim doğrusu." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Bu ölçekte bir yatırımda fiyatta esneklik var mı biraz?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %4 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 4 } },
        { id: "b", text: "\"Fiyat zaten bu eşsiz konuma göre makul, düşünme payınız olsun.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu manzara bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },

    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, yedek asansörü de takip ederim." },
        { speaker: "emlah", text: "Hayırlı olsun, iyi uçuşlar dilerim." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Asansör bakım takvimini bir de kendim görmek isterim, sonra karar veririm." },
        { speaker: "emlah", text: "Elbette, ne zaman isterseniz gösteririm." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
        { speaker: "customer1", text: "Bu ölçekte bir kararda baskıya tahammülüm yok, vaktinizi aldım." },
      ],
      end: "lost",
    },
  },
};

export const houseOtobusDuragi: HouseScene = {
  id: "otobus-duragi",
  title: "Otobüs Durağı Manzaralı Salon",
  location: "Mecidiyeköy, ana cadde",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Salonun camından tam bir durak görünüyor, ilanda öyle yazmıyordu ama." },
        { speaker: "customer1", text: "Yani sabah akşam insanlar oturup bana bakacak mı yani?" },
      ],
      choices: [
        { id: "a", text: "\"Bakmazlar, telefonlarına bakıyorlar zaten.\"", next: "enter", effects: { fun: 10 } },
        { id: "b", text: "\"Perde taktırırsınız, beş dakikalık iş.\"", next: "enter", effects: { interest: 5 } },
        { id: "c", text: "\"Doğru, biraz sahne üstünde yaşamak gibi bir şey.\"", next: "enter", effects: { suspicion: 10, fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte salon, camdan durak tam karşınızda." },
        { speaker: "customer1", text: "(dikkatlice bakar) Otobüs anonsu da içeri geliyor mu peki, \"sonraki durak\" falan?" },
      ],
      choices: [
        { id: "a", text: "\"Gelmez, çift cam var, sessiz sedasız.\"", next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Hafif gelir ama alışırsınız, hatta saati bile şaşırmazsınız.\"", next: "q1_b" },
        { id: "c", text: "\"Anonsu ninni gibi düşünün, uyku terapisi bedava.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Çift camsa iyi, ama garanti veriyor musunuz buna?" }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Saati şaşırmamak fena fikir değil aslında." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Uyku terapisi... bu satış taktiğini not aldım." }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(tam o sırada dışarıda bir otobüs sert fren yapar, hafif bir \"tıısss\" sesi duyulur)" },
        { speaker: "emlah", text: "Gördüğünüz gibi, cam gerçekten sesi kesiyor, siz bile şaşırdınız." },
        { speaker: "customer1", text: "Haklısınız, hiç duymadım neredeyse." },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Peki fiyatta durak manzarası için bir indirim düşünülür mü?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim ayarlarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Fiyat zaten ana caddeye bu kadar yakınlık için makul.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu konum bu fiyata bir daha çıkmaz, bugün karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte anlaştık, perdeyi de ben hallederim." },
        { speaker: "emlah", text: "Hayırlı olsun, iyi seyirler... yani iyi oturumlar." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir de akşam saatinde gelip dinlemek isterim, o zaman karar veririm." },
        { speaker: "emlah", text: "Tabii, ne zaman isterseniz tekrar arayabilirsiniz." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
        { speaker: "customer1", text: "Durağı bir kez daha dinleyip düşüneceğim, vaktinizi aldım." },
      ],
      end: "lost",
    },
  },
};

export const houseYankiDairesi: HouseScene = {
  id: "yanki-dairesi",
  title: "Yankı Dairesi",
  location: "Beyoğlu, eski han katı",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da eşim {isim2}. Tavan kubbeli diye çok merak ettik." },
        { speaker: "customer2", text: "(içeri girer girmez sesi yankılanır) Merhaba baaa-ba-ba..." },
      ],
      choices: [
        { id: "a", text: "\"Evet, kubbe akustiği böyle, biraz konser salonu gibi.\"", next: "enter", effects: { fun: 10 } },
        { id: "b", text: "\"Halı ve perdeyle bu yankı büyük ölçüde azalır.\"", next: "enter", effects: { interest: 10 } },
        { id: "c", text: "\"Kavga ederken bile üç kere duyacaksınız birbirinizi, avantaj sayılır.\"", next: "enter", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "customer2", text: "(gülerek) Şarkı söylesem koro gibi mi çıkar peki?" },
        { speaker: "customer1", text: "Ciddi soru sorayım ama, komşular bu sesi duyar mı acaba?" },
      ],
      choices: [
        { id: "a", text: "\"Duymaz, kubbe sesi içeride hapsediyor, dışarı sızmıyor.\"", next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Biraz duyulabilir ama komşularla iyi geçinirsiniz zaten.\"", next: "q1_b" },
        { id: "c", text: "\"Duyarlarsa da alkışlarlar herhalde.\"", next: "q1_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Hapsediyor\" kelimesi tuhaf geldi biraz açıkçası." }], next: "price" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "İyi komşuluk her derde deva zaten." }], next: "price" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(kahkaha) Alkış fikri hoşuma gitti resmen." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta biraz esneklik olur mu?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %7 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 7 } },
        { id: "b", text: "\"Bu akustik bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: "\"Fiyat zaten bu kubbeye göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer2", text: "İndirimle anlaştık, ilk işim burada şarkı söylemek olacak." },
        { speaker: "emlah", text: "Hayırlı olsun, komşulara şimdiden kolay gelsin." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir de akşam sessizlikte gelip dinleyelim, sonra karar veririz." },
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
};

export const houseRuzgarTuneli: HouseScene = {
  id: "ruzgar-tuneli",
  title: "Rüzgar Tüneli Balkon",
  location: "Maslak, iki kule arası",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Balkon kapısını açar açmaz saçım uçuştu, normal mi bu?" },
      ],
      choices: [
        { id: "a", text: "\"Normal, iki kule arasında olduğu için biraz rüzgar tüneli gibi çalışıyor.\"", next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: "\"Doğal havalandırma diyelim, klimaya ihtiyacınız olmaz.\"", next: "enter", effects: { fun: 10 } },
        { id: "c", text: "\"Biraz rüzgarlı evet, ama içeri geçince fark etmiyor.\"", next: "enter" },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte balkon, manzara gerçekten güzel." },
        { speaker: "customer1", text: "(elini tutar) Çamaşır asarsam öbür mahalleye mi uçar acaba?" },
      ],
      choices: [
        { id: "a", text: "\"Ağır mandal kullanırsanız sorun olmaz.\"", next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Balkona file kapatmak en garantili çözüm.\"", next: "q1_b" },
        { id: "c", text: "\"Uçarsa da bir yerde birinin işine yarar herhalde.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Mandal derdi olmasa daha iyi olurdu ama tamam." }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "File fikri mantıklı, düşünürüm." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülmemeye çalışır) Komik ama pek güven vermedi." }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(tam o sırada rüzgar bir gazeteyi masadan uçurur, ikisi de peşinden koşar gibi bakar)" },
        { speaker: "emlah", text: "Gördüğünüz gibi hareketli bir ev, hiç sıkılmazsınız." },
        { speaker: "customer1", text: "Sıkılmam belli, hareketli evet." },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta rüzgar payı diye bir indirim var mı acaba?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %10 indirim ayarlarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: "\"Fiyat zaten bu manzaraya göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu manzara bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, fileyi de kendim hallederim." },
        { speaker: "emlah", text: "Hayırlı olsun, mandalları sağlam seçin." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Rüzgarsız bir gün de görmek isterim, öyle bir gün var mı acaba." },
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
};

export const houseTerziAtolyesi: HouseScene = {
  id: "terzi-atolyesi",
  title: "Terzi Atölyesi Üstü Daire",
  location: "Nişantaşı, çarşı arkası",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Alt katta terzi dükkanı var diye yazıyordu, hâlâ çalışıyor mu?" },
        { speaker: "customer1", text: "O dikiş makinesi sesini duyar mıyım acaba yukarıda?" },
      ],
      choices: [
        { id: "a", text: "\"Duymazsınız, zemin arası güçlü bir izolasyon var.\"", next: "enter", effects: { suspicion: 15 } },
        { id: "b", text: "\"Hafif duyulur ama alışıyorsunuz, hatta ninni gibi geliyor.\"", next: "enter" },
        { id: "c", text: "\"Duyarsınız, ama karşılığında ömür boyu ücretsiz paça kısaltma var.\"", next: "enter", effects: { fun: 10, interest: 10 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte daire, geniş ve aydınlık." },
        { speaker: "customer1", text: "Kumaş tozu falan yukarı çıkar mı peki, alerjim var da." },
      ],
      choices: [
        { id: "a", text: "\"Çıkmaz, atölyenin kendi havalandırması var.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Bazen hafif çıkabilir, pencereleri kapalı tutmanızı öneririm.\"", next: "q1_b" },
        { id: "c", text: "\"Çıksa da en azından toz her yerde aynı renk kumaştan olur.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Kendi havalandırması varsa güzel." }], next: "second" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Pencere kapalı tutmak mantıklı bir öneri." }], next: "second" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) Bu espri hoşuma gitti doğrusu." }], next: "second" },

    second: {
      id: "second",
      lines: [{ speaker: "customer1", text: "Peki terziyle aramda bir anlaşma falan yapabilir miyim, indirim gibi?" }],
      choices: [
        { id: "a", text: "\"Kesinlikle, komşuluk indirimi genelde iyi işler burada.\"", next: "second_a", effects: { interest: 15 } },
        { id: "b", text: "\"Onu kendisiyle konuşmanız gerekir, ben söz veremem.\"", next: "second_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Bir çift pantolon hediyeyle başlarsınız muhtemelen.\"", next: "second_c", effects: { fun: 10 } },
      ],
    },
    second_a: { id: "second_a", lines: [{ speaker: "customer1", text: "Güzel, bu beni ikna etmeye başladı." }], next: "price" },
    second_b: { id: "second_b", lines: [{ speaker: "customer1", text: "Mantıklı, kendim konuşurum o zaman." }], next: "price" },
    second_c: { id: "second_c", lines: [{ speaker: "customer1", text: "(güler) Hediye pantolon hiç fena değil." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyat konusunda biraz esneklik var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, terziyle de tanışırım artık." },
        { speaker: "emlah", text: "Hayırlı olsun, iyi dikişler." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir de hafta içi bir gün gelip sesi duyayım, sonra karar veririm." },
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
};

export const houseMetroTitresim: HouseScene = {
  id: "metro-titresim",
  title: "Metro Titreşimli Zemin",
  location: "Kadıköy, metro hattı üstü",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da eşim {isim2}. Altımızda metro geçiyormuş, doğru mu?" },
        { speaker: "customer2", text: "İlanda \"ulaşıma çok yakın\" yazıyordu, biraz fazla yakınmış gibi." },
      ],
      choices: [
        { id: "a", text: "\"Doğru, ama titreşim minimal, alışıyorsunuz.\"", next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: "\"Metroya yakınlık büyük avantaj, her yere on dakikada gidersiniz.\"", next: "enter", effects: { interest: 10 } },
        { id: "c", text: "\"Bedava masaj koltuğu gibi düşünün, düzenli titreşim iyi gelir.\"", next: "enter", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte salon, geniş bir yaşam alanı." },
        { speaker: "customer2", text: "(masaya dokunur) Bardaklar filan devrilir mi peki tren geçerken?" },
      ],
      choices: [
        { id: "a", text: "\"Devrilmez, titreşim çok hafif, sadece hissedilir.\"", next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Kaymaz altlık koyarsanız hiç sorun olmaz.\"", next: "q1_b" },
        { id: "c", text: "\"Devrilirse de her sabah bir sürpriz oluyor, hayat monoton olmuyor.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Hafifse sorun değil sanırım." }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer2", text: "Kaymaz altlık akıllıca, alırız." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(gülerek) Sürpriz kahvaltı, hoşuma gitti bu bakış açısı." }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(tam o sırada zemin hafifçe titrer, masadaki bardak küçük bir ses çıkarır)" },
        { speaker: "customer2", text: "(irkilir) İşte, tam da bahsettiğimiz şey oldu." },
        { speaker: "emlah", text: "Gördünüz, gerçekten çok hafif, saniyeler içinde geçti." },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta titreşim payı diye bir esneklik var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: "\"Bu konum bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: "\"Fiyat zaten bu ulaşım kolaylığına göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdik, kaymaz altlıkları da alırız." },
        { speaker: "emlah", text: "Hayırlı olsun, iyi yolculuklar... yani iyi oturumlar." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Bir de yoğun saatte gelip bakalım, sonra karar veririz." },
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
};

export const houseYuzenBogazEvi: HouseScene = {
  id: "yuzen-bogaz-evi",
  title: "Yüzen Boğaz Evi",
  location: "Bebek açıkları, demirli ev-tekne",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Su üstünde bir ev diye duyunca inanamadım, gerçekten yüzüyor mu bu?" },
        { speaker: "customer1", text: "Yani fırtınada falan yerinden oynuyor mu, endişelenmeli miyim?" },
      ],
      choices: [
        { id: "a", text: "\"Sağlam demir sistemiyle bağlı, hafif sallanır sadece.\"", next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: "\"Hafif sallanma var, ama çoğu sahibi bunu sevdiğini söylüyor.\"", next: "enter", effects: { fun: 10 } },
        { id: "c", text: "\"Beşik gibi düşünün, her gece doğal olarak sallanarak uyursunuz.\"", next: "enter", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte iç mekan, ahşap detaylar hâlâ orijinal." },
        { speaker: "customer1", text: "(dengesini biraz kaybeder gibi olur) Deniz tutması olanlar için bir çözüm var mı acaba?" },
      ],
      choices: [
        { id: "a", text: "\"Zamanla vücut alışıyor, ilk hafta biraz zor olabilir sadece.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Bilezik tarzı çözümler işe yarıyor, birçok komşu kullanıyor.\"", next: "q1_b" },
        { id: "c", text: "\"Deniz tutması demeyelim, deniz aşkı diyelim.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Zor olabilir\" kısmı beni biraz tedirgin etti." }], next: "second" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Bilezik fikri makul, denerim." }], next: "second" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) Bu yeniden adlandırmayı beğendim." }], next: "second" },

    second: {
      id: "second",
      lines: [{ speaker: "customer1", text: "Demirleme ve bakım masrafları kime ait oluyor peki, bana mı?" }],
      choices: [
        { id: "a", text: "\"Yıllık demirleme ücreti size ait, ama fiyata göre çok düşük.\"", next: "second_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Bunu da fiyat görüşmesine dahil edebiliriz.\"", next: "second_b", effects: { interest: 15 } },
        { id: "c", text: "\"Bir kaptan şapkası hediye, masraf konusunu sonra konuşuruz.\"", next: "second_c", effects: { fun: 10, suspicion: 5 } },
      ],
    },
    second_a: { id: "second_a", lines: [{ speaker: "customer1", text: "Düşükse sorun değil, netlik iyi oldu." }], next: "price" },
    second_b: { id: "second_b", lines: [{ speaker: "customer1", text: "Dahil edilmesi güzel bir jest." }], next: "price" },
    second_c: { id: "second_c", lines: [{ speaker: "customer1", text: "(güler) Şapka konuyu değiştirmiyor ama komikti." }], next: "price" },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Bu ölçekte bir kararda fiyatta esneklik olur mu?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %6 indirim ve ilk yıl demirleme ücretini karşılarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 6 } },
        { id: "b", text: "\"Fiyat zaten bu benzersiz konum için makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Böyle bir ev bu fiyata bir daha çıkmaz, bugün karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İlk yıl demirleme ücreti karşılanınca karar verdim, anlaştık." },
        { speaker: "emlah", text: "Hayırlı olsun, denizler sakin olsun." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bu ölçekte bir kararı acele vermek istemiyorum, biraz düşüneyim." },
        { speaker: "emlah", text: "Anlıyorum, ne zaman isterseniz tekrar arayabilirsiniz." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", text: "Beni aceleye getirmeye çalıştığınızı fark ettim." },
        { speaker: "customer1", text: "Bu ölçekte bir kararda baskıya tahammülüm yok, vaktinizi aldım." },
      ],
      end: "lost",
    },
  },
};

export const houseAkilliEvCildirmis: HouseScene = {
  id: "akilli-ev-cildirmis",
  title: "Çıldırmış Akıllı Ev",
  location: "Ataşehir, teknoloji sitesi",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. \"Tam akıllı ev\" diye yazıyordu ilanda, teknolojiye bayılırım." },
        { speaker: "customer1", text: "Işıklar, perdeler, her şey sesle mi çalışıyor gerçekten?" },
      ],
      choices: [
        { id: "a", text: "\"Kesinlikle, tek kelimeyle her şeyi yönetiyorsunuz.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Çalışıyor, ama bazen kendi kararlarını da veriyor açıkçası.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Önce içeri geçelim, sistemi kendiniz görün.\"", next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte salon, \"Işıkları aç\" demeniz yeterli." },
        { speaker: "customer1", text: "(söyler söylemez tüm ışıklar yanıp söner, perde kendi kendine açılır) Bu normal mi?" },
      ],
      choices: [
        { id: "a", text: "\"Normal, sistem sizi tanımaya çalışıyor, birkaç gün sürer.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Küçük bir kalibrasyon sorunu, teknisyen bir bakışta çözer.\"", next: "q1_b" },
        { id: "c", text: "\"Ev sizi karşılıyor sayılır, hoş geldin diyor bir nevi.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Tanımaya çalışıyor\" derken beni mi izliyor yani?" }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Teknisyen çağırmak sorun olmaz umarım." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) Ev beni karşılıyor, hoşuma gitti bu." }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(tam o sırada televizyon kendi kendine açılır, ses sonuna kadar açık) Aaa!" },
        { speaker: "emlah", text: "(hızla kapatır) Bazen biraz coşkulu davranıyor sistem, kusura bakmayın." },
        { speaker: "customer1", text: "Coşkulu bir ev... ilginç bir özellik sayılır bu da." },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu sistem için bir esneklik var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Fiyat zaten bu teknolojiye göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu sistem bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, sistemi kendim eğitirim artık." },
        { speaker: "emlah", text: "Hayırlı olsun, umarım ev sizi de sever." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir de sistemi kapalıyken görmek isterim, sonra karar veririm." },
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
};

export const housePazarGunuKaosu: HouseScene = {
  id: "pazar-gunu-kaosu",
  title: "Pazar Günü Kaosu",
  location: "Kadıköy, pazar sokağı",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da eşim {isim2}. Sokak bugün çok sakinmiş, hep böyle mi?" },
        { speaker: "customer2", text: "Hafta içi böyleyse harika olur açıkçası." },
      ],
      choices: [
        { id: "a", text: "\"Hafta içi tamamen böyle sakin, evet.\"", next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: "\"Genelde sakin, sadece pazar günleri farklı.\"", next: "enter", effects: { interest: 5 } },
        { id: "c", text: "\"Sokağın bir de canlı bir yüzü var, göreceksiniz.\"", next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte salon, sokağa nazır geniş pencereler." },
        { speaker: "customer1", text: "\"Pazar günleri farklı\" derken ne demek istediniz tam olarak?" },
      ],
      choices: [
        { id: "a", text: "\"Sokak pazarı kuruluyor, biraz kalabalık oluyor sadece.\"", next: "q1_a", effects: { suspicion: 10 } },
        { id: "b", text: "\"Haftada bir gün pazar var, geri kalan altı gün sessiz.\"", next: "q1_b" },
        { id: "c", text: "\"Pazar günleri sokak bir festivale dönüşüyor resmen.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: "\"Biraz kalabalık\" ne kadar kalabalık acaba?" }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Altı gün sessizse idare ederiz bence." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(güler) Festival demek hoşuma gitti doğrusu." }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(pencereden dışarı bakar) O tezgahlar şimdiden mi kuruluyor yoksa?" },
        { speaker: "emlah", text: "(pencereye göz atar) Yarın pazar, bir gün erken hazırlık yapıyorlar galiba." },
        { speaker: "customer2", text: "Erkenciler varmış demek ki." },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta pazar günü payı diye bir esneklik olur mu?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: "\"Bu sokak bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdik, pazara da alışırız zamanla." },
        { speaker: "emlah", text: "Hayırlı olsun, pazar günleri file almayı unutmayın." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Bir pazar günü gelip gerçekten görelim, sonra karar veririz." },
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
};

export const houseYanlisAdresKargo: HouseScene = {
  id: "yanlis-adres-kargo",
  title: "Yanlış Adres Kargo Durağı",
  location: "Bahçelievler, apartman girişi",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Kapıda bir sürü kargo kutusu vardı, hepsi bu daireye mi ait?" },
      ],
      choices: [
        { id: "a", text: "\"Hayır hayır, o kutular önceki sakinin, temizlenecek.\"", next: "enter" },
        { id: "b", text: "\"Açıkçası bina biraz kargo durağı gibi kullanılıyor bazen.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Herkes bu binaya güveniyor, kargoları buraya bırakıyor.\"", next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte daire, giriş kata çok yakın, pratik bir konum." },
        { speaker: "customer1", text: "(kapı çalar, dışarıda biri \"kargom burada mı\" diye bağırır) Bu sık oluyor mu?" },
      ],
      choices: [
        { id: "a", text: "\"Nadiren oluyor, yanlış anlaşılma sadece.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Biraz sık oluyor açıkçası, kapıya bir not asabilirsiniz.\"", next: "q1_b" },
        { id: "c", text: "\"En azından hiç yalnız hissetmezsiniz, sürekli ziyaretçi oluyor.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Yanlış anlaşılma\" derken kaç kişi geldi bugün acaba?" }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Not fikri mantıklı, deneriz." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Sürekli ziyaretçi... bir bakıma sosyalleşme fırsatı." }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(kapı yine çalar, bu sefer bir kurye \"iki kargo daha var\" der) Vay canına." },
        { speaker: "emlah", text: "(gülümser) Görüyorsunuz, bina gerçekten popüler bir adres." },
        { speaker: "customer1", text: "Popüler kelimesini böyle kullanmak hiç aklıma gelmezdi." },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu \"popülerlik\" payı diye bir indirim var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %10 indirim ayarlarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, bir tabela asarım kapıya." },
        { speaker: "emlah", text: "Hayırlı olsun, kuryelerle iyi geçinin." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir gün daha sakin bir saatte gelip bakayım, sonra karar veririm." },
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
};

export const houseFotografNoktasiBahce: HouseScene = {
  id: "fotograf-noktasi-bahce",
  title: "Fotoğraf Noktası Bahçe",
  location: "Moda, sahil arkası",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Bahçedeki o beyaz kemer çok şık, kendiniz mi yaptırdınız?" },
      ],
      choices: [
        { id: "a", text: "\"Ev sahibi yaptırmış, herkesin dikkatini çekiyor.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"Yaptırmış ama biraz da ünlü oldu açıkçası, göstereyim.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Önce bahçeye bakalım, kendiniz göreceksiniz.\"", next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte bahçe, o kemer gerçekten fotoğraflık." },
        { speaker: "customer1", text: "(bahçe kapısının önünde bir çift telefonla poz veriyordur) Bunlar kim, tanıdığınız mı?" },
      ],
      choices: [
        { id: "a", text: "\"Tanımıyorum, muhtemelen yoldan geçen biri.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Açıkçası bu kemer Instagram'da meşhur oldu, sık böyle oluyor.\"", next: "q1_b", effects: { interest: 5 } },
        { id: "c", text: "\"Ücretsiz fotoğraf stüdyonuz var sayılır artık.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Yoldan geçen biri bahçenin içine mi girdi yani?" }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Meşhur olmak hoş ama biraz da tuhaf." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Stüdyo fikri fena değil aslında." }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(bir başka çift daha gelir, kemerin önünde sıraya girerler) Bu ciddi mi şimdi?" },
        { speaker: "emlah", text: "(gülümser) Hafta sonları biraz daha yoğun oluyor açıkçası." },
        { speaker: "customer1", text: "Hafta sonu sırası bile var yani." },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu \"ünlülük\" payı diye bir indirim düşünülür mü?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %7 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 7 } },
        { id: "b", text: "\"Bu bahçe bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: "\"Fiyat zaten bu bahçeye göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, belki bir de tabela koyarım ücretli diye." },
        { speaker: "emlah", text: "Hayırlı olsun, iyi kareler dilerim." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir hafta sonu daha gelip yoğunluğu görmek isterim, sonra karar veririm." },
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
};

export const houseParanoyakKameraKomsusu: HouseScene = {
  id: "paranoyak-kamera-komsusu",
  title: "Paranoyak Kamera Komşusu",
  location: "Bahçeşehir, site içi",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da eşim {isim2}. Komşunun duvarında bir sürü kamera var, fark ettiniz mi?" },
        { speaker: "customer2", text: "Sayabildiğim kadarıyla en az sekiz tane vardı." },
      ],
      choices: [
        { id: "a", text: "\"Fark ettim, güvenlik konusunda hassas biri sadece.\"", next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: "\"Evet, biraz fazla kaçıyor ama size bir zararı yok.\"", next: "enter" },
        { id: "c", text: "\"O kameralar sayesinde mahalle çok güvenli sayılır.\"", next: "enter", effects: { fun: 5, interest: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte salon, geniş ve ferah." },
        { speaker: "customer1", text: "(pencereden bakar) O kameralardan biri tam bizim pencereye bakıyor sanki." },
      ],
      choices: [
        { id: "a", text: "\"Öyle görünüyor ama muhtemelen kendi bahçesini çekiyordur.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Haklısınız, isterseniz yönetimle konuşup açı değiştirmesini isteyebiliriz.\"", next: "q1_b", effects: { interest: 10 } },
        { id: "c", text: "\"En azından evinizi kimse asla soyamaz, bedava güvenlik.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: "\"Muhtemelen\" pek güven verici bir kelime değil açıkçası." }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Yönetimle konuşmak iyi bir ilk adım olur." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(gülümser) Bedava güvenlik fikri hoşuma gitti." }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(tam o sırada komşunun panjuru hafifçe aralanır, biri dikkatle bakar sonra hızla kapatır)" },
        { speaker: "customer2", text: "(irkilir) O da neydi öyle?" },
        { speaker: "emlah", text: "(gülümser) Meraklı bir komşu sadece, alışırsınız zamanla." },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu durumu göz önünde bulundurur musunuz?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Bu site bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdik, perde kalın olsun yeter." },
        { speaker: "emlah", text: "Hayırlı olsun, komşunuzla iyi geçinin." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Bir de akşam gelip komşuyu gözlemleyelim, sonra karar veririz." },
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
};

export const houseAntikaciElektrikTesisati: HouseScene = {
  id: "antikaci-elektrik-tesisati",
  title: "Antikacı Elektrik Tesisatı",
  location: "Çukurcuma, antikacılar sokağı",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Alt kattaki antikacı dükkanı çok şirin, komşuluk nasıl acaba?" },
      ],
      choices: [
        { id: "a", text: "\"Çok iyi, kendisi de bina için epey emek veriyor.\"", next: "enter", effects: { interest: 10 } },
        { id: "b", text: "\"İyi ama küçük bir elektrik tesisatı detayı var, göstereyim.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Önce içeri geçelim, sonra her şeyi anlatırım.\"", next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte daire, eski bina dokusu hâlâ korunmuş." },
        { speaker: "customer1", text: "(ışık düğmesine basar, ışık titrer) Elektrik tesisatı bu bina için biraz eski mi kalmış?" },
      ],
      choices: [
        { id: "a", text: "\"Biraz eski, ama antikacı beyle paylaştığınız için sorun çıkmıyor.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Eski evet, yenilenmesi gerekiyor ama fiyata da yansıdı bu.\"", next: "q1_b" },
        { id: "c", text: "\"Eski tesisatın kendine has bir karakteri var, alışırsınız.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Paylaştığınız\" derken, aynı sigortayı mı kullanıyoruz yani?" }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Fiyata yansımışsa mantıklı bir denge." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) \"Karakter\" demek hoşuma gitti." }], next: "surpriz" },

    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(tam o sırada tüm ışıklar aniden söner, alt kattan antikacının sesi gelir: \"Kusura bakmayın, ütüyü taktım!\")" },
        { speaker: "emlah", text: "(gülümser, karanlıkta el yordamıyla) Gördüğünüz gibi, birkaç saniyede geri geliyor." },
        { speaker: "customer1", text: "(ışıklar geri gelir) Vay canına, gerçekten de geldi." },
      ],
      next: "price",
    },

    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu tesisat durumu için bir esneklik var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %11 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 11 } },
        { id: "b", text: "\"Fiyat zaten bu dokuya göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, antikacı beyle ütü saatlerini konuşurum." },
        { speaker: "emlah", text: "Hayırlı olsun, mum bulundurmanızı öneririm yine de." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir de akşam ütü saatinde gelip görmek isterim, sonra karar veririm." },
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
};

export const houseKarincaKolonisi: HouseScene = {
  id: "karinca-kolonisi",
  title: "Karınca Kolonili Bahçe",
  location: "Ümraniye, bahçe katı",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Bahçe katı diye yazıyordu, bahçeyi görünce şaşırdım biraz." },
        { speaker: "customer1", text: "Taşların arasında minik yollar var, bunlar ne?" },
      ],
      choices: [
        { id: "a", text: "\"O yollar karınca kolonisine ait, epey düzenliler.\"", next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: "\"Doğal bir peyzaj detayı diyelim, göz alıcı değil mi?\"", next: "enter", effects: { fun: 5 } },
        { id: "c", text: "\"Önce içeri geçelim, bahçeyi sonra konuşuruz.\"", next: "enter" },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte salon, bahçeye açılan geniş kapı." },
        { speaker: "customer1", text: "(dışarı bakar) O karıncalar içeri de giriyor mu yoksa sadece bahçede mi kalıyorlar?" },
      ],
      choices: [
        { id: "a", text: "\"Sadece bahçede kalıyorlar, hiç içeri girmezler.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Bazen mutfağa kadar geliyorlar açıkçası, ama zararsızlar.\"", next: "q1_b" },
        { id: "c", text: "\"Ev sahibi de sayılırlar bir bakıma, düzenli çalışkan komşular.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Hiç girmezler\" cümlesine tam güvenemedim açıkçası." }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Zararsız olmaları biraz rahatlattı beni." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Çalışkan komşular... bu bakış açısını sevdim." }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(yere bakar, küçük bir karınca kervanı ayakkabısının yanından geçer) Vay canına, gerçekten düzenliler." },
        { speaker: "emlah", text: "Görüyorsunuz, kendi hallerinde, kimseye karışmıyorlar." },
        { speaker: "customer1", text: "Doğrusu bu kadar disiplinli bir koloniye saygı duydum." },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu bahçe detayı için bir esneklik var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %9 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: "\"Fiyat zaten bu bahçeye göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu bahçe bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, karıncalarla aramız iyi olur umarım." },
        { speaker: "emlah", text: "Hayırlı olsun, onlara da selam söyleyin." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir de yağmurdan sonra gelip bahçeyi görmek isterim, sonra karar veririm." },
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
};

export const houseHaliSahaKomsulugu: HouseScene = {
  id: "hali-saha-komsulugu",
  title: "Halı Saha Komşuluğu",
  location: "Bahçelievler, spor tesisi arkası",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da eşim {isim2}. Arka tarafta bir spor sahası var galiba." },
        { speaker: "customer2", text: "Akşamları maç falan oluyor mu orada?" },
      ],
      choices: [
        { id: "a", text: "\"Oluyor, ama sadece hafta sonları, çok az.\"", next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: "\"Her akşam maç var açıkçası, çok işlek bir saha.\"", next: "enter" },
        { id: "c", text: "\"Balkondan izlemek bile bir avantaj sayılır, bedava maç keyfi.\"", next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte balkon, sahaya nazır bir manzara." },
        { speaker: "customer1", text: "(topun sesini duyar) Top buraya kadar geliyor mu bazen?" },
      ],
      choices: [
        { id: "a", text: "\"Nadiren geliyor, file yeterince yüksek çünkü.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Bazen geliyor açıkçası, balkon camına file taktırabiliriz.\"", next: "q1_b" },
        { id: "c", text: "\"Gelirse de bedava hediye sayılır, toplayıp geri verirsiniz.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: "\"Nadiren\" kelimesi biraz belirsiz kaldı ama devam edelim." }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "File fikri mantıklı, düşünürüz." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(güler) Bedava hediye demek hoşuma gitti." }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(tam o sırada bir top balkona doğru uçar, korkuluğa çarpar) Aaa!" },
        { speaker: "emlah", text: "(gülümser) İşte tam bahsettiğimiz şey, ama zararsız geçti." },
        { speaker: "customer2", text: "Zararsız oldu ama kalbim ağzıma geldi resmen." },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu saha komşuluğu için bir esneklik olur mu?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %10 indirim ayarlarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 10 } },
        { id: "b", text: "\"Bu konum bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdik, fileyi de kendimiz taktırırız." },
        { speaker: "emlah", text: "Hayırlı olsun, maç akşamları keyifli seyirler." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Bir akşam maç saatinde gelip görelim, sonra karar veririz." },
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
};

export const houseYosunluOrtakHavuz: HouseScene = {
  id: "yosunlu-ortak-havuz",
  title: "Yosunlu Ortak Havuz",
  location: "Beylikdüzü, site içi",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. İlanda \"havuzlu site\" yazıyordu, havuzu görebilir miyiz?" },
      ],
      choices: [
        { id: "a", text: "\"Tabii, hemen aşağıda, size göstereyim.\"", next: "enter" },
        { id: "b", text: "\"Gösterebilirim ama şu an biraz bakım aşamasında, uyarayım.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Havuz gerçekten sitenin gözdesi, göreceksiniz.\"", next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte havuz, geniş bir alanda." },
        { speaker: "customer1", text: "(suya bakar) Su rengi biraz yeşilimsi değil mi, yoksa öyle mi olması gerekiyor?" },
      ],
      choices: [
        { id: "a", text: "\"Bugün öyle, yarın tamamen berraklaşır, sürekli değil bu.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Açıkçası bakım biraz aksıyor son zamanlarda.\"", next: "q1_b" },
        { id: "c", text: "\"Doğal bir yeşillik diyelim, göl kenarı hissi veriyor.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "\"Bugün öyle\" cümlesini daha önce de duymuştum sanki." }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Aksıyor olması can sıkıcı ama en azından net konuştunuz." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(güler) Göl kenarı hissi... yaratıcı bir açıklama oldu." }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(havuzun kenarında \"BAKIM ÇALIŞMASI - 3. HAFTA\" yazan bir tabela fark eder) Bu tabela ne kadardır burada?" },
        { speaker: "emlah", text: "(hızla) O tabela eski, yönetim güncellemeyi unutmuş olmalı." },
        { speaker: "customer1", text: "Umarım öyledir, üç hafta uzun bir süre." },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu havuz durumu için bir esneklik var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Fiyat zaten bu siteye göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, havuz berraklaşınca ilk ben yüzerim." },
        { speaker: "emlah", text: "Hayırlı olsun, mayonuzu hazır tutun." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Havuz berraklaşınca bir daha gelip bakayım, sonra karar veririm." },
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
};

export const houseRehberliTurDuragi: HouseScene = {
  id: "rehberli-tur-duragi",
  title: "Rehberli Tur Durağı",
  location: "Balat, renkli sokak",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Sokak çok renkli ve şirin, tam aradığım gibi." },
        { speaker: "customer1", text: "Dışarıda bir grup insan fotoğraf çekiyordu, sürekli böyle mi burası?" },
      ],
      choices: [
        { id: "a", text: "\"Hayır, bugün tesadüfen öyle oldu sadece.\"", next: "enter" },
        { id: "b", text: "\"Açıkçası burası bir tur güzergahında, göstereyim.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Sokağınız ünlü sayılır, bu da bir artı değil mi?\"", next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte salon, sokağa nazır güzel bir pencere." },
        { speaker: "customer1", text: "(dışarıdan bir rehberin sesi gelir: \"...ve bu evde 100 yıl önce bir hazine bulunmuştu!\") Bu doğru mu?" },
      ],
      choices: [
        { id: "a", text: "\"Kesinlikle doğru, tapu kayıtlarında da var bu bilgi.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Açıkçası rehberler biraz abartıyor, gerçek değil bu hikaye.\"", next: "q1_b", effects: { suspicion: 0, fun: 5 } },
        { id: "c", text: "\"Belki de gerçektir, kim bilir neler saklı duvarların ardında.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Tapuda hazine kaydı olması biraz garip geldi açıkçası." }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Abartı olması beni rahatlattı biraz." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) Gizem her zaman hoştur, itiraf edeyim." }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(pencereden dışarı bakar, bütün grup evi işaret ederek fotoğraf çekiyordur) Bu her gün mü oluyor?" },
        { speaker: "emlah", text: "(gülümser) Günde birkaç tur geçiyor, alışırsınız zamanla." },
        { speaker: "customer1", text: "Ünlü olmak sanırım böyle bir şey." },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu \"turistik\" konum için bir esneklik var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Bu sokak bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, belki ben de hazine hikayesini anlatırım artık." },
        { speaker: "emlah", text: "Hayırlı olsun, iyi pozlar dilerim." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir tur saatinde daha gelip bakayım, sonra karar veririm." },
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
};

export const houseBalikHaliSabahGurultusu: HouseScene = {
  id: "balik-hali-sabah-gurultusu",
  title: "Balık Hali Sabah Gürültüsü",
  location: "Kumkapı, liman arkası",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}, bu da eşim {isim2}. Denize yakınlık çok hoşumuza gitti." },
        { speaker: "customer2", text: "Balık kokusu da hafif geliyor buraya kadar galiba." },
      ],
      choices: [
        { id: "a", text: "\"Hafif geliyor evet, ama rüzgarla çabuk dağılıyor.\"", next: "enter", effects: { suspicion: 10 } },
        { id: "b", text: "\"Açıkçası hemen yanımızda balık hali var, ondan geliyor.\"", next: "enter" },
        { id: "c", text: "\"Deniz ürünü tazeliği her sabah kapınıza kadar geliyor sayılır.\"", next: "enter", effects: { fun: 5 } },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte salon, sabahları çok aydınlık oluyor." },
        { speaker: "customer1", text: "(saatine bakar) Balık hali sabah kaçta açılıyor peki, çok erken mi?" },
      ],
      choices: [
        { id: "a", text: "\"Sabah beşte açılıyor ama sesi pek gelmiyor buraya.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Sabah beşte açılıyor, açıkçası ilk saatler biraz gürültülü.\"", next: "q1_b" },
        { id: "c", text: "\"Doğal alarm saati diyelim, kahve fincanınızı hazırlarsınız.\"", next: "q1_c", effects: { fun: 15, suspicion: 10 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer2", text: "\"Pek gelmiyor\" cümlesi tam güven vermedi açıkçası." }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Erken kalkmaya alışkınız zaten, idare ederiz." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer2", text: "(güler) Doğal alarm saati... bu tanımı sevdim." }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(uzaktan bir satıcının bağırışı duyulur: \"Taze palamut, taze!\") Vay canına, gerçekten duyuluyormuş." },
        { speaker: "emlah", text: "(gülümser) Sabahları biraz canlı oluyor evet, ama akşamları sessiz." },
        { speaker: "customer2", text: "Akşam sessizse dengeli bir anlaşma sayılır bu." },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu sabah gürültüsü için bir esneklik olur mu?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %9 indirim ayarlarım.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 9 } },
        { id: "b", text: "\"Bu konum bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
        { id: "c", text: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdik, kulak tıkacı alırız gerekirse." },
        { speaker: "emlah", text: "Hayırlı olsun, taze balığı kaçırmayın." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer2", text: "Bir sabah erken gelip gürültüyü duyalım, sonra karar veririz." },
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
};

export const houseRuyaYorumcusuKomsu: HouseScene = {
  id: "ruya-yorumcusu-komsu",
  title: "Rüya Yorumcusu Komşu",
  location: "Üsküdar, sakin sokak",
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
        { speaker: "customer1", text: "Merhaba, ben {isim}. Merdivende bir kalabalık gördüm, aşağı kattaki komşu mu meşhur?" },
      ],
      choices: [
        { id: "a", text: "\"Evet, mahallede tanınan bir rüya yorumcusu kendisi.\"", next: "enter", effects: { fun: 5 } },
        { id: "b", text: "\"Öyle, ama bunun küçük bir sonucu da var, göstereyim.\"", next: "enter", effects: { suspicion: 5 } },
        { id: "c", text: "\"Önce içeri geçelim, detayları sonra anlatırım.\"", next: "enter" },
      ],
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "emlah", text: "İşte daire, merdivenden biraz uzak, sakin bir konumda." },
        { speaker: "customer1", text: "(merdivenden bir tütsü kokusu gelir) O koku aşağıdan mı geliyor?" },
      ],
      choices: [
        { id: "a", text: "\"Evet, komşu seansları sırasında tütsü yakıyor genelde.\"", next: "q1_a", effects: { suspicion: 15 } },
        { id: "b", text: "\"Doğru, ama sadece belirli günlerde oluyor, sürekli değil.\"", next: "q1_b" },
        { id: "c", text: "\"Binanın kendine has bir atmosferi var diyelim, ilgi çekici.\"", next: "q1_c", effects: { fun: 15, suspicion: 5 } },
      ],
    },
    q1_a: { id: "q1_a", lines: [{ speaker: "customer1", text: "Seans sırasında merdivende kalabalık da oluyor mu peki?" }], next: "surpriz" },
    q1_b: { id: "q1_b", lines: [{ speaker: "customer1", text: "Belirli günlerse idare ederiz sanırım." }], next: "surpriz" },
    q1_c: { id: "q1_c", lines: [{ speaker: "customer1", text: "(gülümser) İlgi çekici kelimesini duymak hoşuma gitti." }], next: "surpriz" },
    surpriz: {
      id: "surpriz",
      lines: [
        { speaker: "customer1", text: "(merdivenden bir ses yükselir: \"Sıradaki lütfen!\") Vay canına, gerçekten sıra varmış." },
        { speaker: "emlah", text: "(gülümser) Kendisi epey talep görüyor, ünü mahalle dışına da yayılmış." },
        { speaker: "customer1", text: "Belki bir gün ben de bir rüyamı yorumlatırım." },
      ],
      next: "price",
    },
    price: {
      id: "price",
      lines: [{ speaker: "customer1", text: "Fiyatta bu komşuluk durumu için bir esneklik var mı?" }],
      choices: [
        { id: "a", text: "\"Sahibiyle konuşup %8 indirim sağlayabilirim.\"", next: "closing_sold", effects: { closingBias: 35, suspicion: -10, discountPercent: 8 } },
        { id: "b", text: "\"Fiyat zaten bu konuma göre makul, düşünebilirsiniz.\"", next: "closing_thinking", effects: { closingBias: 0 } },
        { id: "c", text: "\"Bu daire bu fiyata bir daha çıkmaz, hemen karar vermelisiniz.\"", next: "closing_lost", effects: { closingBias: -35, suspicion: 20 } },
      ],
    },
    closing_sold: {
      id: "closing_sold",
      lines: [
        { speaker: "customer1", text: "İndirimle birlikte karar verdim, belki bir seans da ben alırım." },
        { speaker: "emlah", text: "Hayırlı olsun, güzel rüyalar dilerim." },
      ],
      end: "sold",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", text: "Bir seans gününde daha gelip atmosferi görmek isterim, sonra karar veririm." },
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
