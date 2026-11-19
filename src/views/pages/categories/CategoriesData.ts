import { fruitProducts } from '../products/FruitProductsData.ts'

export const CATEGORY_STATUSES = ['Active', 'Inactive'] as const
export type Category = { id: string; name: string; description: string; status: (typeof CATEGORY_STATUSES)[number] }
export const MIN_CATEGORY_NAME_LENGTH = 2
export const MAX_CATEGORY_NAME_LENGTH = 40
export const MAX_CATEGORY_DESCRIPTION_LENGTH = 120
export const categoriesSeed: Category[] = [
  { id: 'c1', name: 'Berries', description: 'Small soft fruit sold by the punnet.', status: 'Active' },
  { id: 'c2', name: 'Citrus', description: 'Oranges, lemons and other citrus fruit.', status: 'Active' },
  { id: 'c3', name: 'Melon', description: 'Large fruit with a thick rind.', status: 'Active' },
  { id: 'c4', name: 'Pome', description: 'Apples and pears with a central core.', status: 'Active' },
  { id: 'c5', name: 'Stone fruit', description: 'Fruit with a single hard stone.', status: 'Active' },
  { id: 'c6', name: 'Tropical', description: 'Fruit grown in warm climates.', status: 'Active' },
  { id: 'c7', name: 'Vine fruit', description: 'Fruit that grows on climbing vines.', status: 'Active' }
]
export function getProductCount(categoryName: string): number {
  return fruitProducts.filter(product => product.category === categoryName).length
}
