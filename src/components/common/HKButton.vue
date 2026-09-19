<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'bow-red' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  loading: false,
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-r from-hk-pink-primary to-hk-pink-deep text-white shadow-hk-md shadow-pink-300/40 hover:brightness-105 active:scale-95 border border-pink-200'
    case 'bow-red':
      return 'bg-gradient-to-r from-hk-red-bow to-hk-red-bow-dark text-white shadow-hk-bow active:scale-95 border border-red-300'
    case 'secondary':
      return 'bg-hk-pink-soft text-hk-pink-dark hover:bg-pink-200/80 active:scale-95 border border-pink-200'
    case 'outline':
      return 'border-2 border-hk-pink-primary text-hk-pink-dark bg-white/70 hover:bg-pink-50 active:scale-95'
    case 'ghost':
      return 'text-hk-text hover:bg-hk-pink-soft/40 active:scale-95'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3.5 py-1.5 text-xs rounded-xl font-bold'
    case 'lg':
      return 'px-6 py-3.5 text-base rounded-2xl font-bold tracking-wide'
    case 'md':
    default:
      return 'px-5 py-2.5 text-sm rounded-2xl font-bold'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'relative inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none',
      variantClasses,
      sizeClasses,
      { 'w-full': block }
    ]"
    @click="(e) => emit('click', e)"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
    <slot></slot>
  </button>
</template>
