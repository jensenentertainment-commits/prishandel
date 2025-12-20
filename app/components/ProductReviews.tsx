import { getReviews, ratingSummary, helpfulVotes } from "../lib/reviews";

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-1" aria-label={`${value} av 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "opacity-100" : "opacity-30"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductReviews({ slug }: { slug: string }) {
  const reviews = getReviews(slug, 5);
  const sum = ratingSummary(reviews);

  return (
    <section className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xl font-black">Anmeldelser</div>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <div className="text-base font-black">{sum.avg}</div>
            <div className="text-yellow-600 font-black">
              <Stars value={sum.avg} />
            </div>
            <div className="opacity-70">({sum.total} anmeldelser)</div>
          </div>
          <div className="text-xs opacity-70 mt-2">
            *“Verifisert kjøp” betyr at noen vurderte å kjøpe.
          </div>
        </div>

        <a
          href="/kampanjer"
          className="inline-flex items-center justify-center rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-black hover:opacity-90"
        >
          SKRIV ANMELDELSE → (utsolgt)
        </a>
      </div>

      <div className="mt-6 grid gap-4">
        {reviews.map((r) => {
          const votes = helpfulVotes(slug, r.id);

          return (
            <div key={r.id} className="rounded-xl border border-black/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-black">{r.title}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {r.name} · {r.date}
                    {r.verified ? (
                      <span className="ml-2 rounded bg-neutral-100 border border-black/10 px-2 py-0.5 font-semibold">
                        Verifisert kjøp*
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="text-yellow-600 font-black">
                  <Stars value={r.rating} />
                </div>
              </div>

              <div className="mt-3 text-sm opacity-80 leading-relaxed">
                {r.body}
              </div>

              <div className="mt-3 text-xs opacity-70 flex items-center gap-3 flex-wrap">
                <span>Hjalp dette?</span>
                <span className="rounded bg-neutral-100 border border-black/10 px-2 py-0.5 font-semibold">
                  Ja ({votes.up})
                </span>
                <span className="rounded bg-neutral-100 border border-black/10 px-2 py-0.5 font-semibold">
                  Nei ({votes.down})
                </span>
                <span className="ml-auto opacity-60">Rapporter (utsolgt)</span>
              </div>

              <div className="mt-3 text-xs opacity-60">
                📣 Marked: “Kjempefornøyd.” 🧾 Regnskap: “Dette er notert.”
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
