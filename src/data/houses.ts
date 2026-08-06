import type { HouseScene } from "../types";

export const houseKokuluStudyo: HouseScene = {
  id: "kokulu-studyo",
  title: "Kokulu Stüdyo",
  location: "Nişantaşı, 3. kat",
  customerNames: ["Selin"],
  background: "placeholder-house-1",
  startNode: "start",
  nodes: {
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Selin", text: "Merhaba, ben Selin. Eşim biraz gecikecek, trafikte kalmış." },
        { speaker: "emlah", text: "Sorun değil, ben başta genel bir tur attırayım, o gelince detaylara girer." },
        { speaker: "customer1", name: "Selin", text: "Olur, açıkçası çok heyecanlıyım. İlk evimiz olacak bu." },
        { speaker: "thought", text: "Harika, tam da heyecanını kırmak isteyeceğim bir an geliyor." },
        { speaker: "customer1", name: "Selin", text: "Fotoğraflarda çok ferah görünüyordu, umarım gerçekte de öyledir." },
        { speaker: "emlah", text: "Merak etmeyin, girer girmez göreceksiniz." },
      ],
      next: "enter",
    },
    enter: {
      id: "enter",
      lines: [
        { speaker: "customer1", name: "Selin", text: "(burnunu çeker) Bu koku... nedir?" },
        { speaker: "customer1", name: "Selin", text: "Yani girer girmez fark ettim, çok belirgin." },
        { speaker: "customer1", name: "Selin", text: "Fotoğraflarda böyle bir şey yoktu tabii, koku hissettirmiyor ki." },
        { speaker: "thought", text: "Şimdi ya dürüst olacağım ya da çok yaratıcı olacağım." },
        { speaker: "customer1", name: "Selin", text: "Yoksa bir sorun mu var, su falan mı kaçırıyor?" },
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
        { speaker: "customer1", name: "Selin", text: "Karakterli... İlginç bir tabir doğrusu." },
        { speaker: "customer1", name: "Selin", text: "Yani bunu satış cümlesi olarak mı söylüyorsunuz, yoksa gerçekten mi öyle düşünüyorsunuz?" },
        { speaker: "emlah", text: "İkisi de olabilir." },
        { speaker: "thought", text: "Aslında hiçbiri, ama devam et." },
        { speaker: "customer1", name: "Selin", text: "Eşim gelince o da fark edecektir muhtemelen, ona da mı aynı şeyi söyleyeceksiniz?" },
        { speaker: "emlah", text: "Gerekirse söylerim, tutarlı olmak önemli." },
        { speaker: "customer1", name: "Selin", text: "(hafifçe güler) İlginç bir taktik." },
      ],
      next: "q2",
    },
    q1_b: {
      id: "q1_b",
      lines: [
        { speaker: "customer1", name: "Selin", text: "Hı, en azından bunu söylediniz." },
        { speaker: "customer1", name: "Selin", text: "Yani gizlemeye çalışmadınız, bunu takdir ediyorum aslında." },
        { speaker: "emlah", text: "Gizlesem zaten fark ederdiniz, boşuna uğraşmayayım dedim." },
        { speaker: "customer1", name: "Selin", text: "Doğru ama... alt kattan sürekli koku gelmesi biraz rahatsız edici olur uzun vadede." },
        { speaker: "emlah", text: "Pencereyi açık tutarsanız çok azalıyor, ben de öyle duydum." },
        { speaker: "customer1", name: "Selin", text: "Eşimle konuşurum bunu." },
      ],
      next: "closing_thinking",
    },
    q1_c: {
      id: "q1_c",
      lines: [
        { speaker: "customer1", name: "Selin", text: "(pencereye bakar, biraz tereddütlü) Işık güzelmiş aslında, itiraf edeyim." },
        { speaker: "customer1", name: "Selin", text: "Ama konuyu değiştirdiğinizi de fark ettim, kokuyla ilgili bir sorun mu var yani?" },
        { speaker: "emlah", text: "Sorun demeyelim, küçük bir detay diyelim." },
        { speaker: "customer1", name: "Selin", text: "Küçük detaylar büyür bazen, özellikle her gün yaşayacağınız bir yerde." },
        { speaker: "emlah", text: "Haklısınız, ama manzara da gerçek bir avantaj, onu göz ardı etmeyelim." },
        { speaker: "customer1", name: "Selin", text: "(gülümser) Pes etmiyorsunuz." },
      ],
      next: "closing_thinking",
    },
    q2: {
      id: "q2",
      lines: [
        { speaker: "customer1", name: "Selin", text: "Peki bu koku sağlığa zararlı değil mi? Yani uzun vadede." },
        { speaker: "customer1", name: "Selin", text: "Çünkü burada yaşayacaksak, her gün bu kokuyu solumuş olacağız." },
        { speaker: "thought", text: "Buna cevap verirken bir sınır var, geçersem iş biter." },
        { speaker: "customer1", name: "Selin", text: "Doktorumla da konuşmam gerekebilir belki, ne düşünüyorsunuz?" },
      ],
      choices: [
        { id: "a", text: "\"Kesinlikle değil, hatta bazı doktorlar deterjan kokusunun rahatlatıcı olduğunu söylüyor.\"", next: "q2_a", effects: { suspicion: 25 } },
        { id: "b", text: "\"Açıkçası emin değilim ama pencereyi açık tutabilirsiniz.\"", next: "q2_b", effects: { suspicion: 5 } },
        { id: "c", text: "\"Sağlığa zararlı olsa satışta olmazdı herhalde.\"", next: "q2_c", effects: { suspicion: 0, fun: 15 } },
      ],
    },
    q2_a: {
      id: "q2_a",
      lines: [
        { speaker: "customer1", name: "Selin", text: "(şüpheyle bakar) Doktorlar mı demiştiniz, hangi doktorlar?" },
        { speaker: "customer1", name: "Selin", text: "Çünkü bu ilk defa duyduğum bir bilgi, biraz araştırmam lazım galiba." },
        { speaker: "emlah", text: "Genel bir bilgi aslında, spesifik bir isim veremem şu an." },
        { speaker: "customer1", name: "Selin", text: "Anladım... (not alır gibi yapar) Bunu bir de eşime sorayım." },
        { speaker: "thought", text: "O not defterini hiç sevmedim." },
      ],
      next: "closing_lost",
    },
    q2_b: {
      id: "q2_b",
      lines: [
        { speaker: "customer1", name: "Selin", text: "Mantıklı, en azından bir çözüm öneriyorsunuz." },
        { speaker: "customer1", name: "Selin", text: "Pencereyi hep açık tutmak kışın biraz zor olur ama düşünürüz." },
        { speaker: "emlah", text: "Doğru, ama alt kattaki dükkan da akşam 7'de kapanıyor, geceleri sorun olmaz." },
        { speaker: "customer1", name: "Selin", text: "O bilgi işe yarar aslında, teşekkürler." },
      ],
      next: "closing_thinking",
    },
    q2_c: {
      id: "q2_c",
      lines: [
        { speaker: "customer1", name: "Selin", text: "(gülümser) Sizde de bir mantık var, itiraf edeyim." },
        { speaker: "customer1", name: "Selin", text: "Ama bu mantığı biraz fazla kullanıyorsunuz gibi hissettim açıkçası." },
        { speaker: "emlah", text: "İşin doğası böyle, ben de bazen kendime inanmakta zorlanıyorum." },
        { speaker: "customer1", name: "Selin", text: "(kahkaha atar) En azından dürüstsünüz bu konuda." },
      ],
      next: "closing_thinking",
    },
    closing_thinking: {
      id: "closing_thinking",
      lines: [
        { speaker: "customer1", name: "Selin", text: "Eşimle konuşup size dönerim, düşüneceğiz." },
        { speaker: "customer1", name: "Selin", text: "Aslında ilk izlenimim kadar kötü değilmiş burası, koku dışında güzel bir yer." },
        { speaker: "emlah", text: "Ne zaman isterseniz arayabilirsiniz, elimde birkaç seçenek daha var ama bu da fena değil." },
        { speaker: "customer1", name: "Selin", text: "Teşekkürler, haber veririm." },
      ],
      end: "thinking",
    },
    closing_lost: {
      id: "closing_lost",
      lines: [
        { speaker: "customer1", name: "Selin", text: "Biliyor musunuz, bu koku beni gerçekten rahatsız etti." },
        { speaker: "customer1", name: "Selin", text: "Ve doktorlar konusunda da pek ikna olmadım açıkçası." },
        { speaker: "emlah", text: "Anlıyorum, herkes için doğru ev farklı olabilir." },
        { speaker: "customer1", name: "Selin", text: "Sanırım burası bize göre değil, vaktinizi aldım kusura bakmayın." },
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
    start: {
      id: "start",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "(girer girmez durur) Buranın enerjisi... ağır." },
        { speaker: "customer2", name: "Kaan", text: "Anne, daha bakmadık bile, en azından bir tur atalım." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Ben hissediyorum böyle şeyleri, sen gençsin daha anlamazsın." },
        { speaker: "thought", text: "Enerji mi? Daha kapıdan girmedik, hızlı başladık." },
        { speaker: "customer2", name: "Kaan", text: "Emlah Bey, siz de mi hissediyorsunuz bir şey?" },
        { speaker: "emlah", text: "Açıkçası hemen bir yorum yapmak istemem, önce görelim istiyorum." },
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
        { speaker: "customer1", name: "Nermin Hanım", text: "Çünkü ben böyle şeylere karşı hassasımdır, boşuna değildir bu hislerim." },
        { speaker: "customer2", name: "Kaan", text: "Anne yine mi başlıyoruz..." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Sus Kaan, adam bir şey söylemeye çalışıyor." },
        { speaker: "thought", text: "Şimdi bir hikaye uydurmam lazım, hem de iyi bir tane." },
      ],
      next: "q2",
    },
    q1_b: {
      id: "q1_b",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Siz gençler hiçbir şeye inanmıyorsunuz, hep mantıkla açıklıyorsunuz." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Ama bazı şeyler mantığın ötesinde, bunu bir gün anlarsınız." },
        { speaker: "customer2", name: "Kaan", text: "(gülümser) Bence de biraz eski boya kokusu var sadece anne." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Sen de mi onun tarafını tutuyorsun şimdi?" },
        { speaker: "thought", text: "Aile içi tartışmaya karışmayayım en iyisi." },
      ],
      next: "closing_neutral",
    },
    q1_c: {
      id: "q1_c",
      lines: [
        { speaker: "customer2", name: "Kaan", text: "Anne bak, o bile hissediyor, sana söylemiştim!" },
        { speaker: "customer1", name: "Nermin Hanım", text: "(Emlah'a döner) Demek siz de duyarlısınız bu konularda." },
        { speaker: "customer1", name: "Nermin Hanım", text: "İyi, en azından beni anlayan biri var burada." },
        { speaker: "emlah", text: "Evler gerçekten çok şey görür, insanların hayatlarına tanık olur." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Tam da düşündüğüm gibi." },
      ],
      next: "closing_warm",
    },
    q2: {
      id: "q2",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Anlatın bakalım, merakla bekliyorum." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Kimler yaşamış burada, ne olmuş, hepsini duymak istiyorum." },
        { speaker: "customer2", name: "Kaan", text: "(Emlah'a fısıldar gibi) Anneme bir şey anlatırken dikkatli olun, her detayı sorgular." },
        { speaker: "thought", text: "Şimdi ya bir hikaye uydururum ya da bu satış burada biter." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Bekliyorum, konuşun." },
      ],
      choices: [
        { id: "a", text: "\"Eskiden burada bir ressam yaşarmış, çok mutlu bir hayat sürmüş, evine aşıkmış.\"", next: "q2_a", effects: { suspicion: -10 } },
        { id: "b", text: "\"Açıkçası internette 'gece kapı kendi kendine açıldı' diye bir yorum gördüm ama muhtemelen rüzgardır.\"", next: "q2_b", effects: { interest: 30 } },
        { id: "c", text: "\"Detayları bilmiyorum ama binanın enerjisi olumlu, hissediyorum.\"", next: "q2_c", effects: { suspicion: 15, fun: 10 } },
      ],
    },
    q2_a: {
      id: "q2_a",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "(gülümser) Bir ressam... ne güzel, sanatçı ruhu kalmış demek buraya." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Kaan, duydun mu, bu ev sanata aşık birinden kalma." },
        { speaker: "customer2", name: "Kaan", text: "Duydum anne, güzelmiş gerçekten." },
        { speaker: "emlah", text: "Evet, hatta bazı komşular hâlâ ondan bahsediyor, çok sevilen biriymiş." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Bu ev bize uyar sanırım, hissediyorum artık daha net." },
      ],
      next: "closing_sold_ressam",
    },
    q2_b: {
      id: "q2_b",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "(gözleri parlar) Kapı kendi kendine mi açılmış? Bunu neden hemen söylemediniz?" },
        { speaker: "customer1", name: "Nermin Hanım", text: "Kaan bak, burası özel bir yer, tam da aradığımız gibi bir şey bu!" },
        { speaker: "customer2", name: "Kaan", text: "Anne, bu iyi bir şey mi şimdi kötü bir şey mi?" },
        { speaker: "customer1", name: "Nermin Hanım", text: "Tabii ki iyi, buranın bir ruhu var demek, sıradan bir daire değil bu." },
        { speaker: "thought", text: "Bazı insanlar için hayalet bir eksi değil, bir artı oluyormuş meğer." },
      ],
      next: "closing_sold_hayalet",
    },
    q2_c: {
      id: "q2_c",
      lines: [
        { speaker: "customer2", name: "Kaan", text: "(Emlah'a fısıldar) Siz de biraz saçmalıyorsunuz galiba, farkındasınız değil mi?" },
        { speaker: "thought", text: "Farkındayım ama işim bu, ne yapayım." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Kaan, saygısız olma, adam elinden geleni yapıyor." },
        { speaker: "customer2", name: "Kaan", text: "Tamam anne, özür dilerim Emlah Bey." },
        { speaker: "emlah", text: "Sorun değil, herkesin bakış açısı farklı olabilir." },
      ],
      next: "closing_thinking_c",
    },
    closing_sold_ressam: {
      id: "closing_sold_ressam",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Biz bu daireyi alıyoruz, kararımı verdim." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Kaan'ın burada resim yapmasını istiyorum, tam ona göre bir yer burası." },
        { speaker: "customer2", name: "Kaan", text: "(Emlah'a göz kırpar) Sağ olun, annemi mutlu ettiniz." },
        { speaker: "emlah", text: "Ben teşekkür ederim, hayırlı olsun." },
      ],
      end: "sold",
    },
    closing_sold_hayalet: {
      id: "closing_sold_hayalet",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Biz bu daireyi alıyoruz, kararımı verdim." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Kaan'ın burada meditasyon yapmasını istiyorum, enerjisi tam ona göre." },
        { speaker: "customer2", name: "Kaan", text: "(Emlah'a göz kırpar) Sağ olun, annemi mutlu ettiniz." },
        { speaker: "emlah", text: "Ben teşekkür ederim, hayırlı olsun." },
      ],
      end: "sold",
    },
    closing_thinking_c: {
      id: "closing_thinking_c",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Biraz daha düşünmemiz lazım sanırım, aceleye getirmeyelim." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Kaan'la konuşup size dönerim, bu önemli bir karar." },
        { speaker: "customer2", name: "Kaan", text: "Teşekkürler Emlah Bey, vaktiniz için." },
        { speaker: "emlah", text: "Ne zaman isterseniz, ben buradayım." },
      ],
      end: "thinking",
    },
    closing_neutral: {
      id: "closing_neutral",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "Bu evle ilgili içim pek rahat değil açıkçası." },
        { speaker: "customer2", name: "Kaan", text: "Anne, düşünelim biraz, hemen karar vermeyelim." },
        { speaker: "customer1", name: "Nermin Hanım", text: "İyi, düşünürüz. Ararız sizi." },
        { speaker: "emlah", text: "Tabii, acele etmeyin." },
      ],
      end: "thinking",
    },
    closing_warm: {
      id: "closing_warm",
      lines: [
        { speaker: "customer1", name: "Nermin Hanım", text: "İçim rahatladı sizinle konuşunca, iyi ki geldik bugün." },
        { speaker: "customer2", name: "Kaan", text: "Anne resmen arkadaş oldunuz." },
        { speaker: "customer1", name: "Nermin Hanım", text: "Eve dönüp aileyle konuşurum, ama olumlu düşünüyorum." },
        { speaker: "emlah", text: "Ne zaman isterseniz buradayım." },
      ],
      end: "thinking",
    },
  },
};

export const allHouses: HouseScene[] = [houseKokuluStudyo, houseHayaletliDaire];
