import { useState } from "react";
import type { DistrictPin } from "../data/istanbulMap";
import { TOTAL_DISTRICT_COUNT, districtCoords } from "../data/istanbulMap";
import istanbulMapImg from "../assets/istanbul-map.webp";
import { resolveHouseTitle, t } from "../data/language";
import type { ReactNode } from "react";
import { CheckIcon, ClockIcon, CrossIcon, CrownIcon } from "./icons";

interface CityMapPanelProps {
  pins: DistrictPin[];
  /** A1 — anahtarın sıradaki semti, haritada soru işaretiyle. */
  hintDistrict?: string | null;
}

function dominantClass(pin: DistrictPin): string {
  if (pin.dominated) return "map-pin-dominated";
  if (pin.sold >= pin.thinking && pin.sold >= pin.lost) return "map-pin-sold";
  if (pin.thinking >= pin.lost) return "map-pin-thinking";
  return "map-pin-lost";
}

const outcomeIcon: Record<string, ReactNode> = {
  sold: <CheckIcon size={12} className="icon-inline outcome-sold" />,
  thinking: <ClockIcon size={12} className="icon-inline outcome-thinking" />,
  lost: <CrossIcon size={12} className="icon-inline outcome-lost" />,
};

export default function CityMapPanel({ pins, hintDistrict = null }: CityMapPanelProps) {
  const hint = hintDistrict ? districtCoords[hintDistrict] : undefined;
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
            {pin.dominated && <span className="city-map-pin-crown"><CrownIcon size={12} /></span>}
          </button>
        ))}
        {hint && (
          <span className="city-map-hint" style={{ left: `${hint.x}%`, top: `${hint.y}%` }} title={hintDistrict ?? ""}>
            ?
          </span>
        )}
      </div>

      {selectedPin && (
        <div className="city-map-detail">
          <p className="portfolio-row-title">
            {selectedPin.district}{" "}
            {selectedPin.dominated && (
              <span className="rival-ladder-title"><CrownIcon size={12} className="icon-inline" /> {t({ tr: "Hakimiyetin var", en: "You dominate this district" })}</span>
            )}
          </p>
          <p className="portfolio-row-location">
            {outcomeIcon.sold} {selectedPin.sold} · {outcomeIcon.thinking} {selectedPin.thinking} · {outcomeIcon.lost} {selectedPin.lost}
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
