import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sai Furniture — Handcrafted Solid Wood Furniture Showroom",
  description: "Visit Sai Furniture at Furniture Market, 60 Feet Road, Ganjmal Shalimaar Nashik. Handcrafted wooden sofas, beds, dining sets, and custom furniture.",
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
};

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "name": "Sai Furniture",
  "image": "https://saifurniture.com/images/logo.jpg",
  "description": "Handcrafted solid wood furniture showroom in Nashik offering premium wooden sofas, beds, dining sets, and custom made-to-order furniture.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Furniture Market, 60 Feet Road, Ganjmal Shalimaar",
    "addressLocality": "Nashik",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN",
  },
  "hasMap": "https://www.google.com/maps/search/?api=1&query=Sai+Furniture%2C+Furniture+Market%2C+60+Feet+Road%2C+Ganjmal+Shalimaar+Nashik",
  "telephone": "+91 98765 43210",
  "email": "support@saifurniture.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#2C221E]">
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
