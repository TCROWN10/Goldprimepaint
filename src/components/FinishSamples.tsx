"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { finishSamples, type Product } from "@/lib/data";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

export function FinishSamples({
  products,
  layout = "strip",
}: {
  products: Product[];
  layout?: "hero" | "strip";
}) {
  const { range } = useApp();
  const { rangeLabels } = useContent();
  const samples = useMemo(() => finishSamples(products, range), [products, range]);
  const [index, setIndex] = useState(0);
  const label = range === "outdoor" ? rangeLabels.outdoor : rangeLabels.indoor;

  useEffect(() => {
    setIndex(0);
  }, [range, samples.length]);

  if (!samples.length) return null;
  const sample = samples[Math.min(index, samples.length - 1)];

  if (layout === "hero") {
    return (
      <div>
        <p className="mb-3 text-[11px] tracking-[0.28em] text-ink-muted">
          {label.toUpperCase()} SAMPLE
        </p>
        <div className="card-media-frame relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-cream-deep shadow-[0_12px_40px_rgba(3,37,80,0.08)]">
          <Image
            src={sample.src}
            alt={`${sample.label}. ${sample.product.name}`}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute left-4 top-4 z-10 rounded-full bg-ink px-3.5 py-2 text-[12px] font-semibold tracking-[0.2em] text-cream">
            {sample.label}
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent p-5 md:p-6">
            <Link
              href={`/product/${sample.product.slug}`}
              className="font-serif text-2xl text-cream md:text-3xl"
            >
              {sample.product.name}
            </Link>
          </div>
        </div>
        {samples.length > 1 && (
          <div className="mt-3 flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {samples.map((item, i) => (
              <button
                key={item.src}
                type="button"
                aria-label={`${item.label} sample of ${item.product.name}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl md:h-24 md:w-24 ${
                  i === index
                    ? "ring-2 ring-ink ring-offset-2 ring-offset-cream"
                    : "opacity-80 ring-1 ring-ink/10"
                }`}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="mt-16 border-t border-ink/10 pt-12">
      <p className="text-[11px] tracking-[0.28em] text-ink-muted">
        {label.toUpperCase()} SAMPLES
      </p>
      <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
        {label} samples
      </h2>
      <p className="mt-3 max-w-lg text-sm text-ink-soft">
        Finished walls. These are samples of the look, separate from the paint tin.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {samples.map((item) => (
          <Link
            key={item.src}
            href={`/product/${item.product.slug}`}
            className="card-media-frame group relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-cream-deep shadow-[0_4px_20px_rgba(3,37,80,0.04)]"
          >
            <Image
              src={item.src}
              alt={`${item.label}. ${item.product.name}`}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-cream md:text-[11px]">
              {item.label}
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3.5 py-4 font-serif text-lg text-cream md:text-xl">
              {item.product.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
