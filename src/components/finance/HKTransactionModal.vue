<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { Calendar, CreditCard, Heart } from 'lucide-vue-next'
import HKBottomSheet from '@/components/common/HKBottomSheet.vue'
import HKButton from '@/components/common/HKButton.vue'
import HKCategoryIcon from '@/components/common/HKCategoryIcon.vue'
import HKBow from '@/components/common/HKBow.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
}>()

const financeStore = useFinanceStore()

const type = ref<'expense' | 'income'>('expense')
const rawAmount = ref<string>('') // Armazena centavos digitados
const title = ref('')
const selectedCategoryId = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const paymentMethod = ref('Cartão de Crédito')
const notes = ref('')
const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)
const showCelebration = ref(false)

const quickSuggestions = computed(() => {
  if (type.value === 'expense') {
    return ['Maquiagem 💄', 'Almoço / Lanche 🍓', 'Uber 🚗', 'Shopee 🛍️', 'Farmácia 💊', 'Supermercado 🛒']
  }
  return ['Salário 💼', 'Pix Recebido ⚡', 'Mimo / Renda Extra 🎁', 'Reembolso 💰']
})

const paymentMethods = [
  'Cartão de Crédito',
  'Pix',
  'Cartão de Débito',
  'Dinheiro',
  'Boleto',
]

// Filtra as categorias disponíveis pelo tipo selecionado
const filteredCategories = computed(() => {
  return financeStore.categories.filter(c => c.type === type.value)
})

// Formata o valor monetário na tela (R$ 0,00)
const formattedAmount = computed(() => {
  const cents = parseInt(rawAmount.value || '0', 10)
  const val = cents / 100
  return val.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const numericAmount = computed(() => {
  const cents = parseInt(rawAmount.value || '0', 10)
  return cents / 100
})

function handleAmountInput(e: Event) {
  const target = e.target as HTMLInputElement
  // Extrai apenas dígitos
  const digits = target.value.replace(/\D/g, '')
  rawAmount.value = digits.slice(0, 9) // Limite de 9 dígitos
}

// Quando abre o modal, carrega categorias se necessário e reseta o formulário
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    errorMessage.value = null
    showCelebration.value = false
    rawAmount.value = ''
    title.value = ''
    notes.value = ''
    date.value = new Date().toISOString().split('T')[0]

    if (financeStore.categories.length === 0) {
      await financeStore.fetchCategories()
    }

    // Pré-seleciona a primeira categoria do tipo
    if (filteredCategories.value.length > 0) {
      selectedCategoryId.value = filteredCategories.value[0].id
    }
  }
})

// Trocar tipo atualiza a categoria selecionada
watch(type, () => {
  if (filteredCategories.value.length > 0) {
    selectedCategoryId.value = filteredCategories.value[0].id
  } else {
    selectedCategoryId.value = ''
  }
})

onMounted(() => {
  if (financeStore.categories.length === 0) {
    financeStore.fetchCategories()
  }
})

async function handleSave() {
  if (numericAmount.value <= 0) {
    errorMessage.value = 'Por favor, digite um valor maior que R$ 0,00 🎀'
    return
  }

  if (!title.value.trim()) {
    errorMessage.value = 'Por favor, dê um título ou descrição para o lançamento 🌸'
    return
  }

  if (!selectedCategoryId.value) {
    errorMessage.value = 'Por favor, selecione um tópico/categoria 🎀'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  const success = await financeStore.createTransaction({
    category_id: selectedCategoryId.value,
    title: title.value.trim(),
    amount: numericAmount.value,
    type: type.value,
    date: date.value,
    payment_method: paymentMethod.value,
    notes: notes.value ? notes.value.trim() : undefined,
  })

  isSubmitting.value = false

  if (success) {
    showCelebration.value = true
    setTimeout(() => {
      emit('update:modelValue', false)
      emit('created')
    }, 900)
  } else {
    errorMessage.value = financeStore.error || 'Erro ao registrar lançamento'
  }
}
</script>

<template>
  <HKBottomSheet
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    :title="type === 'expense' ? 'Nova Despesa 🎀' : 'Nova Entrada 💚'"
    showBow
  >
    <!-- Animação de Sucesso / Celebração -->
    <div v-if="showCelebration" class="py-12 text-center animate-fade-in flex flex-col items-center justify-center">
      <div class="relative mb-3">
        <HKBow :size="64" class="animate-bounce" />
        <div class="absolute -top-3 -right-3 text-2xl animate-ping">💖</div>
        <div class="absolute -bottom-2 -left-3 text-xl animate-pulse">✨</div>
      </div>
      <h3 class="text-xl font-bold text-hk-text">Lançamento Salvo com Sucesso! 🌸</h3>
      <p class="text-xs text-hk-pink-dark mt-1 font-bold">Atualizando suas finanças...</p>
    </div>

    <!-- Formulário -->
    <form v-else @submit.prevent="handleSave" class="space-y-4">
      
      <!-- Mensagem de Erro -->
      <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-bold text-center animate-fade-in">
        {{ errorMessage }}
      </div>

      <!-- Alternador de Tipo: Despesa vs Entrada -->
      <div class="grid grid-cols-2 gap-2 bg-pink-100/60 p-1.5 rounded-2xl">
        <button
          type="button"
          @click="type = 'expense'"
          :class="[
            'py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
            type === 'expense' ? 'bg-gradient-to-r from-hk-red-bow to-[#FF4D6D] text-white shadow-md scale-100' : 'text-hk-muted hover:text-hk-text'
          ]"
        >
          <HKBow :size="16" />
          Despesa (Gasto)
        </button>

        <button
          type="button"
          @click="type = 'income'"
          :class="[
            'py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
            type === 'income' ? 'bg-emerald-500 text-white shadow-md scale-100' : 'text-hk-muted hover:text-hk-text'
          ]"
        >
          <span class="text-sm">💚</span>
          Entrada (Ganho)
        </button>
      </div>

      <!-- Input Grande de Valor Monetário -->
      <div class="text-center py-2 bg-pink-50/50 rounded-3xl border border-pink-100 p-4">
        <label class="block text-xs font-bold text-hk-muted mb-1">Valor do Lançamento</label>
        <div class="relative flex items-center justify-center">
          <span class="text-2xl font-bold text-hk-pink-primary mr-1">R$</span>
          <input
            type="text"
            inputmode="numeric"
            :value="formattedAmount"
            @input="handleAmountInput"
            autofocus
            placeholder="0,00"
            class="w-48 text-3xl font-extrabold text-hk-text bg-transparent text-center focus:outline-none tracking-tight"
          />
        </div>
      </div>

      <!-- Seletor de Categoria em Chips Deslizantes -->
      <div>
        <label class="block text-xs font-bold text-hk-text mb-1.5">Escolha o Tópico / Categoria 🎀</label>
        
        <div v-if="filteredCategories.length === 0" class="p-3 bg-white border border-pink-200 rounded-2xl text-center text-xs text-hk-muted">
          Nenhum tópico encontrado deste tipo. Crie um na aba Tópicos!
        </div>

        <div v-else class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            v-for="cat in filteredCategories"
            :key="cat.id"
            type="button"
            @click="selectedCategoryId = cat.id"
            :class="[
              'shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all active:scale-95',
              selectedCategoryId === cat.id
                ? 'bg-white shadow-md border-2 border-hk-pink-primary text-hk-pink-dark scale-105 ring-2 ring-pink-100'
                : 'bg-white/80 border-pink-100 text-hk-muted hover:bg-white'
            ]"
          >
            <div
              class="w-6 h-6 rounded-lg flex items-center justify-center text-white"
              :style="{ backgroundColor: cat.color || '#FF85A2' }"
            >
              <HKCategoryIcon :name="cat.icon" :size="13" />
            </div>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Título / Descrição com Sugestões Rápidas -->
      <div>
        <label class="block text-xs font-bold text-hk-text mb-1.5">Descrição do Gasto 🌸</label>
        <input
          v-model="title"
          type="text"
          placeholder="Ex: Batom Hello Kitty, Almoço com amigas..."
          maxlength="80"
          required
          class="w-full px-4 py-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-hk-pink-primary/50 focus:bg-white text-hk-text transition-all placeholder:text-pink-300"
        />

        <!-- Chips de sugestões rápidas -->
        <div class="flex flex-wrap gap-1.5 mt-2">
          <button
            v-for="sug in quickSuggestions"
            :key="sug"
            type="button"
            @click="title = sug"
            class="text-[11px] font-bold px-2.5 py-1 bg-white border border-pink-200 text-hk-muted hover:text-hk-pink-dark hover:border-hk-pink-primary rounded-full transition-all active:scale-95"
          >
            {{ sug }}
          </button>
        </div>
      </div>

      <!-- Data & Forma de Pagamento em 2 Colunas -->
      <div class="grid grid-cols-2 gap-2">
        <!-- Data -->
        <div>
          <label class="block text-xs font-bold text-hk-text mb-1.5 flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5 text-hk-pink-primary" />
            Data
          </label>
          <input
            v-model="date"
            type="date"
            class="w-full px-3 py-2.5 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-hk-text focus:outline-none focus:bg-white"
          />
        </div>

        <!-- Forma de Pagamento -->
        <div>
          <label class="block text-xs font-bold text-hk-text mb-1.5 flex items-center gap-1">
            <CreditCard class="w-3.5 h-3.5 text-hk-pink-primary" />
            Pagamento
          </label>
          <select
            v-model="paymentMethod"
            class="w-full px-3 py-2.5 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-hk-text focus:outline-none focus:bg-white"
          >
            <option v-for="pm in paymentMethods" :key="pm" :value="pm">
              {{ pm }}
            </option>
          </select>
        </div>
      </div>

      <!-- Observações Opcionais -->
      <div>
        <label class="block text-xs font-bold text-hk-text mb-1">Notas Opcionais 📝</label>
        <input
          v-model="notes"
          type="text"
          placeholder="Ex: Parcelado em 2x, comprado no shopping..."
          class="w-full px-4 py-2 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs text-hk-text focus:outline-none focus:bg-white placeholder:text-pink-300"
        />
      </div>

      <!-- Botão Confirmar -->
      <div class="pt-2">
        <HKButton
          :variant="type === 'expense' ? 'bow-red' : 'primary'"
          block
          size="lg"
          type="submit"
          :loading="isSubmitting"
        >
          <Heart class="w-4 h-4 mr-1.5 fill-current" />
          {{ type === 'expense' ? 'Confirmar Despesa 🎀' : 'Confirmar Entrada 💚' }}
        </HKButton>
      </div>

    </form>
  </HKBottomSheet>
</template>
