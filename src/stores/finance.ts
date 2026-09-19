import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/api/client'
import type { Category, Transaction, DashboardSummary, FinancialCycle, APIResponse } from '@/types'

export const useFinanceStore = defineStore('finance', () => {
  const categories = ref<Category[]>([])
  const transactions = ref<Transaction[]>([])
  const cycles = ref<FinancialCycle[]>([])
  const selectedCycleId = ref<string | null>(null)
  const dashboardSummary = ref<DashboardSummary | null>(null)
  const isBalanceHidden = ref<boolean>(localStorage.getItem('financas_sah_hide_balance') === 'true')
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  function toggleHideBalance() {
    isBalanceHidden.value = !isBalanceHidden.value
    localStorage.setItem('financas_sah_hide_balance', String(isBalanceHidden.value))
  }

  // --- CICLOS FINANCEIROS ---

  async function fetchCycles() {
    isLoading.value = true
    try {
      const response = await apiClient.get<APIResponse<FinancialCycle[]>>('/cycles')
      if (response.data.success && response.data.data) {
        cycles.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao carregar histórico de ciclos'
    } finally {
      isLoading.value = false
    }
  }

  async function closeCycle(payload: {
    new_cycle_name: string
    new_start_date: string
    carry_over: boolean
    notes?: string
  }): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post<APIResponse<any>>('/cycles/close', payload)
      if (response.data.success) {
        selectedCycleId.value = null
        await fetchCycles()
        await fetchDashboardSummary()
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao finalizar ciclo'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // --- CATEGORIAS ---

  async function fetchCategories(type?: 'income' | 'expense') {
    isLoading.value = true
    error.value = null
    try {
      const url = type ? `/categories?type=${type}` : '/categories'
      const response = await apiClient.get<APIResponse<Category[]>>(url)
      if (response.data.success && response.data.data) {
        categories.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao carregar tópicos'
    } finally {
      isLoading.value = false
    }
  }

  async function createCategory(payload: {
    name: string
    type: 'income' | 'expense'
    icon: string
    color: string
    budget_limit: number
  }): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post<APIResponse<Category>>('/categories', payload)
      if (response.data.success && response.data.data) {
        categories.value.push(response.data.data)
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao criar tópico'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function updateCategory(id: string, payload: {
    name: string
    icon: string
    color: string
    budget_limit: number
  }): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.put<APIResponse<Category>>(`/categories/${id}`, payload)
      if (response.data.success && response.data.data) {
        const index = categories.value.findIndex(c => c.id === id)
        if (index !== -1) {
          categories.value[index] = response.data.data
        }
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao atualizar tópico'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function deleteCategory(id: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.delete<APIResponse<null>>(`/categories/${id}`)
      if (response.data.success) {
        categories.value = categories.value.filter(c => c.id !== id)
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao excluir tópico'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // --- TRANSAÇÕES ---

  async function fetchTransactions(filter?: { cycle_id?: string; category_id?: string; type?: string }) {
    isLoading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      const targetCycle = filter?.cycle_id || selectedCycleId.value
      if (targetCycle) params.append('cycle_id', targetCycle)
      if (filter?.category_id) params.append('category_id', filter.category_id)
      if (filter?.type) params.append('type', filter.type)

      const response = await apiClient.get<APIResponse<Transaction[]>>(`/transactions?${params.toString()}`)
      if (response.data.success && response.data.data) {
        transactions.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao buscar extrato'
    } finally {
      isLoading.value = false
    }
  }

  async function createTransaction(payload: {
    category_id: string
    title: string
    amount: number
    type: 'income' | 'expense'
    date: string
    payment_method: string
    notes?: string
  }): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post<APIResponse<Transaction>>('/transactions', {
        ...payload,
        cycle_id: selectedCycleId.value || undefined,
      })
      if (response.data.success && response.data.data) {
        transactions.value.unshift(response.data.data)
        await fetchDashboardSummary(selectedCycleId.value || undefined)
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao registrar lançamento'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTransaction(id: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.delete<APIResponse<null>>(`/transactions/${id}`)
      if (response.data.success) {
        transactions.value = transactions.value.filter(t => t.id !== id)
        await fetchDashboardSummary(selectedCycleId.value || undefined)
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao excluir lançamento'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // --- DASHBOARD ---

  async function fetchDashboardSummary(cycleId?: string) {
    isLoading.value = true
    error.value = null
    try {
      const targetId = cycleId || selectedCycleId.value
      const url = targetId ? `/dashboard/summary?cycle_id=${targetId}` : '/dashboard/summary'
      const response = await apiClient.get<APIResponse<DashboardSummary>>(url)
      if (response.data.success && response.data.data) {
        dashboardSummary.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao carregar dashboard'
    } finally {
      isLoading.value = false
    }
  }

  return {
    categories,
    transactions,
    cycles,
    selectedCycleId,
    dashboardSummary,
    isBalanceHidden,
    isLoading,
    error,
    toggleHideBalance,
    fetchCycles,
    closeCycle,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchTransactions,
    createTransaction,
    deleteTransaction,
    fetchDashboardSummary,
  }
})
