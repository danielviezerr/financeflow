import { createClient } from '@/lib/supabase/server'
import { GoalsList } from '@/components/goals/goals-list'
import { AddGoalDialog } from '@/components/goals/add-goal-dialog'

export const metadata = {
  title: 'Metas | FinanceFlow',
  description: 'Gerencie suas metas financeiras',
}

async function getGoalsData() {
  const supabase = await createClient()

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .order('deadline', { ascending: true })

  return { goals: goals || [] }
}

export default async function MetasPage() {
  const { goals } = await getGoalsData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Metas Financeiras</h1>
          <p className="text-muted-foreground">Defina e acompanhe seus objetivos</p>
        </div>
        <AddGoalDialog />
      </div>

      <GoalsList goals={goals} />
    </div>
  )
}
