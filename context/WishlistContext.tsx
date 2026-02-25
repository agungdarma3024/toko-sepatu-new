// context/WishlistContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { toast } from "sonner"; // Kita pakai toast juga di sini

type WishlistContextType = {
  likedItems: string[]; // Menyimpan daftar ID produk yang dilike ['prod-001', 'prod-003']
  toggleWishlist: (productId: string) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [likedItems, setLikedItems] = useState<string[]>([]);

  // Fungsi untuk menambah atau menghapus like
  const toggleWishlist = (productId: string) => {
    setLikedItems((prevItems) => {
      // Cek apakah barang sudah ada di daftar like
      if (prevItems.includes(productId)) {
        toast("Dihapus dari Wishlist");
        // Kalau sudah ada, kita hapus (filter)
        return prevItems.filter((id) => id !== productId);
      } else {
        toast.success("Ditambahkan ke Wishlist! ❤️");
        // Kalau belum ada, kita tambahkan
        return [...prevItems, productId];
      }
    });
  };

  return (
    <WishlistContext.Provider value={{ likedItems, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist harus digunakan di dalam WishlistProvider");
  return context;
};