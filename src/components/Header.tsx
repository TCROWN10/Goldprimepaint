"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

type HeaderProps = {
  variant?: "default" | "back" | "transparent";
  backHref?: string;
  backLabel?: string;
};

export function Header({
  variant = "default",
  backHref = "/",
  backLabel,
}: HeaderProps) {
  const { setMenuOpen } = useApp();
  const { nav } = useContent();
  const pathname = usePathname();
  const links = [
    { href: "/shop", label: nav.shop },
    { href: "/custom", label: nav.custom },
    { href: "/about", label: nav.about },
    { href: "/contact", label: nav.contact },
  ];

  if (variant === "back") {
    return (
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-5 md:h-[5.5rem] md:px-8 lg:px-10">
          <Link
            href={backHref}
            className="group flex items-center gap-2 text-[15px] text-ink-soft transition hover:text-ink"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 transition group-hover:border-ink/25">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="hidden sm:inline">{backLabel ?? nav.back}</span>
          </Link>
          <Logo size="md" priority />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-deep text-ink transition hover:bg-tan-soft"
          >
            <MenuIcon />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-5 md:h-[5.5rem] md:px-8 lg:px-10">
        <Logo size="md" priority />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-serif text-lg transition ${
                  active ? "text-oxblood" : "text-ink hover:text-oxblood"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition hover:bg-gold/90 md:inline-flex"
          >
            {nav.shopCta}
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-deep text-ink transition hover:bg-tan-soft lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
      <path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
