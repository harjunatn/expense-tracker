import { useState, useEffect } from 'react'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import Filters from '../components/Filters'
import { getExpenses } from '../lib/supabase'
import { Expense, Category } from '../types/expense'

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const filters: {
        category?: string
        dateFrom?: string
        dateTo?: string
      } = {}

      if (selectedCategory) {
        filters.category = selectedCategory
      }

      if (selectedMonth) {
        const [year, month] = selectedMonth.split('-')
        filters.dateFrom = `${year}-${month}-01`
        const lastDay = new Date(Number(year), Number(month), 0).getDate()
        filters.dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`
      }

      const data = await getExpenses(filters)
      setExpenses(data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Gagal memuat pengeluaran. Pastikan koneksi internet dan konfigurasi Supabase sudah benar.'
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [selectedCategory, selectedMonth])

  const handleExpenseAdded = () => {
    fetchExpenses()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Pengeluaran</h1>
        </div>
      </header>

      <ExpenseForm onExpenseAdded={handleExpenseAdded} />

      <Filters
        selectedCategory={selectedCategory}
        selectedMonth={selectedMonth}
        onCategoryChange={setSelectedCategory}
        onMonthChange={setSelectedMonth}
      />

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">
          <p>Memuat...</p>
        </div>
      ) : (
        <ExpenseList expenses={expenses} onExpenseUpdated={fetchExpenses} />
      )}
    </div>
  )
}
