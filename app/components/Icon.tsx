// app/components/Icon.tsx
import type { LucideIcon } from "lucide-react";

type IconSize = "xs" | "sm" | "md" | "lg";
type IconIntent =
  | "passive"
  | "noted"
  | "active"
  | "warning"
  | "critical"
  | "inverse";
type IconAccent = "default" | "yellow" | "red" | "black";

type IconProps = {
  icon: LucideIcon;
  className?: string;
  title?: string;
  size?: IconSize;
  intent?: IconIntent;
  accent?: IconAccent;
  interactive?: boolean;
};

const SIZE: Record<IconSize, string> = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const INTENT: Record<IconIntent, string> = {
  passive: "opacity-40",
  noted: "opacity-55",
  active: "opacity-75",
  warning: "opacity-85",
  critical: "opacity-95",
  inverse: "opacity-90 text-white",
};

const ACCENT: Record<IconAccent, Partial<Record<IconIntent, string>>> = {
  default: {
    passive: "text-current",
    noted: "text-current",
    active: "text-current",
    warning: "text-current",
    critical: "text-current",
    inverse: "text-white",
  },
  yellow: {
    passive: "text-black",
    noted: "text-black",
    active: "text-black",
    warning: "text-black",
    critical: "text-black",
    inverse: "text-white",
  },
  red: {
    passive: "text-black",
    noted: "text-black",
    active: "text-black",
    warning: "text-red-600",
    critical: "text-red-600",
    inverse: "text-white",
  },
  black: {
    passive: "text-black",
    noted: "text-black",
    active: "text-black",
    warning: "text-black",
    critical: "text-black",
    inverse: "text-white",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getOffset(size: IconSize) {
  switch (size) {
    case "xs":
      return "translate-y-[0.35px]";
    case "sm":
      return "translate-y-[0.5px]";
    case "md":
      return "translate-y-[0.65px]";
    case "lg":
      return "translate-y-[0.8px]";
    default:
      return "translate-y-[0.5px]";
  }
}

function getStroke(size: IconSize) {
  switch (size) {
    case "xs":
      return "stroke-[1.9]";
    case "sm":
      return "stroke-[1.85]";
    case "md":
      return "stroke-[1.8]";
    case "lg":
      return "stroke-[1.75]";
    default:
      return "stroke-[1.85]";
  }
}

/**
 * Prishandel Icon primitive:
 * - systemkoblet intent i stedet for bare opacity
 * - litt “butikkterminal”, mindre ren SaaS
 * - kan brukes i både badges, cards, CTA-er og statusrader
 */
export function Icon({
  icon: Lucide,
  className = "",
  title,
  size = "sm",
  intent = "passive",
  accent = "default",
  interactive = false,
}: IconProps) {
  const isDecorative = !title;

  return (
    <Lucide
      aria-hidden={isDecorative ? true : undefined}
      aria-label={title}
      className={cx(
        SIZE[size],
        getStroke(size),
        getOffset(size),
        "shrink-0",
        "transition duration-150 ease-out",
        INTENT[intent],
        ACCENT[accent][intent],
        interactive && [
          "group-hover:opacity-100",
          "group-hover:-translate-y-[0.15px]",
          "group-active:translate-y-[0.35px]",
        ].join(" "),
        className
      )}
    />
  );
}

/**
 * Brukes i badges/pills/chips
 * Litt strammere og mer “låst” uttrykk enn vanlig Icon.
 */
export function PillIcon({
  className = "",
  intent = "noted",
  accent = "default",
  ...rest
}: Omit<IconProps, "size">) {
  return (
    <Icon
      {...rest}
      size="xs"
      intent={intent}
      accent={accent}
      className={cx("translate-y-[0.2px]", className)}
    />
  );
}

/**
 * Brukes i statusrader / operative labels / “intern drift”
 */
export function StatusIcon({
  className = "",
  intent = "active",
  accent = "default",
  ...rest
}: Omit<IconProps, "size">) {
  return (
    <Icon
      {...rest}
      size="sm"
      intent={intent}
      accent={accent}
      className={cx(className)}
    />
  );
}