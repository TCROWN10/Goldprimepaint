import { Header } from "@/components/Header";
import { AnimateIn } from "@/components/AnimateIn";
import { buildWhatsAppUrl } from "@/lib/data";
import { getSiteContent } from "@/lib/content";

export const metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const { contact, business } = await getSiteContent();
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-5 py-14 text-center md:px-8 md:py-20">
          <div className="animate-fade-up">
            <p className="text-[11px] tracking-[0.28em] text-ink-muted">{contact.eyebrow}</p>
            <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
              {contact.title}
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
              {contact.body}
            </p>
          </div>

          <AnimateIn variant="scale" className="mt-10">
            <div className="card-soft rounded-[1.75rem] bg-cream-card p-8 shadow-[0_12px_40px_rgba(3,37,80,0.06)] ring-1 ring-ink/5 md:p-12">
              <p className="text-[11px] tracking-[0.2em] text-gold">
                {business.company}
              </p>
              <p className="mt-2 text-[11px] tracking-[0.2em] text-ink-muted">
                {business.locationLine}
              </p>
              {business.address ? (
                <p className="mt-4 text-sm text-ink-soft">
                  {business.address}
                  {business.city ? `, ${business.city}` : ""}
                  {business.country ? `, ${business.country}` : ""}
                </p>
              ) : business.country ? (
                <p className="mt-4 text-sm text-ink-soft">{business.country}</p>
              ) : null}
              <p className="mt-4 font-serif text-2xl text-ink md:text-3xl">
                {business.phoneDisplay}
              </p>
              {business.phoneSecondary ? (
                <p className="mt-1 font-serif text-2xl text-ink md:text-3xl">
                  {business.phoneSecondary}
                </p>
              ) : null}
              {business.email ? (
                <a
                  href={`mailto:${business.email}`}
                  className="mt-4 block text-sm text-ink-soft underline decoration-dotted underline-offset-4"
                >
                  {business.email}
                </a>
              ) : null}
              {business.website ? (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm text-ink-soft underline decoration-dotted underline-offset-4"
                >
                  {business.website.replace(/^https?:\/\//, "")}
                </a>
              ) : null}
              <a
                href={buildWhatsAppUrl(business.whatsappNumber, contact.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-8 py-4 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(78,203,96,0.35)] transition hover:scale-[1.02] hover:bg-whatsapp-deep"
              >
                {contact.whatsappButton}
              </a>
            </div>
          </AnimateIn>
        </section>
      </main>
    </>
  );
}
