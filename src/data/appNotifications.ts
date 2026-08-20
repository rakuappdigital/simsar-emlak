/**
 * Parody push notifications from other (fictional, clearly-not-real) apps
 * on Emlah's phone — same purely cosmetic banner slot as
 * whatsappNotifications.ts, just a different "app" flavor. Each name is a
 * one-letter-off riff on a real, recognizable app category so the joke
 * lands without literally naming/branding a real company.
 */
export interface AppNotificationSource {
  appName: string;
  icon: string;
  messages: string[];
}

export const appNotificationSources: AppNotificationSource[] = [
  {
    appName: "Friendyol",
    icon: "🛍️",
    messages: [
      "DELİRMİŞ PAZARTESİ indirimleri başladı!",
      "Sepetindeki ürün son 2 adet kaldı",
      "Kargon yola çıktı, kapıda ol",
      "Flaş indirim: Sadece bugün %50",
      "Süper Hızlı teslimat şimdi senin mahallende",
      "Beğendiğin ürünün fiyatı düştü",
    ],
  },
  {
    appName: "Getirir",
    icon: "🛵",
    messages: [
      "10 dakikada kapında!",
      "Market alışverişin yolda",
      "Kurye az sonra kapıda olacak",
      "Bugüne özel ücretsiz teslimat",
      "Sepetine bir şeyler eklemeyi unutma",
      "Gece atıştırmalık kampanyası başladı",
    ],
  },
  {
    appName: "Yemeksepetim",
    icon: "🍔",
    messages: [
      "Siparişin hazırlanıyor",
      "Bu akşam ne yesen diye düşünme, öner",
      "Kurye siparişini aldı, yolda",
      "İndirim kuponun bugün sona eriyor",
      "Favori restoranından yeni menü geldi",
      "Siparişini değerlendirmeyi unutma",
    ],
  },
  {
    appName: "İnstajram",
    icon: "📸",
    messages: [
      "3 kişi hikayeni izledi",
      "Yeni bir takipçin var",
      "Fotoğrafın 50 beğeni aldı",
      "Canlı yayın başladı, kaçırma",
      "Bir arkadaşın seni bir gönderide etiketledi",
      "Hikayen 24 saat içinde kaybolacak",
    ],
  },
  {
    appName: "Fitter",
    icon: "🐦",
    messages: [
      "Gündemde: #EmlakPiyasası",
      "Paylaşımın 12 beğeni aldı",
      "Takip ettiğin biri canlı yayında",
      "Bugün trend olan konuları gör",
      "Bir kullanıcı seni yanıtladı",
      "Bildirimlerini kaçırma",
    ],
  },
  {
    appName: "BuTaksi",
    icon: "🚕",
    messages: [
      "Şoförün 3 dakika uzaklıkta",
      "Yolculuğun tamamlandı, puanla",
      "Yakınında müsait araç sayısı arttı",
      "Bu bölgede talep yoğun, fiyat değişebilir",
      "Geçmiş yolculuklarını gör",
      "Sürücünle iletişime geç",
    ],
  },
  {
    appName: "Sahi mi'den",
    icon: "🏷️",
    messages: [
      "İlanın 40 kez görüntülendi",
      "Aradığın kritere uygun yeni ilan var",
      "Bir kullanıcı ilanına mesaj attı",
      "İlanını öne çıkar, daha çok görün",
      "Fiyat düştü, favorilediğin ilana bak",
      "İlan süren dolmak üzere, yenile",
    ],
  },
  {
    appName: "Spotifay",
    icon: "🎧",
    messages: [
      "Haftalık çalma listen hazır",
      "Bu şarkıyı sevebilirsin: Emlakçı Blues",
      "Yıllık dinleme özetin çıktı",
      "Yeni albüm senin için önerildi",
      "Podcast'inin yeni bölümü yayında",
      "Çevrimdışı dinlemeyi unutma",
    ],
  },
  {
    appName: "Netflex",
    icon: "🎬",
    messages: [
      "Yeni sezon şimdi yayında",
      "İzlemeye kaldığın yerden devam et",
      "Sana özel öneriler güncellendi",
      "Bu hafta trend olan diziler",
      "Hesabına yeni bir profil eklendi",
      "Yakında kaldırılacak: hemen izle",
    ],
  },
  {
    appName: "TokTik",
    icon: "🎵",
    messages: [
      "Akışında yeni videolar var",
      "Videon 200 izlenmeye ulaştı",
      "Trend olan sesi kullan, sen de dene",
      "Biri videonu beğendi",
      "Canlı yayına katıl",
      "Bu challenge'ı deneyenler arttı",
    ],
  },
  {
    appName: "LinkedOn",
    icon: "💼",
    messages: [
      "Profilini 5 kişi görüntüledi",
      "Bir bağlantı isteğin var",
      "Eski iş arkadaşın yeni bir ilan paylaştı",
      "Profilin bu hafta öne çıktı",
      "Sektöründe gündemde olan bir haber var",
      "Yeni bir tavsiye aldın",
    ],
  },
  {
    appName: "BankamPlus",
    icon: "🏦",
    messages: [
      "Hesap özetiniz hazırlandı",
      "Bu ay harcamalarınız arttı",
      "Kredi kartı son ödeme tarihiniz yaklaşıyor",
      "Hesabınıza para gelmiştir",
      "Yeni bir kampanyadan yararlanabilirsiniz",
      "Şifrenizi güncellemeniz önerilir",
    ],
  },
  {
    appName: "Yandeks Yol",
    icon: "🗺️",
    messages: [
      "Bu güzergahta yoğun trafik var",
      "Alternatif rota bulundu, 8 dk kazandırır",
      "Hedefine 12 dakika uzaklıktasın",
      "Bu yolda radar var, dikkatli sür",
      "Trafik son 10 dakikada arttı",
      "Yakında bir yakıt istasyonu var",
    ],
  },
  {
    appName: "DolunGo",
    icon: "🦉",
    messages: [
      "Bugünkü dersini tamamlamadın!",
      "Serini bozma, 1 gün kaldı",
      "Yeni bir dil öğrenmeye ne dersin",
      "5 dakikanı ayır, pratik yap",
      "Baykuş seni bekliyor",
      "Bugün hedefine çok yaklaştın",
    ],
  },
  {
    appName: "ZoomAra",
    icon: "📹",
    messages: [
      "Toplantın 10 dakika sonra başlıyor",
      "Bağlantın kesildi, tekrar katıl",
      "Toplantı kaydın hazır",
      "Yeni bir toplantı davetin var",
      "Ekran paylaşımı aktif",
      "Toplantı sahibi seni bekletiyor",
    ],
  },
];

export function pickAppNotification(): { icon: string; name: string; text: string } {
  const source = appNotificationSources[Math.floor(Math.random() * appNotificationSources.length)];
  const text = source.messages[Math.floor(Math.random() * source.messages.length)];
  return { icon: source.icon, name: source.appName, text };
}
