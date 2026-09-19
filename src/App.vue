<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import HKBottomBar from '@/components/common/HKBottomBar.vue'
import HKTransactionModal from '@/components/finance/HKTransactionModal.vue'

const authStore = useAuthStore()
const isCreateTxOpen = ref(false)

function handleOpenCreate() {
  isCreateTxOpen.value = true
}
</script>

<template>
  <div class="min-h-screen bg-hk-bg text-hk-text font-sans flex flex-col selection:bg-pink-200">
    <!-- Main Content -->
    <main class="flex-1 w-full max-w-lg mx-auto">
      <router-view />
    </main>

    <!-- Bottom Navigation Bar (Exibida apenas quando autenticada) -->
    <HKBottomBar
      v-if="authStore.isAuthenticated"
      @open-create="handleOpenCreate"
    />

    <!-- Modal Global de Novo Lançamento (Disparado pelo Laço Central) -->
    <HKTransactionModal
      v-if="authStore.isAuthenticated"
      v-model="isCreateTxOpen"
    />
  </div>
</template>

<style>
body {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
