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
}): Promise<Expense[]> => {
  let query = supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.dateFrom) {
    query = query.gte('date', filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte('date', filters.dateTo)
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
