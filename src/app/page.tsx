"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { GenderToggle } from "@/components/GenderToggle";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { CategoryStack } from "@/components/CategoryStack";
import { ProductCard } from "@/components/ProductCard";
import { PaintRanges } from "@/components/PaintRanges";
import { SolutionsSplit } from "@/components/SolutionsSplit";
import { TestimonialRow } from "@/components/TestimonialRow";
import { Sustainability } from "@/components/Sustainability";
import { productFits, rangeLabel } from "@/lib/data";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

export default function HomePage() {
  const { range } = useApp();
  const { home, shop, products, rangeLabels, nav } = useContent();
  const filtered = products.filter((p) => productFits(p, range));
  const heroProducts = filtered.length ? filtered : products;
  const shopProducts = filtered.length ? filtered : products;

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSlideshow products={heroProducts} />

        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14 lg:px-10">
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <p className="text-center text-[11px] tracking-[0.28em] text-ink-muted sm:text-left">
                {home.categoriesEyebrow}
              </p>
              <h2 className="mt-2 text-center font-serif text-3xl text-ink sm:text-left md:text-4xl">
                {home.categoriesTitle}
              </h2>
            </div>
            <GenderToggle size="sm" />
          </div>
          <CategoryStack products={shopProducts} />
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14 lg:px-10">
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <p className="text-center text-[11px] tracking-[0.28em] text-ink-muted sm:text-left">
                {shop.eyebrow}
              </p>
              <h2 className="mt-2 text-center font-serif text-3xl text-ink sm:text-left md:text-4xl">
                Shop {rangeLabel(range, rangeLabels)}
              </h2>
            </div>
            <GenderToggle size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {shopProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          {shopProducts.length === 0 && (
            <p className="py-16 text-center text-ink-soft">{shop.empty}</p>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-ink/40 hover:bg-cream-deep"
            >
              {nav.shopCta}
            </Link>
          </div>
        </section>

        <PaintRanges />
        <SolutionsSplit />
        <TestimonialRow />
        <Sustainability />
      </main>
    </>
  );
}
