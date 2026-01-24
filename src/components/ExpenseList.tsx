import { useState } from 'react'
import { Expense } from '../types/expense'
import { Category } from '../types/category'
import { Bank } from '../types/bank'
import { TransactionType } from '../types/transactionType'
import { formatCurrency, formatNumber, parseNumber } from '../helpers/currency'
import { formatDate } from '../helpers/date'
import { getCategoryColor } from '../helpers/category'
import { updateExpense } from '../lib/supabase'
import { CATEGORIES } from '../constants/categories'
import { BANKS } from '../constants/banks'
import { TRANSACTION_TYPES } from '../constants/transactionTypes'

interface ExpenseListProps {
  expenses: Expense[]
  onExpenseUpdated: () => void
}

interface ExpenseItemProps {
  expense: Expense
  onExpenseUpdated: () => void
}

function ExpenseItem({ expense, onExpenseUpdated }: ExpenseItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedAmount, setEditedAmount] = useState(expense.amount)
  const [editedDescription, setEditedDescription] = useState(expense.description || '')
  const [editedCategory, setEditedCategory] = useState<Category>(expense.category)
  const [editedBank, setEditedBank] = useState<Bank>(expense.bank)
  const [editedTransactionType, setEditedTransactionType] = useState<TransactionType>(expense.transaction_type)

  const handleSave = async () => {
    if (editedAmount <= 0) {
      alert('Jumlah harus lebih dari 0')
      return
    }

    setIsSaving(true)
    try {
      await updateExpense(expense.id, {
        amount: Math.round(editedAmount),
        category: editedCategory,
        description: editedDescription.trim() || null,
        bank: editedBank,
        transaction_type: editedTransactionType,
      })
      setIsEditing(false)
      onExpenseUpdated()
    } catch (error) {
      console.error('Error updating expense:', error)
      alert('Gagal memperbarui pengeluaran')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedAmount(expense.amount)
    setEditedDescription(expense.description || '')
    setEditedCategory(expense.category)
    setEditedBank(expense.bank)
    setEditedTransactionType(expense.transaction_type)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="p-4 bg-white border-l-4 border-blue-500">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumber(editedAmount)}
              onChange={(e) => setEditedAmount(parseNumber(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value as Category)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bank</label>
            <select
              value={editedBank}
              onChange={(e) => setEditedBank(e.target.value as Bank)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {BANKS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipe Transaksi</label>
            <select
              value={editedTransactionType}
              onChange={(e) => setEditedTransactionType(e.target.value as TransactionType)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TRANSACTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
            <input
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Opsional"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white group hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          {expense.description && (
            <p className="text-sm text-gray-900 mb-1 line-clamp-2">{expense.description}</p>
          )}
          <p className="text-xs text-gray-500 mb-1">{formatDate(expense.date)}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">{expense.bank}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{expense.transaction_type}</span>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
            {formatCurrency(expense.amount)}
          </span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(expense.category)}`}>
              {expense.category}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded active:bg-blue-100"
              title="Edit"
              aria-label="Edit transaction"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExpenseList({ expenses, onExpenseUpdated }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Tidak ada pengeluaran</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onExpenseUpdated={onExpenseUpdated} />
      ))}
    </div>
  )
}
