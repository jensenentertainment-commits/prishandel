// app/kasse/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  function handleFinish() {
    const id = `PH-${Math.floor(Math.random() * 900000 + 100000)}`;
    router.push(`/ordre/${id}`);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Kasse</h1>
          <p className="text-sm opacity-70">
            Skriv inn detaljer. Vi lover å ignorere dem profesjonelt.
          </p>
        </div>
        <a href="/kurv" className="text-sm font-black underline decoration-2">
          Tilbake til kurv →
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px]">
        <section className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <div className="text-lg font-black">Leveringsinformasjon</div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Fornavn" placeholder="Kampanje" />
            <Field label="Etternavn" placeholder="Kunde" />
            <Field label="E-post" placeholder="kunde@eksempel.no" />
            <Field label="Telefon" placeholder="99 99 99 99" />
            <div className="sm:col-span-2">
              <Field label="Adresse" placeholder="Ubestemt 0" />
            </div>
            <Field label="Postnummer" placeholder="0000" />
            <Field label="Poststed" placeholder="Teori" />
          </div>

          <div className="mt-6 text-lg font-black">Betaling</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <PayOption title="Vipps" note="Aktivert mentalt" />
            <PayOption title="Klarna" note="Tilgjengelig i teorien" />
          </div>

          <div className="mt-6 rounded-xl bg-neutral-50 border border-black/10 p-4">
            <div className="text-sm font-black">🧾 Regnskap</div>
            <div className="mt-1 text-sm opacity-80">
              Lagerstatus er 0. Vi gjennomfører likevel stegene for å vise
              prosess.
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="mt-6 block w-full rounded-xl bg-black text-white px-4 py-3 font-black text-center hover:opacity-90"
          >
            FULLFØR KJØP →
          </button>

          <div className="mt-3 text-xs opacity-60">
            Ved å fullføre godtar du vilkår, personvern og realiteter.
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
            <div className="font-black">Ordresammendrag</div>
            <div className="mt-2 text-sm opacity-80">
              3 varer • Delsum beregnes • Resultat: utsolgt
            </div>

            <div className="mt-4 rounded-xl bg-yellow-300 border border-black/10 p-4">
              <div className="text-sm font-black">📣 Marked</div>
              <div className="mt-1 text-sm">
                “Bare ett klikk igjen!” (🧾 “som forventet”)
              </div>
            </div>

            <div className="mt-3 text-xs opacity-60">
              Tips: Se kampanjer. De er alltid aktive.
            </div>

            <a
              href="/kampanjer"
              className="mt-4 block rounded-xl bg-red-600 text-white px-4 py-3 font-black text-center hover:opacity-90"
            >
              TIL KAMPANJER →
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field(props: { label: string; placeholder: string }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold">{props.label}</span>
      <input
        placeholder={props.placeholder}
        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
      />
    </label>
  );
}

function PayOption(props: { title: string; note: string }) {
  return (
    <div className="rounded-xl border border-black/10 p-4">
      <div className="font-black">{props.title}</div>
      <div className="text-xs opacity-70 mt-1">{props.note}</div>
      <div className="mt-3 rounded-lg bg-neutral-100 border border-black/10 px-3 py-2 text-xs font-semibold">
        Valgt automatisk*
      </div>
    </div>
  );
}
