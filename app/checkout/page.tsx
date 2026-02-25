// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react"; // Tambahkan useEffect
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MapPin, Truck, ShieldCheck, ChevronLeft, ShoppingCart, KeyRound } from "lucide-react";
import { client } from "@/sanity/lib/client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, selectedTotal, selectedCount } = useCart();
  const selectedItems = cartItems.filter(item => item.isSelected);

  const [shippingCost, setShippingCost] = useState(15000);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "" });

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // === SISTEM KEAMANAN & AUTO-FILL ===
  useEffect(() => {
    const storedUser = localStorage.getItem("user_wolak_walik");
    
    // 1. Jika tidak ada data login, tendang ke halaman login
    if (!storedUser) {
      toast.error("Akses Ditolak", { description: "Anda harus login untuk melakukan pembayaran." });
      router.push("/login");
    } else {
      // 2. Jika ada, ambil data namanya dan isikan otomatis ke dalam form
      const userData = JSON.parse(storedUser);
      setFormData(prev => ({ 
        ...prev, 
        name: userData.name || "", 
        email: userData.email || "" 
      }));
    }
  }, [router]);
  // ====================================

  if (selectedItems.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Pesanan</h2>
          <p className="text-gray-500 mb-8">Anda belum memilih barang untuk di-checkout. Silakan kembali ke keranjang Anda.</p>
          <Button asChild className="w-full bg-black text-white hover:bg-gray-800 h-12">
            <Link href="/">Kembali Belanja</Link>
          </Button>
        </div>
      </main>
    );
  }

  const grandTotal = selectedTotal + shippingCost;

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Data Belum Lengkap", { description: "Mohon isi nama, nomor HP, dan alamat pengiriman." });
      return;
    }

    const phoneRegex = /^(08|628|\+628)[0-9]{7,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Nomor HP Tidak Valid", { description: "Masukkan nomor HP yang benar (contoh: 08123456789)." });
      return;
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Email Tidak Valid", { description: "Pastikan format penulisan email benar." });
        return;
      }
    }

    toast.success("Kode OTP dikirim!", { description: `Cek WhatsApp di nomor ${formData.phone}` });
    setIsOtpModalOpen(true);
  };

  // ... kode di atasnya tetap sama ...

  // === FUNGSI MENGIRIM PESANAN KE SANITY ===
  const handleVerifyOTP = async () => {
    if (otpCode === "1234") {
      setIsOtpModalOpen(false);
      toast.loading("Memproses pesanan Anda...");
      
      try {
        // 1. Siapkan daftar keranjang untuk dikirim ke Sanity
        // (Sanity butuh '_key' unik untuk setiap barang di dalam keranjang)
        const orderItems = selectedItems.map(item => ({
          _key: Math.random().toString(36).substring(7), 
          productName: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price
        }));

        // 2. Tembakkan datanya ke Sanity Studio!
        await client.create({
          _type: 'order',
          customerName: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          items: orderItems,
          totalPrice: grandTotal,
          status: 'pending', // Otomatis statusnya "Menunggu Konfirmasi"
          orderDate: new Date().toISOString(),
        });

        toast.dismiss();
        toast.success("Pesanan Berhasil Dibuat! 🎉", { description: "Terima kasih! Kami akan memproses pesanan Anda." });
        
        // Arahkan kembali ke Beranda setelah 2 detik
        setTimeout(() => {
          router.push("/"); 
        }, 2000);

      } catch (error) {
        console.error("Gagal menyimpan pesanan:", error);
        toast.dismiss();
        toast.error("Terjadi Kesalahan", { description: "Gagal membuat pesanan, silakan coba lagi." });
      }

    } else {
      toast.error("Kode OTP Salah!", { description: "Silakan masukkan kode 1234 untuk percobaan ini." });
    }
  };

  // ... sisa kode di bawahnya (return JSX) tetap sama ...

  return (
    <main className="min-h-screen bg-zinc-50 pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali Belanja
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Penyelesaian Pesanan</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-[2] flex flex-col gap-6">
            <form id="checkout-form" onSubmit={handleRequestOTP} className="flex flex-col gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-black" /> Alamat Pengiriman
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nama Lengkap *</label>
                    {/* Nilai formData.name otomatis terisi dari akun user */}
                    <Input required placeholder="Cth: Budi Santoso" className="bg-gray-50 border-gray-200 focus-visible:ring-black" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nomor WhatsApp Aktif *</label>
                    <Input required type="tel" placeholder="Cth: 08123456789" className="bg-gray-50 border-blue-200 focus:border-blue-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    <p className="text-[11px] text-gray-500">Kami akan mengirim kode OTP ke nomor ini.</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Email (Opsional)</label>
                    {/* Nilai formData.email otomatis terisi dari akun user */}
                    <Input type="email" placeholder="budi@email.com" className="bg-gray-50 border-gray-200 focus-visible:ring-black" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Alamat Lengkap *</label>
                    <textarea required placeholder="Nama jalan, Gedung, No. Rumah, RT/RW, Kecamatan, Kota" className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-black" /> Metode Pengiriman
                </h2>
                <div className="flex flex-col gap-3">
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingCost === 15000 ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={shippingCost === 15000} onChange={() => setShippingCost(15000)} className="w-4 h-4 accent-black" />
                      <div><p className="font-semibold text-sm">Reguler (2-4 Hari)</p><p className="text-xs text-gray-500">JNE, J&T, atau Sicepat</p></div>
                    </div>
                    <span className="font-bold text-sm">Rp 15.000</span>
                  </label>
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingCost === 25000 ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={shippingCost === 25000} onChange={() => setShippingCost(25000)} className="w-4 h-4 accent-black" />
                      <div><p className="font-semibold text-sm">Express (1 Hari Sampai)</p><p className="text-xs text-gray-500">Grab / Gosend</p></div>
                    </div>
                    <span className="font-bold text-sm">Rp 25.000</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          <div className="flex-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-6 border-b pb-4">Ringkasan Pesanan</h2>
              <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 items-start">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Ukuran: {item.size} | Warna: {item.color}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-medium text-gray-500">{item.quantity} x {formatPrice(item.price)}</span>
                        <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal ({selectedCount} barang)</span><span className="font-semibold">{formatPrice(selectedTotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Ongkos Kirim</span><span className="font-semibold">{formatPrice(shippingCost)}</span></div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center"><span className="font-bold text-gray-900">Total Pembayaran</span><span className="font-extrabold text-2xl text-black">{formatPrice(grandTotal)}</span></div>
              </div>

              <Button type="submit" form="checkout-form" className="w-full h-14 bg-black hover:bg-gray-800 text-white text-base font-bold rounded-xl shadow-md flex items-center justify-center gap-2">
                <KeyRound className="w-5 h-5" /> Verifikasi & Bayar
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* === MODAL OTP === */}
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-md bg-white text-center p-8">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-zinc-100 text-black rounded-full flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">Verifikasi Nomor WA</DialogTitle>
            <DialogDescription className="text-gray-600">
              Kami telah pura-pura mengirimkan 4 digit kode OTP ke WhatsApp <br/> 
              <span className="font-bold text-black">{formData.phone}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 my-6">
            <Input 
              type="text" 
              maxLength={4}
              placeholder="Masukkan 4 digit (Ketik: 1234)" 
              className="text-center text-2xl tracking-[0.5em] h-14 font-bold bg-gray-50 border-gray-300 focus:border-black focus-visible:ring-black"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Untuk percobaan ini, silakan ketik <span className="font-bold text-black">1234</span>
            </p>
          </div>

          <Button onClick={handleVerifyOTP} className="w-full h-12 bg-black text-white hover:bg-gray-800 text-base font-semibold">
            Konfirmasi Kode OTP
          </Button>
        </DialogContent>
      </Dialog>

    </main>
  );
}