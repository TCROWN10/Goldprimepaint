"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateIn } from "@/components/AnimateIn";
import { isProjectPhoto } from "@/lib/data";
import { useContent } from "@/lib/content-context";

export function SolutionsSplit() {
  const { home } = useContent();
  const images = home.solutionsImages;

  return (
    <section className="bg-cream-deep/60 py-14 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div className="order-1 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            {images.slice(0, 2).map((img, i) => (
              <AnimateIn
                key={img.src}
                index={i}
                variant={i === 0 ? "left" : "up"}
                className="reveal-zoom relative aspect-[2/3] overflow-hidden bg-tan shadow-[0_10px_30px_rgba(3,37,80,0.08)]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  unoptimized={isProjectPhoto(img.src)}
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="reveal-zoom__media object-cover transition duration-700 hover:scale-[1.04]"
                />
              </AnimateIn>
            ))}
          </div>

          <div className="order-2 text-center md:text-left">
            <AnimateIn variant="right">
              <h2 className="mx-auto max-w-xl font-sans text-2xl font-bold tracking-tight text-ink sm:text-3xl md:mx-0 md:text-[2.35rem] md:leading-tight">
                {home.solutionsTitle}
              </h2>
            </AnimateIn>
            <div className="mx-auto mt-5 max-w-xl space-y-4 md:mx-0 md:mt-6">
              {home.solutionsBody.split("\n\n").map((para, i) => (
                <AnimateIn key={para.slice(0, 24)} variant="up" index={i + 1}>
                  <p className="text-[15px] leading-relaxed text-ink-muted md:text-base">
                    {para}
                  </p>
                </AnimateIn>
              ))}
            </div>
            <AnimateIn variant="up" index={3}>
              <Link
                href="/shop"
                className="btn-asymmetric btn-lift mt-8 inline-flex w-full items-center justify-center bg-gold px-7 py-3.5 text-sm font-semibold text-ink sm:w-auto md:mt-10"
              >
                {home.solutionsCta}
              </Link>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
