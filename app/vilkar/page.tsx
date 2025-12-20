import InfoPage from "../components/InfoPage";

export default function VilkarPage() {
  return (
    <InfoPage
      title="Kjøpsvilkår"
      lead="Disse vilkårene gjelder så langt det er praktisk mulig."
      sections={[
        {
          heading: "Pris",
          body: "Priser kan endres uten varsel. Varsel kan også endres uten varsel.",
        },
        {
          heading: "Tilgjengelighet",
          body: "Alle varer er utsolgt. Dette er en designbeslutning.",
        },
        {
          heading: "Betaling",
          body: "Vipps/Klarna* støttes mentalt.",
        },
      ]}
    />
  );
}
