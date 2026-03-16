'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import type { Goal } from '@/lib/types'
import { Target, Plus } from 'lucide-react'
import { Empty } from '@/components/ui/empty'

interface GoalsProgressProps {
  goals: Goal[]
}

export function GoalsProgress({ goals }: GoalsProgressProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Metas Financeiras</CardTitle>
        <Button asChild variant="ghost" size="sm" className="h-8 text-emerald-500 hover:text-emerald-400">
          <Link href="/metas">
            <Plus className="w-4 h-4 mr-1" />
            Nova Meta
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <Empty
            icon={Target}
            title="Sem metas"
            description="Crie suas primeiras metas financeiras"
            className="py-8"
          />
        ) : (
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal) => {
              const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100
              const progressCapped = Math.min(progress, 100)
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{goal.name}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(Number(goal.current_amount))} / {formatCurrency(Number(goal.target_amount))}
                    </span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all"
                      style={{
                        width: `${progressCapped}%`,
                        backgroundColor: goal.color || '#22c55e',
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">{progress.toFixed(0)}% concluído</p>
                </div>
              )
            })}
            {goals.length > 3 && (
              <Button asChild variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                <Link href="/metas">Ver todas as {goals.length} metas</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
