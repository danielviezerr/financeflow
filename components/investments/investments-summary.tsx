'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'

interface InvestmentsSummaryProps {
  totalInvested: number
  totalCurrentValue: number
  totalReturn: number
  returnPercent: number
}

export function InvestmentsSummary({
  totalInvested,
  totalCurrentValue,
  totalReturn,
  returnPercent,
}: InvestmentsSummaryProps) {
  const isPositive = totalReturn >= 0

  const cards = [
    {
      title: 'Total Investido',
      value: formatCurrency(totalInvested),
      icon: Wallet,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Valor Atual',
      value: formatCurrency(totalCurrentValue),
      icon: PiggyBank,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      title: 'Rentabilidade',
      value: `${isPositive ? '+' : ''}${formatCurrency(totalReturn)}`,
      subtitle: `${isPositive ? '+' : ''}${returnPercent.toFixed(2)}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-emerald-500' : 'text-red-500',
      bgColor: isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className={`text-2xl font-bold ${card.title === 'Rentabilidade' ? card.color : 'text-foreground'}`}>
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className={`text-sm ${card.color}`}>{card.subtitle}</p>
                )}
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
