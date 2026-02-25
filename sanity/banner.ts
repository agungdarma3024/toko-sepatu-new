// sanity/banner.ts
import { defineField, defineType } from 'sanity'

export const banner = defineType({
  name: 'banner',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Utama (Besar)',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sub Judul (Kecil)',
      type: 'string',
    }),
    defineField({
      name: 'buttonText',
      title: 'Teks Tombol',
      type: 'string',
      initialValue: 'Belanja Sekarang',
    }),
    defineField({
      name: 'link',
      title: 'Link Tujuan Tombol',
      type: 'string',
      description: 'Contoh: /produk atau /kategori/sneakers',
      initialValue: '/produk',
    }),
    defineField({
      name: 'image',
      title: 'Gambar Background',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})