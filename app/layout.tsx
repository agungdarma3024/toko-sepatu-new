// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 1. IMPORT FOOTER DI SINI

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toko Online Wolak-Walik",
  description: "Beli sepatu impianmu di sini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            
            <Navbar />
            
            {/* children adalah isi halaman (page.tsx) */}
            {children} 
            
            <Footer /> {/* 2. PASANG FOOTER DI BAWAH CHILDREN */}
            
          </WishlistProvider>
        </CartProvider>
        
        <Toaster position="bottom-right" /> 
      </body>
    </html>
  );
}