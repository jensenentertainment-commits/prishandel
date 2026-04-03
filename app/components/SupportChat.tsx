"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { voices } from "@/app/lib/voices";

type Kind = "generic" | "price" | "shipping" | "coupon" | "stock";
type Source = "market" | "ledger" | "system" | "user";

type Msg = {
  id: string;
  role: "user" | "bot";
  source: Source;
  text: string;
  ts: number;
};

type ChatState = {
  msgs: Msg[];
  lastKind: Kind;
  marketPressure: number;
  ledgerPressure: number;
  escalation: number;
  repeatCount: number;
  sessionSeed: string;
};

const STORAGE_KEY = "prishandel_support_chat_v4";

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function hashString(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function score(seed: string, text: string, salt: string) {
  return hashString(`${seed}|${salt}|${text}`) % 100;
}

function detectKind(t: string): Kind {
  const s = t.toLowerCase();

  if (s.includes("kupong") || s.includes("kode") || s.includes("rabattkode")) {
    return "coupon";
  }

  if (
    s.includes("pris") ||
    s.includes("rabatt") ||
    s.includes("billig") ||
    s.includes("tilbud") ||
    s.includes("dyrt")
  ) {
    return "price";
  }

  if (
    s.includes("lever") ||
    s.includes("frakt") ||
    s.includes("send") ||
    s.includes("post") ||
    s.includes("hente")
  ) {
    return "shipping";
  }

  if (
    s.includes("lager") ||
    s.includes("utsolgt") ||
    s.includes("på lager") ||
    s.includes("tilgjengelig")
  ) {
    return "stock";
  }

  return "generic";
}

function buildInitialState(): ChatState {
  const sessionSeed =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now());

  const now = Date.now();

  return {
    msgs: [
      {
        id: uid(),
        role: "bot",
        source: "market",
        text: "📣 Marked: Kundeservice er åpen for tolkning.",
        ts: now,
      },
      {
        id: uid(),
        role: "bot",
        source: "ledger",
        text: "🧾 Regnskap: Henvendelser registreres før de forstås.",
        ts: now + 1,
      },
      {
        id: uid(),
        role: "bot",
        source: "system",
        text: "⚡ System: Tvistelag aktivert. Svar kan avvike internt.",
        ts: now + 2,
      },
    ],
    lastKind: "generic",
    marketPressure: 58,
    ledgerPressure: 46,
    escalation: 0,
    repeatCount: 0,
    sessionSeed,
  };
}

function systemLine(text: string): Msg {
  return {
    id: uid(),
    role: "bot",
    source: "system",
    text,
    ts: Date.now(),
  };
}

function marketLine(kind: Kind): Msg {
  return {
    id: uid(),
    role: "bot",
    source: "market",
    text: voices.market.say(kind),
    ts: Date.now(),
  };
}

function ledgerLine(kind: Kind): Msg {
  return {
    id: uid(),
    role: "bot",
    source: "ledger",
    text: voices.ledger.say(kind),
    ts: Date.now(),
  };
}

function classifyPressureLabel(value: number) {
  if (value >= 85) return "kritisk";
  if (value >= 70) return "høyt";
  if (value >= 50) return "aktivt";
  return "stabilt";
}

function buildReplies(userText: string, state: ChatState) {
  const lower = userText.toLowerCase();
  const kind = detectKind(lower);

  const mentionsLedger =
    lower.includes("regnskap") ||
    lower.includes("økonomi") ||
    lower.includes("margin") ||
    lower.includes("seriøst") ||
    lower.includes("stopp") ||
    lower.includes("ulovlig") ||
    lower.includes("tull");

  const mentionsUrgency =
    lower.includes("nå") ||
    lower.includes("fort") ||
    lower.includes("haster") ||
    lower.includes("umiddelbart");

  const sameKind = kind === state.lastKind;
  const repeatCount = sameKind ? state.repeatCount + 1 : 0;

  let marketPressure = state.marketPressure;
  let ledgerPressure = state.ledgerPressure;
  let escalation = state.escalation;

  switch (kind) {
    case "price":
      marketPressure += 8;
      ledgerPressure += 4;
      break;
    case "coupon":
      marketPressure += 10;
      ledgerPressure += 6;
      break;
    case "shipping":
      marketPressure += 3;
      ledgerPressure += 8;
      break;
    case "stock":
      marketPressure += 4;
      ledgerPressure += 10;
      break;
    default:
      marketPressure += 2;
      ledgerPressure += 2;
  }

  if (mentionsLedger) ledgerPressure += 12;
  if (mentionsUrgency) escalation += 1;
  if (sameKind) escalation += 1;
  if (repeatCount >= 1) ledgerPressure += 5;
  if (repeatCount >= 2) escalation += 1;

  marketPressure = clamp(marketPressure, 0, 100);
  ledgerPressure = clamp(ledgerPressure, 0, 100);
  escalation = clamp(escalation, 0, 5);

  const marketScore = score(state.sessionSeed, userText, "market");
  const ledgerScore = score(state.sessionSeed, userText, "ledger");
  const duelScore = score(state.sessionSeed, userText, "duel");

  const replies: Msg[] = [];

  if (repeatCount >= 2) {
    replies.push(
      systemLine("⚡ System: Henvendelsen er registrert som gjentakende.")
    );
  }

  if (escalation >= 3 && ledgerPressure >= 70) {
    replies.push(
      systemLine("⚡ System: Saken er eskalert internt uten fremdriftsløfte.")
    );
  }

  const forceLedger = mentionsLedger || ledgerPressure > 82;
  const forceDuel =
    escalation >= 2 ||
    (marketPressure >= 72 && ledgerPressure >= 64) ||
    duelScore < 28;

  if (forceLedger) {
    replies.push(ledgerLine(kind));
  } else if (forceDuel) {
    const duel = voices.duel(kind).map((x) => ({
      id: uid(),
      role: "bot" as const,
      source: x.text.trim().startsWith("🧾") ? ("ledger" as const) : ("market" as const),
      text: x.text,
      ts: Date.now(),
    }));
    replies.push(...duel);
  } else {
    replies.push(marketLine(kind));
  }

  if (marketScore < 16 && !forceLedger) {
    replies.push(
      systemLine("⚡ System: Marked har valgt å stå i formuleringen.")
    );
  }

  if (ledgerScore < 14 && !mentionsLedger) {
    replies.push(
      {
        id: uid(),
        role: "bot",
        source: "ledger",
        text: "🧾 Regnskap: Dette noteres uten at det hjelper marginene.",
        ts: Date.now(),
      }
    );
  }

  const nextState: ChatState = {
    ...state,
    lastKind: kind,
    marketPressure,
    ledgerPressure,
    escalation,
    repeatCount,
  };

  return { replies, nextState };
}

function messageDelay(replies: Msg[]) {
  if (replies.length >= 3) return 1100;
  if (replies.length === 2) return 850;
  return 650;
}

function typingLabel(state: ChatState) {
  if (state.escalation >= 3) return "Eskalering pågår…";
  if (state.ledgerPressure > state.marketPressure) return "Regnskap svarer…";
  if (state.marketPressure > state.ledgerPressure + 10) return "Marked formulerer…";
  return "Tvistelag skriver…";
}

function bubbleClasses(msg: Msg) {
  if (msg.role === "user") {
    return "bg-black text-white rounded-br-md border-black";
  }

  if (msg.source === "system") {
    return "bg-yellow-50 text-black rounded-bl-md border-yellow-300";
  }

  if (msg.source === "ledger") {
    return "bg-white text-black rounded-bl-md border-black/15";
  }

  return "bg-red-50 text-black rounded-bl-md border-red-200";
}

function sourceLabel(msg: Msg) {
  if (msg.role === "user") return "Du";
  if (msg.source === "market") return "Marked";
  if (msg.source === "ledger") return "Regnskap";
  return "System";
}

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ChatState>(buildInitialState);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as ChatState;

      if (
        parsed &&
        Array.isArray(parsed.msgs) &&
        typeof parsed.marketPressure === "number" &&
        typeof parsed.ledgerPressure === "number" &&
        typeof parsed.escalation === "number" &&
        typeof parsed.repeatCount === "number" &&
        typeof parsed.sessionSeed === "string"
      ) {
        setState(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, state.msgs, typing]);

  const typingText = useMemo(() => typingLabel(state), [state]);

  const marketLabel = classifyPressureLabel(state.marketPressure);
  const ledgerLabel = classifyPressureLabel(state.ledgerPressure);

  function reset() {
    const fresh = buildInitialState();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setTyping(false);
    setState(fresh);
  }

  function send() {
    const text = input.trim();
    if (!text) return;

    if (text.toLowerCase() === "reset" || text.toLowerCase() === "slett") {
      reset();
      setInput("");
      return;
    }

    const userMsg: Msg = {
      id: uid(),
      role: "user",
      source: "user",
      text,
      ts: Date.now(),
    };

    const baseState: ChatState = {
      ...state,
      msgs: [...state.msgs, userMsg],
    };

    setState(baseState);
    setInput("");

    const { replies, nextState } = buildReplies(text, baseState);
    setTyping(true);

    const delay = messageDelay(replies);

    window.setTimeout(() => {
      setState({
        ...nextState,
        msgs: [...baseState.msgs, ...replies.map((r, i) => ({ ...r, ts: Date.now() + i }))],
      });
      setTyping(false);
    }, delay);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-black/10 bg-green-600 px-4 py-3 font-black text-white shadow-lg hover:opacity-95"
        >
          Kundeservice
        </button>
      )}

      {open && (
        <div className="w-[360px] max-w-[94vw] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
          <div className="border-b border-black/10 bg-red-600 px-4 py-3 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black">Kundeservice</div>
                <div className="mt-0.5 text-xs opacity-90">
                  Tvistelag aktivt • respons kan foreligge internt
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="rounded bg-white/15 px-2 py-1 text-xs font-black"
                >
                  Reset
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded bg-white/15 px-2 py-1 text-xs font-black"
                >
                  Lukk
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wide">
              <span className="rounded bg-white/15 px-2 py-1">
                Marked: {state.marketPressure}% / {marketLabel}
              </span>
              <span className="rounded bg-white/15 px-2 py-1">
                Regnskap: {state.ledgerPressure}% / {ledgerLabel}
              </span>
              <span className="rounded bg-white/15 px-2 py-1">
                Eskalering: {state.escalation}
              </span>
            </div>
          </div>

          <div
            ref={listRef}
            className="h-[360px] overflow-y-auto bg-neutral-50 px-3 py-3"
          >
            <div className="space-y-2">
              {state.msgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl border px-3 py-2 text-sm ${bubbleClasses(msg)}`}
                  >
                    <div className="mb-1 text-[10px] font-black uppercase tracking-wide opacity-55">
                      {sourceLabel(msg)}
                    </div>
                    <div>{msg.text}</div>
                    <div className="mt-1 text-[10px] opacity-45">
                      {new Date(msg.ts).toLocaleTimeString("nb-NO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-black/10 bg-white px-3 py-2 text-sm">
                    <div className="mb-1 text-[10px] font-black uppercase tracking-wide opacity-55">
                      Behandler
                    </div>
                    <div>{typingText}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-black/10 bg-white px-3 py-3">
            <div className="mb-2 text-[11px] opacity-60">
              Tema sist registrert: <span className="font-black">{state.lastKind}</span>
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Beskriv avviket ditt…"
                className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm font-medium placeholder:opacity-50"
              />
              <button
                onClick={send}
                className="rounded-lg bg-green-600 px-4 py-2 font-black text-white hover:opacity-95"
              >
                Send
              </button>
            </div>
          </div>

          <div className="px-3 pb-3 text-[11px] opacity-60">
            Ved å bruke chat godtar du intern uenighet, forskjøvet ansvar og mulig eskalering.
          </div>
        </div>
      )}
    </div>
  );
}