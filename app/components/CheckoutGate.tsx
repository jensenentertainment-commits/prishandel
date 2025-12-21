"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { CreditCard, ShieldCheck, Truck, Loader2, Receipt, Zap } from "lucide-react";
import { useCart } from "./cart/CartProvider";
import { useLedger } from "./ledger/useLedger";

type Step = {
  title: string;
  body: string;
  icon: any;
  ms: number;
};

export default function CheckoutGate(props: {
  total: number;
  itemsCount: number;
}) {
  const router = useRouter();
  const { clear } = useCart();
const ledger = useLedger();

  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [idx, setIdx] = useState(0);

  // Stabil “utfall” per åpning (ingen random i render)
  const [outcome, setOutcome] = useState<"utsolgt" | "systemfeil">("utsolgt");

  const steps: Step[] = useMemo(
    () => [
      {
        title: "Kobler til Vipps/Klarna*",
        body: "Autentiserer betalingsvilje og kampanjeinstinkt.",
        icon: CreditCard,
        ms: 900,
      },
      {
        title: "Sjekker lagerstatus",
        body: "Finner lagerstatus: 0. Dobbeltsjekker likevel for drama.",
        icon: ShieldCheck,
        ms: 1100,
      },
      {
        title: "Beregner frakt",
        body: "Setter frakt til “ubestemt” og kaller det en løsning.",
        icon: Truck,
        ms: 850,
      },
      {
        title: "Kontakter regnskap",
        body: "Regnskap er nå våken. Marked later som ingenting.",
        icon: Receipt,
        ms: 1200,
      },
      {
        title: "Finaliserer ordre",
        body: "Ordre nummereres, arkiveres og angrer umiddelbart.",
        icon: Zap,
        ms: 900,
      },
    ],
    [],
  );

  function start() {
    setOutcome(Math.random() < 0.25 ? "systemfeil" : "utsolgt"); // 25% systemfeil, resten utsolgt
    setIdx(0);
    setRunning(true);
  }

  function makeOrderId() {
    // Ser “systemgenerert” ut, men er fortsatt bare client
    const n = Math.floor(Math.random() * 900000 + 100000);
    return `PH-${n}`;
  }

  function makeCode(out: "utsolgt" | "systemfeil") {
    // Litt “intern” kode som varierer etter utfall
    return out === "systemfeil" ? "E-KASSE-500" : "E-KASSE-200";
  }

  // Kjører steg for steg, og ender i ordre-visning
  useEffect(() => {
    if (!open || !running) return;

    if (idx >= steps.length) {
      const id = makeOrderId();
      const code = makeCode(outcome);

      const to =
        `/ordre/${encodeURIComponent(id)}` +
        `?from=kasse` +
        `&code=${encodeURIComponent(code)}` +
        `&items=${encodeURIComponent(String(props.itemsCount))}` +
        `&total=${encodeURIComponent(String(props.total))}` +
        `&outcome=${encodeURIComponent(outcome)}`;

      const t = setTimeout(() => {
        router.push(to);
ledger.append("Ordre registrert (foreløpig)", +props.total);
ledger.append("Kvittering generert (internt)", 0);
        // Tøm kurven etter at vi har “sendt” deg videre.
        // (URL-parametrene er nå sannheten)
        setTimeout(() => {
          clear();
        }, 50);
      }, 650);

      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setIdx((i) => i + 1), steps[idx].ms);
    return () => clearTimeout(t);
  }, [open, running, idx, steps, router, outcome, props.itemsCount, props.total, clear]);

  // ESC lukker
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setRunning(false);
          setIdx(0);
        }}
        className="mt-4 w-full rounded-xl bg-red-600 text-white px-4 py-3 font-black text-center hover:opacity-90"
      >
        GÅ TIL KASSEN →
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] grid place-items-center p-4">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Lukk"
          />

          <div className="relative w-[560px] max-w-[96vw] rounded-2xl bg-white border border-black/10 shadow-2xl overflow-hidden">
            <div className="bg-yellow-300 text-black px-5 py-4 flex items-start justify-between gap-3 border-b border-black/10">
              <div>
                <div className="font-black leading-tight">Kasse (simulert)</div>
                <div className="text-xs font-semibold opacity-80 mt-1">
                  {props.itemsCount} varer • Total: {props.total},- • Lager: 0
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-black/20 px-3 py-2 text-sm font-black hover:bg-black/5"
              >
                Lukk
              </button>
            </div>

            <div className="p-5 space-y-4">
              {!running ? (
                <>
                  <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
                    <div className="text-sm font-black">Klar til å betale*</div>
                    <div className="mt-1 text-sm opacity-80">
                      *Betaling kan avvike fra virkeligheten. Regnskap følger med.
                    </div>

                    <div className="mt-3 grid gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Delsum</span>
                        <span className="font-black">{props.total},-</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Frakt</span>
                        <span className="font-black">ubestemt</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Rabatt</span>
                        <span className="font-black">0,-</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={start}
                    className="w-full rounded-xl bg-black text-white px-4 py-3 font-black hover:opacity-90"
                  >
                    FULLFØR KJØP →
                  </button>

                  <div className="text-xs opacity-60">
                    📣 Marked: “Bare ett klikk igjen.” 🧾 Regnskap: “Det var det som bekymrer meg.”
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-black">Behandler ordre…</div>
                      <div className="inline-flex items-center gap-2 text-xs font-semibold opacity-70">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        live
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {steps.map((s, i) => {
                        const done = i < idx;
                        const active = i === idx;
                        return (
                          <div
                            key={s.title}
                            className={[
                              "rounded-lg border border-black/10 bg-white px-3 py-3 flex items-start gap-3",
                              done ? "opacity-70" : "",
                              active ? "ring-2 ring-black/10" : "",
                            ].join(" ")}
                          >
                            <Icon icon={s.icon} tone={active ? "strong" : "muted"} />
                            <div className="min-w-0">
                              <div className="text-sm font-black truncate">
                                {s.title}
                                {done ? " ✓" : active ? " …" : ""}
                              </div>
                              <div className="text-xs opacity-70 mt-0.5">{s.body}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 text-xs opacity-60">
                      {outcome === "systemfeil"
                        ? "🧾 Regnskap: “Dette ser dyrt ut.” 📣 Marked: “Dette ser spennende ut!”"
                        : "📣 Marked: “Ikke tenk.” 🧾 Regnskap: “Jeg tenker for oss begge.”"}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setRunning(false);
                      setIdx(0);
                    }}
                    className="w-full rounded-xl bg-white text-black px-4 py-3 font-black border border-black/20 hover:bg-black/5"
                  >
                    Avbryt (fornuftig)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
