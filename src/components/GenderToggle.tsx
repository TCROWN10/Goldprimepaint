"use client";

import type { Range } from "@/lib/data";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

type GenderToggleProps = {
  value?: Range;
  onChange?: (range: Range) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function GenderToggle({
  value,
  onChange,
  size = "md",
  className = "",
}: GenderToggleProps) {
  const app = useApp();
  const { rangeLabels } = useContent();
  const range = value ?? app.range;
  const setRange = onChange ?? app.setRange;

  const pad =
    size === "sm"
      ? "p-1 text-[11px]"
      : size === "lg"
        ? "p-1.5 text-[13px] md:text-sm"
        : "p-1 text-xs md:text-[13px]";
  const btn =
    size === "sm"
      ? "px-3.5 py-1.5"
      : size === "lg"
        ? "px-6 py-2.5 md:px-8"
        : "px-5 py-2 md:px-6";

  return (
    <div
      className={`inline-flex rounded-full bg-cream-card/90 shadow-[0_4px_20px_rgba(3,37,80,0.08)] ring-1 ring-ink/5 backdrop-blur ${pad} ${className}`}
      role="group"
      aria-label="Shop range"
    >
      {(["indoor", "outdoor"] as Range[]).map((option) => {
        const active = range === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setRange(option)}
            className={`${btn} flex-1 rounded-full font-semibold tracking-[0.14em] uppercase transition-all duration-300 touch-manipulation sm:flex-none ${
              active
                ? "bg-forest text-cream shadow-sm"
                : "bg-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {option === "indoor" ? rangeLabels.indoor : rangeLabels.outdoor}
          </button>
        );
      })}
    </div>
  );
}
