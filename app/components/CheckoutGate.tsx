"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  Loader2,
  Receipt,
  Zap,
  TriangleAlert,
  CircleDashed,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "./Icon";
import { useCart } from "./cart/CartProvider";
import { useLedger } from "./ledger/useLedger";
import { getVoice, say } from "../lib/abVoice";

type Outcome =
  | "utsolgt"
  | "systemfeil"
  | "regnskap"
  | "teoretisk"
  | "internbehandling";

type StepKey =
  | "init"
  | "payment"
  | "inventory"
  | "freight"
  | "finance"
  | "reality"
  | "decision";

type Step = {
  key: StepKey;
  title: string;
  body: string;
  icon: LucideIcon;
  ms: number;
};

type OutcomeMeta = {
  code: string;
  title: string;
  status: string;
  summary: string;
  market: string;
  finance: string;
  note: string;
};

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

function makeSessionSeed(total: number, itemsCount: number) {
  const now = new Date();
  const cycle = Math.floor(now.getTime() / (1000 * 60 * 41)); // stabilt vindu
  return hashString(`checkout|${cycle}|${total}|${itemsCount}`);
}

function prng(seed: number) {
  let x = seed || 1;
  return () => {
    x = Math.imul(48271, x) % 0x7fffffff;
    return x / 0x7fffffff;
  };
}

function pickOutcome(total: number, itemsCount: number): Outcome {
  const seed = makeSessionSeed(total, itemsCount);
  const rnd = prng(seed)();
  const pressure = total + itemsCount * 180;

  if (pressure >= 2600) {
    if (rnd < 0.42) return "regnskap";
    if (rnd < 0.74) return "internbehandling";
    if (rnd < 0.9) return "systemfeil";
    return "teoretisk";
  }

  if (pressure >= 1200) {
    if (rnd < 0.2) return "systemfeil";
    if (rnd < 0.48) return "regnskap";
    if (rnd < 0.77) return "internbehandling";
    if (rnd < 0.9) return "teoretisk";
    return "utsolgt";
  }

  if (pressure >= 500) {
    if (rnd < 0.16) return "systemfeil";
    if (rnd < 0.4) return "teoretisk";
    if (rnd < 0.7) return "utsolgt";
    return "internbehandling";
  }

  if (rnd < 0.14) return "systemfeil";
  if (rnd < 0.42) return "teoretisk";
  if (rnd < 0.78) return "utsolgt";
  return "internbehandling";
}

function outcomeMeta(outcome: Outcome): OutcomeMeta {
  switch (outcome) {
    case "systemfeil":
      return {
        code: "PH-SYS-500",
        title: "Transaksjon avvist av systemet",
        status: "Systemfeil",
        summary:
          "Ordren ble behandlet langt nok til å skape håp, men ikke langt nok til å få konsekvenser.",
        market: "📣 Marked: “Kunden var varm. Systemet var kaldt.”",
        finance: "🧾 Regnskap: “Dette ser dyrt ut uten å bli noe av.”",
        note: "Ordren er registrert som forsøk.",
      };
    case "regnskap":
      return {
        code: "PH-FIN-204",
        title: "Kjøpet ble stoppet av regnskap",
        status: "Regnskapsmessig stans",
        summary:
          "Produktet ble vurdert som salgbart av markedet og uforsvarlig av økonomien. Økonomien vant denne runden.",
        market: "📣 Marked: “Vi var nær.”",
        finance: "🧾 Regnskap: “Nær er også et avvik.”",
        note: "Du eier foreløpig en intensjon.",
      };
    case "teoretisk":
      return {
        code: "PH-THR-208",
        title: "Ordre mottatt i teorien",
        status: "Teoretisk fullført",
        summary:
          "Kjøpet anses gjennomført i et begrenset, ikke-leverbart lag av virkeligheten.",
        market: "📣 Marked: “Dette teller.”",
        finance: "🧾 Regnskap: “Dette teller ikke.”",
        note: "Kvittering kan oppleves mentalt.",
      };
    case "internbehandling":
      return {
        code: "PH-INT-302",
        title: "Ordren er sendt til intern behandling",
        status: "Videresendt",
        summary:
          "Systemet kunne ikke bekrefte produkt, lager eller leveringsvilje, men anså saken som interessant nok til videre intern sirkulasjon.",
        market: "📣 Marked: “Hold kunden varm.”",
        finance: "🧾 Regnskap: “Hold dokumentasjonen kald.”",
        note: "Du vil ikke bli oppdatert fortløpende.",
      };
    default:
      return {
        code: "PH-INV-200",
        title: "Produktet er ikke tilgjengelig",
        status: "Ikke tilgjengelig",
        summary:
          "Produktet var tilgjengelig som idé, pris og kampanje, men ikke som faktisk vare.",
        market: "📣 Marked: “Det viktigste er at trykket er ekte.”",
        finance: "🧾 Regnskap: “Det viktigste er at lageret ikke finnes.”",
        note: "Ordren er registrert uten utsikter.",
      };
  }
}

function makeOrderId(total: number, itemsCount: number) {
  const seed = makeSessionSeed(total, itemsCount);
  const suffix = String(seed % 900000 + 100000);
  return `ORD-PH-${suffix}`;
}

function getSteps(total: number, itemsCount: number): Step[] {
  const highPressure = total >= 1500 || itemsCount >= 4;

  return [
    {
      key: "init",
      title: "Initierer ordrebehandling",
      body: "Bekrefter kjøpsintensjon og grunnleggende betalingsvilje.",
      icon: CreditCard,
      ms: 700,
    },
    {
      key: "payment",
      title: "Validerer betalingsgrunnlag",
      body: "Betalingsvilje autentiseres. Fullføring forblir åpen.",
      icon: CircleDashed,
      ms: 850,
    },
    {
      key: "inventory",
      title: "Validerer lagerstatus",
      body: "Lagerstatus forblir uavklart, men prosessen fortsetter av hensyn til moment.",
      icon: ShieldCheck,
      ms: highPressure ? 1050 : 900,
    },
    {
      key: "freight",
      title: "Avklarer fraktforutsetninger",
      body: "Leveringstid settes til ubestemt og behandles som en oppdatering.",
      icon: Truck,
      ms: 760,
    },
    {
      key: "finance",
      title: "Avstemmer med regnskap",
      body: "Økonomien varsles om kjøpsforsøket og responderer kontrollert.",
      icon: Receipt,
      ms: highPressure ? 1200 : 1000,
    },
    {
      key: "reality",
      title: "Kontakter virkeligheten",
      body: "Virkeligheten svarer ikke tydelig, men innvendingene registreres.",
      icon: TriangleAlert,
      ms: 950,
    },
    {
      key: "decision",
      title: "Finaliserer behandling",
      body: "Ordren nummereres, vurderes og mister gradvis støtte.",
      icon: Zap,
      ms: 880,
    },
  ];
}

function getInitialProgressFor(step: StepKey) {
  switch (step) {
    case "init":
      return 8;
    case "payment":
      return 23;
    case "inventory":
      return 46;
    case "freight":
      return 63;
    case "finance":
      return 79;
    case "reality":
      return 72; // bevisst litt tilbake
    case "decision":
      return 95;
    default:
      return 0;
  }
}

export default function CheckoutGate(props: { total: number; itemsCount: number }) {
  const router = useRouter();
  const { clear } = useCart();
  const ledger = useLedger();
  const voice = useMemo(() => getVoice(), []);

  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>("utsolgt");
  const [phaseLabel, setPhaseLabel] = useState("");
  const [resultVisible, setResultVisible] = useState(false);
  const [shouldClearOnClose, setShouldClearOnClose] = useState(false);

  const steps = useMemo(
    () => getSteps(props.total, props.itemsCount),
    [props.total, props.itemsCount]
  );

  const meta = useMemo(() => outcomeMeta(outcome), [outcome]);

  function resetLocalState() {
    setRunning(false);
    setStepIndex(0);
    setProgress(0);
    setPhaseLabel("");
    setResultVisible(false);
  }

  function closeGate() {
    setOpen(false);
    resetLocalState();

    if (shouldClearOnClose) {
      clear();
      setShouldClearOnClose(false);
    }
  }

  function start() {
    const picked = pickOutcome(props.total, props.itemsCount);
    setOutcome(picked);
    setStepIndex(0);
    setProgress(8);
    setResultVisible(false);
    setRunning(true);
    setPhaseLabel(say(voice, "checkout_init") || "Starter behandling.");
    ledger.append("Kjøpsintensjon registrert", +props.total);
  }

  useEffect(() => {
    if (!open || !running) return;

    if (stepIndex >= steps.length) {
      setPhaseLabel(
        say(voice, "checkout_failure") || "Behandling kan ikke fullføres."
      );
      ledger.append("Kasseavvik oppstått", -props.total);
      ledger.append(meta.note, 0);

      const timer = window.setTimeout(() => {
        setRunning(false);
        setResultVisible(true);
      }, 950);

      return () => window.clearTimeout(timer);
    }

    const current = steps[stepIndex];
    setProgress(getInitialProgressFor(current.key));

    switch (current.key) {
      case "payment":
        setPhaseLabel(
          say(voice, "checkout_validating") || "Validerer kjøpsgrunnlag."
        );
        ledger.append("Betalingsvilje observert", 0);
        break;

      case "inventory":
        setPhaseLabel("Lagerstatus vurderes fortsatt.");
        ledger.append("Lagerstatus forble teoretisk", 0);
        break;

      case "freight":
        setPhaseLabel("Fraktforutsetninger avklares.");
        ledger.append("Fraktforutsetning satt til ubestemt", 0);
        break;

      case "finance":
        setPhaseLabel(
          say(voice, "checkout_conflict") ||
            "Avvik oppdaget mellom marked og regnskap."
        );
        ledger.append("Regnskap varslet om kjøpsforsøk", -2);
        break;

      case "reality":
        setPhaseLabel("Virkelighetskontakt pågår.");
        ledger.append("Virkelighetskontakt mislyktes delvis", -1);
        break;

      case "decision":
        setPhaseLabel("Sluttvurdering gjennomføres.");
        ledger.append("Ordre vurdert uten klar støtte", 0);
        break;

      default:
        break;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((i) => i + 1);
    }, current.ms);

    return () => window.clearTimeout(timer);
  }, [open, running, stepIndex, steps, voice, ledger, meta.note, props.total]);

  function finishToOrderPage() {
    const id = makeOrderId(props.total, props.itemsCount);
    const to =
      `/ordre/${encodeURIComponent(id)}` +
      `?from=kasse` +
      `&code=${encodeURIComponent(meta.code)}` +
      `&items=${encodeURIComponent(String(props.itemsCount))}` +
      `&total=${encodeURIComponent(String(props.total))}` +
      `&outcome=${encodeURIComponent(outcome)}`;

    setShouldClearOnClose(true);
    setOpen(false);
    resetLocalState();
    router.push(to);
  }

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeGate();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shouldClearOnClose]);

  const readyLine =
    say(voice, "checkout_ready") ||
    "Kasse er tilgjengelig. Konsekvenser er fortsatt uavklarte.";

  const runningLine =
    phaseLabel || say(voice, "checkout_running") || "Behandling pågår.";

  const finalLine = say(voice, "final_note") || meta.note;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          resetLocalState();
        }}
        className="mt-4 w-full rounded-xl bg-red-600 px-4 py-3 text-center font-black text-white hover:opacity-90"
      >
        GÅ TIL KASSEN →
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] grid place-items-center p-4">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={closeGate}
            aria-label="Lukk"
          />

          <div className="relative w-[680px] max-w-[96vw] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
            <div className="border-b border-black/10 bg-yellow-300 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black leading-tight">Ordrebehandling</div>
                  <div className="mt-1 text-xs font-semibold opacity-80">
                    {props.itemsCount} varer • Total: {props.total},- • Lagerstatus:
                    uavklart
                  </div>
                </div>

                <button
                  onClick={closeGate}
                  className="rounded-lg border border-black/20 px-3 py-2 text-sm font-black hover:bg-black/5"
                >
                  Lukk
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5">
              {!running && !resultVisible && (
                <>
                  <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                    <div className="text-sm font-black">{readyLine}</div>
                    <div className="mt-1 text-sm opacity-80">
                      Betaling, lager, frakt og virkelighet behandles fortløpende.
                      Fullføring er fortsatt ikke garantert.
                    </div>

                    <div className="mt-4 grid gap-2 text-sm">
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
                        <span className="font-black">allerede hensyntatt</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={start}
                    className="w-full rounded-xl bg-black px-4 py-3 font-black text-white hover:opacity-90"
                  >
                    FULLFØR KJØP →
                  </button>

                  <div className="text-xs opacity-60">
                    📣 Marked: “Bare ett klikk igjen.” 🧾 Regnskap: “Det er nettopp
                    det som bekymrer meg.”
                  </div>
                </>
              )}

              {running && (
                <>
                  <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-black">{runningLine}</div>
                      <div className="inline-flex items-center gap-2 text-xs font-semibold opacity-70">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        live
                      </div>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-black transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-4 space-y-3">
                      {steps.map((s, i) => {
                        const done = i < stepIndex;
                        const active = i === stepIndex;

                        return (
                          <div
                            key={s.key}
                            className={[
                              "flex items-start gap-3 rounded-lg border border-black/10 bg-white px-3 py-3",
                              done ? "opacity-70" : "",
                              active ? "ring-2 ring-black/10" : "",
                            ].join(" ")}
                          >
                            <Icon icon={s.icon} intent={active ? "critical" : "noted"} />
                            <div className="min-w-0">
                              <div className="truncate text-sm font-black">
                                {s.title}
                                {done ? " ✓" : active ? " …" : ""}
                              </div>
                              <div className="mt-0.5 text-xs opacity-70">{s.body}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-black/10 bg-white p-4 text-sm">
                    <div className="text-xs font-black uppercase tracking-wide opacity-60">
                      Intern konflikt
                    </div>
                    <div className="mt-2 space-y-1 opacity-80">
                      <div>📣 Marked: “Kunden er varm. Gjennomfør.”</div>
                      <div>🧾 Regnskap: “Produktets eksistens er ikke bekreftet.”</div>
                      <div>⚖️ System: “Saken holdes åpen inntil videre.”</div>
                    </div>
                  </div>

                  <button
                    onClick={resetLocalState}
                    className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 font-black text-black hover:bg-black/5"
                  >
                    Avbryt behandling
                  </button>
                </>
              )}

              {resultVisible && !running && (
                <>
                  <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-black uppercase tracking-wide opacity-60">
                          Behandlingsresultat
                        </div>
                        <div className="mt-2 text-2xl font-black leading-tight">
                          {meta.title}
                        </div>
                        <div className="mt-2 text-sm opacity-80">{meta.summary}</div>
                      </div>

                      <div className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-white">
                        {meta.status}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-black/10 bg-white p-3">
                        <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
                          Referanse
                        </div>
                        <div className="mt-1 text-sm font-black">{meta.code}</div>
                      </div>
                      <div className="rounded-lg border border-black/10 bg-white p-3">
                        <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
                          Konklusjon
                        </div>
                        <div className="mt-1 text-sm font-black">{finalLine}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-black/10 bg-white p-4 text-sm">
                    <div className="space-y-1 opacity-80">
                      <div>{meta.market}</div>
                      <div>{meta.finance}</div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <button
                      onClick={finishToOrderPage}
                      className="rounded-xl bg-black px-4 py-3 font-black text-white hover:opacity-90"
                    >
                      Se ordredetaljer →
                    </button>
                    <button
                      onClick={start}
                      className="rounded-xl border border-black/20 bg-white px-4 py-3 font-black text-black hover:bg-black/5"
                    >
                      Forsøk igjen
                    </button>
                    <button
                      onClick={closeGate}
                      className="rounded-xl border border-black/20 bg-white px-4 py-3 font-black text-black hover:bg-black/5"
                    >
                      Lukk behandling
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}