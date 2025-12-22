// app/ordre/[id]/page.tsx
import { notFound } from "next/navigation";

type Order = {
  id: string;
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


  // “telemetri” fra checkout
  from?: string;
  code?: string;
  items?: string;
  total?: string;
  outcome?: string;
};

function fakeOrder(id: string, sp?: Record<string, string | string[] | undefined>): Order | null {
  const clean = (id ?? "").trim();
  if (!clean) return null;

  const pick = (k: string) => {
    const v = sp?.[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const outcome = pick("outcome");
  const payment =
    outcome === "systemfeil"
      ? "Avvist av mellomlag (midlertidig)"
      : "Godkjent i teorien";

  const status =
    outcome === "systemfeil"
      ? "Avventer manuell tolkning"
      : "Behandles (mentalt)";

  return {
    id: clean,
    status,
    handler: "Markedsavdelingen",
    payment,
    delivery: "Ubestemt",
    created: "Nettopp",
    ref: `REF-${clean.slice(0, 4).toUpperCase()}-${clean.length}7`,
    sys: `SYS-${clean.slice(-4).toUpperCase()}-${clean.length}3`,
    prh: `PRH-${clean.slice(0, 2).toUpperCase()}-${clean.slice(-2).toUpperCase()}`,
    caseType: "Handelsrelatert vurdering",
    severity: outcome === "systemfeil" ? "Betydelig" : "Moderat",

    from: pick("from") ?? undefined,
    code: pick("code") ?? undefined,
    items: pick("items") ?? undefined,
    total: pick("total") ?? undefined,
    outcome: outcome ?? undefined,
  };
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
  

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="bg-green-600 text-white px-6 py-5">
          <div className="text-sm font-black uppercase tracking-wide">Ordre mottatt</div>
          <h1 className="mt-1 text-2xl font-black">Takk for bestillingen*</h1>
          <div className="mt-1 text-sm opacity-90">
            *bestillingen kan avvike fra virkeligheten
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* ORDER META */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Meta label="Ordrenummer" value={order.id} />
            <Meta label="Status" value={order.status} />
            <Meta label="Behandles av" value={order.handler} />
            <Meta label="Betaling" value={order.payment} />
            <Meta label="Forventet levering" value={order.delivery} />
            <Meta label="Tidspunkt" value={order.created} />

            {/* “føles ekte” felt fra kassa */}
            <Meta label="Kilde" value={order.from ? order.from : "ukjent"} />
            <Meta label="Bekreftelseskode" value={order.code ? order.code : "ikke utstedt"} />
            <Meta label="Antall varer" value={order.items ? order.items : "0 (midlertidig)"} />
            <Meta label="Total" value={order.total ? `${order.total},-` : "uberegnet"} />
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-black/10" />
{/* CASE DETAILS */}
<div className="space-y-2">
  <div className="font-black">Saksdetaljer</div>
  <div className="grid grid-cols-2 gap-4 text-sm">
    <Meta label="Referanse" value={order.ref} />
    <Meta label="Systemkode" value={order.sys} />
    <Meta label="PRH-nøkkel" value={order.prh} />
    <Meta label="Sakstype" value={order.caseType} />
    <Meta label="Alvorlighetsgrad" value={order.severity} />
    <Meta label="Behandlingsnivå" value="Administrativt" />
  </div>
</div>

<div className="h-px bg-black/10" />

{/* PROCESS LOG */}
<div className="space-y-2">
  <div className="font-black">Behandlingslogg</div>
  <ul className="text-sm space-y-2">
    <li className="flex gap-3">
      <span className="w-20 text-xs font-semibold opacity-60">T+00</span>
      <span className="opacity-80">Registrert i systemet</span>
    </li>
    <li className="flex gap-3">
      <span className="w-20 text-xs font-semibold opacity-60">T+01</span>
      <span className="opacity-80">Tildelt avdeling: Marked</span>
    </li>
    <li className="flex gap-3">
      <span className="w-20 text-xs font-semibold opacity-60">T+02</span>
      <span className="opacity-80">Vurdering initiert (uten frist)</span>
    </li>
    <li className="flex gap-3">
      <span className="w-20 text-xs font-semibold opacity-60">T+03</span>
      <span className="opacity-80">Foreløpig avklaring: Ubestemt</span>
    </li>
  </ul>
  <div className="text-xs opacity-60">
    Loggen viser et utvalg av hendelser. Øvrige hendelser kan være utelatt av hensyn til ro.
  </div>
</div>

<div className="h-px bg-black/10" />

          {/* MESSAGE */}
          <div className="space-y-2">
            <div className="font-black">Hva skjer nå?</div>
            <p className="text-sm opacity-80">
              Ordren din er registrert i systemet og vurderes fortløpende. Vurderingen foretas av
              markedsavdelingen i samråd med virkeligheten.
            </p>
            <p className="text-sm opacity-80">Du trenger ikke gjøre noe. Det gjør heller ikke vi.</p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`/sporing/${encodeURIComponent(order.id)}`}
              className="rounded-lg bg-black text-white px-5 py-3 font-black hover:opacity-90"
            >
              Spor pakke →
            </a>
            <a
              href="/kampanjer"
              className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90"
            >
              Se flere tilbud →
            </a>
            <a
              href="/kundeservice"
              className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
            >
              Kontakt kundeservice
            </a>
          </div>

          {/* FOOTNOTE */}
          <div className="text-xs opacity-60 pt-2">
            🧾 Regnskap: “Denne ordren er notert.” <br />
            📣 Marked: “Denne ordren er viktig.”
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
