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
          <span className="card-badge absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-ink px-2 py-1 text-[9px] font-semibold tracking-[0.12em] text-cream sm:left-3 sm:top-3 sm:max-w-none sm:px-2.5 sm:text-[10px] sm:tracking-[0.16em] md:text-[11px]">
            {`${placeLabel(product, rangeLabels).toUpperCase()} · ${product.category.toUpperCase()}`}
          </span>
        </div>
        <div className="card-info flex items-start justify-between gap-1.5 px-2.5 py-3 sm:gap-2 sm:px-3.5 sm:py-3.5 md:px-4 md:py-4">
          <div className="min-w-0">
            <h3 className="font-serif text-[0.95rem] leading-snug text-ink sm:text-base md:text-lg">
              {product.name}
            </h3>
            <p className="mt-1 text-[13px] text-ink-soft sm:text-sm">
              {formatPrice(product.price)}
              <span className="text-ink-muted"> · 20L</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1 sm:mt-2.5 sm:gap-1.5">
              {product.colours.slice(0, 5).map((swatch) => (
                <span
                  key={swatch.id}
                  title={swatch.name}
                  className="h-3.5 w-3.5 rounded-full ring-1 ring-ink/15 sm:h-4 sm:w-4"
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
              {product.colours.length > 5 ? (
                <span className="self-center text-[10px] font-medium text-ink-muted sm:text-[11px]">
                  +{product.colours.length - 5}
                </span>
              ) : null}
            </div>
          </div>
          <span
            className="card-arrow mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition group-hover:border-gold group-hover:bg-gold group-hover:text-ink sm:h-9 sm:w-9"
            aria-hidden
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="sm:h-3.5 sm:w-3.5">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </AnimateIn>
  );
}
