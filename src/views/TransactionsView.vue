<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { Search, Trash2, Calendar, Sparkles } from 'lucide-vue-next'
import HKCard from '@/components/common/HKCard.vue'
import HKCategoryIcon from '@/components/common/HKCategoryIcon.vue'
import HKBow from '@/components/common/HKBow.vue'

const financeStore = useFinanceStore()

const activeTypeFilter = ref<string>('')
const searchQuery = ref('')
const isDeletingId = ref<string | null>(null)

onMounted(() => {
  financeStore.fetchTransactions()
  financeStore.fetchCategories()
})

const filteredTransactions = computed(() => {
  return financeStore.transactions.filter(t => {
    // Filtro por tipo
    if (activeTypeFilter.value && t.type !== activeTypeFilter.value) {
      return false
    }
    // Filtro por busca
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchTitle = t.title.toLowerCase().includes(q)
      const matchCat = t.category_name?.toLowerCase().includes(q)
      const matchNotes = t.notes?.toLowerCase().includes(q)
      return matchTitle || matchCat || matchNotes
    }
    return true
  })
})

async function handleDelete(id: string) {
  if (confirm('Deseja realmente excluir este lançamento? 🎀')) {
    isDeletingId.value = id
    await financeStore.deleteTransaction(id)
    isDeletingId.value = null
  }
}
</script>

<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto pb-safe">
    
    <!-- Top Bar -->
    <div class="flex items-center justify-between pt-2">
      <div class="flex items-center gap-2.5">
        <HKBow :size="28" animated />
        <div>
          <h1 class="text-xl font-extrabold text-hk-text tracking-tight">Extrato Detalhado 📋</h1>
          <p class="text-xs text-hk-muted">Todas as suas receitas e despesas</p>
        </div>
      </div>
    </div>

    <!-- Barra de Busca & Filtros -->
    <div class="space-y-2.5">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-hk-pink-primary">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nome, tópico ou nota..."
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-2xl text-xs text-hk-text focus:outline-none focus:ring-2 focus:ring-hk-pink-primary/40 shadow-hk-sm placeholder:text-pink-300"
        />
      </div>

      <!-- Filtros de Tipo -->
      <div class="grid grid-cols-3 gap-1.5 bg-pink-100/60 p-1.5 rounded-2xl text-xs font-bold">
        <button
          type="button"
          @click="activeTypeFilter = ''"
          :class="[
            'py-2 rounded-xl transition-all',
            activeTypeFilter === '' ? 'bg-white text-hk-pink-dark shadow-sm scale-100' : 'text-hk-muted hover:text-hk-text'
          ]"
        >
          Todos
        </button>

        <button
          type="button"
          @click="activeTypeFilter = 'expense'"
          :class="[
            'py-2 rounded-xl transition-all',
            activeTypeFilter === 'expense' ? 'bg-white text-rose-600 shadow-sm scale-100' : 'text-hk-muted hover:text-hk-text'
          ]"
        >
          Saídas 🎀
        </button>

        <button
          type="button"
          @click="activeTypeFilter = 'income'"
          :class="[
            'py-2 rounded-xl transition-all',
            activeTypeFilter === 'income' ? 'bg-white text-emerald-600 shadow-sm scale-100' : 'text-hk-muted hover:text-hk-text'
          ]"
        >
          Entradas 💚
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="financeStore.isLoading && financeStore.transactions.length === 0" class="py-16 text-center text-hk-muted">
      <span class="inline-block w-8 h-8 border-3 border-hk-pink-primary border-t-transparent rounded-full animate-spin mb-2"></span>
      <p class="text-xs font-bold">Carregando extrato...</p>
    </div>

    <!-- Empty State -->
    <HKCard v-else-if="filteredTransactions.length === 0" class="text-center py-12">
      <Sparkles class="w-10 h-10 text-hk-pink-primary mx-auto mb-3 opacity-60" />
      <h3 class="font-bold text-sm text-hk-text">Nenhum lançamento encontrado</h3>
      <p class="text-xs text-hk-muted mt-1">Toque no Laço Vermelho abaixo para adicionar um novo!</p>
    </HKCard>

    <!-- Lista de Transações -->
    <div v-else class="space-y-2.5">
      <div
        v-for="tx in filteredTransactions"
        :key="tx.id"
        class="bg-white border border-pink-100 rounded-2xl p-3.5 shadow-hk-sm flex items-center justify-between transition-all hover:shadow-hk-md"
      >
        <!-- Ícone + Detalhes -->
        <div class="flex items-center gap-3 min-w-0 pr-2">
          <div
            class="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
            :style="{ backgroundColor: tx.category_color || '#FF85A2' }"
          >
            <HKCategoryIcon :name="tx.category_icon || 'sparkles'" :size="20" />
          </div>
          <div class="min-w-0">
            <h4 class="font-bold text-xs text-hk-text truncate">{{ tx.title }}</h4>
            <p class="text-[11px] text-hk-muted mt-0.5 truncate">
              {{ tx.category_name }} • {{ tx.payment_method }}
            </p>
            <span class="text-[10px] text-hk-muted flex items-center gap-1 mt-0.5">
              <Calendar class="w-3 h-3 text-hk-pink-primary" />
              {{ tx.date }}
            </span>
          </div>
        </div>

        <!-- Valor + Ação Excluir -->
        <div class="text-right shrink-0 flex flex-col items-end">
          <span :class="['font-extrabold text-xs', tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600']">
            {{ tx.type === 'income' ? '+' : '-' }} R$ {{ tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </span>

          <button
            type="button"
            @click="handleDelete(tx.id)"
            :disabled="isDeletingId === tx.id"
            class="mt-1 p-1 text-hk-muted hover:text-rose-600 rounded-lg transition-colors"
            title="Excluir Lançamento"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
