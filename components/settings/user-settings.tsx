'use client'

import type { User } from '@supabase/supabase-js'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'

interface UserSettingsProps {
  user: User
}

export function UserSettings({ user }: UserSettingsProps) {
  const userName = user.user_metadata?.full_name || ''

  return (
    <div className="space-y-4 max-w-md">
      <Field>
        <FieldLabel htmlFor="name">Nome</FieldLabel>
        <Input
          id="name"
          type="text"
          value={userName}
          disabled
          className="bg-muted/50"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          value={user.email || ''}
          disabled
          className="bg-muted/50"
        />
      </Field>

      <p className="text-sm text-muted-foreground">
        Membro desde {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(user.created_at))}
      </p>
    </div>
  )
}
