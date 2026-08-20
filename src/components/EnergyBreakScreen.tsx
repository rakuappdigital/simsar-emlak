import { energyBreakActivities } from "../data/energyBreak";

interface EnergyBreakScreenProps {
  energy: number;
  onChoose: (activityId: string) => void;
  onClose: () => void;
}

/** Shown when energy is too low to take on today's job — a small menu of quick breaks that restore some energy before work can continue. */
export default function EnergyBreakScreen({ energy, onChoose, onClose }: EnergyBreakScreenProps) {
  return (
    <div className="modal-overlay">
      <div className="market-modal energy-break-modal">
        <div className="market-header">
          <h2 className="market-title">Enerji Molası</h2>
          <button className="market-close" onClick={onClose} aria-label="Kapat">
            ×
          </button>
        </div>
        <p className="menu-empty">
          Emlah bugün çok yorgun (%{Math.round(energy)} enerji) — bir işe girişmeden önce biraz toparlanması lazım.
        </p>
        <div className="energy-break-list">
          {energyBreakActivities.map((a) => (
            <button key={a.id} className="energy-break-card" onClick={() => onChoose(a.id)}>
              <span className="energy-break-icon">{a.icon}</span>
              <span className="energy-break-label">{a.label}</span>
              <span className="energy-break-gain">+{a.energyGain} Enerji</span>
            </button>
          ))}
        </div>
        <p className="rehber-note">Yakında bu molalar gerçek mini oyunlara dönüşecek.</p>
      </div>
    </div>
  );
}
