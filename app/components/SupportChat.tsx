"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { voices } from "@/app/lib/voices";

type Msg = {
  id: string;
  role: "user" | "bot";
  text: string;
  ts: number;
};

const STORAGE_KEY = "prishandel_support_chat_v2";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

// ---------- helpers ----------
function detectKind(t: string): "generic" | "price" | "shipping" | "coupon" | "stock" {
  if (t.includes("kupong") || t.includes("kode") || t.includes("rabattkode")) return "coupon";
  if (t.includes("pris") || t.includes("rabatt") || t.includes("billig") || t.includes("tilbud")) return "price";
  if (t.includes("lever") || t.includes("frakt") || t.includes("send") || t.includes("post")) return "shipping";
  if (t.includes("lager") || t.includes("utsolgt") || t.includes("på lager")) return "stock";
  return "generic";
}

/**
 * Returnerer 1–2 svarlinjer basert på intern konflikt
 */
function autoReplyLines(userText: string): string[] {
  const t = userText.toLowerCase();
  const kind = detectKind(t);

  const mentionsLedger =
    t.includes("regnskaps") ||
    t.includes("økonomi") ||
    t.includes("margin") ||
    t.includes("seriøst") ||
    t.includes("stopp");

  const roll = Math.random();

  // Hvis bruker er "seriøs" → større sjanse for regnskap
  if (mentionsLedger && Math.random() < 0.45) {
    return [voices.ledger.say(kind)];
  }

  // 5 % kun regnskap
  if (roll < 0.05) {
    return [voices.ledger.say(kind)];
  }

  // 25 % duel
  if (roll < 0.30) {
    return voices.duel(kind).map((x) => x.text);
  }

  // ellers marked alene
  return [voices.market.say(kind)];
}

// ---------- component ----------
export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  // init
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed)) {
          setMsgs(parsed);
          return;
        }
      }
    } catch {}

    // seed
    setMsgs([
      {
        id: uid(),
        role: "bot",
        text: voices.market.say("generic"),
        ts: Date.now(),
      },
      {
        id: uid(),
        role: "bot",
        text: voices.ledger.ps(),
        ts: Date.now() + 1,
      },
    ]);
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch {}
  }, [msgs]);

  // autoscroll
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, msgs, typing]);

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setMsgs([
      {
        id: uid(),
        role: "bot",
        text: "🧾 Regnskapsfører: Samtalen er slettet. Arkivert.",
        ts: Date.now(),
      },
    ]);
  }

  function send() {
    const text = input.trim();
    if (!text) return;

    // skjult kommando
    if (text.toLowerCase() === "reset" || text.toLowerCase() === "slett") {
      reset();
      setInput("");
      setTyping(false);
      return;
    }

    const userMsg: Msg = {
      id: uid(),
      role: "user",
      text,
      ts: Date.now(),
    };

    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const replies = autoReplyLines(text);

    setTimeout(() => {
      setMsgs((m) => {
        const next = [...m];

        replies.forEach((r, i) => {
          next.push({
            id: uid(),
            role: "bot",
            text: r,
            ts: Date.now() + i,
          });
        });

        // litt ekstra støy fra markedet (sjeldent)
        if (Math.random() < 0.2) {
          next.push({
            id: uid(),
            role: "bot",
            text: voices.market.say("generic"),
            ts: Date.now() + replies.length + 1,
          });
        }

        return next;
      });

      setTyping(false);
    }, 650);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-green-600 text-white px-4 py-3 font-black shadow-lg hover:opacity-95"
        >
          Chat
        </button>
      )}

      {open && (
        <div className="w-[340px] max-w-[92vw] rounded-2xl bg-white border border-black/10 shadow-2xl overflow-hidden">
          {/* header */}
          <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-black">Kundeservice</div>
              <div className="text-xs opacity-90">
                📣 Marked • 🧾 Regnskap
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="text-xs font-black rounded bg-white/15 px-2 py-1"
              >
                Reset
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-xs font-black rounded bg-white/15 px-2 py-1"
              >
                Lukk
              </button>
            </div>
          </div>

          {/* body */}
          <div
            ref={listRef}
            className="h-[340px] overflow-y-auto bg-neutral-50 px-3 py-3"
          >
            <div className="space-y-2">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm border ${
                      m.role === "user"
                        ? "bg-black text-white rounded-br-md"
                        : "bg-white text-black rounded-bl-md"
                    }`}
                  >
                    <div>{m.text}</div>
                    <div className="mt-1 text-[10px] opacity-50">
                      {new Date(m.ts).toLocaleTimeString("nb-NO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-2xl rounded-bl-md px-3 py-2 text-sm">
                    Skriver…
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* input */}
          <div className="px-3 py-3 bg-white border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Skriv her…"
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <button
              onClick={send}
              className="rounded-lg bg-green-600 text-white px-4 py-2 font-black"
            >
              Send
            </button>
          </div>

          <div className="px-3 pb-3 text-[11px] opacity-60">
            Ved å bruke chat godtar du intern uenighet.
          </div>
        </div>
      )}
    </div>
  );
}
