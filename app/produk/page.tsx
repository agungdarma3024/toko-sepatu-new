// app/produk/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/data"; 
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { Heart, Star, ShoppingCart, SlidersHorizontal, Loader2 } from "lucide-react";
import { client } from "@/sanity/lib/client"; 

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Daftar Pilihan Filter
const AVAILABLE_SIZES = [38, 39, 40, 41, 42, 43, 44];
const AVAILABLE_COLORS = ["Hitam", "Putih", "Merah", "Biru", "Abu-abu", "Coklat"];

export default function SemuaProdukPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { likedItems, toggleWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // === WADAH PENYIMPANAN DATA DARI SANITY ===
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // === LIMA STATE UNTUK FILTER ===
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [filterSizes, setFilterSizes] = useState<number[]>([]);
  const [filterColors, setFilterColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("");

  // === PENYEDOT DATA ===
  useEffect(() => {
    async function fetchAllProducts() {
      setIsLoading(true);
      try {
        const data = await client.fetch(`*[_type == "product"]{
          "id": _id, name, price, originalPrice, category, gender, sizes, colors, isNew, isBestSeller, rating, description, "image": image.asset->url
        }`);
        setAllProducts(data || []);
      } catch (error) {
        console.error("Gagal menarik data produk:", error);
        toast.error("Gagal memuat produk dari database.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAllProducts();
  }, []);

  // === LOGIKA JAVASCRIPT UNTUK MENYARING DATA ASLI BERLAPIS ===
  const filteredProducts = allProducts.filter(product => {
    const productCategory = (product.category || "").toLowerCase();
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
    
    const productGender = product.gender || 'Unisex';
    const matchGender = selectedGenders.length === 0 || selectedGenders.includes(productGender);
    
    const productSizes = product.sizes || [39, 40, 41, 42];
    const matchSize = filterSizes.length === 0 || filterSizes.some(s => productSizes.includes(s));
    
    const productColors = product.colors || ['Hitam', 'Putih'];
    const matchColor = filterColors.length === 0 || filterColors.some(c => productColors.includes(c));

    let matchPrice = true;
    if (priceRange === "under500") matchPrice = product.price < 500000;
    else if (priceRange === "500to1m") matchPrice = product.price >= 500000 && product.price <= 1000000;
    else if (priceRange === "over1m") matchPrice = product.price > 1000000;

    return matchCategory && matchGender && matchSize && matchColor && matchPrice;
  });

  const toggleArrayItem = (setState: React.Dispatch<React.SetStateAction<any[]>>, item: any) => {
    setState(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const resetAllFilters = () => {
    setSelectedCategories([]); setSelectedGenders([]); setFilterSizes([]); setFilterColors([]); setPriceRange("");
  };

  const isFilterActive = selectedCategories.length > 0 || selectedGenders.length > 0 || filterSizes.length > 0 || filterColors.length > 0 || priceRange !== "";

  const FilterContent = () => (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Kategori</h4>
        <div className="flex flex-col gap-3">
          {["sneakers", "running", "casual", "formal"].map((cat) => (
            <div key={cat} className="flex items-center gap-3">
              <Checkbox id={`cat-${cat}`} checked={selectedCategories.includes(cat)} onCheckedChange={() => toggleArrayItem(setSelectedCategories, cat)} />
              <label htmlFor={`cat-${cat}`} className="text-sm text-gray-600 capitalize cursor-pointer">{cat}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-px bg-gray-100"></div>

      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Harga</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600"><input type="radio" name="price" checked={priceRange === ""} onChange={() => setPriceRange("")} className="w-4 h-4 accent-black" /> Semua Harga</label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600"><input type="radio" name="price" checked={priceRange === "under500"} onChange={() => setPriceRange("under500")} className="w-4 h-4 accent-black" /> Di bawah Rp 500rb</label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600"><input type="radio" name="price" checked={priceRange === "500to1m"} onChange={() => setPriceRange("500to1m")} className="w-4 h-4 accent-black" /> Rp 500rb - Rp 1 Juta</label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600"><input type="radio" name="price" checked={priceRange === "over1m"} onChange={() => setPriceRange("over1m")} className="w-4 h-4 accent-black" /> Di atas Rp 1 Juta</label>
        </div>
      </div>
      <div className="w-full h-px bg-gray-100"></div>

      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Ukuran</h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map(size => (
            <button key={size} onClick={() => toggleArrayItem(setFilterSizes, size)} className={`w-10 h-10 text-xs font-medium border rounded-md transition-colors ${filterSizes.includes(size) ? 'bg-black text-white border-black' : 'hover:border-black text-gray-600'}`}>{size}</button>
          ))}
        </div>
      </div>
      <div className="w-full h-px bg-gray-100"></div>

      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Warna</h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COLORS.map(color => (
            <button key={color} onClick={() => toggleArrayItem(setFilterColors, color)} className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${filterColors.includes(color) ? 'bg-black text-white border-black' : 'hover:border-black text-gray-600'}`}>{color}</button>
          ))}
        </div>
      </div>
      <div className="w-full h-px bg-gray-100"></div>

      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Gender</h4>
        <div className="flex flex-col gap-3">
          {["Pria", "Wanita", "Unisex"].map((gen) => (
            <div key={gen} className="flex items-center gap-3">
              <Checkbox id={`gen-${gen}`} checked={selectedGenders.includes(gen)} onCheckedChange={() => toggleArrayItem(setSelectedGenders, gen)} />
              <label htmlFor={`gen-${gen}`} className="text-sm text-gray-600 cursor-pointer">{gen}</label>
            </div>
          ))}
        </div>
      </div>

      {isFilterActive && (
        <Button variant="outline" className="w-full mt-4 text-red-500 border-red-200 hover:bg-red-50 transition-colors" onClick={resetAllFilters}>
          Reset Semua Filter
        </Button>
      )}
    </div>
  );

  // === 1. FUNGSI TAMBAH KERANJANG (DILINDUNGI) ===
  const handleBeli = (product: any) => {
    if (!localStorage.getItem("user_wolak_walik")) {
      toast.error("Akses Ditolak", { description: "Silakan masuk ke akun Anda untuk mulai belanja." });
      router.push("/login"); return;
    }
    if (!selectedSize || !selectedColor) { toast.error("Oops!", { description: "Silakan pilih ukuran dan warna." }); return; }
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize, color: selectedColor, quantity: quantity });
    toast.success("Berhasil ditambahkan! 🎉");
  };

  // === 2. FUNGSI BELI SEKARANG (DILINDUNGI) ===
  const handleBeliSekarang = (product: any) => {
    if (!localStorage.getItem("user_wolak_walik")) {
      toast.error("Akses Ditolak", { description: "Silakan masuk ke akun Anda untuk mulai belanja." });
      router.push("/login"); return;
    }
    if (!selectedSize || !selectedColor) { toast.error("Oops!", { description: "Silakan pilih ukuran dan warna." }); return; }
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize, color: selectedColor, quantity: quantity });
    toast.loading("Mengarahkan ke pembayaran..."); setTimeout(() => { router.push("/checkout"); }, 800);
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
    <main className="min-h-screen bg-zinc-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        
        <div className="mb-8 md:mb-10 border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Semua Produk</h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              {isLoading ? "Menghitung koleksi produk..." : `Menampilkan ${filteredProducts.length} pasang sepatu untuk Anda.`}
            </p>
          </div>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white border-gray-300 relative">
                  <SlidersHorizontal className="w-4 h-4" /> Filter Produk
                  {isFilterActive && <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl bg-white text-black px-6 pb-0">
                <SheetHeader className="mt-2 mb-4 text-left border-b border-gray-100 pb-4">
                  <SheetTitle className="text-xl font-bold">Filter Pencarian</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto h-[calc(100%-80px)] pr-2">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <aside className="hidden md:block w-64 shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 font-bold text-lg mb-6 border-b border-gray-100 pb-4">
              <SlidersHorizontal className="w-5 h-5" /> Filter
            </div>
            <FilterContent />
          </aside>

          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p>Sedang memuat produk dari database...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ditemukan 🥺</h3>
                <p className="text-gray-500">Coba ubah filter pencarian Anda.</p>
                <Button variant="outline" className="mt-4 border-black hover:bg-gray-100" onClick={resetAllFilters}>Hapus Semua Filter</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product) => {
                  const isLiked = likedItems.includes(product.id);
                  let discountPercentage = 0;
                  if (product.originalPrice) discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

                  return (
                    <Dialog key={product.id}>
                      <DialogTrigger asChild>
                        <Card className="group overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300 relative cursor-pointer h-full flex flex-col rounded-xl md:rounded-2xl bg-white active:scale-[0.98] md:active:scale-100">
                          <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5 z-10">
                              {product.isNew && <Badge className="bg-red-500 text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-sm">Baru</Badge>}
                              {discountPercentage > 0 && <Badge className="bg-yellow-400 text-black text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-sm">-{discountPercentage}%</Badge>}
                            </div>
                            <button onClick={(e) => handleWishlistClick(e, product.id)} className="absolute top-2 right-2 md:top-3 md:right-3 p-2 md:p-2.5 rounded-full bg-white/90 shadow-sm z-10">
                              <Heart className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                            </button>
                          </div>

                          <CardContent className="p-3 md:p-4 flex flex-col flex-grow">
                            <div className="flex justify-between items-center mb-1.5 md:mb-2 text-[10px] md:text-xs text-gray-500">
                              <div className="flex gap-1 items-center"><Star className="h-3 w-3 md:h-3.5 md:w-3.5 fill-yellow-400 text-yellow-400" />{product.rating || 5}</div>
                              <span className="bg-gray-100 px-2 py-0.5 rounded-full">{product.gender || 'Unisex'}</span>
                            </div>
                            <h3 className="font-medium text-gray-900 text-xs md:text-[15px] mb-2 line-clamp-2 md:line-clamp-1">{product.name}</h3>
                            <div className="mt-auto flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
                              {product.originalPrice && <span className="text-[10px] md:text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
                              <span className="font-bold text-sm md:text-[17px] text-gray-900">{formatPrice(product.price)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-2xl bg-white text-black w-[95vw] sm:w-full">
                        <DialogTitle className="sr-only">{product.name}</DialogTitle>
                        <DialogDescription className="sr-only">Detail dari {product.name}</DialogDescription>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <div className="bg-gray-50 p-4 md:p-6 flex items-center justify-center">
                            <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-xl" />
                          </div>
                          <div className="p-5 md:p-8 flex flex-col h-full overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{product.name}</h2>
                            <span className="font-bold text-lg md:text-2xl text-gray-900 mb-4 md:mb-6">{formatPrice(product.price)}</span>
                            
                            <p className="text-gray-500 mb-4 md:mb-6 text-xs md:text-sm">{product.description}</p>

                            <div className="mb-4">
                              <h4 className="text-xs md:text-sm font-semibold mb-2">Ukuran</h4>
                              <div className="flex flex-wrap gap-2">
                                {(product.sizes || [39,40,41,42]).map((size: number) => (
                                  <button key={size} onClick={() => setSelectedSize(size)} className={`w-9 h-9 md:w-10 md:h-10 text-xs md:text-sm border rounded-md transition-colors ${selectedSize === size ? 'bg-black text-white border-black' : 'hover:border-black'}`}>{size}</button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-6">
                              <h4 className="text-xs md:text-sm font-semibold mb-2">Warna</h4>
                              <div className="flex flex-wrap gap-2">
                                {(product.colors || ['Hitam', 'Putih']).map((color: string) => (
                                  <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 text-xs md:text-sm border rounded-md transition-colors ${selectedColor === color ? 'bg-black text-white border-black' : 'hover:border-black'}`}>{color}</button>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2 md:gap-3 mt-auto pt-4 md:pt-6 border-t border-gray-100">
                              <Button variant="outline" className="flex-1 gap-2 h-10 md:h-12 border-gray-300 hover:bg-gray-50" onClick={() => handleBeli(product)}>
                                <ShoppingCart className="w-4 h-4" />
                              </Button>
                              <Button className="flex-[3] gap-2 h-10 md:h-12 bg-black hover:bg-gray-800 text-white shadow-md text-xs md:text-sm font-bold" onClick={() => handleBeliSekarang(product)}>
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

        </div>
      </div>
    </main>
  );
}