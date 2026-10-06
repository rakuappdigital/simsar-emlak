import { useState } from "react";
import type { ContractClause } from "../types";
import { evaluateContract, MAX_CONTRACT_ROUNDS, type ContractOutcome } from "../data/contract";
import { resolveText, t } from "../data/language";
import { CheckIcon, WarnIcon } from "./icons";

/** Teslim tarihinin bilinen etkisi: komisyonun ne kadarı hemen, ne kadarı teslimde gelir (bkz. calendar.ts). */
function deliveryNote(optionId: string): string {
  if (optionId === "bir-ay") return t({ tr: "Komisyonun %85'i hemen, kalanı 1 ay sonra teslimde.", en: "85% of your commission now, the rest on delivery in 1 month." });
  if (optionId === "uc-ay") return t({ tr: "Komisyonun %70'i hemen, kalanı 3 ay sonra teslimde.", en: "70% of your commission now, the rest on delivery in 3 months." });
  return t({ tr: "Komisyonun tamamı hemen.", en: "Your full commission right away." });
}

interface ContractModalProps {
  clauses: ContractClause[];
  customerName: string;
  onFinish: (modifier: number, selections: Record<string, string>) => void;
}

type Stage = "picking" | "negotiating" | "done";

export default function ContractModal({ clauses, customerName, onFinish }: ContractModalProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [round, setRound] = useState(1);
  const [stage, setStage] = useState<Stage>("picking");
  const [concessions, setConcessions] = useState<Record<string, boolean>>({});
  const [outcome, setOutcome] = useState<ContractOutcome | null>(null);

  const allSelected = clauses.every((c) => selections[c.id]);
  const remaining = clauses.filter((c) => !selections[c.id]).length;
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
        <h2 className="contract-title">
          {t({ tr: "Sözleşme", en: "Contract" })} — {customerName}
        </h2>

        {stage === "picking" && (
          <>
            <p className="contract-intro">
              {t({
                tr: `${customerName}'in gizli tercihleri var. Hepsini tutturursan +%5 komisyon, hiçbirini tutturamazsan −%5. Uymayan maddelerde pazarlık turu açılır.`,
                en: `${customerName} has hidden preferences. Match all of them for +5% commission, none for −5%. Mismatched clauses open a negotiation round.`,
              })}
            </p>
            {clauses.map((c) => {
              const picked = c.options.find((o) => o.id === selections[c.id]);
              return (
                <div className="contract-clause" key={c.id}>
                  <p className="contract-clause-title">{resolveText(c.title)}</p>
                  <div className="contract-seg" role="radiogroup" aria-label={resolveText(c.title)}>
                    {c.options.map((o) => (
                      <button
                        key={o.id}
                        role="radio"
                        aria-checked={selections[c.id] === o.id}
                        className={`contract-option-btn contract-seg-btn ${selections[c.id] === o.id ? "selected" : ""}`}
                        onClick={() => setSelections((s) => ({ ...s, [c.id]: o.id }))}
                        title={resolveText(o.label)}
                      >
                        {resolveText(o.short ?? o.label)}
                      </button>
                    ))}
                  </div>
                  {c.id === "teslim" && picked && (
                    <p className="contract-clause-effect">{deliveryNote(picked.id)}</p>
                  )}
                  {c.id !== "teslim" && picked && <p className="contract-clause-effect">{resolveText(picked.label)}</p>}
                </div>
              );
            })}
            <button className="pixel-btn contract-submit" disabled={!allSelected} onClick={submitInitialPick}>
              {allSelected
                ? t({ tr: `Sözleşmeyi ${customerName}'e Sun`, en: `Present the Contract to ${customerName}` })
                : t({ tr: `${remaining} seçim kaldı`, en: `${remaining} choice(s) left` })}
            </button>
          </>
        )}

        {stage === "negotiating" && (
          <>
            <p className="contract-negotiation-note">
              {t({
                tr: `${customerName}, aşağıdaki maddelerde farklı bir teklif sunuyor — kabul edip taviz mi verirsiniz, yoksa ısrar mı edersiniz?`,
                en: `${customerName} is offering a different proposal on the clauses below — do you concede, or hold firm?`,
              })}{" "}
              ({t({ tr: "tur", en: "round" })} {round + 1}/{MAX_CONTRACT_ROUNDS})
            </p>
            {mismatched.map((c) => {
              const currentOption = c.options.find((o) => o.id === selections[c.id]);
              const preferredOption = c.options.find((o) => o.id === c.preferredOptionId);
              return (
                <div className="contract-clause" key={c.id}>
                  <p className="contract-clause-title">{resolveText(c.title)}</p>
                  <p className="contract-counter-offer">
                    {t({ tr: `${customerName} şunu istiyor`, en: `${customerName} wants` })}:{" "}
                    <strong>{preferredOption ? resolveText(preferredOption.label) : ""}</strong>
                  </p>
                  <div className="contract-seg contract-seg-2">
                    <button
                      className={`contract-option-btn ${concessions[c.id] === true ? "selected" : ""}`}
                      onClick={() => setConcessions((s) => ({ ...s, [c.id]: true }))}
                    >
                      {t({ tr: "Kabul Et", en: "Accept" })}: {preferredOption ? resolveText(preferredOption.label) : ""}
                    </button>
                    <button
                      className={`contract-option-btn ${concessions[c.id] === false ? "selected" : ""}`}
                      onClick={() => setConcessions((s) => ({ ...s, [c.id]: false }))}
                    >
                      {t({ tr: "Israr Et", en: "Hold Firm" })}: {currentOption ? resolveText(currentOption.label) : ""}
                    </button>
                  </div>
                </div>
              );
            })}
            <button className="pixel-btn" disabled={!allConceded} onClick={submitNegotiationRound}>
              {round + 1 >= MAX_CONTRACT_ROUNDS
                ? t({ tr: "Son Teklifi Sun", en: "Present Final Offer" })
                : t({ tr: "Karşı Teklifi Sun", en: "Present Counter Offer" })}
            </button>
          </>
        )}

        {stage === "done" && outcome && (
          <div className="contract-result">
            {clauses.map((c) => {
              const matched = selections[c.id] === c.preferredOptionId;
              return (
                <p key={c.id} className={`contract-result-row ${matched ? "contract-result-ok" : "contract-result-warn"}`}>
                  {matched ? <CheckIcon size={12} className="icon-inline" /> : <WarnIcon size={12} className="icon-inline" />} {resolveText(c.title)}:{" "}
                  {matched
                    ? t({ tr: `${customerName} bu maddeyi kabul etti.`, en: `${customerName} accepted this clause.` })
                    : t({
                        tr: `${customerName} bu maddede anlaşamadık, ısrar ettiniz.`,
                        en: `You and ${customerName} didn't agree on this clause, you held firm.`,
                      })}
                </p>
              );
            })}
            {outcome.roundsUsed > 1 && (
              <p className="contract-rounds-note">
                {t({
                  tr: `Anlaşmaya ${outcome.roundsUsed} turda varıldı — uzun pazarlık küçük bir bedel getirdi.`,
                  en: `The deal took ${outcome.roundsUsed} rounds to close — a long negotiation came at a small cost.`,
                })}
              </p>
            )}
            <p className="contract-verdict">
              {outcome.modifier > 0 &&
                t({
                  tr: `${customerName} sözleşmeden çok memnun kaldı — küçük bir bonus kazandınız!`,
                  en: `${customerName} was very pleased with the contract — you earned a small bonus!`,
                })}
              {outcome.modifier === 0 && t({ tr: "Sözleşme sorunsuz imzalandı.", en: "The contract was signed without issue." })}
              {outcome.modifier < 0 &&
                t({
                  tr: "Bazı maddelerde küçük tavizler vermek zorunda kaldınız.",
                  en: "You had to make small concessions on some clauses.",
                })}
            </p>
            <button className="pixel-btn" onClick={() => onFinish(outcome.modifier, selections)}>
              {t({ tr: "İmzayı Tamamla", en: "Complete the Signature" })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
