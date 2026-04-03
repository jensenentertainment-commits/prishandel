import InfoPage from "../components/InfoPage";

export default function RetningslinjerPage() {
  return (
    <InfoPage
      title="Retningslinjer"
      lead="Retningslinjene gjelder for alle besøkende, kjøpende og vurderende parter. Unntak kan forekomme, men påvirker ikke hovedinntrykket av at dette gjelder."
      sections={[
        {
          heading: "Kjøpsplikt (anbefalt)",
          body: (
            <p>
              Prishandel anbefaler gjennomføring av kjøp der forholdene ligger til rette
              for det, eller fremstår som om de kunne ha gjort det. Manglende kjøp kan
              oppfattes som uavklart intensjon og påvirke videre vurdering av både sak og kunde.
            </p>
          ),
        },
        {
          heading: "Oppførsel i handlekurv",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Legg til varer med verdighet</li>
              <li>Fjern varer kun ved tungtveiende årsak</li>
              <li>Endring av antall skal kunne begrunnes internt</li>
              <li>Handlekurven er ikke et forslag, men en tilstand</li>
            </ul>
          ),
        },
        {
          heading: "Kampanjer og rabatter",
          body: (
            <p>
              Kampanjer kan være aktive selv når de ikke oppleves som stabile. Rabatter kan
              vises uten å gi merkbar lettelse. Dette anses forenlig med gjeldende praksis
              så lenge trykket opprettholdes og motstanden ikke blir for eksplisitt.
            </p>
          ),
        },
        {
          heading: "Levering",
          body: (
            <>
              <p>
                Levering vurderes som en prosess, ikke en garanti. Tid, status og fremdrift
                kan derfor variere uten at leveringsforløpet nødvendigvis anses som avbrutt.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>Forventet levering: tilstrekkelig</li>
                <li>Leveringsstatus: under avklaring</li>
                <li>Sporing: tilgjengelig når forholdene tillater det</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Salg (operativ anbefaling)",
          body: (
            <p>
              Ved tvil anbefales økt kurvverdi. Høyere kurvverdi signaliserer besluttsomhet
              og kan redusere intern friksjon, eller i det minste gjøre friksjonen mer meningsfull.
            </p>
          ),
        },
        {
          heading: "Avsluttende bestemmelse",
          body: (
            <p>
              Retningslinjene gjelder i den grad de lar seg gjøre. Dersom de ikke lar seg gjøre,
              gjelder de likevel, med mindre situasjonen tilsier at det er mer praktisk å mene noe annet.
            </p>
          ),
        },
      ]}
    />
  );
}