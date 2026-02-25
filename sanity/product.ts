// sanity/product.ts
import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Produk Sepatu',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Produk',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL Unik)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 90,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Foto Utama',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Sneakers', value: 'sneakers' },
          { title: 'Running', value: 'running' },
          { title: 'Casual', value: 'casual' },
          { title: 'Formal', value: 'formal' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: 'Pria', value: 'Pria' },
          { title: 'Wanita', value: 'Wanita' },
          { title: 'Unisex', value: 'Unisex' },
        ],
      },
    }),
    defineField({
      name: 'price',
      title: 'Harga Jual (Rp)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Harga Coret / Diskon (Opsional)',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Lengkap',
      type: 'text',
    }),
    defineField({
      name: 'sizes',
      title: 'Pilihan Ukuran (Ketik angka lalu Enter)',
      type: 'array',
      of: [{ type: 'number' }],
    }),
    defineField({
      name: 'colors',
      title: 'Pilihan Warna (Ketik warna lalu Enter)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'isNew',
      title: 'Tandai sebagai "New Release"?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isBestSeller',
      title: 'Tandai sebagai "Best Seller"?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      initialValue: 5,
    }),
  ],
})