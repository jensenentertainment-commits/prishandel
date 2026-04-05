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
  HeartHandshake,
  X,
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
  | "conscience"
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

function makeSessionSeed(total: number, itemsCount: number, conscience: boolean) {
  const now = new Date();
  const cycle = Math.floor(now.getTime() / (1000 * 60 * 41));
  return hashString(`checkout|${cycle}|${total}|${itemsCount}|${conscience ? 1 : 0}`);
}

function prng(seed: number) {
  let x = seed || 1;
  return () => {
    x = Math.imul(48271, x) % 0x7fffffff;
    return x / 0x7fffffff;
  };
}

function pickOutcome(total: number, itemsCount: number, conscience: boolean): Outcome {
  const seed = makeSessionSeed(total, itemsCount, conscience);
  const rnd = prng(seed)();
  const pressure = total + itemsCount * 180 + (conscience ? 120 : 0);

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

function outcomeMeta(outcome: Outcome, conscience: boolean): OutcomeMeta {
  switch (outcome) {
    case "systemfeil":
      return {
        code: conscience ? "PH-SYS-509-C" : "PH-SYS-500",
        title: "Transaksjon avvist av systemet",
        status: "Systemfeil",
        summary:
          "Ordren ble behandlet langt nok til å skape håp, men ikke langt nok til å få konsekvenser.",
        market: "📣 Marked: “Kunden var varm. Systemet var kaldt.”",
        finance: conscience
          ? "🧾 Regnskap: “God samvittighet var lagt til før havari. Det kompliserer saken.”"
          : "🧾 Regnskap: “Dette ser dyrt ut uten å bli noe av.”",
        note: conscience
          ? "Ordren er registrert som forsøk med vedlagt samvittighet."
          : "Ordren er registrert som forsøk.",
      };
    case "regnskap":
      return {
        code: conscience ? "PH-FIN-204-C" : "PH-FIN-204",
        title: "Kjøpet ble stoppet av regnskap",
        status: "Regnskapsmessig stans",
        summary:
          "Produktet ble vurdert som salgbart av markedet og uforsvarlig av økonomien. Økonomien vant denne runden.",
        market: "📣 Marked: “Vi var nær.”",
        finance: conscience
          ? "🧾 Regnskap: “God samvittighet påvirker ikke kostnadsbildet.”"
          : "🧾 Regnskap: “Nær er også et avvik.”",
        note: conscience
          ? "Du eier foreløpig en intensjon med tilhørende følelsesstøtte."
          : "Du eier foreløpig en intensjon.",
      };
    case "teoretisk":
      return {
        code: conscience ? "PH-THR-208-C" : "PH-THR-208",
        title: "Ordre mottatt i teorien",
        status: "Teoretisk fullført",
        summary:
          "Kjøpet anses gjennomført i et begrenset, ikke-leverbart lag av virkeligheten.",
        market: conscience
          ? "📣 Marked: “Dette teller emosjonelt.”"
          : "📣 Marked: “Dette teller.”",
        finance: "🧾 Regnskap: “Dette teller ikke.”",
        note: conscience
          ? "Kvittering kan oppleves mentalt. God samvittighet er registrert."
          : "Kvittering kan oppleves mentalt.",
      };
    case "internbehandling":
      return {
        code: conscience ? "PH-INT-302-C" : "PH-INT-302",
        title: "Ordren er sendt til intern behandling",
        status: "Videresendt",
        summary:
          "Systemet kunne ikke bekrefte produkt, lager eller leveringsvilje, men anså saken som interessant nok til videre intern sirkulasjon.",
        market: "📣 Marked: “Hold kunden varm.”",
        finance: conscience
          ? "🧾 Regnskap: “Hold dokumentasjonen kald. Følelsene kan behandles separat.”"
          : "🧾 Regnskap: “Hold dokumentasjonen kald.”",
        note: conscience
          ? "Du vil ikke bli oppdatert fortløpende, men samvittigheten er notert."
          : "Du vil ikke bli oppdatert fortløpende.",
      };
    default:
      return {
        code: conscience ? "PH-INV-200-C" : "PH-INV-200",
        title: "Produktet er ikke tilgjengelig",
        status: "Ikke tilgjengelig",
        summary:
          "Produktet var tilgjengelig som idé, pris og kampanje, men ikke som faktisk vare.",
        market: "📣 Marked: “Det viktigste er at trykket er ekte.”",
        finance: conscience
          ? "🧾 Regnskap: “Det viktigste er at lageret ikke finnes. Samvittigheten kan beholdes.”"
          : "🧾 Regnskap: “Det viktigste er at lageret ikke finnes.”",
        note: conscience
          ? "Ordren er registrert uten utsikter, men med dokumentert omtanke."
          : "Ordren er registrert uten utsikter.",
      };
  }
}

function makeOrderId(total: number, itemsCount: number, conscience: boolean) {
  const seed = makeSessionSeed(total, itemsCount, conscience);
  const suffix = String((seed % 900000) + 100000);
  return `ORD-PH-${suffix}`;
}

function getSteps(total: number, itemsCount: number, conscience: boolean): Step[] {
  const highPressure = total >= 1500 || itemsCount >= 4;

  return [
    {
      key: "init",
      title: "Initierer ordrebehandling",
      body: "Bekrefter kjøpsintensjon og grunnleggende betalingsvilje.",
      icon: CreditCard,
      ms: 650,
    },
    ...(conscience
      ? [
          {
            key: "conscience" as const,
            title: "Registrerer god samvittighet",
            body: "Emosjonell avlastning loggføres uten å påvirke varegrunnlaget.",
            icon: HeartHandshake,
            ms: 760,
          },
        ]
      : []),
    {
      key: "payment",
      title: "Validerer betalingsgrunnlag",
      body: "Betalingsvilje autentiseres. Fullføring forblir åpen.",
      icon: CircleDashed,
      ms: 780,
    },
    {
      key: "inventory",
      title: "Validerer lagerstatus",
      body: "Lagerstatus forblir uavklart, men prosessen fortsetter av hensyn til moment.",
      icon: ShieldCheck,
      ms: highPressure ? 980 : 860,
    },
    {
      key: "freight",
      title: "Avklarer fraktforutsetninger",
      body: "Leveringstid settes til ubestemt og behandles som en oppdatering.",
      icon: Truck,
      ms: 720,
    },
    {
      key: "finance",
      title: "Avstemmer med regnskap",
      body: "Økonomien varsles om kjøpsforsøket og responderer kontrollert.",
      icon: Receipt,
      ms: highPressure ? 1120 : 920,
    },
    {
      key: "reality",
      title: "Kontakter virkeligheten",
      body: "Virkeligheten svarer ikke tydelig, men innvendingene registreres.",
      icon: TriangleAlert,
      ms: 860,
    },
    {
      key: "decision",
      title: "Finaliserer behandling",
      body: "Ordren nummereres, vurderes og mister gradvis støtte.",
      icon: Zap,
      ms: 820,
    },
  ];
}

function getInitialProgressFor(step: StepKey) {
  switch (step) {
    case "init":
      return 8;
    case "conscience":
      return 16;
    case "payment":
      return 28;
    case "inventory":
      return 46;
    case "freight":
      return 61;
    case "finance":
      return 76;
    case "reality":
      return 87;
    case "decision":
      return 95;
    default:
      return 0;
  }
}

function MoneyRow(props: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="opacity-70">{props.label}</span>
      <span className={props.strong ? "font-black" : "font-semibold"}>{props.value}</span>
    </div>
  );
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
  const [conscience, setConscience] = useState(false);

  const consciencePrice = 49;
  const displayTotal = props.total + (conscience ? consciencePrice : 0);

  const steps = useMemo(
    () => getSteps(displayTotal, props.itemsCount, conscience),
    [displayTotal, props.itemsCount, conscience]
  );

  const meta = useMemo(() => outcomeMeta(outcome, conscience), [outcome, conscience]);

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
    const picked = pickOutcome(displayTotal, props.itemsCount, conscience);
    setOutcome(picked);
    setStepIndex(0);
    setProgress(8);
    setResultVisible(false);
    setRunning(true);
    setPhaseLabel(say(voice, "checkout_init") || "Starter behandling.");
    ledger.append("Kjøpsintensjon registrert", +displayTotal);

    if (conscience) {
      ledger.append("God samvittighet lagt til", +consciencePrice);
    }
  }

  useEffect(() => {
    if (!open || !running) return;

    if (stepIndex >= steps.length) {
      setProgress(100);
      setPhaseLabel(say(voice, "checkout_failure") || "Behandling kan ikke fullføres.");
      ledger.append("Kasseavvik oppstått", -displayTotal);
      ledger.append(meta.note, 0);

      const timer = window.setTimeout(() => {
        setRunning(false);
        setResultVisible(true);
      }, 800);

      return () => window.clearTimeout(timer);
    }

    const current = steps[stepIndex];
    setProgress(getInitialProgressFor(current.key));

    switch (current.key) {
      case "conscience":
        setPhaseLabel("Dokumenterer god samvittighet.");
        ledger.append("Opplevd ansvar registrert", 0);
        break;
      case "payment":
        setPhaseLabel(say(voice, "checkout_validating") || "Validerer kjøpsgrunnlag.");
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
          say(voice, "checkout_conflict") || "Avvik oppdaget mellom marked og regnskap."
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
  }, [open, running, stepIndex, steps, voice, ledger, meta.note, displayTotal]);

  function finishToOrderPage() {
    const id = makeOrderId(displayTotal, props.itemsCount, conscience);
    const to =
      `/ordre/${encodeURIComponent(id)}` +
      `?from=kasse` +
      `&code=${encodeURIComponent(meta.code)}` +
      `&items=${encodeURIComponent(String(props.itemsCount))}` +
      `&total=${encodeURIComponent(String(displayTotal))}` +
      `&outcome=${encodeURIComponent(outcome)}` +
      `&conscience=${encodeURIComponent(String(conscience))}`;

    setShouldClearOnClose(true);
    setOpen(false);
    resetLocalState();
    router.push(to);
  }

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGate();
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
        <div className="fixed inset-0 z-[90] p-3 sm:p-4">
          <button
            className="absolute inset-0 bg-black/55"
            onClick={closeGate}
            aria-label="Lukk"
          />

          <div className="relative mx-auto flex h-[calc(100dvh-24px)] max-h-[920px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl sm:h-auto sm:max-h-[90vh]">
            <div className="border-b border-black/10 bg-yellow-300 px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-black leading-tight">Ordrebehandling</div>
                  <div className="mt-1 text-xs font-semibold opacity-80 sm:text-sm">
                    {props.itemsCount} varer • Total: {displayTotal},- • Lagerstatus: uavklart
                  </div>
                </div>

                <button
                  onClick={closeGate}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/20 bg-white/50 hover:bg-black/5"
                  aria-label="Lukk behandling"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="space-y-4">
                {!running && !resultVisible && (
                  <>
                    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                      <div className="text-sm font-black sm:text-base">{readyLine}</div>
                      <div className="mt-1 text-sm leading-relaxed opacity-80">
                        Betaling, lager, frakt og virkelighet behandles fortløpende.
                        Fullføring er fortsatt ikke garantert.
                      </div>

                      <div className="mt-4 space-y-2">
                        <MoneyRow label="Delsum" value={`${props.total},-`} />
                        <MoneyRow label="Frakt" value="ubestemt" />
                        <MoneyRow label="Rabatt" value="allerede hensyntatt" />
                        <MoneyRow
                          label="God samvittighet"
                          value={conscience ? `+${consciencePrice},-` : "ikke lagt til"}
                        />
                        <div className="border-t border-black/10 pt-2">
                          <MoneyRow
                            label="Sum å forholde seg til"
                            value={`${displayTotal},-`}
                            strong
                          />
                        </div>
                      </div>
                    </div>

                    <label className="block cursor-pointer rounded-2xl border border-black/10 bg-white p-4 transition hover:bg-black/[0.02]">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-xl bg-black p-2 text-yellow-300">
                          <HeartHandshake className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="text-sm font-black sm:text-base">
                                Legg til god samvittighet
                              </div>
                              <div className="mt-1 text-sm leading-relaxed opacity-75">
                                Klimakompensert følelse. Ingen operasjonelle endringer.
                              </div>
                            </div>

                            <div className="shrink-0 rounded-lg bg-yellow-300 px-2 py-1 text-xs font-black uppercase tracking-wide text-black">
                              +49,-
                            </div>
                          </div>

                          <div className="mt-3 flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={conscience}
                              onChange={(e) => setConscience(e.target.checked)}
                              className="mt-1 h-4 w-4 accent-black"
                            />
                            <div className="text-sm leading-relaxed opacity-75">
                              Jeg ønsker å redusere opplevd belastning uten å påvirke
                              produkt, frakt, lager eller faktisk konsekvens.
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>

                    <button
                      onClick={start}
                      className="w-full rounded-xl bg-black px-4 py-3 font-black text-white hover:opacity-90"
                    >
                      FULLFØR KJØP →
                    </button>

                    <div className="rounded-xl border border-black/10 bg-white p-4 text-sm">
                      <div className="text-xs font-black uppercase tracking-wide opacity-60">
                        Intern konflikt
                      </div>
                      <div className="mt-2 space-y-1 opacity-80">
                        <div>📣 Marked: “Bare ett klikk igjen.”</div>
                        <div>🧾 Regnskap: “Det er nettopp det som bekymrer meg.”</div>
                        {conscience && (
                          <div>🫶 Samvittighet: “Jeg er lagt til, ikke avklart.”</div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {running && (
                  <>
                    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 text-sm font-black sm:text-base">
                          {runningLine}
                        </div>
                        <div className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold opacity-70">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          behandling
                        </div>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10">
                        <div
                          className="h-full rounded-full bg-black transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-wide opacity-55">
                        <span>Ordrebehandling</span>
                        <span>{Math.round(progress)}%</span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {steps.map((s, i) => {
                          const done = i < stepIndex;
                          const active = i === stepIndex;

                          return (
                            <div
                              key={s.key}
                              className={[
                                "flex items-start gap-3 rounded-xl border border-black/10 bg-white px-3 py-3",
                                done ? "opacity-70" : "",
                                active ? "ring-2 ring-black/10" : "",
                              ].join(" ")}
                            >
                              <Icon icon={s.icon} intent={active ? "critical" : "noted"} />
                              <div className="min-w-0">
                                <div className="text-sm font-black leading-tight">
                                  {s.title}
                                  {done ? " ✓" : active ? " …" : ""}
                                </div>
                                <div className="mt-0.5 text-xs leading-relaxed opacity-70">
                                  {s.body}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm">
                      <div className="text-xs font-black uppercase tracking-wide opacity-60">
                        Intern konflikt
                      </div>
                      <div className="mt-2 space-y-1 opacity-80">
                        <div>📣 Marked: “Kunden er varm. Gjennomfør.”</div>
                        <div>🧾 Regnskap: “Produktets eksistens er ikke bekreftet.”</div>
                        {conscience && (
                          <div>🫶 Samvittighet: “Opplevd ansvar er registrert separat.”</div>
                        )}
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
                    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="text-xs font-black uppercase tracking-wide opacity-60">
                            Behandlingsresultat
                          </div>
                          <div className="mt-2 text-xl font-black leading-tight sm:text-2xl">
                            {meta.title}
                          </div>
                          <div className="mt-2 text-sm leading-relaxed opacity-80">
                            {meta.summary}
                          </div>
                        </div>

                        <div className="shrink-0 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-white">
                          {meta.status}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-black/10 bg-white p-3">
                          <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
                            Referanse
                          </div>
                          <div className="mt-1 text-sm font-black">{meta.code}</div>
                        </div>

                        <div className="rounded-xl border border-black/10 bg-white p-3">
                          <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
                            Konklusjon
                          </div>
                          <div className="mt-1 text-sm font-black">{finalLine}</div>
                        </div>
                      </div>

                      {conscience && (
                        <div className="mt-3 rounded-xl border border-black/10 bg-yellow-50 p-3 text-sm">
                          <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
                            Tillegg registrert
                          </div>
                          <div className="mt-1 font-semibold">
                            God samvittighet ble lagt til ordren uten at utfallet lot seg
                            forbedre.
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm">
                      <div className="space-y-1 opacity-80">
                        <div>{meta.market}</div>
                        <div>{meta.finance}</div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
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
        </div>
      )}
    </>
  );
}