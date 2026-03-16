'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import type { Expense, Category } from '@/lib/types'
import { Search, Trash2, TrendingDown } from 'lucide-react'
import { Empty } from '@/components/ui/empty'

interface ExpensesListProps {
  expenses: (Expense & { category: Category | null })[]
  categories: Category[]
}

export function ExpensesList({ expenses, categories }: ExpensesListProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description?.toLowerCase().includes(search.toLowerCase()) ||
      expense.category?.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || expense.category_id === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    const supabase = createClient()
    await supabase.from('expenses').delete().eq('id', deleteId)

    setDeleteId(null)
    setDeleting(false)
    router.refresh()
  }

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <>
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar despesas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
        <span className="text-muted-foreground">
          {filteredExpenses.length} despesa{filteredExpenses.length !== 1 ? 's' : ''}
        </span>
        <span className="font-semibold text-red-500">Total: {formatCurrency(totalFiltered)}</span>
      </div>

      {filteredExpenses.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-8">
            <Empty
              icon={TrendingDown}
              title="Nenhuma despesa encontrada"
              description={search || categoryFilter !== 'all' ? 'Tente alterar os filtros' : 'Adicione sua primeira despesa'}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                  style={{ backgroundColor: (expense.category?.color || '#ef4444') + '20' }}
                >
                  <TrendingDown
                    className="w-5 h-5"
                    style={{ color: expense.category?.color || '#ef4444' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {expense.description || expense.category?.name || 'Despesa'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category?.name || 'Sem categoria'} • {formatDate(expense.date)}
                    {expense.payment_method && ` • ${expense.payment_method}`}
                  </p>
                </div>
                <p className="font-semibold text-red-500 shrink-0">
                  -{formatCurrency(Number(expense.amount))}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-red-500"
                  onClick={() => setDeleteId(expense.id)}
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
            <AlertDialogTitle>Excluir despesa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A despesa será removida permanentemente.
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
