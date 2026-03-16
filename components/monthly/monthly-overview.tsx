'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import { TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthlyOverviewProps {
  totalIncomes: number
  totalExpenses: number
  balance: number
  year: number
  month: number
}

export function MonthlyOverview({
  totalIncomes,
  totalExpenses,
  balance,
  year,
  month,
}: MonthlyOverviewProps) {
  const router = useRouter()

  const goToPreviousMonth = () => {
    const newDate = new Date(year, month - 1, 1)
    router.push(`/mensal?year=${newDate.getFullYear()}&month=${newDate.getMonth()}`)
  }

  const goToNextMonth = () => {
    const newDate = new Date(year, month + 1, 1)
    router.push(`/mensal?year=${newDate.getFullYear()}&month=${newDate.getMonth()}`)
  }

  const isCurrentMonth = () => {
    const now = new Date()
    return year === now.getFullYear() && month === now.getMonth()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(year, month))}
        </h2>
        <Button variant="outline" size="icon" onClick={goToNextMonth} disabled={isCurrentMonth()}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Receitas</p>
                <p className="text-2xl font-bold text-emerald-500">{formatCurrency(totalIncomes)}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Despesas</p>
                <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Saldo do Mês</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                </p>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                balance >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
              }`}>
                <Wallet className={`w-5 h-5 ${balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
