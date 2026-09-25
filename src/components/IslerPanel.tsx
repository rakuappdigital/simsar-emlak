import { t, resolveHouseTitle } from "../data/language";
import { formatTL } from "../data/economy";
import type { HouseResult, HouseScene, PausedVisit } from "../types";

interface IslerPanelProps {
  pausedVisit: PausedVisit | null;
  pausedVisitOffer: { daysOffset: number } | null;
  results: HouseResult[];
  allHouses: HouseScene[];
  onOpenPausedVisit: () => void;
  onRescheduleResponse: (accept: boolean) => void;
  onClose: () => void;
}

/**
 * "İşler" — bekletmeye alınan (Ofise Dön) ziyaret ve tamamlanmış satışlar bir
 * arada. En fazla tek bir bekleyen ziyaret olabilir çünkü oyunun `index`'i
 * bir ev çözülmeden ilerlemiyor — ertelemek hangi evin bugünün işi olduğunu
 * değil, o kapıdan ne zaman girileceğini erteliyor.
 */
export default function IslerPanel({
  pausedVisit,
  pausedVisitOffer,
  results,
  allHouses,
  onOpenPausedVisit,
  onRescheduleResponse,
  onClose,
}: IslerPanelProps) {
  const pausedHouse = pausedVisit ? allHouses.find((h) => h.id === pausedVisit.houseId) : undefined;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="market-modal isler-modal" onClick={(e) => e.stopPropagation()}>
        <div className="market-header">
          <h2 className="market-title">{t({ tr: "İşler", en: "Jobs" })}</h2>
          <button className="market-close" onClick={onClose} aria-label={t({ tr: "Kapat", en: "Close" })}>
            ×
          </button>
        </div>

        <p className="market-category-title">{t({ tr: "Bekleyen Ziyaret", en: "Deferred Visit" })}</p>
        {!pausedVisit && <p className="menu-empty">{t({ tr: "Bekleyen bir ziyaret yok.", en: "No deferred visit." })}</p>}

        {pausedVisit && pausedVisitOffer && (
          <div className="isler-card">
            <p className="isler-card-title">{pausedVisit.contactName}{pausedHouse ? ` — ${resolveHouseTitle(pausedHouse)}` : ""}</p>
            <p className="menu-empty">
              {t({
                tr: `Şu an müsait değilim ama ${pausedVisitOffer.daysOffset} gün sonra uyar mı?`,
                en: `I'm not available right now, but would ${pausedVisitOffer.daysOffset} days from now work?`,
              })}
            </p>
            <div className="isler-card-actions">
              <button className="pixel-btn small" onClick={() => onRescheduleResponse(true)}>
                {t({ tr: "Kabul Et", en: "Accept" })}
              </button>
              <button className="pixel-btn small ghost" onClick={() => onRescheduleResponse(false)}>
                {t({ tr: "Reddet", en: "Decline" })}
              </button>
            </div>
          </div>
        )}

        {pausedVisit && !pausedVisitOffer && (
          <div className="isler-card">
            <p className="isler-card-title">{pausedVisit.contactName}{pausedHouse ? ` — ${resolveHouseTitle(pausedHouse)}` : ""}</p>
            <p className="menu-empty">
              {pausedVisit.status === "office"
                ? t({ tr: "Ofiste bekliyor.", en: "Waiting at the office." })
                : t({
                    tr: `${pausedVisit.daysRemaining ?? 1} gün sonra müsait olacak.`,
                    en: `Available in ${pausedVisit.daysRemaining ?? 1} day(s).`,
                  })}
            </p>
            {pausedVisit.status === "office" && (
              <button className="pixel-btn small" onClick={onOpenPausedVisit}>
                {t({ tr: "Ziyareti Aç", en: "Open Visit" })}
              </button>
            )}
          </div>
        )}

        <p className="market-category-title">{t({ tr: "Tamamlanmış Satışlar", en: "Completed Sales" })}</p>
        {results.length === 0 && <p className="menu-empty">{t({ tr: "Henüz tamamlanmış satış yok.", en: "No completed sales yet." })}</p>}
        <div className="isler-completed-list">
          {results
            .slice()
            .reverse()
            .map((r, i) => {
              const h = allHouses.find((house) => house.id === r.houseId);
              return (
                <div className="isler-card isler-card-compact" key={`${r.houseId}-${i}`}>
                  <span>{h ? resolveHouseTitle(h) : r.houseId}</span>
                  <span className={`isler-outcome isler-outcome-${r.outcome}`}>
                    {r.outcome === "sold"
                      ? `✅ ${r.sale ? formatTL(r.sale.finalPrice) : ""}`
                      : r.outcome === "thinking"
                        ? `🤔 ${t({ tr: "Düşünüyor", en: "Thinking" })}`
                        : `❌ ${t({ tr: "Kayıp", en: "Lost" })}`}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
