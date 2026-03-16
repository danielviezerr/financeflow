'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { Empty } from '@/components/ui/empty'
import { TrendingDown } from 'lucide-react'

interface CategoryData {
  name: string
  amount: number
  color: string
  percent: number
}

interface MonthlyCategoryBreakdownProps {
  data: CategoryData[]
  total: number
}

export function MonthlyCategoryBreakdown({ data, total }: MonthlyCategoryBreakdownProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Empty
            icon={TrendingDown}
            title="Sem despesas"
            description="Nenhuma despesa registrada neste mês"
            className="py-8"
          />
        ) : (
          <div className="space-y-4">
            {data.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-foreground">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-foreground">{formatCurrency(category.amount)}</span>
                    <span className="text-muted-foreground ml-2">({category.percent.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{
                      width: `${category.percent}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-red-500">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
