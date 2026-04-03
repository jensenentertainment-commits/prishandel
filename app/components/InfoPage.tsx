// app/components/InfoPage.tsx
export default function InfoPage(props: {
  title: string;
  lead?: string;
  sections: Array<{
    heading: string;
    body: React.ReactNode;
  }>;
  aside?: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),360px]">
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-black px-2 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-300">
              Infoside aktiv
            </span>
            <span className="rounded border border-black/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide">
              REG-INFO / NOTERT
            </span>
          </div>

          <div className="mt-4">
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              {props.title}
            </h1>

            {props.lead && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-80 md:text-[15px]">
                {props.lead}
              </p>
            )}
          </div>

          <div className="mt-8 space-y-0">
            {props.sections.map((s, i) => (
              <div
                key={`${s.heading}-${i}`}
                className={i === 0 ? "pt-0" : "mt-6 border-t border-black/10 pt-6"}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wide opacity-45">
                    Seksjon {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="text-sm font-black">{s.heading}</div>
                </div>

                <div className="mt-2 text-sm leading-relaxed opacity-80">
                  {s.body}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-black/10 bg-black/5 p-3 text-xs">
            <div>🧾 Regnskap: Denne siden er registrert.</div>
            <div>📣 Marked: Denne siden er optimalisert for videre lesning.</div>
          </div>
        </section>

        <aside className="space-y-4">
          {props.aside ?? (
            <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-black">Hurtigvalg</div>
                <span className="rounded bg-black px-2 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-300">
                  Aktivt
                </span>
              </div>

              <div className="mt-4 grid gap-2">
                <a
                  href="/butikk"
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-black transition hover:bg-black/5"
                >
                  Gå til butikk →
                </a>

                <a
                  href="/kampanjer"
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-black transition hover:bg-black/5"
                >
                  Se kampanjer →
                </a>

                <a
                  href="/kontakt"
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-black transition hover:bg-black/5"
                >
                  Kontakt kundeservice →
                </a>
              </div>

              <div className="mt-4 text-xs opacity-70">
                Lagerstatus: 0 • Tiltak: flere sider • Oppfølging: pågår
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}