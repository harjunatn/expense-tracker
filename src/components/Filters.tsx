import { Category } from '../types/expense'

interface FiltersProps {
  selectedCategory: Category | ''
  selectedMonth: string
  onCategoryChange: (category: Category | '') => void
  onMonthChange: (month: string) => void
}

const CATEGORIES: Category[] = ['Makan', 'Transport', 'Kopi', 'Belanja', 'Tagihan', 'Lainnya']

export default function Filters({
  selectedCategory,
  selectedMonth,
  onCategoryChange,
  onMonthChange,
}: FiltersProps) {
  return (
    <div className="space-y-4 p-4 bg-white border-b">
      <div>
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Kategori
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as Category | '')}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Semua</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
          Bulan
        </label>
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
      </div>
    </div>
  )
}
