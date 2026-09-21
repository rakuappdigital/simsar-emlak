export type Language = "tr" | "en";

const KEY = "simsar-emlak-language";
const CHOSEN_KEY = "simsar-emlak-language-chosen";

export function getLanguage(): Language {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "tr" || v === "en") return v;
  } catch {
    // ignore
  }
  return "en";
}

export function setLanguage(lang: Language): void {
  try {
    localStorage.setItem(KEY, lang);
    localStorage.setItem(CHOSEN_KEY, "1");
  } catch {
    // ignore
  }
}

export function hasChosenLanguage(): boolean {
  try {
    return localStorage.getItem(CHOSEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** Bilingual field — pilot houses/UI strings resolve through this until the full data set is migrated. */
export interface LocalizedText {
  tr: string;
  en: string;
}

export function t(field: LocalizedText, lang: Language = getLanguage()): string {
  return field[lang] ?? field.tr;
}

/** Most dialogue content is still a plain (Turkish-only) string until translated — accept either. */
export type Localized = string | LocalizedText;

export function resolveText(field: Localized, lang: Language = getLanguage()): string {
  return typeof field === "string" ? field : t(field, lang);
}

/**
 * HouseScene.title/location stay plain Turkish strings (used as logic keys —
 * search filters, message templates, district lookups — in 20+ places), so
 * they can't become `Localized` without touching all of those. `titleEn`/
 * `locationEn` are optional English siblings used ONLY for display.
 */
export function resolveHouseTitle(h: { title: string; titleEn?: string }, lang: Language = getLanguage()): string {
  return lang === "en" && h.titleEn ? h.titleEn : h.title;
}

export function resolveHouseLocation(h: { location: string; locationEn?: string }, lang: Language = getLanguage()): string {
  return lang === "en" && h.locationEn ? h.locationEn : h.location;
}
