<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'
import {
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Lock,
  ArrowRight,
  AlertTriangle,
  History,
} from 'lucide-vue-next'
import HKCard from '@/components/common/HKCard.vue'
import HKButton from '@/components/common/HKButton.vue'
import HKBadge from '@/components/common/HKBadge.vue'
import HKBow from '@/components/common/HKBow.vue'
import HKKittyFace from '@/components/common/HKKittyFace.vue'
import HKCategoryIcon from '@/components/common/HKCategoryIcon.vue'
import HKExpenseChart from '@/components/finance/HKExpenseChart.vue'
import HKCloseCycleModal from '@/components/finance/HKCloseCycleModal.vue'
import HKInstallPrompt from '@/components/common/HKInstallPrompt.vue'

const authStore = useAuthStore()
const financeStore = useFinanceStore()

const isCloseCycleModalOpen = ref(false)

const summary = computed(() => financeStore.dashboardSummary)
const user = computed(() => authStore.user)
const isCycleOpen = computed(() => summary.value?.cycle?.status === 'OPEN')

onMounted(async () => {
  await Promise.all([
    financeStore.fetchDashboardSummary(),
    financeStore.fetchCycles(),
    financeStore.fetchCategories(),
  ])
})

function handleCycleChange(e: Event) {
  const select = e.target as HTMLSelectElement
  const cycleId = select.value
  financeStore.selectedCycleId = cycleId || null
  financeStore.fetchDashboardSummary(cycleId || undefined)
}

function formatMoney(val?: number) {
  if (val === undefined || val === null) val = 0
  if (financeStore.isBalanceHidden) {
    return '•••••'
  }
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto pb-safe">
    
    <!-- PWA Install Banner -->
    <HKInstallPrompt />

    <!-- Top Bar: Saudação & Seletor de Ciclo -->
    <div class="flex items-center justify-between pt-1">
      <div class="flex items-center gap-2.5">
        <router-link
          to="/settings"
          class="w-11 h-11 bg-white rounded-2xl border-2 border-pink-200 shadow-sm flex items-center justify-center relative hover:scale-105 transition-transform cursor-pointer"
          title="Minha Conta & Ajustes ⚙️"
        >
          <HKKittyFace :size="32" />
          <div class="absolute -top-1 -right-1">
            <HKBow :size="14" />
          </div>
        </router-link>
        <div>
          <h2 class="text-base font-extrabold text-hk-text tracking-tight flex items-center gap-1">
            Oii, {{ user?.name || 'Sah' }}! 🌸
          </h2>
          <p class="text-[11px] text-hk-muted">Organizador Financeiro Hello Kitty</p>
        </div>
      </div>

      <!-- Seletor de Ciclo / Mês -->
      <div class="relative">
        <select
          :value="financeStore.selectedCycleId || summary?.cycle?.id"
          @change="handleCycleChange"
          class="appearance-none bg-white border border-pink-200 rounded-2xl pl-3 pr-7 py-1.5 text-xs font-bold text-hk-pink-dark shadow-hk-sm focus:outline-none cursor-pointer"
        >
          <option
            v-for="c in (financeStore.cycles || [])"
            :key="c.id"
            :value="c.id"
          >
            {{ c.status === 'OPEN' ? '🎀 ' : '🔒 ' }} {{ c.name }}
          </option>
        </select>
        <span class="absolute right-2.5 top-2.5 pointer-events-none text-hk-pink-primary text-[10px]">▼</span>
      </div>
    </div>

    <!-- Status do Ciclo Selecionado -->
    <div v-if="summary?.cycle" class="flex items-center justify-between px-1 text-xs">
      <div class="flex items-center gap-1.5 font-bold">
        <span class="text-hk-text">{{ summary.cycle.name }}</span>
        <HKBadge :type="isCycleOpen ? 'pink' : 'neutral'" dot>
          {{ isCycleOpen ? 'Mês em Aberto 🌸' : 'Mês Finalizado 🔒' }}
        </HKBadge>
      </div>

      <router-link to="/history" class="text-[11px] font-bold text-hk-pink-dark hover:underline flex items-center gap-0.5">
        <History class="w-3 h-3" />
        Ver Histórico
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="financeStore.isLoading && !summary" class="py-16 text-center text-hk-muted">
      <span class="inline-block w-8 h-8 border-3 border-hk-pink-primary border-t-transparent rounded-full animate-spin mb-2"></span>
      <p class="text-xs font-bold">Calculando suas finanças fofas...</p>
    </div>

    <template v-else-if="summary">
      
      <!-- Card Principal: Saldo Disponível -->
      <div class="relative overflow-hidden bg-gradient-to-br from-white via-pink-50/50 to-white rounded-3xl border-2 border-pink-200/90 p-5 shadow-hk-md">
        <div class="flex items-center justify-between text-xs text-hk-muted font-bold">
          <span class="flex items-center gap-1">
            <Sparkles class="w-3.5 h-3.5 text-hk-pink-primary" />
            Saldo Atual do Ciclo
          </span>

          <button
            type="button"
            @click="financeStore.toggleHideBalance()"
            class="p-1 text-hk-muted hover:text-hk-pink-dark transition-colors"
            title="Ocultar/Mostrar Saldo"
          >
            <EyeOff v-if="financeStore.isBalanceHidden" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>

        <!-- Valor do Saldo -->
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-lg font-extrabold text-hk-pink-primary">R$</span>
          <span class="text-3xl font-black text-hk-text tracking-tight">
            {{ formatMoney(summary.current_balance) }}
          </span>
        </div>

        <!-- Saldo Inicial Herdado (se houver) -->
        <div v-if="summary.opening_balance > 0" class="mt-1">
          <span class="text-[11px] font-bold text-hk-muted">
            + R$ {{ formatMoney(summary.opening_balance) }} transferido do ciclo anterior
          </span>
        </div>

        <!-- Cards Mini Lado a Lado: Entradas & Saídas -->
        <div class="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-pink-100">
          
          <!-- Entradas -->
          <div class="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <TrendingUp class="w-4 h-4" />
            </div>
            <div>
              <span class="text-[10px] font-bold text-emerald-700 block uppercase">Entradas</span>
              <span class="text-xs font-black text-emerald-900 block">
                R$ {{ formatMoney(summary.total_income) }}
              </span>
            </div>
          </div>

          <!-- Saídas -->
          <div class="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
              <TrendingDown class="w-4 h-4" />
            </div>
            <div>
              <span class="text-[10px] font-bold text-rose-700 block uppercase">Saídas</span>
              <span class="text-xs font-black text-rose-900 block">
                R$ {{ formatMoney(summary.total_expense) }}
              </span>
            </div>
          </div>

        </div>

        <!-- Taxa de Economia -->
        <div v-if="(summary.savings_rate || 0) > 0" class="mt-3 p-2.5 bg-pink-100/60 rounded-2xl flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5">
            <HKBow :size="16" />
            <span class="text-hk-text font-bold">Taxa de Economia:</span>
          </div>
          <span class="font-extrabold text-hk-pink-dark">
            {{ summary.savings_rate.toFixed(1) }}% guardado! 🌸
          </span>
        </div>
      </div>

      <!-- Gráfico de Distribuição de Despesas por Tópicos -->
      <HKCard>
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-extrabold text-sm text-hk-text flex items-center gap-1.5">
            <HKBow :size="18" />
            Divisão dos Gastos 🎀
          </h3>
          <span class="text-[11px] font-bold text-hk-muted">
            {{ (summary.expense_breakdown || []).filter(e => e.total_amount > 0).length }} tópicos ativos
          </span>
        </div>

        <HKExpenseChart
          :items="summary.expense_breakdown || []"
          :total-expense="summary.total_expense || 0"
        />
      </HKCard>

      <!-- Cards de Tópicos / Categorias com Limites & Porcentagens -->
      <div class="space-y-2.5">
        <div class="flex items-center justify-between px-1">
          <h3 class="font-extrabold text-sm text-hk-text">Gastos por Tópico 🌸</h3>
          <router-link to="/categories" class="text-xs font-bold text-hk-pink-dark hover:underline">
            Gerenciar Tópicos
          </router-link>
        </div>

        <div class="grid grid-cols-1 gap-2.5">
          <div
            v-for="cat in (summary.expense_breakdown || [])"
            :key="cat.category_id"
            class="bg-white border border-pink-100 rounded-2xl p-3.5 shadow-hk-sm space-y-2"
          >
            <div class="flex items-center justify-between">
              <!-- Ícone + Nome -->
              <div class="flex items-center gap-2.5">
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                  :style="{ backgroundColor: cat.color || '#FF85A2' }"
                >
                  <HKCategoryIcon :name="cat.icon" :size="18" />
                </div>
                <div>
                  <h4 class="font-bold text-xs text-hk-text">{{ cat.name }}</h4>
                  <span class="text-[10px] text-hk-muted">
                    {{ cat.transaction_count }} lançamento(s)
                  </span>
                </div>
              </div>

              <!-- Valor Gasto & % -->
              <div class="text-right">
                <span class="font-extrabold text-xs text-hk-text block">
                  R$ {{ formatMoney(cat.total_amount) }}
                </span>
                <span class="text-[10px] font-bold text-hk-pink-dark">
                  {{ (cat.percentage_of_total || 0).toFixed(0) }}% do total
                </span>
              </div>
            </div>

            <!-- Barra de Progresso do Tópico -->
            <div class="w-full bg-pink-100/60 h-2 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{
                  width: `${Math.min(cat.percentage_of_total || 0, 100)}%`,
                  backgroundColor: cat.color || '#FF85A2'
                }"
              ></div>
            </div>

            <!-- Alerta se estourou meta -->
            <div v-if="cat.budget_exceeded" class="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 p-1.5 rounded-xl">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0" />
              <span>Atenção: limite de R$ {{ formatMoney(cat.budget_limit) }} ultrapassado!</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Últimas Transações -->
      <HKCard>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-extrabold text-sm text-hk-text">Últimas Movimentações 📋</h3>
          <router-link to="/transactions" class="text-xs font-bold text-hk-pink-dark hover:underline flex items-center gap-0.5">
            Ver Extrato <ArrowRight class="w-3 h-3" />
          </router-link>
        </div>

        <div v-if="!summary.recent_transactions || summary.recent_transactions.length === 0" class="py-6 text-center text-xs text-hk-muted">
          Nenhuma transação registrada neste ciclo ainda ✨
        </div>

        <div v-else class="divide-y divide-pink-50">
          <div
            v-for="tx in (summary.recent_transactions || []).slice(0, 5)"
            :key="tx.id"
            class="py-2.5 flex items-center justify-between"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs shrink-0"
                :style="{ backgroundColor: tx.category_color || '#FF85A2' }"
              >
                <HKCategoryIcon :name="tx.category_icon || 'sparkles'" :size="16" />
              </div>
              <div>
                <p class="font-bold text-xs text-hk-text">{{ tx.title }}</p>
                <p class="text-[10px] text-hk-muted">{{ tx.category_name }} • {{ tx.payment_method }}</p>
              </div>
            </div>

            <div class="text-right">
              <span :class="['font-extrabold text-xs block', tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600']">
                {{ tx.type === 'income' ? '+' : '-' }} R$ {{ formatMoney(tx.amount) }}
              </span>
              <span class="text-[10px] text-hk-muted">{{ tx.date }}</span>
            </div>
          </div>
        </div>
      </HKCard>

      <!-- Botão de Ação: Fechar Mês / Finalizar Ciclo (Aparece apenas se o ciclo estiver aberto) -->
      <div v-if="isCycleOpen" class="pt-2">
        <HKButton
          variant="primary"
          block
          size="lg"
          @click="isCloseCycleModalOpen = true"
        >
          <Lock class="w-4 h-4 mr-1.5" />
          Finalizar Mês Atual 🌸
        </HKButton>
      </div>

    </template>

    <!-- Modal de Fechamento de Mês -->
    <HKCloseCycleModal
      v-model="isCloseCycleModalOpen"
      @closed="financeStore.fetchDashboardSummary()"
    />

  </div>
</template>
