// app/lib/fight.ts
export type FightSpeaker = "marked" | "regnskap";
export type FightTag = "campaign" | "shipping" | "stock" | "coupon" | "generic";

export type FightLine = {
  speaker: FightSpeaker;
  tag?: FightTag;
  text: string;
  href?: string;
};

export const FIGHTS: FightLine[] = [
  { speaker: "marked", tag: "campaign", text: "DETTE MÅ VEKK! (vi har bare ingenting)", href: "/kampanjer" },
  { speaker: "regnskap", tag: "campaign", text: "Kampanje godkjent under protest. (dokumentert)" },
  { speaker: "marked", tag: "stock", text: "UTSOLGT NÅ — MEN DET ER TILBUD UANSETT", href: "/kampanjer" },
  { speaker: "regnskap", tag: "stock", text: "Vi minner om lagerstatus: 0. Igjen." },
  { speaker: "marked", tag: "shipping", text: "GRATIS FRAKT* (på følelsen)" },
  { speaker: "regnskap", tag: "generic", text: "Stopp. Vennligst les vilkår (du kommer ikke til å gjøre det)." },
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getFightForPath(pathname: string) {
  const i = hashString(pathname) % FIGHTS.length;
  const a = FIGHTS[i];
  const b = FIGHTS[(i + 1) % FIGHTS.length];
  return [a, b] as const;
}