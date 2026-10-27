"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateIn } from "@/components/AnimateIn";
import { isProjectPhoto } from "@/lib/data";
import { useContent } from "@/lib/content-context";

export function Sustainability() {
  const { home } = useContent();
  const src = home.sustainImage.src;

  return (
    <section className="overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2 lg:items-stretch">
        <AnimateIn
          variant="left"
          className="reveal-zoom relative aspect-[5/4] w-full sm:aspect-[16/11] md:aspect-[16/10] lg:aspect-auto lg:min-h-[36rem]"
        >
          <Image
            src={src}
            alt={home.sustainImage.alt}
            fill
            unoptimized={isProjectPhoto(src)}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="reveal-zoom__media object-cover"
          />
        </AnimateIn>

        <div className="flex flex-col justify-center bg-cream px-5 py-12 sm:px-8 md:px-10 md:py-14 lg:px-12 lg:py-16 xl:px-16">
          <AnimateIn variant="right">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-[2.15rem] md:leading-tight">
              {home.sustainTitle}
            </h2>
          </AnimateIn>
          <AnimateIn variant="up" index={1}>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted md:mt-5 md:text-base">
              {home.sustainIntro}
            </p>
          </AnimateIn>
          <ul className="mt-6 space-y-4 md:mt-7">
            {home.sustainPoints.map((point, i) => (
              <AnimateIn key={point.title} variant="up" index={i + 2} as="li">
                <p className="text-[15px] leading-relaxed text-ink-muted md:text-base">
                  <span className="font-semibold text-ink">{point.title}:</span>{" "}
                  {point.body}
                </p>
              </AnimateIn>
            ))}
          </ul>
          <AnimateIn variant="up" index={5}>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-muted md:mt-7 md:text-base">
              {home.sustainClosing}
            </p>
            <Link
              href="/contact"
              className="btn-lift mt-8 inline-flex w-full items-center justify-center rounded-md bg-gold px-7 py-3.5 text-sm font-semibold text-ink sm:mt-9 sm:w-auto md:mt-10"
            >
              {home.sustainCta}
            </Link>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
