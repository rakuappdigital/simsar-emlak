import { formatTL } from "./economy";
import { resolveText, type Localized } from "./language";

/**
 * "Canlı Şehir Nabzı" — a background office-radio ticker. Independent of
 * the chitchat/friend/work-task detour family (it never consumes a screen,
 * just floats a toast over the office for a few seconds), so it's rolled
 * on its own and never gated by hadWorkTaskThisTransition. Mostly city
 * flavor/humor (unconnected to the player), occasionally personalized
 * using data the game already tracks (last big sale, rival standing,
 * boss mood, market news) so it reads as "the city noticing you" rather
 * than a random ticker.
 */

const genericLines: Localized[] = [
  { tr: "Radyo Boğaz FM'den dinliyorsunuz: bu saatlerde köprüde trafik yoğun, sabrınızı da faturaya ekleyin.", en: "Listening to Radio Bosphorus FM: traffic on the bridge is heavy at this hour, add your patience to the bill." },
  { tr: "Bu şehirde bir daire bulmak, sadık bir martı bulmaktan daha kolay değil.", en: "Finding an apartment in this city is no easier than finding a loyal seagull." },
  { tr: "Uzmanlar açıkladı: İstanbul'da 'yakın' kelimesi trafiğe göre değişen bir kavram.", en: "Experts declared: In Istanbul, the word 'close' is a concept that changes depending on traffic." },
  { tr: "Emlak sektöründen flaş haber: bir daire yine 'deniz manzaralı' diye satıldı, deniz üç sokak ötedeymiş.", en: "Breaking news from the real estate sector: an apartment was sold as 'sea view' again, the sea was three streets away." },
  { tr: "Vapur kalktı, martılar simit peşinde, hayat İstanbul'da her zamanki gibi.", en: "The ferry has set off, seagulls are chasing bagels, life in Istanbul is as usual." },
  { tr: "Bugün hava parçalı bulutlu, emlak piyasası ise her zamanki gibi parçalı gerçekçi.", en: "Today is partly cloudy, and the real estate market is partly realistic as usual." },
  { tr: "Bir dinleyicimiz yazdı: 'Semtimde her köşe başında bir emlakçı var.' Rica ederiz, işimiz bu.", en: "A listener wrote: 'There is a real estate agent at every street corner in my neighborhood.' You're welcome, that's our job." },
  { tr: "Şehir efsanesi: Kadıköy'de bir dairenin fiyatı, sahibinin o gün moduna göre değişirmiş.", en: "Urban legend: The price of an apartment in Kadıköy varies depending on the owner's mood that day." },
  { tr: "Bu saatlerde Boğaz'da rüzgar hafif, cüzdanlarda ise her zamanki gibi sert esiyor.", en: "The wind is light on the Bosphorus around these hours, while it blows hard on wallets as usual." },
  { tr: "Flaş: Bir apartman yöneticisi aidat toplarken kayboldu, arayan olursa haber versin.", en: "Flash: A building manager disappeared while collecting dues, let someone know if they see him." },
  { tr: "Uzmanlar uyarıyor: 'Yenilenmiş mutfak' ifadesi bazen sadece yeni bir musluk anlamına gelebilir.", en: "Experts warn: The phrase 'renovated kitchen' can sometimes just mean a new faucet." },
  { tr: "İstanbul trafiğinde geçen bir saat, başka şehirlerde bir hafta eder.", en: "An hour spent in Istanbul traffic equals a week in other cities." },
  { tr: "Bugünkü nem oranı yüksek, emlakçıların iyimserlik oranı ise hep sabit.", en: "Today's humidity rate is high, while real estate agents' optimism rate remains constantly fixed." },
  { tr: "Bir sokak kedisi bugün üçüncü kez aynı apartmanın kapıcısını kandırmayı başardı, tebrikler.", en: "A street cat successfully tricked the apartment super for the third time today, congrats." },
  { tr: "Duyduğumuza göre bazı 'sessiz sokak' ilanları, sadece pazar günleri sessizmiş.", en: "We hear that some 'quiet street' listings are only quiet on Sundays." },
  { tr: "Şehrin bir ucunda yağmur yağıyor, öteki ucunda güneş var, ortasında ise hep trafik.", en: "It's raining on one end of the city, sunny on the other, and always traffic in the middle." },
  { tr: "Bugün balık fiyatları arttı, emlak fiyatlarıyla yarışa girdiler ama kaybettiler.", en: "Fish prices increased today, they raced with real estate prices but lost." },
  { tr: "Bir vatandaş 'manzaralı daire' aradı, komşusunun çamaşırlarını manzara sandı.", en: "A citizen looked for a 'view apartment', thought his neighbor's laundry was the view." },
  { tr: "Radyomuza gelen bir mektupta: 'Asansörsüz beşinci kat da bir çeşit spor salonudur' yazıyor.", en: "In a letter to our radio: 'A fifth floor without an elevator is also a kind of gym' it says." },
  { tr: "İstanbul'da bir gün içinde dört mevsim yaşanabilir, emlak ilanlarında ise hep 'ideal iklim' yazar.", en: "Four seasons can be experienced in one day in Istanbul, while real estate listings always say 'ideal climate'." },
  { tr: "Bugün şehir genelinde simit fiyatları sabit, emlakçı iyimserliği ise artışta.", en: "Bagel prices are stable across the city today, while realtor optimism is on the rise." },
  { tr: "Duyduk duymadık demeyin: bir apartmanda asansör konuşan bir sistemle değiştirildi, şimdi herkesle sohbet ediyor.", en: "Hear ye hear ye: an elevator in an apartment building was replaced with a talking system, now it chats with everyone." },
  { tr: "Bir dinleyici sordu: 'Balkon' ile 'oturmaya elverişli çıkıntı' arasındaki fark nedir? Yanıt bekliyoruz.", en: "A listener asked: What's the difference between a 'balcony' and a 'protrusion suitable for sitting'? We are waiting for an answer." },
  { tr: "Bugün rüzgar kuzeyden esiyor, dedikodu ise her yönden.", en: "The wind is blowing from the north today, gossip is from all directions." },
  { tr: "Emlak dünyasından ilginç bir gerçek: 'eşyalı daire' bazen sadece bir sandalyeden ibaret olabiliyor.", en: "An interesting fact from the real estate world: a 'furnished apartment' can sometimes consist of just a chair." },
  { tr: "Bir apartman sakini, komşusunun köpeğine kira ödemesi gerektiğini iddia etti, dava sürüyor.", en: "An apartment resident claimed he should pay rent for his neighbor's dog, the lawsuit is ongoing." },
  { tr: "Şehrin nabzı bugün biraz hızlı atıyor, belki de sadece kahve fazla kaçmıştır.", en: "The city's pulse is beating a bit fast today, maybe just too much coffee." },
  { tr: "Duyduğumuza göre bir semtte 'tarihi doku' ifadesi bazen sadece eski bir asansör düğmesi anlamına geliyor.", en: "We hear that in a neighborhood the phrase 'historical texture' sometimes just means an old elevator button." },
  { tr: "Bugün İstanbul'da herkes bir yere yetişmeye çalışıyor, kimse tam olarak nereye bilmiyor.", en: "Everyone in Istanbul is trying to catch up to somewhere today, no one knows exactly where." },
  { tr: "Bir vatandaş dairesini satarken 'sessiz sakin' dedi, komşu papağanı hemen itiraz etti.", en: "A citizen said 'peaceful and quiet' while selling his apartment, the neighbor's parrot immediately objected." },
  { tr: "Yerel kaynaklarımıza göre bir kapıcı, sakinlerin hava durumu tahmincisi olarak da görev yapıyor.", en: "According to our local sources, a doorman also acts as the weather forecaster for the residents." },
  { tr: "Bugün İstanbul Boğazı'ndan geçen gemi sayısı, emlakçıların iyimser cümle sayısına yaklaştı ama yetişemedi.", en: "The number of ships passing through the Istanbul Bosphorus today approached the number of optimistic sentences of realtors, but couldn't catch up." },
  { tr: "Bir semt sakini, apartmanın merdivenlerini 'doğal spor alanı' olarak tanımladı.", en: "A neighborhood resident defined the apartment stairs as a 'natural sports area'." },
  { tr: "Duyduk duymadık demeyin: bir emlakçı, evi o kadar övdü ki kendi eviyle değiştirmek istedi.", en: "Hear ye hear ye: a realtor praised the house so much that he wanted to swap it with his own." },
  { tr: "Bugün şehirde martı sesleri biraz daha yüksek, sebebi hâlâ araştırılıyor.", en: "Seagull sounds are a bit louder in the city today, the reason is still being investigated." },
  { tr: "Bir apartman toplantısında aidat konusu üç saat sürdü, karar hâlâ çıkmadı.", en: "The dues issue lasted three hours at an apartment meeting, a decision is still pending." },
  { tr: "Radyomuza ulaşan bilgiye göre bir sokak kedisi, semtin gayrı resmi bekçisi ilan edildi.", en: "According to the information reaching our radio, a stray cat was declared the unofficial guard of the neighborhood." },
  { tr: "Bugün hava sıcaklığı normalin üzerinde, emlak fiyatlarındaki iyimserlik ise her zamanki gibi.", en: "The temperature is above normal today, the optimism in real estate prices is as usual." },
  { tr: "Bir dinleyici yazdı: 'İstanbul'da her taşınma bir maceradır.' Katılmamak elde değil.", en: "A listener wrote: 'Every move in Istanbul is an adventure.' Hard to disagree." },
  { tr: "Şehrin bir köşesinde yeni bir kafe açıldı, üç hafta içinde 'semtin markası' oldu.", en: "A new cafe opened in a corner of the city, became the 'brand of the neighborhood' within three weeks." },
  { tr: "Bugünkü trafik raporuna göre en hızlı ulaşım hâlâ yürümek.", en: "According to today's traffic report, the fastest transportation is still walking." },
  { tr: "Bir apartman sakini asansörde mahsur kaldı, iyi haber: wifi şifresini de öğrendi.", en: "An apartment resident got stuck in the elevator, good news: he also learned the wifi password." },
  { tr: "Duyduğumuza göre bazı 'merkezi konum' ilanları, merkeze sadece kuş uçuşu yakınmış.", en: "We hear that some 'central location' listings are only close to the center as the crow flies." },
  { tr: "Bugün şehirde göç eden kuş sürüleri, bazı emlakçılardan daha az gürültü çıkardı.", en: "Flocks of migrating birds in the city today made less noise than some realtors." },
  { tr: "Bir vatandaş, balkonundaki saksı sayısını 'özel bahçe' olarak ilan etti.", en: "A citizen advertised the number of pots on his balcony as a 'private garden'." },
  { tr: "Radyomuza gelen habere göre bir bina yöneticisi, sakinlerin ruh haline göre müzik çalıyor.", en: "According to the news on our radio, a building manager plays music according to the mood of the residents." },
  { tr: "Bugün şehirde herkes bir şeyden şikayet ediyor, çoğu zaman aynı trafik ışığından.", en: "Everyone in the city is complaining about something today, most of the time the same traffic light." },
  { tr: "Bir semtte 'yeni yapı' denilen bina, aslında sadece yeni boyanmış.", en: "The building called 'new construction' in a neighborhood was actually just newly painted." },
  { tr: "Duyduk duymadık demeyin: bir kapıcı, sakinlerin unuttuğu doğum günlerini hatırlatıyor.", en: "Hear ye hear ye: a doorman reminds residents of birthdays they forgot." },
  { tr: "Bugün İstanbul'da üç ayrı semtte aynı anda 'burası çok sakin' cümlesi kuruldu, tesadüf olmayabilir.", en: "Today, the sentence 'it is very quiet here' was formed in three different neighborhoods in Istanbul at the same time, it might not be a coincidence." },
  { tr: "Bir apartmanın çatı katı sakinleri, kendilerini resmen 'gökyüzü komitesi' ilan etti.", en: "The penthouse residents of an apartment building officially declared themselves the 'sky committee'." },
  { tr: "Radyomuza gelen bilgiye göre bazı 'deniz manzaralı' ilanlarda deniz sadece dürbünle görünüyor.", en: "According to the info reaching our radio, the sea is only visible through binoculars in some 'sea view' listings." },
  { tr: "Bugün şehirde bir rekor kırıldı: bir apartman toplantısı gündem maddesine hiç girmeden bitti.", en: "A record was broken in the city today: an apartment meeting ended without even entering the agenda items." },
  { tr: "Bir vatandaş taşınırken kutuların üstüne 'kırılacak eşyalar' yerine 'umutlar' yazdı, anlamlıydı.", en: "When a citizen moved, he wrote 'hopes' instead of 'fragile items' on the boxes, it was meaningful." },
  { tr: "Duyduğumuza göre bir semtte sokak lambaları artık ışık değil, dedikodu yayıyor.", en: "We hear that street lamps in a neighborhood spread gossip, not light anymore." },
  { tr: "Bugün trafik ışıklarında ortalama bekleme süresi arttı, sabır stokları ise her zamanki gibi düşük.", en: "The average waiting time at traffic lights increased today, while patience stocks are low as usual." },
  { tr: "Bir bina girişindeki 'lütfen sessiz olun' tabelası, en gürültülü köşede duruyor.", en: "The 'please be quiet' sign at a building entrance stands at the noisiest corner." },
  { tr: "Radyomuza ulaşan bilgiye göre bir emlakçı, evi anlatırken kendi hayatını da özetlemiş.", en: "According to the information reaching our radio, a realtor also summarized his own life while describing the house." },
  { tr: "Bugün şehirde herkes bir taşınma hikayesi anlatıyor, hiçbiri birbirine benzemiyor.", en: "Everyone in the city is telling a moving story today, none of them are alike." },
  { tr: "Bir apartman sakini, komşusunun çiçek sulama saatini artık ezbere biliyor.", en: "An apartment resident now knows by heart the time his neighbor waters the plants." },
  { tr: "Duyduk duymadık demeyin: bir dairede 'ferah salon' ifadesi sadece boş olduğu için doğruymuş.", en: "Hear ye hear ye: the phrase 'spacious living room' in an apartment was true only because it was empty." },
  { tr: "Bugün dolmuş kuyruğu her zamankinden uzun, şoförün moduna göre değişen bir bilim var burada.", en: "The minibus queue is longer than usual today, there is a science here that changes according to the driver's mood." },
  { tr: "Bir semtte 'yürüme mesafesi' ifadesi, maratoncular için yazılmış gibi duruyor.", en: "The phrase 'walking distance' in a neighborhood looks like it was written for marathon runners." },
  { tr: "Radyomuza gelen habere göre bir bina, sakinlerinin ortak kararıyla resmi 'sessiz saat' ilan etti — kimse uymuyor.", en: "According to the news reaching our radio, a building officially declared a 'quiet hour' with the joint decision of its residents — no one follows it." },
  { tr: "Bugün İstanbul'da bir otobüs durağında üç kişi aynı anda 'az kaldı' dedi, hiçbiri haklı çıkmadı.", en: "Today at a bus stop in Istanbul, three people said 'almost there' at the same time, none of them were right." },
  { tr: "Bir vatandaş balkonunda kahve içerken şehri izledi, şehir de onu izledi, denge sağlandı.", en: "A citizen watched the city while drinking coffee on his balcony, the city watched him back, balance was achieved." },
  { tr: "Duyduğumuza göre bir apartmanın 'ortak alan' tabelası, en çok tartışılan iki kelime oldu bu ay.", en: "We hear that the 'common area' sign of an apartment building was the two most debated words this month." },
  { tr: "Bugün rıhtımda martılar simitçiyle pazarlık ediyor, kazanan hâlâ belli değil.", en: "Today at the pier, seagulls are bargaining with the bagel seller, the winner is still not clear." },
  { tr: "Bir emlak ilanında 'az kullanılmış mutfak' yazıyordu, komşular gülmekten kırıldı.", en: "A real estate ad said 'barely used kitchen', the neighbors died laughing." },
  { tr: "Şehrin bir ucunda düğün konvoyu kornaya basıyor, öteki ucunda biri sadece eve gitmeye çalışıyor.", en: "A wedding convoy is honking on one end of the city, while someone is just trying to go home on the other." },
  { tr: "Bugün hava durumu: sabah güneşli, öğlen kararsız, akşam trafik gibi durgun.", en: "Weather today: sunny in the morning, undecided at noon, stagnant as traffic in the evening." },
  { tr: "Bir apartman yöneticisi, aidat borcunu şiirle hatırlattı, tahsilat oranı hâlâ aynı.", en: "An apartment manager reminded the dues debt with a poem, the collection rate is still the same." },
  { tr: "Duyduk duymadık demeyin: bir sokak kedisi, kapıcının koltuğunu resmen devraldı.", en: "Hear ye hear ye: a stray cat officially took over the doorman's seat." },
  { tr: "Bugün şehirde üç ayrı yerde 'burası yatırımlık' cümlesi kuruldu, üçü de emin görünüyordu.", en: "Today, the sentence 'this is for investment' was formed in three different places in the city, all three seemed sure." },
  { tr: "Bir vatandaş, evinin önündeki ağacı 'özel peyzaj' diye tanımladı, ağaç yorum yapmadı.", en: "A citizen defined the tree in front of his house as 'private landscaping', the tree didn't comment." },
  { tr: "Radyomuza ulaşan bilgiye göre bir asansör artık sadece cuma günleri çalışmaya karar verdi.", en: "According to the information reaching our radio, an elevator decided to work only on Fridays from now on." },
  { tr: "Bugün İstanbul trafiğinde bir rekor daha kırıldı: sabır, her zamankinden biraz daha erken tükendi.", en: "Another record was broken in Istanbul traffic today: patience ran out a little earlier than usual." },
];

const gossipLines: Localized[] = [
  { tr: "Magazin köşemizden: Aslı Yıldız yeni albümü için stüdyoya girdi, komşuları şimdiden şikayetçi.", en: "From our magazine corner: Aslı Yıldız entered the studio for her new album, her neighbors are already complaining." },
  { tr: "Duyduğumuza göre Kaptan Fikret bu hafta yeni bir tekne turu başlattı, herkesi davet ediyor.", en: "We hear Captain Fikret started a new boat tour this week, he invites everyone." },
  { tr: "Şef Bahar'ın yeni restoranı açıldı, rezervasyon listesi şimdiden bir apartman boyu uzadı.", en: "Chef Bahar's new restaurant opened, the reservation list has already grown as tall as an apartment building." },
  { tr: "Cihangir Bey'in son röportajı gündemde, herkes bir sonraki projesini merak ediyor.", en: "Mr. Cihangir's latest interview is on the agenda, everyone is wondering about his next project." },
  { tr: "Leyla Han'ın yeni koleksiyonu modaseverleri ikiye böldü, tartışma sürüyor.", en: "Ms. Leyla's new collection divided fashion lovers in two, the debate continues." },
  { tr: "Söylentiye göre Aslı Yıldız yeni evine taşınırken üç emlakçıyı aynı anda aramış, kimin kazandığı hâlâ gizli.", en: "Rumor has it Aslı Yıldız called three realtors at the same time while moving to her new house, who won is still a secret." },
  { tr: "Kaptan Fikret'in tekne turuna bu hafta bir ünlü daha katıldı, isim şimdilik gizli tutuluyor.", en: "Another celebrity joined Captain Fikret's boat tour this week, the name is kept secret for now." },
  { tr: "Şef Bahar'ın mutfağından sızan bir haber var: yeni menü bu hafta sonu tanıtılacak.", en: "There is a leak from Chef Bahar's kitchen: the new menu will be introduced this weekend." },
  { tr: "Cihangir Bey'in ofis taşınma haberleri doğrulanmadı ama şehir konuşmaya devam ediyor.", en: "The news of Mr. Cihangir's office moving has not been confirmed but the city keeps talking." },
];

/** Templated lines that reference data the game already tracks — kept separate so they can be skipped when the context isn't available yet. */
export function personalizedPulseLines(ctx: {
  lastSaleAmount?: number;
  lastSaleDistrict?: string;
  soldCount?: number;
  rivalTotal?: number;
  bossMoodHigh?: boolean;
}): string[] {
  const lines: string[] = [];
  if (ctx.lastSaleAmount && ctx.lastSaleDistrict) {
    lines.push(
      `${ctx.lastSaleDistrict}'ta konuşulan haber: bir emlakçı ${formatTL(ctx.lastSaleAmount)} değerinde bir anlaşmaya imza attı — adı hâlâ gizli ama herkes seni konuşuyor.`,
      `Radyomuza ulaşan bilgiye göre ${ctx.lastSaleDistrict} bölgesinde bu haftanın en iyi anlaşması senin imzanı taşıyor.`,
    );
  }
  if (ctx.soldCount !== undefined && ctx.rivalTotal !== undefined) {
    if (ctx.soldCount > ctx.rivalTotal) {
      lines.push(
        "Sektör kulislerinde konuşulan bir isim var, rakipler bu hafta biraz daha sessiz.",
        "Duyduğumuza göre Fırat Bey bu hafta biraz daha az konuşuyor, sebebini tahmin edebiliyoruz.",
      );
    } else if (ctx.rivalTotal > ctx.soldCount + 2) {
      lines.push(
        "Bu hafta rakip emlakçılardan biri iddialı bir seriye imza attı, herkes onu konuşuyor.",
        "Sektörde rüzgar bu hafta başka bir yönden esiyor gibi görünüyor.",
      );
    }
  }
  if (ctx.bossMoodHigh) {
    lines.push("Duyduğumuza göre bir ofis bu hafta olağandan neşeli, patronun keyfi yerinde galiba.");
  }
  return lines;
}

export function pickCityPulseLine(ctx: {
  lastSaleAmount?: number;
  lastSaleDistrict?: string;
  soldCount?: number;
  rivalTotal?: number;
  bossMoodHigh?: boolean;
}): string {
  const personalized = personalizedPulseLines(ctx);
  // Personalized lines are rarer and more special — weighted low so they
  // don't drown out the generic city-radio noise, but still show up often
  // enough to feel earned.
  if (personalized.length > 0 && Math.random() < 0.35) {
    return personalized[Math.floor(Math.random() * personalized.length)];
  }
  const pool = [...genericLines, ...gossipLines];
  return resolveText(pool[Math.floor(Math.random() * pool.length)]);
}
