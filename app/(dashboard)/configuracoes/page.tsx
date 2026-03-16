import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserSettings } from '@/components/settings/user-settings'
import { CategoriesManager } from '@/components/settings/categories-manager'

export const metadata = {
  title: 'Configurações | FinanceFlow',
  description: 'Configurações da conta',
}

async function getSettingsData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('type')
    .order('name')

  return { user, categories: categories || [] }
}

export default async function ConfiguracoesPage() {
  const data = await getSettingsData()

  if (!data) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <UserSettings user={data.user} />
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>Gerencie suas categorias de despesas e receitas</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoriesManager categories={data.categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
