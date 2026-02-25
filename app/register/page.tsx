// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password Terlalu Pendek", { description: "Password minimal harus 6 karakter." });
      return;
    }
    
    // Simulasi proses pendaftaran
    toast.loading("Membuat akun baru...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Pendaftaran Berhasil! 🎉", { description: "Silakan masuk menggunakan akun baru Anda." });
      router.push("/login"); // Arahkan ke halaman login setelah daftar
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      {/* Tombol Kembali */}
      <div className="absolute top-8 left-4 md:left-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Toko
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-12 md:mt-0">
        
        {/* Header Form */}
        <div className="p-8 pb-6 text-center border-b border-gray-50">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-black justify-center mb-2">
            <Store className="w-7 h-7" /> WOLAK-WALIK<span className="text-red-500">.</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Buat Akun Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Gabung sekarang untuk mulai menyimpan wishlist dan keranjang Anda.</p>
        </div>

        {/* Form Isi */}
        <div className="p-8 pt-6">
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input required type="text" placeholder="Budi Santoso" className="pl-10 h-12 bg-gray-50 focus-visible:ring-black" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input required type="email" placeholder="nama@email.com" className="pl-10 h-12 bg-gray-50 focus-visible:ring-black" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input required type="password" placeholder="Min. 6 karakter" className="pl-10 h-12 bg-gray-50 focus-visible:ring-black" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold text-base mt-2">
              Daftar Sekarang
            </Button>
          </form>

          {/* Link ke Login */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Sudah punya akun? <Link href="/login" className="font-bold text-black hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}