<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import type { Category } from '@/types'
import HKBottomSheet from '@/components/common/HKBottomSheet.vue'
import HKButton from '@/components/common/HKButton.vue'
import HKCategoryIcon from '@/components/common/HKCategoryIcon.vue'
import HKBow from '@/components/common/HKBow.vue'

interface Props {
  modelValue: boolean
  category?: Category | null
  defaultType?: 'income' | 'expense'
}

const props = withDefaults(defineProps<Props>(), {
  category: null,
  defaultType: 'expense',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const financeStore = useFinanceStore()

const name = ref('')
const type = ref<'income' | 'expense'>('expense')
const color = ref('#FF85A2')
const icon = ref('sparkles')
const budgetLimit = ref<number | string>('')
const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)

const availableColors = [
  '#FF85A2', // Rosa HK
  '#FF1E40', // Vermelho Laço
  '#F472B6', // Rosa Pastel
  '#C084FC', // Lavanda
  '#34D399', // Verde Pastel
  '#FB923C', // Laranja Pêssego
  '#FBBF24', // Dourado
  '#38BDF8', // Azul Céu
  '#94A3B8', // Cinza Suave
]

const availableIcons = [
  { name: 'sparkles', label: 'Brilho' },
  { name: 'heart', label: 'Coração' },
  { name: 'gift', label: 'Mimos' },
  { name: 'shopping-bag', label: 'Bolsa' },
  { name: 'shopping-cart', label: 'Mercado' },
  { name: 'credit-card', label: 'Cartão' },
  { name: 'briefcase', label: 'Trabalho' },
  { name: 'home', label: 'Casa' },
  { name: 'coffee', label: 'Café' },
  { name: 'utensils', label: 'Comida' },
  { name: 'scissors', label: 'Salão' },
  { name: 'star', label: 'Estrela' },
  { name: 'shirt', label: 'Look' },
  { name: 'car', label: 'Transporte' },
]

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    errorMessage.value = null
    if (props.category) {
      name.value = props.category.name
      type.value = props.category.type
      color.value = props.category.color
      icon.value = props.category.icon
      budgetLimit.value = props.category.budget_limit > 0 ? props.category.budget_limit : ''
    } else {
      name.value = ''
      type.value = props.defaultType
      color.value = props.defaultType === 'income' ? '#34D399' : '#FF85A2'
      icon.value = 'sparkles'
      budgetLimit.value = ''
    }
  }
})

async function handleSave() {
  if (!name.value.trim()) {
    errorMessage.value = 'Por favor, digite o nome do tópico 🎀'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  const limitNum = parseFloat(String(budgetLimit.value).replace(',', '.')) || 0

  let success = false
  if (props.category) {
    success = await financeStore.updateCategory(props.category.id, {
      name: name.value.trim(),
      icon: icon.value,
      color: color.value,
      budget_limit: limitNum,
    })
  } else {
    success = await financeStore.createCategory({
      name: name.value.trim(),
      type: type.value,
      icon: icon.value,
      color: color.value,
      budget_limit: limitNum,
    })
  }

  isSubmitting.value = false

  if (success) {
    emit('update:modelValue', false)
    emit('saved')
  } else {
    errorMessage.value = financeStore.error || 'Erro ao salvar tópico'
  }
}
</script>

<template>
  <HKBottomSheet
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    :title="category ? 'Editar Tópico 🌸' : 'Novo Tópico 🎀'"
    showBow
  >
    <form @submit.prevent="handleSave" class="space-y-4">
      
      <!-- Mensagem de Erro -->
      <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-bold text-center animate-fade-in">
        {{ errorMessage }}
      </div>

      <!-- Seletor de Tipo (Apenas para novos tópicos) -->
      <div v-if="!category" class="grid grid-cols-2 gap-2 bg-pink-100/60 p-1.5 rounded-2xl">
        <button
          type="button"
          @click="type = 'expense'; color = '#FF85A2'"
          :class="[
            'py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
            type === 'expense' ? 'bg-white text-hk-pink-dark shadow-sm scale-100' : 'text-hk-muted hover:text-hk-text'
          ]"
        >
          <HKBow :size="16" />
          Saída (Gasto)
        </button>

        <button
          type="button"
          @click="type = 'income'; color = '#34D399'"
          :class="[
            'py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
            type === 'income' ? 'bg-white text-emerald-600 shadow-sm scale-100' : 'text-hk-muted hover:text-hk-text'
          ]"
        >
          <span class="text-sm">💚</span>
          Entrada (Receita)
        </button>
      </div>

      <!-- Preview do Card da Categoria -->
      <div class="flex items-center justify-center py-2">
        <div
          class="flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all shadow-sm"
          :style="{ backgroundColor: `${color}15`, borderColor: color }"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
            :style="{ backgroundColor: color }"
          >
            <HKCategoryIcon :name="icon" :size="20" />
          </div>
          <div>
            <p class="font-bold text-sm text-hk-text">{{ name || 'Nome do Tópico' }}</p>
            <p class="text-[11px] text-hk-muted">
              {{ type === 'income' ? 'Entrada' : 'Saída' }}
              <span v-if="budgetLimit"> • Meta: R$ {{ budgetLimit }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Input Nome -->
      <div>
        <label class="block text-xs font-bold text-hk-text mb-1.5">Nome do Tópico 🎀</label>
        <input
          v-model="name"
          type="text"
          placeholder="Ex: Maquiagem, Shopee, Unhas, Salário..."
          maxlength="40"
          required
          class="w-full px-4 py-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-hk-pink-primary/50 focus:bg-white text-hk-text transition-all placeholder:text-pink-300"
        />
      </div>

      <!-- Seletor de Ícone -->
      <div>
        <label class="block text-xs font-bold text-hk-text mb-1.5">Escolha um Ícone Fofo 🌸</label>
        <div class="grid grid-cols-7 gap-2 max-h-32 overflow-y-auto p-1 bg-pink-50/30 rounded-2xl border border-pink-100">
          <button
            v-for="item in availableIcons"
            :key="item.name"
            type="button"
            @click="icon = item.name"
            :class="[
              'p-2 rounded-xl flex flex-col items-center justify-center transition-transform active:scale-90',
              icon === item.name ? 'bg-white shadow-md border-2 border-hk-pink-primary scale-105' : 'hover:bg-white/60 text-hk-muted'
            ]"
            :title="item.label"
          >
            <HKCategoryIcon :name="item.name" :size="18" :class="icon === item.name ? 'text-hk-pink-primary' : ''" />
          </button>
        </div>
      </div>

      <!-- Seletor de Cores -->
      <div>
        <label class="block text-xs font-bold text-hk-text mb-1.5">Cor Temática ✨</label>
        <div class="flex items-center justify-between gap-1.5 px-1 py-1">
          <button
            v-for="c in availableColors"
            :key="c"
            type="button"
            @click="color = c"
            class="w-7 h-7 rounded-full transition-transform hover:scale-110 active:scale-95 flex items-center justify-center shadow-xs"
            :style="{ backgroundColor: c }"
          >
            <span v-if="color === c" class="w-2.5 h-2.5 rounded-full bg-white shadow-xs"></span>
          </button>
        </div>
      </div>

      <!-- Limite / Meta Mensal (Opcional) -->
      <div v-if="type === 'expense'">
        <label class="block text-xs font-bold text-hk-text mb-1.5">
          Meta de Gasto Mensal (Opcional) 🎯
        </label>
        <div class="relative">
          <span class="absolute left-4 top-3.5 text-xs font-bold text-hk-muted">R$</span>
          <input
            v-model="budgetLimit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00 (Deixe em branco se não quiser limite)"
            class="w-full pl-10 pr-4 py-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-hk-pink-primary/50 focus:bg-white text-hk-text transition-all placeholder:text-pink-300"
          />
        </div>
      </div>

      <!-- Botão Salvar -->
      <div class="pt-2">
        <HKButton
          variant="primary"
          block
          size="lg"
          type="submit"
          :loading="isSubmitting"
        >
          {{ category ? 'Salvar Alterações 🌸' : 'Criar Tópico 🎀' }}
        </HKButton>
      </div>

    </form>
  </HKBottomSheet>
</template>
