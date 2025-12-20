import { RECOMMENDED } from "../lib/products";
import ProductImage from "./ProductImage";

export default function CustomersAlsoBought(props: { excludeSlug?: string }) {
  const items = RECOMMENDED.filter((p) => p.slug !== props.excludeSlug).slice(0, 4);

  return (
    <section className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xl font-black">Kunder kjøpte også</div>
          <div className="text-sm opacity-70">
            Basert på kjøp vi antar skjedde.
          </div>
        </div>
        <a href="/kampanjer" className="text-sm font-black underline decoration-2">
          Se flere “anbefalinger” →
        </a>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <a
            key={p.slug}
            href={`/produkt/${p.slug}`}
            className="rounded-2xl border border-black/10 bg-neutral-50 hover:bg-white hover:shadow-sm transition overflow-hidden"
          >
    <div className="h-28 border-b border-black/10 bg-white p-3 overflow-hidden flex items-center justify-center">
  <ProductImage slug={p.slug} title={p.title} />
</div>
<div className="text-[10px] opacity-50 mt-1">
  Leverandør jobber med saken
</div>

            <div className="p-4">
              <div className="text-xs font-black rounded bg-yellow-300 px-2 py-1 inline-block">
                {p.badge}
              </div>
              <div className="mt-2 font-black">{p.title}</div>
              <div className="mt-1 text-xs opacity-70">Lagerstatus: 0</div>

              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-sm line-through opacity-50">{p.before},-</div>
                <div className="text-lg font-black text-red-600">{p.now},-</div>
              </div>

              <div className="mt-3 rounded-lg bg-black text-white text-center py-2 text-sm font-black opacity-40">
                LEGG I KURV (UTSOLGT)
              </div>

              <div className="mt-2 text-xs opacity-70">{p.note}</div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 text-xs opacity-60">
        📣 Marked: “Anbefalt for deg.” 🧾 Regnskap: “Anbefalt å loggføre.”
      </div>
    </section>
  );
}
