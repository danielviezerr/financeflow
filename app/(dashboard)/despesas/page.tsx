import { createClient } from '@/lib/supabase/server'
import { ExpensesList } from '@/components/expenses/expenses-list'
import { AddExpenseDialog } from '@/components/expenses/add-expense-dialog'

export const metadata = {
  title: 'Despesas | FinanceFlow',
  description: 'Gerencie suas despesas',
}

async function getExpensesData() {
  const supabase = await createClient()

  const [{ data: expenses }, { data: categories }] = await Promise.all([
    supabase
      .from('expenses')
      .select('*, category:categories(*)')
      .order('date', { ascending: false }),
    supabase.from('categories').select('*').eq('type', 'expense'),
  ])

  return { expenses: expenses || [], categories: categories || [] }
}

export default async function DespesasPage() {
  const { expenses, categories } = await getExpensesData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Despesas</h1>
          <p className="text-muted-foreground">Gerencie seus gastos</p>
        </div>
        <AddExpenseDialog categories={categories} />
      </div>

      <ExpensesList expenses={expenses} categories={categories} />
    </div>
  )
}
