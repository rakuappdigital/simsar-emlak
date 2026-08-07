import { useState } from "react";
import type { ContractClause } from "../types";
import { evaluateContract, type ContractOutcome } from "../data/contract";

interface ContractModalProps {
  clauses: ContractClause[];
  customerName: string;
  onFinish: (modifier: number) => void;
}

export default function ContractModal({ clauses, customerName, onFinish }: ContractModalProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [outcome, setOutcome] = useState<ContractOutcome | null>(null);

  const allSelected = clauses.every((c) => selections[c.id]);

  function submit() {
    setOutcome(evaluateContract(clauses, selections));
  }

  return (
    <div className="modal-overlay">
      <div className="contract-modal">
        <h2 className="contract-title">Sözleşme — {customerName}</h2>

        {!outcome && (
          <>
            {clauses.map((c) => (
              <div className="contract-clause" key={c.id}>
                <p className="contract-clause-title">{c.title}</p>
                <div className="contract-options">
                  {c.options.map((o) => (
                    <button
                      key={o.id}
                      className={`contract-option-btn ${selections[c.id] === o.id ? "selected" : ""}`}
                      onClick={() => setSelections((s) => ({ ...s, [c.id]: o.id }))}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button className="pixel-btn" disabled={!allSelected} onClick={submit}>
              Sözleşmeyi {customerName}'e Sun
            </button>
          </>
        )}

        {outcome && (
          <div className="contract-result">
            {clauses.map((c) => {
              const matched = selections[c.id] === c.preferredOptionId;
              return (
                <p key={c.id}>
                  {matched ? "✅" : "⚠️"} {c.title}: {matched
                    ? `${customerName} bu maddeyi hemen kabul etti.`
                    : `${customerName} itiraz etti ama sonunda kabul etti.`}
                </p>
              );
            })}
            <p className="contract-verdict">
              {outcome.modifier > 0 && `${customerName} sözleşmeden çok memnun kaldı — küçük bir bonus kazandınız!`}
              {outcome.modifier === 0 && "Sözleşme sorunsuz imzalandı."}
              {outcome.modifier < 0 && "Bazı maddelerde küçük tavizler vermek zorunda kaldınız."}
            </p>
            <button className="pixel-btn" onClick={() => onFinish(outcome.modifier)}>
              İmzayı Tamamla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
