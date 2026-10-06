import { useState } from "react";
import { t, resolveHouseTitle, resolveHouseLocation } from "../data/language";
import { formatTL } from "../data/economy";
import { POSTPONE_SUSPICION_PENALTY, DECLINE_BOSS_MOOD_PENALTY } from "../data/jobDecisions";
import { ENERGY_DEPLETION_PER_HOUSE } from "../data/energy";
import type { HouseResult, HouseScene, PausedVisit } from "../types";
import { DoorIcon, CalendarIcon, CrossIcon, CheckIcon, ClockIcon } from "./icons";

interface IslerPanelProps {
  pausedVisit: PausedVisit | null;
  pausedVisitOffer: { daysOffset: number } | null;
  results: HouseResult[];
  allHouses: HouseScene[];
  onGoNow: () => void;
  onPostpone: () => void;
  onDecline: () => void;
  onRescheduleResponse: (accept: boolean) => void;
  onClose: () => void;
}

/**
 * "İşler" — bugünün (bekletilen) işi için üç net karar: Şimdi Git / Ertele /
 * Reddet, altında tamamlanmış satışlar. Oyunun `index`'i bir ev çözülmeden
 * ilerlemediği için en fazla tek bir bekleyen iş olabilir — Ertele o kapıdan
 * NE ZAMAN girileceğini, Reddet HİÇ girilmeyeceğini belirler.
 */
export default function IslerPanel({
  pausedVisit,
  pausedVisitOffer,
  results,
  allHouses,
  onGoNow,
  onPostpone,
  onDecline,
  onRescheduleResponse,
  onClose,
}: IslerPanelProps) {
  const pausedHouse = pausedVisit ? allHouses.find((h) => h.id === pausedVisit.houseId) : undefined;
  const [confirmDecline, setConfirmDecline] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="market-modal isler-modal" onClick={(e) => e.stopPropagation()}>
        <div className="market-header">
          <h2 className="market-title">{t({ tr: "İşler", en: "Jobs" })}</h2>
          <button className="market-close" onClick={onClose} aria-label={t({ tr: "Kapat", en: "Close" })}>
            ×
          </button>
        </div>

        <p className="market-category-title">{t({ tr: "Bugünün İşi", en: "Today's Job" })}</p>
        {!pausedVisit && <p className="menu-empty">{t({ tr: "Bekleyen bir iş yok.", en: "No pending job." })}</p>}

        {pausedVisit && (
          <div className={`isler-card isler-job-card ${pausedVisit.status === "scheduled" ? "isler-job-scheduled" : ""}`}>
            <div className="isler-job-head">
              <div>
                <p className="isler-card-title">{pausedVisit.contactName}</p>
                {pausedHouse && (
                  <p className="isler-job-house">
                    {resolveHouseTitle(pausedHouse)} · {resolveHouseLocation(pausedHouse)}
                  </p>
                )}
              </div>
              {pausedHouse && <span className="isler-job-price">{formatTL(pausedHouse.askingPrice)}</span>}
            </div>

            <p className="isler-job-status">
              {pausedVisit.status === "scheduled"
                ? t({
                    tr: `Randevu: ${pausedVisit.daysRemaining ?? 1} gün sonra`,
                    en: `Appointment in ${pausedVisit.daysRemaining ?? 1} day(s)`,
                  })
                : t({ tr: "Ofiste seni bekliyor", en: "Waiting for you at the office" })}
              {pausedVisit.postponed && pausedVisit.status === "office" && (
                <span className="isler-job-note"> · {t({ tr: "bir kez ertelendi", en: "postponed once" })}</span>
              )}
            </p>

            {pausedVisitOffer ? (
              <div className="isler-job-offer">
                <p className="isler-job-offer-text">
                  {t({
                    tr: `"Bugün olmazsa ${pausedVisitOffer.daysOffset} gün sonra uyar mı?"`,
                    en: `"If not today, would ${pausedVisitOffer.daysOffset} days from now work?"`,
                  })}
                </p>
                <div className="isler-card-actions">
                  <button className="pixel-btn small" onClick={() => onRescheduleResponse(true)}>
                    {t({ tr: "Randevu Ver", en: "Book It" })}
                  </button>
                  <button className="pixel-btn small ghost" onClick={() => onRescheduleResponse(false)}>
                    {t({ tr: "Geri", en: "Back" })}
                  </button>
                </div>
              </div>
            ) : confirmDecline ? (
              <div className="isler-job-offer isler-job-confirm">
                <p className="isler-job-offer-text">
                  {t({
                    tr: `Bu işi reddedersen satış serin bozulur ve Muzaffer Bey'in keyfi kaçar (−${DECLINE_BOSS_MOOD_PENALTY}). Emin misin?`,
                    en: `Turning this job down breaks your sales streak and sours Muzaffer Bey's mood (−${DECLINE_BOSS_MOOD_PENALTY}). Are you sure?`,
                  })}
                </p>
                <div className="isler-card-actions">
                  <button className="pixel-btn small isler-btn-danger" onClick={onDecline}>
                    {t({ tr: "Evet, Reddet", en: "Yes, Decline" })}
                  </button>
                  <button className="pixel-btn small ghost" onClick={() => setConfirmDecline(false)}>
                    {t({ tr: "Vazgeç", en: "Cancel" })}
                  </button>
                </div>
              </div>
            ) : (
              <div className="isler-decisions">
                {pausedVisit.status === "office" && (
                  <button className="isler-decision isler-decision-go" onClick={onGoNow}>
                    <span className="isler-decision-icon"><DoorIcon size={20} /></span>
                    <span className="isler-decision-label">{t({ tr: "Şimdi Git", en: "Go Now" })}</span>
                    <span className="isler-decision-cost">
                      −{ENERGY_DEPLETION_PER_HOUSE} {t({ tr: "Enerji", en: "Energy" })}
                    </span>
                  </button>
                )}
                {pausedVisit.status === "office" && (
                  <button className="isler-decision" onClick={onPostpone} disabled={!!pausedVisit.postponed}>
                    <span className="isler-decision-icon"><CalendarIcon size={20} /></span>
                    <span className="isler-decision-label">{t({ tr: "Ertele", en: "Postpone" })}</span>
                    <span className="isler-decision-cost">
                      {pausedVisit.postponed
                        ? t({ tr: "Hakkın doldu", en: "Already used" })
                        : t({ tr: `Müşteri soğur (+${POSTPONE_SUSPICION_PENALTY} şüphe)`, en: `Client cools (+${POSTPONE_SUSPICION_PENALTY} suspicion)` })}
                    </span>
                  </button>
                )}
                <button className="isler-decision isler-decision-decline" onClick={() => setConfirmDecline(true)}>
                  <span className="isler-decision-icon"><CrossIcon size={20} /></span>
                  <span className="isler-decision-label">{t({ tr: "Reddet", en: "Decline" })}</span>
                  <span className="isler-decision-cost">
                    {t({ tr: `Seri bozulur · Patron −${DECLINE_BOSS_MOOD_PENALTY}`, en: `Breaks streak · Boss −${DECLINE_BOSS_MOOD_PENALTY}` })}
                  </span>
                </button>
              </div>
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
                    {r.outcome === "sold" ? (
                      <>
                        <CheckIcon size={12} className="icon-inline" /> {r.sale ? formatTL(r.sale.finalPrice) : ""}
                      </>
                    ) : r.declined ? (
                      <>
                        <CrossIcon size={12} className="icon-inline" /> {t({ tr: "Reddedildi", en: "Declined" })}
                      </>
                    ) : r.outcome === "thinking" ? (
                      <>
                        <ClockIcon size={12} className="icon-inline" /> {t({ tr: "Düşünüyor", en: "Thinking" })}
                      </>
                    ) : (
                      <>
                        <CrossIcon size={12} className="icon-inline" /> {t({ tr: "Kayıp", en: "Lost" })}
                      </>
                    )}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
