import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import { getSiteContent } from "@/lib/content";
import { ContentProvider } from "@/lib/content-context";
import { AppProvider } from "@/lib/store";
import "./globals.css";

export const dynamic = "force-dynamic";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: {
      default: content.seo.title,
      template: `%s · ${content.seo.titleSuffix}`,
    },
    description: content.seo.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <html
      lang="en"
      className={`${instrument.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <ContentProvider content={content}>
          <AppProvider>
            <SiteChrome>{children}</SiteChrome>
          </AppProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
