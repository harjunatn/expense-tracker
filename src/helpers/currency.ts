export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (value: number): string => {
  if (value === 0) return ''
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const parseNumber = (value: string): number => {
  const cleaned = value.replace(/\./g, '')
  const parsed = parseInt(cleaned, 10)
  return isNaN(parsed) ? 0 : parsed
}
