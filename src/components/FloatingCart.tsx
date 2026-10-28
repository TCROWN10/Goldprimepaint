"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";

const POS_KEY = "goldprime-cart-fab-pos";
const SIZE = 56;

type Pos = { x: number; y: number };

function clampPos(pos: Pos): Pos {
  if (typeof window === "undefined") return pos;
  const maxX = Math.max(8, window.innerWidth - SIZE - 8);
  const maxY = Math.max(8, window.innerHeight - SIZE - 8);
  return {
    x: Math.min(maxX, Math.max(8, pos.x)),
    y: Math.min(maxY, Math.max(8, pos.y)),
  };
}

function defaultPos(): Pos {
  if (typeof window === "undefined") return { x: 16, y: 120 };
  return clampPos({
    x: 16,
    y: window.innerHeight - SIZE - 96,
  });
}

export function FloatingCart() {
  const pathname = usePathname();
  const { cartCount, setCartOpen, cartOpen } = useApp();
  const [pos, setPos] = useState<Pos>(defaultPos);
  const [ready, setReady] = useState(false);
  const posRef = useRef(pos);
  const dragging = useRef(false);
  const moved = useRef(false);
  const origin = useRef({ x: 0, y: 0, pointerX: 0, pointerY: 0 });

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(POS_KEY);
      if (raw) {
        setPos(clampPos(JSON.parse(raw) as Pos));
      } else {
        setPos(defaultPos());
      }
    } catch {
      setPos(defaultPos());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    function onResize() {
      setPos((current) => clampPos(current));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const savePos = useCallback((next: Pos) => {
    const clamped = clampPos(next);
    setPos(clamped);
    posRef.current = clamped;
    window.localStorage.setItem(POS_KEY, JSON.stringify(clamped));
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragging.current = true;
    moved.current = false;
    origin.current = {
      x: posRef.current.x,
      y: posRef.current.y,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    const dx = event.clientX - origin.current.pointerX;
    const dy = event.clientY - origin.current.pointerY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
    const next = clampPos({
      x: origin.current.x + dx,
      y: origin.current.y + dy,
    });
    posRef.current = next;
    setPos(next);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    if (moved.current) {
      savePos(posRef.current);
      return;
    }
    setCartOpen(!cartOpen);
  };

  if (pathname.startsWith("/admin") || !ready) return null;

  return (
    <button
      type="button"
      aria-label={
        cartCount > 0 ? `Open cart, ${cartCount} items` : "Open cart"
      }
      title="Drag to move · tap to open cart"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="floating-cart fixed z-[55] flex h-14 w-14 touch-none items-center justify-center rounded-full bg-ink text-cream shadow-[0_12px_32px_rgba(3,37,80,0.35)] transition-[transform,box-shadow] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      style={{ left: pos.x, top: pos.y }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 5h2l1.4 9.2a2 2 0 002 1.8h8.3a2 2 0 001.95-1.55L20 8H7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.35" fill="currentColor" />
        <circle cx="17" cy="20" r="1.35" fill="currentColor" />
      </svg>
      {cartCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      ) : null}
    </button>
  );
}
