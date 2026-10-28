"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingCart } from "@/components/FloatingCart";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/MobileMenu";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!admin && <MobileMenu />}
      {!admin && <Footer />}
      {!admin && <WhatsAppFab />}
      {!admin && <FloatingCart />}
      {!admin && <CartDrawer />}
    </>
  );
}
