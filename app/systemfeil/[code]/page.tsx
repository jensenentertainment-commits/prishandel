import { notFound } from "next/navigation";
import { getSystemError, lastSeenFor } from "@/app/lib/systemErrors";

function badgeColor(sev: "P0" | "P1" | "P2" | "P3") {
  switch (sev) {
    case "P0":
      return "bg-red-600 text-white";
    case "P1":
      return "bg-yellow-300 text-black";
    case "P2":
      return "bg-black text-white";
    case "P3":
      return "bg-neutral-200 text-black";
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
    <main className="max-w-3xl mx-auto px-4 py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className={`text-xs font-black rounded px-2 py-1 ${badgeColor(err.severity)}`}>
              {err.severity}
            </span>
            <span className="text-xs font-black rounded bg-black text-yellow-300 px-2 py-1">
              SYSTEMFEIL
            </span>
            <span className="text-xs font-semibold opacity-60">
              Feilkode: <span className="font-black">{err.code}</span>
            </span>
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
            {err.title}
          </h1>
          <p className="mt-2 text-lg opacity-80">{err.summary}</p>

          <div className="mt-3 text-xs opacity-60">
            Sist observert: {seen.minutesAgo} min siden • Hendelser: {seen.times}
          </div>
        </div>

        <a
          href="/kampanjer"
          className="shrink-0 rounded-xl bg-red-600 text-white px-4 py-3 font-black hover:opacity-90"
        >
          KAMPANJER →
        </a>
      </div>

      <section className="mt-8 rounded-2xl bg-white border border-black/10 shadow-sm p-6">
        <div className="font-black">Hva skjedde</div>
        <ul className="mt-3 space-y-2 text-sm font-semibold">
          {err.whatHappened.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="opacity-50">•</span>
              <span className="opacity-80">{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {err.whatYouCanDo.map((a) => (
            <a
              key={a.href + a.label}
              href={a.href}
              className={
                a.tone === "primary"
                  ? "rounded-xl bg-black text-white px-4 py-3 font-black text-center hover:opacity-90"
                  : "rounded-xl bg-white text-black px-4 py-3 font-black text-center border border-black/20 hover:bg-black/5"
              }
            >
              {a.label}
            </a>
          ))}
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-xl bg-yellow-300 border border-black/10 p-4">
            <div className="text-xs font-black opacity-80">Markedsavdelingen</div>
            <div className="mt-1 font-black">{err.market}</div>
          </div>

          <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
            <div className="text-xs font-black opacity-70">Regnskap</div>
            <div className="mt-1 font-semibold opacity-80">{err.accounting}</div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-neutral-50 border border-black/10 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-black">Tags</div>
          {err.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-black rounded-full bg-white border border-black/10 px-3 py-1"
            >
              {t}
            </span>
          ))}
          <span className="ml-auto text-xs font-semibold opacity-60">
            Status: “under observasjon” (alltid)
          </span>
        </div>
      </section>

      <div className="mt-8 text-xs opacity-60">
        *Feilsider kan være en del av kampanjen. Feilkoder kan avvike fra virkeligheten.
      </div>
    </main>
  );
}
