"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { formatPrice, isTinPhoto, rangeLabel } from "@/lib/data";
import { useContent } from "@/lib/content-context";
import { useApp } from "@/lib/store";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQty,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useApp();
  const { rangeLabels } = useContent();

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-ink/45"
        onClick={() => setCartOpen(false)}
      />
      <aside
        className="animate-slide-in-right absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-[-16px_0_48px_rgba(3,37,80,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
              Your cart
            </p>
            <h2 className="mt-1 font-serif text-2xl text-ink">
              {cartCount === 0
                ? "No paints yet"
                : cartCount === 1
                  ? "1 paint"
                  : `${cartCount} paints`}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink transition hover:bg-cream-deep"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="max-w-[16rem] text-sm text-ink-soft">
                Add paints from a product page, then send one WhatsApp order for everything.
              </p>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream"
              >
                Browse shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-2xl bg-cream-card p-3 ring-1 ring-ink/5"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
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
                        sizes="64px"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: item.colourHex }}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-serif text-lg text-ink">
                          {item.productName}
                        </p>
                        <p className="mt-0.5 text-[12px] text-ink-muted">
                          {rangeLabel(item.range, rangeLabels)} · {item.size} ·{" "}
                          {item.colour}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.productName}`}
                        onClick={() => removeFromCart(item.id)}
                        className="text-[12px] font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-full border border-ink/12 bg-cream">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateCartQty(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-ink-soft"
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateCartQty(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-ink-soft"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 ? (
          <div className="border-t border-ink/8 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-ink-soft">Total</span>
              <span className="font-serif text-2xl text-ink">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-gold py-3.5 text-[15px] font-semibold text-ink shadow-[0_10px_28px_rgba(204,157,40,0.35)] transition hover:bg-gold/90"
            >
              Checkout order
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
