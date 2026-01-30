import { Category } from '../types/category'
import { FilterType } from '../types/filterType'
import { Bank } from '../types/bank'
import { TransactionType } from '../types/transactionType'
import { CATEGORIES } from '../constants/categories'
import { BANKS } from '../constants/banks'
import { TRANSACTION_TYPES } from '../constants/transactionTypes'

interface FiltersProps {
  selectedCategory: Category | '' | 'NOT_TAGIHAN'
  selectedBank: Bank | ''
  selectedTransactionType: TransactionType | ''
  filterType: FilterType
  selectedMonth: string
  dateFrom: string
  dateTo: string
  onCategoryChange: (category: Category | '' | 'NOT_TAGIHAN') => void
  onBankChange: (bank: Bank | '') => void
  onTransactionTypeChange: (type: TransactionType | '') => void
  onFilterTypeChange: (type: FilterType) => void
  onMonthChange: (month: string) => void
  onDateFromChange: (date: string) => void
  onDateToChange: (date: string) => void
}

export default function Filters({
  selectedCategory,
  selectedBank,
  selectedTransactionType,
  filterType,
  selectedMonth,
  dateFrom,
  dateTo,
  onCategoryChange,
  onBankChange,
  onTransactionTypeChange,
  onFilterTypeChange,
  onMonthChange,
  onDateFromChange,
  onDateToChange,
}: FiltersProps) {
  return (
    <div className="space-y-4 p-4 bg-white border-b">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as Category | '' | 'NOT_TAGIHAN')}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua</option>
            <option value="NOT_TAGIHAN">Kecuali Tagihan</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bank-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Bank
          </label>
          <select
            id="bank-filter"
            value={selectedBank}
            onChange={(e) => onBankChange(e.target.value as Bank | '')}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua</option>
            {BANKS.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="transaction-type-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Tipe
          </label>
          <select
            id="transaction-type-filter"
            value={selectedTransactionType}
            onChange={(e) => onTransactionTypeChange(e.target.value as TransactionType | '')}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua</option>
            {TRANSACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter Tanggal</label>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => onFilterTypeChange('month')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filterType === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bulan
          </button>
          <button
            type="button"
            onClick={() => onFilterTypeChange('date')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filterType === 'date'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rentang Tanggal
          </button>
        </div>

        {filterType === 'month' ? (
          <div className="relative">
            <input
              id="month-filter"
              type="month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              style={{ WebkitAppearance: 'none', appearance: 'none' }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date-from-filter" className="block text-xs font-medium text-gray-700 mb-2 cursor-pointer">
                Dari Tanggal
              </label>
              <div className="relative">
                <input
                  id="date-from-filter"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => onDateFromChange(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="date-to-filter" className="block text-xs font-medium text-gray-700 mb-2 cursor-pointer">
                Sampai Tanggal
              </label>
              <div className="relative">
                <input
                  id="date-to-filter"
                  type="date"
                  value={dateTo}
                  onChange={(e) => onDateToChange(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
