/**
 * House background art is loaded on demand (dynamic import per house id)
 * instead of one eager bundle — with 60 house webps (~140-440KB each),
 * eagerly importing all of them would bloat the initial page load for art
 * the player won't see for many houses/weeks, if ever, in a given run.
 */
const loaders: Record<string, () => Promise<{ default: string }>> = {
  "kokulu-studyo": () => import("../assets/houses/kokulu.webp"),
  "hayaletli-daire": () => import("../assets/houses/hayaletli.webp"),
  "denize-sifir": () => import("../assets/houses/denizesifir.webp"),
  "kambur-balkon": () => import("../assets/houses/kamburbalkon.webp"),
  "kedi-cenneti": () => import("../assets/houses/kedicenneti.webp"),
  "asansorsuz-zirve": () => import("../assets/houses/asansorsuz.webp"),
  "nem-galerisi": () => import("../assets/houses/nemgalerisi.webp"),
  "davulcu-komsu": () => import("../assets/houses/davulcu.webp"),
  "tapu-sorunlu": () => import("../assets/houses/tapusorunlu.webp"),
  minicik: () => import("../assets/houses/minicik.webp"),
  "aidat-surprizi": () => import("../assets/houses/aidatsurprizi.webp"),
  "eski-firin": () => import("../assets/houses/eskifirin.webp"),
  "manzara-omurluk": () => import("../assets/houses/manzaraomurluk.webp"),
  "gece-klubu": () => import("../assets/houses/geceklubu.webp"),
  guvercin: () => import("../assets/houses/guvercin.webp"),
  "kaptan-rutubet": () => import("../assets/houses/kaptanrutubet.webp"),
  "miras-kavgasi": () => import("../assets/houses/miraskavgasi.webp"),
  "ogrenci-evi": () => import("../assets/houses/ogrencievi.webp"),
  "kapici-hayvan": () => import("../assets/houses/kapicihayvan.webp"),
  "zemin-vitrin": () => import("../assets/houses/zeminvitrin.webp"),
  "dislisaat-kulesi": () => import("../assets/houses/mekanik.webp"),
  "batakli-koy-evi": () => import("../assets/houses/bataklik.webp"),
  "bulut-kulesi": () => import("../assets/houses/kule.webp"),
  "kristal-magara": () => import("../assets/houses/magara.webp"),
  "kiris-saplanmis-konak": () => import("../assets/houses/kiris.webp"),
  "sifir-uc-studyo": () => import("../assets/houses/hicmutfak.webp"),
  "eski-tren-istasyonu": () => import("../assets/houses/trenis.webp"),
  "kutuphane-yatak-odasi": () => import("../assets/houses/kutuphane.webp"),
  "garaj-loft": () => import("../assets/houses/garaj.webp"),
  "cam-kutu-tuvalet": () => import("../assets/houses/cam.webp"),
  "tek-dairesel-oda": () => import("../assets/houses/dairesel.webp"),
  "merdiven-evi": () => import("../assets/houses/merdo.webp"),
  "dikey-depolama": () => import("../assets/houses/dikeydep.webp"),
  "bogazin-incisi": () => import("../assets/houses/bogaz.webp"),
  "ozel-ada": () => import("../assets/houses/ada.webp"),
  "gokyuzu-malikanesi": () => import("../assets/houses/gokyuzu.webp"),
  "otobus-duragi": () => import("../assets/houses/otobus.webp"),
  "yanki-dairesi": () => import("../assets/houses/yanki.webp"),
  "ruzgar-tuneli": () => import("../assets/houses/ruzgar.webp"),
  "terzi-atolyesi": () => import("../assets/houses/terzi.webp"),
  "metro-titresim": () => import("../assets/houses/metro.webp"),
  "yuzen-bogaz-evi": () => import("../assets/houses/yuzenev.webp"),
  "karinca-kolonisi": () => import("../assets/houses/karinca.webp"),
  "hali-saha-komsulugu": () => import("../assets/houses/halisaha.webp"),
  "yosunlu-ortak-havuz": () => import("../assets/houses/havuz.webp"),
  "rehberli-tur-duragi": () => import("../assets/houses/turrehber.webp"),
  "balik-hali-sabah-gurultusu": () => import("../assets/houses/balikhali.webp"),
  "ruya-yorumcusu-komsu": () => import("../assets/houses/ruyaci.webp"),
  "kripto-madencisi-komsu": () => import("../assets/houses/kripto.webp"),
  "sahibi-gorunmeyen-kat": () => import("../assets/houses/gizlikat.webp"),
  "unlu-oyuncunun-evi": () => import("../assets/houses/unluev.webp"),
  "manastir-bahcesi-komsulugu": () => import("../assets/houses/manastir.webp"),
  "restorasyon-bitmemis-konak": () => import("../assets/houses/restorasyon.webp"),
  "set-evi": () => import("../assets/houses/setevi.webp"),
  "akilli-ev-cildirmis": () => import("../assets/houses/akilliev.webp"),
  "pazar-gunu-kaosu": () => import("../assets/houses/pazarkaos.webp"),
  "yanlis-adres-kargo": () => import("../assets/houses/yanlisadres.webp"),
  "fotograf-noktasi-bahce": () => import("../assets/houses/fotobahce.webp"),
  "paranoyak-kamera-komsusu": () => import("../assets/houses/kameraparanoyak.webp"),
  "antikaci-elektrik-tesisati": () => import("../assets/houses/antikaelektrik.webp"),

  // Yatırım Evleri
  "yatirim-vapuriskelesi": () => import("../assets/houses/vapuriskelesi.webp"),
  "yatirim-terzidukkani": () => import("../assets/houses/terzidukkani.webp"),
  "yatirim-kapalikuyu": () => import("../assets/houses/kapalikuyu.webp"),
  "yatirim-sinemakomsulugu": () => import("../assets/houses/sinemakomsulugu.webp"),
  "yatirim-balikcibarinagi": () => import("../assets/houses/balikcibarinagi.webp"),
  "yatirim-eskihan": () => import("../assets/houses/eskihan.webp"),
  "yatirim-catibahce": () => import("../assets/houses/catibahce.webp"),
  "yatirim-meyhaneustu": () => import("../assets/houses/meyhaneustu.webp"),
  "yatirim-kutuphaneyani": () => import("../assets/houses/kutuphaneyani.webp"),
  "yatirim-tramvayhatti": () => import("../assets/houses/tramvayhatti.webp"),
  "yatirim-caybahcesi": () => import("../assets/houses/caybahcesi.webp"),
  "yatirim-fabrikaloft": () => import("../assets/houses/fabrikaloft.webp"),
  "yatirim-minaregolgesi": () => import("../assets/houses/minaregolgesi.webp"),
  "yatirim-marinamanzarali": () => import("../assets/houses/marinamanzarali.webp"),
  "yatirim-kuyumcularcarsisi": () => import("../assets/houses/kuyumcularcarsisi.webp"),
  "yatirim-plakdukkani": () => import("../assets/houses/plakdukkani.webp"),
  "yatirim-sukemerleri": () => import("../assets/houses/sukemerleri.webp"),
  "yatirim-simitfirini": () => import("../assets/houses/simitfirini.webp"),
  "yatirim-surduvari": () => import("../assets/houses/surduvari.webp"),
  "yatirim-balikpazari": () => import("../assets/houses/balikpazari.webp"),
};

const cache: Record<string, string> = {};

/** Resolves to the house's background image URL, loading and caching it on first request. */
export function loadHouseImage(houseId: string): Promise<string> | null {
  if (cache[houseId]) return Promise.resolve(cache[houseId]);
  const loader = loaders[houseId];
  if (!loader) return null;
  return loader().then((mod) => {
    cache[houseId] = mod.default;
    return mod.default;
  });
}

/** Synchronous peek — returns the URL only if it's already been loaded (for instant re-renders of the same house). */
export function peekHouseImage(houseId: string): string | undefined {
  return cache[houseId];
}
