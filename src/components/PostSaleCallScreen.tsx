import type { PostSaleCallDef } from "../data/postSaleCall";
import { resolveText, t } from "../data/language";
import { PhoneCallIcon } from "./icons";

interface PostSaleCallScreenProps {
  call: PostSaleCallDef;
  contactName: string;
  onChoice: (choiceId: string) => void;
}

export default function PostSaleCallScreen({ call, contactName, onChoice }: PostSaleCallScreenProps) {
  return (
    <div className="work-task-screen">
      <p className="work-task-tag"><PhoneCallIcon size={12} className="icon-inline" /> {t({ tr: `${contactName} arıyor`, en: `${contactName} is calling` })}</p>
      <p className="work-task-title">{resolveText(call.tag)}</p>
      <p className="work-task-prompt">{resolveText(call.prompt)}</p>
      <div className="choices">
        {call.choices.map((c) => (
          <button key={c.id} className="choice-btn" onClick={() => onChoice(c.id)}>
            {resolveText(c.text)}
          </button>
        ))}
      </div>
    </div>
  );
}
