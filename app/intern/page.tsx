// app/intern/page.tsx
import { voices } from "../lib/voices";
import InternalBoard from "@/app/components/InternalBoard";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
}

type Kind = "generic" | "price" | "shipping" | "coupon" | "stock";

export default function InternPage() {
  const now = new Date();

  // “KPI” som alltid ser dramatisk ut
  const activeCampaigns = randInt(9, 19);
  const warehouseStock = 0;
  const margin = clamp(randInt(-87, -12), -99, -1); // negativ, alltid
  const accountantPulse = clamp(randInt(108, 164), 90, 200);

  // Oppdaterte “beslutninger”
  const kinds: Kind[] = ["generic", "price", "shipping", "coupon", "stock"];
  const decisionKind = kinds[randInt(0, kinds.length - 1)];
  const duel = voices.duel(decisionKind);

  // Konfliktlogg (10 siste)
  const log = Array.from({ length: 10 }).map((_, i) => {
    const minutesAgo = (i + 1) * randInt(2, 7);
    const ts = new Date(now.getTime() - minutesAgo * 60_000);

    const k = kinds[randInt(0, kinds.length - 1)];
    const pair = voices.duel(k);

    return {
      ts,
      market: pair[0].text,
      ledger: pair[1].text,
    };
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 text-xs font-black">
            INTERN / KONTROLLROM
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Intern driftstatus
          </h1>
          <p className="mt-2 text-sm opacity-80 max-w-2xl">
            Dette er en intern side og burde ikke vært synlig. Markedsavdelingen
            mener den er “konverteringsdrivende”. Regnskapsfører mener den er
            “bekymringsfull”.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/kampanjer"
            className="rounded-xl bg-red-600 text-white px-4 py-2 font-black hover:opacity-90"
          >
            GÅ TIL KAMPANJER →
          </a>
          <a
            href="/butikk"
            className="rounded-xl bg-white text-black px-4 py-2 font-black border border-black/20 hover:bg-black/5"
          >
            ÅPNE BUTIKK
          </a>
        </div>
      </div>

      {/* KPI row */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Kampanjer aktive" value={activeCampaigns.toString()} hint="📣 Marked: flere!" />
        <KpiCard label="Lagerstatus" value={warehouseStock.toString()} hint="🧾 Regnskap: som forventet" />
        <KpiCard label="Margin" value={`${margin}%`} hint="🧾 Regnskap: nei" />
        <KpiCard label="Puls (regnskapsfører)" value={`${accountantPulse} bpm`} hint="📣 Marked: dette er bra!" />
      </div>

      {/* split panels */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* MARKED */}
        <section className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/10 bg-yellow-300 text-black flex items-center justify-between">
            <div>
              <div className="text-xs font-black rounded bg-black text-yellow-300 px-2 py-1 inline-block">
                📣 MARKEDSAVDELINGEN
              </div>
              <div className="mt-2 text-lg font-black">Kampanje-kommando</div>
              <div className="text-xs opacity-70">
                Status: “ALT ER UNDER KONTROLL”
              </div>
            </div>

            <a
  href="/markedsavdeling"
  className="text-xs font-black rounded bg-white/70 px-2 py-1 border border-black/10 hover:bg-white"
>
  Åpne kampanjelab →
</a>

          </div>

          <div className="p-5 space-y-4">
            <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
              <div className="text-sm font-black">Siste beslutning</div>
              <div className="mt-2 text-sm font-semibold">{duel[0].text}</div>
              <div className="mt-2 text-[11px] opacity-60">
                *Denne beslutningen er umiddelbart gjeldende.
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <FakeButton label="Start nød-kampanje" tag="HASTER" />
              <FakeButton label="Øk rabatt til 90%" tag="-90%*" />
              <FakeButton label="Forleng Black Week" tag="IGJEN" />
              <FakeButton label="Aktiver vipps/klarna*" tag="MENTALT" />
            </div>

            <div className="rounded-xl bg-white border border-black/10 p-4">
              <div className="text-sm font-black">Notat (Marked)</div>
              <p className="mt-2 text-sm opacity-80">
                Vi må holde trykket oppe. Kundene elsker knapper. Lageret er
                sekundært. Virkeligheten er for konkurrenter.
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href="/kampanjer"
                  className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-black hover:opacity-90"
                >
                  SE ALLE KAMPANJER →
                </a>
                <a
                  href="/utsolgt"
                  className="rounded-lg bg-white text-black px-4 py-2 text-sm font-black border border-black/20 hover:bg-black/5"
                >
                  SJEKK LAGER (0)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* REGNSKAP */}
        <section className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/10 bg-black text-white flex items-center justify-between">
            <div>
              <div className="text-xs font-black rounded bg-white/15 px-2 py-1 inline-block">
                🧾 REGNSKAPSFØRER
              </div>
              <div className="mt-2 text-lg font-black">Avvik & vurdering</div>
              <div className="text-xs opacity-70">Status: “NEI”</div>
            </div>

            <span className="text-xs font-black rounded bg-white/15 px-2 py-1">
              ARKIVERT
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
              <div className="text-sm font-black">Kommentar til siste beslutning</div>
              <div className="mt-2 text-sm font-semibold">{duel[1].text}</div>
              <div className="mt-2 text-[11px] opacity-60">
                Dette er loggført. Dette er ikke løst.
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <FakeButton label="Stoppe kampanjer" tag="NEKTET" tone="ledger" />
              <FakeButton label="Gjeninnføre margin" tag="UMULIG" tone="ledger" />
              <FakeButton label="Be om pause" tag="IGNORERT" tone="ledger" />
              <FakeButton label="Rapportere avvik" tag="OPPRETTET" tone="ledger" />
            </div>

            <div className="rounded-xl bg-white border border-black/10 p-4">
              <div className="text-sm font-black">Notat (Regnskap)</div>
              <p className="mt-2 text-sm opacity-80">
                Jeg minner om at “alltid utsolgt” ikke er en lagerstrategi.
                Dette fremstår som en livsstil. Tiltak anbefales. Tiltak blir
                ikke gjennomført.
              </p>
              <div className="mt-3 text-xs opacity-60">
                P.S. {voices.ledger.ps()}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* conflict log */}
      <section className="mt-8 rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-black/10 bg-neutral-50 flex items-center justify-between">
          <div>
            <div className="text-lg font-black">Konfliktlogg</div>
            <div className="text-xs opacity-70">
              Sist oppdatert: {fmtTime(now)} (automatisk, uverifisert)
            </div>
          </div>

          <a
            href="/kontakt"
            className="rounded-lg bg-white text-black px-4 py-2 text-sm font-black border border-black/20 hover:bg-black/5"
          >
            Meld avvik (utsolgt) →
          </a>
        </div>

        <div className="p-5">
          <div className="grid gap-3">
            {log.map((row, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-black/10 bg-white p-4"
              >
                <div className="text-xs opacity-60">
                  {fmtTime(row.ts)} • intern hendelse #{idx + 1}
                </div>

                <div className="mt-2 text-sm font-semibold">
                  {row.market}
                </div>
                <div className="mt-1 text-sm opacity-80">
                  {row.ledger}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs opacity-60">
            *Denne loggen kan avvike fra virkeligheten. Markedsavdelingen
            foretrekker det slik.
          </div>
        </div>
      </section>
      <InternalBoard />
    </main>
  );
}

function KpiCard(props: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-4">
      <div className="text-xs opacity-70">{props.label}</div>
      <div className="mt-1 text-2xl font-black tracking-tight">{props.value}</div>
      <div className="mt-2 text-xs opacity-70">{props.hint}</div>
    </div>
  );
}

function FakeButton(props: { label: string; tag: string; tone?: "market" | "ledger" }) {
  const tone = props.tone ?? "market";

  const tagClasses =
    tone === "market"
      ? "bg-yellow-300 text-black border border-black/10"
      : "bg-black text-white border border-white/10";

  return (
    <button
  type="button"
  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-left hover:bg-black/5 active:scale-[0.99]"
  aria-label={props.label}
>

    
      <div className="flex items-start justify-between gap-2">
        <div className="font-black">{props.label}</div>
        <span className={`shrink-0 text-[10px] font-black rounded px-2 py-0.5 ${tagClasses}`}>
          {props.tag}
        </span>
      </div>
      <div className="mt-1 text-xs opacity-60">
        Utføres umiddelbart* (på følelsen)
      </div>
    </button>
  );
}
