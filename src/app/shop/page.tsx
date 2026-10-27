"use client";

import { Header } from "@/components/Header";
import { GenderToggle } from "@/components/GenderToggle";
import { ProductCard } from "@/components/ProductCard";
import { FinishSamples } from "@/components/FinishSamples";
import { productFits, rangeLabel } from "@/lib/data";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

export default function ShopPage() {
  const { range } = useApp();
  const content = useContent();
  const filtered = content.products.filter((p) => productFits(p, range));

  return (
    <>
      <Header variant="back" backHref="/" />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-10 lg:px-10">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <div>
              <p className="text-center text-[11px] tracking-[0.28em] text-ink-muted sm:text-left">
                {content.shop.eyebrow}
              </p>
              <h1 className="mt-1 text-center font-serif text-3xl text-ink sm:text-left md:text-4xl">
                Shop {rangeLabel(range, content.rangeLabels)}
              </h1>
            </div>
            <GenderToggle />
          </div>

          <p className="mt-10 text-[11px] tracking-[0.28em] text-ink-muted">THE PAINTS</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-ink-soft">
              {content.shop.empty}
            </p>
          )}

          <FinishSamples products={content.products} />
        </div>
      </main>
    </>
  );
}
