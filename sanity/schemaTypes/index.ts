// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import { product } from '../product'
import { category } from '../category'
import { banner } from '../banner'

export const schema: { types: SchemaTypeDefinition[] } = {
  // Tambahkan category dan banner di dalam kotak kurung siku ini
  types: [product, category, banner], 
}