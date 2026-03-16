-- FinanceFlow Database Schema
-- Personal Finance Management App

-- Categories for expenses
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  payment_method TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Income table
CREATE TABLE IF NOT EXISTS incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  amount_invested DECIMAL(12, 2) NOT NULL,
  current_value DECIMAL(12, 2),
  purchase_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  deadline DATE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts table (bank accounts, wallets, etc.)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'investment', 'cash', 'other')),
  balance DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'BRL',
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Users can view own categories" ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for expenses
CREATE POLICY "Users can view own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for incomes
CREATE POLICY "Users can view own incomes" ON incomes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own incomes" ON incomes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own incomes" ON incomes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own incomes" ON incomes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for investments
CREATE POLICY "Users can view own investments" ON investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own investments" ON investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own investments" ON investments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own investments" ON investments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for goals
CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for accounts
CREATE POLICY "Users can view own accounts" ON accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts" ON accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts" ON accounts FOR DELETE USING (auth.uid() = user_id);
