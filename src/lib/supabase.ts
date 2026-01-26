import { createClient } from '@supabase/supabase-js'
import type { Expense } from '../types/expense'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getExpenses = async (filters?: {
  category?: string
  dateFrom?: string
  dateTo?: string
  filterType?: 'month' | 'date'
}): Promise<Expense[]> => {
  let query = supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  let dateFrom = filters?.dateFrom
  let dateTo = filters?.dateTo

  // Apply default date ranges if not provided
  if (!dateFrom || !dateTo) {
    const now = new Date()
    const filterType = filters?.filterType || 'month'

    if (filterType === 'month') {
      // Default to current month
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      dateFrom = dateFrom || `${year}-${month}-01`
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
      dateTo = dateTo || `${year}-${month}-${String(lastDay).padStart(2, '0')}`
    } else if (filterType === 'date') {
      // Default to last 14 days
      const toDate = new Date(now)
      toDate.setHours(23, 59, 59, 999)
      const fromDate = new Date(now)
      fromDate.setDate(fromDate.getDate() - 14)
      fromDate.setHours(0, 0, 0, 0)
      
      dateTo = dateTo || toDate.toISOString().split('T')[0]
      dateFrom = dateFrom || fromDate.toISOString().split('T')[0]
    }
  }

  if (dateFrom) {
    query = query.gte('date', dateFrom)
  }

  if (dateTo) {
    query = query.lte('date', dateTo)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data || []
}

export const insertExpense = async (expense: {
  amount: number
  category: string
  description: string | null
  date: string
  bank: string
  transaction_type: string
}): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export const updateExpense = async (
  id: string,
  updates: {
    amount?: number
    category?: string
    description?: string | null
    bank?: string
    transaction_type?: string
  }
): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
