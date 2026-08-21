import { skillTree, canUnlockSkill, type SkillBranch } from "../data/skillTree";

interface SkillTreePanelProps {
  ownedSkillIds: string[];
  skillXP: number;
  onUnlock: (skillId: string) => void;
}

const branchLabels: Record<SkillBranch, string> = {
  "sakin-kafa": "🧊 Sakin Kafa",
  karizma: "✨ Karizma",
};

export default function SkillTreePanel({ ownedSkillIds, skillXP, onUnlock }: SkillTreePanelProps) {
  const branches: SkillBranch[] = ["sakin-kafa", "karizma"];
  return (
    <div className="portfolio-panel">
      <p className="menu-empty">
        Emlah'ın iç sesi — evlerden kazandığın Deneyim Puanı (XP) ile açılan pasif beceriler, para gerektirmez.
      </p>
      <p className="market-category-title">Deneyim Puanı: {skillXP} XP</p>
      {branches.map((branch) => (
        <div key={branch}>
          <p className="market-category-title">{branchLabels[branch]}</p>
          {skillTree
            .filter((s) => s.branch === branch)
            .map((skill) => {
              const owned = ownedSkillIds.includes(skill.id);
              const lockedByRequirement = !!skill.requires && !ownedSkillIds.includes(skill.requires);
              const unlockable = canUnlockSkill(skill, ownedSkillIds, skillXP);
              return (
                <div className={`portfolio-row skill-row ${owned ? "status-sold" : ""}`} key={skill.id}>
                  <div className="portfolio-row-info">
                    <p className="portfolio-row-title">
                      {skill.title} <span className="rival-ladder-title">(Tier {skill.tier})</span>
                    </p>
                    <p className="portfolio-row-location">{skill.description}</p>
                    {lockedByRequirement && !owned && (
                      <p className="rehber-note">Önce bir önceki tier açılmalı.</p>
                    )}
                  </div>
                  <div className="portfolio-row-meta">
                    <span className="portfolio-row-price">{skill.cost} XP</span>
                    {owned ? (
                      <span className="portfolio-row-status">✅ Açıldı</span>
                    ) : (
                      <button className="pixel-btn small" disabled={!unlockable} onClick={() => onUnlock(skill.id)}>
                        Aç
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}
