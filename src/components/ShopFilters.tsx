"use client";

type ShopFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  categories: string[];
  category: string;
  onCategoryChange: (value: string) => void;
  resultCount: number;
  searchPlaceholder?: string;
  onClear?: () => void;
  hasActiveFilters?: boolean;
};

export function ShopFilters({
  query,
  onQueryChange,
  categories,
  category,
  onCategoryChange,
  resultCount,
  searchPlaceholder = "Search paints…",
  onClear,
  hasActiveFilters = false,
}: ShopFiltersProps) {
  return (
    <div className="shop-filters sticky top-[4.75rem] z-30 -mx-5 border-b border-ink/5 bg-cream/95 px-5 py-3 backdrop-blur-md md:static md:top-auto md:z-auto md:mx-0 md:mt-8 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
      <div className="space-y-3 md:space-y-4">
        <label className="relative block md:max-w-xl">
          <span className="sr-only">Search paints</span>
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-muted md:left-4">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={searchPlaceholder}
            enterKeyHint="search"
            autoComplete="off"
            className="w-full rounded-full border border-ink/12 bg-cream-card py-3 pl-11 pr-11 text-base text-ink outline-none transition placeholder:text-ink-muted focus:border-gold focus:ring-2 focus:ring-gold/25 md:py-3.5 md:pl-12 md:pr-4 md:text-[15px]"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onQueryChange("")}
              className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-ink/5 hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
        </label>

        <div className="-mx-5 md:mx-0">
          <div
            className="flex gap-2 overflow-x-auto px-5 pb-0.5 no-scrollbar md:flex-wrap md:overflow-visible md:px-0"
            role="group"
            aria-label="Filter by finish"
          >
            <FilterChip
              active={category === "all"}
              onClick={() => onCategoryChange("all")}
              label={
                <>
                  <span className="sm:hidden">All</span>
                  <span className="hidden sm:inline">All finishes</span>
                </>
              }
            />
            {categories.map((item) => (
              <FilterChip
                key={item}
                active={category === item}
                onClick={() => onCategoryChange(item)}
                label={item}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] text-ink-muted md:text-sm">
            {resultCount === 1 ? "1 paint found" : `${resultCount} paints found`}
          </p>
          {hasActiveFilters && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-[13px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition hover:decoration-ink md:text-sm"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-3.5 py-2.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition touch-manipulation md:px-4 md:py-2 md:text-[12px] ${
        active
          ? "bg-ink text-cream shadow-sm"
          : "bg-cream-card text-ink-soft ring-1 ring-ink/10 hover:text-ink hover:ring-ink/25"
      }`}
    >
      {label}
    </button>
  );
}
