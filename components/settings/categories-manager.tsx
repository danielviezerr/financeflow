'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import type { Category } from '@/lib/types'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

const categoryColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
]

interface CategoriesManagerProps {
  categories: Category[]
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [color, setColor] = useState('#22c55e')
  const router = useRouter()

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    await supabase.from('categories').insert({
      user_id: user.id,
      name,
      type,
      color,
    })

    setOpen(false)
    setName('')
    setType('expense')
    setColor('#22c55e')
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', deleteId)

    setDeleteId(null)
    setDeleting(false)
    router.refresh()
  }

  const CategoryList = ({ items, title, icon: Icon }: { items: Category[]; title: string; icon: typeof TrendingUp }) => (
    <div>
      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {title}
      </h4>
      <div className="space-y-2">
        {items.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color || '#6b7280' }}
              />
              <span className="text-foreground">{category.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-500"
              onClick={() => setDeleteId(category.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Categoria</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="categoryName">Nome</FieldLabel>
                  <Input
                    id="categoryName"
                    type="text"
                    placeholder="Nome da categoria"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="categoryType">Tipo</FieldLabel>
                  <Select value={type} onValueChange={(v) => setType(v as 'expense' | 'income')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Despesa</SelectItem>
                      <SelectItem value="income">Receita</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Cor</FieldLabel>
                  <div className="flex gap-2">
                    {categoryColors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full transition-all ${
                          color === c ? 'ring-2 ring-offset-2 ring-offset-background' : ''
                        }`}
                        style={{ backgroundColor: c, ringColor: c }}
                      />
                    ))}
                  </div>
                </Field>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading || !name}>
                    {loading ? <Spinner className="w-4 h-4" /> : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <CategoryList items={expenseCategories} title="Despesas" icon={TrendingDown} />
          <CategoryList items={incomeCategories} title="Receitas" icon={TrendingUp} />
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Transações existentes com esta categoria serão mantidas, mas ficarão sem categoria.
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
