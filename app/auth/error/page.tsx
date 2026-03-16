import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
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
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Erro de autenticação</CardTitle>
            <CardDescription className="text-base">
              Ocorreu um erro durante a autenticação. Por favor, tente novamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              <Link href="/auth/login">Voltar para o login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
