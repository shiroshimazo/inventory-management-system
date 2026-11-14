export type FruitProduct = {
  id: string
  name: string
  category: 'Berries' | 'Citrus' | 'Melon' | 'Pome' | 'Stone fruit' | 'Tropical' | 'Vine fruit'
  pricePerKg: number
  weightKg: number
  quantity: number
  reorderLevel: number
}

export const fruitProducts: FruitProduct[] = [
  { id: 'f1', name: 'Fuji apple', category: 'Pome', pricePerKg: 3.4, weightKg: 42, quantity: 210, reorderLevel: 75 },
  {
    id: 'f2',
    name: 'Cavendish banana',
    category: 'Tropical',
    pricePerKg: 1.2,
    weightKg: 65,
    quantity: 325,
    reorderLevel: 100
  },
  { id: 'f3', name: 'Blueberry', category: 'Berries', pricePerKg: 9.6, weightKg: 5, quantity: 20, reorderLevel: 32 },
  {
    id: 'f4',
    name: 'Green grapes',
    category: 'Vine fruit',
    pricePerKg: 5.2,
    weightKg: 21,
    quantity: 42,
    reorderLevel: 20
  },
  { id: 'f5', name: 'Lemon', category: 'Citrus', pricePerKg: 2.1, weightKg: 30, quantity: 150, reorderLevel: 60 },
  { id: 'f6', name: 'Kent mango', category: 'Tropical', pricePerKg: 4.2, weightKg: 24, quantity: 48, reorderLevel: 20 },
  { id: 'f7', name: 'Navel orange', category: 'Citrus', pricePerKg: 2.8, weightKg: 0, quantity: 0, reorderLevel: 90 },
  { id: 'f8', name: 'Peach', category: 'Stone fruit', pricePerKg: 4.8, weightKg: 7, quantity: 35, reorderLevel: 50 },
  { id: 'f9', name: 'Conference pear', category: 'Pome', pricePerKg: 3.1, weightKg: 0, quantity: 0, reorderLevel: 50 },
  { id: 'f10', name: 'Pineapple', category: 'Tropical', pricePerKg: 2.6, weightKg: 18, quantity: 18, reorderLevel: 8 },
  { id: 'f11', name: 'Strawberry', category: 'Berries', pricePerKg: 6.5, weightKg: 9, quantity: 36, reorderLevel: 48 },
  { id: 'f12', name: 'Watermelon', category: 'Melon', pricePerKg: 0.9, weightKg: 38, quantity: 19, reorderLevel: 5 }
]

export function getStockStatus(product: FruitProduct): 'In stock' | 'Low stock' | 'Out of stock' {
  if (product.quantity === 0) return 'Out of stock'
  if (product.quantity < product.reorderLevel) return 'Low stock'
  return 'In stock'
}
