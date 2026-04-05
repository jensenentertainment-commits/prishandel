// app/page.tsx
import ProductGrid from "./components/ProductGrid";
import { Icon } from "./components/Icon";
import {
  Truck,
  CreditCard,
  Flame,
  Megaphone,
  TriangleAlert,
  ShieldCheck,
  Siren,
  Activity,
  ScanSearch,
  ReceiptText,
  PackageSearch,
} from "lucide-react";
import CampaignMotor from "./components/CampaignMotor";
import HeroLive from "./components/HeroLive";
import ShareEntry from "./components/ShareEntry";
import CampaignEntry from "./components/CampaignEntry";

function PromoChip(props: {
  label: string;
  value?: string;
  tone?: "black" | "white" | "red" | "green";
}) {
  const toneClass =
    props.tone === "red"
      ? "bg-red-600 text-white border-red-700/40"
      : props.tone === "green"
      ? "bg-green-500 text-white border-green-600/40"
      : props.tone === "black"
      ? "bg-black text-yellow-300 border-black"
      : "bg-white text-black border-black/12";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-sm sm:text-[11px] ${toneClass}`}
    >
      <span>{props.label}</span>
      {props.value ? <span className="opacity-80">{props.value}</span> : null}
    </div>
  );
}

function PressureCard(props: {
  icon: any;
  title: string;
  body: string;
  tone?: "yellow" | "red" | "white" | "black";
}) {
  const toneClass =
    props.tone === "red"
      ? "bg-red-600 text-white border-red-700/40"
      : props.tone === "yellow"
      ? "bg-yellow-400 text-black border-black/15"
      : props.tone === "black"
      ? "bg-black text-yellow-300 border-black"
      : "bg-white text-black border-black/12";

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClass}`}>
      <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] opacity-85 sm:text-[11px]">
        <Icon icon={props.icon} />
        {props.title}
      </div>
      <div className="mt-3 text-sm font-semibold leading-relaxed">{props.body}</div>
    </div>
  );
}

function InternalSignal(props: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-black/12 bg-white p-4 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] opacity-45 sm:text-[11px]">
        {props.label}
      </div>
      <div className="mt-2 text-lg font-black leading-tight sm:text-xl">{props.value}</div>
      <div className="mt-2 text-sm leading-relaxed opacity-72">{props.note}</div>
    </div>
  );
}

function InternalMemo() {
  return (
    <div className="rounded-3xl border border-black bg-black p-5 text-yellow-300 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70 sm:text-[11px]">
            Intern handelsmelding
          </div>
          <div className="mt-2 text-xl font-black leading-tight text-white sm:text-2xl">
            Kampanjen fortsetter,
            <br />
            også ved tvil.
          </div>
        </div>

        <span className="rounded bg-yellow-300 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-black sm:text-[11px]">
          Operativt
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm leading-relaxed text-white/82">
        <div>📣 Marked: “Vi trenger bare mer trykk.”</div>
        <div>🧾 Regnskap: “Vi trenger mindre aktivitet.”</div>
        <div>⚠️ Ledelsen: “Begge anses som innspill.”</div>
      </div>
    </div>
  );
}

function SystemStep(props: {
  icon: any;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-yellow-300">
          <Icon icon={props.icon} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-black sm:text-base">{props.title}</div>
          <div className="mt-1 text-sm leading-relaxed opacity-72">{props.body}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-[#f0e7ab] text-black">
      {/* HERO */}
      <section className="border-b border-black/12 bg-[linear-gradient(180deg,#f4d72d_0%,#f4e39a_38%,#f4ecd0_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
            <div className="rounded-[2rem] border border-black/15 bg-[#f5f2e7] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <PromoChip label="Aktiv handelsstatus" tone="black" />
                <PromoChip label="Live" value="pågår" tone="red" />
                <PromoChip label="Regnskap" value="varslet" tone="white" />
              </div>

              <div className="mt-5 max-w-2xl">
                <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-45 sm:text-[11px]">
                  Prishandel.no
                </div>

                <h1 className="mt-3 text-4xl font-black leading-[0.9] tracking-[-0.06em] sm:text-5xl md:text-6xl xl:text-7xl">
                  Alt er på tilbud.
                  <br />
                  Ingenting er tilgjengelig.
                </h1>

                <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-black/72 sm:text-lg">
                  Aggressivt prispress. Uklart lager. Operativ kasse. Du kan gjennomføre
                  et kjøpsforsøk. Utfallet behandles separat.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#prov-systemet"
                  className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
                >
                  PRØV Å KJØPE NOE
                  <span aria-hidden>→</span>
                </a>

                <a
                  href="/butikk"
                  className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-5 py-3 text-sm font-black transition hover:bg-black/5"
                >
                  SE VARER UNDER PRESS
                </a>
              </div>

              <div className="mt-4 rounded-2xl border border-black/15 bg-yellow-400 px-4 py-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] sm:text-[11px]">
                  <span className="inline-flex items-center gap-2 rounded bg-black px-2 py-1 text-yellow-300">
                    <Icon icon={Flame} />
                    Kampanje aktiv
                  </span>
                  <span>Kjøpsforsøk tillatt</span>
                  <span className="opacity-35">•</span>
                  <span>Lager vurderes separat</span>
                  <span className="opacity-35">•</span>
                  <span>Levering ikke endelig bekreftet</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PressureCard
                  icon={Truck}
                  title="Frakt"
                  body="Frakt omtales offensivt. Faktisk forflytning behandles løpende."
                  tone="white"
                />
                <PressureCard
                  icon={CreditCard}
                  title="Betaling"
                  body="Betaling kan starte raskt. Sammenheng mellom betaling og levering er ikke lovet."
                  tone="red"
                />
              </div>

              <div className="mt-4 text-[11px] leading-relaxed opacity-60">
                *Prishandel fungerer best når kampanjen pågår, lagersituasjonen er uklar
                og ingen helt vil ta det endelige ansvaret.
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/12 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.10)] sm:p-5 lg:p-6">
              <HeroLive />
            </div>
          </div>
        </div>

        <div className="border-t border-black/15 bg-black text-yellow-300">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] sm:text-xs">
            <span className="inline-flex items-center gap-2 rounded bg-yellow-300 px-2 py-1 text-black">
              <Icon icon={Megaphone} />
              Pågående trykk
            </span>
            <span>Alt er på tilbud</span>
            <span className="opacity-35">•</span>
            <span>Tilgjengelighet vurderes løpende</span>
            <span className="opacity-35">•</span>
            <a className="underline" href="/butikk">
              Se varer →
            </a>
            <span className="opacity-35">•</span>
            <a className="underline" href="/lager">
              Intern lagerstatus →
            </a>
          </div>
        </div>
      </section>

      {/* PRIMARY ENTRY */}
      <section id="prov-systemet" className="border-t border-black/10 bg-[#f5f2e7]">
        <ShareEntry />
      </section>

      {/* FAST EXPLANATION STRIP */}
      <section className="border-t border-black/10 bg-[#f5f2e7]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <SystemStep
              icon={ScanSearch}
              title="Finn en vare"
              body="Velg et produkt under aktiv påvirkning før lageret rekker å bli tydelig."
            />
            <SystemStep
              icon={ReceiptText}
              title="Gå til kassen"
              body="Betaling, lager og konsekvens behandles som beslektede, men separate spørsmål."
            />
            <SystemStep
              icon={PackageSearch}
              title="Følg ordren videre"
              body="Ordredetaljer kan oppstå. Levering kan vurderes. Ingenting garanterer sammenheng."
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-[#f0e7ab]">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.22em] opacity-45 sm:text-[11px]">
                Aktivt utvalg
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl md:text-5xl">
                Dagens prisfall
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-72 sm:text-base">
                Varer under aktiv påvirkning. Prisene er midlertidige. Kjøpsforsøk er
                åpne inntil videre.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/butikk"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:opacity-90"
              >
                Se alle varer →
              </a>
              <a
                href="/utsolgt"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-5 py-3 text-sm font-black transition hover:bg-black/5"
              >
                Alt utsolgt
              </a>
            </div>
          </div>
        </div>

        <ProductGrid limit={6} />
      </section>

      {/* PAYOFF */}
      <section className="border-t border-black/10 bg-[#f5f2e7]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.02fr_0.98fr]">
            <CampaignMotor />
            <InternalMemo />
          </div>
        </div>
      </section>

      {/* CAMPAIGN FEATURE */}
      <section className="border-t border-black/10 bg-[#f5f2e7]">
        <CampaignEntry />
      </section>

      {/* INTERNAL SIGNALS */}
      <section className="border-t border-black/10 bg-[#f0e7ab]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-[1.15fr_0.85fr] md:items-start">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.22em] opacity-45 sm:text-[11px]">
                Interne signaler
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl md:text-5xl">
                Handelsmaskinen er våken.
              </h2>
            </div>
            <div className="pt-1 text-sm leading-relaxed opacity-70 sm:text-base">
              Prishandel fungerer best når kampanjen pågår, tilgjengeligheten er uklar
              og systemet får jobbe uten for mye avklaring.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InternalSignal
              label="Prispress"
              value="Forhøyet"
              note="Markedet anser volum som en løsning. Volum er ikke definert."
            />
            <InternalSignal
              label="Prisro"
              value="Fraværende"
              note="Prisene er i bevegelse. Retningen er ikke nødvendigvis frivillig."
            />
            <InternalSignal
              label="Lagerfølelse"
              value="Optimistisk"
              note="Tilgjengelighet må ikke forveksles med faktisk tilgjengelighet."
            />
            <InternalSignal
              label="Regnskap"
              value="Varslet"
              note="Regnskap følger situasjonen løpende og motvillig."
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <PressureCard
              icon={Activity}
              title="Status"
              body="Kampanjen regnes som operativ så lenge ingen tvinger fram for mye presisjon."
              tone="white"
            />
            <PressureCard
              icon={TriangleAlert}
              title="Avvik"
              body="Opplevd kjøpsmulighet kan avvike fra faktisk kjøpsmulighet. Begge kan fortsatt markedsføres."
              tone="yellow"
            />
            <PressureCard
              icon={ShieldCheck}
              title="Trygghet"
              body="Vi står inne for opplevelsen så langt det lar seg formulere uten umiddelbar motstand."
              tone="white"
            />
          </div>
        </div>
      </section>

      {/* LAST PUSH */}
      <section className="border-t border-black/10 bg-[#f5f2e7]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.15fr_0.85fr]">
            <PressureCard
              icon={Siren}
              title="Trykk"
              body="Den beste måten å forstå Prishandel på er fortsatt å prøve å kjøpe noe før systemet roer seg ned."
              tone="black"
            />
            <PressureCard
              icon={Megaphone}
              title="Deling"
              body="Ikke forklar siden. Send noen inn for å handle og la resten ordne seg selv."
              tone="white"
            />
          </div>
        </div>
      </section>
    </main>
  );
}