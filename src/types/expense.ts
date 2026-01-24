import { Category } from './category'
import { Bank } from './bank'
import { TransactionType } from './transactionType'

export interface Expense {
  id: string
  amount: number
  category: Category
  description: string | null
  date: string
  bank: Bank
  transaction_type: TransactionType
  created_at: string
}

export interface ExpenseFormData {
  amount: number
  category: Category
  description: string
  date: string
  bank: Bank
  transaction_type: TransactionType
}
