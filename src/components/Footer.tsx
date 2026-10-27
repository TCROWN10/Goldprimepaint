"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { buildWhatsAppUrl } from "@/lib/data";
import { useContent } from "@/lib/content-context";

export function Footer() {
  const { business, footer, nav } = useContent();
  const links = [
    { href: "/shop", label: nav.shop },
    { href: "/custom", label: nav.custom },
    { href: "/about", label: nav.about },
    { href: "/contact", label: nav.contact },
  ];
  return (
    <footer className="mt-auto bg-dark-menu text-cream-deep">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-gold">{footer.exploreLabel}</p>
            <ul className="mt-5 space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-serif text-2xl text-tan-soft transition hover:text-cream md:text-[1.75rem]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.28em] text-gold">{footer.followLabel}</p>
            <div className="mt-5 flex gap-3">
              <a
                href={buildWhatsAppUrl(business.whatsappNumber, footer.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-tan-soft/30 text-tan-soft transition hover:border-cream hover:text-cream"
                aria-label="WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-tan-soft/30 text-tan-soft transition hover:border-cream hover:text-cream"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {business.facebookUrl ? (
                <a
                  href={business.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-tan-soft/30 text-tan-soft transition hover:border-cream hover:text-cream"
                  aria-label="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1z" />
                  </svg>
                </a>
              ) : null}
            </div>
            <p className="mt-6 text-sm text-tan-soft/80">{business.phoneDisplay}</p>
            {business.phoneSecondary ? (
              <p className="mt-1 text-sm text-tan-soft/80">{business.phoneSecondary}</p>
            ) : null}
            {business.email ? (
              <a href={`mailto:${business.email}`} className="mt-2 block text-sm text-tan-soft/80">
                {business.email}
              </a>
            ) : null}
            {business.website ? (
              <a
                href={business.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-sm text-tan-soft/80"
              >
                {business.website.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
            <p className="mt-1 text-[11px] tracking-[0.22em] text-gold">
              {business.locationLine}
            </p>
          </div>

          <div className="md:text-right">
            <div className="inline-flex rounded-2xl bg-cream px-4 py-3">
              <Logo size="lg" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-tan-soft/70 md:ml-auto">
              {footer.blurb}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-tan-soft/15 pt-6">
          <p className="text-center text-[10px] tracking-[0.22em] text-tan-soft/50">
            {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
