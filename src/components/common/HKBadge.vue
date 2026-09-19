<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'income' | 'expense' | 'pink' | 'warning' | 'neutral'
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'pink',
  dot: false,
})

const badgeClasses = computed(() => {
  switch (props.type) {
    case 'income':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
    case 'expense':
      return 'bg-rose-50 text-rose-600 border-rose-200/70'
    case 'warning':
      return 'bg-amber-50 text-amber-700 border-amber-200/70'
    case 'neutral':
      return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'pink':
    default:
      return 'bg-pink-50 text-hk-pink-dark border-pink-200'
  }
})

const dotColor = computed(() => {
  switch (props.type) {
    case 'income':
      return 'bg-emerald-500'
    case 'expense':
      return 'bg-rose-500'
    case 'warning':
      return 'bg-amber-500'
    case 'neutral':
      return 'bg-gray-400'
    case 'pink':
    default:
      return 'bg-hk-pink-primary'
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors select-none',
      badgeClasses
    ]"
  >
    <span v-if="dot" :class="['w-1.5 h-1.5 rounded-full', dotColor]"></span>
    <slot></slot>
  </span>
</template>
