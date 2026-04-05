import Link from "next/link";
import { notFound } from "next/navigation";

type Outcome =
  | "utsolgt"
  | "systemfeil"
  | "regnskap"
  | "teoretisk"
  | "internbehandling";

type Order = {
  id: string;
  outcome: Outcome;
  title: string;
  status: string;
  statusTone: "red" | "yellow" | "black";
  summary: string;
  handler: string;
  payment: string;
  delivery: string;
  created: string;

  from?: string;
  code?: string;
  items?: string;
  total?: string;
  conscience?: boolean;

  ref: string;
  sys: string;
  prh: string;
  caseType: string;
  severity: string;
  processingLevel: string;
  marketLine: string;
  financeLine: string;
  finalNote: string;
  metrics: {
    pressure: number;
    support: number;
    reality: number;
  };
};

function isValidOrderId(id: string) {
  const clean = id.trim().toUpperCase();
  return /^ORD-PH-\d{6}$/.test(clean) || /^PRH-\d{4}$/.test(clean);
}

function hashCode(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickFrom<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length];
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function getOutcomeCopy(outcome: Outcome, conscience: boolean) {
  switch (outcome) {
    case "systemfeil":
      return {
        title: "Ordren stoppet i systemet",
        status: "Systemfeil",
        statusTone: "red" as const,
        summary:
          "Bestillingen ble behandlet langt nok til å skape håp, men ikke langt nok til å skape vareflyt.",
        handler: "System og regnskap",
        payment: "Avvist av mellomlag (midlertidig)",
        delivery: "Ikke opprettet",
        caseType: "Teknisk handelsavvik",
        severity: "Betydelig",
        processingLevel: "Utvidet administrativt",
        marketLine: "📣 Marked: “Kunden var varm. Systemet var kaldt.”",
        financeLine: conscience
          ? "🧾 Regnskap: “God samvittighet ble registrert før havari. Det kompliserer avslutningen.”"
          : "🧾 Regnskap: “Dette ser dyrt ut uten å bli noe av.”",
        finalNote: conscience
          ? "Ordren er registrert som forsøk med vedlagt samvittighet."
          : "Ordren er registrert som forsøk.",
      };
    case "regnskap":
      return {
        title: "Ordren ble stoppet av regnskap",
        status: "Regnskapsmessig stans",
        statusTone: "black" as const,
        summary:
          "Produktet ble vurdert som salgbart av markedet og uforsvarlig av økonomien. Økonomien vant denne runden.",
        handler: "Regnskap",
        payment: "Avvist etter intern vurdering",
        delivery: "Stanset før opprettelse",
        caseType: "Økonomisk handelsinnstramming",
        severity: "Moderat til betydelig",
        processingLevel: "Administrativt utvidet",
        marketLine: "📣 Marked: “Vi var nær.”",
        financeLine: conscience
          ? "🧾 Regnskap: “God samvittighet påvirker ikke kostnadsbildet.”"
          : "🧾 Regnskap: “Nær er også et avvik.”",
        finalNote: conscience
          ? "Du eier foreløpig en intensjon med tilhørende følelsesstøtte."
          : "Du eier foreløpig en intensjon.",
      };
    case "teoretisk":
      return {
        title: "Ordren er fullført i teorien",
        status: "Teoretisk fullført",
        statusTone: "yellow" as const,
        summary:
          "Kjøpet anses gjennomført i et begrenset, ikke-leverbart lag av virkeligheten.",
        handler: "Administrativ tolkning",
        payment: "Godkjent i teorien",
        delivery: "Mentalt mulig",
        caseType: "Teoretisk ordreoppfyllelse",
        severity: "Lav til moderat",
        processingLevel: "Teoretisk",
        marketLine: conscience
          ? "📣 Marked: “Dette teller emosjonelt.”"
          : "📣 Marked: “Dette teller.”",
        financeLine: "🧾 Regnskap: “Dette teller ikke.”",
        finalNote: conscience
          ? "Kvittering kan oppleves mentalt. God samvittighet er registrert."
          : "Kvittering kan oppleves mentalt.",
      };
    case "internbehandling":
      return {
        title: "Ordren er sendt til intern behandling",
        status: "Videresendt",
        statusTone: "black" as const,
        summary:
          "Systemet kunne ikke bekrefte produkt, lager eller leveringsvilje, men anså saken som interessant nok til videre intern sirkulasjon.",
        handler: "Intern behandling",
        payment: "Åpen vurdering",
        delivery: "Under vurdering",
        caseType: "Administrativ etterbehandling",
        severity: "Moderat",
        processingLevel: "Administrativt",
        marketLine: "📣 Marked: “Hold kunden varm.”",
        financeLine: conscience
          ? "🧾 Regnskap: “Hold dokumentasjonen kald. Følelsene kan behandles separat.”"
          : "🧾 Regnskap: “Hold dokumentasjonen kald.”",
        finalNote: conscience
          ? "Du vil ikke bli oppdatert fortløpende, men samvittigheten er notert."
          : "Du vil ikke bli oppdatert fortløpende.",
      };
    default:
      return {
        title: "Produktet var ikke faktisk tilgjengelig",
        status: "Ikke tilgjengelig",
        statusTone: "red" as const,
        summary:
          "Produktet var tilgjengelig som idé, pris og kampanje, men ikke som faktisk vare.",
        handler: "Lager og marked",
        payment: "Ikke utløst",
        delivery: "Ikke aktuelt",
        caseType: "Tilgjengelighetsavvik",
        severity: "Lav til moderat",
        processingLevel: "Registrert",
        marketLine: "📣 Marked: “Det viktigste er at trykket er ekte.”",
        financeLine: conscience
          ? "🧾 Regnskap: “Det viktigste er at lageret ikke finnes. Samvittigheten kan beholdes.”"
          : "🧾 Regnskap: “Det viktigste er at lageret ikke finnes.”",
        finalNote: conscience
          ? "Ordren er registrert uten utsikter, men med dokumentert omtanke."
          : "Ordren er registrert uten utsikter.",
      };
  }
}

function fakeOrder(
  id: string,
  sp?: Record<string, string | string[] | undefined>
): Order | null {
  const clean = (id ?? "").trim().toUpperCase();
  if (!isValidOrderId(clean)) return null;

  const get = (k: string) => {
    const v = sp?.[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const h = hashCode(clean);

  const queryOutcome = get("outcome");
  const conscience = get("conscience") === "true";

  const derivedOutcome: Outcome = pickFrom(
    ["utsolgt", "internbehandling", "teoretisk", "regnskap", "systemfeil"],
    h
  );

  const outcome: Outcome =
    queryOutcome === "utsolgt" ||
    queryOutcome === "systemfeil" ||
    queryOutcome === "regnskap" ||
    queryOutcome === "teoretisk" ||
    queryOutcome === "internbehandling"
      ? queryOutcome
      : derivedOutcome;

  const copy = getOutcomeCopy(outcome, conscience);

  const n1 = String(h).padStart(6, "0");
  const n2 = String(h * 3).padStart(6, "0");
  const n3 = String(h * 7).padStart(6, "0");

  const from = get("from") ?? "kasse";
  const code = get("code") ?? `PH-${n1.slice(-4)}`;
  const items = get("items") ?? `${(h % 3) + 1}`;
  const total = get("total") ?? `${((h % 9) + 1) * 100}`;

  const basePressure =
    outcome === "systemfeil"
      ? 94
      : outcome === "regnskap"
      ? 87
      : outcome === "teoretisk"
      ? 72
      : outcome === "internbehandling"
      ? 79
      : 83;

  const baseSupport =
    outcome === "systemfeil"
      ? 24
      : outcome === "regnskap"
      ? 31
      : outcome === "teoretisk"
      ? 66
      : outcome === "internbehandling"
      ? 44
      : 28;

  const baseReality =
    outcome === "systemfeil"
      ? 6
      : outcome === "regnskap"
      ? 11
      : outcome === "teoretisk"
      ? 21
      : outcome === "internbehandling"
      ? 15
      : 4;

  return {
    id: clean,
    outcome,
    title: copy.title,
    status: copy.status,
    statusTone: copy.statusTone,
    summary: copy.summary,
    handler: copy.handler,
    payment: copy.payment,
    delivery: copy.delivery,
    created: "Registrert nylig",
    ref: `REF-${n1.slice(0, 3)}-${n2.slice(-3)}`,
    sys: `SYS-${n2.slice(1, 5)}`,
    prh: `PRH-${clean.replace(/[^0-9]/g, "").slice(0, 2) || "00"}-${n3.slice(-3)}`,
    caseType: copy.caseType,
    severity: copy.severity,
    processingLevel: copy.processingLevel,
    from,
    code,
    items,
    total,
    conscience,
    marketLine: copy.marketLine,
    financeLine: copy.financeLine,
    finalNote: copy.finalNote,
    metrics: {
      pressure: clamp(basePressure + (h % 5) - 2, 0, 100),
      support: clamp(baseSupport + ((h >> 2) % 7) - 3, 0, 100),
      reality: clamp(baseReality + ((h >> 3) % 5) - 2, 0, 100),
    },
  };
}

function logLines(order: Order) {
  const lines = [
    "Registrert i systemet",
    `Tildelt behandling: ${order.handler}`,
  ];

  if (order.conscience) {
    lines.push("God samvittighet registrert som tillegg uten operasjonell virkning");
  }

  switch (order.outcome) {
    case "systemfeil":
      lines.push("Overført til mellomlag for foreløpig avvisning");
      lines.push("Videre behandling avventer administrativ ro");
      break;
    case "regnskap":
      lines.push("Overført til økonomisk vurdering");
      lines.push("Kjøpsforsøket ble stoppet før vareløfte kunne oppstå");
      break;
    case "teoretisk":
      lines.push("Ordren ble godkjent i et begrenset teoretisk lag");
      lines.push("Leveringsgrunnlag ble ikke opprettet");
      break;
    case "internbehandling":
      lines.push("Saken ble videresendt til intern sirkulasjon");
      lines.push("Oppdatering anses ikke som nødvendig på nåværende tidspunkt");
      break;
    default:
      lines.push("Tilgjengelighet ble testet mot antagelser");
      lines.push("Varegrunnlag kunne ikke bekreftes");
      break;
  }

  return lines;
}

function statusToneClasses(tone: Order["statusTone"]) {
  if (tone === "red") return "bg-red-600 text-white";
  if (tone === "yellow") return "bg-yellow-300 text-black";
  return "bg-black text-yellow-300";
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = searchParams ? await searchParams : undefined;

  const order = fakeOrder(id, sp);
  if (!order) notFound();

  const logs = logLines(order);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
        <div className="bg-black px-5 py-5 text-white sm:px-6 sm:py-6">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300">
            Behandlingsresultat
          </div>

          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">
                {order.title}
              </h1>
              <div className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                {order.summary}
              </div>
            </div>

            <div
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide ${statusToneClasses(
                order.statusTone
              )}`}
            >
              {order.status}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide">
            <span className="rounded bg-white/10 px-2 py-1 text-white">
              {order.id}
            </span>
            <span className="rounded bg-white/10 px-2 py-1 text-white">
              {order.code}
            </span>
            <span className="rounded bg-white/10 px-2 py-1 text-white">
              {order.processingLevel}
            </span>
            {order.conscience && (
              <span className="rounded bg-yellow-300 px-2 py-1 text-black">
                God samvittighet registrert
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section className="rounded-2xl border border-black/10 bg-yellow-50 p-4 sm:p-5">
            <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
              Konklusjon
            </div>
            <div className="mt-2 text-xl font-black leading-tight sm:text-2xl">
              {order.finalNote}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <MetricCard
                label="Prispress"
                value={`${order.metrics.pressure}%`}
                note="Opprettholdt"
              />
              <MetricCard
                label="Intern støtte"
                value={`${order.metrics.support}%`}
                note="Begrenset"
              />
              <MetricCard
                label="Faktisk virkelighet"
                value={`${order.metrics.reality}%`}
                note="Svak"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-2xl border border-black/10 bg-neutral-50 p-4 sm:p-5">
              <div className="text-xs font-black uppercase tracking-wide opacity-60">
                Ordreoversikt
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Meta label="Ordrenummer" value={order.id} />
                <Meta label="Status" value={order.status} />
                <Meta label="Behandles av" value={order.handler} />
                <Meta label="Betaling" value={order.payment} />
                <Meta label="Forventet levering" value={order.delivery} />
                <Meta label="Tidspunkt" value={order.created} />
                <Meta label="Kilde" value={order.from ?? "ukjent"} />
                <Meta
                  label="Total"
                  value={order.total ? `${order.total},-` : "uberegnet"}
                />
                <Meta label="Antall varer" value={order.items ?? "0"} />
                <Meta
                  label="God samvittighet"
                  value={order.conscience ? "Lagt til" : "Ikke lagt til"}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
              <div className="text-xs font-black uppercase tracking-wide opacity-60">
                Saksdetaljer
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Meta label="Referanse" value={order.ref} />
                <Meta label="Systemkode" value={order.sys} />
                <Meta label="PRH-nøkkel" value={order.prh} />
                <Meta label="Sakstype" value={order.caseType} />
                <Meta label="Alvorlighetsgrad" value={order.severity} />
                <Meta label="Behandlingsnivå" value={order.processingLevel} />
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
            <div className="text-xs font-black uppercase tracking-wide opacity-60">
              Intern vurdering
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm leading-relaxed">
              <div>{order.marketLine}</div>
              <div className="mt-1">{order.financeLine}</div>
            </div>
          </section>

          <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
            <div className="text-xs font-black uppercase tracking-wide opacity-60">
              Behandlingslogg
            </div>

            <ul className="mt-4 space-y-3 text-sm">
              {logs.map((line, index) => (
                <li key={index} className="flex gap-3">
                  <span className="w-16 shrink-0 text-[11px] font-black uppercase tracking-wide opacity-45">
                    T+0{index}
                  </span>
                  <span className="leading-relaxed opacity-80">{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-xs leading-relaxed opacity-60">
              Loggen viser et utvalg av hendelser. Øvrige hendelser kan være utelatt
              av hensyn til systemro, ansvarsflyt og intern lesbarhet.
            </div>
          </section>

          <section className="rounded-2xl border border-black/10 bg-neutral-50 p-4 sm:p-5">
            <div className="text-xs font-black uppercase tracking-wide opacity-60">
              Videre løp
            </div>
            <div className="mt-3 space-y-2 text-sm leading-relaxed opacity-80">
              <p>
                Ordren din er registrert i systemet og vurderes fortløpende.
                Vurderingen foretas administrativt i samråd med tilgjengelige forhold.
              </p>
              <p>Det kreves ingen handling fra din side på nåværende tidspunkt.</p>
              {order.conscience && (
                <p>
                  Tillegget “god samvittighet” er registrert separat og påvirker ikke
                  varegrunnlag, levering eller faktisk konsekvens.
                </p>
              )}
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href={`/sporing/${encodeURIComponent(order.id)}`}
              className="rounded-xl bg-black px-5 py-3 text-center font-black text-white hover:opacity-90"
            >
              Spor pakke →
            </Link>
            <Link
              href="/kampanjer"
              className="rounded-xl bg-red-600 px-5 py-3 text-center font-black text-white hover:opacity-90"
            >
              Se flere tilbud →
            </Link>
            <Link
              href="/kundeservice"
              className="rounded-xl border border-black/20 bg-white px-5 py-3 text-center font-black text-black hover:bg-black/5"
            >
              Kontakt kundeservice
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Meta(props: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-3">
      <div className="text-[11px] font-black uppercase tracking-wide opacity-45">
        {props.label}
      </div>
      <div className="mt-1 text-sm font-black leading-relaxed">{props.value}</div>
    </div>
  );
}

function MetricCard(props: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-[11px] font-black uppercase tracking-wide opacity-45">
        {props.label}
      </div>
      <div className="mt-2 text-2xl font-black">{props.value}</div>
      <div className="mt-1 text-sm opacity-70">{props.note}</div>
    </div>
  );
}