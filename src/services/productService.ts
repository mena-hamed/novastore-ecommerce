import { supabase } from '../lib/supabase'
import type { Product } from '../types/product'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      category_id,
      name,
      description,
      price,
      image_url,
      stock,
      created_at,
      categories (
        id,
        name
      )
    `)

  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }

  return (data ?? []).map((product: any) => ({
  id: Number(product.id),
  name: product.name,
  description: product.description ?? '',
  price: Number(product.price),
  stock: product.stock,
  image: product.image_url ?? '',
  category: product.categories?.name ?? 'Uncategorized',
  category_id: Number(product.category_id),
}))
}