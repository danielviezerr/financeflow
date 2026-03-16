'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/format'
import { Empty } from '@/components/ui/empty'

interface ExpenseChartProps {
  data: { name: string; value: number; fill: string }[]
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Empty
            title="Sem despesas"
            description="Você ainda não tem despesas registradas este mês"
            className="py-8"
          />
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload
                      const percent = ((item.value / total) * 100).toFixed(1)
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.value)} ({percent}%)
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
