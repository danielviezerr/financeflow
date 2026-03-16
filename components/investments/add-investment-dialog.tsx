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

const investmentTypes = [
  'Ações',
  'Fundos',
  'Renda Fixa',
  'Tesouro Direto',
  'Criptomoedas',
  'FIIs',
  'Poupança',
  'Outros',
]

export function AddInvestmentDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [amountInvested, setAmountInvested] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
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

    await supabase.from('investments').insert({
      user_id: user.id,
      name,
      type,
      amount_invested: parseFloat(amountInvested.replace(',', '.')),
      current_value: currentValue ? parseFloat(currentValue.replace(',', '.')) : null,
      purchase_date: purchaseDate,
      notes: notes || null,
    })

    setOpen(false)
    setName('')
    setType('')
    setAmountInvested('')
    setCurrentValue('')
    setPurchaseDate(new Date().toISOString().split('T')[0])
    setNotes('')
    setLoading(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Investimento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Investimento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Nome do ativo *</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Ex: PETR4, Tesouro Selic 2029"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="type">Tipo *</FieldLabel>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {investmentTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="amountInvested">Valor investido *</FieldLabel>
              <Input
                id="amountInvested"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amountInvested}
                onChange={(e) => setAmountInvested(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="currentValue">Valor atual</FieldLabel>
              <Input
                id="currentValue"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="purchaseDate">Data da compra *</FieldLabel>
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="notes">Observações</FieldLabel>
            <Textarea
              id="notes"
              placeholder="Notas sobre o investimento"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </Field>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading || !name || !type}>
              {loading ? <Spinner className="w-4 h-4" /> : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
