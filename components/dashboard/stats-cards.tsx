'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import type { DashboardStats } from '@/lib/types'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Saldo Total',
      value: stats.totalBalance,
      icon: Wallet,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Receitas do Mês',
      value: stats.totalIncome,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Despesas do Mês',
      value: stats.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Investimentos',
      value: stats.totalInvestments,
      icon: PiggyBank,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(card.value)}</p>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            {card.title === 'Saldo Total' && stats.monthlyChange !== 0 && (
              <div className="flex items-center gap-1 mt-3 text-sm">
                {stats.monthlyChange > 0 ? (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500">+{stats.monthlyChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">{stats.monthlyChange.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-muted-foreground">vs. mês anterior</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
