import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AnimateIn } from "@/components/AnimateIn";
import { isExteriorPhoto } from "@/lib/data";
import { getSiteContent } from "@/lib/content";

export const metadata = {
  title: "About",
};

export default async function AboutPage() {
  const { about } = await getSiteContent();
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16 lg:px-10">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <p className="text-[11px] tracking-[0.28em] text-ink-muted">{about.eyebrow}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
              {about.title}
            </h1>
            <div className="mt-6 space-y-4 text-left text-[15px] leading-relaxed text-ink-soft md:text-lg">
              {about.body.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
            <article className="rounded-[1.5rem] bg-cream-card px-7 py-8 shadow-[0_8px_30px_rgba(3,37,80,0.06)] md:px-8">
              <p className="text-[11px] tracking-[0.22em] text-ink-muted">OUR VISION</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{about.vision}</p>
            </article>
            <article className="rounded-[1.5rem] bg-cream-card px-7 py-8 shadow-[0_8px_30px_rgba(3,37,80,0.06)] md:px-8">
              <p className="text-[11px] tracking-[0.22em] text-ink-muted">OUR MISSION</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{about.mission}</p>
            </article>
          </div>

          <article className="mt-4 rounded-[1.5rem] bg-tan px-7 py-8 md:px-8">
            <p className="text-[11px] tracking-[0.22em] text-ink-muted">OUR CORE VALUES</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{about.value}</p>
          </article>

          <article className="mx-auto mt-4 max-w-3xl px-1 py-8 text-left">
            <p className="text-[11px] tracking-[0.22em] text-ink-muted">WELCOME</p>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-soft">
              {about.letter.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-6 font-serif text-xl text-ink">{about.letterName}</p>
            <p className="text-sm text-ink-soft">{about.letterRole}</p>
          </article>

          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
            {about.steps.map((item, i) => (
              <AnimateIn key={item.label} index={i} variant="scale">
                <div className="card-media-frame group overflow-hidden rounded-[1.5rem] shadow-[0_10px_30px_rgba(3,37,80,0.08)]">
                  <div className="relative aspect-[4/5] bg-cream-deep">
                    <Image
                      src={item.image}
                      alt={isExteriorPhoto(item.image) ? "Exterior" : item.label}
                      fill
                      unoptimized={isExteriorPhoto(item.image)}
                      className={
                        isExteriorPhoto(item.image)
                          ? "object-cover"
                          : "card-media object-cover"
                      }
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {isExteriorPhoto(item.image) && (
                      <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-cream">
                        EXTERIOR
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
                    <p className="card-title absolute bottom-5 left-5 font-serif text-2xl text-cream">
                      {item.label}
                    </p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn variant="up" className="mt-14">
            <div className="card-soft rounded-[1.75rem] bg-tan px-7 py-12 text-center shadow-[0_8px_30px_rgba(3,37,80,0.06)] md:px-12 md:py-16">
              <h2 className="font-serif text-3xl text-ink md:text-4xl">
                {about.bannerTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-ink-soft">
                {about.bannerBody}
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-flex rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-cream transition hover:scale-[1.02] hover:bg-ink/90"
              >
                {about.bannerCta}
              </Link>
            </div>
          </AnimateIn>
        </section>
      </main>
    </>
  );
}
