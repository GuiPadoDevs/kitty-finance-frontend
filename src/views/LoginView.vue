<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock, Eye, EyeOff, Sparkles, Heart } from 'lucide-vue-next'
import HKCard from '@/components/common/HKCard.vue'
import HKButton from '@/components/common/HKButton.vue'
import HKBow from '@/components/common/HKBow.vue'
import HKKittyFace from '@/components/common/HKKittyFace.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref<string | null>(null)

async function handleLogin() {
  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Por favor, preencha todos os campos 🎀'
    return
  }

  errorMessage.value = null
  const success = await authStore.login(email.value.trim(), password.value.trim())
  if (success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = authStore.authError || 'E-mail ou senha inválidos'
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
    
    <!-- Elementos Decorativos de Fundo -->
    <div class="absolute -top-12 -left-12 w-48 h-48 bg-pink-200/40 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-12 -right-12 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-sm relative z-10 space-y-6">
      
      <!-- Cabeçalho com Hello Kitty e Laço -->
      <div class="text-center space-y-2">
        <div class="inline-flex relative">
          <div class="w-24 h-24 bg-white rounded-3xl border-2 border-pink-200 shadow-hk-md flex items-center justify-center relative">
            <HKKittyFace :size="72" />
            <div class="absolute -top-3 -right-3">
              <HKBow :size="32" animated />
            </div>
          </div>
        </div>

        <div>
          <h1 class="text-2xl font-extrabold text-hk-text tracking-tight flex items-center justify-center gap-1.5">
            Finanças da Sah 🎀
          </h1>
          <p class="text-xs text-hk-muted mt-0.5">
            Seu organizador financeiro fofo e inteligente ✨
          </p>
        </div>
      </div>

      <!-- Card de Formulário -->
      <HKCard class="shadow-hk-lg border-pink-200">
        <form @submit.prevent="handleLogin" class="space-y-4">
          
          <!-- Alerta de Erro -->
          <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-bold text-center animate-fade-in">
            {{ errorMessage }}
          </div>

          <!-- Campo E-mail -->
          <div>
            <label class="block text-xs font-bold text-hk-text mb-1.5">Seu E-mail 🌸</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-hk-pink-primary">
                <Mail class="w-4 h-4" />
              </div>
              <input
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="seuemail@exemplo.com"
                class="w-full pl-10 pr-4 py-3 bg-pink-50/40 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-hk-pink-primary/40 focus:bg-white text-hk-text transition-all placeholder:text-pink-300"
              />
            </div>
          </div>

          <!-- Campo Senha -->
          <div>
            <label class="block text-xs font-bold text-hk-text mb-1.5">Sua Senha Segura 🔒</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-hk-pink-primary">
                <Lock class="w-4 h-4" />
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full pl-10 pr-11 py-3 bg-pink-50/40 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-hk-pink-primary/40 focus:bg-white text-hk-text transition-all placeholder:text-pink-300"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-hk-muted hover:text-hk-pink-dark transition-colors"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Botão de Entrar -->
          <div class="pt-2">
            <HKButton
              variant="primary"
              block
              size="lg"
              type="submit"
              :loading="authStore.isLoading"
            >
              <Sparkles class="w-4 h-4 mr-2" />
              Entrar no Meu App 🎀
            </HKButton>
          </div>

        </form>
      </HKCard>

      <!-- Alternar para Cadastro -->
      <div class="text-center">
        <p class="text-xs text-hk-muted">
          Ainda não tem sua continha?
          <router-link to="/register" class="font-bold text-hk-pink-dark hover:underline ml-1 inline-flex items-center gap-0.5">
            Criar Conta Aqui <Heart class="w-3 h-3 fill-current inline" />
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>
