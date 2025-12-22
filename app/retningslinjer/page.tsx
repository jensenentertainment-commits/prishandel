import InfoPage from "../components/InfoPage";

export default function RetningslinjerPage() {
  return (
    <InfoPage
      title="Retningslinjer"
      lead="Retningslinjene gjelder for alle besøkende, kjøpende og vurderende parter. Unntak kan forekomme."
      sections={[
        {
          heading: "Kjøpsplikt (anbefalt)",
          body: (
            <p>
              Prishandel anbefaler gjennomføring av kjøp. Manglende kjøp kan oppfattes som
              uavklart intensjon og kan påvirke videre vurdering.
            </p>
          ),
        },
        {
          heading: "Oppførsel i handlekurv",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Legg til varer med verdighet</li>
              <li>Fjern varer kun ved tungtveiende årsak</li>
              <li>Endring av antall skal kunne begrunnes (internt)</li>
              <li>Handlekurven er ikke et forslag, men en tilstand</li>
            </ul>
          ),
        },
        {
          heading: "Kampanjer og rabatter",
          body: (
            <p>
              Kampanjer kan være aktive selv når de ikke oppleves. Rabatter kan vises uten å gi
              lettelse. Dette er i tråd med god praksis.
            </p>
          ),
        },
        {
          heading: "Levering",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Forventet levering: Tilstrekkelig</li>
              <li>Leveringsstatus: Under avklaring</li>
              <li>Sporing: Mentalt tilgjengelig</li>
            </ul>
          ),
        },
        {
          heading: "Salg (operativ anbefaling)",
          body: (
            <p>
              Ved tvil anbefales økt kurvverdi. Høyere kurvverdi signaliserer besluttsomhet og kan
              redusere intern friksjon.
            </p>
          ),
        },
        {
          heading: "Avsluttende bestemmelse",
          body: (
            <p>
              Retningslinjene gjelder i den grad de lar seg gjøre. Dersom de ikke lar seg gjøre,
              gjelder de likevel.
            </p>
          ),
        },
      ]}
    />
  );
}
