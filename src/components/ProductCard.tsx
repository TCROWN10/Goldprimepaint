"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/data";
import { formatPrice, isTinPhoto, paintImage, placeLabel } from "@/lib/data";
import { AnimateIn } from "@/components/AnimateIn";
import { useContent } from "@/lib/content-context";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { rangeLabels } = useContent();
  const tin = paintImage(product);
  return (
    <AnimateIn index={index} variant="scale" className="h-full">
      <Link
        href={`/product/${product.slug}`}
        className="card-surface group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-tan shadow-[0_4px_20px_rgba(3,37,80,0.04)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-deep">
          {tin ? (
            <Image
              src={tin}
              alt={product.name}
              fill
              unoptimized={isTinPhoto(tin)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="exterior-photo object-contain"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: product.colours[0]?.hex ?? "#f4ead4" }}
            />
          )}
          <span className="card-badge absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-cream md:text-[11px]">
            {`${placeLabel(product, rangeLabels).toUpperCase()} · ${product.category.toUpperCase()}`}
          </span>
        </div>
        <div className="card-info flex items-start justify-between gap-2 px-3.5 py-3.5 md:px-4 md:py-4">
          <div className="min-w-0">
            <h3 className="font-serif text-base leading-tight text-ink md:text-lg">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {formatPrice(product.price)}
              <span className="text-ink-muted"> · 20L</span>
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {product.colours.map((swatch) => (
                <span
                  key={swatch.id}
                  title={swatch.name}
                  className="h-4 w-4 rounded-full ring-1 ring-ink/15"
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
            </div>
          </div>
          <span
            className="card-arrow mt-1 shrink-0 text-ink"
            aria-hidden
          >
            →
          </span>
        </div>
      </Link>
    </AnimateIn>
  );
}
