"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

function getCountLabel(count: number, hydrated: boolean) {
  if (!hydrated) return "0";
  if (count === 0) return "0";
  if (count >= 8) return "??";
  if (count >= 5) return "5+";
  return String(count);
}

function getNavLabel(
  itemCount: number,
  statusLabel: string,
  hydrated: boolean
) {
  if (!hydrated) return "Kurv";
  if (itemCount === 0) return "Ingen kjøpsforsøk";
  if (statusLabel === "Kurv under vurdering") return "Kurv under vurdering";
  if (statusLabel === "Kurv under behandling") return "Kurv under behandling";
  if (statusLabel === "1 aktivt kjøpsforsøk") return "1 aktivt forsøk";
  return "Aktive kjøpsforsøk";
}

function getTitle(
  itemCount: number,
  statusLabel: string,
  systemNote: string,
  hydrated: boolean
) {
  if (!hydrated) return "Kurv lastes";
  if (itemCount === 0) return systemNote;
  return `${statusLabel} • ${systemNote}`;
}

export default function CartNavItem() {
  const { itemCount, statusLabel, systemNote, hydrated } = useCart();

  const label = getNavLabel(itemCount, statusLabel, hydrated);
  const countLabel = getCountLabel(itemCount, hydrated);
  const title = getTitle(itemCount, statusLabel, systemNote, hydrated);

  return (
    <Link
      href="/kurv"
      className="relative inline-flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-black/5"
      title={title}
      aria-label={title}
    >
      <ShoppingCart className="h-5 w-5" />

      <span className="hidden text-sm font-black sm:inline">{label}</span>

      <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-black tabular-nums text-white">
        {countLabel}
      </span>
    </Link>
  );
}