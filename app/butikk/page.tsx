// app/butikk/page.tsx
import ProductGrid from "../components/ProductGrid";

export default function ButikkPage() {
  return (
    <ProductGrid
      title="Butikk"
      subtitle="Sortér etter pris, popularitet eller ren desperasjon."
    />
  );
}
