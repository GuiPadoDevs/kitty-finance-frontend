<script setup lang="ts">
import { useRoute } from 'vue-router'
import { LayoutDashboard, ReceiptText, Sparkles, History } from 'lucide-vue-next'
import HKBow from './HKBow.vue'

const route = useRoute()

const emit = defineEmits<{
  (e: 'open-create'): void
}>()
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-40 max-w-lg mx-auto pointer-events-none">
    <nav class="pointer-events-auto bg-white/95 backdrop-blur-md border-t border-hk-border shadow-hk-lg rounded-t-3xl px-3 pt-2 pb-[max(env(safe-area-inset-bottom,8px),12px)] flex items-center justify-around select-none">
      
      <!-- Tab: Dashboard -->
      <router-link
        to="/dashboard"
        :class="[
          'flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer',
          route.path === '/dashboard' ? 'text-hk-pink-primary font-bold scale-105' : 'text-hk-muted hover:text-hk-text'
        ]"
      >
        <LayoutDashboard class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Início</span>
      </router-link>

      <!-- Tab: Extrato -->
      <router-link
        to="/transactions"
        :class="[
          'flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer',
          route.path === '/transactions' ? 'text-hk-pink-primary font-bold scale-105' : 'text-hk-muted hover:text-hk-text'
        ]"
      >
        <ReceiptText class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Extrato</span>
      </router-link>

      <!-- Central Action Button: Hello Kitty Red Bow -->
      <div class="relative -top-5 flex flex-col items-center">
        <button
          type="button"
          @click="emit('open-create')"
          class="w-14 h-14 rounded-full bg-gradient-to-tr from-hk-red-bow to-[#FF4D6D] border-4 border-white shadow-hk-bow flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group"
          title="Adicionar Gasto ou Entrada 🎀"
        >
          <HKBow :size="32" class="group-hover:rotate-12 transition-transform drop-shadow" />
        </button>
        <span class="text-[10px] font-bold text-hk-red-bow mt-0.5 tracking-tight">Novo</span>
      </div>

      <!-- Tab: Tópicos / Categorias -->
      <router-link
        to="/categories"
        :class="[
          'flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer',
          route.path === '/categories' ? 'text-hk-pink-primary font-bold scale-105' : 'text-hk-muted hover:text-hk-text'
        ]"
      >
        <Sparkles class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Tópicos</span>
      </router-link>

      <!-- Tab: Histórico de Ciclos -->
      <router-link
        to="/history"
        :class="[
          'flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer',
          route.path === '/history' ? 'text-hk-pink-primary font-bold scale-105' : 'text-hk-muted hover:text-hk-text'
        ]"
      >
        <History class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Histórico</span>
      </router-link>

    </nav>
  </div>
</template>
