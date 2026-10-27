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
import { formatPrice, isProjectPhoto, productShots, projectLabel, type Product } from "@/lib/data";
import { AnimateIn } from "@/components/AnimateIn";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

const ANGLE_LABELS = ["TIN", "COLOUR", "WALL", "ROOM", "CLOSE", "FINISH"] as const;

/**
 * 360° product spin (drag-to-rotate / turntable).
 * Maps horizontal drag distance to frame index across product.images.
 */
export function HomeHeroCarousel({ products }: { products: Product[] }) {
  const { home } = useContent();
  const { range } = useApp();
  const [productIndex, setProductIndex] = useState(0);
  const product = products[productIndex] ?? products[0];
  const shots = productShots(product, range);

  const frames = useMemo(() => {
    const imgs =
      shots.images.length >= 2
        ? shots.images
        : [shots.image, shots.image, shots.image];
    if (imgs.every(isProjectPhoto)) return imgs;
    const dense: string[] = [];
    for (let i = 0; i < 12; i++) {
      dense.push(imgs[i % imgs.length]);
    }
    return dense;
  }, [shots.image, shots.images]);

  const [frame, setFrame] = useState(0);
  const [colourId, setColourId] = useState(product.colours[0]?.id);
  const [dragging, setDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const startX = useRef(0);
  const startFrame = useRef(0);
  const didDrag = useRef(false);
  const frameRef = useRef(0);
  const showingProject = isProjectPhoto(frames[frame] ?? shots.image);
  const frameLabel = projectLabel(frames[frame] ?? shots.image);

  const activeColour =
    product.colours.find((swatch) => swatch.id === colourId) ?? product.colours[0];

  // Reset when product collection / selection changes
  useEffect(() => {
    setFrame(0);
    frameRef.current = 0;
    setColourId(product.colours[0]?.id);
    setShowHint(true);
    setTilt({ x: 0, y: 0 });
  }, [product.id, product.colours, shots.image]);

  const angleLabel = useMemo(() => {
    const segment = Math.floor((frame / frames.length) * ANGLE_LABELS.length);
    return ANGLE_LABELS[segment % ANGLE_LABELS.length];
  }, [frame, frames.length]);

  const setFrameSafe = useCallback((n: number) => {
    const len = frames.length;
    const next = ((n % len) + len) % len;
    frameRef.current = next;
    setFrame(next);
  }, [frames.length]);

  function onPointerDown(e: ReactPointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    startFrame.current = frameRef.current;
    didDrag.current = false;
    setDragging(true);
    setShowHint(false);
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 4) didDrag.current = true;

    // ~28px per frame — snappy spin
    const steps = Math.round(dx / 28);
    setFrameSafe(startFrame.current - steps);

    // Subtle 3D tilt while dragging
    const max = 8;
    setTilt({
      x: Math.max(-max, Math.min(max, (e.clientY / (e.currentTarget as HTMLElement).clientHeight - 0.5) * -max)),
      y: Math.max(-max, Math.min(max, (dx / 120) * max)),
    });
  }

  function onPointerUp() {
    setDragging(false);
    setTilt({ x: 0, y: 0 });
  }

  const productDots = products.slice(0, Math.min(3, products.length));

  return (
    <AnimateIn variant="scale" className="relative w-full">
      {/* Product spin card */}
      <div
        className={`hero-spin relative mx-auto aspect-[4/5] max-w-xl overflow-hidden rounded-[1.85rem] bg-cream-deep shadow-[0_24px_70px_rgba(3,37,80,0.14)] md:aspect-[5/4] md:max-w-none lg:aspect-[16/11] lg:rounded-[2rem] ${
          dragging ? "is-dragging" : ""
        } ${showingProject ? "is-still" : ""}`}
        style={{
          transform: showingProject
            ? "none"
            : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: dragging
            ? "none"
            : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label={`${product.name}, drag to browse. Current view: ${angleLabel}`}
      >
        {/* Spin frames */}
        {frames.map((src, i) => (
          <div
            key={`${product.id}-f-${i}`}
            className="absolute inset-0"
            style={{
              opacity: i === frame ? 1 : 0,
              transition: dragging ? "none" : "opacity 0.12s linear",
              transform: showingProject
                ? "none"
                : i === frame
                  ? `scale(1.02) rotateY(${(frame % 3) * 0.4}deg)`
                  : "scale(1)",
            }}
          >
            {src ? (
              <Image
                src={src}
                alt={projectLabel(src) ? `${projectLabel(src)}. ${product.name}` : product.name}
                fill
                priority={i === 0}
                unoptimized={isProjectPhoto(src)}
                draggable={false}
                sizes="(max-width: 1024px) 100vw, 70vw"
                className={`pointer-events-none select-none ${
                  isProjectPhoto(src) ? "exterior-photo object-contain" : "object-cover"
                }`}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ backgroundColor: product.colours[0]?.hex ?? "#f4ead4" }}
              />
            )}
          </div>
        ))}

        <div
          className={`pointer-events-none absolute inset-0 ${
            showingProject
              ? "bg-gradient-to-t from-ink/25 via-transparent to-transparent"
              : "bg-gradient-to-t from-ink/60 via-transparent to-ink/15"
          }`}
        />
        {frameLabel && (
          <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-ink px-3.5 py-2 text-[12px] font-semibold tracking-[0.2em] text-cream md:left-5 md:top-5">
            {frameLabel}
          </span>
        )}

        {/* Product badge */}
        {product.badge && !showingProject && (
          <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-cream/25 bg-ink/75 px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] text-cream backdrop-blur-sm md:left-5 md:top-5">
            {product.badge.toUpperCase()}
          </span>
        )}

        {/* Feature callouts */}
        <div className="pointer-events-none absolute right-4 top-4 z-10 flex flex-col items-end gap-2 md:right-5 md:top-5">
          {!showingProject && product.features?.map((f, i) => (
            <span
              key={f}
              className="card-feature-tag rounded-full border border-ink/10 bg-cream/92 px-3 py-1.5 text-[10px] font-medium tracking-[0.1em] text-ink shadow-sm backdrop-blur-sm md:text-[11px]"
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              {f.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Drag hint — fades after first interaction */}
        {showHint && !showingProject && (
          <div className="card-drag-hint pointer-events-none absolute left-1/2 top-1/2 z-10 flex items-center gap-2 rounded-full bg-ink/55 px-5 py-3 text-[11px] font-medium tracking-[0.14em] text-cream backdrop-blur-md md:text-xs">
            <span className="opacity-80" aria-hidden>
              ⟷
            </span>
            {home.dragHint}
          </div>
        )}

        {/* Bottom overlays */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 md:p-6">
          <div>
            <Link
              href={`/product/${product.slug}`}
              onClick={(e) => {
                if (didDrag.current) e.preventDefault();
              }}
              className="pointer-events-auto font-serif text-2xl text-cream drop-shadow transition hover:opacity-90 md:text-3xl lg:text-[2.1rem]"
            >
              {product.name}
            </Link>
            {/* Product switcher dots (collection) */}
            <div className="pointer-events-auto mt-3 flex items-center gap-2">
              {productDots.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Show ${p.name}`}
                  onClick={() => setProductIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === productIndex
                      ? "w-7 bg-cream"
                      : "w-1.5 bg-cream/45 hover:bg-cream/70"
                  }`}
                />
              ))}
            </div>
          </div>

          <Link
            href={`/product/${product.slug}`}
            onClick={(e) => {
              if (didDrag.current) e.preventDefault();
            }}
            className="pointer-events-auto shrink-0 rounded-full bg-cream/95 px-4 py-2.5 text-sm font-medium text-ink shadow-sm backdrop-blur transition hover:scale-[1.03] hover:bg-cream md:px-5"
          >
            {formatPrice(product.price)}
            <span className="mx-2 text-ink-muted">·</span>
            <span className="tracking-[0.12em] text-ink-soft">20L</span>
            <span className="mx-2 text-ink-muted">·</span>
            <span className="tracking-[0.12em] text-ink-soft">{angleLabel}</span>
          </Link>
        </div>
      </div>

      {/* Colour swatches */}
      <div className="mt-5 flex items-center justify-between gap-3 px-1">
        <p className="shrink-0 text-[10px] font-medium tracking-[0.2em] text-ink-muted">
          {home.colourLabel}
        </p>
        <div className="flex flex-1 items-center justify-center gap-2.5 sm:gap-3">
          {product.colours.map((swatch) => {
            const selected = swatch.id === activeColour?.id;
            return (
              <button
                key={swatch.id}
                type="button"
                aria-label={swatch.name}
                aria-pressed={selected}
                onClick={() => setColourId(swatch.id)}
                className={`relative h-9 w-9 rounded-full transition duration-300 sm:h-10 sm:w-10 ${
                  selected
                    ? "scale-110 ring-2 ring-ink ring-offset-2 ring-offset-cream"
                    : "opacity-90 hover:scale-105 hover:opacity-100"
                }`}
                style={{ backgroundColor: swatch.hex }}
              />
            );
          })}
        </div>
        <p className="shrink-0 text-[10px] font-semibold tracking-[0.16em] text-ink">
          {activeColour?.name.toUpperCase() ?? ""}
        </p>
      </div>
    </AnimateIn>
  );
}
