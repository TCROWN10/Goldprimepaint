"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { GenderToggle } from "@/components/GenderToggle";
import { ProductCard } from "@/components/ProductCard";
import { FinishSamples } from "@/components/FinishSamples";
import { ShopFilters } from "@/components/ShopFilters";
import { productFits, rangeLabel } from "@/lib/data";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

export default function ShopPage() {
  const { range } = useApp();
  const content = useContent();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const values = new Set(
      content.products
        .map((product) => product.category.trim())
        .filter(Boolean)
    );
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [content.products]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return content.products.filter((product) => {
      if (!productFits(product, range)) return false;
      if (category !== "all" && product.category !== category) return false;
      if (!needle) return true;
      const haystack = [
        product.name,
        product.category,
        product.shortDesc,
        product.description,
        product.badge ?? "",
        ...(product.features ?? []),
        ...product.colours.map((swatch) => swatch.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [content.products, range, category, query]);

  const hasActiveFilters = Boolean(query.trim()) || category !== "all";

  const emptyMessage = hasActiveFilters
    ? "No paints match your search or filters."
    : content.shop.empty;

  function clearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <>
      <Header variant="back" backHref="/" />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-5 md:px-8 md:py-10 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.28em] text-ink-muted">
                {content.shop.eyebrow}
              </p>
              <h1 className="mt-1 font-serif text-[1.85rem] leading-tight text-ink sm:text-3xl md:text-4xl">
                Shop {rangeLabel(range, content.rangeLabels)}
              </h1>
            </div>
            <GenderToggle className="w-full justify-center sm:w-auto" size="sm" />
          </div>

          <ShopFilters
            query={query}
            onQueryChange={setQuery}
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            resultCount={filtered.length}
            searchPlaceholder="Search paints…"
            hasActiveFilters={hasActiveFilters}
            onClear={clearFilters}
          />

          <p className="mt-7 text-[11px] tracking-[0.28em] text-ink-muted md:mt-10">
            THE PAINTS
          </p>
          <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-16 text-center md:py-20">
              <p className="max-w-xs text-[15px] text-ink-soft">{emptyMessage}</p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          )}

          <FinishSamples products={content.products} />
        </div>
      </main>
    </>
  );
}
