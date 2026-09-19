<script setup lang="ts">
import { computed } from 'vue'
import type { CategoryBreakdown } from '@/types'
import HKBow from '@/components/common/HKBow.vue'

interface Props {
  items?: CategoryBreakdown[]
  totalExpense?: number
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  totalExpense: 0,
})

// Filtra apenas categorias com gastos maiores que zero
const activeItems = computed(() => {
  return (props.items || []).filter(item => item.total_amount > 0)
})

// Calcula os arcos SVG do gráfico de rosca
const slices = computed(() => {
  if (props.totalExpense <= 0 || activeItems.value.length === 0) return []

  let cumulativeAngle = 0
  const radius = 38
  const cx = 50
  const cy = 50

  return activeItems.value.map((item) => {
    const angle = (item.total_amount / props.totalExpense) * 360
    const startAngle = cumulativeAngle
    const endAngle = cumulativeAngle + angle
    cumulativeAngle += angle

    // Converte polar para cartesiano
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    // Se for 100% de uma única categoria, faz círculo completo
    let path = ''
    if (angle >= 359.9) {
      path = `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy + radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius}`
    } else {
      path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
    }

    return {
      category: item,
      path,
      color: item.color || '#FF85A2',
      percentage: item.percentage_of_total.toFixed(1),
    }
  })
})
</script>

<template>
  <div class="py-2">
    <!-- Se não houver despesas registradas -->
    <div v-if="totalExpense <= 0 || activeItems.length === 0" class="py-8 text-center text-hk-muted">
      <HKBow :size="28" animated class="opacity-40 mb-2" />
      <p class="text-xs font-bold">Nenhuma despesa registrada neste ciclo ainda ✨</p>
    </div>

    <!-- Gráfico de Rosca & Legenda Interativa -->
    <div v-else class="space-y-4">
      
      <!-- Donut SVG -->
      <div class="relative w-44 h-44 mx-auto flex items-center justify-center">
        <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-sm">
          <!-- Background Track -->
          <circle cx="50" cy="50" r="38" fill="none" stroke="#FFE4E8" stroke-width="12" />

          <!-- Slices -->
          <path
            v-for="(slice, index) in slices"
            :key="index"
            :d="slice.path"
            fill="none"
            :stroke="slice.color"
            stroke-width="12"
            stroke-linecap="round"
            class="transition-all duration-300 hover:opacity-80"
          />
        </svg>

        <!-- Centro do Donut -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span class="text-[10px] font-bold text-hk-muted uppercase tracking-wider">Total Gasto</span>
          <span class="text-xs font-extrabold text-hk-pink-dark">
            R$ {{ totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </span>
          <HKBow :size="14" class="mt-0.5" />
        </div>
      </div>

      <!-- Legenda com Porcentagens -->
      <div class="grid grid-cols-2 gap-2 pt-1">
        <div
          v-for="item in activeItems"
          :key="item.category_id"
          class="flex items-center justify-between p-2 rounded-xl bg-pink-50/40 border border-pink-100 text-xs"
        >
          <div class="flex items-center gap-1.5 min-w-0 pr-1">
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
              :style="{ backgroundColor: item.color || '#FF85A2' }"
            ></span>
            <span class="font-bold text-hk-text truncate">{{ item.name }}</span>
          </div>
          <span class="font-bold text-hk-pink-dark shrink-0">
            {{ item.percentage_of_total.toFixed(0) }}%
          </span>
        </div>
      </div>

    </div>
  </div>
</template>
