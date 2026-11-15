import { fruitProducts } from '../products/FruitProductsData.ts'

export type Category = { id: string; name: string; description: string }
export const MIN_CATEGORY_NAME_LENGTH = 2
export const MAX_CATEGORY_NAME_LENGTH = 40
export const MAX_CATEGORY_DESCRIPTION_LENGTH = 120
export const categoriesSeed: Category[] = [
  { id: 'c1', name: 'Berries', description: 'Small soft fruit sold by the punnet.' },
  { id: 'c2', name: 'Citrus', description: 'Oranges, lemons and other citrus fruit.' },
  { id: 'c3', name: 'Melon', description: 'Large fruit with a thick rind.' },
  { id: 'c4', name: 'Pome', description: 'Apples and pears with a central core.' },
  { id: 'c5', name: 'Stone fruit', description: 'Fruit with a single hard stone.' },
  { id: 'c6', name: 'Tropical', description: 'Fruit grown in warm climates.' },
  { id: 'c7', name: 'Vine fruit', description: 'Fruit that grows on climbing vines.' }
]
export function getProductCount(categoryName: string): number {
  return fruitProducts.filter(product => product.category === categoryName).length
}
