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
import { Plus } from 'lucide-react'

const incomeSources = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguel',
  'Vendas',
  'Bônus',
  'Outros',
]

export function AddIncomeDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
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

    await supabase.from('incomes').insert({
      user_id: user.id,
      amount: parseFloat(amount.replace(',', '.')),
      source,
      description: description || null,
      date,
    })

    setOpen(false)
    setAmount('')
    setSource('')
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
    setLoading(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Receita
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Receita</DialogTitle>
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
            <FieldLabel htmlFor="source">Fonte *</FieldLabel>
            <Select value={source} onValueChange={setSource} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a fonte" />
              </SelectTrigger>
              <SelectContent>
                {incomeSources.map((src) => (
                  <SelectItem key={src} value={src}>
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <Textarea
              id="description"
              placeholder="Descrição da receita"
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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading || !source}>
              {loading ? <Spinner className="w-4 h-4" /> : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
