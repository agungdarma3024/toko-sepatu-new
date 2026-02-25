// components/Footer.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const pathname = usePathname();

  // INI KUNCINYA: Sembunyikan Footer jika URL adalah halaman Admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-8 border-t border-zinc-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Tentang */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white">
              <Store className="h-7 w-7" />
              <span>Wolak-Walik<span className="text-red-500">.</span></span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed mt-2">
              Toko sepatu terpercaya yang menyediakan koleksi terbaru dan original untuk gaya hidup aktif dan kasual Anda.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Tautan Cepat */}
          <div>
            <h3 className="font-bold text-white text-lg mb-6">Tautan Cepat</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/produk" className="hover:text-white transition-colors">Semua Produk</Link></li>
              <li><Link href="/kategori/sneakers" className="hover:text-white transition-colors">Kategori Sneakers</Link></li>
              <li><Link href="/kategori/running" className="hover:text-white transition-colors">Kategori Running</Link></li>
              <li><Link href="/kategori/casual" className="hover:text-white transition-colors">Kategori Casual</Link></li>
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h3 className="font-bold text-white text-lg mb-6">Hubungi Kami</h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                <span>Jl. Sudirman No. 123, Jakarta Pusat, Indonesia 10220</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>halo@wolakwalik.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-white text-lg mb-6">Buletin Kami</h3>
            <p className="text-sm text-zinc-400 mb-4">Dapatkan info promo dan rilis sepatu terbaru langsung ke email Anda.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Email Anda..." className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-zinc-700" />
              <Button className="bg-white text-black hover:bg-zinc-200">Daftar</Button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Wolak-Walik Store. Hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}