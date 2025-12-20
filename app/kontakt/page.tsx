import InfoPage from "../components/InfoPage";

export default function KontaktPage() {
  return (
    <InfoPage
      title="Kontakt oss"
      lead="Vi svarer så raskt vi kan. Noen ganger svarer vi før du spør."
      sections={[
        {
          heading: "Kundeservice",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Åpningstid: 00:00–24:00*</li>
              <li>Svartid: 2–14 virkedager*</li>
              <li>Status: Midlertidig utsolgt</li>
            </ul>
          ),
        },
        {
          heading: "Kontaktmetoder",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>E-post: kundeservice@prishandel.no*</li>
              <li>Telefon: Vi ringer deg når vi får det til</li>
              <li>Chat: anbefales for autosvar</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
