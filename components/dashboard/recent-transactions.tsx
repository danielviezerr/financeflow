'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateShort } from '@/lib/format'
import type { Category } from '@/lib/types'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { Empty } from '@/components/ui/empty'

interface Transaction {
  id: string
  amount: number
  date: string
  type: 'expense' | 'income'
  description?: string | null
  source?: string
  category?: Category
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
        <Button asChild variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
          <Link href="/despesas">
            Ver todas
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <Empty
            title="Sem transações"
            description="Suas transações recentes aparecerão aqui"
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={`${transaction.type}-${transaction.id}`}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{
                    backgroundColor: transaction.type === 'expense'
                      ? (transaction.category?.color || '#ef4444') + '20'
                      : '#22c55520',
                  }}
                >
                  {transaction.type === 'expense' ? (
                    <TrendingDown
                      className="w-5 h-5"
                      style={{ color: transaction.category?.color || '#ef4444' }}
                    />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {transaction.type === 'expense'
                      ? transaction.description || transaction.category?.name || 'Despesa'
                      : transaction.source || 'Receita'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.type === 'expense' && transaction.category?.name
                      ? `${transaction.category.name} • `
                      : ''}
                    {formatDateShort(transaction.date)}
                  </p>
                </div>
                <p className={`font-semibold ${transaction.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(Number(transaction.amount))}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
