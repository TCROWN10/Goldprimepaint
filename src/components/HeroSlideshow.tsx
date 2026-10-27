"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { finishSamples, type Product } from "@/lib/data";
import { GenderToggle } from "@/components/GenderToggle";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

const SLIDE_MS = 5500;

export function HeroSlideshow({ products }: { products: Product[] }) {
  const { range } = useApp();
  const { home, rangeLabels } = useContent();
  const samples = useMemo(() => finishSamples(products, range), [products, range]);
  const [index, setIndex] = useState(0);
  const label = range === "outdoor" ? rangeLabels.outdoor : rangeLabels.indoor;

  useEffect(() => {
    setIndex(0);
  }, [range, samples.length]);

  useEffect(() => {
    if (samples.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % samples.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [range, samples.length]);

  return (
    <section className="relative min-h-[34rem] overflow-hidden md:min-h-[40rem] lg:min-h-[46rem]">
      {samples.map((sample, i) => (
        <div
          key={sample.src}
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${(i - index) * 100}%)` }}
          aria-hidden={i !== index}
        >
          <Image
            src={sample.src}
            alt={i === index ? `${sample.label}. ${sample.product.name}` : ""}
            fill
            priority={i === 0}
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/25" />

      <div className="relative z-10 mx-auto flex min-h-[34rem] max-w-7xl flex-col justify-center px-5 py-16 md:min-h-[40rem] md:px-8 lg:min-h-[46rem] lg:px-10">
        <div className="max-w-xl">
          <div className="inline-flex w-fit max-w-full flex-col gap-3 rounded-[2rem] bg-gold px-4 py-3.5 shadow-[0_12px_40px_rgba(3,37,80,0.28)] sm:flex-row sm:items-center sm:gap-4 sm:py-3 sm:pr-3">
            <p className="whitespace-nowrap px-2 text-sm text-ink sm:text-[15px]">
              {home.browseLabel}
            </p>
            <GenderToggle size="md" className="shrink-0 self-start sm:self-auto" />
          </div>

          <p className="mt-6 text-[11px] font-semibold tracking-[0.22em] text-cream/80">
            {label.toUpperCase()}
          </p>
          <h1 className="mt-3 max-w-lg font-serif text-[2.6rem] leading-[1.08] text-cream md:text-6xl lg:text-[4.25rem]">
            {home.headline}
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream/85 md:text-lg">
            {home.subhead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-md bg-cream px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-white"
            >
              {home.shopNow}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-md bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-gold/90"
            >
              {home.heroStoryLink.replace(/\s*→\s*$/, "")}
            </Link>
          </div>
        </div>

        {samples.length > 1 && (
          <div className="mt-10 flex items-center gap-2" role="tablist" aria-label="Hero photos">
            {samples.map((sample, i) => (
              <button
                key={sample.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${sample.product.name}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-cream" : "w-2 bg-cream/45 hover:bg-cream/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
