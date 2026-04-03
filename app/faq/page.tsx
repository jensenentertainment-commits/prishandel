import InfoPage from "../components/InfoPage";

export default function FaqPage() {
  return (
    <InfoPage
      title="Ofte stilte spørsmål"
      lead="Svarene er korrekte i teorien og løpende justert etter forholdene."
      sections={[
        {
          heading: "Har dere varen på lager?",
          body: (
            <>
              <p>
                Ikke nødvendigvis. Varen kan være tilgjengelig som pris,
                kampanje og kjøpsmulighet uten å være fysisk til stede.
              </p>
              <p className="mt-2 text-sm opacity-70">
                Lagerstatus vurderes fortløpende.
              </p>
            </>
          ),
        },
        {
          heading: "Når kommer den inn igjen?",
          body: (
            <>
              <p>
                Når forholdene tilsier det. Dette inkluderer markedets behov,
                systemets kapasitet og en viss grad av faktisk tilgjengelighet.
              </p>
            </>
          ),
        },
        {
          heading: "Hvorfor er alt utsolgt?",
          body: (
            <>
              <p>
                Vi prioriterer lave priser over stabile lagernivåer. Dette kan
                føre til at etterspørselen oppstår før tilbudet er ferdig
                definert.
              </p>
            </>
          ),
        },
        {
          heading: "Kan jeg stole på at bestillingen min blir levert?",
          body: (
            <>
              <p>
                📣 Marked: “Ja, dette går fint.”
              </p>
              <p>
                🧾 Regnskap: “Dette bør vurderes nærmere.”
              </p>
              <p>
                ⚖️ System: “Ordren er registrert.”
              </p>
            </>
          ),
        },
        {
          heading: "Hva betyr «under behandling»?",
          body: (
            <>
              <p>
                Det betyr at ordren har oppnådd et nivå der den ikke kan
                ignoreres, men heller ikke kan fullføres uten videre.
              </p>
            </>
          ),
        },
        {
          heading: "Kan jeg kansellere en ordre?",
          body: (
            <>
              <p>
                Ja. Ordre kan kanselleres frem til de eventuelt ikke lenger lar
                seg identifisere som ordre.
              </p>
            </>
          ),
        },
        {
          heading: "Hvordan fungerer betaling?",
          body: (
            <>
              <p>
                Betaling behandles i forbindelse med ordrebehandling. I enkelte
                tilfeller kan betaling bli vurdert uten at dette fører til
                levering.
              </p>
            </>
          ),
        },
        {
          heading: "Hva hvis jeg ikke mottar varen?",
          body: (
            <>
              <p>
                Dersom en vare ikke mottas, vil dette normalt være i tråd med
                leveringsforutsetningene slik de forelå på bestillingstidspunktet.
              </p>
            </>
          ),
        },
        {
          heading: "Er dette en ekte nettbutikk?",
          body: (
            <>
              <p>📣 Marked: “Ja.”</p>
              <p>🧾 Regnskap: “Dette er et spørsmål.”</p>
              <p>⚖️ Virkelighet: “Avventer.”</p>
            </>
          ),
        },
      ]}
    />
  );
}