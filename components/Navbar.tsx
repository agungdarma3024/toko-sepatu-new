// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react"; // Tambahkan ini
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Store, Heart, Trash2, Plus, Minus, Search, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, products } from "@/lib/data";
import { toast } from "sonner"; // Tambahkan ini

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { 
    cartItems, cartCount, removeFromCart, updateQuantity, 
    toggleSelectItem, toggleSelectAll, selectedTotal, selectedCount 
  } = useCart();
  
  const { likedItems } = useWishlist();
  const wishlistProducts = products.filter((product) => likedItems.includes(product.id));

  // === 1. STATE UNTUK USER LOGIN ===
  const [loggedInUser, setLoggedInUser] = useState<{name: string, email: string} | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // === 2. BACA MEMORI BROWSER SAAT NAVBAR MUNCUL ===
  useEffect(() => {
    const storedUser = localStorage.getItem("user_wolak_walik");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, [pathname]); // Akan mengecek ulang setiap kali pindah halaman

  // === 3. FUNGSI LOGOUT ===
  const handleLogout = () => {
    localStorage.removeItem("user_wolak_walik"); // Hapus dari memori
    setLoggedInUser(null); // Kosongkan state
    setIsProfileOpen(false); // Tutup menu pop-up
    toast.success("Anda berhasil keluar.");
    router.push("/");
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* KIRI: Logo & Menu */}
        <div className="flex items-center gap-4 md:gap-8">
          
          {/* === TOMBOL MENU MOBILE (HAMBURGER) === */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-zinc-950 text-white border-r border-zinc-900 flex flex-col">
                <SheetHeader className="text-left border-b border-zinc-800 pb-4">
                  <SheetTitle className="flex items-center gap-2 font-bold text-xl text-white">
                    <Store className="h-6 w-6" /> Wolak-Walik
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <Link href="/" className="text-lg font-medium text-zinc-300 hover:text-white pb-2 border-b border-zinc-800/50">Beranda</Link>
                  <Link href="/produk" className="text-lg font-medium text-zinc-300 hover:text-white pb-2 border-b border-zinc-800/50">Semua Produk</Link>
                  <Link href="/kategori/sneakers" className="text-lg font-medium text-zinc-300 hover:text-white pb-2 border-b border-zinc-800/50">Sneakers</Link>
                  <Link href="/kategori/casual" className="text-lg font-medium text-zinc-300 hover:text-white pb-2 border-b border-zinc-800/50">Casual</Link>
                  <Link href="/kategori/running" className="text-lg font-medium text-zinc-300 hover:text-white pb-2 border-b border-zinc-800/50">Running</Link>
                  <Link href="/kategori/formal" className="text-lg font-medium text-zinc-300 hover:text-white pb-2 border-b border-zinc-800/50">Formal</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl text-white hover:opacity-80 transition-opacity">
            <Store className="h-5 w-5 md:h-6 md:w-6 text-white" />
            <span className="hidden sm:block">Wolak-Walik</span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <Link href="/produk" className="hover:text-white transition-colors">Produk</Link>
            <Link href="/kategori/sneakers" className="hover:text-white transition-colors">Sneakers</Link>
            <Link href="/kategori/casual" className="hover:text-white transition-colors">Casual</Link>
            <Link href="/kategori/running" className="hover:text-white transition-colors">Running</Link>
            <Link href="/kategori/formal" className="hover:text-white transition-colors">Formal</Link>
          </nav>
        </div>

        {/* KANAN: Pencarian, User, Wishlist, Keranjang */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <div className="hidden lg:flex relative w-64 group">
            <Input type="text" placeholder="Cari sepatu..." className="pl-9 pr-4 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700 rounded-full transition-all group-hover:bg-zinc-800"/>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </div>

          <div className="w-px h-6 bg-zinc-800 hidden md:block mx-1"></div>

          {/* === LOGIN USER ATAU PROFIL === */}
          {loggedInUser ? (
            <div className="relative">
              {/* Tombol Profil (Inisial Nama) */}
              <Button 
                variant="ghost" 
                className="relative rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2 px-2"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black font-extrabold text-sm">
                  {loggedInUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block max-w-[80px] truncate text-sm font-medium">
                  {loggedInUser.name.split(" ")[0]}
                </span>
              </Button>

              {/* Pop-up Menu Profil */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 z-50 flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-900 truncate">{loggedInUser.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{loggedInUser.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Keluar Akun
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* WISHLIST */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-zinc-800 hover:text-red-400 text-zinc-300">
                <Heart className="h-5 w-5" />
                {likedItems.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">{likedItems.length}</span>}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader><SheetTitle>Wishlist Saya ({likedItems.length})</SheetTitle></SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {wishlistProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">Belum ada produk yang ditandai.</p>
                ) : (
                  wishlistProducts.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                      <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md bg-gray-100" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-sm font-bold text-black mt-1">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* KERANJANG */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative rounded-full px-3 md:px-4 border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white">
                <ShoppingCart className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Keranjang</span>
                {cartCount > 0 && <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">{cartCount}</span>}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-white text-black px-4 sm:px-6">
              <SheetHeader><SheetTitle>Keranjang Belanja ({cartCount})</SheetTitle></SheetHeader>
              
              <div className="mt-6 flex-1 overflow-y-auto pr-1 flex flex-col gap-4 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">Keranjang Anda masih kosong.</p>
                ) : (
                  <>
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Checkbox id="select-all" checked={cartItems.length > 0 && cartItems.every(i => i.isSelected)} onCheckedChange={(checked) => toggleSelectAll(checked as boolean)} />
                      <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">Pilih Semua</label>
                    </div>

                    {cartItems.map((item) => (
                      <div key={item.cartItemId} className="flex gap-3 sm:gap-4 border-b pb-4 items-center">
                        <Checkbox checked={item.isSelected} onCheckedChange={() => toggleSelectItem(item.cartItemId)} />
                        <img src={item.image} alt={item.name} className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-md bg-gray-100 shrink-0" />
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-semibold text-xs sm:text-sm line-clamp-2">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-500 shrink-0"><Trash2 className="h-4 w-4" /></button>
                          </div>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Uk: {item.size} | {item.color}</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(item.price)}</p>
                          <div className="flex items-center mt-2 border border-gray-200 rounded-md w-fit">
                            <button onClick={() => updateQuantity(item.cartItemId, -1)} className="px-2 py-1 hover:bg-gray-100"><Minus className="h-3 w-3"/></button>
                            <span className="px-3 text-xs font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, 1)} className="px-2 py-1 hover:bg-gray-100"><Plus className="h-3 w-3"/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t pt-4 mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Total ({selectedCount})</span>
                    <span className="font-bold text-lg sm:text-xl text-black">{formatPrice(selectedTotal)}</span>
                  </div>
                  <Button onClick={() => router.push("/checkout")} className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium text-base rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed" disabled={selectedCount === 0}>
                    Bayar
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}