import type { WorkTaskDef } from "../data/workTasks";
import { resolveText } from "../data/language";

interface WorkTaskScreenProps {
  task: WorkTaskDef;
  onChoice: (choiceId: string) => void;
}

export default function WorkTaskScreen({ task, onChoice }: WorkTaskScreenProps) {
  return (
    <div className="work-task-screen">
      <p className="work-task-tag">{task.tag ? resolveText(task.tag) : "Muzaffer Bey bir iş verdi"}</p>
      <p className="work-task-title">{resolveText(task.title)}</p>
      <p className="work-task-prompt">{resolveText(task.prompt)}</p>
      <div className="choices">
        {task.choices.map((c) => (
          <button key={c.id} className="choice-btn" onClick={() => onChoice(c.id)}>
            {resolveText(c.text)}
          </button>
        ))}
      </div>
    </div>
  );
}
