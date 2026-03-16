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
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Plus } from 'lucide-react'

const goalColors = [
  { name: 'Verde', value: '#22c55e' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' },
]

export function AddGoalDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#22c55e')
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

    await supabase.from('goals').insert({
      user_id: user.id,
      name,
      target_amount: parseFloat(targetAmount.replace(',', '.')),
      current_amount: currentAmount ? parseFloat(currentAmount.replace(',', '.')) : 0,
      deadline: deadline || null,
      description: description || null,
      color,
    })

    setOpen(false)
    setName('')
    setTargetAmount('')
    setCurrentAmount('')
    setDeadline('')
    setDescription('')
    setColor('#22c55e')
    setLoading(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Meta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Nome da meta *</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Viagem para a Europa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="targetAmount">Valor alvo *</FieldLabel>
              <Input
                id="targetAmount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="currentAmount">Valor inicial</FieldLabel>
              <Input
                id="currentAmount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="deadline">Data limite</FieldLabel>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <Textarea
              id="description"
              placeholder="Descreva sua meta"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </Field>

          <Field>
            <FieldLabel>Cor</FieldLabel>
            <div className="flex gap-2">
              {goalColors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c.value ? 'ring-2 ring-offset-2 ring-offset-background' : ''
                  }`}
                  style={{ backgroundColor: c.value, ringColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </Field>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading || !name || !targetAmount}>
              {loading ? <Spinner className="w-4 h-4" /> : 'Criar Meta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
