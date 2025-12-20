"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const seen = localStorage.getItem("prishandel-cookies");
    if (!seen) setOpen(true);
  }, []);

  if (!open) return null;

  function accept() {
    localStorage.setItem("prishandel-cookies", "accepted");
    setOpen(false);
  }

  function decline() {
    localStorage.setItem("prishandel-cookies", "declined");
    router.push("/utsolgt?code=E-COOKIE-451");
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] bg-white border-t border-black/20 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="font-black">Vi bruker cookies 🍪</div>
          <p className="text-sm opacity-80 mt-1 max-w-xl">
            Vi bruker cookies for å huske at du liker tilbud, vise deg varer som
            er utsolgt og late som vi følger regelverket.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="rounded-lg bg-white text-black px-4 py-2 text-sm font-black border border-black/20 hover:bg-black/5"
          >
            Avslå
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-red-600 text-white px-5 py-2 text-sm font-black hover:opacity-90"
          >
            Godta alt
          </button>
        </div>
      </div>
    </div>
  );
}
