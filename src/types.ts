export type Speaker = "emlah" | "thought" | "customer1" | "customer2" | "system";

export interface DialogueLine {
  speaker: Speaker;
  name?: string;
  text: string;
}

export interface ChoiceEffects {
  suspicion?: number;
  interest?: number;
  fun?: number;
}

export interface Choice {
  id: string;
  text: string;
  next: string;
  effects?: ChoiceEffects;
}

export interface DialogueNode {
  id: string;
  lines: DialogueLine[];
  choices?: Choice[];
  next?: string;
  end?: "sold" | "thinking" | "lost";
}

export interface HouseScene {
  id: string;
  title: string;
  location: string;
  customerNames: string[];
  background: string;
  startNode: string;
  nodes: Record<string, DialogueNode>;
}

export interface PhoneMessage {
  from: string;
  text: string;
}

export type GameStats = {
  suspicion: number;
  interest: number;
  fun: number;
};

export type SceneOutcome = "sold" | "thinking" | "lost";
