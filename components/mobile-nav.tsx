'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Calendar,
  Menu,
  LogOut,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Despesas', href: '/despesas', icon: TrendingDown },
  { name: 'Receitas', href: '/receitas', icon: TrendingUp },
  { name: 'Investimentos', href: '/investimentos', icon: PiggyBank },
  { name: 'Metas', href: '/metas', icon: Target },
  { name: 'Mensal', href: '/mensal', icon: Calendar },
]

interface MobileNavProps {
  user: User
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">FinanceFlow</span>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{userName}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <nav className="flex-1 p-3 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      <item.icon className={cn('w-5 h-5', isActive && 'text-emerald-500')} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="p-3 border-t border-border space-y-1">
                <Link
                  href="/configuracoes"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <Settings className="w-5 h-5" />
                  Configurações
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
