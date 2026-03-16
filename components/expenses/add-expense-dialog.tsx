'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import type { Category } from '@/lib/types'
import { Plus } from 'lucide-react'

interface AddExpenseDialogProps {
  categories: Category[]
}

export function AddExpenseDialog({ categories }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    await supabase.from('expenses').insert({
      user_id: user.id,
      amount: parseFloat(amount.replace(',', '.')),
      description: description || null,
      category_id: categoryId || null,
      date,
      payment_method: paymentMethod || null,
    })

    setOpen(false)
    setAmount('')
    setDescription('')
    setCategoryId('')
    setDate(new Date().toISOString().split('T')[0])
    setPaymentMethod('')
    setLoading(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Despesa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Despesa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="amount">Valor *</FieldLabel>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="category">Categoria</FieldLabel>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color || '#6b7280' }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <Textarea
              id="description"
              placeholder="Descrição da despesa"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="date">Data *</FieldLabel>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="payment">Forma de pagamento</FieldLabel>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="debito">Cartão de Débito</SelectItem>
                <SelectItem value="credito">Cartão de Crédito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading}>
              {loading ? <Spinner className="w-4 h-4" /> : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
