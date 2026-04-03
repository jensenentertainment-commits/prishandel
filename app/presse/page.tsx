import InfoPage from "../components/InfoPage";

export default function PressePage() {
  return (
    <InfoPage
      title="Presse"
      lead="Her finner du pressemateriell, uttalelser og et konsistent nivå av selvtillit."
      sections={[
        {
          heading: "Pressekontakt",
          body: (
            <>
              <p>
                Pressehenvendelser behandles fortløpende av relevante avdelinger,
                avhengig av innhold, timing og hvem som svarer først.
              </p>
              <p className="mt-3">
                📣 Marked: tilgjengelig • 🧾 Regnskap: opptatt
              </p>
            </>
          ),
        },
        {
          heading: "Om Prishandel",
          body: (
            <p>
              Prishandel er en handelsplattform med fokus på prispress,
              kampanjeintensitet og kontinuerlig bevegelse i markedet. Selskapet
              opererer etter en fast metodikk og vurderer resultater løpende.
            </p>
          ),
        },
        {
          heading: "Uttalelser",
          body: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                “Vi ser positiv utvikling i trykket.” – Markedsavdelingen
              </li>
              <li>
                “Dette er ikke bærekraftig.” – Regnskapsfører
              </li>
              <li>
                “Det viktigste er at det ser ut som det fungerer.” – Ledelsen
              </li>
            </ul>
          ),
        },
        {
          heading: "Logo og profil",
          body: (
            <>
              <p>
                Logo og profil kan benyttes i redaksjonell omtale av Prishandel.
                Materiell gjøres tilgjengelig ved behov.
              </p>
              <p className="mt-3">
                Bruk med varsomhet. Eller konsekvent.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}