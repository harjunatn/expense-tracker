import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ExpenseList from '../components/ExpenseList'
import Filters from '../components/Filters'
import { getExpenses } from '../lib/supabase'
import { Expense } from '../types/expense'
import { Category } from '../types/category'
import { Bank } from '../types/bank'
import { TransactionType } from '../types/transactionType'
import { FilterType } from '../types/filterType'
import { formatCurrency } from '../helpers/currency'

export default function TransactionsList() {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category | '' | 'NOT_TAGIHAN'>('')
  const [selectedBank, setSelectedBank] = useState<Bank | ''>('')
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | ''>('')
  const [filterType, setFilterType] = useState<FilterType>('month')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const handleFilterTypeChange = (type: FilterType) => {
    setFilterType(type)
    if (type === 'month') {
      setDateFrom('')
      setDateTo('')
    } else {
      setSelectedMonth('')
    }
  }

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const filters: {
        category?: string
        bank?: string
        transaction_type?: string
        dateFrom?: string
        dateTo?: string
      } = {}

      if (selectedCategory) {
        filters.category = selectedCategory
      }

      if (selectedBank) {
        filters.bank = selectedBank
      }

      if (selectedTransactionType) {
        filters.transaction_type = selectedTransactionType
      }

      // Only set date filters if explicitly provided, otherwise let getExpenses use defaults
      if (filterType === 'date' && dateFrom && dateTo) {
        filters.dateFrom = dateFrom
        filters.dateTo = dateTo
      } else if (filterType === 'month' && selectedMonth) {
        // Only set if month is explicitly different from current month
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        if (selectedMonth !== currentMonth) {
          const [year, month] = selectedMonth.split('-')
          filters.dateFrom = `${year}-${month}-01`
          const lastDay = new Date(Number(year), Number(month), 0).getDate()
          filters.dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`
        }
      }

      const data = await getExpenses({
        ...filters,
        filterType,
      })
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
  }, [selectedCategory, selectedBank, selectedTransactionType, filterType, selectedMonth, dateFrom, dateTo])

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[560px] mx-auto bg-white min-h-screen">
        <header className="border-b sticky top-0 z-10 bg-white">
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Semua Transaksi</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Tambah
            </button>
          </div>
        </header>

        <Filters
          selectedCategory={selectedCategory}
          selectedBank={selectedBank}
          selectedTransactionType={selectedTransactionType}
          filterType={filterType}
          selectedMonth={selectedMonth}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onCategoryChange={setSelectedCategory}
          onBankChange={setSelectedBank}
          onTransactionTypeChange={setSelectedTransactionType}
          onFilterTypeChange={handleFilterTypeChange}
          onMonthChange={setSelectedMonth}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />

        {!isLoading && (
          <div className="border-b px-4 py-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Pengeluaran</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(totalExpense)}</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <p>Memuat...</p>
          </div>
        ) : (
          <ExpenseList expenses={expenses} onExpenseUpdated={fetchExpenses} />
        )}
      </div>
    </div>
  )
}
