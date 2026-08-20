import { useState } from "react";
import type { DistrictPin } from "../data/istanbulMap";
import { TOTAL_DISTRICT_COUNT } from "../data/istanbulMap";

interface CityMapPanelProps {
  pins: DistrictPin[];
}

function dominantClass(pin: DistrictPin): string {
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
        Şehir, her satışla birlikte yavaş yavaş senin oluyor. Keşfedilen semt: {pins.length} / {TOTAL_DISTRICT_COUNT}
      </p>
      <div className="city-map-canvas">
        <div className="city-map-landmass city-map-landmass-west" />
        <div className="city-map-landmass city-map-landmass-east" />
        <div className="city-map-strait" />
        {pins.map((pin) => (
          <button
            key={pin.district}
            className={`city-map-pin ${dominantClass(pin)} ${selected === pin.district ? "city-map-pin-active" : ""}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            onClick={() => setSelected((s) => (s === pin.district ? null : pin.district))}
            title={pin.district}
          >
            <span className="city-map-pin-dot" />
          </button>
        ))}
      </div>

      {selectedPin && (
        <div className="city-map-detail">
          <p className="portfolio-row-title">{selectedPin.district}</p>
          <p className="portfolio-row-location">
            ✅ {selectedPin.sold} · 🤔 {selectedPin.thinking} · ❌ {selectedPin.lost}
          </p>
          {selectedPin.houses.map((h, i) => (
            <div className="city-map-detail-row" key={i}>
              <span>
                {outcomeIcon[h.outcome]} {h.title}
              </span>
              {h.bestLine && <span className="rehber-note">"{h.bestLine}"</span>}
            </div>
          ))}
        </div>
      )}
      {!selectedPin && pins.length === 0 && <p className="menu-empty">Henüz haritada bir iz bırakmadın.</p>}
    </div>
  );
}
