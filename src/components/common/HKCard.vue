<script setup lang="ts">
interface Props {
  glass?: boolean
  noPadding?: boolean
  highlight?: boolean
  className?: string
}

withDefaults(defineProps<Props>(), {
  glass: false,
  noPadding: false,
  highlight: false,
  className: '',
})
</script>

<template>
  <div
    :class="[
      'rounded-3xl border transition-all duration-300 relative overflow-hidden',
      glass ? 'glass-card border-white/60 shadow-hk-sm' : 'bg-white border-hk-border/80 shadow-hk-sm hover:shadow-hk-md',
      highlight ? 'border-hk-pink-primary/40 shadow-pink-200/60 ring-2 ring-hk-pink-soft/30' : '',
      noPadding ? 'p-0' : 'p-5 sm:p-6',
      className
    ]"
  >
    <slot></slot>
  </div>
</template>
