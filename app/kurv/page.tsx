// app/kurv/page.tsx
import { getAllProducts, getLeaks, getBadge } from "../lib/products";
import CartClient from "./CartClient";

function seedSlugs() {
  return ["verdighet-premium", "mot-limited", "fomo-abonnement"];
}

export default function CartPage() {
  const all = getAllProducts();

  const products = all.map((p) => ({
    slug: p.slug,
    title: p.title,
    now: p.now,
    before: p.before,
    badge: getBadge(p.now, p.before),
    note: p.note,
    leak: getLeaks(p.slug, 1)[0] ?? "—",
  }));

  return <CartClient products={products} />;
}
