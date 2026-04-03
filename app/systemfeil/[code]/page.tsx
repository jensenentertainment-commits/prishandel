import { notFound } from "next/navigation";
import { getSystemError, lastSeenFor } from "@/app/lib/systemErrors";

function severityBadgeClasses(sev: "P0" | "P1" | "P2" | "P3") {
  switch (sev) {
    case "P0":
      return "bg-red-600 text-white";
    case "P1":
      return "bg-yellow-300 text-black";
    case "P2":
      return "bg-black text-yellow-300";
    case "P3":
      return "bg-neutral-200 text-black";
  }
}

function severityHeadline(sev: "P0" | "P1" | "P2" | "P3") {
  switch (sev) {
    case "P0":
      return "KRITISK REGISTRERING";
    case "P1":
      return "BETYDELIG AVVIK";
    case "P2":
      return "OPERATIV FEIL";
    case "P3":
      return "LAV PRIORITET";
  }
}

export default async function SystemfeilPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const err = getSystemError(code);
  if (!err) return notFound();

  const seen = lastSeenFor(err.code);

  return (
    <main className="mx-auto max-w-4xl px-4 py-14">
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300">
          REGISTRERT AVVIK • UNDER OBSERVASJON • VIDERE TOLKNING PÅGÅR
        </div>

        <div className="border-b border-black/10 bg-red-600 px-5 py-5 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2 py-1 text-xs font-black ${severityBadgeClasses(
                err.severity
              )}`}
            >
              {err.severity}
            </span>
            <span className="rounded bg-white/15 px-2 py-1 text-xs font-black">
              SYSTEMFEIL
            </span>
            <span className="rounded bg-white/15 px-2 py-1 text-xs font-black">
              {err.code}
            </span>
          </div>

          <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] opacity-90">
            {severityHeadline(err.severity)}
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            {err.title}
          </h1>

          <p className="mt-2 max-w-3xl text-lg opacity-90">{err.summary}</p>

          <div className="mt-3 text-xs opacity-90">
            Sist observert: {seen.minutesAgo} min siden • Registrerte hendelser:{" "}
            {seen.times}
          </div>
        </div>

        <div className="space-y-6 p-6">
          <section className="grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="font-black">Registrert hendelsesforløp</div>

              <ul className="mt-4 space-y-3 text-sm font-semibold">
                {err.whatHappened.map((line, index) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 rounded bg-black px-2 py-1 text-[10px] font-black text-yellow-300">
                      0{index + 1}
                    </span>
                    <span className="opacity-80">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-black/10 bg-yellow-300 p-4">
                <div className="text-xs font-black opacity-80">Markedsavdelingen</div>
                <div className="mt-1 font-black">{err.market}</div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                <div className="text-xs font-black opacity-70">Regnskap</div>
                <div className="mt-1 font-semibold opacity-80">{err.accounting}</div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-black opacity-70">Tilstand</div>
                <div className="mt-1 text-sm font-semibold opacity-80">
                  Under observasjon. Videre vurdering gjennomføres uten forpliktende
                  framdrift.
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="font-black">Mulige viderevalg</div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {err.whatYouCanDo.map((a) => (
                <a
                  key={`${a.href}:${a.label}`}
                  href={a.href}
                  className={
                    a.tone === "primary"
                      ? "rounded-xl bg-black px-4 py-3 text-center font-black text-white hover:opacity-90"
                      : "rounded-xl border border-black/20 bg-white px-4 py-3 text-center font-black text-black hover:bg-black/5"
                  }
                >
                  {a.label}
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-black">Tags</div>

              {err.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-black"
                >
                  {t}
                </span>
              ))}

              <span className="ml-auto text-xs font-semibold opacity-60">
                Status: under observasjon
              </span>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <a
          href="/systemfeil"
          className="rounded-xl border border-black/20 bg-white px-4 py-3 font-black text-black hover:bg-black/5"
        >
          ← Til systemfeilregister
        </a>

        <a
          href="/kampanjer"
          className="rounded-xl bg-red-600 px-4 py-3 font-black text-white hover:opacity-90"
        >
          Kampanjer →
        </a>
      </div>

      <div className="mt-6 text-xs opacity-60">
        Enkelte registreringer kan være kampanjerelaterte. Avvik mellom feilstatus og
        virkelighet anses ikke som separat feil.
      </div>
    </main>
  );
}