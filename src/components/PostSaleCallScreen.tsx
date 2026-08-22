import type { PostSaleCallDef } from "../data/postSaleCall";

interface PostSaleCallScreenProps {
  call: PostSaleCallDef;
  contactName: string;
  onChoice: (choiceId: string) => void;
}

export default function PostSaleCallScreen({ call, contactName, onChoice }: PostSaleCallScreenProps) {
  return (
    <div className="work-task-screen">
      <p className="work-task-tag">📞 {contactName} arıyor</p>
      <p className="work-task-title">{call.tag}</p>
      <p className="work-task-prompt">{call.prompt}</p>
      <div className="choices">
        {call.choices.map((c) => (
          <button key={c.id} className="choice-btn" onClick={() => onChoice(c.id)}>
            {c.text}
          </button>
        ))}
      </div>
    </div>
  );
}
