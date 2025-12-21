import VisitorsNow from "@/app/components/VisitorsNow";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-4 text-sm">
        {/* Kundeservice */}
        <div>
          <div className="font-black mb-3">Kundeservice</div>
          <ul className="space-y-2 opacity-80">
            <li><a href="/kontakt" className="hover:underline">Kontakt oss</a></li>
            <li><a href="/levering" className="hover:underline">Levering</a></li>
            <li><a href="/retur" className="hover:underline">Retur & reklamasjon</a></li>
            <li><a href="/faq" className="hover:underline">Ofte stilte spørsmål</a></li>
          </ul>
        </div>

        {/* Om */}
        <div>
          <div className="font-black mb-3">Om Prishandel</div>
          <ul className="space-y-2 opacity-80">
            <li><a href="/om" className="hover:underline">Om oss</a></li>
            <li><a href="/jobb" className="hover:underline">Jobb hos oss</a></li>
            <li><a href="/presse" className="hover:underline">Presse</a></li>
            <li><a href="/intern" className="hover:underline">Driftsstatus</a></li>
          </ul>
        </div>

        {/* Juridisk */}
        <div>
          <div className="font-black mb-3">Vilkår</div>
          <ul className="space-y-2 opacity-80">
            <li><a href="/vilkar" className="hover:underline">Kjøpsvilkår</a></li>
            <li><a href="/personvern" className="hover:underline">Personvern</a></li>
            <li><a href="/cookies" className="hover:underline">Informasjonskapsler</a></li>
          </ul>
        </div>

        {/* Trygg handel */}
        <div>
          <div className="font-black mb-3">Trygg handel</div>
          <div className="space-y-2 opacity-80">
            <div>✔ Sikker betaling*</div>
            <div>✔ Norsk nettbutikk*</div>
            <div>✔ Prisgaranti*</div>
            <div className="text-xs opacity-60 mt-2">
              *I den grad det lar seg gjøre
            </div>
          </div>
        </div>
      </div>

      {/* bunnlinje */}
      <div className="border-t border-black/10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs opacity-70">
          <div>
            © {new Date().getFullYear()} Prishandel · Org.nr: 000 000 000
          </div>
          <VisitorsNow className="opacity-80" />

          <div className="flex flex-wrap gap-4">
            <span>📣 Kampanjer kjøres kontinuerlig</span>
            <span>🧾 Dette er notert</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
