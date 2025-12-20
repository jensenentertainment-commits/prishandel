import InfoPage from "../components/InfoPage";

export default function OmPage() {
  return (
    <InfoPage
      title="Om oss"
      lead="Prishandel er en nettbutikk dedikert til lave priser, høye løfter og null lager."
      sections={[
        {
          heading: "Vår visjon",
          body: "Å selge varer så billig at tallene må forklares med følelser.",
        },
        {
          heading: "Vår metode",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Kjør kampanje</li>
              <li>Oppdag konsekvens</li>
              <li>Notér konsekvens</li>
              <li>Kjør ny kampanje</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
