import type { HouseScene } from "../types";

export const houseKokuluStudyo: HouseScene = {
  id: "kokulu-studyo",
  title: "Kokulu Stüdyo",
  location: "Nişantaşı, 3. kat",
  customerNames: ["Ceylin"],
  background: "placeholder-house-1",
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
        { id: "a", text: "\"Sahibiyle konuşup biraz esneklik sağlayabilirim.\"", next: "closing_sold", effects: { suspicion: -10 } },
        { id: "b", text: "\"Fiyat zaten piyasa değerinin altında, çok payı yok ama düşünebilirim.\"", next: "closing_thinking", effects: { suspicion: 0 } },
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
        { id: "a", text: "\"Bu evin bir ruhu var, Kaan burada kendini gerçekten bulabilir.\"", next: "closing_sold_ruh", effects: { interest: 20 } },
        { id: "b", text: "\"Rasyonel konuşayım: konum, metrekare ve fiyat gerçekten uygun.\"", next: "closing_thinking", effects: { suspicion: 0 } },
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

export const allHouses: HouseScene[] = [houseKokuluStudyo, houseHayaletliDaire];
