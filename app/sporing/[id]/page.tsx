// app/sporing/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

type Step = {
  title: string;
  meta: string;
  badge: { text: string; cls: string };
  note: string;
  active?: boolean;
};

function isValidTrackingId(id: string) {
  const clean = id.trim().toUpperCase();
  return /^ORD-PH-\d{6}$/.test(clean) || /^PRH-\d{4}$/.test(clean);
}

function hashCode(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function buildTimeline(id: string): Step[] {
  const h = hashCode(id);

  const variants: Step[][] = [
    [
      {
        title: "Status oppdatert",
        meta: "Nettopp • Intern sporingsro opprettholdt",
        badge: { text: "LIVE", cls: "bg-green-600 text-white" },
        note: "Denne sporinga oppdateres fortløpende så lenge systemet føler seg informativt.",
        active: true,
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
        note: "Forsendelsen anses fortsatt som relevant til tross for fravær av utsendelse.",
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
        note: "Markedsavdelingen har overtatt deler av logistikkforståelsen.",
      },
    ],
    [
      {
        title: "Status oppdatert",
        meta: "Nettopp • Ingen ny bevegelse bekreftet",
        badge: { text: "LIVE", cls: "bg-green-600 text-white" },
        note: "Sporingsbildet anses som levende selv når pakken ikke gjør det.",
        active: true,
      },
      {
        title: "Retur igangsatt",
        meta: "Initiert av: Virkeligheten • Begrunnelse: ja",
        badge: { text: "RETUR", cls: "bg-neutral-900 text-white" },
        note: "Retur gjelder ikke abstrakte konsepter, men vi prøver likevel.",
      },
      {
        title: "Under transport",
        meta: "Transportør: uklar • Etappe: mentalt gjennomført",
        badge: { text: "PÅ VEI", cls: "bg-black text-white" },
        note: "Forsendelsen anses som mobil så lenge den ikke er tilbakevist.",
      },
      {
        title: "Klar for utlevering",
        meta: "Sted: Midlertidig relevant • Frist: ikke bindende",
        badge: { text: "KLAR", cls: "bg-yellow-300 text-black" },
        note: "Utlevering er tilgjengelig i samme grad som pakken er det.",
      },
      {
        title: "Ikke innlevert",
        meta: "Årsak: operativ usikkerhet • Tiltak: intern støtte",
        badge: { text: "MANGLER", cls: "bg-red-600 text-white" },
        note: "Pakken er på flere måter i flyt, men ikke nødvendigvis i systemet.",
      },
    ],
  ];

  return variants[h % variants.length];
}

function getSummary(id: string) {
  const h = hashCode(id);

  const summaries = [
    {
      current: "Levert, ikke sendt og fortsatt under behandling.",
      location: "Sist observert: ukjent",
      confidence: "Systemet er moderat sikkert",
      admin: "Sporing opprettholdes administrativt",
    },
    {
      current: "Klar for utlevering, men logistisk vanskelig å plassere.",
      location: "Sist observert: teoretisk hentested",
      confidence: "Systemet er tryggere enn grunnlaget tilsier",
      admin: "Bevegelse er delvis dokumentert",
    },
    {
      current: "Forsinket med høy intern selvtillit.",
      location: "Sist observert: ikke entydig",
      confidence: "Systemet rapporterer fremdrift uten å binde seg",
      admin: "Status anses som operativ",
    },
  ];

  return summaries[h % summaries.length];
}

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = rawId?.trim().toUpperCase();

  if (!id || !isValidTrackingId(id)) return notFound();

  const h = hashCode(id);
  const steps = buildTimeline(id);
  const summary = getSummary(id);

  const movement = clamp(18 + (h % 21), 0, 100);
  const confidence = clamp(74 + (h % 19), 0, 100);
  const reality = clamp(3 + (h % 8), 0, 100);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
        <div className="bg-black px-5 py-5 text-white sm:px-6 sm:py-6">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300">
            Forsendelsessporing
          </div>

          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">
                Pakke: <span className="text-yellow-300">{id}</span>
              </h1>
              <div className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                Status oppdateres fortløpende og med varierende grad av sammenheng.
              </div>
            </div>

            <div className="shrink-0 rounded-lg bg-green-600 px-3 py-2 text-xs font-black uppercase tracking-wide text-white">
              Live sporing
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section className="rounded-2xl border border-black/10 bg-yellow-300 p-4 sm:p-5">
            <div className="text-xs font-black uppercase tracking-wide opacity-70">
              Sammendrag
            </div>
            <div className="mt-2 text-lg font-black leading-tight sm:text-xl">
              {summary.current}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
              <div>{summary.location}</div>
              <div>{summary.confidence}</div>
              <div>{summary.admin}</div>
            </div>
            <div className="mt-3 text-xs opacity-70">
              🧾 Regnskap: “Notert.” • 📣 Marked: “Dette går bra.”
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricCard label="Fremdrift" value={`${movement}%`} note="Begrenset" />
            <MetricCard label="Systemselvtillit" value={`${confidence}%`} note="Høy" />
            <MetricCard label="Faktisk bevegelse" value={`${reality}%`} note="Svak" />
          </section>

          <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
            <div className="text-xs font-black uppercase tracking-wide opacity-60">
              Hendelseslogg
            </div>

            <div className="mt-4 space-y-3">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 ${
                    s.active
                      ? "border-black/15 bg-black text-white"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded px-2 py-1 text-[11px] font-black ${s.badge.cls}`}
                        >
                          {s.badge.text}
                        </span>
                        <div className={`font-black ${s.active ? "text-white" : ""}`}>
                          {s.title}
                        </div>
                      </div>

                      <div
                        className={`mt-1 text-xs ${
                          s.active ? "text-white/70" : "opacity-70"
                        }`}
                      >
                        {s.meta}
                      </div>
                    </div>

                    <div
                      className={`text-xs font-semibold ${
                        s.active ? "text-white/50" : "opacity-60"
                      }`}
                    >
                      #{idx + 1}
                    </div>
                  </div>

                  <div
                    className={`mt-2 text-sm leading-relaxed ${
                      s.active ? "text-white/85" : "opacity-85"
                    }`}
                  >
                    {s.note}
                  </div>

                  <div
                    className={`mt-3 h-2 overflow-hidden rounded-full ${
                      s.active ? "bg-white/15" : "bg-black/10"
                    }`}
                  >
                    <div
                      className={`h-full ${
                        s.active ? "bg-yellow-300" : "bg-red-600"
                      }`}
                      style={{ width: `${92 - idx * 9}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs leading-relaxed opacity-60">
              Loggen viser et utvalg av registrerte hendelser. Øvrige hendelser kan være
              utelatt av hensyn til flyt, sporingsro og intern lesbarhet.
            </div>
          </section>

          <section className="rounded-2xl border border-black/10 bg-neutral-50 p-4 sm:p-5">
            <div className="text-xs font-black uppercase tracking-wide opacity-60">
              Nåværende vurdering
            </div>
            <div className="mt-2 text-xl font-black leading-tight">
              Forsendelsen anses som håndtert så lenge den fortsatt kan spores.
            </div>
            <div className="mt-3 text-sm leading-relaxed opacity-80">
              Det foreligger flere samtidige indikasjoner på levering, fravær av sending
              og vedvarende forsinkelse. Systemet vurderer disse som forenlige inntil videre.
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href="/kundeservice"
              className="rounded-xl bg-black px-5 py-3 text-center font-black text-white hover:opacity-90"
            >
              Bestrid sporing →
            </Link>
            <Link
              href="/kampanjer"
              className="rounded-xl bg-red-600 px-5 py-3 text-center font-black text-white hover:opacity-90"
            >
              Se kampanjer →
            </Link>
            <Link
              href="/utsolgt"
              className="rounded-xl border border-black/20 bg-white px-5 py-3 text-center font-black text-black hover:bg-black/5"
            >
              Sjekk lager (0)
            </Link>
          </div>

          <div className="pt-1 text-xs opacity-60">
            *Sporing kan endre seg uten at noe beveger seg.
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard(props: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-[11px] font-black uppercase tracking-wide opacity-45">
        {props.label}
      </div>
      <div className="mt-2 text-2xl font-black">{props.value}</div>
      <div className="mt-1 text-sm opacity-70">{props.note}</div>
    </div>
  );
}