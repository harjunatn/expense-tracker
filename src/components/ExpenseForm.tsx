import { useState } from 'react'
import { ExpenseFormData } from '../types/expense'
import { insertExpense } from '../lib/supabase'
import { formatNumber, parseNumber } from '../helpers/currency'
import { CATEGORIES } from '../constants/categories'
import { BANKS } from '../constants/banks'
import { TRANSACTION_TYPES } from '../constants/transactionTypes'

interface ExpenseFormProps {
  onExpenseAdded: () => void
}

export default function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    category: 'Makan',
    description: '',
    date: new Date().toISOString().split('T')[0],
    bank: 'BCA',
    transaction_type: 'TRANSFER',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.amount <= 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await insertExpense({
        amount: Math.round(formData.amount),
        category: formData.category,
        description: formData.description.trim() || null,
        date: formData.date,
        bank: formData.bank,
        transaction_type: formData.transaction_type,
      })

      setFormData({
        amount: 0,
        category: 'Makan',
        description: '',
        date: new Date().toISOString().split('T')[0],
        bank: 'BCA',
        transaction_type: 'TRANSFER',
      })

      onExpenseAdded()
    } catch (error) {
      console.error('Error adding expense:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Gagal menambahkan pengeluaran. Pastikan koneksi internet dan konfigurasi Supabase sudah benar.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-b space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Jumlah (Rp)
        </label>
        <input
          id="amount"
          type="text"
          inputMode="numeric"
          value={formatNumber(formData.amount)}
          onChange={(e) => {
            const numericValue = parseNumber(e.target.value)
            setFormData({ ...formData, amount: numericValue })
          }}
          required
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Kategori
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseFormData['category'] })}
          required
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-2">
          Bank
        </label>
        <select
          id="bank"
          value={formData.bank}
          onChange={(e) => setFormData({ ...formData, bank: e.target.value as ExpenseFormData['bank'] })}
          required
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {BANKS.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-700 mb-2">
          Tipe Transaksi
        </label>
        <select
          id="transaction_type"
          value={formData.transaction_type}
          onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as ExpenseFormData['transaction_type'] })}
          required
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {TRANSACTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi (opsional)
        </label>
        <input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Contoh: Makan siang di restoran"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
          Tanggal
        </label>
        <div className="relative">
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            onClick={(e) => e.currentTarget.showPicker?.()}
            required
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            style={{ WebkitAppearance: 'none', appearance: 'none' }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || formData.amount <= 0}
        className="w-full py-4 px-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Menambahkan...' : 'Tambah Pengeluaran'}
      </button>
    </form>
  )
}
