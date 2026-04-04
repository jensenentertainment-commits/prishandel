"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { voices } from "@/app/lib/voices";

type Kind =
  | "generic"
  | "price"
  | "shipping"
  | "coupon"
  | "stock"
  | "checkout"
  | "conscience"
  | "where_start"
  | "tracking";

type Source = "market" | "ledger" | "system" | "advisor" | "user";

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

const STORAGE_KEY = "prishandel_support_chat_v5";

const QUICK_PROMPTS = [
  "Kan jeg fullføre et kjøp?",
  "Er dette på lager?",
  "Hva skjer i kassen?",
  "Har dere rabattkode?",
  "Hva er god samvittighet?",
  "Hvor starter jeg?",
] as const;

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

  if (
    s.includes("hvor starter") ||
    s.includes("hvordan starter") ||
    s.includes("hva gjør jeg") ||
    s.includes("hvor begynner") ||
    s.includes("hvordan fungerer dette")
  ) return "where_start";

  if (
    s.includes("kasse") ||
    s.includes("checkout") ||
    s.includes("fullføre kjøp") ||
    s.includes("fullfor") ||
    s.includes("betale") ||
    s.includes("kan jeg kjøpe")
  ) return "checkout";

  if (
    s.includes("god samvittighet") ||
    s.includes("samvittighet") ||
    s.includes("klimakompensert") ||
    s.includes("omtanke")
  ) return "conscience";

  if (
    s.includes("sporing") ||
    s.includes("pakke") ||
    s.includes("ordre") ||
    s.includes("sendingsnummer") ||
    s.includes("levert")
  ) return "tracking";

  if (s.includes("kupong") || s.includes("kode") || s.includes("rabattkode")) {
    return "coupon";
  }

  if (
    s.includes("pris") ||
    s.includes("rabatt") ||
    s.includes("billig") ||
    s.includes("tilbud") ||
    s.includes("dyrt")
  ) return "price";

  if (
    s.includes("lever") ||
    s.includes("frakt") ||
    s.includes("send") ||
    s.includes("post") ||
    s.includes("hente")
  ) return "shipping";

  if (
    s.includes("lager") ||
    s.includes("utsolgt") ||
    s.includes("på lager") ||
    s.includes("tilgjengelig")
  ) return "stock";

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
        source: "advisor",
        text: "Hei. Jeg er intern handelsrådgiver. Jeg kan forklare prispress, lagerusikkerhet, kasseflyt og god samvittighet uten å garantere klarhet.",
        ts: now,
      },
      {
        id: uid(),
        role: "bot",
        source: "market",
        text: "📣 Marked: Kundeservice er åpen for tolkning.",
        ts: now + 1,
      },
      {
        id: uid(),
        role: "bot",
        source: "ledger",
        text: "🧾 Regnskap: Henvendelser registreres før de forstås.",
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

function botLine(source: Source, text: string): Msg {
  return {
    id: uid(),
    role: "bot",
    source,
    text,
    ts: Date.now(),
  };
}

function systemLine(text: string) {
  return botLine("system", text);
}

function advisorLine(text: string) {
  return botLine("advisor", text);
}

function marketLine(kind: Kind): Msg {
  return {
    id: uid(),
    role: "bot",
    source: "market",
    text: voices.market.say(
      kind === "checkout" || kind === "conscience" || kind === "where_start" || kind === "tracking"
        ? "generic"
        : kind
    ),
    ts: Date.now(),
  };
}

function ledgerLine(kind: Kind): Msg {
  return {
    id: uid(),
    role: "bot",
    source: "ledger",
    text: voices.ledger.say(
      kind === "checkout" || kind === "conscience" || kind === "where_start" || kind === "tracking"
        ? "generic"
        : kind
    ),
    ts: Date.now(),
  };
}

function classifyPressureLabel(value: number) {
  if (value >= 85) return "kritisk";
  if (value >= 70) return "høyt";
  if (value >= 50) return "aktivt";
  return "stabilt";
}

function buildAdvisorGuidance(kind: Kind, userText: string) {
  const lower = userText.toLowerCase();

  switch (kind) {
    case "where_start":
      return "Start med et produkt under aktivt prispress. Legg det i kurven. Gå deretter til kassen og se om systemet tåler initiativet.";
    case "checkout":
      return "Kassen behandler betaling, lager, frakt og virkelighet som separate spørsmål. Det er fullt mulig å komme langt uten å komme i mål.";
    case "conscience":
      return "God samvittighet er et tillegg som reduserer opplevd belastning uten å forbedre produkt, levering eller faktisk konsekvens.";
    case "tracking":
      return "Sporing brukes best etter at ordren har fått et utfall. Den gir ikke nødvendigvis bedre svar, men den gir flere.";
    case "stock":
      return "Lagerstatus bør forstås som en stemning med administrative konsekvenser. Utsolgt betyr ikke inaktivt.";
    case "shipping":
      return "Levering omtales offensivt, men bekreftes forsiktig. Ubestemt er fortsatt en gyldig tilstand.";
    case "coupon":
      return "Rabattkoder registreres gjerne, men prisendring er fortsatt et eget spørsmål.";
    case "price":
      return "Prisene er satt for å skape bevegelse. Om de er forsvarlige, behandles i et annet lag.";
    default:
      if (lower.includes("ekte butikk") || lower.includes("er dette ekte")) {
        return "Dette er en spillbar butikkopplevelse med ekte klikkflyt og kunstig trygghet.";
      }
      return "Jeg kan hjelpe deg med å starte handelen, forstå kassen eller avklare hvorfor ting fortsatt er utsolgt.";
  }
}

function buildActionNudge(kind: Kind) {
  switch (kind) {
    case "where_start":
    case "price":
    case "stock":
      return "Forslag: åpne et produkt eller gå rett til varer under press.";
    case "checkout":
    case "conscience":
      return "Forslag: legg noe i kurven og prøv kassen.";
    case "tracking":
      return "Forslag: fullfør en handel først, og bruk sporing etterpå.";
    default:
      return "Forslag: prøv å kjøpe noe og se hvor langt ordren kommer.";
  }
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
    case "checkout":
      marketPressure += 6;
      ledgerPressure += 11;
      escalation += 1;
      break;
    case "conscience":
      marketPressure += 5;
      ledgerPressure += 7;
      break;
    case "tracking":
      marketPressure += 2;
      ledgerPressure += 6;
      break;
    case "where_start":
      marketPressure += 4;
      ledgerPressure += 3;
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

  replies.push(advisorLine(buildAdvisorGuidance(kind, userText)));

  if (repeatCount >= 2) {
    replies.push(systemLine("⚡ System: Henvendelsen er registrert som gjentakende."));
  }

  if (escalation >= 3 && ledgerPressure >= 70) {
    replies.push(systemLine("⚡ System: Saken er eskalert internt uten fremdriftsløfte."));
  }

  const forceLedger = mentionsLedger || ledgerPressure > 82;
  const forceDuel =
    escalation >= 2 ||
    (marketPressure >= 72 && ledgerPressure >= 64) ||
    duelScore < 28;

  if (forceLedger) {
    replies.push(ledgerLine(kind));
  } else if (forceDuel) {
    replies.push(marketLine(kind));
    replies.push(ledgerLine(kind));
  } else {
    replies.push(marketLine(kind));
  }

  if (marketScore < 16 && !forceLedger) {
    replies.push(systemLine("⚡ System: Marked har valgt å stå i formuleringen."));
  }

  if (ledgerScore < 14 && !mentionsLedger) {
    replies.push(
      botLine(
        "ledger",
        "🧾 Regnskap: Dette noteres uten at det hjelper marginene."
      )
    );
  }

  replies.push(advisorLine(buildActionNudge(kind)));

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
  if (replies.length >= 4) return 1250;
  if (replies.length === 3) return 1000;
  if (replies.length === 2) return 850;
  return 650;
}

function typingLabel(state: ChatState) {
  if (state.escalation >= 3) return "Eskalering pågår…";
  if (state.ledgerPressure > state.marketPressure) return "Regnskap svarer…";
  if (state.marketPressure > state.ledgerPressure + 10) return "Marked formulerer…";
  return "Handelsrådgiver vurderer…";
}

function bubbleClasses(msg: Msg) {
  if (msg.role === "user") return "bg-black text-white rounded-br-md border-black";
  if (msg.source === "system") return "bg-yellow-50 text-black rounded-bl-md border-yellow-300";
  if (msg.source === "ledger") return "bg-white text-black rounded-bl-md border-black/15";
  if (msg.source === "advisor") return "bg-neutral-100 text-black rounded-bl-md border-black/10";
  return "bg-red-50 text-black rounded-bl-md border-red-200";
}

function sourceLabel(msg: Msg) {
  if (msg.role === "user") return "Du";
  if (msg.source === "market") return "Marked";
  if (msg.source === "ledger") return "Regnskap";
  if (msg.source === "advisor") return "Rådgiver";
  return "System";
}

function QuickActionLinks(props: { kind: Kind }) {
  if (props.kind === "where_start" || props.kind === "price" || props.kind === "stock") {
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          href="/butikk"
          className="rounded-lg bg-black px-3 py-2 text-xs font-black text-white hover:opacity-90"
        >
          Se varer →
        </Link>
        <Link
          href="/kampanjer"
          className="rounded-lg border border-black/15 bg-white px-3 py-2 text-xs font-black hover:bg-black/5"
        >
          Se kampanjer
        </Link>
      </div>
    );
  }

  if (props.kind === "checkout" || props.kind === "conscience") {
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          href="/kurv"
          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white hover:opacity-90"
        >
          Åpne kurven →
        </Link>
        <Link
          href="/butikk"
          className="rounded-lg border border-black/15 bg-white px-3 py-2 text-xs font-black hover:bg-black/5"
        >
          Finn vare
        </Link>
      </div>
    );
  }

  if (props.kind === "tracking") {
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          href="/kurv"
          className="rounded-lg bg-black px-3 py-2 text-xs font-black text-white hover:opacity-90"
        >
          Start handel →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <Link
        href="/butikk"
        className="rounded-lg bg-black px-3 py-2 text-xs font-black text-white hover:opacity-90"
      >
        Prøv å kjøpe noe →
      </Link>
    </div>
  );
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

  function submitText(textArg?: string) {
    const text = (textArg ?? input).trim();
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
          Spør handelsrådgiver
        </button>
      )}

      {open && (
        <div className="w-[380px] max-w-[94vw] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
          <div className="border-b border-black/10 bg-red-600 px-4 py-3 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black">Intern handelsrådgiver</div>
                <div className="mt-0.5 text-xs opacity-90">
                  Marked, regnskap og system svarer etter beste evne og interesse
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

          <div className="border-b border-black/10 bg-neutral-50 px-3 py-3">
            <div className="mb-2 text-[11px] font-black uppercase tracking-wide opacity-55">
              Hurtigspørsmål
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitText(prompt)}
                  className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-black hover:bg-black/5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={listRef}
            className="h-[380px] overflow-y-auto bg-neutral-50 px-3 py-3"
          >
            <div className="space-y-2">
              {state.msgs.map((msg, index) => {
                const showActions =
                  msg.role === "bot" &&
                  msg.source === "advisor" &&
                  index === state.msgs.length - 1;

                return (
                  <div key={msg.id}>
                    <div
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

                    {showActions && (
                      <div className="mt-1 flex justify-start">
                        <div className="max-w-[88%]">
                          <QuickActionLinks kind={state.lastKind} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

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
                onKeyDown={(e) => e.key === "Enter" && submitText()}
                placeholder="Beskriv avviket ditt…"
                className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm font-medium placeholder:opacity-50"
              />
              <button
                onClick={() => submitText()}
                className="rounded-lg bg-green-600 px-4 py-2 font-black text-white hover:opacity-95"
              >
                Send
              </button>
            </div>
          </div>

          <div className="px-3 pb-3 text-[11px] opacity-60">
            Ved å bruke rådgiveren godtar du intern uenighet, forskjøvet ansvar og mulig eskalering.
          </div>
        </div>
      )}
    </div>
  );
}