import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Velvet Whisper — женская одежда quiet luxury",
    template: "%s | Velvet Whisper"
  },
  description:
    "Velvet Whisper — премиальный российский fashion e-commerce бренд женской одежды: жакеты, платья, пальто, трикотаж и рубашки в эстетике quiet luxury.",
  openGraph: {
    title: "Velvet Whisper",
    description:
      "Мягкое высказывание современной элегантности. Первая коллекция женской одежды Velvet Whisper.",
    url: siteUrl,
    siteName: "Velvet Whisper",
    locale: "ru_RU",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
