export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface UserSettings {
  user_id: string
  salary_day: number
  auto_carry_over: boolean
  currency_symbol: string
  created_at: string
  updated_at: string
}

export interface FinancialCycle {
  id: string
  user_id: string
  name: string
  start_date: string
  end_date?: string
  status: 'OPEN' | 'CLOSED'
  opening_balance: number
  total_income: number
  total_expense: number
  final_balance: number
  closed_at?: string
  notes?: string
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
  budget_limit: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  cycle_id: string
  category_id: string
  category_name?: string
  category_icon?: string
  category_color?: string
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
  payment_method: string
  notes?: string
  created_at: string
}

export interface CategoryBreakdown {
  category_id: string
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
  budget_limit: number
  total_amount: number
  percentage_of_total: number
  budget_exceeded: boolean
  budget_usage_percent: number
  transaction_count: number
}

export interface DashboardSummary {
  cycle: FinancialCycle
  opening_balance: number
  total_income: number
  total_expense: number
  current_balance: number
  savings_rate: number
  income_breakdown: CategoryBreakdown[]
  expense_breakdown: CategoryBreakdown[]
  recent_transactions: Transaction[]
}

export interface AuthResponse {
  token: string
  user: User
  settings: UserSettings
  current_cycle?: FinancialCycle
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
