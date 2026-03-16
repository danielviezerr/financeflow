import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  PiggyBank,
  Target,
  BarChart3,
  Shield,
  Smartphone,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Controle de Receitas e Despesas',
    description: 'Registre e categorize todas as suas transações de forma simples e intuitiva.',
  },
  {
    icon: PiggyBank,
    title: 'Acompanhamento de Investimentos',
    description: 'Monitore sua carteira de investimentos e acompanhe a rentabilidade em tempo real.',
  },
  {
    icon: Target,
    title: 'Metas Financeiras',
    description: 'Defina objetivos e acompanhe seu progresso até alcançar suas metas.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios e Gráficos',
    description: 'Visualize seus dados financeiros através de gráficos e relatórios detalhados.',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Seus dados estão protegidos com criptografia e autenticação segura.',
  },
  {
    icon: Smartphone,
    title: 'Acesse de Qualquer Lugar',
    description: 'Interface responsiva que funciona perfeitamente em desktop e dispositivos móveis.',
  },
]

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">FinanceFlow</span>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link href="/auth/sign-up">Criar conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Controle suas finanças de forma{' '}
              <span className="text-emerald-500">simples e inteligente</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Organize suas despesas, acompanhe seus investimentos, defina metas e tenha uma visão
              completa da sua vida financeira em um único lugar.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 h-12">
                <Link href="/auth/sign-up">
                  Começar agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 h-12">
                <Link href="/auth/login">Já tenho uma conta</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Tudo que você precisa para organizar suas finanças
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Funcionalidades pensadas para simplificar sua vida financeira
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl bg-background border border-border hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 mb-4">
                    <feature.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Pronto para transformar sua vida financeira?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Crie sua conta gratuita e comece a organizar suas finanças hoje mesmo.
            </p>
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-10 h-12">
              <Link href="/auth/sign-up">
                Criar conta gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">FinanceFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FinanceFlow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
