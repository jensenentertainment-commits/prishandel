// app/page.tsx
import ProductGrid from "./components/ProductGrid";
import { Icon } from "./components/Icon";
import {
  Truck,
  Zap,
  CreditCard,
  Flame,
  BadgePercent,
  Timer,
  ShieldCheck,
  Siren,
  TriangleAlert,
  Megaphone,
  Receipt,
  BadgeAlert,
  CircleAlert,
} from "lucide-react";
import CampaignMotor from "./components/CampaignMotor";
import HeroLive from "./components/HeroLive";

function PromoChip(props: { label: string; value?: string; tone?: "black" | "white" | "red" | "green" }) {
  const toneClass =
    props.tone === "red"
      ? "bg-red-600 text-white border-red-700/40"
      : props.tone === "green"
      ? "bg-green-500 text-white border-green-600/40"
      : props.tone === "black"
      ? "bg-black text-yellow-300 border-black"
      : "bg-white text-black border-black/12";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] shadow-sm ${toneClass}`}>
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
      <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] opacity-85">
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
      <div className="text-[11px] font-black uppercase tracking-[0.22em] opacity-50">
        {props.label}
      </div>
      <div className="mt-2 text-lg font-black leading-tight">{props.value}</div>
      <div className="mt-2 text-sm leading-relaxed opacity-72">{props.note}</div>
    </div>
  );
}

function AlertRow() {
  return (
    <div className="rounded-2xl border border-black/12 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] opacity-55">
        <Icon icon={BadgeAlert} />
        Prisvarsel
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-[#f7f4ea] p-3">
          <div className="text-xs font-black uppercase tracking-wide opacity-55">Sist observert</div>
          <div className="mt-2 text-xl font-black">Prisfall</div>
          <div className="mt-1 text-sm opacity-70">Registrert uten ro.</div>
        </div>
        <div className="rounded-xl border border-black/10 bg-[#f7f4ea] p-3">
          <div className="text-xs font-black uppercase tracking-wide opacity-55">Tiltak</div>
          <div className="mt-2 text-xl font-black">Fortsetter</div>
          <div className="mt-1 text-sm opacity-70">Kampanjen anses fortsatt operativ.</div>
        </div>
        <div className="rounded-xl border border-black/10 bg-[#f7f4ea] p-3">
          <div className="text-xs font-black uppercase tracking-wide opacity-55">Konsekvens</div>
          <div className="mt-2 text-xl font-black">Trykk</div>
          <div className="mt-1 text-sm opacity-70">Lettelse er ikke planlagt.</div>
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
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
            <div className="rounded-[2rem] border border-black/15 bg-[#f5f2e7] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <PromoChip label="Aktiv handelsstatus" tone="black" />
                <PromoChip label="Live" value="pågår" tone="red" />
                <PromoChip label="Regnskap" value="varslet" tone="white" />
              </div>

              <div className="mt-5 max-w-3xl">
                <div className="text-[11px] font-black uppercase tracking-[0.28em] opacity-45">
                  Prishandel.no
                </div>

                <h1 className="mt-3 text-5xl font-black leading-[0.86] tracking-[-0.06em] md:text-7xl">
                  Prisene ned.
                  <br />
                  Verdigheten også.
                </h1>

                <p className="mt-5 max-w-2xl text-lg font-semibold leading-relaxed text-black/74">
                  Kampanjen pågår. Vi justerer underveis. Resultatet vurderes senere.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-black/15 bg-yellow-400 px-4 py-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em]">
                  <span className="inline-flex items-center gap-2 rounded bg-black px-2 py-1 text-yellow-300">
                    <Icon icon={Flame} />
                    Kampanje aktiv
                  </span>
                  <span>Varighet uklar</span>
                  <span className="opacity-35">•</span>
                  <span>Prisfall registrert</span>
                  <span className="opacity-35">•</span>
                  <span>Utsolgt tolkes fortsatt offensivt</span>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-black/12 bg-white p-4 shadow-sm">
                <HeroLive />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PressureCard
                  icon={Truck}
                  title="Frakt"
                  body="Gratis over 499,-. Under 499,- finnes det fortsatt håp."
                  tone="white"
                />
                <PressureCard
                  icon={Zap}
                  title="Levering"
                  body="Lynrask* der logistikk, vilje og klima tillater det."
                  tone="white"
                />
                <PressureCard
                  icon={BadgePercent}
                  title="Pris"
                  body="Gjelder i teorien. Teorien kan bli justert."
                  tone="yellow"
                />
                <PressureCard
                  icon={CreditCard}
                  title="Betaling"
                  body="Vipps/Klarna* mentalt. Kasseløsning er fortsatt offensiv."
                  tone="red"
                />
              </div>

              <div className="mt-4 text-[11px] opacity-60">
                *Vilkår gjelder der det passer oss. Les mer i{" "}
                <a className="font-black underline" href="/vilkar">
                  vilkår
                </a>
                .
              </div>
            </div>

            <div className="space-y-4">
              <CampaignMotor />

              <div className="rounded-2xl border border-black bg-black p-5 text-yellow-300 shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.22em] opacity-70">
                      Intern handelsmelding
                    </div>
                    <div className="mt-2 text-2xl font-black leading-tight text-white">
                      Kampanjen fortsetter,
                      <br />
                      selv ved tvil.
                    </div>
                  </div>
                  <span className="rounded bg-yellow-300 px-2 py-1 text-[11px] font-black uppercase tracking-wide text-black">
                    Operativt
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm leading-relaxed text-white/82">
                  <div>📣 Marked: “Vi trenger bare mer trykk.”</div>
                  <div>🧾 Regnskap: “Vi trenger mindre aktivitet.”</div>
                  <div>⚠️ Ledelsen: “Begge anses som innspill.”</div>
                </div>
              </div>

              <AlertRow />
            </div>
          </div>
        </div>

        {/* PRESSURE STRIP */}
        <div className="border-t border-black/15 bg-black text-yellow-300">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
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
              <a className="underline" href="/vilkar">
                Les vilkår →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNAL SIGNALS */}
      <section className="border-b border-black/10 bg-[#f5f2e7]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-start">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] opacity-45">
                Interne signaler
              </div>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] md:text-5xl">
                Handelsmaskinen er våken.
              </h2>
            </div>
            <div className="pt-1 text-base leading-relaxed opacity-70">
              Prishandel fungerer best når kampanjen pågår, lagersituasjonen er uklar og ingen helt vil ta det endelige ansvaret.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <InternalSignal
              label="Kampanjetrykk"
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

      {/* PRODUCTS */}
      <section className="bg-[#f0e7ab]">
        <div className="max-w-6xl mx-auto px-4 pt-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] opacity-45">
                Aktivt utvalg
              </div>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] md:text-5xl">
                Varer under aktiv påvirkning
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed opacity-72">
                Prisene er midlertidige. Trykket er permanent. Utsolgt tolkes fortsatt offensivt.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/kampanjer"
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:opacity-90"
              >
                Se kampanjer →
              </a>
              <a href="/lager" className="inline-flex items-center gap-2 py-3 text-sm font-black underline">
                Intern lagerstatus
              </a>
            </div>
          </div>
        </div>

        <ProductGrid limit={6} showSearch={false} />
      </section>

      {/* FOOTNOTE AREA */}
      <section className="border-t border-black/10 bg-[#f5f2e7]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <PressureCard
              icon={Timer}
              title="Tidsvindu"
              body="Tilbudet avsluttes snart. “Snart” er operativt, ikke nødvendigvis målbart."
              tone="white"
            />
            <PressureCard
              icon={TriangleAlert}
              title="Avvik"
              body="Kampanjestatus kan avvike fra opplevd kampanjestatus. Begge kan være gyldige."
              tone="yellow"
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
