import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // HARUS false agar data langsung masuk saat itu juga
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN, // <--- Kunci masuknya di sini
})