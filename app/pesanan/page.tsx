// app/pesanan/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { formatPrice } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronLeft, Loader2, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";

export default function PesananSayaPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Cek User Login
    const storedUser = localStorage.getItem("user_wolak_walik");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);

    // 2. Tarik data pesanan HANYA milik user ini (berdasarkan email)
    async function fetchMyOrders() {
      try {
        const query = `*[_type == "order" && email == $email] | order(orderDate desc) {
          _id, orderDate, status, totalPrice, items
        }`;
        const data = await client.fetch(query, { email: userData.email });
        setOrders(data || []);
      } catch (error) {
        console.error("Gagal menarik data pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyOrders();
  }, [router]);

  // Fungsi untuk mengubah status bahasa Inggris ke bahasa Indonesia & Warna Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1"/> Menunggu Konfirmasi</Badge>;
      case 'processing': return <Badge className="bg-blue-500 hover:bg-blue-600"><Package className="w-3 h-3 mr-1"/> Sedang Diproses</Badge>;
      case 'shipped': return <Badge className="bg-purple-500 hover:bg-purple-600"><Truck className="w-3 h-3 mr-1"/> Sedang Dikirim</Badge>;
      case 'delivered': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1"/> Selesai</Badge>;
      case 'cancelled': return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1"/> Dibatalkan</Badge>;
      default: return <Badge className="bg-gray-500">Status Tidak Diketahui</Badge>;
    }
  };

  // Fungsi memformat tanggal (Contoh: 25 Februari 2026)
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <main className="min-h-screen bg-zinc-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4 flex items-center gap-3">
            <Package className="w-8 h-8" /> Pesanan Saya
          </h1>
          <p className="text-gray-500 mt-2">Pantau status pengiriman dan riwayat belanja Anda di sini.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Memuat riwayat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-500 mb-6">Anda belum pernah melakukan transaksi di toko kami.</p>
            <Button asChild className="bg-black text-white hover:bg-gray-800">
              <Link href="/produk">Mulai Belanja Sekarang</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tanggal Transaksi</p>
                    <p className="font-semibold text-sm">{formatDate(order.orderDate)}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase">ID: {order._id.substring(0, 8)}</p>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    {getStatusBadge(order.status)}
                    <span className="font-bold text-lg text-black">{formatPrice(order.totalPrice)}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {order.items?.map((item: any) => (
                      <div key={item._key} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.productName}</p>
                          <p className="text-xs text-gray-500 mt-1">Ukuran: {item.size} | Warna: {item.color}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{item.quantity}x</p>
                          <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}