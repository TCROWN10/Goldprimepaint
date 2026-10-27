"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateIn } from "@/components/AnimateIn";
import { isProjectPhoto } from "@/lib/data";
import { useContent } from "@/lib/content-context";

export function PaintRanges() {
  const { home } = useContent();
  const ranges = home.paintRanges;

  return (
    <section className="bg-cream py-14 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
        <AnimateIn variant="fade" className="mx-auto max-w-3xl text-center">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-[2.35rem] md:leading-tight">
            {home.rangesTitle}
          </h2>
        </AnimateIn>

        <div className="mt-12 grid gap-12 sm:mt-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:mt-16 lg:grid-cols-3 lg:gap-10">
          {ranges.map((range, i) => (
            <AnimateIn
              key={range.slug}
              index={i}
              variant="up"
              className={`group flex flex-col items-center text-center ${
                i === 2 ? "sm:col-span-2 sm:mx-auto sm:max-w-sm lg:col-span-1 lg:mx-0 lg:max-w-none" : ""
              }`}
            >
              <div className="reveal-zoom relative aspect-square w-[min(72vw,15.5rem)] overflow-hidden rounded-full shadow-[0_12px_36px_rgba(3,37,80,0.12)] transition duration-500 group-hover:shadow-[0_18px_44px_rgba(3,37,80,0.18)] sm:w-[13.5rem] md:w-[15rem] lg:w-[16rem]">
                <Image
                  src={range.image}
                  alt={range.alt}
                  fill
                  unoptimized={isProjectPhoto(range.image)}
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 30vw, 16rem"
                  className="reveal-zoom__media object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-7 font-sans text-xl font-bold text-ink transition group-hover:text-ink md:text-[1.35rem]">
                {range.title}
              </h3>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-muted md:text-[15px]">
                {range.body}
              </p>
              <Link
                href={`/product/${range.slug}`}
                aria-label={`View ${range.title}`}
                className="range-arrow mt-7 inline-flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-gold text-gold hover:bg-gold hover:text-ink hover:shadow-[0_8px_22px_rgba(204,157,40,0.35)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
