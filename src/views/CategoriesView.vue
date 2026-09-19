<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import type { Category } from '@/types'
import { Plus, Edit2, Trash2, Sparkles, AlertCircle } from 'lucide-vue-next'
import HKCard from '@/components/common/HKCard.vue'
import HKButton from '@/components/common/HKButton.vue'
import HKBadge from '@/components/common/HKBadge.vue'
import HKBow from '@/components/common/HKBow.vue'
import HKCategoryIcon from '@/components/common/HKCategoryIcon.vue'
import HKCategoryModal from '@/components/finance/HKCategoryModal.vue'
import HKBottomSheet from '@/components/common/HKBottomSheet.vue'

const financeStore = useFinanceStore()

const activeTab = ref<'expense' | 'income'>('expense')
const isModalOpen = ref(false)
const selectedCategory = ref<Category | null>(null)

// Modal de Confirmação de Exclusão
const isDeleteModalOpen = ref(false)
const categoryToDelete = ref<Category | null>(null)
const deleteErrorMessage = ref<string | null>(null)
const isDeleting = ref(false)

const filteredCategories = computed(() => {
  return financeStore.categories.filter(c => c.type === activeTab.value)
})

onMounted(() => {
  financeStore.fetchCategories()
})

function openCreateModal() {
  selectedCategory.value = null
  isModalOpen.value = true
}

function openEditModal(category: Category) {
  selectedCategory.value = category
  isModalOpen.value = true
}

function confirmDelete(category: Category) {
  categoryToDelete.value = category
  deleteErrorMessage.value = null
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!categoryToDelete.value) return

  isDeleting.value = true
  deleteErrorMessage.value = null

  const success = await financeStore.deleteCategory(categoryToDelete.value.id)
  isDeleting.value = false

  if (success) {
    isDeleteModalOpen.value = false
    categoryToDelete.value = null
  } else {
    deleteErrorMessage.value = financeStore.error || 'Não foi possível excluir o tópico'
  }
}
</script>

<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto pb-safe">
    
    <!-- Top Header -->
    <div class="flex items-center justify-between pt-2">
      <div class="flex items-center gap-2.5">
        <HKBow :size="28" animated />
        <div>
          <h1 class="text-xl font-extrabold text-hk-text tracking-tight">Meus Tópicos 🌸</h1>
          <p class="text-xs text-hk-muted">Personalize suas categorias de gastos</p>
        </div>
      </div>

      <HKButton variant="primary" size="sm" @click="openCreateModal">
        <Plus class="w-4 h-4 mr-1" />
        Novo Tópico
      </HKButton>
    </div>

    <!-- Abas: Saídas vs Entradas -->
    <div class="grid grid-cols-2 gap-2 bg-pink-100/60 p-1.5 rounded-2xl">
      <button
        type="button"
        @click="activeTab = 'expense'"
        :class="[
          'py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
          activeTab === 'expense'
            ? 'bg-white text-hk-pink-dark shadow-sm scale-100 ring-1 ring-pink-200'
            : 'text-hk-muted hover:text-hk-text'
        ]"
      >
        <HKBow :size="16" />
        Saídas ({{ financeStore.categories.filter(c => c.type === 'expense').length }})
      </button>

      <button
        type="button"
        @click="activeTab = 'income'"
        :class="[
          'py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
          activeTab === 'income'
            ? 'bg-white text-emerald-600 shadow-sm scale-100 ring-1 ring-emerald-200'
            : 'text-hk-muted hover:text-hk-text'
        ]"
      >
        <span>💚</span>
        Entradas ({{ financeStore.categories.filter(c => c.type === 'income').length }})
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="financeStore.isLoading && financeStore.categories.length === 0" class="py-12 text-center text-hk-muted">
      <span class="inline-block w-6 h-6 border-3 border-hk-pink-primary border-t-transparent rounded-full animate-spin mb-2"></span>
      <p class="text-xs font-bold">Carregando seus tópicos fofos...</p>
    </div>

    <!-- Empty State -->
    <HKCard v-else-if="filteredCategories.length === 0" class="text-center py-12">
      <Sparkles class="w-10 h-10 text-hk-pink-primary mx-auto mb-3 opacity-60" />
      <h3 class="font-bold text-sm text-hk-text">Nenhum tópico cadastrado</h3>
      <p class="text-xs text-hk-muted mt-1 max-w-xs mx-auto">
        Crie seus tópicos personalizados como Maquiagem, Cartão ou Salário!
      </p>
      <div class="mt-4">
        <HKButton variant="primary" size="sm" @click="openCreateModal">
          <Plus class="w-4 h-4 mr-1" />
          Adicionar Primeiro Tópico
        </HKButton>
      </div>
    </HKCard>

    <!-- Lista de Tópicos -->
    <div v-else class="space-y-2.5">
      <div
        v-for="cat in filteredCategories"
        :key="cat.id"
        class="bg-white border border-pink-100/90 rounded-2xl p-3.5 flex items-center justify-between shadow-hk-sm hover:shadow-hk-md transition-all active:scale-99"
      >
        <!-- Ícone + Nome -->
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
            :style="{ backgroundColor: cat.color || '#FF85A2' }"
          >
            <HKCategoryIcon :name="cat.icon" :size="20" />
          </div>
          <div>
            <h4 class="font-bold text-sm text-hk-text">{{ cat.name }}</h4>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[11px] text-hk-muted">
                {{ cat.type === 'expense' ? 'Despesa' : 'Receita' }}
              </span>
              <HKBadge v-if="cat.budget_limit > 0" type="warning">
                Meta: R$ {{ cat.budget_limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
              </HKBadge>
            </div>
          </div>
        </div>

        <!-- Ações: Editar e Excluir -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            @click="openEditModal(cat)"
            class="p-2 text-hk-muted hover:text-hk-pink-dark hover:bg-pink-50 rounded-xl transition-colors"
            title="Editar Tópico"
          >
            <Edit2 class="w-4 h-4" />
          </button>

          <button
            type="button"
            @click="confirmDelete(cat)"
            class="p-2 text-hk-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Excluir Tópico"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Criação / Edição -->
    <HKCategoryModal
      v-model="isModalOpen"
      :category="selectedCategory"
      :default-type="activeTab"
      @saved="financeStore.fetchCategories()"
    />

    <!-- Modal de Confirmação de Exclusão -->
    <HKBottomSheet v-model="isDeleteModalOpen" title="Excluir Tópico? 🎀" showBow>
      <div class="space-y-4 text-center">
        
        <div class="w-14 h-14 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle class="w-7 h-7" />
        </div>

        <div>
          <h4 class="font-bold text-base text-hk-text">
            Tem certeza que deseja excluir "{{ categoryToDelete?.name }}"?
          </h4>
          <p class="text-xs text-hk-muted mt-1 leading-relaxed">
            Se houver despesas ou receitas vinculadas a esse tópico, você não conseguirá excluí-lo por segurança.
          </p>
        </div>

        <div v-if="deleteErrorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-bold">
          {{ deleteErrorMessage }}
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2">
          <HKButton variant="secondary" block @click="isDeleteModalOpen = false">
            Cancelar
          </HKButton>
          <HKButton
            variant="bow-red"
            block
            :loading="isDeleting"
            @click="handleDelete"
          >
            Sim, Excluir
          </HKButton>
        </div>

      </div>
    </HKBottomSheet>

  </div>
</template>
