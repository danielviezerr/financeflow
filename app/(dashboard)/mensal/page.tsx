import { createClient } from '@/lib/supabase/server'
import { MonthlyOverview } from '@/components/monthly/monthly-overview'
import { MonthlyChart } from '@/components/monthly/monthly-chart'
import { MonthlyCategoryBreakdown } from '@/components/monthly/monthly-category-breakdown'

export const metadata = {
  title: 'Controle Mensal | FinanceFlow',
  description: 'Visão mensal das suas finanças',
}

async function getMonthlyData(year: number, month: number) {
  const supabase = await createClient()

  const startDate = new Date(year, month, 1).toISOString().split('T')[0]
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

  const [{ data: expenses }, { data: incomes }, { data: categories }] = await Promise.all([
    supabase.from('expenses').select('*').gte('date', startDate).lte('date', endDate),
    supabase.from('incomes').select('*').gte('date', startDate).lte('date', endDate),
    supabase.from('categories').select('*').eq('type', 'expense'),
  ])

  // Get last 6 months data for chart
  const monthsData = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - i, 1)
    const s = d.toISOString().split('T')[0]
    const e = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0]

    const [{ data: mExpenses }, { data: mIncomes }] = await Promise.all([
      supabase.from('expenses').select('amount').gte('date', s).lte('date', e),
      supabase.from('incomes').select('amount').gte('date', s).lte('date', e),
    ])

    const totalExpenses = mExpenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0
    const totalIncomes = mIncomes?.reduce((sum, inc) => sum + Number(inc.amount), 0) || 0

    monthsData.push({
      month: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(d),
      receitas: totalIncomes,
      despesas: totalExpenses,
    })
  }

  return {
    expenses: expenses || [],
    incomes: incomes || [],
    categories: categories || [],
    monthsData,
  }
}

export default async function MensalPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>
}) {
  const params = await searchParams
  const now = new Date()
  const year = params.year ? parseInt(params.year) : now.getFullYear()
  const month = params.month ? parseInt(params.month) : now.getMonth()

  const { expenses, incomes, categories, monthsData } = await getMonthlyData(year, month)

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const totalIncomes = incomes.reduce((sum, i) => sum + Number(i.amount), 0)
  const balance = totalIncomes - totalExpenses

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = categories.find(c => c.id === expense.category_id)
    const categoryName = category?.name || 'Outros'
    const categoryColor = category?.color || '#6b7280'
    if (!acc[categoryName]) {
      acc[categoryName] = { amount: 0, color: categoryColor }
    }
    acc[categoryName].amount += Number(expense.amount)
    return acc
  }, {} as Record<string, { amount: number; color: string }>)

  const categoryData = Object.entries(categoryTotals)
    .map(([name, { amount, color }]) => ({
      name,
      amount,
      color,
      percent: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Controle Mensal</h1>
        <p className="text-muted-foreground">
          {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(year, month))}
        </p>
      </div>

      <MonthlyOverview
        totalIncomes={totalIncomes}
        totalExpenses={totalExpenses}
        balance={balance}
        year={year}
        month={month}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyChart data={monthsData} />
        <MonthlyCategoryBreakdown data={categoryData} total={totalExpenses} />
      </div>
    </div>
  )
}
