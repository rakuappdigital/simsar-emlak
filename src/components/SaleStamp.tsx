import { t } from "../data/language";

interface SaleStampProps {
  /** Discount given on this sale, in percent — decides the stamp's tone/text. */
  discountPercent: number;
  /** Sonuç kartının içinde, hüküm yazısının yerinde (S6). */
  inline?: boolean;
}

const CLEAN_STAMP_THRESHOLD = 8;

/**
 * A rubber-stamp "SATILDI" mark, replacing the old generic confetti burst.
 * Pure CSS (double border + slight rotation + a slam-in animation with a
 * spring overshoot) — no image asset, matching every other hand-built
 * visual in this codebase.
 */
export default function SaleStamp({ discountPercent, inline = false }: SaleStampProps) {
  const clean = discountPercent <= CLEAN_STAMP_THRESHOLD;
  return (
    <div className={`sale-stamp ${inline ? "sale-stamp-inline" : ""} ${clean ? "sale-stamp-clean" : "sale-stamp-urgent"}`} aria-hidden>
      <span className="sale-stamp-text">
        {clean ? t({ tr: "SATILDI", en: "SOLD" }) : t({ tr: "ACELE SATILDI", en: "RUSH SALE" })}
      </span>
    </div>
  );
}
