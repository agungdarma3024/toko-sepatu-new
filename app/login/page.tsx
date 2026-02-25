// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi proses login
    toast.loading("Memeriksa data masuk...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Berhasil masuk!", { description: "Selamat datang kembali di Wolak-Walik." });
      router.push("/"); // Kembali ke beranda setelah login
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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Form */}
        <div className="p-8 pb-6 text-center border-b border-gray-50">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-black justify-center mb-2">
            <Store className="w-7 h-7" /> WOLAK-WALIK<span className="text-red-500">.</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Selamat Datang Kembali</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk untuk melanjutkan belanja Anda.</p>
        </div>

        {/* Form Isi */}
        <div className="p-8 pt-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input required type="email" placeholder="nama@email.com" className="pl-10 h-12 bg-gray-50 focus-visible:ring-black" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link href="#" className="text-xs text-gray-500 hover:text-black font-medium">Lupa Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input required type="password" placeholder="••••••••" className="pl-10 h-12 bg-gray-50 focus-visible:ring-black" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold text-base mt-2">
              Masuk Sekarang
            </Button>

            {/* Pemisah */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">Atau masuk dengan</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Button type="button" variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 font-medium text-gray-700 gap-2">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Google
            </Button>
          </form>

          {/* Link ke Register */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Belum punya akun? <Link href="/register" className="font-bold text-black hover:underline">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}