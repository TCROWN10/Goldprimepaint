"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  buildWhatsAppUrl,
  cartOrderMessage,
  formatPrice,
  isTinPhoto,
  rangeLabel,
} from "@/lib/data";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";
import { Header } from "@/components/Header";

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useApp();
  const content = useContent();
  const router = useRouter();

  useEffect(() => {
    if (cartCount === 0) {
      router.replace("/shop");
    }
  }, [cartCount, router]);

  if (cartCount === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-5 py-24 text-ink-soft">
        Loading order…
      </main>
    );
  }

  const message = cartOrderMessage(
    content.order,
    cart.map((item) => ({
      productName: item.productName,
      range: rangeLabel(item.range, content.rangeLabels),
      category: item.category,
      colour: item.colour,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }))
  );

  return (
    <>
      <Header variant="back" backHref="/shop" />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 py-8 md:max-w-xl md:px-8 md:py-12 lg:max-w-2xl">
          <p className="text-center text-[11px] font-medium tracking-[0.28em] text-ink-muted">
            {content.checkout.eyebrow}
          </p>
          <h1 className="mt-2 text-center font-serif text-3xl text-ink md:text-4xl">
            {content.checkout.title}
          </h1>
          <p className="mt-2 text-center text-sm text-ink-soft">
            {cartCount === 1
              ? "1 paint ready to send"
              : `${cartCount} paints ready to send`}
          </p>

          <div className="mt-8 space-y-3">
            {cart.map((item) => (
              <article
                key={item.id}
                className="card-soft overflow-hidden rounded-[1.5rem] bg-cream-card shadow-[0_12px_36px_rgba(3,37,80,0.07)] ring-1 ring-ink/5"
              >
                <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-deep sm:h-28 sm:w-24">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        unoptimized={isTinPhoto(item.image)}
                        className={
                          isTinPhoto(item.image)
                            ? "object-contain p-1"
                            : "object-cover"
                        }
                        sizes="96px"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: item.colourHex }}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-serif text-xl text-ink sm:text-2xl">
                        {item.productName}
                      </h2>
                      <p className="shrink-0 text-sm font-semibold text-ink sm:text-base">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <p className="mt-1 text-[12px] tracking-[0.12em] text-ink-muted uppercase">
                      {rangeLabel(item.range, content.rangeLabels)} · {item.category}
                    </p>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <Row label={content.checkout.colourLabel} value={item.colour} />
                      <Row label={content.checkout.tinLabel} value={item.size} />
                      <Row
                        label={content.checkout.quantityLabel}
                        value={String(item.quantity)}
                      />
                    </dl>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream-card px-4 py-3.5 ring-1 ring-ink/5">
            <span className="text-sm text-ink-soft">{content.checkout.totalLabel}</span>
            <span className="font-serif text-2xl text-ink">
              {formatPrice(cartTotal)}
            </span>
          </div>

          <p className="mt-5 flex items-start gap-2 text-sm text-ink-soft">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp-deep">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </span>
            {content.checkout.note}
          </p>

          <div className="mt-auto pt-8">
            <a
              href={buildWhatsAppUrl(content.business.whatsappNumber, message)}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                clearCart();
                setTimeout(() => {
                  window.location.href = "/order-sent";
                }, 400);
              }}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp py-4 text-[15px] font-semibold text-white shadow-[0_12px_32px_rgba(78,203,96,0.4)] transition hover:bg-whatsapp-deep"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {content.checkout.continueButton}
            </a>
            <Link
              href="/shop"
              className="mt-3 block text-center text-sm text-ink-soft transition hover:text-ink"
            >
              {content.checkout.editLink}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[11px] font-medium tracking-[0.14em] text-ink-muted uppercase">
        {label}
      </dt>
      <dd className="text-[14px] text-ink">{value}</dd>
    </div>
  );
}
