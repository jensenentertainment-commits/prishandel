// app/produkt/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getProduct, getLeaks } from "../../lib/products";
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
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* breadcrumbs */}
      <div className="text-xs opacity-70">
        <a href="/" className="hover:underline">Hjem</a>
        <span className="px-2">/</span>
        <a href="/butikk" className="hover:underline">Butikk</a>
        <span className="px-2">/</span>
        <span className="opacity-90">{p.title}</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        {/* Left: image + info */}
        <section className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          {/* image placeholder */}
        <div className="h-28 border-b border-black/10 bg-white p-3 overflow-hidden flex items-center justify-center">
       <ProductImage slug={p.slug} title={p.title} />
     </div>
     <div className="text-[10px] opacity-50 mt-1">
       Leverandør jobber med saken
     </div>

          <div className="p-6">
            <h1 className="text-3xl font-black tracking-tight">{p.title}</h1>
            <p className="mt-2 text-sm opacity-80 max-w-2xl">{p.short}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoBox title="Levering">
                <span className="font-semibold">Ubestemt</span>
                <div className="text-xs opacity-70 mt-1">
                  📣 Marked: “Rett rundt hjørnet.” <br />
                  🧾 Regnskap: “Som forventet.”
                </div>
              </InfoBox>

              <InfoBox title="Retur & reklamasjon">
                <span className="font-semibold">Avhenger av virkeligheten</span>
                <div className="text-xs opacity-70 mt-1">
                  🧾 “Gjelder ikke abstrakte konsepter.”
                </div>
              </InfoBox>
            </div>

            <div className="mt-6 rounded-2xl bg-neutral-50 border border-black/10 p-4">
              <div className="text-xs font-black">🧾 Regnskap</div>
              <div className="mt-1 text-sm opacity-80">{p.note}</div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-black">Produktdetaljer</div>
              <ul className="mt-2 grid gap-2">
                {p.details.map((d) => (
                  <li
                    key={d}
                    className="rounded-xl bg-white border border-black/10 px-4 py-3 text-sm"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-xs opacity-60">
              *Pris, tilgjengelighet og livsvalg kan avvike fra virkeligheten.
            </div>
          </div>
        </section>

        {/* Right: purchase box */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-black opacity-70">Pris</div>
                <div className="mt-1 text-3xl font-black">{p.now},-</div>
                <div className="text-sm opacity-60 line-through">
                  {p.before},-
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black opacity-70">Status</div>
                <div className="mt-1 inline-flex rounded-full bg-black text-white px-3 py-1 text-xs font-black">
                  UTSOLGT
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <AddToCartOnProduct slug={p.slug} />

              <a
                href="/kampanjer"
                className="rounded-xl bg-red-600 text-white px-4 py-3 font-black text-center hover:opacity-90"
              >
                Se kampanjer i stedet →
              </a>
              <a
                href="/kontakt"
                className="rounded-xl bg-white text-black px-4 py-3 font-black text-center border border-black/20 hover:bg-black/5"
              >
                Spør kundeservice (utsolgt)
              </a>
            </div>

            <div className="mt-4 rounded-xl bg-yellow-300 border border-black/10 p-4">
              <div className="text-sm font-black">📣 Marked</div>
              <div className="mt-1 text-sm">
                “Hvis den er utsolgt, betyr det at den er populær.”
              </div>
              <div className="mt-2 text-[11px] opacity-70">
                🧾 Regnskap: “Dette er notert.”
              </div>
            </div>

            <div className="mt-4 text-xs opacity-60">
              Betaling: Vipps/Klarna* • Frakt: gratis* • Trygg handel: nesten
            </div>
          </div>
          {/* Internlogg (uoffisiell) */}
<div className="mt-6 rounded-2xl bg-neutral-50 border border-black/10 p-6">
  <div className="flex items-center justify-between gap-3">
    <div className="text-sm font-black">Internlogg (uoffisiell)</div>
    <div className="text-[11px] font-semibold opacity-60">
      Kilde: “systemet”
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

<div className="mt-6">
  <CustomersAlsoBought excludeSlug={p.slug} />
</div>
<div className="mt-6">
  <ProductReviews slug={p.slug} />
</div>
          {/* “Anbefalt sammen med” */}
          <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
            <div className="text-sm font-black">Kjøpes ofte sammen med</div>
            <div className="mt-2 text-sm opacity-80">
              Tålmodighet, Sunn fornuft og en kampanje du ikke trenger.
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href="/butikk"
                className="rounded-xl bg-white text-black px-4 py-3 font-black border border-black/20 hover:bg-black/5"
              >
                Tilbake til butikk
              </a>
              <a
                href="/kampanjer"
                className="rounded-xl bg-red-600 text-white px-4 py-3 font-black hover:opacity-90"
              >
                Finn mer utsolgt →
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function InfoBox(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-black/10 p-4">
      <div className="text-xs font-black opacity-70">{props.title}</div>
      <div className="mt-1 text-sm">{props.children}</div>
    </div>
  );
}
