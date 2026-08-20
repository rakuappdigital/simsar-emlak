interface SaleStampProps {
  /** Discount given on this sale, in percent — decides the stamp's tone/text. */
  discountPercent: number;
}

const CLEAN_STAMP_THRESHOLD = 8;

/**
 * A rubber-stamp "SATILDI" mark, replacing the old generic confetti burst.
 * Pure CSS (double border + slight rotation + a slam-in animation with a
 * spring overshoot) — no image asset, matching every other hand-built
 * visual in this codebase.
 */
export default function SaleStamp({ discountPercent }: SaleStampProps) {
  const clean = discountPercent <= CLEAN_STAMP_THRESHOLD;
  return (
    <div className={`sale-stamp ${clean ? "sale-stamp-clean" : "sale-stamp-urgent"}`} aria-hidden>
      <span className="sale-stamp-text">{clean ? "SATILDI" : "ACELE SATILDI"}</span>
    </div>
  );
}
