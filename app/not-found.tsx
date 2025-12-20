export default function NotFound() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-8">
        <div className="text-xs font-black rounded bg-red-600 text-white px-2 py-1 inline-block">
          404 – UTSOLGT
        </div>

        <h1 className="mt-4 text-4xl font-black">
          Denne siden finnes ikke.
          <span className="block">Men det gjør kampanjen.</span>
        </h1>

        <p className="mt-3 opacity-80">
          Vi fant dessverre ikke det du lette etter. Men siden du først er her:
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/butikk"
            className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90"
          >
            SE TILBUDENE →
          </a>
          <a
            href="/"
            className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
          >
            TILBAKE TIL FORSIDEN
          </a>
          <span className="text-xs opacity-70 self-center">
            Regnskapsfører er informert.
          </span>
        </div>
      </div>
    </main>
  );
}
