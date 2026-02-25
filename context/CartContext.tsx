// context/CartContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

export type CartItem = {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: number;
  color: string;
  quantity: number;
  isSelected: boolean; // <-- FITUR BARU: Penanda dicentang atau tidak
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "cartItemId" | "isSelected">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, amount: number) => void;
  toggleSelectItem: (cartItemId: string) => void; // <-- FITUR BARU
  toggleSelectAll: (selectAll: boolean) => void;  // <-- FITUR BARU
  cartCount: number;
  selectedTotal: number; // <-- FITUR BARU: Total harga yang dicentang
  selectedCount: number; // <-- FITUR BARU: Jumlah barang yang dicentang
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "cartItemId" | "isSelected">) => {
    const cartItemId = `${item.productId}-${item.size}-${item.color}`;
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.cartItemId === cartItemId);
      if (existingItem) {
        return prev.map((i) =>
          // Jika barang sudah ada, tambah jumlahnya dan otomatis dicentang
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + item.quantity, isSelected: true } : i
        );
      }
      // Jika barang baru, masukkan dan otomatis dicentang (isSelected: true)
      return [...prev, { ...item, cartItemId, isSelected: true }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    toast.info("Barang dihapus dari keranjang");
  };

  const updateQuantity = (cartItemId: string, amount: number) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.cartItemId === cartItemId) {
          const newQuantity = i.quantity + amount;
          return { ...i, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return i;
      })
    );
  };

  // --- FUNGSI BARU UNTUK CEKLIS ---
  const toggleSelectItem = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, isSelected: !i.isSelected } : i))
    );
  };

  const toggleSelectAll = (selectAll: boolean) => {
    setCartItems((prev) => prev.map((i) => ({ ...i, isSelected: selectAll })));
  };

  // --- MENGHITUNG TOTAL HANYA UNTUK YANG DICENTANG ---
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const selectedItems = cartItems.filter((item) => item.isSelected);
  const selectedCount = selectedItems.reduce((total, item) => total + item.quantity, 0);
  const selectedTotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, 
      toggleSelectItem, toggleSelectAll, cartCount, selectedTotal, selectedCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart harus digunakan di dalam CartProvider");
  return context;
};