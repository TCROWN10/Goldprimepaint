"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimateIn } from "@/components/AnimateIn";
import { isTinPhoto, paintImage, placeLabel, type Product } from "@/lib/data";
import { useContent } from "@/lib/content-context";

const AUTO_MS = 4500;
const SWIPE_X = 56;

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCount(3);
      else if (w >= 768) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

function PaintCard({
  product,
  place,
  priority,
}: {
  product: Product;
  place: string;
  priority?: boolean;
}) {
  const tin = paintImage(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group card-surface relative block h-full min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-cream-deep shadow-[0_14px_40px_rgba(3,37,80,0.12)] outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:min-h-[26rem] md:min-h-[28rem]"
    >
      <div className="absolute inset-0">
        {tin ? (
          <Image
            src={tin}
            alt={product.name}
            fill
            unoptimized={isTinPhoto(tin)}
            sizes="(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 33vw"
            className="exterior-photo object-contain transition duration-700 group-hover:scale-[1.03]"
            draggable={false}
            priority={priority}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: product.colours[0]?.hex ?? "#f4ead4" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent transition duration-500 group-hover:from-ink/85" />
      </div>

      <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-cream md:left-5 md:top-5">
        {place}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p className="font-serif text-2xl text-cream transition duration-300 group-hover:-translate-y-0.5 md:text-3xl">
          {product.name}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.colours.slice(0, 8).map((swatch) => (
            <span
              key={swatch.id}
              title={swatch.name}
              className="h-4 w-4 rounded-full ring-1 ring-cream/40 transition duration-300 group-hover:scale-110"
              style={{ backgroundColor: swatch.hex }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

export function CategoryStack({ products }: { products: Product[] }) {
  const { rangeLabels, shop } = useContent();
  const deck = useMemo(() => products.slice(0, 6), [products]);
  const deckKey = useMemo(() => deck.map((p) => p.id).join("|"), [deck]);
  const visible = useVisibleCount();

  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const startX = useRef(0);
  const deltaX = useRef(0);

  const pageCount = Math.max(1, Math.ceil(deck.length / Math.max(visible, 1)));
  const safePage = ((page % pageCount) + pageCount) % pageCount;

  useEffect(() => {
    setPage(0);
    setAnimKey((k) => k + 1);
  }, [deckKey, visible]);

  const goTo = useCallback(
    (next: number) => {
      setPage(((next % pageCount) + pageCount) % pageCount);
      setAnimKey((k) => k + 1);
    },
    [pageCount]
  );

  const goNext = useCallback(() => goTo(safePage + 1), [goTo, safePage]);
  const goPrev = useCallback(() => goTo(safePage - 1), [goTo, safePage]);

  useEffect(() => {
    if (paused || pageCount < 2) return;
    const id = window.setInterval(goNext, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, pageCount, goNext]);

  function onPointerDown(e: ReactPointerEvent) {
    if (pageCount < 2) return;
    startX.current = e.clientX;
    deltaX.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (pageCount < 2) return;
    deltaX.current = e.clientX - startX.current;
  }

  function onPointerUp() {
    if (pageCount < 2) return;
    if (deltaX.current <= -SWIPE_X) goNext();
    else if (deltaX.current >= SWIPE_X) goPrev();
    deltaX.current = 0;
  }

  if (!deck.length) {
    return <p className="py-16 text-center text-ink-soft">{shop.empty}</p>;
  }

  const start = safePage * visible;
  const cards = Array.from({ length: Math.min(visible, deck.length) }, (_, i) => {
    return deck[(start + i) % deck.length];
  });

  const gridClass =
    visible >= 3
      ? "grid-cols-1 lg:grid-cols-3"
      : visible === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1";

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        key={animKey}
        className={`paint-carousel-slide grid gap-4 sm:gap-5 md:gap-6 ${gridClass}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="region"
        aria-roledescription="carousel"
        aria-label="The paints"
      >
        {cards.map((product, i) => (
          <AnimateIn
            key={`${product.id}-${safePage}-${i}`}
            index={i}
            variant="up"
            className="h-full"
          >
            <PaintCard
              product={product}
              place={`${placeLabel(product, rangeLabels).toUpperCase()} · ${product.category.toUpperCase()}`}
              priority={i === 0}
            />
          </AnimateIn>
        ))}
      </div>

      {pageCount > 1 && (
        <div
          className="mt-6 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Paint slides"
        >
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === safePage}
              aria-label={`Show set ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === safePage
                  ? "w-7 bg-forest"
                  : "w-2 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
