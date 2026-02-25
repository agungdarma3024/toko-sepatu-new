// sanity/customer.ts
import { defineField, defineType } from 'sanity'

export const customer = defineType({
  name: 'customer',
  title: 'Data Pelanggan',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Lengkap',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Alamat Email',
      type: 'string',
    }),
    // === TAMBAHKAN INI ===
    defineField({
      name: 'password',
      title: 'Password (Hanya untuk keperluan belajar)',
      type: 'string',
    }),
    // =====================
    defineField({
      name: 'registeredAt',
      title: 'Tanggal Daftar',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})