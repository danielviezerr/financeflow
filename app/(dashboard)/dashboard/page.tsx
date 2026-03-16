import { createClient } from '@/lib/supabase/server'
import { getMonthRange } from '@/lib/format'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { ExpenseChart } from '@/components/dashboard/expense-chart'
import { GoalsProgress } from '@/components/dashboard/goals-progress'

export const metadata = {
  title: 'Dashboard | FinanceFlow',
  description: 'Painel de controle financeiro pessoal',
}

async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { start, end } = getMonthRange()
  const lastMonth = getMonthRange(new Date(new Date().setMonth(new Date().getMonth() - 1)))

  // Fetch all data in parallel
  const [
    { data: expenses },
    { data: lastMonthExpenses },
    { data: incomes },
    { data: lastMonthIncomes },
    { data: investments },
    { data: goals },
    { data: categories },
    { data: accounts },
  ] = await Promise.all([
    supabase.from('expenses').select('*').gte('date', start).lte('date', end),
    supabase.from('expenses').select('amount').gte('date', lastMonth.start).lte('date', lastMonth.end),
    supabase.from('incomes').select('*').gte('date', start).lte('date', end),
    supabase.from('incomes').select('amount').gte('date', lastMonth.start).lte('date', lastMonth.end),
    supabase.from('investments').select('*'),
    supabase.from('goals').select('*'),
    supabase.from('categories').select('*'),
    supabase.from('accounts').select('*'),
  ])

  const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  const totalIncomes = incomes?.reduce((sum, i) => sum + Number(i.amount), 0) || 0
  const totalInvestments = investments?.reduce((sum, i) => sum + Number(i.current_value || i.amount_invested), 0) || 0
  const totalBalance = accounts?.reduce((sum, a) => sum + Number(a.balance), 0) || 0

  const lastMonthTotalExpenses = lastMonthExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  const lastMonthTotalIncomes = lastMonthIncomes?.reduce((sum, i) => sum + Number(i.amount), 0) || 0

  const currentSavings = totalIncomes - totalExpenses
  const lastMonthSavings = lastMonthTotalIncomes - lastMonthTotalExpenses
  const savingsChange = lastMonthSavings !== 0 ? ((currentSavings - lastMonthSavings) / Math.abs(lastMonthSavings)) * 100 : 0

  // Group expenses by category
  const expensesByCategory = (expenses || []).reduce((acc, expense) => {
    const category = categories?.find(c => c.id === expense.category_id)
    const categoryName = category?.name || 'Outros'
    const categoryColor = category?.color || '#6b7280'
    if (!acc[categoryName]) {
      acc[categoryName] = { amount: 0, color: categoryColor }
    }
    acc[categoryName].amount += Number(expense.amount)
    return acc
  }, {} as Record<string, { amount: number; color: string }>)

  const chartData = Object.entries(expensesByCategory).map(([name, { amount, color }]) => ({
    name,
    value: amount,
    fill: color,
  }))

  // Recent transactions (combine and sort)
  const recentExpenses = (expenses || []).slice(0, 5).map(e => ({
    ...e,
    type: 'expense' as const,
    category: categories?.find(c => c.id === e.category_id),
  }))
  const recentIncomes = (incomes || []).slice(0, 5).map(i => ({
    ...i,
    type: 'income' as const,
  }))
  const recentTransactions = [...recentExpenses, ...recentIncomes]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    stats: {
      totalBalance,
      totalIncome: totalIncomes,
      totalExpenses,
      totalInvestments,
      monthlyChange: savingsChange,
    },
    chartData,
    recentTransactions,
    goals: goals || [],
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  if (!data) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas finanças</p>
      </div>

      <StatsCards stats={data.stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseChart data={data.chartData} />
        <GoalsProgress goals={data.goals} />
      </div>

      <RecentTransactions transactions={data.recentTransactions} />
    </div>
  )
}
