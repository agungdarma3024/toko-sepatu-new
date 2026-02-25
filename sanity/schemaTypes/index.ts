// sanity/schema.ts
import { type SchemaTypeDefinition } from 'sanity'
import { product } from '../product' // Memanggil cetakan produk kita

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product], // Mendaftarkan cetakan ke database
}