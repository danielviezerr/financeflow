export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(date))
}

export function formatMonth(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

export function getMonthRange(date: Date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

export function getLastNMonths(n: number): { month: string; label: string }[] {
  const months = []
  const now = new Date()
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      month: date.toISOString().split('T')[0].slice(0, 7),
      label: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date),
    })
  }
  
  return months
}
