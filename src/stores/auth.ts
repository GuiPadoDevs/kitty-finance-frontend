import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/api/client'
import type { User, UserSettings, FinancialCycle, APIResponse, AuthResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('financas_sah_token'))
  const user = ref<User | null>(null)
  const settings = ref<UserSettings | null>(null)
  const currentCycle = ref<FinancialCycle | null>(null)
  const isLoading = ref<boolean>(false)
  const authError = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  // Login
  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    authError.value = null
    try {
      const response = await apiClient.post<APIResponse<AuthResponse>>('/auth/login', {
        email,
        password,
      })

      if (response.data.success && response.data.data) {
        const data = response.data.data
        token.value = data.token
        user.value = data.user
        settings.value = data.settings
        if (data.current_cycle) {
          currentCycle.value = data.current_cycle
        }
        localStorage.setItem('financas_sah_token', data.token)
        return true
      }
      authError.value = response.data.error || 'Falha ao autenticar'
      return false
    } catch (err: any) {
      authError.value = err.response?.data?.error || 'Erro ao conectar com o servidor'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Cadastro de nova conta
  async function register(name: string, email: string, password: string, salaryDay = 5): Promise<boolean> {
    isLoading.value = true
    authError.value = null
    try {
      const response = await apiClient.post<APIResponse<AuthResponse>>('/auth/register', {
        name,
        email,
        password,
        salary_day: salaryDay,
      })

      if (response.data.success && response.data.data) {
        const data = response.data.data
        token.value = data.token
        user.value = data.user
        settings.value = data.settings
        if (data.current_cycle) {
          currentCycle.value = data.current_cycle
        }
        localStorage.setItem('financas_sah_token', data.token)
        return true
      }
      authError.value = response.data.error || 'Falha ao cadastrar'
      return false
    } catch (err: any) {
      authError.value = err.response?.data?.error || 'Erro ao conectar com o servidor'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Carrega os dados do usuário autenticado
  async function fetchMe(): Promise<boolean> {
    if (!token.value) return false
    isLoading.value = true
    try {
      const response = await apiClient.get<APIResponse<AuthResponse>>('/auth/me')
      if (response.data.success && response.data.data) {
        const data = response.data.data
        user.value = data.user
        settings.value = data.settings
        if (data.current_cycle) {
          currentCycle.value = data.current_cycle
        }
        return true
      }
      return false
    } catch {
      logout()
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Atualiza configurações
  async function updateSettings(newSettings: Partial<UserSettings>): Promise<boolean> {
    try {
      const response = await apiClient.put<APIResponse<UserSettings>>('/auth/settings', newSettings)
      if (response.data.success && response.data.data) {
        settings.value = response.data.data
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // Logout
  function logout() {
    token.value = null
    user.value = null
    settings.value = null
    currentCycle.value = null
    localStorage.removeItem('financas_sah_token')
  }

  return {
    token,
    user,
    settings,
    currentCycle,
    isLoading,
    authError,
    isAuthenticated,
    login,
    register,
    fetchMe,
    updateSettings,
    logout,
  }
})
