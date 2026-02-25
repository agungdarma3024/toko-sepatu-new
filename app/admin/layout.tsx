// app/admin/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { Store, Lock, KeyRound, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // State untuk mengecek apakah admin sudah login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Cek apakah sebelumnya sudah login (disimpan di browser sementara)
  useEffect(() => {
    const authStatus = sessionStorage.getItem("isAdminLoggedIn");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Fungsi saat tombol "Masuk" diklik
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // PASSWORD RAHASIA KITA: "admin123"
    if (password === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("isAdminLoggedIn", "true"); // Simpan sesi
      toast.success("Login Berhasil", { description: "Selamat datang kembali, Admin!" });
    } else {
      toast.error("Akses Ditolak", { description: "Password yang Anda masukkan salah." });
      setPassword(""); // Kosongkan input jika salah
    }
  };

  // Mencegah kedipan layar saat mengecek status login
  if (isLoading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Memuat...</div>;

  // JIKA BELUM LOGIN: Tampilkan Halaman Login Khusus
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header Login */}
          <div className="bg-zinc-900 p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
              <Store className="w-6 h-6" /> WOLAK-WALIK<span className="text-red-500">.</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-2">Area Terbatas • Panel Administrator</p>
          </div>

          {/* Form Login */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-gray-500" /> Kunci Akses (Password)
                </label>
                <Input 
                  type="password" 
                  required
                  placeholder="Masukkan password admin..." 
                  className="h-12 bg-gray-50 text-center tracking-widest text-lg focus-visible:ring-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-[11px] text-gray-500 text-center">Petunjuk: Ketik <span className="font-bold text-black">admin123</span></p>
              </div>

              <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all">
                Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </div>
        
        <p className="text-zinc-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} Wolak-Walik Store. Sistem Keamanan.
        </p>
      </div>
    );
  }

  // JIKA SUDAH LOGIN: Tampilkan isi halaman Admin (Dashboard / Produk)
  return <>{children}</>;
}