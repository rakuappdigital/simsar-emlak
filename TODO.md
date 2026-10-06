# ✅ Ekspertiz 2. tur + Yan Görev paketi — Build 12 (2026-10-06 akşam)
Rapor (güncel, 3. sürüm): https://claude.ai/artifact/KJBCEjckGSns1G62N1q83B
**Genel kural (kullanıcı):** Oyunda HİÇBİR YERDE emoji yok; tüm görseller bize ait (çizilen SVG/piksel ya da kullanıcı üretimi), stok yok.
Build 11→12, CLI pipeline, "UPLOAD SUCCEEDED" (Delivery UUID `b39b3a16-4e33-469b-a41c-03bf7a250c6b`). İNCELEMEYE GÖNDERİLMEDİ. Ölçüm APP_ID (gerçek) build'de doğrulandı.
Testler: `node tests/run-all.mjs` → 20/20 (yeni `tests/side-quests.mjs` dahil). Commit/push YOK.

## ⏳ Kullanıcı kararı / onayı bekleyen
- [ ] **G8** (diyalog ilk izlenim) — uygulanmadı; rapordaki G8-a (öğretici baloncuk) / G8-b (barlarda sayı+ikon) / G8-c (+8/−5 değişim sayısı) / G8-d (metin hızı ayarı) seçimini bekliyor.
- [ ] **O0 ATT** — build 12'yi temiz kur, ekran kaydı al, App Review Notes + 2.1 yanıtı.
- [ ] **Gizlilik sayfası** — privacy(-tr).html TelemetryDeck maddesi yayında değil; incelemeden ÖNCE App Store'daki gizlilik URL'sine yayınlanmalı (onayla).
- [ ] **O2 TR fiyat** — ASC'de doğrulandı: full_unlock ₺39,99 = bundle_full_jetton30 ₺39,99 (USA $1.99/$2.99). Öneri: paket ₺59,99 ya da tam sürüm ₺29,99.
- [ ] **O1** — remove_ads + 2 noads paketi READY_TO_SUBMIT (hiç satılmadı). SİLME; sürümü gönderirken IAP listesine ekleme.
- [ ] **O4 yan not** — EN mağaza metni karaktere "Emlah" diyor, oyunun EN'inde "Estetan". Hangisi?
- [ ] **O6** commit + push (onayla).
- [x] O3 Game Center "Tam Destek" açıklaması → "Purchase the Full Version." (API ile güncellendi)
- [x] O5 kararsız testler düzeltildi (energy-minigames durum bekliyor; fateful-moments araya giren iş görevini geçiyor)

## ✅ Uygulananlar (rapordaki kodlar)
- G3+S3: gövde fontu **Jersey 15** (Pixelify'da 5↔S karışıyordu), Press Start 2P yalnız ≥16px, min 12px; fontlar `src/assets/fonts`'ta paketli (Google CDN kalktı). Kök 20px korunuyor, ölçek `--fs-xs/sm/md/lg`.
- G10+S4: renk rolleri (`--c-frame`, `--c-select-*`, `--c-relation`), devre dışı birincil buton gri. G14 nabızlar 2–3 tur.
- S2+G5+G12: tek satır üst bar (`.topbar`), bakiye bilgi, jeton→Mağaza, dişli→Ayarlar, disket kayıt göstergesi; iş görevi sırasında "Ev 1" hatası düzeldi.
- S1+S9+G6: ofiste alt sekme çubuğu (Ofis/Telefon/Emlah/Mağaza; DOM'da OfficeScene'den önce — `.office-messages-btn` ilk=Telefon, son=İşler testler için), sabit eylem şeridi, sayılı metreler, yatay aktiviteler.
- G2+G13: Emlah menüsü 4 bölüm (Çarşı/İşim/İnsanlar/Ben); testler `tests/helpers/emlah.mjs` openEmlahTab ile bölüm açıyor. Oyun içi "Çarşı"/"Alışveriş", gerçek para "Mağaza".
- G11+S8: `LockedCard` + `rankProgress()`.
- S5: iOS bildirimi (`NotificationBanner`), yalnızca gerçek okunmamış mesajlar; ofiste dokununca sohbet açılır (`MessagesPanel initialThreadId`).
- G7: sahte bildirim kalktı → `logFlavorMessage` (Telefon'da kozmetik okunmamış, en fazla 3 sohbet, bildirim yok); dokununca hızlanma; telefon sahnesinde üst bar gizli.
- S6+G4: `ResultCard` (damga inline, 3 stat, neden, para dökümü, sonraki adım). S7+G9: sözleşme segmentleri + teslim etkisi + "N seçim kaldı".
- Emoji temizliği: ~470 emoji; 40+ yeni piksel ikon (`icons.tsx`), veri ikonları anahtar → `GameIcon`; Vitrin Karesi sprite'ları canvas'ta piksel çizim; bayraklar vektör; Esprili tarzı metin ekleri.

## ✅ Yan Görev & Easter Egg paketi (12/12)
Kod: `src/data/sideQuests.ts` (durum+metin+kurallar), `src/hooks/useSideQuests.ts` (akış), `src/data/album.ts` (oyunlar arası), `src/data/specialDays.ts`, `src/data/secretHouses.ts` (yalı + 55. ev), bileşenler `SideStoryModal`, `AlbumSection`; DialogueScene `sideChoices`; kayıt `SaveGame.sideQuests` (persist + sessiz `patchSave`). 8 yeni rozet. Ayrıntılı tetikleme tablosu raporda.

---


# ✅ (UYGULANDI 2026-10-06, yukarıya bak) Yan Görevler & Easter Egg Paketi — orijinal tasarım notları

Kullanıcı paketi beğendi, "bir sonraki session'da ele alalım" dedi. Önce hangilerinin seçileceğini kullanıcıyla netleştir, sonra detaylı tasarla + uygula.
Temel içgörü: mevcut sürprizlerin hepsi pasif (zar tutunca oyuncunun başına geliyor: 6 Tuhaf An, ünlüler, gizli müşteri, düello, zaman yolcusu, konsol/tıklama sayacı). Oyuncunun PEŞİNE DÜŞEBİLECEĞİ / KEŞFEDEBİLECEĞİ bir şey yok.
Efor: S küçük, M orta, L büyük.

**Claude'un önerisi (ilk build):** B1 Albüm + A3 Muhtar'ın Defteri + B4 Gerçek Takvim Günleri. Sonraki büyük içerik: A1 + B7.

## A. Yan Görevler (birden çok eve yayılan)
- [ ] **A1. Nadide Hanım'ın Anahtarı (L)** — Satış sonrası yaşlı müşteri etiketli eski bir anahtar verir. Sonraki evlerde müşteri ağzından ipuçları ("Kuzguncuk'ta yeşil kapılı yalı…"), Şehir Haritası'nda "?" işaretli bölge. Doğru bölgedeki evde "(Anahtarı göster)" seçeneği (yanlış evde +şüphe). 3 ipucu → gizli yalı açılır: tek seferlik özel satış + kendine özgü final. Bağlantı: easterEggs satır enjeksiyonu, istanbulMap, friendHouses sahne altyapısı.
- [ ] **A2. Muzaffer Bey'in Sırrı (M)** — Chitchat'e sızan detaylar ("çocukken oturduğum ev de bahçeliydi…") portföydeki belirli bir evi işaret eder. O evde "Muzaffer Bey'e haber ver" seçeneği → patron memnuniyeti kalıcı yükselir (düşüş yarıya iner) + yeni ending varyasyonu. Başkasına satılırsa sessiz, kırgın bir mesaj. Bağlantı: chitchat, bossMood, endings.
- [ ] **A3. Muhtar'ın Defteri (M)** — Bekleyen "Esnafla Çay" fikrini mekaniğe çevirir: çay aktivitesi Muhtar Cemal'i tanıtır, haftalık küçük mahalle işleri verir ("Bu hafta Kadıköy'de sat", "İndirimsiz sat", "Kedili aileye ev bul"). Kontrol listesi; her iş → sonraki evde "yerel bilgi" diyalog seçeneği + küçük para. 10 iş → "Mahallenin Emlakçısı" unvanı (müşteriler tanıyarak başlar, −şüphe). Bağlantı: dayActivities, goals/haftalık hedefler, badges.
- [ ] **A4. Bir Müşterinin Hayatı (M)** — Satılan müşteri aylar sonra döner: bebek → daha büyük ev; sonra yurt dışı → evini sat; en son düğün davetiyesi. 3 temaslı karakter hikâyesi; Rehber kartı büyür, her aşama satış fırsatı/referans. Bağlantı: callbacks, contactBook, echoNetwork.
- [ ] **A5. Hayalet Ev Soruşturması (S-M)** — 👻 Tuhaf An görüldükten sonra ofiste "Soruşturmayı sürdür" iş kartı: 3 adım (eski gazete kupürü — Tapu Masası tarzı belge, bekçinin ifadesi — mesaj, gece ziyareti). Komik/sıradan sonuç (eski kalorifer tesisatı). Ödül: rozet + o tip evlerde "hayalet hikâyesini anlat" (+eğlence).

## B. Easter Egg'ler (oyuncunun keşfettiği sırlar)
- [ ] **B1. Tuhaf Anlar Albümü (M) — çarpan madde** — Ofiste "Albüm" sekmesi: görülen her easter egg / ünlü / gizli müşteri / sır bir kart; görülmeyenler "???" + 1 satırlık ipucu ("Gece yarısı ofiste biri var…"). 5 / 10 / tümü için jetton ödülleri. Mevcut `easterEggsSeenCount` altyapısı var.
- [ ] **B2. Kedi Fotoğrafçısı (S)** — Vitrin Karesi'nde kediyi 3 karede de TEK BAŞINA yakalarsan gizli sonuç: ilan viral (mevcut socialReaction), Muzaffer "ilanı kedi sattı", rozet.
- [ ] **B3. Tanıdık İmza (S)** — Tapu Masası'nda nadiren alıcı eski bir müşteri ya da Fırat Bey (sahte imza). Reddedince Fırat'tan sinirli mesaj + rakip merdiveninde küçük avantaj.
- [ ] **B4. Gerçek Takvim Günleri (S)** — Cihaz tarihine bağlı: 1 Nisan (müşteriler saçma isteklerle gelir), 13'ü Cuma (her evde bir aksilik satırı), 29 Ekim / yılbaşı (ofis süsü + patron kutlaması), oyunun yıldönümü (geliştirici notu). seasonalTint + inbox altyapısıyla.
- [ ] **B5. Gece Yarısı Müşterisi (S)** — Gerçek saat 00:00–04:00: ofis kararır, tek seferlik "gece kuşu" müşteri (ışık geçirmeyen pencereli ev arıyor, çok kibar). Satışı özel rozet.
- [ ] **B6. Radyonun Gizli Frekansı (S)** — RadioTicker'a üst üste 5 dokunuş → gizli istasyon: Emlah'ın seçilen geçmişine (origin) göre yazılmış kısa, samimi anlatım.
- [ ] **B7. 55. Ev: Emlah'ın Kendi Evi (L) — final sırrı** — Portföy 54'te biter; oyunu belirli bir koşulla (ör. hiç indirimsiz + dürüstlük ağır basarak) bitirenlere gizli 55. ev: Emlah'ın kendi evi. Alıcı genç, idealist bir emlakçı (Emlah'ın ilk günkü hali). Duygusal kapanış.

---

# 🍎 Apple reddi (ATT) + mesajlar + tam sürüm = reklamsız — Build 11 (2026-10-06)

## ⏳ BEKLEYEN — İncelemeye göndermeden önce
- [ ] **İncelemeye GÖNDERİLMEDİ.** Kullanıcı kararı: bugünkü eklemeler (yan görev paketi + web önerilerinden seçilenler) bitmeden review'e gönderilmeyecek. Build 11 sadece TestFlight testi için.
- [ ] **Cihazda ATT testi + ekran kaydı:** uygulamayı silip TestFlight'tan temiz kur → açılışta ATT penceresi çıkmalı (Game Center girişinden ÖNCE) → izin ver/verme → oyun akışı. Bu kaydı App Review Information > Notes'a ekle ve 2.1 mesajına yanıt olarak gönder (Apple tam olarak bunu istedi).
- [ ] **ASC:** `remove_ads`, `bundle_full_noads`, `bundle_full_noads_jetton30` → "Satıştan kaldır" (SİLME — eski alıcıların geri yüklemesi bunlara bağlı).
- [ ] **ASC fiyat kontrolü:** TR'de Tam Sürüm ₺39,99 ile "Full + 30 Jetton" ₺39,99 aynı görünüyor (yurt dışı $1.99 / $2.99) — kod mu yanlış, ASC mi?
- [ ] Game Center "Tam Destek" başarımı açıklaması + App Store metni "reklamsız paket" diyorsa güncelle.
- [ ] Commit/push yapılmadı (35297fe, 52ec5bc dahil yerelde).
- [ ] **ASC mağaza metni + 10 lokalizasyon (6 Ekim)** — `store/asc/en-US.txt` (ana metin, yan görev/albüm/özel günler dahil; EN'de kahraman adı Estetan) ve `store/asc/tr.txt` hazır. ASC'YE YÜKLENDİ (6 Ekim, geri okuma birebir): 17 dil — en-US, tr, ar-SA, ro, es-MX, pt-BR, pl, id, ru, ko, es-ES, ja, uk, de-DE, fr-FR, it, nl-NL. Dil dosyaları `store/asc/<locale>.txt` (13 dil `build_locales.py` ile: açıklama çeviri v3, sınırı aşan alt başlık/promo/kw v2'den; çeviri düzeltmeleri betikte). Yükleme: `python3 store/asc/upload.py "<locale>=<dosya>#<Bölüm>"` (denetim → oluştur/güncelle → geri oku).
  Kullanıcı aynı formatta (name/subtitle/Promotional Text/Description/keywords) ~10 dil dosyası gönderecek → `store/asc/parse_check.py` ile denetle
  (name/subtitle 30, promo 170, açıklama 4000 karakter; keywords 100 BAYT) → `store/asc/asc.py` (API) ile lokalizasyonları aç ve yapıştır → geri okuyup doğrula.
  ASC: app 6814282702, sürüm 1.0 (d848afbd-…), appInfo f7be6adf-…. Ekran görüntüsü: TR hariç hepsi İngilizce; yeni lokalizasyonlar en-US görüntülerini otomatik devralır.
  DİKKAT: açıklama yan görev paketini anlatıyor → incelemeye giden build bu paketi İÇERMELİ.
- **Ölçüm (TelemetryDeck, 6 Ekim) — kod AÇIK** (App ID `04441313-DCAA-41B1-90E8-09568B546415`, test sinyali 200). `src/data/analytics.ts`
  (Sadrazam'daki modülün kopyası). http://localhost'ta hep kapalı (testte açmak: `localStorage["simsar-emlak-an-test"]="1"`).
  Sürüm/build vite.config.ts ile pbxproj'dan otomatik okunur.
  - [x] Kod + App ID + test (Chromium/WebKit, ağ hatası, smoke)
  - [x] ASC App Privacy: Usage Data → Product Interaction (Analytics, Not linked, No tracking) — kullanıcı elle ekledi
  - [x] privacy.html / privacy-tr.html'e TelemetryDeck bölümü
  - [ ] Sıradaki iOS build (build + cap sync) — ölçüm ancak bununla devreye girer; öncesinde APP_ID'nin yerinde olduğunu kontrol et
  - [ ] Güncel privacy.html / -tr'yi canlı gizlilik adresine yayınla (incelemeye GÖNDERMEDEN önce, kullanıcı onayıyla)
  - [ ] Yayından 1–2 hafta sonra panoyu incele: house_result ile ev zorluk dengesi, app_background ile oyuncunun bıraktığı yer, paywall → purchase dönüşümü
  Olaylar: session_start, game_start, house_result (her ev), week_end, game_end, paywall_shown, store_open, purchase
  (ok/cancelled/error, revenuecat.ts), ad_shown/ad_failed (ads.ts), app_background (bağlam: stage, houseNo → nerede bıraktı).
  Kota Sadrazam ile ORTAK (ayda 50 bin; oyun başına ~70 olay).

## ✅ TAMAMLANDI — Apple 2.1 reddi: ATT penceresi hiç görünmüyordu (build 10, iOS/iPadOS 27.2)
Kök neden: `requestTrackingAuthorization` kodun HİÇBİR yerinde çağrılmıyordu (Info.plist'te açıklama + AdMob vardı, istek yoktu). Ek risk: açılıştaki Game Center girişi kendi penceresini açıyordu — iOS başka bir sistem penceresi açıkken yapılan ATT isteğini sessizce yutar (inceleme cihazları genelde Game Center'a girişsiz).
- `ios/App/App/SceneDelegate.swift`: `sceneDidBecomeActive` → durum `notDetermined` ise 1 sn sonra, ana iş parçacığında, uygulama aktifse `ATTrackingManager.requestTrackingAuthorization`. Yutulursa sonraki aktif oluşta tekrar dener. (Uygulama scene tabanlı — AppDelegate.applicationDidBecomeActive çağrılmıyor.)
- `src/data/tracking.ts` (yeni): `waitForTrackingDecision()` — ATT cevabını bekler (maks 45 sn).
- Game Center girişi ve `AdMob.initialize` artık bu cevaptan SONRA başlıyor → izin öncesi veri toplanmıyor.
- Arşivde doğrulandı: NSUserTrackingUsageDescription var, AppTrackingTransparency.framework bağlı, binary'de requestTrackingAuthorization var.
- Build 10→11, CLI pipeline. "UPLOAD SUCCEEDED with no errors" (Delivery UUID `1b07af25-e681-47c9-b5e6-9ac4c1456f01`).

## ✅ TAMAMLANDI — Mesajlar: okunmamış takibi + telefon görünümü
Kök neden: tek bir global `seenInboxCount` sayacı vardı; sohbet bazında okunmamış bilgisi yoktu.
- Her `InboxMessage`'a `read` bayrağı (kayıtla saklanır; eski kayıtlar yüklenirken okundu sayılır — `migrateInboxReadFlags`).
- Sohbet açılınca sadece o sohbet okunur (`markThreadRead`), kayda sessizce yazılır (`markSavedThreadRead`, "Kaydedildi" rozeti çıkmadan).
- Telefonda canlı görülen sohbetler (Muzaffer'in günlük mesajı, sohbet/arkadaş/geri arama/buluşma) otomatik okundu.
- Düzeltilen gizli hatalar: cüzdan butonu (Market) tüm mesajları okundu yapıyordu; `pruneInbox` sayacı kaydırıyordu; yeniden açılışta okunmamışlar sıfırlanıyordu.
- `MessagesPanel` yeniden: telefon çerçevesi + "Sohbetler" listesi (avatar, gün, okunmamışlar kalın + yeşil sayaç, "Yanıt bekliyor" etiketi, Muzaffer sabit) + sohbet ekranı (gün ayraçları, "Okunmamış mesajlar" çizgisi, aksiyonlar alttaki yanıt çubuğunda).
- Başlıkta cüzdandan AYRI kırmızı 📱 göstergesi (ofisteyken Mesajlar'ı açar); ofis butonu "Mesajlar · N yeni".
- Test güncellendi: `tests/final-touches.mjs` (.thread-row → .msg-row).

## ✅ TAMAMLANDI — Tam sürüm = geçiş reklamı yok, "Reklamları Kaldır" kaldırıldı
- `isAdsRemoved()` artık tam sürümü de kabul ediyor (eski reklamsız alıcılar korunuyor). Ödüllü reklamlar (Enerji Molası, İkinci Şans) aynen duruyor.
- Market: "Reklamları Kaldır" kartı + iki reklamsız paket kaldırıldı; tek başlangıç paketi (Full + 30 Jetton) kaldı; Tam Sürüm altına reklam notu.
- Paywall yeniden: 5 maddelik avantaj listesi (54+ ev, geçiş reklamı yok, ödüllü reklamlar isteğe bağlı, tüm sistemler, tek seferlik ödeme).
- Hata düzeltmesi: geri yükleme sadece tekil ürünlere bakıyordu → paket alan oyuncu yeniden kurulumda tam sürümü kaybediyordu. Artık 3 paket de tam sürümü geri getiriyor.
- "Tam Destek" başarımı tam sürümle açılıyor; karşılama teklifi metni güncellendi.

## ✅ TAMAMLANDI — Arayüz ekspertiz raporu (web)
https://claude.ai/artifact/KJBCEjckGSns1G62N1q83B — 14 bulgu (G1–G14), 9 sadeleştirme fikri (S1–S9), 7 diğer öneri (O1–O7), önerilen sıra. Kullanıcı maddeleri tek tek cevaplayacak.

## Testler
`node tests/run-all.mjs`: 19 testin 16'sı ilk koşuda geçti; `final-touches` seçici güncellemesiyle geçti; `energy-minigames` ve `energy-office-regen` tek başına 3/3 geçiyor (toplu koşuda zamanlamaya bağlı kararsız — sabit bekleme yerine waitFor'a çevrilmeli).

---

# Portföy kilidi, İşler kararları, aktivite düzeltmeleri (2026-09-26)

## ✅ TAMAMLANDI — Dil seçimi her açılışta
Splash → bayraklı dil ekranı (son seçim vurgulu) → ana menü. Eskiden sadece ilk kurulumda çıkıyordu, güncelleme alan TestFlight kullanıcıları hiç görmüyordu.

## ✅ TAMAMLANDI — İltifat döngüsü (kritik)
Tepkiden sonraki "Devam" aynı düğüme dönüp satırları baştan oynatıyordu. Artık iltifat + cevap sonrası düğümün kalan seçenekleri geri geliyor. 8 gerçek iltifat cümlesi (TR/EN). Test: `tests/compliment-flow.mjs`.

## ✅ TAMAMLANDI — Enerji kilidi (kritik)
Pasif dolum sadece ev geçişlerinde hesaplanıyordu; enerjisi eşiğin altında ofiste kalan oyuncu hiç toparlanamıyordu. Ofisteyken dakikada bir + uygulamaya dönüşte de hesaplanıyor. Test: `tests/energy-office-regen.mjs`.

## ✅ TAMAMLANDI — Portföy kilidi (kritik)
Tier şartları karşılanmadan kilide gelen oyuncu kalıcı takılıyordu. Kilit ekranı: şart listesi, "Kaçan Müşterileri Tekrar Ara" listesi (mevcut geri arama akışı, bitince kilide döner), "50 Jetton ile Geç". Test: `tests/tier-lock.mjs`.

## ✅ TAMAMLANDI — İşler: Şimdi Git / Ertele / Reddet
Eski tek buton ("Ziyareti Aç", %40/%30/%30 zar) kaldırıldı. Ertele: 1 kez, müşteri +5 şüphe ile başlar. Reddet: onaylı, sonuç "reddedildi" (lost + retriedLost, geri aramalara girmez), seri bozulur, patron −5, enerji harcanmaz. Kapı ekranında "← Vazgeç, İşler'e dön" (enerji iade, tekrar girişte hazırlık tekrarlanmaz). Test: `tests/job-decisions.mjs`.

## ✅ TAMAMLANDI — Günün aktiviteleri
Kartlarda etki gösteriliyor. Müşteri Araştırması'nın −8 şüphesi bir SONRAKİ eve gidiyordu, artık bugünkü müşteriye uygulanıyor.

## ✅ TAMAMLANDI — Aktivite mini oyunları (Vitrin Karesi + Tapu Masası)
Web prototipleri (https://claude.ai/artifact/Qatos7JhJp71enHRqbRb8B) arasından kullanıcı ikisini seçti. `src/components/ActivityMiniGames.tsx`: Pazarlama → Vitrin Karesi (Patron +1/+3/+5, mükemmelde müşteri +5 ilgi), Ofis İşleri → Tapu Masası (+₺2.500/5.000/7.500, mükemmelde %25 "unutulmuş dosya" = kaçmış müşterinin geri arama hakkı yenilenir). Enerji giriş ücreti, oyun bitince kesilir. Profil Avı seçilmedi, Müşteri Araştırması doğrudan uygulanmaya devam ediyor. Test: `tests/activity-minigames.mjs`.

## ✅ TAMAMLANDI — Kayıt yüklerken kayıt bozulması (kritik)
continueSaved() enterPhone'u senkron çağırıyordu; içindeki persist() yüklenmemiş (eski/varsayılan) state'i diske yazıyordu: harcama 0 (bakiye şişiyor), rozet/bonus kazanç siliniyor, enerji 100, bekleyen iş null. Oyuncu yükleyip hemen çıkarsa kayıt bozuk kalıyordu (~2/3 yüklemede). enterPhone artık state işlendikten sonraki render'da çalışıyor. Test: `tests/load-integrity.mjs`.

## ✅ TAMAMLANDI — Build 10: TestFlight'a yüklendi
Build 9→10, CLI pipeline (archive → export → `xcrun altool --upload-app`). "UPLOAD SUCCEEDED with no errors" (Delivery UUID `bb93b810-36d4-4b88-814f-fd44e83a89b5`).

## ℹ️ Testler
Kayıt yüklemede ~1/3 ihtimalle araya ofis görevi giriyor (mevcut tasarım); bunu hesaba katmayan eski testler (energy, energy-office-regen, final-touches, scheduled-visit-exit, smoke, firat) sağlamlaştırıldı. `node tests/run-all.mjs` 19/19 yeşil.

## 💡 NOT — Detaylı düşünülecek: "Esnafla Çay" aktivitesi
Yeni günlük aktivite fikri: mahalle esnafıyla çay içip dedikodu dinlemek → bugünkü evde ekstra bir "yerel bilgi" diyalog seçeneği açılır (ör. "Karşı apartmana metro geliyormuş"). Kullanıcı bunun üzerine ayrıca detaylı düşünmek istiyor — otomatik uygulanmayacak. Yan görev / easter egg paketiyle birlikte ele alınabilir.

---

# Oyunu Bitir, randevu kilidi, market açıklamaları — Build 9 (2026-09-25)

## ✅ TAMAMLANDI — Oyun içi "Oyunu Bitir"
Oyun içinden açılan Ayarlar'a onaylı "Oyunu Bitir" eklendi (ana menüden açılınca görünmez). Ana menüye döner, ilerleme son otomatik kayıtta kalır.

## ✅ TAMAMLANDI — Randevu verilen müşteride yeni güne geçememe (soft-lock)
Kök neden: `OfficeScene` bekleyen ziyaret varken (status "scheduled" dahil) "Yeni Güne Geç"i gizliyordu; randevu geri sayımını azaltan tek yer `handleAdvanceDay` olduğu için oyun kilitleniyordu. Artık "Yeni Güne Geç — randevuya N gün" gösteriliyor. Ek olarak geri sayım `persist` ediliyor (eskiden yeniden açılışta sıfırlanıyordu) ve bekleme günlerinde günlük aktiviteler sıfırlanıyor. Regresyon testi: `tests/scheduled-visit-exit.mjs`.

## ✅ TAMAMLANDI — Market açıklamaları
Kartların altında kopuk duran açıklamalar kaldırıldı. Kullanıcıya 3 tasarım (pencere / açılır / kart içi) gösterildi, "B · Açılır" seçildi: karta dokununca açıklama + "Satın Al — fiyat" kartın satırının hemen altında açılıyor.

## ℹ️ Dil seçimi
Zaten istenen şekilde çalışıyor (splash → sadece ilk kurulumda dil seçimi → ana menü; ana menü Ayarlar'dan değişir, oyun içinde kilitli) — gerçek splash ile doğrulandı, değişiklik yapılmadı.

## ✅ TAMAMLANDI — Build 9: TestFlight'a yüklendi
Build 8→9, CLI pipeline (archive → export → `xcrun altool --upload-app`). "UPLOAD SUCCEEDED with no errors" (Delivery UUID `6ae5372e-ca79-454f-a18b-b04e69b91d7e`).

---

# Fiyat düzeltmesi, ikon yenileme, ödül/harcama döngüsü canlı testi (2026-09-25)

## ✅ TAMAMLANDI — Müzik fade bug'ı (kök neden bulundu)
`sound.ts`'teki `fadeVolume` tek bir paylaşılan modül-seviyesi `fadeRaf` kullanıyordu — `startSaleMusic()`/`stopSaleMusic()`'in aynı anda tetiklediği İKİ fade çağrısından ikincisi, birincinin henüz tek kare bile çalışmamış animasyonunu `cancelAnimationFrame` ile iptal ediyordu. Sonuç: eski parça asla `pause()` olmuyor, yeni parça üstüne biniyordu. `WeakMap<HTMLAudioElement, number>` ile her elemana kendi raf id'si verilerek düzeltildi.

## ✅ TAMAMLANDI — Ödüllü reklam butonu tepki vermiyor sorunu
`ads.ts`'te statik bir bug yoktu ama `resultPromise`'a 15sn güvenlik timeout'u (Dismissed/FailedToShow hiç gelmezse buton sonsuza kadar takılı kalmasın diye) ve `EnergyBreakScreen.tsx`'e başarısızlıkta görünür bir hata mesajı eklendi.

## ✅ TAMAMLANDI — Ödüllü reklam gizli şarj sistemi (8 hak / 4 saatte 1)
Yeni `src/data/adCharges.ts` — mini oyunlardaki hak sistemiyle aynı mantık, en fazla 8 şarj birikebiliyor, her biri 4 saatte bir yenileniyor. Kaç hak kaldığı ya da ne zaman yenileneceği kasıtlı olarak hiçbir yerde gösterilmiyor (sadece "izlenebilir mi" boole'u) — ücretli ürünlerin cazibesini korumak için. İzole bir simülasyonla regen matematiği doğrulandı.

## ✅ TAMAMLANDI — Gün/iş akışı yeniden tasarlandı
- **İş gelme olasılığı**: "Yeni Güne Geç" artık her zaman iş garanti etmiyor — %70, bir önceki ev satılmadıysa %42.
- **Gecikmeli müşteri mesajı**: Satış bittiğinde anında değil, %15 ihtimalle (1 gün ya da 3-8 gün sonrasına rastgele) planlanıyor (`pendingCallbacks`) — eski "her yeni eve girerken artan ihtimalle anlık callback" sistemi kaldırıldı.
- **"Evi Gez / Ofise Dön" seçimi**: Bugünün işi teklif edildiğinde artık otomatik satışa girilmiyor, oyuncuya seçim çıkıyor. "Ofise Dön" seçilirse ziyaret `pausedVisit` olarak bekletiliyor; yeni **İşler** sekmesinden (Mesajlar'ın yanına eklendi) açılınca %40 hemen kabul / %30 1-3 gün sonrasına erteleme (kabul/red) / %30 fırsat kaybı ruloları çalışıyor.

## ✅ TAMAMLANDI — Diyaloga İltifat Et / İkram Et seçenekleri
- **İltifat Et**: kariyer rütbesine göre ölçeklenen bonus (%80 başarı/%20 ters teper), her ev ziyaretinde en fazla 1 kez.
- **İkram Et**: `seker-ikrami`/`kahve-ikrami` artık evden önce pasif bonus vermek yerine sahne-içi aktif bir seçenek (müşterinin o anki ilgisine göre kabul şansı); bu iki eşya `consumeOneOfEach`'in otomatik tüketiminden çıkarıldı.
- **Test sırasında bulunan gerçek bug**: ilk halinde her iki seçenek de aynı diyalog düğümünde sınırsız tekrar sunulabiliyordu (istismar edilebilir stat farming) — `usedComplimentRef`/`usedIkramRef` ile ziyaret başına 1 kullanımla sınırlandı.

## ✅ TAMAMLANDI — Market ekranı Ayarlar'dan ayrıldı + "Değer Rozetleri" tasarımı
- Yeni `src/components/StoreScreen.tsx` — satın alma bloğu Ayarlar'dan çıkarıldı, tek bir "Market"/"Store" butonuna bağlandı.
- Başlangıç paketi kartları artık üstü çizili referans fiyat + gerçek fiyat + tasarruf yüzdesi + en avantajlıda rozet/altın parlama gösteriyor (piksel hediye kutusu ikonuyla, 3 tasarım/3 ikon yönü Artifact üzerinde kullanıcıya sunulup seçildi).
- TR başlangıç paketi fiyatları güncellendi (₺149,99/₺199,99/₺249,99 → ₺39,99/₺99,99/₺119,99) — App Store Connect API ile gerçek TUR fiyat noktalarına da uygulanıp GET ile doğrulandı.

## ✅ TAMAMLANDI — İngilizce'de karakter adı: Emlah → Estetan
Türkçe "Emlah" olarak kalıyor, İngilizce'de "Estetan" gösteriliyor. 248 "Emlah" geçen yerden TR metin/kod tanımlayıcıları/iç mekanizma kimlikleri (mesaj `from` alanı, balon hizalama karşılaştırması) ayıklanıp sadece görünen İngilizce metin (94 yer) değiştirildi. Test sırasında iki gerçek riski önceden yakalayıp düzeltildi: (1) diyalog konuşmacı portresi arama tablosu sadece "Emlah" anahtarıyla eşleşiyordu, "Estetan" takma adı eklendi; (2) `rivalDuel.ts`'te tr:/en: kalıbı dışında ayrı bir ternary'de kaçan bir cümle ikinci taramada bulundu.

## ✅ TAMAMLANDI — Build 8: TestFlight'a yüklendi
Yukarıdaki tüm değişiklikler + bir önceki oturumdan commit'lenmemiş işler (mini oyun yenileme, satış müziği, kapı eşiği ekranı, Hakkında bölümü) tek commit'te birleştirilip build numarası 7→8'e çıkarıldı, tam CLI pipeline'ıyla (archive → export → `xcrun altool --upload-app`) yüklendi. "UPLOAD SUCCEEDED with no errors" (Delivery UUID `cc02108c-89e2-40c5-9829-1ca869371497`).

---

## ✅ TAMAMLANDI — Enerji mini oyunları yeniden kurgulandı (Kutu Bul + Adım At)
Web'de artifact üzerinden birkaç tur onay alınarak (mekanik + görsel taşma bugları düzeltilerek) uygulandı:
- **🔑 Anahtar Bul → Kutu Bul (shell game)**: 4 kutu, 2sn doğru anahtarı gösterir, kapanır ve gerçekten (FLIP animasyonlu, tüm kutuları en az bir kez karıştıran) 3 saniyelik shuffle'dan sonra seçim istenir.
- **🚶 Adım At**: sabit "4sn'de 10+ tıkla" yerine artık 3 aşamalı (10→15→20 adım) kademeli zorluk.
- **Ortak "3 hak, birinde tutarsa ödül" mantığı**: her iki oyun da tek oturumda peş peşe 3 deneme hakkı veriyor, hangisinde tutturursa orada duruyor; 3'ü de kaçarsa ödül yok (eskiden "fail" de küçük bir ödül veriyordu, o kaldırıldı).
- `minigameSchedule.ts`: 8 saatlik pencere başına hak sayısı 4'ten **2**'ye düşürüldü (bir "hak" artık tüm 3-denemelik oturumu kapsıyor).
- `src/components/EnergyMiniGames.tsx` tamamen yeniden yazıldı, `src/game.css`'e `.minigame-attempt-*`/`.minigame-key-*` sınıfları eklendi.

## ✅ TAMAMLANDI — Ayarlar ikonundaki eski emoji kaldırıldı
Oyun içi header'daki ayarlar/jeton pili hem `GearIcon` (SVG) hem de 🪙 emojisi birden gösteriyordu — emoji kaldırıldı, sadece jeton sayısı + gear icon kaldı (`App.tsx`). Jeton bakiyesi zaten Ayarlar ekranında ayrıca gösteriliyor.

## ✅ TAMAMLANDI — Türkiye fiyatları güncellendi (kod + gerçek ASC fiyat şeması)
- Kod: `jettons.ts`/`purchases.ts` — jetton 20/50/100 → ₺19,99/₺39,99/₺79,99, Tam Sürüm → ₺39,99, Reklamları Kaldır → ₺79,99.
- **App Store Connect API ile gerçek manuel TUR fiyat noktaları da ayarlandı** (sadece görünen metin değil — 5 ürünün hepsi için `inAppPurchasePriceSchedules` POST edildi, ASC'nin sunduğu TUR price point'lerinden birebir eşleşen değerler bulunup uygulandı, GET ile doğrulandı). Önceki oturumdaki "hayati" fiyat uyuşmazlığı bug'ının aynısına düşülmedi.

## ✅ TAMAMLANDI — Satış müziği (ayrı playlist + crossfade)
- `sound.ts`'e ana menü müziğinden tamamen bağımsız ikinci bir `<audio>` sistemi eklendi: `startSaleMusic()`/`stopSaleMusic()`, 1 saniyelik fade-out/fade-in.
- Satış diyaloğuna girerken (yeni "kapı eşiği" popup'ı onaylanınca) ana müzik fade-out, 3 satış müziğinden rastgele biri fade-in; satıştan çıkınca tam tersi.
- Müzik dosyaları: kullanıcı `~/Desktop/oddmus/1-3.mp3` içine koydu, ana menü müziklerinden farklı olduğu checksum ile doğrulandı, `public/audio/sale1-3.mp3` olarak yerleştirildi.

## ✅ TAMAMLANDI — Satışa giriş popup'ı ("kapı eşiği")
- Yeni `src/components/SaleIntroModal.tsx` — eve girmeden önce açılan, ev/müşteri/fiyat bilgisi gösteren, "Satışa Başla" ile onaylanan bir ara ekran. Ana menü müziği popup açıkken çalmaya devam ediyor, onaylayınca satış müziğine crossfade ediyor.
- Görsel: kullanıcının ürettiği iki kapı konseptinden (`door.png`/`door2.png`, Desktop) yakın çekim olan `door2.png` seçildi (küçük kart alanında daha güçlü okunuyor) → `src/assets/ui/sale-intro-door.webp`.
- `App.tsx`'e `saleIntroConfirmed` state'i + stage-geçiş `useEffect`'i eklendi (satıştan çıkınca müzik otomatik geri dönüyor).

## ✅ TAMAMLANDI — "Hakkında" bölümü (Ayarlar)
- Kullanıcıya iki ton önerisi (Sıcak/Kişisel vs Doğrudan Çağrı) artifact üzerinde TR/EN karşılaştırmalı gösterildi, "Sıcak/Kişisel" seçildi.
- Ayarlar ekranının altına, tıklanınca açılan (accordion, slide-down animasyonlu) bir buton olarak eklendi — bağımsız geliştirici olduğunu ve desteğin (yorum/mağaza paketi) projeyi büyütmeye yardımcı olduğunu anlatan TR/EN metin, kalp ikonu, v1.0 rozeti.

## ✅ TAMAMLANDI — Build 7: TestFlight'a yüklendi
Yukarıdaki tüm değişiklikleri içeren build, build numarası 6→7'ye çıkarılıp tam CLI pipeline'ıyla (archive → export → `xcrun altool --upload-app`) yüklendi. "UPLOAD SUCCEEDED with no errors" — Apple'ın işleyip TestFlight'ta göstermesi ~5-15 dk sürüyor.

---

## ✅ TAMAMLANDI — Kritik Türkiye fiyat uyuşmazlığı ("hayati" olarak işaretlendi)
- **Kök neden**: Sadece USD manuel fiyat girilip diğer ülkeler Apple'ın otomatik para birimi çevrimine bırakılmıştı. Uygulama içindeki `priceTR` sabitleri ise elle tahmin/eski değerlerdi — gerçek ASC fiyat noktalarıyla (base64 decode edilmiş TUR price point'leri) uyuşmuyordu.
- Düzeltme: `src/data/jettons.ts` ve `src/data/purchases.ts`'teki tüm `priceTR` sabitleri ASC API'den okunan gerçek değerlerle güncellendi (Full Unlock ₺29,99→₺99,99, Remove Ads ₺59,99→₺149,99, jeton paketleri de düzeltildi).
- **Bonus bulunan ikinci bug**: 3 başlangıç paketinin (`bundle_full_jetton30` vb.) hiç Türkçe fiyatı yoktu, dil ne olursa olsun ham USD fiyatı gösteriliyordu. 3 yeni `BUNDLE_*_PRICE_TR` sabiti eklendi, `SettingsScreen.tsx`'teki gösterim dil bazlı ternary'e çevrildi.
- Commit: `8eb78e4`.

## ✅ TAMAMLANDI — "Warm Pixel" ikon yenileme
- Kullanıcıya 3 konsept yön Artifact üzerinden sunuldu, "B · Warm Pixel" seçildi.
- `src/index.css`'e `--c-accent-hi`/`--c-accent-lo` custom property'leri, `src/game.css`'e `.icon-hi`/`.icon-lo` sınıfları eklendi.
- `src/components/icons.tsx`'teki ~20 ikona (WalletIcon, CartIcon, HouseIcon, LogoIcon, GearIcon vb.) highlight/shadow şeridi eklendi.
- Commit: `8eb78e4`.

## ✅ TAMAMLANDI — Ödül/harcama döngülerinin canlı (Playwright) testi
Kullanıcı "bu mekanikler boş dönmesin, sadece kod okuyarak değil gerçekten test et" dedi. `tests/reward-loops.mjs` yazıldı (commit `d88c6fc`), gerçek tarayıcıda uçtan uca doğrulandı:
- Mini-oyunla enerji kazanımı (before=15→after=17)
- Jetonla enerji satın alma (jeton düşüyor + enerji artıyor)
- Ödüllü reklam izleyince enerji artıyor
- Jeton paketi satın alma gerçekten jeton ekliyor
- Jetonla Şüphe Kalkanı satın alma jetonu düşürüyor VE **bir sonraki evde gerçekten -12 şüphe indirimi olarak sahaya çıkıyor** (en kritik doğrulama — sadece satın alındı değil, gerçek oyun etkisi kontrol edildi)
- Sıfır konsol/sayfa hatası

Test yazarken bulunan 3 test-script hatası (uygulama hatası değil) düzeltildi: (1) sözleşme (contract) ekranındaki genel "ilk boş seçeneği tıkla" mantığı aynı madde içinde sonsuz döngüye giriyordu — madde-bazlı seçim mantığına çevrildi; (2) ikinci evi yüklerken bazen çıkan rastgele "Staging" hazırlık ekranı handle edilmiyordu; (3) test kaydı `full-unlock` flag'i içermediği için 3. eve geçerken gerçek demo sınırına (`DEMO_HOUSE_LIMIT=2`) takılıp "Demo Complete" ekranına düşüyordu.

## ✅ TAMAMLANDI — Build 6 yükleme
Yukarıdaki fiyat + ikon düzeltmelerini içeren build 6 yüklendi. (Sonradan build 7 ile birlikte üstteki yeni maddeler de eklendi — bkz "Build 7" bölümü.)

---

# App Store Connect Submission Durumu (2026-09-24 güncellemesi)

API ile tamamlananlar (bu oturumda):
- ✅ **Fiyatlandırma** — appPriceSchedule oluşturuldu, base territory USA, $0.00 (Free) manuel fiyat noktası atandı (freemium + IAP modeli zaten mevcuttu, kullanıcı onayladı).
- ✅ **App Review İletişim Bilgisi** (`appStoreReviewDetails`) — Doğuş Telatar, +90 539 483 29 83, sivilpenguen@gmail.com, demo hesap gerekmiyor (login yok).
- ✅ **Privacy Policy / Terms of Use / Support sayfaları** — TR+EN, `public/privacy(.html/-tr.html)`, `public/terms(.html/-tr.html)`, `public/support(.html/-tr.html)`, siteye (`simsar-emlak.vercel.app`) deploy edildi ve doğrulandı (200 OK, .html uzantılı — Vercel'de clean URL yok). ASC'de `appInfoLocalizations.privacyPolicyUrl` (EN+TR) ve `appStoreVersionLocalizations.supportUrl` (EN+TR) PATCH ile bağlandı.

**Hâlâ elle yapılması gereken (API desteklemiyor):**
- ❌ **App Privacy (veri kullanımı bildirimi / nutrition label)** — kullanıcı kendisi dolduracak (My Apps → Odd Estate → App Privacy). Bu adım tamamlanmadan sürüm İncelemeye gönderilemez.

- ✅ **Açıklama, tanıtım metni, anahtar kelimeler yeniden yazıldı (2026-09-24)** — TR sürümdeki İngilizce kalıntı metin düzeltildi, ikisi de daha çekici/hikaye odaklı yeni metinlerle PATCH edildi (`appStoreVersionLocalizations`, EN+TR). Karakter sınırları doğrulandı (description ~1.7K/4000, keywords 92/76 char /100, promotionalText 110/97 char /170).

---

# App Store Connect Submission Durumu (2026-09-21/22)

API ile tamamlananlar:
- ✅ **Build yüklendi** — `xcrun altool --upload-app` ile IPA App Store Connect'e gönderildi (Delivery UUID `7ad35ad7-23b7-429b-952a-811956360fec`), Apple tarafında **işleniyor** (state: PROCESSING, genelde 15-90 dk sürer — build listede görünmeye başlayınca version'a atanıp submit edilebilir).
- ✅ **Kategori**: Games / Simulation / Casual
- ✅ **Telif hakkı**: "2026 Rakuapp Digital"
- ✅ **Açıklama, anahtar kelimeler, tanıtım metni** (en-US) — İngilizce yazıldı, oyunun gerçek özelliklerini anlatıyor
- ✅ **Yaş Derecelendirmesi** — tüm alanlar dolduruldu (şiddet/argo/cinsel içerik/kumar yok, reklam var=true)
- ✅ **App Store ekran görüntüleri** — 5 adet, gerçek oynanış görüntüsü, 1290×2796 (6.7" iPhone), Playwright ile üretildi ve yüklendi

**API İLE YAPILAMAYAN (gerçek kısıtlama, denendi doğrulandı):**
- ❌ **App Privacy (veri kullanımı bildirimi / "nutrition label")** — App Store Connect API bu alanı HİÇ desteklemiyor (`/v1/appDataUsages` gibi denenen tüm path'ler 404 döndü). **Kesinlikle ASC web arayüzünden elle doldurulmalı** (My Apps → Odd Estate → App Privacy). RevenueCat/AdMob/Game Center kullanıldığı için muhtemelen "Purchase History", "Device ID", "Identifiers" gibi kategoriler işaretlenmeli.

**Kullanıcı kendisi dolduracak:**
- App Store İnceleme Detayı (İnceleme ekibi iletişim: ad/soyad/telefon) — kullanıcı "sonra ben doldururum" dedi.

**Kontrol edilmeli (API'den net teyit alınamadı):**
- Fiyatlandırma — base territory USA/USD olarak ayarlı görünüyor, muhtemelen otomatik "Free" ama ASC arayüzünden bir bakışla teyit edilmeli.

---

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
