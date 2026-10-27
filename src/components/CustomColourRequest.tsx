"use client";

import { useState } from "react";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/data";

export function CustomColourRequest({
  whatsappNumber,
  whatsappMessage,
  colourLabel,
  colourPlaceholder,
  colourHint,
  sendButton,
  shopButton,
}: {
  whatsappNumber: string;
  whatsappMessage: string;
  colourLabel: string;
  colourPlaceholder: string;
  colourHint: string;
  sendButton: string;
  shopButton: string;
}) {
  const [colour, setColour] = useState("");
  const [error, setError] = useState("");

  function sendToWhatsApp(event: React.FormEvent) {
    event.preventDefault();
    const requested = colour.trim();
    if (!requested) {
      setError("Please type the colour you want.");
      return;
    }
    setError("");
    const message = [
      whatsappMessage.trim(),
      "",
      `Colour I want: ${requested}`,
    ]
      .filter((line, index, list) => !(line === "" && list[index - 1] === ""))
      .join("\n");

    window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={sendToWhatsApp} className="mt-8 space-y-4">
      <label className="block max-w-md">
        <span className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {colourLabel}
        </span>
        <textarea
          value={colour}
          onChange={(event) => {
            setColour(event.target.value);
            if (error) setError("");
          }}
          rows={3}
          placeholder={colourPlaceholder}
          className="mt-2 w-full rounded-2xl border border-ink/15 bg-cream-card px-4 py-3.5 text-[15px] text-ink outline-none transition placeholder:text-ink-muted focus:border-gold focus:ring-2 focus:ring-gold/25"
        />
        <span className="mt-1.5 block text-xs leading-relaxed text-ink-soft">
          {colourHint}
        </span>
      </label>

      {error ? <p className="text-sm text-oxblood">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(78,203,96,0.35)] transition hover:scale-[1.02] hover:bg-whatsapp-deep"
        >
          {sendButton}
        </button>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-4 text-sm font-semibold text-ink transition hover:border-ink/40"
        >
          {shopButton}
        </Link>
      </div>
    </form>
  );
}
