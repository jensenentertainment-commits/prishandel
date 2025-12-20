import { SYSTEM_ERRORS } from "@/app/lib/systemErrors";

export default function SystemfeilIndex() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black rounded bg-black text-yellow-300 px-3 py-1">
            STATUSPORTAL
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Systemfeil-katalog
          </h1>
          <p className="mt-2 text-lg opacity-80">
            Vi dokumenterer alt. Mest fordi det ser seriøst ut.
          </p>
        </div>
        <a
          href="/kampanjer"
          className="shrink-0 rounded-xl bg-red-600 text-white px-4 py-3 font-black hover:opacity-90"
        >
          KAMPANJER →
        </a>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {SYSTEM_ERRORS.map((e) => (
          <a
            key={e.code}
            href={`/systemfeil/${e.code}`}
            className="rounded-2xl bg-white border border-black/10 shadow-sm p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-black">{e.code}</div>
              <div className="text-xs font-black rounded bg-yellow-300 px-2 py-1">
                {e.severity}
              </div>
            </div>
            <div className="mt-2 text-xl font-black">{e.title}</div>
            <div className="mt-1 text-sm opacity-80">{e.summary}</div>

            <div className="mt-4 flex flex-wrap gap-2">
              {e.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-black rounded-full bg-neutral-50 border border-black/10 px-3 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 text-xs opacity-60">
        🧾 Regnskap: “Dette er ikke en portal.” 📣 Marked: “Dette er en portal.”
      </div>
    </main>
  );
}
