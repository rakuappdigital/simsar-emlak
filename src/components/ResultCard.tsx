import type { ReactNode } from "react";
import type { Badge, GameStats, HouseResult } from "../types";
import { formatTL } from "../data/economy";
import { resolveText, t } from "../data/language";
import SaleStamp from "./SaleStamp";
import { EyeIcon, SparkIcon, SmileIcon, FlameIcon, StarIcon, MedalIcon, HouseIcon } from "./icons";

interface ResultCardProps {
  result: HouseResult;
  houseTitle: string;
  customerName: string;
  avatarSrc?: string;
  isLastHouse: boolean;
  newBadges: Badge[];
  onContinue: () => void;
}

const VERDICT = {
  sold: { tr: "SATILDI", en: "SOLD" },
  thinking: { tr: "DÜŞÜNÜYOR", en: "THINKING" },
  lost: { tr: "KAÇTI", en: "LOST" },
} as const;

/** Oran → "+%10" (TR) / "+10%" (EN). */
function pct(rate: number): string {
  const n = Math.abs(Math.round(rate * 100));
  const sign = rate >= 0 ? "+" : "−";
  return t({ tr: `${sign}%${n}`, en: `${sign}${n}%` });
}

/** Tek cümlelik "neden": kararı en çok etkileyen stat. */
function reasonFor(result: HouseResult): string {
  const s: GameStats = result.finalStats;
  if (result.outcome === "sold") {
    if (result.sale && result.sale.discountPercent > 8) {
      return t({ tr: `Sattın ama %${result.sale.discountPercent} indirim patronun canını sıkacak.`, en: `You sold it, but the ${result.sale.discountPercent}% discount will annoy the boss.` });
    }
    if (s.suspicion <= 20) return t({ tr: "Müşteri sana baştan sona güvendi. Temiz bir satış.", en: "The client trusted you start to finish. A clean sale." });
    return t({ tr: "İlgi şüpheyi bastırdı, imzalar atıldı.", en: "Interest outweighed suspicion and the papers got signed." });
  }
  if (s.suspicion >= 50) return t({ tr: "Şüphe çok yükseldi. Müşteri bir şeylerin saklandığını hissetti.", en: "Suspicion ran too high. The client felt something was being hidden." });
  if (s.interest < 40) return t({ tr: "Ev müşterinin ilgisini yeterince çekmedi.", en: "The house never really caught the client's interest." });
  if (s.fun < 20) return t({ tr: "Görüşme fazla kuru geçti, bağ kurulamadı.", en: "The meeting felt too dry, no real connection formed." });
  return t({ tr: "Dengede kaldı; son kararı başka bir şey belirledi.", en: "It was balanced; something else tipped the final call." });
}

function StatRow({ icon, label, value, tone }: { icon: ReactNode; label: string; value: number; tone: "bad" | "good" }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`result-stat result-stat-${tone}`}>
      <span className="result-stat-label">
        {icon} {label}
      </span>
      <span className="result-stat-track">
        <i style={{ width: `${pct}%` }} />
      </span>
      <strong className="result-stat-num">{Math.round(value)}</strong>
    </div>
  );
}

/**
 * S6 / G4 — bir evin sonucu: müşteri, hüküm, kararı veren üç stat, tek
 * cümlelik neden ve somut sonraki adım. Oyuncunun seçimlerinin karşılığını
 * gördüğü an; eskiden tek satırlık boş bir ekrandı.
 */
export default function ResultCard({ result, houseTitle, customerName, avatarSrc, isLastHouse, newBadges, onContinue }: ResultCardProps) {
  const sale = result.sale;
  const s = result.finalStats;
  if (result.declined) {
    return (
      <div className="result-screen result-card-screen">
        <div className="result-card">
          <p className="result-card-note">
            {t({ tr: "İşi reddettin. Sıradaki müşteriye geçiliyor.", en: "You turned the job down. Moving on to the next client." })}
          </p>
          <button className="pixel-btn" onClick={onContinue}>
            {t({ tr: "Devam Et", en: "Continue" })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`result-screen result-card-screen ${result.outcome === "sold" ? "result-sold" : ""}`}>
      <div className={`result-card result-card-${result.outcome}`}>
        <div className="result-card-head">
          {avatarSrc ? (
            <img className="result-card-avatar" src={avatarSrc} alt="" />
          ) : (
            <span className="result-card-avatar result-card-initial">
              {customerName ? customerName.charAt(0).toLocaleUpperCase("tr-TR") : <HouseIcon size={24} />}
            </span>
          )}
          <div className="result-card-who">
            {result.outcome === "sold" && sale ? (
              <SaleStamp discountPercent={sale.discountPercent} inline />
            ) : (
              <span className="result-card-verdict">{t(VERDICT[result.outcome])}</span>
            )}
            <span className="result-card-sub">
              {customerName ? `${customerName} · ${houseTitle}` : houseTitle}
            </span>
          </div>
        </div>

        <div className="result-stats">
          <StatRow icon={<EyeIcon size={12} />} label={t({ tr: "Şüphe", en: "Suspicion" })} value={s.suspicion} tone="bad" />
          <StatRow icon={<SparkIcon size={12} />} label={t({ tr: "İlgi", en: "Interest" })} value={s.interest} tone="good" />
          <StatRow icon={<SmileIcon size={12} />} label={t({ tr: "Eğlence", en: "Fun" })} value={s.fun} tone="good" />
        </div>

        <p className="result-card-reason">{reasonFor(result)}</p>

        {sale && (
          <div className="result-money">
            <div className="result-money-row">
              <span>{t({ tr: "Satış fiyatı", en: "Sale price" })}</span>
              <span>
                {formatTL(sale.finalPrice)}
                {sale.discountPercent > 0 && ` (${t({ tr: `−%${sale.discountPercent}`, en: `−${sale.discountPercent}%` })})`}
              </span>
            </div>
            {sale.streakBonus > 0 && (
              <div className="result-money-row">
                <span>
                  <FlameIcon size={12} className="icon-inline" /> {t({ tr: "Seri bonusu", en: "Streak bonus" })}
                </span>
                <span>{pct(sale.streakBonus)}</span>
              </div>
            )}
            {sale.rankBonus > 0 && (
              <div className="result-money-row">
                <span>
                  <StarIcon size={12} className="icon-inline" /> {t({ tr: "Rütbe bonusu", en: "Rank bonus" })}
                </span>
                <span>{pct(sale.rankBonus)}</span>
              </div>
            )}
            {sale.contractModifier !== 0 && (
              <div className="result-money-row">
                <span>{t({ tr: "Sözleşme etkisi", en: "Contract effect" })}</span>
                <span>{pct(sale.contractModifier)}</span>
              </div>
            )}
            <div className="result-money-row result-money-total">
              <span>{t({ tr: "Komisyonun", en: "Your commission" })}</span>
              <span>{formatTL(sale.commission)}</span>
            </div>
          </div>
        )}

        {result.outcome !== "sold" && (
          <p className="result-card-next">
            {result.outcome === "thinking"
              ? t({ tr: "Sonraki adım: ofiste Telefon'dan takip mesajı gönderebilirsin.", en: "Next step: send a follow-up from Phone in the office." })
              : t({ tr: "Sonraki adım: ofiste Telefon'dan bir kez tekrar deneyebilirsin.", en: "Next step: you can try once more from Phone in the office." })}
          </p>
        )}

        {newBadges.length > 0 && (
          <div className="badge-popup">
            {newBadges.map((b) => (
              <p key={b.id}>
                <MedalIcon size={14} className="icon-inline" /> {t({ tr: "Yeni rozet", en: "New badge" })}: {resolveText(b.title)}
              </p>
            ))}
          </div>
        )}

        <button className="pixel-btn result-card-continue" onClick={onContinue}>
          {isLastHouse ? t({ tr: "Günü Bitir", en: "End the Day" }) : t({ tr: "Devam Et", en: "Continue" })}
        </button>
      </div>
    </div>
  );
}
