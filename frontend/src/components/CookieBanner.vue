<template>
  <Transition name="slide-up">
    <div v-if="showBanner" class="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-8 flex items-center justify-center pointer-events-none">
      <div class="max-w-5xl w-full bg-base-300/90 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center gap-10 pointer-events-auto relative overflow-hidden group">
        <!-- Background Glow -->
        <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>

        <!-- Icon & Content -->
        <div class="flex-1 flex items-start gap-6 text-center md:text-left relative z-10">
          <div class="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary text-3xl shrink-0 hidden md:flex shadow-inner">
            <i class="fi fi-sr-shield-check"></i>
          </div>
          <div class="space-y-4">
            <div class="flex items-center gap-3 justify-center md:justify-start">
              <span class="badge badge-primary badge-outline font-black uppercase tracking-[0.3em] px-4 py-3">Legal Compliance</span>
              <h3 class="text-xs font-black uppercase tracking-[0.2em] italic opacity-40">{{ $t('app.legal') }}</h3>
            </div>
            <p class="text-sm md:text-base font-bold opacity-70 leading-relaxed max-w-3xl">
              {{ $t('app.cookie_banner_text') }}
              <router-link to="/legal" class="text-primary hover:text-primary-focus transition-colors ml-2 font-black underline decoration-primary/20 underline-offset-8 decoration-2 hover:decoration-primary">
                {{ $t('app.cookie_privacy') }}
              </router-link>
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4 shrink-0 relative z-10">
          <button @click="acceptCookies" class="btn btn-primary btn-lg rounded-2xl px-16 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all border-none">
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
    // Mostra il banner dopo un piccolo delay per effetto sorpresa
    setTimeout(() => {
      showBanner.value = true
    }, 1200)
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
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(120%) scale(0.9);
}
</style>
