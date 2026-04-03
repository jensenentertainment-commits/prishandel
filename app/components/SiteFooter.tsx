import VisitorsNow from "@/app/components/VisitorsNow";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-neutral-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm md:grid-cols-4">
        <div>
          <div className="mb-3 font-black">Hjelp & informasjon</div>
          <ul className="space-y-2 opacity-80">
            <li>
              <a href="/kundeservice" className="hover:underline">
                Kundeservice
              </a>
            </li>
            <li>
              <a href="/kontakt" className="hover:underline">
                Kontakt oss
              </a>
            </li>
            <li>
              <a href="/levering" className="hover:underline">
                Leveringsvilkår
              </a>
            </li>
            <li>
              <a href="/retur" className="hover:underline">
                Retur & angrerett
              </a>
            </li>
            <li>
              <a href="/ordre" className="hover:underline">
                Ordreoversikt
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:underline">
                Generelle spørsmål
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-3 font-black">Om Prishandel</div>
          <ul className="space-y-2 opacity-80">
            <li>
              <a href="/om" className="hover:underline">
                Om oss
              </a>
            </li>
            <li>
              <a href="/jobb" className="hover:underline">
                Jobb hos oss
              </a>
            </li>
            <li>
              <a href="/presse" className="hover:underline">
                Presse
              </a>
            </li>
            <li>
              <a href="/intern" className="hover:underline">
                Driftsstatus
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-3 font-black">Vilkår & grunnlag</div>
          <ul className="space-y-2 opacity-80">
            <li>
              <a href="/vilkar" className="hover:underline">
                Kjøpsvilkår
              </a>
            </li>
            <li>
              <a href="/personvern" className="hover:underline">
                Personvern
              </a>
            </li>
            <li>
              <a href="/cookies" className="hover:underline">
                Informasjonskapsler
              </a>
            </li>
            <li>
              <a href="/vurdering" className="hover:underline">
                Vurdering
              </a>
            </li>
            <li>
              <a href="/retningslinjer" className="hover:underline">
                Retningslinjer
              </a>
            </li>
            <li>
              <a href="/metodikk" className="hover:underline">
                Metodikk
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-3 font-black">Handelsgrunnlag</div>
          <div className="space-y-2 opacity-80">
            <div>Betaling behandles fortløpende</div>
            <div>Tilgjengelighet vurderes løpende</div>
            <div>Prisnivå holdes aggressivt</div>
            <div className="mt-2 text-xs opacity-60">
              Forhold kan endres uten at forholdene nødvendigvis forbedres.
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs opacity-70 md:flex-row md:items-center">
          <div>
            © {new Date().getFullYear()} Prishandel · Org.enhet: aktiv · Utviklet under begrenset kontroll
          </div>

          <VisitorsNow className="opacity-80" />

          <div className="flex flex-wrap gap-4">
            <span>📣 Marked følger utviklingen</span>
            <span>🧾 Regnskap har merknader</span>
            <span>⚖️ Vilkår tolkes fortløpende</span>
          </div>
        </div>
      </div>
    </footer>
  );
}