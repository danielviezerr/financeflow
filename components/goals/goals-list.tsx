'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Goal } from '@/lib/types'
import { Target, Trash2, Plus, CalendarDays } from 'lucide-react'
import { Empty } from '@/components/ui/empty'

interface GoalsListProps {
  goals: Goal[]
}

export function GoalsList({ goals }: GoalsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [addAmountId, setAddAmountId] = useState<string | null>(null)
  const [addAmount, setAddAmount] = useState('')
  const [adding, setAdding] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    const supabase = createClient()
    await supabase.from('goals').delete().eq('id', deleteId)

    setDeleteId(null)
    setDeleting(false)
    router.refresh()
  }

  const handleAddAmount = async () => {
    if (!addAmountId || !addAmount) return
    setAdding(true)

    const goal = goals.find(g => g.id === addAmountId)
    if (!goal) return

    const newAmount = Number(goal.current_amount) + parseFloat(addAmount.replace(',', '.'))

    const supabase = createClient()
    await supabase
      .from('goals')
      .update({ current_amount: newAmount })
      .eq('id', addAmountId)

    setAddAmountId(null)
    setAddAmount('')
    setAdding(false)
    router.refresh()
  }

  if (goals.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8">
          <Empty
            icon={Target}
            title="Nenhuma meta criada"
            description="Crie sua primeira meta financeira e comece a poupar"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100
          const progressCapped = Math.min(progress, 100)
          const remaining = Number(goal.target_amount) - Number(goal.current_amount)
          const isComplete = progress >= 100
          const color = goal.color || '#22c55e'

          return (
            <Card key={goal.id} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{ backgroundColor: color + '20' }}
                  >
                    <Target className="w-5 h-5" style={{ color }} />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-500 -mr-2 -mt-2"
                    onClick={() => setDeleteId(goal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="font-semibold text-foreground mb-1">{goal.name}</h3>
                {goal.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{goal.description}</p>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium" style={{ color }}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>

                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all"
                      style={{ width: `${progressCapped}%`, backgroundColor: color }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">
                      {formatCurrency(Number(goal.current_amount))}
                    </span>
                    <span className="text-muted-foreground">
                      de {formatCurrency(Number(goal.target_amount))}
                    </span>
                  </div>

                  {goal.deadline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <span>Meta: {formatDate(goal.deadline)}</span>
                    </div>
                  )}

                  {!isComplete && (
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Faltam {formatCurrency(remaining > 0 ? remaining : 0)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setAddAmountId(goal.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar valor
                      </Button>
                    </div>
                  )}

                  {isComplete && (
                    <div className="pt-2 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500">
                        Meta atingida!
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!addAmountId} onOpenChange={() => setAddAmountId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar valor à meta</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddAmount() }} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="addAmount">Valor a adicionar</FieldLabel>
              <Input
                id="addAmount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                required
              />
            </Field>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setAddAmountId(null)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={adding || !addAmount}>
                {adding ? <Spinner className="w-4 h-4" /> : 'Adicionar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir meta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A meta será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
