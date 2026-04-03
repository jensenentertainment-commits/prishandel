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
  ShoppingCart,
  ScanSearch,
  ReceiptText,
  PackageSearch,
} from "lucide-react";
import CampaignMotor from "./components/CampaignMotor";
import HeroLive from "./components/HeroLive";

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

function ChallengeStep(props: {
  icon: any;
  number: string;
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
          <div className="text-[10px] font-black uppercase tracking-[0.18em] opacity-45 sm:text-[11px]">
            Steg {props.number}
          </div>
          <div className="mt-1 text-sm font-black sm:text-base">{props.title}</div>
          <div className="mt-1 text-sm leading-relaxed opacity-75">{props.body}</div>
        </div>
      </div>
    </div>
  );
}

function ChallengePanel() {
  return (
    <section className="border-t border-black/10 border-b border-black/10 bg-[#f5f2e7]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-black/12 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <PromoChip label="Prøv systemet" tone="black" />
              <PromoChip label="Interaktivt" value="ja" tone="red" />
            </div>

            <div className="mt-5 max-w-2xl">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-45 sm:text-[11px]">
                Ukens utfordring
              </div>

              <h2 className="mt-2 text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl md:text-5xl">
                Kan du fullføre
                <br />
                et kjøp?
              </h2>

              <p className="mt-4 text-base font-semibold leading-relaxed opacity-75 sm:text-lg">
                Legg en vare i kurven. Gå til kassen. Se om ordren blir stoppet av
                lager, regnskap eller virkeligheten.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-yellow-400 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.16em]">
                Mulige utfall
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.12em] sm:text-xs">
                <span className="rounded bg-black px-2 py-1 text-yellow-300">
                  Teoretisk fullført
                </span>
                <span className="rounded bg-white px-2 py-1 text-black">
                  Stoppet av regnskap
                </span>
                <span className="rounded bg-red-600 px-2 py-1 text-white">
                  Sendt til intern behandling
                </span>
                <span className="rounded bg-black px-2 py-1 text-yellow-300">
                  Levert uten grunnlag
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href="/butikk"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
              >
                PRØV Å KJØPE NOE
                <span aria-hidden>→</span>
              </a>

              <a
                href="/kampanjer"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-5 py-3 text-sm font-black transition hover:bg-black/5"
              >
                SE VARER UNDER PRESS
              </a>
            </div>

            <div className="mt-4 text-xs leading-relaxed opacity-60">
              Dette er en faktisk spillbar butikkopplevelse. Du kan åpne produkter,
              legge varer i kurven, gå til kassen, få ordredetaljer og spore pakken
              videre.
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/12 bg-white p-5 shadow-sm sm:p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-45 sm:text-[11px]">
              Slik fungerer det
            </div>

            <div className="mt-4 grid gap-3">
              <ChallengeStep
                icon={ShoppingCart}
                number="01"
                title="Finn en vare"
                body="Velg et produkt under aktivt prispress før lageret rekker å bli tydelig."
              />
              <ChallengeStep
                icon={ScanSearch}
                number="02"
                title="Legg i kurven"
                body="Systemet registrerer kjøpsintensjon og holder håpet levende."
              />
              <ChallengeStep
                icon={ReceiptText}
                number="03"
                title="Gå til kassen"
                body="Betaling, lager, frakt og virkelighet behandles som separate spørsmål."
              />
              <ChallengeStep
                icon={PackageSearch}
                number="04"
                title="Følg ordren videre"
                body="Motta ordredetaljer. Spor pakken. Observer hvordan systemet holder ut."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-[#f0e7ab] text-black">
      {/* HERO */}
      <section className="border-b border-black/12 bg-[linear-gradient(180deg,#f4d72d_0%,#f4e39a_38%,#f4ecd0_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
            {/* LEFT */}
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
                  Prisene ned.
                  <br />
                  Verdigheten også.
                </h1>

                <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-black/72 sm:text-lg">
                  Aggressivt prispress. Uklart lager. Full kampanjevilje. Gå inn før
                  noen roer seg ned.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/butikk"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
                >
                  SE DAGENS PRISFALL
                  <span aria-hidden>→</span>
                </a>

                <a
                  href="/kampanjer"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-5 py-3 text-sm font-black transition hover:bg-black/5"
                >
                  ÅPNE KAMPANJEN
                </a>
              </div>

              <div className="mt-4 rounded-2xl border border-black/15 bg-yellow-400 px-4 py-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] sm:text-[11px]">
                  <span className="inline-flex items-center gap-2 rounded bg-black px-2 py-1 text-yellow-300">
                    <Icon icon={Flame} />
                    Kampanje aktiv
                  </span>
                  <span>Varighet uklar</span>
                  <span className="opacity-35">•</span>
                  <span>Prisfall registrert</span>
                  <span className="opacity-35">•</span>
                  <span>Lager vurderes separat</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PressureCard
                  icon={Truck}
                  title="Frakt"
                  body="Gratis over 499,-. Under 499,- finnes det fortsatt press."
                  tone="white"
                />
                <PressureCard
                  icon={CreditCard}
                  title="Betaling"
                  body="Vipps og Klarna omtales offensivt. Kassen er fortsatt under påvirkning."
                  tone="red"
                />
              </div>

              <div className="mt-4 text-[11px] leading-relaxed opacity-60">
                *Vilkår gjelder der det passer oss. Les mer i{" "}
                <a className="font-black underline" href="/vilkar">
                  vilkår
                </a>
                .
              </div>
            </div>

            {/* RIGHT / SHOWPIECE */}
            <div className="rounded-[2rem] border border-black/12 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.10)] sm:p-5 lg:p-6">
              <HeroLive />
            </div>
          </div>
        </div>

        {/* PRESSURE STRIP */}
        <div className="border-t border-black/15 bg-black text-yellow-300">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.16em] sm:text-xs">
              <span className="inline-flex items-center gap-2 rounded bg-yellow-300 px-2 py-1 text-black">
                <Icon icon={Megaphone} />
                Pågående trykk
              </span>
              <span>Ukens prisfall er aktivt</span>
              <span className="opacity-35">•</span>
              <span>Kampanjen avsluttes snart*</span>
              <span className="opacity-35">•</span>
              <a className="underline" href="/kampanjer">
                Se kampanjer →
              </a>
              <span className="opacity-35">•</span>
              <a className="underline" href="/lager">
                Intern lagerstatus →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SHAREBAIT / ONBOARDING */}
      <ChallengePanel />

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
                Varer under aktiv påvirkning. Prisene er midlertidige. Presset er
                varig.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/kampanjer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:opacity-90"
              >
                Se kampanjer →
              </a>
              <a
                href="/lager"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-5 py-3 text-sm font-black transition hover:bg-black/5"
              >
                Intern lagerstatus
              </a>
            </div>
          </div>
        </div>

        <ProductGrid limit={6} />
      </section>

      {/* PAYOFF LAYER */}
      <section className="border-t border-black/10 bg-[#f5f2e7]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <CampaignMotor />
            <InternalMemo />
          </div>
        </div>
      </section>

      {/* INTERNAL SIGNALS */}
      <section className="border-t border-black/10 bg-[#f0e7ab]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-start">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.22em] opacity-45 sm:text-[11px]">
                Interne signaler
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl md:text-5xl">
                Handelsmaskinen er våken.
              </h2>
            </div>
            <div className="pt-1 text-sm leading-relaxed opacity-70 sm:text-base">
              Prishandel fungerer best når kampanjen pågår, lagersituasjonen er uklar
              og ingen helt vil ta det endelige ansvaret.
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
        </div>
      </section>

      {/* FOOTNOTE / LAST PUSH */}
      <section className="border-t border-black/10 bg-[#f5f2e7]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <PressureCard
              icon={Siren}
              title="Trykk"
              body="Kampanjen fortsetter inntil stemningen svekkes eller utvalget forsvinner."
              tone="yellow"
            />
            <PressureCard
              icon={TriangleAlert}
              title="Avvik"
              body="Kampanjestatus kan avvike fra opplevd kampanjestatus. Begge kan fortsatt brukes."
              tone="white"
            />
            <PressureCard
              icon={ShieldCheck}
              title="Trygghet"
              body="Vi står inne for opplevelsen så langt det lar seg formulere uten juridisk ubehag."
              tone="white"
            />
          </div>
        </div>
      </section>
    </main>
  );
}