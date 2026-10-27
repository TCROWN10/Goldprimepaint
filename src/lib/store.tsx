"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PaintColour, Range } from "./data";

export type PendingOrder = {
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

type AppState = {
  range: Range;
  setRange: (range: Range) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  pendingOrder: PendingOrder | null;
  setPendingOrder: (order: PendingOrder | null) => void;
  selectedColour: PaintColour | null;
  setSelectedColour: (colour: PaintColour | null) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<Range>("indoor");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [selectedColour, setSelectedColour] = useState<PaintColour | null>(null);

  const value = useMemo(
    () => ({
      range,
      setRange,
      menuOpen,
      setMenuOpen,
      pendingOrder,
      setPendingOrder,
      selectedColour,
      setSelectedColour,
    }),
    [range, menuOpen, pendingOrder, selectedColour]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
