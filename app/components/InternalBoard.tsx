// app/components/InternalBoard.tsx
import { getInternalFeed } from "@/app/lib/internal";

function pill(t: string) {
  return (
    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-black">
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

  const featuredSlack = slack.slice(0, 2);
  const featuredJira = jira.slice(0, 3);

  const blockedCount = jira.filter((i) => i.status === "Blocked").length;
  const inProgressCount = jira.filter((i) => i.status === "In progress").length;
  const p0Count = jira.filter((i) => i.priority === "P0").length;

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Intern status</h2>
          <p className="mt-1 max-w-2xl text-sm opacity-70">
            Siste interne notater, aktive avvik og pågående vurderinger.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/systemfeil"
            className="rounded-xl border border-black/20 bg-white px-4 py-2 font-black text-black hover:bg-black/5"
          >
            Se systemfeil
          </a>
          <a
            href="/kampanjer"
            className="rounded-xl bg-red-600 px-4 py-2 font-black text-white hover:opacity-90"
          >
            Kampanjer →
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-black px-3 py-1 text-[11px] font-black text-yellow-300">
          Intern feed aktiv
        </span>
        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-black">
          P0: {p0Count}
        </span>
        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-black">
          Blokkert: {blockedCount}
        </span>
        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-black">
          Pågår: {inProgressCount}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        {/* MAIN: AVVIK / JIRA */}
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-neutral-50 px-5 py-4">
            <div>
              <div className="font-black">Aktive saker</div>
              <div className="text-xs opacity-70">Prosjekt: PRIS</div>
            </div>
            <div className="text-xs font-semibold opacity-70">
              Sprintmål: holde det gående
            </div>
          </div>

          <div className="space-y-3 p-5">
            {featuredJira.map((i) => (
              <div
                key={i.key}
                className="rounded-xl border border-black/10 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-black px-2 py-1 text-xs font-black text-yellow-300">
                        {i.key}
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-black ${priClass(
                          i.priority
                        )}`}
                      >
                        {i.priority}
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-black ${statusClass(
                          i.status
                        )}`}
                      >
                        {i.status}
                      </span>
                      {pill(i.type)}
                      {i.code ? (
                        <a
                          href={`/systemfeil/${i.code}`}
                          className="rounded bg-yellow-300 px-2 py-1 text-xs font-black hover:opacity-90"
                        >
                          {i.code}
                        </a>
                      ) : null}
                    </div>

                    <div className="mt-2 text-lg font-black leading-tight">
                      {i.title}
                    </div>

                    <div className="mt-1 text-xs font-semibold opacity-60">
                      Eier: {i.owner}
                    </div>
                  </div>
                </div>

                <ul className="mt-3 space-y-1 text-sm font-semibold opacity-80">
                  {i.notes.slice(0, 2).map((n) => (
                    <li key={n} className="flex gap-2">
                      <span className="opacity-50">•</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>

                {i.links?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {i.links.slice(0, 2).map((l) => (
                      <a
                        key={l.href + l.label}
                        href={l.href}
                        className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-black hover:bg-black/5"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <div className="pt-1">
              <a
                href="/systemfeil"
                className="text-sm font-black underline decoration-2"
              >
                Åpne full feilkatalog →
              </a>
            </div>
          </div>
        </div>

        {/* SIDE: INTERNE NOTATER */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-neutral-50 px-5 py-4">
              <div>
                <div className="font-black">Siste interne notater</div>
                <div className="text-xs opacity-70">Kanalaktivitet</div>
              </div>
              <div className="text-xs font-semibold opacity-70">Moral: variabel</div>
            </div>

            <div className="space-y-3 p-5">
              {featuredSlack.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-black/10 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {pill(m.channel)}
                        <span className="text-sm font-black">{m.user}</span>
                        <span className="text-xs font-semibold opacity-60">
                          {m.role}
                        </span>
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
                      {m.links.slice(0, 1).map((l) => (
                        <a
                          key={l.href + l.label}
                          href={l.href}
                          className="rounded-lg bg-yellow-300 px-3 py-1.5 text-xs font-black hover:opacity-90"
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              <div className="text-xs opacity-60">
                Interne notater kan avvike fra offentlig trygghet.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
            <div className="text-sm font-black">Operativ vurdering</div>
            <div className="mt-3 space-y-2 text-sm font-semibold opacity-80">
              <div>• Prispress opprettholdes.</div>
              <div>• Tilgjengelighet omtales separat.</div>
              <div>• Avvik lukkes når markedet mister interessen.</div>
            </div>
            <div className="mt-4 text-xs opacity-60">
              Oppsummert: systemet lever, men ikke nødvendigvis av ro.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}