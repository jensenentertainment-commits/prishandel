import Link from "next/link";
import { RECOMMENDED } from "../lib/products";
import ProductImage from "./ProductImage";

export default function CustomersAlsoBought(props: { excludeSlug?: string }) {
  const items = RECOMMENDED.filter((p) => p.slug !== props.excludeSlug).slice(0, 4);

  return (
    <section className="rounded-2xl border border-black/12 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Kunder kjøpte også</h2>
          <p className="mt-1 text-sm opacity-70">
            Basert på kjøp vi antar skjedde.
          </p>
        </div>

        <Link
          href="/kampanjer"
          className="text-sm font-black underline decoration-2"
        >
          Se flere “anbefalinger” →
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/produkt/${p.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/12 bg-[#f7f4ea] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
          >
            <div className="relative border-b border-black/10 bg-white p-4">
              <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-300">
                Anbefalt
              </span>

              <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                getBadge(p.now, p.before)
              </span>

              <div className="flex h-40 items-center justify-center">
                <ProductImage slug={p.slug} title={p.title} />
              </div>
            </div>

            <div className="min-h-[124px]">
  <h3 className="text-xl font-black leading-tight">{p.title}</h3>
  <p className="mt-2 line-clamp-2 text-sm opacity-75">{p.short}</p>
</div>

<div className="mt-4 flex items-end justify-between gap-3">
  <div className="text-xs opacity-60 line-through">{p.before},-</div>
  <div className="text-2xl font-black text-red-600">{p.now},-</div>
</div>

<div className="mt-3 text-sm font-semibold opacity-75">
  Lagerstatus: 0
</div>

<div className="mt-auto pt-4">
  <div className="rounded-xl bg-black px-4 py-3 text-center text-sm font-black text-yellow-300 transition group-hover:opacity-90">
    Se produkt →
  </div>

            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 text-xs opacity-60">
        📣 Marked: “Anbefalt for deg.” 🧾 Regnskap: “Anbefalt å loggføre.”
      </div>
    </section>
  );
}