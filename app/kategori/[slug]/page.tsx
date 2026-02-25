// app/kategori/[slug]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { products, formatPrice } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { Heart, Star, ShoppingCart, Minus, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function KategoriPage() {
  const params = useParams();
  const slug = params.slug as string; 
  const router = useRouter(); // Inisialisasi router

  const { addToCart } = useCart();
  const { likedItems, toggleWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === slug.toLowerCase()
  );

  const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

  // === FUNGSI TAMBAH KERANJANG ===
  const handleBeli = (product: typeof products[0]) => {
    if (!selectedSize || !selectedColor) {
      toast.error("Oops!", { description: "Silakan pilih ukuran dan warna sepatu terlebih dahulu." });
      return;
    }
    addToCart({
      productId: product.id, name: product.name, price: product.price, image: product.image,
      size: selectedSize, color: selectedColor, quantity: quantity,
    });
    toast.success("Berhasil ditambahkan! 🎉");
  };

  // === FUNGSI BELI SEKARANG ===
  const handleBeliSekarang = (product: typeof products[0]) => {
    if (!selectedSize || !selectedColor) {
      toast.error("Oops!", { description: "Silakan pilih ukuran dan warna sepatu terlebih dahulu." });
      return;
    }
    addToCart({
      productId: product.id, name: product.name, price: product.price, image: product.image,
      size: selectedSize, color: selectedColor, quantity: quantity,
    });
    toast.loading("Mengarahkan ke pembayaran...");
    setTimeout(() => { router.push("/checkout"); }, 800);
  };

  const handleWishlistClick = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(productId);
  };

  return (
    <main className="min-h-screen bg-zinc-50 pt-12 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Header Kategori */}
        <div className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Koleksi {categoryTitle}
          </h1>
          <p className="text-gray-500 mt-2">
            Menampilkan {filteredProducts.length} produk untuk kategori {categoryTitle}.
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Kosong 🥺</h3>
            <p className="text-gray-500">Belum ada produk untuk kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isLiked = likedItems.includes(product.id);
              let discountPercentage = 0;
              if (product.originalPrice) discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

              return (
                <Dialog key={product.id}>
                  <DialogTrigger asChild>
                    {/* KARTU DEPAN (BERSIH DARI TOMBOL) */}
                    <Card className="group overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300 relative cursor-pointer h-full flex flex-col rounded-xl bg-white">
                      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          {product.isNew && <Badge className="bg-red-500 text-[10px] px-2 py-0.5 rounded-sm">Baru</Badge>}
                          {discountPercentage > 0 && <Badge className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-sm">-{discountPercentage}%</Badge>}
                        </div>
                        <button onClick={(e) => handleWishlistClick(e, product.id)} className="absolute top-3 right-3 p-2.5 rounded-full bg-white shadow-sm z-10">
                          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                        </button>
                      </div>

                      <CardContent className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                          <div className="flex gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{product.rating}</div>
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

                  {/* MODAL PENUH */}
                  <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-2xl bg-white text-black">
                    <DialogTitle className="sr-only">{product.name}</DialogTitle>
                    <DialogDescription className="sr-only">Detail dari {product.name}</DialogDescription>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="bg-gray-50 p-6 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-xl" />
                      </div>
                      <div className="p-8 flex flex-col h-full overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                        <span className="font-bold text-2xl text-gray-900 mb-6">{formatPrice(product.price)}</span>
                        
                        <p className="text-gray-500 mb-6 text-sm">{product.description}</p>

                        {/* Pilihan Ukuran Dinamis */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Ukuran</h4>
                          <div className="flex flex-wrap gap-2">
                            {(product.sizes || [39,40,41,42]).map(size => (
                              <button key={size} onClick={() => setSelectedSize(size)} className={`w-10 h-10 border rounded-md ${selectedSize === size ? 'bg-black text-white' : 'hover:border-black'}`}>{size}</button>
                            ))}
                          </div>
                        </div>

                        {/* Pilihan Warna Dinamis */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold mb-2">Warna</h4>
                          <div className="flex gap-2">
                            {(product.colors || ['Hitam', 'Putih']).map(color => (
                              <button key={color} onClick={() => setSelectedColor(color)} className={`px-3 py-1.5 border rounded-md ${selectedColor === color ? 'bg-black text-white' : 'hover:border-black'}`}>{color}</button>
                            ))}
                          </div>
                        </div>

                        {/* DUA TOMBOL DI DALAM MODAL */}
                        <div className="flex gap-3 mt-auto pt-6 border-t border-gray-100">
                          <Button variant="outline" className="flex-1 gap-2 h-12 border-gray-300 hover:bg-gray-50" onClick={() => handleBeli(product)}>
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                          <Button className="flex-[3] gap-2 h-12 bg-black hover:bg-gray-800 text-white shadow-md" onClick={() => handleBeliSekarang(product)}>
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