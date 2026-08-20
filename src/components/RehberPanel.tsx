import { useState } from "react";
import type { ContactEntry } from "../data/contactBook";
import type { SceneOutcome } from "../types";

interface RehberPanelProps {
  contacts: ContactEntry[];
}

const outcomeLabel: Record<SceneOutcome, string> = {
  sold: "Satıldı ✅",
  thinking: "Düşünüyor 🤔",
  lost: "Kaybedildi ❌",
};

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
      <p className="menu-empty">Bugüne dek iş yaptığın herkes burada — isim, notlar, en akılda kalan an.</p>
      {contacts.length > 0 && (
        <input
          className="rehber-search"
          type="text"
          placeholder="İsim, ev ya da semt ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
      {contacts.length === 0 && <p className="menu-empty">Henüz kimseyle iş yapmadın.</p>}
      {contacts.length > 0 && filtered.length === 0 && <p className="menu-empty">Eşleşen bir kayıt yok.</p>}
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
            {c.bestLine && <p className="rehber-note rehber-bestline">💬 {c.bestLine}</p>}
          </div>
          <div className="portfolio-row-meta">
            <span className="portfolio-row-status">{outcomeLabel[c.outcome]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
