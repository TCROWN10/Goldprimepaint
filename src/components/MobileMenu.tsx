"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { buildWhatsAppUrl } from "@/lib/data";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useApp();
  const { business, footer, nav } = useContent();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (!menuOpen) return null;

  const links = [
    { href: "/shop", label: nav.shop },
    { href: "/custom", label: nav.custom },
    { href: "/about", label: nav.about },
    { href: "/contact", label: nav.contact },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade-in"
        onClick={() => setMenuOpen(false)}
      />
      <aside className="relative flex h-full w-[min(100%,22rem)] flex-col bg-cream-deep shadow-2xl animate-slide-in-right sm:w-[26rem]">
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <Logo size="sm" onClick={() => setMenuOpen(false)} />
          <button
            type="button"
            aria-label="Close"
            onClick={() => setMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-tan-soft/80 text-ink transition hover:bg-tan"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-6 pt-4">
          <ul>
            {links.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-ink/10 py-5 font-serif text-[2.1rem] leading-none text-ink transition hover:text-oxblood sm:text-[2.4rem]"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="text-[11px] tracking-[0.25em] text-ink-muted">{footer.followLabel}</p>
            <div className="mt-4 flex gap-3">
              <SocialCircle
                href={buildWhatsAppUrl(business.whatsappNumber, footer.whatsappMessage)}
                label="WhatsApp"
              >
                <WhatsAppIcon />
              </SocialCircle>
              <SocialCircle href={business.instagramUrl} label="Instagram">
                <InstagramIcon />
              </SocialCircle>
              {business.facebookUrl ? (
                <SocialCircle href={business.facebookUrl} label="Facebook">
                  <FacebookIcon />
                </SocialCircle>
              ) : null}
              {business.tiktokUrl ? (
                <SocialCircle href={business.tiktokUrl} label="TikTok">
                  <TikTokIcon />
                </SocialCircle>
              ) : null}
            </div>
            <p className="mt-6 text-sm text-ink-soft">{business.phoneDisplay}</p>
            {business.phoneSecondary ? (
              <p className="mt-1 text-sm text-ink-soft">{business.phoneSecondary}</p>
            ) : null}
            {business.email ? (
              <a href={`mailto:${business.email}`} className="mt-2 block text-sm text-ink-soft">
                {business.email}
              </a>
            ) : null}
            <p className="mt-1 text-[11px] tracking-[0.2em] text-gold">
              {business.locationLine}
            </p>
          </div>
        </nav>

        <div className="p-6">
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center justify-center rounded-full bg-gold py-4 text-[15px] font-medium text-ink transition hover:bg-gold/90"
          >
            {nav.shopCta}
          </Link>
        </div>
      </aside>
    </div>
  );
}

function SocialCircle({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:border-ink hover:bg-ink hover:text-cream"
    >
      {children}
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.48V13a8.27 8.27 0 005.58 2.17V11.7a4.85 4.85 0 01-3.63-1.63V6.69h3.63z" />
    </svg>
  );
}
