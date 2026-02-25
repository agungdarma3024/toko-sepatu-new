// sanity/order.ts
import { defineField, defineType } from 'sanity'

export const order = defineType({
  name: 'order',
  title: 'Pesanan Masuk',
  type: 'document',
  fields: [
    defineField({ name: 'customerName', title: 'Nama Pelanggan', type: 'string' }),
    defineField({ name: 'phone', title: 'Nomor WA', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Alamat Pengiriman', type: 'text' }),
    defineField({
      name: 'items',
      title: 'Daftar Pesanan',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productName', title: 'Nama Produk', type: 'string' },
            { name: 'size', title: 'Ukuran', type: 'number' },
            { name: 'color', title: 'Warna', type: 'string' },
            { name: 'quantity', title: 'Jumlah', type: 'number' },
            { name: 'price', title: 'Harga Satuan (Rp)', type: 'number' },
          ]
        }
      ]
    }),
    defineField({ name: 'totalPrice', title: 'Total Pembayaran (Rp)', type: 'number' }),
    defineField({
      name: 'status',
      title: 'Status Pesanan',
      type: 'string',
      options: {
        list: [
          { title: '🔴 Menunggu Konfirmasi', value: 'pending' },
          { title: '🟡 Diproses', value: 'processing' },
          { title: '🔵 Dikirim', value: 'shipped' },
          { title: '🟢 Selesai', value: 'delivered' },
          { title: '⚫ Dibatalkan', value: 'cancelled' }
        ],
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'orderDate',
      title: 'Tanggal Pesanan',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})