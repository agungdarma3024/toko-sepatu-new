// app/kategori/[slug]/page.tsx
"use client";

import React, { useState, useEffect, use } from "react"; // PERHATIKAN: Ada import 'use' di sini
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/data"; 
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { Heart, Star, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { client } from "@/sanity/lib/client"; 

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Menggunakan Promise untuk params (Standar Next.js 15)
export default function KategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  
  // Membuka params menggunakan fungsi use() dari React
  const { slug } = use(params);

  const { addToCart } = useCart();
  const { likedItems, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // WADAH PENYIMPANAN DATA ASLI
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // === SIHIR PENYEDOT DATA KHUSUS KATEGORI ===
  useEffect(() => {
    async function fetchCategoryData() {
      setIsLoading(true);
      try {
        const query = `{
          "categoryInfo": *[_type == "category" && slug.current == $slug][0]{ name },
          "products": *[_type == "product" && category match $slug]{
            "id": _id, name, price, originalPrice, category, gender, sizes, colors, isNew, isBestSeller, rating, description, "image": image.asset->url
          }
        }`;
        
        const data = await client.fetch(query, { slug });

        if (data.categoryInfo) {
          setCategoryName(data.categoryInfo.name);
        } else {
          setCategoryName(slug.charAt(0).toUpperCase() + slug.slice(1));
        }
        
        setCategoryProducts(data.products || []);
      } catch (error) {
        console.error("Gagal menarik data kategori:", error);
        toast.error("Gagal memuat produk");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCategoryData();
  }, [slug]);

  // === 1. FUNGSI TAMBAH KERANJANG (DILINDUNGI) ===
  const handleBeli = (product: any) => {
    if (!localStorage.getItem("user_wolak_walik")) {
      toast.error("Akses Ditolak", { description: "Silakan masuk ke akun Anda untuk mulai belanja." });
      router.push("/login"); return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error("Oops!", { description: "Silakan pilih ukuran dan warna terlebih dahulu." }); return;
    }
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize, color: selectedColor, quantity: quantity });
    toast.success("Berhasil ditambahkan! 🎉");
  };

  // === 2. FUNGSI BELI SEKARANG (DILINDUNGI) ===
  const handleBeliSekarang = (product: any) => {
    if (!localStorage.getItem("user_wolak_walik")) {
      toast.error("Akses Ditolak", { description: "Silakan masuk ke akun Anda untuk mulai belanja." });
      router.push("/login"); return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error("Oops!", { description: "Silakan pilih ukuran dan warna terlebih dahulu." }); return;
    }
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize, color: selectedColor, quantity: quantity });
    toast.loading("Mengarahkan ke pembayaran...");
    setTimeout(() => { router.push("/checkout"); }, 800);
  };

  // === 3. FUNGSI WISHLIST (DILINDUNGI) ===
  const handleWishlistClick = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!localStorage.getItem("user_wolak_walik")) {
      toast.error("Harus Login", { description: "Silakan masuk untuk menyimpan wishlist." });
      router.push("/login"); return;
    }
    toggleWishlist(productId);
  };

  return (
    <main className="min-h-screen bg-zinc-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Kategori */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-gray-500">
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda</Link>
          </Button>
          <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-2 uppercase tracking-tight">
            Koleksi {categoryName}
          </h1>
          <p className="text-gray-500">
            Menampilkan produk terbaik untuk {categoryName}.
          </p>
        </div>

        {/* Status Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Sedang mengambil data...</p>
          </div>
        ) : categoryProducts.length === 0 ? (
          // Status Jika Kategori Kosong
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Produk</h3>
            <p className="text-gray-500 mb-6">Koleksi untuk kategori {categoryName} sedang disiapkan.</p>
            <Button asChild className="bg-black text-white rounded-full px-8"><Link href="/">Cari Kategori Lain</Link></Button>
          </div>
        ) : (
          // Grid Produk
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => {
              const isLiked = likedItems.includes(product.id);
              let discountPercentage = 0;
              if (product.originalPrice) discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

              return (
                <Dialog key={product.id}>
                  <DialogTrigger asChild>
                    <Card className="group overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300 relative cursor-pointer h-full flex flex-col rounded-xl bg-white">
                      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          {product.isNew && <Badge className="bg-red-500 text-[10px] px-2 py-0.5 rounded-sm">Baru</Badge>}
                          {discountPercentage > 0 && <Badge className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-sm">-{discountPercentage}%</Badge>}
                        </div>
                        <button onClick={(e) => handleWishlistClick(e, product.id)} className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm z-10">
                          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                        </button>
                      </div>

                      <CardContent className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                          <div className="flex gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{product.rating || 5}</div>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{product.gender || 'Unisex'}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 text-[15px] mb-2 line-clamp-1">{product.name}</h3>
                        <div className="mt-auto flex items-center gap-2">
                          {product.originalPrice && <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
                          <span className="font-bold text-[17px] text-gray-900">{formatPrice(product.price)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  {/* Modal Detail Produk */}
                  <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-2xl bg-white text-black w-[95vw] sm:w-full">
                    <DialogTitle className="sr-only">{product.name}</DialogTitle>
                    <DialogDescription className="sr-only">Detail dari {product.name}</DialogDescription>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="bg-gray-50 p-6 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-xl" />
                      </div>
                      <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                        <span className="font-bold text-2xl text-gray-900 mb-6">{formatPrice(product.price)}</span>
                        
                        <p className="text-gray-500 mb-6 text-sm leading-relaxed">{product.description}</p>

                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Ukuran</h4>
                          <div className="flex flex-wrap gap-2">
                            {(product.sizes || [39,40,41,42]).map((size: number) => (
                              <button key={size} onClick={() => setSelectedSize(size)} className={`w-10 h-10 border-2 rounded-md transition-colors ${selectedSize === size ? 'border-black bg-black text-white' : 'hover:border-black'}`}>{size}</button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-8">
                          <h4 className="text-sm font-semibold mb-2">Warna</h4>
                          <div className="flex gap-2">
                            {(product.colors || ['Hitam', 'Putih']).map((color: string) => (
                              <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 border-2 rounded-md transition-colors ${selectedColor === color ? 'border-black bg-black text-white' : 'hover:border-black'}`}>{color}</button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 mt-auto pt-6 border-t border-gray-100">
                          <Button variant="outline" className="flex-1 h-12 border-zinc-200" onClick={() => handleBeli(product)}>
                            <ShoppingCart className="w-5 h-5" />
                          </Button>
                          <Button className="flex-[3] h-12 bg-black hover:bg-zinc-800 text-white font-bold" onClick={() => handleBeliSekarang(product)}>
                            Beli Sekarang
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}