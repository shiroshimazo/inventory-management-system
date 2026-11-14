export type FruitProduct = {
  id: string
  name: string
  category: 'Berries' | 'Citrus' | 'Melon' | 'Pome' | 'Stone fruit' | 'Tropical' | 'Vine fruit'
  pricePerKg: number
  quantity: number
  reorderLevel: number
}

export const fruitProducts: FruitProduct[] = [
  { id: 'f1', name: 'Fuji apple', category: 'Pome', pricePerKg: 3.4, quantity: 42, reorderLevel: 15 },
  { id: 'f2', name: 'Cavendish banana', category: 'Tropical', pricePerKg: 1.2, quantity: 65, reorderLevel: 20 },
  { id: 'f3', name: 'Blueberry', category: 'Berries', pricePerKg: 9.6, quantity: 5, reorderLevel: 8 },
  { id: 'f4', name: 'Green grapes', category: 'Vine fruit', pricePerKg: 5.2, quantity: 21, reorderLevel: 10 },
  { id: 'f5', name: 'Lemon', category: 'Citrus', pricePerKg: 2.1, quantity: 30, reorderLevel: 12 },
  { id: 'f6', name: 'Kent mango', category: 'Tropical', pricePerKg: 4.2, quantity: 24, reorderLevel: 10 },
  { id: 'f7', name: 'Navel orange', category: 'Citrus', pricePerKg: 2.8, quantity: 0, reorderLevel: 18 },
  { id: 'f8', name: 'Peach', category: 'Stone fruit', pricePerKg: 4.8, quantity: 7, reorderLevel: 10 },
  { id: 'f9', name: 'Conference pear', category: 'Pome', pricePerKg: 3.1, quantity: 0, reorderLevel: 10 },
  { id: 'f10', name: 'Pineapple', category: 'Tropical', pricePerKg: 2.6, quantity: 18, reorderLevel: 8 },
  { id: 'f11', name: 'Strawberry', category: 'Berries', pricePerKg: 6.5, quantity: 9, reorderLevel: 12 },
  { id: 'f12', name: 'Watermelon', category: 'Melon', pricePerKg: 0.9, quantity: 38, reorderLevel: 10 }
]

export function getStockStatus(product: FruitProduct): 'In stock' | 'Low stock' | 'Out of stock' {
  if (product.quantity === 0) return 'Out of stock'
  if (product.quantity < product.reorderLevel) return 'Low stock'
  return 'In stock'
}
