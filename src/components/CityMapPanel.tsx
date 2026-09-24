import { useState } from "react";
import type { DistrictPin } from "../data/istanbulMap";
import { TOTAL_DISTRICT_COUNT } from "../data/istanbulMap";
import istanbulMapImg from "../assets/istanbul-map.webp";
import { resolveHouseTitle, t } from "../data/language";

interface CityMapPanelProps {
  pins: DistrictPin[];
}

function dominantClass(pin: DistrictPin): string {
  if (pin.dominated) return "map-pin-dominated";
  if (pin.sold >= pin.thinking && pin.sold >= pin.lost) return "map-pin-sold";
  if (pin.thinking >= pin.lost) return "map-pin-thinking";
  return "map-pin-lost";
}

const outcomeIcon: Record<string, string> = { sold: "✅", thinking: "🤔", lost: "❌" };

export default function CityMapPanel({ pins }: CityMapPanelProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPin = pins.find((p) => p.district === selected) ?? null;

  return (
    <div className="portfolio-panel">
      <p className="menu-empty">
        {t({ tr: "Şehir, her satışla birlikte yavaş yavaş senin oluyor.", en: "The city slowly becomes yours with every sale." })}{" "}
        {t({ tr: "Keşfedilen semt", en: "Districts discovered" })}: {pins.length} / {TOTAL_DISTRICT_COUNT}
      </p>
      <div className="city-map-canvas" style={{ backgroundImage: `url(${istanbulMapImg})` }}>
        {pins.map((pin) => (
          <button
            key={pin.district}
            className={`city-map-pin ${dominantClass(pin)} ${selected === pin.district ? "city-map-pin-active" : ""}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            onClick={() => setSelected((s) => (s === pin.district ? null : pin.district))}
            title={pin.district}
          >
            <span className="city-map-pin-dot" />
            {pin.dominated && <span className="city-map-pin-crown">👑</span>}
          </button>
        ))}
      </div>

      {selectedPin && (
        <div className="city-map-detail">
          <p className="portfolio-row-title">
            {selectedPin.district}{" "}
            {selectedPin.dominated && (
              <span className="rival-ladder-title">👑 {t({ tr: "Hakimiyetin var", en: "You dominate this district" })}</span>
            )}
          </p>
          <p className="portfolio-row-location">
            ✅ {selectedPin.sold} · 🤔 {selectedPin.thinking} · ❌ {selectedPin.lost}
          </p>
          {selectedPin.houses.map((h, i) => (
            <div className="city-map-detail-row" key={i}>
              <span>
                {outcomeIcon[h.outcome]} {resolveHouseTitle(h)}
              </span>
              {h.bestLine && <span className="rehber-note">"{h.bestLine}"</span>}
            </div>
          ))}
        </div>
      )}
      {!selectedPin && pins.length === 0 && (
        <p className="menu-empty">{t({ tr: "Henüz haritada bir iz bırakmadın.", en: "You haven't left a mark on the map yet." })}</p>
      )}
    </div>
  );
}
