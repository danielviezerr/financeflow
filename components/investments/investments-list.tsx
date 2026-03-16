'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { formatCurrency, formatDate } from '@/lib/format'
import type { Investment } from '@/lib/types'
import { Trash2, PiggyBank, TrendingUp, TrendingDown } from 'lucide-react'
import { Empty } from '@/components/ui/empty'

interface InvestmentsListProps {
  investments: Investment[]
}

const investmentTypeColors: Record<string, string> = {
  'Ações': '#3b82f6',
  'Fundos': '#8b5cf6',
  'Renda Fixa': '#22c55e',
  'Tesouro Direto': '#f97316',
  'Criptomoedas': '#eab308',
  'FIIs': '#ec4899',
  'Poupança': '#6b7280',
  'Outros': '#6b7280',
}

export function InvestmentsList({ investments }: InvestmentsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    const supabase = createClient()
    await supabase.from('investments').delete().eq('id', deleteId)

    setDeleteId(null)
    setDeleting(false)
    router.refresh()
  }

  if (investments.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8">
          <Empty
            icon={PiggyBank}
            title="Nenhum investimento"
            description="Adicione seu primeiro investimento para começar a acompanhar"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {investments.map((investment) => {
          const currentValue = Number(investment.current_value || investment.amount_invested)
          const invested = Number(investment.amount_invested)
          const returnValue = currentValue - invested
          const returnPercent = invested > 0 ? (returnValue / invested) * 100 : 0
          const isPositive = returnValue >= 0
          const color = investmentTypeColors[investment.type] || '#6b7280'

          return (
            <Card key={investment.id} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                  style={{ backgroundColor: color + '20' }}
                >
                  <PiggyBank className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{investment.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {investment.type} • {formatDate(investment.purchase_date)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-foreground">
                    {formatCurrency(currentValue)}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-sm">
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={isPositive ? 'text-emerald-500' : 'text-red-500'}>
                      {isPositive ? '+' : ''}{returnPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-red-500"
                  onClick={() => setDeleteId(investment.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir investimento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O investimento será removido permanentemente.
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
