// app/produkt/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getLeaks, formatNok } from "../../lib/products";
import CustomersAlsoBought from "../../components/CustomersAlsoBought";
import ProductImage from "../../components/ProductImage";
import ProductReviews from "../../components/ProductReviews";
import AddToCartOnProduct from "../../components/cart/AddToCartOnProduct";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const p = getProduct(slug);
  if (!p) return notFound();

  return (
    <main className="bg-[#f5efcf] text-black">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="text-xs font-semibold opacity-70">
          <Link href="/" className="hover:underline">
            Hjem
          </Link>
          <span className="px-2">/</span>
          <Link href="/butikk" className="hover:underline">
            Butikk
          </Link>
          <span className="px-2">/</span>
          <span className="opacity-90">{p.title}</span>
        </div>

        <div className="mt-5 rounded-2xl border border-black/12 bg-yellow-400 px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em]">
            <span className="rounded bg-black px-2 py-1 text-yellow-300">
              Kampanje aktiv
            </span>
            <span>Prisfall registrert</span>
            <span className="opacity-35">•</span>
            <span>Varighet uklar</span>
            <span className="opacity-35">•</span>
            <span>Produktstatus uavklart</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="overflow-hidden rounded-2xl border border-black/12 bg-white shadow-sm">
            <div className="border-b border-black/10 bg-[#f7f4ea] p-5">
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white p-4 md:h-80">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-black px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-300">
                    getBadge(p.now, p.before)
                  </span>
                  <ProductImage slug={p.slug} title={p.title} />
                </div>

                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] opacity-45">
                    Produkt under kampanje
                  </div>

                  <h1 className="mt-2 text-4xl font-black leading-[0.92] tracking-[-0.04em] md:text-5xl">
                    {p.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
                    {p.short}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <StatusChip label="Lager" value="0" />
                    <StatusChip label="Levering" value="Ubestemt" />
                    <StatusChip label="Kampanje" value="Pågår" />
                  </div>

                  <div className="mt-5 rounded-xl border border-black/10 bg-yellow-400 px-4 py-3">
                    <div className="text-sm font-black">
                      Kampanjen fortsetter også ved tvil.
                    </div>
                    <div className="mt-1 text-sm opacity-80">
                      Produkt, pris og tilgjengelighet vurderes løpende og uavhengig av hverandre.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBox title="Levering">
                  <span className="font-semibold">Ubestemt</span>
                  <div className="mt-1 text-xs opacity-70">
                    📣 Marked: “Rett rundt hjørnet.” <br />
                    🧾 Regnskap: “Som forventet.”
                  </div>
                </InfoBox>

                <InfoBox title="Retur & reklamasjon">
                  <span className="font-semibold">
                    Avhenger av virkeligheten
                  </span>
                  <div className="mt-1 text-xs opacity-70">
                    🧾 Gjelder ikke abstrakte konsepter.
                  </div>
                </InfoBox>
              </div>

              <div className="mt-6 rounded-2xl border border-black/10 bg-[#f7f4ea] p-4">
                <div className="text-xs font-black uppercase tracking-wide opacity-70">
                  Regnskap
                </div>
                <div className="mt-2 text-sm opacity-85">{p.note}</div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-black">Produktdetaljer</div>
                <ul className="mt-3 grid gap-2">
                  {p.details.map((d) => (
                    <li
                      key={d}
                      className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-black">Internlogg (uoffisiell)</div>
                  <div className="text-[11px] font-semibold opacity-60">
                    Kilde: systemet
                  </div>
                </div>

                <ul className="mt-3 space-y-2 text-sm font-semibold">
                  {getLeaks(p.slug, 3).map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="opacity-50">•</span>
                      <span className="opacity-80">{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 text-xs opacity-60">
                  🧾 Regnskap: “Dette skulle ikke vises.” 📣 Marked: “Kjempebra for tillit.”
                </div>
              </div>

              <div className="mt-6 text-xs opacity-60">
                *Pris, tilgjengelighet og livsvalg kan avvike fra virkeligheten.
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-black/12 bg-white shadow-sm">
              <div className="border-b border-black/10 bg-[#f7f4ea] p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide opacity-60">
                      Kampanjepris
                    </div>
                    <div className="mt-2 text-4xl font-black leading-none">
                      {formatNok(p.now)}
                    </div>
                    <div className="mt-2 text-base opacity-60 line-through">
                      {formatNok(p.before)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black uppercase tracking-wide opacity-60">
                      Status
                    </div>
                    <div className="mt-2 inline-flex rounded-full bg-black px-3 py-1 text-xs font-black text-white">
                      UTSOLGT
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-black/10 bg-yellow-400 p-4">
                  <div className="text-sm font-black">📣 Marked</div>
                  <div className="mt-1 text-sm">
                    “Hvis den er utsolgt, betyr det at den er populær.”
                  </div>
                  <div className="mt-2 text-[11px] opacity-70">
                    🧾 Regnskap: “Dette er notert.”
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-2">
                  <AddToCartOnProduct slug={p.slug} />

                  <Link
                    href="/kampanjer"
                    className="rounded-xl bg-red-600 px-4 py-3 text-center font-black text-white hover:opacity-90"
                  >
                    Se kampanjer i stedet →
                  </Link>

                  <Link
                    href="/kontakt"
                    className="rounded-xl border border-black/20 bg-white px-4 py-3 text-center font-black text-black hover:bg-black/5"
                  >
                    Spør kundeservice (utsolgt)
                  </Link>
                </div>

                <div className="mt-5 grid gap-3">
                  <MiniFact label="Betaling" value="Vipps/Klarna* mentalt" />
                  <MiniFact label="Frakt" value="Gratis* der det lar seg forsvare" />
                  <MiniFact label="Trygg handel" value="Nesten" />
                </div>

                <div className="mt-5 text-xs opacity-60">
                  Betaling, frakt og trygghet kan avvike fra faktisk opplevelse.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/12 bg-white p-6 shadow-sm">
              <div className="text-sm font-black">Kjøpes ofte sammen med</div>
              <div className="mt-2 text-sm opacity-80">
                Tålmodighet, sunn fornuft og en kampanje du ikke trenger.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/butikk"
                  className="rounded-xl border border-black/20 bg-white px-4 py-3 font-black hover:bg-black/5"
                >
                  Tilbake til butikk
                </Link>
                <Link
                  href="/kampanjer"
                  className="rounded-xl bg-red-600 px-4 py-3 font-black text-white hover:opacity-90"
                >
                  Finn mer utsolgt →
                </Link>
              </div>
            </div>

            <CustomersAlsoBought excludeSlug={p.slug} />
            <ProductReviews slug={p.slug} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoBox(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide opacity-60">
        {props.title}
      </div>
      <div className="mt-2 text-sm">{props.children}</div>
    </div>
  );
}

function MiniFact(props: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-[#f7f4ea] p-3">
      <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
        {props.label}
      </div>
      <div className="mt-1 text-sm font-semibold">{props.value}</div>
    </div>
  );
}

function StatusChip(props: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black/70 shadow-sm">
      <span>{props.label}</span>
      <span className="text-black">{props.value}</span>
    </div>
  );
}