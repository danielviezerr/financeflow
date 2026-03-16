export interface Category {
  id: string
  user_id: string
  name: string
  icon: string | null
  color: string | null
  type: 'expense' | 'income'
  created_at: string
}

export interface Expense {
  id: string
  user_id: string
  category_id: string | null
  amount: number
  description: string | null
  date: string
  payment_method: string | null
  is_recurring: boolean
  recurring_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
  tags: string[] | null
  created_at: string
  updated_at: string
  category?: Category
}

export interface Income {
  id: string
  user_id: string
  amount: number
  source: string
  description: string | null
  date: string
  is_recurring: boolean
  recurring_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
  created_at: string
  updated_at: string
}

export interface Investment {
  id: string
  user_id: string
  type: string
  name: string
  amount_invested: number
  current_value: number | null
  purchase_date: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  description: string | null
  icon: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'other'
  balance: number
  currency: string
  icon: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  totalInvestments: number
  monthlyChange: number
}
