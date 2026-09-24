import { skillTree, canUnlockSkill, type SkillBranch } from "../data/skillTree";
import { resolveText, t } from "../data/language";

interface SkillTreePanelProps {
  ownedSkillIds: string[];
  skillXP: number;
  onUnlock: (skillId: string) => void;
}

const branchLabelsByLang: Record<SkillBranch, { tr: string; en: string }> = {
  "sakin-kafa": { tr: "🧊 Sakin Kafa", en: "🧊 Cool Head" },
  karizma: { tr: "✨ Karizma", en: "✨ Charisma" },
};
function branchLabel(branch: SkillBranch): string {
  return t(branchLabelsByLang[branch]);
}

export default function SkillTreePanel({ ownedSkillIds, skillXP, onUnlock }: SkillTreePanelProps) {
  const branches: SkillBranch[] = ["sakin-kafa", "karizma"];
  return (
    <div className="portfolio-panel">
      <p className="menu-empty">
        {t({
          tr: "Emlah'ın iç sesi — evlerden kazandığın Deneyim Puanı (XP) ile açılan pasif beceriler, para gerektirmez.",
          en: "Emlah's inner voice — passive skills unlocked with Experience Points (XP) earned from houses, no money required.",
        })}
      </p>
      <p className="market-category-title">
        {t({ tr: "Deneyim Puanı", en: "Experience Points" })}: {skillXP} XP
      </p>
      {branches.map((branch) => (
        <div key={branch}>
          <p className="market-category-title">{branchLabel(branch)}</p>
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
                      {resolveText(skill.title)} <span className="rival-ladder-title">(Tier {skill.tier})</span>
                    </p>
                    <p className="portfolio-row-location">{resolveText(skill.description)}</p>
                    {lockedByRequirement && !owned && (
                      <p className="rehber-note">
                        {t({ tr: "Önce bir önceki tier açılmalı.", en: "The previous tier must be unlocked first." })}
                      </p>
                    )}
                  </div>
                  <div className="portfolio-row-meta">
                    <span className="portfolio-row-price">{skill.cost} XP</span>
                    {owned ? (
                      <span className="portfolio-row-status">✅ {t({ tr: "Açıldı", en: "Unlocked" })}</span>
                    ) : (
                      <button className="pixel-btn small" disabled={!unlockable} onClick={() => onUnlock(skill.id)}>
                        {t({ tr: "Aç", en: "Unlock" })}
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
