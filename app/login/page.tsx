// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { client } from "@/sanity/lib/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading("Mengecek data Anda...");

    try {
      // SIHIR PENGECEKAN KE DATABASE SANITY
      // "Tolong carikan 1 data customer yang email dan passwordnya cocok"
      const query = `*[_type == "customer" && email == $email && password == $password][0]`;
      const user = await client.fetch(query, { email: email, password: password });

      toast.dismiss();

      if (user) {
        // JIKA DATA DITEMUKAN
        
        // === TAMBAHKAN 1 BARIS INI UNTUK MENYIMPAN DATA KE BROWSER ===
        localStorage.setItem("user_wolak_walik", JSON.stringify({ name: user.name, email: user.email }));
        // ==============================================================

        toast.success(`Selamat datang kembali, ${user.name}! 🎉`);
        router.push("/"); // Arahkan ke beranda
      
      } else {
        // JIKA DATA TIDAK ADA (ATAU SALAH)
        toast.error("Login Gagal", { description: "Email atau Password Anda salah, atau belum terdaftar." });
      }
    } catch (error) {
      console.error("Gagal login:", error);
      toast.dismiss();
      toast.error("Terjadi Kesalahan", { description: "Gagal terhubung ke server." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-4 md:left-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Toko
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-12 md:mt-0">
        <div className="p-8 pb-6 text-center border-b border-gray-50">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-black justify-center mb-2">
            <Store className="w-7 h-7" /> WOLAK-WALIK<span className="text-red-500">.</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Selamat Datang Kembali</h1>
          <p className="text-sm text-gray-500 mt-1">Silakan masukkan email dan password Anda.</p>
        </div>

        <div className="p-8 pt-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input required type="email" placeholder="nama@email.com" className="pl-10 h-12 bg-gray-50 focus-visible:ring-black" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input required type="password" placeholder="••••••••" className="pl-10 h-12 bg-gray-50 focus-visible:ring-black" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold text-base mt-2" disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sedang Masuk...</> : "Masuk"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Belum punya akun? <Link href="/register" className="font-bold text-black hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </main>
  );
}