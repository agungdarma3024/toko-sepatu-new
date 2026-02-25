// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import { product } from '../product'
import { category } from '../category'
import { banner } from '../banner'
import { customer } from '../customer'
import { order } from '../order' // <--- 1. Tambahkan ini

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, banner, customer, order], // <--- 2. Masukkan ke dalam kurung
}