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
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <section className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <h1 className="text-3xl font-black tracking-tight">{props.title}</h1>
          {props.lead && (
            <p className="mt-2 text-sm opacity-80 max-w-2xl">{props.lead}</p>
          )}

          <div className="mt-8 space-y-8">
            {props.sections.map((s) => (
              <div key={s.heading}>
                <div className="text-sm font-black">{s.heading}</div>
                <div className="mt-2 text-sm opacity-80 leading-relaxed">
                  {s.body}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-xs opacity-60">
            🧾 Regnskap: Denne siden er registrert. 📣 Marked: Denne siden er
            optimalisert.
          </div>
        </section>

        <aside className="space-y-4">
          {props.aside ?? (
            <div className="rounded-2xl bg-neutral-50 border border-black/10 p-5">
              <div className="text-sm font-black">Hurtigvalg</div>
              <div className="mt-3 grid gap-2 text-sm">
                <a href="/butikk" className="underline decoration-2">
                  Gå til butikk →
                </a>
                <a href="/kampanjer" className="underline decoration-2">
                  Se kampanjer →
                </a>
                <a href="/kontakt" className="underline decoration-2">
                  Kontakt kundeservice →
                </a>
              </div>
              <div className="mt-4 text-xs opacity-70">
                Lagerstatus: 0 • Tiltak: flere sider
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
