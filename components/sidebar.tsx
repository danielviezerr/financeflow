'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Despesas', href: '/despesas', icon: TrendingDown },
  { name: 'Receitas', href: '/receitas', icon: TrendingUp },
  { name: 'Investimentos', href: '/investimentos', icon: PiggyBank },
  { name: 'Metas', href: '/metas', icon: Target },
  { name: 'Mensal', href: '/mensal', icon: Calendar },
]

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
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
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-card border-r border-border">
        <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">FinanceFlow</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
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

        <div className="p-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium">
                  {userInitials}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/configuracoes" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}
