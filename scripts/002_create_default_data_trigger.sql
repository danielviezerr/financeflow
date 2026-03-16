-- Create trigger to add default categories and account for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default expense categories
  INSERT INTO categories (user_id, name, icon, color, type) VALUES
    (NEW.id, 'Alimentação', 'utensils', '#ef4444', 'expense'),
    (NEW.id, 'Transporte', 'car', '#f97316', 'expense'),
    (NEW.id, 'Moradia', 'home', '#eab308', 'expense'),
    (NEW.id, 'Saúde', 'heart', '#22c55e', 'expense'),
    (NEW.id, 'Educação', 'graduation-cap', '#3b82f6', 'expense'),
    (NEW.id, 'Lazer', 'gamepad-2', '#8b5cf6', 'expense'),
    (NEW.id, 'Compras', 'shopping-bag', '#ec4899', 'expense'),
    (NEW.id, 'Contas', 'receipt', '#64748b', 'expense'),
    (NEW.id, 'Investimentos', 'trending-up', '#14b8a6', 'expense'),
    (NEW.id, 'Outros', 'more-horizontal', '#6b7280', 'expense');

  -- Insert default income categories
  INSERT INTO categories (user_id, name, icon, color, type) VALUES
    (NEW.id, 'Salário', 'briefcase', '#22c55e', 'income'),
    (NEW.id, 'Freelance', 'laptop', '#3b82f6', 'income'),
    (NEW.id, 'Investimentos', 'trending-up', '#14b8a6', 'income'),
    (NEW.id, 'Vendas', 'store', '#f97316', 'income'),
    (NEW.id, 'Outros', 'more-horizontal', '#6b7280', 'income');

  -- Insert default account
  INSERT INTO accounts (user_id, name, type, balance, currency, icon, color) VALUES
    (NEW.id, 'Conta Principal', 'checking', 0, 'BRL', 'wallet', '#3b82f6');

  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
