import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChoiceEffects, DialogueLine, GameStats, HouseScene, InboxMessage, PhoneMessage, SaleResult, SceneOutcome } from "../types";
import type { EasterEgg } from "../data/easterEggs";
import { resolveText, t, type Localized } from "../data/language";
import { logMessages } from "../data/inbox";
import { recordAlbum } from "../data/album";
import { specialDayFor, specialDayKey, isNightHours, rememberFirstLaunch } from "../data/specialDays";
import { secretHouseById } from "../data/secretHouses";
import { resolveCustomerNames } from "../data/characterPool";
import { DISCOUNT_ANGER_THRESHOLD, BOSS_MOOD_DISCOUNT_PENALTY } from "../data/bossMood";
import {
  emptySideQuests,
  houseDistrict,
  planKeyRoute,
  nadideMessages,
  keyClueLines,
  keyWrongHouseLines,
  KEY_GIVE_MIN_INDEX,
  KEY_WRONG_HOUSE_SUSPICION,
  MUZAFFER_START_INDEX,
  MUZAFFER_TARGET_AHEAD,
  MUZAFFER_CLUE_OFFSETS,
  MUZAFFER_TOLD_MOOD,
  muzafferClue,
  muzafferToldReply,
  muzafferMissedReply,
  muhtarTasks,
  muhtarIntro,
  muhtarDoneLines,
  MUHTAR_TITLE_AT,
  MUHTAR_TASK_REWARD,
  MUHTAR_TITLE_SUSPICION,
  MUHTAR_TIP_EFFECTS,
  LIFE_START_MIN_INDEX,
  LIFE_STAGE_GAP,
  LIFE_REWARDS,
  lifeMessage,
  ghostSteps,
  GHOST_STEP_ENERGY,
  GHOST_STORY_CHANCE,
  GHOST_STORY_EFFECTS,
  FORGERY_CHANCE,
  firatAngryMessage,
  nightCustomerLines,
  RADIO_SECRET_TAPS,
  radioSecretBroadcast,
  qualifiesForHome,
  type SideQuestState,
} from "../data/sideQuests";

/** Diyalogda yan görev seçeneği — DialogueScene'de bir kez görünür, seçilince tepki satırları akar. */
export interface SideChoice {
  id: string;
  text: Localized;
  effects?: ChoiceEffects;
  reaction: DialogueLine[];
}

export interface SideStory {
  title: string;
  lines: string[];
  /** Kapatınca çalışır (ör. soruşturma adımını ilerletmek). */
  onClose?: () => void;
  closeLabel?: string;
}

export interface OfficeSideCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  onClick: () => void;
}

interface Ctx {
  stage: string;
  index: number;
  houseOrder: number[];
  allHouses: HouseScene[];
  castAssignment: Record<string, string[]>;
  origin: string | null;
  setInbox: (fn: (prev: InboxMessage[]) => InboxMessage[]) => void;
  setBonusEarnings: (fn: (prev: number) => number) => void;
  setBossMood: (fn: (prev: number) => number) => void;
  setStats: (fn: (prev: GameStats) => GameStats) => void;
  setEnergy: (fn: (prev: number) => number) => void;
  energy: number;
  awardBadge: (id: string) => void;
  grantJettons: (amount: number) => void;
  openSecretHouse: (id: string) => void;
  showToast: (text: string) => void;
}

const cycle = <T,>(arr: T[], seed: number) => arr[Math.abs(seed) % arr.length];
const hashOf = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
};

/**
 * Yan görevlerin tamamı — durum, ev geçişlerindeki ilerleme, diyalog
 * eklemeleri, ofis kartları ve sonuç işleme. App.tsx yalnızca birkaç
 * bağlantı noktasından çağırır; çalışan akışların hiçbirinin yerine geçmez.
 */
export function useSideQuests(ctx: Ctx) {
  const [state, setState] = useState<SideQuestState>(emptySideQuests);
  const stateRef = useRef(state);
  stateRef.current = state;
  /** Ev başı ilerlemenin işlendiği son index — render'ı beklemeden güncellenir (çift tetiklemeye karşı). */
  const tickedRef = useRef(-1);
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;
  const [story, setStory] = useState<SideStory | null>(null);
  const radioTapsRef = useRef(0);

  useEffect(() => {
    rememberFirstLaunch();
  }, []);

  const msg = useCallback((threadId: string, from: string, text: Localized, day: number) => {
    ctxRef.current.setInbox((prev) => logMessages(prev, threadId, from, [{ from, text: resolveText(text) } as PhoneMessage], day));
  }, []);

  const album = useCallback((id: string) => {
    const { isNew, jettons } = recordAlbum(id);
    if (!isNew) return;
    if (jettons > 0) {
      ctxRef.current.grantJettons(jettons);
      ctxRef.current.showToast(t({ tr: `Albüm ödülü: +${jettons} Jetton`, en: `Album reward: +${jettons} Jetton` }));
    } else {
      ctxRef.current.showToast(t({ tr: "Albüme yeni bir kart eklendi", en: "A new card was added to the album" }));
    }
  }, []);

  /* ---------------- Ev geçişi: bir kez, ev başına ---------------- */
  const inGame = ctx.stage !== "menu" && ctx.stage !== "saved" && ctx.stage !== "setup" && ctx.stage !== "origin";
  useEffect(() => {
    if (!inGame) return;
    const s = stateRef.current;
    const { index, houseOrder, allHouses } = ctxRef.current;
    if (index <= s.lastTick || index <= tickedRef.current) return;
    tickedRef.current = index;
    const day = index + 1;
    const next: SideQuestState = { ...s, lastTick: index };
    const current = allHouses[houseOrder[index] ?? index];

    // B4 — gerçek takvim günü: günde bir Muzaffer mesajı.
    const special = specialDayFor();
    if (special) {
      const key = specialDayKey(special);
      if (!s.firedDays.includes(key)) {
        msg("muzaffer", "Muzaffer Bey", special.muzafferMessage, day);
        next.firedDays = [...s.firedDays, key].slice(-20);
        album(special.albumId);
      }
    }

    // A2 — Muzaffer Bey'in Sırrı: hedef ev seçimi ve ipuçları.
    if (s.muzaffer.status === null && index >= MUZAFFER_START_INDEX) {
      const ti = index + MUZAFFER_TARGET_AHEAD;
      const target = allHouses[houseOrder[ti]];
      if (target) next.muzaffer = { targetHouseId: target.id, targetIndex: ti, cluesSent: 0, status: "pending" };
    }
    if (next.muzaffer.status === "pending" && next.muzaffer.targetHouseId) {
      const target = allHouses.find((h) => h.id === next.muzaffer.targetHouseId);
      const sent = next.muzaffer.cluesSent;
      if (target && sent < MUZAFFER_CLUE_OFFSETS.length && index >= next.muzaffer.targetIndex - MUZAFFER_CLUE_OFFSETS[sent]) {
        msg("muzaffer", "Muzaffer Bey", muzafferClue(sent, houseDistrict(target)), day);
        next.muzaffer = { ...next.muzaffer, cluesSent: sent + 1 };
      }
    }

    // A4 — Bir Müşterinin Hayatı: sıradaki aşama.
    if (s.life.houseId && s.life.stage < 3 && index >= s.life.nextAt && s.life.name) {
      const stage = s.life.stage + 1;
      msg(`life-${s.life.houseId}`, s.life.name, lifeMessage(stage), day);
      const reward = LIFE_REWARDS[stage - 1];
      if (reward > 0) ctxRef.current.setBonusEarnings((b) => b + reward);
      if (stage === 3) {
        ctxRef.current.awardBadge("aile-dostu");
        album("aile-dostu");
      }
      next.life = { ...s.life, stage, nextAt: index + LIFE_STAGE_GAP };
    }

    // A3 — Mahallenin Emlakçısı: müşteriler tanıyarak başlar.
    if (s.muhtar.titled) ctxRef.current.setStats((st) => ({ ...st, suspicion: Math.max(0, st.suspicion + MUHTAR_TITLE_SUSPICION) }));

    // B5 — Gece Yarısı Müşterisi: gerçek saat 00:00–04:00, oyun başına bir kez.
    if (!s.night.done && !s.night.pendingHouseId && current && isNightHours()) {
      next.night = { done: false, pendingHouseId: current.id };
    }

    setState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.index, inGame]);

  /* ---------------- Diyalog eklemeleri ---------------- */
  const dialogueFor = useCallback(
    (house: HouseScene, visitIndex: number): { intro?: EasterEgg; choices: SideChoice[] } => {
      const s = stateRef.current;
      const district = houseDistrict(house);
      const choices: SideChoice[] = [];
      let intro: EasterEgg | undefined;

      if (s.night.pendingHouseId === house.id) {
        intro = { id: "side-night", tag: { tr: "Gece Yarısı", en: "Midnight" }, lines: nightCustomerLines, funBonus: 4 };
      } else {
        const special = specialDayFor();
        if (special?.houseLines) {
          const lines = cycle(special.houseLines, hashOf(house.id));
          intro = { id: `side-${special.id}`, tag: special.banner, lines, funBonus: 2 };
        }
      }

      // A1 — anahtarı göster
      if (s.key.stage === "held" && s.key.route.length > 0) {
        const right = s.key.route[s.key.found] === district;
        choices.push({
          id: right ? "side-key-right" : "side-key-wrong",
          text: { tr: "(Nadide Hanım'ın eski anahtarını göster)", en: "(Show Nadide Hanım's old key)" },
          effects: right ? { interest: 6 } : { suspicion: KEY_WRONG_HOUSE_SUSPICION },
          reaction: right ? keyClueLines(s.key.route, s.key.found) : keyWrongHouseLines,
        });
      }
      // A2 — Muzaffer'e haber ver
      if (s.muzaffer.status === "pending" && s.muzaffer.targetHouseId === house.id) {
        choices.push({
          id: "side-muzaffer-tell",
          text: { tr: "(Kapının üstündeki oyma kuşa bak, Muzaffer Bey'e haber ver)", en: "(Look at the carved bird above the door, tell Muzaffer Bey)" },
          effects: { fun: 4 },
          reaction: [
            { speaker: "thought", text: { tr: "(içinden) Kapının üstünde küçük, yıpranmış bir kuş. Telefonu çıkarıp Muzaffer Bey'e yazdım.", en: "(to himself) A small, worn bird above the door. I took out my phone and texted Muzaffer Bey." } },
          ],
        });
      }
      // A3 — muhtarın yerel bilgisi
      if (s.muhtar.tipReady) {
        choices.push({
          id: "side-muhtar-tip",
          text: { tr: "(Muhtar Cemal'den aldığın yerel bilgiyi paylaş)", en: "(Share the local tip from Headman Cemal)" },
          effects: MUHTAR_TIP_EFFECTS,
          reaction: [{ speaker: "customer1", text: { tr: "Muhtar Cemal'i tanıyor musunuz? O zaman size güvenebilirim.", en: "You know Headman Cemal? Then I can trust you." } }],
        });
      }
      // A5 — hayalet hikâyesi
      if (s.ghost.storyReady && (hashOf(`${house.id}-${visitIndex}`) % 100) / 100 < GHOST_STORY_CHANCE) {
        choices.push({
          id: "side-ghost-story",
          text: { tr: "(Hayalet ev hikâyesini anlat)", en: "(Tell the haunted house story)" },
          effects: GHOST_STORY_EFFECTS,
          reaction: [{ speaker: "customer1", text: { tr: "Kalorifer mi?! Bu yılın en iyi hikâyesi. Bizim kazanı da bir kontrol ettirin bari.", en: "The boiler?! Best story of the year. Have someone check our boiler too, then." } }],
        });
      }
      return { intro, choices };
    },
    [],
  );

  const onSideChoice = useCallback(
    (id: string, house: HouseScene, visitIndex: number) => {
      const s = stateRef.current;
      const day = visitIndex + 1;
      if (id === "side-key-right") {
        const found = s.key.found + 1;
        if (found >= s.key.route.length) {
          setState({ ...s, key: { ...s.key, found, stage: "unlocked" } });
          msg("nadide", "Nadide Hanım", { tr: "Yeşil kapılı yalı mı? Evet... Evet, hatırladım. Lütfen git, anahtar sende.", en: "The green-doored mansion? Yes... Yes, I remember. Please go, you have the key." }, day);
        } else {
          setState({ ...s, key: { ...s.key, found } });
        }
      } else if (id === "side-muzaffer-tell") {
        setState({ ...s, muzaffer: { ...s.muzaffer, status: "told" } });
        ctxRef.current.setBossMood((m) => Math.min(100, m + MUZAFFER_TOLD_MOOD));
        msg("muzaffer", "Muzaffer Bey", muzafferToldReply, day);
        album("muzaffer-sirri");
      } else if (id === "side-muhtar-tip") {
        setState({ ...s, muhtar: { ...s.muhtar, tipReady: false } });
      }
      void house;
    },
    [msg, album],
  );

  /* ---------------- Ev sonucu ---------------- */
  const onHouseResolved = useCallback(
    (outcome: SceneOutcome, stats: GameStats, house: HouseScene, sale: SaleResult | null, visitIndex: number, declined: boolean) => {
      if (declined) return;
      const s = stateRef.current;
      const { houseOrder, allHouses, castAssignment } = ctxRef.current;
      const day = visitIndex + 1;
      const next: SideQuestState = { ...s };
      const district = houseDistrict(house);

      // A1 — ilk uygun satışta Nadide Hanım anahtarı bırakır.
      if (s.key.stage === "none" && outcome === "sold" && visitIndex >= KEY_GIVE_MIN_INDEX) {
        const route = planKeyRoute(houseOrder, visitIndex, allHouses);
        if (route.length === 3) {
          next.key = { stage: "held", route, found: 0 };
          for (const text of nadideMessages(route[0])) msg("nadide", "Nadide Hanım", text, day);
        }
      }
      // A2 — hedef ev haber verilmeden geçtiyse.
      if (s.muzaffer.status === "pending" && s.muzaffer.targetHouseId === house.id) {
        next.muzaffer = { ...s.muzaffer, status: "missed" };
        msg("muzaffer", "Muzaffer Bey", muzafferMissedReply, day);
      }
      // A2 ödülü — patron artık indirimlere yarı yarıya kızıyor.
      if (s.muzaffer.status === "told" && outcome === "sold" && sale && sale.discountPercent > DISCOUNT_ANGER_THRESHOLD) {
        ctxRef.current.setBossMood((m) => Math.min(100, m + Math.round(BOSS_MOOD_DISCOUNT_PENALTY / 2)));
      }
      // A3 — muhtarın görevi.
      if (s.muhtar.taskId) {
        const task = muhtarTasks.find((tk) => tk.id === s.muhtar.taskId);
        const ctxCheck = { outcome, discountPercent: sale?.discountPercent ?? stats.discountPercent, suspicion: stats.suspicion, fun: stats.fun, district };
        if (task && task.check(ctxCheck, s.muhtar.taskParam)) {
          const done = s.muhtar.done + 1;
          const titled = s.muhtar.titled || done >= MUHTAR_TITLE_AT;
          next.muhtar = { ...s.muhtar, taskId: null, taskParam: null, done, tipReady: true, titled };
          ctxRef.current.setBonusEarnings((b) => b + MUHTAR_TASK_REWARD);
          msg("muhtar", "Muhtar Cemal", cycle(muhtarDoneLines, done), day);
          if (titled && !s.muhtar.titled) {
            ctxRef.current.awardBadge("mahallenin-emlakcisi");
            album("mahallenin-emlakcisi");
          }
        }
      }
      // A4 — müşterinin hayatı ilk uygun satışta başlar (tek isimli müşteri).
      if (!s.life.houseId && outcome === "sold" && visitIndex >= LIFE_START_MIN_INDEX && house.dynamicCast?.length === 1) {
        const name = resolveCustomerNames(house, castAssignment)[0];
        if (name) next.life = { houseId: house.id, name, stage: 0, nextAt: visitIndex + LIFE_STAGE_GAP };
      }
      // B5 — gece kuşu.
      if (s.night.pendingHouseId === house.id) {
        next.night = { done: true, pendingHouseId: null };
        if (outcome === "sold") {
          ctxRef.current.awardBadge("gece-kusu");
          album("gece-kusu");
        }
      }
      setState(next);
    },
    [msg, album],
  );

  /* ---------------- Esnafla Çay (Muhtar'ın Defteri) ---------------- */
  const muhtarTaskText = useCallback((st: SideQuestState) => {
    const task = muhtarTasks.find((tk) => tk.id === st.muhtar.taskId);
    return task ? resolveText(task.text(st.muhtar.taskParam)) : null;
  }, []);

  const openMuhtar = useCallback(
    (fromTea: boolean) => {
      const s = stateRef.current;
      const { index, houseOrder, allHouses } = ctxRef.current;
      let next = s;
      const lines: string[] = [];
      if (!s.muhtar.met) lines.push(...muhtarIntro.map((l) => resolveText(l)));
      if (fromTea && !s.muhtar.taskId) {
        const task = muhtarTasks[s.muhtar.done % muhtarTasks.length];
        let param: string | null = null;
        if (task.needsDistrict) {
          for (let i = index + 1; i < Math.min(houseOrder.length, index + 6); i++) {
            const h = allHouses[houseOrder[i]];
            if (h) {
              param = houseDistrict(h);
              break;
            }
          }
        }
        next = { ...s, muhtar: { ...s.muhtar, met: true, taskId: task.id, taskParam: param } };
        setState(next);
      } else if (!s.muhtar.met) {
        next = { ...s, muhtar: { ...s.muhtar, met: true } };
        setState(next);
      }
      const taskText = muhtarTaskText(next);
      lines.push(
        taskText
          ? t({ tr: `Bu haftaki iş: ${taskText}`, en: `This week's favor: ${taskText}` })
          : t({ tr: "Şimdilik bir işim yok. Yarın yine çaya gel.", en: "No favor for now. Come for tea again tomorrow." }),
      );
      lines.push(
        next.muhtar.titled
          ? t({ tr: "Artık mahallenin emlakçısısın; müşteriler seni tanıyarak geliyor.", en: "You're the neighborhood's realtor now; clients arrive already knowing you." })
          : t({ tr: `Defter: ${next.muhtar.done}/${MUHTAR_TITLE_AT} iş. Onuncuda mahalle seni tanır.`, en: `Notebook: ${next.muhtar.done}/${MUHTAR_TITLE_AT} favors. At ten, the neighborhood knows you.` }),
      );
      if (next.muhtar.tipReady) lines.push(t({ tr: "Elinde bir yerel bilgi var — sıradaki evde kullanabilirsin.", en: "You're holding a local tip — use it at the next house." }));
      setStory({ title: t({ tr: "Muhtar'ın Defteri", en: "The Headman's Notebook" }), lines });
    },
    [album, muhtarTaskText],
  );

  /* ---------------- A5 — Hayalet soruşturması ---------------- */
  const onEasterEggShown = useCallback(
    (eggId: string) => {
      album(`egg-${eggId}`);
      const s = stateRef.current;
      if (eggId === "hayalet-ev" && s.ghost.step === 0) setState({ ...s, ghost: { ...s.ghost, step: 1 } });
    },
    [album],
  );

  const runGhostStep = useCallback(() => {
    const s = stateRef.current;
    const { index, energy } = ctxRef.current;
    if (s.ghost.step < 1 || s.ghost.step > ghostSteps.length || s.ghost.lastIndex === index) return;
    if (energy < GHOST_STEP_ENERGY) {
      ctxRef.current.showToast(t({ tr: "Soruşturma için enerjin yetmiyor.", en: "Not enough energy for the inquiry." }));
      return;
    }
    const step = ghostSteps[s.ghost.step - 1];
    ctxRef.current.setEnergy((e) => Math.max(0, e - GHOST_STEP_ENERGY));
    const isLast = s.ghost.step === ghostSteps.length;
    setStory({
      title: resolveText(step.title),
      lines: step.lines.map((l) => resolveText(l)),
      closeLabel: isLast ? t({ tr: "Dosyayı kapat", en: "Close the case" }) : t({ tr: "Not al", en: "Take notes" }),
      onClose: () => {
        const cur = stateRef.current;
        setState({ ...cur, ghost: { step: cur.ghost.step + 1, lastIndex: ctxRef.current.index, storyReady: isLast || cur.ghost.storyReady } });
        if (isLast) {
          ctxRef.current.awardBadge("hayalet-avcisi");
          album("hayalet-sorusturma");
        }
      },
    });
  }, [album]);

  /* ---------------- Ofis kartları ("Peşindekiler") ---------------- */
  const officeCards: OfficeSideCard[] = useMemo(() => {
    const cards: OfficeSideCard[] = [];
    if (state.ghost.step >= 1 && state.ghost.step <= ghostSteps.length) {
      const done = state.ghost.lastIndex === ctx.index;
      cards.push({
        id: "ghost",
        icon: "ghost",
        title: t({ tr: "Hayalet Ev Soruşturması", en: "Haunted House Inquiry" }),
        subtitle: done
          ? t({ tr: "Bugünlük yeterli, yarın devam", en: "Enough for today, continue tomorrow" })
          : t({ tr: `Adım ${state.ghost.step}/${ghostSteps.length} · −${GHOST_STEP_ENERGY} Enerji`, en: `Step ${state.ghost.step}/${ghostSteps.length} · −${GHOST_STEP_ENERGY} Energy` }),
        onClick: runGhostStep,
      });
    }
    if (state.key.stage === "unlocked") {
      cards.push({
        id: "yali",
        icon: "key",
        title: t({ tr: "Yeşil Kapılı Yalı", en: "The Green-Doored Mansion" }),
        subtitle: t({ tr: "Kuzguncuk · anahtar sende", en: "Kuzguncuk · you have the key" }),
        onClick: () => ctxRef.current.openSecretHouse("yesil-kapili-yali"),
      });
    } else if (state.key.stage === "held") {
      cards.push({
        id: "key",
        icon: "key",
        title: t({ tr: "Nadide Hanım'ın Anahtarı", en: "Nadide Hanım's Key" }),
        subtitle: t({ tr: `İpucu ${state.key.found}/3 · sıradaki: ${state.key.route[state.key.found] ?? "?"}`, en: `Clue ${state.key.found}/3 · next: ${state.key.route[state.key.found] ?? "?"}` }),
        onClick: () =>
          setStory({
            title: t({ tr: "Nadide Hanım'ın Anahtarı", en: "Nadide Hanım's Key" }),
            lines: [
              t({ tr: `Anahtarı ${state.key.route[state.key.found]} semtindeki bir evde müşteriye göster.`, en: `Show the key to a client at a house in ${state.key.route[state.key.found]}.` }),
              t({ tr: "Yanlış evde gösterirsen müşteri şüphelenir.", en: "Show it at the wrong house and the client gets suspicious." }),
              t({ tr: "Şehir Haritası'nda soru işaretiyle işaretli.", en: "It's marked with a question mark on the City Map." }),
            ],
          }),
      });
    }
    if (state.muhtar.met) {
      cards.push({
        id: "muhtar",
        icon: "clipboard",
        title: t({ tr: "Muhtar'ın Defteri", en: "The Headman's Notebook" }),
        subtitle: state.muhtar.titled
          ? t({ tr: "Mahallenin Emlakçısı", en: "The Neighborhood's Realtor" })
          : t({ tr: `${state.muhtar.done}/${MUHTAR_TITLE_AT} iş`, en: `${state.muhtar.done}/${MUHTAR_TITLE_AT} favors` }),
        onClick: () => openMuhtar(false),
      });
    }
    return cards;
  }, [state, ctx.index, runGhostStep, openMuhtar]);

  /* ---------------- Mini oyun sırları ---------------- */
  /** B3 — bu Tapu Masası oyununda sahte imzalı belge çıkacak mı (oyun açılırken bir kez sorulur). */
  const rollTapuSigner = useCallback((pastNames: string[]): { name: string; kind: "firat" | "former" } | null => {
    if (stateRef.current.forgery || Math.random() >= FORGERY_CHANCE) return null;
    if (pastNames.length > 0 && Math.random() < 0.5) return { name: pastNames[Math.floor(Math.random() * pastNames.length)], kind: "former" };
    return { name: "Fırat Yılmaz", kind: "firat" };
  }, []);

  const onTapuForgeryCaught = useCallback(
    (kind: "firat" | "former") => {
      const s = stateRef.current;
      if (s.forgery) return;
      setState({ ...s, forgery: true, rivalHeadStart: kind === "firat" ? s.rivalHeadStart + 1 : s.rivalHeadStart });
      ctxRef.current.awardBadge("tanidik-imza");
      album("tanidik-imza");
      if (kind === "firat") msg("firat", "Fırat Bey", firatAngryMessage, ctxRef.current.index + 1);
    },
    [album, msg],
  );

  /** B2 — Vitrin Karesi'nde üç karede de yalnızca kedi. */
  const onCatPhotographer = useCallback(() => {
    const s = stateRef.current;
    if (s.cat) return;
    setState({ ...s, cat: true });
    ctxRef.current.awardBadge("kedi-fotografcisi");
    album("kedi-fotografci");
    msg("muzaffer", "Muzaffer Bey", { tr: "İlan patladı Emlah! Herkes kediyi soruyor. Evi resmen kedi sattı.", en: "The listing blew up, Estetan! Everyone's asking about the cat. The cat practically sold the house." }, ctxRef.current.index + 1);
    ctxRef.current.setBossMood((m) => Math.min(100, m + 3));
  }, [album, msg]);

  /** B6 — radyoya üst üste dokunuş; beşincide gizli yayın metnini döndürür. */
  const onRadioTap = useCallback((): string | null => {
    radioTapsRef.current += 1;
    if (radioTapsRef.current < RADIO_SECRET_TAPS) return null;
    radioTapsRef.current = 0;
    const s = stateRef.current;
    if (!s.radio) setState({ ...s, radio: true });
    album("gizli-frekans");
    return resolveText(radioSecretBroadcast(ctxRef.current.origin));
  }, [album]);
  const resetRadioTaps = useCallback(() => {
    radioTapsRef.current = 0;
  }, []);

  /* ---------------- Gizli evler ---------------- */
  const finishSecretHouse = useCallback(
    (houseId: string, outcome: SceneOutcome) => {
      const s = stateRef.current;
      if (houseId === "yesil-kapili-yali") {
        setState({ ...s, yaliResult: outcome, key: { ...s.key, stage: "done" } });
        if (outcome === "sold") {
          ctxRef.current.awardBadge("yesil-kapi");
          album("yesil-kapi");
        }
      } else if (houseId === "emlahin-evi") {
        setState({ ...s, homeResult: outcome });
        if (outcome === "sold") ctxRef.current.awardBadge("dongu");
        album("dongu");
      }
    },
    [album],
  );

  const shouldOfferHome = useCallback(
    (results: { outcome: SceneOutcome; sale?: { discountPercent: number } | null }[], compass: { durustluk: number; kurnazlik: number }) =>
      stateRef.current.homeResult === null && !!secretHouseById("emlahin-evi") && qualifiesForHome(results, compass),
    [],
  );

  /** Final slaytları — tamamlanan yan hikâyeler. */
  const endingSlides = useCallback((): { icon: string; eyebrow: string; title: string; body: string[] }[] => {
    const s = stateRef.current;
    const out: { icon: string; eyebrow: string; title: string; body: string[] }[] = [];
    if (s.yaliResult === "sold")
      out.push({ icon: "key", eyebrow: t({ tr: "Yan Hikâye", en: "Side Story" }), title: t({ tr: "Yeşil Kapının Anahtarı", en: "Key to the Green Door" }), body: [t({ tr: "Nadide Hanım'ın yalısı doğru ellere geçti. Bazı satışlar komisyondan büyüktür.", en: "Nadide Hanım's mansion went to the right hands. Some sales are bigger than the commission." })] });
    if (s.muzaffer.status === "told")
      out.push({ icon: "tie", eyebrow: t({ tr: "Yan Hikâye", en: "Side Story" }), title: t({ tr: "Kapının Üstündeki Kuş", en: "The Bird Above the Door" }), body: [t({ tr: "Muzaffer Bey çocukluk evini bir kez daha gördü. O günden sonra sana hiç kızamadı.", en: "Muzaffer Bey saw his childhood home once more. After that, he could never stay angry at you." })] });
    if (s.life.stage >= 3)
      out.push({ icon: "envelope", eyebrow: t({ tr: "Yan Hikâye", en: "Side Story" }), title: t({ tr: "Ailenin Emlakçısı", en: "The Family's Realtor" }), body: [t({ tr: `${s.life.name ?? ""} ailesinin düğün fotoğrafında sen de varsın.`, en: `You're in the ${s.life.name ?? ""} family's wedding photo too.` })] });
    if (s.muhtar.titled)
      out.push({ icon: "cup", eyebrow: t({ tr: "Yan Hikâye", en: "Side Story" }), title: t({ tr: "Mahallenin Emlakçısı", en: "The Neighborhood's Realtor" }), body: [t({ tr: "Muhtar Cemal'in defterinde artık senin de bir sayfan var.", en: "Headman Cemal's notebook now has a page for you." })] });
    if (s.homeResult === "sold")
      out.push({ icon: "house", eyebrow: t({ tr: "55. Ev", en: "The 55th House" }), title: t({ tr: "Döngü", en: "Full Circle" }), body: [t({ tr: "Kendi evini, ilk günkü haline sattın. Anahtarı verirken ona bir kusur söyledin; o da sana güvendi.", en: "You sold your own home to someone just like you on day one. You told them a flaw; they trusted you." })] });
    return out;
  }, []);

  /** Şehir haritasındaki "?" — anahtarın sıradaki semti. */
  const keyMapHint = state.key.stage === "held" ? (state.key.route[state.key.found] ?? null) : null;
  /** B4 — ofis şeridi. */
  const specialDay = useMemo(() => specialDayFor(), []);

  /** Kayıt yükleme / yeni oyun: durumu değiştirirken çift tetikleme korumasını da hizala. */
  const replaceState = useCallback((next: SideQuestState) => {
    tickedRef.current = next.lastTick;
    stateRef.current = next;
    setState(next);
  }, []);

  return {
    state,
    setState: replaceState,
    stateRef,
    story,
    closeStory: () => {
      const cur = story;
      setStory(null);
      cur?.onClose?.();
    },
    dialogueFor,
    onSideChoice,
    onHouseResolved,
    openMuhtar,
    onEasterEggShown,
    album,
    officeCards,
    rollTapuSigner,
    onTapuForgeryCaught,
    onCatPhotographer,
    onRadioTap,
    resetRadioTaps,
    finishSecretHouse,
    shouldOfferHome,
    endingSlides,
    keyMapHint,
    specialDay,
    rivalHeadStart: state.rivalHeadStart,
  };
}
