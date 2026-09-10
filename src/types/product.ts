export interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  stock: number
  image: string
  rating?: number
  category_id: number
}

export interface Category {
  id: string
  name: string
  description: string
}
