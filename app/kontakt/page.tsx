import InfoPage from "../components/InfoPage";

export default function KontaktPage() {
  return (
    <InfoPage
      title="Kontakt oss"
      lead="Prishandel behandler henvendelser fortløpende, med varierende grad av hast, presisjon og praktisk støtte."
      sections={[
        {
          heading: "Kundeservice",
          body: (
            <>
              <p>
                Kundeservice håndterer spørsmål om ordre, levering, retur, betaling og
                øvrige forhold som fortsatt lar seg beskrive som henvendelser.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>Åpningstid: 00:00–24:00, i prinsippet</li>
                <li>Svartid: 2–14 virkedager, avhengig av trykk og tema</li>
                <li>Status: tilgjengelig med forbehold</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Kontaktmetoder",
          body: (
            <>
              <p>
                Du kan kontakte oss via e-post, kundeservice eller andre etablerte flater
                der kommunikasjon fortsatt anses som hensiktsmessig.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>E-post: kundeservice@prishandel.no</li>
                <li>Telefon: vurderes ved behov</li>
                <li>Chat: egnet for raske og delvis automatiserte svar</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Hva skjer etter at du tar kontakt?",
          body: (
            <>
              <p>
                Henvendelsen registreres, vurderes og sendes videre dersom den oppnår
                tilstrekkelig intern støtte. I enkelte tilfeller kan svar komme raskt.
                I andre tilfeller vil svaret først oppstå når saken allerede har endret form.
              </p>
              <p className="mt-3">
                For spørsmål knyttet til levering, retur, betaling eller systemmeldinger
                anbefaler vi å starte i kundeservice.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}