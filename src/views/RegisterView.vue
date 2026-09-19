<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User as UserIcon, Mail, Lock, Calendar, Sparkles, Heart } from 'lucide-vue-next'
import HKCard from '@/components/common/HKCard.vue'
import HKButton from '@/components/common/HKButton.vue'
import HKBow from '@/components/common/HKBow.vue'
import HKKittyFace from '@/components/common/HKKittyFace.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const salaryDay = ref(5)
const errorMessage = ref<string | null>(null)

async function handleRegister() {
  if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Por favor, preencha todos os campos obrigatórios 🎀'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Sua senha deve ter no mínimo 6 caracteres 🌸'
    return
  }

  errorMessage.value = null
  const success = await authStore.register(
    name.value.trim(),
    email.value.trim(),
    password.value.trim(),
    Number(salaryDay.value) || 5
  )

  if (success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = authStore.authError || 'Erro ao criar conta'
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
    
    <!-- Elementos Decorativos -->
    <div class="absolute -top-12 -right-12 w-48 h-48 bg-pink-200/40 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-sm relative z-10 space-y-5">
      
      <!-- Cabeçalho -->
      <div class="text-center space-y-2">
        <div class="inline-flex relative">
          <div class="w-20 h-20 bg-white rounded-3xl border-2 border-pink-200 shadow-hk-md flex items-center justify-center relative">
            <HKKittyFace :size="60" />
            <div class="absolute -top-2 -right-2">
              <HKBow :size="28" animated />
            </div>
          </div>
        </div>

        <div>
          <h1 class="text-2xl font-extrabold text-hk-text tracking-tight">
            Criar Minha Conta 🌸
          </h1>
          <p class="text-xs text-hk-muted mt-0.5">
            Personalizado especialmente para você! 🎀
          </p>
        </div>
      </div>

      <!-- Card de Cadastro -->
      <HKCard class="shadow-hk-lg border-pink-200">
        <form @submit.prevent="handleRegister" class="space-y-3.5">
          
          <!-- Mensagem de Erro -->
          <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-bold text-center animate-fade-in">
            {{ errorMessage }}
          </div>

          <!-- Nome -->
          <div>
            <label class="block text-xs font-bold text-hk-text mb-1">Seu Nome / Apelido 🎀</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-hk-pink-primary">
                <UserIcon class="w-4 h-4" />
              </div>
              <input
                v-model="name"
                type="text"
                required
                placeholder="Ex: Sah 🎀"
                class="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-hk-pink-primary/40 focus:bg-white text-hk-text transition-all placeholder:text-pink-300"
              />
            </div>
          </div>

          <!-- E-mail -->
          <div>
            <label class="block text-xs font-bold text-hk-text mb-1">Seu E-mail 🌸</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-hk-pink-primary">
                <Mail class="w-4 h-4" />
              </div>
              <input
                v-model="email"
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                class="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-hk-pink-primary/40 focus:bg-white text-hk-text transition-all placeholder:text-pink-300"
              />
            </div>
          </div>

          <!-- Senha -->
          <div>
            <label class="block text-xs font-bold text-hk-text mb-1">Crie uma Senha 🔒</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-hk-pink-primary">
                <Lock class="w-4 h-4" />
              </div>
              <input
                v-model="password"
                type="password"
                required
                placeholder="No mínimo 6 caracteres"
                class="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-hk-pink-primary/40 focus:bg-white text-hk-text transition-all placeholder:text-pink-300"
              />
            </div>
          </div>

          <!-- Dia de Recebimento do Salário / Início de Ciclo -->
          <div class="bg-pink-50/60 p-3 rounded-2xl border border-pink-200/80">
            <label class="block text-xs font-bold text-hk-text mb-1 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-hk-pink-primary" />
              Dia do seu Salário (Início do Mês Financeiro) 📅
            </label>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-hk-muted">Todo dia</span>
              <input
                v-model.number="salaryDay"
                type="number"
                min="1"
                max="31"
                required
                class="w-16 px-3 py-1.5 text-center font-bold text-sm bg-white border border-pink-300 rounded-xl text-hk-pink-dark focus:outline-none focus:ring-2 focus:ring-hk-pink-primary"
              />
              <span class="text-xs text-hk-muted">do mês</span>
            </div>
            <p class="text-[10px] text-hk-muted mt-1 leading-tight">
              O app calculará seu ciclo a partir desse dia até o próximo mês! ✨
            </p>
          </div>

          <!-- Botão Cadastrar -->
          <div class="pt-2">
            <HKButton
              variant="primary"
              block
              size="lg"
              type="submit"
              :loading="authStore.isLoading"
            >
              <Sparkles class="w-4 h-4 mr-1.5" />
              Criar Conta e Começar 🎀
            </HKButton>
          </div>

        </form>
      </HKCard>

      <!-- Alternar para Login -->
      <div class="text-center">
        <p class="text-xs text-hk-muted">
          Já tem sua conta criada?
          <router-link to="/login" class="font-bold text-hk-pink-dark hover:underline ml-1 inline-flex items-center gap-0.5">
            Entrar Aqui <Heart class="w-3 h-3 fill-current inline" />
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>
