'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import type { Income } from '@/lib/types'
import { Search, Trash2, TrendingUp } from 'lucide-react'
import { Empty } from '@/components/ui/empty'

interface IncomesListProps {
  incomes: Income[]
}

export function IncomesList({ incomes }: IncomesListProps) {
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const filteredIncomes = incomes.filter((income) =>
    income.source.toLowerCase().includes(search.toLowerCase()) ||
    income.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    const supabase = createClient()
    await supabase.from('incomes').delete().eq('id', deleteId)

    setDeleteId(null)
    setDeleting(false)
    router.refresh()
  }

  const totalFiltered = filteredIncomes.reduce((sum, i) => sum + Number(i.amount), 0)

  return (
    <>
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar receitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
        <span className="text-muted-foreground">
          {filteredIncomes.length} receita{filteredIncomes.length !== 1 ? 's' : ''}
        </span>
        <span className="font-semibold text-emerald-500">Total: {formatCurrency(totalFiltered)}</span>
      </div>

      {filteredIncomes.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-8">
            <Empty
              icon={TrendingUp}
              title="Nenhuma receita encontrada"
              description={search ? 'Tente alterar a busca' : 'Adicione sua primeira receita'}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredIncomes.map((income) => (
            <Card key={income.id} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{income.source}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(income.date)}
                    {income.description && ` • ${income.description}`}
                  </p>
                </div>
                <p className="font-semibold text-emerald-500 shrink-0">
                  +{formatCurrency(Number(income.amount))}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-red-500"
                  onClick={() => setDeleteId(income.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir receita?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A receita será removida permanentemente.
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
