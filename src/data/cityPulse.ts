import { formatTL } from "./economy";

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

const genericLines: string[] = [
  "Radyo Boğaz FM'den dinliyorsunuz: bu saatlerde köprüde trafik yoğun, sabrınızı da faturaya ekleyin.",
  "Bu şehirde bir daire bulmak, sadık bir martı bulmaktan daha kolay değil.",
  "Uzmanlar açıkladı: İstanbul'da 'yakın' kelimesi trafiğe göre değişen bir kavram.",
  "Emlak sektöründen flaş haber: bir daire yine 'deniz manzaralı' diye satıldı, deniz üç sokak ötedeymiş.",
  "Vapur kalktı, martılar simit peşinde, hayat İstanbul'da her zamanki gibi.",
  "Bugün hava parçalı bulutlu, emlak piyasası ise her zamanki gibi parçalı gerçekçi.",
  "Bir dinleyicimiz yazdı: 'Semtimde her köşe başında bir emlakçı var.' Rica ederiz, işimiz bu.",
  "Şehir efsanesi: Kadıköy'de bir dairenin fiyatı, sahibinin o gün moduna göre değişirmiş.",
  "Bu saatlerde Boğaz'da rüzgar hafif, cüzdanlarda ise her zamanki gibi sert esiyor.",
  "Flaş: Bir apartman yöneticisi aidat toplarken kayboldu, arayan olursa haber versin.",
  "Uzmanlar uyarıyor: 'Yenilenmiş mutfak' ifadesi bazen sadece yeni bir musluk anlamına gelebilir.",
  "İstanbul trafiğinde geçen bir saat, başka şehirlerde bir hafta eder.",
  "Bugünkü nem oranı yüksek, emlakçıların iyimserlik oranı ise hep sabit.",
  "Bir sokak kedisi bugün üçüncü kez aynı apartmanın kapıcısını kandırmayı başardı, tebrikler.",
  "Duyduğumuza göre bazı 'sessiz sokak' ilanları, sadece pazar günleri sessizmiş.",
  "Şehrin bir ucunda yağmur yağıyor, öteki ucunda güneş var, ortasında ise hep trafik.",
  "Bugün balık fiyatları arttı, emlak fiyatlarıyla yarışa girdiler ama kaybettiler.",
  "Bir vatandaş 'manzaralı daire' aradı, komşusunun çamaşırlarını manzara sandı.",
  "Radyomuza gelen bir mektupta: 'Asansörsüz beşinci kat da bir çeşit spor salonudur' yazıyor.",
  "İstanbul'da bir gün içinde dört mevsim yaşanabilir, emlak ilanlarında ise hep 'ideal iklim' yazar.",
  "Bugün şehir genelinde simit fiyatları sabit, emlakçı iyimserliği ise artışta.",
  "Duyduk duymadık demeyin: bir apartmanda asansör konuşan bir sistemle değiştirildi, şimdi herkesle sohbet ediyor.",
  "Bir dinleyici sordu: 'Balkon' ile 'oturmaya elverişli çıkıntı' arasındaki fark nedir? Yanıt bekliyoruz.",
  "Bugün rüzgar kuzeyden esiyor, dedikodu ise her yönden.",
  "Emlak dünyasından ilginç bir gerçek: 'eşyalı daire' bazen sadece bir sandalyeden ibaret olabiliyor.",
  "Bir apartman sakini, komşusunun köpeğine kira ödemesi gerektiğini iddia etti, dava sürüyor.",
  "Şehrin nabzı bugün biraz hızlı atıyor, belki de sadece kahve fazla kaçmıştır.",
  "Duyduğumuza göre bir semtte 'tarihi doku' ifadesi bazen sadece eski bir asansör düğmesi anlamına geliyor.",
  "Bugün İstanbul'da herkes bir yere yetişmeye çalışıyor, kimse tam olarak nereye bilmiyor.",
  "Bir vatandaş dairesini satarken 'sessiz sakin' dedi, komşu papağanı hemen itiraz etti.",
  "Yerel kaynaklarımıza göre bir kapıcı, sakinlerin hava durumu tahmincisi olarak da görev yapıyor.",
  "Bugün İstanbul Boğazı'ndan geçen gemi sayısı, emlakçıların iyimser cümle sayısına yaklaştı ama yetişemedi.",
  "Bir semt sakini, apartmanın merdivenlerini 'doğal spor alanı' olarak tanımladı.",
  "Duyduk duymadık demeyin: bir emlakçı, evi o kadar övdü ki kendi eviyle değiştirmek istedi.",
  "Bugün şehirde martı sesleri biraz daha yüksek, sebebi hâlâ araştırılıyor.",
  "Bir apartman toplantısında aidat konusu üç saat sürdü, karar hâlâ çıkmadı.",
  "Radyomuza ulaşan bilgiye göre bir sokak kedisi, semtin gayrı resmi bekçisi ilan edildi.",
  "Bugün hava sıcaklığı normalin üzerinde, emlak fiyatlarındaki iyimserlik ise her zamanki gibi.",
  "Bir dinleyici yazdı: 'İstanbul'da her taşınma bir maceradır.' Katılmamak elde değil.",
  "Şehrin bir köşesinde yeni bir kafe açıldı, üç hafta içinde 'semtin markası' oldu.",
  "Bugünkü trafik raporuna göre en hızlı ulaşım hâlâ yürümek.",
  "Bir apartman sakini asansörde mahsur kaldı, iyi haber: wifi şifresini de öğrendi.",
  "Duyduğumuza göre bazı 'merkezi konum' ilanları, merkeze sadece kuş uçuşu yakınmış.",
  "Bugün şehirde göç eden kuş sürüleri, bazı emlakçılardan daha az gürültü çıkardı.",
  "Bir vatandaş, balkonundaki saksı sayısını 'özel bahçe' olarak ilan etti.",
  "Radyomuza gelen habere göre bir bina yöneticisi, sakinlerin ruh haline göre müzik çalıyor.",
  "Bugün şehirde herkes bir şeyden şikayet ediyor, çoğu zaman aynı trafik ışığından.",
  "Bir semtte 'yeni yapı' denilen bina, aslında sadece yeni boyanmış.",
  "Duyduk duymadık demeyin: bir kapıcı, sakinlerin unuttuğu doğum günlerini hatırlatıyor.",
  "Bugün İstanbul'da üç ayrı semtte aynı anda 'burası çok sakin' cümlesi kuruldu, tesadüf olmayabilir.",
  "Bir apartmanın çatı katı sakinleri, kendilerini resmen 'gökyüzü komitesi' ilan etti.",
  "Radyomuza gelen bilgiye göre bazı 'deniz manzaralı' ilanlarda deniz sadece dürbünle görünüyor.",
  "Bugün şehirde bir rekor kırıldı: bir apartman toplantısı gündem maddesine hiç girmeden bitti.",
  "Bir vatandaş taşınırken kutuların üstüne 'kırılacak eşyalar' yerine 'umutlar' yazdı, anlamlıydı.",
  "Duyduğumuza göre bir semtte sokak lambaları artık ışık değil, dedikodu yayıyor.",
  "Bugün trafik ışıklarında ortalama bekleme süresi arttı, sabır stokları ise her zamanki gibi düşük.",
  "Bir bina girişindeki 'lütfen sessiz olun' tabelası, en gürültülü köşede duruyor.",
  "Radyomuza ulaşan bilgiye göre bir emlakçı, evi anlatırken kendi hayatını da özetlemiş.",
  "Bugün şehirde herkes bir taşınma hikayesi anlatıyor, hiçbiri birbirine benzemiyor.",
  "Bir apartman sakini, komşusunun çiçek sulama saatini artık ezbere biliyor.",
  "Duyduk duymadık demeyin: bir dairede 'ferah salon' ifadesi sadece boş olduğu için doğruymuş.",
  "Bugün dolmuş kuyruğu her zamankinden uzun, şoförün moduna göre değişen bir bilim var burada.",
  "Bir semtte 'yürüme mesafesi' ifadesi, maratoncular için yazılmış gibi duruyor.",
  "Radyomuza gelen habere göre bir bina, sakinlerinin ortak kararıyla resmi 'sessiz saat' ilan etti — kimse uymuyor.",
  "Bugün İstanbul'da bir otobüs durağında üç kişi aynı anda 'az kaldı' dedi, hiçbiri haklı çıkmadı.",
  "Bir vatandaş balkonunda kahve içerken şehri izledi, şehir de onu izledi, denge sağlandı.",
  "Duyduğumuza göre bir apartmanın 'ortak alan' tabelası, en çok tartışılan iki kelime oldu bu ay.",
  "Bugün rıhtımda martılar simitçiyle pazarlık ediyor, kazanan hâlâ belli değil.",
  "Bir emlak ilanında 'az kullanılmış mutfak' yazıyordu, komşular gülmekten kırıldı.",
  "Şehrin bir ucunda düğün konvoyu kornaya basıyor, öteki ucunda biri sadece eve gitmeye çalışıyor.",
  "Bugün hava durumu: sabah güneşli, öğlen kararsız, akşam trafik gibi durgun.",
  "Bir apartman yöneticisi, aidat borcunu şiirle hatırlattı, tahsilat oranı hâlâ aynı.",
  "Duyduk duymadık demeyin: bir sokak kedisi, kapıcının koltuğunu resmen devraldı.",
  "Bugün şehirde üç ayrı yerde 'burası yatırımlık' cümlesi kuruldu, üçü de emin görünüyordu.",
  "Bir vatandaş, evinin önündeki ağacı 'özel peyzaj' diye tanımladı, ağaç yorum yapmadı.",
  "Radyomuza ulaşan bilgiye göre bir asansör artık sadece cuma günleri çalışmaya karar verdi.",
  "Bugün İstanbul trafiğinde bir rekor daha kırıldı: sabır, her zamankinden biraz daha erken tükendi.",
];

const gossipLines: string[] = [
  "Magazin köşemizden: Aslı Yıldız yeni albümü için stüdyoya girdi, komşuları şimdiden şikayetçi.",
  "Duyduğumuza göre Kaptan Fikret bu hafta yeni bir tekne turu başlattı, herkesi davet ediyor.",
  "Şef Bahar'ın yeni restoranı açıldı, rezervasyon listesi şimdiden bir apartman boyu uzadı.",
  "Cihangir Bey'in son röportajı gündemde, herkes bir sonraki projesini merak ediyor.",
  "Leyla Han'ın yeni koleksiyonu modaseverleri ikiye böldü, tartışma sürüyor.",
  "Söylentiye göre Aslı Yıldız yeni evine taşınırken üç emlakçıyı aynı anda aramış, kimin kazandığı hâlâ gizli.",
  "Kaptan Fikret'in tekne turuna bu hafta bir ünlü daha katıldı, isim şimdilik gizli tutuluyor.",
  "Şef Bahar'ın mutfağından sızan bir haber var: yeni menü bu hafta sonu tanıtılacak.",
  "Cihangir Bey'in ofis taşınma haberleri doğrulanmadı ama şehir konuşmaya devam ediyor.",
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
  return pool[Math.floor(Math.random() * pool.length)];
}
