// app/admin/page.tsx
"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/data";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
  TrendingUp, DollarSign, ArrowUpRight, Menu
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminDashboard() {
  
  const handleLogout = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    window.location.reload(); 
  };

  // Komponen Isi Menu (Agar tidak mengulang kode dua kali untuk Desktop & Mobile)
  const MenuLinks = () => (
    <>
      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white font-medium transition-colors">
        <LayoutDashboard className="w-5 h-5" /> Dashboard
      </Link>
      <Link href="/admin/produk" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
        <Package className="w-5 h-5" /> Kelola Produk
      </Link>
      <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
        <ShoppingCart className="w-5 h-5" /> Pesanan Masuk
      </Link>
      <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
        <Users className="w-5 h-5" /> Pelanggan
      </Link>
      <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
        <Settings className="w-5 h-5" /> Pengaturan
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* === HEADER MOBILE (Hanya tampil di HP) === */}
      <div className="md:hidden flex items-center justify-between bg-zinc-950 p-4 sticky top-0 z-50 shadow-md">
        <h2 className="text-xl font-bold text-white tracking-wider">WOLAK-WALIK<span className="text-red-500">.</span></h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-zinc-950 text-zinc-300 border-r border-zinc-800 p-0 flex flex-col">
            <SheetHeader className="p-6 border-b border-zinc-800 text-left">
              <SheetTitle className="text-xl font-bold text-white tracking-wider">WOLAK-WALIK<span className="text-red-500">.</span></SheetTitle>
            </SheetHeader>
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
              <MenuLinks />
            </nav>
            <div className="p-4 border-t border-zinc-800">
              <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                <LogOut className="w-5 h-5" /> Keluar
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* === SIDEBAR DESKTOP (Sembunyi di HP) === */}
      <aside className="hidden md:flex w-64 bg-zinc-950 text-zinc-300 flex-col shrink-0 min-h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white tracking-wider">WOLAK-WALIK<span className="text-red-500">.</span></h2>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          <MenuLinks />
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10">
            <LogOut className="w-5 h-5" /> Keluar
          </Button>
        </div>
      </aside>

      {/* === KONTEN UTAMA === */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ikhtisar Toko</h1>
            <p className="text-gray-500 text-sm mt-1">Pantau performa penjualan dan produk Anda hari ini.</p>
          </div>
          <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 shadow-sm">Unduh Laporan</Button>
        </div>

        {/* ... (Kartu Statistik) ... */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="border-none shadow-sm"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle><div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><DollarSign className="w-4 h-4" /></div></CardHeader><CardContent><div className="text-2xl font-bold text-gray-900">{formatPrice(24500000)}</div><p className="text-xs text-green-600 flex items-center mt-1"><ArrowUpRight className="w-3 h-3 mr-1" /> +15.2% dari bulan lalu</p></CardContent></Card>
          <Card className="border-none shadow-sm"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-500">Pesanan Baru</CardTitle><div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><ShoppingCart className="w-4 h-4" /></div></CardHeader><CardContent><div className="text-2xl font-bold text-gray-900">+124</div><p className="text-xs text-green-600 flex items-center mt-1"><ArrowUpRight className="w-3 h-3 mr-1" /> +8% dari bulan lalu</p></CardContent></Card>
          <Card className="border-none shadow-sm"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Produk</CardTitle><div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Package className="w-4 h-4" /></div></CardHeader><CardContent><div className="text-2xl font-bold text-gray-900">45</div><p className="text-xs text-gray-500 mt-1">3 stok hampir habis</p></CardContent></Card>
          <Card className="border-none shadow-sm"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-500">Pengunjung Aktif</CardTitle><div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div></CardHeader><CardContent><div className="text-2xl font-bold text-gray-900">1,204</div><p className="text-xs text-green-600 flex items-center mt-1"><ArrowUpRight className="w-3 h-3 mr-1" /> +24% dari minggu lalu</p></CardContent></Card>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-900">Pesanan Terbaru</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500">
                <tr><th className="px-4 sm:px-6 py-4 font-medium">ID Pesanan</th><th className="px-4 sm:px-6 py-4 font-medium">Pelanggan</th><th className="px-4 sm:px-6 py-4 font-medium">Tanggal</th><th className="px-4 sm:px-6 py-4 font-medium">Total</th><th className="px-4 sm:px-6 py-4 font-medium">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50"><td className="px-4 sm:px-6 py-4 font-medium text-gray-900">#ORD-001</td><td className="px-4 sm:px-6 py-4 text-gray-600">Budi Santoso</td><td className="px-4 sm:px-6 py-4 text-gray-500">Hari ini, 10:42 WIB</td><td className="px-4 sm:px-6 py-4 font-medium">{formatPrice(1299000)}</td><td className="px-4 sm:px-6 py-4"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Diproses</span></td></tr>
                <tr className="hover:bg-gray-50"><td className="px-4 sm:px-6 py-4 font-medium text-gray-900">#ORD-002</td><td className="px-4 sm:px-6 py-4 text-gray-600">Siti Aminah</td><td className="px-4 sm:px-6 py-4 text-gray-500">Kemarin, 15:30 WIB</td><td className="px-4 sm:px-6 py-4 font-medium">{formatPrice(899000)}</td><td className="px-4 sm:px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Selesai</span></td></tr>
                <tr className="hover:bg-gray-50"><td className="px-4 sm:px-6 py-4 font-medium text-gray-900">#ORD-003</td><td className="px-4 sm:px-6 py-4 text-gray-600">Andi Pratama</td><td className="px-4 sm:px-6 py-4 text-gray-500">21 Feb 2026</td><td className="px-4 sm:px-6 py-4 font-medium">{formatPrice(2198000)}</td><td className="px-4 sm:px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Dikirim</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}