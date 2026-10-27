"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  formatPrice,
  isTinPhoto,
  paintImage,
  placeLabel,
  projectLabel,
  sampleImages,
  tinPrice,
  type Product,
} from "@/lib/data";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { setPendingOrder, selectedColour, setSelectedColour } = useApp();
  const content = useContent();
  const tin = paintImage(product);
  const interiorSamples = sampleImages(product, "indoor");
  const exteriorSamples = sampleImages(product, "outdoor");
  const [view, setView] = useState(
    tin
      ? { src: tin, kind: "paint" as const }
      : { src: interiorSamples[0] ?? exteriorSamples[0] ?? "", kind: "sample" as const },
  );
  const sizes = content.tinSizes.map((size) => size.size);
  const [colour, setColour] = useState(
    product.colours.find((swatch) => swatch.id === selectedColour?.id) ??
      product.colours[0],
  );
  const [size, setSize] = useState<string | null>(
    sizes.includes("20L") ? "20L" : sizes[0] ?? null,
  );
  const [qty, setQty] = useState(1);

  const unitPrice = tinPrice(product.price, size ?? sizes[0] ?? "20L", content.tinSizes);
  const canOrder = size !== null && Boolean(colour);
  if (!colour) return null;

  function handleOrder() {
    if (!canOrder || size === null) return;
    setPendingOrder({
      productSlug: product.slug,
      productName: product.name,
      category: product.category,
      range: product.range,
      colour: colour.name,
      colourHex: colour.hex,
      size,
      quantity: qty,
      price: unitPrice,
      image: tin || view.src,
    });
    router.push("/checkout");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-6 md:gap-10 md:px-8 md:py-10 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-12">
      {/* Gallery */}
      <div className="animate-fade-up">
        <div className="card-media-frame relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-cream-deep shadow-[0_12px_40px_rgba(3,37,80,0.08)] md:aspect-square lg:aspect-[5/6]">
          {view.src ? (
            <Image
              key={view.src}
              src={view.src}
              alt={
                view.kind === "sample" && projectLabel(view.src)
                  ? `${projectLabel(view.src)}. ${product.name}`
                  : product.name
              }
              fill
              priority
              unoptimized={view.kind === "sample" || isTinPhoto(view.src)}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={view.kind === "paint" ? "exterior-photo object-contain" : "object-cover"}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: product.colours[0]?.hex ?? "#f4ead4" }}
            />
          )}
          {view.kind === "sample" && projectLabel(view.src) && (
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3.5 py-2 text-[12px] font-semibold tracking-[0.2em] text-cream">
              {projectLabel(view.src)}
            </span>
          )}
          {view.kind === "paint" && (
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3.5 py-2 text-[12px] font-semibold tracking-[0.2em] text-cream">
              PAINT
            </span>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {tin && (
            <SampleRow
              title="The paint"
              sources={[tin]}
              active={view.src}
              onPick={(src) => setView({ src, kind: "paint" })}
            />
          )}
          {interiorSamples.length > 0 && (
            <SampleRow
              title="Interior sample"
              sources={interiorSamples}
              active={view.src}
              onPick={(src) => setView({ src, kind: "sample" })}
            />
          )}
          {exteriorSamples.length > 0 && (
            <SampleRow
              title="Exterior sample"
              sources={exteriorSamples}
              active={view.src}
              onPick={(src) => setView({ src, kind: "sample" })}
            />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col animate-fade-up stagger-2 lg:pt-2">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-ink-soft">
          {placeLabel(product, content.rangeLabels).toUpperCase()} · {product.category.toUpperCase()}
        </p>
        <h1 className="mt-2 font-serif text-[2.15rem] leading-tight text-ink md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-3 text-xl font-semibold tracking-tight text-ink md:text-2xl">
          {formatPrice(unitPrice)}
        </p>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
          {product.description}
        </p>
        {product.features && product.features.length > 0 && (
          <ul className="mt-4 max-w-md space-y-1.5 text-sm text-ink-soft">
            {product.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft">
            {content.productUi.colourLabel} —{" "}
            <span className="text-oxblood">{colour.name.toUpperCase()}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colours.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                aria-label={swatch.name}
                title={swatch.name}
                onClick={() => {
                  setColour(swatch);
                  setSelectedColour(swatch);
                }}
                className={`h-9 w-9 rounded-full transition ${
                  colour.id === swatch.id
                    ? "ring-2 ring-oxblood ring-offset-2 ring-offset-cream"
                    : "ring-1 ring-ink/10 hover:ring-ink/25"
                }`}
                style={{ backgroundColor: swatch.hex }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft">
              {content.productUi.tinLabel}
            </p>
            <button
              type="button"
              className="text-[12px] text-ink-soft underline decoration-dotted underline-offset-4 transition hover:text-ink"
            >
              {content.productUi.coverageLabel}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-xl border py-3 text-sm font-medium transition ${
                  size === s
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/15 bg-cream-card text-ink hover:border-ink/35"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 text-[13px] text-ink-soft underline decoration-dotted underline-offset-4 transition hover:text-ink"
          >
            {content.productUi.missingColour}
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft">
              {content.productUi.qtyLabel}
            </p>
            <div className="mt-2 inline-flex items-center rounded-full border border-ink/15 bg-cream-card">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-lg text-ink-soft transition hover:text-ink"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="px-4 py-2.5 text-lg text-ink-soft transition hover:text-ink"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 sticky bottom-4 z-10 lg:static lg:mt-10">
          <button
            type="button"
            disabled={!canOrder}
            onClick={handleOrder}
            className="flex w-full items-center justify-center rounded-full bg-gold py-4 text-[15px] font-semibold tracking-wide text-ink shadow-[0_10px_30px_rgba(204,157,40,0.35)] transition hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {content.productUi.orderButton} — {formatPrice(unitPrice * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}

function SampleRow({
  title,
  sources,
  active,
  onPick,
}: {
  title: string;
  sources: string[];
  active: string;
  onPick: (src: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft">
        {title.toUpperCase()}
      </p>
      <div className="mt-2 flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {sources.map((src) => (
          <button
            key={src}
            type="button"
            aria-label={title}
            aria-pressed={src === active}
            onClick={() => onPick(src)}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl md:h-24 md:w-24 ${
              src === active
                ? "ring-2 ring-ink ring-offset-2 ring-offset-cream"
                : "opacity-80 ring-1 ring-ink/10"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              unoptimized
              className={isTinPhoto(src) ? "exterior-photo object-contain" : "object-cover"}
              sizes="96px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
