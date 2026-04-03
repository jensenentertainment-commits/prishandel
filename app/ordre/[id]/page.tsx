import Link from "next/link";
import { notFound } from "next/navigation";

type Outcome = "normal" | "systemfeil";

type Order = {
  id: string;
  outcome: Outcome;
  status: string;
  handler: string;
  payment: string;
  delivery: string;
  created: string;
  ref: string;
  sys: string;
  prh: string;
  caseType: string;
  severity: string;
  processingLevel: string;

  from?: string;
  code?: string;
  items?: string;
  total?: string;
};

function isValidOrderId(id: string) {
  return /^PRH-\d{4}$/i.test(id.trim());
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
  const derivedOutcome: Outcome = h % 5 === 0 || h % 7 === 0 ? "systemfeil" : "normal";
  const outcome: Outcome =
    queryOutcome === "systemfeil" || queryOutcome === "normal"
      ? queryOutcome
      : derivedOutcome;

  const payment =
    outcome === "systemfeil"
      ? "Avvist av mellomlag (midlertidig)"
      : "Godkjent i teorien";

  const status =
    outcome === "systemfeil"
      ? "Avventer manuell tolkning"
      : "Behandles (mentalt)";

  const delivery =
    outcome === "systemfeil"
      ? "Under vurdering"
      : pickFrom(["Ubestemt", "Avklart tidligere", "Under vurdering"], h);

  const handler =
    outcome === "systemfeil"
      ? "Regnskap"
      : pickFrom(
          ["Markedsavdelingen", "Kundeservice", "Virkeligheten", "Regnskap"],
          Math.floor(h / 3)
        );

  const severity =
    outcome === "systemfeil"
      ? "Betydelig"
      : pickFrom(["Lav", "Moderat", "Lav"], Math.floor(h / 5));

  const caseType = pickFrom(
    [
      "Handelsrelatert vurdering",
      "Administrativ avklaring",
      "Kundemessig etterbehandling",
      "Intern salgsoppfølging",
    ],
    Math.floor(h / 7)
  );

  const processingLevel =
    outcome === "systemfeil" ? "Utvidet administrativt" : "Administrativt";

  const n1 = String(h).padStart(6, "0");
  const n2 = String(h * 3).padStart(6, "0");
  const n3 = String(h * 7).padStart(6, "0");

  const from = get("from") ?? "register";
  const code = get("code") ?? `IKKE-${n1.slice(-4)}`;
  const items = get("items") ?? `${(h % 3) + 1}`;
  const total = get("total") ?? `${(h % 9) * 100}`;

  return {
    id: clean,
    outcome,
    status,
    handler,
    payment,
    delivery,
    created: "Registrert nylig",
    ref: `REF-${n1.slice(0, 3)}-${n2.slice(-3)}`,
    sys: `SYS-${n2.slice(1, 5)}`,
    prh: `PRH-${clean.slice(4, 6)}-${n3.slice(-3)}`,
    caseType,
    severity,
    processingLevel,
    from,
    code,
    items,
    total,
  };
}

function logLines(order: Order) {
  if (order.outcome === "systemfeil") {
    return [
      "Registrert i systemet",
      "Overført til mellomlag for foreløpig avvisning",
      "Sendt til manuell tolkning",
      "Videre behandling avventer administrativ ro",
    ];
  }

  return [
    "Registrert i systemet",
    `Tildelt avdeling: ${order.handler}`,
    "Vurdering initiert uten bindende frist",
    "Foreløpig avklaring opprettet",
  ];
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
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="bg-black px-6 py-5 text-white">
          <div className="text-sm font-black uppercase tracking-wide text-yellow-300">
            Ordre registrert
          </div>
          <h1 className="mt-1 text-2xl font-black">Takk for bestillingen*</h1>
          <div className="mt-1 text-sm text-white/80">
            * bestillingen kan avvike fra virkeligheten
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Meta label="Ordrenummer" value={order.id} />
            <Meta label="Status" value={order.status} />
            <Meta label="Behandles av" value={order.handler} />
            <Meta label="Betaling" value={order.payment} />
            <Meta label="Forventet levering" value={order.delivery} />
            <Meta label="Tidspunkt" value={order.created} />

            <Meta label="Kilde" value={order.from ?? "ukjent"} />
            <Meta label="Bekreftelseskode" value={order.code ?? "ikke utstedt"} />
            <Meta label="Antall varer" value={order.items ?? "0"} />
            <Meta label="Total" value={order.total ? `${order.total},-` : "uberegnet"} />
          </div>

          <div className="h-px bg-black/10" />

          <div className="space-y-2">
            <div className="font-black">Saksdetaljer</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Meta label="Referanse" value={order.ref} />
              <Meta label="Systemkode" value={order.sys} />
              <Meta label="PRH-nøkkel" value={order.prh} />
              <Meta label="Sakstype" value={order.caseType} />
              <Meta label="Alvorlighetsgrad" value={order.severity} />
              <Meta label="Behandlingsnivå" value={order.processingLevel} />
            </div>
          </div>

          <div className="h-px bg-black/10" />

          <div className="space-y-2">
            <div className="font-black">Behandlingslogg</div>
            <ul className="space-y-2 text-sm">
              {logs.map((line, index) => (
                <li key={index} className="flex gap-3">
                  <span className="w-20 text-xs font-semibold opacity-60">
                    T+0{index}
                  </span>
                  <span className="opacity-80">{line}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs opacity-60">
              Loggen viser et utvalg av hendelser. Øvrige hendelser kan være utelatt
              av hensyn til systemro.
            </div>
          </div>

          <div className="h-px bg-black/10" />

          <div className="space-y-2">
            <div className="font-black">Hva skjer nå?</div>
            <p className="text-sm opacity-80">
              Ordren din er registrert i systemet og vurderes fortløpende. Vurderingen
              foretas administrativt i samråd med tilgjengelige forhold.
            </p>
            <p className="text-sm opacity-80">
              Det kreves ingen handling fra din side på nåværende tidspunkt.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/sporing/${encodeURIComponent(order.id)}`}
              className="rounded-lg bg-black px-5 py-3 font-black text-white hover:opacity-90"
            >
              Spor pakke →
            </Link>
            <Link
              href="/kampanjer"
              className="rounded-lg bg-red-600 px-5 py-3 font-black text-white hover:opacity-90"
            >
              Se flere tilbud →
            </Link>
            <Link
              href="/kundeservice"
              className="rounded-lg border border-black/20 bg-white px-5 py-3 font-black text-black hover:bg-black/5"
            >
              Kontakt kundeservice
            </Link>
          </div>

          <div className="pt-2 text-xs opacity-60">
            🧾 Regnskap: “Denne ordren er notert.” <br />
            📣 Marked: “Denne ordren er registrert som relevant.”
          </div>
        </div>
      </div>
    </main>
  );
}

function Meta(props: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold opacity-60">{props.label}</div>
      <div className="font-black">{props.value}</div>
    </div>
  );
}