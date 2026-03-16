'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/auth/sign-up-success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">FinanceFlow</span>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Criar sua conta</CardTitle>
            <CardDescription>Comece a controlar suas finanças hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </Field>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading}>
                {loading ? <Spinner className="w-4 h-4" /> : 'Criar conta'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link href="/auth/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
