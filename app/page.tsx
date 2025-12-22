// app/page.tsx
import ProductGrid from "./components/ProductGrid";
import { Icon } from "./components/Icon";
import { Truck, Zap, Receipt, CreditCard, Flame, BadgePercent, Timer, ShieldCheck } from "lucide-react";
import { HeroCopy, HeroKicker } from "./components/HeroRotator";
import CampaignMotor from "./components/CampaignMotor";
import HeroLive from "./components/HeroLive";


export default function Home() {
  return (
    <main>
      {/* HERO + MOTOR */}
      <section className="bg-yellow-200/60 border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* LEFT: HERO (levende) */}
            <div className="rounded-2xl border border-black/10 bg-white/70 p-6">
              <HeroLive />

              {/* TRUST / FEATURES */}
              <div className="grid grid-cols-2 gap-2 pt-4 text-xs font-semibold">
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
              <div className="text-[11px] opacity-60 pt-2">
                *Vilkår gjelder der det passer oss. Les mer i{" "}
                <a className="underline font-semibold" href="/vilkar">
                  vilkår
                </a>
                .
              </div>
            </div>

            {/* RIGHT: CAMPAIGN MOTOR */}
            <div className="lg:pt-0">
              <CampaignMotor />
            </div>
          </div>
        </div>

        {/* subtle separator / “news strip” */}
        <div className="border-t border-black/10 bg-yellow-200/60">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-2 rounded bg-black text-yellow-300 px-2 py-1 font-black">
              <Icon icon={Flame} /> LIVE
            </span>
            <span className="opacity-80">Megasalg pågår — avsluttes snart*</span>
            <span className="opacity-60">•</span>
            <a className="underline font-black" href="/kampanjer">
              Se kampanjer →
            </a>
            <span className="opacity-60">•</span>
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
