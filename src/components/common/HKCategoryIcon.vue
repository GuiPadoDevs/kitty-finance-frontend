<script setup lang="ts">
import { computed } from 'vue'
import {
  Sparkles,
  Briefcase,
  CreditCard,
  ShoppingCart,
  Heart,
  Gift,
  Home,
  Coffee,
  Smile,
  Star,
  Scissors,
  Car,
  Utensils,
  ShoppingBag,
  Zap,
  Music,
  Camera,
  Shirt,
} from 'lucide-vue-next'

interface Props {
  name: string
  size?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  className: '',
})

const iconComponent = computed(() => {
  switch (props.name) {
    case 'briefcase':
      return Briefcase
    case 'credit-card':
      return CreditCard
    case 'shopping-cart':
      return ShoppingCart
    case 'shopping-bag':
      return ShoppingBag
    case 'heart':
      return Heart
    case 'gift':
      return Gift
    case 'home':
      return Home
    case 'coffee':
      return Coffee
    case 'smile':
      return Smile
    case 'star':
      return Star
    case 'scissors':
      return Scissors
    case 'car':
      return Car
    case 'utensils':
      return Utensils
    case 'zap':
      return Zap
    case 'music':
      return Music
    case 'camera':
      return Camera
    case 'shirt':
      return Shirt
    case 'sparkles':
    default:
      return Sparkles
  }
})
</script>

<template>
  <component :is="iconComponent" :size="size" :class="className" />
</template>
