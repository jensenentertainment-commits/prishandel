// app/components/ProductImage.tsx
async function exists(path: string) {
  try {
    const res = await fetch(path, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function ProductImage(props: {
  slug: string;
  title: string;
  className?: string;
}) {
  const src = `/products/${props.slug}.svg`;
  const ok = await exists(src);

  if (ok) {
    return (
      <img
        src={src}
        alt={props.title}
        className={props.className ?? "h-full w-full object-contain"}
      />
    );
  }

  // Fallback som ser ut som “produktfoto ikke tilgjengelig”
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-center">
        <div className="text-xs font-black">Produktbilde</div>
        <div className="text-[11px] opacity-70 mt-1">midlertidig utsolgt</div>
      </div>
    </div>
  );
}
