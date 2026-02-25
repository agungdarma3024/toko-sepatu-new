// app/not-found.tsx
import Link from "next/link";
import { SearchX, ArrowLeft, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4 text-center">
      
      {/* Ikon Animasi / Visual */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gray-100 rounded-full animate-pulse scale-150"></div>
        <div className="relative bg-white p-6 rounded-full shadow-lg border border-gray-100">
          <SearchX className="w-16 h-16 text-gray-400" />
        </div>
      </div>

      {/* Teks Error */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
        Waduh, Nyasar!
      </h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8 md:text-lg">
        Halaman atau produk yang Anda cari sepertinya sudah pindah, dihapus, atau memang tidak pernah ada.
      </p>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button asChild className="h-12 px-8 bg-black text-white hover:bg-gray-800 rounded-full font-medium text-base gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-12 px-8 border-gray-300 rounded-full font-medium text-base gap-2">
          <Link href="/produk">
            <Store className="w-4 h-4" /> Lihat Semua Produk
          </Link>
        </Button>
      </div>

    </main>
  );
}