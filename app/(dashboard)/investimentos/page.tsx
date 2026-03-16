import { createClient } from '@/lib/supabase/server'
import { InvestmentsList } from '@/components/investments/investments-list'
import { AddInvestmentDialog } from '@/components/investments/add-investment-dialog'
import { InvestmentsSummary } from '@/components/investments/investments-summary'

export const metadata = {
  title: 'Investimentos | FinanceFlow',
  description: 'Gerencie seus investimentos',
}

async function getInvestmentsData() {
  const supabase = await createClient()

  const { data: investments } = await supabase
    .from('investments')
    .select('*')
    .order('purchase_date', { ascending: false })

  return { investments: investments || [] }
}

export default async function InvestimentosPage() {
  const { investments } = await getInvestmentsData()

  const totalInvested = investments.reduce((sum, i) => sum + Number(i.amount_invested), 0)
  const totalCurrentValue = investments.reduce((sum, i) => sum + Number(i.current_value || i.amount_invested), 0)
  const totalReturn = totalCurrentValue - totalInvested
  const returnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Investimentos</h1>
          <p className="text-muted-foreground">Acompanhe sua carteira</p>
        </div>
        <AddInvestmentDialog />
      </div>

      <InvestmentsSummary
        totalInvested={totalInvested}
        totalCurrentValue={totalCurrentValue}
        totalReturn={totalReturn}
        returnPercent={returnPercent}
      />

      <InvestmentsList investments={investments} />
    </div>
  )
}
