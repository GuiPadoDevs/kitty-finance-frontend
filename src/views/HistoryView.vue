<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import type { FinancialCycle } from '@/types'
import { History as HistoryIcon, Calendar, ArrowRight } from 'lucide-vue-next'
import HKCard from '@/components/common/HKCard.vue'
import HKBadge from '@/components/common/HKBadge.vue'
import HKBow from '@/components/common/HKBow.vue'

const router = useRouter()
const financeStore = useFinanceStore()

onMounted(() => {
  financeStore.fetchCycles()
})

function viewCycleInDashboard(cycle: FinancialCycle) {
  financeStore.selectedCycleId = cycle.id
  router.push('/dashboard')
}
</script>

<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto pb-safe">
    
    <!-- Top Bar -->
    <div class="flex items-center gap-2.5 pt-2">
      <HKBow :size="28" animated />
      <div>
        <h1 class="text-xl font-extrabold text-hk-text tracking-tight">Histórico de Ciclos 📅</h1>
        <p class="text-xs text-hk-muted">Consulte todos os seus meses anteriores</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="financeStore.isLoading && financeStore.cycles.length === 0" class="py-16 text-center text-hk-muted">
      <span class="inline-block w-8 h-8 border-3 border-hk-pink-primary border-t-transparent rounded-full animate-spin mb-2"></span>
      <p class="text-xs font-bold">Carregando histórico financeiro...</p>
    </div>

    <!-- Empty State -->
    <HKCard v-else-if="financeStore.cycles.length === 0" class="text-center py-12">
      <HistoryIcon class="w-10 h-10 text-hk-pink-primary mx-auto mb-3 opacity-60" />
      <h3 class="font-bold text-sm text-hk-text">Nenhum ciclo registrado ainda</h3>
    </HKCard>

    <!-- Lista de Ciclos -->
    <div v-else class="space-y-3">
      <div
        v-for="cycle in financeStore.cycles"
        :key="cycle.id"
        class="bg-white border border-pink-100 rounded-3xl p-4 shadow-hk-sm hover:shadow-hk-md transition-all space-y-3"
      >
        <!-- Header do Card -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">{{ cycle.status === 'OPEN' ? '🌸' : '🔒' }}</span>
            <h3 class="font-extrabold text-sm text-hk-text">{{ cycle.name }}</h3>
          </div>
          <HKBadge :type="cycle.status === 'OPEN' ? 'pink' : 'neutral'" dot>
            {{ cycle.status === 'OPEN' ? 'Em Aberto' : 'Finalizado' }}
          </HKBadge>
        </div>

        <!-- Intervalo de Datas -->
        <div class="flex items-center gap-1.5 text-xs text-hk-muted">
          <Calendar class="w-3.5 h-3.5 text-hk-pink-primary" />
          <span>Início: {{ cycle.start_date }}</span>
          <span v-if="cycle.end_date">• Encerramento: {{ cycle.end_date }}</span>
        </div>

        <!-- Mini Totais -->
        <div class="grid grid-cols-3 gap-2 p-2.5 bg-pink-50/50 rounded-2xl text-center text-xs">
          <div>
            <span class="text-[10px] font-bold text-emerald-700 block">Entradas</span>
            <span class="font-bold text-emerald-900 text-xs">
              R$ {{ cycle.total_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>

          <div>
            <span class="text-[10px] font-bold text-rose-700 block">Saídas</span>
            <span class="font-bold text-rose-900 text-xs">
              R$ {{ cycle.total_expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>

          <div>
            <span class="text-[10px] font-bold text-hk-pink-dark block">Saldo Final</span>
            <span class="font-extrabold text-hk-text text-xs">
              R$ {{ cycle.final_balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>
        </div>

        <!-- Observações (se houver) -->
        <div v-if="cycle.notes" class="p-2 bg-pink-50/30 rounded-xl text-[11px] text-hk-muted italic">
          "{{ cycle.notes }}"
        </div>

        <!-- Ação -->
        <div class="pt-1 flex justify-end">
          <button
            type="button"
            @click="viewCycleInDashboard(cycle)"
            class="text-xs font-bold text-hk-pink-dark hover:underline flex items-center gap-1"
          >
            Visualizar Relatório Completo <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
