<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import HKBow from './HKBow.vue'

interface Props {
  modelValue: boolean
  title?: string
  closable?: boolean
  showBow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  closable: true,
  showBow: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function close() {
  emit('update:modelValue', false)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex flex-col justify-end">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-hk-text/40 backdrop-blur-sm transition-opacity animate-fade-in"
        @click="close"
      ></div>

      <!-- Bottom Sheet / Modal Drawer -->
      <div
        class="relative z-10 w-full max-w-lg mx-auto bg-white rounded-t-[2.5rem] shadow-2xl border-t-2 border-hk-pink-soft max-h-[90vh] flex flex-col overflow-hidden animate-slide-up"
      >
        <!-- Drag Handle Indicator -->
        <div class="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing" @click="close">
          <div class="w-12 h-1.5 bg-hk-pink-soft rounded-full"></div>
        </div>

        <!-- Header -->
        <div class="px-6 py-3 flex items-center justify-between border-b border-pink-50">
          <div class="flex items-center gap-2">
            <HKBow v-if="showBow" :size="22" />
            <h3 class="text-lg font-bold text-hk-text tracking-tight">
              {{ title }}
            </h3>
          </div>

          <button
            v-if="closable"
            type="button"
            class="p-2 -mr-2 text-hk-muted hover:text-hk-pink-dark bg-hk-pink-soft/30 hover:bg-hk-pink-soft/70 rounded-full transition-colors"
            @click="close"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto pb-safe">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
