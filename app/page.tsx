// app/page.tsx
import ProductGrid from "./components/ProductGrid";
import { Icon } from "./components/Icon";
import { Truck, Zap, Receipt, CreditCard, Flame, BadgePercent, Timer, ShieldCheck } from "lucide-react";
import { HeroCopy, HeroKicker } from "./components/HeroRotator";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-b from-yellow-300 to-neutral-100 border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-2 items-center">
          {/* LEFT */}
          <div className="space-y-5">
            {/* KICKER ROW */}
            <div className="inline-flex items-center gap-2">
              <span className="rounded bg-black text-yellow-300 px-3 py-1 text-xs font-black">
                SUPERDEAL
              </span>
              <HeroKicker />
            </div>

            {/* COPY (fixed height to prevent jumping) */}
            <div className="min-h-[210px] md:min-h-[240px]">
              <HeroCopy />
            </div>

            {/* DOTS (fake slider indicator) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-black/80" />
                <span className="h-2 w-2 rounded-full bg-black/25" />
                <span className="h-2 w-2 rounded-full bg-black/25" />
                <span className="h-2 w-2 rounded-full bg-black/25" />
              </div>
              <span className="text-xs opacity-60 font-semibold">
                *Sliderkontroll er midlertidig utsolgt
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="/butikk"
                className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90 inline-flex items-center gap-2"
              >
                <Icon icon={BadgePercent} />
                SE TILBUDENE →
              </a>
              <a
                href="/kampanjer"
                className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5 inline-flex items-center gap-2"
              >
                <Icon icon={Flame} />
                DØGNETS DEALS
              </a>
              <span className="text-xs opacity-70 self-center">
                Regnskapsfører er informert.
              </span>
            </div>

            {/* TRUST / FEATURES */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold">
              <div className="rounded bg-white/70 border border-black/10 px-3 py-2 inline-flex items-center gap-2">
                <Icon icon={Truck} />
                Gratis frakt* over 499,-
              </div>
              <div className="rounded bg-white/70 border border-black/10 px-3 py-2 inline-flex items-center gap-2">
                <Icon icon={Zap} />
                Lynrask levering* (noen ganger)
              </div>
              <div className="rounded bg-white/70 border border-black/10 px-3 py-2 inline-flex items-center gap-2">
                <Icon icon={Receipt} />
                Prisgaranti* (i teorien)
              </div>
              <div className="rounded bg-white/70 border border-black/10 px-3 py-2 inline-flex items-center gap-2">
                <Icon icon={CreditCard} />
                Vipps/Klarna* (mentalt)
              </div>
            </div>

            {/* tiny disclaimer */}
            <div className="text-[11px] opacity-60 pt-1">
              *Vilkår gjelder der det passer oss. Les mer i <a className="underline font-semibold" href="/vilkar">vilkår</a>.
            </div>
          </div>

          {/* RIGHT (replace product card) */}
          <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-black text-lg">Kampanjemotor</div>
                <div className="text-xs opacity-70 -mt-0.5">
                  Driftstatus • Aggressiv modus
                </div>
              </div>
              <div className="text-xs font-black rounded bg-green-600 text-white px-2 py-1 inline-flex items-center gap-1">
                <Icon icon={ShieldCheck} /> LIVE
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {/* status cards */}
              <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black inline-flex items-center gap-2">
                      <Icon icon={Timer} />
                      Nedtelling til “slutter snart”
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      Reset skjer automatisk ved refresh (av hensyn til stemningen).
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold opacity-60">Tidsfrist</div>
                    <div className="text-xl font-black tabular-nums">00:00</div>
                  </div>
                </div>

                <div className="mt-3 h-2 rounded bg-black/10 overflow-hidden">
                  <div className="h-full w-[92%] bg-red-600" />
                </div>

                <div className="mt-2 text-[11px] opacity-60">
                  *Kampanjen varer til den ikke gjør det.
                </div>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-sm font-black">Lagerstatus</div>
                <div className="mt-2 flex items-center justify-between text-xs font-semibold">
                  <span>Tilgjengelige varer</span>
                  <span className="rounded bg-black text-white px-2 py-1 font-black">0</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-semibold">
                  <span>Tilbud aktive</span>
                  <span className="rounded bg-yellow-300 px-2 py-1 font-black">Ubegrenset</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-semibold">
                  <span>Regnskapets puls</span>
                  <span className="rounded bg-red-600 text-white px-2 py-1 font-black">HØY</span>
                </div>

                <div className="mt-3 text-xs opacity-70">
                  📣 Marked: “Dette går bra.” <br />
                  🧾 Regnskap: “Dette går.” (punktum)
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="/intern"
                  className="rounded-lg bg-black text-white px-4 py-2 text-sm font-black hover:opacity-90"
                >
                  Intern driftstatus →
                </a>
                <a
                  href="/utsolgt"
                  className="rounded-lg bg-white text-black px-4 py-2 text-sm font-black border border-black/20 hover:bg-black/5"
                >
                  Sjekk lager (0)
                </a>
                <a
                  href="/kampanjer"
                  className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-black hover:opacity-90"
                >
                  Kjør kampanje →
                </a>
              </div>

              <div className="text-[11px] opacity-60">
                *Kampanjemotoren kan avvike fra virkeligheten.
              </div>
            </div>
          </div>
        </div>

        {/* subtle separator / “news strip” */}
        <div className="border-t border-black/10 bg-yellow-200/60">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-2 rounded bg-black text-yellow-300 px-2 py-1 font-black">
              <Icon icon={Flame} /> LIVE
            </span>
            <span className="opacity-80">
              Megasalg pågår — avsluttes snart* 
            </span>
            <span className="opacity-60">
              •
            </span>
            <a className="underline font-black" href="/kampanjer">
              Se kampanjer →
            </a>
            <span className="opacity-60">
              •
            </span>
            <a className="underline font-black" href="/vilkar">
              Les vilkår →
            </a>
          </div>
        </div>
      </section>

      {/* UTVALGTE TILBUD */}
      <ProductGrid
        title="Utvalgte tilbud"
        subtitle="Prisene er midlertidige. Utsolgt er permanent."
        limit={3}
      />
    </main>
  );
}
