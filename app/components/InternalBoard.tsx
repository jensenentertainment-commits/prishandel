// app/components/InternalBoard.tsx
import { getInternalFeed } from "@/app/lib/internal";

function pill(t: string) {
  return (
    <span className="text-[11px] font-black rounded-full bg-white border border-black/10 px-3 py-1">
      {t}
    </span>
  );
}

function statusClass(s: string) {
  if (s === "Done") return "bg-green-600 text-white";
  if (s === "In progress") return "bg-yellow-300 text-black";
  if (s === "Blocked") return "bg-red-600 text-white";
  if (s === "Won't fix") return "bg-black text-white";
  return "bg-neutral-200 text-black";
}

function priClass(p: string) {
  if (p === "P0") return "bg-red-600 text-white";
  if (p === "P1") return "bg-yellow-300 text-black";
  if (p === "P2") return "bg-black text-white";
  return "bg-neutral-200 text-black";
}

export default function InternalBoard() {
  const { slack, jira } = getInternalFeed("intern");

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Intern kommunikasjon</h2>
          <p className="mt-1 text-sm opacity-70">
            Slack + Jira (simulert). Ser ekte ut. Oppfører seg ekte. Er ikke ekte.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/systemfeil"
            className="rounded-xl bg-white text-black px-4 py-2 font-black border border-black/20 hover:bg-black/5"
          >
            Systemfeil-katalog
          </a>
          <a
            href="/kampanjer"
            className="rounded-xl bg-red-600 text-white px-4 py-2 font-black hover:opacity-90"
          >
            Kampanjer →
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* SLACK */}
        <div className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/10 bg-neutral-50 flex items-center justify-between gap-3">
            <div>
              <div className="font-black">Slack (simulert)</div>
              <div className="text-xs opacity-70">Sist synk: “nettopp”</div>
            </div>
            <div className="text-xs font-semibold opacity-70">
              Kanalenes moral: variabel
            </div>
          </div>

          <div className="p-5 space-y-4">
            {slack.map((m) => (
              <div key={m.id} className="rounded-xl border border-black/10 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {pill(m.channel)}
                      <span className="text-sm font-black">{m.user}</span>
                      <span className="text-xs font-semibold opacity-60">{m.role}</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold opacity-60">{m.ts}</div>
                </div>

                <div className="mt-2 text-sm font-semibold opacity-90">
                  {m.emoji ? `${m.emoji} ` : ""}
                  {m.text}
                </div>

                {m.links?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.links.map((l) => (
                      <a
                        key={l.href + l.label}
                        href={l.href}
                        className="text-xs font-black rounded-lg bg-yellow-300 px-3 py-1.5 hover:opacity-90"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <div className="text-xs opacity-60">
              *Slack kan avvike fra virkeligheten. Regnskap hevder dette er en fordel.
            </div>
          </div>
        </div>

        {/* JIRA */}
        <div className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/10 bg-neutral-50 flex items-center justify-between gap-3">
            <div>
              <div className="font-black">Jira (helt ekte energi)</div>
              <div className="text-xs opacity-70">Prosjekt: PRIS</div>
            </div>
            <div className="text-xs font-semibold opacity-70">
              Sprintmål: “holde det gående”
            </div>
          </div>

          <div className="p-5 space-y-3">
            {jira.map((i) => (
              <div key={i.key} className="rounded-xl border border-black/10 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black rounded bg-black text-yellow-300 px-2 py-1">
                        {i.key}
                      </span>
                      <span className={`text-xs font-black rounded px-2 py-1 ${priClass(i.priority)}`}>
                        {i.priority}
                      </span>
                      <span className={`text-xs font-black rounded px-2 py-1 ${statusClass(i.status)}`}>
                        {i.status}
                      </span>
                      {pill(i.type)}
                      {pill(i.owner)}
                      {i.code ? (
                        <a
                          href={`/systemfeil/${i.code}`}
                          className="text-xs font-black rounded bg-yellow-300 px-2 py-1 hover:opacity-90"
                        >
                          {i.code}
                        </a>
                      ) : null}
                    </div>

                    <div className="mt-2 text-lg font-black leading-tight">
                      {i.title}
                    </div>
                  </div>
                </div>

                <ul className="mt-3 space-y-1 text-sm font-semibold opacity-80">
                  {i.notes.slice(0, 3).map((n) => (
                    <li key={n} className="flex gap-2">
                      <span className="opacity-50">•</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>

                {i.links?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {i.links.map((l) => (
                      <a
                        key={l.href + l.label}
                        href={l.href}
                        className="text-xs font-black rounded-lg border border-black/20 px-3 py-1.5 hover:bg-black/5"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <div className="text-xs opacity-60">
              *Tickets lukkes når markedet blir lei av dem.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
