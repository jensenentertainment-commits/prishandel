import { Icon } from "./Icon";
import {
  ShoppingCart,
  ReceiptText,
  PackageSearch,
  Share2,
  ArrowRight,
} from "lucide-react";

function StepCard(props: {
  icon: any;
  step: string;
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
            Steg {props.step}
          </div>
          <div className="mt-1 text-sm font-black sm:text-base">{props.title}</div>
          <div className="mt-1 text-sm leading-relaxed opacity-75">{props.body}</div>
        </div>
      </div>
    </div>
  );
}

function OutcomeChip(props: {
  children: React.ReactNode;
  tone?: "black" | "red" | "white";
}) {
  const toneClass =
    props.tone === "red"
      ? "bg-red-600 text-white border-red-700/30"
      : props.tone === "black"
      ? "bg-black text-yellow-300 border-black"
      : "bg-white text-black border-black/12";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] sm:text-[11px] ${toneClass}`}
    >
      {props.children}
    </span>
  );
}

export default function ShareEntry() {
  return (
    <section className="border-t border-b border-black/10 bg-[#f5f2e7]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
          {/* LEFT */}
          <div className="rounded-[2rem] border border-black/12 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <OutcomeChip tone="black">Prøv systemet</OutcomeChip>
              <OutcomeChip tone="red">Spillbar butikk</OutcomeChip>
            </div>

            <div className="mt-5 max-w-2xl">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-45 sm:text-[11px]">
                Delbar utfordring
              </div>

              <h2 className="mt-2 text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl md:text-5xl">
                Kan du faktisk
                <br />
                fullføre et kjøp?
              </h2>

              <p className="mt-4 text-base font-semibold leading-relaxed opacity-75 sm:text-lg">
                Legg en vare i kurven. Gå til kassen. Se om ordren blir stoppet av
                lager, regnskap eller virkeligheten.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-yellow-400 p-4">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]">
                <Icon icon={Share2} />
                Mulige utfall
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <OutcomeChip tone="black">Teoretisk fullført</OutcomeChip>
                <OutcomeChip tone="white">Stoppet av regnskap</OutcomeChip>
                <OutcomeChip tone="red">Intern behandling</OutcomeChip>
                <OutcomeChip tone="black">Levert uten grunnlag</OutcomeChip>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href="/butikk"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
              >
                PRØV Å KJØPE NOE
                <ArrowRight className="h-4 w-4" />
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

          {/* RIGHT */}
          <div className="rounded-[2rem] border border-black/12 bg-white p-5 shadow-sm sm:p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-45 sm:text-[11px]">
              Slik fungerer det
            </div>

            <div className="mt-4 grid gap-3">
              <StepCard
                icon={ShoppingCart}
                step="01"
                title="Finn en vare"
                body="Velg et produkt under aktivt prispress før lageret rekker å bli tydelig."
              />
              <StepCard
                icon={ReceiptText}
                step="02"
                title="Gå til kassen"
                body="Betaling, lager, frakt og god samvittighet behandles som separate spørsmål."
              />
              <StepCard
                icon={PackageSearch}
                step="03"
                title="Følg ordren videre"
                body="Motta ordredetaljer. Spor pakken. Observer hvordan systemet holder ut."
              />
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black text-yellow-300 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] opacity-80">
                Tips
              </div>
              <div className="mt-2 text-sm leading-relaxed text-white">
                Den beste måten å dele Prishandel på er ikke å forklare den. Det er å
                sende noen inn for å prøve å handle.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}