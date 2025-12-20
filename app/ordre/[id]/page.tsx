// app/ordre/[id]/page.tsx
import { notFound } from "next/navigation";

function fakeOrder(id: string) {
  if (!id) return null;

  return {
    id,
    status: "Behandles (mentalt)",
    handler: "Markedsavdelingen",
    payment: "Godkjent i teorien",
    delivery: "Ubestemt",
    created: "Nettopp",
  };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = fakeOrder(id);


  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="bg-green-600 text-white px-6 py-5">
          <div className="text-sm font-black uppercase tracking-wide">
            Ordre mottatt
          </div>
          <h1 className="mt-1 text-2xl font-black">
            Takk for bestillingen*
          </h1>
          <div className="mt-1 text-sm opacity-90">
            *bestillingen kan avvike fra virkeligheten
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* ORDER META */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs font-semibold opacity-60">
                Ordrenummer
              </div>
              <div className="font-black">{order.id}</div>
            </div>
            <div>
              <div className="text-xs font-semibold opacity-60">
                Status
              </div>
              <div className="font-black">{order.status}</div>
            </div>
            <div>
              <div className="text-xs font-semibold opacity-60">
                Behandles av
              </div>
              <div className="font-black">{order.handler}</div>
            </div>
            <div>
              <div className="text-xs font-semibold opacity-60">
                Betaling
              </div>
              <div className="font-black">{order.payment}</div>
            </div>
            <div>
              <div className="text-xs font-semibold opacity-60">
                Forventet levering
              </div>
              <div className="font-black">{order.delivery}</div>
            </div>
            <div>
              <div className="text-xs font-semibold opacity-60">
                Tidspunkt
              </div>
              <div className="font-black">{order.created}</div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-black/10" />

          {/* MESSAGE */}
          <div className="space-y-2">
            <div className="font-black">
              Hva skjer nå?
            </div>
            <p className="text-sm opacity-80">
              Ordren din er registrert i systemet og vurderes fortløpende.
              Vurderingen foretas av markedsavdelingen i samråd med virkeligheten.
            </p>
            <p className="text-sm opacity-80">
              Du trenger ikke gjøre noe. Det gjør heller ikke vi.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`/sporing/${order.id}`}
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
