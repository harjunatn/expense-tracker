import { Category } from '../types/expense'

export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    Makan: 'bg-orange-100 text-orange-800',
    Transport: 'bg-blue-100 text-blue-800',
    Kopi: 'bg-amber-100 text-amber-800',
    Belanja: 'bg-green-100 text-green-800',
    Tagihan: 'bg-red-100 text-red-800',
    Lainnya: 'bg-purple-100 text-purple-800',
  }
  return colors[category]
}
