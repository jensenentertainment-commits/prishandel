import InfoPage from "../components/InfoPage";

export default function ReturPage() {
  return (
    <InfoPage
      title="Retur & reklamasjon"
      lead="Prishandel behandler retur, angrerett og reklamasjon fortløpende, innenfor rammene av dokumentasjon, vurdering og øvrige forhold som måtte oppstå."
      sections={[
        {
          heading: "Angrerett",
          body: (
            <>
              <p>
                Du kan benytte angrerett innen gjeldende frist, forutsatt at varen fortsatt
                lar seg identifisere som varen du mottok, og at saken ikke allerede har
                utviklet seg i en annen retning internt.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>Returfrist: 30 dager</li>
                <li>Varen må returneres i tilstrekkelig opprinnelig tilstand</li>
                <li>Dokumentasjon kan bli etterspurt ved behov</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Reklamasjon",
          body: (
            <>
              <p>
                Dersom det foreligger feil eller mangler ved varen, kan du sende inn en
                reklamasjon for vurdering. Vurderingen skjer på grunnlag av produkt,
                avvik, dokumentasjon og hvor tydelig problemet lar seg beskrive.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>Reklamasjon må gjelde en konkret mangel</li>
                <li>Bilder, ordreinformasjon og forklaring kan styrke saken</li>
                <li>Videre behandling avgjøres fortløpende</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Refusjon og videre behandling",
          body: (
            <>
              <p>
                Ved godkjent retur eller reklamasjon vil refusjon, omlevering eller annen
                oppfølging bli vurdert. Utfallet påvirkes av grunnlaget i saken og hvilken
                støtte den oppnår i videre behandling.
              </p>
              <p className="mt-3">
                For praktisk hjelp med pågående retur anbefaler vi å starte i kundeservice.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}