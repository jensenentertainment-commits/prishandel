import { SYSTEM_ERRORS } from "@/app/lib/systemErrors";

function severityBadgeClasses(severity: string) {
  const s = severity.toLowerCase();

  if (s.includes("p0") || s.includes("kritisk")) return "bg-red-600 text-white";
  if (s.includes("p1") || s.includes("betydelig")) return "bg-yellow-300 text-black";
  if (s.includes("p2") || s.includes("moderat")) return "bg-black text-yellow-300";
  return "bg-neutral-200 text-black";
}

function severityLabel(severity: string) {
  const s = severity.toLowerCase();

  if (s.includes("p0") || s.includes("kritisk")) return "Kritisk registrering";
  if (s.includes("p1") || s.includes("betydelig")) return "Betydelig avvik";
  if (s.includes("p2") || s.includes("moderat")) return "Operativ feil";
  return "Lav prioritet";
}

export default function SystemfeilIndex() {
  const featured = SYSTEM_ERRORS[0];
  const rest = SYSTEM_ERRORS.slice(1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded bg-black px-3 py-1 text-xs font-black text-yellow-300">
            INTERN OVERSIKT
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Systemfeilregister
          </h1>

          <p className="mt-2 max-w-3xl text-lg opacity-80">
            Registrerte avvik, operative feil og vedvarende forhold. Enkelte
            registreringer er fortsatt aktive.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/kampanjer"
            className="rounded-xl bg-red-600 px-4 py-3 font-black text-white hover:opacity-90"
          >
            Kampanjer →
          </a>
          <a
            href="/intern"
            className="rounded-xl border border-black/20 bg-white px-4 py-3 font-black text-black hover:bg-black/5"
          >
            Intern →
          </a>
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300">
          REGISTRERTE AVVIK • UNDER OBSERVASJON • VIDERE TOLKNING PÅGÅR
        </div>

        {featured && (
          <a href={`/systemfeil/${featured.code}`} className="block">
            <div className="border-b border-black/10 bg-red-600 px-5 py-5 text-white">
              <div className="inline-flex items-center gap-2 rounded bg-white/15 px-2 py-1 text-xs font-black">
                <span className="inline-block h-2 w-2 rounded-full bg-white" />
                KRITISK REGISTRERING
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-1 text-xs font-black ${severityBadgeClasses(
                    featured.severity
                  )}`}
                >
                  {featured.severity}
                </span>
                <span className="rounded bg-white/15 px-2 py-1 text-xs font-black">
                  {featured.code}
                </span>
              </div>

              <div className="mt-3 text-2xl font-black md:text-3xl">
                {featured.title}
              </div>
              <div className="mt-2 max-w-3xl text-sm opacity-90">
                {featured.summary}
              </div>
            </div>

            <div className="p-5">
              <div className="text-xs font-semibold opacity-60">
                Kategori: {severityLabel(featured.severity)} • Status: under observasjon
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {featured.tags.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-[11px] font-black"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </a>
        )}

        <div className="border-t border-black/10 bg-neutral-50 px-5 py-3 text-xs font-black">
          🧾 Regnskap: “Dette er ikke en portal.” <span className="opacity-40">•</span> 📣
          Marked: “Dette er en portal.”
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rest.map((e) => (
          <a
            key={e.code}
            href={`/systemfeil/${e.code}`}
            className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-black">{e.code}</div>
              <div
                className={`rounded px-2 py-1 text-xs font-black ${severityBadgeClasses(
                  e.severity
                )}`}
              >
                {e.severity}
              </div>
            </div>

            <div className="mt-3 text-xl font-black">{e.title}</div>
            <div className="mt-2 text-sm opacity-80">{e.summary}</div>

            <div className="mt-3 text-xs opacity-60">
              Status: Aktiv vurdering • Prioritet: {severityLabel(e.severity)}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {e.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-[11px] font-black"
                >
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 text-xs opacity-60">
        Enkelte registreringer kan være kampanjerelaterte. Avvik mellom systemstatus
        og underliggende forhold anses ikke som separat feil.
      </div>
    </main>
  );
}