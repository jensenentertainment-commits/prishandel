// app/sporing/[id]/page.tsx
import { notFound } from "next/navigation";

type Step = {
  title: string;
  meta: string;
  badge: { text: string; cls: string };
  note: string;
};

function buildTimeline(id: string): Step[] {
  // Intentionally contradictory status timeline
  return [
    {
      title: "Status oppdatert",
      meta: "Nettopp • Systemet kjeder seg",
      badge: { text: "LIVE", cls: "bg-green-600 text-white" },
      note: "Denne sporinga oppdateres dynamisk (i teorien).",
    },
    {
      title: "Pakken er levert",
      meta: "Leveringssted: Ukjent • Signatur: “Kampanje”",
      badge: { text: "LEVERT", cls: "bg-black text-yellow-300" },
      note: "Gratulerer. Du eier nå noe som ikke finnes.",
    },
    {
      title: "Pakken er ikke sendt",
      meta: "Årsak: Lagerstatus 0 • Tiltak: optimismedrift",
      badge: { text: "IKKE SENDT", cls: "bg-red-600 text-white" },
      note: "Dette er ikke en feil. Dette er logistikkens personlighet.",
    },
    {
      title: "Klar for utlevering",
      meta: "Hentested: “Teori” • Åpningstid: når det passer",
      badge: { text: "KLAR", cls: "bg-yellow-300 text-black" },
      note: "Ta med legitimasjon og en grunnleggende tro på systemer.",
    },
    {
      title: "Forsinket",
      meta: "Årsak: Kampanje • Tiltak: flere kampanjer",
      badge: { text: "FORSINKET", cls: "bg-red-600 text-white" },
      note: "Markedsavdelingen har tatt over ruteplanleggingen.",
    },
    {
      title: "Retur igangsatt",
      meta: "Initiert av: Virkeligheten • Begrunnelse: ja",
      badge: { text: "RETUR", cls: "bg-neutral-900 text-white" },
      note: "Retur gjelder ikke abstrakte konsepter, men vi prøver likevel.",
    },
  ];
}

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = rawId?.trim();
  if (!id) return notFound();
  const steps = buildTimeline(id);
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="bg-black text-yellow-300 px-6 py-5">
          <div className="text-xs font-black uppercase tracking-wide">
            Sporing (simulert)
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">
            Pakke: <span className="text-yellow-300">{id}</span>
          </h1>
          <div className="mt-1 text-sm text-white/80">
            Status kan være korrekt, feil, eller en kampanje.
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* SUMMARY */}
          <div className="rounded-xl bg-yellow-300 border border-black/10 p-4">
            <div className="text-sm font-black">📦 Sammendrag</div>
            <div className="mt-1 text-sm">
              Denne pakken er <span className="font-black">levert</span>,{" "}
              <span className="font-black">ikke sendt</span> og{" "}
              <span className="font-black">forsinket</span> samtidig.
            </div>
            <div className="mt-2 text-xs opacity-70">
              🧾 Regnskap: “Notert.” • 📣 Marked: “Dette går bra.”
            </div>
          </div>

          {/* TIMELINE */}
          <div className="space-y-3">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-black/10 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-black rounded px-2 py-1 ${s.badge.cls}`}
                      >
                        {s.badge.text}
                      </span>
                      <div className="font-black">{s.title}</div>
                    </div>
                    <div className="mt-1 text-xs opacity-70">{s.meta}</div>
                  </div>

                  <div className="text-xs font-semibold opacity-60">
                    #{idx + 1}
                  </div>
                </div>

                <div className="mt-2 text-sm opacity-85">{s.note}</div>

                <div className="mt-3 h-2 rounded bg-black/10 overflow-hidden">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${92 - idx * 7}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="/kundeservice"
              className="rounded-lg bg-black text-white px-5 py-3 font-black hover:opacity-90"
            >
              Kontakt kundeservice →
            </a>
            <a
              href="/kampanjer"
              className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90"
            >
              Se kampanjer →
            </a>
            <a
              href="/utsolgt"
              className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
            >
              Sjekk lager (0)
            </a>
          </div>

          {/* FOOTNOTE */}
          <div className="text-xs opacity-60 pt-2">
            *Sporing kan endre seg uten at noe beveger seg.
          </div>
        </div>
      </div>
    </main>
  );
}
