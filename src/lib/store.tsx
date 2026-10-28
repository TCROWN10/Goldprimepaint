"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PaintColour, Range } from "./data";

export type CartItem = {
  id: string;
  productSlug: string;
  productName: string;
  category: string;
  range: Range;
  colour: string;
  colourHex: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
};

/** @deprecated Prefer CartItem — kept for older checkout helpers */
export type PendingOrder = CartItem;

type AppState = {
  range: Range;
  setRange: (range: Range) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateCartQty: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  pendingOrder: CartItem | null;
  setPendingOrder: (order: CartItem | null) => void;
  selectedColour: PaintColour | null;
  setSelectedColour: (colour: PaintColour | null) => void;
};

const CART_KEY = "goldprime-cart";
const AppContext = createContext<AppState | null>(null);

function cartItemKey(item: Omit<CartItem, "id" | "quantity">) {
  return [item.productSlug, item.colour, item.size, item.range].join("|");
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<Range>("indoor");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CartItem | null>(null);
  const [selectedColour, setSelectedColour] = useState<PaintColour | null>(null);

  useEffect(() => {
    setCart(loadCart());
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, cartReady]);

  const addToCart = useCallback((item: Omit<CartItem, "id">) => {
    setCart((current) => {
      const key = cartItemKey(item);
      const existing = current.find((entry) => cartItemKey(entry) === key);
      if (existing) {
        return current.map((entry) =>
          entry.id === existing.id
            ? {
                ...entry,
                quantity: Math.min(20, entry.quantity + item.quantity),
              }
            : entry
        );
      }
      return [
        ...current,
        {
          ...item,
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        },
      ];
    });
    setCartOpen(true);
  }, []);

  const updateCartQty = useCallback((id: string, quantity: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      range,
      setRange,
      menuOpen,
      setMenuOpen,
      cart,
      cartOpen,
      setCartOpen,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      pendingOrder,
      setPendingOrder,
      selectedColour,
      setSelectedColour,
    }),
    [
      range,
      menuOpen,
      cart,
      cartOpen,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      pendingOrder,
      selectedColour,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
