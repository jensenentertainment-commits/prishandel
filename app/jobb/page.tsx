import InfoPage from "../components/InfoPage";

export default function JobbPage() {
  return (
    <InfoPage
      title="Jobb hos oss"
      lead="Vi søker folk som tåler tempo, kampanje og regneark."
      sections={[
        {
          heading: "Ledige stillinger",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Kampanjeansvarlig (fast midlertidig)</li>
              <li>Regnskapsfører (krav: tykk hud)</li>
              <li>Kundeservice (krav: tåle autosvar)</li>
            </ul>
          ),
        },
        {
          heading: "Slik søker du",
          body: "Send søknad. Vi vurderer den når den er tilgjengelig.",
        },
      ]}
    />
  );
}
