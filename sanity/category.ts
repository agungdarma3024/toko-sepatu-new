// sanity/category.ts
import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Kategori Produk',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Kategori',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Kategori (Slug)',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Gambar Kategori',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
})