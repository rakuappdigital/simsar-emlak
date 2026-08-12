import { useState } from "react";
import type { ContractClause } from "../types";
import { evaluateContract, MAX_CONTRACT_ROUNDS, type ContractOutcome } from "../data/contract";

interface ContractModalProps {
  clauses: ContractClause[];
  customerName: string;
  onFinish: (modifier: number) => void;
}

type Stage = "picking" | "negotiating" | "done";

export default function ContractModal({ clauses, customerName, onFinish }: ContractModalProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [round, setRound] = useState(1);
  const [stage, setStage] = useState<Stage>("picking");
  const [concessions, setConcessions] = useState<Record<string, boolean>>({});
  const [outcome, setOutcome] = useState<ContractOutcome | null>(null);

  const allSelected = clauses.every((c) => selections[c.id]);
  const mismatched = clauses.filter((c) => selections[c.id] !== c.preferredOptionId);
  const allConceded = mismatched.every((c) => concessions[c.id] !== undefined);

  function submitInitialPick() {
    const stillMismatched = clauses.filter((c) => selections[c.id] !== c.preferredOptionId);
    if (stillMismatched.length === 0) {
      setOutcome(evaluateContract(clauses, selections, round));
      setStage("done");
      return;
    }
    setConcessions({});
    setStage("negotiating");
  }

  function submitNegotiationRound() {
    const newSelections = { ...selections };
    for (const c of mismatched) {
      if (concessions[c.id]) newSelections[c.id] = c.preferredOptionId;
    }
    setSelections(newSelections);
    const nextRound = round + 1;
    setRound(nextRound);

    const stillMismatched = clauses.filter((c) => newSelections[c.id] !== c.preferredOptionId);
    if (stillMismatched.length === 0 || nextRound >= MAX_CONTRACT_ROUNDS) {
      setOutcome(evaluateContract(clauses, newSelections, nextRound));
      setStage("done");
    } else {
      setConcessions({});
      setStage("negotiating");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="contract-modal">
        <h2 className="contract-title">Sözleşme — {customerName}</h2>

        {stage === "picking" && (
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
            <button className="pixel-btn" disabled={!allSelected} onClick={submitInitialPick}>
              Sözleşmeyi {customerName}'e Sun
            </button>
          </>
        )}

        {stage === "negotiating" && (
          <>
            <p className="contract-negotiation-note">
              {customerName}, aşağıdaki maddelerde farklı bir teklif sunuyor — kabul edip taviz mi verirsiniz,
              yoksa ısrar mı edersiniz? ({round + 1}. tur / {MAX_CONTRACT_ROUNDS})
            </p>
            {mismatched.map((c) => {
              const currentOption = c.options.find((o) => o.id === selections[c.id]);
              const preferredOption = c.options.find((o) => o.id === c.preferredOptionId);
              return (
                <div className="contract-clause" key={c.id}>
                  <p className="contract-clause-title">{c.title}</p>
                  <p className="contract-counter-offer">
                    {customerName} şunu istiyor: <strong>{preferredOption?.label}</strong>
                  </p>
                  <div className="contract-options">
                    <button
                      className={`contract-option-btn ${concessions[c.id] === true ? "selected" : ""}`}
                      onClick={() => setConcessions((s) => ({ ...s, [c.id]: true }))}
                    >
                      Kabul Et: {preferredOption?.label}
                    </button>
                    <button
                      className={`contract-option-btn ${concessions[c.id] === false ? "selected" : ""}`}
                      onClick={() => setConcessions((s) => ({ ...s, [c.id]: false }))}
                    >
                      Israr Et: {currentOption?.label}
                    </button>
                  </div>
                </div>
              );
            })}
            <button className="pixel-btn" disabled={!allConceded} onClick={submitNegotiationRound}>
              {round + 1 >= MAX_CONTRACT_ROUNDS ? "Son Teklifi Sun" : "Karşı Teklifi Sun"}
            </button>
          </>
        )}

        {stage === "done" && outcome && (
          <div className="contract-result">
            {clauses.map((c) => {
              const matched = selections[c.id] === c.preferredOptionId;
              return (
                <p key={c.id}>
                  {matched ? "✅" : "⚠️"} {c.title}: {matched
                    ? `${customerName} bu maddeyi kabul etti.`
                    : `${customerName} bu maddede anlaşamadık, ısrar ettiniz.`}
                </p>
              );
            })}
            {outcome.roundsUsed > 1 && (
              <p className="contract-rounds-note">
                Anlaşmaya {outcome.roundsUsed} turda varıldı — uzun pazarlık küçük bir bedel getirdi.
              </p>
            )}
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
