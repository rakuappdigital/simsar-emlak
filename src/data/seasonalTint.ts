/**
 * "Takvime Bağlı Mevsimsel Ton" — a subtle CSS filter fragment derived from
 * the real in-game date (see calendar.ts), same technique as bossMood's
 * office-lighting tint. Combined with that filter into one string by the
 * caller (CSS only allows one `filter` value per element). Kept modest on
 * purpose — this should read as "season passing," not a color-grading demo.
 */
export function seasonalFilterFragment(date: Date): string {
  const month = date.getMonth(); // 0-indexed: 8=Eylül, 9=Ekim, 10=Kasım, 11=Aralık
  if (month === 8 || month === 9) {
    // Erken sonbahar — hafif amber/sıcak.
    return "sepia(0.16) saturate(1.08) hue-rotate(-3deg)";
  }
  if (month === 10) {
    // Geç sonbahar — nötre yaklaşan geçiş tonu.
    return "sepia(0.07) saturate(0.96)";
  }
  // Kış ve ötesi — soğuk, hafif donuk.
  return "sepia(0.04) saturate(0.85) hue-rotate(6deg) brightness(0.97)";
}
