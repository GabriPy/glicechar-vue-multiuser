<template>
  <Transition name="slide-up">
    <div v-if="showBanner" class="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-6 flex items-center justify-center pointer-events-none">
      <div class="max-w-4xl w-full bg-base-300/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6 pointer-events-auto">
        <!-- Icon & Content -->
        <div class="flex-1 flex items-start gap-4 text-center md:text-left">
          <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0 hidden md:flex">
            <i class="fi fi-sr-shield-check"></i>
          </div>
          <div class="space-y-2">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] italic">{{ $t('app.legal') }}</h3>
            <p class="text-xs md:text-sm font-bold opacity-60 leading-relaxed max-w-2xl">
              {{ $t('app.cookie_banner_text') }}
              <router-link to="/legal" class="text-primary hover:underline ml-1 font-black">{{ $t('app.cookie_privacy') }}</router-link>
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 shrink-0">
          <button @click="acceptCookies" class="btn btn-primary btn-md rounded-2xl px-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            {{ $t('app.accept') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showBanner = ref(false)

onMounted(() => {
  const consent = localStorage.getItem('cookie_consent')
  if (!consent) {
    // Mostra il banner dopo un piccolo delay
    setTimeout(() => {
      showBanner.value = true
    }, 1500)
  }
})

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'true')
  showBanner.value = false
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%) scale(0.9);
}
</style>
