"use client";

import { useState } from "react";
import { AnimateIn } from "@/components/AnimateIn";
import { useContent } from "@/lib/content-context";

export function TestimonialRow() {
  const [paused, setPaused] = useState(false);
  const { home, testimonials } = useContent();

  if (!testimonials.length) return null;

  // Triple the list so the -33.333% marquee loop stays seamless
  const track = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden bg-cream py-14 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
        <AnimateIn variant="fade" className="text-center">
          <p className="text-[11px] font-medium tracking-[0.28em] text-ink-muted uppercase">
            {home.testimonialEyebrow}
          </p>
          <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-4xl">
            {home.testimonialTitle}
          </h2>
        </AnimateIn>
      </div>

      <div
        className="testimonial-marquee mt-10 sm:mt-12 lg:mt-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className={`testimonial-marquee__track ${paused ? "is-paused" : ""}`}
          aria-label="Customer reviews"
        >
          {track.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="card-soft testimonial-marquee__card flex shrink-0 flex-col bg-white px-6 py-7 shadow-[0_8px_28px_rgba(3,37,80,0.06)] sm:px-7 sm:py-8"
              aria-hidden={i >= testimonials.length}
            >
              <span
                className="select-none font-serif text-5xl leading-none text-gold"
                aria-hidden
              >
                ”
              </span>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft md:text-base">
                {t.quote}
              </p>
              <div className="mt-7">
                <p className="text-[15px] font-bold text-ink">{t.name}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{t.city}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
