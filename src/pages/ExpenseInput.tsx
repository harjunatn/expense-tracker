import { useNavigate } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'

export default function ExpenseInput() {
  const navigate = useNavigate()

  const handleExpenseAdded = () => {
    navigate('/transactions')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[560px] mx-auto bg-white min-h-screen">
        <header className="border-b sticky top-0 z-10 bg-white">
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Tambah Pengeluaran</h1>
            <button
              onClick={() => navigate('/transactions')}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Lihat Semua
            </button>
          </div>
        </header>

        <ExpenseForm onExpenseAdded={handleExpenseAdded} />
      </div>
    </div>
  )
}
