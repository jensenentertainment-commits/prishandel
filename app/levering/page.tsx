import InfoPage from "../components/InfoPage";

export default function LeveringPage() {
  return (
    <InfoPage
      title="Levering"
      lead="Vi leverer raskt. Med mindre vi ikke leverer."
      sections={[
        {
          heading: "Leveringstid",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Standard: ubestemt</li>
              <li>Ekspress: fortsatt ubestemt</li>
              <li>Hent i butikk: butikken er utsolgt</li>
            </ul>
          ),
        },
        {
          heading: "Frakt",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Gratis frakt* over 499,-</li>
              <li>Spesialfrakt: gjelder abstrakte konsepter</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
