import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ExpenseInput from './pages/ExpenseInput'
import TransactionsList from './pages/TransactionsList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExpenseInput />} />
        <Route path="/transactions" element={<TransactionsList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
