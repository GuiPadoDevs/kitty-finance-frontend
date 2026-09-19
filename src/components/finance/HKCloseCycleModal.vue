<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { Sparkles, Lock } from 'lucide-vue-next'
import HKBottomSheet from '@/components/common/HKBottomSheet.vue'
import HKButton from '@/components/common/HKButton.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'closed'): void
}>()

const financeStore = useFinanceStore()

const newCycleName = ref('')
const newStartDate = ref(new Date().toISOString().split('T')[0])
const carryOver = ref(true)
const notes = ref('')
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const summary = computed(() => financeStore.dashboardSummary)
const finalBalance = computed(() => summary.value?.current_balance || 0)
const hasSavings = computed(() => finalBalance.value > 0)

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    errorMessage.value = null
    notes.value = ''
    carryOver.value = true

    // Gera sugestão de nome do novo ciclo
    const now = new Date()
    now.setMonth(now.getMonth() + 1)
    const monthName = now.toLocaleString('pt-BR', { month: 'short' })
    newCycleName.value = `Ciclo ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}/${now.getFullYear()} 🎀`
    newStartDate.value = new Date().toISOString().split('T')[0]
  }
})

async function handleCloseCycle() {
  if (!newCycleName.value.trim()) {
    errorMessage.value = 'Por favor, dê um nome para o novo ciclo 🎀'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  const success = await financeStore.closeCycle({
    new_cycle_name: newCycleName.value.trim(),
    new_start_date: newStartDate.value,
    carry_over: carryOver.value,
    notes: notes.value ? notes.value.trim() : undefined,
  })

  isSubmitting.value = false

  if (success) {
    emit('update:modelValue', false)
    emit('closed')
  } else {
    errorMessage.value = financeStore.error || 'Erro ao finalizar ciclo financeiro'
  }
}
</script>

<template>
  <HKBottomSheet
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    title="Finalizar Mês & Fechar Ciclo 🌸"
    showBow
  >
    <form @submit.prevent="handleCloseCycle" class="space-y-4">
      
      <!-- Mensagem de Erro -->
      <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-bold text-center animate-fade-in">
        {{ errorMessage }}
      </div>

      <!-- Resumo do Ciclo a ser Fechado -->
      <div class="bg-gradient-to-br from-pink-50 via-white to-pink-50 p-4 rounded-3xl border border-pink-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between border-b border-pink-100 pb-2">
          <span class="text-xs font-bold text-hk-muted">Ciclo que está encerrando:</span>
          <span class="text-xs font-extrabold text-hk-pink-dark">{{ summary?.cycle.name }}</span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span class="text-emerald-700 font-bold block text-[11px]">Entradas</span>
            <span class="font-extrabold text-emerald-800 text-sm">
              R$ {{ summary?.total_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>

          <div class="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100">
            <span class="text-rose-700 font-bold block text-[11px]">Saídas</span>
            <span class="font-extrabold text-rose-800 text-sm">
              R$ {{ summary?.total_expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>
        </div>

        <!-- Saldo Restante / Sobra -->
        <div class="p-3 bg-white rounded-2xl border-2 border-hk-pink-primary/30 text-center">
          <span class="text-[11px] font-bold text-hk-muted uppercase tracking-wider block">Saldo Final Restante</span>
          <span :class="['text-xl font-black block mt-0.5', hasSavings ? 'text-hk-pink-dark' : 'text-rose-600']">
            R$ {{ finalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </span>

          <div v-if="hasSavings" class="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <Sparkles class="w-3.5 h-3.5" />
            Você economizou esse mês! Parabéns Sah! 🌸
          </div>
        </div>
      </div>

      <!-- Opção de Transferência de Saldo (Carry Over) -->
      <div class="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-200 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-hk-text">Somar sobra no novo ciclo? 💰</p>
          <p class="text-[10px] text-hk-muted">
            Transfere R$ {{ finalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }} como saldo inicial
          </p>
        </div>

        <button
          type="button"
          @click="carryOver = !carryOver"
          :class="[
            'w-12 h-7 rounded-full transition-colors relative flex items-center p-1',
            carryOver ? 'bg-hk-pink-primary' : 'bg-gray-300'
          ]"
        >
          <div
            :class="[
              'w-5 h-5 bg-white rounded-full shadow-md transition-transform',
              carryOver ? 'translate-x-5' : 'translate-x-0'
            ]"
          ></div>
        </button>
      </div>

      <!-- Configuração do Novo Ciclo -->
      <div class="space-y-3 pt-1">
        <div>
          <label class="block text-xs font-bold text-hk-text mb-1">Nome do Novo Ciclo 🎀</label>
          <input
            v-model="newCycleName"
            type="text"
            required
            placeholder="Ex: Ciclo 05/Nov a 04/Dez 🎀"
            class="w-full px-4 py-2.5 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-hk-text focus:outline-none focus:bg-white"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-hk-text mb-1">Data de Início do Novo Ciclo 📅</label>
          <input
            v-model="newStartDate"
            type="date"
            required
            class="w-full px-4 py-2 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-hk-text focus:outline-none focus:bg-white"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-hk-text mb-1">Notas do Mês que Encerrou 📝 (Opcional)</label>
          <input
            v-model="notes"
            type="text"
            placeholder="Ex: Mês super econômico, sobrou dinheiro para viajar!"
            class="w-full px-4 py-2 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs text-hk-text focus:outline-none focus:bg-white placeholder:text-pink-300"
          />
        </div>
      </div>

      <!-- Botão Confirmar Fechamento -->
      <div class="pt-2">
        <HKButton
          variant="primary"
          block
          size="lg"
          type="submit"
          :loading="isSubmitting"
        >
          <Lock class="w-4 h-4 mr-1.5" />
          Finalizar Mês e Abrir Novo Ciclo 🌸
        </HKButton>
      </div>

    </form>
  </HKBottomSheet>
</template>
