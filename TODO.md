# Odd Estate — Sıradaki Oturum Yapılacaklar Listesi

Kullanıcı 2026-09-21 tarihinde 10 madde istedi. Hepsi tek tek ele alınıyor.

---

# İKİNCİ TUR — Monetizasyon/Keyif Fikirleri (2026-09-22)

Kullanıcıya sunulan öneriler onaylandı, uygulama sırası:

1. ✅ TAMAMLANDI — Garantili İkinci Şans (Envanter'de yeni jetton ürünü, 3 Jetton, `guaranteed-second-chance` — `pickSecondChanceCandidateIndex()` + mevcut `retryFromInbox()` pipeline'ı reuse edildi)
2. ✅ TAMAMLANDI — Başlangıç Paketi (3 yeni ASC ürünü oluşturuldu, kalıcı sekme + ilk satıştan sonra bir kerelik tanıtım pop-up'ı eklendi)
3. ✅ TAMAMLANDI — Günlük giriş ödülü (`src/data/dailyReward.ts`, 24 saatte 1 Jetton, TR/EN pop-up, `navigator.webdriver` ile test ortamında atlanıyor — aynı splash deseni)
4. ✅ TAMAMLANDI — Game Center Leaderboard (bkz yukarı madde 5 — `submitScore`/`showLeaderboard` eklendi, ASC'de leaderboard oluşturuldu)
5. ✅ TAMAMLANDI — Envanter'e 13 yeni eşya (4 mevcut + 13 yeni = 17 toplam), bkz aşağıda detay
6. ❌ REDDEDİLDİ — Günlük Sınırsız Enerji Bileti (kullanıcı gerekli görmedi)
7. ❌ REDDEDİLDİ — Sezonluk Kariyer Pasosu (kullanıcı çok karmaşık buldu)

## Envanter genişlemesi detayı (13 yeni eşya)
`src/data/inventory.ts` — 7 TL eşyası (Masa Lambası, Duvar Tablosu, Yeşil Saksı, Kahve Makinesi, Konfor Koltuğu, Plaket Rafı, Yeni Tabela) + 6 Jetton eşyası (Garantili İkinci Şans, Kusursuz İzlenim, Patron Notu, Sağlam Referans, Ekstra Enerji Deposu, Şanslı Randevu). Hepsi mevcut "pending bonus" deseniyle (App.tsx'teki ev-geçiş bloğu) ya da anlık enerji/patron-memnuniyeti güncellemesiyle çalışıyor — yeni state: `pendingInterestBonus`, `pendingFunBonus` (sayısal accumulator, `pendingSuspicionDiscount` ile aynı desen). "Garantili İkinci Şans" `pickSecondChanceCandidateIndex(results)` ile uygun ev arıyor, yoksa buton `InventoryPanel`'de disabled kalıyor (`hasRetryCandidate` prop, `EmlahMenu` üzerinden geçiriliyor).
TS + 12/12 test + imzalı archive doğrulandı.

## Başlangıç Paketi detayı (madde 2 — tamamlandı)
3 yeni non-consumable ürün ASC API ile oluşturuldu (lokalizasyon + fiyat + review screenshot + 175 ülke müsaitliği, READY_TO_SUBMIT):
- `bundle_full_jetton30` — Full + 30 Jetton — $2.99
- `bundle_full_noads` — Full + Remove Ads — $3.99
- `bundle_full_noads_jetton30` — Full + Remove Ads + 30 Jetton — $4.99

`purchases.ts`'e `purchaseBundle*()` fonksiyonları eklendi (her biri full-unlock + gerekiyorsa remove-ads + gerekiyorsa `addJettons(30)` uyguluyor). `SettingsScreen`'e "🎁 Starter Bundles" bölümü eklendi — SADECE `!fullUnlocked` iken görünüyor. İlk satıştan sonra (achievement-check effect'indeki `soldCount>=1` kontrolüne eklendi), demo kullanıcıya (henüz full-unlock almamışsa) bir kerelik, süresiz tanıtım pop-up'ı çıkıyor ("Karşılama Teklifi" / "Welcome Offer"), "Teklifleri Gör" butonu Ayarlar'a yönlendiriyor. localStorage flag ile bir daha gösterilmiyor.

**Kalan tek adım**: RevenueCat dashboard'da bu 3 ürünün otomatik import olup olmadığını kontrol et (önceki 5 üründe "import edince otomatik geldiler" demiştin, muhtemelen bunlar da otomatik gelir) — gelmezse elle "Import Products" ile ekle.
TS + 12/12 test + imzalı archive doğrulandı.

## 1. ✅ TAMAMLANDI — Ofis aktivitelerinin gerçek avantajı
- **Gerçek bug bulundu ve düzeltildi**: "Müşteri Araştırması" (`research`) hiçbir etki yaratmıyordu — `handleDoDayActivity()` içinde uyguladığı şüphe indirimi, yeni ev diyaloğu başlarken `computeFreshStats()` tarafından anında eziliyordu (stats objesi sıfırdan hesaplanıyor). Çözüm: `pendingResearchDiscount` state'i eklendi (mevcut `pendingMeetupBonus` deseniyle aynı), indirim artık `newStats` hesaplanırken (App.tsx ~1256 civarı, ev geçiş bloğunda) uygulanıyor — bir sonraki evin başlangıç şüphesini gerçekten düşürüyor.
- "Pazarlama" (bossMood +3, kalıcı) ve "Ofis İşleri" (+5000 TL, `earned`'e direkt giriyor) zaten gerçek ve kalıcı etkiler sağlıyordu, doğrulandı.
- TS + 12/12 test yeşil.

## 2. ✅ TAMAMLANDI — "[object Object]" hatası
- **Gerçek kök neden bulundu ve düzeltildi**: `App.tsx:1746` — haftalık zam mesajında `addressName` değişkeni `originById(origin)?.nickname` değerini (bir `Localized` `{tr,en}` objesi) `resolveText()` ile çözümlemeden doğrudan template literal'e (`` `...memnunum ${addressName}...` ``) koyuyordu. Sadakat rozeti açıldığında (originChoiceCount >= LOYALTY_THRESHOLD) Muzaffer Bey'in haftalık mesajında `[object Object]` çıkıyordu.
- Düzeltme: `resolveText(originNickname)` ile sarıldı.
- Proje genelinde `EndingSequence.tsx`, `DialogueScene.tsx` (celebrity/origin introLine), `friendCharacters.ts` profession, `origin.ts` nickname/title/description gibi tüm `Localized` alanları tek tek tarandı — başka kaçak bulunamadı, hepsi doğru şekilde `resolveText()`/`t()` ile sarılı.
- TS + 12/12 test yeşil.

## 3. ✅ TAMAMLANDI — İkinci splash ekranının arka planı
- `src/game.css`'e `.splash-root-game { background: #fec821; }` eklendi (logodan ölçülen tam renk), `SplashScreen.tsx`'te stage "game" olduğunda `.splash-root`'a bu class ekleniyor.
- Yükleme çubuğu dolgu rengi de `#f0a500` (sarı zeminde zayıf kontrastlıydı) yerine `#3d2b1f` (koyu kahve, logo'nun ahşap tabela dokusuyla uyumlu) yapıldı.
- Playwright ile görsel doğrulandı — logo ile arka plan arasında hiç seam/ton farkı yok.
- TS + 12/12 test yeşil.

## 4 & 6. ✅ TAMAMLANDI — "Envanter" ekranı (jettonla + TL ile satılan özel ürünler)
- Yeni tab: Emlah menüsüne "Envanter" eklendi (`EmlahMenu.tsx`, `KeyRingIcon`), Market'ten ayrı.
- `src/data/inventory.ts` — 4 ürün: **Şüphe Kalkanı** (3 Jetton, sıradaki 3 evde -12 şüphe), **Şanslı Çağrı** (2 Jetton, sıradaki evde garanti +15 ilgi/-10 şüphe), **Enerji Kutusu** (4 Jetton, enerjiyi anında %100'e tamamlar), **Özgüven Kıyafeti** (₺8.000, sıradaki evde -10 şüphe).
- `src/components/InventoryPanel.tsx` — yeni panel, MarketPanel ile aynı görsel dil (`.market-item` sınıfları).
- App.tsx: `pendingSuspicionDiscount` (sayısal, research + confidence-outfit'i topluyor), `pendingLuckyCall`, `shieldHousesLeftState` + localStorage'da kalıcı `getShieldHousesLeft/setShieldHousesLeft` (jetton/adSchedule ile aynı desen — save slot'larından bağımsız), hepsi ev geçiş bloğunda (`newStats` hesaplanırken) uygulanıyor. `handleBuyInventoryItem()` satın alma + efekt uygulama.
- TS + 12/12 test + imzalı archive doğrulandı.
- Not: "Ofis Ekipmanı" (mevcut `officeImages.ts`/`countOwnedOfisItems`, TL ile Market'te satılan kalıcı eşyalar) bilerek ayrı bırakıldı, karıştırılmadı — Envanter tamamen yeni, tüketilebilir buff'lar için.

## 5. 🟡 NEREDEYSE TAMAMLANDI — Game Center (altyapı + 20 başarım + leaderboard ASC'de hazır, 15/20 kodda tetikleniyor)

**Altyapı tamamen kuruldu:**
- npm'deki hazır Game Center pluginleri (`@openforge/capacitor-game-connect`, `capacitor-game-connect-8`, `@osmanraifgunes/capacitor-game-connect` vb.) denendi — hepsi aynı sorunu taşıyor: sadece CocoaPods podspec'i var, Swift+Objective-C dosyalarını aynı SPM target'ında karıştırıyorlar ve Swift Package Manager bunu reddediyor ("mixed language source files; feature not supported"). Bu proje CocoaPods değil Capacitor'ın SPM entegrasyonunu kullanıyor.
- **Çözüm**: `ios/App/App/GameCenterPlugin.swift` — projeye özel, npm paketi olmayan, Swift-only bir Capacitor plugin'i. 5 metod: `authenticate`, `unlockAchievement`, `showAchievements`, `submitScore`, `showLeaderboard`.
- `ios/App/App/App.entitlements` oluşturuldu (`com.apple.developer.game-center: true`), `project.pbxproj`'a `CODE_SIGN_ENTITLEMENTS` build setting'i eklendi (Debug + Release).
- **App Store Connect API ile**: Bundle ID'ye (`PX4ZXGVN35`) `GAME_CENTER` capability'si eklendi. Eski "Simsar Emlak App Store" provisioning profile bu capability'yi içermediği için geçersiz (INVALID) oldu — **yeni bir profil** ("Odd Estate App Store", id `7Y6Q49T854`) oluşturuldu ve yerel makineye kuruldu, `PROVISIONING_PROFILE_SPECIFIER` buna güncellendi.
- **✅ ASC'de Game Center açıldı ve 20 başarım + 1 leaderboard TAMAMEN API İLE OLUŞTURULDU** (`POST /v1/gameCenterDetails`, `/v1/gameCenterAchievements`, `/v1/gameCenterAchievementLocalizations`, `/v1/gameCenterLeaderboards`, `/v1/gameCenterLeaderboardLocalizations`) — daha önce "muhtemelen manuel" diye not düşülmüştü ama API tam destekliyormuş, hepsi otomatik yapıldı, **manuel ASC adımı kalmadı**. Leaderboard id: `toplam_kazanc` (İngilizce lokalizasyon: "Total Earnings"). 20 başarımın hepsi `ACHIEVEMENT_IDS` ile birebir eşleşen `vendorIdentifier`'larla, İngilizce lokalizasyonlarıyla oluşturuldu ve doğrulandı (`GET gameCenterAchievements` → 20/20).
- `src/data/gameCenter.ts` — `ACHIEVEMENT_IDS` (20 id), `LEADERBOARD_ID`, `initGameCenter()`, `unlockAchievement()` (idempotent), `showAchievements()`, `submitLeaderboardScore()`, `showLeaderboard()`. `CareerPanel.tsx`'e "🏆 Liderlik Tablosu" butonu eklendi, `earned` değiştikçe skor otomatik gönderiliyor.
- İmzalı Release archive başarıyla derlendi, `codesign -d --entitlements` ile `com.apple.developer.game-center: true` doğrulandı.
- **Kalan tek şey**: Leaderboard'a bir görsel (icon) eklenmedi (opsiyonel, App Store incelemesi için gerekebilir — ASC'de leaderboard sayfasından elle eklenebilir).

**Kodda tetiklenen 15/20 başarım** (App.tsx'te merkezi bir `useEffect` + 3 event-bazlı hook):
1. ✅ İlk Satış (`ilk_satis`) — `results` içinde ilk "sold"
2. ✅ On Numara (`on_numara`) — 10 satış
3. ✅ Emlak Kralı (`emlak_krali`) — oyunu bitirme ekranı (tüm evler tamamlandı)
4. ✅ Fırat'ı Geçtim (`firati_gectim`) — `defeatedRivalIds.includes("firat")`
5. ✅ Rakip Yok Edici (`rakip_yok_edici`) — `defeatedRivalIds.length >= rivalLadder.length`
7. ✅ Patron Aşkı (`patron_aski`) — `bossMood >= 100`
8. ✅ Terfi Zamanı (`terfi_zamani`) — `earned >= 1.500.000` (en üst rütbe eşiği)
9. ✅ Arkadaş Canlısı (`arkadas_canlisi`) — 3 arkadaş bond'u >= 10
10. ✅ Yalnız Kurt (`yalniz_kurt`) — 20 satış + hiç arkadaş bond kaydı yok
11. ✅ Yatırımcı (`yatirimci`) — `investmentResults`'ta ilk "sold"
15. ✅ Sadık Müşteri (`sadik_musteri`) — `secondChanceOffered` true
16. ✅ Efsane Oldu (`efsane_oldu`) — prestij tamamlama sayısı >= 1
17. ✅ Zengin Emlakçı (`zengin_emlakci`) — `earned >= 10.000.000`
18. ✅ Jetton Koleksiyoncusu (`jetton_koleksiyoncusu`) — herhangi bir Jetton satın alımı *(sadece satın alımla)*
19. ✅ Büyük Yatırımcı (`buyuk_yatirimci`) — 100 Jetton paketi satın alımı *(sadece satın alımla)*
20. ✅ Tam Destek (`tam_destek`) — Full Version + Remove Ads ikisi de satın alınmış *(sadece satın alımla)*

**Kodda HENÜZ tetiklenmeyen 5 başarım** (güvenilir bir hook noktası bulmak için daha fazla araştırma/tasarım gerekiyordu, zamanla sınırlı bu oturumda atlandı — yanlış/gevşek bir koşulla yanlış tetiklemek istemedim):
- 6. Dürüst Emlakçı (`durust_emlakci`) — "bir haftayı ortalama %20 altı şüpheyle bitir": `weekOutcome.avgSuspicion` zaten hesaplanıyor (bkz `evaluateWeek`), hafta sonu değerlendirme akışına (App.tsx'te `weekOutcome` üretilen yer) bir kontrol eklenmeli.
- 12. Mahalle Fatihi (`mahalle_fatihi`) — "bir semtte dominasyon sağla": `isDistrictDominated()` (`istanbulMap.ts`) zaten var, ama tüm semtleri iterate edip herhangi birinin dominated olduğunu kontrol eden bir yer yok, eklenmeli.
- 13. Pazarlık Ustası (`pazarlik_ustasi`) — "bir haftada 5 kez held firm": held-firm sayısı `depth-systems`/contradiction mantığında per-house kontrol ediliyor ama haftalık toplam sayaç tutulmuyor, yeni bir state gerekiyor.
- 14. Gece Kuşu (`gece_kusu`) — "mini oyunların hepsini dene": `minigameSchedule.ts`'teki sayaçlar 8 saatlik pencereye göre siliniyor, "hiç oynadın mı" kalıcı bir bayrak tutmuyor — 4 mini oyun id'si için ayrı "ever played" localStorage bayrakları eklenmeli (`inventory.ts`/`jettons.ts` ile aynı desen).

**Kalan gerçek adım — App Store Connect'te 20 başarımı tanımlamak**: Bu ASC web arayüzünden elle yapılmalı (My Apps → Odd Estate → Features → Game Center → Achievements). Her biri için yukarıdaki id'ler (`ilk_satis`, `on_numara` vb.) Achievement Reference Name olarak birebir kullanılmalı — koddaki id'lerle ASC'deki id'ler eşleşmezse `unlockAchievement()` çağrıları sessizce başarısız olur (Game Center bilinmeyen id'yi reddeder). Bu adım App Store Connect API ile mi otomatikleştirilebilir yoksa tamamen manuel mi gerektiriyor, denenmedi — sonraki oturumda önce API denenebilir.

## 6. ✅ TAMAMLANDI — bkz. madde 4 (Envanter ekranındaki 3 Jetton ürünü)

## 7. ✅ TAMAMLANDI — Mini oyun değişimi + enerji/cooldown rework
- `kahve`/`muzik`/`sekerleme` kaldırıldı, yerine **Anahtar Bul** (`anahtar`, 6 anahtar arasından görsel olarak farklı olanı hızlıca bul), **Mesajları Sırala** (`mesaj-sirala`, 3 karışık mesajı doğru kronolojik sırayla dokun), **Fiyat Tahmin Et** (`fiyat-tahmin`, sentetik bir eve en yakın fiyatı 3 seçenekten bul) eklendi. "Kısa Yürüyüş" (`yuruyus`) dokunulmadan kaldı.
- `MINIGAME_ENERGY_GAIN` 10 → 2 (`energy.ts`).
- Yeni `src/data/minigameSchedule.ts` — her mini oyun id'si için ayrı `localStorage` zaman damgası dizisi, 8 saatlik kayan pencerede en fazla 4 hak (`getPlaysRemaining`/`getNextAvailableAt`/`recordPlay`), kayıt slotlarından bağımsız (jetton/adSchedule/inventory ile aynı desen).
- `EnergyBreakScreen.tsx` — her kart kalan hak sayısını ("3 hak kaldı") ya da kilitliyse kalan süreyi ("7 sa 23 dk sonra") gösteriyor, hak biterse buton disabled. `App.tsx`'teki `handleEnergyBreakChoice` artık `recordPlay()` çağırıyor ve `getPlaysRemaining() <= 0` ise sessizce reddediyor.
- Playwright ile 3 yeni mini oyunun render'ı + kilitli durum gösterimi görsel doğrulandı, bir yuvarlama hatası ("7 sa 60 dk" gibi) bulunup düzeltildi.
- TS + 12/12 test + imzalı archive doğrulandı.

## 8. ✅ TAMAMLANDI — Jetton satın alma butonlarının hizası
- `src/game.css`'e `.day-activity-list-3col { grid-template-columns: 1fr 1fr 1fr; }` eklendi, `SettingsScreen.tsx`'teki jetton listesine bu class eklendi (`.day-activity-list.day-activity-list-3col`). OfficeScene/EnergyBreakScreen'in 2 sütunlu kullanımı dokunulmadan kaldı. Playwright ile görsel doğrulandı — 3 kart artık tek satırda.
- TS + 12/12 test yeşil.

## 9. Hiçbir ikon stok ikon olmasın, gerekirse SVG olarak elle çizilsin
- Mevcut durum: `src/components/icons.tsx` içindeki ikonlar ZATEN el yapımı pixel-art tarzı custom SVG'ler (`Grid` + `rect` tabanlı bir sistem, bkz `LogoIcon`, `BellIcon`, `ChalkboardIcon` örnekleri) — stok ikon paketi (Font Awesome/Heroicons vb) kullanılmıyor.
- Görev: uygulama genelinde HİÇ stok ikon/emoji kalmadığından emin olunmalı — özellikle emoji kullanımı çok yaygın (☕🎧🚶😴🪙🔓🚫 vb, bkz `energyBreak.ts`, `jettons.ts`, `SettingsScreen.tsx`, `dayActivities.ts`). Kullanıcı "hiçbir ikon" derken emoji'leri de kastediyor olabilir — bu netleştirilmeli: emoji'ler de custom SVG ikonlarla değiştirilecek mi? Kapsam sonraki oturumda kullanıcıyla teyit edilmeli (muhtemelen kapsam büyük, öncelik sırası konuşulmalı).

## 10. ✅ TAMAMLANDI — Müzik entegrasyonu
- Not: masaüstündeki `simsarmuzik` klasöründe 5 değil **4 dosya** vardı (1.mp3-4.mp3), 4'ü ile entegre edildi.
- `src/assets/music/track1-4.mp3` içine kopyalandı, `sound.ts`'teki `startMusic()`/`stopMusic()` artık gerçek bir `<audio>` elemanıyla çalışıyor (eski prosedürel oscillator-drone kaldırıldı). Her modül yüklemesinde (uygulama açılışı) rastgele bir şarkıdan başlıyor, `ended` event'inde bir sonrakine geçip sonunda başa dönüyor (playlist döngüsü).
- **Kritik bug bulundu ve düzeltildi**: `startMusic()` daha önce SADECE Ayarlar'daki müzik slider'ından çağrılıyordu, App.tsx hiç çağırmıyordu — yani müzik hiçbir zaman otomatik başlamıyordu (kullanıcının "hiç müzik yok" şikayetinin kök nedeni). App.tsx'e mount olduğunda (splash sırasında) `startMusic()` çağıran ve tarayıcı/WKWebView autoplay politikası engellerse ilk dokunuşta tekrar deneyen bir `useEffect` eklendi.
- Playwright ile doğrulandı: rastgele seçilen track dosyasına gerçek network isteği gidiyor, konsol hatası yok.
- TS + 12/12 test + imzalı archive doğrulandı (bundle ~54MB, App Store limitlerinin çok altında).
