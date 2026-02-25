// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, heroBanners, categories } from "@/lib/data"; // "products" dihapus karena pakai data asli
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { Heart, Star, ShoppingCart, Truck, ShieldCheck, RefreshCw, Clock } from "lucide-react";
import { client } from "@/sanity/lib/client"; 

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { likedItems, toggleWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // === WADAH UNTUK MENYIMPAN DATA DARI DATABASE ===
  const [realProducts, setRealProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  // === PENYEDOT DATA DARI SANITY (FULL DATA) ===
  useEffect(() => {
    async function getRealProducts() {
      try {
        const dataAsli = await client.fetch(`*[_type == "product"]{
          "id": _id,
          name,
          price,
          originalPrice,
          category,
          gender,
          sizes,
          colors,
          isNew,
          isBestSeller,
          rating,
          description,
          "image": image.asset->url
        }`);
        setRealProducts(dataAsli);
      } catch (error) {
        console.error("Gagal menarik data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getRealProducts();
  }, []);

  const handleBeli = (product: any) => {
    if (!selectedSize || !selectedColor) {
      toast.error("Oops!", { description: "Silakan pilih ukuran dan warna terlebih dahulu." }); return;
    }
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize, color: selectedColor, quantity: quantity });
    toast.success("Berhasil ditambahkan! 🎉");
  };

  const handleBeliSekarang = (product: any) => {
    if (!selectedSize || !selectedColor) {
      toast.error("Oops!", { description: "Silakan pilih ukuran dan warna terlebih dahulu." }); return;
    }
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize, color: selectedColor, quantity: quantity });
    toast.loading("Mengarahkan ke pembayaran...");
    setTimeout(() => { router.push("/checkout"); }, 800);
  };

  const handleWishlistClick = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(productId);
  };

  return (
    <main className="min-h-screen bg-white">
      
      {/* === 1. HERO CAROUSEL === */}
      <section className="relative">
        <Carousel plugins={[autoplayPlugin.current]} className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {heroBanners.map((banner) => (
              <CarouselItem key={banner.id} className="relative h-[50vh] md:h-[70vh] w-full bg-zinc-900">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                  <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">{banner.title}</h2>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md font-light">{banner.subtitle}</p>
                  <Button asChild size="lg" className="rounded-full text-base font-semibold px-8 bg-white text-black hover:bg-zinc-200 border-0">
                    <Link href={banner.link}>{banner.buttonText}</Link>
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 border-0 text-white hidden md:flex" />
          <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 border-0 text-white hidden md:flex" />
        </Carousel>
      </section>

      {/* === 2. KATEGORI POPULER === */}
      <section className="py-10 md:py-16 container mx-auto px-4">
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-left">Kategori Populer</h3>
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <Link href={cat.link} key={`desktop-${index}`} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h4 className="text-white text-3xl font-bold tracking-wider drop-shadow-md">{cat.name}</h4>
              </div>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {categories.map((cat, index) => (
            <Link href={cat.link} key={`mobile-${index}`} className="relative h-28 rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h4 className="text-white text-lg font-bold drop-shadow-md tracking-wide">{cat.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* === 3. PRODUK UNGGULAN (DATA ASLI SANITY) === */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Produk Unggulan Kami</h2>
            <p className="text-gray-600">Pilihan terbaik yang paling banyak dicari minggu ini.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500 animate-pulse">Menarik data dari database...</div>
          ) : realProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Belum ada produk di database.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {realProducts.map((product) => {
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
                          <button onClick={(e) => handleWishlistClick(e, product.id)} className="absolute top-3 right-3 p-2.5 rounded-full bg-white shadow-sm z-10">
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

                    <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-2xl bg-white text-black w-[95vw] sm:w-full">
                      <DialogTitle className="sr-only">{product.name}</DialogTitle>
                      <DialogDescription className="sr-only">Detail dari {product.name}</DialogDescription>

                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="bg-gray-50 p-6 flex items-center justify-center">
                          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-xl" />
                        </div>
                        <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                          <span className="font-bold text-xl md:text-2xl text-gray-900 mb-6">{formatPrice(product.price)}</span>
                          
                          <p className="text-gray-500 mb-6 text-sm">{product.description}</p>

                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2">Ukuran</h4>
                            <div className="flex flex-wrap gap-2">
                              {(product.sizes || [39,40,41,42]).map((size: number) => (
                                <button key={size} onClick={() => setSelectedSize(size)} className={`w-10 h-10 border rounded-md ${selectedSize === size ? 'bg-black text-white' : 'hover:border-black'}`}>{size}</button>
                              ))}
                            </div>
                          </div>

                          <div className="mb-6">
                            <h4 className="text-sm font-semibold mb-2">Warna</h4>
                            <div className="flex gap-2">
                              {(product.colors || ['Hitam', 'Putih']).map((color: string) => (
                                <button key={color} onClick={() => setSelectedColor(color)} className={`px-3 py-1.5 border rounded-md ${selectedColor === color ? 'bg-black text-white' : 'hover:border-black'}`}>{color}</button>
                              ))}
                            </div>
                          </div>

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
      </section>

      {/* === 4. RILIS TERBARU (DATA ASLI SANITY) === */}
      <section className="py-16 bg-zinc-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-white">Rilis Terbaru</h2>
            <p className="text-zinc-400">Jadilah yang pertama memiliki koleksi inovasi terbaru kami.</p>
          </div>

          {!isLoading && realProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...realProducts].reverse().map((product) => {
                const isLiked = likedItems.includes(product.id);
                return (
                  <Dialog key={`new-${product.id}`}>
                    <DialogTrigger asChild>
                      <Card className="group overflow-hidden border-zinc-800 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300 relative cursor-pointer h-full flex flex-col rounded-xl bg-zinc-900">
                        <div className="relative aspect-[4/5] bg-zinc-800 overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"/>
                          <Badge className="absolute top-3 left-3 bg-red-500 text-[10px] px-2 py-0.5 rounded-sm z-10">New Release</Badge>
                          <button onClick={(e) => handleWishlistClick(e, product.id)} className="absolute top-3 right-3 p-2.5 rounded-full bg-zinc-800/80 shadow-sm z-10">
                            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-zinc-300"}`} />
                          </button>
                        </div>
                        <CardContent className="p-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-center mb-2 text-xs text-zinc-400">
                            <div className="flex gap-1"><Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />{product.rating || 5}</div>
                            <span className="bg-zinc-800 px-2 py-0.5 rounded-full">{product.gender || 'Unisex'}</span>
                          </div>
                          <h3 className="font-medium text-white text-[15px] mb-2 line-clamp-1">{product.name}</h3>
                          <div className="mt-auto flex items-center gap-2">
                            <span className="font-bold text-[17px] text-white">{formatPrice(product.price)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>

                    {/* Modal Detail Rilis Terbaru (Sama seperti di atas) */}
                    <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-2xl bg-white text-black w-[95vw] sm:w-full">
                      <DialogTitle className="sr-only">{product.name}</DialogTitle>
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="bg-gray-50 p-6 flex items-center justify-center">
                          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-xl" />
                        </div>
                        <div className="p-6 md:p-8 flex flex-col h-full">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                          <span className="font-bold text-xl md:text-2xl text-gray-900 mb-6">{formatPrice(product.price)}</span>
                          <p className="text-gray-500 mb-6 text-sm">{product.description}</p>
                          <div className="flex gap-3 mt-auto pt-6 border-t border-gray-100">
                            <Button variant="outline" className="flex-1 gap-2 h-12" onClick={() => handleBeli(product)}><ShoppingCart className="w-4 h-4" /></Button>
                            <Button className="flex-[3] gap-2 h-12 bg-black text-white" onClick={() => handleBeliSekarang(product)}>Beli Sekarang</Button>
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
      </section>

      {/* === 5. FITUR UNGGULAN === */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 p-4 rounded-xl hover:bg-zinc-50"><Truck className="h-8 w-8 text-primary" /><div><h4 className="font-bold text-sm text-gray-900">Gratis Ongkir</h4><p className="text-xs text-gray-500">Min. belanja Rp500rb</p></div></div>
            <div className="flex flex-col md:flex-row items-center gap-3 p-4 rounded-xl hover:bg-zinc-50"><ShieldCheck className="h-8 w-8 text-primary" /><div><h4 className="font-bold text-sm text-gray-900">Jaminan Original</h4><p className="text-xs text-gray-500">100% Produk Asli</p></div></div>
            <div className="flex flex-col md:flex-row items-center gap-3 p-4 rounded-xl hover:bg-zinc-50"><RefreshCw className="h-8 w-8 text-primary" /><div><h4 className="font-bold text-sm text-gray-900">Mudah Tukar</h4><p className="text-xs text-gray-500">7 Hari pengembalian</p></div></div>
            <div className="flex flex-col md:flex-row items-center gap-3 p-4 rounded-xl hover:bg-zinc-50"><Clock className="h-8 w-8 text-primary" /><div><h4 className="font-bold text-sm text-gray-900">Dukungan 24/7</h4><p className="text-xs text-gray-500">Hubungi kapan saja</p></div></div>
          </div>
        </div>
      </section>

    </main>
  );
}