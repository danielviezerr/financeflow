import { createClient } from '@/lib/supabase/server'
import { IncomesList } from '@/components/income/incomes-list'
import { AddIncomeDialog } from '@/components/income/add-income-dialog'

export const metadata = {
  title: 'Receitas | FinanceFlow',
  description: 'Gerencie suas receitas',
}

async function getIncomesData() {
  const supabase = await createClient()

  const { data: incomes } = await supabase
    .from('incomes')
    .select('*')
    .order('date', { ascending: false })

  return { incomes: incomes || [] }
}

export default async function ReceitasPage() {
  const { incomes } = await getIncomesData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Receitas</h1>
          <p className="text-muted-foreground">Gerencie suas fontes de renda</p>
        </div>
        <AddIncomeDialog />
      </div>

      <IncomesList incomes={incomes} />
    </div>
  )
}
