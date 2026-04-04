import { Icon } from "./Icon";
import { Megaphone, BadgePercent, ShieldAlert, ArrowRight } from "lucide-react";

function EntryChip(props: {
  children: React.ReactNode;
  tone?: "black" | "red" | "white";
}) {
  const cls =
    props.tone === "red"
      ? "bg-red-600 text-white border-red-700/30"
      : props.tone === "black"
      ? "bg-black text-yellow-300 border-black"
      : "bg-white text-black border-black/12";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] sm:text-[11px] ${cls}`}
    >
      {props.children}
    </span>
  );
}

function SignalCard(props: {
  icon: any;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] opacity-70">
        <Icon icon={props.icon} />
        {props.title}
      </div>
      <div className="mt-2 text-sm leading-relaxed opacity-80">{props.body}</div>
    </div>
  );
}

export default function CampaignEntry() {
  return (
    <section className="border-t border-black/10 bg-[#f5f2e7]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="rounded-[2rem] border border-black/12 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <EntryChip tone="black">Kampanjeverktøy</EntryChip>
              <EntryChip tone="red">Ny vurdering</EntryChip>
            </div>

            <div className="mt-5 max-w-2xl">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-45 sm:text-[11px]">
                Ekstern initiering
              </div>

              <h2 className="mt-2 text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl md:text-5xl">
                Få kampanjen
                <br />
                vurdert
              </h2>

              <p className="mt-4 text-base font-semibold leading-relaxed opacity-75 sm:text-lg">
                Bygg din egen kampanje og se om den blir godkjent i markedet,
                aktivert ved risiko eller stoppet av regnskap.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-yellow-400 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.16em]">
                Systemet vurderer blant annet
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <EntryChip tone="black">Prispress</EntryChip>
                <EntryChip tone="white">Marginfare</EntryChip>
                <EntryChip tone="red">Intern uenighet</EntryChip>
                <EntryChip tone="black">Kundeillusjon</EntryChip>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href="/kampanje"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
              >
                ÅPNE KAMPANJEVERKTØYET
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/kampanjer"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-5 py-3 text-sm font-black transition hover:bg-black/5"
              >
                SE AKTIVE KAMPANJER
              </a>
            </div>

            <div className="mt-4 text-xs leading-relaxed opacity-60">
              Resultatet kan deles, kopieres og lastes ned som rapport når kampanjen
              er vurdert.
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/12 bg-white p-5 shadow-sm sm:p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-45 sm:text-[11px]">
              Vurderingsgrunnlag
            </div>

            <div className="mt-4 grid gap-3">
              <SignalCard
                icon={Megaphone}
                title="Marked"
                body="Vurderer om kampanjen skaper nok bevegelse til å rettferdiggjøre egen eksistens."
              />
              <SignalCard
                icon={BadgePercent}
                title="Prisnivå"
                body="Rabatten analyseres ikke bare for effekt, men for hvor mye intern uro den kan utløse."
              />
              <SignalCard
                icon={ShieldAlert}
                title="Regnskap"
                body="Avgjør om kampanjen er operativ, betinget eller et rent følelsesmessig overtramp."
              />
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black p-4 text-yellow-300">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] opacity-80">
                Intern melding
              </div>
              <div className="mt-2 text-sm leading-relaxed text-white">
                Prishandel vurderer nå også eksterne kampanjeinitiativ. Utfallet er
                fortsatt ikke nødvendigvis støttet av alle.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}