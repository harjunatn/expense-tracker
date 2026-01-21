import { Expense } from '../types/expense'
import { formatCurrency } from '../helpers/currency'
import { formatDate } from '../helpers/date'
import { getCategoryColor } from '../helpers/category'

interface ExpenseListProps {
  expenses: Expense[]
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
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
        <div key={expense.id} className="p-4 bg-white">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              {expense.description && (
                <p className="text-sm text-gray-900 mb-1 line-clamp-2">{expense.description}</p>
              )}
              <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end">
              <span className="text-lg font-semibold text-gray-900 whitespace-nowrap mb-1">
                {formatCurrency(expense.amount)}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(expense.category)}`}>
                {expense.category}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
