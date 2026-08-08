import type { WorkTaskDef } from "../data/workTasks";

interface WorkTaskScreenProps {
  task: WorkTaskDef;
  onChoice: (choiceId: string) => void;
}

export default function WorkTaskScreen({ task, onChoice }: WorkTaskScreenProps) {
  return (
    <div className="work-task-screen">
      <p className="work-task-tag">Muzaffer Bey bir iş verdi</p>
      <p className="work-task-title">{task.title}</p>
      <p className="work-task-prompt">{task.prompt}</p>
      <div className="choices">
        {task.choices.map((c) => (
          <button key={c.id} className="choice-btn" onClick={() => onChoice(c.id)}>
            {c.text}
          </button>
        ))}
      </div>
    </div>
  );
}
