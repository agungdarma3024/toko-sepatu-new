// app/admin/produk/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { products, formatPrice } from "@/lib/data";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
  Plus, Search, Edit, Trash2, Image as ImageIcon, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminProdukPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddOpen(false);
    toast.success("Produk Berhasil Ditambahkan!", { description: "Ini adalah simulasi." });
  };

  const handleDelete = (name: string) => {
    toast.error("Produk Dihapus", { description: `${name} telah dihapus dari sistem.` });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    window.location.reload(); 
  };

  const MenuLinks = () => (
    <>
      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
        <LayoutDashboard className="w-5 h-5" /> Dashboard
      </Link>
      <Link href="/admin/produk" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white font-medium transition-colors">
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
      
      {/* === HEADER MOBILE === */}
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
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2"><MenuLinks /></nav>
            <div className="p-4 border-t border-zinc-800">
              <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                <LogOut className="w-5 h-5" /> Keluar
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* === SIDEBAR DESKTOP === */}
      <aside className="hidden md:flex w-64 bg-zinc-950 text-zinc-300 flex-col shrink-0 min-h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white tracking-wider">WOLAK-WALIK<span className="text-red-500">.</span></h2>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2"><MenuLinks /></nav>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Produk</h1>
            <p className="text-gray-500 text-sm mt-1">Tambah, edit, atau hapus produk di toko Anda.</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 shadow-sm flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Produk
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] bg-white text-black max-h-[90vh] flex flex-col p-0 overflow-hidden w-[95vw] sm:w-full rounded-2xl sm:rounded-xl">
              <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100">
                <DialogTitle className="text-lg sm:text-xl font-bold">Tambah Produk Baru</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-gray-500">Lengkapi data sepatu di bawah ini.</DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <form id="add-product-form" onSubmit={handleAddProduct} className="flex flex-col gap-4 sm:gap-6">
                  {/* ... (Form isian tetap sama) ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2"><label className="text-sm font-medium">Nama Produk</label><Input required placeholder="Contoh: Wolak Air Max 90" className="bg-gray-50" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Kategori</label><select className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black"><option value="sneakers">Sneakers</option><option value="running">Running</option><option value="casual">Casual</option><option value="formal">Formal</option></select></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Gender</label><select className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black"><option value="Pria">Pria</option><option value="Wanita">Wanita</option><option value="Unisex">Unisex</option></select></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Harga Jual (Rp)</label><Input required type="number" placeholder="Contoh: 1250000" className="bg-gray-50" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Harga Coret (Opsional)</label><Input type="number" placeholder="Contoh: 1500000" className="bg-gray-50" /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2"><label className="text-sm font-medium flex justify-between">Pilihan Warna <span className="text-[10px] text-gray-400 font-normal">Koma</span></label><Input required placeholder="Cth: Hitam, Putih" className="bg-gray-50" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium flex justify-between">Pilihan Ukuran <span className="text-[10px] text-gray-400 font-normal">Koma</span></label><Input required placeholder="Cth: 39, 40, 41" className="bg-gray-50" /></div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                    <label className="text-sm font-semibold text-gray-900">Label Marketing (Opsional)</label>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-8">
                      <label className="flex items-center gap-2 cursor-pointer group"><input type="checkbox" className="w-4 h-4 accent-black cursor-pointer" /><span className="text-sm text-gray-700 group-hover:text-black">Best Seller</span></label>
                      <label className="flex items-center gap-2 cursor-pointer group"><input type="checkbox" className="w-4 h-4 accent-black cursor-pointer" /><span className="text-sm text-gray-700 group-hover:text-black text-red-500 font-medium">New Release</span></label>
                    </div>
                  </div>

                  <div className="space-y-2"><label className="text-sm font-medium">Deskripsi Lengkap</label><textarea required className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="Jelaskan material..."></textarea></div>
                  <div className="space-y-2 border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-black cursor-pointer transition-colors bg-white"><ImageIcon className="w-8 h-8 mb-2 text-gray-400" /><span className="text-xs sm:text-sm font-medium text-gray-700">Klik untuk unggah foto utama</span></div>
                </form>
              </div>

              <DialogFooter className="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-100 bg-white flex-col sm:flex-row gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="w-full sm:w-auto">Batal</Button>
                <Button type="submit" form="add-product-form" className="w-full sm:w-auto bg-black text-white hover:bg-gray-800">Simpan Produk</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white p-4 rounded-t-xl border border-gray-100 border-b-0 flex flex-col sm:flex-row justify-between items-center shadow-sm gap-3 sm:gap-0">
          <div className="relative w-full sm:w-72">
            <Input type="text" placeholder="Cari nama atau kategori..." className="pl-9 bg-gray-50 focus-visible:ring-black w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="text-sm text-gray-500 w-full sm:w-auto text-left sm:text-right">Total: <span className="font-bold text-gray-900">{filteredProducts.length}</span> Produk</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-b-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr><th className="px-4 sm:px-6 py-4 font-medium">Produk Info</th><th className="px-4 sm:px-6 py-4 font-medium">Kategori</th><th className="px-4 sm:px-6 py-4 font-medium">Harga</th><th className="px-4 sm:px-6 py-4 font-medium">Status / Label</th><th className="px-4 sm:px-6 py-4 font-medium text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Produk yang Anda cari tidak ditemukan.</td></tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img src={product.image} alt={product.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover border border-gray-200 shrink-0" />
                          <div className="min-w-0"><p className="font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">{product.name}</p><p className="text-[10px] sm:text-xs text-gray-500">ID: {product.id}</p></div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4"><span className="capitalize px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] sm:text-xs font-medium">{product.category}</span></td>
                      <td className="px-4 sm:px-6 py-4 font-bold text-gray-900">{formatPrice(product.price)}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          {product.isBestSeller ? <span className="text-green-600 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 border border-green-200 bg-green-50 px-2 py-0.5 rounded-full">Best Seller</span> : <span className="text-gray-400 text-[10px] sm:text-[11px] font-medium flex items-center gap-1">Stok Normal</span>}
                          {product.isNew && <span className="text-red-600 text-[10px] sm:text-[11px] font-bold border border-red-200 bg-red-50 px-2 py-0.5 rounded-full">New Release</span>}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button variant="outline" size="icon" className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"><Edit className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
                          <Button variant="outline" size="icon" className="w-7 h-7 sm:w-8 sm:h-8 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" onClick={() => handleDelete(product.name)}><Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}