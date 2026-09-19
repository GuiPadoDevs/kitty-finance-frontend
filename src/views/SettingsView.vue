<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Calendar, LogOut, Download, Check } from 'lucide-vue-next'
import HKCard from '@/components/common/HKCard.vue'
import HKButton from '@/components/common/HKButton.vue'
import HKBow from '@/components/common/HKBow.vue'
import HKKittyFace from '@/components/common/HKKittyFace.vue'
import HKInstallPrompt from '@/components/common/HKInstallPrompt.vue'

const router = useRouter()
const authStore = useAuthStore()

const installPromptRef = ref<any>(null)
const salaryDay = ref(authStore.settings?.salary_day || 5)
const isSaving = ref(false)
const saveSuccess = ref(false)

const user = computed(() => authStore.user)

async function handleUpdateSettings() {
  isSaving.value = true
  saveSuccess.value = false
  const success = await authStore.updateSettings({
    salary_day: Number(salaryDay.value) || 5,
  })
  isSaving.value = false
  if (success) {
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 2500)
  }
}

function handleLogout() {
  if (confirm('Deseja realmente sair da sua conta? 🌸')) {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<template>
  <div class="p-4 space-y-4 max-w-lg mx-auto pb-safe">
    
    <!-- Top Bar -->
    <div class="flex items-center gap-2.5 pt-2">
      <HKBow :size="28" animated />
      <div>
        <h1 class="text-xl font-extrabold text-hk-text tracking-tight">Minha Conta & Ajustes ⚙️</h1>
        <p class="text-xs text-hk-muted">Preferências do seu Finanças Sah</p>
      </div>
    </div>

    <!-- Perfil da Usuária -->
    <HKCard>
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-3xl bg-pink-100 border-2 border-pink-200 flex items-center justify-center relative shadow-sm shrink-0">
          <HKKittyFace :size="50" />
          <div class="absolute -top-1.5 -right-1.5">
            <HKBow :size="20" />
          </div>
        </div>

        <div class="min-w-0">
          <h3 class="font-extrabold text-base text-hk-text truncate">{{ user?.name || 'Sah' }}</h3>
          <p class="text-xs text-hk-muted flex items-center gap-1 mt-0.5 truncate">
            <Mail class="w-3.5 h-3.5 text-hk-pink-primary shrink-0" />
            {{ user?.email }}
          </p>
          <span class="text-[10px] font-bold text-hk-pink-dark bg-pink-100 px-2 py-0.5 rounded-full inline-block mt-1">
            Hello Kitty VIP Edition 🎀
          </span>
        </div>
      </div>
    </HKCard>

    <!-- Preferências de Ciclo / Salário -->
    <HKCard>
      <h3 class="font-extrabold text-sm text-hk-text mb-2 flex items-center gap-1.5">
        <Calendar class="w-4 h-4 text-hk-pink-primary" />
        Configuração do Ciclo Financeiro 📅
      </h3>

      <div class="space-y-3">
        <div class="bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
          <label class="block text-xs font-bold text-hk-text mb-1">Dia do seu Salário (Início da Contagem)</label>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs text-hk-muted">Todo dia</span>
            <input
              v-model.number="salaryDay"
              type="number"
              min="1"
              max="31"
              class="w-16 px-3 py-1.5 text-center font-bold text-sm bg-white border border-pink-300 rounded-xl text-hk-pink-dark focus:outline-none"
            />
            <span class="text-xs text-hk-muted">do mês</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1">
          <span v-if="saveSuccess" class="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <Check class="w-4 h-4" /> Salvo com sucesso!
          </span>
          <span v-else></span>

          <HKButton variant="primary" size="sm" :loading="isSaving" @click="handleUpdateSettings">
            Salvar Preferência
          </HKButton>
        </div>
      </div>
    </HKCard>

    <!-- Atalho de Instalação PWA -->
    <HKCard>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-hk-pink-primary">
            <Download class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-xs text-hk-text">Instalar no Celular</h4>
            <p class="text-[11px] text-hk-muted">Adicione o ícone na tela inicial</p>
          </div>
        </div>

        <HKButton variant="secondary" size="sm" @click="installPromptRef?.showGuide()">
          Ver Como
        </HKButton>
      </div>
    </HKCard>

    <HKInstallPrompt ref="installPromptRef" />

    <!-- Botão de Sair da Conta -->
    <div class="pt-4">
      <HKButton variant="outline" block size="lg" @click="handleLogout">
        <LogOut class="w-4 h-4 mr-1.5" />
        Sair da Minha Conta
      </HKButton>
    </div>

  </div>
</template>
