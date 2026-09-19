<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Share, PlusSquare, Download, CheckCircle2 } from 'lucide-vue-next'
import HKBottomSheet from './HKBottomSheet.vue'
import HKButton from './HKButton.vue'
import HKBow from './HKBow.vue'
import HKKittyFace from './HKKittyFace.vue'

const isOpen = ref(false)
const isIOS = computed(() => /iPad|iPhone|iPod/.test(navigator.userAgent))
const isStandalone = ref(false)
const deferredPrompt = ref<any>(null)

onMounted(() => {
  // Verifica se já está em modo PWA Standalone (instalado)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
  isStandalone.value = !!isPWA

  // Captura evento de instalação do Chrome no Android
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})

function showGuide() {
  isOpen.value = true
}

async function installAndroid() {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      isOpen.value = false
    }
    deferredPrompt.value = null
  }
}

defineExpose({
  showGuide
})
</script>

<template>
  <div>
    <!-- Banner discreto se ainda não estiver instalado -->
    <div
      v-if="!isStandalone"
      @click="showGuide"
      class="bg-gradient-to-r from-pink-100 via-pink-50 to-pink-100 border border-pink-200/80 rounded-2xl p-3 mb-4 flex items-center justify-between cursor-pointer shadow-sm active:scale-98 transition-transform"
    >
      <div class="flex items-center gap-2.5">
        <HKBow :size="22" animated />
        <div>
          <p class="text-xs font-bold text-hk-text">Instale na sua Tela de Início 📱</p>
          <p class="text-[11px] text-hk-muted">Use como um app nativo no celular</p>
        </div>
      </div>
      <span class="text-xs font-bold text-hk-pink-primary bg-white px-2.5 py-1 rounded-full border border-pink-200">
        Ver Como
      </span>
    </div>

    <!-- Modal com Guia Passo a Passo -->
    <HKBottomSheet v-model="isOpen" title="Adicionar Finanças Sah ao Celular 🎀" showBow>
      <div class="space-y-4 text-center">
        
        <div class="flex justify-center my-2">
          <div class="w-20 h-20 bg-pink-100 rounded-3xl border-2 border-pink-300 shadow-md flex items-center justify-center relative">
            <HKKittyFace :size="60" />
            <div class="absolute -top-2 -right-2">
              <HKBow :size="24" />
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-bold text-base text-hk-text">Finanças da Sah no seu Celular 🌸</h4>
          <p class="text-xs text-hk-muted mt-1 leading-relaxed">
            Tenha acesso rápido direto da sua tela inicial como um aplicativo, sem precisar baixar de lojas!
          </p>
        </div>

        <!-- Passo a Passo iPhone (Safari) -->
        <div v-if="isIOS" class="bg-pink-50/70 border border-pink-200 rounded-2xl p-4 text-left space-y-3">
          <p class="text-xs font-bold text-hk-pink-dark">No iPhone (Safari):</p>
          
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-white border border-pink-300 flex items-center justify-center shrink-0 mt-0.5">
              <span class="text-xs font-bold text-hk-pink-primary">1</span>
            </div>
            <p class="text-xs text-hk-text">
              Toque no botão <strong>Compartilhar</strong> <Share class="inline w-3.5 h-3.5 text-blue-500 mb-0.5" /> na barra inferior do Safari.
            </p>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-white border border-pink-300 flex items-center justify-center shrink-0 mt-0.5">
              <span class="text-xs font-bold text-hk-pink-primary">2</span>
            </div>
            <p class="text-xs text-hk-text">
              Role a lista e escolha <strong>"Adicionar à Tela de Início"</strong> <PlusSquare class="inline w-3.5 h-3.5 text-gray-700 mb-0.5" />.
            </p>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-white border border-pink-300 flex items-center justify-center shrink-0 mt-0.5">
              <span class="text-xs font-bold text-hk-pink-primary">3</span>
            </div>
            <p class="text-xs text-hk-text">
              Toque em <strong>Adicionar</strong> no canto superior direito. Prontinho! 🎀
            </p>
          </div>
        </div>

        <!-- Passo a Passo Android (Chrome) -->
        <div v-else class="bg-pink-50/70 border border-pink-200 rounded-2xl p-4 text-left space-y-3">
          <p class="text-xs font-bold text-hk-pink-dark">No Android (Chrome):</p>
          
          <div v-if="deferredPrompt" class="text-center py-2">
            <HKButton variant="primary" block @click="installAndroid">
              <Download class="w-4 h-4 mr-1.5" />
              Instalar Aplicativo Agora
            </HKButton>
          </div>

          <div v-else class="space-y-2">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-white border border-pink-300 flex items-center justify-center shrink-0">
                <span class="text-xs font-bold text-hk-pink-primary">1</span>
              </div>
              <p class="text-xs text-hk-text">
                Toque nos <strong>três pontinhos ⋮</strong> no canto superior do navegador Chrome.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-white border border-pink-300 flex items-center justify-center shrink-0">
                <span class="text-xs font-bold text-hk-pink-primary">2</span>
              </div>
              <p class="text-xs text-hk-text">
                Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
              </p>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <HKButton variant="secondary" block @click="isOpen = false">
            <CheckCircle2 class="w-4 h-4 mr-1.5" />
            Entendi, obrigada! 🌸
          </HKButton>
        </div>

      </div>
    </HKBottomSheet>
  </div>
</template>
