import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import IntroVideo from "@/components/IntroVideo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Website | Next.js + Tailwind",
  description: "A modern website built with Next.js and Tailwind CSS",
  other: {
    "google": "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <CartProvider>
          <IntroVideo />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}