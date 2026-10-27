import Image from "next/image";
import { Header } from "@/components/Header";
import { AnimateIn } from "@/components/AnimateIn";
import { CustomColourRequest } from "@/components/CustomColourRequest";
import { isExteriorPhoto } from "@/lib/data";
import { getSiteContent } from "@/lib/content";

export const metadata = {
  title: "Custom colour",
};

export default async function CustomPage() {
  const { custom, business } = await getSiteContent();
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <AnimateIn variant="up">
              <div>
                <p className="text-[11px] tracking-[0.28em] text-ink-muted">{custom.eyebrow}</p>
                <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
                  {custom.title}
                </h1>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft md:text-base">
                  {custom.body}
                </p>
                <CustomColourRequest
                  whatsappNumber={business.whatsappNumber}
                  whatsappMessage={custom.whatsappMessage}
                  colourLabel={custom.colourLabel}
                  colourPlaceholder={custom.colourPlaceholder}
                  colourHint={custom.colourHint}
                  sendButton={custom.whatsappButton}
                  shopButton={custom.shopButton}
                />
              </div>
            </AnimateIn>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <AnimateIn index={0} variant="scale" className="row-span-2">
                <div className="card-media-frame relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-cream-deep shadow-[0_12px_36px_rgba(3,37,80,0.1)]">
                  <Image
                    src={custom.images[0]?.src || ""}
                    alt={isExteriorPhoto(custom.images[0]?.src || "") ? "Exterior" : custom.images[0]?.alt || ""}
                    fill
                    unoptimized={isExteriorPhoto(custom.images[0]?.src || "")}
                    className={
                      isExteriorPhoto(custom.images[0]?.src || "")
                        ? "object-cover"
                        : "card-media object-cover"
                    }
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  {isExteriorPhoto(custom.images[0]?.src || "") && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-cream">
                      EXTERIOR
                    </span>
                  )}
                </div>
              </AnimateIn>
              <AnimateIn index={1} variant="scale">
                <div className="card-media-frame relative min-h-[150px] overflow-hidden rounded-[1.5rem] bg-cream-deep shadow-[0_12px_36px_rgba(3,37,80,0.1)] md:min-h-[200px]">
                  <Image
                    src={custom.images[1]?.src || ""}
                    alt={isExteriorPhoto(custom.images[1]?.src || "") ? "Exterior" : custom.images[1]?.alt || ""}
                    fill
                    unoptimized={isExteriorPhoto(custom.images[1]?.src || "")}
                    className={
                      isExteriorPhoto(custom.images[1]?.src || "")
                        ? "object-cover"
                        : "card-media object-cover"
                    }
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </AnimateIn>
              <AnimateIn index={2} variant="scale">
                <div className="card-media-frame relative min-h-[150px] overflow-hidden rounded-[1.5rem] bg-cream-deep shadow-[0_12px_36px_rgba(3,37,80,0.1)] md:min-h-[200px]">
                  <Image
                    src={custom.images[2]?.src || ""}
                    alt={isExteriorPhoto(custom.images[2]?.src || "") ? "Exterior" : custom.images[2]?.alt || ""}
                    fill
                    unoptimized={isExteriorPhoto(custom.images[2]?.src || "")}
                    className={
                      isExteriorPhoto(custom.images[2]?.src || "")
                        ? "object-cover"
                        : "card-media object-cover"
                    }
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
