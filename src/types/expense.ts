export type Category = 'Makan' | 'Transport' | 'Kopi' | 'Belanja' | 'Tagihan' | 'Lainnya'

export interface Expense {
  id: string
  amount: number
  category: Category
  description: string | null
  date: string
  created_at: string
}

export interface ExpenseFormData {
  amount: number
  category: Category
  description: string
  date: string
}
