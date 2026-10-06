import { useState } from "react";
import { t } from "../data/language";
import type { ContactEntry } from "../data/contactBook";
import type { SceneOutcome } from "../types";

interface RehberPanelProps {
  contacts: ContactEntry[];
}

function outcomeLabel(outcome: SceneOutcome): string {
  if (outcome === "sold") return `${t({ tr: "Satıldı", en: "Sold" })}`;
  if (outcome === "thinking") return `${t({ tr: "Düşünüyor", en: "Thinking" })}`;
  return `${t({ tr: "Kaybedildi", en: "Lost" })}`;
}

export default function RehberPanel({ contacts }: RehberPanelProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLocaleLowerCase("tr-TR");
  const filtered = q
    ? contacts.filter(
        (c) =>
          c.name.toLocaleLowerCase("tr-TR").includes(q) ||
          c.houseTitle.toLocaleLowerCase("tr-TR").includes(q) ||
          c.district.toLocaleLowerCase("tr-TR").includes(q),
      )
    : contacts;

  return (
    <div className="portfolio-panel">
      <p className="menu-empty">
        {t({
          tr: "Bugüne dek iş yaptığın herkes burada — isim, notlar, en akılda kalan an.",
          en: "Everyone you've done business with is here — name, notes, most memorable moment.",
        })}
      </p>
      {contacts.length > 0 && (
        <input
          className="rehber-search"
          type="text"
          placeholder={t({ tr: "İsim, ev ya da semt ara...", en: "Search name, house or district..." })}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
      {contacts.length === 0 && (
        <p className="menu-empty">{t({ tr: "Henüz kimseyle iş yapmadın.", en: "You haven't done business with anyone yet." })}</p>
      )}
      {contacts.length > 0 && filtered.length === 0 && (
        <p className="menu-empty">{t({ tr: "Eşleşen bir kayıt yok.", en: "No matching record." })}</p>
      )}
      {filtered.map((c) => (
        <div className={`portfolio-row status-${c.outcome} rehber-row`} key={c.key}>
          {c.portrait ? (
            <img className="rehber-portrait" src={c.portrait} alt={c.name} />
          ) : (
            <div className="rehber-portrait rehber-portrait-placeholder" aria-hidden />
          )}
          <div className="portfolio-row-info">
            <p className="portfolio-row-title">{c.name}</p>
            <p className="portfolio-row-location">
              {c.houseTitle} — {c.district}
            </p>
            <p className="rehber-note">"{c.note}"</p>
            {c.bestLine && <p className="rehber-note rehber-bestline"> {c.bestLine}</p>}
          </div>
          <div className="portfolio-row-meta">
            <span className="portfolio-row-status">{outcomeLabel(c.outcome)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
