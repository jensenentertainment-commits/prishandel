// app/components/Icon.tsx
import type { LucideIcon } from "lucide-react";

type IconProps = {
  icon: LucideIcon;
  className?: string;
  title?: string;
  size?: "xs" | "sm" | "md" | "lg";
  tone?: "muted" | "normal" | "strong" | "inverse";
};

const SIZE: Record<NonNullable<IconProps["size"]>, string> = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const TONE: Record<NonNullable<IconProps["tone"]>, string> = {
  muted: "opacity-45",
  normal: "opacity-60",
  strong: "opacity-80",
  inverse: "opacity-90 text-white",
};

/**
 * Prishandel Icon wrapper:
 * - Samme uttrykk overalt
 * - Litt “butikkete” (ikke SaaS)
 * - Enkelt å justere én plass
 */
export function Icon({
  icon: Lucide,
  className = "",
  title,
  size = "sm",
  tone = "muted",
}: IconProps) {
  return (
    <Lucide
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={[
        SIZE[size],
        "stroke-[1.85]",
        "shrink-0",
        "translate-y-[0.5px]", // litt mindre “perfekt”
        TONE[tone],
        className,
      ].join(" ")}
    />
  );
}

/**
 * Brukes i badges/pills (chips, frakt-badges osv)
 */
export function PillIcon(props: Omit<IconProps, "size" | "tone"> & { tone?: IconProps["tone"] }) {
  return <Icon {...props} size="xs" tone={props.tone ?? "normal"} />;
}
