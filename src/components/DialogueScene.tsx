import { useEffect, useState } from "react";
import type { ChoiceEffects, HouseScene, SceneOutcome } from "../types";

interface DialogueSceneProps {
  house: HouseScene;
  onChoiceEffects: (effects: ChoiceEffects) => void;
  onSceneEnd: (outcome: SceneOutcome) => void;
}

const speakerLabel: Record<string, string> = {
  emlah: "Emlah",
  thought: "Emlah (içinden)",
};

export default function DialogueScene({ house, onChoiceEffects, onSceneEnd }: DialogueSceneProps) {
  const [nodeId, setNodeId] = useState(house.startNode);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setNodeId(house.startNode);
    setLineIndex(0);
  }, [house]);

  const node = house.nodes[nodeId];
  const linesShown = node.lines.slice(0, lineIndex + 1);
  const atLastLine = lineIndex >= node.lines.length - 1;

  function advanceLine() {
    if (!atLastLine) {
      setLineIndex((i) => i + 1);
      return;
    }
    if (node.end) {
      onSceneEnd(node.end);
      return;
    }
    if (node.next && !node.choices) {
      setNodeId(node.next);
      setLineIndex(0);
    }
  }

  function pickChoice(next: string, effects?: ChoiceEffects) {
    if (effects) onChoiceEffects(effects);
    setNodeId(next);
    setLineIndex(0);
  }

  return (
    <div className="dialogue-scene">
      <div className="scene-stage">
        <div className={`pixel-bg ${house.background}`} />
        <div className="scene-title">
          {house.title} — {house.location}
        </div>
      </div>

      <div className="dialogue-box" onClick={atLastLine ? undefined : advanceLine}>
        {linesShown.map((line, i) => (
          <div key={i} className={`dialogue-line speaker-${line.speaker}`}>
            <span className="speaker-name">{line.name ?? speakerLabel[line.speaker] ?? ""}</span>
            <span className="line-text">{line.text}</span>
          </div>
        ))}

        {!atLastLine && (
          <button className="pixel-btn small" onClick={advanceLine}>
            Devam ▸
          </button>
        )}

        {atLastLine && node.choices && (
          <div className="choices">
            {node.choices.map((c) => (
              <button
                key={c.id}
                className="choice-btn"
                onClick={() => pickChoice(c.next, c.effects)}
              >
                {c.text}
              </button>
            ))}
          </div>
        )}

        {atLastLine && !node.choices && (node.next || node.end) && (
          <button className="pixel-btn small" onClick={advanceLine}>
            {node.end ? "Sahneyi Bitir" : "Devam ▸"}
          </button>
        )}
      </div>
    </div>
  );
}
